// =============================================================================
// Episode Production System - Module Exports
// =============================================================================

// Types
export type {
  Beat,
  BeatType,
  BeatMap,
  BeatAnalysisConfig,
  SongSection,
  SongSectionType,
  EnergyPoint,
  StyleBible,
  CharacterSheet,
  Episode,
  EpisodeSeries,
  EpisodeStatus,
  Scene,
  SyncPoint,
  SpokenWordSegment,
  SongReference,
  GeneratedClip,
  ClipStatus,
  VideoProvider,
  TransitionConfig,
  ClipTrimConfig,
  AssemblyConfig,
} from './types';

export {
  DEFAULT_TRANSITION,
  TRANSITION_PRESETS,
  DEFAULT_BEAT_ANALYSIS_CONFIG,
  DEFAULT_CLIP_TRIM_CONFIG,
  DEFAULT_ASSEMBLY_CONFIG,
  ASSEMBLY_PRESETS,
} from './types';

// Beat Analysis
export {
  analyzeBeatsWebAudio,
  analyzeBeatsLynkr,
  findNearestBeat,
  getBeatsInRange,
  getDownbeatsInRange,
  beatIntervalMs,
  snapToGrid,
  beatTimestamps,
  annotateBeat,
} from './beat-analyzer';

// Style Bible
export {
  EXAMPLE_DAD_AND_LAD_STYLE,
  buildScenePrompt,
  buildNegativePrompt,
  buildCharacterPrompt,
  createStyleBible,
  addCharacter,
  updateCharacter,
  getAllCharacterPrompts,
} from './style-bible';

// Style Analyzer (Brainstorming)
export {
  buildStyleAnalysisPrompt,
  buildStyleComparisonPrompt,
  generateStyleVariations,
  createStyleBibleFromAnalysis,
  mergeStyleAnalyses,
  createBrainstormSession,
  addAnalysis,
  generateOptions,
  chooseStyle,
  STYLE_PRESETS,
} from './style-analyzer';

export type {
  StyleAnalysis,
  StyleBrainstormOption,
  BrainstormSession,
} from './style-analyzer';

// Beat Clipper
export {
  trimClipToBeats,
  planSceneClips,
  buildEpisodeTimeline,
  findSyncBeat,
  suggestSyncPoints,
  calculateTransitionTime,
} from './beat-clipper';

// Sync Planner
export {
  mapScenesToSong,
  suggestSceneReorder,
  createEpisodeSyncPlan,
} from './sync-planner';

export type {
  TrimResult,
  ClipPlan,
  TimelineEntry,
} from './beat-clipper';

export type {
  SceneMapping,
  EpisodeSyncPlan,
} from './sync-planner';

// Prompt Builder
export {
  buildStoryboardFrameRequest,
  buildSceneVideoRequest,
  buildCharacterSheetRequest,
  planEpisodeGeneration,
  IMAGE_MODELS,
  VIDEO_MODELS,
} from './prompt-builder';

export type {
  ImageGenerationRequest,
  VideoGenerationRequest,
  GenerationPlan,
} from './prompt-builder';

// Episode Assembler
export {
  assembleEpisode,
  getCompositionSummary,
  applyPreset,
  validateComposition,
} from './episode-assembler';

export type {
  EpisodeComposition,
  CompositionLayer,
  VideoClipLayer,
  TransitionLayer,
  TextOverlayLayer,
  AudioLayer,
} from './episode-assembler';
