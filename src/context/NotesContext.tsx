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

export interface Note {
  id: string;
  title: string;
  content: string; // markdown
  folderId: string | null;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  color: string;
  createdAt: number;
}

export type SortOption = 'updated' | 'created' | 'title' | 'manual';
export type ViewMode = 'list' | 'grid';

interface NotesState {
  notes: Note[];
  folders: Folder[];
  selectedNoteId: string | null;
  selectedFolderId: string | null;
  searchQuery: string;
  sortBy: SortOption;
  viewMode: ViewMode;
  isQuickCaptureOpen: boolean;
}

interface NotesContextType extends NotesState {
  // Note CRUD
  createNote: (folderId?: string | null) => Note;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  deleteNote: (id: string) => void;
  duplicateNote: (id: string) => Note | null;
  moveNote: (noteId: string, folderId: string | null) => void;
  togglePinNote: (id: string) => void;

  // Folder CRUD
  createFolder: (name: string, parentId?: string | null, color?: string) => Folder;
  updateFolder: (id: string, updates: Partial<Omit<Folder, 'id' | 'createdAt'>>) => void;
  deleteFolder: (id: string, deleteNotes?: boolean) => void;

  // Selection
  selectNote: (id: string | null) => void;
  selectFolder: (id: string | null) => void;

  // Search & Sort
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;

  // Quick Capture
  openQuickCapture: () => void;
  closeQuickCapture: () => void;
  quickCapture: (content: string, folderId?: string | null) => Note;

  // Computed
  getNotesInFolder: (folderId: string | null) => Note[];
  getSubfolders: (parentId: string | null) => Folder[];
  getFilteredNotes: () => Note[];
  selectedNote: Note | null;
  selectedFolder: Folder | null;
}

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEYS = {
  notes: 'openclaw.notes',
  folders: 'openclaw.notes.folders',
  selectedNoteId: 'openclaw.notes.selectedNoteId',
  selectedFolderId: 'openclaw.notes.selectedFolderId',
  sortBy: 'openclaw.notes.sortBy',
  viewMode: 'openclaw.notes.viewMode',
} as const;

// ============================================================================
// Defaults
// ============================================================================

const DEFAULT_FOLDERS: Folder[] = [
  {
    id: 'inbox',
    name: 'Inbox',
    parentId: null,
    color: '#3b82f6',
    createdAt: Date.now(),
  },
  {
    id: 'personal',
    name: 'Personal',
    parentId: null,
    color: '#10b981',
    createdAt: Date.now(),
  },
  {
    id: 'work',
    name: 'Work',
    parentId: null,
    color: '#f59e0b',
    createdAt: Date.now(),
  },
];

