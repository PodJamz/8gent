'use client';

import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Plus, MessageSquare, Trash2, X } from 'lucide-react';
import { ChatThread } from '@/hooks/useChatThreads';
import '@/lib/themes/themes.css';

interface ChatThreadsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  threads: ChatThread[];
  activeThreadId: string | null;
  onNewThread: () => void;
  onSelectThread: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
}

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

export function ChatThreadsSidebar({
  isOpen,
  onClose,
  threads,
  activeThreadId,
  onNewThread,
  onSelectThread,
  onDeleteThread,
}: ChatThreadsSidebarProps) {
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -100 || info.velocity.x < -500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.2, right: 0 }}
            onDragEnd={handleDragEnd}
            className="fixed inset-y-0 left-0 w-80 max-w-[85vw] z-50 flex flex-col touch-none"
            style={{
              background: 'hsl(var(--theme-background))',
              borderRight: '1px solid hsl(var(--theme-border))',
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-4"
              style={{ borderBottom: '1px solid hsl(var(--theme-border))' }}
            >
              <h2
                className="text-lg font-semibold"
                style={{ color: 'hsl(var(--theme-foreground))' }}
              >
                Conversations
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
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
                  background: 'linear-gradient(135deg, hsl(var(--theme-primary)), hsl(var(--theme-accent)))',
                  color: 'hsl(var(--theme-primary-foreground))',
                  boxShadow: '0 4px 15px hsl(var(--theme-primary) / 0.3)',
                }}
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">New conversation</span>
              </button>
            </div>

            {/* Thread List */}
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              {threads.length === 0 ? (
                <div
                  className="text-center py-8 px-4"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-1 opacity-70">
                    Start a new conversation to get going
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
                          onClose();
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl transition-all"
                        style={{
                          background: thread.id === activeThreadId
                            ? 'hsl(var(--theme-primary) / 0.15)'
                            : 'transparent',
                          borderLeft: thread.id === activeThreadId
                            ? '3px solid hsl(var(--theme-primary))'
                            : '3px solid transparent',
                        }}
                      >
                        <div className="flex items-start gap-3">
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
                                  : 'hsl(var(--theme-card-foreground))',
                              }}
                            >
                              {thread.title}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                            >
                              {thread.messages.length} message{thread.messages.length !== 1 ? 's' : ''} · {formatTimeAgo(thread.lastModified)}
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Delete button (on hover/focus) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteThread(thread.id);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        style={{
                          background: 'hsl(var(--theme-muted))',
                          color: 'hsl(var(--theme-muted-foreground))',
                        }}
                        aria-label="Delete conversation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="px-4 py-3 text-center"
              style={{
                borderTop: '1px solid hsl(var(--theme-border))',
                color: 'hsl(var(--theme-muted-foreground))',
              }}
            >
              <p className="text-xs">
                {threads.length} conversation{threads.length !== 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
