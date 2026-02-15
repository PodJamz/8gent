/**
 * Google Calendar OAuth - Authorization endpoint
 *
 * Generates the Google OAuth URL for calendar integration.
 */

import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/scheduling/google-calendar";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const returnUrl = searchParams.get("returnUrl") || "/calendar";

    // Get the base URL for the redirect
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const redirectUri = `${baseUrl}/api/calendar/google/callback`;

    // State includes return URL for post-auth redirect
    const state = Buffer.from(JSON.stringify({ returnUrl })).toString("base64");

    const authUrl = getGoogleAuthUrl(redirectUri, state);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}
