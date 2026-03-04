/**
 * Video Generation Library
 *
 * Provides video generation capabilities via multiple providers:
 * - LTX-2 (Lightricks via Fal AI) - Primary
 * - Kling (via Fal AI) - Fallback
 */

export * from './ltx-video';

// Re-export types for convenience
export type {
  LTXTextToVideoRequest,
  LTXImageToVideoRequest,
  LTXVideoResponse,
  LTXVideoPreset,
} from './ltx-video';

export {
  LTX_PRESETS,
  generateVideoFromText,
  generateVideoFromImage,
  generateVideoWithPreset,
  isLTXConfigured,
  getEstimatedDuration,
  getFrameCountForDuration,
} from './ltx-video';
