import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { assembleSoulPrompt, getLoadedLayers } from '@/lib/8gent/soul-layers';
import { parseToolCalls, ToolCall, toOpenAITools } from '@/lib/8gent/tools';
import { executeTool, formatToolResults } from '@/lib/8gent/tool-executor';
import { MemoryManager } from '@/lib/memory';
import { verifySession, ADMIN_COOKIE } from '@/lib/passcodeAuth';
import { checkRateLimit, getClientIp } from '@/lib/security';
import {
  AccessLevel,
  getToolsForAccessLevel,
  filterToolCalls,
  describeAccessLevel,
} from '@/lib/8gent/access-control';
import { OllamaClient, type OllamaChatRequest, type OllamaMessage } from '@/lib/ollama';
import { getLynkrClient, type LynkrMessage } from '@/lib/lynkr';
import { auth } from '@/lib/openclaw/auth-server';

// Rate limits: authenticated users get higher limits
const PUBLIC_RATE_LIMIT = { windowMs: 60 * 1000, maxRequests: 10 };
const AUTH_RATE_LIMIT = { windowMs: 60 * 1000, maxRequests: 60 };

// Local LLM timeout (30 seconds) before fallback to cloud
const LOCAL_LLM_TIMEOUT = 30000;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIProviderSettings {
  primaryProvider: 'cloud' | 'local' | 'lynkr';
  fallbackProvider?: 'cloud' | 'local' | 'lynkr' | 'none';
  ollamaBaseUrl?: string;
  ollamaDefaultModel?: string;
  ollamaTimeout?: number;
  // Lynkr settings (for local models from anywhere)
  lynkrEnabled?: boolean;
  lynkrTunnelUrl?: string;
  lynkrApiKey?: string;
  lynkrDefaultModel?: string;
}

interface ProviderResult {
  content: string;
  provider: 'openai' | 'ollama' | 'lynkr';
  model: string;
  fallbackUsed: boolean;
  fallbackReason?: string;
}

// User identity is now the AccessLevel type from access-control.ts
// Owner userId should come from authenticated session, not hardcoded

// Initialize memory manager
const memoryManager = new MemoryManager();

/**
 * Determine user identity from session
 * Returns AccessLevel and userId from the actual session
 */
async function getUserIdentity(): Promise<{ accessLevel: AccessLevel; userId: string | null }> {
  try {
    // First check for Clerk authentication (primary auth)
    const { userId: clerkUserId } = await auth();

    if (clerkUserId) {
      // Assume owner for now in 8gent single-user mode
      return { accessLevel: 'owner', userId: clerkUserId };
    }

    // Fallback: Check for legacy admin cookie (passcode auth)
    const cookieStore = await cookies();
    const adminToken = cookieStore.get(ADMIN_COOKIE)?.value;

    if (adminToken) {
      const session = verifySession(adminToken);
      if (session && session.type === 'admin') {
        const userId = `admin-${session.subject}`;
        return { accessLevel: 'owner', userId };
      }
    }

    return { accessLevel: 'visitor', userId: null };
  } catch (e) {
    console.error('[Auth] Error determining user identity:', e);
    return { accessLevel: 'visitor', userId: null };
  }
}

/**
 * Fetch AI provider settings
 * Only fetches for owner; returns default cloud settings for others
 */
async function getAIProviderSettings(accessLevel: AccessLevel): Promise<AIProviderSettings> {
  // Default to cloud for non-owners
  if (accessLevel !== 'owner') {
    return { primaryProvider: 'cloud' };
  }

  // Use environment variables for default settings in 8gent
  return {
    primaryProvider: 'cloud', // Default to cloud for reliability
    // Could load from localStorage passed in headers or similar if needed
  };
}

/**
 * Call Ollama for local LLM inference
 */
async function callOllama(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string,
  settings: AIProviderSettings
): Promise<string> {
  const client = new OllamaClient({
    baseUrl: settings.ollamaBaseUrl ?? process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
    timeout: settings.ollamaTimeout ?? LOCAL_LLM_TIMEOUT,
    defaultModel: settings.ollamaDefaultModel ?? process.env.OLLAMA_DEFAULT_MODEL ?? 'gpt-oss:20b',
  });

  // Convert messages to Ollama format
  const ollamaMessages: OllamaMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    })),
  ];

  const response = await client.chat({
    model: settings.ollamaDefaultModel ?? 'gpt-oss:20b',
    messages: ollamaMessages,
  });

  return response.message.content;
}

