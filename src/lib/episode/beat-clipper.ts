// =============================================================================
// Beat-Synced Clipper - Auto-trim Video Clips to Beat Boundaries
// =============================================================================
// Takes generated video clips and trims them precisely to align with
// beat timestamps from the BeatMap. The core of music-video synchronization.
// =============================================================================

import type {
  Beat,
  BeatMap,
  BeatType,
  Scene,
  GeneratedClip,
  SyncPoint,
  TransitionConfig,
  ClipTrimConfig,
} from './types';
import { DEFAULT_CLIP_TRIM_CONFIG } from './types';
import { findNearestBeat, getBeatsInRange, beatIntervalMs } from './beat-analyzer';

// -----------------------------------------------------------------------------
// Core Clip Trimming
// -----------------------------------------------------------------------------

export interface TrimResult {
  clip: GeneratedClip;
  /** Adjusted trim start (ms, relative to clip) */
  trimStartMs: number;
  /** Adjusted trim end (ms, relative to clip) */
  trimEndMs: number;
  /** Effective duration after trimming */
  effectiveDurationMs: number;
  /** Which beat the clip starts on */
  startBeat: Beat | null;
  /** Which beat the clip ends on */
  endBeat: Beat | null;
  /** How much the clip was shifted to align */
  alignmentOffsetMs: number;
}

/**
 * Trim a single clip to align with beat boundaries.
 *
 * Takes a generated clip and its target beat window (from the scene),
 * and calculates precise trim points that land on beats.
 */
export function trimClipToBeats(
  clip: GeneratedClip,
  beatMap: BeatMap,
  targetStartMs: number,
  targetEndMs: number,
  config: ClipTrimConfig = DEFAULT_CLIP_TRIM_CONFIG
): TrimResult {
  const beats = beatMap.beats;

  // Find the nearest beats to our target window
  const startBeat = config.snapToBeats
    ? findNearestBeat(beats, targetStartMs)
    : null;

  const endBeat = config.snapToBeats
    ? findNearestBeat(beats, targetEndMs)
    : null;

  // Snap to beat positions if within threshold
  let trimStart = targetStartMs;
  let trimEnd = targetEndMs;

  if (startBeat && Math.abs(startBeat.timeMs - targetStartMs) <= config.snapThresholdMs) {
    trimStart = startBeat.timeMs;
  }

  if (endBeat && Math.abs(endBeat.timeMs - targetEndMs) <= config.snapThresholdMs) {
    trimEnd = endBeat.timeMs;
  }

  // Apply padding
  trimStart = Math.max(0, trimStart - config.paddingMs);
  trimEnd = trimEnd + config.paddingMs;

  // Enforce min/max duration
  let duration = trimEnd - trimStart;
  if (duration < config.minDurationMs) {
    // Extend to minimum, centered on midpoint
    const mid = (trimStart + trimEnd) / 2;
    trimStart = mid - config.minDurationMs / 2;
    trimEnd = mid + config.minDurationMs / 2;
    duration = config.minDurationMs;
  }
  if (duration > config.maxDurationMs) {
    trimEnd = trimStart + config.maxDurationMs;
    duration = config.maxDurationMs;
  }

  // Calculate how much the trim shifted from original targets
  const alignmentOffset = trimStart - targetStartMs;

  // Convert song-time trim points to clip-relative trim points
  // (clip starts at 0, so we need to offset)
  const clipTrimStart = 0; // Start of clip
  const clipTrimEnd = Math.min(clip.durationMs, duration);

  return {
    clip: {
      ...clip,
      trimStartMs: clipTrimStart,
      trimEndMs: clipTrimEnd,
      status: 'trimmed',
    },
    trimStartMs: clipTrimStart,
    trimEndMs: clipTrimEnd,
    effectiveDurationMs: clipTrimEnd - clipTrimStart,
    startBeat,
    endBeat,
    alignmentOffsetMs: alignmentOffset,
  };
}

