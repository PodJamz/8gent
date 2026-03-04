'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Device presets matching schema.ts
const DEVICE_PRESETS = {
  'iphone-15-pro': {
    width: 393,
    height: 852,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    scale: 0.5, // Scale for canvas display
  },
  'iphone-15': {
    width: 393,
    height: 852,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    scale: 0.5,
  },
  'iphone-se': {
    width: 375,
    height: 667,
    cornerRadius: 40,
    safeAreaTop: 20,
    safeAreaBottom: 0,
    hasDynamicIsland: false,
    scale: 0.5,
  },
  'ipad-pro-11': {
    width: 834,
    height: 1194,
    cornerRadius: 18,
    safeAreaTop: 24,
    safeAreaBottom: 20,
    hasDynamicIsland: false,
    scale: 0.35,
  },
} as const;

type DeviceType = keyof typeof DEVICE_PRESETS;

interface DeviceFrameProps {
  deviceType?: DeviceType;
  screenTitle?: string;
  screenContent?: React.ReactNode;
  isSelected?: boolean;
  className?: string;
  showStatusBar?: boolean;
  showHomeIndicator?: boolean;
  backgroundColor?: string;
}

// iOS Status Bar Component
function IOSStatusBar({ time = '9:41', hasDynamicIsland = true }: { time?: string; hasDynamicIsland?: boolean }) {
  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-white z-10">
      {/* Left: Time */}
      <span className={cn(hasDynamicIsland && 'ml-1')}>{time}</span>

      {/* Center: Dynamic Island */}
      {hasDynamicIsland && (
        <div className="absolute left-1/2 -translate-x-1/2 top-3 w-[126px] h-[37px] bg-black rounded-full" />
      )}

      {/* Right: Icons */}
      <div className="flex items-center gap-1">
        {/* Signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" className="opacity-90">
          <rect x="0" y="6" width="3" height="6" rx="1" />
          <rect x="5" y="4" width="3" height="8" rx="1" />
          <rect x="10" y="2" width="3" height="10" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" className="opacity-90">
          <path d="M8 2.5C10.5 2.5 12.7 3.5 14.3 5.1L15.7 3.7C13.7 1.7 11 0.5 8 0.5C5 0.5 2.3 1.7 0.3 3.7L1.7 5.1C3.3 3.5 5.5 2.5 8 2.5Z" />
          <path d="M8 6C9.7 6 11.2 6.7 12.3 7.8L13.7 6.4C12.2 4.9 10.2 4 8 4C5.8 4 3.8 4.9 2.3 6.4L3.7 7.8C4.8 6.7 6.3 6 8 6Z" />
          <circle cx="8" cy="10" r="2" />
        </svg>
        {/* Battery */}
        <div className="flex items-center gap-0.5">
          <div className="w-[25px] h-[12px] border border-current rounded-[3px] p-[1px] opacity-90">
            <div className="w-[80%] h-full bg-current rounded-[1px]" />
          </div>
          <div className="w-[1.5px] h-[5px] bg-current rounded-r-sm opacity-90" />
        </div>
      </div>
    </div>
  );
}

// Home Indicator
function HomeIndicator() {
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-white/30 rounded-full" />
  );
}

export function DeviceFrame({
  deviceType = 'iphone-15-pro',
  screenTitle,
  screenContent,
  isSelected = false,
  className,
  showStatusBar = true,
  showHomeIndicator = true,
  backgroundColor = '#000000',
}: DeviceFrameProps) {
  const preset = DEVICE_PRESETS[deviceType];
  const displayWidth = preset.width * preset.scale;
  const displayHeight = preset.height * preset.scale;

  return (
    <motion.div
      className={cn(
        'relative select-none',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent',
        className
      )}
      style={{
        width: displayWidth,
        height: displayHeight,
      }}
    >
      {/* Device Frame */}
      <div
        className="absolute inset-0 bg-[#1c1c1e] shadow-2xl"
        style={{
          borderRadius: preset.cornerRadius * preset.scale,
          border: '2px solid #3a3a3c',
        }}
      >
        {/* Screen Area */}
        <div
          className="absolute inset-[3px] overflow-hidden"
          style={{
            borderRadius: (preset.cornerRadius - 3) * preset.scale,
            backgroundColor,
          }}
        >
          {/* Status Bar */}
          {showStatusBar && (
            <div style={{ transform: `scale(${preset.scale})`, transformOrigin: 'top left' }}>
              <IOSStatusBar hasDynamicIsland={preset.hasDynamicIsland} />
            </div>
          )}

          {/* Screen Content */}
          <div
            className="absolute left-0 right-0 overflow-hidden"
            style={{
              top: preset.safeAreaTop * preset.scale,
              bottom: preset.safeAreaBottom * preset.scale,
            }}
          >
            {screenContent || (
              <div className="flex items-center justify-center h-full text-white/50 text-xs">
                {screenTitle || 'Screen'}
              </div>
            )}
          </div>

          {/* Home Indicator */}
          {showHomeIndicator && preset.safeAreaBottom > 0 && (
            <div style={{ transform: `scale(${preset.scale})`, transformOrigin: 'bottom center' }}>
              <HomeIndicator />
            </div>
          )}
        </div>
      </div>

      {/* Screen Title Label */}
      {screenTitle && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/70 font-medium whitespace-nowrap">
          {screenTitle}
        </div>
      )}
    </motion.div>
  );
}

