'use client';

import { useState, useEffect } from 'react';
import { useHorizontalScroll } from '@/hooks';
import { motion } from 'framer-motion';
import {
  ArrowUp,
  Lightbulb,
  Bug,
  Zap,
  Puzzle,
  HelpCircle,
  Clock,
  CheckCircle,
  Hammer,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import { cn } from '@/lib/utils';
import { Id } from '../../../convex/_generated/dataModel';

type Category = 'feature' | 'improvement' | 'bug' | 'integration' | 'other';
type Status = 'pending' | 'reviewed' | 'planned' | 'building' | 'shipped' | 'declined';

type SuggestionId = Id<'roadmapSuggestions'>;

interface Suggestion {
  _id: SuggestionId;
  title: string;
  description: string;
  category: Category;
  status: Status;
  upvotes: number;
  createdAt: number;
  githubIssueUrl?: string;
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  feature: <Lightbulb className="w-4 h-4" />,
  improvement: <Zap className="w-4 h-4" />,
  bug: <Bug className="w-4 h-4" />,
  integration: <Puzzle className="w-4 h-4" />,
  other: <HelpCircle className="w-4 h-4" />,
};

const STATUS_CONFIG: Record<Status, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: 'Pending Review', icon: <Clock className="w-3 h-3" />, color: 'text-yellow-500' },
  reviewed: { label: 'Reviewed', icon: <Eye className="w-3 h-3" />, color: 'text-blue-500' },
  planned: { label: 'Planned', icon: <CheckCircle className="w-3 h-3" />, color: 'text-purple-500' },
  building: { label: 'Building', icon: <Hammer className="w-3 h-3" />, color: 'text-orange-500' },
  shipped: { label: 'Shipped', icon: <CheckCircle className="w-3 h-3" />, color: 'text-green-500' },
  declined: { label: 'Declined', icon: <Clock className="w-3 h-3" />, color: 'text-gray-500' },
};

function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem('openclaw_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('openclaw_session_id', sessionId);
  }
  return sessionId;
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

interface SuggestionListProps {
  onSuggestClick?: () => void;
}

