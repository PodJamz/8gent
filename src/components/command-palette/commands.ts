import type { Command, CommandGroup } from './types';
import { themes } from '@/lib/themes';

// =============================================================================
// ALL APPS - Synced with HomeScreenContext
// =============================================================================
const apps = [
  // Core/Entry apps
  { id: 'story', name: 'Story', href: '/story', keywords: ['about', 'james', 'intro'] },
  { id: 'blog', name: 'Blog', href: '/blog', keywords: ['posts', 'writing', 'articles'] },
  { id: 'design', name: 'Design', href: '/design', keywords: ['themes', 'ui', 'styles'] },
  { id: 'resume', name: 'Resume', href: '/resume', keywords: ['cv', 'experience', 'work'] },

  // Action/Create apps
  { id: 'music', name: 'Music', href: '/music', keywords: ['songs', 'audio', 'player'] },
  { id: 'jamz', name: 'Jamz', href: '/studio', keywords: ['studio', 'production', 'beats'] },
  { id: 'prototyping', name: 'Prototyping', href: '/prototyping', keywords: ['ide', 'code', 'editor'] },
  { id: 'notes', name: 'Notes', href: '/notes', keywords: ['writing', 'text', 'memo'] },
  { id: 'cowrite', name: 'Cowrite', href: '/cowrite', keywords: ['ai', 'writing', 'assistant'] },
  { id: 'canvas', name: 'Canvas', href: '/canvas', keywords: ['draw', 'sketch', 'whiteboard', 'infinite', 'moodboard'] },
  { id: 'product', name: 'Product', href: '/product', keywords: ['prd', 'management', 'planning'] },
  { id: 'projects', name: 'Projects', href: '/projects', keywords: ['kanban', 'board', 'tasks'] },
  { id: 'mockit', name: 'Mockit', href: '/mockit', keywords: ['mockup', 'prototype', 'design'] },

  // Work/Hire apps
  { id: 'humans', name: 'Humans', href: '/humans', keywords: ['people', 'contacts', 'search', 'entities'] },
  { id: 'activity', name: 'Activity', href: '/activity', keywords: ['log', 'history', 'events'] },
  { id: 'calendar', name: 'Calendar', href: '/calendar', keywords: ['schedule', 'events', 'booking'] },
  { id: 'contacts', name: 'Contacts', href: '/contacts', keywords: ['people', 'address', 'book'] },

  // Explore/Depth apps
  { id: 'photos', name: 'Photos', href: '/photos', keywords: ['images', 'gallery', 'pictures'] },
  { id: 'inspirations', name: 'Inspirations', href: '/inspirations', keywords: ['ideas', 'references', 'mood'] },
  { id: '3d-gallery', name: '3-D Gallery', href: '/gallery-3d', keywords: ['three', 'dimensional', 'webgl'] },
  { id: 'avatar', name: 'Avatar', href: '/avatar', keywords: ['3d', 'profile', 'character', 'interactive'] },
  { id: 'way', name: 'Way', href: 'https://way-lovat.vercel.app/', external: true, keywords: ['navigation', 'path'] },

  // Theme showcases
  { id: 'claude', name: 'Claude Theme', href: '/design/claude', keywords: ['anthropic', 'ai', 'orange'] },
  { id: 'chatgpt', name: 'ChatGPT Theme', href: '/design/chatgpt', keywords: ['openai', 'green'] },
  { id: 'utilitarian', name: 'Utilitarian', href: '/design/utilitarian', keywords: ['orange', 'minimal'] },
  { id: 'vercel', name: 'Vercel Theme', href: '/design/vercel', keywords: ['black', 'dark'] },
  { id: 'neo-brutalism', name: 'Neo Brutalism', href: '/design/neo-brutalism', keywords: ['yellow', 'bold'] },
  { id: 'notebook', name: 'Notebook', href: '/design/notebook', keywords: ['paper', 'handwritten'] },
  { id: 'tao', name: 'Tao', href: '/design/tao', keywords: ['zen', 'calm', 'blue'] },
  { id: 'research', name: 'Research', href: '/design/research', keywords: ['academic', 'paper'] },
  { id: 'field-guide', name: 'Field Guide', href: '/design/field-guide', keywords: ['nature', 'red'] },
  { id: 'google', name: 'Google Theme', href: '/design/google', keywords: ['material', 'colorful'] },
  { id: 'apple', name: 'Apple Theme', href: '/design/apple', keywords: ['ios', 'clean'] },
  { id: 'microsoft', name: 'Microsoft Theme', href: '/design/microsoft', keywords: ['fluent', 'windows'] },
  { id: 'notion', name: 'Notion Theme', href: '/design/notion', keywords: ['productivity', 'minimal'] },
  { id: 'cursor', name: 'Cursor Theme', href: '/design/cursor', keywords: ['ide', 'code', 'purple'] },
  { id: 'miro', name: 'Miro Theme', href: '/design/miro', keywords: ['collaboration', 'yellow'] },

  // Social/Connect apps
  { id: 'github', name: 'GitHub', href: 'https://github.com/PodJamz', external: true, keywords: ['code', 'repos'] },
  { id: 'linkedin', name: 'LinkedIn', href: 'https://www.linkedin.com/in/jameslawrencespalding/', external: true, keywords: ['professional', 'network'] },
  { id: 'x', name: 'X (Twitter)', href: 'https://x.com/James__Spalding', external: true, keywords: ['twitter', 'social'] },

  // Vibes/Fun apps
  { id: 'weather', name: 'Weather', href: '/weather', keywords: ['forecast', 'temperature'] },
  { id: 'games', name: 'Games', href: '/games', keywords: ['play', 'fun', 'memory'] },
  { id: 'terminal', name: 'Terminal', href: '/terminal', keywords: ['cli', 'command', 'shell'] },
  { id: 'reels', name: 'Reels', href: '/reels', keywords: ['videos', 'clips', 'shorts'] },

  // Neurodiversity apps
  { id: 'regulation', name: 'Regulate', href: '/regulate', keywords: ['calm', 'breathing', 'adhd', 'neuro'] },
  { id: 'journal', name: 'Journal', href: '/journal', keywords: ['diary', 'writing', 'reflection', 'neuro'] },
  { id: 'food', name: 'Food', href: '/food', keywords: ['meals', 'nutrition', 'eating', 'neuro'] },
  { id: 'sidequests', name: 'Side Quests', href: '/sidequests', keywords: ['tasks', 'adhd', 'dopamine', 'neuro'] },
  { id: 'hyperfocus', name: 'Hyperfocus', href: '/hyperfocus', keywords: ['focus', 'flow', 'adhd', 'neuro'] },
  { id: 'bubble-timer', name: 'Bubble Timer', href: '/neuro/bubble-timer', keywords: ['timer', 'visual', 'countdown', 'neuro', 'adhd'] },

  // System apps
  { id: 'skills', name: 'Skills', href: '/skills', keywords: ['abilities', 'expertise'] },
  { id: 'system', name: 'System', href: '/system', keywords: ['info', 'status', 'about'] },
  { id: 'security', name: 'Security', href: '/security', keywords: ['admin', 'monitoring', 'fortress', 'logs'] },
  { id: 'vault', name: 'Vault', href: '/vault', keywords: ['private', 'protected', 'secret'] },
  { id: 'threads', name: 'Threads', href: '/threads', keywords: ['conversations', 'chat', 'history'] },
  { id: 'settings', name: 'Settings', href: '/settings', keywords: ['preferences', 'config', 'options'] },
  { id: 'search', name: 'Search', href: '/search', keywords: ['find', 'lookup', 'query'] },
  { id: 'reminders', name: 'Reminders', href: '/reminders', keywords: ['todos', 'alerts', 'notifications'] },
  { id: 'memory', name: 'Memory', href: '/memory', keywords: ['brain', 'recall', 'ai', 'learning'] },

  // Wiki/Docs
  { id: 'wiki', name: 'Wiki', href: '/wiki', keywords: ['docs', 'documentation', 'help'] },
  { id: 'watch', name: 'Watch', href: '/watch', keywords: ['video', 'stream', 'media'] },

  // Chat
  { id: 'chat', name: 'Chat', href: '/chat', keywords: ['ai', 'james', 'assistant', 'talk'] },
];

