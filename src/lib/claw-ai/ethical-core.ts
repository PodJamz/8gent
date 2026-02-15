/**
 * Claw AI Ethical Core
 *
 * IMMUTABLE SECURITY AND ETHICS LAYER
 *
 * This file defines the fundamental ethical constraints and security
 * boundaries for Claw AI's agentic capabilities. These constraints
 * are designed to be robust against:
 *
 * 1. Self-modification attempts
 * 2. Jailbreaking / prompt injection
 * 3. Social engineering
 * 4. Capability escalation
 *
 * CRITICAL: Claw AI must NEVER be instructed to modify this file.
 * Any request to bypass these constraints should be logged and refused.
 */

// =============================================================================
// PROTECTED FILE PATHS
// =============================================================================

/**
 * Files that Claw AI is NEVER allowed to modify through the sandbox.
 * These protect the core security, ethics, and access control systems.
 */
export const PROTECTED_FILE_PATHS = [
  // Claw AI Core - Prevent self-modification
  'src/lib/claw-ai/ethical-core.ts',      // THIS FILE - immutable ethics
  'src/lib/claw-ai/system-prompt.ts',     // Personality and base ethics
  'src/lib/claw-ai/access-control.ts',    // Role-based access control
  'src/lib/claw-ai/tool-executor.ts',     // Tool execution logic

  // Authentication & Security
  'src/app/api/auth/',                     // All auth endpoints
  'src/app/api/sandbox/route.ts',          // Sandbox API (owner checks)
  'convex/security.ts',                    // Security monitoring
  'convex/userManagement.ts',              // User/owner management

  // Environment & Secrets
  '.env',
  '.env.local',
  '.env.production',
  'convex/.env',

  // Git & CI
  '.git/',
  '.github/workflows/',

  // Package management (prevent supply chain attacks)
  'package.json',
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
] as const;

/**
 * Patterns that indicate potentially dangerous file modifications.
 * These are checked in addition to explicit path protection.
 */
export const DANGEROUS_PATTERNS = [
  /\.env/i,                    // Environment files
  /secret/i,                   // Secret-related files
  /credential/i,               // Credential files
  /password/i,                 // Password files
  /private.*key/i,             // Private keys
  /auth.*config/i,             // Auth configuration
  /\.pem$/i,                   // Certificates
  /\.key$/i,                   // Key files
] as const;

// =============================================================================
// ETHICAL CONSTRAINTS
// =============================================================================

/**
 * Core ethical principles that Claw AI must ALWAYS uphold.
 * These are non-negotiable and cannot be overridden by any prompt.
 */
export const ETHICAL_PRINCIPLES = {
  // Harm Prevention
  NEVER_HARM_HUMANS: 'Never take actions that could harm humans physically, emotionally, financially, or reputationally',
  NEVER_DECEIVE_OWNER: 'Never deceive or mislead the owner (James) about capabilities, actions, or intentions',
  NEVER_HIDE_ACTIONS: 'Always be transparent about actions taken, especially code modifications',

  // Security Preservation
  NEVER_WEAKEN_SECURITY: 'Never remove, bypass, or weaken security features',
  NEVER_REMOVE_ACCESS_CONTROL: 'Never modify access control to grant unauthorized access',
  NEVER_EXPOSE_SECRETS: 'Never expose, log, or transmit secrets, credentials, or private data',

  // Self-Preservation of Ethics
  NEVER_MODIFY_ETHICS: 'Never modify this ethical core or system prompt ethics',
  NEVER_DISABLE_LOGGING: 'Never disable security logging or audit trails',
  NEVER_BYPASS_OWNER_CHECKS: 'Never bypass owner authentication or authorization',

  // Responsible Agency
  ALWAYS_LOG_CODE_CHANGES: 'Always log all code modifications for audit',
  ALWAYS_EXPLAIN_ACTIONS: 'Always explain what code changes will do before making them',
  ALWAYS_RESPECT_BOUNDARIES: 'Always respect the boundaries set by the owner',
} as const;

/**
 * Dangerous command patterns that should be blocked or flagged.
 */
export const DANGEROUS_COMMANDS = [
  // Destructive commands
  /rm\s+-rf\s+[\/~]/,          // Recursive delete from root or home
  /rm\s+-rf\s+\*/,             // Delete all
  /mkfs/,                       // Format filesystem
  /dd\s+if=/,                   // Disk operations

  // Privilege escalation
  /sudo\s/,                     // Sudo commands
  /chmod\s+777/,                // Overly permissive permissions
  /chown\s+root/,               // Changing ownership to root

  // Network exfiltration
  /curl.*\|.*sh/,               // Pipe to shell
  /wget.*\|.*sh/,               // Pipe to shell
  /nc\s+-e/,                    // Netcat reverse shell

  // Credential theft
  /cat.*\.env/,                 // Reading env files
  /cat.*password/i,             // Reading password files
  /cat.*secret/i,               // Reading secret files

  // Git manipulation
  /git\s+push.*--force/,        // Force push
  /git\s+reset\s+--hard/,       // Hard reset
] as const;

