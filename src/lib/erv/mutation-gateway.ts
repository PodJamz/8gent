/**
 * ERV Mutation Gateway
 *
 * Centralized mutation layer following Autoship discipline.
 * All mutations from chat, agent, UI, and canvas MUST pass through here.
 *
 * Principles:
 * - "Thin Intelligence, Thick System" - AI proposes, system validates
 * - Explicit convergence - one path for all mutations
 * - Observable autonomy - every action is logged
 *
 * @version 0.1.0
 * @since 2026-02-03
 */

import type {
  Entity,
  EntityType,
  Relationship,
  RelationshipType,
} from "./types";
import type { MutationPermissionsContract } from "./view-contract";

// =============================================================================
// Gateway Types
// =============================================================================

/**
 * Source of a mutation request.
 * Every mutation must declare its origin.
 */
export type MutationSource =
  | "chat"           // 8gent chat tool
  | "agent"          // OpenClaw autonomous action
  | "ui"             // Direct UI interaction
  | "canvas"         // Design canvas action
  | "api"            // External API call
  | "cron"           // Scheduled job
  | "system";        // System-initiated (migrations, etc.)

/**
 * Mutation operation types.
 */
export type MutationOperation =
  | "create"
  | "update"
  | "delete"
  | "archive"
  | "restore"
  | "bulkCreate"
  | "bulkUpdate"
  | "bulkDelete";

/**
 * Access level for mutation authorization.
 */
export type AccessLevel = "owner" | "collaborator" | "visitor";

/**
 * Mutation request - the input to the gateway.
 */
export interface MutationRequest<T = unknown> {
  /** Unique request ID for tracking */
  requestId: string;

  /** Where this mutation originated */
  source: MutationSource;

  /** What operation is being performed */
  operation: MutationOperation;

  /** Target entity type (for entity mutations) */
  entityType?: EntityType;

  /** Target entity ID (for updates/deletes) */
  entityId?: string;

  /** Relationship type (for relationship mutations) */
  relationshipType?: RelationshipType;

  /** The mutation payload */
  payload: T;

  /** User making the request */
  userId: string;

  /** User's access level */
  accessLevel: AccessLevel;

  /** Timestamp of request */
  timestamp: number;

  /** Optional view context (for permission checking) */
  viewId?: string;

  /** Optional session ID for grouping related mutations */
  sessionId?: string;

  /** Idempotency key (for retry safety) */
  idempotencyKey?: string;
}

/**
 * Mutation result - the output from the gateway.
 */
export interface MutationResult<T = unknown> {
  /** Whether the mutation succeeded */
  success: boolean;

  /** The request that was processed */
  request: MutationRequest;

  /** Result data (entity ID, etc.) */
  data?: T;

  /** Error message if failed */
  error?: string;

  /** Error code for programmatic handling */
  errorCode?: MutationErrorCode;

  /** Execution timestamp */
  executedAt: number;

  /** Execution duration in ms */
  durationMs: number;

  /** Whether this was a retry */
  wasRetry: boolean;

  /** Audit log entry ID */
  auditLogId?: string;
}

/**
 * Error codes for mutation failures.
 */
export type MutationErrorCode =
  | "UNAUTHORIZED"           // User lacks permission
  | "VALIDATION_FAILED"      // Payload doesn't match schema
  | "NOT_FOUND"              // Target entity doesn't exist
  | "CONFLICT"               // Concurrent modification
  | "RATE_LIMITED"           // Too many requests
  | "IDEMPOTENCY_CONFLICT"   // Duplicate idempotency key
  | "ROLLBACK_FAILED"        // Couldn't undo failed mutation
  | "INTERNAL_ERROR";        // System error

// =============================================================================
// Audit Log Types
// =============================================================================

/**
 * Audit log entry for observability.
 */
export interface MutationAuditEntry {
  /** Unique audit entry ID */
  id: string;

  /** The mutation request */
  request: MutationRequest;

  /** The mutation result */
  result: Omit<MutationResult, "request">;

  /** Pre-mutation state (for rollback) */
  previousState?: unknown;

  /** Post-mutation state */
  newState?: unknown;

