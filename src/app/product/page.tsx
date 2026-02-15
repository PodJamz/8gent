'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Box,
  Sun,
  Moon,
  Workflow,
  FileText,
  Target,
  Lightbulb,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useDesignTheme } from '@/context/DesignThemeContext';
import { useProject } from '@/context/ProjectContext';
import { ProjectSelector } from '@/components/os/ProjectSelector';
import '@/lib/themes/themes.css';
import { cn } from '@/lib/utils';

// Dynamic imports for heavy components - reduces initial bundle size
const WorkflowBuilder = dynamic(() => import('@/components/product').then(mod => ({ default: mod.WorkflowBuilder })), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-pulse text-[hsl(var(--theme-muted-foreground))]">Loading workflow builder...</div></div>,
  ssr: false,
});

// New voice-driven PRD studio (truly agentic)
const AgenticProductStudio = dynamic(() => import('@/components/agentic/AgenticProductStudio').then(mod => ({ default: mod.AgenticProductStudio })), {
  loading: () => null,
  ssr: false,
});

const AgenticProductStudioButton = dynamic(() => import('@/components/agentic/AgenticProductStudio').then(mod => ({ default: mod.AgenticProductStudioButton })), {
  loading: () => <div className="animate-pulse h-24 w-full rounded-xl bg-[hsl(var(--theme-muted))]" />,
  ssr: false,
});

// Legacy form-based agentic mode (keeping for reference)
const AgenticMode = dynamic(() => import('@/components/agentic/AgenticMode').then(mod => ({ default: mod.AgenticMode })), {
  loading: () => null,
  ssr: false,
});

const AgenticModeButton = dynamic(() => import('@/components/agentic/AgenticMode').then(mod => ({ default: mod.AgenticModeButton })), {
  loading: () => <div className="animate-pulse h-12 w-full rounded-xl bg-[hsl(var(--theme-muted))]" />,
  ssr: false,
});

type Tab = 'agentic' | 'workflow' | 'problem' | 'prd';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'agentic', label: 'Agentic', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'workflow', label: 'Workflow', icon: <Workflow className="w-4 h-4" /> },
  { id: 'problem', label: 'Problem', icon: <Target className="w-4 h-4" /> },
  { id: 'prd', label: 'PRD', icon: <FileText className="w-4 h-4" /> },
];

