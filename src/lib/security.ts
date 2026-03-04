/**
 * Security Monitoring Library
 *
 * Client-side utilities for security event logging and device fingerprinting.
 */

import { ConvexHttpClient } from "@/lib/openclaw/client";
import { makeFunctionReference } from "@/lib/openclaw/client";

// Lazy-initialized Convex client for server-side logging
let _convexSecurityClient: ConvexHttpClient | null = null;
function getSecurityConvexClient(): ConvexHttpClient | null {
  if (_convexSecurityClient === null && process.env.NEXT_PUBLIC_CONVEX_URL) {
    _convexSecurityClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  }
  return _convexSecurityClient;
}

// =============================================================================
// Types
// =============================================================================

export type SecurityEventType =
  | "admin_login_success"
  | "admin_login_failed"
  | "admin_logout"
  | "passcode_unlock_success"
  | "passcode_unlock_failed"
  | "ipod_auth_success"
  | "ipod_auth_failed"
  | "clerk_signin"
  | "clerk_signout"
  | "api_request"
  | "api_error"
  | "rate_limit_hit"
  | "brute_force_attempt"
  | "suspicious_ip"
  | "session_hijack_attempt"
  | "invalid_token"
  | "geo_anomaly"
  | "system_alert"
  | "config_change";

export type SecuritySeverity = "info" | "warning" | "critical" | "alert";

export type ActorType =
  | "anonymous"
  | "admin"
  | "user"
  | "collaborator"
  | "system";

export interface SecurityEventPayload {
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  actorType: ActorType;
  actorId?: string;
  actorEmail?: string;
  message: string;
  metadata?: Record<string, unknown>;
  targetResource?: string;
  targetId?: string;
}