const WELCOME_NOTE: Note = {
  id: 'welcome',
  title: 'Welcome to Notes',
  content: `# Welcome to Notes! 📝

This is your personal notes app with **markdown support**.

## Features

- 📁 Organize notes into folders
- 🔍 Quick search with \`⌘K\`
- ⚡ Instant capture with \`⌘⇧N\`
- 📱 Works great on mobile
- 🌓 Respects your theme

## Markdown Support

You can use all the usual markdown:

- **Bold** and *italic* text
- \`inline code\` and code blocks
- [Links](https://example.com)
- Lists, headings, and more!

\`\`\`javascript
// Even syntax-highlighted code
const greeting = "Hello, Notes!";
\`\`\`

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| \`⌘⇧N\` | Quick capture |
| \`⌘K\` | Search notes |
| \`⌘N\` | New note |
| \`⌘S\` | Save (auto-saves) |

---

Start writing and your notes will be saved automatically!
`,
  folderId: 'inbox',
  tags: ['welcome', 'getting-started'],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isPinned: true,
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

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  // State
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedNotes = safeJsonParse<Note[]>(
      localStorage.getItem(STORAGE_KEYS.notes),
      []
    );
    const storedFolders = safeJsonParse<Folder[]>(
      localStorage.getItem(STORAGE_KEYS.folders),
      []
    );
    const storedSelectedNote = localStorage.getItem(STORAGE_KEYS.selectedNoteId);
    const storedSelectedFolder = localStorage.getItem(STORAGE_KEYS.selectedFolderId);
    const storedSortBy = localStorage.getItem(STORAGE_KEYS.sortBy) as SortOption | null;
    const storedViewMode = localStorage.getItem(STORAGE_KEYS.viewMode) as ViewMode | null;

    // Initialize with defaults if empty
    if (storedFolders.length === 0) {
      setFolders(DEFAULT_FOLDERS);
    } else {
      setFolders(storedFolders);
    }

    if (storedNotes.length === 0) {
      setNotes([WELCOME_NOTE]);
      setSelectedNoteId(WELCOME_NOTE.id);
    } else {
      setNotes(storedNotes);
      if (storedSelectedNote) setSelectedNoteId(storedSelectedNote);
    }

    if (storedSelectedFolder) setSelectedFolderId(storedSelectedFolder);
    if (storedSortBy) setSortBy(storedSortBy);
    if (storedViewMode) setViewMode(storedViewMode);

    setIsHydrated(true);
  }, []);

  // Persist notes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
  }, [notes, isHydrated]);

  // Persist folders to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEYS.folders, JSON.stringify(folders));
  }, [folders, isHydrated]);

  // Persist selection
  useEffect(() => {
    if (!isHydrated) return;
    if (selectedNoteId) {
      localStorage.setItem(STORAGE_KEYS.selectedNoteId, selectedNoteId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.selectedNoteId);
    }
  }, [selectedNoteId, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (selectedFolderId) {
      localStorage.setItem(STORAGE_KEYS.selectedFolderId, selectedFolderId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.selectedFolderId);
    }
  }, [selectedFolderId, isHydrated]);

  // Persist settings
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEYS.sortBy, sortBy);
  }, [sortBy, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEYS.viewMode, viewMode);
  }, [viewMode, isHydrated]);

  // ============================================================================
  // Note CRUD
  // ============================================================================

  const createNote = useCallback((folderId: string | null = null): Note => {
    const newNote: Note = {
      id: generateId(),
      title: 'Untitled',
      content: '',
      folderId: folderId ?? selectedFolderId,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPinned: false,
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    return newNote;
  }, [selectedFolderId]);

  const updateNote = useCallback(
    (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? { ...note, ...updates, updatedAt: Date.now() }
            : note
        )
      );
    },
    []
  );

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    setSelectedNoteId((prev) => (prev === id ? null : prev));
  }, []);

  const duplicateNote = useCallback((id: string): Note | null => {
    const original = notes.find((n) => n.id === id);
    if (!original) return null;

    const duplicate: Note = {
      ...original,
      id: generateId(),
      title: `${original.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPinned: false,
    };
    setNotes((prev) => [duplicate, ...prev]);
    setSelectedNoteId(duplicate.id);
    return duplicate;
  }, [notes]);

  const moveNote = useCallback((noteId: string, folderId: string | null) => {
    updateNote(noteId, { folderId });
  }, [updateNote]);

  const togglePinNote = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned, updatedAt: Date.now() } : note
      )
    );
  }, []);

  // ============================================================================
  // Folder CRUD
  // ============================================================================

  const createFolder = useCallback(
    (name: string, parentId: string | null = null, color = '#6366f1'): Folder => {
      const newFolder: Folder = {
        id: generateId(),
        name,
        parentId,
        color,
        createdAt: Date.now(),
      };
      setFolders((prev) => [...prev, newFolder]);
      return newFolder;
    },
    []
  );

  const updateFolder = useCallback(
    (id: string, updates: Partial<Omit<Folder, 'id' | 'createdAt'>>) => {
      setFolders((prev) =>
        prev.map((folder) => (folder.id === id ? { ...folder, ...updates } : folder))
      );
    },
    []
  );

  const deleteFolder = useCallback(
    (id: string, deleteNotes = false) => {
      // Get all descendant folder IDs
      const getDescendantIds = (folderId: string): string[] => {
        const children = folders.filter((f) => f.parentId === folderId);
        return [folderId, ...children.flatMap((c) => getDescendantIds(c.id))];
      };

      const folderIds = getDescendantIds(id);

      // Either delete or move notes to root
      if (deleteNotes) {
        setNotes((prev) => prev.filter((note) => !folderIds.includes(note.folderId ?? '')));
      } else {
        setNotes((prev) =>
          prev.map((note) =>
            folderIds.includes(note.folderId ?? '') ? { ...note, folderId: null } : note
          )
        );
      }

      // Delete folders
      setFolders((prev) => prev.filter((f) => !folderIds.includes(f.id)));

      // Clear selection if deleted
      setSelectedFolderId((prev) => (folderIds.includes(prev ?? '') ? null : prev));
    },
    [folders]
  );

  // ============================================================================
  // Selection
  // ============================================================================

  const selectNote = useCallback((id: string | null) => {
    setSelectedNoteId(id);
  }, []);

  const selectFolder = useCallback((id: string | null) => {
    setSelectedFolderId(id);
  }, []);

  // ============================================================================
  // Quick Capture
  // ============================================================================

  const openQuickCapture = useCallback(() => {
    setIsQuickCaptureOpen(true);
  }, []);

  const closeQuickCapture = useCallback(() => {
    setIsQuickCaptureOpen(false);
  }, []);

  const quickCapture = useCallback(
    (content: string, folderId: string | null = null): Note => {
      // Extract title from first line if it's a heading
      let title = 'Quick Note';
      let noteContent = content;

      const firstLine = content.split('\n')[0];
      if (firstLine.startsWith('#')) {
        title = firstLine.replace(/^#+\s*/, '').trim() || 'Quick Note';
      } else if (firstLine.length > 0 && firstLine.length <= 50) {
        title = firstLine;
        noteContent = content.substring(firstLine.length).trim();
      }

      const newNote: Note = {
        id: generateId(),
        title,
        content: noteContent,
        folderId: folderId ?? 'inbox',
        tags: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPinned: false,
      };

      setNotes((prev) => [newNote, ...prev]);
      setIsQuickCaptureOpen(false);
      return newNote;
    },
    []
  );

  // ============================================================================
  // Computed Values
  // ============================================================================

  const getNotesInFolder = useCallback(
    (folderId: string | null): Note[] => {
      return notes.filter((note) => note.folderId === folderId);
    },
    [notes]
  );

  const getSubfolders = useCallback(
    (parentId: string | null): Folder[] => {
      return folders.filter((folder) => folder.parentId === parentId);
    },
    [folders]
  );

  const getFilteredNotes = useCallback((): Note[] => {
    let filtered = notes;

    // Filter by folder
    if (selectedFolderId !== null) {
      filtered = filtered.filter((note) => note.folderId === selectedFolderId);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      // Pinned notes first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortBy) {
        case 'updated':
          return b.updatedAt - a.updatedAt;
        case 'created':
          return b.createdAt - a.createdAt;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return b.updatedAt - a.updatedAt;
      }
    });

    return sorted;
  }, [notes, selectedFolderId, searchQuery, sortBy]);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null;
  const selectedFolder = folders.find((f) => f.id === selectedFolderId) ?? null;

  // ============================================================================
  // Context Value
  // ============================================================================

  const value: NotesContextType = {
    // State
    notes,
    folders,
    selectedNoteId,
    selectedFolderId,
    searchQuery,
    sortBy,
    viewMode,
    isQuickCaptureOpen,

    // Note CRUD
    createNote,
    updateNote,
    deleteNote,
    duplicateNote,
    moveNote,
    togglePinNote,

    // Folder CRUD
    createFolder,
    updateFolder,
    deleteFolder,

    // Selection
    selectNote,
    selectFolder,

    // Search & Sort
    setSearchQuery,
    setSortBy,
    setViewMode,

    // Quick Capture
    openQuickCapture,
    closeQuickCapture,
    quickCapture,

    // Computed
    getNotesInFolder,
    getSubfolders,
    getFilteredNotes,
    selectedNote,
    selectedFolder,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