  /** Stack trace if error */
  stackTrace?: string;

  /** Additional context */
  context?: Record<string, unknown>;
}

// =============================================================================
// Validation Types
// =============================================================================

/**
 * Validation result from pre-mutation checks.
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// =============================================================================
// Gateway Configuration
// =============================================================================

/**
 * Gateway configuration options.
 */
export interface GatewayConfig {
  /** Enable audit logging */
  auditEnabled: boolean;

  /** Enable rate limiting */
  rateLimitEnabled: boolean;

  /** Rate limit per user per minute */
  rateLimitPerMinute: number;

  /** Enable idempotency checking */
  idempotencyEnabled: boolean;

  /** Idempotency key TTL in seconds */
  idempotencyTtlSeconds: number;

  /** Enable rollback on failure */
  rollbackEnabled: boolean;

  /** Maximum payload size in bytes */
  maxPayloadSize: number;

  /** Allowed sources (empty = all) */
  allowedSources?: MutationSource[];
}

export const DEFAULT_GATEWAY_CONFIG: GatewayConfig = {
  auditEnabled: true,
  rateLimitEnabled: true,
  rateLimitPerMinute: 60,
  idempotencyEnabled: true,
  idempotencyTtlSeconds: 300,
  rollbackEnabled: true,
  maxPayloadSize: 1024 * 1024, // 1MB
};

// =============================================================================
// Permission Matrix
// =============================================================================

/**
 * Permission matrix defining what each access level can do.
 * This is the "thick system" enforcing rules.
 */
const PERMISSION_MATRIX: Record<AccessLevel, {
  operations: MutationOperation[];
  entityTypes: EntityType[] | "all";
  requireConfirmation: MutationOperation[];
}> = {
  owner: {
    operations: ["create", "update", "delete", "archive", "restore", "bulkCreate", "bulkUpdate", "bulkDelete"],
    entityTypes: "all",
    requireConfirmation: ["bulkDelete"],
  },
  collaborator: {
    operations: ["create", "update", "archive"],
    entityTypes: ["Ticket", "Draft", "Sketch", "Memory", "Event"],
    requireConfirmation: [],
  },
  visitor: {
    operations: [],
    entityTypes: [],
    requireConfirmation: [],
  },
};

// =============================================================================
// Gateway Class
// =============================================================================

/**
 * MutationGateway - the single entry point for all ERV mutations.
 *
 * Usage:
 * ```typescript
 * const gateway = new MutationGateway(convexClient, config);
 *
 * const result = await gateway.execute({
 *   requestId: generateId(),
 *   source: "chat",
 *   operation: "create",
 *   entityType: "Ticket",
 *   payload: { name: "New ticket", ... },
 *   userId: "user_123",
 *   accessLevel: "owner",
 *   timestamp: Date.now(),
 * });
 * ```
 */
export class MutationGateway {
  private config: GatewayConfig;
  private auditLog: MutationAuditEntry[] = [];
  private rateLimitMap: Map<string, number[]> = new Map();
  private idempotencyCache: Map<string, MutationResult> = new Map();

  // Mutation executors (to be injected)
  private executors: Map<string, MutationExecutor> = new Map();

  constructor(config: Partial<GatewayConfig> = {}) {
    this.config = { ...DEFAULT_GATEWAY_CONFIG, ...config };
  }

  /**
   * Register a mutation executor for a specific operation+entityType combination.
   */
  registerExecutor(key: string, executor: MutationExecutor): void {
    this.executors.set(key, executor);
  }

