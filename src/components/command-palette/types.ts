import type { ReactNode } from 'react';

export type CommandType = 'app' | 'theme' | 'action' | 'ai' | 'wiki';

export interface Command {
  id: string;
  type: CommandType;
  name: string;
  description?: string;
  keywords?: string[];
  icon?: ReactNode;
  href?: string;
  external?: boolean;
  action?: () => void;
  shortcut?: string;
}

export interface CommandGroup {
  id: string;
  name: string;
  commands: Command[];
}

export interface ParsedQuery {
  raw: string;
  search: string;
  type?: CommandType;
  prefix?: 'theme' | 'action' | 'ai' | 'wiki';
  themeName?: string;
  aiQuery?: string;
}

export interface CommandPaletteState {
  isOpen: boolean;
  query: string;
  selectedIndex: number;
  results: Command[];
  recentCommands: string[];
}

export interface CommandPaletteContextValue {
  state: CommandPaletteState;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setQuery: (query: string) => void;
  selectIndex: (index: number) => void;
  executeCommand: (command: Command) => void;
  navigateUp: () => void;
  navigateDown: () => void;
  executeSelected: () => void;
}
