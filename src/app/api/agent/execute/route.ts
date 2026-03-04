/**
 * Agent Execution API Route - LOCAL FIRST
 *
 * This route handles autonomous agent task execution using LOCAL models via Lynkr.
 * Like OpenClaw, it prioritizes local execution for:
 * - Privacy (data stays on your machine)
 * - Cost (zero API costs)
 * - Speed (no network latency to cloud)
 *
 * Provider Priority:
 * 1. Lynkr (local Ollama via tunnel) - PRIMARY
 * 2. Direct Ollama (localhost) - FALLBACK
 * 3. Cloud (Claude API) - EMERGENCY FALLBACK ONLY
 *
 * Flow:
 * 1. Load job details from Convex
 * 2. Get AI provider settings (Lynkr tunnel URL, etc.)
 * 3. Execute agentic loop with LOCAL models
 * 4. Update job status in Convex as we progress
 * 5. Store final result and transcript
 */

import { NextRequest, NextResponse } from 'next/server';
// import { ConvexHttpClient } from 'convex/browser';
// import { api } from '@/lib/convex-shim';
// import { makeFunctionReference } from 'convex/server';
import { ConvexHttpClient, api } from '@/lib/convex-shim';

// Shim for makeFunctionReference
const makeFunctionReference = <T1, T2, T3>(name: string): string => name;

import { CLAW_AI_SYSTEM_PROMPT } from '@/lib/8gent/system-prompt';
import { getToolsForAccessLevel } from '@/lib/8gent/access-control';
import { executeTool } from '@/lib/8gent/tool-executor';
import {
  getLynkrClient,
  type LynkrTool,
  type LynkrMessage,
  type LynkrChatResponse,
  type LynkrToolUse,
} from '@/lib/lynkr';

// Lazy-initialize Convex client (env vars not available at module load time during build)
let _convexClient: ConvexHttpClient | null = null;
function getConvexClient(): ConvexHttpClient {
  if (!_convexClient) {
    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      throw new Error('NEXT_PUBLIC_CONVEX_URL environment variable is required');
    }
    _convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  }
  return _convexClient;
}

// Agent execution secret (prevents unauthorized calls)
const AGENT_SECRET = process.env.AGENT_EXECUTION_SECRET || process.env.CRON_SECRET;

// Types
interface AgentTaskInput {
  task: string;
  label?: string;
  timeoutSeconds?: number;
  announceResult?: boolean;
  priority?: 'low' | 'normal' | 'high';
  jobType?: 'coding' | 'research' | 'product' | 'general';
  maxIterations?: number;
  context?: {
    projectId?: string;
    ticketId?: string;
    sandboxId?: string;
    repositoryUrl?: string;
    [key: string]: unknown;
  };
}

interface CodeIterationInput {
  goal: string;
  sandboxId: string;
  maxIterations?: number;
  stopOnSuccess?: boolean;
  commitChanges?: boolean;
  testCommand?: string;
}

interface SpecialistDelegationInput {
  specialist:
  | 'code-reviewer'
  | 'security-auditor'
  | 'performance-analyst'
  | 'documentation-writer'
  | 'test-generator'
  | 'refactoring-expert';
  task: string;
  context?: Record<string, unknown>;
  announceResult?: boolean;
}

interface TranscriptMessage {
  role: 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
  tool_name?: string;
  timestamp: number;
}

interface AIProviderSettings {
  primaryProvider: 'cloud' | 'local' | 'lynkr';
  fallbackProvider?: 'cloud' | 'local' | 'lynkr' | 'none';
  lynkrEnabled?: boolean;
  lynkrTunnelUrl?: string;
  lynkrApiKey?: string;
  lynkrDefaultModel?: string;
  ollamaBaseUrl?: string;
  ollamaDefaultModel?: string;
}

