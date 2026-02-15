/**
 * Outbound Message Router
 *
 * Unified system for sending messages across all connected platforms.
 * Routes messages to the correct platform-specific API based on integration.
 */

// =============================================================================
// Types
// =============================================================================

export type Platform = "whatsapp" | "telegram" | "slack" | "discord" | "imessage" | "email";

export interface OutboundMessage {
  integrationId: string;
  platform: Platform;
  recipientId: string; // Platform-specific recipient identifier
  content: string;
  messageType?: "text" | "voice" | "image" | "email";
  mediaUrl?: string;
  replyToMessageId?: string;
  metadata?: Record<string, unknown>;
  // Email-specific fields
  emailSubject?: string;
  emailReplyTo?: string;
  emailThreadId?: string;
}

export interface SendResult {
  success: boolean;
  platformMessageId?: string;
  error?: string;
  timestamp: number;
}

export interface PlatformCredentials {
  // WhatsApp (Baileys)
  sessionData?: string;
  baileysWebhookUrl?: string;

  // Telegram / Discord / Slack bot token (shared field)
  botToken?: string;
  chatId?: string; // Telegram-specific

  // Slack OAuth
  accessToken?: string;

  // iMessage (BlueBubbles)
  serverUrl?: string;
  serverPassword?: string;

  // Email (Resend)
  fromEmail?: string;
  replyTo?: string;
}

// =============================================================================
// Platform Senders
// =============================================================================

/**
 * Send message via WhatsApp (Baileys bridge)
 */
async function sendWhatsApp(
  message: OutboundMessage,
  credentials: PlatformCredentials
): Promise<SendResult> {
  const webhookUrl = credentials.baileysWebhookUrl || process.env.BAILEYS_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      success: false,
      error: "Baileys webhook URL not configured",
      timestamp: Date.now(),
    };
  }

  try {
    // Format phone number for WhatsApp
    const remoteJid = message.recipientId.includes("@")
      ? message.recipientId
      : `${message.recipientId}@s.whatsapp.net`;

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "sendMessage",
        remoteJid,
        text: message.content,
        // Include media if present
        ...(message.mediaUrl && { mediaUrl: message.mediaUrl }),
        ...(message.replyToMessageId && { quotedMessageId: message.replyToMessageId }),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error, timestamp: Date.now() };
    }

    const data = await response.json();
    return {
      success: true,
      platformMessageId: data.messageId,
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "WhatsApp send failed",
      timestamp: Date.now(),
    };
  }
}

/**
 * Send message via Telegram Bot API
 */
async function sendTelegram(
  message: OutboundMessage,
  credentials: PlatformCredentials
): Promise<SendResult> {
  const botToken = credentials.botToken || process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    return {
      success: false,
      error: "Telegram bot token not configured",
      timestamp: Date.now(),
    };
  }

  try {
    const chatId = message.recipientId;

    // Send text message
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message.content,
          parse_mode: "Markdown",
          ...(message.replyToMessageId && {
            reply_to_message_id: parseInt(message.replyToMessageId),
          }),
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error, timestamp: Date.now() };
    }

    const data = await response.json();
    return {
      success: true,
      platformMessageId: String(data.result?.message_id),
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Telegram send failed",
      timestamp: Date.now(),
    };
  }
}

/**
 * Send message via Slack Web API
 */
async function sendSlack(
  message: OutboundMessage,
  credentials: PlatformCredentials
): Promise<SendResult> {
  const botToken = credentials.botToken || credentials.accessToken || process.env.SLACK_BOT_TOKEN;

  if (!botToken) {
    return {
      success: false,
      error: "Slack bot token not configured",
      timestamp: Date.now(),
    };
  }

  try {
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${botToken}`,
      },
      body: JSON.stringify({
        channel: message.recipientId,
        text: message.content,
        mrkdwn: true,
        ...(message.replyToMessageId && { thread_ts: message.replyToMessageId }),
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      return { success: false, error: data.error, timestamp: Date.now() };
    }

    return {
      success: true,
      platformMessageId: data.ts,
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Slack send failed",
      timestamp: Date.now(),
    };
  }
}

/**
 * Send message via Discord REST API
 */
async function sendDiscord(
  message: OutboundMessage,
  credentials: PlatformCredentials
): Promise<SendResult> {
  const botToken = credentials.botToken || process.env.DISCORD_BOT_TOKEN;

  if (!botToken) {
    return {
      success: false,
      error: "Discord bot token not configured",
      timestamp: Date.now(),
    };
  }

  try {
    const body: Record<string, unknown> = { content: message.content };

    if (message.replyToMessageId) {
      body.message_reference = { message_id: message.replyToMessageId };
    }

    const response = await fetch(
      `https://discord.com/api/v10/channels/${message.recipientId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bot ${botToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error, timestamp: Date.now() };
    }

    const data = await response.json();
    return {
      success: true,
      platformMessageId: data.id,
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Discord send failed",
      timestamp: Date.now(),
    };
  }
}

