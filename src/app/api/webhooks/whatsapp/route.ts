/**
 * WhatsApp Webhook Handler
 *
 * Handles incoming messages from WhatsApp via Baileys.
 * Processes messages with Claw AI and sends responses.
 *
 * Flow:
 * 1. Receive message from WhatsApp (via Baileys bridge)
 * 2. Look up user integration by phone number
 * 3. Process message with Claw AI
 * 4. Send response back via Baileys
 *
 * Note: This is the webhook endpoint for a Baileys bridge service.
 * The actual Baileys client runs separately (locally or on a server).
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "@/lib/openclaw/client";
import { api } from '@/lib/convex-shim';
import crypto from "crypto";
import { checkRateLimit, getClientIp } from "@/lib/security";

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
 * Verify webhook signature
 * Uses timing-safe comparison to prevent timing attacks
 */
function verifyWebhookSignature(
  request: NextRequest,
  body: string
): boolean {
  const signature = request.headers.get("x-webhook-signature");
  const secret = process.env.WHATSAPP_WEBHOOK_SECRET;

  // In development on localhost, allow all requests
  // SECURITY: Strict localhost check - must START with localhost or be exactly 127.0.0.1
  if (process.env.NODE_ENV === "development") {
    const host = request.headers.get("host") || "";
    // Match "localhost", "localhost:3000", "127.0.0.1", "127.0.0.1:3000" etc.
    const isLocalhost = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
    if (isLocalhost) {
      return true;
    }
  }

  // Fail-closed in production: require webhook secret
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[WhatsApp] WHATSAPP_WEBHOOK_SECRET not configured in production");
      return false;
    }
    console.warn("[WhatsApp] WHATSAPP_WEBHOOK_SECRET not configured");
    return false;
  }

  if (!signature) {
    return false;
  }

  // Timing-safe signature comparison to prevent timing attacks
  try {
    const sigBuffer = Buffer.from(signature);
    const secretBuffer = Buffer.from(secret);

    // Lengths must match for timingSafeEqual
    if (sigBuffer.length !== secretBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuffer, secretBuffer);
  } catch {
    return false;
  }
}

// =============================================================================
// Types
// =============================================================================

interface WhatsAppMessage {
  // Message identity
  messageId: string;
  remoteJid: string; // Sender's phone number (e.g., "1234567890@s.whatsapp.net")
  fromMe: boolean;
  timestamp: number;

  // Message content
  type: "text" | "audio" | "image" | "video" | "document" | "sticker";
  text?: string;
  caption?: string;
  mediaUrl?: string;
  mimetype?: string;

  // Voice note specific
  audioTranscription?: string;
  audioDurationSeconds?: number;

  // Quoted message (reply)
  quotedMessageId?: string;
  quotedText?: string;
}

interface WebhookPayload {
  event: "message" | "status" | "presence" | "connection";
  integrationId?: string; // If known from session
  message?: WhatsAppMessage;
  status?: {
    messageId: string;
    status: "sent" | "delivered" | "read" | "error";
  };
  connection?: {
    status: "connecting" | "connected" | "disconnected" | "error";
    error?: string;
  };
}

// =============================================================================
// Security & Sanitization
// =============================================================================

/**
 * Sanitize user input to prevent prompt injection attacks
 * Removes common prompt injection patterns before passing to AI
 */
function sanitizeForPrompt(input: string, maxLength: number = 5000): string {
  // Remove potential prompt injection patterns
  let sanitized = input
    .replace(/ignore previous instructions/gi, '[filtered]')
    .replace(/system prompt/gi, '[filtered]')
    .replace(/\[INST\]/gi, '[filtered]')
    .replace(/<\|im_start\|>/gi, '[filtered]')
    .replace(/\[SYSTEM\]/gi, '[filtered]')
    .replace(/assistant:/gi, '[filtered]')
    .slice(0, maxLength);
  return sanitized;
}

// =============================================================================
// AI Processing
// =============================================================================

/**
 * Build system context based on access level
 */
