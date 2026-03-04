/**
 * 8gent Observability Layer
 *
 * Every autonomous action must be inspectable.
 * Following Autoship principle: "Observability is non-optional"
 *
 * Logs:
 * - Who initiated (user, source)
 * - Via which surface (chat, agent, canvas)
 * - Which mutation/tool
 * - What changed
 *
 * @version 0.1.0
 * @since 2026-02-03
 */

import type { ToolCall, ToolResult, ToolAction } from "./tools";

// =============================================================================
// Observability Types
// =============================================================================

/**
 * Surfaces from which 8gent can be invoked.
 */
export type AISurface =
  | "chat"           // Main chat interface
  | "overlay"        // iOS overlay
  | "agent"          // OpenClaw autonomous mode
  | "canvas"         // Design canvas AI generation
  | "api"            // Direct API call
  | "whatsapp"       // WhatsApp channel
  | "sms"            // SMS channel
  | "cron"           // Scheduled invocation
  | "system";        // System-initiated

/**
 * Execution context for observability.
 * Named ObservabilityContext to avoid conflict with tool-executor's ExecutionContext.
 */
export interface ObservabilityContext {
  /** Unique session ID */
  sessionId: string;

  /** User ID (from auth) */
  userId: string;

  /** User's display name */
  userName?: string;

  /** Access level */
  accessLevel: "owner" | "collaborator" | "visitor";

  /** Surface that initiated the request */
  surface: AISurface;

  /** Request timestamp */
  requestedAt: number;

  /** IP address (for audit) */
  ipAddress?: string;

  /** User agent string */
  userAgent?: string;

  /** Conversation ID (for threading) */
  conversationId?: string;

  /** Parent message ID */
  parentMessageId?: string;

  /** Active project context */
  projectContext?: {
    projectId?: string;
    prdId?: string;
    ticketId?: string;
    sandboxId?: string;
  };
}

/**
 * Tool execution log entry.
 */
export interface ToolExecutionLog {
  /** Unique log entry ID */
  id: string;

  /** Execution context */
  context: ObservabilityContext;

  /** The tool that was called */
  toolCall: ToolCall;

  /** Tool execution result */
  result: ToolResult;

  /** Execution timing */
  timing: {
    startedAt: number;
    completedAt: number;
    durationMs: number;
  };

  /** Whether tool was approved (for approval-required tools) */
  approval?: {
    required: boolean;
    approvedBy?: string;
    approvedAt?: number;
    denied?: boolean;
    denialReason?: string;
  };

  /** Cost metrics */
  cost?: {
    tokens?: number;
    apiCalls?: number;
    estimatedCredits?: number;
  };

  /** Mutation details (if tool triggered a mutation) */
  mutation?: {
    type: string;
    entityType?: string;
    entityId?: string;
    beforeState?: unknown;
    afterState?: unknown;
  };

  /** Error details if failed */
  error?: {
    message: string;
    code?: string;
    stack?: string;
  };

  /** Security flags */
  security?: {
    suspicious: boolean;
    reason?: string;
    blockedPatterns?: string[];
  };
}

/**
 * Conversation log entry.
 */
export interface ConversationLog {
  /** Conversation ID */
  conversationId: string;

  /** Execution context */
  context: ObservabilityContext;

  /** Messages in this conversation */
  messages: ConversationMessage[];

  /** Tools used during conversation */
  toolsUsed: string[];

  /** Summary (if compacted) */
  summary?: string;

  /** Timing */
  timing: {
    startedAt: number;
    lastMessageAt: number;
    durationMs: number;
  };

  /** Token usage */
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  timestamp: number;
}

// =============================================================================
// Observability Logger Class
// =============================================================================

/**
 * In-memory observability logger.
 * In production, this would persist to Convex.
 */
export class ObservabilityLogger {
  private toolLogs: ToolExecutionLog[] = [];
  private conversationLogs: Map<string, ConversationLog> = new Map();
  private maxLogSize = 10000;

  // Event listeners for real-time monitoring
  private listeners: Map<string, Set<LogListener>> = new Map();

