/**
 * Remotion Compositions
 *
 * Export all video composition components.
 */

export { BaseComposition, type BaseCompositionProps } from "./BaseComposition";

export {
  LyricVideo,
  LyricVideoKaraoke,
  LyricVideoSubtitle,
  LyricVideoBounce,
  LyricVideoTypewriter,
  type LyricVideoProps,
} from "./LyricVideo";

export {
  TextOverlay,
  createTitleOverlay,
  createLowerThird,
  createWatermark,
  type TextOverlayProps,
  type TextOverlayItem,
  type TextPosition,
  type TextAnimation,
} from "./TextOverlay";

// Advanced Compositions (remotion-bits patterns)
export {
  ParticleSystem,
  WaveformVisualizer,
  AnimatedGradient,
  KineticTypography,
  CinematicEffects,
  Slideshow,
  type ParticleSystemProps,
  type WaveformVisualizerProps,
  type AnimatedGradientProps,
  type KineticTypographyProps,
  type CinematicEffectsProps,
  type SlideshowProps,
} from "./AdvancedCompositions";

// OpenClaw-OS Presentation (Theme-Aware)
export {
  OpenClawOSPresentation,
  OPENCLAW_OS_PRESENTATION_CONFIG,
  type OpenClawOSPresentationProps,
  type Scene,
} from "./OpenClawOSPresentation";

// Theme utilities for Remotion
export {
  getThemeColors,
  getVideoPalette,
  getThemeGradient,
  getAvailableThemes,
  type ThemeColors,
} from "../utils/theme-resolver";
