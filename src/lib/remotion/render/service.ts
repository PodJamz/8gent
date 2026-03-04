/**
 * Remotion Render Service
 *
 * Server-side rendering stub. The actual rendering is done via:
 * 1. Sandbox mode: ffmpeg.wasm (works everywhere, no native deps)
 * 2. Server mode: Requires Remotion Lambda or dedicated render server
 *
 * This file provides the job management API without the native renderer.
 */

// =============================================================================
// Types
// =============================================================================

export interface RenderJob {
  id: string;
  compositionId: string;
  compositionName: string;
  format: "mp4" | "webm" | "gif";
  quality: "draft" | "standard" | "high";
  status: "queued" | "rendering" | "completed" | "failed" | "not_configured";
  progress: number;
  outputPath?: string;
  outputUrl?: string;
  error?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  durationMs?: number;
}

export interface RenderRequest {
  compositionId: string;
  compositionName: string;
  compositionData: {
    width: number;
    height: number;
    fps: number;
    durationInFrames: number;
    props: Record<string, unknown>;
  };
  format?: "mp4" | "webm" | "gif";
  quality?: "draft" | "standard" | "high";
}

// =============================================================================
// In-Memory Job Store
// =============================================================================

const renderJobs = new Map<string, RenderJob>();

export function getRenderJob(jobId: string): RenderJob | undefined {
  return renderJobs.get(jobId);
}

export function getAllRenderJobs(): RenderJob[] {
  return Array.from(renderJobs.values()).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

// =============================================================================
// Server Rendering (Stub - requires Remotion Lambda setup)
// =============================================================================

/**
 * Queue a render job
 *
 * Note: Server-side rendering requires Remotion Lambda or a dedicated
 * render server with ffmpeg installed. Use sandbox mode for local rendering.
 */
export async function queueRender(request: RenderRequest): Promise<RenderJob> {
  const jobId = `render-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const job: RenderJob = {
    id: jobId,
    compositionId: request.compositionId,
    compositionName: request.compositionName,
    format: request.format || "mp4",
    quality: request.quality || "standard",
    status: "not_configured",
    progress: 0,
    error:
      "Server-side rendering not configured. Use sandbox mode (mode='sandbox') " +
      "for local rendering with ffmpeg.wasm, or set up Remotion Lambda for cloud rendering.",
    createdAt: Date.now(),
    completedAt: Date.now(),
  };

  renderJobs.set(jobId, job);

  return job;
}

/**
 * Cancel a render job
 */
export function cancelRender(jobId: string): boolean {
  const job = renderJobs.get(jobId);
  if (!job || job.status === "completed" || job.status === "failed") {
    return false;
  }

  job.status = "failed";
  job.error = "Cancelled by user";
  job.completedAt = Date.now();

  return true;
}

/**
 * Clean up old render jobs
 */
export async function cleanupRenders(
  maxAgeMs: number = 24 * 60 * 60 * 1000
): Promise<number> {
  const now = Date.now();
  let cleaned = 0;

  for (const [jobId, job] of renderJobs) {
    if (now - job.createdAt > maxAgeMs) {
      renderJobs.delete(jobId);
      cleaned++;
    }
  }

  return cleaned;
}

// =============================================================================
// Configuration Check
// =============================================================================

export function isServerRenderingAvailable(): boolean {
  // Server rendering requires Remotion Lambda or native ffmpeg
  // Return false since we're using the lightweight stub
  return false;
}

export function getRecommendedRenderMode(): "sandbox" | "server" {
  // Always recommend sandbox since server isn't configured
  return "sandbox";
}
