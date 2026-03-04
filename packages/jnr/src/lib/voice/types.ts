/**
 * Voice System Types
 *
 * Types for voice management and TTS integration.
 */

export interface Voice {
  id: string;
  name: string;
  description?: string;
  previewUrl?: string;
  category: 'default' | 'custom' | 'elevenlabs';
  isDefault?: boolean;
}

export interface VoiceSettings {
  selectedVoiceId: string;
  rate: number; // 0.5 - 2.0
  pitch: number; // 0.5 - 2.0
  volume: number; // 0 - 1
}

export interface RecordingState {
  isRecording: boolean;
  duration: number;
  audioBlob?: Blob;
  audioUrl?: string;
}

export interface VoiceCreationRequest {
  name: string;
  description?: string;
  audioBlob: Blob;
}

export interface VoiceCreationResponse {
  success: boolean;
  voice?: Voice;
  error?: string;
}

// Default browser voices
export const DEFAULT_VOICES: Voice[] = [
  { id: 'browser-default', name: 'System Default', category: 'default', isDefault: true },
  { id: 'browser-samantha', name: 'Samantha', category: 'default' },
  { id: 'browser-alex', name: 'Alex', category: 'default' },
];

// ElevenLabs preset voices (free tier)
export const ELEVENLABS_VOICES: Voice[] = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Child)', description: 'Young, cheerful voice', category: 'elevenlabs' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Warm, friendly male', category: 'elevenlabs' },
  { id: 'jsCqWAovK2LkecY7zXl4', name: 'Freya', description: 'Soft, gentle female', category: 'elevenlabs' },
];