// iOS Component Primitives for use inside device frames

export function IOSNavBar({
  title,
  leftButton,
  rightButton,
  className,
}: {
  title: string;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur-xl', className)}>
      <div className="w-16 flex justify-start text-blue-400 text-sm">{leftButton}</div>
      <span className="font-semibold text-white text-[17px]">{title}</span>
      <div className="w-16 flex justify-end text-blue-400 text-sm">{rightButton}</div>
    </div>
  );
}

export function IOSTabBar({
  tabs,
  activeIndex = 0,
  className,
}: {
  tabs: Array<{ icon: React.ReactNode; label: string }>;
  activeIndex?: number;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-around px-2 py-2 bg-black/20 backdrop-blur-xl border-t border-white/10', className)}>
      {tabs.map((tab, i) => (
        <div
          key={i}
          className={cn(
            'flex flex-col items-center gap-1 px-3',
            i === activeIndex ? 'text-blue-400' : 'text-white/50'
          )}
        >
          {tab.icon}
          <span className="text-[10px]">{tab.label}</span>
        </div>
      ))}
    </div>
  );
}

export function IOSButton({
  variant = 'primary',
  label,
  fullWidth = false,
  className,
}: {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  label: string;
  fullWidth?: boolean;
  className?: string;
}) {
  const variants = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-white/10 text-white',
    destructive: 'bg-red-500 text-white',
    ghost: 'bg-transparent text-blue-400',
  };

  return (
    <div
      className={cn(
        'px-6 py-3 rounded-xl text-center font-semibold text-[17px]',
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
    >
      {label}
    </div>
  );
}

export function IOSCard({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('bg-white/10 backdrop-blur-sm rounded-2xl p-4', className)}>
      {title && <div className="font-semibold text-white text-[17px]">{title}</div>}
      {subtitle && <div className="text-white/60 text-sm mt-0.5">{subtitle}</div>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function IOSListItem({
  icon,
  label,
  value,
  hasChevron = true,
  className,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  hasChevron?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-3 px-4 py-3 bg-white/5', className)}>
      {icon && <div className="text-white/60">{icon}</div>}
      <span className="flex-1 text-white text-[17px]">{label}</span>
      {value && <span className="text-white/50 text-[17px]">{value}</span>}
      {hasChevron && (
        <svg width="8" height="13" viewBox="0 0 8 13" fill="none" className="text-white/30">
          <path d="M1 1L6.5 6.5L1 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

export function IOSTextField({
  placeholder,
  value,
  className,
}: {
  placeholder?: string;
  value?: string;
  className?: string;
}) {
  return (
    <div className={cn('px-4 py-3 bg-white/10 rounded-xl text-white', className)}>
      {value || <span className="text-white/40">{placeholder || 'Enter text...'}</span>}
    </div>
  );
}

export function IOSToggle({
  isOn = false,
  className,
}: {
  isOn?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'w-[51px] h-[31px] rounded-full p-[2px] transition-colors',
        isOn ? 'bg-green-500' : 'bg-white/20',
        className
      )}
    >
      <div
        className={cn(
          'w-[27px] h-[27px] rounded-full bg-white shadow-sm transition-transform',
          isOn && 'translate-x-[20px]'
        )}
      />
    </div>
  );
}

export function IOSSegmentedControl({
  segments,
  activeIndex = 0,
  className,
}: {
  segments: string[];
  activeIndex?: number;
  className?: string;
}) {
  return (
    <div className={cn('flex bg-white/10 rounded-lg p-[2px]', className)}>
      {segments.map((segment, i) => (
        <div
          key={i}
          className={cn(
            'flex-1 py-1.5 px-3 text-center text-sm font-medium rounded-md transition-colors',
            i === activeIndex ? 'bg-white/20 text-white' : 'text-white/60'
          )}
        >
          {segment}
        </div>
      ))}
    </div>
  );
}

export function IOSProgressBar({
  value,
  max = 100,
  className,
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('h-1 bg-white/20 rounded-full overflow-hidden', className)}>
      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${percentage}%` }} />
    </div>
  );
}
