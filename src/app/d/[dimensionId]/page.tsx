/**
 * Dynamic Dimension Page
 *
 * Renders a specific dimension with its entities and relationships.
 * Supports both preset and custom dimensions.
 * Uses real Convex data (ERV Phase 4).
 * Features matrix-bending portal transitions.
 */

"use client";

import { useCallback, useEffect, useState, use, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuery } from "@/lib/openclaw/hooks";
import { api } from '@/lib/convex-shim';
import { cn } from "@/lib/utils";
import { DimensionRenderer } from "@/components/erv/DimensionRenderer";
import { DimensionHeader } from "@/components/erv/DimensionHeader";
import { DimensionPortal } from "@/components/erv/DimensionPortal";
import {
  useDimensionNavigation,
  useSwipeNavigation,
} from "@/context/DimensionNavigationContext";
import { PageTransitionWrapper } from "@/components/ios/PageTransitionWrapper";
import type {
  DimensionConfig,
  Entity,
  Relationship,
  PresetDimensionId,
  EntityType,
} from "@/lib/erv/types";

// =============================================================================
// Preset Dimension Configurations
// =============================================================================

const PRESET_CONFIGS: Record<PresetDimensionId, DimensionConfig> = {
  feed: {
    id: "feed",
    name: "Feed",
    description: "Chronological stream of all entities",
    icon: "📰",
    gradient: "from-blue-500 to-cyan-500",
    metaphor: "river",
    container: "frame",
    arrangement: "list",
    entityShape: "square",
    connectionStyle: "none",
    decorations: [{ type: "shadow" }],
    interactions: [
      { type: "click", action: "navigate" },
      { type: "longpress", action: "reveal" },
    ],
    transition: "slide",
    sort: { field: "createdAt", direction: "desc" },
    itemSize: "md",
    gap: 12,
  },
  kanban: {
    id: "kanban",
    name: "Kanban",
    description: "Ticket and task management board",
    icon: "📋",
    gradient: "from-violet-500 to-purple-500",
    metaphor: "board",
    container: "panel",
    arrangement: "grid",
    entityShape: "square",
    connectionStyle: "none",
    decorations: [{ type: "badge" }, { type: "border" }],
    interactions: [
      { type: "drag", action: "custom" },
      { type: "click", action: "edit" },
    ],
    transition: "morph",
    filter: { entityTypes: ["Ticket"] },
    group: { by: "status", showEmpty: true },
    columns: 5,
    gap: 16,
    itemSize: "sm",
  },
  graph: {
    id: "graph",
    name: "Graph",
    description: "Entity relationship visualization",
    icon: "🕸️",
    gradient: "from-emerald-500 to-green-500",
    metaphor: "constellation",
    container: "frame",
    arrangement: "graph",
    entityShape: "circle",
    connectionStyle: "curve",
    decorations: [{ type: "glow", condition: "importance > 0.8" }],
    interactions: [
      { type: "drag", action: "custom" },
      { type: "click", action: "select" },
      { type: "hover", action: "preview" },
    ],
    transition: "morph",
    sizeMapping: { field: "connections", min: 40, max: 100 },
    physicsEnabled: true,
  },
  "graph-3d": {
    id: "graph-3d",
    name: "Graph 3D",
    description: "Immersive 3D relationship space",
    icon: "🌐",
    gradient: "from-pink-500 to-rose-500",
    metaphor: "solar",
    container: "frame",
    arrangement: "orbit",
    entityShape: "circle",
    connectionStyle: "glow",
    decorations: [{ type: "glow" }],
    interactions: [
      { type: "click", action: "navigate" },
      { type: "pinch", action: "custom" },
    ],
    transition: "morph",
    is3D: true,
    cameraPosition: { x: 0, y: 0, z: 10 },
    physicsEnabled: true,
  },
  calendar: {
    id: "calendar",
    name: "Calendar",
    description: "Time-based event visualization",
    icon: "📅",
    gradient: "from-amber-500 to-orange-500",
    metaphor: "timeline",
    container: "panel",
    arrangement: "grid",
    entityShape: "square",
    connectionStyle: "line",
    decorations: [{ type: "badge" }],
    interactions: [
      { type: "click", action: "edit" },
      { type: "drag", action: "custom" },
    ],
    transition: "slide",
    filter: { entityTypes: ["Event"] },
    sort: { field: "createdAt", direction: "asc" },
    columns: 7,
    gap: 8,
    itemSize: "sm",
  },
  grid: {
    id: "grid",
    name: "Grid",
    description: "Gallery-style entity browser",
    icon: "🖼️",
    gradient: "from-cyan-500 to-teal-500",
    metaphor: "mosaic",
    container: "frame",
    arrangement: "grid",
    entityShape: "square",
    connectionStyle: "none",
    decorations: [{ type: "shadow" }, { type: "label" }],
    interactions: [
      { type: "click", action: "navigate" },
      { type: "hover", action: "preview" },
    ],
    transition: "scale",
    columns: 4,
    gap: 16,
    itemSize: "md",
  },
  table: {
    id: "table",
    name: "Table",
    description: "Spreadsheet-like data view",
    icon: "📊",
    gradient: "from-slate-500 to-zinc-500",
    metaphor: "ledger",
    container: "panel",
    arrangement: "list",
    entityShape: "square",
    connectionStyle: "none",
    decorations: [{ type: "border" }],
    interactions: [
      { type: "click", action: "edit" },
      { type: "hover", action: "preview" },
    ],
    transition: "fade",
    sort: { field: "name", direction: "asc" },
    gap: 0,
    itemSize: "sm",
  },
  ipod: {
    id: "ipod",
    name: "iPod",
    description: "Music-centric navigation",
    icon: "🎵",
    gradient: "from-indigo-500 to-blue-500",
    metaphor: "vinyl",
    container: "card",
    arrangement: "flow",
    entityShape: "square",
    connectionStyle: "none",
    decorations: [{ type: "shadow" }],
    interactions: [
      { type: "click", action: "navigate" },
      { type: "longpress", action: "reveal" },
    ],
    transition: "slide",
    filter: { entityTypes: ["Track"] },
    itemSize: "lg",
    gap: 24,
  },
  "quest-log": {
    id: "quest-log",
    name: "Quest Log",
    description: "Gamified task progression",
    icon: "⚔️",
    gradient: "from-red-500 to-orange-500",
    metaphor: "dungeon",
    container: "panel",
    arrangement: "tree",
    entityShape: "hexagon",
    connectionStyle: "arrow",
    decorations: [{ type: "badge" }, { type: "glow", condition: "importance > 0.7" }],
    interactions: [
      { type: "click", action: "navigate" },
      { type: "longpress", action: "reveal" },
    ],
    transition: "morph",
    filter: { entityTypes: ["Ticket", "Epic"] },
  },
  "skill-tree": {
    id: "skill-tree",
    name: "Skill Tree",
    description: "Interconnected skill progression",
    icon: "🌳",
    gradient: "from-emerald-500 to-teal-500",
    metaphor: "tree",
    container: "frame",
    arrangement: "tree",
    entityShape: "circle",
    connectionStyle: "curve",
    decorations: [{ type: "glow" }, { type: "badge" }],
    interactions: [
      { type: "click", action: "navigate" },
      { type: "hover", action: "preview" },
    ],
    transition: "morph",
    filter: { entityTypes: ["Skill"] },
  },
  "agent-tasks": {
    id: "agent-tasks",
    name: "Agent Tasks",
    description: "Monitor background tasks, code iterations, and specialist delegations",
    icon: "🤖",
    gradient: "from-sky-500 to-blue-500",
    metaphor: "console",
    container: "panel",
    arrangement: "list",
    entityShape: "square",
    connectionStyle: "none",
    decorations: [{ type: "badge" }, { type: "border" }],
    interactions: [
      { type: "click", action: "navigate" },
      { type: "hover", action: "preview" },
    ],
    transition: "slide",
    filter: { entityTypes: ["AgentTask"] },
    sort: { field: "createdAt", direction: "desc" },
    itemSize: "md",
    gap: 12,
  },
};

