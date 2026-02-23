/**
 * 8gent Tool Executor - Execute tools and return results
 */

import { ToolCall, ToolResult, ToolAction, NAVIGATION_DESTINATIONS, NavigationDestination } from './tools';
import { searchSystem, getAllThemes, formatSearchResults, SearchOptions } from './search';
import { themes } from '@/lib/themes/definitions';
// import { ConvexHttpClient } from 'convex/browser';
// import { api } from '@/lib/convex-shim';
// import type { Id } from '../../../convex/_generated/dataModel';
import { ConvexHttpClient, api, Id } from '../convex-shim';
import { MemoryManager, getMemoryManager } from '@/lib/memory';
import type { SemanticCategory, EpisodicMemoryType } from '@/lib/memory/types';
import { sendMessage, Platform } from '@/lib/channels/outbound-router';
import type { AccessLevel } from './access-control';
import {
  generateVideoFromText,
  generateVideoFromImage,
  generateVideoWithPreset,
  LTX_PRESETS,
  getFrameCountForDuration,
  isLTXConfigured,
} from '@/lib/video/ltx-video';

/**
 * Execution context passed from the chat route
 * Contains the authenticated user's information
 */
export interface ExecutionContext {
  userId: string | null;
  accessLevel: AccessLevel;
  /** Optional job ID for tracking which background job triggered this tool */
  jobId?: string;
  /** Optional workspace ID for artifact storage */
  workspaceId?: string;
}

// Default context for backwards compatibility (visitor with no userId)
const DEFAULT_CONTEXT: ExecutionContext = {
  userId: null,
  accessLevel: 'visitor',
};

/**
 * Get the effective userId for mutations
 * SECURITY: This ensures we never use a hardcoded owner ID
 * SECURITY: This function enforces that operations requiring a userId
 * are only executed by properly authenticated users with the correct access level.
 * The access level was already filtered at the API route level, but this
 * provides defense-in-depth in case of bugs in the filtering logic.
 */
function getEffectiveUserId(
  context: ExecutionContext,
  requiredLevel: AccessLevel = 'owner'
): string {
  if (!context.userId) {
    throw new Error('User ID required for this operation');
  }

  // Defense-in-depth: verify access level matches requirement
  if (requiredLevel === 'owner' && context.accessLevel !== 'owner') {
    throw new Error('Owner access required for this operation');
  }

  return context.userId;
}

// ============================================================================
// PATH VALIDATION - Security Layer for File Operations
// ============================================================================

/**
 * Allowed base directories for file operations
 * Files outside these directories are rejected
 */
const ALLOWED_PATH_PREFIXES = [
  '/workspace',
  '/home/user',
  '/tmp/sandbox',
];

/**
 * Blocked file patterns - these files should never be read/written
 * Even if they're in an allowed directory
 */
const BLOCKED_PATH_PATTERNS = [
  /\.env($|\.)/i,                    // .env, .env.local, .env.production
  /credentials/i,                     // Any credentials file
  /secrets?\.?(json|yaml|yml|toml)?$/i, // secrets.json, secret.yaml, etc.
  /\.key$/i,                          // Private keys
  /\.pem$/i,                          // Certificates/keys
  /id_rsa/i,                          // SSH keys
  /id_ed25519/i,                      // SSH keys
  /\.ssh\//i,                         // SSH directory
  /convex\//,                         // Convex backend (should be modified via proper channels)
  /node_modules\//,                   // Don't touch node_modules
  /\.git\//,                          // Git internals
];

/**
 * Path validation result
 */
interface PathValidationResult {
  valid: boolean;
  normalizedPath: string;
  error?: string;
}

/**
 * Validate and normalize a file path for security
 *
 * Rules:
 * 1. Path must be absolute (starts with /)
 * 2. Path must be under an allowed prefix
 * 3. Path must not match any blocked patterns
 * 4. Path traversal (../) is rejected
 */
function validatePath(path: string): PathValidationResult {
  // Ensure path is a string
  if (typeof path !== 'string' || !path) {
    return { valid: false, normalizedPath: '', error: 'Path must be a non-empty string' };
  }

  // Check for path traversal attempts
  if (path.includes('..')) {
    return { valid: false, normalizedPath: '', error: 'Path traversal (..) is not allowed' };
  }

  // Ensure absolute path
  if (!path.startsWith('/')) {
    return { valid: false, normalizedPath: '', error: 'Path must be absolute (start with /)' };
  }

  // Normalize the path (remove double slashes, trailing slashes)
  const normalizedPath = path
    .replace(/\/+/g, '/')           // Replace multiple slashes with single
    .replace(/\/$/, '');            // Remove trailing slash

  // Check if path is under an allowed prefix
  const isAllowedPrefix = ALLOWED_PATH_PREFIXES.some(prefix =>
    normalizedPath === prefix || normalizedPath.startsWith(prefix + '/')
  );

  if (!isAllowedPrefix) {
    return {
      valid: false,
      normalizedPath,
      error: `Path must be under one of: ${ALLOWED_PATH_PREFIXES.join(', ')}`,
    };
  }

  // Check against blocked patterns
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(normalizedPath)) {
      return {
        valid: false,
        normalizedPath,
        error: `Access to this file type is blocked for security reasons`,
      };
    }
  }

  return { valid: true, normalizedPath };
}

/**
 * Helper to create a standardized path validation error result
 */
function pathValidationError(error: string): ToolResult {
  return {
    success: false,
    error: `[PATH SECURITY] ${error}`,
  };
}

// ============================================================================
// MESSAGE CONTENT VALIDATION - Security Layer for Channel Messages
// ============================================================================

/**
 * Patterns that indicate potential phishing or social engineering
 * These messages should be blocked or flagged for review
 */
const PHISHING_PATTERNS = [
  // Credential harvesting
  /password.*(?:expired|reset|verify|confirm|update)/i,
  /(?:verify|confirm|update).*(?:account|identity|credentials)/i,
  /(?:click|tap|visit).*(?:link|here).*(?:login|sign.?in|verify)/i,
  /urgent.*(?:action|response).*required/i,

  // Financial scams
  /(?:wire|transfer|send).*(?:money|funds|payment|bitcoin|crypto)/i,
  /(?:won|winner|lottery|prize|inheritance).*(?:claim|collect)/i,
  /(?:bank|paypal|venmo).*(?:suspended|locked|verify)/i,

  // Impersonation
  /(?:i am|this is).*(?:ceo|cfo|president|boss|manager).*(?:need|want|request)/i,
  /(?:gift.?card|itunes|amazon).*(?:purchase|buy|send)/i,

  // Tech support scams
  /(?:computer|device|account).*(?:infected|hacked|compromised)/i,
  /(?:call|contact).*(?:immediately|urgently|asap)/i,
];

/**
 * URLs that look suspicious
 */
const SUSPICIOUS_URL_PATTERNS = [
  /bit\.ly/i,
  /tinyurl/i,
  /goo\.gl/i,
  /t\.co(?!m)/i,  // t.co but not .com
  /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,  // Raw IP addresses
  /(?:login|signin|verify|secure|account).*\.(tk|ml|ga|cf|gq)/i, // Suspicious TLDs
];

/**
 * Message validation result
 */
interface MessageValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Validate message content for security concerns
 */
function validateMessageContent(content: string): MessageValidationResult {
  if (!content || typeof content !== 'string') {
    return { valid: false, error: 'Message content is required' };
  }

  // Check for empty or whitespace-only
  if (content.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  // Check message length (prevent spam)
  if (content.length > 10000) {
    return { valid: false, error: 'Message too long (max 10000 characters)' };
  }

  // Check for phishing patterns
  for (const pattern of PHISHING_PATTERNS) {
    if (pattern.test(content)) {
      return {
        valid: false,
        error: 'Message contains content that appears to be phishing or social engineering. Please rephrase.',
      };
    }
  }

  // Check for suspicious URLs (warning, not blocking)
  const warnings: string[] = [];
  for (const pattern of SUSPICIOUS_URL_PATTERNS) {
    if (pattern.test(content)) {
      warnings.push('Message contains a URL shortener or suspicious domain. Recipient may be cautious.');
      break;
    }
  }

  return { valid: true, warnings: warnings.length > 0 ? warnings : undefined };
}

/**
 * Helper to create a standardized message validation error result
 */
function messageValidationError(error: string): ToolResult {
  return {
    success: false,
    error: `[MESSAGE SECURITY] ${error}`,
  };
}

// ============================================================================
// SANDBOX VALIDATION - Security Layer for Code Execution
// ============================================================================

/**
 * Dangerous command patterns that should never be executed
 */
const DANGEROUS_COMMAND_PATTERNS = [
  /rm\s+-rf\s+\/(?![\w])/i,           // rm -rf / (root)
  /:\s*\(\s*\)\s*\{/i,                 // Fork bomb
  />\s*\/dev\/sd[a-z]/i,               // Writing to raw disk
  /dd\s+if=.*of=\/dev/i,               // dd to device
  /mkfs\./i,                           // Format filesystem
  /shutdown|reboot|halt|poweroff/i,    // System shutdown
  /chmod\s+777\s+\//i,                 // Chmod 777 root
  /curl.*\|\s*(?:bash|sh)/i,           // Pipe curl to shell
  /wget.*\|\s*(?:bash|sh)/i,           // Pipe wget to shell
  /base64\s+-d.*\|\s*(?:bash|sh)/i,    // Decode and execute
  /eval\s*\(.*(?:curl|wget)/i,         // Eval with download
];

/**
 * Commands that require extra caution / explicit confirmation
 */
const CAUTIOUS_COMMAND_PATTERNS = [
  /npm\s+publish/i,                    // Publishing packages
  /git\s+push.*--force/i,              // Force push
  /docker\s+(?:rm|rmi)\s+-f/i,         // Force remove containers/images
  /kubectl\s+delete/i,                 // Kubernetes delete
  /aws\s+.*delete/i,                   // AWS delete operations
];

/**
 * Command validation result
 */
interface CommandValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
  requiresSandbox: boolean;
}

/**
 * Validate a command for security concerns
 */
function validateCommand(command: string): CommandValidationResult {
  if (!command || typeof command !== 'string') {
    return { valid: false, error: 'Command is required', requiresSandbox: true };
  }

  // Check for empty command
  if (command.trim().length === 0) {
    return { valid: false, error: 'Command cannot be empty', requiresSandbox: true };
  }

  // Check command length
  if (command.length > 10000) {
    return { valid: false, error: 'Command too long (max 10000 characters)', requiresSandbox: true };
  }

  // Check for dangerous patterns
  for (const pattern of DANGEROUS_COMMAND_PATTERNS) {
    if (pattern.test(command)) {
      return {
        valid: false,
        error: 'Command contains dangerous patterns that could harm the system',
        requiresSandbox: true,
      };
    }
  }

  // Check for cautious patterns (warn but allow)
  let warning: string | undefined;
  for (const pattern of CAUTIOUS_COMMAND_PATTERNS) {
    if (pattern.test(command)) {
      warning = 'This command performs a sensitive operation. Proceed with caution.';
      break;
    }
  }

  return { valid: true, warning, requiresSandbox: true };
}

/**
 * Helper to create a standardized command validation error result
 */
function commandValidationError(error: string): ToolResult {
  return {
    success: false,
    error: `[COMMAND SECURITY] ${error}`,
  };
}

// ============================================================================
// GIT BRANCH VALIDATION - Security Layer for Repository Operations
// ============================================================================

/**
 * Validate a Git branch name to prevent command injection
 *
 * Git branch names can contain alphanumeric characters, dots, slashes,
 * underscores, and hyphens. They must NOT contain shell metacharacters
 * that could enable command injection attacks.
 *
 * @param branch - The branch name to validate
 * @returns true if the branch name is valid, false otherwise
 */
function isValidGitBranch(branch: string): boolean {
  // Git branch names can contain: alphanumeric, ., /, _, -
  // Must NOT contain shell metacharacters: ; | & $ ` ( ) { } < > \n
  const validBranchRegex = /^[a-zA-Z0-9._\/-]+$/;
  return (
    validBranchRegex.test(branch) &&
    !branch.includes('..') &&
    branch.length > 0 &&
    branch.length <= 255
  );
}

// ============================================================================
// NETWORK WHITELISTING - Phase 1.5 OpenClaw Safety Stack
// ============================================================================

/**
 * Whitelisted domains for agent network access
 * Only these domains can be accessed from sandbox environments
 */
export const NETWORK_WHITELIST = new Set([
  // Package registries
  'registry.npmjs.org',
  'npm.pkg.github.com',
  'pypi.org',
  'files.pythonhosted.org',
  'crates.io',
  'static.crates.io',
  'rubygems.org',

  // Code hosting
  'github.com',
  'api.github.com',
  'raw.githubusercontent.com',
  'gist.githubusercontent.com',
  'gitlab.com',
  'bitbucket.org',

  // Documentation
  'docs.github.com',
  'docs.npmjs.com',
  'docs.python.org',
  'devdocs.io',
  'developer.mozilla.org',

  // CDNs commonly needed for development
  'cdn.jsdelivr.net',
  'unpkg.com',
  'cdnjs.cloudflare.com',

  // Build tools
  'nodejs.org',
  'deno.land',

  // Cloud providers (for CLI tools)
  'vercel.com',
  'api.vercel.com',
  'registry.terraform.io',
]);

/**
 * Domains that are always blocked (even if in whitelist)
 */
const NETWORK_BLOCKLIST = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '169.254.169.254',  // AWS metadata endpoint
  'metadata.google.internal',  // GCP metadata
]);

/**
 * Network validation result
 */
interface NetworkValidationResult {
  valid: boolean;
  domain?: string;
  error?: string;
  warning?: string;
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string | null {
  try {
    // Handle URLs with or without protocol
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
    const parsed = new URL(urlWithProtocol);
    return parsed.hostname.toLowerCase();
  } catch {
    // Try to extract domain from common patterns
    const match = url.match(/^(?:https?:\/\/)?([^\/:\s]+)/);
    return match ? match[1].toLowerCase() : null;
  }
}

/**
 * Validate a URL against the network whitelist
 */
export function validateNetworkAccess(url: string): NetworkValidationResult {
  const domain = extractDomain(url);

  if (!domain) {
    return {
      valid: false,
      error: 'Invalid URL format',
    };
  }

  // Check blocklist first (absolute rejection)
  if (NETWORK_BLOCKLIST.has(domain)) {
    return {
      valid: false,
      domain,
      error: `Access to ${domain} is blocked for security reasons`,
    };
  }

  // Check if it's an IP address (block unless explicitly whitelisted)
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) {
    return {
      valid: false,
      domain,
      error: 'Direct IP address access is not allowed. Use domain names.',
    };
  }

  // Check whitelist
  if (NETWORK_WHITELIST.has(domain)) {
    return {
      valid: true,
      domain,
    };
  }

  // Check for subdomains of whitelisted domains
  for (const whitelisted of NETWORK_WHITELIST) {
    if (domain.endsWith(`.${whitelisted}`)) {
      return {
        valid: true,
        domain,
        warning: `Subdomain of whitelisted domain: ${whitelisted}`,
      };
    }
  }

  // Not in whitelist
  return {
    valid: false,
    domain,
    error: `Domain not in network whitelist: ${domain}. Allowed: npm, github, pypi, and standard dev tools.`,
  };
}

/**
 * Check if a command contains network access to non-whitelisted domains
 */
