/**
 * Sandbox Video Render API
 *
 * Renders videos using ffmpeg.wasm in the browser/sandbox.
 * No cloud infrastructure needed.
 *
 * POST /api/video/render-sandbox
 * Body: { frames: string[], fps: number, format: string, audioSrc?: string }
 *
 * Note: This endpoint is designed to be called from the client-side
 * or from 8gent's sandbox. The actual rendering happens client-side
 * using the sandbox-renderer module.
 */

import { NextRequest, NextResponse } from "next/server";

// This endpoint provides configuration and instructions for sandbox rendering
// The actual rendering happens client-side using ffmpeg.wasm

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      compositionId,
      format = "mp4",
      quality = "standard",
    } = body;

    if (!compositionId) {
      return NextResponse.json(
        { error: "Missing compositionId" },
        { status: 400 }
      );
    }

    // Return instructions for client-side rendering
    return NextResponse.json({
      success: true,
      renderMode: "sandbox",
      instructions: {
        step1: "Import renderInSandbox from @/lib/remotion/render/sandbox-renderer",
        step2: "Capture frames using Remotion's renderToCanvas or similar",
        step3: "Call renderInSandbox({ frames, fps, format, quality })",
        step4: "Use the returned outputUrl for download",
      },
      config: {
        compositionId,
        format,
        quality,
        supportedFormats: ["mp4", "webm", "gif"],
        qualityPresets: ["draft", "standard", "high"],
      },
      code: `
// Sandbox rendering example (runs in browser/sandbox)
import { renderInSandbox } from '@/lib/remotion/render/sandbox-renderer';

const result = await renderInSandbox({
  frames: capturedFrames, // Array of data URLs from canvas captures
  fps: 30,
  format: '${format}',
  quality: '${quality}',
  audioSrc: composition.audio?.src,
  onProgress: (p) => console.log(\`Rendering: \${p}%\`),
});

if (result.success) {
  // Download the video
  const a = document.createElement('a');
  a.href = result.outputUrl;
  a.download = 'video.${format}';
  a.click();
}
      `.trim(),
    });
  } catch (error) {
    console.error("Sandbox render error:", error);
    return NextResponse.json(
      { error: "Failed to configure sandbox render" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: "Sandbox Video Renderer",
    description: "Render videos using ffmpeg.wasm - no cloud needed",
    capabilities: {
      formats: ["mp4", "webm", "gif"],
      maxFrames: 1800, // ~60 seconds at 30fps (memory limited)
      audioSupport: true,
      qualityPresets: ["draft", "standard", "high"],
    },
    requirements: {
      browser: "Modern browser with WebAssembly support",
      memory: "~2GB available RAM for HD video",
    },
    usage: "POST with compositionId to get rendering instructions",
  });
}
