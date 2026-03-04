'use client';

import { useState, useRef, memo } from 'react';
import { useHorizontalScroll } from '@/hooks';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { X, Play, Pause, CheckCircle, XCircle, Loader2, Eye, MoreHorizontal } from 'lucide-react';
import {
  Thread,
  ThreadType,
  ThreadStatus,
  THREAD_TYPE_COLORS,
  THREAD_TYPE_NAMES,
  MODEL_INFO,
  formatDuration,
} from '@/lib/threads';

// ============================================================================
// Types
// ============================================================================

interface ThreadDockProps {
  threads: Thread[];
  selectedThreadId?: string;
  onSelectThread: (id: string) => void;
  onCloseThread: (id: string) => void;
  onReorderThreads?: (threads: Thread[]) => void;
  maxVisible?: number;
  className?: string;
}

// ============================================================================
// Thread Tab Component
// ============================================================================

interface ThreadTabProps {
  thread: Thread;
  isSelected: boolean;
  onSelect: () => void;
  onClose: () => void;
}

const ThreadTab = memo(function ThreadTab({
  thread,
  isSelected,
  onSelect,
  onClose,
}: ThreadTabProps) {
  const colors = THREAD_TYPE_COLORS[thread.type];

  const statusIcon = {
    idle: <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />,
    running: (
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-green-500"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    ),
    paused: <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />,
    completed: <CheckCircle className="w-3 h-3 text-green-500" />,
    failed: <XCircle className="w-3 h-3 text-red-500" />,
    reviewing: (
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-purple-500"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    ),
    fusing: (
      <Loader2 className="w-3 h-3 text-purple-500 animate-spin" />
    ),
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      whileHover={{ y: -2 }}
      className={`
        relative group flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-t-lg cursor-pointer
        transition-colors border-b-2 flex-shrink-0
        ${isSelected
          ? 'bg-zinc-800 border-b-transparent'
          : 'bg-zinc-900/80 border-b-zinc-700/50 hover:bg-zinc-800/80'
        }
      `}
      onClick={onSelect}
      style={{
        borderTopColor: isSelected ? colors.glow : 'transparent',
        borderTopWidth: 2,
      }}
    >
      {/* Thread type indicator */}
      <div
        className={`w-0.5 sm:w-1 h-3 sm:h-4 rounded-full ${colors.bg}`}
        style={{
          boxShadow: isSelected ? `0 0 8px ${colors.glow}` : 'none',
        }}
      />

      {/* Status indicator */}
      <div className="flex-shrink-0">
        {statusIcon[thread.status]}
      </div>

      {/* Thread name */}
      <span className={`text-[10px] sm:text-xs font-medium truncate max-w-[50px] sm:max-w-[80px] ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
        {thread.name}
      </span>

      {/* Progress bar for running threads - hidden on small mobile */}
      {thread.status === 'running' && (
        <div className="hidden sm:block w-8 h-1 bg-zinc-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${thread.progress}%` }}
          />
        </div>
      )}

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="flex-shrink-0 p-0.5 rounded hover:bg-zinc-700 opacity-0 group-hover:opacity-100 sm:transition-opacity"
      >
        <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-400 hover:text-white" />
      </button>
    </motion.div>
  );
});

// ============================================================================
// Thread Dock Component
// ============================================================================

export function ThreadDock({
  threads,
  selectedThreadId,
  onSelectThread,
  onCloseThread,
  onReorderThreads,
  maxVisible = 8,
  className = '',
}: ThreadDockProps) {
  // Use fewer visible tabs on mobile (will be controlled via CSS or could use a hook)
  const mobileMaxVisible = 4;
  const [showOverflow, setShowOverflow] = useState(false);
  const scrollRef = useHorizontalScroll<HTMLDivElement>();

  const visibleThreads = threads.slice(0, maxVisible);
  const overflowThreads = threads.slice(maxVisible);
  const hasOverflow = overflowThreads.length > 0;

  // Group threads by type for overflow menu
  const threadsByType = threads.reduce((acc, thread) => {
    if (!acc[thread.type]) acc[thread.type] = [];
    acc[thread.type].push(thread);
    return acc;
  }, {} as Record<ThreadType, Thread[]>);

  return (
    <div className={`relative ${className}`}>
      {/* Main dock */}
      <div
        ref={scrollRef}
        className="flex items-end gap-0.5 px-1 sm:px-2 pb-0 overflow-x-auto scrollbar-hide"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
        }}
      >
        {/* Add new thread button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-t-lg bg-zinc-800/50 border border-zinc-700/50 border-b-0 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <span className="text-base sm:text-lg font-light">+</span>
        </motion.button>

        {/* Thread tabs - scroll horizontally on mobile */}
        <AnimatePresence mode="popLayout">
          {visibleThreads.map((thread) => (
            <ThreadTab
              key={thread.id}
              thread={thread}
              isSelected={thread.id === selectedThreadId}
              onSelect={() => onSelectThread(thread.id)}
              onClose={() => onCloseThread(thread.id)}
            />
          ))}
        </AnimatePresence>

        {/* Overflow indicator */}
        {hasOverflow && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowOverflow(!showOverflow)}
            className="flex-shrink-0 relative flex items-center gap-1 px-1.5 sm:px-2 py-1.5 rounded-t-lg bg-zinc-900/80 hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors"
          >
            <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-[9px] sm:text-[10px] font-bold bg-zinc-700 px-1 rounded">
              +{overflowThreads.length}
            </span>
          </motion.button>
        )}

        {/* Spacer */}
        <div className="flex-1 min-w-4" />

        {/* Stats summary - hidden on small mobile */}
        <div className="hidden xs:flex flex-shrink-0 items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 text-[9px] sm:text-[10px] text-zinc-500">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>{threads.filter((t) => t.status === 'running').length}</span>
            <span className="hidden sm:inline">running</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-zinc-600" />
            <span>{threads.filter((t) => t.status === 'completed').length}</span>
            <span className="hidden sm:inline">done</span>
          </div>
        </div>
      </div>

      {/* Overflow dropdown */}
      <AnimatePresence>
        {showOverflow && hasOverflow && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute bottom-full right-0 mb-1 w-64 max-h-80 overflow-auto rounded-lg bg-zinc-900 border border-zinc-800 shadow-xl"
          >
            <div className="p-2">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wide px-2 py-1">
                All Threads ({threads.length})
              </div>
              {Object.entries(threadsByType).map(([type, typeThreads]) => (
                <div key={type} className="mb-2">
                  <div className={`text-[9px] font-bold uppercase tracking-wide px-2 py-1 ${THREAD_TYPE_COLORS[type as ThreadType].text}`}>
                    {THREAD_TYPE_NAMES[type as ThreadType]} ({typeThreads.length})
                  </div>
                  {typeThreads.map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => {
                        onSelectThread(thread.id);
                        setShowOverflow(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-800 transition-colors ${
                        thread.id === selectedThreadId ? 'bg-zinc-800' : ''
                      }`}
                    >
                      <div className={`w-1 h-3 rounded-full ${THREAD_TYPE_COLORS[thread.type].bg}`} />
                      <span className="text-xs text-zinc-300 truncate flex-1 text-left">
                        {thread.name}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {thread.progress}%
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThreadDock;
