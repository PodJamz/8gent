'use client';

import { useState, useCallback } from 'react';
import { useHorizontalScroll } from '@/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PanelLeftClose,
  PanelLeft,
  Play,
  Save,
  GitBranch,
  Terminal,
  Settings,
  Search,
  X,
  Plus,
} from 'lucide-react';
import { FileExplorer, type FileItem } from './FileExplorer';
import { CodeEditor } from './CodeEditor';
import { BuildModeGate } from '@/components/auth/BuildModeGate';
import { useAuthGate } from '@/hooks/useAuthGate';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface IDEViewProps {
  className?: string;
}

// ============================================================================
// Sample Data
// ============================================================================

const SAMPLE_FILES: FileItem[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'app',
        name: 'app',
        type: 'folder',
        parentId: 'src',
        children: [
          {
            id: 'page.tsx',
            name: 'page.tsx',
            type: 'file',
            parentId: 'app',
            content: `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to Claw AI</h1>
      <p className="mt-4 text-lg text-gray-600">
        Your AI-powered coding assistant
      </p>
    </main>
  );
}`,
            language: 'typescript',
          },
          {
            id: 'layout.tsx',
            name: 'layout.tsx',
            type: 'file',
            parentId: 'app',
            content: `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Claw AI',
  description: 'AI-powered coding assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}`,
            language: 'typescript',
          },
          {
            id: 'globals.css',
            name: 'globals.css',
            type: 'file',
            parentId: 'app',
            content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}`,
            language: 'css',
          },
        ],
      },
      {
        id: 'components',
        name: 'components',
        type: 'folder',
        parentId: 'src',
        children: [
          {
            id: 'Button.tsx',
            name: 'Button.tsx',
            type: 'file',
            parentId: 'components',
            content: `import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'border border-input hover:bg-accent': variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';`,
            language: 'typescript',
          },
        ],
      },
    ],
  },
  {
    id: 'package.json',
    name: 'package.json',
    type: 'file',
    content: `{
  "name": "claw-ai-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@types/node": "20.0.0",
    "@types/react": "18.2.0",
    "typescript": "5.0.0",
    "tailwindcss": "3.3.0"
  }
}`,
    language: 'json',
  },
  {
    id: 'README.md',
    name: 'README.md',
    type: 'file',
    content: `# Claw AI App

An AI-powered coding assistant built with Next.js.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Features

- AI-powered code suggestions
- Real-time collaboration
- Git integration
- Terminal access
`,
    language: 'markdown',
  },
];

// ============================================================================
// Main Component
// ============================================================================

