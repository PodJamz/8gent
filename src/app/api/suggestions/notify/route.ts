import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Your email to receive notifications
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ai@openclaw.io';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, submittedBy, email } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured - skipping email notification');
      return NextResponse.json({ success: true, skipped: true, reason: 'Email not configured' });
    }

    // Create Resend client only when API key is available
    const resend = new Resend(resendApiKey);

    // SECURITY: Escape all user input before inserting into HTML
    const safeTitle = escapeHtml(title);
    const safeDescription = escapeHtml(description);
    const safeCategory = escapeHtml(category || 'Not specified');
    const safeSubmittedBy = escapeHtml(submittedBy || 'Anonymous');
    const safeEmail = email ? escapeHtml(email) : '';

    // Send email notification
    const { data, error } = await resend.emails.send({
      from: 'OpenClaw-OS Suggestions <noreply@ai.openclaw.io>',
      to: [ADMIN_EMAIL],
      subject: `New Suggestion: ${safeTitle}`,
      html: `
        <h2>New Feature Suggestion Submitted</h2>
        <p><strong>Title:</strong> ${safeTitle}</p>
        <p><strong>Category:</strong> ${safeCategory}</p>
        <p><strong>Description:</strong></p>
        <p style="background: #f5f5f5; padding: 12px; border-radius: 8px;">${safeDescription}</p>
        <hr />
        <p><strong>Submitted by:</strong> ${safeSubmittedBy}</p>
        ${safeEmail ? `<p><strong>Email:</strong> ${safeEmail}</p>` : ''}
        <p style="color: #666; font-size: 12px;">Submitted at ${new Date().toLocaleString()}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Suggestion notification error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
