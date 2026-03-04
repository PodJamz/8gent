"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePerformanceMetrics } from "@/hooks/usePerformanceMetrics";
import { cn } from "@/lib/utils";

interface PerformanceWidgetProps {
  className?: string;
}

// Color thresholds for the gauge
const getScoreColor = (ms: number | null): string => {
  if (ms === null) return "text-neutral-400";
  if (ms < 1000) return "text-emerald-400";
  if (ms < 2000) return "text-emerald-300";
  if (ms < 3000) return "text-yellow-400";
  if (ms < 4000) return "text-orange-400";
  return "text-red-400";
};

const getStatusText = (ms: number | null): string => {
  if (ms === null) return "Measuring...";
  if (ms < 500) return "Blazing fast";
  if (ms < 1000) return "Very fast page loads";
  if (ms < 2000) return "Fast page loads";
  if (ms < 3000) return "Moderate speed";
  if (ms < 4000) return "Needs improvement";
  return "Slow page loads";
};

// Gauge component that mimics Derek Briggs' design
function PerformanceGauge({ value, maxValue = 5000 }: { value: number | null; maxValue?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 280;
    const height = 80;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Gauge dimensions
    const centerX = width / 2;
    const centerY = height + 50; // Position below canvas for arc
    const radius = 140;
    const startAngle = Math.PI + 0.3; // Slightly past left
    const endAngle = 2 * Math.PI - 0.3; // Slightly before right

    // Draw tick marks
    const tickCount = 50;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= tickCount; i++) {
      const angle = startAngle + (i / tickCount) * (endAngle - startAngle);
      const innerRadius = radius - 8;
      const outerRadius = radius - (i % 10 === 0 ? 15 : 12);

      const x1 = centerX + Math.cos(angle) * innerRadius;
      const y1 = centerY + Math.sin(angle) * innerRadius;
      const x2 = centerX + Math.cos(angle) * outerRadius;
      const y2 = centerY + Math.sin(angle) * outerRadius;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw colored arc
    const arcWidth = 4;
    const arcRadius = radius - 4;

    // Create gradient segments (green -> yellow -> orange -> red)
    const segments = [
      { start: 0, end: 0.3, color: "#22c55e" }, // Green (0-1500ms)
      { start: 0.3, end: 0.5, color: "#84cc16" }, // Lime (1500-2500ms)
      { start: 0.5, end: 0.7, color: "#eab308" }, // Yellow (2500-3500ms)
      { start: 0.7, end: 0.85, color: "#f97316" }, // Orange (3500-4250ms)
      { start: 0.85, end: 1, color: "#ef4444" }, // Red (4250-5000ms)
    ];

    segments.forEach((segment) => {
      const segmentStart = startAngle + segment.start * (endAngle - startAngle);
      const segmentEnd = startAngle + segment.end * (endAngle - startAngle);

      ctx.beginPath();
      ctx.arc(centerX, centerY, arcRadius, segmentStart, segmentEnd);
      ctx.strokeStyle = segment.color;
      ctx.lineWidth = arcWidth;
      ctx.lineCap = "round";
      ctx.stroke();
    });

    // Draw labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "10px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";

    const labels = [
      { value: "10ms", position: 0.02 },
      { value: "20ms", position: 0.2 },
      { value: "30ms", position: 0.4 },
      { value: "40ms", position: 0.6 },
      { value: "50ms", position: 0.8 },
    ];

    // Scale labels for actual ms values
    const scaledLabels = [
      { value: "0", position: 0 },
      { value: "1s", position: 0.2 },
      { value: "2s", position: 0.4 },
      { value: "3s", position: 0.6 },
      { value: "4s", position: 0.8 },
      { value: "5s", position: 1 },
    ];

    scaledLabels.forEach((label) => {
      const angle = startAngle + label.position * (endAngle - startAngle);
      const labelRadius = radius - 25;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;
      ctx.fillText(label.value, x, y);
    });

    // Draw needle/indicator
    if (value !== null) {
      const normalizedValue = Math.min(value / maxValue, 1);
      const needleAngle = startAngle + normalizedValue * (endAngle - startAngle);
      const needleLength = radius - 20;

      // Needle glow
      ctx.shadowColor = "#22c55e";
      ctx.shadowBlur = 8;

      // Needle line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      const needleX = centerX + Math.cos(needleAngle) * needleLength;
      const needleY = centerY + Math.sin(needleAngle) * needleLength;
      ctx.lineTo(needleX, needleY);

      // Color based on value
      let needleColor = "#22c55e";
      if (normalizedValue > 0.7) needleColor = "#ef4444";
      else if (normalizedValue > 0.5) needleColor = "#f97316";
      else if (normalizedValue > 0.3) needleColor = "#eab308";

      ctx.strokeStyle = needleColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Needle dot
      ctx.beginPath();
      ctx.arc(needleX, needleY, 4, 0, Math.PI * 2);
      ctx.fillStyle = needleColor;
      ctx.fill();

      ctx.shadowBlur = 0;
    }
  }, [value, maxValue]);

  return <canvas ref={canvasRef} className="w-[280px] h-[80px]" />;
}

