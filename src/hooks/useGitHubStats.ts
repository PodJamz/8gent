'use client';

import { useState, useEffect } from 'react';

export interface GitHubStats {
  commits: number;
  prs: number;
  openPrs: number;
  closedPrs: number;
  contributors: number;
  lastCommitDate: string;
  lastCommitMessage: string;
  repoCreatedAt: string;
  daysSinceCreation: number;
}

interface UseGitHubStatsReturn {
  stats: GitHubStats | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Default fallback stats
const FALLBACK_STATS: GitHubStats = {
  commits: 976,
  prs: 428,
  openPrs: 0,
  closedPrs: 428,
  contributors: 1,
  lastCommitDate: new Date().toISOString(),
  lastCommitMessage: 'Latest commit',
  repoCreatedAt: '2025-12-31T00:00:00Z',
  daysSinceCreation: 26,
};

// Global cache to share across components
let globalCache: GitHubStats | null = null;
let globalCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useGitHubStats(): UseGitHubStatsReturn {
  const [stats, setStats] = useState<GitHubStats | null>(globalCache);
  const [isLoading, setIsLoading] = useState(!globalCache);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    // Check if cache is still valid
    if (globalCache && Date.now() - globalCacheTime < CACHE_TTL) {
      setStats(globalCache);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/github/stats');
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }
      const data = await response.json();

      // Update global cache
      globalCache = data;
      globalCacheTime = Date.now();

      setStats(data);
    } catch (err) {
      console.error('Error fetching GitHub stats:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));

      // Use fallback stats on error
      if (!stats) {
        setStats(FALLBACK_STATS);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}

/**
 * Format stats for display
 */
export function formatGitHubStats(stats: GitHubStats | null): string {
  if (!stats) return 'Loading...';
  return `${stats.commits.toLocaleString()} commits · ${stats.prs.toLocaleString()} PRs · ${stats.daysSinceCreation} days`;
}

/**
 * Get just the commit count
 */
export function getCommitCount(stats: GitHubStats | null): number {
  return stats?.commits ?? FALLBACK_STATS.commits;
}

/**
 * Get just the PR count
 */
export function getPRCount(stats: GitHubStats | null): number {
  return stats?.prs ?? FALLBACK_STATS.prs;
}
