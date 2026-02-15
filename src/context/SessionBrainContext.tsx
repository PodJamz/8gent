'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useReducer,
  ReactNode,
} from 'react';

// ============================================================================
// Types
// ============================================================================

export interface Brief {
  problem: string;
  audience: string;
  currentWorkaround: string;
  desiredOutcome: string;
  constraints: string[];
}

export interface PRD {
  goals: string[];
  nonGoals: string[];
  keyWorkflows: string[];
  scopeMvp: string[];
  risks: string[];
  successMetrics: string[];
}

export interface Prototype {
  screens: string[];
  primaryFlow: string;
  dataInputs: string[];
  notes: string;
}

export interface DesignDirection {
  toneWords: string[];
  uiDensity: 'compact' | 'comfortable' | 'spacious';
  typographyNotes: string;
  componentRules: string[];
  selectedTheme?: string;
}

export interface Draft {
  brief: Brief;
  prd: PRD;
  prototype: Prototype;
  designDirection: DesignDirection;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    model?: string;
    tokens?: number;
    draftUpdates?: string[]; // Which draft fields were updated by this message
  };
}

export interface SessionEvent {
  id: string;
  type: string;
  payload: unknown;
  timestamp: number;
  source: 'user' | 'ai';
}

export interface Notification {
  id: string;
  appId: string;
  type: 'update' | 'complete' | 'suggestion' | 'reminder';
  title: string;
  body?: string;
  count: number;
  createdAt: number;
  readAt?: number;
}

export interface SessionState {
  sessionId: string;
  createdAt: number;
  lastModified: number;
  draft: Draft;
  chatHistory: ChatMessage[];
  eventLog: SessionEvent[];
  notifications: Notification[];
}

export type DynamicIslandState =
  | 'idle'
  | 'planning'
  | 'drafting-brief'
  | 'drafting-prd'
  | 'preparing-prototype'
  | 'ready'
  | 'previewing';

export interface DynamicIslandStatus {
  state: DynamicIslandState;
  label: string;
  progress?: { current: number; total: number };
  previewApp?: string;
}

// ============================================================================
// Default Values
// ============================================================================

const createDefaultBrief = (): Brief => ({
  problem: '',
  audience: '',
  currentWorkaround: '',
  desiredOutcome: '',
  constraints: [],
});

const createDefaultPRD = (): PRD => ({
  goals: [],
  nonGoals: [],
  keyWorkflows: [],
  scopeMvp: [],
  risks: [],
  successMetrics: [],
});

const createDefaultPrototype = (): Prototype => ({
  screens: [],
  primaryFlow: '',
  dataInputs: [],
  notes: '',
});

const createDefaultDesignDirection = (): DesignDirection => ({
  toneWords: [],
  uiDensity: 'comfortable',
  typographyNotes: '',
  componentRules: [],
});

const createDefaultDraft = (): Draft => ({
  brief: createDefaultBrief(),
  prd: createDefaultPRD(),
  prototype: createDefaultPrototype(),
  designDirection: createDefaultDesignDirection(),
});

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

const createDefaultSession = (): SessionState => ({
  sessionId: generateSessionId(),
  createdAt: Date.now(),
  lastModified: Date.now(),
  draft: createDefaultDraft(),
  chatHistory: [],
  eventLog: [],
  notifications: [],
});

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEY = 'openclaw_session';
const ISLAND_STATE_KEY = 'openclaw_island_state';

// ============================================================================
// Event Types
// ============================================================================

export const EventTypes = {
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
  NOTIFICATIONS_CLEARED: 'notifications.cleared',
} as const;

// ============================================================================
// Reducer
// ============================================================================

