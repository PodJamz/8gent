/**
 * Tests for scheduling/utils.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDateString,
  parseDateString,
  formatTimeFromMinutes,
  parseTimeToMinutes,
  formatDate,
  formatTime,
  formatDateTime,
  formatDuration,
  getRelativeTime,
  getUserTimezone,
  formatTimezone,
  getDayName,
  getCalendarDates,
  getWeekDates,
  isSameDay,
  isToday,
  isPast,
  getDayBounds,
  createDefaultSchedule,
  mergeTimeSlots,
  generateTimeOptions,
  toTimezone,
  getBookingLink,
  copyToClipboard,
  isValidEmail,
  generateId,
  DAY_NAMES,
  DAY_NAMES_SHORT,
} from '../utils';
import { TimeSlot } from '../types';

describe('scheduling/utils', () => {
  describe('formatDateString', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date(2024, 5, 15); // June 15, 2024
      const result = formatDateString(date);
      expect(result).toBe('2024-06-15');
    });

    it('should pad single digit months', () => {
      const date = new Date(2024, 0, 15); // January
      const result = formatDateString(date);
      expect(result).toBe('2024-01-15');
    });

    it('should pad single digit days', () => {
      const date = new Date(2024, 5, 5);
      const result = formatDateString(date);
      expect(result).toBe('2024-06-05');
    });
  });

  describe('parseDateString', () => {
    it('should parse YYYY-MM-DD to Date', () => {
      const result = parseDateString('2024-06-15');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(5); // June is month 5 (0-indexed)
      expect(result.getDate()).toBe(15);
    });

    it('should handle first day of month', () => {
      const result = parseDateString('2024-01-01');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });

    it('should handle last day of month', () => {
      const result = parseDateString('2024-12-31');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(11);
      expect(result.getDate()).toBe(31);
    });
  });

  describe('formatTimeFromMinutes', () => {
    it('should format 0 minutes as 00:00', () => {
      expect(formatTimeFromMinutes(0)).toBe('00:00');
    });

    it('should format morning time', () => {
      expect(formatTimeFromMinutes(540)).toBe('09:00'); // 9 AM
    });

    it('should format afternoon time', () => {
      expect(formatTimeFromMinutes(840)).toBe('14:00'); // 2 PM
    });

    it('should format time with minutes', () => {
      expect(formatTimeFromMinutes(570)).toBe('09:30');
    });

    it('should format midnight', () => {
      expect(formatTimeFromMinutes(1440)).toBe('24:00');
    });

    it('should pad single digit hours', () => {
      expect(formatTimeFromMinutes(60)).toBe('01:00');
    });
  });

  describe('parseTimeToMinutes', () => {
    it('should parse 00:00 to 0 minutes', () => {
      expect(parseTimeToMinutes('00:00')).toBe(0);
    });

    it('should parse 09:00 to 540 minutes', () => {
      expect(parseTimeToMinutes('09:00')).toBe(540);
    });

    it('should parse 14:30 to 870 minutes', () => {
      expect(parseTimeToMinutes('14:30')).toBe(870);
    });

    it('should parse 23:59', () => {
      expect(parseTimeToMinutes('23:59')).toBe(1439);
    });
  });

  describe('formatDate', () => {
    it('should format timestamp to readable date', () => {
      const timestamp = new Date('2024-06-15').getTime();
      const result = formatDate(timestamp);
      expect(result).toContain('2024');
      expect(result).toContain('June');
      expect(result).toContain('15');
    });

    it('should accept custom options', () => {
      const timestamp = new Date('2024-06-15').getTime();
      const result = formatDate(timestamp, { weekday: 'short', month: 'short' });
      expect(result).toBeTruthy();
    });
  });

  describe('formatTime', () => {
    it('should format timestamp to readable time', () => {
      const timestamp = new Date('2024-06-15T14:30:00').getTime();
      const result = formatTime(timestamp);
      expect(result).toBeTruthy();
    });

    it('should accept timezone parameter', () => {
      const timestamp = new Date('2024-06-15T14:30:00Z').getTime();
      const result = formatTime(timestamp, 'America/New_York');
      expect(result).toBeTruthy();
    });
  });

  describe('formatDateTime', () => {
    it('should format timestamp to date and time', () => {
      const timestamp = new Date('2024-06-15T14:30:00').getTime();
      const result = formatDateTime(timestamp);
      expect(result).toBeTruthy();
    });

    it('should accept timezone parameter', () => {
      const timestamp = new Date('2024-06-15T14:30:00Z').getTime();
      const result = formatDateTime(timestamp, 'Europe/London');
      expect(result).toBeTruthy();
    });
  });

  describe('formatDuration', () => {
    it('should format minutes under 60', () => {
      expect(formatDuration(30)).toBe('30 min');
      expect(formatDuration(45)).toBe('45 min');
    });

    it('should format exactly 1 hour', () => {
      expect(formatDuration(60)).toBe('1 hour');
    });

    it('should format multiple hours', () => {
      expect(formatDuration(120)).toBe('2 hours');
    });

    it('should format hours with minutes', () => {
      expect(formatDuration(90)).toBe('1h 30m');
      expect(formatDuration(150)).toBe('2h 30m');
    });
  });

  describe('getRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-15T12:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "Past" for past timestamps', () => {
      const pastTime = new Date('2024-06-14T12:00:00').getTime();
      expect(getRelativeTime(pastTime)).toBe('Past');
    });

    it('should return minutes for near future', () => {
      const future = Date.now() + 30 * 60000; // 30 minutes
      expect(getRelativeTime(future)).toBe('in 30 min');
    });

    it('should return hours for same day', () => {
      const future = Date.now() + 3 * 3600000; // 3 hours
      expect(getRelativeTime(future)).toBe('in 3 hours');
    });

    it('should return "Tomorrow" for next day', () => {
      const tomorrow = Date.now() + 26 * 3600000; // ~26 hours
      expect(getRelativeTime(tomorrow)).toBe('Tomorrow');
    });

    it('should return days for near future', () => {
      const future = Date.now() + 4 * 86400000; // 4 days
      expect(getRelativeTime(future)).toBe('in 4 days');
    });

    it('should return formatted date for far future', () => {
      const future = Date.now() + 14 * 86400000; // 14 days
      const result = getRelativeTime(future);
      // Should return a date format
      expect(result).not.toContain('in');
    });

    it('should handle singular hour', () => {
      const future = Date.now() + 1 * 3600000 + 1000; // just over 1 hour
      expect(getRelativeTime(future)).toBe('in 1 hour');
    });
  });

  describe('getUserTimezone', () => {
    it('should return a timezone string', () => {
      const tz = getUserTimezone();
      expect(typeof tz).toBe('string');
      expect(tz.length).toBeGreaterThan(0);
    });
  });

  describe('formatTimezone', () => {
    it('should format valid timezone', () => {
      const result = formatTimezone('America/New_York');
      expect(result).toContain('America/New_York');
    });

    it('should handle invalid timezone gracefully', () => {
      const result = formatTimezone('Invalid/Timezone');
      expect(result).toBe('Invalid/Timezone');
    });
  });

  describe('getDayName', () => {
    it('should return full day names', () => {
      expect(getDayName(0)).toBe('Sunday');
      expect(getDayName(1)).toBe('Monday');
      expect(getDayName(6)).toBe('Saturday');
    });

    it('should return short day names', () => {
      expect(getDayName(0, true)).toBe('Sun');
      expect(getDayName(1, true)).toBe('Mon');
      expect(getDayName(6, true)).toBe('Sat');
    });
  });

  describe('getCalendarDates', () => {
    it('should return dates for a month', () => {
      const dates = getCalendarDates(2024, 5); // June 2024
      expect(dates.length).toBeGreaterThanOrEqual(28); // At least 4 weeks
      expect(dates.length).toBeLessThanOrEqual(42); // At most 6 weeks
    });

    it('should start on Sunday', () => {
      const dates = getCalendarDates(2024, 5);
      expect(dates[0].getDay()).toBe(0); // Sunday
    });

    it('should end on Saturday', () => {
      const dates = getCalendarDates(2024, 5);
      expect(dates[dates.length - 1].getDay()).toBe(6); // Saturday
    });

    it('should include days from adjacent months', () => {
      const dates = getCalendarDates(2024, 5); // June 2024
      // First day of June 2024 is Saturday, so calendar should include May days
      const hasPrevMonth = dates.some(d => d.getMonth() === 4); // May
      const hasNextMonth = dates.some(d => d.getMonth() === 6); // July
      expect(hasPrevMonth || hasNextMonth).toBe(true);
    });
  });

  describe('getWeekDates', () => {
    it('should return 7 dates', () => {
      const date = new Date('2024-06-15');
      const dates = getWeekDates(date);
      expect(dates.length).toBe(7);
    });

    it('should start on Sunday', () => {
      const date = new Date('2024-06-15'); // Saturday
      const dates = getWeekDates(date);
      expect(dates[0].getDay()).toBe(0);
    });

    it('should end on Saturday', () => {
      const date = new Date('2024-06-15');
      const dates = getWeekDates(date);
      expect(dates[6].getDay()).toBe(6);
    });

    it('should contain the input date', () => {
      const date = new Date('2024-06-15');
      const dates = getWeekDates(date);
      const hasDate = dates.some(d =>
        d.getDate() === 15 && d.getMonth() === 5 && d.getFullYear() === 2024
      );
      expect(hasDate).toBe(true);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date('2024-06-15T10:00:00');
      const date2 = new Date('2024-06-15T20:00:00');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date('2024-06-15');
      const date2 = new Date('2024-06-16');
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should return false for different months', () => {
      const date1 = new Date('2024-06-15');
      const date2 = new Date('2024-07-15');
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should return false for different years', () => {
      const date1 = new Date('2024-06-15');
      const date2 = new Date('2023-06-15');
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('isToday', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-15T12:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return true for today', () => {
      const today = new Date('2024-06-15');
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date('2024-06-14');
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date('2024-06-16');
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe('isPast', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-15T12:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return true for past dates', () => {
      const past = new Date('2024-06-14');
      expect(isPast(past)).toBe(true);
    });

    it('should return false for today', () => {
      const today = new Date('2024-06-15');
      expect(isPast(today)).toBe(false);
    });

    it('should return false for future dates', () => {
      const future = new Date('2024-06-16');
      expect(isPast(future)).toBe(false);
    });
  });

  describe('getDayBounds', () => {
    it('should return start and end timestamps', () => {
      const date = new Date('2024-06-15T12:00:00');
      const bounds = getDayBounds(date);

      expect(bounds).toHaveProperty('start');
      expect(bounds).toHaveProperty('end');
    });

    it('should have start at midnight', () => {
      const date = new Date('2024-06-15T12:00:00');
      const bounds = getDayBounds(date);
      const startDate = new Date(bounds.start);

      expect(startDate.getHours()).toBe(0);
      expect(startDate.getMinutes()).toBe(0);
      expect(startDate.getSeconds()).toBe(0);
    });

    it('should have end at 23:59:59', () => {
      const date = new Date('2024-06-15T12:00:00');
      const bounds = getDayBounds(date);
      const endDate = new Date(bounds.end);

      expect(endDate.getHours()).toBe(23);
      expect(endDate.getMinutes()).toBe(59);
      expect(endDate.getSeconds()).toBe(59);
    });
  });

  describe('createDefaultSchedule', () => {
    it('should return 7 day schedules', () => {
      const schedule = createDefaultSchedule();
      expect(schedule.length).toBe(7);
    });

    it('should have weekdays available', () => {
      const schedule = createDefaultSchedule();
      // Monday through Friday (1-5)
      expect(schedule[1].isAvailable).toBe(true);
      expect(schedule[2].isAvailable).toBe(true);
      expect(schedule[3].isAvailable).toBe(true);
      expect(schedule[4].isAvailable).toBe(true);
      expect(schedule[5].isAvailable).toBe(true);
    });

    it('should have weekends unavailable', () => {
      const schedule = createDefaultSchedule();
      expect(schedule[0].isAvailable).toBe(false); // Sunday
      expect(schedule[6].isAvailable).toBe(false); // Saturday
    });

    it('should have 9-5 slots for weekdays', () => {
      const schedule = createDefaultSchedule();
      const monday = schedule[1];
      expect(monday.slots.length).toBe(1);
      expect(monday.slots[0].start).toBe('09:00');
      expect(monday.slots[0].end).toBe('17:00');
    });

    it('should have empty slots for weekends', () => {
      const schedule = createDefaultSchedule();
      expect(schedule[0].slots.length).toBe(0);
      expect(schedule[6].slots.length).toBe(0);
    });
  });

  describe('mergeTimeSlots', () => {
    it('should return empty array for empty input', () => {
      expect(mergeTimeSlots([])).toEqual([]);
    });

    it('should not merge non-overlapping slots', () => {
      const slots: TimeSlot[] = [
        { start: '09:00', end: '10:00' },
        { start: '11:00', end: '12:00' },
      ];
      const merged = mergeTimeSlots(slots);
      expect(merged.length).toBe(2);
    });

    it('should merge overlapping slots', () => {
      const slots: TimeSlot[] = [
        { start: '09:00', end: '11:00' },
        { start: '10:00', end: '12:00' },
      ];
      const merged = mergeTimeSlots(slots);
      expect(merged.length).toBe(1);
      expect(merged[0].start).toBe('09:00');
      expect(merged[0].end).toBe('12:00');
    });

    it('should merge adjacent slots', () => {
      const slots: TimeSlot[] = [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
      ];
      const merged = mergeTimeSlots(slots);
      expect(merged.length).toBe(1);
      expect(merged[0].start).toBe('09:00');
      expect(merged[0].end).toBe('11:00');
    });

    it('should handle unordered slots', () => {
      const slots: TimeSlot[] = [
        { start: '14:00', end: '16:00' },
        { start: '09:00', end: '11:00' },
        { start: '10:00', end: '12:00' },
      ];
      const merged = mergeTimeSlots(slots);
      expect(merged.length).toBe(2);
    });

    it('should handle contained slots', () => {
      const slots: TimeSlot[] = [
        { start: '09:00', end: '17:00' },
        { start: '10:00', end: '12:00' }, // Fully contained
      ];
      const merged = mergeTimeSlots(slots);
      expect(merged.length).toBe(1);
      expect(merged[0].start).toBe('09:00');
      expect(merged[0].end).toBe('17:00');
    });
  });

  describe('generateTimeOptions', () => {
    it('should generate options at 30 min intervals by default', () => {
      const options = generateTimeOptions();
      // 24 hours * 2 = 48 options
      expect(options.length).toBe(48);
    });

    it('should respect start hour', () => {
      const options = generateTimeOptions(9);
      expect(options[0].value).toBe('09:00');
    });

    it('should respect end hour', () => {
      const options = generateTimeOptions(9, 12);
      // 3 hours * 2 = 6 options
      expect(options.length).toBe(6);
    });

    it('should respect custom interval', () => {
      const options = generateTimeOptions(9, 10, 15);
      // 1 hour / 15 min = 4 options
      expect(options.length).toBe(4);
    });

    it('should have value and label properties', () => {
      const options = generateTimeOptions(9, 10);
      options.forEach(opt => {
        expect(opt).toHaveProperty('value');
        expect(opt).toHaveProperty('label');
      });
    });
  });

  describe('toTimezone', () => {
    it('should convert timestamp to timezone-aware date', () => {
      const timestamp = new Date('2024-06-15T12:00:00Z').getTime();
      const result = toTimezone(timestamp, 'America/New_York');
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('getBookingLink', () => {
    it('should generate booking link', () => {
      const link = getBookingLink('james', '30-min-call');
      expect(link).toContain('/book/james/30-min-call');
    });

    it('should include username and event slug', () => {
      const link = getBookingLink('user', 'event');
      expect(link).toContain('user');
      expect(link).toContain('event');
      expect(link).toContain('/book/');
    });
  });

  describe('copyToClipboard', () => {
    it('should attempt to copy text', async () => {
      // The function should return a boolean indicating success/failure
      // In test environment, it may fail but should still return false gracefully
      const result = await copyToClipboard('test text');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.org')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('no@domain')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user name@example.com')).toBe(false);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate string IDs', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe('DAY_NAMES exports', () => {
    it('should export DAY_NAMES array', () => {
      expect(DAY_NAMES).toBeDefined();
      expect(DAY_NAMES.length).toBe(7);
      expect(DAY_NAMES[0]).toBe('Sunday');
    });

    it('should export DAY_NAMES_SHORT array', () => {
      expect(DAY_NAMES_SHORT).toBeDefined();
      expect(DAY_NAMES_SHORT.length).toBe(7);
      expect(DAY_NAMES_SHORT[0]).toBe('Sun');
    });
  });
});
