'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  MapPin,
  Building2,
  ExternalLink,
  Plus,
  Check,
  Star,
  MessageSquare,
  Copy,
  CheckCircle,
  Linkedin,
  Mail,
  Github,
  Globe,
  ArrowUpRight,
} from 'lucide-react';
import type { SearchResult, MatchConfidence, ShortlistTag, SocialLinks } from '@/lib/humans/types';
import { TAG_LABELS, TAG_COLORS } from '@/lib/humans/types';
import { getXUrl, hasSocialLinks } from '@/lib/humans/search-provider';

// X/Twitter icon component
function XIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface ProfileDetailProps {
  result: SearchResult;
  onClose: () => void;
  onAddToShortlist: (result: SearchResult, tags?: ShortlistTag[]) => void;
  isInShortlist: boolean;
}

function ConfidenceExplainer({ confidence }: { confidence: MatchConfidence }) {
  const colors = {
    high: 'bg-emerald-500/10 border-emerald-500/30',
    medium: 'bg-amber-500/10 border-amber-500/30',
    low: 'bg-gray-500/10 border-gray-500/30',
  };

  const textColors = {
    high: 'text-emerald-400',
    medium: 'text-amber-400',
    low: 'text-gray-400',
  };

  const labels = {
    high: 'High confidence match',
    medium: 'Medium confidence match',
    low: 'Lower confidence match',
  };

  return (
    <div className={`p-3 rounded-xl border ${colors[confidence]}`}>
      <div className="flex items-center gap-2">
        <Star className={`w-4 h-4 ${textColors[confidence]}`} />
        <span className={`text-sm font-medium ${textColors[confidence]}`}>
          {labels[confidence]}
        </span>
      </div>
    </div>
  );
}

