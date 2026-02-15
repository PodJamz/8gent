'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { type Track } from '@/data/tracks';

interface Album {
  name: string;
  artist: string;
  albumArt: string;
  tracks: Track[];
}

interface VinylCarouselProps {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onSelectAlbum: (album: Album) => void;
  onSelectTrack: (track: Track) => void;
  onTogglePlay: () => void;
}

// Group tracks by album
function groupTracksByAlbum(tracks: Track[]): Album[] {
  const albumMap = new Map<string, Album>();

  tracks.forEach((track) => {
    const key = `${track.album}-${track.artist}`;
    if (!albumMap.has(key)) {
      albumMap.set(key, {
        name: track.album,
        artist: track.artist,
        albumArt: track.albumArt,
        tracks: [],
      });
    }
    albumMap.get(key)!.tracks.push(track);
  });

  return Array.from(albumMap.values());
}

export function VinylCarousel({
  tracks,
  currentTrack,
  isPlaying,
  onSelectAlbum,
  onSelectTrack,
  onTogglePlay,
}: VinylCarouselProps) {
  const albums = groupTracksByAlbum(tracks);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find the album index that contains the current track
  useEffect(() => {
    const albumIndex = albums.findIndex((album) =>
      album.tracks.some((t) => t.id === currentTrack.id)
    );
    if (albumIndex !== -1 && albumIndex !== currentIndex) {
      setDirection(albumIndex > currentIndex ? 1 : -1);
      setCurrentIndex(albumIndex);
    }
  }, [currentTrack.id, albums, currentIndex]);

  const goToNext = useCallback(() => {
    if (albums.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % albums.length);
  }, [albums.length]);

  const goToPrevious = useCallback(() => {
    if (albums.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + albums.length) % albums.length);
  }, [albums.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelectAlbum(albums[currentIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, currentIndex, albums, onSelectAlbum]);

  // Swipe gesture handling
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      goToPrevious();
    } else if (info.offset.x < -swipeThreshold) {
      goToNext();
    }
  };

  const currentAlbum = albums[currentIndex];
  const isCurrentAlbumPlaying = currentAlbum?.tracks.some((t) => t.id === currentTrack.id);

  // Calculate visible album indices for 3D effect
  const getVisibleAlbums = () => {
    if (albums.length <= 1) return [{ album: albums[0], offset: 0 }];

    const visible: { album: Album; offset: number }[] = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + albums.length) % albums.length;
      visible.push({ album: albums[index], offset: i });
    }
    return visible;
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
    }),
  };

  if (!currentAlbum) return null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative w-full flex items-center justify-center"
        style={{ perspective: '1000px' }}
      >
        {/* Left Arrow */}
        {albums.length > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-0 z-20 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all"
            aria-label="Previous album"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Album Cover with Vinyl Effect */}
        <motion.div
          className="relative cursor-pointer"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          onClick={() => onSelectAlbum(currentAlbum)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
                rotateY: { duration: 0.3 },
              }}
              className="relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Vinyl Record (behind the cover) */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-[90%] h-[90%] rounded-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-2xl"
                style={{
                  transform: 'translate(-50%, -50%)',
                  zIndex: -1,
                }}
                animate={{
                  x: isCurrentAlbumPlaying && isPlaying ? 30 : 0,
                  rotate: isCurrentAlbumPlaying && isPlaying ? [0, 360] : 0,
                }}
                transition={{
                  x: { duration: 0.5, ease: 'easeOut' },
                  rotate: {
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                }}
              >
                {/* Vinyl grooves */}
                <div className="absolute inset-4 rounded-full border border-zinc-700/50" />
                <div className="absolute inset-8 rounded-full border border-zinc-700/30" />
                <div className="absolute inset-12 rounded-full border border-zinc-700/20" />
                {/* Center label */}
                <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-zinc-900" />
                </div>
              </motion.div>

              {/* Album Cover */}
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-lg overflow-hidden shadow-2xl bg-zinc-800 ring-1 ring-white/10">
                {currentAlbum.albumArt ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentAlbum.albumArt}
                    alt={`${currentAlbum.name} cover`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🎵
                  </div>
                )}
              </div>

              {/* Play indicator overlay */}
              {isCurrentAlbumPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-lg bg-black/30 flex items-center justify-center"
                >
                  <motion.div
                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
                    animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    )}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Right Arrow */}
        {albums.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-0 z-20 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all"
            aria-label="Next album"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Album Info */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mt-3 text-center"
      >
        <h3 className="text-sm font-bold text-[#1a2420] dark:text-[#8fa39a] font-mono truncate max-w-[180px]">
          {currentAlbum.name}
        </h3>
        <p className="text-xs text-[#3a4a45] dark:text-[#5a6a65] font-mono truncate max-w-[180px]">
          {currentAlbum.artist}
        </p>
        <p className="text-[10px] text-[#5a6a65] dark:text-[#4a5a55] font-mono mt-0.5">
          {currentAlbum.tracks.length} {currentAlbum.tracks.length === 1 ? 'track' : 'tracks'}
        </p>
      </motion.div>

      {/* Dots indicator */}
      {albums.length > 1 && (
        <div className="flex gap-1.5 mt-2">
          {albums.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-[#1a2420] dark:bg-[#8fa39a] w-3'
                  : 'bg-[#5a6a65] dark:bg-[#3a4a45] hover:bg-[#3a4a45] dark:hover:bg-[#5a6a65]'
              }`}
              aria-label={`Go to album ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Hint text */}
      <p className="text-[9px] text-[#5a6a65] dark:text-[#4a5a55] font-mono mt-2 opacity-60">
        Tap album to view tracks • Swipe or use arrow keys
      </p>
    </div>
  );
}

export type { Album };
export { groupTracksByAlbum };
