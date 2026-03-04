"use client";

/**
 * ERV Dimension Context
 *
 * Manages dimension state, entity filtering, and dimension switching.
 * This is the control center for infinite dimensional rendering.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type {
  DimensionConfig,
  DimensionState,
  DimensionActions,
  DimensionFilter,
  DimensionSort,
  Entity,
  Relationship,
  GraphData,
  GraphNode,
  GraphEdge,
  MetaphorMapping,
  METAPHOR_VOCABULARY,
} from "./types";
import { PRESET_DIMENSIONS, getPresetDimension } from "./presets";

// =============================================================================
// Context Types
// =============================================================================

interface DimensionContextValue extends DimensionState, DimensionActions {}

const DimensionContext = createContext<DimensionContextValue | null>(null);

// =============================================================================
// Default State
// =============================================================================

const DEFAULT_DIMENSION_ID = "feed";

const getDefaultState = (): DimensionState => ({
  activeDimensionId: DEFAULT_DIMENSION_ID,
  activeConfig: PRESET_DIMENSIONS[DEFAULT_DIMENSION_ID],
  entities: [],
  relationships: [],
  graphData: undefined,
  loading: false,
  error: undefined,
});

// =============================================================================
// Provider
// =============================================================================

interface DimensionProviderProps {
  children: ReactNode;
  initialDimensionId?: string;
  initialEntities?: Entity[];
  initialRelationships?: Relationship[];
}

export function DimensionProvider({
  children,
  initialDimensionId = DEFAULT_DIMENSION_ID,
  initialEntities = [],
  initialRelationships = [],
}: DimensionProviderProps) {
  const [state, setState] = useState<DimensionState>(() => ({
    activeDimensionId: initialDimensionId,
    activeConfig: getPresetDimension(initialDimensionId) || PRESET_DIMENSIONS[DEFAULT_DIMENSION_ID],
    entities: initialEntities,
    relationships: initialRelationships,
    graphData: undefined,
    loading: false,
    error: undefined,
  }));

  // Switch to a different dimension
  const switchDimension = useCallback((dimensionId: string) => {
    const config = getPresetDimension(dimensionId);
    if (!config) {
      console.warn(`Dimension not found: ${dimensionId}`);
      return;
    }

    setState((prev) => ({
      ...prev,
      activeDimensionId: dimensionId,
      activeConfig: config,
      loading: true,
    }));

    // Simulate loading (in real app, this would fetch filtered entities)
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }, 100);
  }, []);

  // Update filter on active dimension
  const setFilter = useCallback((filter: DimensionFilter) => {
    setState((prev) => ({
      ...prev,
      activeConfig: {
        ...prev.activeConfig,
        filter,
      },
    }));
  }, []);

  // Update sort on active dimension
  const setSort = useCallback((sort: DimensionSort) => {
    setState((prev) => ({
      ...prev,
      activeConfig: {
        ...prev.activeConfig,
        sort,
      },
    }));
  }, []);

  // Generate a new dimension from natural language metaphor
  const generateDimension = useCallback(async (metaphor: string): Promise<DimensionConfig> => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      // Find matching metaphor vocabulary
      const normalizedMetaphor = metaphor.toLowerCase();
      let mapping: MetaphorMapping | null = null;

      // Import vocabulary dynamically to avoid circular deps
      const { METAPHOR_VOCABULARY } = await import("./types");

      for (const [key, value] of Object.entries(METAPHOR_VOCABULARY)) {
        if (
          key === normalizedMetaphor ||
          value.keywords.some((kw) => normalizedMetaphor.includes(kw))
        ) {
          mapping = value;
          break;
        }
      }

      // Generate config from mapping or use defaults
      const generatedConfig: DimensionConfig = {
        id: `generated-${Date.now()}`,
        name: `${metaphor.charAt(0).toUpperCase() + metaphor.slice(1)} View`,
        metaphor: normalizedMetaphor,
        container: "card",
        arrangement: mapping?.arrangement || "grid",
        entityShape: mapping?.entityShape || "square",
        connectionStyle: mapping?.connectionStyle || "none",
        decorations: mapping?.decorations?.map((type) => ({ type })) || [],
        interactions: [
          { type: "click", action: "navigate" },
          { type: "hover", action: "preview" },
        ],
        transition: "fade",
        ...mapping?.specialConfig,
      };

      setState((prev) => ({
        ...prev,
        activeDimensionId: generatedConfig.id,
        activeConfig: generatedConfig,
        loading: false,
      }));

      return generatedConfig;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to generate dimension",
      }));
      throw error;
    }
  }, []);

  // Modify the active dimension config
  const modifyActiveDimension = useCallback((updates: Partial<DimensionConfig>) => {
    setState((prev) => ({
      ...prev,
      activeConfig: {
        ...prev.activeConfig,
        ...updates,
      },
    }));
  }, []);

  // Select an entity (for detail view, etc.)
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const selectEntity = useCallback((entityId: string) => {
    setSelectedEntityId(entityId);
  }, []);

  // Compute graph data when needed
  const graphData = useMemo((): GraphData | undefined => {
    if (state.activeConfig.arrangement !== "graph") {
      return undefined;
    }

    const nodes: GraphNode[] = state.entities.map((entity) => ({
      id: entity.entityId,
      entity,
      size: 30,
      color: getEntityColor(entity.entityType),
    }));

    const edges: GraphEdge[] = state.relationships.map((rel) => ({
      id: `${rel.sourceEntityId}-${rel.targetEntityId}`,
      source: rel.sourceEntityId,
      target: rel.targetEntityId,
      relationship: rel,
    }));

    return { nodes, edges };
  }, [state.entities, state.relationships, state.activeConfig.arrangement]);

  // Filter and sort entities based on active config
  const filteredEntities = useMemo(() => {
    let result = [...state.entities];

    // Apply type filter
    if (state.activeConfig.filter?.entityTypes?.length) {
      result = result.filter((e) =>
        state.activeConfig.filter!.entityTypes!.includes(e.entityType)
      );
    }

    // Apply tag filter
    if (state.activeConfig.filter?.tags?.length) {
      result = result.filter((e) =>
        e.tags.some((tag) => state.activeConfig.filter!.tags!.includes(tag))
      );
    }

    // Apply search filter
    if (state.activeConfig.filter?.search) {
      const searchLower = state.activeConfig.filter.search.toLowerCase();
      result = result.filter((e) =>
        e.searchText.toLowerCase().includes(searchLower)
      );
    }

    // Apply date filter
    if (state.activeConfig.filter?.dateRange) {
      const { start, end } = state.activeConfig.filter.dateRange;
      result = result.filter((e) => {
        if (start && e.createdAt < start) return false;
        if (end && e.createdAt > end) return false;
        return true;
      });
    }

    // Apply sort
    if (state.activeConfig.sort) {
      const { field, direction } = state.activeConfig.sort;
      result.sort((a, b) => {
        const aVal = getFieldValue(a, field);
        const bVal = getFieldValue(b, field);
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return direction === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [state.entities, state.activeConfig.filter, state.activeConfig.sort]);

  const contextValue: DimensionContextValue = {
    ...state,
    entities: filteredEntities,
    graphData,
    switchDimension,
    setFilter,
    setSort,
    generateDimension,
    modifyActiveDimension,
    selectEntity,
  };

  return (
    <DimensionContext.Provider value={contextValue}>
      {children}
    </DimensionContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useDimension(): DimensionContextValue {
  const context = useContext(DimensionContext);
  if (!context) {
    throw new Error("useDimension must be used within a DimensionProvider");
  }
  return context;
}

// =============================================================================
// Helper Functions
// =============================================================================

function getEntityColor(entityType: string): string {
  const colors: Record<string, string> = {
    Person: "#f59e0b",
    Project: "#22c55e",
    Track: "#3b82f6",
    Ticket: "#8b5cf6",
    Memory: "#ec4899",
    Event: "#06b6d4",
    Draft: "#f97316",
    Sketch: "#a855f7",
    Epic: "#14b8a6",
    Value: "#fbbf24",
    Collection: "#64748b",
    Skill: "#10b981",
    Reminder: "#f43f5e",
    Dimension: "#6366f1",
  };
  return colors[entityType] || "#71717a";
}

function getFieldValue(entity: Entity, field: string): number | string {
  switch (field) {
    case "createdAt":
      return entity.createdAt;
    case "updatedAt":
      return entity.updatedAt;
    case "name":
      return entity.name.toLowerCase();
    case "importance":
      return entity.importance || 0;
    default:
      return entity.name.toLowerCase();
  }
}

// =============================================================================
// Keyboard Shortcuts Hook
// =============================================================================

export function useDimensionKeyboardShortcuts() {
  const { switchDimension } = useDimension();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + 1-9 for dimension switching
      if ((e.metaKey || e.ctrlKey) && e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        const presetIds = Object.keys(PRESET_DIMENSIONS);
        const index = parseInt(e.key) - 1;
        if (index < presetIds.length) {
          switchDimension(presetIds[index]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [switchDimension]);
}
