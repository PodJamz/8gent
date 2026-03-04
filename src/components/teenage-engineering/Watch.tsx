'use client';

import { useState, useEffect } from 'react';

/**
 * Digital Watch Widget
 * Teenage Engineering style - minimal, monospaced, grid-based
 * Updates every second with smooth transitions
 */

export function Watch() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const date = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).toUpperCase();

  const colors = {
    background: '#E5E5E5',
    display: '#2C2C2C',
    orange: '#FF5722',
  };

  return (
    <div
      className="relative w-full max-w-[280px] mx-auto rounded-lg overflow-hidden shadow-xl border-2 p-6"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.display,
      }}
    >
      {/* Time Display */}
      <div className="text-center mb-4">
        <div
          className="text-6xl font-mono font-bold tracking-tight"
          style={{ color: colors.display }}
        >
          {hours}
          <span
            className="animate-pulse inline-block w-2"
            style={{ color: colors.orange }}
          >
            :
          </span>
          {minutes}
        </div>

        {/* Seconds (smaller) */}
        <div
          className="text-3xl font-mono font-bold mt-1"
          style={{ color: colors.display, opacity: 0.5 }}
        >
          {seconds}
        </div>
      </div>

      {/* Date */}
      <div className="text-center border-t-2 pt-4" style={{ borderColor: colors.display }}>
        <div
          className="text-sm font-mono tracking-wider"
          style={{ color: colors.display, opacity: 0.7 }}
        >
          {date}
        </div>
      </div>

      {/* Grid indicator (TE aesthetic) */}
      <div className="absolute top-2 right-2 grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`w-1 h-1 rounded-full ${
              i === Math.floor((time.getSeconds() % 9)) ? 'opacity-100' : 'opacity-20'
            }`}
            style={{ backgroundColor: colors.orange }}
          />
        ))}
      </div>
    </div>
  );
}
