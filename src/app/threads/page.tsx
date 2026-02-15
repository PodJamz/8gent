'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Cpu,
  Activity,
  Zap,
  GitBranch,
  GitMerge,
  Layers,
  Clock,
  DollarSign,
  TrendingUp,
  Settings,
  Info,
  Terminal,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { ThreadControlDeck } from '@/components/threads/ThreadControlDeck';
import { ThreadDock } from '@/components/threads/ThreadDock';
import {
  Thread,
  ThreadType,
  ThreadStatus,
  ModelType,
  THREAD_TYPE_NAMES,
  THREAD_TYPE_COLORS,
  MODEL_INFO,
  generateThreadId,
  formatDuration,
  formatCost,
  formatTokens,
  calculateThreadEfficiency,
} from '@/lib/threads';

// ============================================================================
// Mock Thread Generator
// ============================================================================

function createMockThread(type: ThreadType, index: number): Thread {
  const statuses: ThreadStatus[] = ['idle', 'running', 'paused', 'completed', 'failed'];
  const models: ModelType[] = ['haiku', 'sonnet', 'opus', 'opus-4.5'];

  const names = {
    base: ['Analyze codebase', 'Fix bug #123', 'Refactor utils', 'Add tests'],
    parallel: ['Research A', 'Research B', 'Research C', 'Research D'],
    chained: ['Phase 1: Plan', 'Phase 2: Build', 'Phase 3: Test', 'Phase 4: Deploy'],
    fusion: ['Model A output', 'Model B output', 'Model C output', 'Synthesized'],
    big: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'],
    long: ['Deep research', 'Full audit', 'Migration', 'Refactor all'],
    zero: ['Auto-deploy', 'Auto-fix', 'Auto-test', 'Auto-review'],
  };

  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const model = models[Math.floor(Math.random() * models.length)];
  const progress = status === 'completed' ? 100 : status === 'failed' ? Math.random() * 50 : Math.random() * 100;
  const toolCalls = Math.floor(Math.random() * 500);
  const duration = Math.floor(Math.random() * 300000);

  return {
    id: generateThreadId(),
    type,
    status,
    name: names[type][index % names[type].length],
    prompt: `Execute ${type} thread task`,
    model,
    createdAt: Date.now() - Math.random() * 86400000,
    startedAt: status !== 'idle' ? Date.now() - duration : undefined,
    completedAt: status === 'completed' || status === 'failed' ? Date.now() : undefined,
    progress: Math.round(progress),
    currentStep: status === 'running' ? 'Processing...' : undefined,
    metrics: {
      toolCalls,
      tokensUsed: toolCalls * 150,
      estimatedCost: toolCalls * 0.001,
      duration,
      checkpointCount: Math.floor(Math.random() * 5),
      verificationAttempts: Math.floor(Math.random() * 3) + 1,
      iterations: Math.floor(Math.random() * 10),
    },
  };
}

// ============================================================================
// Stats Card Component
// ============================================================================

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
}