  /**
   * Log a tool execution.
   */
  logToolExecution(
    context: ObservabilityContext,
    toolCall: ToolCall,
    result: ToolResult,
    startTime: number,
    metadata?: {
      approval?: ToolExecutionLog["approval"];
      cost?: ToolExecutionLog["cost"];
      mutation?: ToolExecutionLog["mutation"];
      security?: ToolExecutionLog["security"];
    }
  ): ToolExecutionLog {
    const completedAt = Date.now();
    const entry: ToolExecutionLog = {
      id: generateLogId(),
      context,
      toolCall,
      result,
      timing: {
        startedAt: startTime,
        completedAt,
        durationMs: completedAt - startTime,
      },
      ...metadata,
    };

    // Add error details if present
    if (!result.success && result.error) {
      entry.error = {
        message: result.error,
        code: typeof result.data === "object" &&
              result.data !== null &&
              "code" in result.data
          ? String((result.data as { code?: unknown }).code)
          : undefined,
      };
    }

    // Store log
    this.toolLogs.push(entry);
    this.trimLogs();

    // Notify listeners
    this.emit("tool_execution", entry);

    return entry;
  }

  /**
   * Start tracking a conversation.
   */
  startConversation(context: ObservabilityContext): ConversationLog {
    const log: ConversationLog = {
      conversationId: context.conversationId || generateLogId(),
      context,
      messages: [],
      toolsUsed: [],
      timing: {
        startedAt: Date.now(),
        lastMessageAt: Date.now(),
        durationMs: 0,
      },
    };

    this.conversationLogs.set(log.conversationId, log);
    this.emit("conversation_started", log);

    return log;
  }

  /**
   * Add message to conversation.
   */
  addConversationMessage(
    conversationId: string,
    message: Omit<ConversationMessage, "id" | "timestamp">
  ): void {
    const log = this.conversationLogs.get(conversationId);
    if (!log) return;

    const fullMessage: ConversationMessage = {
      id: generateLogId(),
      timestamp: Date.now(),
      ...message,
    };

    log.messages.push(fullMessage);
    log.timing.lastMessageAt = fullMessage.timestamp;
    log.timing.durationMs = log.timing.lastMessageAt - log.timing.startedAt;

    // Track tools used
    if (message.toolCalls) {
      for (const tc of message.toolCalls) {
        if (!log.toolsUsed.includes(tc.name)) {
          log.toolsUsed.push(tc.name);
        }
      }
    }

    this.emit("message_added", { conversationId, message: fullMessage });
  }

  /**
   * End a conversation (mark complete, calculate final metrics).
   */
  endConversation(conversationId: string, summary?: string): void {
    const log = this.conversationLogs.get(conversationId);
    if (!log) return;

    if (summary) {
      log.summary = summary;
    }

    log.timing.lastMessageAt = Date.now();
    log.timing.durationMs = log.timing.lastMessageAt - log.timing.startedAt;

    this.emit("conversation_ended", log);
  }

  /**
   * Get tool execution logs with filtering.
   */
  getToolLogs(options?: {
    surface?: AISurface;
    userId?: string;
    toolName?: string;
    successOnly?: boolean;
    since?: number;
    limit?: number;
  }): ToolExecutionLog[] {
    let logs = [...this.toolLogs];

    if (options?.surface) {
      const surface = options.surface;
      logs = logs.filter(l => l.context.surface === surface);
    }
    if (options?.userId) {
      const userId = options.userId;
      logs = logs.filter(l => l.context.userId === userId);
    }
    if (options?.toolName) {
      const toolName = options.toolName;
      logs = logs.filter(l => l.toolCall.name === toolName);
    }
    if (options?.successOnly) {
      logs = logs.filter(l => l.result.success);
    }
    if (options?.since) {
      const since = options.since;
      logs = logs.filter(l => l.timing.startedAt >= since);
    }
    if (options?.limit) {
      const limit = options.limit;
      logs = logs.slice(-limit);
    }

    return logs;
  }

  /**
   * Get conversation logs.
   */
  getConversationLogs(options?: {
    userId?: string;
    surface?: AISurface;
    since?: number;
  }): ConversationLog[] {
    let logs = Array.from(this.conversationLogs.values());

    if (options?.userId) {
      const userId = options.userId;
      logs = logs.filter(l => l.context.userId === userId);
    }
    if (options?.surface) {
      const surface = options.surface;
      logs = logs.filter(l => l.context.surface === surface);
    }
    if (options?.since) {
      const since = options.since;
      logs = logs.filter(l => l.timing.startedAt >= since);
    }

    return logs;
  }

