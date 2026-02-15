/**
 * Discord Webhook Handler
 *
 * Handles incoming interactions from Discord.
 * Processes messages with Claw AI and sends responses.
 *
 * Setup:
 * 1. Create Discord Application at discord.com/developers
 * 2. Create Bot and copy token
 * 3. Set Interactions Endpoint URL: https://yourdomain.com/api/webhooks/discord
 * 4. Add bot to server with permissions: Send Messages, Read Message History
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

function getDiscordPublicKey(): string {
  const key = process.env.DISCORD_PUBLIC_KEY;
  if (!key) {
    throw new Error("DISCORD_PUBLIC_KEY not configured");
  }
  return key;
}

function getDiscordBotToken(): string {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    throw new Error("DISCORD_BOT_TOKEN not configured");
  }
  return token;
}

// =============================================================================
// Signature Verification (Ed25519)
// =============================================================================

/**
 * Verify Discord request signature using Ed25519
 * Discord uses tweetnacl-style Ed25519 signatures
 */
async function verifyDiscordSignature(
  request: NextRequest,
  body: string
): Promise<boolean> {
  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");

  // In development, allow localhost requests
  if (process.env.NODE_ENV === "development") {
    const host = request.headers.get("host") || "";
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      return true;
    }
  }

  if (!signature || !timestamp) {
    console.warn("Missing Discord signature headers");
    return false;
  }

  try {
    const publicKey = getDiscordPublicKey();

    // Import the public key
    const keyData = hexToUint8Array(publicKey);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "Ed25519", namedCurve: "Ed25519" },
      false,
      ["verify"]
    );

    // Prepare the message (timestamp + body)
    const message = new TextEncoder().encode(timestamp + body);
    const sig = hexToUint8Array(signature);

    // Verify the signature
    const isValid = await crypto.subtle.verify("Ed25519", cryptoKey, sig, message);

    return isValid;
  } catch (error) {
    console.error("Discord signature verification error:", error);
    // Fallback: try without verification in dev
    if (process.env.NODE_ENV === "development") {
      console.warn("Skipping Discord signature verification in development");
      return true;
    }
    return false;
  }
}

function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// =============================================================================
// Types
// =============================================================================

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name?: string;
  bot?: boolean;
}

interface DiscordMessage {
  id: string;
  channel_id: string;
  author: DiscordUser;
  content: string;
  timestamp: string;
  guild_id?: string;
  referenced_message?: DiscordMessage;
  attachments?: Array<{
    id: string;
    filename: string;
    content_type?: string;
    url: string;
  }>;
}

// Discord Interaction Types
const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3,
  APPLICATION_COMMAND_AUTOCOMPLETE: 4,
  MODAL_SUBMIT: 5,
} as const;

// Discord Interaction Response Types
const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
  DEFERRED_UPDATE_MESSAGE: 6,
  UPDATE_MESSAGE: 7,
  APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: 8,
  MODAL: 9,
} as const;

interface DiscordInteraction {
  id: string;
  application_id: string;
  type: number;
  data?: {
    id?: string;
    name?: string;
    options?: Array<{
      name: string;
      type: number;
      value?: string | number | boolean;
    }>;
    custom_id?: string;
    component_type?: number;
    resolved?: {
      attachments?: Record<string, {
        id: string;
        filename: string;
        content_type?: string;
        url: string;
      }>;
    };
  };
  guild_id?: string;
  channel_id?: string;
  member?: {
    user: DiscordUser;
  };
  user?: DiscordUser;
  token: string;
  message?: DiscordMessage;
}

// =============================================================================
// Discord API Functions
// =============================================================================

/**
 * Transcribe audio using Whisper API
 */
async function transcribeAudio(audioUrl: string): Promise<string | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    // SECURITY: Validate URL to prevent SSRF attacks
    if (!isAllowedMediaDomain(audioUrl)) {
      console.error("Attempted to download audio from unauthorized domain:", audioUrl);
      return null;
    }

    // Download the audio file
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      console.error("Failed to download audio");
      return null;
    }

    const audioBlob = await audioResponse.blob();
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

/**
 * Send a message via Discord REST API
 */
async function sendDiscordMessage(
  channelId: string,
  content: string,
  replyToMessageId?: string
): Promise<boolean> {
  const token = getDiscordBotToken();

  try {
    const body: Record<string, unknown> = { content };

    if (replyToMessageId) {
      body.message_reference = { message_id: replyToMessageId };
    }

    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bot ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Discord send error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Discord send failed:", error);
    return false;
  }
}

/**
 * Respond to an interaction
 */
