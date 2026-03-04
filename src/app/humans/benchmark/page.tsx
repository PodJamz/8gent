'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FlaskConical,
  Play,
  StopCircle,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { getSearchProvider, buildSearchQuery, processSearchResults } from '@/lib/humans/search-provider';
import type { SearchQuery, SearchResult } from '@/lib/humans/types';

// ============================================================================
// Sample Benchmark Queries (based on Exa simple-people-benchmark format)
// ============================================================================

interface BenchmarkQuery {
  id: string;
  query: SearchQuery;
  expectedRole: string;
  expectedLocation?: string;
  expectedSeniority?: string;
}

const BENCHMARK_QUERIES: BenchmarkQuery[] = [
  {
    id: 'bq-001',
    query: {
      intent: 'hire',
      role: 'Senior Software Engineer',
      location: 'San Francisco',
      seniority: 'senior',
    },
    expectedRole: 'software engineer',
    expectedLocation: 'san francisco',
    expectedSeniority: 'senior',
  },
  {
    id: 'bq-002',
    query: {
      intent: 'expert',
      role: 'Machine Learning Engineer',
      location: 'New York',
    },
    expectedRole: 'machine learning',
    expectedLocation: 'new york',
  },
  {
    id: 'bq-003',
    query: {
      intent: 'founder_investor',
      role: 'Startup Founder',
      keywords: 'fintech',
    },
    expectedRole: 'founder',
  },
  {
    id: 'bq-004',
    query: {
      intent: 'hire',
      role: 'Product Manager',
      location: 'Remote',
      seniority: 'lead',
    },
    expectedRole: 'product manager',
    expectedSeniority: 'lead',
  },
  {
    id: 'bq-005',
    query: {
      intent: 'collaborator',
      role: 'UX Designer',
      location: 'Austin',
    },
    expectedRole: 'ux designer',
    expectedLocation: 'austin',
  },
  {
    id: 'bq-006',
    query: {
      intent: 'expert',
      role: 'Data Scientist',
      seniority: 'director',
    },
    expectedRole: 'data scientist',
    expectedSeniority: 'director',
  },
  {
    id: 'bq-007',
    query: {
      intent: 'hire',
      role: 'Frontend Developer',
      keywords: 'React TypeScript',
    },
    expectedRole: 'frontend',
  },
  {
    id: 'bq-008',
    query: {
      intent: 'founder_investor',
      role: 'Venture Capitalist',
      location: 'Boston',
    },
    expectedRole: 'venture',
    expectedLocation: 'boston',
  },
  {
    id: 'bq-009',
    query: {
      intent: 'expert',
      role: 'Security Engineer',
      seniority: 'senior',
    },
    expectedRole: 'security',
    expectedSeniority: 'senior',
  },
  {
    id: 'bq-010',
    query: {
      intent: 'hire',
      role: 'DevOps Engineer',
      location: 'Seattle',
    },
    expectedRole: 'devops',
    expectedLocation: 'seattle',
  },
];

// ============================================================================
// Grading Functions
// ============================================================================

interface GradeResult {
  passed: boolean;
  roleMatch: boolean;
  locationMatch: boolean;
  seniorityMatch: boolean;
}

function gradeResult(
  result: SearchResult,
  expected: BenchmarkQuery
): GradeResult {
  const searchText = `${result.name} ${result.title} ${result.company} ${result.snippet}`.toLowerCase();

  const roleMatch = searchText.includes(expected.expectedRole.toLowerCase());

  const locationMatch = !expected.expectedLocation ||
    (result.location?.toLowerCase().includes(expected.expectedLocation.toLowerCase()) ?? false) ||
    searchText.includes(expected.expectedLocation.toLowerCase());

  const seniorityMatch = !expected.expectedSeniority ||
    searchText.includes(expected.expectedSeniority.toLowerCase());

  // Consider passed if role matches AND at least one other criteria matches (if specified)
  const additionalCriteria = [locationMatch, seniorityMatch];
  const relevantCriteria = additionalCriteria.filter((_, i) =>
    i === 0 ? !!expected.expectedLocation : !!expected.expectedSeniority
  );

  const passed = roleMatch && (relevantCriteria.length === 0 || relevantCriteria.some(c => c));

  return { passed, roleMatch, locationMatch, seniorityMatch };
}

// ============================================================================
// Types
// ============================================================================

interface BenchmarkResult {
  queryId: string;
  results: SearchResult[];
  grades: GradeResult[];
  recallAt1: number;
  recallAt10: number;
  precision: number;
  duration: number;
}

interface BenchmarkSummary {
  totalQueries: number;
  completedQueries: number;
  avgRecallAt1: number;
  avgRecallAt10: number;
  avgPrecision: number;
  avgDuration: number;
}

// ============================================================================
// Dev Check
// ============================================================================

const isDev = process.env.NODE_ENV === 'development';

// ============================================================================
// Main Component
// ============================================================================

