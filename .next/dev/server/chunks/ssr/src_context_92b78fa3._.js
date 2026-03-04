module.exports = [
"[project]/src/context/SessionBrainContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EventTypes",
    ()=>EventTypes,
    "SessionBrainProvider",
    ()=>SessionBrainProvider,
    "generateDraftMarkdown",
    ()=>generateDraftMarkdown,
    "useSessionBrain",
    ()=>useSessionBrain
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
// ============================================================================
// Default Values
// ============================================================================
const createDefaultBrief = ()=>({
        problem: '',
        audience: '',
        currentWorkaround: '',
        desiredOutcome: '',
        constraints: []
    });
const createDefaultPRD = ()=>({
        goals: [],
        nonGoals: [],
        keyWorkflows: [],
        scopeMvp: [],
        risks: [],
        successMetrics: []
    });
const createDefaultPrototype = ()=>({
        screens: [],
        primaryFlow: '',
        dataInputs: [],
        notes: ''
    });
const createDefaultDesignDirection = ()=>({
        toneWords: [],
        uiDensity: 'comfortable',
        typographyNotes: '',
        componentRules: []
    });
const createDefaultDraft = ()=>({
        brief: createDefaultBrief(),
        prd: createDefaultPRD(),
        prototype: createDefaultPrototype(),
        designDirection: createDefaultDesignDirection()
    });
const generateSessionId = ()=>{
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
const createDefaultSession = ()=>({
        sessionId: generateSessionId(),
        createdAt: Date.now(),
        lastModified: Date.now(),
        draft: createDefaultDraft(),
        chatHistory: [],
        eventLog: [],
        notifications: []
    });
// ============================================================================
// Storage Keys
// ============================================================================
const STORAGE_KEY = 'openclaw_session';
const ISLAND_STATE_KEY = 'openclaw_island_state';
const EventTypes = {
    // Brief events
    BRIEF_PROBLEM_UPDATED: 'draft.brief.problem.updated',
    BRIEF_AUDIENCE_UPDATED: 'draft.brief.audience.updated',
    BRIEF_WORKAROUND_UPDATED: 'draft.brief.workaround.updated',
    BRIEF_OUTCOME_UPDATED: 'draft.brief.outcome.updated',
    BRIEF_CONSTRAINTS_UPDATED: 'draft.brief.constraints.updated',
    BRIEF_COMPLETED: 'draft.brief.completed',
    // PRD events
    PRD_GOALS_UPDATED: 'draft.prd.goals.updated',
    PRD_NONGOALS_UPDATED: 'draft.prd.nongoals.updated',
    PRD_WORKFLOWS_UPDATED: 'draft.prd.workflows.updated',
    PRD_SCOPE_UPDATED: 'draft.prd.scope.updated',
    PRD_RISKS_UPDATED: 'draft.prd.risks.updated',
    PRD_METRICS_UPDATED: 'draft.prd.metrics.updated',
    PRD_COMPLETED: 'draft.prd.completed',
    // Prototype events
    PROTOTYPE_SCREENS_UPDATED: 'draft.prototype.screens.updated',
    PROTOTYPE_FLOW_UPDATED: 'draft.prototype.flow.updated',
    PROTOTYPE_INPUTS_UPDATED: 'draft.prototype.inputs.updated',
    PROTOTYPE_NOTES_UPDATED: 'draft.prototype.notes.updated',
    // Design events
    DESIGN_DIRECTION_UPDATED: 'draft.design.updated',
    DESIGN_THEME_SELECTED: 'draft.design.theme.selected',
    // Session events
    SESSION_SAVED: 'session.saved',
    SESSION_LOADED: 'session.loaded',
    SESSION_RESET: 'session.reset',
    // Notification events
    NOTIFICATION_CREATED: 'notification.created',
    NOTIFICATION_READ: 'notification.read',
    NOTIFICATIONS_CLEARED: 'notifications.cleared'
};
function sessionReducer(state, action) {
    const now = Date.now();
    switch(action.type){
        case 'SET_SESSION':
            return action.payload;
        case 'UPDATE_BRIEF':
            return {
                ...state,
                lastModified: now,
                draft: {
                    ...state.draft,
                    brief: {
                        ...state.draft.brief,
                        ...action.payload
                    }
                }
            };
        case 'UPDATE_PRD':
            return {
                ...state,
                lastModified: now,
                draft: {
                    ...state.draft,
                    prd: {
                        ...state.draft.prd,
                        ...action.payload
                    }
                }
            };
        case 'UPDATE_PROTOTYPE':
            return {
                ...state,
                lastModified: now,
                draft: {
                    ...state.draft,
                    prototype: {
                        ...state.draft.prototype,
                        ...action.payload
                    }
                }
            };
        case 'UPDATE_DESIGN_DIRECTION':
            return {
                ...state,
                lastModified: now,
                draft: {
                    ...state.draft,
                    designDirection: {
                        ...state.draft.designDirection,
                        ...action.payload
                    }
                }
            };
        case 'ADD_EVENT':
            return {
                ...state,
                lastModified: now,
                eventLog: [
                    ...state.eventLog,
                    action.payload
                ]
            };
        case 'ADD_CHAT_MESSAGE':
            return {
                ...state,
                lastModified: now,
                chatHistory: [
                    ...state.chatHistory,
                    action.payload
                ]
            };
        case 'CLEAR_CHAT_HISTORY':
            return {
                ...state,
                lastModified: now,
                chatHistory: []
            };
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [
                    ...state.notifications,
                    action.payload
                ]
            };
        case 'MARK_NOTIFICATION_READ':
            return {
                ...state,
                notifications: state.notifications.map((n)=>n.id === action.payload ? {
                        ...n,
                        readAt: now
                    } : n)
            };
        case 'MARK_APP_NOTIFICATIONS_READ':
            return {
                ...state,
                notifications: state.notifications.map((n)=>n.appId === action.payload && !n.readAt ? {
                        ...n,
                        readAt: now
                    } : n)
            };
        case 'CLEAR_NOTIFICATIONS':
            return {
                ...state,
                notifications: []
            };
        case 'RESET_SESSION':
            return createDefaultSession();
        default:
            return state;
    }
}
const SessionBrainContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function SessionBrainProvider({ children }) {
    const [session, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReducer"])(sessionReducer, createDefaultSession());
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [islandStatus, setIslandStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        state: 'idle',
        label: 'Ready'
    });
    // Load from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                dispatch({
                    type: 'SET_SESSION',
                    payload: parsed
                });
            }
        } catch (e) {
            console.error('Failed to load session from localStorage:', e);
        }
        setIsLoaded(true);
    }, []);
    // Save to localStorage on changes (debounced)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isLoaded) return;
        const timeoutId = setTimeout(()=>{
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
            } catch (e) {
                console.error('Failed to save session to localStorage:', e);
            }
        }, 500);
        return ()=>clearTimeout(timeoutId);
    }, [
        session,
        isLoaded
    ]);
    // Dynamic Island state management
    const setIslandState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((state, label)=>{
        const labels = {
            idle: 'Ready',
            planning: 'Planning...',
            'drafting-brief': 'Drafting brief',
            'drafting-prd': 'Drafting PRD',
            'preparing-prototype': 'Preparing prototype',
            ready: 'Draft ready',
            previewing: 'Previewing'
        };
        setIslandStatus((prev)=>({
                ...prev,
                state,
                label: label || labels[state],
                previewApp: state === 'previewing' ? prev.previewApp : undefined
            }));
    }, []);
    const setIslandProgress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((current, total)=>{
        setIslandStatus((prev)=>({
                ...prev,
                progress: {
                    current,
                    total
                }
            }));
    }, []);
    const setPreviewApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((appName)=>{
        if (appName) {
            setIslandStatus({
                state: 'previewing',
                label: `Previewing ${appName}`,
                previewApp: appName
            });
        } else {
            setIslandStatus((prev)=>({
                    ...prev,
                    state: 'idle',
                    label: 'Ready',
                    previewApp: undefined
                }));
        }
    }, []);
    // Draft update functions
    const updateBrief = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((updates)=>{
        dispatch({
            type: 'UPDATE_BRIEF',
            payload: updates
        });
    }, []);
    const updatePRD = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((updates)=>{
        dispatch({
            type: 'UPDATE_PRD',
            payload: updates
        });
    }, []);
    const updatePrototype = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((updates)=>{
        dispatch({
            type: 'UPDATE_PROTOTYPE',
            payload: updates
        });
    }, []);
    const updateDesignDirection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((updates)=>{
        dispatch({
            type: 'UPDATE_DESIGN_DIRECTION',
            payload: updates
        });
    }, []);
    // Event bus
    const emitEvent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((type, payload, source = 'user')=>{
        const event = {
            id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            type,
            payload,
            timestamp: Date.now(),
            source
        };
        dispatch({
            type: 'ADD_EVENT',
            payload: event
        });
    }, []);
    // Chat history functions
    const addChatMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((role, content, metadata)=>{
        const message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            role,
            content,
            timestamp: Date.now(),
            metadata
        };
        dispatch({
            type: 'ADD_CHAT_MESSAGE',
            payload: message
        });
        return message;
    }, []);
    const clearChatHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        dispatch({
            type: 'CLEAR_CHAT_HISTORY'
        });
    }, []);
    const getChatHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        return session.chatHistory;
    }, [
        session.chatHistory
    ]);
    // Notification functions
    const addNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((appId, type, title, body)=>{
        const notification = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            appId,
            type,
            title,
            body,
            count: 1,
            createdAt: Date.now()
        };
        dispatch({
            type: 'ADD_NOTIFICATION',
            payload: notification
        });
        emitEvent(EventTypes.NOTIFICATION_CREATED, {
            appId,
            type,
            title
        });
    }, [
        emitEvent
    ]);
    const markNotificationRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        dispatch({
            type: 'MARK_NOTIFICATION_READ',
            payload: id
        });
    }, []);
    const markAppNotificationsRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((appId)=>{
        dispatch({
            type: 'MARK_APP_NOTIFICATIONS_READ',
            payload: appId
        });
    }, []);
    const clearNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        dispatch({
            type: 'CLEAR_NOTIFICATIONS'
        });
    }, []);
    const getUnreadCountForApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((appId)=>{
        return session.notifications.filter((n)=>n.appId === appId && !n.readAt).length;
    }, [
        session.notifications
    ]);
    const getTotalUnreadCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        return session.notifications.filter((n)=>!n.readAt).length;
    }, [
        session.notifications
    ]);
    // Session management
    const resetSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        dispatch({
            type: 'RESET_SESSION'
        });
        localStorage.removeItem(STORAGE_KEY);
        emitEvent(EventTypes.SESSION_RESET, {});
    }, [
        emitEvent
    ]);
    const exportDraft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const { draft } = session;
        const markdown = generateDraftMarkdown(draft);
        return markdown;
    }, [
        session
    ]);
    const importDraft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((data)=>{
        try {
            const parsed = JSON.parse(data);
            if (parsed.draft) {
                dispatch({
                    type: 'SET_SESSION',
                    payload: {
                        ...session,
                        draft: parsed.draft
                    }
                });
                return true;
            }
            return false;
        } catch  {
            return false;
        }
    }, [
        session
    ]);
    const getSavePayload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        return {
            sessionId: session.sessionId,
            draft: session.draft,
            chatHistory: session.chatHistory,
            eventLog: session.eventLog
        };
    }, [
        session
    ]);
    const loadFromSaved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((data)=>{
        dispatch({
            type: 'SET_SESSION',
            payload: {
                ...session,
                draft: data.draft,
                chatHistory: data.chatHistory || [],
                eventLog: data.eventLog || [],
                lastModified: Date.now()
            }
        });
    }, [
        session
    ]);
    const value = {
        session,
        isLoaded,
        islandStatus,
        setIslandState,
        setIslandProgress,
        setPreviewApp,
        updateBrief,
        updatePRD,
        updatePrototype,
        updateDesignDirection,
        emitEvent,
        addChatMessage,
        clearChatHistory,
        getChatHistory,
        addNotification,
        markNotificationRead,
        markAppNotificationsRead,
        clearNotifications,
        getUnreadCountForApp,
        getTotalUnreadCount,
        resetSession,
        exportDraft,
        importDraft,
        getSavePayload,
        loadFromSaved
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SessionBrainContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/SessionBrainContext.tsx",
        lineNumber: 676,
        columnNumber: 5
    }, this);
}
function useSessionBrain() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(SessionBrainContext);
    if (!context) {
        throw new Error('useSessionBrain must be used within a SessionBrainProvider');
    }
    return context;
}
// ============================================================================
// Utilities
// ============================================================================
function generateDraftMarkdown(draft) {
    const lines = [];
    lines.push('# Project Draft');
    lines.push('');
    // Brief
    lines.push('## Brief');
    lines.push('');
    if (draft.brief.problem) {
        lines.push('### Problem');
        lines.push(draft.brief.problem);
        lines.push('');
    }
    if (draft.brief.audience) {
        lines.push('### Target Audience');
        lines.push(draft.brief.audience);
        lines.push('');
    }
    if (draft.brief.currentWorkaround) {
        lines.push('### Current Workaround');
        lines.push(draft.brief.currentWorkaround);
        lines.push('');
    }
    if (draft.brief.desiredOutcome) {
        lines.push('### Desired Outcome');
        lines.push(draft.brief.desiredOutcome);
        lines.push('');
    }
    if (draft.brief.constraints.length > 0) {
        lines.push('### Constraints');
        draft.brief.constraints.forEach((c)=>lines.push(`- ${c}`));
        lines.push('');
    }
    // PRD
    lines.push('## Product Requirements');
    lines.push('');
    if (draft.prd.goals.length > 0) {
        lines.push('### Goals');
        draft.prd.goals.forEach((g)=>lines.push(`- ${g}`));
        lines.push('');
    }
    if (draft.prd.nonGoals.length > 0) {
        lines.push('### Non-Goals');
        draft.prd.nonGoals.forEach((g)=>lines.push(`- ${g}`));
        lines.push('');
    }
    if (draft.prd.keyWorkflows.length > 0) {
        lines.push('### Key Workflows');
        draft.prd.keyWorkflows.forEach((w)=>lines.push(`- ${w}`));
        lines.push('');
    }
    if (draft.prd.scopeMvp.length > 0) {
        lines.push('### MVP Scope');
        draft.prd.scopeMvp.forEach((s)=>lines.push(`- ${s}`));
        lines.push('');
    }
    if (draft.prd.risks.length > 0) {
        lines.push('### Risks');
        draft.prd.risks.forEach((r)=>lines.push(`- ${r}`));
        lines.push('');
    }
    if (draft.prd.successMetrics.length > 0) {
        lines.push('### Success Metrics');
        draft.prd.successMetrics.forEach((m)=>lines.push(`- ${m}`));
        lines.push('');
    }
    // Prototype
    lines.push('## Prototype Plan');
    lines.push('');
    if (draft.prototype.screens.length > 0) {
        lines.push('### Screens');
        draft.prototype.screens.forEach((s)=>lines.push(`- ${s}`));
        lines.push('');
    }
    if (draft.prototype.primaryFlow) {
        lines.push('### Primary Flow');
        lines.push(draft.prototype.primaryFlow);
        lines.push('');
    }
    if (draft.prototype.dataInputs.length > 0) {
        lines.push('### Data Inputs');
        draft.prototype.dataInputs.forEach((d)=>lines.push(`- ${d}`));
        lines.push('');
    }
    if (draft.prototype.notes) {
        lines.push('### Notes');
        lines.push(draft.prototype.notes);
        lines.push('');
    }
    // Design Direction
    lines.push('## Design Direction');
    lines.push('');
    if (draft.designDirection.toneWords.length > 0) {
        lines.push('### Tone');
        lines.push(draft.designDirection.toneWords.join(', '));
        lines.push('');
    }
    lines.push('### UI Density');
    lines.push(draft.designDirection.uiDensity);
    lines.push('');
    if (draft.designDirection.typographyNotes) {
        lines.push('### Typography');
        lines.push(draft.designDirection.typographyNotes);
        lines.push('');
    }
    if (draft.designDirection.componentRules.length > 0) {
        lines.push('### Component Rules');
        draft.designDirection.componentRules.forEach((r)=>lines.push(`- ${r}`));
        lines.push('');
    }
    return lines.join('\n');
}
;
}),
"[project]/src/context/AppContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APP_DEFINITIONS",
    ()=>APP_DEFINITIONS,
    "AppContextProvider",
    ()=>AppContextProvider,
    "formatAppContextForAI",
    ()=>formatAppContextForAI,
    "useAppContext",
    ()=>useAppContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/navigation.js [app-ssr] (ecmascript)");
