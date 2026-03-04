'use client';

import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { springs } from '@/components/motion/config';

interface VoiceCallButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: number;
  className?: string;
}

export function VoiceCallButton({
  onClick,
  disabled = false,
  size = 20,
  className = '',
}: VoiceCallButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex items-center justify-center
        text-foreground/70 hover:text-[hsl(var(--theme-primary))]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-150
        ${className}
      `}
      whileHover={disabled ? {} : { scale: 1.1 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={springs.snappy}
      aria-label="Start voice call with 8gent"
    >
      <Phone size={size} />
    </motion.button>
  );
}

export default VoiceCallButton;
