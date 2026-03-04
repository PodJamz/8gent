'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task, Priority, TaskStatus } from '@/components/kanban/types';

interface ProjectSearchProps {
  tasks: Task[];
  onFilteredTasksChange: (tasks: Task[]) => void;
  placeholder?: string;
}

interface ParsedQuery {
  text: string;
  status?: TaskStatus;
  priority?: Priority;
  tags?: string[];
}

const QUERY_HINTS = [
  { syntax: 'status:done', description: 'Filter by status' },
  { syntax: 'priority:high', description: 'Filter by priority' },
  { syntax: 'tag:ai', description: 'Filter by tag' },
];

const STATUS_OPTIONS: TaskStatus[] = ['backlog', 'todo', 'in-progress', 'review', 'done'];
const PRIORITY_OPTIONS: Priority[] = ['low', 'medium', 'high', 'urgent'];

export function ProjectSearch({
  tasks,
  onFilteredTasksChange,
  placeholder = 'Search projects...',
}: ProjectSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Parse query string into structured filter
  const parseQuery = useCallback((queryString: string): ParsedQuery => {
    const result: ParsedQuery = { text: '' };
    const parts = queryString.toLowerCase().split(/\s+/);
    const textParts: string[] = [];

    for (const part of parts) {
      if (part.startsWith('status:')) {
        const status = part.replace('status:', '') as TaskStatus;
        if (STATUS_OPTIONS.includes(status)) {
          result.status = status;
        }
      } else if (part.startsWith('priority:')) {
        const priority = part.replace('priority:', '') as Priority;
        if (PRIORITY_OPTIONS.includes(priority)) {
          result.priority = priority;
        }
      } else if (part.startsWith('tag:')) {
        const tag = part.replace('tag:', '');
        if (tag) {
          result.tags = result.tags || [];
          result.tags.push(tag);
        }
      } else if (part) {
        textParts.push(part);
      }
    }

    result.text = textParts.join(' ');
    return result;
  }, []);

  // Filter tasks based on parsed query
  const filteredTasks = useMemo(() => {
    if (!query.trim()) {
      return tasks;
    }

    const parsed = parseQuery(query);

    return tasks.filter((task) => {
      // Text search (title and description)
      if (parsed.text) {
        const searchText = `${task.title} ${task.description || ''}`.toLowerCase();
        if (!searchText.includes(parsed.text)) {
          return false;
        }
      }

      // Status filter
      if (parsed.status && task.status !== parsed.status) {
        return false;
      }

      // Priority filter
      if (parsed.priority && task.priority !== parsed.priority) {
        return false;
      }

      // Tags filter
      if (parsed.tags && parsed.tags.length > 0) {
        const taskTags = task.tags?.map((t) => t.toLowerCase()) || [];
        if (!parsed.tags.some((tag) => taskTags.includes(tag))) {
          return false;
        }
      }

      return true;
    });
  }, [query, tasks, parseQuery]);

  // Update parent when filtered tasks change
  useMemo(() => {
    onFilteredTasksChange(filteredTasks);
  }, [filteredTasks, onFilteredTasksChange]);

  const handleClear = () => {
    setQuery('');
    onFilteredTasksChange(tasks);
  };

  const handleQuickFilter = (filterString: string) => {
    setQuery((prev) => {
      const newQuery = prev ? `${prev} ${filterString}` : filterString;
      return newQuery;
    });
  };

  const parsedQuery = parseQuery(query);
  const hasActiveFilters = parsedQuery.status || parsedQuery.priority || (parsedQuery.tags && parsedQuery.tags.length > 0);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div
        className={cn(
          'relative flex items-center gap-2 rounded-xl overflow-hidden',
          'bg-[hsl(var(--theme-card)/0.6)] backdrop-blur-xl',
          'border transition-all duration-300',
          isFocused
            ? 'border-[hsl(var(--theme-primary))] shadow-lg shadow-[hsl(var(--theme-primary)/0.1)]'
            : 'border-[hsl(var(--theme-border)/0.5)]'
        )}
      >
        <div className="flex items-center gap-2 pl-4">
          <Search className="w-4 h-4 text-[hsl(var(--theme-muted-foreground))]" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className={cn(
            'flex-1 py-3 pr-4 bg-transparent outline-none',
            'text-[hsl(var(--theme-foreground))]',
            'placeholder:text-[hsl(var(--theme-muted-foreground))]'
          )}
        />

        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1 pr-2">
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-[hsl(var(--theme-primary)/0.1)] text-xs text-[hsl(var(--theme-primary))]">
              <Filter className="w-3 h-3" />
              {[
                parsedQuery.status,
                parsedQuery.priority,
                ...(parsedQuery.tags || []),
              ].filter(Boolean).length}
            </span>
          </div>
        )}

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="p-2 mr-2 rounded-lg hover:bg-[hsl(var(--theme-muted))] transition-colors"
          >
            <X className="w-4 h-4 text-[hsl(var(--theme-muted-foreground))]" />
          </button>
        )}

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'p-2 mr-2 rounded-lg transition-colors',
            showFilters
              ? 'bg-[hsl(var(--theme-primary)/0.1)] text-[hsl(var(--theme-primary))]'
              : 'hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))]'
          )}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Results Count */}
      {query && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-[hsl(var(--theme-muted-foreground))]"
        >
          Found {filteredTasks.length} of {tasks.length} items
        </motion.div>
      )}

      {/* Query Hints Dropdown */}
      <AnimatePresence>
        {isFocused && !query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'absolute top-full left-0 right-0 mt-2 p-3 rounded-xl z-50',
              'bg-[hsl(var(--theme-card))] backdrop-blur-xl',
              'border border-[hsl(var(--theme-border))]',
              'shadow-lg'
            )}
          >
            <div className="text-xs text-[hsl(var(--theme-muted-foreground))] mb-2 font-medium">
              Search syntax
            </div>
            <div className="space-y-1">
              {QUERY_HINTS.map((hint) => (
                <button
                  key={hint.syntax}
                  onClick={() => handleQuickFilter(hint.syntax)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg',
                    'hover:bg-[hsl(var(--theme-muted))] transition-colors text-left'
                  )}
                >
                  <code className="text-sm text-[hsl(var(--theme-primary))] font-mono">
                    {hint.syntax}
                  </code>
                  <span className="text-xs text-[hsl(var(--theme-muted-foreground))]">
                    {hint.description}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              'mt-3 p-4 rounded-xl overflow-hidden',
              'bg-[hsl(var(--theme-card)/0.6)] backdrop-blur-xl',
              'border border-[hsl(var(--theme-border)/0.5)]'
            )}
          >
            {/* Status Filters */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[hsl(var(--theme-muted-foreground))]" />
                <span className="text-sm font-medium text-[hsl(var(--theme-foreground))]">Status</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleQuickFilter(`status:${status}`)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                      parsedQuery.status === status
                        ? 'bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]'
                        : 'bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:bg-[hsl(var(--theme-muted)/0.8)]'
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Filters */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-[hsl(var(--theme-muted-foreground))]" />
                <span className="text-sm font-medium text-[hsl(var(--theme-foreground))]">Priority</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRIORITY_OPTIONS.map((priority) => (
                  <button
                    key={priority}
                    onClick={() => handleQuickFilter(`priority:${priority}`)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                      parsedQuery.priority === priority
                        ? 'bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]'
                        : 'bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:bg-[hsl(var(--theme-muted)/0.8)]'
                    )}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Common Tags */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-[hsl(var(--theme-muted-foreground))]" />
                <span className="text-sm font-medium text-[hsl(var(--theme-foreground))]">Common Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['P1', 'ai', 'ui', 'backend', 'polish'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleQuickFilter(`tag:${tag}`)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                      parsedQuery.tags?.includes(tag.toLowerCase())
                        ? 'bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]'
                        : 'bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:bg-[hsl(var(--theme-muted)/0.8)]'
                    )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
