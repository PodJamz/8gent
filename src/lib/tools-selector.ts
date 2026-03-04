/**
 * Dynamic Tool Selector - 8gent picks only what he needs
 *
 * Analyzes the user's message to determine which tool categories are relevant,
 * then returns only those tools. Keeps the OpenAI payload small (~5-15 tools)
 * instead of sending all 120+, which would exceed context limits.
 *
 * Uses the same category system as tools-registry.ts for consistency.
 */

import type { ToolDefinition } from './claw-ai/tools';
import type { ToolCategory } from './tools-registry';

// ============================================================================
// Intent → Category Mapping
// Each category has keywords that trigger it from the user's message.
// ============================================================================

interface CategoryTrigger {
  category: ToolCategory;
  keywords: string[];
  /** Tool names in this category. Listed explicitly so we don't pull in
   *  every tool from a category (e.g. only chat-relevant coding tools). */
  tools: string[];
}

const CATEGORY_TRIGGERS: CategoryTrigger[] = [
  {
    category: 'system',
    keywords: ['search', 'find', 'look up', 'system', 'documentation', 'skills', 'experience', 'projects', 'architecture'],
    tools: ['search_system', 'list_themes', 'open_search_app'],
  },
  {
    category: 'system',
    keywords: ['go to', 'navigate', 'open', 'show me', 'take me to', 'switch to', 'visit'],
    tools: ['navigate_to', 'open_search_app'],
  },
  {
    category: 'scheduling',
    keywords: ['schedule', 'book', 'meeting', 'calendar', 'appointment', 'available', 'reschedule', 'cancel meeting', 'call', 'free time'],
    tools: ['schedule_call', 'get_available_times', 'get_upcoming_bookings', 'book_meeting', 'reschedule_meeting', 'cancel_meeting'],
  },
  {
    category: 'music',
    keywords: ['music', 'song', 'track', 'beat', 'melody', 'generate music', 'cowrite', 'co-write', 'compose', 'lofi', 'lo-fi', 'hip hop', 'electronic', 'acoustic', 'piano', 'guitar', 'drums', 'synth', 'produce', 'audio', 'instrumental', 'remix', 'bpm', 'genre'],
    tools: ['cowrite_music', 'generate_music', 'analyze_audio', 'separate_stems'],
  },
  {
    category: 'product',
    keywords: ['project', 'prd', 'ticket', 'kanban', 'epic', 'story', 'backlog', 'sprint', 'task', 'board', 'roadmap', 'milestone'],
    tools: ['create_project', 'create_prd', 'create_ticket', 'update_ticket', 'shard_prd', 'get_project_kanban', 'list_projects'],
  },
  {
    category: 'memory',
    keywords: ['remember', 'recall', 'memorize', 'forget', 'memory', 'preference', 'learn', 'you know', 'do you recall'],
    tools: ['remember', 'recall_preference', 'memorize', 'learn', 'forget', 'set_active_context', 'get_active_context', 'load_context_from_reference'],
  },
  {
    category: 'ui',
    keywords: ['render', 'display', 'widget', 'card', 'chart', 'weather', 'photos', 'gallery', 'show', 'visualization'],
    tools: ['render_ui', 'show_weather', 'show_kanban_tasks', 'show_photos'],
  },
  {
    category: 'channels',
    keywords: ['message', 'whatsapp', 'channel', 'send message', 'conversation', 'inbox', 'text'],
    tools: ['send_channel_message', 'list_channel_integrations', 'get_channel_conversations', 'search_channel_messages', 'compact_conversation', 'get_compaction_summary'],
  },
  {
    category: 'coding',
    keywords: ['code', 'file', 'repository', 'git', 'commit', 'branch', 'deploy', 'build', 'terminal', 'command', 'debug', 'pull request', 'merge'],
    tools: ['clone_repository', 'list_directory', 'read_file', 'write_file', 'edit_file', 'search_codebase', 'run_command', 'git_status', 'git_diff', 'git_commit', 'create_branch'],
  },
  {
    category: 'dimensions',
    keywords: ['dimension', 'kanban view', 'graph view', 'timeline', 'calendar view', 'feed', 'table view', 'entity', 'entities'],
    tools: ['create_dimension', 'navigate_to_dimension', 'list_dimensions', 'search_entities'],
  },
  {
    category: 'cron',
    keywords: ['cron', 'schedule job', 'recurring', 'automation', 'reminder', 'every hour', 'every day', 'periodic'],
    tools: ['create_cron_job', 'list_cron_jobs', 'toggle_cron_job', 'delete_cron_job'],
  },
  {
    category: 'video',
    keywords: ['video', 'clip', 'remotion', 'render video', 'overlay', 'slideshow', 'talking head', 'animation', 'export video', 'waveform'],
    tools: ['create_video_composition', 'add_text_overlay', 'add_lyrics_to_video', 'add_media_to_video', 'preview_video', 'render_video', 'list_video_compositions', 'create_talking_video', 'generate_video_script'],
  },
  {
    category: 'image',
    keywords: ['image', 'photo', 'icon', 'background removal', 'resize', 'crop', 'effect', 'palette', 'pattern', 'composite'],
    tools: ['apply_image_effect', 'generate_app_icon', 'remove_background', 'create_branded_image', 'batch_process_images', 'create_color_palette', 'resize_and_crop', 'composite_images', 'generate_pattern'],
  },
  {
    category: 'canvas',
    keywords: ['canvas', 'design canvas', 'whiteboard', 'moodboard', 'wireframe', 'infinite canvas', 'freeform'],
    tools: ['create_canvas', 'list_canvases', 'get_canvas', 'add_canvas_node', 'add_canvas_edge', 'update_canvas_node'],
  },
  {
    category: 'health',
    keywords: ['health', 'fitness', 'steps', 'heart rate', 'sleep', 'weight', 'calories', 'exercise', 'wellness', 'blood pressure'],
    tools: ['get_health_summary', 'get_health_trends', 'get_health_metric', 'compare_health_periods'],
  },
  {
    category: 'erv',
    keywords: ['classify', 'entity type', 'relationship', 'bulk classify', 'erv'],
    tools: ['analyze_and_create_entity', 'suggest_entity_relationships', 'bulk_classify_entities'],
  },
  {
    category: 'background',
    keywords: ['background task', 'spawn', 'autonomous', 'agent task', 'delegate', 'iterate'],
    tools: ['spawn_task', 'list_background_tasks', 'cancel_background_task', 'get_task_result', 'iterate_on_code', 'delegate_to_specialist'],
  },
  {
    category: 'ai-settings',
    keywords: ['ai settings', 'provider', 'model', 'ollama', 'lynkr', 'openai', 'claude', 'anthropic'],
    tools: ['get_ai_provider_status', 'navigate_to_ai_settings'],
  },
];

