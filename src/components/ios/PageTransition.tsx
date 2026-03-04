'use client';

import { useState, useEffect, ReactNode, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_TRANSITION_KEY } from './AppIcon';
import { springs, motionConfig } from '@/components/motion/config';

interface PageTransitionProps {
  children: ReactNode;
}

interface TransitionData {
  x: number;
  y: number;
  width: number;
  height: number;
  gradient: string;
  timestamp: number;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [transitionData, setTransitionData] = useState<TransitionData | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  // Store window dimensions safely in state to avoid SSR issues
  const [windowDimensions, setWindowDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    // Safely capture window dimensions on client
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Check for stored transition data
    const stored = sessionStorage.getItem(APP_TRANSITION_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored) as TransitionData;
        // Only use if recent (within last 2 seconds)
        if (Date.now() - data.timestamp < 2000) {
          setTransitionData(data);
          // Clear it so it doesn't replay on refresh
          sessionStorage.removeItem(APP_TRANSITION_KEY);
        }
      } catch (e) {
        // Invalid data, ignore
      }
    }
    setIsHydrated(true);

    // Show content after a brief delay for animation
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Compute animation scale safely using state values
  const animationScale = useMemo(() => {
    if (!transitionData || transitionData.width === 0) return 50;
    return Math.max(windowDimensions.width, windowDimensions.height) / transitionData.width * 2.5;
  }, [transitionData, windowDimensions]);

  if (!isHydrated) {
    return null;
  }

  // If we have transition data, animate from the icon position
  if (transitionData) {
    return (
      <>
        {/* Expanding circle animation */}
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: motionConfig.duration.normal, delay: 0.3 }}
        >
          <motion.div
            className="absolute rounded-[20px]"
            style={{
              background: transitionData.gradient,
              left: transitionData.x - transitionData.width / 2,
              top: transitionData.y - transitionData.height / 2,
              width: transitionData.width,
              height: transitionData.height,
            }}
            initial={{
              scale: 1,
              borderRadius: '20px',
            }}
            animate={{
              scale: animationScale,
              borderRadius: '0px',
            }}
            transition={{
              duration: motionConfig.duration.slow,
              ease: motionConfig.ease.smooth,
            }}
          />
        </motion.div>

        {/* Page content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            ...springs.smooth,
            delay: 0.15,
          }}
        >
          {children}
        </motion.div>
      </>
    );
  }

  // No transition data, just fade in
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.smooth}
    >
      {children}
    </motion.div>
  );
}
