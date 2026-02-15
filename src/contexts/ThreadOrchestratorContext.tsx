'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, useMemo } from 'react';
import {
  Thread,
  ThreadType,
  ThreadStatus,
  ModelType,
  ThreadEngineState,
  ThreadAction,
  ThreadMetrics,
  ParallelThreadGroup,
  FusionResult,
  generateThreadId,
  generateGroupId,
} from '@/lib/threads';

// ============================================================================
// Initial State
// ============================================================================

const createEmptyMetrics = (): ThreadMetrics => ({
  toolCalls: 0,
  tokensUsed: 0,
  estimatedCost: 0,
  duration: 0,
  checkpointCount: 0,
  verificationAttempts: 0,
  iterations: 0,
});

const initialState: ThreadEngineState = {
  threads: {},
  parallelGroups: {},
  activeThreadIds: [],
  totalToolCalls: 0,
  totalTokens: 0,
  totalCost: 0,
  maxParallelThreads: 5,
  defaultModel: 'opus-4.5',
  autoFuse: false,
};

// ============================================================================
// Reducer
// ============================================================================

function threadReducer(state: ThreadEngineState, action: ThreadAction): ThreadEngineState {
  switch (action.type) {
    case 'CREATE_THREAD': {
      const id = generateThreadId();
      const thread: Thread = {
        id,
        ...action.payload,
        createdAt: Date.now(),
        metrics: createEmptyMetrics(),
      };
      return {
        ...state,
        threads: { ...state.threads, [id]: thread },
      };
    }

    case 'UPDATE_THREAD': {
      const { id, updates } = action.payload;
      const thread = state.threads[id];
      if (!thread) return state;
      return {
        ...state,
        threads: {
          ...state.threads,
          [id]: { ...thread, ...updates },
        },
      };
    }

    case 'DELETE_THREAD': {
      const { [action.payload]: _, ...remainingThreads } = state.threads;
      return {
        ...state,
        threads: remainingThreads,
        activeThreadIds: state.activeThreadIds.filter((id) => id !== action.payload),
      };
    }

    case 'START_THREAD': {
      const thread = state.threads[action.payload];
      if (!thread) return state;
      return {
        ...state,
        threads: {
          ...state.threads,
          [action.payload]: {
            ...thread,
            status: 'running',
            startedAt: Date.now(),
          },
        },
        activeThreadIds: [...state.activeThreadIds, action.payload],
      };
    }

    case 'PAUSE_THREAD': {
      const thread = state.threads[action.payload];
      if (!thread) return state;
      const duration = thread.startedAt ? Date.now() - thread.startedAt : 0;
      return {
        ...state,
        threads: {
          ...state.threads,
          [action.payload]: {
            ...thread,
            status: 'paused',
            metrics: {
              ...thread.metrics,
              duration: thread.metrics.duration + duration,
            },
          },
        },
        activeThreadIds: state.activeThreadIds.filter((id) => id !== action.payload),
      };
    }

    case 'COMPLETE_THREAD': {
      const { id, output } = action.payload;
      const thread = state.threads[id];
      if (!thread) return state;
      const duration = thread.startedAt ? Date.now() - thread.startedAt : 0;
      return {
        ...state,
        threads: {
          ...state.threads,
          [id]: {
            ...thread,
            status: 'completed',
            completedAt: Date.now(),
            output,
            progress: 100,
            metrics: {
              ...thread.metrics,
              duration: thread.metrics.duration + duration,
            },
          },
        },
        activeThreadIds: state.activeThreadIds.filter((tid) => tid !== id),
        totalToolCalls: state.totalToolCalls + thread.metrics.toolCalls,
        totalTokens: state.totalTokens + thread.metrics.tokensUsed,
        totalCost: state.totalCost + thread.metrics.estimatedCost,
      };
    }

    case 'FAIL_THREAD': {
      const { id, error } = action.payload;
      const thread = state.threads[id];
      if (!thread) return state;
      return {
        ...state,
        threads: {
          ...state.threads,
          [id]: {
            ...thread,
            status: 'failed',
            completedAt: Date.now(),
            error,
          },
        },
        activeThreadIds: state.activeThreadIds.filter((tid) => tid !== id),
      };
    }

    case 'INCREMENT_METRICS': {
      const { id, toolCalls = 0, tokens = 0, cost = 0 } = action.payload;
      const thread = state.threads[id];
      if (!thread) return state;
      return {
        ...state,
        threads: {
          ...state.threads,
          [id]: {
            ...thread,
            metrics: {
              ...thread.metrics,
              toolCalls: thread.metrics.toolCalls + toolCalls,
              tokensUsed: thread.metrics.tokensUsed + tokens,
              estimatedCost: thread.metrics.estimatedCost + cost,
            },
          },
        },
      };
    }

    case 'CREATE_PARALLEL_GROUP': {
      const { name, threadIds } = action.payload;
      const id = generateGroupId();
      const group: ParallelThreadGroup = {
        id,
        name,
        threadIds,
        createdAt: Date.now(),
        status: 'running',
      };
      return {
        ...state,
        parallelGroups: { ...state.parallelGroups, [id]: group },
      };
    }

    case 'SET_SETTINGS': {
      return {
        ...state,
        ...action.payload,
      };
    }

    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

interface ThreadOrchestratorContextValue {
  state: ThreadEngineState;

  // Thread management
  createThread: (params: {
    type: ThreadType;
    name: string;
    prompt: string;
    model?: ModelType;
  }) => string;
  startThread: (id: string) => void;
  pauseThread: (id: string) => void;
  completeThread: (id: string, output: string) => void;
  failThread: (id: string, error: string) => void;
  deleteThread: (id: string) => void;
  updateThreadProgress: (id: string, progress: number, currentStep?: string) => void;
  incrementMetrics: (id: string, toolCalls?: number, tokens?: number, cost?: number) => void;

  // Parallel threads
  createParallelGroup: (name: string, prompts: string[], model?: ModelType) => string[];
  getParallelGroup: (id: string) => ParallelThreadGroup | undefined;

  // Computed values
  getThread: (id: string) => Thread | undefined;
  getActiveThreads: () => Thread[];
  getCompletedThreads: () => Thread[];
  getThreadsByType: (type: ThreadType) => Thread[];

  // Stats
  stats: {
    totalThreads: number;
    activeThreads: number;
    completedThreads: number;
    totalToolCalls: number;
    totalCost: number;
    avgEfficiency: number;
  };
}

const ThreadOrchestratorContext = createContext<ThreadOrchestratorContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface ThreadOrchestratorProviderProps {
  children: React.ReactNode;
}

export function ThreadOrchestratorProvider({ children }: ThreadOrchestratorProviderProps) {
  const [state, dispatch] = useReducer(threadReducer, initialState);

  // Thread management
  const createThread = useCallback(
    (params: { type: ThreadType; name: string; prompt: string; model?: ModelType }) => {
      const id = generateThreadId();
      const thread: Omit<Thread, 'id' | 'metrics' | 'createdAt'> = {
        type: params.type,
        name: params.name,
        prompt: params.prompt,
        model: params.model || state.defaultModel,
        status: 'idle',
        progress: 0,
      };
      dispatch({ type: 'CREATE_THREAD', payload: thread });
      return id;
    },
    [state.defaultModel]
  );

  const startThread = useCallback((id: string) => {
    dispatch({ type: 'START_THREAD', payload: id });
  }, []);

  const pauseThread = useCallback((id: string) => {
    dispatch({ type: 'PAUSE_THREAD', payload: id });
  }, []);

  const completeThread = useCallback((id: string, output: string) => {
    dispatch({ type: 'COMPLETE_THREAD', payload: { id, output } });
  }, []);

  const failThread = useCallback((id: string, error: string) => {
    dispatch({ type: 'FAIL_THREAD', payload: { id, error } });
  }, []);

  const deleteThread = useCallback((id: string) => {
    dispatch({ type: 'DELETE_THREAD', payload: id });
  }, []);

  const updateThreadProgress = useCallback((id: string, progress: number, currentStep?: string) => {
    dispatch({
      type: 'UPDATE_THREAD',
      payload: { id, updates: { progress, currentStep } },
    });
  }, []);

  const incrementMetrics = useCallback(
    (id: string, toolCalls?: number, tokens?: number, cost?: number) => {
      dispatch({
        type: 'INCREMENT_METRICS',
        payload: { id, toolCalls, tokens, cost },
      });
    },
    []
  );

  // Parallel threads
  const createParallelGroup = useCallback(
    (name: string, prompts: string[], model?: ModelType) => {
      const threadIds = prompts.map((prompt, i) => {
        const id = generateThreadId();
        dispatch({
          type: 'CREATE_THREAD',
          payload: {
            type: 'parallel',
            name: `${name} #${i + 1}`,
            prompt,
            model: model || state.defaultModel,
            status: 'idle',
            progress: 0,
          },
        });
        return id;
      });
      dispatch({ type: 'CREATE_PARALLEL_GROUP', payload: { name, threadIds } });
      return threadIds;
    },
    [state.defaultModel]
  );

  const getParallelGroup = useCallback(
    (id: string) => state.parallelGroups[id],
    [state.parallelGroups]
  );

  // Getters
  const getThread = useCallback((id: string) => state.threads[id], [state.threads]);

  const getActiveThreads = useCallback(
    () => state.activeThreadIds.map((id) => state.threads[id]).filter(Boolean),
    [state.activeThreadIds, state.threads]
  );

  const getCompletedThreads = useCallback(
    () => Object.values(state.threads).filter((t) => t.status === 'completed'),
    [state.threads]
  );

  const getThreadsByType = useCallback(
    (type: ThreadType) => Object.values(state.threads).filter((t) => t.type === type),
    [state.threads]
  );

  // Stats
  const stats = useMemo(() => {
    const threads = Object.values(state.threads);
    const completed = threads.filter((t) => t.status === 'completed');
    const efficiencies = completed.map((t) => {
      if (!t.metrics.duration) return 0;
      const minutes = t.metrics.duration / 60000;
      return t.metrics.toolCalls / Math.max(minutes, 0.1);
    });

    return {
      totalThreads: threads.length,
      activeThreads: state.activeThreadIds.length,
      completedThreads: completed.length,
      totalToolCalls: state.totalToolCalls,
      totalCost: state.totalCost,
      avgEfficiency:
        efficiencies.length > 0
          ? efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length
          : 0,
    };
  }, [state.threads, state.activeThreadIds, state.totalToolCalls, state.totalCost]);

  const value: ThreadOrchestratorContextValue = {
    state,
    createThread,
    startThread,
    pauseThread,
    completeThread,
    failThread,
    deleteThread,
    updateThreadProgress,
    incrementMetrics,
    createParallelGroup,
    getParallelGroup,
    getThread,
    getActiveThreads,
    getCompletedThreads,
    getThreadsByType,
    stats,
  };

  return (
    <ThreadOrchestratorContext.Provider value={value}>
      {children}
    </ThreadOrchestratorContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useThreadOrchestrator() {
  const context = useContext(ThreadOrchestratorContext);
  if (!context) {
    throw new Error('useThreadOrchestrator must be used within ThreadOrchestratorProvider');
  }
  return context;
}

export default ThreadOrchestratorContext;
