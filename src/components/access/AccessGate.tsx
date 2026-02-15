'use client';

/**
 * AccessGate - Graceful Access Denial with Claw AI
 *
 * When users attempt to access features they don't have permission for,
 * this component creates a friendly, conversational experience instead
 * of a harsh error message.
 *
 * Uses the same aesthetic as /onboarding and /updates:
 * - White sheet fade in
 * - Typewriter text animation
 * - Claw AI personality
 * - Voice/text response option
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Mic, Volume2, X } from 'lucide-react';
import { TextEffect } from '@/components/motion';

// ============================================================================
// Types
// ============================================================================

export type AccessContext =
  | 'humans'
  | 'studio'
  | 'vault'
  | 'calendar'
  | 'prototyping'
  | 'privateMusic'
  | 'designCanvas'
  | 'security'
  | 'analytics'
  | 'general';

interface AccessGateProps {
  context: AccessContext;
  isOpen: boolean;
  onClose?: () => void;
  onRequestAccess?: () => void;
  customMessage?: string;
}

// ============================================================================
// Context-Aware Messages
// ============================================================================

const ACCESS_MESSAGES: Record<AccessContext, { greeting: string; explanation: string; cta: string }> = {
  humans: {
    greeting: 'Hey there.',
    explanation: "This is where I keep track of the people in my life. It's a private space, but if we're working together, I'd be happy to share.",
    cta: 'Want to connect?',
  },
  studio: {
    greeting: 'Ah, the studio.',
    explanation: "This is where the magic happens. Music collaborators get early access to works in progress. It's invite-only for now.",
    cta: 'Interested in collaborating?',
  },
  vault: {
    greeting: 'The vault.',
    explanation: "Some things need to stay private, you know? This space is reserved for content I'm not ready to share publicly yet.",
    cta: 'Curious what\'s inside?',
  },
  calendar: {
    greeting: 'Calendar admin.',
    explanation: "This area handles booking management and scheduling controls. It's restricted to keep things organized.",
    cta: 'Need to schedule something?',
  },
  prototyping: {
    greeting: 'The workshop.',
    explanation: "This is my coding sandbox where ideas become prototypes. Collaborators get access to experiment alongside me.",
    cta: 'Want to build something together?',
  },
  privateMusic: {
    greeting: 'Unreleased tracks.',
    explanation: "These songs aren't ready for the world yet. But collaborators get early listening access. It's like a backstage pass.",
    cta: 'Want early access?',
  },
  designCanvas: {
    greeting: 'The canvas.',
    explanation: "This infinite workspace is where ideas take visual form. I keep it open for collaborators who want to design with me.",
    cta: 'Ready to create?',
  },
  security: {
    greeting: 'Security dashboard.',
    explanation: "This shows everything happening behind the scenes, threat monitoring, access logs, the works. Admin-only for obvious reasons.",
    cta: 'Need to report something?',
  },
  analytics: {
    greeting: 'Analytics.',
    explanation: "Usage stats, engagement metrics, all the numbers. This data helps me understand how the OS is being used.",
    cta: 'Curious about the data?',
  },
  general: {
    greeting: 'Hold on.',
    explanation: "This feature is available to invited collaborators. If you'd like access, just reach out and I'll set you up.",
    cta: 'Want to join?',
  },
};

// ============================================================================
// Typewriter Hook
// ============================================================================

function useTypewriter(text: string, speed: number = 30, startDelay: number = 0) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    setHasStarted(false);

    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [text, startDelay]);

  useEffect(() => {
    if (!hasStarted) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, hasStarted]);

  return { displayedText, isComplete, hasStarted };
}

// ============================================================================
// Main Component
// ============================================================================

export function AccessGate({
  context,
  isOpen,
  onClose,
  onRequestAccess,
  customMessage,
}: AccessGateProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<'entering' | 'greeting' | 'explaining' | 'cta' | 'responding'>('entering');
  const [userInput, setUserInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const messages = ACCESS_MESSAGES[context];
  const greeting = customMessage ? 'Hey.' : messages.greeting;
  const explanation = customMessage || messages.explanation;
  const cta = messages.cta;

  // Typewriter for each phase
  const greetingTypewriter = useTypewriter(greeting, 40, 600);
  const explanationTypewriter = useTypewriter(explanation, 25, 0);
  const ctaTypewriter = useTypewriter(cta, 30, 0);

  // Phase progression
  useEffect(() => {
    if (!isOpen) {
      setPhase('entering');
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    // Phase: entering -> greeting
    timers.push(setTimeout(() => setPhase('greeting'), 100));

    // Phase: greeting -> explaining (after greeting completes + pause)
    timers.push(setTimeout(() => setPhase('explaining'), 600 + greeting.length * 40 + 400));

    // Phase: explaining -> cta (after explanation completes + pause)
    const explainStart = 600 + greeting.length * 40 + 400;
    timers.push(setTimeout(() => setPhase('cta'), explainStart + explanation.length * 25 + 600));

    // Show input after CTA
    const ctaStart = explainStart + explanation.length * 25 + 600;
    timers.push(setTimeout(() => setShowInput(true), ctaStart + cta.length * 30 + 400));

    return () => timers.forEach(clearTimeout);
  }, [isOpen, greeting, explanation, cta]);

  // Focus input when shown
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleGoBack = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  }, [onClose, router]);

  const handleContact = useCallback(() => {
    if (onRequestAccess) {
      onRequestAccess();
    } else {
      router.push('/meet');
    }
  }, [onRequestAccess, router]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      // Could integrate with Claw AI chat here
      setPhase('responding');
      // For now, just redirect to contact
      setTimeout(() => {
        router.push(`/chat?message=${encodeURIComponent(userInput)}`);
      }, 500);
    }
  }, [userInput, router]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* White sheet background */}
        <motion.div
          className="absolute inset-0 bg-white dark:bg-zinc-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Close button */}
        <motion.button
          onClick={handleGoBack}
          className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Content */}
        <div className="relative z-10 max-w-lg mx-auto px-8 text-center">
          {/* Claw AI indicator */}
          <motion.div
            className="mb-8 flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-medium tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
              Claw AI
            </span>
          </motion.div>

          {/* Greeting */}
          <AnimatePresence mode="wait">
            {phase !== 'entering' && (
              <motion.div
                key="greeting"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'greeting' ? 1 : 0.4 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
              >
                <p className="text-3xl sm:text-4xl font-light text-zinc-800 dark:text-zinc-100">
                  {greetingTypewriter.displayedText}
                  {phase === 'greeting' && !greetingTypewriter.isComplete && (
                    <motion.span
                      className="inline-block w-0.5 h-8 ml-1 bg-amber-500"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Explanation */}
          <AnimatePresence>
            {(phase === 'explaining' || phase === 'cta' || phase === 'responding') && (
              <motion.div
                key="explanation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <p className="text-lg sm:text-xl font-light text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {explanationTypewriter.displayedText}
                  {phase === 'explaining' && !explanationTypewriter.isComplete && (
                    <motion.span
                      className="inline-block w-0.5 h-5 ml-1 bg-amber-500"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA Question */}
          <AnimatePresence>
            {(phase === 'cta' || phase === 'responding') && (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <p className="text-xl sm:text-2xl font-light text-amber-600 dark:text-amber-400">
                  {ctaTypewriter.displayedText}
                  {phase === 'cta' && !ctaTypewriter.isComplete && (
                    <motion.span
                      className="inline-block w-0.5 h-6 ml-1 bg-amber-500"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input area */}
          <AnimatePresence>
            {showInput && phase !== 'responding' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {/* Text input */}
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 pr-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-amber-500 hover:text-amber-600 transition-colors"
                    aria-label="Send message"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </form>

                {/* Quick actions */}
                <div className="flex items-center justify-center gap-3">
                  <motion.button
                    onClick={handleGoBack}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                  </motion.button>

                  <motion.button
                    onClick={handleContact}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get in Touch
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Responding state */}
          <AnimatePresence>
            {phase === 'responding' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 text-amber-500"
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-current"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-current"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-current"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AccessGate;
