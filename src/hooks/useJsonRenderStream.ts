/**
 * useJsonRenderStream - Streaming UI Generation for 8gent
 *
 * Enables real-time progressive rendering of AI-generated UI components.
 * The "Generative Dimension" - 8gent conjures custom UI in chat flow.
 *
 * Provides progressive rendering as the AI model streams JSON structure.
 *
 * @version 0.1.0
 * @since 2026-02-04
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import type { UITree } from '@/lib/8gent/json-render-provider';

// =============================================================================
// Types
// =============================================================================

export interface StreamingUIState {
  /** Current UI tree being rendered (partial or complete) */
  tree: UITree | null;
  /** Whether streaming is in progress */
  isStreaming: boolean;
  /** Whether the tree is complete */
  isComplete: boolean;
  /** Any error that occurred */
  error: string | null;
  /** Progress indicator (0-1) */
  progress: number;
  /** Element count for progress tracking */
  elementCount: number;
}

export interface UseJsonRenderStreamOptions {
  /** Callback when streaming starts */
  onStart?: () => void;
  /** Callback when new element is added */
  onElement?: (elementKey: string, element: UITreeElement) => void;
  /** Callback when streaming completes */
  onComplete?: (tree: UITree) => void;
  /** Callback on error */
  onError?: (error: string) => void;
  /** Enable debug logging */
  debug?: boolean;
}

interface UITreeElement {
  type: string;
  props: Record<string, unknown>;
  children?: string[];
  key: string;
}

// =============================================================================
// Hook Implementation
// =============================================================================

export function useJsonRenderStream(options: UseJsonRenderStreamOptions = {}) {
  const { onStart, onElement, onComplete, onError, debug = false } = options;

  const [state, setState] = useState<StreamingUIState>({
    tree: null,
    isStreaming: false,
    isComplete: false,
    error: null,
    progress: 0,
    elementCount: 0,
  });

  // Use ref to track accumulated JSON chunks
  const jsonBuffer = useRef<string>('');
  const elementsRef = useRef<Map<string, UITreeElement>>(new Map());
  const rootRef = useRef<string | null>(null);

  // Log helper
  const log = useCallback(
    (message: string, data?: unknown) => {
      if (debug) {
        console.log(`[JsonRenderStream] ${message}`, data ?? '');
      }
    },
    [debug]
  );

  /**
   * Process a chunk of JSON from the AI stream.
   * Handles partial JSON and progressively builds the UI tree.
   */
  const processChunk = useCallback(
    (chunk: string) => {
      jsonBuffer.current += chunk;
      log('Processing chunk', { length: chunk.length });

      try {
        // Try to parse complete objects from the buffer
        const parsed = tryParsePartialJson(jsonBuffer.current);

        if (parsed) {
          // Extract root and elements
          if (parsed.root && !rootRef.current) {
            rootRef.current = parsed.root as string;
            log('Root element found', parsed.root);
          }

          // Process any new elements
          if (parsed.elements && typeof parsed.elements === 'object') {
            for (const [key, element] of Object.entries(parsed.elements)) {
              if (!elementsRef.current.has(key)) {
                elementsRef.current.set(key, element as UITreeElement);
                log('New element added', { key, type: (element as UITreeElement).type });
                onElement?.(key, element as UITreeElement);
              }
            }
          }

          // Build current tree state
          if (rootRef.current) {
            const currentTree: UITree = {
              root: rootRef.current,
              elements: Object.fromEntries(elementsRef.current),
            };

            const elementCount = elementsRef.current.size;
            const progress = Math.min(elementCount / 10, 1); // Estimate based on typical tree size

            setState((prev) => ({
              ...prev,
              tree: currentTree,
              elementCount,
              progress,
            }));
          }
        }
      } catch {
        // Incomplete JSON is expected during streaming, continue accumulating
        log('Partial JSON, continuing...');
      }
    },
    [log, onElement]
  );

  /**
   * Start streaming UI generation from raw JSON string (for manual integration).
   */
  const startFromJson = useCallback(
    (initialJson?: string) => {
      // Reset state
      jsonBuffer.current = initialJson || '';
      elementsRef.current.clear();
      rootRef.current = null;

      setState({
        tree: null,
        isStreaming: true,
        isComplete: false,
        error: null,
        progress: 0,
        elementCount: 0,
      });

      onStart?.();
      log('Streaming started');

      // If we have initial JSON, process it
      if (initialJson) {
        processChunk('');
      }
    },
    [log, onStart, processChunk]
  );

  /**
   * Feed a chunk of streamed JSON data.
   */
  const feedChunk = useCallback(
    (chunk: string) => {
      if (!state.isStreaming) {
        startFromJson(chunk);
      } else {
        processChunk(chunk);
      }
    },
    [state.isStreaming, startFromJson, processChunk]
  );

  /**
   * Complete the streaming and finalize the tree.
   */
  const complete = useCallback(() => {
    const finalTree = state.tree;

    setState((prev) => ({
      ...prev,
      isStreaming: false,
      isComplete: true,
      progress: 1,
    }));

    log('Streaming complete', { elementCount: elementsRef.current.size });

    if (finalTree) {
      onComplete?.(finalTree);
    }
  }, [state.tree, log, onComplete]);

  /**
   * Reset all state.
   */
  const reset = useCallback(() => {
    jsonBuffer.current = '';
    elementsRef.current.clear();
    rootRef.current = null;

    setState({
      tree: null,
      isStreaming: false,
      isComplete: false,
      error: null,
      progress: 0,
      elementCount: 0,
    });

    log('State reset');
  }, [log]);

  /**
   * Set an error state.
   */
  const setError = useCallback(
    (error: string) => {
      setState((prev) => ({
        ...prev,
        error,
        isStreaming: false,
      }));
      onError?.(error);
    },
    [onError]
  );

  /**
   * Set tree directly (for non-streaming use).
   */
  const setTree = useCallback(
    (tree: UITree | null) => {
      setState((prev) => ({
        ...prev,
        tree,
        isComplete: tree !== null,
        progress: tree ? 1 : 0,
        elementCount: tree ? Object.keys(tree.elements || {}).length : 0,
      }));
    },
    []
  );

  return {
    // State
    ...state,

    // Actions
    startFromJson,
    feedChunk,
    complete,
    reset,
    setError,
    setTree,
  };
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Try to parse partial JSON, extracting what we can.
 * Handles incomplete objects by attempting to close them.
 */
function tryParsePartialJson(json: string): Record<string, unknown> | null {
  // First try direct parse
  try {
    return JSON.parse(json);
  } catch {
    // Continue with partial parsing
  }

  // Try to complete incomplete JSON by balancing braces
  let balanced = json;
  const openBraces = (json.match(/{/g) || []).length;
  const closeBraces = (json.match(/}/g) || []).length;
  const openBrackets = (json.match(/\[/g) || []).length;
  const closeBrackets = (json.match(/]/g) || []).length;

  // Add missing closing braces/brackets
  balanced += ']'.repeat(Math.max(0, openBrackets - closeBrackets));
  balanced += '}'.repeat(Math.max(0, openBraces - closeBraces));

  // Remove trailing commas before closing braces
  balanced = balanced.replace(/,\s*([\]}])/g, '$1');

  try {
    return JSON.parse(balanced);
  } catch {
    return null;
  }
}

// =============================================================================
// Types Export
// =============================================================================

export type { UITree, UITreeElement };
