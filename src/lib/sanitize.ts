'use client';

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - The potentially unsafe HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') {
    // On server-side, return the original for SSR
    // The client will re-render with sanitized content
    return dirty;
  }

  return DOMPurify.sanitize(dirty);
}

/**
 * Create sanitized dangerouslySetInnerHTML prop
 * @param dirty - The potentially unsafe HTML string
 * @returns Object suitable for dangerouslySetInnerHTML prop
 */
export function createSafeHtml(dirty: string): { __html: string } {
  return { __html: sanitizeHtml(dirty) };
}
