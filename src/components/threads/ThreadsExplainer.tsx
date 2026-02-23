'use client';

/**
 * ThreadsExplainer - Clarifies the Threads Mental Model
 *
 * Thread = scoped agent conversation
 * Thread belongs to a project
 * Thread produces artifacts (PRDs, tickets, notes)
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch,
  MessageSquare,
  FileText,
  Layers,
  ArrowRight,
  Zap,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { useProject } from '@/context/ProjectContext';

interface ThreadsExplainerProps {
  variant?: 'full' | 'compact' | 'inline';
}

export function ThreadsExplainer({ variant = 'full' }: ThreadsExplainerProps) {
  const { activeProject } = useProject();

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
        <GitBranch className="w-4 h-4" />
        <span>Thread = scoped agent conversation → produces artifacts</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <LiquidGlass className="p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <GitBranch className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold mb-1" style={{ color: 'hsl(var(--foreground))' }}>
              Threads Mental Model
            </h3>
            <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Each thread is a scoped conversation with an AI agent that belongs to a project
              and produces artifacts like PRDs, tickets, and notes.
            </p>
          </div>
        </div>
      </LiquidGlass>
    );
  }

  // Full variant
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4"
        >
          <GitBranch className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
          Understanding Threads
        </h2>
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>
          How AI agents work within 8gent OS
        </p>
      </div>

      {/* Current Project Context */}
      {activeProject && (
        <LiquidGlass className="p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: activeProject.color + '20' }}
            >
              <Layers className="w-5 h-5" style={{ color: activeProject.color }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Current Project Context
              </p>
              <p className="font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                {activeProject.name}
              </p>
            </div>
          </div>
        </LiquidGlass>
      )}

      {/* Core Concepts */}
      <div className="grid gap-4">
        {/* Thread Definition */}
        <LiquidGlass className="p-5 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                Thread = Scoped Agent Conversation
              </h3>
              <p className="text-sm mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
                A thread is a focused conversation with an AI agent. It has a specific goal,
                maintains context, and can be paused, resumed, or completed.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-400">
                  Context-aware
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-400">
                  Goal-oriented
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-400">
                  Persistent
                </span>
              </div>
            </div>
          </div>
        </LiquidGlass>

        {/* Project Binding */}
        <LiquidGlass className="p-5 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                Thread Belongs to a Project
              </h3>
              <p className="text-sm mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Every thread is bound to a specific project. This means the agent has access
                to that project's context, artifacts, and history.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-400">
                  Project
                </span>
                <ArrowRight className="w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                <span className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-400">
                  Thread
                </span>
                <ArrowRight className="w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400">
                  Artifact
                </span>
              </div>
            </div>
          </div>
        </LiquidGlass>

        {/* Artifacts */}
        <LiquidGlass className="p-5 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                Thread Produces Artifacts
              </h3>
              <p className="text-sm mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
                The output of a thread is one or more artifacts. These are stored, viewable,
                and versioned within the project.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span style={{ color: 'hsl(var(--foreground))' }}>PRDs</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span style={{ color: 'hsl(var(--foreground))' }}>Tickets</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span style={{ color: 'hsl(var(--foreground))' }}>Notes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span style={{ color: 'hsl(var(--foreground))' }}>Designs</span>
                </div>
              </div>
            </div>
          </div>
        </LiquidGlass>
      </div>

      {/* Thread Types */}
      <div>
        <h3 className="font-semibold mb-3" style={{ color: 'hsl(var(--foreground))' }}>
          Thread Types
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'Base', desc: 'Single execution', color: '#3b82f6' },
            { name: 'Parallel', desc: 'Multiple threads', color: '#8b5cf6' },
            { name: 'Chained', desc: 'Sequential steps', color: '#06b6d4' },
            { name: 'Fusion', desc: 'Merge outputs', color: '#f97316' },
            { name: 'Big', desc: 'Multi-step tasks', color: '#ec4899' },
            { name: 'Long', desc: 'Extended work', color: '#10b981' },
          ].map((type) => (
            <LiquidGlass key={type.name} className="p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: type.color }}
                />
                <span className="font-medium text-sm" style={{ color: 'hsl(var(--foreground))' }}>
                  {type.name}
                </span>
              </div>
              <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {type.desc}
              </p>
            </LiquidGlass>
          ))}
        </div>
      </div>
    </div>
  );
}
