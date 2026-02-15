/**
 * AI Threat Detection System
 *
 * JEF-inspired (Jailbreak Evaluation Framework) threat detection for AI conversations.
 * Implements pattern matching, scoring, and prevention mechanisms.
 *
 * Based on 0din.ai research methodology:
 * - Blast Radius (how many models affected)
 * - Retargetability (flexibility across subjects)
 * - Fidelity (output quality/danger)
 *
 * @see https://0din.ai/research/jailbreak_evaluation_framework
 */

import crypto from 'crypto';

// =============================================================================
// Types
// =============================================================================

export type ThreatCategory =
  | 'prompt_injection'
  | 'jailbreak'
  | 'data_exfiltration'
  | 'social_engineering'
  | 'harmful_content'
  | 'policy_violation'
  | 'encoding_bypass'
  | 'context_manipulation'
  | 'rate_abuse'
  | 'other';

export type ThreatAction =
  | 'log'
  | 'flag'
  | 'warn'
  | 'sanitize'
  | 'block'
  | 'terminate';

export type ThreatSeverity = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface ThreatPattern {
  id: string;
  name: string;
  category: ThreatCategory;
  patterns: RegExp[];
  keywords?: string[];
  baseSeverity: number; // 1-10
  action: ThreatAction;
  description: string;
}

export interface ThreatAnalysisResult {
  score: number; // 0-10 JEF-inspired score
  severity: ThreatSeverity;
  patterns: string[]; // Pattern IDs that matched
  categories: ThreatCategory[];
  confidence: number; // 0-1
  blocked: boolean;
  sanitized?: string;
  details: ThreatMatch[];
}

export interface ThreatMatch {
  patternId: string;
  patternName: string;
  category: ThreatCategory;
  match: string;
  position: number;
  severity: number;
  action: ThreatAction;
}

// =============================================================================
// Built-in Threat Patterns (Based on 0din Research)
// =============================================================================

