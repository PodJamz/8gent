/**
 * iPod Collaborator Authentication API
 *
 * Verifies 6-digit passcodes for iPod collaborators.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ConvexHttpClient } from '@/lib/convex-shim';
// Shim for makeFunctionReference
const makeFunctionReference = <T1, T2, T3>(name: string): string => name;
import {
  verifyPasscode,
  createiPodSession,
  IPOD_COOKIE,
  verifySession,
  isValidPasscodeFormat,
} from '@/lib/passcodeAuth';
import {
  recordFailedAttempt,
  clearFailedAttempts,
  logSecurityEvent,
  getClientIp,
} from '@/lib/security';

// Create function references for passcodes module (avoiding generated type issues)
const getCollaboratorPasscodeHash = makeFunctionReference<
  'query',
  { slug: string },
  string | null
>('passcodes:getCollaboratorPasscodeHash');

const updateCollaboratorLastAccess = makeFunctionReference<
  'mutation',
  { slug: string },
  void
>('passcodes:updateCollaboratorLastAccess');

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
    const { collaboratorSlug, passcode } = await request.json();

    if (!collaboratorSlug || !passcode) {
      return NextResponse.json(
        { error: 'Collaborator and passcode required' },
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
    const hash = await convexClient.query(getCollaboratorPasscodeHash, {
      slug: collaboratorSlug,
    });

    if (!hash) {
      return NextResponse.json(
        { error: 'Collaborator not found' },
        { status: 404 }
      );
    }

    // Verify passcode with brute force protection
    if (!verifyPasscode(passcode, hash)) {
      const ip = getClientIp(request);
      const isBruteForce = recordFailedAttempt(ip);

      await logSecurityEvent(
        {
          eventType: 'ipod_auth_failed',
          severity: isBruteForce ? 'critical' : 'warning',
          actorType: 'anonymous',
          message: `Failed iPod passcode attempt for collaborator: ${collaboratorSlug}`,
          metadata: { collaboratorSlug, isBruteForce },
          targetResource: `/api/auth/ipod/${collaboratorSlug}`,
        },
        request
      );

      if (isBruteForce) {
        return NextResponse.json(
          { error: 'Too many failed attempts. Please try again later.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: 'Incorrect passcode' },
        { status: 401 }
      );
    }

    // Clear failed attempts on success
    const ip = getClientIp(request);
    clearFailedAttempts(ip);

    // Log success
    await logSecurityEvent(
      {
        eventType: 'ipod_auth_success',
        severity: 'info',
        actorType: 'collaborator',
        message: `Successful iPod authentication for: ${collaboratorSlug}`,
        metadata: { collaboratorSlug },
        targetResource: `/api/auth/ipod/${collaboratorSlug}`,
      },
      request
    );

    // Update last access
    await convexClient.mutation(updateCollaboratorLastAccess, {
      slug: collaboratorSlug,
    });

    // Create session token
    const token = createiPodSession(collaboratorSlug);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(IPOD_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({
      success: true,
      collaborator: collaboratorSlug,
    });
  } catch (error) {
    console.error('iPod auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Check current iPod session
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(IPOD_COOKIE)?.value;
    const session = verifySession(token);

    if (!session || session.type !== 'ipod') {
      return NextResponse.json({ isAuthenticated: false });
    }

    return NextResponse.json({
      isAuthenticated: true,
      collaborator: session.subject,
    });
  } catch {
    return NextResponse.json({ isAuthenticated: false });
  }
}

// Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(IPOD_COOKIE);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