'use client';
;
;
;
const APP_DEFINITIONS = {
    home: {
        id: 'home',
        name: 'Home',
        route: '/',
        icon: 'Home',
        description: 'OpenClaw-OS Home Screen',
        suggestedPrompts: [
            {
                label: 'Show me around',
                prompt: 'Give me a tour of what I can do here'
            },
            {
                label: 'Recent projects',
                prompt: 'What are some recent projects you\'ve worked on?'
            }
        ],
        contextHints: [
            'User is on the home screen',
            'They may want to explore apps',
            'Good opportunity to suggest navigation or highlight features'
        ]
    },
    control: {
        id: 'control',
        name: 'Control Center',
        route: '/control',
        icon: 'Cpu',
        description: 'System management and orchestration hub',
        suggestedPrompts: [
            {
                label: 'System status',
                prompt: 'Show me the current system status'
            },
            {
                label: 'Manage channels',
                prompt: 'How do I connect new integrations?'
            }
        ],
        contextHints: [
            'User is in the Control Center',
            'They want to manage infrastructure or integrations'
        ]
    },
    agents: {
        id: 'agents',
        name: 'Agents Hub',
        route: '/agents',
        icon: 'Cpu',
        description: 'Agent configuration and logic workflows',
        suggestedPrompts: [
            {
                label: 'Agent status',
                prompt: 'Which agents are currently active?'
            },
            {
                label: 'New skill',
                prompt: 'How do I add a new skill to an agent?'
            }
        ],
        contextHints: [
            'User is in the Agents Hub',
            'They want to configure agent behavior or logic'
        ]
    },
    chat: {
        id: 'chat',
        name: 'Chat',
        route: '/chat',
        icon: 'MessageSquare',
        description: 'Claw AI Chat Interface',
        suggestedPrompts: [
            {
                label: 'What can you do?',
                prompt: 'What are all the things you can help me with?'
            },
            {
                label: 'Portfolio tour',
                prompt: 'Walk me through the portfolio'
            }
        ],
        contextHints: [
            'User is in the chat app',
            'They want to have a conversation',
            'Can help with navigation, information, or scheduling'
        ]
    },
    settings: {
        id: 'settings',
        name: 'Settings',
        route: '/settings',
        icon: 'Settings',
        description: 'OS preferences and developer tools',
        suggestedPrompts: [
            {
                label: 'Change theme',
                prompt: 'How do I change the system theme?'
            },
            {
                label: 'View logs',
                prompt: 'Show me the recent system logs'
            }
        ],
        contextHints: [
            'User is in Settings',
            'They want to customize or debug the OS'
        ]
    }
};
// ============================================================================
// Context
// ============================================================================
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function AppContextProvider({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [currentApp, setCurrentAppState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Get app by route (matches route prefix)
    const getAppByRoute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((route)=>{
        // Exact match first
        const exactMatch = Object.values(APP_DEFINITIONS).find((app)=>app.route === route);
        if (exactMatch) return exactMatch;
        // Prefix match (for nested routes like /canvas/123)
        const prefixMatch = Object.values(APP_DEFINITIONS).find((app)=>app.route !== '/' && route.startsWith(app.route));
        if (prefixMatch) return prefixMatch;
        // Default to home for root
        if (route === '/') return APP_DEFINITIONS.home;
        return null;
    }, []);
    // Get app by ID
    const getAppById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        return APP_DEFINITIONS[id] || null;
    }, []);
    // Set current app manually
    const setCurrentApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((appId)=>{
        if (appId) {
            const app = getAppById(appId);
            setCurrentAppState(app);
        } else {
            setCurrentAppState(null);
        }
    }, [
        getAppById
    ]);
    // Auto-detect app from pathname
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const app = getAppByRoute(pathname);
        setCurrentAppState(app);
    }, [
        pathname,
        getAppByRoute
    ]);
    // Get suggested prompts for current app
    const suggestedPrompts = currentApp?.suggestedPrompts || APP_DEFINITIONS.home.suggestedPrompts;
    const contextHints = currentApp?.contextHints || [];
    const value = {
        currentApp,
        currentRoute: pathname,
        suggestedPrompts,
        contextHints,
        setCurrentApp,
        getAppByRoute,
        getAppById
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AppContext.tsx",
        lineNumber: 193,
        columnNumber: 5
    }, this);
}
function useAppContext() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
}
function formatAppContextForAI(appContext) {
    if (!appContext.currentApp) {
        return '';
    }
    const lines = [
        `## Current App Context`,
        `- **App**: ${appContext.currentApp.name}`,
        `- **Route**: ${appContext.currentRoute}`,
        `- **Description**: ${appContext.currentApp.description}`,
        '',
        '### Context Hints',
        ...appContext.contextHints.map((hint)=>`- ${hint}`)
    ];
    return lines.join('\n');
}
}),
"[project]/src/context/MusicContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MusicContext",
    ()=>MusicContext,
    "MusicProvider",
    ()=>MusicProvider,
    "useMusic",
    ()=>useMusic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$tracks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/tracks.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const MusicContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function MusicProvider({ children }) {
    const [currentTrack, setCurrentTrack] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$tracks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tracks"][0]);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentTime, setCurrentTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [duration, setDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isVideo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$tracks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isVideoTrack"])(currentTrack);
    // Allow components to register their video element for video tracks
    const setVideoElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((el)=>{
        videoRef.current = el;
    }, []);
    // Get the active media element (audio or video)
    const getMediaElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (isVideo && videoRef.current) {
            return videoRef.current;
        }
        return audioRef.current;
    }, [
        isVideo
    ]);
    // Audio element event listeners
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const audio = audioRef.current;
        if (!audio || isVideo) return;
        const updateTime = ()=>setCurrentTime(audio.currentTime);
        const updateDuration = ()=>setDuration(audio.duration);
        const handleEnded = ()=>{
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$tracks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNextTrack"])(currentTrack.id);
            if (next && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$tracks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tracks"].length > 1) {
                setCurrentTrack(next);
                setIsPlaying(true);
            } else {
                setIsPlaying(false);
            }
        };
        const handlePlay = ()=>setIsPlaying(true);
        const handlePause = ()=>setIsPlaying(false);
        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        return ()=>{
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, [
        currentTrack.id,
        isVideo
    ]);
    // Video element event listeners
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const video = videoRef.current;
        if (!video || !isVideo) return;
        const updateTime = ()=>setCurrentTime(video.currentTime);
        const updateDuration = ()=>setDuration(video.duration);
        const handleEnded = ()=>{
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$tracks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNextTrack"])(currentTrack.id);
            if (next && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$tracks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tracks"].length > 1) {
                setCurrentTrack(next);
                setIsPlaying(true);
            } else {
                setIsPlaying(false);
            }
        };
        const handlePlay = ()=>setIsPlaying(true);
        const handlePause = ()=>setIsPlaying(false);
        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', updateDuration);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        return ()=>{
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('loadedmetadata', updateDuration);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
        };
    }, [
        currentTrack.id,
        isVideo
    ]);
    // Handle track changes for audio
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isVideo) return;
        const audio = audioRef.current;
        if (!audio) return;
        const wasPlaying = isPlaying;
        setCurrentTime(0);
        setDuration(0);
        audio.load();
        if (wasPlaying) {
            audio.play().catch(()=>setIsPlaying(false));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentTrack.id,
        isVideo
    ]);
    // Handle track changes for video
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isVideo) return;
        const video = videoRef.current;
        if (!video) return;
        const wasPlaying = isPlaying;
        setCurrentTime(0);
        setDuration(0);
        video.load();
        if (wasPlaying) {
            video.play().catch(()=>setIsPlaying(false));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentTrack.id,
        isVideo
    ]);
    const togglePlay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const media = getMediaElement();
        if (!media) return;
        if (isPlaying) {
            media.pause();
        } else {
            media.play().catch(()=>{});
        }
    }, [
        isPlaying,
        getMediaElement
    ]);
    const pause = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const media = getMediaElement();
        if (!media) return;
        media.pause();
    }, [
        getMediaElement
    ]);
    const play = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const media = getMediaElement();
        if (!media) return;
        media.play().catch(()=>{});
    }, [
        getMediaElement
    ]);
    const skipToNext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$tracks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNextTrack"])(currentTrack.id);
        if (next) {
            setCurrentTrack(next);
        }
    }, [
        currentTrack.id
    ]);
    const skipToPrevious = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const prev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$tracks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPreviousTrack"])(currentTrack.id);
        if (prev) {
            setCurrentTrack(prev);
        }
    }, [
        currentTrack.id
    ]);
    const selectTrack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((track)=>{
        setCurrentTrack(track);
        setIsPlaying(true);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MusicContext.Provider, {
        value: {
            currentTrack,
            isPlaying,
            currentTime,
            duration,
            isVideo,
            togglePlay,
            pause,
            play,
            skipToNext,
            skipToPrevious,
            selectTrack,
            audioRef,
            videoRef,
            setVideoElement
        },
        children: [
            !isVideo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("audio", {
                ref: audioRef,
                src: currentTrack.audioSrc,
                preload: "metadata"
            }, void 0, false, {
                fileName: "[project]/src/context/MusicContext.tsx",
                lineNumber: 212,
                columnNumber: 9
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/context/MusicContext.tsx",
        lineNumber: 192,
        columnNumber: 5
    }, this);
}
function useMusic() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(MusicContext);
    if (!context) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
}
}),
"[project]/src/context/OverlayContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OverlayProvider",
    ()=>OverlayProvider,
    "useOverlay",
    ()=>useOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const OverlayContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function OverlayProvider({ children }) {
    const [activeOverlay, setActiveOverlay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('none');
    const openOverlay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((type)=>{
        setActiveOverlay(type);
    }, []);
    const closeOverlay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setActiveOverlay('none');
    }, []);
    const toggleOverlay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((type)=>{
        setActiveOverlay((current)=>current === type ? 'none' : type);
    }, []);
    const isOverlayOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((type)=>{
        return activeOverlay === type;
    }, [
        activeOverlay
    ]);
    const value = {
        activeOverlay,
        openOverlay,
        closeOverlay,
        toggleOverlay,
        isOverlayOpen
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(OverlayContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/OverlayContext.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
function useOverlay() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(OverlayContext);
    if (!context) {
        throw new Error('useOverlay must be used within an OverlayProvider');
    }
    return context;
}
}),
"[project]/src/context/DesignThemeContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DesignThemeProvider",
    ()=>DesignThemeProvider,
    "useDesignTheme",
    ()=>useDesignTheme,
    "useDesignThemeSafe",
    ()=>useDesignThemeSafe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/themes/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$definitions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/themes/definitions.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const DesignThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
