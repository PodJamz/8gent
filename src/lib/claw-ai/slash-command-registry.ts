/**
 * Slash Command Registry - Comprehensive command system for Claw AI Chat
 *
 * Exposes all tools, skills, dimensions, and context as / commands and @ references
 */

import {
  Search,
  Compass,
  Calendar,
  FileText,
  Brain,
  Code,
  Layers,
  Palette,
  Music,
  Terminal,
  GitBranch,
  MessageSquare,
  Video,
  Zap,
  Settings,
  HelpCircle,
  Sparkles,
  Target,
  Clock,
  LayoutGrid,
  Table,
  LineChart,
  List,
  Users,
  BookOpen,
  Shield,
  Cpu,
  Image,
  Mic,
  Play,
  Globe,
  Folder,
  Database,
  Bot,
  Wand2,
  PenTool,
  Eye,
  Accessibility,
  Smartphone,
  Move3D,
  Boxes,
  FlaskConical,
  type LucideIcon,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type CommandCategory =
  | 'navigation'
  | 'tools'
  | 'skills'
  | 'dimensions'
  | 'context'
  | 'media'
  | 'code'
  | 'memory'
  | 'product'
  | 'quick';

export interface SlashCommand {
  /** Command name without the leading slash */
  name: string;
  /** Aliases that also trigger this command */
  aliases?: string[];
  /** Human-readable label */
  label: string;
  /** Description shown in picker */
  description: string;
  /** Category for grouping */
  category: CommandCategory;
  /** Icon component */
  icon: LucideIcon;
  /** Color for the icon */
  color: string;
  /** If true, only available to owner */
  ownerOnly?: boolean;
  /** If the command takes a parameter, describe it */
  parameter?: {
    name: string;
    description: string;
    required?: boolean;
    type: 'text' | 'select' | 'reference';
    options?: string[];
  };
  /** The actual tool name to call (if different from name) */
  toolName?: string;
  /** For navigation commands, the destination */
  destination?: string;
  /** For context commands, the context type to insert */
  contextType?: string;
}

// ============================================================================
// Navigation Commands
// ============================================================================

export const NAVIGATION_COMMANDS: SlashCommand[] = [
  {
    name: 'home',
    aliases: ['start', 'main'],
    label: 'Home',
    description: 'Go to the home screen',
    category: 'navigation',
    icon: Compass,
    color: '#f59e0b',
    destination: '/',
  },
  {
    name: 'chat',
    label: 'Chat',
    description: 'Open full chat interface',
    category: 'navigation',
    icon: MessageSquare,
    color: '#3b82f6',
    destination: '/chat',
  },
  {
    name: 'canvas',
    aliases: ['design-canvas'],
    label: 'Design Canvas',
    description: 'Open the infinite design canvas',
    category: 'navigation',
    icon: LayoutGrid,
    color: '#10b981',
    destination: '/canvas',
  },
  {
    name: 'projects',
    aliases: ['kanban', 'tasks'],
    label: 'Projects',
    description: 'View projects and kanban board',
    category: 'navigation',
    icon: Layers,
    color: '#8b5cf6',
    destination: '/projects',
  },
  {
    name: 'design',
    aliases: ['themes'],
    label: 'Design Themes',
    description: 'Explore 50+ design themes',
    category: 'navigation',
    icon: Palette,
    color: '#ec4899',
    destination: '/design',
  },
  {
    name: 'resume',
    aliases: ['cv', 'about'],
    label: 'Resume',
    description: 'View James\'s resume',
    category: 'navigation',
    icon: FileText,
    color: '#6366f1',
    destination: '/resume',
  },
  {
    name: 'music',
    aliases: ['jamz', 'tracks'],
    label: 'Music',
    description: 'Listen to music and tracks',
    category: 'navigation',
    icon: Music,
    color: '#ef4444',
    destination: '/music',
  },
  {
    name: 'video',
    aliases: ['studio'],
    label: 'Video Studio',
    description: 'Create and edit videos',
    category: 'navigation',
    icon: Video,
    color: '#f97316',
    destination: '/video',
  },
  {
    name: 'agent',
    aliases: ['infinity', 'coding'],
    label: 'Agent',
    description: 'Open the coding agent',
    category: 'navigation',
    icon: Bot,
    color: '#14b8a6',
    destination: '/agent',
    ownerOnly: true,
  },
  {
    name: 'memory',
    aliases: ['memories'],
    label: 'Memory Control',
    description: 'View and manage AI memories',
    category: 'navigation',
    icon: Brain,
    color: '#a855f7',
    destination: '/memory',
    ownerOnly: true,
  },
  {
    name: 'settings',
    label: 'Settings',
    description: 'Open settings',
    category: 'navigation',
    icon: Settings,
    color: '#6b7280',
    destination: '/settings',
    ownerOnly: true,
  },
];

// ============================================================================
// Tool Commands (mapped from CLAW_AI_TOOLS)
// ============================================================================

export const TOOL_COMMANDS: SlashCommand[] = [
  // Search & Discovery
  {
    name: 'search',
    aliases: ['find', 'lookup'],
    label: 'Search Portfolio',
    description: 'Search projects, skills, and experience',
    category: 'tools',
    icon: Search,
    color: '#3b82f6',
    toolName: 'search_portfolio',
    parameter: {
      name: 'query',
      description: 'What to search for',
      required: true,
      type: 'text',
    },
  },
  {
    name: 'weather',
    label: 'Weather',
    description: 'Show weather widget',
    category: 'tools',
    icon: Globe,
    color: '#0ea5e9',
    toolName: 'show_weather',
    parameter: {
      name: 'location',
      description: 'Location (default: San Francisco)',
      type: 'text',
    },
  },
  {
    name: 'photos',
    aliases: ['gallery', 'images'],
    label: 'Photos',
    description: 'Show photo gallery',
    category: 'tools',
    icon: Image,
    color: '#f472b6',
    toolName: 'show_photos',
  },

  // Scheduling
  {
    name: 'schedule',
    aliases: ['book', 'meeting'],
    label: 'Schedule Call',
    description: 'Schedule a call with James',
    category: 'tools',
    icon: Calendar,
    color: '#22c55e',
    toolName: 'schedule_call',
    parameter: {
      name: 'topic',
      description: 'Topic for the call',
      type: 'text',
    },
  },
  {
    name: 'availability',
    aliases: ['times', 'free'],
    label: 'Check Availability',
    description: 'See available meeting times',
    category: 'tools',
    icon: Clock,
    color: '#22c55e',
    toolName: 'get_available_times',
    parameter: {
      name: 'date',
      description: 'Date to check (YYYY-MM-DD)',
      type: 'text',
    },
  },

  // Memory
  {
    name: 'remember',
    aliases: ['recall'],
    label: 'Remember',
    description: 'Search AI memories',
    category: 'memory',
    icon: Brain,
    color: '#a855f7',
    toolName: 'remember',
    parameter: {
      name: 'query',
      description: 'What to remember',
      required: true,
      type: 'text',
    },
  },
  {
    name: 'memorize',
    aliases: ['store'],
    label: 'Memorize',
    description: 'Store a new memory',
    category: 'memory',
    icon: Brain,
    color: '#a855f7',
    toolName: 'memorize',
    ownerOnly: true,
    parameter: {
      name: 'content',
      description: 'Memory content',
      required: true,
      type: 'text',
    },
  },
  {
    name: 'learn',
    label: 'Learn',
    description: 'Teach AI a new fact',
    category: 'memory',
    icon: BookOpen,
    color: '#a855f7',
    toolName: 'learn',
    ownerOnly: true,
    parameter: {
      name: 'knowledge',
      description: 'What to learn',
      required: true,
      type: 'text',
    },
  },

  // Product Lifecycle
  {
    name: 'project',
    aliases: ['new-project'],
    label: 'Create Project',
    description: 'Create a new product project',
    category: 'product',
    icon: Layers,
    color: '#8b5cf6',
    toolName: 'create_project',
    ownerOnly: true,
    parameter: {
      name: 'name',
      description: 'Project name',
      required: true,
      type: 'text',
    },
  },
  {
    name: 'prd',
    aliases: ['spec', 'requirements'],
    label: 'Create PRD',
    description: 'Create Product Requirements Document',
    category: 'product',
    icon: FileText,
    color: '#ec4899',
    toolName: 'create_prd',
    ownerOnly: true,
    parameter: {
      name: 'title',
      description: 'PRD title',
      required: true,
      type: 'text',
    },
  },
  {
    name: 'ticket',
    aliases: ['story', 'task'],
    label: 'Create Ticket',
    description: 'Create BMAD user story ticket',
    category: 'product',
    icon: Target,
    color: '#f59e0b',
    toolName: 'create_ticket',
    ownerOnly: true,
    parameter: {
      name: 'title',
      description: 'Ticket title',
      required: true,
      type: 'text',
    },
  },
  {
    name: 'kanban',
    aliases: ['board'],
    label: 'Show Kanban',
    description: 'Display kanban board',
    category: 'product',
    icon: LayoutGrid,
    color: '#3b82f6',
    toolName: 'show_kanban_tasks',
    parameter: {
      name: 'filter',
      description: 'Status filter',
      type: 'select',
      options: ['all', 'todo', 'in-progress', 'done', 'backlog'],
    },
  },

  // Code & Execution
  {
    name: 'clone',
    aliases: ['repo'],
    label: 'Clone Repository',
    description: 'Clone a git repository',
    category: 'code',
    icon: GitBranch,
    color: '#6366f1',
    toolName: 'clone_repository',
    ownerOnly: true,
    parameter: {
      name: 'url',
      description: 'Repository URL',
      required: true,
      type: 'text',
    },
  },
  {
    name: 'run',
    aliases: ['exec', 'cmd'],
    label: 'Run Command',
    description: 'Execute a shell command',
    category: 'code',
    icon: Terminal,
    color: '#22c55e',
    toolName: 'run_command',
    ownerOnly: true,
    parameter: {
      name: 'command',
      description: 'Command to run',
      required: true,
      type: 'text',
    },
  },
  {
    name: 'read',
    aliases: ['cat', 'view'],
    label: 'Read File',
    description: 'Read a file\'s contents',
    category: 'code',
    icon: FileText,
    color: '#6366f1',
    toolName: 'read_file',
    ownerOnly: true,
    parameter: {
      name: 'path',
      description: 'File path',
      required: true,
      type: 'text',
    },
  },
  {
    name: 'write',
    aliases: ['save'],
    label: 'Write File',
    description: 'Write content to a file',
    category: 'code',
    icon: PenTool,
    color: '#6366f1',
    toolName: 'write_file',
    ownerOnly: true,
    parameter: {
      name: 'path',
      description: 'File path',
      required: true,
      type: 'text',
    },
  },
  {
    name: 'search-code',
    aliases: ['grep'],
    label: 'Search Codebase',
    description: 'Search code with regex',
    category: 'code',
    icon: Code,
    color: '#6366f1',
    toolName: 'search_codebase',
    ownerOnly: true,
    parameter: {
      name: 'pattern',
      description: 'Search pattern',
      required: true,
      type: 'text',
    },
  },

  // Media Generation
  {
    name: 'generate',
    aliases: ['create', 'ai'],
    label: 'Generate',
    description: 'AI generation on canvas',
    category: 'media',
    icon: Sparkles,
    color: '#f59e0b',
    toolName: 'generate_on_canvas',
    parameter: {
      name: 'prompt',
      description: 'Generation prompt',
      required: true,
      type: 'text',
    },
  },
  {
    name: 'video-create',
    aliases: ['render'],
    label: 'Create Video',
    description: 'Create a video composition',
    category: 'media',
    icon: Video,
    color: '#f97316',
    toolName: 'create_video_composition',
    ownerOnly: true,
    parameter: {
      name: 'name',
      description: 'Video name',
      required: true,
      type: 'text',
    },
  },
  {
    name: 'tts',
    aliases: ['speak', 'voice'],
    label: 'Text to Speech',
    description: 'Generate speech from text',
    category: 'media',
    icon: Mic,
    color: '#22c55e',
    toolName: 'generate_voice',
    parameter: {
      name: 'text',
      description: 'Text to speak',
      required: true,
      type: 'text',
    },
  },

  // Channels & Messaging
  {
    name: 'message',
    aliases: ['send'],
    label: 'Send Message',
    description: 'Send a channel message',
    category: 'tools',
    icon: MessageSquare,
    color: '#3b82f6',
    toolName: 'send_channel_message',
    ownerOnly: true,
    parameter: {
      name: 'content',
      description: 'Message content',
      required: true,
      type: 'text',
    },
  },

  // Utility
  {
    name: 'ui',
    aliases: ['render'],
    label: 'Render UI',
    description: 'Render custom UI components',
    category: 'tools',
    icon: Boxes,
    color: '#8b5cf6',
    toolName: 'render_ui',
  },
  {
    name: 'cron',
    aliases: ['schedule-job'],
    label: 'Create Cron Job',
    description: 'Create a scheduled job',
    category: 'tools',
    icon: Clock,
    color: '#f59e0b',
    toolName: 'create_cron_job',
    ownerOnly: true,
    parameter: {
      name: 'expression',
      description: 'Cron expression',
      required: true,
      type: 'text',
    },
  },
];

// ============================================================================
// Skill Commands (from .claude/skills/)
// ============================================================================

export const SKILL_COMMANDS: SlashCommand[] = [
  // Design Skills
  {
    name: 'skill-design',
    aliases: ['design-excellence'],
    label: 'Design Excellence',
    description: 'High-impact interface design principles',
    category: 'skills',
    icon: Palette,
    color: '#ec4899',
    contextType: 'skill:design-excellence',
  },
  {
    name: 'skill-ui',
    aliases: ['ui-constraints'],
    label: 'UI Constraints',
    description: 'Opinionated UI guidelines (Tailwind, no gradients)',
    category: 'skills',
    icon: PenTool,
    color: '#ec4899',
    contextType: 'skill:ui',
  },
  {
    name: 'skill-interface',
    aliases: ['interface-craft'],
    label: 'Interface Craft',
    description: 'Intentional design: clarity, structure, beauty',
    category: 'skills',
    icon: Wand2,
    color: '#ec4899',
    contextType: 'skill:interface-craft',
  },
  {
    name: 'skill-motion',
    aliases: ['animation'],
    label: 'Motion Design',
    description: 'Animation principles: 100-500ms timing, easing',
    category: 'skills',
    icon: Play,
    color: '#f97316',
    contextType: 'skill:motion-design',
  },
  {
    name: 'skill-ios',
    aliases: ['ios-hig'],
    label: 'iOS Excellence',
    description: 'iOS HIG patterns: SF Pro, 8pt grid, haptics',
    category: 'skills',
    icon: Smartphone,
    color: '#3b82f6',
    contextType: 'skill:ios-excellence',
  },
  {
    name: 'skill-a11y',
    aliases: ['accessibility'],
    label: 'Accessibility Review',
    description: 'A11y QA: keyboard, screen reader, contrast',
    category: 'skills',
    icon: Accessibility,
    color: '#22c55e',
    contextType: 'skill:accessibility-review',
  },

  // Development Skills
  {
    name: 'skill-react',
    aliases: ['vercel-best-practices'],
    label: 'React Best Practices',
    description: '45+ performance rules across 8 priority tiers',
    category: 'skills',
    icon: Code,
    color: '#3b82f6',
    contextType: 'skill:vercel-react-best-practices',
  },
  {
    name: 'skill-threejs',
    aliases: ['3d'],
    label: 'Three.js Excellence',
    description: '3D excellence: 7 gallery types, shaders',
    category: 'skills',
    icon: Move3D,
    color: '#8b5cf6',
    contextType: 'skill:threejs',
  },
  {
    name: 'skill-browser',
    aliases: ['automation'],
    label: 'Browser Automation',
    description: 'Navigation, clicks, forms, screenshots',
    category: 'skills',
    icon: Globe,
    color: '#6366f1',
    contextType: 'skill:agent-browser',
  },
  {
    name: 'skill-clone',
    aliases: ['extract'],
    label: 'Clone React',
    description: 'Visual component extraction from websites',
    category: 'skills',
    icon: Eye,
    color: '#6366f1',
    contextType: 'skill:clone-react',
  },

  // Security & Research
  {
    name: 'skill-security',
    aliases: ['0din', 'red-team'],
    label: 'Security Research',
    description: 'AI safety & red teaming with JEF scoring',
    category: 'skills',
    icon: Shield,
    color: '#ef4444',
    contextType: 'skill:0din-security-research',
    ownerOnly: true,
  },
  {
    name: 'skill-science',
    aliases: ['scientific'],
    label: 'Scientific Skills',
    description: 'K-Dense: 139 scientific skills',
    category: 'skills',
    icon: FlaskConical,
    color: '#14b8a6',
    contextType: 'skill:scientific-skills',
  },

  // Project Management
  {
    name: 'skill-pm',
    aliases: ['project-management'],
    label: 'Project Management',
    description: 'GitHub workflow & Kanban methodology',
    category: 'skills',
    icon: Target,
    color: '#f59e0b',
    contextType: 'skill:project-management',
  },
  {
    name: 'skill-web-design',
    aliases: ['web-guidelines'],
    label: 'Web Design Guidelines',
    description: 'Web design standards and patterns',
    category: 'skills',
    icon: Globe,
    color: '#ec4899',
    contextType: 'skill:web-design-guidelines',
  },
  {
    name: 'skill-remotion',
    aliases: ['video-export'],
    label: 'Remotion Video',
    description: 'Video export integration',
    category: 'skills',
    icon: Video,
    color: '#f97316',
    contextType: 'skill:remotion-video-exports',
  },
  {
    name: 'skill-actionbook',
    aliases: ['web-automation'],
    label: 'Actionbook Automation',
    description: 'Web automation patterns',
    category: 'skills',
    icon: Zap,
    color: '#a855f7',
    contextType: 'skill:actionbook-web-automation',
  },
];

// ============================================================================
// Dimension Commands (ERV Arrangements)
// ============================================================================

export const DIMENSION_COMMANDS: SlashCommand[] = [
  {
    name: 'dim-kanban',
    label: 'Kanban View',
    description: 'View data as kanban board with status columns',
    category: 'dimensions',
    icon: LayoutGrid,
    color: '#3b82f6',
    toolName: 'navigate_dimension',
    contextType: 'dimension:kanban',
  },
  {
    name: 'dim-timeline',
    label: 'Timeline View',
    description: 'View data chronologically on a timeline',
    category: 'dimensions',
    icon: Clock,
    color: '#22c55e',
    toolName: 'navigate_dimension',
    contextType: 'dimension:timeline',
  },
  {
    name: 'dim-graph',
    label: 'Graph View',
    description: 'View data as connected nodes',
    category: 'dimensions',
    icon: Cpu,
    color: '#8b5cf6',
    toolName: 'navigate_dimension',
    contextType: 'dimension:graph',
  },
  {
    name: 'dim-table',
    label: 'Table View',
    description: 'View data in a sortable table',
    category: 'dimensions',
    icon: Table,
    color: '#6b7280',
    toolName: 'navigate_dimension',
    contextType: 'dimension:table',
  },
  {
    name: 'dim-feed',
    label: 'Feed View',
    description: 'View data as a scrollable feed',
    category: 'dimensions',
    icon: List,
    color: '#f59e0b',
    toolName: 'navigate_dimension',
    contextType: 'dimension:feed',
  },
  {
    name: 'dim-calendar',
    label: 'Calendar View',
    description: 'View data on a calendar',
    category: 'dimensions',
    icon: Calendar,
    color: '#ef4444',
    toolName: 'navigate_dimension',
    contextType: 'dimension:calendar',
  },
  {
    name: 'dim-cards',
    label: 'Cards View',
    description: 'View data as visual cards',
    category: 'dimensions',
    icon: Boxes,
    color: '#ec4899',
    toolName: 'navigate_dimension',
    contextType: 'dimension:cards',
  },
];

// ============================================================================
// Quick Action Commands
// ============================================================================

export const QUICK_COMMANDS: SlashCommand[] = [
  {
    name: 'help',
    aliases: ['?', 'commands'],
    label: 'Help',
    description: 'Show all available commands',
    category: 'quick',
    icon: HelpCircle,
    color: '#6b7280',
  },
  {
    name: 'clear',
    aliases: ['reset'],
    label: 'Clear Chat',
    description: 'Clear the current conversation',
    category: 'quick',
    icon: Trash2,
    color: '#ef4444',
  },
  {
    name: 'voice',
    aliases: ['tts-toggle'],
    label: 'Toggle Voice',
    description: 'Toggle voice responses on/off',
    category: 'quick',
    icon: Mic,
    color: '#22c55e',
  },
  {
    name: 'new',
    aliases: ['new-chat'],
    label: 'New Thread',
    description: 'Start a new conversation',
    category: 'quick',
    icon: MessageSquare,
    color: '#3b82f6',
  },
];

// Import Trash2 for clear command
import { Trash2 } from 'lucide-react';

// ============================================================================
// Combined Registry
// ============================================================================

export const ALL_SLASH_COMMANDS: SlashCommand[] = [
  ...QUICK_COMMANDS,
  ...NAVIGATION_COMMANDS,
  ...TOOL_COMMANDS,
  ...SKILL_COMMANDS,
  ...DIMENSION_COMMANDS,
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Search commands by query string
 */
export function searchCommands(
  query: string,
  options?: {
    categories?: CommandCategory[];
    includeOwnerOnly?: boolean;
  }
): SlashCommand[] {
  const normalizedQuery = query.toLowerCase().replace(/^\//, '');

  let commands = ALL_SLASH_COMMANDS;

  // Filter by owner-only
  if (!options?.includeOwnerOnly) {
    commands = commands.filter((cmd) => !cmd.ownerOnly);
  }

  // Filter by categories
  if (options?.categories?.length) {
    commands = commands.filter((cmd) => options.categories!.includes(cmd.category));
  }

  // No query? Return all matching commands
  if (!normalizedQuery) {
    return commands.slice(0, 20);
  }

  // Search by name, aliases, and label
  return commands.filter((cmd) => {
    const matchesName = cmd.name.toLowerCase().includes(normalizedQuery);
    const matchesAlias = cmd.aliases?.some((a) => a.toLowerCase().includes(normalizedQuery));
    const matchesLabel = cmd.label.toLowerCase().includes(normalizedQuery);
    const matchesDescription = cmd.description.toLowerCase().includes(normalizedQuery);
    return matchesName || matchesAlias || matchesLabel || matchesDescription;
  });
}

/**
 * Get a command by exact name or alias
 */
export function getCommand(name: string): SlashCommand | undefined {
  const normalizedName = name.toLowerCase().replace(/^\//, '');
  return ALL_SLASH_COMMANDS.find(
    (cmd) =>
      cmd.name === normalizedName || cmd.aliases?.includes(normalizedName)
  );
}

/**
 * Get commands grouped by category
 */
export function getCommandsByCategory(
  includeOwnerOnly = false
): Record<CommandCategory, SlashCommand[]> {
  const commands = includeOwnerOnly
    ? ALL_SLASH_COMMANDS
    : ALL_SLASH_COMMANDS.filter((cmd) => !cmd.ownerOnly);

  return commands.reduce(
    (acc, cmd) => {
      if (!acc[cmd.category]) {
        acc[cmd.category] = [];
      }
      acc[cmd.category].push(cmd);
      return acc;
    },
    {} as Record<CommandCategory, SlashCommand[]>
  );
}

/**
 * Category labels for display
 */
export const CATEGORY_LABELS: Record<CommandCategory, string> = {
  quick: 'Quick Actions',
  navigation: 'Navigation',
  tools: 'Tools',
  skills: 'Skills',
  dimensions: 'Dimensions',
  context: 'Context',
  media: 'Media',
  code: 'Code & Execution',
  memory: 'Memory',
  product: 'Product Lifecycle',
};

/**
 * Category colors for display
 */
export const CATEGORY_COLORS: Record<CommandCategory, string> = {
  quick: '#6b7280',
  navigation: '#f59e0b',
  tools: '#3b82f6',
  skills: '#8b5cf6',
  dimensions: '#10b981',
  context: '#ec4899',
  media: '#f97316',
  code: '#6366f1',
  memory: '#a855f7',
  product: '#22c55e',
};

/**
 * Format a command for display in the picker
 */
export function formatCommandPreview(cmd: SlashCommand): string {
  let preview = `/${cmd.name}`;
  if (cmd.parameter) {
    preview += cmd.parameter.required
      ? ` <${cmd.parameter.name}>`
      : ` [${cmd.parameter.name}]`;
  }
  return preview;
}

/**
 * Parse a command string into command + arguments
 */
export function parseCommandString(input: string): {
  command: SlashCommand | undefined;
  args: string;
} {
  const match = input.match(/^\/(\S+)(?:\s+(.*))?$/);
  if (!match) {
    return { command: undefined, args: '' };
  }

  const [, cmdName, args = ''] = match;
  const command = getCommand(cmdName);

  return { command, args: args.trim() };
}

export default ALL_SLASH_COMMANDS;
