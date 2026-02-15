'use client';

/**
 * CanvasContext - Provides global access to canvas state and AI control
 *
 * Allows Claw AI to control the canvas from:
 * - Voice input on the canvas page
 * - Chat popup from the dock
 * - Main chat page
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  CanvasToolExecutor,
  generateCanvasContext,
  type CanvasState,
  type CanvasToolResult,
} from '@/lib/claw-ai/canvas-tools';
import { describeCanvas } from '@/lib/canvas/grid-system';

// ============================================================================
// Types
// ============================================================================

interface CanvasContextValue {
  // Canvas state
  canvasState: CanvasState | null;
  isCanvasActive: boolean;
  activeCanvasId: string | null;

  // State management
  setCanvasState: (state: CanvasState) => void;
  registerCanvas: (canvasId: string, initialState: CanvasState) => void;
  unregisterCanvas: () => void;

  // AI tool execution
  executeCanvasTool: (toolName: string, params: Record<string, unknown>) => Promise<CanvasToolResult>;
  getCanvasContext: () => string;
  describeCurrentCanvas: () => string;

  // Mindmap helpers
  addMindmapBranch: (parentId: string, content: string, direction: string) => Promise<CanvasToolResult>;
  expandMindmap: (centerContent: string, branches: string[]) => Promise<CanvasToolResult[]>;
}

const CanvasContext = createContext<CanvasContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const [canvasState, setCanvasStateInternal] = useState<CanvasState | null>(null);
  const [activeCanvasId, setActiveCanvasId] = useState<string | null>(null);

  // Ref for the executor so it has access to latest state
  const executorRef = useRef<CanvasToolExecutor | null>(null);

  // Update executor when state changes
  const setCanvasState = useCallback((state: CanvasState) => {
    setCanvasStateInternal(state);

    // Update executor's state getter
    if (executorRef.current) {
      executorRef.current = new CanvasToolExecutor({
        getCanvasState: () => state,
        setCanvasState: (newState) => setCanvasStateInternal(newState),
      });
    }
  }, []);

  // Register a canvas (when canvas page mounts)
  const registerCanvas = useCallback((canvasId: string, initialState: CanvasState) => {
    setActiveCanvasId(canvasId);
    setCanvasStateInternal(initialState);

    executorRef.current = new CanvasToolExecutor({
      getCanvasState: () => initialState,
      setCanvasState: (newState) => setCanvasStateInternal(newState),
    });
  }, []);

  // Unregister canvas (when canvas page unmounts)
  const unregisterCanvas = useCallback(() => {
    setActiveCanvasId(null);
    setCanvasStateInternal(null);
    executorRef.current = null;
  }, []);

  // Execute a canvas tool
  const executeCanvasTool = useCallback(
    async (toolName: string, params: Record<string, unknown>): Promise<CanvasToolResult> => {
      if (!executorRef.current || !canvasState) {
        return {
          success: false,
          message: 'No canvas is currently active. Please open a canvas first.',
        };
      }

      // Update executor with latest state before execution
      executorRef.current = new CanvasToolExecutor({
        getCanvasState: () => canvasState,
        setCanvasState: (newState) => setCanvasStateInternal(newState),
      });

      return executorRef.current.execute(toolName, params);
    },
    [canvasState]
  );

  // Get canvas context for AI system prompt
  const getCanvasContext = useCallback((): string => {
    if (!canvasState) {
      return 'No canvas is currently active.';
    }
    return generateCanvasContext(canvasState);
  }, [canvasState]);

  // Describe current canvas state
  const describeCurrentCanvas = useCallback((): string => {
    if (!canvasState) {
      return 'No canvas is currently active.';
    }
    const description = describeCanvas(canvasState.nodes, canvasState.edges);
    return description.spatialLayout;
  }, [canvasState]);

  // Helper: Add a mindmap branch
  const addMindmapBranch = useCallback(
    async (parentId: string, content: string, direction: string): Promise<CanvasToolResult> => {
      return executeCanvasTool('create_mindmap_branch', {
        parentNodeId: parentId,
        content,
        direction,
      });
    },
    [executeCanvasTool]
  );

  // Helper: Expand mindmap with multiple branches
  const expandMindmap = useCallback(
    async (centerContent: string, branches: string[]): Promise<CanvasToolResult[]> => {
      if (!canvasState) {
        return [{ success: false, message: 'No canvas active' }];
      }

      const results: CanvasToolResult[] = [];

      // Create center node if not exists
      let centerNodeId: string;
      const existingCenter = canvasState.nodes.find((n) =>
        n.content.toLowerCase().includes(centerContent.toLowerCase())
      );

      if (existingCenter) {
        centerNodeId = existingCenter.id;
      } else {
        const createResult = await executeCanvasTool('create_node', {
          type: 'mindmap',
          position: 'E5', // Center of visible area
          content: centerContent,
          color: 'purple',
        });
        results.push(createResult);
        if (!createResult.success) return results;
        centerNodeId = (createResult.data as { nodeId: string }).nodeId;
      }

      // Add branches in different directions
      const directions = ['right', 'below-right', 'below', 'below-left', 'left', 'above-left', 'above', 'above-right'];
      for (let i = 0; i < branches.length; i++) {
        const direction = directions[i % directions.length];
        const result = await addMindmapBranch(centerNodeId, branches[i], direction);
        results.push(result);
      }

      return results;
    },
    [canvasState, executeCanvasTool, addMindmapBranch]
  );

  const value: CanvasContextValue = {
    canvasState,
    isCanvasActive: canvasState !== null,
    activeCanvasId,
    setCanvasState,
    registerCanvas,
    unregisterCanvas,
    executeCanvasTool,
    getCanvasContext,
    describeCurrentCanvas,
    addMindmapBranch,
    expandMindmap,
  };

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useCanvasContext() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvasContext must be used within a CanvasProvider');
  }
  return context;
}

// Optional hook that returns null if not in provider (for components that may be outside)
export function useCanvasContextOptional() {
  return useContext(CanvasContext);
}
