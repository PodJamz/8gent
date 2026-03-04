'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import Fuse, { IFuseOptions } from 'fuse.js';
import { useDesignTheme } from '@/context/DesignThemeContext';
import { useHomeScreen } from '@/context/HomeScreenContext';
import { useTheme } from 'next-themes';
import type {
  Command,
  CommandPaletteContextValue,
  CommandPaletteState,
  ParsedQuery,
} from './types';
import { allCommands, getCommandsByType } from './commands';

const STORAGE_KEY = 'openclaw_recentCommands';
const MAX_RECENT = 5;

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

// Parse query for special syntax
function parseQuery(query: string): ParsedQuery {
  const trimmed = query.trim();

  // @james prefix for AI
  if (trimmed.startsWith('@james')) {
    return {
      raw: query,
      search: '',
      prefix: 'ai',
      aiQuery: trimmed.slice(6).trim(),
    };
  }

  // > prefix for actions
  if (trimmed.startsWith('>')) {
    return {
      raw: query,
      search: trimmed.slice(1).trim(),
      prefix: 'action',
      type: 'action',
    };
  }

  // theme: prefix for quick theme switch
  if (trimmed.toLowerCase().startsWith('theme:')) {
    return {
      raw: query,
      search: trimmed.slice(6).trim(),
      prefix: 'theme',
      type: 'theme',
      themeName: trimmed.slice(6).trim(),
    };
  }

  // wiki: prefix for documentation search
  if (trimmed.toLowerCase().startsWith('wiki:')) {
    return {
      raw: query,
      search: trimmed.slice(5).trim(),
      prefix: 'wiki',
      type: 'wiki',
    };
  }

  // type:app filter
  if (trimmed.toLowerCase().startsWith('type:app')) {
    return {
      raw: query,
      search: trimmed.slice(8).trim(),
      type: 'app',
    };
  }

  // type:theme filter
  if (trimmed.toLowerCase().startsWith('type:theme')) {
    return {
      raw: query,
      search: trimmed.slice(10).trim(),
      type: 'theme',
    };
  }

  // type:action filter
  if (trimmed.toLowerCase().startsWith('type:action')) {
    return {
      raw: query,
      search: trimmed.slice(11).trim(),
      type: 'action',
    };
  }

  return {
    raw: query,
    search: trimmed,
  };
}

// Fuse.js options for fuzzy search
const fuseOptions: IFuseOptions<Command> = {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'description', weight: 1 },
    { name: 'keywords', weight: 1.5 },
  ],
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true,
};

interface CommandPaletteProviderProps {
  children: ReactNode;
}

export function CommandPaletteProvider({ children }: CommandPaletteProviderProps) {
  const router = useRouter();
  const { setDesignTheme } = useDesignTheme();
  const { resetToDefault: resetHomeScreen } = useHomeScreen();
  const { setTheme: setDarkMode, theme: darkModeTheme } = useTheme();

  const [state, setState] = useState<CommandPaletteState>({
    isOpen: false,
    query: '',
    selectedIndex: 0,
    results: [],
    recentCommands: [],
  });

  // Load recent commands from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState((prev) => ({ ...prev, recentCommands: JSON.parse(stored) }));
      }
    } catch {
      // Ignore errors
    }
  }, []);

  // Save recent command
  const saveRecentCommand = useCallback((commandId: string) => {
    setState((prev) => {
      const recent = [commandId, ...prev.recentCommands.filter((id) => id !== commandId)].slice(
        0,
        MAX_RECENT
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
      } catch {
        // Ignore errors
      }
      return { ...prev, recentCommands: recent };
    });
  }, []);

  // Create Fuse instance
  const fuse = useMemo(() => new Fuse(allCommands, fuseOptions), []);

  // Search commands
  const searchCommands = useCallback(
    (query: string): Command[] => {
      const parsed = parseQuery(query);

      // AI query - return empty, will be handled differently
      if (parsed.prefix === 'ai') {
        return [];
      }

      // Get base commands to search
      let commandsToSearch = allCommands;
      if (parsed.type) {
        commandsToSearch = getCommandsByType(parsed.type);
      }

      // If no search term, return all matching commands
      if (!parsed.search) {
        return commandsToSearch.slice(0, 10);
      }

      // Fuzzy search
      const searchFuse = new Fuse(commandsToSearch, fuseOptions);
      const results = searchFuse.search(parsed.search);
      return results.map((r) => r.item).slice(0, 10);
    },
    [fuse]
  );

  // Update results when query changes
  useEffect(() => {
    const results = searchCommands(state.query);
    setState((prev) => ({
      ...prev,
      results,
      selectedIndex: 0,
    }));
  }, [state.query, searchCommands]);

  // Open palette
  const open = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
      query: '',
      selectedIndex: 0,
    }));
  }, []);

  // Close palette
  const close = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
      query: '',
      selectedIndex: 0,
    }));
  }, []);

  // Toggle palette
  const toggle = useCallback(() => {
    setState((prev) => {
      if (prev.isOpen) {
        return { ...prev, isOpen: false, query: '', selectedIndex: 0 };
      }
      return { ...prev, isOpen: true, query: '', selectedIndex: 0 };
    });
  }, []);

  // Set query
  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  // Select index
  const selectIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, selectedIndex: index }));
  }, []);

  // Navigate up
  const navigateUp = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedIndex: Math.max(0, prev.selectedIndex - 1),
    }));
  }, []);

  // Navigate down
  const navigateDown = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedIndex: Math.min(prev.results.length - 1, prev.selectedIndex + 1),
    }));
  }, []);

  // Execute command
  const executeCommand = useCallback(
    (command: Command) => {
      saveRecentCommand(command.id);

      switch (command.type) {
        case 'app':
          if (command.href) {
            if (command.external) {
              window.open(command.href, '_blank');
            } else {
              router.push(command.href);
            }
          }
          break;

        case 'theme':
          // Extract theme name from command ID
          const themeName = command.id.replace('theme-', '');
          setDesignTheme(themeName as Parameters<typeof setDesignTheme>[0]);
          break;

        case 'action':
          switch (command.id) {
            case 'action-toggle-dark':
              setDarkMode(darkModeTheme === 'dark' ? 'light' : 'dark');
              break;
            case 'action-reset-home':
              resetHomeScreen();
              break;
            case 'action-claw-ai':
              // Could trigger 8gent overlay here
              router.push('/');
              break;
            default:
              if (command.href) {
                router.push(command.href);
              } else if (command.action) {
                command.action();
              }
          }
          break;

        case 'wiki':
          // Navigate to wiki pages
          if (command.href) {
            router.push(command.href);
          }
          break;

        case 'ai':
          // Handle AI queries
          break;
      }

      close();
    },
    [router, setDesignTheme, setDarkMode, darkModeTheme, resetHomeScreen, close, saveRecentCommand]
  );

  // Execute selected command
  const executeSelected = useCallback(() => {
    const command = state.results[state.selectedIndex];
    if (command) {
      executeCommand(command);
    }
  }, [state.results, state.selectedIndex, executeCommand]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to toggle
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  const value: CommandPaletteContextValue = {
    state,
    open,
    close,
    toggle,
    setQuery,
    selectIndex,
    executeCommand,
    navigateUp,
    navigateDown,
    executeSelected,
  };

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error('useCommandPalette must be used within a CommandPaletteProvider');
  }
  return context;
}
