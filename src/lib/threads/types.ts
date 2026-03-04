// Thread-Based Engineering Types
// Inspired by Andy Devdan's framework

export type ThreadType = 'base' | 'parallel' | 'chained' | 'fusion' | 'big' | 'long' | 'zero';

export type ThreadStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'reviewing'
  | 'fusing';

export type ModelType = 'haiku' | 'sonnet' | 'opus' | 'opus-4.5' | 'gpt-4o' | 'gemini';

export interface ThreadMetrics {
  toolCalls: number;
  tokensUsed: number;
  estimatedCost: number;
  duration: number; // ms
  checkpointCount: number;
  verificationAttempts: number;
  iterations: number;
}

export interface Thread {
  id: string;
  type: ThreadType;
  status: ThreadStatus;
  name: string;
  prompt: string;
  model: ModelType;

  // Timing
  createdAt: number;
  startedAt?: number;
  completedAt?: number;

  // Progress
  progress: number; // 0-100
  currentStep?: string;

  // Results
  output?: string;
  error?: string;

  // Metrics
  metrics: ThreadMetrics;

  // For chained/big threads
  parentId?: string;
  childIds?: string[];

  // For fusion threads
  fusionStrategy?: 'best-of-n' | 'synthesize' | 'majority' | 'diversity';
  fusionInputIds?: string[];
}

export interface ParallelThreadGroup {
  id: string;
  name: string;
  threadIds: string[];
  createdAt: number;
  status: 'running' | 'completed' | 'partial';
}

export interface FusionResult {
  strategy: 'best-of-n' | 'synthesize' | 'majority' | 'diversity';
  selectedThreadId?: string; // For best-of-n
  synthesizedOutput?: string; // For synthesize
  consensusItems?: string[]; // For majority
  diverseOutputs?: string[]; // For diversity
  confidence: number; // 0-1
}

export interface ThreadEngineState {
  threads: Record<string, Thread>;
  parallelGroups: Record<string, ParallelThreadGroup>;
  activeThreadIds: string[];

  // Global metrics
  totalToolCalls: number;
  totalTokens: number;
  totalCost: number;

  // Settings
  maxParallelThreads: number;
  defaultModel: ModelType;
  autoFuse: boolean;
}

// Actions for thread state management
export type ThreadAction =
  | { type: 'CREATE_THREAD'; payload: Omit<Thread, 'id' | 'metrics' | 'createdAt'> }
  | { type: 'UPDATE_THREAD'; payload: { id: string; updates: Partial<Thread> } }
  | { type: 'DELETE_THREAD'; payload: string }
  | { type: 'START_THREAD'; payload: string }
  | { type: 'PAUSE_THREAD'; payload: string }
  | { type: 'COMPLETE_THREAD'; payload: { id: string; output: string } }
  | { type: 'FAIL_THREAD'; payload: { id: string; error: string } }
  | { type: 'INCREMENT_METRICS'; payload: { id: string; toolCalls?: number; tokens?: number; cost?: number } }
  | { type: 'CREATE_PARALLEL_GROUP'; payload: { name: string; threadIds: string[] } }
  | { type: 'FUSE_THREADS'; payload: { threadIds: string[]; strategy: FusionResult['strategy'] } }
  | { type: 'SET_SETTINGS'; payload: Partial<Pick<ThreadEngineState, 'maxParallelThreads' | 'defaultModel' | 'autoFuse'>> };

// Thread efficiency calculation
export function calculateThreadEfficiency(thread: Thread): number {
  if (!thread.metrics.duration || thread.metrics.duration === 0) return 0;

  const durationMinutes = thread.metrics.duration / 60000;
  const toolCallsPerMinute = thread.metrics.toolCalls / Math.max(durationMinutes, 0.1);
  const checkpointPenalty = thread.metrics.checkpointCount * 0.1;
  const verificationBonus = thread.metrics.verificationAttempts === 1 ? 1.2 : 1;

  return Math.max(0, (toolCallsPerMinute - checkpointPenalty) * verificationBonus);
}

// Thread type display names
export const THREAD_TYPE_NAMES: Record<ThreadType, string> = {
  base: 'Base Thread',
  parallel: 'P-Thread',
  chained: 'C-Thread',
  fusion: 'F-Thread',
  big: 'B-Thread',
  long: 'L-Thread',
  zero: 'Z-Thread',
};

// Thread type colors for UI
export const THREAD_TYPE_COLORS: Record<ThreadType, { bg: string; text: string; glow: string }> = {
  base: { bg: 'bg-slate-500', text: 'text-slate-400', glow: 'rgba(100, 116, 139, 0.5)' },
  parallel: { bg: 'bg-blue-500', text: 'text-blue-400', glow: 'rgba(59, 130, 246, 0.5)' },
  chained: { bg: 'bg-amber-500', text: 'text-amber-400', glow: 'rgba(245, 158, 11, 0.5)' },
  fusion: { bg: 'bg-purple-500', text: 'text-purple-400', glow: 'rgba(168, 85, 247, 0.5)' },
  big: { bg: 'bg-rose-500', text: 'text-rose-400', glow: 'rgba(244, 63, 94, 0.5)' },
  long: { bg: 'bg-emerald-500', text: 'text-emerald-400', glow: 'rgba(16, 185, 129, 0.5)' },
  zero: { bg: 'bg-cyan-500', text: 'text-cyan-400', glow: 'rgba(6, 182, 212, 0.5)' },
};

// Model display info
export const MODEL_INFO: Record<ModelType, { name: string; tier: number; color: string }> = {
  'haiku': { name: 'Claude Haiku', tier: 1, color: '#94a3b8' },
  'sonnet': { name: 'Claude Sonnet', tier: 2, color: '#a78bfa' },
  'opus': { name: 'Claude Opus', tier: 3, color: '#f472b6' },
  'opus-4.5': { name: 'Claude Opus 4.5', tier: 4, color: '#f97316' },
  'gpt-4o': { name: 'GPT-4o', tier: 3, color: '#22c55e' },
  'gemini': { name: 'Gemini Pro', tier: 3, color: '#3b82f6' },
};
