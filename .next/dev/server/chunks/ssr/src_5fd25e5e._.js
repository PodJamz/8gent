module.exports = [
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$2$2e$6$2e$1$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@2.6.1/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$2$2e$6$2e$1$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
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
}),
"[project]/src/lib/claw-ai/proactive-engine.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time truthy", 1) return getDefaultEngagementState();
    //TURBOPACK unreachable
    ;
}
function saveEngagementState(state) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
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
}),
"[project]/src/lib/themes/definitions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/themes/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$definitions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/themes/definitions.ts [app-ssr] (ecmascript)");
;
}),
"[project]/src/lib/canvas/grid-system.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/lib/claw-ai/canvas-tools.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/canvas/grid-system.ts [app-ssr] (ecmascript)");
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
        description: `Change the color of a node. Available colors: ${Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NODE_COLORS"]).join(', ')}`,
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
        const description = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["describeCanvas"])(state.nodes, state.edges);
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
            const pixel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gridToPixel"])(toPosition);
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
        const hex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColorHex"])(color);
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
            const pixel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gridToPixel"])(position);
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
                    fill: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColorHex"])(color)
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
        const parentGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pixelToGrid"])({
            x: parentNode.x,
            y: parentNode.y
        });
        const newPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRelativePosition"])(parentGrid.label, direction, 2);
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
            const startPixel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["gridToPixel"])(startPosition);
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
    const description = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["describeCanvas"])(state.nodes, state.edges);
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
}),
"[project]/src/lib/openclaw/client-impl.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OpenClawClientImpl",
    ()=>OpenClawClientImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/nanoid@5.1.6/node_modules/nanoid/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$isomorphic$2d$ws$40$5$2e$0$2e$0_ws$40$8$2e$19$2e$0$2f$node_modules$2f$isomorphic$2d$ws$2f$node$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/isomorphic-ws@5.0.0_ws@8.19.0/node_modules/isomorphic-ws/node.js [app-ssr] (ecmascript)");
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
                this.ws = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$isomorphic$2d$ws$40$5$2e$0$2e$0_ws$40$8$2e$19$2e$0$2f$node_modules$2f$isomorphic$2d$ws$2f$node$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](this.url, options);
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
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
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
        if (this.ws && this.ws.readyState === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$isomorphic$2d$ws$40$5$2e$0$2e$0_ws$40$8$2e$19$2e$0$2f$node_modules$2f$isomorphic$2d$ws$2f$node$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('[OpenClawClient] Cannot send, socket not open');
        }
    }
    async request(method, params = {}) {
        await this.connect();
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
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
"[project]/src/lib/openclaw/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2d$impl$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/openclaw/client-impl.ts [app-ssr] (ecmascript)");
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
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            OpenClawClient.instance = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2d$impl$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OpenClawClientImpl"]({
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
const ConvexProviderWithClerk = ({ client, children })=>children;
}),
"[project]/src/lib/openclaw/hooks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/openclaw/client.ts [app-ssr] (ecmascript)");
;
;
function useQuery(queryName, args = {}) {
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Stable stringify for args to prevent infinite loops
    const argsString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>JSON.stringify(args), [
        args
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let isMounted = true;
        setIsLoading(true);
        const fetchData = async ()=>{
            try {
                // Ensure args are parsed back to object if needed, or pass as is
                const actualArgs = JSON.parse(argsString);
                // Map "folder:function" to "folder.function" if needed, or use as is.
                // OpenClaw methods are like "agents.list". Convex was "folder:function".
                // We'll assume the user updates the query names or we convert them. as needed.
                const method = queryName.replace(':', '.');
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["openClaw"].request(method, actualArgs);
                if (isMounted) setData(result);
            } catch (err) {
                console.error(`[OpenClaw] Query failed: ${queryName}`, err);
                if (isMounted) setError(err);
            } finally{
                if (isMounted) setIsLoading(false);
            }
        };
        fetchData();
        // Subscription logic could go here
        // const unsubscribe = openClaw.subscribe(queryName, (payload) => { ... });
        return ()=>{
            isMounted = false;
        // unsubscribe();
        };
    }, [
        queryName,
        argsString
    ]);
    return data;
}
function useMutation(mutationName) {
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const mutate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (args)=>{
        setIsLoading(true);
        setError(null);
        try {
            const method = mutationName.replace(':', '.');
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["openClaw"].request(method, args);
            return result;
        } catch (err) {
            setError(err);
            throw err;
        } finally{
            setIsLoading(false);
        }
    }, [
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
function useConvex() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$openclaw$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["openClaw"];
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
}),
"[project]/src/lib/convex-shim.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/data/resume.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DATA",
    ()=>DATA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/icons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as HomeIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/palette.js [app-ssr] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/music.js [app-ssr] (ecmascript) <export default as Music>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2d$ruler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PencilRuler$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/pencil-ruler.js [app-ssr] (ecmascript) <export default as PencilRuler>");
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
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__["HomeIcon"],
            label: "Home"
        },
        {
            href: "/canvas",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2d$ruler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PencilRuler$3e$__["PencilRuler"],
            label: "Canvas"
        },
        {
            href: "/design",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"],
            label: "Design"
        },
        {
            href: "/music",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__["Music"],
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
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].github,
                navbar: false
            },
            LinkedIn: {
                name: "LinkedIn",
                url: "https://linkedin.com/company/openclaw",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].linkedin,
                navbar: false
            },
            X: {
                name: "X",
                url: "https://x.com/openclaw",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].x,
                navbar: false
            },
            website: {
                name: "Website",
                url: "https://openclaw.io/",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].globe,
                navbar: false
            },
            email: {
                name: "Send Email",
                url: "#",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].email,
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
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].globe, {
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
"[project]/src/data/tracks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/hooks/useFileAttachment.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFileAttachment",
    ()=>useFileAttachment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_MAX_FILES = 5;
const DEFAULT_ACCEPTED_TYPES = [
    'image/*',
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/json',
    'text/csv'
];
function useFileAttachment(options = {}) {
    const { maxFiles = DEFAULT_MAX_FILES, maxSizeBytes = DEFAULT_MAX_SIZE, acceptedTypes = DEFAULT_ACCEPTED_TYPES, onError } = options;
    const [attachments, setAttachments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const generateId = ()=>`attach_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const isAcceptedType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((file)=>{
        return acceptedTypes.some((type)=>{
            if (type.endsWith('/*')) {
                const category = type.split('/')[0];
                return file.type.startsWith(`${category}/`);
            }
            return file.type === type;
        });
    }, [
        acceptedTypes
    ]);
    const createPreview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((file)=>{
        return new Promise((resolve)=>{
            if (!file.type.startsWith('image/')) {
                resolve(undefined);
                return;
            }
            const reader = new FileReader();
            reader.onload = ()=>resolve(reader.result);
            reader.onerror = ()=>resolve(undefined);
            reader.readAsDataURL(file);
        });
    }, []);
    const addFiles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (files)=>{
        const fileArray = Array.from(files);
        // Check max files limit
        if (attachments.length + fileArray.length > maxFiles) {
            onError?.(`Maximum ${maxFiles} files allowed`);
            return;
        }
        setIsProcessing(true);
        const newAttachments = [];
        for (const file of fileArray){
            // Validate file type
            if (!isAcceptedType(file)) {
                onError?.(`File type not supported: ${file.type || 'unknown'}`);
                continue;
            }
            // Validate file size
            if (file.size > maxSizeBytes) {
                const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024));
                onError?.(`File too large: ${file.name} (max ${maxSizeMB}MB)`);
                continue;
            }
            const preview = await createPreview(file);
            newAttachments.push({
                id: generateId(),
                file,
                name: file.name,
                type: file.type,
                size: file.size,
                preview
            });
        }
        setAttachments((prev)=>[
                ...prev,
                ...newAttachments
            ]);
        setIsProcessing(false);
    }, [
        attachments.length,
        maxFiles,
        maxSizeBytes,
        isAcceptedType,
        createPreview,
        onError
    ]);
    const removeAttachment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setAttachments((prev)=>prev.filter((a)=>a.id !== id));
    }, []);
    const clearAttachments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setAttachments([]);
    }, []);
    const openFilePicker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        fileInputRef.current?.click();
    }, []);
    const handleFileInputChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (e.target.files && e.target.files.length > 0) {
            addFiles(e.target.files);
            // Reset input so same file can be selected again
            e.target.value = '';
        }
    }, [
        addFiles
    ]);
    // Format file size for display
    const formatFileSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((bytes)=>{
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }, []);
    // Get files ready for upload (as FormData-compatible array)
    const getFilesForUpload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        return attachments.map((a)=>a.file);
    }, [
        attachments
    ]);
    // Convert attachments to base64 for API calls
    const getAttachmentsAsBase64 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const results = await Promise.all(attachments.map(async (attachment)=>{
            const data = await new Promise((resolve)=>{
                const reader = new FileReader();
                reader.onload = ()=>{
                    const base64 = reader.result.split(',')[1];
                    resolve(base64);
                };
                reader.readAsDataURL(attachment.file);
            });
            return {
                name: attachment.name,
                type: attachment.type,
                data
            };
        }));
        return results;
    }, [
        attachments
    ]);
    return {
        attachments,
        isProcessing,
        fileInputRef,
        addFiles,
        removeAttachment,
        clearAttachments,
        openFilePicker,
        handleFileInputChange,
        formatFileSize,
        getFilesForUpload,
        getAttachmentsAsBase64,
        hasAttachments: attachments.length > 0,
        acceptedTypesString: acceptedTypes.join(',')
    };
}
}),
"[project]/src/hooks/useVoiceRecorder.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useVoiceRecorder",
    ()=>useVoiceRecorder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
// ============================================================================
// Constants
// ============================================================================
const DEFAULT_MAX_DURATION = 120; // 2 minutes
const DEFAULT_SAMPLE_RATE = 16000; // Optimal for Whisper
const DEFAULT_LEVELS_COUNT = 20;
// ============================================================================
// Helpers
// ============================================================================
function getErrorMessage(type) {
    switch(type){
        case 'permission-denied':
            return 'Microphone access denied. Please enable microphone permissions.';
        case 'not-supported':
            return 'Audio recording is not supported in this browser.';
        case 'no-audio':
            return 'No audio input detected. Please check your microphone.';
        default:
            return 'An error occurred while recording. Please try again.';
    }
}
function useVoiceRecorder(options = {}) {
    const { maxDuration = DEFAULT_MAX_DURATION, levelsCount = DEFAULT_LEVELS_COUNT, onMaxDurationReached } = options;
    // State
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [duration, setDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [audioLevels, setAudioLevels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(Array(levelsCount).fill(0));
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Refs
    const mediaRecorderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioContextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const analyserRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const streamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chunksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const durationIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const levelsIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const startTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    // Check browser support
    const isSupported = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';
    // Cleanup function
    const cleanup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        // Stop intervals
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }
        if (levelsIntervalRef.current) {
            clearInterval(levelsIntervalRef.current);
            levelsIntervalRef.current = null;
        }
        // Stop media recorder
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            try {
                mediaRecorderRef.current.stop();
            } catch  {
            // Ignore errors when stopping
            }
        }
        // Stop all tracks
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track)=>track.stop());
            streamRef.current = null;
        }
        // Close audio context
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        analyserRef.current = null;
        mediaRecorderRef.current = null;
        chunksRef.current = [];
    }, []);
    // Update audio levels for waveform visualization
    const updateAudioLevels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        // Calculate average level
        let sum = 0;
        for(let i = 0; i < dataArray.length; i++){
            sum += dataArray[i];
        }
        const average = sum / dataArray.length / 255; // Normalize to 0-1
        // Add new level and remove oldest
        setAudioLevels((prev)=>{
            const newLevels = [
                ...prev.slice(1),
                average
            ];
            return newLevels;
        });
    }, []);
    // Start recording
    const startRecording = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            const err = {
                type: 'not-supported',
                message: getErrorMessage('not-supported')
            };
            setError(err);
            setStatus('error');
            return;
        }
        //TURBOPACK unreachable
        ;
    }, [
        isSupported,
        levelsCount,
        maxDuration,
        onMaxDurationReached,
        cleanup,
        updateAudioLevels
    ]);
    // Stop recording and return audio blob
    const stopRecording = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!mediaRecorderRef.current || status !== 'recording') {
            return null;
        }
        setStatus('processing');
        return new Promise((resolve)=>{
            const mediaRecorder = mediaRecorderRef.current;
            mediaRecorder.onstop = ()=>{
                // Create blob from chunks
                const mimeType = mediaRecorder.mimeType;
                const blob = new Blob(chunksRef.current, {
                    type: mimeType
                });
                cleanup();
                setStatus('idle');
                setAudioLevels(Array(levelsCount).fill(0));
                resolve(blob);
            };
            mediaRecorder.stop();
        });
    }, [
        status,
        cleanup,
        levelsCount
    ]);
    // Cancel recording without returning audio
    const cancelRecording = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        cleanup();
        setStatus('idle');
        setDuration(0);
        setAudioLevels(Array(levelsCount).fill(0));
        setError(null);
    }, [
        cleanup,
        levelsCount
    ]);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            cleanup();
        };
    }, [
        cleanup
    ]);
    return {
        // State
        status,
        isRecording: status === 'recording',
        duration,
        audioLevels,
        error,
        // Capabilities
        isSupported,
        // Actions
        startRecording,
        stopRecording,
        cancelRecording
    };
}
}),
"[project]/src/hooks/useSpeechRecognition.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSpeechRecognition",
    ()=>useSpeechRecognition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
// ============================================================================
// Helpers
// ============================================================================
function getSpeechRecognition() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const SpeechRecognition = undefined;
}
function mapErrorType(errorCode) {
    switch(errorCode){
        case 'not-allowed':
        case 'service-not-allowed':
            return 'not-allowed';
        case 'no-speech':
            return 'no-speech';
        case 'network':
            return 'network';
        case 'aborted':
            return 'aborted';
        default:
            return 'unknown';
    }
}
function getErrorMessage(type) {
    switch(type){
        case 'not-allowed':
            return 'Microphone access denied. Please enable microphone permissions.';
        case 'no-speech':
            return 'No speech detected. Please try again.';
        case 'network':
            return 'Network error. Please check your connection.';
        case 'aborted':
            return 'Speech recognition was cancelled.';
        default:
            return 'An error occurred. Please try again.';
    }
}
function useSpeechRecognition(options = {}) {
    const { continuous = false, interimResults = true, language = 'en-US', onResult, onError, onEnd, onStart, autoStop = true, silenceTimeout = 2000 } = options;
    // State
    const [transcript, setTranscript] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [interimTranscript, setInterimTranscript] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isMicrophoneAvailable, setIsMicrophoneAvailable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // Refs
    const recognitionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const silenceTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isListeningRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Check browser support
    const isSupported = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && getSpeechRecognition() !== null;
    // Clear silence timer
    const clearSilenceTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
    }, []);
    // Reset silence timer
    const resetSilenceTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        clearSilenceTimer();
        if (autoStop && isListeningRef.current) {
            silenceTimerRef.current = setTimeout(()=>{
                if (recognitionRef.current && isListeningRef.current) {
                    recognitionRef.current.stop();
                }
            }, silenceTimeout);
        }
    }, [
        autoStop,
        silenceTimeout,
        clearSilenceTimer
    ]);
    // Stop listening
    const stopListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        clearSilenceTimer();
        if (recognitionRef.current && isListeningRef.current) {
            isListeningRef.current = false;
            try {
                recognitionRef.current.stop();
            } catch  {
            // Ignore errors when stopping
            }
        }
        setStatus('idle');
    }, [
        clearSilenceTimer
    ]);
    // Start listening
    const startListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            setStatus('unsupported');
            const err = {
                type: 'unknown',
                message: 'Speech recognition is not supported in this browser.'
            };
            setError(err);
            onError?.(err);
            return;
        }
        //TURBOPACK unreachable
        ;
        const SpeechRecognitionClass = undefined;
        // Create new instance
        const recognition = undefined;
    }, [
        isSupported,
        continuous,
        interimResults,
        language,
        onResult,
        onError,
        onEnd,
        onStart,
        clearSilenceTimer,
        resetSilenceTimer,
        status
    ]);
    // Reset transcript
    const resetTranscript = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setTranscript('');
        setInterimTranscript('');
    }, []);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            clearSilenceTimer();
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort();
                } catch  {
                // Ignore
                }
            }
        };
    }, [
        clearSilenceTimer
    ]);
    // Check initial support
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            setStatus('unsupported');
        }
    }, [
        isSupported
    ]);
    return {
        transcript,
        interimTranscript,
        status,
        error,
        isListening: status === 'listening',
        isSupported,
        isMicrophoneAvailable,
        startListening,
        stopListening,
        resetTranscript
    };
}
}),
"[project]/src/hooks/useTextToSpeech.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTextToSpeech",
    ()=>useTextToSpeech
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
// ============================================================================
// Audio unlock state (shared across all hook instances)
// ============================================================================
let globalAudioUnlocked = false;
let globalAudioContext = null;
let globalBlessedAudio = null;
let globalUnlockListenerAdded = false;
/**
 * Unlock audio playback by playing a silent sound.
 * This must be called from a user interaction (click, tap, etc.)
 */ async function unlockAudioPlayback() {
    if (globalAudioUnlocked) return true;
    try {
        // Create or resume AudioContext
        if (!globalAudioContext) {
            globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (globalAudioContext.state === 'suspended') {
            await globalAudioContext.resume();
        }
        // Create a "blessed" Audio element that we can reuse
        // iOS Safari requires the Audio element to be created AND played during user interaction
        if (!globalBlessedAudio) {
            globalBlessedAudio = new Audio();
            globalBlessedAudio.volume = 1;
        }
        // Play a silent sound to unlock audio on iOS/Safari
        // Using a very short silent WAV
        globalBlessedAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        const playPromise = globalBlessedAudio.play();
        if (playPromise !== undefined) {
            await playPromise;
        }
        globalBlessedAudio.pause();
        globalBlessedAudio.currentTime = 0;
        globalAudioUnlocked = true;
        console.log('[TTS] Audio playback unlocked');
        return true;
    } catch (error) {
        console.warn('[TTS] Failed to unlock audio:', error);
        return false;
    }
}
/**
 * Add a document-level listener to auto-unlock audio on first user interaction.
 * This ensures audio is unlocked even if the user doesn't explicitly click the voice button.
 */ function setupGlobalUnlockListener() {
    if (globalUnlockListenerAdded || typeof document === 'undefined') return;
    const unlockHandler = ()=>{
        if (!globalAudioUnlocked) {
            unlockAudioPlayback().catch(console.warn);
        }
    };
    // Listen for any user interaction
    document.addEventListener('click', unlockHandler, {
        once: false,
        passive: true
    });
    document.addEventListener('touchstart', unlockHandler, {
        once: false,
        passive: true
    });
    document.addEventListener('keydown', unlockHandler, {
        once: false,
        passive: true
    });
    globalUnlockListenerAdded = true;
    console.log('[TTS] Global unlock listeners added');
}
function useTextToSpeech(options = {}) {
    const { voice = 'nova', speed = 1.0, provider = 'openai', onStart, onEnd, onError, autoPlay = true } = options;
    // State
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentText, setCurrentText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAudioUnlocked, setIsAudioUnlocked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(globalAudioUnlocked);
    // Refs
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Set up global unlock listener on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setupGlobalUnlockListener();
    }, []);
    // Sync audio unlock state with global state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const checkUnlockState = ()=>{
            if (globalAudioUnlocked && !isAudioUnlocked) {
                setIsAudioUnlocked(true);
            }
        };
        // Check periodically in case global state was updated
        const interval = setInterval(checkUnlockState, 500);
        return ()=>clearInterval(interval);
    }, [
        isAudioUnlocked
    ]);
    // Unlock audio (call this on user interaction like clicking mic button)
    const unlockAudio = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const unlocked = await unlockAudioPlayback();
        setIsAudioUnlocked(unlocked);
    }, []);
    // Clean up audio element
    const cleanupAudio = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current.load();
            audioRef.current = null;
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);
    // Stop speaking
    const stop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        cleanupAudio();
        setStatus('idle');
        setCurrentText(null);
    }, [
        cleanupAudio
    ]);
    // Pause speaking
    const pause = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (audioRef.current && status === 'speaking') {
            audioRef.current.pause();
        }
    }, [
        status
    ]);
    // Resume speaking
    const resume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play().catch(console.error);
        }
    }, []);
    // Speak text
    const speak = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (text)=>{
        if (!text.trim()) return;
        // Stop any current speech
        cleanupAudio();
        setError(null);
        setCurrentText(text);
        setStatus('loading');
        // Ensure AudioContext is resumed (iOS Safari requirement)
        if (globalAudioContext && globalAudioContext.state === 'suspended') {
            try {
                await globalAudioContext.resume();
                console.log('[TTS] AudioContext resumed');
            } catch (e) {
                console.warn('[TTS] Failed to resume AudioContext:', e);
            }
        }
        // Create abort controller for this request
        abortControllerRef.current = new AbortController();
        try {
            // Use appropriate endpoint based on provider
            const endpoint = provider === 'elevenlabs' ? '/api/tts/elevenlabs' : '/api/tts';
            const body = provider === 'elevenlabs' ? {
                text
            } // ElevenLabs uses voice ID from env var
             : {
                text,
                voice,
                speed
            };
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
                signal: abortControllerRef.current.signal
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.error || 'Failed to generate speech');
            }
            // Get the audio blob
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            // Use the blessed audio element if available (for iOS Safari compatibility)
            // Otherwise create a new one
            const audio = globalBlessedAudio || new Audio();
            audioRef.current = audio;
            // Set up event handlers
            audio.onloadeddata = ()=>{
                if (autoPlay) {
                    // Try to play with retry on failure
                    const attemptPlay = async (retries = 2)=>{
                        try {
                            await audio.play();
                            setStatus('speaking');
                            setIsAudioUnlocked(true);
                            onStart?.();
                        } catch (playError) {
                            console.warn('[TTS] Play failed:', playError.message, `(retries left: ${retries})`);
                            if (retries > 0) {
                                // Try to resume AudioContext and retry
                                if (globalAudioContext?.state === 'suspended') {
                                    await globalAudioContext.resume().catch(()=>{});
                                }
                                await new Promise((r)=>setTimeout(r, 100));
                                return attemptPlay(retries - 1);
                            }
                            // All retries failed - show user-friendly message
                            const err = {
                                type: 'audio',
                                message: 'Tap anywhere to enable voice responses'
                            };
                            setError(err);
                            setStatus('error');
                            onError?.(err);
                        }
                    };
                    attemptPlay();
                }
            };
            audio.onended = ()=>{
                URL.revokeObjectURL(audioUrl);
                setStatus('idle');
                setCurrentText(null);
                onEnd?.();
            };
            audio.onerror = ()=>{
                URL.revokeObjectURL(audioUrl);
                const err = {
                    type: 'audio',
                    message: 'Failed to load audio'
                };
                setError(err);
                setStatus('error');
                onError?.(err);
            };
            // Load the audio
            audio.src = audioUrl;
            audio.load();
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                // Request was aborted, not an error
                setStatus('idle');
                return;
            }
            const error = {
                type: 'network',
                message: err instanceof Error ? err.message : 'Unknown error'
            };
            setError(error);
            setStatus('error');
            onError?.(error);
        }
    }, [
        cleanupAudio,
        provider,
        voice,
        speed,
        autoPlay,
        onStart,
        onEnd,
        onError
    ]);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            cleanupAudio();
        };
    }, [
        cleanupAudio
    ]);
    // Sync global unlock state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setIsAudioUnlocked(globalAudioUnlocked);
    }, []);
    return {
        status,
        error,
        isSpeaking: status === 'speaking',
        isLoading: status === 'loading',
        currentText,
        isAudioUnlocked,
        speak,
        stop,
        pause,
        resume,
        unlockAudio
    };
}
}),
"[project]/src/hooks/useVoiceChat.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useVoiceChat",
    ()=>useVoiceChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpeechRecognition$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSpeechRecognition.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTextToSpeech$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useTextToSpeech.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function useVoiceChat(options = {}) {
    const { voice = 'nova', provider = 'elevenlabs', language = 'en-US', continuous = false, autoSpeak = true, onTranscriptComplete, onSpeakingStart, onSpeakingEnd, onError } = options;
    // State
    const [isVoiceEnabled, setIsVoiceEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Refs for tracking state across callbacks
    const pendingTranscriptRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('');
    const isProcessingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Speech Recognition (input)
    const speechRecognition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSpeechRecognition$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpeechRecognition"])({
        continuous,
        language,
        interimResults: true,
        autoStop: true,
        silenceTimeout: 2000,
        onResult: (transcript, isFinal)=>{
            if (isFinal) {
                pendingTranscriptRef.current += transcript;
            }
        },
        onEnd: ()=>{
            // When speech recognition ends, process the transcript
            if (pendingTranscriptRef.current.trim() && !isProcessingRef.current) {
                const finalTranscript = pendingTranscriptRef.current.trim();
                pendingTranscriptRef.current = '';
                setMode('processing');
                isProcessingRef.current = true;
                onTranscriptComplete?.(finalTranscript);
                isProcessingRef.current = false;
            } else if (mode === 'listening') {
                setMode('idle');
            }
        },
        onError: (err)=>{
            const voiceError = {
                type: 'speech',
                message: err.message
            };
            setError(voiceError);
            setMode('idle');
            onError?.(voiceError);
        }
    });
    // Text-to-Speech (output)
    const tts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useTextToSpeech$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTextToSpeech"])({
        voice,
        provider,
        speed: 1.0,
        onStart: ()=>{
            setMode('speaking');
            onSpeakingStart?.();
        },
        onEnd: ()=>{
            setMode('idle');
            onSpeakingEnd?.();
        },
        onError: (err)=>{
            const voiceError = {
                type: 'tts',
                message: err.message
            };
            setError(voiceError);
            setMode('idle');
            onError?.(voiceError);
        }
    });
    // Update mode based on speech recognition status
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (speechRecognition.isListening && mode !== 'speaking') {
            setMode('listening');
        }
    }, [
        speechRecognition.isListening,
        mode
    ]);
    // Enable voice mode
    const enableVoice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsVoiceEnabled(true);
        setError(null);
        // Unlock audio on user interaction
        tts.unlockAudio();
    }, [
        tts
    ]);
    // Disable voice mode
    const disableVoice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsVoiceEnabled(false);
        speechRecognition.stopListening();
        tts.stop();
        setMode('idle');
        pendingTranscriptRef.current = '';
    }, [
        speechRecognition,
        tts
    ]);
    // Toggle voice mode
    const toggleVoice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (isVoiceEnabled) {
            disableVoice();
        } else {
            enableVoice();
        }
    }, [
        isVoiceEnabled,
        enableVoice,
        disableVoice
    ]);
    // Start listening
    const startListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!isVoiceEnabled) {
            enableVoice();
        }
        // Stop any current speech first
        tts.stop();
        setError(null);
        pendingTranscriptRef.current = '';
        speechRecognition.resetTranscript();
        speechRecognition.startListening();
    }, [
        isVoiceEnabled,
        enableVoice,
        tts,
        speechRecognition
    ]);
    // Stop listening
    const stopListening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        speechRecognition.stopListening();
    }, [
        speechRecognition
    ]);
    // Speak AI response
    const speakResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (text)=>{
        if (!isVoiceEnabled || !autoSpeak) return;
        // Clean the text for speech (remove markdown, links, etc.)
        const cleanText = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
        .replace(/\*([^*]+)\*/g, '$1') // Remove italic
        .replace(/`([^`]+)`/g, '$1') // Remove code
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/\n+/g, '. ') // Replace newlines with periods
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
        if (cleanText) {
            await tts.speak(cleanText);
        }
    }, [
        isVoiceEnabled,
        autoSpeak,
        tts
    ]);
    // Stop speaking
    const stopSpeaking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        tts.stop();
        setMode('idle');
    }, [
        tts
    ]);
    // Reset transcript
    const resetTranscript = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        speechRecognition.resetTranscript();
        pendingTranscriptRef.current = '';
    }, [
        speechRecognition
    ]);
    return {
        // State
        mode,
        isVoiceEnabled,
        transcript: speechRecognition.transcript,
        interimTranscript: speechRecognition.interimTranscript,
        error,
        // Capabilities
        isSpeechSupported: speechRecognition.isSupported,
        isMicrophoneAvailable: speechRecognition.isMicrophoneAvailable,
        // Actions
        enableVoice,
        disableVoice,
        toggleVoice,
        startListening,
        stopListening,
        speakResponse,
        stopSpeaking,
        resetTranscript
    };
}
}),
"[project]/src/hooks/usePauseMusicForVoice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "usePauseMusicForVoice",
    ()=>usePauseMusicForVoice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$MusicContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/MusicContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
