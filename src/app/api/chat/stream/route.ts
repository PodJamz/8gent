import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { OPENCLAW_SYSTEM_PROMPT, THEME_CONTEXTS } from '@/lib/8gent/system-prompt';
import { toOpenAITools } from '@/lib/8gent/tools';
import { executeTool } from '@/lib/8gent/tool-executor';
import { checkRateLimit, getClientIp } from '@/lib/security';
import {
  getOwnerIdentity,
  checkFeatureAccess,
  OWNER_ROLES
} from '@/lib/8gent/access-control';
import { auth } from '@/lib/openclaw/auth-server';
import { getLynkrClient, type LynkrMessage } from '@/lib/lynkr';
import { getMemoryManager } from '@/lib/memory/manager';

export const runtime = 'nodejs'; // Changed from edge to support tool execution
// Dynamic route configuration
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Rate limit: 20 requests per minute per IP for streaming chat
const RATE_LIMIT_CONFIG = { windowMs: 60 * 1000, maxRequests: 20 };

/**
 * RLM Integration: Store interaction asynchronously (fire-and-forget)
 * This ensures streaming responses are captured in the Eternal Context Window.
 */
function storeInteractionAsync(
  userId: string,
  userMessage: string,
  aiResponse: string,
  toolsUsed: string[]
): void {
  // Fire and forget - don't block the response
  (async () => {
    try {
      const memoryManager = getMemoryManager();
      await memoryManager.processInteraction(
        userId,
        { userMessage, aiResponse, toolsUsed },
        undefined // projectId - could be extracted from context in future
      );
      console.log('[Stream RLM] Stored interaction for owner');
    } catch (error) {
      console.error('[Stream RLM] Failed to store interaction:', error);
    }
  })();
}

// Local LLM timeout
const LOCAL_LLM_TIMEOUT = 30000;

interface AIProviderSettings {
  primaryProvider: 'cloud' | 'local' | 'lynkr';
  fallbackProvider?: 'cloud' | 'local' | 'lynkr' | 'none';
  lynkrEnabled?: boolean;
  lynkrTunnelUrl?: string;
  lynkrApiKey?: string;
  lynkrDefaultModel?: string;
  ollamaTimeout?: number;
}

/**
 * Determine user identity from session (Clerk + legacy admin cookie)
 */
async function getUserIdentity(): Promise<{ accessLevel: AccessLevel; userId: string | null }> {
  try {
    // First check Clerk auth
    const { userId: clerkUserId } = await auth();

    if (clerkUserId) {
      // Assume owner for 8gent
      return { accessLevel: 'owner', userId: clerkUserId };
    }

    // Fallback: Check legacy admin cookie
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
  } catch {
    return { accessLevel: 'visitor', userId: null };
  }
}

/**
 * Fetch AI provider settings (using defaults/env for 8gent)
 */