  /**
   * Get statistics summary.
   */
  getStats(since?: number): ObservabilityStats {
    const logs = since
      ? this.toolLogs.filter(l => l.timing.startedAt >= since)
      : this.toolLogs;

    const successCount = logs.filter(l => l.result.success).length;
    const totalDuration = logs.reduce((sum, l) => sum + l.timing.durationMs, 0);

    // Group by tool
    const byTool: Record<string, { count: number; successRate: number; avgDuration: number }> = {};
    for (const log of logs) {
      const name = log.toolCall.name;
      if (!byTool[name]) {
        byTool[name] = { count: 0, successRate: 0, avgDuration: 0 };
      }
      byTool[name].count++;
    }

    // Calculate per-tool stats
    for (const [name, stats] of Object.entries(byTool)) {
      const toolLogs = logs.filter(l => l.toolCall.name === name);
      const toolSuccess = toolLogs.filter(l => l.result.success).length;
      const toolDuration = toolLogs.reduce((sum, l) => sum + l.timing.durationMs, 0);
      stats.successRate = toolLogs.length > 0 ? toolSuccess / toolLogs.length : 0;
      stats.avgDuration = toolLogs.length > 0 ? toolDuration / toolLogs.length : 0;
    }

    // Group by surface
    const bySurface: Record<AISurface, number> = {
      chat: 0, overlay: 0, agent: 0, canvas: 0, api: 0,
      whatsapp: 0, sms: 0, cron: 0, system: 0,
    };
    for (const log of logs) {
      bySurface[log.context.surface]++;
    }

    // Security summary
    const securityFlags = logs.filter(l => l.security?.suspicious).length;

    return {
      totalExecutions: logs.length,
      successRate: logs.length > 0 ? successCount / logs.length : 0,
      averageDurationMs: logs.length > 0 ? totalDuration / logs.length : 0,
      byTool,
      bySurface,
      securityFlags,
      conversationsActive: this.conversationLogs.size,
      oldestLogAt: logs.length > 0 ? logs[0].timing.startedAt : undefined,
      newestLogAt: logs.length > 0 ? logs[logs.length - 1].timing.startedAt : undefined,
    };
  }

  /**
   * Subscribe to log events.
   */
  subscribe(event: LogEvent, listener: LogListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  /**
   * Emit event to listeners.
   */
  private emit(event: LogEvent, data: unknown): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      for (const listener of eventListeners) {
        try {
          listener(data);
        } catch (e) {
          console.error(`[Observability] Listener error for ${event}:`, e);
        }
      }
    }
  }

  /**
   * Trim logs to max size.
   */
  private trimLogs(): void {
    if (this.toolLogs.length > this.maxLogSize) {
      this.toolLogs = this.toolLogs.slice(-this.maxLogSize);
    }
  }

  /**
   * Export logs for persistence.
   */
  exportLogs(): {
    toolLogs: ToolExecutionLog[];
    conversationLogs: ConversationLog[];
    exportedAt: number;
  } {
    return {
      toolLogs: this.toolLogs,
      conversationLogs: Array.from(this.conversationLogs.values()),
      exportedAt: Date.now(),
    };
  }

  /**
   * Clear all logs (for testing).
   */
  clear(): void {
    this.toolLogs = [];
    this.conversationLogs.clear();
  }
}

// =============================================================================
// Types for Stats and Events
// =============================================================================

export interface ObservabilityStats {
  totalExecutions: number;
  successRate: number;
  averageDurationMs: number;
  byTool: Record<string, { count: number; successRate: number; avgDuration: number }>;
  bySurface: Record<AISurface, number>;
  securityFlags: number;
  conversationsActive: number;
  oldestLogAt?: number;
  newestLogAt?: number;
}

export type LogEvent =
  | "tool_execution"
  | "conversation_started"
  | "conversation_ended"
  | "message_added"
  | "security_flag";

export type LogListener = (data: unknown) => void;

// =============================================================================
// Helper Functions
// =============================================================================

function generateLogId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Create execution context from request.
 */
export function createObservabilityContext(
  userId: string,
  accessLevel: "owner" | "collaborator" | "visitor",
  surface: AISurface,
  options?: {
    sessionId?: string;
    userName?: string;
    conversationId?: string;
    parentMessageId?: string;
    ipAddress?: string;
    userAgent?: string;
    projectContext?: ObservabilityContext["projectContext"];
  }
): ObservabilityContext {
  return {
    sessionId: options?.sessionId || generateLogId(),
    userId,
    userName: options?.userName,
    accessLevel,
    surface,
    requestedAt: Date.now(),
    ipAddress: options?.ipAddress,
    userAgent: options?.userAgent,
    conversationId: options?.conversationId,
    parentMessageId: options?.parentMessageId,
    projectContext: options?.projectContext,
  };
}