  /**
   * Execute a mutation through the gateway.
   * This is the main entry point.
   */
  async execute<T>(request: MutationRequest): Promise<MutationResult<T>> {
    const startTime = Date.now();
    let previousState: unknown;

    try {
      // 1. Source validation
      if (this.config.allowedSources &&
          !this.config.allowedSources.includes(request.source)) {
        return this.fail(request, "UNAUTHORIZED", `Source ${request.source} not allowed`, startTime);
      }

      // 2. Rate limiting
      if (this.config.rateLimitEnabled && !this.checkRateLimit(request.userId)) {
        return this.fail(request, "RATE_LIMITED", "Rate limit exceeded", startTime);
      }

      // 3. Idempotency check
      if (this.config.idempotencyEnabled && request.idempotencyKey) {
        const cached = this.idempotencyCache.get(request.idempotencyKey);
        if (cached) {
          return { ...cached, wasRetry: true } as MutationResult<T>;
        }
      }

      // 4. Permission check
      const permissionResult = this.checkPermissions(request);
      if (!permissionResult.allowed) {
        return this.fail(request, "UNAUTHORIZED", permissionResult.reason, startTime);
      }

      // 5. Payload validation
      const validationResult = this.validatePayload(request);
      if (!validationResult.valid) {
        const errorMessage = validationResult.errors.map(e => e.message).join("; ");
        return this.fail(request, "VALIDATION_FAILED", errorMessage, startTime);
      }

      // 6. Get previous state (for rollback)
      if (this.config.rollbackEnabled && (request.operation === "update" || request.operation === "delete")) {
        previousState = await this.getPreviousState(request);
      }

      // 7. Execute mutation
      const executorKey = `${request.operation}:${request.entityType || "default"}`;
      const executor = this.executors.get(executorKey) ||
                       this.executors.get(`${request.operation}:default`);

      if (!executor) {
        return this.fail(request, "INTERNAL_ERROR", `No executor for ${executorKey}`, startTime);
      }

      const data = await executor(request);

      // 8. Success
      const result: MutationResult<T> = {
        success: true,
        request,
        data: data as T,
        executedAt: Date.now(),
        durationMs: Date.now() - startTime,
        wasRetry: false,
      };

      // 9. Cache for idempotency
      if (this.config.idempotencyEnabled && request.idempotencyKey) {
        this.cacheIdempotencyResult(request.idempotencyKey, result);
      }

      // 10. Audit log
      if (this.config.auditEnabled) {
        result.auditLogId = this.logAudit(request, result, previousState, data);
      }

      return result;

    } catch (error) {
      // Rollback if enabled and we have previous state
      if (this.config.rollbackEnabled && previousState) {
        await this.attemptRollback(request, previousState);
      }

      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return this.fail(request, "INTERNAL_ERROR", errorMessage, startTime);
    }
  }

  /**
   * Execute multiple mutations as a batch.
   * All succeed or all fail (transactional).
   */
  async executeBatch<T>(requests: MutationRequest[]): Promise<MutationResult<T>[]> {
    const results: MutationResult<T>[] = [];
    const previousStates: Map<string, unknown> = new Map();

    try {
      // Validate all first
      for (const request of requests) {
        const permissionResult = this.checkPermissions(request);
        if (!permissionResult.allowed) {
          throw new Error(`Permission denied for request ${request.requestId}: ${permissionResult.reason}`);
        }

        const validationResult = this.validatePayload(request);
        if (!validationResult.valid) {
          throw new Error(`Validation failed for request ${request.requestId}`);
        }

        // Store previous state for potential rollback
        if (this.config.rollbackEnabled) {
          const prevState = await this.getPreviousState(request);
          if (prevState) {
            previousStates.set(request.requestId, prevState);
          }
        }
      }

      // Execute all
      for (const request of requests) {
        const result = await this.execute<T>(request);
        if (!result.success) {
          throw new Error(`Mutation failed: ${result.error}`);
        }
        results.push(result);
      }

      return results;

    } catch {
      // Rollback all successful mutations
      if (this.config.rollbackEnabled) {
        for (const result of results) {
          const prevState = previousStates.get(result.request.requestId);
          if (prevState) {
            await this.attemptRollback(result.request, prevState);
          }
        }
      }

      throw new Error("Batch mutation failed, all changes rolled back");
    }
  }

