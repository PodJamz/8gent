'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

export type RecordingStatus = 'idle' | 'recording' | 'processing' | 'error';

export interface RecordingError {
  type: 'permission-denied' | 'not-supported' | 'no-audio' | 'unknown';
  message: string;
}

export interface UseVoiceRecorderReturn {
  // State
  status: RecordingStatus;
  isRecording: boolean;
  duration: number; // seconds
  audioLevels: number[]; // Array of recent audio levels (0-1) for waveform
  error: RecordingError | null;

  // Capabilities
  isSupported: boolean;

  // Actions
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  cancelRecording: () => void;
}

export interface UseVoiceRecorderOptions {
  maxDuration?: number; // Max recording duration in seconds (default: 120)
  sampleRate?: number; // Audio sample rate (default: 16000 for Whisper)
  levelsCount?: number; // Number of audio levels to track for waveform (default: 20)
  onMaxDurationReached?: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MAX_DURATION = 120; // 2 minutes
const DEFAULT_SAMPLE_RATE = 16000; // Optimal for Whisper
const DEFAULT_LEVELS_COUNT = 20;

// ============================================================================
// Helpers
// ============================================================================

function getErrorMessage(type: RecordingError['type']): string {
  switch (type) {
    case 'permission-denied':
      return 'Microphone access denied. Please enable microphone permissions.';
    case 'not-supported':
      return 'Audio recording is not supported in this browser.';
    case 'no-audio':
      return 'No audio input detected. Please check your microphone.';
    default:
      return 'An error occurred while recording. Please try again.';
  }
}

// ============================================================================
// Hook
// ============================================================================

export function useVoiceRecorder(
  options: UseVoiceRecorderOptions = {}
): UseVoiceRecorderReturn {
  const {
    maxDuration = DEFAULT_MAX_DURATION,
    levelsCount = DEFAULT_LEVELS_COUNT,
    onMaxDurationReached,
  } = options;

  // State
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [duration, setDuration] = useState(0);
  const [audioLevels, setAudioLevels] = useState<number[]>(
    Array(levelsCount).fill(0)
  );
  const [error, setError] = useState<RecordingError | null>(null);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const levelsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Check browser support
  const isSupported =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined';

  // Cleanup function
  const cleanup = useCallback(() => {
    // Stop intervals
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    if (levelsIntervalRef.current) {
      clearInterval(levelsIntervalRef.current);
      levelsIntervalRef.current = null;
    }

    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore errors when stopping
      }
    }

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  // Update audio levels for waveform visualization
  const updateAudioLevels = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average level
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length / 255; // Normalize to 0-1

    // Add new level and remove oldest
    setAudioLevels((prev) => {
      const newLevels = [...prev.slice(1), average];
      return newLevels;
    });
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    if (!isSupported) {
      const err: RecordingError = {
        type: 'not-supported',
        message: getErrorMessage('not-supported'),
      };
      setError(err);
      setStatus('error');
      return;
    }

    // Reset state
    setError(null);
    setDuration(0);
    setAudioLevels(Array(levelsCount).fill(0));
    chunksRef.current = [];

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Set up audio context and analyser for levels
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Determine the best mime type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/wav';

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
      });
      mediaRecorderRef.current = mediaRecorder;

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setStatus('recording');
      startTimeRef.current = Date.now();

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(elapsed);

        // Check max duration
        if (elapsed >= maxDuration) {
          onMaxDurationReached?.();
        }
      }, 100);

      // Start audio levels updates
      levelsIntervalRef.current = setInterval(updateAudioLevels, 50);
    } catch (err) {
      cleanup();

      let errorType: RecordingError['type'] = 'unknown';
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorType = 'permission-denied';
        } else if (err.name === 'NotFoundError') {
          errorType = 'no-audio';
        }
      }

      const recordingError: RecordingError = {
        type: errorType,
        message: getErrorMessage(errorType),
      };
      setError(recordingError);
      setStatus('error');
    }
  }, [isSupported, levelsCount, maxDuration, onMaxDurationReached, cleanup, updateAudioLevels]);

  // Stop recording and return audio blob
  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    if (!mediaRecorderRef.current || status !== 'recording') {
      return null;
    }

    setStatus('processing');

    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;

      mediaRecorder.onstop = () => {
        // Create blob from chunks
        const mimeType = mediaRecorder.mimeType;
        const blob = new Blob(chunksRef.current, { type: mimeType });

        cleanup();
        setStatus('idle');
        setAudioLevels(Array(levelsCount).fill(0));

        resolve(blob);
      };

      mediaRecorder.stop();
    });
  }, [status, cleanup, levelsCount]);

  // Cancel recording without returning audio
  const cancelRecording = useCallback(() => {
    cleanup();
    setStatus('idle');
    setDuration(0);
    setAudioLevels(Array(levelsCount).fill(0));
    setError(null);
  }, [cleanup, levelsCount]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    // State
    status,
    isRecording: status === 'recording',
    duration,
    audioLevels,
    error,

    // Capabilities
    isSupported,

    // Actions
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
