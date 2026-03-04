'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { type WatchDNA, type HandStyle, type IndexStyle } from '@/lib/watch/theme-to-watch';
import {
  getTimeAngles,
  toRoman,
  getPositionOnCircle,
  formatDateWindow,
  WATCH_SIZES,
  type WatchSize,
  getHandDimensions,
} from '@/lib/watch/watch-utils';

interface WatchFaceProps {
  watchDNA: WatchDNA;
  size?: WatchSize | number;
  showCase?: boolean;
  interactive?: boolean;
  className?: string;
  timezone?: string;
}

export function WatchFace({
  watchDNA,
  size = 'md',
  showCase = true,
  interactive = true,
  className = '',
  timezone,
}: WatchFaceProps) {
  const [time, setTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);

  // Update time every 50ms for smooth seconds hand
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Get time for specific timezone if provided
  const displayTime = useMemo(() => {
    if (!timezone) return time;

    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      fractionalSecondDigits: 3,
      hour12: false,
    };

    try {
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const parts = formatter.formatToParts(time);

      const getPart = (type: string) => {
        const part = parts.find(p => p.type === type);
        return part ? parseInt(part.value, 10) : 0;
      };

      const tzDate = new Date(
        getPart('year'),
        getPart('month') - 1,
        getPart('day'),
        getPart('hour'),
        getPart('minute'),
        getPart('second'),
        time.getMilliseconds()
      );

      return tzDate;
    } catch {
      return time;
    }
  }, [time, timezone]);

  const angles = useMemo(() => getTimeAngles(displayTime), [displayTime]);
  const pixelSize = typeof size === 'number' ? size : WATCH_SIZES[size];

  // Determine if this is an iOS-style minimal watch or a tool watch
  const isMinimalStyle = watchDNA.style === 'minimal' || watchDNA.style === 'elegant';
  const isToolWatch = watchDNA.style === 'diver' || watchDNA.style === 'sporty';

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      whileHover={interactive ? { scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ filter: isHovered ? 'drop-shadow(0 8px 24px rgba(0,0,0,0.2))' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
      >
        <defs>
          {/* Gradients and filters */}
          <radialGradient id={`dial-gradient-${watchDNA.theme}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.05)" />
          </radialGradient>

          <filter id={`crystal-${watchDNA.theme}`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" result="blur" />
            <feOffset in="blur" dx="0" dy="1" result="shadow" />
            <feComposite in="SourceGraphic" in2="shadow" operator="over" />
          </filter>

          {/* Lume glow effect */}
          <filter id={`lume-glow-${watchDNA.theme}`}>
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Case - iOS squircle style for minimal, round for others */}
        {showCase && (
          <WatchCase
            watchDNA={watchDNA}
            isMinimal={isMinimalStyle}
            isHovered={isHovered}
          />
        )}

        {/* Main dial */}
        <Dial watchDNA={watchDNA} isMinimal={isMinimalStyle} />

        {/* Chapter ring / minute track */}
        {(watchDNA.hasChapterRing || isToolWatch) && (
          <ChapterRing watchDNA={watchDNA} />
        )}

        {/* Hour indices */}
        <Indices watchDNA={watchDNA} isMinimal={isMinimalStyle} />

        {/* Date window */}
        {watchDNA.hasDateWindow && (
          <DateWindow
            watchDNA={watchDNA}
            date={formatDateWindow(displayTime)}
          />
        )}

        {/* Hands */}
        <Hands
          watchDNA={watchDNA}
          angles={angles}
          isMinimal={isMinimalStyle}
        />

        {/* Center cap */}
        <circle
          cx="50"
          cy="50"
          r={isMinimalStyle ? 2.5 : 3}
          fill={watchDNA.handColor}
        />
        <circle
          cx="50"
          cy="50"
          r={isMinimalStyle ? 1.5 : 2}
          fill={watchDNA.secondsHandColor}
        />

        {/* Crystal reflection overlay */}
        {watchDNA.hasCrystalDome && (
          <ellipse
            cx="35"
            cy="35"
            rx="25"
            ry="20"
            fill={`url(#dial-gradient-${watchDNA.theme})`}
            opacity="0.3"
          />
        )}
      </svg>
    </motion.div>
  );
}

