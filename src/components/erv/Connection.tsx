/**
 * ERV Connection Primitives
 *
 * SVG-based connection components for drawing edges between entities
 * in graph-based dimensions.
 *
 * Phase 2, Story 2.2: SVG Connection Primitives
 */

"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ConnectionType } from "@/lib/erv/types";

// =============================================================================
// Type Definitions
// =============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface ConnectionProps {
  /** Start point */
  from: Point;
  /** End point */
  to: Point;
  /** Connection style */
  type?: ConnectionType;
  /** Stroke color */
  color?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Whether to animate the connection */
  animated?: boolean;
  /** Whether the connection is bidirectional */
  bidirectional?: boolean;
  /** Optional label */
  label?: string;
  /** Weight (0-1) affects opacity/thickness */
  weight?: number;
  /** Whether this connection is highlighted */
  highlighted?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional class names for the SVG group */
  className?: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Calculate control points for a bezier curve
 */
function getBezierControlPoints(
  from: Point,
  to: Point,
  curvature: number = 0.5
): { cp1: Point; cp2: Point } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const midX = from.x + dx / 2;
  const midY = from.y + dy / 2;

  // Perpendicular offset for curve
  const perpX = -dy * curvature * 0.3;
  const perpY = dx * curvature * 0.3;

  return {
    cp1: { x: midX + perpX, y: midY + perpY },
    cp2: { x: midX + perpX, y: midY + perpY },
  };
}

/**
 * Generate SVG path for different connection types
 */
function getPath(from: Point, to: Point, type: ConnectionType): string {
  switch (type) {
    case "line":
      return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

    case "curve": {
      const { cp1, cp2 } = getBezierControlPoints(from, to);
      return `M ${from.x} ${from.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${to.x} ${to.y}`;
    }

    case "arrow":
      return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

    case "glow":
      return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

    case "none":
    default:
      return "";
  }
}

/**
 * Calculate arrow head points
 */
function getArrowHeadPoints(from: Point, to: Point, size: number = 10): string {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const arrowAngle = Math.PI / 6; // 30 degrees

  const x1 = to.x - size * Math.cos(angle - arrowAngle);
  const y1 = to.y - size * Math.sin(angle - arrowAngle);
  const x2 = to.x - size * Math.cos(angle + arrowAngle);
  const y2 = to.y - size * Math.sin(angle + arrowAngle);

  return `M ${x1} ${y1} L ${to.x} ${to.y} L ${x2} ${y2}`;
}

/**
 * Calculate midpoint for label placement
 */
function getMidpoint(from: Point, to: Point): Point {
  return {
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2,
  };
}

// =============================================================================
// Connection Component
// =============================================================================

