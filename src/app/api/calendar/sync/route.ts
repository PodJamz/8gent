/**
 * Calendar Sync API
 *
 * Creates, updates, or deletes Google Calendar events for bookings.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  refreshAccessToken,
  isTokenExpired,
  bookingToGoogleEvent,
} from "@/lib/scheduling/google-calendar";
import type { Booking } from "@/lib/scheduling/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action, // "create" | "update" | "delete"
      booking,
      integration, // CalendarIntegration data
      timezone,
    } = body;

    if (!integration) {
      return NextResponse.json(
        { error: "No calendar integration found" },
        { status: 400 }
      );
    }

    // Check if token needs refresh
    let accessToken = integration.accessToken;

    if (isTokenExpired(integration.tokenExpiry)) {
      try {
        const newTokens = await refreshAccessToken(integration.refreshToken);
        accessToken = newTokens.access_token;

        // Return new tokens for client to save
        return NextResponse.json({
          success: false,
          needsTokenUpdate: true,
          newTokens: {
            accessToken: newTokens.access_token,
            refreshToken: newTokens.refresh_token || integration.refreshToken,
            tokenExpiry: Date.now() + newTokens.expires_in * 1000,
          },
        });
      } catch (error) {
        console.error("Token refresh failed:", error);
        return NextResponse.json(
          { error: "Token refresh failed. Please reconnect Google Calendar." },
          { status: 401 }
        );
      }
    }

    const calendarId = integration.calendarId || "primary";

    switch (action) {
      case "create": {
        if (!booking) {
          return NextResponse.json(
            { error: "Booking data required" },
            { status: 400 }
          );
        }

        const event = bookingToGoogleEvent(
          booking as Booking,
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
            (e) => e.entryPointType === "video"
          );
          meetLink = videoEntry?.uri;
        }

        return NextResponse.json({
          success: true,
          googleEventId: createdEvent.id,
          meetLink,
        });
      }

      case "update": {
        if (!booking?.googleEventId) {
          return NextResponse.json(
            { error: "Google event ID required for update" },
            { status: 400 }
          );
        }

        const event = bookingToGoogleEvent(
          booking as Booking,
          integration.calendarEmail,
          timezone || "America/Los_Angeles"
        );

        await updateCalendarEvent(
          accessToken,
          calendarId,
          booking.googleEventId,
          event
        );

        return NextResponse.json({ success: true });
      }

      case "delete": {
        if (!booking?.googleEventId) {
          return NextResponse.json(
            { error: "Google event ID required for delete" },
            { status: 400 }
          );
        }

        await deleteCalendarEvent(
          accessToken,
          calendarId,
          booking.googleEventId
        );

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Calendar sync error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 }
    );
  }
}
