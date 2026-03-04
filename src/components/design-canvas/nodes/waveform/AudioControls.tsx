'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Repeat,
  Shuffle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { springs } from '@/components/motion/config';

export interface AudioControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentTime: number;
  duration: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showVolumeSlider?: boolean;
  className?: string;
}

export function AudioControls({
  isPlaying,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  currentTime,
  duration,
  disabled = false,
  size = 'md',
  showVolumeSlider = true,
  className,
}: AudioControlsProps) {
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);

  const sizeConfig = {
    sm: { icon: 'w-3.5 h-3.5', playIcon: 'w-4 h-4', playBtn: 'w-8 h-8', btn: 'w-6 h-6 p-1' },
    md: { icon: 'w-4 h-4', playIcon: 'w-5 h-5', playBtn: 'w-10 h-10', btn: 'w-8 h-8 p-1.5' },
    lg: { icon: 'w-5 h-5', playIcon: 'w-6 h-6', playBtn: 'w-12 h-12', btn: 'w-10 h-10 p-2' },
  };

  const config = sizeConfig[size];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Transport Controls */}
      <div className="flex items-center gap-1">
        {/* Skip Back */}
        <motion.button
          onClick={onSkipBack}
          disabled={disabled}
          className={cn(
            'rounded-lg flex items-center justify-center',
            'text-muted-foreground hover:text-foreground',
            'hover:bg-accent/50 active:bg-accent',
            'transition-colors duration-150',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            config.btn
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SkipBack className={config.icon} />
        </motion.button>

        {/* Play/Pause */}
        <motion.button
          onClick={onPlayPause}
          disabled={disabled}
          className={cn(
            'rounded-full flex items-center justify-center',
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90 active:bg-primary/80',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'shadow-lg shadow-primary/20',
            'transition-all duration-200',
            config.playBtn
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          animate={{
            boxShadow: isPlaying
              ? ['0 4px 12px rgba(139, 92, 246, 0.3)', '0 4px 20px rgba(139, 92, 246, 0.5)', '0 4px 12px rgba(139, 92, 246, 0.3)']
              : '0 4px 12px rgba(139, 92, 246, 0.3)',
          }}
          transition={{
            boxShadow: {
              duration: 1.5,
              repeat: isPlaying ? Infinity : 0,
              ease: 'easeInOut',
            },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isPlaying ? 'pause' : 'play'}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={springs.snappy}
            >
              {isPlaying ? (
                <Pause className={config.playIcon} />
              ) : (
                <Play className={cn(config.playIcon, 'ml-0.5')} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Skip Forward */}
        <motion.button
          onClick={onSkipForward}
          disabled={disabled}
          className={cn(
            'rounded-lg flex items-center justify-center',
            'text-muted-foreground hover:text-foreground',
            'hover:bg-accent/50 active:bg-accent',
            'transition-colors duration-150',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            config.btn
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SkipForward className={config.icon} />
        </motion.button>
      </div>

      {/* Volume Control */}
      <div
        className="relative flex items-center gap-1.5"
        onMouseEnter={() => setIsVolumeHovered(true)}
        onMouseLeave={() => setIsVolumeHovered(false)}
      >
        <motion.button
          onClick={onToggleMute}
          className={cn(
            'rounded-lg flex items-center justify-center',
            'text-muted-foreground hover:text-foreground',
            'hover:bg-accent/50 active:bg-accent',
            'transition-colors duration-150',
            config.btn
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <VolumeIcon className={config.icon} />
        </motion.button>

        {/* Volume Slider */}
        <AnimatePresence>
          {(showVolumeSlider || isVolumeHovered) && (
            <motion.div
              className="flex items-center"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 80, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={springs.snappy}
            >
              <div className="relative w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                {/* Volume Fill */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary rounded-full"
                  style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                  layout
                  transition={springs.snappy}
                />

                {/* Slider Input */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {/* Volume Thumb */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-md"
                  style={{ left: `calc(${(isMuted ? 0 : volume) * 100}% - 6px)` }}
                  whileHover={{ scale: 1.2 }}
                  transition={springs.snappy}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Time Display */}
      <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground ml-auto">
        <span className="tabular-nums">{formatTime(currentTime)}</span>
        <span className="text-foreground/30">/</span>
        <span className="tabular-nums opacity-70">{formatTime(duration)}</span>
      </div>
    </div>
  );
}

export default AudioControls;
