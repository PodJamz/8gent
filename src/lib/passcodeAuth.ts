/**
 * Passcode Authentication System
 *
 * Handles 6-digit passcode verification for protected areas and iPod collaborators.
 * Uses HMAC-SHA256 for secure hashing and timing-safe comparison.
 */

import crypto from 'crypto';

// SECURITY: Require PASSCODE_SECRET to be set - no default fallback
function getPasscodeSecret(): string {
  const secret = process.env.PASSCODE_SECRET;
  if (!secret) {
    throw new Error('PASSCODE_SECRET environment variable is required');
  }
  if (secret.length < 32) {
    throw new Error('PASSCODE_SECRET must be at least 32 characters long');
  }
  return secret;
}

// Lazy-initialize to allow env vars to be set before first use
let cachedSecret: string | null = null;
function getSecret(): string {
  if (!cachedSecret) {
    cachedSecret = getPasscodeSecret();
  }
  return cachedSecret;
}

// Cookie names for session tokens
export const ADMIN_COOKIE = 'jamos_admin';
export const AREA_COOKIE_PREFIX = 'jamos_area_';
export const IPOD_COOKIE = 'jamos_ipod';

// Session duration (24 hours for admin, 7 days for areas/iPod)
const ADMIN_SESSION_DURATION = 24 * 60 * 60 * 1000;
const AREA_SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

/**
 * Hash a 6-digit passcode
 */
export function hashPasscode(passcode: string): string {
  return crypto
    .createHmac('sha256', getSecret())
    .update(passcode)
    .digest('hex');
}

/**
 * Verify a passcode against a hash (timing-safe)
 */
export function verifyPasscode(passcode: string, hash: string): boolean {
  const inputHash = hashPasscode(passcode);
  const inputBuffer = Buffer.from(inputHash);
  const hashBuffer = Buffer.from(hash);

  if (inputBuffer.length !== hashBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, hashBuffer);
}

/**
 * Session token payload
 */
interface SessionPayload {
  type: 'admin' | 'area' | 'ipod';
  subject: string; // admin username, area slug, or collaborator slug
  exp: number;
}

/**
 * Sign a session token
 */
export function signSession(payload: SessionPayload): string {
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(payloadB64)
    .digest('base64url');
  return `${payloadB64}.${signature}`;
}

/**
 * Verify and decode a session token
 */
export function verifySession(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;

  // Verify signature
  const expectedSig = crypto
    .createHmac('sha256', getSecret())
    .update(payloadB64)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSig);

  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  // Decode payload
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString()) as SessionPayload;

    // Check expiry
    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Create an admin session token
 */
export function createAdminSession(username: string): string {
  return signSession({
    type: 'admin',
    subject: username,
    exp: Date.now() + ADMIN_SESSION_DURATION,
  });
}

/**
 * Create an area session token
 */
export function createAreaSession(areaSlug: string): string {
  return signSession({
    type: 'area',
    subject: areaSlug,
    exp: Date.now() + AREA_SESSION_DURATION,
  });
}

/**
 * Create an iPod collaborator session token
 */
export function createiPodSession(collaboratorSlug: string): string {
  return signSession({
    type: 'ipod',
    subject: collaboratorSlug,
    exp: Date.now() + AREA_SESSION_DURATION,
  });
}

/**
 * Get cookie name for a protected area
 */
export function getAreaCookieName(areaSlug: string): string {
  return `${AREA_COOKIE_PREFIX}${areaSlug}`;
}

/**
 * Validate a 6-digit passcode format
 */
export function isValidPasscodeFormat(passcode: string): boolean {
  return /^\d{6}$/.test(passcode);
}
