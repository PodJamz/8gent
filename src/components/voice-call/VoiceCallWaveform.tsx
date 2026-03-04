'use client';

import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';

interface VoiceCallWaveformProps {
  audioLevels: number[];
  isActive: boolean;
  variant?: 'user' | 'ai';
  barCount?: number;
  className?: string;
}

const WaveformBar = memo(function WaveformBar({
  level,
  index,
  variant,
  minHeight,
  maxHeight,
}: {
  level: number;
  index: number;
  variant: 'user' | 'ai';
  minHeight: number;
  maxHeight: number;
}) {
  const height = minHeight + level * (maxHeight - minHeight);
  const colorClass = variant === 'user'
    ? 'bg-[hsl(var(--theme-primary))]'
    : 'bg-[hsl(var(--theme-accent))]';

  return (
    <motion.div
      className={`rounded-full ${colorClass}`}
      style={{ width: 3 }}
      initial={{ height: minHeight }}
      animate={{ height }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        mass: 0.5,
      }}
    />
  );
});

export const VoiceCallWaveform = memo(function VoiceCallWaveform({
  audioLevels,
  isActive,
  variant = 'user',
  barCount = 16,
  className = '',
}: VoiceCallWaveformProps) {
  const minHeight = 6;
  const maxHeight = 32;

  // Normalize audio levels to match barCount
  const normalizedLevels = useMemo(() => {
    if (audioLevels.length === 0) {
      return Array(barCount).fill(0);
    }
    if (audioLevels.length === barCount) {
      return audioLevels;
    }

    // Interpolate or sample to match barCount
    const result: number[] = [];
    const ratio = audioLevels.length / barCount;

    for (let i = 0; i < barCount; i++) {
      const index = Math.floor(i * ratio);
      result.push(audioLevels[Math.min(index, audioLevels.length - 1)] || 0);
    }

    return result;
  }, [audioLevels, barCount]);

  // Generate idle animation levels
  const idleLevels = useMemo(() => {
    return Array(barCount).fill(0).map((_, i) => {
      // Create a subtle wave pattern
      const phase = (i / barCount) * Math.PI * 2;
      return 0.1 + Math.sin(phase) * 0.05;
    });
  }, [barCount]);

  const displayLevels = isActive ? normalizedLevels : idleLevels;

  return (
    <motion.div
      className={`flex items-center justify-center gap-[2px] ${className}`}
      style={{ height: maxHeight }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {displayLevels.map((level, index) => (
        <WaveformBar
          key={index}
          level={level}
          index={index}
          variant={variant}
          minHeight={minHeight}
          maxHeight={maxHeight}
        />
      ))}
    </motion.div>
  );
});

export default VoiceCallWaveform;