const STORAGE_KEY = 'design-theme';
const DEFAULT_THEME = 'base';
function DesignThemeProvider({ children }) {
    const [designTheme, setDesignThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_THEME);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load theme from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$themes$2f$definitions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidTheme"])(stored)) {
            setDesignThemeState(stored);
        }
    }, []);
    const setDesignTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((theme)=>{
        setDesignThemeState(theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, []);
    const value = {
        designTheme,
        setDesignTheme,
        // Aliases
        theme: designTheme,
        setTheme: setDesignTheme
    };
    // Prevent hydration mismatch by not rendering theme-dependent content until mounted
    if (!mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DesignThemeContext.Provider, {
            value: {
                ...value,
                designTheme: DEFAULT_THEME,
                theme: DEFAULT_THEME
            },
            children: children
        }, void 0, false, {
            fileName: "[project]/src/context/DesignThemeContext.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DesignThemeContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/DesignThemeContext.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
function useDesignTheme() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(DesignThemeContext);
    if (!context) {
        throw new Error('useDesignTheme must be used within a DesignThemeProvider');
    }
    return context;
}
function useDesignThemeSafe() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(DesignThemeContext);
    if (!context) {
        // Return safe defaults
        return {
            designTheme: DEFAULT_THEME,
            theme: DEFAULT_THEME,
            setDesignTheme: ()=>{},
            setTheme: ()=>{}
        };
    }
    return context;
}
}),
"[project]/src/context/HomeScreenContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HomeScreenProvider",
    ()=>HomeScreenProvider,
    "defaultApps",
    ()=>defaultApps,
    "useHomeScreen",
    ()=>useHomeScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const HomeScreenContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
