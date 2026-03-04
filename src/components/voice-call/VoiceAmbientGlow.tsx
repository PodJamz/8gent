'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

interface VoiceAmbientGlowProps {
  state: VoiceState;
  intensity?: number; // 0-1, for audio level reactivity
  className?: string;
}

// Debug logging
const LOG_PREFIX = '[VoiceAmbientGlow]';
const log = {
  state: (state: VoiceState, intensity: number) =>
    console.log(`${LOG_PREFIX} state=${state} intensity=${intensity.toFixed(2)}`),
};

export function VoiceAmbientGlow({
  state,
  intensity = 0.5,
  className = ''
}: VoiceAmbientGlowProps) {
  const prefersReducedMotion = useReducedMotion();

  // Color configurations for each state
  const stateColors = useMemo(() => ({
    idle: {
      primary: 'rgba(255, 255, 255, 0.02)',
      secondary: 'rgba(255, 255, 255, 0.01)',
      glow: 'transparent',
    },
    listening: {
      primary: 'rgba(34, 197, 94, 0.15)', // Green
      secondary: 'rgba(34, 197, 94, 0.08)',
      glow: 'rgba(34, 197, 94, 0.3)',
    },
    processing: {
      primary: 'rgba(251, 191, 36, 0.12)', // Amber
      secondary: 'rgba(251, 191, 36, 0.06)',
      glow: 'rgba(251, 191, 36, 0.2)',
    },
    speaking: {
      primary: 'rgba(251, 146, 60, 0.18)', // Orange
      secondary: 'rgba(251, 146, 60, 0.10)',
      glow: 'rgba(251, 146, 60, 0.35)',
    },
  }), []);

  const colors = stateColors[state];

  // Height varies with state and intensity
  const baseHeight = state === 'idle' ? 0 : state === 'listening' ? 30 : state === 'processing' ? 40 : 50;
  const dynamicHeight = baseHeight + (intensity * 20);

  // Log state changes (throttled in production)
  // log.state(state, intensity);

  return (
    <motion.div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Primary glow layer */}
      <motion.div
        className="absolute inset-x-0 bottom-0"
        animate={{
          height: `${dynamicHeight}vh`,
          background: `linear-gradient(to top, ${colors.primary}, ${colors.secondary}, transparent)`,
        }}
        transition={prefersReducedMotion ? { duration: 0.1 } : {
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      />

      {/* Secondary pulse layer for speaking state */}
      {state === 'speaking' && (
        <motion.div
          className="absolute inset-x-0 bottom-0"
          initial={{ height: '20vh', opacity: 0 }}
          animate={{
            height: ['20vh', '35vh', '20vh'],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={prefersReducedMotion ? { duration: 0 } : {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 100%, ${colors.glow}, transparent)`,
          }}
        />
      )}

      {/* Listening pulse - subtle green */}
      {state === 'listening' && (
        <motion.div
          className="absolute inset-x-0 bottom-0"
          initial={{ height: '15vh', opacity: 0 }}
          animate={{
            height: ['15vh', '25vh', '15vh'],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={prefersReducedMotion ? { duration: 0 } : {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: `radial-gradient(ellipse 70% 40% at 50% 100%, ${colors.glow}, transparent)`,
          }}
        />
      )}

      {/* Processing shimmer */}
      {state === 'processing' && (
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[30vh]"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={prefersReducedMotion ? { duration: 0 } : {
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${colors.glow}, transparent)`,
          }}
        />
      )}

      {/* Bottom edge highlight */}
      {state !== 'idle' && (
        <motion.div
          className="absolute inset-x-0 bottom-0 h-1"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.6 }}
          exit={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.glow}, transparent)`,
          }}
        />
      )}
    </motion.div>
  );
}

export default VoiceAmbientGlow;
