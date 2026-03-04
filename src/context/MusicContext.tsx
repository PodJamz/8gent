'use client';

import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { tracks, getNextTrack, getPreviousTrack, isVideoTrack, type Track } from '@/data/tracks';

interface MusicContextType {
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isVideo: boolean;
  togglePlay: () => void;
  pause: () => void;
  play: () => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  selectTrack: (track: Track) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  setVideoElement: (el: HTMLVideoElement | null) => void;
}

export const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVideo = isVideoTrack(currentTrack);

  // Allow components to register their video element for video tracks
  const setVideoElement = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
  }, []);

  // Get the active media element (audio or video)
  const getMediaElement = useCallback(() => {
    if (isVideo && videoRef.current) {
      return videoRef.current;
    }
    return audioRef.current;
  }, [isVideo]);

  // Audio element event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isVideo) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      const next = getNextTrack(currentTrack.id);
      if (next && tracks.length > 1) {
        setCurrentTrack(next);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [currentTrack.id, isVideo]);

  // Video element event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => {
      const next = getNextTrack(currentTrack.id);
      if (next && tracks.length > 1) {
        setCurrentTrack(next);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [currentTrack.id, isVideo]);

  // Handle track changes for audio
  useEffect(() => {
    if (isVideo) return;
    const audio = audioRef.current;
    if (!audio) return;

    const wasPlaying = isPlaying;
    setCurrentTime(0);
    setDuration(0);
    audio.load();

    if (wasPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack.id, isVideo]);

  // Handle track changes for video
  useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;
    if (!video) return;

    const wasPlaying = isPlaying;
    setCurrentTime(0);
    setDuration(0);
    video.load();

    if (wasPlaying) {
      video.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack.id, isVideo]);

  const togglePlay = useCallback(() => {
    const media = getMediaElement();
    if (!media) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play().catch(() => {});
    }
  }, [isPlaying, getMediaElement]);

  const pause = useCallback(() => {
    const media = getMediaElement();
    if (!media) return;
    media.pause();
  }, [getMediaElement]);

  const play = useCallback(() => {
    const media = getMediaElement();
    if (!media) return;
    media.play().catch(() => {});
  }, [getMediaElement]);

  const skipToNext = useCallback(() => {
    const next = getNextTrack(currentTrack.id);
    if (next) {
      setCurrentTrack(next);
    }
  }, [currentTrack.id]);

  const skipToPrevious = useCallback(() => {
    const prev = getPreviousTrack(currentTrack.id);
    if (prev) {
      setCurrentTrack(prev);
    }
  }, [currentTrack.id]);

  const selectTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        isVideo,
        togglePlay,
        pause,
        play,
        skipToNext,
        skipToPrevious,
        selectTrack,
        audioRef,
        videoRef,
        setVideoElement,
      }}
    >
      {/* Global audio element - only for audio tracks */}
      {!isVideo && (
        <audio ref={audioRef} src={currentTrack.audioSrc} preload="metadata" />
      )}
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
