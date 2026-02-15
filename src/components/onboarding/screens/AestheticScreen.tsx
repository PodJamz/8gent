'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs } from '@/components/motion/config';
import type { AestheticChoice } from '../hooks/useOnboardingState';

interface AestheticScreenProps {
  onSelect: (choice: AestheticChoice) => void;
  onAdvance: () => void;
  showSkip?: boolean;
  onSkipAvailable?: () => void;
}

const aestheticOptions: {
  id: AestheticChoice;
  label: string;
  description: string;
  colorHint: string;
  bgPreview: string;
}[] = [
    {
      id: 'clean',
      label: 'Clean',
      description: 'Minimal white, sharp typography',
      colorHint: 'bg-slate-100',
      bgPreview: 'bg-white',
    },
    {
      id: 'warm',
      label: 'Warm',
      description: 'Soft cream, paper texture',
      colorHint: 'bg-amber-100',
      bgPreview: 'bg-amber-50',
    },
    {
      id: 'dark',
      label: 'Dark',
      description: 'Deep blacks, luminous accents',
      colorHint: 'bg-slate-800',
      bgPreview: 'bg-slate-950',
    },
    {
      id: 'vivid',
      label: 'Vivid',
      description: 'Bold gradients, high contrast',
      colorHint: 'bg-gradient-to-r from-violet-500 to-fuchsia-500',
      bgPreview: 'bg-gradient-to-br from-violet-600 to-fuchsia-600',
    },
  ];

export function AestheticScreen({
  onSelect,
  onAdvance,
  showSkip,
  onSkipAvailable,
}: AestheticScreenProps) {
  const [selected, setSelected] = useState<AestheticChoice | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (choice: AestheticChoice) => {
    setSelected(choice);
    onSelect(choice);

    // Pulse and advance
    setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(onAdvance, 440);
    }, 660);
  };

  const selectedOption = aestheticOptions.find((o) => o.id === selected);

  return (
    <motion.div
      className="fixed inset-0 bg-transparent flex flex-col items-center justify-center px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      {/* Background preview */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className={`fixed inset-0 ${selectedOption?.bgPreview}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isTransitioning ? 1 : 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 text-center max-w-xl">
        <motion.p
          className={`text-sm uppercase tracking-widest mb-4 transition-colors duration-300 ${selected === 'dark' ? 'text-slate-400' : 'text-slate-400'
            }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          Before we begin
        </motion.p>

        <motion.h2
          className={`text-3xl sm:text-4xl font-light mb-16 transition-colors duration-300 ${selected === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, ...springs.gentle }}
        >
          How do you want this to feel?
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {aestheticOptions.map((option, index) => (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`group relative px-8 py-6 rounded-2xl transition-all duration-300 ${selected === option.id
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
              {/* Color hint background */}
              <div
                className={`absolute inset-0 rounded-2xl ${option.colorHint} opacity-20 group-hover:opacity-40 transition-opacity`}
              />

              {/* Selection ring */}
              {selected === option.id && (
                <motion.div
                  className="absolute inset-0 rounded-2xl ring-2 ring-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layoutId="selection-ring"
                />
              )}

              <div className="relative">
                <span
                  className={`text-xl font-medium transition-colors duration-300 ${selected === 'dark' && selected === option.id
                    ? 'text-white'
                    : 'text-slate-800'
                    }`}
                >
                  {option.label}
                </span>
                <p
                  className={`mt-2 text-sm transition-colors duration-300 ${selected === 'dark' && selected === option.id
                    ? 'text-slate-300'
                    : 'text-slate-500'
                    }`}
                >
                  {option.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {showSkip && !selected && (
        <motion.button
          className="absolute bottom-12 text-slate-400 text-sm hover:text-slate-600 transition-colors z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileHover={{ opacity: 1 }}
          transition={{ delay: 1.65 }}
          onClick={onSkipAvailable}
        >
          Skip intro
        </motion.button>
      )}
    </motion.div>
  );
}
