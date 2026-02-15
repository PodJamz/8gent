'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import type { SearchQuery, SearchResult, RalphIteration, RalphStopReason } from '@/lib/humans/types';

// ============================================================================
// Types
// ============================================================================

export interface DurableRalphState {
  isRunning: boolean;
  jobId: string | null;
  progress: number;
  progressMessage: string;
  currentIteration: number;
  maxIterations: number;
  iterations: RalphIteration[];
  results: SearchResult[];
  strongMatches: number;
  stopReason: RalphStopReason | null;
  error: string | null;
}

export interface UseDurableRalphOptions {
  sessionId: string;
  maxIterations?: number;
  targetStrongMatches?: number;
  onComplete?: (results: SearchResult[]) => void;
  onProgress?: (state: DurableRalphState) => void;
}

export interface UseDurableRalphReturn {
  state: DurableRalphState;
  startRalphSearch: (query: SearchQuery, initialResults?: SearchResult[]) => Promise<string>;
  cancelSearch: () => Promise<void>;
  reset: () => void;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: DurableRalphState = {
  isRunning: false,
  jobId: null,
  progress: 0,
  progressMessage: '',
  currentIteration: 0,
  maxIterations: 4,
  iterations: [],
  results: [],
  strongMatches: 0,
  stopReason: null,
  error: null,
};

// ============================================================================
// Hook Implementation
// ============================================================================

export function useDurableRalph(options: UseDurableRalphOptions): UseDurableRalphReturn {
  const {
    sessionId,
    maxIterations = 4,
    targetStrongMatches = 5,
    onComplete,
    onProgress,
  } = options;

  const [state, setState] = useState<DurableRalphState>({
    ...initialState,
    maxIterations,
  });
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  // Track completion to avoid double callbacks
  const completedRef = useRef<string | null>(null);

  // Convex mutations
  const createJob = useMutation(api.jobs.createJob);
  const cancelJob = useMutation(api.jobs.cancelJob);

  // Subscribe to job updates when we have an active job
  const job = useQuery(
    api.jobs.getJob,
    activeJobId ? { jobId: activeJobId } : 'skip'
  );

  // Process job updates
  useEffect(() => {
    if (!job || !activeJobId) return;

    // Update state from job
    const newState: DurableRalphState = {
      isRunning: job.status === 'queued' || job.status === 'running',
      jobId: job.jobId,
      progress: job.progress || 0,
      progressMessage: job.progressMessage || '',
      currentIteration: 0,
      maxIterations,
      iterations: [],
      results: [],
      strongMatches: 0,
      stopReason: null,
      error: job.lastError || null,
    };

    // Extract data from job output if available
    if (job.output) {
      const output = job.output as {
        results?: SearchResult[];
        iterations?: RalphIteration[];
        strongMatches?: number;
        stopReason?: RalphStopReason;
      };

      newState.results = output.results || [];
      newState.iterations = output.iterations || [];
      newState.strongMatches = output.strongMatches || 0;
      newState.stopReason = output.stopReason || null;
      newState.currentIteration = newState.iterations.length;
    }

    setState(newState);
    onProgress?.(newState);

    // Handle completion
    if (
      (job.status === 'succeeded' || job.status === 'failed' || job.status === 'cancelled') &&
      completedRef.current !== job.jobId
    ) {
      completedRef.current = job.jobId;

      if (job.status === 'succeeded' && newState.results.length > 0) {
        onComplete?.(newState.results);
      }

      // Clear active job after a delay to allow UI to update
      setTimeout(() => {
        setActiveJobId(null);
      }, 1000);
    }
  }, [job, activeJobId, maxIterations, onComplete, onProgress]);

  // Start a new Ralph search
  const startRalphSearch = useCallback(
    async (query: SearchQuery, initialResults: SearchResult[] = []): Promise<string> => {
      // Reset state
      setState({
        ...initialState,
        maxIterations,
        isRunning: true,
        progressMessage: 'Creating job...',
      });
      completedRef.current = null;

      // Generate idempotency key based on query
      const idempotencyKey = `ralph_${sessionId}_${JSON.stringify(query)}_${Date.now()}`;

      // Create the job
      const jobId = await createJob({
        jobType: 'ralph_search',
        appId: 'humans',
        sessionId,
        idempotencyKey,
        input: JSON.stringify({
          query,
          maxIterations,
          targetStrongMatches,
          initialResults,
        }),
        maxAttempts: 3,
      });

      setActiveJobId(jobId);

      // Schedule job processing via API route (since we can't call actions directly from client)
      try {
        await fetch('/api/jobs/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId, jobType: 'ralph_search' }),
        });
      } catch (err) {
        console.error('Failed to trigger job processing:', err);
        // Job will still be picked up by scheduled function if API fails
      }

      return jobId;
    },
    [sessionId, maxIterations, targetStrongMatches, createJob]
  );

  // Cancel the current search
  const cancelSearch = useCallback(async () => {
    if (activeJobId) {
      try {
        await cancelJob({ jobId: activeJobId });
      } catch (err) {
        console.error('Failed to cancel job:', err);
      }
    }
  }, [activeJobId, cancelJob]);

  // Reset state
  const reset = useCallback(() => {
    setActiveJobId(null);
    completedRef.current = null;
    setState({
      ...initialState,
      maxIterations,
    });
  }, [maxIterations]);

  return {
    state,
    startRalphSearch,
    cancelSearch,
    reset,
  };
}

export default useDurableRalph;