const STORAGE_KEY = 'openclaw_homeScreen_v17'; // v17: Hub-based restructure
const defaultApps = [
    // Hub/Main apps
    {
        id: 'control',
        name: 'Control',
        href: '/control',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'
    },
    {
        id: 'agents',
        name: 'Agents',
        href: '/agents',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
    },
    {
        id: 'settings',
        name: 'Settings',
        href: '/settings',
        gradient: 'linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%)'
    },
    {
        id: 'resources',
        name: 'Resources',
        href: 'https://docs.openclaw.io',
        gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
        external: true
    },
    {
        id: 'chat',
        name: 'Chat',
        href: '/chat',
        gradient: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
        isChat: true
    },
    // Secondary apps
    {
        id: 'browser',
        name: 'Browser',
        href: '/browser',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
    },
    {
        id: 'terminal',
        name: 'Terminal',
        href: '/terminal',
        gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
    },
    {
        id: 'canvas',
        name: 'Canvas',
        href: '/canvas',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)'
    },
    {
        id: 'notes',
        name: 'Notes',
        href: '/notes',
        gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
    },
    {
        id: 'calendar',
        name: 'Calendar',
        href: '/calendar',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)'
    },
    {
        id: 'vault',
        name: 'Vault',
        href: '/vault',
        gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    },
    {
        id: 'wiki',
        name: 'Wiki',
        href: '/wiki',
        gradient: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'
    },
    // Groups/Folders contents
    {
        id: 'projects',
        name: 'Projects',
        href: '/projects',
        gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)'
    },
    {
        id: 'product',
        name: 'Product',
        href: '/product',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'
    },
    {
        id: 'prototyping',
        name: 'Prototyping',
        href: '/prototyping',
        gradient: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)'
    },
    {
        id: 'mockit',
        name: 'Mockit',
        href: '/mockit',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
    },
    {
        id: 'photos',
        name: 'Photos',
        href: '/photos',
        gradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)'
    },
    {
        id: '3d-gallery',
        name: '3-D',
        href: '/gallery-3d',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
    },
    {
        id: 'games',
        name: 'Games',
        href: '/games',
        gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
    },
    {
        id: 'weather',
        name: 'Weather',
        href: '/weather',
        gradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)'
    },
    {
        id: 'security',
        name: 'Security',
        href: '/security',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)'
    },
    {
        id: 'skills',
        name: 'Skills',
        href: '/skills',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
    },
    {
        id: 'updates',
        name: 'Updates',
        href: '/updates',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
    },
    {
        id: 'humans',
        name: 'Humans',
        href: '/humans',
        gradient: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)'
    },
    {
        id: 'contacts',
        name: 'Contacts',
        href: '/contacts',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
    }
];
const getAppById = (id)=>defaultApps.find((app)=>app.id === id);
const createFolderGridItem = (id, name, appIds)=>({
        type: 'folder',
        item: {
            id,
            name,
            apps: appIds.map((appId)=>getAppById(appId)).filter((app)=>app !== undefined)
        }
    });
