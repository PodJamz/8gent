/**
 * Admin Authentication API
 *
 * Handles master admin login with username/password.
 * Includes security event logging for all auth attempts.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import {
  ADMIN_COOKIE,
  createAdminSession,
  verifySession,
} from '@/lib/passcodeAuth';
import {
  logSecurityEvent,
  getClientIp,
  recordFailedAttempt,
  clearFailedAttempts,
} from '@/lib/security';

// SECURITY: Admin credentials from environment - no defaults allowed
function getAdminUsername(): string {
  const username = process.env.ADMIN_USERNAME;
  if (!username) {
    throw new Error('ADMIN_USERNAME environment variable is required');
  }
  return username;
}

function getAdminPasswordHash(): string {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    throw new Error('ADMIN_PASSWORD_HASH environment variable is required');
  }
  return hash;
}

// Hash a password for comparison
function hashPassword(password: string): string {
  const secret = process.env.PASSCODE_SECRET;
  if (!secret) {
    throw new Error('PASSCODE_SECRET environment variable is required');
  }
  return crypto
    .createHash('sha256')
    .update(password + secret)
    .digest('hex');
}

// Timing-safe comparison
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    // Verify username
    if (username !== getAdminUsername()) {
      const ip = getClientIp(request);
      const isBruteForce = recordFailedAttempt(ip);

      // Log failed attempt
      await logSecurityEvent(
        {
          eventType: 'admin_login_failed',
          severity: isBruteForce ? 'critical' : 'warning',
          actorType: 'anonymous',
          message: isBruteForce
            ? `Brute force detected: Multiple failed admin login attempts from ${ip}`
            : `Failed admin login attempt: Invalid username "${username}"`,
          targetResource: '/api/auth/admin',
        },
        request
      );

      if (isBruteForce) {
        await logSecurityEvent(
          {
            eventType: 'brute_force_attempt',
            severity: 'alert',
            actorType: 'anonymous',
            message: `Brute force attack detected: ${ip} exceeded failed login threshold`,
            targetResource: '/api/auth/admin',
          },
          request
        );
      }

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const inputHash = hashPassword(password);
    const expectedHash = getAdminPasswordHash();

    if (!safeCompare(inputHash, expectedHash)) {
      const ip = getClientIp(request);
      const isBruteForce = recordFailedAttempt(ip);

      // Log failed attempt
      await logSecurityEvent(
        {
          eventType: 'admin_login_failed',
          severity: isBruteForce ? 'critical' : 'warning',
          actorType: 'anonymous',
          message: isBruteForce
            ? `Brute force detected: Multiple failed admin login attempts from ${ip}`
            : 'Failed admin login attempt: Invalid password',
          targetResource: '/api/auth/admin',
        },
        request
      );

      if (isBruteForce) {
        await logSecurityEvent(
          {
            eventType: 'brute_force_attempt',
            severity: 'alert',
            actorType: 'anonymous',
            message: `Brute force attack detected: ${ip} exceeded failed login threshold`,
            targetResource: '/api/auth/admin',
          },
          request
        );
      }

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session token
    const token = createAdminSession(username);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Clear failed attempts on successful login
    const ip = getClientIp(request);
    clearFailedAttempts(ip);

    // Log successful login
    await logSecurityEvent(
      {
        eventType: 'admin_login_success',
        severity: 'info',
        actorType: 'admin',
        actorId: username,
        message: `Admin login successful: ${username}`,
        targetResource: '/api/auth/admin',
      },
      request
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Check if admin is logged in
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE)?.value;
    const session = verifySession(token);

    if (!session || session.type !== 'admin') {
      return NextResponse.json({ isAuthenticated: false });
    }

    return NextResponse.json({
      isAuthenticated: true,
      username: session.subject,
    });
  } catch {
    return NextResponse.json({ isAuthenticated: false });
  }
}

// Logout
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE)?.value;
    const session = verifySession(token);

    cookieStore.delete(ADMIN_COOKIE);

    // Log logout
    if (session) {
      await logSecurityEvent(
        {
          eventType: 'admin_logout',
          severity: 'info',
          actorType: 'admin',
          actorId: session.subject,
          message: `Admin logout: ${session.subject}`,
          targetResource: '/api/auth/admin',
        },
        request
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
