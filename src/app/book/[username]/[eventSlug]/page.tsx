'use client';

/**
 * Public Booking Page
 *
 * Allows guests to book a meeting by selecting a date and time.
 */

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import {
  BookingCalendar,
  TimeSlotPicker,
  BookingForm,
  BookingConfirmation,
} from '@/components/scheduling';
import type { EventType, AvailableSlot, Booking } from '@/lib/scheduling/types';
import { formatDuration, getUserTimezone, formatDateString } from '@/lib/scheduling/utils';

import { api } from '@/lib/convex-shim';

type BookingStep = 'select-date' | 'select-time' | 'enter-details' | 'confirmed';

export default function BookingPage() {
  const params = useParams();
  const username = params.username as string;
  const eventSlug = params.eventSlug as string;

  const [step, setStep] = useState<BookingStep>('select-date');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [guestTimezone] = useState(getUserTimezone());

  // Check if schema is ready
  const schemaReady = api?.scheduling?.getPublicEventTypes !== undefined;

  // Get event type by slug
  // Note: In a real app, you'd have a query to get event type by username + slug
  // For now, we'll get all public event types and filter
  const eventTypes = useQuery(
    api?.scheduling?.getPublicEventTypes ?? (null as never),
    schemaReady ? { ownerId: username } : 'skip'
  );
  const eventType = useMemo(
    () => (eventTypes as EventType[] | undefined)?.find((et: EventType) => et.slug === eventSlug),
    [eventTypes, eventSlug]
  );

  // Get available slots for selected date
  const availableSlots = useQuery(
    api?.scheduling?.getAvailableSlots ?? (null as never),
    schemaReady && selectedDate && eventType
      ? {
        eventTypeId: eventType._id as any,
        date: formatDateString(selectedDate),
        timezone: guestTimezone,
      }
      : 'skip'
  ) as AvailableSlot[] | undefined;

  // Create booking mutation
  const createBookingMutation = useMutation(
    api?.scheduling?.createBooking ?? (null as never)
  );

  // Handle date selection
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep('select-time');
  };

  // Handle time slot selection
  const handleSelectSlot = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setStep('enter-details');
  };

  // Handle booking submission
  const handleSubmitBooking = async (data: {
    guestName: string;
    guestEmail: string;
    guestTimezone: string;
    notes?: string;
    responses?: Array<{
      questionId: string;
      questionLabel: string;
      answer: string;
    }>;
  }) => {
    if (!eventType || !selectedSlot || !createBookingMutation) return;

    const bookingId = await createBookingMutation({
      eventTypeId: eventType._id as any,
      guestEmail: data.guestEmail,
      guestName: data.guestName,
      guestTimezone: data.guestTimezone,
      startTime: selectedSlot.timestamp,
      notes: data.notes,
      responses: data.responses,
    });

    // Fetch the created booking to show confirmation
    // For now, we'll construct it from the data we have
    setConfirmedBooking({
      _id: bookingId as string,
      eventTypeId: eventType._id,
      hostId: username,
      guestEmail: data.guestEmail,
      guestName: data.guestName,
      guestTimezone: data.guestTimezone,
      startTime: selectedSlot.timestamp,
      endTime: selectedSlot.timestamp + eventType.duration * 60 * 1000,
      status: 'confirmed',
      title: eventType.title,
      locationType: eventType.locationType,
      notes: data.notes,
      responses: data.responses,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setStep('confirmed');
  };

  // Handle back navigation
  const handleBack = () => {
    if (step === 'select-time') {
      setStep('select-date');
      setSelectedSlot(null);
    } else if (step === 'enter-details') {
      setStep('select-time');
    }
  };

  // Schema not deployed yet
  if (!schemaReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🗓️</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
            Coming Soon
          </h1>
          <p className="mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
            The booking system is being set up. Check back soon!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium"
            style={{
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            }}
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (eventTypes === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin opacity-50" />
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Event type not found
  if (!eventType) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <LiquidGlass className="p-8 rounded-2xl text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
            Event Not Found
          </h1>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>
            This booking link may be invalid or the event type has been disabled.
          </p>
        </LiquidGlass>
      </div>
    );
  }

  // Confirmation view
  if (step === 'confirmed' && confirmedBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <BookingConfirmation
          booking={confirmedBooking}
          eventType={eventType}
          onClose={() => window.close()}
        />
      </div>
    );
  }

  const locationLabels: Record<string, string> = {
    google_meet: 'Google Meet',
    zoom: 'Zoom',
    phone: 'Phone Call',
    in_person: 'In Person',
    custom: 'Custom',
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-[300px,1fr] gap-8">
          {/* Event info sidebar */}
          <div>
            <LiquidGlass className="p-6 rounded-2xl sticky top-8">
              {/* Back button */}
              {step !== 'select-date' && step !== 'confirmed' && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-sm mb-4 hover:underline"
                  style={{ color: 'hsl(var(--muted-foreground))' }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}

              {/* Event type info */}
              <div
                className="w-3 h-12 rounded-full mb-4"
                style={{ backgroundColor: eventType.color }}
              />

              <h1 className="text-xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                {eventType.title}
              </h1>

              {eventType.description && (
                <p className="text-sm mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {eventType.description}
                </p>
              )}

              <div className="space-y-2 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatDuration(eventType.duration)}
                </div>
                <p>{locationLabels[eventType.locationType]}</p>
              </div>
            </LiquidGlass>
          </div>

          {/* Booking steps */}
          <div>
            <AnimatePresence mode="wait">
              {step === 'select-date' && (
                <motion.div
                  key="select-date"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <LiquidGlass className="p-6 rounded-2xl">
                    <h2
                      className="text-lg font-semibold mb-4"
                      style={{ color: 'hsl(var(--foreground))' }}
                    >
                      Select a Date
                    </h2>
                    <BookingCalendar
                      selectedDate={selectedDate}
                      onSelectDate={handleSelectDate}
                      currentMonth={currentMonth}
                      onMonthChange={setCurrentMonth}
                      maxAdvanceDays={eventType.maxAdvance}
                    />
                  </LiquidGlass>
                </motion.div>
              )}

              {step === 'select-time' && selectedDate && (
                <motion.div
                  key="select-time"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <LiquidGlass className="p-6 rounded-2xl">
                    <h2
                      className="text-lg font-semibold mb-4"
                      style={{ color: 'hsl(var(--foreground))' }}
                    >
                      Select a Time
                    </h2>
                    <p className="text-sm mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <TimeSlotPicker
                      slots={availableSlots || []}
                      selectedSlot={selectedSlot}
                      onSelectSlot={handleSelectSlot}
                      timezone={guestTimezone}
                      isLoading={availableSlots === undefined}
                    />
                  </LiquidGlass>
                </motion.div>
              )}

              {step === 'enter-details' && selectedDate && selectedSlot && (
                <motion.div
                  key="enter-details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <BookingForm
                    eventType={eventType}
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    onSubmit={handleSubmitBooking}
                    onBack={handleBack}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
