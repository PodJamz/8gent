/**
 * Scheduling Types - TypeScript definitions for the Calendly clone
 */

export type LocationType = "google_meet" | "zoom" | "phone" | "in_person" | "custom";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "rescheduled"
  | "completed"
  | "no_show";

export interface TimeSlot {
  start: string; // "HH:mm" format
  end: string;
}

export interface DaySchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  isAvailable: boolean;
  slots: TimeSlot[];
}

export interface Question {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  required: boolean;
  options?: string[];
}

export interface QuestionResponse {
  questionId: string;
  questionLabel: string;
  answer: string;
}

export interface EventType {
  _id: string;
  ownerId: string;
  title: string;
  slug: string;
  description?: string;
  duration: number;
  color: string;
  isActive: boolean;
  bufferBefore: number;
  bufferAfter: number;
  maxBookingsPerDay?: number;
  minNotice: number;
  maxAdvance: number;
  locationType: LocationType;
  locationValue?: string;
  questions: Question[];
  createdAt: number;
  updatedAt: number;
}

export interface Availability {
  _id: string;
  ownerId: string;
  name: string;
  isDefault: boolean;
  timezone: string;
  schedule: DaySchedule[];
  createdAt: number;
  updatedAt: number;
}

export interface AvailabilityOverride {
  _id: string;
  ownerId: string;
  date: string;
  isBlocked: boolean;
  slots?: TimeSlot[];
  reason?: string;
}

export interface Booking {
  _id: string;
  eventTypeId: string;
  hostId: string;
  guestEmail: string;
  guestName: string;
  guestTimezone: string;
  startTime: number;
  endTime: number;
  status: BookingStatus;
  title: string;
  location?: string;
  locationType: string;
  notes?: string;
  responses?: QuestionResponse[];
  googleEventId?: string;
  cancelledAt?: number;
  cancelReason?: string;
  cancelledBy?: "host" | "guest";
  rescheduledFrom?: string;
  rescheduledTo?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CalendarIntegration {
  _id: string;
  ownerId: string;
  provider: "google";
  accessToken: string;
  refreshToken: string;
  tokenExpiry: number;
  calendarId: string;
  calendarEmail: string;
  syncEnabled: boolean;
  blockExternalEvents: boolean;
  lastSyncAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface AvailableSlot {
  time: string; // "HH:mm" format
  timestamp: number;
}

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  conferenceData?: {
    createRequest?: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
    entryPoints?: Array<{
      entryPointType: string;
      uri: string;
      label?: string;
    }>;
  };
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

export interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface GoogleCalendarListResponse {
  items: Array<{
    id: string;
    summary: string;
    primary?: boolean;
    accessRole: string;
  }>;
}

export interface GoogleFreeBusyResponse {
  calendars: {
    [calendarId: string]: {
      busy: Array<{
        start: string;
        end: string;
      }>;
    };
  };
}

// Form types for UI
export interface BookingFormData {
  guestName: string;
  guestEmail: string;
  guestTimezone: string;
  notes?: string;
  responses?: QuestionResponse[];
}

export interface EventTypeFormData {
  title: string;
  description?: string;
  duration: number;
  color: string;
  locationType: LocationType;
  locationValue?: string;
  bufferBefore?: number;
  bufferAfter?: number;
  minNotice?: number;
  maxAdvance?: number;
  questions?: Question[];
}

// Calendar view types
export type CalendarView = "month" | "week" | "day" | "list";

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: Booking[];
}

// Duration options
export const DURATION_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
] as const;

// Color options for event types
export const EVENT_COLORS = [
  { value: "#3b82f6", label: "Blue" },
  { value: "#10b981", label: "Green" },
  { value: "#f59e0b", label: "Yellow" },
  { value: "#ef4444", label: "Red" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#ec4899", label: "Pink" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#f97316", label: "Orange" },
] as const;

// Day names
export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