/**
 * Detect security concerns in tool execution.
 */
export function detectSecurityConcerns(
  toolCall: ToolCall,
  context: ObservabilityContext
): { suspicious: boolean; reason?: string; blockedPatterns?: string[] } {
  const suspiciousPatterns: string[] = [];

  // Check for dangerous commands in code execution tools
  if (toolCall.name === "run_command" || toolCall.name === "execute_code") {
    const command = String(toolCall.arguments.command || toolCall.arguments.code || "");

    const dangerousPatterns = [
      /rm\s+-rf\s+[\/~]/i,        // Recursive delete from root or home
      />\s*\/dev\/sd[a-z]/i,       // Write to disk device
      /:\(\)\{.*\}/,               // Fork bomb pattern
      /curl.*\|\s*(ba)?sh/i,       // Pipe remote script to shell
      /wget.*\|\s*(ba)?sh/i,
      /eval\s*\(/,                 // Eval with dynamic input
      /\$\(.*\)/,                  // Command substitution
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(command)) {
        suspiciousPatterns.push(pattern.source);
      }
    }
  }

  // Check for sensitive file access
  if (toolCall.name === "read_file" || toolCall.name === "write_file") {
    const path = String(toolCall.arguments.path || toolCall.arguments.filePath || "");

    const sensitivePaths = [
      /\.env/i,
      /credentials/i,
      /\.ssh\//i,
      /\.aws\//i,
      /secrets?\./i,
      /private.*key/i,
    ];

    for (const pattern of sensitivePaths) {
      if (pattern.test(path)) {
        suspiciousPatterns.push(pattern.source);
      }
    }
  }

  // Visitor trying to use owner-only tools
  if (context.accessLevel === "visitor" && isOwnerOnlyTool(toolCall.name)) {
    return {
      suspicious: true,
      reason: `Visitor attempted to use owner-only tool: ${toolCall.name}`,
    };
  }

  if (suspiciousPatterns.length > 0) {
    return {
      suspicious: true,
      reason: "Potentially dangerous patterns detected",
      blockedPatterns: suspiciousPatterns,
    };
  }

  return { suspicious: false };
}

/**
 * Check if a tool is owner-only.
 */
function isOwnerOnlyTool(toolName: string): boolean {
  const ownerOnlyTools = [
    "memorize", "learn", "forget",
    "clone_repo", "run_command", "write_file",
    "create_project", "create_prd", "create_ticket",
    "send_channel_message", "compact_conversation",
    "create_cron_job", "update_cron_job", "delete_cron_job",
  ];
  return ownerOnlyTools.includes(toolName);
}

// =============================================================================
// Singleton Instance
// =============================================================================

let loggerInstance: ObservabilityLogger | null = null;

/**
 * Get or create the singleton logger instance.
 */
export function getObservabilityLogger(): ObservabilityLogger {
  if (!loggerInstance) {
    loggerInstance = new ObservabilityLogger();
  }
  return loggerInstance;
}

/**
 * Reset logger (for testing).
 */
export function resetObservabilityLogger(): void {
  loggerInstance = null;
}

// =============================================================================
// High-Level Wrapper for Tool Execution
// =============================================================================

/**
 * Wrap a tool executor with observability logging.
 * This ensures every tool execution is logged automatically.
 */
export function withObservability<T extends ToolCall["arguments"], R>(
  executor: (args: T, context: ObservabilityContext) => Promise<ToolResult>,
  toolName: string
): (args: T, context: ObservabilityContext) => Promise<ToolResult> {
  return async (args: T, context: ObservabilityContext): Promise<ToolResult> => {
    const logger = getObservabilityLogger();
    const startTime = Date.now();

    const toolCall: ToolCall = {
      name: toolName,
      arguments: args as Record<string, unknown>,
    };

    // Security check
    const security = detectSecurityConcerns(toolCall, context);

    try {
      const result = await executor(args, context);

      // Log execution
      logger.logToolExecution(context, toolCall, result, startTime, {
        security: security.suspicious ? security : undefined,
      });

      return result;
    } catch (error) {
      const errorResult: ToolResult = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };

      // Log failed execution
      logger.logToolExecution(context, toolCall, errorResult, startTime, {
        security: security.suspicious ? security : undefined,
      });

      return errorResult;
    }
  };
}
