'use client';

import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';

// ============================================================================
// Types
// ============================================================================

interface VoiceRecordingIndicatorProps {
  isRecording: boolean;
  duration: number; // seconds
  audioLevels: number[]; // Array of 0-1 values for waveform
  className?: string;
}

// ============================================================================
// Helpers
// ============================================================================

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================================================
// Waveform Bar Component
// ============================================================================

const WaveformBar = memo(function WaveformBar({
  level,
  index,
}: {
  level: number;
  index: number;
}) {
  // Minimum height so bars are always visible, even with no audio
  const minHeight = 4;
  const maxHeight = 24;
  const height = minHeight + level * (maxHeight - minHeight);

  return (
    <motion.div
      className="bg-red-500 rounded-full"
      style={{
        width: 3,
        height,
      }}
      initial={{ height: minHeight }}
      animate={{ height }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        mass: 0.5,
      }}
      key={index}
    />
  );
});

// ============================================================================
// Main Component
// ============================================================================

export const VoiceRecordingIndicator = memo(function VoiceRecordingIndicator({
  isRecording,
  duration,
  audioLevels,
  className = '',
}: VoiceRecordingIndicatorProps) {
  const formattedDuration = useMemo(() => formatDuration(duration), [duration]);

  if (!isRecording) {
    return null;
  }

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      {/* Timer */}
      <motion.span
        className="text-red-500 text-sm font-mono tabular-nums min-w-[40px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {formattedDuration}
      </motion.span>

      {/* Waveform visualization */}
      <div className="flex items-center gap-[2px] h-6">
        {audioLevels.map((level, index) => (
          <WaveformBar key={index} level={level} index={index} />
        ))}
      </div>
    </motion.div>
  );
});

// ============================================================================
// Compact Variant - For smaller spaces
// ============================================================================

export const VoiceRecordingIndicatorCompact = memo(
  function VoiceRecordingIndicatorCompact({
    isRecording,
    duration,
    audioLevels,
    className = '',
  }: VoiceRecordingIndicatorProps) {
    const formattedDuration = useMemo(() => formatDuration(duration), [duration]);

    // Use fewer bars for compact variant
    const compactLevels = useMemo(() => {
      if (audioLevels.length <= 10) return audioLevels;
      // Sample every other level
      return audioLevels.filter((_, i) => i % 2 === 0);
    }, [audioLevels]);

    if (!isRecording) {
      return null;
    }

    return (
      <motion.div
        className={`flex items-center gap-2 bg-red-500/10 rounded-full px-3 py-1.5 ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
      >
        {/* Pulsing recording dot */}
        <motion.div
          className="w-2 h-2 bg-red-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Mini waveform */}
        <div className="flex items-center gap-[2px] h-4">
          {compactLevels.slice(-8).map((level, index) => (
            <motion.div
              key={index}
              className="bg-red-500 rounded-full"
              style={{ width: 2 }}
              animate={{
                height: 3 + level * 13,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
            />
          ))}
        </div>

        {/* Timer */}
        <span className="text-red-500 text-xs font-mono tabular-nums">
          {formattedDuration}
        </span>
      </motion.div>
    );
  }
);

export default VoiceRecordingIndicator;
