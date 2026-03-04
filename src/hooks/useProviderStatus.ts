'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type ProviderType = 'cloud' | 'local' | 'lynkr';
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export interface ProviderStatusData {
  providerType: ProviderType;
  status: ConnectionStatus;
  latencyMs?: number;
  error?: string;
  lastChecked: number;
}

interface HealthResponse {
  timestamp: number;
  providers: {
    ollama: { connected: boolean; latencyMs?: number; error?: string };
    lynkr: { connected: boolean; latencyMs?: number; error?: string };
    openai: { connected: boolean; latencyMs?: number; error?: string };
    anthropic: { connected: boolean; latencyMs?: number; error?: string };
  };
  summary: {
    localAvailable: boolean;
    lynkrAvailable: boolean;
    cloudAvailable: boolean;
    recommendedProvider: 'local' | 'lynkr' | 'cloud';
  };
}

const POLL_INTERVAL = 30000; // 30 seconds
const INITIAL_TIMEOUT = 8000; // 8 seconds for health check

/**
 * Hook to track AI provider connection status
 * Returns the current active provider and its connection status
 */
export function useProviderStatus() {
  const [status, setStatus] = useState<ProviderStatusData>({
    providerType: 'cloud',
    status: 'connecting',
    lastChecked: 0,
  });
  const isCheckingRef = useRef(false);

  const checkHealth = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    try {
      // Check health with timeout for better UX
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), INITIAL_TIMEOUT);

      const healthRes = await fetch('/api/health/providers?checkCloud=false', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!healthRes.ok) {
        setStatus((prev) => ({
          ...prev,
          status: 'disconnected',
          error: 'Health check failed',
          lastChecked: Date.now(),
        }));
        return;
      }

      const health: HealthResponse = await healthRes.json();

      // Determine provider based on what's available
      // Priority: Lynkr > Local > Cloud
      let actualProvider: ProviderType = 'cloud';
      let connectionStatus: ConnectionStatus = 'connected';
      let latency: number | undefined;

      if (health.summary.lynkrAvailable) {
        actualProvider = 'lynkr';
        connectionStatus = 'connected';
        latency = health.providers.lynkr.latencyMs;
      } else if (health.summary.localAvailable) {
        actualProvider = 'local';
        connectionStatus = 'connected';
        latency = health.providers.ollama.latencyMs;
      } else {
        // Default to cloud - assume cloud is always available
        actualProvider = 'cloud';
        connectionStatus = 'connected';
      }

      setStatus({
        providerType: actualProvider,
        status: connectionStatus,
        latencyMs: latency,
        lastChecked: Date.now(),
      });
    } catch (err) {
      // On error, assume cloud fallback is working
      setStatus({
        providerType: 'cloud',
        status: 'connected',
        lastChecked: Date.now(),
      });
    } finally {
      isCheckingRef.current = false;
    }
  }, []);

  // Initial check with a small delay to not block render
  useEffect(() => {
    const timer = setTimeout(checkHealth, 1000);
    return () => clearTimeout(timer);
  }, [checkHealth]);

  // Periodic polling
  useEffect(() => {
    const interval = setInterval(checkHealth, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [checkHealth]);

  // Helper function to get display color
  const getStatusColor = useCallback(() => {
    switch (status.status) {
      case 'connected':
        return '#22c55e'; // green-500
      case 'connecting':
        return '#f97316'; // orange-500
      case 'disconnected':
        return '#ef4444'; // red-500
      default:
        return '#6b7280'; // gray-500
    }
  }, [status.status]);

  // Helper function to get provider display name
  const getProviderDisplayName = useCallback(() => {
    switch (status.providerType) {
      case 'lynkr':
        return 'Lynkr';
      case 'local':
        return 'Local';
      case 'cloud':
        return 'Cloud';
      default:
        return 'Unknown';
    }
  }, [status.providerType]);

  return {
    ...status,
    isChecking: isCheckingRef.current,
    refresh: checkHealth,
    getStatusColor,
    getProviderDisplayName,
  };
}

export default useProviderStatus;
