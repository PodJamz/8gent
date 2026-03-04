'use client';

import { motion } from 'framer-motion';
import { Loader } from '@/components/ai-elements/Loader';

export function AuthLoadingView() {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          {/* 8gent orb */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 animate-pulse" />
          <div className="absolute inset-0 w-16 h-16 rounded-full bg-orange-500/20 animate-ping" />
        </div>
        <div className="flex items-center gap-2 text-white/60">
          <Loader size={16} />
          <span className="text-sm">Loading 8gent...</span>
        </div>
      </motion.div>
    </div>
  );
}
