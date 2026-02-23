'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { Search, X, ArrowLeft, ExternalLink, Briefcase, Code, GraduationCap, Palette, User } from 'lucide-react';
import Link from 'next/link';
import { searchPortfolio, SearchResult } from '@/lib/8gent/search';

// Category icons
const categoryIcons: Record<string, React.ReactNode> = {
  project: <Code className="w-4 h-4" />,
  skill: <Code className="w-4 h-4" />,
  work: <Briefcase className="w-4 h-4" />,
  education: <GraduationCap className="w-4 h-4" />,
  theme: <Palette className="w-4 h-4" />,
  about: <User className="w-4 h-4" />,
};

// Category colors
const categoryColors: Record<string, string> = {
  project: 'bg-emerald-500/20 text-emerald-400',
  skill: 'bg-blue-500/20 text-blue-400',
  work: 'bg-amber-500/20 text-amber-400',
  education: 'bg-purple-500/20 text-purple-400',
  theme: 'bg-pink-500/20 text-pink-400',
  about: 'bg-cyan-500/20 text-cyan-400',
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Handle URL query param (for 8gent handoff)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    // Small delay for UX feel
    setTimeout(() => {
      const searchResults = searchPortfolio(searchQuery, { limit: 20 });
      setResults(searchResults);
      setIsSearching(false);
    }, 200);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    // Update URL for sharing/bookmarking
    router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    router.push('/search', { scroll: false });
  };

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-gray-900/80 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <form onSubmit={handleSearch} className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search portfolio..."
                  autoFocus
                  className="w-full bg-white/10 rounded-2xl pl-12 pr-12 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                />
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Empty state */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Search className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Search Portfolio</h2>
            <p className="text-white/60 max-w-md mx-auto">
              Find projects, skills, work experience, themes, and more. Try searching for "AI", "React", or "design".
            </p>

            {/* Quick search suggestions */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['AI', 'React', 'Design', 'Product', 'Claude'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    performSearch(term);
                    router.push(`/search?q=${term}`, { scroll: false });
                  }}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {isSearching && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Results */}
        {hasSearched && !isSearching && (
          <div className="space-y-6">
            {/* Results count */}
            <p className="text-white/60 text-sm">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>

            {/* No results */}
            {results.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-white/60">No results found. Try a different search term.</p>
              </motion.div>
            )}

            {/* Grouped results */}
            <AnimatePresence>
              {Object.entries(groupedResults).map(([type, typeResults], groupIndex) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                  className="space-y-3"
                >
                  {/* Category header */}
                  <div className="flex items-center gap-2 text-sm text-white/50 uppercase tracking-wider">
                    {categoryIcons[type]}
                    <span>{type}s</span>
                    <span className="text-white/30">({typeResults.length})</span>
                  </div>

                  {/* Results list */}
                  <div className="space-y-2">
                    {typeResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: groupIndex * 0.1 + index * 0.05 }}
                      >
                        <LiquidGlass
                          variant="card"
                          intensity="subtle"
                          className="!p-4 !rounded-xl"
                        >
                          <div className="flex items-start gap-3">
                            {/* Category badge */}
                            <div className={`p-2 rounded-lg ${categoryColors[type]}`}>
                              {categoryIcons[type]}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium truncate">{result.title}</h3>
                                {result.url && (
                                  <Link
                                    href={result.url}
                                    className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </Link>
                                )}
                              </div>
                              <p className="text-sm text-white/60 line-clamp-2 mt-1">
                                {result.description}
                              </p>

                              {/* Metadata */}
                              {result.metadata && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {Array.isArray(result.metadata.technologies) && (
                                    <div className="flex flex-wrap gap-1">
                                      {(result.metadata.technologies as string[]).slice(0, 4).map((tech) => (
                                        <span
                                          key={tech}
                                          className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/70"
                                        >
                                          {tech}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  {typeof result.metadata.company === 'string' && (
                                    <span className="text-xs text-white/50">
                                      at {result.metadata.company}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </LiquidGlass>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
