'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

// ============================================================================
// Types
// ============================================================================

export interface StylePrompt {
  id: string;
  name: string;
  content: string;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface LyricsPrompt {
  id: string;
  name: string;
  content: string;
  stylePromptId: string | null;
  version: number;
  parentVersionId: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface CowriteSession {
  id: string;
  name: string;
  stylePromptId: string | null;
  lyricsPromptId: string | null;
  createdAt: number;
  updatedAt: number;
}

export type ActiveTab = 'style' | 'lyrics' | 'chat';

interface CowriteState {
  stylePrompts: StylePrompt[];
  lyricsPrompts: LyricsPrompt[];
  sessions: CowriteSession[];
  activeStylePromptId: string | null;
  activeLyricsPromptId: string | null;
  activeSessionId: string | null;
  activeTab: ActiveTab;
  isChatOpen: boolean;
}

interface CowriteContextType extends CowriteState {
  // Style Prompt CRUD
  createStylePrompt: (name?: string, content?: string) => StylePrompt;
  updateStylePrompt: (id: string, updates: Partial<Omit<StylePrompt, 'id' | 'createdAt'>>) => void;
  deleteStylePrompt: (id: string) => void;
  duplicateStylePrompt: (id: string) => StylePrompt | null;
  toggleFavoriteStyle: (id: string) => void;

  // Lyrics Prompt CRUD
  createLyricsPrompt: (name?: string, content?: string, stylePromptId?: string | null) => LyricsPrompt;
  updateLyricsPrompt: (id: string, updates: Partial<Omit<LyricsPrompt, 'id' | 'createdAt' | 'version' | 'parentVersionId'>>) => void;
  deleteLyricsPrompt: (id: string) => void;
  duplicateLyricsPrompt: (id: string) => LyricsPrompt | null;
  createLyricsVersion: (id: string, newContent: string) => LyricsPrompt | null;
  getLyricsVersionHistory: (id: string) => LyricsPrompt[];

  // Session CRUD
  createSession: (name?: string) => CowriteSession;
  updateSession: (id: string, updates: Partial<Omit<CowriteSession, 'id' | 'createdAt'>>) => void;
  deleteSession: (id: string) => void;

  // Selection
  selectStylePrompt: (id: string | null) => void;
  selectLyricsPrompt: (id: string | null) => void;
  selectSession: (id: string | null) => void;

  // Tab Navigation
  setActiveTab: (tab: ActiveTab) => void;

  // Chat
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;

  // Computed
  activeStylePrompt: StylePrompt | null;
  activeLyricsPrompt: LyricsPrompt | null;
  activeSession: CowriteSession | null;
  favoriteStylePrompts: StylePrompt[];
}

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEYS = {
  stylePrompts: 'openclaw.cowrite.stylePrompts',
  lyricsPrompts: 'openclaw.cowrite.lyricsPrompts',
  sessions: 'openclaw.cowrite.sessions',
  activeStylePromptId: 'openclaw.cowrite.activeStylePromptId',
  activeLyricsPromptId: 'openclaw.cowrite.activeLyricsPromptId',
  activeSessionId: 'openclaw.cowrite.activeSessionId',
  activeTab: 'openclaw.cowrite.activeTab',
} as const;

// ============================================================================
// Defaults
// ============================================================================

const DEFAULT_STYLE_PROMPT: StylePrompt = {
  id: 'default-style',
  name: 'Starter Style',
  content: `[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]

GENRE: Cinematic Pop / Synth-Pop Fusion
TEMPO: 118 BPM, steady groove with dynamic builds
VOCALS: Ethereal female lead, breathy verses, powerful chorus
CADENCE: Relaxed verses, driving pre-hooks, anthemic hooks
INSTRUMENTATION: Layered synths, organic drums, atmospheric pads, subtle strings
MOOD: Hopeful, introspective, triumphant crescendos`,
  isFavorite: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const DEFAULT_LYRICS_PROMPT: LyricsPrompt = {
  id: 'default-lyrics',
  name: 'Starter Lyrics',
  content: `/|/***///

[INTRO - INSTRUMENTAL]
(soft synth pads, building anticipation)

[VERSE 1]
Walking through the static haze
Every signal finds its way
Through the noise I hear your voice
Calling me to make a choice

[PRE-HOOK]
And I know, yeah I know
This is where we start to grow

[HOOK]
Light it up, light it up
We're the spark that won't give up
Rising high, breaking through
Everything I am is you

[VERSE 2]
Shadows fade when you appear
All my doubts just disappear
In this moment, crystal clear
This is why we're standing here

[PRE-HOOK]
And I know, yeah I know
This is where we start to glow

[HOOK]
Light it up, light it up
We're the spark that won't give up
Rising high, breaking through
Everything I am is you

[BRIDGE]
(soft, intimate)
When the world goes quiet
We'll still be the riot
In each other's eyes

[FINAL HOOK - BIG]
Light it up, light it UP
We're the spark that won't give up
Rising high, breaking through
Everything I am is you
(is you... is you...)

[OUTRO]
(fade with ambient pads and gentle hum)`,
  stylePromptId: 'default-style',
  version: 1,
  parentVersionId: null,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

// ============================================================================
// Utilities
// ============================================================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function safeJsonParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

// ============================================================================
// Context
// ============================================================================

const CowriteContext = createContext<CowriteContextType | null>(null);

export function CowriteProvider({ children }: { children: ReactNode }) {
  // State
  const [stylePrompts, setStylePrompts] = useState<StylePrompt[]>([]);
  const [lyricsPrompts, setLyricsPrompts] = useState<LyricsPrompt[]>([]);
  const [sessions, setSessions] = useState<CowriteSession[]>([]);
  const [activeStylePromptId, setActiveStylePromptId] = useState<string | null>(null);
  const [activeLyricsPromptId, setActiveLyricsPromptId] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('lyrics');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedStylePrompts = safeJsonParse<StylePrompt[]>(
      localStorage.getItem(STORAGE_KEYS.stylePrompts),
      []
    );
    const storedLyricsPrompts = safeJsonParse<LyricsPrompt[]>(
      localStorage.getItem(STORAGE_KEYS.lyricsPrompts),
      []
    );
    const storedSessions = safeJsonParse<CowriteSession[]>(
      localStorage.getItem(STORAGE_KEYS.sessions),
      []
    );
    const storedActiveStyleId = localStorage.getItem(STORAGE_KEYS.activeStylePromptId);
    const storedActiveLyricsId = localStorage.getItem(STORAGE_KEYS.activeLyricsPromptId);
    const storedActiveSessionId = localStorage.getItem(STORAGE_KEYS.activeSessionId);
    const storedActiveTab = localStorage.getItem(STORAGE_KEYS.activeTab) as ActiveTab | null;

    // Initialize with defaults if empty
    if (storedStylePrompts.length === 0) {
      setStylePrompts([DEFAULT_STYLE_PROMPT]);
      setActiveStylePromptId(DEFAULT_STYLE_PROMPT.id);
    } else {
      setStylePrompts(storedStylePrompts);
      if (storedActiveStyleId) setActiveStylePromptId(storedActiveStyleId);
    }

    if (storedLyricsPrompts.length === 0) {
      setLyricsPrompts([DEFAULT_LYRICS_PROMPT]);
      setActiveLyricsPromptId(DEFAULT_LYRICS_PROMPT.id);
    } else {
      setLyricsPrompts(storedLyricsPrompts);
      if (storedActiveLyricsId) setActiveLyricsPromptId(storedActiveLyricsId);
    }

    setSessions(storedSessions);
    if (storedActiveSessionId) setActiveSessionId(storedActiveSessionId);
    if (storedActiveTab) setActiveTab(storedActiveTab);

    setIsHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEYS.stylePrompts, JSON.stringify(stylePrompts));
  }, [stylePrompts, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEYS.lyricsPrompts, JSON.stringify(lyricsPrompts));
  }, [lyricsPrompts, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions));
  }, [sessions, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (activeStylePromptId) {
      localStorage.setItem(STORAGE_KEYS.activeStylePromptId, activeStylePromptId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.activeStylePromptId);
    }
  }, [activeStylePromptId, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (activeLyricsPromptId) {
      localStorage.setItem(STORAGE_KEYS.activeLyricsPromptId, activeLyricsPromptId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.activeLyricsPromptId);
    }
  }, [activeLyricsPromptId, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (activeSessionId) {
      localStorage.setItem(STORAGE_KEYS.activeSessionId, activeSessionId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.activeSessionId);
    }
  }, [activeSessionId, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEYS.activeTab, activeTab);
  }, [activeTab, isHydrated]);

  // ============================================================================
  // Style Prompt CRUD
  // ============================================================================

  const createStylePrompt = useCallback((name = 'Untitled Style', content = ''): StylePrompt => {
    const newPrompt: StylePrompt = {
      id: generateId(),
      name,
      content: content || `[Is_Max_Mode:Max]
[Quality:Maxi]
[Realism:Max]
[Real_Instruments:Max]
[Persona:Max]

GENRE:
TEMPO:
VOCALS:
CADENCE:
INSTRUMENTATION:
MOOD: `,
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setStylePrompts((prev) => [newPrompt, ...prev]);
    setActiveStylePromptId(newPrompt.id);
    return newPrompt;
  }, []);

  const updateStylePrompt = useCallback(
    (id: string, updates: Partial<Omit<StylePrompt, 'id' | 'createdAt'>>) => {
      setStylePrompts((prev) =>
        prev.map((prompt) =>
          prompt.id === id
            ? { ...prompt, ...updates, updatedAt: Date.now() }
            : prompt
        )
      );
    },
    []
  );

  const deleteStylePrompt = useCallback((id: string) => {
    setStylePrompts((prev) => prev.filter((prompt) => prompt.id !== id));
    setActiveStylePromptId((prev) => (prev === id ? null : prev));
  }, []);

  const duplicateStylePrompt = useCallback((id: string): StylePrompt | null => {
    const original = stylePrompts.find((p) => p.id === id);
    if (!original) return null;

    const duplicate: StylePrompt = {
      ...original,
      id: generateId(),
      name: `${original.name} (Copy)`,
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setStylePrompts((prev) => [duplicate, ...prev]);
    setActiveStylePromptId(duplicate.id);
    return duplicate;
  }, [stylePrompts]);

  const toggleFavoriteStyle = useCallback((id: string) => {
    setStylePrompts((prev) =>
      prev.map((prompt) =>
        prompt.id === id
          ? { ...prompt, isFavorite: !prompt.isFavorite, updatedAt: Date.now() }
          : prompt
      )
    );
  }, []);

  // ============================================================================
  // Lyrics Prompt CRUD
  // ============================================================================

  const createLyricsPrompt = useCallback(
    (name = 'Untitled Lyrics', content = '', stylePromptId: string | null = null): LyricsPrompt => {
      const newPrompt: LyricsPrompt = {
        id: generateId(),
        name,
        content: content || `/|/***///

[INTRO]

[VERSE 1]

[PRE-HOOK]

[HOOK]

[VERSE 2]

[HOOK]

[BRIDGE]

[FINAL HOOK]

[OUTRO]`,
        stylePromptId: stylePromptId ?? activeStylePromptId,
        version: 1,
        parentVersionId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setLyricsPrompts((prev) => [newPrompt, ...prev]);
      setActiveLyricsPromptId(newPrompt.id);
      return newPrompt;
    },
    [activeStylePromptId]
  );

  const updateLyricsPrompt = useCallback(
    (id: string, updates: Partial<Omit<LyricsPrompt, 'id' | 'createdAt' | 'version' | 'parentVersionId'>>) => {
      setLyricsPrompts((prev) =>
        prev.map((prompt) =>
          prompt.id === id
            ? { ...prompt, ...updates, updatedAt: Date.now() }
            : prompt
        )
      );
    },
    []
  );

  const deleteLyricsPrompt = useCallback((id: string) => {
    setLyricsPrompts((prev) => prev.filter((prompt) => prompt.id !== id));
    setActiveLyricsPromptId((prev) => (prev === id ? null : prev));
  }, []);

  const duplicateLyricsPrompt = useCallback((id: string): LyricsPrompt | null => {
    const original = lyricsPrompts.find((p) => p.id === id);
    if (!original) return null;

    const duplicate: LyricsPrompt = {
      ...original,
      id: generateId(),
      name: `${original.name} (Copy)`,
      version: 1,
      parentVersionId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setLyricsPrompts((prev) => [duplicate, ...prev]);
    setActiveLyricsPromptId(duplicate.id);
    return duplicate;
  }, [lyricsPrompts]);

  const createLyricsVersion = useCallback((id: string, newContent: string): LyricsPrompt | null => {
    const original = lyricsPrompts.find((p) => p.id === id);
    if (!original) return null;

    const newVersion: LyricsPrompt = {
      ...original,
      id: generateId(),
      content: newContent,
      version: original.version + 1,
      parentVersionId: original.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setLyricsPrompts((prev) => [newVersion, ...prev]);
    setActiveLyricsPromptId(newVersion.id);
    return newVersion;
  }, [lyricsPrompts]);

  const getLyricsVersionHistory = useCallback((id: string): LyricsPrompt[] => {
    const prompt = lyricsPrompts.find((p) => p.id === id);
    if (!prompt) return [];

    // Find the root (version 1)
    let root = prompt;
    while (root.parentVersionId) {
      const parent = lyricsPrompts.find((p) => p.id === root.parentVersionId);
      if (parent) root = parent;
      else break;
    }

    // Collect all versions from root
    const versions: LyricsPrompt[] = [root];
    const findChildren = (parentId: string) => {
      const children = lyricsPrompts.filter((p) => p.parentVersionId === parentId);
      for (const child of children) {
        versions.push(child);
        findChildren(child.id);
      }
    };
    findChildren(root.id);

    return versions.sort((a, b) => a.version - b.version);
  }, [lyricsPrompts]);

  // ============================================================================
  // Session CRUD
  // ============================================================================

  const createSession = useCallback((name = 'Untitled Session'): CowriteSession => {
    const newSession: CowriteSession = {
      id: generateId(),
      name,
      stylePromptId: activeStylePromptId,
      lyricsPromptId: activeLyricsPromptId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    return newSession;
  }, [activeStylePromptId, activeLyricsPromptId]);

  const updateSession = useCallback(
    (id: string, updates: Partial<Omit<CowriteSession, 'id' | 'createdAt'>>) => {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === id
            ? { ...session, ...updates, updatedAt: Date.now() }
            : session
        )
      );
    },
    []
  );

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
    setActiveSessionId((prev) => (prev === id ? null : prev));
  }, []);

  // ============================================================================
  // Selection
  // ============================================================================

  const selectStylePrompt = useCallback((id: string | null) => {
    setActiveStylePromptId(id);
  }, []);

  const selectLyricsPrompt = useCallback((id: string | null) => {
    setActiveLyricsPromptId(id);
  }, []);

  const selectSession = useCallback((id: string | null) => {
    setActiveSessionId(id);
    // Load session prompts
    const session = sessions.find((s) => s.id === id);
    if (session) {
      if (session.stylePromptId) setActiveStylePromptId(session.stylePromptId);
      if (session.lyricsPromptId) setActiveLyricsPromptId(session.lyricsPromptId);
    }
  }, [sessions]);

  // ============================================================================
  // Chat
  // ============================================================================

  const openChat = useCallback(() => setIsChatOpen(true), []);
  const closeChat = useCallback(() => setIsChatOpen(false), []);
  const toggleChat = useCallback(() => setIsChatOpen((prev) => !prev), []);

  // ============================================================================
  // Computed Values
  // ============================================================================

  const activeStylePrompt = stylePrompts.find((p) => p.id === activeStylePromptId) ?? null;
  const activeLyricsPrompt = lyricsPrompts.find((p) => p.id === activeLyricsPromptId) ?? null;
  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;
  const favoriteStylePrompts = stylePrompts.filter((p) => p.isFavorite).sort((a, b) => b.updatedAt - a.updatedAt);

  // ============================================================================
  // Context Value
  // ============================================================================

  const value: CowriteContextType = {
    // State
    stylePrompts,
    lyricsPrompts,
    sessions,
    activeStylePromptId,
    activeLyricsPromptId,
    activeSessionId,
    activeTab,
    isChatOpen,

    // Style Prompt CRUD
    createStylePrompt,
    updateStylePrompt,
    deleteStylePrompt,
    duplicateStylePrompt,
    toggleFavoriteStyle,

    // Lyrics Prompt CRUD
    createLyricsPrompt,
    updateLyricsPrompt,
    deleteLyricsPrompt,
    duplicateLyricsPrompt,
    createLyricsVersion,
    getLyricsVersionHistory,

    // Session CRUD
    createSession,
    updateSession,
    deleteSession,

    // Selection
    selectStylePrompt,
    selectLyricsPrompt,
    selectSession,

    // Tab Navigation
    setActiveTab,

    // Chat
    openChat,
    closeChat,
    toggleChat,

    // Computed
    activeStylePrompt,
    activeLyricsPrompt,
    activeSession,
    favoriteStylePrompts,
  };

  return <CowriteContext.Provider value={value}>{children}</CowriteContext.Provider>;
}

export function useCowrite() {
  const context = useContext(CowriteContext);
  if (!context) {
    throw new Error('useCowrite must be used within a CowriteProvider');
  }
  return context;
}
