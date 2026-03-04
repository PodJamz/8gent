'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

export type TTSStatus = 'idle' | 'loading' | 'speaking' | 'error';
export type TTSVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
export type TTSProvider = 'openai' | 'elevenlabs';

export interface TTSError {
  type: 'network' | 'audio' | 'aborted' | 'unknown';
  message: string;
}

export interface UseTextToSpeechReturn {
  // State
  status: TTSStatus;
  error: TTSError | null;
  isSpeaking: boolean;
  isLoading: boolean;
  currentText: string | null;
  isAudioUnlocked: boolean;

  // Actions
  speak: (text: string) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  unlockAudio: () => Promise<void>; // Call this on user interaction to enable audio
}

export interface UseTextToSpeechOptions {
  voice?: TTSVoice;
  speed?: number; // 0.25 to 4.0
  provider?: TTSProvider; // 'openai' or 'elevenlabs' - defaults to 'openai'
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: TTSError) => void;
  autoPlay?: boolean; // Default true
}

// ============================================================================
// Audio unlock state (shared across all hook instances)
// ============================================================================

let globalAudioUnlocked = false;
let globalAudioContext: AudioContext | null = null;
let globalBlessedAudio: HTMLAudioElement | null = null;
let globalUnlockListenerAdded = false;

/**
 * Unlock audio playback by playing a silent sound.
 * This must be called from a user interaction (click, tap, etc.)
 */
async function unlockAudioPlayback(): Promise<boolean> {
  if (globalAudioUnlocked) return true;

  try {
    // Create or resume AudioContext
    if (!globalAudioContext) {
      globalAudioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }

    if (globalAudioContext.state === 'suspended') {
      await globalAudioContext.resume();
    }

    // Create a "blessed" Audio element that we can reuse
    // iOS Safari requires the Audio element to be created AND played during user interaction
    if (!globalBlessedAudio) {
      globalBlessedAudio = new Audio();
      globalBlessedAudio.volume = 1;
    }

    // Play a silent sound to unlock audio on iOS/Safari
    // Using a very short silent WAV
    globalBlessedAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

    const playPromise = globalBlessedAudio.play();
    if (playPromise !== undefined) {
      await playPromise;
    }
    globalBlessedAudio.pause();
    globalBlessedAudio.currentTime = 0;

    globalAudioUnlocked = true;
    console.log('[TTS] Audio playback unlocked');
    return true;
  } catch (error) {
    console.warn('[TTS] Failed to unlock audio:', error);
    return false;
  }
}

/**
 * Add a document-level listener to auto-unlock audio on first user interaction.
 * This ensures audio is unlocked even if the user doesn't explicitly click the voice button.
 */
function setupGlobalUnlockListener() {
  if (globalUnlockListenerAdded || typeof document === 'undefined') return;

  const unlockHandler = () => {
    if (!globalAudioUnlocked) {
      unlockAudioPlayback().catch(console.warn);
    }
  };

  // Listen for any user interaction
  document.addEventListener('click', unlockHandler, { once: false, passive: true });
  document.addEventListener('touchstart', unlockHandler, { once: false, passive: true });
  document.addEventListener('keydown', unlockHandler, { once: false, passive: true });

  globalUnlockListenerAdded = true;
  console.log('[TTS] Global unlock listeners added');
}

// ============================================================================
// Hook
// ============================================================================

