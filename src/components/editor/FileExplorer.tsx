'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  FilePlus,
  FolderPlus,
  Trash2,
  Edit3,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId?: string;
  content?: string;
  language?: string;
  children?: FileItem[];
}

interface FileExplorerProps {
  files: FileItem[];
  selectedFile?: string;
  onSelectFile: (file: FileItem) => void;
  onCreateFile?: (parentId?: string, name?: string) => void;
  onCreateFolder?: (parentId?: string, name?: string) => void;
  onDeleteFile?: (id: string) => void;
  onRenameFile?: (id: string, newName: string) => void;
  projectName?: string;
  className?: string;
}

interface TreeItemProps {
  item: FileItem;
  level: number;
  selectedFile?: string;
  expandedFolders: Set<string>;
  onToggleFolder: (id: string) => void;
  onSelectFile: (file: FileItem) => void;
  onCreateFile?: (parentId?: string) => void;
  onCreateFolder?: (parentId?: string) => void;
  onDeleteFile?: (id: string) => void;
  onRenameFile?: (id: string, newName: string) => void;
}

// ============================================================================
// File Icon Helper
// ============================================================================

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  // Return a colored indicator based on file type
  const colors: Record<string, string> = {
    tsx: 'text-blue-400',
    ts: 'text-blue-400',
    jsx: 'text-yellow-400',
    js: 'text-yellow-400',
    css: 'text-pink-400',
    scss: 'text-pink-400',
    html: 'text-orange-400',
    json: 'text-green-400',
    md: 'text-white/60',
    py: 'text-green-400',
    go: 'text-cyan-400',
    rs: 'text-orange-500',
  };

  return colors[ext] || 'text-white/40';
}

// ============================================================================
// Tree Item Component
// ============================================================================

function TreeItem({
  item,
  level,
  selectedFile,
  expandedFolders,
  onToggleFolder,
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
  onRenameFile,
}: TreeItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const isFolder = item.type === 'folder';
  const isExpanded = expandedFolders.has(item.id);
  const isSelected = selectedFile === item.id;

  const handleClick = () => {
    if (isFolder) {
      onToggleFolder(item.id);
    } else {
      onSelectFile(item);
    }
  };

  const handleRename = () => {
    if (newName && newName !== item.name) {
      onRenameFile?.(item.id, newName);
    }
    setIsRenaming(false);
  };

  return (
    <>
      <div
        className={cn(
          'group flex items-center gap-1 px-2 py-1 cursor-pointer transition-colors',
          isSelected
            ? 'bg-orange-500/20 text-white'
            : 'hover:bg-white/5 text-white/70 hover:text-white'
        )}
        style={{ paddingLeft: `${8 + level * 12}px` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Expand/collapse arrow for folders */}
        {isFolder ? (
          <ChevronRight
            className={cn(
              'w-3.5 h-3.5 text-white/40 transition-transform flex-shrink-0',
              isExpanded && 'rotate-90'
            )}
          />
        ) : (
          <span className="w-3.5" />
        )}

        {/* Icon */}
        {isFolder ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 text-orange-400 flex-shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-orange-400/70 flex-shrink-0" />
          )
        ) : (
          <File className={cn('w-4 h-4 flex-shrink-0', getFileIcon(item.name))} />
        )}

        {/* Name */}
        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') {
                setNewName(item.name);
                setIsRenaming(false);
              }
            }}
            className="flex-1 bg-white/10 border border-white/20 rounded px-1 text-xs text-white outline-none focus:border-orange-400"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-xs truncate flex-1">{item.name}</span>
        )}

        {/* Actions */}
        {isHovered && !isRenaming && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {isFolder && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateFile?.(item.id);
                  }}
                  className="p-0.5 rounded hover:bg-white/10 text-white/40 hover:text-white"
                  title="New File"
                >
                  <FilePlus className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateFolder?.(item.id);
                  }}
                  className="p-0.5 rounded hover:bg-white/10 text-white/40 hover:text-white"
                  title="New Folder"
                >
                  <FolderPlus className="w-3 h-3" />
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
              }}
              className="p-0.5 rounded hover:bg-white/10 text-white/40 hover:text-white"
              title="Rename"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFile?.(item.id);
              }}
              className="p-0.5 rounded hover:bg-white/10 text-white/40 hover:text-red-400"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Children */}
      <AnimatePresence>
        {isFolder && isExpanded && item.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {item.children.map((child) => (
              <TreeItem
                key={child.id}
                item={child}
                level={level + 1}
                selectedFile={selectedFile}
                expandedFolders={expandedFolders}
                onToggleFolder={onToggleFolder}
                onSelectFile={onSelectFile}
                onCreateFile={onCreateFile}
                onCreateFolder={onCreateFolder}
                onDeleteFile={onDeleteFile}
                onRenameFile={onRenameFile}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function FileExplorer({
  files,
  selectedFile,
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
  onRenameFile,
  projectName = 'Project',
  className,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['root'])
  );
  const [isProjectExpanded, setIsProjectExpanded] = useState(true);

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Sort files: folders first, then files, alphabetically
  const sortedFiles = [...files].sort((a, b) => {
    if (a.type === 'folder' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className={cn('h-full flex flex-col bg-[#0d1117]', className)}>
      {/* Header */}
      <div
        className="flex items-center justify-between gap-2 px-3 py-2 border-b border-white/5 cursor-pointer hover:bg-white/5"
        onClick={() => setIsProjectExpanded(!isProjectExpanded)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <ChevronRight
            className={cn(
              'w-4 h-4 text-white/40 transition-transform flex-shrink-0',
              isProjectExpanded && 'rotate-90'
            )}
          />
          <span className="text-xs font-semibold text-white/80 uppercase tracking-wide truncate">
            {projectName}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateFile?.();
            }}
            className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"
            title="New File"
          >
            <FilePlus className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateFolder?.();
            }}
            className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"
            title="New Folder"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-auto py-1">
        <AnimatePresence>
          {isProjectExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {sortedFiles.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-xs text-white/30">No files yet</p>
                  <p className="text-xs text-white/20 mt-1">
                    Create a new file or folder to get started
                  </p>
                </div>
              ) : (
                sortedFiles.map((item) => (
                  <TreeItem
                    key={item.id}
                    item={item}
                    level={0}
                    selectedFile={selectedFile}
                    expandedFolders={expandedFolders}
                    onToggleFolder={toggleFolder}
                    onSelectFile={onSelectFile}
                    onCreateFile={onCreateFile}
                    onCreateFolder={onCreateFolder}
                    onDeleteFile={onDeleteFile}
                    onRenameFile={onRenameFile}
                  />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FileExplorer;
