/**
 * Email Webhook Handler (Resend Inbound)
 *
 * Receives inbound emails via Resend's inbound email feature.
 * Processes emails and generates 8gent responses.
 *
 * Setup in Resend:
 * 1. Go to Resend Dashboard → Inbound Emails
 * 2. Create inbound endpoint: ai@openclaw.io
 * 3. Set webhook URL: https://openclaw.io/api/webhooks/email
 * 4. Configure webhook secret for verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from '@/lib/convex-shim';
import { api } from '@/lib/convex-shim';
import { Resend } from 'resend';
import crypto from 'crypto';

// Initialize Convex client lazily to avoid build-time errors
function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL not configured");
  }
  return new ConvexHttpClient(url);
}

// Initialize Resend client lazily
function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

// 8gent email address
const CLAW_AI_EMAIL = process.env.CLAW_AI_EMAIL || 'ai@openclaw.io';
const CLAW_AI_NAME = '8gent';

// =============================================================================
// Types
// =============================================================================

interface ResendInboundEmail {
  // Headers
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  replyTo?: string;
  messageId: string;
  inReplyTo?: string;
  references?: string[];

  // Content
  text?: string;
  html?: string;

  // Attachments
  attachments?: {
    filename: string;
    contentType: string;
    size: number;
    content: string; // Base64 encoded
  }[];

  // Metadata
  timestamp: string;
  spamScore?: number;
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Extract email address from "Name <email>" format
 */
function extractEmail(emailString: string): string {
  const match = emailString.match(/<([^>]+)>/);
  return match ? match[1] : emailString.trim();
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

/**
 * Sanitize text for inclusion in AI prompts to prevent prompt injection
 * Removes control characters and limits length
 */
function sanitizeForPrompt(text: string, maxLength = 200): string {
  return text
    .replace(/[\x00-\x1F\x7F]/g, ' ')  // Remove control characters
    .replace(/\s+/g, ' ')               // Normalize whitespace
    .trim()
    .slice(0, maxLength);
}

/**
 * Strip HTML tags and convert to plain text
 */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')      // Convert <br> to newlines
    .replace(/<\/p>/gi, '\n\n')         // Convert </p> to paragraph breaks
    .replace(/<[^>]*>/g, '')            // Strip all HTML tags
    .replace(/&nbsp;/g, ' ')            // Convert &nbsp; to space
    .replace(/&amp;/g, '&')             // Decode common entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')               // Normalize whitespace
    .trim();
}

/**
 * Verify webhook signature (Resend uses HMAC-SHA256)
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
      console.error('[Email] RESEND_WEBHOOK_SECRET not configured in production');
      return false;
    }
    console.warn('[Email] Webhook signature verification skipped (dev mode, no secret)');
    return true;
  }

  const signature = request.headers.get('x-resend-signature');
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

/**
 * Process email with 8gent
 */
async function processWithAI(
  email: ResendInboundEmail,
  integration: { integrationId: string; userId: string; settings: { contextLimit: number } }
): Promise<string | null> {
  try {
    // Get recent email conversation for context
    const recentMessages = await getConvexClient().query(api.channels.getRecentMessages, {
      integrationId: integration.integrationId,
      limit: integration.settings.contextLimit,
    });

    // Build conversation context
    const conversationContext = recentMessages
      .map((m: { direction: string; content: string }) =>
        `${m.direction === 'inbound' ? 'User' : '8gent'}: ${m.content.substring(0, 500)}...`
      )
      .join('\n\n');

    // Extract and sanitize email content (prevent prompt injection)
    const emailContent = email.text || (email.html ? htmlToPlainText(email.html) : '');
    const sanitizedSubject = sanitizeForPrompt(email.subject);
    const sanitizedFrom = sanitizeForPrompt(email.from);

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
              content: `You are 8gent responding to an email. Be professional yet personable, like James would be. Keep responses helpful and concise. Format appropriately for email (can use paragraphs, bullet points if needed).

Subject: ${sanitizedSubject}
From: ${sanitizedFrom}

Previous context:
${conversationContext}`,
            },
            {
              role: 'user',
              content: emailContent.slice(0, 10000), // Limit content length
            },
          ],
          userId: integration.userId,
          channel: 'email',
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Email] AI processing failed:', errorText);
      return null;
    }

    const data = await response.json() as { response?: string; content?: string; error?: string };
    if (data.error) {
      console.error('[Email] AI error:', data.error);
      return null;
    }
    return data.response || data.content || null;
  } catch (error) {
    console.error('[Email] AI processing error:', error);
    return null;
  }
}

