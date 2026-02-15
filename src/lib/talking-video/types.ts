/**
 * Talking Video Types
 *
 * Workflow:
 * 1. Generate script (AI) -> 90 second talking points
 * 2. Generate voice (ElevenLabs) -> Audio from cloned voice
 * 3. Generate background scene (Kling AI Pro via Fal) -> Photo in podcast studio etc
 * 4. Lip sync (Veed Fast via Fal) -> Sync lips to audio
 */

export interface TalkingVideoProject {
  id: string;
  title: string;
  status: TalkingVideoStatus;
  createdAt: number;
  updatedAt: number;

  // Step 1: Script
  topic: string;
  script?: string;
  scriptDuration?: number; // estimated seconds

  // Step 2: Voice
  voiceId?: string;
  audioUrl?: string;
  audioDuration?: number;

  // Step 3: Background scene
  sourcePhotoUrl: string;
  scenePrompt?: string;
  sceneStyle?: SceneStyle;
  backgroundVideoUrl?: string;

  // Step 4: Lip sync
  finalVideoUrl?: string;
  thumbnailUrl?: string;

  // Metadata
  error?: string;
  currentStep?: WorkflowStep;
}

export type TalkingVideoStatus =
  | 'draft'
  | 'generating_script'
  | 'script_ready'
  | 'generating_voice'
  | 'voice_ready'
  | 'generating_background'
  | 'background_ready'
  | 'lip_syncing'
  | 'complete'
  | 'error';

export type WorkflowStep =
  | 'script'
  | 'voice'
  | 'background'
  | 'lipsync';

export type SceneStyle =
  | 'podcast_studio'
  | 'office'
  | 'outdoor'
  | 'news_desk'
  | 'living_room'
  | 'conference'
  | 'custom';

export const SCENE_PROMPTS: Record<SceneStyle, string> = {
  podcast_studio: 'professional podcast studio with microphone, acoustic panels, warm lighting, modern setup',
  office: 'modern office environment, clean desk, plants, natural lighting through windows',
  outdoor: 'beautiful outdoor setting, natural scenery, soft golden hour lighting',
  news_desk: 'professional news desk setup, monitors in background, studio lighting',
  living_room: 'cozy modern living room, bookshelf, comfortable seating, warm ambient light',
  conference: 'conference room setting, presentation screen, professional environment',
  custom: '',
};

// ElevenLabs types
export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  preview_url?: string;
  category?: string;
}

export interface ElevenLabsRequest {
  text: string;
  voiceId: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
}

export interface ElevenLabsResponse {
  audioUrl: string;
  duration: number;
}

// Fal Kling AI Pro types (image to video)
export interface KlingRequest {
  prompt: string;
  image_url: string;
  duration?: '5' | '10';
  aspect_ratio?: '16:9' | '9:16' | '1:1';
}

export interface KlingResponse {
  video: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
}

// Fal Veed Fast types (lip sync)
export interface VeedLipSyncRequest {
  video_url: string;
  audio_url: string;
  sync_mode?: 'accurate' | 'fast';
}

export interface VeedLipSyncResponse {
  video: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
}

// Script generation
export interface ScriptRequest {
  topic: string;
  duration?: number; // target seconds (default 90)
  tone?: 'professional' | 'casual' | 'educational' | 'entertaining';
  style?: 'monologue' | 'interview' | 'tutorial' | 'story';
}

export interface GeneratedScript {
  script: string;
  estimatedDuration: number;
  wordCount: number;
  sections?: string[];
}

// Full workflow request
export interface TalkingVideoRequest {
  topic: string;
  sourcePhotoUrl: string;
  sceneStyle?: SceneStyle;
  customScenePrompt?: string;
  voiceId?: string;
  duration?: number;
  tone?: 'professional' | 'casual' | 'educational' | 'entertaining';
}

export interface TalkingVideoResult {
  projectId: string;
  status: TalkingVideoStatus;
  script?: string;
  audioUrl?: string;
  backgroundVideoUrl?: string;
  finalVideoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}
