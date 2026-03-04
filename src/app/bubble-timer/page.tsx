'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/ios';
import { FadeInUp, InView } from '@/components/motion';
import { springs } from '@/components/motion/config';
import { cn } from '@/lib/utils';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';

// Bubble component with individual physics
interface BubbleProps {
  id: number;
  isPopping: boolean;
  delay: number;
  size: 'sm' | 'md' | 'lg';
  horizontalOffset: number;
}

function Bubble({ id, isPopping, delay, size, horizontalOffset }: BubbleProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const wobbleAmount = useMemo(() => Math.random() * 10 - 5, []);

  return (
    <motion.div
      key={id}
      initial={{
        opacity: 0,
        scale: 0,
        y: 100,
        x: horizontalOffset,
      }}
      animate={isPopping ? {
        opacity: [1, 1, 0],
        scale: [1, 1.3, 0],
        y: [-20, -60],
        transition: {
          duration: 0.5,
          ease: 'easeOut',
        }
      } : {
        opacity: 1,
        scale: 1,
        y: 0,
        x: [horizontalOffset, horizontalOffset + wobbleAmount, horizontalOffset],
        transition: {
          y: { delay: delay * 0.02, duration: 0.6, ease: 'easeOut' },
          x: { delay: delay * 0.02, duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
          opacity: { delay: delay * 0.02, duration: 0.3 },
          scale: { delay: delay * 0.02, duration: 0.4, type: 'spring', stiffness: 300, damping: 15 },
        }
      }}
      className={cn(
        sizeClasses[size],
        'rounded-full relative flex-shrink-0',
        'bg-gradient-to-br from-cyan-300/80 via-blue-400/70 to-blue-500/60',
        'shadow-lg shadow-cyan-500/20'
      )}
      style={{
        boxShadow: 'inset -2px -2px 4px rgba(255,255,255,0.4), inset 2px 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* Highlight/reflection */}
      <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white/60" />
    </motion.div>
  );
}

// Popping bubble particles
function PopParticles({ x, y }: { x: number; y: number }) {
  const particles = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      angle: (i / 6) * Math.PI * 2,
      distance: 20 + Math.random() * 15,
    })), []);

  return (
    <AnimatePresence>
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          initial={{
            opacity: 1,
            scale: 1,
            x: x,
            y: y,
          }}
          animate={{
            opacity: 0,
            scale: 0,
            x: x + Math.cos(particle.angle) * particle.distance,
            y: y + Math.sin(particle.angle) * particle.distance,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/60"
        />
      ))}
    </AnimatePresence>
  );
}

// Time presets
const TIME_PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '1m', seconds: 60 },
  { label: '2m', seconds: 120 },
  { label: '3m', seconds: 180 },
  { label: '5m', seconds: 300 },
];

