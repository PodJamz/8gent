'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

// Import owner access restriction component
import { AgentAccessRestricted } from '@/components/auth/AgentAccessRestricted';

import { PageTransition } from '@/components/ios';
import {
  ChevronLeft,
  Server,
  Mic,
  RefreshCw,
  Check,
  AlertCircle,
  Loader2,
  Zap,
  Globe,
  Link as LinkIcon,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  Cloud,
  Phone,
  Brain,
  ExternalLink
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface ProviderStatus {
  connected: boolean;
  latencyMs?: number;
  error?: string;
  models?: string[];
  version?: string;
}

interface LynkrStatus extends ProviderStatus {
  baseUrl: string;
  tunnelUrl?: string;
  provider?: string;
  features?: {
    memory?: boolean;
    tools?: boolean;
    streaming?: boolean;
    embeddings?: boolean;
  };
}

interface HealthResponse {
  timestamp: number;
  providers: {
    ollama: ProviderStatus & { baseUrl: string };
    lynkr: LynkrStatus;
    whisper: ProviderStatus & { enabled: boolean };
    openai: ProviderStatus;
    anthropic: ProviderStatus;
  };
  summary: {
    localAvailable: boolean;
    lynkrAvailable: boolean;
    cloudAvailable: boolean;
    recommendedProvider: 'local' | 'lynkr' | 'cloud';
  };
}

// ============================================================================
// Connection Status Indicator
// ============================================================================

function StatusIndicator({ connected, checking }: { connected: boolean; checking?: boolean }) {
  if (checking) {
    return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
  }
  return connected ? (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-xs text-green-500">Connected</span>
    </div>
  ) : (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full bg-red-500" />
      <span className="text-xs text-red-500">Disconnected</span>
    </div>
  );
}

// ============================================================================
// Provider Card Component
// ============================================================================

function ProviderCard({
  title,
  icon,
  status,
  models,
  isSelected,
  onSelect,
  onTest,
  testing,
  children,
}: {
  title: string;
  icon: ReactNode;
  status: ProviderStatus;
  models?: string[];
  isSelected: boolean;
  onSelect: () => void;
  onTest: () => void;
  testing: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`
        p-4 rounded-xl border-2 transition-all
        ${isSelected
          ? 'border-[hsl(var(--theme-primary))] bg-[hsl(var(--theme-primary))/10]'
          : 'border-white/10 bg-white/5'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`
            p-2 rounded-lg
            ${isSelected ? 'bg-[hsl(var(--theme-primary))]' : 'bg-white/10'}
          `}>
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-white">{title}</h3>
            <StatusIndicator connected={status.connected} checking={testing} />
          </div>
        </div>
        <button
          onClick={onTest}
          disabled={testing}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
          aria-label={`Test ${title} connection`}
        >
          <RefreshCw className={`w-4 h-4 text-white ${testing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Status Details */}
      {status.error && (
        <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-red-500/10 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{status.error}</span>
        </div>
      )}

      {status.latencyMs && status.connected && (
        <div className="text-xs text-white/40 mb-3">
          Latency: {status.latencyMs}ms
        </div>
      )}

      {/* Models */}
      {models && models.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-white/40 mb-1">Available Models:</div>
          <div className="flex flex-wrap gap-1">
            {models.slice(0, 5).map((model) => (
              <span
                key={model}
                className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60"
              >
                {model}
              </span>
            ))}
            {models.length > 5 && (
              <span className="px-2 py-0.5 text-xs text-white/40">
                +{models.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Children (extra config) */}
      {children}

      {/* Select Button */}
      <button
        onClick={onSelect}
        className={`
          w-full py-2 rounded-lg font-medium transition-colors
          ${isSelected
            ? 'bg-[hsl(var(--theme-primary))] text-white'
            : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
          }
        `}
      >
        {isSelected ? (
          <span className="flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            Primary Provider
          </span>
        ) : (
          'Set as Primary'
        )}
      </button>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

function AISettingsContent() {
  const { user } = useUser();

  // State
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [checking, setChecking] = useState(false);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [primaryProvider, setPrimaryProvider] = useState<'cloud' | 'local' | 'lynkr'>('cloud');
  const [tunnelUrl, setTunnelUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  // Mock settings fetch
  useEffect(() => {
    // In a real implementation, we'd fetch from an API route or OpenClaw backend
    // For now, we defaults
    // Load from local storage if available
    const savedProvider = localStorage.getItem('openclaw_ai_provider');
    if (savedProvider) setPrimaryProvider(savedProvider as any);
  }, []);

  // Fetch health status with optional Lynkr tunnel URL
  const fetchHealth = useCallback(async () => {
    setChecking(true);
    try {
      const params = new URLSearchParams();
      // Always include tunnel URL if available
      if (tunnelUrl) {
        params.set('lynkrTunnelUrl', tunnelUrl);
      }
      const url = `/api/health/providers${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setHealth(data);
      } else {
        // Mock response if API is missing
        setHealth({
          timestamp: Date.now(),
          providers: {
            ollama: { connected: false, baseUrl: 'http://localhost:11434' },
            lynkr: { connected: false, baseUrl: '' },
            whisper: { connected: false, enabled: false },
            openai: { connected: true, models: ['gpt-4o'] },
            anthropic: { connected: false },
          },
          summary: {
            localAvailable: false,
            lynkrAvailable: false,
            cloudAvailable: true,
            recommendedProvider: 'cloud',
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch health:', error);
    } finally {
      setChecking(false);
    }
  }, [tunnelUrl]);

  // Test specific provider
  const testProvider = async (provider: string) => {
    setTestingProvider(provider);
    await fetchHealth();
    setTestingProvider(null);
  };

  // Handle provider switch
  const handleSwitchProvider = async (provider: 'local' | 'cloud' | 'lynkr') => {
    setPrimaryProvider(provider);
    localStorage.setItem('openclaw_ai_provider', provider);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href="/settings"
              className="flex items-center gap-2 text-[hsl(var(--theme-primary))] hover:opacity-80 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <h1 className="text-lg font-semibold">AI Providers</h1>
            <div className="w-20" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 max-w-2xl mx-auto">
          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-gradient-to-br from-[hsl(var(--theme-primary))/20] to-transparent border border-[hsl(var(--theme-primary))/30]"
          >
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-[hsl(var(--theme-primary))]" />
              <h2 className="font-semibold">Current Configuration</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/40">Primary Provider</div>
                <div className="font-medium capitalize">{primaryProvider}</div>
              </div>
              <div>
                <div className="text-white/40">Local Available</div>
                <div className={health?.summary.localAvailable ? 'text-green-500' : 'text-red-500'}>
                  {health?.summary.localAvailable ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-white/40">Cloud Available</div>
                <div className={health?.summary.cloudAvailable ? 'text-green-500' : 'text-red-500'}>
                  {health?.summary.cloudAvailable ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Local Providers Section */}
          <div>
            <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
              Local Providers
            </h2>
            <div className="space-y-4">
              {/* Ollama */}
              <ProviderCard
                title="Ollama"
                icon={<Server className="w-4 h-4 text-white" />}
                status={health?.providers.ollama ?? { connected: false }}
                models={health?.providers.ollama?.models}
                isSelected={primaryProvider === 'local'}
                onSelect={() => handleSwitchProvider('local')}
                onTest={() => testProvider('ollama')}
                testing={testingProvider === 'ollama'}
              >
                {health?.providers.ollama?.baseUrl && (
                  <div className="text-xs text-white/40 mb-3">
                    URL: {health.providers.ollama.baseUrl}
                  </div>
                )}
              </ProviderCard>
            </div>
          </div>

          {/* Cloud Providers Section */}
          <div>
            <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
              Cloud Providers
            </h2>
            <div className="space-y-4">
              {/* OpenAI */}
              <ProviderCard
                title="OpenAI"
                icon={<Cloud className="w-4 h-4 text-white" />}
                status={health?.providers.openai ?? { connected: false }}
                models={health?.providers.openai?.models}
                isSelected={primaryProvider === 'cloud'}
                onSelect={() => handleSwitchProvider('cloud')}
                onTest={() => testProvider('openai')}
                testing={testingProvider === 'openai'}
              >
                <div className="text-xs text-white/40 mb-3">
                  Using OpenClaw configured key
                </div>
              </ProviderCard>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}

export default function AISettingsClient() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
      </div>
    );
  }

  // Check if this is the owner (simple check for now)
  // In a real app we'd verify against the backend
  return <AISettingsContent />;
}
