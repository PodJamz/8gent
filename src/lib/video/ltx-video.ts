/**
 * LTX-2 Video Generation via Fal AI
 *
 * LTX-2 is Lightricks' 19B parameter DiT-based diffusion model for
 * synchronized audio-video generation.
 *
 * Capabilities:
 * - Text-to-Video (T2V)
 * - Image-to-Video (I2V)
 * - Video extension
 *
 * Model: fal-ai/ltx-video
 */

// LTX-2 API endpoints on Fal AI
const FAL_API_URL = 'https://queue.fal.run';
const LTX_TEXT_TO_VIDEO = 'fal-ai/ltx-video';
const LTX_IMAGE_TO_VIDEO = 'fal-ai/ltx-video/image-to-video';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface LTXTextToVideoRequest {
  /** Text description of the video to generate */
  prompt: string;
  /** What to avoid in the generation */
  negative_prompt?: string;
  /** Number of frames (must be 8n+1, e.g., 97, 121, 145) */
  num_frames?: number;
  /** Width in pixels (must be divisible by 32) */
  width?: number;
  /** Height in pixels (must be divisible by 32) */
  height?: number;
  /** Random seed for reproducibility */
  seed?: number;
  /** Number of inference steps (default: 30) */
  num_inference_steps?: number;
  /** Guidance scale (default: 7.5) */
  guidance_scale?: number;
}

export interface LTXImageToVideoRequest {
  /** Text description of the motion/animation */
  prompt: string;
  /** Starting image URL */
  image_url: string;
  /** What to avoid in the generation */
  negative_prompt?: string;
  /** Number of frames (must be 8n+1) */
  num_frames?: number;
  /** Random seed for reproducibility */
  seed?: number;
  /** Number of inference steps */
  num_inference_steps?: number;
  /** Guidance scale */
  guidance_scale?: number;
}

export interface LTXVideoResponse {
  video: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
  seed?: number;
  timings?: {
    inference: number;
  };
}

export interface LTXVideoPreset {
  name: string;
  width: number;
  height: number;
  num_frames: number;
  description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Presets
// ─────────────────────────────────────────────────────────────────────────────

export const LTX_PRESETS: Record<string, LTXVideoPreset> = {
  landscape_short: {
    name: 'Landscape Short',
    width: 768,
    height: 512,
    num_frames: 97, // ~4 seconds at 24fps
    description: '16:9 landscape, 4 seconds',
  },
  landscape_long: {
    name: 'Landscape Long',
    width: 768,
    height: 512,
    num_frames: 145, // ~6 seconds at 24fps
    description: '16:9 landscape, 6 seconds',
  },
  portrait_short: {
    name: 'Portrait Short',
    width: 512,
    height: 768,
    num_frames: 97,
    description: '9:16 portrait (stories/reels), 4 seconds',
  },
  portrait_long: {
    name: 'Portrait Long',
    width: 512,
    height: 768,
    num_frames: 145,
    description: '9:16 portrait (stories/reels), 6 seconds',
  },
  square: {
    name: 'Square',
    width: 512,
    height: 512,
    num_frames: 97,
    description: '1:1 square, 4 seconds',
  },
  cinematic: {
    name: 'Cinematic',
    width: 832,
    height: 448,
    num_frames: 121, // ~5 seconds
    description: '2.39:1 cinematic widescreen, 5 seconds',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Fal Queue Helpers
// ─────────────────────────────────────────────────────────────────────────────

interface FalQueueResponse {
  request_id: string;
  status: string;
  response_url?: string;
}

interface FalStatusResponse {
  status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  response_url?: string;
  logs?: { message: string; timestamp: string }[];
  error?: string;
}

async function submitToFalQueue<T>(
  model: string,
  input: Record<string, unknown>,
  options?: {
    maxAttempts?: number;
    pollInterval?: number;
    onProgress?: (status: string, logs?: { message: string; timestamp: string }[]) => void;
  }
): Promise<T> {
  const apiKey = process.env.FAL_KEY;
  if (!apiKey) {
    throw new Error('FAL_KEY not configured');
  }

  const maxAttempts = options?.maxAttempts ?? 180; // 15 minutes max
  const pollInterval = options?.pollInterval ?? 5000; // 5 seconds

  // Submit to queue
  const submitResponse = await fetch(`${FAL_API_URL}/${model}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Key ${apiKey}`,
    },
    body: JSON.stringify(input),
  });

  if (!submitResponse.ok) {
    const error = await submitResponse.text();
    throw new Error(`LTX-2 submit error: ${error}`);
  }

  const queueData: FalQueueResponse = await submitResponse.json();
  const statusUrl = `${FAL_API_URL}/${model}/requests/${queueData.request_id}/status`;
  const resultUrl = `${FAL_API_URL}/${model}/requests/${queueData.request_id}`;

  // Poll for completion
  let attempts = 0;

  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, pollInterval));

    const statusResponse = await fetch(statusUrl, {
      headers: { Authorization: `Key ${apiKey}` },
    });

    if (!statusResponse.ok) {
      attempts++;
      continue;
    }

    const status: FalStatusResponse = await statusResponse.json();
    options?.onProgress?.(status.status, status.logs);

    if (status.status === 'COMPLETED') {
      const resultResponse = await fetch(resultUrl, {
        headers: { Authorization: `Key ${apiKey}` },
      });

      if (!resultResponse.ok) {
        throw new Error('Failed to fetch LTX-2 result');
      }

      return resultResponse.json();
    }

    if (status.status === 'FAILED') {
      throw new Error(`LTX-2 job failed: ${status.error || 'Unknown error'}`);
    }

    attempts++;
  }

  throw new Error('LTX-2 job timed out');
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a video from a text prompt using LTX-2
 */