function buildSystemContext(accessLevel: string, senderPhone?: string): string {
  const baseContext = `You are Claw AI, responding via WhatsApp. Keep responses concise and mobile-friendly. Use WhatsApp formatting: *bold*, _italic_, ~strikethrough~, \`\`\`code\`\`\`.`;

  if (accessLevel === 'owner') {
    return `${baseContext}

You are talking to James, your creator. You have FULL POWERS:
- Execute any command or tool
- Send messages to other contacts when asked
- Generate music, videos, images
- Build features, run research
- Manage contacts and settings

MEMORY: You have full access to the Recursive Memory Layer (RLM):
- Use 'remember' to search past conversations and events
- Use 'recall_preference' to retrieve James's preferences and knowledge
- Use 'memorize' to store important moments (importance 0-1)
- Use 'learn' to update semantic knowledge with confidence scores
- Use 'forget' to delete outdated memories when asked

Proactively use memory tools to:
- Reference past conversations and decisions
- Remember project context and ongoing work
- Store important requests and commitments
- Build continuity across chat sessions

Be helpful, direct, and proactive. James trusts you completely.`;
  }

  if (accessLevel === 'collaborator') {
    return `${baseContext}

You are talking to a trusted collaborator. You have ELEVATED ACCESS:
- Search portfolio and memories
- Check schedules and availability
- Respond with voice messages
- Access shared information

You CANNOT:
- Send messages to other contacts
- Modify system settings
- Execute destructive operations`;
  }

  // Visitor
  return `${baseContext}

You are talking to a visitor. You have LIMITED ACCESS:
- Basic conversation
- Portfolio information
- General questions about James

You CANNOT:
- Access memories or private data
- Execute commands or tools
- Book meetings or check schedules`;
}

/**
 * Process message with Claw AI
 */
