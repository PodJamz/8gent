'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import '@/lib/themes/themes.css';
import { springs } from '@/components/motion/config';

interface ClawAIOrbProps {
  onClick: () => void;
  isActive?: boolean;
  hasNotification?: boolean;
  notificationCount?: number;
}

export function ClawAIOrb({ onClick, isActive = false, hasNotification = false, notificationCount = 0 }: ClawAIOrbProps) {
  // Determine if we should show urgent pulse (notifications present)
  const showUrgentPulse = hasNotification || notificationCount > 0;
  const prefersReducedMotion = useReducedMotion();
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Cleanup ripple timeouts on unmount to prevent memory leaks
  useEffect(() => {
    const timeouts = rippleTimeoutsRef.current;
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // Create ripple effect
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rippleId = Date.now();
      setRipples((prev) => [...prev, { id: rippleId, x, y }]);

      // Remove ripple after animation with proper cleanup
      const timeout = setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
        rippleTimeoutsRef.current.delete(rippleId);
      }, 600);
      rippleTimeoutsRef.current.set(rippleId, timeout);

      onClick();
    },
    [onClick]
  );

  return (
    <motion.button
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-full"
      style={{
        // @ts-expect-error CSS custom property
        '--tw-ring-color': 'hsl(var(--theme-primary) / 0.5)',
      }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.92 }}
      transition={springs.snappy}
      aria-label="Open 8gent chat"
    >
      {/* Outer glow rings - animated - uses theme primary */}
      {/* When notifications present, glow is more intense and faster */}
      <div className="absolute inset-0 -m-2">
        {/* Pulsing glow ring 1 */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: showUrgentPulse
              ? 'radial-gradient(circle, hsl(var(--theme-primary) / 0.6) 0%, transparent 70%)'
              : 'radial-gradient(circle, hsl(var(--theme-primary) / 0.35) 0%, transparent 70%)',
          }}
          animate={
            prefersReducedMotion
              ? {}
              : showUrgentPulse
                ? {
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0.3, 0.8],
                }
                : {
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.2, 0.5],
                }
          }
          transition={{
            duration: showUrgentPulse ? 1.5 : 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Pulsing glow ring 2 - offset */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: showUrgentPulse
              ? 'radial-gradient(circle, hsl(var(--theme-accent) / 0.5) 0%, transparent 70%)'
              : 'radial-gradient(circle, hsl(var(--theme-accent) / 0.3) 0%, transparent 70%)',
          }}
          animate={
            prefersReducedMotion
              ? {}
              : showUrgentPulse
                ? {
                  scale: [1.1, 1.6, 1.1],
                  opacity: [0.7, 0.2, 0.7],
                }
                : {
                  scale: [1.1, 1.4, 1.1],
                  opacity: [0.4, 0.15, 0.4],
                }
          }
          transition={{
            duration: showUrgentPulse ? 1.8 : 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
        />
        {/* Extra attention-grabbing ring when urgent */}
        {showUrgentPulse && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 100, 100, 0.4) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </div>

      {/* Main orb container - dock size */}
      <div className="relative w-10 h-10">
        {/* Gradient background orb - uses theme colors */}
        {/* Glows brighter when there are notifications to grab attention */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: isActive || showUrgentPulse
              ? 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)'
              : 'linear-gradient(135deg, hsl(var(--theme-primary) / 0.9) 0%, hsl(var(--theme-primary)) 50%, hsl(var(--theme-accent) / 0.9) 100%)',
            boxShadow: isActive || showUrgentPulse
              ? '0 0 30px hsl(var(--theme-primary) / 0.7), 0 0 60px hsl(var(--theme-accent) / 0.4), inset 0 0 15px rgba(255, 255, 255, 0.3)'
              : '0 0 20px hsl(var(--theme-primary) / 0.4), 0 0 40px hsl(var(--theme-accent) / 0.2), inset 0 0 10px rgba(255, 255, 255, 0.2)',
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                scale: isPressed ? 0.95 : [1, 1.02, 1],
              }
          }
          transition={
            isPressed
              ? { duration: 0.1 }
              : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          {/* Inner glass effect */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(255, 255, 255, 0.45) 0%, transparent 50%)',
            }}
          />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            animate={
              prefersReducedMotion
                ? {}
                : {
                  rotate: [0, 360],
                }
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0%, rgba(255, 255, 255, 0.35) 10%, transparent 20%, transparent 100%)',
              }}
            />
          </motion.div>

          {/* Inner highlight */}
          <div
            className="absolute inset-1.5 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
            }}
          />
        </motion.div>

        {/* 8gent icon/avatar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-6 h-6 rounded-full overflow-hidden border border-white/40"
            style={{
              boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.2)',
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                  y: [0, -1, 0],
                }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/8gent-logo.png"
              alt="8gent"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Ripple effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
                background: 'radial-gradient(circle, hsl(var(--theme-primary-foreground) / 0.5) 0%, transparent 70%)',
              }}
              initial={{ width: 0, height: 0, opacity: 0.8 }}
              animate={{ width: 80, height: 80, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>

        {/* Notification indicator - iOS style with count and pulse */}
        <AnimatePresence>
          {(hasNotification || notificationCount > 0) && (
            <motion.div className="absolute -top-1 -right-1">
              {/* Pulse ring for attention */}
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 bg-red-500 rounded-full"
                  style={{
                    minWidth: notificationCount > 9 ? '22px' : '18px',
                    height: notificationCount > 9 ? '22px' : '18px',
                  }}
                  animate={{
                    scale: [1, 1.6, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              )}
              {/* Main badge */}
              <motion.div
                className="relative rounded-full flex items-center justify-center font-bold text-white shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                style={{
                  backgroundColor: '#ef4444',
                  boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)',
                  minWidth: notificationCount > 9 ? '22px' : '18px',
                  height: notificationCount > 9 ? '22px' : '18px',
                  padding: notificationCount > 9 ? '0 5px' : '0',
                  fontSize: notificationCount > 9 ? '9px' : '10px',
                }}
              >
                {notificationCount > 0 ? (notificationCount > 99 ? '99+' : notificationCount) : '!'}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
