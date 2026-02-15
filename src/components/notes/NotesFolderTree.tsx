'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FolderOpen,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  FileText,
  Inbox,
} from 'lucide-react';
import { useNotes, type Folder as FolderType } from '@/context/NotesContext';
import { cn } from '@/lib/utils';

const FOLDER_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

interface FolderItemProps {
  folder: FolderType;
  depth?: number;
}

function FolderItem({ folder, depth = 0 }: FolderItemProps) {
  const {
    selectedFolderId,
    selectFolder,
    getSubfolders,
    getNotesInFolder,
    updateFolder,
    deleteFolder,
    createFolder,
  } = useNotes();

  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const subfolders = getSubfolders(folder.id);
  const noteCount = getNotesInFolder(folder.id).length;
  const isSelected = selectedFolderId === folder.id;

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Focus input when editing
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = useCallback(() => {
    selectFolder(folder.id);
  }, [selectFolder, folder.id]);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  }, []);

  const handleRename = useCallback(() => {
    if (editName.trim() && editName !== folder.name) {
      updateFolder(folder.id, { name: editName.trim() });
    }
    setIsEditing(false);
    setShowMenu(false);
  }, [editName, folder.id, folder.name, updateFolder]);

  const handleDelete = useCallback(() => {
    if (confirm(`Delete "${folder.name}" and move its notes to All Notes?`)) {
      deleteFolder(folder.id, false);
    }
    setShowMenu(false);
  }, [deleteFolder, folder.id, folder.name]);

  const handleColorChange = useCallback(
    (color: string) => {
      updateFolder(folder.id, { color });
      setShowColorPicker(false);
      setShowMenu(false);
    },
    [folder.id, updateFolder]
  );

  const handleAddSubfolder = useCallback(() => {
    createFolder('New Folder', folder.id);
    setIsExpanded(true);
    setShowMenu(false);
  }, [createFolder, folder.id]);

  return (
    <div>
      <div
        onClick={handleClick}
        className={cn(
          'group flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer transition-colors',
          isSelected
            ? 'bg-[hsl(var(--theme-primary)/0.15)] text-[hsl(var(--theme-primary))]'
            : 'text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))]'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {/* Expand toggle */}
        {subfolders.length > 0 ? (
          <button
            onClick={handleToggle}
            className="p-0.5 rounded hover:bg-[hsl(var(--theme-muted))] transition-colors"
          >
            <ChevronRight
              className={cn(
                'w-3.5 h-3.5 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Folder icon */}
        {isExpanded && subfolders.length > 0 ? (
          <FolderOpen className="w-4 h-4 flex-shrink-0" style={{ color: folder.color }} />
        ) : (
          <Folder className="w-4 h-4 flex-shrink-0" style={{ color: folder.color }} />
        )}

        {/* Name or input */}
        {isEditing ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') {
                setEditName(folder.name);
                setIsEditing(false);
              }
            }}
            className="flex-1 min-w-0 px-1 py-0.5 text-sm bg-[hsl(var(--theme-background))] border border-[hsl(var(--theme-border))] rounded outline-none focus:border-[hsl(var(--theme-primary))]"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 min-w-0 text-sm truncate">{folder.name}</span>
        )}

        {/* Note count */}
        {noteCount > 0 && !isEditing && (
          <span className="text-xs text-[hsl(var(--theme-muted-foreground))]">
            {noteCount}
          </span>
        )}

        {/* More menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className={cn(
              'p-1 rounded transition-colors',
              showMenu
                ? 'opacity-100 bg-[hsl(var(--theme-muted))]'
                : 'opacity-0 group-hover:opacity-100 hover:bg-[hsl(var(--theme-muted))]'
            )}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="absolute right-0 top-full mt-1 z-50 w-40 rounded-lg border border-[hsl(var(--theme-border))] bg-[hsl(var(--theme-card))] shadow-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))] transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Rename
                </button>

                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))] transition-colors"
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-[hsl(var(--theme-border))]"
                    style={{ backgroundColor: folder.color }}
                  />
                  Color
                </button>

                {showColorPicker && (
                  <div className="px-3 py-2 grid grid-cols-4 gap-1.5">
                    {FOLDER_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={cn(
                          'w-5 h-5 rounded-full border-2 transition-transform hover:scale-110',
                          folder.color === color
                            ? 'border-[hsl(var(--theme-foreground))]'
                            : 'border-transparent'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}

                <button
                  onClick={handleAddSubfolder}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Subfolder
                </button>

                <div className="h-px bg-[hsl(var(--theme-border))]" />

                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Subfolders */}
      <AnimatePresence>
        {isExpanded && subfolders.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {subfolders.map((subfolder) => (
              <FolderItem key={subfolder.id} folder={subfolder} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function NotesFolderTree({ className }: { className?: string }) {
  const { folders, selectedFolderId, selectFolder, createFolder, notes } = useNotes();
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const rootFolders = folders.filter((f) => f.parentId === null);
  const allNotesCount = notes.length;

  // Focus input when creating
  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  const handleCreateFolder = useCallback(() => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
    }
    setIsCreating(false);
  }, [createFolder, newFolderName]);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[hsl(var(--theme-border))]">
        <span
          className="text-sm font-semibold text-[hsl(var(--theme-foreground))]"
          style={{ fontFamily: 'var(--theme-font-heading)' }}
        >
          Folders
        </span>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 rounded-md hover:bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
          title="New folder"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Folder list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {/* All Notes */}
        <div
          onClick={() => selectFolder(null)}
          className={cn(
            'flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors',
            selectedFolderId === null
              ? 'bg-[hsl(var(--theme-primary)/0.15)] text-[hsl(var(--theme-primary))]'
              : 'text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))]'
          )}
        >
          <FileText className="w-4 h-4" />
          <span className="flex-1 text-sm">All Notes</span>
          <span className="text-xs text-[hsl(var(--theme-muted-foreground))]">
            {allNotesCount}
          </span>
        </div>

        {/* Root folders */}
        {rootFolders.map((folder) => (
          <FolderItem key={folder.id} folder={folder} />
        ))}

        {/* New folder input */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-2 py-1.5"
            >
              <Folder className="w-4 h-4 text-[hsl(var(--theme-muted-foreground))]" />
              <input
                ref={inputRef}
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={handleCreateFolder}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFolder();
                  if (e.key === 'Escape') {
                    setNewFolderName('');
                    setIsCreating(false);
                  }
                }}
                placeholder="Folder name"
                className="flex-1 min-w-0 px-2 py-1 text-sm bg-[hsl(var(--theme-background))] border border-[hsl(var(--theme-border))] rounded outline-none focus:border-[hsl(var(--theme-primary))]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