export function IDEView({ className }: IDEViewProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [openTabs, setOpenTabs] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>(SAMPLE_FILES);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [unsavedChanges, setUnsavedChanges] = useState<Set<string>>(new Set());
  const tabScrollRef = useHorizontalScroll<HTMLDivElement>();

  // Auth gate for build actions
  const {
    requireAuth,
    isGateOpen,
    closeGate,
    onSignedIn,
    projectContext,
  } = useAuthGate();

  // Flatten file tree to find files by id
  const flattenFiles = useCallback((items: FileItem[]): FileItem[] => {
    const result: FileItem[] = [];
    for (const item of items) {
      result.push(item);
      if (item.children) {
        result.push(...flattenFiles(item.children));
      }
    }
    return result;
  }, []);

  const handleSelectFile = useCallback((file: FileItem) => {
    if (file.type === 'file') {
      setSelectedFile(file);

      // Add to tabs if not already open
      setOpenTabs((prev) => {
        if (prev.find((t) => t.id === file.id)) {
          return prev;
        }
        return [...prev, file];
      });

      // Initialize content if not already loaded
      if (!fileContents[file.id] && file.content) {
        setFileContents((prev) => ({
          ...prev,
          [file.id]: file.content || '',
        }));
      }
    }
  }, [fileContents]);

  const handleCloseTab = useCallback((fileId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpenTabs((prev) => prev.filter((t) => t.id !== fileId));

    // If closing the selected file, select another tab
    if (selectedFile?.id === fileId) {
      setOpenTabs((prev) => {
        const remaining = prev.filter((t) => t.id !== fileId);
        if (remaining.length > 0) {
          setSelectedFile(remaining[remaining.length - 1]);
        } else {
          setSelectedFile(null);
        }
        return prev;
      });
    }
  }, [selectedFile]);

  const handleEditorChange = useCallback((fileId: string, content: string) => {
    setFileContents((prev) => ({
      ...prev,
      [fileId]: content,
    }));
    setUnsavedChanges((prev) => new Set(prev).add(fileId));
  }, []);

  const handleSave = useCallback(() => {
    if (!selectedFile) return;

    // Require auth for save action
    if (!requireAuth({ name: 'Claw AI App', description: 'Your AI-powered project' })) {
      return;
    }

    // User is authenticated, proceed with save
    setUnsavedChanges((prev) => {
      const next = new Set(prev);
      next.delete(selectedFile.id);
      return next;
    });
  }, [selectedFile, requireAuth]);

  // Auth-gated actions
  const handleRun = useCallback(() => {
    if (!requireAuth({ name: 'Claw AI App' })) return;
    // Run project implementation
  }, [requireAuth]);

  const handleGit = useCallback(() => {
    if (!requireAuth({ name: 'Claw AI App' })) return;
    // Open git implementation
  }, [requireAuth]);

  const handleTerminal = useCallback(() => {
    if (!requireAuth({ name: 'Claw AI App' })) return;
    // Open terminal implementation
  }, [requireAuth]);

  const handleNewProject = useCallback(() => {
    if (!requireAuth({ name: 'New Project' })) return;
    // Create new project implementation
  }, [requireAuth]);

  const currentContent = selectedFile
    ? fileContents[selectedFile.id] ?? selectedFile.content ?? ''
    : '';

  return (
    <div className={cn('flex h-full bg-[#0d1117] rounded-lg overflow-hidden', className)}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-r border-white/5 flex-shrink-0 overflow-hidden"
          >
            <FileExplorer
              files={files}
              selectedFile={selectedFile?.id}
              onSelectFile={handleSelectFile}
              projectName="Claw AI App"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-2 py-1 border-b border-white/5 bg-[#161b22]">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              title={sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeft className="w-4 h-4" />
              )}
            </button>

            <button
              className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              disabled={!selectedFile || !unsavedChanges.has(selectedFile.id)}
              className={cn(
                'p-1.5 rounded transition-colors',
                selectedFile && unsavedChanges.has(selectedFile.id)
                  ? 'text-orange-400 hover:bg-orange-500/20'
                  : 'text-white/30 cursor-not-allowed'
              )}
              title="Save (⌘S)"
            >
              <Save className="w-4 h-4" />
            </button>

            <button
              onClick={handleRun}
              className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-green-400 transition-colors"
              title="Run (requires sign in)"
            >
              <Play className="w-4 h-4" />
            </button>

            <button
              onClick={handleGit}
              className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              title="Git (requires sign in)"
            >
              <GitBranch className="w-4 h-4" />
            </button>

            <button
              onClick={handleTerminal}
              className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              title="Terminal (requires sign in)"
            >
              <Terminal className="w-4 h-4" />
            </button>

            <button
              onClick={handleNewProject}
              className="p-1.5 rounded hover:bg-white/10 text-orange-400 hover:text-orange-300 transition-colors"
              title="New Project (requires sign in)"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        {openTabs.length > 0 && (
          <div ref={tabScrollRef} className="flex items-center border-b border-white/5 bg-[#0d1117] overflow-x-auto scrollbar-hide">
            {openTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFile(tab)}
                className={cn(
                  'group flex items-center gap-2 px-3 py-2 text-xs border-r border-white/5 transition-colors',
                  selectedFile?.id === tab.id
                    ? 'bg-[#161b22] text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                <span className={unsavedChanges.has(tab.id) ? 'text-orange-400' : ''}>
                  {tab.name}
                </span>
                {unsavedChanges.has(tab.id) && (
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                )}
                <button
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </button>
            ))}
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          {selectedFile ? (
            <CodeEditor
              fileName={selectedFile.name}
              initialValue={currentContent}
              onChange={(content) => handleEditorChange(selectedFile.id, content)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white/30">
              <div className="text-center">
                <p className="text-lg mb-2">No file selected</p>
                <p className="text-sm">Select a file from the explorer to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auth Gate Modal */}
      <BuildModeGate
        isOpen={isGateOpen}
        onClose={closeGate}
        onSignedIn={onSignedIn}
        projectContext={projectContext}
      />
    </div>
  );
}

export default IDEView;
