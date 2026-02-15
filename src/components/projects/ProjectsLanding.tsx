'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Map, Lightbulb, Sparkles } from 'lucide-react';
import { ProjectFolderCard } from './ProjectFolderCard';
import { ProjectSearch } from './ProjectSearch';
import { GitHubContributions } from '@/components/github';
import { Task } from '@/components/kanban/types';
import { useKanbanConvex } from '@/components/kanban/useKanbanConvex';
import { cn } from '@/lib/utils';

type ViewType = 'kanban' | 'roadmap' | 'suggest';

interface ProjectsLandingProps {
  onNavigateToView: (view: ViewType) => void;
}

interface FolderConfig {
  id: ViewType;
  title: string;
  description: string;
  icon: typeof FolderKanban;
  gradient: string;
  shortcutKey: string;
  filterFn: (tasks: Task[]) => Task[];
}

const FOLDER_CONFIGS: FolderConfig[] = [
  {
    id: 'kanban',
    title: 'Board',
    description: 'Drag and drop tasks across status columns',
    icon: FolderKanban,
    gradient: 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
    shortcutKey: '1',
    filterFn: (tasks) =>
      tasks.filter((t) => ['todo', 'in-progress', 'review'].includes(t.status)),
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    description: 'View project timeline and milestones',
    icon: Map,
    gradient: 'linear-gradient(135deg, hsl(142 70% 45%) 0%, hsl(160 60% 45%) 100%)',
    shortcutKey: '2',
    filterFn: (tasks) => tasks.filter((t) => t.status === 'done' || t.status === 'in-progress'),
  },
  {
    id: 'suggest',
    title: 'Ideas',
    description: 'Feature requests and future possibilities',
    icon: Lightbulb,
    gradient: 'linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(25 95% 53%) 100%)',
    shortcutKey: '3',
    filterFn: (tasks) => tasks.filter((t) => t.status === 'backlog'),
  },
];

export function ProjectsLanding({ onNavigateToView }: ProjectsLandingProps) {
  // Get tasks from Convex
  const { tasks: convexTasks, mounted } = useKanbanConvex();

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [activeHint, setActiveHint] = useState<string | null>(null);

  // Update filtered tasks when Convex data loads
  useEffect(() => {
    if (mounted && convexTasks.length > 0) {
      setFilteredTasks(convexTasks);
    }
  }, [mounted, convexTasks]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const folder = FOLDER_CONFIGS.find((f) => f.shortcutKey === e.key);
      if (folder) {
        setActiveHint(folder.id);
        setTimeout(() => {
          setActiveHint(null);
          onNavigateToView(folder.id);
        }, 150);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigateToView]);

  // Calculate counts for each folder
  const folderCounts = useMemo(() => {
    return FOLDER_CONFIGS.reduce(
      (acc, folder) => {
        acc[folder.id] = folder.filterFn(filteredTasks).length;
        return acc;
      },
      {} as Record<ViewType, number>
    );
  }, [filteredTasks]);

  // Get preview items for each folder
  const getPreviewItems = useCallback(
    (folder: FolderConfig) => {
      return folder.filterFn(filteredTasks).slice(0, 4).map((task) => ({
        id: task.id,
        title: task.title,
        priority: task.priority,
      }));
    },
    [filteredTasks]
  );

  const handleFilteredTasksChange = useCallback((tasks: Task[]) => {
    setFilteredTasks(tasks);
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--theme-primary)/0.1)] text-[hsl(var(--theme-primary))] text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Projects Hub
        </div>
        <h2
          className="text-3xl sm:text-4xl font-bold text-[hsl(var(--theme-foreground))] mb-3"
          style={{ fontFamily: 'var(--theme-font-heading)' }}
        >
          What would you like to explore?
        </h2>
        <p className="text-[hsl(var(--theme-muted-foreground))] text-lg">
          Navigate to your board, view the roadmap, or submit feature ideas
        </p>
      </motion.div>

      {/* Activity Pulse */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="max-w-3xl mx-auto"
      >
        <GitHubContributions
          owner="PodJamz"
          repo="resume"
        />
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <ProjectSearch
          tasks={convexTasks}
          onFilteredTasksChange={handleFilteredTasksChange}
          placeholder="Search projects... (try status:done or priority:high)"
        />
      </motion.div>

      {/* Folder Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {FOLDER_CONFIGS.map((folder, index) => (
          <motion.div
            key={folder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <ProjectFolderCard
              title={folder.title}
              description={folder.description}
              icon={folder.icon}
              count={folderCounts[folder.id]}
              previewItems={getPreviewItems(folder)}
              gradient={folder.gradient}
              onClick={() => onNavigateToView(folder.id)}
              shortcutKey={folder.shortcutKey}
              isActive={activeHint === folder.id}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Keyboard Hints */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-xs text-[hsl(var(--theme-muted-foreground))]">
          Press{' '}
          <kbd className={cn(
            'px-1.5 py-0.5 rounded font-mono text-xs',
            'bg-[hsl(var(--theme-muted))] border border-[hsl(var(--theme-border))]'
          )}>
            1
          </kbd>
          {' '}{' '}
          <kbd className={cn(
            'px-1.5 py-0.5 rounded font-mono text-xs',
            'bg-[hsl(var(--theme-muted))] border border-[hsl(var(--theme-border))]'
          )}>
            2
          </kbd>
          {' '}{' '}
          <kbd className={cn(
            'px-1.5 py-0.5 rounded font-mono text-xs',
            'bg-[hsl(var(--theme-muted))] border border-[hsl(var(--theme-border))]'
          )}>
            3
          </kbd>
          {' '}to jump to a folder
        </p>
      </motion.div>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={cn(
          'flex items-center justify-center gap-8 py-6 px-8 rounded-2xl mx-auto max-w-2xl',
          'bg-[hsl(var(--theme-card)/0.4)] backdrop-blur-sm',
          'border border-[hsl(var(--theme-border)/0.3)]'
        )}
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-[hsl(var(--theme-foreground))]">
            {filteredTasks.filter((t) => t.status === 'done').length}
          </div>
          <div className="text-xs text-[hsl(var(--theme-muted-foreground))]">Completed</div>
        </div>
        <div className="w-px h-10 bg-[hsl(var(--theme-border))]" />
        <div className="text-center">
          <div className="text-2xl font-bold text-[hsl(var(--theme-foreground))]">
            {filteredTasks.filter((t) => t.status === 'in-progress').length}
          </div>
          <div className="text-xs text-[hsl(var(--theme-muted-foreground))]">In Progress</div>
        </div>
        <div className="w-px h-10 bg-[hsl(var(--theme-border))]" />
        <div className="text-center">
          <div className="text-2xl font-bold text-[hsl(var(--theme-foreground))]">
            {filteredTasks.filter((t) => ['backlog', 'todo'].includes(t.status)).length}
          </div>
          <div className="text-xs text-[hsl(var(--theme-muted-foreground))]">Planned</div>
        </div>
      </motion.div>
    </div>
  );
}
