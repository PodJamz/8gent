'use client';

import { motion } from 'framer-motion';
import { Mic, MicOff, Crown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ParticipantRole } from './types';

interface ClubSpacesParticipantProps {
  identity: string;
  name: string;
  role: ParticipantRole;
  isMuted: boolean;
  isSpeaking: boolean;
  audioLevel: number;
  hasRaisedHand: boolean;
  isLocal: boolean;
}

// Warm avatar colors - no purple
const AVATAR_COLORS = [
  '#f59e0b', // amber
  '#ef4444', // red
  '#10b981', // emerald
  '#3b82f6', // blue
  '#f97316', // orange
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
  '#14b8a6', // teal
  '#e11d48', // rose
];

function getAvatarColor(name: string): string {
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export function ClubSpacesParticipant({
  name,
  role,
  isMuted,
  isSpeaking,
  audioLevel,
  hasRaisedHand,
  isLocal,
}: ClubSpacesParticipantProps) {
  const avatarColor = getAvatarColor(name);
  const isOnStage = role === 'host' || role === 'co-host' || role === 'speaker';

  return (
    <motion.div
      className="flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar with speaking ring */}
      <div className="relative">
        {/* Speaking indicator ring */}
        {isSpeaking && (
          <motion.div
            className="absolute -inset-1 rounded-full border-[2.5px] border-amber-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        {/* Avatar circle */}
        <div
          className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white relative',
            isOnStage ? 'w-[72px] h-[72px]' : 'w-16 h-16'
          )}
          style={{ backgroundColor: avatarColor }}
        >
          {name.charAt(0).toUpperCase()}
        </div>

        {/* Mute indicator */}
        {isMuted && isOnStage && (
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-black">
            <MicOff className="w-2.5 h-2.5 text-white" />
          </div>
        )}

        {/* Role badge */}
        {role === 'host' && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border-2 border-black">
            <Crown className="w-2.5 h-2.5 text-black" />
          </div>
        )}
        {role === 'co-host' && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center border-2 border-black">
            <Star className="w-2.5 h-2.5 text-black" />
          </div>
        )}

        {/* Raised hand */}
        {hasRaisedHand && role === 'listener' && (
          <motion.div
            className="absolute -top-2 -right-2 text-base"
            initial={{ scale: 0 }}
            animate={{ scale: 1, y: [0, -3, 0] }}
            transition={{ y: { repeat: Infinity, duration: 1 } }}
          >
            ✋
          </motion.div>
        )}
      </div>

      {/* Name */}
      <div className="text-center max-w-[80px]">
        <p className={cn(
          'text-xs font-medium truncate',
          isLocal ? 'text-amber-500' : 'text-white/80'
        )}>
          {isLocal ? 'You' : name}
        </p>
        {role === 'host' && (
          <p className="text-[10px] text-amber-500/70 font-medium">HOST</p>
        )}
        {role === 'co-host' && (
          <p className="text-[10px] text-white/40 font-medium">CO-HOST</p>
        )}
      </div>
    </motion.div>
  );
}
