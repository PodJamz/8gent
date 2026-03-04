// Humans App Types
// People search and shortlist management

// ============================================================================
// Search Types
// ============================================================================

export type SearchIntent =
  | 'collaborator'
  | 'hire'
  | 'expert'
  | 'founder_investor'
  | 'specific_person';

export const INTENT_LABELS: Record<SearchIntent, string> = {
  collaborator: 'Find a collaborator',
  hire: 'Find a hire',
  expert: 'Find an expert',
  founder_investor: 'Find a founder or investor',
  specific_person: 'Find a specific person',
};

export const INTENT_DESCRIPTIONS: Record<SearchIntent, string> = {
  collaborator: 'Partners, co-founders, or teammates for projects',
  hire: 'Candidates for a role at your company',
  expert: 'Specialists, consultants, or advisors',
  founder_investor: 'Startup founders or VCs for partnerships',
  specific_person: 'Look up someone by name',
};

export type SeniorityLevel =
  | 'entry'
  | 'mid'
  | 'senior'
  | 'lead'
  | 'director'
  | 'vp'
  | 'c_level'
  | 'any';

export const SENIORITY_LABELS: Record<SeniorityLevel, string> = {
  entry: 'Entry level',
  mid: 'Mid level',
  senior: 'Senior',
  lead: 'Lead / Principal',
  director: 'Director',
  vp: 'VP',
  c_level: 'C-Level / Executive',
  any: 'Any level',
};

export interface SearchQuery {
  intent: SearchIntent;
  role: string;
  location?: string;
  seniority?: SeniorityLevel;
  keywords?: string;
  personName?: string; // For specific_person intent
}

export type MatchConfidence = 'high' | 'medium' | 'low';

export interface MatchEvidence {
  roleMatch?: string;
  locationMatch?: string;
  seniorityMatch?: string;
  keywordMatches?: string[];
  sourceSnippet?: string;
}

// Social links for a person - key differentiator from LinkedIn recruiting tools
export interface SocialLinks {
  linkedin?: string;
  x?: string; // Twitter/X handle or URL
  github?: string;
  email?: string; // Work email only (not personal)
  website?: string;
  other?: string[];
}

export interface SearchResult {
  id: string;
  name: string;
  title?: string;
  company?: string;
  location?: string;
  snippet: string;
  sourceUrl: string;
  sourceDomain: string;
  confidence: MatchConfidence;
  evidence: MatchEvidence;
  profileImageUrl?: string;
  socialLinks: SocialLinks; // Direct access to all social profiles
}

// ============================================================================
// Shortlist Types
// ============================================================================

export type ShortlistTag =
  | 'collab'
  | 'hire'
  | 'investor'
  | 'expert'
  | 'speaker'
  | 'custom';

export const TAG_LABELS: Record<ShortlistTag, string> = {
  collab: 'Collaborator',
  hire: 'Hire',
  investor: 'Investor',
  expert: 'Expert',
  speaker: 'Speaker',
  custom: 'Custom',
};

export const TAG_COLORS: Record<ShortlistTag, string> = {
  collab: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  hire: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  investor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  expert: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  speaker: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  custom: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export interface ShortlistItem {
  id: string;
  personId: string; // Reference to search result
  name: string;
  title?: string;
  company?: string;
  location?: string;
  links: string[];
  snippet: string;
  addedAt: number;
  tags: ShortlistTag[];
  notes: string;
  customTags?: string[];
  socialLinks?: SocialLinks; // LinkedIn, X, email, etc.
}

// ============================================================================
// Ralph Mode Types
// ============================================================================

export type RalphIterationAction =
  | 'rewrite_query'
  | 'add_filters'
  | 'expand_synonyms'
  | 'fetch_more'
  | 'rerank';

export interface RalphIteration {
  iteration: number;
  action: RalphIterationAction;
  description: string;
  queryModification?: Partial<SearchQuery>;
  resultsCount: number;
  strongMatches: number;
}

export type RalphStopReason =
  | 'strong_matches_found'
  | 'max_iterations'
  | 'user_cancelled'
  | 'quota_protection';

export interface RalphModeState {
  active: boolean;
  currentIteration: number;
  maxIterations: number;
  targetStrongMatches: number;
  iterations: RalphIteration[];
  stopReason?: RalphStopReason;
}

// ============================================================================
// Search History Types
// ============================================================================

export interface SavedSearch {
  id: string;
  query: SearchQuery;
  resultsCount: number;
  createdAt: number;
  shortlistCount: number;
}

// ============================================================================
// Provider Types
// ============================================================================

export interface SearchProviderResult {
  id: string;
  url: string;
  title: string;
  snippet: string;
  publishedDate?: string;
  author?: string;
}

export interface SearchProvider {
  name: string;
  search: (query: string, options?: SearchProviderOptions) => Promise<SearchProviderResult[]>;
  available: boolean;
}

export interface SearchProviderOptions {
  category?: 'people' | 'general';
  includeText?: boolean;
  numResults?: number;
  filters?: {
    site?: string;
    startPublishedDate?: string;
    endPublishedDate?: string;
  };
}

// ============================================================================
// Guardrails Types
// ============================================================================

export type GuardrailViolation =
  | 'home_address'
  | 'private_phone'
  | 'personal_email'
  | 'stalking_intent'
  | 'surveillance'
  | 'private_individual';

export interface GuardrailResult {
  safe: boolean;
  violations: GuardrailViolation[];
  message?: string;
  safeAlternative?: string;
}