function usePauseMusicForVoice({ isRecording = false, isSpeaking = false, isTranscribing = false }) {
    // Use context directly to avoid throwing if not in provider
    const musicContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$MusicContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MusicContext"]);
    // Track if we paused the music (to avoid redundant pause calls)
    const didPauseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Pause music when recording starts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!musicContext) return;
        if (isRecording && musicContext.isPlaying) {
            musicContext.pause();
            didPauseRef.current = true;
        }
    }, [
        isRecording,
        musicContext
    ]);
    // Pause music when TTS speaking starts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!musicContext) return;
        if (isSpeaking && musicContext.isPlaying) {
            musicContext.pause();
            didPauseRef.current = true;
        }
    }, [
        isSpeaking,
        musicContext
    ]);
    // Pause music when transcribing starts (covers the processing phase)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!musicContext) return;
        if (isTranscribing && musicContext.isPlaying) {
            musicContext.pause();
            didPauseRef.current = true;
        }
    }, [
        isTranscribing,
        musicContext
    ]);
    // Reset the ref when voice interaction ends (but don't auto-resume)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isRecording && !isSpeaking && !isTranscribing) {
            didPauseRef.current = false;
        }
    }, [
        isRecording,
        isSpeaking,
        isTranscribing
    ]);
}
const __TURBOPACK__default__export__ = usePauseMusicForVoice;
}),
"[project]/src/hooks/useVoiceMode.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useVoiceMode",
    ()=>useVoiceMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
