'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from './types';
import { SAMPLE_TASKS, DATA_VERSION } from './seed-data';

const STORAGE_KEY = 'kanban-tasks';
const VERSION_KEY = 'kanban-data-version';

function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useKanban() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load tasks from localStorage on mount (auto-sync when version changes)
  useEffect(() => {
    setMounted(true);
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);

    // Auto-reset if version changed (new data available)
    if (storedVersion !== DATA_VERSION) {
      setTasks(SAMPLE_TASKS);
      localStorage.setItem(VERSION_KEY, DATA_VERSION);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_TASKS));
      return;
    }

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTasks(parsed);
      } catch {
        setTasks(SAMPLE_TASKS);
      }
    } else {
      setTasks(SAMPLE_TASKS);
    }
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      )
    );
  }, []);

  const reorderTasks = useCallback((taskId: string, newStatus: TaskStatus, targetIndex: number) => {
    setTasks(prev => {
      const taskToMove = prev.find(t => t.id === taskId);
      if (!taskToMove) return prev;

      // Remove task from current position
      const withoutTask = prev.filter(t => t.id !== taskId);

      // Get tasks in the target column
      const tasksInColumn = withoutTask.filter(t => t.status === newStatus);
      const tasksOutsideColumn = withoutTask.filter(t => t.status !== newStatus);

      // Insert at target position
      const updatedTask = { ...taskToMove, status: newStatus, updatedAt: new Date().toISOString() };
      tasksInColumn.splice(targetIndex, 0, updatedTask);

      return [...tasksOutsideColumn, ...tasksInColumn];
    });
  }, []);

  const getTasksByStatus = useCallback((status: TaskStatus): Task[] => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const resetToSample = useCallback(() => {
    setTasks(SAMPLE_TASKS);
    localStorage.setItem(VERSION_KEY, DATA_VERSION);
  }, []);

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
