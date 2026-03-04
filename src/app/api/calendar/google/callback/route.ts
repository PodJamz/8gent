/**
 * Google Calendar OAuth - Callback endpoint
 *
 * Handles the OAuth callback, exchanges code for tokens, and redirects.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  exchangeCodeForTokens,
  getGoogleUserEmail,
} from "@/lib/scheduling/google-calendar";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      console.error("OAuth error:", error);
      return NextResponse.redirect(
        new URL(`/calendar?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/calendar?error=no_code", request.url)
      );
    }

    // Decode state to get return URL
    let returnUrl = "/calendar";
    if (state) {
      try {
        const decoded = JSON.parse(Buffer.from(state, "base64").toString());
        returnUrl = decoded.returnUrl || "/calendar";
      } catch {
        // Invalid state, use default
      }
    }

    // Get the redirect URI (must match what was used in auth request)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const redirectUri = `${baseUrl}/api/calendar/google/callback`;

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    // Get user email
    const email = await getGoogleUserEmail(tokens.access_token);

    // Calculate token expiry timestamp
    const tokenExpiry = Date.now() + tokens.expires_in * 1000;

    // Encode tokens in URL params for client to save to Convex
    // In production, you'd want to encrypt these or use a more secure method
    const tokenData = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || "",
      tokenExpiry,
      calendarEmail: email,
      calendarId: "primary",
    };

    const tokenParam = Buffer.from(JSON.stringify(tokenData)).toString("base64");

    // Redirect back with token data
    const redirectUrl = new URL(returnUrl, request.url);
    redirectUrl.searchParams.set("google_tokens", tokenParam);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL(
        `/calendar?error=${encodeURIComponent(error instanceof Error ? error.message : "callback_failed")}`,
        request.url
      )
    );
  }
}
