// =============================================================================
// Cartoon Episode Production System - Core Types
// =============================================================================
// "Dad & Lad" animated short episode pipeline
// Music-first, beat-synced, style-consistent cartoon production
// =============================================================================

// -----------------------------------------------------------------------------
// Beat Analysis Types
// -----------------------------------------------------------------------------

export type BeatType = 'kick' | 'snare' | 'hihat' | 'crash' | 'other';

export interface Beat {
  /** Time in milliseconds from start of track */
  timeMs: number;
  /** Classified percussion type */
  type: BeatType;
  /** Intensity 0-1 */
  intensity: number;
  /** Whether this is beat 1 of a measure */
  isDownbeat: boolean;
  /** Measure number (1-indexed) */
  measure: number;
  /** Beat position within measure (1-indexed) */
  beatInMeasure: number;
}

export type SongSectionType =
  | 'intro'
  | 'verse'
  | 'prechorus'
  | 'chorus'
  | 'bridge'
  | 'outro'
  | 'break'
  | 'solo';

export interface SongSection {
  type: SongSectionType;
  startMs: number;
  endMs: number;
  /** Human-readable label like "verse1", "chorus2" */
  label: string;
  /** Average energy level 0-1 */
  energy: number;
}

export interface EnergyPoint {
  timeMs: number;
  energy: number; // 0-1 normalized
}

export interface BeatMap {
  songId: string;
  bpm: number;
  timeSignature: string; // "4/4", "3/4", etc.
  durationMs: number;
  beats: Beat[];
  sections: SongSection[];
  energyCurve: EnergyPoint[];
  /** Analysis metadata */
  analysis: {
    method: 'web-audio' | 'librosa' | 'madmom' | 'hybrid' | 'manual';
    confidence: number; // 0-1
    analyzedAt: string; // ISO date
  };
}

// -----------------------------------------------------------------------------
// Style Bible Types
// -----------------------------------------------------------------------------

export interface CharacterSheet {
  name: string;
  description: string;
  distinguishingFeatures: string[];
  /** Emotion name → visual description */
  expressions: Record<string, string>;
  referenceImages: string[];
  /** Prompt fragment to invoke this character consistently */
  promptFragment: string;
}

export interface StyleBible {
  id: string;
  name: string;
  artStyle: string;
  colorPalette: {
    primary: string[];
    accent: string[];
    mood: Record<string, string[]>;
  };
  characters: CharacterSheet[];
  /** Prepended to every generation prompt */
  promptPrefix: string;
  /** Appended to every generation prompt */
  promptSuffix: string;
  negativePrompt: string;
  referenceImages: string[];
  consistency: {
    environmentStyle: string;
    lightingStyle: string;
    lineWeight: string;
  };
}

// -----------------------------------------------------------------------------
// Episode Types
// -----------------------------------------------------------------------------

export interface SongReference {
  id: string;
  title: string;
  artist: string;
  /** URL or path to audio file */
  audioUrl: string;
  durationMs: number;
  beatMap?: BeatMap;
}

export type EpisodeStatus =
  | 'idea'
  | 'scripted'
  | 'storyboarded'
  | 'generating'
  | 'assembling'
  | 'review'
  | 'done';

