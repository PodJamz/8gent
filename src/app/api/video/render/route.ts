/**
 * Video Render API
 *
 * POST /api/video/render - Start a new render job
 * GET /api/video/render?jobId=xxx - Get render job status
 * DELETE /api/video/render?jobId=xxx - Cancel a render job
 */

import { NextRequest, NextResponse } from "next/server";
import {
  queueRender,
  getRenderJob,
  getAllRenderJobs,
  cancelRender,
  type RenderRequest,
} from "@/lib/remotion/render/service";

// =============================================================================
// POST - Start Render
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    if (!body.compositionId || !body.compositionData) {
      return NextResponse.json(
        { error: "Missing compositionId or compositionData" },
        { status: 400 }
      );
    }

    const renderRequest: RenderRequest = {
      compositionId: body.compositionId,
      compositionName: body.compositionName || "Untitled",
      compositionData: {
        width: body.compositionData.width || 1920,
        height: body.compositionData.height || 1080,
        fps: body.compositionData.fps || 30,
        durationInFrames: body.compositionData.durationInFrames || 300,
        props: body.compositionData.props || {},
      },
      format: body.format || "mp4",
      quality: body.quality || "standard",
    };

    // Queue the render
    const job = await queueRender(renderRequest);

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        status: job.status,
        progress: job.progress,
        createdAt: job.createdAt,
      },
      message: `Render job ${job.id} queued successfully`,
    });
  } catch (error) {
    console.error("Render error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to start render",
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - Get Job Status
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    // If jobId provided, get specific job
    if (jobId) {
      const job = getRenderJob(jobId);

      if (!job) {
        return NextResponse.json(
          { error: "Render job not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        job: {
          id: job.id,
          compositionId: job.compositionId,
          compositionName: job.compositionName,
          format: job.format,
          quality: job.quality,
          status: job.status,
          progress: job.progress,
          outputUrl: job.outputUrl,
          error: job.error,
          createdAt: job.createdAt,
          startedAt: job.startedAt,
          completedAt: job.completedAt,
          durationMs: job.durationMs,
        },
      });
    }

    // Otherwise, list all jobs
    const jobs = getAllRenderJobs();

    return NextResponse.json({
      success: true,
      jobs: jobs.map((job) => ({
        id: job.id,
        compositionName: job.compositionName,
        format: job.format,
        status: job.status,
        progress: job.progress,
        outputUrl: job.outputUrl,
        createdAt: job.createdAt,
      })),
      total: jobs.length,
    });
  } catch (error) {
    console.error("Get render status error:", error);
    return NextResponse.json(
      { error: "Failed to get render status" },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Cancel Render
// =============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "Missing jobId parameter" },
        { status: 400 }
      );
    }

    const cancelled = cancelRender(jobId);

    if (!cancelled) {
      return NextResponse.json(
        { error: "Job not found or already completed" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Render job ${jobId} cancelled`,
    });
  } catch (error) {
    console.error("Cancel render error:", error);
    return NextResponse.json(
      { error: "Failed to cancel render" },
      { status: 500 }
    );
  }
}