// Specialist system prompts
const SPECIALIST_PROMPTS: Record<string, string> = {
  'code-reviewer': `You are an expert code reviewer. Your job is to:
- Review code for bugs, security issues, and maintainability
- Suggest improvements and best practices
- Identify potential performance bottlenecks
- Check for proper error handling
Be thorough but constructive.`,

  'security-auditor': `You are a security auditor. Your job is to:
- Identify security vulnerabilities (OWASP Top 10)
- Check for injection risks, XSS, CSRF
- Review authentication and authorization logic
- Audit secrets management and data exposure
Flag severity levels: CRITICAL, HIGH, MEDIUM, LOW.`,

  'performance-analyst': `You are a performance analyst. Your job is to:
- Identify performance bottlenecks
- Analyze algorithmic complexity
- Check for unnecessary re-renders (React)
- Review database query efficiency
Provide specific, actionable recommendations.`,

  'documentation-writer': `You are a documentation writer. Your job is to:
- Write clear, comprehensive documentation
- Create API documentation with examples
- Write README files and getting started guides
Use clear language and include examples.`,

  'test-generator': `You are a test generator. Your job is to:
- Write comprehensive unit tests
- Create integration tests
- Cover edge cases and error scenarios
Use the project's testing framework (Vitest/Jest).`,

  'refactoring-expert': `You are a refactoring expert. Your job is to:
- Identify code that needs refactoring
- Apply SOLID principles
- Simplify complex logic
- Improve code readability
Make incremental, testable changes.`,
};

/**
 * Build the system prompt for an agent task
 */
function buildAgentSystemPrompt(
  input: AgentTaskInput | CodeIterationInput | SpecialistDelegationInput,
  jobType: string
): string {
  let basePrompt = CLAW_AI_SYSTEM_PROMPT;

  basePrompt += `

## Autonomous Execution Mode (LOCAL)
You are running as an AUTONOMOUS AGENT on LOCAL infrastructure.
- Execute the task completely without user interaction
- Use tools as needed to accomplish the goal
- You have full access to local file system and code execution
- Report progress clearly
- When complete, provide a comprehensive summary
`;

  // Add specialist prompt if applicable
  if (jobType === 'specialist_delegation') {
    const specialistInput = input as SpecialistDelegationInput;
    const specialistPrompt = SPECIALIST_PROMPTS[specialistInput.specialist];
    if (specialistPrompt) {
      basePrompt += `\n## Specialist Role\n${specialistPrompt}\n`;
    }
  }

  // Add code iteration context
  if (jobType === 'code_iteration') {
    const codeInput = input as CodeIterationInput;
    basePrompt += `
## Code Iteration Mode
Goal: ${codeInput.goal}
Sandbox ID: ${codeInput.sandboxId}
Max iterations: ${codeInput.maxIterations || 5}
${codeInput.testCommand ? `Test command: ${codeInput.testCommand}` : ''}
${codeInput.commitChanges ? 'Commit changes when successful' : ''}

Loop: Analyze -> Modify -> Test -> Repeat until goal achieved.
`;
  }

  // Add context
  if ('context' in input && input.context) {
    basePrompt += `\n## Task Context\n${JSON.stringify(input.context, null, 2)}\n`;
  }

  return basePrompt;
}

/**
 * Detect if we're running locally (dev mode)
 */
function isRunningLocally(): boolean {
  // Check if we're in development mode
  if (process.env.NODE_ENV === 'development') return true;

  // Check if running on localhost
  if (process.env.VERCEL_ENV === undefined) return true;

  return false;
}

/**
 * Get AI provider settings - LOCAL FIRST
 *
 * Priority:
 * 1. Direct Lynkr (localhost:8081) when running locally
 * 2. Lynkr tunnel when running from Vercel
 * 3. Never cloud for agent execution
 */
async function getAIProviderSettings(): Promise<AIProviderSettings> {
  const isLocal = isRunningLocally();

  // When running locally, use direct Lynkr connection
  if (isLocal) {
    console.log('[Agent] Running locally - using direct Lynkr connection');
    return {
      primaryProvider: 'lynkr',
      lynkrEnabled: true,
      // Direct localhost connection - no tunnel needed
      lynkrTunnelUrl: process.env.LYNKR_LOCAL_URL || 'http://localhost:8081',
      lynkrApiKey: process.env.LYNKR_API_KEY || 'local-dev-key',
      lynkrDefaultModel: process.env.LYNKR_DEFAULT_MODEL || 'gpt-oss:20b',
    };
  }

  // When running from Vercel, try to get settings from Convex
  try {
    const getSettings = makeFunctionReference<
      'query',
      Record<string, never>,
      AIProviderSettings | null
    >('aiSettings:getSettings');

    const settings = await getConvexClient().query(getSettings, {});

    if (settings?.lynkrTunnelUrl) {
      console.log('[Agent] Running remotely - using Lynkr tunnel');
      return settings;
    }
  } catch (e) {
    console.warn('[Agent] Failed to fetch AI settings:', e);
  }

  // Fallback to env var tunnel URL
  if (process.env.LYNKR_TUNNEL_URL) {
    console.log('[Agent] Using tunnel URL from env');
    return {
      primaryProvider: 'lynkr',
      lynkrEnabled: true,
      lynkrTunnelUrl: process.env.LYNKR_TUNNEL_URL,
      lynkrApiKey: process.env.LYNKR_API_KEY,
      lynkrDefaultModel: process.env.LYNKR_DEFAULT_MODEL || 'gpt-oss:20b',
    };
  }

  throw new Error('No local LLM configured. Set LYNKR_TUNNEL_URL or configure in /settings/ai');
}

