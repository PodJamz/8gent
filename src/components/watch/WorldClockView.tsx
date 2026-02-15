'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { WatchFace } from './WatchFace';
import { TimezoneDetailModal } from './TimezoneDetailModal';
import { type WatchDNA } from '@/lib/watch/theme-to-watch';

interface TimeZone {
  id: string;
  city: string;
  timezone: string;
}

const TIME_ZONES: TimeZone[] = [
  { id: 'dublin', city: 'Dublin', timezone: 'Europe/Dublin' },
  { id: 'paris', city: 'Paris', timezone: 'Europe/Paris' },
  { id: 'tokyo', city: 'Tokyo', timezone: 'Asia/Tokyo' },
  { id: 'sanfrancisco', city: 'San Francisco', timezone: 'America/Los_Angeles' },
  { id: 'salvador', city: 'Salvador', timezone: 'America/Bahia' },
];

interface WorldClockViewProps {
  watchDNA: WatchDNA;
  onClose?: () => void;
}

function formatTime(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: timezone,
    hour12: false,
  }).format(date);
}

function formatFullDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function getHourInTimezone(date: Date, timezone: string): number {
  return parseInt(
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: timezone,
    }).format(date)
  );
}

function isNighttime(date: Date, timezone: string): boolean {
  const hour = getHourInTimezone(date, timezone);
  return hour >= 20 || hour < 6;
}

// Get weather icon path based on time of day
function getWeatherIconForTime(date: Date, timezone: string): string {
  const hour = getHourInTimezone(date, timezone);
  const isNight = hour >= 20 || hour < 6;

  if (hour >= 5 && hour < 7) {
    return '/icons/weather/sunrise.svg';
  } else if (hour >= 7 && hour < 12) {
    return '/icons/weather/clear-day.svg';
  } else if (hour >= 12 && hour < 17) {
    return '/icons/weather/partly-cloudy-day.svg';
  } else if (hour >= 17 && hour < 20) {
    return '/icons/weather/sunset.svg';
  } else {
    return '/icons/weather/clear-night.svg';
  }
}

function getTimeForTimezone(date: Date, timezone: string): Date {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(date);

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
    getPart('second')
  );

  return tzDate;
}

// Create a dark mode version of watchDNA for nighttime
function getDarkModeWatchDNA(watchDNA: WatchDNA): WatchDNA {
  return {
    ...watchDNA,
    dialColor: 'hsl(220, 20%, 12%)',
    handColor: 'hsl(0, 0%, 90%)',
    indexColor: 'hsl(0, 0%, 80%)',
    bezelColor: 'hsl(220, 15%, 18%)',
  };
}

export function WorldClockView({ watchDNA, onClose }: WorldClockViewProps) {
  const [time, setTime] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState<TimeZone | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = useMemo(() => formatFullDate(time), [time]);

  const handleTimezoneClick = useCallback((tz: TimeZone) => {
    setSelectedTimezone(tz);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedTimezone(null);
  }, []);

  return (
    <>
      <motion.div
        className="relative flex flex-col items-center gap-6 p-6 rounded-3xl backdrop-blur-xl"
        style={{
          background: 'var(--glass-bg, rgba(255,255,255,0.1))',
          border: '1px solid var(--glass-border, rgba(255,255,255,0.2))',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          minWidth: '320px',
        }}
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            aria-label="Close world clock"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-white/70"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Date Header */}
        <div className="text-center border-b border-white/10 pb-4 w-full">
          <h2
            className="text-lg font-light tracking-wide"
            style={{ color: 'var(--text-primary, white)' }}
          >
            {formattedDate}
          </h2>
        </div>

        {/* Time Zones */}
        <div className="flex flex-col gap-3 w-full">
          {TIME_ZONES.map((tz, index) => {
            const isNight = isNighttime(time, tz.timezone);
            const weatherIcon = getWeatherIconForTime(time, tz.timezone);
            const effectiveWatchDNA = isNight ? getDarkModeWatchDNA(watchDNA) : watchDNA;

            return (
              <motion.button
                key={tz.id}
                onClick={() => handleTimezoneClick(tz)}
                className="flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer text-left hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: isNight
                    ? 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 100%)'
                    : 'var(--glass-bg-subtle, rgba(255,255,255,0.05))',
                  border: isNight ? '1px solid rgba(71,85,105,0.3)' : 'none',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{
                  background: isNight
                    ? 'linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(51,65,85,0.9) 100%)'
                    : 'rgba(255,255,255,0.1)',
                }}
              >
                {/* Mini Watch Face */}
                <div className="flex-shrink-0 relative">
                  <WatchFace
                    watchDNA={effectiveWatchDNA}
                    size={48}
                    showCase={false}
                    interactive={false}
                    timezone={tz.timezone}
                  />
                  {/* Nighttime overlay glow */}
                  {isNight && (
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        boxShadow: 'inset 0 0 12px rgba(99,102,241,0.3)',
                      }}
                    />
                  )}
                </div>

                {/* Location & Time */}
                <div className="flex flex-col flex-1 min-w-0">
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: isNight ? 'rgba(226,232,240,0.9)' : 'var(--text-primary, white)' }}
                  >
                    {tz.city}
                  </span>
                  <span
                    className="text-2xl font-light tabular-nums tracking-tight"
                    style={{ color: isNight ? 'rgba(248,250,252,0.95)' : 'var(--text-primary, white)' }}
                  >
                    {formatTime(time, tz.timezone)}
                  </span>
                </div>

                {/* Weather Icon */}
                <div className="flex-shrink-0 w-8 h-8">
                  <img
                    src={weatherIcon}
                    alt="weather"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                    style={{
                      filter: isNight ? 'drop-shadow(0 0 4px rgba(147,197,253,0.4))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    }}
                  />
                </div>

                {/* Arrow indicator */}
                <div className="flex-shrink-0" style={{ color: isNight ? 'rgba(148,163,184,0.5)' : 'rgba(255,255,255,0.3)' }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Hint text */}
        <p className="text-[10px] text-white/30 text-center">
          Tap a timezone for details
        </p>
      </motion.div>

      {/* Timezone Detail Modal */}
      {selectedTimezone && (
        <TimezoneDetailModal
          isOpen={!!selectedTimezone}
          onClose={handleCloseDetail}
          timezone={selectedTimezone}
          watchDNA={watchDNA}
        />
      )}
    </>
  );
}

export default WorldClockView;
