'use client';

/**
 * Operations Center
 *
 * Admin-only unified observability dashboard for monitoring:
 * - All AI provider calls (Lynkr, OpenAI, Anthropic, Ollama)
 * - RLM memory operations
 * - Tool executions
 * - System events
 *
 * Features:
 * - Real-time activity timeline with threat color coding
 * - Provider health status cards
 * - Metrics dashboard with token usage and latency
 * - Security scan results (ZeroLeaks-inspired)
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/ios';
import { useAdminSession } from '@/hooks/useAdminSession';
import {
  ActivityTimeline,
  ProviderStatusCards,
  MetricsDashboard,
  SecurityScanner,
} from '@/components/operations';
import {
  Activity,
  ChevronLeft,
  Loader2,
  Shield,
  Zap,
  BarChart3,
  RefreshCw,
  Settings,
  Terminal,
  Scan,
} from 'lucide-react';

type TabId = 'activity' | 'metrics' | 'providers' | 'security';

interface Tab {
  id: TabId;
  label: string;
  icon: typeof Activity;
}

const TABS: Tab[] = [
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'metrics', label: 'Metrics', icon: BarChart3 },
  { id: 'providers', label: 'Providers', icon: Zap },
  { id: 'security', label: 'Security', icon: Scan },
];

export default function OperationsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, username } = useAdminSession();
  const [activeTab, setActiveTab] = useState<TabId>('activity');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/settings');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Force re-render by toggling tab
    const current = activeTab;
    setActiveTab('metrics');
    setTimeout(() => {
      setActiveTab(current);
      setIsRefreshing(false);
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-950">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-violet-500/10 to-transparent animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-emerald-500/10 to-transparent animate-pulse delay-1000" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/settings"
                  className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Terminal className="w-6 h-6 text-violet-400" />
                    Operations Center
                  </h1>
                  <p className="text-xs text-white/50">
                    Logged in as {username}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-5 h-5 text-white/60 ${isRefreshing ? 'animate-spin' : ''
                      }`}
                  />
                </button>

                {/* Security Link */}
                <Link
                  href="/security"
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Shield className="w-5 h-5 text-white/60" />
                </Link>

                {/* Settings Link */}
                <Link
                  href="/settings"
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Settings className="w-5 h-5 text-white/60" />
                </Link>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mt-4">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-xl
                      text-sm font-medium transition-all
                      ${isActive
                        ? 'text-white'
                        : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white/10 rounded-xl border border-white/20"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'activity' && (
              <div className="space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <QuickStat label="Active" value="Live" color="emerald" pulse />
                  <QuickStat label="Providers" value="5" color="violet" />
                  <QuickStat label="Last 5m" value="--" color="amber" />
                  <QuickStat label="Threats" value="0" color="red" />
                </div>

                <ActivityTimeline />
              </div>
            )}

            {activeTab === 'metrics' && <MetricsDashboard />}

            {activeTab === 'providers' && (
              <div className="space-y-8">
                <ProviderStatusCards />

                {/* Provider Actions */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Provider Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                      Check All Health
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30 transition-colors">
                      View Lynkr Logs
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors">
                      Test Connection
                    </button>
                    <button
                      onClick={() => setActiveTab('security')}
                      className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                    >
                      Run Security Scan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && <SecurityScanner />}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-4 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-white/30">
            Operations Center v1.0 | 8gent Observability System
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}

function QuickStat({
  label,
  value,
  color,
  pulse,
}: {
  label: string;
  value: string;
  color: 'emerald' | 'violet' | 'amber' | 'red';
  pulse?: boolean;
}) {
  const colorClasses = {
    emerald: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
    violet: 'text-violet-400 bg-violet-500/20 border-violet-500/30',
    amber: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    red: 'text-red-400 bg-red-500/20 border-red-500/30',
  };

  return (
    <div
      className={`
        relative rounded-xl border p-3 backdrop-blur-sm
        ${colorClasses[color]}
      `}
    >
      {pulse && (
        <span className="absolute top-2 right-2 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}
      <div className="text-xs text-white/40">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
