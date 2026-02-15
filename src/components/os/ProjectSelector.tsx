'use client';

/**
 * ProjectSelector - Project Switcher UI
 *
 * Allows users to:
 * - View active project
 * - Switch between projects
 * - Create new projects
 * - Archive projects
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Plus,
  Archive,
  Check,
  FolderOpen,
  Settings,
  Layers,
} from 'lucide-react';
import { useProject, type Project } from '@/context/ProjectContext';
import { LiquidGlass } from '@/components/ui/liquid-glass';

interface ProjectSelectorProps {
  variant?: 'full' | 'compact' | 'minimal';
  showCreateButton?: boolean;
}

export function ProjectSelector({
  variant = 'full',
  showCreateButton = true,
}: ProjectSelectorProps) {
  const {
    projects,
    activeProject,
    activeProjectId,
    setActiveProject,
    createProject,
    archiveProject,
    getActiveProjects,
  } = useProject();

  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#8b5cf6');

  const activeProjects = getActiveProjects();

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject({
        name: newProjectName.trim(),
        color: newProjectColor,
      });
      setNewProjectName('');
      setShowCreateModal(false);
    }
  };

  const colors = [
    '#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4',
    '#10b981', '#22c55e', '#eab308', '#f97316',
    '#ef4444', '#ec4899', '#f43f5e',
  ];

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2">
        {activeProject && (
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: activeProject.color }}
          />
        )}
        <span className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
          {activeProject?.name || 'No project'}
        </span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          {activeProject && (
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: activeProject.color }}
            />
          )}
          <span className="text-sm font-medium">{activeProject?.name || 'Select project'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-1 min-w-[200px] rounded-xl overflow-hidden z-50"
              style={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
              }}
            >
              {activeProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setActiveProject(project.id);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/5"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span
                    className="flex-1 text-left text-sm"
                    style={{ color: 'hsl(var(--foreground))' }}
                  >
                    {project.name}
                  </span>
                  {project.id === activeProjectId && (
                    <Check className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full variant
  return (
    <>
      <LiquidGlass className="p-4 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Active Project
          </h3>
          {showCreateButton && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: 'hsl(var(--primary))' }}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {activeProject ? (
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: activeProject.color + '20' }}
            >
              <Layers className="w-5 h-5" style={{ color: activeProject.color }} />
            </div>
            <div>
              <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                {activeProject.name}
              </div>
              {activeProject.description && (
                <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {activeProject.description}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>No active project</p>
          </div>
        )}

        {activeProjects.length > 1 && (
          <div className="pt-3 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
            <p className="text-xs mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Switch project
            </p>
            <div className="flex flex-wrap gap-2">
              {activeProjects
                .filter((p) => p.id !== activeProjectId)
                .map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setActiveProject(project.id)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'hsl(var(--muted))',
                      color: 'hsl(var(--foreground))',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-sm">{project.name}</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </LiquidGlass>

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-2xl p-6"
              style={{ backgroundColor: 'hsl(var(--background))' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
                Create Project
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="My New Product"
                    className="w-full px-4 py-2.5 rounded-xl"
                    style={{
                      backgroundColor: 'hsl(var(--muted))',
                      color: 'hsl(var(--foreground))',
                      border: '1px solid hsl(var(--border))',
                    }}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewProjectColor(color)}
                        className="w-8 h-8 rounded-lg transition-transform hover:scale-110"
                        style={{
                          backgroundColor: color,
                          boxShadow: newProjectColor === color ? '0 0 0 2px white' : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl"
                  style={{
                    backgroundColor: 'hsl(var(--muted))',
                    color: 'hsl(var(--foreground))',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim()}
                  className="px-4 py-2 rounded-xl disabled:opacity-50"
                  style={{
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                  }}
                >
                  Create Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * ActiveProjectIndicator - Shows current project in header/navbar
 */
export function ActiveProjectIndicator() {
  const { activeProject } = useProject();

  if (!activeProject) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10">
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: activeProject.color }}
      />
      <span className="text-xs font-medium" style={{ color: 'hsl(var(--foreground))' }}>
        {activeProject.name}
      </span>
    </div>
  );
}
