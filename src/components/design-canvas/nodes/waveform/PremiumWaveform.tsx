'use client';

import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { springs, motionConfig } from '@/components/motion/config';
import type { Beat, Section } from '../AudioBeatSyncNode';

// =============================================================================
// TYPES
// =============================================================================

export interface PremiumWaveformProps {
  /** Normalized waveform data (0-1 values) */
  waveformData: number[];
  /** Beat markers with timing and type */
  beats: Beat[];
  /** Song sections for background coloring */
  sections: Section[];
  /** Current playback time in seconds */
  currentTime: number;
  /** Total duration in seconds */
  duration: number;
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Callback when user seeks to a position */
  onSeek: (timeSeconds: number) => void;
  /** Width of the component */
  width: number;
  /** Height of the waveform area */
  height?: number;
  /** Whether to show beat markers */
  showBeats?: boolean;
  /** Whether to show section labels */
  showSections?: boolean;
  /** Custom accent color (defaults to theme primary) */
  accentColor?: string;
}

// Color palette for sections (theme-aware with fallbacks)
const SECTION_COLORS: Record<string, { bg: string; border: string; glow: string }> = {
  intro: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)', glow: 'rgba(59, 130, 246, 0.3)' },
  verse: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.4)', glow: 'rgba(34, 197, 94, 0.3)' },
  prechorus: { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)', glow: 'rgba(168, 85, 247, 0.3)' },
  chorus: { bg: 'rgba(168, 85, 247, 0.2)', border: 'rgba(168, 85, 247, 0.5)', glow: 'rgba(168, 85, 247, 0.4)' },
  bridge: { bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.4)', glow: 'rgba(249, 115, 22, 0.3)' },
  outro: { bg: 'rgba(107, 114, 128, 0.15)', border: 'rgba(107, 114, 128, 0.4)', glow: 'rgba(107, 114, 128, 0.3)' },
  break: { bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.4)', glow: 'rgba(236, 72, 153, 0.3)' },
  solo: { bg: 'rgba(234, 179, 8, 0.15)', border: 'rgba(234, 179, 8, 0.4)', glow: 'rgba(234, 179, 8, 0.3)' },
};

// Beat colors
const BEAT_COLORS = {
  kick: { color: '#EF4444', glow: 'rgba(239, 68, 68, 0.6)' },
  snare: { color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.6)' },
  hihat: { color: '#EAB308', glow: 'rgba(234, 179, 8, 0.4)' },
  crash: { color: '#EC4899', glow: 'rgba(236, 72, 153, 0.6)' },
  other: { color: '#6B7280', glow: 'rgba(107, 114, 128, 0.4)' },
};

// =============================================================================
// COMPONENT
// =============================================================================