async function getAIProviderSettings(accessLevel: AccessLevel): Promise<AIProviderSettings> {
  if (accessLevel !== 'owner') {
    return { primaryProvider: 'cloud' };
  }

  // Use defaults or env vars
  return {
    primaryProvider: 'cloud',
    // Could load from env or local file if needed
  };
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Rate limiting to prevent API abuse
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`chat-stream:${clientIp}`, RATE_LIMIT_CONFIG);

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Please wait before making more requests.',
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
          }
        }
      );
    }

    const { messages, model = 'default', themeContext, enableTools = false } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get user identity for tool access control
    const { accessLevel, userId } = await getUserIdentity();

    // Get AI provider settings for owner
    const providerSettings = await getAIProviderSettings(accessLevel);

    // Determine which API to use based on settings and model
    const useAnthropic = model === 'claude' || model === 'opus' || model === 'sonnet';
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // Build system prompt with optional theme context
    let systemPrompt = CLAW_AI_SYSTEM_PROMPT;
    if (THEME_CONTEXTS[model]) {
      systemPrompt += THEME_CONTEXTS[model];
    }
    if (themeContext) {
      systemPrompt += `\n\n## Current Design Context\n${themeContext}`;
    }

    // RLM Integration: Load relevant memories for owner (Eternal Context Window)
    let memoryContext = '';
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop()?.content || '';

    if (accessLevel === 'owner' && userId) {
      try {
        const memoryManager = getMemoryManager();
        const memories = await memoryManager.loadRelevantMemories(
          userId,
          lastUserMessage,
          { limit: 10 }
        );
        if (memories.contextSummary) {
          memoryContext = `\n\n## Memory Context (Eternal Window)\n${memories.contextSummary}`;
          systemPrompt += memoryContext;
          console.log('[Stream RLM] Loaded memory context for owner');
        }
      } catch (error) {
        console.error('[Stream RLM] Failed to load memories:', error);
      }
    }

    // Get tools if enabled
    let tools: ReturnType<typeof toOpenAITools> | undefined;
    if (enableTools) {
      const allowedTools = getToolsForAccessLevel(accessLevel);
      tools = toOpenAITools(allowedTools);
    }

    // Check if Lynkr is set as primary provider (local models from anywhere)
    if (providerSettings.primaryProvider === 'lynkr' &&
      providerSettings.lynkrTunnelUrl &&
      providerSettings.lynkrApiKey) {
      console.log('[Stream] Using Lynkr provider via tunnel');
      return await handleLynkrStream(
        messages,
        systemPrompt,
        providerSettings,
        accessLevel,
        userId,
        lastUserMessage
      );
    }

    // Fall through to cloud providers
    if (useAnthropic && anthropicKey) {
      // Use Anthropic Claude API with streaming (tools support)
      return await handleAnthropicStream(
        messages,
        systemPrompt,
        anthropicKey,
        model,
        tools,
        accessLevel,
        userId,
        lastUserMessage
      );
    } else if (openaiKey) {
      // Use OpenAI API with streaming (tools support)
      return await handleOpenAIStream(
        messages,
        systemPrompt,
        openaiKey,
        tools,
        accessLevel,
        userId,
        lastUserMessage
      );
    } else {
      return new Response(JSON.stringify({ error: 'No API key configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Chat stream API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Handle Lynkr streaming (local models via Cloudflare tunnel)
 */
async function handleLynkrStream(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string,
  settings: AIProviderSettings,
  accessLevel: AccessLevel,
  userId: string | null,
  userQuery: string
): Promise<Response> {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let accumulatedResponse = '';

      try {
        if (!settings.lynkrTunnelUrl || !settings.lynkrApiKey) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Lynkr not configured' })}\n\n`));
          controller.close();
          return;
        }

        const client = getLynkrClient({
          baseUrl: settings.lynkrTunnelUrl,
          apiKey: settings.lynkrApiKey,
          defaultModel: settings.lynkrDefaultModel ?? 'gpt-oss:20b',
          timeout: settings.ollamaTimeout ?? LOCAL_LLM_TIMEOUT,
          skipSsrfValidation: true,
        });

        // Convert messages to Lynkr format
        const lynkrMessages: LynkrMessage[] = messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

        console.log('[Lynkr Stream] Starting stream to:', settings.lynkrTunnelUrl);

        // Use streaming API
        const generator = client.chatStream({
          messages: lynkrMessages,
          system: systemPrompt,
          model: settings.lynkrDefaultModel ?? 'gpt-oss:20b',
          max_tokens: 4096,
          temperature: 0.7,
        });

        for await (const chunk of generator) {
          console.log('[Lynkr Stream] Chunk:', JSON.stringify(chunk).slice(0, 200));

          // Cast to any for flexible field access (Lynkr may return various formats)
          const anyChunk = chunk as Record<string, unknown>;
          const delta = anyChunk.delta as Record<string, unknown> | undefined;

          // Handle Anthropic-format text content
          if (chunk.type === 'content_block_delta' && delta?.type === 'text_delta') {
            const text = (delta as { text: string }).text;
            accumulatedResponse += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
          }
          // Handle thinking/reasoning content (chain of thought - Anthropic format)
          else if (chunk.type === 'content_block_delta' && delta?.type === 'thinking_delta') {
            const thinking = (delta as { thinking: string }).thinking;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ thinking })}\n\n`));
          }
          // Handle raw content (fallback for non-Anthropic formats)
          else if (anyChunk.content && typeof anyChunk.content === 'string') {
            accumulatedResponse += anyChunk.content;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: anyChunk.content })}\n\n`));
          }
          // Handle thinking field directly (Ollama format)
          else if (anyChunk.thinking && typeof anyChunk.thinking === 'string') {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ thinking: anyChunk.thinking })}\n\n`));
          }
          // Handle response field directly (Ollama format)
          else if (anyChunk.response && typeof anyChunk.response === 'string') {
            accumulatedResponse += anyChunk.response;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: anyChunk.response })}\n\n`));
          }
          // Handle text field directly (generic)
          else if (anyChunk.text && typeof anyChunk.text === 'string') {
            accumulatedResponse += anyChunk.text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: anyChunk.text })}\n\n`));
          }
        }

        // RLM Integration: Store interaction for owner (Eternal Context Window)
        if (accessLevel === 'owner' && userId && accumulatedResponse) {
          storeInteractionAsync(userId, userQuery, accumulatedResponse, []);
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        console.error('[Lynkr Stream] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Lynkr streaming failed';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

/**
 * Handle OpenAI streaming with tool support
 */
async function handleOpenAIStream(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string,
  apiKey: string,
  tools: ReturnType<typeof toOpenAITools> | undefined,
  accessLevel: AccessLevel,
  userId: string | null,
  userQuery: string
): Promise<Response> {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let fullAccumulatedResponse = '';
      const allToolsUsed: string[] = [];
      let conversationMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
      ];

      let continueLoop = true;
      let iterations = 0;
      const maxIterations = 10; // Prevent infinite loops

      while (continueLoop && iterations < maxIterations) {
        iterations++;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: conversationMessages,
            max_tokens: 2048,
            temperature: 0.7,
            stream: true,
            ...(tools && tools.length > 0 ? { tools, tool_choice: 'auto' } : {}),
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error('OpenAI API error:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'API error' })}\n\n`));
          break;
        }

        const reader = response.body?.getReader();
        if (!reader) break;

        const decoder = new TextDecoder();
        let buffer = '';
        let currentToolCalls: Array<{ id: string; name: string; arguments: string }> = [];
        let currentContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta;
                const finishReason = parsed.choices?.[0]?.finish_reason;

                // Handle content streaming
                if (delta?.content) {
                  currentContent += delta.content;
                  fullAccumulatedResponse += delta.content;
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content: delta.content })}\n\n`)
                  );
                }

                // Handle tool calls streaming
                if (delta?.tool_calls) {
                  for (const tc of delta.tool_calls) {
                    if (tc.index !== undefined) {
                      if (!currentToolCalls[tc.index]) {
                        currentToolCalls[tc.index] = { id: '', name: '', arguments: '' };
                      }
                      if (tc.id) currentToolCalls[tc.index].id = tc.id;
                      if (tc.function?.name) currentToolCalls[tc.index].name = tc.function.name;
                      if (tc.function?.arguments) currentToolCalls[tc.index].arguments += tc.function.arguments;
                    }
                  }
                }

                // Handle finish
                if (finishReason === 'tool_calls' && currentToolCalls.length > 0) {
                  // Filter tool calls by access level
                  const toolCallsToFilter = currentToolCalls.map(tc => ({
                    name: tc.name,
                    arguments: tc.arguments,
                  }));
                  const { permitted, denied } = filterToolCalls(toolCallsToFilter, accessLevel);

                  // Notify about denied tools
                  for (const d of denied) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({
                        toolDenied: { name: d.name, reason: 'Access denied for your role' }
                      })}\n\n`)
                    );
                  }

                  // Execute permitted tools
                  const toolResults: Array<{ tool_call_id: string; role: 'tool'; content: string }> = [];

                  for (const tc of currentToolCalls) {
                    const isPermitted = permitted.some(p => p.name === tc.name);
                    if (!isPermitted) continue;

                    // Notify tool execution start
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({
                        toolCall: { id: tc.id, name: tc.name, status: 'executing' }
                      })}\n\n`)
                    );

                    try {
                      const args = JSON.parse(tc.arguments || '{}');
                      const toolCall = { name: tc.name, arguments: args };
                      const result = await executeTool(toolCall, {
                        userId,
                        accessLevel,
                      });

                      // Track tool for RLM
                      allToolsUsed.push(tc.name);

                      toolResults.push({
                        tool_call_id: tc.id,
                        role: 'tool',
                        content: JSON.stringify(result),
                      });

                      // Notify tool execution complete
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({
                          toolResult: { id: tc.id, name: tc.name, result }
                        })}\n\n`)
                      );
                    } catch (error) {
                      const errorMsg = error instanceof Error ? error.message : 'Tool execution failed';
                      toolResults.push({
                        tool_call_id: tc.id,
                        role: 'tool',
                        content: JSON.stringify({ error: errorMsg }),
                      });

                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({
                          toolError: { id: tc.id, name: tc.name, error: errorMsg }
                        })}\n\n`)
                      );
                    }
                  }

                  // Add assistant message with tool calls and results to conversation
                  conversationMessages.push({
                    role: 'assistant',
                    content: currentContent || null,
                    tool_calls: currentToolCalls.map(tc => ({
                      id: tc.id,
                      type: 'function',
                      function: { name: tc.name, arguments: tc.arguments },
                    })),
                  } as never);

                  for (const result of toolResults) {
                    conversationMessages.push(result as never);
                  }

                  // Reset for next iteration
                  currentToolCalls = [];
                  currentContent = '';
                  // Continue the loop to get the model's response to tool results
                } else if (finishReason === 'stop') {
                  // RLM Integration: Store interaction for owner (Eternal Context Window)
                  if (accessLevel === 'owner' && userId && fullAccumulatedResponse) {
                    storeInteractionAsync(userId, userQuery, fullAccumulatedResponse, allToolsUsed);
                  }
                  continueLoop = false;
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

/**
 * Handle Anthropic streaming with tool support
 */
async function handleAnthropicStream(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string,
  apiKey: string,
  model: string,
  tools: ReturnType<typeof toOpenAITools> | undefined,
  accessLevel: AccessLevel,
  userId: string | null,
  userQuery: string
): Promise<Response> {
  const encoder = new TextEncoder();

  // Convert OpenAI tools format to Anthropic format
  const anthropicTools = tools?.map(tool => ({
    name: tool.function.name,
    description: tool.function.description,
    input_schema: tool.function.parameters,
  }));

  const stream = new ReadableStream({
    async start(controller) {
      let fullAccumulatedResponse = '';
      const allToolsUsed: string[] = [];
      let conversationMessages = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      let continueLoop = true;
      let iterations = 0;
      const maxIterations = 10;

      while (continueLoop && iterations < maxIterations) {
        iterations++;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: model === 'opus' ? 'claude-3-opus-20240229' : 'claude-3-5-sonnet-20241022',
            max_tokens: 2048,
            system: systemPrompt,
            messages: conversationMessages,
            stream: true,
            ...(anthropicTools && anthropicTools.length > 0 ? { tools: anthropicTools } : {}),
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error('Anthropic API error:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'API error' })}\n\n`));
          break;
        }

        const reader = response.body?.getReader();
        if (!reader) break;

        const decoder = new TextDecoder();
        let buffer = '';
        let currentToolUse: { id: string; name: string; input: string } | null = null;
        let toolResults: Array<{ type: 'tool_result'; tool_use_id: string; content: string }> = [];
        let hasToolUse = false;
        let currentContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);

                // Handle content block delta
                if (parsed.type === 'content_block_delta') {
                  if (parsed.delta?.type === 'text_delta' && parsed.delta?.text) {
                    currentContent += parsed.delta.text;
                    fullAccumulatedResponse += parsed.delta.text;
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content: parsed.delta.text })}\n\n`)
                    );
                  } else if (parsed.delta?.type === 'input_json_delta' && currentToolUse) {
                    currentToolUse.input += parsed.delta.partial_json || '';
                  }
                }

                // Handle content block start (tool use)
                if (parsed.type === 'content_block_start' && parsed.content_block?.type === 'tool_use') {
                  currentToolUse = {
                    id: parsed.content_block.id,
                    name: parsed.content_block.name,
                    input: '',
                  };
                  hasToolUse = true;
                }

                // Handle content block stop (execute tool)
                if (parsed.type === 'content_block_stop' && currentToolUse) {
                  // Check access
                  const { permitted, denied } = filterToolCalls(
                    [{ name: currentToolUse.name, arguments: currentToolUse.input }],
                    accessLevel
                  );

                  if (denied.length > 0) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({
                        toolDenied: { name: currentToolUse.name, reason: 'Access denied' }
                      })}\n\n`)
                    );
                    toolResults.push({
                      type: 'tool_result',
                      tool_use_id: currentToolUse.id,
                      content: JSON.stringify({ error: 'Access denied' }),
                    });
                  } else {
                    // Execute tool
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({
                        toolCall: { id: currentToolUse.id, name: currentToolUse.name, status: 'executing' }
                      })}\n\n`)
                    );

                    try {
                      const args = JSON.parse(currentToolUse.input || '{}');
                      const toolCall = { name: currentToolUse.name, arguments: args };
                      const result = await executeTool(toolCall, {
                        userId,
                        accessLevel,
                      });

                      // Track tool for RLM
                      allToolsUsed.push(currentToolUse.name);

                      toolResults.push({
                        type: 'tool_result',
                        tool_use_id: currentToolUse.id,
                        content: JSON.stringify(result),
                      });

                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({
                          toolResult: { id: currentToolUse.id, name: currentToolUse.name, result }
                        })}\n\n`)
                      );
                    } catch (error) {
                      const errorMsg = error instanceof Error ? error.message : 'Tool execution failed';
                      toolResults.push({
                        type: 'tool_result',
                        tool_use_id: currentToolUse.id,
                        content: JSON.stringify({ error: errorMsg }),
                      });

                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({
                          toolError: { id: currentToolUse.id, name: currentToolUse.name, error: errorMsg }
                        })}\n\n`)
                      );
                    }
                  }

                  currentToolUse = null;
                }

                // Handle message stop
                if (parsed.type === 'message_stop') {
                  if (hasToolUse && toolResults.length > 0) {
                    // Add assistant response and tool results to conversation
                    conversationMessages.push({
                      role: 'assistant',
                      content: [
                        ...(currentContent ? [{ type: 'text', text: currentContent }] : []),
                        // Tool use blocks would be here but we handle them via results
                      ],
                    } as never);

                    conversationMessages.push({
                      role: 'user',
                      content: toolResults,
                    } as never);

                    // Reset for next iteration
                    toolResults = [];
                    hasToolUse = false;
                    currentContent = '';
                  } else {
                    // RLM Integration: Store interaction for owner (Eternal Context Window)
                    if (accessLevel === 'owner' && userId && fullAccumulatedResponse) {
                      storeInteractionAsync(userId, userQuery, fullAccumulatedResponse, allToolsUsed);
                    }
                    continueLoop = false;
                  }
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
