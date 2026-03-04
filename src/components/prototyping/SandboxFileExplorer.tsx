'use client';

import React, { useState, useCallback } from 'react';
import {
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  FileCode,
  FileJson,
  FileText,
  Image,
} from 'lucide-react';
// ============================================================================
// Types
// ============================================================================

// File info returned by sandbox listFiles
interface FileInfo {
  path: string;
  type: 'file' | 'directory';
  size?: number;
}

interface SandboxFileExplorerProps {
  files: FileInfo[];
  onFileSelect?: (path: string) => void;
  onRefresh?: () => void;
  selectedFile?: string;
  isLoading?: boolean;
}

interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
}

// Internal working type for building tree
interface WorkingTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: { [key: string]: WorkingTreeNode };
}

// ============================================================================
// Helpers
// ============================================================================

function buildFileTree(files: FileInfo[]): FileTreeNode[] {
  const root: { [key: string]: WorkingTreeNode } = {};

  for (const file of files) {
    const parts = file.path.split('/').filter(Boolean);
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const currentPath = '/' + parts.slice(0, i + 1).join('/');

      if (!current[part]) {
        current[part] = {
          name: part,
          path: currentPath,
          type: isLast ? (file.type === 'directory' ? 'directory' : 'file') : 'directory',
          children: isLast && file.type !== 'directory' ? undefined : {},
        };
      }

      const children = current[part].children;
      if (!isLast && children) {
        current = children;
      }
    }
  }

  // Convert object tree to array tree
  function objectToArray(obj: { [key: string]: WorkingTreeNode }): FileTreeNode[] {
    return Object.values(obj)
      .map((node) => ({
        name: node.name,
        path: node.path,
        type: node.type,
        children: node.children ? objectToArray(node.children) : undefined,
      }))
      .sort((a, b) => {
        // Directories first, then alphabetical
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
  }

  return objectToArray(root);
}

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
      return <FileCode className="w-4 h-4 text-blue-400" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-yellow-400" />;
    case 'md':
    case 'txt':
      return <FileText className="w-4 h-4 text-gray-400" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <Image className="w-4 h-4 text-green-400" />;
    default:
      return <File className="w-4 h-4 text-gray-400" />;
  }
}

// ============================================================================
// File Tree Item Component
// ============================================================================

function FileTreeItem({
  node,
  depth = 0,
  selectedFile,
  onFileSelect,
}: {
  node: FileTreeNode;
  depth?: number;
  selectedFile?: string;
  onFileSelect?: (path: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const isSelected = selectedFile === node.path;

  const handleClick = useCallback(() => {
    if (node.type === 'directory') {
      setIsExpanded((prev) => !prev);
    } else {
      onFileSelect?.(node.path);
    }
  }, [node, onFileSelect]);

  return (
    <div>
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center gap-1 px-2 py-1 text-sm text-left
          hover:bg-white/5 rounded transition-colors
          ${isSelected ? 'bg-white/10 text-white' : 'text-white/70'}
        `}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {node.type === 'directory' ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-white/50" />
            ) : (
              <ChevronRight className="w-4 h-4 text-white/50" />
            )}
            <Folder
              className={`w-4 h-4 ${isExpanded ? 'text-yellow-400' : 'text-yellow-600'}`}
            />
          </>
        ) : (
          <>
            <span className="w-4" />
            {getFileIcon(node.name)}
          </>
        )}
        <span className="truncate">{node.name}</span>
      </button>

      {node.type === 'directory' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function SandboxFileExplorer({
  files,
  onFileSelect,
  onRefresh,
  selectedFile,
  isLoading,
}: SandboxFileExplorerProps) {
  const tree = buildFileTree(files);

  return (
    <div className="h-full flex flex-col bg-black/20 rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
          Files
        </span>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-white/50 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-auto py-1">
        {tree.length === 0 ? (
          <div className="px-3 py-4 text-center text-white/30 text-sm">
            No files yet
          </div>
        ) : (
          tree.map((node) => (
            <FileTreeItem
              key={node.path}
              node={node}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default SandboxFileExplorer;
