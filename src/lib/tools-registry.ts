/**
 * Tools Registry - Browseable catalog of all 8gent tools
 *
 * Provides categorization, access levels, and metadata for displaying
 * the complete set of 121 8gent tools on the /skills page.
 */

import { CLAW_AI_TOOLS, ToolDefinition } from './claw-ai/tools';

// ============================================================================
// Types
// ============================================================================

export type ToolCategory =
  | 'system'
  | 'scheduling'
  | 'ui'
  | 'product'
  | 'memory'
  | 'coding'
  | 'cron'
  | 'channels'
  | 'dimensions'
  | 'video'
  | 'image'
  | 'canvas'
  | 'health'
  | 'erv'
  | 'music'
  | 'background'
  | 'ai-settings';

export type ToolAccessLevel = 'visitor' | 'collaborator' | 'owner';

export interface ToolRegistryEntry {
  name: string;
  description: string;
  category: ToolCategory;
  accessLevel: ToolAccessLevel;
  ownerOnly: boolean;
  paramCount: number;
}

export interface ToolCategoryInfo {
  label: string;
  icon: string;
  description: string;
}

// ============================================================================
// Category Definitions
// ============================================================================

export const TOOL_CATEGORY_INFO: Record<ToolCategory, ToolCategoryInfo> = {
  system: {
    label: 'System & Navigation',
    icon: 'Briefcase',
    description: 'Search and navigate the workspace',
  },
  scheduling: {
    label: 'Scheduling & Calendar',
    icon: 'Calendar',
    description: 'Manage meetings and availability',
  },
  ui: {
    label: 'Rich UI Rendering',
    icon: 'Layout',
    description: 'Generate dynamic UI components',
  },
  product: {
    label: 'Product Lifecycle',
    icon: 'Package',
    description: 'Create and manage products, PRDs, tickets',
  },
  memory: {
    label: 'Memory & Context',
    icon: 'Brain',
    description: 'Store and recall memories and context',
  },
  coding: {
    label: 'Code & Development',
    icon: 'Code',
    description: 'File operations, git, and code execution',
  },
  cron: {
    label: 'Scheduled Jobs',
    icon: 'Clock',
    description: 'Create and manage cron jobs',
  },
  channels: {
    label: 'Channels & Messages',
    icon: 'MessageSquare',
    description: 'Multi-platform messaging',
  },
  dimensions: {
    label: 'ERV Dimensions',
    icon: 'Boxes',
    description: 'Create and navigate data dimensions',
  },
  video: {
    label: 'Video Production',
    icon: 'Video',
    description: 'Create and compose videos with Remotion',
  },
  image: {
    label: 'Image Processing',
    icon: 'Image',
    description: 'Apply effects, generate icons, process images',
  },
  canvas: {
    label: 'Design Canvas',
    icon: 'Pencil',
    description: 'Create and manage infinite canvas workspaces',
  },
  health: {
    label: 'Health & Wellness',
    icon: 'Heart',
    description: 'Track and analyze health metrics',
  },
  erv: {
    label: 'Entity Classification',
    icon: 'Network',
    description: 'AI-assisted entity creation and classification',
  },
  music: {
    label: 'Music Generation',
    icon: 'Music',
    description: 'Generate and analyze music with ACE-Step',
  },
  background: {
    label: 'Background Tasks',
    icon: 'Loader',
    description: 'Spawn and manage autonomous agent tasks',
  },
  'ai-settings': {
    label: 'AI & System',
    icon: 'Settings',
    description: 'Provider settings and system queries',
  },
};

// ============================================================================
// Tool Category Mappings
// ============================================================================

