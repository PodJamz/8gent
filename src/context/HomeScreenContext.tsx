'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// Types
export interface AppItem {
  id: string;
  name: string;
  href?: string;
  icon?: React.ReactNode;
  imageUrl?: string;
  gradient: string;
  external?: boolean;
  isChat?: boolean;
}

export interface FolderItem {
  id: string;
  name: string;
  apps: AppItem[];
}

export type GridItem =
  | { type: 'app'; item: AppItem }
  | { type: 'folder'; item: FolderItem };

interface DragState {
  isDragging: boolean;
  draggedItem: GridItem | null;
  draggedIndex: number | null;
  dropTargetIndex: number | null;
  dragOffset: { x: number; y: number };
  dragPosition: { x: number; y: number };
}

interface HomeScreenContextValue {
  // Grid items (apps and folders)
  gridItems: GridItem[];
  setGridItems: (items: GridItem[]) => void;

  // Edit mode (wiggle mode)
  isEditMode: boolean;
  enterEditMode: () => void;
  exitEditMode: () => void;

  // Drag state
  dragState: DragState;
  startDrag: (item: GridItem, index: number, offset: { x: number; y: number }) => void;
  updateDragPosition: (position: { x: number; y: number }) => void;
  setDropTarget: (index: number | null) => void;
  endDrag: () => void;

  // Folder operations
  createFolder: (appIndex1: number, appIndex2: number, folderName?: string) => void;
  addToFolder: (appIndex: number, folderIndex: number) => void;
  removeFromFolder: (folderId: string, appId: string) => void;
  renameFolder: (folderId: string, newName: string) => void;

  // Open folder state
  openFolderId: string | null;
  openFolder: (folderId: string) => void;
  closeFolder: () => void;

  // Reordering
  reorderItems: (fromIndex: number, toIndex: number) => void;

  // Reset
  resetToDefault: () => void;
}

const HomeScreenContext = createContext<HomeScreenContextValue | null>(null);

const STORAGE_KEY = 'openclaw_homeScreen_v16'; // v16: Curated for OpenClaw-OS