// ============================================================================
// Constants
// ============================================================================
const DEFAULT_CHUNK_DURATION = 2000; // 2 seconds
const DEFAULT_SILENCE_THRESHOLD = 0.02;
const DEFAULT_SILENCE_DURATION = 1500; // 1.5 seconds
const AUDIO_LEVEL_UPDATE_INTERVAL = 50; // 50ms
// Debug logging
const LOG_PREFIX = '[VoiceMode]';
const log = {
    info: (msg, data)=>console.log(`${LOG_PREFIX} ${msg}`, data ?? ''),
    warn: (msg, data)=>console.warn(`${LOG_PREFIX} ${msg}`, data ?? ''),
    error: (msg, data)=>console.error(`${LOG_PREFIX} ${msg}`, data ?? ''),
    state: (from, to)=>console.log(`${LOG_PREFIX} [STATE] ${from} → ${to}`),
    timing: (label, ms)=>console.log(`${LOG_PREFIX} [TIMING] ${label}: ${ms}ms`)
};
function useVoiceMode(config = {}) {
    const { chunkDurationMs = DEFAULT_CHUNK_DURATION, silenceThreshold = DEFAULT_SILENCE_THRESHOLD, silenceDurationMs = DEFAULT_SILENCE_DURATION, whisperEndpoint = '/api/whisper', chatEndpoint = '/api/chat/stream', ttsEndpoint = '/api/tts', onTranscriptUpdate, onResponseStart, onResponseEnd, onError, onStateChange } = config;
    // State
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [transcript, setTranscript] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [response, setResponse] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [audioIntensity, setAudioIntensity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Refs for cleanup and management
    const mediaRecorderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioContextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const analyserRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const streamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioChunksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const audioLevelIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const silenceTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chunkIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastAudioLevelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const silenceStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const currentAudioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const startTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    // State change with logging and callback
    const transitionState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newState)=>{
        setState((prev)=>{
            if (prev !== newState) {
                log.state(prev, newState);
                onStateChange?.(newState);
            }
            return newState;
        });
    }, [
        onStateChange
    ]);
    // Cleanup all resources
    const cleanup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        log.info('cleanup() - releasing all resources');
        // Stop intervals
        if (audioLevelIntervalRef.current) {
            clearInterval(audioLevelIntervalRef.current);
            audioLevelIntervalRef.current = null;
        }
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
        }
        if (chunkIntervalRef.current) {
            clearInterval(chunkIntervalRef.current);
            chunkIntervalRef.current = null;
        }
        // Stop media recorder
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            try {
                mediaRecorderRef.current.stop();
            } catch  {
            // Ignore
            }
        }
        mediaRecorderRef.current = null;
        // Stop stream tracks
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track)=>track.stop());
            streamRef.current = null;
        }
        // Close audio context
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        analyserRef.current = null;
        // Stop any playing audio
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current = null;
        }
        // Abort any pending requests
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        // Reset refs
        audioChunksRef.current = [];
        silenceStartRef.current = null;
    }, []);
    // Update audio intensity for UI feedback
    const updateAudioLevel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        // Calculate average level
        let sum = 0;
        for(let i = 0; i < dataArray.length; i++){
            sum += dataArray[i];
        }
        const level = sum / dataArray.length / 255;
        setAudioIntensity(level);
        lastAudioLevelRef.current = level;
        // Detect silence for auto-send
        if (level < silenceThreshold) {
            if (!silenceStartRef.current) {
                silenceStartRef.current = Date.now();
            } else if (Date.now() - silenceStartRef.current > silenceDurationMs) {
            // Silence detected long enough - could trigger auto-send here
            // For now, we rely on manual tap-to-send per the UX
            }
        } else {
            silenceStartRef.current = null;
        }
    }, [
        silenceThreshold,
        silenceDurationMs
    ]);
    // Transcribe audio chunk via Whisper
    const transcribeChunk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (audioBlob)=>{
        const formData = new FormData();
        formData.append('audio', audioBlob, 'chunk.webm');
        formData.append('language', 'en');
        const startTime = Date.now();
        log.info('transcribeChunk() - sending to Whisper', {
            size: audioBlob.size
        });
        try {
            const response = await fetch(whisperEndpoint, {
                method: 'POST',
                body: formData,
                signal: abortControllerRef.current?.signal
            });
            if (!response.ok) {
                throw new Error(`Whisper error: ${response.status}`);
            }
            const result = await response.json();
            log.timing('STT', Date.now() - startTime);
            return result.text || '';
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                log.info('Transcription aborted');
                return '';
            }
            throw err;
        }
    }, [
        whisperEndpoint
    ]);
    // Get LLM response via streaming chat
    const getAIResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (userMessage)=>{
        const startTime = Date.now();
        log.info('getAIResponse() - sending to LLM', {
            length: userMessage.length
        });
        onResponseStart?.();
        try {
            const response = await fetch(chatEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    model: 'claude',
                    stream: true
                }),
                signal: abortControllerRef.current?.signal
            });
            if (!response.ok) {
                throw new Error(`Chat error: ${response.status}`);
            }
            // Read streaming response
            const reader = response.body?.getReader();
            if (!reader) throw new Error('No response body');
            const decoder = new TextDecoder();
            let fullResponse = '';
            let firstTokenTime = null;
            while(true){
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines){
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.content) {
                                if (!firstTokenTime) {
                                    firstTokenTime = Date.now();
                                    log.timing('LLM first token', firstTokenTime - startTime);
                                }
                                fullResponse += data.content;
                                setResponse(fullResponse);
                            }
                        } catch  {
                        // Ignore parse errors for non-JSON lines
                        }
                    }
                }
            }
            log.timing('LLM total', Date.now() - startTime);
            return fullResponse;
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                log.info('LLM request aborted');
                return '';
            }
            throw err;
        }
    }, [
        chatEndpoint,
        onResponseStart
    ]);
    // Speak response via TTS
    const speakResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (text)=>{
        const startTime = Date.now();
        log.info('speakResponse() - sending to TTS', {
            length: text.length
        });
        try {
            const response = await fetch(ttsEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text,
                    voice: 'nova'
                }),
                signal: abortControllerRef.current?.signal
            });
            if (!response.ok) {
                throw new Error(`TTS error: ${response.status}`);
            }
            const audioBlob = await response.blob();
            log.timing('TTS', Date.now() - startTime);
            // Play audio
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            currentAudioRef.current = audio;
            return new Promise((resolve, reject)=>{
                audio.onended = ()=>{
                    URL.revokeObjectURL(audioUrl);
                    currentAudioRef.current = null;
                    resolve();
                };
                audio.onerror = ()=>{
                    URL.revokeObjectURL(audioUrl);
                    currentAudioRef.current = null;
                    reject(new Error('Audio playback failed'));
                };
                audio.play().catch(reject);
            });
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                log.info('TTS aborted');
                return;
            }
            throw err;
        }
    }, [
        ttsEndpoint
    ]);
    // Start voice mode (begin listening)
    const start = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        log.info('start() - initializing voice mode');
        startTimeRef.current = Date.now();
        cleanup();
        setError(null);
        setTranscript('');
        setResponse('');
        audioChunksRef.current = [];
        try {
            // Request microphone
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            streamRef.current = stream;
            // Set up audio analysis
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContextClass();
            audioContextRef.current = audioContext;
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.5;
            analyserRef.current = analyser;
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            // Create media recorder
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType
            });
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.ondataavailable = (event)=>{
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            // Start recording
            mediaRecorder.start(100); // Collect data every 100ms
            abortControllerRef.current = new AbortController();
            // Start audio level monitoring
            audioLevelIntervalRef.current = setInterval(updateAudioLevel, AUDIO_LEVEL_UPDATE_INTERVAL);
            transitionState('listening');
            log.timing('Mic ready', Date.now() - startTimeRef.current);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to start voice mode';
            log.error('start() failed', err);
            setError(errorMsg);
            onError?.(errorMsg);
            cleanup();
        }
    }, [
        cleanup,
        updateAudioLevel,
        transitionState,
        onError
    ]);
    // Stop voice mode completely
    const stop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        log.info('stop() - ending voice mode');
        cleanup();
        transitionState('idle');
        setAudioIntensity(0);
    }, [
        cleanup,
        transitionState
    ]);
    // Send current audio for processing (manual trigger)
    const send = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (state !== 'listening' || audioChunksRef.current.length === 0) {
            log.warn('send() - nothing to send', {
                state,
                chunks: audioChunksRef.current.length
            });
            return;
        }
        log.info('send() - processing audio');
        const totalStartTime = Date.now();
        // Stop recording but keep resources
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        transitionState('processing');
        try {
            // Combine audio chunks
            const audioBlob = new Blob(audioChunksRef.current, {
                type: mediaRecorderRef.current?.mimeType || 'audio/webm'
            });
            audioChunksRef.current = [];
            // Transcribe
            const text = await transcribeChunk(audioBlob);
            if (!text.trim()) {
                log.warn('Empty transcript, returning to listening');
                await start(); // Restart listening
                return;
            }
            setTranscript(text);
            onTranscriptUpdate?.(text, true);
            log.info('Transcript ready', {
                text: text.substring(0, 50) + '...'
            });
            // Get AI response
            const aiResponse = await getAIResponse(text);
            if (!aiResponse.trim()) {
                log.warn('Empty AI response');
                onResponseEnd?.('');
                await start();
                return;
            }
            onResponseEnd?.(aiResponse);
            // Speak response
            transitionState('speaking');
            await speakResponse(aiResponse);
            // Return to listening after speaking
            log.timing('Total round-trip', Date.now() - totalStartTime);
            await start();
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Processing failed';
            log.error('send() failed', err);
            setError(errorMsg);
            onError?.(errorMsg);
            stop();
        }
    }, [
        state,
        start,
        stop,
        transcribeChunk,
        getAIResponse,
        speakResponse,
        transitionState,
        onTranscriptUpdate,
        onResponseEnd,
        onError
    ]);
    // Interrupt speaking and switch back to listening
    const interrupt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        log.info('interrupt() - stopping speech, returning to listening');
        // Stop current audio playback
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current = null;
        }
        // Abort any pending requests
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        // Restart listening
        start();
    }, [
        start
    ]);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            cleanup();
        };
    }, [
        cleanup
    ]);
    return {
        state,
        isActive: state !== 'idle',
        transcript,
        response,
        audioIntensity,
        error,
        start,
        stop,
        send,
        interrupt
    };
}
const __TURBOPACK__default__export__ = useVoiceMode;
}),
"[project]/src/hooks/usePerformanceMetrics.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePerformanceMetrics",
    ()=>usePerformanceMetrics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const initialMetrics = {
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    inp: null,
    ttfb: null,
    pageLoadTime: null,
    domInteractive: null,
    resourceCount: 0,
    transferSize: 0,
    overallScore: "fast",
    primaryMetric: null
};
function getOverallScore(metrics) {
    const { lcp, fcp, cls, ttfb, pageLoadTime } = metrics;
    // Primary metric for scoring (prefer LCP, fallback to FCP, then pageLoadTime)
    const primaryTime = lcp ?? fcp ?? pageLoadTime ?? 0;
    // Google's Core Web Vitals thresholds
    // LCP: Good < 2500ms, Needs Improvement < 4000ms, Poor >= 4000ms
    // FCP: Good < 1800ms, Needs Improvement < 3000ms, Poor >= 3000ms
    // CLS: Good < 0.1, Needs Improvement < 0.25, Poor >= 0.25
    // TTFB: Good < 800ms, Needs Improvement < 1800ms, Poor >= 1800ms
    let score = 0;
    let count = 0;
    if (primaryTime > 0) {
        if (primaryTime < 1500) score += 3;
        else if (primaryTime < 2500) score += 2;
        else if (primaryTime < 4000) score += 1;
        count++;
    }
    if (ttfb && ttfb > 0) {
        if (ttfb < 400) score += 3;
        else if (ttfb < 800) score += 2;
        else if (ttfb < 1800) score += 1;
        count++;
    }
    if (cls !== null && cls !== undefined) {
        if (cls < 0.1) score += 3;
        else if (cls < 0.25) score += 2;
        else score += 1;
        count++;
    }
    if (count === 0) return "fast";
    const avg = score / count;
    if (avg >= 2.5) return "fast";
    if (avg >= 1.5) return "moderate";
    return "slow";
}
function usePerformanceMetrics() {
    const [metrics, setMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialMetrics);
    const [isSupported, setIsSupported] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const updateMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((updates)=>{
        setMetrics((prev)=>{
            const newMetrics = {
                ...prev,
                ...updates
            };
            // Recalculate primary metric and score
            newMetrics.primaryMetric = newMetrics.lcp ?? newMetrics.fcp ?? newMetrics.pageLoadTime;
            newMetrics.overallScore = getOverallScore(newMetrics);
            return newMetrics;
        });
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            setIsSupported(false);
            return;
        }
        //TURBOPACK unreachable
        ;
        // Get navigation timing data
        const getNavigationTiming = undefined;
        // Get resource timing data
        const getResourceTiming = undefined;
        // Observe paint timing (FCP)
        const paintObserver = undefined;
        // Observe LCP
        const lcpObserver = undefined;
        // Observe CLS
        let clsValue;
        const clsObserver = undefined;
        // Observe FID
        const fidObserver = undefined;
        // Observe INP (Interaction to Next Paint)
        const inpObserver = undefined;
    }, [
        updateMetrics
    ]);
    // Force refresh metrics
    const refreshMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const navigation = undefined;
        const resources = undefined;
    }, [
        updateMetrics
    ]);
    return {
        metrics,
        isSupported,
        refreshMetrics
    };
}
}),
"[project]/src/hooks/useProviderStatus.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useProviderStatus",
    ()=>useProviderStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