export const Connection = memo(function Connection({
  from,
  to,
  type = "line",
  color = "hsl(var(--theme-border))",
  strokeWidth = 2,
  animated = false,
  bidirectional = false,
  label,
  weight = 1,
  highlighted = false,
  onClick,
  className,
}: ConnectionProps) {
  // Don't render invisible connections
  if (type === "none") return null;

  // Calculate path
  const path = useMemo(() => getPath(from, to, type), [from, to, type]);

  // Calculate arrow heads
  const arrowPath = useMemo(() => {
    if (type !== "arrow") return null;
    return getArrowHeadPoints(from, to, 10);
  }, [from, to, type]);

  const reverseArrowPath = useMemo(() => {
    if (type !== "arrow" || !bidirectional) return null;
    return getArrowHeadPoints(to, from, 10);
  }, [from, to, type, bidirectional]);

  // Calculate label position
  const labelPos = useMemo(() => getMidpoint(from, to), [from, to]);

  // Calculate stroke opacity based on weight
  const strokeOpacity = 0.3 + weight * 0.7;

  // Calculate dynamic stroke width based on weight and highlight
  const dynamicStrokeWidth = highlighted
    ? strokeWidth * 1.5
    : strokeWidth * (0.5 + weight * 0.5);

  // Animation variants
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: strokeOpacity,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <g className={cn("connection", className)} onClick={onClick}>
      {/* Glow effect for glow type */}
      {type === "glow" && (
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={dynamicStrokeWidth * 3}
          strokeLinecap="round"
          strokeOpacity={0.2}
          filter="blur(4px)"
          initial="hidden"
          animate="visible"
          variants={pathVariants}
        />
      )}

      {/* Main path */}
      <motion.path
        d={path}
        fill="none"
        stroke={highlighted ? "hsl(var(--theme-primary))" : color}
        strokeWidth={dynamicStrokeWidth}
        strokeLinecap="round"
        strokeOpacity={strokeOpacity}
        strokeDasharray={animated ? "5 5" : undefined}
        initial="hidden"
        animate="visible"
        variants={pathVariants}
        style={
          animated
            ? {
                animation: "dash 1s linear infinite",
              }
            : undefined
        }
      />

      {/* Arrow head */}
      {arrowPath && (
        <motion.path
          d={arrowPath}
          fill="none"
          stroke={highlighted ? "hsl(var(--theme-primary))" : color}
          strokeWidth={dynamicStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={strokeOpacity}
          initial={{ opacity: 0 }}
          animate={{ opacity: strokeOpacity }}
          transition={{ delay: 0.3 }}
        />
      )}

      {/* Reverse arrow head for bidirectional */}
      {reverseArrowPath && (
        <motion.path
          d={reverseArrowPath}
          fill="none"
          stroke={highlighted ? "hsl(var(--theme-primary))" : color}
          strokeWidth={dynamicStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={strokeOpacity}
          initial={{ opacity: 0 }}
          animate={{ opacity: strokeOpacity }}
          transition={{ delay: 0.3 }}
        />
      )}

      {/* Label */}
      {label && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <rect
            x={labelPos.x - label.length * 3.5}
            y={labelPos.y - 10}
            width={label.length * 7}
            height={20}
            rx={4}
            fill="hsl(var(--theme-background))"
            stroke={color}
            strokeWidth={1}
            strokeOpacity={0.5}
          />
          <text
            x={labelPos.x}
            y={labelPos.y + 4}
            textAnchor="middle"
            fontSize={11}
            fill="hsl(var(--theme-muted-foreground))"
            className="select-none pointer-events-none"
          >
            {label}
          </text>
        </motion.g>
      )}

      {/* Clickable hit area (invisible wider stroke) */}
      {onClick && (
        <path
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth={Math.max(dynamicStrokeWidth * 3, 20)}
          className="cursor-pointer"
        />
      )}

      {/* CSS for animated dash */}
      <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: -10;
            }
          }
        `}
      </style>
    </g>
  );
});

// =============================================================================
// Specialized Connection Components
// =============================================================================

/**
 * Simple line connection
 */
export const LineConnection = memo(function LineConnection(
  props: Omit<ConnectionProps, "type">
) {
  return <Connection {...props} type="line" />;
});

/**
 * Curved bezier connection
 */
export const CurveConnection = memo(function CurveConnection(
  props: Omit<ConnectionProps, "type">
) {
  return <Connection {...props} type="curve" />;
});

/**
 * Arrow connection with directional indicator
 */
export const ArrowConnection = memo(function ArrowConnection(
  props: Omit<ConnectionProps, "type">
) {
  return <Connection {...props} type="arrow" />;
});

/**
 * Glowing connection for emphasis
 */
export const GlowConnection = memo(function GlowConnection(
  props: Omit<ConnectionProps, "type">
) {
  return <Connection {...props} type="glow" />;
});

// =============================================================================
// Connection Container (SVG wrapper)
// =============================================================================

export interface ConnectionContainerProps {
  children: React.ReactNode;
  width: number;
  height: number;
  className?: string;
}

export const ConnectionContainer = memo(function ConnectionContainer({
  children,
  width,
  height,
  className,
}: ConnectionContainerProps) {
  return (
    <svg
      width={width}
      height={height}
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Arrow marker definition */}
        <marker
          id="arrow-marker"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>

        {/* Glow filter */}
        <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {children}
    </svg>
  );
});

export default Connection;
