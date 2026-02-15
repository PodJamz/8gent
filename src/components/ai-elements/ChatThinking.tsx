'use client';

import { memo } from 'react';
import { Reasoning } from './Reasoning';
import { cn } from '@/lib/utils';

export interface ChatThinkingProps {
  /** The thinking/reasoning content */
  thinking: string;
  /** Whether thinking is still being streamed */
  isStreaming?: boolean;
  /** Optional className */
  className?: string;
  /** Default open state */
  defaultOpen?: boolean;
}

/**
 * ChatThinking - Displays AI chain-of-thought reasoning in chat messages
 *
 * Uses the Reasoning component to show collapsible thinking content
 * from local models like Ollama that support thinking mode.
 */
function ChatThinkingComponent({
  thinking,
  isStreaming = false,
  className,
  defaultOpen = true,
}: ChatThinkingProps) {
  // Don't render if no thinking content
  if (!thinking || thinking.trim().length === 0) {
    return null;
  }

  return (
    <div className={cn('mb-3', className)}>
      <Reasoning
        content={thinking}
        isStreaming={isStreaming}
        defaultOpen={defaultOpen}
      />
    </div>
  );
}

export const ChatThinking = memo(ChatThinkingComponent);
ChatThinking.displayName = 'ChatThinking';

export default ChatThinking;
