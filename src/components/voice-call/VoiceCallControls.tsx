'use client';

import { motion } from 'framer-motion';
import { Mic, MicOff, Phone, Volume2, VolumeX } from 'lucide-react';
import { springs } from '@/components/motion/config';

interface VoiceCallControlsProps {
  isMuted: boolean;
  isSpeakerOn: boolean;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  onEndCall: () => void;
  disabled?: boolean;
  className?: string;
}

interface ControlButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  variant?: 'default' | 'end';
  ariaLabel: string;
  children: React.ReactNode;
}

function ControlButton({
  onClick,
  disabled = false,
  isActive = false,
  variant = 'default',
  ariaLabel,
  children,
}: ControlButtonProps) {
  const isEndButton = variant === 'end';

  const baseStyles = isEndButton
    ? {
        background: 'rgba(239, 68, 68, 0.9)',
        boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
      }
    : {
        background: isActive
          ? 'rgba(255, 255, 255, 0.2)'
          : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      };

  const hoverStyles = isEndButton
    ? {
        background: 'rgba(220, 38, 38, 0.95)',
        boxShadow: '0 0 40px rgba(239, 68, 68, 0.6)',
      }
    : {
        background: 'rgba(255, 255, 255, 0.2)',
      };

  const size = isEndButton ? 72 : 64;

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex items-center justify-center rounded-full
        text-white disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-150
      `}
      style={{
        width: size,
        height: size,
        ...baseStyles,
      }}
      whileHover={disabled ? {} : {
        scale: 1.1,
        ...hoverStyles,
      }}
      whileTap={disabled ? {} : { scale: isEndButton ? 0.85 : 0.9 }}
      transition={springs.snappy}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
}

export function VoiceCallControls({
  isMuted,
  isSpeakerOn,
  onToggleMute,
  onToggleSpeaker,
  onEndCall,
  disabled = false,
  className = '',
}: VoiceCallControlsProps) {
  return (
    <motion.div
      className={`flex items-center justify-center gap-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: 0.2,
      }}
    >
      {/* Mute button */}
      <ControlButton
        onClick={onToggleMute}
        disabled={disabled}
        isActive={isMuted}
        ariaLabel={isMuted ? 'Unmute microphone' : 'Mute microphone'}
      >
        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
      </ControlButton>

      {/* End call button */}
      <ControlButton
        onClick={onEndCall}
        disabled={disabled}
        variant="end"
        ariaLabel="End call"
      >
        <Phone size={28} className="rotate-[135deg]" />
      </ControlButton>

      {/* Speaker button */}
      <ControlButton
        onClick={onToggleSpeaker}
        disabled={disabled}
        isActive={!isSpeakerOn}
        ariaLabel={isSpeakerOn ? 'Turn off speaker' : 'Turn on speaker'}
      >
        {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </ControlButton>
    </motion.div>
  );
}

export default VoiceCallControls;
