/**
 * Security Stats API
 *
 * Returns aggregated security statistics for the dashboard.
 * Protected - requires admin authentication.
 *
 * NOTE: Temporarily disabled until Convex security module is regenerated.
 * Run `npx convex dev` to regenerate the API types.
 */

import { NextRequest, NextResponse } from "next/server";

// Temporarily disabled - Convex API types need regeneration
// import { cookies } from "next/headers";
// import { ConvexHttpClient } from "@/lib/openclaw/client";
// import { verifySession, ADMIN_COOKIE } from "@/lib/passcodeAuth";
// import { api } from '@/lib/convex-shim';

// const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  // Temporarily return mock data while Convex types are being regenerated
  // TODO: Re-enable once `npx convex dev` is run to regenerate api.security
  console.log("Security stats temporarily disabled - awaiting Convex regeneration");

  return NextResponse.json({
    total: 0,
    byType: {},
    bySeverity: {},
    byHour: {},
    topIps: [],
    authFailures: 0,
    authSuccesses: 0,
    uniqueIpCount: 0,
    note: "Security stats temporarily disabled"
  });
}
