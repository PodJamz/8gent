'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { VoiceCallAvatar } from './VoiceCallAvatar';
import { VoiceCallStatus } from './VoiceCallStatus';
import { VoiceCallWaveform } from './VoiceCallWaveform';
import { VoiceCallControls } from './VoiceCallControls';
import { springs } from '@/components/motion/config';

type CallStatus = 'connecting' | 'connected' | 'listening' | 'speaking' | 'thinking' | 'ending';

// Debug logging
const LOG_PREFIX = '[VoiceCallScreen]';
const log = {
  info: (msg: string, data?: unknown) => console.log(`${LOG_PREFIX} ${msg}`, data ?? ''),
  lifecycle: (event: string, data?: unknown) => console.log(`${LOG_PREFIX} [LIFECYCLE] ${event}`, data ?? ''),
};

interface VoiceCallScreenProps {
  isOpen: boolean;
  onClose: () => void;
  status: CallStatus;
  duration: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  userAudioLevels: number[];
  aiAudioLevels: number[];
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  onEndCall: () => void;
}

export function VoiceCallScreen({
  isOpen,
  onClose,
  status,
  duration,
  isMuted,
  isSpeakerOn,
  userAudioLevels,
  aiAudioLevels,
  onToggleMute,
  onToggleSpeaker,
  onEndCall,
}: VoiceCallScreenProps) {
  const prefersReducedMotion = useReducedMotion();

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    log.lifecycle('Keyboard shortcuts registered', { isOpen });

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          log.info('Escape key pressed - ending call');
          onEndCall();
          break;
        case 'm':
        case 'M':
          log.info('M key pressed - toggling mute');
          onToggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      log.lifecycle('Keyboard shortcuts unregistered');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onEndCall, onToggleMute]);

  // Close after ending
  useEffect(() => {
    if (status === 'ending') {
      log.lifecycle('Status is ending, scheduling close (1500ms)');
      const timer = setTimeout(() => {
        log.lifecycle('Closing screen');
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  // Log status changes
  useEffect(() => {
    log.lifecycle('Status changed', { status, duration, isOpen });
  }, [status, duration, isOpen]);

  // Determine which audio levels to show
  const showUserWaveform = status === 'listening';
  const showAiWaveform = status === 'speaking';
  const waveformVariant = showUserWaveform ? 'user' : 'ai';
  const waveformLevels = showUserWaveform ? userAudioLevels : aiAudioLevels;
  const showWaveform = showUserWaveform || showAiWaveform;

  const screenVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(10px)',
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: prefersReducedMotion
        ? { duration: 0.15 }
        : springs.smooth,
    },
    exit: {
      y: '100%',
      opacity: 0,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(10px)',
      transition: {
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1] as const,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={screenVariants}
        >
          {/* Backdrop blur */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Glass container */}
          <motion.div
            className="relative w-full max-w-sm mx-4 overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 32,
              padding: '48px 32px',
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              delay: 0.1,
            }}
          >
            {/* Content stack */}
            <div className="flex flex-col items-center gap-8">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  delay: 0.15,
                }}
              >
                <VoiceCallAvatar status={status} size={160} />
              </motion.div>

              {/* Status and timer */}
              <VoiceCallStatus status={status} duration={duration} />

              {/* Waveform visualization */}
              <div className="h-12 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {showWaveform ? (
                    <motion.div
                      key="waveform"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <VoiceCallWaveform
                        audioLevels={waveformLevels}
                        isActive={true}
                        variant={waveformVariant}
                        barCount={16}
                      />
                    </motion.div>
                  ) : status === 'thinking' ? (
                    <motion.div
                      key="thinking"
                      className="flex gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          className="w-3 h-3 rounded-full bg-[hsl(var(--theme-accent)/0.6)]"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: 'easeInOut',
                          }}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      className="h-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <VoiceCallWaveform
                        audioLevels={[]}
                        isActive={false}
                        variant="user"
                        barCount={16}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Controls */}
              <VoiceCallControls
                isMuted={isMuted}
                isSpeakerOn={isSpeakerOn}
                onToggleMute={onToggleMute}
                onToggleSpeaker={onToggleSpeaker}
                onEndCall={onEndCall}
                disabled={status === 'ending'}
              />
            </div>
          </motion.div>

          {/* Screen reader announcements */}
          <div role="status" aria-live="polite" className="sr-only">
            {status === 'connecting' && <span key="connecting">Call connecting</span>}
            {status === 'connected' && <span key="connected">Call connected. Duration: {duration} seconds</span>}
            {status === 'speaking' && <span key="speaking">Claw AI is speaking</span>}
            {status === 'listening' && <span key="listening">Claw AI is listening</span>}
            {status === 'thinking' && <span key="thinking">Claw AI is thinking</span>}
            {status === 'ending' && <span key="ending">Call ended. Duration: {Math.floor(duration / 60)} minutes {duration % 60} seconds</span>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VoiceCallScreen;
