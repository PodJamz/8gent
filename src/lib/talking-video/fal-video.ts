/**
 * Fal.ai Video Generation Services
 *
 * Video Generation:
 * - LTX-2 (Primary): Lightricks' 19B parameter model for high-quality video
 * - Kling AI Pro (Fallback): Generate background video from photo + prompt
 *
 * Lip Sync:
 * - Veed Fast: Lip sync video to audio
 */

import type {
  KlingRequest,
  KlingResponse,
  VeedLipSyncRequest,
  VeedLipSyncResponse,
} from './types';
import { generateVideoFromImage, isLTXConfigured, type LTXVideoResponse } from '@/lib/video/ltx-video';

const FAL_API_URL = 'https://queue.fal.run';

// Fal model endpoints
const KLING_MODEL = 'fal-ai/kling-video/v1.5/pro/image-to-video';
const VEED_LIPSYNC_MODEL = 'fal-ai/veed/lipsync';

// Video provider preference (can be overridden via env)
const VIDEO_PROVIDER = process.env.VIDEO_PROVIDER || 'ltx2'; // 'ltx2' or 'kling'

interface FalQueueResponse {
  request_id: string;
  status: string;
  response_url?: string;
}

interface FalStatusResponse {
  status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  response_url?: string;
  logs?: { message: string; timestamp: string }[];
}

async function submitToFal<T>(
  model: string,
  input: Record<string, unknown>
): Promise<T> {
  const apiKey = process.env.FAL_KEY;
  if (!apiKey) {
    throw new Error('FAL_KEY not configured');
  }

  // Submit to queue
  const submitResponse = await fetch(`${FAL_API_URL}/${model}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Key ${apiKey}`,
    },
    body: JSON.stringify({ input }),
  });

  if (!submitResponse.ok) {
    const error = await submitResponse.text();
    throw new Error(`Fal API submit error: ${error}`);
  }

  const queueData: FalQueueResponse = await submitResponse.json();

  // Poll for completion
  const statusUrl = `${FAL_API_URL}/${model}/requests/${queueData.request_id}/status`;
  const resultUrl = `${FAL_API_URL}/${model}/requests/${queueData.request_id}`;

  let attempts = 0;
  const maxAttempts = 120; // 10 minutes max (5s intervals)

  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const statusResponse = await fetch(statusUrl, {
      headers: { Authorization: `Key ${apiKey}` },
    });

    if (!statusResponse.ok) {
      attempts++;
      continue;
    }

    const status: FalStatusResponse = await statusResponse.json();

    if (status.status === 'COMPLETED') {
      // Fetch the result
      const resultResponse = await fetch(resultUrl, {
        headers: { Authorization: `Key ${apiKey}` },
      });

      if (!resultResponse.ok) {
        throw new Error('Failed to fetch Fal result');
      }

      return resultResponse.json();
    }

    if (status.status === 'FAILED') {
      throw new Error('Fal job failed');
    }

    attempts++;
  }

  throw new Error('Fal job timed out');
}

/**
 * Generate background video from photo
 *
 * Uses LTX-2 as primary (better quality, Lightricks model)
 * Falls back to Kling AI Pro if LTX-2 fails
 */
export async function generateBackgroundVideo(
  request: KlingRequest
): Promise<KlingResponse> {
  // Try LTX-2 first if configured and preferred
  if (VIDEO_PROVIDER === 'ltx2' && isLTXConfigured()) {
    try {
      console.log('[Video] Using LTX-2 for background video generation');
      const ltxResult = await generateVideoFromImage({
        image_url: request.image_url,
        prompt: request.prompt,
        // LTX-2 uses frames, 97 frames ≈ 4 seconds at 24fps
        num_frames: request.duration === '10' ? 145 : 97,
      });

      // Convert LTX-2 response to Kling format for compatibility
      return {
        video: {
          url: ltxResult.video.url,
          content_type: ltxResult.video.content_type,
          file_name: ltxResult.video.file_name,
          file_size: ltxResult.video.file_size,
        },
      };
    } catch (ltxError) {
      console.warn('[Video] LTX-2 failed, falling back to Kling:', ltxError);
      // Fall through to Kling
    }
  }

  // Fallback to Kling AI Pro
  console.log('[Video] Using Kling AI Pro for background video generation');
  const result = await submitToFal<KlingResponse>(KLING_MODEL, {
    prompt: request.prompt,
    image_url: request.image_url,
    duration: request.duration || '5',
    aspect_ratio: request.aspect_ratio || '16:9',
  });

  return result;
}

/**
 * Generate background video using only Kling (for explicit fallback)
 */
export async function generateBackgroundVideoWithKling(
  request: KlingRequest
): Promise<KlingResponse> {
  console.log('[Video] Using Kling AI Pro (explicit)');
  const result = await submitToFal<KlingResponse>(KLING_MODEL, {
    prompt: request.prompt,
    image_url: request.image_url,
    duration: request.duration || '5',
    aspect_ratio: request.aspect_ratio || '16:9',
  });

  return result;
}

/**
 * Lip sync video to audio using Veed Fast
 * Takes a video (from Kling) and syncs lips to audio (from ElevenLabs)
 */
export async function lipSyncVideo(
  request: VeedLipSyncRequest
): Promise<VeedLipSyncResponse> {
  const result = await submitToFal<VeedLipSyncResponse>(VEED_LIPSYNC_MODEL, {
    video_url: request.video_url,
    audio_url: request.audio_url,
    sync_mode: request.sync_mode || 'accurate',
  });

  return result;
}

/**
 * Check if Fal is configured
 */
export function isFalConfigured(): boolean {
  return !!process.env.FAL_KEY;
}

/**
 * Alternative: Use Fal's sync endpoint for faster small jobs
 * (Not suitable for video generation, but useful for quick previews)
 */
export async function submitToFalSync<T>(
  model: string,
  input: Record<string, unknown>
): Promise<T> {
  const apiKey = process.env.FAL_KEY;
  if (!apiKey) {
    throw new Error('FAL_KEY not configured');
  }

  const response = await fetch(`https://fal.run/${model}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Key ${apiKey}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Fal API error: ${error}`);
  }

  return response.json();
}
