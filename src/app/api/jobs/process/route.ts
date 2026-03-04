import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from '@/lib/convex-shim';
import { api } from '@/lib/convex-shim';

// Initialize Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export async function POST(request: NextRequest) {
  try {
    if (!convexUrl) {
      return NextResponse.json(
        { error: 'Convex URL not configured' },
        { status: 500 }
      );
    }

    const { jobId, jobType } = await request.json();

    if (!jobId || !jobType) {
      return NextResponse.json(
        { error: 'jobId and jobType are required' },
        { status: 400 }
      );
    }

    const client = new ConvexHttpClient(convexUrl);

    // Trigger the appropriate job processor based on type
    switch (jobType) {
      case 'ralph_search':
        // Use fetchAction for Convex actions
        await client.action(api.jobs.processRalphSearch, { jobId });
        break;

      // Add more job types here as needed
      // case 'image_gen':
      //   await client.action(api.jobs.processImageGen, { jobId });
      //   break;

      default:
        return NextResponse.json(
          { error: `Unknown job type: ${jobType}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, jobId });
  } catch (error) {
    console.error('Job processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
