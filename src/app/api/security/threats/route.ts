/**
 * Threat Intelligence API
 *
 * Manage blocked IPs, fingerprints, and suspicious patterns.
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

// Get all threats
export async function GET(request: NextRequest) {
  // Temporarily return empty array while Convex types are being regenerated
  // TODO: Re-enable once `npx convex dev` is run to regenerate api.security
  console.log("Threat intel GET temporarily disabled - awaiting Convex regeneration");

  return NextResponse.json([]);
}

// Add a new threat
export async function POST(request: NextRequest) {
  // Temporarily return success while Convex types are being regenerated
  // TODO: Re-enable once `npx convex dev` is run to regenerate api.security
  console.log("Threat intel POST temporarily disabled - awaiting Convex regeneration");

  return NextResponse.json({
    success: true,
    note: "Threat addition temporarily disabled"
  });
}

// Remove a threat
export async function DELETE(request: NextRequest) {
  // Temporarily return success while Convex types are being regenerated
  // TODO: Re-enable once `npx convex dev` is run to regenerate api.security
  console.log("Threat intel DELETE temporarily disabled - awaiting Convex regeneration");

  return NextResponse.json({
    success: true,
    note: "Threat removal temporarily disabled"
  });
}
