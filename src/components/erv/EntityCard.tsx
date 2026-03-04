/**
 * ERV EntityCard Component
 *
 * A polymorphic card that renders any entity type with appropriate
 * visual treatment based on entityType and DimensionConfig.
 *
 * Phase 2, Story 2.1: EntityCard Primitive
 */

"use client";

import { memo, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  User,
  FolderKanban,
  Music,
  FileText,
  Pencil,
  Ticket,
  Target,
  Calendar,
  Brain,
  Heart,
  Layers,
  FolderOpen,
  Sparkles,
  Bell,
  Bot,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Entity, EntityType, ShapeType } from "@/lib/erv/types";

// =============================================================================
// Type Definitions
// =============================================================================

export interface EntityCardProps {
  entity: Entity;
  /** Card shape from dimension config */
  shape?: ShapeType;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether this card is selected */
  selected?: boolean;
  /** Whether to show the thumbnail */
  showThumbnail?: boolean;
  /** Whether to show tags */
  showTags?: boolean;
  /** Whether to show the type badge */
  showTypeBadge?: boolean;
  /** Custom color override */
  color?: string;
  /** Click handler */
  onClick?: (entity: Entity) => void;
  /** Long press handler (for "beyond the veil" reveal) */
  onLongPress?: (entity: Entity) => void;
  /** Drag start handler */
  onDragStart?: (e: React.DragEvent, entity: Entity) => void;
  /** Additional class names */
  className?: string;
}

// =============================================================================
// Entity Type Configuration
// =============================================================================

interface EntityTypeConfig {
  icon: LucideIcon;
  gradient: string;
  label: string;
}

const ENTITY_TYPE_CONFIG: Record<EntityType, EntityTypeConfig> = {
  Person: {
    icon: User,
    gradient: "from-blue-500 to-cyan-500",
    label: "Person",
  },
  Project: {
    icon: FolderKanban,
    gradient: "from-violet-500 to-purple-500",
    label: "Project",
  },
  Track: {
    icon: Music,
    gradient: "from-pink-500 to-rose-500",
    label: "Track",
  },
  Draft: {
    icon: FileText,
    gradient: "from-amber-500 to-orange-500",
    label: "Draft",
  },
  Sketch: {
    icon: Pencil,
    gradient: "from-emerald-500 to-green-500",
    label: "Sketch",
  },
  Ticket: {
    icon: Ticket,
    gradient: "from-cyan-500 to-teal-500",
    label: "Ticket",
  },
  Epic: {
    icon: Target,
    gradient: "from-indigo-500 to-blue-500",
    label: "Epic",
  },
  Event: {
    icon: Calendar,
    gradient: "from-red-500 to-pink-500",
    label: "Event",
  },
  Memory: {
    icon: Brain,
    gradient: "from-purple-500 to-fuchsia-500",
    label: "Memory",
  },
  Value: {
    icon: Heart,
    gradient: "from-rose-500 to-red-500",
    label: "Value",
  },
  Dimension: {
    icon: Layers,
    gradient: "from-slate-500 to-zinc-500",
    label: "Dimension",
  },
  Collection: {
    icon: FolderOpen,
    gradient: "from-yellow-500 to-amber-500",
    label: "Collection",
  },
  Skill: {
    icon: Sparkles,
    gradient: "from-fuchsia-500 to-pink-500",
    label: "Skill",
  },
  Reminder: {
    icon: Bell,
    gradient: "from-orange-500 to-red-500",
    label: "Reminder",
  },
  AgentTask: {
    icon: Bot,
    gradient: "from-sky-500 to-blue-500",
    label: "Agent Task",
  },
};

// =============================================================================
// Size Configuration
// =============================================================================

const SIZE_CONFIG = {
  sm: {
    card: "p-2 gap-2",
    icon: "w-4 h-4",
    iconContainer: "w-8 h-8",
    title: "text-sm",
    meta: "text-xs",
    thumbnail: "w-8 h-8",
  },
  md: {
    card: "p-3 gap-3",
    icon: "w-5 h-5",
    iconContainer: "w-10 h-10",
    title: "text-base",
    meta: "text-sm",
    thumbnail: "w-12 h-12",
  },
  lg: {
    card: "p-4 gap-4",
    icon: "w-6 h-6",
    iconContainer: "w-14 h-14",
    title: "text-lg",
    meta: "text-sm",
    thumbnail: "w-16 h-16",
  },
};

// =============================================================================
// Shape Configuration
// =============================================================================

const SHAPE_CONFIG: Record<ShapeType, string> = {
  circle: "rounded-full aspect-square",
  square: "rounded-lg",
  hexagon: "rounded-lg", // TODO: clip-path hexagon
  custom: "rounded-lg",
};

// =============================================================================
// Component
// =============================================================================

