/**
 * Channel Message Send API
 *
 * Unified endpoint for sending messages across all connected platforms.
 * Used by the Messages app UI and 8gent tools.
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "@/lib/openclaw/client";
import { api } from '@/lib/convex-shim';
import { sendMessage, Platform } from "@/lib/channels/outbound-router";
import { auth } from "@/lib/openclaw/auth-server";
import { makeFunctionReference } from "@/lib/openclaw/client";

// =============================================================================
// Configuration
// =============================================================================

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL not configured");
  }
  return new ConvexHttpClient(url);
}

/**
 * SECURITY: Get authenticated user ID from Clerk session
 * Returns null if not authenticated or not an owner
 */
async function getAuthenticatedOwnerId(): Promise<string | null> {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) return null;

    const convex = getConvexClient();
    const getManagedUser = makeFunctionReference<
      "query",
      { clerkId: string },
      { role: string; _id: string } | null
    >("userManagement:getManagedUserByClerkId");

    const managedUser = await convex.query(getManagedUser, { clerkId: clerkUserId });
    if (managedUser?.role === "owner") {
      return clerkUserId;
    }
    return null;
  } catch {
    return null;
  }
}

// =============================================================================
// Types
// =============================================================================

interface SendMessageRequest {
  integrationId: string;
  content: string;
  messageType?: "text" | "voice" | "image";
  mediaUrl?: string;
  replyToMessageId?: string;
}

// =============================================================================
// Handler
// =============================================================================

/**
 * POST /api/channels/send
 * Send a message through a connected channel
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // SECURITY: Verify owner authentication first
    const authenticatedUserId = await getAuthenticatedOwnerId();
    if (!authenticatedUserId) {
      return NextResponse.json(
        { error: "Unauthorized: Owner authentication required" },
        { status: 401 }
      );
    }

    const body: SendMessageRequest = await request.json();
    const { integrationId, content, messageType = "text", mediaUrl, replyToMessageId } = body;

    if (!integrationId || !content) {
      return NextResponse.json(
        { error: "Missing required fields: integrationId, content" },
        { status: 400 }
      );
    }

    const convex = getConvexClient();

    // Look up the integration
    const integration = await convex.query(api.channels.getIntegration, {
      integrationId,
    });

    if (!integration) {
      return NextResponse.json(
        { error: `Integration not found: ${integrationId}` },
        { status: 404 }
      );
    }

    // SECURITY: Verify the authenticated user owns this integration
    if (integration.userId !== authenticatedUserId) {
      return NextResponse.json(
        { error: "Unauthorized: You don't own this integration" },
        { status: 403 }
      );
    }

    // Check if integration is enabled
    if (!integration.settings.enabled) {
      return NextResponse.json(
        { error: "Integration is disabled" },
        { status: 400 }
      );
    }

    // Check connection status
    if (integration.connectionStatus !== "connected") {
      return NextResponse.json(
        { error: `Integration not connected: ${integration.connectionStatus}` },
        { status: 400 }
      );
    }

    // Send the message via the appropriate platform
    const result = await sendMessage(
      {
        integrationId,
        platform: integration.platform as Platform,
        recipientId: integration.platformUserId,
        content,
        messageType,
        mediaUrl,
        replyToMessageId,
      },
      integration.credentials
    );

    if (!result.success) {
      // Log failed attempt
      await convex.mutation(api.channels.logOutboundMessage, {
        integrationId,
        userId: integration.userId,
        platform: integration.platform,
        messageType,
        content,
        processingTimeMs: Date.now() - startTime,
      });

      return NextResponse.json(
        { error: result.error || "Failed to send message" },
        { status: 500 }
      );
    }

    // Log successful outbound message
    const { messageId } = await convex.mutation(api.channels.logOutboundMessage, {
      integrationId,
      userId: integration.userId,
      platform: integration.platform,
      platformMessageId: result.platformMessageId,
      messageType,
      content,
      processingTimeMs: Date.now() - startTime,
    });

    return NextResponse.json({
      success: true,
      messageId,
      platformMessageId: result.platformMessageId,
      platform: integration.platform,
      processingTimeMs: Date.now() - startTime,
    });
  } catch (error) {
    console.error("Channel send error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send message",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/channels/send
 * Health check / info endpoint
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/channels/send",
    method: "POST",
    requiredFields: ["integrationId", "content"],
    optionalFields: ["messageType", "mediaUrl", "replyToMessageId"],
    supportedPlatforms: ["whatsapp", "telegram", "slack", "discord", "imessage", "email"],
  });
}
