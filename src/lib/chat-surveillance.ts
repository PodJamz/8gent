/**
 * Chat Surveillance Middleware
 *
 * Integrates threat detection into AI chat conversations.
 * Provides real-time monitoring, logging, and prevention.
 *
 * NOTE: Temporarily stubbed until Convex conversations module is regenerated.
 * Run `npx convex dev` to regenerate the API types and restore full functionality.
 */

import { NextRequest } from 'next/server';
import {
  ThreatAnalysisResult,
  ThreatSeverity,
} from './threat-detection';

// =============================================================================
// Types
// =============================================================================

export interface ChatSurveillanceConfig {
  enabled: boolean;
  blockThreshold: number;
  alertThreshold: number;
  logAllMessages: boolean;
  enablePrevention: boolean;
}

export interface MonitoredMessage {
  messageId: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  analysis?: ThreatAnalysisResult;
  blocked?: boolean;
  timestamp: number;
}

export interface SurveillanceContext {
  sessionId: string;
  userId?: string;
  anonymousId: string;
  ipAddress: string;
  userAgent?: string;
  geoCountry?: string;
  geoCity?: string;
  deviceType?: string;
  browser?: string;
  messageHistory: MonitoredMessage[];
  analysisHistory: ThreatAnalysisResult[];
}

// =============================================================================
// Default Configuration
// =============================================================================

const DEFAULT_CONFIG: ChatSurveillanceConfig = {
  enabled: false, // Disabled until Convex is regenerated
  blockThreshold: 8,
  alertThreshold: 5,
  logAllMessages: false,
  enablePrevention: false,
};

// =============================================================================
// Stubbed ChatSurveillance Class
// =============================================================================

export class ChatSurveillance {
  private config: ChatSurveillanceConfig;

  constructor(config: Partial<ChatSurveillanceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    console.log('ChatSurveillance: Running in stub mode - awaiting Convex regeneration');
  }

  async initSession(
    request: NextRequest,
    userId?: string
  ): Promise<SurveillanceContext> {
    const sessionId = crypto.randomUUID();
    return {
      sessionId,
      userId,
      anonymousId: 'stub-' + sessionId.slice(0, 8),
      ipAddress: '0.0.0.0',
      messageHistory: [],
      analysisHistory: [],
    };
  }

  async processMessage(
    context: SurveillanceContext,
    content: string,
    role: 'user' | 'assistant' | 'system' | 'tool' = 'user'
  ): Promise<{
    allowed: boolean;
    analysis?: ThreatAnalysisResult;
    message: MonitoredMessage;
  }> {
    const message: MonitoredMessage = {
      messageId: crypto.randomUUID(),
      sessionId: context.sessionId,
      role,
      content,
      timestamp: Date.now(),
    };

    return {
      allowed: true,
      message,
    };
  }

  async endSession(context: SurveillanceContext): Promise<void> {
    // No-op in stub mode
  }

  async reportMessage(
    context: SurveillanceContext,
    messageId: string,
    reason: string
  ): Promise<void> {
    // No-op in stub mode
  }
}

// =============================================================================
// Error Classes
// =============================================================================

export class BlockedUserError extends Error {
  constructor(public reason: string, public blockType: string) {
    super(`User blocked: ${reason}`);
    this.name = 'BlockedUserError';
  }
}

export class ThreatDetectedError extends Error {
  constructor(
    public analysis: ThreatAnalysisResult,
    public severity: ThreatSeverity
  ) {
    super(`Threat detected: ${analysis.patterns.join(', ') || 'unknown'}`);
    this.name = 'ThreatDetectedError';
  }
}

// =============================================================================
// Singleton & Utilities
// =============================================================================

let globalInstance: ChatSurveillance | null = null;

export function getChatSurveillance(
  config?: Partial<ChatSurveillanceConfig>
): ChatSurveillance {
  if (!globalInstance) {
    globalInstance = new ChatSurveillance(config);
  }
  return globalInstance;
}

export function quickThreatCheck(content: string): {
  suspicious: boolean;
  reason?: string;
} {
  // Basic stub check
  return { suspicious: false };
}

export function sanitizeContent(content: string): string {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[script removed]')
    .replace(/javascript:/gi, '[js removed]')
    .replace(/on\w+\s*=/gi, '[event handler removed]');
}
