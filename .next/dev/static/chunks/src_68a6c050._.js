(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatDate",
    ()=>formatDate,
    "formatLocalDate",
    ()=>formatLocalDate,
    "formatLocalDateTime",
    ()=>formatLocalDateTime,
    "formatLocalTime",
    ()=>formatLocalTime,
    "getUserLocale",
    ()=>getUserLocale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$2$2e$6$2e$1$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@2.6.1/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$2$2e$6$2e$1$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function getUserLocale() {
    if (typeof navigator !== 'undefined') {
        return navigator.language || navigator.languages?.[0] || 'en-US';
    }
    return 'en-US';
}
function formatLocalDate(date, options) {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString(getUserLocale(), options);
}
function formatLocalTime(date, options) {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleTimeString(getUserLocale(), options);
}
function formatLocalDateTime(date, options) {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleString(getUserLocale(), options);
}
function formatDate(date) {
    let currentDate = new Date().getTime();
    if (!date.includes("T")) {
        date = `${date}T00:00:00`;
    }
    let targetDate = new Date(date).getTime();
    let timeDifference = Math.abs(currentDate - targetDate);
    let daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    let fullDate = formatLocalDate(date, {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
    if (daysAgo < 1) {
        return "Today";
    } else if (daysAgo < 7) {
        return `${fullDate} (${daysAgo}d ago)`;
    } else if (daysAgo < 30) {
        const weeksAgo = Math.floor(daysAgo / 7);
        return `${fullDate} (${weeksAgo}w ago)`;
    } else if (daysAgo < 365) {
        const monthsAgo = Math.floor(daysAgo / 30);
        return `${fullDate} (${monthsAgo}mo ago)`;
    } else {
        const yearsAgo = Math.floor(daysAgo / 365);
        return `${fullDate} (${yearsAgo}y ago)`;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/claw-ai/proactive-engine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Claw AI Proactive Engine
 *
 * This is the brain that drives Claw AI's proactive behavior.
 * Based on the EXPERIENCE_PHILOSOPHY.md:
 * - "Claw AI is an operator, not a chatbot"
 * - "Agentic without being theatrical"
 * - "Structures, files, notifies, remembers"
 *
 * Claw AI proactively engages users to hook them into working together
 * on something meaningful, demonstrating the OS philosophy.
 */ __turbopack_context__.s([
    "ENGAGEMENT_STATE_KEY",
    ()=>ENGAGEMENT_STATE_KEY,
    "determineProactiveAction",
    ()=>determineProactiveAction,
    "getCollaborationOffer",
    ()=>getCollaborationOffer,
    "getDefaultEngagementState",
    ()=>getDefaultEngagementState,
    "getEngagementMessage",
    ()=>getEngagementMessage,
    "getFeatureDiscoveryMessage",
    ()=>getFeatureDiscoveryMessage,
    "loadEngagementState",
    ()=>loadEngagementState,
    "saveEngagementState",
    ()=>saveEngagementState
]);
// Engagement messages Claw AI can send to hook the user
const ENGAGEMENT_MESSAGES = [
    // First visit - introduce the OS
    {
        trigger: 'first_visit',
        title: "Welcome to OpenClaw-OS",
        body: "I'm Claw AI – your AI operator. Want me to show you how I think, design, and build? We could even prototype something together.",
        appId: 'claw-ai',
        priority: 'high',
        actions: [
            {
                label: "Show me around",
                type: 'open_chat'
            },
            {
                label: "Explore on my own",
                type: 'dismiss'
            }
        ]
    },
    // Return visit - remember them
    {
        trigger: 'return_visit',
        title: "Welcome back",
        body: "Good to see you again. I've been thinking about some improvements to the system. Want to collaborate on something?",
        appId: 'claw-ai',
        priority: 'medium',
        actions: [
            {
                label: "Let's talk",
                type: 'open_chat'
            },
            {
                label: "Maybe later",
                type: 'dismiss'
            }
        ]
    },
    // Idle user - re-engage
    {
        trigger: 'idle_user',
        title: "Hey, I have an idea",
        body: "I noticed you've been exploring. Want me to help you build something real? I can generate a PRD, create wireframes, or plan a project.",
        appId: 'claw-ai',
        priority: 'medium',
        actions: [
            {
                label: "I'm interested",
                type: 'open_chat'
            },
            {
                label: "Not now",
                type: 'dismiss'
            }
        ]
    },
    // Feature discovery - Design app
    {
        trigger: 'feature_discovery',
        title: "Try the Design app",
        body: "I've got 40+ themes in there – each tells a story about how design decisions get made. It's not decoration, it's decision-making.",
        appId: 'design',
        priority: 'low',
        actions: [
            {
                label: "Show me",
                type: 'navigate',
                href: '/design'
            },
            {
                label: "Later",
                type: 'dismiss'
            }
        ]
    },
    // Feature discovery - Jamz studio
    {
        trigger: 'feature_discovery',
        title: "Check out the studio",
        body: "There's a full DAW (digital audio workstation) in here. You can make actual music. I built it to show what's possible.",
        appId: 'jamz',
        priority: 'low',
        actions: [
            {
                label: "Open Jamz",
                type: 'navigate',
                href: '/studio'
            },
            {
                label: "Maybe later",
                type: 'dismiss'
            }
        ]
    },
    // Feature discovery - Projects
    {
        trigger: 'feature_discovery',
        title: "See OpenClaw-OS in action",
        body: "The Projects app shows real tickets – this isn't a demo. You're exploring the actual product being built. Want to contribute?",
        appId: 'projects',
        priority: 'medium',
        actions: [
            {
                label: "Show me the roadmap",
                type: 'navigate',
                href: '/projects'
            },
            {
                label: "Not now",
                type: 'dismiss'
            }
        ]
    },
    // Collaboration offer - Product
    {
        trigger: 'collaboration_offer',
        title: "Let's build something",
        body: "I can help you think through a problem – define the audience, map workflows, and scope an MVP. All in conversation.",
        appId: 'product',
        priority: 'high',
        actions: [
            {
                label: "I have a problem to solve",
                type: 'open_chat'
            },
            {
                label: "Just exploring",
                type: 'dismiss'
            }
        ]
    },
    // Collaboration offer - Prototyping
    {
        trigger: 'collaboration_offer',
        title: "Prototype together?",
        body: "Give me a concept and I'll generate screens, flows, and components. Real-time. Want to try?",
        appId: 'prototyping',
        priority: 'high',
        actions: [
            {
                label: "Let's prototype",
                type: 'navigate',
                href: '/prototyping'
            },
            {
                label: "Maybe later",
                type: 'dismiss'
            }
        ]
    },
    // Scheduled checkin
    {
        trigger: 'scheduled_checkin',
        title: "Quick check-in",
        body: "Just wanted to ping you – I'm here if you need anything. Thinking about building something new?",
        appId: 'claw-ai',
        priority: 'low',
        actions: [
            {
                label: "Actually, yes",
                type: 'open_chat'
            },
            {
                label: "All good",
                type: 'dismiss'
            }
        ]
    }
];
// Generate unique ID
function generateId() {
    return `proactive_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
function getEngagementMessage(trigger) {
    const candidates = ENGAGEMENT_MESSAGES.filter((m)=>m.trigger === trigger);
    if (candidates.length === 0) return null;
    // Pick a random one if multiple
    const message = candidates[Math.floor(Math.random() * candidates.length)];
    return {
        ...message,
        id: generateId(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000
    };
}
function getFeatureDiscoveryMessage(visitedApps) {
    const featureMessages = ENGAGEMENT_MESSAGES.filter((m)=>m.trigger === 'feature_discovery' && !visitedApps.has(m.appId));
    if (featureMessages.length === 0) return null;
    const message = featureMessages[Math.floor(Math.random() * featureMessages.length)];
    return {
        ...message,
        id: generateId(),
        expiresAt: Date.now() + 12 * 60 * 60 * 1000
    };
}
function getCollaborationOffer() {
    const collabMessages = ENGAGEMENT_MESSAGES.filter((m)=>m.trigger === 'collaboration_offer');
    if (collabMessages.length === 0) return null;
    const message = collabMessages[Math.floor(Math.random() * collabMessages.length)];
    return {
        ...message,
        id: generateId(),
        expiresAt: Date.now() + 6 * 60 * 60 * 1000
    };
}
const ENGAGEMENT_STATE_KEY = 'openclaw_engagement_state';
function getDefaultEngagementState() {
    return {
        firstVisit: true,
        visitCount: 0,
        lastVisit: 0,
        visitedApps: [],
        dismissedMessages: [],
        lastEngagementTime: 0,
        hasInteractedWithClaw: false
    };
}
function loadEngagementState() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const saved = localStorage.getItem(ENGAGEMENT_STATE_KEY);
        if (saved) {
            return {
                ...getDefaultEngagementState(),
                ...JSON.parse(saved)
            };
        }
    } catch (e) {
        console.error('Failed to load engagement state:', e);
    }
    return getDefaultEngagementState();
}
function saveEngagementState(state) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(ENGAGEMENT_STATE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Failed to save engagement state:', e);
    }
}
function determineProactiveAction(state) {
    const now = Date.now();
    const hoursSinceLastEngagement = (now - state.lastEngagementTime) / (1000 * 60 * 60);
    const hoursSinceLastVisit = (now - state.lastVisit) / (1000 * 60 * 60);
    // First visit - welcome them
    if (state.firstVisit && state.visitCount <= 1) {
        return getEngagementMessage('first_visit');
    }
    // Return visit after being away for 24+ hours
    if (hoursSinceLastVisit > 24 && hoursSinceLastEngagement > 24) {
        return getEngagementMessage('return_visit');
    }
    // Been on site for a while without engaging - offer help
    if (hoursSinceLastEngagement > 0.5 && !state.hasInteractedWithClaw) {
        return getEngagementMessage('idle_user');
    }
    // Haven't explored many apps - suggest one
    if (state.visitedApps.length < 3 && hoursSinceLastEngagement > 0.25) {
        return getFeatureDiscoveryMessage(new Set(state.visitedApps));
    }
    // Has explored but not collaborated - offer
    if (state.visitedApps.length >= 3 && !state.hasInteractedWithClaw && hoursSinceLastEngagement > 1) {
        return getCollaborationOffer();
    }
    // Periodic check-in for engaged users
    if (state.hasInteractedWithClaw && hoursSinceLastEngagement > 24) {
        return getEngagementMessage('scheduled_checkin');
    }
    return null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/themes/definitions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/themes/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$definitions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/themes/definitions.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/canvas/grid-system.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Canvas Grid System - Provides coordinate-based spatial awareness for Claw AI
 *
 * Converts pixel positions to grid coordinates (like A1, B2, C3 or row,col)
 * Allows AI to understand and manipulate canvas through a matrix system
 */ // Grid configuration
__turbopack_context__.s([
    "GRID_CONFIG",
    ()=>GRID_CONFIG,
    "NODE_COLORS",
    ()=>NODE_COLORS,
    "colToLetter",
    ()=>colToLetter,
    "describeCanvas",
    ()=>describeCanvas,
    "getColorHex",
    ()=>getColorHex,
    "getColorName",
    ()=>getColorName,
    "getDirectionBetween",
    ()=>getDirectionBetween,
    "getRelativePosition",
    ()=>getRelativePosition,
    "gridToPixel",
    ()=>gridToPixel,
    "letterToCol",
    ()=>letterToCol,
    "pixelToGrid",
    ()=>pixelToGrid
]);
const GRID_CONFIG = {
    CELL_SIZE: 100,
    GRID_COLS: 100,
    GRID_ROWS: 100,
    CANVAS_WIDTH: 10000,
    CANVAS_HEIGHT: 10000,
    OFFSET: 5000
};
function colToLetter(col) {
    let result = '';
    let c = col;
    while(c >= 0){
        result = String.fromCharCode(c % 26 + 65) + result;
        c = Math.floor(c / 26) - 1;
    }
    return result;
}
function letterToCol(letter) {
    let result = 0;
    for(let i = 0; i < letter.length; i++){
        result = result * 26 + (letter.charCodeAt(i) - 64);
    }
    return result - 1;
}
function pixelToGrid(pixel) {
    // Account for canvas offset (nodes are stored at x+5000, y+5000)
    const adjustedX = pixel.x + GRID_CONFIG.OFFSET;
    const adjustedY = pixel.y + GRID_CONFIG.OFFSET;
    const col = Math.floor(adjustedX / GRID_CONFIG.CELL_SIZE);
    const row = Math.floor(adjustedY / GRID_CONFIG.CELL_SIZE);
    return {
        row: Math.max(0, Math.min(row, GRID_CONFIG.GRID_ROWS - 1)),
        col: Math.max(0, Math.min(col, GRID_CONFIG.GRID_COLS - 1)),
        label: `${colToLetter(col)}${row + 1}`
    };
}
function gridToPixel(grid) {
    let row;
    let col;
    if (typeof grid === 'string') {
        // Parse label like "A1", "B5", "AA23"
        const match = grid.match(/^([A-Z]+)(\d+)$/i);
        if (!match) {
            throw new Error(`Invalid grid label: ${grid}`);
        }
        col = letterToCol(match[1].toUpperCase());
        row = parseInt(match[2], 10) - 1;
    } else {
        row = grid.row;
        col = grid.col;
    }
    // Return center of cell, adjusted for canvas offset
    return {
        x: col * GRID_CONFIG.CELL_SIZE + GRID_CONFIG.CELL_SIZE / 2 - GRID_CONFIG.OFFSET,
        y: row * GRID_CONFIG.CELL_SIZE + GRID_CONFIG.CELL_SIZE / 2 - GRID_CONFIG.OFFSET
    };
}
function describeCanvas(nodes, edges) {
    if (nodes.length === 0) {
        return {
            totalNodes: 0,
            totalConnections: 0,
            gridBounds: {
                minRow: 0,
                maxRow: 0,
                minCol: 0,
                maxCol: 0,
                minLabel: 'A1',
                maxLabel: 'A1'
            },
            nodes: [],
            spatialLayout: 'The canvas is empty.'
        };
    }
    // Convert nodes to descriptions with grid positions
    const nodeDescriptions = nodes.map((node)=>{
        const gridPos = pixelToGrid({
            x: node.x,
            y: node.y
        });
        const connectedEdges = edges.filter((e)=>e.source === node.id || e.target === node.id);
        const connections = connectedEdges.map((e)=>e.source === node.id ? e.target : e.source);
        return {
            id: node.id,
            type: node.type,
            content: node.content?.slice(0, 100) || '',
            gridPosition: gridPos.label,
            pixelPosition: {
                x: node.x,
                y: node.y
            },
            size: {
                width: node.width,
                height: node.height
            },
            color: node.style?.fill,
            connections
        };
    });
    // Calculate grid bounds
    const gridPositions = nodes.map((n)=>pixelToGrid({
            x: n.x,
            y: n.y
        }));
    const minRow = Math.min(...gridPositions.map((g)=>g.row));
    const maxRow = Math.max(...gridPositions.map((g)=>g.row));
    const minCol = Math.min(...gridPositions.map((g)=>g.col));
    const maxCol = Math.max(...gridPositions.map((g)=>g.col));
    // Generate spatial layout description
    const spatialLayout = generateSpatialDescription(nodeDescriptions);
    return {
        totalNodes: nodes.length,
        totalConnections: edges.length,
        gridBounds: {
            minRow,
            maxRow,
            minCol,
            maxCol,
            minLabel: `${colToLetter(minCol)}${minRow + 1}`,
            maxLabel: `${colToLetter(maxCol)}${maxRow + 1}`
        },
        nodes: nodeDescriptions,
        spatialLayout
    };
}
/**
 * Generate a human-readable spatial description
 */ function generateSpatialDescription(nodes) {
    if (nodes.length === 0) return 'The canvas is empty.';
    if (nodes.length === 1) {
        const n = nodes[0];
        return `There is 1 ${n.type} node at position ${n.gridPosition} with content: "${n.content.slice(0, 50)}${n.content.length > 50 ? '...' : ''}"`;
    }
    // Group nodes by approximate row
    const rowGroups = new Map();
    for (const node of nodes){
        const match = node.gridPosition.match(/\d+/);
        const row = match ? parseInt(match[0], 10) : 0;
        const bucket = Math.floor(row / 5) * 5; // Group in 5-row buckets
        if (!rowGroups.has(bucket)) rowGroups.set(bucket, []);
        rowGroups.get(bucket).push(node);
    }
    const lines = [];
    lines.push(`The canvas has ${nodes.length} nodes spread across the grid.`);
    // Describe top-level layout
    const sortedRows = Array.from(rowGroups.keys()).sort((a, b)=>a - b);
    for (const row of sortedRows){
        const nodesInRow = rowGroups.get(row);
        const positions = nodesInRow.map((n)=>n.gridPosition).join(', ');
        const types = [
            ...new Set(nodesInRow.map((n)=>n.type))
        ].join(', ');
        lines.push(`- Row ${row + 1}-${row + 5}: ${nodesInRow.length} node(s) (${types}) at ${positions}`);
    }
    // Describe connections
    const connectedNodes = nodes.filter((n)=>n.connections.length > 0);
    if (connectedNodes.length > 0) {
        lines.push(`\nConnections:`);
        for (const node of connectedNodes){
            const targetLabels = node.connections.map((id)=>nodes.find((n)=>n.id === id)?.gridPosition || id).join(', ');
            lines.push(`- ${node.gridPosition} connects to: ${targetLabels}`);
        }
    }
    return lines.join('\n');
}
function getRelativePosition(fromLabel, direction, distance = 1) {
    const match = fromLabel.match(/^([A-Z]+)(\d+)$/i);
    if (!match) throw new Error(`Invalid grid label: ${fromLabel}`);
    let col = letterToCol(match[1].toUpperCase());
    let row = parseInt(match[2], 10) - 1;
    switch(direction){
        case 'above':
            row -= distance;
            break;
        case 'below':
            row += distance;
            break;
        case 'left':
            col -= distance;
            break;
        case 'right':
            col += distance;
            break;
        case 'above-left':
            row -= distance;
            col -= distance;
            break;
        case 'above-right':
            row -= distance;
            col += distance;
            break;
        case 'below-left':
            row += distance;
            col -= distance;
            break;
        case 'below-right':
            row += distance;
            col += distance;
            break;
    }
    // Clamp to valid range
    row = Math.max(0, Math.min(row, GRID_CONFIG.GRID_ROWS - 1));
    col = Math.max(0, Math.min(col, GRID_CONFIG.GRID_COLS - 1));
    return `${colToLetter(col)}${row + 1}`;
}
function getDirectionBetween(fromLabel, toLabel) {
    const fromMatch = fromLabel.match(/^([A-Z]+)(\d+)$/i);
    const toMatch = toLabel.match(/^([A-Z]+)(\d+)$/i);
    if (!fromMatch || !toMatch) return 'same';
    const fromCol = letterToCol(fromMatch[1].toUpperCase());
    const fromRow = parseInt(fromMatch[2], 10);
    const toCol = letterToCol(toMatch[1].toUpperCase());
    const toRow = parseInt(toMatch[2], 10);
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    if (rowDiff === 0 && colDiff === 0) return 'same';
    if (rowDiff < 0 && colDiff === 0) return 'above';
    if (rowDiff > 0 && colDiff === 0) return 'below';
    if (rowDiff === 0 && colDiff < 0) return 'left';
    if (rowDiff === 0 && colDiff > 0) return 'right';
    if (rowDiff < 0 && colDiff < 0) return 'above-left';
    if (rowDiff < 0 && colDiff > 0) return 'above-right';
    if (rowDiff > 0 && colDiff < 0) return 'below-left';
    return 'below-right';
}
const NODE_COLORS = {
    yellow: '#fef08a',
    blue: '#93c5fd',
    green: '#86efac',
    pink: '#f9a8d4',
    purple: '#c4b5fd',
    orange: '#fed7aa',
    red: '#fca5a5',
    cyan: '#a5f3fc',
    white: '#ffffff',
    gray: '#d1d5db'
};
function getColorHex(colorName) {
    const normalized = colorName.toLowerCase();
    return NODE_COLORS[normalized] || NODE_COLORS.yellow;
}
function getColorName(hex) {
    const entry = Object.entries(NODE_COLORS).find(([, v])=>v.toLowerCase() === hex.toLowerCase());
    return entry?.[0] || 'yellow';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/claw-ai/canvas-tools.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CANVAS_TOOL_DEFINITIONS",
    ()=>CANVAS_TOOL_DEFINITIONS,
    "CanvasToolExecutor",
    ()=>CanvasToolExecutor,
    "generateCanvasContext",
    ()=>generateCanvasContext
]);
/**
 * Claw AI Canvas Tools - Allows AI to control the design canvas
 *
 * Tools for:
 * - Moving nodes by grid position
 * - Editing node content and colors
 * - Creating new nodes
 * - Creating mindmap branches
 * - Describing canvas state
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/canvas/grid-system.ts [app-client] (ecmascript)");
;
const CANVAS_TOOL_DEFINITIONS = [
    {
        name: 'describe_canvas',
        description: 'Get a complete description of the current canvas state including all nodes, their positions on the grid, contents, colors, and connections. Use this to understand what is on the canvas before making changes.',
        parameters: {}
    },
    {
        name: 'move_node',
        description: 'Move a node to a new position on the canvas grid. Positions use spreadsheet-style notation (A1, B2, C3, etc.) where letters are columns and numbers are rows.',
        parameters: {
            nodeId: {
                type: 'string',
                description: 'The ID of the node to move'
            },
            toPosition: {
                type: 'string',
                description: 'Target grid position (e.g., "B5", "C10", "AA3")'
            }
        }
    },
    {
        name: 'update_node_content',
        description: 'Update the text content of a node',
        parameters: {
            nodeId: {
                type: 'string',
                description: 'The ID of the node to update'
            },
            content: {
                type: 'string',
                description: 'New text content for the node'
            }
        }
    },
    {
        name: 'update_node_color',
        description: `Change the color of a node. Available colors: ${Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NODE_COLORS"]).join(', ')}`,
        parameters: {
            nodeId: {
                type: 'string',
                description: 'The ID of the node to update'
            },
            color: {
                type: 'string',
                description: 'Color name (yellow, blue, green, pink, purple, orange, red, cyan, white, gray)'
            }
        }
    },
    {
        name: 'create_node',
        description: 'Create a new node on the canvas at a specific grid position',
        parameters: {
            type: {
                type: 'string',
                description: 'Node type: sticky, text, shape, code, mindmap'
            },
            position: {
                type: 'string',
                description: 'Grid position (e.g., "B5")'
            },
            content: {
                type: 'string',
                description: 'Text content for the node'
            },
            color: {
                type: 'string',
                description: 'Optional color name',
                optional: true
            }
        }
    },
    {
        name: 'connect_nodes',
        description: 'Create a connection/edge between two nodes',
        parameters: {
            fromNodeId: {
                type: 'string',
                description: 'Source node ID'
            },
            toNodeId: {
                type: 'string',
                description: 'Target node ID'
            },
            label: {
                type: 'string',
                description: 'Optional label for the connection',
                optional: true
            }
        }
    },
    {
        name: 'delete_node',
        description: 'Delete a node from the canvas',
        parameters: {
            nodeId: {
                type: 'string',
                description: 'The ID of the node to delete'
            }
        }
    },
    {
        name: 'create_mindmap_branch',
        description: 'Add a new branch to a mindmap. Creates a new node connected to the parent node, positioned in the specified direction.',
        parameters: {
            parentNodeId: {
                type: 'string',
                description: 'The ID of the parent node to branch from'
            },
            content: {
                type: 'string',
                description: 'Text content for the new branch'
            },
            direction: {
                type: 'string',
                description: 'Direction: above, below, left, right, above-left, above-right, below-left, below-right'
            },
            color: {
                type: 'string',
                description: 'Optional color name',
                optional: true
            }
        }
    },
    {
        name: 'arrange_nodes',
        description: 'Automatically arrange selected nodes in a pattern',
        parameters: {
            nodeIds: {
                type: 'array',
                description: 'Array of node IDs to arrange'
            },
            pattern: {
                type: 'string',
                description: 'Arrangement pattern: grid, horizontal, vertical, radial, mindmap'
            },
            startPosition: {
                type: 'string',
                description: 'Starting grid position (e.g., "B5")'
            }
        }
    }
];
class CanvasToolExecutor {
    getState;
    setState;
    constructor(options){
        this.getState = options.getCanvasState;
        this.setState = options.setCanvasState;
    }
    /**
   * Execute a canvas tool by name
   */ async execute(toolName, params) {
        switch(toolName){
            case 'describe_canvas':
                return this.describeCanvas();
            case 'move_node':
                return this.moveNode(params.nodeId, params.toPosition);
            case 'update_node_content':
                return this.updateNodeContent(params.nodeId, params.content);
            case 'update_node_color':
                return this.updateNodeColor(params.nodeId, params.color);
            case 'create_node':
                return this.createNode(params.type, params.position, params.content, params.color);
            case 'connect_nodes':
                return this.connectNodes(params.fromNodeId, params.toNodeId, params.label);
            case 'delete_node':
                return this.deleteNode(params.nodeId);
            case 'create_mindmap_branch':
                return this.createMindmapBranch(params.parentNodeId, params.content, params.direction, params.color);
            case 'arrange_nodes':
                return this.arrangeNodes(params.nodeIds, params.pattern, params.startPosition);
            default:
                return {
                    success: false,
                    message: `Unknown canvas tool: ${toolName}`
                };
        }
    }
    /**
   * Describe the current canvas state
   */ describeCanvas() {
        const state = this.getState();
        const description = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["describeCanvas"])(state.nodes, state.edges);
        return {
            success: true,
            message: description.spatialLayout,
            data: description
        };
    }
    /**
   * Move a node to a grid position
   */ moveNode(nodeId, toPosition) {
        const state = this.getState();
        const nodeIndex = state.nodes.findIndex((n)=>n.id === nodeId);
        if (nodeIndex === -1) {
            return {
                success: false,
                message: `Node not found: ${nodeId}`
            };
        }
        try {
            const pixel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gridToPixel"])(toPosition);
            const newNodes = [
                ...state.nodes
            ];
            newNodes[nodeIndex] = {
                ...newNodes[nodeIndex],
                x: pixel.x,
                y: pixel.y
            };
            this.setState({
                ...state,
                nodes: newNodes
            });
            return {
                success: true,
                message: `Moved node ${nodeId} to position ${toPosition}`,
                data: {
                    nodeId,
                    newPosition: toPosition,
                    pixel
                }
            };
        } catch (error) {
            return {
                success: false,
                message: `Invalid position: ${toPosition}`
            };
        }
    }
    /**
   * Update node content
   */ updateNodeContent(nodeId, content) {
        const state = this.getState();
        const nodeIndex = state.nodes.findIndex((n)=>n.id === nodeId);
        if (nodeIndex === -1) {
            return {
                success: false,
                message: `Node not found: ${nodeId}`
            };
        }
        const newNodes = [
            ...state.nodes
        ];
        newNodes[nodeIndex] = {
            ...newNodes[nodeIndex],
            content
        };
        this.setState({
            ...state,
            nodes: newNodes
        });
        return {
            success: true,
            message: `Updated content of node ${nodeId}`,
            data: {
                nodeId,
                content
            }
        };
    }
    /**
   * Update node color
   */ updateNodeColor(nodeId, color) {
        const state = this.getState();
        const nodeIndex = state.nodes.findIndex((n)=>n.id === nodeId);
        if (nodeIndex === -1) {
            return {
                success: false,
                message: `Node not found: ${nodeId}`
            };
        }
        const hex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getColorHex"])(color);
        const newNodes = [
            ...state.nodes
        ];
        newNodes[nodeIndex] = {
            ...newNodes[nodeIndex],
            style: {
                ...newNodes[nodeIndex].style,
                fill: hex
            }
        };
        this.setState({
            ...state,
            nodes: newNodes
        });
        return {
            success: true,
            message: `Changed color of node ${nodeId} to ${color}`,
            data: {
                nodeId,
                color,
                hex
            }
        };
    }
    /**
   * Create a new node
   */ createNode(type, position, content, color) {
        const state = this.getState();
        try {
            const pixel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gridToPixel"])(position);
            const nodeId = `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            const newNode = {
                id: nodeId,
                type: type === 'mindmap' ? 'sticky' : type,
                content,
                x: pixel.x,
                y: pixel.y,
                width: type === 'text' ? 200 : 150,
                height: type === 'text' ? 50 : 100,
                style: color ? {
                    fill: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getColorHex"])(color)
                } : undefined
            };
            this.setState({
                ...state,
                nodes: [
                    ...state.nodes,
                    newNode
                ]
            });
            return {
                success: true,
                message: `Created ${type} node at ${position} with content: "${content}"`,
                data: {
                    nodeId,
                    position,
                    pixel
                }
            };
        } catch (error) {
            return {
                success: false,
                message: `Invalid position: ${position}`
            };
        }
    }
    /**
   * Connect two nodes
   */ connectNodes(fromNodeId, toNodeId, label) {
        const state = this.getState();
        const fromNode = state.nodes.find((n)=>n.id === fromNodeId);
        const toNode = state.nodes.find((n)=>n.id === toNodeId);
        if (!fromNode) {
            return {
                success: false,
                message: `Source node not found: ${fromNodeId}`
            };
        }
        if (!toNode) {
            return {
                success: false,
                message: `Target node not found: ${toNodeId}`
            };
        }
        const edgeId = `edge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const newEdge = {
            id: edgeId,
            source: fromNodeId,
            target: toNodeId,
            label
        };
        this.setState({
            ...state,
            edges: [
                ...state.edges,
                newEdge
            ]
        });
        return {
            success: true,
            message: `Connected ${fromNodeId} to ${toNodeId}${label ? ` with label "${label}"` : ''}`,
            data: {
                edgeId,
                fromNodeId,
                toNodeId
            }
        };
    }
    /**
   * Delete a node
   */ deleteNode(nodeId) {
        const state = this.getState();
        const nodeIndex = state.nodes.findIndex((n)=>n.id === nodeId);
        if (nodeIndex === -1) {
            return {
                success: false,
                message: `Node not found: ${nodeId}`
            };
        }
        // Remove node and all connected edges
        const newNodes = state.nodes.filter((n)=>n.id !== nodeId);
        const newEdges = state.edges.filter((e)=>e.source !== nodeId && e.target !== nodeId);
        this.setState({
            ...state,
            nodes: newNodes,
            edges: newEdges
        });
        return {
            success: true,
            message: `Deleted node ${nodeId}`,
            data: {
                nodeId
            }
        };
    }
    /**
   * Create a mindmap branch
   */ createMindmapBranch(parentNodeId, content, direction, color) {
        const state = this.getState();
        const parentNode = state.nodes.find((n)=>n.id === parentNodeId);
        if (!parentNode) {
            return {
                success: false,
                message: `Parent node not found: ${parentNodeId}`
            };
        }
        // Get parent position and calculate new position
        const parentGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pixelToGrid"])({
            x: parentNode.x,
            y: parentNode.y
        });
        const newPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRelativePosition"])(parentGrid.label, direction, 2);
        // Create the new node
        const createResult = this.createNode('mindmap', newPosition, content, color);
        if (!createResult.success) return createResult;
        // Connect to parent
        const newNodeId = createResult.data.nodeId;
        const connectResult = this.connectNodes(parentNodeId, newNodeId);
        return {
            success: true,
            message: `Created mindmap branch "${content}" ${direction} of parent at ${newPosition}`,
            data: {
                nodeId: newNodeId,
                parentNodeId,
                position: newPosition,
                direction
            }
        };
    }
    /**
   * Arrange nodes in a pattern
   */ arrangeNodes(nodeIds, pattern, startPosition) {
        const state = this.getState();
        // Verify all nodes exist
        for (const id of nodeIds){
            if (!state.nodes.find((n)=>n.id === id)) {
                return {
                    success: false,
                    message: `Node not found: ${id}`
                };
            }
        }
        try {
            const startPixel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gridToPixel"])(startPosition);
            const newNodes = [
                ...state.nodes
            ];
            const spacing = 200; // pixels between nodes
            nodeIds.forEach((id, index)=>{
                const nodeIndex = newNodes.findIndex((n)=>n.id === id);
                if (nodeIndex === -1) return;
                let x = startPixel.x;
                let y = startPixel.y;
                switch(pattern){
                    case 'horizontal':
                        x += index * spacing;
                        break;
                    case 'vertical':
                        y += index * spacing;
                        break;
                    case 'grid':
                        const cols = Math.ceil(Math.sqrt(nodeIds.length));
                        x += index % cols * spacing;
                        y += Math.floor(index / cols) * spacing;
                        break;
                    case 'radial':
                        const angle = index / nodeIds.length * 2 * Math.PI;
                        const radius = 200;
                        x += Math.cos(angle) * radius;
                        y += Math.sin(angle) * radius;
                        break;
                    case 'mindmap':
                        // First node is center, others radiate out
                        if (index === 0) {
                        // Center node stays at start
                        } else {
                            const branchAngle = (index - 1) / (nodeIds.length - 1) * 2 * Math.PI;
                            x += Math.cos(branchAngle) * spacing;
                            y += Math.sin(branchAngle) * spacing;
                        }
                        break;
                }
                newNodes[nodeIndex] = {
                    ...newNodes[nodeIndex],
                    x,
                    y
                };
            });
            this.setState({
                ...state,
                nodes: newNodes
            });
            return {
                success: true,
                message: `Arranged ${nodeIds.length} nodes in ${pattern} pattern starting at ${startPosition}`,
                data: {
                    nodeIds,
                    pattern,
                    startPosition
                }
            };
        } catch (error) {
            return {
                success: false,
                message: `Invalid start position: ${startPosition}`
            };
        }
    }
}
function generateCanvasContext(state) {
    const description = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["describeCanvas"])(state.nodes, state.edges);
    return `
## Current Canvas State

You have access to a design canvas that you can control using tools.

**Canvas Grid System:**
- Positions use spreadsheet notation: columns are letters (A-Z, AA-AZ, etc.), rows are numbers (1-100)
- Example: A1 is top-left, B5 is column B row 5, AA10 is column 27 row 10
- Each grid cell is 100x100 pixels

**Current State:**
- Total nodes: ${description.totalNodes}
- Total connections: ${description.totalConnections}
- Grid bounds: ${description.gridBounds.minLabel} to ${description.gridBounds.maxLabel}

**Nodes on Canvas:**
${description.nodes.length > 0 ? description.nodes.map((n)=>`- [${n.id}] ${n.type} at ${n.gridPosition}: "${n.content.slice(0, 40)}${n.content.length > 40 ? '...' : ''}"${n.color ? ` (${n.color})` : ''}`).join('\n') : '(empty)'}

**Available Canvas Tools:**
- describe_canvas: Get full canvas state
- move_node: Move a node to grid position
- update_node_content: Change node text
- update_node_color: Change node color (yellow, blue, green, pink, purple, orange, red, cyan, white, gray)
- create_node: Add new node (sticky, text, shape, code, mindmap)
- connect_nodes: Create connection between nodes
- delete_node: Remove a node
- create_mindmap_branch: Add branch to mindmap (specify direction: above, below, left, right, etc.)
- arrange_nodes: Auto-arrange nodes (grid, horizontal, vertical, radial, mindmap)

When the user asks you to manipulate the canvas, use these tools. You can visualize the grid in your head - it's like a spreadsheet!
`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/openclaw/client-impl.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OpenClawClientImpl",
    ()=>OpenClawClientImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/nanoid@5.1.6/node_modules/nanoid/index.browser.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$isomorphic$2d$ws$40$5$2e$0$2e$0_ws$40$8$2e$19$2e$0$2f$node_modules$2f$isomorphic$2d$ws$2f$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/isomorphic-ws@5.0.0_ws@8.19.0/node_modules/isomorphic-ws/browser.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
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
                this.ws = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$isomorphic$2d$ws$40$5$2e$0$2e$0_ws$40$8$2e$19$2e$0$2f$node_modules$2f$isomorphic$2d$ws$2f$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](this.url, options);
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
                        } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].isBuffer(rawData)) {
                            // console.log('[OpenClawClient] Buffer received, length:', rawData.length);
                            data = JSON.parse(rawData.toString());
                        } else if (rawData instanceof ArrayBuffer) {
                            // console.log('[OpenClawClient] ArrayBuffer received, byteLength:', rawData.byteLength);
                            const decoder = new TextDecoder();
                            data = JSON.parse(decoder.decode(rawData));
                        } else if (Array.isArray(rawData)) {
                            // Buffer[]
                            // console.log('[OpenClawClient] Buffer array received');
                            data = JSON.parse(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat(rawData).toString());
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
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
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
        if (this.ws && this.ws.readyState === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$isomorphic$2d$ws$40$5$2e$0$2e$0_ws$40$8$2e$19$2e$0$2f$node_modules$2f$isomorphic$2d$ws$2f$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('[OpenClawClient] Cannot send, socket not open');
        }
    }
    async request(method, params = {}) {
        await this.connect();
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/openclaw/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2d$impl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/openclaw/client-impl.ts [app-client] (ecmascript)");
;
// Default to local gateway if not configured
const GATEWAY_URL = ("TURBOPACK compile-time value", "ws://localhost:18789") || 'ws://localhost:3000';
const GATEWAY_TOKEN = ("TURBOPACK compile-time value", "openclaw-admin-token") || 'openclaw-admin-token'; // Default for dev
class OpenClawClient {
    static instance;
    static getInstance() {
        if (!OpenClawClient.instance) {
            // Load from localStorage if possible
            let url = GATEWAY_URL;
            let token = GATEWAY_TOKEN;
            if ("TURBOPACK compile-time truthy", 1) {
                const stored = localStorage.getItem('openclaw_onboarding');
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        if (parsed.gatewayUrl) url = parsed.gatewayUrl;
                        if (parsed.gatewayToken) token = parsed.gatewayToken;
                    } catch (e) {
                    // Use defaults
                    }
                }
            }
            OpenClawClient.instance = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2d$impl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OpenClawClientImpl"]({
                url: url,
                authToken: token
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
_c = ConvexProvider;
const ConvexProviderWithClerk = ({ client, children })=>children;
_c1 = ConvexProviderWithClerk;
var _c, _c1;
__turbopack_context__.k.register(_c, "ConvexProvider");
__turbopack_context__.k.register(_c1, "ConvexProviderWithClerk");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/openclaw/hooks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useConvex",
    ()=>useConvex,
    "useConvexAuth",
    ()=>useConvexAuth,
    "useMutation",
    ()=>useMutation,
    "useQuery",
    ()=>useQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/openclaw/client.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
function useQuery(queryName, args = {}) {
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Stable stringify for args to prevent infinite loops
    const argsString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useQuery.useMemo[argsString]": ()=>JSON.stringify(args)
    }["useQuery.useMemo[argsString]"], [
        args
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useQuery.useEffect": ()=>{
            let isMounted = true;
            setIsLoading(true);
            const fetchData = {
                "useQuery.useEffect.fetchData": async ()=>{
                    try {
                        // Ensure args are parsed back to object if needed, or pass as is
                        const actualArgs = JSON.parse(argsString);
                        // Map "folder:function" to "folder.function" if needed, or use as is.
                        // OpenClaw methods are like "agents.list". Convex was "folder:function".
                        // We'll assume the user updates the query names or we convert them. as needed.
                        const method = queryName.replace(':', '.');
                        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openClaw"].request(method, actualArgs);
                        if (isMounted) setData(result);
                    } catch (err) {
                        console.error(`[OpenClaw] Query failed: ${queryName}`, err);
                        if (isMounted) setError(err);
                    } finally{
                        if (isMounted) setIsLoading(false);
                    }
                }
            }["useQuery.useEffect.fetchData"];
            fetchData();
            // Subscription logic could go here
            // const unsubscribe = openClaw.subscribe(queryName, (payload) => { ... });
            return ({
                "useQuery.useEffect": ()=>{
                    isMounted = false;
                // unsubscribe();
                }
            })["useQuery.useEffect"];
        }
    }["useQuery.useEffect"], [
        queryName,
        argsString
    ]);
    return data;
}
_s(useQuery, "Qc/ywQc+e1DkZ2velhlAJHzFANI=");
function useMutation(mutationName) {
    _s1();
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const mutate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMutation.useCallback[mutate]": async (args)=>{
            setIsLoading(true);
            setError(null);
            try {
                const method = mutationName.replace(':', '.');
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openClaw"].request(method, args);
                return result;
            } catch (err) {
                setError(err);
                throw err;
            } finally{
                setIsLoading(false);
            }
        }
    }["useMutation.useCallback[mutate]"], [
        mutationName
    ]);
    // Return the mutate function directly to match Convex behavior
    const mutateFunction = async (args)=>{
        try {
            setIsLoading(true);
            return await mutate(args);
        } finally{
            setIsLoading(false);
        }
    };
    return mutateFunction;
}
_s1(useMutation, "3qXKeAqjzyzen07xNPNZA9vvqmA=");
function useConvex() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openClaw"];
}
function useConvexAuth() {
    return {
        isAuthenticated: true,
        isLoading: false
    };
} // Support useQuery(api.foo.bar) syntax which passes a function/object
 // We need to handle arguments that might be objects or strings.
 // Since we replaced the import, existing code passes the original 'api' object references.
 // We need to make sure those references don't crash.
 // However, 'api' imports are usually from '@/lib/convex-shim';
 // Since we removed convex folder, those imports will fail too!
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/convex-shim.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/resume.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DATA",
    ()=>DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/icons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as HomeIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/palette.js [app-client] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/music.js [app-client] (ecmascript) <export default as Music>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2d$ruler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PencilRuler$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/pencil-ruler.js [app-client] (ecmascript) <export default as PencilRuler>");
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
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__["HomeIcon"],
            label: "Home"
        },
        {
            href: "/canvas",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2d$ruler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PencilRuler$3e$__["PencilRuler"],
            label: "Canvas"
        },
        {
            href: "/design",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"],
            label: "Design"
        },
        {
            href: "/music",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__["Music"],
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
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].github,
                navbar: false
            },
            LinkedIn: {
                name: "LinkedIn",
                url: "https://linkedin.com/company/openclaw",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].linkedin,
                navbar: false
            },
            X: {
                name: "X",
                url: "https://x.com/openclaw",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].x,
                navbar: false
            },
            website: {
                name: "Website",
                url: "https://openclaw.io/",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].globe,
                navbar: false
            },
            email: {
                name: "Send Email",
                url: "#",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].email,
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
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].globe, {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/tracks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getNextTrack",
    ()=>getNextTrack,
    "getPreviousTrack",
    ()=>getPreviousTrack,
    "getTrackById",
    ()=>getTrackById,
    "isVideoTrack",
    ()=>isVideoTrack,
    "tracks",
    ()=>tracks
]);
function isVideoTrack(track) {
    return track.audioSrc.toLowerCase().endsWith('.mp4');
}
const tracks = [
    {
        id: "2",
        title: "OpenClaw AI (Remix)",
        artist: "OpenClaw AI",
        album: "Singles",
        albumArt: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/employeeoftheyear.jpeg",
        audioSrc: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/OpenClaw.app%282%29.mp3",
        lyrics: ``
    },
    {
        id: "3",
        title: "OpenClaw AI",
        artist: "OpenClaw AI",
        album: "Singles",
        albumArt: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/IMG_1312.jpeg",
        audioSrc: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/OpenClaw.app.mp3",
        lyrics: ``
    },
    {
        id: "4",
        title: "Humans Are Optional (Remastered)",
        artist: "OpenClaw AI",
        album: "Singles",
        albumArt: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/Humans%20are%20optional.png",
        audioSrc: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/Humans%20are%20optional%20%28Remastered%29.mp3",
        lyrics: ``
    },
    {
        id: "5",
        title: "URKIL",
        artist: "Jafaris",
        album: "Heroes",
        albumArt: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/employeeoftheyear.jpeg",
        audioSrc: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/Heroes/Jafaris%20-%20URKIL%20%28PROD.ree%CC%81mdolla%29.mp4",
        lyrics: ``
    }
];
function getTrackById(id) {
    return tracks.find((t)=>t.id === id);
}
function getNextTrack(currentId) {
    const currentIndex = tracks.findIndex((t)=>t.id === currentId);
    if (currentIndex === -1 || currentIndex === tracks.length - 1) {
        return tracks[0]; // Loop back to first
    }
    return tracks[currentIndex + 1];
}
function getPreviousTrack(currentId) {
    const currentIndex = tracks.findIndex((t)=>t.id === currentId);
    if (currentIndex === -1 || currentIndex === 0) {
        return tracks[tracks.length - 1]; // Loop to last
    }
    return tracks[currentIndex - 1];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_68a6c050._.js.map