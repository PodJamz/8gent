'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Beat } from '../AudioBeatSyncNode';

interface BeatLegendProps {
  beats: Beat[];
  showCounts?: boolean;
  className?: string;
}

const BEAT_CONFIG = {
  kick: {
    color: 'bg-red-500',
    label: 'Kick',
    ring: 'ring-red-500/30',
  },
  snare: {
    color: 'bg-blue-500',
    label: 'Snare',
    ring: 'ring-blue-500/30',
  },
  hihat: {
    color: 'bg-yellow-500',
    label: 'Hi-hat',
    ring: 'ring-yellow-500/30',
  },
  crash: {
    color: 'bg-pink-500',
    label: 'Crash',
    ring: 'ring-pink-500/30',
  },
  other: {
    color: 'bg-gray-400',
    label: 'Other',
    ring: 'ring-gray-400/30',
  },
};

export function BeatLegend({ beats, showCounts = true, className }: BeatLegendProps) {
  // Count beats by type
  const beatCounts = beats.reduce((acc, beat) => {
    acc[beat.type] = (acc[beat.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const downbeatCount = beats.filter(b => b.isDownbeat).length;

  return (
    <div className={cn('flex flex-wrap items-center gap-3 text-[10px]', className)}>
      {Object.entries(BEAT_CONFIG).map(([type, config]) => {
        const count = beatCounts[type] || 0;
        if (count === 0 && showCounts) return null;

        return (
          <motion.div
            key={type}
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className={cn('w-2.5 h-2.5 rounded-full ring-2', config.color, config.ring)} />
            <span className="text-muted-foreground">
              {config.label}
              {showCounts && count > 0 && (
                <span className="ml-1 font-mono text-foreground/70">({count})</span>
              )}
            </span>
          </motion.div>
        );
      })}

      {/* Downbeat indicator */}
      <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border/50">
        <div className="w-4 h-0.5 bg-white ring-1 ring-white/40 rounded-full" />
        <span className="text-muted-foreground">
          Downbeat
          {showCounts && downbeatCount > 0 && (
            <span className="ml-1 font-mono text-foreground/70">({downbeatCount})</span>
          )}
        </span>
      </div>
    </div>
  );
}

export default BeatLegend;
