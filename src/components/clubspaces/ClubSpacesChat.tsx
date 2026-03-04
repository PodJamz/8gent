'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from './types';

interface ClubSpacesChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onClose: () => void;
}

export function ClubSpacesChat({ messages, onSendMessage, onClose }: ClubSpacesChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <motion.div
      className="fixed right-0 top-0 bottom-20 w-80 bg-neutral-950 border-l border-white/[0.06] flex flex-col z-40"
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Chat</h2>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-white/30 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-white/20 text-xs mt-8">
            No messages yet
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex flex-col',
                message.type === 'system' ? 'items-center' : 'items-start'
              )}
            >
              {message.type === 'text' && (
                <div className="text-[10px] text-amber-500/60 font-medium mb-0.5">
                  {message.participantName}
                </div>
              )}
              <div
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm',
                  message.type === 'system'
                    ? 'bg-white/[0.02] text-white/20 text-xs'
                    : 'bg-white/[0.04] text-white/80'
                )}
              >
                {message.content}
              </div>
              <div className="text-[10px] text-white/15 mt-0.5">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/[0.06]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message..."
            className="flex-1 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20 focus:outline-none focus:border-amber-500/30 transition-colors"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