async function respondToInteraction(
  interactionId: string,
  interactionToken: string,
  content: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/interactions/${interactionId}/${interactionToken}/callback`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content },
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Discord interaction response failed:", error);
    return false;
  }
}

/**
 * Send a deferred response, then follow up
 */
async function deferAndFollowUp(
  interaction: DiscordInteraction,
  getContent: () => Promise<string>
): Promise<boolean> {
  const applicationId = process.env.DISCORD_APPLICATION_ID;

  try {
    // Send deferred response first
    await fetch(
      `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        }),
      }
    );

    // Get the actual content
    const content = await getContent();

    // Follow up with the actual response
    const response = await fetch(
      `https://discord.com/api/v10/webhooks/${applicationId}/${interaction.token}/messages/@original`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Discord deferred response failed:", error);
    return false;
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
    const allowed = ['cdn.discordapp.com', 'media.discordapp.net'];
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
        channel: "discord",
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
 * POST /api/webhooks/discord
 * Handle incoming Discord interactions
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    const bodyText = await request.text();

    // Verify signature
    if (!(await verifyDiscordSignature(request, bodyText))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const interaction: DiscordInteraction = JSON.parse(bodyText);

    // Handle PING (required for Discord interaction endpoint verification)
    if (interaction.type === InteractionType.PING) {
      return NextResponse.json({ type: InteractionResponseType.PONG });
    }

    // SECURITY: Rate limiting - 30 requests per minute per IP
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(`webhook:discord:${clientIp}`, {
      maxRequests: 30,
      windowMs: 60000,
    });
    if (!rateLimitResult.allowed) {
      console.warn(`[Discord] Rate limit exceeded for ${clientIp}`);
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
            'X-RateLimit-Limit': '30',
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(Math.floor(rateLimitResult.resetAt / 1000)),
          },
        }
      );
    }

    const convex = getConvexClient();

    // Get user from interaction
    const user = interaction.member?.user || interaction.user;
    if (!user || user.bot) {
      return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: "I can only respond to human users!" },
      });
    }

    const discordUserId = user.id;
    const username = user.global_name || user.username;

    // Look up integration by Discord user ID
    const integration = await convex.query(
      api.channels.getIntegrationByPlatformUser,
      {
        platform: "discord",
        platformUserId: discordUserId,
      }
    );

    if (!integration) {
      return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Hey ${username}! I'm Claw AI. To chat with me, please connect your Discord account at openclaw.io/settings/channels`,
        },
      });
    }

    // Check if integration is enabled
    if (!integration.settings.enabled) {
      return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Your Claw AI integration is currently disabled. Enable it in settings to continue chatting.",
        },
      });
    }

    // Handle slash commands
    if (
      interaction.type === InteractionType.APPLICATION_COMMAND &&
      interaction.data
    ) {
      const commandName = interaction.data.name;
      const options = interaction.data.options || [];

      // Handle /ask command
      if (commandName === "ask" || commandName === "james") {
        const messageOption = options.find((o) => o.name === "message");
        let content = String(messageOption?.value || "");
        let messageType: "text" | "voice" = "text";
        let transcription: string | undefined;

        // Check for audio attachments and transcribe
        const attachmentOption = options.find((o) => o.name === "audio" || o.name === "voice");
        if (attachmentOption && interaction.data?.resolved?.attachments) {
          const attachmentId = String(attachmentOption.value);
          const attachment = interaction.data.resolved.attachments[attachmentId];

          if (attachment?.content_type?.startsWith("audio/")) {
            messageType = "voice";
            transcription = (await transcribeAudio(attachment.url)) || undefined;

            if (transcription) {
              content = content ? `${content}\n\n[Voice: ${transcription}]` : transcription;
            }
          }
        }

        if (!content) {
          return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "Please provide a message or voice attachment!" },
          });
        }

        // Use deferred response for AI processing
        const sent = await deferAndFollowUp(interaction, async () => {
          // Log inbound message
          const { messageId } = await convex.mutation(
            api.channels.logInboundMessage,
            {
              integrationId: integration.integrationId,
              userId: integration.userId,
              platform: "discord",
              platformMessageId: interaction.id,
              messageType: "text",
              content,
              platformTimestamp: Date.now(),
            }
          );

          // Update status to processing
          await convex.mutation(api.channels.updateMessageStatus, {
            messageId,
            status: "processing",
          });

          // Build context
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

          // Update message
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
            platform: "discord",
            messageType: "text",
            content: aiResponse,
            processingTimeMs: processingTime,
          });

          return aiResponse;
        });

        // Response already sent via follow-up
        return NextResponse.json({ ok: true, sent });
      }
    }

    // Default response for unhandled interactions
    return NextResponse.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: "I'm not sure how to handle that interaction." },
    });
  } catch (error) {
    console.error("Discord webhook error:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/discord
 * Health check endpoint
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "ok",
    webhook: "discord",
    timestamp: new Date().toISOString(),
  });
}