// -----------------------------------------------------------------------------
// Scene-Level Clip Planning
// -----------------------------------------------------------------------------

export interface ClipPlan {
  sceneId: string;
  /** Song time where this clip starts */
  songStartMs: number;
  /** Song time where this clip ends */
  songEndMs: number;
  /** Duration of the clip */
  durationMs: number;
  /** Beat this clip starts on */
  startBeat: Beat;
  /** Beat this clip ends on */
  endBeat: Beat;
  /** Number of beats in this clip */
  beatCount: number;
  /** Sync points that fall within this clip */
  syncPoints: SyncPoint[];
  /** Suggested transition to next clip */
  transition: TransitionConfig;
}

/**
 * Plan clip boundaries for an entire scene based on beat structure.
 * If a scene is long, it may be split into multiple clips.
 */
export function planSceneClips(
  scene: Scene,
  beatMap: BeatMap,
  maxClipDurationMs: number = 5000
): ClipPlan[] {
  const { startMs, endMs } = scene.beatWindow;
  const sceneDuration = endMs - startMs;
  const beatsInScene = getBeatsInRange(beatMap.beats, startMs, endMs);

  // If scene fits in one clip, return a single plan
  if (sceneDuration <= maxClipDurationMs) {
    return [
      {
        sceneId: scene.id,
        songStartMs: startMs,
        songEndMs: endMs,
        durationMs: sceneDuration,
        startBeat: beatsInScene[0] || { timeMs: startMs, type: 'other', intensity: 0.5, isDownbeat: true, measure: 1, beatInMeasure: 1 },
        endBeat: beatsInScene[beatsInScene.length - 1] || { timeMs: endMs, type: 'other', intensity: 0.5, isDownbeat: false, measure: 1, beatInMeasure: 1 },
        beatCount: beatsInScene.length,
        syncPoints: scene.syncPoints.filter(
          (sp) => sp.beatTimeMs >= startMs && sp.beatTimeMs <= endMs
        ),
        transition: scene.transition,
      },
    ];
  }

  // Split scene into multiple clips at downbeat boundaries
  const plans: ClipPlan[] = [];
  const downbeats = beatsInScene.filter((b) => b.isDownbeat);

  if (downbeats.length < 2) {
    // Not enough downbeats, just split evenly
    const numClips = Math.ceil(sceneDuration / maxClipDurationMs);
    const clipDuration = sceneDuration / numClips;

    for (let i = 0; i < numClips; i++) {
      const clipStart = startMs + i * clipDuration;
      const clipEnd = Math.min(startMs + (i + 1) * clipDuration, endMs);
      const clipBeats = getBeatsInRange(beatMap.beats, clipStart, clipEnd);

      plans.push({
        sceneId: scene.id,
        songStartMs: clipStart,
        songEndMs: clipEnd,
        durationMs: clipEnd - clipStart,
        startBeat: clipBeats[0] || { timeMs: clipStart, type: 'other', intensity: 0.5, isDownbeat: false, measure: 1, beatInMeasure: 1 },
        endBeat: clipBeats[clipBeats.length - 1] || { timeMs: clipEnd, type: 'other', intensity: 0.5, isDownbeat: false, measure: 1, beatInMeasure: 1 },
        beatCount: clipBeats.length,
        syncPoints: scene.syncPoints.filter(
          (sp) => sp.beatTimeMs >= clipStart && sp.beatTimeMs <= clipEnd
        ),
        transition:
          i < numClips - 1
            ? { type: 'cut', on: 'kick' as const }
            : scene.transition,
      });
    }
  } else {
    // Split at downbeat boundaries, respecting max clip duration
    let currentStart = startMs;
    let lastSplitIndex = 0;

    for (let i = 1; i < downbeats.length; i++) {
      const potentialEnd = downbeats[i].timeMs;
      const potentialDuration = potentialEnd - currentStart;

      if (potentialDuration > maxClipDurationMs || i === downbeats.length - 1) {
        // End this clip at the previous downbeat (or this one if it's the last)
        const clipEndIndex = potentialDuration > maxClipDurationMs ? i - 1 : i;
        const clipEnd =
          clipEndIndex === downbeats.length - 1 ? endMs : downbeats[clipEndIndex].timeMs;
        const clipBeats = getBeatsInRange(beatMap.beats, currentStart, clipEnd);

        plans.push({
          sceneId: scene.id,
          songStartMs: currentStart,
          songEndMs: clipEnd,
          durationMs: clipEnd - currentStart,
          startBeat: clipBeats[0] || downbeats[lastSplitIndex],
          endBeat: clipBeats[clipBeats.length - 1] || downbeats[clipEndIndex],
          beatCount: clipBeats.length,
          syncPoints: scene.syncPoints.filter(
            (sp) => sp.beatTimeMs >= currentStart && sp.beatTimeMs <= clipEnd
          ),
          transition:
            clipEnd < endMs
              ? { type: 'cut', on: 'kick' as const }
              : scene.transition,
        });

        currentStart = clipEnd;
        lastSplitIndex = clipEndIndex;
      }
    }

    // Handle remaining time
    if (currentStart < endMs) {
      const clipBeats = getBeatsInRange(beatMap.beats, currentStart, endMs);
      plans.push({
        sceneId: scene.id,
        songStartMs: currentStart,
        songEndMs: endMs,
        durationMs: endMs - currentStart,
        startBeat: clipBeats[0] || { timeMs: currentStart, type: 'other', intensity: 0.5, isDownbeat: false, measure: 1, beatInMeasure: 1 },
        endBeat: clipBeats[clipBeats.length - 1] || { timeMs: endMs, type: 'other', intensity: 0.5, isDownbeat: false, measure: 1, beatInMeasure: 1 },
        beatCount: clipBeats.length,
        syncPoints: scene.syncPoints.filter(
          (sp) => sp.beatTimeMs >= currentStart && sp.beatTimeMs <= endMs
        ),
        transition: scene.transition,
      });
    }
  }

  return plans;
}

