(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/claw-ai/slash-command-registry.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ALL_SLASH_COMMANDS",
    ()=>ALL_SLASH_COMMANDS,
    "CATEGORY_COLORS",
    ()=>CATEGORY_COLORS,
    "CATEGORY_LABELS",
    ()=>CATEGORY_LABELS,
    "DIMENSION_COMMANDS",
    ()=>DIMENSION_COMMANDS,
    "NAVIGATION_COMMANDS",
    ()=>NAVIGATION_COMMANDS,
    "QUICK_COMMANDS",
    ()=>QUICK_COMMANDS,
    "SKILL_COMMANDS",
    ()=>SKILL_COMMANDS,
    "TOOL_COMMANDS",
    ()=>TOOL_COMMANDS,
    "default",
    ()=>__TURBOPACK__default__export__,
    "formatCommandPreview",
    ()=>formatCommandPreview,
    "getCommand",
    ()=>getCommand,
    "getCommandsByCategory",
    ()=>getCommandsByCategory,
    "parseCommandString",
    ()=>parseCommandString,
    "searchCommands",
    ()=>searchCommands
]);
/**
 * Slash Command Registry - Comprehensive command system for Claw AI Chat
 *
 * Exposes all tools, skills, dimensions, and context as / commands and @ references
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/compass.js [app-client] (ecmascript) <export default as Compass>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/brain.js [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/code.js [app-client] (ecmascript) <export default as Code>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/palette.js [app-client] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/music.js [app-client] (ecmascript) <export default as Music>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/terminal.js [app-client] (ecmascript) <export default as Terminal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/git-branch.js [app-client] (ecmascript) <export default as GitBranch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/video.js [app-client] (ecmascript) <export default as Video>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/circle-help.js [app-client] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/target.js [app-client] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-client] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/table.js [app-client] (ecmascript) <export default as Table>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/list.js [app-client] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/cpu.js [app-client] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/mic.js [app-client] (ecmascript) <export default as Mic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/wand-sparkles.js [app-client] (ecmascript) <export default as Wand2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$tool$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PenTool$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/pen-tool.js [app-client] (ecmascript) <export default as PenTool>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$accessibility$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Accessibility$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/accessibility.js [app-client] (ecmascript) <export default as Accessibility>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-client] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2d$3d$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Move3D$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/move-3d.js [app-client] (ecmascript) <export default as Move3D>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$boxes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Boxes$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/boxes.js [app-client] (ecmascript) <export default as Boxes>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/flask-conical.js [app-client] (ecmascript) <export default as FlaskConical>");
// Import Trash2 for clear command
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.469.0_react@19.2.3/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
;
const NAVIGATION_COMMANDS = [
    {
        name: 'home',
        aliases: [
            'start',
            'main'
        ],
        label: 'Home',
        description: 'Go to the home screen',
        category: 'navigation',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__["Compass"],
        color: '#f59e0b',
        destination: '/'
    },
    {
        name: 'chat',
        label: 'Chat',
        description: 'Open full chat interface',
        category: 'navigation',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"],
        color: '#3b82f6',
        destination: '/chat'
    },
    {
        name: 'canvas',
        aliases: [
            'design-canvas'
        ],
        label: 'Design Canvas',
        description: 'Open the infinite design canvas',
        category: 'navigation',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"],
        color: '#10b981',
        destination: '/canvas'
    },
    {
        name: 'projects',
        aliases: [
            'kanban',
            'tasks'
        ],
        label: 'Projects',
        description: 'View projects and kanban board',
        category: 'navigation',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"],
        color: '#8b5cf6',
        destination: '/projects'
    },
    {
        name: 'design',
        aliases: [
            'themes'
        ],
        label: 'Design Themes',
        description: 'Explore 50+ design themes',
        category: 'navigation',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"],
        color: '#ec4899',
        destination: '/design'
    },
    {
        name: 'resume',
        aliases: [
            'cv',
            'about'
        ],
        label: 'Resume',
        description: 'View James\'s resume',
        category: 'navigation',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
        color: '#6366f1',
        destination: '/resume'
    },
    {
        name: 'music',
        aliases: [
            'jamz',
            'tracks'
        ],
        label: 'Music',
        description: 'Listen to music and tracks',
        category: 'navigation',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__["Music"],
        color: '#ef4444',
        destination: '/music'
    },
    {
        name: 'video',
        aliases: [
            'studio'
        ],
        label: 'Video Studio',
        description: 'Create and edit videos',
        category: 'navigation',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"],
        color: '#f97316',
        destination: '/video'
    },
    {
        name: 'agent',
        aliases: [
            'infinity',
            'coding'
        ],
        label: 'Agent',
        description: 'Open the coding agent',
        category: 'navigation',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"],
        color: '#14b8a6',
        destination: '/agent',
        ownerOnly: true
    },
    {
        name: 'memory',
        aliases: [
            'memories'
        ],
        label: 'Memory Control',
        description: 'View and manage AI memories',
        category: 'navigation',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"],
        color: '#a855f7',
        destination: '/memory',
        ownerOnly: true
    },
    {
        name: 'settings',
        label: 'Settings',
        description: 'Open settings',
        category: 'navigation',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
        color: '#6b7280',
        destination: '/settings',
        ownerOnly: true
    }
];
const TOOL_COMMANDS = [
    // Search & Discovery
    {
        name: 'search',
        aliases: [
            'find',
            'lookup'
        ],
        label: 'Search Portfolio',
        description: 'Search projects, skills, and experience',
        category: 'tools',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
        color: '#3b82f6',
        toolName: 'search_portfolio',
        parameter: {
            name: 'query',
            description: 'What to search for',
            required: true,
            type: 'text'
        }
    },
    {
        name: 'weather',
        label: 'Weather',
        description: 'Show weather widget',
        category: 'tools',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"],
        color: '#0ea5e9',
        toolName: 'show_weather',
        parameter: {
            name: 'location',
            description: 'Location (default: San Francisco)',
            type: 'text'
        }
    },
    {
        name: 'photos',
        aliases: [
            'gallery',
            'images'
        ],
        label: 'Photos',
        description: 'Show photo gallery',
        category: 'tools',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"],
        color: '#f472b6',
        toolName: 'show_photos'
    },
    // Scheduling
    {
        name: 'schedule',
        aliases: [
            'book',
            'meeting'
        ],
        label: 'Schedule Call',
        description: 'Schedule a call with James',
        category: 'tools',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"],
        color: '#22c55e',
        toolName: 'schedule_call',
        parameter: {
            name: 'topic',
            description: 'Topic for the call',
            type: 'text'
        }
    },
    {
        name: 'availability',
        aliases: [
            'times',
            'free'
        ],
        label: 'Check Availability',
        description: 'See available meeting times',
        category: 'tools',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
        color: '#22c55e',
        toolName: 'get_available_times',
        parameter: {
            name: 'date',
            description: 'Date to check (YYYY-MM-DD)',
            type: 'text'
        }
    },
    // Memory
    {
        name: 'remember',
        aliases: [
            'recall'
        ],
        label: 'Remember',
        description: 'Search AI memories',
        category: 'memory',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"],
        color: '#a855f7',
        toolName: 'remember',
        parameter: {
            name: 'query',
            description: 'What to remember',
            required: true,
            type: 'text'
        }
    },
    {
        name: 'memorize',
        aliases: [
            'store'
        ],
        label: 'Memorize',
        description: 'Store a new memory',
        category: 'memory',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"],
        color: '#a855f7',
        toolName: 'memorize',
        ownerOnly: true,
        parameter: {
            name: 'content',
            description: 'Memory content',
            required: true,
            type: 'text'
        }
    },
    {
        name: 'learn',
        label: 'Learn',
        description: 'Teach AI a new fact',
        category: 'memory',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
        color: '#a855f7',
        toolName: 'learn',
        ownerOnly: true,
        parameter: {
            name: 'knowledge',
            description: 'What to learn',
            required: true,
            type: 'text'
        }
    },
    // Product Lifecycle
    {
        name: 'project',
        aliases: [
            'new-project'
        ],
        label: 'Create Project',
        description: 'Create a new product project',
        category: 'product',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"],
        color: '#8b5cf6',
        toolName: 'create_project',
        ownerOnly: true,
        parameter: {
            name: 'name',
            description: 'Project name',
            required: true,
            type: 'text'
        }
    },
    {
        name: 'prd',
        aliases: [
            'spec',
            'requirements'
        ],
        label: 'Create PRD',
        description: 'Create Product Requirements Document',
        category: 'product',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
        color: '#ec4899',
        toolName: 'create_prd',
        ownerOnly: true,
        parameter: {
            name: 'title',
            description: 'PRD title',
            required: true,
            type: 'text'
        }
    },
    {
        name: 'ticket',
        aliases: [
            'story',
            'task'
        ],
        label: 'Create Ticket',
        description: 'Create BMAD user story ticket',
        category: 'product',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"],
        color: '#f59e0b',
        toolName: 'create_ticket',
        ownerOnly: true,
        parameter: {
            name: 'title',
            description: 'Ticket title',
            required: true,
            type: 'text'
        }
    },
    {
        name: 'kanban',
        aliases: [
            'board'
        ],
        label: 'Show Kanban',
        description: 'Display kanban board',
        category: 'product',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"],
        color: '#3b82f6',
        toolName: 'show_kanban_tasks',
        parameter: {
            name: 'filter',
            description: 'Status filter',
            type: 'select',
            options: [
                'all',
                'todo',
                'in-progress',
                'done',
                'backlog'
            ]
        }
    },
    // Code & Execution
    {
        name: 'clone',
        aliases: [
            'repo'
        ],
        label: 'Clone Repository',
        description: 'Clone a git repository',
        category: 'code',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"],
        color: '#6366f1',
        toolName: 'clone_repository',
        ownerOnly: true,
        parameter: {
            name: 'url',
            description: 'Repository URL',
            required: true,
            type: 'text'
        }
    },
    {
        name: 'run',
        aliases: [
            'exec',
            'cmd'
        ],
        label: 'Run Command',
        description: 'Execute a shell command',
        category: 'code',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"],
        color: '#22c55e',
        toolName: 'run_command',
        ownerOnly: true,
        parameter: {
            name: 'command',
            description: 'Command to run',
            required: true,
            type: 'text'
        }
    },
    {
        name: 'read',
        aliases: [
            'cat',
            'view'
        ],
        label: 'Read File',
        description: 'Read a file\'s contents',
        category: 'code',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
        color: '#6366f1',
        toolName: 'read_file',
        ownerOnly: true,
        parameter: {
            name: 'path',
            description: 'File path',
            required: true,
            type: 'text'
        }
    },
    {
        name: 'write',
        aliases: [
            'save'
        ],
        label: 'Write File',
        description: 'Write content to a file',
        category: 'code',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$tool$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PenTool$3e$__["PenTool"],
        color: '#6366f1',
        toolName: 'write_file',
        ownerOnly: true,
        parameter: {
            name: 'path',
            description: 'File path',
            required: true,
            type: 'text'
        }
    },
    {
        name: 'search-code',
        aliases: [
            'grep'
        ],
        label: 'Search Codebase',
        description: 'Search code with regex',
        category: 'code',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"],
        color: '#6366f1',
        toolName: 'search_codebase',
        ownerOnly: true,
        parameter: {
            name: 'pattern',
            description: 'Search pattern',
            required: true,
            type: 'text'
        }
    },
    // Media Generation
    {
        name: 'generate',
        aliases: [
            'create',
            'ai'
        ],
        label: 'Generate',
        description: 'AI generation on canvas',
        category: 'media',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
        color: '#f59e0b',
        toolName: 'generate_on_canvas',
        parameter: {
            name: 'prompt',
            description: 'Generation prompt',
            required: true,
            type: 'text'
        }
    },
    {
        name: 'video-create',
        aliases: [
            'render'
        ],
        label: 'Create Video',
        description: 'Create a video composition',
        category: 'media',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"],
        color: '#f97316',
        toolName: 'create_video_composition',
        ownerOnly: true,
        parameter: {
            name: 'name',
            description: 'Video name',
            required: true,
            type: 'text'
        }
    },
    {
        name: 'tts',
        aliases: [
            'speak',
            'voice'
        ],
        label: 'Text to Speech',
        description: 'Generate speech from text',
        category: 'media',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"],
        color: '#22c55e',
        toolName: 'generate_voice',
        parameter: {
            name: 'text',
            description: 'Text to speak',
            required: true,
            type: 'text'
        }
    },
    // Channels & Messaging
    {
        name: 'message',
        aliases: [
            'send'
        ],
        label: 'Send Message',
        description: 'Send a channel message',
        category: 'tools',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"],
        color: '#3b82f6',
        toolName: 'send_channel_message',
        ownerOnly: true,
        parameter: {
            name: 'content',
            description: 'Message content',
            required: true,
            type: 'text'
        }
    },
    // Utility
    {
        name: 'ui',
        aliases: [
            'render'
        ],
        label: 'Render UI',
        description: 'Render custom UI components',
        category: 'tools',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$boxes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Boxes$3e$__["Boxes"],
        color: '#8b5cf6',
        toolName: 'render_ui'
    },
    {
        name: 'cron',
        aliases: [
            'schedule-job'
        ],
        label: 'Create Cron Job',
        description: 'Create a scheduled job',
        category: 'tools',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
        color: '#f59e0b',
        toolName: 'create_cron_job',
        ownerOnly: true,
        parameter: {
            name: 'expression',
            description: 'Cron expression',
            required: true,
            type: 'text'
        }
    }
];
const SKILL_COMMANDS = [
    // Design Skills
    {
        name: 'skill-design',
        aliases: [
            'design-excellence'
        ],
        label: 'Design Excellence',
        description: 'High-impact interface design principles',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"],
        color: '#ec4899',
        contextType: 'skill:design-excellence'
    },
    {
        name: 'skill-ui',
        aliases: [
            'ui-constraints'
        ],
        label: 'UI Constraints',
        description: 'Opinionated UI guidelines (Tailwind, no gradients)',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$tool$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PenTool$3e$__["PenTool"],
        color: '#ec4899',
        contextType: 'skill:ui'
    },
    {
        name: 'skill-interface',
        aliases: [
            'interface-craft'
        ],
        label: 'Interface Craft',
        description: 'Intentional design: clarity, structure, beauty',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__["Wand2"],
        color: '#ec4899',
        contextType: 'skill:interface-craft'
    },
    {
        name: 'skill-motion',
        aliases: [
            'animation'
        ],
        label: 'Motion Design',
        description: 'Animation principles: 100-500ms timing, easing',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"],
        color: '#f97316',
        contextType: 'skill:motion-design'
    },
    {
        name: 'skill-ios',
        aliases: [
            'ios-hig'
        ],
        label: 'iOS Excellence',
        description: 'iOS HIG patterns: SF Pro, 8pt grid, haptics',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"],
        color: '#3b82f6',
        contextType: 'skill:ios-excellence'
    },
    {
        name: 'skill-a11y',
        aliases: [
            'accessibility'
        ],
        label: 'Accessibility Review',
        description: 'A11y QA: keyboard, screen reader, contrast',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$accessibility$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Accessibility$3e$__["Accessibility"],
        color: '#22c55e',
        contextType: 'skill:accessibility-review'
    },
    // Development Skills
    {
        name: 'skill-react',
        aliases: [
            'vercel-best-practices'
        ],
        label: 'React Best Practices',
        description: '45+ performance rules across 8 priority tiers',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"],
        color: '#3b82f6',
        contextType: 'skill:vercel-react-best-practices'
    },
    {
        name: 'skill-threejs',
        aliases: [
            '3d'
        ],
        label: 'Three.js Excellence',
        description: '3D excellence: 7 gallery types, shaders',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2d$3d$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Move3D$3e$__["Move3D"],
        color: '#8b5cf6',
        contextType: 'skill:threejs'
    },
    {
        name: 'skill-browser',
        aliases: [
            'automation'
        ],
        label: 'Browser Automation',
        description: 'Navigation, clicks, forms, screenshots',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"],
        color: '#6366f1',
        contextType: 'skill:agent-browser'
    },
    {
        name: 'skill-clone',
        aliases: [
            'extract'
        ],
        label: 'Clone React',
        description: 'Visual component extraction from websites',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"],
        color: '#6366f1',
        contextType: 'skill:clone-react'
    },
    // Security & Research
    {
        name: 'skill-security',
        aliases: [
            '0din',
            'red-team'
        ],
        label: 'Security Research',
        description: 'AI safety & red teaming with JEF scoring',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
        color: '#ef4444',
        contextType: 'skill:0din-security-research',
        ownerOnly: true
    },
    {
        name: 'skill-science',
        aliases: [
            'scientific'
        ],
        label: 'Scientific Skills',
        description: 'K-Dense: 139 scientific skills',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__["FlaskConical"],
        color: '#14b8a6',
        contextType: 'skill:scientific-skills'
    },
    // Project Management
    {
        name: 'skill-pm',
        aliases: [
            'project-management'
        ],
        label: 'Project Management',
        description: 'GitHub workflow & Kanban methodology',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"],
        color: '#f59e0b',
        contextType: 'skill:project-management'
    },
    {
        name: 'skill-web-design',
        aliases: [
            'web-guidelines'
        ],
        label: 'Web Design Guidelines',
        description: 'Web design standards and patterns',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"],
        color: '#ec4899',
        contextType: 'skill:web-design-guidelines'
    },
    {
        name: 'skill-remotion',
        aliases: [
            'video-export'
        ],
        label: 'Remotion Video',
        description: 'Video export integration',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"],
        color: '#f97316',
        contextType: 'skill:remotion-video-exports'
    },
    {
        name: 'skill-actionbook',
        aliases: [
            'web-automation'
        ],
        label: 'Actionbook Automation',
        description: 'Web automation patterns',
        category: 'skills',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
        color: '#a855f7',
        contextType: 'skill:actionbook-web-automation'
    }
];
const DIMENSION_COMMANDS = [
    {
        name: 'dim-kanban',
        label: 'Kanban View',
        description: 'View data as kanban board with status columns',
        category: 'dimensions',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"],
        color: '#3b82f6',
        toolName: 'navigate_dimension',
        contextType: 'dimension:kanban'
    },
    {
        name: 'dim-timeline',
        label: 'Timeline View',
        description: 'View data chronologically on a timeline',
        category: 'dimensions',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
        color: '#22c55e',
        toolName: 'navigate_dimension',
        contextType: 'dimension:timeline'
    },
    {
        name: 'dim-graph',
        label: 'Graph View',
        description: 'View data as connected nodes',
        category: 'dimensions',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"],
        color: '#8b5cf6',
        toolName: 'navigate_dimension',
        contextType: 'dimension:graph'
    },
    {
        name: 'dim-table',
        label: 'Table View',
        description: 'View data in a sortable table',
        category: 'dimensions',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"],
        color: '#6b7280',
        toolName: 'navigate_dimension',
        contextType: 'dimension:table'
    },
    {
        name: 'dim-feed',
        label: 'Feed View',
        description: 'View data as a scrollable feed',
        category: 'dimensions',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"],
        color: '#f59e0b',
        toolName: 'navigate_dimension',
        contextType: 'dimension:feed'
    },
    {
        name: 'dim-calendar',
        label: 'Calendar View',
        description: 'View data on a calendar',
        category: 'dimensions',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"],
        color: '#ef4444',
        toolName: 'navigate_dimension',
        contextType: 'dimension:calendar'
    },
    {
        name: 'dim-cards',
        label: 'Cards View',
        description: 'View data as visual cards',
        category: 'dimensions',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$boxes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Boxes$3e$__["Boxes"],
        color: '#ec4899',
        toolName: 'navigate_dimension',
        contextType: 'dimension:cards'
    }
];
const QUICK_COMMANDS = [
    {
        name: 'help',
        aliases: [
            '?',
            'commands'
        ],
        label: 'Help',
        description: 'Show all available commands',
        category: 'quick',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"],
        color: '#6b7280'
    },
    {
        name: 'clear',
        aliases: [
            'reset'
        ],
        label: 'Clear Chat',
        description: 'Clear the current conversation',
        category: 'quick',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"],
        color: '#ef4444'
    },
    {
        name: 'voice',
        aliases: [
            'tts-toggle'
        ],
        label: 'Toggle Voice',
        description: 'Toggle voice responses on/off',
        category: 'quick',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"],
        color: '#22c55e'
    },
    {
        name: 'new',
        aliases: [
            'new-chat'
        ],
        label: 'New Thread',
        description: 'Start a new conversation',
        category: 'quick',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$469$2e$0_react$40$19$2e$2$2e$3$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"],
        color: '#3b82f6'
    }
];
;
const ALL_SLASH_COMMANDS = [
    ...QUICK_COMMANDS,
    ...NAVIGATION_COMMANDS,
    ...TOOL_COMMANDS,
    ...SKILL_COMMANDS,
    ...DIMENSION_COMMANDS
];
function searchCommands(query, options) {
    const normalizedQuery = query.toLowerCase().replace(/^\//, '');
    let commands = ALL_SLASH_COMMANDS;
    // Filter by owner-only
    if (!options?.includeOwnerOnly) {
        commands = commands.filter((cmd)=>!cmd.ownerOnly);
    }
    // Filter by categories
    if (options?.categories?.length) {
        commands = commands.filter((cmd)=>options.categories.includes(cmd.category));
    }
    // No query? Return all matching commands
    if (!normalizedQuery) {
        return commands.slice(0, 20);
    }
    // Search by name, aliases, and label
    return commands.filter((cmd)=>{
        const matchesName = cmd.name.toLowerCase().includes(normalizedQuery);
        const matchesAlias = cmd.aliases?.some((a)=>a.toLowerCase().includes(normalizedQuery));
        const matchesLabel = cmd.label.toLowerCase().includes(normalizedQuery);
        const matchesDescription = cmd.description.toLowerCase().includes(normalizedQuery);
        return matchesName || matchesAlias || matchesLabel || matchesDescription;
    });
}
function getCommand(name) {
    const normalizedName = name.toLowerCase().replace(/^\//, '');
    return ALL_SLASH_COMMANDS.find((cmd)=>cmd.name === normalizedName || cmd.aliases?.includes(normalizedName));
}
function getCommandsByCategory(includeOwnerOnly = false) {
    const commands = includeOwnerOnly ? ALL_SLASH_COMMANDS : ALL_SLASH_COMMANDS.filter((cmd)=>!cmd.ownerOnly);
    return commands.reduce((acc, cmd)=>{
        if (!acc[cmd.category]) {
            acc[cmd.category] = [];
        }
        acc[cmd.category].push(cmd);
        return acc;
    }, {});
}
const CATEGORY_LABELS = {
    quick: 'Quick Actions',
    navigation: 'Navigation',
    tools: 'Tools',
    skills: 'Skills',
    dimensions: 'Dimensions',
    context: 'Context',
    media: 'Media',
    code: 'Code & Execution',
    memory: 'Memory',
    product: 'Product Lifecycle'
};
const CATEGORY_COLORS = {
    quick: '#6b7280',
    navigation: '#f59e0b',
    tools: '#3b82f6',
    skills: '#8b5cf6',
    dimensions: '#10b981',
    context: '#ec4899',
    media: '#f97316',
    code: '#6366f1',
    memory: '#a855f7',
    product: '#22c55e'
};
function formatCommandPreview(cmd) {
    let preview = `/${cmd.name}`;
    if (cmd.parameter) {
        preview += cmd.parameter.required ? ` <${cmd.parameter.name}>` : ` [${cmd.parameter.name}]`;
    }
    return preview;
}
function parseCommandString(input) {
    const match = input.match(/^\/(\S+)(?:\s+(.*))?$/);
    if (!match) {
        return {
            command: undefined,
            args: ''
        };
    }
    const [, cmdName, args = ''] = match;
    const command = getCommand(cmdName);
    return {
        command,
        args: args.trim()
    };
}
const __TURBOPACK__default__export__ = ALL_SLASH_COMMANDS;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/episode/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================================================
// Cartoon Episode Production System - Core Types
// =============================================================================
// "Dad & Lad" animated short episode pipeline
// Music-first, beat-synced, style-consistent cartoon production
// =============================================================================
// -----------------------------------------------------------------------------
// Beat Analysis Types
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "ASSEMBLY_PRESETS",
    ()=>ASSEMBLY_PRESETS,
    "DEFAULT_ASSEMBLY_CONFIG",
    ()=>DEFAULT_ASSEMBLY_CONFIG,
    "DEFAULT_BEAT_ANALYSIS_CONFIG",
    ()=>DEFAULT_BEAT_ANALYSIS_CONFIG,
    "DEFAULT_CLIP_TRIM_CONFIG",
    ()=>DEFAULT_CLIP_TRIM_CONFIG,
    "DEFAULT_TRANSITION",
    ()=>DEFAULT_TRANSITION,
    "TRANSITION_PRESETS",
    ()=>TRANSITION_PRESETS
]);
const DEFAULT_TRANSITION = {
    type: 'cut',
    on: 'kick'
};
const TRANSITION_PRESETS = {
    'cut-on-kick': {
        type: 'cut',
        on: 'kick'
    },
    'cut-on-snare': {
        type: 'cut',
        on: 'snare'
    },
    'cut-on-downbeat': {
        type: 'cut',
        on: 'downbeat'
    },
    'smooth-crossfade': {
        type: 'crossfade',
        durationBeats: 2
    },
    'quick-crossfade': {
        type: 'crossfade',
        durationBeats: 1
    },
    'whip-left': {
        type: 'whip-pan',
        direction: 'left'
    },
    'whip-right': {
        type: 'whip-pan',
        direction: 'right'
    },
    'fade-to-black': {
        type: 'fade-black',
        durationMs: 500
    }
};
const DEFAULT_BEAT_ANALYSIS_CONFIG = {
    method: 'web-audio',
    onsetThreshold: 0.3,
    classifyBeats: true,
    detectSections: true,
    frequencyRanges: {
        kick: [
            20,
            150
        ],
        snare: [
            150,
            1000
        ],
        hihat: [
            3000,
            16000
        ]
    }
};
const DEFAULT_CLIP_TRIM_CONFIG = {
    snapToBeats: true,
    snapThresholdMs: 100,
    paddingMs: 0,
    minDurationMs: 500,
    maxDurationMs: 10000
};
const DEFAULT_ASSEMBLY_CONFIG = {
    resolution: {
        width: 1080,
        height: 1920
    },
    fps: 30,
    format: 'mp4',
    codec: 'h264',
    audioMix: {
        songVolume: 0.85,
        spokenWordVolume: 1.0,
        duckSongDuringNarration: true,
        duckAmountDb: -6
    },
    preset: 'youtube-short'
};
const ASSEMBLY_PRESETS = {
    'youtube': {
        resolution: {
            width: 1920,
            height: 1080
        },
        fps: 30,
        preset: 'youtube'
    },
    'youtube-short': {
        resolution: {
            width: 1080,
            height: 1920
        },
        fps: 30,
        preset: 'youtube-short'
    },
    'instagram-reel': {
        resolution: {
            width: 1080,
            height: 1920
        },
        fps: 30,
        preset: 'instagram-reel'
    },
    'tiktok': {
        resolution: {
            width: 1080,
            height: 1920
        },
        fps: 30,
        preset: 'tiktok'
    },
    '1080p': {
        resolution: {
            width: 1920,
            height: 1080
        },
        fps: 30,
        preset: '1080p'
    },
    '4k': {
        resolution: {
            width: 3840,
            height: 2160
        },
        fps: 30,
        preset: '4k'
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/episode/beat-analyzer.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// =============================================================================
// Beat Analyzer - Audio Analysis for Episode Production
// =============================================================================
// Extracts beat timestamps, classifies percussion, detects song structure.
// Supports Web Audio API (browser), Python via Lynkr (local), and hybrid.
// =============================================================================
__turbopack_context__.s([
    "analyzeBeatsLynkr",
    ()=>analyzeBeatsLynkr,
    "analyzeBeatsWebAudio",
    ()=>analyzeBeatsWebAudio,
    "annotateBeat",
    ()=>annotateBeat,
    "beatIntervalMs",
    ()=>beatIntervalMs,
    "beatTimestamps",
    ()=>beatTimestamps,
    "findNearestBeat",
    ()=>findNearestBeat,
    "getBeatsInRange",
    ()=>getBeatsInRange,
    "getDownbeatsInRange",
    ()=>getDownbeatsInRange,
    "snapToGrid",
    ()=>snapToGrid
]);
// Re-export the default config
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$episode$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/episode/types.ts [app-client] (ecmascript)");
;
async function analyzeBeatsWebAudio(audioBuffer, config = {
    method: 'web-audio',
    onsetThreshold: 0.3,
    classifyBeats: true,
    detectSections: true,
    frequencyRanges: {
        kick: [
            20,
            150
        ],
        snare: [
            150,
            1000
        ],
        hihat: [
            3000,
            16000
        ]
    }
}) {
    const sampleRate = audioBuffer.sampleRate;
    const channelData = audioBuffer.getChannelData(0); // Mono or left channel
    const durationMs = audioBuffer.duration * 1000 | 0;
    // Step 1: Compute onset detection function via spectral flux
    const onsets = detectOnsets(channelData, sampleRate, config.onsetThreshold);
    // Step 2: Estimate BPM from onset intervals
    const bpm = estimateBPM(onsets, durationMs);
    // Step 3: Build beat grid from BPM
    const beatGrid = buildBeatGrid(bpm, durationMs);
    // Step 4: Classify beats by frequency content (kick/snare/hihat)
    const classifiedBeats = config.classifyBeats ? classifyBeats(beatGrid, channelData, sampleRate, config.frequencyRanges) : beatGrid;
    // Step 5: Detect song sections by energy changes
    const energyCurve = computeEnergyCurve(channelData, sampleRate);
    const sections = config.detectSections ? detectSections(energyCurve, classifiedBeats, durationMs) : [];
    return {
        songId: '',
        bpm,
        timeSignature: '4/4',
        durationMs,
        beats: classifiedBeats,
        sections,
        energyCurve,
        analysis: {
            method: 'web-audio',
            confidence: 0.7,
            analyzedAt: new Date().toISOString()
        }
    };
}
/**
 * Detect audio onsets using spectral flux.
 * Compares FFT frames to find moments where energy increases suddenly.
 */ function detectOnsets(channelData, sampleRate, threshold) {
    const frameSize = 1024;
    const hopSize = 512;
    const numFrames = Math.floor((channelData.length - frameSize) / hopSize);
    const onsets = [];
    let prevSpectrum = null;
    for(let i = 0; i < numFrames; i++){
        const start = i * hopSize;
        const frame = channelData.slice(start, start + frameSize);
        // Apply Hanning window
        const windowed = applyHanningWindow(frame);
        // Compute magnitude spectrum (simplified FFT approximation using energy bands)
        const spectrum = computeEnergyBands(windowed, sampleRate);
        if (prevSpectrum) {
            // Spectral flux: sum of positive differences between frames
            let flux = 0;
            for(let j = 0; j < spectrum.length; j++){
                const diff = spectrum[j] - prevSpectrum[j];
                if (diff > 0) flux += diff;
            }
            // Normalize flux
            const normalizedFlux = Math.min(flux / 10, 1);
            if (normalizedFlux > threshold) {
                const timeMs = (start + frameSize / 2) / sampleRate * 1000;
                onsets.push({
                    timeMs,
                    intensity: normalizedFlux
                });
            }
        }
        prevSpectrum = spectrum;
    }
    // Merge onsets that are too close together (within 50ms)
    return mergeCloseOnsets(onsets, 50);
}
function applyHanningWindow(frame) {
    const windowed = new Float32Array(frame.length);
    for(let i = 0; i < frame.length; i++){
        const multiplier = 0.5 * (1 - Math.cos(2 * Math.PI * i / (frame.length - 1)));
        windowed[i] = frame[i] * multiplier;
    }
    return windowed;
}
/**
 * Simplified energy band computation.
 * Splits signal into frequency bands and computes energy per band.
 */ function computeEnergyBands(frame, sampleRate) {
    const numBands = 16;
    const bands = new Float64Array(numBands);
    const bandSize = Math.floor(frame.length / numBands);
    for(let b = 0; b < numBands; b++){
        let energy = 0;
        for(let i = b * bandSize; i < (b + 1) * bandSize && i < frame.length; i++){
            energy += frame[i] * frame[i];
        }
        bands[b] = Math.sqrt(energy / bandSize);
    }
    return bands;
}
function mergeCloseOnsets(onsets, minGapMs) {
    if (onsets.length === 0) return [];
    const merged = [
        onsets[0]
    ];
    for(let i = 1; i < onsets.length; i++){
        const last = merged[merged.length - 1];
        if (onsets[i].timeMs - last.timeMs < minGapMs) {
            // Keep the stronger onset
            if (onsets[i].intensity > last.intensity) {
                merged[merged.length - 1] = onsets[i];
            }
        } else {
            merged.push(onsets[i]);
        }
    }
    return merged;
}
// -----------------------------------------------------------------------------
// BPM Estimation
// -----------------------------------------------------------------------------
/**
 * Estimate BPM from onset intervals using autocorrelation of inter-onset intervals.
 */ function estimateBPM(onsets, durationMs) {
    if (onsets.length < 4) return 120; // Default fallback
    // Calculate inter-onset intervals
    const intervals = [];
    for(let i = 1; i < onsets.length; i++){
        intervals.push(onsets[i].timeMs - onsets[i - 1].timeMs);
    }
    // Build histogram of intervals (quantized to 10ms bins)
    // Focus on musically plausible range: 60-200 BPM → 300-1000ms intervals
    const minInterval = 300; // 200 BPM
    const maxInterval = 1000; // 60 BPM
    const binSize = 10;
    const numBins = Math.ceil((maxInterval - minInterval) / binSize);
    const histogram = new Float64Array(numBins);
    for (const interval of intervals){
        if (interval >= minInterval && interval <= maxInterval) {
            const bin = Math.floor((interval - minInterval) / binSize);
            if (bin >= 0 && bin < numBins) {
                histogram[bin] += 1;
            }
        }
        // Also check half and double intervals (sub-beats, half-time)
        const half = interval / 2;
        if (half >= minInterval && half <= maxInterval) {
            const bin = Math.floor((half - minInterval) / binSize);
            if (bin >= 0 && bin < numBins) histogram[bin] += 0.5;
        }
        const dbl = interval * 2;
        if (dbl >= minInterval && dbl <= maxInterval) {
            const bin = Math.floor((dbl - minInterval) / binSize);
            if (bin >= 0 && bin < numBins) histogram[bin] += 0.5;
        }
    }
    // Find the peak bin
    let maxBin = 0;
    let maxCount = 0;
    for(let i = 0; i < numBins; i++){
        if (histogram[i] > maxCount) {
            maxCount = histogram[i];
            maxBin = i;
        }
    }
    const dominantIntervalMs = minInterval + maxBin * binSize + binSize / 2;
    const bpm = Math.round(60000 / dominantIntervalMs * 10) / 10;
    // Clamp to reasonable range
    return Math.max(60, Math.min(200, bpm));
}
// -----------------------------------------------------------------------------
// Beat Grid Construction
// -----------------------------------------------------------------------------
/**
 * Build a regular beat grid from BPM, assuming 4/4 time.
 */ function buildBeatGrid(bpm, durationMs) {
    const beatIntervalMs = 60000 / bpm;
    const beats = [];
    let measure = 1;
    let beatInMeasure = 1;
    for(let timeMs = 0; timeMs < durationMs; timeMs += beatIntervalMs){
        beats.push({
            timeMs: Math.round(timeMs * 100) / 100,
            type: 'other',
            intensity: beatInMeasure === 1 ? 0.9 : beatInMeasure === 3 ? 0.7 : 0.5,
            isDownbeat: beatInMeasure === 1,
            measure,
            beatInMeasure
        });
        beatInMeasure++;
        if (beatInMeasure > 4) {
            beatInMeasure = 1;
            measure++;
        }
    }
    return beats;
}
// -----------------------------------------------------------------------------
// Beat Classification by Frequency
// -----------------------------------------------------------------------------
/**
 * Classify beats as kick/snare/hihat by analyzing frequency content at each beat time.
 */ function classifyBeats(beats, channelData, sampleRate, frequencyRanges) {
    const windowSize = 1024;
    return beats.map((beat)=>{
        const sampleIndex = Math.floor(beat.timeMs / 1000 * sampleRate);
        const start = Math.max(0, sampleIndex - windowSize / 2);
        const end = Math.min(channelData.length, start + windowSize);
        const frame = channelData.slice(start, end);
        if (frame.length < windowSize / 2) return beat;
        // Compute energy in each frequency range
        const kickEnergy = computeBandEnergy(frame, sampleRate, frequencyRanges.kick);
        const snareEnergy = computeBandEnergy(frame, sampleRate, frequencyRanges.snare);
        const hihatEnergy = computeBandEnergy(frame, sampleRate, frequencyRanges.hihat);
        const maxEnergy = Math.max(kickEnergy, snareEnergy, hihatEnergy);
        if (maxEnergy < 0.01) return beat;
        let type = 'other';
        if (kickEnergy === maxEnergy) type = 'kick';
        else if (snareEnergy === maxEnergy) type = 'snare';
        else if (hihatEnergy === maxEnergy) type = 'hihat';
        // In standard 4/4: beats 1,3 tend to be kick, beats 2,4 tend to be snare
        // Use this as a prior to improve classification
        if (beat.beatInMeasure === 1 || beat.beatInMeasure === 3) {
            if (kickEnergy > snareEnergy * 0.5) type = 'kick';
        } else if (beat.beatInMeasure === 2 || beat.beatInMeasure === 4) {
            if (snareEnergy > kickEnergy * 0.5) type = 'snare';
        }
        return {
            ...beat,
            type,
            intensity: Math.min(maxEnergy * 10, 1)
        };
    });
}
/**
 * Compute energy in a specific frequency band using time-domain bandpass approximation.
 */ function computeBandEnergy(frame, sampleRate, [lowHz, highHz]) {
    // Simple energy computation weighted by frequency band
    // For proper implementation, we'd use FFT. This is an approximation
    // that works for broad classification.
    const lowBin = Math.floor(lowHz / sampleRate * frame.length);
    const highBin = Math.floor(highHz / sampleRate * frame.length);
    let energy = 0;
    const bandStart = Math.max(0, lowBin);
    const bandEnd = Math.min(frame.length, highBin);
    for(let i = bandStart; i < bandEnd; i++){
        energy += frame[i] * frame[i];
    }
    return Math.sqrt(energy / Math.max(1, bandEnd - bandStart));
}
// -----------------------------------------------------------------------------
// Energy Curve Computation
// -----------------------------------------------------------------------------
/**
 * Compute an energy curve over time for visualizing track dynamics.
 * Returns energy samples at ~10ms intervals.
 */ function computeEnergyCurve(channelData, sampleRate) {
    const windowMs = 100; // 100ms windows
    const hopMs = 50; // 50ms hop
    const windowSamples = Math.floor(windowMs / 1000 * sampleRate);
    const hopSamples = Math.floor(hopMs / 1000 * sampleRate);
    const points = [];
    let maxRMS = 0;
    // First pass: compute all RMS values
    const rmsValues = [];
    for(let i = 0; i < channelData.length - windowSamples; i += hopSamples){
        let sum = 0;
        for(let j = i; j < i + windowSamples; j++){
            sum += channelData[j] * channelData[j];
        }
        const rms = Math.sqrt(sum / windowSamples);
        const timeMs = (i + windowSamples / 2) / sampleRate * 1000;
        rmsValues.push({
            timeMs,
            rms
        });
        if (rms > maxRMS) maxRMS = rms;
    }
    // Second pass: normalize
    for (const { timeMs, rms } of rmsValues){
        points.push({
            timeMs: Math.round(timeMs),
            energy: maxRMS > 0 ? rms / maxRMS : 0
        });
    }
    return points;
}
// -----------------------------------------------------------------------------
// Song Section Detection
// -----------------------------------------------------------------------------
/**
 * Detect song sections (verse, chorus, bridge) from energy curve changes.
 * Uses energy transitions and structural repetition to identify boundaries.
 */ function detectSections(energyCurve, beats, durationMs) {
    if (energyCurve.length === 0) return [];
    // Smooth the energy curve
    const smoothed = smoothEnergy(energyCurve, 20);
    // Find significant energy transitions
    const transitions = findEnergyTransitions(smoothed);
    // Snap transitions to nearest downbeat
    const snappedTransitions = transitions.map((t)=>{
        const nearest = beats.reduce((best, beat)=>{
            if (!beat.isDownbeat) return best;
            return Math.abs(beat.timeMs - t) < Math.abs(best - t) ? beat.timeMs : best;
        }, t);
        return nearest;
    });
    // Build sections from transitions
    const boundaries = [
        0,
        ...snappedTransitions,
        durationMs
    ];
    const sections = [];
    // Track section type counts for labeling
    const typeCounts = {};
    for(let i = 0; i < boundaries.length - 1; i++){
        const startMs = boundaries[i];
        const endMs = boundaries[i + 1];
        // Get average energy for this section
        const sectionEnergy = smoothed.filter((p)=>p.timeMs >= startMs && p.timeMs <= endMs).reduce((sum, p)=>sum + p.energy, 0);
        const avgEnergy = sectionEnergy / Math.max(1, smoothed.filter((p)=>p.timeMs >= startMs && p.timeMs <= endMs).length);
        // Classify section type by position and energy
        const type = classifySectionType(i, boundaries.length - 1, avgEnergy, endMs - startMs);
        typeCounts[type] = (typeCounts[type] || 0) + 1;
        const label = `${type}${typeCounts[type] > 1 ? typeCounts[type] : ''}`;
        sections.push({
            type,
            startMs: Math.round(startMs),
            endMs: Math.round(endMs),
            label,
            energy: Math.round(avgEnergy * 100) / 100
        });
    }
    return sections;
}
function smoothEnergy(curve, windowSize) {
    return curve.map((point, i)=>{
        const start = Math.max(0, i - windowSize);
        const end = Math.min(curve.length, i + windowSize + 1);
        let sum = 0;
        for(let j = start; j < end; j++)sum += curve[j].energy;
        return {
            timeMs: point.timeMs,
            energy: sum / (end - start)
        };
    });
}
function findEnergyTransitions(smoothed) {
    const transitions = [];
    const changeThreshold = 0.15; // 15% energy change = new section
    for(let i = 1; i < smoothed.length; i++){
        const change = Math.abs(smoothed[i].energy - smoothed[i - 1].energy);
        if (change > changeThreshold) {
            // Don't add transitions too close together (min 4 seconds apart)
            const lastTransition = transitions[transitions.length - 1];
            if (!lastTransition || smoothed[i].timeMs - lastTransition > 4000) {
                transitions.push(smoothed[i].timeMs);
            }
        }
    }
    return transitions;
}
function classifySectionType(index, totalSections, energy, durationMs) {
    // First section with low energy = intro
    if (index === 0 && energy < 0.4 && durationMs < 15000) return 'intro';
    // Last section with decreasing energy = outro
    if (index === totalSections - 1 && energy < 0.5 && durationMs < 15000) return 'outro';
    // High energy sections = chorus
    if (energy > 0.7) return 'chorus';
    // Medium energy = verse
    if (energy > 0.3) return 'verse';
    // Low energy in the middle = bridge or break
    if (energy <= 0.3) {
        return durationMs < 8000 ? 'break' : 'bridge';
    }
    return 'verse';
}
async function analyzeBeatsLynkr(audioUrl, lynkrUrl, apiKey) {
    const response = await fetch(`${lynkrUrl}/v1/audio/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            audio_url: audioUrl,
            analysis_type: 'full',
            backend: 'madmom'
        })
    });
    if (!response.ok) {
        throw new Error(`Lynkr beat analysis failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    // Convert Lynkr response to our BeatMap format
    const beats = data.beats.map((b, i)=>{
        const beatInMeasure = i % 4 + 1;
        const measure = Math.floor(i / 4) + 1;
        return {
            timeMs: b.time * 1000,
            type: b.type || 'other',
            intensity: b.intensity,
            isDownbeat: data.downbeats.includes(b.time) || beatInMeasure === 1,
            measure,
            beatInMeasure
        };
    });
    const sections = data.sections.map((s)=>({
            type: s.type,
            startMs: s.start * 1000,
            endMs: s.end * 1000,
            label: s.label,
            energy: 0.5
        }));
    const lastBeat = beats[beats.length - 1];
    return {
        songId: '',
        bpm: data.bpm,
        timeSignature: '4/4',
        durationMs: lastBeat ? lastBeat.timeMs + 60000 / data.bpm : 0,
        beats,
        sections,
        energyCurve: [],
        analysis: {
            method: 'madmom',
            confidence: 0.9,
            analyzedAt: new Date().toISOString()
        }
    };
}
function findNearestBeat(beats, timeMs) {
    if (beats.length === 0) return null;
    let nearest = beats[0];
    let minDist = Math.abs(beats[0].timeMs - timeMs);
    for (const beat of beats){
        const dist = Math.abs(beat.timeMs - timeMs);
        if (dist < minDist) {
            minDist = dist;
            nearest = beat;
        }
    }
    return nearest;
}
function getBeatsInRange(beats, startMs, endMs, type) {
    return beats.filter((b)=>b.timeMs >= startMs && b.timeMs <= endMs && (type === undefined || b.type === type));
}
function getDownbeatsInRange(beats, startMs, endMs) {
    return beats.filter((b)=>b.timeMs >= startMs && b.timeMs <= endMs && b.isDownbeat);
}
function beatIntervalMs(bpm) {
    return 60000 / bpm;
}
function snapToGrid(timeMs, bpm, thresholdMs = 50) {
    const interval = beatIntervalMs(bpm);
    const nearestBeat = Math.round(timeMs / interval) * interval;
    return Math.abs(nearestBeat - timeMs) <= thresholdMs ? nearestBeat : timeMs;
}
function beatTimestamps(beatMap, type) {
    const filtered = type ? beatMap.beats.filter((b)=>b.type === type) : beatMap.beats;
    return filtered.map((b)=>b.timeMs);
}
function annotateBeat(beatMap, timeMs, type) {
    const nearest = findNearestBeat(beatMap.beats, timeMs);
    if (!nearest) return beatMap;
    const updatedBeats = beatMap.beats.map((b)=>b.timeMs === nearest.timeMs ? {
            ...b,
            type
        } : b);
    return {
        ...beatMap,
        beats: updatedBeats,
        analysis: {
            ...beatMap.analysis,
            method: 'hybrid'
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/canvas/diagram-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Canvas Diagram Utilities
 * 
 * Conversion between canvas nodes/edges, Mermaid syntax, JSON export format,
 * and SVG generation. Modeled after Excalidraw's data layer.
 */ // ============================================================================
// Types
// ============================================================================
__turbopack_context__.s([
    "MERMAID_TEMPLATES",
    ()=>MERMAID_TEMPLATES,
    "buildDiagramPrompt",
    ()=>buildDiagramPrompt,
    "canvasToMermaid",
    ()=>canvasToMermaid,
    "canvasToSVG",
    ()=>canvasToSVG,
    "deserializeCanvas",
    ()=>deserializeCanvas,
    "mermaidToCanvas",
    ()=>mermaidToCanvas,
    "serializeCanvas",
    ()=>serializeCanvas
]);
function canvasToMermaid(nodes, edges) {
    const lines = [
        "flowchart TD"
    ];
    const nodeMap = new Map();
    // Map node IDs to simple labels
    nodes.forEach((node, i)=>{
        const label = node.content?.replace(/[[\]{}()|]/g, "") || `Node${i}`;
        const shortId = `N${i}`;
        nodeMap.set(node.id, shortId);
        // Determine shape syntax based on type
        switch(node.type){
            case "flow-decision":
                lines.push(`    ${shortId}{${label}}`);
                break;
            case "flow-start":
            case "flow-end":
                lines.push(`    ${shortId}([${label}])`);
                break;
            case "flow-process":
                lines.push(`    ${shortId}[${label}]`);
                break;
            case "flow-data":
                lines.push(`    ${shortId}[/${label}/]`);
                break;
            case "flow-subprocess":
                lines.push(`    ${shortId}[[${label}]]`);
                break;
            case "arch-database":
                lines.push(`    ${shortId}[(${label})]`);
                break;
            case "arch-service":
            case "arch-api":
                lines.push(`    ${shortId}[${label}]`);
                break;
            case "arch-client":
                lines.push(`    ${shortId}(${label})`);
                break;
            case "arch-queue":
                lines.push(`    ${shortId}>>${label}]`);
                break;
            case "arch-cloud":
                lines.push(`    ${shortId}{{${label}}}`);
                break;
            default:
                // Generic rectangle for unknown types
                lines.push(`    ${shortId}["${label}"]`);
        }
    });
    // Add edges
    edges.forEach((edge)=>{
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (source && target) {
            if (edge.label) {
                lines.push(`    ${source} -->|${edge.label}| ${target}`);
            } else {
                lines.push(`    ${source} --> ${target}`);
            }
        }
    });
    return lines.join("\n");
}
async function mermaidToCanvas(definition, startX = 0, startY = 0) {
    const nodes = [];
    const edges = [];
    const nodeIdMap = new Map();
    // Parse Mermaid syntax manually for basic flowcharts
    const lines = definition.split("\n").map((l)=>l.trim()).filter((l)=>l && !l.startsWith("%%"));
    // Skip the graph/flowchart declaration
    const contentLines = lines.filter((l)=>!l.match(/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram)\s/i));
    let nodeIndex = 0;
    const SPACING_X = 250;
    const SPACING_Y = 150;
    const COLS = 3;
    for (const line of contentLines){
        // Parse node definitions with shapes
        // Patterns: A[text], A(text), A{text}, A([text]), A[[text]], A[(text)], A{{text}}
        const nodePatterns = [
            /(\w+)\(\[([^\]]*)\]\)/g,
            /(\w+)\[\[([^\]]*)\]\]/g,
            /(\w+)\[\(([^)]*)\)\]/g,
            /(\w+)\{\{([^}]*)\}\}/g,
            /(\w+)\{([^}]*)\}/g,
            /(\w+)\[\/([^/]*)\/\]/g,
            /(\w+)\(([^)]*)\)/g,
            /(\w+)\["([^"]*)"\]/g,
            /(\w+)\[([^\]]*)\]/g
        ];
        for (const pattern of nodePatterns){
            pattern.lastIndex = 0;
            let match;
            while((match = pattern.exec(line)) !== null){
                const id = match[1];
                const text = match[2];
                if (!nodeIdMap.has(id)) {
                    const col = nodeIndex % COLS;
                    const row = Math.floor(nodeIndex / COLS);
                    const canvasId = `node-mermaid-${Date.now()}-${nodeIndex}`;
                    // Determine type from shape
                    let type = "flow-process";
                    if (pattern.source.includes("\\(\\[")) type = "flow-start";
                    else if (pattern.source.includes("\\{\\{")) type = "arch-cloud";
                    else if (pattern.source.includes("\\{")) type = "flow-decision";
                    else if (pattern.source.includes("\\[\\(")) type = "arch-database";
                    else if (pattern.source.includes("\\[\\[")) type = "flow-subprocess";
                    else if (pattern.source.includes("\\/")) type = "flow-data";
                    else if (pattern.source.includes("\\(")) type = "flow-start";
                    nodes.push({
                        id: canvasId,
                        type,
                        x: startX + col * SPACING_X,
                        y: startY + row * SPACING_Y,
                        width: 180,
                        height: 80,
                        content: text,
                        style: {
                            fill: getTypeColor(type)
                        }
                    });
                    nodeIdMap.set(id, canvasId);
                    nodeIndex++;
                }
            }
        }
        // Parse edges: A --> B, A -->|label| B, A --- B, A -.-> B, A ==> B
        const edgePattern = /(\w+)\s*(-+\.?->?|=+>|--+)\s*(?:\|([^|]*)\|\s*)?(\w+)/g;
        let edgeMatch;
        while((edgeMatch = edgePattern.exec(line)) !== null){
            const sourceId = edgeMatch[1];
            const label = edgeMatch[3] || undefined;
            const targetId = edgeMatch[4];
            // Ensure both nodes exist
            if (!nodeIdMap.has(sourceId)) {
                const col = nodeIndex % COLS;
                const row = Math.floor(nodeIndex / COLS);
                const canvasId = `node-mermaid-${Date.now()}-${nodeIndex}`;
                nodes.push({
                    id: canvasId,
                    type: "flow-process",
                    x: startX + col * SPACING_X,
                    y: startY + row * SPACING_Y,
                    width: 180,
                    height: 80,
                    content: sourceId,
                    style: {
                        fill: "#3b82f6"
                    }
                });
                nodeIdMap.set(sourceId, canvasId);
                nodeIndex++;
            }
            if (!nodeIdMap.has(targetId)) {
                const col = nodeIndex % COLS;
                const row = Math.floor(nodeIndex / COLS);
                const canvasId = `node-mermaid-${Date.now()}-${nodeIndex}`;
                nodes.push({
                    id: canvasId,
                    type: "flow-process",
                    x: startX + col * SPACING_X,
                    y: startY + row * SPACING_Y,
                    width: 180,
                    height: 80,
                    content: targetId,
                    style: {
                        fill: "#3b82f6"
                    }
                });
                nodeIdMap.set(targetId, canvasId);
                nodeIndex++;
            }
            const sourceCanvasId = nodeIdMap.get(sourceId);
            const targetCanvasId = nodeIdMap.get(targetId);
            edges.push({
                id: `edge-mermaid-${Date.now()}-${edges.length}`,
                source: sourceCanvasId,
                target: targetCanvasId,
                type: "arrow",
                label
            });
        }
    }
    // Auto-layout: arrange nodes in a top-down tree
    if (edges.length > 0) {
        autoLayoutTree(nodes, edges, startX, startY);
    }
    return {
        nodes,
        edges
    };
}
// ============================================================================
// Auto Layout
// ============================================================================
function autoLayoutTree(nodes, edges, startX, startY) {
    // Build adjacency list
    const children = new Map();
    const hasParent = new Set();
    for (const edge of edges){
        if (!children.has(edge.source)) children.set(edge.source, []);
        children.get(edge.source).push(edge.target);
        hasParent.add(edge.target);
    }
    // Find roots (nodes with no incoming edges)
    const roots = nodes.filter((n)=>!hasParent.has(n.id)).map((n)=>n.id);
    if (roots.length === 0 && nodes.length > 0) roots.push(nodes[0].id);
    const levels = new Map();
    const queue = roots.map((id)=>({
            id,
            level: 0
        }));
    const visited = new Set();
    while(queue.length > 0){
        const { id, level } = queue.shift();
        if (visited.has(id)) continue;
        visited.add(id);
        levels.set(id, level);
        const kids = children.get(id) || [];
        for (const kid of kids){
            queue.push({
                id: kid,
                level: level + 1
            });
        }
    }
    // Group by level
    const levelGroups = new Map();
    for (const [id, level] of levels){
        if (!levelGroups.has(level)) levelGroups.set(level, []);
        levelGroups.get(level).push(id);
    }
    // Position nodes
    const SPACING_X = 250;
    const SPACING_Y = 150;
    for (const [level, ids] of levelGroups){
        const totalWidth = (ids.length - 1) * SPACING_X;
        const offsetX = -totalWidth / 2;
        ids.forEach((id, i)=>{
            const node = nodes.find((n)=>n.id === id);
            if (node) {
                node.x = startX + offsetX + i * SPACING_X;
                node.y = startY + level * SPACING_Y;
            }
        });
    }
}
function getTypeColor(type) {
    const colors = {
        "flow-start": "#22c55e",
        "flow-end": "#ef4444",
        "flow-decision": "#f59e0b",
        "flow-process": "#3b82f6",
        "flow-data": "#8b5cf6",
        "flow-subprocess": "#06b6d4",
        "arch-database": "#6366f1",
        "arch-service": "#3b82f6",
        "arch-api": "#10b981",
        "arch-client": "#f97316",
        "arch-cloud": "#8b5cf6",
        "arch-queue": "#ec4899"
    };
    return colors[type] || "#3b82f6";
}
function serializeCanvas(name, nodes, edges, drawingElements = [], viewport) {
    const data = {
        type: "openclaw-canvas",
        version: 2,
        name,
        createdAt: new Date().toISOString(),
        nodes,
        edges,
        drawingElements,
        viewport
    };
    return JSON.stringify(data, null, 2);
}
function deserializeCanvas(json) {
    try {
        const data = JSON.parse(json);
        if (data.type !== "openclaw-canvas") {
            console.warn("Unknown canvas format, attempting import anyway");
        }
        return {
            type: "openclaw-canvas",
            version: data.version || 1,
            name: data.name || "Imported Canvas",
            createdAt: data.createdAt || new Date().toISOString(),
            nodes: Array.isArray(data.nodes) ? data.nodes : Array.isArray(data.elements) ? data.elements : [],
            edges: Array.isArray(data.edges) ? data.edges : [],
            drawingElements: Array.isArray(data.drawingElements) ? data.drawingElements : [],
            viewport: data.viewport || {
                x: 0,
                y: 0,
                zoom: 1
            }
        };
    } catch (e) {
        console.error("Failed to deserialize canvas:", e);
        return null;
    }
}
function canvasToSVG(nodes, edges, drawingElements = [], options = {}) {
    const { background = "#ffffff", padding = 40 } = options;
    // Calculate bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const node of nodes){
        minX = Math.min(minX, node.x);
        minY = Math.min(minY, node.y);
        maxX = Math.max(maxX, node.x + node.width);
        maxY = Math.max(maxY, node.y + node.height);
    }
    for (const el of drawingElements){
        minX = Math.min(minX, el.x);
        minY = Math.min(minY, el.y);
        maxX = Math.max(maxX, el.x + el.width);
        maxY = Math.max(maxY, el.y + el.height);
    }
    if (minX === Infinity) {
        minX = 0;
        minY = 0;
        maxX = 400;
        maxY = 300;
    }
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;
    const offsetX = -minX + padding;
    const offsetY = -minY + padding;
    const parts = [];
    parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`);
    parts.push(`  <rect width="100%" height="100%" fill="${escapeXml(background)}" />`);
    parts.push(`  <g transform="translate(${offsetX}, ${offsetY})">`);
    // Render edges
    parts.push(`    <defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" /></marker></defs>`);
    for (const edge of edges){
        const src = nodes.find((n)=>n.id === edge.source);
        const tgt = nodes.find((n)=>n.id === edge.target);
        if (src && tgt) {
            const x1 = src.x + src.width / 2;
            const y1 = src.y + src.height / 2;
            const x2 = tgt.x + tgt.width / 2;
            const y2 = tgt.y + tgt.height / 2;
            parts.push(`    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6b7280" stroke-width="2" marker-end="url(#arrowhead)" />`);
            if (edge.label) {
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2;
                parts.push(`    <text x="${mx}" y="${my - 8}" text-anchor="middle" font-size="12" fill="#6b7280">${escapeXml(edge.label)}</text>`);
            }
        }
    }
    // Render nodes
    for (const node of nodes){
        const fill = node.style?.fill || "#3b82f6";
        const label = node.content || "";
        if (node.type === "flow-decision") {
            const cx = node.x + node.width / 2;
            const cy = node.y + node.height / 2;
            parts.push(`    <polygon points="${cx},${node.y} ${node.x + node.width},${cy} ${cx},${node.y + node.height} ${node.x},${cy}" fill="${escapeXml(fill)}" stroke="#1e1e1e" stroke-width="1.5" />`);
        } else if (node.type === "flow-start" || node.type === "flow-end") {
            parts.push(`    <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="${node.height / 2}" fill="${escapeXml(fill)}" stroke="#1e1e1e" stroke-width="1.5" />`);
        } else if (node.type === "arch-database") {
            parts.push(`    <ellipse cx="${node.x + node.width / 2}" cy="${node.y + 12}" rx="${node.width / 2}" ry="12" fill="${escapeXml(fill)}" stroke="#1e1e1e" stroke-width="1.5" />`);
            parts.push(`    <rect x="${node.x}" y="${node.y + 12}" width="${node.width}" height="${node.height - 24}" fill="${escapeXml(fill)}" stroke="#1e1e1e" stroke-width="1.5" />`);
            parts.push(`    <ellipse cx="${node.x + node.width / 2}" cy="${node.y + node.height - 12}" rx="${node.width / 2}" ry="12" fill="${escapeXml(fill)}" stroke="#1e1e1e" stroke-width="1.5" />`);
        } else {
            parts.push(`    <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="8" fill="${escapeXml(fill)}" stroke="#1e1e1e" stroke-width="1.5" />`);
        }
        parts.push(`    <text x="${node.x + node.width / 2}" y="${node.y + node.height / 2}" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="white" font-family="system-ui, sans-serif">${escapeXml(label)}</text>`);
    }
    // Render drawing elements
    for (const el of drawingElements){
        const stroke = escapeXml(el.strokeColor || "#1e1e1e");
        const sw = el.strokeWidth || 2;
        const fill = el.fillStyle === "solid" ? escapeXml(el.backgroundColor || "none") : "none";
        const dasharray = el.strokeStyle === "dashed" ? ' stroke-dasharray="12,6"' : el.strokeStyle === "dotted" ? ' stroke-dasharray="3,6"' : "";
        if (el.type === "rectangle") {
            parts.push(`    <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dasharray} opacity="${(el.opacity || 100) / 100}" />`);
        } else if (el.type === "ellipse") {
            parts.push(`    <ellipse cx="${el.x + el.width / 2}" cy="${el.y + el.height / 2}" rx="${el.width / 2}" ry="${el.height / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dasharray} opacity="${(el.opacity || 100) / 100}" />`);
        } else if (el.type === "diamond") {
            const cx = el.x + el.width / 2;
            const cy = el.y + el.height / 2;
            parts.push(`    <polygon points="${cx},${el.y} ${el.x + el.width},${cy} ${cx},${el.y + el.height} ${el.x},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dasharray} />`);
        } else if ((el.type === "line" || el.type === "arrow" || el.type === "freedraw") && el.points) {
            const pts = el.points.map((p)=>`${el.x + p.x},${el.y + p.y}`).join(" ");
            parts.push(`    <polyline points="${pts}" fill="none" stroke="${stroke}" stroke-width="${sw}"${dasharray} />`);
        }
    }
    parts.push("  </g>");
    parts.push("</svg>");
    return parts.join("\n");
}
function escapeXml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function buildDiagramPrompt(description) {
    return `Generate a Mermaid diagram based on this description. Return ONLY the Mermaid syntax, no explanation or markdown fences.

Description: ${description}

Rules:
- Use "flowchart TD" for top-down flow diagrams
- Use "flowchart LR" for left-right flow diagrams
- Use descriptive node labels
- Use appropriate shapes: [rect], (round), {diamond}, ([stadium]), [[subprocess]]
- Add edge labels where meaningful
- Keep it clean and readable
- Maximum 15 nodes for clarity`;
}
const MERMAID_TEMPLATES = {
    flowchart: {
        label: "Flowchart",
        code: `flowchart TD
    A([Start]) --> B[Process Data]
    B --> C{Valid?}
    C -->|Yes| D[Save to DB]
    C -->|No| E[Show Error]
    D --> F([End])
    E --> B`
    },
    sequence: {
        label: "Sequence Diagram",
        code: `sequenceDiagram
    participant U as User
    participant S as Server
    participant DB as Database
    U->>S: Request Data
    S->>DB: Query
    DB-->>S: Results
    S-->>U: Response`
    },
    architecture: {
        label: "Architecture",
        code: `flowchart LR
    Client[Browser Client] --> API[API Gateway]
    API --> Auth[Auth Service]
    API --> Core[Core Service]
    Core --> DB[(PostgreSQL)]
    Core --> Cache[(Redis)]
    Core --> Queue[Message Queue]
    Queue --> Worker[Worker Service]`
    },
    state: {
        label: "State Machine",
        code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: fetch
    Loading --> Success: resolve
    Loading --> Error: reject
    Success --> Idle: reset
    Error --> Loading: retry
    Error --> Idle: dismiss`
    },
    er: {
        label: "ER Diagram",
        code: `erDiagram
    USER ||--o{ POST : writes
    USER ||--o{ COMMENT : makes
    POST ||--o{ COMMENT : has
    POST }o--|| CATEGORY : belongs_to
    USER {
      int id
      string name
      string email
    }
    POST {
      int id
      string title
      text content
    }`
    },
    gitgraph: {
        label: "Git Graph",
        code: `gitGraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    branch feature
    checkout feature
    commit
    checkout develop
    merge feature
    checkout main
    merge develop`
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_lib_2d6907bf._.js.map