/**
 * Telegram Webhook Handler
 *
 * Handles incoming messages from Telegram Bot API.
 * Processes messages with 8gent and sends responses.
 *
 * Setup:
 * 1. Create bot with @BotFather
 * 2. Set webhook: curl -X POST "https://api.telegram.org/bot${TOKEN}/setWebhook" \
 *    -d '{"url": "https://yourdomain.com/api/webhooks/telegram"}'
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "@/lib/openclaw/client";
import { api } from '@/lib/convex-shim';
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

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN not configured");
  }
  return token;
}

// =============================================================================
// Types
// =============================================================================

interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramChat {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface TelegramVoice {
  duration: number;
  mime_type?: string;
  file_id: string;
  file_unique_id: string;
  file_size?: number;
}

interface TelegramPhoto {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

interface TelegramDocument {
  file_id: string;
  file_unique_id: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  voice?: TelegramVoice;
  photo?: TelegramPhoto[];
  document?: TelegramDocument;
  caption?: string;
  reply_to_message?: TelegramMessage;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  channel_post?: TelegramMessage;
  edited_channel_post?: TelegramMessage;
}

// =============================================================================
// Telegram API Functions
// =============================================================================

/**
 * Send a message via Telegram Bot API
 */
async function sendTelegramMessage(
  chatId: number,
  text: string,
  replyToMessageId?: number
): Promise<boolean> {
  const token = getBotToken();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          reply_to_message_id: replyToMessageId,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Telegram send error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Telegram send failed:", error);
    return false;
  }
}

/**
 * Download a file from Telegram (for voice messages, etc.)
 */
async function getTelegramFileUrl(fileId: string): Promise<string | null> {
  const token = getBotToken();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.ok && data.result?.file_path) {
      return `https://api.telegram.org/file/bot${token}/${data.result.file_path}`;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Transcribe audio using the Whisper API
 */
async function transcribeAudio(audioUrl: string): Promise<string | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    // SECURITY: Validate URL to prevent SSRF attacks
    if (!isAllowedMediaDomain(audioUrl)) {
      console.error("Attempted to download audio from unauthorized domain:", audioUrl);
      return null;
    }

    // Download the audio file from Telegram
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      console.error("Failed to download audio from Telegram");
      return null;
    }

    const audioBlob = await audioResponse.blob();

    // Send to our Whisper API
    const formData = new FormData();
    formData.append("audio", audioBlob, "voice.ogg");

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
    const allowed = ['api.telegram.org'];
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
 * Process message with 8gent
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
        channel: "telegram",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("8gent error:", errorText);
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
 * POST /api/webhooks/telegram
 * Handle incoming Telegram updates
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  // Rate limiting - 20 requests per minute per IP for webhooks
  const clientIp = getClientIp(request);
  const rateLimitResult = checkRateLimit(`webhook:telegram:${clientIp}`, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
  });

  if (!rateLimitResult.allowed) {
    console.warn(`[Telegram] Rate limit exceeded for IP: ${clientIp}`);
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
    const update: TelegramUpdate = await request.json();
    const convex = getConvexClient();

    // Get the message (could be regular message, edited, or channel post)
    const msg = update.message || update.edited_message;

    if (!msg || !msg.from) {
      return NextResponse.json({ ok: true, skipped: "no message or sender" });
    }

    // Skip bot messages
    if (msg.from.is_bot) {
      return NextResponse.json({ ok: true, skipped: "bot message" });
    }

    // Extract user info
    const telegramUserId = String(msg.from.id);
    const username =
      msg.from.username ||
      `${msg.from.first_name}${msg.from.last_name ? " " + msg.from.last_name : ""}`;

    // Look up integration by Telegram user ID
    const integration = await convex.query(
      api.channels.getIntegrationByPlatformUser,
      {
        platform: "telegram",
        platformUserId: telegramUserId,
      }
    );

    if (!integration) {
      console.log(`No integration found for Telegram user: ${telegramUserId}`);
      // Optionally send a message to unregistered users
      await sendTelegramMessage(
        msg.chat.id,
        "Hi! I'm 8gent. To chat with me, please connect your Telegram account at openclaw.io/settings/channels"
      );
      return NextResponse.json({
        ok: true,
        skipped: "no integration",
      });
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

    // Determine message type and content
    let content = msg.text || msg.caption || "";
    let messageType: "text" | "voice" | "image" | "document" = "text";
    let mediaUrl: string | undefined;
    let transcription: string | undefined;

    // Handle voice messages
    if (msg.voice) {
      messageType = "voice";
      mediaUrl = (await getTelegramFileUrl(msg.voice.file_id)) || undefined;

      // Transcribe the voice message using Whisper
      if (mediaUrl) {
        transcription = (await transcribeAudio(mediaUrl)) || undefined;
        if (transcription) {
          content = transcription;
        } else {
          content = "[Voice message - transcription failed]";
        }
      } else {
        content = "[Voice message - could not retrieve audio]";
      }
    }

    // Handle photos
    if (msg.photo && msg.photo.length > 0) {
      messageType = "image";
      // Get the largest photo
      const largestPhoto = msg.photo[msg.photo.length - 1];
      mediaUrl = (await getTelegramFileUrl(largestPhoto.file_id)) || undefined;
      if (!content) {
        content = "[Image received]";
      }
    }

    // Handle documents
    if (msg.document) {
      messageType = "document";
      mediaUrl = (await getTelegramFileUrl(msg.document.file_id)) || undefined;
      if (!content) {
        content = `[Document: ${msg.document.file_name || "unnamed"}]`;
      }
    }

    // Skip if no processable content
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
      platform: "telegram",
      platformMessageId: String(msg.message_id),
      messageType,
      content,
      mediaUrl,
      transcription,
      platformTimestamp: msg.date * 1000,
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

    // Process with 8gent
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

    // Send response via Telegram
    const sent = await sendTelegramMessage(
      msg.chat.id,
      aiResponse,
      msg.message_id
    );

    // Log outbound message
    await convex.mutation(api.channels.logOutboundMessage, {
      integrationId: integration.integrationId,
      userId: integration.userId,
      platform: "telegram",
      messageType: "text",
      content: aiResponse,
      processingTimeMs: processingTime,
    });

    return NextResponse.json({
      ok: true,
      sent,
      processingTimeMs: processingTime,
    });
  } catch (error) {
    console.error("Telegram webhook error:", error);
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
 * GET /api/webhooks/telegram
 * Health check endpoint
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "ok",
    webhook: "telegram",
    timestamp: new Date().toISOString(),
  });
}
