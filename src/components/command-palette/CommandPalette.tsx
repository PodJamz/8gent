'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  Palette,
  Zap,
  AppWindow,
  Sparkles,
  Command,
  CornerDownLeft,
  BookOpen,
} from 'lucide-react';
import { useCommandPalette } from './CommandPaletteProvider';
import type { Command as CommandType } from './types';

// Icon components for command types
function getCommandIcon(command: CommandType) {
  switch (command.type) {
    case 'app':
      return <AppWindow className="w-4 h-4" />;
    case 'theme':
      return <Palette className="w-4 h-4" />;
    case 'action':
      return <Zap className="w-4 h-4" />;
    case 'ai':
      return <Sparkles className="w-4 h-4" />;
    case 'wiki':
      return <BookOpen className="w-4 h-4" />;
    default:
      return <ArrowRight className="w-4 h-4" />;
  }
}

// Get type badge color
function getTypeBadgeColor(type: CommandType['type']) {
  switch (type) {
    case 'app':
      return 'bg-blue-500/20 text-blue-300';
    case 'theme':
      return 'bg-purple-500/20 text-purple-300';
    case 'action':
      return 'bg-amber-500/20 text-amber-300';
    case 'ai':
      return 'bg-emerald-500/20 text-emerald-300';
    case 'wiki':
      return 'bg-cyan-500/20 text-cyan-300';
    default:
      return 'bg-gray-500/20 text-gray-300';
  }
}

export function CommandPalette() {
  const {
    state,
    close,
    setQuery,
    selectIndex,
    executeCommand,
    navigateUp,
    navigateDown,
    executeSelected,
  } = useCommandPalette();

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (state.isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector('[data-selected="true"]');
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [state.selectedIndex]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          navigateUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          navigateDown();
          break;
        case 'Enter':
          e.preventDefault();
          executeSelected();
          break;
        case 'Escape':
          e.preventDefault();
          close();
          break;
        case 'Tab':
          e.preventDefault();
          // Autocomplete - fill in the selected command name
          if (state.results[state.selectedIndex]) {
            setQuery(state.results[state.selectedIndex].name);
          }
          break;
      }
    },
    [navigateUp, navigateDown, executeSelected, close, state.results, state.selectedIndex, setQuery]
  );

  // Check for AI query prefix
  const isAIQuery = state.query.trim().startsWith('@james');

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
            onClick={close}
            aria-hidden="true"
          />

          {/* Command Palette Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[640px] z-[101]"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="mx-4 overflow-hidden rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={state.query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search apps, themes, actions, wiki..."
                  className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-base"
                  aria-label="Search commands"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">esc</kbd>
                  <span>to close</span>
                </div>
              </div>

              {/* Results List */}
              <div
                ref={listRef}
                className="max-h-[400px] overflow-y-auto overscroll-contain"
                role="listbox"
                aria-label="Search results"
              >
                {/* AI Query Mode */}
                {isAIQuery && (
                  <div className="p-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      <div className="flex-1">
                        <p className="text-foreground font-medium">Ask Claw AI</p>
                        <p className="text-muted-foreground text-sm">
                          {state.query.slice(6).trim() || 'Type your question...'}
                        </p>
                      </div>
                      <CornerDownLeft className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                )}

                {/* Command Results */}
                {!isAIQuery && state.results.length > 0 && (
                  <div className="p-2">
                    {state.results.map((command, index) => (
                      <button
                        key={command.id}
                        data-selected={index === state.selectedIndex}
                        onClick={() => executeCommand(command)}
                        onMouseEnter={() => selectIndex(index)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                          transition-colors duration-75
                          ${
                            index === state.selectedIndex
                              ? 'bg-muted text-foreground'
                              : 'text-foreground/70 hover:bg-muted/50'
                          }
                        `}
                        role="option"
                        aria-selected={index === state.selectedIndex}
                      >
                        {/* Icon */}
                        <div
                          className={`
                            flex items-center justify-center w-8 h-8 rounded-lg
                            ${index === state.selectedIndex ? 'bg-muted-foreground/20' : 'bg-muted'}
                          `}
                        >
                          {getCommandIcon(command)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{command.name}</span>
                            <span
                              className={`
                                px-1.5 py-0.5 rounded text-[10px] font-medium uppercase
                                ${getTypeBadgeColor(command.type)}
                              `}
                            >
                              {command.type}
                            </span>
                          </div>
                          {command.description && (
                            <p className="text-sm text-muted-foreground truncate">{command.description}</p>
                          )}
                        </div>

                        {/* Shortcut / Action indicator */}
                        {command.shortcut && (
                          <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono">
                            {command.shortcut}
                          </kbd>
                        )}
                        {command.external && (
                          <ArrowRight className="w-4 h-4 text-muted-foreground rotate-[-45deg]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!isAIQuery && state.query && state.results.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p>No results found for &quot;{state.query}&quot;</p>
                    <p className="text-sm mt-1">Try a different search term</p>
                  </div>
                )}

                {/* Quick Tips (when empty query) */}
                {!state.query && (
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider px-2">
                      Quick Tips
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 px-2">
                        <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono">
                          theme:
                        </kbd>
                        <span>Switch themes quickly</span>
                      </div>
                      <div className="flex items-center gap-2 px-2">
                        <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono">
                          &gt;
                        </kbd>
                        <span>Run actions</span>
                      </div>
                      <div className="flex items-center gap-2 px-2">
                        <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono">
                          @james
                        </kbd>
                        <span>Ask Claw AI anything</span>
                      </div>
                      <div className="flex items-center gap-2 px-2">
                        <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono">
                          wiki:
                        </kbd>
                        <span>Search documentation</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-muted font-mono">↑</kbd>
                    <kbd className="px-1 py-0.5 rounded bg-muted font-mono">↓</kbd>
                    <span>navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-muted font-mono">↵</kbd>
                    <span>select</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-muted font-mono">tab</kbd>
                    <span>autocomplete</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