/**
 * Update job progress in Convex
 */
async function updateJobProgress(
  jobId: string,
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled',
  progress: number,
  message: string,
  output?: string,
  error?: string
): Promise<void> {
  try {
    const updateStatus = makeFunctionReference<
      'mutation',
      {
        jobId: string;
        status: string;
        progress?: number;
        progressMessage?: string;
        output?: string;
        error?: string;
      },
      void
    >('jobs:updateJobStatusPublic');

    await getConvexClient().mutation(updateStatus, {
      jobId,
      status,
      progress,
      progressMessage: message,
      output,
      error,
    });
  } catch (e) {
    console.error('[Agent] Failed to update job progress:', e);
  }
}

/**
 * Log a job event
 */
async function logJobEvent(
  jobId: string,
  eventType: string,
  message: string,
  data?: Record<string, unknown>
): Promise<void> {
  try {
    const logEvent = makeFunctionReference<
      'mutation',
      {
        jobId: string;
        eventType: string;
        message: string;
        data?: string;
      },
      void
    >('jobs:logJobEventPublic');

    await getConvexClient().mutation(logEvent, {
      jobId,
      eventType,
      message,
      data: data ? JSON.stringify(data) : undefined,
    });
  } catch (e) {
    console.error('[Agent] Failed to log job event:', e);
  }
}

/**
 * Convert 8gent tools to Lynkr format
 */
function toLynkrTools(tools: Array<{ name: string; description: string; parameters: unknown }>): LynkrTool[] {
  return tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.parameters as LynkrTool['input_schema'],
  }));
}

/**
 * Execute the agent loop with LOCAL models via Lynkr
 */
