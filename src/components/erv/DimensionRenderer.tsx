/**
 * ERV Dimension Renderer
 *
 * The cinematic heart of the ERV architecture.
 * Renders any dimension configuration with spectacular visual effects.
 * Makes UIs "melt and conjure like magic."
 *
 * Phase 3, Story 3.1: DimensionRenderer Component
 */

"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { EntityCard } from "./EntityCard";
import { Connection, ConnectionContainer } from "./Connection";
import { useDimensionNavigation } from "@/context/DimensionNavigationContext";
import type {
  Entity,
  Relationship,
  DimensionConfig,
  ArrangementType,
  GraphNode,
  GraphEdge,
} from "@/lib/erv/types";

// =============================================================================
// Animation Configuration - iOS-inspired springs
// =============================================================================

const springs = {
  smooth: { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.8 },
  snappy: { type: "spring" as const, stiffness: 400, damping: 30 },
  bouncy: { type: "spring" as const, stiffness: 400, damping: 15 },
  gentle: { type: "spring" as const, stiffness: 150, damping: 20, mass: 1 },
  magic: { type: "spring" as const, stiffness: 300, damping: 20, mass: 0.5 },
};

// =============================================================================
// Dimension Transition Effects
// =============================================================================

const dimensionTransitions: Record<string, Variants> = {
  // Entities dissolve into particles, then reform
  dissolve: {
    initial: {
      opacity: 0,
      scale: 0.8,
      filter: "blur(20px)",
      y: 30,
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      y: 0,
      transition: springs.magic,
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(30px)",
      y: -20,
      transition: { duration: 0.4 },
    },
  },

  // Cards flip and morph into new arrangement
  morph: {
    initial: {
      opacity: 0,
      rotateY: -90,
      scale: 0.5,
    },
    animate: {
      opacity: 1,
      rotateY: 0,
      scale: 1,
      transition: springs.bouncy,
    },
    exit: {
      opacity: 0,
      rotateY: 90,
      scale: 0.5,
      transition: { duration: 0.3 },
    },
  },

  // Slide up with blur - elegant iOS style
  slideBlur: {
    initial: {
      opacity: 0,
      y: 60,
      filter: "blur(10px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: springs.smooth,
    },
    exit: {
      opacity: 0,
      y: -40,
      filter: "blur(10px)",
      transition: { duration: 0.25 },
    },
  },

  // Cosmic zoom - for graph/orbit arrangements
  cosmic: {
    initial: {
      opacity: 0,
      scale: 0,
      rotate: 180,
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { ...springs.magic, delay: 0.1 },
    },
    exit: {
      opacity: 0,
      scale: 2,
      rotate: -180,
      transition: { duration: 0.5 },
    },
  },

  // Waterfall - staggered cascade
  waterfall: {
    initial: {
      opacity: 0,
      y: -100,
      rotateX: 45,
    },
    animate: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: springs.bouncy,
    },
    exit: {
      opacity: 0,
      y: 100,
      rotateX: -45,
      transition: { duration: 0.3 },
    },
  },
};

// =============================================================================
// Stagger Configurations
// =============================================================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};

// =============================================================================
// Type Definitions
// =============================================================================

export interface DimensionRendererProps {
  /** The dimension configuration to render */
  config: DimensionConfig;
  /** Entities to display */
  entities: Entity[];
  /** Relationships between entities */
  relationships?: Relationship[];
  /** Currently selected entity */
  selectedEntityId?: string;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Callback when entity is clicked */
  onEntityClick?: (entity: Entity) => void;
  /** Callback when entity is long-pressed */
  onEntityLongPress?: (entity: Entity) => void;
  /** Callback when connection is clicked */
  onConnectionClick?: (relationship: Relationship) => void;
  /** Container class name */
  className?: string;
  /** Debug mode - shows arrangement guides */
  debug?: boolean;
}

// =============================================================================
// Position Calculators
// =============================================================================

