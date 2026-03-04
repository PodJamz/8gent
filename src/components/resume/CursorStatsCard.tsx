'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';

interface CursorStatsCardProps {
  lang?: 'en' | 'pt';
}

// Actual Cursor 2025 Wrapped stats
const CURSOR_STATS = {
  joinedDaysAgo: 564,
  usagePercentile: 'Top 29%',
  models: [
    { rank: 1, name: 'Auto' },
    { rank: 2, name: 'GPT 5' },
    { rank: 3, name: 'Claude 3.7 Sonnet' },
  ],
  agents: '9.7K',
  tabs: 252,
  tokens: '4.98B',
  streak: 35,
};

// Generate activity data for the dot grid (simulating real activity patterns)
function generateActivityData(): number[][] {
  const rows = 20;
  const cols = 12;
  const data: number[][] = [];

  for (let row = 0; row < rows; row++) {
    const rowData: number[] = [];
    for (let col = 0; col < cols; col++) {
      // Create a "streak" pattern in columns 5-6 (the orange vertical line)
      const isStreakCol = col === 5 || col === 6;
      const isHighActivity = isStreakCol && Math.random() > 0.3;
      const isMediumActivity = !isStreakCol && Math.random() > 0.7;

      if (isHighActivity) {
        rowData.push(3); // High activity (orange)
      } else if (isMediumActivity) {
        rowData.push(2); // Medium activity (light gray)
      } else if (Math.random() > 0.5) {
        rowData.push(1); // Low activity (dark gray)
      } else {
        rowData.push(0); // No activity (darker gray)
      }
    }
    data.push(rowData);
  }
  return data;
}

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

// Activity dot component with animation
function ActivityDot({
  level,
  rowIndex,
  colIndex,
}: {
  level: number;
  rowIndex: number;
  colIndex: number;
}) {
  const getColor = (level: number) => {
    switch (level) {
      case 3:
        return '#ff6633'; // High activity - orange
      case 2:
        return '#666666'; // Medium activity
      case 1:
        return '#444444'; // Low activity
      default:
        return '#2a2a2a'; // No activity
    }
  };

  const delay = (rowIndex * 12 + colIndex) * 0.008;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: delay,
        duration: 0.3,
        ease: 'easeOut',
      }}
      className="relative group"
    >
      <motion.div
        className="w-2.5 h-2.5 rounded-full cursor-pointer"
        style={{ backgroundColor: getColor(level) }}
        whileHover={{ scale: 1.4 }}
        animate={
          level === 3
            ? {
                boxShadow: [
                  '0 0 0px #ff6633',
                  '0 0 8px #ff6633',
                  '0 0 0px #ff6633',
                ],
              }
            : {}
        }
        transition={
          level === 3
            ? {
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
            : {}
        }
      />
    </motion.div>
  );
}

// Stat value with count-up animation
function AnimatedStat({
  value,
  suffix = '',
  prefix = '',
}: {
  value: number | string;
  suffix?: string;
  prefix?: string;
}) {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const animatedValue = useAnimatedCounter(
    Math.floor(numericValue),
    1500
  );

  if (typeof value === 'string' && value.includes('.')) {
    const [, decimal] = value.split('.');
    return (
      <span>
        {prefix}
        {animatedValue}.{decimal}
        {suffix}
      </span>
    );
  }

  return (
    <span>
      {prefix}
      {typeof value === 'string' ? value : animatedValue.toLocaleString()}
      {suffix}
    </span>
  );
}

export function CursorStatsCard({ lang = 'en' }: CursorStatsCardProps) {
  const activityData = useMemo(() => generateActivityData(), []);
  const joinedDays = useAnimatedCounter(CURSOR_STATS.joinedDaysAgo, 1500);
  const tabs = useAnimatedCounter(CURSOR_STATS.tabs, 1500);
  const streak = useAnimatedCounter(CURSOR_STATS.streak, 1500);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto"
    >
      <div
        className="rounded-2xl p-6 overflow-hidden"
        style={{
          background: '#0f0f0f',
          border: '1px solid #222',
        }}
      >
        <div className="flex gap-6">
          {/* Left side - Stats */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            {/* Joined */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm mb-4"
              style={{ color: '#666' }}
            >
              {lang === 'en' ? 'Joined' : 'Entrou'} {joinedDays}{' '}
              {lang === 'en' ? 'Days Ago' : 'Dias Atrás'}
            </motion.p>

            {/* Usage */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <p className="text-sm" style={{ color: '#666' }}>
                {lang === 'en' ? 'Usage' : 'Uso'}
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: '#fff' }}
              >
                {CURSOR_STATS.usagePercentile}
              </p>
            </motion.div>

            {/* Models */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <p className="text-sm mb-2" style={{ color: '#666' }}>
                {lang === 'en' ? 'Models' : 'Modelos'}
              </p>
              <div className="space-y-1">
                {CURSOR_STATS.models.map((model, index) => (
                  <motion.div
                    key={model.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="text-lg font-light"
                      style={{ color: '#888' }}
                    >
                      {model.rank}
                    </span>
                    <span
                      className="text-base font-semibold"
                      style={{ color: '#fff' }}
                    >
                      {model.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4"
            >
              <div>
                <p className="text-xs" style={{ color: '#666' }}>
                  Agents
                </p>
                <p
                  className="text-xl font-bold"
                  style={{ color: '#fff' }}
                >
                  {CURSOR_STATS.agents}
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: '#666' }}>
                  Tabs
                </p>
                <p
                  className="text-xl font-bold"
                  style={{ color: '#fff' }}
                >
                  {tabs}
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: '#666' }}>
                  Tokens
                </p>
                <p
                  className="text-xl font-bold"
                  style={{ color: '#fff' }}
                >
                  {CURSOR_STATS.tokens}
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: '#666' }}>
                  Streak
                </p>
                <p
                  className="text-xl font-bold"
                  style={{ color: '#fff' }}
                >
                  {streak}d
                </p>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-2 mt-2"
            >
              <Image
                src="/cursor.png"
                alt="Cursor"
                width={20}
                height={20}
                className="opacity-70"
              />
              <span className="text-sm" style={{ color: '#666' }}>
                cursor.com/2025
              </span>
            </motion.div>
          </div>

          {/* Right side - Activity Grid */}
          <div className="flex-shrink-0">
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: 'repeat(12, 1fr)',
              }}
            >
              {activityData.map((row, rowIndex) =>
                row.map((level, colIndex) => (
                  <ActivityDot
                    key={`${rowIndex}-${colIndex}`}
                    level={level}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
