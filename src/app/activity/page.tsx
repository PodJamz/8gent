'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Activity, Info, Terminal, Shield } from 'lucide-react';
import { PageTransition } from '@/components/ios';
import { useSessionBrain } from '@/context/SessionBrainContext';
import { JobCenter } from '@/components/activity/JobCenter';
import { ConvexProvider, ConvexReactClient } from '@/lib/openclaw/hooks';

// ============================================================================
// Convex Client (for standalone usage without auth)
// ============================================================================

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// ============================================================================
// Activity Page Content
// ============================================================================

function ActivityPageContent() {
  const { session } = useSessionBrain();
  const [activeTab, setActiveTab] = useState<'jobs' | 'about'>('jobs');

  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        {/* Header */}
        <header className="flex-shrink-0 sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--theme-primary))]"
              aria-label="Go back home"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white">Activity</h1>
              <p className="text-xs text-white/40">Background jobs and audit trail</p>
            </div>
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'jobs'
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white'
                  }`}
              >
                Jobs
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'about'
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white'
                  }`}
              >
                About
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'jobs' ? (
            <JobCenter sessionId={session.sessionId} className="flex-1" />
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* About Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Durable Async System</h2>
                      <p className="text-xs text-white/50">Background job execution</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">
                    The Activity center provides visibility into all background operations running in
                    OpenClaw-OS. Jobs are durable - they continue server-side even if you close your
                    browser or lose connection. When you return, you can see the progress and results
                    of all your jobs.
                  </p>
                </motion.div>

                {/* How It Works */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                      <Terminal className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">How It Works</h2>
                      <p className="text-xs text-white/50">Technical details</p>
                    </div>
                  </div>
                  <div className="space-y-4 text-sm text-white/70">
                    <div>
                      <h3 className="font-medium text-white mb-1">Job Lifecycle</h3>
                      <ol className="list-decimal list-inside space-y-1 text-white/60">
                        <li>Job is created with a unique ID and idempotency key</li>
                        <li>Job enters the queue with status &quot;queued&quot;</li>
                        <li>Convex scheduled function picks up and processes the job</li>
                        <li>Progress updates are streamed in real-time</li>
                        <li>On completion, results are stored and notification fired</li>
                      </ol>
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">Supported Job Types</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span><strong>Ralph Search</strong> - Iterative people search with refinement</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          <span><strong>Image Generation</strong> - AI image creation (coming soon)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span><strong>PRD Draft</strong> - Product requirements generation (coming soon)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Data & Privacy */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Data & Privacy</h2>
                      <p className="text-xs text-white/50">Your data, your control</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">&#10003;</span>
                      <span>Jobs are scoped to your session ID - only you can see your jobs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">&#10003;</span>
                      <span>No login required - works with anonymous sessions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">&#10003;</span>
                      <span>Job data is automatically cleaned up after 30 days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">&#10003;</span>
                      <span>Full audit trail available for debugging</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Session Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-black/30 border border-white/5 rounded-xl p-4"
                >
                  <div className="text-xs font-mono text-white/40 space-y-1">
                    <div>Session ID: {session.sessionId}</div>
                    <div>Created: {new Date(session.createdAt).toLocaleString()}</div>
                    <div>Last Modified: {new Date(session.lastModified).toLocaleString()}</div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}

// ============================================================================
// Activity Page with Convex Provider
// ============================================================================

// ============================================================================
// Activity Page (OpenClaw Version)
// ============================================================================

export default function ActivityPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <Activity className="w-12 h-12 text-white/20 mb-4" />
        <h1 className="text-xl font-semibold text-white mb-2">Activity Center</h1>
        <p className="text-sm text-white/50 text-center max-w-md">
          Background job execution is being migrated to OpenClaw.
          Check back soon for updates.
        </p>
        <Link
          href="/"
          className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
        >
          Go Home
        </Link>
      </div>
    </PageTransition>
  );
}