export interface Episode {
  id: string;
  seriesId: string;
  number: number;
  title: string;
  /** James's verbal/text description of what happens */
  description: string;
  song: SongReference;
  scenes: Scene[];
  spokenWord: SpokenWordSegment[];
  status: EpisodeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SpokenWordSegment {
  id: string;
  text: string;
  /** When in the song this narration plays */
  startMs: number;
  endMs: number;
  /** Voice to use for TTS */
  voice?: string;
  /** Pre-generated audio URL */
  audioUrl?: string;
}

// -----------------------------------------------------------------------------
// Scene Types
// -----------------------------------------------------------------------------

export interface Scene {
  id: string;
  episodeId: string;
  order: number;
  title: string;
  description: string;
  /** Emotional tone */
  emotion: string;
  /** Which song section this scene maps to */
  songSection: string;
  beatWindow: {
    startMs: number;
    endMs: number;
    beatCount: number;
  };
  syncPoints: SyncPoint[];
  clips: GeneratedClip[];
  transition: TransitionConfig;
  /** Full prompt built from style bible + scene description */
  generationPrompt: string;
}

export interface SyncPoint {
  /** Timestamp in song (ms) */
  beatTimeMs: number;
  /** Which percussion element to sync to */
  beatType: BeatType | 'downbeat' | 'custom';
  /** What should happen visually at this moment */
  visualAction: string;
  importance: 'must-hit' | 'nice-to-have' | 'optional';
}

// -----------------------------------------------------------------------------
// Transition Types
// -----------------------------------------------------------------------------

export type TransitionConfig =
  | { type: 'cut'; on: 'kick' | 'snare' | 'downbeat' | 'any-beat' }
  | { type: 'crossfade'; durationBeats: number }
  | { type: 'whip-pan'; direction: 'left' | 'right' | 'up' | 'down' }
  | { type: 'match-cut'; matchElement: string }
  | { type: 'fade-black'; durationMs: number }
  | { type: 'zoom-through'; target: string }
  | { type: 'custom'; name: string; config: Record<string, unknown> };

// Default: hard cut on the kick drum
export const DEFAULT_TRANSITION: TransitionConfig = { type: 'cut', on: 'kick' };

// Transition presets for easy selection
export const TRANSITION_PRESETS: Record<string, TransitionConfig> = {
  'cut-on-kick': { type: 'cut', on: 'kick' },
  'cut-on-snare': { type: 'cut', on: 'snare' },
  'cut-on-downbeat': { type: 'cut', on: 'downbeat' },
  'smooth-crossfade': { type: 'crossfade', durationBeats: 2 },
  'quick-crossfade': { type: 'crossfade', durationBeats: 1 },
  'whip-left': { type: 'whip-pan', direction: 'left' },
  'whip-right': { type: 'whip-pan', direction: 'right' },
  'fade-to-black': { type: 'fade-black', durationMs: 500 },
};

// -----------------------------------------------------------------------------
// Video Clip Types
// -----------------------------------------------------------------------------

export type ClipStatus =
  | 'queued'
  | 'generating'
  | 'ready'
  | 'trimmed'
  | 'approved'
  | 'rejected';

export type VideoProvider = 'fal' | 'replicate' | 'local' | 'manual';

export interface GeneratedClip {
  id: string;
  sceneId: string;
  /** URL to the generated/uploaded video */
  sourceUrl: string;
  durationMs: number;
  /** Trim start relative to clip start (ms) */
  trimStartMs: number;
  /** Trim end relative to clip start (ms) */
  trimEndMs: number;
  provider: VideoProvider;
  model: string;
  prompt: string;
  status: ClipStatus;
  /** Take number - multiple attempts per scene */
  take: number;
}

// -----------------------------------------------------------------------------
// Series Types
// -----------------------------------------------------------------------------

export interface EpisodeSeries {
  id: string;
  title: string;
  description: string;
  styleBible: StyleBible;
  episodes: Episode[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Beat Analysis Configuration
// -----------------------------------------------------------------------------

export interface BeatAnalysisConfig {
  /** Which analysis method to use */
  method: 'web-audio' | 'librosa' | 'madmom' | 'hybrid';
  /** Minimum intensity threshold for onset detection (0-1) */
  onsetThreshold: number;
  /** Whether to attempt kick/snare classification */
  classifyBeats: boolean;
  /** Whether to detect song sections */
  detectSections: boolean;
  /** Frequency ranges for percussion classification (Hz) */
  frequencyRanges: {
    kick: [number, number];
    snare: [number, number];
    hihat: [number, number];
  };
}

export const DEFAULT_BEAT_ANALYSIS_CONFIG: BeatAnalysisConfig = {
  method: 'web-audio',
  onsetThreshold: 0.3,
  classifyBeats: true,
  detectSections: true,
  frequencyRanges: {
    kick: [20, 150],
    snare: [150, 1000],
    hihat: [3000, 16000],
  },
};

// -----------------------------------------------------------------------------
// Clip Trimming Configuration
// -----------------------------------------------------------------------------

export interface ClipTrimConfig {
  /** Snap clip boundaries to nearest beat */
  snapToBeats: boolean;
  /** Maximum distance (ms) to snap to a beat */
  snapThresholdMs: number;
  /** Add padding before/after trim (ms) */
  paddingMs: number;
  /** Minimum clip duration (ms) */
  minDurationMs: number;
  /** Maximum clip duration (ms) */
  maxDurationMs: number;
}

export const DEFAULT_CLIP_TRIM_CONFIG: ClipTrimConfig = {
  snapToBeats: true,
  snapThresholdMs: 100,
  paddingMs: 0,
  minDurationMs: 500,
  maxDurationMs: 10000,
};

// -----------------------------------------------------------------------------
// Episode Assembly Configuration
// -----------------------------------------------------------------------------

export interface AssemblyConfig {
  /** Output video resolution */
  resolution: { width: number; height: number };
  /** Frames per second */
  fps: number;
  /** Output format */
  format: 'mp4' | 'webm';
  /** Video codec */
  codec: 'h264' | 'vp9';
  /** Audio mix: song volume vs spoken word volume */
  audioMix: {
    songVolume: number; // 0-1
    spokenWordVolume: number; // 0-1
    duckSongDuringNarration: boolean;
    duckAmountDb: number; // e.g., -6
  };
  /** Export preset */
  preset?: 'youtube' | 'youtube-short' | 'instagram-reel' | 'tiktok' | '1080p' | '4k';
}

export const DEFAULT_ASSEMBLY_CONFIG: AssemblyConfig = {
  resolution: { width: 1080, height: 1920 }, // Vertical short
  fps: 30,
  format: 'mp4',
  codec: 'h264',
  audioMix: {
    songVolume: 0.85,
    spokenWordVolume: 1.0,
    duckSongDuringNarration: true,
    duckAmountDb: -6,
  },
  preset: 'youtube-short',
};

export const ASSEMBLY_PRESETS: Record<string, Partial<AssemblyConfig>> = {
  'youtube': { resolution: { width: 1920, height: 1080 }, fps: 30, preset: 'youtube' },
  'youtube-short': { resolution: { width: 1080, height: 1920 }, fps: 30, preset: 'youtube-short' },
  'instagram-reel': { resolution: { width: 1080, height: 1920 }, fps: 30, preset: 'instagram-reel' },
  'tiktok': { resolution: { width: 1080, height: 1920 }, fps: 30, preset: 'tiktok' },
  '1080p': { resolution: { width: 1920, height: 1080 }, fps: 30, preset: '1080p' },
  '4k': { resolution: { width: 3840, height: 2160 }, fps: 30, preset: '4k' },
};
