'use client';

/**
 * ArtifactRenderer - Renders Claude-style artifacts inline in chat
 *
 * Detects and renders:
 * - Code blocks with syntax highlighting
 * - Document artifacts (markdown)
 * - Charts/diagrams
 * - Tables
 * - Referenced data (tickets, PRDs, etc.)
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  FileText,
  Table as TableIcon,
  BarChart3,
  Ticket,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { detectArtifacts, type ArtifactType } from '@/lib/canvas/artifacts';

interface ArtifactRendererProps {
  content: string;
  className?: string;
}

interface ParsedArtifact {
  type: ArtifactType;
  title: string;
  content: string;
  language?: string;
  metadata?: Record<string, unknown>;
}

// Parse artifact blocks from content
function parseArtifacts(content: string): { text: string; artifacts: ParsedArtifact[] } {
  const artifacts: ParsedArtifact[] = [];
  let cleanedText = content;

  // Match code blocks with language
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const language = match[1] || 'plaintext';
    const codeContent = match[2].trim();

    // Don't create artifacts for very short code blocks
    if (codeContent.length > 50 || codeContent.includes('\n')) {
      artifacts.push({
        type: 'code',
        title: `${language.charAt(0).toUpperCase() + language.slice(1)} Code`,
        content: codeContent,
        language,
      });
    }
  }

  // Match @references
  const referenceRegex = /@(ticket|prd|project|task|memory|track):([^\s]+)/g;
  while ((match = referenceRegex.exec(content)) !== null) {
    artifacts.push({
      type: match[1] as ArtifactType,
      title: `${match[1].charAt(0).toUpperCase() + match[1].slice(1)}: ${match[2]}`,
      content: match[2],
      metadata: { referenceType: match[1], referenceId: match[2] },
    });
  }

  return { text: cleanedText, artifacts };
}

// Individual artifact card component
function ArtifactCard({ artifact }: { artifact: ParsedArtifact }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const iconMap: Record<ArtifactType, React.ReactNode> = {
    document: <FileText className="w-4 h-4" />,
    code: <Code className="w-4 h-4" />,
    chart: <BarChart3 className="w-4 h-4" />,
    table: <TableIcon className="w-4 h-4" />,
    diagram: <BarChart3 className="w-4 h-4" />,
    image: <FileText className="w-4 h-4" />,
    prd: <FileText className="w-4 h-4" />,
    ticket: <Ticket className="w-4 h-4" />,
    'user-story': <FileText className="w-4 h-4" />,
    embed: <ExternalLink className="w-4 h-4" />,
  };

  const colorMap: Record<ArtifactType, string> = {
    document: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    code: 'from-green-500/20 to-emerald-600/20 border-green-500/30',
    chart: 'from-purple-500/20 to-violet-600/20 border-purple-500/30',
    table: 'from-orange-500/20 to-amber-600/20 border-orange-500/30',
    diagram: 'from-pink-500/20 to-rose-600/20 border-pink-500/30',
    image: 'from-cyan-500/20 to-teal-600/20 border-cyan-500/30',
    prd: 'from-indigo-500/20 to-blue-600/20 border-indigo-500/30',
    ticket: 'from-amber-500/20 to-yellow-600/20 border-amber-500/30',
    'user-story': 'from-violet-500/20 to-purple-600/20 border-violet-500/30',
    embed: 'from-gray-500/20 to-slate-600/20 border-gray-500/30',
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border overflow-hidden my-3',
        'bg-gradient-to-br',
        colorMap[artifact.type]
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-black/20 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-white/10">
            {iconMap[artifact.type]}
          </div>
          <span className="text-sm font-medium">{artifact.title}</span>
          {artifact.language && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10">
              {artifact.language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {artifact.type === 'code' && (
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Open in editor"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          <button className="p-1 rounded hover:bg-white/10 transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          className="overflow-hidden"
        >
          {artifact.type === 'code' ? (
            <pre className="p-3 text-sm font-mono overflow-x-auto bg-black/30">
              <code className="text-green-300">{artifact.content}</code>
            </pre>
          ) : (
            <div className="p-3 text-sm">
              <p className="whitespace-pre-wrap">{artifact.content}</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// Reference chip component for inline @mentions
function ReferenceChip({
  type,
  name,
}: {
  type: string;
  name: string;
}) {
  const colorMap: Record<string, string> = {
    ticket: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    prd: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    project: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    task: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    memory: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    track: 'bg-red-500/20 text-red-300 border-red-500/30',
    canvas: 'bg-green-500/20 text-green-300 border-green-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border cursor-pointer hover:opacity-80 transition-opacity',
        colorMap[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      )}
    >
      <Ticket className="w-3 h-3" />
      {name}
    </span>
  );
}

// Main artifact renderer
export function ArtifactRenderer({ content, className }: ArtifactRendererProps) {
  const { text, artifacts } = useMemo(() => parseArtifacts(content), [content]);

  // Render text with inline references
  const renderTextWithReferences = (text: string) => {
    const referenceRegex = /@(ticket|prd|project|task|memory|track|canvas):([^\s]+)/g;
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = referenceRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add the reference chip
      parts.push(
        <ReferenceChip
          key={`ref-${match.index}`}
          type={match[1]}
          name={match[2]}
        />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={cn('artifact-renderer', className)}>
      {/* Render artifacts if any */}
      {artifacts.length > 0 && (
        <div className="space-y-2">
          {artifacts.map((artifact, index) => (
            <ArtifactCard key={`artifact-${index}`} artifact={artifact} />
          ))}
        </div>
      )}
    </div>
  );
}

// Export for use in chat messages
export function ChatMessageWithArtifacts({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  // Check if content has artifacts (code blocks or references)
  const hasArtifacts = content.includes('```') || /@(ticket|prd|project|task|memory|track):/.test(content);

  if (!hasArtifacts) {
    return <span className={className}>{content}</span>;
  }

  return <ArtifactRenderer content={content} className={className} />;
}

export default ArtifactRenderer;
