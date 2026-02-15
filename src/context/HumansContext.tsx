'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useReducer,
  ReactNode,
} from 'react';
import type {
  SearchQuery,
  SearchResult,
  ShortlistItem,
  ShortlistTag,
  RalphModeState,
  RalphIteration,
  SavedSearch,
  SearchIntent,
} from '@/lib/humans/types';
import {
  getSearchProvider,
  buildSearchQuery,
  processSearchResults,
} from '@/lib/humans/search-provider';
import { checkQuerySafety, sanitizeSearchResults, GuardrailResult } from '@/lib/humans/guardrails';

// ============================================================================
// Types
// ============================================================================

interface HumansState {
  // Search state
  currentQuery: SearchQuery | null;
  searchResults: SearchResult[];
  isSearching: boolean;
  searchError: string | null;
  guardrailResult: GuardrailResult | null;

  // Shortlist state
  shortlist: ShortlistItem[];

  // Ralph Mode state
  ralphMode: RalphModeState;

  // History
  searchHistory: SavedSearch[];

  // UI state
  selectedResultId: string | null;
  activePanel: 'search' | 'results' | 'shortlist' | 'detail';
}

type HumansAction =
  | { type: 'SET_QUERY'; payload: SearchQuery }
  | { type: 'START_SEARCH' }
  | { type: 'SEARCH_SUCCESS'; payload: SearchResult[] }
  | { type: 'SEARCH_ERROR'; payload: string }
  | { type: 'SET_GUARDRAIL_RESULT'; payload: GuardrailResult | null }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'ADD_TO_SHORTLIST'; payload: ShortlistItem }
  | { type: 'REMOVE_FROM_SHORTLIST'; payload: string }
  | { type: 'UPDATE_SHORTLIST_ITEM'; payload: { id: string; updates: Partial<ShortlistItem> } }
  | { type: 'CLEAR_SHORTLIST' }
  | { type: 'SET_SHORTLIST'; payload: ShortlistItem[] }
  | { type: 'START_RALPH_MODE' }
  | { type: 'RALPH_ITERATION'; payload: RalphIteration }
  | { type: 'STOP_RALPH_MODE'; payload: RalphModeState['stopReason'] }
  | { type: 'SELECT_RESULT'; payload: string | null }
  | { type: 'SET_ACTIVE_PANEL'; payload: HumansState['activePanel'] }
  | { type: 'ADD_SEARCH_HISTORY'; payload: SavedSearch }
  | { type: 'SET_SEARCH_HISTORY'; payload: SavedSearch[] }
  | { type: 'LOAD_STATE'; payload: Partial<HumansState> };

// ============================================================================
// Initial State
// ============================================================================

const initialRalphMode: RalphModeState = {
  active: false,
  currentIteration: 0,
  maxIterations: 4,
  targetStrongMatches: 5,
  iterations: [],
};

const initialState: HumansState = {
  currentQuery: null,
  searchResults: [],
  isSearching: false,
  searchError: null,
  guardrailResult: null,
  shortlist: [],
  ralphMode: initialRalphMode,
  searchHistory: [],
  selectedResultId: null,
  activePanel: 'search',
};

// ============================================================================
// Reducer
// ============================================================================

