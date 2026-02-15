'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { Check } from 'lucide-react';

const steps = [
  {
    id: '1',
    name: 'Step 1',
    title: 'Design Sprint',
    description: 'Understand the problem space and operating reality.',
  },
  {
    id: '2',
    name: 'Step 2',
    title: 'Audit',
    description: 'Identify the workflows worth improving first.',
  },
  {
    id: '3',
    name: 'Step 3',
    title: 'Build',
    description: 'Ship internal tools and agent workflows that fit your constraints.',
  },
  {
    id: '4',
    name: 'Step 4',
    title: 'Launch',
    description: 'Deploy, measure, and hand off a system your team can extend safely.',
  },
] as const;

type Step = {
  id: string;
  name: string;
  title: string;
  description: string;
};

function useNumberCycler(totalSteps: number = 4, interval: number = 4000) {
  const [currentNumber, setCurrentNumber] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const setupTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setCurrentNumber((prev) => (prev + 1) % totalSteps);
      setupTimer();
    }, interval);
  }, [interval, totalSteps]);

  const goToStep = useCallback((step: number) => {
    setCurrentNumber(step);
    setupTimer();
  }, [setupTimer]);

  useEffect(() => {
    setupTimer();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [setupTimer]);

  return { currentNumber, goToStep };
}

function StepIndicators({
  steps: stepList,
  current,
  onChange,
}: {
  steps: readonly Step[];
  current: number;
  onChange: (index: number) => void;
}) {
  return (
    <nav aria-label="Progress" className="flex justify-center mb-6">
      <ol className="flex flex-wrap items-center justify-center gap-2" role="list">
        {stepList.map((step, stepIdx) => {
          const isCompleted = current > stepIdx;
          const isCurrent = current === stepIdx;

          return (
            <motion.li
              key={step.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: stepIdx * 0.1 }}
              className={cn(
                'relative rounded-full px-3 py-1.5 transition-all duration-300 cursor-pointer',
                isCompleted && 'bg-white/20',
                isCurrent && 'bg-white/10',
                !isCompleted && !isCurrent && 'bg-white/5'
              )}
              onClick={() => onChange(stepIdx)}
            >
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors duration-300',
                    isCompleted && 'bg-green-400/80 text-white',
                    isCurrent && 'bg-white/30 text-white',
                    !isCompleted && !isCurrent && 'bg-white/10 text-white/50'
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </motion.div>
                  ) : (
                    <span>{stepIdx + 1}</span>
                  )}
                </motion.span>
                <span
                  className={cn(
                    'text-xs font-medium transition-colors duration-300 hidden sm:inline',
                    isCompleted && 'text-white/60',
                    isCurrent && 'text-white',
                    !isCompleted && !isCurrent && 'text-white/40'
                  )}
                >
                  {step.name}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}

export function HowItWorks() {
  const { currentNumber: step, goToStep } = useNumberCycler();
  const currentStep = steps[step];

  return (
    <div className="w-full max-w-lg">
      <LiquidGlass
        variant="card"
        intensity="subtle"
        className="!p-6"
      >
        {/* Section Header */}
        <div className="text-center mb-4">
          <h2 className="text-white font-semibold text-lg mb-1">How it works</h2>
          <p className="text-white/50 text-xs leading-relaxed">
            Operator-first. Built from the ground up. Shipped as an internal AI operating system.
          </p>
        </div>

        {/* Step Indicators */}
        <StepIndicators steps={steps} current={step} onChange={goToStep} />

        {/* Carousel Content */}
        <div className="min-h-[80px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="text-center px-4"
            >
              <motion.h3
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="text-white text-xl font-bold mb-2"
              >
                {currentStep.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="text-white/60 text-sm leading-relaxed"
              >
                {currentStep.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </LiquidGlass>
    </div>
  );
}

export default HowItWorks;