const TOOL_CATEGORIES: Record<string, ToolCategory> = {
  // System & Navigation
  search_system: 'system',
  navigate_to: 'system',
  list_themes: 'system',
  open_search_app: 'system',
  show_weather: 'system',
  show_photos: 'system',
  show_kanban_tasks: 'system',

  // Scheduling
  schedule_call: 'scheduling',
  get_available_times: 'scheduling',
  get_upcoming_bookings: 'scheduling',
  book_meeting: 'scheduling',
  reschedule_meeting: 'scheduling',
  cancel_meeting: 'scheduling',

  // UI Rendering
  render_ui: 'ui',

  // Product Lifecycle
  create_project: 'product',
  create_prd: 'product',
  create_ticket: 'product',
  update_ticket: 'product',
  shard_prd: 'product',
  get_project_kanban: 'product',
  list_projects: 'product',

  // Memory & Context
  remember: 'memory',
  recall_preference: 'memory',
  memorize: 'memory',
  learn: 'memory',
  forget: 'memory',
  set_active_context: 'memory',
  get_active_context: 'memory',
  load_context_from_reference: 'memory',

  // Coding & Development
  clone_repository: 'coding',
  list_directory: 'coding',
  search_codebase: 'coding',
  read_file: 'coding',
  write_file: 'coding',
  edit_file: 'coding',
  delete_file: 'coding',
  run_command: 'coding',
  start_dev_server: 'coding',
  get_preview_url: 'coding',
  git_status: 'coding',
  git_diff: 'coding',
  git_commit: 'coding',
  git_push: 'coding',
  create_branch: 'coding',
  create_coding_task: 'coding',
  update_coding_task: 'coding',
  list_coding_tasks: 'coding',

  // Scheduled Jobs
  create_cron_job: 'cron',
  list_cron_jobs: 'cron',
  toggle_cron_job: 'cron',
  delete_cron_job: 'cron',

  // Channels & Messages
  compact_conversation: 'channels',
  get_compaction_summary: 'channels',
  list_channel_integrations: 'channels',
  get_channel_conversations: 'channels',
  send_channel_message: 'channels',
  search_channel_messages: 'channels',

  // ERV Dimensions
  create_dimension: 'dimensions',
  navigate_to_dimension: 'dimensions',
  list_dimensions: 'dimensions',
  search_entities: 'dimensions',

  // Video Production
  create_video_composition: 'video',
  add_text_overlay: 'video',
  add_lyrics_to_video: 'video',
  add_media_to_video: 'video',
  preview_video: 'video',
  render_video: 'video',
  sync_lyrics_to_audio: 'video',
  get_render_status: 'video',
  add_particle_effect: 'video',
  add_waveform_visualizer: 'video',
  add_gradient_background: 'video',
  create_slideshow: 'video',
  add_cinematic_effect: 'video',
  add_kinetic_typography: 'video',
  export_for_platform: 'video',
  list_video_compositions: 'video',
  create_talking_video: 'video',
  generate_video_script: 'video',
  generate_voice_audio: 'video',
  navigate_to_video_studio: 'video',

  // Image Processing
  apply_image_effect: 'image',
  generate_app_icon: 'image',
  remove_background: 'image',
  create_branded_image: 'image',
  batch_process_images: 'image',
  create_color_palette: 'image',
  resize_and_crop: 'image',
  composite_images: 'image',
  generate_pattern: 'image',

  // Design Canvas
  create_canvas: 'canvas',
  list_canvases: 'canvas',
  get_canvas: 'canvas',
  add_canvas_node: 'canvas',
  add_canvas_edge: 'canvas',
  update_canvas_node: 'canvas',

  // Health & Wellness
  get_health_summary: 'health',
  get_health_trends: 'health',
  get_health_metric: 'health',
  compare_health_periods: 'health',
  generate_health_api_key: 'health',
  list_health_api_keys: 'health',
  revoke_health_api_key: 'health',
  get_health_sync_status: 'health',

  // Entity Classification
  analyze_and_create_entity: 'erv',
  suggest_entity_relationships: 'erv',
  bulk_classify_entities: 'erv',

  // Music Generation
  cowrite_music: 'music',
  generate_music: 'music',
  analyze_audio: 'music',
  separate_stems: 'music',

  // Background Tasks
  spawn_task: 'background',
  list_background_tasks: 'background',
  cancel_background_task: 'background',
  get_task_result: 'background',
  iterate_on_code: 'background',
  delegate_to_specialist: 'background',

  // AI & System
  get_ai_provider_status: 'ai-settings',
  navigate_to_ai_settings: 'ai-settings',
  get_kanban_task: 'ai-settings',
  search_kanban_tasks: 'ai-settings',
};

