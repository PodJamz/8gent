/**
 * Auto-sync Booking to Google Calendar
 *
 * This endpoint is called after a booking is created to automatically
 * sync it to the host's Google Calendar (if connected).
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "@/lib/openclaw/client";
import { api } from '@/lib/convex-shim';
import {
  createCalendarEvent,
  refreshAccessToken,
  isTokenExpired,
  bookingToGoogleEvent,
} from "@/lib/scheduling/google-calendar";
import type { Booking } from "@/lib/scheduling/types";
import type { Id } from "../../../../../convex/_generated/dataModel";

// Lazy-loaded Convex client
let convex: ConvexHttpClient | null = null;
function getConvexClient() {
  if (!convex && process.env.NEXT_PUBLIC_CONVEX_URL) {
    convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  }
  return convex;
}

interface SyncRequest {
  bookingId: string;
  hostId: string;
  booking: Booking;
  timezone: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SyncRequest = await request.json();
    const { hostId, booking, timezone } = body;

    if (!hostId || !booking) {
      return NextResponse.json(
        { error: "Missing hostId or booking data" },
        { status: 400 }
      );
    }

    const convexClient = getConvexClient();
    if (!convexClient) {
      return NextResponse.json({
        success: true,
        synced: false,
        reason: "Convex not configured",
      });
    }

    // Fetch the host's calendar integration from Convex
    // Note: We use a public query that doesn't require auth for this purpose
    // This is a server-to-server call
    let integration;
    try {
      // Get all calendar integrations and find the one for this host
      // (In production, you might want a dedicated query for this)
      integration = await convexClient.query(api.scheduling.getCalendarIntegrationByHostId, {
        hostId,
      });
    } catch (error) {
      // Query might not exist yet - that's ok
      console.log("No calendar integration found for host:", hostId);
      return NextResponse.json({
        success: true,
        synced: false,
        reason: "No calendar integration configured",
      });
    }

    if (!integration) {
      return NextResponse.json({
        success: true,
        synced: false,
        reason: "Host has not connected Google Calendar",
      });
    }

    // Check if token needs refresh
    let accessToken = integration.accessToken;

    if (isTokenExpired(integration.tokenExpiry)) {
      try {
        const newTokens = await refreshAccessToken(integration.refreshToken);
        accessToken = newTokens.access_token;

        // Update tokens in database
        // Note: This would need a mutation - for now, we'll log and continue
        console.log("Token refreshed for calendar sync");
      } catch (error) {
        console.error("Token refresh failed:", error);
        return NextResponse.json({
          success: false,
          synced: false,
          error: "Calendar token expired, host needs to reconnect",
        });
      }
    }

    // Create the calendar event
    const calendarId = integration.calendarId || "primary";
    const event = bookingToGoogleEvent(
      booking,
      integration.calendarEmail,
      timezone || "America/Los_Angeles"
    );

    const createdEvent = await createCalendarEvent(
      accessToken,
      calendarId,
      event
    );

    // Extract Google Meet link if created
    let meetLink: string | undefined;
    if (createdEvent.conferenceData?.entryPoints) {
      const videoEntry = createdEvent.conferenceData.entryPoints.find(
        (e: { entryPointType: string }) => e.entryPointType === "video"
      );
      meetLink = videoEntry?.uri;
    }

    // Update the booking with Google Event ID and Meet link
    if (createdEvent.id && convexClient) {
      try {
        await convexClient.mutation(api.scheduling.updateBookingGoogleEventId, {
          bookingId: booking._id as Id<"bookings">,
          googleEventId: createdEvent.id,
          location: meetLink,
        });
      } catch (error) {
        console.error("Failed to update booking with Google event ID:", error);
        // Don't fail the request - the event was created
      }
    }

    return NextResponse.json({
      success: true,
      synced: true,
      googleEventId: createdEvent.id || null,
      meetLink,
    });
  } catch (error) {
    console.error("Calendar auto-sync error:", error);
    return NextResponse.json(
      {
        success: false,
        synced: false,
        error: error instanceof Error ? error.message : "Sync failed",
      },
      { status: 500 }
    );
  }
}
