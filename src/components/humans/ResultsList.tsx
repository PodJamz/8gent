'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  MapPin,
  Building2,
  ExternalLink,
  Plus,
  Check,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  Linkedin,
  Mail,
  Github,
  Globe,
} from 'lucide-react';
import type { SearchResult, MatchConfidence, SocialLinks } from '@/lib/humans/types';
import { getXUrl } from '@/lib/humans/search-provider';

// X/Twitter icon component
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface ResultsListProps {
  results: SearchResult[];
  isSearching: boolean;
  onSelectResult: (id: string) => void;
  onAddToShortlist: (result: SearchResult) => void;
  isInShortlist: (id: string) => boolean;
  onBack: () => void;
  onRefine?: () => void;
  ralphModeActive: boolean;
  ralphIteration?: number;
  ralphMaxIterations?: number;
}

function ConfidenceBadge({ confidence }: { confidence: MatchConfidence }) {
  const colors = {
    high: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  const labels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${colors[confidence]}`}
    >
      {labels[confidence]}
    </span>
  );
}

interface ResultCardProps {
  result: SearchResult;
  index: number;
  onSelect: () => void;
  onAdd: () => void;
  isInShortlist: boolean;
}

// Social link button component - keeps branded colors for social platforms
function SocialLinkButton({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${color}`}
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

function ResultCard({ result, index, onSelect, onAdd, isInShortlist }: ResultCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { socialLinks } = result;
  const hasSocials = socialLinks && (socialLinks.linkedin || socialLinks.x || socialLinks.email);

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
      className="group relative"
    >
      <div
        onClick={onSelect}
        className="p-4 rounded-2xl transition-all cursor-pointer"
        style={{
          backgroundColor: 'hsl(var(--theme-card))',
          border: '1px solid hsl(var(--theme-border) / 0.5)',
        }}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="font-semibold text-sm truncate"
                style={{ color: 'hsl(var(--theme-foreground))' }}
              >
                {result.name}
              </h3>
              <ConfidenceBadge confidence={result.confidence} />
            </div>

            {result.title && (
              <p
                className="text-xs truncate"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                {result.title}
              </p>
            )}
          </div>

          {/* Quick Add Button */}
          <motion.button
            onClick={e => {
              e.stopPropagation();
              onAdd();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isInShortlist}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              backgroundColor: isInShortlist
                ? 'hsl(var(--theme-primary) / 0.2)'
                : 'hsl(var(--theme-secondary))',
              color: isInShortlist
                ? 'hsl(var(--theme-primary))'
                : 'hsl(var(--theme-muted-foreground))',
            }}
          >
            {isInShortlist ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </motion.button>
        </div>

        {/* Meta Row */}
        <div
          className="flex items-center gap-3 text-xs mb-2"
          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
        >
          {result.company && (
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {result.company}
            </span>
          )}
          {result.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {result.location}
            </span>
          )}
        </div>

        {/* Snippet */}
        <p
          className="text-xs line-clamp-2 leading-relaxed mb-3 opacity-70"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          {result.snippet}
        </p>

        {/* Social Links Row - Key Differentiator (keeps branded colors) */}
        {hasSocials && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {socialLinks.linkedin && (
              <SocialLinkButton
                href={socialLinks.linkedin}
                icon={<Linkedin className="w-3.5 h-3.5" />}
                label="LinkedIn"
                color="bg-[#0077B5]/20 text-[#0077B5] hover:bg-[#0077B5]/30"
              />
            )}
            {socialLinks.x && (
              <SocialLinkButton
                href={getXUrl(socialLinks.x)}
                icon={<XIcon className="w-3 h-3" />}
                label={`@${socialLinks.x}`}
                color="bg-[hsl(var(--theme-secondary))] text-[hsl(var(--theme-foreground))] opacity-70 hover:opacity-100"
              />
            )}
            {socialLinks.email && (
              <SocialLinkButton
                href={`mailto:${socialLinks.email}`}
                icon={<Mail className="w-3.5 h-3.5" />}
                label={socialLinks.email}
                color="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              />
            )}
            {socialLinks.github && (
              <SocialLinkButton
                href={socialLinks.github}
                icon={<Github className="w-3.5 h-3.5" />}
                label="GitHub"
                color="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
              />
            )}
          </div>
        )}

        {/* Source */}
        <div
          className="flex items-center gap-2 pt-3"
          style={{ borderTop: '1px solid hsl(var(--theme-border) / 0.3)' }}
        >
          <span
            className="text-[10px] opacity-50"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            {result.sourceDomain}
          </span>
          <ExternalLink className="w-3 h-3 opacity-30" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
        </div>
      </div>
    </motion.div>
  );
}

export function ResultsList({
  results,
  isSearching,
  onSelectResult,
  onAddToShortlist,
  isInShortlist,
  onBack,
  onRefine,
  ralphModeActive,
  ralphIteration,
  ralphMaxIterations,
}: ResultsListProps) {
  const strongMatches = results.filter(r => r.confidence === 'high').length;
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="text-sm flex items-center gap-1 transition-colors opacity-50 hover:opacity-70"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          <ChevronLeft className="w-4 h-4" />
          New Search
        </button>

        <div className="flex items-center gap-2">
          <span
            className="text-xs opacity-60"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            {results.length} results
            {strongMatches > 0 && (
              <span className="text-emerald-400 ml-1">
                ({strongMatches} strong)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Ralph Mode Status */}
      <AnimatePresence>
        {ralphModeActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 rounded-xl"
            style={{
              backgroundColor: 'hsl(var(--theme-primary) / 0.1)',
              border: '1px solid hsl(var(--theme-primary) / 0.3)',
            }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
              </motion.div>
              <div className="flex-1">
                <p
                  className="text-sm font-medium"
                  style={{ color: 'hsl(var(--theme-primary))' }}
                >
                  Ralph Mode: Refining search {ralphIteration}/{ralphMaxIterations}
                </p>
                <p
                  className="text-xs opacity-60"
                  style={{ color: 'hsl(var(--theme-primary))' }}
                >
                  Improving result quality...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto space-y-3 -mx-4 px-4">
        {isSearching && results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <motion.div
              className="w-8 h-8 border-2 rounded-full mb-4"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                borderTopColor: 'hsl(var(--theme-primary))',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p
              className="text-sm opacity-60"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              Searching for people...
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p
              className="text-sm mb-2 opacity-60"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              No results found
            </p>
            <p
              className="text-xs opacity-40"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          <>
            {results.map((result, index) => (
              <ResultCard
                key={result.id}
                result={result}
                index={index}
                onSelect={() => onSelectResult(result.id)}
                onAdd={() => onAddToShortlist(result)}
                isInShortlist={isInShortlist(result.id)}
              />
            ))}
          </>
        )}
      </div>

      {/* Bottom Actions */}
      {results.length > 0 && !ralphModeActive && onRefine && (
        <div
          className="pt-4 mt-4"
          style={{ borderTop: '1px solid hsl(var(--theme-border) / 0.5)' }}
        >
          <button
            onClick={onRefine}
            className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
            style={{
              backgroundColor: 'hsl(var(--theme-accent) / 0.1)',
              border: '1px solid hsl(var(--theme-accent) / 0.3)',
              color: 'hsl(var(--theme-accent-foreground))',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Refine with Ralph Mode
          </button>
        </div>
      )}
    </div>
  );
}