// =============================================================================
// Helper: Convert Convex entity to ERV Entity type
// =============================================================================

interface ConvexEntity {
  _id: string;
  entityId: string;
  entityType: string;
  name: string;
  data: string;
  tags: string[];
  searchText: string;
  thumbnail?: string;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
  importance?: number;
  archivedAt?: number;
}

interface ConvexRelationship {
  _id: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: string;
  bidirectional: boolean;
  weight?: number;
  label?: string;
  createdAt: number;
  createdBy: string;
}

function convertToEntity(convexEntity: ConvexEntity): Entity {
  return {
    _id: convexEntity._id,
    entityId: convexEntity.entityId,
    entityType: convexEntity.entityType as EntityType,
    name: convexEntity.name,
    data: convexEntity.data,
    tags: convexEntity.tags,
    searchText: convexEntity.searchText,
    thumbnail: convexEntity.thumbnail,
    ownerId: convexEntity.ownerId,
    createdAt: convexEntity.createdAt,
    updatedAt: convexEntity.updatedAt,
    importance: convexEntity.importance,
  };
}

function convertToRelationship(convexRel: ConvexRelationship): Relationship {
  return {
    _id: convexRel._id,
    sourceEntityId: convexRel.sourceEntityId,
    targetEntityId: convexRel.targetEntityId,
    relationshipType: convexRel.relationshipType as Relationship["relationshipType"],
    bidirectional: convexRel.bidirectional,
    weight: convexRel.weight,
    createdAt: convexRel.createdAt,
    createdBy: convexRel.createdBy,
  };
}

