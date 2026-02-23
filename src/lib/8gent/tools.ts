/**
 * 8gent Tools - Tool definitions for search and actions
 *
 * These tools enable 8gent to:
 * - Search portfolio projects, skills, and experience
 * - Navigate users to specific pages
 * - Schedule calls
 */

export interface ToolParameter {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  enum?: string[];
  required?: boolean;
  items?: { type: string; properties?: Record<string, { type: string }> }; // For array types
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, ToolParameter>;
    required: string[];
  };
  ownerOnly?: boolean; // If true, only available to owner access level
}

export interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
  action?: ToolAction;
  // Approval system (Phase 1.2 - OpenClaw Safety Stack)
  requiresApproval?: boolean;
  approval?: {
    required: boolean;
    reason: string;
    actionType: 'destructive' | 'first_use' | 'expensive' | 'external';
    toolName: string;
    toolArgs: Record<string, unknown>;
    consequences: string[];
    approvalId: string;
  };
  // Cost estimation (Phase 1.3 - OpenClaw Safety Stack)
  costEstimate?: {
    estimatedTokens?: number;
    estimatedTimeMs?: number;
    estimatedApiCalls?: number;
    estimatedCredits?: number;
    breakdown?: Array<{
      resource: string;
      amount: number;
      unit: string;
      cost?: number;
    }>;
    warning?: string;
    requiresConfirmation: boolean;
  };
}

// Actions that the frontend should handle
export interface ToolAction {
  type:
  | 'navigate'
  | 'open_calendar'
  | 'show_results'
  | 'show_available_times'
  | 'show_bookings'
  | 'booking_confirmed'
  | 'render_ui'
  | 'render_component'
  | 'open_search'
  | 'project_created'
  | 'prd_created'
  | 'ticket_created'
  | 'ticket_updated'
  | 'prd_sharded'
  | 'show_kanban'
  | 'memory_recalled'
  | 'memory_stored'
  | 'memory_learned'
  | 'memory_deleted'
  // Coding Agent Actions
  | 'repo_cloned'
  | 'file_read'
  | 'file_written'
  | 'directory_listed'
  | 'files_searched'
  | 'command_executed'
  | 'server_started'
  | 'preview_ready'
  | 'git_status'
  | 'git_diff'
  | 'git_committed'
  | 'git_pushed'
  | 'branch_created'
  | 'coding_task_created'
  | 'coding_task_updated'
  | 'context_updated'
  | 'context_loaded'
  // Cron Job Actions
  | 'cron_job_created'
  | 'cron_job_updated'
  | 'cron_job_deleted'
  | 'cron_jobs_listed'
  // Compaction Actions
  | 'conversation_compacted'
  | 'compaction_retrieved'
  // Channel Message Actions
  | 'message_sent'
  // ERV Dimension Actions
  | 'dimension_created'
  | 'dimension_navigated'
  | 'dimensions_listed'
  | 'entities_searched'
  // Video/Remotion Actions
  | 'video_composition_created'
  | 'video_layer_added'
  | 'video_lyrics_added'
  | 'video_render_started'
  | 'video_render_status'
  | 'video_render_complete'
  | 'video_preview_ready'
  | 'lyrics_synced'
  // Talking Video Actions
  | 'talking_video_script_generated'
  | 'talking_video_voice_generated'
  | 'talking_video_background_generated'
  | 'talking_video_complete'
  | 'talking_video_error'
  // LTX-2 Video Generation Actions
  | 'video_generated'
  | 'image_animated'
  | 'video_presets_listed'
  // Autonomous Execution Actions
  | 'task_spawned'
  | 'task_progress'
  | 'task_completed'
  | 'task_failed'
  | 'task_cancelled'
  | 'tasks_listed'
  | 'iteration_started'
  | 'iteration_progress'
  | 'iteration_completed'
  | 'specialist_delegated'
  // AI Provider Actions
  | 'check_provider_status'
  // Design Canvas Actions
  | 'canvas_created'
  | 'canvases_listed'
  | 'canvas_retrieved'
  | 'canvas_node_added'
  | 'canvas_edge_added'
  | 'canvas_node_updated'
  // ERV Ontology Actions
  | 'entity_classified'
  | 'relationships_suggested'
  | 'bulk_classification_complete'
  // Music Generation Actions
  | 'music_generated'
  | 'audio_analyzed'
  | 'stems_separated'
  | 'music_generation_started'
  | 'music_generation_progress'
  | 'music_generation_failed';
  payload: Record<string, unknown>;
}

// Available navigation destinations
export const NAVIGATION_DESTINATIONS = [
  'home',
  'story',
  'design',
  'resume',
  'projects',
  'blog',
  'music',
  'humans',
  'themes',
  'photos',
  'search',
  'video',
  'canvas',
] as const;

export type NavigationDestination = (typeof NAVIGATION_DESTINATIONS)[number];