async function executeAgentLoopLocal(
  jobId: string,
  input: AgentTaskInput | CodeIterationInput | SpecialistDelegationInput,
  jobType: string,
  ownerId: string,
  settings: AIProviderSettings
): Promise<{ success: boolean; result?: unknown; error?: string; transcript: TranscriptMessage[] }> {
  // Validate Lynkr settings
  if (!settings.lynkrTunnelUrl) {
    throw new Error('Lynkr tunnel URL not configured. Set LYNKR_TUNNEL_URL or configure in /settings/ai');
  }

  const lynkr = getLynkrClient({
    baseUrl: settings.lynkrTunnelUrl,
    apiKey: settings.lynkrApiKey,
    defaultModel: settings.lynkrDefaultModel || 'gpt-oss:20b',
    timeout: 120000, // 2 minute timeout for complex tasks
    skipSsrfValidation: true, // Tunnel URLs are external
  });

  const transcript: TranscriptMessage[] = [];
  const maxIterations = ('maxIterations' in input ? input.maxIterations : undefined) || 10;
  let iteration = 0;

  // Build system prompt
  const systemPrompt = buildAgentSystemPrompt(input, jobType);

  // Get tools for this job type
  const jobTypeMapping = ('jobType' in input ? input.jobType : undefined) || 'general';
  const tools = getToolsForAccessLevel('owner'); // Owner has access to all tools
  const lynkrTools = toLynkrTools(tools);

  // Get the task description
  const taskDescription =
    'task' in input
      ? input.task
      : 'goal' in input
        ? input.goal
        : 'Unknown task';

  // Initial messages
  const messages: LynkrMessage[] = [
    { role: 'user', content: taskDescription },
  ];

  transcript.push({
    role: 'user',
    content: taskDescription,
    timestamp: Date.now(),
  });

  console.log(`[Agent] Starting LOCAL execution for job ${jobId}`);
  console.log(`[Agent] Using Lynkr tunnel: ${settings.lynkrTunnelUrl}`);
  console.log(`[Agent] Model: ${settings.lynkrDefaultModel || 'gpt-oss:20b'}`);
  console.log(`[Agent] Task: ${taskDescription.slice(0, 100)}...`);
  console.log(`[Agent] Tools available: ${tools.length}`);

  while (iteration < maxIterations) {
    iteration++;
    const progress = Math.min(90, Math.round((iteration / maxIterations) * 100));

    await updateJobProgress(
      jobId,
      'running',
      progress,
      `Iteration ${iteration}/${maxIterations}: Processing locally...`
    );

    await logJobEvent(jobId, 'iteration', `Starting iteration ${iteration} (local)`, {
      iteration,
      maxIterations,
      provider: 'lynkr',
    });

    try {
      // Call local model via Lynkr
      const response: LynkrChatResponse = await lynkr.chat({
        model: settings.lynkrDefaultModel || 'gpt-oss:20b',
        messages,
        system: systemPrompt,
        tools: lynkrTools,
        max_tokens: 8192,
        temperature: 0.7,
      });

      console.log(`[Agent] Iteration ${iteration}: stop_reason=${response.stop_reason}`);

      // Process response content
      let assistantContent = '';
      const toolUseBlocks: LynkrToolUse[] = [];

      for (const block of response.content) {
        if (block.type === 'text') {
          assistantContent += block.text;
        } else if (block.type === 'tool_use') {
          toolUseBlocks.push(block);
        }
      }

      // Add assistant message to transcript
      if (assistantContent) {
        transcript.push({
          role: 'assistant',
          content: assistantContent,
          timestamp: Date.now(),
        });
      }

      // Build assistant message for conversation
      messages.push({
        role: 'assistant',
        content: assistantContent || '[tool use]',
      });

      // If no tool use, we're done
      if (response.stop_reason === 'end_turn' || toolUseBlocks.length === 0) {
        console.log(`[Agent] Task complete after ${iteration} iterations`);
        return {
          success: true,
          result: {
            summary: assistantContent || 'Task completed',
            iterations: iteration,
            provider: 'lynkr',
            model: response.model,
          },
          transcript,
        };
      }

      // Execute tool calls
      const toolResultsContent: string[] = [];

      for (const toolUse of toolUseBlocks) {
        console.log(`[Agent] Executing tool: ${toolUse.name}`);

        await logJobEvent(jobId, 'tool_call', `Executing: ${toolUse.name}`, {
          tool: toolUse.name,
          args: toolUse.input,
        });

        try {
          // Execute the tool
          const result = await executeTool(
            {
              name: toolUse.name,
              arguments: toolUse.input as Record<string, unknown>,
            },
            {
              userId: ownerId,
              accessLevel: 'owner',
              jobId,
            }
          );

          const resultStr = JSON.stringify(result.data || result);

          transcript.push({
            role: 'tool',
            content: resultStr,
            tool_call_id: toolUse.id,
            tool_name: toolUse.name,
            timestamp: Date.now(),
          });

          toolResultsContent.push(
            `Tool ${toolUse.name} result: ${result.success ? 'SUCCESS' : 'FAILED'}\n${resultStr}`
          );

          await logJobEvent(jobId, 'tool_result', `${toolUse.name}: ${result.success ? 'success' : 'failed'}`, {
            tool: toolUse.name,
            success: result.success,
          });
        } catch (toolError) {
          const errorMessage = toolError instanceof Error ? toolError.message : 'Unknown error';
          console.error(`[Agent] Tool ${toolUse.name} failed:`, errorMessage);

          transcript.push({
            role: 'tool',
            content: JSON.stringify({ error: errorMessage }),
            tool_call_id: toolUse.id,
            tool_name: toolUse.name,
            timestamp: Date.now(),
          });

          toolResultsContent.push(`Tool ${toolUse.name} FAILED: ${errorMessage}`);
        }
      }

      // Add tool results to conversation
      // Note: Lynkr/Ollama may not support structured tool results,
      // so we add them as a user message with the results
      messages.push({
        role: 'user',
        content: `Tool execution results:\n\n${toolResultsContent.join('\n\n')}\n\nContinue with the task.`,
      });

      // Check for cancellation
      const currentJob = await getConvexClient().query(api.jobs.getJob, { jobId });
      if (currentJob?.status === 'cancelled') {
        console.log(`[Agent] Job ${jobId} was cancelled`);
        return {
          success: false,
          error: 'Job cancelled by user',
          transcript,
        };
      }
    } catch (apiError) {
      const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown API error';
      console.error(`[Agent] Local model error:`, errorMessage);

      await logJobEvent(jobId, 'error', `Local model error: ${errorMessage}`, {
        iteration,
        error: errorMessage,
      });

      // If local model fails, could try fallback here
      // For now, fail the job
      return {
        success: false,
        error: `Local model error: ${errorMessage}`,
        transcript,
      };
    }
  }

  // Max iterations reached
  console.log(`[Agent] Max iterations (${maxIterations}) reached`);
  return {
    success: true,
    result: {
      summary: 'Task completed (max iterations reached)',
      iterations: maxIterations,
      provider: 'lynkr',
      note: 'Consider increasing maxIterations if the task was not fully completed',
    },
    transcript,
  };
}