export async function generateVideoFromText(
  request: LTXTextToVideoRequest,
  options?: {
    onProgress?: (status: string) => void;
  }
): Promise<LTXVideoResponse> {
  // Validate frame count (must be 8n+1)
  if (request.num_frames && (request.num_frames - 1) % 8 !== 0) {
    const corrected = Math.floor((request.num_frames - 1) / 8) * 8 + 1;
    console.warn(`LTX-2: Correcting num_frames from ${request.num_frames} to ${corrected} (must be 8n+1)`);
    request.num_frames = corrected;
  }

  // Validate dimensions (must be divisible by 32)
  if (request.width && request.width % 32 !== 0) {
    request.width = Math.floor(request.width / 32) * 32;
  }
  if (request.height && request.height % 32 !== 0) {
    request.height = Math.floor(request.height / 32) * 32;
  }

  return submitToFalQueue<LTXVideoResponse>(
    LTX_TEXT_TO_VIDEO,
    {
      prompt: request.prompt,
      negative_prompt: request.negative_prompt || 'blurry, low quality, distorted, watermark',
      num_frames: request.num_frames || 97,
      width: request.width || 768,
      height: request.height || 512,
      seed: request.seed,
      num_inference_steps: request.num_inference_steps || 30,
      guidance_scale: request.guidance_scale || 7.5,
    },
    {
      onProgress: (status) => options?.onProgress?.(status),
    }
  );
}

/**
 * Generate a video from an image using LTX-2 (Image-to-Video)
 */
export async function generateVideoFromImage(
  request: LTXImageToVideoRequest,
  options?: {
    onProgress?: (status: string) => void;
  }
): Promise<LTXVideoResponse> {
  // Validate frame count (must be 8n+1)
  if (request.num_frames && (request.num_frames - 1) % 8 !== 0) {
    const corrected = Math.floor((request.num_frames - 1) / 8) * 8 + 1;
    request.num_frames = corrected;
  }

  return submitToFalQueue<LTXVideoResponse>(
    LTX_IMAGE_TO_VIDEO,
    {
      prompt: request.prompt,
      image_url: request.image_url,
      negative_prompt: request.negative_prompt || 'blurry, low quality, distorted, watermark',
      num_frames: request.num_frames || 97,
      seed: request.seed,
      num_inference_steps: request.num_inference_steps || 30,
      guidance_scale: request.guidance_scale || 7.5,
    },
    {
      onProgress: (status) => options?.onProgress?.(status),
    }
  );
}

/**
 * Generate video with a preset configuration
 */
export async function generateVideoWithPreset(
  prompt: string,
  presetName: keyof typeof LTX_PRESETS,
  options?: {
    negative_prompt?: string;
    seed?: number;
    image_url?: string;
    onProgress?: (status: string) => void;
  }
): Promise<LTXVideoResponse> {
  const preset = LTX_PRESETS[presetName];
  if (!preset) {
    throw new Error(`Unknown preset: ${presetName}`);
  }

  // If image_url provided, use I2V, otherwise T2V
  if (options?.image_url) {
    return generateVideoFromImage(
      {
        prompt,
        image_url: options.image_url,
        negative_prompt: options.negative_prompt,
        num_frames: preset.num_frames,
        seed: options.seed,
      },
      { onProgress: options?.onProgress }
    );
  }

  return generateVideoFromText(
    {
      prompt,
      negative_prompt: options?.negative_prompt,
      width: preset.width,
      height: preset.height,
      num_frames: preset.num_frames,
      seed: options?.seed,
    },
    { onProgress: options?.onProgress }
  );
}

/**
 * Check if LTX-2 is configured (Fal API key available)
 */
export function isLTXConfigured(): boolean {
  return !!process.env.FAL_KEY;
}

/**
 * Get estimated duration from frame count
 * LTX-2 generates at ~24fps
 */
export function getEstimatedDuration(numFrames: number): number {
  return numFrames / 24;
}

/**
 * Get recommended frame count for a target duration
 * Returns the nearest valid frame count (8n+1)
 */
export function getFrameCountForDuration(targetSeconds: number): number {
  const targetFrames = Math.round(targetSeconds * 24);
  // Round to nearest 8n+1
  return Math.floor((targetFrames - 1) / 8) * 8 + 1;
}
