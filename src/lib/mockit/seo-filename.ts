// SEO-optimized filename generator for Mockit exports

import type { DeviceType, ExportFormat, AnimationType } from './types';

interface FilenameOptions {
  sourceUrl: string;
  devices: DeviceType[];
  animation?: AnimationType;
  format: ExportFormat;
  timestamp?: boolean;
}

/**
 * Extracts a clean domain/brand name from a URL
 */
function extractBrandFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;

    // Remove common prefixes
    hostname = hostname.replace(/^(www\.|m\.|mobile\.|app\.)/, '');

    // Get the main domain name (e.g., 'github' from 'github.com')
    const parts = hostname.split('.');
    const domain = parts.length > 1 ? parts[parts.length - 2] : parts[0];

    // Clean and format
    return domain
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();
  } catch {
    return 'website';
  }
}

/**
 * Formats device types for filename
 */
function formatDevices(devices: DeviceType[]): string {
  if (devices.length === 0) return 'mockup';
  if (devices.length === 3) return 'responsive';
  if (devices.length === 1) return devices[0];
  return devices.join('-');
}

/**
 * Formats animation type for filename
 */
function formatAnimation(animation?: AnimationType): string {
  if (!animation || animation === 'none') return '';
  return `-${animation}`;
}

/**
 * Gets file extension for format
 */
function getExtension(format: ExportFormat): string {
  switch (format) {
    case 'gif': return 'gif';
    case 'json': return 'json';
    case 'react': return 'tsx';
    case 'png': return 'png';
    case 'webm': return 'webm';
    default: return 'png';
  }
}

/**
 * Generates an SEO-optimized filename for mockup exports
 *
 * Format: {brand}-{device-type}-mockup{-animation}.{ext}
 * Examples:
 * - github-responsive-mockup.png
 * - stripe-mobile-mockup-float.gif
 * - notion-desktop-mockup.tsx
 */
export function generateSEOFilename(options: FilenameOptions): string {
  const { sourceUrl, devices, animation, format, timestamp = false } = options;

  const brand = extractBrandFromUrl(sourceUrl);
  const deviceStr = formatDevices(devices);
  const animationStr = formatAnimation(animation);
  const extension = getExtension(format);

  // Build filename parts
  const parts = [
    brand,
    deviceStr,
    'mockup'
  ];

  // Add animation suffix if applicable
  if (animationStr) {
    parts.push(animationStr.slice(1)); // Remove leading dash
  }

  let filename = parts.join('-');

  // Add timestamp if requested (useful for avoiding conflicts)
  if (timestamp) {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    filename += `-${dateStr}`;
  }

  return `${filename}.${extension}`;
}

/**
 * Generates alt text for the mockup image (for accessibility and SEO)
 */
export function generateAltText(sourceUrl: string, devices: DeviceType[]): string {
  const brand = extractBrandFromUrl(sourceUrl);
  const brandCapitalized = brand.charAt(0).toUpperCase() + brand.slice(1);

  if (devices.length === 0) {
    return `${brandCapitalized} website mockup`;
  }

  if (devices.length === 3) {
    return `${brandCapitalized} responsive website mockup showing mobile, tablet, and desktop views`;
  }

  const deviceNames = devices.map(d => {
    switch (d) {
      case 'mobile': return 'iPhone';
      case 'tablet': return 'iPad';
      case 'desktop': return 'MacBook';
      default: return d;
    }
  });

  return `${brandCapitalized} website mockup on ${deviceNames.join(' and ')}`;
}

/**
 * Generates a title/description for the mockup (for metadata)
 */
export function generateTitle(sourceUrl: string, devices: DeviceType[]): string {
  const brand = extractBrandFromUrl(sourceUrl);
  const brandCapitalized = brand.charAt(0).toUpperCase() + brand.slice(1);

  if (devices.length === 3) {
    return `${brandCapitalized} Responsive Mockup`;
  }

  const deviceStr = formatDevices(devices);
  const deviceCapitalized = deviceStr.charAt(0).toUpperCase() + deviceStr.slice(1);

  return `${brandCapitalized} ${deviceCapitalized} Mockup`;
}