type SessionAction =
  | { type: 'SET_SESSION'; payload: SessionState }
  | { type: 'UPDATE_BRIEF'; payload: Partial<Brief> }
  | { type: 'UPDATE_PRD'; payload: Partial<PRD> }
  | { type: 'UPDATE_PROTOTYPE'; payload: Partial<Prototype> }
  | { type: 'UPDATE_DESIGN_DIRECTION'; payload: Partial<DesignDirection> }
  | { type: 'ADD_EVENT'; payload: SessionEvent }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'CLEAR_CHAT_HISTORY' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_APP_NOTIFICATIONS_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'RESET_SESSION' };

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  const now = Date.now();

  switch (action.type) {
    case 'SET_SESSION':
      return action.payload;

    case 'UPDATE_BRIEF':
      return {
        ...state,
        lastModified: now,
        draft: {
          ...state.draft,
          brief: { ...state.draft.brief, ...action.payload },
        },
      };

    case 'UPDATE_PRD':
      return {
        ...state,
        lastModified: now,
        draft: {
          ...state.draft,
          prd: { ...state.draft.prd, ...action.payload },
        },
      };

    case 'UPDATE_PROTOTYPE':
      return {
        ...state,
        lastModified: now,
        draft: {
          ...state.draft,
          prototype: { ...state.draft.prototype, ...action.payload },
        },
      };

    case 'UPDATE_DESIGN_DIRECTION':
      return {
        ...state,
        lastModified: now,
        draft: {
          ...state.draft,
          designDirection: { ...state.draft.designDirection, ...action.payload },
        },
      };

    case 'ADD_EVENT':
      return {
        ...state,
        lastModified: now,
        eventLog: [...state.eventLog, action.payload],
      };

    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        lastModified: now,
        chatHistory: [...state.chatHistory, action.payload],
      };

    case 'CLEAR_CHAT_HISTORY':
      return {
        ...state,
        lastModified: now,
        chatHistory: [],
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, readAt: now } : n
        ),
      };

    case 'MARK_APP_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.appId === action.payload && !n.readAt ? { ...n, readAt: now } : n
        ),
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    case 'RESET_SESSION':
      return createDefaultSession();

    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

interface SessionBrainContextValue {
  // State
  session: SessionState;
  isLoaded: boolean;

  // Dynamic Island
  islandStatus: DynamicIslandStatus;
  setIslandState: (state: DynamicIslandState, label?: string) => void;
  setIslandProgress: (current: number, total: number) => void;
  setPreviewApp: (appName: string | null) => void;

  // Draft updates
  updateBrief: (updates: Partial<Brief>) => void;
  updatePRD: (updates: Partial<PRD>) => void;
  updatePrototype: (updates: Partial<Prototype>) => void;
  updateDesignDirection: (updates: Partial<DesignDirection>) => void;

  // Event bus
  emitEvent: (type: string, payload: unknown, source?: 'user' | 'ai') => void;

  // Chat history
  addChatMessage: (
    role: ChatMessage['role'],
    content: string,
    metadata?: ChatMessage['metadata']
  ) => ChatMessage;
  clearChatHistory: () => void;
  getChatHistory: () => ChatMessage[];

  // Notifications
  addNotification: (
    appId: string,
    type: Notification['type'],
    title: string,
    body?: string
  ) => void;
  markNotificationRead: (id: string) => void;
  markAppNotificationsRead: (appId: string) => void;
  clearNotifications: () => void;
  getUnreadCountForApp: (appId: string) => number;
  getTotalUnreadCount: () => number;

  // Session management
  resetSession: () => void;
  exportDraft: () => string;
  importDraft: (data: string) => boolean;

  // Save/Load
  getSavePayload: () => {
    sessionId: string;
    draft: Draft;
    chatHistory: ChatMessage[];
    eventLog: SessionEvent[];
  };
  loadFromSaved: (data: {
    draft: Draft;
    chatHistory?: ChatMessage[];
    eventLog?: SessionEvent[];
  }) => void;
}

const SessionBrainContext = createContext<SessionBrainContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface SessionBrainProviderProps {
  children: ReactNode;
}

