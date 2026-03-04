"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Drawing Element Types (Excalidraw-compatible)
// ============================================================================

export interface DrawingElement {
  id: string;
  type: "rectangle" | "ellipse" | "diamond" | "line" | "arrow" | "freedraw" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
  points?: { x: number; y: number }[];
  strokeColor: string;
  backgroundColor: string;
  fillStyle: "solid" | "hachure" | "cross-hatch" | "none";
  strokeWidth: number;
  strokeStyle: "solid" | "dashed" | "dotted";
  opacity: number;
  roughness: number;
  text?: string;
  fontSize?: number;
  startArrowhead?: "arrow" | "dot" | "bar" | null;
  endArrowhead?: "arrow" | "dot" | "bar" | null;
  rotation?: number;
  locked?: boolean;
  groupId?: string;
}

export interface DrawingLayerProps {
  elements: DrawingElement[];
  onChange: (elements: DrawingElement[]) => void;
  activeTool: string;
  viewport: { x: number; y: number; zoom: number };
  strokeColor: string;
  backgroundColor: string;
  fillStyle: string;
  strokeWidth: number;
  strokeStyle: string;
  opacity: number;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
}

// ============================================================================
// Helper: Generate hachure fill pattern
// ============================================================================
function HachurePattern({ id, color, gap = 8 }: { id: string; color: string; gap?: number }) {
  return (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2={gap} stroke={color} strokeWidth="1.5" />
    </pattern>
  );
}

function CrossHatchPattern({ id, color, gap = 8 }: { id: string; color: string; gap?: number }) {
  return (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2={gap} y2={gap} stroke={color} strokeWidth="1" />
      <line x1={gap} y1="0" x2="0" y2={gap} stroke={color} strokeWidth="1" />
    </pattern>
  );
}

// ============================================================================
// Helper: Get stroke dasharray
// ============================================================================
function getStrokeDasharray(style: string): string | undefined {
  switch (style) {
    case "dashed": return "12,6";
    case "dotted": return "3,6";
    default: return undefined;
  }
}

// ============================================================================
// Helper: Add roughness jitter to coordinates
// ============================================================================
function jitter(val: number, roughness: number): number {
  if (roughness <= 0) return val;
  return val + (Math.random() - 0.5) * roughness * 2;
}

function roughRect(x: number, y: number, w: number, h: number, roughness: number): string {
  if (roughness <= 0) {
    return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
  }
  const r = roughness;
  return `M ${jitter(x, r)} ${jitter(y, r)} L ${jitter(x + w, r)} ${jitter(y, r)} L ${jitter(x + w, r)} ${jitter(y + h, r)} L ${jitter(x, r)} ${jitter(y + h, r)} Z`;
}

function roughEllipse(cx: number, cy: number, rx: number, ry: number, roughness: number): string {
  const steps = 36;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const px = cx + jitter(Math.cos(angle) * rx, roughness);
    const py = cy + jitter(Math.sin(angle) * ry, roughness);
    points.push(`${i === 0 ? "M" : "L"} ${px} ${py}`);
  }
  return points.join(" ") + " Z";
}

function roughDiamond(cx: number, cy: number, w: number, h: number, roughness: number): string {
  const r = roughness;
  return `M ${jitter(cx, r)} ${jitter(cy - h / 2, r)} L ${jitter(cx + w / 2, r)} ${jitter(cy, r)} L ${jitter(cx, r)} ${jitter(cy + h / 2, r)} L ${jitter(cx - w / 2, r)} ${jitter(cy, r)} Z`;
}

// ============================================================================
// Helper: Smooth freedraw path
// ============================================================================
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const cx = (points[i].x + points[i + 1].x) / 2;
    const cy = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x} ${points[i].y} ${cx} ${cy}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

