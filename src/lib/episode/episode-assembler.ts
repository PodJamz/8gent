// =============================================================================
// Episode Assembler - Build Final Video from Clips + Audio
// =============================================================================
// Takes trimmed clips, the song audio, spoken word segments, and transitions,
// and produces a Remotion-compatible composition for final rendering.
// =============================================================================

import type {
  Episode,
  Scene,
  BeatMap,
  GeneratedClip,
  TransitionConfig,
  SpokenWordSegment,
  AssemblyConfig,
} from './types';
import { DEFAULT_ASSEMBLY_CONFIG, ASSEMBLY_PRESETS } from './types';
import type { TimelineEntry } from './beat-clipper';
import { buildEpisodeTimeline, calculateTransitionTime } from './beat-clipper';

// -----------------------------------------------------------------------------
// Remotion Composition Types (compatible with existing src/lib/remotion/types.ts)
// -----------------------------------------------------------------------------

export interface EpisodeComposition {
  /** Unique composition ID */
  id: string;
  /** Episode reference */
  episodeId: string;
  /** Frame rate */
  fps: number;
  /** Total duration in frames */
  durationInFrames: number;
  /** Resolution */
  width: number;
  height: number;
  /** Ordered layers from back to front */
  layers: CompositionLayer[];
  /** Audio tracks */
  audio: AudioLayer[];
}

export type CompositionLayer =
  | VideoClipLayer
  | TransitionLayer
  | TextOverlayLayer;

export interface VideoClipLayer {
  type: 'video-clip';
  id: string;
  sceneId: string;
  /** URL to the video file */
  src: string;
  /** When this layer starts (in frames) */
  startFrame: number;
  /** Duration of this layer (in frames) */
  durationFrames: number;
  /** Trim within the source clip (seconds) */
  trimStart: number;
  trimEnd: number;
  /** Position and scale */
  fit: 'cover' | 'contain' | 'fill';
}

export interface TransitionLayer {
  type: 'transition';
  id: string;
  transition: TransitionConfig;
  /** When the transition starts (in frames) */
  startFrame: number;
  durationFrames: number;
  /** References to clips being transitioned between */
  fromClipId: string;
  toClipId: string;
}

export interface TextOverlayLayer {
  type: 'text-overlay';
  id: string;
  text: string;
  /** When to show (in frames) */
  startFrame: number;
  durationFrames: number;
  /** Styling */
  style: {
    fontSize: number;
    fontFamily: string;
    color: string;
    position: 'top' | 'center' | 'bottom';
    animation: 'fade' | 'typewriter' | 'slide-up' | 'none';
  };
}

export interface AudioLayer {
  type: 'song' | 'spoken-word' | 'sfx';
  id: string;
  src: string;
  startFrame: number;
  durationFrames: number;
  volume: number;
  /** Fade in/out in frames */
  fadeInFrames: number;
  fadeOutFrames: number;
}

// -----------------------------------------------------------------------------
// Assembly
// -----------------------------------------------------------------------------

/**
 * Assemble an episode into a Remotion composition.
 * This is the main function that produces the final video structure.
 */
export function assembleEpisode(
  episode: Episode,
  beatMap: BeatMap,
  config: AssemblyConfig = DEFAULT_ASSEMBLY_CONFIG
): EpisodeComposition {
  const fps = config.fps;
  const totalDurationFrames = Math.ceil((beatMap.durationMs / 1000) * fps);

  // Build the timeline from scenes
  const timeline = buildEpisodeTimeline(episode.scenes, beatMap);

  // Convert timeline entries to video clip layers
  const videoLayers = buildVideoLayers(timeline, episode.scenes, fps);

  // Build transition layers between clips
  const transitionLayers = buildTransitionLayers(timeline, beatMap, fps);

  // Build spoken word text overlays
  const textLayers = buildSpokenWordLayers(episode.spokenWord, fps);

  // Build audio layers
  const audioLayers = buildAudioLayers(episode, beatMap, config, fps, totalDurationFrames);

  // Combine all layers
  const allLayers: CompositionLayer[] = [
    ...videoLayers,
    ...transitionLayers,
    ...textLayers,
  ];

  return {
    id: `composition-${episode.id}`,
    episodeId: episode.id,
    fps,
    durationInFrames: totalDurationFrames,
    width: config.resolution.width,
    height: config.resolution.height,
    layers: allLayers,
    audio: audioLayers,
  };
}

// -----------------------------------------------------------------------------
// Layer Builders
// -----------------------------------------------------------------------------

function buildVideoLayers(
  timeline: TimelineEntry[],
  scenes: Scene[],
  fps: number
): VideoClipLayer[] {
  return timeline.map((entry, i) => {
    const scene = scenes.find((s) => s.id === entry.sceneId);
    // Find the approved clip for this scene/time
    const clip = scene?.clips.find(
      (c) => c.status === 'approved' || c.status === 'trimmed'
    );

    const startFrame = Math.round((entry.videoStartMs / 1000) * fps);
    const durationMs = entry.videoEndMs - entry.videoStartMs;
    const durationFrames = Math.round((durationMs / 1000) * fps);

    return {
      type: 'video-clip' as const,
      id: `clip-${i}`,
      sceneId: entry.sceneId,
      src: clip?.sourceUrl || '',
      startFrame,
      durationFrames,
      trimStart: clip ? clip.trimStartMs / 1000 : 0,
      trimEnd: clip ? clip.trimEndMs / 1000 : durationMs / 1000,
      fit: 'cover' as const,
    };
  });
}