export const EntityCard = memo(function EntityCard({
  entity,
  shape = "square",
  size = "md",
  selected = false,
  showThumbnail = true,
  showTags = true,
  showTypeBadge = true,
  color,
  onClick,
  onLongPress,
  onDragStart,
  className,
}: EntityCardProps) {
  const config = ENTITY_TYPE_CONFIG[entity.entityType];
  const sizeConfig = SIZE_CONFIG[size];
  const Icon = config.icon;

  // Parse entity data for type-specific rendering
  const parsedData = useMemo(() => {
    try {
      return JSON.parse(entity.data);
    } catch {
      return {};
    }
  }, [entity.data]);

  // Get subtitle based on entity type
  const subtitle = useMemo(() => {
    switch (entity.entityType) {
      case "Person":
        return parsedData.title || parsedData.company || parsedData.email;
      case "Project":
        return parsedData.status;
      case "Track":
        return parsedData.artist;
      case "Ticket":
        return `${parsedData.ticketId} • ${parsedData.priority}`;
      case "Event":
        return parsedData.startTime
          ? new Date(parsedData.startTime).toLocaleDateString()
          : undefined;
      case "Memory":
        return parsedData.memoryType;
      default:
        return undefined;
    }
  }, [entity.entityType, parsedData]);

  // Handle click
  const handleClick = useCallback(() => {
    onClick?.(entity);
  }, [onClick, entity]);

  // Handle drag start
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      onDragStart?.(e, entity);
    },
    [onDragStart, entity]
  );

  // Long press handling
  const handleLongPress = useCallback(() => {
    onLongPress?.(entity);
  }, [onLongPress, entity]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.(entity);
      }
    },
    [onClick, entity]
  );

  // Determine if we should show circular (for nodes in graph)
  const isCircular = shape === "circle";

  const cardContent = (
    <motion.div
      layout
      layoutId={entity.entityId}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: selected ? 1.02 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      tabIndex={0}
      role="button"
      aria-label={`${entity.name}, ${config.label}`}
      aria-selected={selected}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        // Base styles
        "relative cursor-pointer select-none",
        "bg-[hsl(var(--theme-card))] border border-[hsl(var(--theme-border))]",
        "hover:border-[hsl(var(--theme-primary)/0.5)] hover:shadow-lg",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--theme-primary))]",
        "transition-all duration-200",
        // Shape
        isCircular ? SHAPE_CONFIG.circle : SHAPE_CONFIG[shape],
        // Size
        sizeConfig.card,
        // Selected state
        selected && "ring-2 ring-[hsl(var(--theme-primary))] shadow-lg",
        // Layout
        isCircular ? "flex items-center justify-center" : "flex items-start",
        className
      )}
    >
      {/* Circular mode - icon only */}
      {isCircular ? (
        <div
          className={cn(
            "flex items-center justify-center rounded-full",
            "bg-gradient-to-br",
            color || config.gradient,
            sizeConfig.iconContainer
          )}
        >
          <Icon className={cn("text-white", sizeConfig.icon)} />
        </div>
      ) : (
        <>
          {/* Thumbnail or Icon */}
          <div className="flex-shrink-0">
            {showThumbnail && entity.thumbnail ? (
              <img
                src={entity.thumbnail}
                alt=""
                className={cn(
                  "object-cover rounded-lg",
                  sizeConfig.thumbnail
                )}
              />
            ) : (
              <div
                className={cn(
                  "flex items-center justify-center rounded-lg",
                  "bg-gradient-to-br",
                  color || config.gradient,
                  sizeConfig.iconContainer
                )}
              >
                <Icon className={cn("text-white", sizeConfig.icon)} />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Type badge */}
            {showTypeBadge && (
              <div className="flex items-center gap-1 mb-0.5">
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider",
                    "bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-muted-foreground))]"
                  )}
                >
                  {config.label}
                </span>
              </div>
            )}

            {/* Title */}
            <h3
              className={cn(
                "font-medium truncate text-[hsl(var(--theme-foreground))]",
                sizeConfig.title
              )}
            >
              {entity.name}
            </h3>

            {/* Subtitle */}
            {subtitle && (
              <p
                className={cn(
                  "truncate text-[hsl(var(--theme-muted-foreground))]",
                  sizeConfig.meta
                )}
              >
                {subtitle}
              </p>
            )}

            {/* Tags */}
            {showTags && entity.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {entity.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "px-1.5 py-0.5 rounded-full text-[10px]",
                      "bg-[hsl(var(--theme-accent))] text-[hsl(var(--theme-accent-foreground))]"
                    )}
                  >
                    {tag}
                  </span>
                ))}
                {entity.tags.length > 3 && (
                  <span className="text-[10px] text-[hsl(var(--theme-muted-foreground))]">
                    +{entity.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Importance indicator */}
          {entity.importance !== undefined && entity.importance > 0.7 && (
            <div
              className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500"
              title={`Importance: ${Math.round(entity.importance * 100)}%`}
            />
          )}
        </>
      )}
    </motion.div>
  );

  // Wrap with drag handler if needed
  if (onDragStart) {
    return (
      <div
        draggable
        onDragStart={handleDragStart}
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
});

export default EntityCard;
