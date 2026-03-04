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

const STORAGE_KEY = 'openclaw_homeScreen_v17'; // v17: Hub-based restructure

// ============================================================================
// ALL APPS - Complete registry of available apps
// ============================================================================
// ============================================================================
// ALL APPS - Curated for 8gent
// ============================================================================
export const defaultApps: AppItem[] = [
  // Hub/Main apps
  { id: 'control', name: 'Control', href: '/control', gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' },
  { id: 'agents', name: 'Agents', href: '/agents', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' },
  { id: 'settings', name: 'Settings', href: '/settings', gradient: 'linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%)' },
  { id: 'resources', name: 'Resources', href: 'https://docs.openclaw.io', gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', external: true },
  { id: 'chat', name: 'Chat', href: '/chat', gradient: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', isChat: true },

  // Secondary apps
  { id: 'browser', name: 'Browser', href: '/browser', gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' },
  { id: 'terminal', name: 'Terminal', href: '/terminal', gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' },
  { id: 'canvas', name: 'Canvas', href: '/canvas', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' },
  { id: 'notes', name: 'Notes', href: '/notes', gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' },
  { id: 'calendar', name: 'Calendar', href: '/calendar', gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' },
  { id: 'vault', name: 'Vault', href: '/vault', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
  { id: 'wiki', name: 'Wiki', href: '/wiki', gradient: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' },

  // Groups/Folders contents
  { id: 'projects', name: 'Projects', href: '/projects', gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' },
  { id: 'product', name: 'Product', href: '/product', gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' },
  { id: 'prototyping', name: 'Prototyping', href: '/prototyping', gradient: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)' },
  { id: 'mockit', name: 'Mockit', href: '/mockit', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' },
  { id: 'photos', name: 'Photos', href: '/photos', gradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)' },
  { id: '3d-gallery', name: '3-D', href: '/gallery-3d', gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' },
  { id: 'games', name: 'Games', href: '/games', gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' },
  { id: 'weather', name: 'Weather', href: '/weather', gradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)' },
  { id: 'security', name: 'Security', href: '/security', gradient: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)' },
  { id: 'skills', name: 'Skills', href: '/skills', gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
  { id: 'updates', name: 'Updates', href: '/updates', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' },
  { id: 'humans', name: 'Humans', href: '/humans', gradient: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)' },
  { id: 'contacts', name: 'Contacts', href: '/contacts', gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' },
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

// Default grid with Hub-based layout
const createDefaultGridItems = (): GridItem[] => {
  const items: (GridItem | null)[] = [
    // ========== ROW 1: HUBS ==========
    createAppGridItem('control'),         // Control Hub
    createAppGridItem('agents'),          // Agents Hub
    createAppGridItem('settings'),        // Settings Hub
    createAppGridItem('resources'),       // Resources Hub

    // ========== ROW 2: CORE TOOLS ==========
    createAppGridItem('chat'),            // Chat Hub
    createAppGridItem('browser'),         // Web Browser
    createAppGridItem('terminal'),        // CLI
    createAppGridItem('canvas'),          // Design

    // ========== ROW 3: UTILITIES & FOLDERS ==========
    createAppGridItem('notes'),           // Text
    createAppGridItem('calendar'),        // Time
    createFolderGridItem('folder-dev', 'Dev', ['projects', 'product', 'prototyping', 'mockit']),
    createFolderGridItem('folder-more', 'More', ['photos', '3d-gallery', 'games', 'weather', 'security', 'vault', 'wiki', 'skills', 'updates', 'humans', 'contacts']),
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
