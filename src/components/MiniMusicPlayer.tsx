'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '@/context/MusicContext';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface MiniMusicPlayerProps {
  isVisible: boolean;
}

export function MiniMusicPlayer({ isVisible }: MiniMusicPlayerProps) {
  const { currentTrack, isPlaying, currentTime, duration, togglePlay, skipToNext, skipToPrevious } = useMusic();
  const [imageError, setImageError] = useState(false);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute bottom-full mb-2 left-0 right-0 z-40 pointer-events-auto"
        >
          {/* Full width bar matching dock */}
          <div className="flex items-center justify-between gap-3 px-3 py-2 bg-background rounded-full [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
            {/* Album Art Thumbnail */}
            <div className="w-9 h-9 rounded-md bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
              {currentTrack.albumArt && !imageError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentTrack.albumArt}
                  alt={currentTrack.album}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-sm">🎵</span>
              )}
            </div>

            {/* Track Info */}
            <div className="flex flex-col min-w-[100px]">
              <span className="text-xs font-medium truncate text-foreground">
                {currentTrack.title}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {currentTrack.artist}
              </span>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 flex-1 max-w-[200px]">
              <span className="text-[10px] text-muted-foreground tabular-nums w-8 text-right">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden min-w-[60px]">
                <div
                  className="h-full bg-foreground/50 transition-all duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground tabular-nums w-8">
                {formatTime(duration)}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-0.5" role="group" aria-label="Playback controls">
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); skipToPrevious(); }}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Previous track"
              >
                <SkipBack className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); togglePlay(); }}
                className="p-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true" />
                ) : (
                  <Play className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true" />
                )}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); skipToNext(); }}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Next track"
              >
                <SkipForward className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
