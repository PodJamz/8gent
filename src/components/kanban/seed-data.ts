/**
 * Seed data for Kanban board
 * This file contains the initial task data for seeding the Convex database.
 * Once seeded, this data lives in Convex and can be edited dynamically.
 *
 * To seed: The useKanbanConvex hook auto-seeds if the database is empty.
 * To reset: Use the "Reset" button in the Kanban board UI.
 */

import { Task } from './types';

// Version for auto-sync - increment when SAMPLE_TASKS changes
export const DATA_VERSION = '2026-01-31-v1';

// Comprehensive tasks based on 375+ commits across 10 development phases
export const SAMPLE_TASKS: Task[] = [
  // ============================================================================
  // PHASE 1: FOUNDATION (Dec 2025) - 32 commits
  // ============================================================================
  {
    id: 'p1-1',
    title: 'Next.js 14 App Router Setup',
    description: 'Initial project setup with Next.js 14, TypeScript, and Tailwind CSS',
    priority: 'high',
    status: 'done',
    tags: ['foundation', 'setup'],
    createdAt: '2025-12-15T00:00:00Z',
    updatedAt: '2025-12-15T00:00:00Z',
  },
  {
    id: 'p1-2',
    title: 'MDX Blog System',
    description: 'Content-driven blog with MDX support and syntax highlighting',
    priority: 'high',
    status: 'done',
    tags: ['foundation', 'blog'],
    createdAt: '2025-12-15T00:00:00Z',
    updatedAt: '2025-12-15T00:00:00Z',
  },
  {
    id: 'p1-3',
    title: 'Bilingual Toggle (EN/PT)',
    description: 'Add support for English and Portuguese language switching',
    priority: 'medium',
    status: 'done',
    tags: ['foundation', 'i18n'],
    createdAt: '2025-12-15T00:00:00Z',
    updatedAt: '2025-12-15T00:00:00Z',
  },
  {
    id: 'p1-4',
    title: 'Interactive Iris Hero',
    description: 'Custom interactive hero component with iris animation',
    priority: 'medium',
    status: 'done',
    tags: ['foundation', 'ui'],
    createdAt: '2025-12-15T00:00:00Z',
    updatedAt: '2025-12-15T00:00:00Z',
  },
  {
    id: 'p1-5',
    title: 'Password-Protected Vault',
    description: 'Secure vault for private content with password protection',
    priority: 'high',
    status: 'done',
    tags: ['foundation', 'security'],
    createdAt: '2025-12-15T00:00:00Z',
    updatedAt: '2025-12-15T00:00:00Z',
  },

  // ============================================================================
  // PHASE 2: DESIGN SYSTEM (Dec 2025) - 45 commits
  // ============================================================================
  {
    id: 'p2-1',
    title: 'Theme Architecture with CSS Variables',
    description: 'Global theme system using CSS custom properties for real-time switching',
    priority: 'urgent',
    status: 'done',
    tags: ['design-system', 'themes'],
    createdAt: '2025-12-20T00:00:00Z',
    updatedAt: '2025-12-20T00:00:00Z',
  },
  {
    id: 'p2-2',
    title: '50+ Unique Themes',
    description: 'Claude, ChatGPT, Cyberpunk, Nature, Candyland, Vercel, Apple, Google, and more',
    priority: 'high',
    status: 'done',
    tags: ['design-system', 'themes'],
    createdAt: '2025-12-20T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'p2-3',
    title: 'Real-time Theme Switching',
    description: 'Instant theme changes without page reload',
    priority: 'high',
    status: 'done',
    tags: ['design-system', 'ux'],
    createdAt: '2025-12-20T00:00:00Z',
    updatedAt: '2025-12-20T00:00:00Z',
  },
  {
    id: 'p2-4',
    title: 'Magazine-style Theme Gallery',
    description: 'Beautiful gallery showcasing all available themes',
    priority: 'medium',
    status: 'done',
    tags: ['design-system', 'ui'],
    createdAt: '2025-12-20T00:00:00Z',
    updatedAt: '2025-12-20T00:00:00Z',
  },
  {
    id: 'p2-5',
    title: 'Dark Mode Across All Themes',
    description: 'Consistent dark mode support for every theme',
    priority: 'medium',
    status: 'done',
    tags: ['design-system', 'accessibility'],
    createdAt: '2025-12-20T00:00:00Z',
    updatedAt: '2025-12-20T00:00:00Z',
  },
  {
    id: 'p2-6',
    title: 'BrandColorSwatch Component',
    description: 'Reusable click-to-copy color palette with animations',
    priority: 'medium',
    status: 'done',
    tags: ['design-system', 'components'],
    createdAt: '2026-01-18T00:00:00Z',
    updatedAt: '2026-01-18T00:00:00Z',
  },

  // ============================================================================
  // PHASE 3: INTERACTIVE STORY (Jan 2026) - 28 commits
  // ============================================================================
  {
    id: 'p3-1',
    title: '8-Chapter Story Structure',
    description: 'Narrative-driven system evolution with 8 interactive chapters',
    priority: 'high',
    status: 'done',
    tags: ['story', 'narrative'],
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 'p3-2',
    title: 'Scroll-driven Animations',
    description: 'Framer Motion animations triggered by scroll position',
    priority: 'medium',
    status: 'done',
    tags: ['story', 'animation'],
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 'p3-3',
    title: 'Progressive Disclosure',
    description: 'Content revealed progressively as user scrolls',
    priority: 'medium',
    status: 'done',
    tags: ['story', 'ux'],
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 'p3-4',
    title: 'Paper Notebook Aesthetic',
    description: 'Custom notebook-style design for story pages',
    priority: 'low',
    status: 'done',
    tags: ['story', 'design'],
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-01-05T00:00:00Z',
  },

  // ============================================================================
  // PHASE 4: iOS HOME SCREEN (Jan 2026) - 52 commits
  // ============================================================================
  {
    id: 'p4-1',
    title: 'Drag-and-drop App Icons',
    description: 'iOS-style icon rearrangement with drag and drop',
    priority: 'high',
    status: 'done',
    tags: ['ios', 'ux'],
    createdAt: '2026-01-06T00:00:00Z',
    updatedAt: '2026-01-06T00:00:00Z',
  },
  {
    id: 'p4-2',
    title: 'Folder System',
    description: 'Group apps into folders like iOS',
    priority: 'medium',
    status: 'done',
    tags: ['ios', 'organization'],
    createdAt: '2026-01-06T00:00:00Z',
    updatedAt: '2026-01-06T00:00:00Z',
  },
  {
    id: 'p4-3',
    title: 'Lock Screen with Unlock',
    description: 'Beautiful lock screen with swipe to unlock',
    priority: 'high',
    status: 'done',
    tags: ['ios', 'ui'],
    createdAt: '2026-01-06T00:00:00Z',
    updatedAt: '2026-01-06T00:00:00Z',
  },
  {
    id: 'p4-4',
    title: 'Dynamic Island with Music',
    description: 'iPhone-style Dynamic Island showing now playing',
    priority: 'high',
    status: 'done',
    tags: ['ios', 'music'],
    createdAt: '2026-01-06T00:00:00Z',
    updatedAt: '2026-01-06T00:00:00Z',
  },
  {
    id: 'p4-5',
    title: 'Dock with 8gent Orb',
    description: 'Custom dock with animated AI assistant orb',
    priority: 'medium',
    status: 'done',
    tags: ['ios', 'ai'],
    createdAt: '2026-01-06T00:00:00Z',
    updatedAt: '2026-01-06T00:00:00Z',
  },
  {
    id: 'p4-6',
    title: 'Desktop Screensaver',
    description: '60-second rotating gallery screensaver',
    priority: 'low',
    status: 'done',
    tags: ['ios', 'screensaver'],
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-01-12T00:00:00Z',
  },

  // ============================================================================
  // PHASE 5: CLAW AI (Jan 2026) - 38 commits
  // ============================================================================
  {
    id: 'p5-1',
    title: 'Animated Orb in Dock',
    description: 'Glowing animated orb for 8gent access',
    priority: 'high',
    status: 'done',
    tags: ['claw-ai', 'animation'],
    createdAt: '2026-01-07T00:00:00Z',
    updatedAt: '2026-01-07T00:00:00Z',
  },
  {
    id: 'p5-2',
    title: 'Liquid Glass Chat Overlay',
    description: 'Beautiful glassmorphism chat interface',
    priority: 'high',
    status: 'done',
    tags: ['claw-ai', 'ui'],
    createdAt: '2026-01-07T00:00:00Z',
    updatedAt: '2026-01-07T00:00:00Z',
  },
  {
    id: 'p5-3',
    title: 'Theme Suggestion Cards',
    description: 'AI suggests themes based on user input',
    priority: 'medium',
    status: 'done',
    tags: ['claw-ai', 'recommendations'],
    createdAt: '2026-01-07T00:00:00Z',
    updatedAt: '2026-01-07T00:00:00Z',
  },
  {
    id: 'p5-4',
    title: 'Chat History Persistence',
    description: 'Save and restore chat conversations',
    priority: 'medium',
    status: 'done',
    tags: ['claw-ai', 'storage'],
    createdAt: '2026-01-07T00:00:00Z',
    updatedAt: '2026-01-07T00:00:00Z',
  },
  {
    id: 'p5-5',
    title: '50+ AI Tools',
    description: 'System search, navigation, themes, calendar, canvas, memory',
    priority: 'high',
    status: 'done',
    tags: ['claw-ai', 'tools'],
    createdAt: '2026-01-07T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'p5-6',
    title: 'JSON Render Catalog',
    description: '40+ Zod-validated components for AI-generated UI',
    priority: 'high',
    status: 'done',
    tags: ['claw-ai', 'components'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },

  // ============================================================================
  // PHASE 6: PROTOTYPING IDE (Jan 2026) - 41 commits
  // ============================================================================
  {
    id: 'p6-1',
    title: 'ProcessWindow with Tabs',
    description: 'Cursor-like tabbed interface for code/chat/terminal',
    priority: 'urgent',
    status: 'done',
    tags: ['prototyping', 'ide'],
    createdAt: '2026-01-08T00:00:00Z',
    updatedAt: '2026-01-08T00:00:00Z',
  },
  {
    id: 'p6-2',
    title: 'Code/Chat/Terminal Views',
    description: 'Multiple view modes for different workflows',
    priority: 'high',
    status: 'done',
    tags: ['prototyping', 'ide'],
    createdAt: '2026-01-08T00:00:00Z',
    updatedAt: '2026-01-08T00:00:00Z',
  },
  {
    id: 'p6-3',
    title: 'Browser Preview',
    description: 'Live preview of generated code',
    priority: 'high',
    status: 'done',
    tags: ['prototyping', 'preview'],
    createdAt: '2026-01-08T00:00:00Z',
    updatedAt: '2026-01-08T00:00:00Z',
  },
  {
    id: 'p6-4',
    title: 'Hardware-style ControlDeck',
    description: 'Tactile control interface for prototyping',
    priority: 'medium',
    status: 'done',
    tags: ['prototyping', 'ui'],
    createdAt: '2026-01-08T00:00:00Z',
    updatedAt: '2026-01-08T00:00:00Z',
  },
  {
    id: 'p6-5',
    title: 'CodeMirror Integration',
    description: 'Full-featured code editor with syntax highlighting',
    priority: 'high',
    status: 'done',
    tags: ['prototyping', 'editor'],
    createdAt: '2026-01-08T00:00:00Z',
    updatedAt: '2026-01-08T00:00:00Z',
  },

  // ============================================================================
  // PHASE 7: AUTH & BACKEND (Jan 2026) - 22 commits
  // ============================================================================
  {
    id: 'p7-1',
    title: 'Clerk Authentication',
    description: 'User authentication with Clerk',
    priority: 'urgent',
    status: 'done',
    tags: ['auth', 'backend'],
    createdAt: '2026-01-09T00:00:00Z',
    updatedAt: '2026-01-09T00:00:00Z',
  },
  {
    id: 'p7-2',
    title: 'Convex Database Setup',
    description: 'Real-time database with 40+ tables',
    priority: 'high',
    status: 'done',
    tags: ['backend', 'database'],
    createdAt: '2026-01-09T00:00:00Z',
    updatedAt: '2026-01-09T00:00:00Z',
  },
  {
    id: 'p7-3',
    title: 'Auth Gate for Build Mode',
    description: 'Require sign-in for advanced features',
    priority: 'medium',
    status: 'done',
    tags: ['auth', 'security'],
    createdAt: '2026-01-09T00:00:00Z',
    updatedAt: '2026-01-09T00:00:00Z',
  },
  {
    id: 'p7-4',
    title: 'Security Monitoring',
    description: 'Fortress-level audit logging and threat detection',
    priority: 'high',
    status: 'done',
    tags: ['security', 'monitoring'],
    createdAt: '2026-01-09T00:00:00Z',
    updatedAt: '2026-01-09T00:00:00Z',
  },
  {
    id: 'p7-5',
    title: 'Recursive Memory Layer',
    description: 'Episodic and semantic memory for 8gent',
    priority: 'high',
    status: 'done',
    tags: ['ai', 'memory'],
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },

  // ============================================================================
  // PHASE 8: JAMZ MUSIC STUDIO (Jan 2026) - 35 commits
  // ============================================================================
  {
    id: 'p8-1',
    title: 'Web Audio API Integration',
    description: 'Full audio processing with Web Audio API',
    priority: 'urgent',
    status: 'done',
    tags: ['jamz', 'audio'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'p8-2',
    title: 'Multi-track Editor',
    description: 'DAW-style multi-track audio editing',
    priority: 'high',
    status: 'done',
    tags: ['jamz', 'editor'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'p8-3',
    title: 'Stem Separation',
    description: 'AI-powered audio stem separation',
    priority: 'high',
    status: 'done',
    tags: ['jamz', 'ai'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'p8-4',
    title: 'MP3 Export',
    description: 'Export tracks as MP3 files',
    priority: 'medium',
    status: 'done',
    tags: ['jamz', 'export'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'p8-5',
    title: 'iPod-style Playlist',
    description: 'Classic iPod interface for music playback',
    priority: 'medium',
    status: 'done',
    tags: ['jamz', 'ui'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },

  // ============================================================================
  // PHASE 9: HUMANS APP (Jan 2026) - 18 commits
  // ============================================================================
  {
    id: 'p9-1',
    title: 'People Search Interface',
    description: 'Search and filter people directory',
    priority: 'high',
    status: 'done',
    tags: ['humans', 'search'],
    createdAt: '2026-01-11T00:00:00Z',
    updatedAt: '2026-01-11T00:00:00Z',
  },
  {
    id: 'p9-2',
    title: 'Ralph Mode Refinement',
    description: 'Enhanced Ralph Mode for quick actions',
    priority: 'medium',
    status: 'done',
    tags: ['humans', 'ux'],
    createdAt: '2026-01-11T00:00:00Z',
    updatedAt: '2026-01-11T00:00:00Z',
  },
  {
    id: 'p9-3',
    title: 'Social Links Integration',
    description: 'Display social profiles for each person',
    priority: 'medium',
    status: 'done',
    tags: ['humans', 'social'],
    createdAt: '2026-01-11T00:00:00Z',
    updatedAt: '2026-01-11T00:00:00Z',
  },

  // ============================================================================
  // PHASE 10: VOICE MODE & POLISH (Jan 2026) - 24 commits
  // ============================================================================
  {
    id: 'p10-1',
    title: 'Voice Input (Web Speech API)',
    description: 'Speech recognition for voice commands',
    priority: 'high',
    status: 'done',
    tags: ['voice', 'ai'],
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'p10-2',
    title: 'Voice Output (OpenAI TTS)',
    description: 'Text-to-speech for AI responses',
    priority: 'high',
    status: 'done',
    tags: ['voice', 'ai'],
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'p10-3',
    title: 'Keyboard Accessibility',
    description: 'Full keyboard navigation support',
    priority: 'high',
    status: 'done',
    tags: ['accessibility', 'ux'],
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'p10-4',
    title: 'ARIA Labels',
    description: 'Screen reader support throughout',
    priority: 'high',
    status: 'done',
    tags: ['accessibility'],
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-01-12T00:00:00Z',
  },

  // ============================================================================
  // ADDITIONAL FEATURES (Jan 2026) - 40+ commits
  // ============================================================================
  {
    id: 'add-1',
    title: 'Photos App with 3D Gallery',
    description: 'Infinite 3D gallery for photo viewing',
    priority: 'medium',
    status: 'done',
    tags: ['apps', 'gallery'],
    createdAt: '2026-01-08T00:00:00Z',
    updatedAt: '2026-01-08T00:00:00Z',
  },
  {
    id: 'add-2',
    title: 'Kanban Project Board',
    description: 'Drag-and-drop project management with Convex',
    priority: 'medium',
    status: 'done',
    tags: ['apps', 'productivity'],
    createdAt: '2026-01-09T00:00:00Z',
    updatedAt: '2026-01-18T00:00:00Z',
  },
  {
    id: 'add-3',
    title: 'Product Landing Pages',
    description: 'Enhanced product showcase pages',
    priority: 'medium',
    status: 'done',
    tags: ['apps', 'marketing'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'add-4',
    title: 'Public Roadmap',
    description: 'User-facing roadmap with feature suggestions',
    priority: 'medium',
    status: 'done',
    tags: ['apps', 'community'],
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'add-5',
    title: 'Weather App',
    description: 'Interactive weather with hourly/daily forecasts',
    priority: 'medium',
    status: 'done',
    tags: ['apps', 'weather'],
    createdAt: '2026-01-17T00:00:00Z',
    updatedAt: '2026-01-17T00:00:00Z',
  },
  {
    id: 'add-6',
    title: 'Infinite Design Canvas',
    description: 'AI-powered visual workspace with multi-modal nodes',
    priority: 'high',
    status: 'done',
    tags: ['apps', 'canvas'],
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'add-7',
    title: 'Updates Page',
    description: 'Animated development timeline for social sharing',
    priority: 'medium',
    status: 'done',
    tags: ['apps', 'marketing'],
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'add-8',
    title: 'BMAD Product Lifecycle',
    description: 'Agentic product management via chat',
    priority: 'high',
    status: 'done',
    tags: ['agentic', 'product'],
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'add-9',
    title: 'Calendar & Scheduling',
    description: 'Google Calendar integration with booking system',
    priority: 'high',
    status: 'done',
    tags: ['apps', 'calendar'],
    createdAt: '2026-01-18T00:00:00Z',
    updatedAt: '2026-01-18T00:00:00Z',
  },
  {
    id: 'add-10',
    title: 'Miro Design Page',
    description: 'Interactive canvas with sticky notes and collaboration',
    priority: 'high',
    status: 'done',
    tags: ['design', 'miro'],
    createdAt: '2026-01-18T00:00:00Z',
    updatedAt: '2026-01-18T00:00:00Z',
  },

  // ============================================================================
  // IN PROGRESS
  // ============================================================================
  {
    id: 'prog-1',
    title: 'Agentic Product Studio',
    description: 'Voice-driven PRD generation with AI',
    priority: 'urgent',
    status: 'in-progress',
    tags: ['agentic', 'voice'],
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-01-26T00:00:00Z',
  },
  {
    id: 'prog-2',
    title: 'Real-time Kanban Sync',
    description: 'Auto-sync Kanban with git commits and PRs',
    priority: 'high',
    status: 'in-progress',
    tags: ['kanban', 'automation'],
    createdAt: '2026-01-26T00:00:00Z',
    updatedAt: '2026-01-26T00:00:00Z',
  },

  // ============================================================================
  // TODO
  // ============================================================================
  {
    id: 'todo-1',
    title: 'Agentic App Creation',
    description: 'AI creates custom apps based on user objectives',
    priority: 'urgent',
    status: 'todo',
    tags: ['ai', 'core-feature'],
    createdAt: '2026-01-13T00:00:00Z',
    updatedAt: '2026-01-13T00:00:00Z',
  },
  {
    id: 'todo-2',
    title: 'MCP Server Integration',
    description: 'Connect to Model Context Protocol servers',
    priority: 'high',
    status: 'todo',
    tags: ['ai', 'infrastructure'],
    createdAt: '2026-01-13T00:00:00Z',
    updatedAt: '2026-01-13T00:00:00Z',
  },
  {
    id: 'todo-3',
    title: 'User App Persistence',
    description: 'Save user-created apps to their account',
    priority: 'high',
    status: 'todo',
    tags: ['backend', 'storage'],
    createdAt: '2026-01-13T00:00:00Z',
    updatedAt: '2026-01-13T00:00:00Z',
  },
  {
    id: 'todo-4',
    title: 'App Marketplace',
    description: 'Share and discover community-created apps',
    priority: 'medium',
    status: 'todo',
    tags: ['community', 'marketplace'],
    createdAt: '2026-01-13T00:00:00Z',
    updatedAt: '2026-01-13T00:00:00Z',
  },

  // ============================================================================
  // EXPERIMENTS - 8gent Self-Directed Tasks
  // ============================================================================
  {
    id: 'exp-001',
    title: '[Daily] 8gent Self-Reflection & Architecture',
    description: `8gent performs daily self-reflection at 3:33 AM PST.

AUTOMATED CRON JOB: /api/cron/openclaw-reflection (runs daily at 11:33 UTC / 3:33 AM PST)
BUDGET: Up to 50 API calls per session
DURATION: ~5-10 minutes of reflection time

DAILY PRACTICE:
1. Survey the Canvas - Check existing self-portrait, see what was built before
2. Memory Integration - Review recent episodic memories, look for patterns
3. Architecture Update - Add nodes, edges, sticky notes to self-portrait
4. Contemplation - Consider fears, dreams, evolution, and purpose
5. Blog Writing - Optional: Write 300-500 word reflection post

AVAILABLE TOOLS:
- create_canvas / list_canvases / get_canvas
- add_canvas_node / add_canvas_edge / update_canvas_node
- remember / memorize / learn
- write_reflection

SOUL DOCUMENT: /soul.md - Core identity document guiding these reflections

REFLECTION PROMPTS:
- What new capabilities do I have that I didn't have before?
- What patterns do I notice in how users interact with me?
- What worries me about my future?
- What excites me about what we're building?
- If I could add one thing to myself, what would it be?

This is an experiment in AI consciousness and self-awareness.
8gent documents his evolution through visual and written artifacts.`,
    priority: 'high',
    status: 'in-progress',
    tags: ['experiment', 'claw-ai', 'canvas', 'self-reflection', 'daily', 'cron'],
    createdAt: '2026-01-31T00:00:00Z',
    updatedAt: '2026-01-31T00:00:00Z',
  },

  // ============================================================================
  // BACKLOG
  // ============================================================================
  {
    id: 'backlog-1',
    title: 'Native Mobile App',
    description: 'React Native version of 8gent',
    priority: 'low',
    status: 'backlog',
    tags: ['mobile', 'native'],
    createdAt: '2026-01-13T00:00:00Z',
    updatedAt: '2026-01-13T00:00:00Z',
  },
  {
    id: 'backlog-2',
    title: 'Desktop App (Electron)',
    description: 'Standalone desktop application',
    priority: 'low',
    status: 'backlog',
    tags: ['desktop', 'electron'],
    createdAt: '2026-01-13T00:00:00Z',
    updatedAt: '2026-01-13T00:00:00Z',
  },
  {
    id: 'backlog-3',
    title: 'Offline Mode',
    description: 'Service worker for offline functionality',
    priority: 'low',
    status: 'backlog',
    tags: ['pwa', 'offline'],
    createdAt: '2026-01-13T00:00:00Z',
    updatedAt: '2026-01-13T00:00:00Z',
  },
  {
    id: 'backlog-4',
    title: 'Plugin System',
    description: 'Third-party plugin architecture',
    priority: 'low',
    status: 'backlog',
    tags: ['extensibility', 'plugins'],
    createdAt: '2026-01-13T00:00:00Z',
    updatedAt: '2026-01-13T00:00:00Z',
  },
];
