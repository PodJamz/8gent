'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, PanelLeftClose, PanelLeft, Code, Play, Square, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@/lib/openclaw/hooks';
import { useUser } from '@clerk/nextjs';

// Components
import { AgentSidebar } from '@/components/agent/AgentSidebar';
import { ContextBar, ContextEntity, ViewDimension } from '@/components/agent/ContextBar';
import { CodePanel, CodePanelTab, FileNode, TerminalOutput } from '@/components/agent/CodePanel';
import { AgentChat, ChatMessage, MentionSuggestion } from '@/components/agent/AgentChat';
import { GitHubAuthModal } from '@/components/auth/GitHubAuthModal';
import { AgentAccessRestricted } from '@/components/auth/AgentAccessRestricted';

// Contexts & Providers
import { SandboxProvider } from '@/contexts/SandboxContext';

// Theme support
import '@/lib/themes/themes.css';

// Hooks
import { useChatThreads } from '@/hooks/useChatThreads';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import { useAgentSandbox } from '@/hooks/useAgentSandbox';
import type { FileInfo } from '@/lib/sandbox';

// Import Convex API (userManagement may not be configured in all deployments)
import { api } from '@/lib/convex-shim';

// Type-safe check for userManagement API
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getManagedUserQuery = (api as any)?.userManagement?.getManagedUserByClerkId ?? null;

// =============================================================================
// Sample Data (will be replaced with real data from Convex)
// =============================================================================

const SAMPLE_MEMORY_STATS = {
  episodic: 42,
  semantic: 18,
  working: 3,
};

const SAMPLE_MENTIONS: MentionSuggestion[] = [
  { id: 'proj-1', type: 'project', name: '8gent', description: 'Professional agentic operating system' },
  { id: 'proj-2', type: 'project', name: 'OpenClaw', description: 'Next-gen agent platform' },
  { id: 'prd-1', type: 'prd', name: 'infinity-agent', description: 'PRD for coding agent integration' },
  { id: 'ticket-1', type: 'ticket', name: 'ARC-001', description: 'Implement context bar component' },
  { id: 'ticket-2', type: 'ticket', name: 'ARC-002', description: 'Add code panel with monaco editor' },
  { id: 'file-1', type: 'file', name: 'agent/page.tsx', description: 'Main agent page component' },
];

// =============================================================================
// Convert FileInfo to FileNode for tree view
// =============================================================================

function convertFilesToTree(files: FileInfo[]): FileNode[] {
  const root: FileNode[] = [];
  const pathMap = new Map<string, FileNode>();

  // Sort files so directories come first
  const sorted = [...files].sort((a, b) => {
    if (a.type === 'directory' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'directory') return 1;
    return a.path.localeCompare(b.path);
  });

  for (const file of sorted) {
    const parts = file.path.split('/').filter(Boolean);
    const name = parts[parts.length - 1];
    const parentPath = '/' + parts.slice(0, -1).join('/');

    const node: FileNode = {
      name,
      path: file.path,
      type: file.type === 'directory' ? 'folder' : 'file',
      children: file.type === 'directory' ? [] : undefined,
      language: file.type === 'file' ? detectLanguage(name) : undefined,
    };

    pathMap.set(file.path, node);

    if (parts.length === 1 || parentPath === '/home/user' || parentPath === '/home') {
      root.push(node);
    } else {
      const parent = pathMap.get(parentPath);
      if (parent && parent.children) {
        parent.children.push(node);
      } else {
        root.push(node);
      }
    }
  }

  return root;
}

function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    md: 'markdown',
    css: 'css',
    html: 'html',
    py: 'python',
  };
  return langMap[ext || ''] || 'plaintext';
}

// =============================================================================
// Auth error detection helpers
// =============================================================================

const AUTH_ERROR_PATTERNS = [
  'Authentication required',
  'authentication required',
  'Unauthorized',
  'unauthorized',
  'GitHub OAuth',
  'OAuth',
  'oauth',
  'token expired',
  'Token expired',
  'invalid token',
  'Invalid token',
  'access denied',
  'Access denied',
  'not authenticated',
  'Not authenticated',
  'Status code 400', // Sandbox API returns 400 when auth is missing
  'Status code 401',
  'Status code 403',
];

function isAuthError(error: string | null): boolean {
  if (!error) return false;
  return AUTH_ERROR_PATTERNS.some((pattern) => error.includes(pattern));
}

// =============================================================================
// Main Page Content (with sandbox context)
// =============================================================================

// =============================================================================
// Owner Check Wrapper - Separates auth logic from main content
// =============================================================================

