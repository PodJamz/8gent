'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  Trash2,
  X,
  Brain,
  Database,
  Clock,
  ChevronRight,
  Zap,
  AtSign,
  FileCode,
  Folder,
  FileText,
} from 'lucide-react';
import { ChatThread } from '@/hooks/useChatThreads';
import { cn } from '@/lib/utils';

// Import theme styles
import '@/lib/themes/themes.css';

// =============================================================================
// Types
// =============================================================================

interface MemoryStats {
  episodic: number;
  semantic: number;
  working: number;
}

interface RecentMention {
  id: string;
  type: 'project' | 'prd' | 'ticket' | 'file';
  name: string;
  timestamp: number;
}

interface ActiveTask {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  progress?: number;
}

interface AgentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  threads: ChatThread[];
  activeThreadId: string | null;
  onNewThread: () => void;
  onSelectThread: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
  memoryStats?: MemoryStats;
  recentMentions?: RecentMention[];
  activeTask?: ActiveTask | null;
  onMentionClick?: (mention: RecentMention) => void;
}

// =============================================================================
// Utility Functions
// =============================================================================

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
}

function getMentionIcon(type: RecentMention['type']) {
  switch (type) {
    case 'project':
      return Folder;
    case 'prd':
      return FileText;
    case 'ticket':
      return FileCode;
    case 'file':
      return FileCode;
    default:
      return AtSign;
  }
}

function getStatusColor(status: ActiveTask['status']) {
  switch (status) {
    case 'running':
      return 'text-green-400';
    case 'paused':
      return 'text-yellow-400';
    case 'failed':
      return 'text-red-400';
    case 'completed':
      return 'text-blue-400';
    default:
      return 'text-muted-foreground';
  }
}

// =============================================================================
// Component
// =============================================================================

