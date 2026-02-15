import { NextResponse } from 'next/server';

const GITHUB_REPO = 'PodJamz/resume';
const CACHE_DURATION = 300; // 5 minutes in seconds

interface GitHubStats {
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

// In-memory cache for serverless
let cachedStats: GitHubStats | null = null;
let cacheTimestamp = 0;

async function fetchGitHubStats(): Promise<GitHubStats> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'OpenClaw-OS',
  };

  // Add auth token if available (increases rate limit from 60 to 5000/hour)
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  // Fetch repo info
  const repoRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, { headers });
  if (!repoRes.ok) throw new Error(`GitHub API error: ${repoRes.status}`);
  const repo = await repoRes.json();

  // Fetch commit count via contributors endpoint (includes total commits)
  const contributorsRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contributors?per_page=100`,
    { headers }
  );
  const contributors = await contributorsRes.json();
  const totalCommits = Array.isArray(contributors)
    ? contributors.reduce((sum: number, c: { contributions: number }) => sum + c.contributions, 0)
    : 0;

  // Fetch PR counts
  const [openPrsRes, closedPrsRes] = await Promise.all([
    fetch(`https://api.github.com/search/issues?q=repo:${GITHUB_REPO}+type:pr+state:open`, { headers }),
    fetch(`https://api.github.com/search/issues?q=repo:${GITHUB_REPO}+type:pr+state:closed`, { headers }),
  ]);

  const openPrs = await openPrsRes.json();
  const closedPrs = await closedPrsRes.json();

  // Fetch latest commit
  const commitsRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=1`,
    { headers }
  );
  const commits = await commitsRes.json();
  const lastCommit = Array.isArray(commits) && commits.length > 0 ? commits[0] : null;

  // Calculate days since creation
  const createdAt = new Date(repo.created_at);
  const now = new Date();
  const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

  return {
    commits: totalCommits,
    prs: (openPrs.total_count || 0) + (closedPrs.total_count || 0),
    openPrs: openPrs.total_count || 0,
    closedPrs: closedPrs.total_count || 0,
    contributors: Array.isArray(contributors) ? contributors.length : 1,
    lastCommitDate: lastCommit?.commit?.author?.date || '',
    lastCommitMessage: lastCommit?.commit?.message?.split('\n')[0] || '',
    repoCreatedAt: repo.created_at,
    daysSinceCreation,
  };
}

export async function GET() {
  try {
    const now = Date.now();

    // Return cached stats if still valid
    if (cachedStats && (now - cacheTimestamp) < CACHE_DURATION * 1000) {
      return NextResponse.json(cachedStats, {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
        },
      });
    }

    // Fetch fresh stats
    const stats = await fetchGitHubStats();

    // Update cache
    cachedStats = stats;
    cacheTimestamp = now;

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
      },
    });
  } catch (error) {
    console.error('GitHub stats error:', error);

    // Return cached data if available, even if stale
    if (cachedStats) {
      return NextResponse.json(cachedStats, {
        headers: {
          'Cache-Control': 'public, s-maxage=60',
        },
      });
    }

    // Fallback stats if everything fails
    return NextResponse.json({
      commits: 976,
      prs: 428,
      openPrs: 0,
      closedPrs: 428,
      contributors: 1,
      lastCommitDate: new Date().toISOString(),
      lastCommitMessage: 'Latest commit',
      repoCreatedAt: '2025-12-31T00:00:00Z',
      daysSinceCreation: 26,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60',
      },
    });
  }
}
