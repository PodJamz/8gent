'use client';

/**
 * Provider Status Cards
 *
 * Shows real-time health status for each AI provider:
 * - Lynkr (local tunnel)
 * - OpenAI
 * - Anthropic
 * - Ollama
 * - Whisper
 *
 * NOTE: Run `npx convex dev` to generate API types after schema changes.
 */

import { useQuery } from '@/lib/openclaw/hooks';

import { api } from '@/lib/convex-shim';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Zap,
  Clock,
  Activity,
  Cpu,
  Cloud,
  Mic,
  Link2,
} from 'lucide-react';

interface ProviderHealth {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  latencyMs?: number;
  lastCheckAt: number;
  consecutiveFailures: number;
  features?: {
    memory?: boolean;
    tools?: boolean;
    streaming?: boolean;
    embeddings?: boolean;
  };
}

const PROVIDER_CONFIG = {
  lynkr: {
    name: 'Lynkr',
    description: 'Local tunnel proxy',
    icon: Link2,
    color: 'emerald',
  },
  openai: {
    name: 'OpenAI',
    description: 'Cloud GPT models',
    icon: Cloud,
    color: 'green',
  },
  anthropic: {
    name: 'Anthropic',
    description: 'Cloud Claude models',
    icon: Cpu,
    color: 'orange',
  },
  ollama: {
    name: 'Ollama',
    description: 'Local LLM inference',
    icon: Zap,
    color: 'blue',
  },
  whisper: {
    name: 'Whisper',
    description: 'Speech-to-text',
    icon: Mic,
    color: 'pink',
  },
};

const STATUS_CONFIG = {
  healthy: {
    icon: CheckCircle,
    label: 'Healthy',
    color: 'emerald',
  },
  degraded: {
    icon: AlertTriangle,
    label: 'Degraded',
    color: 'yellow',
  },
  unhealthy: {
    icon: XCircle,
    label: 'Unhealthy',
    color: 'red',
  },
  unknown: {
    icon: HelpCircle,
    label: 'Unknown',
    color: 'slate',
  },
};

function ProviderCard({
  provider,
  health,
}: {
  provider: keyof typeof PROVIDER_CONFIG;
  health?: ProviderHealth;
}) {
  const config = PROVIDER_CONFIG[provider];
  const status = health?.status ?? 'unknown';
  const statusConfig = STATUS_CONFIG[status];
  const Icon = config.icon;
  const StatusIcon = statusConfig.icon;

  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/10',
    },
    green: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
      glow: 'shadow-green-500/10',
    },
    orange: {
      bg: 'bg-orange-500/20',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      glow: 'shadow-orange-500/10',
    },
    blue: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      glow: 'shadow-blue-500/10',
    },
    pink: {
      bg: 'bg-pink-500/20',
      text: 'text-pink-400',
      border: 'border-pink-500/30',
      glow: 'shadow-pink-500/10',
    },
    yellow: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      glow: 'shadow-yellow-500/10',
    },
    red: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30',
      glow: 'shadow-red-500/10',
    },
    slate: {
      bg: 'bg-slate-500/20',
      text: 'text-slate-400',
      border: 'border-slate-500/30',
      glow: 'shadow-slate-500/10',
    },
  };

  const providerColors = colorClasses[config.color as keyof typeof colorClasses];
  const statusColors = colorClasses[statusConfig.color as keyof typeof colorClasses];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative overflow-hidden rounded-2xl border backdrop-blur-sm
        ${providerColors.border} bg-white/5
        hover:bg-white/10 transition-colors
      `}
    >
      {/* Status Indicator Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${statusColors.bg}`} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${providerColors.bg}`}>
              <Icon className={`w-5 h-5 ${providerColors.text}`} />
            </div>
            <div>
              <h3 className="font-medium text-white">{config.name}</h3>
              <p className="text-xs text-white/40">{config.description}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusColors.bg}`}>
            <StatusIcon className={`w-3.5 h-3.5 ${statusColors.text}`} />
            <span className={`text-xs font-medium ${statusColors.text}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {/* Latency */}
          <div className="bg-black/20 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1">
              <Clock className="w-3 h-3" />
              Latency
            </div>
            <div className="text-lg font-semibold text-white">
              {health?.latencyMs ? `${health.latencyMs}ms` : '-'}
            </div>
          </div>

          {/* Uptime */}
          <div className="bg-black/20 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1">
              <Activity className="w-3 h-3" />
              Failures
            </div>
            <div className="text-lg font-semibold text-white">
              {health?.consecutiveFailures ?? 0}
            </div>
          </div>
        </div>

        {/* Features */}
        {health?.features && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {health.features.memory && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
                Memory
              </span>
            )}
            {health.features.tools && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                Tools
              </span>
            )}
            {health.features.streaming && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                Streaming
              </span>
            )}
            {health.features.embeddings && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">
                Embeddings
              </span>
            )}
          </div>
        )}

        {/* Last Check */}
        {health?.lastCheckAt && (
          <div className="mt-3 text-xs text-white/30">
            Last checked {new Date(health.lastCheckAt).toLocaleTimeString()}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ProviderStatusCards() {
  const healthStatus = useQuery(api.observability.getProviderHealthStatus);

  const providers = ['lynkr', 'openai', 'anthropic', 'ollama', 'whisper'] as const;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-400" />
        Provider Status
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {providers.map((provider) => (
          <ProviderCard
            key={provider}
            provider={provider}
            health={healthStatus?.[provider]}
          />
        ))}
      </div>
    </div>
  );
}