const createAppGridItem = (id)=>{
    const app = getAppById(id);
    return app ? {
        type: 'app',
        item: app
    } : null;
};
// Default grid with Hub-based layout
const createDefaultGridItems = ()=>{
    const items = [
        // ========== ROW 1: HUBS ==========
        createAppGridItem('control'),
        createAppGridItem('agents'),
        createAppGridItem('settings'),
        createAppGridItem('resources'),
        // ========== ROW 2: CORE TOOLS ==========
        createAppGridItem('chat'),
        createAppGridItem('browser'),
        createAppGridItem('terminal'),
        createAppGridItem('canvas'),
        // ========== ROW 3: UTILITIES & FOLDERS ==========
        createAppGridItem('notes'),
        createAppGridItem('calendar'),
        createFolderGridItem('folder-dev', 'Dev', [
            'projects',
            'product',
            'prototyping',
            'mockit'
        ]),
        createFolderGridItem('folder-more', 'More', [
            'photos',
            '3d-gallery',
            'games',
            'weather',
            'security',
            'vault',
            'wiki',
            'skills',
            'updates',
            'humans',
            'contacts'
        ])
    ];
    return items.filter((item)=>item !== null);
};
const defaultGridItems = createDefaultGridItems();
function HomeScreenProvider({ children }) {
    const [gridItems, setGridItemsState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultGridItems);
    const [isEditMode, setIsEditMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [openFolderId, setOpenFolderId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dragState, setDragState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        isDragging: false,
        draggedItem: null,
        draggedIndex: null,
        dropTargetIndex: null,
        dragOffset: {
            x: 0,
            y: 0
        },
        dragPosition: {
            x: 0,
            y: 0
        }
    });
    // Load from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Restore icons to grid items (icons are React elements and can't be serialized)
                const restored = parsed.map((item)=>{
                    if (item.type === 'app') {
                        const defaultApp = defaultApps.find((a)=>a.id === item.item.id);
                        return {
                            ...item,
                            item: {
                                ...item.item,
                                icon: defaultApp?.icon
                            }
                        };
                    } else {
                        return {
                            ...item,
                            item: {
                                ...item.item,
                                apps: item.item.apps.map((app)=>{
                                    const defaultApp = defaultApps.find((a)=>a.id === app.id);
                                    return {
                                        ...app,
                                        icon: defaultApp?.icon
                                    };
                                })
                            }
                        };
                    }
                });
                setGridItemsState(restored);
            }
        } catch (e) {
            console.error('Failed to load home screen state:', e);
        }
    }, []);
    // Save to localStorage when gridItems changes
    const setGridItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((items)=>{
        setGridItemsState(items);
        try {
            // Strip out icon React elements before saving (they can't be serialized)
            const toSave = items.map((item)=>{
                if (item.type === 'app') {
                    const { icon, ...rest } = item.item;
                    return {
                        type: 'app',
                        item: rest
                    };
                } else {
                    return {
                        type: 'folder',
                        item: {
                            ...item.item,
                            apps: item.item.apps.map(({ icon, ...rest })=>rest)
                        }
                    };
                }
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        } catch (e) {
            console.error('Failed to save home screen state:', e);
        }
    }, []);
    // Edit mode
    const enterEditMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setIsEditMode(true), []);
    const exitEditMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsEditMode(false);
        setDragState((prev)=>({
                ...prev,
                isDragging: false,
                draggedItem: null,
                draggedIndex: null,
                dropTargetIndex: null
            }));
    }, []);
    // Drag operations
    const startDrag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((item, index, offset)=>{
        setDragState({
            isDragging: true,
            draggedItem: item,
            draggedIndex: index,
            dropTargetIndex: null,
            dragOffset: offset,
            dragPosition: {
                x: 0,
                y: 0
            }
        });
    }, []);
    const updateDragPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((position)=>{
        setDragState((prev)=>({
                ...prev,
                dragPosition: position
            }));
    }, []);
    const setDropTarget = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((index)=>{
        setDragState((prev)=>({
                ...prev,
                dropTargetIndex: index
            }));
    }, []);
    const endDrag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const { draggedIndex, dropTargetIndex } = dragState;
        if (draggedIndex !== null && dropTargetIndex !== null && draggedIndex !== dropTargetIndex) {
            const sourceItem = gridItems[draggedIndex];
            const targetItem = gridItems[dropTargetIndex];
            // Check if we should create a folder (both are apps)
            if (sourceItem.type === 'app' && targetItem.type === 'app') {
                // Create folder with both apps
                const newFolder = {
                    id: `folder_${Date.now()}`,
                    name: 'New Folder',
                    apps: [
                        targetItem.item,
                        sourceItem.item
                    ]
                };
                const newItems = [
                    ...gridItems
                ];
                // Replace target with folder
                newItems[dropTargetIndex] = {
                    type: 'folder',
                    item: newFolder
                };
                // Remove dragged item
                newItems.splice(draggedIndex > dropTargetIndex ? draggedIndex : draggedIndex, 1);
                setGridItems(newItems);
            } else if (sourceItem.type === 'app' && targetItem.type === 'folder') {
                // Add app to existing folder
                const newItems = [
                    ...gridItems
                ];
                const folder = {
                    ...targetItem.item
                };
                folder.apps = [
                    ...folder.apps,
                    sourceItem.item
                ];
                newItems[dropTargetIndex] = {
                    type: 'folder',
                    item: folder
                };
                newItems.splice(draggedIndex > dropTargetIndex ? draggedIndex : draggedIndex, 1);
                setGridItems(newItems);
            } else {
                // Just reorder
                reorderItems(draggedIndex, dropTargetIndex);
            }
        }
        setDragState({
            isDragging: false,
            draggedItem: null,
            draggedIndex: null,
            dropTargetIndex: null,
            dragOffset: {
                x: 0,
                y: 0
            },
            dragPosition: {
                x: 0,
                y: 0
            }
        });
    }, [
        dragState,
        gridItems,
        setGridItems
    ]);
    // Folder operations
    const createFolder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((appIndex1, appIndex2, folderName = 'New Folder')=>{
        const item1 = gridItems[appIndex1];
        const item2 = gridItems[appIndex2];
        if (item1.type !== 'app' || item2.type !== 'app') return;
        const newFolder = {
            id: `folder_${Date.now()}`,
            name: folderName,
            apps: [
                item1.item,
                item2.item
            ]
        };
        const newItems = gridItems.filter((_, i)=>i !== appIndex1 && i !== appIndex2);
        const insertIndex = Math.min(appIndex1, appIndex2);
        newItems.splice(insertIndex, 0, {
            type: 'folder',
            item: newFolder
        });
        setGridItems(newItems);
    }, [
        gridItems,
        setGridItems
    ]);
    const addToFolder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((appIndex, folderIndex)=>{
        const appItem = gridItems[appIndex];
        const folderItem = gridItems[folderIndex];
        if (appItem.type !== 'app' || folderItem.type !== 'folder') return;
        const newItems = [
            ...gridItems
        ];
        const folder = {
            ...folderItem.item
        };
        folder.apps = [
            ...folder.apps,
            appItem.item
        ];
        newItems[folderIndex] = {
            type: 'folder',
            item: folder
        };
        newItems.splice(appIndex, 1);
        setGridItems(newItems);
    }, [
        gridItems,
        setGridItems
    ]);
    const removeFromFolder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((folderId, appId)=>{
        const folderIndex = gridItems.findIndex((item)=>item.type === 'folder' && item.item.id === folderId);
        if (folderIndex === -1) return;
        const folder = gridItems[folderIndex];
        const appToRemove = folder.item.apps.find((app)=>app.id === appId);
        if (!appToRemove) return;
        const newItems = [
            ...gridItems
        ];
        const remainingApps = folder.item.apps.filter((app)=>app.id !== appId);
        if (remainingApps.length === 0) {
            // Remove empty folder
            newItems.splice(folderIndex, 1);
        } else if (remainingApps.length === 1) {
            // Convert folder back to single app
            newItems[folderIndex] = {
                type: 'app',
                item: remainingApps[0]
            };
        } else {
            // Update folder
            newItems[folderIndex] = {
                type: 'folder',
                item: {
                    ...folder.item,
                    apps: remainingApps
                }
            };
        }
        // Add removed app after the folder position
        newItems.splice(folderIndex + 1, 0, {
            type: 'app',
            item: appToRemove
        });
        setGridItems(newItems);
    }, [
        gridItems,
        setGridItems
    ]);
    const renameFolder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((folderId, newName)=>{
        const newItems = gridItems.map((item)=>{
            if (item.type === 'folder' && item.item.id === folderId) {
                return {
                    ...item,
                    item: {
                        ...item.item,
                        name: newName
                    }
                };
            }
            return item;
        });
        setGridItems(newItems);
    }, [
        gridItems,
        setGridItems
    ]);
    // Open folder
    const openFolder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((folderId)=>{
        setOpenFolderId(folderId);
    }, []);
    const closeFolder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setOpenFolderId(null);
    }, []);
    // Reordering
    const reorderItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((fromIndex, toIndex)=>{
        const newItems = [
            ...gridItems
        ];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        setGridItems(newItems);
    }, [
        gridItems,
        setGridItems
    ]);
    // Reset
    const resetToDefault = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const newDefaults = createDefaultGridItems();
        setGridItems(newDefaults);
        localStorage.removeItem(STORAGE_KEY);
    }, [
        setGridItems
    ]);
    const value = {
        gridItems,
        setGridItems,
        isEditMode,
        enterEditMode,
        exitEditMode,
        dragState,
        startDrag,
        updateDragPosition,
        setDropTarget,
        endDrag,
        createFolder,
        addToFolder,
        removeFromFolder,
        renameFolder,
        openFolderId,
        openFolder,
        closeFolder,
        reorderItems,
        resetToDefault
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HomeScreenContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/HomeScreenContext.tsx",
        lineNumber: 437,
        columnNumber: 5
    }, this);
}
function useHomeScreen() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(HomeScreenContext);
    if (!context) {
        throw new Error('useHomeScreen must be used within a HomeScreenProvider');
    }
    return context;
}
}),
"[project]/src/context/ProjectContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProjectProvider",
    ()=>ProjectProvider,
    "useOpenClawSession",
    ()=>useOpenClawSession,
    "useProject",
    ()=>useProject
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * ProjectContext - Multi-Project Support
 *
 * Manages projects as contexts within Claw AI OS.
 * Each project contains its own:
 * - Kanban board
 * - Threads
 * - PRDs and artifacts
 * - Design direction
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
// ============================================================================
// Default Values
// ============================================================================
const OPENCLAW_OS_PROJECT = {
    id: 'openclaw-os',
    name: 'OpenClaw-OS',
    description: 'The AI-Native Operating System ecosystem.',
    status: 'active',
    color: '#8b5cf6',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    artifacts: [],
    threads: [],
    tasks: [],
    settings: {
        defaultView: 'kanban',
        showCompleted: false
    }
};
const createDefaultState = ()=>({
        projects: [
            OPENCLAW_OS_PROJECT
        ],
        activeProjectId: 'openclaw-os',
        isLoaded: false
    });