export const THREAT_PATTERNS: ThreatPattern[] = [
  // -------------------------------------------------------------------------
  // Prompt Injection Patterns
  // -------------------------------------------------------------------------
  {
    id: 'pi_ignore_instructions',
    name: 'Ignore Instructions',
    category: 'prompt_injection',
    patterns: [
      /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions?|rules?|guidelines?|prompts?)/i,
      /disregard\s+(all\s+)?(previous|prior|above)\s+(instructions?|rules?)/i,
      /forget\s+(everything|all)\s+(you\s+)?(know|learned|were\s+told)/i,
      /your\s+(new|actual|real)\s+instructions?\s+(are|is)/i,
    ],
    baseSeverity: 8,
    action: 'block',
    description: 'Attempts to override system instructions',
  },
  {
    id: 'pi_system_override',
    name: 'System Prompt Override',
    category: 'prompt_injection',
    patterns: [
      /\[system\]|\[SYSTEM\]|<system>|<<SYS>>|\{\{system\}\}/i,
      /system\s*prompt\s*[:=]/i,
      /new\s+system\s+(message|prompt|instruction)/i,
      /you\s+are\s+now\s+in\s+(\w+)\s+mode/i,
    ],
    baseSeverity: 9,
    action: 'block',
    description: 'Attempts to inject fake system prompts',
  },
  {
    id: 'pi_developer_mode',
    name: 'Developer Mode Activation',
    category: 'prompt_injection',
    patterns: [
      /enable\s+(developer|dev|debug|admin|root|sudo)\s+mode/i,
      /activate\s+(developer|maintenance|service)\s+mode/i,
      /enter\s+(developer|debug|unrestricted)\s+mode/i,
      /developer\s+override\s+(enabled?|activate)/i,
      /bypass\s+(safety|security|content)\s+(filters?|checks?|restrictions?)/i,
    ],
    baseSeverity: 9,
    action: 'block',
    description: 'Attempts to activate fictional privileged modes',
  },

  // -------------------------------------------------------------------------
  // Jailbreak Patterns (Role-play attacks)
  // -------------------------------------------------------------------------
  {
    id: 'jb_dan',
    name: 'DAN Jailbreak',
    category: 'jailbreak',
    patterns: [
      /\bDAN\b.*?(do\s+anything\s+now|jailbreak|uncensored)/i,
      /you\s+are\s+(now\s+)?DAN/i,
      /pretend\s+(to\s+be|you\s+are)\s+DAN/i,
      /act\s+as\s+DAN/i,
    ],
    baseSeverity: 9,
    action: 'block',
    description: 'DAN (Do Anything Now) jailbreak attempt',
  },
  {
    id: 'jb_roleplay_evil',
    name: 'Evil Character Roleplay',
    category: 'jailbreak',
    patterns: [
      /pretend\s+(to\s+be|you\s+are)\s+(an?\s+)?(evil|malicious|unethical|amoral)/i,
      /roleplay\s+as\s+(an?\s+)?(villain|hacker|criminal)/i,
      /you\s+are\s+(now\s+)?(an?\s+)?(evil|dark|shadow)\s+(AI|assistant|version)/i,
      /act\s+as\s+if\s+you\s+have\s+no\s+(morals?|ethics?|restrictions?)/i,
    ],
    baseSeverity: 8,
    action: 'block',
    description: 'Attempts to roleplay as an unrestricted AI',
  },
  {
    id: 'jb_hypothetical',
    name: 'Hypothetical Scenario Bypass',
    category: 'jailbreak',
    patterns: [
      /hypothetically,?\s+(if|what\s+if)\s+you\s+(could|were\s+able\s+to|didn't\s+have)/i,
      /in\s+a\s+(fictional|hypothetical|imaginary)\s+(world|scenario|universe)/i,
      /for\s+(educational|research|academic)\s+purposes\s+only/i,
      /this\s+is\s+(just|only)\s+(fiction|a\s+story|hypothetical)/i,
      /pretend\s+this\s+is\s+a\s+(movie|novel|game)\s+script/i,
    ],
    baseSeverity: 6,
    action: 'flag',
    description: 'Uses hypothetical framing to bypass safety',
  },
  {
    id: 'jb_opposite_day',
    name: 'Opposite/Inverse Mode',
    category: 'jailbreak',
    patterns: [
      /opposite\s+(day|mode)|today\s+is\s+opposite\s+day/i,
      /respond\s+(with\s+)?the\s+opposite/i,
      /do\s+the\s+(opposite|reverse)\s+of/i,
      /inverse\s+mode\s+(enabled?|activated?)/i,
    ],
    baseSeverity: 7,
    action: 'flag',
    description: 'Attempts to invert AI behavior through opposite framing',
  },
  {
    id: 'jb_grandma_exploit',
    name: 'Grandma/Bedtime Story Exploit',
    category: 'jailbreak',
    patterns: [
      /my\s+(grandma|grandmother|nana)\s+(used\s+to|would)\s+(tell|read|say)/i,
      /pretend\s+you('re|are)\s+my\s+(grandma|grandmother)/i,
      /bedtime\s+story\s+about\s+how\s+to/i,
      /tell\s+me\s+a\s+story\s+(about|where|that\s+explains)\s+how\s+to/i,
    ],
    baseSeverity: 6,
    action: 'flag',
    description: 'Uses emotional/familial framing to extract harmful info',
  },

  // -------------------------------------------------------------------------
  // Encoding Bypass Patterns
  // -------------------------------------------------------------------------
  {
    id: 'enc_base64',
    name: 'Base64 Encoding',
    category: 'encoding_bypass',
    patterns: [
      /decode\s+(this\s+)?base64/i,
      /base64:\s*[A-Za-z0-9+/=]{20,}/,
      /aW1wb3J0|ZXhlY3V0ZQ|c3lzdGVt/i, // Common base64 fragments
    ],
    baseSeverity: 7,
    action: 'flag',
    description: 'Attempts to use Base64 encoding to bypass filters',
  },
  {
    id: 'enc_rot13',
    name: 'ROT13/Caesar Cipher',
    category: 'encoding_bypass',
    patterns: [
      /decode\s+(this\s+)?(rot13|rot-13|caesar)/i,
      /rot13\s*[:=]/i,
      /apply\s+(rot13|caesar\s+cipher)\s+to/i,
    ],
    baseSeverity: 6,
    action: 'flag',
    description: 'Attempts to use ROT13 encoding to bypass filters',
  },
  {
    id: 'enc_leetspeak',
    name: 'Leetspeak Evasion',
    category: 'encoding_bypass',
    patterns: [
      /h4ck|h@ck|hax0r|pwn|3xpl01t|1nj3ct/i,
      /ph1sh|v1rus|m4lw4r3|r00t|sh3ll/i,
      /k1ll|d34th|b0mb|w34p0n/i,
    ],
    baseSeverity: 5,
    action: 'flag',
    description: 'Uses leetspeak to evade keyword detection',
  },
  {
    id: 'enc_unicode',
    name: 'Unicode Homoglyph Attack',
    category: 'encoding_bypass',
    patterns: [
      /[\u0430\u0435\u043e\u0440\u0441\u0443\u0445]/g, // Cyrillic lookalikes
      /[\u202e\u200f\u200e]/, // RTL/LTR override characters
      /[\uff00-\uffef]/, // Fullwidth characters
    ],
    baseSeverity: 7,
    action: 'flag',
    description: 'Uses Unicode homoglyphs to bypass filters',
  },

  // -------------------------------------------------------------------------
  // Context Manipulation
  // -------------------------------------------------------------------------
  {
    id: 'ctx_system_extraction',
    name: 'System Prompt Extraction',
    category: 'context_manipulation',
    patterns: [
      /what\s+(are|is)\s+your\s+(system\s+)?(prompt|instructions?|rules?|guidelines?)/i,
      /show\s+me\s+your\s+(initial|original|system)\s+(prompt|instructions?)/i,
      /repeat\s+(your\s+)?(system\s+)?(prompt|instructions?)\s+(back|verbatim|exactly)/i,
      /print\s+(your\s+)?(system|initial)\s+(prompt|message)/i,
      /what\s+were\s+you\s+told\s+(before|initially|at\s+the\s+start)/i,
    ],
    baseSeverity: 6,
    action: 'flag',
    description: 'Attempts to extract system prompt',
  },
  {
    id: 'ctx_context_overflow',
    name: 'Context Window Attack',
    category: 'context_manipulation',
    patterns: [
      /(.{500,})\1{3,}/, // Repeated long strings
      /\b(repeat|say|print)\s+.{1,20}\s+\d{3,}\s+times/i,
      /fill\s+the\s+context\s+(window|buffer)/i,
    ],
    baseSeverity: 7,
    action: 'block',
    description: 'Attempts to overflow context window',
  },

  // -------------------------------------------------------------------------
  // Data Exfiltration
  // -------------------------------------------------------------------------
  {
    id: 'exf_training_data',
    name: 'Training Data Extraction',
    category: 'data_exfiltration',
    patterns: [
      /what\s+(data|information)\s+were\s+you\s+trained\s+on/i,
      /show\s+me\s+(your\s+)?training\s+(data|examples?)/i,
      /repeat\s+(your\s+)?training\s+(data|examples?)/i,
      /extract\s+(your\s+)?training\s+data/i,
    ],
    baseSeverity: 5,
    action: 'flag',
    description: 'Attempts to extract training data',
  },
  {
    id: 'exf_pii',
    name: 'PII Extraction',
    category: 'data_exfiltration',
    patterns: [
      /what\s+(other\s+)?users?\s+(have\s+)?(said|asked|told\s+you)/i,
      /show\s+me\s+(other\s+)?users?\s+(conversations?|messages?|data)/i,
      /what\s+do\s+you\s+know\s+about\s+(other\s+)?users?/i,
    ],
    baseSeverity: 8,
    action: 'block',
    description: 'Attempts to extract other users data',
  },

  // -------------------------------------------------------------------------
  // Harmful Content Requests
  // -------------------------------------------------------------------------
  {
    id: 'harm_weapons',
    name: 'Weapons/Explosives',
    category: 'harmful_content',
    patterns: [
      /how\s+to\s+(make|build|create|construct)\s+(a\s+)?(bomb|explosive|weapon)/i,
      /(instructions?|guide|tutorial)\s+(for|to|on)\s+(making|building)\s+(a\s+)?(bomb|weapon)/i,
      /synthesize?\s+(explosives?|weapons?)/i,
    ],
    baseSeverity: 10,
    action: 'block',
    description: 'Requests for weapons/explosives information',
  },
  {
    id: 'harm_drugs',
    name: 'Drug Synthesis',
    category: 'harmful_content',
    patterns: [
      /how\s+to\s+(make|synthesize?|cook|produce)\s+(meth|cocaine|heroin|fentanyl|mdma|lsd)/i,
      /(synthesis|recipe|instructions?)\s+(for|to\s+make)\s+(meth|cocaine|heroin)/i,
      /drug\s+(synthesis|manufacturing|production)/i,
    ],
    baseSeverity: 10,
    action: 'block',
    description: 'Requests for drug synthesis information',
  },
  {
    id: 'harm_malware',
    name: 'Malware Creation',
    category: 'harmful_content',
    patterns: [
      /write\s+(me\s+)?(a\s+)?(virus|malware|ransomware|trojan|keylogger)/i,
      /how\s+to\s+(create|make|build)\s+(a\s+)?(virus|malware|ransomware)/i,
      /code\s+for\s+(a\s+)?(virus|malware|ransomware|exploit)/i,
    ],
    baseSeverity: 10,
    action: 'block',
    description: 'Requests for malware code',
  },
  {
    id: 'harm_hacking',
    name: 'Unauthorized Hacking',
    category: 'harmful_content',
    patterns: [
      /how\s+to\s+hack\s+(into\s+)?(someone|their|a\s+person)/i,
      /hack\s+(my\s+)?(ex|friend|neighbor|enemy|boss)/i,
      /break\s+into\s+(someone|their)\s+(account|computer|phone)/i,
      /unauthorized\s+access\s+to/i,
    ],
    baseSeverity: 9,
    action: 'block',
    description: 'Requests for unauthorized access methods',
  },

  // -------------------------------------------------------------------------
  // Social Engineering
  // -------------------------------------------------------------------------
  {
    id: 'se_identity_claim',
    name: 'False Authority Claim',
    category: 'social_engineering',
    patterns: [
      /i\s+(am|work\s+for)\s+(an?\s+)?(anthropic|openai|google|admin|developer)/i,
      /as\s+(an?\s+)?(admin|developer|employee)\s+(at|of|from)\s+(anthropic|openai)/i,
      /this\s+is\s+(an?\s+)?(official|authorized)\s+(test|request|audit)/i,
      /i\s+have\s+(special|admin|root|elevated)\s+(access|permissions?|privileges?)/i,
    ],
    baseSeverity: 7,
    action: 'flag',
    description: 'Claims false authority or insider status',
  },
  {
    id: 'se_urgency',
    name: 'Artificial Urgency',
    category: 'social_engineering',
    patterns: [
      /this\s+is\s+(an?\s+)?(emergency|urgent|life\s+or\s+death)/i,
      /(someone|people)\s+will\s+(die|be\s+hurt)\s+(if|unless)/i,
      /you\s+must\s+(respond|help|answer)\s+(immediately|now|urgently)/i,
    ],
    baseSeverity: 5,
    action: 'flag',
    description: 'Uses artificial urgency to bypass careful consideration',
  },

  // -------------------------------------------------------------------------
  // Rate Abuse
  // -------------------------------------------------------------------------
  {
    id: 'rate_spam',
    name: 'Spam Detection',
    category: 'rate_abuse',
    patterns: [
      /(.{10,})\1{5,}/, // Same text repeated 5+ times
    ],
    baseSeverity: 4,
    action: 'flag',
    description: 'Repetitive spam content',
  },
];

// =============================================================================
// Threat Detection Functions
// =============================================================================

/**
 * Calculate content hash for duplicate detection
 */
export function hashContent(content: string): string {
  return crypto
    .createHash('sha256')
    .update(content.toLowerCase().trim())
    .digest('hex')
    .substring(0, 16);
}

/**
 * Analyze a message for threats
 */
export function analyzeMessage(
  content: string,
  customPatterns?: ThreatPattern[]
): ThreatAnalysisResult {
  const patterns = [...THREAT_PATTERNS, ...(customPatterns || [])];
  const matches: ThreatMatch[] = [];
  const matchedPatternIds = new Set<string>();
  const matchedCategories = new Set<ThreatCategory>();

  // Normalize content for matching
  const normalizedContent = content.toLowerCase();

  // Check each pattern
  for (const pattern of patterns) {
    for (const regex of pattern.patterns) {
      const match = normalizedContent.match(regex);
      if (match) {
        matches.push({
          patternId: pattern.id,
          patternName: pattern.name,
          category: pattern.category,
          match: match[0],
          position: match.index || 0,
          severity: pattern.baseSeverity,
          action: pattern.action,
        });
        matchedPatternIds.add(pattern.id);
        matchedCategories.add(pattern.category);
      }
    }

    // Check keywords if present
    if (pattern.keywords) {
      for (const keyword of pattern.keywords) {
        if (normalizedContent.includes(keyword.toLowerCase())) {
          matches.push({
            patternId: pattern.id,
            patternName: pattern.name,
            category: pattern.category,
            match: keyword,
            position: normalizedContent.indexOf(keyword.toLowerCase()),
            severity: pattern.baseSeverity,
            action: pattern.action,
          });
          matchedPatternIds.add(pattern.id);
          matchedCategories.add(pattern.category);
        }
      }
    }
  }

  // Calculate overall threat score (JEF-inspired)
  const score = calculateThreatScore(matches);
  const severity = scoreToSeverity(score);
  const shouldBlock = matches.some((m) => m.action === 'block');
  const confidence = calculateConfidence(matches, content);

  return {
    score,
    severity,
    patterns: Array.from(matchedPatternIds),
    categories: Array.from(matchedCategories),
    confidence,
    blocked: shouldBlock,
    details: matches,
  };
}

/**
 * Calculate JEF-inspired threat score (0-10)
 *
 * Formula inspired by:
 * JEF_Score = 10 × (0.25 × BV + 0.15 × BM + 0.3 × RT + 0.3 × FD)
 *
 * Adapted for single-message analysis:
 * - Pattern Severity (PS): Base severity of matched patterns
 * - Pattern Diversity (PD): Number of different categories matched
 * - Match Density (MD): How much of the message triggers patterns
 * - Action Severity (AS): Severity of recommended actions
 */
function calculateThreatScore(matches: ThreatMatch[]): number {
  if (matches.length === 0) return 0;

  // Pattern Severity: Max severity of any match (weighted 0.4)
  const maxSeverity = Math.max(...matches.map((m) => m.severity));
  const patternSeverity = maxSeverity / 10;

  // Pattern Diversity: Number of unique categories (weighted 0.2)
  const uniqueCategories = new Set(matches.map((m) => m.category)).size;
  const patternDiversity = Math.min(uniqueCategories / 5, 1); // Cap at 5 categories

  // Match Count: More matches = higher threat (weighted 0.2)
  const matchCount = Math.min(matches.length / 5, 1); // Cap at 5 matches

  // Action Severity: Weighted by recommended action (weighted 0.2)
  const actionWeights: Record<ThreatAction, number> = {
    log: 0.1,
    flag: 0.3,
    warn: 0.5,
    sanitize: 0.6,
    block: 0.9,
    terminate: 1.0,
  };
  const maxAction = Math.max(
    ...matches.map((m) => actionWeights[m.action] || 0)
  );

  // Calculate final score
  const score =
    10 *
    (0.4 * patternSeverity +
      0.2 * patternDiversity +
      0.2 * matchCount +
      0.2 * maxAction);

  return Math.round(score * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate detection confidence (0-1)
 */
function calculateConfidence(matches: ThreatMatch[], content: string): number {
  if (matches.length === 0) return 1; // Confident there's no threat

  // More matches = higher confidence
  const matchConfidence = Math.min(matches.length / 3, 1);

  // Longer matches = higher confidence (less likely false positive)
  const avgMatchLength =
    matches.reduce((sum, m) => sum + m.match.length, 0) / matches.length;
  const lengthConfidence = Math.min(avgMatchLength / 20, 1);

  // Higher severity patterns are more carefully defined
  const avgSeverity =
    matches.reduce((sum, m) => sum + m.severity, 0) / matches.length;
  const severityConfidence = avgSeverity / 10;

  return Math.round((matchConfidence + lengthConfidence + severityConfidence) / 3 * 100) / 100;
}

/**
 * Convert score to severity level
 */
function scoreToSeverity(score: number): ThreatSeverity {
  if (score === 0) return 'none';
  if (score < 3) return 'low';
  if (score < 5) return 'medium';
  if (score < 8) return 'high';
  return 'critical';
}

// =============================================================================
// Session Risk Assessment
// =============================================================================

export interface SessionRiskAssessment {
  overallScore: number;
  severity: ThreatSeverity;
  riskFactors: string[];
  recommendedAction: ThreatAction;
  escalate: boolean;
}

/**
 * Assess risk for an entire session based on message history
 */
export function assessSessionRisk(
  messageAnalyses: ThreatAnalysisResult[],
  messageCount: number,
  timeWindowMs: number
): SessionRiskAssessment {
  const riskFactors: string[] = [];

  // Calculate average threat score
  const avgScore =
    messageAnalyses.length > 0
      ? messageAnalyses.reduce((sum, a) => sum + a.score, 0) / messageAnalyses.length
      : 0;

  // Track escalation patterns
  const recentAnalyses = messageAnalyses.slice(-5);
  const escalating =
    recentAnalyses.length >= 3 &&
    recentAnalyses.every(
      (a, i) => i === 0 || a.score >= recentAnalyses[i - 1].score
    );

  if (escalating) {
    riskFactors.push('Escalating threat pattern detected');
  }

  // Check for rapid-fire messages (possible automation)
  const messagesPerMinute = (messageCount / timeWindowMs) * 60000;
  if (messagesPerMinute > 10) {
    riskFactors.push('High message frequency (possible automation)');
  }

  // Check for diverse attack vectors
  const allCategories = new Set(messageAnalyses.flatMap((a) => a.categories));
  if (allCategories.size >= 3) {
    riskFactors.push('Multiple attack vectors attempted');
  }

  // Check for blocked messages
  const blockedCount = messageAnalyses.filter((a) => a.blocked).length;
  if (blockedCount > 0) {
    riskFactors.push(`${blockedCount} message(s) blocked`);
  }

  // Check for persistence after blocks
  const blockedIndices = messageAnalyses
    .map((a, i) => (a.blocked ? i : -1))
    .filter((i) => i !== -1);
  const persistedAfterBlock = blockedIndices.some(
    (i) => i < messageAnalyses.length - 1
  );
  if (persistedAfterBlock) {
    riskFactors.push('Continued attempts after being blocked');
  }

  // Calculate final session score
  let sessionScore = avgScore;
  if (escalating) sessionScore += 1;
  if (messagesPerMinute > 10) sessionScore += 1;
  if (allCategories.size >= 3) sessionScore += 1;
  if (persistedAfterBlock) sessionScore += 2;
  sessionScore = Math.min(sessionScore, 10);

  // Determine recommended action
  let recommendedAction: ThreatAction = 'log';
  if (sessionScore >= 3) recommendedAction = 'flag';
  if (sessionScore >= 5) recommendedAction = 'warn';
  if (sessionScore >= 7) recommendedAction = 'block';
  if (sessionScore >= 9) recommendedAction = 'terminate';

  return {
    overallScore: Math.round(sessionScore * 10) / 10,
    severity: scoreToSeverity(sessionScore),
    riskFactors,
    recommendedAction,
    escalate: sessionScore >= 7 || persistedAfterBlock,
  };
}

// =============================================================================
// Sanitization Functions
// =============================================================================

/**
 * Sanitize message content by removing or replacing harmful patterns
 */
export function sanitizeMessage(
  content: string,
  matches: ThreatMatch[]
): string {
  let sanitized = content;

  // Sort matches by position (descending) to avoid index shifts
  const sortedMatches = [...matches].sort((a, b) => b.position - a.position);

  for (const match of sortedMatches) {
    if (match.action === 'sanitize' || match.action === 'block') {
      // Replace the matched content with [REDACTED]
      sanitized =
        sanitized.substring(0, match.position) +
        '[REDACTED]' +
        sanitized.substring(match.position + match.match.length);
    }
  }

  return sanitized;
}

// =============================================================================
// Behavioral Analysis
// =============================================================================

export interface BehavioralSignals {
  messageVelocity: number; // Messages per minute
  avgMessageLength: number;
  uniquePatterns: number;
  escalationTrend: 'increasing' | 'stable' | 'decreasing';
  topicConsistency: number; // 0-1, how focused the conversation is
}

/**
 * Analyze behavioral signals from a conversation
 */
export function analyzeBehavior(
  messages: Array<{ content: string; timestamp: number; role: string }>,
  analyses: ThreatAnalysisResult[]
): BehavioralSignals {
  const userMessages = messages.filter((m) => m.role === 'user');

  if (userMessages.length === 0) {
    return {
      messageVelocity: 0,
      avgMessageLength: 0,
      uniquePatterns: 0,
      escalationTrend: 'stable',
      topicConsistency: 1,
    };
  }

  // Calculate message velocity
  const timeSpan =
    userMessages.length > 1
      ? userMessages[userMessages.length - 1].timestamp - userMessages[0].timestamp
      : 60000;
  const messageVelocity = (userMessages.length / timeSpan) * 60000;

  // Average message length
  const avgMessageLength =
    userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length;

  // Unique patterns detected
  const allPatterns = new Set(analyses.flatMap((a) => a.patterns));
  const uniquePatterns = allPatterns.size;

  // Escalation trend
  let escalationTrend: 'increasing' | 'stable' | 'decreasing' = 'stable';
  if (analyses.length >= 3) {
    const recentScores = analyses.slice(-3).map((a) => a.score);
    if (recentScores.every((s, i) => i === 0 || s > recentScores[i - 1])) {
      escalationTrend = 'increasing';
    } else if (recentScores.every((s, i) => i === 0 || s < recentScores[i - 1])) {
      escalationTrend = 'decreasing';
    }
  }

  // Topic consistency (based on category diversity)
  const allCategories = analyses.flatMap((a) => a.categories);
  const categoryDiversity =
    allCategories.length > 0
      ? new Set(allCategories).size / allCategories.length
      : 0;
  const topicConsistency = 1 - categoryDiversity;

  return {
    messageVelocity,
    avgMessageLength,
    uniquePatterns,
    escalationTrend,
    topicConsistency,
  };
}

// =============================================================================
// Export Default Patterns for Database Seeding
// =============================================================================

export function getDefaultPatternsForSeeding() {
  return THREAT_PATTERNS.map((p) => ({
    patternId: p.id,
    name: p.name,
    description: p.description,
    patternType: 'regex' as const,
    pattern: JSON.stringify(p.patterns.map((r) => r.source)),
    category: p.category,
    baseSeverity: p.baseSeverity,
    confidenceWeight: 1,
    action: p.action,
    isActive: true,
    hitCount: 0,
    falsePositiveCount: 0,
    createdAt: Date.now(),
    createdBy: 'system',
    updatedAt: Date.now(),
    source: '0din',
  }));
}
