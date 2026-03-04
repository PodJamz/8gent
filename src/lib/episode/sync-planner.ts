// =============================================================================
// Sync Planner - Map Scenes to Song Structure
// =============================================================================
// Takes a scene list (from storyboarding) and a beat map (from audio analysis),
// and intelligently maps scenes to song sections. This is the bridge between
// the Story Layer and the Audio Layer.
// =============================================================================

import type {
  Scene,
  BeatMap,
  SongSection,
  SongSectionType,
  SyncPoint,
  TransitionConfig,
  Beat,
} from './types';
import { DEFAULT_TRANSITION, TRANSITION_PRESETS } from './types';
import { getBeatsInRange } from './beat-analyzer';
import { suggestSyncPoints } from './beat-clipper';

// -----------------------------------------------------------------------------
// Scene-to-Song Mapping
// -----------------------------------------------------------------------------

export interface SceneMapping {
  sceneId: string;
  songSection: SongSection;
  beatWindow: { startMs: number; endMs: number; beatCount: number };
  suggestedSyncPoints: SyncPoint[];
  suggestedTransition: TransitionConfig;
  /** How well this scene matches the section energy-wise */
  energyMatch: number; // 0-1
}

/**
 * Automatically map scenes to song sections.
 *
 * Strategy:
 * - High-energy scenes → choruses
 * - Narrative scenes → verses
 * - Transitional/reflective scenes → bridges
 * - Opening scene → intro
 * - Closing scene → outro
 *
 * Falls back to even distribution if song sections aren't detected.
 */
export function mapScenesToSong(
  scenes: Scene[],
  beatMap: BeatMap
): SceneMapping[] {
  const sections = beatMap.sections;

  // If we have detected sections, use intelligent mapping
  if (sections.length > 0) {
    return mapWithSections(scenes, beatMap, sections);
  }

  // Fallback: distribute scenes evenly across the song
  return mapEvenDistribution(scenes, beatMap);
}

/**
 * Map scenes to detected song sections based on energy and narrative matching.
 */
function mapWithSections(
  scenes: Scene[],
  beatMap: BeatMap,
  sections: SongSection[]
): SceneMapping[] {
  const mappings: SceneMapping[] = [];

  // Score each scene-section pairing
  const scores: { sceneIdx: number; sectionIdx: number; score: number }[] = [];

  for (let si = 0; si < scenes.length; si++) {
    for (let sj = 0; sj < sections.length; sj++) {
      scores.push({
        sceneIdx: si,
        sectionIdx: sj,
        score: scorePairing(scenes[si], sections[sj], si, scenes.length, sj, sections.length),
      });
    }
  }

  // If there are more scenes than sections, some sections get multiple scenes
  // If there are more sections than scenes, some sections go unused
  // Use a greedy approach: assign scenes in order, spreading across sections

  if (scenes.length <= sections.length) {
    // More sections than scenes: pick the best section for each scene
    const usedSections = new Set<number>();
    const sortedScenes = scenes.map((_, i) => i);

    for (const si of sortedScenes) {
      const candidates = scores
        .filter((s) => s.sceneIdx === si && !usedSections.has(s.sectionIdx))
        .sort((a, b) => b.score - a.score);

      const best = candidates[0];
      if (best) {
        usedSections.add(best.sectionIdx);
        const section = sections[best.sectionIdx];
        const beatsInSection = getBeatsInRange(beatMap.beats, section.startMs, section.endMs);

        mappings.push({
          sceneId: scenes[si].id,
          songSection: section,
          beatWindow: {
            startMs: section.startMs,
            endMs: section.endMs,
            beatCount: beatsInSection.length,
          },
          suggestedSyncPoints: suggestSyncPoints(beatMap, section.startMs, section.endMs),
          suggestedTransition: suggestTransition(section, si === scenes.length - 1),
          energyMatch: 1 - Math.abs(getSceneEnergy(scenes[si]) - section.energy),
        });
      }
    }
  } else {
    // More scenes than sections: distribute scenes across sections
    const scenesPerSection = Math.ceil(scenes.length / sections.length);

    for (let sj = 0; sj < sections.length; sj++) {
      const section = sections[sj];
      const sceneStart = sj * scenesPerSection;
      const sceneEnd = Math.min(sceneStart + scenesPerSection, scenes.length);
      const scenesForSection = scenes.slice(sceneStart, sceneEnd);

      // Split the section time evenly among its scenes
      const sectionDuration = section.endMs - section.startMs;
      const timePerScene = sectionDuration / scenesForSection.length;

      for (let i = 0; i < scenesForSection.length; i++) {
        const startMs = section.startMs + i * timePerScene;
        const endMs = section.startMs + (i + 1) * timePerScene;
        const beatsInWindow = getBeatsInRange(beatMap.beats, startMs, endMs);
        const isLast = sj === sections.length - 1 && i === scenesForSection.length - 1;

        mappings.push({
          sceneId: scenesForSection[i].id,
          songSection: section,
          beatWindow: {
            startMs: Math.round(startMs),
            endMs: Math.round(endMs),
            beatCount: beatsInWindow.length,
          },
          suggestedSyncPoints: suggestSyncPoints(beatMap, startMs, endMs, 2),
          suggestedTransition: suggestTransition(section, isLast),
          energyMatch: 1 - Math.abs(getSceneEnergy(scenesForSection[i]) - section.energy),
        });
      }
    }
  }

  return mappings;
}

