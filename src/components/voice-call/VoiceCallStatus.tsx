'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

type CallStatus = 'connecting' | 'connected' | 'listening' | 'speaking' | 'thinking' | 'ending';

interface VoiceCallStatusProps {
  status: CallStatus;
  duration: number; // seconds
  className?: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getStatusText(status: CallStatus): string {
  switch (status) {
    case 'connecting':
      return 'Connecting...';
    case 'connected':
      return 'Connected';
    case 'listening':
      return 'Listening...';
    case 'speaking':
      return '8gent';
    case 'thinking':
      return 'Thinking...';
    case 'ending':
      return 'Call ended';
    default:
      return '';
  }
}

export function VoiceCallStatus({
  status,
  duration,
  className = '',
}: VoiceCallStatusProps) {
  const formattedDuration = useMemo(() => formatDuration(duration), [duration]);
  const statusText = getStatusText(status);
  const showTimer = status !== 'connecting';

  return (
    <motion.div
      className={`flex flex-col items-center gap-1 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: 0.1,
      }}
    >
      {/* Name / Status text */}
      <AnimatePresence mode="wait">
        <motion.span
          key={status}
          className="text-white text-xl font-medium"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.15 }}
        >
          {statusText}
        </motion.span>
      </AnimatePresence>

      {/* Timer */}
      <AnimatePresence>
        {showTimer && (
          <motion.span
            className="text-white/70 text-sm font-mono tabular-nums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {formattedDuration}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Connecting dots animation */}
      {status === 'connecting' && (
        <motion.div
          className="flex gap-1 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/60"
              animate={{
                y: [0, -4, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default VoiceCallStatus;
