/**
 * Remotion Render Module
 *
 * Video rendering capabilities:
 * - Sandbox mode: ffmpeg.wasm (works everywhere, no cloud costs)
 * - Server mode: Stub for Remotion Lambda (requires setup)
 */

export { RENDER_CONFIG, type RenderFormat, type QualityPreset } from "./config";

export {
  queueRender,
  getRenderJob,
  getAllRenderJobs,
  cancelRender,
  cleanupRenders,
  isServerRenderingAvailable,
  getRecommendedRenderMode,
  type RenderJob,
  type RenderRequest,
} from "./service";

export {
  renderInSandbox,
  captureFrames,
  cleanupFFmpeg,
  type SandboxRenderOptions,
  type SandboxRenderResult,
} from "./sandbox-renderer";
