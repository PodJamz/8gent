'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type VideoReel } from '@/data/reels';
import { AudioVisualizer } from './AudioVisualizer';

interface ReelsPlayerProps {
  reels: VideoReel[];
  initialReelId?: string;
  className?: string;
  /** When true, videos loop and reels advance when music ends (not video) */
  musicFirst?: boolean;
}

export function ReelsPlayer({ reels, initialReelId, className, musicFirst = false }: ReelsPlayerProps) {
  const initialIndex = initialReelId
    ? reels.findIndex((r) => r.id === initialReelId)
    : 0;
  const [currentIndex, setCurrentIndex] = React.useState(Math.max(0, initialIndex));
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [musicProgress, setMusicProgress] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // Audio context refs - lifted here so they persist across reel changes
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const sourceRef = React.useRef<MediaElementAudioSourceNode | null>(null);

  const currentReel = reels[currentIndex];

  // Set up audio context for visualization (persists across reel changes)
  const setupAudioContext = React.useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Only create source once per audio element
      if (!sourceRef.current) {
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        sourceRef.current = source;
      }
    } catch (e) {
      console.error('Audio context error:', e);
    }
  }, []);

  // Resume audio context if suspended (browser autoplay policy)
  const resumeAudioContext = React.useCallback(async () => {
    if (audioContextRef.current?.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
      } catch (e) {
        console.error('Failed to resume audio context:', e);
      }
    }
  }, []);

  // Format time helper
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Sync video and audio playback
  const syncPlayback = React.useCallback(async (play: boolean) => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (play) {
      try {
        // Set up audio context on first play (requires user interaction)
        setupAudioContext();
        await resumeAudioContext();

        if (video?.src) await video.play();
        if (audio?.src) await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      video?.pause();
      audio?.pause();
      setIsPlaying(false);
    }
  }, [setupAudioContext, resumeAudioContext]);

  // Toggle play/pause
  const togglePlay = React.useCallback(() => {
    syncPlayback(!isPlaying);
  }, [isPlaying, syncPlayback]);

  // Toggle mute
  const toggleMute = React.useCallback(() => {
    if (videoRef.current) videoRef.current.muted = !isMuted;
    if (audioRef.current) audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Navigate to next reel
  const goToNext = React.useCallback(() => {
    const nextIndex = currentIndex < reels.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(nextIndex);
    setProgress(0);
    setMusicProgress(0);
    setCurrentTime(0);
  }, [currentIndex, reels.length]);

  // Navigate to previous reel
  const goToPrevious = React.useCallback(() => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : reels.length - 1;
    setCurrentIndex(prevIndex);
    setProgress(0);
    setMusicProgress(0);
    setCurrentTime(0);
  }, [currentIndex, reels.length]);

  // Handle video time updates
  const handleVideoTimeUpdate = React.useCallback(() => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  }, []);

  // Handle audio time updates
  const handleAudioTimeUpdate = React.useCallback(() => {
    if (audioRef.current && audioRef.current.duration) {
      setMusicProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  }, []);

  // Handle video end
  const handleVideoEnded = React.useCallback(() => {
    if (musicFirst) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
      return;
    }
    goToNext();
  }, [goToNext, musicFirst]);

  // Handle audio end
  const handleAudioEnded = React.useCallback(() => {
    goToNext();
  }, [goToNext]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, togglePlay, toggleMute]);

  // Touch navigation
  const touchStartY = React.useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) goToNext();
      else goToPrevious();
    }
  };

  // Auto-play on reel change
  React.useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (video) {
      video.load();
      video.currentTime = 0;
    }
    if (audio) {
      audio.load();
      audio.currentTime = 0;
    }

    const timer = setTimeout(() => {
      syncPlayback(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [currentIndex, syncPlayback]);

  if (!currentReel) return null;

  return (
    <motion.div
      className={cn(
        'w-[300px] md:w-[340px] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-[32px] p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] border border-white/5',
        className
      )}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Screen */}
      <div
        className="bg-black rounded-2xl overflow-hidden relative aspect-[9/14] shadow-inner border border-white/5"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Video/Visualizer Layer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentReel.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {currentReel.videoSrc ? (
              <video
                ref={videoRef}
                src={currentReel.videoSrc}
                poster={currentReel.thumbnail}
                className="w-full h-full object-cover"
                loop={musicFirst || reels.length === 1}
                muted={isMuted}
                playsInline
                onTimeUpdate={handleVideoTimeUpdate}
                onEnded={handleVideoEnded}
                onClick={togglePlay}
              />
            ) : (
              <div className="w-full h-full cursor-pointer relative" onClick={togglePlay}>
                <AudioVisualizer
                  analyserRef={analyserRef}
                  isPlaying={isPlaying}
                  className="absolute inset-0"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Background Audio */}
        {currentReel.track && (
          <audio
            ref={audioRef}
            src={currentReel.track.audioSrc}
            loop={!musicFirst}
            muted={isMuted}
            onTimeUpdate={handleAudioTimeUpdate}
            onEnded={musicFirst ? handleAudioEnded : undefined}
          />
        )}

        {/* Track Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-12">
          {currentReel.track && (
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-12 h-12 rounded-lg overflow-hidden shadow-lg ring-1 ring-white/10 flex-shrink-0',
                isPlaying && 'animate-pulse'
              )}>
                <img
                  src={currentReel.track.albumArt}
                  alt={currentReel.track.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-mono text-sm font-medium truncate">
                  {currentReel.track.title}
                </p>
                <p className="text-white/60 font-mono text-xs truncate">
                  {currentReel.track.artist}
                </p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-rose-500 to-orange-400 rounded-full"
                style={{ width: `${musicFirst ? musicProgress : progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-white/40 mt-1 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Center Play Button (only when paused) */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
              onClick={togglePlay}
            >
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Play className="w-7 h-7 text-white ml-1" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Track Counter */}
        <div className="absolute top-3 right-3 text-xs text-white/50 font-mono bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {reels.length}
        </div>
      </div>

      {/* Control Wheel - iPod style */}
      <div className="relative w-[160px] md:w-[180px] h-[160px] md:h-[180px] mx-auto mt-4">
        {/* Outer wheel */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-lg border border-white/10">
          {/* Mute button (top) */}
          <button
            onClick={toggleMute}
            className="absolute top-2 left-1/2 -translate-x-1/2 text-zinc-400 hover:text-white transition-colors p-2"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          {/* Previous button (left) */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-2"
            title="Previous"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Next button (right) */}
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-2"
            title="Next"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Play/Pause indicator (bottom) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            {isPlaying ? 'Playing' : 'Paused'}
          </div>
        </div>

        {/* Center button - Play/Pause */}
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] md:w-[70px] h-[60px] md:h-[70px] rounded-full bg-gradient-to-b from-zinc-700 to-zinc-800 shadow-md hover:from-zinc-600 hover:to-zinc-700 transition-all active:shadow-inner flex items-center justify-center border border-white/10"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-0.5" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