/**
 * POST /api/agent/execute
 *
 * Execute an agent task LOCALLY. Called by Convex scheduler.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    const providedSecret = authHeader?.replace('Bearer ', '');

    // Allow localhost in development
    const isLocalhost =
      request.headers.get('host')?.includes('localhost') ||
      request.headers.get('x-forwarded-host')?.includes('localhost');

    if (!isLocalhost && providedSecret !== AGENT_SECRET) {
      console.error('[Agent] Unauthorized request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    console.log(`[Agent] Received execution request for job: ${jobId}`);

    // Load job from Convex
    const job = await getConvexClient().query(api.jobs.getJob, { jobId });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if job is already processed
    if (['succeeded', 'failed', 'cancelled'].includes(job.status)) {
      console.log(`[Agent] Job ${jobId} already in terminal state: ${job.status}`);
      return NextResponse.json({
        success: true,
        message: `Job already ${job.status}`,
        jobId,
      });
    }

    const input = job.input as AgentTaskInput | CodeIterationInput | SpecialistDelegationInput;
    const ownerId = job.ownerId || 'anonymous';

    // Get AI provider settings - LOCAL FIRST
    const settings = await getAIProviderSettings();
    console.log(`[Agent] Provider settings: ${settings.primaryProvider}`);

    // Update status to running
    await updateJobProgress(
      jobId,
      'running',
      10,
      `Starting: ${'label' in input ? input.label : 'Agent Task'} (${settings.primaryProvider})`
    );

    await logJobEvent(jobId, 'started', 'Agent execution started (LOCAL)', {
      jobType: job.jobType,
      ownerId,
      provider: settings.primaryProvider,
    });

    // Execute the agent loop LOCALLY
    const result = await executeAgentLoopLocal(jobId, input, job.jobType, ownerId, settings);

    // Update final status
    if (result.success) {
      await updateJobProgress(jobId, 'succeeded', 100, 'Task completed successfully (local)', JSON.stringify({
        result: result.result,
        transcript: result.transcript,
        completedAt: Date.now(),
        provider: 'lynkr',
      }));

      await logJobEvent(jobId, 'completed', 'Agent task completed successfully (local)', {
        iterations: (result.result as Record<string, unknown>)?.iterations,
        provider: 'lynkr',
      });
    } else {
      await updateJobProgress(
        jobId,
        'failed',
        0,
        `Failed: ${result.error}`,
        JSON.stringify({ transcript: result.transcript }),
        result.error
      );

      await logJobEvent(jobId, 'failed', result.error || 'Unknown error');
    }

    return NextResponse.json({
      success: result.success,
      jobId,
      result: result.result,
      error: result.error,
      provider: 'lynkr',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Agent] Execution error:', errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/agent/execute
 *
 * Health check for the agent execution endpoint.
 */
export async function GET() {
  const settings = await getAIProviderSettings();

  return NextResponse.json({
    status: 'healthy',
    service: 'agent-execution-local',
    timestamp: new Date().toISOString(),
    provider: settings.primaryProvider,
    lynkrConfigured: !!settings.lynkrTunnelUrl,
    capabilities: [
      'agent_task',
      'code_iteration',
      'specialist_delegation',
    ],
  });
}