export function useTextToSpeech(
  options: UseTextToSpeechOptions = {}
): UseTextToSpeechReturn {
  const {
    voice = 'nova',
    speed = 1.0,
    provider = 'openai',
    onStart,
    onEnd,
    onError,
    autoPlay = true,
  } = options;

  // State
  const [status, setStatus] = useState<TTSStatus>('idle');
  const [error, setError] = useState<TTSError | null>(null);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(globalAudioUnlocked);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Set up global unlock listener on mount
  useEffect(() => {
    setupGlobalUnlockListener();
  }, []);

  // Sync audio unlock state with global state
  useEffect(() => {
    const checkUnlockState = () => {
      if (globalAudioUnlocked && !isAudioUnlocked) {
        setIsAudioUnlocked(true);
      }
    };
    // Check periodically in case global state was updated
    const interval = setInterval(checkUnlockState, 500);
    return () => clearInterval(interval);
  }, [isAudioUnlocked]);

  // Unlock audio (call this on user interaction like clicking mic button)
  const unlockAudio = useCallback(async () => {
    const unlocked = await unlockAudioPlayback();
    setIsAudioUnlocked(unlocked);
  }, []);

  // Clean up audio element
  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.load();
      audioRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Stop speaking
  const stop = useCallback(() => {
    cleanupAudio();
    setStatus('idle');
    setCurrentText(null);
  }, [cleanupAudio]);

  // Pause speaking
  const pause = useCallback(() => {
    if (audioRef.current && status === 'speaking') {
      audioRef.current.pause();
    }
  }, [status]);

  // Resume speaking
  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(console.error);
    }
  }, []);

  // Speak text
  const speak = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      // Stop any current speech
      cleanupAudio();

      setError(null);
      setCurrentText(text);
      setStatus('loading');

      // Ensure AudioContext is resumed (iOS Safari requirement)
      if (globalAudioContext && globalAudioContext.state === 'suspended') {
        try {
          await globalAudioContext.resume();
          console.log('[TTS] AudioContext resumed');
        } catch (e) {
          console.warn('[TTS] Failed to resume AudioContext:', e);
        }
      }

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        // Use appropriate endpoint based on provider
        const endpoint = provider === 'elevenlabs' ? '/api/tts/elevenlabs' : '/api/tts';
        const body = provider === 'elevenlabs'
          ? { text } // ElevenLabs uses voice ID from env var
          : { text, voice, speed };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to generate speech');
        }

        // Get the audio blob
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        // Use the blessed audio element if available (for iOS Safari compatibility)
        // Otherwise create a new one
        const audio = globalBlessedAudio || new Audio();
        audioRef.current = audio;

        // Set up event handlers
        audio.onloadeddata = () => {
          if (autoPlay) {
            // Try to play with retry on failure
            const attemptPlay = async (retries = 2): Promise<void> => {
              try {
                await audio.play();
                setStatus('speaking');
                setIsAudioUnlocked(true);
                onStart?.();
              } catch (playError) {
                console.warn('[TTS] Play failed:', (playError as Error).message, `(retries left: ${retries})`);

                if (retries > 0) {
                  // Try to resume AudioContext and retry
                  if (globalAudioContext?.state === 'suspended') {
                    await globalAudioContext.resume().catch(() => {});
                  }
                  await new Promise(r => setTimeout(r, 100));
                  return attemptPlay(retries - 1);
                }

                // All retries failed - show user-friendly message
                const err: TTSError = {
                  type: 'audio',
                  message: 'Tap anywhere to enable voice responses',
                };
                setError(err);
                setStatus('error');
                onError?.(err);
              }
            };
            attemptPlay();
          }
        };

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setStatus('idle');
          setCurrentText(null);
          onEnd?.();
        };

        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          const err: TTSError = {
            type: 'audio',
            message: 'Failed to load audio',
          };
          setError(err);
          setStatus('error');
          onError?.(err);
        };

        // Load the audio
        audio.src = audioUrl;
        audio.load();
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was aborted, not an error
          setStatus('idle');
          return;
        }

        const error: TTSError = {
          type: 'network',
          message: err instanceof Error ? err.message : 'Unknown error',
        };
        setError(error);
        setStatus('error');
        onError?.(error);
      }
    },
    [cleanupAudio, provider, voice, speed, autoPlay, onStart, onEnd, onError]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  // Sync global unlock state
  useEffect(() => {
    setIsAudioUnlocked(globalAudioUnlocked);
  }, []);

  return {
    status,
    error,
    isSpeaking: status === 'speaking',
    isLoading: status === 'loading',
    currentText,
    isAudioUnlocked,
    speak,
    stop,
    pause,
    resume,
    unlockAudio,
  };
}
