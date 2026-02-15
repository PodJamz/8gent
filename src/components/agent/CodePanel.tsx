'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  FolderTree,
  Terminal,
  Eye,
  ChevronUp,
  ChevronDown,
  X,
  Maximize2,
  Minimize2,
  File,
  Folder,
  ChevronRight,
  Play,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

export type CodePanelTab = 'code' | 'files' | 'terminal' | 'preview';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  language?: string;
  isOpen?: boolean;
}

export interface TerminalOutput {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: number;
}

interface CodePanelProps {
  isVisible: boolean;
  isExpanded: boolean;
  activeTab: CodePanelTab;
  onTabChange: (tab: CodePanelTab) => void;
  onToggleExpanded: () => void;
  onClose: () => void;
  // Code editor props
  code: string;
  language: string;
  currentFile?: string;
  onCodeChange?: (code: string) => void;
  // File tree props
  files: FileNode[];
  onFileSelect?: (path: string) => void;
  // Terminal props
  terminalOutput: TerminalOutput[];
  onRunCommand?: (command: string) => void;
  isRunning?: boolean;
  // Preview props
  previewUrl?: string;
  onRefreshPreview?: () => void;
}

// =============================================================================
// Tab Button Component
// =============================================================================

interface TabButtonProps {
  tab: CodePanelTab;
  isActive: boolean;
  onClick: () => void;
  icon: typeof Code;
  label: string;
  badge?: number;
}

function TabButton({ tab, isActive, onClick, icon: Icon, label, badge }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors relative',
        isActive
          ? 'text-primary border-b-2 border-primary'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

// =============================================================================
// File Tree Component
// =============================================================================

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  onSelect: (path: string) => void;
  selectedPath?: string;
}

function FileTreeItem({ node, depth, onSelect, selectedPath }: FileTreeItemProps) {
  const [isOpen, setIsOpen] = useState(node.isOpen ?? false);
  const isSelected = selectedPath === node.path;

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onSelect(node.path);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          'w-full flex items-center gap-1.5 px-2 py-1 text-sm transition-colors rounded',
          isSelected ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-foreground'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {node.type === 'folder' ? (
          <>
            <ChevronRight
              className={cn(
                'w-3 h-3 text-muted-foreground transition-transform',
                isOpen && 'rotate-90'
              )}
            />
            <Folder className="w-4 h-4 text-amber-400" />
          </>
        ) : (
          <>
            <span className="w-3" />
            <File className="w-4 h-4 text-blue-400" />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </button>

      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Simple Code Editor Component
// =============================================================================

interface CodeEditorProps {
  code: string;
  language: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
}

function CodeEditor({ code, language, onChange, readOnly = false }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Line numbers
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="relative h-full flex flex-col bg-[#1e1e1e] rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 flex overflow-auto">
        {/* Line numbers */}
        <div className="flex-shrink-0 px-3 py-2 text-right text-xs text-muted-foreground/50 font-mono select-none border-r border-white/5">
          {lineNumbers.map((n) => (
            <div key={n} className="leading-6">{n}</div>
          ))}
        </div>

        {/* Code area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange?.(e.target.value)}
            readOnly={readOnly}
            className={cn(
              'absolute inset-0 w-full h-full px-4 py-2 bg-transparent resize-none',
              'font-mono text-sm text-white leading-6',
              'focus:outline-none',
              readOnly && 'cursor-default'
            )}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Terminal Component
// =============================================================================

interface TerminalViewProps {
  output: TerminalOutput[];
  onRunCommand: (command: string) => void;
  isRunning: boolean;
}

function TerminalView({ output, onRunCommand, isRunning }: TerminalViewProps) {
  const [command, setCommand] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() && !isRunning) {
      onRunCommand(command.trim());
      setCommand('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] rounded-lg overflow-hidden font-mono">
      {/* Output */}
      <div ref={outputRef} className="flex-1 overflow-auto p-3 space-y-1">
        {output.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            Terminal ready. Type a command to get started.
          </div>
        ) : (
          output.map((line) => (
            <div
              key={line.id}
              className={cn(
                'text-sm whitespace-pre-wrap',
                line.type === 'command' && 'text-green-400',
                line.type === 'output' && 'text-white/80',
                line.type === 'error' && 'text-red-400'
              )}
            >
              {line.type === 'command' && <span className="text-muted-foreground">$ </span>}
              {line.content}
            </div>
          ))
        )}
        {isRunning && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Running...
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2 border-t border-white/10">
        <span className="text-green-400 text-sm">$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          disabled={isRunning}
          className="flex-1 bg-transparent text-sm text-white focus:outline-none disabled:opacity-50"
          placeholder="Enter command..."
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={!command.trim() || isRunning}
          className="p-1.5 rounded hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <Play className="w-4 h-4 text-green-400" />
        </button>
      </form>
    </div>
  );
}

