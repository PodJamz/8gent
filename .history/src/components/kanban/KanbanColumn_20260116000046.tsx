'use client';

import { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Task, Column, TaskStatus } from './types';
import { KanbanCard } from './KanbanCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  isDragOver: boolean;
  draggingTask: Task | null;
}

export const KanbanColumn = memo(function KanbanColumn({
  column,
  tasks,
  onDragStart,
  onDragOver,
  onDrop,
  onAddTask,
  onEditTask,
  onDeleteTask,
  isDragOver,
  draggingTask,
}: KanbanColumnProps) {
  const handleAddTask = useCallback(() => {
    onAddTask(column.id);
  }, [column.id, onAddTask]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    onDrop(e, column.id);
  }, [column.id, onDrop]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full sm:w-[300px] sm:min-w-[300px] max-h-full"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h3
            className="text-sm font-semibold text-[hsl(var(--theme-foreground))]"
            style={{ fontFamily: 'var(--theme-font-heading)' }}
          >
            {column.title}
          </h3>
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium rounded-full bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))]">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={handleAddTask}
          className="p-1.5 rounded-md hover:bg-[hsl(var(--theme-muted))] transition-colors"
          title={`Add task to ${column.title}`}
        >
          <Plus className="w-4 h-4 text-[hsl(var(--theme-muted-foreground))]" />
        </button>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDrop={handleDrop}
        className={cn(
          'flex-1 overflow-y-auto rounded-xl p-2 transition-all duration-200',
          'bg-[hsl(var(--theme-muted)/0.3)] border-2 border-dashed',
          isDragOver
            ? 'border-[hsl(var(--theme-primary))] bg-[hsl(var(--theme-primary)/0.05)]'
            : 'border-transparent'
        )}
      >
        <div className="space-y-2 min-h-[100px]">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                onDragStart={onDragStart}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                isDragging={draggingTask?.id === task.id}
              />
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {tasks.length === 0 && !isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <p className="text-xs text-[hsl(var(--theme-muted-foreground))]">
                No tasks yet
              </p>
              <button
                onClick={handleAddTask}
                className="mt-2 text-xs text-[hsl(var(--theme-primary))] hover:underline"
              >
                Add a task
              </button>
            </motion.div>
          )}

          {/* Drop Indicator */}
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-16 rounded-lg border-2 border-dashed border-[hsl(var(--theme-primary))] bg-[hsl(var(--theme-primary)/0.1)] flex items-center justify-center"
            >
              <p className="text-xs text-[hsl(var(--theme-primary))] font-medium">
                Drop here
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
});
