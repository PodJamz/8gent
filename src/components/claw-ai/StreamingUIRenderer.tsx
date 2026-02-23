/**
 * StreamingUIRenderer - Real-time AI-generated UI
 *
 * The "Generative Dimension" component that renders AI-generated UI
 * progressively as the model streams its response.
 *
 * Features:
 * - Progressive rendering with smooth animations
 * - Skeleton placeholders while loading
 * - Error boundaries for invalid components
 * - Theme-aware styling
 *
 * @version 0.1.0
 * @since 2026-02-04
 */

'use client';

import { memo, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Boxes, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClawAIUIRenderer, parseUITree, type UITree } from '@/lib/8gent/json-render-provider';
import { useJsonRenderStream, type StreamingUIState } from '@/hooks/useJsonRenderStream';

// =============================================================================
// Props
// =============================================================================

interface StreamingUIRendererProps {
  /** Complete UI tree (for non-streaming render) */
  tree?: UITree | null;
  /** Raw JSON string to parse and render */
  jsonString?: string;
  /** Whether we're currently receiving streamed data */
  isStreaming?: boolean;
  /** Optional title above the UI */
  title?: string;
  /** Compact mode for chat bubbles */
  compact?: boolean;
  /** Additional className */
  className?: string;
  /** Called when rendering is complete */
  onComplete?: () => void;
  /** Called on error */
  onError?: (error: string) => void;
}

// =============================================================================
// Animation Variants
// =============================================================================

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

const elementVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
    },
  },
};

const shimmerVariants = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear' as const,
    },
  },
};

// =============================================================================
// Main Component
// =============================================================================

export const StreamingUIRenderer = memo(function StreamingUIRenderer({
  tree: propTree,
  jsonString,
  isStreaming: propIsStreaming,
  title,
  compact = false,
  className,
  onComplete,
  onError,
}: StreamingUIRendererProps) {
  // Use streaming hook if we have raw JSON
  const streamState = useJsonRenderStream({
    debug: process.env.NODE_ENV === 'development',
    onComplete,
    onError,
  });

  // Determine which tree to render
  const tree = useMemo(() => {
    // If we have a prop tree, use it
    if (propTree) return propTree;

    // If we have streaming state, use that
    if (streamState.tree) return streamState.tree;

    // If we have a JSON string, try to parse it
    if (jsonString) {
      try {
        return parseUITree(JSON.parse(jsonString));
      } catch {
        return null;
      }
    }

    return null;
  }, [propTree, streamState.tree, jsonString]);

  const isStreaming = propIsStreaming ?? streamState.isStreaming;
  const error = streamState.error;
  const progress = streamState.progress;
  const elementCount = streamState.elementCount;

  // Handle completion callback for prop tree
  useEffect(() => {
    if (propTree && !propIsStreaming && onComplete) {
      onComplete();
    }
  }, [propTree, propIsStreaming, onComplete]);

  // If no tree and no streaming, show nothing
  if (!tree && !isStreaming) {
    return null;
  }

  return (
    <motion.div
      className={cn(
        'relative rounded-xl overflow-hidden',
        compact ? 'bg-transparent' : 'bg-white/5 border border-white/10',
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header */}
      {(title || isStreaming) && (
        <Header
          title={title}
          isStreaming={isStreaming}
          progress={progress}
          elementCount={elementCount}
          compact={compact}
        />
      )}

      {/* Content */}
      <div className={cn('relative', compact ? 'p-0' : 'p-3')}>
        <AnimatePresence mode="wait">
          {error ? (
            <ErrorDisplay key="error" error={error} />
          ) : tree ? (
            <motion.div key="content" variants={elementVariants}>
              <ClawAIUIRenderer tree={tree} loading={isStreaming} />
            </motion.div>
          ) : isStreaming ? (
            <LoadingSkeleton key="loading" compact={compact} />
          ) : null}
        </AnimatePresence>

        {/* Shimmer overlay during streaming */}
        {isStreaming && tree && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </motion.div>
        )}
      </div>

      {/* Magic sparkle effect during generation */}
      {isStreaming && (
        <motion.div
          className="absolute top-2 right-2"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sparkles className="w-4 h-4 text-amber-400/60" />
        </motion.div>
      )}
    </motion.div>
  );
});

// =============================================================================
// Sub-Components
// =============================================================================

interface HeaderProps {
  title?: string;
  isStreaming: boolean;
  progress: number;
  elementCount: number;
  compact: boolean;
}

function Header({ title, isStreaming, progress, elementCount, compact }: HeaderProps) {
  if (compact && !title) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 border-b border-white/5',
        compact ? 'px-0 py-1' : 'px-3 py-2'
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'p-1.5 rounded-lg',
            isStreaming ? 'bg-amber-500/20' : 'bg-white/10'
          )}
        >
          {isStreaming ? (
            <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          ) : (
            <Boxes className="w-3.5 h-3.5 text-white/60" />
          )}
        </div>
        <span className="text-xs text-white/60">
          {title || (isStreaming ? 'Generating UI...' : 'Custom UI')}
        </span>
      </div>

      {isStreaming && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/40">{elementCount} elements</span>
          <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-500/60 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface ErrorDisplayProps {
  error: string;
}

function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <motion.div
      className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
      variants={elementVariants}
    >
      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-red-400">Failed to render UI</p>
        <p className="text-[10px] text-red-400/70 mt-0.5">{error}</p>
      </div>
    </motion.div>
  );
}

interface LoadingSkeletonProps {
  compact: boolean;
}

function LoadingSkeleton({ compact }: LoadingSkeletonProps) {
  return (
    <motion.div
      className={cn('space-y-2', compact ? '' : 'p-1')}
      variants={elementVariants}
    >
      {/* Simulate loading cards */}
      <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
      <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
      <div className="h-3 w-5/6 bg-white/5 rounded animate-pulse" />
      <div className="flex gap-2 mt-3">
        <div className="h-8 w-20 bg-white/10 rounded-lg animate-pulse" />
        <div className="h-8 w-16 bg-white/5 rounded-lg animate-pulse" />
      </div>
    </motion.div>
  );
}

// =============================================================================
// Export Types
// =============================================================================

export type { StreamingUIRendererProps, StreamingUIState };
