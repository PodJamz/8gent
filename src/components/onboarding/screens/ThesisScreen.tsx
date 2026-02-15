'use client';

import { motion } from 'framer-motion';
import { useAutoAdvance } from '../hooks/useAutoAdvance';
import { springs } from '@/components/motion/config';

interface ThesisScreenProps {
  onAdvance: () => void;
  onSkipAvailable?: () => void;
  showSkip?: boolean;
}

export function ThesisScreen({ onAdvance, showSkip, onSkipAvailable }: ThesisScreenProps) {
  const { skipDelay } = useAutoAdvance({
    delay: 4400,
    onAdvance,
  });

  const words = ['AI-Native', 'Operating', 'System'];

  return (
    <motion.div
      className="fixed inset-0 bg-transparent flex flex-col items-center justify-center cursor-pointer"
      onClick={skipDelay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className="text-center">
        {words.map((word, index) => (
          <motion.div
            key={word}
            className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-tight leading-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.33 + index * 0.88,
              ...springs.gentle,
            }}
          >
            {word}
          </motion.div>
        ))}
      </div>

      {showSkip && (
        <motion.button
          className="absolute bottom-12 text-slate-400 text-sm hover:text-slate-600 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileHover={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          onClick={(e) => {
            e.stopPropagation();
            onSkipAvailable?.();
          }}
        >
          Skip intro
        </motion.button>
      )}
    </motion.div>
  );
}