/**
 * Send message via iMessage (BlueBubbles)
 */
async function sendIMessage(
  message: OutboundMessage,
  credentials: PlatformCredentials
): Promise<SendResult> {
  const serverUrl = credentials.serverUrl || process.env.BLUEBUBBLES_SERVER_URL;
  const password = credentials.serverPassword || process.env.BLUEBUBBLES_PASSWORD;

  if (!serverUrl || !password) {
    return {
      success: false,
      error: "BlueBubbles server not configured",
      timestamp: Date.now(),
    };
  }

  try {
    const response = await fetch(`${serverUrl}/api/v1/message/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify({
        chatGuid: message.recipientId,
        message: message.content,
        method: "private-api", // Use private API for better reliability
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error, timestamp: Date.now() };
    }

    const data = await response.json();
    return {
      success: true,
      platformMessageId: data.data?.guid,
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "iMessage send failed",
      timestamp: Date.now(),
    };
  }
}

/**
 * Send message via Email (Resend)
 */
async function sendEmail(
  message: OutboundMessage,
  credentials: PlatformCredentials
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "Resend API key not configured",
      timestamp: Date.now(),
    };
  }

  const fromEmail = credentials.fromEmail || process.env.CLAW_AI_EMAIL || "ai@openclaw.io";

  try {
    // Dynamic import to avoid issues in non-Node environments
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const subject = message.emailSubject || "Message from Claw AI";
    const htmlContent = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
      ${message.content.split("\n").map((p) => `<p style="margin: 0 0 1em 0;">${p}</p>`).join("")}
      <hr style="border: none; border-top: 1px solid #eee; margin: 2em 0;" />
      <p style="color: #666; font-size: 0.9em;">
        This message was sent by Claw AI, OpenClaw-OS's digital assistant.<br/>
        <a href="https://openclaw.io" style="color: #007AFF;">openclaw.io</a>
      </p>
    </div>`;

    const { data, error } = await resend.emails.send({
      from: `Claw AI <${fromEmail}>`,
      to: [message.recipientId],
      subject,
      text: message.content,
      html: htmlContent,
      replyTo: credentials.replyTo,
      headers: message.emailThreadId
        ? { "In-Reply-To": message.emailThreadId }
        : undefined,
    });

    if (error) {
      return { success: false, error: error.message, timestamp: Date.now() };
    }

    return {
      success: true,
      platformMessageId: data?.id,
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Email send failed",
      timestamp: Date.now(),
    };
  }
}

// =============================================================================
// Main Router
// =============================================================================

/**
 * Route and send a message to the appropriate platform
 */
export async function sendMessage(
  message: OutboundMessage,
  credentials?: PlatformCredentials
): Promise<SendResult> {
  const creds = credentials || {};

  switch (message.platform) {
    case "whatsapp":
      return sendWhatsApp(message, creds);
    case "telegram":
      return sendTelegram(message, creds);
    case "slack":
      return sendSlack(message, creds);
    case "discord":
      return sendDiscord(message, creds);
    case "imessage":
      return sendIMessage(message, creds);
    case "email":
      return sendEmail(message, creds);
    default:
      return {
        success: false,
        error: `Unsupported platform: ${message.platform}`,
        timestamp: Date.now(),
      };
  }
}

/**
 * Send message with Convex integration lookup
 * This version fetches credentials from the integration record
 */
export async function sendMessageWithIntegration(
  convexClient: { query: (api: unknown, args: unknown) => Promise<unknown> },
  getIntegrationQuery: unknown,
  message: Omit<OutboundMessage, "platform">
): Promise<SendResult> {
  try {
    // Look up the integration
    const integration = (await convexClient.query(getIntegrationQuery, {
      integrationId: message.integrationId,
    })) as {
      platform: Platform;
      credentials: PlatformCredentials;
      settings: { enabled: boolean };
    } | null;

    if (!integration) {
      return {
        success: false,
        error: `Integration not found: ${message.integrationId}`,
        timestamp: Date.now(),
      };
    }

    if (!integration.settings.enabled) {
      return {
        success: false,
        error: "Integration is disabled",
        timestamp: Date.now(),
      };
    }

    // Send via the appropriate platform
    return sendMessage(
      { ...message, platform: integration.platform },
      integration.credentials
    );
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send message",
      timestamp: Date.now(),
    };
  }
}

// =============================================================================
// Batch Operations
// =============================================================================

/**
 * Send the same message to multiple platforms
 */
export async function broadcastMessage(
  messages: OutboundMessage[]
): Promise<Map<string, SendResult>> {
  const results = new Map<string, SendResult>();

  // Send all messages in parallel
  const promises = messages.map(async (msg) => {
    const result = await sendMessage(msg);
    results.set(msg.integrationId, result);
  });

  await Promise.allSettled(promises);
  return results;
}
