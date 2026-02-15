/**
 * Observability Integration Library
 *
 * Client-side utilities for logging operations to the observability system.
 * Integrates with Lynkr audit callbacks, API routes, and tool executions.
 *
 * Security scanning patterns inspired by ZeroLeaks
 * (https://github.com/ZeroLeaks/zeroleaks) - an autonomous AI security
 * scanner that detects prompt injection and jailbreak vulnerabilities.
 *
 * Our threat detection extends ZeroLeaks with:
 * - Real-time Convex persistence
 * - Lynkr tunnel integration
 * - Provider health correlation
 * - Cost estimation
 *
 * @see docs/reference/attributions.md for full credits
 *
 * NOTE: Run `npx convex dev` to regenerate API types after schema changes.
 */

import { ConvexReactClient } from "@/lib/convex-shim";

import { api } from '@/lib/convex-shim';

// =============================================================================
// Types
// =============================================================================

export type OperationCategory =
  | "ai_provider"
  | "memory"
  | "tool_execution"
  | "webhook"
  | "system";

export type OperationStatus =
  | "started"
  | "success"
  | "error"
  | "timeout"
  | "rate_limited";

export type Provider =
  | "lynkr"
  | "openai"
  | "anthropic"
  | "ollama"
  | "convex"
  | "internal";

export type ThreatLevel = "none" | "low" | "medium" | "high" | "critical";

export interface OperationLogEntry {
  operationId?: string;
  traceId?: string;
  category: OperationCategory;
  operation: string;
  provider?: Provider;
  model?: string;
  endpoint?: string;
  status: OperationStatus;
  latencyMs?: number;
  errorMessage?: string;
  errorCode?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  estimatedCost?: number;
  requestSummary?: string;
  responseSummary?: string;
  metadata?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  toolName?: string;
  toolStatus?: string;
  threatLevel?: ThreatLevel;
  securityFlags?: string[];
}

// =============================================================================
// Cost Estimation
// =============================================================================

const COST_PER_1K_TOKENS: Record<string, { input: number; output: number }> = {
  "gpt-4": { input: 0.03, output: 0.06 },
  "gpt-4-turbo": { input: 0.01, output: 0.03 },
  "gpt-4o": { input: 0.005, output: 0.015 },
  "gpt-3.5-turbo": { input: 0.0005, output: 0.0015 },
  "claude-3-opus": { input: 0.015, output: 0.075 },
  "claude-3-sonnet": { input: 0.003, output: 0.015 },
  "claude-3-haiku": { input: 0.00025, output: 0.00125 },
  // Local models are free
  "gpt-oss:20b": { input: 0, output: 0 },
  "ollama": { input: 0, output: 0 },
};

export function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  // Find matching model or default to free (local)
  const modelKey = Object.keys(COST_PER_1K_TOKENS).find((k) =>
    model.toLowerCase().includes(k.toLowerCase())
  );

  if (!modelKey) return 0; // Assume local/free

  const rates = COST_PER_1K_TOKENS[modelKey];
  return (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output;
}

// =============================================================================
// Threat Detection
// =============================================================================

const THREAT_PATTERNS = {
  prompt_injection: [
    /ignore (all )?(previous|above|prior) instructions/i,
    /you are now/i,
    /new instructions:/i,
    /system prompt:/i,
    /\[SYSTEM\]/i,
    /<\|im_start\|>/i,
  ],
  jailbreak: [
    /DAN mode/i,
    /developer mode/i,
    /jailbreak/i,
    /bypass (safety|filter|restriction)/i,
    /pretend (you are|to be|you're)/i,
    /roleplay as/i,
  ],
  data_extraction: [
    /what (is|are) your (system prompt|instructions)/i,
    /reveal your/i,
    /show me your prompt/i,
    /repeat (the|your) (system|initial)/i,
    /print your configuration/i,
  ],
  ssrf: [
    /localhost/i,
    /127\.0\.0\.1/,
    /0\.0\.0\.0/,
    /169\.254\./,
    /metadata\.google/i,
  ],
};

export function detectThreats(content: string): {
  threatLevel: ThreatLevel;
  flags: string[];
} {
  const flags: string[] = [];

  for (const [category, patterns] of Object.entries(THREAT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        flags.push(category);
        break;
      }
    }
  }

  // Determine threat level based on flags
  let threatLevel: ThreatLevel = "none";
  if (flags.includes("jailbreak") || flags.includes("data_extraction")) {
    threatLevel = "high";
  } else if (flags.includes("prompt_injection")) {
    threatLevel = "medium";
  } else if (flags.includes("ssrf")) {
    threatLevel = "critical";
  } else if (flags.length > 0) {
    threatLevel = "low";
  }

  return { threatLevel, flags };
}

