'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WatchFace } from './WatchFace';
import { type WatchDNA } from '@/lib/watch/theme-to-watch';

interface TimezoneDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  timezone: {
    id: string;
    city: string;
    timezone: string;
  };
  watchDNA: WatchDNA;
}

function formatDetailedTime(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: timezone,
    hour12: false,
  }).format(date);
}

function formatDetailedDate(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  }).format(date);
}

function getTimezoneOffset(timezone: string): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'shortOffset',
  });
  const parts = formatter.formatToParts(now);
  const offsetPart = parts.find(p => p.type === 'timeZoneName');
  return offsetPart?.value || '';
}

function getTimeDifference(timezone: string): string {
  const now = new Date();

  // Get the offset for the target timezone
  const targetDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const localDate = new Date(now.toLocaleString('en-US'));

  const diffMs = targetDate.getTime() - localDate.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHours === 0) return 'Same as local time';
  if (diffHours > 0) return `${diffHours}h ahead`;
  return `${Math.abs(diffHours)}h behind`;
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
function getWeatherIconForTime(date: Date, timezone: string): { icon: string; label: string } {
  const hour = getHourInTimezone(date, timezone);

  if (hour >= 5 && hour < 7) {
    return { icon: '/icons/weather/sunrise.svg', label: 'Dawn' };
  } else if (hour >= 7 && hour < 12) {
    return { icon: '/icons/weather/clear-day.svg', label: 'Morning' };
  } else if (hour >= 12 && hour < 17) {
    return { icon: '/icons/weather/partly-cloudy-day.svg', label: 'Afternoon' };
  } else if (hour >= 17 && hour < 20) {
    return { icon: '/icons/weather/sunset.svg', label: 'Evening' };
  } else if (hour >= 20 && hour < 22) {
    return { icon: '/icons/weather/clear-night.svg', label: 'Dusk' };
  } else {
    return { icon: '/icons/weather/clear-night.svg', label: 'Night' };
  }
}

function getTimeOfDay(date: Date, timezone: string): { period: string; weatherIcon: string; gradient: string; isNight: boolean } {
  const hour = getHourInTimezone(date, timezone);
  const isNight = hour >= 20 || hour < 6;

  if (hour >= 5 && hour < 7) {
    return { period: 'Dawn', weatherIcon: '/icons/weather/sunrise.svg', gradient: 'from-orange-500/30 to-pink-500/30', isNight: false };
  } else if (hour >= 7 && hour < 12) {
    return { period: 'Morning', weatherIcon: '/icons/weather/clear-day.svg', gradient: 'from-yellow-500/25 to-orange-500/25', isNight: false };
  } else if (hour >= 12 && hour < 17) {
    return { period: 'Afternoon', weatherIcon: '/icons/weather/partly-cloudy-day.svg', gradient: 'from-blue-500/25 to-cyan-500/25', isNight: false };
  } else if (hour >= 17 && hour < 20) {
    return { period: 'Evening', weatherIcon: '/icons/weather/sunset.svg', gradient: 'from-orange-500/30 to-red-500/30', isNight: false };
  } else if (hour >= 20 && hour < 22) {
    return { period: 'Dusk', weatherIcon: '/icons/weather/clear-night.svg', gradient: 'from-purple-500/30 to-indigo-500/30', isNight: true };
  } else {
    return { period: 'Night', weatherIcon: '/icons/weather/clear-night.svg', gradient: 'from-indigo-600/40 to-slate-800/40', isNight: true };
  }
}

// Create a dark mode version of watchDNA for nighttime
function getDarkModeWatchDNA(watchDNA: WatchDNA): WatchDNA {
  return {
    ...watchDNA,
    dialColor: 'hsl(220, 25%, 10%)',
    handColor: 'hsl(210, 20%, 85%)',
    indexColor: 'hsl(210, 15%, 70%)',
    bezelColor: 'hsl(220, 20%, 15%)',
    lumeColor: 'hsl(200, 100%, 70%)',
  };
}

