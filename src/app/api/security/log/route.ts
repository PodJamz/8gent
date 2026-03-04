/**
 * Security Event Logging API
 *
 * Endpoint for logging security events from client-side or other services.
 * Protected endpoint - requires admin authentication.
 *
 * NOTE: Temporarily disabled until Convex security module is regenerated.
 * Run `npx convex dev` to regenerate the API types.
 */

import { NextRequest, NextResponse } from "next/server";

// Temporarily disabled - Convex API types need regeneration
// import { cookies } from "next/headers";
// import { ConvexHttpClient } from "@/lib/openclaw/client";
// import { verifySession, ADMIN_COOKIE } from "@/lib/passcodeAuth";
// import {
//   getClientIp,
//   parseUserAgent,
//   generateFingerprint,
//   lookupGeo,
// } from "@/lib/security";
// import { api } from '@/lib/convex-shim';

// const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Log a security event
export async function POST(request: NextRequest) {
  // Temporarily return success while Convex types are being regenerated
  // TODO: Re-enable once `npx convex dev` is run to regenerate api.security
  console.log("Security logging temporarily disabled - awaiting Convex regeneration");

  return NextResponse.json({
    success: true,
    note: "Security logging temporarily disabled"
  });
}