/**
 * Call Lynkr for local LLM inference via tunnel (works from anywhere)
 * Uses the Cloudflare tunnel to route to local Ollama
 */
async function callLynkr(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string,
  settings: AIProviderSettings
): Promise<string> {
  // Validate Lynkr settings
  if (!settings.lynkrTunnelUrl) {
    throw new Error('Lynkr tunnel URL not configured');
  }
  if (!settings.lynkrApiKey) {
    throw new Error('Lynkr API key not configured');
  }

  console.log(`[Lynkr] Connecting via tunnel: ${settings.lynkrTunnelUrl}`);

  const client = getLynkrClient({
    baseUrl: settings.lynkrTunnelUrl,
    apiKey: settings.lynkrApiKey,
    defaultModel: settings.lynkrDefaultModel ?? 'gpt-oss:20b',
    timeout: settings.ollamaTimeout ?? LOCAL_LLM_TIMEOUT,
    // Skip validation for tunnel URLs (they're external)
    skipSsrfValidation: true,
  });

  // Convert messages to Lynkr/Anthropic format
  const lynkrMessages: LynkrMessage[] = messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const response = await client.chat({
    messages: lynkrMessages,
    system: systemPrompt,
    model: settings.lynkrDefaultModel ?? 'gpt-oss:20b',
    max_tokens: 4096,
    temperature: 0.7,
  });

  // Extract text content from the response
  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('Lynkr response did not contain text content');
  }

  console.log(`[Lynkr] Response received, model: ${response.model}`);
  return textContent.text;
}

/**
 * Call OpenAI for cloud LLM inference
 */
async function callOpenAI(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string,
  tools?: unknown[]
): Promise<{ content: string; toolCalls?: unknown[] }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const openAIMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.content,
    })),
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: openAIMessages,
      tools: tools && tools.length > 0 ? tools : undefined,
      tool_choice: tools && tools.length > 0 ? 'auto' : undefined,
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  const assistantMessage = data.choices[0]?.message;

  return {
    content: assistantMessage?.content || '',
    toolCalls: assistantMessage?.tool_calls,
  };
}

/**
 * Route to the appropriate AI provider with fallback support
 */
