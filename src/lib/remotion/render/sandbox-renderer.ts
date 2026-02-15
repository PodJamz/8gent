/**
 * Sandbox Video Renderer
 *
 * Renders videos using ffmpeg.wasm directly in Claw AI's sandbox.
 * No cloud infrastructure needed - runs entirely in the sandbox environment.
 */

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// =============================================================================
// Types
// =============================================================================

export interface SandboxRenderOptions {
  /** Composition frames as image data URLs */
  frames: string[];
  /** Frames per second */
  fps: number;
  /** Output format */
  format: "mp4" | "webm" | "gif";
  /** Audio source URL (optional) */
  audioSrc?: string;
  /** Audio start time offset */
  audioOffset?: number;
  /** Quality preset */
  quality?: "draft" | "standard" | "high";
  /** Progress callback */
  onProgress?: (progress: number) => void;
}

export interface SandboxRenderResult {
  success: boolean;
  outputBlob?: Blob;
  outputUrl?: string;
  duration?: number;
  error?: string;
}

// =============================================================================
// FFmpeg Instance Management
// =============================================================================

let ffmpeg: FFmpeg | null = null;
let ffmpegLoading: Promise<void> | null = null;

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg && ffmpeg.loaded) {
    return ffmpeg;
  }

  if (ffmpegLoading) {
    await ffmpegLoading;
    return ffmpeg!;
  }

  ffmpeg = new FFmpeg();

  ffmpegLoading = (async () => {
    // Load ffmpeg with CORS-enabled URLs
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

    await ffmpeg!.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
  })();

  await ffmpegLoading;
  return ffmpeg!;
}

// =============================================================================
// Quality Presets
// =============================================================================

const QUALITY_PRESETS = {
  draft: {
    crf: "28",
    preset: "ultrafast",
    scale: 0.5,
  },
  standard: {
    crf: "23",
    preset: "medium",
    scale: 1,
  },
  high: {
    crf: "18",
    preset: "slow",
    scale: 1,
  },
};

// =============================================================================
// Main Render Function
// =============================================================================

export async function renderInSandbox(
  options: SandboxRenderOptions
): Promise<SandboxRenderResult> {
  const {
    frames,
    fps,
    format,
    audioSrc,
    audioOffset = 0,
    quality = "standard",
    onProgress,
  } = options;

  const startTime = Date.now();

  try {
    const ff = await getFFmpeg();

    // Set up progress handler
    ff.on("progress", ({ progress }) => {
      onProgress?.(Math.round(progress * 100));
    });

    const preset = QUALITY_PRESETS[quality];

    // Write frames to ffmpeg virtual filesystem
    onProgress?.(5);

    for (let i = 0; i < frames.length; i++) {
      const frameData = frames[i];

      // Convert data URL to Uint8Array
      const base64 = frameData.split(",")[1];
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let j = 0; j < binaryString.length; j++) {
        bytes[j] = binaryString.charCodeAt(j);
      }

      // Write frame with zero-padded index
      const frameName = `frame${String(i).padStart(6, "0")}.png`;
      await ff.writeFile(frameName, bytes);

      // Update progress (5-50% for frame writing)
      if (i % 10 === 0) {
        onProgress?.(5 + Math.round((i / frames.length) * 45));
      }
    }

    // Write audio if provided
    if (audioSrc) {
      const audioData = await fetchFile(audioSrc);
      await ff.writeFile("audio.mp3", audioData);
    }

    onProgress?.(50);

    // Build ffmpeg command
    const outputFile = `output.${format}`;
    const ffmpegArgs: string[] = [];

    // Input: image sequence
    ffmpegArgs.push("-framerate", String(fps));
    ffmpegArgs.push("-i", "frame%06d.png");

    // Input: audio (if provided)
    if (audioSrc) {
      ffmpegArgs.push("-ss", String(audioOffset));
      ffmpegArgs.push("-i", "audio.mp3");
    }

    // Video codec settings based on format
    if (format === "mp4") {
      ffmpegArgs.push("-c:v", "libx264");
      ffmpegArgs.push("-crf", preset.crf);
      ffmpegArgs.push("-preset", preset.preset);
      ffmpegArgs.push("-pix_fmt", "yuv420p");
    } else if (format === "webm") {
      ffmpegArgs.push("-c:v", "libvpx-vp9");
      ffmpegArgs.push("-crf", preset.crf);
      ffmpegArgs.push("-b:v", "0");
    } else if (format === "gif") {
      // GIF requires palette generation for quality
      ffmpegArgs.push("-vf", "fps=15,scale=480:-1:flags=lanczos");
    }

    // Audio codec (if audio present)
    if (audioSrc) {
      if (format === "mp4") {
        ffmpegArgs.push("-c:a", "aac");
        ffmpegArgs.push("-b:a", "192k");
      } else if (format === "webm") {
        ffmpegArgs.push("-c:a", "libopus");
      }
      // Map both streams
      ffmpegArgs.push("-map", "0:v");
      ffmpegArgs.push("-map", "1:a");
      ffmpegArgs.push("-shortest");
    }

    // Scale if needed
    if (preset.scale !== 1) {
      const scaleFilter = `scale=iw*${preset.scale}:ih*${preset.scale}`;
      const vfIndex = ffmpegArgs.indexOf("-vf");
      if (vfIndex !== -1) {
        ffmpegArgs[vfIndex + 1] = `${ffmpegArgs[vfIndex + 1]},${scaleFilter}`;
      } else {
        ffmpegArgs.push("-vf", scaleFilter);
      }
    }

    // Output
    ffmpegArgs.push("-y", outputFile);

    // Execute ffmpeg
    onProgress?.(55);
    await ff.exec(ffmpegArgs);
    onProgress?.(95);

    // Read output file
    const outputData = await ff.readFile(outputFile);

    // Clean up virtual filesystem
    for (let i = 0; i < frames.length; i++) {
      const frameName = `frame${String(i).padStart(6, "0")}.png`;
      try {
        await ff.deleteFile(frameName);
      } catch {
        // Ignore cleanup errors
      }
    }
    if (audioSrc) {
      try {
        await ff.deleteFile("audio.mp3");
      } catch {
        // Ignore
      }
    }
    try {
      await ff.deleteFile(outputFile);
    } catch {
      // Ignore
    }

    // Create blob and URL
    const mimeType =
      format === "mp4"
        ? "video/mp4"
        : format === "webm"
        ? "video/webm"
        : "image/gif";

    const outputBlob = new Blob([outputData], { type: mimeType });
    const outputUrl = URL.createObjectURL(outputBlob);

    onProgress?.(100);

    return {
      success: true,
      outputBlob,
      outputUrl,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Render failed",
      duration: Date.now() - startTime,
    };
  }
}

// =============================================================================
// Frame Capture Utility
// =============================================================================

/**
 * Capture frames from a Remotion composition
 * This would be called from the browser with access to the composition
 */
export async function captureFrames(
  renderFrame: (frame: number) => Promise<string>,
  totalFrames: number,
  onProgress?: (progress: number) => void
): Promise<string[]> {
  const frames: string[] = [];

  for (let i = 0; i < totalFrames; i++) {
    const frameDataUrl = await renderFrame(i);
    frames.push(frameDataUrl);

    if (i % 5 === 0) {
      onProgress?.(Math.round((i / totalFrames) * 100));
    }
  }

  return frames;
}

// =============================================================================
// Cleanup
// =============================================================================

export function cleanupFFmpeg(): void {
  if (ffmpeg) {
    ffmpeg.terminate();
    ffmpeg = null;
    ffmpegLoading = null;
  }
}
