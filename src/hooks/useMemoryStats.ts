/**
 * useMemoryStats - Fetch memory counts from Convex
 *
 * Provides statistics about the Recursive Memory Layer (RLM)
 * for display in the agent sidebar.
 */

'use client';

import { useQuery } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import { useMemo } from 'react';

export interface MemoryStats {
  // Counts
  episodicCount: number;
  semanticCount: number;
  activeWorkingSessions: number;

  // Breakdowns
  episodicByType: Record<string, number>;
  semanticByCategory: Record<string, number>;

  // Averages
  avgEpisodicImportance: number;
  avgSemanticConfidence: number;

  // Computed
  totalMemories: number;
  hasMemories: boolean;
}

export interface UseMemoryStatsResult {
  stats: MemoryStats | null;
  isLoading: boolean;

  // Formatted for display
  formatted: {
    episodic: string;
    semantic: string;
    total: string;
    summary: string;
  };
}

const DEFAULT_STATS: MemoryStats = {
  episodicCount: 0,
  semanticCount: 0,
  activeWorkingSessions: 0,
  episodicByType: {},
  semanticByCategory: {},
  avgEpisodicImportance: 0,
  avgSemanticConfidence: 0,
  totalMemories: 0,
  hasMemories: false,
};

export function useMemoryStats(userId: string): UseMemoryStatsResult {
  const statsData = useQuery(api.memories.getMemoryStats, { userId });

  const isLoading = statsData === undefined;

  const stats: MemoryStats | null = useMemo(() => {
    if (!statsData) return null;

    return {
      episodicCount: statsData.episodicCount,
      semanticCount: statsData.semanticCount,
      activeWorkingSessions: statsData.activeWorkingSessions,
      episodicByType: statsData.episodicByType,
      semanticByCategory: statsData.semanticByCategory,
      avgEpisodicImportance: statsData.avgEpisodicImportance,
      avgSemanticConfidence: statsData.avgSemanticConfidence,
      totalMemories: statsData.episodicCount + statsData.semanticCount,
      hasMemories: statsData.episodicCount > 0 || statsData.semanticCount > 0,
    };
  }, [statsData]);

  const formatted = useMemo(() => {
    const s = stats || DEFAULT_STATS;

    // Format numbers with K suffix for large counts
    const formatCount = (n: number) => {
      if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
      return n.toString();
    };

    return {
      episodic: formatCount(s.episodicCount),
      semantic: formatCount(s.semanticCount),
      total: formatCount(s.totalMemories),
      summary: s.hasMemories
        ? `${formatCount(s.episodicCount)} episodic · ${formatCount(s.semanticCount)} semantic`
        : 'No memories yet',
    };
  }, [stats]);

  return {
    stats,
    isLoading,
    formatted,
  };
}

/**
 * Quick access to just the memory indicator for the sidebar
 */
export function useMemoryIndicator(userId: string): {
  label: string;
  count: number;
  isLoading: boolean;
} {
  const { stats, isLoading, formatted } = useMemoryStats(userId);

  return {
    label: formatted.summary,
    count: stats?.totalMemories ?? 0,
    isLoading,
  };
}