function buildTransitionLayers(
  timeline: TimelineEntry[],
  beatMap: BeatMap,
  fps: number
): TransitionLayer[] {
  const transitions: TransitionLayer[] = [];

  for (let i = 0; i < timeline.length - 1; i++) {
    const current = timeline[i];
    const next = timeline[i + 1];
    const transition = current.transition;

    // Skip hard cuts (no transition layer needed)
    if (transition.type === 'cut') continue;

    const timing = calculateTransitionTime(transition, beatMap, current.videoEndMs);
    const startFrame = Math.round((timing.startMs / 1000) * fps);
    const durationFrames = Math.max(1, Math.round((timing.durationMs / 1000) * fps));

    transitions.push({
      type: 'transition',
      id: `transition-${i}`,
      transition,
      startFrame,
      durationFrames,
      fromClipId: `clip-${i}`,
      toClipId: `clip-${i + 1}`,
    });
  }

  return transitions;
}

function buildSpokenWordLayers(
  segments: SpokenWordSegment[],
  fps: number
): TextOverlayLayer[] {
  return segments.map((segment, i) => {
    const startFrame = Math.round((segment.startMs / 1000) * fps);
    const durationMs = segment.endMs - segment.startMs;
    const durationFrames = Math.round((durationMs / 1000) * fps);

    return {
      type: 'text-overlay' as const,
      id: `narration-${i}`,
      text: segment.text,
      startFrame,
      durationFrames,
      style: {
        fontSize: 32,
        fontFamily: 'system-ui, sans-serif',
        color: 'rgba(255, 255, 255, 0.95)',
        position: 'bottom' as const,
        animation: 'fade' as const,
      },
    };
  });
}

function buildAudioLayers(
  episode: Episode,
  beatMap: BeatMap,
  config: AssemblyConfig,
  fps: number,
  totalFrames: number
): AudioLayer[] {
  const layers: AudioLayer[] = [];

  // Main song track
  layers.push({
    type: 'song',
    id: 'main-song',
    src: episode.song.audioUrl,
    startFrame: 0,
    durationFrames: totalFrames,
    volume: config.audioMix.songVolume,
    fadeInFrames: Math.round(fps * 0.5), // 0.5s fade in
    fadeOutFrames: Math.round(fps * 2), // 2s fade out
  });

  // Spoken word audio tracks
  for (const segment of episode.spokenWord) {
    if (!segment.audioUrl) continue;

    const startFrame = Math.round((segment.startMs / 1000) * fps);
    const durationMs = segment.endMs - segment.startMs;
    const durationFrames = Math.round((durationMs / 1000) * fps);

    layers.push({
      type: 'spoken-word',
      id: `voice-${segment.id}`,
      src: segment.audioUrl,
      startFrame,
      durationFrames,
      volume: config.audioMix.spokenWordVolume,
      fadeInFrames: Math.round(fps * 0.1),
      fadeOutFrames: Math.round(fps * 0.2),
    });
  }

  return layers;
}

// -----------------------------------------------------------------------------
// Composition Utilities
// -----------------------------------------------------------------------------

/**
 * Get a summary of the assembled composition for review.
 */
export function getCompositionSummary(composition: EpisodeComposition): {
  totalDurationSeconds: number;
  clipCount: number;
  transitionCount: number;
  narrationCount: number;
  audioTrackCount: number;
  missingClips: string[];
} {
  const clips = composition.layers.filter(
    (l): l is VideoClipLayer => l.type === 'video-clip'
  );
  const transitions = composition.layers.filter(
    (l): l is TransitionLayer => l.type === 'transition'
  );
  const narrations = composition.layers.filter(
    (l): l is TextOverlayLayer => l.type === 'text-overlay'
  );

  const missingClips = clips.filter((c) => !c.src).map((c) => c.sceneId);

  return {
    totalDurationSeconds: composition.durationInFrames / composition.fps,
    clipCount: clips.length,
    transitionCount: transitions.length,
    narrationCount: narrations.length,
    audioTrackCount: composition.audio.length,
    missingClips,
  };
}

/**
 * Apply an assembly preset to config.
 */
export function applyPreset(
  preset: string,
  baseConfig: AssemblyConfig = DEFAULT_ASSEMBLY_CONFIG
): AssemblyConfig {
  const presetConfig = ASSEMBLY_PRESETS[preset];
  if (!presetConfig) return baseConfig;
  return { ...baseConfig, ...presetConfig };
}

/**
 * Validate that all required assets are present for rendering.
 */
export function validateComposition(composition: EpisodeComposition): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for missing video clips
  const clips = composition.layers.filter(
    (l): l is VideoClipLayer => l.type === 'video-clip'
  );
  for (const clip of clips) {
    if (!clip.src) {
      errors.push(`Scene "${clip.sceneId}" has no video clip`);
    }
  }

  // Check for missing song audio
  const songAudio = composition.audio.find((a) => a.type === 'song');
  if (!songAudio || !songAudio.src) {
    errors.push('No song audio track');
  }

  // Check for spoken word without audio
  const narrations = composition.layers.filter(
    (l): l is TextOverlayLayer => l.type === 'text-overlay'
  );
  const voiceAudios = composition.audio.filter((a) => a.type === 'spoken-word');
  if (narrations.length > voiceAudios.length) {
    warnings.push(
      `${narrations.length - voiceAudios.length} narration(s) don't have audio - will show as text only`
    );
  }

  // Check total duration is reasonable
  const durationSec = composition.durationInFrames / composition.fps;
  if (durationSec < 10) {
    warnings.push(`Episode is very short: ${durationSec.toFixed(1)}s`);
  }
  if (durationSec > 600) {
    warnings.push(`Episode is very long: ${(durationSec / 60).toFixed(1)} minutes`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
