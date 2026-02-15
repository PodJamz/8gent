'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Task, TaskStatus, Priority, PRIORITY_CONFIG, COLUMNS } from './types';
import { cn } from '@/lib/utils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialTask?: Task | null;
  initialStatus?: TaskStatus;
}

export function TaskModal({ isOpen, onClose, onSave, initialTask, initialStatus = 'todo' }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
      setTags(initialTask.tags?.join(', ') || '');
      setDueDate(initialTask.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus(initialStatus);
      setTags('');
      setDueDate('');
    }
  }, [initialTask, initialStatus, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      tags: tags.trim() ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      dueDate: dueDate || undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
              style={{
                backgroundColor: 'hsl(var(--theme-card))',
                border: '1px solid hsl(var(--theme-border))',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--theme-border))]">
                <h2
                  className="text-lg font-semibold text-[hsl(var(--theme-foreground))]"
                  style={{ fontFamily: 'var(--theme-font-heading)' }}
                >
                  {initialTask ? 'Edit Task' : 'New Task'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[hsl(var(--theme-muted))] transition-colors"
                >
                  <X className="w-5 h-5 text-[hsl(var(--theme-muted-foreground))]" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--theme-foreground))] mb-1.5">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title..."
                    required
                    className={cn(
                      'w-full px-3 py-2 rounded-lg text-sm',
                      'bg-[hsl(var(--theme-background))] border border-[hsl(var(--theme-border))]',
                      'text-[hsl(var(--theme-foreground))] placeholder:text-[hsl(var(--theme-muted-foreground))]',
                      'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)] focus:border-[hsl(var(--theme-primary))]',
                      'transition-colors'
                    )}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--theme-foreground))] mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description..."
                    rows={3}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg text-sm resize-none',
                      'bg-[hsl(var(--theme-background))] border border-[hsl(var(--theme-border))]',
                      'text-[hsl(var(--theme-foreground))] placeholder:text-[hsl(var(--theme-muted-foreground))]',
                      'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)] focus:border-[hsl(var(--theme-primary))]',
                      'transition-colors'
                    )}
                  />
                </div>

                {/* Priority and Status Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-[hsl(var(--theme-foreground))] mb-1.5">
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                      className={cn(
                        'w-full px-3 py-2 rounded-lg text-sm appearance-none cursor-pointer',
                        'bg-[hsl(var(--theme-background))] border border-[hsl(var(--theme-border))]',
                        'text-[hsl(var(--theme-foreground))]',
                        'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)] focus:border-[hsl(var(--theme-primary))]',
                        'transition-colors'
                      )}
                    >
                      {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-[hsl(var(--theme-foreground))] mb-1.5">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as TaskStatus)}
                      className={cn(
                        'w-full px-3 py-2 rounded-lg text-sm appearance-none cursor-pointer',
                        'bg-[hsl(var(--theme-background))] border border-[hsl(var(--theme-border))]',
                        'text-[hsl(var(--theme-foreground))]',
                        'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)] focus:border-[hsl(var(--theme-primary))]',
                        'transition-colors'
                      )}
                    >
                      {COLUMNS.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--theme-foreground))] mb-1.5">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="design, frontend, bug (comma separated)"
                    className={cn(
                      'w-full px-3 py-2 rounded-lg text-sm',
                      'bg-[hsl(var(--theme-background))] border border-[hsl(var(--theme-border))]',
                      'text-[hsl(var(--theme-foreground))] placeholder:text-[hsl(var(--theme-muted-foreground))]',
                      'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)] focus:border-[hsl(var(--theme-primary))]',
                      'transition-colors'
                    )}
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--theme-foreground))] mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg text-sm',
                      'bg-[hsl(var(--theme-background))] border border-[hsl(var(--theme-border))]',
                      'text-[hsl(var(--theme-foreground))]',
                      'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)] focus:border-[hsl(var(--theme-primary))]',
                      'transition-colors'
                    )}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[hsl(var(--theme-border))]">
                  <button
                    type="button"
                    onClick={onClose}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium',
                      'bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-foreground))]',
                      'hover:bg-[hsl(var(--theme-muted)/0.8)] transition-colors'
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium',
                      'bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]',
                      'hover:bg-[hsl(var(--theme-primary)/0.9)] transition-colors'
                    )}
                  >
                    {initialTask ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