// ============================================================================
// Access Level Mappings
// ============================================================================

const VISITOR_TOOLS = new Set([
  'search_system',
  'navigate_to',
  'list_themes',
  'open_search_app',
  'show_weather',
  'show_photos',
]);

const COLLABORATOR_TOOLS = new Set([
  // All visitor tools
  ...VISITOR_TOOLS,
  // View kanban and projects (read-only)
  'show_kanban_tasks',
  'list_projects',
  'get_project_kanban',
  // Scheduling (view only)
  'get_available_times',
  'get_upcoming_bookings',
  // Read-only context
  'get_active_context',
  'load_context_from_reference',
  // Read-only coding
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
 * Determine access level for a tool
 */
function getToolAccessLevel(toolName: string): ToolAccessLevel {
  if (VISITOR_TOOLS.has(toolName)) {
    return 'visitor';
  }
  if (COLLABORATOR_TOOLS.has(toolName)) {
    return 'collaborator';
  }
  return 'owner';
}

// ============================================================================
// Registry Builder
// ============================================================================

/**
 * Build the complete tools registry from CLAW_AI_TOOLS definitions
 */
export function buildToolsRegistry(): ToolRegistryEntry[] {
  return CLAW_AI_TOOLS.map((tool: ToolDefinition) => {
    const category = TOOL_CATEGORIES[tool.name] || 'ai-settings';
    const accessLevel = getToolAccessLevel(tool.name);
    const paramCount = tool.parameters.required.length;

    return {
      name: tool.name,
      description: tool.description,
      category,
      accessLevel,
      ownerOnly: tool.ownerOnly || false,
      paramCount,
    };
  });
}

/**
 * Get tools registry filtered by access level
 */
export function getToolsRegistryForAccessLevel(
  accessLevel: ToolAccessLevel
): ToolRegistryEntry[] {
  const registry = buildToolsRegistry();

  return registry.filter((tool) => {
    switch (accessLevel) {
      case 'owner':
        return true;
      case 'collaborator':
        return tool.accessLevel === 'visitor' || tool.accessLevel === 'collaborator';
      case 'visitor':
        return tool.accessLevel === 'visitor';
      default:
        return false;
    }
  });
}

/**
 * Get tools registry grouped by category
 */
export function getToolsRegistryByCategory(
  accessLevel?: ToolAccessLevel
): Record<ToolCategory, ToolRegistryEntry[]> {
  const registry = accessLevel
    ? getToolsRegistryForAccessLevel(accessLevel)
    : buildToolsRegistry();

  const grouped = {} as Record<ToolCategory, ToolRegistryEntry[]>;

  // Initialize all categories
  Object.keys(TOOL_CATEGORY_INFO).forEach((cat) => {
    grouped[cat as ToolCategory] = [];
  });

  // Group tools by category
  registry.forEach((tool) => {
    if (!grouped[tool.category]) {
      grouped[tool.category] = [];
    }
    grouped[tool.category].push(tool);
  });

  return grouped;
}

/**
 * Get category statistics
 */
export function getCategoryStats(accessLevel?: ToolAccessLevel): {
  category: ToolCategory;
  info: ToolCategoryInfo;
  toolCount: number;
}[] {
  const grouped = getToolsRegistryByCategory(accessLevel);

  return Object.entries(grouped).map(([category, tools]) => ({
    category: category as ToolCategory,
    info: TOOL_CATEGORY_INFO[category as ToolCategory],
    toolCount: tools.length,
  }));
}

/**
 * Search tools by name or description
 */
export function searchTools(query: string, accessLevel?: ToolAccessLevel): ToolRegistryEntry[] {
  const registry = accessLevel
    ? getToolsRegistryForAccessLevel(accessLevel)
    : buildToolsRegistry();

  const lowerQuery = query.toLowerCase();

  return registry.filter(
    (tool) =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery)
  );
}