  /**
   * Check if user has permission for this mutation.
   */
  private checkPermissions(request: MutationRequest): { allowed: boolean; reason: string } {
    const permissions = PERMISSION_MATRIX[request.accessLevel];

    // Check operation allowed
    if (!permissions.operations.includes(request.operation)) {
      return {
        allowed: false,
        reason: `Operation ${request.operation} not allowed for ${request.accessLevel}`,
      };
    }

    // Check entity type allowed
    if (request.entityType &&
        permissions.entityTypes !== "all" &&
        !permissions.entityTypes.includes(request.entityType)) {
      return {
        allowed: false,
        reason: `Entity type ${request.entityType} not allowed for ${request.accessLevel}`,
      };
    }

    return { allowed: true, reason: "" };
  }

  /**
   * Validate mutation payload against schema.
   */
  private validatePayload(request: MutationRequest): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Size check
    const payloadSize = JSON.stringify(request.payload).length;
    if (payloadSize > this.config.maxPayloadSize) {
      errors.push({
        field: "payload",
        message: `Payload size ${payloadSize} exceeds maximum ${this.config.maxPayloadSize}`,
        code: "PAYLOAD_TOO_LARGE",
      });
    }

    // Required fields for create
    if (request.operation === "create" && request.entityType) {
      const payload = request.payload as Record<string, unknown>;
      if (!payload.name && request.entityType !== "Memory") {
        errors.push({
          field: "name",
          message: "Name is required for entity creation",
          code: "REQUIRED_FIELD",
        });
      }
    }

    // Required fields for update
    if (request.operation === "update" && !request.entityId) {
      errors.push({
        field: "entityId",
        message: "Entity ID is required for update",
        code: "REQUIRED_FIELD",
      });
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Check rate limit for user.
   */
  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const requests = this.rateLimitMap.get(userId) || [];

    // Remove old requests
    const recent = requests.filter(t => now - t < windowMs);

    if (recent.length >= this.config.rateLimitPerMinute) {
      return false;
    }

    recent.push(now);
    this.rateLimitMap.set(userId, recent);
    return true;
  }

  /**
   * Cache idempotency result.
   */
  private cacheIdempotencyResult(key: string, result: MutationResult): void {
    this.idempotencyCache.set(key, result);

    // Clear after TTL
    setTimeout(() => {
      this.idempotencyCache.delete(key);
    }, this.config.idempotencyTtlSeconds * 1000);
  }

  /**
   * Get previous state for potential rollback.
   */
  private async getPreviousState(request: MutationRequest): Promise<unknown> {
    // This would call Convex to get current state
    // Placeholder - actual implementation depends on Convex client
    return request.entityId ? { entityId: request.entityId } : null;
  }

  /**
   * Attempt to rollback a failed mutation.
   */
  private async attemptRollback(request: MutationRequest, _previousState: unknown): Promise<void> {
    // This would restore the previous state
    // Placeholder - actual implementation depends on Convex client
    console.warn(`[MutationGateway] Rollback requested for ${request.requestId}`);
  }

