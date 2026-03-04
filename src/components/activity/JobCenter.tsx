'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Search,
  Terminal,
  Zap,
  Ban,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface Job {
  _id: string;
  jobId: string;
  jobType: string;
  appId: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  progress?: number;
  progressMessage?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
}

interface JobEvent {
  _id: string;
  jobId: string;
  eventType: string;
  message: string;
  data: Record<string, unknown> | null;
  timestamp: number;
}

// ============================================================================
// Status Badge Component
// ============================================================================

function StatusBadge({ status }: { status: Job['status'] }) {
  const config = {
    queued: {
      icon: Clock,
      label: 'Queued',
      className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      animate: false,
    },
    running: {
      icon: Loader2,
      label: 'Running',
      className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      animate: true,
    },
    succeeded: {
      icon: CheckCircle2,
      label: 'Succeeded',
      className: 'bg-green-500/20 text-green-400 border-green-500/30',
      animate: false,
    },
    failed: {
      icon: XCircle,
      label: 'Failed',
      className: 'bg-red-500/20 text-red-400 border-red-500/30',
      animate: false,
    },
    cancelled: {
      icon: Ban,
      label: 'Cancelled',
      className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      animate: false,
    },
  };

  const selectedConfig = config[status] || config.queued;
  const { icon: Icon, label, className, animate } = selectedConfig;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}
    >
      <Icon className={`w-3 h-3 ${animate ? 'animate-spin' : ''}`} />
      {label}
    </span>
  );
}

// ============================================================================
// Job Type Badge Component
// ============================================================================

function JobTypeBadge({ jobType, appId }: { jobType: string; appId: string }) {
  const typeConfig: Record<string, { icon: typeof Search; label: string }> = {
    ralph_search: { icon: Search, label: 'Ralph Search' },
    image_gen: { icon: Zap, label: 'Image Generation' },
    prd_draft: { icon: Terminal, label: 'PRD Draft' },
  };

  const config = typeConfig[jobType] || { icon: Activity, label: jobType };
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 text-xs text-white/70">
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
      <span className="text-xs text-white/40">{appId}</span>
    </div>
  );
}

// ============================================================================
// Progress Bar Component
// ============================================================================

