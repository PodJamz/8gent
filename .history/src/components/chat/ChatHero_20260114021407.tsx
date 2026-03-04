'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, MessageSquare } from 'lucide-react';

interface ChatHeroProps {
  onSendMessage?: (message: string) => void;
  placeholder?: string;
  greeting?: string;
  className?: string;
}

export default function ChatHero({
  onSendMessage,
  placeholder = "Start a conversation...",
  greeting,
  className = "",
}: ChatHeroProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Get time-based greeting if not provided
  const getGreeting = () => {
    if (greeting) return greeting;
    const hour = new Date().getHours();
    if (hour < 6) return 'Good evening';
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good evening';
  };

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;
    onSendMessage?.(inputValue.trim());
    setInputValue('');
  }, [inputValue, onSendMessage]);

  return (
    <section
      className={`relative min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden ${className}`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          {/* Icon and Greeting */}
          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
            >
              <MessageSquare className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 dark:text-slate-100">
              {getGreeting()}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
              Ready to explore ideas together? Let's start a conversation.
            </p>
          </div>

          {/* Chat Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div
              className={`
                relative rounded-2xl border-2 transition-all duration-300
                ${isFocused
                  ? 'border-indigo-500 dark:border-indigo-400 shadow-xl shadow-indigo-500/10'
                  : 'border-slate-200 dark:border-slate-700 shadow-lg'
                }
                bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm
              `}
            >
              <div className="flex items-center gap-3 px-5 py-4">
                <Sparkles className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-base outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <motion.button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className={`
                    p-2.5 rounded-xl transition-all duration-200 flex-shrink-0
                    ${inputValue.trim()
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    }
                  `}
                  whileHover={inputValue.trim() ? { scale: 1.05 } : {}}
                  whileTap={inputValue.trim() ? { scale: 0.95 } : {}}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Quick suggestions */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                'Tell me about your work',
                'Share a creative idea',
                'Help me brainstorm',
              ].map((suggestion) => (
                <motion.button
                  key={suggestion}
                  onClick={() => {
                    setInputValue(suggestion);
                    setTimeout(() => {
                      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                      input?.focus();
                    }, 0);
                  }}
                  className="px-4 py-2 rounded-full text-sm border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
