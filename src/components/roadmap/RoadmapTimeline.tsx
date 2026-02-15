'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, GitCommit, GitPullRequest, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useQuery } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';

interface Milestone {
  _id: string;
  title: string;
  description: string;
  phase: number;
  features: string[];
  completedAt: number;
  commitCount?: number;
  prCount?: number;
}

// Fallback data for when Convex isn't connected
const FALLBACK_MILESTONES: Omit<Milestone, '_id'>[] = [
  {
    phase: 10,
    title: "Voice Mode & Polish",
    description: "Claw AI voice chat and desktop screensaver",
    features: ["Voice input (Web Speech API)", "Voice output (OpenAI TTS)", "Desktop screensaver", "Gallery rotation", "Accessibility improvements"],
    completedAt: new Date("2026-01-12").getTime(),
    commitCount: 20,
    prCount: 5,
  },
  {
    phase: 9,
    title: "Humans App",
    description: "People search with intelligent filtering and Ralph Mode",
    features: ["People search interface", "Ralph Mode refinement", "Social links integration", "OS theme inheritance", "Shortlist management"],
    completedAt: new Date("2026-01-11").getTime(),
    commitCount: 30,
    prCount: 8,
  },
  {
    phase: 8,
    title: "Jamz Music Studio",
    description: "Full DAW with Web Audio API and stem separation",
    features: ["Web Audio API integration", "Multi-track editor", "Stem separation", "MP3 export", "iPod-style playlist"],
    completedAt: new Date("2026-01-10").getTime(),
    commitCount: 50,
    prCount: 12,
  },
  {
    phase: 7,
    title: "Authentication & Backend",
    description: "Clerk auth and Convex real-time database",
    features: ["Clerk authentication", "Convex database", "Auth gate for build mode", "AI prompts sign-in", "Session management"],
    completedAt: new Date("2026-01-09").getTime(),
    commitCount: 20,
    prCount: 6,
  },
  {
    phase: 6,
    title: "Prototyping Environment",
    description: "Cursor-like IDE with ProcessWindow and ControlDeck",
    features: ["ProcessWindow with tabs", "Code/Chat/Terminal views", "Browser preview", "Hardware-style ControlDeck", "CodeMirror integration"],
    completedAt: new Date("2026-01-08").getTime(),
    commitCount: 45,
    prCount: 15,
  },
  {
    phase: 5,
    title: "Claw AI",
    description: "Personal AI assistant with liquid glass overlay",
    features: ["Animated orb in dock", "Liquid glass chat overlay", "Theme suggestion cards", "Chat history persistence", "Dynamic theme colors"],
    completedAt: new Date("2026-01-07").getTime(),
    commitCount: 35,
    prCount: 10,
  },
  {
    phase: 4,
    title: "iOS Home Screen",
    description: "Phone-familiar UX with drag-and-drop and Dynamic Island",
    features: ["Drag-and-drop app icons", "Folder system", "Lock screen with unlock", "Dynamic Island with music", "Dock with Claw AI orb"],
    completedAt: new Date("2026-01-06").getTime(),
    commitCount: 60,
    prCount: 20,
  },
  {
    phase: 3,
    title: "Interactive Story",
    description: "8-chapter narrative with scroll-driven animations",
    features: ["8-chapter story structure", "Scroll-driven animations", "Progressive disclosure", "Paper notebook aesthetic", "Self-teaching design"],
    completedAt: new Date("2026-01-05").getTime(),
    commitCount: 25,
    prCount: 8,
  },
  {
    phase: 2,
    title: "Design System",
    description: "25+ real-time switchable themes with CSS custom properties",
    features: ["Theme architecture with CSS variables", "25+ unique themes", "Real-time theme switching", "Magazine-style theme gallery", "Dark mode across all themes"],
    completedAt: new Date("2025-12-20").getTime(),
    commitCount: 40,
    prCount: 12,
  },
  {
    phase: 1,
    title: "Foundation",
    description: "Portfolio template, blog system, password-protected vault",
    features: ["Next.js 14 App Router setup", "MDX blog system", "Bilingual toggle (EN/PT)", "Interactive Iris Hero", "Password-protected Vault"],
    completedAt: new Date("2025-12-15").getTime(),
    commitCount: 50,
    prCount: 15,
  },
];

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function RoadmapTimeline() {
  const convexMilestones = useQuery(api.roadmap.getMilestones);
  const milestones = convexMilestones && convexMilestones.length > 0
    ? convexMilestones
    : FALLBACK_MILESTONES;

  // Calculate totals
  const totalCommits = milestones.reduce((sum: number, m: { commitCount?: number }) => sum + (m.commitCount || 0), 0);
  const totalPRs = milestones.reduce((sum: number, m: { prCount?: number }) => sum + (m.prCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-xl border border-[hsl(var(--theme-border))]"
          style={{ backgroundColor: 'hsl(var(--theme-card))' }}
        >
          <div className="flex items-center gap-2 text-[hsl(var(--theme-muted-foreground))] text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Phases</span>
          </div>
          <div className="text-2xl font-bold text-[hsl(var(--theme-foreground))]">
            {milestones.length}
          </div>
        </div>
        <div
          className="p-4 rounded-xl border border-[hsl(var(--theme-border))]"
          style={{ backgroundColor: 'hsl(var(--theme-card))' }}
        >
          <div className="flex items-center gap-2 text-[hsl(var(--theme-muted-foreground))] text-sm mb-1">
            <GitCommit className="w-4 h-4" />
            <span>Commits</span>
          </div>
          <div className="text-2xl font-bold text-[hsl(var(--theme-foreground))]">
            {totalCommits}+
          </div>
        </div>
        <div
          className="p-4 rounded-xl border border-[hsl(var(--theme-border))]"
          style={{ backgroundColor: 'hsl(var(--theme-card))' }}
        >
          <div className="flex items-center gap-2 text-[hsl(var(--theme-muted-foreground))] text-sm mb-1">
            <GitPullRequest className="w-4 h-4" />
            <span>PRs Merged</span>
          </div>
          <div className="text-2xl font-bold text-[hsl(var(--theme-foreground))]">
            {totalPRs}+
          </div>
        </div>
        <div
          className="p-4 rounded-xl border border-[hsl(var(--theme-border))]"
          style={{ backgroundColor: 'hsl(var(--theme-card))' }}
        >
          <div className="flex items-center gap-2 text-[hsl(var(--theme-muted-foreground))] text-sm mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Status</span>
          </div>
          <div className="text-lg font-bold text-[hsl(var(--theme-primary))]">
            Active
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: 'hsl(var(--theme-border))' }}
        />

        {/* Milestones */}
        <div className="space-y-6">
          {milestones.map((milestone: Omit<Milestone, '_id'> & { _id?: string }, index: number) => (
            <motion.div
              key={milestone.phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="relative pl-12 sm:pl-20"
            >
              {/* Timeline dot */}
              <div
                className={cn(
                  "absolute left-2 sm:left-6 top-4 w-4 h-4 rounded-full border-2",
                  "flex items-center justify-center"
                )}
                style={{
                  backgroundColor: 'hsl(var(--theme-primary))',
                  borderColor: 'hsl(var(--theme-background))',
                  boxShadow: '0 0 0 3px hsl(var(--theme-primary) / 0.2)',
                }}
              >
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>

              {/* Content card */}
              <div
                className="p-4 sm:p-6 rounded-xl border border-[hsl(var(--theme-border))]"
                style={{ backgroundColor: 'hsl(var(--theme-card))' }}
              >
                {/* Phase and date header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[hsl(var(--theme-muted-foreground))]">
                    Phase {milestone.phase}
                  </span>
                  <span className="text-xs text-[hsl(var(--theme-muted-foreground))]">
                    {formatDate(milestone.completedAt)}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-lg font-semibold text-[hsl(var(--theme-foreground))] mb-2"
                  style={{ fontFamily: 'var(--theme-font-heading)' }}
                >
                  {milestone.title}
                </h3>

                <p className="text-sm text-[hsl(var(--theme-muted-foreground))] mb-4">
                  {milestone.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {milestone.features.map((feature: string, featureIndex: number) => (
                    <span
                      key={featureIndex}
                      className="px-2 py-1 text-xs rounded-md"
                      style={{
                        backgroundColor: 'hsl(var(--theme-muted))',
                        color: 'hsl(var(--theme-muted-foreground))',
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                {(milestone.commitCount || milestone.prCount) && (
                  <div className="flex items-center gap-4 text-xs text-[hsl(var(--theme-muted-foreground))]">
                    {milestone.commitCount && (
                      <div className="flex items-center gap-1">
                        <GitCommit className="w-3 h-3" />
                        <span>{milestone.commitCount} commits</span>
                      </div>
                    )}
                    {milestone.prCount && (
                      <div className="flex items-center gap-1">
                        <GitPullRequest className="w-3 h-3" />
                        <span>{milestone.prCount} PRs</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
