/**
 * Scheduling Utilities
 *
 * Helper functions for date/time handling and formatting.
 */

import { DAY_NAMES, DAY_NAMES_SHORT, type DaySchedule, type TimeSlot } from "./types";

// Re-export constants for convenience
export { DAY_NAMES, DAY_NAMES_SHORT };

/**
 * Format a date to "YYYY-MM-DD" string
 */
export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse "YYYY-MM-DD" string to Date
 */
export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format time string from minutes
 */
export function formatTimeFromMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

/**
 * Parse "HH:mm" string to minutes from midnight
 */
export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Format timestamp to human-readable date
 */
export function formatDate(timestamp: number, options?: Intl.DateTimeFormatOptions): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

/**
 * Format timestamp to human-readable time
 */
export function formatTime(timestamp: number, timezone?: string): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    ...(timezone && { timeZone: timezone }),
  });
}

/**
 * Format timestamp to human-readable date and time
 */
export function formatDateTime(timestamp: number, timezone?: string): string {
  return new Date(timestamp).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    ...(timezone && { timeZone: timezone }),
  });
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }
  return `${hours}h ${mins}m`;
}

/**
 * Get relative time string (e.g., "in 2 hours", "tomorrow")
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = timestamp - now;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (diff < 0) {
    return "Past";
  }

  if (minutes < 60) {
    return `in ${minutes} min`;
  }

  if (hours < 24) {
    return `in ${hours} hour${hours === 1 ? "" : "s"}`;
  }

  if (days === 1) {
    return "Tomorrow";
  }

  if (days < 7) {
    return `in ${days} days`;
  }

  return formatDate(timestamp, { weekday: undefined, year: undefined });
}

/**
 * Get user's timezone
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Format timezone for display
 */
export function formatTimezone(timezone: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(now);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart ? `${timezone} (${tzPart.value})` : timezone;
  } catch {
    return timezone;
  }
}

/**
 * Get day name from day of week number
 */
export function getDayName(dayOfWeek: number, short = false): string {
  return short ? DAY_NAMES_SHORT[dayOfWeek] : DAY_NAMES[dayOfWeek];
}

/**
 * Generate dates for a calendar month view
 */
export function getCalendarDates(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Start from the Sunday of the first week
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  // End at the Saturday of the last week
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

  const dates: Date[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Generate dates for a week view
 */
export function getWeekDates(date: Date): Date[] {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    dates.push(d);
  }

  return dates;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Get start and end of day timestamps
 */
export function getDayBounds(date: Date): { start: number; end: number } {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start: start.getTime(), end: end.getTime() };
}

/**
 * Create default availability schedule (9-5 weekdays)
 */
export function createDefaultSchedule(): DaySchedule[] {
  return [
    { dayOfWeek: 0, isAvailable: false, slots: [] },
    { dayOfWeek: 1, isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
    { dayOfWeek: 2, isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
    { dayOfWeek: 3, isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
    { dayOfWeek: 4, isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
    { dayOfWeek: 5, isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
    { dayOfWeek: 6, isAvailable: false, slots: [] },
  ];
}

/**
 * Merge overlapping time slots
 */
export function mergeTimeSlots(slots: TimeSlot[]): TimeSlot[] {
  if (slots.length === 0) return [];

  // Sort by start time
  const sorted = [...slots].sort((a, b) =>
    parseTimeToMinutes(a.start) - parseTimeToMinutes(b.start)
  );

  const merged: TimeSlot[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    const lastEnd = parseTimeToMinutes(last.end);
    const currentStart = parseTimeToMinutes(current.start);

    if (currentStart <= lastEnd) {
      // Overlapping, merge
      const currentEnd = parseTimeToMinutes(current.end);
      if (currentEnd > lastEnd) {
        last.end = current.end;
      }
    } else {
      // No overlap, add new slot
      merged.push(current);
    }
  }

  return merged;
}

/**
 * Generate time slot options for select inputs
 */
export function generateTimeOptions(
  startHour = 0,
  endHour = 24,
  intervalMinutes = 30
): Array<{ value: string; label: string }> {
  const options: Array<{ value: string; label: string }> = [];

  for (let minutes = startHour * 60; minutes < endHour * 60; minutes += intervalMinutes) {
    const time = formatTimeFromMinutes(minutes);
    const label = formatTime(new Date().setHours(0, minutes, 0, 0));
    options.push({ value: time, label });
  }

  return options;
}

/**
 * Convert timestamp to timezone-aware Date
 */
export function toTimezone(timestamp: number, timezone: string): Date {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const parts = new Intl.DateTimeFormat("en-CA", options).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "0";

  return new Date(
    parseInt(get("year")),
    parseInt(get("month")) - 1,
    parseInt(get("day")),
    parseInt(get("hour")),
    parseInt(get("minute")),
    parseInt(get("second"))
  );
}

/**
 * Get booking link URL
 */
export function getBookingLink(username: string, eventSlug: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/book/${username}/${eventSlug}`;
  }
  return `/book/${username}/${eventSlug}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}