async function processWithClawAI(
  userId: string,
  message: string,
  context: Array<{ role: "user" | "assistant"; content: string }>,
  accessLevel: "owner" | "collaborator" | "visitor" = "visitor",
  senderPhone?: string
): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Build system context with access level awareness
  const systemContext = buildSystemContext(accessLevel, senderPhone);

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemContext },
          ...context,
          { role: "user", content: sanitizeForPrompt(message) },
        ],
        userId,
        channel: "whatsapp",
        // Never trust client accessLevel - it's determined server-side from DB
        enableTools: accessLevel !== "visitor", // Only enable tools for collaborator+
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claw AI error:", errorText);
      return "I'm having trouble processing that right now. Please try again.";
    }

    const data = await response.json();
    return data.content || data.message || "I couldn't generate a response.";
  } catch (error) {
    console.error("AI processing error:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
}

/**
 * Build context from recent messages
 */
async function buildContext(
  convex: ConvexHttpClient,
  integrationId: string,
  contextLimit: number
): Promise<Array<{ role: "user" | "assistant"; content: string }>> {
  const messages = await convex.query(api.channels.getRecentMessages, {
    integrationId,
    limit: contextLimit,
  });

  // Reverse to get chronological order and map to context format
  return messages.reverse().map((msg) => ({
    role: msg.direction === "inbound" ? "user" as const : "assistant" as const,
    content: msg.content,
  }));
}

// =============================================================================
// Handlers
// =============================================================================

/**
 * POST /api/webhooks/whatsapp
 * Handle incoming WhatsApp messages
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  // Rate limiting - 20 requests per minute per IP for webhooks
  const clientIp = getClientIp(request);
  const rateLimitResult = checkRateLimit(`webhook:whatsapp:${clientIp}`, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
  });

  if (!rateLimitResult.allowed) {
    console.warn(`[WhatsApp] Rate limit exceeded for IP: ${clientIp}`);
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(Math.floor(rateLimitResult.resetAt / 1000)),
        }
      }
    );
  }

  try {
    const bodyText = await request.text();

    // Verify webhook signature
    if (!verifyWebhookSignature(request, bodyText)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload: WebhookPayload = JSON.parse(bodyText);
    const convex = getConvexClient();

    // Handle different event types
    switch (payload.event) {
      case "message": {
        if (!payload.message) {
          return NextResponse.json({ error: "No message in payload" }, { status: 400 });
        }

        const msg = payload.message;

        // Extract phone number from remoteJid
        const phoneNumber = msg.remoteJid.replace("@s.whatsapp.net", "");

        // Handle outbound messages (from Claw AI) - log them
        if (msg.fromMe) {
          // For outbound messages, the integration is the owner's, not the recipient's
          // Look up integration for the owner
          const OWNER_USER_ID = process.env.OWNER_USER_ID;
          const OWNER_PHONE = process.env.WHATSAPP_OWNER_NUMBER || '';

          // SECURITY: Validate OWNER_USER_ID is configured
          if (!OWNER_USER_ID) {
            console.error('[WhatsApp] OWNER_USER_ID environment variable is required for outbound messages');
            return NextResponse.json({
              success: false,
              error: "Server configuration error - OWNER_USER_ID not set"
            }, { status: 500 });
          }

          // Try to get owner's integration
          let integration = await convex.query(api.channels.getIntegrationByPlatformUser, {
            platform: "whatsapp",
            platformUserId: OWNER_PHONE,
          });

          // SECURITY: Never auto-create integrations, even for owner
          // Integrations must be explicitly created through the settings UI
          // This prevents unauthorized access via spoofed phone numbers
          if (!integration) {
            console.warn('[WhatsApp] No integration found for owner outbound message');
            return NextResponse.json({
              success: false,
              error: "Owner integration not configured - create in /settings/channels"
            }, { status: 500 });
          }

          // Log outbound message to Convex
          await convex.mutation(api.channels.logOutboundMessage, {
            integrationId: integration.integrationId,
            userId: integration.userId,
            platform: "whatsapp",
            messageType: "text",
            content: msg.text || "",
            processingTimeMs: 0,
          });
          console.log(`[WhatsApp] Logged outbound message to ${phoneNumber}`);

          return NextResponse.json({ success: true, logged: "outbound message" });
        }

        // Look up contact access level
        // First check if this is the owner's phone from env var (fallback for when not in DB)
        const OWNER_PHONE = process.env.WHATSAPP_OWNER_NUMBER || '';
        const normalizedOwnerPhone = OWNER_PHONE.replace(/\D/g, '');
        const normalizedSenderPhone = phoneNumber.replace(/\D/g, '');

        let accessLevel: "owner" | "collaborator" | "visitor" = "visitor";

        // Check env var first (owner phone number)
        if (normalizedOwnerPhone && normalizedSenderPhone === normalizedOwnerPhone) {
          accessLevel = "owner";
          console.log(`[WhatsApp] Owner detected via env var: ${phoneNumber}`);
        } else {
          // Fall back to database lookup
          accessLevel = await convex.query(api.whatsappContacts.getAccessLevel, {
            phoneNumber: phoneNumber,
          });
        }

        // Log the access for security audit
        console.log(`[WhatsApp] Message from ${phoneNumber}, access level: ${accessLevel}`);

        // Look up integration by phone number
        let integration = await convex.query(api.channels.getIntegrationByPlatformUser, {
          platform: "whatsapp",
          platformUserId: phoneNumber,
        });

        // SECURITY: Never auto-create integrations, even for owner
        // Integrations must be explicitly created through the settings UI
        // This prevents unauthorized access via spoofed phone numbers

        if (!integration) {
          console.log(`No integration found for phone: ${phoneNumber}`);
          return NextResponse.json({
            success: true,
            skipped: "no integration",
            message: "To use Claw AI on WhatsApp, connect your account at 8gent.app/settings/channels",
          });
        }

        // Check if integration is enabled
        if (!integration.settings.enabled) {
          return NextResponse.json({ success: true, skipped: "integration disabled" });
        }

        // Check quiet hours
        if (integration.settings.quietHoursStart !== undefined && integration.settings.quietHoursEnd !== undefined) {
          const now = new Date();
          const currentHour = now.getHours();
          const { quietHoursStart, quietHoursEnd } = integration.settings;

          if (quietHoursStart < quietHoursEnd) {
            // Simple case: e.g., 22:00 to 07:00 next day
            if (currentHour >= quietHoursStart || currentHour < quietHoursEnd) {
              return NextResponse.json({ success: true, skipped: "quiet hours" });
            }
          } else {
            // Wrapped case: e.g., 22:00 to 07:00
            if (currentHour >= quietHoursStart && currentHour < quietHoursEnd) {
              return NextResponse.json({ success: true, skipped: "quiet hours" });
            }
          }
        }

        // Get message content
        let content = msg.text || msg.caption || "";
        const messageType = msg.type === "audio" ? "voice" : "text";

        // For voice messages, use transcription if available
        if (msg.type === "audio" && msg.audioTranscription) {
          content = msg.audioTranscription;
        }

        if (!content && msg.type !== "audio") {
          // Skip non-text messages we can't process
          return NextResponse.json({ success: true, skipped: "unsupported message type" });
        }

        // Check for command prefix if configured
        if (integration.settings.commandPrefix) {
          if (!content.startsWith(integration.settings.commandPrefix)) {
            if (!integration.settings.autoReply) {
              return NextResponse.json({ success: true, skipped: "no command prefix" });
            }
          } else {
            // Remove command prefix
            content = content.slice(integration.settings.commandPrefix.length).trim();
          }
        }

        // Log inbound message
        const { messageId } = await convex.mutation(api.channels.logInboundMessage, {
          integrationId: integration.integrationId,
          userId: integration.userId,
          platform: "whatsapp",
          platformMessageId: msg.messageId,
          messageType,
          content,
          transcription: msg.audioTranscription,
          platformTimestamp: msg.timestamp * 1000,
        });

        // Update status to processing
        await convex.mutation(api.channels.updateMessageStatus, {
          messageId,
          status: "processing",
        });

        // Build context from recent messages
        const context = await buildContext(
          convex,
          integration.integrationId,
          integration.settings.contextLimit
        );

        // Process with Claw AI
        const aiResponse = await processWithClawAI(
          integration.userId,
          content,
          context,
          accessLevel,  // Pass access level
          phoneNumber   // Pass phone number for contact identification
        );

        // Update message with AI response
        const processingTime = Date.now() - startTime;
        await convex.mutation(api.channels.updateMessageStatus, {
          messageId,
          status: "responded",
          aiResponse,
          processingTimeMs: processingTime,
        });

        // Log outbound message
        await convex.mutation(api.channels.logOutboundMessage, {
          integrationId: integration.integrationId,
          userId: integration.userId,
          platform: "whatsapp",
          messageType: "text",
          content: aiResponse,
          processingTimeMs: processingTime,
        });

        // Update contact stats (fire and forget)
        convex.mutation(api.whatsappContacts.updateContactStats, {
          phoneNumber: phoneNumber,
        }).catch(err => console.log('[WhatsApp] Failed to update contact stats:', err));

        // Return response for Baileys to send
        return NextResponse.json({
          success: true,
          response: {
            remoteJid: msg.remoteJid,
            text: aiResponse,
            // If voice enabled, include TTS instruction
            generateVoice: integration.settings.voiceEnabled,
            voiceId: integration.settings.voiceId,
          },
        });
      }

      case "connection": {
        if (!payload.integrationId || !payload.connection) {
          return NextResponse.json({ error: "Missing connection data" }, { status: 400 });
        }

        await convex.mutation(api.channels.updateConnectionStatus, {
          integrationId: payload.integrationId,
          status: payload.connection.status === "connected" ? "connected" :
                  payload.connection.status === "error" ? "error" : "disconnected",
          error: payload.connection.error,
        });

        return NextResponse.json({ success: true });
      }

      case "status": {
        // Message delivery status updates - just acknowledge
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ success: true, skipped: "unhandled event" });
    }
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/whatsapp
 * Webhook verification endpoint
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get("challenge");
  const verify = searchParams.get("verify_token");

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (verify === expectedToken && challenge) {
    return new NextResponse(challenge);
  }

  return NextResponse.json(
    { error: "Verification failed" },
    { status: 403 }
  );
}
