'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

export type VoiceModeState = 'idle' | 'listening' | 'processing' | 'speaking';

export interface VoiceModeConfig {
  // Chunking config
  chunkDurationMs?: number; // Duration of each audio chunk (default: 2000ms)
  silenceThreshold?: number; // Audio level below which is considered silence (0-1, default: 0.02)
  silenceDurationMs?: number; // Duration of silence before auto-send (default: 1500ms)

  // API endpoints
  whisperEndpoint?: string;
  chatEndpoint?: string;
  ttsEndpoint?: string;

  // Callbacks
  onTranscriptUpdate?: (transcript: string, isFinal: boolean) => void;
  onResponseStart?: () => void;
  onResponseEnd?: (response: string) => void;
  onError?: (error: string) => void;
  onStateChange?: (state: VoiceModeState) => void;
}

export interface UseVoiceModeReturn {
  // State
  state: VoiceModeState;
  isActive: boolean;
  transcript: string;
  response: string;
  audioIntensity: number; // 0-1 for UI feedback
  error: string | null;

  // Actions
  start: () => Promise<void>;
  stop: () => void;
  send: () => Promise<void>; // Manual send (tap to send)
  interrupt: () => void; // Stop speaking, switch to listening
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_CHUNK_DURATION = 2000; // 2 seconds
const DEFAULT_SILENCE_THRESHOLD = 0.02;
const DEFAULT_SILENCE_DURATION = 1500; // 1.5 seconds
const AUDIO_LEVEL_UPDATE_INTERVAL = 50; // 50ms

// Debug logging
const LOG_PREFIX = '[VoiceMode]';
const log = {
  info: (msg: string, data?: unknown) => console.log(`${LOG_PREFIX} ${msg}`, data ?? ''),
  warn: (msg: string, data?: unknown) => console.warn(`${LOG_PREFIX} ${msg}`, data ?? ''),
  error: (msg: string, data?: unknown) => console.error(`${LOG_PREFIX} ${msg}`, data ?? ''),
  state: (from: VoiceModeState, to: VoiceModeState) =>
    console.log(`${LOG_PREFIX} [STATE] ${from} → ${to}`),
  timing: (label: string, ms: number) =>
    console.log(`${LOG_PREFIX} [TIMING] ${label}: ${ms}ms`),
};

// ============================================================================
// Hook
// ============================================================================

export function useVoiceMode(config: VoiceModeConfig = {}): UseVoiceModeReturn {
  const {
    chunkDurationMs = DEFAULT_CHUNK_DURATION,
    silenceThreshold = DEFAULT_SILENCE_THRESHOLD,
    silenceDurationMs = DEFAULT_SILENCE_DURATION,
    whisperEndpoint = '/api/whisper',
    chatEndpoint = '/api/chat/stream',
    ttsEndpoint = '/api/tts',
    onTranscriptUpdate,
    onResponseStart,
    onResponseEnd,
    onError,
    onStateChange,
  } = config;

  // State
  const [state, setState] = useState<VoiceModeState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [audioIntensity, setAudioIntensity] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Refs for cleanup and management
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioLevelIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chunkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastAudioLevelRef = useRef(0);
  const silenceStartRef = useRef<number | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef<number>(0);

  // State change with logging and callback
  const transitionState = useCallback((newState: VoiceModeState) => {
    setState(prev => {
      if (prev !== newState) {
        log.state(prev, newState);
        onStateChange?.(newState);
      }
      return newState;
    });
  }, [onStateChange]);

  // Cleanup all resources
  const cleanup = useCallback(() => {
    log.info('cleanup() - releasing all resources');

    // Stop intervals
    if (audioLevelIntervalRef.current) {
      clearInterval(audioLevelIntervalRef.current);
      audioLevelIntervalRef.current = null;
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (chunkIntervalRef.current) {
      clearInterval(chunkIntervalRef.current);
      chunkIntervalRef.current = null;
    }

    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore
      }
    }
    mediaRecorderRef.current = null;

    // Stop stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;

    // Stop any playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    // Abort any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Reset refs
    audioChunksRef.current = [];
    silenceStartRef.current = null;
  }, []);

  // Update audio intensity for UI feedback
  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average level
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const level = sum / dataArray.length / 255;
    setAudioIntensity(level);
    lastAudioLevelRef.current = level;

