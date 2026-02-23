'use client';

import { motion } from 'framer-motion';
import { useAutoAdvance } from '../hooks/useAutoAdvance';
import { springs } from '@/components/motion/config';

interface HonestyScreenProps {
  onAdvance: () => void;
  aesthetic?: 'clean' | 'warm' | 'dark' | 'vivid' | null;
}

export function HonestyScreen({ onAdvance, aesthetic }: HonestyScreenProps) {
  const { skipDelay } = useAutoAdvance({
    delay: 6600,
    onAdvance,
  });

  const isDark = aesthetic === 'dark' || aesthetic === 'vivid' || !aesthetic;
  const bgClass = 'bg-transparent';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const mutedClass = isDark ? 'text-white/40' : 'text-slate-400';

  const lines = [
    { text: 'This began as an exploration into AI-native design.', delay: 0.33 },
    { text: 'It has evolved into a complete, living ecosystem.', delay: 2.2 },
    { text: 'Many features are actively evolving.', delay: 3.85 },
    { text: 'We are constantly refining the experience.', delay: 4.62 },
  ];

  return (
    <motion.div
      className={`fixed inset-0 ${bgClass} flex flex-col items-center justify-center cursor-pointer px-8`}
      onClick={skipDelay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className="text-center max-w-xl space-y-8">
        {lines.map((line, index) => (
          <motion.p
            key={index}
            className={`text-xl sm:text-2xl font-light ${index < 2 ? textClass : mutedClass
              }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: line.delay,
              ...springs.gentle,
            }}
          >
            {line.text}
          </motion.p>
        ))}

        <motion.p
          className={`text-2xl sm:text-3xl font-medium pt-8 ${textClass}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5.5, ...springs.gentle }}
        >
          Everything here is real.
        </motion.p>

        <motion.p
          className={`text-lg font-light italic ${mutedClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6.05 }}
        >
          Building the future of human-AI collaboration.
        </motion.p>
      </div>
    </motion.div>
  );
}