export function SessionBrainProvider({ children }: SessionBrainProviderProps) {
  const [session, dispatch] = useReducer(sessionReducer, createDefaultSession());
  const [isLoaded, setIsLoaded] = useState(false);
  const [islandStatus, setIslandStatus] = useState<DynamicIslandStatus>({
    state: 'idle',
    label: 'Ready',
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'SET_SESSION', payload: parsed });
      }
    } catch (e) {
      console.error('Failed to load session from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on changes (debounced)
  useEffect(() => {
    if (!isLoaded) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } catch (e) {
        console.error('Failed to save session to localStorage:', e);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [session, isLoaded]);

  // Dynamic Island state management
  const setIslandState = useCallback((state: DynamicIslandState, label?: string) => {
    const labels: Record<DynamicIslandState, string> = {
      idle: 'Ready',
      planning: 'Planning...',
      'drafting-brief': 'Drafting brief',
      'drafting-prd': 'Drafting PRD',
      'preparing-prototype': 'Preparing prototype',
      ready: 'Draft ready',
      previewing: 'Previewing',
    };

    setIslandStatus((prev) => ({
      ...prev,
      state,
      label: label || labels[state],
      previewApp: state === 'previewing' ? prev.previewApp : undefined,
    }));
  }, []);

  const setIslandProgress = useCallback((current: number, total: number) => {
    setIslandStatus((prev) => ({
      ...prev,
      progress: { current, total },
    }));
  }, []);

  const setPreviewApp = useCallback((appName: string | null) => {
    if (appName) {
      setIslandStatus({
        state: 'previewing',
        label: `Previewing ${appName}`,
        previewApp: appName,
      });
    } else {
      setIslandStatus((prev) => ({
        ...prev,
        state: 'idle',
        label: 'Ready',
        previewApp: undefined,
      }));
    }
  }, []);

  // Draft update functions
  const updateBrief = useCallback((updates: Partial<Brief>) => {
    dispatch({ type: 'UPDATE_BRIEF', payload: updates });
  }, []);

  const updatePRD = useCallback((updates: Partial<PRD>) => {
    dispatch({ type: 'UPDATE_PRD', payload: updates });
  }, []);

  const updatePrototype = useCallback((updates: Partial<Prototype>) => {
    dispatch({ type: 'UPDATE_PROTOTYPE', payload: updates });
  }, []);

  const updateDesignDirection = useCallback((updates: Partial<DesignDirection>) => {
    dispatch({ type: 'UPDATE_DESIGN_DIRECTION', payload: updates });
  }, []);

  // Event bus
  const emitEvent = useCallback((type: string, payload: unknown, source: 'user' | 'ai' = 'user') => {
    const event: SessionEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type,
      payload,
      timestamp: Date.now(),
      source,
    };
    dispatch({ type: 'ADD_EVENT', payload: event });
  }, []);

  // Chat history functions
  const addChatMessage = useCallback(
    (
      role: ChatMessage['role'],
      content: string,
      metadata?: ChatMessage['metadata']
    ): ChatMessage => {
      const message: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        role,
        content,
        timestamp: Date.now(),
        metadata,
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: message });
      return message;
    },
    []
  );

  const clearChatHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_CHAT_HISTORY' });
  }, []);

  const getChatHistory = useCallback(() => {
    return session.chatHistory;
  }, [session.chatHistory]);

  // Notification functions
  const addNotification = useCallback(
    (appId: string, type: Notification['type'], title: string, body?: string) => {
      const notification: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        appId,
        type,
        title,
        body,
        count: 1,
        createdAt: Date.now(),
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      emitEvent(EventTypes.NOTIFICATION_CREATED, { appId, type, title });
    },
    [emitEvent]
  );

  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);

  const markAppNotificationsRead = useCallback((appId: string) => {
    dispatch({ type: 'MARK_APP_NOTIFICATIONS_READ', payload: appId });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  }, []);

  const getUnreadCountForApp = useCallback(
    (appId: string) => {
      return session.notifications.filter((n) => n.appId === appId && !n.readAt).length;
    },
    [session.notifications]
  );

  const getTotalUnreadCount = useCallback(() => {
    return session.notifications.filter((n) => !n.readAt).length;
  }, [session.notifications]);

  // Session management
  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' });
    localStorage.removeItem(STORAGE_KEY);
    emitEvent(EventTypes.SESSION_RESET, {});
  }, [emitEvent]);

  const exportDraft = useCallback(() => {
    const { draft } = session;
    const markdown = generateDraftMarkdown(draft);
    return markdown;
  }, [session]);

  const importDraft = useCallback((data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.draft) {
        dispatch({ type: 'SET_SESSION', payload: { ...session, draft: parsed.draft } });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [session]);

  const getSavePayload = useCallback(() => {
    return {
      sessionId: session.sessionId,
      draft: session.draft,
      chatHistory: session.chatHistory,
      eventLog: session.eventLog,
    };
  }, [session]);

  const loadFromSaved = useCallback(
    (data: { draft: Draft; chatHistory?: ChatMessage[]; eventLog?: SessionEvent[] }) => {
      dispatch({
        type: 'SET_SESSION',
        payload: {
          ...session,
          draft: data.draft,
          chatHistory: data.chatHistory || [],
          eventLog: data.eventLog || [],
          lastModified: Date.now(),
        },
      });
    },
    [session]
  );

  const value: SessionBrainContextValue = {
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
    loadFromSaved,
  };

  return (
    <SessionBrainContext.Provider value={value}>{children}</SessionBrainContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useSessionBrain() {
  const context = useContext(SessionBrainContext);
  if (!context) {
    throw new Error('useSessionBrain must be used within a SessionBrainProvider');
  }
  return context;
}

// ============================================================================
// Utilities
// ============================================================================

function generateDraftMarkdown(draft: Draft): string {
  const lines: string[] = [];

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
    draft.brief.constraints.forEach((c) => lines.push(`- ${c}`));
    lines.push('');
  }

  // PRD
  lines.push('## Product Requirements');
  lines.push('');
  if (draft.prd.goals.length > 0) {
    lines.push('### Goals');
    draft.prd.goals.forEach((g) => lines.push(`- ${g}`));
    lines.push('');
  }
  if (draft.prd.nonGoals.length > 0) {
    lines.push('### Non-Goals');
    draft.prd.nonGoals.forEach((g) => lines.push(`- ${g}`));
    lines.push('');
  }
  if (draft.prd.keyWorkflows.length > 0) {
    lines.push('### Key Workflows');
    draft.prd.keyWorkflows.forEach((w) => lines.push(`- ${w}`));
    lines.push('');
  }
  if (draft.prd.scopeMvp.length > 0) {
    lines.push('### MVP Scope');
    draft.prd.scopeMvp.forEach((s) => lines.push(`- ${s}`));
    lines.push('');
  }
  if (draft.prd.risks.length > 0) {
    lines.push('### Risks');
    draft.prd.risks.forEach((r) => lines.push(`- ${r}`));
    lines.push('');
  }
  if (draft.prd.successMetrics.length > 0) {
    lines.push('### Success Metrics');
    draft.prd.successMetrics.forEach((m) => lines.push(`- ${m}`));
    lines.push('');
  }

  // Prototype
  lines.push('## Prototype Plan');
  lines.push('');
  if (draft.prototype.screens.length > 0) {
    lines.push('### Screens');
    draft.prototype.screens.forEach((s) => lines.push(`- ${s}`));
    lines.push('');
  }
  if (draft.prototype.primaryFlow) {
    lines.push('### Primary Flow');
    lines.push(draft.prototype.primaryFlow);
    lines.push('');
  }
  if (draft.prototype.dataInputs.length > 0) {
    lines.push('### Data Inputs');
    draft.prototype.dataInputs.forEach((d) => lines.push(`- ${d}`));
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
    draft.designDirection.componentRules.forEach((r) => lines.push(`- ${r}`));
    lines.push('');
  }

  return lines.join('\n');
}

// Export utility for use elsewhere
export { generateDraftMarkdown };