// ============================================================================
// ALL APPS - Complete registry of available apps
// ============================================================================
// ============================================================================
// ALL APPS - Curated for OpenClaw OS
// ============================================================================
export const defaultApps: AppItem[] = [
  // Core/Entry apps
  // { id: 'story', name: 'Story', href: '/story', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }, // Personal
  // { id: 'blog', name: 'Blog', href: '/blog', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }, // Personal
  // { id: 'resume', name: 'Resume', href: '/resume', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }, // Personal

  // Action/Create apps
  // { id: 'music', name: 'Music', href: '/music', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }, // Personal
  { id: 'jamz', name: 'Studio', href: '/studio', gradient: 'linear-gradient(135deg, hsl(var(--theme-primary, 262 83% 58%)) 0%, hsl(var(--theme-accent, 187 94% 43%)) 100%)' }, // Renamed from Jamz
  { id: 'prototyping', name: 'Prototyping', href: '/prototyping', gradient: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)' },
  { id: 'agent', name: 'OpenClaw', href: '/agent', gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' }, // Renamed
  { id: 'notes', name: 'Notes', href: '/notes', gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' },
  { id: 'cowrite', name: 'Cowrite', href: '/cowrite', gradient: 'linear-gradient(135deg, hsl(var(--theme-primary, 180 70% 45%)) 0%, hsl(var(--theme-accent, 190 80% 50%)) 100%)' },
  { id: 'canvas', name: 'Canvas', href: '/canvas', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' },
  { id: 'product', name: 'Product', href: '/product', gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' },
  { id: 'projects', name: 'Projects', href: '/projects', gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' },
  { id: 'mockit', name: 'Mockit', href: '/mockit', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' },

  // Work/Hire apps
  { id: 'humans', name: 'Humans', href: '/humans', gradient: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)' }, // Keep as generic contacts?
  // { id: 'activity', name: 'Activity', href: '/activity', gradient: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)' }, // Personal activity?
  { id: 'calendar', name: 'Calendar', href: '/calendar', gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' },
  { id: 'contacts', name: 'Contacts', href: '/contacts', gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' },
  { id: 'messages', name: 'Messages', href: '/messages', gradient: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)' },

  // Explore/Depth apps
  { id: 'photos', name: 'Photos', href: '/photos', gradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)' },
  // { id: 'inspirations', name: 'Inspirations', href: '/inspirations', gradient: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)' }, // Personal
  { id: '3d-gallery', name: '3-D', href: '/gallery-3d', gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' },
  // { id: 'avatar', name: 'Avatar', href: '/avatar', gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)' }, // Personal avatar
  // { id: 'way', name: 'Way', href: 'https://way-lovat.vercel.app/', gradient: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)', external: true }, // Personal project

  // Theme showcases - Optional, keeping for "OS" feel
  { id: 'claude', name: 'Claude', href: '/design/claude', imageUrl: '/claudeapp.svg', gradient: 'linear-gradient(135deg, #D97757 0%, #B8523A 100%)' },
  // ... (Other themes can stay hidden in All Apps if needed, or removed)

  // Social/Connect apps - REMOVED PERSONAL LINKS
  // { id: 'github', name: 'GitHub', href: 'https://github.com/PodJamz', gradient: 'linear-gradient(135deg, #333 0%, #1a1a1a 100%)', external: true },

  // Vibes/Fun apps
  { id: 'weather', name: 'Weather', href: '/weather', gradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)' },
  { id: 'games', name: 'Games', href: '/games', gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' },
  { id: 'terminal', name: 'Terminal', href: '/terminal', gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' },

  // Neurodiversity apps - Removed purely personal ones
  // { id: 'regulation', name: 'Regulate', href: '/regulate', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' },
  // { id: 'journal', name: 'Journal', href: '/journal', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },

  // System apps
  { id: 'skills', name: 'Skills', href: '/skills', gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
  { id: 'system', name: 'System', href: '/system', gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' },
  { id: 'security', name: 'Security', href: '/security', gradient: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)' },
  { id: 'vault', name: 'Vault', href: '/vault', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
  { id: 'settings', name: 'Settings', href: '/settings', gradient: 'linear-gradient(135deg, hsl(var(--theme-primary, 0 0% 50%)) 0%, hsl(var(--theme-accent, 0 0% 40%)) 100%)' },
  { id: 'search', name: 'Search', href: '/search', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },

  // Wiki & Watch apps
  { id: 'wiki', name: 'Wiki', href: '/wiki', gradient: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' },

  // Updates/Progress
  { id: 'updates', name: 'Updates', href: '/updates', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' },

  // Research & Knowledge apps
  { id: 'research-app', name: 'Research', href: '/research', gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },

  // Browser app
  { id: 'browser', name: 'Browser', href: '/browser', gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' },
];

const getAppById = (id: string): AppItem | undefined => defaultApps.find(app => app.id === id);

const createFolderGridItem = (id: string, name: string, appIds: string[]): GridItem => ({
  type: 'folder',
  item: {
    id,
    name,
    apps: appIds.map(appId => getAppById(appId)).filter((app): app is AppItem => app !== undefined),
  },
});

const createAppGridItem = (id: string): GridItem | null => {
  const app = getAppById(id);
  return app ? { type: 'app', item: app } : null;
};

// Default grid with cleaner layout - reduced folders (5 from 7), cohesive colors
const createDefaultGridItems = (): GridItem[] => {
  const items: (GridItem | null)[] = [
    // ========== ROW 1: CORE WORK ==========
    createAppGridItem('agent'),           // OpenClaw (The Heart)
    createAppGridItem('browser'),         // Web
    createAppGridItem('terminal'),        // Command
    createAppGridItem('settings'),        // Config

    // ========== ROW 2: CREATION ==========
    createAppGridItem('canvas'),          // Infinite canvas
    createAppGridItem('notes'),           // Text
    createAppGridItem('calendar'),        // Time
    createAppGridItem('files'),           // Files (using vault if map exists)

    // ========== ROW 3: FOLDERS ==========
    createFolderGridItem('folder-dev', 'Dev', ['projects', 'product', 'prototyping', 'mockit']),
    createFolderGridItem('folder-explore', 'Explore', ['photos', '3d-gallery', 'games', 'weather']),
    createFolderGridItem('folder-system', 'System', ['security', 'vault', 'wiki', 'skills', 'updates']),
  ];

  return items.filter((item): item is GridItem => item !== null);
};

const defaultGridItems: GridItem[] = createDefaultGridItems();

interface HomeScreenProviderProps {
  children: ReactNode;
}

export function HomeScreenProvider({ children }: HomeScreenProviderProps) {
  const [gridItems, setGridItemsState] = useState<GridItem[]>(defaultGridItems);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    draggedIndex: null,
    dropTargetIndex: null,
    dragOffset: { x: 0, y: 0 },
    dragPosition: { x: 0, y: 0 },
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Restore icons to grid items (icons are React elements and can't be serialized)
        const restored = parsed.map((item: GridItem) => {
          if (item.type === 'app') {
            const defaultApp = defaultApps.find(a => a.id === item.item.id);
            return {
              ...item,
              item: { ...item.item, icon: defaultApp?.icon }
            };
          } else {
            return {
              ...item,
              item: {
                ...item.item,
                apps: item.item.apps.map((app: AppItem) => {
                  const defaultApp = defaultApps.find(a => a.id === app.id);
                  return { ...app, icon: defaultApp?.icon };
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
  const setGridItems = useCallback((items: GridItem[]) => {
    setGridItemsState(items);
    try {
      // Strip out icon React elements before saving (they can't be serialized)
      const toSave = items.map(item => {
        if (item.type === 'app') {
          const { icon, ...rest } = item.item;
          return { type: 'app', item: rest };
        } else {
          return {
            type: 'folder',
            item: {
              ...item.item,
              apps: item.item.apps.map(({ icon, ...rest }) => rest)
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
  const enterEditMode = useCallback(() => setIsEditMode(true), []);
  const exitEditMode = useCallback(() => {
    setIsEditMode(false);
    setDragState(prev => ({
      ...prev,
      isDragging: false,
      draggedItem: null,
      draggedIndex: null,
      dropTargetIndex: null,
    }));
  }, []);

  // Drag operations
  const startDrag = useCallback((item: GridItem, index: number, offset: { x: number; y: number }) => {
    setDragState({
      isDragging: true,
      draggedItem: item,
      draggedIndex: index,
      dropTargetIndex: null,
      dragOffset: offset,
      dragPosition: { x: 0, y: 0 },
    });
  }, []);

  const updateDragPosition = useCallback((position: { x: number; y: number }) => {
    setDragState(prev => ({
      ...prev,
      dragPosition: position,
    }));
  }, []);

  const setDropTarget = useCallback((index: number | null) => {
    setDragState(prev => ({
      ...prev,
      dropTargetIndex: index,
    }));
  }, []);

  const endDrag = useCallback(() => {
    const { draggedIndex, dropTargetIndex } = dragState;

    if (draggedIndex !== null && dropTargetIndex !== null && draggedIndex !== dropTargetIndex) {
      const sourceItem = gridItems[draggedIndex];
      const targetItem = gridItems[dropTargetIndex];

      // Check if we should create a folder (both are apps)
      if (sourceItem.type === 'app' && targetItem.type === 'app') {
        // Create folder with both apps
        const newFolder: FolderItem = {
          id: `folder_${Date.now()}`,
          name: 'New Folder',
          apps: [targetItem.item, sourceItem.item],
        };

        const newItems = [...gridItems];
        // Replace target with folder
        newItems[dropTargetIndex] = { type: 'folder', item: newFolder };
        // Remove dragged item
        newItems.splice(draggedIndex > dropTargetIndex ? draggedIndex : draggedIndex, 1);
        setGridItems(newItems);
      } else if (sourceItem.type === 'app' && targetItem.type === 'folder') {
        // Add app to existing folder
        const newItems = [...gridItems];
        const folder = { ...targetItem.item };
        folder.apps = [...folder.apps, sourceItem.item];
        newItems[dropTargetIndex] = { type: 'folder', item: folder };
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
      dragOffset: { x: 0, y: 0 },
      dragPosition: { x: 0, y: 0 },
    });
  }, [dragState, gridItems, setGridItems]);

  // Folder operations
  const createFolder = useCallback((appIndex1: number, appIndex2: number, folderName: string = 'New Folder') => {
    const item1 = gridItems[appIndex1];
    const item2 = gridItems[appIndex2];

    if (item1.type !== 'app' || item2.type !== 'app') return;

    const newFolder: FolderItem = {
      id: `folder_${Date.now()}`,
      name: folderName,
      apps: [item1.item, item2.item],
    };

    const newItems = gridItems.filter((_, i) => i !== appIndex1 && i !== appIndex2);
    const insertIndex = Math.min(appIndex1, appIndex2);
    newItems.splice(insertIndex, 0, { type: 'folder', item: newFolder });
    setGridItems(newItems);
  }, [gridItems, setGridItems]);

  const addToFolder = useCallback((appIndex: number, folderIndex: number) => {
    const appItem = gridItems[appIndex];
    const folderItem = gridItems[folderIndex];

    if (appItem.type !== 'app' || folderItem.type !== 'folder') return;

    const newItems = [...gridItems];
    const folder = { ...folderItem.item };
    folder.apps = [...folder.apps, appItem.item];
    newItems[folderIndex] = { type: 'folder', item: folder };
    newItems.splice(appIndex, 1);
    setGridItems(newItems);
  }, [gridItems, setGridItems]);

  const removeFromFolder = useCallback((folderId: string, appId: string) => {
    const folderIndex = gridItems.findIndex(
      item => item.type === 'folder' && item.item.id === folderId
    );
    if (folderIndex === -1) return;

    const folder = gridItems[folderIndex] as { type: 'folder'; item: FolderItem };
    const appToRemove = folder.item.apps.find(app => app.id === appId);
    if (!appToRemove) return;

    const newItems = [...gridItems];
    const remainingApps = folder.item.apps.filter(app => app.id !== appId);

    if (remainingApps.length === 0) {
      // Remove empty folder
      newItems.splice(folderIndex, 1);
    } else if (remainingApps.length === 1) {
      // Convert folder back to single app
      newItems[folderIndex] = { type: 'app', item: remainingApps[0] };
    } else {
      // Update folder
      newItems[folderIndex] = { type: 'folder', item: { ...folder.item, apps: remainingApps } };
    }

    // Add removed app after the folder position
    newItems.splice(folderIndex + 1, 0, { type: 'app', item: appToRemove });
    setGridItems(newItems);
  }, [gridItems, setGridItems]);

  const renameFolder = useCallback((folderId: string, newName: string) => {
    const newItems = gridItems.map(item => {
      if (item.type === 'folder' && item.item.id === folderId) {
        return { ...item, item: { ...item.item, name: newName } };
      }
      return item;
    });
    setGridItems(newItems);
  }, [gridItems, setGridItems]);

  // Open folder
  const openFolder = useCallback((folderId: string) => {
    setOpenFolderId(folderId);
  }, []);

  const closeFolder = useCallback(() => {
    setOpenFolderId(null);
  }, []);

  // Reordering
  const reorderItems = useCallback((fromIndex: number, toIndex: number) => {
    const newItems = [...gridItems];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setGridItems(newItems);
  }, [gridItems, setGridItems]);

  // Reset
  const resetToDefault = useCallback(() => {
    const newDefaults = createDefaultGridItems();
    setGridItems(newDefaults);
    localStorage.removeItem(STORAGE_KEY);
  }, [setGridItems]);

  const value: HomeScreenContextValue = {
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
    resetToDefault,
  };

  return (
    <HomeScreenContext.Provider value={value}>
      {children}
    </HomeScreenContext.Provider>
  );
}

export function useHomeScreen() {
  const context = useContext(HomeScreenContext);
  if (!context) {
    throw new Error('useHomeScreen must be used within a HomeScreenProvider');
  }
  return context;
}
