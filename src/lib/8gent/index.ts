/**
 * 8gent Module
 *
 * The core AI assistant for 8gent.
 * Import from "@/lib/8gent" to use.
 *
 * @version 0.1.0
 * @since 2026-02-03
 */

// Tools
export * from "./tools";

// Tool Executor (excluding ExecutionContext to avoid conflict with observability)
export {
  executeTool,
  executeTools,
  formatToolResults,
  validateNetworkAccess,
  validateCommandNetworkAccess,
  checkApprovalRequired,
  approvalRequiredResult,
  estimateCost,
  formatCostEstimate,
  NETWORK_WHITELIST,
  DESTRUCTIVE_ACTIONS,
  FIRST_USE_APPROVAL_ACTIONS,
  type ApprovalRequest,
  type CostEstimate,
  type CostBreakdownItem,
} from "./tool-executor";

// Access Control
export * from "./access-control";

// Search
export * from "./search";

// System Prompt
export * from "./system-prompt";

// Proactive Engine
export * from "./proactive-engine";

// JSON Render Catalog
export * from "./json-render-catalog";

// Canvas Tools
export * from "./canvas-tools";

// Ethical Core
export * from "./ethical-core";

// Observability (Autoship Pattern: Observable autonomy)
export * from "./observability";