function OwnerGate({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const clerkId = user?.id;

  // IMPORTANT: Always call useQuery with the same query reference to maintain hook stability
  // If getManagedUserQuery is null, we pass 'skip' to skip the query entirely
  const managedUser = useQuery(
    getManagedUserQuery!,
    getManagedUserQuery && clerkId ? { clerkId } : 'skip'
  );

  // Determine loading and owner status
  const isLoading = !isClerkLoaded || (getManagedUserQuery && clerkId && managedUser === undefined);

  // If no user management API configured, allow access (backwards compat)
  // Otherwise, check if user is owner/admin
  const isOwner = !getManagedUserQuery || managedUser?.role === 'owner' || managedUser?.role === 'admin';

  // Check if user is signed in but not in the database
  const isSignedInButNotInDb = isClerkLoaded && user && getManagedUserQuery && managedUser === null;

  if (isLoading) {
    return <AgentAccessRestricted isLoading />;
  }

  if (!isOwner) {
    // Pass user info for the "signed in but not owner" case
    return (
      <AgentAccessRestricted
        isSignedIn={!!user}
        clerkId={clerkId}
        userEmail={user?.primaryEmailAddress?.emailAddress}
      />
    );
  }

  return <>{children}</>;
}

// =============================================================================
// Main Page Content (with sandbox context)
// =============================================================================

function AgentPageContent() {
  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | undefined>();
  const previousErrorRef = useRef<string | null>(null);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Context state
  const [contextChain, setContextChain] = useState<ContextEntity[]>([]);
  const [currentView, setCurrentView] = useState<ViewDimension>('chat');

  // Code panel state
  const [isCodePanelVisible, setIsCodePanelVisible] = useState(false);
  const [isCodePanelExpanded, setIsCodePanelExpanded] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<CodePanelTab>('code');

  // Chat state
  const [mentionSuggestions, setMentionSuggestions] = useState<MentionSuggestion[]>([]);

  // Sandbox hook
  const sandbox = useAgentSandbox();

  // Detect auth errors from sandbox and show modal
  useEffect(() => {
    const currentError = sandbox.error;

    // Only trigger modal if error changed and is an auth error
    if (currentError !== previousErrorRef.current && isAuthError(currentError)) {
      setAuthErrorMessage(currentError || 'Authentication required');
      setIsAuthModalOpen(true);
    }

    previousErrorRef.current = currentError;
  }, [sandbox.error]);

  // Also detect auth errors from terminal output
  useEffect(() => {
    const lastTerminalLine = sandbox.terminalOutput[sandbox.terminalOutput.length - 1];
    if (lastTerminalLine?.type === 'error' && isAuthError(lastTerminalLine.content)) {
      setAuthErrorMessage(lastTerminalLine.content);
      setIsAuthModalOpen(true);
    }
  }, [sandbox.terminalOutput]);

  // Convert sandbox files to tree structure (must be before early returns - hooks rule)
  const fileTree = useMemo(() => convertFilesToTree(sandbox.files), [sandbox.files]);

  // Convert terminal output to CodePanel format
  const terminalOutput: TerminalOutput[] = useMemo(
    () =>
      sandbox.terminalOutput.map((line) => ({
        id: line.id,
        type: line.type === 'command' ? 'command' : line.type === 'error' ? 'error' : 'output',
        content: line.content,
        timestamp: line.timestamp,
      })),
    [sandbox.terminalOutput]
  );

  // Chat hooks (must be before early returns - hooks rule)
  const {
    threads,
    activeThreadId,
    createThread,
    switchThread,
    deleteThread,
    ensureThread,
  } = useChatThreads();

  const {
    messages: streamingMessages,
    isStreaming,
    sendMessage: sendStreamingMessage,
    abortStream,
  } = useStreamingChat({
    onStreamStart: () => console.log('Stream started'),
    onStreamEnd: () => console.log('Stream ended'),
  });

  // Convert streaming messages to ChatMessage format
  const chatMessages: ChatMessage[] = useMemo(() => streamingMessages.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    timestamp: m.timestamp,
    isStreaming: m.isStreaming,
  })), [streamingMessages]);

  // Handle successful authentication
  const handleAuthenticated = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthErrorMessage(undefined);
    // Retry starting sandbox after auth
    sandbox.startSandbox();
  }, [sandbox]);

  // Handle sending message
  const handleSendMessage = useCallback(
    (content: string, mentions?: ContextEntity[]) => {
      // Ensure we have a thread
      ensureThread();

      // Add mentions to context chain if any
      if (mentions && mentions.length > 0) {
        setContextChain((prev) => {
          const newChain = [...prev];
          mentions.forEach((m) => {
            if (!newChain.find((e) => e.id === m.id)) {
              newChain.push(m);
            }
          });
          return newChain;
        });
      }

      // Build context info
      let contextInfo = '';

      // Add sandbox capabilities when connected
      if (sandbox.isConnected) {
        contextInfo += '\n\n[SANDBOX CONNECTED - You have full coding capabilities: clone repos with git, run terminal commands, create/edit files, install packages, run dev servers. Use the terminal below to execute commands.]';
      }

      // Add active context chain
      if (contextChain.length > 0) {
        contextInfo += `\n\n[Active Context: ${contextChain.map(c => `@${c.type}:${c.name}`).join(', ')}]`;
      }

      sendStreamingMessage(content + contextInfo);

      // If the message contains code-related keywords, show code panel
      const codeKeywords = ['code', 'implement', 'create', 'build', 'fix', 'debug', 'file', 'component', 'clone', 'repo', 'git'];
      if (codeKeywords.some((kw) => content.toLowerCase().includes(kw))) {
        setIsCodePanelVisible(true);
      }
    },
    [ensureThread, sendStreamingMessage, contextChain, sandbox.isConnected]
  );

  // Handle mention search
  const handleMentionSearch = useCallback((query: string) => {
    const filtered = SAMPLE_MENTIONS.filter(
      (m) =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.description?.toLowerCase().includes(query.toLowerCase())
    );
    setMentionSuggestions(filtered);
  }, []);

  // Handle mention select
  const handleMentionSelect = useCallback((mention: MentionSuggestion) => {
    const entity: ContextEntity = {
      id: mention.id,
      type: mention.type,
      name: mention.name,
      description: mention.description,
    };
    setContextChain((prev) => {
      if (prev.find((e) => e.id === entity.id)) return prev;
      return [...prev, entity];
    });
  }, []);

  // Handle context chain changes
  const handleRemoveEntity = useCallback((entityId: string) => {
    setContextChain((prev) => prev.filter((e) => e.id !== entityId));
  }, []);

  const handleClearContext = useCallback(() => {
    setContextChain([]);
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(
    async (path: string) => {
      if (sandbox.isConnected) {
        try {
          await sandbox.readFile(path);
          setActiveCodeTab('code');
        } catch (error) {
          console.error('Failed to read file:', error);
        }
      }
    },
    [sandbox]
  );

  // Handle terminal command
  const handleRunCommand = useCallback(
    async (command: string) => {
      if (sandbox.isConnected) {
        await sandbox.runCommand(command);
      }
    },
    [sandbox]
  );

  // Handle mobile sidebar toggle
  const handleMobileSidebarToggle = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Handle desktop sidebar collapse
  const handleDesktopSidebarToggle = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* GitHub Auth Modal - shown on auth errors for owner */}
      <GitHubAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={handleAuthenticated}
        errorMessage={authErrorMessage}
      />

      <div
        className="h-screen flex flex-col overflow-hidden"
        style={{
          background: 'hsl(var(--theme-background))',
          color: 'hsl(var(--theme-foreground))',
          fontFamily: 'var(--theme-font)',
        }}
      >
        {/* Main Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <AnimatePresence>
            {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) &&
              !isSidebarCollapsed && (
                <AgentSidebar
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                  threads={threads}
                  activeThreadId={activeThreadId}
                  onNewThread={createThread}
                  onSelectThread={switchThread}
                  onDeleteThread={deleteThread}
                  memoryStats={SAMPLE_MEMORY_STATS}
                  recentMentions={contextChain.slice(-5).map((c) => ({
                    id: c.id,
                    type: c.type as 'project' | 'prd' | 'ticket' | 'file',
                    name: c.name,
                    timestamp: Date.now(),
                  }))}
                  onMentionClick={(mention) => {
                    const entity = contextChain.find((e) => e.id === mention.id);
                    if (entity) {
                      console.log('Clicked mention:', entity);
                    }
                  }}
                />
              )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Bar */}
            <div
              className="flex items-center gap-2 px-4 py-2"
              style={{
                background: 'hsl(var(--theme-card))',
                borderBottom: '1px solid hsl(var(--theme-border))',
              }}
            >
              {/* Mobile menu button */}
              <button
                onClick={handleMobileSidebarToggle}
                className="p-2 rounded-lg transition-colors lg:hidden"
                style={{ color: 'hsl(var(--theme-foreground))' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--theme-muted))'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop sidebar toggle */}
              <button
                onClick={handleDesktopSidebarToggle}
                className="p-2 rounded-lg transition-colors hidden lg:flex"
                title={isSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
                style={{ color: 'hsl(var(--theme-foreground))' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--theme-muted))'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {isSidebarCollapsed ? (
                  <PanelLeft className="w-5 h-5" />
                ) : (
                  <PanelLeftClose className="w-5 h-5" />
                )}
              </button>

              {/* Title */}
              <h1
                className="text-lg font-semibold"
                style={{ color: 'hsl(var(--theme-foreground))' }}
              >
                Open8gent
              </h1>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Sandbox controls */}
              <div className="flex items-center gap-2">
                {!sandbox.isConnected ? (
                  <button
                    onClick={sandbox.startSandbox}
                    disabled={sandbox.isCreating}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    style={{
                      background: 'hsl(var(--theme-primary) / 0.2)',
                      color: 'hsl(var(--theme-primary))',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--theme-primary) / 0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'hsl(var(--theme-primary) / 0.2)'}
                  >
                    {sandbox.isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start Sandbox
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={sandbox.stopSandbox}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
                    style={{
                      background: 'hsl(0 84% 60% / 0.2)',
                      color: 'hsl(0 84% 60%)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(0 84% 60% / 0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'hsl(0 84% 60% / 0.2)'}
                  >
                    <Square className="w-4 h-4" />
                    Stop
                  </button>
                )}

                {sandbox.isConnected && (
                  <span className="text-xs font-medium" style={{ color: 'hsl(142 70% 45%)' }}>● Connected</span>
                )}
              </div>

              {/* Code panel toggle */}
              <button
                onClick={() => setIsCodePanelVisible((prev) => !prev)}
                className="p-2 rounded-lg transition-colors"
                title={isCodePanelVisible ? 'Hide code panel' : 'Show code panel'}
                style={{
                  background: isCodePanelVisible ? 'hsl(var(--theme-primary) / 0.2)' : 'transparent',
                  color: isCodePanelVisible ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-muted-foreground))',
                }}
                onMouseEnter={(e) => {
                  if (!isCodePanelVisible) e.currentTarget.style.background = 'hsl(var(--theme-muted))';
                }}
                onMouseLeave={(e) => {
                  if (!isCodePanelVisible) e.currentTarget.style.background = 'transparent';
                }}
              >
                <Code className="w-5 h-5" />
              </button>
            </div>

            {/* Context Bar */}
            <ContextBar
              contextChain={contextChain}
              currentView={currentView}
              onViewChange={setCurrentView}
              onEntityClick={(entity) => console.log('Entity clicked:', entity)}
              onRemoveEntity={handleRemoveEntity}
              onClearContext={handleClearContext}
            />

            {/* Chat Area */}
            <div className="flex-1 min-h-0">
              <AgentChat
                messages={chatMessages}
                isStreaming={isStreaming}
                onSendMessage={handleSendMessage}
                onAbort={abortStream}
                mentionSuggestions={mentionSuggestions}
                onMentionSearch={handleMentionSearch}
                onMentionSelect={handleMentionSelect}
                isVoiceEnabled={true}
              />
            </div>

            {/* Code Panel */}
            <AnimatePresence>
              {isCodePanelVisible && (
                <CodePanel
                  isVisible={isCodePanelVisible}
                  isExpanded={isCodePanelExpanded}
                  activeTab={activeCodeTab}
                  onTabChange={setActiveCodeTab}
                  onToggleExpanded={() => setIsCodePanelExpanded((prev) => !prev)}
                  onClose={() => setIsCodePanelVisible(false)}
                  code={sandbox.currentFile?.content || '// Select a file or start coding...'}
                  language={sandbox.currentFile?.language || 'typescript'}
                  currentFile={sandbox.currentFile?.path}
                  onCodeChange={(code) => {
                    if (sandbox.currentFile?.path) {
                      sandbox.writeFile(sandbox.currentFile.path, code);
                    }
                  }}
                  files={fileTree}
                  onFileSelect={handleFileSelect}
                  terminalOutput={terminalOutput}
                  onRunCommand={handleRunCommand}
                  isRunning={sandbox.isRunning}
                  previewUrl={sandbox.previewUrl || undefined}
                  onRefreshPreview={() => {
                    if (sandbox.isConnected) {
                      sandbox.startDevServer();
                    }
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// Main Page Component with Provider
// =============================================================================

function AgentPage() {
  return (
    <OwnerGate>
      <SandboxProvider>
        <AgentPageContent />
      </SandboxProvider>
    </OwnerGate>
  );
}

// Use dynamic import with SSR disabled to prevent pre-render errors
// This is required because useUser needs ClerkProvider which is only available client-side
export default dynamic(() => Promise.resolve(AgentPage), {
  ssr: false,
  loading: () => <AgentAccessRestricted isLoading />,
});
