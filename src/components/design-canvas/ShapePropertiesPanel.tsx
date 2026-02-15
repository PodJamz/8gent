"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  ChevronRight,
} from "lucide-react";
import type { DrawingElement } from "./DrawingLayer";

interface ShapePropertiesPanelProps {
  element: DrawingElement | null;
  onChange: (updates: Partial<DrawingElement>) => void;
  defaults: {
    strokeColor: string;
    backgroundColor: string;
    fillStyle: string;
    strokeWidth: number;
    strokeStyle: string;
    opacity: number;
  };
  onDefaultsChange: (updates: Partial<ShapePropertiesPanelProps["defaults"]>) => void;
  visible: boolean;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
}

const STROKE_COLORS = [
  "#1e1e1e", "#e03131", "#2f9e44", "#1971c2",
  "#f08c00", "#7048e8", "#0c8599", "#868e96",
];

const BG_COLORS = [
  "transparent", "#ffc9c9", "#b2f2bb", "#a5d8ff",
  "#ffec99", "#d0bfff", "#99e9f2", "#dee2e6",
  "#e03131", "#2f9e44", "#1971c2", "#f08c00",
];

const FILL_STYLES: { id: DrawingElement["fillStyle"]; label: string }[] = [
  { id: "none", label: "None" },
  { id: "solid", label: "Solid" },
  { id: "hachure", label: "Hachure" },
  { id: "cross-hatch", label: "Cross" },
];

const STROKE_WIDTHS = [1, 2, 4, 6];

const STROKE_STYLES: { id: DrawingElement["strokeStyle"]; label: string; pattern: string }[] = [
  { id: "solid", label: "Solid", pattern: "" },
  { id: "dashed", label: "Dashed", pattern: "8,4" },
  { id: "dotted", label: "Dotted", pattern: "2,4" },
];

