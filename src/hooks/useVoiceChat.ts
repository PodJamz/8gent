'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  useSpeechRecognition,
  SpeechRecognitionStatus,
  SpeechRecognitionError,
} from './useSpeechRecognition';
import {
  useTextToSpeech,
  TTSStatus,
  TTSError,
  TTSVoice,
  TTSProvider,
} from './useTextToSpeech';

// ============================================================================
// Types
// ============================================================================

export type VoiceChatMode = 'idle' | 'listening' | 'processing' | 'speaking';

export interface VoiceChatError {
  type: 'speech' | 'tts' | 'unknown';
  message: string;
}

export interface UseVoiceChatReturn {
  // State
  mode: VoiceChatMode;
  isVoiceEnabled: boolean;
  transcript: string;
  interimTranscript: string;
  error: VoiceChatError | null;

  // Capabilities
  isSpeechSupported: boolean;
  isMicrophoneAvailable: boolean;

  // Actions
  enableVoice: () => void;
  disableVoice: () => void;
  toggleVoice: () => void;
  startListening: () => void;
  stopListening: () => void;
  speakResponse: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  resetTranscript: () => void;
}

export interface UseVoiceChatOptions {
  voice?: TTSVoice;
  provider?: TTSProvider; // 'openai' or 'elevenlabs' - defaults to 'openai'
  language?: string;
  continuous?: boolean;
  autoSpeak?: boolean; // Automatically speak AI responses
  onTranscriptComplete?: (transcript: string) => void;
  onSpeakingStart?: () => void;
  onSpeakingEnd?: () => void;
  onError?: (error: VoiceChatError) => void;
}

// ============================================================================
// Hook
// ============================================================================

export function useVoiceChat(
  options: UseVoiceChatOptions = {}
): UseVoiceChatReturn {
  const {
    voice = 'nova',
    provider = 'elevenlabs', // Default to ElevenLabs for James's cloned voice
    language = 'en-US',
    continuous = false,
    autoSpeak = true,
    onTranscriptComplete,
    onSpeakingStart,
    onSpeakingEnd,
    onError,
  } = options;

  // State
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [mode, setMode] = useState<VoiceChatMode>('idle');
  const [error, setError] = useState<VoiceChatError | null>(null);

  // Refs for tracking state across callbacks
  const pendingTranscriptRef = useRef<string>('');
  const isProcessingRef = useRef(false);

  // Speech Recognition (input)
  const speechRecognition = useSpeechRecognition({
    continuous,
    language,
    interimResults: true,
    autoStop: true,
    silenceTimeout: 2000,
    onResult: (transcript, isFinal) => {
      if (isFinal) {
        pendingTranscriptRef.current += transcript;
      }
    },
    onEnd: () => {
      // When speech recognition ends, process the transcript
      if (pendingTranscriptRef.current.trim() && !isProcessingRef.current) {
        const finalTranscript = pendingTranscriptRef.current.trim();
        pendingTranscriptRef.current = '';
        setMode('processing');
        isProcessingRef.current = true;
        onTranscriptComplete?.(finalTranscript);
        isProcessingRef.current = false;
      } else if (mode === 'listening') {
        setMode('idle');
      }
    },
    onError: (err) => {
      const voiceError: VoiceChatError = {
        type: 'speech',
        message: err.message,
      };
      setError(voiceError);
      setMode('idle');
      onError?.(voiceError);
    },
  });

  // Text-to-Speech (output)
  const tts = useTextToSpeech({
    voice,
    provider,
    speed: 1.0,
    onStart: () => {
      setMode('speaking');
      onSpeakingStart?.();
    },
    onEnd: () => {
      setMode('idle');
      onSpeakingEnd?.();
    },
    onError: (err) => {
      const voiceError: VoiceChatError = {
        type: 'tts',
        message: err.message,
      };
      setError(voiceError);
      setMode('idle');
      onError?.(voiceError);
    },
  });

  // Update mode based on speech recognition status
  useEffect(() => {
    if (speechRecognition.isListening && mode !== 'speaking') {
      setMode('listening');
    }
  }, [speechRecognition.isListening, mode]);

  // Enable voice mode
  const enableVoice = useCallback(() => {
    setIsVoiceEnabled(true);
    setError(null);
    // Unlock audio on user interaction
    tts.unlockAudio();
  }, [tts]);

  // Disable voice mode
  const disableVoice = useCallback(() => {
    setIsVoiceEnabled(false);
    speechRecognition.stopListening();
    tts.stop();
    setMode('idle');
    pendingTranscriptRef.current = '';
  }, [speechRecognition, tts]);

  // Toggle voice mode
  const toggleVoice = useCallback(() => {
    if (isVoiceEnabled) {
      disableVoice();
    } else {
      enableVoice();
    }
  }, [isVoiceEnabled, enableVoice, disableVoice]);

  // Start listening
  const startListening = useCallback(() => {
    if (!isVoiceEnabled) {
      enableVoice();
    }

    // Stop any current speech first
    tts.stop();

    setError(null);
    pendingTranscriptRef.current = '';
    speechRecognition.resetTranscript();
    speechRecognition.startListening();
  }, [isVoiceEnabled, enableVoice, tts, speechRecognition]);

  // Stop listening
  const stopListening = useCallback(() => {
    speechRecognition.stopListening();
  }, [speechRecognition]);

  // Speak AI response
  const speakResponse = useCallback(
    async (text: string) => {
      if (!isVoiceEnabled || !autoSpeak) return;

      // Clean the text for speech (remove markdown, links, etc.)
      const cleanText = text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
        .replace(/\*([^*]+)\*/g, '$1') // Remove italic
        .replace(/`([^`]+)`/g, '$1') // Remove code
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/\n+/g, '. ') // Replace newlines with periods
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      if (cleanText) {
        await tts.speak(cleanText);
      }
    },
    [isVoiceEnabled, autoSpeak, tts]
  );

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    tts.stop();
    setMode('idle');
  }, [tts]);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    speechRecognition.resetTranscript();
    pendingTranscriptRef.current = '';
  }, [speechRecognition]);

  return {
    // State
    mode,
    isVoiceEnabled,
    transcript: speechRecognition.transcript,
    interimTranscript: speechRecognition.interimTranscript,
    error,

    // Capabilities
    isSpeechSupported: speechRecognition.isSupported,
    isMicrophoneAvailable: speechRecognition.isMicrophoneAvailable,

    // Actions
    enableVoice,
    disableVoice,
    toggleVoice,
    startListening,
    stopListening,
    speakResponse,
    stopSpeaking,
    resetTranscript,
  };
}