// ============================================================================
// Single Drawing Element Renderer
// ============================================================================
function DrawingElementRenderer({
  element,
  isSelected,
  onSelect,
}: {
  element: DrawingElement;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const fillId = `fill-${element.id}`;
  const getFill = () => {
    switch (element.fillStyle) {
      case "solid": return element.backgroundColor;
      case "hachure": return `url(#${fillId})`;
      case "cross-hatch": return `url(#${fillId})`;
      case "none": default: return "none";
    }
  };

  const commonProps = {
    stroke: element.strokeColor,
    strokeWidth: element.strokeWidth,
    strokeDasharray: getStrokeDasharray(element.strokeStyle),
    opacity: element.opacity / 100,
    fill: getFill(),
    cursor: "pointer" as const,
    pointerEvents: "auto" as const,
    onClick: (e: React.MouseEvent) => { e.stopPropagation(); onSelect(); },
  };

  const renderFillPattern = () => {
    if (element.fillStyle === "hachure") {
      return <HachurePattern id={fillId} color={element.backgroundColor} />;
    }
    if (element.fillStyle === "cross-hatch") {
      return <CrossHatchPattern id={fillId} color={element.backgroundColor} />;
    }
    return null;
  };

  const selectionPadding = 6;

  return (
    <g
      transform={`translate(${element.x}, ${element.y})${element.rotation ? ` rotate(${element.rotation}, ${element.width / 2}, ${element.height / 2})` : ""}`}
    >
      <defs>{renderFillPattern()}</defs>

      {/* Selection outline */}
      {isSelected && (
        <rect
          x={-selectionPadding}
          y={-selectionPadding}
          width={element.width + selectionPadding * 2}
          height={element.height + selectionPadding * 2}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={1.5}
          strokeDasharray="6,3"
          rx={4}
          pointerEvents="none"
        />
      )}

      {/* Actual shape */}
      {element.type === "rectangle" && (
        <path
          d={roughRect(0, 0, element.width, element.height, element.roughness)}
          {...commonProps}
        />
      )}

      {element.type === "ellipse" && (
        <path
          d={roughEllipse(element.width / 2, element.height / 2, element.width / 2, element.height / 2, element.roughness)}
          {...commonProps}
        />
      )}

      {element.type === "diamond" && (
        <path
          d={roughDiamond(element.width / 2, element.height / 2, element.width, element.height, element.roughness)}
          {...commonProps}
        />
      )}

      {element.type === "line" && element.points && (
        <polyline
          points={element.points.map(p => `${p.x},${p.y}`).join(" ")}
          {...commonProps}
          fill="none"
        />
      )}

      {element.type === "arrow" && element.points && (
        <>
          <defs>
            {element.endArrowhead === "arrow" && (
              <marker id={`arrow-end-${element.id}`} markerWidth="12" markerHeight="8" refX="11" refY="4" orient="auto">
                <polygon points="0 0, 12 4, 0 8" fill={element.strokeColor} />
              </marker>
            )}
            {element.endArrowhead === "dot" && (
              <marker id={`arrow-end-${element.id}`} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <circle cx="4" cy="4" r="3" fill={element.strokeColor} />
              </marker>
            )}
            {element.startArrowhead === "arrow" && (
              <marker id={`arrow-start-${element.id}`} markerWidth="12" markerHeight="8" refX="1" refY="4" orient="auto">
                <polygon points="12 0, 0 4, 12 8" fill={element.strokeColor} />
              </marker>
            )}
          </defs>
          <polyline
            points={element.points.map(p => `${p.x},${p.y}`).join(" ")}
            {...commonProps}
            fill="none"
            markerEnd={element.endArrowhead ? `url(#arrow-end-${element.id})` : undefined}
            markerStart={element.startArrowhead ? `url(#arrow-start-${element.id})` : undefined}
          />
        </>
      )}

      {element.type === "freedraw" && element.points && (
        <path
          d={smoothPath(element.points)}
          {...commonProps}
          fill="none"
        />
      )}

      {element.type === "text" && (
        <text
          x={element.width / 2}
          y={element.height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={element.fontSize || 20}
          fill={element.strokeColor}
          opacity={element.opacity / 100}
          style={{ pointerEvents: "auto", cursor: "pointer", fontFamily: "inherit" }}
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
        >
          {element.text || "Text"}
        </text>
      )}

      {/* Selection handles */}
      {isSelected && !element.locked && (
        <>
          {["nw", "ne", "sw", "se"].map((pos) => {
            const hx = pos.includes("e") ? element.width : 0;
            const hy = pos.includes("s") ? element.height : 0;
            return (
              <rect
                key={pos}
                x={hx - 4}
                y={hy - 4}
                width={8}
                height={8}
                fill="white"
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                rx={2}
                style={{ cursor: `${pos}-resize`, pointerEvents: "auto" }}
              />
            );
          })}
        </>
      )}
    </g>
  );
}

// ============================================================================
// Drawing Layer Component
// ============================================================================

export function DrawingLayer({
  elements,
  onChange,
  activeTool,
  viewport,
  strokeColor,
  backgroundColor,
  fillStyle,
  strokeWidth,
  strokeStyle,
  opacity,
  selectedElementId,
  onSelectElement,
}: DrawingLayerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; elemX: number; elemY: number } | null>(null);

  const isDrawingTool = [
    "draw-rect", "draw-ellipse", "draw-diamond",
    "draw-line", "draw-arrow", "draw-freedraw", "draw-text", "eraser",
  ].includes(activeTool);

  // Convert screen coordinates to canvas coordinates
  const toCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: (clientX - rect.left - viewport.x) / viewport.zoom,
      y: (clientY - rect.top - viewport.y) / viewport.zoom,
    };
  }, [viewport]);

  const createNewElement = useCallback((x: number, y: number): DrawingElement => {
    const typeMap: Record<string, DrawingElement["type"]> = {
      "draw-rect": "rectangle",
      "draw-ellipse": "ellipse",
      "draw-diamond": "diamond",
      "draw-line": "line",
      "draw-arrow": "arrow",
      "draw-freedraw": "freedraw",
      "draw-text": "text",
    };

    const type = typeMap[activeTool] || "rectangle";
    const isLinear = ["line", "arrow", "freedraw"].includes(type);

    return {
      id: `draw-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type,
      x,
      y,
      width: 0,
      height: 0,
      points: isLinear ? [{ x: 0, y: 0 }] : undefined,
      strokeColor,
      backgroundColor,
      fillStyle: fillStyle as DrawingElement["fillStyle"],
      strokeWidth,
      strokeStyle: strokeStyle as DrawingElement["strokeStyle"],
      opacity,
      roughness: 1,
      startArrowhead: null,
      endArrowhead: type === "arrow" ? "arrow" : null,
    };
  }, [activeTool, strokeColor, backgroundColor, fillStyle, strokeWidth, strokeStyle, opacity]);

  // Mouse/Touch handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!isDrawingTool) return;
    if (activeTool === "eraser") return;

    const pos = toCanvasCoords(e.clientX, e.clientY);
    const elem = createNewElement(pos.x, pos.y);
    setDrawStart(pos);
    setCurrentElement(elem);
    setIsDrawing(true);
    onSelectElement(null);
    e.stopPropagation();
    e.preventDefault();
  }, [isDrawingTool, activeTool, toCanvasCoords, createNewElement, onSelectElement]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawing || !currentElement || !drawStart) return;

    const pos = toCanvasCoords(e.clientX, e.clientY);
    const dx = pos.x - drawStart.x;
    const dy = pos.y - drawStart.y;

    if (currentElement.type === "freedraw") {
      setCurrentElement(prev => {
        if (!prev) return prev;
        const newPoints = [...(prev.points || []), { x: pos.x - prev.x, y: pos.y - prev.y }];
        return { ...prev, points: newPoints };
      });
    } else if (currentElement.type === "line" || currentElement.type === "arrow") {
      setCurrentElement(prev => {
        if (!prev) return prev;
        const endPoint = { x: pos.x - prev.x, y: pos.y - prev.y };
        return {
          ...prev,
          points: [{ x: 0, y: 0 }, endPoint],
          width: Math.abs(dx),
          height: Math.abs(dy),
        };
      });
    } else {
      // Rectangle, ellipse, diamond
      const newX = dx >= 0 ? drawStart.x : pos.x;
      const newY = dy >= 0 ? drawStart.y : pos.y;
      setCurrentElement(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          x: newX,
          y: newY,
          width: Math.abs(dx),
          height: Math.abs(dy),
        };
      });
    }

    e.stopPropagation();
    e.preventDefault();
  }, [isDrawing, currentElement, drawStart, toCanvasCoords]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDrawing || !currentElement) return;

    // Only add if it has meaningful size
    const minSize = currentElement.type === "freedraw" 
      ? (currentElement.points?.length || 0) > 2 
      : (currentElement.width > 5 || currentElement.height > 5);

    if (minSize) {
      // Calculate bounding box for freedraw
      let finalElement = { ...currentElement };
      if (finalElement.type === "freedraw" && finalElement.points) {
        const xs = finalElement.points.map(p => p.x);
        const ys = finalElement.points.map(p => p.y);
        finalElement.width = Math.max(...xs) - Math.min(...xs);
        finalElement.height = Math.max(...ys) - Math.min(...ys);
      }

      onChange([...elements, finalElement]);
      onSelectElement(finalElement.id);
    }

    setIsDrawing(false);
    setDrawStart(null);
    setCurrentElement(null);
    e.stopPropagation();
  }, [isDrawing, currentElement, elements, onChange, onSelectElement]);

  // Handle eraser clicks on elements
  const handleEraserClick = useCallback((elementId: string) => {
    if (activeTool === "eraser") {
      onChange(elements.filter(e => e.id !== elementId));
    }
  }, [activeTool, elements, onChange]);

  // Handle element selection and dragging
  const handleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    if (activeTool === "eraser") {
      handleEraserClick(elementId);
      return;
    }
    
    // Select the element
    onSelectElement(elementId);
    
    // Start drag if in select mode
    if (activeTool === "select" || !isDrawingTool) {
      const el = elements.find(elem => elem.id === elementId);
      if (el && !el.locked) {
        const pos = toCanvasCoords(e.clientX, e.clientY);
        setIsDragging(true);
        setDragStart({ x: pos.x, y: pos.y, elemX: el.x, elemY: el.y });
      }
    }
    e.stopPropagation();
  }, [activeTool, isDrawingTool, elements, onSelectElement, handleEraserClick, toCanvasCoords]);

  // Global mouse move/up for dragging
  useEffect(() => {
    if (!isDragging || !dragStart || !selectedElementId) return;

    const handleMove = (e: MouseEvent) => {
      const pos = toCanvasCoords(e.clientX, e.clientY);
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      onChange(elements.map(el =>
        el.id === selectedElementId
          ? { ...el, x: dragStart.elemX + dx, y: dragStart.elemY + dy }
          : el
      ));
    };

    const handleUp = () => {
      setIsDragging(false);
      setDragStart(null);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging, dragStart, selectedElementId, elements, onChange, toCanvasCoords]);

  // Delete selected element
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedElementId) {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        onChange(elements.filter(el => el.id !== selectedElementId));
        onSelectElement(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId, elements, onChange, onSelectElement]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full"
      style={{
        pointerEvents: isDrawingTool ? "auto" : "none",
        zIndex: isDrawingTool ? 10 : 5,
        cursor: activeTool === "eraser" ? "crosshair" : isDrawingTool ? "crosshair" : "default",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Transform group matching canvas viewport */}
      <g transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`}>
        {/* Existing elements */}
        {elements.map(element => (
          <g
            key={element.id}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
            style={{ pointerEvents: "auto" }}
          >
            <DrawingElementRenderer
              element={element}
              isSelected={element.id === selectedElementId}
              onSelect={() => {
                if (activeTool === "eraser") {
                  handleEraserClick(element.id);
                } else {
                  onSelectElement(element.id);
                }
              }}
            />
          </g>
        ))}

        {/* Currently drawing element (preview) */}
        {currentElement && (
          <DrawingElementRenderer
            element={currentElement}
            isSelected={false}
            onSelect={() => {}}
          />
        )}
      </g>
    </svg>
  );
}
