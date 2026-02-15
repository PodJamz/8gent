'use client';

import { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FolderKanban, Sun, Moon, Map, Lightbulb, Plus, Home } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import { useDesignTheme } from '@/context/DesignThemeContext';
import { KanbanBoard } from '@/components/kanban';
import { RoadmapTimeline, SuggestionForm, SuggestionList } from '@/components/roadmap';
import { ProjectsLanding, ConvexProjectSelector } from '@/components/projects';
import { ConvexProvider } from '@/components/providers/ConvexProvider';
import '@/lib/themes/themes.css';
import { cn } from '@/lib/utils';

type Tab = 'landing' | 'kanban' | 'roadmap' | 'suggest';
type ViewTab = 'kanban' | 'roadmap' | 'suggest';

const TABS: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
  { id: 'kanban', label: 'Board', icon: <FolderKanban className="w-4 h-4" /> },
  { id: 'roadmap', label: 'Roadmap', icon: <Map className="w-4 h-4" /> },
  { id: 'suggest', label: 'Suggest', icon: <Lightbulb className="w-4 h-4" /> },
];

function ProjectsContent() {
  const { designTheme } = useDesignTheme();
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const searchParams = useSearchParams();
  const router = useRouter();

  // Seed OpenClaw-OS project on first load
  const seedOpenClawOS = useMutation(api.agentic.seedOpenClawOS); // Updated to OpenClawOS in API
  const hasSeeded = useRef(false);

  useEffect(() => {
    if (!hasSeeded.current) {
      hasSeeded.current = true;
      // Seed the OpenClaw-OS project with 'demo' owner (public view)
      seedOpenClawOS({ ownerId: 'demo' }).catch(console.error);
    }
  }, [seedOpenClawOS]);

  // Get view from URL or default to landing
  const viewParam = searchParams.get('view') as ViewTab | null;
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (viewParam && ['kanban', 'roadmap', 'suggest'].includes(viewParam)) {
      return viewParam;
    }
    return 'landing';
  });
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);

  // Sync URL with state
  useEffect(() => {
    const viewParam = searchParams.get('view') as ViewTab | null;
    if (viewParam && ['kanban', 'roadmap', 'suggest'].includes(viewParam)) {
      setActiveTab(viewParam);
    } else if (!viewParam) {
      setActiveTab('landing');
    }
  }, [searchParams]);

  // Navigate to view with URL update
  const navigateToView = useCallback((view: Tab) => {
    setActiveTab(view);
    if (view === 'landing') {
      router.push('/projects');
    } else {
      router.push(`/projects?view=${view}`);
    }
  }, [router]);

  // Handle tab click (for non-landing views)
  const handleTabClick = useCallback((tab: ViewTab) => {
    navigateToView(tab);
  }, [navigateToView]);

  // Handle landing card navigation
  const handleLandingNavigate = useCallback((view: ViewTab) => {
    navigateToView(view);
  }, [navigateToView]);

  return (
    <div
      data-design-theme={designTheme}
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: 'hsl(var(--theme-background))',
        color: 'hsl(var(--theme-foreground))',
        fontFamily: 'var(--theme-font)',
      }}
    >
      {/* Header Bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 border-b border-[hsl(var(--theme-border))] backdrop-blur-xl"
        style={{
          backgroundColor: 'hsl(var(--theme-background) / 0.8)',
        }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left side - Back button and title */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to OpenClaw-OS</span>
              </Link>

              <div className="hidden sm:block w-px h-6 bg-[hsl(var(--theme-border))]" />

              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--theme-primary)), hsl(var(--theme-accent)))',
                  }}
                >
                  <FolderKanban className="w-4 h-4 text-white" />
                </div>
                <h1
                  className="text-lg font-semibold text-[hsl(var(--theme-foreground))]"
                  style={{ fontFamily: 'var(--theme-font-heading)' }}
                >
                  Projects
                </h1>
              </div>

              {/* Project Selector */}
              <div className="hidden sm:block">
                <ConvexProjectSelector compact placeholder="All Projects" />
              </div>
            </div>

            {/* Center - Tabs */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-[hsl(var(--theme-muted))]">
              {/* Home/Landing Button */}
              <button
                onClick={() => navigateToView('landing')}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                  activeTab === 'landing'
                    ? 'bg-[hsl(var(--theme-card))] text-[hsl(var(--theme-foreground))] shadow-sm'
                    : 'text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))]'
                )}
                title="Back to landing"
              >
                <Home className="w-4 h-4" />
              </button>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-[hsl(var(--theme-card))] text-[hsl(var(--theme-foreground))] shadow-sm'
                      : 'text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))]'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2">
              {activeTab === 'roadmap' && (
                <button
                  onClick={() => setShowSuggestionModal(true)}
                  className={cn(
                    'hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                    'bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]',
                    'hover:bg-[hsl(var(--theme-primary)/0.9)] transition-colors'
                  )}
                >
                  <Plus className="w-4 h-4" />
                  Suggest
                </button>
              )}
              <button
                onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-[hsl(var(--theme-muted))] transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-[hsl(var(--theme-foreground))]" />
                ) : (
                  <Moon className="w-5 h-5 text-[hsl(var(--theme-foreground))]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Tab Bar */}
      <div className="md:hidden sticky top-14 z-30 border-b border-[hsl(var(--theme-border))] backdrop-blur-xl"
        style={{ backgroundColor: 'hsl(var(--theme-background) / 0.8)' }}
      >
        <div className="flex items-center gap-1 p-2 overflow-x-auto">
          {/* Home Button */}
          <button
            onClick={() => navigateToView('landing')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              activeTab === 'landing'
                ? 'bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]'
                : 'bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))]'
            )}
          >
            <Home className="w-4 h-4" />
          </button>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]'
                  : 'bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))]'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectsLanding onNavigateToView={handleLandingNavigate} />
            </motion.div>
          )}

          {activeTab === 'kanban' && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-8rem)]"
            >
              <KanbanBoard />
            </motion.div>
          )}

          {activeTab === 'roadmap' && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center max-w-2xl mx-auto">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl sm:text-3xl font-bold text-[hsl(var(--theme-foreground))] mb-3"
                  style={{ fontFamily: 'var(--theme-font-heading)' }}
                >
                  Building OpenClaw-OS
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[hsl(var(--theme-muted-foreground))]"
                >
                  A professional AI operating system that learns your objectives and creates what you need.
                  Track the journey and help shape what comes next.
                </motion.p>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Timeline - Takes 2 columns */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h3
                      className="text-lg font-semibold text-[hsl(var(--theme-foreground))]"
                      style={{ fontFamily: 'var(--theme-font-heading)' }}
                    >
                      Development Timeline
                    </h3>
                  </div>
                  <RoadmapTimeline />
                </div>

                {/* Suggestions - Takes 1 column */}
                <div className="lg:col-span-1">
                  <div className="flex items-center justify-between mb-6">
                    <h3
                      className="text-lg font-semibold text-[hsl(var(--theme-foreground))]"
                      style={{ fontFamily: 'var(--theme-font-heading)' }}
                    >
                      Feature Requests
                    </h3>
                    <button
                      onClick={() => setShowSuggestionModal(true)}
                      className={cn(
                        'sm:hidden inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium',
                        'bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]',
                        'hover:bg-[hsl(var(--theme-primary)/0.9)] transition-colors'
                      )}
                    >
                      <Plus className="w-3 h-3" />
                      Suggest
                    </button>
                  </div>
                  <SuggestionList onSuggestClick={() => setShowSuggestionModal(true)} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'suggest' && (
            <motion.div
              key="suggest"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-lg mx-auto"
            >
              <SuggestionForm />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Suggestion Modal */}
      <AnimatePresence>
        {showSuggestionModal && (
          <SuggestionForm
            isModal
            onClose={() => setShowSuggestionModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Loading fallback for Suspense
function ProjectsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <FolderKanban className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground">Loading Projects...</p>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <ConvexProvider>
      <Suspense fallback={<ProjectsLoading />}>
        <ProjectsContent />
      </Suspense>
    </ConvexProvider>
  );
}
