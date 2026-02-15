'use client';

/**
 * ConvexProjectSelector - Searchable Project Dropdown
 *
 * A combobox-style selector that:
 * - Queries productProjects from Convex
 * - Allows typing to filter projects
 * - Shows project colors and status
 * - Updates session state on selection
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Search,
  Check,
  Plus,
  Layers,
  FolderOpen,
} from 'lucide-react';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import { useOpenClawSession } from '@/context/ProjectContext';
import { cn } from '@/lib/utils';
import { Id } from '../../../convex/_generated/dataModel';

interface ConvexProjectSelectorProps {
  /** Owner ID for filtering projects (defaults to 'demo' for public view) */
  ownerId?: string;
  /** Placeholder text when no project selected */
  placeholder?: string;
  /** Show create project option */
  showCreate?: boolean;
  /** Compact mode - smaller button */
  compact?: boolean;
  /** Callback when project changes */
  onProjectChange?: (projectId: Id<"productProjects"> | null, slug: string | null) => void;
}

export function ConvexProjectSelector({
  ownerId = 'demo',
  placeholder = 'Select a project...',
  showCreate = false,
  compact = false,
  onProjectChange,
}: ConvexProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Session state for active project
  const { activeConvexProjectId, activeConvexProjectSlug, setActiveConvexProject } = useOpenClawSession();

  // Query projects from Convex
  const projects = useQuery(api.agentic.getProductProjects, { ownerId });
  const createProjectMutation = useMutation(api.agentic.createProductProject);

  // Get active project details
  const activeProject = projects?.find(p => p._id === activeConvexProjectId);

  // Filter projects by search query
  const filteredProjects = projects?.filter(project => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      project.name.toLowerCase().includes(query) ||
      project.slug?.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query)
    );
  }) ?? [];

  // Handle project selection
  const handleSelectProject = (project: typeof filteredProjects[0]) => {
    setActiveConvexProject(project._id, project.slug);
    onProjectChange?.(project._id, project.slug);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Handle clear selection
  const handleClearSelection = () => {
    setActiveConvexProject(null, null);
    onProjectChange?.(null, null);
  };

  // Handle create new project
  const handleCreateProject = async () => {
    if (!searchQuery.trim()) return;

    // Mutation returns { projectId, slug }
    const { projectId, slug } = await createProjectMutation({
      name: searchQuery.trim(),
      ownerId,
      description: '',
    });

    // Select the newly created project
    setActiveConvexProject(projectId, slug);
    onProjectChange?.(projectId, slug);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Status badge colors
  const statusColors: Record<string, string> = {
    discovery: 'bg-purple-500/20 text-purple-400',
    design: 'bg-blue-500/20 text-blue-400',
    planning: 'bg-yellow-500/20 text-yellow-400',
    building: 'bg-green-500/20 text-green-400',
    launched: 'bg-emerald-500/20 text-emerald-400',
    archived: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg transition-all',
          'border border-[hsl(var(--theme-border))]',
          'hover:bg-[hsl(var(--theme-muted))]',
          compact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2',
          isOpen && 'ring-2 ring-[hsl(var(--theme-primary))] ring-offset-1 ring-offset-[hsl(var(--theme-background))]'
        )}
        style={{
          backgroundColor: 'hsl(var(--theme-card))',
          color: 'hsl(var(--theme-foreground))',
        }}
      >
        {activeProject ? (
          <>
            <div
              className={cn('rounded-full', compact ? 'w-2 h-2' : 'w-3 h-3')}
              style={{ backgroundColor: activeProject.color || '#8b5cf6' }}
            />
            <span className="font-medium truncate max-w-[150px]">
              {activeProject.name}
            </span>
          </>
        ) : (
          <>
            <FolderOpen className={cn(compact ? 'w-3.5 h-3.5' : 'w-4 h-4', 'opacity-50')} />
            <span className="opacity-70">{placeholder}</span>
          </>
        )}
        <ChevronDown
          className={cn(
            'transition-transform',
            compact ? 'w-3.5 h-3.5' : 'w-4 h-4',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-[300px] rounded-xl overflow-hidden shadow-xl z-50"
            style={{
              backgroundColor: 'hsl(var(--theme-card))',
              border: '1px solid hsl(var(--theme-border))',
            }}
          >
            {/* Search Input */}
            <div className="p-2 border-b border-[hsl(var(--theme-border))]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--theme-muted-foreground))]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className={cn(
                    'w-full pl-9 pr-4 py-2 rounded-lg text-sm',
                    'bg-[hsl(var(--theme-background))]',
                    'border border-[hsl(var(--theme-border))]',
                    'text-[hsl(var(--theme-foreground))]',
                    'placeholder:text-[hsl(var(--theme-muted-foreground))]',
                    'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary))]'
                  )}
                />
              </div>
            </div>

            {/* Projects List */}
            <div className="max-h-[280px] overflow-y-auto">
              {filteredProjects.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-[hsl(var(--theme-muted-foreground))]">
                    {searchQuery ? 'No projects found' : 'No projects yet'}
                  </p>
                  {showCreate && searchQuery && (
                    <button
                      onClick={handleCreateProject}
                      className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create "{searchQuery}"
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-1">
                  {filteredProjects.map((project) => (
                    <button
                      key={project._id}
                      onClick={() => handleSelectProject(project)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                        'hover:bg-[hsl(var(--theme-muted))]',
                        project._id === activeConvexProjectId && 'bg-[hsl(var(--theme-muted))]'
                      )}
                    >
                      {/* Project Color */}
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.color || '#8b5cf6' }}
                      />

                      {/* Project Info */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium truncate"
                            style={{ color: 'hsl(var(--theme-foreground))' }}
                          >
                            {project.name}
                          </span>
                          {project.status && (
                            <span
                              className={cn(
                                'text-[10px] px-1.5 py-0.5 rounded-full',
                                statusColors[project.status] || statusColors.discovery
                              )}
                            >
                              {project.status}
                            </span>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-xs text-[hsl(var(--theme-muted-foreground))] truncate">
                            {project.description}
                          </p>
                        )}
                      </div>

                      {/* Selected Indicator */}
                      {project._id === activeConvexProjectId && (
                        <Check className="w-4 h-4 text-[hsl(var(--theme-primary))] flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {(showCreate || activeProject) && (
              <div className="p-2 border-t border-[hsl(var(--theme-border))] flex items-center justify-between">
                {activeProject && (
                  <button
                    onClick={handleClearSelection}
                    className="text-xs text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
                  >
                    Clear selection
                  </button>
                )}
                {showCreate && !searchQuery && (
                  <button
                    onClick={() => inputRef.current?.focus()}
                    className="ml-auto inline-flex items-center gap-1.5 text-xs text-[hsl(var(--theme-primary))] hover:underline"
                  >
                    <Plus className="w-3 h-3" />
                    New project
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ConvexProjectSelector;
