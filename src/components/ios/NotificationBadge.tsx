'use client';

import { motion } from 'framer-motion';
import { springs } from '@/components/motion/config';

interface NotificationBadgeProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

/**
 * iOS-style notification badge with count and optional pulse animation.
 * Used on app icons and the 8gent orb to draw user attention.
 */
export function NotificationBadge({
  count,
  size = 'md',
  pulse = false,
  className = ''
}: NotificationBadgeProps) {
  if (count <= 0) return null;

  const sizeClasses = {
    sm: 'min-w-[16px] h-[16px] text-[9px] px-1',
    md: 'min-w-[20px] h-[20px] text-[11px] px-1.5',
    lg: 'min-w-[24px] h-[24px] text-[13px] px-2',
  };

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={springs.tight}
    >
      {/* Pulse ring effect */}
      {pulse && (
        <motion.div
          className={`absolute inset-0 bg-red-500 rounded-full ${sizeClasses[size]}`}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      )}

      {/* Main badge */}
      <motion.div
        className={`
          ${sizeClasses[size]}
          bg-red-500
          rounded-full
          flex items-center justify-center
          font-bold text-white
          shadow-lg shadow-red-500/40
          border border-red-400/20
        `}
        animate={pulse ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={pulse ? {
          duration: 0.8,
          repeat: Infinity,
          ease: 'easeInOut',
        } : {}}
      >
        {displayCount}
      </motion.div>
    </motion.div>
  );
}