export function PerformanceWidget({ className }: PerformanceWidgetProps) {
  const { metrics, isSupported } = usePerformanceMetrics();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const widgetRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded &&
        widgetRef.current &&
        expandedRef.current &&
        !widgetRef.current.contains(event.target as Node) &&
        !expandedRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  if (!isSupported || !isVisible) return null;

  const primaryMs = metrics.primaryMetric;
  const displayMs = primaryMs !== null ? Math.round(primaryMs) : null;

  return (
    <>
      {/* Compact Widget (Status Bar Style) - Icon only */}
      <div
        ref={widgetRef}
        onClick={handleToggle}
        onKeyDown={(e) => e.key === "Enter" && handleToggle()}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-label={`Performance: ${displayMs !== null ? `${displayMs}ms` : "measuring"}. Click to expand.`}
        className={cn(
          "fixed top-4 right-4 z-[9999]",
          "flex items-center justify-center w-7 h-7",
          "bg-neutral-900/90 backdrop-blur-xl",
          "border border-neutral-700/50 rounded-full",
          "cursor-pointer select-none",
          "transition-all duration-300 ease-out",
          "hover:bg-neutral-800/90 hover:border-neutral-600/50 hover:scale-110",
          "focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
          "shadow-lg shadow-black/20",
          isExpanded && "opacity-0 pointer-events-none scale-95",
          className
        )}
      >
        {/* Performance indicator dot */}
        <div
          className={cn(
            "w-2.5 h-2.5 rounded-full",
            "transition-colors duration-300",
            metrics.overallScore === "fast" && "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]",
            metrics.overallScore === "moderate" && "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]",
            metrics.overallScore === "slow" && "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]",
            displayMs === null && "bg-neutral-400 animate-pulse"
          )}
        />
      </div>

      {/* Expanded Panel (Dynamic Island Style) */}
      <div
        ref={expandedRef}
        className={cn(
          "fixed top-3 right-3 z-[9999]",
          "w-[320px]",
          "bg-[#0a1f0a] backdrop-blur-2xl",
          "border border-neutral-700/30 rounded-3xl",
          "overflow-hidden",
          "shadow-2xl shadow-black/50",
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "transform-gpu",
          isExpanded
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 -translate-y-2 pointer-events-none"
        )}
        style={{
          background: "linear-gradient(145deg, #0d1f0d 0%, #0a0f0a 50%, #050805 100%)",
        }}
      >
        {/* Header with close hint */}
        <div className="flex justify-between items-center px-4 pt-4 pb-2">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
            Page Performance
          </span>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-neutral-500 hover:text-neutral-300 transition-colors p-1"
            aria-label="Close performance panel"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main metric display */}
        <div className="text-center px-4 pb-2">
          <div className="flex items-baseline justify-center gap-1">
            <span
              className={cn(
                "text-5xl font-light tabular-nums tracking-tight",
                "transition-colors duration-300",
                getScoreColor(displayMs)
              )}
            >
              {displayMs !== null ? displayMs : "--"}
            </span>
            <span className="text-xl text-neutral-400 font-light">ms</span>
          </div>
          <p
            className={cn(
              "text-sm font-medium mt-1",
              "transition-colors duration-300",
              getScoreColor(displayMs)
            )}
          >
            {getStatusText(displayMs)}
          </p>
        </div>

        {/* Gauge */}
        <div className="flex justify-center px-4 -mt-2 overflow-hidden h-[80px]">
          <PerformanceGauge value={displayMs} maxValue={5000} />
        </div>

        {/* Detailed metrics grid */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-4 pt-2">
          <MetricItem
            label="TTFB"
            value={metrics.ttfb}
            unit="ms"
            tooltip="Time to First Byte"
          />
          <MetricItem
            label="FCP"
            value={metrics.fcp}
            unit="ms"
            tooltip="First Contentful Paint"
          />
          <MetricItem
            label="LCP"
            value={metrics.lcp}
            unit="ms"
            tooltip="Largest Contentful Paint"
          />
          <MetricItem
            label="CLS"
            value={metrics.cls !== null ? metrics.cls : null}
            unit=""
            tooltip="Cumulative Layout Shift"
            decimals={3}
          />
          <MetricItem
            label="Resources"
            value={metrics.resourceCount}
            unit=""
            tooltip="Number of resources loaded"
          />
          <MetricItem
            label="Transfer"
            value={metrics.transferSize}
            unit="KB"
            tooltip="Total transfer size"
          />
        </div>

        {/* Footer with hide option */}
        <div className="border-t border-neutral-800/50 px-4 py-2 flex justify-between items-center">
          <span className="text-[10px] text-neutral-600">Core Web Vitals</span>
          <button
            onClick={() => {
              setIsVisible(false);
              setIsExpanded(false);
            }}
            className="text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Hide widget
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[2px] transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

// Individual metric display component
function MetricItem({
  label,
  value,
  unit,
  tooltip,
  decimals = 0,
}: {
  label: string;
  value: number | null;
  unit: string;
  tooltip: string;
  decimals?: number;
}) {
  const displayValue = value !== null ? value.toFixed(decimals) : "--";
  const color = getScoreColor(value);

  return (
    <div
      className="text-center p-2 rounded-xl bg-neutral-900/30 border border-neutral-800/30"
      title={tooltip}
    >
      <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className={cn("text-sm font-medium tabular-nums", color)}>
        {displayValue}
        {value !== null && unit && (
          <span className="text-neutral-500 text-xs ml-0.5">{unit}</span>
        )}
      </div>
    </div>
  );
}

export default PerformanceWidget;
