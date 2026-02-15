/**
 * Server-Safe HTML Sanitization
 *
 * Provides HTML sanitization that works in both server and client contexts.
 * Uses a whitelist approach for allowed HTML tags and attributes.
 *
 * For blog/vault content from MDX files, this is defense-in-depth since
 * the content is from trusted local files processed at build time.
 */

// Allowed HTML tags (common in blog/MDX content)
const ALLOWED_TAGS = new Set([
  // Text content
  'p', 'span', 'div', 'br', 'hr',
  // Headings
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  // Lists
  'ul', 'ol', 'li',
  // Formatting
  'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'ins', 'mark',
  'small', 'sub', 'sup',
  // Links and media
  'a', 'img', 'figure', 'figcaption',
  // Code
  'pre', 'code', 'kbd', 'samp', 'var',
  // Tables
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  // Quotes and definitions
  'blockquote', 'q', 'cite', 'abbr', 'dfn',
  // Other
  'details', 'summary', 'time', 'address', 'article', 'section', 'aside',
  'header', 'footer', 'nav', 'main',
]);

// Allowed attributes per tag (or * for all tags)
const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  '*': new Set(['class', 'id', 'style', 'title', 'lang', 'dir', 'tabindex', 'role', 'aria-label', 'aria-hidden', 'aria-describedby']),
  'a': new Set(['href', 'target', 'rel', 'download']),
  'img': new Set(['src', 'alt', 'width', 'height', 'loading', 'decoding']),
  'time': new Set(['datetime']),
  'abbr': new Set(['title']),
  'td': new Set(['colspan', 'rowspan']),
  'th': new Set(['colspan', 'rowspan', 'scope']),
  'ol': new Set(['start', 'type', 'reversed']),
  'li': new Set(['value']),
  'code': new Set(['data-language', 'data-theme']),
  'pre': new Set(['data-language', 'data-theme']),
};

// Dangerous URL protocols
const DANGEROUS_PROTOCOLS = /^(javascript|vbscript|data):/i;

/**
 * Check if a URL is safe (not javascript: or other dangerous protocols)
 */
function isSafeUrl(url: string): boolean {
  if (!url) return true;
  const trimmed = url.trim().toLowerCase();
  return !DANGEROUS_PROTOCOLS.test(trimmed);
}

/**
 * Escape HTML entities in a string
 */
function escapeHtml(str: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  };
  return str.replace(/[&<>"']/g, (char) => escapeMap[char] || char);
}

/**
 * Simple HTML tag parser for server-side sanitization
 * This is a lightweight alternative to full DOM parsing
 */
function sanitizeHtmlServer(html: string): string {
  // Replace dangerous script and event handlers
  let sanitized = html
    // Remove script tags entirely
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove style tags (can contain expressions in IE)
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove on* event handlers
    .replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    // Remove javascript: URLs in href/src
    .replace(/(href|src)\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, '$1=""')
    // Remove data: URLs that could be dangerous
    .replace(/(href|src)\s*=\s*["']?\s*data:text\/html[^"'>\s]*/gi, '$1=""')
    // Remove expression() in styles (IE vulnerability)
    .replace(/expression\s*\(/gi, 'blocked(')
    // Remove -moz-binding (Firefox XBL vulnerability)
    .replace(/-moz-binding\s*:/gi, '-blocked:');

  return sanitized;
}

/**
 * Sanitize HTML content for safe rendering
 * Works in both server and client contexts
 *
 * @param dirty - The potentially unsafe HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtmlSafe(dirty: string): string {
  if (!dirty) return '';

  // Server-side sanitization
  if (typeof window === 'undefined') {
    return sanitizeHtmlServer(dirty);
  }

  // Client-side: use DOMPurify if available
  try {
    // Dynamic import to avoid bundling issues
    const DOMPurify = require('dompurify');
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: Array.from(ALLOWED_TAGS),
      ALLOWED_ATTR: [
        ...ALLOWED_ATTRIBUTES['*'],
        ...ALLOWED_ATTRIBUTES['a'],
        ...ALLOWED_ATTRIBUTES['img'],
        'datetime', 'colspan', 'rowspan', 'scope', 'start', 'type', 'reversed', 'value',
        'data-language', 'data-theme',
      ],
    });
  } catch {
    // Fallback to server-side sanitization
    return sanitizeHtmlServer(dirty);
  }
}

/**
 * Create sanitized dangerouslySetInnerHTML prop (server-safe)
 * @param dirty - The potentially unsafe HTML string
 * @returns Object suitable for dangerouslySetInnerHTML prop
 */
export function createSafeHtmlServer(dirty: string): { __html: string } {
  return { __html: sanitizeHtmlSafe(dirty) };
}
