'use client';

/**
 * Memory Control Center
 *
 * Admin-only dashboard for viewing, managing, and uploading memories.
 * Part of the RLM (Recursive Memory Layer) self-learning system.
 *
 * @see docs/planning/recursive-memory-layer-scope.md
 */

import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { useUser, SignInButton } from '@clerk/nextjs';
import { PageTransition } from '@/components/ios';
import { useDesignTheme } from '@/context/DesignThemeContext';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import {
  ChevronLeft,
  Brain,
  Loader2,
  Database,
  Sparkles,
  Clock,
  Upload,
  Settings,
  Trash2,
  Download,
  Search,
  Filter,
  Zap,
  Target,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Shield,
  Eye,
  FileText,
  AlertCircle,
  Lock,
  LogIn,
} from 'lucide-react';

// Dynamic API import to handle cases where Convex types aren't regenerated
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let memoriesApi: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const api = require('../../../convex/_generated/api').api;
  memoriesApi = api?.memories;
} catch {
  // memories API not available yet
}

// Dynamic import for user management API
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let userManagementApi: any;
try {
  userManagementApi = require('../../../convex/_generated/api').api?.userManagement;
} catch {
  userManagementApi = null;
}
import { Id } from '../../../convex/_generated/dataModel';

// Memory type definitions for type safety
interface EpisodicMemoryData {
  _id: Id<'episodicMemories'>;
  userId: string;
  content: string;
  memoryType: 'interaction' | 'decision' | 'preference' | 'feedback' | 'milestone';
  importance: number;
  timestamp: number;
  projectId?: Id<'productProjects'>;
}

interface SemanticMemoryData {
  _id: Id<'semanticMemories'>;
  userId: string;
  category: string;
  key: string;
  value: string;
  confidence: number;
  source: string;
  accessCount: number;
  lastAccessed: number;
}

// Tab types
type TabId = 'memories' | 'insights' | 'upload' | 'settings';