function calculateGridPositions(
  count: number,
  columns: number = 4,
  gap: number = 16,
  itemWidth: number = 200,
  itemHeight: number = 150
): { x: number; y: number }[] {
  return Array.from({ length: count }, (_, i) => ({
    x: (i % columns) * (itemWidth + gap),
    y: Math.floor(i / columns) * (itemHeight + gap),
  }));
}

function calculateSpiralPositions(
  count: number,
  centerX: number,
  centerY: number,
  baseRadius: number = 80,
  growth: number = 20
): { x: number; y: number }[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = i * 0.5;
    const radius = baseRadius + growth * angle;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
}

function calculateOrbitPositions(
  count: number,
  centerX: number,
  centerY: number,
  orbitRadius: number = 200
): { x: number; y: number }[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return {
      x: centerX + orbitRadius * Math.cos(angle),
      y: centerY + orbitRadius * Math.sin(angle),
    };
  });
}

function calculateFlowPositions(
  count: number,
  containerWidth: number,
  itemWidth: number = 200,
  itemHeight: number = 150,
  gap: number = 16
): { x: number; y: number }[] {
  const itemsPerRow = Math.floor(containerWidth / (itemWidth + gap)) || 1;
  return Array.from({ length: count }, (_, i) => ({
    x: (i % itemsPerRow) * (itemWidth + gap),
    y: Math.floor(i / itemsPerRow) * (itemHeight + gap),
  }));
}

function calculateTreePositions(
  entities: Entity[],
  relationships: Relationship[],
  containerWidth: number
): { x: number; y: number }[] {
  // Find root nodes (no incoming edges)
  const targetIds = new Set(relationships.map((r) => r.targetEntityId));
  const roots = entities.filter((e) => !targetIds.has(e.entityId));

  // Simple tree layout - BFS from roots
  const positions: { x: number; y: number }[] = [];
  const levels: Map<string, number> = new Map();
  const indexInLevel: Map<number, number> = new Map();

  // Set root levels
  roots.forEach((root, i) => {
    levels.set(root.entityId, 0);
    positions[entities.findIndex((e) => e.entityId === root.entityId)] = {
      x: (i + 1) * (containerWidth / (roots.length + 1)),
      y: 50,
    };
  });

  // BFS to assign levels
  const queue = [...roots.map((r) => r.entityId)];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const nodeLevel = levels.get(nodeId) || 0;

    const children = relationships
      .filter((r) => r.sourceEntityId === nodeId)
      .map((r) => r.targetEntityId);

    children.forEach((childId) => {
      if (!levels.has(childId)) {
        levels.set(childId, nodeLevel + 1);
        queue.push(childId);

        const level = nodeLevel + 1;
        const idx = indexInLevel.get(level) || 0;
        indexInLevel.set(level, idx + 1);

        const entityIdx = entities.findIndex((e) => e.entityId === childId);
        if (entityIdx >= 0) {
          positions[entityIdx] = {
            x: (idx + 1) * 150,
            y: level * 120 + 50,
          };
        }
      }
    });
  }

  // Fill remaining positions
  return entities.map((e, i) => positions[i] || { x: 50 + (i % 5) * 150, y: 50 + Math.floor(i / 5) * 120 });
}

function calculateGraphPositions(
  entities: Entity[],
  relationships: Relationship[],
  width: number,
  height: number
): { x: number; y: number }[] {
  // Force-directed layout simulation (simplified)
  const positions = entities.map(() => ({
    x: Math.random() * (width - 100) + 50,
    y: Math.random() * (height - 100) + 50,
  }));

  // Run a few iterations of force simulation
  const iterations = 50;
  const repulsion = 5000;
  const attraction = 0.01;

  for (let iter = 0; iter < iterations; iter++) {
    const forces = positions.map(() => ({ x: 0, y: 0 }));

    // Repulsion between all nodes
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const dx = positions[j].x - positions[i].x;
        const dy = positions[j].y - positions[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = repulsion / (dist * dist);

        forces[i].x -= (dx / dist) * force;
        forces[i].y -= (dy / dist) * force;
        forces[j].x += (dx / dist) * force;
        forces[j].y += (dy / dist) * force;
      }
    }

    // Attraction along edges
    relationships.forEach((rel) => {
      const sourceIdx = entities.findIndex((e) => e.entityId === rel.sourceEntityId);
      const targetIdx = entities.findIndex((e) => e.entityId === rel.targetEntityId);
      if (sourceIdx >= 0 && targetIdx >= 0) {
        const dx = positions[targetIdx].x - positions[sourceIdx].x;
        const dy = positions[targetIdx].y - positions[sourceIdx].y;

        forces[sourceIdx].x += dx * attraction;
        forces[sourceIdx].y += dy * attraction;
        forces[targetIdx].x -= dx * attraction;
        forces[targetIdx].y -= dy * attraction;
      }
    });

    // Apply forces
    const damping = 0.85;
    positions.forEach((pos, i) => {
      pos.x += forces[i].x * damping;
      pos.y += forces[i].y * damping;
      // Clamp to bounds
      pos.x = Math.max(50, Math.min(width - 50, pos.x));
      pos.y = Math.max(50, Math.min(height - 50, pos.y));
    });
  }

  return positions;
}

