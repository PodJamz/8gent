'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// ============================================================================
// App Definitions - All apps in 8gent
// ============================================================================

export interface AppDefinition {
  id: string;
  name: string;
  route: string;
  icon: string;
  description: string;
  suggestedPrompts: SuggestedPrompt[];
  contextHints: string[]; // Hints for 8gent about what the user might want
}

export interface SuggestedPrompt {
  label: string;
  prompt: string;
  icon?: string;
}

// Define all apps with their contextual prompts
export const APP_DEFINITIONS: Record<string, AppDefinition> = {
  home: {
    id: 'home',
    name: 'Home',
    route: '/',
    icon: 'Home',
    description: '8gent Home Screen',
    suggestedPrompts: [
      { label: 'Show me around', prompt: 'Give me a tour of what I can do here' },
      { label: 'Recent projects', prompt: 'What are some recent projects you\'ve worked on?' },
    ],
    contextHints: [
      'User is on the home screen',
      'They may want to explore apps',
      'Good opportunity to suggest navigation or highlight features',
    ],
  },
  control: {
    id: 'control',
    name: 'Control Center',
    route: '/control',
    icon: 'Cpu',
    description: 'System management and orchestration hub',
    suggestedPrompts: [
      { label: 'System status', prompt: 'Show me the current system status' },
      { label: 'Manage channels', prompt: 'How do I connect new integrations?' },
    ],
    contextHints: [
      'User is in the Control Center',
      'They want to manage infrastructure or integrations',
    ],
  },
  agents: {
    id: 'agents',
    name: 'Agents Hub',
    route: '/agents',
    icon: 'Cpu',
    description: 'Agent configuration and logic workflows',
    suggestedPrompts: [
      { label: 'Agent status', prompt: 'Which agents are currently active?' },
      { label: 'New skill', prompt: 'How do I add a new skill to an agent?' },
    ],
    contextHints: [
      'User is in the Agents Hub',
      'They want to configure agent behavior or logic',
    ],
  },
  chat: {
    id: 'chat',
    name: 'Chat',
    route: '/chat',
    icon: 'MessageSquare',
    description: '8gent Chat Interface',
    suggestedPrompts: [
      { label: 'What can you do?', prompt: 'What are all the things you can help me with?' },
      { label: 'Portfolio tour', prompt: 'Walk me through the portfolio' },
    ],
    contextHints: [
      'User is in the chat app',
      'They want to have a conversation',
      'Can help with navigation, information, or scheduling',
    ],
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    route: '/settings',
    icon: 'Settings',
    description: 'OS preferences and developer tools',
    suggestedPrompts: [
      { label: 'Change theme', prompt: 'How do I change the system theme?' },
      { label: 'View logs', prompt: 'Show me the recent system logs' },
    ],
    contextHints: [
      'User is in Settings',
      'They want to customize or debug the OS',
    ],
  },
};

// ============================================================================
// Context Types
// ============================================================================

export interface AppContextValue {
  currentApp: AppDefinition | null;
  currentRoute: string;
  suggestedPrompts: SuggestedPrompt[];
  contextHints: string[];
  setCurrentApp: (appId: string | null) => void;
  getAppByRoute: (route: string) => AppDefinition | null;
  getAppById: (id: string) => AppDefinition | null;
}

// ============================================================================
// Context
// ============================================================================

const AppContext = createContext<AppContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface AppContextProviderProps {
  children: ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  const pathname = usePathname();
  const [currentApp, setCurrentAppState] = useState<AppDefinition | null>(null);

  // Get app by route (matches route prefix)
  const getAppByRoute = useCallback((route: string): AppDefinition | null => {
    // Exact match first
    const exactMatch = Object.values(APP_DEFINITIONS).find(app => app.route === route);
    if (exactMatch) return exactMatch;

    // Prefix match (for nested routes like /canvas/123)
    const prefixMatch = Object.values(APP_DEFINITIONS).find(app =>
      app.route !== '/' && route.startsWith(app.route)
    );
    if (prefixMatch) return prefixMatch;

    // Default to home for root
    if (route === '/') return APP_DEFINITIONS.home;

    return null;
  }, []);

  // Get app by ID
  const getAppById = useCallback((id: string): AppDefinition | null => {
    return APP_DEFINITIONS[id] || null;
  }, []);

  // Set current app manually
  const setCurrentApp = useCallback((appId: string | null) => {
    if (appId) {
      const app = getAppById(appId);
      setCurrentAppState(app);
    } else {
      setCurrentAppState(null);
    }
  }, [getAppById]);

  // Auto-detect app from pathname
  useEffect(() => {
    const app = getAppByRoute(pathname);
    setCurrentAppState(app);
  }, [pathname, getAppByRoute]);

  // Get suggested prompts for current app
  const suggestedPrompts = currentApp?.suggestedPrompts || APP_DEFINITIONS.home.suggestedPrompts;
  const contextHints = currentApp?.contextHints || [];

  const value: AppContextValue = {
    currentApp,
    currentRoute: pathname,
    suggestedPrompts,
    contextHints,
    setCurrentApp,
    getAppByRoute,
    getAppById,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}

// ============================================================================
// Utility: Format context for 8gent
// ============================================================================

export function formatAppContextForAI(appContext: AppContextValue): string {
  if (!appContext.currentApp) {
    return '';
  }

  const lines = [
    `## Current App Context`,
    `- **App**: ${appContext.currentApp.name}`,
    `- **Route**: ${appContext.currentRoute}`,
    `- **Description**: ${appContext.currentApp.description}`,
    '',
    '### Context Hints',
    ...appContext.contextHints.map(hint => `- ${hint}`),
  ];

  return lines.join('\n');
}