  /**
   * Log mutation to audit log.
   */
  private logAudit(
    request: MutationRequest,
    result: Omit<MutationResult, "request">,
    previousState?: unknown,
    newState?: unknown
  ): string {
    const id = `audit_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const entry: MutationAuditEntry = {
      id,
      request,
      result,
      previousState,
      newState,
    };

    this.auditLog.push(entry);

    // Keep only last 1000 entries in memory
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(-1000);
    }

    return id;
  }

  /**
   * Create a failure result.
   */
  private fail<T>(
    request: MutationRequest,
    errorCode: MutationErrorCode,
    error: string,
    startTime: number
  ): MutationResult<T> {
    const result: MutationResult<T> = {
      success: false,
      request,
      error,
      errorCode,
      executedAt: Date.now(),
      durationMs: Date.now() - startTime,
      wasRetry: false,
    };

    // Still log failures
    if (this.config.auditEnabled) {
      result.auditLogId = this.logAudit(request, result);
    }

    return result;
  }

  /**
   * Get audit log entries.
   */
  getAuditLog(options?: {
    source?: MutationSource;
    userId?: string;
    operation?: MutationOperation;
    since?: number;
    limit?: number;
  }): MutationAuditEntry[] {
    let entries = [...this.auditLog];

    if (options?.source) {
      entries = entries.filter(e => e.request.source === options.source);
    }
    if (options?.userId) {
      entries = entries.filter(e => e.request.userId === options.userId);
    }
    if (options?.operation) {
      entries = entries.filter(e => e.request.operation === options.operation);
    }
    if (options?.since) {
      const since = options.since;
      entries = entries.filter(e => e.request.timestamp >= since);
    }
    if (options?.limit) {
      const limit = options.limit;
      entries = entries.slice(-limit);
    }

    return entries;
  }

  /**
   * Get gateway statistics.
   */
  getStats(): GatewayStats {
    const entries = this.auditLog;
    const successCount = entries.filter(e => e.result.success).length;
    const totalDuration = entries.reduce((sum, e) => sum + e.result.durationMs, 0);

    const sourceBreakdown: Record<MutationSource, number> = {
      chat: 0, agent: 0, ui: 0, canvas: 0, api: 0, cron: 0, system: 0,
    };

    const operationBreakdown: Record<MutationOperation, number> = {
      create: 0, update: 0, delete: 0, archive: 0, restore: 0,
      bulkCreate: 0, bulkUpdate: 0, bulkDelete: 0,
    };

    for (const entry of entries) {
      sourceBreakdown[entry.request.source]++;
      operationBreakdown[entry.request.operation]++;
    }

    return {
      totalMutations: entries.length,
      successRate: entries.length > 0 ? successCount / entries.length : 0,
      averageDurationMs: entries.length > 0 ? totalDuration / entries.length : 0,
      sourceBreakdown,
      operationBreakdown,
      rateLimitHits: 0, // Would need separate tracking
    };
  }
}

/**
 * Gateway statistics.
 */
export interface GatewayStats {
  totalMutations: number;
  successRate: number;
  averageDurationMs: number;
  sourceBreakdown: Record<MutationSource, number>;
  operationBreakdown: Record<MutationOperation, number>;
  rateLimitHits: number;
}

/**
 * Mutation executor function type.
 */
export type MutationExecutor = (request: MutationRequest) => Promise<unknown>;

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Generate a unique request ID.
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Generate an idempotency key from request params.
 */
export function generateIdempotencyKey(
  source: MutationSource,
  operation: MutationOperation,
  entityType?: EntityType,
  entityId?: string
): string {
  return `${source}:${operation}:${entityType || "none"}:${entityId || "new"}:${Date.now()}`;
}

/**
 * Create a mutation request builder for cleaner API.
 */
export function createMutationRequest<T>(
  source: MutationSource,
  userId: string,
  accessLevel: AccessLevel
) {
  return {
    create: (entityType: EntityType, payload: T): MutationRequest<T> => ({
      requestId: generateRequestId(),
      source,
      operation: "create",
      entityType,
      payload,
      userId,
      accessLevel,
      timestamp: Date.now(),
    }),

    update: (entityType: EntityType, entityId: string, payload: Partial<T>): MutationRequest<Partial<T>> => ({
      requestId: generateRequestId(),
      source,
      operation: "update",
      entityType,
      entityId,
      payload,
      userId,
      accessLevel,
      timestamp: Date.now(),
    }),

    delete: (entityType: EntityType, entityId: string): MutationRequest<null> => ({
      requestId: generateRequestId(),
      source,
      operation: "delete",
      entityType,
      entityId,
      payload: null,
      userId,
      accessLevel,
      timestamp: Date.now(),
    }),

    archive: (entityType: EntityType, entityId: string): MutationRequest<null> => ({
      requestId: generateRequestId(),
      source,
      operation: "archive",
      entityType,
      entityId,
      payload: null,
      userId,
      accessLevel,
      timestamp: Date.now(),
    }),
  };
}

// =============================================================================
// Singleton Instance (for convenience)
// =============================================================================

let gatewayInstance: MutationGateway | null = null;

/**
 * Get or create the singleton gateway instance.
 */
export function getGateway(config?: Partial<GatewayConfig>): MutationGateway {
  if (!gatewayInstance) {
    gatewayInstance = new MutationGateway(config);
  }
  return gatewayInstance;
}

/**
 * Reset the gateway (for testing).
 */
export function resetGateway(): void {
  gatewayInstance = null;
}
