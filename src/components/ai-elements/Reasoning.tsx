'use client';

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Brain, ChevronDown } from 'lucide-react';
import { Shimmer } from './Shimmer';

export interface ReasoningProps {
  content: string;
  isStreaming?: boolean;
  defaultOpen?: boolean;
  duration?: number;
  className?: string;
}

/**
 * Reasoning component - Shows 8gent thinking process
 * Inspired by Polaris AI reasoning component
 */
function ReasoningComponent({
  content,
  isStreaming = false,
  defaultOpen = true,
  duration,
  className,
}: ReasoningProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [internalDuration, setInternalDuration] = useState<number | undefined>(duration);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [hasAutoClosed, setHasAutoClosed] = useState(false);

  // Track duration when streaming
  useEffect(() => {
    if (isStreaming) {
      if (startTime === null) {
        setStartTime(Date.now());
      }
    } else if (startTime !== null) {
      setInternalDuration(Math.ceil((Date.now() - startTime) / 1000));
      setStartTime(null);
    }
  }, [isStreaming, startTime]);

  // Auto-close after streaming ends
  useEffect(() => {
    if (defaultOpen && !isStreaming && isOpen && !hasAutoClosed) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setHasAutoClosed(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isStreaming, isOpen, defaultOpen, hasAutoClosed]);

  const displayDuration = duration ?? internalDuration;

  const getThinkingMessage = () => {
    if (isStreaming || displayDuration === 0) {
      return <Shimmer duration={1}>Thinking...</Shimmer>;
    }
    if (displayDuration === undefined) {
      return <span>Thought for a few seconds</span>;
    }
    return <span>Thought for {displayDuration} second{displayDuration !== 1 ? 's' : ''}</span>;
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 text-white/60 text-sm transition-colors hover:text-white/80"
      >
        <Brain className="w-4 h-4" />
        {getThinkingMessage()}
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}
        />
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pl-6 border-l-2 border-white/10 text-sm text-white/50 leading-relaxed">
              {isStreaming ? (
                <StreamingText text={content} />
              ) : (
                <p className="whitespace-pre-wrap">{content}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * StreamingText - Simulates text streaming effect
 */
function StreamingText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, 20 + Math.random() * 30);
      return () => clearTimeout(timer);
    }
  }, [displayedText, text]);

  return (
    <p className="whitespace-pre-wrap">
      {displayedText}
      {displayedText.length < text.length && (
        <motion.span
          className="inline-block w-2 h-4 bg-orange-400 ml-0.5"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </p>
  );
}

export const Reasoning = memo(ReasoningComponent);
Reasoning.displayName = 'Reasoning';

export default Reasoning;