function ProgressBar({ progress, status }: { progress: number; status: Job['status'] }) {
  const colorClass =
    status === 'succeeded'
      ? 'bg-green-500'
      : status === 'failed'
        ? 'bg-red-500'
        : status === 'cancelled'
          ? 'bg-gray-500'
          : 'bg-blue-500';

  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${colorClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

// ============================================================================
// Job Events Panel Component
// ============================================================================

function JobEventsPanel({ jobId }: { jobId: string }) {
  const events = useQuery(api.jobs.getJobEvents, { jobId });

  if (!events) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-white/40" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="p-4 text-center text-white/40 text-sm">No events recorded</div>
    );
  }

  return (
    <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
      <div className="text-xs font-mono text-white/50 mb-3">AUDIT LOG</div>
      {events.map((event: JobEvent, index: number) => (
        <div
          key={event._id}
          className="flex items-start gap-3 text-xs font-mono"
        >
          <div className="text-white/30 w-20 flex-shrink-0">
            {new Date(event.timestamp).toLocaleTimeString()}
          </div>
          <div
            className={`w-2 h-2 mt-1 rounded-full flex-shrink-0 ${
              event.eventType === 'failed'
                ? 'bg-red-500'
                : event.eventType === 'succeeded'
                  ? 'bg-green-500'
                  : event.eventType === 'started'
                    ? 'bg-blue-500'
                    : 'bg-white/30'
            }`}
          />
          <div className="flex-1 min-w-0">
            <div className="text-white/70">{event.message}</div>
            {event.data && (
              <pre className="mt-1 text-white/40 text-[10px] overflow-x-auto">
                {JSON.stringify(event.data, null, 2)}
              </pre>
            )}
          </div>
          {index < events.length - 1 && (
            <div className="absolute left-[5.25rem] top-4 bottom-0 w-px bg-white/10" />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Job Card Component
// ============================================================================

function JobCard({ job }: { job: Job }) {
  const [expanded, setExpanded] = useState(false);
  const cancelJob = useMutation(api.jobs.cancelJob);

  const canCancel = job.status === 'queued' || job.status === 'running';
  const duration =
    job.completedAt && job.startedAt
      ? ((job.completedAt - job.startedAt) / 1000).toFixed(1)
      : job.startedAt
        ? ((Date.now() - job.startedAt) / 1000).toFixed(1)
        : null;

  const handleCancel = async () => {
    try {
      await cancelJob({ jobId: job.jobId });
    } catch (err) {
      console.error('Failed to cancel job:', err);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between mb-2">
          <JobTypeBadge jobType={job.jobType} appId={job.appId} />
          <div className="flex items-center gap-2">
            <StatusBadge status={job.status} />
            {canCancel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="p-1 hover:bg-white/10 rounded text-white/40 hover:text-red-400 transition-colors"
                title="Cancel job"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4 text-white/40" />
            </motion.div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <ProgressBar progress={job.progress || 0} status={job.status} />
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">{job.progressMessage || 'Waiting...'}</span>
            <span className="text-white/40">
              {duration && `${duration}s`}
              {job.attempts > 1 && ` (attempt ${job.attempts}/${job.maxAttempts})`}
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
          <span className="font-mono">{job.jobId}</span>
          <span>{new Date(job.createdAt).toLocaleString()}</span>
        </div>

        {/* Error */}
        {job.lastError && (
          <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
            <AlertCircle className="w-3 h-3 inline mr-1" />
            {job.lastError}
          </div>
        )}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10"
          >
            {/* Input/Output */}
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-mono text-white/50 mb-2">INPUT</div>
                <pre className="text-xs text-white/70 bg-black/30 p-2 rounded overflow-x-auto max-h-32">
                  {JSON.stringify(job.input, null, 2)}
                </pre>
              </div>
              {job.output && (
                <div>
                  <div className="text-xs font-mono text-white/50 mb-2">OUTPUT</div>
                  <pre className="text-xs text-white/70 bg-black/30 p-2 rounded overflow-x-auto max-h-32">
                    {JSON.stringify(
                      {
                        ...job.output,
                        results: job.output.results
                          ? `[${(job.output.results as unknown[]).length} items]`
                          : undefined,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>

            {/* Events */}
            <div className="border-t border-white/10">
              <JobEventsPanel jobId={job.jobId} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// Main JobCenter Component
// ============================================================================

interface JobCenterProps {
  sessionId: string;
  className?: string;
}

export function JobCenter({ sessionId, className = '' }: JobCenterProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const jobs = useQuery(api.jobs.getJobsBySession, { sessionId, limit: 100 });
  const activeCount = useQuery(api.jobs.getActiveJobsCount, { sessionId });

  const filteredJobs = React.useMemo(() => {
    if (!jobs) return [];

    switch (filter) {
      case 'active':
        return jobs.filter(
          (j: Job) => j.status === 'queued' || j.status === 'running'
        );
      case 'completed':
        return jobs.filter(
          (j: Job) =>
            j.status === 'succeeded' ||
            j.status === 'failed' ||
            j.status === 'cancelled'
        );
      default:
        return jobs;
    }
  }, [jobs, filter]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Job Center</h2>
              <p className="text-xs text-white/50">
                Background tasks and audit trail
              </p>
            </div>
          </div>
          {activeCount !== undefined && activeCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full">
              <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
              <span className="text-xs font-medium text-blue-400">
                {activeCount} active
              </span>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === f
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!jobs ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-white/40" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-white/40">
            <Activity className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No jobs yet</p>
            <p className="text-xs mt-1">
              {filter === 'all'
                ? 'Background tasks will appear here'
                : `No ${filter} jobs`}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job: Job) => (
              <JobCard key={job.jobId} job={job} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-3 border-t border-white/10 bg-black/20">
        <div className="flex items-center justify-between text-xs text-white/40">
          <span className="font-mono">Session: {sessionId.slice(0, 16)}...</span>
          <span>
            {jobs?.length || 0} total jobs
          </span>
        </div>
      </div>
    </div>
  );
}

export default JobCenter;
