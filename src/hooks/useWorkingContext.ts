/**
 * useWorkingContext - Unified context management for OpenClaw
 *
 * Manages the active working context (project, ticket, PRD, etc.)
 * and provides methods to update context when user @mentions entities.
 *
 * NOTE: Currently stubbed until Convex workingContext is deployed to production.
 * The real implementation uses api.workingContext mutations/queries.
 */

'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Id } from '../../convex/_generated/dataModel';

export interface ActiveContext {
  projectId?: Id<'productProjects'>;
  projectSlug?: string;
  prdId?: Id<'prds'>;
  ticketId?: Id<'tickets'>;
  canvasId?: Id<'designCanvases'>;
  sandboxId?: string;
  repositoryUrl?: string;
  activeEntityId?: string;
  recentEntityIds?: string[];
}

export interface ResolvedContext {
  project: {
    _id: Id<'productProjects'>;
    name: string;
    slug: string;
    status: string;
  } | null;
  ticket: {
    _id: Id<'tickets'>;
    ticketId: string;
    title: string;
    status: string;
    priority: string;
  } | null;
  prd: {
    _id: Id<'prds'>;
    title: string;
    status: string;
  } | null;
  canvas: {
    _id: Id<'designCanvases'>;
    name: string;
  } | null;
}

export interface WorkingContextResult {
  // Current context state
  context: ActiveContext | null;
  resolved: ResolvedContext | null;
  contextSummary: string | null;
  isLoading: boolean;

  // Context chain for display (e.g., "@project:8gent → @prd:ERV → @ticket:ARC-042")
  contextChain: string[];

  // Methods
  setContext: (context: Partial<ActiveContext>) => Promise<void>;
  clearContext: () => Promise<void>;
  trackMention: (entityType: string, entityId: string) => Promise<void>;

  // Computed
  hasActiveContext: boolean;
  recentMentions: string[];
}

/**
 * Stubbed implementation - tracks context in local state.
 * Replace with Convex queries once workingContext is deployed:
 *
 * ```ts
 * import { useQuery, useMutation } from '@/lib/openclaw/hooks';
 * import { api } from '@/lib/convex-shim';
 *
 * const contextData = useQuery(api.workingContext.getActiveContext, { sessionId });
 * const updateContextMutation = useMutation(api.workingContext.updateActiveContext);
 * ```
 */
export function useWorkingContext(sessionId: string, userId: string): WorkingContextResult {
  // Local state for stubbed implementation
  const [context, setContextState] = useState<ActiveContext | null>(null);
  const [recentEntityIds, setRecentEntityIds] = useState<string[]>([]);

  // No resolved context in stubbed mode (would require additional queries)
  const resolved: ResolvedContext | null = null;

  // Build a simple summary
  const contextSummary = useMemo(() => {
    if (!context) return null;
    const parts: string[] = [];
    if (context.projectSlug) parts.push(`Project: ${context.projectSlug}`);
    if (context.sandboxId) parts.push(`Sandbox: active`);
    return parts.length > 0 ? parts.join(' | ') : null;
  }, [context]);

  const isLoading = false;

  // Build context chain for display
  const contextChain = useMemo(() => {
    const chain: string[] = [];
    if (context?.projectSlug) {
      chain.push(`@project:${context.projectSlug}`);
    }
    if (context?.sandboxId) {
      chain.push(`@sandbox:active`);
    }
    return chain;
  }, [context]);

  // Set context
  const setContext = useCallback(
    async (newContext: Partial<ActiveContext>) => {
      setContextState((prev) => ({
        ...prev,
        ...newContext,
      }));
      console.log('[useWorkingContext] Set context (stubbed):', newContext);
    },
    []
  );

  // Clear context
  const clearContext = useCallback(async () => {
    setContextState(null);
    setRecentEntityIds([]);
    console.log('[useWorkingContext] Cleared context (stubbed)');
  }, []);

  // Track @mention
  const trackMention = useCallback(
    async (entityType: string, entityId: string) => {
      setRecentEntityIds((prev) => {
        const filtered = prev.filter((id) => id !== entityId);
        return [entityId, ...filtered].slice(0, 10);
      });
      console.log('[useWorkingContext] Tracked mention (stubbed):', entityType, entityId);
    },
    []
  );

  // Computed values
  const hasActiveContext = Boolean(
    context?.projectId || context?.ticketId || context?.prdId || context?.canvasId || context?.sandboxId
  );

  const recentMentions = context?.recentEntityIds ?? recentEntityIds;

  return {
    context,
    resolved,
    contextSummary,
    isLoading,
    contextChain,
    setContext,
    clearContext,
    trackMention,
    hasActiveContext,
    recentMentions,
  };
}
