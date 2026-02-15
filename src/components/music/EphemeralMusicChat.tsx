'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, ChevronDown, Mic } from 'lucide-react';
import { useStreamingChat, type ChatMessage } from '@/hooks/useStreamingChat';
import { useMusic } from '@/context/MusicContext';

interface EphemeralMusicChatProps {
  /** Additional context to include (e.g., admin mode info) */
  context?: string;
  /** Whether the chat is in the admin panel */
  isAdmin?: boolean;
  /** Callback when AI suggests a track update */
  onSuggestUpdate?: (field: string, value: string) => void;
}

/**
 * Ephemeral Claw AI chat for the music player.
 * Subtle, iOS-inspired design that doesn't take over the experience.
 * Can help with track annotation, metadata questions, and music discovery.
 */
export function EphemeralMusicChat({
  context,
  isAdmin = false,
  onSuggestUpdate
}: EphemeralMusicChatProps) {
  const { currentTrack } = useMusic();
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const responseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Build context for Claw AI
  const trackContext = currentTrack
    ? `Current track: "${currentTrack.title}" by ${currentTrack.artist} from album "${currentTrack.album}".`
    : '';

  const fullContext = [
    'You are helping with music annotation and metadata. Keep responses concise and helpful.',
    isAdmin ? 'The user is an admin managing the music library.' : '',
    trackContext,
    context,
  ].filter(Boolean).join(' ');

  const {
    messages,
    isStreaming,
    sendMessage,
    clearMessages
  } = useStreamingChat({
    model: 'haiku', // Use fast model for ephemeral responses
    themeContext: fullContext,
    onStreamStart: () => setShowResponse(true),
    onStreamEnd: () => {
      // Auto-hide response after 30 seconds if not interacted with
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }
      responseTimeoutRef.current = setTimeout(() => {
        if (!isExpanded) {
          setShowResponse(false);
        }
      }, 30000);
    },
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }
    };
  }, []);

  // Get the last assistant message
  const lastResponse = messages.filter(m => m.role === 'assistant').slice(-1)[0];

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isStreaming) return;

    const message = inputValue.trim();
    setInputValue('');
    await sendMessage(message);
  }, [inputValue, isStreaming, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setShowResponse(false);
    }
  };

  const dismissResponse = useCallback(() => {
    setShowResponse(false);
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
    }
  }, []);

  const handleExpand = () => {
    setIsExpanded(true);
    // Focus input after animation
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Quick prompts for common tasks
  const quickPrompts = isAdmin ? [
    { label: 'Credits', prompt: 'Help me add credits for this track' },
    { label: 'Tags', prompt: 'Suggest tags for this track' },
    { label: 'Genre', prompt: 'What genre is this track?' },
  ] : [
    { label: 'Similar', prompt: 'Recommend similar tracks' },
    { label: 'About', prompt: 'Tell me about this track' },
  ];

  return (
    <div className="relative">
      {/* Response bubble - shows above input */}
      <AnimatePresence>
        {showResponse && lastResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute bottom-full mb-3 left-0 right-0"
          >
            <div className="relative bg-white/95 dark:bg-zinc-800/95 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-zinc-200/50 dark:border-zinc-700/50">
              {/* Dismiss button */}
              <button
                onClick={dismissResponse}
                className="absolute -top-2 -right-2 p-1 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Response content */}
              <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {lastResponse.isStreaming ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-500"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    {lastResponse.content || 'Thinking...'}
                  </span>
                ) : (
                  lastResponse.content
                )}
              </div>

              {/* Tail pointer */}
              <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white/95 dark:bg-zinc-800/95 border-r border-b border-zinc-200/50 dark:border-zinc-700/50 transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat interface */}
      <AnimatePresence mode="wait">
        {isExpanded ? (
          /* Expanded input */
          <motion.form
            key="expanded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-2"
          >
            {/* Quick prompts */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {quickPrompts.map((qp) => (
                <button
                  key={qp.label}
                  type="button"
                  onClick={() => {
                    setInputValue(qp.prompt);
                    inputRef.current?.focus();
                  }}
                  className="flex-shrink-0 px-2.5 py-1 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Input row */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about this track..."
                  disabled={isStreaming}
                  className="w-full px-4 py-2.5 pr-10 text-sm rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all disabled:opacity-50"
                />
                {/* Send button inside input */}
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isStreaming}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-yellow-500 text-white disabled:opacity-30 disabled:bg-zinc-400 hover:bg-yellow-400 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Collapse button */}
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </motion.form>
        ) : (
          /* Collapsed pill button */
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            onClick={handleExpand}
            className="group w-full flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="flex-1 text-left text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              Ask Claw AI...
            </span>
            <Mic className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EphemeralMusicChat;
