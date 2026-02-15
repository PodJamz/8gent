/**
 * Access Control for Claw AI Tools
 *
 * Implements three-tier access control:
 * - Owner/Claw AI: Full access to all 50+ tools
 * - Collaborators: Limited access (view, search, navigate but no mutations)
 * - Visitors: Portfolio mode only (search, navigate, themes)
 *
 * @see docs/planning/infinity-agent-coding-integration.md
 */

import { CLAW_AI_TOOLS, ToolDefinition } from './tools';

// ============================================================================
// Access Level Types
// ============================================================================

export type AccessLevel = 'owner' | 'collaborator' | 'visitor';

/**
 * Job types for ∞gent - each type gets a specific tool allowlist
 * This prevents coding agents from sending messages, research agents from mutating files, etc.
 */
export type JobType = 'coding' | 'research' | 'product' | 'general';

export interface UserContext {
  userId?: string;
  isOwner: boolean;
  isCollaborator: boolean;
  isAuthenticated: boolean;
}

export interface JobContext {
  jobType: JobType;
  accessLevel: AccessLevel;
}

// ============================================================================
// Tool Access Mappings
// ============================================================================

/**
 * Tools available to everyone (visitors included)
 * These are read-only portfolio exploration tools
 */
const VISITOR_TOOLS = new Set([
  'search_portfolio',
  'navigate_to',
  'list_themes',
  'open_search_app',
  'show_weather',
  'show_photos',
]);

/**
 * Tools available to collaborators (authenticated users)
 * Includes visitor tools plus limited view/read capabilities
 */
const COLLABORATOR_TOOLS = new Set([
  // All visitor tools
  ...VISITOR_TOOLS,
  // View kanban and projects (read-only)
  'show_kanban_tasks',
  'list_projects',
  'get_project_kanban',
  // Scheduling (view only, no booking for collaborators)
  'get_available_times',
  'get_upcoming_bookings',
  // Read-only context
  'get_active_context',
  'load_context_from_reference',
  // Read-only coding (can view but not execute)
  'list_coding_tasks',
  'list_directory',
  'read_file',
  'search_codebase',
  'git_status',
  'git_diff',
  // Cron jobs (view only)
  'list_cron_jobs',
  // Compaction (view only)
  'get_compaction_summary',
  // Channels (view only)
  'list_channel_integrations',
  'get_channel_conversations',
  'search_channel_messages',
]);

/**
 * Tools available only to the owner
 * Full access including mutations, execution, and memory
 */
const OWNER_ONLY_TOOLS = new Set([
  // Scheduling mutations
  'schedule_call',
  'book_meeting',
  'reschedule_meeting',
  'cancel_meeting',
  // UI rendering
  'render_ui',
  // Product lifecycle mutations
  'create_project',
  'create_prd',
  'create_ticket',
  'update_ticket',
  'shard_prd',
  // Memory operations (full RLM access)
  'remember',
  'recall_preference',
  'memorize',
  'learn',
  'forget',
  // Working context mutations
  'set_active_context',
  // Repository operations
  'clone_repository',
  // File mutations
  'write_file',
  'edit_file',
  'delete_file',
  // Execution
  'run_command',
  'start_dev_server',
  'get_preview_url',
  // Git mutations
  'git_commit',
  'git_push',
  'create_branch',
  // Coding task management
  'create_coding_task',
  'update_coding_task',
  // Cron job mutations (owner only)
  'create_cron_job',
  'toggle_cron_job',
  'delete_cron_job',
  // Compaction mutations (owner only)
  'compact_conversation',
  // Channel mutations (owner only)
  'send_channel_message',
  // Music generation (owner only)
  'cowrite_music',
  'generate_music',
]);

// ============================================================================
// Job Type Tool Allowlists (Phase 1.1 - ∞gent Safety Stack)
// ============================================================================

/**
 * CODING jobs: Full development capabilities
 * File operations, git, terminal, task tracking
 * NO: messaging, scheduling, social posting
 */
