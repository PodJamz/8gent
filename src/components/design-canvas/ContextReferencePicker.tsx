'use client';

/**
 * ContextReferencePicker - Allows users to pull in context from their data layer
 *
 * Triggered by @ in text input, shows searchable list of:
 * - Tickets (@ticket:)
 * - PRDs (@prd:)
 * - Projects (@project:)
 * - Tasks (@task:)
 * - Canvas (@canvas:)
 * - Memories (@memory:)
 * - Tracks/Lyrics (@track:)
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import {
  Search,
  FileText,
  Layers,
  CheckSquare,
  Music,
  Brain,
  LayoutGrid,
  Target,
  Ticket,
  Hash,
  Sparkles,
  Eye,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReferenceType, ContextReference } from '@/lib/canvas/artifacts';
import {
  SKILL_COMMANDS,
  DIMENSION_COMMANDS,
  TOOL_COMMANDS,
} from '@/lib/claw-ai/slash-command-registry';

// ============================================================================
// Types
// ============================================================================

interface ReferenceCategory {
  type: ReferenceType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface ContextReferencePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (reference: ContextReference) => void;
  searchQuery?: string;
  position?: { x: number; y: number };
  filterType?: ReferenceType;
}

// ============================================================================
// Reference Categories
// ============================================================================

const REFERENCE_CATEGORIES: ReferenceCategory[] = [
  { type: 'ticket', label: 'Tickets', icon: <Ticket className="w-4 h-4" />, color: '#f59e0b' },
  { type: 'prd', label: 'PRDs', icon: <FileText className="w-4 h-4" />, color: '#ec4899' },
  { type: 'project', label: 'Projects', icon: <Layers className="w-4 h-4" />, color: '#8b5cf6' },
  { type: 'task', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" />, color: '#3b82f6' },
  { type: 'canvas', label: 'Canvas', icon: <LayoutGrid className="w-4 h-4" />, color: '#10b981' },
  { type: 'memory', label: 'Memories', icon: <Brain className="w-4 h-4" />, color: '#6366f1' },
  { type: 'track', label: 'Tracks', icon: <Music className="w-4 h-4" />, color: '#ef4444' },
  { type: 'skill', label: 'Skills', icon: <Sparkles className="w-4 h-4" />, color: '#a855f7' },
  { type: 'dimension', label: 'Dimensions', icon: <Eye className="w-4 h-4" />, color: '#14b8a6' },
  { type: 'tool', label: 'Tools', icon: <Wrench className="w-4 h-4" />, color: '#0ea5e9' },
];

// ============================================================================
// Component
// ============================================================================

export function ContextReferencePicker({
  isOpen,
  onClose,
  onSelect,
  searchQuery: initialQuery = '',
  position,
  filterType,
}: ContextReferencePickerProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<ReferenceType | null>(filterType || null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Query data from Convex
  // Note: Using type assertion for designCanvas.listCanvases (types regenerate on convex dev)
  const tickets = useQuery(api.agentic.listTickets, { limit: 50 });
  const prds = useQuery(api.agentic.listPRDs, { limit: 20 });
  const projects = useQuery(api.agentic.listProjects, {});
  const tasks = useQuery(api.kanban.getTasks, {});
  const canvases = useQuery((api as any).designCanvas?.listCanvases, { limit: 20 });

  // SECURITY FIX: Pass userId to searchMemories to prevent cross-user data exposure
  // TODO: Get actual userId from auth context - for now skip memory search
  const memories = useQuery(api.memories.searchMemories, 'skip');

  const tracks = useQuery(api.jamz.listTracks, { limit: 20 });

  // Build searchable items
  const allItems = useMemo(() => {
    const items: ContextReference[] = [];

    // Add tickets
    if (tickets) {
      tickets.forEach((t: any) => {
        items.push({
          type: 'ticket',
          id: t._id,
          displayName: t.ticketId || t.title || 'Untitled Ticket',
          preview: t.iWant ? `As a ${t.asA}, I want ${t.iWant}` : t.description,
          data: t,
        });
      });
    }

    // Add PRDs
    if (prds) {
      prds.forEach((p: any) => {
        items.push({
          type: 'prd',
          id: p._id,
          displayName: p.title || 'Untitled PRD',
          preview: p.executiveSummary || p.problemStatement,
          data: p,
        });
      });
    }

    // Add projects
    if (projects) {
      projects.forEach((p: any) => {
        items.push({
          type: 'project',
          id: p._id,
          displayName: p.name || 'Untitled Project',
          preview: p.description,
          data: p,
        });
      });
    }

    // Add tasks
    if (tasks) {
      tasks.forEach((t: any) => {
        items.push({
          type: 'task',
          id: t._id,
          displayName: t.title || 'Untitled Task',
          preview: t.description,
          data: t,
        });
      });
    }

    // Add canvases
    if (canvases) {
      canvases.forEach((c: any) => {
        items.push({
          type: 'canvas',
          id: c._id,
          displayName: c.name || 'Untitled Canvas',
          preview: c.description || `${c.canvasType} canvas`,
          data: c,
        });
      });
    }

    // Add memories
    if (memories) {
      memories.forEach((m: any) => {
        items.push({
          type: 'memory',
          id: m._id,
          displayName: m.content?.slice(0, 50) || 'Memory',
          preview: m.content,
          data: m,
        });
      });
    }

    // Add tracks
    if (tracks) {
      tracks.forEach((t: any) => {
        items.push({
          type: 'track',
          id: t._id,
          displayName: t.title || 'Untitled Track',
          preview: t.lyrics?.slice(0, 100) || t.description,
          data: t,
        });
      });
    }

    // Add skills from slash command registry
    SKILL_COMMANDS.forEach((skill) => {
      items.push({
        type: 'skill',
        id: skill.name,
        displayName: skill.label,
        preview: skill.description,
        data: { contextType: skill.contextType, color: skill.color },
      });
    });

    // Add dimensions from slash command registry
    DIMENSION_COMMANDS.forEach((dim) => {
      items.push({
        type: 'dimension',
        id: dim.name,
        displayName: dim.label,
        preview: dim.description,
        data: { contextType: dim.contextType, color: dim.color },
      });
    });

    // Add tools from slash command registry
    TOOL_COMMANDS.forEach((tool) => {
      items.push({
        type: 'tool',
        id: tool.name,
        displayName: tool.label,
        preview: tool.description,
        data: { toolName: tool.toolName || tool.name, color: tool.color },
      });
    });

    return items;
  }, [tickets, prds, projects, tasks, canvases, memories, tracks]);

  // Filter items by search and category
  const filteredItems = useMemo(() => {
    let items = allItems;

    // Filter by category
    if (selectedCategory) {
      items = items.filter(item => item.type === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.displayName.toLowerCase().includes(query) ||
        (item.preview && item.preview.toLowerCase().includes(query))
      );
    }

    return items.slice(0, 20); // Limit results
  }, [allItems, selectedCategory, searchQuery]);

  // Reset selected index when filtered items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems.length]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelect(filteredItems[selectedIndex]);
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'Tab':
        e.preventDefault();
        // Cycle through categories
        const currentIdx = selectedCategory
          ? REFERENCE_CATEGORIES.findIndex(c => c.type === selectedCategory)
          : -1;
        const nextIdx = (currentIdx + 1) % (REFERENCE_CATEGORIES.length + 1);
        setSelectedCategory(nextIdx === REFERENCE_CATEGORIES.length ? null : REFERENCE_CATEGORIES[nextIdx].type);
        break;
    }
  }, [filteredItems, selectedIndex, selectedCategory, onSelect, onClose]);

  // Get icon for reference type
  const getIcon = (type: ReferenceType) => {
    const category = REFERENCE_CATEGORIES.find(c => c.type === type);
    return category?.icon || <Hash className="w-4 h-4" />;
  };

  // Get color for reference type
  const getColor = (type: ReferenceType) => {
    const category = REFERENCE_CATEGORIES.find(c => c.type === type);
    return category?.color || '#6b7280';
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute z-50 w-96 max-h-[400px] bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
      style={position ? { left: position.x, top: position.y } : { left: 0, bottom: '100%', marginBottom: 8 }}
      onKeyDown={handleKeyDown}
    >
      {/* Search Header */}
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
          <Search className="w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your data..."
            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-white/40"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-white/40 hover:text-white/60"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-white/10 overflow-x-auto">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
            !selectedCategory
              ? 'bg-white/10 text-white'
              : 'text-white/50 hover:text-white/70 hover:bg-white/5'
          )}
        >
          All
        </button>
        {REFERENCE_CATEGORIES.map((category) => (
          <button
            key={category.type}
            onClick={() => setSelectedCategory(category.type)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
              selectedCategory === category.type
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white/70 hover:bg-white/5'
            )}
            style={selectedCategory === category.type ? { color: category.color } : {}}
          >
            {category.icon}
            {category.label}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="max-h-[280px] overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center">
            <Search className="w-8 h-8 mx-auto mb-2 text-white/20" />
            <p className="text-sm text-white/40">No results found</p>
            <p className="text-xs text-white/30 mt-1">Try a different search or category</p>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <button
              key={`${item.type}-${item.id}`}
              onClick={() => {
                onSelect(item);
                onClose();
              }}
              className={cn(
                'w-full flex items-start gap-3 p-3 text-left transition-colors',
                index === selectedIndex
                  ? 'bg-white/10'
                  : 'hover:bg-white/5'
              )}
            >
              {/* Icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${getColor(item.type)}20`, color: getColor(item.type) }}
              >
                {getIcon(item.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white truncate">
                    {item.displayName}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: `${getColor(item.type)}20`, color: getColor(item.type) }}
                  >
                    {item.type}
                  </span>
                </div>
                {item.preview && (
                  <p className="text-xs text-white/50 mt-0.5 line-clamp-2">
                    {item.preview}
                  </p>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer Hint */}
      <div className="p-2 border-t border-white/10 bg-white/5">
        <p className="text-[10px] text-white/40 text-center">
          <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/60">↑↓</kbd> navigate
          {' '}<kbd className="px-1 py-0.5 bg-white/10 rounded text-white/60">Tab</kbd> switch category
          {' '}<kbd className="px-1 py-0.5 bg-white/10 rounded text-white/60">Enter</kbd> select
        </p>
      </div>
    </motion.div>
  );
}

export default ContextReferencePicker;