export default function BenchmarkPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentQuery, setCurrentQuery] = useState<number>(0);
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [summary, setSummary] = useState<BenchmarkSummary | null>(null);

  const runBenchmark = useCallback(async () => {
    setIsRunning(true);
    setResults([]);
    setSummary(null);

    const provider = getSearchProvider('mock'); // Use mock provider for benchmark
    const benchmarkResults: BenchmarkResult[] = [];

    for (let i = 0; i < BENCHMARK_QUERIES.length; i++) {
      setCurrentQuery(i);
      const benchmark = BENCHMARK_QUERIES[i];

      const startTime = Date.now();

      try {
        const searchString = buildSearchQuery(benchmark.query);
        const rawResults = await provider.search(searchString, {
          category: 'people',
          includeText: true,
          numResults: 10,
        });

        const processedResults = processSearchResults(rawResults, benchmark.query);
        const duration = Date.now() - startTime;

        // Grade each result
        const grades = processedResults.map(r => gradeResult(r, benchmark));

        // Calculate metrics
        const passedCount = grades.filter(g => g.passed).length;
        const recallAt1 = grades.length > 0 && grades[0].passed ? 1 : 0;
        const recallAt10 = passedCount > 0 ? 1 : 0;
        const precision = processedResults.length > 0 ? passedCount / processedResults.length : 0;

        const result: BenchmarkResult = {
          queryId: benchmark.id,
          results: processedResults,
          grades,
          recallAt1,
          recallAt10,
          precision,
          duration,
        };

        benchmarkResults.push(result);
        setResults([...benchmarkResults]);
      } catch (error) {
        console.error(`Benchmark query ${benchmark.id} failed:`, error);
      }

      // Small delay between queries
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Calculate summary
    const avgRecallAt1 = benchmarkResults.reduce((sum, r) => sum + r.recallAt1, 0) / benchmarkResults.length;
    const avgRecallAt10 = benchmarkResults.reduce((sum, r) => sum + r.recallAt10, 0) / benchmarkResults.length;
    const avgPrecision = benchmarkResults.reduce((sum, r) => sum + r.precision, 0) / benchmarkResults.length;
    const avgDuration = benchmarkResults.reduce((sum, r) => sum + r.duration, 0) / benchmarkResults.length;

    setSummary({
      totalQueries: BENCHMARK_QUERIES.length,
      completedQueries: benchmarkResults.length,
      avgRecallAt1,
      avgRecallAt10,
      avgPrecision,
      avgDuration,
    });

    setIsRunning(false);
  }, []);

  const reset = () => {
    setResults([]);
    setSummary(null);
    setCurrentQuery(0);
  };

  // Show dev-only warning if not in development
  if (!isDev) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Development Only</h1>
          <p className="text-white/50 mb-4">The benchmark harness is only available in development mode.</p>
          <Link
            href="/humans"
            className="text-sky-400 hover:text-sky-300 text-sm"
          >
            Return to Humans
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="px-4 py-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/humans"
            className="flex items-center gap-2 text-white/50 hover:text-white/70 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back to Humans</span>
          </Link>

          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-400" />
            <span className="font-semibold">Benchmark Harness</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
              DEV ONLY
            </span>
          </div>

          <div className="w-24" />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">People Search Benchmark</h1>
            <p className="text-white/50 text-sm">
              Test search quality against {BENCHMARK_QUERIES.length} synthetic queries
            </p>
          </div>

          <div className="flex items-center gap-2">
            {results.length > 0 && !isRunning && (
              <button
                onClick={reset}
                className="px-4 py-2 rounded-lg bg-white/10 text-white/70 text-sm font-medium flex items-center gap-2 hover:bg-white/20 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            )}

            <button
              onClick={runBenchmark}
              disabled={isRunning}
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                isRunning
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-sky-500 text-white hover:bg-sky-600'
              }`}
            >
              {isRunning ? (
                <>
                  <StopCircle className="w-4 h-4" />
                  Running... ({currentQuery + 1}/{BENCHMARK_QUERIES.length})
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Benchmark
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-4 gap-4 mb-8"
          >
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-white/50 text-xs mb-2">
                <BarChart3 className="w-4 h-4" />
                Recall@1
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                {(summary.avgRecallAt1 * 100).toFixed(1)}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-white/50 text-xs mb-2">
                <BarChart3 className="w-4 h-4" />
                Recall@10
              </div>
              <div className="text-2xl font-bold text-sky-400">
                {(summary.avgRecallAt10 * 100).toFixed(1)}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-white/50 text-xs mb-2">
                <BarChart3 className="w-4 h-4" />
                Precision
              </div>
              <div className="text-2xl font-bold text-violet-400">
                {(summary.avgPrecision * 100).toFixed(1)}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-white/50 text-xs mb-2">
                <BarChart3 className="w-4 h-4" />
                Avg Duration
              </div>
              <div className="text-2xl font-bold text-amber-400">
                {summary.avgDuration.toFixed(0)}ms
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Table */}
        {results.length > 0 && (
          <div className="rounded-xl bg-white/[0.02] border border-white/10 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 bg-white/[0.02]">
              <h2 className="font-semibold text-sm">Query Results</h2>
            </div>

            <div className="divide-y divide-white/5">
              {results.map((result, i) => {
                const benchmark = BENCHMARK_QUERIES.find(q => q.id === result.queryId);
                const passedCount = result.grades.filter(g => g.passed).length;

                return (
                  <div key={result.queryId} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {result.recallAt10 > 0 ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                          <span className="font-medium text-sm text-white">
                            {benchmark?.query.role}
                          </span>
                          {benchmark?.query.location && (
                            <span className="text-white/40 text-xs">
                              in {benchmark.query.location}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-white/40">
                          {passedCount}/{result.results.length} matches passed • {result.duration}ms
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div>
                          <span className="text-white/40">R@1: </span>
                          <span className={result.recallAt1 > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {result.recallAt1 > 0 ? 'Pass' : 'Fail'}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/40">P: </span>
                          <span className="text-white">{(result.precision * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && !isRunning && (
          <div className="text-center py-16">
            <FlaskConical className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-sm mb-2">No benchmark results yet</p>
            <p className="text-white/25 text-xs">
              Click "Run Benchmark" to test search quality
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