const CODING_JOB_TOOLS = new Set([
  // File operations
  'list_directory',
  'read_file',
  'write_file',
  'edit_file',
  'delete_file',
  'search_codebase',
  // Repository operations
  'clone_repository',
  // Git operations
  'git_status',
  'git_diff',
  'git_commit',
  'git_push',
  'create_branch',
  // Execution (sandboxed)
  'run_command',
  'start_dev_server',
  'get_preview_url',
  // Task tracking
  'create_coding_task',
  'update_coding_task',
  'list_coding_tasks',
  // Working context
  'get_active_context',
  'set_active_context',
  'load_context_from_reference',
]);

/**
 * RESEARCH jobs: Read-only exploration and web access
 * Web fetch, search, read files - NO mutations
 */
const RESEARCH_JOB_TOOLS = new Set([
  // Portfolio exploration
  'search_portfolio',
  'navigate_to',
  'list_themes',
  'open_search_app',
  // Read-only file operations
  'list_directory',
  'read_file',
  'search_codebase',
  // Git (read-only)
  'git_status',
  'git_diff',
  // View capabilities
  'show_kanban_tasks',
  'list_projects',
  'get_project_kanban',
  'list_coding_tasks',
  // Context (read-only)
  'get_active_context',
  'load_context_from_reference',
  // Channels (read-only)
  'list_channel_integrations',
  'get_channel_conversations',
  'search_channel_messages',
  // Compaction (read-only)
  'get_compaction_summary',
  // Memory (read-only)
  'remember',
  'recall_preference',
]);

/**
 * PRODUCT jobs: PRD, tickets, project management
 * NO code execution, NO file mutations beyond docs
 */
const PRODUCT_JOB_TOOLS = new Set([
  // Product lifecycle
  'create_project',
  'list_projects',
  'create_prd',
  'create_ticket',
  'update_ticket',
  'shard_prd',
  'get_project_kanban',
  'show_kanban_tasks',
  // Read-only file access (for context)
  'list_directory',
  'read_file',
  'search_codebase',
  // Context
  'get_active_context',
  'set_active_context',
  'load_context_from_reference',
  // Memory (for product decisions)
  'remember',
  'recall_preference',
  'memorize',
  'learn',
  // UI rendering (for mockups)
  'render_ui',
  // Scheduling (for roadmap planning)
  'get_available_times',
  'get_upcoming_bookings',
]);

/**
 * GENERAL jobs: Balanced access for interactive chat
 * Most tools available, but still respects access level
 */
const GENERAL_JOB_TOOLS = new Set([
  // All visitor tools
  ...VISITOR_TOOLS,
  // All collaborator tools
  ...COLLABORATOR_TOOLS,
  // Owner-only tools are gated by access level check
]);

/**
 * Map of job types to their allowed tools
 */
const JOB_TYPE_TOOLS: Record<JobType, Set<string>> = {
  coding: CODING_JOB_TOOLS,
  research: RESEARCH_JOB_TOOLS,
  product: PRODUCT_JOB_TOOLS,
  general: GENERAL_JOB_TOOLS,
};

/**
 * Job type metadata for UI display and documentation
 */
export const JOB_TYPE_INFO: Record<JobType, { name: string; description: string; icon: string }> = {
  coding: {
    name: 'Coding',
    description: 'Full development: files, git, terminal. No messaging or scheduling.',
    icon: '💻',
  },
  research: {
    name: 'Research',
    description: 'Read-only exploration: search, read files, browse. No mutations.',
    icon: '🔍',
  },
  product: {
    name: 'Product',
    description: 'PRDs, tickets, planning. No code execution.',
    icon: '📋',
  },
  general: {
    name: 'General',
    description: 'Balanced access for interactive chat.',
    icon: '💬',
  },
};

// ============================================================================
// Access Control Functions
// ============================================================================

/**
 * Get the access level for a user based on their context
 */
export function getAccessLevel(ctx: UserContext): AccessLevel {
  if (ctx.isOwner) {
    return 'owner';
  }
  if (ctx.isCollaborator || ctx.isAuthenticated) {
    return 'collaborator';
  }
  return 'visitor';
}

/**
 * Check if a user can access a specific tool
 */
export function canAccessTool(toolName: string, accessLevel: AccessLevel): boolean {
  switch (accessLevel) {
    case 'owner':
      // Owner has access to all tools
      return true;

    case 'collaborator':
      // Collaborators have access to visitor tools + collaborator tools
      return VISITOR_TOOLS.has(toolName) || COLLABORATOR_TOOLS.has(toolName);

    case 'visitor':
      // Visitors only have access to visitor tools
      return VISITOR_TOOLS.has(toolName);

    default:
      return false;
  }
}