// =============================================================================
// Page Component
// =============================================================================

interface DimensionPageProps {
  params: Promise<{ dimensionId: string }>;
}

export default function DimensionPage({ params }: DimensionPageProps) {
  const { dimensionId } = use(params);
  const router = useRouter();
  const { navigateTo } = useDimensionNavigation();
  const { touchHandlers } = useSwipeNavigation();

  // State
  const [selectedEntityId, setSelectedEntityId] = useState<string | undefined>();
  const [showPortal, setShowPortal] = useState(true);
  const [portalComplete, setPortalComplete] = useState(false);
  const prevDimensionRef = useRef<string | null>(null);

  // Trigger portal on dimension change
  useEffect(() => {
    if (prevDimensionRef.current !== null && prevDimensionRef.current !== dimensionId) {
      // Dimension changed - show portal transition
      setShowPortal(true);
      setPortalComplete(false);
    }
    prevDimensionRef.current = dimensionId;
  }, [dimensionId]);

  // Handle portal completion
  const handlePortalComplete = useCallback(() => {
    setShowPortal(false);
    setPortalComplete(true);
  }, []);

  // Check if it's a preset dimension
  const isPreset = dimensionId in PRESET_CONFIGS;
  const presetConfig = isPreset
    ? PRESET_CONFIGS[dimensionId as PresetDimensionId]
    : null;

  // Get entity type filter from config
  const entityTypeFilter = useMemo(() => {
    if (presetConfig?.filter?.entityTypes) {
      return presetConfig.filter.entityTypes as EntityType[];
    }
    return undefined;
  }, [presetConfig]);

  // Load custom dimension from Convex (only if not preset)
  const customDimension = useQuery(
    api.erv.getDimension,
    !isPreset ? { dimensionId } : "skip"
  );

  // Build effective config
  const config = useMemo<DimensionConfig | null>(() => {
    if (presetConfig) return presetConfig;
    if (customDimension) {
      try {
        const parsed = JSON.parse(customDimension.config);
        return {
          id: customDimension.dimensionId,
          name: customDimension.name,
          description: customDimension.description,
          icon: customDimension.icon,
          gradient: customDimension.gradient,
          metaphor: customDimension.metaphor,
          ...parsed,
        } as DimensionConfig;
      } catch {
        return null;
      }
    }
    return null;
  }, [presetConfig, customDimension]);

  // Load entities from Convex
  const entitiesResult = useQuery(api.erv.listEntities, {
    entityTypes: entityTypeFilter,
    limit: 100,
  });

  // Get entity IDs for relationship query
  const entityIds = useMemo(() => {
    if (!entitiesResult?.entities) return [];
    return entitiesResult.entities.map((e: { entityId: string }) => e.entityId);
  }, [entitiesResult?.entities]);

  // Load relationships for entities
  const relationshipsResult = useQuery(
    api.erv.getRelationshipsForEntities,
    entityIds.length > 0 ? { entityIds } : "skip"
  );

  // Convert to typed entities and relationships
  const entities = useMemo<Entity[]>(() => {
    if (!entitiesResult?.entities) return [];
    return entitiesResult.entities.map((e: ConvexEntity) => convertToEntity(e));
  }, [entitiesResult?.entities]);

  const relationships = useMemo<Relationship[]>(() => {
    if (!relationshipsResult) return [];
    return relationshipsResult.map((r: ConvexRelationship) => convertToRelationship(r));
  }, [relationshipsResult]);

  // Loading and error states
  const loading = entitiesResult === undefined;
  const error = useMemo(() => {
    if (!isPreset && customDimension === null && !loading) {
      return `Dimension "${dimensionId}" not found`;
    }
    return undefined;
  }, [isPreset, customDimension, dimensionId, loading]);

  // Update navigation context
  useEffect(() => {
    if (config) {
      navigateTo(config.id, config.name);
    }
  }, [config, navigateTo]);

  // Handlers
  const handleHomeClick = useCallback(() => {
    router.push("/");
  }, [router]);

  const handleEntityClick = useCallback((entity: Entity) => {
    setSelectedEntityId(entity.entityId);
    // TODO: Navigate to entity detail or open preview
  }, []);

  const handleEntityLongPress = useCallback((entity: Entity) => {
    // TODO: Show "beyond the veil" reveal
    console.log("Long press on:", entity.name);
  }, []);

  const handleConnectionClick = useCallback((relationship: Relationship) => {
    // TODO: Show relationship details
    console.log("Connection clicked:", relationship);
  }, []);

  if (!config && !loading && !error) {
    return null;
  }

  // Get target dimension info for portal
  const portalTarget = config ? {
    id: config.id,
    name: config.name,
    gradient: config.gradient,
    metaphor: config.metaphor,
  } : undefined;

  return (
    <PageTransitionWrapper>
      {/* Reality-bending portal transition */}
      <AnimatePresence>
        {showPortal && portalTarget && (
          <DimensionPortal
            isTransitioning={showPortal}
            targetDimension={portalTarget}
            onTransitionComplete={handlePortalComplete}
            duration={1200}
            intensity={0.8}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={cn(
          "min-h-screen flex flex-col",
          "bg-[hsl(var(--theme-background))]"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: portalComplete || !showPortal ? 1 : 0 }}
        transition={{ duration: 0.3, delay: showPortal ? 0 : 0.2 }}
        {...touchHandlers}
      >
        {/* Header */}
        <DimensionHeader
          config={config || undefined}
          onHomeClick={handleHomeClick}
          showAIContext={true}
        />

        {/* Content */}
        <main className="flex-1 overflow-hidden">
          <DimensionRenderer
            config={config || {
              id: dimensionId,
              name: dimensionId,
              container: "frame",
              arrangement: "grid",
              entityShape: "square",
              connectionStyle: "none",
              decorations: [],
              interactions: [],
              transition: "fade",
            }}
            entities={entities}
            relationships={relationships}
            selectedEntityId={selectedEntityId}
            loading={loading}
            error={error}
            onEntityClick={handleEntityClick}
            onEntityLongPress={handleEntityLongPress}
            onConnectionClick={handleConnectionClick}
            className="h-full"
          />
        </main>

        {/* Dimension info footer */}
        {config && !loading && !error && (
          <motion.footer
            className={cn(
              "flex items-center justify-between",
              "px-4 py-3",
              "bg-[hsl(var(--theme-card)/0.8)]",
              "backdrop-blur-lg",
              "border-t border-[hsl(var(--theme-border)/0.5)]"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{config.icon}</span>
              <div>
                <p className="text-sm font-medium text-[hsl(var(--theme-foreground))]">
                  {config.name}
                </p>
                <p className="text-xs text-[hsl(var(--theme-muted-foreground))]">
                  {entities.length} entities • {relationships.length} connections
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Metaphor badge */}
              {config.metaphor && (
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    "bg-[hsl(var(--theme-primary)/0.1)]",
                    "text-[hsl(var(--theme-primary))]"
                  )}
                >
                  ✨ {config.metaphor}
                </span>
              )}

              {/* Arrangement badge */}
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-xs",
                  "bg-[hsl(var(--theme-muted))]",
                  "text-[hsl(var(--theme-muted-foreground))]"
                )}
              >
                {config.arrangement}
              </span>
            </div>
          </motion.footer>
        )}
      </motion.div>
    </PageTransitionWrapper>
  );
}