// Watch Case Component
function WatchCase({
  watchDNA,
  isMinimal,
  isHovered,
}: {
  watchDNA: WatchDNA;
  isMinimal: boolean;
  isHovered: boolean;
}) {
  if (isMinimal) {
    // iOS-style squircle case
    return (
      <>
        {/* Outer case shadow */}
        <rect
          x="4"
          y="5"
          width="92"
          height="92"
          rx="22"
          fill="rgba(0,0,0,0.1)"
        />
        {/* Case body */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="22"
          fill={watchDNA.bezelColor}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.5"
        />
        {/* Inner bezel */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="20"
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="0.5"
        />
      </>
    );
  }

  // Round case for tool watches
  return (
    <>
      {/* Case shadow */}
      <circle
        cx="50"
        cy="51"
        r="48"
        fill="rgba(0,0,0,0.15)"
      />
      {/* Outer case */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill={watchDNA.bezelColor}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.5"
      />
      {/* Bezel */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={watchDNA.caseFinish === 'brushed' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)'}
        strokeWidth="3"
      />
      {/* Inner bezel ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="0.5"
      />
    </>
  );
}

// Dial Component
function Dial({
  watchDNA,
  isMinimal,
}: {
  watchDNA: WatchDNA;
  isMinimal: boolean;
}) {
  const dialRadius = isMinimal ? 42 : 43;
  const dialRx = isMinimal ? 18 : 43;

  if (isMinimal) {
    return (
      <rect
        x={50 - dialRadius}
        y={50 - dialRadius}
        width={dialRadius * 2}
        height={dialRadius * 2}
        rx={dialRx}
        fill={watchDNA.dialColor}
      />
    );
  }

  return (
    <>
      <circle
        cx="50"
        cy="50"
        r={dialRadius}
        fill={watchDNA.dialColor}
      />
      {/* Sunburst effect for elegant dials */}
      {watchDNA.dialTexture === 'sunburst' && (
        <circle
          cx="50"
          cy="50"
          r={dialRadius}
          fill={`url(#dial-gradient-${watchDNA.theme})`}
          opacity="0.5"
        />
      )}
    </>
  );
}

// Chapter Ring / Minute Track
function ChapterRing({ watchDNA }: { watchDNA: WatchDNA }) {
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const isMajor = i % 5 === 0;
    const angle = i * 6;
    const outerR = 42;
    const innerR = isMajor ? 39 : 40.5;

    const outer = getPositionOnCircle(angle, outerR);
    const inner = getPositionOnCircle(angle, innerR);

    ticks.push(
      <line
        key={`tick-${i}`}
        x1={outer.x}
        y1={outer.y}
        x2={inner.x}
        y2={inner.y}
        stroke={watchDNA.indexColor}
        strokeWidth={isMajor ? 0.8 : 0.4}
        opacity={isMajor ? 0.8 : 0.5}
      />
    );
  }

  return <g>{ticks}</g>;
}

// Indices Component
function Indices({
  watchDNA,
  isMinimal,
}: {
  watchDNA: WatchDNA;
  isMinimal: boolean;
}) {
  const { indexStyle, indexColor, font } = watchDNA;
  const indices = [];

  // Radius for index placement
  const radius = isMinimal ? 34 : 36;
  const textRadius = isMinimal ? 32 : 33;

  for (let hour = 1; hour <= 12; hour++) {
    const angle = hour * 30;
    const pos = getPositionOnCircle(angle, radius);
    const textPos = getPositionOnCircle(angle, textRadius);

    // Determine what to show at this position
    const isQuarter = hour === 12 || hour === 3 || hour === 6 || hour === 9;

    if (indexStyle === 'none') {
      // Minimal - just small dots at quarters
      if (isQuarter) {
        indices.push(
          <circle
            key={`index-${hour}`}
            cx={pos.x}
            cy={pos.y}
            r={1}
            fill={indexColor}
            opacity={0.6}
          />
        );
      }
    } else if (indexStyle === 'arabic' || (indexStyle === 'mixed' && isQuarter)) {
      // Arabic numerals
      indices.push(
        <text
          key={`index-${hour}`}
          x={textPos.x}
          y={textPos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={indexColor}
          fontSize={isMinimal ? 7 : 6}
          fontFamily={font}
          fontWeight={isMinimal ? 500 : 600}
        >
          {hour}
        </text>
      );
    } else if (indexStyle === 'roman') {
      // Roman numerals
      indices.push(
        <text
          key={`index-${hour}`}
          x={textPos.x}
          y={textPos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={indexColor}
          fontSize={5}
          fontFamily="serif"
          fontWeight={400}
        >
          {toRoman(hour)}
        </text>
      );
    } else if (indexStyle === 'dots') {
      // Luminous dots (Explorer II style)
      const dotSize = isQuarter ? 2.5 : 1.8;
      indices.push(
        <g key={`index-${hour}`} filter={`url(#lume-glow-${watchDNA.theme})`}>
          <circle
            cx={pos.x}
            cy={pos.y}
            r={dotSize}
            fill={watchDNA.lumeColor}
          />
          <circle
            cx={pos.x}
            cy={pos.y}
            r={dotSize * 0.6}
            fill="rgba(255,255,255,0.8)"
          />
        </g>
      );
      // Triangle at 12 for diver style
      if (hour === 12) {
        const triPos = getPositionOnCircle(0, radius + 2);
        indices.push(
          <polygon
            key="triangle-12"
            points={`${triPos.x},${triPos.y - 4} ${triPos.x - 3},${triPos.y + 2} ${triPos.x + 3},${triPos.y + 2}`}
            fill={watchDNA.lumeColor}
            filter={`url(#lume-glow-${watchDNA.theme})`}
          />
        );
      }
    } else {
      // Baton indices
      const batonLength = isQuarter ? 5 : 3;
      const outerPos = getPositionOnCircle(angle, radius + 2);
      const innerPos = getPositionOnCircle(angle, radius + 2 - batonLength);

      indices.push(
        <line
          key={`index-${hour}`}
          x1={outerPos.x}
          y1={outerPos.y}
          x2={innerPos.x}
          y2={innerPos.y}
          stroke={indexColor}
          strokeWidth={isQuarter ? 2 : 1.2}
          strokeLinecap="round"
        />
      );
    }
  }

  return <g>{indices}</g>;
}

// Date Window Component
function DateWindow({
  watchDNA,
  date,
}: {
  watchDNA: WatchDNA;
  date: string;
}) {
  const position = watchDNA.datePosition === 3
    ? { x: 68, y: 50 }
    : { x: 50, y: 68 };

  return (
    <g>
      {/* Date window frame */}
      <rect
        x={position.x - 6}
        y={position.y - 4}
        width={12}
        height={8}
        rx={1}
        fill="rgba(255,255,255,0.95)"
        stroke={watchDNA.indexColor}
        strokeWidth={0.5}
      />
      {/* Date text */}
      <text
        x={position.x}
        y={position.y}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#1a1a1a"
        fontSize={5}
        fontFamily="system-ui, sans-serif"
        fontWeight={600}
      >
        {date}
      </text>
    </g>
  );
}

// Hands Component
function Hands({
  watchDNA,
  angles,
  isMinimal,
}: {
  watchDNA: WatchDNA;
  angles: { hours: number; minutes: number; seconds: number };
  isMinimal: boolean;
}) {
  const { handStyle, handColor, secondsHandColor } = watchDNA;
  const hourDims = getHandDimensions(handStyle, 'hour');
  const minuteDims = getHandDimensions(handStyle, 'minute');
  const secondDims = getHandDimensions(handStyle, 'second');

  return (
    <g>
      {/* Hour hand */}
      <g transform={`rotate(${angles.hours}, 50, 50)`}>
        <Hand
          length={hourDims.length}
          width={hourDims.width}
          tailLength={hourDims.tailLength}
          color={handColor}
          style={handStyle}
          type="hour"
          isMinimal={isMinimal}
        />
      </g>

      {/* Minute hand */}
      <g transform={`rotate(${angles.minutes}, 50, 50)`}>
        <Hand
          length={minuteDims.length}
          width={minuteDims.width}
          tailLength={minuteDims.tailLength}
          color={handColor}
          style={handStyle}
          type="minute"
          isMinimal={isMinimal}
        />
      </g>

      {/* Seconds hand - always uses accent color */}
      <g transform={`rotate(${angles.seconds}, 50, 50)`}>
        <SecondsHand
          length={secondDims.length}
          tailLength={secondDims.tailLength}
          color={secondsHandColor}
          isMinimal={isMinimal}
        />
      </g>
    </g>
  );
}

// Individual Hand Component
function Hand({
  length,
  width,
  tailLength,
  color,
  style,
  type,
  isMinimal,
}: {
  length: number;
  width: number;
  tailLength: number;
  color: string;
  style: string;
  type: 'hour' | 'minute';
  isMinimal: boolean;
}) {
  // Different hand shapes based on style
  if (style === 'mercedes' && type === 'hour') {
    // Mercedes/Rolex style hour hand with circle
    return (
      <g>
        <rect
          x={50 - width / 2}
          y={50 - length + 8}
          width={width}
          height={length - 12}
          fill={color}
        />
        <circle
          cx={50}
          cy={50 - length + 5}
          r={4}
          fill="none"
          stroke={color}
          strokeWidth={width * 0.8}
        />
        <rect
          x={50 - width / 2}
          y={50}
          width={width}
          height={tailLength}
          fill={color}
        />
      </g>
    );
  }

  if (style === 'dauphine' || isMinimal) {
    // Tapered dauphine hands (iOS Clock style)
    const tipWidth = width * 0.3;
    return (
      <polygon
        points={`
          ${50 - width / 2},${50 + tailLength}
          ${50 - width / 2},${50}
          ${50 - tipWidth},${50 - length + 4}
          ${50},${50 - length}
          ${50 + tipWidth},${50 - length + 4}
          ${50 + width / 2},${50}
          ${50 + width / 2},${50 + tailLength}
        `}
        fill={color}
      />
    );
  }

  // Default baton style
  return (
    <g>
      <rect
        x={50 - width / 2}
        y={50 - length}
        width={width}
        height={length + tailLength}
        rx={width / 2}
        fill={color}
      />
    </g>
  );
}

// Seconds Hand Component - always thin with counterbalance
function SecondsHand({
  length,
  tailLength,
  color,
  isMinimal,
}: {
  length: number;
  tailLength: number;
  color: string;
  isMinimal: boolean;
}) {
  const width = isMinimal ? 1 : 1.2;

  return (
    <g>
      {/* Main hand */}
      <line
        x1={50}
        y1={50 + tailLength}
        x2={50}
        y2={50 - length}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
      {/* Counterbalance circle */}
      <circle
        cx={50}
        cy={50 + tailLength - 3}
        r={isMinimal ? 2 : 2.5}
        fill={color}
      />
      {/* Tip arrow for tool watches */}
      {!isMinimal && (
        <polygon
          points={`${50},${50 - length - 2} ${50 - 2},${50 - length + 3} ${50 + 2},${50 - length + 3}`}
          fill={color}
        />
      )}
    </g>
  );
}

export default WatchFace;