// -----------------------------------------------------------------------------
// Episode-Level Timeline
// -----------------------------------------------------------------------------

export interface TimelineEntry {
  sceneId: string;
  sceneOrder: number;
  clipPlan: ClipPlan;
  /** Position in the final video timeline (ms) */
  videoStartMs: number;
  videoEndMs: number;
  transition: TransitionConfig;
}

/**
 * Build a complete timeline for an episode.
 * Maps all scenes and their clips to a continuous video timeline,
 * aligned with the song's beat structure.
 */
export function buildEpisodeTimeline(
  scenes: Scene[],
  beatMap: BeatMap,
  maxClipDurationMs: number = 5000
): TimelineEntry[] {
  const timeline: TimelineEntry[] = [];
  let videoPosition = 0;

  const sortedScenes = [...scenes].sort((a, b) => a.order - b.order);

  for (const scene of sortedScenes) {
    const clipPlans = planSceneClips(scene, beatMap, maxClipDurationMs);

    for (const plan of clipPlans) {
      timeline.push({
        sceneId: scene.id,
        sceneOrder: scene.order,
        clipPlan: plan,
        videoStartMs: plan.songStartMs, // In music-video, video time = song time
        videoEndMs: plan.songEndMs,
        transition: plan.transition,
      });

      videoPosition = plan.songEndMs;
    }
  }

  return timeline;
}

// -----------------------------------------------------------------------------
// Sync Point Utilities
// -----------------------------------------------------------------------------

/**
 * Find the best beat to sync a visual action to.
 * Considers beat type preference and proximity.
 */