export function SuggestionList({ onSuggestClick }: SuggestionListProps) {
  const [sessionId, setSessionId] = useState('');
  const [filter, setFilter] = useState<'all' | Category>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const filterScrollRef = useHorizontalScroll<HTMLDivElement>();

  const suggestions = useQuery(api.roadmap.getPublicSuggestions);
  const sessionUpvotes = useQuery(
    api.roadmap.getSessionUpvotes,
    sessionId ? { sessionId } : 'skip'
  );
  const upvoteMutation = useMutation(api.roadmap.upvoteSuggestion);

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const handleUpvote = async (suggestionId: SuggestionId) => {
    if (!sessionId) return;

    try {
      await upvoteMutation({ suggestionId, sessionId });
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  const hasUpvoted = (suggestionId: SuggestionId) => {
    return sessionUpvotes?.includes(suggestionId) ?? false;
  };

  // Filter suggestions
  const filteredSuggestions = suggestions?.filter((s: Suggestion) => {
    if (filter !== 'all' && s.category !== filter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  }) ?? [];

  // Group by status for display
  const groupedSuggestions = {
    building: filteredSuggestions.filter((s: Suggestion) => s.status === 'building'),
    planned: filteredSuggestions.filter((s: Suggestion) => s.status === 'planned'),
    other: filteredSuggestions.filter((s: Suggestion) => !['building', 'planned'].includes(s.status)),
  };

  if (!suggestions) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-[hsl(var(--theme-muted-foreground))]">
          Loading suggestions...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category Filter */}
        <div ref={filterScrollRef} className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
              filter === 'all'
                ? 'bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]'
                : 'bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:bg-[hsl(var(--theme-muted)/0.8)]'
            )}
          >
            All
          </button>
          {(['feature', 'improvement', 'bug', 'integration'] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                filter === cat
                  ? 'bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]'
                  : 'bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:bg-[hsl(var(--theme-muted)/0.8)]'
              )}
            >
              {CATEGORY_ICONS[cat]}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | Status)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium',
              'bg-[hsl(var(--theme-card))] border border-[hsl(var(--theme-border))]',
              'text-[hsl(var(--theme-foreground))]',
              'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)]'
            )}
          >
            <option value="all">All Statuses</option>
            <option value="building">Building</option>
            <option value="planned">Planned</option>
            <option value="reviewed">Reviewed</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
          </select>
        </div>
      </div>

      {/* Building Now Section */}
      {groupedSuggestions.building.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-orange-500 flex items-center gap-2">
            <Hammer className="w-4 h-4" />
            Building Now
          </h3>
          <div className="space-y-3">
            {groupedSuggestions.building.map((suggestion: Suggestion, index: number) => (
              <SuggestionCard
                key={suggestion._id}
                suggestion={suggestion}
                index={index}
                hasUpvoted={hasUpvoted(suggestion._id)}
                onUpvote={() => handleUpvote(suggestion._id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Planned Section */}
      {groupedSuggestions.planned.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-purple-500 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Planned
          </h3>
          <div className="space-y-3">
            {groupedSuggestions.planned.map((suggestion: Suggestion, index: number) => (
              <SuggestionCard
                key={suggestion._id}
                suggestion={suggestion}
                index={index}
                hasUpvoted={hasUpvoted(suggestion._id)}
                onUpvote={() => handleUpvote(suggestion._id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Other Suggestions */}
      {groupedSuggestions.other.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[hsl(var(--theme-muted-foreground))]">
            Community Suggestions
          </h3>
          <div className="space-y-3">
            {groupedSuggestions.other.map((suggestion: Suggestion, index: number) => (
              <SuggestionCard
                key={suggestion._id}
                suggestion={suggestion}
                index={index}
                hasUpvoted={hasUpvoted(suggestion._id)}
                onUpvote={() => handleUpvote(suggestion._id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredSuggestions.length === 0 && (
        <div
          className="text-center py-12 rounded-xl border border-dashed border-[hsl(var(--theme-border))]"
          style={{ backgroundColor: 'hsl(var(--theme-card))' }}
        >
          <Lightbulb className="w-12 h-12 mx-auto mb-4 text-[hsl(var(--theme-muted-foreground))]" />
          <p className="text-[hsl(var(--theme-foreground))] font-medium mb-2">
            No suggestions yet
          </p>
          <p className="text-sm text-[hsl(var(--theme-muted-foreground))] mb-4">
            Be the first to suggest a feature for OpenClaw-OS!
          </p>
          {onSuggestClick && (
            <button
              onClick={onSuggestClick}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                'bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]',
                'hover:bg-[hsl(var(--theme-primary)/0.9)] transition-colors'
              )}
            >
              <Lightbulb className="w-4 h-4" />
              Suggest Something
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface SuggestionCardProps {
  suggestion: {
    _id: SuggestionId;
    title: string;
    description: string;
    category: Category;
    status: Status;
    upvotes: number;
    createdAt: number;
    githubIssueUrl?: string;
  };
  index: number;
  hasUpvoted: boolean;
  onUpvote: () => void;
}

function SuggestionCard({ suggestion, index, hasUpvoted, onUpvote }: SuggestionCardProps) {
  const statusConfig = STATUS_CONFIG[suggestion.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-3 p-4 rounded-xl border border-[hsl(var(--theme-border))]"
      style={{ backgroundColor: 'hsl(var(--theme-card))' }}
    >
      {/* Upvote Button */}
      <button
        onClick={onUpvote}
        className={cn(
          'flex flex-col items-center justify-center w-12 h-16 rounded-lg transition-all shrink-0',
          hasUpvoted
            ? 'bg-[hsl(var(--theme-primary)/0.15)] text-[hsl(var(--theme-primary))]'
            : 'bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))] hover:bg-[hsl(var(--theme-primary)/0.1)] hover:text-[hsl(var(--theme-primary))]'
        )}
      >
        <ArrowUp className={cn('w-4 h-4', hasUpvoted && 'fill-current')} />
        <span className="text-sm font-semibold">{suggestion.upvotes}</span>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-medium text-[hsl(var(--theme-foreground))] line-clamp-1">
            {suggestion.title}
          </h4>
          {suggestion.githubIssueUrl && (
            <a
              href={suggestion.githubIssueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 p-1 rounded hover:bg-[hsl(var(--theme-muted))] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[hsl(var(--theme-muted-foreground))]" />
            </a>
          )}
        </div>

        <p className="text-sm text-[hsl(var(--theme-muted-foreground))] line-clamp-2 mb-2">
          {suggestion.description}
        </p>

        <div className="flex items-center gap-3 text-xs">
          {/* Category */}
          <span className="flex items-center gap-1 text-[hsl(var(--theme-muted-foreground))]">
            {CATEGORY_ICONS[suggestion.category]}
            {suggestion.category}
          </span>

          {/* Status */}
          <span className={cn('flex items-center gap-1', statusConfig.color)}>
            {statusConfig.icon}
            {statusConfig.label}
          </span>

          {/* Time */}
          <span className="text-[hsl(var(--theme-muted-foreground))]">
            {formatTimeAgo(suggestion.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
