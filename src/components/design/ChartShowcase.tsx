'use client';

import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================
interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartShowcaseProps {
  variant: 'line' | 'area' | 'bar' | 'gauge' | 'stacked-bar';
  title?: string;
  subtitle?: string;
  data?: DataPoint[];
  showLegend?: boolean;
  animated?: boolean;
}

// ============================================================================
// Sample Data Sets
// ============================================================================
const sampleData = {
  deployments: [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 19 },
    { label: 'Wed', value: 8 },
    { label: 'Thu', value: 24 },
    { label: 'Fri', value: 31 },
    { label: 'Sat', value: 18 },
    { label: 'Sun', value: 15 },
  ],
  focus: [
    { label: '6am', value: 0 },
    { label: '8am', value: 45 },
    { label: '10am', value: 90 },
    { label: '12pm', value: 60 },
    { label: '2pm', value: 85 },
    { label: '4pm', value: 70 },
    { label: '6pm', value: 30 },
  ],
  tasks: [
    { label: 'Backlog', value: 12, color: 'hsl(var(--theme-muted-foreground))' },
    { label: 'In Progress', value: 8, color: 'hsl(var(--theme-primary))' },
    { label: 'Review', value: 5, color: 'hsl(var(--theme-secondary-foreground))' },
    { label: 'Done', value: 24, color: 'hsl(142 76% 36%)' },
  ],
  audit: [
    { label: 'Typography', value: 85 },
    { label: 'Spacing', value: 92 },
    { label: 'Hierarchy', value: 78 },
    { label: 'Color', value: 88 },
  ],
  revenue: [
    { label: 'Q1', value: 42 },
    { label: 'Q2', value: 58 },
    { label: 'Q3', value: 71 },
    { label: 'Q4', value: 89 },
  ],
};

