'use client';

/**
 * Meet Page - AI-Native Booking Experience
 *
 * The beautiful conversational way to book a meeting with James.
 * Offers both conversational (default) and classic calendar views.
 */

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { Loader2, Calendar } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ConversationalBooking, BookingCalendar, TimeSlotPicker, BookingForm, BookingConfirmation } from '@/components/scheduling';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { springs } from '@/components/motion/config';
import type { EventType, AvailableSlot, Booking } from '@/lib/scheduling/types';
import { formatDuration, getUserTimezone, formatDateString } from '@/lib/scheduling/utils';

// Default host ID - in production this would come from config
const HOST_ID = 'jamesspalding';
const HOST_NAME = 'James';

type ViewMode = 'conversational' | 'classic';
type ClassicStep = 'select-date' | 'select-time' | 'enter-details' | 'confirmed';

// Inner component that uses Convex hooks safely (only mounted when API is ready)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MeetPageWithAPI({ api }: { api: any }) {
  const [viewMode, setViewMode] = useState<ViewMode>('conversational');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const [guestTimezone] = useState(getUserTimezone());

  // Classic view state
  const [classicStep, setClassicStep] = useState<ClassicStep>('select-date');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Get public event types - API is guaranteed to exist here
  const eventTypes = useQuery(
    api.scheduling.getPublicEventTypes,
    { ownerId: HOST_ID }
  ) as EventType[] | undefined;

  // Get available slots for selected date
  const availableSlots = useQuery(
    selectedDate && selectedEventType
      ? api.scheduling.getAvailableSlots
      : 'skip',
    selectedDate && selectedEventType
      ? {
          eventTypeId: selectedEventType._id,
          date: formatDateString(selectedDate),
          timezone: guestTimezone,
        }
      : 'skip'
  ) as AvailableSlot[] | undefined;

  // Create booking mutation - API is guaranteed to exist here
  const createBookingMutation = useMutation(api.scheduling.createBooking);

  // Handle date selection from conversational view
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    // Auto-select first event type if not selected
    if (eventTypes && eventTypes.length > 0 && !selectedEventType) {
      setSelectedEventType(eventTypes[0]);
    }
  }, [eventTypes, selectedEventType]);

  // Handle booking submission
  const handleSubmit = useCallback(async (data: {
    eventTypeId: string;
    guestName: string;
    guestEmail: string;
    guestTimezone: string;
    startTime: number;
    notes?: string;
  }) => {
    const eventType = eventTypes?.find(et => et._id === data.eventTypeId);
    if (!eventType) {
      throw new Error('Event type not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bookingId = await createBookingMutation({
      eventTypeId: data.eventTypeId as any,
      guestEmail: data.guestEmail,
      guestName: data.guestName,
      guestTimezone: data.guestTimezone,
      startTime: data.startTime,
      notes: data.notes,
    });

    // Set confirmed booking for classic view
    setConfirmedBooking({
      _id: bookingId as string,
      eventTypeId: data.eventTypeId,
      hostId: HOST_ID,
      guestEmail: data.guestEmail,
      guestName: data.guestName,
      guestTimezone: data.guestTimezone,
      startTime: data.startTime,
      endTime: data.startTime + eventType.duration * 60 * 1000,
      status: 'confirmed',
      title: eventType.title,
      locationType: eventType.locationType,
      notes: data.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }, [createBookingMutation, eventTypes]);

  // Update selected event type when duration changes in conversational mode
  const handleConversationalSubmit = useCallback(async (data: {
    eventTypeId: string;
    guestName: string;
    guestEmail: string;
    guestTimezone: string;
    startTime: number;
    notes?: string;
  }) => {
    // Find and set the event type
    const eventType = eventTypes?.find(et => et._id === data.eventTypeId);
    if (eventType) {
      setSelectedEventType(eventType);
    }
    await handleSubmit(data);
  }, [eventTypes, handleSubmit]);

  // Classic view handlers
  const handleClassicDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setClassicStep('select-time');
  };

  const handleClassicSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setClassicStep('enter-details');
  };

  const handleClassicSubmit = async (data: {
    guestName: string;
    guestEmail: string;
    guestTimezone: string;
    notes?: string;
  }) => {
    if (!selectedEventType || !selectedSlot) return;

    await handleSubmit({
      eventTypeId: selectedEventType._id as string,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestTimezone: data.guestTimezone,
      startTime: selectedSlot.timestamp,
      notes: data.notes,
    });

    setClassicStep('confirmed');
  };

  // Loading state
  if (eventTypes === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin opacity-50" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // No event types configured
  if (!eventTypes || eventTypes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            📅
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">No Availability</h1>
          <p className="text-muted-foreground mb-6">
            {HOST_NAME} hasn&apos;t set up any meeting types yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Set default event type if not set
  if (!selectedEventType && eventTypes.length > 0) {
    setSelectedEventType(eventTypes[0]);
  }

  // Conversational View (Default)
  if (viewMode === 'conversational') {
    return (
      <ConversationalBooking
        eventTypes={eventTypes}
        availableSlots={availableSlots}
        onDateSelect={handleDateSelect}
        onSubmit={handleConversationalSubmit}
        isLoadingSlots={selectedDate !== null && availableSlots === undefined}
        hostName={HOST_NAME}
        onSwitchToClassic={() => setViewMode('classic')}
      />
    );
  }

  // Classic View - Confirmation
  if (classicStep === 'confirmed' && confirmedBooking && selectedEventType) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <BookingConfirmation
          booking={confirmedBooking}
          eventType={selectedEventType}
          onClose={() => window.close()}
        />
      </div>
    );
  }

  // Classic View
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Switch to conversational */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setViewMode('conversational')}
        className="fixed top-4 right-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors z-50 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full"
      >
        ✨ Try the new experience
      </motion.button>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-[300px,1fr] gap-8">
          {/* Event info sidebar */}
          <div>
            <LiquidGlass className="p-6 rounded-2xl sticky top-8">
              {/* Back button for steps */}
              {classicStep !== 'select-date' && (
                <button
                  onClick={() => {
                    if (classicStep === 'select-time') {
                      setClassicStep('select-date');
                    } else if (classicStep === 'enter-details') {
                      setClassicStep('select-time');
                    }
                  }}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                  ← Back
                </button>
              )}

              {/* Event type selector */}
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">Meeting type</label>
                <select
                  value={selectedEventType?._id || ''}
                  onChange={(e) => {
                    const et = eventTypes.find(t => t._id === e.target.value);
                    if (et) setSelectedEventType(et);
                  }}
                  className="w-full p-2 rounded-lg bg-background border border-border"
                >
                  {eventTypes.map(et => (
                    <option key={et._id} value={et._id}>
                      {et.title} ({formatDuration(et.duration)})
                    </option>
                  ))}
                </select>
              </div>

              {selectedEventType && (
                <>
                  <div
                    className="w-3 h-12 rounded-full mb-4"
                    style={{ backgroundColor: selectedEventType.color }}
                  />
                  <h1 className="text-xl font-bold mb-2">{selectedEventType.title}</h1>
                  {selectedEventType.description && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedEventType.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDuration(selectedEventType.duration)}
                  </div>
                </>
              )}
            </LiquidGlass>
          </div>

          {/* Booking steps */}
          <div>
            <AnimatePresence mode="wait">
              {classicStep === 'select-date' && (
                <motion.div
                  key="select-date"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={springs.smooth}
                >
                  <LiquidGlass className="p-6 rounded-2xl">
                    <h2 className="text-lg font-semibold mb-4">Select a Date</h2>
                    <BookingCalendar
                      selectedDate={selectedDate}
                      onSelectDate={handleClassicDateSelect}
                      currentMonth={currentMonth}
                      onMonthChange={setCurrentMonth}
                      maxAdvanceDays={selectedEventType?.maxAdvance}
                    />
                  </LiquidGlass>
                </motion.div>
              )}

              {classicStep === 'select-time' && selectedDate && (
                <motion.div
                  key="select-time"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={springs.smooth}
                >
                  <LiquidGlass className="p-6 rounded-2xl">
                    <h2 className="text-lg font-semibold mb-4">Select a Time</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <TimeSlotPicker
                      slots={availableSlots || []}
                      selectedSlot={selectedSlot}
                      onSelectSlot={handleClassicSlotSelect}
                      timezone={guestTimezone}
                      isLoading={availableSlots === undefined}
                    />
                  </LiquidGlass>
                </motion.div>
              )}

              {classicStep === 'enter-details' && selectedDate && selectedSlot && selectedEventType && (
                <motion.div
                  key="enter-details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={springs.smooth}
                >
                  <BookingForm
                    eventType={selectedEventType}
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    onSubmit={handleClassicSubmit}
                    onBack={() => setClassicStep('select-time')}
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

// Wrapper component that handles API loading
function MeetPageContent() {
  const [isClient, setIsClient] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>(null);

  // Ensure we only run on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    try {
      const loadedApi = require('../../../convex/_generated/api').api;
      if (loadedApi?.scheduling) {
        setApi(loadedApi);
      }
    } catch {
      // Schema not deployed yet
    }
  }, [isClient]);

  // Schema not deployed - show Coming Soon
  if (!api) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            🗓️
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Coming Soon</h1>
          <p className="text-muted-foreground mb-6">
            The booking system is being set up. Check back soon!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Render the component with the API
  return <MeetPageWithAPI api={api} />;
}

// Default export with SSR protection
export default function MeetPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading during SSR/initial hydration
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            🗓️
          </motion.div>
          <Loader2 className="w-8 h-8 mx-auto animate-spin opacity-50" />
        </div>
      </div>
    );
  }

  return <MeetPageContent />;
}