export function validateCommandNetworkAccess(command: string): NetworkValidationResult {
  // Extract URLs from command
  const urlPatterns = [
    /https?:\/\/[^\s"']+/g,           // Standard URLs
    /git@([^:]+):/g,                   // Git SSH URLs
    /(?:curl|wget|fetch)\s+[^\s]+/g,   // Common download commands
  ];

  for (const pattern of urlPatterns) {
    const matches = command.match(pattern);
    if (matches) {
      for (const match of matches) {
        // Extract URL from the match
        const url = match.replace(/^(curl|wget|fetch)\s+/, '').replace(/git@/, 'https://');
        const result = validateNetworkAccess(url);
        if (!result.valid) {
          return result;
        }
      }
    }
  }

  return { valid: true };
}

/**
 * Helper to create network validation error result
 */
function networkValidationError(error: string): ToolResult {
  return {
    success: false,
    error: `[NETWORK SECURITY] ${error}`,
  };
}

// ============================================================================
// APPROVAL SYSTEM - Phase 1.2 OpenClaw Safety Stack
// ============================================================================

/**
 * Destructive actions that require user approval before execution
 */
export const DESTRUCTIVE_ACTIONS = new Set([
  // File mutations
  'delete_file',
  // Git mutations that can't be easily undone
  'git_push',
  // External communications
  'send_channel_message',
  // System mutations
  'delete_cron_job',
  // Scheduling mutations that affect others
  'cancel_meeting',
]);

/**
 * Actions that require approval on first use (e.g., new contact)
 */
export const FIRST_USE_APPROVAL_ACTIONS = new Set([
  'send_channel_message',  // First message to new contact
  'book_meeting',          // First meeting with new guest
]);

/**
 * Approval request returned when an action needs user confirmation
 */
export interface ApprovalRequest {
  required: boolean;
  reason: string;
  actionType: 'destructive' | 'first_use' | 'expensive' | 'external';
  toolName: string;
  toolArgs: Record<string, unknown>;
  consequences: string[];
  approvalId: string;
}

/**
 * Check if a tool action requires approval
 * Returns null if no approval needed, or an ApprovalRequest if approval required
 */
export async function checkApprovalRequired(
  toolName: string,
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ApprovalRequest | null> {
  // Destructive actions always require approval
  if (DESTRUCTIVE_ACTIONS.has(toolName)) {
    const consequences = getDestructiveConsequences(toolName, args);
    return {
      required: true,
      reason: getApprovalReason(toolName, args),
      actionType: 'destructive',
      toolName,
      toolArgs: args,
      consequences,
      approvalId: generateApprovalId(toolName, args),
    };
  }

  // Special case: send_channel_message to new contact
  if (toolName === 'send_channel_message') {
    const isNewContact = await checkIfNewContact(args, context);
    if (isNewContact) {
      return {
        required: true,
        reason: 'This is your first message to this contact. Please confirm.',
        actionType: 'first_use',
        toolName,
        toolArgs: args,
        consequences: ['Message will be sent externally', 'Contact will see you initiated conversation'],
        approvalId: generateApprovalId(toolName, args),
      };
    }
  }

  return null;
}

/**
 * Get human-readable reason for why approval is needed
 */
function getApprovalReason(toolName: string, args: Record<string, unknown>): string {
  switch (toolName) {
    case 'delete_file':
      return `Delete file: ${args.path || 'unknown path'}`;
    case 'git_push':
      const branch = args.branch || 'current branch';
      const force = args.force ? ' (FORCE PUSH)' : '';
      return `Push to remote${force}: ${branch}`;
    case 'send_channel_message':
      return `Send message via ${args.channel || 'channel'}`;
    case 'delete_cron_job':
      return `Delete scheduled job: ${args.jobId || 'unknown'}`;
    case 'cancel_meeting':
      return `Cancel meeting: ${args.meetingId || 'unknown'}`;
    default:
      return `Execute ${toolName}`;
  }
}

/**
 * Get list of consequences for destructive actions
 */
function getDestructiveConsequences(toolName: string, args: Record<string, unknown>): string[] {
  switch (toolName) {
    case 'delete_file':
      return [
        'File will be permanently deleted',
        'This cannot be undone',
        'Any references to this file may break',
      ];
    case 'git_push':
      if (args.force) {
        return [
          'Remote history will be overwritten',
          'Other collaborators may lose work',
          'This cannot be easily undone',
        ];
      }
      return [
        'Changes will be pushed to remote',
        'Others will see these commits',
      ];
    case 'send_channel_message':
      return [
        'Message will be sent externally',
        'Recipient will be notified',
        'Message cannot be unsent',
      ];
    case 'delete_cron_job':
      return [
        'Scheduled automation will be stopped',
        'Job configuration will be lost',
      ];
    case 'cancel_meeting':
      return [
        'All participants will be notified',
        'Calendar events will be removed',
      ];
    default:
      return ['This action may have permanent effects'];
  }
}

/**
 * Generate a unique approval ID for tracking
 */
function generateApprovalId(toolName: string, args: Record<string, unknown>): string {
  const timestamp = Date.now();
  const argsHash = JSON.stringify(args).slice(0, 50);
  return `approval_${toolName}_${timestamp}_${Buffer.from(argsHash).toString('base64').slice(0, 10)}`;
}

/**
 * Result when approval is required (tool not executed)
 */
export function approvalRequiredResult(approval: ApprovalRequest): ToolResult {
  return {
    success: false,
    requiresApproval: true,
    approval,
    data: {
      message: `This action requires your approval: ${approval.reason}`,
      approvalId: approval.approvalId,
      consequences: approval.consequences,
    },
  };
}

// ============================================================================
// CONTACT DEDUPLICATION - EPIC-001
// ============================================================================

/**
 * Normalize a name for fuzzy matching
 * Removes common titles, lowercases, removes punctuation
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^(mr|mrs|ms|dr|prof|sir|madam)\.?\s+/i, '') // Remove titles
    .replace(/[^a-z0-9\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy name matching
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate name similarity score (0-1, where 1 is identical)
 */
function calculateNameSimilarity(name1: string, name2: string): number {
  const normalized1 = normalizeName(name1);
  const normalized2 = normalizeName(name2);

  if (normalized1 === normalized2) return 1.0;

  const maxLen = Math.max(normalized1.length, normalized2.length);
  if (maxLen === 0) return 0;

  const distance = levenshteinDistance(normalized1, normalized2);
  return 1 - (distance / maxLen);
}

/**
 * Normalize email for matching
 */
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Normalize phone number for matching (strips all non-digits)
 */
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Contact match result
 */
interface ContactMatch {
  contactId: string;
  matchType: 'exact_phone' | 'exact_email' | 'fuzzy_name' | 'partial';
  confidence: number; // 0-1
  existingContact: any;
}

/**
 * Find matching contacts in the system
 * Checks phone, email, and name similarity
 */
async function findMatchingContacts(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ContactMatch[]> {
  const recipientId = args.recipientId as string | undefined;
  const recipientName = args.recipientName as string | undefined;
  const recipientEmail = args.recipientEmail as string | undefined;

  if (!recipientId && !recipientName && !recipientEmail) {
    return [];
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return [];
  }

  const matches: ContactMatch[] = [];
  const client = new ConvexHttpClient(convexUrl);

  try {
    // Check 1: Exact phone match (highest priority)
    if (recipientId) {
      const normalizedPhone = normalizePhone(recipientId);
      const phoneContact = await client.query(api.whatsappContacts.getContactByPhone, {
        phoneNumber: normalizedPhone,
      });

      if (phoneContact) {
        matches.push({
          contactId: phoneContact._id,
          matchType: 'exact_phone',
          confidence: 1.0,
          existingContact: phoneContact,
        });
      }
    }

    // Check 2: Exact email match
    if (recipientEmail && matches.length === 0) {
      const normalizedEmail = normalizeEmail(recipientEmail);
      const allContacts = await client.query(api.whatsappContacts.listContacts, {});

      for (const contact of allContacts) {
        if (contact.email && normalizeEmail(contact.email) === normalizedEmail) {
          matches.push({
            contactId: contact._id,
            matchType: 'exact_email',
            confidence: 1.0,
            existingContact: contact,
          });
          break;
        }
      }
    }

    // Check 3: Fuzzy name match (if no exact matches found)
    if (recipientName && matches.length === 0) {
      const allContacts = await client.query(api.whatsappContacts.listContacts, {});

      for (const contact of allContacts) {
        if (contact.displayName) {
          const similarity = calculateNameSimilarity(recipientName, contact.displayName);

          // High confidence threshold: 0.85+ similarity
          if (similarity >= 0.85) {
            matches.push({
              contactId: contact._id,
              matchType: 'fuzzy_name',
              confidence: similarity,
              existingContact: contact,
            });
          }
        }
      }

      // Sort by confidence (highest first)
      matches.sort((a, b) => b.confidence - a.confidence);
    }

    return matches;
  } catch (error) {
    console.error('[ContactDedup] Error finding matching contacts:', error);
    return [];
  }
}

/**
 * Check if a contact is new (for approval flow)
 * Returns true if this is the first message to this contact
 */
async function checkIfNewContact(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<boolean> {
  const integrationId = args.integrationId as string | undefined;
  const recipientId = args.recipientId as string | undefined;

  if (!integrationId || !recipientId) {
    // If we can't determine the recipient, treat as new for safety
    return true;
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return true;
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    // First check if contact exists
    const matches = await findMatchingContacts(args, context);
    if (matches.length === 0) {
      return true; // No existing contact found
    }

    // Check if we've sent messages to this integration/recipient before
    // Query channelMessages for any previous messages
    const userId = context.userId;
    if (!userId) {
      return true; // No user context, treat as new
    }

    // Get the first match (highest confidence)
    const bestMatch = matches[0];
    const normalizedRecipient = normalizePhone(recipientId);

    // Query for previous messages to this recipient via this integration
    const userMessages = await client.query(api.channels.getUserMessages, {
      userId,
      limit: 100, // Check last 100 messages
    });

    // Check if any message was sent to this recipient
    const hasPreviousMessages = userMessages.some((msg: any) => {
      if (msg.integrationId !== integrationId) return false;
      const msgRecipient = normalizePhone(msg.recipientId || '');
      return msgRecipient === normalizedRecipient;
    });

    return !hasPreviousMessages;
  } catch (error) {
    console.error('[ContactDedup] Error checking if new contact:', error);
    // On error, treat as new for safety (requires approval)
    return true;
  }
}

/**
 * Get or create contact with deduplication
 * Returns existing contact if found, creates new one otherwise
 */
export async function getOrCreateContact(
  args: {
    phoneNumber?: string;
    email?: string;
    displayName?: string;
    accessLevel?: 'owner' | 'collaborator' | 'visitor';
  },
  context: ExecutionContext
): Promise<{ contactId: string; isNew: boolean; matchType?: string }> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error('Convex URL not configured');
  }

  const client = new ConvexHttpClient(convexUrl);

  // Find matching contacts
  const matches = await findMatchingContacts(args, context);

  if (matches.length > 0) {
    const bestMatch = matches[0];

    // If confidence is high (0.95+), return existing contact
    if (bestMatch.confidence >= 0.95) {
      return {
        contactId: bestMatch.contactId,
        isNew: false,
        matchType: bestMatch.matchType,
      };
    }

    // If confidence is medium (0.85-0.95), could implement merge logic here
    // For now, we'll create a new contact and let the user merge manually
  }

  // No match found or low confidence - create new contact
  const contactId = await client.mutation(api.whatsappContacts.upsertContact, {
    phoneNumber: args.phoneNumber || '',
    displayName: args.displayName,
    email: args.email,
    accessLevel: args.accessLevel || 'visitor',
  });

  return {
    contactId,
    isNew: true,
  };
}

// ============================================================================
// COST ESTIMATION - Phase 1.3 OpenClaw Safety Stack
// ============================================================================

/**
 * Cost types for different resources
 */
export interface CostEstimate {
  estimatedTokens?: number;      // AI tokens (input + output)
  estimatedApiCalls?: number;    // External API calls
  estimatedTimeMs?: number;      // Wall-clock time
  estimatedCredits?: number;     // Platform credits (Vercel, etc.)
  breakdown?: CostBreakdownItem[];
  warning?: string;
  requiresConfirmation: boolean;
}

export interface CostBreakdownItem {
  resource: string;
  amount: number;
  unit: string;
  cost?: number;  // In cents, if applicable
}

/**
 * Operations that are considered "expensive" and need cost estimation
 */
const EXPENSIVE_OPERATIONS: Record<string, {
  baseTokens?: number;
  baseTimeMs?: number;
  apiCalls?: number;
  creditsPerCall?: number;
  tokensPerKb?: number;  // For file operations
  confirmationThreshold?: {
    tokens?: number;
    time?: number;
    cost?: number;
  };
}> = {
  // AI operations
  'compact_conversation': {
    baseTokens: 10000,
    baseTimeMs: 5000,
    confirmationThreshold: { tokens: 50000 },
  },
  // Code execution
  'run_command': {
    baseTimeMs: 30000,
    confirmationThreshold: { time: 60000 },
  },
  'start_dev_server': {
    baseTimeMs: 60000,
    creditsPerCall: 10,  // Vercel sandbox credits
    confirmationThreshold: { time: 120000 },
  },
  // Repository operations
  'clone_repository': {
    baseTimeMs: 30000,
    apiCalls: 1,
    confirmationThreshold: { time: 60000 },
  },
  // Large file operations
  'write_file': {
    tokensPerKb: 100,
    baseTimeMs: 1000,
  },
  'read_file': {
    tokensPerKb: 50,
    baseTimeMs: 500,
  },
  // External communications
  'send_channel_message': {
    apiCalls: 1,
    baseTimeMs: 2000,
  },
};

/**
 * Estimate the cost of executing a tool
 * Returns null if the operation is cheap/instant
 */
export function estimateCost(
  toolName: string,
  args: Record<string, unknown>
): CostEstimate | null {
  const config = EXPENSIVE_OPERATIONS[toolName];
  if (!config) {
    return null;  // Not an expensive operation
  }

  const breakdown: CostBreakdownItem[] = [];
  let totalTokens = config.baseTokens || 0;
  let totalTimeMs = config.baseTimeMs || 0;
  let totalApiCalls = config.apiCalls || 0;
  let totalCredits = config.creditsPerCall || 0;
  let warning: string | undefined;

  // Estimate based on content size if applicable
  if (config.tokensPerKb && args.content) {
    const contentLength = String(args.content).length;
    const contentKb = contentLength / 1024;
    const contentTokens = Math.ceil(contentKb * config.tokensPerKb);
    totalTokens += contentTokens;
    breakdown.push({
      resource: 'Content processing',
      amount: contentTokens,
      unit: 'tokens',
    });
  }

  // Estimate time based on command complexity
  if (toolName === 'run_command' && args.command) {
    const command = String(args.command);
    // npm/pnpm installs take longer
    if (/npm|pnpm|yarn/.test(command) && /install|add|update/.test(command)) {
      totalTimeMs *= 3;
      warning = 'Package installation can take several minutes';
    }
    // Build commands take longer
    if (/build|compile|test/.test(command)) {
      totalTimeMs *= 2;
    }
  }

  // Check if confirmation is needed
  const threshold = config.confirmationThreshold || {};
  const requiresConfirmation = !!(
    (threshold.tokens && totalTokens > threshold.tokens) ||
    (threshold.time && totalTimeMs > threshold.time) ||
    (threshold.cost && totalCredits > (threshold.cost || 0))
  );

  // Add standard breakdown items
  if (totalTokens > 0) {
    breakdown.push({
      resource: 'AI tokens',
      amount: totalTokens,
      unit: 'tokens',
      cost: Math.ceil(totalTokens * 0.003),  // ~$0.003 per 1K tokens estimate
    });
  }
  if (totalTimeMs > 0) {
    breakdown.push({
      resource: 'Estimated time',
      amount: Math.ceil(totalTimeMs / 1000),
      unit: 'seconds',
    });
  }
  if (totalApiCalls > 0) {
    breakdown.push({
      resource: 'External API calls',
      amount: totalApiCalls,
      unit: 'calls',
    });
  }
  if (totalCredits > 0) {
    breakdown.push({
      resource: 'Platform credits',
      amount: totalCredits,
      unit: 'credits',
    });
  }

  // Only return if there's meaningful cost
  if (breakdown.length === 0) {
    return null;
  }

  return {
    estimatedTokens: totalTokens > 0 ? totalTokens : undefined,
    estimatedTimeMs: totalTimeMs > 0 ? totalTimeMs : undefined,
    estimatedApiCalls: totalApiCalls > 0 ? totalApiCalls : undefined,
    estimatedCredits: totalCredits > 0 ? totalCredits : undefined,
    breakdown,
    warning,
    requiresConfirmation,
  };
}

/**
 * Format cost estimate for display
 */
export function formatCostEstimate(cost: CostEstimate): string {
  const parts: string[] = [];

  if (cost.estimatedTimeMs) {
    const seconds = Math.ceil(cost.estimatedTimeMs / 1000);
    parts.push(`~${seconds}s`);
  }
  if (cost.estimatedTokens) {
    parts.push(`~${(cost.estimatedTokens / 1000).toFixed(1)}K tokens`);
  }
  if (cost.estimatedApiCalls) {
    parts.push(`${cost.estimatedApiCalls} API call${cost.estimatedApiCalls > 1 ? 's' : ''}`);
  }

  return parts.join(' | ') || 'minimal cost';
}

// Execute a single tool call
export async function executeTool(
  toolCall: ToolCall,
  context: ExecutionContext = DEFAULT_CONTEXT,
  options: { skipApprovalCheck?: boolean; approvalId?: string; skipCostEstimate?: boolean } = {}
): Promise<ToolResult> {
  const { name, arguments: args } = toolCall;

  // SECURITY: Check if approval is required for destructive actions
  // Skip if approval was already granted (approvalId matches)
  if (!options.skipApprovalCheck) {
    const approvalRequired = await checkApprovalRequired(name, args as Record<string, unknown>, context);
    if (approvalRequired && approvalRequired.approvalId !== options.approvalId) {
      return approvalRequiredResult(approvalRequired);
    }
  }

  // COST: Calculate cost estimate for expensive operations
  const costEstimate = !options.skipCostEstimate
    ? estimateCost(name, args as Record<string, unknown>)
    : null;

  // Helper to attach cost estimate to results
  const withCost = (result: ToolResult): ToolResult => {
    if (costEstimate) {
      return { ...result, costEstimate };
    }
    return result;
  };

  try {
    switch (name) {
      case 'search_system':
        return withCost(executeSearchSystem(args));

      case 'navigate_to':
        return executeNavigateTo(args);

      case 'schedule_call':
        return executeScheduleCall(args);

      case 'list_themes':
        return executeListThemes(args);

      case 'open_search_app':
        return executeOpenSearchApp(args);

      case 'show_weather':
        return executeShowWeather(args);

      case 'show_kanban_tasks':
        return executeShowKanbanTasks(args);

      case 'show_photos':
        return executeShowPhotos(args);

      case 'render_ui':
        return executeRenderUI(args);

      // Agentic Product Lifecycle Tools
      case 'create_project':
        return executeCreateProject(args);

      case 'create_prd':
        return executeCreatePRD(args);

      case 'create_ticket':
        return executeCreateTicket(args);

      case 'update_ticket':
        return executeUpdateTicket(args);

      case 'shard_prd':
        return executeShardPRD(args);

      case 'get_project_kanban':
        return executeGetProjectKanban(args);

      case 'list_projects':
        return executeListProjects(args);

      // Scheduling Tools
      case 'get_available_times':
        return await executeGetAvailableTimes(args);

      case 'get_upcoming_bookings':
        return await executeGetUpcomingBookings(args);

      case 'book_meeting':
        return await executeBookMeeting(args);

      case 'reschedule_meeting':
        return await executeRescheduleMeeting(args);

      case 'cancel_meeting':
        return await executeCancelMeeting(args);

      // Memory Tools (RLM - Recursive Memory Layer)
      // SECURITY: These tools require authenticated userId
      case 'remember':
        return await executeRemember(args, context);

      case 'recall_preference':
        return await executeRecallPreference(args, context);

      case 'memorize':
        return await executeMemorize(args, context);

      case 'learn':
        return await executeLearn(args, context);

      case 'forget':
        return await executeForget(args, context);

      // OpenClaw Coding Tools
      case 'set_active_context':
        return await executeSetActiveContext(args);

      case 'get_active_context':
        return await executeGetActiveContext(args);

      case 'load_context_from_reference':
        return await executeLoadContextFromReference(args);

      case 'clone_repository':
        return await executeCloneRepository(args);

      case 'list_directory':
        return await executeListDirectory(args);

      case 'search_codebase':
        return await executeSearchCodebase(args);

      case 'read_file':
        return await executeReadFile(args);

      case 'write_file':
        return await executeWriteFile(args);

      case 'edit_file':
        return await executeEditFile(args);

      case 'delete_file':
        return await executeDeleteFile(args);

      case 'run_command':
        return await executeRunCommand(args);

      case 'start_dev_server':
        return await executeStartDevServer(args);

      case 'get_preview_url':
        return await executeGetPreviewUrl(args);

      case 'git_status':
        return await executeGitStatus(args);

      case 'git_diff':
        return await executeGitDiff(args);

      case 'git_commit':
        return await executeGitCommit(args);

      case 'git_push':
        return await executeGitPush(args);

      case 'create_branch':
        return await executeCreateBranch(args);

      case 'create_coding_task':
        return await executeCreateCodingTask(args);

      case 'update_coding_task':
        return await executeUpdateCodingTask(args);

      case 'list_coding_tasks':
        return await executeListCodingTasks(args);

      // Cron Job Tools
      // SECURITY: These tools require authenticated userId
      case 'create_cron_job':
        return await executeCreateCronJob(args, context);

      case 'list_cron_jobs':
        return await executeListCronJobs(args, context);

      case 'toggle_cron_job':
        return await executeToggleCronJob(args);

      case 'delete_cron_job':
        return await executeDeleteCronJob(args);

      // Compaction Tools
      // SECURITY: Compaction uses memory APIs that require userId
      case 'compact_conversation':
        return await executeCompactConversation(args, context);

      case 'get_compaction_summary':
        return await executeGetCompactionSummary(args);

      // ======================================================================
      // Channel Integration Tools
      // SECURITY: Channel tools require authenticated userId
      // ======================================================================
      case 'list_channel_integrations':
        return await executeListChannelIntegrations(args, context);

      case 'get_channel_conversations':
        return await executeGetChannelConversations(args, context);

      case 'send_channel_message':
        return await executeSendChannelMessage(args, context);

      case 'search_channel_messages':
        return await executeSearchChannelMessages(args, context);

      // ERV Dimension Tools
      case 'create_dimension':
        return await executeCreateDimension(args);

      case 'navigate_to_dimension':
        return executeNavigateToDimension(args);

      case 'list_dimensions':
        return await executeListDimensions(args);

      case 'search_entities':
        return await executeSearchEntities(args);

      // ERV Ontology Tools - AI-Assisted Classification
      case 'analyze_and_create_entity':
        return await executeAnalyzeAndCreateEntity(args, context);

      case 'suggest_entity_relationships':
        return await executeSuggestEntityRelationships(args, context);

      case 'bulk_classify_entities':
        return await executeBulkClassifyEntities(args, context);

      // Video/Remotion Tools
      case 'create_video_composition':
        return executeCreateVideoComposition(args);
      case 'add_text_overlay':
        return executeAddTextOverlay(args);
      case 'add_lyrics_to_video':
        return executeAddLyricsToVideo(args);
      case 'add_media_to_video':
        return executeAddMediaToVideo(args);
      case 'preview_video':
        return executePreviewVideo(args);
      case 'render_video':
        return await executeRenderVideo(args);
      case 'sync_lyrics_to_audio':
        return await executeSyncLyricsToAudio(args);
      case 'get_render_status':
        return await executeGetRenderStatus(args);

      // Talking Video Tools
      case 'create_talking_video':
        return await executeCreateTalkingVideo(args);
      case 'generate_video_script':
        return await executeGenerateVideoScript(args);
      case 'generate_voice_audio':
        return await executeGenerateVoiceAudio(args);
      case 'navigate_to_video_studio':
        return executeNavigateToVideoStudio(args);

      // LTX-2 Video Generation Tools
      case 'generate_video':
        return await executeGenerateVideo(args);
      case 'animate_image':
        return await executeAnimateImage(args);
      case 'list_video_presets':
        return executeListVideoPresets();

      // AI Provider Tools
      case 'get_ai_provider_status':
        return executeGetAIProviderStatus(args);

      case 'navigate_to_ai_settings':
        return executeNavigateToAISettings();

      // Kanban Task Reading Tools
      case 'get_kanban_task':
        return await executeGetKanbanTask(args);
      case 'search_kanban_tasks':
        return await executeSearchKanbanTasks(args);

      // Design Canvas Tools
      case 'create_canvas':
        return await executeCreateCanvas(args, context);
      case 'list_canvases':
        return await executeListCanvases(args, context);
      case 'get_canvas':
        return await executeGetCanvas(args);
      case 'add_canvas_node':
        return await executeAddCanvasNode(args, context);
      case 'add_canvas_edge':
        return await executeAddCanvasEdge(args);
      case 'update_canvas_node':
        return await executeUpdateCanvasNode(args);

      // Apple Health Tools
      case 'get_health_summary':
        return await executeGetHealthSummary(args, context);
      case 'get_health_trends':
        return await executeGetHealthTrends(args, context);
      case 'get_health_metric':
        return await executeGetHealthMetric(args, context);
      case 'compare_health_periods':
        return await executeCompareHealthPeriods(args, context);
      case 'generate_health_api_key':
        return await executeGenerateHealthApiKey(args, context);
      case 'list_health_api_keys':
        return await executeListHealthApiKeys(context);
      case 'revoke_health_api_key':
        return await executeRevokeHealthApiKey(args, context);
      case 'get_health_sync_status':
        return await executeGetHealthSyncStatus(args, context);

      // =========================================================================
      // Autonomous Execution Tools
      // =========================================================================
      case 'spawn_task':
        return await executeSpawnTask(args);

      case 'list_background_tasks':
        return await executeListBackgroundTasks(args);

      case 'cancel_background_task':
        return await executeCancelBackgroundTask(args);

      case 'get_task_result':
        return await executeGetTaskResult(args);

      case 'iterate_on_code':
        return await executeIterateOnCode(args);

      case 'delegate_to_specialist':
        return await executeDelegateToSpecialist(args);

      // =========================================================================
      // Music Generation Tools (ACE-Step via Lynkr)
      // =========================================================================
      case 'cowrite_music':
        return await executeCowriteMusic(args, context);

      case 'generate_music':
        return await executeGenerateMusic(args, context);

      case 'analyze_audio':
        return await executeAnalyzeAudio(args, context);

      case 'separate_stems':
        return await executeSeparateStems(args, context);

      default:
        return withCost({
          success: false,
          error: `Unknown tool: ${name}`,
        });
    }
  } catch (error) {
    return withCost({
      success: false,
      error: error instanceof Error ? error.message : 'Tool execution failed',
    });
  }
}

// Execute multiple tool calls
export async function executeTools(
  toolCalls: ToolCall[]
): Promise<Map<string, ToolResult>> {
  const results = new Map<string, ToolResult>();

  for (const toolCall of toolCalls) {
    const result = await executeTool(toolCall);
    results.set(toolCall.name, result);
  }

  return results;
}

// Format tool results for the AI to use in response
export function formatToolResults(
  results: Map<string, ToolResult>
): string {
  const sections: string[] = [];

  for (const [toolName, result] of results) {
    if (result.success) {
      sections.push(`[${toolName}]: ${JSON.stringify(result.data)}`);
    } else {
      sections.push(`[${toolName}]: Error - ${result.error}`);
    }
  }

  return sections.join('\n\n');
}

// Individual tool executors

function executeSearchSystem(
  args: Record<string, unknown>
): ToolResult {
  const query = args.query as string;
  const category = (args.category as SearchOptions['category']) || 'all';

  if (!query) {
    return {
      success: false,
      error: 'Search query is required',
    };
  }

  const results = searchSystem(query, { category, limit: 8 });
  const formattedResults = formatSearchResults(results);

  return {
    success: true,
    data: {
      query,
      category,
      resultCount: results.length,
      results: results.map((r: any) => ({
        type: r.type,
        title: r.title,
        description: r.description.slice(0, 200),
        url: r.url,
        metadata: r.metadata,
      })),
      formatted: formattedResults,
    },
    action: {
      type: 'show_results',
      payload: {
        results,
        query,
      },
    },
  };
}

function executeNavigateTo(args: Record<string, unknown>): ToolResult {
  const destination = args.destination as string;
  const theme = args.theme as string | undefined;

  // Validate destination
  if (!NAVIGATION_DESTINATIONS.includes(destination as NavigationDestination)) {
    return {
      success: false,
      error: `Invalid destination: ${destination}. Valid destinations: ${NAVIGATION_DESTINATIONS.join(', ')}`,
    };
  }

  // Validate theme if provided
  if (theme && !themes.some((t) => t.name === theme)) {
    return {
      success: false,
      error: `Invalid theme: ${theme}`,
    };
  }

  // Build the URL
  const destinationMap: Record<string, string> = {
    home: '/',
    story: '/story',
    design: '/design',
    resume: '/resume',
    projects: '/projects',
    blog: '/blog',
    music: '/music',
    humans: '/humans',
    themes: '/design',
    photos: '/photos',
    video: '/video',
    canvas: '/canvas',
    search: '/search',
  };

  let url = destinationMap[destination] || `/${destination}`;

  if (theme) {
    url += `${url.includes('?') ? '&' : '?'}theme=${theme}`;
  }

  return {
    success: true,
    data: {
      destination,
      url,
      theme,
      message: `Navigating to ${destination}${theme ? ` with the ${theme} theme` : ''}`,
    },
    action: {
      type: 'navigate',
      payload: {
        url,
        destination,
        theme,
      },
    },
  };
}

function executeScheduleCall(args: Record<string, unknown>): ToolResult {
  const topic = args.topic as string | undefined;

  // Calendly URL - would be configured in env
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/james-spalding';

  let url = calendlyUrl;
  if (topic) {
    // Calendly supports prefilling via query params
    url += `?a1=${encodeURIComponent(topic)}`;
  }

  return {
    success: true,
    data: {
      url,
      topic,
      message: topic
        ? `Opening calendar to schedule a call about: ${topic}`
        : 'Opening calendar to schedule a call',
    },
    action: {
      type: 'open_calendar',
      payload: {
        url,
        topic,
      },
    },
  };
}

function executeListThemes(args: Record<string, unknown>): ToolResult {
  const category = args.category as string | undefined;

  const allThemes = getAllThemes(category);

  // Group themes for better presentation
  const themeList = allThemes.map((t) => t.title).join(', ');

  return {
    success: true,
    data: {
      count: allThemes.length,
      themes: allThemes.map((t) => ({
        name: t.metadata?.themeName,
        label: t.title,
        url: t.url,
      })),
      formatted: `Available themes (${allThemes.length}): ${themeList}`,
    },
  };
}

// New tool executors for rich components

function executeOpenSearchApp(args: Record<string, unknown>): ToolResult {
  const query = args.query as string;

  if (!query) {
    return {
      success: false,
      error: 'Search query is required',
    };
  }

  return {
    success: true,
    data: {
      query,
      message: `Opening Search app with query: "${query}"`,
    },
    action: {
      type: 'open_search',
      payload: {
        url: `/search?q=${encodeURIComponent(query)}`,
        query,
      },
    },
  };
}

function executeShowWeather(args: Record<string, unknown>): ToolResult {
  const location = (args.location as string) || 'San Francisco';

  // Mock weather data for now - in production would call a weather API
  const conditions = ['sunny', 'cloudy', 'rainy', 'windy'] as const;
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

  const weatherData = {
    location,
    temperature: Math.floor(55 + Math.random() * 25), // 55-80°F
    condition: randomCondition,
    humidity: Math.floor(40 + Math.random() * 40),
    windSpeed: Math.floor(5 + Math.random() * 15),
  };

  return {
    success: true,
    data: weatherData,
  };
}

function executeShowKanbanTasks(args: Record<string, unknown>): ToolResult {
  const filter = (args.filter as string) || 'all';
  const tag = args.tag as string | undefined;
  const limit = (args.limit as number) || 5;

  // Import sample tasks from kanban types would be ideal
  // For now, return some representative tasks
  const sampleTasks = [
    {
      id: 'p8-1',
      title: '[P8] 8gent Search - Tool Definitions',
      description: 'Create tools.ts with search_system, navigate_to, schedule_call, list_themes.',
      status: 'done' as const,
      priority: 'high' as const,
      tags: ['P8', 'claw-ai', 'tools'],
    },
    {
      id: 'p8-2',
      title: '[P8] 8gent Search - Convex Integration',
      description: 'Integrate search with Convex backend for persistent indexing.',
      status: 'in-progress' as const,
      priority: 'high' as const,
      tags: ['P8', 'claw-ai', 'search', 'convex'],
    },
    {
      id: 'p0-1',
      title: '[P0] Command Palette - Core Component',
      description: 'Create CommandPalette.tsx with Liquid Glass styling.',
      status: 'todo' as const,
      priority: 'urgent' as const,
      tags: ['P0', 'command-palette', 'macro'],
    },
    {
      id: 'p1-1',
      title: '[P1] Projects Landing - Folder Cards',
      description: 'Create ProjectsLanding.tsx with folder cards.',
      status: 'todo' as const,
      priority: 'high' as const,
      tags: ['P1', 'projects', 'landing'],
    },
    {
      id: 'done-1',
      title: 'Next.js 14 App Router Setup',
      description: 'Initial project setup with Next.js 14, TypeScript, and Tailwind CSS',
      status: 'done' as const,
      priority: 'high' as const,
      tags: ['foundation', 'setup'],
    },
  ];

  // Filter tasks
  let filteredTasks = sampleTasks;

  if (filter !== 'all') {
    filteredTasks = filteredTasks.filter((t) => t.status === filter);
  }

  if (tag) {
    filteredTasks = filteredTasks.filter((t) =>
      t.tags.some((taskTag) => taskTag.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  const tasks = filteredTasks.slice(0, limit);

  return {
    success: true,
    data: {
      filter,
      tag,
      count: tasks.length,
      tasks,
    },
  };
}

function executeShowPhotos(args: Record<string, unknown>): ToolResult {
  const count = (args.count as number) || 6;

  // Real photos from James's gallery - Irish landscapes and nature photography
  const galleryPhotos = [
    { id: '1', src: '/photos/aurora.jpeg', alt: 'Aurora Borealis', caption: 'Northern Lights over Ireland' },
    { id: '2', src: '/photos/Sunriseoverhowth.jpeg', alt: 'Sunrise over Howth', caption: 'Sunrise over Howth, Dublin' },
    { id: '3', src: '/photos/Donabatebeach.jpeg', alt: 'Donabate Beach', caption: 'Donabate Beach, North Dublin' },
    { id: '4', src: '/photos/SunsetPortrane.jpeg', alt: 'Sunset at Portrane', caption: 'Sunset at Portrane' },
    { id: '5', src: '/photos/Glenofthedowns.jpeg', alt: 'Glen of the Downs', caption: 'Glen of the Downs, Wicklow' },
    { id: '6', src: '/photos/Robin.jpeg', alt: 'Robin', caption: 'Robin in the garden' },
    { id: '7', src: '/photos/Nightsky.jpeg', alt: 'Night Sky', caption: 'Night sky photography' },
    { id: '8', src: '/photos/Mistysunrise.jpeg', alt: 'Misty Sunrise', caption: 'Misty morning sunrise' },
    { id: '9', src: '/photos/Corballis.jpeg', alt: 'Corballis', caption: 'Corballis, North Dublin' },
    { id: '10', src: '/photos/sunsetachill.jpeg', alt: 'Sunset Achill', caption: 'Sunset at Achill Island' },
    { id: '11', src: '/photos/SunsetSalvador.jpeg', alt: 'Sunset Salvador', caption: 'Sunset in Salvador, Brazil' },
    { id: '12', src: '/photos/Portranedemense.jpeg', alt: 'Portrane Demesne', caption: 'Portrane Demesne woods' },
  ];

  const photos = galleryPhotos.slice(0, Math.min(count, galleryPhotos.length));

  return {
    success: true,
    data: {
      count: photos.length,
      photos,
      message: `Showing ${photos.length} photos from the user's gallery. These are mostly from Ireland where the system was developed.`,
    },
  };
}

function executeRenderUI(args: Record<string, unknown>): ToolResult {
  const uiTree = args.ui_tree as Record<string, unknown> | undefined;
  const title = args.title as string | undefined;

  if (!uiTree) {
    return {
      success: false,
      error: 'UI tree is required',
    };
  }

  // Validate basic structure
  if (!uiTree.root || !uiTree.elements) {
    return {
      success: false,
      error: 'Invalid UI tree structure. Must have "root" and "elements" properties.',
    };
  }

  return {
    success: true,
    data: {
      title,
      ui_tree: uiTree,
    },
    action: {
      type: 'render_ui',
      payload: {
        title,
        ui_tree: uiTree,
      },
    },
  };
}

// =============================================================================
// Agentic Product Lifecycle Tool Executors
// These tools enable 8gent to create and manage projects, PRDs, and tickets
// Inspired by BMAD-METHOD and CCPM workflows
// =============================================================================

/**
 * Create a new product project
 * This is the entry point for the agentic product lifecycle
 */
function executeCreateProject(args: Record<string, unknown>): ToolResult {
  const name = args.name as string;
  const description = args.description as string | undefined;
  const color = args.color as string | undefined;

  if (!name) {
    return {
      success: false,
      error: 'Project name is required',
    };
  }

  // Generate a temporary project ID - the actual creation happens via Convex mutation
  // This returns an action that the frontend will use to call the Convex mutation
  const tempSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return {
    success: true,
    data: {
      name,
      description,
      color: color || '#8b5cf6',
      slug: tempSlug,
      message: `Creating project "${name}"...`,
    },
    action: {
      type: 'project_created',
      payload: {
        name,
        description,
        color: color || '#8b5cf6',
        slug: tempSlug,
        // Frontend will call Convex mutation with these args
        convexMutation: 'agentic:createProductProject',
      },
    },
  };
}

/**
 * Create a Product Requirements Document (PRD)
 * Following BMAD methodology for structured requirements
 */
function executeCreatePRD(args: Record<string, unknown>): ToolResult {
  const projectId = args.projectId as string;
  const title = args.title as string;
  const executiveSummary = args.executiveSummary as string | undefined;
  const problemStatement = args.problemStatement as string | undefined;

  if (!projectId) {
    return {
      success: false,
      error: 'Project ID is required to create a PRD',
    };
  }

  if (!title) {
    return {
      success: false,
      error: 'PRD title is required',
    };
  }

  return {
    success: true,
    data: {
      projectId,
      title,
      executiveSummary,
      problemStatement,
      message: `Creating PRD "${title}"...`,
    },
    action: {
      type: 'prd_created',
      payload: {
        projectId,
        title,
        executiveSummary,
        problemStatement,
        generatedBy: 'ai',
        convexMutation: 'agentic:createPRD',
      },
    },
  };
}

/**
 * Create a ticket/story on the Kanban board
 * Supports BMAD user story format (As a... I want... So that...)
 */
function executeCreateTicket(args: Record<string, unknown>): ToolResult {
  const projectId = args.projectId as string;
  const title = args.title as string;
  const description = args.description as string | undefined;
  const type = (args.type as string) || 'story';
  const priority = (args.priority as string) || 'P2';
  const asA = args.asA as string | undefined;
  const iWant = args.iWant as string | undefined;
  const soThat = args.soThat as string | undefined;
  const labels = args.labels as string[] | undefined;

  if (!projectId) {
    return {
      success: false,
      error: 'Project ID is required to create a ticket',
    };
  }

  if (!title) {
    return {
      success: false,
      error: 'Ticket title is required',
    };
  }

  return {
    success: true,
    data: {
      projectId,
      title,
      description,
      type,
      priority,
      asA,
      iWant,
      soThat,
      labels,
      message: `Creating ticket "${title}"...`,
    },
    action: {
      type: 'ticket_created',
      payload: {
        projectId,
        title,
        description,
        type,
        priority,
        asA,
        iWant,
        soThat,
        labels,
        createdBy: 'ai',
        convexMutation: 'agentic:createTicket',
      },
    },
  };
}

/**
 * Update an existing ticket
 * Can change status, priority, description, and other fields
 */
function executeUpdateTicket(args: Record<string, unknown>): ToolResult {
  const ticketId = args.ticketId as string;
  const status = args.status as string | undefined;
  const priority = args.priority as string | undefined;
  const title = args.title as string | undefined;
  const description = args.description as string | undefined;
  const assigneeId = args.assigneeId as string | undefined;

  if (!ticketId) {
    return {
      success: false,
      error: 'Ticket ID is required',
    };
  }

  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (priority) updates.priority = priority;
  if (title) updates.title = title;
  if (description) updates.description = description;
  if (assigneeId) updates.assigneeId = assigneeId;

  if (Object.keys(updates).length === 0) {
    return {
      success: false,
      error: 'At least one field to update is required',
    };
  }

  return {
    success: true,
    data: {
      ticketId,
      updates,
      message: `Updating ticket ${ticketId}...`,
    },
    action: {
      type: 'ticket_updated',
      payload: {
        ticketId,
        ...updates,
        convexMutation: 'agentic:updateTicket',
      },
    },
  };
}

/**
 * Shard a PRD into epics and tickets
 * Converts functional requirements into actionable Kanban items
 */
function executeShardPRD(args: Record<string, unknown>): ToolResult {
  const prdId = args.prdId as string;
  const projectId = args.projectId as string;

  if (!prdId) {
    return {
      success: false,
      error: 'PRD ID is required',
    };
  }

  if (!projectId) {
    return {
      success: false,
      error: 'Project ID is required',
    };
  }

  return {
    success: true,
    data: {
      prdId,
      projectId,
      message: 'Sharding PRD into epics and tickets...',
    },
    action: {
      type: 'prd_sharded',
      payload: {
        prdId,
        projectId,
        convexMutation: 'agentic:shardPRDToTickets',
      },
    },
  };
}

/**
 * Get the Kanban board for a project
 * Returns tickets organized by status columns
 */
function executeGetProjectKanban(args: Record<string, unknown>): ToolResult {
  const projectId = args.projectId as string;

  if (!projectId) {
    return {
      success: false,
      error: 'Project ID is required',
    };
  }

  return {
    success: true,
    data: {
      projectId,
      message: 'Loading Kanban board...',
    },
    action: {
      type: 'show_kanban',
      payload: {
        projectId,
        convexQuery: 'agentic:getKanbanBoard',
      },
    },
  };
}

/**
 * List all product projects
 * Can filter by status
 */
function executeListProjects(args: Record<string, unknown>): ToolResult {
  const status = args.status as string | undefined;

  return {
    success: true,
    data: {
      status,
      message: status ? `Loading ${status} projects...` : 'Loading all projects...',
    },
    action: {
      type: 'render_component',
      payload: {
        componentType: 'projects',
        status,
        convexQuery: 'agentic:getProductProjects',
      },
    },
  };
}

/**
 * Get available meeting times for a specific date
 */
async function executeGetAvailableTimes(args: Record<string, unknown>): Promise<ToolResult> {
  const date = args.date as string | undefined;
  const duration = (args.duration as number) || 30;

  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return {
        success: false,
        error: 'Convex URL not configured',
      };
    }

    const client = new ConvexHttpClient(convexUrl);

    // Get default event type (30-minute call) or first active event type
    const eventTypes = await client.query(api.scheduling.getEventTypes, {});
    const eventType = eventTypes?.find((et) => et.isActive && et.duration === duration) || eventTypes?.[0];

    if (!eventType) {
      return {
        success: false,
        error: 'No active event types found',
      };
    }

    const targetDate = date || new Date().toISOString().split('T')[0];
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const slots = await client.query(api.scheduling.getAvailableSlots, {
      eventTypeId: eventType._id,
      date: targetDate,
      timezone,
    });

    const slotTimes = slots?.map((s: { time?: string; timestamp?: number }) => {
      if (s.time) return s.time;
      if (s.timestamp) return new Date(s.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return '';
    }).filter(Boolean) || [];

    return {
      success: true,
      data: {
        date: targetDate,
        duration,
        slots: slots || [],
        formatted: slotTimes.length > 0
          ? `Available times on ${targetDate}: ${slotTimes.join(', ')}`
          : `No available times on ${targetDate}`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get available times',
    };
  }
}

/**
 * Get upcoming scheduled bookings
 */
async function executeGetUpcomingBookings(args: Record<string, unknown>): Promise<ToolResult> {
  const limit = (args.limit as number) || 5;

  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return {
        success: false,
        error: 'Convex URL not configured',
      };
    }

    const client = new ConvexHttpClient(convexUrl);

    // Get bookings for the authenticated user
    // Note: This requires authentication context, which may not be available in tool executor
    // For now, return a message indicating the user should check the calendar
    return {
      success: true,
      data: {
        message: 'To view upcoming bookings, please check the calendar dashboard at /calendar',
        limit,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get upcoming bookings',
    };
  }
}

/**
 * Book a meeting with the admin
 */
async function executeBookMeeting(args: Record<string, unknown>): Promise<ToolResult> {
  const guestName = args.guestName as string;
  const guestEmail = args.guestEmail as string;
  const startTime = args.startTime as number;
  const topic = args.topic as string | undefined;
  const duration = (args.duration as number) || 30;

  if (!guestName || !guestEmail || !startTime) {
    return {
      success: false,
      error: 'guestName, guestEmail, and startTime are required',
    };
  }

  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return {
        success: false,
        error: 'Convex URL not configured',
      };
    }

    const client = new ConvexHttpClient(convexUrl);

    // Get default event type matching the duration
    // Note: This requires authentication - will work when called from authenticated context
    const eventTypes = await client.query(api.scheduling.getEventTypes, {});
    const eventType = eventTypes?.find((et) => et.isActive && et.duration === duration) || eventTypes?.[0];

    if (!eventType) {
      return {
        success: false,
        error: 'No active event type found for the specified duration. Please ensure you are authenticated and have created event types.',
      };
    }

    const guestTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Create booking
    const bookingId = await client.mutation(api.scheduling.createBooking, {
      eventTypeId: eventType._id,
      guestName,
      guestEmail,
      guestTimezone,
      startTime,
      notes: topic,
    });

    return {
      success: true,
      data: {
        bookingId,
        guestName,
        guestEmail,
        startTime: new Date(startTime).toISOString(),
        duration,
        message: `Meeting booked successfully for ${guestName} on ${new Date(startTime).toLocaleString()}`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to book meeting',
    };
  }
}

/**
 * Reschedule an existing meeting
 */
async function executeRescheduleMeeting(args: Record<string, unknown>): Promise<ToolResult> {
  const bookingId = args.bookingId as string;
  const newStartTime = args.newStartTime as number;

  if (!bookingId || !newStartTime) {
    return {
      success: false,
      error: 'bookingId and newStartTime are required',
    };
  }

  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return {
        success: false,
        error: 'Convex URL not configured',
      };
    }

    const client = new ConvexHttpClient(convexUrl);

    const newBookingId = await client.mutation(api.scheduling.rescheduleBooking, {
      id: bookingId as Id<'bookings'>,
      newStartTime,
    });

    return {
      success: true,
      data: {
        oldBookingId: bookingId,
        newBookingId,
        newStartTime: new Date(newStartTime).toISOString(),
        message: `Meeting rescheduled to ${new Date(newStartTime).toLocaleString()}`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reschedule meeting',
    };
  }
}

/**
 * Cancel a scheduled meeting
 */
async function executeCancelMeeting(args: Record<string, unknown>): Promise<ToolResult> {
  const bookingId = args.bookingId as string;
  const reason = args.reason as string | undefined;

  if (!bookingId) {
    return {
      success: false,
      error: 'bookingId is required',
    };
  }

  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return {
        success: false,
        error: 'Convex URL not configured',
      };
    }

    const client = new ConvexHttpClient(convexUrl);

    await client.mutation(api.scheduling.updateBookingStatus, {
      id: bookingId as Id<'bookings'>,
      status: 'cancelled',
      cancelReason: reason,
      cancelledBy: 'host',
    });

    return {
      success: true,
      data: {
        bookingId,
        message: `Meeting cancelled${reason ? `: ${reason}` : ''}`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel meeting',
    };
  }
}

// =============================================================================
// Memory Tools (RLM - Recursive Memory Layer)
// These tools enable 8gent to actively manage memories for the owner
// =============================================================================

/**
 * Search through memories to recall past interactions, decisions, preferences
 */
async function executeRemember(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const query = args.query as string;
  const memoryType = (args.memoryType as string) || 'all';
  const limit = (args.limit as number) || 10;

  if (!query) {
    return {
      success: false,
      error: 'Query is required to search memories',
    };
  }

  try {
    const userId = getEffectiveUserId(context);
    const memoryManager = getMemoryManager();

    // Search both episodic and semantic memories
    const result = await memoryManager.loadRelevantMemories(
      userId,
      query,
      { limit, includeEpisodic: true, includeSemantic: true }
    );

    // Filter by memory type if specified
    let episodic = result.episodic;
    if (memoryType !== 'all') {
      episodic = episodic.filter(m => m.memoryType === memoryType);
    }

    const memoriesFound = episodic.length + result.semantic.length;

    // Format memories for display
    const formattedEpisodic = episodic.map(m => ({
      id: m._id,
      type: m.memoryType,
      content: m.content,
      importance: m.importance,
      timestamp: m.timestamp,
    }));

    const formattedSemantic = result.semantic.map(m => ({
      id: m._id,
      category: m.category,
      key: m.key,
      value: m.value,
      confidence: m.confidence,
    }));

    return {
      success: true,
      data: {
        query,
        memoriesFound,
        episodic: formattedEpisodic,
        semantic: formattedSemantic,
        contextSummary: result.contextSummary,
        message: memoriesFound > 0
          ? `Found ${memoriesFound} relevant memories`
          : 'No memories found matching your query',
      },
      action: {
        type: 'memory_recalled',
        payload: {
          query,
          count: memoriesFound,
          episodic: formattedEpisodic,
          semantic: formattedSemantic,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search memories',
    };
  }
}

/**
 * Recall specific preferences, patterns, or learned facts
 */
async function executeRecallPreference(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const category = args.category as SemanticCategory;
  const key = args.key as string | undefined;

  if (!category) {
    return {
      success: false,
      error: 'Category is required to recall preferences',
    };
  }

  try {
    const userId = getEffectiveUserId(context);
    const memoryManager = getMemoryManager();

    // Get semantic memories by category
    const memories = await memoryManager.loadSemanticMemories(
      userId,
      [category]
    );

    // Filter by key if provided
    let filtered = memories;
    if (key) {
      filtered = memories.filter(m => m.key.includes(key));
    }

    // Sort by confidence
    filtered.sort((a, b) => b.confidence - a.confidence);

    const formattedMemories = filtered.map(m => ({
      id: m._id,
      category: m.category,
      key: m.key,
      value: m.value,
      confidence: m.confidence,
      lastUpdated: m.updatedAt,
    }));

    return {
      success: true,
      data: {
        category,
        key,
        count: formattedMemories.length,
        preferences: formattedMemories,
        message: formattedMemories.length > 0
          ? `Found ${formattedMemories.length} ${category}(s)`
          : `No ${category}s found${key ? ` matching "${key}"` : ''}`,
      },
      action: {
        type: 'memory_recalled',
        payload: {
          category,
          key,
          preferences: formattedMemories,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to recall preferences',
    };
  }
}

/**
 * Store an important memory explicitly
 */
async function executeMemorize(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const content = args.content as string;
  const memoryType = args.memoryType as EpisodicMemoryType;
  const importance = (args.importance as number) || 0.7;
  const projectId = args.projectId as string | undefined;

  if (!content) {
    return {
      success: false,
      error: 'Content is required to store a memory',
    };
  }

  if (!memoryType) {
    return {
      success: false,
      error: 'Memory type is required',
    };
  }

  // Validate importance is between 0 and 1
  const validImportance = Math.max(0, Math.min(1, importance));

  try {
    const userId = getEffectiveUserId(context);
    const memoryManager = getMemoryManager();

    const memoryId = await memoryManager.storeEpisodicMemory(
      userId,
      content,
      memoryType,
      validImportance,
      projectId as Id<'productProjects'> | undefined,
      { toolsUsed: ['memorize'], outcome: 'Explicitly stored by user request' }
    );

    return {
      success: true,
      data: {
        memoryId,
        content,
        memoryType,
        importance: validImportance,
        message: `Memory stored successfully as a ${memoryType} with importance ${validImportance}`,
      },
      action: {
        type: 'memory_stored',
        payload: {
          memoryId,
          content,
          memoryType,
          importance: validImportance,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to store memory',
    };
  }
}

/**
 * Learn a new fact, preference, skill, or pattern
 */
async function executeLearn(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const category = args.category as SemanticCategory;
  const key = args.key as string;
  const value = args.value as string;
  const confidence = (args.confidence as number) || 0.7;

  if (!category || !key || !value) {
    return {
      success: false,
      error: 'Category, key, and value are required to learn something new',
    };
  }

  // Validate confidence is between 0 and 1
  const validConfidence = Math.max(0, Math.min(1, confidence));

  try {
    const userId = getEffectiveUserId(context);
    const memoryManager = getMemoryManager();

    const memoryId = await memoryManager.upsertSemanticMemory(
      userId,
      category,
      key,
      value,
      validConfidence,
      'learn_tool'
    );

    return {
      success: true,
      data: {
        memoryId,
        category,
        key,
        value,
        confidence: validConfidence,
        message: `Learned: ${category} "${key}" = "${value}" (confidence: ${validConfidence})`,
      },
      action: {
        type: 'memory_learned',
        payload: {
          memoryId,
          category,
          key,
          value,
          confidence: validConfidence,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to learn',
    };
  }
}

/**
 * Remove a specific memory
 */
async function executeForget(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const memoryId = args.memoryId as string;
  const memoryKind = args.memoryKind as 'episodic' | 'semantic';

  if (!memoryId) {
    return {
      success: false,
      error: 'Memory ID is required to forget a memory',
    };
  }

  if (!memoryKind || !['episodic', 'semantic'].includes(memoryKind)) {
    return {
      success: false,
      error: 'Memory kind must be either "episodic" or "semantic"',
    };
  }

  try {
    const userId = getEffectiveUserId(context);
    const memoryManager = getMemoryManager();

    if (memoryKind === 'episodic') {
      await memoryManager.deleteEpisodicMemory(
        memoryId as Id<'episodicMemories'>,
        userId
      );
    } else {
      await memoryManager.deleteSemanticMemory(
        memoryId as Id<'semanticMemories'>,
        userId
      );
    }

    return {
      success: true,
      data: {
        memoryId,
        memoryKind,
        message: `Memory deleted successfully`,
      },
      action: {
        type: 'memory_deleted',
        payload: {
          memoryId,
          memoryKind,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete memory',
    };
  }
}

// =============================================================================
// OpenClaw Coding Tools - Full coding agent capabilities
// These tools enable 8gent to clone repos, read/write files, execute
// commands, and manage git operations.
// @see docs/planning/infinity-agent-coding-integration.md
// =============================================================================

// --------------------------------------------------------------------------
// Working Context Tools
// --------------------------------------------------------------------------

/**
 * Set the active working context
 */
async function executeSetActiveContext(args: Record<string, unknown>): Promise<ToolResult> {
  const projectId = args.projectId as string | undefined;
  const projectSlug = args.projectSlug as string | undefined;
  const prdId = args.prdId as string | undefined;
  const ticketId = args.ticketId as string | undefined;
  const canvasId = args.canvasId as string | undefined;
  const sandboxId = args.sandboxId as string | undefined;
  const repositoryUrl = args.repositoryUrl as string | undefined;

  // This action will be handled by the frontend to call the Convex mutation
  return {
    success: true,
    data: {
      projectId,
      projectSlug,
      prdId,
      ticketId,
      canvasId,
      sandboxId,
      repositoryUrl,
      message: 'Setting active context...',
    },
    action: {
      type: 'context_updated',
      payload: {
        projectId,
        projectSlug,
        prdId,
        ticketId,
        canvasId,
        sandboxId,
        repositoryUrl,
        convexMutation: 'workingContext:updateActiveContext',
      },
    },
  };
}

/**
 * Get the active working context
 */
async function executeGetActiveContext(args: Record<string, unknown>): Promise<ToolResult> {
  // This action will be handled by the frontend to query the Convex data
  return {
    success: true,
    data: {
      message: 'Loading active context...',
    },
    action: {
      type: 'context_loaded',
      payload: {
        convexQuery: 'workingContext:getActiveContext',
      },
    },
  };
}

/**
 * Load full context chain from an @mention reference
 */
async function executeLoadContextFromReference(args: Record<string, unknown>): Promise<ToolResult> {
  const referenceType = args.referenceType as string;
  const referenceId = args.referenceId as string;

  if (!referenceType || !referenceId) {
    return {
      success: false,
      error: 'Reference type and ID are required',
    };
  }

  // Map reference type to appropriate Convex query
  const queryMap: Record<string, string> = {
    ticket: 'workingContext:loadContextFromTicket',
    project: 'workingContext:loadContextFromProject',
    prd: 'workingContext:loadContextFromPRD',
    epic: 'workingContext:loadContextFromEpic',
    canvas: 'workingContext:loadContextFromCanvas',
    memory: 'workingContext:loadContextFromMemory',
  };

  const convexQuery = queryMap[referenceType];
  if (!convexQuery) {
    return {
      success: false,
      error: `Unknown reference type: ${referenceType}`,
    };
  }

  return {
    success: true,
    data: {
      referenceType,
      referenceId,
      message: `Loading context for @${referenceType}:${referenceId}...`,
    },
    action: {
      type: 'context_loaded',
      payload: {
        referenceType,
        referenceId,
        convexQuery,
      },
    },
  };
}

// --------------------------------------------------------------------------
// Repository Operations
// --------------------------------------------------------------------------

/**
 * Clone a GitHub repository to the sandbox
 */
async function executeCloneRepository(args: Record<string, unknown>): Promise<ToolResult> {
  const url = args.url as string;
  const branch = args.branch as string | undefined;

  if (!url) {
    return {
      success: false,
      error: 'Repository URL is required',
    };
  }

  // Validate branch name to prevent command injection
  if (branch && !isValidGitBranch(branch)) {
    return {
      success: false,
      error: 'Invalid branch name. Branch names can only contain letters, numbers, dots, slashes, underscores, and hyphens.',
    };
  }

  // Validate URL format
  const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/;
  if (!githubRegex.test(url.replace(/\.git$/, ''))) {
    return {
      success: false,
      error: 'Invalid GitHub repository URL. Expected format: https://github.com/owner/repo',
    };
  }

  // Parse owner and repo from URL
  const match = url.replace(/\.git$/, '').match(/github\.com\/([\w-]+)\/([\w.-]+)/);
  const owner = match?.[1];
  const repo = match?.[2];

  return {
    success: true,
    data: {
      url,
      branch,
      owner,
      repo,
      message: `Cloning ${owner}/${repo}${branch ? ` (branch: ${branch})` : ''}...`,
    },
    action: {
      type: 'repo_cloned',
      payload: {
        url,
        branch,
        owner,
        repo,
        sandboxOperation: 'clone',
      },
    },
  };
}

/**
 * List files and directories in the sandbox
 */
async function executeListDirectory(args: Record<string, unknown>): Promise<ToolResult> {
  const path = args.path as string;
  const recursive = (args.recursive as boolean) || false;
  const maxDepth = (args.maxDepth as number) || 3;

  if (!path) {
    return {
      success: false,
      error: 'Path is required',
    };
  }

  return {
    success: true,
    data: {
      path,
      recursive,
      maxDepth,
      message: `Listing ${recursive ? 'recursively ' : ''}${path}...`,
    },
    action: {
      type: 'directory_listed',
      payload: {
        path,
        recursive,
        maxDepth,
        sandboxOperation: 'listDir',
      },
    },
  };
}

/**
 * Search for patterns in the codebase
 */
async function executeSearchCodebase(args: Record<string, unknown>): Promise<ToolResult> {
  const pattern = args.pattern as string;
  const path = (args.path as string) || '.';
  const filePattern = args.filePattern as string | undefined;
  const caseSensitive = (args.caseSensitive as boolean) || false;
  const maxResults = (args.maxResults as number) || 50;

  if (!pattern) {
    return {
      success: false,
      error: 'Search pattern is required',
    };
  }

  return {
    success: true,
    data: {
      pattern,
      path,
      filePattern,
      caseSensitive,
      maxResults,
      message: `Searching for "${pattern}"${filePattern ? ` in ${filePattern} files` : ''}...`,
    },
    action: {
      type: 'files_searched',
      payload: {
        pattern,
        path,
        filePattern,
        caseSensitive,
        maxResults,
        sandboxOperation: 'grep',
      },
    },
  };
}

// --------------------------------------------------------------------------
// File Operations
// --------------------------------------------------------------------------

/**
 * Read a file from the sandbox
 */
async function executeReadFile(args: Record<string, unknown>): Promise<ToolResult> {
  const path = args.path as string;
  const startLine = args.startLine as number | undefined;
  const endLine = args.endLine as number | undefined;

  if (!path) {
    return {
      success: false,
      error: 'File path is required',
    };
  }

  // SECURITY: Validate path before reading
  const validation = validatePath(path);
  if (!validation.valid) {
    return pathValidationError(validation.error || 'Invalid path');
  }

  return {
    success: true,
    data: {
      path: validation.normalizedPath,
      startLine,
      endLine,
      message: `Reading ${validation.normalizedPath}${startLine ? ` (lines ${startLine}-${endLine || 'end'})` : ''}...`,
    },
    action: {
      type: 'file_read',
      payload: {
        path: validation.normalizedPath,
        startLine,
        endLine,
        sandboxOperation: 'readFile',
      },
    },
  };
}

/**
 * Write content to a file in the sandbox
 */
async function executeWriteFile(args: Record<string, unknown>): Promise<ToolResult> {
  const path = args.path as string;
  const content = args.content as string;
  const createDirectories = (args.createDirectories as boolean) ?? true;

  if (!path) {
    return {
      success: false,
      error: 'File path is required',
    };
  }

  if (content === undefined || content === null) {
    return {
      success: false,
      error: 'Content is required',
    };
  }

  // SECURITY: Validate path before writing
  const validation = validatePath(path);
  if (!validation.valid) {
    return pathValidationError(validation.error || 'Invalid path');
  }

  return {
    success: true,
    data: {
      path: validation.normalizedPath,
      contentLength: content.length,
      createDirectories,
      message: `Writing to ${validation.normalizedPath} (${content.length} characters)...`,
    },
    action: {
      type: 'file_written',
      payload: {
        path: validation.normalizedPath,
        content,
        createDirectories,
        sandboxOperation: 'writeFile',
      },
    },
  };
}

/**
 * Make surgical edits to a file
 */
async function executeEditFile(args: Record<string, unknown>): Promise<ToolResult> {
  const path = args.path as string;
  const oldText = args.oldText as string;
  const newText = args.newText as string;
  const replaceAll = (args.replaceAll as boolean) || false;

  if (!path) {
    return {
      success: false,
      error: 'File path is required',
    };
  }

  if (!oldText) {
    return {
      success: false,
      error: 'Old text to replace is required',
    };
  }

  if (newText === undefined || newText === null) {
    return {
      success: false,
      error: 'New text is required',
    };
  }

  // SECURITY: Validate path before editing
  const validation = validatePath(path);
  if (!validation.valid) {
    return pathValidationError(validation.error || 'Invalid path');
  }

  return {
    success: true,
    data: {
      path: validation.normalizedPath,
      replaceAll,
      message: `Editing ${validation.normalizedPath}${replaceAll ? ' (all occurrences)' : ''}...`,
    },
    action: {
      type: 'file_written',
      payload: {
        path: validation.normalizedPath,
        oldText,
        newText,
        replaceAll,
        sandboxOperation: 'editFile',
      },
    },
  };
}

/**
 * Delete a file or directory
 */
async function executeDeleteFile(args: Record<string, unknown>): Promise<ToolResult> {
  const path = args.path as string;
  const recursive = (args.recursive as boolean) || false;

  if (!path) {
    return {
      success: false,
      error: 'Path is required',
    };
  }

  // SECURITY: Validate path before deleting
  const validation = validatePath(path);
  if (!validation.valid) {
    return pathValidationError(validation.error || 'Invalid path');
  }

  return {
    success: true,
    data: {
      path: validation.normalizedPath,
      recursive,
      message: `Deleting ${validation.normalizedPath}${recursive ? ' (recursive)' : ''}...`,
    },
    action: {
      type: 'file_written',
      payload: {
        path: validation.normalizedPath,
        recursive,
        sandboxOperation: 'delete',
      },
    },
  };
}

// --------------------------------------------------------------------------
// Execution
// --------------------------------------------------------------------------

/**
 * Execute a shell command in the sandbox
 *
 * SECURITY: Commands MUST be executed within a sandbox environment.
 * The frontend/sandbox context is responsible for:
 * 1. Ensuring a sandbox is active
 * 2. Setting resource limits (CPU, memory, time)
 * 3. Network isolation (whitelisted domains only)
 * 4. Auto-termination after 30 minutes
 */
async function executeRunCommand(args: Record<string, unknown>): Promise<ToolResult> {
  const command = args.command as string;
  const cwd = args.cwd as string | undefined;
  const timeout = Math.min((args.timeout as number) || 60000, 300000); // Max 5 minutes

  if (!command) {
    return {
      success: false,
      error: 'Command is required',
    };
  }

  // SECURITY: Validate command for dangerous patterns
  const validation = validateCommand(command);
  if (!validation.valid) {
    return commandValidationError(validation.error || 'Invalid command');
  }

  // SECURITY: Validate network access in command (Phase 1.5)
  const networkValidation = validateCommandNetworkAccess(command);
  if (!networkValidation.valid) {
    return networkValidationError(networkValidation.error || 'Network access denied');
  }

  // Validate cwd if provided
  if (cwd) {
    const cwdValidation = validatePath(cwd);
    if (!cwdValidation.valid) {
      return pathValidationError(`Working directory: ${cwdValidation.error}`);
    }
  }

  return {
    success: true,
    data: {
      command,
      cwd,
      timeout,
      message: `Running: ${command}${cwd ? ` (in ${cwd})` : ''}...`,
      warning: validation.warning,
      // IMPORTANT: requiresSandbox flag tells frontend this MUST run in sandbox
      requiresSandbox: true,
    },
    action: {
      type: 'command_executed',
      payload: {
        command,
        cwd,
        timeout,
        sandboxOperation: 'exec',
      },
    },
  };
}

/**
 * Start a development server
 */
async function executeStartDevServer(args: Record<string, unknown>): Promise<ToolResult> {
  const command = (args.command as string) || 'npm run dev';
  const port = (args.port as number) || 3000;

  return {
    success: true,
    data: {
      command,
      port,
      message: `Starting dev server on port ${port}...`,
    },
    action: {
      type: 'server_started',
      payload: {
        command,
        port,
        sandboxOperation: 'startServer',
      },
    },
  };
}

/**
 * Get the preview URL for the running sandbox
 */
async function executeGetPreviewUrl(args: Record<string, unknown>): Promise<ToolResult> {
  return {
    success: true,
    data: {
      message: 'Getting preview URL...',
    },
    action: {
      type: 'preview_ready',
      payload: {
        sandboxOperation: 'getPreviewUrl',
      },
    },
  };
}

// --------------------------------------------------------------------------
// Git Operations
// --------------------------------------------------------------------------

/**
 * Get git status
 */
async function executeGitStatus(args: Record<string, unknown>): Promise<ToolResult> {
  return {
    success: true,
    data: {
      message: 'Getting git status...',
    },
    action: {
      type: 'git_status',
      payload: {
        sandboxOperation: 'gitStatus',
      },
    },
  };
}

/**
 * Get git diff
 */
async function executeGitDiff(args: Record<string, unknown>): Promise<ToolResult> {
  const path = args.path as string | undefined;
  const staged = (args.staged as boolean) || false;

  return {
    success: true,
    data: {
      path,
      staged,
      message: `Getting ${staged ? 'staged ' : ''}diff${path ? ` for ${path}` : ''}...`,
    },
    action: {
      type: 'git_diff',
      payload: {
        path,
        staged,
        sandboxOperation: 'gitDiff',
      },
    },
  };
}

/**
 * Commit changes
 */
async function executeGitCommit(args: Record<string, unknown>): Promise<ToolResult> {
  const message = args.message as string;
  const stageAll = (args.stageAll as boolean) || false;

  if (!message) {
    return {
      success: false,
      error: 'Commit message is required',
    };
  }

  return {
    success: true,
    data: {
      message,
      stageAll,
      commitMessage: message,
    },
    action: {
      type: 'git_committed',
      payload: {
        message,
        stageAll,
        sandboxOperation: 'gitCommit',
      },
    },
  };
}

/**
 * Push commits to remote
 */
async function executeGitPush(args: Record<string, unknown>): Promise<ToolResult> {
  const branch = args.branch as string | undefined;
  const setUpstream = (args.setUpstream as boolean) ?? true;

  return {
    success: true,
    data: {
      branch,
      setUpstream,
      message: `Pushing${branch ? ` to ${branch}` : ''}...`,
    },
    action: {
      type: 'git_pushed',
      payload: {
        branch,
        setUpstream,
        sandboxOperation: 'gitPush',
      },
    },
  };
}

/**
 * Create and checkout a new branch
 */
async function executeCreateBranch(args: Record<string, unknown>): Promise<ToolResult> {
  const name = args.name as string | undefined;
  const fromBranch = args.fromBranch as string | undefined;

  // If no name provided, indicate that it should be auto-generated from context
  const branchInfo = name
    ? { name, autoGenerated: false }
    : { autoGenerated: true, message: 'Branch name will be generated from active ticket context' };

  return {
    success: true,
    data: {
      ...branchInfo,
      fromBranch,
      message: name
        ? `Creating branch ${name}${fromBranch ? ` from ${fromBranch}` : ''}...`
        : 'Creating branch from ticket context...',
    },
    action: {
      type: 'branch_created',
      payload: {
        name,
        fromBranch,
        autoGenerate: !name,
        sandboxOperation: 'gitBranch',
      },
    },
  };
}

// --------------------------------------------------------------------------
// Coding Task Management
// --------------------------------------------------------------------------

/**
 * Create a new coding task
 */
async function executeCreateCodingTask(args: Record<string, unknown>): Promise<ToolResult> {
  const title = args.title as string;
  const description = args.description as string;
  const projectId = args.projectId as string | undefined;
  const ticketId = args.ticketId as string | undefined;
  const repositoryUrl = args.repositoryUrl as string | undefined;

  if (!title || !description) {
    return {
      success: false,
      error: 'Title and description are required',
    };
  }

  return {
    success: true,
    data: {
      title,
      description,
      projectId,
      ticketId,
      repositoryUrl,
      message: `Creating coding task: ${title}...`,
    },
    action: {
      type: 'coding_task_created',
      payload: {
        title,
        description,
        projectId,
        ticketId,
        repositoryUrl,
        agent: 'claude-code',
        convexMutation: 'workingContext:createCodingTask',
      },
    },
  };
}

/**
 * Update a coding task
 */
async function executeUpdateCodingTask(args: Record<string, unknown>): Promise<ToolResult> {
  const taskId = args.taskId as string;
  const status = args.status as string | undefined;
  const filesModified = args.filesModified as string[] | undefined;
  const commitSha = args.commitSha as string | undefined;

  if (!taskId) {
    return {
      success: false,
      error: 'Task ID is required',
    };
  }

  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (filesModified) updates.filesModified = filesModified;
  if (commitSha) updates.commitSha = commitSha;

  return {
    success: true,
    data: {
      taskId,
      updates,
      message: `Updating coding task ${taskId}...`,
    },
    action: {
      type: 'coding_task_updated',
      payload: {
        taskId,
        ...updates,
        convexMutation: 'workingContext:updateCodingTaskStatus',
      },
    },
  };
}

/**
 * List coding tasks
 */
async function executeListCodingTasks(args: Record<string, unknown>): Promise<ToolResult> {
  const status = args.status as string | undefined;
  const limit = (args.limit as number) || 10;

  return {
    success: true,
    data: {
      status,
      limit,
      message: status
        ? `Loading ${status} coding tasks...`
        : 'Loading coding tasks...',
    },
    action: {
      type: 'render_component',
      payload: {
        componentType: 'codingTasks',
        status,
        limit,
        convexQuery: 'workingContext:listCodingTasks',
      },
    },
  };
}

// =============================================================================
// Cron Job Tool Executors
// =============================================================================

/**
 * Parse natural language schedule time into schedule configuration
 */
function parseScheduleTime(
  scheduleType: string,
  scheduleTime?: string,
  daysOfWeek?: number[]
): {
  runAt?: number;
  intervalMinutes?: number;
  hour?: number;
  minute?: number;
  daysOfWeek?: number[];
  cronExpression?: string;
} {
  const now = new Date();

  switch (scheduleType) {
    case 'once': {
      if (!scheduleTime) {
        // Default to 1 hour from now
        return { runAt: Date.now() + 60 * 60 * 1000 };
      }

      // Try parsing as ISO date or relative time
      const parsed = Date.parse(scheduleTime);
      if (!isNaN(parsed)) {
        return { runAt: parsed };
      }

      // Handle relative times like "in 2 hours", "in 30 minutes"
      const relativeMatch = scheduleTime.match(/in\s+(\d+)\s+(minute|hour|day)s?/i);
      if (relativeMatch) {
        const amount = parseInt(relativeMatch[1]);
        const unit = relativeMatch[2].toLowerCase();
        const multipliers: Record<string, number> = {
          minute: 60 * 1000,
          hour: 60 * 60 * 1000,
          day: 24 * 60 * 60 * 1000,
        };
        return { runAt: Date.now() + amount * multipliers[unit] };
      }

      // Handle "tomorrow at 9am" style
      const tomorrowMatch = scheduleTime.match(/tomorrow\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
      if (tomorrowMatch) {
        let hour = parseInt(tomorrowMatch[1]);
        const minute = tomorrowMatch[2] ? parseInt(tomorrowMatch[2]) : 0;
        const ampm = tomorrowMatch[3]?.toLowerCase();
        if (ampm === 'pm' && hour < 12) hour += 12;
        if (ampm === 'am' && hour === 12) hour = 0;

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(hour, minute, 0, 0);
        return { runAt: tomorrow.getTime() };
      }

      return { runAt: Date.now() + 60 * 60 * 1000 };
    }

    case 'interval': {
      // Parse interval like "30", "60", "every 2 hours"
      if (!scheduleTime) return { intervalMinutes: 60 };

      const intervalMatch = scheduleTime.match(/(\d+)\s*(minute|hour)?s?/i);
      if (intervalMatch) {
        const amount = parseInt(intervalMatch[1]);
        const unit = intervalMatch[2]?.toLowerCase() || 'minute';
        return { intervalMinutes: unit === 'hour' ? amount * 60 : amount };
      }
      return { intervalMinutes: 60 };
    }

    case 'daily': {
      // Parse time like "9:00", "9am", "14:30"
      if (!scheduleTime) return { hour: 9, minute: 0 };

      const timeMatch = scheduleTime.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
      if (timeMatch) {
        let hour = parseInt(timeMatch[1]);
        const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const ampm = timeMatch[3]?.toLowerCase();
        if (ampm === 'pm' && hour < 12) hour += 12;
        if (ampm === 'am' && hour === 12) hour = 0;
        return { hour, minute };
      }
      return { hour: 9, minute: 0 };
    }

    case 'weekly': {
      // Parse time and use provided daysOfWeek
      const timeConfig = parseScheduleTime('daily', scheduleTime);
      return {
        hour: timeConfig.hour,
        minute: timeConfig.minute,
        daysOfWeek: daysOfWeek || [1], // Default to Monday
      };
    }

    case 'cron': {
      return { cronExpression: scheduleTime || '0 9 * * *' };
    }

    default:
      return { hour: 9, minute: 0 };
  }
}

/**
 * Create a new scheduled cron job
 */
async function executeCreateCronJob(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const name = args.name as string;
  const description = args.description as string | undefined;
  const scheduleType = args.scheduleType as string;
  const scheduleTime = args.scheduleTime as string | undefined;
  const daysOfWeek = args.daysOfWeek as number[] | undefined;
  const actionType = args.actionType as string;
  const prompt = args.prompt as string | undefined;
  const emailSubject = args.emailSubject as string | undefined;
  const emailBody = args.emailBody as string | undefined;
  const recipientEmail = args.recipientEmail as string | undefined;
  const webhookUrl = args.webhookUrl as string | undefined;
  const deliveryChannel = args.deliveryChannel as string | undefined;
  const timezone = (args.timezone as string) || 'America/Los_Angeles';

  if (!name) {
    return {
      success: false,
      error: 'Job name is required',
    };
  }

  if (!scheduleType || !['once', 'interval', 'daily', 'weekly', 'cron'].includes(scheduleType)) {
    return {
      success: false,
      error: 'Valid schedule type is required: once, interval, daily, weekly, or cron',
    };
  }

  if (!actionType || !['ai_message', 'notification', 'email', 'webhook', 'memory_snapshot'].includes(actionType)) {
    return {
      success: false,
      error: 'Valid action type is required: ai_message, notification, email, webhook, or memory_snapshot',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const userId = getEffectiveUserId(context);
    const client = new ConvexHttpClient(convexUrl);

    const scheduleConfig = {
      ...parseScheduleTime(scheduleType, scheduleTime, daysOfWeek),
      timezone,
    };

    const actionPayload: Record<string, unknown> = {};
    if (prompt) actionPayload.prompt = prompt;
    if (emailSubject) actionPayload.subject = emailSubject;
    if (emailBody) actionPayload.body = emailBody;
    if (recipientEmail) actionPayload.recipientEmail = recipientEmail;
    if (webhookUrl) actionPayload.webhookUrl = webhookUrl;

    const deliverTo = deliveryChannel
      ? { channel: deliveryChannel as 'web' | 'email' | 'whatsapp' | 'telegram' | 'imessage' }
      : undefined;

    const result = await client.mutation(api.userCronJobs.createJob, {
      userId,
      name,
      description,
      scheduleType: scheduleType as 'once' | 'interval' | 'daily' | 'weekly' | 'cron',
      scheduleConfig,
      actionType: actionType as 'ai_message' | 'notification' | 'email' | 'webhook' | 'memory_snapshot',
      actionPayload,
      deliverTo,
    });

    return {
      success: true,
      data: {
        jobId: result.jobId,
        name,
        scheduleType,
        actionType,
        message: `Created scheduled job "${name}" (${result.jobId})`,
      },
      action: {
        type: 'cron_job_created',
        payload: {
          jobId: result.jobId,
          name,
          scheduleType,
          actionType,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create cron job',
    };
  }
}

/**
 * List user's cron jobs
 */
async function executeListCronJobs(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const includeInactive = args.includeInactive as boolean | undefined;

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const userId = getEffectiveUserId(context);
    const client = new ConvexHttpClient(convexUrl);

    const jobs = await client.query(api.userCronJobs.getUserJobs, {
      userId,
      includeInactive: includeInactive ?? false,
    });

    const jobSummaries = jobs.map((job) => ({
      jobId: job.jobId,
      name: job.name,
      description: job.description,
      scheduleType: job.scheduleType,
      actionType: job.actionType,
      isActive: job.isActive,
      nextRunAt: job.nextRunAt ? new Date(job.nextRunAt).toISOString() : null,
      lastRunAt: job.lastRunAt ? new Date(job.lastRunAt).toISOString() : null,
      lastRunStatus: job.lastRunStatus,
      runCount: job.runCount,
      successCount: job.successCount,
      errorCount: job.errorCount,
    }));

    return {
      success: true,
      data: {
        jobs: jobSummaries,
        count: jobs.length,
        message: jobs.length > 0
          ? `Found ${jobs.length} scheduled job${jobs.length === 1 ? '' : 's'}`
          : 'No scheduled jobs found',
      },
      action: {
        type: 'cron_jobs_listed',
        payload: {
          count: jobs.length,
          jobs: jobSummaries,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list cron jobs',
    };
  }
}

/**
 * Toggle a cron job active/inactive
 */
async function executeToggleCronJob(args: Record<string, unknown>): Promise<ToolResult> {
  const jobId = args.jobId as string;

  if (!jobId) {
    return {
      success: false,
      error: 'Job ID is required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const result = await client.mutation(api.userCronJobs.toggleJob, {
      jobId,
    });

    return {
      success: true,
      data: {
        jobId,
        isActive: result.isActive,
        message: `Job ${jobId} is now ${result.isActive ? 'active' : 'paused'}`,
      },
      action: {
        type: 'cron_job_updated',
        payload: {
          jobId,
          isActive: result.isActive,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle cron job',
    };
  }
}

/**
 * Delete a cron job
 */
async function executeDeleteCronJob(args: Record<string, unknown>): Promise<ToolResult> {
  const jobId = args.jobId as string;

  if (!jobId) {
    return {
      success: false,
      error: 'Job ID is required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    await client.mutation(api.userCronJobs.deleteJob, {
      jobId,
    });

    return {
      success: true,
      data: {
        jobId,
        message: `Deleted scheduled job ${jobId}`,
      },
      action: {
        type: 'cron_job_deleted',
        payload: {
          jobId,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete cron job',
    };
  }
}

// =============================================================================
// Conversation Compaction Executors
// =============================================================================

/**
 * Compact a conversation by summarizing older messages
 */
async function executeCompactConversation(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const sessionId = args.sessionId as string;
  const keepRecentCount = (args.keepRecentCount as number) || 10;
  const instructions = args.instructions as string | undefined;

  if (!sessionId) {
    return {
      success: false,
      error: 'Session ID is required',
    };
  }

  try {
    const userId = getEffectiveUserId(context);

    // Call the compact API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/chat/compact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        keepRecentCount,
        instructions,
        // Note: messages would be passed by the client hook, not here
        // This tool is more for triggering compaction from the AI side
        messages: [], // Placeholder - actual messages come from client
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Compaction request failed',
      };
    }

    const result = await response.json();

    // ========================================================================
    // MEMORY INTEGRATION - Extract memories from compaction
    // ========================================================================
    let episodicMemoryId: string | undefined;
    const semanticMemoryIds: string[] = [];

    try {
      const memoryManager = getMemoryManager();

      // 1. Create episodic memory for the conversation summary
      if (result.summary) {
        episodicMemoryId = await memoryManager.storeEpisodicMemory(
          userId,
          result.summary,
          'milestone' as EpisodicMemoryType, // conversation_summary maps to milestone
          0.6, // Medium-high importance for compacted conversations
          undefined, // No project context
          {
            toolsUsed: ['compact_conversation'],
            outcome: `Auto-extracted from conversation compaction (${result.originalMessageCount} messages, topics: ${result.topics?.join(', ') || 'none'})`,
          }
        );
      }

      // 2. Extract semantic memories from decisions
      if (result.decisions && Array.isArray(result.decisions)) {
        for (const decision of result.decisions) {
          const decisionText = typeof decision === 'string' ? decision : JSON.stringify(decision);
          const memId = await memoryManager.upsertSemanticMemory(
            userId,
            'preference' as SemanticCategory, // Decisions are user preferences
            `decision_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            decisionText,
            0.8, // High confidence for explicit decisions
            `compaction_${result.compactionId}`
          );
          if (memId) semanticMemoryIds.push(memId);
        }
      }

      // 3. Extract semantic memories from key points (as facts)
      if (result.keyPoints && Array.isArray(result.keyPoints)) {
        for (const keyPoint of result.keyPoints) {
          const keyPointText = typeof keyPoint === 'string' ? keyPoint : JSON.stringify(keyPoint);
          const memId = await memoryManager.upsertSemanticMemory(
            userId,
            'fact' as SemanticCategory,
            `keypoint_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            keyPointText,
            0.7, // Good confidence for key points
            `compaction_${result.compactionId}`
          );
          if (memId) semanticMemoryIds.push(memId);
        }
      }
    } catch (memoryError) {
      // Log but don't fail compaction if memory extraction fails
      console.error('Memory extraction from compaction failed:', memoryError);
    }

    return {
      success: true,
      data: {
        compactionId: result.compactionId,
        summary: result.summary,
        keyPoints: result.keyPoints,
        decisions: result.decisions,
        openQuestions: result.openQuestions,
        topics: result.topics,
        originalMessageCount: result.originalMessageCount,
        tokensSaved: result.tokensSaved,
        message: `Compacted ${result.originalMessageCount} messages, saved ~${result.tokensSaved} tokens`,
        // Memory integration results
        memoryExtracted: true,
        episodicMemoryId,
        semanticMemoryCount: semanticMemoryIds.length,
      },
      action: {
        type: 'conversation_compacted',
        payload: {
          compactionId: result.compactionId,
          summary: result.summary,
          keyPoints: result.keyPoints,
          tokensSaved: result.tokensSaved,
          episodicMemoryId,
          semanticMemoryIds,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to compact conversation',
    };
  }
}

/**
 * Get existing compaction summary for a session
 */
async function executeGetCompactionSummary(args: Record<string, unknown>): Promise<ToolResult> {
  const sessionId = args.sessionId as string;

  if (!sessionId) {
    return {
      success: false,
      error: 'Session ID is required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const compaction = await client.query(api.compaction.getLatestCompaction, {
      sessionId,
    });

    if (!compaction) {
      return {
        success: true,
        data: {
          found: false,
          message: 'No compaction found for this session',
        },
      };
    }

    return {
      success: true,
      data: {
        found: true,
        compactionId: compaction.compactionId,
        summary: compaction.summary,
        keyPoints: compaction.keyPoints,
        decisions: compaction.decisions,
        openQuestions: compaction.openQuestions,
        topics: compaction.topics,
        originalMessageCount: compaction.originalMessageCount,
        createdAt: new Date(compaction.createdAt).toISOString(),
        message: `Found compaction from ${new Date(compaction.createdAt).toLocaleDateString()}`,
      },
      action: {
        type: 'compaction_retrieved',
        payload: {
          compactionId: compaction.compactionId,
          summary: compaction.summary,
          keyPoints: compaction.keyPoints,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get compaction summary',
    };
  }
}

// ============================================================================
// CHANNEL INTEGRATION TOOLS - WhatsApp, Telegram, iMessage, Slack, Discord
// ============================================================================

/**
 * List all connected channel integrations
 */
async function executeListChannelIntegrations(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const includeDisabled = args.includeDisabled as boolean || false;

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const userId = getEffectiveUserId(context);
    const client = new ConvexHttpClient(convexUrl);

    const integrations = await client.query(api.channels.getUserIntegrations, {
      userId,
    });

    // Filter based on includeDisabled
    const filtered = includeDisabled
      ? integrations
      : integrations.filter((i) => i.settings?.enabled);

    return {
      success: true,
      data: {
        integrations: filtered.map((i) => ({
          id: i._id,
          platform: i.platform,
          enabled: i.settings?.enabled ?? false,
          status: i.connectionStatus,
          identifier: i.platformUserId,
        })),
        count: filtered.length,
        message: `Found ${filtered.length} channel integration${filtered.length !== 1 ? 's' : ''}`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list channel integrations',
    };
  }
}

/**
 * Get conversations from connected channels
 */
async function executeGetChannelConversations(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const platform = args.platform as string | undefined;
  const limit = (args.limit as number) || 20;

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const userId = getEffectiveUserId(context);
    const client = new ConvexHttpClient(convexUrl);

    const conversations = await client.query(api.channels.getConversations, {
      userId,
    });

    // Filter by platform if specified and limit results
    const filtered = conversations
      .filter((c) => !platform || c.platform === platform)
      .slice(0, limit);

    return {
      success: true,
      data: {
        conversations: filtered.map((c) => ({
          recipientId: c.platformUserId,
          recipientName: c.platformUsername || c.platformUserId,
          platform: c.platform,
          lastMessage: c.lastMessage?.content || '',
          lastMessageAt: c.lastMessage ? new Date(c.lastMessage._creationTime).toISOString() : '',
          unreadCount: c.unreadCount ?? 0,
          integrationId: c.integrationId,
        })),
        count: conversations.length,
        message: `Found ${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}${platform ? ` on ${platform}` : ''}`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get channel conversations',
    };
  }
}

/**
 * Send a message via a connected channel
 */
async function executeSendChannelMessage(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const integrationId = args.integrationId as string;
  const recipientId = args.recipientId as string;
  const content = args.content as string;
  const messageType = (args.messageType as string) || 'text';

  if (!integrationId || !content) {
    return {
      success: false,
      error: 'Integration ID and content are required',
    };
  }

  // SECURITY: Validate message content for phishing/social engineering
  const contentValidation = validateMessageContent(content);
  if (!contentValidation.valid) {
    return messageValidationError(contentValidation.error || 'Invalid message content');
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const userId = getEffectiveUserId(context);
    const client = new ConvexHttpClient(convexUrl);

    // First, get the integration to determine the platform and credentials
    const integration = await client.query(api.channels.getIntegration, {
      integrationId,
    });

    if (!integration) {
      return {
        success: false,
        error: 'Integration not found',
      };
    }

    // Check if integration is enabled
    if (!integration.settings.enabled) {
      return {
        success: false,
        error: 'Integration is disabled',
      };
    }

    // Use the recipient from the integration if not provided
    const targetRecipient = recipientId || integration.platformUserId;

    // Send the message via the outbound router
    const sendResult = await sendMessage(
      {
        integrationId,
        platform: integration.platform as Platform,
        recipientId: targetRecipient,
        content,
        messageType: messageType as 'text' | 'voice' | 'image',
      },
      integration.credentials
    );

    if (!sendResult.success) {
      return {
        success: false,
        error: sendResult.error || 'Failed to send message',
      };
    }

    // Log the outbound message
    // NOTE: Rate limiting should be enforced in the Convex mutation (per-recipient limits)
    const { messageId } = await client.mutation(api.channels.logOutboundMessage, {
      integrationId,
      userId,
      platform: integration.platform,
      platformMessageId: sendResult.platformMessageId,
      content,
      messageType: messageType as 'text' | 'voice' | 'image' | 'document' | 'sticker',
      toolsUsed: ['send_channel_message'],
    });

    // Include any warnings about suspicious URLs
    const warnings = contentValidation.warnings;

    return {
      success: true,
      data: {
        messageId,
        platformMessageId: sendResult.platformMessageId,
        sent: true,
        platform: integration.platform,
        recipientId: targetRecipient,
        content: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
        message: `Message sent successfully via ${integration.platform}`,
        warnings, // Include any security warnings
      },
      action: {
        type: 'message_sent' as const,
        payload: {
          messageId,
          integrationId,
          recipientId: targetRecipient,
          platform: integration.platform,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send channel message',
    };
  }
}

/**
 * Search messages across all connected channels
 */
async function executeSearchChannelMessages(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const query = args.query as string;
  const platform = args.platform as string | undefined;
  const limit = (args.limit as number) || 20;

  if (!query) {
    return {
      success: false,
      error: 'Search query is required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const userId = getEffectiveUserId(context);
    const client = new ConvexHttpClient(convexUrl);

    const messages = await client.query(api.channels.searchMessages, {
      userId,
      query,
      limit,
    });

    // Filter by platform if specified
    const filtered = platform
      ? messages.filter((m) => m.platform === platform)
      : messages;

    return {
      success: true,
      data: {
        messages: filtered.map((m) => ({
          id: m._id,
          platform: m.platform,
          direction: m.direction,
          content: m.content,
          timestamp: new Date(m._creationTime).toISOString(),
          contact: m.integrationId,
        })),
        count: messages.length,
        query,
        message: `Found ${messages.length} message${messages.length !== 1 ? 's' : ''} matching "${query}"`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search channel messages',
    };
  }
}

// =============================================================================
// ERV DIMENSION TOOLS - Create, navigate, and search dimensions/entities
// =============================================================================

/**
 * Preset dimension configurations for reference
 */
const PRESET_DIMENSIONS = [
  { id: 'feed', name: 'Feed', icon: '📰', description: 'Chronological stream of all entities' },
  { id: 'kanban', name: 'Kanban', icon: '📋', description: 'Ticket and task management board' },
  { id: 'graph', name: 'Graph', icon: '🕸️', description: 'Entity relationship visualization' },
  { id: 'graph-3d', name: 'Graph 3D', icon: '🌐', description: 'Immersive 3D relationship space' },
  { id: 'calendar', name: 'Calendar', icon: '📅', description: 'Time-based event visualization' },
  { id: 'grid', name: 'Grid', icon: '🖼️', description: 'Gallery-style entity browser' },
  { id: 'table', name: 'Table', icon: '📊', description: 'Spreadsheet-like data view' },
  { id: 'ipod', name: 'iPod', icon: '🎵', description: 'Music-centric navigation' },
  { id: 'quest-log', name: 'Quest Log', icon: '⚔️', description: 'Gamified task progression' },
  { id: 'skill-tree', name: 'Skill Tree', icon: '🌳', description: 'Interconnected skill progression' },
];

/**
 * Map metaphors to dimension configurations
 */
const METAPHOR_CONFIGS: Record<string, Partial<{
  container: string;
  arrangement: string;
  entityShape: string;
  connectionStyle: string;
  gradient: string;
}>> = {
  river: { container: 'frame', arrangement: 'list', entityShape: 'square', connectionStyle: 'none', gradient: 'from-blue-500 to-cyan-500' },
  board: { container: 'panel', arrangement: 'grid', entityShape: 'square', connectionStyle: 'none', gradient: 'from-violet-500 to-purple-500' },
  constellation: { container: 'frame', arrangement: 'graph', entityShape: 'circle', connectionStyle: 'curve', gradient: 'from-emerald-500 to-green-500' },
  solar: { container: 'frame', arrangement: 'orbit', entityShape: 'circle', connectionStyle: 'glow', gradient: 'from-pink-500 to-rose-500' },
  timeline: { container: 'panel', arrangement: 'list', entityShape: 'square', connectionStyle: 'line', gradient: 'from-amber-500 to-orange-500' },
  mosaic: { container: 'frame', arrangement: 'grid', entityShape: 'square', connectionStyle: 'none', gradient: 'from-cyan-500 to-teal-500' },
  ledger: { container: 'panel', arrangement: 'list', entityShape: 'square', connectionStyle: 'none', gradient: 'from-slate-500 to-zinc-500' },
  vinyl: { container: 'card', arrangement: 'flow', entityShape: 'square', connectionStyle: 'none', gradient: 'from-indigo-500 to-blue-500' },
  dungeon: { container: 'panel', arrangement: 'tree', entityShape: 'hexagon', connectionStyle: 'arrow', gradient: 'from-red-500 to-orange-500' },
  tree: { container: 'frame', arrangement: 'tree', entityShape: 'circle', connectionStyle: 'curve', gradient: 'from-emerald-500 to-teal-500' },
};

/**
 * Create a custom dimension
 */
async function executeCreateDimension(args: Record<string, unknown>): Promise<ToolResult> {
  const name = args.name as string;
  const metaphor = args.metaphor as string;
  const arrangement = args.arrangement as string;
  const entityTypes = args.entityTypes as string[] | undefined;
  const description = args.description as string | undefined;

  if (!name || !metaphor || !arrangement) {
    return {
      success: false,
      error: 'Name, metaphor, and arrangement are required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    // Get metaphor configuration
    const metaphorConfig = METAPHOR_CONFIGS[metaphor] || METAPHOR_CONFIGS['mosaic'];

    // Build dimension config
    const config = {
      container: metaphorConfig.container,
      arrangement: arrangement,
      entityShape: metaphorConfig.entityShape,
      connectionStyle: metaphorConfig.connectionStyle,
      decorations: [{ type: 'shadow' }],
      interactions: [
        { type: 'click', action: 'navigate' },
        { type: 'longpress', action: 'reveal' },
      ],
      transition: 'morph',
      filter: entityTypes?.length ? { entityTypes } : undefined,
    };

    const result = await client.mutation(api.erv.createDimension, {
      name,
      description: description || `Custom ${metaphor} dimension`,
      metaphor,
      config: JSON.stringify(config),
      icon: METAPHOR_CONFIGS[metaphor] ? '✨' : '📐',
      gradient: metaphorConfig.gradient,
      allowedEntityTypes: entityTypes,
    });

    return {
      success: true,
      data: {
        dimensionId: result.dimensionId,
        name,
        metaphor,
        arrangement,
        entityTypes: entityTypes || 'all',
        message: `Created dimension "${name}" with ${metaphor} metaphor`,
      },
      action: {
        type: 'dimension_created',
        payload: {
          dimensionId: result.dimensionId,
          name,
          metaphor,
          navigateTo: `/d/${result.dimensionId}`,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create dimension',
    };
  }
}

/**
 * Navigate to a dimension
 */
function executeNavigateToDimension(args: Record<string, unknown>): ToolResult {
  const dimensionId = args.dimensionId as string;

  if (!dimensionId) {
    return {
      success: false,
      error: 'Dimension ID is required',
    };
  }

  // Check if it's a preset
  const preset = PRESET_DIMENSIONS.find((d) => d.id === dimensionId);
  const name = preset?.name || dimensionId;

  return {
    success: true,
    data: {
      dimensionId,
      name,
      isPreset: !!preset,
      message: `Navigating to ${name} dimension...`,
    },
    action: {
      type: 'dimension_navigated',
      payload: {
        dimensionId,
        name,
        navigateTo: `/d/${dimensionId}`,
      },
    },
  };
}

/**
 * List available dimensions
 */
async function executeListDimensions(args: Record<string, unknown>): Promise<ToolResult> {
  const includePresets = args.includePresets !== false;

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    // Return just presets if no Convex connection
    return {
      success: true,
      data: {
        presets: PRESET_DIMENSIONS,
        custom: [],
        message: `${PRESET_DIMENSIONS.length} preset dimensions available`,
      },
      action: {
        type: 'dimensions_listed',
        payload: {
          presets: PRESET_DIMENSIONS,
          custom: [],
        },
      },
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const dimensions = await client.query(api.erv.listDimensions, {
      includePresets,
    });

    // Separate presets and custom
    const custom = dimensions.filter((d) => !d.isPreset).map((d) => ({
      id: d.dimensionId,
      name: d.name,
      icon: d.icon || '📐',
      description: d.description,
      metaphor: d.metaphor,
    }));

    return {
      success: true,
      data: {
        presets: includePresets ? PRESET_DIMENSIONS : [],
        custom,
        totalCount: (includePresets ? PRESET_DIMENSIONS.length : 0) + custom.length,
        message: `Found ${custom.length} custom dimension${custom.length !== 1 ? 's' : ''} and ${PRESET_DIMENSIONS.length} presets`,
      },
      action: {
        type: 'dimensions_listed',
        payload: {
          presets: includePresets ? PRESET_DIMENSIONS : [],
          custom,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list dimensions',
    };
  }
}

/**
 * Search entities in the ERV system
 */
async function executeSearchEntities(args: Record<string, unknown>): Promise<ToolResult> {
  const query = args.query as string;
  const entityTypes = args.entityTypes as string[] | undefined;
  const limit = (args.limit as number) || 20;

  if (!query) {
    return {
      success: false,
      error: 'Search query is required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const entities = await client.query(api.erv.searchEntities, {
      query,
      entityTypes: entityTypes as Array<'Person' | 'Project' | 'Track' | 'Draft' | 'Sketch' | 'Ticket' | 'Epic' | 'Event' | 'Memory' | 'Value' | 'Dimension' | 'Collection' | 'Skill' | 'Reminder'> | undefined,
      limit,
    });

    // Format results
    const results = entities.map((e) => {
      let parsedData: Record<string, unknown> = {};
      try {
        parsedData = JSON.parse(e.data);
      } catch {
        // ignore parse errors
      }

      return {
        entityId: e.entityId,
        type: e.entityType,
        name: e.name,
        tags: e.tags,
        importance: e.importance,
        // Include some type-specific fields
        ...(e.entityType === 'Ticket' && {
          ticketId: parsedData.ticketId,
          status: parsedData.status,
          priority: parsedData.priority,
        }),
        ...(e.entityType === 'Project' && {
          status: parsedData.status,
        }),
        ...(e.entityType === 'Track' && {
          artist: parsedData.artist,
          album: parsedData.album,
        }),
      };
    });

    return {
      success: true,
      data: {
        results,
        count: results.length,
        query,
        entityTypes: entityTypes || 'all',
        message: `Found ${results.length} entit${results.length !== 1 ? 'ies' : 'y'} matching "${query}"`,
      },
      action: {
        type: 'entities_searched',
        payload: {
          query,
          count: results.length,
          results: results.slice(0, 5), // Preview first 5
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search entities',
    };
  }
}

// =============================================================================
// Video/Remotion Tool Handlers
// =============================================================================

// In-memory storage for video compositions (would be Convex in production)
const videoCompositions = new Map<string, {
  id: string;
  name: string;
  type: string;
  preset: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  layers: Array<{
    id: string;
    type: string;
    [key: string]: unknown;
  }>;
  audio?: { src: string; volume: number };
  backgroundColor?: string;
  backgroundGradient?: string;
  createdAt: number;
  updatedAt: number;
}>();

const VIDEO_PRESETS: Record<string, { width: number; height: number; fps: number }> = {
  'instagram-story': { width: 1080, height: 1920, fps: 30 },
  'instagram-post': { width: 1080, height: 1080, fps: 30 },
  'instagram-reel': { width: 1080, height: 1920, fps: 30 },
  'tiktok': { width: 1080, height: 1920, fps: 30 },
  'youtube': { width: 1920, height: 1080, fps: 30 },
  'youtube-short': { width: 1080, height: 1920, fps: 30 },
  'twitter': { width: 1280, height: 720, fps: 30 },
  '1080p': { width: 1920, height: 1080, fps: 30 },
  '720p': { width: 1280, height: 720, fps: 30 },
  '4k': { width: 3840, height: 2160, fps: 30 },
  'square': { width: 1080, height: 1080, fps: 30 },
  'portrait': { width: 1080, height: 1350, fps: 30 },
};

function executeCreateVideoComposition(args: Record<string, unknown>): ToolResult {
  const name = args.name as string;
  const type = args.type as string;
  const presetKey = (args.preset as string) || '1080p';
  const durationSeconds = (args.durationSeconds as number) || 30;
  const backgroundColor = args.backgroundColor as string | undefined;
  const backgroundGradient = args.backgroundGradient as string | undefined;

  if (!name) {
    return {
      success: false,
      error: 'Composition name is required',
    };
  }

  const preset = VIDEO_PRESETS[presetKey] || VIDEO_PRESETS['1080p'];
  const id = `video-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = Date.now();

  const composition = {
    id,
    name,
    type,
    preset: presetKey,
    width: preset.width,
    height: preset.height,
    fps: preset.fps,
    durationInFrames: durationSeconds * preset.fps,
    layers: [],
    backgroundColor: backgroundColor || '#000000',
    backgroundGradient,
    createdAt: now,
    updatedAt: now,
  };

  videoCompositions.set(id, composition);

  return {
    success: true,
    data: {
      compositionId: id,
      name,
      type,
      preset: presetKey,
      dimensions: `${preset.width}x${preset.height}`,
      fps: preset.fps,
      durationSeconds,
      durationInFrames: composition.durationInFrames,
      message: `Created ${type} composition "${name}" (${preset.width}x${preset.height} @ ${preset.fps}fps, ${durationSeconds}s)`,
    },
    action: {
      type: 'video_composition_created',
      payload: {
        compositionId: id,
        composition: {
          name,
          type,
          width: preset.width,
          height: preset.height,
          durationSeconds,
        },
      },
    },
  };
}

function executeAddTextOverlay(args: Record<string, unknown>): ToolResult {
  const compositionId = args.compositionId as string;
  const text = args.text as string;
  const position = (args.position as string) || 'center';
  const startTime = (args.startTime as number) || 0;
  const duration = args.duration as number | undefined;
  const fontSize = (args.fontSize as number) || 32;
  const color = (args.color as string) || '#ffffff';
  const animation = (args.animation as string) || 'fade';

  if (!compositionId) {
    return {
      success: false,
      error: 'Composition ID is required',
    };
  }

  if (!text) {
    return {
      success: false,
      error: 'Text content is required',
    };
  }

  const composition = videoCompositions.get(compositionId);
  if (!composition) {
    return {
      success: false,
      error: `Composition not found: ${compositionId}`,
    };
  }

  const layerId = `text-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const startFrame = Math.floor(startTime * composition.fps);
  const durationInFrames = duration
    ? Math.floor(duration * composition.fps)
    : composition.durationInFrames - startFrame;

  const layer = {
    id: layerId,
    type: 'text',
    text,
    position,
    startFrame,
    durationInFrames,
    fontSize,
    color,
    animationIn: animation,
    animationOut: 'fade',
    zIndex: composition.layers.length + 1,
  };

  composition.layers.push(layer);
  composition.updatedAt = Date.now();

  return {
    success: true,
    data: {
      layerId,
      compositionId,
      text: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
      position,
      startTime,
      duration: duration || (composition.durationInFrames - startFrame) / composition.fps,
      animation,
      message: `Added text overlay "${text.slice(0, 30)}${text.length > 30 ? '...' : ''}" at ${position}`,
    },
    action: {
      type: 'video_layer_added',
      payload: {
        compositionId,
        layerId,
        layerType: 'text',
        preview: text.slice(0, 50),
      },
    },
  };
}

function executeAddLyricsToVideo(args: Record<string, unknown>): ToolResult {
  const compositionId = args.compositionId as string;
  const audioSrc = args.audioSrc as string;
  const lyrics = args.lyrics as Array<{ text: string; startTime: number; endTime: number }>;
  const style = (args.style as string) || 'karaoke';
  const fontFamily = (args.fontFamily as string) || 'Inter, sans-serif';
  const color = (args.color as string) || '#ffffff';
  const highlightColor = (args.highlightColor as string) || '#ffcc00';
  const position = (args.position as string) || 'center';

  if (!compositionId) {
    return {
      success: false,
      error: 'Composition ID is required',
    };
  }

  if (!audioSrc) {
    return {
      success: false,
      error: 'Audio source is required',
    };
  }

  if (!lyrics || lyrics.length === 0) {
    return {
      success: false,
      error: 'Lyrics array is required with timing information',
    };
  }

  const composition = videoCompositions.get(compositionId);
  if (!composition) {
    return {
      success: false,
      error: `Composition not found: ${compositionId}`,
    };
  }

  // Set audio
  composition.audio = {
    src: audioSrc,
    volume: 1,
  };

  // Add lyrics layer
  const layerId = `lyrics-${Date.now()}`;
  const maxEndTime = Math.max(...lyrics.map((l) => l.endTime));
  const durationInFrames = Math.ceil(maxEndTime * composition.fps);

  // Update composition duration if lyrics are longer
  if (durationInFrames > composition.durationInFrames) {
    composition.durationInFrames = durationInFrames;
  }

  const layer = {
    id: layerId,
    type: 'lyrics',
    lyrics,
    audioSrc,
    style,
    fontFamily,
    fontSize: 48,
    color,
    highlightColor,
    position,
    startFrame: 0,
    durationInFrames: composition.durationInFrames,
    zIndex: composition.layers.length + 1,
  };

  composition.layers.push(layer);
  composition.updatedAt = Date.now();

  return {
    success: true,
    data: {
      layerId,
      compositionId,
      lyricCount: lyrics.length,
      style,
      audioSrc,
      totalDuration: maxEndTime,
      message: `Added ${lyrics.length} lyric lines with ${style} style. Total duration: ${maxEndTime.toFixed(1)}s`,
    },
    action: {
      type: 'video_lyrics_added',
      payload: {
        compositionId,
        layerId,
        lyricCount: lyrics.length,
        style,
        previewLyrics: lyrics.slice(0, 3).map((l) => l.text),
      },
    },
  };
}

function executeAddMediaToVideo(args: Record<string, unknown>): ToolResult {
  const compositionId = args.compositionId as string;
  const mediaSrc = args.mediaSrc as string;
  const mediaType = args.mediaType as 'image' | 'video';
  const startTime = (args.startTime as number) || 0;
  const duration = args.duration as number | undefined;
  const position = (args.position as { x: number; y: number }) || { x: 0, y: 0 };
  const scale = (args.scale as number) || 1;
  const opacity = (args.opacity as number) ?? 1;
  const objectFit = (args.objectFit as string) || 'cover';

  if (!compositionId) {
    return {
      success: false,
      error: 'Composition ID is required',
    };
  }

  if (!mediaSrc) {
    return {
      success: false,
      error: 'Media source is required',
    };
  }

  const composition = videoCompositions.get(compositionId);
  if (!composition) {
    return {
      success: false,
      error: `Composition not found: ${compositionId}`,
    };
  }

  const layerId = `${mediaType}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const startFrame = Math.floor(startTime * composition.fps);
  const durationInFrames = duration
    ? Math.floor(duration * composition.fps)
    : composition.durationInFrames - startFrame;

  const layer = {
    id: layerId,
    type: mediaType,
    src: mediaSrc,
    position,
    startFrame,
    durationInFrames,
    scale: { x: scale, y: scale },
    opacity,
    objectFit,
    zIndex: composition.layers.length + 1,
  };

  composition.layers.push(layer);
  composition.updatedAt = Date.now();

  return {
    success: true,
    data: {
      layerId,
      compositionId,
      mediaType,
      mediaSrc,
      startTime,
      duration: durationInFrames / composition.fps,
      message: `Added ${mediaType} layer from ${mediaSrc.split('/').pop() || mediaSrc}`,
    },
    action: {
      type: 'video_layer_added',
      payload: {
        compositionId,
        layerId,
        layerType: mediaType,
        mediaSrc,
      },
    },
  };
}

function executePreviewVideo(args: Record<string, unknown>): ToolResult {
  const compositionId = args.compositionId as string;
  const openInCanvas = (args.openInCanvas as boolean) || false;

  if (!compositionId) {
    return {
      success: false,
      error: 'Composition ID is required',
    };
  }

  const composition = videoCompositions.get(compositionId);
  if (!composition) {
    return {
      success: false,
      error: `Composition not found: ${compositionId}`,
    };
  }

  return {
    success: true,
    data: {
      compositionId,
      composition: {
        name: composition.name,
        type: composition.type,
        width: composition.width,
        height: composition.height,
        fps: composition.fps,
        durationInFrames: composition.durationInFrames,
        durationSeconds: composition.durationInFrames / composition.fps,
        layerCount: composition.layers.length,
        layers: composition.layers.map((l) => ({
          id: l.id,
          type: l.type,
        })),
        hasAudio: !!composition.audio,
      },
      openInCanvas,
      message: `Preview ready for "${composition.name}" - ${composition.layers.length} layers, ${(composition.durationInFrames / composition.fps).toFixed(1)}s`,
    },
    action: {
      type: 'video_preview_ready',
      payload: {
        compositionId,
        composition,
        openInCanvas,
      },
    },
  };
}

async function executeRenderVideo(args: Record<string, unknown>): Promise<ToolResult> {
  const compositionId = args.compositionId as string;
  const format = (args.format as string) || 'mp4';
  const quality = (args.quality as string) || 'standard';
  const mode = (args.mode as string) || 'sandbox'; // Default to sandbox (free)

  if (!compositionId) {
    return {
      success: false,
      error: 'Composition ID is required',
    };
  }

  const composition = videoCompositions.get(compositionId);
  if (!composition) {
    return {
      success: false,
      error: `Composition not found: ${compositionId}`,
    };
  }

  const durationSeconds = composition.durationInFrames / composition.fps;

  // Sandbox mode - render locally using ffmpeg.wasm
  if (mode === 'sandbox') {
    // Check if composition is too long for sandbox rendering
    if (durationSeconds > 60) {
      return {
        success: false,
        error: `Composition is ${Math.round(durationSeconds)}s long. Sandbox mode supports up to 60s. Use mode="server" for longer videos.`,
      };
    }

    return {
      success: true,
      data: {
        renderMode: 'sandbox',
        compositionId,
        compositionName: composition.name,
        format,
        quality,
        durationSeconds,
        composition: {
          ...composition,
          layers: composition.layers.map((l) => ({ id: l.id, type: l.type })),
        },
        instructions: [
          '1. Capture frames from the composition using Remotion player',
          '2. Pass frames to renderInSandbox() from sandbox-renderer',
          '3. ffmpeg.wasm will encode the video locally',
          '4. Download the result - no cloud costs!',
        ],
        message: `Ready to render "${composition.name}" locally (${format}, ${quality}). Sandbox mode uses ffmpeg.wasm - completely free, no cloud needed.`,
        note: 'Rendering happens in your browser/sandbox. For videos over 60s, use mode="server".',
      },
      action: {
        type: 'video_render_started',
        payload: {
          renderMode: 'sandbox',
          compositionId,
          compositionName: composition.name,
          format,
          quality,
          status: 'ready_to_render',
          localRender: true,
        },
      },
    };
  }

  // Server mode - use cloud rendering
  try {
    const response = await fetch('/api/video/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compositionId,
        compositionName: composition.name,
        compositionData: {
          width: composition.width,
          height: composition.height,
          fps: composition.fps,
          durationInFrames: composition.durationInFrames,
          props: {
            compositionType: composition.type === 'lyric-video' ? 'lyric' :
              composition.type === 'text-overlay' ? 'text-overlay' : 'base',
            compositionProps: composition,
          },
        },
        format,
        quality,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to start render',
      };
    }

    const estimatedDuration = Math.ceil(durationSeconds) * 2;

    return {
      success: true,
      data: {
        renderMode: 'server',
        jobId: result.job.id,
        compositionId,
        status: result.job.status,
        format,
        quality,
        estimatedDuration,
        message: `Server render started for "${composition.name}" (${format}, ${quality}). Job ID: ${result.job.id}. Use get_render_status to check progress.`,
      },
      action: {
        type: 'video_render_started',
        payload: {
          renderMode: 'server',
          jobId: result.job.id,
          compositionId,
          compositionName: composition.name,
          format,
          quality,
          status: result.job.status,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start render',
    };
  }
}

async function executeSyncLyricsToAudio(args: Record<string, unknown>): Promise<ToolResult> {
  const audioSrc = args.audioSrc as string;
  const lyricsText = args.lyrics as string;
  const language = args.language as string | undefined;

  if (!audioSrc) {
    return {
      success: false,
      error: 'Audio source is required',
    };
  }

  if (!lyricsText) {
    return {
      success: false,
      error: 'Lyrics text is required',
    };
  }

  try {
    // Parse lyrics into lines
    const lyricLines = lyricsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lyricLines.length === 0) {
      return {
        success: false,
        error: 'No valid lyric lines found',
      };
    }

    // Call Whisper API for transcription with timestamps
    const formData = new FormData();

    // If audioSrc is a URL, fetch and convert to blob
    let audioBlob: Blob;
    if (audioSrc.startsWith('http')) {
      const audioResponse = await fetch(audioSrc);
      audioBlob = await audioResponse.blob();
    } else {
      // Assume it's a base64 data URL or local path
      return {
        success: false,
        error: 'Audio must be provided as a URL. Upload the audio file first.',
      };
    }

    formData.append('file', audioBlob, 'audio.mp3');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'word');
    if (language) {
      formData.append('language', language);
    }

    const whisperResponse = await fetch('/api/whisper', {
      method: 'POST',
      body: formData,
    });

    if (!whisperResponse.ok) {
      // Fallback: estimate timing based on audio duration assumption
      const estimatedDuration = lyricLines.length * 4; // Assume ~4 seconds per line
      const syncedLyrics = lyricLines.map((text, index) => ({
        text,
        startTime: index * (estimatedDuration / lyricLines.length),
        endTime: (index + 1) * (estimatedDuration / lyricLines.length),
      }));

      return {
        success: true,
        data: {
          lyrics: syncedLyrics,
          lyricCount: syncedLyrics.length,
          method: 'estimated',
          message: `Estimated timing for ${syncedLyrics.length} lines (Whisper unavailable). Consider providing manual timestamps for better sync.`,
        },
        action: {
          type: 'lyrics_synced',
          payload: {
            lyricCount: syncedLyrics.length,
            method: 'estimated',
            previewLyrics: syncedLyrics.slice(0, 3),
          },
        },
      };
    }

    const whisperResult = await whisperResponse.json();

    // Match transcribed words to lyric lines
    const words = whisperResult.words || [];
    const syncedLyrics = matchLyricsToWords(lyricLines, words);

    return {
      success: true,
      data: {
        lyrics: syncedLyrics,
        lyricCount: syncedLyrics.length,
        method: 'whisper',
        totalDuration: syncedLyrics.length > 0 ? syncedLyrics[syncedLyrics.length - 1].endTime : 0,
        message: `Synced ${syncedLyrics.length} lyric lines using Whisper AI. Ready for add_lyrics_to_video.`,
      },
      action: {
        type: 'lyrics_synced',
        payload: {
          lyricCount: syncedLyrics.length,
          method: 'whisper',
          previewLyrics: syncedLyrics.slice(0, 3),
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sync lyrics',
    };
  }
}

/**
 * Match lyric lines to Whisper word timestamps using fuzzy matching
 */
function matchLyricsToWords(
  lyricLines: string[],
  words: Array<{ word: string; start: number; end: number }>
): Array<{ text: string; startTime: number; endTime: number }> {
  if (words.length === 0) {
    // Fallback to estimated timing
    const estimatedDuration = lyricLines.length * 4;
    return lyricLines.map((text, index) => ({
      text,
      startTime: index * (estimatedDuration / lyricLines.length),
      endTime: (index + 1) * (estimatedDuration / lyricLines.length),
    }));
  }

  const result: Array<{ text: string; startTime: number; endTime: number }> = [];
  let wordIndex = 0;

  for (const line of lyricLines) {
    const lineWords = line.toLowerCase().split(/\s+/).filter(Boolean);
    const startWord = words[wordIndex];

    if (!startWord) {
      // No more words, estimate remaining
      const lastEnd = result.length > 0 ? result[result.length - 1].endTime : 0;
      result.push({
        text: line,
        startTime: lastEnd,
        endTime: lastEnd + 3,
      });
      continue;
    }

    const startTime = startWord.start;

    // Find matching words for this line
    let matchedWords = 0;
    let endTime = startWord.end;

    while (wordIndex < words.length && matchedWords < lineWords.length) {
      endTime = words[wordIndex].end;
      wordIndex++;
      matchedWords++;
    }

    result.push({
      text: line,
      startTime,
      endTime,
    });
  }

  return result;
}

async function executeGetRenderStatus(args: Record<string, unknown>): Promise<ToolResult> {
  const jobId = args.jobId as string;

  if (!jobId) {
    return {
      success: false,
      error: 'Job ID is required',
    };
  }

  try {
    const response = await fetch(`/api/video/render?jobId=${encodeURIComponent(jobId)}`);
    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to get render status',
      };
    }

    const job = result.job;

    return {
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        progress: job.progress,
        outputUrl: job.outputUrl,
        error: job.error,
        durationMs: job.durationMs,
        message: job.status === 'completed'
          ? `Render complete! Download: ${job.outputUrl}`
          : job.status === 'failed'
            ? `Render failed: ${job.error}`
            : `Rendering: ${job.progress}% complete`,
      },
      action: {
        type: job.status === 'completed' ? 'video_render_complete' : 'video_render_status',
        payload: {
          jobId: job.id,
          status: job.status,
          progress: job.progress,
          outputUrl: job.outputUrl,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get render status',
    };
  }
}

// --------------------------------------------------------------------------
// Talking Video Tools
// --------------------------------------------------------------------------

/**
 * Create a talking head video with AI-generated script, voice, and lip sync
 */
async function executeCreateTalkingVideo(args: Record<string, unknown>): Promise<ToolResult> {
  const topic = args.topic as string;
  const sourcePhotoUrl = args.sourcePhotoUrl as string;
  const sceneStyle = args.sceneStyle as string || 'podcast_studio';
  const customScenePrompt = args.customScenePrompt as string | undefined;
  const duration = args.duration as number || 90;
  const tone = args.tone as string || 'professional';

  if (!topic) {
    return {
      success: false,
      error: 'Topic is required',
    };
  }

  if (!sourcePhotoUrl) {
    return {
      success: false,
      error: 'Source photo URL is required',
    };
  }

  try {
    const response = await fetch('/api/talking-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'run_workflow',
        topic,
        sourcePhotoUrl,
        sceneStyle,
        customScenePrompt,
        duration,
        tone,
      }),
    });

    const result = await response.json();

    if (result.error) {
      return {
        success: false,
        error: result.error,
        action: {
          type: 'talking_video_error',
          payload: { error: result.error },
        },
      };
    }

    return {
      success: true,
      data: {
        projectId: result.projectId,
        status: result.status,
        script: result.script,
        audioUrl: result.audioUrl,
        backgroundVideoUrl: result.backgroundVideoUrl,
        finalVideoUrl: result.finalVideoUrl,
        message: result.finalVideoUrl
          ? `Talking video created successfully! Watch it here: ${result.finalVideoUrl}`
          : 'Video creation started...',
      },
      action: {
        type: 'talking_video_complete',
        payload: {
          projectId: result.projectId,
          finalVideoUrl: result.finalVideoUrl,
          script: result.script,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create talking video',
    };
  }
}

/**
 * Generate just the script for a talking video
 */
async function executeGenerateVideoScript(args: Record<string, unknown>): Promise<ToolResult> {
  const topic = args.topic as string;
  const duration = args.duration as number || 90;
  const tone = args.tone as string || 'professional';
  const style = args.style as string || 'monologue';

  if (!topic) {
    return {
      success: false,
      error: 'Topic is required',
    };
  }

  try {
    const response = await fetch('/api/talking-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate_script',
        topic,
        duration,
        tone,
        style,
      }),
    });

    const result = await response.json();

    if (result.error) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: {
        script: result.script,
        estimatedDuration: result.estimatedDuration,
        wordCount: result.wordCount,
        message: `Generated a ${result.estimatedDuration}-second script (${result.wordCount} words)`,
      },
      action: {
        type: 'talking_video_script_generated',
        payload: {
          script: result.script,
          estimatedDuration: result.estimatedDuration,
          wordCount: result.wordCount,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate script',
    };
  }
}

/**
 * Generate voice audio from text using ElevenLabs
 */
async function executeGenerateVoiceAudio(args: Record<string, unknown>): Promise<ToolResult> {
  const text = args.text as string;
  const voiceId = args.voiceId as string | undefined;
  const stability = args.stability as number | undefined;
  const similarityBoost = args.similarityBoost as number | undefined;

  if (!text) {
    return {
      success: false,
      error: 'Text is required',
    };
  }

  // Note: This would call the ElevenLabs API directly in production
  // For now, we return a placeholder that the frontend can handle
  return {
    success: true,
    data: {
      text,
      voiceId,
      stability,
      similarityBoost,
      message: 'Voice generation queued. The audio will be generated using your cloned voice.',
    },
    action: {
      type: 'talking_video_voice_generated',
      payload: {
        text,
        voiceId,
        stability,
        similarityBoost,
        apiCall: 'elevenlabs/text-to-speech',
      },
    },
  };
}

/**
 * Navigate to the video studio page
 */
function executeNavigateToVideoStudio(args: Record<string, unknown>): ToolResult {
  const prefillTopic = args.prefillTopic as string | undefined;

  let url = '/video';
  if (prefillTopic) {
    url += `?topic=${encodeURIComponent(prefillTopic)}`;
  }

  return {
    success: true,
    data: {
      url,
      prefillTopic,
      message: 'Opening the video studio...',
    },
    action: {
      type: 'navigate',
      payload: {
        url,
        destination: 'video',
        prefillTopic,
      },
    },
  };
}

// =============================================================================
// LTX-2 Video Generation Tools
// =============================================================================

/**
 * Generate a video from a text prompt using LTX-2
 */
async function executeGenerateVideo(args: Record<string, unknown>): Promise<ToolResult> {
  const prompt = args.prompt as string;
  const negative_prompt = args.negative_prompt as string | undefined;
  const preset = args.preset as string | undefined;
  const duration_seconds = args.duration_seconds as number | undefined;
  const seed = args.seed as number | undefined;

  if (!prompt) {
    return {
      success: false,
      error: 'Prompt is required for video generation',
    };
  }

  if (!isLTXConfigured()) {
    return {
      success: false,
      error: 'Video generation is not configured. FAL_KEY environment variable is missing.',
    };
  }

  try {
    let result;

    if (preset && LTX_PRESETS[preset as keyof typeof LTX_PRESETS]) {
      // Use preset
      result = await generateVideoWithPreset(prompt, preset as keyof typeof LTX_PRESETS, {
        negative_prompt,
        seed,
      });
    } else {
      // Use custom settings
      const num_frames = duration_seconds ? getFrameCountForDuration(duration_seconds) : 97;
      result = await generateVideoFromText({
        prompt,
        negative_prompt,
        num_frames,
        seed,
      });
    }

    return {
      success: true,
      data: {
        videoUrl: result.video.url,
        fileName: result.video.file_name,
        fileSize: result.video.file_size,
        seed: result.seed,
        message: `Video generated successfully! Here's your video: ${result.video.url}`,
      },
      action: {
        type: 'video_generated',
        payload: {
          videoUrl: result.video.url,
          fileName: result.video.file_name,
          prompt,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to generate video: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Animate an image into a video using LTX-2 image-to-video
 */
async function executeAnimateImage(args: Record<string, unknown>): Promise<ToolResult> {
  const image_url = args.image_url as string;
  const prompt = args.prompt as string;
  const negative_prompt = args.negative_prompt as string | undefined;
  const duration_seconds = args.duration_seconds as number | undefined;
  const seed = args.seed as number | undefined;

  if (!image_url) {
    return {
      success: false,
      error: 'Image URL is required for animation',
    };
  }

  if (!prompt) {
    return {
      success: false,
      error: 'Prompt describing the motion is required',
    };
  }

  if (!isLTXConfigured()) {
    return {
      success: false,
      error: 'Video generation is not configured. FAL_KEY environment variable is missing.',
    };
  }

  try {
    const num_frames = duration_seconds ? getFrameCountForDuration(duration_seconds) : 97;

    const result = await generateVideoFromImage({
      image_url,
      prompt,
      negative_prompt,
      num_frames,
      seed,
    });

    return {
      success: true,
      data: {
        videoUrl: result.video.url,
        fileName: result.video.file_name,
        fileSize: result.video.file_size,
        seed: result.seed,
        message: `Image animated successfully! Here's your video: ${result.video.url}`,
      },
      action: {
        type: 'image_animated',
        payload: {
          videoUrl: result.video.url,
          fileName: result.video.file_name,
          originalImage: image_url,
          prompt,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to animate image: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * List available video generation presets
 */
function executeListVideoPresets(): ToolResult {
  const presets = Object.entries(LTX_PRESETS).map(([key, preset]) => ({
    id: key,
    name: preset.name,
    description: preset.description,
    width: preset.width,
    height: preset.height,
    frames: preset.num_frames,
    approximateDuration: `~${Math.round(preset.num_frames / 24)} seconds`,
  }));

  return {
    success: true,
    data: {
      presets,
      message: 'Available video generation presets:',
    },
  };
}

// =============================================================================
// AI Provider Tools (Phase 3 Local LLM Integration)
// =============================================================================

/**
 * Get the current AI provider status and configuration
 * This tool helps users understand which AI backend is being used
 */
function executeGetAIProviderStatus(args: Record<string, unknown>): ToolResult {
  const includeLatency = args.includeLatency as boolean | undefined;

  // Note: The actual provider status comes from the chat route's response metadata
  // This tool returns an action that the frontend can use to fetch/display detailed status
  return {
    success: true,
    data: {
      message: 'Checking AI provider status...',
      note: 'The current provider information is included in each chat response. Check the response metadata for provider, providerModel, and fallbackUsed fields.',
      settingsUrl: '/settings/ai',
    },
    action: {
      type: 'check_provider_status',
      payload: {
        includeLatency: includeLatency ?? false,
        healthEndpoint: '/api/health/providers',
        settingsUrl: '/settings/ai',
      },
    },
  };
}

/**
 * Navigate to AI settings page
 */
function executeNavigateToAISettings(): ToolResult {
  return {
    success: true,
    data: {
      url: '/settings/ai',
      message: 'Opening AI provider settings...',
    },
    action: {
      type: 'navigate',
      payload: {
        url: '/settings/ai',
        destination: 'settings',
      },
    },
  };
}
// ============================================================================
// KANBAN TASK READING TOOLS - Read and understand tasks
// ============================================================================

/**
 * Get a specific Kanban task by ID
 */
async function executeGetKanbanTask(args: Record<string, unknown>): Promise<ToolResult> {
  const taskId = args.taskId as string;

  if (!taskId) {
    return {
      success: false,
      error: 'Task ID is required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const task = await client.query(api.kanban.getTaskById, {
      taskId,
    });

    if (!task) {
      return {
        success: false,
        error: `Task not found: ${taskId}`,
      };
    }

    return {
      success: true,
      data: {
        task: {
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          tags: task.tags,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        },
        message: `Found task "${task.title}" (${task.status})`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get task',
    };
  }
}

/**
 * Search Kanban tasks by keyword
 */
async function executeSearchKanbanTasks(args: Record<string, unknown>): Promise<ToolResult> {
  const query = args.query as string;
  const status = args.status as string | undefined;

  if (!query) {
    return {
      success: false,
      error: 'Search query is required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const tasks = await client.query(api.kanban.searchTasks, {
      query,
      status: status as 'backlog' | 'todo' | 'in-progress' | 'review' | 'done' | undefined,
    });

    return {
      success: true,
      data: {
        tasks: tasks.map((t) => ({
          id: t.id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          tags: t.tags,
        })),
        count: tasks.length,
        message: `Found ${tasks.length} task${tasks.length !== 1 ? 's' : ''} matching "${query}"`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search tasks',
    };
  }
}

// ============================================================================
// DESIGN CANVAS TOOLS - Infinite canvas for visual composition
// ============================================================================

/**
 * Create a new design canvas
 */
async function executeCreateCanvas(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const name = args.name as string;
  const canvasType = (args.canvasType as string) || 'freeform';
  const description = args.description as string | undefined;
  const backgroundColor = (args.backgroundColor as string) || '#1a1a2e';
  const gridEnabled = args.gridEnabled !== false;

  if (!name) {
    return {
      success: false,
      error: 'Canvas name is required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const userId = getEffectiveUserId(context);
    const client = new ConvexHttpClient(convexUrl);

    const canvasId = await client.mutation(api.designCanvas.createCanvas, {
      name,
      description,
      ownerId: userId,
      canvasType: canvasType as 'freeform' | 'wireframe' | 'moodboard' | 'storyboard' | 'mindmap' | 'flowchart',
      backgroundColor,
      gridEnabled,
      gridSize: 20,
    });

    return {
      success: true,
      data: {
        canvasId,
        name,
        canvasType,
        backgroundColor,
        message: `Created canvas "${name}" (${canvasType})`,
      },
      action: {
        type: 'canvas_created',
        payload: {
          canvasId,
          name,
          canvasType,
          url: `/canvas/${canvasId}`,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create canvas',
    };
  }
}

/**
 * List all design canvases
 */
async function executeListCanvases(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const status = args.status as string | undefined;
  const limit = (args.limit as number) || 20;

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const userId = getEffectiveUserId(context);
    const client = new ConvexHttpClient(convexUrl);

    const canvases = await client.query(api.designCanvas.getUserCanvases, {
      ownerId: userId,
      status: status as 'active' | 'archived' | 'template' | undefined,
    });

    const limitedCanvases = canvases.slice(0, limit);

    return {
      success: true,
      data: {
        canvases: limitedCanvases.map((c) => ({
          id: c._id,
          name: c.name,
          type: c.canvasType,
          status: c.status,
          createdAt: new Date(c.createdAt).toISOString(),
          updatedAt: new Date(c.updatedAt).toISOString(),
        })),
        count: limitedCanvases.length,
        totalCount: canvases.length,
        message: `Found ${canvases.length} canvas${canvases.length !== 1 ? 'es' : ''}`,
      },
      action: {
        type: 'canvases_listed',
        payload: {
          count: limitedCanvases.length,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list canvases',
    };
  }
}

/**
 * Get a specific canvas with its nodes and edges
 */
async function executeGetCanvas(args: Record<string, unknown>): Promise<ToolResult> {
  const canvasId = args.canvasId as string;

  if (!canvasId) {
    return {
      success: false,
      error: 'Canvas ID is required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const canvas = await client.query(api.designCanvas.getCanvas, {
      canvasId: canvasId as Id<'designCanvases'>,
    });

    if (!canvas) {
      return {
        success: false,
        error: `Canvas not found: ${canvasId}`,
      };
    }

    const nodes = await client.query(api.designCanvas.getCanvasNodes, {
      canvasId: canvasId as Id<'designCanvases'>,
    });

    const edges = await client.query(api.designCanvas.getCanvasEdges, {
      canvasId: canvasId as Id<'designCanvases'>,
    });

    return {
      success: true,
      data: {
        canvas: {
          id: canvas._id,
          name: canvas.name,
          type: canvas.canvasType,
          status: canvas.status,
          backgroundColor: canvas.backgroundColor,
        },
        nodes: nodes.map((n) => ({
          nodeId: n.nodeId,
          type: n.nodeType,
          x: n.x,
          y: n.y,
          width: n.width,
          height: n.height,
          content: n.content,
        })),
        edges: edges.map((e) => ({
          edgeId: e.edgeId,
          type: e.edgeType,
          source: e.sourceNodeId,
          target: e.targetNodeId,
          label: e.label,
        })),
        nodeCount: nodes.length,
        edgeCount: edges.length,
        message: `Canvas "${canvas.name}" has ${nodes.length} nodes and ${edges.length} edges`,
      },
      action: {
        type: 'canvas_retrieved',
        payload: {
          canvasId: canvas._id,
          name: canvas.name,
          nodeCount: nodes.length,
          edgeCount: edges.length,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get canvas',
    };
  }
}

/**
 * Add a node to a canvas
 */
async function executeAddCanvasNode(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const canvasId = args.canvasId as string;
  const nodeType = args.nodeType as string;
  const x = (args.x as number) || 0;
  const y = (args.y as number) || 0;
  const content = args.content as string;
  const width = (args.width as number) || getDefaultWidth(nodeType);
  const height = (args.height as number) || getDefaultHeight(nodeType);
  const style = args.style as string | undefined;

  if (!canvasId || !nodeType || content === undefined) {
    return {
      success: false,
      error: 'Canvas ID, node type, and content are required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const userId = getEffectiveUserId(context);
    const client = new ConvexHttpClient(convexUrl);

    // Generate a unique node ID
    const nodeId = `node_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    await client.mutation(api.designCanvas.addNode, {
      canvasId: canvasId as Id<'designCanvases'>,
      nodeId,
      nodeType: nodeType as 'text' | 'image' | 'shape' | 'sticky' | 'frame' | 'code' | 'embed' | 'audio' | 'video' | 'link',
      x,
      y,
      width,
      height,
      content,
      style,
      createdBy: userId,
    });

    return {
      success: true,
      data: {
        nodeId,
        nodeType,
        x,
        y,
        width,
        height,
        content: content.length > 50 ? content.slice(0, 50) + '...' : content,
        message: `Added ${nodeType} node at (${x}, ${y})`,
      },
      action: {
        type: 'canvas_node_added',
        payload: {
          canvasId,
          nodeId,
          nodeType,
          x,
          y,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add canvas node',
    };
  }
}

/**
 * Get default width for node type
 */
function getDefaultWidth(nodeType: string): number {
  switch (nodeType) {
    case 'text':
      return 200;
    case 'sticky':
      return 200;
    case 'shape':
      return 100;
    case 'image':
      return 300;
    case 'code':
      return 400;
    case 'frame':
      return 400;
    default:
      return 150;
  }
}

/**
 * Get default height for node type
 */
function getDefaultHeight(nodeType: string): number {
  switch (nodeType) {
    case 'text':
      return 50;
    case 'sticky':
      return 200;
    case 'shape':
      return 100;
    case 'image':
      return 200;
    case 'code':
      return 300;
    case 'frame':
      return 300;
    default:
      return 100;
  }
}

/**
 * Add an edge between nodes on a canvas
 */
async function executeAddCanvasEdge(args: Record<string, unknown>): Promise<ToolResult> {
  const canvasId = args.canvasId as string;
  const sourceNodeId = args.sourceNodeId as string;
  const targetNodeId = args.targetNodeId as string;
  const edgeType = (args.edgeType as string) || 'arrow';
  const label = args.label as string | undefined;
  const style = args.style as string | undefined;

  if (!canvasId || !sourceNodeId || !targetNodeId) {
    return {
      success: false,
      error: 'Canvas ID, source node ID, and target node ID are required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    // Generate a unique edge ID
    const edgeId = `edge_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    await client.mutation(api.designCanvas.addEdge, {
      canvasId: canvasId as Id<'designCanvases'>,
      edgeId,
      sourceNodeId,
      targetNodeId,
      edgeType: edgeType as 'straight' | 'curved' | 'step' | 'arrow',
      label,
      style,
    });

    return {
      success: true,
      data: {
        edgeId,
        edgeType,
        source: sourceNodeId,
        target: targetNodeId,
        label,
        message: `Connected ${sourceNodeId} → ${targetNodeId}${label ? ` (${label})` : ''}`,
      },
      action: {
        type: 'canvas_edge_added',
        payload: {
          canvasId,
          edgeId,
          source: sourceNodeId,
          target: targetNodeId,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add canvas edge',
    };
  }
}

/**
 * Update an existing canvas node
 */
async function executeUpdateCanvasNode(args: Record<string, unknown>): Promise<ToolResult> {
  const canvasId = args.canvasId as string;
  const nodeId = args.nodeId as string;
  const x = args.x as number | undefined;
  const y = args.y as number | undefined;
  const width = args.width as number | undefined;
  const height = args.height as number | undefined;
  const content = args.content as string | undefined;
  const style = args.style as string | undefined;

  if (!canvasId || !nodeId) {
    return {
      success: false,
      error: 'Canvas ID and node ID are required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    await client.mutation(api.designCanvas.updateNode, {
      canvasId: canvasId as Id<'designCanvases'>,
      nodeId,
      x,
      y,
      width,
      height,
      content,
      style,
    });

    const updates = [];
    if (x !== undefined || y !== undefined) updates.push(`position (${x ?? '?'}, ${y ?? '?'})`);
    if (width !== undefined || height !== undefined) updates.push(`size (${width ?? '?'}x${height ?? '?'})`);
    if (content !== undefined) updates.push('content');
    if (style !== undefined) updates.push('style');

    return {
      success: true,
      data: {
        nodeId,
        updated: updates,
        message: `Updated node ${nodeId}: ${updates.join(', ')}`,
      },
      action: {
        type: 'canvas_node_updated',
        payload: {
          canvasId,
          nodeId,
          updates,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update canvas node',
    };
  }
}

// =============================================================================
// Apple Health Tool Executors
// =============================================================================

// Type assertion helper for health API (types generated at deploy time)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const healthApi: Record<string, any> = (api as any).health || {};

/**
 * Get health summary for a specific date
 */
async function executeGetHealthSummary(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const userId = getEffectiveUserId(context);
  if (!userId) {
    return {
      success: false,
      error: 'Authentication required to access health data',
    };
  }

  const date = (args.date as string) || new Date().toISOString().split('T')[0];

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const summary = await client.query(healthApi.getDailySummary, { date });

    if (!summary) {
      return {
        success: true,
        data: {
          date,
          message: `No health data found for ${date}. Make sure you've synced your Apple Health data using the iOS Shortcut.`,
          hasData: false,
        },
      };
    }

    // Format the summary for display
    const formattedSummary = {
      date,
      hasData: true,
      activity: {
        steps: summary.steps,
        distance: summary.distance ? `${(summary.distance / 1000).toFixed(2)} km` : undefined,
        activeEnergy: summary.activeEnergy ? `${Math.round(summary.activeEnergy)} kcal` : undefined,
        exerciseMinutes: summary.exerciseMinutes,
        standHours: summary.standHours,
        flightsClimbed: summary.flightsClimbed,
      },
      heart: {
        averageHeartRate: summary.avgHeartRate ? `${Math.round(summary.avgHeartRate)} bpm` : undefined,
        restingHeartRate: summary.restingHeartRate ? `${Math.round(summary.restingHeartRate)} bpm` : undefined,
        heartRateVariability: summary.heartRateVariability ? `${Math.round(summary.heartRateVariability)} ms` : undefined,
        minHeartRate: summary.minHeartRate ? `${Math.round(summary.minHeartRate)} bpm` : undefined,
        maxHeartRate: summary.maxHeartRate ? `${Math.round(summary.maxHeartRate)} bpm` : undefined,
      },
      sleep: {
        sleepHours: summary.sleepHours ? `${summary.sleepHours.toFixed(1)} hours` : undefined,
        timeInBed: summary.timeInBed ? `${summary.timeInBed.toFixed(1)} hours` : undefined,
      },
      body: {
        weight: summary.weight ? `${summary.weight.toFixed(1)} kg` : undefined,
        bodyFat: summary.bodyFat ? `${summary.bodyFat.toFixed(1)}%` : undefined,
      },
      vitals: {
        bloodOxygen: summary.bloodOxygen ? `${summary.bloodOxygen.toFixed(1)}%` : undefined,
        respiratoryRate: summary.respiratoryRate ? `${summary.respiratoryRate.toFixed(1)} breaths/min` : undefined,
      },
      mindfulness: {
        mindfulMinutes: summary.mindfulMinutes,
      },
      workouts: {
        count: summary.workoutCount,
        totalMinutes: summary.workoutMinutes ? Math.round(summary.workoutMinutes) : undefined,
        totalCalories: summary.workoutCalories ? Math.round(summary.workoutCalories) : undefined,
      },
      scores: {
        activity: summary.activityScore,
        sleep: summary.sleepScore,
        readiness: summary.readinessScore,
      },
    };

    return {
      success: true,
      data: formattedSummary,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get health summary',
    };
  }
}

/**
 * Get health trends over time
 */
async function executeGetHealthTrends(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const userId = getEffectiveUserId(context);
  if (!userId) {
    return {
      success: false,
      error: 'Authentication required to access health data',
    };
  }

  const weeks = (args.weeks as number) || 4;

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const trends = await client.query(healthApi.getHealthTrends, { weeks });

    if (!trends || trends.length === 0) {
      return {
        success: true,
        data: {
          weeks,
          message: 'No health trend data available. Sync more data from Apple Health to see trends.',
          hasData: false,
        },
      };
    }

    return {
      success: true,
      data: {
        weeks,
        hasData: true,
        weeklyTrends: (trends as Array<{
          week: string;
          avgSteps: number | null;
          avgSleep: number | null;
          avgHeartRate: number | null;
          avgActivityScore: number | null;
        }>).map((week) => ({
          week: week.week,
          avgSteps: week.avgSteps ? Math.round(week.avgSteps) : null,
          avgSleepHours: week.avgSleep ? week.avgSleep.toFixed(1) : null,
          avgHeartRate: week.avgHeartRate ? Math.round(week.avgHeartRate) : null,
          avgActivityScore: week.avgActivityScore ? Math.round(week.avgActivityScore) : null,
        })),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get health trends',
    };
  }
}

/**
 * Get detailed data for a specific health metric
 */
async function executeGetHealthMetric(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const userId = getEffectiveUserId(context);
  if (!userId) {
    return {
      success: false,
      error: 'Authentication required to access health data',
    };
  }

  const metric = args.metric as string;
  if (!metric) {
    return {
      success: false,
      error: 'Metric type is required',
    };
  }

  const endDate = (args.endDate as string) || new Date().toISOString().split('T')[0];
  const startDate = (args.startDate as string) ||
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const startTimestamp = new Date(`${startDate}T00:00:00Z`).getTime();
  const endTimestamp = new Date(`${endDate}T23:59:59.999Z`).getTime();

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const samples = await client.query(healthApi.getSamples, {
      sampleType: metric as 'steps' | 'heartRate' | 'sleepAnalysis' | 'weight' | 'workout',
      startDate: startTimestamp,
      endDate: endTimestamp,
      limit: 100,
    });

    if (!samples || samples.length === 0) {
      return {
        success: true,
        data: {
          metric,
          startDate,
          endDate,
          message: `No ${metric} data found for the specified date range.`,
          hasData: false,
        },
      };
    }

    // Aggregate by date
    const byDate: Record<string, number[]> = {};
    for (const sample of samples) {
      const date = new Date(sample.startDate).toISOString().split('T')[0];
      if (!byDate[date]) {
        byDate[date] = [];
      }
      byDate[date].push(sample.value);
    }

    const dailyData = Object.entries(byDate).map(([date, values]) => ({
      date,
      value: metric === 'steps' || metric === 'activeEnergy' || metric === 'distance'
        ? values.reduce((a, b) => a + b, 0) // Sum for cumulative metrics
        : values.reduce((a, b) => a + b, 0) / values.length, // Average for others
      sampleCount: values.length,
    })).sort((a, b) => a.date.localeCompare(b.date));

    return {
      success: true,
      data: {
        metric,
        startDate,
        endDate,
        hasData: true,
        totalSamples: samples.length,
        dailyData,
        unit: samples[0]?.unit || 'unknown',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get health metric data',
    };
  }
}

/**
 * Compare health metrics between two periods
 */
async function executeCompareHealthPeriods(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const userId = getEffectiveUserId(context);
  if (!userId) {
    return {
      success: false,
      error: 'Authentication required to access health data',
    };
  }

  const period1Start = args.period1Start as string;
  const period1End = args.period1End as string;
  const period2Start = args.period2Start as string;
  const period2End = args.period2End as string;
  const metrics = (args.metrics as string[]) || ['steps', 'sleepHours', 'avgHeartRate', 'activityScore'];

  if (!period1Start || !period1End || !period2Start || !period2End) {
    return {
      success: false,
      error: 'All period start and end dates are required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    // Get summaries for both periods
    const period1Summaries = await client.query(healthApi.getDailySummaries, {
      startDate: period1Start,
      endDate: period1End,
    });

    const period2Summaries = await client.query(healthApi.getDailySummaries, {
      startDate: period2Start,
      endDate: period2End,
    });

    // Calculate averages for each period
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const calcAvg = (summaries: any[], metric: string) => {
      const values = summaries
        .map((s: Record<string, number | null | undefined>) => s[metric])
        .filter((v): v is number => v != null);
      return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
    };

    const comparison: Record<string, { period1: number | null; period2: number | null; change: string | null }> = {};

    for (const metric of metrics) {
      const p1Avg = calcAvg(period1Summaries, metric);
      const p2Avg = calcAvg(period2Summaries, metric);

      let change: string | null = null;
      if (p1Avg != null && p2Avg != null && p1Avg !== 0) {
        const percentChange = ((p2Avg - p1Avg) / p1Avg) * 100;
        change = `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
      }

      comparison[metric] = {
        period1: p1Avg != null ? Math.round(p1Avg * 10) / 10 : null,
        period2: p2Avg != null ? Math.round(p2Avg * 10) / 10 : null,
        change,
      };
    }

    return {
      success: true,
      data: {
        period1: { start: period1Start, end: period1End, daysWithData: period1Summaries.length },
        period2: { start: period2Start, end: period2End, daysWithData: period2Summaries.length },
        comparison,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to compare health periods',
    };
  }
}

/**
 * Generate a new API key for health data syncing
 */
async function executeGenerateHealthApiKey(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const userId = getEffectiveUserId(context);
  if (!userId) {
    return {
      success: false,
      error: 'Authentication required to generate API key',
    };
  }

  const name = args.name as string;
  if (!name) {
    return {
      success: false,
      error: 'API key name is required',
    };
  }

  const expiresInDays = args.expiresInDays as number | undefined;

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    // Note: This mutation requires authentication via Clerk
    // The webhook endpoint will use the API key for auth
    const result = await client.mutation(healthApi.generateApiKey, {
      name,
      expiresInDays,
    });

    return {
      success: true,
      data: {
        apiKey: result.apiKey,
        name: result.name,
        expiresAt: result.expiresAt ? new Date(result.expiresAt).toISOString() : 'Never',
        message: result.message,
        webhookUrl: 'https://openclaw.io/api/webhooks/health',
        instructions: [
          '1. Copy the API key above (it will not be shown again)',
          '2. Create a new iOS Shortcut',
          '3. Add "Find Health Samples" actions for the data you want to sync',
          '4. Add "Get Contents of URL" action with:',
          '   - URL: https://openclaw.io/api/webhooks/health',
          '   - Method: POST',
          '   - Headers: Authorization: Bearer YOUR_API_KEY',
          '   - Body: JSON with your health data',
          '5. Set up automation to run the shortcut daily',
        ],
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate API key',
    };
  }
}

/**
 * List all health API keys
 */
async function executeListHealthApiKeys(
  context: ExecutionContext
): Promise<ToolResult> {
  const userId = getEffectiveUserId(context);
  if (!userId) {
    return {
      success: false,
      error: 'Authentication required to list API keys',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const keys = await client.query(healthApi.listApiKeys, {});

    if (!keys || keys.length === 0) {
      return {
        success: true,
        data: {
          message: 'No API keys found. Generate one to start syncing health data.',
          keys: [],
        },
      };
    }

    return {
      success: true,
      data: {
        keys: (keys as Array<{
          id: string;
          name: string;
          isActive: boolean;
          isExpired: boolean;
          lastUsedAt?: number;
          usageCount: number;
          createdAt: number;
          expiresAt?: number;
        }>).map((key) => ({
          id: key.id,
          name: key.name,
          isActive: key.isActive,
          isExpired: key.isExpired,
          lastUsedAt: key.lastUsedAt ? new Date(key.lastUsedAt).toISOString() : 'Never',
          usageCount: key.usageCount,
          createdAt: new Date(key.createdAt).toISOString(),
          expiresAt: key.expiresAt ? new Date(key.expiresAt).toISOString() : 'Never',
        })),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list API keys',
    };
  }
}

/**
 * Revoke a health API key
 */
async function executeRevokeHealthApiKey(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const userId = getEffectiveUserId(context);
  if (!userId) {
    return {
      success: false,
      error: 'Authentication required to revoke API key',
    };
  }

  const keyId = args.keyId as string;
  if (!keyId) {
    return {
      success: false,
      error: 'API key ID is required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    await client.mutation(healthApi.revokeApiKey, {
      keyId: keyId as Id<'healthApiKeys'>,
    });

    return {
      success: true,
      data: {
        message: 'API key has been revoked. It can no longer be used for syncing.',
        keyId,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to revoke API key',
    };
  }
}

/**
 * Get health sync status
 */
async function executeGetHealthSyncStatus(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const userId = getEffectiveUserId(context);
  if (!userId) {
    return {
      success: false,
      error: 'Authentication required to check sync status',
    };
  }

  const limit = (args.limit as number) || 5;

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const logs = await client.query(healthApi.getSyncLogs, { limit });

    if (!logs || logs.length === 0) {
      return {
        success: true,
        data: {
          message: 'No sync history found. Health data has not been synced yet.',
          syncs: [],
        },
      };
    }

    type SyncLog = {
      syncId: string;
      status: string;
      samplesReceived: number;
      samplesStored: number;
      sampleTypes: string[];
      errors?: string[];
      syncedAt: number;
    };

    const typedLogs = logs as SyncLog[];

    return {
      success: true,
      data: {
        recentSyncs: typedLogs.map((log) => ({
          syncId: log.syncId,
          status: log.status,
          samplesReceived: log.samplesReceived,
          samplesStored: log.samplesStored,
          sampleTypes: log.sampleTypes,
          errors: log.errors,
          syncedAt: new Date(log.syncedAt).toISOString(),
        })),
        lastSync: typedLogs[0] ? {
          status: typedLogs[0].status,
          samplesStored: typedLogs[0].samplesStored,
          syncedAt: new Date(typedLogs[0].syncedAt).toISOString(),
          timeSince: formatTimeSince(typedLogs[0].syncedAt),
        } : null,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get sync status',
    };
  }
}

/**
 * Format time since a timestamp
 */
function formatTimeSince(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

// =============================================================================
// ERV Ontology Tools - AI-Assisted Entity Classification & Relationship Suggestion
// =============================================================================

/**
 * Entity type definitions with classification hints
 */
const ENTITY_TYPE_SCHEMAS = {
  Person: {
    keywords: ['person', 'contact', 'colleague', 'friend', 'team', 'member', 'employee', 'met', 'introduced'],
    requiredFields: [],
    optionalFields: ['email', 'company', 'title', 'phone', 'linkedin', 'twitter', 'location', 'notes', 'relationship'],
    defaultTags: ['contact'],
  },
  Project: {
    keywords: ['project', 'app', 'website', 'repo', 'build', 'create', 'develop', 'startup', 'product', 'initiative'],
    requiredFields: ['status', 'color'],
    optionalFields: ['githubRepo', 'description', 'stack', 'url', 'startDate', 'endDate'],
    defaultTags: ['project'],
  },
  Track: {
    keywords: ['song', 'track', 'music', 'audio', 'beat', 'album', 'artist', 'spotify', 'soundcloud'],
    requiredFields: ['artist', 'audioUrl', 'isPrivate'],
    optionalFields: ['album', 'duration', 'genre', 'bpm', 'key', 'lyrics'],
    defaultTags: ['music'],
  },
  Event: {
    keywords: ['event', 'meeting', 'conference', 'deadline', 'appointment', 'call', 'reminder', 'date', 'schedule'],
    requiredFields: ['startTime', 'endTime', 'timezone', 'isAllDay'],
    optionalFields: ['location', 'description', 'attendees', 'recurring'],
    defaultTags: ['calendar'],
  },
  Memory: {
    keywords: ['remember', 'memory', 'note', 'thought', 'idea', 'insight', 'learned', 'decision', 'milestone'],
    requiredFields: ['memoryType', 'content', 'importance', 'timestamp'],
    optionalFields: ['context', 'projectId', 'emotions'],
    defaultTags: ['memory'],
  },
  Ticket: {
    keywords: ['ticket', 'task', 'bug', 'feature', 'story', 'issue', 'todo', 'fix', 'implement'],
    requiredFields: ['ticketId', 'type', 'priority', 'status'],
    optionalFields: ['description', 'asA', 'iWant', 'soThat', 'acceptanceCriteria', 'labels', 'epicId'],
    defaultTags: ['task'],
  },
  Draft: {
    keywords: ['draft', 'writing', 'blog', 'article', 'post', 'essay', 'document', 'content'],
    requiredFields: [],
    optionalFields: ['content', 'wordCount', 'status', 'publishedAt', 'category'],
    defaultTags: ['writing'],
  },
  Collection: {
    keywords: ['collection', 'list', 'group', 'folder', 'category', 'set', 'bundle'],
    requiredFields: [],
    optionalFields: ['description', 'entityIds', 'icon', 'color'],
    defaultTags: ['collection'],
  },
  Skill: {
    keywords: ['skill', 'ability', 'expertise', 'technology', 'tool', 'language', 'framework'],
    requiredFields: [],
    optionalFields: ['level', 'yearsExperience', 'category', 'endorsements'],
    defaultTags: ['skill'],
  },
  Value: {
    keywords: ['value', 'principle', 'belief', 'philosophy', 'core', 'important'],
    requiredFields: [],
    optionalFields: ['description', 'priority', 'examples'],
    defaultTags: ['values'],
  },
} as const;

type EntityTypeName = keyof typeof ENTITY_TYPE_SCHEMAS;

/**
 * Relationship type definitions with semantic hints
 */
const RELATIONSHIP_HINTS = {
  collaboratedOn: ['worked with', 'built with', 'created with', 'partnered'],
  createdBy: ['made by', 'authored by', 'developed by', 'written by'],
  assignedTo: ['assigned', 'responsible', 'owned by', 'belongs to'],
  belongsTo: ['part of', 'in', 'under', 'within', 'member of'],
  contains: ['includes', 'has', 'comprises', 'holds'],
  parentOf: ['parent', 'above', 'manages', 'oversees'],
  mentions: ['references', 'talks about', 'cites', 'links to'],
  relatedTo: ['related', 'connected', 'similar', 'associated'],
  derivedFrom: ['based on', 'inspired by', 'forked from', 'evolved from'],
  followedBy: ['then', 'next', 'after', 'succeeds'],
  blockedBy: ['blocked', 'waiting on', 'depends on', 'requires'],
};

/**
 * Classify content into an entity type using keyword matching and heuristics
 */
function classifyEntityType(
  content: string,
  suggestedType?: string,
  contentType?: string
): { entityType: EntityTypeName; confidence: number; reasoning: string } {
  // If user suggested a type and it's valid, use it with high confidence
  if (suggestedType && suggestedType in ENTITY_TYPE_SCHEMAS) {
    return {
      entityType: suggestedType as EntityTypeName,
      confidence: 0.95,
      reasoning: `User suggested type: ${suggestedType}`,
    };
  }

  const lowerContent = content.toLowerCase();

  // URL detection - likely a Project, Track, or reference
  if (contentType === 'url' || lowerContent.match(/^https?:\/\//)) {
    if (lowerContent.includes('github.com')) {
      return { entityType: 'Project', confidence: 0.9, reasoning: 'GitHub URL detected' };
    }
    if (lowerContent.includes('spotify.com') || lowerContent.includes('soundcloud.com')) {
      return { entityType: 'Track', confidence: 0.9, reasoning: 'Music platform URL detected' };
    }
    if (lowerContent.includes('linkedin.com')) {
      return { entityType: 'Person', confidence: 0.85, reasoning: 'LinkedIn profile URL detected' };
    }
  }

  // Score each entity type based on keyword matches
  const scores: Array<{ type: EntityTypeName; score: number; matches: string[] }> = [];

  for (const [typeName, schema] of Object.entries(ENTITY_TYPE_SCHEMAS)) {
    const matches = schema.keywords.filter((kw) => lowerContent.includes(kw));
    const score = matches.length / schema.keywords.length;
    scores.push({ type: typeName as EntityTypeName, score, matches });
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  const best = scores[0];

  if (best.score > 0) {
    return {
      entityType: best.type,
      confidence: Math.min(0.5 + best.score * 0.5, 0.9),
      reasoning: `Matched keywords: ${best.matches.join(', ')}`,
    };
  }

  // Default to Memory if no clear match
  return {
    entityType: 'Memory',
    confidence: 0.4,
    reasoning: 'No strong type signals detected, defaulting to Memory',
  };
}

/**
 * Extract entity name from content
 */
function extractEntityName(content: string, entityType: EntityTypeName): string {
  // Try to extract a title or name from the content
  const lines = content.split('\n').filter((l) => l.trim());

  // If first line is short, use it as the name
  if (lines[0] && lines[0].length < 100) {
    return lines[0].trim();
  }

  // For URLs, extract domain or repo name
  const urlMatch = content.match(/https?:\/\/(?:www\.)?([^\/]+)(?:\/([^\/\s]+))?/);
  if (urlMatch) {
    if (urlMatch[2]) return urlMatch[2].replace(/[-_]/g, ' ');
    return urlMatch[1];
  }

  // Truncate long content
  return content.slice(0, 60).trim() + (content.length > 60 ? '...' : '');
}

/**
 * Extract data attributes from content based on entity type
 */
function extractEntityData(
  content: string,
  entityType: EntityTypeName,
  additionalContext?: string
): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  const lowerContent = (content + ' ' + (additionalContext || '')).toLowerCase();

  switch (entityType) {
    case 'Person': {
      // Extract email
      const emailMatch = content.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch) data.email = emailMatch[0];

      // Extract potential company mentions
      const companyPatterns = [/at\s+([A-Z][A-Za-z0-9\s]+)/g, /works?\s+(?:at|for)\s+([A-Z][A-Za-z0-9\s]+)/gi];
      for (const pattern of companyPatterns) {
        const match = pattern.exec(content);
        if (match) {
          data.company = match[1].trim();
          break;
        }
      }

      data.notes = content;
      break;
    }

    case 'Project': {
      data.status = 'discovery';
      data.color = '#8b5cf6'; // Purple default

      // Extract GitHub URL
      const githubMatch = content.match(/https?:\/\/github\.com\/[\w-]+\/[\w-]+/);
      if (githubMatch) data.githubRepo = githubMatch[0];

      data.description = content;
      break;
    }

    case 'Track': {
      data.isPrivate = false;

      // Try to extract artist from "by" or "-" patterns
      const artistPatterns = [/by\s+([^,\n]+)/i, /[-–—]\s*([^,\n]+)/];
      for (const pattern of artistPatterns) {
        const match = pattern.exec(content);
        if (match) {
          data.artist = match[1].trim();
          break;
        }
      }
      if (!data.artist) data.artist = 'Unknown Artist';

      // Extract audio URL
      const audioMatch = content.match(/https?:\/\/[^\s]+\.(mp3|wav|m4a|ogg)/i);
      if (audioMatch) data.audioUrl = audioMatch[0];
      else data.audioUrl = '';

      break;
    }

    case 'Event': {
      data.timezone = 'America/Los_Angeles';
      data.isAllDay = false;

      // Try to parse date/time
      const now = Date.now();
      data.startTime = now;
      data.endTime = now + 60 * 60 * 1000; // 1 hour default

      data.description = content;
      break;
    }

    case 'Memory': {
      data.memoryType = lowerContent.includes('decision') ? 'decision' :
        lowerContent.includes('preference') ? 'preference' :
          lowerContent.includes('milestone') ? 'milestone' : 'interaction';
      data.content = content;
      data.importance = 0.7;
      data.timestamp = Date.now();
      if (additionalContext) data.context = additionalContext;
      break;
    }

    case 'Ticket': {
      // Generate ticket ID
      data.ticketId = `IMPORT-${Date.now().toString(36).toUpperCase()}`;
      data.type = lowerContent.includes('bug') ? 'bug' :
        lowerContent.includes('feature') ? 'story' : 'task';
      data.priority = 'P2';
      data.status = 'backlog';
      data.description = content;
      break;
    }

    case 'Draft': {
      data.content = content;
      data.wordCount = content.split(/\s+/).length;
      data.status = 'draft';
      break;
    }

    case 'Collection': {
      data.description = content;
      data.entityIds = [];
      break;
    }

    case 'Skill': {
      data.level = 'intermediate';
      data.description = content;
      break;
    }

    case 'Value': {
      data.description = content;
      data.priority = 1;
      break;
    }
  }

  return data;
}

/**
 * Analyze content and create an ERV entity
 */
async function executeAnalyzeAndCreateEntity(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const content = args.content as string;
  const contentType = (args.contentType as string) || 'auto';
  const suggestedType = args.suggestedType as string | undefined;
  const additionalContext = args.additionalContext as string | undefined;

  if (!content) {
    return {
      success: false,
      error: 'Content is required for entity classification',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    // Classify the content
    const classification = classifyEntityType(content, suggestedType, contentType);

    // Extract entity name and data
    const name = extractEntityName(content, classification.entityType);
    const data = extractEntityData(content, classification.entityType, additionalContext);

    // Get default tags for the entity type
    const schema = ENTITY_TYPE_SCHEMAS[classification.entityType];
    const tags: string[] = [...schema.defaultTags];

    // Add import tag
    tags.push(`import-${new Date().toISOString().slice(0, 7)}`);

    // Create the entity
    const client = new ConvexHttpClient(convexUrl);
    const result = await client.mutation(api.erv.createEntity, {
      entityType: classification.entityType,
      name,
      data: JSON.stringify(data),
      tags,
      source: 'ai_classification',
      importance: classification.confidence,
    });

    return {
      success: true,
      data: {
        entityId: result.entityId,
        entityType: classification.entityType,
        name,
        confidence: classification.confidence,
        reasoning: classification.reasoning,
        extractedData: data,
        tags,
      },
      action: {
        type: 'entity_classified',
        payload: {
          entityId: result.entityId,
          entityType: classification.entityType,
          name,
          confidence: classification.confidence,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to classify and create entity',
    };
  }
}

/**
 * Suggest relationships for an entity
 */
async function executeSuggestEntityRelationships(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const entityId = args.entityId as string;
  const relationshipTypes = args.relationshipTypes as string[] | undefined;
  const maxSuggestions = (args.maxSuggestions as number) || 10;
  const minConfidence = (args.minConfidence as number) || 0.5;
  const autoCreate = (args.autoCreate as boolean) || false;

  if (!entityId) {
    return {
      success: false,
      error: 'Entity ID is required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    // Get the source entity
    const sourceEntity = await client.query(api.erv.getEntity, { entityId });
    if (!sourceEntity) {
      return {
        success: false,
        error: `Entity not found: ${entityId}`,
      };
    }

    // Parse source entity data
    let sourceData: Record<string, unknown> = {};
    try {
      sourceData = JSON.parse(sourceEntity.data);
    } catch {
      // ignore
    }

    // Search for potentially related entities
    const searchTerms = [
      sourceEntity.name,
      ...sourceEntity.tags,
      ...(Object.values(sourceData).filter((v) => typeof v === 'string') as string[]),
    ].join(' ');

    const candidates = await client.query(api.erv.searchEntities, {
      query: searchTerms,
      limit: 50,
    });

    // Filter out the source entity and score candidates
    const suggestions: Array<{
      targetEntityId: string;
      targetName: string;
      targetType: string;
      relationshipType: string;
      confidence: number;
      reasoning: string;
    }> = [];

    for (const candidate of candidates) {
      if (candidate.entityId === entityId) continue;

      // Calculate relationship suggestions
      let candidateData: Record<string, unknown> = {};
      try {
        candidateData = JSON.parse(candidate.data);
      } catch {
        // ignore
      }

      // Check for tag overlap
      const tagOverlap = sourceEntity.tags.filter((t) => candidate.tags.includes(t));
      const tagScore = tagOverlap.length > 0 ? 0.3 + tagOverlap.length * 0.1 : 0;

      // Check for name similarity
      const nameScore = sourceEntity.name.toLowerCase().includes(candidate.name.toLowerCase()) ||
        candidate.name.toLowerCase().includes(sourceEntity.name.toLowerCase()) ? 0.3 : 0;

      // Determine relationship type based on entity types
      let relType = 'relatedTo';
      let typeReasoning = 'General relationship based on content similarity';

      // Person → Project = collaboratedOn
      if (sourceEntity.entityType === 'Person' && candidate.entityType === 'Project') {
        relType = 'collaboratedOn';
        typeReasoning = 'Person may have collaborated on this project';
      }
      // Ticket → Project = belongsTo
      else if (sourceEntity.entityType === 'Ticket' && candidate.entityType === 'Project') {
        relType = 'belongsTo';
        typeReasoning = 'Ticket likely belongs to this project';
      }
      // Ticket → Ticket = blockedBy or relatedTo
      else if (sourceEntity.entityType === 'Ticket' && candidate.entityType === 'Ticket') {
        relType = 'relatedTo';
        typeReasoning = 'Related tickets with similar content';
      }
      // Memory → Project = mentions
      else if (sourceEntity.entityType === 'Memory' && candidate.entityType === 'Project') {
        relType = 'mentions';
        typeReasoning = 'Memory may reference this project';
      }

      // Filter by requested relationship types
      if (relationshipTypes && !relationshipTypes.includes(relType)) {
        continue;
      }

      const totalScore = Math.min(tagScore + nameScore + 0.2, 1);

      if (totalScore >= minConfidence) {
        suggestions.push({
          targetEntityId: candidate.entityId,
          targetName: candidate.name,
          targetType: candidate.entityType,
          relationshipType: relType,
          confidence: totalScore,
          reasoning: typeReasoning + (tagOverlap.length > 0 ? `. Shared tags: ${tagOverlap.join(', ')}` : ''),
        });
      }
    }

    // Sort by confidence and limit
    suggestions.sort((a, b) => b.confidence - a.confidence);
    const topSuggestions = suggestions.slice(0, maxSuggestions);

    // Auto-create relationships if requested
    const createdRelationships: string[] = [];
    if (autoCreate) {
      for (const suggestion of topSuggestions) {
        try {
          await client.mutation(api.erv.createRelationship, {
            sourceEntityId: entityId,
            targetEntityId: suggestion.targetEntityId,
            relationshipType: suggestion.relationshipType as 'collaboratedOn' | 'createdBy' | 'assignedTo' | 'belongsTo' | 'contains' | 'parentOf' | 'mentions' | 'relatedTo' | 'derivedFrom' | 'followedBy' | 'blockedBy' | 'respondedTo' | 'discussedIn' | 'custom',
            source: 'ai_suggestion',
          });
          createdRelationships.push(`${suggestion.relationshipType} → ${suggestion.targetName}`);
        } catch {
          // Relationship may already exist, skip
        }
      }
    }

    return {
      success: true,
      data: {
        entityId,
        entityName: sourceEntity.name,
        entityType: sourceEntity.entityType,
        suggestions: topSuggestions,
        totalCandidatesAnalyzed: candidates.length,
        createdRelationships: autoCreate ? createdRelationships : undefined,
      },
      action: {
        type: 'relationships_suggested',
        payload: {
          entityId,
          suggestionCount: topSuggestions.length,
          autoCreated: createdRelationships.length,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to suggest relationships',
    };
  }
}

/**
 * Bulk classify and create entities
 */
async function executeBulkClassifyEntities(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  const items = args.items as Array<{ content: string; hint?: string }>;
  const sourceFormat = (args.sourceFormat as string) || 'auto';
  const defaultType = args.defaultType as EntityTypeName | undefined;
  const commonTags = (args.commonTags as string[]) || [];
  const dryRun = (args.dryRun as boolean) || false;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return {
      success: false,
      error: 'Items array is required and must not be empty',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const results: Array<{
      index: number;
      content: string;
      entityType: EntityTypeName;
      name: string;
      confidence: number;
      reasoning: string;
      entityId?: string;
      error?: string;
    }> = [];

    const typeCounts: Record<string, number> = {};

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const content = item.content;

      if (!content || typeof content !== 'string') {
        results.push({
          index: i,
          content: String(content || ''),
          entityType: 'Memory',
          name: '',
          confidence: 0,
          reasoning: 'Invalid content',
          error: 'Content must be a non-empty string',
        });
        continue;
      }

      // Classify the item
      const classification = classifyEntityType(content, defaultType, sourceFormat);
      const name = extractEntityName(content, classification.entityType);
      const data = extractEntityData(content, classification.entityType, item.hint);

      // Get tags
      const schema = ENTITY_TYPE_SCHEMAS[classification.entityType];
      const tags = [...schema.defaultTags, ...commonTags];

      // Track type counts
      typeCounts[classification.entityType] = (typeCounts[classification.entityType] || 0) + 1;

      if (dryRun) {
        results.push({
          index: i,
          content: content.slice(0, 100),
          entityType: classification.entityType,
          name,
          confidence: classification.confidence,
          reasoning: classification.reasoning,
        });
      } else {
        try {
          const result = await client.mutation(api.erv.createEntity, {
            entityType: classification.entityType,
            name,
            data: JSON.stringify(data),
            tags,
            source: 'bulk_import',
            importance: classification.confidence,
          });

          results.push({
            index: i,
            content: content.slice(0, 100),
            entityType: classification.entityType,
            name,
            confidence: classification.confidence,
            reasoning: classification.reasoning,
            entityId: result.entityId,
          });
        } catch (err) {
          results.push({
            index: i,
            content: content.slice(0, 100),
            entityType: classification.entityType,
            name,
            confidence: classification.confidence,
            reasoning: classification.reasoning,
            error: err instanceof Error ? err.message : 'Failed to create entity',
          });
        }
      }
    }

    const successCount = results.filter((r) => !r.error && r.entityId).length;
    const errorCount = results.filter((r) => r.error).length;

    return {
      success: true,
      data: {
        totalItems: items.length,
        dryRun,
        successCount,
        errorCount,
        typeCounts,
        results,
      },
      action: {
        type: 'bulk_classification_complete',
        payload: {
          totalItems: items.length,
          successCount,
          errorCount,
          dryRun,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to bulk classify entities',
    };
  }
}

// =============================================================================
// Autonomous Execution Tools
// These enable 8gent to do real work - spawn tasks, iterate on code,
// and delegate to specialists. Inspired by OpenClaw's sessions_spawn.
// =============================================================================

/**
 * Spawn a background task that runs independently
 * Creates an ERV AgentTask entity for observability through activity/threads/security apps
 */
async function executeSpawnTask(args: Record<string, unknown>): Promise<ToolResult> {
  const task = args.task as string;
  const label = args.label as string | undefined;
  const timeoutSeconds = Math.min((args.timeoutSeconds as number) || 300, 600);
  const announceResult = (args.announceResult as boolean) !== false;
  const priority = (args.priority as 'low' | 'normal' | 'high') || 'normal';
  const context = args.context as Record<string, unknown> | undefined;

  if (!task) {
    return {
      success: false,
      error: 'Task description is required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const result = await client.mutation(api.jobs.queueAgentTask, {
      task,
      label,
      timeoutSeconds,
      announceResult,
      priority,
      context: context as { projectId?: string; ticketId?: string; sandboxId?: string; repositoryUrl?: string } | undefined,
    });

    // Create ERV AgentTask entity for observability
    const agentTaskData = {
      jobId: result.jobId,
      jobType: 'agent_task' as const,
      status: result.status as 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled',
      task,
      label: label || task.slice(0, 50),
      priority,
      progress: 0,
      announceResult,
      context: context as { projectId?: string; ticketId?: string; sandboxId?: string; repositoryUrl?: string } | undefined,
    };

    try {
      // Create the ERV entity
      const entityResult = await client.mutation(api.erv.createEntity, {
        entityType: 'AgentTask',
        name: label || task.slice(0, 50),
        data: JSON.stringify(agentTaskData),
        tags: ['background-task', priority, 'agent_task'],
        importance: priority === 'high' ? 0.8 : priority === 'normal' ? 0.5 : 0.3,
        source: 'ai',
      });

      // Create relationships to context entities if provided
      if (context?.projectId) {
        await client.mutation(api.erv.createRelationship, {
          sourceEntityId: entityResult.entityId,
          targetEntityId: context.projectId as string,
          relationshipType: 'spawnedFor',
          bidirectional: false,
          source: 'ai',
        }).catch(() => { /* Relationship creation is optional */ });
      }

      if (context?.ticketId) {
        await client.mutation(api.erv.createRelationship, {
          sourceEntityId: entityResult.entityId,
          targetEntityId: context.ticketId as string,
          relationshipType: 'spawnedFor',
          bidirectional: false,
          source: 'ai',
        }).catch(() => { /* Relationship creation is optional */ });
      }

      if (context?.sandboxId) {
        await client.mutation(api.erv.createRelationship, {
          sourceEntityId: entityResult.entityId,
          targetEntityId: context.sandboxId as string,
          relationshipType: 'executedIn',
          bidirectional: false,
          source: 'ai',
        }).catch(() => { /* Relationship creation is optional */ });
      }
    } catch {
      // ERV entity creation is optional - don't fail the main task
      console.warn('Failed to create ERV entity for agent task');
    }

    return {
      success: true,
      data: {
        jobId: result.jobId,
        status: result.status,
        task,
        label: label || task.slice(0, 50),
        timeoutSeconds,
        message: `Task spawned! Job ID: ${result.jobId}. I'll work on this in the background and announce the result when done.`,
      },
      action: {
        type: 'task_spawned',
        payload: {
          jobId: result.jobId,
          task,
          label,
          priority,
          announceResult,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to spawn task',
    };
  }
}

/**
 * List background tasks
 */
async function executeListBackgroundTasks(args: Record<string, unknown>): Promise<ToolResult> {
  const status = args.status as string | undefined;
  const limit = (args.limit as number) || 10;

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const jobs = await client.query(api.jobs.getAgentJobs, {
      status: status as 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled' | 'all' | undefined,
      limit,
    });

    const formattedJobs = jobs.map((job: { jobId: string; jobType: string; status: string; progress?: number; progressMessage?: string; createdAt: number; completedAt?: number; input: { task?: string; label?: string; goal?: string; specialist?: string } }) => ({
      jobId: job.jobId,
      type: job.jobType,
      status: job.status,
      progress: job.progress || 0,
      progressMessage: job.progressMessage,
      label: job.input?.label || job.input?.task?.slice(0, 50) || job.input?.goal?.slice(0, 50) || job.input?.specialist,
      createdAt: new Date(job.createdAt).toISOString(),
      completedAt: job.completedAt ? new Date(job.completedAt).toISOString() : undefined,
    }));

    return {
      success: true,
      data: {
        tasks: formattedJobs,
        count: formattedJobs.length,
        message: formattedJobs.length > 0
          ? `Found ${formattedJobs.length} background task(s)`
          : 'No background tasks found',
      },
      action: {
        type: 'tasks_listed',
        payload: {
          tasks: formattedJobs,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list tasks',
    };
  }
}

/**
 * Cancel a background task
 */
async function executeCancelBackgroundTask(args: Record<string, unknown>): Promise<ToolResult> {
  const jobId = args.jobId as string;

  if (!jobId) {
    return {
      success: false,
      error: 'Job ID is required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    await client.mutation(api.jobs.cancelJob, { jobId });

    return {
      success: true,
      data: {
        jobId,
        message: `Task ${jobId} has been cancelled`,
      },
      action: {
        type: 'task_cancelled',
        payload: {
          jobId,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel task',
    };
  }
}

/**
 * Get result of a completed task
 */
async function executeGetTaskResult(args: Record<string, unknown>): Promise<ToolResult> {
  const jobId = args.jobId as string;

  if (!jobId) {
    return {
      success: false,
      error: 'Job ID is required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const job = await client.query(api.jobs.getJob, { jobId });

    if (!job) {
      return {
        success: false,
        error: `Task ${jobId} not found`,
      };
    }

    return {
      success: true,
      data: {
        jobId: job.jobId,
        status: job.status,
        progress: job.progress,
        progressMessage: job.progressMessage,
        input: job.input,
        output: job.output,
        createdAt: new Date(job.createdAt).toISOString(),
        completedAt: job.completedAt ? new Date(job.completedAt).toISOString() : undefined,
        message: job.status === 'succeeded'
          ? 'Task completed successfully'
          : job.status === 'failed'
            ? `Task failed: ${job.lastError || 'Unknown error'}`
            : `Task is ${job.status}`,
      },
      action: {
        type: job.status === 'succeeded' ? 'task_completed' : job.status === 'failed' ? 'task_failed' : 'task_progress',
        payload: {
          jobId: job.jobId,
          status: job.status,
          output: job.output,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get task result',
    };
  }
}

/**
 * Start an autonomous code iteration session
 * Creates an ERV AgentTask entity for observability
 */
async function executeIterateOnCode(args: Record<string, unknown>): Promise<ToolResult> {
  const goal = args.goal as string;
  const sandboxId = args.sandboxId as string;
  const maxIterations = Math.min((args.maxIterations as number) || 5, 10);
  const stopOnSuccess = (args.stopOnSuccess as boolean) !== false;
  const commitChanges = (args.commitChanges as boolean) || false;
  const testCommand = args.testCommand as string | undefined;

  if (!goal) {
    return {
      success: false,
      error: 'Goal is required',
    };
  }

  if (!sandboxId) {
    return {
      success: false,
      error: 'Sandbox ID is required - clone a repo first',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const result = await client.mutation(api.jobs.queueCodeIteration, {
      goal,
      sandboxId,
      maxIterations,
      stopOnSuccess,
      commitChanges,
      testCommand,
    });

    // Create ERV AgentTask entity for code iteration observability
    const agentTaskData = {
      jobId: result.jobId,
      jobType: 'code_iteration' as const,
      status: result.status as 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled',
      task: goal,
      label: `Code: ${goal.slice(0, 40)}`,
      priority: 'normal' as const,
      progress: 0,
      sandboxId,
      testCommand,
      maxIterations,
      announceResult: true,
    };

    try {
      const entityResult = await client.mutation(api.erv.createEntity, {
        entityType: 'AgentTask',
        name: `Code: ${goal.slice(0, 40)}`,
        data: JSON.stringify(agentTaskData),
        tags: ['code-iteration', 'autonomous', sandboxId ? 'sandbox' : 'local'],
        importance: 0.7,
        source: 'ai',
      });

      // Link to sandbox
      if (sandboxId) {
        await client.mutation(api.erv.createRelationship, {
          sourceEntityId: entityResult.entityId,
          targetEntityId: sandboxId,
          relationshipType: 'executedIn',
          bidirectional: false,
          source: 'ai',
        }).catch(() => { /* Optional */ });
      }
    } catch {
      console.warn('Failed to create ERV entity for code iteration');
    }

    return {
      success: true,
      data: {
        jobId: result.jobId,
        status: result.status,
        goal,
        sandboxId,
        maxIterations,
        testCommand,
        message: `Code iteration started! Job ID: ${result.jobId}. I'll analyze the code, make changes, and iterate up to ${maxIterations} times until ${testCommand ? `"${testCommand}" passes` : 'the goal is achieved'}.`,
      },
      action: {
        type: 'iteration_started',
        payload: {
          jobId: result.jobId,
          goal,
          sandboxId,
          maxIterations,
          testCommand,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start code iteration',
    };
  }
}

/**
 * Delegate a task to a specialist agent
 * Creates an ERV AgentTask entity for observability
 */
async function executeDelegateToSpecialist(args: Record<string, unknown>): Promise<ToolResult> {
  const specialist = args.specialist as string;
  const task = args.task as string;
  const context = args.context as Record<string, unknown> | undefined;
  const announceResult = (args.announceResult as boolean) !== false;

  const validSpecialists = [
    'code-reviewer',
    'security-auditor',
    'performance-analyst',
    'documentation-writer',
    'test-generator',
    'refactoring-expert',
  ];

  if (!specialist || !validSpecialists.includes(specialist)) {
    return {
      success: false,
      error: `Invalid specialist. Choose from: ${validSpecialists.join(', ')}`,
    };
  }

  if (!task) {
    return {
      success: false,
      error: 'Task description is required',
    };
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return {
      success: false,
      error: 'Convex URL not configured',
    };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    const result = await client.mutation(api.jobs.queueSpecialistDelegation, {
      specialist: specialist as 'code-reviewer' | 'security-auditor' | 'performance-analyst' | 'documentation-writer' | 'test-generator' | 'refactoring-expert',
      task,
      context,
      announceResult,
    });

    const specialistDescriptions: Record<string, string> = {
      'code-reviewer': 'reviewing the code for quality, patterns, and potential issues',
      'security-auditor': 'analyzing for security vulnerabilities and best practices',
      'performance-analyst': 'identifying performance bottlenecks and optimizations',
      'documentation-writer': 'generating comprehensive documentation',
      'test-generator': 'creating test cases and improving test coverage',
      'refactoring-expert': 'suggesting and implementing code refactoring',
    };

    // Create ERV AgentTask entity for specialist delegation observability
    const agentTaskData = {
      jobId: result.jobId,
      jobType: 'specialist_delegation' as const,
      status: result.status as 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled',
      task,
      label: `${specialist}: ${task.slice(0, 30)}`,
      priority: 'normal' as const,
      progress: 0,
      specialist,
      announceResult,
      context: context as { projectId?: string; ticketId?: string; sandboxId?: string; repositoryUrl?: string } | undefined,
    };

    try {
      const entityResult = await client.mutation(api.erv.createEntity, {
        entityType: 'AgentTask',
        name: `${specialist}: ${task.slice(0, 30)}`,
        data: JSON.stringify(agentTaskData),
        tags: ['specialist', specialist, 'delegation'],
        importance: specialist === 'security-auditor' ? 0.9 : 0.6,
        source: 'ai',
      });

      // Create relationship to indicate delegation type
      await client.mutation(api.erv.createRelationship, {
        sourceEntityId: entityResult.entityId,
        targetEntityId: specialist, // Specialist type as target
        relationshipType: 'delegatedTo',
        bidirectional: false,
        label: specialist,
        source: 'ai',
      }).catch(() => { /* Optional */ });

      // Link to context entities if provided
      if (context?.projectId) {
        await client.mutation(api.erv.createRelationship, {
          sourceEntityId: entityResult.entityId,
          targetEntityId: context.projectId as string,
          relationshipType: 'spawnedFor',
          bidirectional: false,
          source: 'ai',
        }).catch(() => { /* Optional */ });
      }

      if (context?.sandboxId) {
        await client.mutation(api.erv.createRelationship, {
          sourceEntityId: entityResult.entityId,
          targetEntityId: context.sandboxId as string,
          relationshipType: 'executedIn',
          bidirectional: false,
          source: 'ai',
        }).catch(() => { /* Optional */ });
      }
    } catch {
      console.warn('Failed to create ERV entity for specialist delegation');
    }

    return {
      success: true,
      data: {
        jobId: result.jobId,
        status: result.status,
        specialist,
        task,
        message: `Delegated to ${specialist}! Job ID: ${result.jobId}. The specialist is ${specialistDescriptions[specialist]}. I'll announce the findings when complete.`,
      },
      action: {
        type: 'specialist_delegated',
        payload: {
          jobId: result.jobId,
          specialist,
          task,
          announceResult,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delegate to specialist',
    };
  }
}

// ============================================================================
// Music Generation Tools (ACE-Step via Lynkr)
// ============================================================================

interface MusicCowriteDraft {
  prompt?: string;
  lyrics?: string;
  duration?: number;
  bpm?: number;
  key?: string;
  timeSignature?: string;
  title?: string;
  referenceAudioUrl?: string;
  referenceStrength?: number;
}

interface MusicCowriteArgs {
  step: 'start' | 'refine_style' | 'add_lyrics' | 'set_structure' | 'add_reference' | 'finalize' | 'generate';
  userInput: string;
  currentDraft?: string | MusicCowriteDraft; // JSON string (from AI) or object
}

interface MusicGenerateArgs {
  prompt: string;
  lyrics?: string;
  duration?: number;
  bpm?: number;
  key?: string;
  timeSignature?: string;
  referenceAudioUrl?: string;
  referenceStrength?: number;
  title?: string;
  saveToJamz?: boolean;
  projectId?: string;
}

interface MusicGenerateResult {
  id: string;
  status: 'completed' | 'processing' | 'failed';
  audioUrl?: string;
  audioBase64?: string;
  duration: number;
  metadata: {
    bpm: number;
    key: string;
    timeSignature: string;
    model: string;
    lmModel?: string;
  };
  provider: string;
  title?: string;
}

/**
 * Cowrite Music - Conversational music creation assistant
 * Guides users through crafting the perfect music generation request
 */
async function executeCowriteMusic(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  // SECURITY: Owner only
  if (context.accessLevel !== 'owner') {
    return {
      success: false,
      error: 'Music creation is only available to the owner.',
    };
  }

  const params = args as unknown as MusicCowriteArgs;
  // Parse currentDraft from JSON string (tool definition changed to string type for TypeScript compatibility)
  let draft: MusicCowriteDraft = {};
  if (params.currentDraft) {
    try {
      const parsed = typeof params.currentDraft === 'string'
        ? JSON.parse(params.currentDraft)
        : params.currentDraft;
      draft = parsed as MusicCowriteDraft;
    } catch {
      // If parsing fails, start with empty draft
      draft = {};
    }
  }
  const input = params.userInput || '';

  // Build helpful guidance based on step
  switch (params.step) {
    case 'start':
      return {
        success: true,
        data: {
          step: 'start',
          draft,
          guidance: {
            message: "Let's create some music together! Tell me about your vision.",
            questions: [
              "What genre or style are you thinking? (e.g., lofi hip-hop, cinematic orchestral, indie folk)",
              "What mood or feeling should it evoke? (e.g., chill, energetic, melancholic, triumphant)",
              "Is this for something specific? (podcast intro, background music, a full song with lyrics)",
            ],
            suggestions: [
              "chill lofi beats for studying",
              "epic cinematic trailer music",
              "upbeat indie pop with catchy hooks",
              "ambient electronic soundscape",
              "acoustic folk ballad",
            ],
          },
          nextSteps: ['refine_style', 'add_lyrics'],
        },
      };

    case 'refine_style':
      // Parse user input to build style description
      const styleKeywords = extractStyleKeywords(input);
      const enhancedPrompt = buildEnhancedPrompt(input, styleKeywords);

      return {
        success: true,
        data: {
          step: 'refine_style',
          draft: {
            ...draft,
            prompt: enhancedPrompt,
          },
          guidance: {
            message: "Great! I've crafted a style description. Here's what I have:",
            currentPrompt: enhancedPrompt,
            questions: [
              "Should we add or change any instruments?",
              "Any specific production style? (lo-fi, polished, raw, vintage)",
              "What tempo/energy level? (slow and dreamy, mid-tempo groove, fast and energetic)",
            ],
            suggestions: generateStyleSuggestions(styleKeywords),
          },
          nextSteps: ['add_lyrics', 'set_structure', 'add_reference', 'finalize'],
        },
      };

    case 'add_lyrics':
      // Help structure lyrics with proper tags
      const structuredLyrics = structureLyrics(input, draft.lyrics);

      return {
        success: true,
        data: {
          step: 'add_lyrics',
          draft: {
            ...draft,
            lyrics: structuredLyrics || draft.lyrics,
          },
          guidance: {
            message: structuredLyrics
              ? "I've structured your lyrics with song sections:"
              : "Let's write some lyrics! I can help with structure.",
            currentLyrics: structuredLyrics || draft.lyrics,
            tips: [
              "Use [Verse], [Chorus], [Bridge], [Intro], [Outro] tags for structure",
              "Keep verses 4-8 lines, choruses memorable and repeatable",
              "Consider syllable count for natural flow",
              "Leave blank for instrumental tracks",
            ],
            example: `[Intro]\n(Instrumental)\n\n[Verse 1]\nWalking through the morning light\nEverything feels just right\n\n[Chorus]\nThis is where I want to be\nFinally feeling free`,
          },
          nextSteps: ['set_structure', 'add_reference', 'finalize'],
        },
      };

    case 'set_structure':
      // Help set technical parameters
      const suggestedBpm = suggestBpmFromStyle(draft.prompt || input);
      const suggestedKey = suggestKeyFromMood(draft.prompt || input);
      const suggestedDuration = suggestDurationFromType(input, draft.lyrics);

      return {
        success: true,
        data: {
          step: 'set_structure',
          draft: {
            ...draft,
            bpm: draft.bpm || suggestedBpm,
            key: draft.key || suggestedKey,
            duration: draft.duration || suggestedDuration,
            timeSignature: draft.timeSignature || '4/4',
          },
          guidance: {
            message: "Let's dial in the technical specs:",
            suggestions: {
              bpm: { suggested: suggestedBpm, range: "60-200", description: "Tempo/speed of the track" },
              key: { suggested: suggestedKey, common: ["C major", "G major", "A minor", "E minor", "F major"] },
              duration: { suggested: suggestedDuration, range: "10-600 seconds", note: "30s = short clip, 180s = full song" },
              timeSignature: { suggested: "4/4", options: ["4/4 (standard)", "3/4 (waltz)", "6/8 (compound)"] },
            },
          },
          nextSteps: ['add_reference', 'finalize'],
        },
      };

    case 'add_reference':
      // Handle reference audio
      const refUrl = extractUrl(input) || draft.referenceAudioUrl;

      return {
        success: true,
        data: {
          step: 'add_reference',
          draft: {
            ...draft,
            referenceAudioUrl: refUrl,
            referenceStrength: draft.referenceStrength || 0.5,
          },
          guidance: {
            message: refUrl
              ? "Reference audio set! The AI will match this track's vibe."
              : "Want to use a reference track? The AI can match the style of an existing song.",
            currentReference: refUrl,
            tips: [
              "Provide a URL to an MP3, WAV, or audio file",
              "The AI will capture the vibe, energy, and production style",
              "Reference strength (0-1): higher = closer match, lower = more creative freedom",
              "Skip this step if you want fully original style",
            ],
            strengthGuide: {
              "0.2-0.3": "Subtle influence, mostly original",
              "0.4-0.6": "Balanced (recommended)",
              "0.7-0.9": "Strong style match",
            },
          },
          nextSteps: ['finalize'],
        },
      };

    case 'finalize':
      // Show complete draft for review
      return {
        success: true,
        data: {
          step: 'finalize',
          draft,
          readyToGenerate: !!(draft.prompt && draft.prompt.length > 0),
          guidance: {
            message: "Here's your complete music request. Ready to generate?",
            summary: {
              style: draft.prompt || "Not set",
              lyrics: draft.lyrics ? `${draft.lyrics.split('\n').length} lines` : "Instrumental",
              duration: draft.duration ? `${draft.duration} seconds` : "30 seconds (default)",
              bpm: draft.bpm || "Auto-detect",
              key: draft.key || "Auto-detect",
              timeSignature: draft.timeSignature || "4/4",
              reference: draft.referenceAudioUrl ? "Yes" : "No",
            },
            estimatedTime: estimateGenerationTime(draft.duration || 30),
          },
          nextSteps: ['generate'],
        },
      };

    case 'generate':
      // User confirmed, trigger actual generation
      if (!draft.prompt) {
        return {
          success: false,
          error: 'No style prompt set. Use refine_style step first.',
        };
      }

      return {
        success: true,
        data: {
          step: 'generate',
          action: 'TRIGGER_GENERATION',
          payload: {
            prompt: draft.prompt,
            lyrics: draft.lyrics,
            duration: draft.duration || 30,
            bpm: draft.bpm,
            key: draft.key,
            timeSignature: draft.timeSignature || '4/4',
            referenceAudioUrl: draft.referenceAudioUrl,
            referenceStrength: draft.referenceStrength,
            title: draft.title,
          },
          message: "Starting music generation! This may take a few minutes on CPU.",
        },
      };

    default:
      return {
        success: false,
        error: `Unknown cowrite step: ${params.step}`,
      };
  }
}

// Helper functions for cowrite_music
function extractStyleKeywords(input: string): string[] {
  const keywords: string[] = [];
  const genrePatterns = /\b(lofi|lo-fi|hip-hop|hiphop|pop|rock|jazz|blues|electronic|edm|house|techno|ambient|classical|orchestral|cinematic|folk|country|r&b|rnb|soul|funk|reggae|metal|punk|indie|alternative|acoustic|synth|trap|drill|dubstep|dnb|drum and bass)\b/gi;
  const moodPatterns = /\b(chill|relaxing|energetic|upbeat|melancholic|sad|happy|dark|bright|dreamy|ethereal|aggressive|peaceful|nostalgic|epic|dramatic|romantic|playful|mysterious|intense|mellow)\b/gi;
  const instrumentPatterns = /\b(piano|guitar|synth|drums|bass|strings|violin|cello|flute|saxophone|trumpet|organ|vocals|choir|beats|808|percussion)\b/gi;

  const genres = input.match(genrePatterns) || [];
  const moods = input.match(moodPatterns) || [];
  const instruments = input.match(instrumentPatterns) || [];

  return [...new Set([...genres, ...moods, ...instruments].map(k => k.toLowerCase()))];
}

function buildEnhancedPrompt(input: string, keywords: string[]): string {
  // If input is already detailed, use it; otherwise enhance
  if (input.length > 50) return input;

  const parts: string[] = [];

  // Add genre if found
  const genres = keywords.filter(k =>
    ['lofi', 'pop', 'rock', 'jazz', 'electronic', 'ambient', 'classical', 'folk', 'hip-hop'].some(g => k.includes(g))
  );
  if (genres.length > 0) parts.push(genres.join(' '));

  // Add mood
  const moods = keywords.filter(k =>
    ['chill', 'energetic', 'melancholic', 'dreamy', 'epic', 'peaceful'].some(m => k.includes(m))
  );
  if (moods.length > 0) parts.push(`${moods.join(', ')} mood`);

  // Add instruments
  const instruments = keywords.filter(k =>
    ['piano', 'guitar', 'synth', 'drums', 'strings', 'vocals'].some(i => k.includes(i))
  );
  if (instruments.length > 0) parts.push(`featuring ${instruments.join(', ')}`);

  return parts.length > 0 ? parts.join(', ') : input;
}

function generateStyleSuggestions(keywords: string[]): string[] {
  const suggestions: string[] = [];

  if (keywords.includes('lofi') || keywords.includes('chill')) {
    suggestions.push("Add vinyl crackle and warm tape saturation");
    suggestions.push("Include jazzy chord progressions");
  }
  if (keywords.includes('electronic') || keywords.includes('synth')) {
    suggestions.push("Add arpeggiated synth leads");
    suggestions.push("Include sidechained bass and punchy kicks");
  }
  if (keywords.includes('acoustic') || keywords.includes('folk')) {
    suggestions.push("Add fingerpicked guitar patterns");
    suggestions.push("Include soft harmonies and warm vocals");
  }
  if (keywords.includes('cinematic') || keywords.includes('epic')) {
    suggestions.push("Add sweeping string arrangements");
    suggestions.push("Include building percussion and brass");
  }

  if (suggestions.length === 0) {
    suggestions.push("Add more detail about the production style");
    suggestions.push("Specify the main instruments you'd like");
    suggestions.push("Describe the energy/vibe in more detail");
  }

  return suggestions;
}

function structureLyrics(input: string, existingLyrics?: string): string | null {
  // If input contains structure tags, return as-is
  if (input.includes('[Verse]') || input.includes('[Chorus]')) {
    return input;
  }

  // If input looks like lyrics (multiple lines), add basic structure
  const lines = input.split('\n').filter(l => l.trim());
  if (lines.length >= 4) {
    const structured: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      if (i === 0) structured.push('[Verse 1]');
      else if (i === 4 && lines.length > 6) structured.push('\n[Chorus]');
      else if (i === 8 && lines.length > 10) structured.push('\n[Verse 2]');
      structured.push(lines[i]);
    }
    return structured.join('\n');
  }

  return existingLyrics || null;
}

function suggestBpmFromStyle(style: string): number {
  const lower = style.toLowerCase();
  if (lower.includes('ballad') || lower.includes('slow') || lower.includes('ambient')) return 70;
  if (lower.includes('lofi') || lower.includes('chill') || lower.includes('jazz')) return 85;
  if (lower.includes('pop') || lower.includes('indie') || lower.includes('folk')) return 110;
  if (lower.includes('rock') || lower.includes('funk')) return 120;
  if (lower.includes('house') || lower.includes('electronic')) return 125;
  if (lower.includes('dnb') || lower.includes('drum and bass')) return 170;
  if (lower.includes('trap') || lower.includes('hip-hop') || lower.includes('hiphop')) return 140;
  return 100; // Default
}

function suggestKeyFromMood(style: string): string {
  const lower = style.toLowerCase();
  if (lower.includes('sad') || lower.includes('melancholic') || lower.includes('dark')) return 'A minor';
  if (lower.includes('happy') || lower.includes('bright') || lower.includes('upbeat')) return 'C major';
  if (lower.includes('dreamy') || lower.includes('ethereal')) return 'E major';
  if (lower.includes('epic') || lower.includes('dramatic')) return 'D minor';
  if (lower.includes('peaceful') || lower.includes('calm')) return 'G major';
  return 'C major'; // Default
}

function suggestDurationFromType(input: string, lyrics?: string): number {
  const lower = input.toLowerCase();
  if (lower.includes('intro') || lower.includes('jingle') || lower.includes('short')) return 15;
  if (lower.includes('loop') || lower.includes('clip')) return 30;
  if (lower.includes('full song') || lower.includes('complete')) return 180;
  if (lyrics && lyrics.length > 200) return 180; // Long lyrics = full song
  if (lyrics && lyrics.length > 50) return 90; // Some lyrics
  return 30; // Default
}

function extractUrl(input: string): string | null {
  const urlMatch = input.match(/https?:\/\/[^\s]+/);
  return urlMatch ? urlMatch[0] : null;
}

function estimateGenerationTime(duration: number): string {
  // Rough estimate: CPU takes about 2-3x the duration
  const estimate = Math.ceil(duration * 3 / 60);
  if (estimate <= 1) return "About 1-2 minutes";
  return `About ${estimate}-${estimate + 1} minutes`;
}

async function executeGenerateMusic(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  // SECURITY: Owner only
  if (context.accessLevel !== 'owner') {
    return {
      success: false,
      error: 'Music generation is only available to the owner.',
    };
  }

  const params = args as unknown as MusicGenerateArgs;

  if (!params.prompt) {
    return {
      success: false,
      error: 'Prompt is required for music generation.',
    };
  }

  // Validate duration
  const duration = params.duration || 30;
  if (duration < 10 || duration > 600) {
    return {
      success: false,
      error: 'Duration must be between 10 and 600 seconds.',
    };
  }

  try {
    console.log('[MusicGen] Starting generation:', {
      prompt: params.prompt.slice(0, 100),
      duration,
      bpm: params.bpm,
      key: params.key,
      hasReference: !!params.referenceAudioUrl,
    });

    // Call our API endpoint
    const response = await fetch(`${getBaseUrl()}/api/music/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate',
        prompt: params.prompt,
        lyrics: params.lyrics,
        duration,
        bpm: params.bpm,
        key: params.key,
        timeSignature: params.timeSignature,
        referenceAudio: params.referenceAudioUrl,
        referenceStrength: params.referenceStrength ?? 0.5,
        title: params.title,
        saveToJamz: params.saveToJamz,
        projectId: params.projectId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Music generation failed.',
      };
    }

    const result: MusicGenerateResult = await response.json();

    // If saveToJamz is true, create the track in Convex
    if (params.saveToJamz && result.audioUrl) {
      try {
        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
        if (!convexUrl) throw new Error('Convex URL not configured');
        const client = new ConvexHttpClient(convexUrl);
        const trackName = params.title || `AI: ${params.prompt.slice(0, 30)}`;

        // Create or get default project
        let projectId = params.projectId;
        if (!projectId) {
          // Create a new project for AI-generated tracks
          const project = await client.mutation(api.jamz.createProject, {
            name: 'AI Generated Music',
            bpm: result.metadata.bpm,
            timeSignatureBeats: parseInt(result.metadata.timeSignature.split('/')[0]) || 4,
            timeSignatureUnit: parseInt(result.metadata.timeSignature.split('/')[1]) || 4,
          });
          projectId = project;
        }

        // Create the track
        const track = await client.mutation(api.jamz.createTrack, {
          projectId: projectId as Id<'jamzProjects'>,
          name: trackName,
          type: 'audio',
          color: '#8B5CF6', // Purple for AI-generated
        });

        // Create the clip
        await client.mutation(api.jamz.createClip, {
          trackId: track as Id<'jamzTracks'>,
          name: trackName,
          startBeat: 0,
          lengthBeats: Math.round((result.duration * result.metadata.bpm) / 60),
          audioUrl: result.audioUrl,
        });

        console.log('[MusicGen] Saved to Jamz Studio:', track);
      } catch (err) {
        console.error('[MusicGen] Failed to save to Jamz:', err);
        // Don't fail the whole operation, just note it
      }
    }

    return {
      success: true,
      data: {
        id: result.id,
        audioUrl: result.audioUrl,
        duration: result.duration,
        metadata: result.metadata,
        title: result.title || params.title,
        provider: result.provider,
        message: `Generated ${result.duration}s of music at ${result.metadata.bpm} BPM in ${result.metadata.key}.`,
      },
      action: {
        type: 'music_generated',
        payload: {
          id: result.id,
          audioUrl: result.audioUrl,
          duration: result.duration,
          metadata: result.metadata,
          title: result.title || params.title,
        },
      },
    };
  } catch (error) {
    console.error('[MusicGen] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Music generation failed.',
    };
  }
}

interface AnalyzeAudioArgs {
  audioUrl: string;
  extract?: ('bpm' | 'key' | 'time_signature' | 'caption' | 'lyrics')[];
}

async function executeAnalyzeAudio(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  // SECURITY: Owner only
  if (context.accessLevel !== 'owner') {
    return {
      success: false,
      error: 'Audio analysis is only available to the owner.',
    };
  }

  const params = args as unknown as AnalyzeAudioArgs;

  if (!params.audioUrl) {
    return {
      success: false,
      error: 'audioUrl is required for analysis.',
    };
  }

  try {
    console.log('[MusicGen] Analyzing audio:', params.audioUrl);

    const response = await fetch(`${getBaseUrl()}/api/music/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'analyze',
        audioUrl: params.audioUrl,
        extract: params.extract || ['bpm', 'key', 'time_signature', 'caption'],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Audio analysis failed.',
      };
    }

    const result = await response.json();

    return {
      success: true,
      data: {
        ...result,
        message: `Analysis complete: ${result.bpm ? `${result.bpm} BPM` : ''}${result.key ? `, ${result.key}` : ''}${result.caption ? `. ${result.caption}` : ''}`,
      },
      action: {
        type: 'audio_analyzed',
        payload: result,
      },
    };
  } catch (error) {
    console.error('[MusicGen] Analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Audio analysis failed.',
    };
  }
}

interface SeparateStemsArgs {
  audioUrl: string;
  stems?: ('vocals' | 'drums' | 'bass' | 'other' | 'piano' | 'guitar')[];
}

async function executeSeparateStems(
  args: Record<string, unknown>,
  context: ExecutionContext
): Promise<ToolResult> {
  // SECURITY: Owner only
  if (context.accessLevel !== 'owner') {
    return {
      success: false,
      error: 'Stem separation is only available to the owner.',
    };
  }

  const params = args as unknown as SeparateStemsArgs;

  if (!params.audioUrl) {
    return {
      success: false,
      error: 'audioUrl is required for stem separation.',
    };
  }

  try {
    console.log('[MusicGen] Separating stems:', params.audioUrl);

    const response = await fetch(`${getBaseUrl()}/api/music/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'separate',
        audioUrl: params.audioUrl,
        stems: params.stems || ['vocals', 'drums', 'bass', 'other'],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Stem separation failed.',
      };
    }

    const result = await response.json();
    const stemCount = Object.keys(result.stems).length;

    return {
      success: true,
      data: {
        stems: result.stems,
        provider: result.provider,
        message: `Separated ${stemCount} stems: ${Object.keys(result.stems).join(', ')}`,
      },
      action: {
        type: 'stems_separated',
        payload: result,
      },
    };
  } catch (error) {
    console.error('[MusicGen] Separation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Stem separation failed.',
    };
  }
}

// Helper to get base URL for internal API calls
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
}
