/**
 * Slack Webhook Handler
 *
 * Handles incoming messages from Slack Events API.
 * Processes messages with Claw AI and sends responses.
 *
 * Setup:
 * 1. Create Slack App at api.slack.com/apps
 * 2. Enable Event Subscriptions with URL: https://yourdomain.com/api/webhooks/slack
 * 3. Subscribe to: message.im, app_mention
 * 4. Add Bot Token Scopes: chat:write, im:history, im:read, users:read
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

function getSlackSigningSecret(): string {
  const secret = process.env.SLACK_SIGNING_SECRET;
  if (!secret) {
    throw new Error("SLACK_SIGNING_SECRET not configured");
  }
  return secret;
}

function getSlackBotToken(): string {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    throw new Error("SLACK_BOT_TOKEN not configured");
  }
  return token;
}

// =============================================================================
// Signature Verification
// =============================================================================

/**
 * Verify Slack request signature (HMAC-SHA256)
 */
function verifySlackSignature(
  request: NextRequest,
  body: string
): boolean {
  const signature = request.headers.get("x-slack-signature");
  const timestamp = request.headers.get("x-slack-request-timestamp");

  // In development, allow localhost requests
  if (process.env.NODE_ENV === "development") {
    const host = request.headers.get("host") || "";
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      return true;
    }
  }

  if (!signature || !timestamp) {
    console.warn("Missing Slack signature headers");
    return false;
  }

  // Check timestamp to prevent replay attacks (allow 5 minutes)
  const requestTime = parseInt(timestamp, 10);
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - requestTime) > 300) {
    console.warn("Slack request timestamp too old");
    return false;
  }

  const signingSecret = getSlackSigningSecret();
  const sigBasestring = `v0:${timestamp}:${body}`;
  const mySignature =
    "v0=" +
    crypto
      .createHmac("sha256", signingSecret)
      .update(sigBasestring)
      .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(mySignature),
    Buffer.from(signature)
  );
}

// =============================================================================
// Types
// =============================================================================

interface SlackUser {
  id: string;
  username?: string;
  name?: string;
  real_name?: string;
}

interface SlackMessage {
  type: string;
  subtype?: string;
  user?: string;
  text?: string;
  ts: string;
  channel: string;
  thread_ts?: string;
  bot_id?: string;
  files?: Array<{
    id: string;
    name: string;
    mimetype: string;
    url_private?: string;
  }>;
}

interface SlackEvent {
  type: string;
  event?: SlackMessage;
  event_id?: string;
  event_time?: number;
  challenge?: string;
  team_id?: string;
  api_app_id?: string;
}

// =============================================================================
// Slack API Functions
// =============================================================================

/**
 * Send a message via Slack Web API
 */
async function sendSlackMessage(
  channel: string,
  text: string,
  threadTs?: string
): Promise<boolean> {
  const token = getSlackBotToken();

  try {
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        channel,
        text,
        thread_ts: threadTs,
        mrkdwn: true,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("Slack send error:", data.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Slack send failed:", error);
    return false;
  }
}

/**
 * Download a file from Slack using bot token
 */
async function downloadSlackFile(urlPrivate: string): Promise<Blob | null> {
  const token = getSlackBotToken();

  try {
    // SECURITY: Validate URL to prevent SSRF attacks
    if (!isAllowedMediaDomain(urlPrivate)) {
      console.error("Attempted to download file from unauthorized domain:", urlPrivate);
      return null;
    }

    const response = await fetch(urlPrivate, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return null;
    return await response.blob();
  } catch {
    return null;
  }
}

/**
 * Transcribe audio using Whisper API
 */
async function transcribeAudio(audioBlob: Blob, filename: string): Promise<string | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const formData = new FormData();
    formData.append("audio", audioBlob, filename);

    const response = await fetch(`${baseUrl}/api/whisper`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("Whisper API error:", await response.text());
      return null;
    }

    const result = await response.json();
    return result.text || null;
  } catch (error) {
    console.error("Transcription error:", error);
    return null;
  }
}

/**
 * Get user info from Slack
 */
