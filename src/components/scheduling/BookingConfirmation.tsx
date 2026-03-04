'use client';

/**
 * BookingConfirmation - Success screen after booking
 */

import { Check, Calendar, Clock, Globe, Video, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import type { Booking, EventType } from '@/lib/scheduling/types';
import { formatDate, formatTime, formatDuration } from '@/lib/scheduling/utils';

interface BookingConfirmationProps {
  booking: Booking;
  eventType: EventType;
  onClose?: () => void;
}

export function BookingConfirmation({
  booking,
  eventType,
  onClose,
}: BookingConfirmationProps) {
  const locationLabels: Record<string, string> = {
    google_meet: 'Google Meet',
    zoom: 'Zoom',
    phone: 'Phone Call',
    in_person: 'In Person',
    custom: 'Custom',
  };

  // Generate calendar links
  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);

  const formatICSDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
  googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
  googleCalendarUrl.searchParams.set('text', booking.title);
  googleCalendarUrl.searchParams.set(
    'dates',
    `${formatICSDate(startDate)}/${formatICSDate(endDate)}`
  );
  if (booking.location) {
    googleCalendarUrl.searchParams.set('location', booking.location);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto"
    >
      <LiquidGlass className="p-6 rounded-2xl text-center">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'hsl(var(--primary))' }}
        >
          <Check className="w-8 h-8" style={{ color: 'hsl(var(--primary-foreground))' }} />
        </motion.div>

        <h2 className="text-2xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
          Booking Confirmed!
        </h2>

        <p className="text-sm mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
          A confirmation email has been sent to {booking.guestEmail}
        </p>

        {/* Booking details */}
        <div
          className="text-left p-4 rounded-xl mb-6"
          style={{ backgroundColor: 'hsl(var(--muted))' }}
        >
          <h3
            className="font-semibold mb-3"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            {eventType.title}
          </h3>

          <div className="space-y-2 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(booking.startTime)}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatTime(booking.startTime, booking.guestTimezone)} -{' '}
              {formatTime(booking.endTime, booking.guestTimezone)}
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {booking.guestTimezone}
            </div>

            {booking.location && (
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <a
                  href={booking.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                  style={{ color: 'hsl(var(--primary))' }}
                >
                  Join Meeting
                </a>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatDuration(eventType.duration)}
            </div>
          </div>
        </div>

        {/* Calendar links */}
        <div className="flex flex-col gap-2">
          <a
            href={googleCalendarUrl.toString()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors"
            style={{
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            }}
          >
            <Calendar className="w-4 h-4" />
            Add to Google Calendar
            <ExternalLink className="w-3 h-3" />
          </a>

          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg transition-colors"
              style={{
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              }}
            >
              Done
            </button>
          )}
        </div>
      </LiquidGlass>
    </motion.div>
  );
}
