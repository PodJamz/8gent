'use client';

import { motion } from "framer-motion";
import { useAutoAdvance } from '../hooks/useAutoAdvance';
import { springs } from '@/components/motion/config';

interface WhyScreenProps {
  onAdvance: () => void;
  showSkip?: boolean;
  onSkipAvailable?: () => void;
}

export function WhyScreen({ onAdvance, showSkip, onSkipAvailable }: WhyScreenProps) {
  const { skipDelay } = useAutoAdvance({
    delay: 7700,
    onAdvance,
  });

  const openingLines = ['A new category of computing.', 'Designed for the AI age.'];

  const coreIdeas = [
    'Seamless AI-human workflows',
    'Persistent knowledge memory',
    'Where ideas evolve into action',
    'Where complexity is simplified',
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-transparent flex flex-col items-center justify-center cursor-pointer px-8"
      onClick={skipDelay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className="text-center max-w-2xl">
        {/* Opening lines that fade to lower opacity */}
        <div className="mb-12">
          {openingLines.map((line, index) => (
            <motion.p
              key={line}
              className="text-2xl sm:text-3xl text-white/60 font-light leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 1, 0.3] }}
              transition={{
                delay: 0.33 + index * 0.66,
                duration: 2.2,
                times: [0, 0.3, 1],
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Core ideas */}
        <div className="space-y-3">
          {coreIdeas.map((idea, index) => (
            <motion.p
              key={idea}
              className="text-xl sm:text-2xl text-white/90 font-light"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 2.0 + index * 0.66,
                ...springs.gentle,
              }}
            >
              {idea}
            </motion.p>
          ))}
        </div>

        {/* Closing line */}
        <motion.p
          className="mt-12 text-lg text-slate-400 font-light italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5.5 }}
        >
          Welcome to the future of interaction.
        </motion.p>
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