// =============================================================================
// Preview Component
// =============================================================================

interface PreviewViewProps {
  url?: string;
  onRefresh: () => void;
}

function PreviewView({ url, onRefresh }: PreviewViewProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!url) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-muted/20 rounded-lg">
        <Eye className="w-12 h-12 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">No preview available</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Run a dev server to see the preview
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card rounded-lg overflow-hidden">
      {/* URL bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <button
          onClick={onRefresh}
          className="p-1.5 rounded hover:bg-muted transition-colors"
          title="Refresh"
        >
          <RefreshCw className={cn('w-4 h-4 text-muted-foreground', isLoading && 'animate-spin')} />
        </button>
        <div className="flex-1 px-3 py-1.5 rounded bg-muted text-sm text-muted-foreground truncate">
          {url}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded hover:bg-muted transition-colors"
          title="Open in new tab"
        >
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </a>
      </div>

      {/* iframe */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
          </div>
        )}
        <iframe
          src={url}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          title="Preview"
        />
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function CodePanel({
  isVisible,
  isExpanded,
  activeTab,
  onTabChange,
  onToggleExpanded,
  onClose,
  code,
  language,
  currentFile,
  onCodeChange,
  files,
  onFileSelect,
  terminalOutput,
  onRunCommand,
  isRunning = false,
  previewUrl,
  onRefreshPreview,
}: CodePanelProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className={cn(
        'bg-card border-t border-border flex flex-col',
        isExpanded ? 'h-[70vh]' : 'h-[300px] md:h-[350px]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 border-b border-border">
        {/* Tabs */}
        <div className="flex items-center gap-1">
          <TabButton
            tab="code"
            isActive={activeTab === 'code'}
            onClick={() => onTabChange('code')}
            icon={Code}
            label="Code"
          />
          <TabButton
            tab="files"
            isActive={activeTab === 'files'}
            onClick={() => onTabChange('files')}
            icon={FolderTree}
            label="Files"
          />
          <TabButton
            tab="terminal"
            isActive={activeTab === 'terminal'}
            onClick={() => onTabChange('terminal')}
            icon={Terminal}
            label="Terminal"
            badge={terminalOutput.filter((o) => o.type === 'error').length}
          />
          <TabButton
            tab="preview"
            isActive={activeTab === 'preview'}
            onClick={() => onTabChange('preview')}
            icon={Eye}
            label="Preview"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          {currentFile && (
            <span className="text-xs text-muted-foreground mr-2 hidden sm:block">
              {currentFile}
            </span>
          )}
          <button
            onClick={onToggleExpanded}
            className="p-2 rounded hover:bg-muted transition-colors"
            title={isExpanded ? 'Minimize' : 'Maximize'}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Maximize2 className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-muted transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-3">
        <AnimatePresence mode="wait">
          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <CodeEditor
                code={code}
                language={language}
                onChange={onCodeChange}
              />
            </motion.div>
          )}

          {activeTab === 'files' && (
            <motion.div
              key="files"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-auto"
            >
              <div className="space-y-0.5">
                {files.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    No files in workspace
                  </div>
                ) : (
                  files.map((file) => (
                    <FileTreeItem
                      key={file.path}
                      node={file}
                      depth={0}
                      onSelect={onFileSelect || (() => {})}
                      selectedPath={currentFile}
                    />
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'terminal' && (
            <motion.div
              key="terminal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <TerminalView
                output={terminalOutput}
                onRunCommand={onRunCommand || (() => {})}
                isRunning={isRunning}
              />
            </motion.div>
          )}

          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <PreviewView
                url={previewUrl}
                onRefresh={onRefreshPreview || (() => {})}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default CodePanel;
