'use client';

/**
 * Metrics Dashboard
 *
 * Overview of key observability metrics:
 * - Operations per minute
 * - Error rate
 * - Token usage
 * - Latency percentiles
 * - Threat events
 *
 * NOTE: Run `npx convex dev` to generate API types after schema changes.
 */

import { useQuery } from '@/lib/openclaw/hooks';

import { api } from '@/lib/convex-shim';
import { motion } from 'framer-motion';
import {
  Activity,
  Zap,
  AlertTriangle,
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
  BarChart3,
  PieChart,
} from 'lucide-react';

function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  color,
  trend,
}: {
  label: string;
  value: string | number;
  subValue?: string;
  icon: typeof Activity;
  color: 'violet' | 'emerald' | 'amber' | 'red' | 'blue' | 'pink';
  trend?: 'up' | 'down' | 'neutral';
}) {
  const colorClasses = {
    violet: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  };

  const iconClasses = colorClasses[color].split(' ')[1];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative overflow-hidden rounded-2xl border backdrop-blur-sm p-4
        bg-white/5 border-white/10 hover:border-white/20 transition-colors
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/40 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subValue && (
            <p className="text-xs text-white/40 mt-1">{subValue}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${colorClasses[color].split(' ').slice(0, 1).join(' ')}`}>
          <Icon className={`w-5 h-5 ${iconClasses}`} />
        </div>
      </div>

      {/* Trend indicator */}
      {trend && trend !== 'neutral' && (
        <div className="absolute bottom-2 right-2">
          <TrendingUp
            className={`w-4 h-4 ${trend === 'up' ? 'text-emerald-400' : 'text-red-400 rotate-180'
              }`}
          />
        </div>
      )}
    </motion.div>
  );
}

function CategoryBreakdown({
  data,
  title,
}: {
  data: Record<string, number>;
  title: string;
}) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);

  const categoryColors: Record<string, string> = {
    ai_provider: 'bg-violet-500',
    memory: 'bg-pink-500',
    tool_execution: 'bg-amber-500',
    webhook: 'bg-cyan-500',
    system: 'bg-slate-500',
    lynkr: 'bg-emerald-500',
    openai: 'bg-green-500',
    anthropic: 'bg-orange-500',
    ollama: 'bg-blue-500',
  };

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
      <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
        <PieChart className="w-4 h-4 text-white/40" />
        {title}
      </h3>

      <div className="space-y-3">
        {sorted.map(([key, value]) => {
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
          const color = categoryColors[key] ?? 'bg-slate-500';

          return (
            <div key={key}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/60 capitalize">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="text-white/40">
                  {value} ({percentage}%)
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${color}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ThreatSummary({
  data,
}: {
  data: Record<string, number>;
}) {
  const threatColors: Record<string, { bg: string; text: string }> = {
    none: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    low: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    high: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
    critical: { bg: 'bg-red-500/20', text: 'text-red-400' },
  };

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
      <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
        <Shield className="w-4 h-4 text-white/40" />
        Threat Levels
      </h3>

      <div className="flex gap-2">
        {['none', 'low', 'medium', 'high', 'critical'].map((level) => {
          const count = data[level] ?? 0;
          const colors = threatColors[level];
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div
              key={level}
              className={`flex-1 rounded-xl p-3 ${colors.bg} border border-white/5`}
            >
              <div className={`text-lg font-bold ${colors.text}`}>{count}</div>
              <div className="text-[10px] text-white/40 capitalize">{level}</div>
              <div className="text-[10px] text-white/30">{percentage}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MetricsDashboard() {
  const overview = useQuery(api.observability.getDashboardOverview, {
    hours: 24,
  });

  if (!overview) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          Metrics Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-amber-400" />
        Metrics Overview (24h)
      </h2>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Operations"
          value={overview.totalOperations.toLocaleString()}
          subValue={`${overview.operationsPerMinute}/min`}
          icon={Activity}
          color="violet"
        />
        <StatCard
          label="Error Rate"
          value={`${overview.errorRate}%`}
          subValue={`${overview.totalErrors} errors`}
          icon={AlertTriangle}
          color={overview.errorRate > 5 ? 'red' : overview.errorRate > 1 ? 'amber' : 'emerald'}
        />
        <StatCard
          label="Avg Latency"
          value={`${overview.avgLatencyMs}ms`}
          subValue={`P99: ${overview.p99LatencyMs}ms`}
          icon={Clock}
          color="blue"
        />
        <StatCard
          label="Token Usage"
          value={overview.totalTokens.toLocaleString()}
          subValue={`$${overview.estimatedCostUsd.toFixed(4)} est`}
          icon={Zap}
          color="pink"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Last Hour"
          value={overview.operationsLastHour.toLocaleString()}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          label="High Threats"
          value={overview.highThreatEvents}
          subValue={`${overview.threatEvents} total`}
          icon={Shield}
          color={overview.highThreatEvents > 0 ? 'red' : 'emerald'}
        />
        <StatCard
          label="Input Tokens"
          value={overview.totalInputTokens.toLocaleString()}
          icon={Zap}
          color="violet"
        />
        <StatCard
          label="Output Tokens"
          value={overview.totalOutputTokens.toLocaleString()}
          icon={Zap}
          color="amber"
        />
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CategoryBreakdown
          data={overview.byCategory}
          title="By Category"
        />
        <CategoryBreakdown
          data={overview.byProvider}
          title="By Provider"
        />
        <ThreatSummary data={overview.byThreatLevel} />
      </div>
    </div>
  );
}