export function ProfileDetail({
  result,
  onClose,
  onAddToShortlist,
  isInShortlist,
}: ProfileDetailProps) {
  const [selectedTags, setSelectedTags] = useState<ShortlistTag[]>([]);
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);

  const toggleTag = (tag: ShortlistTag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAdd = () => {
    onAddToShortlist(result, selectedTags);
  };

  const copyProfileLink = async () => {
    await navigator.clipboard.writeText(result.sourceUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{
            backgroundColor: 'hsl(var(--theme-secondary))',
            color: 'hsl(var(--theme-muted-foreground))',
          }}
        >
          <X className="w-4 h-4" />
        </button>

        <button
          onClick={copyProfileLink}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            backgroundColor: 'hsl(var(--theme-secondary))',
            color: 'hsl(var(--theme-muted-foreground))',
          }}
        >
          {copied ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Link
            </>
          )}
        </button>
      </div>

      {/* Profile Header */}
      <div className="mb-6">
        <h2
          className="text-xl font-bold mb-1"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          {result.name}
        </h2>
        {result.title && (
          <p
            className="text-sm mb-2"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            {result.title}
          </p>
        )}

        <div
          className="flex flex-wrap items-center gap-3 text-xs"
          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
        >
          {result.company && (
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {result.company}
            </span>
          )}
          {result.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {result.location}
            </span>
          )}
        </div>
      </div>

      {/* Confidence */}
      <div className="mb-4">
        <ConfidenceExplainer confidence={result.confidence} />
      </div>

      {/* Why This Match */}
      <div className="mb-6">
        <h3
          className="text-xs font-medium uppercase tracking-wider mb-3"
          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
        >
          Why This Match
        </h3>
        <ul className="space-y-2">
          {result.evidence.roleMatch && (
            <li
              className="flex items-start gap-2 text-sm"
              style={{ color: 'hsl(var(--theme-foreground) / 0.7)' }}
            >
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              Matches role: {result.evidence.roleMatch}
            </li>
          )}
          {result.evidence.locationMatch && (
            <li
              className="flex items-start gap-2 text-sm"
              style={{ color: 'hsl(var(--theme-foreground) / 0.7)' }}
            >
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              Location: {result.evidence.locationMatch}
            </li>
          )}
          {result.evidence.seniorityMatch && (
            <li
              className="flex items-start gap-2 text-sm"
              style={{ color: 'hsl(var(--theme-foreground) / 0.7)' }}
            >
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              Seniority match
            </li>
          )}
          {result.evidence.keywordMatches && result.evidence.keywordMatches.length > 0 && (
            <li
              className="flex items-start gap-2 text-sm"
              style={{ color: 'hsl(var(--theme-foreground) / 0.7)' }}
            >
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              Keywords: {result.evidence.keywordMatches.join(', ')}
            </li>
          )}
        </ul>
      </div>

      {/* Snippet */}
      <div className="mb-6">
        <h3
          className="text-xs font-medium uppercase tracking-wider mb-3"
          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
        >
          Profile Excerpt
        </h3>
        <p
          className="text-sm leading-relaxed rounded-xl p-4"
          style={{
            backgroundColor: 'hsl(var(--theme-secondary) / 0.5)',
            border: '1px solid hsl(var(--theme-border) / 0.5)',
            color: 'hsl(var(--theme-muted-foreground))',
          }}
        >
          {result.snippet}
        </p>
      </div>

      {/* Connect Section - Key Value Differentiator (keeps branded colors for social platforms) */}
      {hasSocialLinks(result.socialLinks) && (
        <div className="mb-6">
          <h3
            className="text-xs font-medium uppercase tracking-wider mb-3"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            Connect Directly
          </h3>
          <div className="space-y-2">
            {/* LinkedIn - Primary contact method */}
            {result.socialLinks.linkedin && (
              <a
                href={result.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0077B5]/10 border border-[#0077B5]/30 hover:bg-[#0077B5]/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0077B5] flex items-center justify-center flex-shrink-0">
                  <Linkedin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: 'hsl(var(--theme-foreground))' }} className="font-medium text-sm">LinkedIn</p>
                  <p className="text-[#0077B5] text-xs truncate">
                    {result.socialLinks.linkedin.replace('https://linkedin.com/in/', '@')}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#0077B5] opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {/* X/Twitter */}
            {result.socialLinks.x && (
              <a
                href={getXUrl(result.socialLinks.x)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl transition-all group"
                style={{
                  backgroundColor: 'hsl(var(--theme-secondary) / 0.5)',
                  border: '1px solid hsl(var(--theme-border))',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: 'hsl(var(--theme-foreground))',
                  }}
                >
                  <XIcon className="w-5 h-5" style={{ color: 'hsl(var(--theme-background))' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: 'hsl(var(--theme-foreground))' }} className="font-medium text-sm">X (Twitter)</p>
                  <p style={{ color: 'hsl(var(--theme-muted-foreground))' }} className="text-xs">@{result.socialLinks.x}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
              </a>
            )}

            {/* Email - Direct outreach */}
            {result.socialLinks.email && (
              <a
                href={`mailto:${result.socialLinks.email}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: 'hsl(var(--theme-foreground))' }} className="font-medium text-sm">Email</p>
                  <p className="text-emerald-400 text-xs truncate">{result.socialLinks.email}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {/* GitHub */}
            {result.socialLinks.github && (
              <a
                href={result.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <Github className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: 'hsl(var(--theme-foreground))' }} className="font-medium text-sm">GitHub</p>
                  <p className="text-purple-400 text-xs truncate">
                    {result.socialLinks.github.replace('https://github.com/', '@')}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {/* Personal Website */}
            {result.socialLinks.website && (
              <a
                href={result.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: 'hsl(var(--theme-foreground))' }} className="font-medium text-sm">Website</p>
                  <p className="text-sky-400 text-xs truncate">
                    {result.socialLinks.website.replace('https://', '')}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Source Link */}
      <a
        href={result.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-3 rounded-xl transition-all mb-6"
        style={{
          backgroundColor: 'hsl(var(--theme-secondary) / 0.5)',
          border: '1px solid hsl(var(--theme-border))',
        }}
      >
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium truncate"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            View Source Profile
          </p>
          <p
            className="text-xs truncate"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            {result.sourceDomain}
          </p>
        </div>
        <ExternalLink className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
      </a>

      {/* Save to Shortlist */}
      {!isInShortlist ? (
        <div
          className="space-y-4 pt-4 mt-auto"
          style={{ borderTop: '1px solid hsl(var(--theme-border))' }}
        >
          <h3
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            Save to Shortlist
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TAG_LABELS) as ShortlistTag[])
              .filter(tag => tag !== 'custom')
              .map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedTags.includes(tag)
                      ? TAG_COLORS[tag]
                      : ''
                  }`}
                  style={
                    !selectedTags.includes(tag)
                      ? {
                          backgroundColor: 'hsl(var(--theme-secondary) / 0.5)',
                          borderColor: 'hsl(var(--theme-border))',
                          color: 'hsl(var(--theme-muted-foreground))',
                        }
                      : undefined
                  }
                >
                  {TAG_LABELS[tag]}
                </button>
              ))}
          </div>

          {/* Add Button */}
          <motion.button
            onClick={handleAdd}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary-foreground))',
            }}
          >
            <Plus className="w-4 h-4" />
            Add to Shortlist
          </motion.button>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mt-auto">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-medium">
            Added to shortlist
          </span>
        </div>
      )}
    </motion.div>
  );
}
