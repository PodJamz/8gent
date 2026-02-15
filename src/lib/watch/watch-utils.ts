/**
 * Watch Utilities
 * Animation helpers and time calculations for watch faces
 */

// Get current time angles for watch hands
export function getTimeAngles(date: Date = new Date()): {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
} {
  const hours = date.getHours() % 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  // Calculate smooth angles (continuous movement)
  const secondsWithMs = seconds + milliseconds / 1000;
  const minutesWithSeconds = minutes + secondsWithMs / 60;
  const hoursWithMinutes = hours + minutesWithSeconds / 60;

  return {
    hours: hoursWithMinutes * 30, // 360° / 12 hours = 30° per hour
    minutes: minutesWithSeconds * 6, // 360° / 60 minutes = 6° per minute
    seconds: secondsWithMs * 6, // 360° / 60 seconds = 6° per second
    milliseconds: milliseconds * 0.36, // For ultra-smooth if needed
  };
}

// Convert HSL string to CSS
export function hslToCSS(hsl: string): string {
  // If already a valid CSS color, return as-is
  if (hsl.startsWith('hsl') || hsl.startsWith('rgb') || hsl.startsWith('#')) {
    return hsl;
  }
  // Convert "h s% l%" format to "hsl(h, s%, l%)"
  const parts = hsl.split(' ');
  if (parts.length >= 3) {
    return `hsl(${parts[0]}, ${parts[1]}, ${parts[2]})`;
  }
  return hsl;
}

// Convert to Roman numerals
export function toRoman(num: number): string {
  const romanNumerals: [number, string][] = [
    [12, 'XII'], [11, 'XI'], [10, 'X'], [9, 'IX'],
    [8, 'VIII'], [7, 'VII'], [6, 'VI'], [5, 'V'],
    [4, 'IV'], [3, 'III'], [2, 'II'], [1, 'I'],
  ];

  for (const [value, numeral] of romanNumerals) {
    if (num === value) return numeral;
  }
  return String(num);
}

// Generate positions around the dial
export function getPositionOnCircle(
  angle: number,
  radius: number,
  centerX: number = 50,
  centerY: number = 50
): { x: number; y: number } {
  // Convert angle to radians, offset by -90° so 0° is at 12 o'clock
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians),
  };
}

// Generate tick marks for the dial
export function generateTickMarks(
  count: number,
  majorEvery: number = 5
): Array<{ angle: number; isMajor: boolean }> {
  const marks: Array<{ angle: number; isMajor: boolean }> = [];
  for (let i = 0; i < count; i++) {
    marks.push({
      angle: (360 / count) * i,
      isMajor: i % majorEvery === 0,
    });
  }
  return marks;
}

// Format date for date window
export function formatDateWindow(date: Date = new Date()): string {
  return date.getDate().toString().padStart(2, '0');
}

// Watch size presets
export const WATCH_SIZES = {
  xs: 80,
  sm: 120,
  md: 180,
  lg: 240,
  xl: 320,
  showcase: 400,
} as const;

export type WatchSize = keyof typeof WATCH_SIZES;

// Easing functions for smooth animations
export const easings = {
  // Spring-like easing for hands
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  // Smooth deceleration
  easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
  // Linear for continuous rotation
  linear: 'linear',
};

// Calculate hand dimensions based on style
export function getHandDimensions(
  style: string,
  type: 'hour' | 'minute' | 'second'
): { length: number; width: number; tailLength: number } {
  const dimensions: Record<string, Record<string, { length: number; width: number; tailLength: number }>> = {
    dauphine: {
      hour: { length: 28, width: 4, tailLength: 8 },
      minute: { length: 38, width: 3, tailLength: 8 },
      second: { length: 38, width: 1.5, tailLength: 12 },
    },
    baton: {
      hour: { length: 26, width: 3.5, tailLength: 6 },
      minute: { length: 38, width: 2.5, tailLength: 6 },
      second: { length: 40, width: 1, tailLength: 14 },
    },
    mercedes: {
      hour: { length: 26, width: 5, tailLength: 6 },
      minute: { length: 38, width: 4, tailLength: 6 },
      second: { length: 40, width: 1.5, tailLength: 14 },
    },
    snowflake: {
      hour: { length: 26, width: 5, tailLength: 6 },
      minute: { length: 38, width: 4, tailLength: 6 },
      second: { length: 40, width: 1.5, tailLength: 14 },
    },
    sword: {
      hour: { length: 28, width: 4, tailLength: 7 },
      minute: { length: 40, width: 3, tailLength: 7 },
      second: { length: 40, width: 1.2, tailLength: 14 },
    },
    leaf: {
      hour: { length: 27, width: 5, tailLength: 7 },
      minute: { length: 38, width: 4, tailLength: 7 },
      second: { length: 38, width: 1.5, tailLength: 12 },
    },
    alpha: {
      hour: { length: 26, width: 4.5, tailLength: 8 },
      minute: { length: 38, width: 3.5, tailLength: 8 },
      second: { length: 40, width: 1, tailLength: 14 },
    },
  };

  return dimensions[style]?.[type] || dimensions.dauphine[type];
}