const POLL_INTERVAL = 30000; // 30 seconds
const INITIAL_TIMEOUT = 8000; // 8 seconds for health check
function useProviderStatus() {
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        providerType: 'cloud',
        status: 'connecting',
        lastChecked: 0
    });
    const isCheckingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const checkHealth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (isCheckingRef.current) return;
        isCheckingRef.current = true;
        try {
            // Check health with timeout for better UX
            const controller = new AbortController();
            const timeoutId = setTimeout(()=>controller.abort(), INITIAL_TIMEOUT);
            const healthRes = await fetch('/api/health/providers?checkCloud=false', {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!healthRes.ok) {
                setStatus((prev)=>({
                        ...prev,
                        status: 'disconnected',
                        error: 'Health check failed',
                        lastChecked: Date.now()
                    }));
                return;
            }
            const health = await healthRes.json();
            // Determine provider based on what's available
            // Priority: Lynkr > Local > Cloud
            let actualProvider = 'cloud';
            let connectionStatus = 'connected';
            let latency;
            if (health.summary.lynkrAvailable) {
                actualProvider = 'lynkr';
                connectionStatus = 'connected';
                latency = health.providers.lynkr.latencyMs;
            } else if (health.summary.localAvailable) {
                actualProvider = 'local';
                connectionStatus = 'connected';
                latency = health.providers.ollama.latencyMs;
            } else {
                // Default to cloud - assume cloud is always available
                actualProvider = 'cloud';
                connectionStatus = 'connected';
            }
            setStatus({
                providerType: actualProvider,
                status: connectionStatus,
                latencyMs: latency,
                lastChecked: Date.now()
            });
        } catch (err) {
            // On error, assume cloud fallback is working
            setStatus({
                providerType: 'cloud',
                status: 'connected',
                lastChecked: Date.now()
            });
        } finally{
            isCheckingRef.current = false;
        }
    }, []);
    // Initial check with a small delay to not block render
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const timer = setTimeout(checkHealth, 1000);
        return ()=>clearTimeout(timer);
    }, [
        checkHealth
    ]);
    // Periodic polling
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const interval = setInterval(checkHealth, POLL_INTERVAL);
        return ()=>clearInterval(interval);
    }, [
        checkHealth
    ]);
    // Helper function to get display color
    const getStatusColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        switch(status.status){
            case 'connected':
                return '#22c55e'; // green-500
            case 'connecting':
                return '#f97316'; // orange-500
            case 'disconnected':
                return '#ef4444'; // red-500
            default:
                return '#6b7280'; // gray-500
        }
    }, [
        status.status
    ]);
    // Helper function to get provider display name
    const getProviderDisplayName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        switch(status.providerType){
            case 'lynkr':
                return 'Lynkr';
            case 'local':
                return 'Local';
            case 'cloud':
                return 'Cloud';
            default:
                return 'Unknown';
        }
    }, [
        status.providerType
    ]);
    return {
        ...status,
        isChecking: isCheckingRef.current,
        refresh: checkHealth,
        getStatusColor,
        getProviderDisplayName
    };
}
const __TURBOPACK__default__export__ = useProviderStatus;
}),
];

//# sourceMappingURL=src_5fd25e5e._.js.map