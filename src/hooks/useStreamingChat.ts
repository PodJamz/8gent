'use client';

import { useState, useCallback, useRef } from 'react';

// ============================================================================
// Types
// ============================================================================

export type ToolStatus = 'pending' | 'executing' | 'complete' | 'error' | 'denied';

export interface ActiveToolCall {
  id: string;
  name: string;
  status: ToolStatus;
  result?: unknown;
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  /** Chain-of-thought reasoning (from local models like Ollama with thinking) */
  thinking?: string;
  /** Whether thinking is still being streamed */
  isThinkingStreaming?: boolean;
  /** Active tool calls for this message */
  toolCalls?: ActiveToolCall[];
}

export interface UseStreamingChatOptions {
  /** Model to use (claude, opus, sonnet, default) */
  model?: string;
  /** Optional theme context to include in system prompt */
  themeContext?: string;
  /** Callback when streaming starts */
  onStreamStart?: () => void;
  /** Callback when streaming ends */
  onStreamEnd?: () => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

export interface UseStreamingChatReturn {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  /** Currently active tool calls (from streaming message) */
  activeToolCalls: ActiveToolCall[];
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  abortStream: () => void;
}

// ============================================================================
// Hook
// ============================================================================

export function useStreamingChat(
  options: UseStreamingChatOptions = {}
): UseStreamingChatReturn {
  const { model = 'default', themeContext, onStreamStart, onStreamEnd, onError } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeToolCalls, setActiveToolCalls] = useState<ActiveToolCall[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      setError(null);

      // Create user message
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      // Create placeholder for assistant response
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
        thinking: '',
        isThinkingStreaming: false,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsStreaming(true);
      onStreamStart?.();

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        // Prepare messages for API (exclude the placeholder)
        const apiMessages = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            model,
            themeContext,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to get response');
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let accumulatedContent = '';
        let accumulatedThinking = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);

                // Handle content (main response)
                if (parsed.content) {
                  accumulatedContent += parsed.content;
                  // Update the assistant message with accumulated content
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id
                        ? { ...m, content: accumulatedContent, isThinkingStreaming: false }
                        : m
                    )
                  );
                }

                // Handle thinking/reasoning (chain of thought)
                if (parsed.thinking) {
                  accumulatedThinking += parsed.thinking;
                  // Update the assistant message with accumulated thinking
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id
                        ? { ...m, thinking: accumulatedThinking, isThinkingStreaming: true }
                        : m
                    )
                  );
                }

                // Handle tool call start
                if (parsed.toolCall) {
                  const { id, name, status } = parsed.toolCall;
                  setActiveToolCalls((prev) => {
                    const existing = prev.find((tc) => tc.id === id);
                    if (existing) {
                      return prev.map((tc) =>
                        tc.id === id ? { ...tc, status: status as ToolStatus } : tc
                      );
                    }
                    return [...prev, { id, name, status: status as ToolStatus }];
                  });
                }

                // Handle tool result
                if (parsed.toolResult) {
                  const { id, name, result } = parsed.toolResult;
                  setActiveToolCalls((prev) =>
                    prev.map((tc) =>
                      tc.id === id ? { ...tc, status: 'complete' as ToolStatus, result } : tc
                    )
                  );
                }

                // Handle tool error
                if (parsed.toolError) {
                  const { id, error: toolError } = parsed.toolError;
                  setActiveToolCalls((prev) =>
                    prev.map((tc) =>
                      tc.id === id ? { ...tc, status: 'error' as ToolStatus, error: toolError } : tc
                    )
                  );
                }

                // Handle tool denied (access control)
                if (parsed.toolDenied) {
                  const { name, reason } = parsed.toolDenied;
                  const deniedId = `denied_${Date.now()}`;
                  setActiveToolCalls((prev) => [
                    ...prev,
                    { id: deniedId, name, status: 'denied' as ToolStatus, error: reason },
                  ]);
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }

        // Mark streaming as complete and attach tool calls to message
        setActiveToolCalls((currentTools) => {
          // Capture final tools before clearing
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? {
                    ...m,
                    isStreaming: false,
                    isThinkingStreaming: false,
                    toolCalls: currentTools.length > 0 ? [...currentTools] : undefined,
                  }
                : m
            )
          );
          return []; // Clear active tool calls
        });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was aborted, just mark streaming as complete
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, isStreaming: false, content: m.content || 'Request cancelled.' }
                : m
            )
          );
        } else {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(errorMessage);
          onError?.(err instanceof Error ? err : new Error(errorMessage));

          // Update the assistant message with error
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? {
                    ...m,
                    isStreaming: false,
                    content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
                  }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
        onStreamEnd?.();
      }
    },
    [messages, isStreaming, model, themeContext, onStreamStart, onStreamEnd, onError]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setActiveToolCalls([]);
  }, []);

  const abortStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    isStreaming,
    error,
    activeToolCalls,
    sendMessage,
    clearMessages,
    setMessages,
    abortStream,
  };
}

export default useStreamingChat;