// Tools always included (lightweight, universally useful for any conversation)
const BASE_TOOLS = new Set([
  'search_system',
  'navigate_to',
  'render_ui',
]);

/**
 * Dynamically select tools based on the user's message intent.
 *
 * Returns a small, relevant subset (typically 5-15 tools) instead of 120+.
 * Access control filtering should be applied BEFORE calling this function.
 */
export function selectToolsForMessage(
  message: string,
  allowedTools: ToolDefinition[]
): ToolDefinition[] {
  const msg = message.toLowerCase();
  const selectedToolNames = new Set(BASE_TOOLS);

  // Match message against each category's keywords
  for (const trigger of CATEGORY_TRIGGERS) {
    const matches = trigger.keywords.some(kw => msg.includes(kw));
    if (matches) {
      trigger.tools.forEach(t => selectedToolNames.add(t));
    }
  }

  // Filter to only tools the user has access to AND that were selected
  const selected = allowedTools.filter(tool => selectedToolNames.has(tool.name));

  // Safety: if nothing matched beyond base tools, include UI tools
  // so the system can still render rich responses
  if (selected.length <= BASE_TOOLS.size) {
    const fallback = ['show_weather', 'show_photos', 'list_themes', 'show_kanban_tasks', 'remember', 'recall_preference'];
    fallback.forEach(t => selectedToolNames.add(t));
    return allowedTools.filter(tool => selectedToolNames.has(tool.name));
  }

  return selected;
}
