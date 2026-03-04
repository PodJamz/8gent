(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/command-palette/commands.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "actionCommands",
    ()=>actionCommands,
    "allCommands",
    ()=>allCommands,
    "appCommands",
    ()=>appCommands,
    "commandGroups",
    ()=>commandGroups,
    "getCommandById",
    ()=>getCommandById,
    "getCommandsByType",
    ()=>getCommandsByType,
    "themeCommands",
    ()=>themeCommands,
    "wikiCommands",
    ()=>wikiCommands
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/themes/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$definitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/themes/definitions.ts [app-client] (ecmascript)");
;
// =============================================================================
// ALL APPS - Synced with HomeScreenContext
// =============================================================================
const apps = [
    // Hub/Main apps
    {
        id: 'control',
        name: 'Control',
        href: '/control',
        keywords: [
            'overview',
            'channels',
            'instances',
            'sessions',
            'usage',
            'cron'
        ]
    },
    {
        id: 'agents',
        name: 'Agents',
        href: '/agents',
        keywords: [
            'agent',
            'skills',
            'nodes'
        ]
    },
    {
        id: 'settings',
        name: 'Settings',
        href: '/settings',
        keywords: [
            'config',
            'debug',
            'logs'
        ]
    },
    {
        id: 'resources',
        name: 'Resources',
        href: 'https://docs.openclaw.io',
        external: true,
        keywords: [
            'docs',
            'help',
            'documentation'
        ]
    },
    {
        id: 'chat',
        name: 'Chat',
        href: '/chat',
        keywords: [
            'ai',
            'james',
            'assistant',
            'talk'
        ]
    },
    // Individual apps (relegated or existing)
    {
        id: 'story',
        name: 'Story',
        href: '/story',
        keywords: [
            'about',
            'james',
            'intro'
        ]
    },
    {
        id: 'blog',
        name: 'Blog',
        href: '/blog',
        keywords: [
            'posts',
            'writing',
            'articles'
        ]
    },
    {
        id: 'design',
        name: 'Design',
        href: '/design',
        keywords: [
            'themes',
            'ui',
            'styles'
        ]
    },
    {
        id: 'resume',
        name: 'Resume',
        href: '/resume',
        keywords: [
            'cv',
            'experience',
            'work'
        ]
    },
    {
        id: 'music',
        name: 'Music',
        href: '/music',
        keywords: [
            'songs',
            'audio',
            'player'
        ]
    },
    {
        id: 'jamz',
        name: 'Jamz',
        href: '/studio',
        keywords: [
            'studio',
            'production',
            'beats'
        ]
    },
    {
        id: 'prototyping',
        name: 'Prototyping',
        href: '/prototyping',
        keywords: [
            'ide',
            'code',
            'editor'
        ]
    },
    {
        id: 'notes',
        name: 'Notes',
        href: '/notes',
        keywords: [
            'writing',
            'text',
            'memo'
        ]
    },
    {
        id: 'cowrite',
        name: 'Cowrite',
        href: '/cowrite',
        keywords: [
            'ai',
            'writing',
            'assistant'
        ]
    },
    {
        id: 'canvas',
        name: 'Canvas',
        href: '/canvas',
        keywords: [
            'draw',
            'sketch',
            'whiteboard',
            'infinite',
            'moodboard'
        ]
    },
    {
        id: 'product',
        name: 'Product',
        href: '/product',
        keywords: [
            'prd',
            'management',
            'planning'
        ]
    },
    {
        id: 'projects',
        name: 'Projects',
        href: '/projects',
        keywords: [
            'kanban',
            'board',
            'tasks'
        ]
    },
    {
        id: 'mockit',
        name: 'Mockit',
        href: '/mockit',
        keywords: [
            'mockup',
            'prototype',
            'design'
        ]
    },
    {
        id: 'humans',
        name: 'Humans',
        href: '/humans',
        keywords: [
            'people',
            'contacts',
            'search',
            'entities'
        ]
    },
    {
        id: 'activity',
        name: 'Activity',
        href: '/activity',
        keywords: [
            'log',
            'history',
            'events'
        ]
    },
    {
        id: 'calendar',
        name: 'Calendar',
        href: '/calendar',
        keywords: [
            'schedule',
            'events',
            'booking'
        ]
    },
    {
        id: 'contacts',
        name: 'Contacts',
        href: '/contacts',
        keywords: [
            'people',
            'address',
            'book'
        ]
    },
    {
        id: 'photos',
        name: 'Photos',
        href: '/photos',
        keywords: [
            'images',
            'gallery',
            'pictures'
        ]
    },
    {
        id: 'inspirations',
        name: 'Inspirations',
        href: '/inspirations',
        keywords: [
            'ideas',
            'references',
            'mood'
        ]
    },
    {
        id: '3d-gallery',
        name: '3-D Gallery',
        href: '/gallery-3d',
        keywords: [
            'three',
            'dimensional',
            'webgl'
        ]
    },
    {
        id: 'avatar',
        name: 'Avatar',
        href: '/avatar',
        keywords: [
            '3d',
            'profile',
            'character',
            'interactive'
        ]
    },
    {
        id: 'weather',
        name: 'Weather',
        href: '/weather',
        keywords: [
            'forecast',
            'temperature'
        ]
    },
    {
        id: 'games',
        name: 'Games',
        href: '/games',
        keywords: [
            'play',
            'fun',
            'memory'
        ]
    },
    {
        id: 'terminal',
        name: 'Terminal',
        href: '/terminal',
        keywords: [
            'cli',
            'command',
            'shell'
        ]
    },
    {
        id: 'reels',
        name: 'Reels',
        href: '/reels',
        keywords: [
            'videos',
            'clips',
            'shorts'
        ]
    },
    {
        id: 'regulation',
        name: 'Regulate',
        href: '/regulate',
        keywords: [
            'calm',
            'breathing',
            'adhd',
            'neuro'
        ]
    },
    {
        id: 'journal',
        name: 'Journal',
        href: '/journal',
        keywords: [
            'diary',
            'writing',
            'reflection',
            'neuro'
        ]
    },
    {
        id: 'food',
        name: 'Food',
        href: '/food',
        keywords: [
            'meals',
            'nutrition',
            'eating',
            'neuro'
        ]
    },
    {
        id: 'sidequests',
        name: 'Side Quests',
        href: '/sidequests',
        keywords: [
            'tasks',
            'adhd',
            'dopamine',
            'neuro'
        ]
    },
    {
        id: 'hyperfocus',
        name: 'Hyperfocus',
        href: '/hyperfocus',
        keywords: [
            'focus',
            'flow',
            'adhd',
            'neuro'
        ]
    },
    {
        id: 'bubble-timer',
        name: 'Bubble Timer',
        href: '/neuro/bubble-timer',
        keywords: [
            'timer',
            'visual',
            'countdown',
            'neuro',
            'adhd'
        ]
    },
    {
        id: 'skills',
        name: 'Skills',
        href: '/skills',
        keywords: [
            'abilities',
            'expertise'
        ]
    },
    {
        id: 'system',
        name: 'System',
        href: '/system',
        keywords: [
            'info',
            'status',
            'about'
        ]
    },
    {
        id: 'security',
        name: 'Security',
        href: '/security',
        keywords: [
            'admin',
            'monitoring',
            'fortress',
            'logs'
        ]
    },
    {
        id: 'vault',
        name: 'Vault',
        href: '/vault',
        keywords: [
            'private',
            'protected',
            'secret'
        ]
    },
    {
        id: 'threads',
        name: 'Threads',
        href: '/threads',
        keywords: [
            'conversations',
            'chat',
            'history'
        ]
    },
    {
        id: 'search',
        name: 'Search',
        href: '/search',
        keywords: [
            'find',
            'lookup',
            'query'
        ]
    },
    {
        id: 'reminders',
        name: 'Reminders',
        href: '/reminders',
        keywords: [
            'todos',
            'alerts',
            'notifications'
        ]
    },
    {
        id: 'memory',
        name: 'Memory',
        href: '/memory',
        keywords: [
            'brain',
            'recall',
            'ai',
            'learning'
        ]
    },
    {
        id: 'wiki',
        name: 'Wiki',
        href: '/wiki',
        keywords: [
            'docs',
            'documentation',
            'help'
        ]
    },
    {
        id: 'watch',
        name: 'Watch',
        href: '/watch',
        keywords: [
            'video',
            'stream',
            'media'
        ]
    },
    // Chat
    {
        id: 'chat',
        name: 'Chat',
        href: '/chat',
        keywords: [
            'ai',
            'james',
            'assistant',
            'talk'
        ]
    }
];
const appCommands = apps.map((app)=>({
        id: `app-${app.id}`,
        type: 'app',
        name: app.name,
        description: `Open ${app.name}`,
        keywords: [
            app.id,
            app.name.toLowerCase(),
            ...app.keywords || []
        ],
        href: app.href,
        external: app.external
    }));
const themeCommands = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$definitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["themes"].map((theme)=>({
        id: `theme-${theme.name}`,
        type: 'theme',
        name: theme.label,
        description: `Switch to ${theme.label} theme`,
        keywords: [
            theme.name,
            theme.label.toLowerCase()
        ]
    }));
const actionCommands = [
    {
        id: 'action-toggle-dark',
        type: 'action',
        name: 'Toggle Dark Mode',
        description: 'Switch between light and dark mode',
        keywords: [
            'dark',
            'light',
            'mode',
            'theme',
            'toggle'
        ],
        shortcut: 'D'
    },
    {
        id: 'action-go-home',
        type: 'action',
        name: 'Go Home',
        description: 'Return to the home screen',
        keywords: [
            'home',
            'desktop',
            'main'
        ],
        href: '/',
        shortcut: 'H'
    },
    {
        id: 'action-open-settings',
        type: 'action',
        name: 'Open Settings',
        description: 'Open OpenClaw-OS settings',
        keywords: [
            'settings',
            'preferences',
            'config'
        ],
        href: '/settings',
        shortcut: 'S'
    },
    {
        id: 'action-open-projects',
        type: 'action',
        name: 'View Projects',
        description: 'Open the Kanban project board',
        keywords: [
            'projects',
            'kanban',
            'board',
            'tasks'
        ],
        href: '/projects',
        shortcut: 'P'
    },
    {
        id: 'action-open-canvas',
        type: 'action',
        name: 'Open Canvas',
        description: 'Open the infinite design canvas',
        keywords: [
            'canvas',
            'design',
            'draw',
            'sketch',
            'whiteboard',
            'infinite',
            'moodboard',
            'wireframe'
        ],
        href: '/canvas',
        shortcut: 'C'
    },
    {
        id: 'action-open-chat',
        type: 'action',
        name: 'Chat with Claw AI',
        description: 'Open the AI assistant',
        keywords: [
            'ai',
            'james',
            'chat',
            'assistant',
            'help',
            'ask'
        ],
        href: '/chat',
        shortcut: 'J'
    },
    {
        id: 'action-open-humans',
        type: 'action',
        name: 'Search People',
        description: 'Search for people and entities',
        keywords: [
            'humans',
            'people',
            'contacts',
            'search',
            'entities'
        ],
        href: '/humans'
    },
    {
        id: 'action-open-memories',
        type: 'action',
        name: 'View Memories',
        description: 'Browse AI memory and learning',
        keywords: [
            'memories',
            'brain',
            'learning',
            'recall'
        ],
        href: '/memory'
    },
    {
        id: 'action-reset-home',
        type: 'action',
        name: 'Reset Home Screen',
        description: 'Reset home screen to default layout',
        keywords: [
            'reset',
            'default',
            'home',
            'layout'
        ]
    }
];
const wikiCommands = [
    {
        id: 'wiki-home',
        type: 'wiki',
        name: 'Wiki Home',
        description: 'Documentation home',
        keywords: [
            'wiki',
            'docs',
            'documentation',
            'home'
        ],
        href: '/wiki'
    },
    {
        id: 'wiki-philosophy',
        type: 'wiki',
        name: 'Philosophy',
        description: 'Vision, manifesto, and design principles',
        keywords: [
            'philosophy',
            'vision',
            'manifesto',
            'principles',
            'bet'
        ],
        href: '/wiki/philosophy'
    },
    {
        id: 'wiki-getting-started',
        type: 'wiki',
        name: 'Getting Started',
        description: 'Onboarding, setup, and architecture overview',
        keywords: [
            'getting',
            'started',
            'setup',
            'onboarding',
            'install'
        ],
        href: '/wiki/getting-started'
    },
    {
        id: 'wiki-architecture',
        type: 'wiki',
        name: 'Architecture',
        description: 'Technical architecture and system design',
        keywords: [
            'architecture',
            'technical',
            'system',
            'design',
            'patterns'
        ],
        href: '/wiki/architecture'
    },
    {
        id: 'wiki-features',
        type: 'wiki',
        name: 'Features',
        description: 'Feature documentation and PRDs',
        keywords: [
            'features',
            'prd',
            'product',
            'specs'
        ],
        href: '/wiki/features'
    },
    {
        id: 'wiki-roadmap',
        type: 'wiki',
        name: 'Roadmap',
        description: 'Future plans and proposals',
        keywords: [
            'roadmap',
            'future',
            'plans',
            'proposals'
        ],
        href: '/wiki/roadmap'
    },
    {
        id: 'wiki-completed',
        type: 'wiki',
        name: 'Completed Work',
        description: 'Archive of shipped features',
        keywords: [
            'completed',
            'shipped',
            'done',
            'archive',
            'history'
        ],
        href: '/wiki/completed'
    },
    {
        id: 'wiki-attributions',
        type: 'wiki',
        name: 'Attributions',
        description: 'Open source credits and inspirations',
        keywords: [
            'attributions',
            'credits',
            'inspirations',
            'thanks',
            'open source'
        ],
        href: '/wiki/attributions'
    }
];
const allCommands = [
    ...appCommands,
    ...themeCommands,
    ...actionCommands,
    ...wikiCommands
];
const commandGroups = [
    {
        id: 'apps',
        name: 'Apps',
        commands: appCommands
    },
    {
        id: 'themes',
        name: 'Themes',
        commands: themeCommands
    },
    {
        id: 'actions',
        name: 'Actions',
        commands: actionCommands
    },
    {
        id: 'wiki',
        name: 'Wiki',
        commands: wikiCommands
    }
];
function getCommandById(id) {
    return allCommands.find((cmd)=>cmd.id === id);
}
function getCommandsByType(type) {
    return allCommands.filter((cmd)=>cmd.type === type);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/command-palette/CommandPaletteProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CommandPaletteProvider",
    ()=>CommandPaletteProvider,
    "useCommandPalette",
    ()=>useCommandPalette
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$fuse$2e$js$40$7$2e$1$2e$0$2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/fuse.js@7.1.0/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DesignThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/DesignThemeContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$HomeScreenContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/HomeScreenContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-themes@0.4.6_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$command$2d$palette$2f$commands$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/command-palette/commands.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
const STORAGE_KEY = 'openclaw_recentCommands';
const MAX_RECENT = 5;
const CommandPaletteContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
// Parse query for special syntax
function parseQuery(query) {
    const trimmed = query.trim();
    // @james prefix for AI
    if (trimmed.startsWith('@james')) {
        return {
            raw: query,
            search: '',
            prefix: 'ai',
            aiQuery: trimmed.slice(6).trim()
        };
    }
    // > prefix for actions
    if (trimmed.startsWith('>')) {
        return {
            raw: query,
            search: trimmed.slice(1).trim(),
            prefix: 'action',
            type: 'action'
        };
    }
    // theme: prefix for quick theme switch
    if (trimmed.toLowerCase().startsWith('theme:')) {
        return {
            raw: query,
            search: trimmed.slice(6).trim(),
            prefix: 'theme',
            type: 'theme',
            themeName: trimmed.slice(6).trim()
        };
    }
    // wiki: prefix for documentation search
    if (trimmed.toLowerCase().startsWith('wiki:')) {
        return {
            raw: query,
            search: trimmed.slice(5).trim(),
            prefix: 'wiki',
            type: 'wiki'
        };
    }
    // type:app filter
    if (trimmed.toLowerCase().startsWith('type:app')) {
        return {
            raw: query,
            search: trimmed.slice(8).trim(),
            type: 'app'
        };
    }
    // type:theme filter
    if (trimmed.toLowerCase().startsWith('type:theme')) {
        return {
            raw: query,
            search: trimmed.slice(10).trim(),
            type: 'theme'
        };
    }
    // type:action filter
    if (trimmed.toLowerCase().startsWith('type:action')) {
        return {
            raw: query,
            search: trimmed.slice(11).trim(),
            type: 'action'
        };
    }
    return {
        raw: query,
        search: trimmed
    };
}
// Fuse.js options for fuzzy search
const fuseOptions = {
    keys: [
        {
            name: 'name',
            weight: 2
        },
        {
            name: 'description',
            weight: 1
        },
        {
            name: 'keywords',
            weight: 1.5
        }
    ],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true
};
function CommandPaletteProvider({ children }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { setDesignTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DesignThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDesignTheme"])();
    const { resetToDefault: resetHomeScreen } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$HomeScreenContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHomeScreen"])();
    const { setTheme: setDarkMode, theme: darkModeTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isOpen: false,
        query: '',
        selectedIndex: 0,
        results: [],
        recentCommands: []
    });
    // Load recent commands from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommandPaletteProvider.useEffect": ()=>{
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setState({
                        "CommandPaletteProvider.useEffect": (prev)=>({
                                ...prev,
                                recentCommands: JSON.parse(stored)
                            })
                    }["CommandPaletteProvider.useEffect"]);
                }
            } catch  {
            // Ignore errors
            }
        }
    }["CommandPaletteProvider.useEffect"], []);
    // Save recent command
    const saveRecentCommand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommandPaletteProvider.useCallback[saveRecentCommand]": (commandId)=>{
            setState({
                "CommandPaletteProvider.useCallback[saveRecentCommand]": (prev)=>{
                    const recent = [
                        commandId,
                        ...prev.recentCommands.filter({
                            "CommandPaletteProvider.useCallback[saveRecentCommand].recent": (id)=>id !== commandId
                        }["CommandPaletteProvider.useCallback[saveRecentCommand].recent"])
                    ].slice(0, MAX_RECENT);
                    try {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
                    } catch  {
                    // Ignore errors
                    }
                    return {
                        ...prev,
                        recentCommands: recent
                    };
                }
            }["CommandPaletteProvider.useCallback[saveRecentCommand]"]);
        }
    }["CommandPaletteProvider.useCallback[saveRecentCommand]"], []);
    // Create Fuse instance
    const fuse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CommandPaletteProvider.useMemo[fuse]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$fuse$2e$js$40$7$2e$1$2e$0$2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$command$2d$palette$2f$commands$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allCommands"], fuseOptions)
    }["CommandPaletteProvider.useMemo[fuse]"], []);
    // Search commands
    const searchCommands = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommandPaletteProvider.useCallback[searchCommands]": (query)=>{
            const parsed = parseQuery(query);
            // AI query - return empty, will be handled differently
            if (parsed.prefix === 'ai') {
                return [];
            }
            // Get base commands to search
            let commandsToSearch = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$command$2d$palette$2f$commands$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allCommands"];
            if (parsed.type) {
                commandsToSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$command$2d$palette$2f$commands$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCommandsByType"])(parsed.type);
            }
            // If no search term, return all matching commands
            if (!parsed.search) {
                return commandsToSearch.slice(0, 10);
            }
            // Fuzzy search
            const searchFuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$fuse$2e$js$40$7$2e$1$2e$0$2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](commandsToSearch, fuseOptions);
            const results = searchFuse.search(parsed.search);
            return results.map({
                "CommandPaletteProvider.useCallback[searchCommands]": (r)=>r.item
            }["CommandPaletteProvider.useCallback[searchCommands]"]).slice(0, 10);
        }
    }["CommandPaletteProvider.useCallback[searchCommands]"], [
        fuse
    ]);
    // Update results when query changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommandPaletteProvider.useEffect": ()=>{
            const results = searchCommands(state.query);
            setState({
                "CommandPaletteProvider.useEffect": (prev)=>({
                        ...prev,
                        results,
                        selectedIndex: 0
                    })
            }["CommandPaletteProvider.useEffect"]);
        }
    }["CommandPaletteProvider.useEffect"], [
        state.query,
        searchCommands
    ]);
    // Open palette
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommandPaletteProvider.useCallback[open]": ()=>{
            setState({
                "CommandPaletteProvider.useCallback[open]": (prev)=>({
                        ...prev,
                        isOpen: true,
                        query: '',
                        selectedIndex: 0
                    })
            }["CommandPaletteProvider.useCallback[open]"]);
        }
    }["CommandPaletteProvider.useCallback[open]"], []);
    // Close palette
    const close = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommandPaletteProvider.useCallback[close]": ()=>{
            setState({
                "CommandPaletteProvider.useCallback[close]": (prev)=>({
                        ...prev,
                        isOpen: false,
                        query: '',
                        selectedIndex: 0
                    })
            }["CommandPaletteProvider.useCallback[close]"]);
        }
    }["CommandPaletteProvider.useCallback[close]"], []);
    // Toggle palette
    const toggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommandPaletteProvider.useCallback[toggle]": ()=>{
            setState({
                "CommandPaletteProvider.useCallback[toggle]": (prev)=>{
                    if (prev.isOpen) {
                        return {
                            ...prev,
                            isOpen: false,
                            query: '',
                            selectedIndex: 0
                        };
                    }
                    return {
                        ...prev,
                        isOpen: true,
                        query: '',
                        selectedIndex: 0
                    };
                }
            }["CommandPaletteProvider.useCallback[toggle]"]);
        }
    }["CommandPaletteProvider.useCallback[toggle]"], []);
    // Set query
    const setQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommandPaletteProvider.useCallback[setQuery]": (query)=>{
            setState({
                "CommandPaletteProvider.useCallback[setQuery]": (prev)=>({
                        ...prev,
                        query
                    })
            }["CommandPaletteProvider.useCallback[setQuery]"]);
        }
    }["CommandPaletteProvider.useCallback[setQuery]"], []);
    // Select index
    const selectIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommandPaletteProvider.useCallback[selectIndex]": (index)=>{
            setState({
                "CommandPaletteProvider.useCallback[selectIndex]": (prev)=>({
                        ...prev,
                        selectedIndex: index
                    })
            }["CommandPaletteProvider.useCallback[selectIndex]"]);
        }
    }["CommandPaletteProvider.useCallback[selectIndex]"], []);
    // Navigate up
    const navigateUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommandPaletteProvider.useCallback[navigateUp]": ()=>{
            setState({
                "CommandPaletteProvider.useCallback[navigateUp]": (prev)=>({
                        ...prev,
                        selectedIndex: Math.max(0, prev.selectedIndex - 1)
                    })
            }["CommandPaletteProvider.useCallback[navigateUp]"]);
        }
    }["CommandPaletteProvider.useCallback[navigateUp]"], []);
    // Navigate down
    const navigateDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommandPaletteProvider.useCallback[navigateDown]": ()=>{
            setState({
                "CommandPaletteProvider.useCallback[navigateDown]": (prev)=>({
                        ...prev,
                        selectedIndex: Math.min(prev.results.length - 1, prev.selectedIndex + 1)
                    })
            }["CommandPaletteProvider.useCallback[navigateDown]"]);
        }
    }["CommandPaletteProvider.useCallback[navigateDown]"], []);
    // Execute command
    const executeCommand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommandPaletteProvider.useCallback[executeCommand]": (command)=>{
            saveRecentCommand(command.id);
            switch(command.type){
                case 'app':
                    if (command.href) {
                        if (command.external) {
                            window.open(command.href, '_blank');
                        } else {
                            router.push(command.href);
                        }
                    }
                    break;
                case 'theme':
                    // Extract theme name from command ID
                    const themeName = command.id.replace('theme-', '');
                    setDesignTheme(themeName);
                    break;
                case 'action':
                    switch(command.id){
                        case 'action-toggle-dark':
                            setDarkMode(darkModeTheme === 'dark' ? 'light' : 'dark');
                            break;
                        case 'action-reset-home':
                            resetHomeScreen();
                            break;
                        case 'action-claw-ai':
                            // Could trigger Claw AI overlay here
                            router.push('/');
                            break;
                        default:
                            if (command.href) {
                                router.push(command.href);
                            } else if (command.action) {
                                command.action();
                            }
                    }
                    break;
                case 'wiki':
                    // Navigate to wiki pages
                    if (command.href) {
                        router.push(command.href);
                    }
                    break;
                case 'ai':
                    break;
            }
            close();
        }
    }["CommandPaletteProvider.useCallback[executeCommand]"], [
        router,
        setDesignTheme,
        setDarkMode,
        darkModeTheme,
        resetHomeScreen,
        close,
        saveRecentCommand
    ]);
    // Execute selected command
    const executeSelected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommandPaletteProvider.useCallback[executeSelected]": ()=>{
            const command = state.results[state.selectedIndex];
            if (command) {
                executeCommand(command);
            }
        }
    }["CommandPaletteProvider.useCallback[executeSelected]"], [
        state.results,
        state.selectedIndex,
        executeCommand
    ]);
    // Global keyboard shortcut
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommandPaletteProvider.useEffect": ()=>{
            const handleKeyDown = {
                "CommandPaletteProvider.useEffect.handleKeyDown": (e)=>{
                    // Cmd/Ctrl + K to toggle
                    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                        e.preventDefault();
                        toggle();
                    }
                }
            }["CommandPaletteProvider.useEffect.handleKeyDown"];
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "CommandPaletteProvider.useEffect": ()=>window.removeEventListener('keydown', handleKeyDown)
            })["CommandPaletteProvider.useEffect"];
        }
    }["CommandPaletteProvider.useEffect"], [
        toggle
    ]);
    const value = {
        state,
        open,
        close,
        toggle,
        setQuery,
        selectIndex,
        executeCommand,
        navigateUp,
        navigateDown,
        executeSelected
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommandPaletteContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/command-palette/CommandPaletteProvider.tsx",
        lineNumber: 360,
        columnNumber: 5
    }, this);
}
_s(CommandPaletteProvider, "6BSj1msX3pBArCtIK82mRTtfSwA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DesignThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDesignTheme"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$HomeScreenContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHomeScreen"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = CommandPaletteProvider;
function useCommandPalette() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CommandPaletteContext);
    if (!context) {
        throw new Error('useCommandPalette must be used within a CommandPaletteProvider');
    }
    return context;
}
_s1(useCommandPalette, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "CommandPaletteProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/command-palette/CommandPalette.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CommandPalette",
    ()=>CommandPalette
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.34.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.34.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/palette.js [app-client] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$app$2d$window$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AppWindow$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/app-window.js [app-client] (ecmascript) <export default as AppWindow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$command$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Command$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/command.js [app-client] (ecmascript) <export default as Command>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$corner$2d$down$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CornerDownLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/corner-down-left.js [app-client] (ecmascript) <export default as CornerDownLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$command$2d$palette$2f$CommandPaletteProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/command-palette/CommandPaletteProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// Icon components for command types
function getCommandIcon(command) {
    switch(command.type){
        case 'app':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$app$2d$window$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AppWindow$3e$__["AppWindow"], {
                className: "w-4 h-4"
            }, void 0, false, {
                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                lineNumber: 23,
                columnNumber: 14
            }, this);
        case 'theme':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"], {
                className: "w-4 h-4"
            }, void 0, false, {
                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                lineNumber: 25,
                columnNumber: 14
            }, this);
        case 'action':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                className: "w-4 h-4"
            }, void 0, false, {
                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                lineNumber: 27,
                columnNumber: 14
            }, this);
        case 'ai':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                className: "w-4 h-4"
            }, void 0, false, {
                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                lineNumber: 29,
                columnNumber: 14
            }, this);
        case 'wiki':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                className: "w-4 h-4"
            }, void 0, false, {
                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                lineNumber: 31,
                columnNumber: 14
            }, this);
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                className: "w-4 h-4"
            }, void 0, false, {
                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                lineNumber: 33,
                columnNumber: 14
            }, this);
    }
}
// Get type badge color
function getTypeBadgeColor(type) {
    switch(type){
        case 'app':
            return 'bg-blue-500/20 text-blue-300';
        case 'theme':
            return 'bg-purple-500/20 text-purple-300';
        case 'action':
            return 'bg-amber-500/20 text-amber-300';
        case 'ai':
            return 'bg-emerald-500/20 text-emerald-300';
        case 'wiki':
            return 'bg-cyan-500/20 text-cyan-300';
        default:
            return 'bg-gray-500/20 text-gray-300';
    }
}
function CommandPalette() {
    _s();
    const { state, close, setQuery, selectIndex, executeCommand, navigateUp, navigateDown, executeSelected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$command$2d$palette$2f$CommandPaletteProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommandPalette"])();
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const listRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Focus input when opened
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommandPalette.useEffect": ()=>{
            if (state.isOpen && inputRef.current) {
                inputRef.current.focus();
            }
        }
    }["CommandPalette.useEffect"], [
        state.isOpen
    ]);
    // Scroll selected item into view
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommandPalette.useEffect": ()=>{
            if (listRef.current) {
                const selectedElement = listRef.current.querySelector('[data-selected="true"]');
                if (selectedElement) {
                    selectedElement.scrollIntoView({
                        block: 'nearest'
                    });
                }
            }
        }
    }["CommandPalette.useEffect"], [
        state.selectedIndex
    ]);
    // Handle keyboard navigation
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CommandPalette.useCallback[handleKeyDown]": (e)=>{
            switch(e.key){
                case 'ArrowUp':
                    e.preventDefault();
                    navigateUp();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    navigateDown();
                    break;
                case 'Enter':
                    e.preventDefault();
                    executeSelected();
                    break;
                case 'Escape':
                    e.preventDefault();
                    close();
                    break;
                case 'Tab':
                    e.preventDefault();
                    // Autocomplete - fill in the selected command name
                    if (state.results[state.selectedIndex]) {
                        setQuery(state.results[state.selectedIndex].name);
                    }
                    break;
            }
        }
    }["CommandPalette.useCallback[handleKeyDown]"], [
        navigateUp,
        navigateDown,
        executeSelected,
        close,
        state.results,
        state.selectedIndex,
        setQuery
    ]);
    // Check for AI query prefix
    const isAIQuery = state.query.trim().startsWith('@james');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: state.isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    transition: {
                        duration: 0.15
                    },
                    className: "fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]",
                    onClick: close,
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                    lineNumber: 127,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$34$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        scale: 0.95,
                        y: -20
                    },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: 0.95,
                        y: -20
                    },
                    transition: {
                        duration: 0.15,
                        ease: 'easeOut'
                    },
                    className: "fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[640px] z-[101]",
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-label": "Command palette",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-4 overflow-hidden rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 px-4 py-3 border-b border-border",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "w-5 h-5 text-muted-foreground flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                        lineNumber: 151,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ref: inputRef,
                                        type: "text",
                                        value: state.query,
                                        onChange: (e)=>setQuery(e.target.value),
                                        onKeyDown: handleKeyDown,
                                        placeholder: "Search apps, themes, actions, wiki...",
                                        className: "flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-base",
                                        "aria-label": "Search commands",
                                        autoComplete: "off",
                                        autoCorrect: "off",
                                        autoCapitalize: "off",
                                        spellCheck: "false"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                        lineNumber: 152,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1 text-muted-foreground text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                className: "px-1.5 py-0.5 rounded bg-muted font-mono",
                                                children: "esc"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                lineNumber: 167,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "to close"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                lineNumber: 168,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                        lineNumber: 166,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                lineNumber: 150,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: listRef,
                                className: "max-h-[400px] overflow-y-auto overscroll-contain",
                                role: "listbox",
                                "aria-label": "Search results",
                                children: [
                                    isAIQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                    className: "w-5 h-5 text-emerald-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                    lineNumber: 183,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-foreground font-medium",
                                                            children: "Ask Claw AI"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                            lineNumber: 185,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-muted-foreground text-sm",
                                                            children: state.query.slice(6).trim() || 'Type your question...'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                            lineNumber: 186,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$corner$2d$down$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CornerDownLeft$3e$__["CornerDownLeft"], {
                                                    className: "w-4 h-4 text-emerald-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                    lineNumber: 190,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                            lineNumber: 182,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                        lineNumber: 181,
                                        columnNumber: 19
                                    }, this),
                                    !isAIQuery && state.results.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-2",
                                        children: state.results.map((command, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                "data-selected": index === state.selectedIndex,
                                                onClick: ()=>executeCommand(command),
                                                onMouseEnter: ()=>selectIndex(index),
                                                className: `
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                          transition-colors duration-75
                          ${index === state.selectedIndex ? 'bg-muted text-foreground' : 'text-foreground/70 hover:bg-muted/50'}
                        `,
                                                role: "option",
                                                "aria-selected": index === state.selectedIndex,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `
                            flex items-center justify-center w-8 h-8 rounded-lg
                            ${index === state.selectedIndex ? 'bg-muted-foreground/20' : 'bg-muted'}
                          `,
                                                        children: getCommandIcon(command)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                        lineNumber: 217,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 min-w-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium truncate",
                                                                        children: command.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                                        lineNumber: 229,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `
                                px-1.5 py-0.5 rounded text-[10px] font-medium uppercase
                                ${getTypeBadgeColor(command.type)}
                              `,
                                                                        children: command.type
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                                        lineNumber: 230,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                                lineNumber: 228,
                                                                columnNumber: 27
                                                            }, this),
                                                            command.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-muted-foreground truncate",
                                                                children: command.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                                lineNumber: 240,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 25
                                                    }, this),
                                                    command.shortcut && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                        className: "px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono",
                                                        children: command.shortcut
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                        lineNumber: 246,
                                                        columnNumber: 27
                                                    }, this),
                                                    command.external && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                        className: "w-4 h-4 text-muted-foreground rotate-[-45deg]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                        lineNumber: 251,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, command.id, true, {
                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                lineNumber: 199,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                        lineNumber: 197,
                                        columnNumber: 19
                                    }, this),
                                    !isAIQuery && state.query && state.results.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-8 text-center text-muted-foreground",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "w-8 h-8 mx-auto mb-3 opacity-50"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                lineNumber: 261,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    'No results found for "',
                                                    state.query,
                                                    '"'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                lineNumber: 262,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm mt-1",
                                                children: "Try a different search term"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                lineNumber: 263,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                        lineNumber: 260,
                                        columnNumber: 19
                                    }, this),
                                    !state.query && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground uppercase tracking-wider px-2",
                                                children: "Quick Tips"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                lineNumber: 270,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2 text-sm text-muted-foreground",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 px-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                                className: "px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono",
                                                                children: "theme:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                                lineNumber: 275,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Switch themes quickly"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                                lineNumber: 278,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                        lineNumber: 274,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 px-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                                className: "px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono",
                                                                children: ">"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                                lineNumber: 281,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Run actions"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                                lineNumber: 284,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                        lineNumber: 280,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 px-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                                className: "px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono",
                                                                children: "@james"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                                lineNumber: 287,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Ask Claw AI anything"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                                lineNumber: 290,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                        lineNumber: 286,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 px-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                                className: "px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono",
                                                                children: "wiki:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                                lineNumber: 293,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Search documentation"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                                lineNumber: 296,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                        lineNumber: 292,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                lineNumber: 273,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                        lineNumber: 269,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                lineNumber: 173,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                        className: "px-1 py-0.5 rounded bg-muted font-mono",
                                                        children: "↑"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                        lineNumber: 307,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                        className: "px-1 py-0.5 rounded bg-muted font-mono",
                                                        children: "↓"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                        lineNumber: 308,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "navigate"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                        lineNumber: 309,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                lineNumber: 306,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                        className: "px-1 py-0.5 rounded bg-muted font-mono",
                                                        children: "↵"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                        lineNumber: 312,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "select"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                        lineNumber: 313,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                lineNumber: 311,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                        className: "px-1 py-0.5 rounded bg-muted font-mono",
                                                        children: "tab"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                        lineNumber: 316,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "autocomplete"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                        lineNumber: 317,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                lineNumber: 315,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                        lineNumber: 305,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$command$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Command$3e$__["Command"], {
                                                className: "w-3 h-3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                lineNumber: 321,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "K"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                                lineNumber: 322,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                        lineNumber: 320,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                                lineNumber: 304,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                        lineNumber: 148,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
                    lineNumber: 138,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true)
    }, void 0, false, {
        fileName: "[project]/src/components/command-palette/CommandPalette.tsx",
        lineNumber: 123,
        columnNumber: 5
    }, this);
}
_s(CommandPalette, "xKJNZ3PyBTt0/TXYcAC54sk8Fb0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$command$2d$palette$2f$CommandPaletteProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCommandPalette"]
    ];
});
_c = CommandPalette;
var _c;
__turbopack_context__.k.register(_c, "CommandPalette");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_command-palette_c2686d5a._.js.map