export function AgentSidebar({
  isOpen,
  onClose,
  threads,
  activeThreadId,
  onNewThread,
  onSelectThread,
  onDeleteThread,
  memoryStats = { episodic: 0, semantic: 0, working: 0 },
  recentMentions = [],
  activeTask = null,
  onMentionClick,
}: AgentSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - mobile only */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto',
              'w-80 max-w-[85vw] lg:w-72 xl:w-80',
              'flex flex-col',
              'touch-none lg:touch-auto'
            )}
            style={{
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              background: 'hsl(var(--theme-chat-sidebar-bg, var(--theme-card)))',
              borderRight: '1px solid hsl(var(--theme-chat-sidebar-border, var(--theme-border)))',
              fontFamily: 'var(--theme-font)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-4"
              style={{ borderBottom: '1px solid hsl(var(--theme-border))' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'hsl(var(--theme-primary) / 0.2)' }}
                >
                  <Zap className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                </div>
                <h2 className="text-lg font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>
                  Agent
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors lg:hidden"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--theme-muted))'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* New Chat Button */}
            <div className="px-3 py-3">
              <button
                onClick={() => {
                  onNewThread();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{
                  background: 'hsl(var(--theme-primary))',
                  color: 'hsl(var(--theme-primary-foreground))',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">New session</span>
              </button>
            </div>

            {/* Active Task (if any) */}
            {activeTask && (
              <div className="px-3 pb-2">
                <div className="px-3 py-2.5 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn('w-2 h-2 rounded-full',
                      activeTask.status === 'running' && 'bg-green-400 animate-pulse',
                      activeTask.status === 'paused' && 'bg-yellow-400',
                      activeTask.status === 'completed' && 'bg-blue-400',
                      activeTask.status === 'failed' && 'bg-red-400',
                      activeTask.status === 'pending' && 'bg-muted-foreground'
                    )} />
                    <span className={cn('text-xs font-medium uppercase', getStatusColor(activeTask.status))}>
                      {activeTask.status}
                    </span>
                  </div>
                  <p className="text-sm text-foreground truncate">{activeTask.title}</p>
                  {activeTask.progress !== undefined && (
                    <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeTask.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Memory Indicator */}
            <div className="px-3 pb-2">
              <div
                className="px-3 py-2 rounded-lg"
                style={{ background: 'hsl(var(--theme-muted) / 0.3)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                  <span
                    className="text-xs font-medium uppercase tracking-wide"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    Memory
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>{memoryStats.episodic}</div>
                    <div className="text-[10px]" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Episodic</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>{memoryStats.semantic}</div>
                    <div className="text-[10px]" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Semantic</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>{memoryStats.working}</div>
                    <div className="text-[10px]" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Working</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent @ Mentions */}
            {recentMentions.length > 0 && (
              <div className="px-3 pb-2">
                <div className="px-1 mb-2">
                  <span
                    className="text-xs font-medium uppercase tracking-wide flex items-center gap-1.5"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    <AtSign className="w-3 h-3" />
                    Recent Mentions
                  </span>
                </div>
                <div className="space-y-1">
                  {recentMentions.slice(0, 5).map((mention) => {
                    const Icon = getMentionIcon(mention.type);
                    return (
                      <button
                        key={mention.id}
                        onClick={() => onMentionClick?.(mention)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-left"
                        onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--theme-muted))'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                        <span className="text-sm truncate flex-1" style={{ color: 'hsl(var(--theme-foreground))' }}>
                          @{mention.name}
                        </span>
                        <ChevronRight className="w-3 h-3" style={{ color: 'hsl(var(--theme-muted-foreground) / 0.5)' }} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Thread List */}
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              <div className="px-1 mb-2">
                <span
                  className="text-xs font-medium uppercase tracking-wide flex items-center gap-1.5"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  <MessageSquare className="w-3 h-3" />
                  Sessions
                </span>
              </div>

              {threads.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3" style={{ color: 'hsl(var(--theme-muted-foreground) / 0.3)' }} />
                  <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>No sessions yet</p>
                  <p className="text-xs mt-1" style={{ color: 'hsl(var(--theme-muted-foreground) / 0.7)' }}>
                    Start a new session to begin
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {threads.map((thread) => (
                    <motion.div
                      key={thread.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative"
                    >
                      <button
                        onClick={() => {
                          onSelectThread(thread.id);
                          // Only close on mobile
                          if (window.innerWidth < 1024) {
                            onClose();
                          }
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-lg transition-all"
                        style={{
                          background: thread.id === activeThreadId ? 'hsl(var(--theme-primary) / 0.1)' : 'transparent',
                          borderLeft: thread.id === activeThreadId
                            ? '2px solid hsl(var(--theme-chat-sidebar-active, var(--theme-primary)))'
                            : '2px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (thread.id !== activeThreadId) e.currentTarget.style.background = 'hsl(var(--theme-chat-sidebar-hover, var(--theme-muted)))';
                        }}
                        onMouseLeave={(e) => {
                          if (thread.id !== activeThreadId) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div className="flex items-start gap-2.5">
                          <MessageSquare
                            className="w-4 h-4 mt-0.5 flex-shrink-0"
                            style={{
                              color: thread.id === activeThreadId
                                ? 'hsl(var(--theme-primary))'
                                : 'hsl(var(--theme-muted-foreground))',
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-medium truncate"
                              style={{
                                color: thread.id === activeThreadId
                                  ? 'hsl(var(--theme-foreground))'
                                  : 'hsl(var(--theme-muted-foreground))',
                              }}
                            >
                              {thread.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px]" style={{ color: 'hsl(var(--theme-muted-foreground) / 0.7)' }}>
                                {thread.messages.length} msg{thread.messages.length !== 1 ? 's' : ''}
                              </span>
                              <span className="text-[10px]" style={{ color: 'hsl(var(--theme-muted-foreground) / 0.5)' }}>·</span>
                              <span className="text-[10px]" style={{ color: 'hsl(var(--theme-muted-foreground) / 0.7)' }}>
                                {formatTimeAgo(thread.lastModified)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Delete button (on hover) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteThread(thread.id);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        aria-label="Delete session"
                        style={{ background: 'hsl(var(--theme-muted))' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(0 84% 60% / 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'hsl(var(--theme-muted))'}
                      >
                        <Trash2 className="w-3.5 h-3.5" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="px-4 py-3"
              style={{ borderTop: '1px solid hsl(var(--theme-border))' }}
            >
              <div className="flex items-center justify-between text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                <span>{threads.length} session{threads.length !== 1 ? 's' : ''}</span>
                <div className="flex items-center gap-1.5">
                  <Database className="w-3 h-3" />
                  <span>Convex</span>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default AgentSidebar;