// Convert apps to commands
export const appCommands: Command[] = apps.map((app) => ({
  id: `app-${app.id}`,
  type: 'app' as const,
  name: app.name,
  description: `Open ${app.name}`,
  keywords: [app.id, app.name.toLowerCase(), ...(app.keywords || [])],
  href: app.href,
  external: app.external,
}));

// Convert themes to commands
export const themeCommands: Command[] = themes.map((theme) => ({
  id: `theme-${theme.name}`,
  type: 'theme' as const,
  name: theme.label,
  description: `Switch to ${theme.label} theme`,
  keywords: [theme.name, theme.label.toLowerCase()],
}));

// System actions
export const actionCommands: Command[] = [
  {
    id: 'action-toggle-dark',
    type: 'action',
    name: 'Toggle Dark Mode',
    description: 'Switch between light and dark mode',
    keywords: ['dark', 'light', 'mode', 'theme', 'toggle'],
    shortcut: 'D',
  },
  {
    id: 'action-go-home',
    type: 'action',
    name: 'Go Home',
    description: 'Return to the home screen',
    keywords: ['home', 'desktop', 'main'],
    href: '/',
    shortcut: 'H',
  },
  {
    id: 'action-open-settings',
    type: 'action',
    name: 'Open Settings',
    description: 'Open OpenClaw-OS settings',
    keywords: ['settings', 'preferences', 'config'],
    href: '/settings',
    shortcut: 'S',
  },
  {
    id: 'action-open-projects',
    type: 'action',
    name: 'View Projects',
    description: 'Open the Kanban project board',
    keywords: ['projects', 'kanban', 'board', 'tasks'],
    href: '/projects',
    shortcut: 'P',
  },
  {
    id: 'action-open-canvas',
    type: 'action',
    name: 'Open Canvas',
    description: 'Open the infinite design canvas',
    keywords: ['canvas', 'design', 'draw', 'sketch', 'whiteboard', 'infinite', 'moodboard', 'wireframe'],
    href: '/canvas',
    shortcut: 'C',
  },
  {
    id: 'action-open-chat',
    type: 'action',
    name: 'Chat with Claw AI',
    description: 'Open the AI assistant',
    keywords: ['ai', 'james', 'chat', 'assistant', 'help', 'ask'],
    href: '/chat',
    shortcut: 'J',
  },
  {
    id: 'action-open-humans',
    type: 'action',
    name: 'Search People',
    description: 'Search for people and entities',
    keywords: ['humans', 'people', 'contacts', 'search', 'entities'],
    href: '/humans',
  },
  {
    id: 'action-open-memories',
    type: 'action',
    name: 'View Memories',
    description: 'Browse AI memory and learning',
    keywords: ['memories', 'brain', 'learning', 'recall'],
    href: '/memory',
  },
  {
    id: 'action-reset-home',
    type: 'action',
    name: 'Reset Home Screen',
    description: 'Reset home screen to default layout',
    keywords: ['reset', 'default', 'home', 'layout'],
  },
];

