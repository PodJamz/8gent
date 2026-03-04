/**
 * Tests for lib/utils.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, getUserLocale, formatLocalDate, formatLocalTime, formatLocalDateTime, formatDate } from '../utils';

describe('utils', () => {
  describe('cn (className merge)', () => {
    it('should merge simple class names', () => {
      const result = cn('foo', 'bar');
      expect(result).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'included', false && 'excluded');
      expect(result).toBe('base included');
    });

    it('should filter falsy values', () => {
      const result = cn('base', null, undefined, '', 'valid');
      expect(result).toBe('base valid');
    });

    it('should handle array of classes', () => {
      const result = cn(['foo', 'bar']);
      expect(result).toBe('foo bar');
    });

    it('should handle object syntax', () => {
      const result = cn({ foo: true, bar: false, baz: true });
      expect(result).toBe('foo baz');
    });

    it('should merge conflicting tailwind classes', () => {
      const result = cn('p-4', 'p-8');
      expect(result).toBe('p-8');
    });

    it('should keep non-conflicting tailwind classes', () => {
      const result = cn('p-4', 'm-4');
      expect(result).toBe('p-4 m-4');
    });

    it('should handle complex tailwind merges', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500');
    });

    it('should merge multiple conflicting properties', () => {
      const result = cn('px-4 py-2', 'px-8');
      expect(result).toBe('py-2 px-8');
    });

    it('should handle empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle mixed inputs', () => {
      const result = cn(
        'base',
        ['arr1', 'arr2'],
        { obj: true },
        undefined,
        'final'
      );
      expect(result).toContain('base');
      expect(result).toContain('arr1');
      expect(result).toContain('obj');
      expect(result).toContain('final');
    });
  });

  describe('getUserLocale', () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      // Restore original navigator
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('should return navigator.language when available', () => {
      Object.defineProperty(global, 'navigator', {
        value: { language: 'fr-FR', languages: ['fr-FR', 'en-US'] },
        writable: true,
      });

      const locale = getUserLocale();
      expect(locale).toBe('fr-FR');
    });

    it('should fallback to navigator.languages[0]', () => {
      Object.defineProperty(global, 'navigator', {
        value: { language: '', languages: ['de-DE', 'en-US'] },
        writable: true,
      });

      const locale = getUserLocale();
      // When language is empty string, it's falsy so should use languages[0]
      expect(locale).toBe('de-DE');
    });

    it('should fallback to en-US on server', () => {
      Object.defineProperty(global, 'navigator', {
        value: undefined,
        writable: true,
      });

      const locale = getUserLocale();
      expect(locale).toBe('en-US');
    });
  });

  describe('formatLocalDate', () => {
    it('should format Date object', () => {
      const date = new Date('2024-06-15');
      const result = formatLocalDate(date);
      expect(result).toContain('2024');
    });

    it('should format date string', () => {
      const result = formatLocalDate('2024-06-15');
      expect(result).toBeTruthy();
    });

    it('should format timestamp number', () => {
      const timestamp = new Date('2024-06-15').getTime();
      const result = formatLocalDate(timestamp);
      expect(result).toBeTruthy();
    });

    it('should accept formatting options', () => {
      const date = new Date('2024-06-15');
      const result = formatLocalDate(date, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      expect(result).toBeTruthy();
    });
  });

  describe('formatLocalTime', () => {
    it('should format time from Date object', () => {
      const date = new Date('2024-06-15T14:30:00');
      const result = formatLocalTime(date);
      expect(result).toBeTruthy();
    });

    it('should format time from string', () => {
      const result = formatLocalTime('2024-06-15T14:30:00');
      expect(result).toBeTruthy();
    });

    it('should format time from timestamp', () => {
      const timestamp = new Date('2024-06-15T14:30:00').getTime();
      const result = formatLocalTime(timestamp);
      expect(result).toBeTruthy();
    });

    it('should accept formatting options', () => {
      const date = new Date('2024-06-15T14:30:00');
      const result = formatLocalTime(date, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      expect(result).toBeTruthy();
    });
  });

  describe('formatLocalDateTime', () => {
    it('should format date and time from Date object', () => {
      const date = new Date('2024-06-15T14:30:00');
      const result = formatLocalDateTime(date);
      expect(result).toBeTruthy();
    });

    it('should format date and time from string', () => {
      const result = formatLocalDateTime('2024-06-15T14:30:00');
      expect(result).toBeTruthy();
    });

    it('should format date and time from timestamp', () => {
      const timestamp = new Date('2024-06-15T14:30:00').getTime();
      const result = formatLocalDateTime(timestamp);
      expect(result).toBeTruthy();
    });

    it('should accept formatting options', () => {
      const date = new Date('2024-06-15T14:30:00');
      const result = formatLocalDateTime(date, {
        dateStyle: 'full',
        timeStyle: 'short',
      });
      expect(result).toBeTruthy();
    });
  });

  describe('formatDate', () => {
    beforeEach(() => {
      // Mock current date for consistent tests
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-15T12:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "Today" for today\'s date', () => {
      const result = formatDate('2024-06-15');
      expect(result).toBe('Today');
    });

    it('should show days ago for recent dates', () => {
      const result = formatDate('2024-06-12'); // 3 days ago
      expect(result).toContain('3d ago');
    });

    it('should show weeks ago for dates within a month', () => {
      const result = formatDate('2024-06-01'); // 14 days ago = 2 weeks
      expect(result).toContain('2w ago');
    });

    it('should show months ago for dates within a year', () => {
      const result = formatDate('2024-03-15'); // ~3 months ago
      expect(result).toContain('mo ago');
    });

    it('should show years ago for older dates', () => {
      const result = formatDate('2022-06-15'); // 2 years ago
      expect(result).toContain('2y ago');
    });

    it('should handle dates without time component', () => {
      const result = formatDate('2024-06-10');
      // Should not throw and should return formatted string
      expect(result).toBeTruthy();
    });

    it('should handle dates with time component', () => {
      const result = formatDate('2024-06-10T10:30:00');
      expect(result).toBeTruthy();
    });

    it('should include the full date in the result', () => {
      const result = formatDate('2024-06-12');
      // Should include month and year
      expect(result).toContain('June');
      expect(result).toContain('2024');
    });

    it('should handle edge case of 1 day ago', () => {
      const result = formatDate('2024-06-14'); // 1 day ago
      expect(result).toContain('1d ago');
    });

    it('should handle edge case of exactly 7 days ago', () => {
      const result = formatDate('2024-06-08'); // 7 days ago = 1 week
      expect(result).toContain('1w ago');
    });

    it('should handle edge case of exactly 30 days ago', () => {
      const result = formatDate('2024-05-16'); // 30 days ago = 1 month
      expect(result).toContain('1mo ago');
    });

    it('should handle edge case of exactly 365 days ago', () => {
      const result = formatDate('2023-06-15'); // 365 days ago = 1 year
      expect(result).toContain('1y ago');
    });
  });
});
