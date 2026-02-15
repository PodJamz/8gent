'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type CallStatus = 'connecting' | 'connected' | 'listening' | 'speaking' | 'thinking' | 'ending';

interface VoiceCallAvatarProps {
  status: CallStatus;
  size?: number;
  className?: string;
}

export function VoiceCallAvatar({
  status,
  size = 160,
  className,
}: VoiceCallAvatarProps) {
  const prefersReducedMotion = useReducedMotion();

  const imageSize = Math.round(size * 0.875); // 140px at 160px size
  const frameRadius = Math.round(size * 0.15); // 24px at 160px

  const isActive = status === 'speaking' || status === 'listening' || status === 'thinking';
  const isSpeaking = status === 'speaking';
  const isConnecting = status === 'connecting';
  const isEnding = status === 'ending';

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {/* Outer glow rings */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle, hsl(var(--theme-primary) / ${isActive ? 0.5 : 0.3}) 0%, transparent 70%)`,
          margin: -size * 0.25,
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: isActive ? [1, 1.15, 1] : [1, 1.05, 1],
                opacity: isActive ? [0.6, 0.3, 0.6] : [0.4, 0.2, 0.4],
              }
        }
        transition={{
          duration: isConnecting ? 1.5 : 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary glow for speaking state */}
      {isSpeaking && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle, hsl(var(--theme-accent) / 0.4) 0%, transparent 70%)',
            margin: -size * 0.2,
          }}
          animate={{
            scale: [1.1, 1.3, 1.1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.1,
          }}
        />
      )}

      {/* Speaking ring expansion effect */}
      {isSpeaking && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-3xl border-2"
          style={{
            borderColor: 'hsl(var(--theme-accent) / 0.5)',
          }}
          animate={{
            scale: [1, 1.3, 1.5],
            opacity: [0.5, 0.2, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      )}

      {/* Main avatar frame */}
      <motion.div
        className="relative overflow-hidden"
        style={{
          width: size,
          height: size,
          borderRadius: frameRadius,
          background: `linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)`,
          boxShadow: isActive
            ? `0 0 ${size * 0.5}px hsl(var(--theme-primary) / 0.4), 0 0 ${size * 0.75}px hsl(var(--theme-accent) / 0.2), inset 0 0 ${size * 0.25}px rgba(255, 255, 255, 0.2)`
            : `0 0 ${size * 0.3}px hsl(var(--theme-primary) / 0.25), 0 0 ${size * 0.5}px hsl(var(--theme-accent) / 0.1), inset 0 0 ${size * 0.15}px rgba(255, 255, 255, 0.15)`,
          padding: 3,
        }}
        animate={
          prefersReducedMotion || isEnding
            ? isEnding ? { opacity: 0.5, scale: 0.95 } : {}
            : isActive
            ? { scale: [1, 1.02, 1] }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: isEnding ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Inner glass highlight */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(255, 255, 255, 0.35) 0%, transparent 50%)',
            borderRadius: frameRadius,
          }}
        />

        {/* Rotating shimmer for thinking state */}
        {status === 'thinking' && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: frameRadius }}
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, rgba(255, 255, 255, 0.4) 10%, transparent 20%, transparent 100%)',
              }}
            />
          </motion.div>
        )}

        {/* Profile image container */}
        <div
          className="relative overflow-hidden bg-black/20"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: frameRadius - 3,
          }}
        >
          <motion.img
            src="/openclaw-logo.png"
            alt="Claw AI"
            className="w-full h-full object-cover"
            animate={
              prefersReducedMotion
                ? {}
                : isActive
                ? { y: [0, -2, 0] }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>

      {/* Connecting pulse overlay */}
      {isConnecting && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0"
          style={{
            borderRadius: frameRadius,
            background: 'rgba(255, 255, 255, 0.1)',
          }}
          animate={{
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
}

export default VoiceCallAvatar;
