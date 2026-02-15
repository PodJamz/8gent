/**
 * Kanban Board Type Definitions
 *
 * This file contains only type definitions and constants.
 * Task data is stored in Convex (see convex/kanban.ts).
 * Seed data for initial database population is in seed-data.ts.
 */

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

export interface Task {
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

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: 'backlog', title: 'Backlog', color: 'hsl(var(--theme-muted-foreground))' },
  { id: 'todo', title: 'To Do', color: 'hsl(var(--theme-primary))' },
  { id: 'in-progress', title: 'In Progress', color: 'hsl(var(--theme-accent))' },
  { id: 'review', title: 'Review', color: 'hsl(210 90% 55%)' },
  { id: 'done', title: 'Done', color: 'hsl(142 70% 45%)' },
];

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'hsl(var(--theme-muted-foreground))' },
  medium: { label: 'Medium', color: 'hsl(var(--theme-primary))' },
  high: { label: 'High', color: 'hsl(38 92% 50%)' },
  urgent: { label: 'Urgent', color: 'hsl(0 84% 60%)' },
};
