'use client';

import { useState, useCallback, useRef } from 'react';
import type {
  RalphModeConfig,
  RalphLoopStatus,
} from '@/lib/ralph';
import {
  DEFAULT_RALPH_CONFIG,
  createInitialRalphStatus,
} from '@/lib/ralph';

/**
 * Hook for running Ralph Loop in the browser
 *
 * This provides a React-friendly interface to the ralph-loop-agent SDK.
 * For durable execution that survives browser close, use the job system instead.
 *
 * @example
 * ```tsx
 * const { status, start, stop, reset } = useRalphLoop({
 *   maxIterations: 10,
 *   onIterationStart: ({ iteration }) => console.log(`Starting iteration ${iteration}`),
 * });
 *
 * // Start the loop
 * await start('Refactor the authentication system');
 * ```
 */
export function useRalphLoop(config: RalphModeConfig = {}) {
  const [status, setStatus] = useState<RalphLoopStatus>(() =>
    createInitialRalphStatus(config.maxIterations || DEFAULT_RALPH_CONFIG.maxIterations)
  );

  const abortControllerRef = useRef<AbortController | null>(null);
  const isRunningRef = useRef(false);

  /**
   * Update status with partial values
   */
  const updateStatus = useCallback((updates: Partial<RalphLoopStatus>) => {
    setStatus((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Start the Ralph loop with a prompt
   */
  const start = useCallback(
    async (prompt: string): Promise<void> => {
      if (isRunningRef.current) {
        console.warn('Ralph loop already running');
        return;
      }

      isRunningRef.current = true;
      abortControllerRef.current = new AbortController();

      const mergedConfig = { ...DEFAULT_RALPH_CONFIG, ...config };

      updateStatus({
        isRunning: true,
        iteration: 0,
        completionReason: 'pending',
        lastMessage: 'Starting Ralph loop...',
      });

      try {
        // Dynamic import to avoid SSR issues
        const { RalphLoopAgent } = await import('ralph-loop-agent');
        const { buildStopConditions } = await import('@/lib/ralph');

        // Note: This requires an AI SDK model - for now we'll simulate
        // In production, you'd configure this with your model provider
        const agent = new RalphLoopAgent({
          model: 'anthropic/claude-sonnet-4' as any, // Would need proper AI SDK model
          instructions: mergedConfig.instructions,
          stopWhen: buildStopConditions(mergedConfig),
          onIterationStart: async ({ iteration }) => {
            updateStatus({
              iteration,
              lastMessage: `Iteration ${iteration}: Starting...`,
            });
            await mergedConfig.onIterationStart?.({ iteration });
          },
          onIterationEnd: async ({ iteration, duration }) => {
            updateStatus({
              lastMessage: `Iteration ${iteration}: Completed in ${duration}ms`,
            });
            await mergedConfig.onIterationEnd?.({ iteration, duration });
          },
          verifyCompletion: async ({ result, iteration }) => {
            // Default verification - check if the agent says it's done
            const text = result.text.toLowerCase();
            const isDone =
              text.includes('task complete') ||
              text.includes('all tests pass') ||
              text.includes('successfully completed');

            return {
              complete: isDone,
              reason: isDone
                ? 'Task verified as complete'
                : 'Continuing to next iteration',
            };
          },
        });

        const result = await agent.loop({
          prompt,
          abortSignal: abortControllerRef.current.signal,
        });

        updateStatus({
          isRunning: false,
          completionReason: result.completionReason,
          lastMessage: result.reason || `Completed: ${result.completionReason}`,
          totalTokens: result.totalUsage.totalTokens,
          iteration: result.iterations,
        });
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          updateStatus({
            isRunning: false,
            completionReason: 'aborted',
            lastMessage: 'Loop aborted by user',
          });
        } else {
          console.error('Ralph loop error:', error);
          updateStatus({
            isRunning: false,
            completionReason: 'aborted',
            lastMessage: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
        }
      } finally {
        isRunningRef.current = false;
        abortControllerRef.current = null;
      }
    },
    [config, updateStatus]
  );

  /**
   * Stop the running loop
   */
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      updateStatus({
        lastMessage: 'Stopping loop...',
      });
    }
  }, [updateStatus]);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    stop();
    setStatus(
      createInitialRalphStatus(config.maxIterations || DEFAULT_RALPH_CONFIG.maxIterations)
    );
  }, [stop, config.maxIterations]);

  return {
    status,
    start,
    stop,
    reset,
    isRunning: status.isRunning,
  };
}

export default useRalphLoop;