export interface GeoData {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface DeviceInfo {
  fingerprint?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
}

// =============================================================================
// Device Detection
// =============================================================================

/**
 * Parse user agent to extract device info
 */
export function parseUserAgent(ua: string): DeviceInfo {
  const info: DeviceInfo = {};

  // Detect device type
  if (/bot|crawler|spider|crawling/i.test(ua)) {
    info.deviceType = "bot";
  } else if (/mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(ua)) {
    if (/ipad|tablet|playbook|silk/i.test(ua)) {
      info.deviceType = "tablet";
    } else {
      info.deviceType = "mobile";
    }
  } else {
    info.deviceType = "desktop";
  }

  // Detect browser
  if (/firefox/i.test(ua)) {
    info.browser = "Firefox";
  } else if (/edg/i.test(ua)) {
    info.browser = "Edge";
  } else if (/chrome|chromium|crios/i.test(ua)) {
    info.browser = "Chrome";
  } else if (/safari/i.test(ua)) {
    info.browser = "Safari";
  } else if (/opera|opr/i.test(ua)) {
    info.browser = "Opera";
  } else if (/msie|trident/i.test(ua)) {
    info.browser = "IE";
  } else {
    info.browser = "Unknown";
  }

  // Detect OS
  if (/windows/i.test(ua)) {
    info.os = "Windows";
  } else if (/macintosh|mac os x/i.test(ua)) {
    info.os = "macOS";
  } else if (/linux/i.test(ua)) {
    info.os = "Linux";
  } else if (/android/i.test(ua)) {
    info.os = "Android";
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    info.os = "iOS";
  } else {
    info.os = "Unknown";
  }

  return info;
}

/**
 * Generate a simple device fingerprint (server-side)
 */
export function generateFingerprint(
  ip: string,
  ua: string,
  acceptLanguage?: string
): string {
  // Create a simple hash from available data
  const data = `${ip}|${ua}|${acceptLanguage || ""}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

// =============================================================================
// Server-Side Logging (for API routes)
// =============================================================================

/**
 * Log a security event from a server-side context (API route)
 */
export async function logSecurityEvent(
  payload: SecurityEventPayload,
  request: Request,
  geoData?: GeoData
): Promise<void> {
  try {
    const client = getSecurityConvexClient();
    if (!client) {
      console.warn("[Security] Convex client not available, logging to console only");
      console.log("[Security Event]", payload.eventType, payload.message);
      return;
    }

    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "unknown";
    const deviceInfo = parseUserAgent(userAgent);
    const fingerprint = generateFingerprint(ip, userAgent);

    // Use makeFunctionReference to avoid type generation dependency
    const logSecurityEventMutation = makeFunctionReference<
      "mutation",
      {
        eventType: SecurityEventType;
        severity: SecuritySeverity;
        actorType: ActorType;
        actorId?: string;
        actorEmail?: string;
        message: string;
        metadata?: Record<string, unknown>;
        targetResource?: string;
        targetId?: string;
        ipAddress: string;
        userAgent: string;
        fingerprint: string;
        deviceType?: string;
        browser?: string;
        os?: string;
        country?: string;
        region?: string;
        city?: string;
      },
      void
    >("security:logSecurityEvent");

    await client.mutation(logSecurityEventMutation, {
      eventType: payload.eventType,
      severity: payload.severity,
      actorType: payload.actorType,
      actorId: payload.actorId,
      actorEmail: payload.actorEmail,
      message: payload.message,
      metadata: payload.metadata,
      targetResource: payload.targetResource,
      targetId: payload.targetId,
      ipAddress: ip,
      userAgent,
      fingerprint,
      deviceType: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      country: geoData?.country,
      region: geoData?.region,
      city: geoData?.city,
    });

    console.log("[Security] Event logged:", payload.eventType, payload.severity);
  } catch (error) {
    // Log to console as fallback, never fail silently
    console.error("[Security] Failed to log event to Convex:", error);
    console.log("[Security Event Fallback]", payload.eventType, payload.message);
  }
}

/**
 * Extract client IP from request headers
 * Handles Vercel, Cloudflare, and standard proxies
 */
export function getClientIp(request: Request): string {
  // Try various headers in order of preference
  const headers = request.headers;

  // Vercel
  const vercelIp = headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    return vercelIp.split(",")[0].trim();
  }

  // Cloudflare
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp;
  }

  // Standard proxy header
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  // Real IP header
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback
  return "unknown";
}

// =============================================================================
// Rate Limiting Helper
// =============================================================================

// In-memory rate limit tracker (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check and update rate limit for a key (IP, user ID, etc.)
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const existing = rateLimitMap.get(key);

  if (!existing || existing.resetAt < now) {
    // New window
    const resetAt = now + config.windowMs;
    rateLimitMap.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt,
    };
  }

  if (existing.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - existing.count,
    resetAt: existing.resetAt,
  };
}

// Clean up old rate limit entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetAt < now) {
        rateLimitMap.delete(key);
      }
    }
  }, 60000); // Clean up every minute
}

// =============================================================================
// Brute Force Detection
// =============================================================================

// Track failed attempts per IP
const failedAttempts = new Map<
  string,
  { count: number; firstAttempt: number }
>();

export interface BruteForceConfig {
  maxAttempts: number; // Max failed attempts before flagging
  windowMs: number; // Time window to count attempts
}

/**
 * Record a failed attempt and check for brute force
 */
export function recordFailedAttempt(
  ip: string,
  config: BruteForceConfig = { maxAttempts: 5, windowMs: 15 * 60 * 1000 }
): boolean {
  const now = Date.now();
  const existing = failedAttempts.get(ip);

  if (!existing || now - existing.firstAttempt > config.windowMs) {
    // New window
    failedAttempts.set(ip, { count: 1, firstAttempt: now });
    return false;
  }

  existing.count++;
  return existing.count >= config.maxAttempts;
}

/**
 * Clear failed attempts for an IP (call on successful login)
 */
export function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip);
}

// =============================================================================
// Geo Lookup (using ip-api.com - free for non-commercial)
// =============================================================================

const geoCache = new Map<string, { data: GeoData; cachedAt: number }>();
const GEO_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Look up geolocation for an IP address
 */
export async function lookupGeo(ip: string): Promise<GeoData | null> {
  // Skip local/private IPs
  if (
    ip === "unknown" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    return null;
  }

  // Check cache
  const cached = geoCache.get(ip);
  if (cached && Date.now() - cached.cachedAt < GEO_CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=country,regionName,city,lat,lon`,
      { signal: AbortSignal.timeout(2000) }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.status === "fail") {
      return null;
    }

    const geoData: GeoData = {
      country: data.country,
      region: data.regionName,
      city: data.city,
      latitude: data.lat,
      longitude: data.lon,
    };

    // Cache the result
    geoCache.set(ip, { data: geoData, cachedAt: Date.now() });

    return geoData;
  } catch {
    return null;
  }
}
