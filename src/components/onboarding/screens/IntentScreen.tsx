'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { springs } from '@/components/motion/config';
import type { IntentChoice } from '../hooks/useOnboardingState';

interface IntentScreenProps {
  onSelect: (choice: IntentChoice) => void;
  onAdvance: () => void;
  aesthetic?: 'clean' | 'warm' | 'dark' | 'vivid' | null;
}

const intentOptions: {
  id: IntentChoice;
  label: string;
  description: string;
}[] = [
    {
      id: 'curiosity',
      label: 'Explore',
      description: 'Just looking around',
    },
    {
      id: 'hiring',
      label: 'Productivity',
      description: 'Get things done',
    },
    {
      id: 'collaboration',
      label: 'Create',
      description: 'Build something new',
    },
    {
      id: 'inspiration',
      label: 'Learn',
      description: 'Discover possibilities',
    },
  ];

export function IntentScreen({ onSelect, onAdvance, aesthetic }: IntentScreenProps) {
  const [selected, setSelected] = useState<IntentChoice | null>(null);

  const bgClass = 'bg-transparent';
  const textClass = 'text-white';
  const mutedClass = 'text-white/40';

  const handleSelect = (choice: IntentChoice) => {
    setSelected(choice);
    onSelect(choice);

    setTimeout(() => {
      onAdvance();
    }, 880);
  };

  return (
    <motion.div
      className={`fixed inset-0 ${bgClass} flex flex-col items-center justify-center px-8`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className="text-center max-w-xl">
        <motion.p
          className={`text-sm uppercase tracking-widest mb-4 ${mutedClass}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          One more thing
        </motion.p>

        <motion.h2
          className={`text-3xl sm:text-4xl font-light mb-16 ${textClass}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, ...springs.gentle }}
        >
          What brings you here today?
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-4">
          {intentOptions.map((option, index) => (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`group relative px-6 py-4 rounded-xl transition-all duration-300 ${selected === option.id
                ? 'scale-105'
                : selected
                  ? 'opacity-30 scale-95'
                  : ''
                }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.66 + index * 0.11, ...springs.gentle }}
              whileHover={!selected ? { scale: 1.05 } : {}}
              whileTap={!selected ? { scale: 0.98 } : {}}
              disabled={!!selected}
            >
              {/* Background */}
              <div
                className={`absolute inset-0 rounded-xl transition-opacity bg-white/5 group-hover:bg-white/10 ${selected === option.id ? 'ring-2 ring-current' : ''}`}
              />

              <div className="relative">
                <span className={`text-lg font-medium ${textClass}`}>
                  {option.label}
                </span>
                <p className={`mt-1 text-sm ${mutedClass}`}>
                  {option.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