function StatsCard({ icon, label, value, subValue, color = 'text-white' }: StatsCardProps) {
  return (
    <div
      className="p-2 sm:p-3 rounded-lg sm:rounded-xl"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="p-1.5 sm:p-2 rounded-lg bg-white/5">{icon}</div>
        {subValue && <span className="text-[9px] sm:text-[10px] text-zinc-500">{subValue}</span>}
      </div>
      <div className={`mt-1 sm:mt-2 text-lg sm:text-xl font-bold ${color}`}>{value}</div>
      <div className="text-[8px] sm:text-[10px] text-zinc-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}

// ============================================================================
// Thread List Item
// ============================================================================

interface ThreadListItemProps {
  thread: Thread;
  isSelected: boolean;
  onSelect: () => void;
}

function ThreadListItem({ thread, isSelected, onSelect }: ThreadListItemProps) {
  const colors = THREAD_TYPE_COLORS[thread.type];

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onSelect}
      className={`w-full p-3 rounded-lg text-left transition-all ${isSelected
          ? 'bg-zinc-800 border border-zinc-700'
          : 'bg-zinc-900/50 border border-transparent hover:bg-zinc-800/50'
        }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-2 h-full min-h-[40px] rounded-full ${colors.bg}`}
          style={{ boxShadow: `0 0 8px ${colors.glow}` }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white truncate">{thread.name}</span>
            <span className={`text-[9px] font-bold uppercase ${colors.text}`}>
              {thread.type}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded ${thread.status === 'completed'
                  ? 'bg-green-500/20 text-green-400'
                  : thread.status === 'running'
                    ? 'bg-blue-500/20 text-blue-400'
                    : thread.status === 'failed'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-zinc-500/20 text-zinc-400'
                }`}
            >
              {thread.status}
            </span>
            <span className="text-[10px] text-zinc-500">
              {thread.metrics.toolCalls} calls
            </span>
            <span className="text-[10px] text-zinc-500">
              {formatCost(thread.metrics.estimatedCost)}
            </span>
          </div>
          {thread.status === 'running' && (
            <div className="mt-2 h-1 bg-zinc-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${thread.progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function ThreadsPage() {
  // Mock state
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Initialize with mock threads
  useEffect(() => {
    const mockThreads: Thread[] = [];
    const types: ThreadType[] = ['base', 'parallel', 'chained', 'fusion', 'big', 'long'];
    types.forEach((type, ti) => {
      for (let i = 0; i < 2; i++) {
        mockThreads.push(createMockThread(type, ti * 2 + i));
      }
    });
    setThreads(mockThreads);
    if (mockThreads.length > 0) {
      setSelectedThreadId(mockThreads[0].id);
    }
  }, []);

  // Selected thread
  const selectedThread = useMemo(
    () => threads.find((t) => t.id === selectedThreadId),
    [threads, selectedThreadId]
  );

  // Stats
  const stats = useMemo(() => {
    const activeThreads = threads.filter((t) => t.status === 'running').length;
    const totalToolCalls = threads.reduce((sum, t) => sum + t.metrics.toolCalls, 0);
    const totalCost = threads.reduce((sum, t) => sum + t.metrics.estimatedCost, 0);
    const completedThreads = threads.filter((t) => t.status === 'completed');
    const avgEfficiency =
      completedThreads.length > 0
        ? completedThreads.reduce((sum, t) => sum + calculateThreadEfficiency(t), 0) /
        completedThreads.length
        : 0;

    return { activeThreads, totalToolCalls, totalCost, avgEfficiency };
  }, [threads]);

  // Handlers
  const handleCreateThread = useCallback((type: ThreadType) => {
    const newThread = createMockThread(type, threads.length);
    newThread.status = 'idle';
    newThread.progress = 0;
    setThreads((prev) => [...prev, newThread]);
    setSelectedThreadId(newThread.id);
  }, [threads.length]);

  const handleCloseThread = useCallback((id: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== id));
    if (selectedThreadId === id) {
      setSelectedThreadId(threads.find((t) => t.id !== id)?.id);
    }
  }, [selectedThreadId, threads]);

  const handleStartThread = useCallback(() => {
    if (!selectedThreadId) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThreadId
          ? { ...t, status: 'running', startedAt: Date.now() }
          : t
      )
    );
    // Simulate progress
    const interval = setInterval(() => {
      setThreads((prev) =>
        prev.map((t) => {
          if (t.id === selectedThreadId && t.status === 'running') {
            const newProgress = Math.min(t.progress + Math.random() * 10, 100);
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...t, status: 'completed', progress: 100, completedAt: Date.now() };
            }
            return {
              ...t,
              progress: Math.round(newProgress),
              metrics: {
                ...t.metrics,
                toolCalls: t.metrics.toolCalls + Math.floor(Math.random() * 5),
              },
            };
          }
          return t;
        })
      );
    }, 500);
  }, [selectedThreadId]);

  const handlePauseThread = useCallback(() => {
    if (!selectedThreadId) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThreadId ? { ...t, status: 'paused' } : t
      )
    );
  }, [selectedThreadId]);

  const handleStopThread = useCallback(() => {
    if (!selectedThreadId) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThreadId
          ? { ...t, status: 'idle', progress: 0, startedAt: undefined }
          : t
      )
    );
  }, [selectedThreadId]);

  const handleSpawnParallel = useCallback((count: number) => {
    const newThreads: Thread[] = [];
    for (let i = 0; i < count; i++) {
      const thread = createMockThread('parallel', threads.length + i);
      thread.name = `Parallel #${threads.filter((t) => t.type === 'parallel').length + i + 1}`;
      thread.status = 'running';
      thread.progress = 0;
      newThreads.push(thread);
    }
    setThreads((prev) => [...prev, ...newThreads]);
  }, [threads]);

  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
      }}
    >
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">OpenClaw-OS</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">Thread Engine</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <Info className="w-4 h-4" />
          </button>
          <button className="hidden sm:flex p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Thread Dock */}
      <div className="flex-shrink-0 border-b border-white/5">
        <ThreadDock
          threads={threads}
          selectedThreadId={selectedThreadId}
          onSelectThread={setSelectedThreadId}
          onCloseThread={handleCloseThread}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileSidebarOpen(false)}
                className="md:hidden fixed inset-0 bg-black/60 z-40"
              />
              {/* Mobile Sidebar */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="md:hidden fixed left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-zinc-900 border-r border-white/10 flex flex-col z-50"
              >
                <div className="p-3 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">
                      Threads ({threads.length})
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {(['base', 'parallel', 'chained', 'fusion', 'big', 'long', 'zero'] as ThreadType[]).map(
                        (type) => {
                          const count = threads.filter((t) => t.type === type).length;
                          const colors = THREAD_TYPE_COLORS[type];
                          return (
                            <span
                              key={type}
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${colors.bg} text-white`}
                            >
                              {type.charAt(0).toUpperCase()}: {count}
                            </span>
                          );
                        }
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-auto p-2 space-y-2">
                  <AnimatePresence>
                    {threads.map((thread) => (
                      <ThreadListItem
                        key={thread.id}
                        thread={thread}
                        isSelected={thread.id === selectedThreadId}
                        onSelect={() => {
                          setSelectedThreadId(thread.id);
                          setIsMobileSidebarOpen(false);
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Left Sidebar - Thread List */}
        <aside className="hidden md:flex w-72 flex-shrink-0 border-r border-white/5 flex-col">
          <div className="p-3 border-b border-white/5">
            <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">
              Threads ({threads.length})
            </div>
            <div className="flex gap-1 flex-wrap">
              {(['base', 'parallel', 'chained', 'fusion', 'big', 'long', 'zero'] as ThreadType[]).map(
                (type) => {
                  const count = threads.filter((t) => t.type === type).length;
                  const colors = THREAD_TYPE_COLORS[type];
                  return (
                    <span
                      key={type}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${colors.bg} text-white`}
                    >
                      {type.charAt(0).toUpperCase()}: {count}
                    </span>
                  );
                }
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-2 space-y-2">
            <AnimatePresence>
              {threads.map((thread) => (
                <ThreadListItem
                  key={thread.id}
                  thread={thread}
                  isSelected={thread.id === selectedThreadId}
                  onSelect={() => setSelectedThreadId(thread.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 flex flex-col p-2 sm:p-4 min-w-0 overflow-auto">
          {/* Stats Row - 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <StatsCard
              icon={<Activity className="w-4 h-4 text-green-400" />}
              label="Active Threads"
              value={stats.activeThreads}
              subValue={`/ ${threads.length}`}
              color="text-green-400"
            />
            <StatsCard
              icon={<Zap className="w-4 h-4 text-yellow-400" />}
              label="Total Tool Calls"
              value={formatTokens(stats.totalToolCalls)}
              color="text-yellow-400"
            />
            <StatsCard
              icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
              label="Total Cost"
              value={formatCost(stats.totalCost)}
              color="text-emerald-400"
            />
            <StatsCard
              icon={<TrendingUp className="w-4 h-4 text-blue-400" />}
              label="Avg Efficiency"
              value={stats.avgEfficiency.toFixed(1)}
              subValue="calls/min"
              color="text-blue-400"
            />
          </div>

          {/* Control Deck */}
          <div className="flex-1 flex items-center justify-center">
            <ThreadControlDeck
              activeThreads={stats.activeThreads}
              totalThreads={threads.length}
              totalToolCalls={stats.totalToolCalls}
              totalCost={stats.totalCost}
              efficiency={stats.avgEfficiency}
              selectedThread={
                selectedThread
                  ? {
                    id: selectedThread.id,
                    type: selectedThread.type,
                    name: selectedThread.name,
                    status: selectedThread.status,
                    progress: selectedThread.progress,
                    model: selectedThread.model,
                    duration: selectedThread.metrics.duration,
                    toolCalls: selectedThread.metrics.toolCalls,
                  }
                  : undefined
              }
              onCreateThread={handleCreateThread}
              onStartThread={handleStartThread}
              onPauseThread={handlePauseThread}
              onStopThread={handleStopThread}
              onSpawnParallel={handleSpawnParallel}
            />
          </div>

          {/* Quick tip - hidden on mobile */}
          <div className="hidden sm:flex items-center justify-center gap-2 text-[10px] text-zinc-500 mt-4">
            <Terminal className="w-3 h-3" />
            <span>Use keyboard shortcuts: [N] New • [Space] Start/Pause • [S] Stop • [P] Spawn Parallel • [F] Fuse</span>
          </div>
        </main>
      </div>

      {/* Footer Attribution */}
      <footer className="flex-shrink-0 px-3 sm:px-4 py-2 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-zinc-500">
          <Sparkles className="w-3 h-3" />
          <span className="hidden sm:inline">Thread-Based Engineering by Andy Devdan</span>
          <span className="sm:hidden">Thread Engine</span>
        </div>
        <div className="text-[9px] sm:text-[10px] text-zinc-600">
          <span className="hidden sm:inline">Scale your compute • Scale your impact</span>
          <span className="sm:hidden">by Devdan</span>
        </div>
      </footer>
    </div>
  );
}
