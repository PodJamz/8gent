"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MousePointer2,
  Hand,
  Pencil,
  Square,
  Circle,
  Type,
  StickyNote,
  Image,
  Spline,
  Eraser,
  GripVertical,
  Undo,
  Redo,
} from "lucide-react";

export type DrawingTool =
  | "select"
  | "pan"
  | "pen"
  | "rectangle"
  | "ellipse"
  | "text"
  | "sticky"
  | "image"
  | "connector"
  | "eraser";

interface FloatingToolDockProps {
  selectedTool: string;
  onToolChange: (tool: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const tools: Array<{
  id: DrawingTool;
  icon: typeof MousePointer2;
  label: string;
  shortcut?: string;
}> = [
  { id: "select", icon: MousePointer2, label: "Select", shortcut: "V" },
  { id: "pan", icon: Hand, label: "Pan", shortcut: "H" },
  { id: "pen", icon: Pencil, label: "Draw", shortcut: "P" },
  { id: "connector", icon: Spline, label: "Connect", shortcut: "L" },
  { id: "rectangle", icon: Square, label: "Rectangle", shortcut: "R" },
  { id: "ellipse", icon: Circle, label: "Ellipse", shortcut: "O" },
  { id: "text", icon: Type, label: "Text", shortcut: "T" },
  { id: "sticky", icon: StickyNote, label: "Sticky", shortcut: "S" },
  { id: "image", icon: Image, label: "Image", shortcut: "I" },
  { id: "eraser", icon: Eraser, label: "Eraser", shortcut: "E" },
];

export function FloatingToolDock({
  selectedTool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: FloatingToolDockProps) {
  // Draggable state
  const [position, setPosition] = useState({ x: 16, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragStartRef.current = {
      x: clientX,
      y: clientY,
      posX: position.x,
      posY: position.y,
    };

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const moveX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const deltaX = moveX - dragStartRef.current.x;
      const deltaY = moveY - dragStartRef.current.y;

      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 60, dragStartRef.current.posX + deltaX)),
        y: Math.max(0, Math.min(window.innerHeight - 400, dragStartRef.current.posY + deltaY)),
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);
  }, [position]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 40,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      <div className="bg-background/95 backdrop-blur-xl border rounded-2xl shadow-lg p-1.5 flex flex-col gap-1">
        {/* Drag handle */}
        <div
          className="w-10 h-6 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-muted transition-colors"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Main tools */}
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isSelected = selectedTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              className={cn(
                "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                "hover:bg-muted",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ""}`}
            >
              <Icon className="h-5 w-5" />
              {tool.shortcut && (
                <span className="absolute -right-0.5 -bottom-0.5 text-[8px] font-medium opacity-50">
                  {tool.shortcut}
                </span>
              )}
            </button>
          );
        })}

        {/* Undo/Redo section (if handlers provided) */}
        {(onUndo || onRedo) && (
          <>
            <div className="h-px bg-border my-1" />
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                "hover:bg-muted",
                !canUndo && "opacity-30 cursor-not-allowed"
              )}
              title="Undo (Cmd+Z)"
            >
              <Undo className="h-5 w-5" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                "hover:bg-muted",
                !canRedo && "opacity-30 cursor-not-allowed"
              )}
              title="Redo (Cmd+Shift+Z)"
            >
              <Redo className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