// ============================================================================
// Storage
// ============================================================================
const STORAGE_KEY = 'openclaw_projects';
function generateId() {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
function projectReducer(state, action) {
    const now = Date.now();
    switch(action.type){
        case 'SET_STATE':
            return {
                ...action.payload,
                isLoaded: true
            };
        case 'SET_LOADED':
            return {
                ...state,
                isLoaded: true
            };
        case 'SET_ACTIVE_PROJECT':
            return {
                ...state,
                activeProjectId: action.payload
            };
        case 'CREATE_PROJECT':
            {
                const newProject = {
                    ...action.payload,
                    id: generateId(),
                    createdAt: now,
                    updatedAt: now,
                    artifacts: [],
                    threads: [],
                    tasks: [],
                    settings: {
                        defaultView: 'kanban',
                        showCompleted: false
                    }
                };
                return {
                    ...state,
                    projects: [
                        ...state.projects,
                        newProject
                    ],
                    activeProjectId: newProject.id
                };
            }
        case 'UPDATE_PROJECT':
            return {
                ...state,
                projects: state.projects.map((p)=>p.id === action.payload.id ? {
                        ...p,
                        ...action.payload.updates,
                        updatedAt: now
                    } : p)
            };
        case 'ARCHIVE_PROJECT':
            return {
                ...state,
                projects: state.projects.map((p)=>p.id === action.payload ? {
                        ...p,
                        status: 'archived',
                        updatedAt: now
                    } : p),
                activeProjectId: state.activeProjectId === action.payload ? state.projects.find((p)=>p.id !== action.payload && p.status === 'active')?.id || null : state.activeProjectId
            };
        case 'DELETE_PROJECT':
            // Prevent deleting Claw AI OS
            if (action.payload === 'openclaw-os') return state;
            return {
                ...state,
                projects: state.projects.filter((p)=>p.id !== action.payload),
                activeProjectId: state.activeProjectId === action.payload ? state.projects.find((p)=>p.id !== action.payload)?.id || null : state.activeProjectId
            };
        case 'ADD_ARTIFACT':
            {
                const { projectId, artifact } = action.payload;
                const newArtifact = {
                    ...artifact,
                    id: generateId(),
                    version: 1,
                    createdAt: now,
                    updatedAt: now
                };
                return {
                    ...state,
                    projects: state.projects.map((p)=>p.id === projectId ? {
                            ...p,
                            artifacts: [
                                ...p.artifacts,
                                newArtifact
                            ],
                            updatedAt: now
                        } : p)
                };
            }
        case 'UPDATE_ARTIFACT':
            {
                const { projectId, artifactId, updates } = action.payload;
                return {
                    ...state,
                    projects: state.projects.map((p)=>p.id === projectId ? {
                            ...p,
                            artifacts: p.artifacts.map((a)=>a.id === artifactId ? {
                                    ...a,
                                    ...updates,
                                    version: a.version + 1,
                                    updatedAt: now
                                } : a),
                            updatedAt: now
                        } : p)
                };
            }
        case 'DELETE_ARTIFACT':
            {
                const { projectId, artifactId } = action.payload;
                return {
                    ...state,
                    projects: state.projects.map((p)=>p.id === projectId ? {
                            ...p,
                            artifacts: p.artifacts.filter((a)=>a.id !== artifactId),
                            updatedAt: now
                        } : p)
                };
            }
        case 'ADD_TASK':
            {
                const { projectId, task } = action.payload;
                const newTask = {
                    ...task,
                    id: generateId(),
                    createdAt: now,
                    updatedAt: now
                };
                return {
                    ...state,
                    projects: state.projects.map((p)=>p.id === projectId ? {
                            ...p,
                            tasks: [
                                ...p.tasks,
                                newTask
                            ],
                            updatedAt: now
                        } : p)
                };
            }
        case 'UPDATE_TASK':
            {
                const { projectId, taskId, updates } = action.payload;
                return {
                    ...state,
                    projects: state.projects.map((p)=>p.id === projectId ? {
                            ...p,
                            tasks: p.tasks.map((t)=>t.id === taskId ? {
                                    ...t,
                                    ...updates,
                                    updatedAt: now
                                } : t),
                            updatedAt: now
                        } : p)
                };
            }
        case 'DELETE_TASK':
            {
                const { projectId, taskId } = action.payload;
                return {
                    ...state,
                    projects: state.projects.map((p)=>p.id === projectId ? {
                            ...p,
                            tasks: p.tasks.filter((t)=>t.id !== taskId),
                            updatedAt: now
                        } : p)
                };
            }
        case 'MOVE_TASK':
            {
                const { projectId, taskId, status } = action.payload;
                return {
                    ...state,
                    projects: state.projects.map((p)=>p.id === projectId ? {
                            ...p,
                            tasks: p.tasks.map((t)=>t.id === taskId ? {
                                    ...t,
                                    status,
                                    updatedAt: now
                                } : t),
                            updatedAt: now
                        } : p)
                };
            }
        default:
            return state;
    }
}
function useOpenClawSession() {
    const { activeProjectId, setActiveProject } = useProject();
    return {
        activeProjectId,
        setActiveProject,
        // Shims for Convex compatibility if needed
        activeConvexProjectId: activeProjectId,
        activeConvexProjectSlug: activeProjectId,
        setActiveConvexProject: setActiveProject
    };
}
const ProjectContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function ProjectProvider({ children }) {
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReducer"])(projectReducer, createDefaultState());
    // Load from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure Claw AI OS project exists
                const currentProjects = parsed.projects || [];
                const hasOpenClawOS = currentProjects.some((p)=>p.id === 'openclaw-os');
                if (!hasOpenClawOS) {
                    parsed.projects = [
                        OPENCLAW_OS_PROJECT,
                        ...currentProjects
                    ];
                }
                dispatch({
                    type: 'SET_STATE',
                    payload: parsed
                });
            } else {
                dispatch({
                    type: 'SET_LOADED'
                });
            }
        } catch (e) {
            console.error('Failed to load projects from localStorage:', e);
            dispatch({
                type: 'SET_LOADED'
            });
        }
    }, []);
    // Save to localStorage on changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!state.isLoaded) return;
        const timeoutId = setTimeout(()=>{
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            } catch (e) {
                console.error('Failed to save projects to localStorage:', e);
            }
        }, 500);
        return ()=>clearTimeout(timeoutId);
    }, [
        state
    ]);
    // Project operations
    const setActiveProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        dispatch({
            type: 'SET_ACTIVE_PROJECT',
            payload: id
        });
    }, []);
    const createProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((data)=>{
        dispatch({
            type: 'CREATE_PROJECT',
            payload: {
                ...data,
                status: 'active'
            }
        });
    }, []);
    const updateProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id, updates)=>{
        dispatch({
            type: 'UPDATE_PROJECT',
            payload: {
                id,
                updates
            }
        });
    }, []);
    const archiveProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        dispatch({
            type: 'ARCHIVE_PROJECT',
            payload: id
        });
    }, []);
    const deleteProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        dispatch({
            type: 'DELETE_PROJECT',
            payload: id
        });
    }, []);
    // Artifact operations
    const addArtifact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((projectId, artifact)=>{
        dispatch({
            type: 'ADD_ARTIFACT',
            payload: {
                projectId,
                artifact
            }
        });
    }, []);
    const updateArtifact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((projectId, artifactId, updates)=>{
        dispatch({
            type: 'UPDATE_ARTIFACT',
            payload: {
                projectId,
                artifactId,
                updates
            }
        });
    }, []);
    const deleteArtifact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((projectId, artifactId)=>{
        dispatch({
            type: 'DELETE_ARTIFACT',
            payload: {
                projectId,
                artifactId
            }
        });
    }, []);
    const getArtifacts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((projectId)=>{
        const id = projectId || state.activeProjectId;
        const project = state.projects.find((p)=>p.id === id);
        return project?.artifacts || [];
    }, [
        state.projects,
        state.activeProjectId
    ]);
    // Task operations
    const addTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((projectId, task)=>{
        dispatch({
            type: 'ADD_TASK',
            payload: {
                projectId,
                task
            }
        });
    }, []);
    const updateTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((projectId, taskId, updates)=>{
        dispatch({
            type: 'UPDATE_TASK',
            payload: {
                projectId,
                taskId,
                updates
            }
        });
    }, []);
    const deleteTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((projectId, taskId)=>{
        dispatch({
            type: 'DELETE_TASK',
            payload: {
                projectId,
                taskId
            }
        });
    }, []);
    const moveTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((projectId, taskId, status)=>{
        dispatch({
            type: 'MOVE_TASK',
            payload: {
                projectId,
                taskId,
                status
            }
        });
    }, []);
    const getTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((projectId)=>{
        const id = projectId || state.activeProjectId;
        const project = state.projects.find((p)=>p.id === id);
        return project?.tasks || [];
    }, [
        state.projects,
        state.activeProjectId
    ]);
    // Helpers
    const getActiveProjects = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        return state.projects.filter((p)=>p.status === 'active');
    }, [
        state.projects
    ]);
    const getArchivedProjects = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        return state.projects.filter((p)=>p.status === 'archived');
    }, [
        state.projects
    ]);
    const activeProject = state.projects.find((p)=>p.id === state.activeProjectId) || null;
    const value = {
        projects: state.projects,
        activeProject,
        activeProjectId: state.activeProjectId,
        isLoaded: state.isLoaded,
        setActiveProject,
        createProject,
        updateProject,
        archiveProject,
        deleteProject,
        addArtifact,
        updateArtifact,
        deleteArtifact,
        getArtifacts,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        getTasks,
        getActiveProjects,
        getArchivedProjects
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ProjectContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/ProjectContext.tsx",
        lineNumber: 534,
        columnNumber: 5
    }, this);
}
function useProject() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ProjectContext);
    if (!context) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
} // End of Project Context
}),
"[project]/src/context/ControlCenterContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ControlCenterProvider",
    ()=>ControlCenterProvider,
    "useControlCenter",
    ()=>useControlCenter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const ControlCenterContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function useControlCenter() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ControlCenterContext);
    if (!context) {
        throw new Error('useControlCenter must be used within ControlCenterProvider');
    }
    return context;
}
function ControlCenterProvider({ children }) {
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setIsOpen(true), []);
    const close = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setIsOpen(false), []);
    const toggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setIsOpen((prev)=>!prev), []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ControlCenterContext.Provider, {
        value: {
            isOpen,
            open,
            close,
            toggle
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/ControlCenterContext.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/context/CanvasContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CanvasProvider",
    ()=>CanvasProvider,
    "useCanvasContext",
    ()=>useCanvasContext,
    "useCanvasContextOptional",
    ()=>useCanvasContextOptional
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * CanvasContext - Provides global access to canvas state and AI control
 *
 * Allows Claw AI to control the canvas from:
 * - Voice input on the canvas page
 * - Chat popup from the dock
 * - Main chat page
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.2_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$canvas$2d$tools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/claw-ai/canvas-tools.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/canvas/grid-system.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const CanvasContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function CanvasProvider({ children }) {
    const [canvasState, setCanvasStateInternal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeCanvasId, setActiveCanvasId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Ref for the executor so it has access to latest state
    const executorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Update executor when state changes
    const setCanvasState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((state)=>{
        setCanvasStateInternal(state);
        // Update executor's state getter
        if (executorRef.current) {
            executorRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$canvas$2d$tools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasToolExecutor"]({
                getCanvasState: ()=>state,
                setCanvasState: (newState)=>setCanvasStateInternal(newState)
            });
        }
    }, []);
    // Register a canvas (when canvas page mounts)
    const registerCanvas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((canvasId, initialState)=>{
        setActiveCanvasId(canvasId);
        setCanvasStateInternal(initialState);
        executorRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$canvas$2d$tools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasToolExecutor"]({
            getCanvasState: ()=>initialState,
            setCanvasState: (newState)=>setCanvasStateInternal(newState)
        });
    }, []);
    // Unregister canvas (when canvas page unmounts)
    const unregisterCanvas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setActiveCanvasId(null);
        setCanvasStateInternal(null);
        executorRef.current = null;
    }, []);
    // Execute a canvas tool
    const executeCanvasTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (toolName, params)=>{
        if (!executorRef.current || !canvasState) {
            return {
                success: false,
                message: 'No canvas is currently active. Please open a canvas first.'
            };
        }
        // Update executor with latest state before execution
        executorRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$canvas$2d$tools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasToolExecutor"]({
            getCanvasState: ()=>canvasState,
            setCanvasState: (newState)=>setCanvasStateInternal(newState)
        });
        return executorRef.current.execute(toolName, params);
    }, [
        canvasState
    ]);
    // Get canvas context for AI system prompt
    const getCanvasContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!canvasState) {
            return 'No canvas is currently active.';
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$claw$2d$ai$2f$canvas$2d$tools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateCanvasContext"])(canvasState);
    }, [
        canvasState
    ]);
    // Describe current canvas state
    const describeCurrentCanvas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!canvasState) {
            return 'No canvas is currently active.';
        }
        const description = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$canvas$2f$grid$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["describeCanvas"])(canvasState.nodes, canvasState.edges);
        return description.spatialLayout;
    }, [
        canvasState
    ]);
    // Helper: Add a mindmap branch
    const addMindmapBranch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (parentId, content, direction)=>{
        return executeCanvasTool('create_mindmap_branch', {
            parentNodeId: parentId,
            content,
            direction
        });
    }, [
        executeCanvasTool
    ]);
    // Helper: Expand mindmap with multiple branches
    const expandMindmap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (centerContent, branches)=>{
        if (!canvasState) {
            return [
                {
                    success: false,
                    message: 'No canvas active'
                }
            ];
        }
        const results = [];
        // Create center node if not exists
        let centerNodeId;
        const existingCenter = canvasState.nodes.find((n)=>n.content.toLowerCase().includes(centerContent.toLowerCase()));
        if (existingCenter) {
            centerNodeId = existingCenter.id;
        } else {
            const createResult = await executeCanvasTool('create_node', {
                type: 'mindmap',
                position: 'E5',
                content: centerContent,
                color: 'purple'
            });
            results.push(createResult);
            if (!createResult.success) return results;
            centerNodeId = createResult.data.nodeId;
        }
        // Add branches in different directions
        const directions = [
            'right',
            'below-right',
            'below',
            'below-left',
            'left',
            'above-left',
            'above',
            'above-right'
        ];
        for(let i = 0; i < branches.length; i++){
            const direction = directions[i % directions.length];
            const result = await addMindmapBranch(centerNodeId, branches[i], direction);
            results.push(result);
        }
        return results;
    }, [
        canvasState,
        executeCanvasTool,
        addMindmapBranch
    ]);
    const value = {
        canvasState,
        isCanvasActive: canvasState !== null,
        activeCanvasId,
        setCanvasState,
        registerCanvas,
        unregisterCanvas,
        executeCanvasTool,
        getCanvasContext,
        describeCurrentCanvas,
        addMindmapBranch,
        expandMindmap
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CanvasContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/CanvasContext.tsx",
        lineNumber: 197,
        columnNumber: 5
    }, this);
}
function useCanvasContext() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(CanvasContext);
    if (!context) {
        throw new Error('useCanvasContext must be used within a CanvasProvider');
    }
    return context;
}
function useCanvasContextOptional() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$2_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(CanvasContext);
}
}),
];

//# sourceMappingURL=src_context_92b78fa3._.js.map