// =============================================================================
// Arrangement Renderers
// =============================================================================

interface ArrangementProps {
  entities: Entity[];
  relationships: Relationship[];
  config: DimensionConfig;
  positions: { x: number; y: number }[];
  selectedEntityId?: string;
  onEntityClick?: (entity: Entity) => void;
  onEntityLongPress?: (entity: Entity) => void;
  onConnectionClick?: (relationship: Relationship) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const GridArrangement = memo(function GridArrangement({
  entities,
  config,
  selectedEntityId,
  onEntityClick,
  onEntityLongPress,
}: ArrangementProps) {
  const columns = config.columns || 4;
  const gap = config.gap || 16;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {entities.map((entity, index) => (
        <motion.div
          key={entity.entityId}
          variants={dimensionTransitions.slideBlur}
          custom={index}
          layout
          layoutId={entity.entityId}
        >
          <EntityCard
            entity={entity}
            shape={config.entityShape}
            size={config.itemSize === "auto" ? "md" : config.itemSize}
            selected={selectedEntityId === entity.entityId}
            onClick={onEntityClick}
            onLongPress={onEntityLongPress}
          />
        </motion.div>
      ))}
    </motion.div>
  );
});

const ListArrangement = memo(function ListArrangement({
  entities,
  config,
  selectedEntityId,
  onEntityClick,
  onEntityLongPress,
}: ArrangementProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col"
      style={{ gap: `${config.gap || 8}px` }}
    >
      {entities.map((entity, index) => (
        <motion.div
          key={entity.entityId}
          variants={dimensionTransitions.slideBlur}
          custom={index}
          layout
          layoutId={entity.entityId}
        >
          <EntityCard
            entity={entity}
            shape="square"
            size={config.itemSize === "auto" ? "md" : config.itemSize}
            selected={selectedEntityId === entity.entityId}
            onClick={onEntityClick}
            onLongPress={onEntityLongPress}
          />
        </motion.div>
      ))}
    </motion.div>
  );
});

const FlowArrangement = memo(function FlowArrangement({
  entities,
  config,
  selectedEntityId,
  onEntityClick,
  onEntityLongPress,
}: ArrangementProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-wrap"
      style={{ gap: `${config.gap || 16}px` }}
    >
      {entities.map((entity, index) => (
        <motion.div
          key={entity.entityId}
          variants={dimensionTransitions.dissolve}
          custom={index}
          layout
          layoutId={entity.entityId}
        >
          <EntityCard
            entity={entity}
            shape={config.entityShape}
            size={config.itemSize === "auto" ? "md" : config.itemSize}
            selected={selectedEntityId === entity.entityId}
            onClick={onEntityClick}
            onLongPress={onEntityLongPress}
          />
        </motion.div>
      ))}
    </motion.div>
  );
});

