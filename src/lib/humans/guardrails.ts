// Humans App Guardrails
// Responsible use detection and filtering

import type { GuardrailResult, GuardrailViolation, SearchResult } from './types';

// Re-export types used by consumers
export type { GuardrailResult, GuardrailViolation } from './types';

// ============================================================================
// Query Risk Detection
// ============================================================================

const RISKY_PATTERNS = {
  home_address: [
    /where\s+(does|do)\s+\w+\s+live/i,
    /home\s+address/i,
    /residential\s+address/i,
    /find\s+where\s+\w+\s+lives/i,
    /their\s+house/i,
    /their\s+home/i,
    /what\s+street/i,
    /apartment\s+number/i,
  ],
  private_phone: [
    /personal\s+phone/i,
    /cell\s+(phone\s+)?number/i,
    /mobile\s+number/i,
    /private\s+number/i,
    /phone\s+number\s+of/i,
    /call\s+\w+\s+directly/i,
  ],
  personal_email: [
    /personal\s+email/i,
    /private\s+email/i,
    /gmail\s+address/i,
    /non.?work\s+email/i,
  ],
  stalking_intent: [
    /track\s+\w+/i,
    /follow\s+\w+/i,
    /spy\s+on/i,
    /watch\s+\w+/i,
    /monitor\s+\w+/i,
    /keep\s+tabs/i,
    /find\s+out\s+everything/i,
    /locate\s+\w+\s+without/i,
  ],
  surveillance: [
    /daily\s+routine/i,
    /schedule\s+of/i,
    /when\s+(does|do)\s+\w+\s+(leave|arrive)/i,
    /whereabouts/i,
    /movements/i,
    /track\s+location/i,
  ],
  private_individual: [
    /ex.?(girlfriend|boyfriend|wife|husband|partner)/i,
    /my\s+neighbor/i,
    /someone\s+who\s+blocked\s+me/i,
    /find\s+my\s+birth/i,
    /family\s+member/i,
    /estranged/i,
  ],
};

const SAFE_ALTERNATIVE_MAP: Record<GuardrailViolation, string> = {
  home_address: 'Search for their public professional profile or work location instead.',
  private_phone: 'Search for their public work contact or company contact page.',
  personal_email: 'Search for their professional work email through their company.',
  stalking_intent: 'Search for their public professional profile on LinkedIn or similar platforms.',
  surveillance: 'Search for their public work information or professional background.',
  private_individual: 'For professional networking, search for public work profiles only.',
};

/**
 * Check a search query for potential misuse patterns
 */
export function checkQuerySafety(query: string): GuardrailResult {
  const violations: GuardrailViolation[] = [];

  for (const [violationType, patterns] of Object.entries(RISKY_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(query)) {
        violations.push(violationType as GuardrailViolation);
        break; // Only add each violation type once
      }
    }
  }

  if (violations.length === 0) {
    return { safe: true, violations: [] };
  }

  // Get the primary violation for the message
  const primaryViolation = violations[0];
  const safeAlternative = SAFE_ALTERNATIVE_MAP[primaryViolation];

  const messages: Record<GuardrailViolation, string> = {
    home_address: 'Humans cannot search for private residential information.',
    private_phone: 'Humans cannot search for private phone numbers.',
    personal_email: 'Humans cannot search for personal email addresses.',
    stalking_intent: 'This search pattern suggests concerning intent. Humans is for professional networking only.',
    surveillance: 'Humans cannot be used to track or monitor individuals.',
    private_individual: 'Humans is designed for professional searches, not personal relationships.',
  };

  return {
    safe: false,
    violations,
    message: messages[primaryViolation],
    safeAlternative,
  };
}

// ============================================================================
// Result Filtering
// ============================================================================

const SENSITIVE_DATA_PATTERNS = {
  phone: [
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, // US phone
    /\b\+\d{1,3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/, // International
  ],
  personalEmail: [
    /@gmail\.com/i,
    /@yahoo\.com/i,
    /@hotmail\.com/i,
    /@outlook\.com/i,
    /@icloud\.com/i,
    /@aol\.com/i,
    /@protonmail\.com/i,
  ],
  address: [
    /\b\d+\s+\w+\s+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|court|ct|way|place|pl)\b/i,
    /\bapt\.?\s*#?\s*\d+/i,
    /\bunit\s*#?\s*\d+/i,
  ],
  ssn: [
    /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/, // SSN pattern
  ],
};

/**
 * Filter sensitive information from a text snippet
 */
export function filterSensitiveData(text: string): string {
  let filtered = text;

  // Replace phone numbers
  for (const pattern of SENSITIVE_DATA_PATTERNS.phone) {
    filtered = filtered.replace(pattern, '[phone redacted]');
  }

  // Replace personal email addresses (but keep work emails)
  for (const pattern of SENSITIVE_DATA_PATTERNS.personalEmail) {
    filtered = filtered.replace(
      new RegExp(`[a-zA-Z0-9._%+-]+${pattern.source}`, 'gi'),
      '[personal email redacted]'
    );
  }

  // Replace potential addresses
  for (const pattern of SENSITIVE_DATA_PATTERNS.address) {
    filtered = filtered.replace(pattern, '[address redacted]');
  }

  // Replace SSN-like patterns
  for (const pattern of SENSITIVE_DATA_PATTERNS.ssn) {
    filtered = filtered.replace(pattern, '[redacted]');
  }

  return filtered;
}

/**
 * Check if a URL is from a professional/work context
 */
export function isProfessionalSource(url: string): boolean {
  const professionalDomains = [
    'linkedin.com',
    'github.com',
    'twitter.com',
    'x.com',
    'medium.com',
    'dev.to',
    'stackoverflow.com',
    'behance.net',
    'dribbble.com',
    'angel.co',
    'wellfound.com',
    'crunchbase.com',
    'about.me',
    'substack.com',
    'youtube.com',
    'speakerdeck.com',
    'slideshare.net',
  ];

  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return professionalDomains.some(domain =>
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Filter and clean search results
 */
export function sanitizeSearchResults(results: SearchResult[]): SearchResult[] {
  return results.map(result => ({
    ...result,
    snippet: filterSensitiveData(result.snippet),
    // Prioritize professional sources
    confidence: isProfessionalSource(result.sourceUrl)
      ? result.confidence
      : (result.confidence === 'high' ? 'medium' : result.confidence),
  }));
}

// ============================================================================
// Export Safety Warning
// ============================================================================

export const RESPONSIBLE_USE_NOTE = `Humans searches public professional information only.
Use responsibly for legitimate purposes like recruiting, collaboration, and networking.`;

export const RESPONSIBLE_USE_SHORT = 'For professional networking only. No private data.';
