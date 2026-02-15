'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WatchFace } from '@/components/watch/WatchFace';
import { WorldClockView } from '@/components/watch/WorldClockView';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import { useDesignTheme } from '@/context/DesignThemeContext';

export function StatusBarWatch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useDesignTheme();

  const watchDNA = useMemo(() => themeToWatch(theme), [theme]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsExpanded(false);
    }
  }, []);

  return (
    <>
      {/* Mini watch in status bar */}
      <motion.button
        onClick={toggleExpanded}
        className="relative w-8 h-8 flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full"
        aria-label="Expand watch"
        aria-expanded={isExpanded}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <WatchFace
          watchDNA={watchDNA}
          size={28}
          showCase={false}
          interactive={false}
          className="pointer-events-none"
        />
      </motion.button>

      {/* Expanded watch overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* World Clock View */}
            <motion.div
              className="relative z-10"
              initial={{ scale: 0.9, opacity: 0, y: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -30 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
            >
              <WorldClockView
                watchDNA={watchDNA}
                onClose={toggleExpanded}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