// ============================================================================
// Interactive Line Chart (bklit-ui inspired)
// ============================================================================
function InteractiveLineChart({
  data,
  animated = true,
  animationKey = 0,
}: {
  data: DataPoint[];
  animated?: boolean;
  animationKey?: number;
}) {
  const width = 320;
  const height = 180;
  const padding = { top: 24, right: 24, bottom: 36, left: 24 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const valueRange = maxValue - minValue || 1;

  const points = useMemo(() => data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + (1 - (d.value - minValue) / valueRange) * chartHeight,
    ...d,
  })), [data, chartWidth, chartHeight, minValue, valueRange]);

  // Create smooth curved path
  const createSmoothPath = useCallback(() => {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
  }, [points]);

  const linePath = createSmoothPath();

  // Area path for gradient fill
  const areaPath = useMemo(() => {
    if (!linePath) return '';
    return `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;
  }, [linePath, points, height, padding.bottom]);

  // Handle mouse interaction
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setMouseX(x);

    // Find closest point
    let closestIndex = 0;
    let closestDistance = Infinity;
    points.forEach((p, i) => {
      const distance = Math.abs(p.x - x);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });
    setHoverIndex(closestIndex);
  }, [points]);

  const handleMouseLeave = useCallback(() => {
    setHoverIndex(null);
    setMouseX(null);
  }, []);

  // Spring animation for crosshair
  const springX = useSpring(mouseX || 0, { stiffness: 300, damping: 30 });

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="overflow-visible cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        {/* Gradient for area fill */}
        <linearGradient id={`areaGradient-${animationKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--theme-primary))" stopOpacity={0.25} />
          <stop offset="100%" stopColor="hsl(var(--theme-primary))" stopOpacity={0.02} />
        </linearGradient>

        {/* Edge fade masks */}
        <linearGradient id={`leftFade-${animationKey}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity={0} />
          <stop offset="100%" stopColor="white" stopOpacity={1} />
        </linearGradient>
        <linearGradient id={`rightFade-${animationKey}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity={1} />
          <stop offset="100%" stopColor="white" stopOpacity={0} />
        </linearGradient>

        <mask id={`edgeMask-${animationKey}`}>
          <rect x={padding.left} y={0} width={20} height={height} fill={`url(#leftFade-${animationKey})`} />
          <rect x={padding.left + 20} y={0} width={chartWidth - 40} height={height} fill="white" />
          <rect x={width - padding.right - 20} y={0} width={20} height={height} fill={`url(#rightFade-${animationKey})`} />
        </mask>

        {/* Clip path for line animation */}
        <clipPath id={`lineClip-${animationKey}`}>
          <motion.rect
            x={padding.left}
            y={0}
            height={height}
            initial={animated ? { width: 0 } : { width: chartWidth }}
            animate={{ width: chartWidth }}
            transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
            key={animationKey}
          />
        </clipPath>
      </defs>

      {/* Grid lines */}
      {[0, 0.5, 1].map((ratio, i) => (
        <line
          key={i}
          x1={padding.left}
          x2={width - padding.right}
          y1={padding.top + ratio * chartHeight}
          y2={padding.top + ratio * chartHeight}
          stroke="hsl(var(--theme-border))"
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.5}
        />
      ))}

      {/* Area fill */}
      <motion.path
        d={areaPath}
        fill={`url(#areaGradient-${animationKey})`}
        mask={`url(#edgeMask-${animationKey})`}
        clipPath={`url(#lineClip-${animationKey})`}
        initial={animated ? { opacity: 0 } : undefined}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        key={`area-${animationKey}`}
      />

      {/* Main line */}
      <motion.path
        d={linePath}
        fill="none"
        stroke="hsl(var(--theme-primary))"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath={`url(#lineClip-${animationKey})`}
        key={`line-${animationKey}`}
      />

      {/* X-axis labels with fade on hover */}
      {points.map((p, i) => {
        const isNearCrosshair = hoverIndex !== null && Math.abs(i - hoverIndex) <= 1;
        return (
          <motion.text
            key={i}
            x={p.x}
            y={height - 10}
            textAnchor="middle"
            fontSize={10}
            fill="hsl(var(--theme-muted-foreground))"
            initial={animated ? { opacity: 0, y: 10 } : undefined}
            animate={{
              opacity: isNearCrosshair && hoverIndex !== i ? 0 : 1,
              y: 0,
            }}
            transition={{
              opacity: { duration: 0.15 },
              y: { delay: 0.1 * i + 1, duration: 0.3 }
            }}
          >
            {p.label}
          </motion.text>
        );
      })}

      {/* Interactive crosshair */}
      <AnimatePresence>
        {hoverIndex !== null && mouseX !== null && (
          <>
            {/* Vertical line */}
            <motion.line
              x1={points[hoverIndex].x}
              x2={points[hoverIndex].x}
              y1={padding.top}
              y2={height - padding.bottom}
              stroke="hsl(var(--theme-primary))"
              strokeWidth={1}
              strokeDasharray="4 4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />

            {/* Highlight point */}
            <motion.circle
              cx={points[hoverIndex].x}
              cy={points[hoverIndex].y}
              r={6}
              fill="hsl(var(--theme-background))"
              stroke="hsl(var(--theme-primary))"
              strokeWidth={2.5}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            />

            {/* Tooltip */}
            <motion.g
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              <rect
                x={points[hoverIndex].x - 28}
                y={points[hoverIndex].y - 32}
                width={56}
                height={24}
                rx={6}
                fill="hsl(var(--theme-foreground))"
              />
              <text
                x={points[hoverIndex].x}
                y={points[hoverIndex].y - 16}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill="hsl(var(--theme-background))"
              >
                {points[hoverIndex].value}
              </text>
            </motion.g>
          </>
        )}
      </AnimatePresence>

      {/* Static data points (appear after animation) */}
      {points.map((p, i) => (
        <motion.circle
          key={`point-${i}-${animationKey}`}
          cx={p.x}
          cy={p.y}
          r={hoverIndex === i ? 0 : 4}
          fill="hsl(var(--theme-background))"
          stroke="hsl(var(--theme-primary))"
          strokeWidth={2}
          initial={animated ? { scale: 0 } : undefined}
          animate={{ scale: hoverIndex === i ? 0 : 1 }}
          transition={{
            delay: animated ? 0.08 * i + 1.2 : 0,
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        />
      ))}
    </svg>
  );
}

// ============================================================================
// Interactive Area Chart
// ============================================================================
function InteractiveAreaChart({
  data,
  animated = true,
  animationKey = 0,
}: {
  data: DataPoint[];
  animated?: boolean;
  animationKey?: number;
}) {
  const width = 320;
  const height = 180;
  const padding = { top: 24, right: 24, bottom: 36, left: 24 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const maxValue = Math.max(...data.map(d => d.value));

  const points = useMemo(() => data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + (1 - d.value / maxValue) * chartHeight,
    ...d,
  })), [data, chartWidth, chartHeight, maxValue]);

  // Create smooth curved path
  const createSmoothPath = useCallback(() => {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
  }, [points]);

  const linePath = createSmoothPath();
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;

    let closestIndex = 0;
    let closestDistance = Infinity;
    points.forEach((p, i) => {
      const distance = Math.abs(p.x - x);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });
    setHoverIndex(closestIndex);
  }, [points]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="overflow-visible cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIndex(null)}
    >
      <defs>
        <linearGradient id={`focusGradient-${animationKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--theme-primary))" stopOpacity={0.4} />
          <stop offset="100%" stopColor="hsl(var(--theme-primary))" stopOpacity={0.02} />
        </linearGradient>

        <clipPath id={`areaClip-${animationKey}`}>
          <motion.rect
            x={padding.left}
            y={0}
            height={height}
            initial={animated ? { width: 0 } : { width: chartWidth }}
            animate={{ width: chartWidth }}
            transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
            key={animationKey}
          />
        </clipPath>
      </defs>

      {/* Grid */}
      {[0, 0.5, 1].map((ratio, i) => (
        <line
          key={i}
          x1={padding.left}
          x2={width - padding.right}
          y1={padding.top + ratio * chartHeight}
          y2={padding.top + ratio * chartHeight}
          stroke="hsl(var(--theme-border))"
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.4}
        />
      ))}

      {/* Area */}
      <motion.path
        d={areaPath}
        fill={`url(#focusGradient-${animationKey})`}
        clipPath={`url(#areaClip-${animationKey})`}
        key={`area-${animationKey}`}
      />

      {/* Line */}
      <motion.path
        d={linePath}
        fill="none"
        stroke="hsl(var(--theme-primary))"
        strokeWidth={2.5}
        strokeLinecap="round"
        clipPath={`url(#areaClip-${animationKey})`}
        key={`line-${animationKey}`}
      />

      {/* X-axis labels */}
      {points.map((p, i) => (
        <motion.text
          key={i}
          x={p.x}
          y={height - 10}
          textAnchor="middle"
          fontSize={10}
          fill="hsl(var(--theme-muted-foreground))"
          animate={{
            opacity: hoverIndex !== null && hoverIndex !== i && Math.abs(i - hoverIndex) <= 1 ? 0.3 : 1
          }}
          transition={{ duration: 0.15 }}
        >
          {p.label}
        </motion.text>
      ))}

      {/* Hover effects */}
      <AnimatePresence>
        {hoverIndex !== null && (
          <>
            <motion.line
              x1={points[hoverIndex].x}
              x2={points[hoverIndex].x}
              y1={padding.top}
              y2={height - padding.bottom}
              stroke="hsl(var(--theme-primary))"
              strokeWidth={1}
              strokeDasharray="4 4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            />
            <motion.circle
              cx={points[hoverIndex].x}
              cy={points[hoverIndex].y}
              r={6}
              fill="hsl(var(--theme-background))"
              stroke="hsl(var(--theme-primary))"
              strokeWidth={2.5}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            />
            <motion.g
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <rect
                x={points[hoverIndex].x - 32}
                y={points[hoverIndex].y - 34}
                width={64}
                height={26}
                rx={6}
                fill="hsl(var(--theme-foreground))"
              />
              <text
                x={points[hoverIndex].x}
                y={points[hoverIndex].y - 17}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="hsl(var(--theme-background))"
              >
                {points[hoverIndex].value} min
              </text>
            </motion.g>
          </>
        )}
      </AnimatePresence>
    </svg>
  );
}

