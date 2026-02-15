'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useMusic } from '@/context/MusicContext';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { PerspectiveGrid } from '@/components/ui/perspective-grid';
import { Play, Pause, SkipBack, SkipForward, ChevronUp } from 'lucide-react';
import { springs, motionConfig } from '@/components/motion/config';
import dynamic from 'next/dynamic';

// Dynamically import 3D tunnel to avoid SSR issues
const Tunnel3D = dynamic(
  () => import('@/components/ui/tunnel-3d').then(mod => ({ default: mod.Tunnel3D })),
  { ssr: false, loading: () => null }
);

interface LockScreenProps {
  onUnlock: () => void;
  onBackgroundReady?: () => void;
  backgroundReady?: boolean;
}

export function LockScreen({ onUnlock, onBackgroundReady, backgroundReady = false }: LockScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tunnelMounted, setTunnelMounted] = useState(false);
  const { currentTrack, isPlaying, currentTime: trackTime, duration, togglePlay, skipToNext, skipToPrevious } = useMusic();
  const prefersReducedMotion = useReducedMotion();

  // Track when tunnel is ready
  const handleTunnelReady = useCallback(() => {
    setTunnelMounted(true);
    onBackgroundReady?.();
  }, [onBackgroundReady]);

  // Auto-trigger ready for reduced motion users
  useEffect(() => {
    if (prefersReducedMotion && !backgroundReady) {
      onBackgroundReady?.();
    }
  }, [prefersReducedMotion, backgroundReady, onBackgroundReady]);

  // Determine if UI should show (background ready or after timeout)
  const showUI = backgroundReady || tunnelMounted || prefersReducedMotion;

  const y = useMotionValue(0);
  const opacity = useTransform(y, [-150, 0], [0, 1]);
  const scale = useTransform(y, [-150, 0], [1.05, 1]);
  const blur = useTransform(y, [-150, 0], [20, 0]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTrackTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (trackTime / duration) * 100 : 0;

  const handleDragEnd = useCallback(() => {
    if (y.get() < -100) {
      // Trigger unlock with smooth animation
      animate(y, -300, {
        ...springs.smooth,
        onComplete: onUnlock,
      });
    } else {
      // Snap back with snappy spring
      animate(y, 0, springs.snappy);
    }
  }, [y, onUnlock]);

  // Handle tap on bottom area to unlock
  const handleUnlockTap = useCallback(() => {
    if (prefersReducedMotion) {
      // Skip animation for reduced motion
      onUnlock();
      return;
    }
    animate(y, -300, {
      ...springs.smooth,
      onComplete: onUnlock,
    });
  }, [y, onUnlock, prefersReducedMotion]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden select-none"
      style={{
        opacity,
        scale,
        filter: useTransform(blur, (v) => `blur(${v}px)`),
      }}
      drag="y"
      dragConstraints={{ top: -300, bottom: 0 }}
      dragElastic={motionConfig.drag.elastic}
      onDragEnd={handleDragEnd}
      onDrag={(_, info) => {
        y.set(info.offset.y);
      }}
    >
      {/* 3D Tunnel Background - Loads first, always visible */}
      {!prefersReducedMotion ? (
        <Tunnel3D speed={0.4} lineColor="#475569" onReady={handleTunnelReady} />
      ) : (
        <>
          {/* Fallback for reduced motion */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950" />
          <PerspectiveGrid
            lineColor="rgba(148, 163, 184, 0.12)"
            glowColor="rgba(99, 155, 255, 0.25)"
            vanishY={0.32}
            gridLines={28}
            horizontalLines={14}
            animated={false}
          />
        </>
      )}

      {/* Subtle vignette overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse at center 40%, transparent 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* UI Components - Only animate in after background is ready */}
      <AnimatePresence>
        {showUI && (
          <>
            {/* Top section - Time & Date */}
            <motion.div
              className="relative z-10 pt-16 sm:pt-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ...springs.smooth }}
            >
              <div className="text-white/60 text-sm sm:text-base font-medium mb-1">
                {formatDate(currentTime)}
              </div>
              <div className="text-white text-7xl sm:text-8xl md:text-9xl font-thin tracking-tight">
                {formatTime(currentTime)}
              </div>
            </motion.div>

            {/* Middle section - Profile & Greeting */}
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, ...springs.smooth }}
                className="mb-6"
              >
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl">
                    <img
                      src="/openclaw-logo.png"
                      alt="OpenClaw-OS"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Online indicator */}
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, ...springs.smooth }}
                className="text-center mb-8"
              >
                <div className="text-white/40 text-xs uppercase tracking-widest mb-2">Welcome to</div>
                <div className="text-white text-2xl sm:text-3xl font-bold tracking-tight">OpenClaw-OS</div>
                <div className="text-white/50 text-sm mt-2 max-w-[280px] leading-relaxed">
                  Your AI-native operating system
                </div>
              </motion.div>

              {/* Music Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ...springs.smooth }}
              >
                <LiquidGlass
                  variant="card"
                  intensity="subtle"
                  className="w-[320px] sm:w-[360px] !p-4"
                  rippleEffect={false}
                >
                  <div className="flex items-center gap-4">
                    {/* Album Art */}
                    <div className="w-14 h-14 rounded-xl bg-white/10 flex-shrink-0 overflow-hidden">
                      {currentTrack.albumArt ? (
                        <img
                          src={currentTrack.albumArt}
                          alt={currentTrack.album}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🎵
                        </div>
                      )}
                    </div>

                    {/* Track Info & Controls */}
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">
                        {currentTrack.title}
                      </div>
                      <div className="text-white/50 text-xs truncate mb-2">
                        {currentTrack.artist}
                      </div>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/40 w-8">
                          {formatTrackTime(trackTime)}
                        </span>
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white/60 transition-all duration-150"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-white/40 w-8 text-right">
                          {formatTrackTime(duration)}
                        </span>
                      </div>
                    </div>

                    {/* Play Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); skipToPrevious(); }}
                        className="p-2 text-white/60 hover:text-white transition-colors"
                      >
                        <SkipBack className="w-4 h-4" fill="currentColor" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                        className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" fill="currentColor" />
                        ) : (
                          <Play className="w-5 h-5" fill="currentColor" />
                        )}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); skipToNext(); }}
                        className="p-2 text-white/60 hover:text-white transition-colors"
                      >
                        <SkipForward className="w-4 h-4" fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </LiquidGlass>
              </motion.div>
            </div>

            {/* Bottom section - Unlock hint (tappable) */}
            <motion.div
              className="relative z-10 pb-12 sm:pb-16 text-center cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, ...springs.smooth }}
              onClick={handleUnlockTap}
              whileTap={{ scale: 0.95 }}
              style={{ paddingTop: '60px', marginTop: '-60px' }} // Larger tap target
            >
              <motion.div
                animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="flex flex-col items-center text-white/40"
              >
                <ChevronUp className="w-6 h-6 mb-1" />
                <span className="text-sm font-medium">Swipe to begin your journey</span>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
