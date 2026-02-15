'use client';

import { useGitHubStats, formatGitHubStats, type GitHubStats } from '@/hooks/useGitHubStats';
import { motion } from 'framer-motion';

interface GitHubStatsDisplayProps {
  className?: string;
  showLabels?: boolean;
  variant?: 'inline' | 'stacked' | 'compact';
  animate?: boolean;
}

/**
 * Display real-time GitHub stats (commits, PRs, days)
 *
 * Usage:
 * <GitHubStatsDisplay /> // "976 commits · 428 PRs · 26 days"
 * <GitHubStatsDisplay variant="stacked" /> // Vertical layout with labels
 * <GitHubStatsDisplay variant="compact" /> // Just "976 commits"
 */
export function GitHubStatsDisplay({
  className = '',
  showLabels = true,
  variant = 'inline',
  animate = true,
}: GitHubStatsDisplayProps) {
  const { stats, isLoading } = useGitHubStats();

  if (isLoading && !stats) {
    return (
      <span className={`text-muted-foreground ${className}`}>
        Loading stats...
      </span>
    );
  }

  if (variant === 'compact') {
    return (
      <span className={className}>
        {stats?.commits.toLocaleString() ?? '...'} commits
      </span>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <StatItem
          value={stats?.commits ?? 0}
          label="commits"
          animate={animate}
        />
        <StatItem
          value={stats?.prs ?? 0}
          label="PRs merged"
          animate={animate}
          delay={0.1}
        />
        <StatItem
          value={stats?.daysSinceCreation ?? 0}
          label="days building"
          animate={animate}
          delay={0.2}
        />
      </div>
    );
  }

  // Inline variant (default)
  return (
    <span className={className}>
      {formatGitHubStats(stats)}
    </span>
  );
}

interface StatItemProps {
  value: number;
  label: string;
  animate?: boolean;
  delay?: number;
}

function StatItem({ value, label, animate = true, delay = 0 }: StatItemProps) {
  if (!animate) {
    return (
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value.toLocaleString()}</span>
        <span className="text-muted-foreground">{label}</span>
      </div>
    );
  }

  return (
    <motion.div
      className="flex items-baseline gap-2"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <AnimatedNumber value={value} className="text-2xl font-bold" />
      <span className="text-muted-foreground">{label}</span>
    </motion.div>
  );
}

interface AnimatedNumberProps {
  value: number;
  className?: string;
  duration?: number;
}

/**
 * Animated number that counts up
 */
export function AnimatedNumber({
  value,
  className = '',
  duration = 1.5,
}: AnimatedNumberProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {value.toLocaleString()}
      </motion.span>
    </motion.span>
  );
}

/**
 * Simple inline text replacement for blog posts
 * Returns just the number, no labels
 */
export function CommitCount({ className = '' }: { className?: string }) {
  const { stats } = useGitHubStats();
  return <span className={className}>{stats?.commits.toLocaleString() ?? '...'}</span>;
}

export function PRCount({ className = '' }: { className?: string }) {
  const { stats } = useGitHubStats();
  return <span className={className}>{stats?.prs.toLocaleString() ?? '...'}</span>;
}

export function DayCount({ className = '' }: { className?: string }) {
  const { stats } = useGitHubStats();
  return <span className={className}>{stats?.daysSinceCreation ?? '...'}</span>;
}

/**
 * Full stats string: "X commits · Y PRs · Z days"
 */
export function StatsString({ className = '' }: { className?: string }) {
  const { stats } = useGitHubStats();
  return <span className={className}>{formatGitHubStats(stats)}</span>;
}