async function routeToProvider(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string,
  settings: AIProviderSettings,
  tools?: unknown[]
): Promise<ProviderResult> {
  console.log('[routeToProvider] Settings received:', {
    primaryProvider: settings.primaryProvider,
    lynkrTunnelUrl: settings.lynkrTunnelUrl ? 'SET' : 'NOT SET',
    lynkrApiKey: settings.lynkrApiKey ? 'SET' : 'NOT SET',
  });

  // If primary is cloud, use OpenAI directly
  if (settings.primaryProvider === 'cloud') {
    try {
      const result = await callOpenAI(messages, systemPrompt, tools);
      return {
        content: result.content,
        provider: 'openai',
        model: 'gpt-4o',
        fallbackUsed: false,
      };
    } catch (error) {
      // Cloud failed with no fallback
      throw error;
    }
  }

  // If primary is lynkr, use Lynkr via tunnel (local models from anywhere)
  if (settings.primaryProvider === 'lynkr') {
    try {
      console.log('[AI Provider] Using Lynkr (local models via tunnel)...');
      const content = await callLynkr(messages, systemPrompt, settings);
      return {
        content,
        provider: 'lynkr',
        model: settings.lynkrDefaultModel ?? 'gpt-oss:20b',
        fallbackUsed: false,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn('[AI Provider] Lynkr failed:', errorMessage);

      // Check if fallback is explicitly enabled to 'cloud'
      if (settings.fallbackProvider === 'cloud') {
        console.log('[AI Provider] Falling back to cloud (OpenAI)...');
        try {
          const result = await callOpenAI(messages, systemPrompt, tools);
          return {
            content: result.content,
            provider: 'openai',
            model: 'gpt-4o',
            fallbackUsed: true,
            fallbackReason: `Lynkr failed: ${errorMessage}`,
          };
        } catch (fallbackError) {
          throw new Error(`Both Lynkr and cloud providers failed. Lynkr: ${errorMessage}, Cloud: ${fallbackError}`);
        }
      }

      // No fallback enabled - throw the Lynkr error directly
      throw new Error(`Lynkr failed: ${errorMessage}`);
    }
  }

  // Primary is local (Ollama direct connection)
  try {
    console.log('[AI Provider] Using local Ollama (direct)...');
    const content = await callOllama(messages, systemPrompt, settings);
    return {
      content,
      provider: 'ollama',
      model: settings.ollamaDefaultModel ?? 'gpt-oss:20b',
      fallbackUsed: false,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[AI Provider] Ollama failed:', errorMessage);

    // Check if fallback is explicitly enabled to 'cloud'
    if (settings.fallbackProvider === 'cloud') {
      console.log('[AI Provider] Falling back to cloud (OpenAI)...');
      try {
        const result = await callOpenAI(messages, systemPrompt, tools);
        return {
          content: result.content,
          provider: 'openai',
          model: 'gpt-4o',
          fallbackUsed: true,
          fallbackReason: `Local LLM failed: ${errorMessage}`,
        };
      } catch (fallbackError) {
        throw new Error(`Both local and cloud providers failed. Local: ${errorMessage}, Cloud: ${fallbackError}`);
      }
    }

    // No fallback enabled - throw the Ollama error directly
    throw new Error(`Local LLM failed: ${errorMessage}`);
  }
}

/**
 * App context payload type (used by soul-layers.ts for prompt assembly)
 */
interface AppContextPayload {
  appId: string;
  appName: string;
  route: string;
  description: string;
  contextHints: string[];
}

// Identity context is now handled by soul-layers.ts
// Each access tier loads different prompt layers (base / professional / private)

interface ToolCallResponse {
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

// TPMJS tool definitions for OpenAI function calling
const TPMJS_TOOL_DEFINITIONS = [
  {
    name: 'search_tpmjs_tools',
    description: 'Search the TPMJS registry for available tools. Use this to find tools that can help with specific tasks like web scraping, image processing, data transformation, etc.',
    parameters: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string' as const,
          description: 'Search query to find relevant tools (e.g., "web scraping", "image resize", "json transform")',
        },
        category: {
          type: 'string' as const,
          description: 'Optional category filter (e.g., "web-scraping", "image-processing", "ai-models")',
        },
        limit: {
          type: 'number' as const,
          description: 'Maximum number of results to return (default: 10)',
        },
      },
      required: ['query'] as string[],
    },
  },
  {
    name: 'execute_tpmjs_tool',
    description: 'Execute a tool from the TPMJS registry. First use search_tpmjs_tools to find the right tool, then execute it with the required parameters.',
    parameters: {
      type: 'object' as const,
      properties: {
        toolId: {
          type: 'string' as const,
          description: 'The tool ID in format "packageName::toolName" (e.g., "web-scraper::fetch_page")',
        },
        params: {
          type: 'object' as const,
          description: 'Parameters to pass to the tool (varies by tool)',
        },
        env: {
          type: 'object' as const,
          description: 'Optional environment variables for the tool execution',
        },
      },
      required: ['toolId', 'params'] as string[],
    },
  },
  {
    name: 'check_tpmjs_executor',
    description: 'Check the health and status of the TPMJS executor service. Use this to verify the executor is available before running tools.',
    parameters: {
      type: 'object' as const,
      properties: {} as Record<string, { type: string; description: string }>,
      required: [] as string[],
    },
  },
];

interface SelectedTool {
  name: string;
  provider: 'legacy' | 'tpmjs';
}

/**
 * Execute a TPMJS tool by name
 * This bridges the AI function calling to the TPMJS client
 */
