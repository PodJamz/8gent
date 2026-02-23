/**
 * Discovery Call Webhook Handler
 *
 * Called by deepclaw when a discovery call ends.
 * Triggers the processing pipeline: transcript → insights → artifacts → notification.
 *
 * @see GitHub Issue #751
 * @see src/lib/claw-ai/discovery-orchestrator.ts
 */

import { NextResponse } from 'next/server';
import { handleCallEndWebhook } from '@/lib/8gent/discovery-orchestrator';
import type { TranscriptEntry } from '@/lib/8gent/discovery-types';

const WEBHOOK_SECRET = process.env.DISCOVERY_WEBHOOK_SECRET;

interface DiscoveryWebhookPayload {
  callerId: string;
  transcript: TranscriptEntry[];
  duration: number; // seconds
  clientName?: string;
  clientEmail?: string;
  callSid?: string; // Twilio call SID
}

export async function POST(request: Request) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get('Authorization');
    if (WEBHOOK_SECRET) {
      if (!authHeader || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
        console.error('[DiscoveryWebhook] Invalid or missing authorization');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const payload: DiscoveryWebhookPayload = await request.json();

    // Validate required fields
    if (!payload.callerId) {
      return NextResponse.json(
        { error: 'Missing required field: callerId' },
        { status: 400 }
      );
    }

    if (!payload.transcript || !Array.isArray(payload.transcript)) {
      return NextResponse.json(
        { error: 'Missing or invalid field: transcript' },
        { status: 400 }
      );
    }

    if (typeof payload.duration !== 'number') {
      return NextResponse.json(
        { error: 'Missing or invalid field: duration' },
        { status: 400 }
      );
    }

    console.log('[DiscoveryWebhook] Received call end webhook');
    console.log(`  Caller: ${payload.callerId}`);
    console.log(`  Duration: ${payload.duration}s`);
    console.log(`  Transcript entries: ${payload.transcript.length}`);

    // Check minimum transcript length
    if (payload.transcript.length < 4) {
      console.log('[DiscoveryWebhook] Transcript too short, skipping processing');
      return NextResponse.json({
        success: false,
        reason: 'Transcript too short for meaningful analysis',
      });
    }

    // Get required environment variables
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    const ownerId = process.env.OWNER_USER_ID || 'system';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://openclaw.io';
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!convexUrl) {
      throw new Error('NEXT_PUBLIC_CONVEX_URL not configured');
    }

    // Process the call
    const result = await handleCallEndWebhook(
      payload.callerId,
      payload.transcript,
      payload.duration,
      {
        convexUrl,
        ownerId,
        baseUrl,
        resendApiKey,
      }
    );

    if (result.success) {
      console.log('[DiscoveryWebhook] Processing complete');
      console.log(`  Quality score: ${result.qualityScore}/100`);
      console.log(`  Artifacts: ${result.artifacts?.ticketIds.length || 0} tickets created`);

      return NextResponse.json({
        success: true,
        sessionId: result.sessionId,
        qualityScore: result.qualityScore,
        artifacts: {
          projectId: result.artifacts?.projectId,
          prdId: result.artifacts?.prdId,
          epicCount: result.artifacts?.epicIds.length,
          ticketCount: result.artifacts?.ticketIds.length,
        },
      });
    } else {
      console.error('[DiscoveryWebhook] Processing failed:', result.error);

      return NextResponse.json({
        success: false,
        sessionId: result.sessionId,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('[DiscoveryWebhook] Error:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'discovery-webhook',
    version: '1.0.0',
  });
}