/**
 * Get all tools available for a given access level
 */
export function getToolsForAccessLevel(accessLevel: AccessLevel): ToolDefinition[] {
  return CLAW_AI_TOOLS.filter((tool) => canAccessTool(tool.name, accessLevel));
}

/**
 * Get tool names available for a given access level
 */
export function getToolNamesForAccessLevel(accessLevel: AccessLevel): string[] {
  return getToolsForAccessLevel(accessLevel).map((tool) => tool.name);
}

/**
 * Filter a list of tool calls to only include permitted tools
 * Returns the filtered list and any denied tools
 */
export function filterToolCalls<T extends { name: string }>(
  toolCalls: T[],
  accessLevel: AccessLevel
): { permitted: T[]; denied: T[] } {
  const permitted: T[] = [];
  const denied: T[] = [];

  for (const call of toolCalls) {
    if (canAccessTool(call.name, accessLevel)) {
      permitted.push(call);
    } else {
      denied.push(call);
    }
  }

  return { permitted, denied };
}

// ============================================================================
// Job Type Access Control (Phase 1.1 - ∞gent Safety Stack)
// ============================================================================

/**
 * Check if a tool is allowed for a specific job type
 * This is ADDITIONAL to access level checks - both must pass
 */
export function isToolAllowedForJobType(toolName: string, jobType: JobType): boolean {
  const allowedTools = JOB_TYPE_TOOLS[jobType];

  // General jobs allow all tools (access level still applies)
  if (jobType === 'general') {
    return true;
  }

  return allowedTools.has(toolName);
}

/**
 * Check if a user can access a tool given both access level AND job type
 * Both checks must pass for the tool to be allowed
 */
export function canAccessToolForJob(
  toolName: string,
  accessLevel: AccessLevel,
  jobType: JobType
): boolean {
  // First check: Does the access level allow this tool?
  if (!canAccessTool(toolName, accessLevel)) {
    return false;
  }

  // Second check: Does the job type allow this tool?
  return isToolAllowedForJobType(toolName, jobType);
}

/**
 * Get all tools available for a given job context (access level + job type)
 */
export function getToolsForJobContext(context: JobContext): ToolDefinition[] {
  return CLAW_AI_TOOLS.filter((tool) =>
    canAccessToolForJob(tool.name, context.accessLevel, context.jobType)
  );
}

/**
 * Get tool names available for a given job context
 */
export function getToolNamesForJobContext(context: JobContext): string[] {
  return getToolsForJobContext(context).map((tool) => tool.name);
}

/**
 * Filter tool calls by both access level and job type
 * Returns permitted, denied by access, and denied by job type
 */
export function filterToolCallsForJob<T extends { name: string }>(
  toolCalls: T[],
  context: JobContext
): {
  permitted: T[];
  deniedByAccess: T[];
  deniedByJobType: T[];
} {
  const permitted: T[] = [];
  const deniedByAccess: T[] = [];
  const deniedByJobType: T[] = [];

  for (const call of toolCalls) {
    const hasAccessLevel = canAccessTool(call.name, context.accessLevel);
    const hasJobType = isToolAllowedForJobType(call.name, context.jobType);

    if (hasAccessLevel && hasJobType) {
      permitted.push(call);
    } else if (!hasAccessLevel) {
      deniedByAccess.push(call);
    } else {
      deniedByJobType.push(call);
    }
  }

  return { permitted, deniedByAccess, deniedByJobType };
}

/**
 * Generate a description of what tools are available for a job context
 */
export function describeJobContext(context: JobContext): string {
  const accessInfo = ACCESS_LEVEL_INFO[context.accessLevel];
  const jobInfo = JOB_TYPE_INFO[context.jobType];
  const tools = getToolsForJobContext(context);

  return `${accessInfo.name} with ${jobInfo.name} job: ${jobInfo.description} ${tools.length} tools available.`;
}

// ============================================================================
// Tool Categories for UI Display
// ============================================================================

