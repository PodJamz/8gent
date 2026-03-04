'use client';

import { motion } from 'framer-motion';
import { springs } from '@/components/motion/config';
import type { OnboardingData } from '../hooks/useOnboardingState';

interface ReturnVisitorScreenProps {
  data: OnboardingData;
  onContinue: () => void;
  onRestart: () => void;
}

export function ReturnVisitorScreen({
  data,
  onContinue,
  onRestart,
}: ReturnVisitorScreenProps) {
  const isDark = data.aesthetic === 'dark';
  const bgClass = isDark ? 'bg-slate-950' : 'bg-white';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const mutedClass = isDark ? 'text-slate-400' : 'text-slate-500';
  const buttonBg = isDark
    ? 'bg-white text-slate-900'
    : 'bg-slate-900 text-white';
  const buttonSecondary = isDark
    ? 'bg-white/10 text-white hover:bg-white/20'
    : 'bg-slate-100 text-slate-900 hover:bg-slate-200';

  return (
    <motion.div
      className={`fixed inset-0 ${bgClass} flex flex-col items-center justify-center px-8`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className="text-center max-w-md">
        <motion.h2
          className={`text-3xl sm:text-4xl font-light mb-4 ${textClass}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, ...springs.gentle }}
        >
          Welcome back
        </motion.h2>

        <motion.p
          className={`text-lg mb-12 ${mutedClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.44 }}
        >
          Continue where you left off?
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.66, ...springs.gentle }}
        >
          <button
            onClick={onContinue}
            className={`px-8 py-3 rounded-full font-medium transition-transform hover:scale-105 ${buttonBg}`}
          >
            Continue
          </button>

          <button
            onClick={onRestart}
            className={`px-8 py-3 rounded-full font-medium transition-all ${buttonSecondary}`}
          >
            Start fresh
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
