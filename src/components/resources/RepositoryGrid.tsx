'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Brain,
  Mic,
  Database,
  Bot,
  Palette,
  Server,
  Wrench,
  LayoutGrid,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RepositoryCard } from './RepositoryCard';
import {
  repositories,
  type Repository,
  type RepositoryCategory,
  CATEGORY_INFO,
  getAllCategories,
} from '@/data/repositories';

const CATEGORY_ICONS: Record<RepositoryCategory, React.ComponentType<{ className?: string }>> = {
  'ai-ml': Brain,
  'voice': Mic,
  'memory': Database,
  'agents': Bot,
  'ui-ux': Palette,
  'backend': Server,
  'devtools': Wrench,
};

export function RepositoryGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RepositoryCategory | 'all'>('all');

  const categories = getAllCategories();

  const filteredRepositories = useMemo(() => {
    let filtered = repositories;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((repo) => repo.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(query) ||
          repo.description.toLowerCase().includes(query) ||
          repo.author.toLowerCase().includes(query) ||
          repo.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: repositories.length };
    categories.forEach((cat) => {
      counts[cat] = repositories.filter((r) => r.category === cat).length;
    });
    return counts;
  }, [categories]);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search repositories by name, description, author, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-11 pr-10 py-3 rounded-xl',
              'bg-muted/30 border border-border/50',
              'text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50',
              'transition-all duration-200'
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {/* All button */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium',
              'border transition-all duration-200',
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            All
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-md text-xs',
                selectedCategory === 'all'
                  ? 'bg-primary-foreground/20'
                  : 'bg-muted'
              )}
            >
              {categoryCounts.all}
            </span>
          </button>

          {/* Category buttons */}
          {categories.map((category) => {
            const info = CATEGORY_INFO[category];
            const Icon = CATEGORY_ICONS[category];
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium',
                  'border transition-all duration-200',
                  isSelected
                    ? 'text-white border-transparent'
                    : 'bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground'
                )}
                style={
                  isSelected
                    ? { background: info.color }
                    : undefined
                }
              >
                <Icon className="w-4 h-4" />
                {info.label}
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded-md text-xs',
                    isSelected ? 'bg-white/20' : 'bg-muted'
                  )}
                >
                  {categoryCounts[category]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing{' '}
        <span className="font-medium text-foreground">
          {filteredRepositories.length}
        </span>{' '}
        {filteredRepositories.length === 1 ? 'repository' : 'repositories'}
        {searchQuery && (
          <>
            {' '}
            matching &quot;<span className="text-foreground">{searchQuery}</span>&quot;
          </>
        )}
        {selectedCategory !== 'all' && (
          <>
            {' '}
            in <span className="text-foreground">{CATEGORY_INFO[selectedCategory].label}</span>
          </>
        )}
      </div>

      {/* Repository grid */}
      <AnimatePresence mode="wait">
        {filteredRepositories.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filteredRepositories.map((repo, index) => (
              <RepositoryCard key={repo.id} repository={repo} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No repositories found
            </h3>
            <p className="text-muted-foreground max-w-md">
              Try adjusting your search query or category filter to find what you&apos;re looking
              for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RepositoryGrid;