function humansReducer(state: HumansState, action: HumansAction): HumansState {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, currentQuery: action.payload };

    case 'START_SEARCH':
      return {
        ...state,
        isSearching: true,
        searchError: null,
        guardrailResult: null,
      };

    case 'SEARCH_SUCCESS':
      return {
        ...state,
        searchResults: action.payload,
        isSearching: false,
        activePanel: 'results',
      };

    case 'SEARCH_ERROR':
      return {
        ...state,
        searchError: action.payload,
        isSearching: false,
      };

    case 'SET_GUARDRAIL_RESULT':
      return { ...state, guardrailResult: action.payload };

    case 'CLEAR_SEARCH':
      return {
        ...state,
        currentQuery: null,
        searchResults: [],
        searchError: null,
        guardrailResult: null,
        activePanel: 'search',
      };

    case 'ADD_TO_SHORTLIST':
      return {
        ...state,
        shortlist: [...state.shortlist, action.payload],
      };

    case 'REMOVE_FROM_SHORTLIST':
      return {
        ...state,
        shortlist: state.shortlist.filter(item => item.id !== action.payload),
      };

    case 'UPDATE_SHORTLIST_ITEM':
      return {
        ...state,
        shortlist: state.shortlist.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        ),
      };

    case 'CLEAR_SHORTLIST':
      return { ...state, shortlist: [] };

    case 'SET_SHORTLIST':
      return { ...state, shortlist: action.payload };

    case 'START_RALPH_MODE':
      return {
        ...state,
        ralphMode: {
          ...initialRalphMode,
          active: true,
          currentIteration: 1,
        },
      };

    case 'RALPH_ITERATION':
      return {
        ...state,
        ralphMode: {
          ...state.ralphMode,
          currentIteration: action.payload.iteration,
          iterations: [...state.ralphMode.iterations, action.payload],
        },
      };

    case 'STOP_RALPH_MODE':
      return {
        ...state,
        ralphMode: {
          ...state.ralphMode,
          active: false,
          stopReason: action.payload,
        },
      };

    case 'SELECT_RESULT':
      return {
        ...state,
        selectedResultId: action.payload,
        activePanel: action.payload ? 'detail' : state.activePanel,
      };

    case 'SET_ACTIVE_PANEL':
      return { ...state, activePanel: action.payload };

    case 'ADD_SEARCH_HISTORY':
      return {
        ...state,
        searchHistory: [action.payload, ...state.searchHistory].slice(0, 50),
      };

    case 'SET_SEARCH_HISTORY':
      return { ...state, searchHistory: action.payload };

    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

interface HumansContextValue {
  state: HumansState;

  // Search actions
  search: (query: SearchQuery) => Promise<void>;
  clearSearch: () => void;

  // Shortlist actions
  addToShortlist: (result: SearchResult, tags?: ShortlistTag[]) => void;
  removeFromShortlist: (id: string) => void;
  updateShortlistItem: (id: string, updates: Partial<ShortlistItem>) => void;
  clearShortlist: () => void;
  isInShortlist: (personId: string) => boolean;

  // Ralph Mode actions
  startRalphMode: () => Promise<void>;
  stopRalphMode: () => void;

  // UI actions
  selectResult: (id: string | null) => void;
  setActivePanel: (panel: HumansState['activePanel']) => void;
  getSelectedResult: () => SearchResult | null;

  // Export actions
  exportShortlistMarkdown: () => string;
  copyShortlistToClipboard: () => Promise<void>;
}

const HumansContext = createContext<HumansContextValue | null>(null);

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEY_SHORTLIST = 'humans_shortlist';
const STORAGE_KEY_HISTORY = 'humans_search_history';

// ============================================================================
// Provider
// ============================================================================

interface HumansProviderProps {
  children: ReactNode;
}

