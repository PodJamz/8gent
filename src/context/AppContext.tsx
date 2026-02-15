'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// ============================================================================
// App Definitions - All apps in OpenClaw-OS
// ============================================================================

export interface AppDefinition {
  id: string;
  name: string;
  route: string;
  icon: string;
  description: string;
  suggestedPrompts: SuggestedPrompt[];
  contextHints: string[]; // Hints for Claw AI about what the user might want
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
    description: 'OpenClaw-OS Home Screen',
    suggestedPrompts: [
      { label: 'Show me around', prompt: 'Give me a tour of what I can do here' },
      { label: 'About James', prompt: 'Tell me about James and his work' },
      { label: 'Recent projects', prompt: 'What are some recent projects you\'ve worked on?' },
    ],
    contextHints: [
      'User is on the home screen',
      'They may want to explore apps or learn about James',
      'Good opportunity to suggest navigation or highlight features',
    ],
  },
  chat: {
    id: 'chat',
    name: 'Chat',
    route: '/chat',
    icon: 'MessageSquare',
    description: 'Claw AI Chat Interface',
    suggestedPrompts: [
      { label: 'What can you do?', prompt: 'What are all the things you can help me with?' },
      { label: 'Portfolio tour', prompt: 'Walk me through the portfolio' },
      { label: 'Schedule a call', prompt: 'I\'d like to schedule a call with James' },
    ],
    contextHints: [
      'User is in the chat app',
      'They want to have a conversation',
      'Can help with navigation, information, or scheduling',
    ],
  },
  canvas: {
    id: 'canvas',
    name: 'Design Canvas',
    route: '/canvas',
    icon: 'Palette',
    description: 'Infinite design canvas for visual creation',
    suggestedPrompts: [
      { label: 'Create storyboard', prompt: 'Help me create a storyboard for a new feature' },
      { label: 'Generate UI mockup', prompt: 'Generate a UI mockup for a mobile app' },
      { label: 'Brainstorm layout', prompt: 'Help me brainstorm layout ideas for this canvas' },
      { label: 'Import images', prompt: 'How do I add images to this canvas?' },
    ],
    contextHints: [
      'User is in the design canvas',
      'They may want to create visual content',
      'Can help with storyboards, mockups, brainstorming',
      'Can generate images and help organize visual ideas',
    ],
  },
  design: {
    id: 'design',
    name: 'Design Themes',
    route: '/design',
    icon: 'Brush',
    description: 'Theme playground with 50+ themes',
    suggestedPrompts: [
      { label: 'Recommend a theme', prompt: 'What theme would you recommend for a professional portfolio?' },
      { label: 'Theme comparison', prompt: 'Compare the cyberpunk and minimal themes' },
      { label: 'Custom theme', prompt: 'Help me create a custom theme' },
    ],
    contextHints: [
      'User is exploring design themes',
      'They want to customize their experience',
      'Can help compare or recommend themes',
    ],
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    route: '/projects',
    icon: 'Folder',
    description: 'Project portfolio and case studies',
    suggestedPrompts: [
      { label: 'Featured project', prompt: 'Tell me about your most impressive project' },
      { label: 'Tech stack', prompt: 'What technologies do you use most?' },
      { label: 'Project details', prompt: 'Can you walk me through a project in detail?' },
    ],
    contextHints: [
      'User is viewing projects',
      'They want to learn about specific work',
      'Good time to discuss case studies and technologies',
    ],
  },
  product: {
    id: 'product',
    name: 'Product',
    route: '/product',
    icon: 'Package',
    description: 'Product management and BMAD workflow',
    suggestedPrompts: [
      { label: 'Create PRD', prompt: 'Help me create a PRD for a new product idea' },
      { label: 'BMAD workflow', prompt: 'Explain the BMAD product lifecycle' },
      { label: 'Generate tickets', prompt: 'Break down this feature into user stories' },
    ],
    contextHints: [
      'User is in product management',
      'They may want to create PRDs, tickets, or manage projects',
      'BMAD workflow is available',
    ],
  },
  studio: {
    id: 'studio',
    name: 'Jamz Studio',
    route: '/studio',
    icon: 'Music',
    description: 'Music production studio',
    suggestedPrompts: [
      { label: 'Create beat', prompt: 'Help me create a lo-fi hip hop beat' },
      { label: 'Music theory', prompt: 'Explain chord progressions for ambient music' },
      { label: 'Mix advice', prompt: 'How should I mix these tracks together?' },
    ],
    contextHints: [
      'User is in the music studio',
      'They want to create or understand music',
      'Can help with production, theory, and mixing',
    ],
  },
  music: {
    id: 'music',
    name: 'Music Player',
    route: '/music',
    icon: 'Headphones',
    description: 'Music library and player',
    suggestedPrompts: [
      { label: 'Song recommendations', prompt: 'What music would you recommend for focus?' },
      { label: 'Create playlist', prompt: 'Help me create a coding playlist' },
      { label: 'Music taste', prompt: 'What kind of music does James like?' },
    ],
    contextHints: [
      'User is in the music player',
      'They want to discover or organize music',
      'Can help with recommendations and playlists',
    ],
  },
  resume: {
    id: 'resume',
    name: 'Resume',
    route: '/resume',
    icon: 'FileText',
    description: 'Professional resume and experience',
    suggestedPrompts: [
      { label: 'Work history', prompt: 'Tell me about James\'s work experience' },
      { label: 'Skills overview', prompt: 'What are James\'s core skills?' },
      { label: 'Contact info', prompt: 'How can I get in touch with James?' },
    ],
    contextHints: [
      'User is viewing the resume',
      'They want professional information',
      'Good time to discuss experience, skills, and contact',
    ],
  },
  'gallery-3d': {
    id: 'gallery-3d',
    name: '3D Gallery',
    route: '/gallery-3d',
    icon: 'Box',
    description: 'Interactive 3D image galleries',
    suggestedPrompts: [
      { label: 'Gallery types', prompt: 'What different gallery layouts are available?' },
      { label: 'Add images', prompt: 'How do I add my own images to a gallery?' },
      { label: '3D controls', prompt: 'How do I navigate the 3D view?' },
    ],
    contextHints: [
      'User is in the 3D gallery',
      'They want to view or create visual galleries',
      'Can explain controls and customization options',
    ],
  },
  avatar: {
    id: 'avatar',
    name: '3D Avatar',
    route: '/avatar',
    icon: 'User',
    description: 'Interactive 3D avatar experience',
    suggestedPrompts: [
      { label: 'Customize avatar', prompt: 'How can I customize the avatar?' },
      { label: 'Avatar tech', prompt: 'What technology powers the 3D avatar?' },
      { label: 'Interactions', prompt: 'What interactions are available?' },
    ],
    contextHints: [
      'User is viewing the 3D avatar',
      'They may want to interact or learn about it',
      'Can explain the technology and interactions',
    ],
  },
  games: {
    id: 'games',
    name: 'Games',
    route: '/games',
    icon: 'Gamepad2',
    description: 'Memory and intuition games',
    suggestedPrompts: [
      { label: 'Play memory', prompt: 'Let\'s play the memory game!' },
      { label: 'Game rules', prompt: 'How do the games work?' },
      { label: 'High scores', prompt: 'What are the high scores?' },
    ],
    contextHints: [
      'User is in the games section',
      'They want to play or learn about games',
      'Fun, casual interaction mode',
    ],
  },
  security: {
    id: 'security',
    name: 'Security',
    route: '/security',
    icon: 'Shield',
    description: 'Security monitoring dashboard',
    suggestedPrompts: [
      { label: 'Security status', prompt: 'What\'s the current security status?' },
      { label: 'Recent threats', prompt: 'Have there been any security threats?' },
      { label: 'Security features', prompt: 'What security features are in place?' },
    ],
    contextHints: [
      'User is in the security dashboard',
      'Admin/owner context likely',
      'Can discuss security monitoring and threats',
    ],
  },
  humans: {
    id: 'humans',
    name: 'Humans',
    route: '/humans',
    icon: 'Users',
    description: 'People search and connections',
    suggestedPrompts: [
      { label: 'Search people', prompt: 'Help me search for someone' },
      { label: 'Network', prompt: 'Who is in the professional network?' },
      { label: 'Connections', prompt: 'How do I add connections?' },
    ],
    contextHints: [
      'User is in the people/humans app',
      'They want to search or learn about connections',
      'Can help with search and networking',
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
// Utility: Format context for Claw AI
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
