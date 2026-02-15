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

// Verify this is a legitimate cron request (Vercel adds this header)
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

// Generate AI summary using OpenAI
async function generateAISummary(
  data: any,
  settings: any
): Promise<string> {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    // Fallback to template-based summary
    return generateTemplateSummary(data, settings);
  }

  const toneInstructions = {
    professional: 'Be formal, clear, and concise.',
    casual: 'Be friendly and relaxed, like chatting with a colleague.',
    witty: 'Be clever and humorous, with occasional puns or jokes.',
    enthusiastic: 'Be energetic and positive, celebrating wins and staying optimistic.',
  };

  const systemPrompt = `You are ${settings.aiName}, an AI assistant who sends hourly status update emails to James.
${toneInstructions[settings.aiTone as keyof typeof toneInstructions] || toneInstructions.witty}

Write a brief, scannable email summary (2-3 paragraphs max). Include:
- A greeting with the current time
- Key highlights from the data provided
- Any items needing attention
- A brief thought or observation
- Sign off as ${settings.aiName}

Keep it concise - this is an hourly update, not a detailed report.`;

  const userPrompt = `Here's the current system status:

${JSON.stringify(data, null, 2)}

Write the hourly summary email now.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      return generateTemplateSummary(data, settings);
    }

    const result = await response.json();
    return result.choices[0]?.message?.content || generateTemplateSummary(data, settings);
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return generateTemplateSummary(data, settings);
  }
}

// Fallback template-based summary
function generateTemplateSummary(data: any, settings: any): string {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const { kanban, bookings, suggestions, jobs } = data;

  let summary = `Hey James!\n\nIt's ${timeStr} and here's what's happening:\n\n`;

  // Kanban status
  if (kanban) {
    const inProgress = kanban.tasksByStatus['in-progress'] || 0;
    const review = kanban.tasksByStatus['review'] || 0;
    const todo = kanban.tasksByStatus['todo'] || 0;

    summary += `**Tasks:** ${inProgress} in progress, ${review} in review, ${todo} in todo\n`;

    if (kanban.recentTasks?.length > 0) {
      summary += `Recent activity: ${kanban.recentTasks.slice(0, 3).map((t: any) => t.title).join(', ')}\n`;
    }
  }

  // Bookings
  if (bookings?.upcoming?.length > 0) {
    summary += `\n**Upcoming:** ${bookings.upcoming.length} meeting(s) scheduled\n`;
  }

  // Suggestions
  if (suggestions?.pendingCount > 0) {
    summary += `\n**Suggestions:** ${suggestions.pendingCount} pending review\n`;
  }

  // Jobs
  if (jobs?.recentCompleted?.length > 0) {
    summary += `\n**Jobs:** ${jobs.recentCompleted.length} completed in the last hour\n`;
  }

  summary += `\n---\n${settings.aiName}`;

  return summary;
}

// Convert markdown-ish text to HTML email
function textToHtml(text: string): string {
  let html = text
    // Convert **bold** to <strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert *italic* to <em>
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert --- to <hr>
    .replace(/---/g, '<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">')
    // Convert newlines to <br>
    .replace(/\n/g, '<br>');

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #374151;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px 12px 0 0; color: white;">
        <h2 style="margin: 0; font-size: 18px;">Hourly Status Update</h2>
        <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">${new Date().toLocaleString()}</p>
      </div>
      <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
        ${html}
      </div>
      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
        Sent from OpenClaw-OS AI Summary System
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

    // Get AI summary settings
    const settings = await getConvexClient().query(api.reminders.getAISummarySettings);

    if (!settings.isEnabled) {
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: 'AI summary is disabled',
      });
    }

    if (!settings.recipientEmail) {
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: 'No recipient email configured',
      });
    }

    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured - skipping email');
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: 'Email service not configured',
      });
    }

    // Fetch summary data from Convex
    const summaryData = await getConvexClient().query(api.reminders.getSummaryData);

    // Generate AI summary
    const summaryText = await generateAISummary(summaryData, settings);
    const summaryHtml = textToHtml(summaryText);

    // Send email via Resend
    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: `${settings.aiName} <noreply@ai.openclaw.io>`,
      to: [settings.recipientEmail],
      subject: `Hourly Update - ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`,
      html: summaryHtml,
      text: summaryText,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // Mark as sent in Convex
    await getConvexClient().mutation(api.reminders.markAISummarySent);

    return NextResponse.json({
      success: true,
      emailId: data?.id,
      recipient: settings.recipientEmail,
    });
  } catch (error) {
    console.error('Hourly summary cron error:', error);
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
