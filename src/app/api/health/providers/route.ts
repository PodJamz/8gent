/**
 * AI Provider Health Check Endpoint - Phase 3 Local LLM Integration
 *
 * GET /api/health/providers
 *
 * Returns connection status for all AI providers:
 * - Ollama (local LLM)
 * - Lynkr (universal LLM proxy - local models from anywhere)
 * - Whisper (local STT)
 * - Cloud (OpenAI/Anthropic)
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkOllamaHealth, type OllamaHealthStatus } from '@/lib/ollama';
import { checkLynkrHealth, type LynkrHealthStatus } from '@/lib/lynkr';

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
    ollama: ProviderStatus & {
      baseUrl: string;
    };
    lynkr: LynkrStatus;
    whisper: ProviderStatus & {
      enabled: boolean;
    };
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
// Health Check Functions
// ============================================================================

/**
 * Check Ollama health
 */
async function checkOllama(baseUrl: string): Promise<OllamaHealthStatus> {
  return checkOllamaHealth(baseUrl);
}

/**
 * Check Whisper local availability
 * TODO: Implement actual whisper check when local whisper is set up
 */
async function checkWhisper(): Promise<ProviderStatus & { enabled: boolean }> {
  const whisperEnabled = process.env.WHISPER_LOCAL_ENABLED === 'true';

  if (!whisperEnabled) {
    return {
      connected: false,
      enabled: false,
      error: 'Local Whisper not enabled',
    };
  }

  // TODO: Implement actual whisper health check
  // For now, return enabled status
  return {
    connected: whisperEnabled,
    enabled: whisperEnabled,
    latencyMs: 0,
  };
}

/**
 * Check OpenAI API health
 */
async function checkOpenAI(): Promise<ProviderStatus> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      connected: false,
      error: 'OPENAI_API_KEY not configured',
    };
  }

  const start = Date.now();

  try {
    // Quick models list to verify API key works
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return {
        connected: false,
        error: `API returned ${response.status}`,
        latencyMs: Date.now() - start,
      };
    }

    const data = await response.json();
    const models = data.data
      ?.filter((m: { id: string }) => m.id.startsWith('gpt-'))
      ?.map((m: { id: string }) => m.id)
      ?.slice(0, 10) || [];

    return {
      connected: true,
      latencyMs: Date.now() - start,
      models,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Connection failed',
      latencyMs: Date.now() - start,
    };
  }
}

/**
 * Check Anthropic API health
 */
async function checkAnthropic(): Promise<ProviderStatus> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      connected: false,
      error: 'ANTHROPIC_API_KEY not configured',
    };
  }

  const start = Date.now();

  try {
    // Simple request to verify API key
    // Anthropic doesn't have a /models endpoint, so we do a minimal completion
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'hi' }],
      }),
      signal: AbortSignal.timeout(5000),
    });

    // Even if we get rate limited (429), the key is valid
    if (response.ok || response.status === 429) {
      return {
        connected: true,
        latencyMs: Date.now() - start,
        models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
      };
    }

    return {
      connected: false,
      error: `API returned ${response.status}`,
      latencyMs: Date.now() - start,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Connection failed',
      latencyMs: Date.now() - start,
    };
  }
}

/**
 * Check Lynkr proxy health
 * Tries tunnel URL first (for production/remote access), then local URL
 */
async function checkLynkr(baseUrl: string, tunnelUrl?: string): Promise<LynkrStatus> {
  // Try tunnel URL first if available (for remote access)
  const urlsToTry = tunnelUrl ? [tunnelUrl, baseUrl] : [baseUrl];

  for (const url of urlsToTry) {
    const status = await checkLynkrHealth(url);

    if (status.connected) {
      return {
        baseUrl,
        tunnelUrl: tunnelUrl,
        connected: true,
        latencyMs: status.latencyMs,
        provider: status.provider,
        version: status.version,
        features: status.features,
      };
    }
  }

  // All URLs failed
  const lastStatus = await checkLynkrHealth(urlsToTry[urlsToTry.length - 1]);
  return {
    baseUrl,
    tunnelUrl,
    connected: false,
    latencyMs: lastStatus.latencyMs,
    error: lastStatus.error ?? 'Lynkr not reachable',
  };
}

// ============================================================================
// Route Handler
// ============================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ollamaUrl = searchParams.get('ollamaUrl') ?? process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
  const lynkrUrl = searchParams.get('lynkrUrl') ?? process.env.LYNKR_BASE_URL ?? 'http://localhost:8081';
  const lynkrTunnelUrl = searchParams.get('lynkrTunnelUrl') ?? process.env.LYNKR_TUNNEL_URL;
  const checkCloud = searchParams.get('checkCloud') !== 'false';
  const checkLynkrFlag = searchParams.get('checkLynkr') !== 'false';

  // Run health checks in parallel
  const [ollamaStatus, lynkrStatus, whisperStatus, openaiStatus, anthropicStatus] = await Promise.all([
    checkOllama(ollamaUrl),
    checkLynkrFlag ? checkLynkr(lynkrUrl, lynkrTunnelUrl) : Promise.resolve({
      baseUrl: lynkrUrl,
      connected: false,
      error: 'Skipped',
    } as LynkrStatus),
    checkWhisper(),
    checkCloud ? checkOpenAI() : Promise.resolve({ connected: false, error: 'Skipped' } as ProviderStatus),
    checkCloud ? checkAnthropic() : Promise.resolve({ connected: false, error: 'Skipped' } as ProviderStatus),
  ]);

  // Determine availability
  const localAvailable = ollamaStatus.connected;
  const lynkrAvailable = lynkrStatus.connected;
  const cloudAvailable = openaiStatus.connected || anthropicStatus.connected;

  // Recommend provider based on availability and latency
  // Priority: Lynkr (if available) > Local Ollama > Cloud
  let recommendedProvider: 'local' | 'lynkr' | 'cloud' = 'cloud';

  if (lynkrAvailable) {
    // Lynkr is available - use it for "anywhere" access
    recommendedProvider = 'lynkr';
  } else if (localAvailable && (!cloudAvailable || (ollamaStatus.latencyMs ?? 0) < 1000)) {
    // Local Ollama is available and fast
    recommendedProvider = 'local';
  }

  const response: HealthResponse = {
    timestamp: Date.now(),
    providers: {
      ollama: {
        baseUrl: ollamaUrl,
        connected: ollamaStatus.connected,
        latencyMs: ollamaStatus.latencyMs,
        error: ollamaStatus.error,
        models: ollamaStatus.models.map(m => m.name),
        version: ollamaStatus.version,
      },
      lynkr: lynkrStatus,
      whisper: whisperStatus,
      openai: openaiStatus,
      anthropic: anthropicStatus,
    },
    summary: {
      localAvailable,
      lynkrAvailable,
      cloudAvailable,
      recommendedProvider,
    },
  };

  return NextResponse.json(response);
}