export function MemoryClient() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const { designTheme } = useDesignTheme();
  const [activeTab, setActiveTab] = useState<TabId>('memories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemoryType, setSelectedMemoryType] = useState<string | null>(null);

  // Get managed user data to check if owner
  const clerkId = user?.id;
  const managedUser = useQuery(
    userManagementApi?.getManagedUserByClerkId,
    clerkId ? { clerkId } : 'skip'
  );

  // Determine if user is owner
  const isLoading = !isClerkLoaded || (clerkId && managedUser === undefined);
  const isOwner = useMemo(() => {
    if (!user || !managedUser) return false;
    return managedUser.role === 'owner' || managedUser.role === 'admin';
  }, [user, managedUser]);

  // Convex queries - use "skip" pattern when API isn't available
  const stats = useQuery(
    memoriesApi?.getMemoryStats ?? null,
    memoriesApi && isOwner ? { userId: user?.id ?? '' } : "skip"
  );
  const recentEpisodic = useQuery(
    memoriesApi?.getRecentEpisodic ?? null,
    memoriesApi && isOwner ? { userId: user?.id ?? '', limit: 20 } : "skip"
  );
  const allSemantic = useQuery(
    memoriesApi?.getAllSemantic ?? null,
    memoriesApi && isOwner ? { userId: user?.id ?? '' } : "skip"
  );

  // Mutations - these will be undefined if API isn't available
  const deleteEpisodicMutation = useMutation(memoriesApi?.deleteEpisodic ?? null);
  const deleteSemanticMutation = useMutation(memoriesApi?.deleteSemantic ?? null);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'hsl(var(--theme-background))' }}
        data-design-theme={designTheme}
      >
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'hsl(var(--theme-primary))' }} />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <PageTransition>
        <div
          className="min-h-screen flex flex-col items-center justify-center p-4"
          style={{ backgroundColor: 'hsl(var(--theme-background))' }}
          data-design-theme={designTheme}
        >
          <div className="text-center max-w-md">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.1)' }}
            >
              <Lock className="w-8 h-8" style={{ color: 'hsl(var(--theme-primary))' }} />
            </div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              Memory Control Center
            </h1>
            <p
              className="mb-8"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {!user
                ? 'Sign in with your account to access memories.'
                : 'Owner access required. This feature is only available to the owner.'}
            </p>
            {!user ? (
              <SignInButton mode="modal">
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors"
                  style={{
                    backgroundColor: 'hsl(var(--theme-primary))',
                    color: 'hsl(var(--theme-primary-foreground))',
                  }}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              </SignInButton>
            ) : null}
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-1 text-sm hover:underline"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              <ChevronLeft className="w-4 h-4" />
              Back to home
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const tabs: { id: TabId; label: string; icon: typeof Brain }[] = [
    { id: 'memories', label: 'Memories', icon: Database },
    { id: 'insights', label: 'Insights', icon: Sparkles },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const memoryTypeIcons: Record<string, typeof Brain> = {
    interaction: MessageSquare,
    decision: Target,
    preference: Lightbulb,
    feedback: TrendingUp,
    milestone: Zap,
  };

  const handleDeleteEpisodic = async (memoryId: Id<'episodicMemories'>) => {
    if (!deleteEpisodicMutation) {
      console.error('Delete mutation not available');
      return;
    }
    try {
      await deleteEpisodicMutation({ memoryId, userId: user?.id ?? '' });
    } catch (error) {
      console.error('Failed to delete memory:', error);
    }
  };

  const handleDeleteSemantic = async (memoryId: Id<'semanticMemories'>) => {
    if (!deleteSemanticMutation) {
      console.error('Delete mutation not available');
      return;
    }
    try {
      await deleteSemanticMutation({ memoryId, userId: user?.id ?? '' });
    } catch (error) {
      console.error('Failed to delete memory:', error);
    }
  };

  return (
    <PageTransition>
      <div
        className="min-h-screen transition-colors duration-500"
        style={{
          backgroundColor: 'hsl(var(--theme-background))',
          color: 'hsl(var(--theme-foreground))',
          fontFamily: 'var(--theme-font)',
        }}
        data-design-theme={designTheme}
      >
        {/* Header */}
        <header
          className="sticky top-0 z-40 backdrop-blur-xl border-b"
          style={{
            backgroundColor: 'hsl(var(--theme-background) / 0.8)',
            borderColor: 'hsl(var(--theme-border))',
          }}
        >
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 -ml-2 rounded-xl transition-colors hover:opacity-80"
                style={{ backgroundColor: 'hsl(var(--theme-muted) / 0.5)' }}
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="flex-1">
                <h1 className="text-xl font-semibold">Memory Control Center</h1>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  RLM Self-Learning System
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--theme-primary)), hsl(var(--theme-accent)))`,
                }}
              >
                <Brain className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
                    style={{
                      backgroundColor: isActive
                        ? 'hsl(var(--theme-primary))'
                        : 'hsl(var(--theme-muted) / 0.5)',
                      color: isActive
                        ? 'hsl(var(--theme-primary-foreground))'
                        : 'hsl(var(--theme-muted-foreground))',
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            {/* Stats Cards */}
            {activeTab === 'memories' && (
              <motion.div
                key="memories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <StatCard
                    icon={Database}
                    label="Episodic"
                    value={stats?.episodicCount ?? 0}
                    subtitle="memories"
                  />
                  <StatCard
                    icon={Sparkles}
                    label="Semantic"
                    value={stats?.semanticCount ?? 0}
                    subtitle="facts"
                  />
                  <StatCard
                    icon={Clock}
                    label="Active"
                    value={stats?.activeWorkingSessions ?? 0}
                    subtitle="sessions"
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Avg Confidence"
                    value={`${((stats?.avgSemanticConfidence ?? 0) * 100).toFixed(0)}%`}
                    subtitle="semantic"
                  />
                </div>

                {/* Search & Filter */}
                <div className="flex gap-3 mb-6">
                  <div
                    className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: 'hsl(var(--theme-muted) / 0.5)',
                      borderColor: 'hsl(var(--theme-border))',
                    }}
                  >
                    <Search className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                    <input
                      type="text"
                      placeholder="Search memories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm"
                      style={{ color: 'hsl(var(--theme-foreground))' }}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: 'hsl(var(--theme-muted) / 0.5)',
                    }}
                  >
                    <Filter className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Memory Type Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  <FilterChip
                    label="All"
                    isActive={selectedMemoryType === null}
                    onClick={() => setSelectedMemoryType(null)}
                  />
                  {Object.entries(stats?.episodicByType ?? {}).map(([type, count]) => (
                    <FilterChip
                      key={type}
                      label={`${type} (${count})`}
                      isActive={selectedMemoryType === type}
                      onClick={() => setSelectedMemoryType(type)}
                      icon={memoryTypeIcons[type]}
                    />
                  ))}
                </div>

                {/* Episodic Memories List */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Recent Memories</h2>
                  <div className="space-y-3">
                    {(recentEpisodic as EpisodicMemoryData[] | undefined)
                      ?.filter((m: EpisodicMemoryData) => !selectedMemoryType || m.memoryType === selectedMemoryType)
                      ?.filter(
                        (m: EpisodicMemoryData) =>
                          !searchQuery ||
                          m.content.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      ?.map((memory: EpisodicMemoryData) => {
                        const Icon = memoryTypeIcons[memory.memoryType] || Brain;
                        return (
                          <MemoryCard
                            key={memory._id}
                            icon={Icon}
                            type={memory.memoryType}
                            content={memory.content}
                            importance={memory.importance}
                            timestamp={memory.timestamp}
                            onDelete={() => handleDeleteEpisodic(memory._id)}
                          />
                        );
                      })}
                    {(!recentEpisodic || recentEpisodic.length === 0) && (
                      <EmptyState message="No memories yet. Start chatting to build your memory layer." />
                    )}
                  </div>
                </div>

                {/* Semantic Memories */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">What I Know About You</h2>
                  <div className="space-y-3">
                    {(allSemantic as SemanticMemoryData[] | undefined)?.map((memory: SemanticMemoryData) => (
                      <SemanticCard
                        key={memory._id}
                        category={memory.category}
                        memoryKey={memory.key}
                        value={memory.value}
                        confidence={memory.confidence}
                        accessCount={memory.accessCount}
                        onDelete={() => handleDeleteSemantic(memory._id)}
                      />
                    ))}
                    {(!allSemantic || allSemantic.length === 0) && (
                      <EmptyState message="No learned facts yet. The system learns from your interactions." />
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Insights Tab */}
            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <InsightsView stats={stats} semantic={allSemantic} />
              </motion.div>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <UploadView />
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SettingsView stats={stats} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </PageTransition>
  );
}

// ============================================================================
// Sub-Components
// ============================================================================

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
}: {
  icon: typeof Brain;
  label: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <LiquidGlass variant="card" intensity="subtle" className="p-4">
      <div className="flex items-start justify-between mb-2">
        <Icon className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
      </div>
      <div className="text-2xl font-bold" style={{ color: 'hsl(var(--theme-foreground))' }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
        {label} {subtitle}
      </div>
    </LiquidGlass>
  );
}

function FilterChip({
  label,
  isActive,
  onClick,
  icon: Icon,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: typeof Brain;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
      style={{
        backgroundColor: isActive ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-muted) / 0.5)',
        color: isActive ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
      }}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </motion.button>
  );
}

function MemoryCard({
  icon: Icon,
  type,
  content,
  importance,
  timestamp,
  onDelete,
}: {
  icon: typeof Brain;
  type: string;
  content: string;
  importance: number;
  timestamp: number;
  onDelete: () => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="p-4 rounded-2xl border transition-colors"
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
        borderColor: 'hsl(var(--theme-border))',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.1)' }}
        >
          <Icon className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'hsl(var(--theme-muted) / 0.5)',
                color: 'hsl(var(--theme-muted-foreground))',
              }}
            >
              {type}
            </span>
            <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              {new Date(timestamp).toLocaleDateString()}
            </span>
            <div className="flex-1" />
            <div
              className="text-xs font-medium"
              style={{ color: `hsl(var(--theme-primary) / ${importance})` }}
            >
              {(importance * 100).toFixed(0)}%
            </div>
          </div>
          <p className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
            {content}
          </p>
        </div>
        {showConfirm ? (
          <div className="flex gap-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onDelete}
              className="p-2 rounded-lg text-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowConfirm(false)}
              className="p-2 rounded-lg hover:opacity-70"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              ✕
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowConfirm(true)}
            className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:opacity-70 transition-opacity"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

function SemanticCard({
  category,
  memoryKey,
  value,
  confidence,
  accessCount,
  onDelete,
}: {
  category: string;
  memoryKey: string;
  value: string;
  confidence: number;
  accessCount: number;
  onDelete: () => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const categoryColors: Record<string, string> = {
    preference: 'hsl(280 70% 50%)',
    skill: 'hsl(150 70% 40%)',
    pattern: 'hsl(200 70% 50%)',
    fact: 'hsl(40 70% 50%)',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="p-4 rounded-2xl border transition-colors group"
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
        borderColor: 'hsl(var(--theme-border))',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${categoryColors[category]}20` }}
        >
          <Sparkles className="w-4 h-4" style={{ color: categoryColors[category] }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${categoryColors[category]}20`,
                color: categoryColors[category],
              }}
            >
              {category}
            </span>
            <span className="text-xs font-mono" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              {memoryKey}
            </span>
          </div>
          <p className="text-sm mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>
            {value}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div
                className="h-1.5 w-16 rounded-full overflow-hidden"
                style={{ backgroundColor: 'hsl(var(--theme-muted) / 0.5)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: categoryColors[category] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
              <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                {(confidence * 100).toFixed(0)}%
              </span>
            </div>
            <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              {accessCount} accesses
            </span>
          </div>
        </div>
        {showConfirm ? (
          <div className="flex gap-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onDelete}
              className="p-2 rounded-lg text-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowConfirm(false)}
              className="p-2 rounded-lg hover:opacity-70"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              ✕
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowConfirm(true)}
            className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:opacity-70 transition-opacity"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="p-8 rounded-2xl text-center"
      style={{ backgroundColor: 'hsl(var(--theme-muted) / 0.3)' }}
    >
      <Brain className="w-12 h-12 mx-auto mb-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
      <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
        {message}
      </p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InsightsView({ stats, semantic }: { stats: any; semantic: any[] | undefined }) {
  const categoryBreakdown = semantic?.reduce(
    (acc, m) => {
      acc[m.category] = (acc[m.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  ) ?? {};

  const episodicData = Object.entries(stats?.episodicByType ?? {}).map(([label, value]) => ({
    label,
    value: value as number,
  }));

  const semanticData = Object.entries(categoryBreakdown).map(([label, value]) => ({
    label,
    value: value as number,
  }));

  const pieColors = {
    interaction: 'hsl(var(--theme-primary))',
    decision: 'hsl(200 70% 50%)',
    preference: 'hsl(280 70% 50%)',
    feedback: 'hsl(150 70% 40%)',
    milestone: 'hsl(40 70% 50%)',
  };

  const categoryColors = {
    preference: 'hsl(280 70% 50%)',
    skill: 'hsl(150 70% 40%)',
    pattern: 'hsl(200 70% 50%)',
    fact: 'hsl(40 70% 50%)',
  };

  return (
    <div className="space-y-6">
      {/* Episodic Memory Distribution */}
      <LiquidGlass variant="panel" intensity="subtle">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Eye className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          Memory Distribution
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Episodic Bar Chart */}
          <div>
            <h3 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Episodic Memories by Type
            </h3>
            <div className="space-y-3">
              {episodicData.map((item, i) => {
                const max = Math.max(...episodicData.map(d => d.value), 1);
                const color = pieColors[item.label as keyof typeof pieColors] || 'hsl(var(--theme-primary))';
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="capitalize">{item.label}</span>
                      <span style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{item.value}</span>
                    </div>
                    <div
                      className="h-3 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'hsl(var(--theme-muted) / 0.3)' }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / max) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
              {episodicData.length === 0 && (
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  No episodic memories yet
                </p>
              )}
            </div>
          </div>

          {/* Semantic Pie Chart */}
          <div>
            <h3 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Semantic Knowledge
            </h3>
            {semanticData.length > 0 ? (
              <div className="flex items-center gap-6">
                <PieChart data={semanticData} colors={categoryColors} />
                <div className="space-y-2">
                  {semanticData.map((item, i) => {
                    const color = categoryColors[item.label as keyof typeof categoryColors] || 'hsl(var(--theme-primary))';
                    const total = semanticData.reduce((sum, d) => sum + d.value, 0);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                        <span className="text-xs capitalize">{item.label}</span>
                        <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                          ({Math.round((item.value / total) * 100)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                No semantic memories yet
              </p>
            )}
          </div>
        </div>
      </LiquidGlass>

      {/* Learning Progress */}
      <LiquidGlass variant="panel" intensity="subtle">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          Self-Learning Progress
        </h2>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Your digital twin is evolving. Each interaction builds deeper understanding.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Total Knowledge"
            value={(stats?.episodicCount ?? 0) + (stats?.semanticCount ?? 0)}
            suffix="items"
          />
          <MetricCard
            label="Avg Importance"
            value={((stats?.avgEpisodicImportance ?? 0) * 100).toFixed(0)}
            suffix="%"
          />
          <MetricCard
            label="Avg Confidence"
            value={((stats?.avgSemanticConfidence ?? 0) * 100).toFixed(0)}
            suffix="%"
          />
          <MetricCard
            label="Active Sessions"
            value={stats?.activeWorkingSessions ?? 0}
            suffix="live"
          />
        </div>

        {/* Progress Ring */}
        <div className="flex items-center justify-center py-6">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="hsl(var(--theme-muted) / 0.3)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0 352' }}
                animate={{
                  strokeDasharray: `${Math.min(100, ((stats?.episodicCount ?? 0) + (stats?.semanticCount ?? 0))) * 3.52} 352`,
                }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--theme-primary))" />
                  <stop offset="100%" stopColor="hsl(var(--theme-accent))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">
                {Math.min(100, ((stats?.episodicCount ?? 0) + (stats?.semanticCount ?? 0)))}
              </span>
              <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                memories
              </span>
            </div>
          </div>
        </div>
      </LiquidGlass>

      {/* Philosophy Note */}
      <div
        className="p-4 rounded-xl border"
        style={{
          backgroundColor: 'hsl(var(--theme-primary) / 0.05)',
          borderColor: 'hsl(var(--theme-primary) / 0.2)',
        }}
      >
        <p className="text-sm italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          &ldquo;Recursive Memory + Proper Database = Infinite Memory. Infinite Memory = Self-Learning.&rdquo;
        </p>
        <p className="text-xs mt-2" style={{ color: 'hsl(var(--theme-muted-foreground) / 0.7)' }}>
          — RLM Philosophy, MIT OASYS Lab
        </p>
      </div>
    </div>
  );
}

function PieChart({
  data,
  colors
}: {
  data: Array<{ label: string; value: number }>;
  colors: Record<string, string>;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  let currentAngle = 0;
  const segments = data.map((d) => {
    const angle = (d.value / total) * 360;
    const segment = {
      ...d,
      color: colors[d.label as keyof typeof colors] || 'hsl(var(--theme-primary))',
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return segment;
  });

  const gradient = segments
    .map((s) => `${s.color} ${s.startAngle}deg ${s.endAngle}deg`)
    .join(', ');

  return (
    <motion.div
      className="w-24 h-24 rounded-full"
      style={{ background: `conic-gradient(${gradient})` }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  );
}

function MetricCard({ label, value, suffix }: { label: string; value: string | number; suffix: string }) {
  return (
    <div
      className="p-4 rounded-xl text-center"
      style={{ backgroundColor: 'hsl(var(--theme-muted) / 0.3)' }}
    >
      <div className="text-2xl font-bold" style={{ color: 'hsl(var(--theme-primary))' }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
        {suffix}
      </div>
      <div className="text-xs mt-1 font-medium">{label}</div>
    </div>
  );
}

function UploadView() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; status: 'processing' | 'done' | 'error'; memories?: number; error?: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setUploadedFiles((prev) => [...prev, { name: file.name, status: 'processing' }]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/memory/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, status: 'done', memories: result.memoriesStored } : f
          )
        );
      } else {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, status: 'error', error: result.error } : f
          )
        );
      }
    } catch (error) {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.name === file.name ? { ...f, status: 'error', error: 'Upload failed' } : f
        )
      );
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      await uploadFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      await uploadFile(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.txt,.json,.csv"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Drop Zone */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        animate={{ scale: isDragging ? 1.02 : 1 }}
        className="border-2 border-dashed rounded-3xl p-12 text-center transition-colors cursor-pointer"
        style={{
          borderColor: isDragging ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-border))',
          backgroundColor: isDragging ? 'hsl(var(--theme-primary) / 0.05)' : 'transparent',
        }}
      >
        <Upload
          className="w-12 h-12 mx-auto mb-4"
          style={{ color: isDragging ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-muted-foreground))' }}
        />
        <h3 className="text-lg font-semibold mb-2">Drop files here or click to upload</h3>
        <p className="text-sm mb-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Import your data to build your personal memory layer
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {['.md', '.txt', '.json', '.csv'].map((ext) => (
            <span
              key={ext}
              className="px-3 py-1 rounded-full text-xs font-mono"
              style={{ backgroundColor: 'hsl(var(--theme-muted) / 0.5)' }}
            >
              {ext}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Upload History */}
      {uploadedFiles.length > 0 && (
        <LiquidGlass variant="panel" intensity="subtle">
          <h3 className="text-sm font-semibold mb-4">Recent Uploads</h3>
          <div className="space-y-3">
            {uploadedFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: 'hsl(var(--theme-muted) / 0.3)' }}
              >
                <FileText className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
                <span className="flex-1 text-sm font-medium truncate">{file.name}</span>
                {file.status === 'processing' ? (
                  <span className="text-xs flex items-center gap-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Processing...
                  </span>
                ) : file.status === 'done' ? (
                  <span className="text-xs text-green-500">✓ {file.memories} memories</span>
                ) : (
                  <span className="text-xs text-red-500">Error</span>
                )}
              </div>
            ))}
          </div>
        </LiquidGlass>
      )}

      {/* Info */}
      <div
        className="p-4 rounded-xl flex items-start gap-3"
        style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.1)' }}
      >
        <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(var(--theme-primary))' }} />
        <div>
          <h4 className="text-sm font-medium mb-1">How Upload Works</h4>
          <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Files are processed by AI to extract meaningful memories. Text is chunked, classified by type,
            and stored as episodic or semantic memories with importance scores.
          </p>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SettingsView({ stats }: { stats: any }) {
  return (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <LiquidGlass variant="panel" intensity="subtle">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          Privacy Controls
        </h2>
        <div className="space-y-4">
          <SettingToggle
            label="Store interactions automatically"
            description="Learn from your chat interactions"
            defaultChecked={true}
          />
          <SettingToggle
            label="Extract patterns"
            description="Identify and remember your preferences"
            defaultChecked={true}
          />
          <SettingToggle
            label="Store decision history"
            description="Remember choices you've made"
            defaultChecked={true}
          />
        </div>
      </LiquidGlass>

      {/* Data Management */}
      <LiquidGlass variant="panel" intensity="subtle">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          Data Management
        </h2>
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center gap-3 p-4 rounded-xl transition-colors"
            style={{ backgroundColor: 'hsl(var(--theme-muted) / 0.3)' }}
          >
            <Download className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">Export All Memories</div>
              <div className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                Download as JSON ({(stats?.episodicCount ?? 0) + (stats?.semanticCount ?? 0)} items)
              </div>
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center gap-3 p-4 rounded-xl transition-colors text-red-500"
            style={{ backgroundColor: 'hsl(0 70% 50% / 0.1)' }}
          >
            <Trash2 className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">Clear All Memories</div>
              <div className="text-xs opacity-70">This action cannot be undone</div>
            </div>
          </motion.button>
        </div>
      </LiquidGlass>

      {/* System Info */}
      <div className="text-center pt-4">
        <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          RLM Memory System v1.0
        </p>
        <p className="text-xs mt-1" style={{ color: 'hsl(var(--theme-muted-foreground) / 0.7)' }}>
          Inspired by MIT OASYS Lab Research
        </p>
      </div>
    </div>
  );
}

function SettingToggle({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked ?? false);

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          {description}
        </div>
      </div>
      <motion.button
        onClick={() => setChecked(!checked)}
        className="w-12 h-7 rounded-full p-1 transition-colors"
        style={{
          backgroundColor: checked ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-muted) / 0.5)',
        }}
      >
        <motion.div
          className="w-5 h-5 rounded-full bg-white"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
}