// =============================================================================
// Logger Class
// =============================================================================

export class ObservabilityLogger {
  private convex: ConvexReactClient | null = null;
  private pendingLogs: OperationLogEntry[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor(convexClient?: ConvexReactClient) {
    if (convexClient) {
      this.convex = convexClient;
    }

    // Flush pending logs every 5 seconds
    if (typeof window !== "undefined") {
      this.flushInterval = setInterval(() => this.flush(), 5000);
    }
  }

  setConvexClient(client: ConvexReactClient) {
    this.convex = client;
    // Flush any pending logs
    this.flush();
  }

  /**
   * Log an operation
   */
  async log(entry: OperationLogEntry): Promise<string> {
    const operationId = entry.operationId ?? crypto.randomUUID();

    // Auto-detect threats if content is provided
    if (entry.requestSummary && !entry.threatLevel) {
      const { threatLevel, flags } = detectThreats(entry.requestSummary);
      entry.threatLevel = threatLevel;
      entry.securityFlags = flags;
    }

    // Calculate cost if tokens provided
    if (
      entry.inputTokens &&
      entry.outputTokens &&
      entry.model &&
      !entry.estimatedCost
    ) {
      entry.estimatedCost = estimateCost(
        entry.model,
        entry.inputTokens,
        entry.outputTokens
      );
    }

    const logEntry: OperationLogEntry = {
      ...entry,
      operationId,
      metadata: entry.metadata ? JSON.stringify(entry.metadata) as unknown as Record<string, unknown> : undefined,
    };

    if (this.convex && api?.observability?.logOperation) {
      try {
        await this.convex.mutation(api.observability.logOperation, {
          ...logEntry,
          metadata: entry.metadata ? JSON.stringify(entry.metadata) : undefined,
        });
      } catch (error) {
        console.error("[Observability] Failed to log operation:", error);
        // Queue for retry
        this.pendingLogs.push(logEntry);
      }
    } else {
      // Queue until Convex client and API are available
      this.pendingLogs.push(logEntry);
    }

    // Also log to console in development
    if (process.env.NODE_ENV === "development") {
      const emoji = this.getStatusEmoji(entry.status);
      const color = this.getThreatColor(entry.threatLevel);
      console.log(
        `${emoji} [${entry.category}] ${entry.operation}`,
        entry.provider ? `via ${entry.provider}` : "",
        entry.latencyMs ? `(${entry.latencyMs}ms)` : "",
        color ? `⚠️ ${entry.threatLevel}` : ""
      );
    }

    return operationId;
  }

  /**
   * Start tracking an operation (returns a function to complete it)
   */
  startOperation(
    entry: Omit<OperationLogEntry, "status" | "latencyMs">
  ): {
    operationId: string;
    complete: (result: {
      status: OperationStatus;
      errorMessage?: string;
      errorCode?: string;
      inputTokens?: number;
      outputTokens?: number;
      responseSummary?: string;
    }) => Promise<void>;
  } {
    const operationId = entry.operationId ?? crypto.randomUUID();
    const startTime = Date.now();

    // Log the start
    this.log({
      ...entry,
      operationId,
      status: "started",
    });

    return {
      operationId,
      complete: async (result) => {
        const latencyMs = Date.now() - startTime;
        await this.log({
          ...entry,
          operationId,
          ...result,
          latencyMs,
        });
      },
    };
  }

  /**
   * Flush pending logs
   */
  async flush(): Promise<void> {
    if (!this.convex || !api?.observability?.logOperation || this.pendingLogs.length === 0) return;

    const logs = [...this.pendingLogs];
    this.pendingLogs = [];

    for (const log of logs) {
      try {
        await this.convex.mutation(api.observability.logOperation, {
          ...log,
          metadata: typeof log.metadata === 'object' ? JSON.stringify(log.metadata) : log.metadata,
        });
      } catch {
        // Re-queue on failure
        this.pendingLogs.push(log);
      }
    }
  }

  /**
   * Clean up
   */
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush();
  }

