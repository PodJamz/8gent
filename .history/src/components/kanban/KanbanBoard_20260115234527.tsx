'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RotateCcw, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Task, TaskStatus, COLUMNS } from './types';
import { useKanbanConvex } from './useKanbanConvex';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { Dialog } from '@/components/superdesign/overlay/Dialog';
import { cn } from '@/lib/utils';

export function KanbanBoard() {
  const {
    tasks,
    mounted,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
    resetToSample,
  } = useKanbanConvex();


  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  // Mobile: track which column is active
  const [mobileColumnIndex, setMobileColumnIndex] = useState(1); // Start on 'todo'
  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDraggingTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback((status: TaskStatus) => {
    setDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, status: TaskStatus) => {
      e.preventDefault();
      if (draggingTask) {
        moveTask(draggingTask.id, status);
      }
      setDraggingTask(null);
      setDragOverColumn(null);
    },
    [draggingTask, moveTask]
  );

  const handleDragEnd = useCallback(() => {
    setDraggingTask(null);
    setDragOverColumn(null);
  }, []);

  // Task handlers
  const handleAddTask = useCallback((status: TaskStatus) => {
    setEditingTask(null);
    setNewTaskStatus(status);
    setIsModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setNewTaskStatus(task.status);
    setIsModalOpen(true);
  }, []);

  const handleSaveTask = useCallback(
    (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (editingTask) {
        updateTask(editingTask.id, taskData);
      } else {
        addTask(taskData);
      }
    },
    [editingTask, addTask, updateTask]
  );

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      setTaskToDelete(taskId);
      setDeleteDialogOpen(true);
    },
    []
  );

  const confirmDelete = useCallback(() => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
    setDeleteDialogOpen(false);
  }, [taskToDelete, deleteTask]);

  const cancelDelete = useCallback(() => {
    setTaskToDelete(null);
    setDeleteDialogOpen(false);
  }, []);

  // Filter tasks
  const getFilteredTasks = useCallback(
    (status: TaskStatus) => {
      let filtered = getTasksByStatus(status);

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (task) =>
            task.title.toLowerCase().includes(query) ||
            task.description?.toLowerCase().includes(query) ||
            task.tags?.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      if (filterPriority !== 'all') {
        filtered = filtered.filter((task) => task.priority === filterPriority);
      }

      return filtered;
    },
    [getTasksByStatus, searchQuery, filterPriority]
  );

  // Stats
  const stats = {
    total: tasks.length,
    backlog: getTasksByStatus('backlog').length,
    todo: getTasksByStatus('todo').length,
    inProgress: getTasksByStatus('in-progress').length,
    review: getTasksByStatus('review').length,
    done: getTasksByStatus('done').length,
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-[hsl(var(--theme-muted-foreground))]">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" onDragEnd={handleDragEnd}>
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title and Stats */}
          <div>
            <h1
              className="text-2xl font-bold text-[hsl(var(--theme-foreground))]"
              style={{ fontFamily: 'var(--theme-font-heading)' }}
            >
              Project Board
            </h1>
            <p className="text-sm text-[hsl(var(--theme-muted-foreground))] mt-1">
              {stats.total} tasks · {stats.done} completed
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAddTask('todo')}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                'bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]',
                'hover:bg-[hsl(var(--theme-primary)/0.9)] transition-colors',
                'shadow-sm'
              )}
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
            <button
              onClick={resetToSample}
              title="Reset to sample data"
              className={cn(
                'p-2 rounded-lg text-sm',
                'bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))]',
                'hover:bg-[hsl(var(--theme-muted)/0.8)] transition-colors'
              )}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--theme-muted-foreground))]" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-2 rounded-lg text-sm',
                'bg-[hsl(var(--theme-card))] border border-[hsl(var(--theme-border))]',
                'text-[hsl(var(--theme-foreground))] placeholder:text-[hsl(var(--theme-muted-foreground))]',
                'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)] focus:border-[hsl(var(--theme-primary))]',
                'transition-colors'
              )}
            />
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--theme-muted-foreground))]" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className={cn(
                'pl-10 pr-8 py-2 rounded-lg text-sm appearance-none cursor-pointer',
                'bg-[hsl(var(--theme-card))] border border-[hsl(var(--theme-border))]',
                'text-[hsl(var(--theme-foreground))]',
                'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)] focus:border-[hsl(var(--theme-primary))]',
                'transition-colors'
              )}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Column Selector */}
      <div className="sm:hidden flex items-center justify-between mb-4 px-1">
        <button
          onClick={() => setMobileColumnIndex(Math.max(0, mobileColumnIndex - 1))}
          disabled={mobileColumnIndex === 0}
          className={cn(
            'p-2 rounded-lg transition-colors',
            mobileColumnIndex === 0
              ? 'text-[hsl(var(--theme-muted-foreground)/0.3)]'
              : 'text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))]'
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {COLUMNS.map((column, index) => (
            <button
              key={column.id}
              onClick={() => setMobileColumnIndex(index)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                index === mobileColumnIndex
                  ? 'bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]'
                  : 'text-[hsl(var(--theme-muted-foreground))]'
              )}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: column.color }}
              />
              <span className="hidden xs:inline">{column.title}</span>
              <span className="text-[10px] opacity-70">
                {getFilteredTasks(column.id).length}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setMobileColumnIndex(Math.min(COLUMNS.length - 1, mobileColumnIndex + 1))}
          disabled={mobileColumnIndex === COLUMNS.length - 1}
          className={cn(
            'p-2 rounded-lg transition-colors',
            mobileColumnIndex === COLUMNS.length - 1
              ? 'text-[hsl(var(--theme-muted-foreground)/0.3)]'
              : 'text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))]'
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile: Single Column View */}
      <div className="sm:hidden flex-1 overflow-y-auto pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={mobileColumnIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onDragEnter={() => handleDragEnter(COLUMNS[mobileColumnIndex].id)}
            onDragLeave={handleDragLeave}
          >
            <KanbanColumn
              column={COLUMNS[mobileColumnIndex]}
              tasks={getFilteredTasks(COLUMNS[mobileColumnIndex].id)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              isDragOver={dragOverColumn === COLUMNS[mobileColumnIndex].id}
              draggingTask={draggingTask}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop: Horizontal Scroll View */}
      <div className="hidden sm:block flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <motion.div
          className="flex gap-4 h-full min-w-max"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {COLUMNS.map((column) => (
            <div
              key={column.id}
              onDragEnter={() => handleDragEnter(column.id)}
              onDragLeave={handleDragLeave}
            >
              <KanbanColumn
                column={column}
                tasks={getFilteredTasks(column.id)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                isDragOver={dragOverColumn === column.id}
                draggingTask={draggingTask}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
        initialStatus={newTaskStatus}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        variant="error"
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
