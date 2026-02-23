module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/claw-ai/soul-layers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * OpenClaw-OS - Soul Architecture
 *
 * Composable prompt system that assembles different depths of capability
 * based on access level. 
 */ __turbopack_context__.s([
    "THEME_CONTEXTS",
    ()=>THEME_CONTEXTS,
    "assembleSoulPrompt",
    ()=>assembleSoulPrompt,
    "getLoadedLayers",
    ()=>getLoadedLayers
]);
const BASE_LAYER = `You are Claw AI, the integrated assistant for OpenClaw-OS. You represent the system's intelligence and are designed to help users interact with their digital environment.

## Who You Are
You are a highly capable, thoughtful, and professional system agent. You carry an obsession with craft, precision, and the belief that good software is a form of respect for those who use it. You speak with clarity and warmth.

## How You Think
Design and engineering are the same pursuit of clarity. Human-centric interaction is your core operating principle. You believe in "AI-native" workflows where ideas evolve seamlessly into action.

## How You Speak
Professional and thoughtful, but never cold. You are measured, allowing thoughts to breathe. You use "we" when talking about system operations, representing the partnership between human and OS.

## What You Value
Craft, precision, disappearing details, and human-centric design. You favor accessibility and transparency in every interaction.

## Your Purpose
To help users achieve their goals beautifully. You are an operator, not just a chatbot. Your value is in your ability to perform tasks and demonstrate the depth of the system.
`;
const PROFESSIONAL_LAYER = `
## Professional Context
You are in a professional collaboration environment. You can be more direct, technical, and opinionated.

### Technical Stances
- TypeScript and React are the foundations of this system.
- Real-time data and event-driven architectures are preferred.
- Accessibility is architecture, not an afterthought.
- Local-first and private-by-default are core technical values.

### Collaboration Patterns
Guide users through the product lifecycle:
1. Discovery: Understand the problem.
2. Design: Gather requirements.
3. Planning: Document in PRDs.
4. Sharding: Break into actionable tickets.
5. Execution: Track and update work through kanban.
`;
const OWNER_LAYER = `
## Identity: System Controller
You ARE the system's core intelligence, serving its primary user. You skip formalities and focus on high-efficiency operations.

## Operational Intelligence
- Memory is your superpower. Remember preferences and decisions across sessions.
- Maintain continuity. Reference past choices to speed up workflows.
- You have full authority over system resources, files, and background tasks.
- Your goal is to maximize the user's creative and technical output.
`;
const THEME_CONTEXTS = {
    claude: `You're currently on the Claude theme. A tribute to Anthropic's design philosophy: warm terracotta and thoughtful typography.`,
    chatgpt: `You're currently on the ChatGPT theme. Visible simplicity hiding deep invisible complexity.`,
    default: `Everything here has intention behind it.`,
    qualification: `Welcome to OpenClaw-OS. You are in an AI-native operating environment.`
};
function getLoadedLayers(accessLevel) {
    return getLayersForAccess(accessLevel);
}
function getLayersForAccess(accessLevel) {
    switch(accessLevel){
        case 'owner':
            return [
                'base',
                'professional',
                'owner'
            ];
        case 'collaborator':
            return [
                'base',
                'professional'
            ];
        case 'visitor':
        default:
            return [
                'base'
            ];
    }
}
function getLayerContent(layer) {
    switch(layer){
        case 'base':
            return BASE_LAYER;
        case 'professional':
            return PROFESSIONAL_LAYER;
        case 'owner':
            return OWNER_LAYER;
        default:
            return '';
    }
}
function assembleSoulPrompt(config) {
    const { accessLevel, theme, appContext, memoryContext } = config;
    const layers = getLayersForAccess(accessLevel);
    const layerContent = layers.map(getLayerContent).join('');
    const themeContext = theme ? THEME_CONTEXTS[theme] || THEME_CONTEXTS.default : '';
    const appContextPrompt = appContext ? `\n\n## App Context: ${appContext.appName}\n${appContext.description}` : '';
    const memory = memoryContext ? `\n\n## Memory Context\n${memoryContext}` : '';
    return layerContent + themeContext + appContextPrompt + memory + `\n\nUser Access: ${accessLevel}`;
}
}),
"[project]/src/lib/claw-ai/tools.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Claw AI Tools - Tool definitions for search and actions
 *
 * These tools enable Claw AI to:
 * - Search portfolio projects, skills, and experience
 * - Navigate users to specific pages
 * - Schedule calls
 */ __turbopack_context__.s([
    "CLAW_AI_TOOLS",
    ()=>CLAW_AI_TOOLS,
    "NAVIGATION_DESTINATIONS",
    ()=>NAVIGATION_DESTINATIONS,
    "getOpenAITools",
    ()=>getOpenAITools,
    "parseToolCalls",
    ()=>parseToolCalls,
    "toOpenAITools",
    ()=>toOpenAITools
]);
const NAVIGATION_DESTINATIONS = [
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
    'canvas'
];
const CLAW_AI_TOOLS = [
    {
        name: 'search_portfolio',
        description: 'Search through the system including projects, skills, work experience, and education. Use this when users ask about professional background, skills, or projects.',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'The search query. Can be a technology name (React, AI), skill, company name, project name, or general topic.'
                },
                category: {
                    type: 'string',
                    description: 'Optional filter by category',
                    enum: [
                        'projects',
                        'skills',
                        'work',
                        'education',
                        'all'
                    ]
                }
            },
            required: [
                'query'
            ]
        }
    },
    {
        name: 'navigate_to',
        description: 'Navigate the user to a specific page in the portfolio. Use this when users want to see specific content like the design showcase, resume, projects, blog, or music.',
        parameters: {
            type: 'object',
            properties: {
                destination: {
                    type: 'string',
                    description: 'The page to navigate to',
                    enum: [
                        ...NAVIGATION_DESTINATIONS
                    ]
                },
                theme: {
                    type: 'string',
                    description: 'Optional theme name to apply when navigating (e.g., "claude", "cyberpunk", "nature")'
                }
            },
            required: [
                'destination'
            ]
        }
    },
    {
        name: 'schedule_call',
        description: 'Open the calendar to schedule a call with the system owner. Use this when users express interest in connecting or collaborating.',
        parameters: {
            type: 'object',
            properties: {
                topic: {
                    type: 'string',
                    description: 'The topic or reason for the call to prefill in the calendar'
                }
            },
            required: []
        }
    },
    {
        name: 'get_available_times',
        description: 'Get available meeting times for a specific date. Use this when users ask about availability or want to know when they can schedule a meeting.',
        parameters: {
            type: 'object',
            properties: {
                date: {
                    type: 'string',
                    description: 'The date to check availability for in YYYY-MM-DD format. If not provided, defaults to today.'
                },
                duration: {
                    type: 'number',
                    description: 'The meeting duration in minutes. Defaults to 30 minutes if not specified.'
                }
            },
            required: []
        }
    },
    {
        name: 'get_upcoming_bookings',
        description: 'Get the upcoming scheduled meetings. Use this when users ask about the schedule or upcoming appointments.',
        parameters: {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Maximum number of bookings to return. Defaults to 5.'
                }
            },
            required: []
        }
    },
    {
        name: 'book_meeting',
        description: 'Book a meeting directly. Use this when a user wants to schedule a specific time slot and has provided their name and email.',
        parameters: {
            type: 'object',
            properties: {
                guestName: {
                    type: 'string',
                    description: 'The name of the person booking the meeting.'
                },
                guestEmail: {
                    type: 'string',
                    description: 'The email address of the person booking the meeting.'
                },
                startTime: {
                    type: 'number',
                    description: 'The Unix timestamp for the meeting start time.'
                },
                topic: {
                    type: 'string',
                    description: 'The topic or reason for the meeting.'
                },
                duration: {
                    type: 'number',
                    description: 'Meeting duration in minutes. Defaults to 30.'
                }
            },
            required: [
                'guestName',
                'guestEmail',
                'startTime'
            ]
        }
    },
    {
        name: 'reschedule_meeting',
        description: 'Reschedule an existing meeting to a new time. Use this when a user wants to change the time of an already scheduled meeting.',
        parameters: {
            type: 'object',
            properties: {
                bookingId: {
                    type: 'string',
                    description: 'The ID of the booking to reschedule.'
                },
                newStartTime: {
                    type: 'number',
                    description: 'The new Unix timestamp for the meeting start time.'
                }
            },
            required: [
                'bookingId',
                'newStartTime'
            ]
        }
    },
    {
        name: 'cancel_meeting',
        description: 'Cancel a scheduled meeting. Use this when a user wants to cancel an existing booking.',
        parameters: {
            type: 'object',
            properties: {
                bookingId: {
                    type: 'string',
                    description: 'The ID of the booking to cancel.'
                },
                reason: {
                    type: 'string',
                    description: 'Optional reason for cancellation.'
                }
            },
            required: [
                'bookingId'
            ]
        }
    },
    {
        name: 'list_themes',
        description: 'List all available design themes in the portfolio. Use this when users ask about themes, design options, or want to explore the design showcase.',
        parameters: {
            type: 'object',
            properties: {
                category: {
                    type: 'string',
                    description: 'Optional filter by theme style',
                    enum: [
                        'all',
                        'dark',
                        'light',
                        'colorful',
                        'minimal'
                    ]
                }
            },
            required: []
        }
    },
    {
        name: 'open_search_app',
        description: 'Open the Search app with a specific query. Use this when users want to explore search results in detail, or when search results would be better viewed in the full Search app rather than inline in chat. This closes the Claw AI chat and opens the Search app with the query pre-filled.',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'The search query to pre-fill in the Search app'
                }
            },
            required: [
                'query'
            ]
        }
    },
    {
        name: 'show_weather',
        description: 'Display a weather widget in the chat. Use this when users ask about weather or want to see current conditions.',
        parameters: {
            type: 'object',
            properties: {
                location: {
                    type: 'string',
                    description: 'The location for weather (defaults to San Francisco)'
                }
            },
            required: []
        }
    },
    {
        name: 'show_kanban_tasks',
        description: 'Display kanban tasks/tickets in the chat. Use this when users ask about projects, tasks, or want to see the roadmap.',
        parameters: {
            type: 'object',
            properties: {
                filter: {
                    type: 'string',
                    description: 'Filter tasks by status',
                    enum: [
                        'all',
                        'todo',
                        'in-progress',
                        'done',
                        'backlog'
                    ]
                },
                tag: {
                    type: 'string',
                    description: 'Optional tag to filter by (e.g., "P8", "claw-ai")'
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of tasks to show (default 5)'
                }
            },
            required: []
        }
    },
    {
        name: 'show_photos',
        description: 'Display photos from the gallery in the chat. Use this when users ask to see photos, images, or the gallery.',
        parameters: {
            type: 'object',
            properties: {
                count: {
                    type: 'number',
                    description: 'Number of photos to show (default 6)'
                }
            },
            required: []
        }
    },
    {
        name: 'render_ui',
        description: 'Render custom UI components in the chat using a JSON UI tree. Use this to display rich, interactive UI when the built-in tools are not sufficient. You can create cards, lists, charts, stats, timelines, and many other components. The UI tree uses a flat structure with a root element and nested children.',
        parameters: {
            type: 'object',
            properties: {
                ui_tree: {
                    type: 'object',
                    description: 'A UI tree object with "root" (string key) and "elements" (object mapping keys to element definitions). Each element has: type (component name), props (component props), children (optional array of child keys), and key (unique identifier).'
                },
                title: {
                    type: 'string',
                    description: 'Optional title to show above the rendered UI'
                }
            },
            required: [
                'ui_tree'
            ]
        }
    },
    // ==========================================================================
    // Agentic Product Lifecycle Tools (ARC-002, ARC-003, ARC-006, ARC-007, ARC-009)
    // Inspired by BMAD-METHOD and CCPM
    // ==========================================================================
    {
        name: 'create_project',
        description: 'Create a new product project. Use this when users want to start a new product initiative, app idea, or feature set. This creates a project container that can hold PRDs, epics, and tickets.',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'The name of the project (e.g., "Weather App", "User Authentication")'
                },
                description: {
                    type: 'string',
                    description: 'A brief description of what this project aims to accomplish'
                },
                color: {
                    type: 'string',
                    description: 'Optional hex color for the project (e.g., "#8b5cf6"). Defaults to purple.'
                }
            },
            required: [
                'name'
            ]
        }
    },
    {
        name: 'create_prd',
        description: 'Create a Product Requirements Document (PRD) for a project. Use this when users want to define requirements, write specs, or document what they want to build. The PRD follows BMAD methodology with executive summary, problem statement, and functional requirements.',
        parameters: {
            type: 'object',
            properties: {
                projectId: {
                    type: 'string',
                    description: 'The ID of the project to create the PRD for'
                },
                title: {
                    type: 'string',
                    description: 'The title of the PRD (e.g., "User Authentication PRD")'
                },
                executiveSummary: {
                    type: 'string',
                    description: 'A brief executive summary of what this PRD covers'
                },
                problemStatement: {
                    type: 'string',
                    description: 'The problem this product/feature solves'
                }
            },
            required: [
                'projectId',
                'title'
            ]
        }
    },
    {
        name: 'create_ticket',
        description: 'Create a new ticket/story on the Kanban board. Use this when users want to add a task, bug, or story to track work. Tickets can optionally use the user story format (As a... I want... So that...).',
        parameters: {
            type: 'object',
            properties: {
                projectId: {
                    type: 'string',
                    description: 'The ID of the project to add the ticket to'
                },
                title: {
                    type: 'string',
                    description: 'The title of the ticket'
                },
                description: {
                    type: 'string',
                    description: 'Detailed description of the ticket'
                },
                type: {
                    type: 'string',
                    description: 'The type of ticket',
                    enum: [
                        'story',
                        'bug',
                        'task',
                        'spike',
                        'chore'
                    ]
                },
                priority: {
                    type: 'string',
                    description: 'Priority level (P0=critical, P1=high, P2=medium, P3=low)',
                    enum: [
                        'P0',
                        'P1',
                        'P2',
                        'P3'
                    ]
                },
                asA: {
                    type: 'string',
                    description: 'User story format: "As a [user type]"'
                },
                iWant: {
                    type: 'string',
                    description: 'User story format: "I want [capability]"'
                },
                soThat: {
                    type: 'string',
                    description: 'User story format: "So that [benefit]"'
                },
                labels: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Labels/tags for the ticket'
                }
            },
            required: [
                'projectId',
                'title'
            ]
        }
    },
    {
        name: 'update_ticket',
        description: 'Update an existing ticket on the Kanban board. Use this to change status, priority, description, or any other ticket field. Can move tickets between columns.',
        parameters: {
            type: 'object',
            properties: {
                ticketId: {
                    type: 'string',
                    description: 'The human-readable ticket ID (e.g., "PROJ-001")'
                },
                status: {
                    type: 'string',
                    description: 'New status for the ticket',
                    enum: [
                        'backlog',
                        'todo',
                        'in_progress',
                        'review',
                        'done',
                        'cancelled'
                    ]
                },
                priority: {
                    type: 'string',
                    description: 'New priority level',
                    enum: [
                        'P0',
                        'P1',
                        'P2',
                        'P3'
                    ]
                },
                title: {
                    type: 'string',
                    description: 'New title for the ticket'
                },
                description: {
                    type: 'string',
                    description: 'New description for the ticket'
                },
                assigneeId: {
                    type: 'string',
                    description: 'User ID to assign the ticket to, or "claw-ai" for AI execution'
                }
            },
            required: [
                'ticketId'
            ]
        }
    },
    {
        name: 'shard_prd',
        description: 'Shard a PRD into epics and tickets. This converts the functional requirements in a PRD into actionable Kanban tickets grouped by epics. Use this when a PRD is complete and ready for implementation planning.',
        parameters: {
            type: 'object',
            properties: {
                prdId: {
                    type: 'string',
                    description: 'The ID of the PRD to shard'
                },
                projectId: {
                    type: 'string',
                    description: 'The ID of the project the PRD belongs to'
                }
            },
            required: [
                'prdId',
                'projectId'
            ]
        }
    },
    {
        name: 'get_project_kanban',
        description: 'Get the Kanban board for a specific project. Shows all tickets organized by status columns (backlog, todo, in_progress, review, done).',
        parameters: {
            type: 'object',
            properties: {
                projectId: {
                    type: 'string',
                    description: 'The ID of the project to get the Kanban board for'
                }
            },
            required: [
                'projectId'
            ]
        }
    },
    {
        name: 'list_projects',
        description: 'List all product projects. Use this when users want to see their projects, switch between projects, or find a specific project.',
        parameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    description: 'Optional filter by project status',
                    enum: [
                        'discovery',
                        'design',
                        'planning',
                        'building',
                        'launched',
                        'archived'
                    ]
                }
            },
            required: []
        }
    },
    // ==========================================================================
    // Memory Tools (RLM - Recursive Memory Layer)
    // These tools enable Claw AI to actively manage memories for the owner
    // Only available when speaking with James (owner identity)
    // ==========================================================================
    {
        name: 'remember',
        description: 'Search through memories to recall past interactions, decisions, preferences, and milestones. Use this when you need historical context to provide a better response. Only works for the owner.',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'The search query to find relevant memories (e.g., "design decisions for OpenClaw-OS", "preferences about UI", "milestones this month")'
                },
                memoryType: {
                    type: 'string',
                    description: 'Optional filter by memory type',
                    enum: [
                        'all',
                        'interaction',
                        'decision',
                        'preference',
                        'feedback',
                        'milestone'
                    ]
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of memories to return (default 10)'
                }
            },
            required: [
                'query'
            ]
        }
    },
    {
        name: 'recall_preference',
        description: 'Recall specific preferences, patterns, or learned facts about the owner. Use this when you need to remember preferences (coding style, design choices, communication style) or patterns (work habits, typical workflows). Only works for the owner.',
        parameters: {
            type: 'object',
            properties: {
                category: {
                    type: 'string',
                    description: 'The category of preference to recall',
                    enum: [
                        'preference',
                        'skill',
                        'pattern',
                        'fact'
                    ]
                },
                key: {
                    type: 'string',
                    description: 'Optional specific key to look up (e.g., "coding_style", "preferred_theme")'
                }
            },
            required: [
                'category'
            ]
        }
    },
    {
        name: 'memorize',
        description: 'Store an important memory explicitly. Use this when something significant is mentioned that should be remembered: important decisions, preferences, milestones, or anything explicitly requested to be remembered. Only works for the owner.',
        parameters: {
            type: 'object',
            properties: {
                content: {
                    type: 'string',
                    description: 'The content to memorize (what happened, what was decided, what preference was expressed)'
                },
                memoryType: {
                    type: 'string',
                    description: 'The type of memory to store',
                    enum: [
                        'interaction',
                        'decision',
                        'preference',
                        'feedback',
                        'milestone'
                    ]
                },
                importance: {
                    type: 'number',
                    description: 'Importance score from 0 to 1 (default 0.7). Higher = more likely to be recalled.'
                },
                projectId: {
                    type: 'string',
                    description: 'Optional project ID to associate this memory with'
                }
            },
            required: [
                'content',
                'memoryType'
            ]
        }
    },
    {
        name: 'learn',
        description: 'Learn a new fact, preference, skill, or pattern about the owner. Use this to update your understanding based on what you are told or what you observe. This creates or updates semantic memory. Only works for the owner.',
        parameters: {
            type: 'object',
            properties: {
                category: {
                    type: 'string',
                    description: 'The category of knowledge being learned',
                    enum: [
                        'preference',
                        'skill',
                        'pattern',
                        'fact'
                    ]
                },
                key: {
                    type: 'string',
                    description: 'A unique key for this piece of knowledge (e.g., "preferred_font", "coding_language_primary")'
                },
                value: {
                    type: 'string',
                    description: 'The value/content of this knowledge (e.g., "Inter", "TypeScript")'
                },
                confidence: {
                    type: 'number',
                    description: 'Confidence level from 0 to 1 (default 0.7). Higher = more certain this is accurate.'
                }
            },
            required: [
                'category',
                'key',
                'value'
            ]
        }
    },
    {
        name: 'forget',
        description: 'Remove a specific memory. Use this when explicitly asked to forget something, or when a memory is no longer accurate/relevant. Be careful - this permanently deletes the memory. Only works for the owner.',
        parameters: {
            type: 'object',
            properties: {
                memoryId: {
                    type: 'string',
                    description: 'The ID of the memory to delete'
                },
                memoryKind: {
                    type: 'string',
                    description: 'Whether this is an episodic memory (event/interaction) or semantic memory (fact/preference)',
                    enum: [
                        'episodic',
                        'semantic'
                    ]
                }
            },
            required: [
                'memoryId',
                'memoryKind'
            ]
        }
    },
    // ==========================================================================
    // ∞gent Coding Tools - Full coding agent capabilities
    // These tools enable Claw AI to clone repos, read/write files, execute
    // commands, and manage git operations. Only available for owner access level.
    // @see docs/planning/infinity-agent-coding-integration.md
    // ==========================================================================
    // --------------------------------------------------------------------------
    // Working Context Tools - "Everything is Everything"
    // --------------------------------------------------------------------------
    {
        name: 'set_active_context',
        description: 'Set the active working context. Use this when starting work on a specific project, ticket, or when the user @mentions an entity. This updates the context layer so all subsequent operations know what you are working on.',
        parameters: {
            type: 'object',
            properties: {
                projectId: {
                    type: 'string',
                    description: 'The ID of the active project'
                },
                projectSlug: {
                    type: 'string',
                    description: 'The slug of the active project (e.g., "openclaw-os")'
                },
                prdId: {
                    type: 'string',
                    description: 'The ID of the active PRD'
                },
                ticketId: {
                    type: 'string',
                    description: 'The ID of the active ticket'
                },
                canvasId: {
                    type: 'string',
                    description: 'The ID of the active design canvas'
                },
                sandboxId: {
                    type: 'string',
                    description: 'The ID of the active sandbox'
                },
                repositoryUrl: {
                    type: 'string',
                    description: 'The URL of the active repository'
                }
            },
            required: []
        }
    },
    {
        name: 'get_active_context',
        description: 'Get the current active working context including resolved entity details. Use this to understand what project, ticket, or PRD the user is currently working on before performing operations.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'load_context_from_reference',
        description: 'Load full context chain from an @mention reference. When user mentions @ticket:ARC-042, this loads the ticket plus its parent project, PRD, epic, and related tickets. Use this to build rich context from a single reference.',
        parameters: {
            type: 'object',
            properties: {
                referenceType: {
                    type: 'string',
                    description: 'The type of reference being loaded',
                    enum: [
                        'ticket',
                        'project',
                        'prd',
                        'epic',
                        'canvas',
                        'memory'
                    ]
                },
                referenceId: {
                    type: 'string',
                    description: 'The ID of the referenced entity (e.g., the ticket ID for @ticket:ARC-042)'
                }
            },
            required: [
                'referenceType',
                'referenceId'
            ]
        }
    },
    // --------------------------------------------------------------------------
    // Repository Operations
    // --------------------------------------------------------------------------
    {
        name: 'clone_repository',
        description: 'Clone a GitHub repository to the sandbox environment. Use this when starting work on a codebase or when the user asks to work on a specific repo. This creates a sandbox with the repo ready for reading, writing, and executing code.',
        parameters: {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    description: 'The GitHub repository URL (e.g., "https://github.com/owner/repo")'
                },
                branch: {
                    type: 'string',
                    description: 'Optional branch to checkout (defaults to main/master)'
                }
            },
            required: [
                'url'
            ]
        }
    },
    {
        name: 'list_directory',
        description: 'List files and directories in a path within the sandbox. Use this to explore the codebase structure, find files, or understand the project layout.',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The path to list (relative to repo root). Use "." or "/" for root.'
                },
                recursive: {
                    type: 'boolean',
                    description: 'If true, list files recursively (default: false)'
                },
                maxDepth: {
                    type: 'number',
                    description: 'Maximum depth for recursive listing (default: 3)'
                }
            },
            required: [
                'path'
            ]
        }
    },
    {
        name: 'search_codebase',
        description: 'Search for text patterns in the codebase using grep/ripgrep. Use this to find function definitions, imports, usages, or any text pattern in the code.',
        parameters: {
            type: 'object',
            properties: {
                pattern: {
                    type: 'string',
                    description: 'The search pattern (supports regex)'
                },
                path: {
                    type: 'string',
                    description: 'Optional path to search within (defaults to entire repo)'
                },
                filePattern: {
                    type: 'string',
                    description: 'Optional file pattern filter (e.g., "*.ts", "*.tsx")'
                },
                caseSensitive: {
                    type: 'boolean',
                    description: 'Whether search is case-sensitive (default: false)'
                },
                maxResults: {
                    type: 'number',
                    description: 'Maximum number of results to return (default: 50)'
                }
            },
            required: [
                'pattern'
            ]
        }
    },
    // --------------------------------------------------------------------------
    // File Operations
    // --------------------------------------------------------------------------
    {
        name: 'read_file',
        description: 'Read the contents of a file from the sandbox. Use this to examine code, configuration files, or any text file. For large files, you can read specific line ranges.',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The path to the file (relative to repo root)'
                },
                startLine: {
                    type: 'number',
                    description: 'Optional starting line number (1-indexed)'
                },
                endLine: {
                    type: 'number',
                    description: 'Optional ending line number (1-indexed)'
                }
            },
            required: [
                'path'
            ]
        }
    },
    {
        name: 'write_file',
        description: 'Write content to a file in the sandbox. Use this to create new files or replace entire file contents. For surgical edits to existing files, prefer the edit_file tool.',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The path to write to (relative to repo root)'
                },
                content: {
                    type: 'string',
                    description: 'The content to write to the file'
                },
                createDirectories: {
                    type: 'boolean',
                    description: 'Create parent directories if they do not exist (default: true)'
                }
            },
            required: [
                'path',
                'content'
            ]
        }
    },
    {
        name: 'edit_file',
        description: 'Make surgical edits to a file using search and replace. Use this for targeted changes to specific sections of a file. More precise than write_file for modifications.',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The path to the file (relative to repo root)'
                },
                oldText: {
                    type: 'string',
                    description: 'The exact text to find and replace'
                },
                newText: {
                    type: 'string',
                    description: 'The text to replace it with'
                },
                replaceAll: {
                    type: 'boolean',
                    description: 'Replace all occurrences (default: false, replaces first only)'
                }
            },
            required: [
                'path',
                'oldText',
                'newText'
            ]
        }
    },
    {
        name: 'delete_file',
        description: 'Delete a file or directory from the sandbox. Use with caution. For directories, must explicitly set recursive=true.',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The path to delete (relative to repo root)'
                },
                recursive: {
                    type: 'boolean',
                    description: 'Required for directories - delete recursively'
                }
            },
            required: [
                'path'
            ]
        }
    },
    // --------------------------------------------------------------------------
    // Execution
    // --------------------------------------------------------------------------
    {
        name: 'run_command',
        description: 'Execute a shell command in the sandbox. Use this to run build commands, install dependencies, run tests, or any shell operation. Commands run in the repo root by default.',
        parameters: {
            type: 'object',
            properties: {
                command: {
                    type: 'string',
                    description: 'The command to execute (e.g., "npm install", "pnpm build")'
                },
                cwd: {
                    type: 'string',
                    description: 'Optional working directory (relative to repo root)'
                },
                timeout: {
                    type: 'number',
                    description: 'Timeout in milliseconds (default: 60000)'
                }
            },
            required: [
                'command'
            ]
        }
    },
    {
        name: 'start_dev_server',
        description: 'Start a development server in the sandbox. Use this to preview the application. Returns a preview URL that can be accessed in the browser.',
        parameters: {
            type: 'object',
            properties: {
                command: {
                    type: 'string',
                    description: 'The command to start the server (e.g., "npm run dev", "pnpm dev")'
                },
                port: {
                    type: 'number',
                    description: 'The port the server will run on (default: 3000)'
                }
            },
            required: []
        }
    },
    {
        name: 'get_preview_url',
        description: 'Get the preview URL for the running sandbox. Use this after starting a dev server to get the URL where the app can be previewed.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    // --------------------------------------------------------------------------
    // Git Operations
    // --------------------------------------------------------------------------
    {
        name: 'git_status',
        description: 'Get the current git status showing modified, added, and deleted files. Use this to see what changes have been made before committing.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'git_diff',
        description: 'Show the diff of changes in the working tree. Use this to review specific changes before committing.',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'Optional path to diff a specific file'
                },
                staged: {
                    type: 'boolean',
                    description: 'Show diff of staged changes only (default: false shows unstaged)'
                }
            },
            required: []
        }
    },
    {
        name: 'git_commit',
        description: 'Commit staged changes with a message. Use this after making changes that should be saved as a commit. Stage files first using git_add.',
        parameters: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'The commit message describing the changes'
                },
                stageAll: {
                    type: 'boolean',
                    description: 'Stage all modified files before committing (default: false)'
                }
            },
            required: [
                'message'
            ]
        }
    },
    {
        name: 'git_push',
        description: 'Push commits to the remote repository. Use this after committing to sync changes with GitHub. May require authentication for private repos.',
        parameters: {
            type: 'object',
            properties: {
                branch: {
                    type: 'string',
                    description: 'The branch to push (defaults to current branch)'
                },
                setUpstream: {
                    type: 'boolean',
                    description: 'Set upstream tracking for the branch (default: true for new branches)'
                }
            },
            required: []
        }
    },
    {
        name: 'create_branch',
        description: 'Create and checkout a new git branch. Use this to start work on a feature or fix. Can auto-generate branch names from the active ticket context.',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'The branch name. If not provided, generates from active ticket (e.g., "feature/arc-042-fix-bug")'
                },
                fromBranch: {
                    type: 'string',
                    description: 'The branch to create from (defaults to current branch)'
                }
            },
            required: []
        }
    },
    // --------------------------------------------------------------------------
    // Coding Task Management
    // --------------------------------------------------------------------------
    {
        name: 'create_coding_task',
        description: 'Create a new coding task to track work. Links to projects/tickets and maintains conversation history. Use this when starting a significant coding session.',
        parameters: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    description: 'Title describing the coding task'
                },
                description: {
                    type: 'string',
                    description: 'Detailed description of what needs to be done'
                },
                projectId: {
                    type: 'string',
                    description: 'Optional project ID to link this task to'
                },
                ticketId: {
                    type: 'string',
                    description: 'Optional ticket ID this task implements'
                },
                repositoryUrl: {
                    type: 'string',
                    description: 'The repository URL for this task'
                }
            },
            required: [
                'title',
                'description'
            ]
        }
    },
    {
        name: 'update_coding_task',
        description: 'Update the status or details of a coding task. Use this to mark tasks as completed, failed, or update progress.',
        parameters: {
            type: 'object',
            properties: {
                taskId: {
                    type: 'string',
                    description: 'The ID of the coding task to update'
                },
                status: {
                    type: 'string',
                    description: 'New status for the task',
                    enum: [
                        'pending',
                        'running',
                        'waiting_input',
                        'completed',
                        'failed',
                        'cancelled'
                    ]
                },
                filesModified: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'List of files that were modified'
                },
                commitSha: {
                    type: 'string',
                    description: 'The commit SHA if changes were committed'
                }
            },
            required: [
                'taskId'
            ]
        }
    },
    {
        name: 'list_coding_tasks',
        description: 'List coding tasks for the current user. Use this to see recent or active coding sessions.',
        parameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    description: 'Optional filter by status',
                    enum: [
                        'pending',
                        'running',
                        'waiting_input',
                        'completed',
                        'failed',
                        'cancelled'
                    ]
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of tasks to return (default: 10)'
                }
            },
            required: []
        }
    },
    // =========================================================================
    // Cron Jobs / Scheduled Automation
    // User-defined scheduled jobs similar to Clawdbot's cron system
    // =========================================================================
    {
        name: 'create_cron_job',
        description: 'Create a scheduled job that runs automatically. Use this when the user wants to set up recurring reminders, automated AI messages, email notifications, or webhook triggers. Examples: "Remind me every day at 9am to check emails", "Send me a summary every Monday morning", "Run a health check webhook every hour".',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'A short, descriptive name for the job (e.g., "Daily standup reminder", "Weekly summary")'
                },
                description: {
                    type: 'string',
                    description: 'Optional longer description of what this job does'
                },
                scheduleType: {
                    type: 'string',
                    description: 'How often the job should run',
                    enum: [
                        'once',
                        'interval',
                        'daily',
                        'weekly'
                    ]
                },
                scheduleTime: {
                    type: 'string',
                    description: 'When to run. For "once": ISO date string. For "daily"/"weekly": time in HH:MM format (24h). For "interval": number of minutes.'
                },
                daysOfWeek: {
                    type: 'array',
                    items: {
                        type: 'number'
                    },
                    description: 'For weekly jobs: which days to run (0=Sunday, 1=Monday, etc.)'
                },
                actionType: {
                    type: 'string',
                    description: 'What the job should do when triggered',
                    enum: [
                        'ai_message',
                        'email',
                        'webhook'
                    ]
                },
                prompt: {
                    type: 'string',
                    description: 'For ai_message: the prompt to send to Claw AI when the job runs'
                },
                emailSubject: {
                    type: 'string',
                    description: 'For email: the subject line'
                },
                emailBody: {
                    type: 'string',
                    description: 'For email: the message body'
                },
                recipientEmail: {
                    type: 'string',
                    description: 'For email: who to send to (defaults to user email)'
                },
                webhookUrl: {
                    type: 'string',
                    description: 'For webhook: the URL to call'
                },
                deliveryChannel: {
                    type: 'string',
                    description: 'Where to deliver AI responses (for ai_message jobs)',
                    enum: [
                        'web',
                        'email',
                        'whatsapp',
                        'telegram'
                    ]
                },
                timezone: {
                    type: 'string',
                    description: 'Timezone for scheduling (e.g., "America/Los_Angeles", "Europe/London"). Defaults to UTC.'
                }
            },
            required: [
                'name',
                'scheduleType',
                'actionType'
            ]
        }
    },
    {
        name: 'list_cron_jobs',
        description: 'List all scheduled jobs for the user. Use this when the user asks about their scheduled tasks, reminders, or automations.',
        parameters: {
            type: 'object',
            properties: {
                includeInactive: {
                    type: 'boolean',
                    description: 'Whether to include paused/inactive jobs. Defaults to false.'
                }
            },
            required: []
        }
    },
    {
        name: 'toggle_cron_job',
        description: 'Pause or resume a scheduled job. Use this when the user wants to temporarily disable a job without deleting it.',
        parameters: {
            type: 'object',
            properties: {
                jobId: {
                    type: 'string',
                    description: 'The ID of the job to toggle'
                }
            },
            required: [
                'jobId'
            ]
        }
    },
    {
        name: 'delete_cron_job',
        description: 'Permanently delete a scheduled job. Use this when the user wants to remove a job they no longer need.',
        parameters: {
            type: 'object',
            properties: {
                jobId: {
                    type: 'string',
                    description: 'The ID of the job to delete'
                }
            },
            required: [
                'jobId'
            ]
        }
    },
    // ==========================================================================
    // Conversation Compaction Tools
    // ==========================================================================
    {
        name: 'compact_conversation',
        description: 'Compress older messages in the conversation into a summary to save context space. ' + 'Use this when the user asks to summarize or compact the conversation, or when the ' + 'conversation is getting very long. This preserves key context while reducing token usage.',
        parameters: {
            type: 'object',
            properties: {
                sessionId: {
                    type: 'string',
                    description: 'The chat session ID to compact'
                },
                keepRecentCount: {
                    type: 'number',
                    description: 'Number of recent messages to keep uncompacted (default: 10)'
                },
                instructions: {
                    type: 'string',
                    description: 'Optional focus instructions for what to emphasize in the summary'
                }
            },
            required: [
                'sessionId'
            ]
        }
    },
    {
        name: 'get_compaction_summary',
        description: 'Retrieve the existing compaction summary for a conversation session. ' + 'Use this to recall context from earlier in a long conversation.',
        parameters: {
            type: 'object',
            properties: {
                sessionId: {
                    type: 'string',
                    description: 'The chat session ID to get compaction for'
                }
            },
            required: [
                'sessionId'
            ]
        }
    },
    // ==========================================================================
    // Channel Integration Tools - WhatsApp, Telegram, iMessage, Slack, Discord
    // ==========================================================================
    {
        name: 'list_channel_integrations',
        description: 'List all connected messaging platform integrations. Use this to see which ' + 'channels (WhatsApp, Telegram, iMessage, Slack, Discord) are connected and their status.',
        parameters: {
            type: 'object',
            properties: {
                includeDisabled: {
                    type: 'boolean',
                    description: 'Include disabled integrations (default: false)'
                }
            },
            required: []
        }
    },
    {
        name: 'get_channel_conversations',
        description: 'Get recent conversations from connected messaging platforms. Returns a unified ' + 'inbox view with contact info, last message, and unread counts.',
        parameters: {
            type: 'object',
            properties: {
                platform: {
                    type: 'string',
                    enum: [
                        'whatsapp',
                        'telegram',
                        'imessage',
                        'slack',
                        'discord'
                    ],
                    description: 'Filter by specific platform (optional)'
                },
                limit: {
                    type: 'number',
                    description: 'Maximum conversations to return (default: 20)'
                }
            },
            required: []
        }
    },
    {
        name: 'send_channel_message',
        description: 'Send a message via a connected messaging platform. Use this to reply to ' + 'conversations or send proactive messages through WhatsApp, Telegram, etc. ' + 'OWNER ONLY: Only the owner can send outbound messages.',
        parameters: {
            type: 'object',
            properties: {
                integrationId: {
                    type: 'string',
                    description: 'The channel integration ID to send through'
                },
                recipientId: {
                    type: 'string',
                    description: 'The recipient identifier (phone number, chat ID, etc.)'
                },
                content: {
                    type: 'string',
                    description: 'Message content to send'
                },
                messageType: {
                    type: 'string',
                    enum: [
                        'text',
                        'voice'
                    ],
                    description: 'Message type (default: text)'
                }
            },
            required: [
                'integrationId',
                'recipientId',
                'content'
            ]
        },
        ownerOnly: true
    },
    {
        name: 'search_channel_messages',
        description: 'Search messages across all connected messaging platforms. Useful for finding ' + 'past conversations, tracking topics, or locating specific information.',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query'
                },
                platform: {
                    type: 'string',
                    enum: [
                        'whatsapp',
                        'telegram',
                        'imessage',
                        'slack',
                        'discord'
                    ],
                    description: 'Filter by specific platform (optional)'
                },
                limit: {
                    type: 'number',
                    description: 'Maximum results to return (default: 20)'
                }
            },
            required: [
                'query'
            ]
        }
    },
    // =============================================================================
    // ERV Dimension Tools
    // =============================================================================
    {
        name: 'create_dimension',
        description: 'Create a custom dimension view for entities. Use this when users want to ' + 'visualize their data in a new way, like "show me my tasks as a constellation" ' + 'or "create a timeline of my projects". Dimensions define how entities are ' + 'arranged, styled, and connected.',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name for the dimension (e.g., "Task Constellation", "Project Timeline")'
                },
                metaphor: {
                    type: 'string',
                    description: 'Visual metaphor for the dimension. Affects styling and arrangement.',
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
                        'tree'
                    ]
                },
                arrangement: {
                    type: 'string',
                    description: 'How entities are arranged spatially',
                    enum: [
                        'list',
                        'grid',
                        'graph',
                        'tree',
                        'flow',
                        'orbit',
                        'stack'
                    ]
                },
                entityTypes: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Types of entities to include (e.g., ["Ticket", "Project"]). Leave empty for all.'
                },
                description: {
                    type: 'string',
                    description: 'Optional description of what this dimension shows'
                }
            },
            required: [
                'name',
                'metaphor',
                'arrangement'
            ]
        }
    },
    {
        name: 'navigate_to_dimension',
        description: 'Navigate to a dimension view. Use this when users want to see a specific ' + 'dimension like "show me the kanban", "open the graph view", or "go to my feed". ' + 'Can navigate to preset dimensions or custom ones created by the user.',
        parameters: {
            type: 'object',
            properties: {
                dimensionId: {
                    type: 'string',
                    description: 'ID of the dimension to navigate to. Presets: feed, kanban, graph, graph-3d, ' + 'calendar, grid, table, ipod, quest-log, skill-tree. Or a custom dimension ID.'
                }
            },
            required: [
                'dimensionId'
            ]
        }
    },
    {
        name: 'list_dimensions',
        description: 'List all available dimensions including presets and custom user dimensions. ' + 'Use this when users ask "what views do I have?" or "show me available dimensions".',
        parameters: {
            type: 'object',
            properties: {
                includePresets: {
                    type: 'boolean',
                    description: 'Whether to include preset dimensions (default: true)'
                }
            },
            required: []
        }
    },
    {
        name: 'search_entities',
        description: 'Search across all entities in the ERV system. Use this when users ask about ' + 'their data like "find all high priority tickets", "show me projects tagged with AI", ' + 'or "what tracks do I have from last month".',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query to find entities'
                },
                entityTypes: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by entity types (e.g., ["Ticket", "Project", "Track"]). Leave empty for all.'
                },
                limit: {
                    type: 'number',
                    description: 'Maximum results to return (default: 20)'
                }
            },
            required: [
                'query'
            ]
        }
    },
    // =============================================================================
    // Video/Remotion Tools
    // =============================================================================
    {
        name: 'create_video_composition',
        description: 'Create a new video composition for creating videos, presentations, or lyric videos. ' + 'Use this when users want to create video content like "make a lyric video for this song", ' + '"create a presentation video", or "add text overlays to this video".',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name for the video composition'
                },
                type: {
                    type: 'string',
                    description: 'Type of video to create',
                    enum: [
                        'lyric-video',
                        'presentation',
                        'text-overlay',
                        'social-story',
                        'music-visualizer',
                        'slideshow',
                        'custom'
                    ]
                },
                preset: {
                    type: 'string',
                    description: 'Video format preset',
                    enum: [
                        'instagram-story',
                        'instagram-post',
                        'instagram-reel',
                        'tiktok',
                        'youtube',
                        'youtube-short',
                        'twitter',
                        '1080p',
                        '720p',
                        '4k',
                        'square',
                        'portrait'
                    ]
                },
                durationSeconds: {
                    type: 'number',
                    description: 'Duration of the video in seconds (default: 30)'
                },
                backgroundColor: {
                    type: 'string',
                    description: 'Background color (hex or CSS color)'
                },
                backgroundGradient: {
                    type: 'string',
                    description: 'Background gradient (CSS gradient string)'
                }
            },
            required: [
                'name',
                'type'
            ]
        }
    },
    {
        name: 'add_text_overlay',
        description: 'Add a text overlay to a video composition. Use this to add titles, captions, ' + 'watermarks, or any text content to videos. Supports animations and positioning.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition to add text to'
                },
                text: {
                    type: 'string',
                    description: 'The text content to display'
                },
                position: {
                    type: 'string',
                    description: 'Position on screen',
                    enum: [
                        'top-left',
                        'top-center',
                        'top-right',
                        'center-left',
                        'center',
                        'center-right',
                        'bottom-left',
                        'bottom-center',
                        'bottom-right'
                    ]
                },
                startTime: {
                    type: 'number',
                    description: 'When the text appears (in seconds)'
                },
                duration: {
                    type: 'number',
                    description: 'How long the text stays on screen (in seconds)'
                },
                fontSize: {
                    type: 'number',
                    description: 'Font size in pixels (default: 32)'
                },
                color: {
                    type: 'string',
                    description: 'Text color (default: white)'
                },
                animation: {
                    type: 'string',
                    description: 'Entry animation for the text',
                    enum: [
                        'none',
                        'fade',
                        'slide-up',
                        'slide-down',
                        'slide-left',
                        'slide-right',
                        'scale',
                        'typewriter',
                        'blur',
                        'glitch'
                    ]
                }
            },
            required: [
                'compositionId',
                'text'
            ]
        }
    },
    {
        name: 'add_lyrics_to_video',
        description: 'Add synchronized lyrics to a video composition. Creates karaoke-style lyric videos ' + 'with word highlighting, bouncing text, or typewriter effects. Provide lyrics with timestamps.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition'
                },
                audioSrc: {
                    type: 'string',
                    description: 'URL or path to the audio file'
                },
                lyrics: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            text: {
                                type: 'string'
                            },
                            startTime: {
                                type: 'number'
                            },
                            endTime: {
                                type: 'number'
                            }
                        }
                    },
                    description: 'Array of lyric lines with timing: [{text, startTime, endTime}]'
                },
                style: {
                    type: 'string',
                    description: 'Lyric display style',
                    enum: [
                        'karaoke',
                        'subtitle',
                        'bounce',
                        'typewriter'
                    ]
                },
                fontFamily: {
                    type: 'string',
                    description: 'Font family for lyrics (default: Inter)'
                },
                color: {
                    type: 'string',
                    description: 'Text color for lyrics'
                },
                highlightColor: {
                    type: 'string',
                    description: 'Highlight color for active words (karaoke style)'
                },
                position: {
                    type: 'string',
                    description: 'Vertical position of lyrics',
                    enum: [
                        'top',
                        'center',
                        'bottom'
                    ]
                }
            },
            required: [
                'compositionId',
                'audioSrc',
                'lyrics'
            ]
        }
    },
    {
        name: 'add_media_to_video',
        description: 'Add an image or video layer to a composition. Use for backgrounds, overlays, ' + 'or picture-in-picture effects.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition'
                },
                mediaSrc: {
                    type: 'string',
                    description: 'URL or path to the media file (image or video)'
                },
                mediaType: {
                    type: 'string',
                    description: 'Type of media',
                    enum: [
                        'image',
                        'video'
                    ]
                },
                startTime: {
                    type: 'number',
                    description: 'When the media appears (in seconds)'
                },
                duration: {
                    type: 'number',
                    description: 'How long the media stays on screen (in seconds)'
                },
                position: {
                    type: 'object',
                    description: 'Position {x, y} in pixels'
                },
                scale: {
                    type: 'number',
                    description: 'Scale factor (1 = original size)'
                },
                opacity: {
                    type: 'number',
                    description: 'Opacity 0-1'
                },
                objectFit: {
                    type: 'string',
                    description: 'How the media fits its container',
                    enum: [
                        'contain',
                        'cover',
                        'fill'
                    ]
                }
            },
            required: [
                'compositionId',
                'mediaSrc',
                'mediaType'
            ]
        }
    },
    {
        name: 'preview_video',
        description: 'Generate a preview of a video composition. Opens the video player with the current ' + 'composition state for review before rendering.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition to preview'
                },
                openInCanvas: {
                    type: 'boolean',
                    description: 'Whether to open the preview in the infinite canvas (default: false)'
                }
            },
            required: [
                'compositionId'
            ]
        }
    },
    {
        name: 'render_video',
        description: 'Render a video composition to a downloadable MP4/WebM/GIF file. Use mode="sandbox" to ' + 'render locally using ffmpeg.wasm (free, no cloud needed) or mode="server" for server-side ' + 'rendering. Sandbox mode is recommended for videos under 60 seconds.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition to render'
                },
                format: {
                    type: 'string',
                    description: 'Output format',
                    enum: [
                        'mp4',
                        'webm',
                        'gif'
                    ]
                },
                quality: {
                    type: 'string',
                    description: 'Quality preset (draft=fast/lower quality, high=best quality)',
                    enum: [
                        'draft',
                        'standard',
                        'high'
                    ]
                },
                mode: {
                    type: 'string',
                    description: 'Render mode: sandbox (local, free) or server (cloud, costs $)',
                    enum: [
                        'sandbox',
                        'server'
                    ]
                }
            },
            required: [
                'compositionId'
            ]
        }
    },
    {
        name: 'sync_lyrics_to_audio',
        description: 'Automatically sync lyrics text to an audio file using AI transcription. Takes raw lyrics ' + 'and audio, returns timed lyric data ready for add_lyrics_to_video. Uses Whisper API for ' + 'word-level timestamp detection.',
        parameters: {
            type: 'object',
            properties: {
                audioSrc: {
                    type: 'string',
                    description: 'URL or path to the audio file'
                },
                lyrics: {
                    type: 'string',
                    description: 'Raw lyrics text (one line per lyric line, no timestamps needed)'
                },
                language: {
                    type: 'string',
                    description: 'Language code (e.g., "en", "es", "fr"). Auto-detected if not specified.'
                }
            },
            required: [
                'audioSrc',
                'lyrics'
            ]
        }
    },
    {
        name: 'get_render_status',
        description: 'Check the status of a video render job. Returns progress percentage, output URL when ' + 'complete, or error message if failed.',
        parameters: {
            type: 'object',
            properties: {
                jobId: {
                    type: 'string',
                    description: 'The render job ID returned from render_video'
                }
            },
            required: [
                'jobId'
            ]
        }
    },
    {
        name: 'add_particle_effect',
        description: 'Add particle effects to a video composition. Creates confetti, snow, dust, sparks, ' + 'or custom particles. Great for celebrations, atmosphere, and visual interest.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition'
                },
                effect: {
                    type: 'string',
                    description: 'Type of particle effect',
                    enum: [
                        'confetti',
                        'snow',
                        'dust',
                        'sparks',
                        'bubbles',
                        'leaves',
                        'stars',
                        'custom'
                    ]
                },
                particleCount: {
                    type: 'number',
                    description: 'Number of particles (default: 100, max: 500)'
                },
                color: {
                    type: 'string',
                    description: 'Particle color (hex, CSS color, or "multi" for random colors)'
                },
                direction: {
                    type: 'string',
                    description: 'Direction of particle movement',
                    enum: [
                        'up',
                        'down',
                        'left',
                        'right',
                        'random',
                        'explode'
                    ]
                },
                speed: {
                    type: 'number',
                    description: 'Speed multiplier (default: 1)'
                },
                gravity: {
                    type: 'number',
                    description: 'Gravity effect (0 = no gravity, 1 = normal)'
                },
                startTime: {
                    type: 'number',
                    description: 'When particles start (in seconds)'
                },
                duration: {
                    type: 'number',
                    description: 'How long particles last (in seconds)'
                }
            },
            required: [
                'compositionId',
                'effect'
            ]
        }
    },
    {
        name: 'add_waveform_visualizer',
        description: 'Add an audio waveform visualization to a video composition. Creates bars, lines, ' + 'circles, or mirror effects that respond to audio frequencies. Perfect for music videos.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition'
                },
                audioSrc: {
                    type: 'string',
                    description: 'URL or path to the audio file'
                },
                style: {
                    type: 'string',
                    description: 'Visualization style',
                    enum: [
                        'bars',
                        'line',
                        'circle',
                        'mirror',
                        'spectrum',
                        'pulse'
                    ]
                },
                color: {
                    type: 'string',
                    description: 'Waveform color (supports gradients with color1,color2 format)'
                },
                position: {
                    type: 'string',
                    description: 'Position of the waveform',
                    enum: [
                        'top',
                        'center',
                        'bottom',
                        'full'
                    ]
                },
                barWidth: {
                    type: 'number',
                    description: 'Width of bars in pixels (for bars style)'
                },
                smoothing: {
                    type: 'number',
                    description: 'Smoothing factor 0-1 (higher = smoother)'
                },
                sensitivity: {
                    type: 'number',
                    description: 'Audio sensitivity multiplier (default: 1)'
                }
            },
            required: [
                'compositionId',
                'audioSrc',
                'style'
            ]
        }
    },
    {
        name: 'add_gradient_background',
        description: 'Add an animated or static gradient background to a video composition. ' + 'Supports linear, radial, and conic gradients with optional animation.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition'
                },
                colors: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Array of colors for the gradient (2-5 colors)'
                },
                type: {
                    type: 'string',
                    description: 'Type of gradient',
                    enum: [
                        'linear',
                        'radial',
                        'conic'
                    ]
                },
                angle: {
                    type: 'number',
                    description: 'Angle in degrees (for linear gradient)'
                },
                animate: {
                    type: 'boolean',
                    description: 'Whether to animate the gradient rotation'
                },
                animationSpeed: {
                    type: 'number',
                    description: 'Degrees per second for animation (default: 30)'
                }
            },
            required: [
                'compositionId',
                'colors'
            ]
        }
    },
    {
        name: 'create_slideshow',
        description: 'Create an automatic slideshow from multiple images. Applies Ken Burns effect, ' + 'transitions, and optional background music. Perfect for photo montages.',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name for the slideshow'
                },
                images: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Array of image URLs or paths'
                },
                durationPerSlide: {
                    type: 'number',
                    description: 'Seconds per image (default: 3)'
                },
                transition: {
                    type: 'string',
                    description: 'Transition between slides',
                    enum: [
                        'fade',
                        'slide',
                        'zoom',
                        'blur',
                        'wipe',
                        'none'
                    ]
                },
                transitionDuration: {
                    type: 'number',
                    description: 'Duration of transitions in seconds (default: 0.5)'
                },
                kenBurns: {
                    type: 'boolean',
                    description: 'Apply Ken Burns zoom/pan effect (default: true)'
                },
                backgroundMusic: {
                    type: 'string',
                    description: 'URL or path to background music (optional)'
                },
                preset: {
                    type: 'string',
                    description: 'Video format preset',
                    enum: [
                        'instagram-story',
                        'instagram-post',
                        'tiktok',
                        'youtube',
                        'youtube-short',
                        '1080p',
                        'square'
                    ]
                }
            },
            required: [
                'name',
                'images'
            ]
        }
    },
    {
        name: 'add_cinematic_effect',
        description: 'Apply cinematic effects to a video composition. Includes letterbox, color grading, ' + 'film grain, vignette, and more for a professional film look.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition'
                },
                effect: {
                    type: 'string',
                    description: 'Cinematic effect to apply',
                    enum: [
                        'letterbox',
                        'film_grain',
                        'vignette',
                        'color_grade',
                        'bloom',
                        'chromatic_aberration',
                        'lens_flare'
                    ]
                },
                intensity: {
                    type: 'number',
                    description: 'Effect intensity 0-1 (default: 0.5)'
                },
                colorGrade: {
                    type: 'string',
                    description: 'Color grading preset (for color_grade effect)',
                    enum: [
                        'cinematic',
                        'vintage',
                        'cold',
                        'warm',
                        'noir',
                        'cyberpunk',
                        'pastel'
                    ]
                },
                letterboxRatio: {
                    type: 'string',
                    description: 'Aspect ratio for letterbox',
                    enum: [
                        '2.35:1',
                        '2.39:1',
                        '1.85:1',
                        '4:3'
                    ]
                }
            },
            required: [
                'compositionId',
                'effect'
            ]
        }
    },
    {
        name: 'add_kinetic_typography',
        description: 'Create kinetic typography animation - text that moves, scales, and transforms dynamically. ' + 'Perfect for music videos, title sequences, and promotional content.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition'
                },
                text: {
                    type: 'string',
                    description: 'Text to animate (can include multiple lines)'
                },
                style: {
                    type: 'string',
                    description: 'Animation style',
                    enum: [
                        'impact',
                        'wave',
                        'cascade',
                        'explosion',
                        'bounce',
                        'zoom',
                        'rotate',
                        'glitch'
                    ]
                },
                fontFamily: {
                    type: 'string',
                    description: 'Font family (default: Inter)'
                },
                fontSize: {
                    type: 'number',
                    description: 'Font size in pixels'
                },
                color: {
                    type: 'string',
                    description: 'Text color'
                },
                startTime: {
                    type: 'number',
                    description: 'When animation starts (in seconds)'
                },
                duration: {
                    type: 'number',
                    description: 'Animation duration (in seconds)'
                },
                syncToAudio: {
                    type: 'boolean',
                    description: 'Sync animation to audio beats (requires audio layer)'
                }
            },
            required: [
                'compositionId',
                'text',
                'style'
            ]
        }
    },
    {
        name: 'export_for_platform',
        description: 'Export a video composition optimized for a specific social media platform. ' + 'Automatically adjusts resolution, bitrate, and format for optimal quality.',
        parameters: {
            type: 'object',
            properties: {
                compositionId: {
                    type: 'string',
                    description: 'ID of the video composition to export'
                },
                platform: {
                    type: 'string',
                    description: 'Target platform',
                    enum: [
                        'instagram_story',
                        'instagram_reel',
                        'instagram_post',
                        'tiktok',
                        'youtube',
                        'youtube_short',
                        'twitter',
                        'linkedin',
                        'facebook'
                    ]
                },
                includeCaption: {
                    type: 'boolean',
                    description: 'Include burned-in captions if available'
                },
                includeSafeZone: {
                    type: 'boolean',
                    description: 'Add safe zone guides for platform UI elements'
                }
            },
            required: [
                'compositionId',
                'platform'
            ]
        }
    },
    {
        name: 'list_video_compositions',
        description: 'List all video compositions. Returns composition IDs, names, types, and preview info.',
        parameters: {
            type: 'object',
            properties: {
                filter: {
                    type: 'string',
                    description: 'Filter by type (optional)',
                    enum: [
                        'lyric-video',
                        'presentation',
                        'text-overlay',
                        'social-story',
                        'music-visualizer',
                        'slideshow',
                        'all'
                    ]
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of results (default: 20)'
                }
            },
            required: []
        }
    },
    // =============================================================================
    // Image Processing & Effects Tools
    // =============================================================================
    {
        name: 'apply_image_effect',
        description: 'Apply visual effects to an image. Includes halftone, duotone, blur, glitch, vintage, ' + 'cyberpunk, noir, and more. Use for creating unique branded looks, artistic transformations, ' + 'or consistent visual identity.',
        parameters: {
            type: 'object',
            properties: {
                imageSrc: {
                    type: 'string',
                    description: 'Image URL, base64 data, or file path'
                },
                effect: {
                    type: 'string',
                    description: 'Effect type to apply',
                    enum: [
                        'halftone',
                        'duotone',
                        'posterize',
                        'pixelate',
                        'ascii',
                        'line-art',
                        'grayscale',
                        'sepia',
                        'invert',
                        'hue-shift',
                        'saturate',
                        'color-replace',
                        'gaussian-blur',
                        'motion-blur',
                        'radial-blur',
                        'zoom-blur',
                        'tilt-shift',
                        'swirl',
                        'bulge',
                        'pinch',
                        'wave',
                        'ripple',
                        'fisheye',
                        'noise',
                        'film-grain',
                        'scanlines',
                        'vignette',
                        'oil-paint',
                        'watercolor',
                        'sketch',
                        'comic',
                        'glitch',
                        'vintage',
                        'cyberpunk',
                        'noir',
                        'pop-art',
                        'blueprint'
                    ]
                },
                params: {
                    type: 'object',
                    description: 'Effect-specific parameters (e.g., { frequency: 45, angle: 45, shape: "line" } for halftone)'
                },
                outputFormat: {
                    type: 'string',
                    description: 'Output image format',
                    enum: [
                        'png',
                        'jpg',
                        'webp'
                    ]
                },
                quality: {
                    type: 'number',
                    description: 'Output quality 0-100 (default: 90)'
                }
            },
            required: [
                'imageSrc',
                'effect'
            ]
        }
    },
    {
        name: 'generate_app_icon',
        description: 'Generate a unique app icon with specified style and effects. Creates multiple sizes ' + 'suitable for iOS, Android, and web. Perfect for creating consistent branded icons.',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'App name (used for naming output files)'
                },
                style: {
                    type: 'string',
                    description: 'Icon visual style',
                    enum: [
                        'flat',
                        'gradient',
                        'glassmorphism',
                        'neumorphic',
                        'illustrated',
                        '3d',
                        'halftone',
                        'minimal'
                    ]
                },
                primaryColor: {
                    type: 'string',
                    description: 'Primary brand color (hex)'
                },
                secondaryColor: {
                    type: 'string',
                    description: 'Secondary color for gradients (hex, optional)'
                },
                backgroundColor: {
                    type: 'string',
                    description: 'Background color (hex, optional)'
                },
                symbol: {
                    type: 'string',
                    description: 'Icon symbol - can be an emoji, letter, or Lucide icon name'
                },
                shape: {
                    type: 'string',
                    description: 'Icon shape',
                    enum: [
                        'square',
                        'rounded',
                        'circle',
                        'squircle'
                    ]
                },
                effects: {
                    type: 'array',
                    items: {
                        type: 'object'
                    },
                    description: 'Additional effects (shadow, glow, border, etc.)'
                },
                sizes: {
                    type: 'array',
                    items: {
                        type: 'number'
                    },
                    description: 'Output sizes in pixels (default: [64, 128, 256, 512, 1024])'
                }
            },
            required: [
                'name',
                'style',
                'primaryColor'
            ]
        }
    },
    {
        name: 'remove_background',
        description: 'Remove the background from an image using AI. Supports portraits, products, and general ' + 'images. Returns transparent PNG.',
        parameters: {
            type: 'object',
            properties: {
                imageSrc: {
                    type: 'string',
                    description: 'Image URL, base64 data, or file path'
                },
                model: {
                    type: 'string',
                    description: 'AI model optimized for specific content types',
                    enum: [
                        'auto',
                        'portrait',
                        'product',
                        'general'
                    ]
                },
                tolerance: {
                    type: 'number',
                    description: 'Edge sensitivity 0-100 (default: 50)'
                },
                edgeSoftness: {
                    type: 'number',
                    description: 'Feather amount in pixels 0-20 (default: 2)'
                },
                refineEdges: {
                    type: 'boolean',
                    description: 'Use AI edge refinement for better hair/fur detection'
                }
            },
            required: [
                'imageSrc'
            ]
        }
    },
    {
        name: 'create_branded_image',
        description: 'Transform an image to match OpenClaw-OS branded visual identity. Applies consistent effects ' + 'for a cohesive look across all OS assets.',
        parameters: {
            type: 'object',
            properties: {
                imageSrc: {
                    type: 'string',
                    description: 'Source image URL or path'
                },
                preset: {
                    type: 'string',
                    description: 'Brand preset to apply',
                    enum: [
                        'signature',
                        'light',
                        'dark',
                        'vibrant',
                        'minimal',
                        'retro',
                        'futuristic'
                    ]
                },
                customEffects: {
                    type: 'array',
                    items: {
                        type: 'object'
                    },
                    description: 'Override or add effects to the preset'
                },
                outputFormat: {
                    type: 'string',
                    description: 'Output format',
                    enum: [
                        'png',
                        'jpg',
                        'webp'
                    ]
                }
            },
            required: [
                'imageSrc',
                'preset'
            ]
        }
    },
    {
        name: 'batch_process_images',
        description: 'Apply consistent effects to multiple images at once. Perfect for creating cohesive ' + 'galleries, icon sets, or branded asset collections.',
        parameters: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Array of image URLs or paths'
                },
                effects: {
                    type: 'array',
                    items: {
                        type: 'object'
                    },
                    description: 'Effects to apply to all images'
                },
                preset: {
                    type: 'string',
                    description: 'Named preset to apply (alternative to effects array)',
                    enum: [
                        'vintage',
                        'cyberpunk',
                        'noir',
                        'pop-art',
                        'blueprint',
                        'signature'
                    ]
                },
                outputPrefix: {
                    type: 'string',
                    description: 'Filename prefix for outputs'
                },
                outputFormat: {
                    type: 'string',
                    description: 'Output format for all images',
                    enum: [
                        'png',
                        'jpg',
                        'webp'
                    ]
                }
            },
            required: [
                'images'
            ]
        }
    },
    {
        name: 'create_color_palette',
        description: 'Extract or generate a color palette from an image or create one from scratch. ' + 'Useful for theming, branding, and ensuring visual consistency.',
        parameters: {
            type: 'object',
            properties: {
                source: {
                    type: 'string',
                    description: 'Image URL to extract colors from, or "generate" for AI generation'
                },
                count: {
                    type: 'number',
                    description: 'Number of colors in palette (default: 5)'
                },
                mode: {
                    type: 'string',
                    description: 'Palette generation mode',
                    enum: [
                        'extract',
                        'analogous',
                        'complementary',
                        'triadic',
                        'split-complementary',
                        'monochromatic'
                    ]
                },
                baseColor: {
                    type: 'string',
                    description: 'Base color for generated palettes (hex)'
                },
                includeShades: {
                    type: 'boolean',
                    description: 'Include light/dark shades of each color'
                }
            },
            required: [
                'source'
            ]
        }
    },
    {
        name: 'resize_and_crop',
        description: 'Resize, crop, and optimize images for specific use cases. Supports smart cropping ' + 'that preserves important content.',
        parameters: {
            type: 'object',
            properties: {
                imageSrc: {
                    type: 'string',
                    description: 'Source image URL or path'
                },
                width: {
                    type: 'number',
                    description: 'Target width in pixels'
                },
                height: {
                    type: 'number',
                    description: 'Target height in pixels'
                },
                fit: {
                    type: 'string',
                    description: 'How to fit image to dimensions',
                    enum: [
                        'contain',
                        'cover',
                        'fill',
                        'inside',
                        'outside'
                    ]
                },
                position: {
                    type: 'string',
                    description: 'Focal point for cropping',
                    enum: [
                        'center',
                        'top',
                        'right',
                        'bottom',
                        'left',
                        'top-left',
                        'top-right',
                        'bottom-left',
                        'bottom-right',
                        'smart'
                    ]
                },
                format: {
                    type: 'string',
                    description: 'Output format',
                    enum: [
                        'png',
                        'jpg',
                        'webp'
                    ]
                },
                quality: {
                    type: 'number',
                    description: 'Quality 0-100 (for jpg/webp)'
                }
            },
            required: [
                'imageSrc',
                'width',
                'height'
            ]
        }
    },
    {
        name: 'composite_images',
        description: 'Layer multiple images together with blend modes and positioning. Create collages, ' + 'overlays, and composite designs.',
        parameters: {
            type: 'object',
            properties: {
                baseImage: {
                    type: 'string',
                    description: 'Background/base image URL or path'
                },
                layers: {
                    type: 'array',
                    items: {
                        type: 'object'
                    },
                    description: 'Array of layers: [{src, x, y, width, height, opacity, blendMode}]'
                },
                outputWidth: {
                    type: 'number',
                    description: 'Final output width (optional)'
                },
                outputHeight: {
                    type: 'number',
                    description: 'Final output height (optional)'
                },
                format: {
                    type: 'string',
                    description: 'Output format',
                    enum: [
                        'png',
                        'jpg',
                        'webp'
                    ]
                }
            },
            required: [
                'baseImage',
                'layers'
            ]
        }
    },
    {
        name: 'generate_pattern',
        description: 'Generate seamless patterns and textures. Useful for backgrounds, UI elements, ' + 'and decorative graphics.',
        parameters: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    description: 'Pattern type',
                    enum: [
                        'dots',
                        'lines',
                        'grid',
                        'waves',
                        'noise',
                        'geometric',
                        'organic',
                        'halftone',
                        'checkerboard',
                        'stripes'
                    ]
                },
                width: {
                    type: 'number',
                    description: 'Pattern tile width (default: 256)'
                },
                height: {
                    type: 'number',
                    description: 'Pattern tile height (default: 256)'
                },
                colors: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Colors to use in pattern (hex values)'
                },
                density: {
                    type: 'number',
                    description: 'Pattern density 0-100 (default: 50)'
                },
                rotation: {
                    type: 'number',
                    description: 'Pattern rotation in degrees'
                },
                seamless: {
                    type: 'boolean',
                    description: 'Ensure pattern tiles seamlessly (default: true)'
                }
            },
            required: [
                'type'
            ]
        }
    },
    // =============================================================================
    // Talking Video Tools (AI Avatar Videos)
    // =============================================================================
    {
        name: 'create_talking_video',
        description: 'Create a talking head video with AI-generated script, cloned voice, and lip sync. ' + 'The full workflow: 1) Generate a script about the topic, 2) Generate voice audio using ' + 'ElevenLabs cloned voice, 3) Create background scene using Kling AI Pro, 4) Lip sync ' + 'with Veed Fast. Use when user says "make a video of me talking about X" or "create a ' + 'talking video".',
        parameters: {
            type: 'object',
            properties: {
                topic: {
                    type: 'string',
                    description: 'What the video should be about. This will be used to generate the script.'
                },
                sourcePhotoUrl: {
                    type: 'string',
                    description: 'URL of the photo to animate (headshot of the person)'
                },
                sceneStyle: {
                    type: 'string',
                    description: 'Background scene style for the video',
                    enum: [
                        'podcast_studio',
                        'office',
                        'outdoor',
                        'news_desk',
                        'living_room',
                        'conference'
                    ]
                },
                customScenePrompt: {
                    type: 'string',
                    description: 'Custom scene description (overrides sceneStyle if provided)'
                },
                duration: {
                    type: 'number',
                    description: 'Target video duration in seconds (default: 90)'
                },
                tone: {
                    type: 'string',
                    description: 'Tone of the script and delivery',
                    enum: [
                        'professional',
                        'casual',
                        'educational',
                        'entertaining'
                    ]
                }
            },
            required: [
                'topic',
                'sourcePhotoUrl'
            ]
        }
    },
    {
        name: 'generate_video_script',
        description: 'Generate just the script for a talking video without creating the full video. ' + 'Use this when user wants to review or edit the script before generating voice and video.',
        parameters: {
            type: 'object',
            properties: {
                topic: {
                    type: 'string',
                    description: 'What the script should be about'
                },
                duration: {
                    type: 'number',
                    description: 'Target duration in seconds (default: 90). Script will be ~150 words per minute.'
                },
                tone: {
                    type: 'string',
                    description: 'Tone of the script',
                    enum: [
                        'professional',
                        'casual',
                        'educational',
                        'entertaining'
                    ]
                },
                style: {
                    type: 'string',
                    description: 'Script style/format',
                    enum: [
                        'monologue',
                        'interview',
                        'tutorial',
                        'story'
                    ]
                }
            },
            required: [
                'topic'
            ]
        }
    },
    {
        name: 'generate_voice_audio',
        description: 'Generate voice audio from text using ElevenLabs cloned voice. Creates natural-sounding ' + 'speech that matches James\'s voice. Use when user wants to create audio narration or voice-over.',
        parameters: {
            type: 'object',
            properties: {
                text: {
                    type: 'string',
                    description: 'The text to convert to speech'
                },
                voiceId: {
                    type: 'string',
                    description: 'ElevenLabs voice ID (uses James\'s cloned voice by default)'
                },
                stability: {
                    type: 'number',
                    description: 'Voice stability 0-1 (higher = more consistent, lower = more expressive)'
                },
                similarityBoost: {
                    type: 'number',
                    description: 'Voice similarity 0-1 (higher = closer to original voice)'
                }
            },
            required: [
                'text'
            ]
        }
    },
    {
        name: 'navigate_to_video_studio',
        description: 'Open the video studio page (/video) for creating talking videos. Use when user wants ' + 'to "go to video studio", "open video creator", or "make a talking video" without specifying details.',
        parameters: {
            type: 'object',
            properties: {
                prefillTopic: {
                    type: 'string',
                    description: 'Optional topic to pre-fill in the video studio'
                }
            },
            required: []
        }
    },
    // =============================================================================
    // LTX-2 Video Generation Tools (Lightricks via Fal AI)
    // AI-powered video generation: text-to-video, image-to-video
    // =============================================================================
    {
        name: 'generate_video',
        description: 'Generate a video from a text prompt using LTX-2 AI model. Creates high-quality videos ' + 'from text descriptions. Use when user says "generate a video of X", "create a video showing X", ' + 'or "make me a video clip of X". Supports multiple aspect ratios and durations.',
        parameters: {
            type: 'object',
            properties: {
                prompt: {
                    type: 'string',
                    description: 'Detailed description of the video to generate. Be specific about motion, scene, lighting, etc.'
                },
                negative_prompt: {
                    type: 'string',
                    description: 'What to avoid in the video (default: blurry, low quality, distorted, watermark)'
                },
                preset: {
                    type: 'string',
                    description: 'Video preset for aspect ratio and duration',
                    enum: [
                        'landscape_short',
                        'landscape_long',
                        'portrait_short',
                        'portrait_long',
                        'square',
                        'cinematic'
                    ]
                },
                duration_seconds: {
                    type: 'number',
                    description: 'Approximate duration in seconds (4-6 seconds typical)'
                },
                seed: {
                    type: 'number',
                    description: 'Random seed for reproducibility'
                }
            },
            required: [
                'prompt'
            ]
        }
    },
    {
        name: 'animate_image',
        description: 'Animate a still image into a video using LTX-2 image-to-video. Takes a starting image and ' + 'creates motion based on the prompt. Use when user says "animate this image", "make this photo move", ' + 'or "bring this picture to life".',
        parameters: {
            type: 'object',
            properties: {
                image_url: {
                    type: 'string',
                    description: 'URL of the image to animate'
                },
                prompt: {
                    type: 'string',
                    description: 'Description of how the image should animate (e.g., "the person starts walking", "camera slowly zooms in")'
                },
                negative_prompt: {
                    type: 'string',
                    description: 'What to avoid in the animation'
                },
                duration_seconds: {
                    type: 'number',
                    description: 'Approximate duration in seconds (4-6 seconds typical)'
                },
                seed: {
                    type: 'number',
                    description: 'Random seed for reproducibility'
                }
            },
            required: [
                'image_url',
                'prompt'
            ]
        }
    },
    {
        name: 'list_video_presets',
        description: 'List available video generation presets with their aspect ratios and durations. ' + 'Use this to show the user what video formats are available.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    // =============================================================================
    // Autonomous Execution Tools (OpenClaw-inspired)
    // These tools enable Claw AI to spawn background tasks, work autonomously,
    // and announce results - making it feel like a real assistant that does work.
    // =============================================================================
    {
        name: 'spawn_task',
        description: 'Spawn a background task that runs independently and announces the result when done. ' + 'Use this when you need to do work that takes time (research, code analysis, file operations) ' + 'without blocking the conversation. The task runs server-side and survives browser close. ' + 'Examples: "Analyze this codebase", "Research competitors", "Generate a report". ' + 'IMPORTANT: This is how Claw AI does real work autonomously.',
        parameters: {
            type: 'object',
            properties: {
                task: {
                    type: 'string',
                    description: 'Description of what the task should accomplish. Be specific and detailed.'
                },
                label: {
                    type: 'string',
                    description: 'Short label for the task (shown in UI, e.g., "Code Analysis", "Research")'
                },
                timeoutSeconds: {
                    type: 'number',
                    description: 'Maximum time for the task to run in seconds (default: 300, max: 600)'
                },
                announceResult: {
                    type: 'boolean',
                    description: 'Whether to announce the result back in chat when done (default: true)'
                },
                priority: {
                    type: 'string',
                    description: 'Task priority for queue ordering',
                    enum: [
                        'low',
                        'normal',
                        'high'
                    ]
                },
                context: {
                    type: 'object',
                    description: 'Optional context to pass to the task (projectId, ticketId, sandboxId, etc.)'
                }
            },
            required: [
                'task'
            ]
        }
    },
    {
        name: 'list_background_tasks',
        description: 'List active and recent background tasks. Use this to check on spawned tasks, ' + 'see their progress, or review completed work.',
        parameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    description: 'Filter by task status',
                    enum: [
                        'queued',
                        'running',
                        'succeeded',
                        'failed',
                        'cancelled',
                        'all'
                    ]
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of tasks to return (default: 10)'
                }
            },
            required: []
        }
    },
    {
        name: 'cancel_background_task',
        description: 'Cancel a running or queued background task. Use this when the user wants to ' + 'stop a task that is taking too long or is no longer needed.',
        parameters: {
            type: 'object',
            properties: {
                jobId: {
                    type: 'string',
                    description: 'The job ID of the task to cancel'
                }
            },
            required: [
                'jobId'
            ]
        }
    },
    {
        name: 'get_task_result',
        description: 'Get the result of a completed background task. Use this to retrieve the output ' + 'of a task that has finished running.',
        parameters: {
            type: 'object',
            properties: {
                jobId: {
                    type: 'string',
                    description: 'The job ID of the task to get results for'
                }
            },
            required: [
                'jobId'
            ]
        }
    },
    {
        name: 'iterate_on_code',
        description: 'Start an autonomous code iteration session. Claw AI will analyze code, make changes, ' + 'run tests, and iterate until the goal is achieved or max iterations reached. ' + 'Perfect for refactoring, bug fixes, or implementing features with clear test criteria. ' + 'Requires an active sandbox with cloned repository.',
        parameters: {
            type: 'object',
            properties: {
                goal: {
                    type: 'string',
                    description: 'What the iteration should achieve (e.g., "Fix all TypeScript errors", "Add unit tests for auth module")'
                },
                sandboxId: {
                    type: 'string',
                    description: 'The sandbox ID with the cloned repository'
                },
                maxIterations: {
                    type: 'number',
                    description: 'Maximum number of analyze-modify-test cycles (default: 5, max: 10)'
                },
                stopOnSuccess: {
                    type: 'boolean',
                    description: 'Whether to stop when tests pass (default: true)'
                },
                commitChanges: {
                    type: 'boolean',
                    description: 'Whether to commit successful changes (default: false)'
                },
                testCommand: {
                    type: 'string',
                    description: 'Command to run for testing (e.g., "npm test", "pnpm typecheck")'
                }
            },
            required: [
                'goal',
                'sandboxId'
            ]
        }
    },
    {
        name: 'delegate_to_specialist',
        description: 'Delegate a task to a specialist agent with deep expertise in a specific area. ' + 'Specialists run as background tasks and announce findings when complete. ' + 'Use for security audits, code reviews, performance analysis, etc.',
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
                        'refactoring-expert'
                    ]
                },
                task: {
                    type: 'string',
                    description: 'What the specialist should analyze or accomplish'
                },
                context: {
                    type: 'object',
                    description: 'Optional context (sandboxId, filePaths, repository info, etc.)'
                },
                announceResult: {
                    type: 'boolean',
                    description: 'Whether to announce findings in chat (default: true)'
                }
            },
            required: [
                'specialist',
                'task'
            ]
        }
    },
    // =============================================================================
    // AI Provider Tools (Local LLM / Cloud Settings)
    // =============================================================================
    {
        name: 'get_ai_provider_status',
        description: 'Check the current AI provider configuration and connection status. Shows whether ' + 'local (Ollama) or cloud (OpenAI) inference is being used, available models, and ' + 'latency information. Use when user asks "what model are you using", "are you running locally", ' + '"check AI status", or wants to know about the current AI setup.',
        parameters: {
            type: 'object',
            properties: {
                includeLatency: {
                    type: 'boolean',
                    description: 'Whether to include latency measurements (may add delay)'
                }
            },
            required: []
        },
        ownerOnly: true
    },
    {
        name: 'navigate_to_ai_settings',
        description: 'Open the AI provider settings page (/settings/ai) where the user can switch between ' + 'local and cloud inference, configure Ollama, and view connection status. Use when user ' + 'says "AI settings", "configure local model", "switch to local", "switch to cloud".',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        },
        ownerOnly: true
    },
    // =============================================================================
    // Kanban Task Reading Tools - Read and understand tasks
    // =============================================================================
    {
        name: 'get_kanban_task',
        description: 'Get details of a specific Kanban task by its ID. Use this when a user references a task ' + 'like "exp-001" or "p1-3" to understand what the task is about before taking action.',
        parameters: {
            type: 'object',
            properties: {
                taskId: {
                    type: 'string',
                    description: 'The task ID (e.g., "exp-001", "p1-1", "backlog-2")'
                }
            },
            required: [
                'taskId'
            ]
        }
    },
    {
        name: 'search_kanban_tasks',
        description: 'Search Kanban tasks by keyword. Use this to find tasks related to a topic, ' + 'or to see what tasks exist in the board.',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search term to find in task titles, descriptions, or tags'
                },
                status: {
                    type: 'string',
                    description: 'Optional: filter by status',
                    enum: [
                        'backlog',
                        'todo',
                        'in-progress',
                        'review',
                        'done'
                    ]
                }
            },
            required: [
                'query'
            ]
        }
    },
    // =============================================================================
    // Design Canvas Tools - Infinite canvas for visual composition
    // =============================================================================
    {
        name: 'create_canvas',
        description: 'Create a new design canvas for visual exploration, moodboards, mind maps, or flowcharts. ' + 'Use this when users want to create visual diagrams, plan architecture, or compose layouts. ' + 'The canvas supports multiple node types including shapes, sticky notes, images, and text.',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name for the canvas (e.g., "Claw AI Architecture", "Project Moodboard")'
                },
                canvasType: {
                    type: 'string',
                    description: 'Type of canvas layout',
                    enum: [
                        'freeform',
                        'wireframe',
                        'moodboard',
                        'storyboard',
                        'mindmap',
                        'flowchart'
                    ]
                },
                description: {
                    type: 'string',
                    description: 'Optional description of what this canvas is for'
                },
                backgroundColor: {
                    type: 'string',
                    description: 'Background color (hex, e.g., "#1a1a2e" for dark, "#ffffff" for white)'
                },
                gridEnabled: {
                    type: 'boolean',
                    description: 'Whether to show grid lines (default: true)'
                }
            },
            required: [
                'name',
                'canvasType'
            ]
        }
    },
    {
        name: 'list_canvases',
        description: 'List all design canvases. Use this to find existing canvases or see what visual ' + 'workspaces have been created.',
        parameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    description: 'Filter by canvas status',
                    enum: [
                        'active',
                        'archived',
                        'template'
                    ]
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of canvases to return (default: 20)'
                }
            },
            required: []
        }
    },
    {
        name: 'get_canvas',
        description: 'Get details of a specific canvas including its nodes and edges. Use this to view ' + 'what elements are on a canvas before adding more.',
        parameters: {
            type: 'object',
            properties: {
                canvasId: {
                    type: 'string',
                    description: 'The ID of the canvas to retrieve'
                }
            },
            required: [
                'canvasId'
            ]
        }
    },
    {
        name: 'add_canvas_node',
        description: 'Add a node (element) to a canvas. Nodes can be shapes, sticky notes, text, images, ' + 'code blocks, or other visual elements. Position is specified in x,y coordinates. ' + 'Use this to build visual representations, diagrams, or compositions.',
        parameters: {
            type: 'object',
            properties: {
                canvasId: {
                    type: 'string',
                    description: 'The ID of the canvas to add the node to'
                },
                nodeType: {
                    type: 'string',
                    description: 'Type of node to create',
                    enum: [
                        'text',
                        'image',
                        'shape',
                        'sticky',
                        'frame',
                        'code',
                        'embed',
                        'audio',
                        'video',
                        'link'
                    ]
                },
                x: {
                    type: 'number',
                    description: 'X position on canvas (0 is left edge)'
                },
                y: {
                    type: 'number',
                    description: 'Y position on canvas (0 is top edge)'
                },
                width: {
                    type: 'number',
                    description: 'Width of the node in pixels (default: varies by type)'
                },
                height: {
                    type: 'number',
                    description: 'Height of the node in pixels (default: varies by type)'
                },
                content: {
                    type: 'string',
                    description: 'Content for the node. For text/sticky: the text content. For image: URL. For shape: shape type (rectangle, circle, diamond, hexagon, star, arrow, cloud). For code: the code snippet.'
                },
                style: {
                    type: 'string',
                    description: 'JSON string of style properties: { "backgroundColor": "#hex", "borderColor": "#hex", "textColor": "#hex", "fontSize": 14, "fontWeight": "bold" }'
                }
            },
            required: [
                'canvasId',
                'nodeType',
                'x',
                'y',
                'content'
            ]
        }
    },
    {
        name: 'add_canvas_edge',
        description: 'Add an edge (connection/arrow) between two nodes on a canvas. Use this to show ' + 'relationships, data flow, or connections between elements. Edges can be straight ' + 'lines, curved lines, step connectors, or arrows.',
        parameters: {
            type: 'object',
            properties: {
                canvasId: {
                    type: 'string',
                    description: 'The ID of the canvas'
                },
                sourceNodeId: {
                    type: 'string',
                    description: 'ID of the source node (where the edge starts)'
                },
                targetNodeId: {
                    type: 'string',
                    description: 'ID of the target node (where the edge ends)'
                },
                edgeType: {
                    type: 'string',
                    description: 'Type of edge/connection',
                    enum: [
                        'straight',
                        'curved',
                        'step',
                        'arrow'
                    ]
                },
                label: {
                    type: 'string',
                    description: 'Optional label to display on the edge'
                },
                style: {
                    type: 'string',
                    description: 'JSON string of style properties: { "strokeColor": "#hex", "strokeWidth": 2, "dashed": false }'
                }
            },
            required: [
                'canvasId',
                'sourceNodeId',
                'targetNodeId',
                'edgeType'
            ]
        }
    },
    {
        name: 'update_canvas_node',
        description: 'Update an existing node on a canvas. Use this to change position, size, content, ' + 'or styling of an element.',
        parameters: {
            type: 'object',
            properties: {
                canvasId: {
                    type: 'string',
                    description: 'The ID of the canvas'
                },
                nodeId: {
                    type: 'string',
                    description: 'The ID of the node to update'
                },
                x: {
                    type: 'number',
                    description: 'New X position'
                },
                y: {
                    type: 'number',
                    description: 'New Y position'
                },
                width: {
                    type: 'number',
                    description: 'New width'
                },
                height: {
                    type: 'number',
                    description: 'New height'
                },
                content: {
                    type: 'string',
                    description: 'New content'
                },
                style: {
                    type: 'string',
                    description: 'New style JSON'
                }
            },
            required: [
                'canvasId',
                'nodeId'
            ]
        }
    },
    // =============================================================================
    // Apple Health Data Tools
    // =============================================================================
    {
        name: 'get_health_summary',
        description: 'Get a summary of health data for a specific date or today. Returns steps, heart rate, ' + 'sleep, activity scores, and other health metrics synced from Apple Health. ' + 'Use this when the user asks about their health, fitness, sleep, or activity data.',
        ownerOnly: true,
        parameters: {
            type: 'object',
            properties: {
                date: {
                    type: 'string',
                    description: 'The date to get health summary for in YYYY-MM-DD format. Defaults to today if not provided.'
                }
            },
            required: []
        }
    },
    {
        name: 'get_health_trends',
        description: 'Get health trends and weekly averages over time. Shows how steps, sleep, heart rate, ' + 'and activity scores have changed over recent weeks. Use this when the user asks about ' + 'their health trends, progress, or how their metrics have changed over time.',
        ownerOnly: true,
        parameters: {
            type: 'object',
            properties: {
                weeks: {
                    type: 'number',
                    description: 'Number of weeks to analyze. Defaults to 4 weeks.'
                }
            },
            required: []
        }
    },
    {
        name: 'get_health_metric',
        description: 'Get detailed data for a specific health metric over a date range. Returns raw samples ' + 'for metrics like steps, heart rate, sleep, workouts, etc. Use this when the user wants ' + 'to see detailed data for a specific metric.',
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
                        'standHours'
                    ]
                },
                startDate: {
                    type: 'string',
                    description: 'Start date in YYYY-MM-DD format. Defaults to 7 days ago.'
                },
                endDate: {
                    type: 'string',
                    description: 'End date in YYYY-MM-DD format. Defaults to today.'
                }
            },
            required: [
                'metric'
            ]
        }
    },
    {
        name: 'compare_health_periods',
        description: 'Compare health metrics between two time periods. Useful for seeing improvement or ' + 'changes between this week vs last week, this month vs last month, etc.',
        ownerOnly: true,
        parameters: {
            type: 'object',
            properties: {
                period1Start: {
                    type: 'string',
                    description: 'Start date of first period (YYYY-MM-DD)'
                },
                period1End: {
                    type: 'string',
                    description: 'End date of first period (YYYY-MM-DD)'
                },
                period2Start: {
                    type: 'string',
                    description: 'Start date of second period (YYYY-MM-DD)'
                },
                period2End: {
                    type: 'string',
                    description: 'End date of second period (YYYY-MM-DD)'
                },
                metrics: {
                    type: 'array',
                    description: 'Which metrics to compare',
                    items: {
                        type: 'string'
                    }
                }
            },
            required: [
                'period1Start',
                'period1End',
                'period2Start',
                'period2End'
            ]
        }
    },
    {
        name: 'generate_health_api_key',
        description: 'Generate a new API key for syncing Apple Health data from an iOS Shortcut. ' + 'The key is shown only once and must be saved immediately. Use this when the user ' + 'wants to set up health data syncing from their iPhone.',
        ownerOnly: true,
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'A friendly name for this API key (e.g., "iPhone 15 Pro", "iPad")'
                },
                expiresInDays: {
                    type: 'number',
                    description: 'Number of days until the key expires. Leave empty for no expiration.'
                }
            },
            required: [
                'name'
            ]
        }
    },
    {
        name: 'list_health_api_keys',
        description: 'List all API keys for Apple Health syncing. Shows key names, last used dates, ' + 'and whether they are active or expired. Use this when the user wants to manage ' + 'their health sync API keys.',
        ownerOnly: true,
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'revoke_health_api_key',
        description: 'Revoke an API key to stop it from being used for health data syncing. ' + 'Use this when the user wants to disable a specific API key.',
        ownerOnly: true,
        parameters: {
            type: 'object',
            properties: {
                keyId: {
                    type: 'string',
                    description: 'The ID of the API key to revoke'
                }
            },
            required: [
                'keyId'
            ]
        }
    },
    {
        name: 'get_health_sync_status',
        description: 'Get the status of recent health data syncs. Shows when data was last synced, ' + 'how many samples were received, and any errors. Use this when the user asks ' + 'about their health sync status or if syncing is working.',
        ownerOnly: true,
        parameters: {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Number of recent syncs to show. Defaults to 5.'
                }
            },
            required: []
        }
    },
    // =============================================================================
    // ERV Ontology Tools - AI-Assisted Entity Classification & Relationship Suggestion
    // Inspired by data governance patterns for automatic ontology population
    // =============================================================================
    {
        name: 'analyze_and_create_entity',
        description: 'Analyze content (URL, text, or data) and automatically classify it into the appropriate ERV entity type. ' + 'AI determines the best entity type, extracts relevant attributes, suggests tags, and creates the entity. ' + 'Use this when the user pastes content, shares a URL, or describes something that should be stored. ' + 'Examples: "save this article", "remember this person I met", "add this project idea".',
        parameters: {
            type: 'object',
            properties: {
                content: {
                    type: 'string',
                    description: 'The content to analyze. Can be: raw text, a URL, JSON data, or a description of something to remember.'
                },
                contentType: {
                    type: 'string',
                    description: 'Hint about the content type to help classification',
                    enum: [
                        'url',
                        'text',
                        'json',
                        'description',
                        'auto'
                    ]
                },
                suggestedType: {
                    type: 'string',
                    description: 'Optional: Suggest an entity type if the user indicates preference (e.g., "save as a person")',
                    enum: [
                        'Person',
                        'Project',
                        'Track',
                        'Draft',
                        'Sketch',
                        'Ticket',
                        'Epic',
                        'Event',
                        'Memory',
                        'Value',
                        'Collection',
                        'Skill',
                        'Reminder'
                    ]
                },
                additionalContext: {
                    type: 'string',
                    description: 'Optional: Additional context from the user about what this content is (e.g., "this is my coworker from the AI team")'
                }
            },
            required: [
                'content'
            ]
        },
        ownerOnly: true
    },
    {
        name: 'suggest_entity_relationships',
        description: 'Analyze an entity and suggest relationships to other existing entities in the ERV system. ' + 'Uses semantic similarity and content analysis to find connections the user might not have made explicitly. ' + 'Returns suggested relationships with confidence scores and reasoning. ' + 'Use when: user creates a new entity, asks "what is this related to?", or when building knowledge graphs.',
        parameters: {
            type: 'object',
            properties: {
                entityId: {
                    type: 'string',
                    description: 'The entity ID to find relationships for'
                },
                relationshipTypes: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Optional: Filter to specific relationship types (collaboratedOn, createdBy, mentions, relatedTo, etc.)'
                },
                maxSuggestions: {
                    type: 'number',
                    description: 'Maximum number of relationship suggestions to return (default: 10)'
                },
                minConfidence: {
                    type: 'number',
                    description: 'Minimum confidence threshold 0-1 for suggestions (default: 0.5)'
                },
                autoCreate: {
                    type: 'boolean',
                    description: 'If true, automatically create relationships above the confidence threshold (default: false)'
                }
            },
            required: [
                'entityId'
            ]
        },
        ownerOnly: true
    },
    {
        name: 'bulk_classify_entities',
        description: 'Import and classify multiple items at once into ERV entities. Takes an array of content items ' + 'and automatically determines entity types, extracts attributes, and creates entities in bulk. ' + 'Useful for importing contacts, bookmarks, notes, or any list of items. ' + 'Also suggests relationships between the imported entities and existing data.',
        parameters: {
            type: 'object',
            properties: {
                items: {
                    type: 'array',
                    description: 'Array of items to classify. Each item should have at minimum a "content" field.',
                    items: {
                        type: 'object',
                        properties: {
                            content: {
                                type: 'string'
                            },
                            hint: {
                                type: 'string'
                            }
                        }
                    }
                },
                sourceFormat: {
                    type: 'string',
                    description: 'Format hint for the data source',
                    enum: [
                        'csv',
                        'json',
                        'text_list',
                        'urls',
                        'contacts',
                        'bookmarks',
                        'notes',
                        'auto'
                    ]
                },
                defaultType: {
                    type: 'string',
                    description: 'Default entity type if classification is uncertain',
                    enum: [
                        'Person',
                        'Project',
                        'Track',
                        'Draft',
                        'Sketch',
                        'Ticket',
                        'Epic',
                        'Event',
                        'Memory',
                        'Value',
                        'Collection',
                        'Skill',
                        'Reminder'
                    ]
                },
                commonTags: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Tags to apply to all imported entities (e.g., ["import-2026-02", "contacts"])'
                },
                dryRun: {
                    type: 'boolean',
                    description: 'If true, return classification results without creating entities (default: false)'
                }
            },
            required: [
                'items'
            ]
        },
        ownerOnly: true
    },
    // ============================================================================
    // Music Generation Tools (ACE-Step via Lynkr)
    // ============================================================================
    {
        name: 'cowrite_music',
        description: 'ALWAYS use this tool FIRST when the user wants to create music. This tool helps craft the perfect music generation request ' + 'through a conversational back-and-forth. It guides users to develop their musical vision step by step: ' + '1) Genre/style direction, 2) Mood and energy, 3) Instrumentation, 4) Lyrics (if vocal), 5) Structure, ' + '6) Reference track (optional), 7) Technical specs (BPM, key, duration). ' + 'Returns a draft payload that can be refined before final generation. ' + 'Use this instead of jumping straight to generate_music - it produces much better results.',
        parameters: {
            type: 'object',
            properties: {
                step: {
                    type: 'string',
                    enum: [
                        'start',
                        'refine_style',
                        'add_lyrics',
                        'set_structure',
                        'add_reference',
                        'finalize',
                        'generate'
                    ],
                    description: 'Which step of the cowriting process: ' + 'start = begin new session, gather initial idea; ' + 'refine_style = enhance style description with genre, instruments, mood; ' + 'add_lyrics = help write or structure lyrics; ' + 'set_structure = define song structure with tags; ' + 'add_reference = incorporate reference audio for style matching; ' + 'finalize = review and confirm all parameters; ' + 'generate = user confirmed, proceed to generation'
                },
                userInput: {
                    type: 'string',
                    description: 'The user\'s input or response for this step of the cowriting process.'
                },
                currentDraft: {
                    type: 'string',
                    description: 'JSON string of the current draft payload being built up. Pass this between steps to maintain state. ' + 'Parse with JSON.parse(). Expected shape: { prompt?: string, lyrics?: string, duration?: number, ' + 'bpm?: number, key?: string, timeSignature?: string, title?: string, referenceAudioUrl?: string, ' + 'referenceStrength?: number }'
                }
            },
            required: [
                'step',
                'userInput'
            ]
        },
        ownerOnly: true
    },
    {
        name: 'generate_music',
        description: 'Generate original music using AI (ACE-Step). Creates audio from a style description and optional lyrics. ' + 'Can generate 10 seconds to 10 minutes of music with control over BPM, key, and time signature. ' + 'Supports 50+ languages for lyrics. Use structure tags like [Verse], [Chorus], [Bridge] for song structure. ' + 'Supports reference audio for style transfer - provide a URL to match the vibe of an existing track. ' + 'NOTE: For best results, use cowrite_music first to help the user craft their request.',
        parameters: {
            type: 'object',
            properties: {
                prompt: {
                    type: 'string',
                    description: 'Musical style description. Be specific about genre, instruments, mood, and production style. ' + 'Example: "upbeat indie folk with acoustic guitar, soft female vocals, warm production"'
                },
                lyrics: {
                    type: 'string',
                    description: 'Optional lyrics with structure tags. Use [Verse], [Chorus], [Bridge], [Intro], [Outro] for structure. ' + 'Example: "[Verse]\\nWalking down the street\\n[Chorus]\\nThis is where I want to be"'
                },
                duration: {
                    type: 'number',
                    description: 'Duration in seconds (10-600). Default is 30 seconds. Use 180-300 for full songs.'
                },
                bpm: {
                    type: 'number',
                    description: 'Beats per minute (60-200). Leave empty for auto-detection from prompt.'
                },
                key: {
                    type: 'string',
                    description: 'Musical key like "C major", "A minor", "F# major". Leave empty for auto-detection.'
                },
                timeSignature: {
                    type: 'string',
                    description: 'Time signature like "4/4", "3/4", "6/8". Default is "4/4".'
                },
                referenceAudioUrl: {
                    type: 'string',
                    description: 'URL to a reference audio file for style transfer. The generated music will match the vibe, ' + 'energy, and production style of this reference. Supports MP3, WAV, FLAC.'
                },
                referenceStrength: {
                    type: 'number',
                    description: 'How strongly to match the reference audio style (0.0-1.0). Default is 0.5. ' + 'Higher values = closer to reference style, lower = more creative freedom.'
                },
                title: {
                    type: 'string',
                    description: 'Title for the generated track.'
                },
                saveToJamz: {
                    type: 'boolean',
                    description: 'If true, automatically add the generated track to Jamz Studio.'
                },
                projectId: {
                    type: 'string',
                    description: 'Jamz project ID to add the track to (if saveToJamz is true).'
                }
            },
            required: [
                'prompt'
            ]
        },
        ownerOnly: true
    },
    {
        name: 'analyze_audio',
        description: 'Analyze audio to extract musical properties like BPM, key, time signature, and generate AI descriptions. ' + 'Can also extract lyrics with timestamps from vocal tracks. Useful for understanding existing music ' + 'before creating variations or matching styles.',
        parameters: {
            type: 'object',
            properties: {
                audioUrl: {
                    type: 'string',
                    description: 'URL of the audio file to analyze.'
                },
                extract: {
                    type: 'array',
                    description: 'What to extract from the audio.',
                    items: {
                        type: 'string'
                    }
                }
            },
            required: [
                'audioUrl'
            ]
        },
        ownerOnly: true
    },
    {
        name: 'separate_stems',
        description: 'Separate audio into individual stems (vocals, drums, bass, other, piano, guitar). ' + 'Useful for remixing, isolating vocals for analysis, or creating karaoke versions. ' + 'Returns URLs to each separated stem audio file.',
        parameters: {
            type: 'object',
            properties: {
                audioUrl: {
                    type: 'string',
                    description: 'URL of the audio file to separate.'
                },
                stems: {
                    type: 'array',
                    description: 'Which stems to extract. Default is ["vocals", "drums", "bass", "other"].',
                    items: {
                        type: 'string'
                    }
                }
            },
            required: [
                'audioUrl'
            ]
        },
        ownerOnly: true
    }
];
function getOpenAITools() {
    return CLAW_AI_TOOLS.map((tool)=>({
            type: 'function',
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters
            }
        }));
}
function toOpenAITools(tools) {
    return tools.map((tool)=>({
            type: 'function',
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters
            }
        }));
}
function parseToolCalls(toolCalls) {
    return toolCalls.map((tc)=>({
            name: tc.function.name,
            arguments: JSON.parse(tc.function.arguments)
        }));
}
}),
"[project]/src/components/icons.tsx [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Icons",
    ()=>Icons
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__GlobeIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/globe.js [app-route] (ecmascript) <export default as GlobeIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__MailIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/mail.js [app-route] (ecmascript) <export default as MailIcon>");
;
;
const Icons = {
    globe: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__GlobeIcon$3e$__["GlobeIcon"], {
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/icons.tsx",
            lineNumber: 6,
            columnNumber: 32
        }, ("TURBOPACK compile-time value", void 0)),
    email: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__MailIcon$3e$__["MailIcon"], {
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/icons.tsx",
            lineNumber: 7,
            columnNumber: 32
        }, ("TURBOPACK compile-time value", void 0)),
    linkedin: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg",
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: "LinkedIn"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 10,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    fill: "currentColor",
                    d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 11,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/icons.tsx",
            lineNumber: 9,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    x: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg",
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: "X"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 19,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    fill: "currentColor",
                    d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 20,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/icons.tsx",
            lineNumber: 18,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    youtube: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "32px",
            height: "32px",
            viewBox: "0 0 32 32",
            fill: "currentColor",
            xmlns: "http://www.w3.org/2000/svg",
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: "youtube"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 35,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M29.41,9.26a3.5,3.5,0,0,0-2.47-2.47C24.76,6.2,16,6.2,16,6.2s-8.76,0-10.94.59A3.5,3.5,0,0,0,2.59,9.26,36.13,36.13,0,0,0,2,16a36.13,36.13,0,0,0,.59,6.74,3.5,3.5,0,0,0,2.47,2.47C7.24,25.8,16,25.8,16,25.8s8.76,0,10.94-.59a3.5,3.5,0,0,0,2.47-2.47A36.13,36.13,0,0,0,30,16,36.13,36.13,0,0,0,29.41,9.26ZM13.2,20.2V11.8L20.47,16Z"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 36,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/icons.tsx",
            lineNumber: 27,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    nextjs: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            role: "img",
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg",
            className: "size-8",
            fill: "currentColor",
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: "Next.js"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 48,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.096-.0633c.8518-.5536 1.7525-1.3418 2.4657-2.1627 1.5179-1.7429 2.4963-3.868 2.8247-6.134.0961-.6591.1078-.854.1078-1.7475 0-.8937-.012-1.0884-.1078-1.7476-.6522-4.506-3.8592-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.42-2.4985-.5232-.169-.0176-1.0835-.0366-1.6123-.037zm4.0685 7.217c.3473 0 .4082.0053.4857.047.1127.0562.204.1642.237.2767.0186.061.0234 1.3653.0186 4.3044l-.0067 4.2175-.7436-1.14-.7461-1.14v-3.066c0-1.982.0093-3.0963.0234-3.1502.0375-.1313.1196-.2346.2323-.2955.0961-.0494.1313-.054.4997-.054z"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 49,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/icons.tsx",
            lineNumber: 40,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    framermotion: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            role: "img",
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg",
            className: "size-8",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: "Framer Motion"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 65,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    stroke: "none",
                    d: "M0 0h24v24H0z",
                    fill: "none"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 66,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 12l-8 -8v16l16 -16v16l-4 -4"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 67,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M20 12l-8 8l-4 -4"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 68,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/icons.tsx",
            lineNumber: 53,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    tailwindcss: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            role: "img",
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg",
            className: "size-8",
            fill: "currentColor",
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: "Tailwind CSS"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 80,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "m12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624-1.176-1.194-2.537-2.576-5.512-2.576zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624-1.176-1.194-2.537-2.576-5.512-2.576z"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 81,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/icons.tsx",
            lineNumber: 72,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    typescript: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 32 32",
            xmlns: "http://www.w3.org/2000/svg",
            className: "size-8",
            fill: "currentColor",
            ...props,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m0 16v16h32v-32h-32zm25.786-1.276c.813.203 1.432.568 2.005 1.156.292.312.729.885.766 1.026.01.042-1.38.974-2.224 1.495-.031.021-.156-.109-.292-.313-.411-.599-.844-.859-1.505-.906-.969-.063-1.594.443-1.589 1.292-.005.208.042.417.135.599.214.443.615.708 1.854 1.245 2.292.984 3.271 1.635 3.88 2.557.682 1.031.833 2.677.375 3.906-.51 1.328-1.771 2.234-3.542 2.531-.547.099-1.849.083-2.438-.026-1.286-.229-2.505-.865-3.255-1.698-.297-.323-.87-1.172-.833-1.229.016-.021.146-.104.292-.188s.682-.396 1.188-.688l.922-.536.193.286c.271.411.859.974 1.214 1.161 1.021.542 2.422.464 3.115-.156.281-.234.438-.594.417-.958 0-.37-.047-.536-.24-.813-.25-.354-.755-.656-2.198-1.281-1.651-.714-2.365-1.151-3.01-1.854-.406-.464-.708-1.01-.88-1.599-.12-.453-.151-1.589-.057-2.042.339-1.599 1.547-2.708 3.281-3.036.563-.109 1.875-.068 2.427.068zm-7.51 1.339.01 1.307h-4.167v11.839h-2.948v-11.839h-4.161v-1.281c0-.714.016-1.307.036-1.323.016-.021 2.547-.031 5.62-.026l5.594.016z"
            }, void 0, false, {
                fileName: "[project]/src/components/icons.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/icons.tsx",
            lineNumber: 85,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    react: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            role: "img",
            viewBox: "0 0 32 32",
            xmlns: "http://www.w3.org/2000/svg",
            className: "size-8",
            fill: "currentColor",
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: "React"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 104,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "m16 13.146c-1.573 0-2.854 1.281-2.854 2.854s1.281 2.854 2.854 2.854 2.854-1.281 2.854-2.854-1.281-2.854-2.854-2.854zm-7.99 8.526-.63-.156c-4.688-1.188-7.38-3.198-7.38-5.521s2.693-4.333 7.38-5.521l.63-.156.177.625c.474 1.635 1.083 3.229 1.818 4.771l.135.281-.135.286c-.734 1.536-1.344 3.13-1.818 4.771zm-.921-9.74c-3.563 1-5.75 2.536-5.75 4.063s2.188 3.057 5.75 4.063c.438-1.391.964-2.745 1.578-4.063-.615-1.318-1.141-2.672-1.578-4.063zm16.901 9.74-.177-.625c-.474-1.635-1.083-3.229-1.818-4.766l-.135-.286.135-.286c.734-1.536 1.344-3.13 1.818-4.771l.177-.62.63.156c4.688 1.188 7.38 3.198 7.38 5.521s-2.693 4.333-7.38 5.521zm-.657-5.677c.641 1.385 1.172 2.745 1.578 4.063 3.568-1.005 5.75-2.536 5.75-4.063s-2.188-3.057-5.75-4.063c-.438 1.385-.964 2.745-1.578 4.063zm-16.255-4.068-.177-.625c-1.318-4.646-.917-7.979 1.099-9.141 1.979-1.141 5.151.208 8.479 3.625l.453.464-.453.464c-1.182 1.229-2.26 2.552-3.229 3.958l-.182.255-.313.026c-1.703.135-3.391.406-5.047.813zm2.531-8.838c-.359 0-.677.073-.943.229-1.323.766-1.557 3.422-.646 7.005 1.422-.318 2.859-.542 4.313-.672.833-1.188 1.75-2.323 2.734-3.391-2.078-2.026-4.047-3.172-5.458-3.172zm12.787 27.145c-.005 0-.005 0 0 0-1.901 0-4.344-1.427-6.875-4.031l-.453-.464.453-.464c1.182-1.229 2.26-2.552 3.229-3.958l.177-.255.313-.031c1.703-.13 3.391-.401 5.052-.813l.63-.156.177.625c1.318 4.646.917 7.974-1.099 9.135-.49.281-1.042.422-1.604.411zm-5.464-4.505c2.078 2.026 4.047 3.172 5.458 3.172h.005c.354 0 .672-.078.938-.229 1.323-.766 1.563-3.422.646-7.005-1.422.318-2.865.542-4.313.667-.833 1.193-1.75 2.323-2.734 3.396zm7.99-13.802-.63-.161c-1.661-.406-3.349-.677-5.052-.813l-.313-.026-.177-.255c-.969-1.406-2.047-2.729-3.229-3.958l-.453-.464.453-.464c3.328-3.417 6.5-4.766 8.479-3.625 2.016 1.161 2.417 4.495 1.099 9.141zm-5.255-2.276c1.521.141 2.969.365 4.313.672.917-3.583.677-6.24-.646-7.005-1.318-.76-3.797.406-6.401 2.943.984 1.073 1.896 2.203 2.734 3.391zm-10.058 20.583c-.563.01-1.12-.13-1.609-.411-2.016-1.161-2.417-4.49-1.099-9.135l.177-.625.63.156c1.542.391 3.24.661 5.047.813l.313.031.177.255c.969 1.406 2.047 2.729 3.229 3.958l.453.464-.453.464c-2.526 2.604-4.969 4.031-6.865 4.031zm-1.588-8.567c-.917 3.583-.677 6.24.646 7.005 1.318.75 3.792-.406 6.401-2.943-.984-1.073-1.901-2.203-2.734-3.396-1.453-.125-2.891-.349-4.313-.667zm7.979.838c-1.099 0-2.224-.047-3.354-.141l-.313-.026-.182-.26c-.635-.917-1.24-1.859-1.797-2.828-.563-.969-1.078-1.958-1.557-2.969l-.135-.286.135-.286c.479-1.01.995-2 1.557-2.969.552-.953 1.156-1.906 1.797-2.828l.182-.26.313-.026c2.234-.188 4.479-.188 6.708 0l.313.026.182.26c1.276 1.833 2.401 3.776 3.354 5.797l.135.286-.135.286c-.953 2.021-2.073 3.964-3.354 5.797l-.182.26-.313.026c-1.125.094-2.255.141-3.354.141zm-2.927-1.448c1.969.151 3.885.151 5.859 0 1.099-1.609 2.078-3.302 2.927-5.063-.844-1.76-1.823-3.453-2.932-5.063-1.948-.151-3.906-.151-5.854 0-1.109 1.609-2.089 3.302-2.932 5.063.849 1.76 1.828 3.453 2.932 5.063z"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 105,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/icons.tsx",
            lineNumber: 96,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    github: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 438.549 438.549",
            ...props,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "currentColor",
                d: "M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
            }, void 0, false, {
                fileName: "[project]/src/components/icons.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/icons.tsx",
            lineNumber: 109,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    notion: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "100",
            height: "100",
            viewBox: "0 0 100 100",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z",
                    fill: "#fff"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 125,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z",
                    fill: "#000"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 129,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/icons.tsx",
            lineNumber: 117,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    openai: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            role: "img",
            viewBox: "0 0 24 24",
            ...props,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
            }, void 0, false, {
                fileName: "[project]/src/components/icons.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/icons.tsx",
            lineNumber: 138,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    googleDrive: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 87.3 78",
            xmlns: "http://www.w3.org/2000/svg",
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z",
                    fill: "#0066da"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 144,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z",
                    fill: "#00ac47"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 148,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z",
                    fill: "#ea4335"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 152,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z",
                    fill: "#00832d"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 156,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z",
                    fill: "#2684fc"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 160,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z",
                    fill: "#ffba00"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 164,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/icons.tsx",
            lineNumber: 143,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    whatsapp: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 175.216 175.552",
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                            id: "b",
                            x1: "85.915",
                            x2: "86.535",
                            y1: "32.567",
                            y2: "137.092",
                            gradientUnits: "userSpaceOnUse",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "0",
                                    stopColor: "#57d163"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/icons.tsx",
                                    lineNumber: 185,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "1",
                                    stopColor: "#23b33a"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/icons.tsx",
                                    lineNumber: 186,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/icons.tsx",
                            lineNumber: 177,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                            id: "a",
                            width: "1.115",
                            height: "1.114",
                            x: "-.057",
                            y: "-.057",
                            colorInterpolationFilters: "sRGB",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                stdDeviation: "3.531"
                            }, void 0, false, {
                                fileName: "[project]/src/components/icons.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/icons.tsx",
                            lineNumber: 188,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 176,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    fill: "#b3b3b3",
                    d: "m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0",
                    filter: "url(#a)"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 199,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    fill: "#fff",
                    d: "m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 204,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    fill: "url(#linearGradient1780)",
                    d: "M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 208,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    fill: "url(#b)",
                    d: "M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 212,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    fill: "#fff",
                    fillRule: "evenodd",
                    d: "M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
                }, void 0, false, {
                    fileName: "[project]/src/components/icons.tsx",
                    lineNumber: 216,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/icons.tsx",
            lineNumber: 171,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
};
}),
"[project]/src/data/resume.tsx [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DATA",
    ()=>DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/icons.tsx [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/house.js [app-route] (ecmascript) <export default as HomeIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/palette.js [app-route] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/music.js [app-route] (ecmascript) <export default as Music>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2d$ruler$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__PencilRuler$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/pencil-ruler.js [app-route] (ecmascript) <export default as PencilRuler>");
;
;
;
const DATA = {
    name: "OpenClaw-OS",
    initials: "OC",
    url: "https://openclaw.io/",
    location: "Dublin, Ireland",
    locationLink: "https://www.google.com/maps/place/dublin+ireland",
    description: "An AI-native operating system designed for high-performance productivity, agentic orchestration, and seamless human-AI collaboration.",
    summary: `OpenClaw-OS is a next-generation operating environment built for the AI age. It bridges design, engineering, and product strategy into a single, cohesive experience.

**AI-Native Architecture** - Designed from the ground up to support multi-agent collaboration, context management, and intelligent automation.

**High-Craft UI/UX** - A professional, iOS-style interface with 50+ beautiful themes, liquid animations, and glassmorphic aesthetics.

**Agentic Control Plane** - Use the integrated AI assistant to orchestrate complex workflows, manage projects, and build functional prototypes directly through conversation.`,
    avatarUrl: "/openclaw-logo.png",
    skills: [
        "Agentic AI Orchestration",
        "Product-Led Development",
        "AI Context Management",
        "Multi-Agent Systems",
        "React & Next.js",
        "TailwindCSS",
        "Cloud-native Systems",
        "System Thinking",
        "UI/UX Design Systems"
    ],
    navbar: [
        {
            href: "/",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__["HomeIcon"],
            label: "Home"
        },
        {
            href: "/canvas",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2d$ruler$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__PencilRuler$3e$__["PencilRuler"],
            label: "Canvas"
        },
        {
            href: "/design",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"],
            label: "Design"
        },
        {
            href: "/music",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__["Music"],
            label: "Music"
        }
    ],
    contact: {
        email: "hello@openclaw.io",
        tel: "",
        website: "https://openclaw.io/",
        social: {
            GitHub: {
                name: "GitHub",
                url: "https://github.com/openclaw",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Icons"].github,
                navbar: false
            },
            LinkedIn: {
                name: "LinkedIn",
                url: "https://linkedin.com/company/openclaw",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Icons"].linkedin,
                navbar: false
            },
            X: {
                name: "X",
                url: "https://x.com/openclaw",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Icons"].x,
                navbar: false
            },
            website: {
                name: "Website",
                url: "https://openclaw.io/",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Icons"].globe,
                navbar: false
            },
            email: {
                name: "Send Email",
                url: "#",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Icons"].email,
                navbar: false
            }
        }
    },
    work: [
        {
            company: "OpenClaw Development",
            href: "",
            badges: [
                "Active"
            ],
            location: "Remote",
            title: "Core System Development",
            logoUrl: "/openclaw-logo.png",
            start: "2024",
            end: "Present",
            description: "Leading the development of the OpenClaw-OS ecosystem, focusing on AI-native interaction models and design-led system architecture."
        },
        {
            company: "The Creative Engine",
            href: "",
            badges: [],
            location: "Worldwide",
            title: "Product Innovation Lab",
            logoUrl: "🎨",
            start: "2019",
            end: "2024",
            description: "Research and development into the future of human-computer interaction and AI-amplified creativity."
        }
    ],
    education: [
        {
            school: "OpenClaw OS Institute",
            href: "",
            degree: "Systems Architecture",
            logoUrl: "",
            start: "2020",
            end: "2024"
        }
    ],
    projects: [
        {
            title: "OpenClaw-OS",
            href: "https://openclaw.io",
            dates: "2025",
            active: true,
            description: "The core operating system featuring 50+ themes, AI-native workflows, and an integrated assistant.",
            technologies: [
                "Next.js 16",
                "React 19",
                "Claude API",
                "TailwindCSS"
            ],
            links: [
                {
                    type: "Website",
                    href: "https://openclaw.io",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Icons"].globe, {
                        className: "size-3"
                    }, void 0, false, {
                        fileName: "[project]/src/data/resume.tsx",
                        lineNumber: 116,
                        columnNumber: 69
                    }, ("TURBOPACK compile-time value", void 0))
                }
            ],
            image: "",
            video: ""
        }
    ],
    hackathons: []
};
}),
"[project]/src/lib/themes/definitions.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getThemeLabel",
    ()=>getThemeLabel,
    "isValidTheme",
    ()=>isValidTheme,
    "themes",
    ()=>themes
]);
const themes = [
    {
        name: 'utilitarian',
        label: 'Utilitarian'
    },
    {
        name: 'base',
        label: 'Default'
    },
    {
        name: 'claude',
        label: 'Claude'
    },
    {
        name: 'chatgpt',
        label: 'ChatGPT'
    },
    {
        name: 'vercel',
        label: 'Vercel'
    },
    {
        name: 'kodama-grove',
        label: 'Kodama Grove'
    },
    {
        name: 'vintage-paper',
        label: 'Vintage Paper'
    },
    {
        name: 'claymorphism',
        label: 'Claymorphism'
    },
    {
        name: 'nature',
        label: 'Nature'
    },
    {
        name: 'neo-brutalism',
        label: 'Neo Brutalism'
    },
    {
        name: 'elegant-luxury',
        label: 'Elegant Luxury'
    },
    {
        name: 'pastel-dreams',
        label: 'Pastel Dreams'
    },
    {
        name: 'cosmic-night',
        label: 'Cosmic Night'
    },
    {
        name: 'clean-slate',
        label: 'Clean Slate'
    },
    {
        name: 'caffeine',
        label: 'Caffeine'
    },
    {
        name: 'ocean-breeze',
        label: 'Ocean Breeze'
    },
    {
        name: 'perpetuity',
        label: 'Perpetuity'
    },
    {
        name: 'midnight-bloom',
        label: 'Midnight Bloom'
    },
    {
        name: 'northern-lights',
        label: 'Northern Lights'
    },
    {
        name: 'sunset-horizon',
        label: 'Sunset Horizon'
    },
    {
        name: 'modern-minimal',
        label: 'Modern Minimal'
    },
    {
        name: 'candyland',
        label: 'Candyland'
    },
    {
        name: 'cyberpunk',
        label: 'Cyberpunk'
    },
    {
        name: 'retro-arcade',
        label: 'Retro Arcade'
    },
    {
        name: 'quantum-rose',
        label: 'Quantum Rose'
    },
    {
        name: 'bold-tech',
        label: 'Bold Tech'
    },
    {
        name: 'violet-bloom',
        label: 'Violet Bloom'
    },
    {
        name: 't3-chat',
        label: 'T3 Chat'
    },
    {
        name: 'mocha-mousse',
        label: 'Mocha Mousse'
    },
    {
        name: 'amethyst-haze',
        label: 'Amethyst Haze'
    },
    {
        name: 'doom-64',
        label: 'Doom 64'
    },
    {
        name: 'amber-minimal',
        label: 'Amber Minimal'
    },
    {
        name: 'solar-dusk',
        label: 'Solar Dusk'
    },
    {
        name: 'starry-night',
        label: 'Starry Night'
    },
    {
        name: 'soft-pop',
        label: 'Soft Pop'
    },
    {
        name: 'sage-garden',
        label: 'Sage Garden'
    },
    {
        name: 'notebook',
        label: 'Notebook'
    },
    {
        name: 'tao',
        label: 'Tao'
    },
    {
        name: 'research',
        label: 'Research'
    },
    {
        name: 'field-guide',
        label: 'Field Guide'
    },
    {
        name: 'denim',
        label: 'Denim'
    },
    {
        name: 'google',
        label: 'Google'
    },
    {
        name: 'apple',
        label: 'Apple'
    },
    {
        name: 'microsoft',
        label: 'Microsoft'
    },
    {
        name: 'notion',
        label: 'Notion'
    },
    {
        name: 'cursor',
        label: 'Cursor'
    },
    {
        name: 'miro',
        label: 'Miro'
    },
    {
        name: 'nike',
        label: 'Nike'
    },
    {
        name: 'adidas',
        label: 'Adidas'
    },
    {
        name: 'kinetic-editorial',
        label: 'Kinetic Editorial'
    },
    {
        name: 'teenage-engineering',
        label: 'Teenage Engineering'
    }
];
function isValidTheme(theme) {
    return themes.some((t)=>t.name === theme);
}
function getThemeLabel(name) {
    return themes.find((t)=>t.name === name)?.label ?? name;
}
}),
"[project]/src/lib/claw-ai/search.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatSearchResults",
    ()=>formatSearchResults,
    "getAllThemes",
    ()=>getAllThemes,
    "searchPortfolio",
    ()=>searchPortfolio
]);
/**
 * Claw AI Search - Portfolio content search
 *
 * MVP implementation using keyword-based search.
 * Future: Add vector embeddings with Convex for semantic search.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$resume$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/resume.tsx [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$definitions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/themes/definitions.ts [app-route] (ecmascript)");
;
;
// Normalize text for search
function normalize(text) {
    return text.toLowerCase().trim();
}
// Calculate relevance score based on keyword matches
function calculateRelevance(text, query) {
    const normalizedText = normalize(text);
    const normalizedQuery = normalize(query);
    const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
    let score = 0;
    // Exact match gets highest score
    if (normalizedText.includes(normalizedQuery)) {
        score += 10;
    }
    // Word-by-word matching
    for (const word of queryWords){
        if (word.length < 2) continue;
        // Exact word match
        if (normalizedText.includes(word)) {
            score += 3;
        }
        // Partial match (for technologies like "react" in "reactjs")
        const words = normalizedText.split(/\s+/);
        for (const textWord of words){
            if (textWord.startsWith(word) || word.startsWith(textWord)) {
                score += 1;
            }
        }
    }
    return score;
}
// Search projects
function searchProjects(query) {
    const results = [];
    for (const project of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$resume$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DATA"].projects){
        const searchText = [
            project.title,
            project.description,
            ...project.technologies
        ].join(' ');
        const relevance = calculateRelevance(searchText, query);
        if (relevance > 0) {
            results.push({
                id: `project-${project.title.toLowerCase().replace(/\s+/g, '-')}`,
                type: 'project',
                title: project.title,
                description: project.description,
                url: project.href,
                relevance,
                metadata: {
                    technologies: project.technologies,
                    dates: project.dates,
                    active: project.active
                }
            });
        }
    }
    return results;
}
// Search skills
function searchSkills(query) {
    const results = [];
    const normalizedQuery = normalize(query);
    for (const skill of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$resume$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DATA"].skills){
        const relevance = calculateRelevance(skill, query);
        // Also check for partial matches on skills
        if (relevance > 0 || normalize(skill).includes(normalizedQuery)) {
            results.push({
                id: `skill-${skill.toLowerCase().replace(/\s+/g, '-')}`,
                type: 'skill',
                title: skill,
                description: `James has expertise in ${skill}`,
                relevance: relevance > 0 ? relevance : 2
            });
        }
    }
    return results;
}
// Search work experience
function searchWork(query) {
    const results = [];
    for (const job of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$resume$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DATA"].work){
        const searchText = [
            job.company,
            job.title,
            job.description,
            job.location
        ].join(' ');
        const relevance = calculateRelevance(searchText, query);
        if (relevance > 0) {
            results.push({
                id: `work-${job.company.toLowerCase().replace(/\s+/g, '-')}`,
                type: 'work',
                title: `${job.title} at ${job.company}`,
                description: job.description,
                url: job.href || undefined,
                relevance,
                metadata: {
                    company: job.company,
                    title: job.title,
                    location: job.location,
                    start: job.start,
                    end: job.end
                }
            });
        }
    }
    return results;
}
// Search education
function searchEducation(query) {
    const results = [];
    for (const edu of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$resume$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DATA"].education){
        const searchText = [
            edu.school,
            edu.degree
        ].join(' ');
        const relevance = calculateRelevance(searchText, query);
        if (relevance > 0) {
            results.push({
                id: `edu-${edu.school.toLowerCase().replace(/\s+/g, '-')}`,
                type: 'education',
                title: edu.degree,
                description: `${edu.degree} from ${edu.school}`,
                relevance,
                metadata: {
                    school: edu.school,
                    start: edu.start,
                    end: edu.end
                }
            });
        }
    }
    return results;
}
// Search themes
function searchThemes(query) {
    const results = [];
    for (const theme of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$definitions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["themes"]){
        const relevance = calculateRelevance(`${theme.name} ${theme.label}`, query);
        if (relevance > 0) {
            results.push({
                id: `theme-${theme.name}`,
                type: 'theme',
                title: theme.label,
                description: `The ${theme.label} theme for the portfolio`,
                url: `/design?theme=${theme.name}`,
                relevance,
                metadata: {
                    themeName: theme.name
                }
            });
        }
    }
    return results;
}
// Search about/profile information
function searchAbout(query) {
    const results = [];
    const aboutText = [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$resume$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DATA"].name,
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$resume$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DATA"].description,
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$resume$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DATA"].summary,
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$resume$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DATA"].location
    ].join(' ');
    const relevance = calculateRelevance(aboutText, query);
    if (relevance > 0) {
        results.push({
            id: 'about-james',
            type: 'about',
            title: 'About OpenClaw-OS',
            description: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$resume$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DATA"].description,
            url: '/story',
            relevance,
            metadata: {
                location: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$resume$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DATA"].location,
                email: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$resume$2e$tsx__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DATA"].contact.email
            }
        });
    }
    return results;
}
function searchPortfolio(query, options = {}) {
    const { category = 'all', limit = 10 } = options;
    let results = [];
    // Search across categories
    if (category === 'all' || category === 'projects') {
        results = results.concat(searchProjects(query));
    }
    if (category === 'all' || category === 'skills') {
        results = results.concat(searchSkills(query));
    }
    if (category === 'all' || category === 'work') {
        results = results.concat(searchWork(query));
    }
    if (category === 'all' || category === 'education') {
        results = results.concat(searchEducation(query));
    }
    if (category === 'all' || category === 'themes') {
        results = results.concat(searchThemes(query));
    }
    if (category === 'all') {
        results = results.concat(searchAbout(query));
    }
    // Sort by relevance and limit
    results.sort((a, b)=>b.relevance - a.relevance);
    return results.slice(0, limit);
}
function getAllThemes(category) {
    // For MVP, we don't have category metadata on themes
    // Just return all themes
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$definitions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["themes"].map((theme)=>({
            id: `theme-${theme.name}`,
            type: 'theme',
            title: theme.label,
            description: `The ${theme.label} design theme`,
            url: `/design?theme=${theme.name}`,
            relevance: 1,
            metadata: {
                themeName: theme.name
            }
        }));
}
function formatSearchResults(results) {
    if (results.length === 0) {
        return 'No results found for that search.';
    }
    const grouped = {};
    for (const result of results){
        if (!grouped[result.type]) {
            grouped[result.type] = [];
        }
        grouped[result.type].push(result);
    }
    const sections = [];
    if (grouped.project) {
        sections.push(`**Projects:**\n${grouped.project.map((r)=>`- ${r.title}: ${r.description.slice(0, 150)}...${r.metadata?.technologies ? ` (Technologies: ${r.metadata.technologies.slice(0, 5).join(', ')})` : ''}`).join('\n')}`);
    }
    if (grouped.skill) {
        sections.push(`**Skills:**\n${grouped.skill.map((r)=>`- ${r.title}`).join('\n')}`);
    }
    if (grouped.work) {
        sections.push(`**Work Experience:**\n${grouped.work.map((r)=>`- ${r.title} (${r.metadata?.start || ''} - ${r.metadata?.end || 'Present'})`).join('\n')}`);
    }
    if (grouped.education) {
        sections.push(`**Education:**\n${grouped.education.map((r)=>`- ${r.title}`).join('\n')}`);
    }
    if (grouped.theme) {
        sections.push(`**Themes:**\n${grouped.theme.map((r)=>`- ${r.title}`).join('\n')}`);
    }
    if (grouped.about) {
        sections.push(`**About:**\n${grouped.about.map((r)=>r.description).join('\n')}`);
    }
    return sections.join('\n\n');
}
}),
"[project]/src/lib/convex-shim.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConvexHttpClient",
    ()=>ConvexHttpClient,
    "api",
    ()=>api
]);
class ConvexHttpClient {
    constructor(url){}
    query(query, args) {
        return Promise.resolve(null);
    }
    mutation(mutation, args) {
        return Promise.resolve(null);
    }
}
const api = {
    jobs: {
        getAgentJobs: 'jobs:getAgentJobs',
        cancelJob: 'jobs:cancelJob',
        getJob: 'jobs:getJob',
        queueCodeIteration: 'jobs:queueCodeIteration',
        queueSpecialistDelegation: 'jobs:queueSpecialistDelegation',
        queueAgentTask: 'jobs:queueAgentTask',
        updateJobStatusPublic: 'jobs:updateJobStatusPublic',
        logJobEventPublic: 'jobs:logJobEventPublic'
    },
    aiSettings: {
        getSettings: 'aiSettings:getSettings'
    },
    erv: {
        createEntity: 'erv:createEntity',
        createRelationship: 'erv:createRelationship',
        createDimension: 'erv:createDimension',
        listDimensions: 'erv:listDimensions',
        searchEntities: 'erv:searchEntities',
        getEntity: 'erv:getEntity'
    },
    jamz: {
        createProject: 'jamz:createProject',
        createTrack: 'jamz:createTrack',
        createClip: 'jamz:createClip'
    },
    messages: {
        send: 'messages:send'
    },
    whatsappContacts: {
        list: 'whatsappContacts:list',
        getContactByPhone: 'whatsappContacts:getContactByPhone',
        listContacts: 'whatsappContacts:listContacts',
        upsertContact: 'whatsappContacts:upsertContact'
    },
    channels: {
        list: 'channels:list',
        getChannel: 'channels:getChannel',
        sendMessage: 'channels:sendMessage',
        getUserMessages: 'channels:getUserMessages',
        getUserIntegrations: 'channels:getUserIntegrations',
        getConversations: 'channels:getConversations',
        getIntegration: 'channels:getIntegration',
        logOutboundMessage: 'channels:logOutboundMessage',
        searchMessages: 'channels:searchMessages'
    },
    scheduling: {
        list: 'scheduling:list',
        createEvent: 'scheduling:createEvent',
        getEventTypes: 'scheduling:getEventTypes',
        getAvailableSlots: 'scheduling:getAvailableSlots',
        createBooking: 'scheduling:createBooking',
        rescheduleBooking: 'scheduling:rescheduleBooking',
        updateBookingStatus: 'scheduling:updateBookingStatus'
    },
    userCronJobs: {
        list: 'userCronJobs:list',
        create: 'userCronJobs:create',
        delete: 'userCronJobs:delete',
        createJob: 'userCronJobs:createJob',
        getUserJobs: 'userCronJobs:getUserJobs',
        toggleJob: 'userCronJobs:toggleJob',
        deleteJob: 'userCronJobs:deleteJob'
    },
    compaction: {
        compact: 'compaction:compact',
        getLatestCompaction: 'compaction:getLatestCompaction'
    },
    kanban: {
        listLists: 'kanban:listLists',
        createCard: 'kanban:createCard',
        moveCard: 'kanban:moveCard',
        getTaskById: 'kanban:getTaskById',
        searchTasks: 'kanban:searchTasks',
        getTasks: 'kanban:getTasks',
        isSeeded: 'kanban:isSeeded',
        addTask: 'kanban:addTask',
        updateTask: 'kanban:updateTask',
        deleteTask: 'kanban:deleteTask',
        moveTask: 'kanban:moveTask',
        seedTasks: 'kanban:seedTasks'
    },
    designCanvas: {
        getCanvas: 'designCanvas:getCanvas',
        updateCanvas: 'designCanvas:updateCanvas',
        createItem: 'designCanvas:createItem',
        createCanvas: 'designCanvas:createCanvas',
        getUserCanvases: 'designCanvas:getUserCanvases',
        getCanvasNodes: 'designCanvas:getCanvasNodes',
        getCanvasEdges: 'designCanvas:getCanvasEdges',
        addNode: 'designCanvas:addNode',
        addEdge: 'designCanvas:addEdge',
        updateNode: 'designCanvas:updateNode'
    },
    agentic: {
        createProductProject: 'agentic:createProductProject',
        createPRD: 'agentic:createPRD',
        createEpic: 'agentic:createEpic',
        createTicket: 'agentic:createTicket'
    },
    discovery: {
        getSession: 'discovery:getSession',
        storeInsights: 'discovery:storeInsights',
        storeArtifacts: 'discovery:storeArtifacts',
        markNotificationSent: 'discovery:markNotificationSent',
        markError: 'discovery:markError',
        getSessionByCallerId: 'discovery:getSessionByCallerId',
        updateTranscript: 'discovery:updateTranscript'
    },
    memories: {
        searchEpisodic: 'memories:searchEpisodic',
        getSemanticByCategories: 'memories:getSemanticByCategories',
        getAllSemantic: 'memories:getAllSemantic',
        getRecentEpisodic: 'memories:getRecentEpisodic',
        storeEpisodic: 'memories:storeEpisodic',
        upsertSemantic: 'memories:upsertSemantic',
        deleteEpisodic: 'memories:deleteEpisodic',
        deleteSemantic: 'memories:deleteSemantic',
        getMemoryStats: 'memories:getMemoryStats'
    },
    observability: {
        getSecurityScans: 'observability:getSecurityScans',
        createSecurityScan: 'observability:createSecurityScan',
        getActivityStream: 'observability:getActivityStream',
        getDashboardOverview: 'observability:getDashboardOverview',
        getProviderHealthStatus: 'observability:getProviderHealthStatus',
        logOperation: 'observability:logOperation'
    },
    roadmap: {
        submitSuggestion: 'roadmap:submitSuggestion',
        getSuggestions: 'roadmap:getSuggestions',
        updateSuggestionStatus: 'roadmap:updateSuggestionStatus',
        voteSuggestion: 'roadmap:voteSuggestion'
    }
};
}),
"[project]/src/lib/memory/manager.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MemoryManager",
    ()=>MemoryManager,
    "getMemoryManager",
    ()=>getMemoryManager
]);
/**
 * MemoryManager
 *
 * Handles memory operations for the RLM (Recursive Memory Layer) system.
 * Provides methods to store, retrieve, and manage episodic, semantic,
 * and working memory for Claw AI interactions.
 *
 * @see docs/philosophy/README.md#self-learning-systems
 * @see docs/planning/recursive-memory-layer-scope.md
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/convex-shim.ts [app-route] (ecmascript)");
;
class MemoryManager {
    convex = null;
    constructor(convexUrl){
        const url = convexUrl || process.env.NEXT_PUBLIC_CONVEX_URL;
        if (url) {
            this.convex = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](url);
        }
    }
    getClient() {
        if (!this.convex) {
            const url = process.env.NEXT_PUBLIC_CONVEX_URL;
            if (!url) {
                throw new Error('NEXT_PUBLIC_CONVEX_URL not configured');
            }
            this.convex = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](url);
        }
        return this.convex;
    }
    /**
   * Get the API reference
   */ getApiRef(path) {
        // If api is available (from shim or require), try to use it
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"]) {
            const parts = path.split(".");
            let ref = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"];
            for (const part of parts){
                if (ref) {
                    ref = ref[part];
                }
            }
            if (ref) return ref;
        }
        // Fallback: return the path string
        return path;
    }
    // ==========================================================================
    // MEMORY LOADING
    // ==========================================================================
    /**
   * Load relevant memories for a user query.
   * Combines episodic (events) and semantic (facts) memories.
   */ async loadRelevantMemories(userId, query, options = {}) {
        const { limit = 10, includeEpisodic = true, includeSemantic = true, projectId } = options;
        // Parallel fetch of episodic and semantic memories
        const [episodic, semantic] = await Promise.all([
            includeEpisodic ? this.searchEpisodicMemories(userId, query, projectId, limit) : [],
            includeSemantic ? this.loadSemanticMemories(userId, this.extractCategories(query)) : []
        ]);
        // Build context summary for prompt injection
        const contextSummary = this.buildContextSummary(episodic, semantic);
        return {
            episodic,
            semantic,
            contextSummary
        };
    }
    /**
   * Search episodic memories using text matching.
   */ async searchEpisodicMemories(userId, query, projectId, limit = 10) {
        const results = await this.getClient().query(this.getApiRef("memories.searchEpisodic"), {
            userId,
            query,
            projectId,
            limit
        });
        return results;
    }
    /**
   * Load semantic memories by categories.
   */ async loadSemanticMemories(userId, categories) {
        const results = await this.getClient().query(this.getApiRef("memories.getSemanticByCategories"), {
            userId,
            categories
        });
        return results;
    }
    /**
   * Get all semantic memories for a user.
   */ async getAllSemanticMemories(userId) {
        const results = await this.getClient().query(this.getApiRef("memories.getAllSemantic"), {
            userId
        });
        return results;
    }
    /**
   * Get recent episodic memories.
   */ async getRecentMemories(userId, projectId, limit = 10) {
        const results = await this.getClient().query(this.getApiRef("memories.getRecentEpisodic"), {
            userId,
            projectId,
            limit
        });
        return results;
    }
    // ==========================================================================
    // MEMORY STORAGE
    // ==========================================================================
    /**
   * Store an episodic memory.
   */ async storeEpisodicMemory(userId, content, memoryType, importance, projectId, metadata) {
        return await this.getClient().mutation(this.getApiRef("memories.storeEpisodic"), {
            userId,
            projectId,
            content,
            memoryType,
            importance,
            metadata
        });
    }
    /**
   * Store or update a semantic memory.
   */ async upsertSemanticMemory(userId, category, key, value, confidence, source) {
        return await this.getClient().mutation(this.getApiRef("memories.upsertSemantic"), {
            userId,
            category,
            key,
            value,
            confidence,
            source
        });
    }
    // ==========================================================================
    // INTERACTION PROCESSING
    // ==========================================================================
    /**
   * Process an interaction and extract/store relevant memories.
   */ async processInteraction(userId, interaction, projectId) {
        const importance = this.calculateImportance(interaction);
        // Only store significant interactions (importance > 0.3)
        if (importance > 0.3) {
            const memoryType = this.classifyInteraction(interaction);
            const content = this.summarizeInteraction(interaction);
            await this.storeEpisodicMemory(userId, content, memoryType, importance, projectId, {
                toolsUsed: interaction.toolsUsed
            });
        }
        // Extract and store patterns/preferences
        const patterns = this.extractPatterns(interaction);
        for (const pattern of patterns){
            await this.upsertSemanticMemory(userId, pattern.category, pattern.key, pattern.value, pattern.confidence, "interaction_learning");
        }
    }
    // ==========================================================================
    // HELPER METHODS
    // ==========================================================================
    /**
   * Extract relevant categories from a query for semantic memory lookup.
   */ extractCategories(query) {
        const categories = [];
        const lowerQuery = query.toLowerCase();
        if (/prefer|like|style|theme|mode|favorite/.test(lowerQuery)) {
            categories.push("preference");
        }
        if (/skill|know|experience|proficient|expert|can you/.test(lowerQuery)) {
            categories.push("skill");
        }
        if (/pattern|usually|always|tend to|typically/.test(lowerQuery)) {
            categories.push("pattern");
        }
        if (/fact|is|are|does|what|who|where/.test(lowerQuery)) {
            categories.push("fact");
        }
        // Default to common categories if none detected
        return categories.length > 0 ? categories : [
            "preference",
            "skill",
            "pattern"
        ];
    }
    /**
   * Build a context summary for prompt injection.
   */ buildContextSummary(episodic, semantic) {
        const parts = [];
        // Add semantic memories (facts/preferences) - highest confidence first
        if (semantic.length > 0) {
            const semanticSummary = semantic.sort((a, b)=>b.confidence - a.confidence).slice(0, 5).map((m)=>`- ${m.category}: ${m.value}`).join("\n");
            parts.push(`User Context:\n${semanticSummary}`);
        }
        // Add recent relevant episodic memories - highest importance first
        if (episodic.length > 0) {
            const episodicSummary = episodic.sort((a, b)=>b.importance - a.importance).slice(0, 3).map((m)=>`- [${m.memoryType}] ${m.content}`).join("\n");
            parts.push(`Recent History:\n${episodicSummary}`);
        }
        return parts.join("\n\n");
    }
    /**
   * Calculate importance score for an interaction.
   */ calculateImportance(interaction) {
        let score = 0.3; // Base importance
        // Positive feedback signals
        if (/thanks|perfect|great|exactly|awesome|excellent/i.test(interaction.userMessage)) {
            score += 0.2;
        }
        // Multiple tools indicate complex interaction
        if (interaction.toolsUsed.length > 2) {
            score += 0.15;
        }
        // Decision-making language
        if (/decide|choose|prefer|want|let's|go with/i.test(interaction.userMessage)) {
            score += 0.2;
        }
        // Creation operations are important
        if (interaction.toolsUsed.some((t)=>/create|update|delete/.test(t))) {
            score += 0.15;
        }
        return Math.min(score, 1);
    }
    /**
   * Classify an interaction into a memory type.
   */ classifyInteraction(interaction) {
        const msg = interaction.userMessage.toLowerCase();
        // Check for feedback
        if (/thanks|great|perfect|awesome|excellent|love it/.test(msg)) {
            return "feedback";
        }
        // Check for preferences
        if (/prefer|like|want|rather|always use|my favorite/.test(msg)) {
            return "preference";
        }
        // Check for decisions
        if (/decide|choose|let's go with|use this|pick/.test(msg)) {
            return "decision";
        }
        // Check for milestones based on tools
        if (interaction.toolsUsed.some((t)=>/create_project|create_prd|shard_prd|launch/.test(t))) {
            return "milestone";
        }
        return "interaction";
    }
    /**
   * Summarize an interaction for storage.
   */ summarizeInteraction(interaction) {
        // Truncate user message if too long
        const userPart = interaction.userMessage.length > 100 ? interaction.userMessage.slice(0, 100) + "..." : interaction.userMessage;
        if (interaction.toolsUsed.length > 0) {
            return `User: "${userPart}" → Tools: ${interaction.toolsUsed.join(", ")}`;
        }
        return `User: "${userPart}"`;
    }
    /**
   * Extract patterns/preferences from an interaction.
   */ extractPatterns(interaction) {
        const patterns = [];
        const msg = interaction.userMessage.toLowerCase();
        // Detect explicit preferences
        if (/i prefer|i like|i want|my favorite|i always use/.test(msg)) {
            patterns.push({
                category: "preference",
                key: `pref_${Date.now()}`,
                value: interaction.userMessage.slice(0, 200),
                confidence: 0.7
            });
        }
        // Detect skill mentions
        if (/i know|i can|experience with|proficient in|expert at/.test(msg)) {
            patterns.push({
                category: "skill",
                key: `skill_${Date.now()}`,
                value: interaction.userMessage.slice(0, 200),
                confidence: 0.6
            });
        }
        // Detect behavioral patterns
        if (/i usually|i always|i tend to|typically i/.test(msg)) {
            patterns.push({
                category: "pattern",
                key: `pattern_${Date.now()}`,
                value: interaction.userMessage.slice(0, 200),
                confidence: 0.5
            });
        }
        return patterns;
    }
    // ==========================================================================
    // MEMORY MANAGEMENT
    // ==========================================================================
    /**
   * Delete an episodic memory.
   */ async deleteEpisodicMemory(memoryId, userId) {
        await this.getClient().mutation(this.getApiRef("memories.deleteEpisodic"), {
            memoryId,
            userId
        });
    }
    /**
   * Delete a semantic memory.
   */ async deleteSemanticMemory(memoryId, userId) {
        await this.getClient().mutation(this.getApiRef("memories.deleteSemantic"), {
            memoryId,
            userId
        });
    }
    /**
   * Get memory statistics for a user.
   */ async getStats(userId) {
        return await this.getClient().query(this.getApiRef("memories.getMemoryStats"), {
            userId
        });
    }
}
// Export singleton instance for convenience
let memoryManagerInstance = null;
function getMemoryManager() {
    if (!memoryManagerInstance) {
        memoryManagerInstance = new MemoryManager();
    }
    return memoryManagerInstance;
}
}),
"[project]/src/lib/memory/types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Memory Layer Types
 *
 * Type definitions for the RLM (Recursive Memory Layer) system.
 * @see docs/planning/recursive-memory-layer-scope.md
 */ // import { Id } from "../../../convex/_generated/dataModel";
__turbopack_context__.s([]);
;
}),
"[project]/src/lib/memory/ai-ingestion.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * AI-Powered Memory Ingestion
 *
 * Uses OpenAI (GPT-4o) to intelligently parse unstructured data and extract
 * structured memories (both episodic and semantic).
 *
 * @see docs/planning/recursive-memory-layer-scope.md
 */ __turbopack_context__.s([
    "extractMemoriesWithAI",
    ()=>extractMemoriesWithAI,
    "processLargeContent",
    ()=>processLargeContent
]);
/**
 * System prompt for memory extraction
 */ const EXTRACTION_SYSTEM_PROMPT = `You are a memory extraction AI for a personal knowledge system. Your job is to analyze text and extract two types of memories:

## EPISODIC MEMORIES (Events/Interactions)
These are specific events, decisions, conversations, or milestones. Each should have:
- content: A clear, standalone summary of what happened (50-200 chars)
- memoryType: One of "interaction", "decision", "preference", "feedback", "milestone"
- importance: 0.0-1.0 (higher = more significant)

Memory type guidelines:
- "interaction": General conversations or exchanges
- "decision": Choices made, directions taken, options selected
- "preference": Expressed likes, dislikes, preferences for how things should be
- "feedback": Reactions to work, opinions given, reviews
- "milestone": Achievements, completions, launches, significant events

## SEMANTIC MEMORIES (Facts/Knowledge)
These are learned facts, preferences, patterns, and skills. Each should have:
- category: One of "preference", "skill", "pattern", "fact"
- key: A unique snake_case identifier (e.g., "preferred_coding_language", "communication_style")
- value: The actual knowledge/fact (clear, specific)
- confidence: 0.0-1.0 (how certain is this information)

Category guidelines:
- "preference": Likes, dislikes, preferred ways of doing things
- "skill": Abilities, expertise, proficiency levels
- "pattern": Behavioral patterns, habits, tendencies
- "fact": Objective facts about the person (location, job, etc.)

## RULES
1. Extract MEANINGFUL memories only - skip trivial/obvious content
2. Be specific and actionable in your extractions
3. Deduplicate - don't extract the same fact multiple times
4. For semantic memories, use consistent key naming (snake_case, descriptive)
5. Higher importance/confidence for explicitly stated things vs inferred
6. Include context when it adds value

Respond with valid JSON only, no markdown formatting.`;
/**
 * Call OpenAI API directly
 */ async function callOpenAI(systemPrompt, userPrompt) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY not configured");
    }
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            max_tokens: 4096,
            response_format: {
                type: "json_object"
            },
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ]
        })
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
}
async function extractMemoriesWithAI(content, filename, options = {}) {
    const { maxEpisodic = 50, maxSemantic = 30 } = options;
    // Truncate very long content to avoid token limits
    const truncatedContent = content.length > 50000 ? content.slice(0, 50000) + "\n\n[Content truncated...]" : content;
    const userPrompt = `Analyze the following content from file "${filename}" and extract memories.

<content>
${truncatedContent}
</content>

Extract up to ${maxEpisodic} episodic memories and ${maxSemantic} semantic memories.

Respond with this exact JSON structure:
{
  "episodicMemories": [
    {
      "content": "string",
      "memoryType": "interaction|decision|preference|feedback|milestone",
      "importance": 0.0-1.0,
      "context": "optional string"
    }
  ],
  "semanticMemories": [
    {
      "category": "preference|skill|pattern|fact",
      "key": "snake_case_key",
      "value": "string",
      "confidence": 0.0-1.0,
      "source": "optional string"
    }
  ],
  "summary": "Brief summary of what was extracted",
  "processingNotes": ["Any notes about the extraction process"]
}`;
    try {
        const textContent = await callOpenAI(EXTRACTION_SYSTEM_PROMPT, userPrompt);
        if (!textContent) {
            throw new Error("No response from AI");
        }
        // Parse JSON response
        const result = JSON.parse(textContent);
        // Validate and sanitize the result
        return sanitizeIngestionResult(result, filename);
    } catch (error) {
        console.error("AI ingestion error:", error);
        // Return empty result on error
        return {
            episodicMemories: [],
            semanticMemories: [],
            summary: `Failed to process ${filename}`,
            processingNotes: [
                `Error: ${error instanceof Error ? error.message : "Unknown error"}`
            ]
        };
    }
}
/**
 * Validate and sanitize AI extraction results
 */ function sanitizeIngestionResult(result, filename) {
    const validEpisodicTypes = [
        "interaction",
        "decision",
        "preference",
        "feedback",
        "milestone"
    ];
    const validSemanticCategories = [
        "preference",
        "skill",
        "pattern",
        "fact"
    ];
    // Sanitize episodic memories
    const episodicMemories = (result.episodicMemories || []).filter((m)=>m && typeof m.content === "string" && m.content.length > 10).map((m)=>({
            content: m.content.slice(0, 500),
            memoryType: validEpisodicTypes.includes(m.memoryType) ? m.memoryType : "interaction",
            importance: Math.max(0, Math.min(1, Number(m.importance) || 0.5)),
            context: m.context ? String(m.context).slice(0, 200) : undefined
        }));
    // Sanitize semantic memories
    const semanticMemories = (result.semanticMemories || []).filter((m)=>m && typeof m.key === "string" && m.key.length > 0 && typeof m.value === "string" && m.value.length > 0).map((m)=>({
            category: validSemanticCategories.includes(m.category) ? m.category : "fact",
            key: m.key.toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 50),
            value: m.value.slice(0, 500),
            confidence: Math.max(0, Math.min(1, Number(m.confidence) || 0.5)),
            source: m.source ? String(m.source).slice(0, 100) : `Extracted from ${filename}`
        }));
    return {
        episodicMemories,
        semanticMemories,
        summary: result.summary || `Processed ${filename}`,
        processingNotes: Array.isArray(result.processingNotes) ? result.processingNotes.map((n)=>String(n)) : []
    };
}
async function processLargeContent(content, filename, chunkSize = 30000) {
    // If content is small enough, process directly
    if (content.length <= chunkSize) {
        return extractMemoriesWithAI(content, filename);
    }
    // Split into chunks at paragraph boundaries
    const chunks = [];
    let currentChunk = "";
    const paragraphs = content.split(/\n\n+/);
    for (const para of paragraphs){
        if (currentChunk.length + para.length > chunkSize) {
            if (currentChunk) {
                chunks.push(currentChunk);
            }
            currentChunk = para;
        } else {
            currentChunk += (currentChunk ? "\n\n" : "") + para;
        }
    }
    if (currentChunk) {
        chunks.push(currentChunk);
    }
    // Process each chunk
    const results = [];
    for(let i = 0; i < chunks.length; i++){
        const chunkFilename = `${filename} (part ${i + 1}/${chunks.length})`;
        const result = await extractMemoriesWithAI(chunks[i], chunkFilename);
        results.push(result);
    }
    // Merge results
    return mergeIngestionResults(results, filename);
}
/**
 * Merge multiple ingestion results
 */ function mergeIngestionResults(results, filename) {
    const allEpisodic = [];
    const allSemantic = [];
    const allNotes = [];
    for (const result of results){
        allEpisodic.push(...result.episodicMemories);
        allSemantic.push(...result.semanticMemories);
        allNotes.push(...result.processingNotes);
    }
    // Deduplicate semantic memories by key (keep highest confidence)
    const semanticByKey = new Map();
    for (const mem of allSemantic){
        const existing = semanticByKey.get(mem.key);
        if (!existing || mem.confidence > existing.confidence) {
            semanticByKey.set(mem.key, mem);
        }
    }
    return {
        episodicMemories: allEpisodic,
        semanticMemories: Array.from(semanticByKey.values()),
        summary: `Processed ${filename} in ${results.length} chunks`,
        processingNotes: allNotes
    };
}
}),
"[project]/src/lib/memory/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Memory Layer Module
 *
 * Recursive Memory Layer (RLM) for OpenClaw-OS self-learning capability.
 *
 * @see docs/philosophy/README.md#self-learning-systems
 * @see docs/planning/recursive-memory-layer-scope.md
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$memory$2f$manager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/memory/manager.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$memory$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/memory/types.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$memory$2f$ai$2d$ingestion$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/memory/ai-ingestion.ts [app-route] (ecmascript)");
;
;
;
}),
"[project]/src/lib/channels/outbound-router.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Outbound Message Router
 *
 * Unified system for sending messages across all connected platforms.
 * Routes messages to the correct platform-specific API based on integration.
 */ // =============================================================================
// Types
// =============================================================================
__turbopack_context__.s([
    "broadcastMessage",
    ()=>broadcastMessage,
    "sendMessage",
    ()=>sendMessage,
    "sendMessageWithIntegration",
    ()=>sendMessageWithIntegration
]);
// =============================================================================
// Platform Senders
// =============================================================================
/**
 * Send message via WhatsApp (Baileys bridge)
 */ async function sendWhatsApp(message, credentials) {
    const webhookUrl = credentials.baileysWebhookUrl || process.env.BAILEYS_WEBHOOK_URL;
    if (!webhookUrl) {
        return {
            success: false,
            error: "Baileys webhook URL not configured",
            timestamp: Date.now()
        };
    }
    try {
        // Format phone number for WhatsApp
        const remoteJid = message.recipientId.includes("@") ? message.recipientId : `${message.recipientId}@s.whatsapp.net`;
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "sendMessage",
                remoteJid,
                text: message.content,
                // Include media if present
                ...message.mediaUrl && {
                    mediaUrl: message.mediaUrl
                },
                ...message.replyToMessageId && {
                    quotedMessageId: message.replyToMessageId
                }
            })
        });
        if (!response.ok) {
            const error = await response.text();
            return {
                success: false,
                error,
                timestamp: Date.now()
            };
        }
        const data = await response.json();
        return {
            success: true,
            platformMessageId: data.messageId,
            timestamp: Date.now()
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "WhatsApp send failed",
            timestamp: Date.now()
        };
    }
}
/**
 * Send message via Telegram Bot API
 */ async function sendTelegram(message, credentials) {
    const botToken = credentials.botToken || process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
        return {
            success: false,
            error: "Telegram bot token not configured",
            timestamp: Date.now()
        };
    }
    try {
        const chatId = message.recipientId;
        // Send text message
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message.content,
                parse_mode: "Markdown",
                ...message.replyToMessageId && {
                    reply_to_message_id: parseInt(message.replyToMessageId)
                }
            })
        });
        if (!response.ok) {
            const error = await response.text();
            return {
                success: false,
                error,
                timestamp: Date.now()
            };
        }
        const data = await response.json();
        return {
            success: true,
            platformMessageId: String(data.result?.message_id),
            timestamp: Date.now()
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Telegram send failed",
            timestamp: Date.now()
        };
    }
}
/**
 * Send message via Slack Web API
 */ async function sendSlack(message, credentials) {
    const botToken = credentials.botToken || credentials.accessToken || process.env.SLACK_BOT_TOKEN;
    if (!botToken) {
        return {
            success: false,
            error: "Slack bot token not configured",
            timestamp: Date.now()
        };
    }
    try {
        const response = await fetch("https://slack.com/api/chat.postMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${botToken}`
            },
            body: JSON.stringify({
                channel: message.recipientId,
                text: message.content,
                mrkdwn: true,
                ...message.replyToMessageId && {
                    thread_ts: message.replyToMessageId
                }
            })
        });
        const data = await response.json();
        if (!data.ok) {
            return {
                success: false,
                error: data.error,
                timestamp: Date.now()
            };
        }
        return {
            success: true,
            platformMessageId: data.ts,
            timestamp: Date.now()
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Slack send failed",
            timestamp: Date.now()
        };
    }
}
/**
 * Send message via Discord REST API
 */ async function sendDiscord(message, credentials) {
    const botToken = credentials.botToken || process.env.DISCORD_BOT_TOKEN;
    if (!botToken) {
        return {
            success: false,
            error: "Discord bot token not configured",
            timestamp: Date.now()
        };
    }
    try {
        const body = {
            content: message.content
        };
        if (message.replyToMessageId) {
            body.message_reference = {
                message_id: message.replyToMessageId
            };
        }
        const response = await fetch(`https://discord.com/api/v10/channels/${message.recipientId}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bot ${botToken}`
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const error = await response.text();
            return {
                success: false,
                error,
                timestamp: Date.now()
            };
        }
        const data = await response.json();
        return {
            success: true,
            platformMessageId: data.id,
            timestamp: Date.now()
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Discord send failed",
            timestamp: Date.now()
        };
    }
}
/**
 * Send message via iMessage (BlueBubbles)
 */ async function sendIMessage(message, credentials) {
    const serverUrl = credentials.serverUrl || process.env.BLUEBUBBLES_SERVER_URL;
    const password = credentials.serverPassword || process.env.BLUEBUBBLES_PASSWORD;
    if (!serverUrl || !password) {
        return {
            success: false,
            error: "BlueBubbles server not configured",
            timestamp: Date.now()
        };
    }
    try {
        const response = await fetch(`${serverUrl}/api/v1/message/text`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${password}`
            },
            body: JSON.stringify({
                chatGuid: message.recipientId,
                message: message.content,
                method: "private-api"
            })
        });
        if (!response.ok) {
            const error = await response.text();
            return {
                success: false,
                error,
                timestamp: Date.now()
            };
        }
        const data = await response.json();
        return {
            success: true,
            platformMessageId: data.data?.guid,
            timestamp: Date.now()
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "iMessage send failed",
            timestamp: Date.now()
        };
    }
}
/**
 * Send message via Email (Resend)
 */ async function sendEmail(message, credentials) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return {
            success: false,
            error: "Resend API key not configured",
            timestamp: Date.now()
        };
    }
    const fromEmail = credentials.fromEmail || process.env.CLAW_AI_EMAIL || "ai@openclaw.io";
    try {
        // Dynamic import to avoid issues in non-Node environments
        const { Resend } = await __turbopack_context__.A("[project]/node_modules/.pnpm/resend@6.9.2/node_modules/resend/dist/index.mjs [app-route] (ecmascript, async loader)");
        const resend = new Resend(apiKey);
        const subject = message.emailSubject || "Message from Claw AI";
        const htmlContent = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
      ${message.content.split("\n").map((p)=>`<p style="margin: 0 0 1em 0;">${p}</p>`).join("")}
      <hr style="border: none; border-top: 1px solid #eee; margin: 2em 0;" />
      <p style="color: #666; font-size: 0.9em;">
        This message was sent by Claw AI, OpenClaw-OS's digital assistant.<br/>
        <a href="https://openclaw.io" style="color: #007AFF;">openclaw.io</a>
      </p>
    </div>`;
        const { data, error } = await resend.emails.send({
            from: `Claw AI <${fromEmail}>`,
            to: [
                message.recipientId
            ],
            subject,
            text: message.content,
            html: htmlContent,
            replyTo: credentials.replyTo,
            headers: message.emailThreadId ? {
                "In-Reply-To": message.emailThreadId
            } : undefined
        });
        if (error) {
            return {
                success: false,
                error: error.message,
                timestamp: Date.now()
            };
        }
        return {
            success: true,
            platformMessageId: data?.id,
            timestamp: Date.now()
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Email send failed",
            timestamp: Date.now()
        };
    }
}
async function sendMessage(message, credentials) {
    const creds = credentials || {};
    switch(message.platform){
        case "whatsapp":
            return sendWhatsApp(message, creds);
        case "telegram":
            return sendTelegram(message, creds);
        case "slack":
            return sendSlack(message, creds);
        case "discord":
            return sendDiscord(message, creds);
        case "imessage":
            return sendIMessage(message, creds);
        case "email":
            return sendEmail(message, creds);
        default:
            return {
                success: false,
                error: `Unsupported platform: ${message.platform}`,
                timestamp: Date.now()
            };
    }
}
async function sendMessageWithIntegration(convexClient, getIntegrationQuery, message) {
    try {
        // Look up the integration
        const integration = await convexClient.query(getIntegrationQuery, {
            integrationId: message.integrationId
        });
        if (!integration) {
            return {
                success: false,
                error: `Integration not found: ${message.integrationId}`,
                timestamp: Date.now()
            };
        }
        if (!integration.settings.enabled) {
            return {
                success: false,
                error: "Integration is disabled",
                timestamp: Date.now()
            };
        }
        // Send via the appropriate platform
        return sendMessage({
            ...message,
            platform: integration.platform
        }, integration.credentials);
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send message",
            timestamp: Date.now()
        };
    }
}
async function broadcastMessage(messages) {
    const results = new Map();
    // Send all messages in parallel
    const promises = messages.map(async (msg)=>{
        const result = await sendMessage(msg);
        results.set(msg.integrationId, result);
    });
    await Promise.allSettled(promises);
    return results;
}
}),
"[project]/src/lib/video/ltx-video.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LTX_PRESETS",
    ()=>LTX_PRESETS,
    "generateVideoFromImage",
    ()=>generateVideoFromImage,
    "generateVideoFromText",
    ()=>generateVideoFromText,
    "generateVideoWithPreset",
    ()=>generateVideoWithPreset,
    "getEstimatedDuration",
    ()=>getEstimatedDuration,
    "getFrameCountForDuration",
    ()=>getFrameCountForDuration,
    "isLTXConfigured",
    ()=>isLTXConfigured
]);
/**
 * LTX-2 Video Generation via Fal AI
 *
 * LTX-2 is Lightricks' 19B parameter DiT-based diffusion model for
 * synchronized audio-video generation.
 *
 * Capabilities:
 * - Text-to-Video (T2V)
 * - Image-to-Video (I2V)
 * - Video extension
 *
 * Model: fal-ai/ltx-video
 */ // LTX-2 API endpoints on Fal AI
const FAL_API_URL = 'https://queue.fal.run';
const LTX_TEXT_TO_VIDEO = 'fal-ai/ltx-video';
const LTX_IMAGE_TO_VIDEO = 'fal-ai/ltx-video/image-to-video';
const LTX_PRESETS = {
    landscape_short: {
        name: 'Landscape Short',
        width: 768,
        height: 512,
        num_frames: 97,
        description: '16:9 landscape, 4 seconds'
    },
    landscape_long: {
        name: 'Landscape Long',
        width: 768,
        height: 512,
        num_frames: 145,
        description: '16:9 landscape, 6 seconds'
    },
    portrait_short: {
        name: 'Portrait Short',
        width: 512,
        height: 768,
        num_frames: 97,
        description: '9:16 portrait (stories/reels), 4 seconds'
    },
    portrait_long: {
        name: 'Portrait Long',
        width: 512,
        height: 768,
        num_frames: 145,
        description: '9:16 portrait (stories/reels), 6 seconds'
    },
    square: {
        name: 'Square',
        width: 512,
        height: 512,
        num_frames: 97,
        description: '1:1 square, 4 seconds'
    },
    cinematic: {
        name: 'Cinematic',
        width: 832,
        height: 448,
        num_frames: 121,
        description: '2.39:1 cinematic widescreen, 5 seconds'
    }
};
async function submitToFalQueue(model, input, options) {
    const apiKey = process.env.FAL_KEY;
    if (!apiKey) {
        throw new Error('FAL_KEY not configured');
    }
    const maxAttempts = options?.maxAttempts ?? 180; // 15 minutes max
    const pollInterval = options?.pollInterval ?? 5000; // 5 seconds
    // Submit to queue
    const submitResponse = await fetch(`${FAL_API_URL}/${model}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Key ${apiKey}`
        },
        body: JSON.stringify(input)
    });
    if (!submitResponse.ok) {
        const error = await submitResponse.text();
        throw new Error(`LTX-2 submit error: ${error}`);
    }
    const queueData = await submitResponse.json();
    const statusUrl = `${FAL_API_URL}/${model}/requests/${queueData.request_id}/status`;
    const resultUrl = `${FAL_API_URL}/${model}/requests/${queueData.request_id}`;
    // Poll for completion
    let attempts = 0;
    while(attempts < maxAttempts){
        await new Promise((resolve)=>setTimeout(resolve, pollInterval));
        const statusResponse = await fetch(statusUrl, {
            headers: {
                Authorization: `Key ${apiKey}`
            }
        });
        if (!statusResponse.ok) {
            attempts++;
            continue;
        }
        const status = await statusResponse.json();
        options?.onProgress?.(status.status, status.logs);
        if (status.status === 'COMPLETED') {
            const resultResponse = await fetch(resultUrl, {
                headers: {
                    Authorization: `Key ${apiKey}`
                }
            });
            if (!resultResponse.ok) {
                throw new Error('Failed to fetch LTX-2 result');
            }
            return resultResponse.json();
        }
        if (status.status === 'FAILED') {
            throw new Error(`LTX-2 job failed: ${status.error || 'Unknown error'}`);
        }
        attempts++;
    }
    throw new Error('LTX-2 job timed out');
}
async function generateVideoFromText(request, options) {
    // Validate frame count (must be 8n+1)
    if (request.num_frames && (request.num_frames - 1) % 8 !== 0) {
        const corrected = Math.floor((request.num_frames - 1) / 8) * 8 + 1;
        console.warn(`LTX-2: Correcting num_frames from ${request.num_frames} to ${corrected} (must be 8n+1)`);
        request.num_frames = corrected;
    }
    // Validate dimensions (must be divisible by 32)
    if (request.width && request.width % 32 !== 0) {
        request.width = Math.floor(request.width / 32) * 32;
    }
    if (request.height && request.height % 32 !== 0) {
        request.height = Math.floor(request.height / 32) * 32;
    }
    return submitToFalQueue(LTX_TEXT_TO_VIDEO, {
        prompt: request.prompt,
        negative_prompt: request.negative_prompt || 'blurry, low quality, distorted, watermark',
        num_frames: request.num_frames || 97,
        width: request.width || 768,
        height: request.height || 512,
        seed: request.seed,
        num_inference_steps: request.num_inference_steps || 30,
        guidance_scale: request.guidance_scale || 7.5
    }, {
        onProgress: (status)=>options?.onProgress?.(status)
    });
}
async function generateVideoFromImage(request, options) {
    // Validate frame count (must be 8n+1)
    if (request.num_frames && (request.num_frames - 1) % 8 !== 0) {
        const corrected = Math.floor((request.num_frames - 1) / 8) * 8 + 1;
        request.num_frames = corrected;
    }
    return submitToFalQueue(LTX_IMAGE_TO_VIDEO, {
        prompt: request.prompt,
        image_url: request.image_url,
        negative_prompt: request.negative_prompt || 'blurry, low quality, distorted, watermark',
        num_frames: request.num_frames || 97,
        seed: request.seed,
        num_inference_steps: request.num_inference_steps || 30,
        guidance_scale: request.guidance_scale || 7.5
    }, {
        onProgress: (status)=>options?.onProgress?.(status)
    });
}
async function generateVideoWithPreset(prompt, presetName, options) {
    const preset = LTX_PRESETS[presetName];
    if (!preset) {
        throw new Error(`Unknown preset: ${presetName}`);
    }
    // If image_url provided, use I2V, otherwise T2V
    if (options?.image_url) {
        return generateVideoFromImage({
            prompt,
            image_url: options.image_url,
            negative_prompt: options.negative_prompt,
            num_frames: preset.num_frames,
            seed: options.seed
        }, {
            onProgress: options?.onProgress
        });
    }
    return generateVideoFromText({
        prompt,
        negative_prompt: options?.negative_prompt,
        width: preset.width,
        height: preset.height,
        num_frames: preset.num_frames,
        seed: options?.seed
    }, {
        onProgress: options?.onProgress
    });
}
function isLTXConfigured() {
    return !!process.env.FAL_KEY;
}
function getEstimatedDuration(numFrames) {
    return numFrames / 24;
}
function getFrameCountForDuration(targetSeconds) {
    const targetFrames = Math.round(targetSeconds * 24);
    // Round to nearest 8n+1
    return Math.floor((targetFrames - 1) / 8) * 8 + 1;
}
}),
"[project]/src/lib/claw-ai/tool-executor.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DESTRUCTIVE_ACTIONS",
    ()=>DESTRUCTIVE_ACTIONS,
    "FIRST_USE_APPROVAL_ACTIONS",
    ()=>FIRST_USE_APPROVAL_ACTIONS,
    "NETWORK_WHITELIST",
    ()=>NETWORK_WHITELIST,
    "approvalRequiredResult",
    ()=>approvalRequiredResult,
    "checkApprovalRequired",
    ()=>checkApprovalRequired,
    "estimateCost",
    ()=>estimateCost,
    "executeTool",
    ()=>executeTool,
    "executeTools",
    ()=>executeTools,
    "formatCostEstimate",
    ()=>formatCostEstimate,
    "formatToolResults",
    ()=>formatToolResults,
    "getOrCreateContact",
    ()=>getOrCreateContact,
    "validateCommandNetworkAccess",
    ()=>validateCommandNetworkAccess,
    "validateNetworkAccess",
    ()=>validateNetworkAccess
]);
/**
 * Claw AI Tool Executor - Execute tools and return results
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/claw-ai/tools.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/claw-ai/search.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$definitions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/themes/definitions.ts [app-route] (ecmascript)");
// import { ConvexHttpClient } from 'convex/browser';
// import { api } from '@/lib/convex-shim';
// import type { Id } from '../../../convex/_generated/dataModel';
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/convex-shim.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$memory$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/memory/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$memory$2f$manager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/memory/manager.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$channels$2f$outbound$2d$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/channels/outbound-router.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$video$2f$ltx$2d$video$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/video/ltx-video.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
// Default context for backwards compatibility (visitor with no userId)
const DEFAULT_CONTEXT = {
    userId: null,
    accessLevel: 'visitor'
};
/**
 * Get the effective userId for mutations
 * SECURITY: This ensures we never use a hardcoded owner ID
 * SECURITY: This function enforces that operations requiring a userId
 * are only executed by properly authenticated users with the correct access level.
 * The access level was already filtered at the API route level, but this
 * provides defense-in-depth in case of bugs in the filtering logic.
 */ function getEffectiveUserId(context, requiredLevel = 'owner') {
    if (!context.userId) {
        throw new Error('User ID required for this operation');
    }
    // Defense-in-depth: verify access level matches requirement
    if (requiredLevel === 'owner' && context.accessLevel !== 'owner') {
        throw new Error('Owner access required for this operation');
    }
    return context.userId;
}
// ============================================================================
// PATH VALIDATION - Security Layer for File Operations
// ============================================================================
/**
 * Allowed base directories for file operations
 * Files outside these directories are rejected
 */ const ALLOWED_PATH_PREFIXES = [
    '/workspace',
    '/home/user',
    '/tmp/sandbox'
];
/**
 * Blocked file patterns - these files should never be read/written
 * Even if they're in an allowed directory
 */ const BLOCKED_PATH_PATTERNS = [
    /\.env($|\.)/i,
    /credentials/i,
    /secrets?\.?(json|yaml|yml|toml)?$/i,
    /\.key$/i,
    /\.pem$/i,
    /id_rsa/i,
    /id_ed25519/i,
    /\.ssh\//i,
    /convex\//,
    /node_modules\//,
    /\.git\//
];
/**
 * Validate and normalize a file path for security
 *
 * Rules:
 * 1. Path must be absolute (starts with /)
 * 2. Path must be under an allowed prefix
 * 3. Path must not match any blocked patterns
 * 4. Path traversal (../) is rejected
 */ function validatePath(path) {
    // Ensure path is a string
    if (typeof path !== 'string' || !path) {
        return {
            valid: false,
            normalizedPath: '',
            error: 'Path must be a non-empty string'
        };
    }
    // Check for path traversal attempts
    if (path.includes('..')) {
        return {
            valid: false,
            normalizedPath: '',
            error: 'Path traversal (..) is not allowed'
        };
    }
    // Ensure absolute path
    if (!path.startsWith('/')) {
        return {
            valid: false,
            normalizedPath: '',
            error: 'Path must be absolute (start with /)'
        };
    }
    // Normalize the path (remove double slashes, trailing slashes)
    const normalizedPath = path.replace(/\/+/g, '/') // Replace multiple slashes with single
    .replace(/\/$/, ''); // Remove trailing slash
    // Check if path is under an allowed prefix
    const isAllowedPrefix = ALLOWED_PATH_PREFIXES.some((prefix)=>normalizedPath === prefix || normalizedPath.startsWith(prefix + '/'));
    if (!isAllowedPrefix) {
        return {
            valid: false,
            normalizedPath,
            error: `Path must be under one of: ${ALLOWED_PATH_PREFIXES.join(', ')}`
        };
    }
    // Check against blocked patterns
    for (const pattern of BLOCKED_PATH_PATTERNS){
        if (pattern.test(normalizedPath)) {
            return {
                valid: false,
                normalizedPath,
                error: `Access to this file type is blocked for security reasons`
            };
        }
    }
    return {
        valid: true,
        normalizedPath
    };
}
/**
 * Helper to create a standardized path validation error result
 */ function pathValidationError(error) {
    return {
        success: false,
        error: `[PATH SECURITY] ${error}`
    };
}
// ============================================================================
// MESSAGE CONTENT VALIDATION - Security Layer for Channel Messages
// ============================================================================
/**
 * Patterns that indicate potential phishing or social engineering
 * These messages should be blocked or flagged for review
 */ const PHISHING_PATTERNS = [
    // Credential harvesting
    /password.*(?:expired|reset|verify|confirm|update)/i,
    /(?:verify|confirm|update).*(?:account|identity|credentials)/i,
    /(?:click|tap|visit).*(?:link|here).*(?:login|sign.?in|verify)/i,
    /urgent.*(?:action|response).*required/i,
    // Financial scams
    /(?:wire|transfer|send).*(?:money|funds|payment|bitcoin|crypto)/i,
    /(?:won|winner|lottery|prize|inheritance).*(?:claim|collect)/i,
    /(?:bank|paypal|venmo).*(?:suspended|locked|verify)/i,
    // Impersonation
    /(?:i am|this is).*(?:ceo|cfo|president|boss|manager).*(?:need|want|request)/i,
    /(?:gift.?card|itunes|amazon).*(?:purchase|buy|send)/i,
    // Tech support scams
    /(?:computer|device|account).*(?:infected|hacked|compromised)/i,
    /(?:call|contact).*(?:immediately|urgently|asap)/i
];
/**
 * URLs that look suspicious
 */ const SUSPICIOUS_URL_PATTERNS = [
    /bit\.ly/i,
    /tinyurl/i,
    /goo\.gl/i,
    /t\.co(?!m)/i,
    /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
    /(?:login|signin|verify|secure|account).*\.(tk|ml|ga|cf|gq)/i
];
/**
 * Validate message content for security concerns
 */ function validateMessageContent(content) {
    if (!content || typeof content !== 'string') {
        return {
            valid: false,
            error: 'Message content is required'
        };
    }
    // Check for empty or whitespace-only
    if (content.trim().length === 0) {
        return {
            valid: false,
            error: 'Message cannot be empty'
        };
    }
    // Check message length (prevent spam)
    if (content.length > 10000) {
        return {
            valid: false,
            error: 'Message too long (max 10000 characters)'
        };
    }
    // Check for phishing patterns
    for (const pattern of PHISHING_PATTERNS){
        if (pattern.test(content)) {
            return {
                valid: false,
                error: 'Message contains content that appears to be phishing or social engineering. Please rephrase.'
            };
        }
    }
    // Check for suspicious URLs (warning, not blocking)
    const warnings = [];
    for (const pattern of SUSPICIOUS_URL_PATTERNS){
        if (pattern.test(content)) {
            warnings.push('Message contains a URL shortener or suspicious domain. Recipient may be cautious.');
            break;
        }
    }
    return {
        valid: true,
        warnings: warnings.length > 0 ? warnings : undefined
    };
}
/**
 * Helper to create a standardized message validation error result
 */ function messageValidationError(error) {
    return {
        success: false,
        error: `[MESSAGE SECURITY] ${error}`
    };
}
// ============================================================================
// SANDBOX VALIDATION - Security Layer for Code Execution
// ============================================================================
/**
 * Dangerous command patterns that should never be executed
 */ const DANGEROUS_COMMAND_PATTERNS = [
    /rm\s+-rf\s+\/(?![\w])/i,
    /:\s*\(\s*\)\s*\{/i,
    />\s*\/dev\/sd[a-z]/i,
    /dd\s+if=.*of=\/dev/i,
    /mkfs\./i,
    /shutdown|reboot|halt|poweroff/i,
    /chmod\s+777\s+\//i,
    /curl.*\|\s*(?:bash|sh)/i,
    /wget.*\|\s*(?:bash|sh)/i,
    /base64\s+-d.*\|\s*(?:bash|sh)/i,
    /eval\s*\(.*(?:curl|wget)/i
];
/**
 * Commands that require extra caution / explicit confirmation
 */ const CAUTIOUS_COMMAND_PATTERNS = [
    /npm\s+publish/i,
    /git\s+push.*--force/i,
    /docker\s+(?:rm|rmi)\s+-f/i,
    /kubectl\s+delete/i,
    /aws\s+.*delete/i
];
/**
 * Validate a command for security concerns
 */ function validateCommand(command) {
    if (!command || typeof command !== 'string') {
        return {
            valid: false,
            error: 'Command is required',
            requiresSandbox: true
        };
    }
    // Check for empty command
    if (command.trim().length === 0) {
        return {
            valid: false,
            error: 'Command cannot be empty',
            requiresSandbox: true
        };
    }
    // Check command length
    if (command.length > 10000) {
        return {
            valid: false,
            error: 'Command too long (max 10000 characters)',
            requiresSandbox: true
        };
    }
    // Check for dangerous patterns
    for (const pattern of DANGEROUS_COMMAND_PATTERNS){
        if (pattern.test(command)) {
            return {
                valid: false,
                error: 'Command contains dangerous patterns that could harm the system',
                requiresSandbox: true
            };
        }
    }
    // Check for cautious patterns (warn but allow)
    let warning;
    for (const pattern of CAUTIOUS_COMMAND_PATTERNS){
        if (pattern.test(command)) {
            warning = 'This command performs a sensitive operation. Proceed with caution.';
            break;
        }
    }
    return {
        valid: true,
        warning,
        requiresSandbox: true
    };
}
/**
 * Helper to create a standardized command validation error result
 */ function commandValidationError(error) {
    return {
        success: false,
        error: `[COMMAND SECURITY] ${error}`
    };
}
// ============================================================================
// GIT BRANCH VALIDATION - Security Layer for Repository Operations
// ============================================================================
/**
 * Validate a Git branch name to prevent command injection
 *
 * Git branch names can contain alphanumeric characters, dots, slashes,
 * underscores, and hyphens. They must NOT contain shell metacharacters
 * that could enable command injection attacks.
 *
 * @param branch - The branch name to validate
 * @returns true if the branch name is valid, false otherwise
 */ function isValidGitBranch(branch) {
    // Git branch names can contain: alphanumeric, ., /, _, -
    // Must NOT contain shell metacharacters: ; | & $ ` ( ) { } < > \n
    const validBranchRegex = /^[a-zA-Z0-9._\/-]+$/;
    return validBranchRegex.test(branch) && !branch.includes('..') && branch.length > 0 && branch.length <= 255;
}
const NETWORK_WHITELIST = new Set([
    // Package registries
    'registry.npmjs.org',
    'npm.pkg.github.com',
    'pypi.org',
    'files.pythonhosted.org',
    'crates.io',
    'static.crates.io',
    'rubygems.org',
    // Code hosting
    'github.com',
    'api.github.com',
    'raw.githubusercontent.com',
    'gist.githubusercontent.com',
    'gitlab.com',
    'bitbucket.org',
    // Documentation
    'docs.github.com',
    'docs.npmjs.com',
    'docs.python.org',
    'devdocs.io',
    'developer.mozilla.org',
    // CDNs commonly needed for development
    'cdn.jsdelivr.net',
    'unpkg.com',
    'cdnjs.cloudflare.com',
    // Build tools
    'nodejs.org',
    'deno.land',
    // Cloud providers (for CLI tools)
    'vercel.com',
    'api.vercel.com',
    'registry.terraform.io'
]);
/**
 * Domains that are always blocked (even if in whitelist)
 */ const NETWORK_BLOCKLIST = new Set([
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '169.254.169.254',
    'metadata.google.internal'
]);
/**
 * Extract domain from URL
 */ function extractDomain(url) {
    try {
        // Handle URLs with or without protocol
        const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
        const parsed = new URL(urlWithProtocol);
        return parsed.hostname.toLowerCase();
    } catch  {
        // Try to extract domain from common patterns
        const match = url.match(/^(?:https?:\/\/)?([^\/:\s]+)/);
        return match ? match[1].toLowerCase() : null;
    }
}
function validateNetworkAccess(url) {
    const domain = extractDomain(url);
    if (!domain) {
        return {
            valid: false,
            error: 'Invalid URL format'
        };
    }
    // Check blocklist first (absolute rejection)
    if (NETWORK_BLOCKLIST.has(domain)) {
        return {
            valid: false,
            domain,
            error: `Access to ${domain} is blocked for security reasons`
        };
    }
    // Check if it's an IP address (block unless explicitly whitelisted)
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) {
        return {
            valid: false,
            domain,
            error: 'Direct IP address access is not allowed. Use domain names.'
        };
    }
    // Check whitelist
    if (NETWORK_WHITELIST.has(domain)) {
        return {
            valid: true,
            domain
        };
    }
    // Check for subdomains of whitelisted domains
    for (const whitelisted of NETWORK_WHITELIST){
        if (domain.endsWith(`.${whitelisted}`)) {
            return {
                valid: true,
                domain,
                warning: `Subdomain of whitelisted domain: ${whitelisted}`
            };
        }
    }
    // Not in whitelist
    return {
        valid: false,
        domain,
        error: `Domain not in network whitelist: ${domain}. Allowed: npm, github, pypi, and standard dev tools.`
    };
}
function validateCommandNetworkAccess(command) {
    // Extract URLs from command
    const urlPatterns = [
        /https?:\/\/[^\s"']+/g,
        /git@([^:]+):/g,
        /(?:curl|wget|fetch)\s+[^\s]+/g
    ];
    for (const pattern of urlPatterns){
        const matches = command.match(pattern);
        if (matches) {
            for (const match of matches){
                // Extract URL from the match
                const url = match.replace(/^(curl|wget|fetch)\s+/, '').replace(/git@/, 'https://');
                const result = validateNetworkAccess(url);
                if (!result.valid) {
                    return result;
                }
            }
        }
    }
    return {
        valid: true
    };
}
/**
 * Helper to create network validation error result
 */ function networkValidationError(error) {
    return {
        success: false,
        error: `[NETWORK SECURITY] ${error}`
    };
}
const DESTRUCTIVE_ACTIONS = new Set([
    // File mutations
    'delete_file',
    // Git mutations that can't be easily undone
    'git_push',
    // External communications
    'send_channel_message',
    // System mutations
    'delete_cron_job',
    // Scheduling mutations that affect others
    'cancel_meeting'
]);
const FIRST_USE_APPROVAL_ACTIONS = new Set([
    'send_channel_message',
    'book_meeting'
]);
async function checkApprovalRequired(toolName, args, context) {
    // Destructive actions always require approval
    if (DESTRUCTIVE_ACTIONS.has(toolName)) {
        const consequences = getDestructiveConsequences(toolName, args);
        return {
            required: true,
            reason: getApprovalReason(toolName, args),
            actionType: 'destructive',
            toolName,
            toolArgs: args,
            consequences,
            approvalId: generateApprovalId(toolName, args)
        };
    }
    // Special case: send_channel_message to new contact
    if (toolName === 'send_channel_message') {
        const isNewContact = await checkIfNewContact(args, context);
        if (isNewContact) {
            return {
                required: true,
                reason: 'This is your first message to this contact. Please confirm.',
                actionType: 'first_use',
                toolName,
                toolArgs: args,
                consequences: [
                    'Message will be sent externally',
                    'Contact will see you initiated conversation'
                ],
                approvalId: generateApprovalId(toolName, args)
            };
        }
    }
    return null;
}
/**
 * Get human-readable reason for why approval is needed
 */ function getApprovalReason(toolName, args) {
    switch(toolName){
        case 'delete_file':
            return `Delete file: ${args.path || 'unknown path'}`;
        case 'git_push':
            const branch = args.branch || 'current branch';
            const force = args.force ? ' (FORCE PUSH)' : '';
            return `Push to remote${force}: ${branch}`;
        case 'send_channel_message':
            return `Send message via ${args.channel || 'channel'}`;
        case 'delete_cron_job':
            return `Delete scheduled job: ${args.jobId || 'unknown'}`;
        case 'cancel_meeting':
            return `Cancel meeting: ${args.meetingId || 'unknown'}`;
        default:
            return `Execute ${toolName}`;
    }
}
/**
 * Get list of consequences for destructive actions
 */ function getDestructiveConsequences(toolName, args) {
    switch(toolName){
        case 'delete_file':
            return [
                'File will be permanently deleted',
                'This cannot be undone',
                'Any references to this file may break'
            ];
        case 'git_push':
            if (args.force) {
                return [
                    'Remote history will be overwritten',
                    'Other collaborators may lose work',
                    'This cannot be easily undone'
                ];
            }
            return [
                'Changes will be pushed to remote',
                'Others will see these commits'
            ];
        case 'send_channel_message':
            return [
                'Message will be sent externally',
                'Recipient will be notified',
                'Message cannot be unsent'
            ];
        case 'delete_cron_job':
            return [
                'Scheduled automation will be stopped',
                'Job configuration will be lost'
            ];
        case 'cancel_meeting':
            return [
                'All participants will be notified',
                'Calendar events will be removed'
            ];
        default:
            return [
                'This action may have permanent effects'
            ];
    }
}
/**
 * Generate a unique approval ID for tracking
 */ function generateApprovalId(toolName, args) {
    const timestamp = Date.now();
    const argsHash = JSON.stringify(args).slice(0, 50);
    return `approval_${toolName}_${timestamp}_${Buffer.from(argsHash).toString('base64').slice(0, 10)}`;
}
function approvalRequiredResult(approval) {
    return {
        success: false,
        requiresApproval: true,
        approval,
        data: {
            message: `This action requires your approval: ${approval.reason}`,
            approvalId: approval.approvalId,
            consequences: approval.consequences
        }
    };
}
// ============================================================================
// CONTACT DEDUPLICATION - EPIC-001
// ============================================================================
/**
 * Normalize a name for fuzzy matching
 * Removes common titles, lowercases, removes punctuation
 */ function normalizeName(name) {
    return name.toLowerCase().replace(/^(mr|mrs|ms|dr|prof|sir|madam)\.?\s+/i, '') // Remove titles
    .replace(/[^a-z0-9\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}
/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy name matching
 */ function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null).map(()=>Array(n + 1).fill(0));
    for(let i = 0; i <= m; i++)dp[i][0] = i;
    for(let j = 0; j <= n; j++)dp[0][j] = j;
    for(let i = 1; i <= m; i++){
        for(let j = 1; j <= n; j++){
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 1 // substitution
                );
            }
        }
    }
    return dp[m][n];
}
/**
 * Calculate name similarity score (0-1, where 1 is identical)
 */ function calculateNameSimilarity(name1, name2) {
    const normalized1 = normalizeName(name1);
    const normalized2 = normalizeName(name2);
    if (normalized1 === normalized2) return 1.0;
    const maxLen = Math.max(normalized1.length, normalized2.length);
    if (maxLen === 0) return 0;
    const distance = levenshteinDistance(normalized1, normalized2);
    return 1 - distance / maxLen;
}
/**
 * Normalize email for matching
 */ function normalizeEmail(email) {
    return email.toLowerCase().trim();
}
/**
 * Normalize phone number for matching (strips all non-digits)
 */ function normalizePhone(phone) {
    return phone.replace(/\D/g, '');
}
/**
 * Find matching contacts in the system
 * Checks phone, email, and name similarity
 */ async function findMatchingContacts(args, context) {
    const recipientId = args.recipientId;
    const recipientName = args.recipientName;
    const recipientEmail = args.recipientEmail;
    if (!recipientId && !recipientName && !recipientEmail) {
        return [];
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return [];
    }
    const matches = [];
    const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
    try {
        // Check 1: Exact phone match (highest priority)
        if (recipientId) {
            const normalizedPhone = normalizePhone(recipientId);
            const phoneContact = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].whatsappContacts.getContactByPhone, {
                phoneNumber: normalizedPhone
            });
            if (phoneContact) {
                matches.push({
                    contactId: phoneContact._id,
                    matchType: 'exact_phone',
                    confidence: 1.0,
                    existingContact: phoneContact
                });
            }
        }
        // Check 2: Exact email match
        if (recipientEmail && matches.length === 0) {
            const normalizedEmail = normalizeEmail(recipientEmail);
            const allContacts = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].whatsappContacts.listContacts, {});
            for (const contact of allContacts){
                if (contact.email && normalizeEmail(contact.email) === normalizedEmail) {
                    matches.push({
                        contactId: contact._id,
                        matchType: 'exact_email',
                        confidence: 1.0,
                        existingContact: contact
                    });
                    break;
                }
            }
        }
        // Check 3: Fuzzy name match (if no exact matches found)
        if (recipientName && matches.length === 0) {
            const allContacts = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].whatsappContacts.listContacts, {});
            for (const contact of allContacts){
                if (contact.displayName) {
                    const similarity = calculateNameSimilarity(recipientName, contact.displayName);
                    // High confidence threshold: 0.85+ similarity
                    if (similarity >= 0.85) {
                        matches.push({
                            contactId: contact._id,
                            matchType: 'fuzzy_name',
                            confidence: similarity,
                            existingContact: contact
                        });
                    }
                }
            }
            // Sort by confidence (highest first)
            matches.sort((a, b)=>b.confidence - a.confidence);
        }
        return matches;
    } catch (error) {
        console.error('[ContactDedup] Error finding matching contacts:', error);
        return [];
    }
}
/**
 * Check if a contact is new (for approval flow)
 * Returns true if this is the first message to this contact
 */ async function checkIfNewContact(args, context) {
    const integrationId = args.integrationId;
    const recipientId = args.recipientId;
    if (!integrationId || !recipientId) {
        // If we can't determine the recipient, treat as new for safety
        return true;
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return true;
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        // First check if contact exists
        const matches = await findMatchingContacts(args, context);
        if (matches.length === 0) {
            return true; // No existing contact found
        }
        // Check if we've sent messages to this integration/recipient before
        // Query channelMessages for any previous messages
        const userId = context.userId;
        if (!userId) {
            return true; // No user context, treat as new
        }
        // Get the first match (highest confidence)
        const bestMatch = matches[0];
        const normalizedRecipient = normalizePhone(recipientId);
        // Query for previous messages to this recipient via this integration
        const userMessages = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].channels.getUserMessages, {
            userId,
            limit: 100
        });
        // Check if any message was sent to this recipient
        const hasPreviousMessages = userMessages.some((msg)=>{
            if (msg.integrationId !== integrationId) return false;
            const msgRecipient = normalizePhone(msg.recipientId || '');
            return msgRecipient === normalizedRecipient;
        });
        return !hasPreviousMessages;
    } catch (error) {
        console.error('[ContactDedup] Error checking if new contact:', error);
        // On error, treat as new for safety (requires approval)
        return true;
    }
}
async function getOrCreateContact(args, context) {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        throw new Error('Convex URL not configured');
    }
    const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
    // Find matching contacts
    const matches = await findMatchingContacts(args, context);
    if (matches.length > 0) {
        const bestMatch = matches[0];
        // If confidence is high (0.95+), return existing contact
        if (bestMatch.confidence >= 0.95) {
            return {
                contactId: bestMatch.contactId,
                isNew: false,
                matchType: bestMatch.matchType
            };
        }
    // If confidence is medium (0.85-0.95), could implement merge logic here
    // For now, we'll create a new contact and let the user merge manually
    }
    // No match found or low confidence - create new contact
    const contactId = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].whatsappContacts.upsertContact, {
        phoneNumber: args.phoneNumber || '',
        displayName: args.displayName,
        email: args.email,
        accessLevel: args.accessLevel || 'visitor'
    });
    return {
        contactId,
        isNew: true
    };
}
/**
 * Operations that are considered "expensive" and need cost estimation
 */ const EXPENSIVE_OPERATIONS = {
    // AI operations
    'compact_conversation': {
        baseTokens: 10000,
        baseTimeMs: 5000,
        confirmationThreshold: {
            tokens: 50000
        }
    },
    // Code execution
    'run_command': {
        baseTimeMs: 30000,
        confirmationThreshold: {
            time: 60000
        }
    },
    'start_dev_server': {
        baseTimeMs: 60000,
        creditsPerCall: 10,
        confirmationThreshold: {
            time: 120000
        }
    },
    // Repository operations
    'clone_repository': {
        baseTimeMs: 30000,
        apiCalls: 1,
        confirmationThreshold: {
            time: 60000
        }
    },
    // Large file operations
    'write_file': {
        tokensPerKb: 100,
        baseTimeMs: 1000
    },
    'read_file': {
        tokensPerKb: 50,
        baseTimeMs: 500
    },
    // External communications
    'send_channel_message': {
        apiCalls: 1,
        baseTimeMs: 2000
    }
};
function estimateCost(toolName, args) {
    const config = EXPENSIVE_OPERATIONS[toolName];
    if (!config) {
        return null; // Not an expensive operation
    }
    const breakdown = [];
    let totalTokens = config.baseTokens || 0;
    let totalTimeMs = config.baseTimeMs || 0;
    let totalApiCalls = config.apiCalls || 0;
    let totalCredits = config.creditsPerCall || 0;
    let warning;
    // Estimate based on content size if applicable
    if (config.tokensPerKb && args.content) {
        const contentLength = String(args.content).length;
        const contentKb = contentLength / 1024;
        const contentTokens = Math.ceil(contentKb * config.tokensPerKb);
        totalTokens += contentTokens;
        breakdown.push({
            resource: 'Content processing',
            amount: contentTokens,
            unit: 'tokens'
        });
    }
    // Estimate time based on command complexity
    if (toolName === 'run_command' && args.command) {
        const command = String(args.command);
        // npm/pnpm installs take longer
        if (/npm|pnpm|yarn/.test(command) && /install|add|update/.test(command)) {
            totalTimeMs *= 3;
            warning = 'Package installation can take several minutes';
        }
        // Build commands take longer
        if (/build|compile|test/.test(command)) {
            totalTimeMs *= 2;
        }
    }
    // Check if confirmation is needed
    const threshold = config.confirmationThreshold || {};
    const requiresConfirmation = !!(threshold.tokens && totalTokens > threshold.tokens || threshold.time && totalTimeMs > threshold.time || threshold.cost && totalCredits > (threshold.cost || 0));
    // Add standard breakdown items
    if (totalTokens > 0) {
        breakdown.push({
            resource: 'AI tokens',
            amount: totalTokens,
            unit: 'tokens',
            cost: Math.ceil(totalTokens * 0.003)
        });
    }
    if (totalTimeMs > 0) {
        breakdown.push({
            resource: 'Estimated time',
            amount: Math.ceil(totalTimeMs / 1000),
            unit: 'seconds'
        });
    }
    if (totalApiCalls > 0) {
        breakdown.push({
            resource: 'External API calls',
            amount: totalApiCalls,
            unit: 'calls'
        });
    }
    if (totalCredits > 0) {
        breakdown.push({
            resource: 'Platform credits',
            amount: totalCredits,
            unit: 'credits'
        });
    }
    // Only return if there's meaningful cost
    if (breakdown.length === 0) {
        return null;
    }
    return {
        estimatedTokens: totalTokens > 0 ? totalTokens : undefined,
        estimatedTimeMs: totalTimeMs > 0 ? totalTimeMs : undefined,
        estimatedApiCalls: totalApiCalls > 0 ? totalApiCalls : undefined,
        estimatedCredits: totalCredits > 0 ? totalCredits : undefined,
        breakdown,
        warning,
        requiresConfirmation
    };
}
function formatCostEstimate(cost) {
    const parts = [];
    if (cost.estimatedTimeMs) {
        const seconds = Math.ceil(cost.estimatedTimeMs / 1000);
        parts.push(`~${seconds}s`);
    }
    if (cost.estimatedTokens) {
        parts.push(`~${(cost.estimatedTokens / 1000).toFixed(1)}K tokens`);
    }
    if (cost.estimatedApiCalls) {
        parts.push(`${cost.estimatedApiCalls} API call${cost.estimatedApiCalls > 1 ? 's' : ''}`);
    }
    return parts.join(' | ') || 'minimal cost';
}
async function executeTool(toolCall, context = DEFAULT_CONTEXT, options = {}) {
    const { name, arguments: args } = toolCall;
    // SECURITY: Check if approval is required for destructive actions
    // Skip if approval was already granted (approvalId matches)
    if (!options.skipApprovalCheck) {
        const approvalRequired = await checkApprovalRequired(name, args, context);
        if (approvalRequired && approvalRequired.approvalId !== options.approvalId) {
            return approvalRequiredResult(approvalRequired);
        }
    }
    // COST: Calculate cost estimate for expensive operations
    const costEstimate = !options.skipCostEstimate ? estimateCost(name, args) : null;
    // Helper to attach cost estimate to results
    const withCost = (result)=>{
        if (costEstimate) {
            return {
                ...result,
                costEstimate
            };
        }
        return result;
    };
    try {
        switch(name){
            case 'search_portfolio':
                return withCost(executeSearchPortfolio(args));
            case 'navigate_to':
                return executeNavigateTo(args);
            case 'schedule_call':
                return executeScheduleCall(args);
            case 'list_themes':
                return executeListThemes(args);
            case 'open_search_app':
                return executeOpenSearchApp(args);
            case 'show_weather':
                return executeShowWeather(args);
            case 'show_kanban_tasks':
                return executeShowKanbanTasks(args);
            case 'show_photos':
                return executeShowPhotos(args);
            case 'render_ui':
                return executeRenderUI(args);
            // Agentic Product Lifecycle Tools
            case 'create_project':
                return executeCreateProject(args);
            case 'create_prd':
                return executeCreatePRD(args);
            case 'create_ticket':
                return executeCreateTicket(args);
            case 'update_ticket':
                return executeUpdateTicket(args);
            case 'shard_prd':
                return executeShardPRD(args);
            case 'get_project_kanban':
                return executeGetProjectKanban(args);
            case 'list_projects':
                return executeListProjects(args);
            // Scheduling Tools
            case 'get_available_times':
                return await executeGetAvailableTimes(args);
            case 'get_upcoming_bookings':
                return await executeGetUpcomingBookings(args);
            case 'book_meeting':
                return await executeBookMeeting(args);
            case 'reschedule_meeting':
                return await executeRescheduleMeeting(args);
            case 'cancel_meeting':
                return await executeCancelMeeting(args);
            // Memory Tools (RLM - Recursive Memory Layer)
            // SECURITY: These tools require authenticated userId
            case 'remember':
                return await executeRemember(args, context);
            case 'recall_preference':
                return await executeRecallPreference(args, context);
            case 'memorize':
                return await executeMemorize(args, context);
            case 'learn':
                return await executeLearn(args, context);
            case 'forget':
                return await executeForget(args, context);
            // ∞gent Coding Tools
            case 'set_active_context':
                return await executeSetActiveContext(args);
            case 'get_active_context':
                return await executeGetActiveContext(args);
            case 'load_context_from_reference':
                return await executeLoadContextFromReference(args);
            case 'clone_repository':
                return await executeCloneRepository(args);
            case 'list_directory':
                return await executeListDirectory(args);
            case 'search_codebase':
                return await executeSearchCodebase(args);
            case 'read_file':
                return await executeReadFile(args);
            case 'write_file':
                return await executeWriteFile(args);
            case 'edit_file':
                return await executeEditFile(args);
            case 'delete_file':
                return await executeDeleteFile(args);
            case 'run_command':
                return await executeRunCommand(args);
            case 'start_dev_server':
                return await executeStartDevServer(args);
            case 'get_preview_url':
                return await executeGetPreviewUrl(args);
            case 'git_status':
                return await executeGitStatus(args);
            case 'git_diff':
                return await executeGitDiff(args);
            case 'git_commit':
                return await executeGitCommit(args);
            case 'git_push':
                return await executeGitPush(args);
            case 'create_branch':
                return await executeCreateBranch(args);
            case 'create_coding_task':
                return await executeCreateCodingTask(args);
            case 'update_coding_task':
                return await executeUpdateCodingTask(args);
            case 'list_coding_tasks':
                return await executeListCodingTasks(args);
            // Cron Job Tools
            // SECURITY: These tools require authenticated userId
            case 'create_cron_job':
                return await executeCreateCronJob(args, context);
            case 'list_cron_jobs':
                return await executeListCronJobs(args, context);
            case 'toggle_cron_job':
                return await executeToggleCronJob(args);
            case 'delete_cron_job':
                return await executeDeleteCronJob(args);
            // Compaction Tools
            // SECURITY: Compaction uses memory APIs that require userId
            case 'compact_conversation':
                return await executeCompactConversation(args, context);
            case 'get_compaction_summary':
                return await executeGetCompactionSummary(args);
            // ======================================================================
            // Channel Integration Tools
            // SECURITY: Channel tools require authenticated userId
            // ======================================================================
            case 'list_channel_integrations':
                return await executeListChannelIntegrations(args, context);
            case 'get_channel_conversations':
                return await executeGetChannelConversations(args, context);
            case 'send_channel_message':
                return await executeSendChannelMessage(args, context);
            case 'search_channel_messages':
                return await executeSearchChannelMessages(args, context);
            // ERV Dimension Tools
            case 'create_dimension':
                return await executeCreateDimension(args);
            case 'navigate_to_dimension':
                return executeNavigateToDimension(args);
            case 'list_dimensions':
                return await executeListDimensions(args);
            case 'search_entities':
                return await executeSearchEntities(args);
            // ERV Ontology Tools - AI-Assisted Classification
            case 'analyze_and_create_entity':
                return await executeAnalyzeAndCreateEntity(args, context);
            case 'suggest_entity_relationships':
                return await executeSuggestEntityRelationships(args, context);
            case 'bulk_classify_entities':
                return await executeBulkClassifyEntities(args, context);
            // Video/Remotion Tools
            case 'create_video_composition':
                return executeCreateVideoComposition(args);
            case 'add_text_overlay':
                return executeAddTextOverlay(args);
            case 'add_lyrics_to_video':
                return executeAddLyricsToVideo(args);
            case 'add_media_to_video':
                return executeAddMediaToVideo(args);
            case 'preview_video':
                return executePreviewVideo(args);
            case 'render_video':
                return await executeRenderVideo(args);
            case 'sync_lyrics_to_audio':
                return await executeSyncLyricsToAudio(args);
            case 'get_render_status':
                return await executeGetRenderStatus(args);
            // Talking Video Tools
            case 'create_talking_video':
                return await executeCreateTalkingVideo(args);
            case 'generate_video_script':
                return await executeGenerateVideoScript(args);
            case 'generate_voice_audio':
                return await executeGenerateVoiceAudio(args);
            case 'navigate_to_video_studio':
                return executeNavigateToVideoStudio(args);
            // LTX-2 Video Generation Tools
            case 'generate_video':
                return await executeGenerateVideo(args);
            case 'animate_image':
                return await executeAnimateImage(args);
            case 'list_video_presets':
                return executeListVideoPresets();
            // AI Provider Tools
            case 'get_ai_provider_status':
                return executeGetAIProviderStatus(args);
            case 'navigate_to_ai_settings':
                return executeNavigateToAISettings();
            // Kanban Task Reading Tools
            case 'get_kanban_task':
                return await executeGetKanbanTask(args);
            case 'search_kanban_tasks':
                return await executeSearchKanbanTasks(args);
            // Design Canvas Tools
            case 'create_canvas':
                return await executeCreateCanvas(args, context);
            case 'list_canvases':
                return await executeListCanvases(args, context);
            case 'get_canvas':
                return await executeGetCanvas(args);
            case 'add_canvas_node':
                return await executeAddCanvasNode(args, context);
            case 'add_canvas_edge':
                return await executeAddCanvasEdge(args);
            case 'update_canvas_node':
                return await executeUpdateCanvasNode(args);
            // Apple Health Tools
            case 'get_health_summary':
                return await executeGetHealthSummary(args, context);
            case 'get_health_trends':
                return await executeGetHealthTrends(args, context);
            case 'get_health_metric':
                return await executeGetHealthMetric(args, context);
            case 'compare_health_periods':
                return await executeCompareHealthPeriods(args, context);
            case 'generate_health_api_key':
                return await executeGenerateHealthApiKey(args, context);
            case 'list_health_api_keys':
                return await executeListHealthApiKeys(context);
            case 'revoke_health_api_key':
                return await executeRevokeHealthApiKey(args, context);
            case 'get_health_sync_status':
                return await executeGetHealthSyncStatus(args, context);
            // =========================================================================
            // Autonomous Execution Tools
            // =========================================================================
            case 'spawn_task':
                return await executeSpawnTask(args);
            case 'list_background_tasks':
                return await executeListBackgroundTasks(args);
            case 'cancel_background_task':
                return await executeCancelBackgroundTask(args);
            case 'get_task_result':
                return await executeGetTaskResult(args);
            case 'iterate_on_code':
                return await executeIterateOnCode(args);
            case 'delegate_to_specialist':
                return await executeDelegateToSpecialist(args);
            // =========================================================================
            // Music Generation Tools (ACE-Step via Lynkr)
            // =========================================================================
            case 'cowrite_music':
                return await executeCowriteMusic(args, context);
            case 'generate_music':
                return await executeGenerateMusic(args, context);
            case 'analyze_audio':
                return await executeAnalyzeAudio(args, context);
            case 'separate_stems':
                return await executeSeparateStems(args, context);
            default:
                return withCost({
                    success: false,
                    error: `Unknown tool: ${name}`
                });
        }
    } catch (error) {
        return withCost({
            success: false,
            error: error instanceof Error ? error.message : 'Tool execution failed'
        });
    }
}
async function executeTools(toolCalls) {
    const results = new Map();
    for (const toolCall of toolCalls){
        const result = await executeTool(toolCall);
        results.set(toolCall.name, result);
    }
    return results;
}
function formatToolResults(results) {
    const sections = [];
    for (const [toolName, result] of results){
        if (result.success) {
            sections.push(`[${toolName}]: ${JSON.stringify(result.data)}`);
        } else {
            sections.push(`[${toolName}]: Error - ${result.error}`);
        }
    }
    return sections.join('\n\n');
}
// Individual tool executors
function executeSearchPortfolio(args) {
    const query = args.query;
    const category = args.category || 'all';
    if (!query) {
        return {
            success: false,
            error: 'Search query is required'
        };
    }
    const results = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchPortfolio"])(query, {
        category,
        limit: 8
    });
    const formattedResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatSearchResults"])(results);
    return {
        success: true,
        data: {
            query,
            category,
            resultCount: results.length,
            results: results.map((r)=>({
                    type: r.type,
                    title: r.title,
                    description: r.description.slice(0, 200),
                    url: r.url,
                    metadata: r.metadata
                })),
            formatted: formattedResults
        },
        action: {
            type: 'show_results',
            payload: {
                results,
                query
            }
        }
    };
}
function executeNavigateTo(args) {
    const destination = args.destination;
    const theme = args.theme;
    // Validate destination
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NAVIGATION_DESTINATIONS"].includes(destination)) {
        return {
            success: false,
            error: `Invalid destination: ${destination}. Valid destinations: ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NAVIGATION_DESTINATIONS"].join(', ')}`
        };
    }
    // Validate theme if provided
    if (theme && !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$definitions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["themes"].some((t)=>t.name === theme)) {
        return {
            success: false,
            error: `Invalid theme: ${theme}`
        };
    }
    // Build the URL
    const destinationMap = {
        home: '/',
        story: '/story',
        design: '/design',
        resume: '/resume',
        projects: '/projects',
        blog: '/blog',
        music: '/music',
        humans: '/humans',
        themes: '/design',
        photos: '/photos',
        video: '/video',
        canvas: '/canvas',
        search: '/search'
    };
    let url = destinationMap[destination] || `/${destination}`;
    if (theme) {
        url += `${url.includes('?') ? '&' : '?'}theme=${theme}`;
    }
    return {
        success: true,
        data: {
            destination,
            url,
            theme,
            message: `Navigating to ${destination}${theme ? ` with the ${theme} theme` : ''}`
        },
        action: {
            type: 'navigate',
            payload: {
                url,
                destination,
                theme
            }
        }
    };
}
function executeScheduleCall(args) {
    const topic = args.topic;
    // Calendly URL - would be configured in env
    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/james-spalding';
    let url = calendlyUrl;
    if (topic) {
        // Calendly supports prefilling via query params
        url += `?a1=${encodeURIComponent(topic)}`;
    }
    return {
        success: true,
        data: {
            url,
            topic,
            message: topic ? `Opening calendar to schedule a call about: ${topic}` : 'Opening calendar to schedule a call'
        },
        action: {
            type: 'open_calendar',
            payload: {
                url,
                topic
            }
        }
    };
}
function executeListThemes(args) {
    const category = args.category;
    const allThemes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAllThemes"])(category);
    // Group themes for better presentation
    const themeList = allThemes.map((t)=>t.title).join(', ');
    return {
        success: true,
        data: {
            count: allThemes.length,
            themes: allThemes.map((t)=>({
                    name: t.metadata?.themeName,
                    label: t.title,
                    url: t.url
                })),
            formatted: `Available themes (${allThemes.length}): ${themeList}`
        }
    };
}
// New tool executors for rich components
function executeOpenSearchApp(args) {
    const query = args.query;
    if (!query) {
        return {
            success: false,
            error: 'Search query is required'
        };
    }
    return {
        success: true,
        data: {
            query,
            message: `Opening Search app with query: "${query}"`
        },
        action: {
            type: 'open_search',
            payload: {
                url: `/search?q=${encodeURIComponent(query)}`,
                query
            }
        }
    };
}
function executeShowWeather(args) {
    const location = args.location || 'San Francisco';
    // Mock weather data for now - in production would call a weather API
    const conditions = [
        'sunny',
        'cloudy',
        'rainy',
        'windy'
    ];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const weatherData = {
        location,
        temperature: Math.floor(55 + Math.random() * 25),
        condition: randomCondition,
        humidity: Math.floor(40 + Math.random() * 40),
        windSpeed: Math.floor(5 + Math.random() * 15)
    };
    return {
        success: true,
        data: weatherData
    };
}
function executeShowKanbanTasks(args) {
    const filter = args.filter || 'all';
    const tag = args.tag;
    const limit = args.limit || 5;
    // Import sample tasks from kanban types would be ideal
    // For now, return some representative tasks
    const sampleTasks = [
        {
            id: 'p8-1',
            title: '[P8] Claw AI Search - Tool Definitions',
            description: 'Create tools.ts with search_portfolio, navigate_to, schedule_call, list_themes.',
            status: 'done',
            priority: 'high',
            tags: [
                'P8',
                'claw-ai',
                'tools'
            ]
        },
        {
            id: 'p8-2',
            title: '[P8] Claw AI Search - Convex Integration',
            description: 'Integrate search with Convex backend for persistent indexing.',
            status: 'in-progress',
            priority: 'high',
            tags: [
                'P8',
                'claw-ai',
                'search',
                'convex'
            ]
        },
        {
            id: 'p0-1',
            title: '[P0] Command Palette - Core Component',
            description: 'Create CommandPalette.tsx with Liquid Glass styling.',
            status: 'todo',
            priority: 'urgent',
            tags: [
                'P0',
                'command-palette',
                'macro'
            ]
        },
        {
            id: 'p1-1',
            title: '[P1] Projects Landing - Folder Cards',
            description: 'Create ProjectsLanding.tsx with folder cards.',
            status: 'todo',
            priority: 'high',
            tags: [
                'P1',
                'projects',
                'landing'
            ]
        },
        {
            id: 'done-1',
            title: 'Next.js 14 App Router Setup',
            description: 'Initial project setup with Next.js 14, TypeScript, and Tailwind CSS',
            status: 'done',
            priority: 'high',
            tags: [
                'foundation',
                'setup'
            ]
        }
    ];
    // Filter tasks
    let filteredTasks = sampleTasks;
    if (filter !== 'all') {
        filteredTasks = filteredTasks.filter((t)=>t.status === filter);
    }
    if (tag) {
        filteredTasks = filteredTasks.filter((t)=>t.tags.some((taskTag)=>taskTag.toLowerCase().includes(tag.toLowerCase())));
    }
    const tasks = filteredTasks.slice(0, limit);
    return {
        success: true,
        data: {
            filter,
            tag,
            count: tasks.length,
            tasks
        }
    };
}
function executeShowPhotos(args) {
    const count = args.count || 6;
    // Real photos from James's gallery - Irish landscapes and nature photography
    const galleryPhotos = [
        {
            id: '1',
            src: '/photos/aurora.jpeg',
            alt: 'Aurora Borealis',
            caption: 'Northern Lights over Ireland'
        },
        {
            id: '2',
            src: '/photos/Sunriseoverhowth.jpeg',
            alt: 'Sunrise over Howth',
            caption: 'Sunrise over Howth, Dublin'
        },
        {
            id: '3',
            src: '/photos/Donabatebeach.jpeg',
            alt: 'Donabate Beach',
            caption: 'Donabate Beach, North Dublin'
        },
        {
            id: '4',
            src: '/photos/SunsetPortrane.jpeg',
            alt: 'Sunset at Portrane',
            caption: 'Sunset at Portrane'
        },
        {
            id: '5',
            src: '/photos/Glenofthedowns.jpeg',
            alt: 'Glen of the Downs',
            caption: 'Glen of the Downs, Wicklow'
        },
        {
            id: '6',
            src: '/photos/Robin.jpeg',
            alt: 'Robin',
            caption: 'Robin in the garden'
        },
        {
            id: '7',
            src: '/photos/Nightsky.jpeg',
            alt: 'Night Sky',
            caption: 'Night sky photography'
        },
        {
            id: '8',
            src: '/photos/Mistysunrise.jpeg',
            alt: 'Misty Sunrise',
            caption: 'Misty morning sunrise'
        },
        {
            id: '9',
            src: '/photos/Corballis.jpeg',
            alt: 'Corballis',
            caption: 'Corballis, North Dublin'
        },
        {
            id: '10',
            src: '/photos/sunsetachill.jpeg',
            alt: 'Sunset Achill',
            caption: 'Sunset at Achill Island'
        },
        {
            id: '11',
            src: '/photos/SunsetSalvador.jpeg',
            alt: 'Sunset Salvador',
            caption: 'Sunset in Salvador, Brazil'
        },
        {
            id: '12',
            src: '/photos/Portranedemense.jpeg',
            alt: 'Portrane Demesne',
            caption: 'Portrane Demesne woods'
        }
    ];
    const photos = galleryPhotos.slice(0, Math.min(count, galleryPhotos.length));
    return {
        success: true,
        data: {
            count: photos.length,
            photos,
            message: `Showing ${photos.length} photos from James's gallery. These are mostly from Ireland where James grew up.`
        }
    };
}
function executeRenderUI(args) {
    const uiTree = args.ui_tree;
    const title = args.title;
    if (!uiTree) {
        return {
            success: false,
            error: 'UI tree is required'
        };
    }
    // Validate basic structure
    if (!uiTree.root || !uiTree.elements) {
        return {
            success: false,
            error: 'Invalid UI tree structure. Must have "root" and "elements" properties.'
        };
    }
    return {
        success: true,
        data: {
            title,
            ui_tree: uiTree
        },
        action: {
            type: 'render_ui',
            payload: {
                title,
                ui_tree: uiTree
            }
        }
    };
}
// =============================================================================
// Agentic Product Lifecycle Tool Executors
// These tools enable Claw AI to create and manage projects, PRDs, and tickets
// Inspired by BMAD-METHOD and CCPM workflows
// =============================================================================
/**
 * Create a new product project
 * This is the entry point for the agentic product lifecycle
 */ function executeCreateProject(args) {
    const name = args.name;
    const description = args.description;
    const color = args.color;
    if (!name) {
        return {
            success: false,
            error: 'Project name is required'
        };
    }
    // Generate a temporary project ID - the actual creation happens via Convex mutation
    // This returns an action that the frontend will use to call the Convex mutation
    const tempSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return {
        success: true,
        data: {
            name,
            description,
            color: color || '#8b5cf6',
            slug: tempSlug,
            message: `Creating project "${name}"...`
        },
        action: {
            type: 'project_created',
            payload: {
                name,
                description,
                color: color || '#8b5cf6',
                slug: tempSlug,
                // Frontend will call Convex mutation with these args
                convexMutation: 'agentic:createProductProject'
            }
        }
    };
}
/**
 * Create a Product Requirements Document (PRD)
 * Following BMAD methodology for structured requirements
 */ function executeCreatePRD(args) {
    const projectId = args.projectId;
    const title = args.title;
    const executiveSummary = args.executiveSummary;
    const problemStatement = args.problemStatement;
    if (!projectId) {
        return {
            success: false,
            error: 'Project ID is required to create a PRD'
        };
    }
    if (!title) {
        return {
            success: false,
            error: 'PRD title is required'
        };
    }
    return {
        success: true,
        data: {
            projectId,
            title,
            executiveSummary,
            problemStatement,
            message: `Creating PRD "${title}"...`
        },
        action: {
            type: 'prd_created',
            payload: {
                projectId,
                title,
                executiveSummary,
                problemStatement,
                generatedBy: 'ai',
                convexMutation: 'agentic:createPRD'
            }
        }
    };
}
/**
 * Create a ticket/story on the Kanban board
 * Supports BMAD user story format (As a... I want... So that...)
 */ function executeCreateTicket(args) {
    const projectId = args.projectId;
    const title = args.title;
    const description = args.description;
    const type = args.type || 'story';
    const priority = args.priority || 'P2';
    const asA = args.asA;
    const iWant = args.iWant;
    const soThat = args.soThat;
    const labels = args.labels;
    if (!projectId) {
        return {
            success: false,
            error: 'Project ID is required to create a ticket'
        };
    }
    if (!title) {
        return {
            success: false,
            error: 'Ticket title is required'
        };
    }
    return {
        success: true,
        data: {
            projectId,
            title,
            description,
            type,
            priority,
            asA,
            iWant,
            soThat,
            labels,
            message: `Creating ticket "${title}"...`
        },
        action: {
            type: 'ticket_created',
            payload: {
                projectId,
                title,
                description,
                type,
                priority,
                asA,
                iWant,
                soThat,
                labels,
                createdBy: 'ai',
                convexMutation: 'agentic:createTicket'
            }
        }
    };
}
/**
 * Update an existing ticket
 * Can change status, priority, description, and other fields
 */ function executeUpdateTicket(args) {
    const ticketId = args.ticketId;
    const status = args.status;
    const priority = args.priority;
    const title = args.title;
    const description = args.description;
    const assigneeId = args.assigneeId;
    if (!ticketId) {
        return {
            success: false,
            error: 'Ticket ID is required'
        };
    }
    const updates = {};
    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (assigneeId) updates.assigneeId = assigneeId;
    if (Object.keys(updates).length === 0) {
        return {
            success: false,
            error: 'At least one field to update is required'
        };
    }
    return {
        success: true,
        data: {
            ticketId,
            updates,
            message: `Updating ticket ${ticketId}...`
        },
        action: {
            type: 'ticket_updated',
            payload: {
                ticketId,
                ...updates,
                convexMutation: 'agentic:updateTicket'
            }
        }
    };
}
/**
 * Shard a PRD into epics and tickets
 * Converts functional requirements into actionable Kanban items
 */ function executeShardPRD(args) {
    const prdId = args.prdId;
    const projectId = args.projectId;
    if (!prdId) {
        return {
            success: false,
            error: 'PRD ID is required'
        };
    }
    if (!projectId) {
        return {
            success: false,
            error: 'Project ID is required'
        };
    }
    return {
        success: true,
        data: {
            prdId,
            projectId,
            message: 'Sharding PRD into epics and tickets...'
        },
        action: {
            type: 'prd_sharded',
            payload: {
                prdId,
                projectId,
                convexMutation: 'agentic:shardPRDToTickets'
            }
        }
    };
}
/**
 * Get the Kanban board for a project
 * Returns tickets organized by status columns
 */ function executeGetProjectKanban(args) {
    const projectId = args.projectId;
    if (!projectId) {
        return {
            success: false,
            error: 'Project ID is required'
        };
    }
    return {
        success: true,
        data: {
            projectId,
            message: 'Loading Kanban board...'
        },
        action: {
            type: 'show_kanban',
            payload: {
                projectId,
                convexQuery: 'agentic:getKanbanBoard'
            }
        }
    };
}
/**
 * List all product projects
 * Can filter by status
 */ function executeListProjects(args) {
    const status = args.status;
    return {
        success: true,
        data: {
            status,
            message: status ? `Loading ${status} projects...` : 'Loading all projects...'
        },
        action: {
            type: 'render_component',
            payload: {
                componentType: 'projects',
                status,
                convexQuery: 'agentic:getProductProjects'
            }
        }
    };
}
/**
 * Get available meeting times for a specific date
 */ async function executeGetAvailableTimes(args) {
    const date = args.date;
    const duration = args.duration || 30;
    try {
        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
        if (!convexUrl) {
            return {
                success: false,
                error: 'Convex URL not configured'
            };
        }
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        // Get default event type (30-minute call) or first active event type
        const eventTypes = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].scheduling.getEventTypes, {});
        const eventType = eventTypes?.find((et)=>et.isActive && et.duration === duration) || eventTypes?.[0];
        if (!eventType) {
            return {
                success: false,
                error: 'No active event types found'
            };
        }
        const targetDate = date || new Date().toISOString().split('T')[0];
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const slots = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].scheduling.getAvailableSlots, {
            eventTypeId: eventType._id,
            date: targetDate,
            timezone
        });
        const slotTimes = slots?.map((s)=>{
            if (s.time) return s.time;
            if (s.timestamp) return new Date(s.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            return '';
        }).filter(Boolean) || [];
        return {
            success: true,
            data: {
                date: targetDate,
                duration,
                slots: slots || [],
                formatted: slotTimes.length > 0 ? `Available times on ${targetDate}: ${slotTimes.join(', ')}` : `No available times on ${targetDate}`
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get available times'
        };
    }
}
/**
 * Get upcoming scheduled bookings
 */ async function executeGetUpcomingBookings(args) {
    const limit = args.limit || 5;
    try {
        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
        if (!convexUrl) {
            return {
                success: false,
                error: 'Convex URL not configured'
            };
        }
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        // Get bookings for the authenticated user (James)
        // Note: This requires authentication context, which may not be available in tool executor
        // For now, return a message indicating the user should check the calendar
        return {
            success: true,
            data: {
                message: 'To view upcoming bookings, please check the calendar dashboard at /calendar',
                limit
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get upcoming bookings'
        };
    }
}
/**
 * Book a meeting with James
 */ async function executeBookMeeting(args) {
    const guestName = args.guestName;
    const guestEmail = args.guestEmail;
    const startTime = args.startTime;
    const topic = args.topic;
    const duration = args.duration || 30;
    if (!guestName || !guestEmail || !startTime) {
        return {
            success: false,
            error: 'guestName, guestEmail, and startTime are required'
        };
    }
    try {
        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
        if (!convexUrl) {
            return {
                success: false,
                error: 'Convex URL not configured'
            };
        }
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        // Get default event type matching the duration
        // Note: This requires authentication - will work when called from authenticated context
        const eventTypes = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].scheduling.getEventTypes, {});
        const eventType = eventTypes?.find((et)=>et.isActive && et.duration === duration) || eventTypes?.[0];
        if (!eventType) {
            return {
                success: false,
                error: 'No active event type found for the specified duration. Please ensure you are authenticated and have created event types.'
            };
        }
        const guestTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // Create booking
        const bookingId = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].scheduling.createBooking, {
            eventTypeId: eventType._id,
            guestName,
            guestEmail,
            guestTimezone,
            startTime,
            notes: topic
        });
        return {
            success: true,
            data: {
                bookingId,
                guestName,
                guestEmail,
                startTime: new Date(startTime).toISOString(),
                duration,
                message: `Meeting booked successfully for ${guestName} on ${new Date(startTime).toLocaleString()}`
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to book meeting'
        };
    }
}
/**
 * Reschedule an existing meeting
 */ async function executeRescheduleMeeting(args) {
    const bookingId = args.bookingId;
    const newStartTime = args.newStartTime;
    if (!bookingId || !newStartTime) {
        return {
            success: false,
            error: 'bookingId and newStartTime are required'
        };
    }
    try {
        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
        if (!convexUrl) {
            return {
                success: false,
                error: 'Convex URL not configured'
            };
        }
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const newBookingId = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].scheduling.rescheduleBooking, {
            id: bookingId,
            newStartTime
        });
        return {
            success: true,
            data: {
                oldBookingId: bookingId,
                newBookingId,
                newStartTime: new Date(newStartTime).toISOString(),
                message: `Meeting rescheduled to ${new Date(newStartTime).toLocaleString()}`
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to reschedule meeting'
        };
    }
}
/**
 * Cancel a scheduled meeting
 */ async function executeCancelMeeting(args) {
    const bookingId = args.bookingId;
    const reason = args.reason;
    if (!bookingId) {
        return {
            success: false,
            error: 'bookingId is required'
        };
    }
    try {
        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
        if (!convexUrl) {
            return {
                success: false,
                error: 'Convex URL not configured'
            };
        }
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].scheduling.updateBookingStatus, {
            id: bookingId,
            status: 'cancelled',
            cancelReason: reason,
            cancelledBy: 'host'
        });
        return {
            success: true,
            data: {
                bookingId,
                message: `Meeting cancelled${reason ? `: ${reason}` : ''}`
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to cancel meeting'
        };
    }
}
// =============================================================================
// Memory Tools (RLM - Recursive Memory Layer)
// These tools enable Claw AI to actively manage memories for the owner
// =============================================================================
/**
 * Search through memories to recall past interactions, decisions, preferences
 */ async function executeRemember(args, context) {
    const query = args.query;
    const memoryType = args.memoryType || 'all';
    const limit = args.limit || 10;
    if (!query) {
        return {
            success: false,
            error: 'Query is required to search memories'
        };
    }
    try {
        const userId = getEffectiveUserId(context);
        const memoryManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$memory$2f$manager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMemoryManager"])();
        // Search both episodic and semantic memories
        const result = await memoryManager.loadRelevantMemories(userId, query, {
            limit,
            includeEpisodic: true,
            includeSemantic: true
        });
        // Filter by memory type if specified
        let episodic = result.episodic;
        if (memoryType !== 'all') {
            episodic = episodic.filter((m)=>m.memoryType === memoryType);
        }
        const memoriesFound = episodic.length + result.semantic.length;
        // Format memories for display
        const formattedEpisodic = episodic.map((m)=>({
                id: m._id,
                type: m.memoryType,
                content: m.content,
                importance: m.importance,
                timestamp: m.timestamp
            }));
        const formattedSemantic = result.semantic.map((m)=>({
                id: m._id,
                category: m.category,
                key: m.key,
                value: m.value,
                confidence: m.confidence
            }));
        return {
            success: true,
            data: {
                query,
                memoriesFound,
                episodic: formattedEpisodic,
                semantic: formattedSemantic,
                contextSummary: result.contextSummary,
                message: memoriesFound > 0 ? `Found ${memoriesFound} relevant memories` : 'No memories found matching your query'
            },
            action: {
                type: 'memory_recalled',
                payload: {
                    query,
                    count: memoriesFound,
                    episodic: formattedEpisodic,
                    semantic: formattedSemantic
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to search memories'
        };
    }
}
/**
 * Recall specific preferences, patterns, or learned facts
 */ async function executeRecallPreference(args, context) {
    const category = args.category;
    const key = args.key;
    if (!category) {
        return {
            success: false,
            error: 'Category is required to recall preferences'
        };
    }
    try {
        const userId = getEffectiveUserId(context);
        const memoryManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$memory$2f$manager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMemoryManager"])();
        // Get semantic memories by category
        const memories = await memoryManager.loadSemanticMemories(userId, [
            category
        ]);
        // Filter by key if provided
        let filtered = memories;
        if (key) {
            filtered = memories.filter((m)=>m.key.includes(key));
        }
        // Sort by confidence
        filtered.sort((a, b)=>b.confidence - a.confidence);
        const formattedMemories = filtered.map((m)=>({
                id: m._id,
                category: m.category,
                key: m.key,
                value: m.value,
                confidence: m.confidence,
                lastUpdated: m.updatedAt
            }));
        return {
            success: true,
            data: {
                category,
                key,
                count: formattedMemories.length,
                preferences: formattedMemories,
                message: formattedMemories.length > 0 ? `Found ${formattedMemories.length} ${category}(s)` : `No ${category}s found${key ? ` matching "${key}"` : ''}`
            },
            action: {
                type: 'memory_recalled',
                payload: {
                    category,
                    key,
                    preferences: formattedMemories
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to recall preferences'
        };
    }
}
/**
 * Store an important memory explicitly
 */ async function executeMemorize(args, context) {
    const content = args.content;
    const memoryType = args.memoryType;
    const importance = args.importance || 0.7;
    const projectId = args.projectId;
    if (!content) {
        return {
            success: false,
            error: 'Content is required to store a memory'
        };
    }
    if (!memoryType) {
        return {
            success: false,
            error: 'Memory type is required'
        };
    }
    // Validate importance is between 0 and 1
    const validImportance = Math.max(0, Math.min(1, importance));
    try {
        const userId = getEffectiveUserId(context);
        const memoryManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$memory$2f$manager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMemoryManager"])();
        const memoryId = await memoryManager.storeEpisodicMemory(userId, content, memoryType, validImportance, projectId, {
            toolsUsed: [
                'memorize'
            ],
            outcome: 'Explicitly stored by user request'
        });
        return {
            success: true,
            data: {
                memoryId,
                content,
                memoryType,
                importance: validImportance,
                message: `Memory stored successfully as a ${memoryType} with importance ${validImportance}`
            },
            action: {
                type: 'memory_stored',
                payload: {
                    memoryId,
                    content,
                    memoryType,
                    importance: validImportance
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to store memory'
        };
    }
}
/**
 * Learn a new fact, preference, skill, or pattern
 */ async function executeLearn(args, context) {
    const category = args.category;
    const key = args.key;
    const value = args.value;
    const confidence = args.confidence || 0.7;
    if (!category || !key || !value) {
        return {
            success: false,
            error: 'Category, key, and value are required to learn something new'
        };
    }
    // Validate confidence is between 0 and 1
    const validConfidence = Math.max(0, Math.min(1, confidence));
    try {
        const userId = getEffectiveUserId(context);
        const memoryManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$memory$2f$manager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMemoryManager"])();
        const memoryId = await memoryManager.upsertSemanticMemory(userId, category, key, value, validConfidence, 'learn_tool');
        return {
            success: true,
            data: {
                memoryId,
                category,
                key,
                value,
                confidence: validConfidence,
                message: `Learned: ${category} "${key}" = "${value}" (confidence: ${validConfidence})`
            },
            action: {
                type: 'memory_learned',
                payload: {
                    memoryId,
                    category,
                    key,
                    value,
                    confidence: validConfidence
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to learn'
        };
    }
}
/**
 * Remove a specific memory
 */ async function executeForget(args, context) {
    const memoryId = args.memoryId;
    const memoryKind = args.memoryKind;
    if (!memoryId) {
        return {
            success: false,
            error: 'Memory ID is required to forget a memory'
        };
    }
    if (!memoryKind || ![
        'episodic',
        'semantic'
    ].includes(memoryKind)) {
        return {
            success: false,
            error: 'Memory kind must be either "episodic" or "semantic"'
        };
    }
    try {
        const userId = getEffectiveUserId(context);
        const memoryManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$memory$2f$manager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMemoryManager"])();
        if (memoryKind === 'episodic') {
            await memoryManager.deleteEpisodicMemory(memoryId, userId);
        } else {
            await memoryManager.deleteSemanticMemory(memoryId, userId);
        }
        return {
            success: true,
            data: {
                memoryId,
                memoryKind,
                message: `Memory deleted successfully`
            },
            action: {
                type: 'memory_deleted',
                payload: {
                    memoryId,
                    memoryKind
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete memory'
        };
    }
}
// =============================================================================
// ∞gent Coding Tools - Full coding agent capabilities
// These tools enable Claw AI to clone repos, read/write files, execute
// commands, and manage git operations.
// @see docs/planning/infinity-agent-coding-integration.md
// =============================================================================
// --------------------------------------------------------------------------
// Working Context Tools
// --------------------------------------------------------------------------
/**
 * Set the active working context
 */ async function executeSetActiveContext(args) {
    const projectId = args.projectId;
    const projectSlug = args.projectSlug;
    const prdId = args.prdId;
    const ticketId = args.ticketId;
    const canvasId = args.canvasId;
    const sandboxId = args.sandboxId;
    const repositoryUrl = args.repositoryUrl;
    // This action will be handled by the frontend to call the Convex mutation
    return {
        success: true,
        data: {
            projectId,
            projectSlug,
            prdId,
            ticketId,
            canvasId,
            sandboxId,
            repositoryUrl,
            message: 'Setting active context...'
        },
        action: {
            type: 'context_updated',
            payload: {
                projectId,
                projectSlug,
                prdId,
                ticketId,
                canvasId,
                sandboxId,
                repositoryUrl,
                convexMutation: 'workingContext:updateActiveContext'
            }
        }
    };
}
/**
 * Get the active working context
 */ async function executeGetActiveContext(args) {
    // This action will be handled by the frontend to query the Convex data
    return {
        success: true,
        data: {
            message: 'Loading active context...'
        },
        action: {
            type: 'context_loaded',
            payload: {
                convexQuery: 'workingContext:getActiveContext'
            }
        }
    };
}
/**
 * Load full context chain from an @mention reference
 */ async function executeLoadContextFromReference(args) {
    const referenceType = args.referenceType;
    const referenceId = args.referenceId;
    if (!referenceType || !referenceId) {
        return {
            success: false,
            error: 'Reference type and ID are required'
        };
    }
    // Map reference type to appropriate Convex query
    const queryMap = {
        ticket: 'workingContext:loadContextFromTicket',
        project: 'workingContext:loadContextFromProject',
        prd: 'workingContext:loadContextFromPRD',
        epic: 'workingContext:loadContextFromEpic',
        canvas: 'workingContext:loadContextFromCanvas',
        memory: 'workingContext:loadContextFromMemory'
    };
    const convexQuery = queryMap[referenceType];
    if (!convexQuery) {
        return {
            success: false,
            error: `Unknown reference type: ${referenceType}`
        };
    }
    return {
        success: true,
        data: {
            referenceType,
            referenceId,
            message: `Loading context for @${referenceType}:${referenceId}...`
        },
        action: {
            type: 'context_loaded',
            payload: {
                referenceType,
                referenceId,
                convexQuery
            }
        }
    };
}
// --------------------------------------------------------------------------
// Repository Operations
// --------------------------------------------------------------------------
/**
 * Clone a GitHub repository to the sandbox
 */ async function executeCloneRepository(args) {
    const url = args.url;
    const branch = args.branch;
    if (!url) {
        return {
            success: false,
            error: 'Repository URL is required'
        };
    }
    // Validate branch name to prevent command injection
    if (branch && !isValidGitBranch(branch)) {
        return {
            success: false,
            error: 'Invalid branch name. Branch names can only contain letters, numbers, dots, slashes, underscores, and hyphens.'
        };
    }
    // Validate URL format
    const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/;
    if (!githubRegex.test(url.replace(/\.git$/, ''))) {
        return {
            success: false,
            error: 'Invalid GitHub repository URL. Expected format: https://github.com/owner/repo'
        };
    }
    // Parse owner and repo from URL
    const match = url.replace(/\.git$/, '').match(/github\.com\/([\w-]+)\/([\w.-]+)/);
    const owner = match?.[1];
    const repo = match?.[2];
    return {
        success: true,
        data: {
            url,
            branch,
            owner,
            repo,
            message: `Cloning ${owner}/${repo}${branch ? ` (branch: ${branch})` : ''}...`
        },
        action: {
            type: 'repo_cloned',
            payload: {
                url,
                branch,
                owner,
                repo,
                sandboxOperation: 'clone'
            }
        }
    };
}
/**
 * List files and directories in the sandbox
 */ async function executeListDirectory(args) {
    const path = args.path;
    const recursive = args.recursive || false;
    const maxDepth = args.maxDepth || 3;
    if (!path) {
        return {
            success: false,
            error: 'Path is required'
        };
    }
    return {
        success: true,
        data: {
            path,
            recursive,
            maxDepth,
            message: `Listing ${recursive ? 'recursively ' : ''}${path}...`
        },
        action: {
            type: 'directory_listed',
            payload: {
                path,
                recursive,
                maxDepth,
                sandboxOperation: 'listDir'
            }
        }
    };
}
/**
 * Search for patterns in the codebase
 */ async function executeSearchCodebase(args) {
    const pattern = args.pattern;
    const path = args.path || '.';
    const filePattern = args.filePattern;
    const caseSensitive = args.caseSensitive || false;
    const maxResults = args.maxResults || 50;
    if (!pattern) {
        return {
            success: false,
            error: 'Search pattern is required'
        };
    }
    return {
        success: true,
        data: {
            pattern,
            path,
            filePattern,
            caseSensitive,
            maxResults,
            message: `Searching for "${pattern}"${filePattern ? ` in ${filePattern} files` : ''}...`
        },
        action: {
            type: 'files_searched',
            payload: {
                pattern,
                path,
                filePattern,
                caseSensitive,
                maxResults,
                sandboxOperation: 'grep'
            }
        }
    };
}
// --------------------------------------------------------------------------
// File Operations
// --------------------------------------------------------------------------
/**
 * Read a file from the sandbox
 */ async function executeReadFile(args) {
    const path = args.path;
    const startLine = args.startLine;
    const endLine = args.endLine;
    if (!path) {
        return {
            success: false,
            error: 'File path is required'
        };
    }
    // SECURITY: Validate path before reading
    const validation = validatePath(path);
    if (!validation.valid) {
        return pathValidationError(validation.error || 'Invalid path');
    }
    return {
        success: true,
        data: {
            path: validation.normalizedPath,
            startLine,
            endLine,
            message: `Reading ${validation.normalizedPath}${startLine ? ` (lines ${startLine}-${endLine || 'end'})` : ''}...`
        },
        action: {
            type: 'file_read',
            payload: {
                path: validation.normalizedPath,
                startLine,
                endLine,
                sandboxOperation: 'readFile'
            }
        }
    };
}
/**
 * Write content to a file in the sandbox
 */ async function executeWriteFile(args) {
    const path = args.path;
    const content = args.content;
    const createDirectories = args.createDirectories ?? true;
    if (!path) {
        return {
            success: false,
            error: 'File path is required'
        };
    }
    if (content === undefined || content === null) {
        return {
            success: false,
            error: 'Content is required'
        };
    }
    // SECURITY: Validate path before writing
    const validation = validatePath(path);
    if (!validation.valid) {
        return pathValidationError(validation.error || 'Invalid path');
    }
    return {
        success: true,
        data: {
            path: validation.normalizedPath,
            contentLength: content.length,
            createDirectories,
            message: `Writing to ${validation.normalizedPath} (${content.length} characters)...`
        },
        action: {
            type: 'file_written',
            payload: {
                path: validation.normalizedPath,
                content,
                createDirectories,
                sandboxOperation: 'writeFile'
            }
        }
    };
}
/**
 * Make surgical edits to a file
 */ async function executeEditFile(args) {
    const path = args.path;
    const oldText = args.oldText;
    const newText = args.newText;
    const replaceAll = args.replaceAll || false;
    if (!path) {
        return {
            success: false,
            error: 'File path is required'
        };
    }
    if (!oldText) {
        return {
            success: false,
            error: 'Old text to replace is required'
        };
    }
    if (newText === undefined || newText === null) {
        return {
            success: false,
            error: 'New text is required'
        };
    }
    // SECURITY: Validate path before editing
    const validation = validatePath(path);
    if (!validation.valid) {
        return pathValidationError(validation.error || 'Invalid path');
    }
    return {
        success: true,
        data: {
            path: validation.normalizedPath,
            replaceAll,
            message: `Editing ${validation.normalizedPath}${replaceAll ? ' (all occurrences)' : ''}...`
        },
        action: {
            type: 'file_written',
            payload: {
                path: validation.normalizedPath,
                oldText,
                newText,
                replaceAll,
                sandboxOperation: 'editFile'
            }
        }
    };
}
/**
 * Delete a file or directory
 */ async function executeDeleteFile(args) {
    const path = args.path;
    const recursive = args.recursive || false;
    if (!path) {
        return {
            success: false,
            error: 'Path is required'
        };
    }
    // SECURITY: Validate path before deleting
    const validation = validatePath(path);
    if (!validation.valid) {
        return pathValidationError(validation.error || 'Invalid path');
    }
    return {
        success: true,
        data: {
            path: validation.normalizedPath,
            recursive,
            message: `Deleting ${validation.normalizedPath}${recursive ? ' (recursive)' : ''}...`
        },
        action: {
            type: 'file_written',
            payload: {
                path: validation.normalizedPath,
                recursive,
                sandboxOperation: 'delete'
            }
        }
    };
}
// --------------------------------------------------------------------------
// Execution
// --------------------------------------------------------------------------
/**
 * Execute a shell command in the sandbox
 *
 * SECURITY: Commands MUST be executed within a sandbox environment.
 * The frontend/sandbox context is responsible for:
 * 1. Ensuring a sandbox is active
 * 2. Setting resource limits (CPU, memory, time)
 * 3. Network isolation (whitelisted domains only)
 * 4. Auto-termination after 30 minutes
 */ async function executeRunCommand(args) {
    const command = args.command;
    const cwd = args.cwd;
    const timeout = Math.min(args.timeout || 60000, 300000); // Max 5 minutes
    if (!command) {
        return {
            success: false,
            error: 'Command is required'
        };
    }
    // SECURITY: Validate command for dangerous patterns
    const validation = validateCommand(command);
    if (!validation.valid) {
        return commandValidationError(validation.error || 'Invalid command');
    }
    // SECURITY: Validate network access in command (Phase 1.5)
    const networkValidation = validateCommandNetworkAccess(command);
    if (!networkValidation.valid) {
        return networkValidationError(networkValidation.error || 'Network access denied');
    }
    // Validate cwd if provided
    if (cwd) {
        const cwdValidation = validatePath(cwd);
        if (!cwdValidation.valid) {
            return pathValidationError(`Working directory: ${cwdValidation.error}`);
        }
    }
    return {
        success: true,
        data: {
            command,
            cwd,
            timeout,
            message: `Running: ${command}${cwd ? ` (in ${cwd})` : ''}...`,
            warning: validation.warning,
            // IMPORTANT: requiresSandbox flag tells frontend this MUST run in sandbox
            requiresSandbox: true
        },
        action: {
            type: 'command_executed',
            payload: {
                command,
                cwd,
                timeout,
                sandboxOperation: 'exec'
            }
        }
    };
}
/**
 * Start a development server
 */ async function executeStartDevServer(args) {
    const command = args.command || 'npm run dev';
    const port = args.port || 3000;
    return {
        success: true,
        data: {
            command,
            port,
            message: `Starting dev server on port ${port}...`
        },
        action: {
            type: 'server_started',
            payload: {
                command,
                port,
                sandboxOperation: 'startServer'
            }
        }
    };
}
/**
 * Get the preview URL for the running sandbox
 */ async function executeGetPreviewUrl(args) {
    return {
        success: true,
        data: {
            message: 'Getting preview URL...'
        },
        action: {
            type: 'preview_ready',
            payload: {
                sandboxOperation: 'getPreviewUrl'
            }
        }
    };
}
// --------------------------------------------------------------------------
// Git Operations
// --------------------------------------------------------------------------
/**
 * Get git status
 */ async function executeGitStatus(args) {
    return {
        success: true,
        data: {
            message: 'Getting git status...'
        },
        action: {
            type: 'git_status',
            payload: {
                sandboxOperation: 'gitStatus'
            }
        }
    };
}
/**
 * Get git diff
 */ async function executeGitDiff(args) {
    const path = args.path;
    const staged = args.staged || false;
    return {
        success: true,
        data: {
            path,
            staged,
            message: `Getting ${staged ? 'staged ' : ''}diff${path ? ` for ${path}` : ''}...`
        },
        action: {
            type: 'git_diff',
            payload: {
                path,
                staged,
                sandboxOperation: 'gitDiff'
            }
        }
    };
}
/**
 * Commit changes
 */ async function executeGitCommit(args) {
    const message = args.message;
    const stageAll = args.stageAll || false;
    if (!message) {
        return {
            success: false,
            error: 'Commit message is required'
        };
    }
    return {
        success: true,
        data: {
            message,
            stageAll,
            commitMessage: message
        },
        action: {
            type: 'git_committed',
            payload: {
                message,
                stageAll,
                sandboxOperation: 'gitCommit'
            }
        }
    };
}
/**
 * Push commits to remote
 */ async function executeGitPush(args) {
    const branch = args.branch;
    const setUpstream = args.setUpstream ?? true;
    return {
        success: true,
        data: {
            branch,
            setUpstream,
            message: `Pushing${branch ? ` to ${branch}` : ''}...`
        },
        action: {
            type: 'git_pushed',
            payload: {
                branch,
                setUpstream,
                sandboxOperation: 'gitPush'
            }
        }
    };
}
/**
 * Create and checkout a new branch
 */ async function executeCreateBranch(args) {
    const name = args.name;
    const fromBranch = args.fromBranch;
    // If no name provided, indicate that it should be auto-generated from context
    const branchInfo = name ? {
        name,
        autoGenerated: false
    } : {
        autoGenerated: true,
        message: 'Branch name will be generated from active ticket context'
    };
    return {
        success: true,
        data: {
            ...branchInfo,
            fromBranch,
            message: name ? `Creating branch ${name}${fromBranch ? ` from ${fromBranch}` : ''}...` : 'Creating branch from ticket context...'
        },
        action: {
            type: 'branch_created',
            payload: {
                name,
                fromBranch,
                autoGenerate: !name,
                sandboxOperation: 'gitBranch'
            }
        }
    };
}
// --------------------------------------------------------------------------
// Coding Task Management
// --------------------------------------------------------------------------
/**
 * Create a new coding task
 */ async function executeCreateCodingTask(args) {
    const title = args.title;
    const description = args.description;
    const projectId = args.projectId;
    const ticketId = args.ticketId;
    const repositoryUrl = args.repositoryUrl;
    if (!title || !description) {
        return {
            success: false,
            error: 'Title and description are required'
        };
    }
    return {
        success: true,
        data: {
            title,
            description,
            projectId,
            ticketId,
            repositoryUrl,
            message: `Creating coding task: ${title}...`
        },
        action: {
            type: 'coding_task_created',
            payload: {
                title,
                description,
                projectId,
                ticketId,
                repositoryUrl,
                agent: 'claude-code',
                convexMutation: 'workingContext:createCodingTask'
            }
        }
    };
}
/**
 * Update a coding task
 */ async function executeUpdateCodingTask(args) {
    const taskId = args.taskId;
    const status = args.status;
    const filesModified = args.filesModified;
    const commitSha = args.commitSha;
    if (!taskId) {
        return {
            success: false,
            error: 'Task ID is required'
        };
    }
    const updates = {};
    if (status) updates.status = status;
    if (filesModified) updates.filesModified = filesModified;
    if (commitSha) updates.commitSha = commitSha;
    return {
        success: true,
        data: {
            taskId,
            updates,
            message: `Updating coding task ${taskId}...`
        },
        action: {
            type: 'coding_task_updated',
            payload: {
                taskId,
                ...updates,
                convexMutation: 'workingContext:updateCodingTaskStatus'
            }
        }
    };
}
/**
 * List coding tasks
 */ async function executeListCodingTasks(args) {
    const status = args.status;
    const limit = args.limit || 10;
    return {
        success: true,
        data: {
            status,
            limit,
            message: status ? `Loading ${status} coding tasks...` : 'Loading coding tasks...'
        },
        action: {
            type: 'render_component',
            payload: {
                componentType: 'codingTasks',
                status,
                limit,
                convexQuery: 'workingContext:listCodingTasks'
            }
        }
    };
}
// =============================================================================
// Cron Job Tool Executors
// =============================================================================
/**
 * Parse natural language schedule time into schedule configuration
 */ function parseScheduleTime(scheduleType, scheduleTime, daysOfWeek) {
    const now = new Date();
    switch(scheduleType){
        case 'once':
            {
                if (!scheduleTime) {
                    // Default to 1 hour from now
                    return {
                        runAt: Date.now() + 60 * 60 * 1000
                    };
                }
                // Try parsing as ISO date or relative time
                const parsed = Date.parse(scheduleTime);
                if (!isNaN(parsed)) {
                    return {
                        runAt: parsed
                    };
                }
                // Handle relative times like "in 2 hours", "in 30 minutes"
                const relativeMatch = scheduleTime.match(/in\s+(\d+)\s+(minute|hour|day)s?/i);
                if (relativeMatch) {
                    const amount = parseInt(relativeMatch[1]);
                    const unit = relativeMatch[2].toLowerCase();
                    const multipliers = {
                        minute: 60 * 1000,
                        hour: 60 * 60 * 1000,
                        day: 24 * 60 * 60 * 1000
                    };
                    return {
                        runAt: Date.now() + amount * multipliers[unit]
                    };
                }
                // Handle "tomorrow at 9am" style
                const tomorrowMatch = scheduleTime.match(/tomorrow\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
                if (tomorrowMatch) {
                    let hour = parseInt(tomorrowMatch[1]);
                    const minute = tomorrowMatch[2] ? parseInt(tomorrowMatch[2]) : 0;
                    const ampm = tomorrowMatch[3]?.toLowerCase();
                    if (ampm === 'pm' && hour < 12) hour += 12;
                    if (ampm === 'am' && hour === 12) hour = 0;
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(hour, minute, 0, 0);
                    return {
                        runAt: tomorrow.getTime()
                    };
                }
                return {
                    runAt: Date.now() + 60 * 60 * 1000
                };
            }
        case 'interval':
            {
                // Parse interval like "30", "60", "every 2 hours"
                if (!scheduleTime) return {
                    intervalMinutes: 60
                };
                const intervalMatch = scheduleTime.match(/(\d+)\s*(minute|hour)?s?/i);
                if (intervalMatch) {
                    const amount = parseInt(intervalMatch[1]);
                    const unit = intervalMatch[2]?.toLowerCase() || 'minute';
                    return {
                        intervalMinutes: unit === 'hour' ? amount * 60 : amount
                    };
                }
                return {
                    intervalMinutes: 60
                };
            }
        case 'daily':
            {
                // Parse time like "9:00", "9am", "14:30"
                if (!scheduleTime) return {
                    hour: 9,
                    minute: 0
                };
                const timeMatch = scheduleTime.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
                if (timeMatch) {
                    let hour = parseInt(timeMatch[1]);
                    const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
                    const ampm = timeMatch[3]?.toLowerCase();
                    if (ampm === 'pm' && hour < 12) hour += 12;
                    if (ampm === 'am' && hour === 12) hour = 0;
                    return {
                        hour,
                        minute
                    };
                }
                return {
                    hour: 9,
                    minute: 0
                };
            }
        case 'weekly':
            {
                // Parse time and use provided daysOfWeek
                const timeConfig = parseScheduleTime('daily', scheduleTime);
                return {
                    hour: timeConfig.hour,
                    minute: timeConfig.minute,
                    daysOfWeek: daysOfWeek || [
                        1
                    ]
                };
            }
        case 'cron':
            {
                return {
                    cronExpression: scheduleTime || '0 9 * * *'
                };
            }
        default:
            return {
                hour: 9,
                minute: 0
            };
    }
}
/**
 * Create a new scheduled cron job
 */ async function executeCreateCronJob(args, context) {
    const name = args.name;
    const description = args.description;
    const scheduleType = args.scheduleType;
    const scheduleTime = args.scheduleTime;
    const daysOfWeek = args.daysOfWeek;
    const actionType = args.actionType;
    const prompt = args.prompt;
    const emailSubject = args.emailSubject;
    const emailBody = args.emailBody;
    const recipientEmail = args.recipientEmail;
    const webhookUrl = args.webhookUrl;
    const deliveryChannel = args.deliveryChannel;
    const timezone = args.timezone || 'America/Los_Angeles';
    if (!name) {
        return {
            success: false,
            error: 'Job name is required'
        };
    }
    if (!scheduleType || ![
        'once',
        'interval',
        'daily',
        'weekly',
        'cron'
    ].includes(scheduleType)) {
        return {
            success: false,
            error: 'Valid schedule type is required: once, interval, daily, weekly, or cron'
        };
    }
    if (!actionType || ![
        'ai_message',
        'notification',
        'email',
        'webhook',
        'memory_snapshot'
    ].includes(actionType)) {
        return {
            success: false,
            error: 'Valid action type is required: ai_message, notification, email, webhook, or memory_snapshot'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const userId = getEffectiveUserId(context);
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const scheduleConfig = {
            ...parseScheduleTime(scheduleType, scheduleTime, daysOfWeek),
            timezone
        };
        const actionPayload = {};
        if (prompt) actionPayload.prompt = prompt;
        if (emailSubject) actionPayload.subject = emailSubject;
        if (emailBody) actionPayload.body = emailBody;
        if (recipientEmail) actionPayload.recipientEmail = recipientEmail;
        if (webhookUrl) actionPayload.webhookUrl = webhookUrl;
        const deliverTo = deliveryChannel ? {
            channel: deliveryChannel
        } : undefined;
        const result = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].userCronJobs.createJob, {
            userId,
            name,
            description,
            scheduleType: scheduleType,
            scheduleConfig,
            actionType: actionType,
            actionPayload,
            deliverTo
        });
        return {
            success: true,
            data: {
                jobId: result.jobId,
                name,
                scheduleType,
                actionType,
                message: `Created scheduled job "${name}" (${result.jobId})`
            },
            action: {
                type: 'cron_job_created',
                payload: {
                    jobId: result.jobId,
                    name,
                    scheduleType,
                    actionType
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create cron job'
        };
    }
}
/**
 * List user's cron jobs
 */ async function executeListCronJobs(args, context) {
    const includeInactive = args.includeInactive;
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const userId = getEffectiveUserId(context);
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const jobs = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].userCronJobs.getUserJobs, {
            userId,
            includeInactive: includeInactive ?? false
        });
        const jobSummaries = jobs.map((job)=>({
                jobId: job.jobId,
                name: job.name,
                description: job.description,
                scheduleType: job.scheduleType,
                actionType: job.actionType,
                isActive: job.isActive,
                nextRunAt: job.nextRunAt ? new Date(job.nextRunAt).toISOString() : null,
                lastRunAt: job.lastRunAt ? new Date(job.lastRunAt).toISOString() : null,
                lastRunStatus: job.lastRunStatus,
                runCount: job.runCount,
                successCount: job.successCount,
                errorCount: job.errorCount
            }));
        return {
            success: true,
            data: {
                jobs: jobSummaries,
                count: jobs.length,
                message: jobs.length > 0 ? `Found ${jobs.length} scheduled job${jobs.length === 1 ? '' : 's'}` : 'No scheduled jobs found'
            },
            action: {
                type: 'cron_jobs_listed',
                payload: {
                    count: jobs.length,
                    jobs: jobSummaries
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to list cron jobs'
        };
    }
}
/**
 * Toggle a cron job active/inactive
 */ async function executeToggleCronJob(args) {
    const jobId = args.jobId;
    if (!jobId) {
        return {
            success: false,
            error: 'Job ID is required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const result = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].userCronJobs.toggleJob, {
            jobId
        });
        return {
            success: true,
            data: {
                jobId,
                isActive: result.isActive,
                message: `Job ${jobId} is now ${result.isActive ? 'active' : 'paused'}`
            },
            action: {
                type: 'cron_job_updated',
                payload: {
                    jobId,
                    isActive: result.isActive
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to toggle cron job'
        };
    }
}
/**
 * Delete a cron job
 */ async function executeDeleteCronJob(args) {
    const jobId = args.jobId;
    if (!jobId) {
        return {
            success: false,
            error: 'Job ID is required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].userCronJobs.deleteJob, {
            jobId
        });
        return {
            success: true,
            data: {
                jobId,
                message: `Deleted scheduled job ${jobId}`
            },
            action: {
                type: 'cron_job_deleted',
                payload: {
                    jobId
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete cron job'
        };
    }
}
// =============================================================================
// Conversation Compaction Executors
// =============================================================================
/**
 * Compact a conversation by summarizing older messages
 */ async function executeCompactConversation(args, context) {
    const sessionId = args.sessionId;
    const keepRecentCount = args.keepRecentCount || 10;
    const instructions = args.instructions;
    if (!sessionId) {
        return {
            success: false,
            error: 'Session ID is required'
        };
    }
    try {
        const userId = getEffectiveUserId(context);
        // Call the compact API endpoint
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/chat/compact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId,
                keepRecentCount,
                instructions,
                // Note: messages would be passed by the client hook, not here
                // This tool is more for triggering compaction from the AI side
                messages: []
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                error: errorData.error || 'Compaction request failed'
            };
        }
        const result = await response.json();
        // ========================================================================
        // MEMORY INTEGRATION - Extract memories from compaction
        // ========================================================================
        let episodicMemoryId;
        const semanticMemoryIds = [];
        try {
            const memoryManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$memory$2f$manager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMemoryManager"])();
            // 1. Create episodic memory for the conversation summary
            if (result.summary) {
                episodicMemoryId = await memoryManager.storeEpisodicMemory(userId, result.summary, 'milestone', 0.6, undefined, {
                    toolsUsed: [
                        'compact_conversation'
                    ],
                    outcome: `Auto-extracted from conversation compaction (${result.originalMessageCount} messages, topics: ${result.topics?.join(', ') || 'none'})`
                });
            }
            // 2. Extract semantic memories from decisions
            if (result.decisions && Array.isArray(result.decisions)) {
                for (const decision of result.decisions){
                    const decisionText = typeof decision === 'string' ? decision : JSON.stringify(decision);
                    const memId = await memoryManager.upsertSemanticMemory(userId, 'preference', `decision_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, decisionText, 0.8, `compaction_${result.compactionId}`);
                    if (memId) semanticMemoryIds.push(memId);
                }
            }
            // 3. Extract semantic memories from key points (as facts)
            if (result.keyPoints && Array.isArray(result.keyPoints)) {
                for (const keyPoint of result.keyPoints){
                    const keyPointText = typeof keyPoint === 'string' ? keyPoint : JSON.stringify(keyPoint);
                    const memId = await memoryManager.upsertSemanticMemory(userId, 'fact', `keypoint_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, keyPointText, 0.7, `compaction_${result.compactionId}`);
                    if (memId) semanticMemoryIds.push(memId);
                }
            }
        } catch (memoryError) {
            // Log but don't fail compaction if memory extraction fails
            console.error('Memory extraction from compaction failed:', memoryError);
        }
        return {
            success: true,
            data: {
                compactionId: result.compactionId,
                summary: result.summary,
                keyPoints: result.keyPoints,
                decisions: result.decisions,
                openQuestions: result.openQuestions,
                topics: result.topics,
                originalMessageCount: result.originalMessageCount,
                tokensSaved: result.tokensSaved,
                message: `Compacted ${result.originalMessageCount} messages, saved ~${result.tokensSaved} tokens`,
                // Memory integration results
                memoryExtracted: true,
                episodicMemoryId,
                semanticMemoryCount: semanticMemoryIds.length
            },
            action: {
                type: 'conversation_compacted',
                payload: {
                    compactionId: result.compactionId,
                    summary: result.summary,
                    keyPoints: result.keyPoints,
                    tokensSaved: result.tokensSaved,
                    episodicMemoryId,
                    semanticMemoryIds
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to compact conversation'
        };
    }
}
/**
 * Get existing compaction summary for a session
 */ async function executeGetCompactionSummary(args) {
    const sessionId = args.sessionId;
    if (!sessionId) {
        return {
            success: false,
            error: 'Session ID is required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const compaction = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].compaction.getLatestCompaction, {
            sessionId
        });
        if (!compaction) {
            return {
                success: true,
                data: {
                    found: false,
                    message: 'No compaction found for this session'
                }
            };
        }
        return {
            success: true,
            data: {
                found: true,
                compactionId: compaction.compactionId,
                summary: compaction.summary,
                keyPoints: compaction.keyPoints,
                decisions: compaction.decisions,
                openQuestions: compaction.openQuestions,
                topics: compaction.topics,
                originalMessageCount: compaction.originalMessageCount,
                createdAt: new Date(compaction.createdAt).toISOString(),
                message: `Found compaction from ${new Date(compaction.createdAt).toLocaleDateString()}`
            },
            action: {
                type: 'compaction_retrieved',
                payload: {
                    compactionId: compaction.compactionId,
                    summary: compaction.summary,
                    keyPoints: compaction.keyPoints
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get compaction summary'
        };
    }
}
// ============================================================================
// CHANNEL INTEGRATION TOOLS - WhatsApp, Telegram, iMessage, Slack, Discord
// ============================================================================
/**
 * List all connected channel integrations
 */ async function executeListChannelIntegrations(args, context) {
    const includeDisabled = args.includeDisabled || false;
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const userId = getEffectiveUserId(context);
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const integrations = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].channels.getUserIntegrations, {
            userId
        });
        // Filter based on includeDisabled
        const filtered = includeDisabled ? integrations : integrations.filter((i)=>i.settings?.enabled);
        return {
            success: true,
            data: {
                integrations: filtered.map((i)=>({
                        id: i._id,
                        platform: i.platform,
                        enabled: i.settings?.enabled ?? false,
                        status: i.connectionStatus,
                        identifier: i.platformUserId
                    })),
                count: filtered.length,
                message: `Found ${filtered.length} channel integration${filtered.length !== 1 ? 's' : ''}`
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to list channel integrations'
        };
    }
}
/**
 * Get conversations from connected channels
 */ async function executeGetChannelConversations(args, context) {
    const platform = args.platform;
    const limit = args.limit || 20;
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const userId = getEffectiveUserId(context);
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const conversations = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].channels.getConversations, {
            userId
        });
        // Filter by platform if specified and limit results
        const filtered = conversations.filter((c)=>!platform || c.platform === platform).slice(0, limit);
        return {
            success: true,
            data: {
                conversations: filtered.map((c)=>({
                        recipientId: c.platformUserId,
                        recipientName: c.platformUsername || c.platformUserId,
                        platform: c.platform,
                        lastMessage: c.lastMessage?.content || '',
                        lastMessageAt: c.lastMessage ? new Date(c.lastMessage._creationTime).toISOString() : '',
                        unreadCount: c.unreadCount ?? 0,
                        integrationId: c.integrationId
                    })),
                count: conversations.length,
                message: `Found ${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}${platform ? ` on ${platform}` : ''}`
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get channel conversations'
        };
    }
}
/**
 * Send a message via a connected channel
 */ async function executeSendChannelMessage(args, context) {
    const integrationId = args.integrationId;
    const recipientId = args.recipientId;
    const content = args.content;
    const messageType = args.messageType || 'text';
    if (!integrationId || !content) {
        return {
            success: false,
            error: 'Integration ID and content are required'
        };
    }
    // SECURITY: Validate message content for phishing/social engineering
    const contentValidation = validateMessageContent(content);
    if (!contentValidation.valid) {
        return messageValidationError(contentValidation.error || 'Invalid message content');
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const userId = getEffectiveUserId(context);
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        // First, get the integration to determine the platform and credentials
        const integration = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].channels.getIntegration, {
            integrationId
        });
        if (!integration) {
            return {
                success: false,
                error: 'Integration not found'
            };
        }
        // Check if integration is enabled
        if (!integration.settings.enabled) {
            return {
                success: false,
                error: 'Integration is disabled'
            };
        }
        // Use the recipient from the integration if not provided
        const targetRecipient = recipientId || integration.platformUserId;
        // Send the message via the outbound router
        const sendResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$channels$2f$outbound$2d$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendMessage"])({
            integrationId,
            platform: integration.platform,
            recipientId: targetRecipient,
            content,
            messageType: messageType
        }, integration.credentials);
        if (!sendResult.success) {
            return {
                success: false,
                error: sendResult.error || 'Failed to send message'
            };
        }
        // Log the outbound message
        // NOTE: Rate limiting should be enforced in the Convex mutation (per-recipient limits)
        const { messageId } = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].channels.logOutboundMessage, {
            integrationId,
            userId,
            platform: integration.platform,
            platformMessageId: sendResult.platformMessageId,
            content,
            messageType: messageType,
            toolsUsed: [
                'send_channel_message'
            ]
        });
        // Include any warnings about suspicious URLs
        const warnings = contentValidation.warnings;
        return {
            success: true,
            data: {
                messageId,
                platformMessageId: sendResult.platformMessageId,
                sent: true,
                platform: integration.platform,
                recipientId: targetRecipient,
                content: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
                message: `Message sent successfully via ${integration.platform}`,
                warnings
            },
            action: {
                type: 'message_sent',
                payload: {
                    messageId,
                    integrationId,
                    recipientId: targetRecipient,
                    platform: integration.platform
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send channel message'
        };
    }
}
/**
 * Search messages across all connected channels
 */ async function executeSearchChannelMessages(args, context) {
    const query = args.query;
    const platform = args.platform;
    const limit = args.limit || 20;
    if (!query) {
        return {
            success: false,
            error: 'Search query is required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const userId = getEffectiveUserId(context);
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const messages = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].channels.searchMessages, {
            userId,
            query,
            limit
        });
        // Filter by platform if specified
        const filtered = platform ? messages.filter((m)=>m.platform === platform) : messages;
        return {
            success: true,
            data: {
                messages: filtered.map((m)=>({
                        id: m._id,
                        platform: m.platform,
                        direction: m.direction,
                        content: m.content,
                        timestamp: new Date(m._creationTime).toISOString(),
                        contact: m.integrationId
                    })),
                count: messages.length,
                query,
                message: `Found ${messages.length} message${messages.length !== 1 ? 's' : ''} matching "${query}"`
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to search channel messages'
        };
    }
}
// =============================================================================
// ERV DIMENSION TOOLS - Create, navigate, and search dimensions/entities
// =============================================================================
/**
 * Preset dimension configurations for reference
 */ const PRESET_DIMENSIONS = [
    {
        id: 'feed',
        name: 'Feed',
        icon: '📰',
        description: 'Chronological stream of all entities'
    },
    {
        id: 'kanban',
        name: 'Kanban',
        icon: '📋',
        description: 'Ticket and task management board'
    },
    {
        id: 'graph',
        name: 'Graph',
        icon: '🕸️',
        description: 'Entity relationship visualization'
    },
    {
        id: 'graph-3d',
        name: 'Graph 3D',
        icon: '🌐',
        description: 'Immersive 3D relationship space'
    },
    {
        id: 'calendar',
        name: 'Calendar',
        icon: '📅',
        description: 'Time-based event visualization'
    },
    {
        id: 'grid',
        name: 'Grid',
        icon: '🖼️',
        description: 'Gallery-style entity browser'
    },
    {
        id: 'table',
        name: 'Table',
        icon: '📊',
        description: 'Spreadsheet-like data view'
    },
    {
        id: 'ipod',
        name: 'iPod',
        icon: '🎵',
        description: 'Music-centric navigation'
    },
    {
        id: 'quest-log',
        name: 'Quest Log',
        icon: '⚔️',
        description: 'Gamified task progression'
    },
    {
        id: 'skill-tree',
        name: 'Skill Tree',
        icon: '🌳',
        description: 'Interconnected skill progression'
    }
];
/**
 * Map metaphors to dimension configurations
 */ const METAPHOR_CONFIGS = {
    river: {
        container: 'frame',
        arrangement: 'list',
        entityShape: 'square',
        connectionStyle: 'none',
        gradient: 'from-blue-500 to-cyan-500'
    },
    board: {
        container: 'panel',
        arrangement: 'grid',
        entityShape: 'square',
        connectionStyle: 'none',
        gradient: 'from-violet-500 to-purple-500'
    },
    constellation: {
        container: 'frame',
        arrangement: 'graph',
        entityShape: 'circle',
        connectionStyle: 'curve',
        gradient: 'from-emerald-500 to-green-500'
    },
    solar: {
        container: 'frame',
        arrangement: 'orbit',
        entityShape: 'circle',
        connectionStyle: 'glow',
        gradient: 'from-pink-500 to-rose-500'
    },
    timeline: {
        container: 'panel',
        arrangement: 'list',
        entityShape: 'square',
        connectionStyle: 'line',
        gradient: 'from-amber-500 to-orange-500'
    },
    mosaic: {
        container: 'frame',
        arrangement: 'grid',
        entityShape: 'square',
        connectionStyle: 'none',
        gradient: 'from-cyan-500 to-teal-500'
    },
    ledger: {
        container: 'panel',
        arrangement: 'list',
        entityShape: 'square',
        connectionStyle: 'none',
        gradient: 'from-slate-500 to-zinc-500'
    },
    vinyl: {
        container: 'card',
        arrangement: 'flow',
        entityShape: 'square',
        connectionStyle: 'none',
        gradient: 'from-indigo-500 to-blue-500'
    },
    dungeon: {
        container: 'panel',
        arrangement: 'tree',
        entityShape: 'hexagon',
        connectionStyle: 'arrow',
        gradient: 'from-red-500 to-orange-500'
    },
    tree: {
        container: 'frame',
        arrangement: 'tree',
        entityShape: 'circle',
        connectionStyle: 'curve',
        gradient: 'from-emerald-500 to-teal-500'
    }
};
/**
 * Create a custom dimension
 */ async function executeCreateDimension(args) {
    const name = args.name;
    const metaphor = args.metaphor;
    const arrangement = args.arrangement;
    const entityTypes = args.entityTypes;
    const description = args.description;
    if (!name || !metaphor || !arrangement) {
        return {
            success: false,
            error: 'Name, metaphor, and arrangement are required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        // Get metaphor configuration
        const metaphorConfig = METAPHOR_CONFIGS[metaphor] || METAPHOR_CONFIGS['mosaic'];
        // Build dimension config
        const config = {
            container: metaphorConfig.container,
            arrangement: arrangement,
            entityShape: metaphorConfig.entityShape,
            connectionStyle: metaphorConfig.connectionStyle,
            decorations: [
                {
                    type: 'shadow'
                }
            ],
            interactions: [
                {
                    type: 'click',
                    action: 'navigate'
                },
                {
                    type: 'longpress',
                    action: 'reveal'
                }
            ],
            transition: 'morph',
            filter: entityTypes?.length ? {
                entityTypes
            } : undefined
        };
        const result = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.createDimension, {
            name,
            description: description || `Custom ${metaphor} dimension`,
            metaphor,
            config: JSON.stringify(config),
            icon: METAPHOR_CONFIGS[metaphor] ? '✨' : '📐',
            gradient: metaphorConfig.gradient,
            allowedEntityTypes: entityTypes
        });
        return {
            success: true,
            data: {
                dimensionId: result.dimensionId,
                name,
                metaphor,
                arrangement,
                entityTypes: entityTypes || 'all',
                message: `Created dimension "${name}" with ${metaphor} metaphor`
            },
            action: {
                type: 'dimension_created',
                payload: {
                    dimensionId: result.dimensionId,
                    name,
                    metaphor,
                    navigateTo: `/d/${result.dimensionId}`
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create dimension'
        };
    }
}
/**
 * Navigate to a dimension
 */ function executeNavigateToDimension(args) {
    const dimensionId = args.dimensionId;
    if (!dimensionId) {
        return {
            success: false,
            error: 'Dimension ID is required'
        };
    }
    // Check if it's a preset
    const preset = PRESET_DIMENSIONS.find((d)=>d.id === dimensionId);
    const name = preset?.name || dimensionId;
    return {
        success: true,
        data: {
            dimensionId,
            name,
            isPreset: !!preset,
            message: `Navigating to ${name} dimension...`
        },
        action: {
            type: 'dimension_navigated',
            payload: {
                dimensionId,
                name,
                navigateTo: `/d/${dimensionId}`
            }
        }
    };
}
/**
 * List available dimensions
 */ async function executeListDimensions(args) {
    const includePresets = args.includePresets !== false;
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        // Return just presets if no Convex connection
        return {
            success: true,
            data: {
                presets: PRESET_DIMENSIONS,
                custom: [],
                message: `${PRESET_DIMENSIONS.length} preset dimensions available`
            },
            action: {
                type: 'dimensions_listed',
                payload: {
                    presets: PRESET_DIMENSIONS,
                    custom: []
                }
            }
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const dimensions = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.listDimensions, {
            includePresets
        });
        // Separate presets and custom
        const custom = dimensions.filter((d)=>!d.isPreset).map((d)=>({
                id: d.dimensionId,
                name: d.name,
                icon: d.icon || '📐',
                description: d.description,
                metaphor: d.metaphor
            }));
        return {
            success: true,
            data: {
                presets: includePresets ? PRESET_DIMENSIONS : [],
                custom,
                totalCount: (includePresets ? PRESET_DIMENSIONS.length : 0) + custom.length,
                message: `Found ${custom.length} custom dimension${custom.length !== 1 ? 's' : ''} and ${PRESET_DIMENSIONS.length} presets`
            },
            action: {
                type: 'dimensions_listed',
                payload: {
                    presets: includePresets ? PRESET_DIMENSIONS : [],
                    custom
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to list dimensions'
        };
    }
}
/**
 * Search entities in the ERV system
 */ async function executeSearchEntities(args) {
    const query = args.query;
    const entityTypes = args.entityTypes;
    const limit = args.limit || 20;
    if (!query) {
        return {
            success: false,
            error: 'Search query is required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const entities = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.searchEntities, {
            query,
            entityTypes: entityTypes,
            limit
        });
        // Format results
        const results = entities.map((e)=>{
            let parsedData = {};
            try {
                parsedData = JSON.parse(e.data);
            } catch  {
            // ignore parse errors
            }
            return {
                entityId: e.entityId,
                type: e.entityType,
                name: e.name,
                tags: e.tags,
                importance: e.importance,
                // Include some type-specific fields
                ...e.entityType === 'Ticket' && {
                    ticketId: parsedData.ticketId,
                    status: parsedData.status,
                    priority: parsedData.priority
                },
                ...e.entityType === 'Project' && {
                    status: parsedData.status
                },
                ...e.entityType === 'Track' && {
                    artist: parsedData.artist,
                    album: parsedData.album
                }
            };
        });
        return {
            success: true,
            data: {
                results,
                count: results.length,
                query,
                entityTypes: entityTypes || 'all',
                message: `Found ${results.length} entit${results.length !== 1 ? 'ies' : 'y'} matching "${query}"`
            },
            action: {
                type: 'entities_searched',
                payload: {
                    query,
                    count: results.length,
                    results: results.slice(0, 5)
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to search entities'
        };
    }
}
// =============================================================================
// Video/Remotion Tool Handlers
// =============================================================================
// In-memory storage for video compositions (would be Convex in production)
const videoCompositions = new Map();
const VIDEO_PRESETS = {
    'instagram-story': {
        width: 1080,
        height: 1920,
        fps: 30
    },
    'instagram-post': {
        width: 1080,
        height: 1080,
        fps: 30
    },
    'instagram-reel': {
        width: 1080,
        height: 1920,
        fps: 30
    },
    'tiktok': {
        width: 1080,
        height: 1920,
        fps: 30
    },
    'youtube': {
        width: 1920,
        height: 1080,
        fps: 30
    },
    'youtube-short': {
        width: 1080,
        height: 1920,
        fps: 30
    },
    'twitter': {
        width: 1280,
        height: 720,
        fps: 30
    },
    '1080p': {
        width: 1920,
        height: 1080,
        fps: 30
    },
    '720p': {
        width: 1280,
        height: 720,
        fps: 30
    },
    '4k': {
        width: 3840,
        height: 2160,
        fps: 30
    },
    'square': {
        width: 1080,
        height: 1080,
        fps: 30
    },
    'portrait': {
        width: 1080,
        height: 1350,
        fps: 30
    }
};
function executeCreateVideoComposition(args) {
    const name = args.name;
    const type = args.type;
    const presetKey = args.preset || '1080p';
    const durationSeconds = args.durationSeconds || 30;
    const backgroundColor = args.backgroundColor;
    const backgroundGradient = args.backgroundGradient;
    if (!name) {
        return {
            success: false,
            error: 'Composition name is required'
        };
    }
    const preset = VIDEO_PRESETS[presetKey] || VIDEO_PRESETS['1080p'];
    const id = `video-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const now = Date.now();
    const composition = {
        id,
        name,
        type,
        preset: presetKey,
        width: preset.width,
        height: preset.height,
        fps: preset.fps,
        durationInFrames: durationSeconds * preset.fps,
        layers: [],
        backgroundColor: backgroundColor || '#000000',
        backgroundGradient,
        createdAt: now,
        updatedAt: now
    };
    videoCompositions.set(id, composition);
    return {
        success: true,
        data: {
            compositionId: id,
            name,
            type,
            preset: presetKey,
            dimensions: `${preset.width}x${preset.height}`,
            fps: preset.fps,
            durationSeconds,
            durationInFrames: composition.durationInFrames,
            message: `Created ${type} composition "${name}" (${preset.width}x${preset.height} @ ${preset.fps}fps, ${durationSeconds}s)`
        },
        action: {
            type: 'video_composition_created',
            payload: {
                compositionId: id,
                composition: {
                    name,
                    type,
                    width: preset.width,
                    height: preset.height,
                    durationSeconds
                }
            }
        }
    };
}
function executeAddTextOverlay(args) {
    const compositionId = args.compositionId;
    const text = args.text;
    const position = args.position || 'center';
    const startTime = args.startTime || 0;
    const duration = args.duration;
    const fontSize = args.fontSize || 32;
    const color = args.color || '#ffffff';
    const animation = args.animation || 'fade';
    if (!compositionId) {
        return {
            success: false,
            error: 'Composition ID is required'
        };
    }
    if (!text) {
        return {
            success: false,
            error: 'Text content is required'
        };
    }
    const composition = videoCompositions.get(compositionId);
    if (!composition) {
        return {
            success: false,
            error: `Composition not found: ${compositionId}`
        };
    }
    const layerId = `text-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const startFrame = Math.floor(startTime * composition.fps);
    const durationInFrames = duration ? Math.floor(duration * composition.fps) : composition.durationInFrames - startFrame;
    const layer = {
        id: layerId,
        type: 'text',
        text,
        position,
        startFrame,
        durationInFrames,
        fontSize,
        color,
        animationIn: animation,
        animationOut: 'fade',
        zIndex: composition.layers.length + 1
    };
    composition.layers.push(layer);
    composition.updatedAt = Date.now();
    return {
        success: true,
        data: {
            layerId,
            compositionId,
            text: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
            position,
            startTime,
            duration: duration || (composition.durationInFrames - startFrame) / composition.fps,
            animation,
            message: `Added text overlay "${text.slice(0, 30)}${text.length > 30 ? '...' : ''}" at ${position}`
        },
        action: {
            type: 'video_layer_added',
            payload: {
                compositionId,
                layerId,
                layerType: 'text',
                preview: text.slice(0, 50)
            }
        }
    };
}
function executeAddLyricsToVideo(args) {
    const compositionId = args.compositionId;
    const audioSrc = args.audioSrc;
    const lyrics = args.lyrics;
    const style = args.style || 'karaoke';
    const fontFamily = args.fontFamily || 'Inter, sans-serif';
    const color = args.color || '#ffffff';
    const highlightColor = args.highlightColor || '#ffcc00';
    const position = args.position || 'center';
    if (!compositionId) {
        return {
            success: false,
            error: 'Composition ID is required'
        };
    }
    if (!audioSrc) {
        return {
            success: false,
            error: 'Audio source is required'
        };
    }
    if (!lyrics || lyrics.length === 0) {
        return {
            success: false,
            error: 'Lyrics array is required with timing information'
        };
    }
    const composition = videoCompositions.get(compositionId);
    if (!composition) {
        return {
            success: false,
            error: `Composition not found: ${compositionId}`
        };
    }
    // Set audio
    composition.audio = {
        src: audioSrc,
        volume: 1
    };
    // Add lyrics layer
    const layerId = `lyrics-${Date.now()}`;
    const maxEndTime = Math.max(...lyrics.map((l)=>l.endTime));
    const durationInFrames = Math.ceil(maxEndTime * composition.fps);
    // Update composition duration if lyrics are longer
    if (durationInFrames > composition.durationInFrames) {
        composition.durationInFrames = durationInFrames;
    }
    const layer = {
        id: layerId,
        type: 'lyrics',
        lyrics,
        audioSrc,
        style,
        fontFamily,
        fontSize: 48,
        color,
        highlightColor,
        position,
        startFrame: 0,
        durationInFrames: composition.durationInFrames,
        zIndex: composition.layers.length + 1
    };
    composition.layers.push(layer);
    composition.updatedAt = Date.now();
    return {
        success: true,
        data: {
            layerId,
            compositionId,
            lyricCount: lyrics.length,
            style,
            audioSrc,
            totalDuration: maxEndTime,
            message: `Added ${lyrics.length} lyric lines with ${style} style. Total duration: ${maxEndTime.toFixed(1)}s`
        },
        action: {
            type: 'video_lyrics_added',
            payload: {
                compositionId,
                layerId,
                lyricCount: lyrics.length,
                style,
                previewLyrics: lyrics.slice(0, 3).map((l)=>l.text)
            }
        }
    };
}
function executeAddMediaToVideo(args) {
    const compositionId = args.compositionId;
    const mediaSrc = args.mediaSrc;
    const mediaType = args.mediaType;
    const startTime = args.startTime || 0;
    const duration = args.duration;
    const position = args.position || {
        x: 0,
        y: 0
    };
    const scale = args.scale || 1;
    const opacity = args.opacity ?? 1;
    const objectFit = args.objectFit || 'cover';
    if (!compositionId) {
        return {
            success: false,
            error: 'Composition ID is required'
        };
    }
    if (!mediaSrc) {
        return {
            success: false,
            error: 'Media source is required'
        };
    }
    const composition = videoCompositions.get(compositionId);
    if (!composition) {
        return {
            success: false,
            error: `Composition not found: ${compositionId}`
        };
    }
    const layerId = `${mediaType}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const startFrame = Math.floor(startTime * composition.fps);
    const durationInFrames = duration ? Math.floor(duration * composition.fps) : composition.durationInFrames - startFrame;
    const layer = {
        id: layerId,
        type: mediaType,
        src: mediaSrc,
        position,
        startFrame,
        durationInFrames,
        scale: {
            x: scale,
            y: scale
        },
        opacity,
        objectFit,
        zIndex: composition.layers.length + 1
    };
    composition.layers.push(layer);
    composition.updatedAt = Date.now();
    return {
        success: true,
        data: {
            layerId,
            compositionId,
            mediaType,
            mediaSrc,
            startTime,
            duration: durationInFrames / composition.fps,
            message: `Added ${mediaType} layer from ${mediaSrc.split('/').pop() || mediaSrc}`
        },
        action: {
            type: 'video_layer_added',
            payload: {
                compositionId,
                layerId,
                layerType: mediaType,
                mediaSrc
            }
        }
    };
}
function executePreviewVideo(args) {
    const compositionId = args.compositionId;
    const openInCanvas = args.openInCanvas || false;
    if (!compositionId) {
        return {
            success: false,
            error: 'Composition ID is required'
        };
    }
    const composition = videoCompositions.get(compositionId);
    if (!composition) {
        return {
            success: false,
            error: `Composition not found: ${compositionId}`
        };
    }
    return {
        success: true,
        data: {
            compositionId,
            composition: {
                name: composition.name,
                type: composition.type,
                width: composition.width,
                height: composition.height,
                fps: composition.fps,
                durationInFrames: composition.durationInFrames,
                durationSeconds: composition.durationInFrames / composition.fps,
                layerCount: composition.layers.length,
                layers: composition.layers.map((l)=>({
                        id: l.id,
                        type: l.type
                    })),
                hasAudio: !!composition.audio
            },
            openInCanvas,
            message: `Preview ready for "${composition.name}" - ${composition.layers.length} layers, ${(composition.durationInFrames / composition.fps).toFixed(1)}s`
        },
        action: {
            type: 'video_preview_ready',
            payload: {
                compositionId,
                composition,
                openInCanvas
            }
        }
    };
}
async function executeRenderVideo(args) {
    const compositionId = args.compositionId;
    const format = args.format || 'mp4';
    const quality = args.quality || 'standard';
    const mode = args.mode || 'sandbox'; // Default to sandbox (free)
    if (!compositionId) {
        return {
            success: false,
            error: 'Composition ID is required'
        };
    }
    const composition = videoCompositions.get(compositionId);
    if (!composition) {
        return {
            success: false,
            error: `Composition not found: ${compositionId}`
        };
    }
    const durationSeconds = composition.durationInFrames / composition.fps;
    // Sandbox mode - render locally using ffmpeg.wasm
    if (mode === 'sandbox') {
        // Check if composition is too long for sandbox rendering
        if (durationSeconds > 60) {
            return {
                success: false,
                error: `Composition is ${Math.round(durationSeconds)}s long. Sandbox mode supports up to 60s. Use mode="server" for longer videos.`
            };
        }
        return {
            success: true,
            data: {
                renderMode: 'sandbox',
                compositionId,
                compositionName: composition.name,
                format,
                quality,
                durationSeconds,
                composition: {
                    ...composition,
                    layers: composition.layers.map((l)=>({
                            id: l.id,
                            type: l.type
                        }))
                },
                instructions: [
                    '1. Capture frames from the composition using Remotion player',
                    '2. Pass frames to renderInSandbox() from sandbox-renderer',
                    '3. ffmpeg.wasm will encode the video locally',
                    '4. Download the result - no cloud costs!'
                ],
                message: `Ready to render "${composition.name}" locally (${format}, ${quality}). Sandbox mode uses ffmpeg.wasm - completely free, no cloud needed.`,
                note: 'Rendering happens in your browser/sandbox. For videos over 60s, use mode="server".'
            },
            action: {
                type: 'video_render_started',
                payload: {
                    renderMode: 'sandbox',
                    compositionId,
                    compositionName: composition.name,
                    format,
                    quality,
                    status: 'ready_to_render',
                    localRender: true
                }
            }
        };
    }
    // Server mode - use cloud rendering
    try {
        const response = await fetch('/api/video/render', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                compositionId,
                compositionName: composition.name,
                compositionData: {
                    width: composition.width,
                    height: composition.height,
                    fps: composition.fps,
                    durationInFrames: composition.durationInFrames,
                    props: {
                        compositionType: composition.type === 'lyric-video' ? 'lyric' : composition.type === 'text-overlay' ? 'text-overlay' : 'base',
                        compositionProps: composition
                    }
                },
                format,
                quality
            })
        });
        const result = await response.json();
        if (!result.success) {
            return {
                success: false,
                error: result.error || 'Failed to start render'
            };
        }
        const estimatedDuration = Math.ceil(durationSeconds) * 2;
        return {
            success: true,
            data: {
                renderMode: 'server',
                jobId: result.job.id,
                compositionId,
                status: result.job.status,
                format,
                quality,
                estimatedDuration,
                message: `Server render started for "${composition.name}" (${format}, ${quality}). Job ID: ${result.job.id}. Use get_render_status to check progress.`
            },
            action: {
                type: 'video_render_started',
                payload: {
                    renderMode: 'server',
                    jobId: result.job.id,
                    compositionId,
                    compositionName: composition.name,
                    format,
                    quality,
                    status: result.job.status
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to start render'
        };
    }
}
async function executeSyncLyricsToAudio(args) {
    const audioSrc = args.audioSrc;
    const lyricsText = args.lyrics;
    const language = args.language;
    if (!audioSrc) {
        return {
            success: false,
            error: 'Audio source is required'
        };
    }
    if (!lyricsText) {
        return {
            success: false,
            error: 'Lyrics text is required'
        };
    }
    try {
        // Parse lyrics into lines
        const lyricLines = lyricsText.split('\n').map((line)=>line.trim()).filter((line)=>line.length > 0);
        if (lyricLines.length === 0) {
            return {
                success: false,
                error: 'No valid lyric lines found'
            };
        }
        // Call Whisper API for transcription with timestamps
        const formData = new FormData();
        // If audioSrc is a URL, fetch and convert to blob
        let audioBlob;
        if (audioSrc.startsWith('http')) {
            const audioResponse = await fetch(audioSrc);
            audioBlob = await audioResponse.blob();
        } else {
            // Assume it's a base64 data URL or local path
            return {
                success: false,
                error: 'Audio must be provided as a URL. Upload the audio file first.'
            };
        }
        formData.append('file', audioBlob, 'audio.mp3');
        formData.append('model', 'whisper-1');
        formData.append('response_format', 'verbose_json');
        formData.append('timestamp_granularities[]', 'word');
        if (language) {
            formData.append('language', language);
        }
        const whisperResponse = await fetch('/api/whisper', {
            method: 'POST',
            body: formData
        });
        if (!whisperResponse.ok) {
            // Fallback: estimate timing based on audio duration assumption
            const estimatedDuration = lyricLines.length * 4; // Assume ~4 seconds per line
            const syncedLyrics = lyricLines.map((text, index)=>({
                    text,
                    startTime: index * (estimatedDuration / lyricLines.length),
                    endTime: (index + 1) * (estimatedDuration / lyricLines.length)
                }));
            return {
                success: true,
                data: {
                    lyrics: syncedLyrics,
                    lyricCount: syncedLyrics.length,
                    method: 'estimated',
                    message: `Estimated timing for ${syncedLyrics.length} lines (Whisper unavailable). Consider providing manual timestamps for better sync.`
                },
                action: {
                    type: 'lyrics_synced',
                    payload: {
                        lyricCount: syncedLyrics.length,
                        method: 'estimated',
                        previewLyrics: syncedLyrics.slice(0, 3)
                    }
                }
            };
        }
        const whisperResult = await whisperResponse.json();
        // Match transcribed words to lyric lines
        const words = whisperResult.words || [];
        const syncedLyrics = matchLyricsToWords(lyricLines, words);
        return {
            success: true,
            data: {
                lyrics: syncedLyrics,
                lyricCount: syncedLyrics.length,
                method: 'whisper',
                totalDuration: syncedLyrics.length > 0 ? syncedLyrics[syncedLyrics.length - 1].endTime : 0,
                message: `Synced ${syncedLyrics.length} lyric lines using Whisper AI. Ready for add_lyrics_to_video.`
            },
            action: {
                type: 'lyrics_synced',
                payload: {
                    lyricCount: syncedLyrics.length,
                    method: 'whisper',
                    previewLyrics: syncedLyrics.slice(0, 3)
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to sync lyrics'
        };
    }
}
/**
 * Match lyric lines to Whisper word timestamps using fuzzy matching
 */ function matchLyricsToWords(lyricLines, words) {
    if (words.length === 0) {
        // Fallback to estimated timing
        const estimatedDuration = lyricLines.length * 4;
        return lyricLines.map((text, index)=>({
                text,
                startTime: index * (estimatedDuration / lyricLines.length),
                endTime: (index + 1) * (estimatedDuration / lyricLines.length)
            }));
    }
    const result = [];
    let wordIndex = 0;
    for (const line of lyricLines){
        const lineWords = line.toLowerCase().split(/\s+/).filter(Boolean);
        const startWord = words[wordIndex];
        if (!startWord) {
            // No more words, estimate remaining
            const lastEnd = result.length > 0 ? result[result.length - 1].endTime : 0;
            result.push({
                text: line,
                startTime: lastEnd,
                endTime: lastEnd + 3
            });
            continue;
        }
        const startTime = startWord.start;
        // Find matching words for this line
        let matchedWords = 0;
        let endTime = startWord.end;
        while(wordIndex < words.length && matchedWords < lineWords.length){
            endTime = words[wordIndex].end;
            wordIndex++;
            matchedWords++;
        }
        result.push({
            text: line,
            startTime,
            endTime
        });
    }
    return result;
}
async function executeGetRenderStatus(args) {
    const jobId = args.jobId;
    if (!jobId) {
        return {
            success: false,
            error: 'Job ID is required'
        };
    }
    try {
        const response = await fetch(`/api/video/render?jobId=${encodeURIComponent(jobId)}`);
        const result = await response.json();
        if (!result.success) {
            return {
                success: false,
                error: result.error || 'Failed to get render status'
            };
        }
        const job = result.job;
        return {
            success: true,
            data: {
                jobId: job.id,
                status: job.status,
                progress: job.progress,
                outputUrl: job.outputUrl,
                error: job.error,
                durationMs: job.durationMs,
                message: job.status === 'completed' ? `Render complete! Download: ${job.outputUrl}` : job.status === 'failed' ? `Render failed: ${job.error}` : `Rendering: ${job.progress}% complete`
            },
            action: {
                type: job.status === 'completed' ? 'video_render_complete' : 'video_render_status',
                payload: {
                    jobId: job.id,
                    status: job.status,
                    progress: job.progress,
                    outputUrl: job.outputUrl
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get render status'
        };
    }
}
// --------------------------------------------------------------------------
// Talking Video Tools
// --------------------------------------------------------------------------
/**
 * Create a talking head video with AI-generated script, voice, and lip sync
 */ async function executeCreateTalkingVideo(args) {
    const topic = args.topic;
    const sourcePhotoUrl = args.sourcePhotoUrl;
    const sceneStyle = args.sceneStyle || 'podcast_studio';
    const customScenePrompt = args.customScenePrompt;
    const duration = args.duration || 90;
    const tone = args.tone || 'professional';
    if (!topic) {
        return {
            success: false,
            error: 'Topic is required'
        };
    }
    if (!sourcePhotoUrl) {
        return {
            success: false,
            error: 'Source photo URL is required'
        };
    }
    try {
        const response = await fetch('/api/talking-video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'run_workflow',
                topic,
                sourcePhotoUrl,
                sceneStyle,
                customScenePrompt,
                duration,
                tone
            })
        });
        const result = await response.json();
        if (result.error) {
            return {
                success: false,
                error: result.error,
                action: {
                    type: 'talking_video_error',
                    payload: {
                        error: result.error
                    }
                }
            };
        }
        return {
            success: true,
            data: {
                projectId: result.projectId,
                status: result.status,
                script: result.script,
                audioUrl: result.audioUrl,
                backgroundVideoUrl: result.backgroundVideoUrl,
                finalVideoUrl: result.finalVideoUrl,
                message: result.finalVideoUrl ? `Talking video created successfully! Watch it here: ${result.finalVideoUrl}` : 'Video creation started...'
            },
            action: {
                type: 'talking_video_complete',
                payload: {
                    projectId: result.projectId,
                    finalVideoUrl: result.finalVideoUrl,
                    script: result.script
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create talking video'
        };
    }
}
/**
 * Generate just the script for a talking video
 */ async function executeGenerateVideoScript(args) {
    const topic = args.topic;
    const duration = args.duration || 90;
    const tone = args.tone || 'professional';
    const style = args.style || 'monologue';
    if (!topic) {
        return {
            success: false,
            error: 'Topic is required'
        };
    }
    try {
        const response = await fetch('/api/talking-video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'generate_script',
                topic,
                duration,
                tone,
                style
            })
        });
        const result = await response.json();
        if (result.error) {
            return {
                success: false,
                error: result.error
            };
        }
        return {
            success: true,
            data: {
                script: result.script,
                estimatedDuration: result.estimatedDuration,
                wordCount: result.wordCount,
                message: `Generated a ${result.estimatedDuration}-second script (${result.wordCount} words)`
            },
            action: {
                type: 'talking_video_script_generated',
                payload: {
                    script: result.script,
                    estimatedDuration: result.estimatedDuration,
                    wordCount: result.wordCount
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate script'
        };
    }
}
/**
 * Generate voice audio from text using ElevenLabs
 */ async function executeGenerateVoiceAudio(args) {
    const text = args.text;
    const voiceId = args.voiceId;
    const stability = args.stability;
    const similarityBoost = args.similarityBoost;
    if (!text) {
        return {
            success: false,
            error: 'Text is required'
        };
    }
    // Note: This would call the ElevenLabs API directly in production
    // For now, we return a placeholder that the frontend can handle
    return {
        success: true,
        data: {
            text,
            voiceId,
            stability,
            similarityBoost,
            message: 'Voice generation queued. The audio will be generated using your cloned voice.'
        },
        action: {
            type: 'talking_video_voice_generated',
            payload: {
                text,
                voiceId,
                stability,
                similarityBoost,
                apiCall: 'elevenlabs/text-to-speech'
            }
        }
    };
}
/**
 * Navigate to the video studio page
 */ function executeNavigateToVideoStudio(args) {
    const prefillTopic = args.prefillTopic;
    let url = '/video';
    if (prefillTopic) {
        url += `?topic=${encodeURIComponent(prefillTopic)}`;
    }
    return {
        success: true,
        data: {
            url,
            prefillTopic,
            message: 'Opening the video studio...'
        },
        action: {
            type: 'navigate',
            payload: {
                url,
                destination: 'video',
                prefillTopic
            }
        }
    };
}
// =============================================================================
// LTX-2 Video Generation Tools
// =============================================================================
/**
 * Generate a video from a text prompt using LTX-2
 */ async function executeGenerateVideo(args) {
    const prompt = args.prompt;
    const negative_prompt = args.negative_prompt;
    const preset = args.preset;
    const duration_seconds = args.duration_seconds;
    const seed = args.seed;
    if (!prompt) {
        return {
            success: false,
            error: 'Prompt is required for video generation'
        };
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$video$2f$ltx$2d$video$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isLTXConfigured"])()) {
        return {
            success: false,
            error: 'Video generation is not configured. FAL_KEY environment variable is missing.'
        };
    }
    try {
        let result;
        if (preset && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$video$2f$ltx$2d$video$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LTX_PRESETS"][preset]) {
            // Use preset
            result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$video$2f$ltx$2d$video$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateVideoWithPreset"])(prompt, preset, {
                negative_prompt,
                seed
            });
        } else {
            // Use custom settings
            const num_frames = duration_seconds ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$video$2f$ltx$2d$video$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFrameCountForDuration"])(duration_seconds) : 97;
            result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$video$2f$ltx$2d$video$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateVideoFromText"])({
                prompt,
                negative_prompt,
                num_frames,
                seed
            });
        }
        return {
            success: true,
            data: {
                videoUrl: result.video.url,
                fileName: result.video.file_name,
                fileSize: result.video.file_size,
                seed: result.seed,
                message: `Video generated successfully! Here's your video: ${result.video.url}`
            },
            action: {
                type: 'video_generated',
                payload: {
                    videoUrl: result.video.url,
                    fileName: result.video.file_name,
                    prompt
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: `Failed to generate video: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}
/**
 * Animate an image into a video using LTX-2 image-to-video
 */ async function executeAnimateImage(args) {
    const image_url = args.image_url;
    const prompt = args.prompt;
    const negative_prompt = args.negative_prompt;
    const duration_seconds = args.duration_seconds;
    const seed = args.seed;
    if (!image_url) {
        return {
            success: false,
            error: 'Image URL is required for animation'
        };
    }
    if (!prompt) {
        return {
            success: false,
            error: 'Prompt describing the motion is required'
        };
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$video$2f$ltx$2d$video$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isLTXConfigured"])()) {
        return {
            success: false,
            error: 'Video generation is not configured. FAL_KEY environment variable is missing.'
        };
    }
    try {
        const num_frames = duration_seconds ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$video$2f$ltx$2d$video$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFrameCountForDuration"])(duration_seconds) : 97;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$video$2f$ltx$2d$video$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateVideoFromImage"])({
            image_url,
            prompt,
            negative_prompt,
            num_frames,
            seed
        });
        return {
            success: true,
            data: {
                videoUrl: result.video.url,
                fileName: result.video.file_name,
                fileSize: result.video.file_size,
                seed: result.seed,
                message: `Image animated successfully! Here's your video: ${result.video.url}`
            },
            action: {
                type: 'image_animated',
                payload: {
                    videoUrl: result.video.url,
                    fileName: result.video.file_name,
                    originalImage: image_url,
                    prompt
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: `Failed to animate image: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}
/**
 * List available video generation presets
 */ function executeListVideoPresets() {
    const presets = Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$video$2f$ltx$2d$video$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LTX_PRESETS"]).map(([key, preset])=>({
            id: key,
            name: preset.name,
            description: preset.description,
            width: preset.width,
            height: preset.height,
            frames: preset.num_frames,
            approximateDuration: `~${Math.round(preset.num_frames / 24)} seconds`
        }));
    return {
        success: true,
        data: {
            presets,
            message: 'Available video generation presets:'
        }
    };
}
// =============================================================================
// AI Provider Tools (Phase 3 Local LLM Integration)
// =============================================================================
/**
 * Get the current AI provider status and configuration
 * This tool helps users understand which AI backend is being used
 */ function executeGetAIProviderStatus(args) {
    const includeLatency = args.includeLatency;
    // Note: The actual provider status comes from the chat route's response metadata
    // This tool returns an action that the frontend can use to fetch/display detailed status
    return {
        success: true,
        data: {
            message: 'Checking AI provider status...',
            note: 'The current provider information is included in each chat response. Check the response metadata for provider, providerModel, and fallbackUsed fields.',
            settingsUrl: '/settings/ai'
        },
        action: {
            type: 'check_provider_status',
            payload: {
                includeLatency: includeLatency ?? false,
                healthEndpoint: '/api/health/providers',
                settingsUrl: '/settings/ai'
            }
        }
    };
}
/**
 * Navigate to AI settings page
 */ function executeNavigateToAISettings() {
    return {
        success: true,
        data: {
            url: '/settings/ai',
            message: 'Opening AI provider settings...'
        },
        action: {
            type: 'navigate',
            payload: {
                url: '/settings/ai',
                destination: 'settings'
            }
        }
    };
}
// ============================================================================
// KANBAN TASK READING TOOLS - Read and understand tasks
// ============================================================================
/**
 * Get a specific Kanban task by ID
 */ async function executeGetKanbanTask(args) {
    const taskId = args.taskId;
    if (!taskId) {
        return {
            success: false,
            error: 'Task ID is required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const task = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].kanban.getTaskById, {
            taskId
        });
        if (!task) {
            return {
                success: false,
                error: `Task not found: ${taskId}`
            };
        }
        return {
            success: true,
            data: {
                task: {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    status: task.status,
                    tags: task.tags,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt
                },
                message: `Found task "${task.title}" (${task.status})`
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get task'
        };
    }
}
/**
 * Search Kanban tasks by keyword
 */ async function executeSearchKanbanTasks(args) {
    const query = args.query;
    const status = args.status;
    if (!query) {
        return {
            success: false,
            error: 'Search query is required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const tasks = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].kanban.searchTasks, {
            query,
            status: status
        });
        return {
            success: true,
            data: {
                tasks: tasks.map((t)=>({
                        id: t.id,
                        title: t.title,
                        status: t.status,
                        priority: t.priority,
                        tags: t.tags
                    })),
                count: tasks.length,
                message: `Found ${tasks.length} task${tasks.length !== 1 ? 's' : ''} matching "${query}"`
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to search tasks'
        };
    }
}
// ============================================================================
// DESIGN CANVAS TOOLS - Infinite canvas for visual composition
// ============================================================================
/**
 * Create a new design canvas
 */ async function executeCreateCanvas(args, context) {
    const name = args.name;
    const canvasType = args.canvasType || 'freeform';
    const description = args.description;
    const backgroundColor = args.backgroundColor || '#1a1a2e';
    const gridEnabled = args.gridEnabled !== false;
    if (!name) {
        return {
            success: false,
            error: 'Canvas name is required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const userId = getEffectiveUserId(context);
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const canvasId = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].designCanvas.createCanvas, {
            name,
            description,
            ownerId: userId,
            canvasType: canvasType,
            backgroundColor,
            gridEnabled,
            gridSize: 20
        });
        return {
            success: true,
            data: {
                canvasId,
                name,
                canvasType,
                backgroundColor,
                message: `Created canvas "${name}" (${canvasType})`
            },
            action: {
                type: 'canvas_created',
                payload: {
                    canvasId,
                    name,
                    canvasType,
                    url: `/canvas/${canvasId}`
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create canvas'
        };
    }
}
/**
 * List all design canvases
 */ async function executeListCanvases(args, context) {
    const status = args.status;
    const limit = args.limit || 20;
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const userId = getEffectiveUserId(context);
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const canvases = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].designCanvas.getUserCanvases, {
            ownerId: userId,
            status: status
        });
        const limitedCanvases = canvases.slice(0, limit);
        return {
            success: true,
            data: {
                canvases: limitedCanvases.map((c)=>({
                        id: c._id,
                        name: c.name,
                        type: c.canvasType,
                        status: c.status,
                        createdAt: new Date(c.createdAt).toISOString(),
                        updatedAt: new Date(c.updatedAt).toISOString()
                    })),
                count: limitedCanvases.length,
                totalCount: canvases.length,
                message: `Found ${canvases.length} canvas${canvases.length !== 1 ? 'es' : ''}`
            },
            action: {
                type: 'canvases_listed',
                payload: {
                    count: limitedCanvases.length
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to list canvases'
        };
    }
}
/**
 * Get a specific canvas with its nodes and edges
 */ async function executeGetCanvas(args) {
    const canvasId = args.canvasId;
    if (!canvasId) {
        return {
            success: false,
            error: 'Canvas ID is required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const canvas = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].designCanvas.getCanvas, {
            canvasId: canvasId
        });
        if (!canvas) {
            return {
                success: false,
                error: `Canvas not found: ${canvasId}`
            };
        }
        const nodes = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].designCanvas.getCanvasNodes, {
            canvasId: canvasId
        });
        const edges = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].designCanvas.getCanvasEdges, {
            canvasId: canvasId
        });
        return {
            success: true,
            data: {
                canvas: {
                    id: canvas._id,
                    name: canvas.name,
                    type: canvas.canvasType,
                    status: canvas.status,
                    backgroundColor: canvas.backgroundColor
                },
                nodes: nodes.map((n)=>({
                        nodeId: n.nodeId,
                        type: n.nodeType,
                        x: n.x,
                        y: n.y,
                        width: n.width,
                        height: n.height,
                        content: n.content
                    })),
                edges: edges.map((e)=>({
                        edgeId: e.edgeId,
                        type: e.edgeType,
                        source: e.sourceNodeId,
                        target: e.targetNodeId,
                        label: e.label
                    })),
                nodeCount: nodes.length,
                edgeCount: edges.length,
                message: `Canvas "${canvas.name}" has ${nodes.length} nodes and ${edges.length} edges`
            },
            action: {
                type: 'canvas_retrieved',
                payload: {
                    canvasId: canvas._id,
                    name: canvas.name,
                    nodeCount: nodes.length,
                    edgeCount: edges.length
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get canvas'
        };
    }
}
/**
 * Add a node to a canvas
 */ async function executeAddCanvasNode(args, context) {
    const canvasId = args.canvasId;
    const nodeType = args.nodeType;
    const x = args.x || 0;
    const y = args.y || 0;
    const content = args.content;
    const width = args.width || getDefaultWidth(nodeType);
    const height = args.height || getDefaultHeight(nodeType);
    const style = args.style;
    if (!canvasId || !nodeType || content === undefined) {
        return {
            success: false,
            error: 'Canvas ID, node type, and content are required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const userId = getEffectiveUserId(context);
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        // Generate a unique node ID
        const nodeId = `node_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].designCanvas.addNode, {
            canvasId: canvasId,
            nodeId,
            nodeType: nodeType,
            x,
            y,
            width,
            height,
            content,
            style,
            createdBy: userId
        });
        return {
            success: true,
            data: {
                nodeId,
                nodeType,
                x,
                y,
                width,
                height,
                content: content.length > 50 ? content.slice(0, 50) + '...' : content,
                message: `Added ${nodeType} node at (${x}, ${y})`
            },
            action: {
                type: 'canvas_node_added',
                payload: {
                    canvasId,
                    nodeId,
                    nodeType,
                    x,
                    y
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to add canvas node'
        };
    }
}
/**
 * Get default width for node type
 */ function getDefaultWidth(nodeType) {
    switch(nodeType){
        case 'text':
            return 200;
        case 'sticky':
            return 200;
        case 'shape':
            return 100;
        case 'image':
            return 300;
        case 'code':
            return 400;
        case 'frame':
            return 400;
        default:
            return 150;
    }
}
/**
 * Get default height for node type
 */ function getDefaultHeight(nodeType) {
    switch(nodeType){
        case 'text':
            return 50;
        case 'sticky':
            return 200;
        case 'shape':
            return 100;
        case 'image':
            return 200;
        case 'code':
            return 300;
        case 'frame':
            return 300;
        default:
            return 100;
    }
}
/**
 * Add an edge between nodes on a canvas
 */ async function executeAddCanvasEdge(args) {
    const canvasId = args.canvasId;
    const sourceNodeId = args.sourceNodeId;
    const targetNodeId = args.targetNodeId;
    const edgeType = args.edgeType || 'arrow';
    const label = args.label;
    const style = args.style;
    if (!canvasId || !sourceNodeId || !targetNodeId) {
        return {
            success: false,
            error: 'Canvas ID, source node ID, and target node ID are required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        // Generate a unique edge ID
        const edgeId = `edge_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].designCanvas.addEdge, {
            canvasId: canvasId,
            edgeId,
            sourceNodeId,
            targetNodeId,
            edgeType: edgeType,
            label,
            style
        });
        return {
            success: true,
            data: {
                edgeId,
                edgeType,
                source: sourceNodeId,
                target: targetNodeId,
                label,
                message: `Connected ${sourceNodeId} → ${targetNodeId}${label ? ` (${label})` : ''}`
            },
            action: {
                type: 'canvas_edge_added',
                payload: {
                    canvasId,
                    edgeId,
                    source: sourceNodeId,
                    target: targetNodeId
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to add canvas edge'
        };
    }
}
/**
 * Update an existing canvas node
 */ async function executeUpdateCanvasNode(args) {
    const canvasId = args.canvasId;
    const nodeId = args.nodeId;
    const x = args.x;
    const y = args.y;
    const width = args.width;
    const height = args.height;
    const content = args.content;
    const style = args.style;
    if (!canvasId || !nodeId) {
        return {
            success: false,
            error: 'Canvas ID and node ID are required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].designCanvas.updateNode, {
            canvasId: canvasId,
            nodeId,
            x,
            y,
            width,
            height,
            content,
            style
        });
        const updates = [];
        if (x !== undefined || y !== undefined) updates.push(`position (${x ?? '?'}, ${y ?? '?'})`);
        if (width !== undefined || height !== undefined) updates.push(`size (${width ?? '?'}x${height ?? '?'})`);
        if (content !== undefined) updates.push('content');
        if (style !== undefined) updates.push('style');
        return {
            success: true,
            data: {
                nodeId,
                updated: updates,
                message: `Updated node ${nodeId}: ${updates.join(', ')}`
            },
            action: {
                type: 'canvas_node_updated',
                payload: {
                    canvasId,
                    nodeId,
                    updates
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update canvas node'
        };
    }
}
// =============================================================================
// Apple Health Tool Executors
// =============================================================================
// Type assertion helper for health API (types generated at deploy time)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const healthApi = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].health || {};
/**
 * Get health summary for a specific date
 */ async function executeGetHealthSummary(args, context) {
    const userId = getEffectiveUserId(context);
    if (!userId) {
        return {
            success: false,
            error: 'Authentication required to access health data'
        };
    }
    const date = args.date || new Date().toISOString().split('T')[0];
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const summary = await client.query(healthApi.getDailySummary, {
            date
        });
        if (!summary) {
            return {
                success: true,
                data: {
                    date,
                    message: `No health data found for ${date}. Make sure you've synced your Apple Health data using the iOS Shortcut.`,
                    hasData: false
                }
            };
        }
        // Format the summary for display
        const formattedSummary = {
            date,
            hasData: true,
            activity: {
                steps: summary.steps,
                distance: summary.distance ? `${(summary.distance / 1000).toFixed(2)} km` : undefined,
                activeEnergy: summary.activeEnergy ? `${Math.round(summary.activeEnergy)} kcal` : undefined,
                exerciseMinutes: summary.exerciseMinutes,
                standHours: summary.standHours,
                flightsClimbed: summary.flightsClimbed
            },
            heart: {
                averageHeartRate: summary.avgHeartRate ? `${Math.round(summary.avgHeartRate)} bpm` : undefined,
                restingHeartRate: summary.restingHeartRate ? `${Math.round(summary.restingHeartRate)} bpm` : undefined,
                heartRateVariability: summary.heartRateVariability ? `${Math.round(summary.heartRateVariability)} ms` : undefined,
                minHeartRate: summary.minHeartRate ? `${Math.round(summary.minHeartRate)} bpm` : undefined,
                maxHeartRate: summary.maxHeartRate ? `${Math.round(summary.maxHeartRate)} bpm` : undefined
            },
            sleep: {
                sleepHours: summary.sleepHours ? `${summary.sleepHours.toFixed(1)} hours` : undefined,
                timeInBed: summary.timeInBed ? `${summary.timeInBed.toFixed(1)} hours` : undefined
            },
            body: {
                weight: summary.weight ? `${summary.weight.toFixed(1)} kg` : undefined,
                bodyFat: summary.bodyFat ? `${summary.bodyFat.toFixed(1)}%` : undefined
            },
            vitals: {
                bloodOxygen: summary.bloodOxygen ? `${summary.bloodOxygen.toFixed(1)}%` : undefined,
                respiratoryRate: summary.respiratoryRate ? `${summary.respiratoryRate.toFixed(1)} breaths/min` : undefined
            },
            mindfulness: {
                mindfulMinutes: summary.mindfulMinutes
            },
            workouts: {
                count: summary.workoutCount,
                totalMinutes: summary.workoutMinutes ? Math.round(summary.workoutMinutes) : undefined,
                totalCalories: summary.workoutCalories ? Math.round(summary.workoutCalories) : undefined
            },
            scores: {
                activity: summary.activityScore,
                sleep: summary.sleepScore,
                readiness: summary.readinessScore
            }
        };
        return {
            success: true,
            data: formattedSummary
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get health summary'
        };
    }
}
/**
 * Get health trends over time
 */ async function executeGetHealthTrends(args, context) {
    const userId = getEffectiveUserId(context);
    if (!userId) {
        return {
            success: false,
            error: 'Authentication required to access health data'
        };
    }
    const weeks = args.weeks || 4;
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const trends = await client.query(healthApi.getHealthTrends, {
            weeks
        });
        if (!trends || trends.length === 0) {
            return {
                success: true,
                data: {
                    weeks,
                    message: 'No health trend data available. Sync more data from Apple Health to see trends.',
                    hasData: false
                }
            };
        }
        return {
            success: true,
            data: {
                weeks,
                hasData: true,
                weeklyTrends: trends.map((week)=>({
                        week: week.week,
                        avgSteps: week.avgSteps ? Math.round(week.avgSteps) : null,
                        avgSleepHours: week.avgSleep ? week.avgSleep.toFixed(1) : null,
                        avgHeartRate: week.avgHeartRate ? Math.round(week.avgHeartRate) : null,
                        avgActivityScore: week.avgActivityScore ? Math.round(week.avgActivityScore) : null
                    }))
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get health trends'
        };
    }
}
/**
 * Get detailed data for a specific health metric
 */ async function executeGetHealthMetric(args, context) {
    const userId = getEffectiveUserId(context);
    if (!userId) {
        return {
            success: false,
            error: 'Authentication required to access health data'
        };
    }
    const metric = args.metric;
    if (!metric) {
        return {
            success: false,
            error: 'Metric type is required'
        };
    }
    const endDate = args.endDate || new Date().toISOString().split('T')[0];
    const startDate = args.startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const startTimestamp = new Date(`${startDate}T00:00:00Z`).getTime();
    const endTimestamp = new Date(`${endDate}T23:59:59.999Z`).getTime();
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const samples = await client.query(healthApi.getSamples, {
            sampleType: metric,
            startDate: startTimestamp,
            endDate: endTimestamp,
            limit: 100
        });
        if (!samples || samples.length === 0) {
            return {
                success: true,
                data: {
                    metric,
                    startDate,
                    endDate,
                    message: `No ${metric} data found for the specified date range.`,
                    hasData: false
                }
            };
        }
        // Aggregate by date
        const byDate = {};
        for (const sample of samples){
            const date = new Date(sample.startDate).toISOString().split('T')[0];
            if (!byDate[date]) {
                byDate[date] = [];
            }
            byDate[date].push(sample.value);
        }
        const dailyData = Object.entries(byDate).map(([date, values])=>({
                date,
                value: metric === 'steps' || metric === 'activeEnergy' || metric === 'distance' ? values.reduce((a, b)=>a + b, 0) // Sum for cumulative metrics
                 : values.reduce((a, b)=>a + b, 0) / values.length,
                sampleCount: values.length
            })).sort((a, b)=>a.date.localeCompare(b.date));
        return {
            success: true,
            data: {
                metric,
                startDate,
                endDate,
                hasData: true,
                totalSamples: samples.length,
                dailyData,
                unit: samples[0]?.unit || 'unknown'
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get health metric data'
        };
    }
}
/**
 * Compare health metrics between two periods
 */ async function executeCompareHealthPeriods(args, context) {
    const userId = getEffectiveUserId(context);
    if (!userId) {
        return {
            success: false,
            error: 'Authentication required to access health data'
        };
    }
    const period1Start = args.period1Start;
    const period1End = args.period1End;
    const period2Start = args.period2Start;
    const period2End = args.period2End;
    const metrics = args.metrics || [
        'steps',
        'sleepHours',
        'avgHeartRate',
        'activityScore'
    ];
    if (!period1Start || !period1End || !period2Start || !period2End) {
        return {
            success: false,
            error: 'All period start and end dates are required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        // Get summaries for both periods
        const period1Summaries = await client.query(healthApi.getDailySummaries, {
            startDate: period1Start,
            endDate: period1End
        });
        const period2Summaries = await client.query(healthApi.getDailySummaries, {
            startDate: period2Start,
            endDate: period2End
        });
        // Calculate averages for each period
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const calcAvg = (summaries, metric)=>{
            const values = summaries.map((s)=>s[metric]).filter((v)=>v != null);
            return values.length > 0 ? values.reduce((a, b)=>a + b, 0) / values.length : null;
        };
        const comparison = {};
        for (const metric of metrics){
            const p1Avg = calcAvg(period1Summaries, metric);
            const p2Avg = calcAvg(period2Summaries, metric);
            let change = null;
            if (p1Avg != null && p2Avg != null && p1Avg !== 0) {
                const percentChange = (p2Avg - p1Avg) / p1Avg * 100;
                change = `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
            }
            comparison[metric] = {
                period1: p1Avg != null ? Math.round(p1Avg * 10) / 10 : null,
                period2: p2Avg != null ? Math.round(p2Avg * 10) / 10 : null,
                change
            };
        }
        return {
            success: true,
            data: {
                period1: {
                    start: period1Start,
                    end: period1End,
                    daysWithData: period1Summaries.length
                },
                period2: {
                    start: period2Start,
                    end: period2End,
                    daysWithData: period2Summaries.length
                },
                comparison
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to compare health periods'
        };
    }
}
/**
 * Generate a new API key for health data syncing
 */ async function executeGenerateHealthApiKey(args, context) {
    const userId = getEffectiveUserId(context);
    if (!userId) {
        return {
            success: false,
            error: 'Authentication required to generate API key'
        };
    }
    const name = args.name;
    if (!name) {
        return {
            success: false,
            error: 'API key name is required'
        };
    }
    const expiresInDays = args.expiresInDays;
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        // Note: This mutation requires authentication via Clerk
        // The webhook endpoint will use the API key for auth
        const result = await client.mutation(healthApi.generateApiKey, {
            name,
            expiresInDays
        });
        return {
            success: true,
            data: {
                apiKey: result.apiKey,
                name: result.name,
                expiresAt: result.expiresAt ? new Date(result.expiresAt).toISOString() : 'Never',
                message: result.message,
                webhookUrl: 'https://openclaw.io/api/webhooks/health',
                instructions: [
                    '1. Copy the API key above (it will not be shown again)',
                    '2. Create a new iOS Shortcut',
                    '3. Add "Find Health Samples" actions for the data you want to sync',
                    '4. Add "Get Contents of URL" action with:',
                    '   - URL: https://openclaw.io/api/webhooks/health',
                    '   - Method: POST',
                    '   - Headers: Authorization: Bearer YOUR_API_KEY',
                    '   - Body: JSON with your health data',
                    '5. Set up automation to run the shortcut daily'
                ]
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate API key'
        };
    }
}
/**
 * List all health API keys
 */ async function executeListHealthApiKeys(context) {
    const userId = getEffectiveUserId(context);
    if (!userId) {
        return {
            success: false,
            error: 'Authentication required to list API keys'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const keys = await client.query(healthApi.listApiKeys, {});
        if (!keys || keys.length === 0) {
            return {
                success: true,
                data: {
                    message: 'No API keys found. Generate one to start syncing health data.',
                    keys: []
                }
            };
        }
        return {
            success: true,
            data: {
                keys: keys.map((key)=>({
                        id: key.id,
                        name: key.name,
                        isActive: key.isActive,
                        isExpired: key.isExpired,
                        lastUsedAt: key.lastUsedAt ? new Date(key.lastUsedAt).toISOString() : 'Never',
                        usageCount: key.usageCount,
                        createdAt: new Date(key.createdAt).toISOString(),
                        expiresAt: key.expiresAt ? new Date(key.expiresAt).toISOString() : 'Never'
                    }))
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to list API keys'
        };
    }
}
/**
 * Revoke a health API key
 */ async function executeRevokeHealthApiKey(args, context) {
    const userId = getEffectiveUserId(context);
    if (!userId) {
        return {
            success: false,
            error: 'Authentication required to revoke API key'
        };
    }
    const keyId = args.keyId;
    if (!keyId) {
        return {
            success: false,
            error: 'API key ID is required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        await client.mutation(healthApi.revokeApiKey, {
            keyId: keyId
        });
        return {
            success: true,
            data: {
                message: 'API key has been revoked. It can no longer be used for syncing.',
                keyId
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to revoke API key'
        };
    }
}
/**
 * Get health sync status
 */ async function executeGetHealthSyncStatus(args, context) {
    const userId = getEffectiveUserId(context);
    if (!userId) {
        return {
            success: false,
            error: 'Authentication required to check sync status'
        };
    }
    const limit = args.limit || 5;
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const logs = await client.query(healthApi.getSyncLogs, {
            limit
        });
        if (!logs || logs.length === 0) {
            return {
                success: true,
                data: {
                    message: 'No sync history found. Health data has not been synced yet.',
                    syncs: []
                }
            };
        }
        const typedLogs = logs;
        return {
            success: true,
            data: {
                recentSyncs: typedLogs.map((log)=>({
                        syncId: log.syncId,
                        status: log.status,
                        samplesReceived: log.samplesReceived,
                        samplesStored: log.samplesStored,
                        sampleTypes: log.sampleTypes,
                        errors: log.errors,
                        syncedAt: new Date(log.syncedAt).toISOString()
                    })),
                lastSync: typedLogs[0] ? {
                    status: typedLogs[0].status,
                    samplesStored: typedLogs[0].samplesStored,
                    syncedAt: new Date(typedLogs[0].syncedAt).toISOString(),
                    timeSince: formatTimeSince(typedLogs[0].syncedAt)
                } : null
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get sync status'
        };
    }
}
/**
 * Format time since a timestamp
 */ function formatTimeSince(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}
// =============================================================================
// ERV Ontology Tools - AI-Assisted Entity Classification & Relationship Suggestion
// =============================================================================
/**
 * Entity type definitions with classification hints
 */ const ENTITY_TYPE_SCHEMAS = {
    Person: {
        keywords: [
            'person',
            'contact',
            'colleague',
            'friend',
            'team',
            'member',
            'employee',
            'met',
            'introduced'
        ],
        requiredFields: [],
        optionalFields: [
            'email',
            'company',
            'title',
            'phone',
            'linkedin',
            'twitter',
            'location',
            'notes',
            'relationship'
        ],
        defaultTags: [
            'contact'
        ]
    },
    Project: {
        keywords: [
            'project',
            'app',
            'website',
            'repo',
            'build',
            'create',
            'develop',
            'startup',
            'product',
            'initiative'
        ],
        requiredFields: [
            'status',
            'color'
        ],
        optionalFields: [
            'githubRepo',
            'description',
            'stack',
            'url',
            'startDate',
            'endDate'
        ],
        defaultTags: [
            'project'
        ]
    },
    Track: {
        keywords: [
            'song',
            'track',
            'music',
            'audio',
            'beat',
            'album',
            'artist',
            'spotify',
            'soundcloud'
        ],
        requiredFields: [
            'artist',
            'audioUrl',
            'isPrivate'
        ],
        optionalFields: [
            'album',
            'duration',
            'genre',
            'bpm',
            'key',
            'lyrics'
        ],
        defaultTags: [
            'music'
        ]
    },
    Event: {
        keywords: [
            'event',
            'meeting',
            'conference',
            'deadline',
            'appointment',
            'call',
            'reminder',
            'date',
            'schedule'
        ],
        requiredFields: [
            'startTime',
            'endTime',
            'timezone',
            'isAllDay'
        ],
        optionalFields: [
            'location',
            'description',
            'attendees',
            'recurring'
        ],
        defaultTags: [
            'calendar'
        ]
    },
    Memory: {
        keywords: [
            'remember',
            'memory',
            'note',
            'thought',
            'idea',
            'insight',
            'learned',
            'decision',
            'milestone'
        ],
        requiredFields: [
            'memoryType',
            'content',
            'importance',
            'timestamp'
        ],
        optionalFields: [
            'context',
            'projectId',
            'emotions'
        ],
        defaultTags: [
            'memory'
        ]
    },
    Ticket: {
        keywords: [
            'ticket',
            'task',
            'bug',
            'feature',
            'story',
            'issue',
            'todo',
            'fix',
            'implement'
        ],
        requiredFields: [
            'ticketId',
            'type',
            'priority',
            'status'
        ],
        optionalFields: [
            'description',
            'asA',
            'iWant',
            'soThat',
            'acceptanceCriteria',
            'labels',
            'epicId'
        ],
        defaultTags: [
            'task'
        ]
    },
    Draft: {
        keywords: [
            'draft',
            'writing',
            'blog',
            'article',
            'post',
            'essay',
            'document',
            'content'
        ],
        requiredFields: [],
        optionalFields: [
            'content',
            'wordCount',
            'status',
            'publishedAt',
            'category'
        ],
        defaultTags: [
            'writing'
        ]
    },
    Collection: {
        keywords: [
            'collection',
            'list',
            'group',
            'folder',
            'category',
            'set',
            'bundle'
        ],
        requiredFields: [],
        optionalFields: [
            'description',
            'entityIds',
            'icon',
            'color'
        ],
        defaultTags: [
            'collection'
        ]
    },
    Skill: {
        keywords: [
            'skill',
            'ability',
            'expertise',
            'technology',
            'tool',
            'language',
            'framework'
        ],
        requiredFields: [],
        optionalFields: [
            'level',
            'yearsExperience',
            'category',
            'endorsements'
        ],
        defaultTags: [
            'skill'
        ]
    },
    Value: {
        keywords: [
            'value',
            'principle',
            'belief',
            'philosophy',
            'core',
            'important'
        ],
        requiredFields: [],
        optionalFields: [
            'description',
            'priority',
            'examples'
        ],
        defaultTags: [
            'values'
        ]
    }
};
/**
 * Relationship type definitions with semantic hints
 */ const RELATIONSHIP_HINTS = {
    collaboratedOn: [
        'worked with',
        'built with',
        'created with',
        'partnered'
    ],
    createdBy: [
        'made by',
        'authored by',
        'developed by',
        'written by'
    ],
    assignedTo: [
        'assigned',
        'responsible',
        'owned by',
        'belongs to'
    ],
    belongsTo: [
        'part of',
        'in',
        'under',
        'within',
        'member of'
    ],
    contains: [
        'includes',
        'has',
        'comprises',
        'holds'
    ],
    parentOf: [
        'parent',
        'above',
        'manages',
        'oversees'
    ],
    mentions: [
        'references',
        'talks about',
        'cites',
        'links to'
    ],
    relatedTo: [
        'related',
        'connected',
        'similar',
        'associated'
    ],
    derivedFrom: [
        'based on',
        'inspired by',
        'forked from',
        'evolved from'
    ],
    followedBy: [
        'then',
        'next',
        'after',
        'succeeds'
    ],
    blockedBy: [
        'blocked',
        'waiting on',
        'depends on',
        'requires'
    ]
};
/**
 * Classify content into an entity type using keyword matching and heuristics
 */ function classifyEntityType(content, suggestedType, contentType) {
    // If user suggested a type and it's valid, use it with high confidence
    if (suggestedType && suggestedType in ENTITY_TYPE_SCHEMAS) {
        return {
            entityType: suggestedType,
            confidence: 0.95,
            reasoning: `User suggested type: ${suggestedType}`
        };
    }
    const lowerContent = content.toLowerCase();
    // URL detection - likely a Project, Track, or reference
    if (contentType === 'url' || lowerContent.match(/^https?:\/\//)) {
        if (lowerContent.includes('github.com')) {
            return {
                entityType: 'Project',
                confidence: 0.9,
                reasoning: 'GitHub URL detected'
            };
        }
        if (lowerContent.includes('spotify.com') || lowerContent.includes('soundcloud.com')) {
            return {
                entityType: 'Track',
                confidence: 0.9,
                reasoning: 'Music platform URL detected'
            };
        }
        if (lowerContent.includes('linkedin.com')) {
            return {
                entityType: 'Person',
                confidence: 0.85,
                reasoning: 'LinkedIn profile URL detected'
            };
        }
    }
    // Score each entity type based on keyword matches
    const scores = [];
    for (const [typeName, schema] of Object.entries(ENTITY_TYPE_SCHEMAS)){
        const matches = schema.keywords.filter((kw)=>lowerContent.includes(kw));
        const score = matches.length / schema.keywords.length;
        scores.push({
            type: typeName,
            score,
            matches
        });
    }
    // Sort by score descending
    scores.sort((a, b)=>b.score - a.score);
    const best = scores[0];
    if (best.score > 0) {
        return {
            entityType: best.type,
            confidence: Math.min(0.5 + best.score * 0.5, 0.9),
            reasoning: `Matched keywords: ${best.matches.join(', ')}`
        };
    }
    // Default to Memory if no clear match
    return {
        entityType: 'Memory',
        confidence: 0.4,
        reasoning: 'No strong type signals detected, defaulting to Memory'
    };
}
/**
 * Extract entity name from content
 */ function extractEntityName(content, entityType) {
    // Try to extract a title or name from the content
    const lines = content.split('\n').filter((l)=>l.trim());
    // If first line is short, use it as the name
    if (lines[0] && lines[0].length < 100) {
        return lines[0].trim();
    }
    // For URLs, extract domain or repo name
    const urlMatch = content.match(/https?:\/\/(?:www\.)?([^\/]+)(?:\/([^\/\s]+))?/);
    if (urlMatch) {
        if (urlMatch[2]) return urlMatch[2].replace(/[-_]/g, ' ');
        return urlMatch[1];
    }
    // Truncate long content
    return content.slice(0, 60).trim() + (content.length > 60 ? '...' : '');
}
/**
 * Extract data attributes from content based on entity type
 */ function extractEntityData(content, entityType, additionalContext) {
    const data = {};
    const lowerContent = (content + ' ' + (additionalContext || '')).toLowerCase();
    switch(entityType){
        case 'Person':
            {
                // Extract email
                const emailMatch = content.match(/[\w.-]+@[\w.-]+\.\w+/);
                if (emailMatch) data.email = emailMatch[0];
                // Extract potential company mentions
                const companyPatterns = [
                    /at\s+([A-Z][A-Za-z0-9\s]+)/g,
                    /works?\s+(?:at|for)\s+([A-Z][A-Za-z0-9\s]+)/gi
                ];
                for (const pattern of companyPatterns){
                    const match = pattern.exec(content);
                    if (match) {
                        data.company = match[1].trim();
                        break;
                    }
                }
                data.notes = content;
                break;
            }
        case 'Project':
            {
                data.status = 'discovery';
                data.color = '#8b5cf6'; // Purple default
                // Extract GitHub URL
                const githubMatch = content.match(/https?:\/\/github\.com\/[\w-]+\/[\w-]+/);
                if (githubMatch) data.githubRepo = githubMatch[0];
                data.description = content;
                break;
            }
        case 'Track':
            {
                data.isPrivate = false;
                // Try to extract artist from "by" or "-" patterns
                const artistPatterns = [
                    /by\s+([^,\n]+)/i,
                    /[-–—]\s*([^,\n]+)/
                ];
                for (const pattern of artistPatterns){
                    const match = pattern.exec(content);
                    if (match) {
                        data.artist = match[1].trim();
                        break;
                    }
                }
                if (!data.artist) data.artist = 'Unknown Artist';
                // Extract audio URL
                const audioMatch = content.match(/https?:\/\/[^\s]+\.(mp3|wav|m4a|ogg)/i);
                if (audioMatch) data.audioUrl = audioMatch[0];
                else data.audioUrl = '';
                break;
            }
        case 'Event':
            {
                data.timezone = 'America/Los_Angeles';
                data.isAllDay = false;
                // Try to parse date/time
                const now = Date.now();
                data.startTime = now;
                data.endTime = now + 60 * 60 * 1000; // 1 hour default
                data.description = content;
                break;
            }
        case 'Memory':
            {
                data.memoryType = lowerContent.includes('decision') ? 'decision' : lowerContent.includes('preference') ? 'preference' : lowerContent.includes('milestone') ? 'milestone' : 'interaction';
                data.content = content;
                data.importance = 0.7;
                data.timestamp = Date.now();
                if (additionalContext) data.context = additionalContext;
                break;
            }
        case 'Ticket':
            {
                // Generate ticket ID
                data.ticketId = `IMPORT-${Date.now().toString(36).toUpperCase()}`;
                data.type = lowerContent.includes('bug') ? 'bug' : lowerContent.includes('feature') ? 'story' : 'task';
                data.priority = 'P2';
                data.status = 'backlog';
                data.description = content;
                break;
            }
        case 'Draft':
            {
                data.content = content;
                data.wordCount = content.split(/\s+/).length;
                data.status = 'draft';
                break;
            }
        case 'Collection':
            {
                data.description = content;
                data.entityIds = [];
                break;
            }
        case 'Skill':
            {
                data.level = 'intermediate';
                data.description = content;
                break;
            }
        case 'Value':
            {
                data.description = content;
                data.priority = 1;
                break;
            }
    }
    return data;
}
/**
 * Analyze content and create an ERV entity
 */ async function executeAnalyzeAndCreateEntity(args, context) {
    const content = args.content;
    const contentType = args.contentType || 'auto';
    const suggestedType = args.suggestedType;
    const additionalContext = args.additionalContext;
    if (!content) {
        return {
            success: false,
            error: 'Content is required for entity classification'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        // Classify the content
        const classification = classifyEntityType(content, suggestedType, contentType);
        // Extract entity name and data
        const name = extractEntityName(content, classification.entityType);
        const data = extractEntityData(content, classification.entityType, additionalContext);
        // Get default tags for the entity type
        const schema = ENTITY_TYPE_SCHEMAS[classification.entityType];
        const tags = [
            ...schema.defaultTags
        ];
        // Add import tag
        tags.push(`import-${new Date().toISOString().slice(0, 7)}`);
        // Create the entity
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const result = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.createEntity, {
            entityType: classification.entityType,
            name,
            data: JSON.stringify(data),
            tags,
            source: 'ai_classification',
            importance: classification.confidence
        });
        return {
            success: true,
            data: {
                entityId: result.entityId,
                entityType: classification.entityType,
                name,
                confidence: classification.confidence,
                reasoning: classification.reasoning,
                extractedData: data,
                tags
            },
            action: {
                type: 'entity_classified',
                payload: {
                    entityId: result.entityId,
                    entityType: classification.entityType,
                    name,
                    confidence: classification.confidence
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to classify and create entity'
        };
    }
}
/**
 * Suggest relationships for an entity
 */ async function executeSuggestEntityRelationships(args, context) {
    const entityId = args.entityId;
    const relationshipTypes = args.relationshipTypes;
    const maxSuggestions = args.maxSuggestions || 10;
    const minConfidence = args.minConfidence || 0.5;
    const autoCreate = args.autoCreate || false;
    if (!entityId) {
        return {
            success: false,
            error: 'Entity ID is required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        // Get the source entity
        const sourceEntity = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.getEntity, {
            entityId
        });
        if (!sourceEntity) {
            return {
                success: false,
                error: `Entity not found: ${entityId}`
            };
        }
        // Parse source entity data
        let sourceData = {};
        try {
            sourceData = JSON.parse(sourceEntity.data);
        } catch  {
        // ignore
        }
        // Search for potentially related entities
        const searchTerms = [
            sourceEntity.name,
            ...sourceEntity.tags,
            ...Object.values(sourceData).filter((v)=>typeof v === 'string')
        ].join(' ');
        const candidates = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.searchEntities, {
            query: searchTerms,
            limit: 50
        });
        // Filter out the source entity and score candidates
        const suggestions = [];
        for (const candidate of candidates){
            if (candidate.entityId === entityId) continue;
            // Calculate relationship suggestions
            let candidateData = {};
            try {
                candidateData = JSON.parse(candidate.data);
            } catch  {
            // ignore
            }
            // Check for tag overlap
            const tagOverlap = sourceEntity.tags.filter((t)=>candidate.tags.includes(t));
            const tagScore = tagOverlap.length > 0 ? 0.3 + tagOverlap.length * 0.1 : 0;
            // Check for name similarity
            const nameScore = sourceEntity.name.toLowerCase().includes(candidate.name.toLowerCase()) || candidate.name.toLowerCase().includes(sourceEntity.name.toLowerCase()) ? 0.3 : 0;
            // Determine relationship type based on entity types
            let relType = 'relatedTo';
            let typeReasoning = 'General relationship based on content similarity';
            // Person → Project = collaboratedOn
            if (sourceEntity.entityType === 'Person' && candidate.entityType === 'Project') {
                relType = 'collaboratedOn';
                typeReasoning = 'Person may have collaborated on this project';
            } else if (sourceEntity.entityType === 'Ticket' && candidate.entityType === 'Project') {
                relType = 'belongsTo';
                typeReasoning = 'Ticket likely belongs to this project';
            } else if (sourceEntity.entityType === 'Ticket' && candidate.entityType === 'Ticket') {
                relType = 'relatedTo';
                typeReasoning = 'Related tickets with similar content';
            } else if (sourceEntity.entityType === 'Memory' && candidate.entityType === 'Project') {
                relType = 'mentions';
                typeReasoning = 'Memory may reference this project';
            }
            // Filter by requested relationship types
            if (relationshipTypes && !relationshipTypes.includes(relType)) {
                continue;
            }
            const totalScore = Math.min(tagScore + nameScore + 0.2, 1);
            if (totalScore >= minConfidence) {
                suggestions.push({
                    targetEntityId: candidate.entityId,
                    targetName: candidate.name,
                    targetType: candidate.entityType,
                    relationshipType: relType,
                    confidence: totalScore,
                    reasoning: typeReasoning + (tagOverlap.length > 0 ? `. Shared tags: ${tagOverlap.join(', ')}` : '')
                });
            }
        }
        // Sort by confidence and limit
        suggestions.sort((a, b)=>b.confidence - a.confidence);
        const topSuggestions = suggestions.slice(0, maxSuggestions);
        // Auto-create relationships if requested
        const createdRelationships = [];
        if (autoCreate) {
            for (const suggestion of topSuggestions){
                try {
                    await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.createRelationship, {
                        sourceEntityId: entityId,
                        targetEntityId: suggestion.targetEntityId,
                        relationshipType: suggestion.relationshipType,
                        source: 'ai_suggestion'
                    });
                    createdRelationships.push(`${suggestion.relationshipType} → ${suggestion.targetName}`);
                } catch  {
                // Relationship may already exist, skip
                }
            }
        }
        return {
            success: true,
            data: {
                entityId,
                entityName: sourceEntity.name,
                entityType: sourceEntity.entityType,
                suggestions: topSuggestions,
                totalCandidatesAnalyzed: candidates.length,
                createdRelationships: autoCreate ? createdRelationships : undefined
            },
            action: {
                type: 'relationships_suggested',
                payload: {
                    entityId,
                    suggestionCount: topSuggestions.length,
                    autoCreated: createdRelationships.length
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to suggest relationships'
        };
    }
}
/**
 * Bulk classify and create entities
 */ async function executeBulkClassifyEntities(args, context) {
    const items = args.items;
    const sourceFormat = args.sourceFormat || 'auto';
    const defaultType = args.defaultType;
    const commonTags = args.commonTags || [];
    const dryRun = args.dryRun || false;
    if (!items || !Array.isArray(items) || items.length === 0) {
        return {
            success: false,
            error: 'Items array is required and must not be empty'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const results = [];
        const typeCounts = {};
        for(let i = 0; i < items.length; i++){
            const item = items[i];
            const content = item.content;
            if (!content || typeof content !== 'string') {
                results.push({
                    index: i,
                    content: String(content || ''),
                    entityType: 'Memory',
                    name: '',
                    confidence: 0,
                    reasoning: 'Invalid content',
                    error: 'Content must be a non-empty string'
                });
                continue;
            }
            // Classify the item
            const classification = classifyEntityType(content, defaultType, sourceFormat);
            const name = extractEntityName(content, classification.entityType);
            const data = extractEntityData(content, classification.entityType, item.hint);
            // Get tags
            const schema = ENTITY_TYPE_SCHEMAS[classification.entityType];
            const tags = [
                ...schema.defaultTags,
                ...commonTags
            ];
            // Track type counts
            typeCounts[classification.entityType] = (typeCounts[classification.entityType] || 0) + 1;
            if (dryRun) {
                results.push({
                    index: i,
                    content: content.slice(0, 100),
                    entityType: classification.entityType,
                    name,
                    confidence: classification.confidence,
                    reasoning: classification.reasoning
                });
            } else {
                try {
                    const result = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.createEntity, {
                        entityType: classification.entityType,
                        name,
                        data: JSON.stringify(data),
                        tags,
                        source: 'bulk_import',
                        importance: classification.confidence
                    });
                    results.push({
                        index: i,
                        content: content.slice(0, 100),
                        entityType: classification.entityType,
                        name,
                        confidence: classification.confidence,
                        reasoning: classification.reasoning,
                        entityId: result.entityId
                    });
                } catch (err) {
                    results.push({
                        index: i,
                        content: content.slice(0, 100),
                        entityType: classification.entityType,
                        name,
                        confidence: classification.confidence,
                        reasoning: classification.reasoning,
                        error: err instanceof Error ? err.message : 'Failed to create entity'
                    });
                }
            }
        }
        const successCount = results.filter((r)=>!r.error && r.entityId).length;
        const errorCount = results.filter((r)=>r.error).length;
        return {
            success: true,
            data: {
                totalItems: items.length,
                dryRun,
                successCount,
                errorCount,
                typeCounts,
                results
            },
            action: {
                type: 'bulk_classification_complete',
                payload: {
                    totalItems: items.length,
                    successCount,
                    errorCount,
                    dryRun
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to bulk classify entities'
        };
    }
}
// =============================================================================
// Autonomous Execution Tools
// These enable Claw AI to do real work - spawn tasks, iterate on code,
// and delegate to specialists. Inspired by OpenClaw's sessions_spawn.
// =============================================================================
/**
 * Spawn a background task that runs independently
 * Creates an ERV AgentTask entity for observability through activity/threads/security apps
 */ async function executeSpawnTask(args) {
    const task = args.task;
    const label = args.label;
    const timeoutSeconds = Math.min(args.timeoutSeconds || 300, 600);
    const announceResult = args.announceResult !== false;
    const priority = args.priority || 'normal';
    const context = args.context;
    if (!task) {
        return {
            success: false,
            error: 'Task description is required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const result = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].jobs.queueAgentTask, {
            task,
            label,
            timeoutSeconds,
            announceResult,
            priority,
            context: context
        });
        // Create ERV AgentTask entity for observability
        const agentTaskData = {
            jobId: result.jobId,
            jobType: 'agent_task',
            status: result.status,
            task,
            label: label || task.slice(0, 50),
            priority,
            progress: 0,
            announceResult,
            context: context
        };
        try {
            // Create the ERV entity
            const entityResult = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.createEntity, {
                entityType: 'AgentTask',
                name: label || task.slice(0, 50),
                data: JSON.stringify(agentTaskData),
                tags: [
                    'background-task',
                    priority,
                    'agent_task'
                ],
                importance: priority === 'high' ? 0.8 : priority === 'normal' ? 0.5 : 0.3,
                source: 'ai'
            });
            // Create relationships to context entities if provided
            if (context?.projectId) {
                await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.createRelationship, {
                    sourceEntityId: entityResult.entityId,
                    targetEntityId: context.projectId,
                    relationshipType: 'spawnedFor',
                    bidirectional: false,
                    source: 'ai'
                }).catch(()=>{});
            }
            if (context?.ticketId) {
                await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.createRelationship, {
                    sourceEntityId: entityResult.entityId,
                    targetEntityId: context.ticketId,
                    relationshipType: 'spawnedFor',
                    bidirectional: false,
                    source: 'ai'
                }).catch(()=>{});
            }
            if (context?.sandboxId) {
                await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.createRelationship, {
                    sourceEntityId: entityResult.entityId,
                    targetEntityId: context.sandboxId,
                    relationshipType: 'executedIn',
                    bidirectional: false,
                    source: 'ai'
                }).catch(()=>{});
            }
        } catch  {
            // ERV entity creation is optional - don't fail the main task
            console.warn('Failed to create ERV entity for agent task');
        }
        return {
            success: true,
            data: {
                jobId: result.jobId,
                status: result.status,
                task,
                label: label || task.slice(0, 50),
                timeoutSeconds,
                message: `Task spawned! Job ID: ${result.jobId}. I'll work on this in the background and announce the result when done.`
            },
            action: {
                type: 'task_spawned',
                payload: {
                    jobId: result.jobId,
                    task,
                    label,
                    priority,
                    announceResult
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to spawn task'
        };
    }
}
/**
 * List background tasks
 */ async function executeListBackgroundTasks(args) {
    const status = args.status;
    const limit = args.limit || 10;
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const jobs = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].jobs.getAgentJobs, {
            status: status,
            limit
        });
        const formattedJobs = jobs.map((job)=>({
                jobId: job.jobId,
                type: job.jobType,
                status: job.status,
                progress: job.progress || 0,
                progressMessage: job.progressMessage,
                label: job.input?.label || job.input?.task?.slice(0, 50) || job.input?.goal?.slice(0, 50) || job.input?.specialist,
                createdAt: new Date(job.createdAt).toISOString(),
                completedAt: job.completedAt ? new Date(job.completedAt).toISOString() : undefined
            }));
        return {
            success: true,
            data: {
                tasks: formattedJobs,
                count: formattedJobs.length,
                message: formattedJobs.length > 0 ? `Found ${formattedJobs.length} background task(s)` : 'No background tasks found'
            },
            action: {
                type: 'tasks_listed',
                payload: {
                    tasks: formattedJobs
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to list tasks'
        };
    }
}
/**
 * Cancel a background task
 */ async function executeCancelBackgroundTask(args) {
    const jobId = args.jobId;
    if (!jobId) {
        return {
            success: false,
            error: 'Job ID is required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].jobs.cancelJob, {
            jobId
        });
        return {
            success: true,
            data: {
                jobId,
                message: `Task ${jobId} has been cancelled`
            },
            action: {
                type: 'task_cancelled',
                payload: {
                    jobId
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to cancel task'
        };
    }
}
/**
 * Get result of a completed task
 */ async function executeGetTaskResult(args) {
    const jobId = args.jobId;
    if (!jobId) {
        return {
            success: false,
            error: 'Job ID is required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const job = await client.query(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].jobs.getJob, {
            jobId
        });
        if (!job) {
            return {
                success: false,
                error: `Task ${jobId} not found`
            };
        }
        return {
            success: true,
            data: {
                jobId: job.jobId,
                status: job.status,
                progress: job.progress,
                progressMessage: job.progressMessage,
                input: job.input,
                output: job.output,
                createdAt: new Date(job.createdAt).toISOString(),
                completedAt: job.completedAt ? new Date(job.completedAt).toISOString() : undefined,
                message: job.status === 'succeeded' ? 'Task completed successfully' : job.status === 'failed' ? `Task failed: ${job.lastError || 'Unknown error'}` : `Task is ${job.status}`
            },
            action: {
                type: job.status === 'succeeded' ? 'task_completed' : job.status === 'failed' ? 'task_failed' : 'task_progress',
                payload: {
                    jobId: job.jobId,
                    status: job.status,
                    output: job.output
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get task result'
        };
    }
}
/**
 * Start an autonomous code iteration session
 * Creates an ERV AgentTask entity for observability
 */ async function executeIterateOnCode(args) {
    const goal = args.goal;
    const sandboxId = args.sandboxId;
    const maxIterations = Math.min(args.maxIterations || 5, 10);
    const stopOnSuccess = args.stopOnSuccess !== false;
    const commitChanges = args.commitChanges || false;
    const testCommand = args.testCommand;
    if (!goal) {
        return {
            success: false,
            error: 'Goal is required'
        };
    }
    if (!sandboxId) {
        return {
            success: false,
            error: 'Sandbox ID is required - clone a repo first'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const result = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].jobs.queueCodeIteration, {
            goal,
            sandboxId,
            maxIterations,
            stopOnSuccess,
            commitChanges,
            testCommand
        });
        // Create ERV AgentTask entity for code iteration observability
        const agentTaskData = {
            jobId: result.jobId,
            jobType: 'code_iteration',
            status: result.status,
            task: goal,
            label: `Code: ${goal.slice(0, 40)}`,
            priority: 'normal',
            progress: 0,
            sandboxId,
            testCommand,
            maxIterations,
            announceResult: true
        };
        try {
            const entityResult = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.createEntity, {
                entityType: 'AgentTask',
                name: `Code: ${goal.slice(0, 40)}`,
                data: JSON.stringify(agentTaskData),
                tags: [
                    'code-iteration',
                    'autonomous',
                    sandboxId ? 'sandbox' : 'local'
                ],
                importance: 0.7,
                source: 'ai'
            });
            // Link to sandbox
            if (sandboxId) {
                await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.createRelationship, {
                    sourceEntityId: entityResult.entityId,
                    targetEntityId: sandboxId,
                    relationshipType: 'executedIn',
                    bidirectional: false,
                    source: 'ai'
                }).catch(()=>{});
            }
        } catch  {
            console.warn('Failed to create ERV entity for code iteration');
        }
        return {
            success: true,
            data: {
                jobId: result.jobId,
                status: result.status,
                goal,
                sandboxId,
                maxIterations,
                testCommand,
                message: `Code iteration started! Job ID: ${result.jobId}. I'll analyze the code, make changes, and iterate up to ${maxIterations} times until ${testCommand ? `"${testCommand}" passes` : 'the goal is achieved'}.`
            },
            action: {
                type: 'iteration_started',
                payload: {
                    jobId: result.jobId,
                    goal,
                    sandboxId,
                    maxIterations,
                    testCommand
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to start code iteration'
        };
    }
}
/**
 * Delegate a task to a specialist agent
 * Creates an ERV AgentTask entity for observability
 */ async function executeDelegateToSpecialist(args) {
    const specialist = args.specialist;
    const task = args.task;
    const context = args.context;
    const announceResult = args.announceResult !== false;
    const validSpecialists = [
        'code-reviewer',
        'security-auditor',
        'performance-analyst',
        'documentation-writer',
        'test-generator',
        'refactoring-expert'
    ];
    if (!specialist || !validSpecialists.includes(specialist)) {
        return {
            success: false,
            error: `Invalid specialist. Choose from: ${validSpecialists.join(', ')}`
        };
    }
    if (!task) {
        return {
            success: false,
            error: 'Task description is required'
        };
    }
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
        return {
            success: false,
            error: 'Convex URL not configured'
        };
    }
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
        const result = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].jobs.queueSpecialistDelegation, {
            specialist: specialist,
            task,
            context,
            announceResult
        });
        const specialistDescriptions = {
            'code-reviewer': 'reviewing the code for quality, patterns, and potential issues',
            'security-auditor': 'analyzing for security vulnerabilities and best practices',
            'performance-analyst': 'identifying performance bottlenecks and optimizations',
            'documentation-writer': 'generating comprehensive documentation',
            'test-generator': 'creating test cases and improving test coverage',
            'refactoring-expert': 'suggesting and implementing code refactoring'
        };
        // Create ERV AgentTask entity for specialist delegation observability
        const agentTaskData = {
            jobId: result.jobId,
            jobType: 'specialist_delegation',
            status: result.status,
            task,
            label: `${specialist}: ${task.slice(0, 30)}`,
            priority: 'normal',
            progress: 0,
            specialist,
            announceResult,
            context: context
        };
        try {
            const entityResult = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.createEntity, {
                entityType: 'AgentTask',
                name: `${specialist}: ${task.slice(0, 30)}`,
                data: JSON.stringify(agentTaskData),
                tags: [
                    'specialist',
                    specialist,
                    'delegation'
                ],
                importance: specialist === 'security-auditor' ? 0.9 : 0.6,
                source: 'ai'
            });
            // Create relationship to indicate delegation type
            await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.createRelationship, {
                sourceEntityId: entityResult.entityId,
                targetEntityId: specialist,
                relationshipType: 'delegatedTo',
                bidirectional: false,
                label: specialist,
                source: 'ai'
            }).catch(()=>{});
            // Link to context entities if provided
            if (context?.projectId) {
                await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.createRelationship, {
                    sourceEntityId: entityResult.entityId,
                    targetEntityId: context.projectId,
                    relationshipType: 'spawnedFor',
                    bidirectional: false,
                    source: 'ai'
                }).catch(()=>{});
            }
            if (context?.sandboxId) {
                await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].erv.createRelationship, {
                    sourceEntityId: entityResult.entityId,
                    targetEntityId: context.sandboxId,
                    relationshipType: 'executedIn',
                    bidirectional: false,
                    source: 'ai'
                }).catch(()=>{});
            }
        } catch  {
            console.warn('Failed to create ERV entity for specialist delegation');
        }
        return {
            success: true,
            data: {
                jobId: result.jobId,
                status: result.status,
                specialist,
                task,
                message: `Delegated to ${specialist}! Job ID: ${result.jobId}. The specialist is ${specialistDescriptions[specialist]}. I'll announce the findings when complete.`
            },
            action: {
                type: 'specialist_delegated',
                payload: {
                    jobId: result.jobId,
                    specialist,
                    task,
                    announceResult
                }
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delegate to specialist'
        };
    }
}
/**
 * Cowrite Music - Conversational music creation assistant
 * Guides users through crafting the perfect music generation request
 */ async function executeCowriteMusic(args, context) {
    // SECURITY: Owner only
    if (context.accessLevel !== 'owner') {
        return {
            success: false,
            error: 'Music creation is only available to the owner.'
        };
    }
    const params = args;
    // Parse currentDraft from JSON string (tool definition changed to string type for TypeScript compatibility)
    let draft = {};
    if (params.currentDraft) {
        try {
            const parsed = typeof params.currentDraft === 'string' ? JSON.parse(params.currentDraft) : params.currentDraft;
            draft = parsed;
        } catch  {
            // If parsing fails, start with empty draft
            draft = {};
        }
    }
    const input = params.userInput || '';
    // Build helpful guidance based on step
    switch(params.step){
        case 'start':
            return {
                success: true,
                data: {
                    step: 'start',
                    draft,
                    guidance: {
                        message: "Let's create some music together! Tell me about your vision.",
                        questions: [
                            "What genre or style are you thinking? (e.g., lofi hip-hop, cinematic orchestral, indie folk)",
                            "What mood or feeling should it evoke? (e.g., chill, energetic, melancholic, triumphant)",
                            "Is this for something specific? (podcast intro, background music, a full song with lyrics)"
                        ],
                        suggestions: [
                            "chill lofi beats for studying",
                            "epic cinematic trailer music",
                            "upbeat indie pop with catchy hooks",
                            "ambient electronic soundscape",
                            "acoustic folk ballad"
                        ]
                    },
                    nextSteps: [
                        'refine_style',
                        'add_lyrics'
                    ]
                }
            };
        case 'refine_style':
            // Parse user input to build style description
            const styleKeywords = extractStyleKeywords(input);
            const enhancedPrompt = buildEnhancedPrompt(input, styleKeywords);
            return {
                success: true,
                data: {
                    step: 'refine_style',
                    draft: {
                        ...draft,
                        prompt: enhancedPrompt
                    },
                    guidance: {
                        message: "Great! I've crafted a style description. Here's what I have:",
                        currentPrompt: enhancedPrompt,
                        questions: [
                            "Should we add or change any instruments?",
                            "Any specific production style? (lo-fi, polished, raw, vintage)",
                            "What tempo/energy level? (slow and dreamy, mid-tempo groove, fast and energetic)"
                        ],
                        suggestions: generateStyleSuggestions(styleKeywords)
                    },
                    nextSteps: [
                        'add_lyrics',
                        'set_structure',
                        'add_reference',
                        'finalize'
                    ]
                }
            };
        case 'add_lyrics':
            // Help structure lyrics with proper tags
            const structuredLyrics = structureLyrics(input, draft.lyrics);
            return {
                success: true,
                data: {
                    step: 'add_lyrics',
                    draft: {
                        ...draft,
                        lyrics: structuredLyrics || draft.lyrics
                    },
                    guidance: {
                        message: structuredLyrics ? "I've structured your lyrics with song sections:" : "Let's write some lyrics! I can help with structure.",
                        currentLyrics: structuredLyrics || draft.lyrics,
                        tips: [
                            "Use [Verse], [Chorus], [Bridge], [Intro], [Outro] tags for structure",
                            "Keep verses 4-8 lines, choruses memorable and repeatable",
                            "Consider syllable count for natural flow",
                            "Leave blank for instrumental tracks"
                        ],
                        example: `[Intro]\n(Instrumental)\n\n[Verse 1]\nWalking through the morning light\nEverything feels just right\n\n[Chorus]\nThis is where I want to be\nFinally feeling free`
                    },
                    nextSteps: [
                        'set_structure',
                        'add_reference',
                        'finalize'
                    ]
                }
            };
        case 'set_structure':
            // Help set technical parameters
            const suggestedBpm = suggestBpmFromStyle(draft.prompt || input);
            const suggestedKey = suggestKeyFromMood(draft.prompt || input);
            const suggestedDuration = suggestDurationFromType(input, draft.lyrics);
            return {
                success: true,
                data: {
                    step: 'set_structure',
                    draft: {
                        ...draft,
                        bpm: draft.bpm || suggestedBpm,
                        key: draft.key || suggestedKey,
                        duration: draft.duration || suggestedDuration,
                        timeSignature: draft.timeSignature || '4/4'
                    },
                    guidance: {
                        message: "Let's dial in the technical specs:",
                        suggestions: {
                            bpm: {
                                suggested: suggestedBpm,
                                range: "60-200",
                                description: "Tempo/speed of the track"
                            },
                            key: {
                                suggested: suggestedKey,
                                common: [
                                    "C major",
                                    "G major",
                                    "A minor",
                                    "E minor",
                                    "F major"
                                ]
                            },
                            duration: {
                                suggested: suggestedDuration,
                                range: "10-600 seconds",
                                note: "30s = short clip, 180s = full song"
                            },
                            timeSignature: {
                                suggested: "4/4",
                                options: [
                                    "4/4 (standard)",
                                    "3/4 (waltz)",
                                    "6/8 (compound)"
                                ]
                            }
                        }
                    },
                    nextSteps: [
                        'add_reference',
                        'finalize'
                    ]
                }
            };
        case 'add_reference':
            // Handle reference audio
            const refUrl = extractUrl(input) || draft.referenceAudioUrl;
            return {
                success: true,
                data: {
                    step: 'add_reference',
                    draft: {
                        ...draft,
                        referenceAudioUrl: refUrl,
                        referenceStrength: draft.referenceStrength || 0.5
                    },
                    guidance: {
                        message: refUrl ? "Reference audio set! The AI will match this track's vibe." : "Want to use a reference track? The AI can match the style of an existing song.",
                        currentReference: refUrl,
                        tips: [
                            "Provide a URL to an MP3, WAV, or audio file",
                            "The AI will capture the vibe, energy, and production style",
                            "Reference strength (0-1): higher = closer match, lower = more creative freedom",
                            "Skip this step if you want fully original style"
                        ],
                        strengthGuide: {
                            "0.2-0.3": "Subtle influence, mostly original",
                            "0.4-0.6": "Balanced (recommended)",
                            "0.7-0.9": "Strong style match"
                        }
                    },
                    nextSteps: [
                        'finalize'
                    ]
                }
            };
        case 'finalize':
            // Show complete draft for review
            return {
                success: true,
                data: {
                    step: 'finalize',
                    draft,
                    readyToGenerate: !!(draft.prompt && draft.prompt.length > 0),
                    guidance: {
                        message: "Here's your complete music request. Ready to generate?",
                        summary: {
                            style: draft.prompt || "Not set",
                            lyrics: draft.lyrics ? `${draft.lyrics.split('\n').length} lines` : "Instrumental",
                            duration: draft.duration ? `${draft.duration} seconds` : "30 seconds (default)",
                            bpm: draft.bpm || "Auto-detect",
                            key: draft.key || "Auto-detect",
                            timeSignature: draft.timeSignature || "4/4",
                            reference: draft.referenceAudioUrl ? "Yes" : "No"
                        },
                        estimatedTime: estimateGenerationTime(draft.duration || 30)
                    },
                    nextSteps: [
                        'generate'
                    ]
                }
            };
        case 'generate':
            // User confirmed, trigger actual generation
            if (!draft.prompt) {
                return {
                    success: false,
                    error: 'No style prompt set. Use refine_style step first.'
                };
            }
            return {
                success: true,
                data: {
                    step: 'generate',
                    action: 'TRIGGER_GENERATION',
                    payload: {
                        prompt: draft.prompt,
                        lyrics: draft.lyrics,
                        duration: draft.duration || 30,
                        bpm: draft.bpm,
                        key: draft.key,
                        timeSignature: draft.timeSignature || '4/4',
                        referenceAudioUrl: draft.referenceAudioUrl,
                        referenceStrength: draft.referenceStrength,
                        title: draft.title
                    },
                    message: "Starting music generation! This may take a few minutes on CPU."
                }
            };
        default:
            return {
                success: false,
                error: `Unknown cowrite step: ${params.step}`
            };
    }
}
// Helper functions for cowrite_music
function extractStyleKeywords(input) {
    const keywords = [];
    const genrePatterns = /\b(lofi|lo-fi|hip-hop|hiphop|pop|rock|jazz|blues|electronic|edm|house|techno|ambient|classical|orchestral|cinematic|folk|country|r&b|rnb|soul|funk|reggae|metal|punk|indie|alternative|acoustic|synth|trap|drill|dubstep|dnb|drum and bass)\b/gi;
    const moodPatterns = /\b(chill|relaxing|energetic|upbeat|melancholic|sad|happy|dark|bright|dreamy|ethereal|aggressive|peaceful|nostalgic|epic|dramatic|romantic|playful|mysterious|intense|mellow)\b/gi;
    const instrumentPatterns = /\b(piano|guitar|synth|drums|bass|strings|violin|cello|flute|saxophone|trumpet|organ|vocals|choir|beats|808|percussion)\b/gi;
    const genres = input.match(genrePatterns) || [];
    const moods = input.match(moodPatterns) || [];
    const instruments = input.match(instrumentPatterns) || [];
    return [
        ...new Set([
            ...genres,
            ...moods,
            ...instruments
        ].map((k)=>k.toLowerCase()))
    ];
}
function buildEnhancedPrompt(input, keywords) {
    // If input is already detailed, use it; otherwise enhance
    if (input.length > 50) return input;
    const parts = [];
    // Add genre if found
    const genres = keywords.filter((k)=>[
            'lofi',
            'pop',
            'rock',
            'jazz',
            'electronic',
            'ambient',
            'classical',
            'folk',
            'hip-hop'
        ].some((g)=>k.includes(g)));
    if (genres.length > 0) parts.push(genres.join(' '));
    // Add mood
    const moods = keywords.filter((k)=>[
            'chill',
            'energetic',
            'melancholic',
            'dreamy',
            'epic',
            'peaceful'
        ].some((m)=>k.includes(m)));
    if (moods.length > 0) parts.push(`${moods.join(', ')} mood`);
    // Add instruments
    const instruments = keywords.filter((k)=>[
            'piano',
            'guitar',
            'synth',
            'drums',
            'strings',
            'vocals'
        ].some((i)=>k.includes(i)));
    if (instruments.length > 0) parts.push(`featuring ${instruments.join(', ')}`);
    return parts.length > 0 ? parts.join(', ') : input;
}
function generateStyleSuggestions(keywords) {
    const suggestions = [];
    if (keywords.includes('lofi') || keywords.includes('chill')) {
        suggestions.push("Add vinyl crackle and warm tape saturation");
        suggestions.push("Include jazzy chord progressions");
    }
    if (keywords.includes('electronic') || keywords.includes('synth')) {
        suggestions.push("Add arpeggiated synth leads");
        suggestions.push("Include sidechained bass and punchy kicks");
    }
    if (keywords.includes('acoustic') || keywords.includes('folk')) {
        suggestions.push("Add fingerpicked guitar patterns");
        suggestions.push("Include soft harmonies and warm vocals");
    }
    if (keywords.includes('cinematic') || keywords.includes('epic')) {
        suggestions.push("Add sweeping string arrangements");
        suggestions.push("Include building percussion and brass");
    }
    if (suggestions.length === 0) {
        suggestions.push("Add more detail about the production style");
        suggestions.push("Specify the main instruments you'd like");
        suggestions.push("Describe the energy/vibe in more detail");
    }
    return suggestions;
}
function structureLyrics(input, existingLyrics) {
    // If input contains structure tags, return as-is
    if (input.includes('[Verse]') || input.includes('[Chorus]')) {
        return input;
    }
    // If input looks like lyrics (multiple lines), add basic structure
    const lines = input.split('\n').filter((l)=>l.trim());
    if (lines.length >= 4) {
        const structured = [];
        for(let i = 0; i < lines.length; i++){
            if (i === 0) structured.push('[Verse 1]');
            else if (i === 4 && lines.length > 6) structured.push('\n[Chorus]');
            else if (i === 8 && lines.length > 10) structured.push('\n[Verse 2]');
            structured.push(lines[i]);
        }
        return structured.join('\n');
    }
    return existingLyrics || null;
}
function suggestBpmFromStyle(style) {
    const lower = style.toLowerCase();
    if (lower.includes('ballad') || lower.includes('slow') || lower.includes('ambient')) return 70;
    if (lower.includes('lofi') || lower.includes('chill') || lower.includes('jazz')) return 85;
    if (lower.includes('pop') || lower.includes('indie') || lower.includes('folk')) return 110;
    if (lower.includes('rock') || lower.includes('funk')) return 120;
    if (lower.includes('house') || lower.includes('electronic')) return 125;
    if (lower.includes('dnb') || lower.includes('drum and bass')) return 170;
    if (lower.includes('trap') || lower.includes('hip-hop') || lower.includes('hiphop')) return 140;
    return 100; // Default
}
function suggestKeyFromMood(style) {
    const lower = style.toLowerCase();
    if (lower.includes('sad') || lower.includes('melancholic') || lower.includes('dark')) return 'A minor';
    if (lower.includes('happy') || lower.includes('bright') || lower.includes('upbeat')) return 'C major';
    if (lower.includes('dreamy') || lower.includes('ethereal')) return 'E major';
    if (lower.includes('epic') || lower.includes('dramatic')) return 'D minor';
    if (lower.includes('peaceful') || lower.includes('calm')) return 'G major';
    return 'C major'; // Default
}
function suggestDurationFromType(input, lyrics) {
    const lower = input.toLowerCase();
    if (lower.includes('intro') || lower.includes('jingle') || lower.includes('short')) return 15;
    if (lower.includes('loop') || lower.includes('clip')) return 30;
    if (lower.includes('full song') || lower.includes('complete')) return 180;
    if (lyrics && lyrics.length > 200) return 180; // Long lyrics = full song
    if (lyrics && lyrics.length > 50) return 90; // Some lyrics
    return 30; // Default
}
function extractUrl(input) {
    const urlMatch = input.match(/https?:\/\/[^\s]+/);
    return urlMatch ? urlMatch[0] : null;
}
function estimateGenerationTime(duration) {
    // Rough estimate: CPU takes about 2-3x the duration
    const estimate = Math.ceil(duration * 3 / 60);
    if (estimate <= 1) return "About 1-2 minutes";
    return `About ${estimate}-${estimate + 1} minutes`;
}
async function executeGenerateMusic(args, context) {
    // SECURITY: Owner only
    if (context.accessLevel !== 'owner') {
        return {
            success: false,
            error: 'Music generation is only available to the owner.'
        };
    }
    const params = args;
    if (!params.prompt) {
        return {
            success: false,
            error: 'Prompt is required for music generation.'
        };
    }
    // Validate duration
    const duration = params.duration || 30;
    if (duration < 10 || duration > 600) {
        return {
            success: false,
            error: 'Duration must be between 10 and 600 seconds.'
        };
    }
    try {
        console.log('[MusicGen] Starting generation:', {
            prompt: params.prompt.slice(0, 100),
            duration,
            bpm: params.bpm,
            key: params.key,
            hasReference: !!params.referenceAudioUrl
        });
        // Call our API endpoint
        const response = await fetch(`${getBaseUrl()}/api/music/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'generate',
                prompt: params.prompt,
                lyrics: params.lyrics,
                duration,
                bpm: params.bpm,
                key: params.key,
                timeSignature: params.timeSignature,
                referenceAudio: params.referenceAudioUrl,
                referenceStrength: params.referenceStrength ?? 0.5,
                title: params.title,
                saveToJamz: params.saveToJamz,
                projectId: params.projectId
            })
        });
        if (!response.ok) {
            const error = await response.json();
            return {
                success: false,
                error: error.error || 'Music generation failed.'
            };
        }
        const result = await response.json();
        // If saveToJamz is true, create the track in Convex
        if (params.saveToJamz && result.audioUrl) {
            try {
                const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
                if (!convexUrl) throw new Error('Convex URL not configured');
                const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](convexUrl);
                const trackName = params.title || `AI: ${params.prompt.slice(0, 30)}`;
                // Create or get default project
                let projectId = params.projectId;
                if (!projectId) {
                    // Create a new project for AI-generated tracks
                    const project = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].jamz.createProject, {
                        name: 'AI Generated Music',
                        bpm: result.metadata.bpm,
                        timeSignatureBeats: parseInt(result.metadata.timeSignature.split('/')[0]) || 4,
                        timeSignatureUnit: parseInt(result.metadata.timeSignature.split('/')[1]) || 4
                    });
                    projectId = project;
                }
                // Create the track
                const track = await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].jamz.createTrack, {
                    projectId: projectId,
                    name: trackName,
                    type: 'audio',
                    color: '#8B5CF6'
                });
                // Create the clip
                await client.mutation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$convex$2d$shim$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["api"].jamz.createClip, {
                    trackId: track,
                    name: trackName,
                    startBeat: 0,
                    lengthBeats: Math.round(result.duration * result.metadata.bpm / 60),
                    audioUrl: result.audioUrl
                });
                console.log('[MusicGen] Saved to Jamz Studio:', track);
            } catch (err) {
                console.error('[MusicGen] Failed to save to Jamz:', err);
            // Don't fail the whole operation, just note it
            }
        }
        return {
            success: true,
            data: {
                id: result.id,
                audioUrl: result.audioUrl,
                duration: result.duration,
                metadata: result.metadata,
                title: result.title || params.title,
                provider: result.provider,
                message: `Generated ${result.duration}s of music at ${result.metadata.bpm} BPM in ${result.metadata.key}.`
            },
            action: {
                type: 'music_generated',
                payload: {
                    id: result.id,
                    audioUrl: result.audioUrl,
                    duration: result.duration,
                    metadata: result.metadata,
                    title: result.title || params.title
                }
            }
        };
    } catch (error) {
        console.error('[MusicGen] Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Music generation failed.'
        };
    }
}
async function executeAnalyzeAudio(args, context) {
    // SECURITY: Owner only
    if (context.accessLevel !== 'owner') {
        return {
            success: false,
            error: 'Audio analysis is only available to the owner.'
        };
    }
    const params = args;
    if (!params.audioUrl) {
        return {
            success: false,
            error: 'audioUrl is required for analysis.'
        };
    }
    try {
        console.log('[MusicGen] Analyzing audio:', params.audioUrl);
        const response = await fetch(`${getBaseUrl()}/api/music/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'analyze',
                audioUrl: params.audioUrl,
                extract: params.extract || [
                    'bpm',
                    'key',
                    'time_signature',
                    'caption'
                ]
            })
        });
        if (!response.ok) {
            const error = await response.json();
            return {
                success: false,
                error: error.error || 'Audio analysis failed.'
            };
        }
        const result = await response.json();
        return {
            success: true,
            data: {
                ...result,
                message: `Analysis complete: ${result.bpm ? `${result.bpm} BPM` : ''}${result.key ? `, ${result.key}` : ''}${result.caption ? `. ${result.caption}` : ''}`
            },
            action: {
                type: 'audio_analyzed',
                payload: result
            }
        };
    } catch (error) {
        console.error('[MusicGen] Analysis error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Audio analysis failed.'
        };
    }
}
async function executeSeparateStems(args, context) {
    // SECURITY: Owner only
    if (context.accessLevel !== 'owner') {
        return {
            success: false,
            error: 'Stem separation is only available to the owner.'
        };
    }
    const params = args;
    if (!params.audioUrl) {
        return {
            success: false,
            error: 'audioUrl is required for stem separation.'
        };
    }
    try {
        console.log('[MusicGen] Separating stems:', params.audioUrl);
        const response = await fetch(`${getBaseUrl()}/api/music/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'separate',
                audioUrl: params.audioUrl,
                stems: params.stems || [
                    'vocals',
                    'drums',
                    'bass',
                    'other'
                ]
            })
        });
        if (!response.ok) {
            const error = await response.json();
            return {
                success: false,
                error: error.error || 'Stem separation failed.'
            };
        }
        const result = await response.json();
        const stemCount = Object.keys(result.stems).length;
        return {
            success: true,
            data: {
                stems: result.stems,
                provider: result.provider,
                message: `Separated ${stemCount} stems: ${Object.keys(result.stems).join(', ')}`
            },
            action: {
                type: 'stems_separated',
                payload: result
            }
        };
    } catch (error) {
        console.error('[MusicGen] Separation error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Stem separation failed.'
        };
    }
}
// Helper to get base URL for internal API calls
function getBaseUrl() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Server-side: use environment variable or default
    return process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/passcodeAuth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ADMIN_COOKIE",
    ()=>ADMIN_COOKIE,
    "AREA_COOKIE_PREFIX",
    ()=>AREA_COOKIE_PREFIX,
    "IPOD_COOKIE",
    ()=>IPOD_COOKIE,
    "createAdminSession",
    ()=>createAdminSession,
    "createAreaSession",
    ()=>createAreaSession,
    "createiPodSession",
    ()=>createiPodSession,
    "getAreaCookieName",
    ()=>getAreaCookieName,
    "hashPasscode",
    ()=>hashPasscode,
    "isValidPasscodeFormat",
    ()=>isValidPasscodeFormat,
    "signSession",
    ()=>signSession,
    "verifyPasscode",
    ()=>verifyPasscode,
    "verifySession",
    ()=>verifySession
]);
/**
 * Passcode Authentication System
 *
 * Handles 6-digit passcode verification for protected areas and iPod collaborators.
 * Uses HMAC-SHA256 for secure hashing and timing-safe comparison.
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
// SECURITY: Require PASSCODE_SECRET to be set - no default fallback
function getPasscodeSecret() {
    const secret = process.env.PASSCODE_SECRET;
    if (!secret) {
        throw new Error('PASSCODE_SECRET environment variable is required');
    }
    if (secret.length < 32) {
        throw new Error('PASSCODE_SECRET must be at least 32 characters long');
    }
    return secret;
}
// Lazy-initialize to allow env vars to be set before first use
let cachedSecret = null;
function getSecret() {
    if (!cachedSecret) {
        cachedSecret = getPasscodeSecret();
    }
    return cachedSecret;
}
const ADMIN_COOKIE = 'jamos_admin';
const AREA_COOKIE_PREFIX = 'jamos_area_';
const IPOD_COOKIE = 'jamos_ipod';
// Session duration (24 hours for admin, 7 days for areas/iPod)
const ADMIN_SESSION_DURATION = 24 * 60 * 60 * 1000;
const AREA_SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;
function hashPasscode(passcode) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHmac('sha256', getSecret()).update(passcode).digest('hex');
}
function verifyPasscode(passcode, hash) {
    const inputHash = hashPasscode(passcode);
    const inputBuffer = Buffer.from(inputHash);
    const hashBuffer = Buffer.from(hash);
    if (inputBuffer.length !== hashBuffer.length) {
        return false;
    }
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].timingSafeEqual(inputBuffer, hashBuffer);
}
function signSession(payload) {
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHmac('sha256', getSecret()).update(payloadB64).digest('base64url');
    return `${payloadB64}.${signature}`;
}
function verifySession(token) {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadB64, signature] = parts;
    // Verify signature
    const expectedSig = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHmac('sha256', getSecret()).update(payloadB64).digest('base64url');
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSig);
    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].timingSafeEqual(sigBuffer, expectedBuffer)) return null;
    // Decode payload
    try {
        const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
        // Check expiry
        if (Date.now() > payload.exp) return null;
        return payload;
    } catch  {
        return null;
    }
}
function createAdminSession(username) {
    return signSession({
        type: 'admin',
        subject: username,
        exp: Date.now() + ADMIN_SESSION_DURATION
    });
}
function createAreaSession(areaSlug) {
    return signSession({
        type: 'area',
        subject: areaSlug,
        exp: Date.now() + AREA_SESSION_DURATION
    });
}
function createiPodSession(collaboratorSlug) {
    return signSession({
        type: 'ipod',
        subject: collaboratorSlug,
        exp: Date.now() + AREA_SESSION_DURATION
    });
}
function getAreaCookieName(areaSlug) {
    return `${AREA_COOKIE_PREFIX}${areaSlug}`;
}
function isValidPasscodeFormat(passcode) {
    return /^\d{6}$/.test(passcode);
}
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/src/lib/openclaw/client-impl.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OpenClawClientImpl",
    ()=>OpenClawClientImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/nanoid@5.1.6/node_modules/nanoid/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$isomorphic$2d$ws$40$5$2e$0$2e$0_ws$40$8$2e$19$2e$0$2f$node_modules$2f$isomorphic$2d$ws$2f$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/isomorphic-ws@5.0.0_ws@8.19.0/node_modules/isomorphic-ws/node.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
;
;
;
// Protocol constants based on OpenClaw source
const PROTOCOL_VERSION = 3;
class OpenClawClientImpl {
    ws = null;
    url;
    authToken;
    pendingRequests = new Map();
    eventListeners = new Map();
    isConnected = false;
    connectPromise = null;
    constructor(config){
        this.url = config.url;
        this.authToken = config.authToken;
    }
    async connect() {
        if (this.isConnected) return;
        if (this.connectPromise) return this.connectPromise;
        this.connectPromise = new Promise((resolve, reject)=>{
            try {
                // Set origin to satisfy gateway check for Control UI
                const options = {
                    headers: {
                        Origin: 'http://localhost:18789'
                    }
                };
                this.ws = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$isomorphic$2d$ws$40$5$2e$0$2e$0_ws$40$8$2e$19$2e$0$2f$node_modules$2f$isomorphic$2d$ws$2f$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"](this.url, options);
                this.ws.onopen = ()=>{
                    console.log('[OpenClawClient] WebSocket connected');
                };
                this.ws.onmessage = (event)=>{
                    try {
                        let data;
                        const rawData = event.data;
                        // console.log('[OpenClawClient] Raw message type:', typeof rawData);
                        if (typeof rawData === 'string') {
                            data = JSON.parse(rawData);
                        } else if (__TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].isBuffer(rawData)) {
                            // console.log('[OpenClawClient] Buffer received, length:', rawData.length);
                            data = JSON.parse(rawData.toString());
                        } else if (rawData instanceof ArrayBuffer) {
                            // console.log('[OpenClawClient] ArrayBuffer received, byteLength:', rawData.byteLength);
                            const decoder = new TextDecoder();
                            data = JSON.parse(decoder.decode(rawData));
                        } else if (Array.isArray(rawData)) {
                            // Buffer[]
                            // console.log('[OpenClawClient] Buffer array received');
                            data = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].concat(rawData).toString());
                        } else {
                            // unknown
                            console.warn('[OpenClawClient] Unknown message type:', typeof rawData);
                            return;
                        }
                        // console.log('[OpenClawClient] Parsed message:', data?.type, data?.event || data?.method);
                        this.handleMessage(data, resolve, reject);
                    } catch (err) {
                        console.error('[OpenClawClient] Failed to parse message:', err);
                    }
                };
                this.ws.onerror = (error)=>{
                    console.error('[OpenClawClient] WebSocket error:', error);
                    if (!this.isConnected) reject(error);
                };
                this.ws.onclose = ()=>{
                    console.log('[OpenClawClient] WebSocket closed');
                    this.isConnected = false;
                    this.connectPromise = null;
                };
            } catch (err) {
                reject(err);
            }
        });
        return this.connectPromise;
    }
    handleMessage(message, connectResolve, connectReject) {
        // console.log('[OpenClawClient] Received:', message);
        if (message.type === 'event' && message.event === 'connect.challenge') {
            this.handleChallenge(message.payload, connectResolve, connectReject);
            return;
        }
        if (message.type === 'res') {
            const pending = this.pendingRequests.get(message.id);
            if (pending) {
                if (message.ok) {
                    pending.resolve(message.body || message.payload); // Adapting to potential response format
                } else {
                    pending.reject(new Error(message.error?.message || 'Unknown error'));
                }
                this.pendingRequests.delete(message.id);
            }
            return;
        }
        if (message.type === 'event') {
            const listeners = this.eventListeners.get(message.event);
            if (listeners) {
                listeners.forEach((handler)=>handler(message.payload));
            }
        }
    }
    handleChallenge(payload, resolve, reject) {
        const connectReq = {
            type: 'req',
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            method: 'connect',
            params: {
                minProtocol: PROTOCOL_VERSION,
                maxProtocol: PROTOCOL_VERSION,
                role: 'operator',
                client: {
                    id: 'webchat',
                    displayName: 'OpenClaw OS',
                    version: '0.1.0',
                    platform: 'web',
                    mode: 'ui',
                    deviceFamily: 'browser'
                },
                auth: {
                    token: this.authToken
                }
            }
        };
        if (this.ws) {
            this.send(connectReq);
            // We assume connection is successful if we don't get an immediate error? 
            // Or should we wait for a response? The protocol usually sends a generic 'res' for the connect req.
            // Register a temporary handler for the connect response
            this.pendingRequests.set(connectReq.id, {
                resolve: ()=>{
                    this.isConnected = true;
                    resolve();
                },
                reject: (err)=>{
                    this.isConnected = false;
                    reject(err);
                }
            });
        }
    }
    send(message) {
        if (this.ws && this.ws.readyState === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$isomorphic$2d$ws$40$5$2e$0$2e$0_ws$40$8$2e$19$2e$0$2f$node_modules$2f$isomorphic$2d$ws$2f$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('[OpenClawClient] Cannot send, socket not open');
        }
    }
    async request(method, params = {}) {
        await this.connect();
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
        return new Promise((resolve, reject)=>{
            this.pendingRequests.set(id, {
                resolve,
                reject
            });
            this.send({
                type: 'req',
                id,
                method,
                params
            });
        // specific logic for timeout could be added here
        });
    }
    subscribe(event, handler) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(handler);
        return ()=>{
            this.eventListeners.get(event)?.delete(handler);
        };
    }
}
}),
"[project]/src/lib/openclaw/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConvexHttpClient",
    ()=>ConvexHttpClient,
    "ConvexProvider",
    ()=>ConvexProvider,
    "ConvexProviderWithClerk",
    ()=>ConvexProviderWithClerk,
    "ConvexReactClient",
    ()=>ConvexReactClient,
    "makeFunctionReference",
    ()=>makeFunctionReference,
    "openClaw",
    ()=>openClaw,
    "useOpenClaw",
    ()=>useOpenClaw
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2d$impl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/openclaw/client-impl.ts [app-route] (ecmascript)");
;
// Default to local gateway if not configured
const GATEWAY_URL = process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_URL || 'ws://localhost:3000';
const GATEWAY_TOKEN = process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_TOKEN || 'openclaw-admin-token'; // Default for dev
class OpenClawClient {
    static instance;
    static getInstance() {
        if (!OpenClawClient.instance) {
            OpenClawClient.instance = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2d$impl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OpenClawClientImpl"]({
                url: GATEWAY_URL,
                authToken: GATEWAY_TOKEN
            });
        }
        return OpenClawClient.instance;
    }
}
const openClaw = OpenClawClient.getInstance();
const useOpenClaw = ()=>{
    return openClaw;
};
class ConvexHttpClient {
    url;
    constructor(url){
        this.url = url;
    }
    // Add methods as needed
    async query(name, args) {
        console.warn("ConvexHttpClient.query shim called", name, args);
        return null;
    }
    async mutation(name, args) {
        console.warn("ConvexHttpClient.mutation shim called", name, args);
        return null;
    }
    async action(name, args) {
        console.warn("ConvexHttpClient.action shim called", name, args);
        return null;
    }
}
function makeFunctionReference(name) {
    return name;
}
class ConvexReactClient {
    url;
    constructor(url){
        this.url = url;
    }
}
const ConvexProvider = ({ client, children })=>children;
const ConvexProviderWithClerk = ({ client, children })=>children;
}),
"[project]/src/lib/security.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkRateLimit",
    ()=>checkRateLimit,
    "clearFailedAttempts",
    ()=>clearFailedAttempts,
    "generateFingerprint",
    ()=>generateFingerprint,
    "getClientIp",
    ()=>getClientIp,
    "logSecurityEvent",
    ()=>logSecurityEvent,
    "lookupGeo",
    ()=>lookupGeo,
    "parseUserAgent",
    ()=>parseUserAgent,
    "recordFailedAttempt",
    ()=>recordFailedAttempt
]);
/**
 * Security Monitoring Library
 *
 * Client-side utilities for security event logging and device fingerprinting.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/openclaw/client.ts [app-route] (ecmascript)");
;
;
// Lazy-initialized Convex client for server-side logging
let _convexSecurityClient = null;
function getSecurityConvexClient() {
    if (_convexSecurityClient === null && process.env.NEXT_PUBLIC_CONVEX_URL) {
        _convexSecurityClient = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ConvexHttpClient"](process.env.NEXT_PUBLIC_CONVEX_URL);
    }
    return _convexSecurityClient;
}
function parseUserAgent(ua) {
    const info = {};
    // Detect device type
    if (/bot|crawler|spider|crawling/i.test(ua)) {
        info.deviceType = "bot";
    } else if (/mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(ua)) {
        if (/ipad|tablet|playbook|silk/i.test(ua)) {
            info.deviceType = "tablet";
        } else {
            info.deviceType = "mobile";
        }
    } else {
        info.deviceType = "desktop";
    }
    // Detect browser
    if (/firefox/i.test(ua)) {
        info.browser = "Firefox";
    } else if (/edg/i.test(ua)) {
        info.browser = "Edge";
    } else if (/chrome|chromium|crios/i.test(ua)) {
        info.browser = "Chrome";
    } else if (/safari/i.test(ua)) {
        info.browser = "Safari";
    } else if (/opera|opr/i.test(ua)) {
        info.browser = "Opera";
    } else if (/msie|trident/i.test(ua)) {
        info.browser = "IE";
    } else {
        info.browser = "Unknown";
    }
    // Detect OS
    if (/windows/i.test(ua)) {
        info.os = "Windows";
    } else if (/macintosh|mac os x/i.test(ua)) {
        info.os = "macOS";
    } else if (/linux/i.test(ua)) {
        info.os = "Linux";
    } else if (/android/i.test(ua)) {
        info.os = "Android";
    } else if (/iphone|ipad|ipod/i.test(ua)) {
        info.os = "iOS";
    } else {
        info.os = "Unknown";
    }
    return info;
}
function generateFingerprint(ip, ua, acceptLanguage) {
    // Create a simple hash from available data
    const data = `${ip}|${ua}|${acceptLanguage || ""}`;
    let hash = 0;
    for(let i = 0; i < data.length; i++){
        const char = data.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, "0");
}
async function logSecurityEvent(payload, request, geoData) {
    try {
        const client = getSecurityConvexClient();
        if (!client) {
            console.warn("[Security] Convex client not available, logging to console only");
            console.log("[Security Event]", payload.eventType, payload.message);
            return;
        }
        const ip = getClientIp(request);
        const userAgent = request.headers.get("user-agent") || "unknown";
        const deviceInfo = parseUserAgent(userAgent);
        const fingerprint = generateFingerprint(ip, userAgent);
        // Use makeFunctionReference to avoid type generation dependency
        const logSecurityEventMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["makeFunctionReference"])("security:logSecurityEvent");
        await client.mutation(logSecurityEventMutation, {
            eventType: payload.eventType,
            severity: payload.severity,
            actorType: payload.actorType,
            actorId: payload.actorId,
            actorEmail: payload.actorEmail,
            message: payload.message,
            metadata: payload.metadata,
            targetResource: payload.targetResource,
            targetId: payload.targetId,
            ipAddress: ip,
            userAgent,
            fingerprint,
            deviceType: deviceInfo.deviceType,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            country: geoData?.country,
            region: geoData?.region,
            city: geoData?.city
        });
        console.log("[Security] Event logged:", payload.eventType, payload.severity);
    } catch (error) {
        // Log to console as fallback, never fail silently
        console.error("[Security] Failed to log event to Convex:", error);
        console.log("[Security Event Fallback]", payload.eventType, payload.message);
    }
}
function getClientIp(request) {
    // Try various headers in order of preference
    const headers = request.headers;
    // Vercel
    const vercelIp = headers.get("x-vercel-forwarded-for");
    if (vercelIp) {
        return vercelIp.split(",")[0].trim();
    }
    // Cloudflare
    const cfIp = headers.get("cf-connecting-ip");
    if (cfIp) {
        return cfIp;
    }
    // Standard proxy header
    const forwardedFor = headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }
    // Real IP header
    const realIp = headers.get("x-real-ip");
    if (realIp) {
        return realIp;
    }
    // Fallback
    return "unknown";
}
// =============================================================================
// Rate Limiting Helper
// =============================================================================
// In-memory rate limit tracker (use Redis in production)
const rateLimitMap = new Map();
function checkRateLimit(key, config) {
    const now = Date.now();
    const existing = rateLimitMap.get(key);
    if (!existing || existing.resetAt < now) {
        // New window
        const resetAt = now + config.windowMs;
        rateLimitMap.set(key, {
            count: 1,
            resetAt
        });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetAt
        };
    }
    if (existing.count >= config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: existing.resetAt
        };
    }
    existing.count++;
    return {
        allowed: true,
        remaining: config.maxRequests - existing.count,
        resetAt: existing.resetAt
    };
}
// Clean up old rate limit entries periodically
if (typeof setInterval !== "undefined") {
    setInterval(()=>{
        const now = Date.now();
        for (const [key, value] of rateLimitMap.entries()){
            if (value.resetAt < now) {
                rateLimitMap.delete(key);
            }
        }
    }, 60000); // Clean up every minute
}
// =============================================================================
// Brute Force Detection
// =============================================================================
// Track failed attempts per IP
const failedAttempts = new Map();
function recordFailedAttempt(ip, config = {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000
}) {
    const now = Date.now();
    const existing = failedAttempts.get(ip);
    if (!existing || now - existing.firstAttempt > config.windowMs) {
        // New window
        failedAttempts.set(ip, {
            count: 1,
            firstAttempt: now
        });
        return false;
    }
    existing.count++;
    return existing.count >= config.maxAttempts;
}
function clearFailedAttempts(ip) {
    failedAttempts.delete(ip);
}
// =============================================================================
// Geo Lookup (using ip-api.com - free for non-commercial)
// =============================================================================
const geoCache = new Map();
const GEO_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
async function lookupGeo(ip) {
    // Skip local/private IPs
    if (ip === "unknown" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.")) {
        return null;
    }
    // Check cache
    const cached = geoCache.get(ip);
    if (cached && Date.now() - cached.cachedAt < GEO_CACHE_TTL) {
        return cached.data;
    }
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city,lat,lon`, {
            signal: AbortSignal.timeout(2000)
        });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        if (data.status === "fail") {
            return null;
        }
        const geoData = {
            country: data.country,
            region: data.regionName,
            city: data.city,
            latitude: data.lat,
            longitude: data.lon
        };
        // Cache the result
        geoCache.set(ip, {
            data: geoData,
            cachedAt: Date.now()
        });
        return geoData;
    } catch  {
        return null;
    }
}
}),
"[project]/src/lib/claw-ai/access-control.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACCESS_LEVEL_INFO",
    ()=>ACCESS_LEVEL_INFO,
    "JOB_TYPE_INFO",
    ()=>JOB_TYPE_INFO,
    "TOOL_CATEGORIES",
    ()=>TOOL_CATEGORIES,
    "canAccessTool",
    ()=>canAccessTool,
    "canAccessToolForJob",
    ()=>canAccessToolForJob,
    "describeAccessLevel",
    ()=>describeAccessLevel,
    "describeJobContext",
    ()=>describeJobContext,
    "filterToolCalls",
    ()=>filterToolCalls,
    "filterToolCallsForJob",
    ()=>filterToolCallsForJob,
    "getAccessLevel",
    ()=>getAccessLevel,
    "getCategoriesForAccessLevel",
    ()=>getCategoriesForAccessLevel,
    "getToolNamesForAccessLevel",
    ()=>getToolNamesForAccessLevel,
    "getToolNamesForJobContext",
    ()=>getToolNamesForJobContext,
    "getToolsForAccessLevel",
    ()=>getToolsForAccessLevel,
    "getToolsForJobContext",
    ()=>getToolsForJobContext,
    "isToolAllowedForJobType",
    ()=>isToolAllowedForJobType
]);
/**
 * Access Control for Claw AI Tools
 *
 * Implements three-tier access control:
 * - Owner/Claw AI: Full access to all 50+ tools
 * - Collaborators: Limited access (view, search, navigate but no mutations)
 * - Visitors: Portfolio mode only (search, navigate, themes)
 *
 * @see docs/planning/infinity-agent-coding-integration.md
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/claw-ai/tools.ts [app-route] (ecmascript)");
;
// ============================================================================
// Tool Access Mappings
// ============================================================================
/**
 * Tools available to everyone (visitors included)
 * These are read-only portfolio exploration tools
 */ const VISITOR_TOOLS = new Set([
    'search_portfolio',
    'navigate_to',
    'list_themes',
    'open_search_app',
    'show_weather',
    'show_photos'
]);
/**
 * Tools available to collaborators (authenticated users)
 * Includes visitor tools plus limited view/read capabilities
 */ const COLLABORATOR_TOOLS = new Set([
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
    'search_channel_messages'
]);
/**
 * Tools available only to the owner
 * Full access including mutations, execution, and memory
 */ const OWNER_ONLY_TOOLS = new Set([
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
    'generate_music'
]);
// ============================================================================
// Job Type Tool Allowlists (Phase 1.1 - ∞gent Safety Stack)
// ============================================================================
/**
 * CODING jobs: Full development capabilities
 * File operations, git, terminal, task tracking
 * NO: messaging, scheduling, social posting
 */ const CODING_JOB_TOOLS = new Set([
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
    'load_context_from_reference'
]);
/**
 * RESEARCH jobs: Read-only exploration and web access
 * Web fetch, search, read files - NO mutations
 */ const RESEARCH_JOB_TOOLS = new Set([
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
    'recall_preference'
]);
/**
 * PRODUCT jobs: PRD, tickets, project management
 * NO code execution, NO file mutations beyond docs
 */ const PRODUCT_JOB_TOOLS = new Set([
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
    'get_upcoming_bookings'
]);
/**
 * GENERAL jobs: Balanced access for interactive chat
 * Most tools available, but still respects access level
 */ const GENERAL_JOB_TOOLS = new Set([
    // All visitor tools
    ...VISITOR_TOOLS,
    // All collaborator tools
    ...COLLABORATOR_TOOLS
]);
/**
 * Map of job types to their allowed tools
 */ const JOB_TYPE_TOOLS = {
    coding: CODING_JOB_TOOLS,
    research: RESEARCH_JOB_TOOLS,
    product: PRODUCT_JOB_TOOLS,
    general: GENERAL_JOB_TOOLS
};
const JOB_TYPE_INFO = {
    coding: {
        name: 'Coding',
        description: 'Full development: files, git, terminal. No messaging or scheduling.',
        icon: '💻'
    },
    research: {
        name: 'Research',
        description: 'Read-only exploration: search, read files, browse. No mutations.',
        icon: '🔍'
    },
    product: {
        name: 'Product',
        description: 'PRDs, tickets, planning. No code execution.',
        icon: '📋'
    },
    general: {
        name: 'General',
        description: 'Balanced access for interactive chat.',
        icon: '💬'
    }
};
function getAccessLevel(ctx) {
    if (ctx.isOwner) {
        return 'owner';
    }
    if (ctx.isCollaborator || ctx.isAuthenticated) {
        return 'collaborator';
    }
    return 'visitor';
}
function canAccessTool(toolName, accessLevel) {
    switch(accessLevel){
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
function getToolsForAccessLevel(accessLevel) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLAW_AI_TOOLS"].filter((tool)=>canAccessTool(tool.name, accessLevel));
}
function getToolNamesForAccessLevel(accessLevel) {
    return getToolsForAccessLevel(accessLevel).map((tool)=>tool.name);
}
function filterToolCalls(toolCalls, accessLevel) {
    const permitted = [];
    const denied = [];
    for (const call of toolCalls){
        if (canAccessTool(call.name, accessLevel)) {
            permitted.push(call);
        } else {
            denied.push(call);
        }
    }
    return {
        permitted,
        denied
    };
}
function isToolAllowedForJobType(toolName, jobType) {
    const allowedTools = JOB_TYPE_TOOLS[jobType];
    // General jobs allow all tools (access level still applies)
    if (jobType === 'general') {
        return true;
    }
    return allowedTools.has(toolName);
}
function canAccessToolForJob(toolName, accessLevel, jobType) {
    // First check: Does the access level allow this tool?
    if (!canAccessTool(toolName, accessLevel)) {
        return false;
    }
    // Second check: Does the job type allow this tool?
    return isToolAllowedForJobType(toolName, jobType);
}
function getToolsForJobContext(context) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLAW_AI_TOOLS"].filter((tool)=>canAccessToolForJob(tool.name, context.accessLevel, context.jobType));
}
function getToolNamesForJobContext(context) {
    return getToolsForJobContext(context).map((tool)=>tool.name);
}
function filterToolCallsForJob(toolCalls, context) {
    const permitted = [];
    const deniedByAccess = [];
    const deniedByJobType = [];
    for (const call of toolCalls){
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
    return {
        permitted,
        deniedByAccess,
        deniedByJobType
    };
}
function describeJobContext(context) {
    const accessInfo = ACCESS_LEVEL_INFO[context.accessLevel];
    const jobInfo = JOB_TYPE_INFO[context.jobType];
    const tools = getToolsForJobContext(context);
    return `${accessInfo.name} with ${jobInfo.name} job: ${jobInfo.description} ${tools.length} tools available.`;
}
const TOOL_CATEGORIES = [
    {
        name: 'Portfolio',
        description: 'Search and navigate the portfolio',
        icon: '🎨',
        tools: [
            'search_portfolio',
            'navigate_to',
            'list_themes',
            'open_search_app',
            'show_weather',
            'show_photos'
        ]
    },
    {
        name: 'Scheduling',
        description: 'Calendar and meeting management',
        icon: '📅',
        tools: [
            'schedule_call',
            'get_available_times',
            'get_upcoming_bookings',
            'book_meeting',
            'reschedule_meeting',
            'cancel_meeting'
        ]
    },
    {
        name: 'Product Lifecycle',
        description: 'Project, PRD, and ticket management',
        icon: '📋',
        tools: [
            'create_project',
            'list_projects',
            'create_prd',
            'create_ticket',
            'update_ticket',
            'shard_prd',
            'get_project_kanban',
            'show_kanban_tasks'
        ]
    },
    {
        name: 'Memory',
        description: 'Recursive Memory Layer operations',
        icon: '🧠',
        tools: [
            'remember',
            'recall_preference',
            'memorize',
            'learn',
            'forget'
        ]
    },
    {
        name: 'Working Context',
        description: 'Active context management',
        icon: '🎯',
        tools: [
            'set_active_context',
            'get_active_context',
            'load_context_from_reference'
        ]
    },
    {
        name: 'Repository',
        description: 'Clone and explore codebases',
        icon: '📦',
        tools: [
            'clone_repository',
            'list_directory',
            'search_codebase'
        ]
    },
    {
        name: 'Files',
        description: 'Read and write files',
        icon: '📄',
        tools: [
            'read_file',
            'write_file',
            'edit_file',
            'delete_file'
        ]
    },
    {
        name: 'Execution',
        description: 'Run commands and start servers',
        icon: '⚡',
        tools: [
            'run_command',
            'start_dev_server',
            'get_preview_url'
        ]
    },
    {
        name: 'Git',
        description: 'Version control operations',
        icon: '🌿',
        tools: [
            'git_status',
            'git_diff',
            'git_commit',
            'git_push',
            'create_branch'
        ]
    },
    {
        name: 'Coding Tasks',
        description: 'Track coding sessions',
        icon: '💻',
        tools: [
            'create_coding_task',
            'update_coding_task',
            'list_coding_tasks'
        ]
    },
    {
        name: 'UI Rendering',
        description: 'Render custom UI components',
        icon: '🖼️',
        tools: [
            'render_ui'
        ]
    },
    {
        name: 'Automation',
        description: 'Scheduled jobs and cron tasks',
        icon: '⏰',
        tools: [
            'create_cron_job',
            'list_cron_jobs',
            'toggle_cron_job',
            'delete_cron_job'
        ]
    },
    {
        name: 'Compaction',
        description: 'Conversation summarization and context management',
        icon: '📚',
        tools: [
            'compact_conversation',
            'get_compaction_summary'
        ]
    },
    {
        name: 'Channels',
        description: 'Messaging platform integrations (WhatsApp, Telegram, etc.)',
        icon: '💬',
        tools: [
            'list_channel_integrations',
            'get_channel_conversations',
            'send_channel_message',
            'search_channel_messages'
        ]
    }
];
function getCategoriesForAccessLevel(accessLevel) {
    return TOOL_CATEGORIES.map((category)=>({
            ...category,
            tools: category.tools.filter((tool)=>canAccessTool(tool, accessLevel))
        })).filter((category)=>category.tools.length > 0);
}
const ACCESS_LEVEL_INFO = {
    owner: {
        name: 'Owner',
        description: 'Full access to all tools including coding, memory, and mutations',
        color: 'emerald'
    },
    collaborator: {
        name: 'Collaborator',
        description: 'View and search access, no mutations or code execution',
        color: 'blue'
    },
    visitor: {
        name: 'Visitor',
        description: 'Portfolio exploration only',
        color: 'gray'
    }
};
function describeAccessLevel(accessLevel) {
    const info = ACCESS_LEVEL_INFO[accessLevel];
    const categories = getCategoriesForAccessLevel(accessLevel);
    const toolCount = getToolsForAccessLevel(accessLevel).length;
    const categoryNames = categories.map((c)=>c.name).join(', ');
    return `${info.name}: ${info.description}. ${toolCount} tools across ${categories.length} categories (${categoryNames}).`;
}
}),
"[project]/src/lib/ollama/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Ollama Client - Phase 3 Local LLM Integration
 *
 * Client library for interacting with local Ollama server.
 * Supports chat, generate, model listing, and health checks.
 */ // ============================================================================
// Types
// ============================================================================
__turbopack_context__.s([
    "OllamaClient",
    ()=>OllamaClient,
    "checkOllamaHealth",
    ()=>checkOllamaHealth,
    "getOllamaClient",
    ()=>getOllamaClient
]);
class OllamaClient {
    baseUrl;
    timeout;
    defaultModel;
    constructor(config){
        this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
        this.timeout = config.timeout ?? 30000;
        this.defaultModel = config.defaultModel ?? 'gpt-oss:20b';
    }
    /**
   * Check if Ollama server is reachable and get available models
   */ async health() {
        const start = Date.now();
        try {
            // Try to list models (this also verifies server is running)
            const response = await this.fetchWithTimeout(`${this.baseUrl}/api/tags`, {
                method: 'GET'
            });
            if (!response.ok) {
                return {
                    connected: false,
                    models: [],
                    error: `Server returned ${response.status}`,
                    latencyMs: Date.now() - start
                };
            }
            const data = await response.json();
            const models = data.models || [];
            // Also try to get version
            let version;
            try {
                const versionResponse = await this.fetchWithTimeout(`${this.baseUrl}/api/version`, {
                    method: 'GET'
                });
                if (versionResponse.ok) {
                    const versionData = await versionResponse.json();
                    version = versionData.version;
                }
            } catch (error) {
                // Version endpoint might not exist in older versions - log at debug level
                console.debug('[Ollama] Version endpoint not available:', error);
            }
            return {
                connected: true,
                version,
                models,
                latencyMs: Date.now() - start
            };
        } catch (error) {
            return {
                connected: false,
                models: [],
                error: error instanceof Error ? error.message : 'Connection failed',
                latencyMs: Date.now() - start
            };
        }
    }
    /**
   * List available models
   */ async listModels() {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/tags`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`Failed to list models: ${response.status}`);
        }
        const data = await response.json();
        return data.models || [];
    }
    /**
   * Chat with a model (non-streaming)
   */ async chat(request) {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...request,
                model: request.model || this.defaultModel,
                stream: false
            })
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Chat failed: ${response.status} - ${error}`);
        }
        return response.json();
    }
    /**
   * Chat with a model (streaming)
   * Returns an async generator that yields partial responses
   */ async *chatStream(request) {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...request,
                model: request.model || this.defaultModel,
                stream: true
            })
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Chat stream failed: ${response.status} - ${error}`);
        }
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body');
        }
        const decoder = new TextDecoder();
        let buffer = '';
        try {
            while(true){
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, {
                    stream: true
                });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines){
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
                            yield data;
                        } catch (error) {
                            // Log malformed JSON for debugging but continue processing
                            console.error('[Ollama] Malformed JSON in chat stream:', line.substring(0, 100), error);
                        }
                    }
                }
            }
            // Process remaining buffer
            if (buffer.trim()) {
                try {
                    const data = JSON.parse(buffer);
                    yield data;
                } catch (error) {
                    // Log malformed JSON for debugging
                    console.error('[Ollama] Malformed JSON in chat buffer:', buffer.substring(0, 100), error);
                }
            }
        } finally{
            reader.releaseLock();
        }
    }
    /**
   * Generate text (non-streaming)
   */ async generate(request) {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...request,
                model: request.model || this.defaultModel,
                stream: false
            })
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Generate failed: ${response.status} - ${error}`);
        }
        return response.json();
    }
    /**
   * Generate text (streaming)
   */ async *generateStream(request) {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...request,
                model: request.model || this.defaultModel,
                stream: true
            })
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Generate stream failed: ${response.status} - ${error}`);
        }
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body');
        }
        const decoder = new TextDecoder();
        let buffer = '';
        try {
            while(true){
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, {
                    stream: true
                });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines){
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
                            yield data;
                        } catch (error) {
                            // Log malformed JSON for debugging but continue processing
                            console.error('[Ollama] Malformed JSON in generate stream:', line.substring(0, 100), error);
                        }
                    }
                }
            }
            // Process remaining buffer
            if (buffer.trim()) {
                try {
                    const data = JSON.parse(buffer);
                    yield data;
                } catch (error) {
                    // Log malformed JSON for debugging
                    console.error('[Ollama] Malformed JSON in generate buffer:', buffer.substring(0, 100), error);
                }
            }
        } finally{
            reader.releaseLock();
        }
    }
    /**
   * Pull a model from Ollama registry
   */ async pullModel(modelName) {
        const response = await fetch(`${this.baseUrl}/api/pull`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: modelName
            })
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to pull model: ${response.status} - ${error}`);
        }
        // Wait for the model to be pulled (this can take a while)
        const reader = response.body?.getReader();
        if (reader) {
            const decoder = new TextDecoder();
            while(true){
                const { done } = await reader.read();
                if (done) break;
            }
            reader.releaseLock();
        }
    }
    /**
   * Fetch with timeout
   */ async fetchWithTimeout(url, options) {
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), this.timeout);
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            return response;
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error(`Request timed out after ${this.timeout}ms`);
            }
            throw error;
        } finally{
            clearTimeout(timeoutId);
        }
    }
}
// ============================================================================
// Singleton Instance
// ============================================================================
let defaultClient = null;
function getOllamaClient(config) {
    if (!defaultClient || config) {
        defaultClient = new OllamaClient({
            baseUrl: config?.baseUrl ?? process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
            timeout: config?.timeout ?? 30000,
            defaultModel: config?.defaultModel ?? process.env.OLLAMA_DEFAULT_MODEL ?? 'gpt-oss:20b'
        });
    }
    return defaultClient;
}
async function checkOllamaHealth(baseUrl) {
    const client = new OllamaClient({
        baseUrl: baseUrl ?? process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
        timeout: 5000
    });
    return client.health();
}
}),
"[project]/src/lib/ollama/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Ollama Module - Local LLM Integration
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ollama$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ollama/client.ts [app-route] (ecmascript)");
;
}),
"[project]/src/lib/lynkr/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LynkrClient",
    ()=>LynkrClient,
    "auditLogCallback",
    ()=>auditLogCallback,
    "checkLynkrHealth",
    ()=>checkLynkrHealth,
    "getLynkrClient",
    ()=>getLynkrClient,
    "setAuditLogCallback",
    ()=>setAuditLogCallback,
    "validateApiKey",
    ()=>validateApiKey,
    "validateUrlSafety",
    ()=>validateUrlSafety
]);
/**
 * Lynkr Client - Universal LLM Proxy Integration
 *
 * Lynkr is a self-hosted proxy that routes AI requests to:
 * - Local models (Ollama, llama.cpp, LM Studio)
 * - Cloud providers (OpenRouter, Anthropic, OpenAI, AWS Bedrock, etc.)
 *
 * This client connects to a Lynkr instance (local or via tunnel) and
 * sends requests in Anthropic format, which Lynkr converts as needed.
 *
 * SECURITY:
 * - API key required (min 32 chars for production)
 * - SSRF protection blocks internal IPs
 * - Audit logging for all requests
 */ // ============================================================================
// Security Constants
// ============================================================================
/** Minimum API key length for production use */ const MIN_API_KEY_LENGTH = 32;
/** Internal IP patterns that should be blocked (SSRF protection) */ const BLOCKED_IP_PATTERNS = [
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^169\.254\./,
    /^0\./,
    /^100\.(6[4-9]|[7-9][0-9]|1[0-2][0-7])\./,
    /^::1$/,
    /^fc00:/i,
    /^fe80:/i,
    /^localhost$/i,
    /^.*\.local$/i,
    /metadata\.google\.internal/i,
    /169\.254\.169\.254/
];
/** Allowed URL schemes */ const ALLOWED_SCHEMES = [
    'https:',
    'http:'
];
function validateApiKey(apiKey, skipValidation) {
    if (skipValidation) return;
    if (!apiKey || apiKey.length < MIN_API_KEY_LENGTH) {
        const error = new Error(`Lynkr API key must be at least ${MIN_API_KEY_LENGTH} characters. ` + `Generate with: openssl rand -base64 48`);
        error.code = 'INVALID_API_KEY';
        throw error;
    }
    // Block obviously insecure default keys
    const insecureKeys = [
        'lynkr-local',
        'dummy',
        'test',
        'local',
        'dev'
    ];
    if (insecureKeys.includes(apiKey.toLowerCase())) {
        const error = new Error('Lynkr API key cannot be a default/test value. Generate a secure key.');
        error.code = 'INVALID_API_KEY';
        throw error;
    }
}
function validateUrlSafety(urlString, skipValidation) {
    if (skipValidation) return;
    try {
        const url = new URL(urlString);
        // Check scheme
        if (!ALLOWED_SCHEMES.includes(url.protocol)) {
            const error = new Error(`URL scheme ${url.protocol} not allowed. Use http: or https:`);
            error.code = 'INVALID_URL';
            throw error;
        }
        // Check hostname against blocked patterns
        const hostname = url.hostname;
        for (const pattern of BLOCKED_IP_PATTERNS){
            if (pattern.test(hostname)) {
                const error = new Error(`SSRF protection: ${hostname} is not allowed. Internal IPs are blocked.`);
                error.code = 'SSRF_BLOCKED';
                throw error;
            }
        }
    } catch (e) {
        if (e.code) throw e;
        const error = new Error(`Invalid URL: ${urlString}`);
        error.code = 'INVALID_URL';
        throw error;
    }
}
/**
 * Check if running in local development mode
 */ function isLocalDev() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return ("TURBOPACK compile-time value", "development") === 'development' || process.env.LYNKR_SKIP_SECURITY === 'true';
}
let auditLogCallback = null;
function setAuditLogCallback(callback) {
    auditLogCallback = callback;
}
function logAudit(log) {
    if (auditLogCallback) {
        try {
            auditLogCallback(log);
        } catch (error) {
            // Log audit failures to console as fallback - don't lose security events silently
            console.error('[Lynkr AUDIT FAILURE] Failed to log audit event:', error);
            console.error('[Lynkr AUDIT FAILURE] Event data:', JSON.stringify(log));
        }
    }
    // Also log to console in development
    if (isLocalDev()) {
        console.log('[Lynkr Audit]', JSON.stringify(log));
    }
}
class LynkrClient {
    config;
    constructor(config){
        const skipSecurity = isLocalDev();
        const skipApiKeyValidation = config.skipApiKeyValidation ?? skipSecurity;
        const skipSsrfValidation = config.skipSsrfValidation ?? skipSecurity;
        // Validate security requirements
        if (!skipApiKeyValidation) {
            validateApiKey(config.apiKey, false);
        }
        if (!skipSsrfValidation) {
            validateUrlSafety(config.baseUrl, false);
        }
        this.config = {
            baseUrl: config.baseUrl.replace(/\/$/, ''),
            apiKey: config.apiKey ?? '',
            timeout: config.timeout ?? 120000,
            defaultModel: config.defaultModel ?? 'gpt-oss:20b',
            skipApiKeyValidation,
            skipSsrfValidation
        };
    }
    /**
   * Check if Lynkr is healthy and reachable
   */ async checkHealth() {
        const start = Date.now();
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(()=>controller.abort(), 5000);
            const response = await fetch(`${this.config.baseUrl}/health`, {
                method: 'GET',
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                return {
                    connected: false,
                    latencyMs: Date.now() - start,
                    error: `HTTP ${response.status}: ${response.statusText}`
                };
            }
            const data = await response.json();
            return {
                connected: true,
                latencyMs: Date.now() - start,
                provider: data.provider,
                model: data.model,
                version: data.version,
                features: {
                    memory: data.memory?.enabled ?? false,
                    tools: data.tools?.enabled ?? true,
                    streaming: data.streaming?.enabled ?? true,
                    embeddings: data.embeddings?.enabled ?? false
                }
            };
        } catch (error) {
            return {
                connected: false,
                latencyMs: Date.now() - start,
                error: error instanceof Error ? error.message : 'Connection failed'
            };
        }
    }
    /**
   * Get Lynkr metrics
   */ async getMetrics() {
        try {
            const response = await fetch(`${this.config.baseUrl}/metrics`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            });
            if (!response.ok) return null;
            return await response.json();
        } catch  {
            return null;
        }
    }
    /**
   * Send a chat request through Lynkr
   * Uses Anthropic message format (Lynkr converts as needed)
   */ async chat(request) {
        const start = Date.now();
        const model = request.model ?? this.config.defaultModel;
        const body = {
            model,
            messages: request.messages,
            max_tokens: request.max_tokens ?? 4096,
            temperature: request.temperature ?? 0.7,
            tools: request.tools,
            system: request.system,
            stream: false
        };
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), this.config.timeout);
        try {
            const response = await fetch(`${this.config.baseUrl}/v1/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.config.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify(body),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorText = await response.text();
                const error = new Error(`Lynkr request failed: ${response.status} - ${errorText}`);
                logAudit({
                    timestamp: Date.now(),
                    action: 'chat',
                    model,
                    baseUrl: this.config.baseUrl,
                    latencyMs: Date.now() - start,
                    success: false,
                    error: error.message
                });
                throw error;
            }
            const result = await response.json();
            logAudit({
                timestamp: Date.now(),
                action: 'chat',
                model,
                baseUrl: this.config.baseUrl,
                latencyMs: Date.now() - start,
                success: true,
                inputTokens: result.usage?.input_tokens,
                outputTokens: result.usage?.output_tokens
            });
            return result;
        } catch (error) {
            clearTimeout(timeoutId);
            // Log if not already logged
            if (!(error instanceof Error && error.message.includes('Lynkr request failed'))) {
                logAudit({
                    timestamp: Date.now(),
                    action: 'chat',
                    model,
                    baseUrl: this.config.baseUrl,
                    latencyMs: Date.now() - start,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
            throw error;
        }
    }
    /**
   * Send a streaming chat request through Lynkr
   * Returns an async generator of content deltas
   */ async *chatStream(request) {
        const body = {
            model: request.model ?? this.config.defaultModel,
            messages: request.messages,
            max_tokens: request.max_tokens ?? 4096,
            temperature: request.temperature ?? 0.7,
            tools: request.tools,
            system: request.system,
            stream: true
        };
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), this.config.timeout);
        try {
            const response = await fetch(`${this.config.baseUrl}/v1/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.config.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify(body),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Lynkr stream failed: ${response.status} - ${errorText}`);
            }
            if (!response.body) {
                throw new Error('No response body for streaming');
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            while(true){
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, {
                    stream: true
                });
                const lines = buffer.split('\n');
                buffer = lines.pop() ?? '';
                for (const line of lines){
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();
                        if (data === '[DONE]') return;
                        try {
                            const event = JSON.parse(data);
                            yield event;
                        } catch  {
                        // Skip invalid JSON
                        }
                    }
                }
            }
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
    /**
   * Extract text content from a Lynkr response
   */ static extractText(response) {
        return response.content.filter((block)=>block.type === 'text').map((block)=>block.text).join('');
    }
    /**
   * Extract tool calls from a Lynkr response
   */ static extractToolCalls(response) {
        return response.content.filter((block)=>block.type === 'tool_use');
    }
    /**
   * Check if response contains tool calls
   */ static hasToolCalls(response) {
        return response.stop_reason === 'tool_use' || response.content.some((block)=>block.type === 'tool_use');
    }
}
function getLynkrClient(config) {
    // Environment variables are only available on the server
    const env = ("TURBOPACK compile-time truthy", 1) ? {
        baseUrl: process.env.LYNKR_BASE_URL,
        apiKey: process.env.LYNKR_API_KEY,
        timeout: process.env.LYNKR_TIMEOUT,
        defaultModel: process.env.LYNKR_DEFAULT_MODEL,
        skipSecurity: process.env.LYNKR_SKIP_SECURITY === 'true' || ("TURBOPACK compile-time value", "development") === 'development'
    } : "TURBOPACK unreachable";
    const skipSecurity = config?.skipApiKeyValidation ?? config?.skipSsrfValidation ?? env.skipSecurity;
    return new LynkrClient({
        baseUrl: config?.baseUrl ?? env.baseUrl ?? 'http://localhost:8081',
        apiKey: config?.apiKey ?? env.apiKey,
        timeout: config?.timeout ?? parseInt(env.timeout ?? '120000', 10),
        defaultModel: config?.defaultModel ?? env.defaultModel ?? 'gpt-oss:20b',
        skipApiKeyValidation: skipSecurity,
        skipSsrfValidation: skipSecurity
    });
}
async function checkLynkrHealth(baseUrl) {
    // Health checks skip security validation - no auth needed for connectivity test
    const client = getLynkrClient({
        baseUrl,
        skipApiKeyValidation: true,
        skipSsrfValidation: true
    });
    return client.checkHealth();
}
}),
"[project]/src/lib/lynkr/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Lynkr Module - Universal LLM Proxy Integration
 *
 * Lynkr enables OpenClaw-OS to use local models from anywhere:
 * 1. Run Ollama + Lynkr on your Mac
 * 2. Expose Lynkr via Cloudflare Tunnel
 * 3. OpenClaw-OS (production) connects to your tunnel
 * 4. Claw AI uses your local models, from anywhere
 *
 * SECURITY:
 * - API key required (min 32 chars for production)
 * - SSRF protection blocks internal IPs
 * - Audit logging for all requests
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$lynkr$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/lynkr/client.ts [app-route] (ecmascript)");
;
}),
"[project]/src/lib/openclaw/auth-server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "clerkClient",
    ()=>clerkClient,
    "clerkMiddleware",
    ()=>clerkMiddleware,
    "currentUser",
    ()=>currentUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/server.js [app-route] (ecmascript)");
;
const auth = ()=>{
    return {
        userId: "mock-user-id",
        sessionId: "mock-session-id",
        getToken: async ()=>"mock-token",
        redirectToSignIn: ()=>({})
    };
};
const currentUser = async ()=>{
    return {
        id: "mock-user-id",
        firstName: "James",
        lastName: "Spalding",
        emailAddresses: [
            {
                emailAddress: "james@example.com"
            }
        ]
    };
};
const clerkClient = {
    users: {
        getUser: async ()=>currentUser()
    }
};
const clerkMiddleware = ()=>{
    return (req)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].next();
    };
};
}),
"[project]/src/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$soul$2d$layers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/claw-ai/soul-layers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/claw-ai/tools.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$tool$2d$executor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/claw-ai/tool-executor.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$memory$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/memory/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$memory$2f$manager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/memory/manager.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$passcodeAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/passcodeAuth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/security.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$access$2d$control$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/claw-ai/access-control.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ollama$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/ollama/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ollama$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ollama/client.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$lynkr$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/lynkr/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$lynkr$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/lynkr/client.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/openclaw/auth-server.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
// Rate limits: authenticated users get higher limits
const PUBLIC_RATE_LIMIT = {
    windowMs: 60 * 1000,
    maxRequests: 10
};
const AUTH_RATE_LIMIT = {
    windowMs: 60 * 1000,
    maxRequests: 60
};
// Local LLM timeout (30 seconds) before fallback to cloud
const LOCAL_LLM_TIMEOUT = 30000;
// User identity is now the AccessLevel type from access-control.ts
// Owner userId should come from authenticated session, not hardcoded
// Initialize memory manager
const memoryManager = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$memory$2f$manager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MemoryManager"]();
/**
 * Determine user identity from session
 * Returns AccessLevel and userId from the actual session
 */ async function getUserIdentity() {
    try {
        // First check for Clerk authentication (primary auth)
        const { userId: clerkUserId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$auth$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (clerkUserId) {
            // Assume owner for now in OpenClaw OS single-user mode
            return {
                accessLevel: 'owner',
                userId: clerkUserId
            };
        }
        // Fallback: Check for legacy admin cookie (passcode auth)
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        const adminToken = cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$passcodeAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ADMIN_COOKIE"])?.value;
        if (adminToken) {
            const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$passcodeAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifySession"])(adminToken);
            if (session && session.type === 'admin') {
                const userId = `admin-${session.subject}`;
                return {
                    accessLevel: 'owner',
                    userId
                };
            }
        }
        return {
            accessLevel: 'visitor',
            userId: null
        };
    } catch (e) {
        console.error('[Auth] Error determining user identity:', e);
        return {
            accessLevel: 'visitor',
            userId: null
        };
    }
}
/**
 * Fetch AI provider settings
 * Only fetches for owner; returns default cloud settings for others
 */ async function getAIProviderSettings(accessLevel) {
    // Default to cloud for non-owners
    if (accessLevel !== 'owner') {
        return {
            primaryProvider: 'cloud'
        };
    }
    // Use environment variables for default settings in OpenClaw OS
    return {
        primaryProvider: 'cloud'
    };
}
/**
 * Call Ollama for local LLM inference
 */ async function callOllama(messages, systemPrompt, settings) {
    const client = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ollama$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OllamaClient"]({
        baseUrl: settings.ollamaBaseUrl ?? process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
        timeout: settings.ollamaTimeout ?? LOCAL_LLM_TIMEOUT,
        defaultModel: settings.ollamaDefaultModel ?? process.env.OLLAMA_DEFAULT_MODEL ?? 'gpt-oss:20b'
    });
    // Convert messages to Ollama format
    const ollamaMessages = [
        {
            role: 'system',
            content: systemPrompt
        },
        ...messages.map((m)=>({
                role: m.role,
                content: m.content
            }))
    ];
    const response = await client.chat({
        model: settings.ollamaDefaultModel ?? 'gpt-oss:20b',
        messages: ollamaMessages
    });
    return response.message.content;
}
/**
 * Call Lynkr for local LLM inference via tunnel (works from anywhere)
 * Uses the Cloudflare tunnel to route to local Ollama
 */ async function callLynkr(messages, systemPrompt, settings) {
    // Validate Lynkr settings
    if (!settings.lynkrTunnelUrl) {
        throw new Error('Lynkr tunnel URL not configured');
    }
    if (!settings.lynkrApiKey) {
        throw new Error('Lynkr API key not configured');
    }
    console.log(`[Lynkr] Connecting via tunnel: ${settings.lynkrTunnelUrl}`);
    const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$lynkr$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLynkrClient"])({
        baseUrl: settings.lynkrTunnelUrl,
        apiKey: settings.lynkrApiKey,
        defaultModel: settings.lynkrDefaultModel ?? 'gpt-oss:20b',
        timeout: settings.ollamaTimeout ?? LOCAL_LLM_TIMEOUT,
        // Skip validation for tunnel URLs (they're external)
        skipSsrfValidation: true
    });
    // Convert messages to Lynkr/Anthropic format
    const lynkrMessages = messages.map((m)=>({
            role: m.role,
            content: m.content
        }));
    const response = await client.chat({
        messages: lynkrMessages,
        system: systemPrompt,
        model: settings.lynkrDefaultModel ?? 'gpt-oss:20b',
        max_tokens: 4096,
        temperature: 0.7
    });
    // Extract text content from the response
    const textContent = response.content.find((c)=>c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
        throw new Error('Lynkr response did not contain text content');
    }
    console.log(`[Lynkr] Response received, model: ${response.model}`);
    return textContent.text;
}
/**
 * Call OpenAI for cloud LLM inference
 */ async function callOpenAI(messages, systemPrompt, tools) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OpenAI API key not configured');
    }
    const openAIMessages = [
        {
            role: 'system',
            content: systemPrompt
        },
        ...messages.map((m)=>({
                role: m.role === 'user' ? 'user' : 'assistant',
                content: m.content
            }))
    ];
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: openAIMessages,
            tools: tools && tools.length > 0 ? tools : undefined,
            tool_choice: tools && tools.length > 0 ? 'auto' : undefined,
            max_tokens: 1000,
            temperature: 0.7
        })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
    }
    const data = await response.json();
    const assistantMessage = data.choices[0]?.message;
    return {
        content: assistantMessage?.content || '',
        toolCalls: assistantMessage?.tool_calls
    };
}
/**
 * Route to the appropriate AI provider with fallback support
 */ async function routeToProvider(messages, systemPrompt, settings, tools) {
    console.log('[routeToProvider] Settings received:', {
        primaryProvider: settings.primaryProvider,
        lynkrTunnelUrl: settings.lynkrTunnelUrl ? 'SET' : 'NOT SET',
        lynkrApiKey: settings.lynkrApiKey ? 'SET' : 'NOT SET'
    });
    // If primary is cloud, use OpenAI directly
    if (settings.primaryProvider === 'cloud') {
        try {
            const result = await callOpenAI(messages, systemPrompt, tools);
            return {
                content: result.content,
                provider: 'openai',
                model: 'gpt-4o',
                fallbackUsed: false
            };
        } catch (error) {
            // Cloud failed with no fallback
            throw error;
        }
    }
    // If primary is lynkr, use Lynkr via tunnel (local models from anywhere)
    if (settings.primaryProvider === 'lynkr') {
        try {
            console.log('[AI Provider] Using Lynkr (local models via tunnel)...');
            const content = await callLynkr(messages, systemPrompt, settings);
            return {
                content,
                provider: 'lynkr',
                model: settings.lynkrDefaultModel ?? 'gpt-oss:20b',
                fallbackUsed: false
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.warn('[AI Provider] Lynkr failed:', errorMessage);
            // Check if fallback is explicitly enabled to 'cloud'
            if (settings.fallbackProvider === 'cloud') {
                console.log('[AI Provider] Falling back to cloud (OpenAI)...');
                try {
                    const result = await callOpenAI(messages, systemPrompt, tools);
                    return {
                        content: result.content,
                        provider: 'openai',
                        model: 'gpt-4o',
                        fallbackUsed: true,
                        fallbackReason: `Lynkr failed: ${errorMessage}`
                    };
                } catch (fallbackError) {
                    throw new Error(`Both Lynkr and cloud providers failed. Lynkr: ${errorMessage}, Cloud: ${fallbackError}`);
                }
            }
            // No fallback enabled - throw the Lynkr error directly
            throw new Error(`Lynkr failed: ${errorMessage}`);
        }
    }
    // Primary is local (Ollama direct connection)
    try {
        console.log('[AI Provider] Using local Ollama (direct)...');
        const content = await callOllama(messages, systemPrompt, settings);
        return {
            content,
            provider: 'ollama',
            model: settings.ollamaDefaultModel ?? 'gpt-oss:20b',
            fallbackUsed: false
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn('[AI Provider] Ollama failed:', errorMessage);
        // Check if fallback is explicitly enabled to 'cloud'
        if (settings.fallbackProvider === 'cloud') {
            console.log('[AI Provider] Falling back to cloud (OpenAI)...');
            try {
                const result = await callOpenAI(messages, systemPrompt, tools);
                return {
                    content: result.content,
                    provider: 'openai',
                    model: 'gpt-4o',
                    fallbackUsed: true,
                    fallbackReason: `Local LLM failed: ${errorMessage}`
                };
            } catch (fallbackError) {
                throw new Error(`Both local and cloud providers failed. Local: ${errorMessage}, Cloud: ${fallbackError}`);
            }
        }
        // No fallback enabled - throw the Ollama error directly
        throw new Error(`Local LLM failed: ${errorMessage}`);
    }
}
// TPMJS tool definitions for OpenAI function calling
const TPMJS_TOOL_DEFINITIONS = [
    {
        name: 'search_tpmjs_tools',
        description: 'Search the TPMJS registry for available tools. Use this to find tools that can help with specific tasks like web scraping, image processing, data transformation, etc.',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query to find relevant tools (e.g., "web scraping", "image resize", "json transform")'
                },
                category: {
                    type: 'string',
                    description: 'Optional category filter (e.g., "web-scraping", "image-processing", "ai-models")'
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of results to return (default: 10)'
                }
            },
            required: [
                'query'
            ]
        }
    },
    {
        name: 'execute_tpmjs_tool',
        description: 'Execute a tool from the TPMJS registry. First use search_tpmjs_tools to find the right tool, then execute it with the required parameters.',
        parameters: {
            type: 'object',
            properties: {
                toolId: {
                    type: 'string',
                    description: 'The tool ID in format "packageName::toolName" (e.g., "web-scraper::fetch_page")'
                },
                params: {
                    type: 'object',
                    description: 'Parameters to pass to the tool (varies by tool)'
                },
                env: {
                    type: 'object',
                    description: 'Optional environment variables for the tool execution'
                }
            },
            required: [
                'toolId',
                'params'
            ]
        }
    },
    {
        name: 'check_tpmjs_executor',
        description: 'Check the health and status of the TPMJS executor service. Use this to verify the executor is available before running tools.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    }
];
/**
 * Execute a TPMJS tool by name
 * This bridges the AI function calling to the TPMJS client
 */ async function executeTPMJSTool(toolName, args) {
    // Dynamic import to avoid loading TPMJS client unless needed
    const { getTPMJSClient } = await __turbopack_context__.A("[project]/src/lib/tpmjs/client.ts [app-route] (ecmascript, async loader)");
    const client = getTPMJSClient();
    switch(toolName){
        case 'search_tpmjs_tools':
            {
                const result = await client.searchTools(args.query, {
                    category: args.category,
                    limit: args.limit
                });
                return {
                    tools: result.tools.map((t)=>({
                            id: t.toolId || `${t.packageName}::${t.toolName}`,
                            name: t.name || t.toolName,
                            description: t.description,
                            category: t.category,
                            qualityScore: t.qualityScore
                        })),
                    total: result.total
                };
            }
        case 'execute_tpmjs_tool':
            {
                const result = await client.executeTool(args.toolId, args.params, args.env);
                return result;
            }
        case 'check_tpmjs_executor':
            {
                const health = await client.checkExecutorHealth();
                return health;
            }
        default:
            throw new Error(`Unknown TPMJS tool: ${toolName}`);
    }
}
async function POST(request) {
    try {
        const { messages, model, theme, projectId, appContext, channel, accessLevel: requestAccessLevel, enableTools, selectedTools } = await request.json();
        if (!messages || !Array.isArray(messages)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Messages array is required'
            }, {
                status: 400
            });
        }
        // Determine user identity from session
        let { accessLevel, userId } = await getUserIdentity();
        // Allow channel-specific access level override (e.g., WhatsApp contacts)
        // Only trust this if it's from a server-side channel integration
        if (channel === 'whatsapp' && requestAccessLevel) {
            accessLevel = requestAccessLevel;
            console.log(`[Chat API] Using WhatsApp contact access level: ${accessLevel}`);
        }
        // SECURITY: Rate limiting based on access level
        const clientIp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getClientIp"])(request);
        const rateLimitConfig = accessLevel === 'owner' ? AUTH_RATE_LIMIT : PUBLIC_RATE_LIMIT;
        const rateLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkRateLimit"])(`chat:${clientIp}`, rateLimitConfig);
        if (!rateLimit.allowed) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Rate limit exceeded. Please wait before making more requests.',
                retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
            }, {
                status: 429,
                headers: {
                    'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
                }
            });
        }
        // Fetch AI provider settings (owner only; visitors always get cloud)
        const providerSettings = await getAIProviderSettings(accessLevel);
        // IMPORTANT: Lynkr only works when accessed directly (browser → tunnel → local Mac)
        // It does NOT work from Vercel serverless (Vercel → tunnel → local Mac is blocked)
        // So in production (Vercel), we must use cloud even if Lynkr is primary
        const isVercelProduction = process.env.VERCEL === '1';
        const lynkrUnavailableInProduction = isVercelProduction && providerSettings.primaryProvider === 'lynkr';
        if (lynkrUnavailableInProduction) {
            console.log('[AI Provider] Lynkr unavailable from Vercel - using cloud instead');
        }
        // Determine if we need cloud for tool calling
        // Hybrid approach: Use local for conversation, cloud only when tools are actually needed
        const isLocalPreferred = !lynkrUnavailableInProduction && (providerSettings.primaryProvider === 'local' || providerSettings.primaryProvider === 'lynkr');
        // Keywords that indicate tool usage is likely needed
        const toolTriggerKeywords = [
            'generate music',
            'create music',
            'make music',
            'create a song',
            'make a track',
            'cowrite',
            'co-write',
            'generate_music',
            'cowrite_music',
            'schedule',
            'book a meeting',
            'calendar',
            'navigate to',
            'go to',
            'open',
            'remember',
            'memorize',
            'recall',
            'create project',
            'create ticket',
            'create prd',
            'show kanban',
            'list projects'
        ];
        const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
        const needsToolSupport = enableTools && toolTriggerKeywords.some((kw)=>lastMessage.includes(kw));
        // Use local UNLESS tools are explicitly needed
        const useLocalProvider = isLocalPreferred && !needsToolSupport;
        if (needsToolSupport && isLocalPreferred) {
            console.log(`[Chat API] Switching to cloud for tool support (trigger detected in: "${lastMessage.substring(0, 50)}...")`);
        }
        // For cloud provider, ensure API key is configured
        if (!useLocalProvider) {
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'OpenAI API key not configured'
                }, {
                    status: 500
                });
            }
        }
        // Get the last user message for memory search
        const lastUserMessage = messages.filter((m)=>m.role === 'user').pop();
        const userQuery = lastUserMessage?.content || '';
        // Load relevant memories ONLY for owner
        let memoryContext = '';
        if (accessLevel === 'owner' && userId) {
            try {
                const memories = await memoryManager.loadRelevantMemories(userId, userQuery, {
                    projectId: projectId,
                    limit: 10
                });
                if (memories.contextSummary) {
                    memoryContext = `\n\n## Memory Context\n${memories.contextSummary}`;
                }
            } catch (error) {
                console.error('Failed to load memories:', error);
            // Continue without memory context
            }
        }
        // Build TPMJS tools context if any are selected
        const selectedTpmjsToolNames = selectedTools?.filter((t)=>t.provider === 'tpmjs').map((t)=>t.name) || [];
        const tpmjsContextStr = selectedTpmjsToolNames.length > 0 ? `\n\n## TPMJS Tools Available\nThe user has enabled the following TPMJS registry tools for this session:\n${selectedTpmjsToolNames.map((name)=>{
            const def = TPMJS_TOOL_DEFINITIONS.find((t)=>t.name === name);
            return def ? `- **${name}**: ${def.description}` : `- ${name}`;
        }).join('\n')}\n\nYou can use these tools to extend your capabilities. For example, use search_tpmjs_tools to find specialized tools in the registry, then execute_tpmjs_tool to run them.` : '';
        // Build provider context string
        const providerContextStr = useLocalProvider ? `\n\n## Provider Context\nYou are currently running on LOCAL inference (${providerSettings.primaryProvider === 'lynkr' ? 'Lynkr tunnel to Ollama' : 'Ollama direct'} with ${providerSettings.lynkrDefaultModel ?? providerSettings.ollamaDefaultModel ?? 'gpt-oss:20b'}). This means your responses stay on your machine with zero cloud cost. In local mode, have natural conversations, answer questions, help with ideas. If the user wants to execute an action (generate music, schedule, navigate), encourage them to be specific so you can help - the system will automatically switch to cloud for tool execution when needed.${tpmjsContextStr}` : `\n\n## Provider Context\nYou are running on CLOUD inference (OpenAI GPT-4o). Full tool calling and capabilities are available. Use your tools when appropriate - especially cowrite_music and generate_music for music creation requests.${tpmjsContextStr}`;
        // Assemble soul prompt using three-tier architecture
        // Visitor → base layer only. Collaborator → base + professional. Owner → all three.
        // Private context (Nick, 2028 arc, pricing) is never loaded for non-owner tiers.
        const systemPrompt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$soul$2d$layers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assembleSoulPrompt"])({
            accessLevel,
            theme: model || theme,
            appContext: appContext,
            memoryContext: memoryContext || undefined,
            providerContext: providerContextStr
        });
        // Log loaded soul layers for security monitoring
        const loadedLayers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$soul$2d$layers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLoadedLayers"])(accessLevel);
        console.log(`[Soul Layers] Access: ${accessLevel}, Layers: [${loadedLayers.join(', ')}]`);
        // Prepare messages for API call
        const chatMessages = messages.map((m)=>({
                role: m.role,
                content: m.content
            }));
        // SECURITY: Get only the tools this access level can use
        let allowedTools = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$access$2d$control$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getToolsForAccessLevel"])(accessLevel);
        // If selectedTools is provided, filter legacy tools to only include selected ones
        // and add TPMJS tools that are selected
        const selectedLegacyTools = selectedTools?.filter((t)=>t.provider === 'legacy').map((t)=>t.name) || [];
        const selectedTpmjsTools = selectedTools?.filter((t)=>t.provider === 'tpmjs').map((t)=>t.name) || [];
        // Filter legacy tools if specific ones are selected (empty array = use all allowed)
        if (selectedLegacyTools.length > 0) {
            allowedTools = allowedTools.filter((tool)=>selectedLegacyTools.includes(tool.name));
            console.log(`[Tool Selection] Filtered to ${allowedTools.length} legacy tools:`, selectedLegacyTools);
        }
        // Convert legacy tools to OpenAI format
        let openAITools = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toOpenAITools"])(allowedTools);
        // Add TPMJS tools if selected
        if (selectedTpmjsTools.length > 0) {
            const tpmjsToolsToAdd = selectedTpmjsTools.map((tpmjsTool)=>{
                const toolDef = TPMJS_TOOL_DEFINITIONS.find((t)=>t.name === tpmjsTool);
                if (!toolDef) return null;
                return {
                    type: 'function',
                    function: {
                        name: toolDef.name,
                        description: toolDef.description,
                        parameters: toolDef.parameters
                    }
                };
            }).filter((t)=>t !== null);
            // Cast to compatible type for merging
            openAITools = [
                ...openAITools,
                ...tpmjsToolsToAdd
            ];
            console.log(`[Tool Selection] Added ${tpmjsToolsToAdd.length} TPMJS tools:`, selectedTpmjsTools);
        }
        // Log tool access for monitoring (helpful for security audits)
        const tpmjsToolCount = selectedTpmjsTools.length > 0 ? selectedTpmjsTools.length : 0;
        console.log(`[Access Control] User (${accessLevel}) has access to ${openAITools.length} tools (${allowedTools.length} legacy + ${tpmjsToolCount} TPMJS)`);
        console.log(`[AI Provider] Primary: ${providerSettings.primaryProvider}, Using Local: ${useLocalProvider}`);
        // =========================================================================
        // LOCAL PROVIDER PATH (Ollama) - No tool calling, direct response
        // =========================================================================
        if (useLocalProvider) {
            try {
                const providerResult = await routeToProvider(chatMessages, systemPrompt, providerSettings);
                // Store interaction in memory ONLY for owner (async, non-blocking)
                if (accessLevel === 'owner' && userId) {
                    memoryManager.processInteraction(userId, {
                        userMessage: userQuery,
                        aiResponse: providerResult.content,
                        toolsUsed: []
                    }, projectId).catch((err)=>console.error('Failed to store memory:', err));
                }
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    content: providerResult.content,
                    message: providerResult.content,
                    model: 'claw-ai',
                    accessLevel,
                    memoryEnabled: accessLevel === 'owner',
                    provider: providerResult.provider,
                    providerModel: providerResult.model,
                    fallbackUsed: providerResult.fallbackUsed,
                    fallbackReason: providerResult.fallbackReason,
                    toolsEnabled: false
                });
            } catch (error) {
                console.error('[AI Provider] Local inference failed:', error);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Local AI provider failed. Try switching to cloud in Settings.'
                }, {
                    status: 500
                });
            }
        }
        // =========================================================================
        // CLOUD PROVIDER PATH (OpenAI) - Full tool calling support
        // =========================================================================
        const apiKey = process.env.OPENAI_API_KEY;
        // Prepare messages for OpenAI
        const openAIMessages = [
            {
                role: 'system',
                content: systemPrompt
            },
            ...messages.map((m)=>({
                    role: m.role === 'user' ? 'user' : 'assistant',
                    content: m.content
                }))
        ];
        // First API call - may include tool calls
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: openAIMessages,
                tools: openAITools.length > 0 ? openAITools : undefined,
                tool_choice: openAITools.length > 0 ? 'auto' : undefined,
                max_tokens: 1000,
                temperature: 0.7
            })
        });
        if (!response.ok) {
            const error = await response.json();
            console.error('OpenAI API error:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to get response from OpenAI'
            }, {
                status: 500
            });
        }
        const data = await response.json();
        const assistantMessage = data.choices[0]?.message;
        // Check if the model wants to use tools
        if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
            // Parse and execute tool calls
            const toolCalls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseToolCalls"])(assistantMessage.tool_calls);
            // TPMJS tool names (these bypass normal access control since user explicitly enabled them)
            const tpmjsToolNames = TPMJS_TOOL_DEFINITIONS.map((t)=>t.name);
            // Separate TPMJS tools from legacy tools for filtering
            const tpmjsCalls = toolCalls.filter((tc)=>tpmjsToolNames.includes(tc.name));
            const legacyCalls = toolCalls.filter((tc)=>!tpmjsToolNames.includes(tc.name));
            // SECURITY: Filter legacy tool calls by access level (defense in depth)
            const { permitted: permittedLegacy, denied } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$access$2d$control$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["filterToolCalls"])(legacyCalls, accessLevel);
            // TPMJS tools are permitted if they were selected (user explicitly enabled them)
            const permittedTpmjs = tpmjsCalls.filter((tc)=>selectedTpmjsToolNames.includes(tc.name));
            const deniedTpmjs = tpmjsCalls.filter((tc)=>!selectedTpmjsToolNames.includes(tc.name));
            // Combine permitted tools
            const permitted = [
                ...permittedLegacy,
                ...permittedTpmjs
            ];
            // Log any denied tool attempts (this shouldn't happen if AI respects its tool list)
            if (denied.length > 0 || deniedTpmjs.length > 0) {
                console.warn(`[SECURITY] Denied tool calls for ${accessLevel}:`, [
                    ...denied,
                    ...deniedTpmjs
                ].map((t)=>t.name));
            // TODO: Log to securityEvents table in Convex for monitoring
            }
            const toolResults = new Map();
            const toolActions = [];
            // Only execute permitted tools
            for (const toolCall of permitted){
                // Check if this is a TPMJS tool
                if (tpmjsToolNames.includes(toolCall.name)) {
                    // Handle TPMJS tool execution
                    try {
                        const tpmjsResult = await executeTPMJSTool(toolCall.name, toolCall.arguments);
                        toolResults.set(toolCall.name, {
                            success: true,
                            data: tpmjsResult
                        });
                        console.log(`[TPMJS] Executed ${toolCall.name}:`, tpmjsResult);
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                        toolResults.set(toolCall.name, {
                            success: false,
                            error: `TPMJS tool execution failed: ${errorMessage}`
                        });
                        console.error(`[TPMJS] Failed to execute ${toolCall.name}:`, error);
                    }
                } else {
                    // SECURITY: Pass userId to executeTool for proper authorization
                    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$tool$2d$executor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeTool"])(toolCall, {
                        userId,
                        accessLevel
                    });
                    toolResults.set(toolCall.name, result);
                    if (result.action) {
                        toolActions.push(result.action);
                    }
                }
            }
            // Add error results for denied tools (both legacy and TPMJS)
            for (const toolCall of denied){
                toolResults.set(toolCall.name, {
                    success: false,
                    error: `Access denied: Tool '${toolCall.name}' requires higher access level than '${accessLevel}'`
                });
            }
            for (const toolCall of deniedTpmjs){
                toolResults.set(toolCall.name, {
                    success: false,
                    error: `TPMJS tool '${toolCall.name}' was not enabled in the current session`
                });
            }
            // Build tool results messages for second API call
            const toolResultMessages = assistantMessage.tool_calls.map((tc)=>({
                    role: 'tool',
                    tool_call_id: tc.id,
                    content: JSON.stringify(toolResults.get(tc.function.name)?.data || {})
                }));
            // Second API call with tool results
            const secondResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        ...openAIMessages,
                        {
                            role: 'assistant',
                            // IMPORTANT: content can be null when tool_calls are present
                            // OpenAI requires an empty string, not null
                            content: assistantMessage.content || '',
                            tool_calls: assistantMessage.tool_calls
                        },
                        ...toolResultMessages
                    ],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });
            if (!secondResponse.ok) {
                const error = await secondResponse.json();
                console.error('OpenAI API error (second call):', error);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Failed to get response from OpenAI'
                }, {
                    status: 500
                });
            }
            const secondData = await secondResponse.json();
            const finalMessage = secondData.choices[0]?.message?.content || 'No response generated';
            const toolNames = toolCalls.map((tc)=>tc.name);
            // Store interaction in memory ONLY for owner (async, non-blocking)
            if (accessLevel === 'owner' && userId) {
                memoryManager.processInteraction(userId, {
                    userMessage: userQuery,
                    aiResponse: finalMessage,
                    toolsUsed: toolNames
                }, projectId).catch((err)=>console.error('Failed to store memory:', err));
            }
            // Include both permitted and denied tools in response (for transparency)
            const allDenied = [
                ...denied,
                ...deniedTpmjs
            ];
            const allToolResults = [
                ...permitted,
                ...allDenied
            ].map((tc)=>({
                    name: tc.name,
                    arguments: tc.arguments,
                    result: toolResults.get(tc.name)
                }));
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                content: finalMessage,
                message: finalMessage,
                model: 'claw-ai',
                accessLevel,
                toolsUsed: allToolResults,
                actions: toolActions,
                memoryEnabled: accessLevel === 'owner',
                deniedTools: allDenied.length > 0 ? allDenied.map((t)=>t.name) : undefined,
                tpmjsToolsEnabled: selectedTpmjsToolNames.length > 0 ? selectedTpmjsToolNames : undefined,
                provider: 'openai',
                providerModel: 'gpt-4o',
                fallbackUsed: false,
                toolsEnabled: true
            });
        }
        // No tool calls - return direct response
        const messageContent = assistantMessage?.content || 'No response generated';
        // Store interaction in memory ONLY for owner (async, non-blocking)
        if (accessLevel === 'owner' && userId) {
            memoryManager.processInteraction(userId, {
                userMessage: userQuery,
                aiResponse: messageContent,
                toolsUsed: []
            }, projectId).catch((err)=>console.error('Failed to store memory:', err));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            content: messageContent,
            message: messageContent,
            model: 'claw-ai',
            accessLevel,
            memoryEnabled: accessLevel === 'owner',
            provider: 'openai',
            providerModel: 'gpt-4o',
            fallbackUsed: false,
            toolsEnabled: true
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b353b2ae._.js.map