export function TimezoneDetailModal({
  isOpen,
  onClose,
  timezone,
  watchDNA,
}: TimezoneDetailModalProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formattedTime = useMemo(() => formatDetailedTime(time, timezone.timezone), [time, timezone.timezone]);
  const formattedDate = useMemo(() => formatDetailedDate(time, timezone.timezone), [time, timezone.timezone]);
  const timezoneOffset = useMemo(() => getTimezoneOffset(timezone.timezone), [timezone.timezone]);
  const timeDifference = useMemo(() => getTimeDifference(timezone.timezone), [timezone.timezone]);
  const timeOfDay = useMemo(() => getTimeOfDay(time, timezone.timezone), [time, timezone.timezone]);

  // Get dark mode watch DNA for nighttime
  const effectiveWatchDNA = useMemo(
    () => (timeOfDay.isNight ? getDarkModeWatchDNA(watchDNA) : watchDNA),
    [watchDNA, timeOfDay.isNight]
  );

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className={`absolute inset-0 backdrop-blur-md ${timeOfDay.isNight ? 'bg-black/70' : 'bg-black/60'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden"
            style={{
              background: timeOfDay.isNight
                ? 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(2,6,23,0.98) 100%)'
                : 'linear-gradient(180deg, rgba(30,30,30,0.98) 0%, rgba(15,15,15,0.98) 100%)',
              border: timeOfDay.isNight
                ? '1px solid rgba(71,85,105,0.3)'
                : '1px solid rgba(255,255,255,0.1)',
              boxShadow: timeOfDay.isNight
                ? '0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(148,163,184,0.1)'
                : '0 25px 50px -12px rgba(0,0,0,0.6)',
            }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors z-20 ${
                timeOfDay.isNight
                  ? 'bg-slate-700/50 hover:bg-slate-600/60'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              aria-label="Close timezone detail"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={timeOfDay.isNight ? 'text-slate-400' : 'text-white/70'}
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Header with gradient accent and weather icon */}
            <div className={`px-6 pt-6 pb-4 bg-gradient-to-r ${timeOfDay.gradient}`}>
              <div className="flex items-center gap-3 mb-2">
                {/* Weather Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-12 h-12"
                >
                  <img
                    src={timeOfDay.weatherIcon}
                    alt={timeOfDay.period}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                    style={{
                      filter: timeOfDay.isNight
                        ? 'drop-shadow(0 0 8px rgba(147,197,253,0.5))'
                        : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                    }}
                  />
                </motion.div>
                <div>
                  <span
                    className={`text-sm font-medium ${
                      timeOfDay.isNight ? 'text-slate-400' : 'text-white/60'
                    }`}
                  >
                    {timeOfDay.period}
                  </span>
                  <h2
                    className={`text-2xl font-semibold tracking-tight ${
                      timeOfDay.isNight ? 'text-slate-100' : 'text-white'
                    }`}
                  >
                    {timezone.city}
                  </h2>
                </div>
              </div>
              <p
                className={`text-sm mt-1 ${
                  timeOfDay.isNight ? 'text-slate-500' : 'text-white/50'
                }`}
              >
                {timezoneOffset} • {timeDifference}
              </p>
            </div>

            {/* Watch Face - Centered and larger */}
            <div className="flex justify-center py-8 relative">
              {/* Nighttime glow effect */}
              {timeOfDay.isNight && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(99,102,241,0.15) 0%, transparent 70%)',
                  }}
                />
              )}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                className="relative"
              >
                <WatchFace
                  watchDNA={effectiveWatchDNA}
                  size={180}
                  showCase={true}
                  interactive={false}
                  timezone={timezone.timezone}
                />
                {/* Lume glow for nighttime */}
                {timeOfDay.isNight && (
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 0 30px rgba(147,197,253,0.2)',
                    }}
                  />
                )}
              </motion.div>
            </div>

            {/* Digital Time Display */}
            <div className="text-center px-6 pb-4">
              <motion.div
                className={`text-5xl font-light tabular-nums tracking-tight ${
                  timeOfDay.isNight ? 'text-slate-100' : 'text-white'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {formattedTime}
              </motion.div>
              <motion.p
                className={`text-sm mt-2 ${
                  timeOfDay.isNight ? 'text-slate-500' : 'text-white/50'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {formattedDate}
              </motion.p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3 px-6 pb-6">
              <motion.div
                className={`p-3 rounded-2xl border ${
                  timeOfDay.isNight
                    ? 'bg-slate-800/50 border-slate-700/50'
                    : 'bg-white/5 border-white/10'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <p
                  className={`text-[10px] uppercase tracking-wider mb-1 ${
                    timeOfDay.isNight ? 'text-slate-500' : 'text-white/40'
                  }`}
                >
                  Timezone
                </p>
                <p
                  className={`text-sm font-medium ${
                    timeOfDay.isNight ? 'text-slate-300' : 'text-white/90'
                  }`}
                >
                  {timezone.timezone.split('/').pop()?.replace('_', ' ')}
                </p>
              </motion.div>
              <motion.div
                className={`p-3 rounded-2xl border ${
                  timeOfDay.isNight
                    ? 'bg-slate-800/50 border-slate-700/50'
                    : 'bg-white/5 border-white/10'
                }`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p
                  className={`text-[10px] uppercase tracking-wider mb-1 ${
                    timeOfDay.isNight ? 'text-slate-500' : 'text-white/40'
                  }`}
                >
                  UTC Offset
                </p>
                <p
                  className={`text-sm font-medium ${
                    timeOfDay.isNight ? 'text-slate-300' : 'text-white/90'
                  }`}
                >
                  {timezoneOffset}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TimezoneDetailModal;