// Wiki documentation commands
export const wikiCommands: Command[] = [
  {
    id: 'wiki-home',
    type: 'wiki',
    name: 'Wiki Home',
    description: 'Documentation home',
    keywords: ['wiki', 'docs', 'documentation', 'home'],
    href: '/wiki',
  },
  {
    id: 'wiki-philosophy',
    type: 'wiki',
    name: 'Philosophy',
    description: 'Vision, manifesto, and design principles',
    keywords: ['philosophy', 'vision', 'manifesto', 'principles', 'bet'],
    href: '/wiki/philosophy',
  },
  {
    id: 'wiki-getting-started',
    type: 'wiki',
    name: 'Getting Started',
    description: 'Onboarding, setup, and architecture overview',
    keywords: ['getting', 'started', 'setup', 'onboarding', 'install'],
    href: '/wiki/getting-started',
  },
  {
    id: 'wiki-architecture',
    type: 'wiki',
    name: 'Architecture',
    description: 'Technical architecture and system design',
    keywords: ['architecture', 'technical', 'system', 'design', 'patterns'],
    href: '/wiki/architecture',
  },
  {
    id: 'wiki-features',
    type: 'wiki',
    name: 'Features',
    description: 'Feature documentation and PRDs',
    keywords: ['features', 'prd', 'product', 'specs'],
    href: '/wiki/features',
  },
  {
    id: 'wiki-roadmap',
    type: 'wiki',
    name: 'Roadmap',
    description: 'Future plans and proposals',
    keywords: ['roadmap', 'future', 'plans', 'proposals'],
    href: '/wiki/roadmap',
  },
  {
    id: 'wiki-completed',
    type: 'wiki',
    name: 'Completed Work',
    description: 'Archive of shipped features',
    keywords: ['completed', 'shipped', 'done', 'archive', 'history'],
    href: '/wiki/completed',
  },
  {
    id: 'wiki-attributions',
    type: 'wiki',
    name: 'Attributions',
    description: 'Open source credits and inspirations',
    keywords: ['attributions', 'credits', 'inspirations', 'thanks', 'open source'],
    href: '/wiki/attributions',
  },
];

// All commands combined
export const allCommands: Command[] = [
  ...appCommands,
  ...themeCommands,
  ...actionCommands,
  ...wikiCommands,
];

// Grouped commands for display
export const commandGroups: CommandGroup[] = [
  {
    id: 'apps',
    name: 'Apps',
    commands: appCommands,
  },
  {
    id: 'themes',
    name: 'Themes',
    commands: themeCommands,
  },
  {
    id: 'actions',
    name: 'Actions',
    commands: actionCommands,
  },
  {
    id: 'wiki',
    name: 'Wiki',
    commands: wikiCommands,
  },
];

// Get command by ID
export function getCommandById(id: string): Command | undefined {
  return allCommands.find((cmd) => cmd.id === id);
}

// Get commands by type
export function getCommandsByType(type: Command['type']): Command[] {
  return allCommands.filter((cmd) => cmd.type === type);
}
