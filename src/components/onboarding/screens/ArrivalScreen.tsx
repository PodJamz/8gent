'use client';

import { motion } from "framer-motion";
import { useAutoAdvance } from '../hooks/useAutoAdvance';
import { springs } from '@/components/motion/config';

interface ArrivalScreenProps {
  onAdvance: () => void;
}

export function ArrivalScreen({ onAdvance }: ArrivalScreenProps) {
  const { skipDelay } = useAutoAdvance({
    delay: 3500,
    onAdvance,
  });

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col items-center justify-center cursor-pointer"
      onClick={skipDelay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      <motion.div
        className="text-center max-w-2xl px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, ...springs.gentle }}
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-white tracking-tight mb-4">
          Welcome to <span className="text-emerald-400">8gent</span>
        </h1>
        <motion.p
          className="mt-6 text-xl sm:text-2xl text-slate-300 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.66 }}
        >
          Your AI-native operating system
        </motion.p>
        <motion.div
          className="mt-8 text-base sm:text-lg text-emerald-300/80 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          "Hello! Let's get you settled into your new
          <br />
          8gent workspace. Let's make it yours."
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-12 text-slate-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2.2 }}
      >
        Tap anywhere to continue
      </motion.div>
    </motion.div>
  );
}