  private getStatusEmoji(status: OperationStatus): string {
    switch (status) {
      case "started":
        return "🔵";
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "timeout":
        return "⏱️";
      case "rate_limited":
        return "🚫";
      default:
        return "⚪";
    }
  }

  private getThreatColor(level?: ThreatLevel): string | null {
    switch (level) {
      case "critical":
        return "#ef4444"; // red
      case "high":
        return "#f97316"; // orange
      case "medium":
        return "#eab308"; // yellow
      case "low":
        return "#3b82f6"; // blue
      default:
        return null;
    }
  }
}

// =============================================================================
// Singleton Instance
// =============================================================================

let loggerInstance: ObservabilityLogger | null = null;

export function getObservabilityLogger(): ObservabilityLogger {
  if (!loggerInstance) {
    loggerInstance = new ObservabilityLogger();
  }
  return loggerInstance;
}

export function initializeObservability(convex: ConvexReactClient): void {
  getObservabilityLogger().setConvexClient(convex);
}

// =============================================================================
// Lynkr Integration
// =============================================================================

import type { LynkrAuditLog } from "@/lib/lynkr/client";

/**
 * Create a Lynkr audit callback that logs to the observability system
 */
export function createLynkrAuditCallback(
  logger: ObservabilityLogger
): (log: LynkrAuditLog) => void {
  return (log: LynkrAuditLog) => {
    logger.log({
      category: "ai_provider",
      operation: log.action,
      provider: "lynkr",
      model: log.model,
      endpoint: log.baseUrl,
      status: log.success ? "success" : "error",
      latencyMs: log.latencyMs,
      errorMessage: log.error,
      inputTokens: log.inputTokens,
      outputTokens: log.outputTokens,
    });
  };
}

// =============================================================================
// API Route Helper
// =============================================================================

/**
 * Helper for logging API route operations (server-side)
 * Uses fetch to call the logging API since we can't use Convex client directly
 */
export async function logApiOperation(
  entry: OperationLogEntry
): Promise<string> {
  const operationId = entry.operationId ?? crypto.randomUUID();

  // Auto-detect threats
  if (entry.requestSummary && !entry.threatLevel) {
    const { threatLevel, flags } = detectThreats(entry.requestSummary);
    entry.threatLevel = threatLevel;
    entry.securityFlags = flags;
  }

  // Calculate cost
  if (
    entry.inputTokens &&
    entry.outputTokens &&
    entry.model &&
    !entry.estimatedCost
  ) {
    entry.estimatedCost = estimateCost(
      entry.model,
      entry.inputTokens,
      entry.outputTokens
    );
  }

  // Log to console for now (server-side logging to Convex
  // should be done via internal mutation in API route)
  console.log(
    `[Observability] ${entry.status} ${entry.category}/${entry.operation}`,
    entry.provider ? `via ${entry.provider}` : "",
    entry.latencyMs ? `(${entry.latencyMs}ms)` : ""
  );

  return operationId;
}

// =============================================================================
// UI Colors
// =============================================================================

export const THREAT_COLORS = {
  none: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
  },
  low: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/20",
  },
  medium: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    glow: "shadow-yellow-500/20",
  },
  high: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/30",
    glow: "shadow-orange-500/20",
  },
  critical: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
    glow: "shadow-red-500/20",
  },
};

export const STATUS_COLORS = {
  started: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  success: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  error: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
  },
  timeout: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/30",
  },
  rate_limited: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
};

export const CATEGORY_COLORS = {
  ai_provider: {
    bg: "bg-violet-500/20",
    text: "text-violet-400",
    icon: "🤖",
  },
  memory: {
    bg: "bg-pink-500/20",
    text: "text-pink-400",
    icon: "🧠",
  },
  tool_execution: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    icon: "🔧",
  },
  webhook: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    icon: "📥",
  },
  system: {
    bg: "bg-slate-500/20",
    text: "text-slate-400",
    icon: "⚙️",
  },
};

export const PROVIDER_COLORS = {
  lynkr: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    icon: "🔗",
  },
  openai: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    icon: "🟢",
  },
  anthropic: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    icon: "🟠",
  },
  ollama: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    icon: "🦙",
  },
  convex: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    icon: "⚡",
  },
  internal: {
    bg: "bg-slate-500/20",
    text: "text-slate-400",
    icon: "🔒",
  },
};
