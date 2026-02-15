/**
 * useMentionSearch - Search for entities to @mention
 *
 * Provides autocomplete suggestions when user types @ in chat.
 * Searches across projects, tickets, PRDs, canvases, and memories.
 */

'use client';

import { useQuery } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import { useMemo, useState, useCallback } from 'react';

export type MentionType = 'project' | 'ticket' | 'prd' | 'epic' | 'canvas' | 'memory';

export interface MentionSuggestion {
  type: MentionType;
  id: string;
  displayId: string; // e.g., "ARC-042" for tickets, slug for projects
  label: string;
  description?: string;
  icon?: string;
}

export interface UseMentionSearchResult {
  // Search state
  query: string;
  setQuery: (query: string) => void;
  isSearching: boolean;

  // Results
  suggestions: MentionSuggestion[];
  recentMentions: MentionSuggestion[];

  // Actions
  search: (query: string) => void;
  clearSearch: () => void;

  // Parse helpers
  parseMention: (text: string) => { type: MentionType; id: string } | null;
  formatMention: (type: MentionType, id: string) => string;
}

export function useMentionSearch(userId?: string): UseMentionSearchResult {
  const [query, setQuery] = useState('');

  // Search projects
  const projects = useQuery(
    api.agentic.getProductProjects,
    userId ? { ownerId: userId } : 'skip'
  );

  // Search tickets (recent)
  const tickets = useQuery(
    api.agentic.getRecentTickets,
    userId ? { limit: 20 } : 'skip'
  );

  // Search PRDs
  const prds = useQuery(
    api.agentic.getPRDs,
    userId ? {} : 'skip'
  );

  // Search memories
  // SECURITY FIX: Pass userId to searchMemories to prevent cross-user data exposure
  const memories = useQuery(
    api.memories.searchMemories,
    query.length > 2 && userId ? { userId, query, limit: 5 } : 'skip'
  );

  // Search canvases
  const canvases = useQuery(
    api.designCanvas.listCanvases,
    userId ? { limit: 10 } : 'skip'
  );

  const isSearching = query.length > 0 && (
    projects === undefined ||
    tickets === undefined
  );

  // Build suggestions from all sources
  const suggestions = useMemo(() => {
    const results: MentionSuggestion[] = [];
    const queryLower = query.toLowerCase();

    // Filter projects
    if (projects) {
      for (const project of projects) {
        if (
          query.length === 0 ||
          project.name.toLowerCase().includes(queryLower) ||
          project.slug.toLowerCase().includes(queryLower)
        ) {
          results.push({
            type: 'project',
            id: project._id,
            displayId: project.slug,
            label: project.name,
            description: project.description,
            icon: '📁',
          });
        }
      }
    }

    // Filter tickets
    if (tickets) {
      for (const ticket of tickets) {
        if (
          query.length === 0 ||
          ticket.ticketId.toLowerCase().includes(queryLower) ||
          ticket.title.toLowerCase().includes(queryLower)
        ) {
          results.push({
            type: 'ticket',
            id: ticket._id,
            displayId: ticket.ticketId,
            label: ticket.title,
            description: `${ticket.status} · ${ticket.priority}`,
            icon: ticket.type === 'bug' ? '🐛' : ticket.type === 'story' ? '📖' : '📋',
          });
        }
      }
    }

    // Filter PRDs
    if (prds) {
      for (const prd of prds) {
        if (
          query.length === 0 ||
          prd.title.toLowerCase().includes(queryLower)
        ) {
          results.push({
            type: 'prd',
            id: prd._id,
            displayId: prd.title.slice(0, 20),
            label: prd.title,
            description: prd.status,
            icon: '📄',
          });
        }
      }
    }

    // Filter canvases
    if (canvases) {
      for (const canvas of canvases) {
        if (
          query.length === 0 ||
          canvas.name.toLowerCase().includes(queryLower)
        ) {
          results.push({
            type: 'canvas',
            id: canvas._id,
            displayId: canvas.name.slice(0, 20),
            label: canvas.name,
            description: canvas.canvasType,
            icon: '🎨',
          });
        }
      }
    }

    // Add memories if searching
    if (memories && query.length > 2) {
      for (const memory of memories) {
        results.push({
          type: 'memory',
          id: memory._id,
          displayId: memory.content.slice(0, 20),
          label: memory.content.slice(0, 50),
          description: memory.type,
          icon: '🧠',
        });
      }
    }

    // Sort: exact matches first, then alphabetically
    return results.sort((a, b) => {
      const aExact = a.displayId.toLowerCase() === queryLower || a.label.toLowerCase() === queryLower;
      const bExact = b.displayId.toLowerCase() === queryLower || b.label.toLowerCase() === queryLower;
      if (aExact && !bExact) return -1;
      if (bExact && !aExact) return 1;
      return a.label.localeCompare(b.label);
    }).slice(0, 10);
  }, [query, projects, tickets, prds, canvases, memories]);

  // Recent mentions (no query filter)
  const recentMentions = useMemo(() => {
    const results: MentionSuggestion[] = [];

    // Add recent tickets
    if (tickets) {
      for (const ticket of tickets.slice(0, 5)) {
        results.push({
          type: 'ticket',
          id: ticket._id,
          displayId: ticket.ticketId,
          label: ticket.title,
          icon: '📋',
        });
      }
    }

    // Add recent projects
    if (projects) {
      for (const project of projects.slice(0, 3)) {
        results.push({
          type: 'project',
          id: project._id,
          displayId: project.slug,
          label: project.name,
          icon: '📁',
        });
      }
    }

    return results;
  }, [tickets, projects]);

  // Search action
  const search = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  // Parse a mention string like "@ticket:ARC-042"
  const parseMention = useCallback((text: string): { type: MentionType; id: string } | null => {
    const match = text.match(/^@(project|ticket|prd|epic|canvas|memory):(.+)$/);
    if (match) {
      return {
        type: match[1] as MentionType,
        id: match[2],
      };
    }
    return null;
  }, []);

  // Format a mention for display
  const formatMention = useCallback((type: MentionType, id: string): string => {
    return `@${type}:${id}`;
  }, []);

  return {
    query,
    setQuery,
    isSearching,
    suggestions,
    recentMentions,
    search,
    clearSearch,
    parseMention,
    formatMention,
  };
}