export default function ProductPage() {
  const { designTheme } = useDesignTheme();
  const { resolvedTheme, setTheme } = useTheme();
  const { activeProject } = useProject();
  const isDarkMode = resolvedTheme === 'dark';
  const [activeTab, setActiveTab] = useState<Tab>('agentic');
  const [showAgenticStudio, setShowAgenticStudio] = useState(false);
  const [showLegacyAgenticMode, setShowLegacyAgenticMode] = useState(false);

  // IMPORTANT: .dark must be on an ANCESTOR of [data-design-theme] for CSS selectors to work
  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div
        data-design-theme={designTheme}
        className="min-h-screen flex flex-col transition-colors duration-300"
        style={{
          backgroundColor: 'hsl(var(--theme-background))',
          color: 'hsl(var(--theme-foreground))',
          fontFamily: 'var(--theme-font)',
      }}
    >
      {/* Header */}
      <header
        className="flex-shrink-0 border-b border-[hsl(var(--theme-border))]"
        style={{ backgroundColor: 'hsl(var(--theme-card))' }}
      >
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>

            <div className="hidden sm:block w-px h-6 bg-[hsl(var(--theme-border))]" />

            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-[hsl(var(--theme-primary))]"
              >
                <Box className="w-4 h-4 text-[hsl(var(--theme-primary-foreground))]" />
              </div>
              <h1
                className="text-lg font-semibold text-[hsl(var(--theme-foreground))]"
                style={{ fontFamily: 'var(--theme-font-heading)' }}
              >
                Product
              </h1>
            </div>
          </div>

          {/* Center - Tabs */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-[hsl(var(--theme-muted))]">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-[hsl(var(--theme-muted))] transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-[hsl(var(--theme-foreground))]" />
              ) : (
                <Moon className="w-5 h-5 text-[hsl(var(--theme-foreground))]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div
          className="md:hidden flex items-center gap-1 p-2 overflow-x-auto border-t border-[hsl(var(--theme-border))]"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'agentic' && (
            <motion.div
              key="agentic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 overflow-auto p-6"
            >
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Active Project Display */}
                {activeProject && (
                  <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'hsl(var(--theme-card))' }}>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: activeProject.color + '30' }}
                    >
                      <Layers className="w-5 h-5" style={{ color: activeProject.color }} />
                    </div>
                    <div>
                      <p className="text-sm text-[hsl(var(--theme-muted-foreground))]">Active Project</p>
                      <p className="font-semibold text-[hsl(var(--theme-foreground))]">{activeProject.name}</p>
                    </div>
                  </div>
                )}

                {/* Voice PRD Studio - Truly Agentic */}
                <AgenticProductStudioButton onClick={() => setShowAgenticStudio(true)} />

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowLegacyAgenticMode(true)}
                    className="p-4 rounded-xl text-left transition-colors hover:bg-[hsl(var(--theme-muted))]"
                    style={{ backgroundColor: 'hsl(var(--theme-card))', border: '1px solid hsl(var(--theme-border))' }}
                  >
                    <Sparkles className="w-6 h-6 mb-2 text-[hsl(var(--theme-primary))]" />
                    <h3 className="font-medium text-[hsl(var(--theme-foreground))]">Form Mode</h3>
                    <p className="text-sm text-[hsl(var(--theme-muted-foreground))]">Step-by-step wizard</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('workflow')}
                    className="p-4 rounded-xl text-left transition-colors hover:bg-[hsl(var(--theme-muted))]"
                    style={{ backgroundColor: 'hsl(var(--theme-card))', border: '1px solid hsl(var(--theme-border))' }}
                  >
                    <Workflow className="w-6 h-6 mb-2 text-[hsl(var(--theme-primary))]" />
                    <h3 className="font-medium text-[hsl(var(--theme-foreground))]">Workflow Builder</h3>
                    <p className="text-sm text-[hsl(var(--theme-muted-foreground))]">Design user journeys</p>
                  </button>
                </div>

                {/* Project Selector */}
                <ProjectSelector variant="full" showCreateButton={true} />
              </div>
            </motion.div>
          )}

          {activeTab === 'workflow' && (
            <motion.div
              key="workflow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 min-h-0"
            >
              <WorkflowBuilder />
            </motion.div>
          )}

          {activeTab === 'problem' && (
            <motion.div
              key="problem"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 overflow-auto p-6"
            >
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-[hsl(var(--theme-primary))]" />
                  <h2
                    className="text-2xl font-bold text-[hsl(var(--theme-foreground))] mb-2"
                    style={{ fontFamily: 'var(--theme-font-heading)' }}
                  >
                    Problem Framing
                  </h2>
                  <p className="text-[hsl(var(--theme-muted-foreground))]">
                    Define what you&apos;re solving before you start building
                  </p>
                </div>

                <div className="space-y-6">
                  <div
                    className="p-6 rounded-xl border border-[hsl(var(--theme-border))]"
                    style={{ backgroundColor: 'hsl(var(--theme-card))' }}
                  >
                    <label className="block text-sm font-medium text-[hsl(var(--theme-foreground))] mb-2">
                      What problem exists?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the problem you're trying to solve..."
                      className={cn(
                        'w-full px-4 py-3 rounded-lg text-sm resize-none',
                        'bg-[hsl(var(--theme-background))] border border-[hsl(var(--theme-border))]',
                        'text-[hsl(var(--theme-foreground))] placeholder-[hsl(var(--theme-muted-foreground))]',
                        'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)]'
                      )}
                    />
                  </div>

                  <div
                    className="p-6 rounded-xl border border-[hsl(var(--theme-border))]"
                    style={{ backgroundColor: 'hsl(var(--theme-card))' }}
                  >
                    <label className="block text-sm font-medium text-[hsl(var(--theme-foreground))] mb-2">
                      Who does it affect?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Describe the users or personas affected..."
                      className={cn(
                        'w-full px-4 py-3 rounded-lg text-sm resize-none',
                        'bg-[hsl(var(--theme-background))] border border-[hsl(var(--theme-border))]',
                        'text-[hsl(var(--theme-foreground))] placeholder-[hsl(var(--theme-muted-foreground))]',
                        'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)]'
                      )}
                    />
                  </div>

                  <div
                    className="p-6 rounded-xl border border-[hsl(var(--theme-border))]"
                    style={{ backgroundColor: 'hsl(var(--theme-card))' }}
                  >
                    <label className="block text-sm font-medium text-[hsl(var(--theme-foreground))] mb-2">
                      What workaround exists today?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="How do people currently solve this..."
                      className={cn(
                        'w-full px-4 py-3 rounded-lg text-sm resize-none',
                        'bg-[hsl(var(--theme-background))] border border-[hsl(var(--theme-border))]',
                        'text-[hsl(var(--theme-foreground))] placeholder-[hsl(var(--theme-muted-foreground))]',
                        'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)]'
                      )}
                    />
                  </div>

                  <div
                    className="p-6 rounded-xl border border-[hsl(var(--theme-border))]"
                    style={{ backgroundColor: 'hsl(var(--theme-card))' }}
                  >
                    <label className="block text-sm font-medium text-[hsl(var(--theme-foreground))] mb-2">
                      What does success look like?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Define measurable outcomes..."
                      className={cn(
                        'w-full px-4 py-3 rounded-lg text-sm resize-none',
                        'bg-[hsl(var(--theme-background))] border border-[hsl(var(--theme-border))]',
                        'text-[hsl(var(--theme-foreground))] placeholder-[hsl(var(--theme-muted-foreground))]',
                        'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)]'
                      )}
                    />
                  </div>

                  <div
                    className="p-6 rounded-xl border border-rose-500/30"
                    style={{ backgroundColor: 'hsl(var(--theme-card))' }}
                  >
                    <label className="block text-sm font-medium text-rose-400 mb-2">
                      What is explicitly NOT being solved?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Define the boundaries - what's out of scope..."
                      className={cn(
                        'w-full px-4 py-3 rounded-lg text-sm resize-none',
                        'bg-[hsl(var(--theme-background))] border border-[hsl(var(--theme-border))]',
                        'text-[hsl(var(--theme-foreground))] placeholder-[hsl(var(--theme-muted-foreground))]',
                        'focus:outline-none focus:ring-2 focus:ring-rose-500/50'
                      )}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'prd' && (
            <motion.div
              key="prd"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 overflow-auto p-6"
            >
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-[hsl(var(--theme-primary))]" />
                  <h2
                    className="text-2xl font-bold text-[hsl(var(--theme-foreground))] mb-2"
                    style={{ fontFamily: 'var(--theme-font-heading)' }}
                  >
                    Product Requirements
                  </h2>
                  <p className="text-[hsl(var(--theme-muted-foreground))]">
                    Your PRD will be generated from the problem framing and workflow
                  </p>
                </div>

                <div
                  className="p-8 rounded-xl border border-dashed border-[hsl(var(--theme-border))] text-center"
                  style={{ backgroundColor: 'hsl(var(--theme-card))' }}
                >
                  <Lightbulb className="w-10 h-10 mx-auto mb-4 text-[hsl(var(--theme-muted-foreground))] opacity-50" />
                  <p className="text-[hsl(var(--theme-muted-foreground))] mb-4">
                    Complete the Problem tab and build your Workflow first
                  </p>
                  <p className="text-sm text-[hsl(var(--theme-muted-foreground))] opacity-60">
                    Claw AI will help generate your PRD based on your inputs
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Voice PRD Studio Modal */}
      <AgenticProductStudio
        isOpen={showAgenticStudio}
        onClose={() => setShowAgenticStudio(false)}
        projectId={activeProject?.id}
        onPRDComplete={(prd) => {
          console.log('PRD complete:', prd);
          setShowAgenticStudio(false);
        }}
      />

      {/* Legacy Form Mode Modal */}
      <AgenticMode isOpen={showLegacyAgenticMode} onClose={() => setShowLegacyAgenticMode(false)} />
      </div>
    </div>
  );
}
