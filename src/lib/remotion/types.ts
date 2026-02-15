/**
 * Remotion Types for OpenClaw-OS
 *
 * Type definitions for video compositions, layers, and rendering.
 */

// =============================================================================
// Core Types
// =============================================================================

export interface VideoComposition {
  id: string;
  name: string;
  description?: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  layers: AnyVideoLayer[];
  audio?: AudioTrack[];
  metadata?: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

export type VideoLayerType =
  | "text"
  | "image"
  | "video"
  | "shape"
  | "lyrics"
  | "waveform"
  | "particles"
  | "gradient";

export interface BaseVideoLayer {
  id: string;
  type: VideoLayerType;
  name: string;
  startFrame: number;
  durationInFrames: number;
  position: { x: number; y: number };
  scale?: { x: number; y: number };
  rotation?: number;
  opacity?: number;
  animations?: LayerAnimation[];
  zIndex: number;
}

export interface TextLayer extends BaseVideoLayer {
  type: "text";
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight?: number;
  color: string;
  textAlign?: "left" | "center" | "right";
  textShadow?: string;
  letterSpacing?: number;
  lineHeight?: number;
}

export interface ImageLayer extends BaseVideoLayer {
  type: "image";
  src: string;
  objectFit?: "contain" | "cover" | "fill";
  borderRadius?: number;
}

export interface VideoClipLayer extends BaseVideoLayer {
  type: "video";
  src: string;
  volume?: number;
  playbackRate?: number;
  startFrom?: number;
  objectFit?: "contain" | "cover" | "fill";
}

export interface ShapeLayer extends BaseVideoLayer {
  type: "shape";
  shape: "rectangle" | "circle" | "triangle" | "polygon";
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  width: number;
  height: number;
  borderRadius?: number;
}

export interface LyricsLayer extends BaseVideoLayer {
  type: "lyrics";
  lyrics: LyricLine[];
  fontFamily: string;
  fontSize: number;
  color: string;
  highlightColor: string;
  style: "karaoke" | "subtitle" | "bounce" | "typewriter";
}

export interface LyricLine {
  text: string;
  startTime: number; // in seconds
  endTime: number;
  words?: LyricWord[];
}

export interface LyricWord {
  text: string;
  startTime: number;
  endTime: number;
}

export interface WaveformLayer extends BaseVideoLayer {
  type: "waveform";
  audioSrc: string;
  color: string;
  style: "bars" | "line" | "circle" | "mirror";
  barWidth?: number;
  barGap?: number;
  smoothing?: number;
}

export interface ParticlesLayer extends BaseVideoLayer {
  type: "particles";
  particleCount: number;
  particleColor: string;
  particleSize: { min: number; max: number };
  speed: { min: number; max: number };
  direction: "up" | "down" | "left" | "right" | "random";
}

export interface GradientLayer extends BaseVideoLayer {
  type: "gradient";
  colors: string[];
  angle?: number;
  type_gradient?: "linear" | "radial";
  animate?: boolean;
}

export type AnyVideoLayer =
  | TextLayer
  | ImageLayer
  | VideoClipLayer
  | ShapeLayer
  | LyricsLayer
  | WaveformLayer
  | ParticlesLayer
  | GradientLayer;

// =============================================================================
// Animation Types
// =============================================================================

export type AnimationType =
  | "fadeIn"
  | "fadeOut"
  | "slideIn"
  | "slideOut"
  | "scaleIn"
  | "scaleOut"
  | "rotate"
  | "bounce"
  | "pulse"
  | "typewriter"
  | "custom";

export interface LayerAnimation {
  type: AnimationType;
  startFrame: number;
  durationInFrames: number;
  easing?: "linear" | "easeIn" | "easeOut" | "easeInOut" | "spring";
  direction?: "left" | "right" | "up" | "down";
  customKeyframes?: Record<number, Record<string, number | string>>;
}

// =============================================================================
// Audio Types
// =============================================================================

export interface AudioTrack {
  id: string;
  name: string;
  src: string;
  startFrame: number;
  durationInFrames?: number;
  volume: number;
  fadeIn?: number;
  fadeOut?: number;
  loop?: boolean;
}

// =============================================================================
// Template Types
// =============================================================================

export type VideoTemplate =
  | "lyric-video"
  | "presentation"
  | "social-story"
  | "title-card"
  | "music-visualizer"
  | "slideshow"
  | "text-animation"
  | "custom";

export interface VideoTemplateConfig {
  id: VideoTemplate;
  name: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultFps: number;
  defaultDuration: number;
  requiredInputs: TemplateInput[];
  optionalInputs?: TemplateInput[];
  previewThumbnail?: string;
}

export interface TemplateInput {
  key: string;
  label: string;
  type: "text" | "image" | "video" | "audio" | "color" | "number" | "lyrics";
  required: boolean;
  default?: unknown;
  description?: string;
}

// =============================================================================
// Render Types
// =============================================================================

export interface RenderConfig {
  compositionId: string;
  codec?: "h264" | "h265" | "vp8" | "vp9" | "prores";
  imageFormat?: "jpeg" | "png";
  quality?: number; // 0-100
  outputLocation?: string;
}

export interface RenderProgress {
  compositionId: string;
  status: "pending" | "rendering" | "complete" | "error";
  progress: number; // 0-100
  currentFrame?: number;
  totalFrames?: number;
  outputUrl?: string;
  error?: string;
}

// =============================================================================
// Preset Configurations
// =============================================================================

export const VIDEO_PRESETS = {
  // Social Media
  "instagram-story": { width: 1080, height: 1920, fps: 30 },
  "instagram-post": { width: 1080, height: 1080, fps: 30 },
  "instagram-reel": { width: 1080, height: 1920, fps: 30 },
  "tiktok": { width: 1080, height: 1920, fps: 30 },
  "youtube": { width: 1920, height: 1080, fps: 30 },
  "youtube-short": { width: 1080, height: 1920, fps: 30 },
  "twitter": { width: 1280, height: 720, fps: 30 },

  // Standard
  "1080p": { width: 1920, height: 1080, fps: 30 },
  "720p": { width: 1280, height: 720, fps: 30 },
  "4k": { width: 3840, height: 2160, fps: 30 },

  // Custom
  "square": { width: 1080, height: 1080, fps: 30 },
  "portrait": { width: 1080, height: 1350, fps: 30 },
} as const;

export type VideoPreset = keyof typeof VIDEO_PRESETS;