export function ShapePropertiesPanel({
  element,
  onChange,
  defaults,
  onDefaultsChange,
  visible,
  onDelete,
  onDuplicate,
  onBringToFront,
  onSendToBack,
}: ShapePropertiesPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showCustomStroke, setShowCustomStroke] = useState(false);
  const [showCustomBg, setShowCustomBg] = useState(false);

  if (!visible) return null;

  const currentStroke = element?.strokeColor || defaults.strokeColor;
  const currentBg = element?.backgroundColor || defaults.backgroundColor;
  const currentFillStyle = (element?.fillStyle || defaults.fillStyle) as DrawingElement["fillStyle"];
  const currentStrokeWidth = element?.strokeWidth || defaults.strokeWidth;
  const currentStrokeStyle = (element?.strokeStyle || defaults.strokeStyle) as DrawingElement["strokeStyle"];
  const currentOpacity = element?.opacity ?? defaults.opacity;

  const updateValue = (key: string, value: unknown) => {
    if (element) {
      onChange({ [key]: value } as Partial<DrawingElement>);
    } else {
      onDefaultsChange({ [key]: value } as Partial<typeof defaults>);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className={cn(
          "absolute right-4 top-20 z-40",
          "w-56 bg-background/95 backdrop-blur-md rounded-xl border shadow-xl",
          "overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {element ? element.type : "Defaults"}
          </span>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-muted transition-colors"
            aria-label={collapsed ? "Expand panel" : "Collapse panel"}
          >
            <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", !collapsed && "rotate-90")} />
          </button>
        </div>

        {!collapsed && (
          <div className="p-3 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Stroke Color */}
            <Section label="Stroke">
              <div className="flex flex-wrap gap-1.5">
                {STROKE_COLORS.map((color) => (
                  <button
                    key={color}
                    aria-label={`Stroke color ${color}`}
                    onClick={() => updateValue("strokeColor", color)}
                    className={cn(
                      "w-6 h-6 rounded-md border-2 transition-transform hover:scale-110",
                      currentStroke === color ? "border-primary scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <button
                  onClick={() => setShowCustomStroke(!showCustomStroke)}
                  className="w-6 h-6 rounded-md border border-dashed border-muted-foreground/40 flex items-center justify-center text-xs hover:bg-muted transition-colors"
                  aria-label="Custom stroke color"
                >
                  +
                </button>
              </div>
              {showCustomStroke && (
                <input
                  type="color"
                  value={currentStroke}
                  onChange={(e) => updateValue("strokeColor", e.target.value)}
                  className="w-full h-7 rounded cursor-pointer mt-1"
                />
              )}
            </Section>

            {/* Background Color */}
            <Section label="Background">
              <div className="flex flex-wrap gap-1.5">
                {BG_COLORS.map((color) => (
                  <button
                    key={color}
                    aria-label={`Background color ${color === "transparent" ? "transparent" : color}`}
                    onClick={() => updateValue("backgroundColor", color)}
                    className={cn(
                      "w-6 h-6 rounded-md border-2 transition-transform hover:scale-110",
                      currentBg === color ? "border-primary scale-110" : "border-transparent",
                      color === "transparent" && "bg-[url('data:image/svg+xml,%3Csvg%20width%3D%228%22%20height%3D%228%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%224%22%20height%3D%224%22%20fill%3D%22%23ccc%22%2F%3E%3Crect%20x%3D%224%22%20y%3D%224%22%20width%3D%224%22%20height%3D%224%22%20fill%3D%22%23ccc%22%2F%3E%3C%2Fsvg%3E')]"
                    )}
                    style={color !== "transparent" ? { backgroundColor: color } : undefined}
                  />
                ))}
                <button
                  onClick={() => setShowCustomBg(!showCustomBg)}
                  className="w-6 h-6 rounded-md border border-dashed border-muted-foreground/40 flex items-center justify-center text-xs hover:bg-muted transition-colors"
                  aria-label="Custom background color"
                >
                  +
                </button>
              </div>
              {showCustomBg && (
                <input
                  type="color"
                  value={currentBg === "transparent" ? "#ffffff" : currentBg}
                  onChange={(e) => updateValue("backgroundColor", e.target.value)}
                  className="w-full h-7 rounded cursor-pointer mt-1"
                />
              )}
            </Section>

            {/* Fill Style */}
            <Section label="Fill">
              <div className="flex gap-1">
                {FILL_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateValue("fillStyle", style.id)}
                    className={cn(
                      "flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-colors",
                      currentFillStyle === style.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </Section>

            {/* Stroke Width */}
            <Section label="Width">
              <div className="flex gap-1">
                {STROKE_WIDTHS.map((w) => (
                  <button
                    key={w}
                    onClick={() => updateValue("strokeWidth", w)}
                    className={cn(
                      "flex-1 py-1.5 rounded-md flex items-center justify-center transition-colors",
                      currentStrokeWidth === w
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <div
                      className="rounded-full"
                      style={{
                        width: `${Math.min(w * 3, 16)}px`,
                        height: `${Math.min(w * 3, 16)}px`,
                        backgroundColor: "currentColor",
                      }}
                    />
                  </button>
                ))}
              </div>
            </Section>

            {/* Stroke Style */}
            <Section label="Line">
              <div className="flex gap-1">
                {STROKE_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateValue("strokeStyle", style.id)}
                    className={cn(
                      "flex-1 py-2 rounded-md flex items-center justify-center transition-colors",
                      currentStrokeStyle === style.id
                        ? "bg-primary"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <svg width="28" height="4">
                      <line
                        x1="0" y1="2" x2="28" y2="2"
                        stroke={currentStrokeStyle === style.id ? "white" : "currentColor"}
                        strokeWidth="2"
                        strokeDasharray={style.pattern || undefined}
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </Section>

            {/* Opacity */}
            <Section label={`Opacity ${currentOpacity}%`}>
              <input
                type="range"
                min="0"
                max="100"
                value={currentOpacity}
                onChange={(e) => updateValue("opacity", parseInt(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
            </Section>

            {/* Roughness (only for drawing elements) */}
            {element && (
              <Section label={`Roughness ${element.roughness || 0}`}>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.5"
                  value={element.roughness || 0}
                  onChange={(e) => onChange({ roughness: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Smooth</span>
                  <span>Sketchy</span>
                </div>
              </Section>
            )}

            {/* Arrowheads (only for arrow type) */}
            {element?.type === "arrow" && (
              <Section label="Arrowheads">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Start</label>
                    <select
                      value={element.startArrowhead || "none"}
                      onChange={(e) => onChange({ startArrowhead: e.target.value === "none" ? null : e.target.value as DrawingElement["startArrowhead"] })}
                      className="w-full py-1 px-2 bg-muted rounded text-xs"
                    >
                      <option value="none">None</option>
                      <option value="arrow">Arrow</option>
                      <option value="dot">Dot</option>
                      <option value="bar">Bar</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">End</label>
                    <select
                      value={element.endArrowhead || "arrow"}
                      onChange={(e) => onChange({ endArrowhead: e.target.value === "none" ? null : e.target.value as DrawingElement["endArrowhead"] })}
                      className="w-full py-1 px-2 bg-muted rounded text-xs"
                    >
                      <option value="none">None</option>
                      <option value="arrow">Arrow</option>
                      <option value="dot">Dot</option>
                      <option value="bar">Bar</option>
                    </select>
                  </div>
                </div>
              </Section>
            )}

            {/* Actions (only for selected element) */}
            {element && (
              <div className="pt-2 border-t space-y-1.5">
                <div className="flex gap-1">
                  {onDuplicate && (
                    <button onClick={onDuplicate} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-xs transition-colors">
                      <Copy className="w-3 h-3" /> Duplicate
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={onDelete} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  )}
                </div>
                <div className="flex gap-1">
                  {onBringToFront && (
                    <button onClick={onBringToFront} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-xs transition-colors">
                      <ArrowUp className="w-3 h-3" /> Front
                    </button>
                  )}
                  {onSendToBack && (
                    <button onClick={onSendToBack} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-xs transition-colors">
                      <ArrowDown className="w-3 h-3" /> Back
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Section helper
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