// ============================================================================
// Interactive Bar Chart
// ============================================================================
function InteractiveBarChart({
  data,
  animated = true,
  animationKey = 0,
}: {
  data: DataPoint[];
  animated?: boolean;
  animationKey?: number;
}) {
  const width = 320;
  const height = 180;
  const padding = { top: 24, right: 24, bottom: 36, left: 50 };
  const barPadding = 12;

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = (width - padding.left - padding.right - barPadding * (data.length - 1)) / data.length;
  const chartHeight = height - padding.top - padding.bottom;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Grid lines */}
      {[0, 0.5, 1].map((ratio, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + ratio * chartHeight}
            y2={padding.top + ratio * chartHeight}
            stroke="hsl(var(--theme-border))"
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.4}
          />
          <text
            x={padding.left - 8}
            y={padding.top + ratio * chartHeight + 4}
            textAnchor="end"
            fontSize={10}
            fill="hsl(var(--theme-muted-foreground))"
          >
            {Math.round(maxValue * (1 - ratio))}
          </text>
        </g>
      ))}

      {/* Bars */}
      {data.map((d, i) => {
        const barHeight = (d.value / maxValue) * chartHeight;
        const x = padding.left + i * (barWidth + barPadding);
        const y = height - padding.bottom - barHeight;
        const isHovered = hoverIndex === i;

        return (
          <g
            key={`bar-${i}-${animationKey}`}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
            className="cursor-pointer"
          >
            {/* Bar */}
            <motion.rect
              x={x}
              y={height - padding.bottom}
              width={barWidth}
              height={0}
              rx={4}
              fill={d.color || 'hsl(var(--theme-primary))'}
              initial={animated ? { height: 0, y: height - padding.bottom } : undefined}
              animate={{
                height: barHeight,
                y: y,
                opacity: hoverIndex !== null && !isHovered ? 0.5 : 1,
              }}
              whileHover={{ scale: 1.02 }}
              transition={{
                height: { delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                y: { delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.15 },
                scale: { duration: 0.2 },
              }}
            />

            {/* Value label on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.g
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                >
                  <rect
                    x={x + barWidth / 2 - 20}
                    y={y - 28}
                    width={40}
                    height={22}
                    rx={4}
                    fill="hsl(var(--theme-foreground))"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 13}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={600}
                    fill="hsl(var(--theme-background))"
                  >
                    {d.value}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>

            {/* X-axis label */}
            <text
              x={x + barWidth / 2}
              y={height - 10}
              textAnchor="middle"
              fontSize={10}
              fill="hsl(var(--theme-muted-foreground))"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================================
// Animated Gauge Chart
// ============================================================================
function AnimatedGaugeChart({
  data,
  animated = true,
  animationKey = 0,
}: {
  data: DataPoint[];
  animated?: boolean;
  animationKey?: number;
}) {
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const avgScore = Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length);
  const [displayScore, setDisplayScore] = useState(0);

  // Animate the score number
  useEffect(() => {
    if (!animated) {
      setDisplayScore(avgScore);
      return;
    }
    setDisplayScore(0);
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplayScore(Math.round(eased * avgScore));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timeout = setTimeout(() => requestAnimationFrame(animate), 300);
    return () => clearTimeout(timeout);
  }, [avgScore, animated, animationKey]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--theme-border))"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />
          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--theme-primary))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animated ? { strokeDashoffset: circumference } : undefined}
            animate={{ strokeDashoffset: circumference * (1 - avgScore / 100) }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
            key={animationKey}
          />
        </svg>

        {/* Score in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-bold tabular-nums"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            {displayScore}
          </span>
          <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            avg score
          </span>
        </div>
      </div>

      {/* Individual metrics */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
        {data.map((d, i) => (
          <motion.div
            key={`metric-${i}-${animationKey}`}
            className="flex items-center justify-between px-3 py-2 rounded-lg"
            style={{ backgroundColor: 'hsl(var(--theme-muted))' }}
            initial={animated ? { opacity: 0, x: -10 } : undefined}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
          >
            <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              {d.label}
            </span>
            <span className="text-xs font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>
              {d.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Animated Stacked Bar Chart
// ============================================================================
function AnimatedStackedBarChart({
  data,
  animated = true,
  animationKey = 0,
}: {
  data: DataPoint[];
  animated?: boolean;
  animationKey?: number;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const width = 320;
  const barHeight = 36;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  let cumulative = 0;
  const segments = data.map((d, i) => {
    const segmentWidth = (d.value / total) * width;
    const x = cumulative;
    cumulative += segmentWidth;
    return { ...d, x, segmentWidth, index: i };
  });

  return (
    <div className="space-y-5">
      <svg width={width} height={barHeight} className="overflow-visible rounded-xl">
        <defs>
          <clipPath id={`stackedClip-${animationKey}`}>
            <rect x={0} y={0} width={width} height={barHeight} rx={10} />
          </clipPath>
        </defs>

        <g clipPath={`url(#stackedClip-${animationKey})`}>
          {segments.map((seg, i) => (
            <motion.rect
              key={`seg-${i}-${animationKey}`}
              x={seg.x}
              y={0}
              width={seg.segmentWidth}
              height={barHeight}
              fill={seg.color || 'hsl(var(--theme-primary))'}
              initial={animated ? { scaleX: 0, opacity: 0 } : undefined}
              animate={{
                scaleX: 1,
                opacity: hoverIndex !== null && hoverIndex !== i ? 0.5 : 1,
              }}
              transition={{
                scaleX: { delay: i * 0.15, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.15 },
              }}
              style={{ originX: 0 }}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              className="cursor-pointer"
            />
          ))}
        </g>

        {/* Hover tooltip */}
        <AnimatePresence>
          {hoverIndex !== null && (
            <motion.g
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <rect
                x={segments[hoverIndex].x + segments[hoverIndex].segmentWidth / 2 - 30}
                y={-30}
                width={60}
                height={24}
                rx={6}
                fill="hsl(var(--theme-foreground))"
              />
              <text
                x={segments[hoverIndex].x + segments[hoverIndex].segmentWidth / 2}
                y={-14}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="hsl(var(--theme-background))"
              >
                {segments[hoverIndex].value} tasks
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {data.map((d, i) => (
          <motion.div
            key={`legend-${i}-${animationKey}`}
            className="flex items-center gap-2 cursor-pointer"
            initial={animated ? { opacity: 0 } : undefined}
            animate={{
              opacity: hoverIndex !== null && hoverIndex !== i ? 0.5 : 1
            }}
            transition={{ delay: animated ? 0.6 + i * 0.1 : 0, duration: 0.2 }}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: d.color || 'hsl(var(--theme-primary))' }}
            />
            <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              {d.label}
            </span>
            <span className="text-xs font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>
              {d.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main ChartShowcase Component
// ============================================================================
export function ChartShowcase({
  variant,
  title,
  subtitle,
  data,
  animated = true,
}: ChartShowcaseProps) {
  const [animationKey, setAnimationKey] = useState(0);

  const chartData = useMemo(() => {
    if (data) return data;
    switch (variant) {
      case 'line': return sampleData.deployments;
      case 'area': return sampleData.focus;
      case 'bar': return sampleData.revenue;
      case 'gauge': return sampleData.audit;
      case 'stacked-bar': return sampleData.tasks;
      default: return sampleData.deployments;
    }
  }, [variant, data]);

  const defaultTitles: Record<string, { title: string; subtitle: string }> = {
    line: { title: 'Deployments', subtitle: 'Successful builds this week' },
    area: { title: 'Focus Sessions', subtitle: 'Minutes of deep work today' },
    bar: { title: 'Revenue', subtitle: 'Quarterly performance' },
    gauge: { title: 'Design Score', subtitle: 'Audit results across categories' },
    'stacked-bar': { title: 'Task Distribution', subtitle: 'Current sprint status' },
  };

  const displayTitle = title || defaultTitles[variant]?.title || 'Chart';
  const displaySubtitle = subtitle || defaultTitles[variant]?.subtitle || '';

  const handleReplay = () => {
    setAnimationKey(k => k + 1);
  };

  return (
    <div
      className="p-6 rounded-xl border relative group"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
      }}
    >
      {/* Header with replay button */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            {displayTitle}
          </h3>
          {displaySubtitle && (
            <p
              className="text-xs mt-1"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {displaySubtitle}
            </p>
          )}
        </div>

        {/* Replay button */}
        <motion.button
          onClick={handleReplay}
          className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            backgroundColor: 'hsl(var(--theme-muted))',
            color: 'hsl(var(--theme-muted-foreground))',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, rotate: -180 }}
          title="Replay animation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      <div className="flex justify-center">
        {variant === 'line' && <InteractiveLineChart data={chartData} animated={animated} animationKey={animationKey} />}
        {variant === 'area' && <InteractiveAreaChart data={chartData} animated={animated} animationKey={animationKey} />}
        {variant === 'bar' && <InteractiveBarChart data={chartData} animated={animated} animationKey={animationKey} />}
        {variant === 'gauge' && <AnimatedGaugeChart data={chartData} animated={animated} animationKey={animationKey} />}
        {variant === 'stacked-bar' && <AnimatedStackedBarChart data={chartData} animated={animated} animationKey={animationKey} />}
      </div>
    </div>
  );
}

// ============================================================================
// Pre-configured exports for specific themes
// ============================================================================
export function VercelChart() {
  return (
    <ChartShowcase
      variant="line"
      title="Ship Velocity"
      subtitle="Deployments per day this week"
      data={[
        { label: 'Mon', value: 8 },
        { label: 'Tue', value: 12 },
        { label: 'Wed', value: 6 },
        { label: 'Thu', value: 18 },
        { label: 'Fri', value: 24 },
        { label: 'Sat', value: 9 },
        { label: 'Sun', value: 5 },
      ]}
    />
  );
}

export function CaffeineChart() {
  return (
    <ChartShowcase
      variant="area"
      title="Focus Flow"
      subtitle="Deep work minutes throughout the day"
      data={[
        { label: '6am', value: 0 },
        { label: '8am', value: 45 },
        { label: '10am', value: 95 },
        { label: '12pm', value: 55 },
        { label: '2pm', value: 80 },
        { label: '4pm', value: 65 },
        { label: '6pm', value: 25 },
      ]}
    />
  );
}

export function UtilitarianChart() {
  return (
    <ChartShowcase
      variant="gauge"
      title="Design Audit"
      subtitle="Functional assessment scores"
      data={[
        { label: 'Typography', value: 88 },
        { label: 'Whitespace', value: 92 },
        { label: 'Hierarchy', value: 76 },
        { label: 'Alignment', value: 84 },
      ]}
    />
  );
}

export function NotionChart() {
  return (
    <ChartShowcase
      variant="stacked-bar"
      title="Sprint Progress"
      subtitle="Task distribution across workflow"
      data={[
        { label: 'Backlog', value: 14, color: 'hsl(var(--theme-muted-foreground))' },
        { label: 'In Progress', value: 6, color: 'hsl(217 91% 60%)' },
        { label: 'Review', value: 4, color: 'hsl(38 92% 50%)' },
        { label: 'Done', value: 22, color: 'hsl(142 71% 45%)' },
      ]}
    />
  );
}

export function MicrosoftChart() {
  return (
    <ChartShowcase
      variant="bar"
      title="Quarterly Performance"
      subtitle="Revenue by quarter (in millions)"
      data={[
        { label: 'Q1', value: 42, color: '#0078D4' },
        { label: 'Q2', value: 58, color: '#107C10' },
        { label: 'Q3', value: 71, color: '#FFB900' },
        { label: 'Q4', value: 89, color: '#D13438' },
      ]}
    />
  );
}

export function ResearchChart() {
  return (
    <ChartShowcase
      variant="line"
      title="Citation Trends"
      subtitle="Paper citations over time"
      data={[
        { label: '2019', value: 12 },
        { label: '2020', value: 28 },
        { label: '2021', value: 45 },
        { label: '2022', value: 67 },
        { label: '2023', value: 89 },
        { label: '2024', value: 124 },
      ]}
    />
  );
}
