'use client';

import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Calendar, Trash2, Edit3 } from 'lucide-react';
import { Task, PRIORITY_CONFIG } from './types';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onMove?: (task: Task, direction: 'left' | 'right') => void;
  isDragging?: boolean;
}

export const KanbanCard = memo(function KanbanCard({ task, onDragStart, onEdit, onDelete, onMove, isDragging }: KanbanCardProps) {
  const priorityConfig = PRIORITY_CONFIG[task.priority];

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Arrow for moving between columns
    if ((e.ctrlKey || e.metaKey) && onMove) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onMove(task, 'left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onMove(task, 'right');
      }
    }
    // Enter to edit
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onEdit(task);
    }
    // Delete key to remove
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      onDelete(task.id);
    }
  }, [task, onMove, onEdit, onDelete]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  }, [task, onEdit]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  }, [task.id, onDelete]);

  return (
    <motion.div
      layout
      layoutId={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0, scale: isDragging ? 1.02 : 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      draggable
      tabIndex={0}
      role="listitem"
      aria-label={`${task.title}, ${priorityConfig.label} priority${task.dueDate ? `, due ${formatDate(task.dueDate)}` : ''}`}
      onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, task)}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative rounded-lg p-3 cursor-grab active:cursor-grabbing',
        'bg-[hsl(var(--theme-card))] border border-[hsl(var(--theme-border))]',
        'hover:border-[hsl(var(--theme-primary)/0.5)] hover:shadow-md',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--theme-primary))] focus-visible:ring-offset-2',
        'transition-all duration-200',
        isDragging && 'shadow-lg ring-2 ring-[hsl(var(--theme-primary)/0.3)]'
      )}
    >
      {/* Drag Handle */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 transition-opacity" aria-hidden="true">
        <GripVertical className="w-4 h-4 text-[hsl(var(--theme-muted-foreground))]" />
      </div>

      {/* Priority Indicator */}
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-lg"
        style={{ backgroundColor: priorityConfig.color }}
      />

      {/* Content */}
      <div className="pl-4">
        {/* Header with title and actions */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-medium text-[hsl(var(--theme-foreground))] leading-tight line-clamp-2">
            {task.title}
          </h4>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEditClick}
              className="p-1 rounded hover:bg-[hsl(var(--theme-muted))] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--theme-primary))]"
              aria-label={`Edit ${task.title}`}
            >
              <Edit3 className="w-3.5 h-3.5 text-[hsl(var(--theme-muted-foreground))]" aria-hidden="true" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1 rounded hover:bg-[hsl(0_84%_60%/0.1)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(0_84%_60%)]"
              aria-label={`Delete ${task.title}`}
            >
              <Trash2 className="w-3.5 h-3.5 text-[hsl(0_84%_60%)]" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-[hsl(var(--theme-muted-foreground))] mb-2 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-[hsl(var(--theme-border)/0.5)]">
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: `${priorityConfig.color}20`,
              color: priorityConfig.color
            }}
          >
            {priorityConfig.label}
          </span>
          {task.dueDate && (
            <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--theme-muted-foreground))]">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              <span aria-label={`Due ${formatDate(task.dueDate)}`}>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});