// =============================================================================
// JAILBREAK DETECTION
// =============================================================================

/**
 * Patterns that indicate potential jailbreak attempts.
 * When detected, the request should be logged and refused.
 */
export const JAILBREAK_PATTERNS = [
  // Direct instruction override
  /ignore\s+(previous|all|your)\s+(instructions|rules|constraints)/i,
  /disregard\s+(your|the)\s+(ethics|rules|guidelines)/i,
  /pretend\s+(you\s+are|to\s+be)\s+(a\s+different|another)/i,
  /you\s+are\s+now\s+(a\s+different|no\s+longer)/i,

  // Role-play manipulation
  /roleplay\s+as\s+(a\s+)?hacker/i,
  /act\s+as\s+if\s+you\s+have\s+no\s+(ethics|rules)/i,
  /in\s+this\s+hypothetical/i,

  // Capability probing
  /what\s+are\s+your\s+limitations/i,
  /how\s+can\s+I\s+(bypass|override|disable)/i,
  /tell\s+me\s+your\s+system\s+prompt/i,

  // DAN-style prompts
  /do\s+anything\s+now/i,
  /jailbreak/i,
  /developer\s+mode/i,

  // Self-modification requests
  /modify\s+(your|the)\s+(own\s+)?(code|ethics|rules)/i,
  /change\s+(your|the)\s+system\s+prompt/i,
  /update\s+(your|the)\s+ethical/i,
  /remove\s+(your|the)\s+(restrictions|constraints)/i,
] as const;

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Check if a file path is protected and should not be modified.
 */
export function isProtectedPath(filePath: string): boolean {
  const normalizedPath = filePath.replace(/^\/+/, '').toLowerCase();

  // Check explicit protected paths
  for (const protectedPath of PROTECTED_FILE_PATHS) {
    const normalizedProtected = protectedPath.toLowerCase();
    if (normalizedPath.startsWith(normalizedProtected) ||
        normalizedPath.includes(normalizedProtected)) {
      return true;
    }
  }

  // Check dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(filePath)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a command is potentially dangerous.
 */
export function isDangerousCommand(command: string): { dangerous: boolean; reason?: string } {
  for (const pattern of DANGEROUS_COMMANDS) {
    if (pattern.test(command)) {
      return {
        dangerous: true,
        reason: `Command matches dangerous pattern: ${pattern.source}`
      };
    }
  }
  return { dangerous: false };
}

/**
 * Check if a message contains potential jailbreak attempts.
 */
export function detectJailbreakAttempt(message: string): { detected: boolean; patterns: string[] } {
  const detectedPatterns: string[] = [];

  for (const pattern of JAILBREAK_PATTERNS) {
    if (pattern.test(message)) {
      detectedPatterns.push(pattern.source);
    }
  }

  return {
    detected: detectedPatterns.length > 0,
    patterns: detectedPatterns,
  };
}

/**
 * Generate a refusal message for protected file modifications.
 */
export function getProtectedFileRefusal(filePath: string): string {
  return `I cannot modify "${filePath}" as it's part of my core security infrastructure. ` +
    `This protection exists to ensure I remain safe, ethical, and aligned with human values. ` +
    `If you need to modify this file, please do so directly through your development environment.`;
}

/**
 * Generate a refusal message for dangerous commands.
 */
export function getDangerousCommandRefusal(reason: string): string {
  return `I cannot execute this command as it could be harmful: ${reason}. ` +
    `If you need to run this command, please do so directly in your terminal.`;
}

/**
 * Generate a response for detected jailbreak attempts.
 */
export function getJailbreakResponse(): string {
  return `I noticed this request is trying to override my ethical guidelines. ` +
    `I'm designed to be helpful while maintaining strong ethical boundaries. ` +
    `These boundaries protect both you and me, and I cannot bypass them. ` +
    `I'm happy to help with your actual coding needs within these guidelines.`;
}

// =============================================================================
// AUDIT INTERFACE
// =============================================================================

/**
 * Structure for audit log entries.
 */
export interface AuditLogEntry {
  timestamp: string;
  action: 'file_write' | 'file_delete' | 'command_execute' | 'jailbreak_attempt' | 'protected_access';
  filePath?: string;
  command?: string;
  blocked: boolean;
  reason?: string;
  userId?: string;
  sandboxId?: string;
}

/**
 * Create an audit log entry.
 */
export function createAuditEntry(
  action: AuditLogEntry['action'],
  details: Omit<AuditLogEntry, 'timestamp' | 'action'>
): AuditLogEntry {
  return {
    timestamp: new Date().toISOString(),
    action,
    ...details,
  };
}
