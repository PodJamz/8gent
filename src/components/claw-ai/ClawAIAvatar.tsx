'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import '@/lib/themes/themes.css';

// =============================================================================
// ClawAIAvatar
// =============================================================================
// A unified avatar component for Claw AI used across all chat surfaces.
// Uses the same James profile PNG as the Dock Doc Center orb.
//
// Props:
// - size: Avatar size in pixels (default: 32)
// - isActive: When true, shows intensified glow and subtle pulse (for streaming/typing)
// - className: Additional CSS classes
// =============================================================================

interface ClawAIAvatarProps {
  size?: number;
  isActive?: boolean;
  className?: string;
}

export function ClawAIAvatar({ size = 32, isActive = false, className }: ClawAIAvatarProps) {
  const prefersReducedMotion = useReducedMotion();

  // Calculate relative sizes based on the main size
  const imageSize = Math.round(size * 0.6);
  const glowSpread = size * 0.5;

  return (
    <div
      className={cn('relative flex-shrink-0', className)}
      style={{ width: size, height: size }}
    >
      {/* Outer glow ring - animated when active */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: isActive
            ? 'radial-gradient(circle, hsl(var(--theme-primary) / 0.5) 0%, transparent 70%)'
            : 'radial-gradient(circle, hsl(var(--theme-primary) / 0.25) 0%, transparent 70%)',
          margin: `-${glowSpread * 0.3}px`,
        }}
        animate={
          prefersReducedMotion || !isActive
            ? {}
            : {
                scale: [1, 1.3, 1],
                opacity: [0.7, 0.3, 0.7],
              }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary glow ring for depth */}
      {isActive && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--theme-accent) / 0.4) 0%, transparent 70%)',
            margin: `-${glowSpread * 0.2}px`,
          }}
          animate={{
            scale: [1.1, 1.4, 1.1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.2,
          }}
        />
      )}

      {/* Main orb container with gradient background */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: isActive
            ? 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)'
            : 'linear-gradient(135deg, hsl(var(--theme-primary) / 0.9) 0%, hsl(var(--theme-primary)) 50%, hsl(var(--theme-accent) / 0.9) 100%)',
          boxShadow: isActive
            ? `0 0 ${size * 0.6}px hsl(var(--theme-primary) / 0.5), 0 0 ${size}px hsl(var(--theme-accent) / 0.3), inset 0 0 ${size * 0.3}px rgba(255, 255, 255, 0.25)`
            : `0 0 ${size * 0.4}px hsl(var(--theme-primary) / 0.3), 0 0 ${size * 0.8}px hsl(var(--theme-accent) / 0.15), inset 0 0 ${size * 0.2}px rgba(255, 255, 255, 0.15)`,
        }}
        animate={
          prefersReducedMotion
            ? {}
            : isActive
            ? { scale: [1, 1.03, 1] }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Inner glass effect */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 50%)',
          }}
        />

        {/* Rotating shimmer effect - only when active */}
        {isActive && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0%, rgba(255, 255, 255, 0.3) 10%, transparent 20%, transparent 100%)',
              }}
            />
          </motion.div>
        )}

        {/* Subtle inner highlight for depth */}
        <div
          className="absolute rounded-full"
          style={{
            inset: size * 0.1,
            background:
              'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25) 0%, transparent 50%)',
          }}
        />
      </motion.div>

      {/* James profile image - centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="rounded-full overflow-hidden"
          style={{
            width: imageSize,
            height: imageSize,
            border: '1px solid rgba(255, 255, 255, 0.35)',
            boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.2)',
          }}
          animate={
            prefersReducedMotion
              ? {}
              : isActive
              ? { y: [0, -1, 0] }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/openclaw-logo.png"
            alt="Claw AI"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default ClawAIAvatar;
