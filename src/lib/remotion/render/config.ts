/**
 * Remotion Render Configuration
 *
 * Configuration for server-side video rendering.
 */

import path from "path";

export const RENDER_CONFIG = {
  // Output directory for rendered videos
  outputDir: path.join(process.cwd(), "public", "renders"),

  // Temporary directory for render artifacts
  tempDir: path.join(process.cwd(), ".remotion"),

  // Default render settings
  defaults: {
    codec: "h264" as const,
    imageFormat: "jpeg" as const,
    pixelFormat: "yuv420p" as const,
    audioBitrate: "320k",
    videoBitrate: "8M",
    crf: 18, // Quality: 0 (lossless) - 51 (worst), 18 is visually lossless
  },

  // Quality presets
  presets: {
    draft: {
      crf: 28,
      scale: 0.5,
    },
    standard: {
      crf: 23,
      scale: 1,
    },
    high: {
      crf: 18,
      scale: 1,
    },
    maximum: {
      crf: 15,
      scale: 1,
    },
  },

  // Format-specific settings
  formats: {
    mp4: {
      codec: "h264" as const,
      extension: ".mp4",
      mimeType: "video/mp4",
    },
    webm: {
      codec: "vp8" as const,
      extension: ".webm",
      mimeType: "video/webm",
    },
    gif: {
      codec: "gif" as const,
      extension: ".gif",
      mimeType: "image/gif",
    },
  },

  // Concurrency limits
  concurrency: {
    maxConcurrentRenders: 2,
    framesPerWorker: 10,
  },
};

export type RenderFormat = keyof typeof RENDER_CONFIG.formats;
export type QualityPreset = keyof typeof RENDER_CONFIG.presets;
