'use client';

import { useEffect, useRef, useContext } from 'react';
import { MusicContext } from '@/context/MusicContext';

interface UsePauseMusicForVoiceOptions {
  /** Whether voice recording is active */
  isRecording?: boolean;
  /** Whether TTS is speaking (voiceChat.mode === 'speaking') */
  isSpeaking?: boolean;
  /** Whether voice transcription is processing */
  isTranscribing?: boolean;
}

/**
 * Pauses music when voice recording or TTS speaking is active.
 * Music stays paused after voice interaction ends (no auto-resume).
 *
 * Safe to use even if MusicProvider is not available (will no-op).
 *
 * Usage:
 * ```tsx
 * usePauseMusicForVoice({
 *   isRecording: voiceRecorder.isRecording,
 *   isSpeaking: voiceChat.mode === 'speaking',
 *   isTranscribing: isTranscribing,
 * });
 * ```
 */
export function usePauseMusicForVoice({
  isRecording = false,
  isSpeaking = false,
  isTranscribing = false,
}: UsePauseMusicForVoiceOptions) {
  // Use context directly to avoid throwing if not in provider
  const musicContext = useContext(MusicContext);

  // Track if we paused the music (to avoid redundant pause calls)
  const didPauseRef = useRef(false);

  // Pause music when recording starts
  useEffect(() => {
    if (!musicContext) return;
    if (isRecording && musicContext.isPlaying) {
      musicContext.pause();
      didPauseRef.current = true;
    }
  }, [isRecording, musicContext]);

  // Pause music when TTS speaking starts
  useEffect(() => {
    if (!musicContext) return;
    if (isSpeaking && musicContext.isPlaying) {
      musicContext.pause();
      didPauseRef.current = true;
    }
  }, [isSpeaking, musicContext]);

  // Pause music when transcribing starts (covers the processing phase)
  useEffect(() => {
    if (!musicContext) return;
    if (isTranscribing && musicContext.isPlaying) {
      musicContext.pause();
      didPauseRef.current = true;
    }
  }, [isTranscribing, musicContext]);

  // Reset the ref when voice interaction ends (but don't auto-resume)
  useEffect(() => {
    if (!isRecording && !isSpeaking && !isTranscribing) {
      didPauseRef.current = false;
    }
  }, [isRecording, isSpeaking, isTranscribing]);
}

export default usePauseMusicForVoice;
