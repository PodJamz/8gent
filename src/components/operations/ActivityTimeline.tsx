'use client';

/**
 * Real-Time Activity Timeline
 *
 * Displays a live stream of backend operations with:
 * - Color-coded categories and threat levels
 * - Latency and token usage
 * - Expandable details
 * - Auto-refresh
 *
 * NOTE: Run `npx convex dev` to generate API types after schema changes.
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@/lib/openclaw/hooks';

import { api } from '@/lib/convex-shim';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Bot,
  Brain,
  Wrench,
  Webhook,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Ban,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';
import {
  THREAT_COLORS,
  STATUS_COLORS,
  CATEGORY_COLORS,
  PROVIDER_COLORS,
} from '@/lib/observability';

interface Operation {
  _id: string;
  operationId: string;
  category: string;
  operation: string;
  provider?: string;
  model?: string;
  status: string;
  latencyMs?: number;
  inputTokens?: number;
  outputTokens?: number;
  errorMessage?: string;
  threatLevel?: string;
  timestamp: number;
  requestSummary?: string;
  responseSummary?: string;
  toolName?: string;
}

const CATEGORY_ICONS: Record<string, typeof Activity> = {
  ai_provider: Bot,
  memory: Brain,
  tool_execution: Wrench,
  webhook: Webhook,
  system: Settings,
};

const STATUS_ICONS: Record<string, typeof CheckCircle> = {
  started: Clock,
  success: CheckCircle,
  error: XCircle,
  timeout: Timer,
  rate_limited: Ban,
};

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatLatency(ms?: number): string {
  if (!ms) return '-';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function OperationRow({ operation }: { operation: Operation }) {
  const [expanded, setExpanded] = useState(false);

  const CategoryIcon = CATEGORY_ICONS[operation.category] ?? Activity;
  const StatusIcon = STATUS_ICONS[operation.status] ?? Clock;
  const categoryColors = CATEGORY_COLORS[operation.category as keyof typeof CATEGORY_COLORS] ?? CATEGORY_COLORS.system;
  const statusColors = STATUS_COLORS[operation.status as keyof typeof STATUS_COLORS] ?? STATUS_COLORS.started;
  const threatColors = THREAT_COLORS[(operation.threatLevel as keyof typeof THREAT_COLORS) ?? 'none'];
  const providerColors = operation.provider
    ? PROVIDER_COLORS[operation.provider as keyof typeof PROVIDER_COLORS]
    : null;

  const hasDetails = operation.requestSummary || operation.responseSummary || operation.errorMessage;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`
        border rounded-xl p-4 backdrop-blur-sm transition-all
        ${threatColors.border} ${threatColors.bg}
        hover:border-white/20
      `}
    >
      {/* Main Row */}
      <div className="flex items-center gap-4">
        {/* Time */}
        <div className="text-xs text-white/40 font-mono w-20 shrink-0">
          {formatTime(operation.timestamp)}
        </div>

        {/* Category Icon */}
        <div className={`p-2 rounded-lg ${categoryColors.bg}`}>
          <CategoryIcon className={`w-4 h-4 ${categoryColors.text}`} />
        </div>

        {/* Operation Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">
              {operation.toolName || operation.operation}
            </span>
            {operation.provider && providerColors && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${providerColors.bg} ${providerColors.text}`}>
                {providerColors.icon} {operation.provider}
              </span>
            )}
            {operation.model && (
              <span className="text-xs text-white/40 truncate">
                {operation.model}
              </span>
            )}
          </div>
          <div className="text-xs text-white/40 mt-0.5">
            {operation.category}
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Tokens */}
          {(operation.inputTokens || operation.outputTokens) && (
            <div className="text-xs text-white/40 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {operation.inputTokens ?? 0}/{operation.outputTokens ?? 0}
            </div>
          )}

          {/* Latency */}
          <div className="text-xs text-white/50 font-mono w-16 text-right">
            {formatLatency(operation.latencyMs)}
          </div>

          {/* Status */}
          <div className={`p-1.5 rounded-lg ${statusColors.bg}`}>
            <StatusIcon className={`w-4 h-4 ${statusColors.text}`} />
          </div>

          {/* Threat Level Indicator */}
          {operation.threatLevel && operation.threatLevel !== 'none' && (
            <div className={`p-1.5 rounded-lg ${threatColors.bg}`}>
              <AlertTriangle className={`w-4 h-4 ${threatColors.text}`} />
            </div>
          )}

          {/* Expand Button */}
          {hasDetails && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-white/40" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/40" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && hasDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-white/10 space-y-2 overflow-hidden"
          >
            {operation.requestSummary && (
              <div>
                <div className="text-xs text-white/40 mb-1">Request</div>
                <div className="text-sm text-white/70 font-mono bg-black/20 rounded-lg p-2 truncate">
                  {operation.requestSummary}
                </div>
              </div>
            )}
            {operation.responseSummary && (
              <div>
                <div className="text-xs text-white/40 mb-1">Response</div>
                <div className="text-sm text-white/70 font-mono bg-black/20 rounded-lg p-2 truncate">
                  {operation.responseSummary}
                </div>
              </div>
            )}
            {operation.errorMessage && (
              <div>
                <div className="text-xs text-red-400 mb-1">Error</div>
                <div className="text-sm text-red-300 font-mono bg-red-500/10 rounded-lg p-2">
                  {operation.errorMessage}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ActivityTimeline() {
  const [minutes, setMinutes] = useState(5);
  const operations = useQuery(api.observability.getActivityStream, {
    minutes,
    limit: 50,
  });

  // Auto-refresh by changing a key when operations update
  const [, setRefreshKey] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setRefreshKey((k) => k + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-violet-400" />
          Activity Stream
        </h2>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          {[1, 5, 15, 30, 60].map((m) => (
            <button
              key={m}
              onClick={() => setMinutes(m)}
              className={`
                px-3 py-1.5 rounded-lg text-sm transition-colors
                ${minutes === m
                  ? 'bg-violet-500/30 text-violet-300 border border-violet-500/50'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
                }
              `}
            >
              {m < 60 ? `${m}m` : '1h'}
            </button>
          ))}
        </div>
      </div>

      {/* Operations List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
        {operations === undefined ? (
          // Loading state
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : operations.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">
              No operations in the last {minutes} minutes
            </p>
          </div>
        ) : (
          // Operations
          <AnimatePresence mode="popLayout">
            {(operations as Operation[]).map((op) => (
              <OperationRow key={op._id} operation={op} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