export default function BubbleTimerPage() {
  // Timer state
  const [totalSeconds, setTotalSeconds] = useState(60); // Default 1 minute
  const [remainingSeconds, setRemainingSeconds] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Track popping bubbles
  const [poppingBubbles, setPoppingBubbles] = useState<Set<number>>(new Set());
  const lastPoppedRef = useRef<number>(totalSeconds);

  // Audio refs
  const popSoundRef = useRef<HTMLAudioElement | null>(null);
  const completeSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create pop sound using Web Audio API for better performance
    popSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJCstIqAi5CYg3R1cYKUlZKIi4yMiISAgomMi4qLjIuIhYWHioqLjIuKiYiHhoeIiYqLi4uKiYiHhoeHiImKi4uLioqJiIeHh4iJiouLi4qKiYiHh4eIiImKi4uLiomIh4eHh4iJiouLi4qJiIeHh4eIiYqLi4uKiYiHh4eHiIiKi4uLiomIh4eHh4iJiouLi4qJiIeHh4eIiImKi4uKiYmIh4eHh4iJiouLiomJiIeHh4eIiYqLi4qJiYiHh4eHiImKi4uKiYmIh4eHh4iJiouLiomJiIeHh4eIiYmKi4qKiYiIh4eHh4iJi4uKiomJiIeHh4eIiYqLi4qJiYiHh4eHiImKi4uKiYmIh4eHh4iJiouLiomJiIeHh4eIiYqLi4qJiYiHh4eHiImKi4uKiYmIh4eHh4iJiouLiomJiIeHh4eIiYqLi4qJiYiHh4eHiImKi4uKiYmIh4eHh4iJiouLiomJiIeHh4eHiYqLi4qJiYiHh4eHiImKi4uKiYmIh4eHh4iJiouLiomJiIeHh4eIiYqLi4qJiYiHh4eHiImKi4uKiYmIh4eHh4iJiouLiomJiIeHh4eIiYqLi4qJiYiHh4eHiImKi4uKiYmIh4eHh4iJiouLiomJiIeHh4eIiYqLi4qJiYiHh4eHiImKi4uKiYmIh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4c=');
    return () => {
      popSoundRef.current = null;
      completeSoundRef.current = null;
    };
  }, []);

  // Play pop sound
  const playPopSound = useCallback(() => {
    if (soundEnabled && popSoundRef.current) {
      const sound = popSoundRef.current.cloneNode() as HTMLAudioElement;
      sound.volume = 0.2;
      sound.play().catch(() => { });
    }
  }, [soundEnabled]);

  // Timer logic
  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        const next = prev - 1;

        // Mark bubble as popping
        if (next >= 0 && next < lastPoppedRef.current) {
          setPoppingBubbles(prevPopping => {
            const newSet = new Set(prevPopping);
            newSet.add(next);
            return newSet;
          });
          lastPoppedRef.current = next;
          playPopSound();

          // Remove from popping set after animation
          setTimeout(() => {
            setPoppingBubbles(prevPopping => {
              const newSet = new Set(prevPopping);
              newSet.delete(next);
              return newSet;
            });
          }, 500);
        }

        if (next <= 0) {
          setIsRunning(false);
          setIsComplete(true);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds, playPopSound]);

  // Generate bubble data
  const bubbles = useMemo(() => {
    return Array.from({ length: totalSeconds }, (_, i) => ({
      id: i,
      size: ['sm', 'md', 'lg'][Math.floor(Math.random() * 3)] as 'sm' | 'md' | 'lg',
      horizontalOffset: Math.random() * 60 - 30,
    }));
  }, [totalSeconds]);

  // Visible bubbles (not yet popped)
  const visibleBubbles = useMemo(() => {
    return bubbles.filter(b => b.id < remainingSeconds);
  }, [bubbles, remainingSeconds]);

  // Controls
  const handleStart = () => {
    if (remainingSeconds <= 0) {
      handleReset();
    }
    setIsRunning(true);
    setIsComplete(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    setPoppingBubbles(new Set());
    lastPoppedRef.current = totalSeconds;
    setIsComplete(false);
  };

  const adjustTime = (delta: number) => {
    if (isRunning) return;
    const newTotal = Math.max(5, Math.min(600, totalSeconds + delta));
    setTotalSeconds(newTotal);
    setRemainingSeconds(newTotal);
    lastPoppedRef.current = newTotal;
    setIsComplete(false);
  };

  const setPresetTime = (seconds: number) => {
    if (isRunning) return;
    setTotalSeconds(seconds);
    setRemainingSeconds(seconds);
    lastPoppedRef.current = seconds;
    setIsComplete(false);
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-cyan-950 text-white overflow-hidden">
        {/* Ambient background bubbles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-cyan-500/5"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                bottom: '-100px',
              }}
              animate={{
                y: [0, -1200],
                x: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.smooth}
            className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
          >
            <div className="max-w-lg mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm">8gent</span>
                </Link>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <Timer className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold">Bubble Timer</span>
                </div>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </motion.header>

          {/* Main content */}
          <main className="max-w-lg mx-auto px-4 py-8">
            <InView>
              {/* Time display */}
              <FadeInUp>
                <div className="text-center mb-6">
                  <motion.div
                    className="text-7xl font-bold font-mono tracking-tight"
                    animate={{
                      scale: isRunning ? [1, 1.02, 1] : 1,
                    }}
                    transition={{
                      duration: 1,
                      repeat: isRunning ? Infinity : 0,
                    }}
                  >
                    {formatTime(remainingSeconds)}
                  </motion.div>
                  <p className="text-white/50 mt-2">
                    {isComplete ? 'Time\'s up!' : `${remainingSeconds} bubble${remainingSeconds !== 1 ? 's' : ''} remaining`}
                  </p>
                </div>
              </FadeInUp>

              {/* Bubble tube visualization */}
              <FadeInUp delay={0.1}>
                <div className="relative mb-8">
                  {/* Tube container */}
                  <div
                    className={cn(
                      "relative mx-auto w-48 rounded-3xl overflow-hidden",
                      "bg-gradient-to-b from-slate-800/50 to-slate-900/50",
                      "border border-white/10",
                      "shadow-inner shadow-black/30"
                    )}
                    style={{ height: '320px' }}
                  >
                    {/* Water effect */}
                    <div
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyan-600/20 via-blue-500/10 to-transparent"
                      style={{ height: `${100 - progress}%` }}
                    />

                    {/* Bubbles container */}
                    <div className="absolute inset-4 flex flex-wrap content-end justify-center gap-1 overflow-hidden">
                      <AnimatePresence mode="popLayout">
                        {visibleBubbles.map((bubble, index) => (
                          <Bubble
                            key={bubble.id}
                            id={bubble.id}
                            isPopping={poppingBubbles.has(bubble.id)}
                            delay={index}
                            size={bubble.size}
                            horizontalOffset={bubble.horizontalOffset}
                          />
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Glass reflection */}
                    <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white/5 to-transparent" />

                    {/* Tube cap top */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-slate-700 to-slate-800 rounded-t-3xl border-b border-white/10" />

                    {/* Tube cap bottom */}
                    <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-slate-700 to-slate-800 rounded-b-3xl border-t border-white/10" />
                  </div>

                  {/* Completion celebration */}
                  <AnimatePresence>
                    {isComplete && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 shadow-2xl shadow-cyan-500/30">
                          <Sparkles className="w-12 h-12 text-white mx-auto mb-2" />
                          <p className="text-white font-bold text-xl">Done!</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeInUp>

              {/* Time adjustment (only when not running) */}
              {!isRunning && !isComplete && (
                <FadeInUp delay={0.2}>
                  <div className="mb-6">
                    {/* +/- buttons */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <button
                        onClick={() => adjustTime(-10)}
                        className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-white/70 text-sm w-24 text-center">
                        Adjust time
                      </span>
                      <button
                        onClick={() => adjustTime(10)}
                        className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Presets */}
                    <div className="flex justify-center gap-2 flex-wrap">
                      {TIME_PRESETS.map(preset => (
                        <button
                          key={preset.seconds}
                          onClick={() => setPresetTime(preset.seconds)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            totalSeconds === preset.seconds
                              ? "bg-cyan-500 text-white"
                              : "bg-white/10 hover:bg-white/20 text-white/70"
                          )}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </FadeInUp>
              )}

              {/* Controls */}
              <FadeInUp delay={0.3}>
                <div className="flex justify-center gap-4">
                  {/* Reset button */}
                  <button
                    onClick={handleReset}
                    className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>

                  {/* Play/Pause button */}
                  <motion.button
                    onClick={isRunning ? handlePause : handleStart}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "w-20 h-20 rounded-full flex items-center justify-center transition-all",
                      "shadow-lg",
                      isRunning
                        ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30"
                        : "bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 shadow-cyan-500/30"
                    )}
                  >
                    {isRunning ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </motion.button>

                  {/* Spacer for symmetry */}
                  <div className="w-14 h-14" />
                </div>
              </FadeInUp>

              {/* Progress bar */}
              <FadeInUp delay={0.4}>
                <div className="mt-8">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-center text-white/40 text-xs mt-2">
                    {Math.round(progress)}% complete
                  </p>
                </div>
              </FadeInUp>
            </InView>
          </main>

          {/* Back button */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800/80 backdrop-blur-xl text-white text-sm hover:bg-slate-700/80 transition-colors border border-white/10 shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to 8gent
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
