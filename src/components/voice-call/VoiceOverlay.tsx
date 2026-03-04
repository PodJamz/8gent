'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect, useCallback } from 'react';
import { Plus, ArrowUp, Square, X } from 'lucide-react';
import { VoiceAmbientGlow } from './VoiceAmbientGlow';
import { ClawAIAvatar } from '@/components/claw-ai/ClawAIAvatar';

export type VoiceOverlayState = 'idle' | 'listening' | 'processing' | 'speaking';

interface VoiceOverlayProps {
  isOpen: boolean;
  state: VoiceOverlayState;
  onTapAnywhere: () => void;
  onClose: () => void;
  onAttach?: () => void;
  audioIntensity?: number;
  transcript?: string;
  response?: string;
  className?: string;
}

// Debug logging
const LOG_PREFIX = '[VoiceOverlay]';
const log = {
  info: (msg: string, data?: unknown) => console.log(`${LOG_PREFIX} ${msg}`, data ?? ''),
  action: (action: string) => console.log(`${LOG_PREFIX} [ACTION] ${action}`),
};

// Status text for each state
const STATUS_TEXT: Record<VoiceOverlayState, string> = {
  idle: 'Tap to start',
  listening: 'Ready and listening',
  processing: 'Just a sec...',
  speaking: 'Tap anywhere to interrupt',
};

export function VoiceOverlay({
  isOpen,
  state,
  onTapAnywhere,
  onClose,
  onAttach,
  audioIntensity = 0.5,
  transcript,
  response,
  className = '',
}: VoiceOverlayProps) {
  const prefersReducedMotion = useReducedMotion();

  // Handle tap anywhere on the overlay
  const handleOverlayTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-control-button]')) {
      return;
    }

    log.action(`tap_anywhere state=${state}`);

    if (state === 'listening' || state === 'speaking') {
      onTapAnywhere();
    }
  }, [state, onTapAnywhere]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    log.info('Keyboard shortcuts registered');

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          log.action('escape_pressed');
          onClose();
          break;
        case ' ': // Spacebar
          e.preventDefault();
          log.action('spacebar_pressed');
          if (state === 'listening' || state === 'speaking') {
            onTapAnywhere();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      log.info('Keyboard shortcuts unregistered');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, state, onTapAnywhere, onClose]);

  const getCenterButton = () => {
    switch (state) {
      case 'listening':
        return { icon: ArrowUp, label: 'Send' };
      case 'speaking':
      case 'processing':
        return { icon: Square, label: 'Stop' };
      default:
        return { icon: ArrowUp, label: 'Send' };
    }
  };

  const centerButton = getCenterButton();

  // Determine if avatar should be "active" (pulsing)
  const isAvatarActive = state === 'speaking' || state === 'processing';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-[60] flex flex-col ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleOverlayTap}
          style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)',
          }}
        >
          {/* Ambient glow at bottom */}
          <VoiceAmbientGlow state={state} intensity={audioIntensity} />

          {/* Main content - centered */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            {/* Avatar with glow effect */}
            <motion.div
              className="relative mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                delay: 0.1,
              }}
            >
              {/* Glow ring behind avatar */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: state === 'speaking'
                    ? '0 0 60px 20px rgba(251, 146, 60, 0.3)'
                    : state === 'listening'
                    ? '0 0 40px 15px rgba(34, 197, 94, 0.2)'
                    : state === 'processing'
                    ? '0 0 50px 18px rgba(251, 191, 36, 0.25)'
                    : '0 0 20px 10px rgba(255, 255, 255, 0.05)',
                  scale: state === 'speaking' ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  boxShadow: { duration: 0.5 },
                  scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                }}
                style={{ transform: 'translate(-10%, -10%)', width: '120%', height: '120%' }}
              />
              <ClawAIAvatar size={120} isActive={isAvatarActive} />
            </motion.div>

            {/* Name */}
            <motion.h2
              className="text-white text-2xl font-semibold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              8gent
            </motion.h2>

            {/* Status text */}
            <motion.div
              key={state}
              className="text-center mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white/50 text-base">
                {STATUS_TEXT[state]}
              </span>
            </motion.div>

            {/* Live transcript/response display */}
            <AnimatePresence mode="wait">
              {(transcript || response) && (
                <motion.div
                  className="max-w-sm text-center px-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {state === 'listening' && transcript && (
                    <p className="text-white/70 text-sm italic">"{transcript}"</p>
                  )}
                  {(state === 'speaking' || state === 'processing') && response && (
                    <p className="text-white/80 text-sm leading-relaxed line-clamp-4">
                      {response}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom control area */}
          <div className="pb-10 px-4">
            {/* Control pill */}
            <motion.div
              className="flex items-center justify-center gap-2 mx-auto w-fit"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0.1 } : {
                type: 'spring',
                stiffness: 300,
                damping: 25,
                delay: 0.15,
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 40,
                padding: '8px 12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Attach button (optional) */}
              {onAttach && (
                <motion.button
                  data-control-button
                  onClick={(e) => {
                    e.stopPropagation();
                    log.action('attach_clicked');
                    onAttach();
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Attach file"
                >
                  <Plus size={20} />
                </motion.button>
              )}

              {/* Center action button */}
              <motion.button
                data-control-button
                onClick={(e) => {
                  e.stopPropagation();
                  log.action(`center_button_clicked state=${state}`);
                  onTapAnywhere();
                }}
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.95)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                aria-label={centerButton.label}
              >
                <centerButton.icon size={22} className="text-gray-800" />
              </motion.button>

              {/* Close button */}
              <motion.button
                data-control-button
                onClick={(e) => {
                  e.stopPropagation();
                  log.action('close_clicked');
                  onClose();
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close voice mode"
              >
                <X size={20} />
              </motion.button>
            </motion.div>
          </div>

          {/* Screen reader announcements */}
          <div role="status" aria-live="polite" className="sr-only">
            {state === 'listening' && 'Listening for your voice'}
            {state === 'processing' && 'Processing your message'}
            {state === 'speaking' && '8gent is speaking. Tap to interrupt.'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VoiceOverlay;