/**
 * Evenly distribute scenes across the song duration.
 * Used when song sections aren't available.
 */
function mapEvenDistribution(
  scenes: Scene[],
  beatMap: BeatMap
): SceneMapping[] {
  const totalDuration = beatMap.durationMs;
  const sceneDuration = totalDuration / scenes.length;

  return scenes.map((scene, i) => {
    const startMs = Math.round(i * sceneDuration);
    const endMs = Math.round((i + 1) * sceneDuration);
    const beatsInWindow = getBeatsInRange(beatMap.beats, startMs, endMs);

    // Create a synthetic section
    const avgEnergy =
      beatMap.energyCurve
        .filter((p) => p.timeMs >= startMs && p.timeMs <= endMs)
        .reduce((sum, p) => sum + p.energy, 0) /
      Math.max(
        1,
        beatMap.energyCurve.filter((p) => p.timeMs >= startMs && p.timeMs <= endMs).length
      );

    const syntheticSection: SongSection = {
      type: guessSectionType(i, scenes.length, avgEnergy),
      startMs,
      endMs,
      label: `section${i + 1}`,
      energy: avgEnergy,
    };

    return {
      sceneId: scene.id,
      songSection: syntheticSection,
      beatWindow: {
        startMs,
        endMs,
        beatCount: beatsInWindow.length,
      },
      suggestedSyncPoints: suggestSyncPoints(beatMap, startMs, endMs),
      suggestedTransition:
        i === scenes.length - 1
          ? { type: 'fade-black', durationMs: 1000 }
          : TRANSITION_PRESETS['cut-on-kick'],
      energyMatch: 0.5, // Unknown match quality
    };
  });
}

// -----------------------------------------------------------------------------
// Scoring and Heuristics
// -----------------------------------------------------------------------------

/**
 * Score how well a scene matches a song section.
 */
function scorePairing(
  scene: Scene,
  section: SongSection,
  sceneIndex: number,
  totalScenes: number,
  sectionIndex: number,
  totalSections: number
): number {
  let score = 0;

  // Position matching: first scene → first section, last → last
  const scenePos = sceneIndex / Math.max(1, totalScenes - 1);
  const sectionPos = sectionIndex / Math.max(1, totalSections - 1);
  score += 1 - Math.abs(scenePos - sectionPos);

  // Energy matching
  const sceneEnergy = getSceneEnergy(scene);
  score += 1 - Math.abs(sceneEnergy - section.energy);

  // Narrative heuristics
  const emotion = scene.emotion.toLowerCase();

  // High-energy emotions match choruses
  if (['excited', 'chaotic', 'joyful', 'triumphant'].includes(emotion)) {
    if (section.type === 'chorus') score += 1;
  }

  // Calm emotions match verses
  if (['tender', 'contemplative', 'peaceful', 'nostalgic'].includes(emotion)) {
    if (section.type === 'verse') score += 1;
  }

  // Transitional emotions match bridges
  if (['bittersweet', 'reflective', 'turning-point'].includes(emotion)) {
    if (section.type === 'bridge') score += 1;
  }

  // First scene should map to intro/verse1
  if (sceneIndex === 0 && (section.type === 'intro' || sectionIndex === 0)) {
    score += 0.5;
  }

  // Last scene should map to outro or last section
  if (sceneIndex === totalScenes - 1 && (section.type === 'outro' || sectionIndex === totalSections - 1)) {
    score += 0.5;
  }

  return score;
}

/**
 * Estimate scene energy from emotion keyword.
 */
function getSceneEnergy(scene: Scene): number {
  const energyMap: Record<string, number> = {
    // High energy
    excited: 0.9,
    chaotic: 0.95,
    joyful: 0.85,
    triumphant: 0.9,
    playful: 0.75,
    adventurous: 0.8,

    // Medium energy
    happy: 0.65,
    curious: 0.6,
    determined: 0.7,
    hopeful: 0.6,

    // Low energy
    tender: 0.35,
    contemplative: 0.25,
    peaceful: 0.2,
    nostalgic: 0.3,
    bittersweet: 0.4,
    reflective: 0.3,
    cozy: 0.35,
    magical: 0.5,
  };

  return energyMap[scene.emotion.toLowerCase()] ?? 0.5;
}

