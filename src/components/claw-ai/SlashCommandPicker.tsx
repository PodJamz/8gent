'use client';

/**
 * SlashCommandPicker - Autocomplete picker for slash commands
 *
 * Triggered by / in text input, shows searchable list of:
 * - Quick Actions (/help, /clear, /new)
 * - Navigation (/home, /canvas, /projects)
 * - Tools (/search, /schedule, /kanban)
 * - Skills (/skill-design, /skill-react)
 * - Dimensions (/dim-kanban, /dim-timeline)
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type SlashCommand,
  type CommandCategory,
  searchCommands,
  getCommandsByCategory,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  formatCommandPreview,
} from '@/lib/8gent/slash-command-registry';

// ============================================================================
// Types
// ============================================================================

interface SlashCommandPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (command: SlashCommand) => void;
  searchQuery?: string;
  position?: { x: number; y: number };
  includeOwnerOnly?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function SlashCommandPicker({
  isOpen,
  onClose,
  onSelect,
  searchQuery: initialQuery = '',
  position,
  includeOwnerOnly = false,
}: SlashCommandPickerProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<CommandCategory | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sync search query with prop
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Get filtered commands
  const filteredCommands = useMemo(() => {
    if (searchQuery) {
      return searchCommands(searchQuery, {
        categories: selectedCategory ? [selectedCategory] : undefined,
        includeOwnerOnly,
      });
    }

    // If no search, show by category
    const byCategory = getCommandsByCategory(includeOwnerOnly);

    if (selectedCategory) {
      return byCategory[selectedCategory] || [];
    }

    // Flatten categories in order
    const order: CommandCategory[] = [
      'quick',
      'navigation',
      'tools',
      'memory',
      'product',
      'code',
      'media',
      'skills',
      'dimensions',
    ];

    return order.flatMap((cat) => byCategory[cat] || []).slice(0, 30);
  }, [searchQuery, selectedCategory, includeOwnerOnly]);

  // Get unique categories from filtered results
  const availableCategories = useMemo(() => {
    const cats = new Set(filteredCommands.map((cmd) => cmd.category));
    return Array.from(cats);
  }, [filteredCommands]);

  // Reset selected index when filtered items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands.length, searchQuery]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            onSelect(filteredCommands[selectedIndex]);
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
          const cats = availableCategories;
          if (cats.length === 0) return;
          const currentIdx = selectedCategory ? cats.indexOf(selectedCategory) : -1;
          const nextIdx = (currentIdx + 1) % (cats.length + 1);
          setSelectedCategory(nextIdx === cats.length ? null : cats[nextIdx]);
          break;
      }
    },
    [filteredCommands, selectedIndex, selectedCategory, availableCategories, onSelect, onClose]
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute z-50 w-[420px] max-h-[450px] bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
      style={
        position
          ? { left: position.x, top: position.y }
          : { left: 0, bottom: '100%', marginBottom: 8 }
      }
      onKeyDown={handleKeyDown}
    >
      {/* Search Header */}
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
          <span className="text-amber-500 font-mono text-sm">/</span>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commands..."
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
        {availableCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
              selectedCategory === category
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white/70 hover:bg-white/5'
            )}
            style={
              selectedCategory === category
                ? { color: CATEGORY_COLORS[category] }
                : {}
            }
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div ref={listRef} className="max-h-[320px] overflow-y-auto">
        {filteredCommands.length === 0 ? (
          <div className="p-8 text-center">
            <Search className="w-8 h-8 mx-auto mb-2 text-white/20" />
            <p className="text-sm text-white/40">No commands found</p>
            <p className="text-xs text-white/30 mt-1">Try a different search</p>
          </div>
        ) : (
          filteredCommands.map((cmd, index) => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.name}
                data-index={index}
                onClick={() => {
                  onSelect(cmd);
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors',
                  index === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'
                )}
              >
                {/* Icon */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${cmd.color}20`,
                    color: cmd.color,
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white font-mono">
                      {formatCommandPreview(cmd)}
                    </span>
                    {cmd.ownerOnly && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                        owner
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/50 mt-0.5 truncate">
                    {cmd.description}
                  </p>
                </div>

                {/* Category badge */}
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[cmd.category]}20`,
                    color: CATEGORY_COLORS[cmd.category],
                  }}
                >
                  {cmd.category}
                </span>

                {/* Arrow indicator */}
                {index === selectedIndex && (
                  <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" />
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Footer Hint */}
      <div className="p-2 border-t border-white/10 bg-white/5">
        <p className="text-[10px] text-white/40 text-center">
          <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/60">
            ↑↓
          </kbd>{' '}
          navigate{' '}
          <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/60">
            Tab
          </kbd>{' '}
          category{' '}
          <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/60">
            Enter
          </kbd>{' '}
          select{' '}
          <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/60">
            Esc
          </kbd>{' '}
          close
        </p>
      </div>
    </motion.div>
  );
}

export default SlashCommandPicker;
