'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================================
// Types
// ============================================================================

export type SpeechRecognitionStatus =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'error'
  | 'unsupported';

export interface SpeechRecognitionError {
  type: 'not-allowed' | 'no-speech' | 'network' | 'aborted' | 'unknown';
  message: string;
}

export interface UseSpeechRecognitionReturn {
  // State
  transcript: string;
  interimTranscript: string;
  status: SpeechRecognitionStatus;
  error: SpeechRecognitionError | null;
  isListening: boolean;
  isSupported: boolean;
  isMicrophoneAvailable: boolean;

  // Actions
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: SpeechRecognitionError) => void;
  onEnd?: () => void;
  onStart?: () => void;
  autoStop?: boolean; // Auto-stop after silence
  silenceTimeout?: number; // ms before auto-stop (default 2000)
}

// ============================================================================
// Browser Type Definitions
// ============================================================================

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  onspeechend: (() => void) | null;
  onaudiostart: (() => void) | null;
  onaudioend: (() => void) | null;
}

// ============================================================================
// Helpers
// ============================================================================

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;

  return SpeechRecognition || null;
}

function mapErrorType(errorCode: string): SpeechRecognitionError['type'] {
  switch (errorCode) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'not-allowed';
    case 'no-speech':
      return 'no-speech';
    case 'network':
      return 'network';
    case 'aborted':
      return 'aborted';
    default:
      return 'unknown';
  }
}

function getErrorMessage(type: SpeechRecognitionError['type']): string {
  switch (type) {
    case 'not-allowed':
      return 'Microphone access denied. Please enable microphone permissions.';
    case 'no-speech':
      return 'No speech detected. Please try again.';
    case 'network':
      return 'Network error. Please check your connection.';
    case 'aborted':
      return 'Speech recognition was cancelled.';
    default:
      return 'An error occurred. Please try again.';
  }
}

// ============================================================================
// Hook
// ============================================================================

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const {
    continuous = false,
    interimResults = true,
    language = 'en-US',
    onResult,
    onError,
    onEnd,
    onStart,
    autoStop = true,
    silenceTimeout = 2000,
  } = options;

  // State
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [status, setStatus] = useState<SpeechRecognitionStatus>('idle');
  const [error, setError] = useState<SpeechRecognitionError | null>(null);
  const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(true);

  // Refs
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isListeningRef = useRef(false);

  // Check browser support
  const isSupported = typeof window !== 'undefined' && getSpeechRecognition() !== null;

  // Clear silence timer
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Reset silence timer
  const resetSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    if (autoStop && isListeningRef.current) {
      silenceTimerRef.current = setTimeout(() => {
        if (recognitionRef.current && isListeningRef.current) {
          recognitionRef.current.stop();
        }
      }, silenceTimeout);
    }
  }, [autoStop, silenceTimeout, clearSilenceTimer]);

  // Stop listening
  const stopListening = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current && isListeningRef.current) {
      isListeningRef.current = false;
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore errors when stopping
      }
    }
    setStatus('idle');
  }, [clearSilenceTimer]);

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported) {
      setStatus('unsupported');
      const err: SpeechRecognitionError = {
        type: 'unknown',
        message: 'Speech recognition is not supported in this browser.',
      };
      setError(err);
      onError?.(err);
      return;
    }

    // Reset state
    setError(null);
    setInterimTranscript('');

    const SpeechRecognitionClass = getSpeechRecognition();
    if (!SpeechRecognitionClass) return;

    // Create new instance
    const recognition = new SpeechRecognitionClass();
    recognitionRef.current = recognition;

    // Configure
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    // Handle results
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      clearSilenceTimer();

      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += text;
        } else {
          interim += text;
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
        onResult?.(finalTranscript, true);
      }

      setInterimTranscript(interim);
      if (interim) {
        onResult?.(interim, false);
      }

      // Reset silence timer on any speech
      resetSilenceTimer();
    };

    // Handle errors
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorType = mapErrorType(event.error);
      const err: SpeechRecognitionError = {
        type: errorType,
        message: event.message || getErrorMessage(errorType),
      };

      setError(err);
      setStatus('error');

      if (errorType === 'not-allowed') {
        setIsMicrophoneAvailable(false);
      }

      onError?.(err);
      isListeningRef.current = false;
    };

    // Handle end
    recognition.onend = () => {
      clearSilenceTimer();
      isListeningRef.current = false;

      if (status !== 'error') {
        setStatus('idle');
      }

      setInterimTranscript('');
      onEnd?.();
    };

    // Handle start
    recognition.onstart = () => {
      isListeningRef.current = true;
      setStatus('listening');
      onStart?.();
      resetSilenceTimer();
    };

    // Start recognition
    try {
      recognition.start();
    } catch (e) {
      const err: SpeechRecognitionError = {
        type: 'unknown',
        message: e instanceof Error ? e.message : 'Failed to start speech recognition',
      };
      setError(err);
      setStatus('error');
      onError?.(err);
    }
  }, [
    isSupported,
    continuous,
    interimResults,
    language,
    onResult,
    onError,
    onEnd,
    onStart,
    clearSilenceTimer,
    resetSilenceTimer,
    status,
  ]);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
    };
  }, [clearSilenceTimer]);

  // Check initial support
  useEffect(() => {
    if (!isSupported) {
      setStatus('unsupported');
    }
  }, [isSupported]);

  return {
    transcript,
    interimTranscript,
    status,
    error,
    isListening: status === 'listening',
    isSupported,
    isMicrophoneAvailable,
    startListening,
    stopListening,
    resetTranscript,
  };
}