const SpiralArrangement = memo(function SpiralArrangement({
  entities,
  positions,
  config,
  selectedEntityId,
  onEntityClick,
  onEntityLongPress,
  containerRef,
}: ArrangementProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-full h-full min-h-[600px]"
    >
      {entities.map((entity, index) => {
        const pos = positions[index] || { x: 0, y: 0 };
        return (
          <motion.div
            key={entity.entityId}
            className="absolute"
            variants={dimensionTransitions.cosmic}
            custom={index}
            layout
            layoutId={entity.entityId}
            style={{
              left: pos.x,
              top: pos.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <EntityCard
              entity={entity}
              shape="circle"
              size={config.itemSize === "auto" ? "md" : config.itemSize}
              selected={selectedEntityId === entity.entityId}
              onClick={onEntityClick}
              onLongPress={onEntityLongPress}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
});

const OrbitArrangement = memo(function OrbitArrangement({
  entities,
  positions,
  config,
  selectedEntityId,
  onEntityClick,
  onEntityLongPress,
}: ArrangementProps) {
  // Central "sun" - first entity or a summary
  const centerEntity = entities[0];
  const orbitEntities = entities.slice(1);
  const orbitPositions = positions.slice(1);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-full h-full min-h-[600px]"
    >
      {/* Center entity */}
      {centerEntity && (
        <motion.div
          className="absolute left-1/2 top-1/2"
          variants={dimensionTransitions.cosmic}
          layout
          layoutId={centerEntity.entityId}
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <EntityCard
            entity={centerEntity}
            shape="circle"
            size="lg"
            selected={selectedEntityId === centerEntity.entityId}
            onClick={onEntityClick}
            onLongPress={onEntityLongPress}
          />
        </motion.div>
      )}

      {/* Orbiting entities */}
      {orbitEntities.map((entity, index) => {
        const pos = orbitPositions[index] || { x: 0, y: 0 };
        return (
          <motion.div
            key={entity.entityId}
            className="absolute"
            variants={dimensionTransitions.cosmic}
            custom={index}
            layout
            layoutId={entity.entityId}
            animate={{
              left: pos.x,
              top: pos.y,
              rotate: [0, 360],
            }}
            transition={{
              rotate: {
                duration: 60 + index * 10,
                repeat: Infinity,
                ease: "linear",
              },
              ...springs.magic,
            }}
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <EntityCard
              entity={entity}
              shape="circle"
              size={config.itemSize === "auto" ? "sm" : config.itemSize}
              selected={selectedEntityId === entity.entityId}
              onClick={onEntityClick}
              onLongPress={onEntityLongPress}
            />
          </motion.div>
        );
      })}

      {/* Orbit rings */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <circle
          cx="50%"
          cy="50%"
          r="200"
          fill="none"
          stroke="hsl(var(--theme-primary))"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>
    </motion.div>
  );
});

const GraphArrangement = memo(function GraphArrangement({
  entities,
  relationships,
  positions,
  config,
  selectedEntityId,
  onEntityClick,
  onEntityLongPress,
  onConnectionClick,
  containerRef,
}: ArrangementProps) {
  const containerBounds = containerRef.current?.getBoundingClientRect();
  const width = containerBounds?.width || 800;
  const height = containerBounds?.height || 600;

  // Map entity IDs to positions
  const positionMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    entities.forEach((e, i) => {
      map.set(e.entityId, positions[i] || { x: 0, y: 0 });
    });
    return map;
  }, [entities, positions]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-full h-full min-h-[600px]"
    >
      {/* Connection layer */}
      <ConnectionContainer width={width} height={height}>
        {relationships.map((rel) => {
          const from = positionMap.get(rel.sourceEntityId);
          const to = positionMap.get(rel.targetEntityId);
          if (!from || !to) return null;

          return (
            <Connection
              key={rel._id}
              from={from}
              to={to}
              type={config.connectionStyle}
              weight={rel.weight}
              label={rel.label}
              highlighted={
                selectedEntityId === rel.sourceEntityId ||
                selectedEntityId === rel.targetEntityId
              }
              onClick={() => onConnectionClick?.(rel)}
            />
          );
        })}
      </ConnectionContainer>

      {/* Node layer */}
      {entities.map((entity, index) => {
        const pos = positions[index] || { x: 0, y: 0 };
        return (
          <motion.div
            key={entity.entityId}
            className="absolute z-10"
            variants={dimensionTransitions.dissolve}
            custom={index}
            layout
            layoutId={entity.entityId}
            drag
            dragMomentum={false}
            dragElastic={0.1}
            style={{
              left: pos.x,
              top: pos.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <EntityCard
              entity={entity}
              shape={config.entityShape}
              size={config.itemSize === "auto" ? "md" : config.itemSize}
              selected={selectedEntityId === entity.entityId}
              onClick={onEntityClick}
              onLongPress={onEntityLongPress}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
});

const TreeArrangement = memo(function TreeArrangement({
  entities,
  relationships,
  positions,
  config,
  selectedEntityId,
  onEntityClick,
  onEntityLongPress,
  onConnectionClick,
  containerRef,
}: ArrangementProps) {
  const containerBounds = containerRef.current?.getBoundingClientRect();
  const width = containerBounds?.width || 800;
  const height = containerBounds?.height || 600;

  // Map entity IDs to positions
  const positionMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    entities.forEach((e, i) => {
      map.set(e.entityId, positions[i] || { x: 0, y: 0 });
    });
    return map;
  }, [entities, positions]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-full h-full min-h-[600px]"
    >
      {/* Connection layer */}
      <ConnectionContainer width={width} height={height}>
        {relationships.map((rel) => {
          const from = positionMap.get(rel.sourceEntityId);
          const to = positionMap.get(rel.targetEntityId);
          if (!from || !to) return null;

          return (
            <Connection
              key={rel._id}
              from={from}
              to={to}
              type="curve"
              weight={rel.weight}
              highlighted={
                selectedEntityId === rel.sourceEntityId ||
                selectedEntityId === rel.targetEntityId
              }
              onClick={() => onConnectionClick?.(rel)}
            />
          );
        })}
      </ConnectionContainer>

      {/* Node layer */}
      {entities.map((entity, index) => {
        const pos = positions[index] || { x: 0, y: 0 };
        return (
          <motion.div
            key={entity.entityId}
            className="absolute z-10"
            variants={dimensionTransitions.waterfall}
            custom={index}
            layout
            layoutId={entity.entityId}
            style={{
              left: pos.x,
              top: pos.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <EntityCard
              entity={entity}
              shape={config.entityShape}
              size={config.itemSize === "auto" ? "md" : config.itemSize}
              selected={selectedEntityId === entity.entityId}
              onClick={onEntityClick}
              onLongPress={onEntityLongPress}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
});

// =============================================================================
// Loading & Error States
// =============================================================================

const LoadingState = memo(function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center h-full min-h-[400px]"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-[hsl(var(--theme-primary)/0.2)] border-t-[hsl(var(--theme-primary))]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          className="text-[hsl(var(--theme-muted-foreground))]"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Conjuring dimension...
        </motion.p>
      </div>
    </motion.div>
  );
});

const ErrorState = memo(function ErrorState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center justify-center h-full min-h-[400px]"
    >
      <div className="text-center p-8 rounded-xl bg-red-500/10 border border-red-500/20 max-w-md">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-red-500 mb-2">
          Dimension Error
        </h3>
        <p className="text-[hsl(var(--theme-muted-foreground))]">{message}</p>
      </div>
    </motion.div>
  );
});

const EmptyState = memo(function EmptyState({ config }: { config: DimensionConfig }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center justify-center h-full min-h-[400px]"
    >
      <div className="text-center p-8">
        <motion.div
          className="w-20 h-20 rounded-full bg-[hsl(var(--theme-muted))] flex items-center justify-center mx-auto mb-4"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-3xl">✨</span>
        </motion.div>
        <h3 className="text-lg font-semibold text-[hsl(var(--theme-foreground))] mb-2">
          {config.name} is empty
        </h3>
        <p className="text-[hsl(var(--theme-muted-foreground))]">
          No entities found for this dimension
        </p>
      </div>
    </motion.div>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const DimensionRenderer = memo(function DimensionRenderer({
  config,
  entities,
  relationships = [],
  selectedEntityId,
  loading = false,
  error,
  onEntityClick,
  onEntityLongPress,
  onConnectionClick,
  className,
  debug = false,
}: DimensionRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  // Get navigation context for 8gent updates
  const navigation = useDimensionNavigation();

  // Track container size
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate positions based on arrangement
  const positions = useMemo(() => {
    const { width, height } = containerSize;
    const centerX = width / 2;
    const centerY = height / 2;

    switch (config.arrangement) {
      case "grid":
        return calculateGridPositions(
          entities.length,
          config.columns || 4,
          config.gap || 16
        );
      case "spiral":
        return calculateSpiralPositions(entities.length, centerX, centerY);
      case "orbit":
        return calculateOrbitPositions(entities.length, centerX, centerY);
      case "flow":
        return calculateFlowPositions(entities.length, width);
      case "tree":
        return calculateTreePositions(entities, relationships, width);
      case "graph":
        return calculateGraphPositions(entities, relationships, width, height);
      case "list":
      default:
        return entities.map((_, i) => ({ x: 0, y: i * 80 }));
    }
  }, [config.arrangement, config.columns, config.gap, entities, relationships, containerSize]);

  // Update navigation context when dimension changes
  useEffect(() => {
    navigation.navigateTo(config.id, config.name);
  }, [config.id, config.name, navigation]);

  // Select the appropriate arrangement renderer
  const ArrangementComponent = useMemo(() => {
    const arrangements: Record<ArrangementType, typeof GridArrangement> = {
      grid: GridArrangement,
      list: ListArrangement,
      flow: FlowArrangement,
      spiral: SpiralArrangement,
      orbit: OrbitArrangement,
      tree: TreeArrangement,
      graph: GraphArrangement,
    };
    return arrangements[config.arrangement] || GridArrangement;
  }, [config.arrangement]);

  // Choose transition based on arrangement
  const transitionKey = useMemo(() => {
    const transitions: Record<ArrangementType, string> = {
      grid: "slideBlur",
      list: "slideBlur",
      flow: "dissolve",
      spiral: "cosmic",
      orbit: "cosmic",
      tree: "waterfall",
      graph: "dissolve",
    };
    return transitions[config.arrangement] || "slideBlur";
  }, [config.arrangement]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-auto",
        "bg-[hsl(var(--theme-background))]",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Debug overlay */}
      {debug && (
        <div className="absolute top-2 left-2 z-50 text-xs bg-black/80 text-white p-2 rounded">
          <div>Arrangement: {config.arrangement}</div>
          <div>Entities: {entities.length}</div>
          <div>Relationships: {relationships.length}</div>
          <div>Size: {containerSize.width}x{containerSize.height}</div>
        </div>
      )}

      {/* Background gradient based on dimension */}
      <div
        className={cn(
          "absolute inset-0 opacity-30 pointer-events-none",
          config.gradient && `bg-gradient-to-br ${config.gradient}`
        )}
      />

      {/* Main content */}
      <div className="relative z-10 p-4 md:p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingState key="loading" />
          ) : error ? (
            <ErrorState key="error" message={error} />
          ) : entities.length === 0 ? (
            <EmptyState key="empty" config={config} />
          ) : (
            <motion.div
              key={`${config.id}-${transitionKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrangementComponent
                entities={entities}
                relationships={relationships}
                config={config}
                positions={positions}
                selectedEntityId={selectedEntityId}
                onEntityClick={onEntityClick}
                onEntityLongPress={onEntityLongPress}
                onConnectionClick={onConnectionClick}
                containerRef={containerRef}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ambient particles for magical effect */}
      <AmbientParticles arrangement={config.arrangement} />
    </motion.div>
  );
});

// =============================================================================
// Ambient Particles - The "Magic" Effect
// =============================================================================

const AmbientParticles = memo(function AmbientParticles({
  arrangement,
}: {
  arrangement: ArrangementType;
}) {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; duration: number }[]
  >([]);

  useEffect(() => {
    // Generate particles based on arrangement
    const count = arrangement === "orbit" || arrangement === "spiral" ? 30 : 15;
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 3 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, [arrangement]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-[hsl(var(--theme-primary))]"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
            y: [0, -30, -60],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
});

export default DimensionRenderer;