export interface ToolCategory {
  name: string;
  description: string;
  tools: string[];
  icon: string;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    name: 'Portfolio',
    description: 'Search and navigate the portfolio',
    icon: '🎨',
    tools: ['search_portfolio', 'navigate_to', 'list_themes', 'open_search_app', 'show_weather', 'show_photos'],
  },
  {
    name: 'Scheduling',
    description: 'Calendar and meeting management',
    icon: '📅',
    tools: ['schedule_call', 'get_available_times', 'get_upcoming_bookings', 'book_meeting', 'reschedule_meeting', 'cancel_meeting'],
  },
  {
    name: 'Product Lifecycle',
    description: 'Project, PRD, and ticket management',
    icon: '📋',
    tools: ['create_project', 'list_projects', 'create_prd', 'create_ticket', 'update_ticket', 'shard_prd', 'get_project_kanban', 'show_kanban_tasks'],
  },
  {
    name: 'Memory',
    description: 'Recursive Memory Layer operations',
    icon: '🧠',
    tools: ['remember', 'recall_preference', 'memorize', 'learn', 'forget'],
  },
  {
    name: 'Working Context',
    description: 'Active context management',
    icon: '🎯',
    tools: ['set_active_context', 'get_active_context', 'load_context_from_reference'],
  },
  {
    name: 'Repository',
    description: 'Clone and explore codebases',
    icon: '📦',
    tools: ['clone_repository', 'list_directory', 'search_codebase'],
  },
  {
    name: 'Files',
    description: 'Read and write files',
    icon: '📄',
    tools: ['read_file', 'write_file', 'edit_file', 'delete_file'],
  },
  {
    name: 'Execution',
    description: 'Run commands and start servers',
    icon: '⚡',
    tools: ['run_command', 'start_dev_server', 'get_preview_url'],
  },
  {
    name: 'Git',
    description: 'Version control operations',
    icon: '🌿',
    tools: ['git_status', 'git_diff', 'git_commit', 'git_push', 'create_branch'],
  },
  {
    name: 'Coding Tasks',
    description: 'Track coding sessions',
    icon: '💻',
    tools: ['create_coding_task', 'update_coding_task', 'list_coding_tasks'],
  },
  {
    name: 'UI Rendering',
    description: 'Render custom UI components',
    icon: '🖼️',
    tools: ['render_ui'],
  },
  {
    name: 'Automation',
    description: 'Scheduled jobs and cron tasks',
    icon: '⏰',
    tools: ['create_cron_job', 'list_cron_jobs', 'toggle_cron_job', 'delete_cron_job'],
  },
  {
    name: 'Compaction',
    description: 'Conversation summarization and context management',
    icon: '📚',
    tools: ['compact_conversation', 'get_compaction_summary'],
  },
  {
    name: 'Channels',
    description: 'Messaging platform integrations (WhatsApp, Telegram, etc.)',
    icon: '💬',
    tools: ['list_channel_integrations', 'get_channel_conversations', 'send_channel_message', 'search_channel_messages'],
  },
];

/**
 * Get tool categories filtered by access level
 */
export function getCategoriesForAccessLevel(accessLevel: AccessLevel): ToolCategory[] {
  return TOOL_CATEGORIES.map((category) => ({
    ...category,
    tools: category.tools.filter((tool) => canAccessTool(tool, accessLevel)),
  })).filter((category) => category.tools.length > 0);
}

// ============================================================================
// Access Level Descriptions
// ============================================================================

export const ACCESS_LEVEL_INFO: Record<AccessLevel, { name: string; description: string; color: string }> = {
  owner: {
    name: 'Owner',
    description: 'Full access to all tools including coding, memory, and mutations',
    color: 'emerald',
  },
  collaborator: {
    name: 'Collaborator',
    description: 'View and search access, no mutations or code execution',
    color: 'blue',
  },
  visitor: {
    name: 'Visitor',
    description: 'Portfolio exploration only',
    color: 'gray',
  },
};

/**
 * Generate a description of what tools are available at each access level
 */
export function describeAccessLevel(accessLevel: AccessLevel): string {
  const info = ACCESS_LEVEL_INFO[accessLevel];
  const categories = getCategoriesForAccessLevel(accessLevel);
  const toolCount = getToolsForAccessLevel(accessLevel).length;

  const categoryNames = categories.map((c) => c.name).join(', ');

  return `${info.name}: ${info.description}. ${toolCount} tools across ${categories.length} categories (${categoryNames}).`;
}
