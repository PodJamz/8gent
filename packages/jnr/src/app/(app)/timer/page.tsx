'use client';

import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Dock } from '@/components/dock/Dock';

/**
 * Timer Page - Visual Timer for Kids
 */

const PRESETS = [
  { label: '1 min', seconds: 60, emoji: '⚡' },
  { label: '2 min', seconds: 120, emoji: '🎯' },
  { label: '5 min', seconds: 300, emoji: '⏰' },
  { label: '10 min', seconds: 600, emoji: '🎮' },
  { label: '15 min', seconds: 900, emoji: '📚' },
  { label: '30 min', seconds: 1800, emoji: '🧘' },
];

export default function TimerPage() {
  const { settings } = useApp();
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const primaryColor = settings.primaryColor || '#4CAF50';

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            // Play sound or vibrate
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200, 100, 200]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, remainingSeconds]);

  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePreset = (seconds: number) => {
    setTotalSeconds(seconds);
    setRemainingSeconds(seconds);
    setIsRunning(false);
    setIsComplete(false);
  };

  const handleStart = () => {
    if (remainingSeconds > 0) {
      setIsRunning(true);
      setIsComplete(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    setIsComplete(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f2f7]">
      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl safe-top"
        style={{ backgroundColor: `${primaryColor}F2` }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-[18px] font-semibold text-white">
            {settings.childName ? `${settings.childName}'s Timer` : 'Timer'}
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32">
        {/* Timer Circle */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-8">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke={isComplete ? '#34C759' : primaryColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isComplete ? (
              <>
                <span className="text-6xl mb-2">🎉</span>
                <span className="text-[24px] font-semibold text-[#34C759]">Done!</span>
              </>
            ) : (
              <>
                <span className="text-[48px] sm:text-[64px] font-light text-black">
                  {formatTime(remainingSeconds)}
                </span>
                <span className="text-gray-500 text-[15px]">
                  {isRunning ? 'Running' : 'Paused'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8">
          {isRunning ? (
            <button
              onClick={handlePause}
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-lg"
              style={{ backgroundColor: '#FF9500' }}
            >
              ⏸
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={remainingSeconds === 0}
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-lg disabled:opacity-40"
              style={{ backgroundColor: primaryColor }}
            >
              ▶
            </button>
          )}
          <button
            onClick={handleReset}
            className="w-16 h-16 rounded-full flex items-center justify-center text-gray-700 text-2xl bg-white shadow-lg border border-gray-200"
          >
            ↺
          </button>
        </div>

        {/* Presets */}
        <div className="w-full max-w-sm">
          <p className="text-[13px] text-gray-500 uppercase tracking-wide text-center mb-3">
            Quick Set
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.seconds}
                onClick={() => handlePreset(preset.seconds)}
                className={`py-3 rounded-xl font-medium transition-colors ${
                  totalSeconds === preset.seconds && !isRunning
                    ? 'text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
                style={{
                  backgroundColor:
                    totalSeconds === preset.seconds && !isRunning ? primaryColor : undefined,
                }}
              >
                <span className="block text-lg mb-0.5">{preset.emoji}</span>
                <span className="text-[13px]">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dock */}
      <Dock primaryColor={primaryColor} />
    </div>
  );
}
