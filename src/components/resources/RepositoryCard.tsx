'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Copy,
  Check,
  Brain,
  Mic,
  Database,
  Bot,
  Palette,
  Server,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Repository, type RepositoryCategory, CATEGORY_INFO } from '@/data/repositories';

const CATEGORY_ICONS: Record<RepositoryCategory, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'ai-ml': Brain,
  'voice': Mic,
  'memory': Database,
  'agents': Bot,
  'ui-ux': Palette,
  'backend': Server,
  'devtools': Wrench,
};

interface RepositoryCardProps {
  repository: Repository;
  index?: number;
}

export function RepositoryCard({ repository, index = 0 }: RepositoryCardProps) {
  const [copied, setCopied] = useState(false);

  const categoryInfo = CATEGORY_INFO[repository.category];
  const CategoryIcon = CATEGORY_ICONS[repository.category];
  const cloneCommand = `git clone ${repository.url}.git`;

  const handleCopyClone = async () => {
    await navigator.clipboard.writeText(cloneCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'group relative flex flex-col h-full',
        'rounded-2xl overflow-hidden',
        'bg-card/60 backdrop-blur-sm',
        'border border-border/50',
        'hover:border-primary/30 hover:shadow-lg',
        'transition-all duration-300'
      )}
    >
      {/* Category gradient accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: categoryInfo.color }}
      />

      <div className="flex flex-col flex-1 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${categoryInfo.color}20` }}
            >
              <span style={{ color: categoryInfo.color }}>
                <CategoryIcon className="w-4.5 h-4.5" />
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {repository.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                by {repository.author}
              </p>
            </div>
          </div>

          {/* Category badge */}
          <span
            className="shrink-0 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              background: `${categoryInfo.color}15`,
              color: categoryInfo.color,
            }}
          >
            {categoryInfo.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
          {repository.description}
        </p>

        {/* Tags */}
        {repository.tags && repository.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {repository.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-xs bg-muted/50 text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Language badge */}
        {repository.language && (
          <div className="flex items-center gap-1.5 mb-4 text-xs text-muted-foreground">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: getLanguageColor(repository.language) }}
            />
            {repository.language}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border/30">
          {/* View Repository button */}
          <a
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex-1 flex items-center justify-center gap-2',
              'px-3 py-2 rounded-lg text-sm font-medium',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90 transition-colors'
            )}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Repo
          </a>

          {/* Copy clone command button */}
          <button
            onClick={handleCopyClone}
            className={cn(
              'flex items-center justify-center gap-2',
              'px-3 py-2 rounded-lg text-sm font-medium',
              'bg-muted/50 hover:bg-muted border border-border/50',
              'text-muted-foreground hover:text-foreground transition-all',
              copied && 'bg-green-500/10 border-green-500/30 text-green-600'
            )}
            title={`Copy: ${cloneCommand}`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Clone
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

// Language colors (GitHub-style)
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    'TypeScript': '#3178c6',
    'JavaScript': '#f1e05a',
    'Python': '#3572A5',
    'Rust': '#dea584',
    'Go': '#00ADD8',
    'C++': '#f34b7d',
    'C': '#555555',
    'Java': '#b07219',
    'Ruby': '#701516',
    'Swift': '#F05138',
    'Kotlin': '#A97BFF',
  };
  return colors[language] || '#8b8b8b';
}

export default RepositoryCard;
