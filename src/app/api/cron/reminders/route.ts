import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from '@/lib/convex-shim';
import { Resend } from 'resend';
import { api } from '@/lib/convex-shim';

// Lazy Convex client creation to avoid build-time errors
function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL not configured');
  }
  return new ConvexHttpClient(url);
}

// Verify this is a legitimate cron request
function verifyCronRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // In development on localhost, allow all requests
  // SECURITY: Only allow on localhost to prevent accidental production bypass
  if (process.env.NODE_ENV === 'development') {
    const host = request.headers.get('host') || '';
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return true;
    }
  }

  // SECURITY: Only accept Bearer token authentication
  // The x-vercel-cron header can be spoofed and should not be trusted
  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  return false;
}

// SECURITY: Escape HTML to prevent XSS/injection in emails
function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char] || char);
}

// Format reminder message to HTML email
function formatReminderEmail(reminder: {
  title: string;
  message: string;
}): string {
  // SECURITY: Escape user-provided content first
  const escapedMessage = escapeHtml(reminder.message);
  const escapedTitle = escapeHtml(reminder.title);

  // Convert markdown-ish formatting (after escaping, so tags are safe)
  let html = escapedMessage
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #374151;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px; border-radius: 12px 12px 0 0; color: white;">
        <h2 style="margin: 0; font-size: 18px;">${escapedTitle}</h2>
        <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Reminder from OpenClaw-OS</p>
      </div>
      <div style="background: #fffbeb; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #fcd34d; border-top: none;">
        <div style="font-size: 15px; line-height: 1.6;">
          ${html}
        </div>
      </div>
      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
        Sent from OpenClaw-OS Reminders
      </p>
    </div>
  `;
}

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    if (!verifyCronRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured - skipping reminders');
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: 'Email service not configured',
      });
    }

    // Get due reminders from Convex
    const dueReminders = await getConvexClient().query(api.reminders.getDueReminders);

    if (dueReminders.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: 'No reminders due',
      });
    }

    const resend = new Resend(resendApiKey);
    const results: Array<{
      reminderId: string;
      status: 'sent' | 'failed';
      emailId?: string;
      error?: string;
    }> = [];

    // Process each due reminder
    for (const reminder of dueReminders) {
      try {
        const htmlEmail = formatReminderEmail({
          title: reminder.title,
          message: reminder.message,
        });

        const { data, error } = await resend.emails.send({
          from: 'OpenClaw-OS Reminders <noreply@ai.openclaw.io>',
          to: [reminder.recipientEmail],
          subject: `Reminder: ${reminder.title}`,
          html: htmlEmail,
          text: `${reminder.title}\n\n${reminder.message}`,
        });

        if (error) {
          console.error(`Failed to send reminder ${reminder.reminderId}:`, error);
          results.push({
            reminderId: reminder.reminderId,
            status: 'failed',
            error: error.message,
          });

          // Mark as failed in Convex
          await getConvexClient().mutation(api.reminders.markReminderSent, {
            reminderId: reminder.reminderId,
            status: 'failed',
            error: error.message,
          });
        } else {
          results.push({
            reminderId: reminder.reminderId,
            status: 'sent',
            emailId: data?.id,
          });

          // Mark as sent in Convex
          await getConvexClient().mutation(api.reminders.markReminderSent, {
            reminderId: reminder.reminderId,
            status: 'sent',
            emailId: data?.id,
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Error processing reminder ${reminder.reminderId}:`, err);
        results.push({
          reminderId: reminder.reminderId,
          status: 'failed',
          error: errorMessage,
        });

        // Mark as failed in Convex
        await getConvexClient().mutation(api.reminders.markReminderSent, {
          reminderId: reminder.reminderId,
          status: 'failed',
          error: errorMessage,
        });
      }
    }

    const sent = results.filter((r) => r.status === 'sent').length;
    const failed = results.filter((r) => r.status === 'failed').length;

    return NextResponse.json({
      success: true,
      processed: results.length,
      sent,
      failed,
      results,
    });
  } catch (error) {
    console.error('Reminders cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
