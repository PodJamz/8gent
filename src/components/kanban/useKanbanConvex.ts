'use client';

import { useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import { Task, TaskStatus, Priority } from './types';
import { SAMPLE_TASKS } from './seed-data';

// Type for the data returned from Convex getTasks query
interface ConvexTaskData {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

/**
 * Convex-backed kanban hook
 * Provides the same interface as useKanban but uses Convex for persistence
 */
export function useKanbanConvex() {
  // Convex queries - these automatically subscribe and update reactively
  // useQuery returns undefined while loading, then the data
  // This query runs automatically when the component mounts
  const tasksData = useQuery(api.kanban.getTasks);
  const seedStatus = useQuery(api.kanban.isSeeded);

  // Convex mutations
  const addTaskMutation = useMutation(api.kanban.addTask);
  const updateTaskMutation = useMutation(api.kanban.updateTask);
  const deleteTaskMutation = useMutation(api.kanban.deleteTask);
  const moveTaskMutation = useMutation(api.kanban.moveTask);
  const seedTasksMutation = useMutation(api.kanban.seedTasks);

  // Transform Convex data to match Task interface
  // useQuery returns undefined while loading, then the data (or empty array)
  // Memoize to prevent infinite loops from array recreation
  const tasks: Task[] = useMemo(() => {
    if (!tasksData) return [];
    return tasksData.map((task: ConvexTaskData) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      tags: task.tags,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      dueDate: task.dueDate,
    }));
  }, [tasksData]);

  // Loading state: mounted when query has resolved (even if empty array)
  // useQuery automatically subscribes and loads data when component mounts
  // tasksData is undefined while loading, then becomes the data (or empty array)
  // The query runs automatically and reactively updates when data changes
  const mounted = tasksData !== undefined;

  // Manual seed only - no auto-seeding to prevent loops
  // Use resetToSample() to seed the database

  // Add task
  const addTask = useCallback(
    async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = await addTaskMutation({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        tags: task.tags,
        dueDate: task.dueDate,
      });
      return {
        ...task,
        id: result.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Task;
    },
    [addTaskMutation]
  );

  // Update task
  const updateTask = useCallback(
    async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
      await updateTaskMutation({
        taskId: id,
        title: updates.title,
        description: updates.description,
        priority: updates.priority,
        status: updates.status,
        tags: updates.tags,
        dueDate: updates.dueDate,
      });
    },
    [updateTaskMutation]
  );

  // Delete task
  const deleteTask = useCallback(
    async (id: string) => {
      await deleteTaskMutation({ taskId: id });
    },
    [deleteTaskMutation]
  );

  // Move task to different status
  const moveTask = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      await moveTaskMutation({ taskId, newStatus });
    },
    [moveTaskMutation]
  );

  // Reorder tasks (basic implementation - just moves to new status)
  const reorderTasks = useCallback(
    async (taskId: string, newStatus: TaskStatus, _targetIndex: number) => {
      await moveTaskMutation({ taskId, newStatus });
    },
    [moveTaskMutation]
  );

  // Get tasks by status
  const getTasksByStatus = useCallback(
    (status: TaskStatus): Task[] => {
      return tasks.filter((task) => task.status === status);
    },
    [tasks]
  );

  // Reset to sample data
  const resetToSample = useCallback(async () => {
    await seedTasksMutation({
      tasks: SAMPLE_TASKS.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        tags: task.tags,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        dueDate: task.dueDate,
      })),
      clearExisting: true,
    });
  }, [seedTasksMutation]);

  return {
    tasks,
    mounted,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    getTasksByStatus,
    resetToSample,
  };
}