/**
 * Send email reply via Resend
 */
async function sendEmailReply(
  to: string,
  subject: string,
  content: string,
  inReplyTo?: string,
  references?: string[]
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { data, error } = await getResendClient().emails.send({
      from: `${CLAW_AI_NAME} <${CLAW_AI_EMAIL}>`,
      to: [to],
      subject: subject.startsWith('Re:') ? subject : `Re: ${subject}`,
      text: content,
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
        ${content.split('\n').map(p => `<p style="margin: 0 0 1em 0;">${escapeHtml(p)}</p>`).join('')}
        <hr style="border: none; border-top: 1px solid #eee; margin: 2em 0;" />
        <p style="color: #666; font-size: 0.9em;">
          This is an AI-powered response from 8gent, 8gent's digital assistant.<br/>
          <a href="https://openclaw.io" style="color: #007AFF;">openclaw.io</a>
        </p>
      </div>`,
      headers: {
        ...(inReplyTo && { 'In-Reply-To': inReplyTo }),
        ...(references && { 'References': references.join(' ') }),
      },
    });

    if (error) {
      console.error('[Email] Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('[Email] Send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

// =============================================================================
// Handler
// =============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const bodyText = await request.text();

    // Verify webhook signature (fail-closed: rejects if secret not configured in production)
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    if (!verifyWebhookSignature(request, bodyText, webhookSecret)) {
      console.warn('[Email] Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const email: ResendInboundEmail = JSON.parse(bodyText);

    console.log(`[Email] Received from: ${email.from}, subject: ${email.subject}`);

    // Extract sender email
    const senderEmail = extractEmail(email.from);

    // Look up integration by sender email
    const integration = await getConvexClient().query(
      api.channels.getIntegrationByPlatformUser,
      {
        platform: 'email',
        platformUserId: senderEmail,
      }
    );

    if (!integration) {
      // If no specific integration, create a general one for tracking
      console.log(`[Email] No integration found for: ${senderEmail}`);

      // Could create integration on-the-fly here, but for security
      // we'll only respond to known contacts
      return NextResponse.json({
        status: 'skipped',
        reason: 'no-integration',
      });
    }

    // Check if integration is enabled
    if (!integration.settings.enabled) {
      return NextResponse.json({
        status: 'skipped',
        reason: 'disabled',
      });
    }

    // Extract email content using proper HTML parsing
    const emailContent = email.text || (email.html ? htmlToPlainText(email.html) : '');

    // Store inbound email
    await getConvexClient().mutation(api.channels.storeMessage, {
      integrationId: integration.integrationId,
      userId: integration.userId,
      platform: 'email',
      platformMessageId: email.messageId,
      direction: 'inbound',
      messageType: 'email',
      content: emailContent,
      emailSubject: email.subject,
      emailThreadId: email.inReplyTo || email.messageId,
      platformTimestamp: new Date(email.timestamp).getTime(),
    });

    // Process with AI if auto-reply is enabled
    if (integration.settings.autoReply) {
      const aiResponse = await processWithAI(email, integration);

      if (aiResponse) {
        // Send reply
        const result = await sendEmailReply(
          senderEmail,
          email.subject,
          aiResponse,
          email.messageId,
          email.references ? [...email.references, email.messageId] : [email.messageId]
        );

        if (result.success) {
          // Store outbound email
          await getConvexClient().mutation(api.channels.storeMessage, {
            integrationId: integration.integrationId,
            userId: integration.userId,
            platform: 'email',
            platformMessageId: result.messageId,
            direction: 'outbound',
            messageType: 'email',
            content: aiResponse,
            emailSubject: `Re: ${email.subject}`,
            emailThreadId: email.inReplyTo || email.messageId,
          });
        }
      }
    }

    const processingTime = Date.now() - startTime;
    console.log(`[Email] Processed in ${processingTime}ms`);

    return NextResponse.json({
      status: 'processed',
      processingTimeMs: processingTime,
    });
  } catch (error) {
    console.error('[Email] Webhook error:', error);
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
    service: 'Email webhook (Resend)',
    clawAIEmail: CLAW_AI_EMAIL,
    timestamp: new Date().toISOString(),
  });
}
