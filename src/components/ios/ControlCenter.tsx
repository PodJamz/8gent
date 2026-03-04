'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useControlCenter } from '@/context/ControlCenterContext';
import { useTheme } from 'next-themes';
import { useMusic } from '@/context/MusicContext';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';
import { cn } from '@/lib/utils';
import {
  Sun,
  Moon,
  Cloud,
  Zap,
  Bell,
  BellOff,
  Palette,
  Github,
  Music,
  Settings,
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Type,
  Volume2,
  Download,
  Cpu,
  Wifi,
} from 'lucide-react';
import { useProviderStatus } from '@/hooks/useProviderStatus';
import { ControlCenterAuth } from './ControlCenterAuth';

// Check if Clerk is configured
const isClerkConfigured = typeof window !== 'undefined'
  ? !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  : !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;



interface ControlCenterProps {
  className?: string;
}

export function ControlCenter({ className }: ControlCenterProps) {
  const { isOpen, close } = useControlCenter();
  const { theme, setTheme } = useTheme();
  const { isPlaying, currentTrack, togglePlay, skipToNext, skipToPrevious } = useMusic();
  const { metrics } = usePerformanceMetrics();
  const { providerType, status, latencyMs, getStatusColor, getProviderDisplayName } = useProviderStatus();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [weather, setWeather] = useState<{ temp: number; condition: string } | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [textSize, setTextSize] = useState(100); // percentage
  const [volume, setVolume] = useState(75); // percentage

  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-IE', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather (simplified - Dublin weather)
  useEffect(() => {
    // Simulated weather for Dublin - in production would fetch from API
    setWeather({ temp: 8, condition: 'cloudy' });
  }, []);


  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  }, [deferredPrompt]);

  // Get performance status
  const getSpeedStatus = () => {
    const ms = metrics.primaryMetric;
    if (ms === null) return { text: 'Measuring...', color: 'text-neutral-400', ms: null };
    if (ms < 1000) return { text: 'Fast', color: 'text-emerald-400', ms };
    if (ms < 2000) return { text: 'Good', color: 'text-yellow-400', ms };
    if (ms < 3000) return { text: 'Moderate', color: 'text-orange-400', ms };
    return { text: 'Slow', color: 'text-red-400', ms };
  };

  const speedStatus = getSpeedStatus();

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y < -100 || info.velocity.y < -500) {
        close();
      }
    },
    [close]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] backdrop-blur-md"
            style={{ backgroundColor: 'hsl(var(--theme-foreground) / 0.4)' }}
            onClick={close}
          />

          {/* Control Center Panel */}
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.1, bottom: 0.3 }}
            onDragEnd={handleDragEnd}
            className={cn(
              'fixed top-0 left-0 right-0 z-[9999]',
              'max-h-[85vh] overflow-y-auto',
              'rounded-b-[32px]',
              'backdrop-blur-2xl',
              className
            )}
            style={{
              backgroundColor: 'hsl(var(--theme-background) / 0.97)',
              borderBottom: '1px solid hsl(var(--theme-border) / 0.3)',
              boxShadow: '0 25px 50px -12px hsl(var(--theme-foreground) / 0.25)',
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'hsl(var(--theme-foreground) / 0.3)' }} />
            </div>

            {/* Close Button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{
                backgroundColor: 'hsl(var(--theme-muted))',
                color: 'hsl(var(--theme-muted-foreground))',
              }}
              aria-label="Close Control Center"
            >
              <X size={16} />
            </button>

            {/* Main Content */}
            <div className="px-5 pb-8">
              {/* Date & Time Display - iPhone Style */}
              <div className="text-center pt-4 pb-6">
                <p className="text-sm font-medium tracking-wide" style={{ color: 'hsl(var(--theme-primary) / 0.8)' }}>
                  {currentDate}
                </p>
                <p
                  className="text-7xl font-extralight tabular-nums tracking-tight mt-1"
                  style={{
                    fontFeatureSettings: '"tnum"',
                    color: 'hsl(var(--theme-primary) / 0.9)',
                  }}
                >
                  {currentTime}
                </p>
              </div>

              {/* Top Row - Account, Speed, Install */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {/* Account / Sign In */}
                {isClerkConfigured ? (
                  <ControlCenterAuth />
                ) : (
                  <QuickTile
                    icon={<Github size={20} />}
                    label="GitHub"
                    sublabel="Profile"
                    onClick={() => window.open('https://github.com/PodJamz', '_blank')}
                  />
                )}

                {/* Speed */}
                <QuickTile
                  icon={<Zap size={20} className={speedStatus.color} />}
                  label={speedStatus.text}
                  sublabel={speedStatus.ms ? `${Math.round(speedStatus.ms)}ms` : '...'}
                />

                {/* Install App */}
                {isInstallable ? (
                  <QuickTile
                    icon={<Download size={20} />}
                    label="Install"
                    sublabel="Add App"
                    onClick={handleInstall}
                    active
                  />
                ) : (
                  <QuickTile
                    icon={<Download size={20} style={{ opacity: 0.3 }} />}
                    label="Installed"
                    sublabel=""
                    disabled
                  />
                )}
              </div>

              {/* Sliders Row - iOS style */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Text Size Slider */}
                <div
                  className="rounded-2xl p-3"
                  style={{
                    backgroundColor: 'hsl(var(--theme-card))',
                    border: '1px solid hsl(var(--theme-border) / 0.3)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Type size={14} style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Text Size</span>
                  </div>
                  <input
                    type="range"
                    min="75"
                    max="150"
                    value={textSize}
                    onChange={(e) => setTextSize(Number(e.target.value))}
                    className="w-full h-8 appearance-none rounded-full cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                    style={{
                      backgroundColor: 'hsl(var(--theme-muted))',
                    }}
                  />
                  <p className="text-xs text-center mt-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{textSize}%</p>
                </div>

                {/* Volume Slider */}
                <div
                  className="rounded-2xl p-3"
                  style={{
                    backgroundColor: 'hsl(var(--theme-card))',
                    border: '1px solid hsl(var(--theme-border) / 0.3)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 size={14} style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Volume</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-8 appearance-none rounded-full cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                    style={{
                      backgroundColor: 'hsl(var(--theme-muted))',
                    }}
                  />
                  <p className="text-xs text-center mt-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{volume}%</p>
                </div>
              </div>

              {/* Quick Controls Grid */}
              <div className="grid grid-cols-5 gap-2 mb-5">
                {/* AI Provider Status */}
                <QuickTile
                  icon={
                    providerType === 'lynkr' ? (
                      <Wifi size={20} style={{ color: getStatusColor() }} />
                    ) : providerType === 'local' ? (
                      <Cpu size={20} style={{ color: getStatusColor() }} />
                    ) : (
                      <Cloud size={20} style={{ color: getStatusColor() }} />
                    )
                  }
                  label={getProviderDisplayName()}
                  sublabel={status === 'connected' && latencyMs ? `${latencyMs}ms` : status}
                  active={status === 'connected'}
                  onClick={() => {
                    close();
                    window.location.href = '/settings/ai';
                  }}
                />

                {/* Weather */}
                <QuickTile
                  icon={<Cloud size={20} />}
                  label={weather ? `${weather.temp}°C` : '...'}
                  sublabel="Dublin"
                />

                {/* Theme Toggle */}
                <QuickTile
                  icon={theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                  label="Theme"
                  sublabel={theme === 'dark' ? 'Dark' : 'Light'}
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />

                {/* Notifications */}
                <QuickTile
                  icon={
                    notificationsEnabled ? (
                      <Bell size={20} />
                    ) : (
                      <BellOff size={20} className="text-red-400" />
                    )
                  }
                  label="Alerts"
                  sublabel={notificationsEnabled ? 'On' : 'Off'}
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  active={notificationsEnabled}
                />

                {/* Design */}
                <QuickTile
                  icon={<Palette size={20} />}
                  label="Design"
                  sublabel="Themes"
                  onClick={() => {
                    close();
                    window.location.href = '/design';
                  }}
                />
              </div>

              {/* Music Player Widget */}
              <div className="mb-5">
                <div
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: 'hsl(var(--theme-card))',
                    border: '1px solid hsl(var(--theme-border) / 0.3)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Album Art / Music Icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background:
                            'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
                        }}
                      >
                        {currentTrack.albumArt ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={currentTrack.albumArt}
                            alt={currentTrack.title}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <Music size={20} style={{ color: 'hsl(var(--theme-primary-foreground))' }} />
                        )}
                      </div>

                      {/* Track Info */}
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'hsl(var(--theme-foreground))' }}>
                          {currentTrack.title || 'Not Playing'}
                        </p>
                        <p className="text-xs truncate" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                          {currentTrack.artist || 'Select a track'}
                        </p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={skipToPrevious}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        style={{
                          backgroundColor: 'hsl(var(--theme-muted))',
                          color: 'hsl(var(--theme-foreground) / 0.7)',
                        }}
                        aria-label="Previous track"
                      >
                        <SkipBack size={14} fill="currentColor" />
                      </button>
                      <button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                        style={{
                          backgroundColor: 'hsl(var(--theme-primary))',
                          color: 'hsl(var(--theme-primary-foreground))',
                        }}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? (
                          <Pause size={18} fill="currentColor" />
                        ) : (
                          <Play size={18} fill="currentColor" className="ml-0.5" />
                        )}
                      </button>
                      <button
                        onClick={skipToNext}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        style={{
                          backgroundColor: 'hsl(var(--theme-muted))',
                          color: 'hsl(var(--theme-foreground) / 0.7)',
                        }}
                        aria-label="Next track"
                      >
                        <SkipForward size={14} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Updates / Notifications */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    Recent Updates
                  </h3>
                  <button className="text-[10px] transition-colors" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    Clear
                  </button>
                </div>
                <div className="space-y-2">
                  <NotificationCard
                    icon={<Zap size={14} className="text-emerald-400" />}
                    title="8gent OS"
                    message="New Control Center deployed"
                    time="Just now"
                  />
                  <NotificationCard
                    icon={<Github size={14} style={{ color: 'hsl(var(--theme-foreground))' }} />}
                    title="GitHub"
                    message="3 new commits to main branch"
                    time="2h ago"
                  />
                </div>
              </div>

              {/* Quick Launch Apps */}
              <div className="pt-2" style={{ borderTop: '1px solid hsl(var(--theme-border) / 0.3)' }}>
                <div className="flex justify-center gap-6 pt-3">
                  <AppIcon
                    icon={<Github size={22} />}
                    label="GitHub"
                    onClick={() => window.open('https://github.com/PodJamz', '_blank')}
                  />
                  <AppIcon
                    icon={<Music size={22} />}
                    label="Music"
                    onClick={() => {
                      close();
                      window.location.href = '/music';
                    }}
                  />
                  <AppIcon
                    icon={<Cloud size={22} />}
                    label="Weather"
                    onClick={() => {
                      // Could show weather widget
                    }}
                  />
                  <AppIcon
                    icon={<Settings size={22} />}
                    label="Settings"
                    onClick={() => {
                      // Could open settings
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Quick Access Tile Component
interface QuickTileProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  className?: string;
  active?: boolean;
  disabled?: boolean;
}

function QuickTile({ icon, label, sublabel, onClick, className, active, disabled }: QuickTileProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center justify-center p-3 rounded-2xl',
        'transition-all duration-200',
        'hover:scale-105',
        'active:scale-95',
        'focus:outline-none focus-visible:ring-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={{
        backgroundColor: active ? 'hsl(var(--theme-primary) / 0.2)' : 'hsl(var(--theme-card))',
        border: '1px solid hsl(var(--theme-border) / 0.3)',
      }}
    >
      <div className="mb-1" style={{ color: active ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-foreground) / 0.8)' }}>{icon}</div>
      <span className="text-[11px] font-medium" style={{ color: 'hsl(var(--theme-foreground) / 0.9)' }}>{label}</span>
      {sublabel && <span className="text-[9px]" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{sublabel}</span>}
    </button>
  );
}

// Notification Card Component
interface NotificationCardProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  time: string;
}

function NotificationCard({ icon, title, message, time }: NotificationCardProps) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl"
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
        border: '1px solid hsl(var(--theme-border) / 0.3)',
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'hsl(var(--theme-muted))' }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium" style={{ color: 'hsl(var(--theme-foreground) / 0.9)' }}>{title}</span>
          <span className="text-[10px]" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{time}</span>
        </div>
        <p className="text-[11px] mt-0.5 truncate" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{message}</p>
      </div>
    </div>
  );
}

// App Icon Component
interface AppIconProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function AppIcon({ icon, label, onClick }: AppIconProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 group"
      aria-label={label}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-active:scale-95"
        style={{
          backgroundColor: 'hsl(var(--theme-primary) / 0.2)',
          color: 'hsl(var(--theme-primary))',
        }}
      >
        {icon}
      </div>
      <span
        className="text-[10px] transition-colors"
        style={{ color: 'hsl(var(--theme-muted-foreground))' }}
      >
        {label}
      </span>
    </button>
  );
}

export default ControlCenter;