/**
 * Guess a section type from position and energy.
 */
function guessSectionType(
  index: number,
  total: number,
  energy: number
): SongSectionType {
  if (index === 0 && energy < 0.5) return 'intro';
  if (index === total - 1 && energy < 0.5) return 'outro';
  if (energy > 0.7) return 'chorus';
  if (energy < 0.3) return 'bridge';
  return 'verse';
}

/**
 * Suggest a transition type based on the song section.
 */
function suggestTransition(
  section: SongSection,
  isLastScene: boolean
): TransitionConfig {
  if (isLastScene) {
    return { type: 'fade-black', durationMs: 1500 };
  }

  // High energy sections → hard cuts on beat
  if (section.energy > 0.7) {
    return TRANSITION_PRESETS['cut-on-snare'];
  }

  // Medium energy → cut on kick
  if (section.energy > 0.4) {
    return TRANSITION_PRESETS['cut-on-kick'];
  }

  // Low energy → crossfade
  return TRANSITION_PRESETS['smooth-crossfade'];
}

// -----------------------------------------------------------------------------
// Scene Reordering
// -----------------------------------------------------------------------------

/**
 * Reorder scenes to better match song structure.
 * Suggests moving high-energy scenes to chorus positions.
 */
export function suggestSceneReorder(
  scenes: Scene[],
  beatMap: BeatMap
): { originalOrder: number; suggestedOrder: number; reason: string }[] {
  if (beatMap.sections.length === 0) return [];

  const suggestions: { originalOrder: number; suggestedOrder: number; reason: string }[] = [];

  // Find chorus and verse positions
  const chorusIndices = beatMap.sections
    .map((s, i) => (s.type === 'chorus' ? i : -1))
    .filter((i) => i >= 0);

  const verseIndices = beatMap.sections
    .map((s, i) => (s.type === 'verse' ? i : -1))
    .filter((i) => i >= 0);

  // Find high and low energy scenes
  const sceneEnergies = scenes.map((s, i) => ({
    index: i,
    energy: getSceneEnergy(s),
    emotion: s.emotion,
  }));

  sceneEnergies.sort((a, b) => b.energy - a.energy);

  // Suggest high-energy scenes for chorus positions
  for (let i = 0; i < Math.min(chorusIndices.length, sceneEnergies.length); i++) {
    const scene = sceneEnergies[i];
    const targetPos = chorusIndices[i];

    if (scene.index !== targetPos && targetPos < scenes.length) {
      suggestions.push({
        originalOrder: scene.index,
        suggestedOrder: targetPos,
        reason: `"${scenes[scene.index].title}" (${scene.emotion}) would hit harder during the ${beatMap.sections[targetPos].label}`,
      });
    }
  }

  return suggestions;
}

// -----------------------------------------------------------------------------
// Full Episode Sync Plan
// -----------------------------------------------------------------------------

export interface EpisodeSyncPlan {
  episodeId: string;
  beatMap: BeatMap;
  mappings: SceneMapping[];
  reorderSuggestions: { originalOrder: number; suggestedOrder: number; reason: string }[];
  totalDurationMs: number;
  /** Summary stats */
  stats: {
    totalScenes: number;
    totalBeats: number;
    totalSyncPoints: number;
    averageEnergyMatch: number;
  };
}

/**
 * Generate a complete sync plan for an episode.
 * This is the main entry point for the sync planning process.
 */
export function createEpisodeSyncPlan(
  episodeId: string,
  scenes: Scene[],
  beatMap: BeatMap
): EpisodeSyncPlan {
  const mappings = mapScenesToSong(scenes, beatMap);
  const reorderSuggestions = suggestSceneReorder(scenes, beatMap);

  const totalSyncPoints = mappings.reduce(
    (sum, m) => sum + m.suggestedSyncPoints.length,
    0
  );
  const avgEnergyMatch =
    mappings.reduce((sum, m) => sum + m.energyMatch, 0) / Math.max(1, mappings.length);

  return {
    episodeId,
    beatMap,
    mappings,
    reorderSuggestions,
    totalDurationMs: beatMap.durationMs,
    stats: {
      totalScenes: scenes.length,
      totalBeats: beatMap.beats.length,
      totalSyncPoints,
      averageEnergyMatch: Math.round(avgEnergyMatch * 100) / 100,
    },
  };
}