async function getSlackUserInfo(userId: string): Promise<SlackUser | null> {
  const token = getSlackBotToken();

  try {
    const response = await fetch(
      `https://slack.com/api/users.info?user=${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    if (data.ok && data.user) {
      return {
        id: data.user.id,
        username: data.user.name,
        name: data.user.profile?.display_name,
        real_name: data.user.real_name,
      };
    }

    return null;
  } catch {
    return null;
  }
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

/**
 * Validate media URL to prevent SSRF attacks
 */
function isAllowedMediaDomain(url: string): boolean {
  try {
    const parsed = new URL(url);
    const allowed = ['files.slack.com'];
    return allowed.some(domain =>
      parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

// =============================================================================
// AI Processing
// =============================================================================

/**
 * Process message with Claw AI
 */
async function processWithClawAI(
  userId: string,
  message: string,
  context: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...context, { role: "user", content: sanitizeForPrompt(message) }],
        userId,
        channel: "slack",
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

  return messages.reverse().map((msg) => ({
    role: msg.direction === "inbound" ? ("user" as const) : ("assistant" as const),
    content: msg.content,
  }));
}

// =============================================================================
// Handlers
// =============================================================================

/**
 * POST /api/webhooks/slack
 * Handle incoming Slack events
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  // Rate limiting - 20 requests per minute per IP for webhooks
  const clientIp = getClientIp(request);
  const rateLimitResult = checkRateLimit(`webhook:slack:${clientIp}`, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
  });

  if (!rateLimitResult.allowed) {
    console.warn(`[Slack] Rate limit exceeded for IP: ${clientIp}`);
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

    // Verify signature
    if (!verifySlackSignature(request, bodyText)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload: SlackEvent = JSON.parse(bodyText);

    // Handle URL verification challenge
    if (payload.type === "url_verification" && payload.challenge) {
      return NextResponse.json({ challenge: payload.challenge });
    }

    // Handle event callbacks
    if (payload.type === "event_callback" && payload.event) {
      const event = payload.event;
      const convex = getConvexClient();

      // Skip bot messages and message_changed events
      if (event.bot_id || event.subtype === "message_changed") {
        return NextResponse.json({ ok: true, skipped: "bot or edited message" });
      }

      // Only process direct messages and mentions
      if (event.type !== "message" && event.type !== "app_mention") {
        return NextResponse.json({ ok: true, skipped: "unsupported event type" });
      }

      const slackUserId = event.user;
      if (!slackUserId) {
        return NextResponse.json({ ok: true, skipped: "no user" });
      }

      // Look up integration by Slack user ID
      const integration = await convex.query(
        api.channels.getIntegrationByPlatformUser,
        {
          platform: "slack",
          platformUserId: slackUserId,
        }
      );

      if (!integration) {
        // Get user info for a friendlier message
        const userInfo = await getSlackUserInfo(slackUserId);
        const greeting = userInfo?.name || userInfo?.username || "there";

        await sendSlackMessage(
          event.channel,
          `Hey ${greeting}! I'm Claw AI. To chat with me, please connect your Slack account at openclaw.io/settings/channels`,
          event.thread_ts || event.ts
        );

        return NextResponse.json({ ok: true, skipped: "no integration" });
      }

      // Check if integration is enabled
      if (!integration.settings.enabled) {
        return NextResponse.json({ ok: true, skipped: "integration disabled" });
      }

      // Check quiet hours
      if (
        integration.settings.quietHoursStart !== undefined &&
        integration.settings.quietHoursEnd !== undefined
      ) {
        const now = new Date();
        const currentHour = now.getHours();
        const { quietHoursStart, quietHoursEnd } = integration.settings;

        if (quietHoursStart < quietHoursEnd) {
          if (currentHour >= quietHoursStart || currentHour < quietHoursEnd) {
            return NextResponse.json({ ok: true, skipped: "quiet hours" });
          }
        } else {
          if (currentHour >= quietHoursStart && currentHour < quietHoursEnd) {
            return NextResponse.json({ ok: true, skipped: "quiet hours" });
          }
        }
      }

      // Get message content
      let content = event.text || "";
      let messageType: "text" | "voice" | "image" | "document" = "text";
      let transcription: string | undefined;

      // Remove bot mention from app_mention events
      if (event.type === "app_mention") {
        content = content.replace(/<@[A-Z0-9]+>/g, "").trim();
      }

      // Handle audio/voice files
      if (event.files && event.files.length > 0) {
        const audioFile = event.files.find(
          (f) =>
            f.mimetype?.startsWith("audio/") ||
            f.name?.endsWith(".mp3") ||
            f.name?.endsWith(".m4a") ||
            f.name?.endsWith(".wav") ||
            f.name?.endsWith(".ogg") ||
            f.name?.endsWith(".webm")
        );

        if (audioFile && audioFile.url_private) {
          messageType = "voice";
          const audioBlob = await downloadSlackFile(audioFile.url_private);

          if (audioBlob) {
            transcription = (await transcribeAudio(audioBlob, audioFile.name)) || undefined;
            if (transcription) {
              content = transcription;
            } else {
              content = content || "[Voice message - transcription failed]";
            }
          }
        }
      }

      if (!content) {
        return NextResponse.json({ ok: true, skipped: "no content" });
      }

      // Check for command prefix if configured
      if (integration.settings.commandPrefix) {
        if (!content.startsWith(integration.settings.commandPrefix)) {
          if (!integration.settings.autoReply) {
            return NextResponse.json({ ok: true, skipped: "no command prefix" });
          }
        } else {
          content = content.slice(integration.settings.commandPrefix.length).trim();
        }
      }

      // Log inbound message
      const { messageId } = await convex.mutation(api.channels.logInboundMessage, {
        integrationId: integration.integrationId,
        userId: integration.userId,
        platform: "slack",
        platformMessageId: event.ts,
        messageType,
        content,
        transcription,
        platformTimestamp: parseFloat(event.ts) * 1000,
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
        context
      );

      // Update message with AI response
      const processingTime = Date.now() - startTime;
      await convex.mutation(api.channels.updateMessageStatus, {
        messageId,
        status: "responded",
        aiResponse,
        processingTimeMs: processingTime,
      });

      // Send response via Slack (in thread if applicable)
      const sent = await sendSlackMessage(
        event.channel,
        aiResponse,
        event.thread_ts || event.ts
      );

      // Log outbound message
      await convex.mutation(api.channels.logOutboundMessage, {
        integrationId: integration.integrationId,
        userId: integration.userId,
        platform: "slack",
        messageType: "text",
        content: aiResponse,
        processingTimeMs: processingTime,
      });

      return NextResponse.json({
        ok: true,
        sent,
        processingTimeMs: processingTime,
      });
    }

    return NextResponse.json({ ok: true, skipped: "unhandled event type" });
  } catch (error) {
    console.error("Slack webhook error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/slack
 * Health check endpoint
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "ok",
    webhook: "slack",
    timestamp: new Date().toISOString(),
  });
}
