'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle, ListMusic, Share, MoreHorizontal } from 'lucide-react';
import { useMusic } from '@/context/MusicContext';
import { type Track } from '@/data/tracks';
import { EphemeralMusicChat } from './EphemeralMusicChat';

interface ExpandedNowPlayingProps {
  onShowQueue?: () => void;
  onShowPlaylist?: () => void;
}

// Simple waveform visualization from audio data
function Waveform({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Generate fake waveform bars (in real app, analyze audio)
  const bars = useMemo(() => {
    const count = 80;
    return Array.from({ length: count }, (_, i) => {
      // Create a somewhat realistic waveform shape
      const position = i / count;
      const base = Math.sin(position * Math.PI) * 0.5 + 0.5;
      const noise = Math.random() * 0.4;
      return Math.max(0.1, Math.min(1, base + noise - 0.2));
    });
  }, []);

  const progress = duration > 0 ? currentTime / duration : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || duration <= 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    onSeek(percent * duration);
  };

  return (
    <div
      ref={containerRef}
      className="relative h-24 cursor-pointer select-none"
      onClick={handleClick}
    >
      {/* Waveform bars */}
      <div className="absolute inset-0 flex items-center justify-center gap-[2px]">
        {bars.map((height, i) => {
          const barProgress = i / bars.length;
          const isPlayed = barProgress <= progress;

          return (
            <div
              key={i}
              className="w-[3px] rounded-full transition-all duration-150 ease-out"
              style={{
                height: `${height * 100}%`,
                backgroundColor: isPlayed
                  ? 'rgb(202 138 4)' // yellow-600 for light mode visibility
                  : 'rgb(161 161 170)', // zinc-400 for light, works in dark too
                transform: isPlayed ? 'scaleY(1.05)' : 'scaleY(1)',
              }}
            />
          );
        })}
      </div>

      {/* Playhead - smooth transition */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)] transition-[left] duration-100 ease-linear"
        style={{ left: `${progress * 100}%` }}
      />
    </div>
  );
}

// Format time as m:ss
function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Control button with press animation
function ControlButton({
  onClick,
  children,
  className = '',
  title,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      title={title}
    >
      {children}
    </motion.button>
  );
}

export function ExpandedNowPlaying({ onShowQueue, onShowPlaylist }: ExpandedNowPlayingProps) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    skipToNext,
    skipToPrevious,
    audioRef,
  } = useMusic();

  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [shuffleOn, setShuffleOn] = useState(false);

  // Seek to time
  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const cycleRepeat = () => {
    setRepeatMode((prev) =>
      prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'
    );
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-zinc-800 dark:text-white p-4">
      {/* Track Info */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold truncate text-zinc-800 dark:text-white">{currentTrack.title}</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">{currentTrack.artist}</p>
      </motion.div>

      {/* Album Art */}
      <motion.div
        className="relative mx-auto w-full max-w-[280px] aspect-square rounded-lg overflow-hidden mb-6 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {currentTrack.albumArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentTrack.albumArt}
            alt={currentTrack.album}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-zinc-300 dark:bg-zinc-800 flex items-center justify-center">
            <span className="text-6xl">🎵</span>
          </div>
        )}
      </motion.div>

      {/* Waveform */}
      <div className="mb-4">
        <Waveform
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
        />
      </div>

      {/* Time */}
      <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-6 font-mono">
        <span>{formatTime(currentTime)}</span>
        <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <ControlButton
          onClick={skipToPrevious}
          className="p-2 text-zinc-600 dark:text-white/80 hover:text-zinc-900 dark:hover:text-white transition-colors"
          title="Previous"
        >
          <SkipBack className="w-7 h-7" fill="currentColor" />
        </ControlButton>

        <motion.button
          onClick={togglePlay}
          className="p-4 bg-zinc-800 dark:bg-white rounded-full text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isPlaying ? 0 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" fill="currentColor" />
            ) : (
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
            )}
          </motion.div>
        </motion.button>

        <ControlButton
          onClick={skipToNext}
          className="p-2 text-zinc-600 dark:text-white/80 hover:text-zinc-900 dark:hover:text-white transition-colors"
          title="Next"
        >
          <SkipForward className="w-7 h-7" fill="currentColor" />
        </ControlButton>
      </div>

      {/* Secondary Controls */}
      <div className="flex items-center justify-center gap-8 mb-4">
        <ControlButton
          onClick={() => setShuffleOn(!shuffleOn)}
          className={`p-2 transition-colors ${
            shuffleOn ? 'text-yellow-600 dark:text-yellow-400' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
          title="Shuffle"
        >
          <Shuffle className="w-5 h-5" />
        </ControlButton>

        <ControlButton
          onClick={cycleRepeat}
          className={`p-2 transition-colors ${
            repeatMode !== 'off' ? 'text-yellow-600 dark:text-yellow-400' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
          title="Repeat"
        >
          {repeatMode === 'one' ? (
            <Repeat1 className="w-5 h-5" />
          ) : (
            <Repeat className="w-5 h-5" />
          )}
        </ControlButton>

        <ControlButton
          onClick={onShowQueue || (() => {})}
          className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          title="Queue"
        >
          <ListMusic className="w-5 h-5" />
        </ControlButton>

        <ControlButton
          onClick={() => {}}
          className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          title="Share"
        >
          <Share className="w-5 h-5" />
        </ControlButton>
      </div>

      {/* Ephemeral Claw AI Chat */}
      <div className="mt-auto pt-2 border-t border-zinc-200/50 dark:border-zinc-700/50">
        <EphemeralMusicChat />
      </div>
    </div>
  );
}

export default ExpandedNowPlaying;
