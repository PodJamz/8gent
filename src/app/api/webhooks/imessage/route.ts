/**
 * iMessage/BlueBubbles Webhook Handler
 *
 * BlueBubbles is an open-source iMessage server that enables
 * sending/receiving iMessages from any platform via REST API.
 *
 * Webhook events:
 * - new-message: New message received
 * - message-send-error: Failed to send message
 * - updated-message: Message was edited/updated
 * - chat-read-status-changed: Read receipts
 * - typing-indicator: Typing status
 */

import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from '@/lib/convex-shim';
import { api } from '@/lib/convex-shim';
import crypto from 'crypto';

// Initialize Convex client lazily to avoid build-time errors
function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL not configured");
  }
  return new ConvexHttpClient(url);
}

// BlueBubbles event types
interface BlueBubblesEvent {
  type: string;
  data: BlueBubblesMessage | BlueBubblesChat | Record<string, unknown>;
}

interface BlueBubblesMessage {
  guid: string;
  text: string;
  subject?: string;
  handle?: {
    address: string;
    service: string;
  };
  chats?: BlueBubblesChat[];
  dateCreated: number;
  dateRead?: number;
  dateDelivered?: number;
  isFromMe: boolean;
  isRead: boolean;
  hasAttachments: boolean;
  attachments?: BlueBubblesAttachment[];
}

interface BlueBubblesChat {
  guid: string;
  chatIdentifier: string;
  displayName?: string;
  participants?: { address: string }[];
  isGroup: boolean;
}

interface BlueBubblesAttachment {
  guid: string;
  mimeType: string;
  transferName: string;
  totalBytes: number;
}

/**
 * Sanitize text for inclusion in AI prompts to prevent prompt injection
 */
function sanitizeForPrompt(text: string, maxLength = 500): string {
  return text
    .replace(/[\x00-\x1F\x7F]/g, ' ')  // Remove control characters
    .replace(/\s+/g, ' ')               // Normalize whitespace
    .trim()
    .slice(0, maxLength);
}

/**
 * Verify webhook signature (BlueBubbles uses HMAC-SHA256)
 * Fail-closed: Requires signature verification in production
 */
function verifyWebhookSignature(
  request: NextRequest,
  body: string,
  secret: string | undefined
): boolean {
  // Fail-closed in production: require webhook secret
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[iMessage] BLUEBUBBLES_WEBHOOK_SECRET not configured in production');
      return false;
    }
    console.warn('[iMessage] Webhook signature verification skipped (dev mode, no secret)');
    return true;
  }

  const signature = request.headers.get('x-bluebubbles-signature');
  if (!signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Process AI response for the message
async function processWithAI(
  message: BlueBubblesMessage,
  integration: { integrationId: string; userId: string; settings: { contextLimit: number } }
): Promise<string | null> {
  try {
    // Get recent messages for context
    const recentMessages = await getConvexClient().query(api.channels.getRecentMessages, {
      integrationId: integration.integrationId,
      limit: integration.settings.contextLimit,
    });

    // Build conversation context
    const conversationContext = recentMessages
      .map((m: { direction: string; content: string }) =>
        `${m.direction === 'inbound' ? 'User' : '8gent'}: ${m.content}`
      )
      .join('\n');

    // Sanitize message content for prompt injection prevention
    const sanitizedContent = sanitizeForPrompt(message.text);

    // Call 8gent chat API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are 8gent responding via iMessage. Keep responses concise and conversational, suitable for mobile messaging. Previous context:\n${conversationContext}`,
            },
            {
              role: 'user',
              content: sanitizedContent,
            },
          ],
          userId: integration.userId,
          channel: 'imessage',
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[iMessage] AI processing failed:', errorText);
      return null;
    }

    const data = await response.json() as { response?: string; content?: string; error?: string };
    if (data.error) {
      console.error('[iMessage] AI error:', data.error);
      return null;
    }
    return data.response || data.content || null;
  } catch (error) {
    console.error('[iMessage] AI processing error:', error);
    return null;
  }
}

