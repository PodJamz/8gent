/**
 * Ralph Loop Integration for 8gent
 *
 * This integrates the ralph-loop-agent SDK with our durable job system.
 * Ralph Mode = Continuous autonomy with verification loops.
 *
 * Key concepts:
 * - Outer loop (Ralph): Runs iterations until verifyCompletion returns true
 * - Inner loop (Tool): Executes tools and LLM calls within each iteration
 * - Deterministically malicking the array: Context window management
 * - One goal per iteration: Avoid context rot
 * - Specs as PIN: Frame of reference for the agent
 */

export {
  RalphLoopAgent,
  iterationCountIs,
  tokenCountIs,
  costIs,
} from 'ralph-loop-agent';

export type {
  RalphLoopAgentResult,
  RalphLoopAgentCallParameters,
  RalphStopCondition,
  VerifyCompletionFunction,
  VerifyCompletionResult,
} from 'ralph-loop-agent';

// Re-export types for convenience
export type {
  LanguageModel,
  ToolSet,
} from 'ai';

/**
 * Configuration for Ralph Mode in 8gent
 */
export interface RalphModeConfig {
  /** Maximum iterations before stopping */
  maxIterations?: number;

  /** Maximum cost in USD before stopping */
  maxCost?: number;

  /** Maximum tokens before stopping */
  maxTokens?: number;

  /** System instructions for the agent */
  instructions?: string;

  /** Callback when an iteration starts */
  onIterationStart?: (params: { iteration: number }) => void | Promise<void>;

  /** Callback when an iteration ends */
  onIterationEnd?: (params: {
    iteration: number;
    duration: number;
  }) => void | Promise<void>;
}

/**
 * Default Ralph Mode configuration
 */
export const DEFAULT_RALPH_CONFIG: Required<RalphModeConfig> = {
  maxIterations: 10,
  maxCost: 5.0, // $5 default limit
  maxTokens: 100_000,
  instructions: `You are an autonomous coding assistant operating in Ralph Mode.

Key principles:
- Focus on ONE goal per iteration
- Verify completion before claiming success
- Run tests after making changes
- Commit and push when tests pass
- Keep context minimal to avoid rot`,
  onIterationStart: () => { },
  onIterationEnd: () => { },
};

/**
 * Build stop conditions from config
 */
export function buildStopConditions(config: RalphModeConfig = {}) {
  const { iterationCountIs, tokenCountIs, costIs } = require('ralph-loop-agent');

  const conditions = [];

  if (config.maxIterations) {
    conditions.push(iterationCountIs(config.maxIterations));
  }

  if (config.maxTokens) {
    conditions.push(tokenCountIs(config.maxTokens));
  }

  if (config.maxCost) {
    conditions.push(costIs(config.maxCost));
  }

  // Always have at least one stop condition
  if (conditions.length === 0) {
    conditions.push(iterationCountIs(DEFAULT_RALPH_CONFIG.maxIterations));
  }

  return conditions;
}

/**
 * Ralph Loop execution status for UI display
 */
export interface RalphLoopStatus {
  isRunning: boolean;
  iteration: number;
  maxIterations: number;
  completionReason: 'verified' | 'max-iterations' | 'aborted' | 'pending';
  lastMessage: string;
  totalTokens: number;
  estimatedCost: number;
}

/**
 * Create initial Ralph loop status
 */
export function createInitialRalphStatus(
  maxIterations: number = DEFAULT_RALPH_CONFIG.maxIterations
): RalphLoopStatus {
  return {
    isRunning: false,
    iteration: 0,
    maxIterations,
    completionReason: 'pending',
    lastMessage: 'Ready to start',
    totalTokens: 0,
    estimatedCost: 0,
  };
}