export function HumansProvider({ children }: HumansProviderProps) {
  const [state, dispatch] = useReducer(humansReducer, initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedShortlist = localStorage.getItem(STORAGE_KEY_SHORTLIST);
      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);

      if (savedShortlist) {
        dispatch({ type: 'SET_SHORTLIST', payload: JSON.parse(savedShortlist) });
      }
      if (savedHistory) {
        dispatch({ type: 'SET_SEARCH_HISTORY', payload: JSON.parse(savedHistory) });
      }
    } catch (e) {
      console.error('Failed to load Humans state from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save shortlist to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_SHORTLIST, JSON.stringify(state.shortlist));
    } catch (e) {
      console.error('Failed to save shortlist:', e);
    }
  }, [state.shortlist, isLoaded]);

  // Save history to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(state.searchHistory));
    } catch (e) {
      console.error('Failed to save search history:', e);
    }
  }, [state.searchHistory, isLoaded]);

  // Search action
  const search = useCallback(async (query: SearchQuery) => {
    // Build the search string
    const searchString = buildSearchQuery(query);

    // Check guardrails first
    const guardrailResult = checkQuerySafety(searchString);
    dispatch({ type: 'SET_GUARDRAIL_RESULT', payload: guardrailResult });

    if (!guardrailResult.safe) {
      return;
    }

    dispatch({ type: 'SET_QUERY', payload: query });
    dispatch({ type: 'START_SEARCH' });

    try {
      const provider = getSearchProvider();
      const rawResults = await provider.search(searchString, {
        category: 'people',
        includeText: true,
        numResults: 10,
      });

      const processedResults = processSearchResults(rawResults, query);
      const sanitizedResults = sanitizeSearchResults(processedResults);

      dispatch({ type: 'SEARCH_SUCCESS', payload: sanitizedResults });

      // Add to history
      const savedSearch: SavedSearch = {
        id: `search_${Date.now()}`,
        query,
        resultsCount: sanitizedResults.length,
        createdAt: Date.now(),
        shortlistCount: 0,
      };
      dispatch({ type: 'ADD_SEARCH_HISTORY', payload: savedSearch });
    } catch (error) {
      dispatch({
        type: 'SEARCH_ERROR',
        payload: error instanceof Error ? error.message : 'Search failed',
      });
    }
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH' });
  }, []);

  // Shortlist actions
  const addToShortlist = useCallback(
    (result: SearchResult, tags: ShortlistTag[] = []) => {
      // Build links array from social links and source
      const links: string[] = [result.sourceUrl];
      if (result.socialLinks.linkedin) links.push(result.socialLinks.linkedin);
      if (result.socialLinks.x) links.push(`https://x.com/${result.socialLinks.x}`);
      if (result.socialLinks.github) links.push(result.socialLinks.github);
      if (result.socialLinks.website) links.push(result.socialLinks.website);

      const item: ShortlistItem = {
        id: `shortlist_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        personId: result.id,
        name: result.name,
        title: result.title,
        company: result.company,
        location: result.location,
        links,
        snippet: result.snippet,
        addedAt: Date.now(),
        tags,
        notes: '',
        socialLinks: result.socialLinks, // Include social links for direct access
      };
      dispatch({ type: 'ADD_TO_SHORTLIST', payload: item });
    },
    []
  );

  const removeFromShortlist = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FROM_SHORTLIST', payload: id });
  }, []);

  const updateShortlistItem = useCallback(
    (id: string, updates: Partial<ShortlistItem>) => {
      dispatch({ type: 'UPDATE_SHORTLIST_ITEM', payload: { id, updates } });
    },
    []
  );

  const clearShortlist = useCallback(() => {
    dispatch({ type: 'CLEAR_SHORTLIST' });
  }, []);

  const isInShortlist = useCallback(
    (personId: string) => {
      return state.shortlist.some(item => item.personId === personId);
    },
    [state.shortlist]
  );

  // Ralph Mode actions
  const startRalphMode = useCallback(async () => {
    if (!state.currentQuery) return;

    dispatch({ type: 'START_RALPH_MODE' });

    let currentResults = [...state.searchResults];
    let strongMatches = currentResults.filter(r => r.confidence === 'high').length;

    for (let i = 1; i <= state.ralphMode.maxIterations; i++) {
      // Check stop conditions
      if (strongMatches >= state.ralphMode.targetStrongMatches) {
        dispatch({ type: 'STOP_RALPH_MODE', payload: 'strong_matches_found' });
        break;
      }

      // Determine refinement action
      const action = determineRalphAction(i, state.currentQuery, currentResults);

      const iteration: RalphIteration = {
        iteration: i,
        action: action.type,
        description: action.description,
        queryModification: action.modification,
        resultsCount: currentResults.length,
        strongMatches,
      };

      dispatch({ type: 'RALPH_ITERATION', payload: iteration });

      // Apply refinement
      try {
        const modifiedQuery = {
          ...state.currentQuery,
          ...action.modification,
        };

        const searchString = buildSearchQuery(modifiedQuery);
        const provider = getSearchProvider();
        const rawResults = await provider.search(searchString, {
          category: 'people',
          includeText: true,
          numResults: 15,
        });

        const processedResults = processSearchResults(rawResults, modifiedQuery);
        const sanitizedResults = sanitizeSearchResults(processedResults);

        // Merge and dedupe results
        const allResults = mergeResults(currentResults, sanitizedResults);
        currentResults = allResults;
        strongMatches = allResults.filter(r => r.confidence === 'high').length;

        dispatch({ type: 'SEARCH_SUCCESS', payload: allResults });

        // Small delay between iterations
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Ralph iteration failed:', error);
      }

      if (i === state.ralphMode.maxIterations) {
        dispatch({ type: 'STOP_RALPH_MODE', payload: 'max_iterations' });
      }
    }
  }, [state.currentQuery, state.searchResults, state.ralphMode.maxIterations, state.ralphMode.targetStrongMatches]);

  const stopRalphMode = useCallback(() => {
    dispatch({ type: 'STOP_RALPH_MODE', payload: 'user_cancelled' });
  }, []);

  // UI actions
  const selectResult = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_RESULT', payload: id });
  }, []);

  const setActivePanel = useCallback((panel: HumansState['activePanel']) => {
    dispatch({ type: 'SET_ACTIVE_PANEL', payload: panel });
  }, []);

  const getSelectedResult = useCallback(() => {
    if (!state.selectedResultId) return null;
    return state.searchResults.find(r => r.id === state.selectedResultId) || null;
  }, [state.selectedResultId, state.searchResults]);

  // Export actions
  const exportShortlistMarkdown = useCallback(() => {
    const lines: string[] = [
      '# Humans Shortlist',
      '',
      `Exported: ${new Date().toLocaleDateString()}`,
      '',
      '---',
      '',
    ];

    state.shortlist.forEach((item, index) => {
      lines.push(`## ${index + 1}. ${item.name}`);
      if (item.title) lines.push(`**Title:** ${item.title}`);
      if (item.company) lines.push(`**Company:** ${item.company}`);
      if (item.location) lines.push(`**Location:** ${item.location}`);
      lines.push('');
      if (item.snippet) {
        lines.push(`> ${item.snippet}`);
        lines.push('');
      }
      if (item.links.length > 0) {
        lines.push('**Links:**');
        item.links.forEach(link => lines.push(`- ${link}`));
        lines.push('');
      }
      if (item.tags.length > 0) {
        lines.push(`**Tags:** ${item.tags.join(', ')}`);
        lines.push('');
      }
      if (item.notes) {
        lines.push(`**Notes:** ${item.notes}`);
        lines.push('');
      }
      lines.push('---');
      lines.push('');
    });

    return lines.join('\n');
  }, [state.shortlist]);

  const copyShortlistToClipboard = useCallback(async () => {
    const markdown = exportShortlistMarkdown();
    await navigator.clipboard.writeText(markdown);
  }, [exportShortlistMarkdown]);

  const value: HumansContextValue = {
    state,
    search,
    clearSearch,
    addToShortlist,
    removeFromShortlist,
    updateShortlistItem,
    clearShortlist,
    isInShortlist,
    startRalphMode,
    stopRalphMode,
    selectResult,
    setActivePanel,
    getSelectedResult,
    exportShortlistMarkdown,
    copyShortlistToClipboard,
  };

  return (
    <HumansContext.Provider value={value}>{children}</HumansContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useHumans() {
  const context = useContext(HumansContext);
  if (!context) {
    throw new Error('useHumans must be used within a HumansProvider');
  }
  return context;
}

// ============================================================================
// Helper Functions
// ============================================================================

function determineRalphAction(
  iteration: number,
  query: SearchQuery,
  results: SearchResult[]
): {
  type: RalphIteration['action'];
  description: string;
  modification?: Partial<SearchQuery>;
} {
  // Simple strategy based on iteration number
  switch (iteration) {
    case 1:
      // First iteration: Add synonyms to role
      return {
        type: 'expand_synonyms',
        description: 'Expanding role synonyms for broader match',
        modification: {
          keywords: query.keywords
            ? `${query.keywords} OR similar`
            : undefined,
        },
      };

    case 2:
      // Second iteration: Tighten location if available
      if (query.location) {
        return {
          type: 'add_filters',
          description: 'Tightening location constraints',
        };
      }
      return {
        type: 'rewrite_query',
        description: 'Rephrasing search for better matches',
      };

    case 3:
      // Third iteration: Focus on seniority
      return {
        type: 'add_filters',
        description: 'Refining seniority criteria',
      };

    default:
      // Later iterations: Fetch more and rerank
      return {
        type: 'fetch_more',
        description: 'Fetching additional candidates',
      };
  }
}

function mergeResults(
  existing: SearchResult[],
  newResults: SearchResult[]
): SearchResult[] {
  const existingIds = new Set(existing.map(r => r.sourceUrl));
  const uniqueNew = newResults.filter(r => !existingIds.has(r.sourceUrl));

  // Combine and sort by confidence
  const all = [...existing, ...uniqueNew];
  const confidenceOrder = { high: 0, medium: 1, low: 2 };

  return all.sort((a, b) => confidenceOrder[a.confidence] - confidenceOrder[b.confidence]);
}