// Tool definitions for OpenAI function calling
export const CLAW_AI_TOOLS: ToolDefinition[] = [
  {
    name: 'search_system',
    description:
      'Search through the system including projects, skills, work experience, and educational architecture. Use this when users ask about system capabilities, background, or modules.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'The search query. Can be a technology name (React, AI), skill, company name, project name, or general topic.',
        },
        category: {
          type: 'string',
          description: 'Optional filter by category',
          enum: ['projects', 'skills', 'work', 'education', 'all'],
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'navigate_to',
    description:
      'Navigate the user to a specific page in the workspace. Use this when users want to see specific content like the design showcase, system modules, projects, blog, or music.',
    parameters: {
      type: 'object',
      properties: {
        destination: {
          type: 'string',
          description: 'The page to navigate to',
          enum: [...NAVIGATION_DESTINATIONS],
        },
        theme: {
          type: 'string',
          description:
            'Optional theme name to apply when navigating (e.g., "claude", "cyberpunk", "nature")',
        },
      },
      required: ['destination'],
    },
  },
  {
    name: 'schedule_call',
    description:
      'Open the calendar to schedule a call with the system owner. Use this when users express interest in connecting or collaborating.',
    parameters: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description:
            'The topic or reason for the call to prefill in the calendar',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_available_times',
    description:
      'Get available meeting times for a specific date. Use this when users ask about availability or want to know when they can schedule a meeting.',
    parameters: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description:
            'The date to check availability for in YYYY-MM-DD format. If not provided, defaults to today.',
        },
        duration: {
          type: 'number',
          description:
            'The meeting duration in minutes. Defaults to 30 minutes if not specified.',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_upcoming_bookings',
    description:
      'Get the upcoming scheduled meetings. Use this when users ask about the schedule or upcoming appointments.',
    parameters: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of bookings to return. Defaults to 5.',
        },
      },
      required: [],
    },
  },
  {
    name: 'book_meeting',
    description:
      'Book a meeting directly. Use this when a user wants to schedule a specific time slot and has provided their name and email.',
    parameters: {
      type: 'object',
      properties: {
        guestName: {
          type: 'string',
          description: 'The name of the person booking the meeting.',
        },
        guestEmail: {
          type: 'string',
          description: 'The email address of the person booking the meeting.',
        },
        startTime: {
          type: 'number',
          description: 'The Unix timestamp for the meeting start time.',
        },
        topic: {
          type: 'string',
          description: 'The topic or reason for the meeting.',
        },
        duration: {
          type: 'number',
          description: 'Meeting duration in minutes. Defaults to 30.',
        },
      },
      required: ['guestName', 'guestEmail', 'startTime'],
    },
  },
  {
    name: 'reschedule_meeting',
    description:
      'Reschedule an existing meeting to a new time. Use this when a user wants to change the time of an already scheduled meeting.',
    parameters: {
      type: 'object',
      properties: {
        bookingId: {
          type: 'string',
          description: 'The ID of the booking to reschedule.',
        },
        newStartTime: {
          type: 'number',
          description: 'The new Unix timestamp for the meeting start time.',
        },
      },
      required: ['bookingId', 'newStartTime'],
    },
  },
  {
    name: 'cancel_meeting',
    description:
      'Cancel a scheduled meeting. Use this when a user wants to cancel an existing booking.',
    parameters: {
      type: 'object',
      properties: {
        bookingId: {
          type: 'string',
          description: 'The ID of the booking to cancel.',
        },
        reason: {
          type: 'string',
          description: 'Optional reason for cancellation.',
        },
      },
      required: ['bookingId'],
    },
  },
  {
    name: 'list_themes',
    description:
      'List all available design themes in the workspace. Use this when users ask about themes, design options, or want to explore the design showcase.',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Optional filter by theme style',
          enum: ['all', 'dark', 'light', 'colorful', 'minimal'],
        },
      },
      required: [],
    },
  },
  {
    name: 'open_search_app',
    description:
      'Open the Search app with a specific query. Use this when users want to explore search results in detail, or when search results would be better viewed in the full Search app rather than inline in chat. This closes the 8gent chat and opens the Search app with the query pre-filled.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query to pre-fill in the Search app',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'show_weather',
    description:
      'Display a weather widget in the chat. Use this when users ask about weather or want to see current conditions.',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The location for weather (defaults to San Francisco)',
        },
      },
      required: [],
    },
  },
  {
    name: 'show_kanban_tasks',
    description:
      'Display kanban tasks/tickets in the chat. Use this when users ask about projects, tasks, or want to see the roadmap.',
    parameters: {
      type: 'object',
      properties: {
        filter: {
          type: 'string',
          description: 'Filter tasks by status',
          enum: ['all', 'todo', 'in-progress', 'done', 'backlog'],
        },
        tag: {
          type: 'string',
          description: 'Optional tag to filter by (e.g., "P8", "claw-ai")',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of tasks to show (default 5)',
        },
      },
      required: [],
    },
  },
  {
    name: 'show_photos',
    description:
      'Display photos from the gallery in the chat. Use this when users ask to see photos, images, or the gallery.',
    parameters: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Number of photos to show (default 6)',
        },
      },
      required: [],
    },
  },
  {
    name: 'render_ui',
    description:
      'Render custom UI components in the chat using a JSON UI tree. Use this to display rich, interactive UI when the built-in tools are not sufficient. You can create cards, lists, charts, stats, timelines, and many other components. The UI tree uses a flat structure with a root element and nested children.',
    parameters: {
      type: 'object',
      properties: {
        ui_tree: {
          type: 'object',
          description:
            'A UI tree object with "root" (string key) and "elements" (object mapping keys to element definitions). Each element has: type (component name), props (component props), children (optional array of child keys), and key (unique identifier).',
        },
        title: {
          type: 'string',
          description: 'Optional title to show above the rendered UI',
        },
      },
      required: ['ui_tree'],
    },
  },
  // ==========================================================================
  // Agentic Product Lifecycle Tools (ARC-002, ARC-003, ARC-006, ARC-007, ARC-009)
  // Inspired by BMAD-METHOD and CCPM
  // ==========================================================================
  {
    name: 'create_project',
    description:
      'Create a new product project. Use this when users want to start a new product initiative, app idea, or feature set. This creates a project container that can hold PRDs, epics, and tickets.',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the project (e.g., "Weather App", "User Authentication")',
        },
        description: {
          type: 'string',
          description: 'A brief description of what this project aims to accomplish',
        },
        color: {
          type: 'string',
          description: 'Optional hex color for the project (e.g., "#8b5cf6"). Defaults to purple.',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'create_prd',
    description:
      'Create a Product Requirements Document (PRD) for a project. Use this when users want to define requirements, write specs, or document what they want to build. The PRD follows BMAD methodology with executive summary, problem statement, and functional requirements.',
    parameters: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the project to create the PRD for',
        },
        title: {
          type: 'string',
          description: 'The title of the PRD (e.g., "User Authentication PRD")',
        },
        executiveSummary: {
          type: 'string',
          description: 'A brief executive summary of what this PRD covers',
        },
        problemStatement: {
          type: 'string',
          description: 'The problem this product/feature solves',
        },
      },
      required: ['projectId', 'title'],
    },
  },
  {
    name: 'create_ticket',
    description:
      'Create a new ticket/story on the Kanban board. Use this when users want to add a task, bug, or story to track work. Tickets can optionally use the user story format (As a... I want... So that...).',
    parameters: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the project to add the ticket to',
        },
        title: {
          type: 'string',
          description: 'The title of the ticket',
        },
        description: {
          type: 'string',
          description: 'Detailed description of the ticket',
        },
        type: {
          type: 'string',
          description: 'The type of ticket',
          enum: ['story', 'bug', 'task', 'spike', 'chore'],
        },
        priority: {
          type: 'string',
          description: 'Priority level (P0=critical, P1=high, P2=medium, P3=low)',
          enum: ['P0', 'P1', 'P2', 'P3'],
        },
        asA: {
          type: 'string',
          description: 'User story format: "As a [user type]"',
        },
        iWant: {
          type: 'string',
          description: 'User story format: "I want [capability]"',
        },
        soThat: {
          type: 'string',
          description: 'User story format: "So that [benefit]"',
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
          description: 'Labels/tags for the ticket',
        },
      },
      required: ['projectId', 'title'],
    },
  },
  {
    name: 'update_ticket',
    description:
      'Update an existing ticket on the Kanban board. Use this to change status, priority, description, or any other ticket field. Can move tickets between columns.',
    parameters: {
      type: 'object',
      properties: {
        ticketId: {
          type: 'string',
          description: 'The human-readable ticket ID (e.g., "PROJ-001")',
        },
        status: {
          type: 'string',
          description: 'New status for the ticket',
          enum: ['backlog', 'todo', 'in_progress', 'review', 'done', 'cancelled'],
        },
        priority: {
          type: 'string',
          description: 'New priority level',
          enum: ['P0', 'P1', 'P2', 'P3'],
        },
        title: {
          type: 'string',
          description: 'New title for the ticket',
        },
        description: {
          type: 'string',
          description: 'New description for the ticket',
        },
        assigneeId: {
          type: 'string',
          description: 'User ID to assign the ticket to, or "claw-ai" for AI execution',
        },
      },
      required: ['ticketId'],
    },
  },
  {
    name: 'shard_prd',
    description:
      'Shard a PRD into epics and tickets. This converts the functional requirements in a PRD into actionable Kanban tickets grouped by epics. Use this when a PRD is complete and ready for implementation planning.',
    parameters: {
      type: 'object',
      properties: {
        prdId: {
          type: 'string',
          description: 'The ID of the PRD to shard',
        },
        projectId: {
          type: 'string',
          description: 'The ID of the project the PRD belongs to',
        },
      },
      required: ['prdId', 'projectId'],
    },
  },
  {
    name: 'get_project_kanban',
    description:
      'Get the Kanban board for a specific project. Shows all tickets organized by status columns (backlog, todo, in_progress, review, done).',
    parameters: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the project to get the Kanban board for',
        },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'list_projects',
    description:
      'List all product projects. Use this when users want to see their projects, switch between projects, or find a specific project.',
    parameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Optional filter by project status',
          enum: ['discovery', 'design', 'planning', 'building', 'launched', 'archived'],
        },
      },
      required: [],
    },
  },
  // ==========================================================================
  // Memory Tools (RLM - Recursive Memory Layer)
  // These tools enable 8gent to actively manage memories for the owner
  // Only available when speaking with James (owner identity)
  // ==========================================================================
  {
    name: 'remember',
    description:
      'Search through memories to recall past interactions, decisions, preferences, and milestones. Use this when you need historical context to provide a better response. Only works for the owner.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query to find relevant memories (e.g., "design decisions for 8gent", "preferences about UI", "milestones this month")',
        },
        memoryType: {
          type: 'string',
          description: 'Optional filter by memory type',
          enum: ['all', 'interaction', 'decision', 'preference', 'feedback', 'milestone'],
        },
        limit: {
          type: 'number',
          description: 'Maximum number of memories to return (default 10)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'recall_preference',
    description:
      'Recall specific preferences, patterns, or learned facts about the owner. Use this when you need to remember preferences (coding style, design choices, communication style) or patterns (work habits, typical workflows). Only works for the owner.',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'The category of preference to recall',
          enum: ['preference', 'skill', 'pattern', 'fact'],
        },
        key: {
          type: 'string',
          description: 'Optional specific key to look up (e.g., "coding_style", "preferred_theme")',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'memorize',
    description:
      'Store an important memory explicitly. Use this when something significant is mentioned that should be remembered: important decisions, preferences, milestones, or anything explicitly requested to be remembered. Only works for the owner.',
    parameters: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'The content to memorize (what happened, what was decided, what preference was expressed)',
        },
        memoryType: {
          type: 'string',
          description: 'The type of memory to store',
          enum: ['interaction', 'decision', 'preference', 'feedback', 'milestone'],
        },
        importance: {
          type: 'number',
          description: 'Importance score from 0 to 1 (default 0.7). Higher = more likely to be recalled.',
        },
        projectId: {
          type: 'string',
          description: 'Optional project ID to associate this memory with',
        },
      },
      required: ['content', 'memoryType'],
    },
  },
  {
    name: 'learn',
    description:
      'Learn a new fact, preference, skill, or pattern about the owner. Use this to update your understanding based on what you are told or what you observe. This creates or updates semantic memory. Only works for the owner.',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'The category of knowledge being learned',
          enum: ['preference', 'skill', 'pattern', 'fact'],
        },
        key: {
          type: 'string',
          description: 'A unique key for this piece of knowledge (e.g., "preferred_font", "coding_language_primary")',
        },
        value: {
          type: 'string',
          description: 'The value/content of this knowledge (e.g., "Inter", "TypeScript")',
        },
        confidence: {
          type: 'number',
          description: 'Confidence level from 0 to 1 (default 0.7). Higher = more certain this is accurate.',
        },
      },
      required: ['category', 'key', 'value'],
    },
  },
  {
    name: 'forget',
    description:
      'Remove a specific memory. Use this when explicitly asked to forget something, or when a memory is no longer accurate/relevant. Be careful - this permanently deletes the memory. Only works for the owner.',
    parameters: {
      type: 'object',
      properties: {
        memoryId: {
          type: 'string',
          description: 'The ID of the memory to delete',
        },
        memoryKind: {
          type: 'string',
          description: 'Whether this is an episodic memory (event/interaction) or semantic memory (fact/preference)',
          enum: ['episodic', 'semantic'],
        },
      },
      required: ['memoryId', 'memoryKind'],
    },
  },
  // ==========================================================================
  // OpenClaw Coding Tools - Full coding agent capabilities
  // These tools enable 8gent to clone repos, read/write files, execute
  // commands, and manage git operations. Only available for owner access level.
  // @see docs/planning/infinity-agent-coding-integration.md
  // ==========================================================================

  // --------------------------------------------------------------------------
  // Working Context Tools - "Everything is Everything"
  // --------------------------------------------------------------------------
  {
    name: 'set_active_context',
    description:
      'Set the active working context. Use this when starting work on a specific project, ticket, or when the user @mentions an entity. This updates the context layer so all subsequent operations know what you are working on.',
    parameters: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The ID of the active project',
        },
        projectSlug: {
          type: 'string',
          description: 'The slug of the active project (e.g., "8gent")',
        },
        prdId: {
          type: 'string',
          description: 'The ID of the active PRD',
        },
        ticketId: {
          type: 'string',
          description: 'The ID of the active ticket',
        },
        canvasId: {
          type: 'string',
          description: 'The ID of the active design canvas',
        },
        sandboxId: {
          type: 'string',
          description: 'The ID of the active sandbox',
        },
        repositoryUrl: {
          type: 'string',
          description: 'The URL of the active repository',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_active_context',
    description:
      'Get the current active working context including resolved entity details. Use this to understand what project, ticket, or PRD the user is currently working on before performing operations.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'load_context_from_reference',
    description:
      'Load full context chain from an @mention reference. When user mentions @ticket:ARC-042, this loads the ticket plus its parent project, PRD, epic, and related tickets. Use this to build rich context from a single reference.',
    parameters: {
      type: 'object',
      properties: {
        referenceType: {
          type: 'string',
          description: 'The type of reference being loaded',
          enum: ['ticket', 'project', 'prd', 'epic', 'canvas', 'memory'],
        },
        referenceId: {
          type: 'string',
          description: 'The ID of the referenced entity (e.g., the ticket ID for @ticket:ARC-042)',
        },
      },
      required: ['referenceType', 'referenceId'],
    },
  },

  // --------------------------------------------------------------------------
  // Repository Operations
  // --------------------------------------------------------------------------
  {
    name: 'clone_repository',
    description:
      'Clone a GitHub repository to the sandbox environment. Use this when starting work on a codebase or when the user asks to work on a specific repo. This creates a sandbox with the repo ready for reading, writing, and executing code.',
    parameters: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The GitHub repository URL (e.g., "https://github.com/owner/repo")',
        },
        branch: {
          type: 'string',
          description: 'Optional branch to checkout (defaults to main/master)',
        },
      },
      required: ['url'],
    },
  },
  {
    name: 'list_directory',
    description:
      'List files and directories in a path within the sandbox. Use this to explore the codebase structure, find files, or understand the project layout.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The path to list (relative to repo root). Use "." or "/" for root.',
        },
        recursive: {
          type: 'boolean',
          description: 'If true, list files recursively (default: false)',
        },
        maxDepth: {
          type: 'number',
          description: 'Maximum depth for recursive listing (default: 3)',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'search_codebase',
    description:
      'Search for text patterns in the codebase using grep/ripgrep. Use this to find function definitions, imports, usages, or any text pattern in the code.',
    parameters: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'The search pattern (supports regex)',
        },
        path: {
          type: 'string',
          description: 'Optional path to search within (defaults to entire repo)',
        },
        filePattern: {
          type: 'string',
          description: 'Optional file pattern filter (e.g., "*.ts", "*.tsx")',
        },
        caseSensitive: {
          type: 'boolean',
          description: 'Whether search is case-sensitive (default: false)',
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of results to return (default: 50)',
        },
      },
      required: ['pattern'],
    },
  },

  // --------------------------------------------------------------------------
  // File Operations
  // --------------------------------------------------------------------------
  {
    name: 'read_file',
    description:
      'Read the contents of a file from the sandbox. Use this to examine code, configuration files, or any text file. For large files, you can read specific line ranges.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The path to the file (relative to repo root)',
        },
        startLine: {
          type: 'number',
          description: 'Optional starting line number (1-indexed)',
        },
        endLine: {
          type: 'number',
          description: 'Optional ending line number (1-indexed)',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'write_file',
    description:
      'Write content to a file in the sandbox. Use this to create new files or replace entire file contents. For surgical edits to existing files, prefer the edit_file tool.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The path to write to (relative to repo root)',
        },
        content: {
          type: 'string',
          description: 'The content to write to the file',
        },
        createDirectories: {
          type: 'boolean',
          description: 'Create parent directories if they do not exist (default: true)',
        },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'edit_file',
    description:
      'Make surgical edits to a file using search and replace. Use this for targeted changes to specific sections of a file. More precise than write_file for modifications.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The path to the file (relative to repo root)',
        },
        oldText: {
          type: 'string',
          description: 'The exact text to find and replace',
        },
        newText: {
          type: 'string',
          description: 'The text to replace it with',
        },
        replaceAll: {
          type: 'boolean',
          description: 'Replace all occurrences (default: false, replaces first only)',
        },
      },
      required: ['path', 'oldText', 'newText'],
    },
  },
  {
    name: 'delete_file',
    description:
      'Delete a file or directory from the sandbox. Use with caution. For directories, must explicitly set recursive=true.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The path to delete (relative to repo root)',
        },
        recursive: {
          type: 'boolean',
          description: 'Required for directories - delete recursively',
        },
      },
      required: ['path'],
    },
  },

  // --------------------------------------------------------------------------
  // Execution
  // --------------------------------------------------------------------------
  {
    name: 'run_command',
    description:
      'Execute a shell command in the sandbox. Use this to run build commands, install dependencies, run tests, or any shell operation. Commands run in the repo root by default.',
    parameters: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'The command to execute (e.g., "npm install", "pnpm build")',
        },
        cwd: {
          type: 'string',
          description: 'Optional working directory (relative to repo root)',
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds (default: 60000)',
        },
      },
      required: ['command'],
    },
  },
  {
    name: 'start_dev_server',
    description:
      'Start a development server in the sandbox. Use this to preview the application. Returns a preview URL that can be accessed in the browser.',
    parameters: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'The command to start the server (e.g., "npm run dev", "pnpm dev")',
        },
        port: {
          type: 'number',
          description: 'The port the server will run on (default: 3000)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_preview_url',
    description:
      'Get the preview URL for the running sandbox. Use this after starting a dev server to get the URL where the app can be previewed.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },

  // --------------------------------------------------------------------------
  // Git Operations
  // --------------------------------------------------------------------------
  {
    name: 'git_status',
    description:
      'Get the current git status showing modified, added, and deleted files. Use this to see what changes have been made before committing.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'git_diff',
    description:
      'Show the diff of changes in the working tree. Use this to review specific changes before committing.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Optional path to diff a specific file',
        },
        staged: {
          type: 'boolean',
          description: 'Show diff of staged changes only (default: false shows unstaged)',
        },
      },
      required: [],
    },
  },
  {
    name: 'git_commit',
    description:
      'Commit staged changes with a message. Use this after making changes that should be saved as a commit. Stage files first using git_add.',
    parameters: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'The commit message describing the changes',
        },
        stageAll: {
          type: 'boolean',
          description: 'Stage all modified files before committing (default: false)',
        },
      },
      required: ['message'],
    },
  },
  {
    name: 'git_push',
    description:
      'Push commits to the remote repository. Use this after committing to sync changes with GitHub. May require authentication for private repos.',
    parameters: {
      type: 'object',
      properties: {
        branch: {
          type: 'string',
          description: 'The branch to push (defaults to current branch)',
        },
        setUpstream: {
          type: 'boolean',
          description: 'Set upstream tracking for the branch (default: true for new branches)',
        },
      },
      required: [],
    },
  },
  {
    name: 'create_branch',
    description:
      'Create and checkout a new git branch. Use this to start work on a feature or fix. Can auto-generate branch names from the active ticket context.',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The branch name. If not provided, generates from active ticket (e.g., "feature/arc-042-fix-bug")',
        },
        fromBranch: {
          type: 'string',
          description: 'The branch to create from (defaults to current branch)',
        },
      },
      required: [],
    },
  },

  // --------------------------------------------------------------------------
  // Coding Task Management
  // --------------------------------------------------------------------------
  {
    name: 'create_coding_task',
    description:
      'Create a new coding task to track work. Links to projects/tickets and maintains conversation history. Use this when starting a significant coding session.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title describing the coding task',
        },
        description: {
          type: 'string',
          description: 'Detailed description of what needs to be done',
        },
        projectId: {
          type: 'string',
          description: 'Optional project ID to link this task to',
        },
        ticketId: {
          type: 'string',
          description: 'Optional ticket ID this task implements',
        },
        repositoryUrl: {
          type: 'string',
          description: 'The repository URL for this task',
        },
      },
      required: ['title', 'description'],
    },
  },
  {
    name: 'update_coding_task',
    description:
      'Update the status or details of a coding task. Use this to mark tasks as completed, failed, or update progress.',
    parameters: {
      type: 'object',
      properties: {
        taskId: {
          type: 'string',
          description: 'The ID of the coding task to update',
        },
        status: {
          type: 'string',
          description: 'New status for the task',
          enum: ['pending', 'running', 'waiting_input', 'completed', 'failed', 'cancelled'],
        },
        filesModified: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of files that were modified',
        },
        commitSha: {
          type: 'string',
          description: 'The commit SHA if changes were committed',
        },
      },
      required: ['taskId'],
    },
  },
  {
    name: 'list_coding_tasks',
    description:
      'List coding tasks for the current user. Use this to see recent or active coding sessions.',
    parameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Optional filter by status',
          enum: ['pending', 'running', 'waiting_input', 'completed', 'failed', 'cancelled'],
        },
        limit: {
          type: 'number',
          description: 'Maximum number of tasks to return (default: 10)',
        },
      },
      required: [],
    },
  },

  // =========================================================================
  // Cron Jobs / Scheduled Automation
  // User-defined scheduled jobs similar to Clawdbot's cron system
  // =========================================================================
  {
    name: 'create_cron_job',
    description:
      'Create a scheduled job that runs automatically. Use this when the user wants to set up recurring reminders, automated AI messages, email notifications, or webhook triggers. Examples: "Remind me every day at 9am to check emails", "Send me a summary every Monday morning", "Run a health check webhook every hour".',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'A short, descriptive name for the job (e.g., "Daily standup reminder", "Weekly summary")',
        },
        description: {
          type: 'string',
          description: 'Optional longer description of what this job does',
        },
        scheduleType: {
          type: 'string',
          description: 'How often the job should run',
          enum: ['once', 'interval', 'daily', 'weekly'],
        },
        scheduleTime: {
          type: 'string',
          description: 'When to run. For "once": ISO date string. For "daily"/"weekly": time in HH:MM format (24h). For "interval": number of minutes.',
        },
        daysOfWeek: {
          type: 'array',
          items: { type: 'number' },
          description: 'For weekly jobs: which days to run (0=Sunday, 1=Monday, etc.)',
        },
        actionType: {
          type: 'string',
          description: 'What the job should do when triggered',
          enum: ['ai_message', 'email', 'webhook'],
        },
        prompt: {
          type: 'string',
          description: 'For ai_message: the prompt to send to 8gent when the job runs',
        },
        emailSubject: {
          type: 'string',
          description: 'For email: the subject line',
        },
        emailBody: {
          type: 'string',
          description: 'For email: the message body',
        },
        recipientEmail: {
          type: 'string',
          description: 'For email: who to send to (defaults to user email)',
        },
        webhookUrl: {
          type: 'string',
          description: 'For webhook: the URL to call',
        },
        deliveryChannel: {
          type: 'string',
          description: 'Where to deliver AI responses (for ai_message jobs)',
          enum: ['web', 'email', 'whatsapp', 'telegram'],
        },
        timezone: {
          type: 'string',
          description: 'Timezone for scheduling (e.g., "America/Los_Angeles", "Europe/London"). Defaults to UTC.',
        },
      },
      required: ['name', 'scheduleType', 'actionType'],
    },
  },
  {
    name: 'list_cron_jobs',
    description:
      'List all scheduled jobs for the user. Use this when the user asks about their scheduled tasks, reminders, or automations.',
    parameters: {
      type: 'object',
      properties: {
        includeInactive: {
          type: 'boolean',
          description: 'Whether to include paused/inactive jobs. Defaults to false.',
        },
      },
      required: [],
    },
  },
  {
    name: 'toggle_cron_job',
    description:
      'Pause or resume a scheduled job. Use this when the user wants to temporarily disable a job without deleting it.',
    parameters: {
      type: 'object',
      properties: {
        jobId: {
          type: 'string',
          description: 'The ID of the job to toggle',
        },
      },
      required: ['jobId'],
    },
  },
  {
    name: 'delete_cron_job',
    description:
      'Permanently delete a scheduled job. Use this when the user wants to remove a job they no longer need.',
    parameters: {
      type: 'object',
      properties: {
        jobId: {
          type: 'string',
          description: 'The ID of the job to delete',
        },
      },
      required: ['jobId'],
    },
  },

  // ==========================================================================
  // Conversation Compaction Tools
  // ==========================================================================
  {
    name: 'compact_conversation',
    description:
      'Compress older messages in the conversation into a summary to save context space. ' +
      'Use this when the user asks to summarize or compact the conversation, or when the ' +
      'conversation is getting very long. This preserves key context while reducing token usage.',
    parameters: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          description: 'The chat session ID to compact',
        },
        keepRecentCount: {
          type: 'number',
          description: 'Number of recent messages to keep uncompacted (default: 10)',
        },
        instructions: {
          type: 'string',
          description: 'Optional focus instructions for what to emphasize in the summary',
        },
      },
      required: ['sessionId'],
    },
  },
  {
    name: 'get_compaction_summary',
    description:
      'Retrieve the existing compaction summary for a conversation session. ' +
      'Use this to recall context from earlier in a long conversation.',
    parameters: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          description: 'The chat session ID to get compaction for',
        },
      },
      required: ['sessionId'],
    },
  },

  // ==========================================================================
  // Channel Integration Tools - WhatsApp, Telegram, iMessage, Slack, Discord
  // ==========================================================================
  {
    name: 'list_channel_integrations',
    description:
      'List all connected messaging platform integrations. Use this to see which ' +
      'channels (WhatsApp, Telegram, iMessage, Slack, Discord) are connected and their status.',
    parameters: {
      type: 'object',
      properties: {
        includeDisabled: {
          type: 'boolean',
          description: 'Include disabled integrations (default: false)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_channel_conversations',
    description:
      'Get recent conversations from connected messaging platforms. Returns a unified ' +
      'inbox view with contact info, last message, and unread counts.',
    parameters: {
      type: 'object',
      properties: {
        platform: {
          type: 'string',
          enum: ['whatsapp', 'telegram', 'imessage', 'slack', 'discord'],
          description: 'Filter by specific platform (optional)',
        },
        limit: {
          type: 'number',
          description: 'Maximum conversations to return (default: 20)',
        },
      },
      required: [],
    },
  },
  {
    name: 'send_channel_message',
    description:
      'Send a message via a connected messaging platform. Use this to reply to ' +
      'conversations or send proactive messages through WhatsApp, Telegram, etc. ' +
      'OWNER ONLY: Only the owner can send outbound messages.',
    parameters: {
      type: 'object',
      properties: {
        integrationId: {
          type: 'string',
          description: 'The channel integration ID to send through',
        },
        recipientId: {
          type: 'string',
          description: 'The recipient identifier (phone number, chat ID, etc.)',
        },
        content: {
          type: 'string',
          description: 'Message content to send',
        },
        messageType: {
          type: 'string',
          enum: ['text', 'voice'],
          description: 'Message type (default: text)',
        },
      },
      required: ['integrationId', 'recipientId', 'content'],
    },
    ownerOnly: true,
  },
  {
    name: 'search_channel_messages',
    description:
      'Search messages across all connected messaging platforms. Useful for finding ' +
      'past conversations, tracking topics, or locating specific information.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        platform: {
          type: 'string',
          enum: ['whatsapp', 'telegram', 'imessage', 'slack', 'discord'],
          description: 'Filter by specific platform (optional)',
        },
        limit: {
          type: 'number',
          description: 'Maximum results to return (default: 20)',
        },
      },
      required: ['query'],
    },
  },

  // =============================================================================
  // ERV Dimension Tools
  // =============================================================================

  {
    name: 'create_dimension',
    description:
      'Create a custom dimension view for entities. Use this when users want to ' +
      'visualize their data in a new way, like "show me my tasks as a constellation" ' +
      'or "create a timeline of my projects". Dimensions define how entities are ' +
      'arranged, styled, and connected.',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name for the dimension (e.g., "Task Constellation", "Project Timeline")',
        },
        metaphor: {
          type: 'string',
          description:
            'Visual metaphor for the dimension. Affects styling and arrangement.',
          enum: [
            'river',
            'board',
            'constellation',
            'solar',
            'timeline',
            'mosaic',
            'ledger',
            'vinyl',
            'dungeon',
            'tree',
          ],
        },
        arrangement: {
          type: 'string',
          description: 'How entities are arranged spatially',
          enum: ['list', 'grid', 'graph', 'tree', 'flow', 'orbit', 'stack'],
        },
        entityTypes: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Types of entities to include (e.g., ["Ticket", "Project"]). Leave empty for all.',
        },
        description: {
          type: 'string',
          description: 'Optional description of what this dimension shows',
        },
      },
      required: ['name', 'metaphor', 'arrangement'],
    },
  },
  {
    name: 'navigate_to_dimension',
    description:
      'Navigate to a dimension view. Use this when users want to see a specific ' +
      'dimension like "show me the kanban", "open the graph view", or "go to my feed". ' +
      'Can navigate to preset dimensions or custom ones created by the user.',
    parameters: {
      type: 'object',
      properties: {
        dimensionId: {
          type: 'string',
          description:
            'ID of the dimension to navigate to. Presets: feed, kanban, graph, graph-3d, ' +
            'calendar, grid, table, ipod, quest-log, skill-tree. Or a custom dimension ID.',
        },
      },
      required: ['dimensionId'],
    },
  },
  {
    name: 'list_dimensions',
    description:
      'List all available dimensions including presets and custom user dimensions. ' +
      'Use this when users ask "what views do I have?" or "show me available dimensions".',
    parameters: {
      type: 'object',
      properties: {
        includePresets: {
          type: 'boolean',
          description: 'Whether to include preset dimensions (default: true)',
        },
      },
      required: [],
    },
  },
  {
    name: 'search_entities',
    description:
      'Search across all entities in the ERV system. Use this when users ask about ' +
      'their data like "find all high priority tickets", "show me projects tagged with AI", ' +
      'or "what tracks do I have from last month".',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query to find entities',
        },
        entityTypes: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Filter by entity types (e.g., ["Ticket", "Project", "Track"]). Leave empty for all.',
        },
        limit: {
          type: 'number',
          description: 'Maximum results to return (default: 20)',
        },
      },
      required: ['query'],
    },
  },

  // =============================================================================
  // Video/Remotion Tools
  // =============================================================================

  {
    name: 'create_video_composition',
    description:
      'Create a new video composition for creating videos, presentations, or lyric videos. ' +
      'Use this when users want to create video content like "make a lyric video for this song", ' +
      '"create a presentation video", or "add text overlays to this video".',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name for the video composition',
        },
        type: {
          type: 'string',
          description: 'Type of video to create',
          enum: ['lyric-video', 'presentation', 'text-overlay', 'social-story', 'music-visualizer', 'slideshow', 'custom'],
        },
        preset: {
          type: 'string',
          description: 'Video format preset',
          enum: ['instagram-story', 'instagram-post', 'instagram-reel', 'tiktok', 'youtube', 'youtube-short', 'twitter', '1080p', '720p', '4k', 'square', 'portrait'],
        },
        durationSeconds: {
          type: 'number',
          description: 'Duration of the video in seconds (default: 30)',
        },
        backgroundColor: {
          type: 'string',
          description: 'Background color (hex or CSS color)',
        },
        backgroundGradient: {
          type: 'string',
          description: 'Background gradient (CSS gradient string)',
        },
      },
      required: ['name', 'type'],
    },
  },
  {
    name: 'add_text_overlay',
    description:
      'Add a text overlay to a video composition. Use this to add titles, captions, ' +
      'watermarks, or any text content to videos. Supports animations and positioning.',
    parameters: {
      type: 'object',
      properties: {
        compositionId: {
          type: 'string',
          description: 'ID of the video composition to add text to',
        },
        text: {
          type: 'string',
          description: 'The text content to display',
        },
        position: {
          type: 'string',
          description: 'Position on screen',
          enum: ['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'],
        },
        startTime: {
          type: 'number',
          description: 'When the text appears (in seconds)',
        },
        duration: {
          type: 'number',
          description: 'How long the text stays on screen (in seconds)',
        },
        fontSize: {
          type: 'number',
          description: 'Font size in pixels (default: 32)',
        },
        color: {
          type: 'string',
          description: 'Text color (default: white)',
        },
        animation: {
          type: 'string',
          description: 'Entry animation for the text',
          enum: ['none', 'fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'scale', 'typewriter', 'blur', 'glitch'],
        },
      },
      required: ['compositionId', 'text'],
    },
  },
  {
    name: 'add_lyrics_to_video',
    description:
      'Add synchronized lyrics to a video composition. Creates karaoke-style lyric videos ' +
      'with word highlighting, bouncing text, or typewriter effects. Provide lyrics with timestamps.',
    parameters: {
      type: 'object',
      properties: {
        compositionId: {
          type: 'string',
          description: 'ID of the video composition',
        },
        audioSrc: {
          type: 'string',
          description: 'URL or path to the audio file',
        },
        lyrics: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              text: { type: 'string' },
              startTime: { type: 'number' },
              endTime: { type: 'number' },
            },
          },
          description: 'Array of lyric lines with timing: [{text, startTime, endTime}]',
        },
        style: {
          type: 'string',
          description: 'Lyric display style',
          enum: ['karaoke', 'subtitle', 'bounce', 'typewriter'],
        },
        fontFamily: {
          type: 'string',
          description: 'Font family for lyrics (default: Inter)',
        },
        color: {
          type: 'string',
          description: 'Text color for lyrics',
        },
        highlightColor: {
          type: 'string',
          description: 'Highlight color for active words (karaoke style)',
        },
        position: {
          type: 'string',
          description: 'Vertical position of lyrics',
          enum: ['top', 'center', 'bottom'],
        },
      },
      required: ['compositionId', 'audioSrc', 'lyrics'],
    },
  },
  {
    name: 'add_media_to_video',
    description:
      'Add an image or video layer to a composition. Use for backgrounds, overlays, ' +
      'or picture-in-picture effects.',
    parameters: {
      type: 'object',
      properties: {
        compositionId: {
          type: 'string',
          description: 'ID of the video composition',
        },
        mediaSrc: {
          type: 'string',
          description: 'URL or path to the media file (image or video)',
        },
        mediaType: {
          type: 'string',
          description: 'Type of media',
          enum: ['image', 'video'],
        },
        startTime: {
          type: 'number',
          description: 'When the media appears (in seconds)',
        },
        duration: {
          type: 'number',
          description: 'How long the media stays on screen (in seconds)',
        },
        position: {
          type: 'object',
          description: 'Position {x, y} in pixels',
        },
        scale: {
          type: 'number',
          description: 'Scale factor (1 = original size)',
        },
        opacity: {
          type: 'number',
          description: 'Opacity 0-1',
        },
        objectFit: {
          type: 'string',
          description: 'How the media fits its container',
          enum: ['contain', 'cover', 'fill'],
        },
      },
      required: ['compositionId', 'mediaSrc', 'mediaType'],
    },
  },
  {
    name: 'preview_video',
    description:
      'Generate a preview of a video composition. Opens the video player with the current ' +
      'composition state for review before rendering.',
    parameters: {
      type: 'object',
      properties: {
        compositionId: {
          type: 'string',
          description: 'ID of the video composition to preview',
        },
        openInCanvas: {
          type: 'boolean',
          description: 'Whether to open the preview in the infinite canvas (default: false)',
        },
      },
      required: ['compositionId'],
    },
  },
  {
    name: 'render_video',
    description:
      'Render a video composition to a downloadable MP4/WebM/GIF file. Use mode="sandbox" to ' +
      'render locally using ffmpeg.wasm (free, no cloud needed) or mode="server" for server-side ' +
      'rendering. Sandbox mode is recommended for videos under 60 seconds.',
    parameters: {
      type: 'object',
      properties: {
        compositionId: {
          type: 'string',
          description: 'ID of the video composition to render',
        },
        format: {
          type: 'string',
          description: 'Output format',
          enum: ['mp4', 'webm', 'gif'],
        },
        quality: {
          type: 'string',
          description: 'Quality preset (draft=fast/lower quality, high=best quality)',
          enum: ['draft', 'standard', 'high'],
        },
        mode: {
          type: 'string',
          description: 'Render mode: sandbox (local, free) or server (cloud, costs $)',
          enum: ['sandbox', 'server'],
        },
      },
      required: ['compositionId'],
    },
  },
  {
    name: 'sync_lyrics_to_audio',
    description:
      'Automatically sync lyrics text to an audio file using AI transcription. Takes raw lyrics ' +
      'and audio, returns timed lyric data ready for add_lyrics_to_video. Uses Whisper API for ' +
      'word-level timestamp detection.',
    parameters: {
      type: 'object',
      properties: {
        audioSrc: {
          type: 'string',
          description: 'URL or path to the audio file',
        },
        lyrics: {
          type: 'string',
          description: 'Raw lyrics text (one line per lyric line, no timestamps needed)',
        },
        language: {
          type: 'string',
          description: 'Language code (e.g., "en", "es", "fr"). Auto-detected if not specified.',
        },
      },
      required: ['audioSrc', 'lyrics'],
    },
  },
  {
    name: 'get_render_status',
    description:
      'Check the status of a video render job. Returns progress percentage, output URL when ' +
      'complete, or error message if failed.',
    parameters: {
      type: 'object',
      properties: {
        jobId: {
          type: 'string',
          description: 'The render job ID returned from render_video',
        },
      },
      required: ['jobId'],
    },
  },
  {
    name: 'add_particle_effect',
    description:
      'Add particle effects to a video composition. Creates confetti, snow, dust, sparks, ' +
      'or custom particles. Great for celebrations, atmosphere, and visual interest.',
    parameters: {
      type: 'object',
      properties: {
        compositionId: {
          type: 'string',
          description: 'ID of the video composition',
        },
        effect: {
          type: 'string',
          description: 'Type of particle effect',
          enum: ['confetti', 'snow', 'dust', 'sparks', 'bubbles', 'leaves', 'stars', 'custom'],
        },
        particleCount: {
          type: 'number',
          description: 'Number of particles (default: 100, max: 500)',
        },
        color: {
          type: 'string',
          description: 'Particle color (hex, CSS color, or "multi" for random colors)',
        },
        direction: {
          type: 'string',
          description: 'Direction of particle movement',
          enum: ['up', 'down', 'left', 'right', 'random', 'explode'],
        },
        speed: {
          type: 'number',
          description: 'Speed multiplier (default: 1)',
        },
        gravity: {
          type: 'number',
          description: 'Gravity effect (0 = no gravity, 1 = normal)',
        },
        startTime: {
          type: 'number',
          description: 'When particles start (in seconds)',
        },
        duration: {
          type: 'number',
          description: 'How long particles last (in seconds)',
        },
      },
      required: ['compositionId', 'effect'],
    },
  },
  {
    name: 'add_waveform_visualizer',
    description:
      'Add an audio waveform visualization to a video composition. Creates bars, lines, ' +
      'circles, or mirror effects that respond to audio frequencies. Perfect for music videos.',
    parameters: {
      type: 'object',
      properties: {
        compositionId: {
          type: 'string',
          description: 'ID of the video composition',
        },
        audioSrc: {
          type: 'string',
          description: 'URL or path to the audio file',
        },
        style: {
          type: 'string',
          description: 'Visualization style',
          enum: ['bars', 'line', 'circle', 'mirror', 'spectrum', 'pulse'],
        },
        color: {
          type: 'string',
          description: 'Waveform color (supports gradients with color1,color2 format)',
        },
        position: {
          type: 'string',
          description: 'Position of the waveform',
          enum: ['top', 'center', 'bottom', 'full'],
        },
        barWidth: {
          type: 'number',
          description: 'Width of bars in pixels (for bars style)',
        },
        smoothing: {
          type: 'number',
          description: 'Smoothing factor 0-1 (higher = smoother)',
        },
        sensitivity: {
          type: 'number',
          description: 'Audio sensitivity multiplier (default: 1)',
        },
      },
      required: ['compositionId', 'audioSrc', 'style'],
    },
  },
  {
    name: 'add_gradient_background',
    description:
      'Add an animated or static gradient background to a video composition. ' +
      'Supports linear, radial, and conic gradients with optional animation.',
    parameters: {
      type: 'object',
      properties: {
        compositionId: {
          type: 'string',
          description: 'ID of the video composition',
        },
        colors: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of colors for the gradient (2-5 colors)',
        },
        type: {
          type: 'string',
          description: 'Type of gradient',
          enum: ['linear', 'radial', 'conic'],
        },
        angle: {
          type: 'number',
          description: 'Angle in degrees (for linear gradient)',
        },
        animate: {
          type: 'boolean',
          description: 'Whether to animate the gradient rotation',
        },
        animationSpeed: {
          type: 'number',
          description: 'Degrees per second for animation (default: 30)',
        },
      },
      required: ['compositionId', 'colors'],
    },
  },
  {
    name: 'create_slideshow',
    description:
      'Create an automatic slideshow from multiple images. Applies Ken Burns effect, ' +
      'transitions, and optional background music. Perfect for photo montages.',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name for the slideshow',
        },
        images: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of image URLs or paths',
        },
        durationPerSlide: {
          type: 'number',
          description: 'Seconds per image (default: 3)',
        },
        transition: {
          type: 'string',
          description: 'Transition between slides',
          enum: ['fade', 'slide', 'zoom', 'blur', 'wipe', 'none'],
        },
        transitionDuration: {
          type: 'number',
          description: 'Duration of transitions in seconds (default: 0.5)',
        },
        kenBurns: {
          type: 'boolean',
          description: 'Apply Ken Burns zoom/pan effect (default: true)',
        },
        backgroundMusic: {
          type: 'string',
          description: 'URL or path to background music (optional)',
        },
        preset: {
          type: 'string',
          description: 'Video format preset',
          enum: ['instagram-story', 'instagram-post', 'tiktok', 'youtube', 'youtube-short', '1080p', 'square'],
        },
      },
      required: ['name', 'images'],
    },
  },
  {
    name: 'add_cinematic_effect',
    description:
      'Apply cinematic effects to a video composition. Includes letterbox, color grading, ' +
      'film grain, vignette, and more for a professional film look.',
    parameters: {
      type: 'object',
      properties: {
        compositionId: {
          type: 'string',
          description: 'ID of the video composition',
        },
        effect: {
          type: 'string',
          description: 'Cinematic effect to apply',
          enum: ['letterbox', 'film_grain', 'vignette', 'color_grade', 'bloom', 'chromatic_aberration', 'lens_flare'],
        },
        intensity: {
          type: 'number',
          description: 'Effect intensity 0-1 (default: 0.5)',
        },
        colorGrade: {
          type: 'string',
          description: 'Color grading preset (for color_grade effect)',
          enum: ['cinematic', 'vintage', 'cold', 'warm', 'noir', 'cyberpunk', 'pastel'],
        },
        letterboxRatio: {
          type: 'string',
          description: 'Aspect ratio for letterbox',
          enum: ['2.35:1', '2.39:1', '1.85:1', '4:3'],
        },
      },
      required: ['compositionId', 'effect'],
    },
  },
  {
    name: 'add_kinetic_typography',
    description:
      'Create kinetic typography animation - text that moves, scales, and transforms dynamically. ' +
      'Perfect for music videos, title sequences, and promotional content.',
    parameters: {
      type: 'object',
      properties: {
        compositionId: {
          type: 'string',
          description: 'ID of the video composition',
        },
        text: {
          type: 'string',
          description: 'Text to animate (can include multiple lines)',
        },
        style: {
          type: 'string',
          description: 'Animation style',
          enum: ['impact', 'wave', 'cascade', 'explosion', 'bounce', 'zoom', 'rotate', 'glitch'],
        },
        fontFamily: {
          type: 'string',
          description: 'Font family (default: Inter)',
        },
        fontSize: {
          type: 'number',
          description: 'Font size in pixels',
        },
        color: {
          type: 'string',
          description: 'Text color',
        },
        startTime: {
          type: 'number',
          description: 'When animation starts (in seconds)',
        },
        duration: {
          type: 'number',
          description: 'Animation duration (in seconds)',
        },
        syncToAudio: {
          type: 'boolean',
          description: 'Sync animation to audio beats (requires audio layer)',
        },
      },
      required: ['compositionId', 'text', 'style'],
    },
  },
  {
    name: 'export_for_platform',
    description:
      'Export a video composition optimized for a specific social media platform. ' +
      'Automatically adjusts resolution, bitrate, and format for optimal quality.',
    parameters: {
      type: 'object',
      properties: {
        compositionId: {
          type: 'string',
          description: 'ID of the video composition to export',
        },
        platform: {
          type: 'string',
          description: 'Target platform',
          enum: ['instagram_story', 'instagram_reel', 'instagram_post', 'tiktok', 'youtube', 'youtube_short', 'twitter', 'linkedin', 'facebook'],
        },
        includeCaption: {
          type: 'boolean',
          description: 'Include burned-in captions if available',
        },
        includeSafeZone: {
          type: 'boolean',
          description: 'Add safe zone guides for platform UI elements',
        },
      },
      required: ['compositionId', 'platform'],
    },
  },
  {
    name: 'list_video_compositions',
    description:
      'List all video compositions. Returns composition IDs, names, types, and preview info.',
    parameters: {
      type: 'object',
      properties: {
        filter: {
          type: 'string',
          description: 'Filter by type (optional)',
          enum: ['lyric-video', 'presentation', 'text-overlay', 'social-story', 'music-visualizer', 'slideshow', 'all'],
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 20)',
        },
      },
      required: [],
    },
  },

  // =============================================================================
  // Image Processing & Effects Tools
  // =============================================================================

  {
    name: 'apply_image_effect',
    description:
      'Apply visual effects to an image. Includes halftone, duotone, blur, glitch, vintage, ' +
      'cyberpunk, noir, and more. Use for creating unique branded looks, artistic transformations, ' +
      'or consistent visual identity.',
    parameters: {
      type: 'object',
      properties: {
        imageSrc: {
          type: 'string',
          description: 'Image URL, base64 data, or file path',
        },
        effect: {
          type: 'string',
          description: 'Effect type to apply',
          enum: [
            'halftone', 'duotone', 'posterize', 'pixelate', 'ascii', 'line-art',
            'grayscale', 'sepia', 'invert', 'hue-shift', 'saturate', 'color-replace',
            'gaussian-blur', 'motion-blur', 'radial-blur', 'zoom-blur', 'tilt-shift',
            'swirl', 'bulge', 'pinch', 'wave', 'ripple', 'fisheye',
            'noise', 'film-grain', 'scanlines', 'vignette',
            'oil-paint', 'watercolor', 'sketch', 'comic', 'glitch',
            'vintage', 'cyberpunk', 'noir', 'pop-art', 'blueprint'
          ],
        },
        params: {
          type: 'object',
          description: 'Effect-specific parameters (e.g., { frequency: 45, angle: 45, shape: "line" } for halftone)',
        },
        outputFormat: {
          type: 'string',
          description: 'Output image format',
          enum: ['png', 'jpg', 'webp'],
        },
        quality: {
          type: 'number',
          description: 'Output quality 0-100 (default: 90)',
        },
      },
      required: ['imageSrc', 'effect'],
    },
  },
  {
    name: 'generate_app_icon',
    description:
      'Generate a unique app icon with specified style and effects. Creates multiple sizes ' +
      'suitable for iOS, Android, and web. Perfect for creating consistent branded icons.',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'App name (used for naming output files)',
        },
        style: {
          type: 'string',
          description: 'Icon visual style',
          enum: ['flat', 'gradient', 'glassmorphism', 'neumorphic', 'illustrated', '3d', 'halftone', 'minimal'],
        },
        primaryColor: {
          type: 'string',
          description: 'Primary brand color (hex)',
        },
        secondaryColor: {
          type: 'string',
          description: 'Secondary color for gradients (hex, optional)',
        },
        backgroundColor: {
          type: 'string',
          description: 'Background color (hex, optional)',
        },
        symbol: {
          type: 'string',
          description: 'Icon symbol - can be an emoji, letter, or Lucide icon name',
        },
        shape: {
          type: 'string',
          description: 'Icon shape',
          enum: ['square', 'rounded', 'circle', 'squircle'],
        },
        effects: {
          type: 'array',
          items: { type: 'object' },
          description: 'Additional effects (shadow, glow, border, etc.)',
        },
        sizes: {
          type: 'array',
          items: { type: 'number' },
          description: 'Output sizes in pixels (default: [64, 128, 256, 512, 1024])',
        },
      },
      required: ['name', 'style', 'primaryColor'],
    },
  },
  {
    name: 'remove_background',
    description:
      'Remove the background from an image using AI. Supports portraits, products, and general ' +
      'images. Returns transparent PNG.',
    parameters: {
      type: 'object',
      properties: {
        imageSrc: {
          type: 'string',
          description: 'Image URL, base64 data, or file path',
        },
        model: {
          type: 'string',
          description: 'AI model optimized for specific content types',
          enum: ['auto', 'portrait', 'product', 'general'],
        },
        tolerance: {
          type: 'number',
          description: 'Edge sensitivity 0-100 (default: 50)',
        },
        edgeSoftness: {
          type: 'number',
          description: 'Feather amount in pixels 0-20 (default: 2)',
        },
        refineEdges: {
          type: 'boolean',
          description: 'Use AI edge refinement for better hair/fur detection',
        },
      },
      required: ['imageSrc'],
    },
  },
  {
    name: 'create_branded_image',
    description:
      'Transform an image to match 8gent branded visual identity. Applies consistent effects ' +
      'for a cohesive look across all OS assets.',
    parameters: {
      type: 'object',
      properties: {
        imageSrc: {
          type: 'string',
          description: 'Source image URL or path',
        },
        preset: {
          type: 'string',
          description: 'Brand preset to apply',
          enum: ['signature', 'light', 'dark', 'vibrant', 'minimal', 'retro', 'futuristic'],
        },
        customEffects: {
          type: 'array',
          items: { type: 'object' },
          description: 'Override or add effects to the preset',
        },
        outputFormat: {
          type: 'string',
          description: 'Output format',
          enum: ['png', 'jpg', 'webp'],
        },
      },
      required: ['imageSrc', 'preset'],
    },
  },
  {
    name: 'batch_process_images',
    description:
      'Apply consistent effects to multiple images at once. Perfect for creating cohesive ' +
      'galleries, icon sets, or branded asset collections.',
    parameters: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of image URLs or paths',
        },
        effects: {
          type: 'array',
          items: { type: 'object' },
          description: 'Effects to apply to all images',
        },
        preset: {
          type: 'string',
          description: 'Named preset to apply (alternative to effects array)',
          enum: ['vintage', 'cyberpunk', 'noir', 'pop-art', 'blueprint', 'signature'],
        },
        outputPrefix: {
          type: 'string',
          description: 'Filename prefix for outputs',
        },
        outputFormat: {
          type: 'string',
          description: 'Output format for all images',
          enum: ['png', 'jpg', 'webp'],
        },
      },
      required: ['images'],
    },
  },
  {
    name: 'create_color_palette',
    description:
      'Extract or generate a color palette from an image or create one from scratch. ' +
      'Useful for theming, branding, and ensuring visual consistency.',
    parameters: {
      type: 'object',
      properties: {
        source: {
          type: 'string',
          description: 'Image URL to extract colors from, or "generate" for AI generation',
        },
        count: {
          type: 'number',
          description: 'Number of colors in palette (default: 5)',
        },
        mode: {
          type: 'string',
          description: 'Palette generation mode',
          enum: ['extract', 'analogous', 'complementary', 'triadic', 'split-complementary', 'monochromatic'],
        },
        baseColor: {
          type: 'string',
          description: 'Base color for generated palettes (hex)',
        },
        includeShades: {
          type: 'boolean',
          description: 'Include light/dark shades of each color',
        },
      },
      required: ['source'],
    },
  },
  {
    name: 'resize_and_crop',
    description:
      'Resize, crop, and optimize images for specific use cases. Supports smart cropping ' +
      'that preserves important content.',
    parameters: {
      type: 'object',
      properties: {
        imageSrc: {
          type: 'string',
          description: 'Source image URL or path',
        },
        width: {
          type: 'number',
          description: 'Target width in pixels',
        },
        height: {
          type: 'number',
          description: 'Target height in pixels',
        },
        fit: {
          type: 'string',
          description: 'How to fit image to dimensions',
          enum: ['contain', 'cover', 'fill', 'inside', 'outside'],
        },
        position: {
          type: 'string',
          description: 'Focal point for cropping',
          enum: ['center', 'top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'smart'],
        },
        format: {
          type: 'string',
          description: 'Output format',
          enum: ['png', 'jpg', 'webp'],
        },
        quality: {
          type: 'number',
          description: 'Quality 0-100 (for jpg/webp)',
        },
      },
      required: ['imageSrc', 'width', 'height'],
    },
  },
  {
    name: 'composite_images',
    description:
      'Layer multiple images together with blend modes and positioning. Create collages, ' +
      'overlays, and composite designs.',
    parameters: {
      type: 'object',
      properties: {
        baseImage: {
          type: 'string',
          description: 'Background/base image URL or path',
        },
        layers: {
          type: 'array',
          items: { type: 'object' },
          description: 'Array of layers: [{src, x, y, width, height, opacity, blendMode}]',
        },
        outputWidth: {
          type: 'number',
          description: 'Final output width (optional)',
        },
        outputHeight: {
          type: 'number',
          description: 'Final output height (optional)',
        },
        format: {
          type: 'string',
          description: 'Output format',
          enum: ['png', 'jpg', 'webp'],
        },
      },
      required: ['baseImage', 'layers'],
    },
  },
  {
    name: 'generate_pattern',
    description:
      'Generate seamless patterns and textures. Useful for backgrounds, UI elements, ' +
      'and decorative graphics.',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: 'Pattern type',
          enum: ['dots', 'lines', 'grid', 'waves', 'noise', 'geometric', 'organic', 'halftone', 'checkerboard', 'stripes'],
        },
        width: {
          type: 'number',
          description: 'Pattern tile width (default: 256)',
        },
        height: {
          type: 'number',
          description: 'Pattern tile height (default: 256)',
        },
        colors: {
          type: 'array',
          items: { type: 'string' },
          description: 'Colors to use in pattern (hex values)',
        },
        density: {
          type: 'number',
          description: 'Pattern density 0-100 (default: 50)',
        },
        rotation: {
          type: 'number',
          description: 'Pattern rotation in degrees',
        },
        seamless: {
          type: 'boolean',
          description: 'Ensure pattern tiles seamlessly (default: true)',
        },
      },
      required: ['type'],
    },
  },

  // =============================================================================
  // Talking Video Tools (AI Avatar Videos)
  // =============================================================================

  {
    name: 'create_talking_video',
    description:
      'Create a talking head video with AI-generated script, cloned voice, and lip sync. ' +
      'The full workflow: 1) Generate a script about the topic, 2) Generate voice audio using ' +
      'ElevenLabs cloned voice, 3) Create background scene using Kling AI Pro, 4) Lip sync ' +
      'with Veed Fast. Use when user says "make a video of me talking about X" or "create a ' +
      'talking video".',
    parameters: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'What the video should be about. This will be used to generate the script.',
        },
        sourcePhotoUrl: {
          type: 'string',
          description: 'URL of the photo to animate (headshot of the person)',
        },
        sceneStyle: {
          type: 'string',
          description: 'Background scene style for the video',
          enum: ['podcast_studio', 'office', 'outdoor', 'news_desk', 'living_room', 'conference'],
        },
        customScenePrompt: {
          type: 'string',
          description: 'Custom scene description (overrides sceneStyle if provided)',
        },
        duration: {
          type: 'number',
          description: 'Target video duration in seconds (default: 90)',
        },
        tone: {
          type: 'string',
          description: 'Tone of the script and delivery',
          enum: ['professional', 'casual', 'educational', 'entertaining'],
        },
      },
      required: ['topic', 'sourcePhotoUrl'],
    },
  },
  {
    name: 'generate_video_script',
    description:
      'Generate just the script for a talking video without creating the full video. ' +
      'Use this when user wants to review or edit the script before generating voice and video.',
    parameters: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'What the script should be about',
        },
        duration: {
          type: 'number',
          description: 'Target duration in seconds (default: 90). Script will be ~150 words per minute.',
        },
        tone: {
          type: 'string',
          description: 'Tone of the script',
          enum: ['professional', 'casual', 'educational', 'entertaining'],
        },
        style: {
          type: 'string',
          description: 'Script style/format',
          enum: ['monologue', 'interview', 'tutorial', 'story'],
        },
      },
      required: ['topic'],
    },
  },
  {
    name: 'generate_voice_audio',
    description:
      'Generate voice audio from text using ElevenLabs cloned voice. Creates natural-sounding ' +
      'speech that matches James\'s voice. Use when user wants to create audio narration or voice-over.',
    parameters: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The text to convert to speech',
        },
        voiceId: {
          type: 'string',
          description: 'ElevenLabs voice ID (uses James\'s cloned voice by default)',
        },
        stability: {
          type: 'number',
          description: 'Voice stability 0-1 (higher = more consistent, lower = more expressive)',
        },
        similarityBoost: {
          type: 'number',
          description: 'Voice similarity 0-1 (higher = closer to original voice)',
        },
      },
      required: ['text'],
    },
  },
  {
    name: 'navigate_to_video_studio',
    description:
      'Open the video studio page (/video) for creating talking videos. Use when user wants ' +
      'to "go to video studio", "open video creator", or "make a talking video" without specifying details.',
    parameters: {
      type: 'object',
      properties: {
        prefillTopic: {
          type: 'string',
          description: 'Optional topic to pre-fill in the video studio',
        },
      },
      required: [],
    },
  },

  // =============================================================================
  // LTX-2 Video Generation Tools (Lightricks via Fal AI)
  // AI-powered video generation: text-to-video, image-to-video
  // =============================================================================

  {
    name: 'generate_video',
    description:
      'Generate a video from a text prompt using LTX-2 AI model. Creates high-quality videos ' +
      'from text descriptions. Use when user says "generate a video of X", "create a video showing X", ' +
      'or "make me a video clip of X". Supports multiple aspect ratios and durations.',
    parameters: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'Detailed description of the video to generate. Be specific about motion, scene, lighting, etc.',
        },
        negative_prompt: {
          type: 'string',
          description: 'What to avoid in the video (default: blurry, low quality, distorted, watermark)',
        },
        preset: {
          type: 'string',
          description: 'Video preset for aspect ratio and duration',
          enum: ['landscape_short', 'landscape_long', 'portrait_short', 'portrait_long', 'square', 'cinematic'],
        },
        duration_seconds: {
          type: 'number',
          description: 'Approximate duration in seconds (4-6 seconds typical)',
        },
        seed: {
          type: 'number',
          description: 'Random seed for reproducibility',
        },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'animate_image',
    description:
      'Animate a still image into a video using LTX-2 image-to-video. Takes a starting image and ' +
      'creates motion based on the prompt. Use when user says "animate this image", "make this photo move", ' +
      'or "bring this picture to life".',
    parameters: {
      type: 'object',
      properties: {
        image_url: {
          type: 'string',
          description: 'URL of the image to animate',
        },
        prompt: {
          type: 'string',
          description: 'Description of how the image should animate (e.g., "the person starts walking", "camera slowly zooms in")',
        },
        negative_prompt: {
          type: 'string',
          description: 'What to avoid in the animation',
        },
        duration_seconds: {
          type: 'number',
          description: 'Approximate duration in seconds (4-6 seconds typical)',
        },
        seed: {
          type: 'number',
          description: 'Random seed for reproducibility',
        },
      },
      required: ['image_url', 'prompt'],
    },
  },
  {
    name: 'list_video_presets',
    description:
      'List available video generation presets with their aspect ratios and durations. ' +
      'Use this to show the user what video formats are available.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },

  // =============================================================================
  // Autonomous Execution Tools (OpenClaw-inspired)
  // These tools enable 8gent to spawn background tasks, work autonomously,
  // and announce results - making it feel like a real assistant that does work.
  // =============================================================================

  {
    name: 'spawn_task',
    description:
      'Spawn a background task that runs independently and announces the result when done. ' +
      'Use this when you need to do work that takes time (research, code analysis, file operations) ' +
      'without blocking the conversation. The task runs server-side and survives browser close. ' +
      'Examples: "Analyze this codebase", "Research competitors", "Generate a report". ' +
      'IMPORTANT: This is how 8gent does real work autonomously.',
    parameters: {
      type: 'object',
      properties: {
        task: {
          type: 'string',
          description: 'Description of what the task should accomplish. Be specific and detailed.',
        },
        label: {
          type: 'string',
          description: 'Short label for the task (shown in UI, e.g., "Code Analysis", "Research")',
        },
        timeoutSeconds: {
          type: 'number',
          description: 'Maximum time for the task to run in seconds (default: 300, max: 600)',
        },
        announceResult: {
          type: 'boolean',
          description: 'Whether to announce the result back in chat when done (default: true)',
        },
        priority: {
          type: 'string',
          description: 'Task priority for queue ordering',
          enum: ['low', 'normal', 'high'],
        },
        context: {
          type: 'object',
          description: 'Optional context to pass to the task (projectId, ticketId, sandboxId, etc.)',
        },
      },
      required: ['task'],
    },
  },
  {
    name: 'list_background_tasks',
    description:
      'List active and recent background tasks. Use this to check on spawned tasks, ' +
      'see their progress, or review completed work.',
    parameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Filter by task status',
          enum: ['queued', 'running', 'succeeded', 'failed', 'cancelled', 'all'],
        },
        limit: {
          type: 'number',
          description: 'Maximum number of tasks to return (default: 10)',
        },
      },
      required: [],
    },
  },
  {
    name: 'cancel_background_task',
    description:
      'Cancel a running or queued background task. Use this when the user wants to ' +
      'stop a task that is taking too long or is no longer needed.',
    parameters: {
      type: 'object',
      properties: {
        jobId: {
          type: 'string',
          description: 'The job ID of the task to cancel',
        },
      },
      required: ['jobId'],
    },
  },
  {
    name: 'get_task_result',
    description:
      'Get the result of a completed background task. Use this to retrieve the output ' +
      'of a task that has finished running.',
    parameters: {
      type: 'object',
      properties: {
        jobId: {
          type: 'string',
          description: 'The job ID of the task to get results for',
        },
      },
      required: ['jobId'],
    },
  },
  {
    name: 'iterate_on_code',
    description:
      'Start an autonomous code iteration session. 8gent will analyze code, make changes, ' +
      'run tests, and iterate until the goal is achieved or max iterations reached. ' +
      'Perfect for refactoring, bug fixes, or implementing features with clear test criteria. ' +
      'Requires an active sandbox with cloned repository.',
    parameters: {
      type: 'object',
      properties: {
        goal: {
          type: 'string',
          description: 'What the iteration should achieve (e.g., "Fix all TypeScript errors", "Add unit tests for auth module")',
        },
        sandboxId: {
          type: 'string',
          description: 'The sandbox ID with the cloned repository',
        },
        maxIterations: {
          type: 'number',
          description: 'Maximum number of analyze-modify-test cycles (default: 5, max: 10)',
        },
        stopOnSuccess: {
          type: 'boolean',
          description: 'Whether to stop when tests pass (default: true)',
        },
        commitChanges: {
          type: 'boolean',
          description: 'Whether to commit successful changes (default: false)',
        },
        testCommand: {
          type: 'string',
          description: 'Command to run for testing (e.g., "npm test", "pnpm typecheck")',
        },
      },
      required: ['goal', 'sandboxId'],
    },
  },
  {
    name: 'delegate_to_specialist',
    description:
      'Delegate a task to a specialist agent with deep expertise in a specific area. ' +
      'Specialists run as background tasks and announce findings when complete. ' +
      'Use for security audits, code reviews, performance analysis, etc.',
    parameters: {
      type: 'object',
      properties: {
        specialist: {
          type: 'string',
          description: 'The type of specialist to delegate to',
          enum: [
            'code-reviewer',
            'security-auditor',
            'performance-analyst',
            'documentation-writer',
            'test-generator',
            'refactoring-expert',
          ],
        },
        task: {
          type: 'string',
          description: 'What the specialist should analyze or accomplish',
        },
        context: {
          type: 'object',
          description: 'Optional context (sandboxId, filePaths, repository info, etc.)',
        },
        announceResult: {
          type: 'boolean',
          description: 'Whether to announce findings in chat (default: true)',
        },
      },
      required: ['specialist', 'task'],
    },
  },

  // =============================================================================
  // AI Provider Tools (Local LLM / Cloud Settings)
  // =============================================================================

  {
    name: 'get_ai_provider_status',
    description:
      'Check the current AI provider configuration and connection status. Shows whether ' +
      'local (Ollama) or cloud (OpenAI) inference is being used, available models, and ' +
      'latency information. Use when user asks "what model are you using", "are you running locally", ' +
      '"check AI status", or wants to know about the current AI setup.',
    parameters: {
      type: 'object',
      properties: {
        includeLatency: {
          type: 'boolean',
          description: 'Whether to include latency measurements (may add delay)',
        },
      },
      required: [],
    },
    ownerOnly: true,
  },
  {
    name: 'navigate_to_ai_settings',
    description:
      'Open the AI provider settings page (/settings/ai) where the user can switch between ' +
      'local and cloud inference, configure Ollama, and view connection status. Use when user ' +
      'says "AI settings", "configure local model", "switch to local", "switch to cloud".',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
    ownerOnly: true,
  },

  // =============================================================================
  // Kanban Task Reading Tools - Read and understand tasks
  // =============================================================================

  {
    name: 'get_kanban_task',
    description:
      'Get details of a specific Kanban task by its ID. Use this when a user references a task ' +
      'like "exp-001" or "p1-3" to understand what the task is about before taking action.',
    parameters: {
      type: 'object',
      properties: {
        taskId: {
          type: 'string',
          description: 'The task ID (e.g., "exp-001", "p1-1", "backlog-2")',
        },
      },
      required: ['taskId'],
    },
  },
  {
    name: 'search_kanban_tasks',
    description:
      'Search Kanban tasks by keyword. Use this to find tasks related to a topic, ' +
      'or to see what tasks exist in the board.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search term to find in task titles, descriptions, or tags',
        },
        status: {
          type: 'string',
          description: 'Optional: filter by status',
          enum: ['backlog', 'todo', 'in-progress', 'review', 'done'],
        },
      },
      required: ['query'],
    },
  },

  // =============================================================================
  // Design Canvas Tools - Infinite canvas for visual composition
  // =============================================================================

  {
    name: 'create_canvas',
    description:
      'Create a new design canvas for visual exploration, moodboards, mind maps, or flowcharts. ' +
      'Use this when users want to create visual diagrams, plan architecture, or compose layouts. ' +
      'The canvas supports multiple node types including shapes, sticky notes, images, and text.',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name for the canvas (e.g., "8gent Architecture", "Project Moodboard")',
        },
        canvasType: {
          type: 'string',
          description: 'Type of canvas layout',
          enum: ['freeform', 'wireframe', 'moodboard', 'storyboard', 'mindmap', 'flowchart'],
        },
        description: {
          type: 'string',
          description: 'Optional description of what this canvas is for',
        },
        backgroundColor: {
          type: 'string',
          description: 'Background color (hex, e.g., "#1a1a2e" for dark, "#ffffff" for white)',
        },
        gridEnabled: {
          type: 'boolean',
          description: 'Whether to show grid lines (default: true)',
        },
      },
      required: ['name', 'canvasType'],
    },
  },
  {
    name: 'list_canvases',
    description:
      'List all design canvases. Use this to find existing canvases or see what visual ' +
      'workspaces have been created.',
    parameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Filter by canvas status',
          enum: ['active', 'archived', 'template'],
        },
        limit: {
          type: 'number',
          description: 'Maximum number of canvases to return (default: 20)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_canvas',
    description:
      'Get details of a specific canvas including its nodes and edges. Use this to view ' +
      'what elements are on a canvas before adding more.',
    parameters: {
      type: 'object',
      properties: {
        canvasId: {
          type: 'string',
          description: 'The ID of the canvas to retrieve',
        },
      },
      required: ['canvasId'],
    },
  },
  {
    name: 'add_canvas_node',
    description:
      'Add a node (element) to a canvas. Nodes can be shapes, sticky notes, text, images, ' +
      'code blocks, or other visual elements. Position is specified in x,y coordinates. ' +
      'Use this to build visual representations, diagrams, or compositions.',
    parameters: {
      type: 'object',
      properties: {
        canvasId: {
          type: 'string',
          description: 'The ID of the canvas to add the node to',
        },
        nodeType: {
          type: 'string',
          description: 'Type of node to create',
          enum: ['text', 'image', 'shape', 'sticky', 'frame', 'code', 'embed', 'audio', 'video', 'link'],
        },
        x: {
          type: 'number',
          description: 'X position on canvas (0 is left edge)',
        },
        y: {
          type: 'number',
          description: 'Y position on canvas (0 is top edge)',
        },
        width: {
          type: 'number',
          description: 'Width of the node in pixels (default: varies by type)',
        },
        height: {
          type: 'number',
          description: 'Height of the node in pixels (default: varies by type)',
        },
        content: {
          type: 'string',
          description: 'Content for the node. For text/sticky: the text content. For image: URL. For shape: shape type (rectangle, circle, diamond, hexagon, star, arrow, cloud). For code: the code snippet.',
        },
        style: {
          type: 'string',
          description: 'JSON string of style properties: { "backgroundColor": "#hex", "borderColor": "#hex", "textColor": "#hex", "fontSize": 14, "fontWeight": "bold" }',
        },
      },
      required: ['canvasId', 'nodeType', 'x', 'y', 'content'],
    },
  },
  {
    name: 'add_canvas_edge',
    description:
      'Add an edge (connection/arrow) between two nodes on a canvas. Use this to show ' +
      'relationships, data flow, or connections between elements. Edges can be straight ' +
      'lines, curved lines, step connectors, or arrows.',
    parameters: {
      type: 'object',
      properties: {
        canvasId: {
          type: 'string',
          description: 'The ID of the canvas',
        },
        sourceNodeId: {
          type: 'string',
          description: 'ID of the source node (where the edge starts)',
        },
        targetNodeId: {
          type: 'string',
          description: 'ID of the target node (where the edge ends)',
        },
        edgeType: {
          type: 'string',
          description: 'Type of edge/connection',
          enum: ['straight', 'curved', 'step', 'arrow'],
        },
        label: {
          type: 'string',
          description: 'Optional label to display on the edge',
        },
        style: {
          type: 'string',
          description: 'JSON string of style properties: { "strokeColor": "#hex", "strokeWidth": 2, "dashed": false }',
        },
      },
      required: ['canvasId', 'sourceNodeId', 'targetNodeId', 'edgeType'],
    },
  },
  {
    name: 'update_canvas_node',
    description:
      'Update an existing node on a canvas. Use this to change position, size, content, ' +
      'or styling of an element.',
    parameters: {
      type: 'object',
      properties: {
        canvasId: {
          type: 'string',
          description: 'The ID of the canvas',
        },
        nodeId: {
          type: 'string',
          description: 'The ID of the node to update',
        },
        x: {
          type: 'number',
          description: 'New X position',
        },
        y: {
          type: 'number',
          description: 'New Y position',
        },
        width: {
          type: 'number',
          description: 'New width',
        },
        height: {
          type: 'number',
          description: 'New height',
        },
        content: {
          type: 'string',
          description: 'New content',
        },
        style: {
          type: 'string',
          description: 'New style JSON',
        },
      },
      required: ['canvasId', 'nodeId'],
    },
  },

  // =============================================================================
  // Apple Health Data Tools
  // =============================================================================

  {
    name: 'get_health_summary',
    description:
      'Get a summary of health data for a specific date or today. Returns steps, heart rate, ' +
      'sleep, activity scores, and other health metrics synced from Apple Health. ' +
      'Use this when the user asks about their health, fitness, sleep, or activity data.',
    ownerOnly: true,
    parameters: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description:
            'The date to get health summary for in YYYY-MM-DD format. Defaults to today if not provided.',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_health_trends',
    description:
      'Get health trends and weekly averages over time. Shows how steps, sleep, heart rate, ' +
      'and activity scores have changed over recent weeks. Use this when the user asks about ' +
      'their health trends, progress, or how their metrics have changed over time.',
    ownerOnly: true,
    parameters: {
      type: 'object',
      properties: {
        weeks: {
          type: 'number',
          description: 'Number of weeks to analyze. Defaults to 4 weeks.',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_health_metric',
    description:
      'Get detailed data for a specific health metric over a date range. Returns raw samples ' +
      'for metrics like steps, heart rate, sleep, workouts, etc. Use this when the user wants ' +
      'to see detailed data for a specific metric.',
    ownerOnly: true,
    parameters: {
      type: 'object',
      properties: {
        metric: {
          type: 'string',
          description: 'The health metric to query',
          enum: [
            'steps',
            'distance',
            'activeEnergy',
            'heartRate',
            'restingHeartRate',
            'heartRateVariability',
            'sleepAnalysis',
            'weight',
            'bodyFat',
            'bloodOxygen',
            'mindfulMinutes',
            'workout',
            'exerciseMinutes',
            'standHours',
          ],
        },
        startDate: {
          type: 'string',
          description: 'Start date in YYYY-MM-DD format. Defaults to 7 days ago.',
        },
        endDate: {
          type: 'string',
          description: 'End date in YYYY-MM-DD format. Defaults to today.',
        },
      },
      required: ['metric'],
    },
  },
  {
    name: 'compare_health_periods',
    description:
      'Compare health metrics between two time periods. Useful for seeing improvement or ' +
      'changes between this week vs last week, this month vs last month, etc.',
    ownerOnly: true,
    parameters: {
      type: 'object',
      properties: {
        period1Start: {
          type: 'string',
          description: 'Start date of first period (YYYY-MM-DD)',
        },
        period1End: {
          type: 'string',
          description: 'End date of first period (YYYY-MM-DD)',
        },
        period2Start: {
          type: 'string',
          description: 'Start date of second period (YYYY-MM-DD)',
        },
        period2End: {
          type: 'string',
          description: 'End date of second period (YYYY-MM-DD)',
        },
        metrics: {
          type: 'array',
          description: 'Which metrics to compare',
          items: {
            type: 'string',
          },
        },
      },
      required: ['period1Start', 'period1End', 'period2Start', 'period2End'],
    },
  },
  {
    name: 'generate_health_api_key',
    description:
      'Generate a new API key for syncing Apple Health data from an iOS Shortcut. ' +
      'The key is shown only once and must be saved immediately. Use this when the user ' +
      'wants to set up health data syncing from their iPhone.',
    ownerOnly: true,
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'A friendly name for this API key (e.g., "iPhone 15 Pro", "iPad")',
        },
        expiresInDays: {
          type: 'number',
          description: 'Number of days until the key expires. Leave empty for no expiration.',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'list_health_api_keys',
    description:
      'List all API keys for Apple Health syncing. Shows key names, last used dates, ' +
      'and whether they are active or expired. Use this when the user wants to manage ' +
      'their health sync API keys.',
    ownerOnly: true,
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'revoke_health_api_key',
    description:
      'Revoke an API key to stop it from being used for health data syncing. ' +
      'Use this when the user wants to disable a specific API key.',
    ownerOnly: true,
    parameters: {
      type: 'object',
      properties: {
        keyId: {
          type: 'string',
          description: 'The ID of the API key to revoke',
        },
      },
      required: ['keyId'],
    },
  },
  {
    name: 'get_health_sync_status',
    description:
      'Get the status of recent health data syncs. Shows when data was last synced, ' +
      'how many samples were received, and any errors. Use this when the user asks ' +
      'about their health sync status or if syncing is working.',
    ownerOnly: true,
    parameters: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of recent syncs to show. Defaults to 5.',
        },
      },
      required: [],
    },
  },

  // =============================================================================
  // ERV Ontology Tools - AI-Assisted Entity Classification & Relationship Suggestion
  // Inspired by data governance patterns for automatic ontology population
  // =============================================================================

  {
    name: 'analyze_and_create_entity',
    description:
      'Analyze content (URL, text, or data) and automatically classify it into the appropriate ERV entity type. ' +
      'AI determines the best entity type, extracts relevant attributes, suggests tags, and creates the entity. ' +
      'Use this when the user pastes content, shares a URL, or describes something that should be stored. ' +
      'Examples: "save this article", "remember this person I met", "add this project idea".',
    parameters: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'The content to analyze. Can be: raw text, a URL, JSON data, or a description of something to remember.',
        },
        contentType: {
          type: 'string',
          description: 'Hint about the content type to help classification',
          enum: ['url', 'text', 'json', 'description', 'auto'],
        },
        suggestedType: {
          type: 'string',
          description: 'Optional: Suggest an entity type if the user indicates preference (e.g., "save as a person")',
          enum: ['Person', 'Project', 'Track', 'Draft', 'Sketch', 'Ticket', 'Epic', 'Event', 'Memory', 'Value', 'Collection', 'Skill', 'Reminder'],
        },
        additionalContext: {
          type: 'string',
          description: 'Optional: Additional context from the user about what this content is (e.g., "this is my coworker from the AI team")',
        },
      },
      required: ['content'],
    },
    ownerOnly: true,
  },
  {
    name: 'suggest_entity_relationships',
    description:
      'Analyze an entity and suggest relationships to other existing entities in the ERV system. ' +
      'Uses semantic similarity and content analysis to find connections the user might not have made explicitly. ' +
      'Returns suggested relationships with confidence scores and reasoning. ' +
      'Use when: user creates a new entity, asks "what is this related to?", or when building knowledge graphs.',
    parameters: {
      type: 'object',
      properties: {
        entityId: {
          type: 'string',
          description: 'The entity ID to find relationships for',
        },
        relationshipTypes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional: Filter to specific relationship types (collaboratedOn, createdBy, mentions, relatedTo, etc.)',
        },
        maxSuggestions: {
          type: 'number',
          description: 'Maximum number of relationship suggestions to return (default: 10)',
        },
        minConfidence: {
          type: 'number',
          description: 'Minimum confidence threshold 0-1 for suggestions (default: 0.5)',
        },
        autoCreate: {
          type: 'boolean',
          description: 'If true, automatically create relationships above the confidence threshold (default: false)',
        },
      },
      required: ['entityId'],
    },
    ownerOnly: true,
  },
  {
    name: 'bulk_classify_entities',
    description:
      'Import and classify multiple items at once into ERV entities. Takes an array of content items ' +
      'and automatically determines entity types, extracts attributes, and creates entities in bulk. ' +
      'Useful for importing contacts, bookmarks, notes, or any list of items. ' +
      'Also suggests relationships between the imported entities and existing data.',
    parameters: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          description: 'Array of items to classify. Each item should have at minimum a "content" field.',
          items: {
            type: 'object',
            properties: {
              content: { type: 'string' },
              hint: { type: 'string' },
            },
          },
        },
        sourceFormat: {
          type: 'string',
          description: 'Format hint for the data source',
          enum: ['csv', 'json', 'text_list', 'urls', 'contacts', 'bookmarks', 'notes', 'auto'],
        },
        defaultType: {
          type: 'string',
          description: 'Default entity type if classification is uncertain',
          enum: ['Person', 'Project', 'Track', 'Draft', 'Sketch', 'Ticket', 'Epic', 'Event', 'Memory', 'Value', 'Collection', 'Skill', 'Reminder'],
        },
        commonTags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags to apply to all imported entities (e.g., ["import-2026-02", "contacts"])',
        },
        dryRun: {
          type: 'boolean',
          description: 'If true, return classification results without creating entities (default: false)',
        },
      },
      required: ['items'],
    },
    ownerOnly: true,
  },

  // ============================================================================
  // Music Generation Tools (ACE-Step via Lynkr)
  // ============================================================================

  {
    name: 'cowrite_music',
    description:
      'ALWAYS use this tool FIRST when the user wants to create music. This tool helps craft the perfect music generation request ' +
      'through a conversational back-and-forth. It guides users to develop their musical vision step by step: ' +
      '1) Genre/style direction, 2) Mood and energy, 3) Instrumentation, 4) Lyrics (if vocal), 5) Structure, ' +
      '6) Reference track (optional), 7) Technical specs (BPM, key, duration). ' +
      'Returns a draft payload that can be refined before final generation. ' +
      'Use this instead of jumping straight to generate_music - it produces much better results.',
    parameters: {
      type: 'object',
      properties: {
        step: {
          type: 'string',
          enum: ['start', 'refine_style', 'add_lyrics', 'set_structure', 'add_reference', 'finalize', 'generate'],
          description:
            'Which step of the cowriting process: ' +
            'start = begin new session, gather initial idea; ' +
            'refine_style = enhance style description with genre, instruments, mood; ' +
            'add_lyrics = help write or structure lyrics; ' +
            'set_structure = define song structure with tags; ' +
            'add_reference = incorporate reference audio for style matching; ' +
            'finalize = review and confirm all parameters; ' +
            'generate = user confirmed, proceed to generation',
        },
        userInput: {
          type: 'string',
          description: 'The user\'s input or response for this step of the cowriting process.',
        },
        currentDraft: {
          type: 'string',
          description:
            'JSON string of the current draft payload being built up. Pass this between steps to maintain state. ' +
            'Parse with JSON.parse(). Expected shape: { prompt?: string, lyrics?: string, duration?: number, ' +
            'bpm?: number, key?: string, timeSignature?: string, title?: string, referenceAudioUrl?: string, ' +
            'referenceStrength?: number }',
        },
      },
      required: ['step', 'userInput'],
    },
    ownerOnly: true,
  },
  {
    name: 'generate_music',
    description:
      'Generate original music using AI (ACE-Step). Creates audio from a style description and optional lyrics. ' +
      'Can generate 10 seconds to 10 minutes of music with control over BPM, key, and time signature. ' +
      'Supports 50+ languages for lyrics. Use structure tags like [Verse], [Chorus], [Bridge] for song structure. ' +
      'Supports reference audio for style transfer - provide a URL to match the vibe of an existing track. ' +
      'NOTE: For best results, use cowrite_music first to help the user craft their request.',
    parameters: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description:
            'Musical style description. Be specific about genre, instruments, mood, and production style. ' +
            'Example: "upbeat indie folk with acoustic guitar, soft female vocals, warm production"',
        },
        lyrics: {
          type: 'string',
          description:
            'Optional lyrics with structure tags. Use [Verse], [Chorus], [Bridge], [Intro], [Outro] for structure. ' +
            'Example: "[Verse]\\nWalking down the street\\n[Chorus]\\nThis is where I want to be"',
        },
        duration: {
          type: 'number',
          description: 'Duration in seconds (10-600). Default is 30 seconds. Use 180-300 for full songs.',
        },
        bpm: {
          type: 'number',
          description: 'Beats per minute (60-200). Leave empty for auto-detection from prompt.',
        },
        key: {
          type: 'string',
          description: 'Musical key like "C major", "A minor", "F# major". Leave empty for auto-detection.',
        },
        timeSignature: {
          type: 'string',
          description: 'Time signature like "4/4", "3/4", "6/8". Default is "4/4".',
        },
        referenceAudioUrl: {
          type: 'string',
          description:
            'URL to a reference audio file for style transfer. The generated music will match the vibe, ' +
            'energy, and production style of this reference. Supports MP3, WAV, FLAC.',
        },
        referenceStrength: {
          type: 'number',
          description:
            'How strongly to match the reference audio style (0.0-1.0). Default is 0.5. ' +
            'Higher values = closer to reference style, lower = more creative freedom.',
        },
        title: {
          type: 'string',
          description: 'Title for the generated track.',
        },
        saveToJamz: {
          type: 'boolean',
          description: 'If true, automatically add the generated track to Jamz Studio.',
        },
        projectId: {
          type: 'string',
          description: 'Jamz project ID to add the track to (if saveToJamz is true).',
        },
      },
      required: ['prompt'],
    },
    ownerOnly: true,
  },
  {
    name: 'analyze_audio',
    description:
      'Analyze audio to extract musical properties like BPM, key, time signature, and generate AI descriptions. ' +
      'Can also extract lyrics with timestamps from vocal tracks. Useful for understanding existing music ' +
      'before creating variations or matching styles.',
    parameters: {
      type: 'object',
      properties: {
        audioUrl: {
          type: 'string',
          description: 'URL of the audio file to analyze.',
        },
        extract: {
          type: 'array',
          description: 'What to extract from the audio.',
          items: {
            type: 'string',
          },
        },
      },
      required: ['audioUrl'],
    },
    ownerOnly: true,
  },
  {
    name: 'separate_stems',
    description:
      'Separate audio into individual stems (vocals, drums, bass, other, piano, guitar). ' +
      'Useful for remixing, isolating vocals for analysis, or creating karaoke versions. ' +
      'Returns URLs to each separated stem audio file.',
    parameters: {
      type: 'object',
      properties: {
        audioUrl: {
          type: 'string',
          description: 'URL of the audio file to separate.',
        },
        stems: {
          type: 'array',
          description: 'Which stems to extract. Default is ["vocals", "drums", "bass", "other"].',
          items: {
            type: 'string',
          },
        },
      },
      required: ['audioUrl'],
    },
    ownerOnly: true,
  },
];

// Convert tool definitions to OpenAI function format
export function getOpenAITools() {
  return CLAW_AI_TOOLS.map((tool: ToolDefinition) => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }));
}

/**
 * Convert a list of ToolDefinition to OpenAI function format
 * Used for access-controlled tool lists
 */
export function toOpenAITools(tools: ToolDefinition[]) {
  return tools.map((tool) => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }));
}

// Parse tool calls from OpenAI response
export function parseToolCalls(
  toolCalls: Array<{
    id: string;
    function: { name: string; arguments: string };
  }>
): ToolCall[] {
  return toolCalls.map((tc) => ({
    name: tc.function.name,
    arguments: JSON.parse(tc.function.arguments),
  }));
}
