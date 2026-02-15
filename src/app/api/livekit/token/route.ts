/**
 * LiveKit Token Generation API
 *
 * Generates access tokens for LiveKit rooms.
 * Used by voice call feature to authenticate WebRTC connections.
 */

import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/openclaw/auth-server';

const LOG_PREFIX = '[LiveKit Token]';

interface TokenRequest {
  roomName: string;
  participantName?: string;
  participantIdentity?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const body: TokenRequest = await request.json();
    const { roomName, participantName, participantIdentity } = body;

    // SECURITY: Require authentication for token generation
    // Guest tokens with predictable identities can lead to unauthorized room access
    if (!userId) {
      console.warn(`${LOG_PREFIX} Unauthenticated token request rejected`);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Use authenticated Clerk user ID as identity (never allow client override)
    const identity = userId;
    const name = participantName || 'User';

    // Validate required fields
    if (!roomName) {
      return NextResponse.json(
        { error: 'Missing required field: roomName' },
        { status: 400 }
      );
    }

    // Get LiveKit credentials from environment
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error(`${LOG_PREFIX} Missing LIVEKIT_API_KEY or LIVEKIT_API_SECRET`);
      return NextResponse.json(
        { error: 'LiveKit server not configured' },
        { status: 500 }
      );
    }

    // Create access token
    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name,
    });

    // Grant permissions
    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      canUpdateOwnMetadata: true, // Required for ClubSpaces role/name updates
    });

    // Generate token
    const token = await at.toJwt();

    console.log(`${LOG_PREFIX} Token generated for room: ${roomName}, participant: ${name} (${identity})`);

    return NextResponse.json({
      token,
      url: process.env.LIVEKIT_URL || 'ws://localhost:7880',
    });
  } catch (error) {
    console.error(`${LOG_PREFIX} Token generation failed:`, error);
    // SECURITY: Don't expose internal error details to clients
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
