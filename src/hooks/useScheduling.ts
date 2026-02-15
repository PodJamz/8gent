/**
 * useScheduling - Hook for managing scheduling operations
 *
 * Provides access to event types, availability, bookings, and calendar sync.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation } from "@/lib/openclaw/hooks";
import { getUserTimezone } from "@/lib/scheduling/utils";
import type {
  EventType,
  Availability,
  Booking,
  CalendarIntegration,
  CalendarView,
} from "@/lib/scheduling/types";

// Dynamically import the API to handle cases where schema isn't deployed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let api: any = null;
try {
  api = require('@/lib/convex-shim').api;
} catch {
  // Schema not deployed yet
}

interface UseSchedulingOptions {
  autoInitializeAvailability?: boolean;
}

export function useScheduling(options: UseSchedulingOptions = {}) {
  const { autoInitializeAvailability = true } = options;

  // Local state
  const [calendarView, setCalendarView] = useState<CalendarView>("month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  // Schema is ready if api.scheduling exists (always true with static import)
  const schemaReady = Boolean(api?.scheduling);

  // Convex queries - use skip pattern for conditional queries
  const userProfileQuery = useQuery(
    api.scheduling.getUserProfile,
    schemaReady ? {} : "skip"
  );
  const eventTypesQuery = useQuery(
    api.scheduling.getEventTypes,
    schemaReady ? {} : "skip"
  );
  const availabilityQuery = useQuery(
    api.scheduling.getAvailability,
    schemaReady ? {} : "skip"
  );
  const defaultAvailabilityQuery = useQuery(
    api.scheduling.getDefaultAvailability,
    schemaReady ? {} : "skip"
  );
  const calendarIntegrationQuery = useQuery(
    api.scheduling.getCalendarIntegration,
    schemaReady ? {} : "skip"
  );
  const upcomingBookingsQuery = useQuery(
    api.scheduling.getUpcomingBookings,
    schemaReady ? { limit: 10 } : "skip"
  );

  // Cast results
  const userProfile = userProfileQuery as { _id: string; username: string; displayName?: string; email?: string } | null | undefined;
  const eventTypes = eventTypesQuery as EventType[] | undefined;
  const availability = availabilityQuery as Availability[] | undefined;
  const defaultAvailability = defaultAvailabilityQuery as Availability | null | undefined;
  const calendarIntegration = calendarIntegrationQuery as CalendarIntegration | null | undefined;
  const upcomingBookings = upcomingBookingsQuery as Booking[] | undefined;

  // Convex mutations - use direct API references
  const createEventTypeMutation = useMutation(api.scheduling.createEventType);
  const updateEventTypeMutation = useMutation(api.scheduling.updateEventType);
  const deleteEventTypeMutation = useMutation(api.scheduling.deleteEventType);
  const createAvailabilityMutation = useMutation(api.scheduling.createAvailability);
  const updateAvailabilityMutation = useMutation(api.scheduling.updateAvailability);
  const deleteAvailabilityMutation = useMutation(api.scheduling.deleteAvailability);
  const initializeDefaultAvailabilityMutation = useMutation(api.scheduling.initializeDefaultAvailability);
  const setOverrideMutation = useMutation(api.scheduling.setOverride);
  const deleteOverrideMutation = useMutation(api.scheduling.deleteOverride);
  const updateBookingStatusMutation = useMutation(api.scheduling.updateBookingStatus);
  const rescheduleBookingMutation = useMutation(api.scheduling.rescheduleBooking);
  const saveCalendarIntegrationMutation = useMutation(api.scheduling.saveCalendarIntegration);
  const updateCalendarIntegrationMutation = useMutation(api.scheduling.updateCalendarIntegration);
  const deleteCalendarIntegrationMutation = useMutation(api.scheduling.deleteCalendarIntegration);
  const updateBookingGoogleEventIdMutation = useMutation(api.scheduling.updateBookingGoogleEventId);
  const createOrUpdateUserProfileMutation = useMutation(api.scheduling.createOrUpdateUserProfile);

  // Auto-initialize default availability
  useEffect(() => {
    if (
      schemaReady &&
      autoInitializeAvailability &&
      availability !== undefined &&
      availability.length === 0 &&
      defaultAvailability === null
    ) {
      const timezone = getUserTimezone();
      initializeDefaultAvailabilityMutation({ timezone }).catch(console.error);
    }
  }, [
    schemaReady,
    autoInitializeAvailability,
    availability,
    defaultAvailability,
    initializeDefaultAvailabilityMutation,
  ]);

  // User Profile actions
  const createOrUpdateUserProfile = useCallback(
    async (data: { username: string; displayName?: string }) => {
      if (!schemaReady) throw new Error("Schema not deployed");
      return await createOrUpdateUserProfileMutation(data);
    },
    [schemaReady, createOrUpdateUserProfileMutation]
  );

  // Event Type actions
  const createEventType = useCallback(
    async (data: {
      title: string;
      description?: string;
      duration: number;
      color: string;
      locationType: "google_meet" | "zoom" | "phone" | "in_person" | "custom";
      locationValue?: string;
      bufferBefore?: number;
      bufferAfter?: number;
      minNotice?: number;
      maxAdvance?: number;
    }) => {
      if (!schemaReady) throw new Error("Schema not deployed");
      return await createEventTypeMutation(data);
    },
    [schemaReady, createEventTypeMutation]
  );

  const updateEventType = useCallback(
    async (id: string, data: Partial<EventType>) => {
      if (!schemaReady) throw new Error("Schema not deployed");
      const { _id, ownerId, createdAt, ...updateData } = data as Record<string, unknown>;
      await updateEventTypeMutation({ id, ...updateData } as any);
    },
    [schemaReady, updateEventTypeMutation]
  );

  const deleteEventType = useCallback(
    async (id: string) => {
      if (!schemaReady) throw new Error("Schema not deployed");
      await deleteEventTypeMutation({ id } as any);
    },
    [schemaReady, deleteEventTypeMutation]
  );

  // Availability actions
  const createAvailability = useCallback(
    async (data: {
      name: string;
      timezone: string;
      isDefault?: boolean;
      schedule: Array<{
        dayOfWeek: number;
        isAvailable: boolean;
        slots: Array<{ start: string; end: string }>;
      }>;
    }) => {
      if (!schemaReady) throw new Error("Schema not deployed");
      return await createAvailabilityMutation(data);
    },
    [schemaReady, createAvailabilityMutation]
  );

  const updateAvailability = useCallback(
    async (id: string, data: Partial<Availability>) => {
      if (!schemaReady) throw new Error("Schema not deployed");
      const { _id, ownerId, createdAt, ...updateData } = data as Record<string, unknown>;
      await updateAvailabilityMutation({ id, ...updateData } as any);
    },
    [schemaReady, updateAvailabilityMutation]
  );

  const deleteAvailability = useCallback(
    async (id: string) => {
      if (!schemaReady) throw new Error("Schema not deployed");
      await deleteAvailabilityMutation({ id } as any);
    },
    [schemaReady, deleteAvailabilityMutation]
  );

  // Override actions
  const setOverride = useCallback(
    async (data: {
      date: string;
      isBlocked: boolean;
      slots?: Array<{ start: string; end: string }>;
      reason?: string;
    }) => {
      if (!schemaReady) throw new Error("Schema not deployed");
      return await setOverrideMutation(data);
    },
    [schemaReady, setOverrideMutation]
  );

  const deleteOverride = useCallback(
    async (date: string) => {
      if (!schemaReady) throw new Error("Schema not deployed");
      await deleteOverrideMutation({ date });
    },
    [schemaReady, deleteOverrideMutation]
  );

  // Booking actions
  const confirmBooking = useCallback(
    async (id: string) => {
      if (!schemaReady) throw new Error("Schema not deployed");
      await updateBookingStatusMutation({ id, status: "confirmed" } as any);
    },
    [schemaReady, updateBookingStatusMutation]
  );

  const cancelBooking = useCallback(
    async (id: string, reason?: string, cancelledBy?: "host" | "guest") => {
      if (!schemaReady) throw new Error("Schema not deployed");
      await updateBookingStatusMutation({
        id,
        status: "cancelled",
        cancelReason: reason,
        cancelledBy,
      } as any);
    },
    [schemaReady, updateBookingStatusMutation]
  );

  const markNoShow = useCallback(
    async (id: string) => {
      if (!schemaReady) throw new Error("Schema not deployed");
      await updateBookingStatusMutation({ id, status: "no_show" } as any);
    },
    [schemaReady, updateBookingStatusMutation]
  );

  const markCompleted = useCallback(
    async (id: string) => {
      if (!schemaReady) throw new Error("Schema not deployed");
      await updateBookingStatusMutation({ id, status: "completed" } as any);
    },
    [schemaReady, updateBookingStatusMutation]
  );

  const rescheduleBooking = useCallback(
    async (id: string, newStartTime: number) => {
      if (!schemaReady) throw new Error("Schema not deployed");
      return await rescheduleBookingMutation({ id, newStartTime } as any);
    },
    [schemaReady, rescheduleBookingMutation]
  );

  // Google Calendar actions
  const connectGoogleCalendar = useCallback(async () => {
    setIsConnectingGoogle(true);
    try {
      const response = await fetch("/api/calendar/google/auth?returnUrl=/calendar");
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error(data.error || "Failed to get auth URL");
      }
    } catch (error) {
      console.error("Failed to connect Google Calendar:", error);
      setIsConnectingGoogle(false);
      throw error;
    }
  }, []);

  const saveGoogleTokens = useCallback(
    async (tokenData: {
      accessToken: string;
      refreshToken: string;
      tokenExpiry: number;
      calendarId: string;
      calendarEmail: string;
    }) => {
      if (!schemaReady) throw new Error("Schema not deployed");
      await saveCalendarIntegrationMutation(tokenData);
    },
    [schemaReady, saveCalendarIntegrationMutation]
  );

  const disconnectGoogleCalendar = useCallback(async () => {
    if (!schemaReady) throw new Error("Schema not deployed");
    await deleteCalendarIntegrationMutation();
  }, [schemaReady, deleteCalendarIntegrationMutation]);

  const syncBookingToCalendar = useCallback(
    async (booking: Booking, action: "create" | "update" | "delete" = "create") => {
      if (!calendarIntegration) {
        throw new Error("No calendar integration configured");
      }

      const response = await fetch("/api/calendar/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          booking,
          integration: calendarIntegration,
          timezone: defaultAvailability?.timezone || getUserTimezone(),
        }),
      });

      const data = await response.json();

      if (data.needsTokenUpdate) {
        await saveCalendarIntegrationMutation({
          accessToken: data.newTokens.accessToken,
          refreshToken: data.newTokens.refreshToken,
          tokenExpiry: data.newTokens.tokenExpiry,
          calendarId: calendarIntegration.calendarId,
          calendarEmail: calendarIntegration.calendarEmail,
        });
        return syncBookingToCalendar(booking, action);
      }

      if (!data.success) {
        throw new Error(data.error || "Sync failed");
      }

      if (action === "create" && data.googleEventId) {
        await updateBookingGoogleEventIdMutation({
          bookingId: booking._id,
          googleEventId: data.googleEventId,
          location: data.meetLink,
        } as any);
      }

      return data;
    },
    [
      calendarIntegration,
      defaultAvailability?.timezone,
      saveCalendarIntegrationMutation,
      updateBookingGoogleEventIdMutation,
    ]
  );

  // Loading states
  const isLoading = !schemaReady ||
    eventTypes === undefined ||
    availability === undefined ||
    calendarIntegration === undefined;

  return {
    // Schema status
    schemaReady,

    // Data
    userProfile: userProfile ?? null,
    eventTypes: eventTypes || [],
    availability: availability || [],
    defaultAvailability: defaultAvailability ?? null,
    calendarIntegration: calendarIntegration ?? null,
    upcomingBookings: upcomingBookings || [],

    // Calendar view state
    calendarView,
    setCalendarView,
    selectedDate,
    setSelectedDate,

    // User Profile actions
    createOrUpdateUserProfile,

    // Event Type actions
    createEventType,
    updateEventType,
    deleteEventType,

    // Availability actions
    createAvailability,
    updateAvailability,
    deleteAvailability,
    setOverride,
    deleteOverride,

    // Booking actions
    confirmBooking,
    cancelBooking,
    markNoShow,
    markCompleted,
    rescheduleBooking,

    // Google Calendar actions
    connectGoogleCalendar,
    saveGoogleTokens,
    disconnectGoogleCalendar,
    syncBookingToCalendar,
    isConnectingGoogle,

    // Loading state
    isLoading,
  };
}
