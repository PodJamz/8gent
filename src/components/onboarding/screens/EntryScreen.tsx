'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs } from '@/components/motion/config';

interface EntryScreenProps {
  onComplete: () => void;
  aesthetic?: 'clean' | 'warm' | 'dark' | 'vivid' | null;
}

export function EntryScreen({ onComplete, aesthetic }: EntryScreenProps) {
  const [phase, setPhase] = useState<'text' | 'transition' | 'complete'>('text');

  const isDark = aesthetic === 'dark' || aesthetic === 'vivid' || !aesthetic;
  const bgClass = 'bg-transparent';
  const textClass = isDark ? 'text-white' : 'text-slate-900';

  useEffect(() => {
    // Text visible for 1.65s
    const textTimer = setTimeout(() => {
      setPhase('transition');
    }, 1650);

    // Start OS transition
    const transitionTimer = setTimeout(() => {
      setPhase('complete');
      onComplete();
    }, 2750);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(transitionTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className={`fixed inset-0 ${bgClass} flex items-center justify-center`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      <AnimatePresence mode="wait">
        {phase === 'text' && (
          <motion.h2
            key="welcome-text"
            className={`text-4xl sm:text-5xl font-light ${textClass}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={springs.gentle}
          >
            Welcome inside
          </motion.h2>
        )}
      </AnimatePresence>

      {/* OS background fade-in */}
      {phase !== 'text' && (
        <motion.div
          className="fixed inset-0 bg-slate-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.88, ease: [0.23, 1, 0.32, 1] }}
        />
      )}
    </motion.div>
  );
}