// Send response via BlueBubbles API
async function sendViaBlueBubbles(
  serverUrl: string,
  serverPassword: string,
  chatGuid: string,
  message: string
): Promise<boolean> {
  try {
    const response = await fetch(`${serverUrl}/api/v1/message/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatGuid,
        message,
        tempGuid: `temp-${Date.now()}`,
        method: 'private-api', // Use private API for better reliability
        password: serverPassword,
      }),
    });

    if (!response.ok) {
      console.error('[iMessage] BlueBubbles send failed:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('[iMessage] BlueBubbles send error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const bodyText = await request.text();

    // Verify webhook signature (fail-closed: rejects if secret not configured in production)
    const webhookSecret = process.env.BLUEBUBBLES_WEBHOOK_SECRET;
    if (!verifyWebhookSignature(request, bodyText, webhookSecret)) {
      console.warn('[iMessage] Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event: BlueBubblesEvent = JSON.parse(bodyText);

    console.log(`[iMessage] Received event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'new-message': {
        const message = event.data as BlueBubblesMessage;

        // Skip messages from self
        if (message.isFromMe) {
          return NextResponse.json({ status: 'skipped', reason: 'self-message' });
        }

        // Get sender address
        const senderAddress = message.handle?.address;
        if (!senderAddress) {
          return NextResponse.json({ status: 'skipped', reason: 'no-sender' });
        }

        // Get chat info
        const chat = message.chats?.[0];
        const chatGuid = chat?.guid;
        if (!chatGuid) {
          return NextResponse.json({ status: 'skipped', reason: 'no-chat' });
        }

        // Look up integration by sender
        const integration = await getConvexClient().query(
          api.channels.getIntegrationByPlatformUser,
          {
            platform: 'imessage',
            platformUserId: senderAddress,
          }
        );

        if (!integration) {
          console.log(`[iMessage] No integration found for: ${senderAddress}`);
          return NextResponse.json({ status: 'skipped', reason: 'no-integration' });
        }

        // Check if integration is enabled
        if (!integration.settings.enabled) {
          return NextResponse.json({ status: 'skipped', reason: 'disabled' });
        }

        // Store inbound message
        await getConvexClient().mutation(api.channels.storeMessage, {
          integrationId: integration.integrationId,
          userId: integration.userId,
          platform: 'imessage',
          platformMessageId: message.guid,
          direction: 'inbound',
          messageType: message.hasAttachments ? 'image' : 'text',
          content: message.text || '',
          platformTimestamp: message.dateCreated,
        });

        // Process with AI if auto-reply is enabled
        if (integration.settings.autoReply) {
          const aiResponse = await processWithAI(message, integration);

          if (aiResponse) {
            // Send response via BlueBubbles
            const serverUrl = integration.credentials?.serverUrl;
            const serverPassword = integration.credentials?.serverPassword;

            if (serverUrl && serverPassword) {
              const sent = await sendViaBlueBubbles(
                serverUrl,
                serverPassword,
                chatGuid,
                aiResponse
              );

              if (sent) {
                // Store outbound message
                await getConvexClient().mutation(api.channels.storeMessage, {
                  integrationId: integration.integrationId,
                  userId: integration.userId,
                  platform: 'imessage',
                  direction: 'outbound',
                  messageType: 'text',
                  content: aiResponse,
                });
              }
            }
          }
        }

        const processingTime = Date.now() - startTime;
        console.log(`[iMessage] Processed in ${processingTime}ms`);

        return NextResponse.json({
          status: 'processed',
          processingTimeMs: processingTime,
        });
      }

      case 'message-send-error': {
        console.error('[iMessage] Send error:', event.data);
        return NextResponse.json({ status: 'logged' });
      }

      case 'updated-message': {
        console.log('[iMessage] Message updated:', event.data);
        return NextResponse.json({ status: 'logged' });
      }

      case 'chat-read-status-changed':
      case 'typing-indicator': {
        // Acknowledge but don't process
        return NextResponse.json({ status: 'acknowledged' });
      }

      default: {
        console.log(`[iMessage] Unknown event type: ${event.type}`);
        return NextResponse.json({ status: 'unknown-event' });
      }
    }
  } catch (error) {
    console.error('[iMessage] Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'iMessage/BlueBubbles webhook',
    timestamp: new Date().toISOString(),
  });
}
