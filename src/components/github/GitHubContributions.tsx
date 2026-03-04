'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitCommit, Activity, Flame, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GitHubContributionsProps {
  owner: string;
  repo: string;
  staticContributions?: number;
  staticData?: number[][];
  className?: string;
  compact?: boolean;
}

interface WeekData {
  week: number;
  days: number[];
  total: number;
}

// Generate mock data based on a seed for consistent display
function generateMockData(seed: number = 42): WeekData[] {
  const weeks: WeekData[] = [];
  let rng = seed;

  // Simple seeded random
  const random = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng / 0x7fffffff;
  };

  for (let w = 0; w < 12; w++) {
    const days: number[] = [];
    let weekTotal = 0;

    for (let d = 0; d < 7; d++) {
      // Higher activity on weekdays
      const isWeekday = d > 0 && d < 6;
      const baseChance = isWeekday ? 0.7 : 0.3;
      const hasCommit = random() < baseChance;

      if (hasCommit) {
        // Generate commit count (1-8 commits)
        const commits = Math.floor(random() * 8) + 1;
        days.push(commits);
        weekTotal += commits;
      } else {
        days.push(0);
      }
    }

    weeks.push({ week: w, days, total: weekTotal });
  }

  return weeks;
}

// Get intensity level (0-4) based on commit count
function getIntensityLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  return 4;
}

// Intensity colors with theme support
const INTENSITY_COLORS = [
  'hsl(var(--theme-muted) / 0.3)',
  'hsl(var(--theme-primary) / 0.3)',
  'hsl(var(--theme-primary) / 0.5)',
  'hsl(var(--theme-primary) / 0.7)',
  'hsl(var(--theme-primary) / 1)',
];

export function GitHubContributions({
  owner,
  repo,
  staticContributions,
  staticData,
  className,
  compact = false,
}: GitHubContributionsProps) {
  const [weekData, setWeekData] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCommits, setTotalCommits] = useState(0);

  useEffect(() => {
    async function fetchCommitActivity() {
      // Use static data if provided
      if (staticData) {
        const weeks = staticData.map((days, i) => ({
          week: i,
          days,
          total: days.reduce((a, b) => a + b, 0),
        }));
        setWeekData(weeks);
        setTotalCommits(weeks.reduce((acc, w) => acc + w.total, 0));
        setLoading(false);
        return;
      }

      try {
        // Fetch commit activity from GitHub API
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );

        if (response.status === 202) {
          // GitHub is computing stats, use mock data
          const mockData = generateMockData(owner.length + repo.length);
          setWeekData(mockData);
          setTotalCommits(mockData.reduce((acc, w) => acc + w.total, 0));
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const data = await response.json();

        // Take last 12 weeks
        const recentWeeks = data.slice(-12).map((week: { week: number; days: number[]; total: number }, i: number) => ({
          week: i,
          days: week.days,
          total: week.total,
        }));

        setWeekData(recentWeeks);
        setTotalCommits(recentWeeks.reduce((acc: number, w: WeekData) => acc + w.total, 0));
        setLoading(false);
      } catch {
        // Use mock data on error
        const mockData = generateMockData(owner.length + repo.length);
        setWeekData(mockData);
        setTotalCommits(staticContributions || mockData.reduce((acc, w) => acc + w.total, 0));
        setError(null);
        setLoading(false);
      }
    }

    fetchCommitActivity();
  }, [owner, repo, staticData, staticContributions]);

  // Calculate streak
  const currentStreak = useMemo(() => {
    if (weekData.length === 0) return 0;

    let streak = 0;
    const allDays = weekData.flatMap((w) => w.days).reverse();

    for (const commits of allDays) {
      if (commits > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [weekData]);

  // Find most active day
  const mostActiveDay = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];

    weekData.forEach((week) => {
      week.days.forEach((count, dayIndex) => {
        dayCounts[dayIndex] += count;
      });
    });

    const maxIndex = dayCounts.indexOf(Math.max(...dayCounts));
    return dayNames[maxIndex];
  }, [weekData]);

  if (loading) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="h-24 rounded-xl bg-[hsl(var(--theme-muted)/0.3)]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl overflow-hidden',
        'bg-[hsl(var(--theme-card)/0.4)] backdrop-blur-xl',
        'border border-[hsl(var(--theme-border)/0.3)]',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--theme-border)/0.2)]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[hsl(var(--theme-primary))]" />
          <span className="text-sm font-medium text-[hsl(var(--theme-foreground))]">
            Activity Pulse
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[hsl(var(--theme-muted-foreground))]">
          <span className="flex items-center gap-1">
            <GitCommit className="w-3 h-3" />
            {totalCommits} commits
          </span>
          {currentStreak > 0 && (
            <span className="flex items-center gap-1 text-[hsl(var(--theme-primary))]">
              <Flame className="w-3 h-3" />
              {currentStreak}d streak
            </span>
          )}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className={cn('p-4', compact && 'p-3')}>
        <div className="flex gap-1">
          {/* Day labels */}
          {!compact && (
            <div className="flex flex-col gap-1 mr-2 text-[10px] text-[hsl(var(--theme-muted-foreground))]">
              <span className="h-3">Mon</span>
              <span className="h-3 opacity-0">Tue</span>
              <span className="h-3">Wed</span>
              <span className="h-3 opacity-0">Thu</span>
              <span className="h-3">Fri</span>
              <span className="h-3 opacity-0">Sat</span>
              <span className="h-3 opacity-0">Sun</span>
            </div>
          )}

          {/* Weeks grid */}
          <div className="flex gap-1 flex-1">
            {weekData.map((week, weekIndex) => (
              <div key={week.week} className="flex flex-col gap-1 flex-1">
                {week.days.map((count, dayIndex) => {
                  const intensity = getIntensityLevel(count);
                  return (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: weekIndex * 0.02 + dayIndex * 0.01,
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                      className={cn(
                        'aspect-square rounded-sm transition-all duration-200',
                        'hover:ring-2 hover:ring-[hsl(var(--theme-primary)/0.5)] hover:ring-offset-1',
                        'hover:ring-offset-[hsl(var(--theme-background))]',
                        compact ? 'min-h-[8px]' : 'min-h-[12px]'
                      )}
                      style={{
                        backgroundColor: INTENSITY_COLORS[intensity],
                      }}
                      title={`${count} commits`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend & Stats */}
        {!compact && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[hsl(var(--theme-border)/0.2)]">
            {/* Legend */}
            <div className="flex items-center gap-2 text-[10px] text-[hsl(var(--theme-muted-foreground))]">
              <span>Less</span>
              <div className="flex gap-0.5">
                {INTENSITY_COLORS.map((color, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>

            {/* Most active */}
            <div className="flex items-center gap-1 text-xs text-[hsl(var(--theme-muted-foreground))]">
              <TrendingUp className="w-3 h-3" />
              Most active: <span className="font-medium text-[hsl(var(--theme-foreground))]">{mostActiveDay}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
