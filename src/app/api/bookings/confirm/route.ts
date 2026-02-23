import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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

// Lazy-loaded Resend client
let resend: Resend | null = null;
function getResendClient() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

// Email to notify host (James) about new bookings
const HOST_EMAIL = process.env.CALENDAR_HOST_EMAIL || 'james@podjamz.com';

interface BookingConfirmationRequest {
  guestName: string;
  guestEmail: string;
  eventTitle: string;
  startTime: number; // timestamp
  endTime: number;
  timezone: string;
  locationType: string;
  location?: string; // Google Meet link or custom location
  notes?: string;
  hostName?: string;
}

function formatDateTime(timestamp: number, timezone: string): { date: string; time: string } {
  const date = new Date(timestamp);

  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  });

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: timezone,
  });

  return { date: dateStr, time: timeStr };
}

function getLocationDisplay(locationType: string, location?: string): string {
  switch (locationType) {
    case 'google_meet':
      return location ? `<a href="${location}" style="color: #f59e0b;">Join Google Meet</a>` : 'Google Meet (link will be shared)';
    case 'zoom':
      return location ? `<a href="${location}" style="color: #f59e0b;">Join Zoom</a>` : 'Zoom (link will be shared)';
    case 'phone':
      return location || 'Phone call (number will be shared)';
    case 'in_person':
      return location || 'In person (address will be shared)';
    default:
      return location || 'Details will be shared';
  }
}

function formatGuestEmail(booking: BookingConfirmationRequest): string {
  const { date, time } = formatDateTime(booking.startTime, booking.timezone);
  const locationDisplay = getLocationDisplay(booking.locationType, booking.location);

  // SECURITY: Escape all user-provided content
  const safeTitle = escapeHtml(booking.eventTitle);
  const safeNotes = booking.notes ? escapeHtml(booking.notes) : '';
  const safeHostName = escapeHtml(booking.hostName || 'the host');

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #374151;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 24px; border-radius: 12px 12px 0 0; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Booking Confirmed!</h1>
        <p style="margin: 8px 0 0 0; opacity: 0.9;">Your meeting has been scheduled</p>
      </div>

      <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
        <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px;">${safeTitle}</h2>

        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 0 0 8px 0;"><strong>Time:</strong> ${time}</p>
          <p style="margin: 0;"><strong>Location:</strong> ${locationDisplay}</p>
        </div>

        ${safeNotes ? `
        <div style="background: #fffbeb; padding: 12px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 16px;">
          <p style="margin: 0; font-size: 14px;"><strong>Your notes:</strong></p>
          <p style="margin: 8px 0 0 0; color: #6b7280;">${safeNotes}</p>
        </div>
        ` : ''}

        <p style="color: #6b7280; font-size: 14px; margin: 16px 0 0 0;">
          Need to make changes? Reply to this email or contact ${safeHostName} directly.
        </p>
      </div>

      <div style="background: #f9fafb; padding: 16px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; text-align: center;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          Sent from 8gent Calendar
        </p>
      </div>
    </div>
  `;
}

function formatHostEmail(booking: BookingConfirmationRequest): string {
  const { date, time } = formatDateTime(booking.startTime, booking.timezone);

  // SECURITY: Escape all user-provided content
  const safeTitle = escapeHtml(booking.eventTitle);
  const safeGuestName = escapeHtml(booking.guestName);
  const safeGuestEmail = escapeHtml(booking.guestEmail);
  const safeNotes = booking.notes ? escapeHtml(booking.notes) : '';

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #374151;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px; border-radius: 12px 12px 0 0; color: white;">
        <h2 style="margin: 0; font-size: 20px;">New Booking!</h2>
        <p style="margin: 8px 0 0 0; opacity: 0.9;">Someone just booked a meeting with you</p>
      </div>

      <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
        <h3 style="margin: 0 0 16px 0; color: #1f2937;">${safeTitle}</h3>

        <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <p style="margin: 0 0 8px 0;"><strong>Guest:</strong> ${safeGuestName}</p>
          <p style="margin: 0 0 8px 0;"><strong>Email:</strong> <a href="mailto:${safeGuestEmail}" style="color: #059669;">${safeGuestEmail}</a></p>
          <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 0;"><strong>Time:</strong> ${time}</p>
        </div>

        ${safeNotes ? `
        <div style="background: #fefce8; padding: 12px; border-radius: 8px; border-left: 4px solid #eab308;">
          <p style="margin: 0; font-size: 14px;"><strong>Guest notes:</strong></p>
          <p style="margin: 8px 0 0 0; color: #6b7280;">${safeNotes}</p>
        </div>
        ` : ''}
      </div>

      <div style="background: #f9fafb; padding: 16px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; text-align: center;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          8gent Calendar Notification
        </p>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const booking: BookingConfirmationRequest = await request.json();

    if (!booking.guestEmail || !booking.guestName || !booking.eventTitle || !booking.startTime) {
      return NextResponse.json(
        { error: 'Missing required booking fields' },
        { status: 400 }
      );
    }

    const resendClient = getResendClient();
    if (!resendClient) {
      return NextResponse.json({
        success: false,
        error: 'Email service not configured',
      });
    }

    const results: { guest?: boolean; host?: boolean; errors: string[] } = { errors: [] };

    // Send confirmation to guest
    try {
      await resendClient.emails.send({
        from: '8gent Calendar <calendar@openclaw.io>',
        to: booking.guestEmail,
        subject: `Confirmed: ${booking.eventTitle}`,
        html: formatGuestEmail(booking),
      });
      results.guest = true;
    } catch (error) {
      console.error('Failed to send guest email:', error);
      results.errors.push('Failed to send guest confirmation');
    }

    // Send notification to host
    try {
      await resendClient.emails.send({
        from: '8gent Calendar <calendar@openclaw.io>',
        to: HOST_EMAIL,
        subject: `New Booking: ${booking.guestName} - ${booking.eventTitle}`,
        html: formatHostEmail(booking),
      });
      results.host = true;
    } catch (error) {
      console.error('Failed to send host email:', error);
      results.errors.push('Failed to send host notification');
    }

    return NextResponse.json({
      success: results.guest || results.host,
      ...results,
    });
  } catch (error) {
    console.error('Booking confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking confirmation' },
      { status: 500 }
    );
  }
}