export function findSyncBeat(
  beatMap: BeatMap,
  targetTimeMs: number,
  preferredType: BeatType | 'downbeat' = 'kick',
  searchWindowMs: number = 200
): Beat | null {
  const nearby = getBeatsInRange(
    beatMap.beats,
    targetTimeMs - searchWindowMs,
    targetTimeMs + searchWindowMs
  );

  if (nearby.length === 0) return null;

  // Prefer beats of the requested type
  const preferred = nearby.filter((b) => {
    if (preferredType === 'downbeat') return b.isDownbeat;
    return b.type === preferredType;
  });

  const candidates = preferred.length > 0 ? preferred : nearby;

  // Return the closest candidate
  return candidates.reduce((best, beat) =>
    Math.abs(beat.timeMs - targetTimeMs) < Math.abs(best.timeMs - targetTimeMs)
      ? beat
      : best
  );
}

/**
 * Automatically suggest sync points for a scene based on beat structure.
 * Places sync points on strong beats (downbeats and snare hits).
 */
export function suggestSyncPoints(
  beatMap: BeatMap,
  startMs: number,
  endMs: number,
  maxPoints: number = 4
): SyncPoint[] {
  const beatsInRange = getBeatsInRange(beatMap.beats, startMs, endMs);

  // Score beats by importance: downbeats > snare > kick > hihat
  const scored = beatsInRange.map((beat) => {
    let score = beat.intensity;
    if (beat.isDownbeat) score += 0.5;
    if (beat.type === 'snare') score += 0.3;
    if (beat.type === 'kick') score += 0.2;
    return { beat, score };
  });

  // Sort by score descending, take top N
  scored.sort((a, b) => b.score - a.score);
  const topBeats = scored.slice(0, maxPoints);

  // Sort back by time
  topBeats.sort((a, b) => a.beat.timeMs - b.beat.timeMs);

  return topBeats.map(({ beat }) => ({
    beatTimeMs: beat.timeMs,
    beatType: beat.isDownbeat ? 'downbeat' : beat.type,
    visualAction: '', // To be filled by user or AI
    importance: beat.isDownbeat ? 'must-hit' : 'nice-to-have',
  }));
}

// -----------------------------------------------------------------------------
// Transition Timing
// -----------------------------------------------------------------------------

/**
 * Calculate the exact timestamp for a transition between two clips.
 * The transition point is determined by the transition type and beat structure.
 */
export function calculateTransitionTime(
  transition: TransitionConfig,
  beatMap: BeatMap,
  clipEndMs: number
): { startMs: number; endMs: number; durationMs: number } {
  switch (transition.type) {
    case 'cut': {
      // Hard cut on the specified beat type
      const beat = findSyncBeat(
        beatMap,
        clipEndMs,
        transition.on === 'any-beat' ? 'kick' : transition.on
      );
      const cutTime = beat?.timeMs ?? clipEndMs;
      return { startMs: cutTime, endMs: cutTime, durationMs: 0 };
    }

    case 'crossfade': {
      const interval = beatIntervalMs(beatMap.bpm);
      const fadeDuration = interval * transition.durationBeats;
      return {
        startMs: clipEndMs - fadeDuration / 2,
        endMs: clipEndMs + fadeDuration / 2,
        durationMs: fadeDuration,
      };
    }

    case 'whip-pan': {
      // Quick whip pan, about half a beat
      const interval = beatIntervalMs(beatMap.bpm);
      const panDuration = interval / 2;
      return {
        startMs: clipEndMs - panDuration / 2,
        endMs: clipEndMs + panDuration / 2,
        durationMs: panDuration,
      };
    }

    case 'fade-black': {
      return {
        startMs: clipEndMs - transition.durationMs / 2,
        endMs: clipEndMs + transition.durationMs / 2,
        durationMs: transition.durationMs,
      };
    }

    case 'match-cut':
    case 'zoom-through':
    case 'custom': {
      // Default to one beat duration
      const interval = beatIntervalMs(beatMap.bpm);
      return {
        startMs: clipEndMs - interval / 2,
        endMs: clipEndMs + interval / 2,
        durationMs: interval,
      };
    }

    default:
      return { startMs: clipEndMs, endMs: clipEndMs, durationMs: 0 };
  }
}