export function PremiumWaveform({
  waveformData,
  beats,
  sections,
  currentTime,
  duration,
  isPlaying,
  onSeek,
  width,
  height = 120,
  showBeats = true,
  showSections = true,
  accentColor,
}: PremiumWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeBeat, setActiveBeat] = useState<Beat | null>(null);

  // Spring-animated playhead position for smooth movement
  const playheadProgress = useSpring(0, { ...springs.smooth, bounce: 0 });

  // Memoize computed values
  const progressPercent = useMemo(() =>
    duration > 0 ? (currentTime / duration) * 100 : 0
  , [currentTime, duration]);

  // Update spring value when currentTime changes
  useEffect(() => {
    playheadProgress.set(progressPercent);
  }, [progressPercent, playheadProgress]);

  // Find current section
  const currentSection = useMemo(() => {
    if (!sections.length || !duration) return null;
    const currentMs = currentTime * 1000;
    return sections.find(s => currentMs >= s.startMs && currentMs < s.endMs);
  }, [sections, currentTime, duration]);

  // Find active beat (within 50ms of current time)
  useEffect(() => {
    if (!isPlaying || !beats.length) {
      setActiveBeat(null);
      return;
    }

    const currentMs = currentTime * 1000;
    const nearBeat = beats.find(b =>
      Math.abs(b.timeMs - currentMs) < 50 && b.intensity > 0.5
    );

    if (nearBeat) {
      setActiveBeat(nearBeat);
      // Clear after animation duration
      const timeout = setTimeout(() => setActiveBeat(null), 150);
      return () => clearTimeout(timeout);
    }
  }, [currentTime, beats, isPlaying]);

  // =============================================================================
  // CANVAS RENDERING
  // =============================================================================

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveformData.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const centerY = h / 2;
    const barWidth = w / waveformData.length;
    const playedWidth = duration > 0 ? (currentTime / duration) * w : 0;

    ctx.clearRect(0, 0, w * dpr, h * dpr);
    ctx.scale(dpr, dpr);

    // -- Draw section backgrounds --
    if (showSections && sections.length && duration > 0) {
      sections.forEach(section => {
        const startX = (section.startMs / 1000 / duration) * w;
        const endX = (section.endMs / 1000 / duration) * w;
        const sectionWidth = endX - startX;
        const colors = SECTION_COLORS[section.type] || SECTION_COLORS.verse;

        // Section background
        ctx.fillStyle = colors.bg;
        ctx.fillRect(startX, 0, sectionWidth, h);

        // Section border (left edge)
        if (section.startMs > 0) {
          ctx.fillStyle = colors.border;
          ctx.fillRect(startX, 0, 1, h);
        }
      });
    }

    // -- Draw waveform bars --
    waveformData.forEach((amplitude, i) => {
      const x = i * barWidth;
      const barHeight = Math.max(2, amplitude * h * 0.85);
      const isPlayed = x < playedWidth;

      // Create gradient for each bar
      const gradient = ctx.createLinearGradient(x, centerY - barHeight / 2, x, centerY + barHeight / 2);

      if (isPlayed) {
        // Played portion - vibrant accent color
        gradient.addColorStop(0, accentColor || 'rgba(168, 85, 247, 0.9)');
        gradient.addColorStop(0.5, accentColor || 'rgba(139, 92, 246, 1)');
        gradient.addColorStop(1, accentColor || 'rgba(168, 85, 247, 0.9)');
      } else {
        // Unplayed portion - muted
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
        gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.35)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.25)');
      }

      ctx.fillStyle = gradient;

      // Draw mirrored bars (top and bottom from center)
      const gap = Math.max(1, barWidth * 0.15);
      ctx.fillRect(x, centerY - barHeight / 2, barWidth - gap, barHeight);
    });

    // -- Draw beat markers --
    if (showBeats && beats.length && duration > 0) {
      beats.forEach(beat => {
        const x = (beat.timeMs / 1000 / duration) * w;
        const beatColors = BEAT_COLORS[beat.type] || BEAT_COLORS.other;

        // Draw beat line
        ctx.beginPath();
        ctx.strokeStyle = beatColors.color;
        ctx.lineWidth = beat.isDownbeat ? 2.5 : 1.5;
        ctx.globalAlpha = beat.intensity * 0.7;

        // Dashed line for non-downbeats
        if (!beat.isDownbeat) {
          ctx.setLineDash([2, 4]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);

        // Draw downbeat indicators (small circles at top)
        if (beat.isDownbeat) {
          ctx.beginPath();
          ctx.fillStyle = beatColors.color;
          ctx.arc(x, 6, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // -- Draw hover time indicator --
    if (hoveredTime !== null && duration > 0) {
      const hoverX = (hoveredTime / duration) * w;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.moveTo(hoverX, 0);
      ctx.lineTo(hoverX, h);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [waveformData, beats, sections, currentTime, duration, showBeats, showSections, hoveredTime, accentColor]);

  // Set up canvas with proper DPR
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }, [width, height]);

  // Animation loop for smooth rendering
  useEffect(() => {
    const animate = () => {
      drawWaveform();
      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawWaveform, isPlaying]);

  // Redraw on data changes
  useEffect(() => {
    drawWaveform();
  }, [drawWaveform, waveformData, beats, sections, currentTime, hoveredTime]);

  // =============================================================================
  // INTERACTION HANDLERS
  // =============================================================================

  const getTimeFromPosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container || !duration) return 0;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    return percent * duration;
  }, [duration]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const time = getTimeFromPosition(e.clientX);
    setHoveredTime(time);

    if (isDragging) {
      onSeek(time);
    }
  }, [getTimeFromPosition, isDragging, onSeek]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    const time = getTimeFromPosition(e.clientX);
    onSeek(time);
  }, [getTimeFromPosition, onSeek]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredTime(null);
    setIsDragging(false);
  }, []);

  // Global mouse up handler for drag release
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="relative">
      {/* Waveform Container */}
      <div
        ref={containerRef}
        className={cn(
          'relative rounded-xl overflow-hidden cursor-pointer',
          'bg-gradient-to-b from-background/50 to-muted/30',
          'ring-1 ring-border/30',
          'transition-shadow duration-200',
          isDragging && 'ring-2 ring-primary/50 shadow-lg shadow-primary/20'
        )}
        style={{ width, height }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Canvas Layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ width, height }}
        />

        {/* Animated Playhead */}
        <motion.div
          className="absolute top-0 bottom-0 w-0.5 pointer-events-none z-10"
          style={{
            left: useTransform(playheadProgress, v => `${v}%`),
            background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.8), rgba(34, 197, 94, 1), rgba(34, 197, 94, 0.8))',
            boxShadow: isPlaying
              ? '0 0 8px rgba(34, 197, 94, 0.8), 0 0 16px rgba(34, 197, 94, 0.4)'
              : '0 0 4px rgba(34, 197, 94, 0.5)',
          }}
        >
          {/* Playhead Handle */}
          <motion.div
            className={cn(
              'absolute -top-1 left-1/2 -translate-x-1/2',
              'w-3 h-3 rounded-full',
              'bg-green-500 border-2 border-white shadow-lg'
            )}
            animate={{
              scale: isPlaying ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: isPlaying ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Beat Flash Overlay */}
        <AnimatePresence>
          {activeBeat && (
            <motion.div
              key={activeBeat.timeMs}
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                background: activeBeat.isDownbeat
                  ? `radial-gradient(circle at 50% 50%, ${BEAT_COLORS[activeBeat.type].glow}, transparent 70%)`
                  : 'transparent',
              }}
            />
          )}
        </AnimatePresence>

        {/* Hover Time Tooltip */}
        <AnimatePresence>
          {hoveredTime !== null && !isDragging && (
            <motion.div
              className={cn(
                'absolute top-2 px-2 py-1 rounded-md',
                'bg-background/90 backdrop-blur-sm',
                'text-xs font-mono text-foreground',
                'border border-border/50 shadow-lg',
                'pointer-events-none z-20'
              )}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={springs.snappy}
              style={{
                left: `${(hoveredTime / duration) * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {formatTime(hoveredTime)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section Labels */}
      {showSections && sections.length > 0 && (
        <div className="flex gap-0.5 mt-2" style={{ width }}>
          {sections.map((section, i) => {
            const sectionWidth = ((section.endMs - section.startMs) / 1000 / duration) * 100;
            const colors = SECTION_COLORS[section.type] || SECTION_COLORS.verse;
            const isActive = currentSection?.startMs === section.startMs;

            return (
              <motion.div
                key={i}
                className={cn(
                  'relative rounded-md px-1.5 py-1',
                  'text-[10px] font-medium text-center truncate',
                  'border transition-all duration-200',
                  isActive && 'ring-1 ring-primary/50'
                )}
                style={{
                  width: `${sectionWidth}%`,
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  boxShadow: isActive ? `0 0 8px ${colors.glow}` : 'none',
                }}
                animate={{
                  scale: isActive ? 1.02 : 1,
                }}
                transition={springs.snappy}
              >
                <span className="opacity-80">{section.label}</span>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Time Display */}
      <div className="flex justify-between mt-2 px-1 text-xs font-mono text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span className="text-foreground/60">
          {currentSection && (
            <span className="mr-2 text-primary">{currentSection.label}</span>
          )}
        </span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

export default PremiumWaveform;
