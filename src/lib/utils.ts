import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the user's preferred locale or fallback to 'en-US'
 */
export function getUserLocale(): string {
  if (typeof navigator !== 'undefined') {
    return navigator.language || navigator.languages?.[0] || 'en-US';
  }
  return 'en-US';
}

/**
 * Format a date using the user's locale
 */
export function formatLocalDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString(getUserLocale(), options);
}

/**
 * Format a time using the user's locale
 */
export function formatLocalTime(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleTimeString(getUserLocale(), options);
}

/**
 * Format a date and time using the user's locale
 */
export function formatLocalDateTime(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleString(getUserLocale(), options);
}

export function formatDate(date: string) {
  let currentDate = new Date().getTime();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date).getTime();
  let timeDifference = Math.abs(currentDate - targetDate);
  let daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  let fullDate = formatLocalDate(date, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (daysAgo < 1) {
    return "Today";
  } else if (daysAgo < 7) {
    return `${fullDate} (${daysAgo}d ago)`;
  } else if (daysAgo < 30) {
    const weeksAgo = Math.floor(daysAgo / 7);
    return `${fullDate} (${weeksAgo}w ago)`;
  } else if (daysAgo < 365) {
    const monthsAgo = Math.floor(daysAgo / 30);
    return `${fullDate} (${monthsAgo}mo ago)`;
  } else {
    const yearsAgo = Math.floor(daysAgo / 365);
    return `${fullDate} (${yearsAgo}y ago)`;
  }
}
