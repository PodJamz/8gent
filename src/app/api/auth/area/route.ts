/**
 * Protected Area Authentication API
 *
 * Verifies 6-digit passcodes for protected areas.
 * Includes security event logging for all auth attempts.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ConvexHttpClient } from '@/lib/convex-shim';

// Shim for makeFunctionReference
const makeFunctionReference = <T1, T2, T3>(name: string): string => name;
import {
  verifyPasscode,
  createAreaSession,
  getAreaCookieName,
  verifySession,
  isValidPasscodeFormat,
} from '@/lib/passcodeAuth';
import {
  logSecurityEvent,
  getClientIp,
  recordFailedAttempt,
  clearFailedAttempts,
} from '@/lib/security';

// Create function references for passcodes module (avoiding generated type issues)
const getAreaPasscodeHash = makeFunctionReference<
  'query',
  { slug: string },
  string | null
>('passcodes:getAreaPasscodeHash');

const getProtectedArea = makeFunctionReference<
  'query',
  { slug: string },
  { name: string; isActive: boolean; hasPasscode: boolean } | null
>('passcodes:getProtectedArea');

// Lazy-loaded Convex client
let convex: ConvexHttpClient | null = null;
function getConvexClient() {
  if (!convex && process.env.NEXT_PUBLIC_CONVEX_URL) {
    convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  }
  return convex;
}

export async function POST(request: NextRequest) {
  try {
    const { areaSlug, passcode } = await request.json();

    if (!areaSlug || !passcode) {
      return NextResponse.json(
        { error: 'Area slug and passcode required' },
        { status: 400 }
      );
    }

    if (!isValidPasscodeFormat(passcode)) {
      return NextResponse.json(
        { error: 'Invalid passcode format' },
        { status: 400 }
      );
    }

    const convexClient = getConvexClient();
    if (!convexClient) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Get passcode hash from database
    const hash = await convexClient.query(getAreaPasscodeHash, {
      slug: areaSlug,
    });

    if (!hash) {
      // No passcode set - area is open
      return NextResponse.json({ success: true, noPasscodeRequired: true });
    }

    // Verify passcode
    if (!verifyPasscode(passcode, hash)) {
      const ip = getClientIp(request);
      const isBruteForce = recordFailedAttempt(ip);

      // Log failed attempt
      await logSecurityEvent(
        {
          eventType: 'passcode_unlock_failed',
          severity: isBruteForce ? 'critical' : 'warning',
          actorType: 'anonymous',
          message: isBruteForce
            ? `Brute force detected: Multiple failed passcode attempts for "${areaSlug}" from ${ip}`
            : `Failed passcode attempt for protected area: ${areaSlug}`,
          targetResource: '/api/auth/area',
          targetId: areaSlug,
        },
        request
      );

      if (isBruteForce) {
        await logSecurityEvent(
          {
            eventType: 'brute_force_attempt',
            severity: 'alert',
            actorType: 'anonymous',
            message: `Brute force attack detected: ${ip} exceeded failed passcode threshold for "${areaSlug}"`,
            targetResource: '/api/auth/area',
            targetId: areaSlug,
          },
          request
        );
      }

      return NextResponse.json(
        { error: 'Incorrect passcode' },
        { status: 401 }
      );
    }

    // Create session token
    const token = createAreaSession(areaSlug);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(getAreaCookieName(areaSlug), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Clear failed attempts on successful unlock
    const ip = getClientIp(request);
    clearFailedAttempts(ip);

    // Log successful unlock
    await logSecurityEvent(
      {
        eventType: 'passcode_unlock_success',
        severity: 'info',
        actorType: 'anonymous',
        message: `Protected area unlocked: ${areaSlug}`,
        targetResource: '/api/auth/area',
        targetId: areaSlug,
      },
      request
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Area auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Check if user has access to an area
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const areaSlug = searchParams.get('area');

    if (!areaSlug) {
      return NextResponse.json({ error: 'Area slug required' }, { status: 400 });
    }

    const convexClient = getConvexClient();
    if (!convexClient) {
      return NextResponse.json({ hasAccess: true }); // No DB = no protection
    }

    // Check if area requires passcode
    const area = await convexClient.query(getProtectedArea, {
      slug: areaSlug,
    });

    if (!area || !area.isActive || !area.hasPasscode) {
      return NextResponse.json({ hasAccess: true, reason: 'not-protected' });
    }

    // Check for valid session
    const cookieStore = await cookies();
    const token = cookieStore.get(getAreaCookieName(areaSlug))?.value;
    const session = verifySession(token);

    if (session && session.type === 'area' && session.subject === areaSlug) {
      return NextResponse.json({ hasAccess: true });
    }

    return NextResponse.json({ hasAccess: false, areaName: area.name });
  } catch (error) {
    console.error('Area check error:', error);
    return NextResponse.json({ hasAccess: true }); // Fail open for UX
  }
}