async function executeTPMJSTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  // Dynamic import to avoid loading TPMJS client unless needed
  const { getTPMJSClient } = await import('@/lib/tpmjs/client');
  const client = getTPMJSClient();

  switch (toolName) {
    case 'search_tpmjs_tools': {
      const result = await client.searchTools(
        args.query as string,
        {
          category: args.category as string | undefined,
          limit: args.limit as number | undefined,
        }
      );
      return {
        tools: result.tools.map(t => ({
          id: t.toolId || `${t.packageName}::${t.toolName}`,
          name: t.name || t.toolName,
          description: t.description,
          category: t.category,
          qualityScore: t.qualityScore,
        })),
        total: result.total,
      };
    }

    case 'execute_tpmjs_tool': {
      const result = await client.executeTool(
        args.toolId as string,
        args.params as Record<string, unknown>,
        args.env as Record<string, string> | undefined
      );
      return result;
    }

    case 'check_tpmjs_executor': {
      const health = await client.checkExecutorHealth();
      return health;
    }

    default:
      throw new Error(`Unknown TPMJS tool: ${toolName}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages, model, theme, projectId, appContext, channel, accessLevel: requestAccessLevel, enableTools, selectedTools } = await request.json() as {
      messages: ChatMessage[];
      model?: string;
      theme?: string;
      projectId?: string;
      appContext?: AppContextPayload;
      channel?: string;
      accessLevel?: string;
      enableTools?: boolean;
      selectedTools?: SelectedTool[];
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Determine user identity from session
    let { accessLevel, userId } = await getUserIdentity();

    // Allow channel-specific access level override (e.g., WhatsApp contacts)
    // Only trust this if it's from a server-side channel integration
    if (channel === 'whatsapp' && requestAccessLevel) {
      accessLevel = requestAccessLevel as AccessLevel;
      console.log(`[Chat API] Using WhatsApp contact access level: ${accessLevel}`);
    }

    // SECURITY: Rate limiting based on access level
    const clientIp = getClientIp(request);
    const rateLimitConfig = accessLevel === 'owner' ? AUTH_RATE_LIMIT : PUBLIC_RATE_LIMIT;
    const rateLimit = checkRateLimit(`chat:${clientIp}`, rateLimitConfig);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please wait before making more requests.',
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
          }
        }
      );
    }

    // Fetch AI provider settings (owner only; visitors always get cloud)
    const providerSettings = await getAIProviderSettings(accessLevel);

    // IMPORTANT: Lynkr only works when accessed directly (browser → tunnel → local Mac)
    // It does NOT work from Vercel serverless (Vercel → tunnel → local Mac is blocked)
    // So in production (Vercel), we must use cloud even if Lynkr is primary
    const isVercelProduction = process.env.VERCEL === '1';
    const lynkrUnavailableInProduction = isVercelProduction && providerSettings.primaryProvider === 'lynkr';

    if (lynkrUnavailableInProduction) {
      console.log('[AI Provider] Lynkr unavailable from Vercel - using cloud instead');
    }

    // Determine if we need cloud for tool calling
    // Hybrid approach: Use local for conversation, cloud only when tools are actually needed
    const isLocalPreferred = !lynkrUnavailableInProduction &&
      (providerSettings.primaryProvider === 'local' || providerSettings.primaryProvider === 'lynkr');

    // Keywords that indicate tool usage is likely needed
    const toolTriggerKeywords = [
      'generate music', 'create music', 'make music', 'create a song', 'make a track',
      'cowrite', 'co-write', 'generate_music', 'cowrite_music',
      'schedule', 'book a meeting', 'calendar',
      'navigate to', 'go to', 'open',
      'remember', 'memorize', 'recall',
      'create project', 'create ticket', 'create prd',
      'show kanban', 'list projects',
    ];

    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    const needsToolSupport = enableTools && toolTriggerKeywords.some(kw => lastMessage.includes(kw));

    // Use local UNLESS tools are explicitly needed
    const useLocalProvider = isLocalPreferred && !needsToolSupport;

    if (needsToolSupport && isLocalPreferred) {
      console.log(`[Chat API] Switching to cloud for tool support (trigger detected in: "${lastMessage.substring(0, 50)}...")`);
    }

    // For cloud provider, ensure API key is configured
    if (!useLocalProvider) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: 'OpenAI API key not configured' },
          { status: 500 }
        );
      }
    }

    // Get the last user message for memory search
    const lastUserMessage = messages.filter((m: ChatMessage) => m.role === 'user').pop();
    const userQuery = lastUserMessage?.content || '';

    // Load relevant memories ONLY for owner
    let memoryContext = '';
    if (accessLevel === 'owner' && userId) {
      try {
        const memories = await memoryManager.loadRelevantMemories(
          userId,
          userQuery,
          { projectId: projectId as string | undefined, limit: 10 }
        );
        if (memories.contextSummary) {
          memoryContext = `\n\n## Memory Context\n${memories.contextSummary}`;
        }
      } catch (error) {
        console.error('Failed to load memories:', error);
        // Continue without memory context
      }
    }

    // Build TPMJS tools context if any are selected
    const selectedTpmjsToolNames = selectedTools?.filter(t => t.provider === 'tpmjs').map(t => t.name) || [];
    const tpmjsContextStr = selectedTpmjsToolNames.length > 0
      ? `\n\n## TPMJS Tools Available\nThe user has enabled the following TPMJS registry tools for this session:\n${selectedTpmjsToolNames.map(name => {
        const def = TPMJS_TOOL_DEFINITIONS.find(t => t.name === name);
        return def ? `- **${name}**: ${def.description}` : `- ${name}`;
      }).join('\n')}\n\nYou can use these tools to extend your capabilities. For example, use search_tpmjs_tools to find specialized tools in the registry, then execute_tpmjs_tool to run them.`
      : '';

    // Build provider context string
    const providerContextStr = useLocalProvider
      ? `\n\n## Provider Context\nYou are currently running on LOCAL inference (${providerSettings.primaryProvider === 'lynkr' ? 'Lynkr tunnel to Ollama' : 'Ollama direct'} with ${providerSettings.lynkrDefaultModel ?? providerSettings.ollamaDefaultModel ?? 'gpt-oss:20b'}). This means your responses stay on your machine with zero cloud cost. In local mode, have natural conversations, answer questions, help with ideas. If the user wants to execute an action (generate music, schedule, navigate), encourage them to be specific so you can help - the system will automatically switch to cloud for tool execution when needed.${tpmjsContextStr}`
      : `\n\n## Provider Context\nYou are running on CLOUD inference (OpenAI GPT-4o). Full tool calling and capabilities are available. Use your tools when appropriate - especially cowrite_music and generate_music for music creation requests.${tpmjsContextStr}`;

    // Assemble soul prompt using three-tier architecture
    // Visitor → base layer only. Collaborator → base + professional. Owner → all three.
    // Private context (Nick, 2028 arc, pricing) is never loaded for non-owner tiers.
    const systemPrompt = assembleSoulPrompt({
      accessLevel,
      theme: model || theme,
      appContext: appContext as AppContextPayload | null,
      memoryContext: memoryContext || undefined,
      providerContext: providerContextStr,
    });

    // Log loaded soul layers for security monitoring
    const loadedLayers = getLoadedLayers(accessLevel);
    console.log(`[Soul Layers] Access: ${accessLevel}, Layers: [${loadedLayers.join(', ')}]`);

    // Prepare messages for API call
    const chatMessages = messages.map((m: ChatMessage) => ({
      role: m.role,
      content: m.content,
    }));

    // SECURITY: Get only the tools this access level can use
    let allowedTools = getToolsForAccessLevel(accessLevel);

    // If selectedTools is provided, filter legacy tools to only include selected ones
    // and add TPMJS tools that are selected
    const selectedLegacyTools = selectedTools?.filter(t => t.provider === 'legacy').map(t => t.name) || [];
    const selectedTpmjsTools = selectedTools?.filter(t => t.provider === 'tpmjs').map(t => t.name) || [];

    // Filter legacy tools if specific ones are selected (empty array = use all allowed)
    if (selectedLegacyTools.length > 0) {
      allowedTools = allowedTools.filter(tool => selectedLegacyTools.includes(tool.name));
      console.log(`[Tool Selection] Filtered to ${allowedTools.length} legacy tools:`, selectedLegacyTools);
    }

    // Convert legacy tools to OpenAI format
    let openAITools = toOpenAITools(allowedTools);

    // Add TPMJS tools if selected
    if (selectedTpmjsTools.length > 0) {
      const tpmjsToolsToAdd = selectedTpmjsTools
        .map(tpmjsTool => {
          const toolDef = TPMJS_TOOL_DEFINITIONS.find(t => t.name === tpmjsTool);
          if (!toolDef) return null;
          return {
            type: 'function' as const,
            function: {
              name: toolDef.name,
              description: toolDef.description,
              parameters: toolDef.parameters as {
                type: 'object';
                properties: Record<string, { type: string; description: string }>;
                required: string[];
              },
            },
          };
        })
        .filter((t): t is NonNullable<typeof t> => t !== null);

      // Cast to compatible type for merging
      openAITools = [...openAITools, ...tpmjsToolsToAdd] as typeof openAITools;
      console.log(`[Tool Selection] Added ${tpmjsToolsToAdd.length} TPMJS tools:`, selectedTpmjsTools);
    }

    // Log tool access for monitoring (helpful for security audits)
    const tpmjsToolCount = selectedTpmjsTools.length > 0 ? selectedTpmjsTools.length : 0;
    console.log(`[Access Control] User (${accessLevel}) has access to ${openAITools.length} tools (${allowedTools.length} legacy + ${tpmjsToolCount} TPMJS)`);
    console.log(`[AI Provider] Primary: ${providerSettings.primaryProvider}, Using Local: ${useLocalProvider}`);

    // =========================================================================
    // LOCAL PROVIDER PATH (Ollama) - No tool calling, direct response
    // =========================================================================
    if (useLocalProvider) {
      try {
        const providerResult = await routeToProvider(
          chatMessages,
          systemPrompt,
          providerSettings
          // No tools for local - tool calling not supported
        );

        // Store interaction in memory ONLY for owner (async, non-blocking)
        if (accessLevel === 'owner' && userId) {
          memoryManager.processInteraction(
            userId,
            { userMessage: userQuery, aiResponse: providerResult.content, toolsUsed: [] },
            projectId as string | undefined
          ).catch((err) => console.error('Failed to store memory:', err));
        }

        return NextResponse.json({
          content: providerResult.content,
          message: providerResult.content,
          model: 'claw-ai',
          accessLevel,
          memoryEnabled: accessLevel === 'owner',
          provider: providerResult.provider,
          providerModel: providerResult.model,
          fallbackUsed: providerResult.fallbackUsed,
          fallbackReason: providerResult.fallbackReason,
          toolsEnabled: false, // Local mode doesn't support tools
        });
      } catch (error) {
        console.error('[AI Provider] Local inference failed:', error);
        return NextResponse.json(
          { error: 'Local AI provider failed. Try switching to cloud in Settings.' },
          { status: 500 }
        );
      }
    }

    // =========================================================================
    // CLOUD PROVIDER PATH (OpenAI) - Full tool calling support
    // =========================================================================
    const apiKey = process.env.OPENAI_API_KEY!;

    // Prepare messages for OpenAI
    const openAIMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((m: ChatMessage) => ({
        role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.content,
      })),
    ];

    // First API call - may include tool calls
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: openAIMessages,
        tools: openAITools.length > 0 ? openAITools : undefined,
        tool_choice: openAITools.length > 0 ? 'auto' : undefined,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to get response from OpenAI' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message;

    // Check if the model wants to use tools
    if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      // Parse and execute tool calls
      const toolCalls = parseToolCalls(assistantMessage.tool_calls);

      // TPMJS tool names (these bypass normal access control since user explicitly enabled them)
      const tpmjsToolNames = TPMJS_TOOL_DEFINITIONS.map(t => t.name);

      // Separate TPMJS tools from legacy tools for filtering
      const tpmjsCalls = toolCalls.filter(tc => tpmjsToolNames.includes(tc.name));
      const legacyCalls = toolCalls.filter(tc => !tpmjsToolNames.includes(tc.name));

      // SECURITY: Filter legacy tool calls by access level (defense in depth)
      const { permitted: permittedLegacy, denied } = filterToolCalls(legacyCalls, accessLevel);

      // TPMJS tools are permitted if they were selected (user explicitly enabled them)
      const permittedTpmjs = tpmjsCalls.filter(tc =>
        selectedTpmjsToolNames.includes(tc.name)
      );
      const deniedTpmjs = tpmjsCalls.filter(tc =>
        !selectedTpmjsToolNames.includes(tc.name)
      );

      // Combine permitted tools
      const permitted = [...permittedLegacy, ...permittedTpmjs];

      // Log any denied tool attempts (this shouldn't happen if AI respects its tool list)
      if (denied.length > 0 || deniedTpmjs.length > 0) {
        console.warn(`[SECURITY] Denied tool calls for ${accessLevel}:`, [...denied, ...deniedTpmjs].map(t => t.name));
        // TODO: Log to securityEvents table in Convex for monitoring
      }

      const toolResults = new Map<string, Awaited<ReturnType<typeof executeTool>>>();
      const toolActions: Array<{ type: string; payload: Record<string, unknown> }> = [];

      // Only execute permitted tools
      for (const toolCall of permitted) {
        // Check if this is a TPMJS tool
        if (tpmjsToolNames.includes(toolCall.name)) {
          // Handle TPMJS tool execution
          try {
            const tpmjsResult = await executeTPMJSTool(toolCall.name, toolCall.arguments);
            toolResults.set(toolCall.name, {
              success: true,
              data: tpmjsResult,
            });
            console.log(`[TPMJS] Executed ${toolCall.name}:`, tpmjsResult);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toolResults.set(toolCall.name, {
              success: false,
              error: `TPMJS tool execution failed: ${errorMessage}`,
            });
            console.error(`[TPMJS] Failed to execute ${toolCall.name}:`, error);
          }
        } else {
          // SECURITY: Pass userId to executeTool for proper authorization
          const result = await executeTool(toolCall, { userId, accessLevel });
          toolResults.set(toolCall.name, result);
          if (result.action) {
            toolActions.push(result.action);
          }
        }
      }

      // Add error results for denied tools (both legacy and TPMJS)
      for (const toolCall of denied) {
        toolResults.set(toolCall.name, {
          success: false,
          error: `Access denied: Tool '${toolCall.name}' requires higher access level than '${accessLevel}'`,
        });
      }
      for (const toolCall of deniedTpmjs) {
        toolResults.set(toolCall.name, {
          success: false,
          error: `TPMJS tool '${toolCall.name}' was not enabled in the current session`,
        });
      }

      // Build tool results messages for second API call
      const toolResultMessages = assistantMessage.tool_calls.map(
        (tc: { id: string; function: { name: string } }) => ({
          role: 'tool' as const,
          tool_call_id: tc.id,
          content: JSON.stringify(toolResults.get(tc.function.name)?.data || {}),
        })
      );

      // Second API call with tool results
      const secondResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            ...openAIMessages,
            {
              role: 'assistant',
              // IMPORTANT: content can be null when tool_calls are present
              // OpenAI requires an empty string, not null
              content: assistantMessage.content || '',
              tool_calls: assistantMessage.tool_calls,
            },
            ...toolResultMessages,
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!secondResponse.ok) {
        const error = await secondResponse.json();
        console.error('OpenAI API error (second call):', error);
        return NextResponse.json(
          { error: 'Failed to get response from OpenAI' },
          { status: 500 }
        );
      }

      const secondData = await secondResponse.json();
      const finalMessage = secondData.choices[0]?.message?.content || 'No response generated';
      const toolNames = toolCalls.map((tc) => tc.name);

      // Store interaction in memory ONLY for owner (async, non-blocking)
      if (accessLevel === 'owner' && userId) {
        memoryManager.processInteraction(
          userId,
          { userMessage: userQuery, aiResponse: finalMessage, toolsUsed: toolNames },
          projectId as Id<"productProjects"> | undefined
        ).catch((err) => console.error('Failed to store memory:', err));
      }

      // Include both permitted and denied tools in response (for transparency)
      const allDenied = [...denied, ...deniedTpmjs];
      const allToolResults = [...permitted, ...allDenied].map((tc) => ({
        name: tc.name,
        arguments: tc.arguments,
        result: toolResults.get(tc.name),
      }));

      return NextResponse.json({
        content: finalMessage,
        message: finalMessage,
        model: 'claw-ai',
        accessLevel,
        toolsUsed: allToolResults,
        actions: toolActions,
        memoryEnabled: accessLevel === 'owner',
        deniedTools: allDenied.length > 0 ? allDenied.map(t => t.name) : undefined,
        tpmjsToolsEnabled: selectedTpmjsToolNames.length > 0 ? selectedTpmjsToolNames : undefined,
        provider: 'openai',
        providerModel: 'gpt-4o',
        fallbackUsed: false,
        toolsEnabled: true,
      });
    }

    // No tool calls - return direct response
    const messageContent = assistantMessage?.content || 'No response generated';

    // Store interaction in memory ONLY for owner (async, non-blocking)
    if (accessLevel === 'owner' && userId) {
      memoryManager.processInteraction(
        userId,
        { userMessage: userQuery, aiResponse: messageContent, toolsUsed: [] },
        projectId as Id<"productProjects"> | undefined
      ).catch((err) => console.error('Failed to store memory:', err));
    }

    return NextResponse.json({
      content: messageContent,
      message: messageContent,
      model: 'claw-ai',
      accessLevel,
      memoryEnabled: accessLevel === 'owner',
      provider: 'openai',
      providerModel: 'gpt-4o',
      fallbackUsed: false,
      toolsEnabled: true,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