    // Detect silence for auto-send
    if (level < silenceThreshold) {
      if (!silenceStartRef.current) {
        silenceStartRef.current = Date.now();
      } else if (Date.now() - silenceStartRef.current > silenceDurationMs) {
        // Silence detected long enough - could trigger auto-send here
        // For now, we rely on manual tap-to-send per the UX
      }
    } else {
      silenceStartRef.current = null;
    }
  }, [silenceThreshold, silenceDurationMs]);

  // Transcribe audio chunk via Whisper
  const transcribeChunk = useCallback(async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'chunk.webm');
    formData.append('language', 'en');

    const startTime = Date.now();
    log.info('transcribeChunk() - sending to Whisper', { size: audioBlob.size });

    try {
      const response = await fetch(whisperEndpoint, {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current?.signal,
      });

      if (!response.ok) {
        throw new Error(`Whisper error: ${response.status}`);
      }

      const result = await response.json();
      log.timing('STT', Date.now() - startTime);
      return result.text || '';
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        log.info('Transcription aborted');
        return '';
      }
      throw err;
    }
  }, [whisperEndpoint]);

  // Get LLM response via streaming chat
  const getAIResponse = useCallback(async (userMessage: string): Promise<string> => {
    const startTime = Date.now();
    log.info('getAIResponse() - sending to LLM', { length: userMessage.length });
    onResponseStart?.();

    try {
      const response = await fetch(chatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMessage }],
          model: 'claude',
          stream: true,
        }),
        signal: abortControllerRef.current?.signal,
      });

      if (!response.ok) {
        throw new Error(`Chat error: ${response.status}`);
      }

      // Read streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullResponse = '';
      let firstTokenTime: number | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                if (!firstTokenTime) {
                  firstTokenTime = Date.now();
                  log.timing('LLM first token', firstTokenTime - startTime);
                }
                fullResponse += data.content;
                setResponse(fullResponse);
              }
            } catch {
              // Ignore parse errors for non-JSON lines
            }
          }
        }
      }

      log.timing('LLM total', Date.now() - startTime);
      return fullResponse;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        log.info('LLM request aborted');
        return '';
      }
      throw err;
    }
  }, [chatEndpoint, onResponseStart]);

  // Speak response via TTS
  const speakResponse = useCallback(async (text: string): Promise<void> => {
    const startTime = Date.now();
    log.info('speakResponse() - sending to TTS', { length: text.length });

    try {
      const response = await fetch(ttsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'nova' }),
        signal: abortControllerRef.current?.signal,
      });

      if (!response.ok) {
        throw new Error(`TTS error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      log.timing('TTS', Date.now() - startTime);

      // Play audio
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          currentAudioRef.current = null;
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          currentAudioRef.current = null;
          reject(new Error('Audio playback failed'));
        };
        audio.play().catch(reject);
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        log.info('TTS aborted');
        return;
      }
      throw err;
    }
  }, [ttsEndpoint]);

  // Start voice mode (begin listening)
  const start = useCallback(async () => {
    log.info('start() - initializing voice mode');
    startTimeRef.current = Date.now();

    cleanup();
    setError(null);
    setTranscript('');
    setResponse('');
    audioChunksRef.current = [];

    try {
      // Request microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Set up audio analysis
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Create media recorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      abortControllerRef.current = new AbortController();

      // Start audio level monitoring
      audioLevelIntervalRef.current = setInterval(updateAudioLevel, AUDIO_LEVEL_UPDATE_INTERVAL);

      transitionState('listening');
      log.timing('Mic ready', Date.now() - startTimeRef.current);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start voice mode';
      log.error('start() failed', err);
      setError(errorMsg);
      onError?.(errorMsg);
      cleanup();
    }
  }, [cleanup, updateAudioLevel, transitionState, onError]);

  // Stop voice mode completely
  const stop = useCallback(() => {
    log.info('stop() - ending voice mode');
    cleanup();
    transitionState('idle');
    setAudioIntensity(0);
  }, [cleanup, transitionState]);

  // Send current audio for processing (manual trigger)
  const send = useCallback(async () => {
    if (state !== 'listening' || audioChunksRef.current.length === 0) {
      log.warn('send() - nothing to send', { state, chunks: audioChunksRef.current.length });
      return;
    }

    log.info('send() - processing audio');
    const totalStartTime = Date.now();

    // Stop recording but keep resources
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    transitionState('processing');

    try {
      // Combine audio chunks
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mediaRecorderRef.current?.mimeType || 'audio/webm',
      });
      audioChunksRef.current = [];

      // Transcribe
      const text = await transcribeChunk(audioBlob);
      if (!text.trim()) {
        log.warn('Empty transcript, returning to listening');
        await start(); // Restart listening
        return;
      }

      setTranscript(text);
      onTranscriptUpdate?.(text, true);
      log.info('Transcript ready', { text: text.substring(0, 50) + '...' });

      // Get AI response
      const aiResponse = await getAIResponse(text);
      if (!aiResponse.trim()) {
        log.warn('Empty AI response');
        onResponseEnd?.('');
        await start();
        return;
      }

      onResponseEnd?.(aiResponse);

      // Speak response
      transitionState('speaking');
      await speakResponse(aiResponse);

      // Return to listening after speaking
      log.timing('Total round-trip', Date.now() - totalStartTime);
      await start();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Processing failed';
      log.error('send() failed', err);
      setError(errorMsg);
      onError?.(errorMsg);
      stop();
    }
  }, [state, start, stop, transcribeChunk, getAIResponse, speakResponse, transitionState, onTranscriptUpdate, onResponseEnd, onError]);

  // Interrupt speaking and switch back to listening
  const interrupt = useCallback(() => {
    log.info('interrupt() - stopping speech, returning to listening');

    // Stop current audio playback
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    // Abort any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Restart listening
    start();
  }, [start]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    state,
    isActive: state !== 'idle',
    transcript,
    response,
    audioIntensity,
    error,
    start,
    stop,
    send,
    interrupt,
  };
}

export default useVoiceMode;
