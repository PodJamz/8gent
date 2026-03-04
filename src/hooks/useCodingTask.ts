/**
 * useCodingTask - Track active coding task status
 *
 * Manages the current coding task state, messages, and status updates.
 * Integrates with the sandbox for code execution.
 *
 * NOTE: Currently stubbed until Convex workingContext is deployed to production.
 * The real implementation uses api.workingContext mutations/queries.
 */

'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Id } from '../../convex/_generated/dataModel';

export type CodingTaskStatus =
  | 'pending'
  | 'running'
  | 'waiting_input'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface CodingTaskMessage {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: number;
  toolCalls?: unknown[];
  toolResults?: unknown[];
}

export interface CodingTask {
  _id: Id<'codingTasks'>;
  title: string;
  description: string;
  status: CodingTaskStatus;
  repositoryUrl?: string;
  branch?: string;
  generatedBranch?: string;
  sandboxId?: string;
  previewUrl?: string;
  messages: CodingTaskMessage[];
  filesModified?: string[];
  commitSha?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UseCodingTaskResult {
  // Current task
  task: CodingTask | null;
  isLoading: boolean;

  // Task list
  activeTasks: CodingTask[];
  recentTasks: CodingTask[];

  // Status
  isRunning: boolean;
  isWaitingInput: boolean;
  hasActiveSandbox: boolean;

  // Actions
  createTask: (params: {
    title: string;
    description: string;
    projectId?: string;
    ticketId?: string;
    repositoryUrl?: string;
  }) => Promise<Id<'codingTasks'>>;

  updateStatus: (
    taskId: Id<'codingTasks'>,
    status: CodingTaskStatus,
    extras?: {
      sandboxId?: string;
      previewUrl?: string;
      filesModified?: string[];
      commitSha?: string;
    }
  ) => Promise<void>;

  addMessage: (
    taskId: Id<'codingTasks'>,
    message: Omit<CodingTaskMessage, 'timestamp'>
  ) => Promise<void>;

  // Convenience
  completeTask: (taskId: Id<'codingTasks'>, commitSha?: string) => Promise<void>;
  failTask: (taskId: Id<'codingTasks'>) => Promise<void>;
  cancelTask: (taskId: Id<'codingTasks'>) => Promise<void>;
}

/**
 * Stubbed implementation - tracks tasks in local state.
 * Replace with Convex queries once workingContext is deployed:
 *
 * ```ts
 * import { useQuery, useMutation } from '@/lib/openclaw/hooks';
 * import { api } from '@/lib/convex-shim';
 *
 * const taskData = useQuery(api.workingContext.getCodingTask, { taskId });
 * const createTaskMutation = useMutation(api.workingContext.createCodingTask);
 * ```
 */
export function useCodingTask(
  userId: string,
  activeTaskId?: Id<'codingTasks'>
): UseCodingTaskResult {
  // Local state for stubbed implementation
  const [tasks, setTasks] = useState<Map<string, CodingTask>>(new Map());

  const task = useMemo(() => {
    if (!activeTaskId) return null;
    return tasks.get(activeTaskId) || null;
  }, [activeTaskId, tasks]);

  const activeTasks = useMemo(() => {
    return Array.from(tasks.values()).filter(
      (t) => t.status === 'running' || t.status === 'waiting_input'
    );
  }, [tasks]);

  const recentTasks = useMemo(() => {
    return Array.from(tasks.values())
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 10);
  }, [tasks]);

  const isLoading = false;
  const isRunning = task?.status === 'running';
  const isWaitingInput = task?.status === 'waiting_input';
  const hasActiveSandbox = Boolean(task?.sandboxId);

  const createTask = useCallback(
    async (params: {
      title: string;
      description: string;
      projectId?: string;
      ticketId?: string;
      repositoryUrl?: string;
    }): Promise<Id<'codingTasks'>> => {
      const id = `task_${Date.now()}` as Id<'codingTasks'>;
      const newTask: CodingTask = {
        _id: id,
        title: params.title,
        description: params.description,
        status: 'pending',
        repositoryUrl: params.repositoryUrl,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setTasks((prev) => new Map(prev).set(id, newTask));
      console.log('[useCodingTask] Created task (stubbed):', id, params.title);
      return id;
    },
    []
  );

  const updateStatus = useCallback(
    async (
      taskId: Id<'codingTasks'>,
      status: CodingTaskStatus,
      extras?: {
        sandboxId?: string;
        previewUrl?: string;
        filesModified?: string[];
        commitSha?: string;
      }
    ) => {
      setTasks((prev) => {
        const map = new Map(prev);
        const existing = map.get(taskId);
        if (existing) {
          map.set(taskId, {
            ...existing,
            status,
            ...extras,
            updatedAt: Date.now(),
          });
        }
        return map;
      });
      console.log('[useCodingTask] Updated status (stubbed):', taskId, status);
    },
    []
  );

  const addMessage = useCallback(
    async (
      taskId: Id<'codingTasks'>,
      message: Omit<CodingTaskMessage, 'timestamp'>
    ) => {
      setTasks((prev) => {
        const map = new Map(prev);
        const existing = map.get(taskId);
        if (existing) {
          map.set(taskId, {
            ...existing,
            messages: [
              ...existing.messages,
              { ...message, timestamp: Date.now() },
            ],
            updatedAt: Date.now(),
          });
        }
        return map;
      });
      console.log('[useCodingTask] Added message (stubbed):', taskId, message.role);
    },
    []
  );

  const completeTask = useCallback(
    async (taskId: Id<'codingTasks'>, commitSha?: string) => {
      await updateStatus(taskId, 'completed', { commitSha });
    },
    [updateStatus]
  );

  const failTask = useCallback(
    async (taskId: Id<'codingTasks'>) => {
      await updateStatus(taskId, 'failed');
    },
    [updateStatus]
  );

  const cancelTask = useCallback(
    async (taskId: Id<'codingTasks'>) => {
      await updateStatus(taskId, 'cancelled');
    },
    [updateStatus]
  );

  return {
    task,
    isLoading,
    activeTasks,
    recentTasks,
    isRunning,
    isWaitingInput,
    hasActiveSandbox,
    createTask,
    updateStatus,
    addMessage,
    completeTask,
    failTask,
    cancelTask,
  };
}
