'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { motion, AnimatePresence, useReducedMotion, Variants } from 'framer-motion';
import { useMusic } from '@/context/MusicContext';
import { useProviderStatus, type ProviderType, type ConnectionStatus } from '@/hooks/useProviderStatus';
import { Play, Pause, SkipForward, SkipBack, Timer, Bell, Phone, Mic, Check, X, ChevronDown, Cloud, Cpu, Wifi } from 'lucide-react';

// ============================================================================
// Types and Configuration
// ============================================================================

export type DynamicIslandSize =
  | 'default'
  | 'compact'
  | 'large'
  | 'tall'
  | 'long'
  | 'medium'
  | 'ultra';

export type IslandContentType =
  | 'idle'
  | 'music'
  | 'timer'
  | 'notification'
  | 'call'
  | 'recording'
  | 'success'
  | 'loading'
  | 'ralph'
  | 'provider';

interface IslandState {
  size: DynamicIslandSize;
  previousSize: DynamicIslandSize;
  contentType: IslandContentType;
  notification?: {
    title: string;
    message: string;
    icon?: ReactNode;
  };
  ralph?: {
    iteration: number;
    maxIterations: number;
    description: string;
  };
}

interface DynamicIslandContextType {
  state: IslandState;
  setSize: (size: DynamicIslandSize) => void;
  setContentType: (type: IslandContentType) => void;
  showNotification: (title: string, message: string, icon?: ReactNode, duration?: number) => void;
  showRalphMode: (iteration: number, maxIterations: number, description: string) => void;
  hideRalphMode: () => void;
  expand: () => void;
  collapse: () => void;
  scheduleAnimation: (size: DynamicIslandSize, delay?: number) => void;
}

// Size dimensions - based on cult-ui reference and iPhone proportions
const SIZE_PRESETS: Record<DynamicIslandSize, { width: number; height: number; aspectRatio: string }> = {
  default: { width: 126, height: 37, aspectRatio: '126/37' },
  compact: { width: 100, height: 32, aspectRatio: '100/32' },
  large: { width: 350, height: 100, aspectRatio: '350/100' }, // Taller for music player with progress
  tall: { width: 350, height: 200, aspectRatio: '350/200' },
  long: { width: 350, height: 56, aspectRatio: '350/56' },
  medium: { width: 350, height: 130, aspectRatio: '350/130' },
  ultra: { width: 350, height: 300, aspectRatio: '350/300' },
};

// ============================================================================
// Context Provider
// ============================================================================

const DynamicIslandContext = createContext<DynamicIslandContextType | null>(null);

export function useDynamicIsland() {
  const context = useContext(DynamicIslandContext);
  if (!context) {
    throw new Error('useDynamicIsland must be used within DynamicIslandProvider');
  }
  return context;
}

interface DynamicIslandProviderProps {
  children: ReactNode;
  initialSize?: DynamicIslandSize;
}

export function DynamicIslandProvider({
  children,
  initialSize = 'default',
}: DynamicIslandProviderProps) {
  const [state, setState] = useState<IslandState>({
    size: initialSize,
    previousSize: initialSize,
    contentType: 'idle',
  });

  const setSize = useCallback((size: DynamicIslandSize) => {
    setState((prev) => ({
      ...prev,
      previousSize: prev.size,
      size,
    }));
  }, []);

  const setContentType = useCallback((contentType: IslandContentType) => {
    setState((prev) => ({ ...prev, contentType }));
  }, []);

  const showNotification = useCallback(
    (title: string, message: string, icon?: ReactNode, duration = 4000) => {
      setState((prev) => ({
        ...prev,
        previousSize: prev.size,
        size: 'long',
        contentType: 'notification',
        notification: { title, message, icon },
      }));

      if (duration > 0) {
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            previousSize: prev.size,
            size: 'default',
            contentType: 'idle',
            notification: undefined,
          }));
        }, duration);
      }
    },
    []
  );

  const showRalphMode = useCallback(
    (iteration: number, maxIterations: number, description: string) => {
      setState((prev) => ({
        ...prev,
        previousSize: prev.size,
        size: 'long',
        contentType: 'ralph',
        ralph: { iteration, maxIterations, description },
      }));
    },
    []
  );

  const hideRalphMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      previousSize: prev.size,
      size: 'default',
      contentType: 'idle',
      ralph: undefined,
    }));
  }, []);

  const expand = useCallback(() => {
    setState((prev) => ({
      ...prev,
      previousSize: prev.size,
      size: 'large',
    }));
  }, []);

  const collapse = useCallback(() => {
    setState((prev) => ({
      ...prev,
      previousSize: prev.size,
      size: 'default',
    }));
  }, []);

  const scheduleAnimation = useCallback((size: DynamicIslandSize, delay = 1000) => {
    setTimeout(() => setSize(size), delay);
  }, [setSize]);

  return (
    <DynamicIslandContext.Provider
      value={{
        state,
        setSize,
        setContentType,
        showNotification,
        showRalphMode,
        hideRalphMode,
        expand,
        collapse,
        scheduleAnimation,
      }}
    >
      {children}
    </DynamicIslandContext.Provider>
  );
}

// ============================================================================
// Styled Sub-components
// ============================================================================

interface DynamicContainerProps {
  children: ReactNode;
  className?: string;
}

export function DynamicContainer({ children, className = '' }: DynamicContainerProps) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

interface DynamicTitleProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function DynamicTitle({ children, className = '', style }: DynamicTitleProps) {
  return (
    <motion.h3
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className={`font-bold tracking-tight ${className}`}
      style={style}
    >
      {children}
    </motion.h3>
  );
}

interface DynamicDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function DynamicDescription({ children, className = '' }: DynamicDescriptionProps) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`text-sm ${className}`}
    >
      {children}
    </motion.p>
  );
}

// ============================================================================
// Content Renderers
// ============================================================================

function MusicContent({ expanded }: { expanded: boolean }) {
  const { currentTrack, isPlaying, togglePlay, skipToNext, skipToPrevious, currentTime, duration } = useMusic();
  const prefersReducedMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!expanded) {
    // Compact music view - like iPhone
    return (
      <DynamicContainer className="px-2">
        <div className="flex items-center justify-between w-full">
          {/* Album art or profile */}
          <motion.div
            className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0"
            animate={
              isPlaying && !prefersReducedMotion
                ? { scale: [1, 1.03, 1] }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity }}
          >
            {currentTrack.albumArt && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentTrack.albumArt}
                alt={currentTrack.album}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
                }}
              >
                <span className="text-xs">🎵</span>
              </div>
            )}
          </motion.div>

          {/* Visualizer bars */}
          {isPlaying && (
            <motion.div
              className="flex gap-0.5 items-end h-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 rounded-full"
                  style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                  animate={
                    prefersReducedMotion
                      ? { height: '8px' }
                      : { height: ['4px', '14px', '6px'] }
                  }
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.12,
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Track title */}
          <span className="text-white/80 text-[11px] font-medium truncate max-w-[50px]">
            {currentTrack.title}
          </span>
        </div>
      </DynamicContainer>
    );
  }

  // Expanded music view with full controls
  return (
    <DynamicContainer className="px-4 py-2">
      <div className="flex flex-col w-full gap-2">
        {/* Top row: Album art, track info, controls */}
        <div className="flex items-center justify-between w-full gap-3">
          {/* Album art */}
          <motion.div
            className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
            style={{
              boxShadow: '0 4px 20px hsl(var(--theme-primary) / 0.4)',
            }}
            animate={
              isPlaying && !prefersReducedMotion
                ? { scale: [1, 1.02, 1] }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity }}
          >
            {currentTrack.albumArt && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentTrack.albumArt}
                alt={currentTrack.album}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="w-full h-full flex items-end justify-center gap-1 p-2"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
                }}
              >
                {/* Visualizer bars when no album art */}
                {isPlaying && [...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-white/80 rounded-full"
                    animate={
                      prefersReducedMotion
                        ? { height: '40%' }
                        : { height: ['20%', '80%', '40%', '100%', '30%'] }
                    }
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <DynamicTitle className="text-white text-sm truncate">
              {currentTrack.title}
            </DynamicTitle>
            <DynamicDescription className="text-white/50 text-xs truncate">
              {currentTrack.artist}
            </DynamicDescription>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1" role="group" aria-label="Music playback controls">
            <motion.button
              onClick={(e) => { e.stopPropagation(); skipToPrevious(); }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Previous track"
            >
              <SkipBack className="w-4 h-4 text-white/70" fill="currentColor" aria-hidden="true" />
            </motion.button>
            <motion.button
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              aria-pressed={isPlaying}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" fill="currentColor" aria-hidden="true" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" aria-hidden="true" />
              )}
            </motion.button>
            <motion.button
              onClick={(e) => { e.stopPropagation(); skipToNext(); }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Next track"
            >
              <SkipForward className="w-4 h-4 text-white/70" fill="currentColor" aria-hidden="true" />
            </motion.button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-[10px] text-white/40 tabular-nums w-8 text-right" aria-hidden="true">
            {formatTime(currentTime)}
          </span>
          <div
            className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden"
            role="progressbar"
            aria-label="Track progress"
            aria-valuenow={Math.round(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
                width: `${progressPercent}%`,
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <span className="text-[10px] text-white/40 tabular-nums w-8" aria-hidden="true">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </DynamicContainer>
  );
}

function NotificationContent({ notification }: { notification?: { title: string; message: string; icon?: ReactNode } }) {
  if (!notification) return null;

  return (
    <DynamicContainer className="px-4">
      <div className="flex items-center gap-3 w-full">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
          }}
        >
          {notification.icon || <Bell className="w-5 h-5 text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <DynamicTitle className="text-white text-sm truncate">
            {notification.title}
          </DynamicTitle>
          <DynamicDescription className="text-white/60 text-xs truncate">
            {notification.message}
          </DynamicDescription>
        </div>
      </div>
    </DynamicContainer>
  );
}

function IdleContent() {
  const { status, getStatusColor } = useProviderStatus();
  const prefersReducedMotion = useReducedMotion();

  return (
    <DynamicContainer className="px-2">
      <div className="flex items-center justify-between w-full">
        {/* Profile image on left like iPhone */}
        <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/openclaw-logo.png"
            alt="James"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Provider status indicator on right */}
        <motion.div
          className="w-3 h-3 rounded-full flex items-center justify-center"
          style={{ backgroundColor: getStatusColor() }}
          animate={
            status === 'connecting' && !prefersReducedMotion
              ? { scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }
              : {}
          }
          transition={{ duration: 1.5, repeat: Infinity }}
          title={`AI: ${status}`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
        </motion.div>
      </div>
    </DynamicContainer>
  );
}

function ProviderContent({ expanded }: { expanded: boolean }) {
  const { providerType, status, latencyMs, getStatusColor, getProviderDisplayName } = useProviderStatus();
  const prefersReducedMotion = useReducedMotion();

  const getProviderIcon = () => {
    switch (providerType) {
      case 'lynkr':
        return <Wifi className="w-4 h-4" style={{ color: getStatusColor() }} />;
      case 'local':
        return <Cpu className="w-4 h-4" style={{ color: getStatusColor() }} />;
      case 'cloud':
      default:
        return <Cloud className="w-4 h-4" style={{ color: getStatusColor() }} />;
    }
  };

  if (!expanded) {
    // Compact provider view
    return (
      <DynamicContainer className="px-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getStatusColor() }}
              animate={
                status === 'connecting' && !prefersReducedMotion
                  ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }
                  : {}
              }
              transition={{ duration: 1, repeat: Infinity }}
            />
            {getProviderIcon()}
          </div>
          <span className="text-white/70 text-xs font-medium">
            {getProviderDisplayName()}
          </span>
        </div>
      </DynamicContainer>
    );
  }

  // Expanded provider view with full status
  return (
    <DynamicContainer className="px-4">
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex items-center gap-3">
          {/* Provider icon with status glow */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center relative"
            style={{
              background: `linear-gradient(135deg, ${getStatusColor()}20 0%, ${getStatusColor()}10 100%)`,
            }}
          >
            {providerType === 'lynkr' && <Wifi className="w-6 h-6" style={{ color: getStatusColor() }} />}
            {providerType === 'local' && <Cpu className="w-6 h-6" style={{ color: getStatusColor() }} />}
            {providerType === 'cloud' && <Cloud className="w-6 h-6" style={{ color: getStatusColor() }} />}
            {/* Pulse ring for connecting state */}
            {status === 'connecting' && !prefersReducedMotion && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: `2px solid ${getStatusColor()}` }}
                animate={{ scale: [1, 1.3], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
          <div>
            <DynamicTitle
              className="text-sm"
              style={{ color: getStatusColor() }}
            >
              {getProviderDisplayName()}
            </DynamicTitle>
            <DynamicDescription className="text-white/50 text-xs capitalize">
              {status}
              {latencyMs !== undefined && status === 'connected' && (
                <span className="ml-2 text-white/30">{latencyMs}ms</span>
              )}
            </DynamicDescription>
          </div>
        </div>
        {/* Status indicator */}
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: getStatusColor() }}
          animate={
            status === 'connecting' && !prefersReducedMotion
              ? { scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }
              : {}
          }
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    </DynamicContainer>
  );
}

function TimerContent({ expanded }: { expanded: boolean }) {
  const [time, setTime] = useState(125); // 2:05 in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  if (!expanded) {
    return (
      <DynamicContainer className="px-3">
        <div className="flex items-center justify-between w-full">
          <Timer className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span
            className="text-sm font-bold tabular-nums"
            style={{ color: 'hsl(var(--theme-primary))' }}
          >
            {display}
          </span>
        </div>
      </DynamicContainer>
    );
  }

  return (
    <DynamicContainer className="px-4">
      <div className="flex items-center justify-between w-full gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--theme-primary) / 0.2) 0%, hsl(var(--theme-accent) / 0.2) 100%)',
          }}
        >
          <Timer className="w-6 h-6" style={{ color: 'hsl(var(--theme-primary))' }} />
        </div>
        <div className="flex-1">
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color: 'hsl(var(--theme-primary))' }}
          >
            {display}
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
        >
          <X className="w-5 h-5 text-white/70" />
        </motion.button>
      </div>
    </DynamicContainer>
  );
}

function CallContent({ expanded }: { expanded: boolean }) {
  if (!expanded) {
    return (
      <DynamicContainer className="px-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <Phone className="w-4 h-4 text-green-400" />
          </div>
          <span className="text-white/70 text-xs font-medium">12:34</span>
        </div>
      </DynamicContainer>
    );
  }

  return (
    <DynamicContainer className="px-4">
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div>
            <DynamicTitle className="text-white text-sm">Incoming Call</DynamicTitle>
            <DynamicDescription className="text-white/50 text-xs">Mobile • 12:34</DynamicDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center"
          >
            <Phone className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>
    </DynamicContainer>
  );
}

function RecordingContent() {
  return (
    <DynamicContainer className="px-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <Mic className="w-4 h-4 text-red-400" />
        </div>
        <span className="text-white/70 text-xs font-medium">Recording...</span>
      </div>
    </DynamicContainer>
  );
}

function SuccessContent() {
  return (
    <DynamicContainer className="px-3">
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
        <span className="text-green-400 text-xs font-medium">Success</span>
      </div>
    </DynamicContainer>
  );
}

function LoadingContent() {
  return (
    <DynamicContainer className="px-3">
      <div className="flex items-center gap-2">
        <motion.div
          className="w-4 h-4 border-2 border-white/20 rounded-full"
          style={{ borderTopColor: 'hsl(var(--theme-primary))' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <span className="text-white/50 text-xs font-medium">Loading...</span>
      </div>
    </DynamicContainer>
  );
}

function RalphModeContent({ ralph }: { ralph?: { iteration: number; maxIterations: number; description: string } }) {
  const prefersReducedMotion = useReducedMotion();

  if (!ralph) return null;

  return (
    <DynamicContainer className="px-4">
      <div className="flex items-center gap-3 w-full">
        {/* Animated icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <motion.div
            animate={prefersReducedMotion ? {} : { rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </motion.div>
        </div>

        {/* Status text */}
        <div className="flex-1 min-w-0">
          <DynamicTitle className="text-white text-sm">
            Refining {ralph.iteration}/{ralph.maxIterations}
          </DynamicTitle>
          <DynamicDescription className="text-white/50 text-xs truncate">
            {ralph.description}
          </DynamicDescription>
        </div>

        {/* Progress indicator */}
        <div className="w-8 h-8 relative flex-shrink-0">
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="12"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
              fill="none"
            />
            <motion.circle
              cx="16"
              cy="16"
              r="12"
              stroke="url(#ralph-gradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={75.4}
              initial={{ strokeDashoffset: 75.4 }}
              animate={{ strokeDashoffset: 75.4 * (1 - ralph.iteration / ralph.maxIterations) }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="ralph-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </DynamicContainer>
  );
}

// ============================================================================
// Main DynamicIsland Component
// ============================================================================

interface DynamicIslandProps {
  id?: string;
  className?: string;
  children?: ReactNode;
}

export function DynamicIsland({ id, className = '', children }: DynamicIslandProps) {
  const { state, expand, collapse } = useDynamicIsland();
  const { isPlaying } = useMusic();
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const { size, contentType, notification } = state;
  const isExpanded = ['large', 'tall', 'long', 'medium', 'ultra'].includes(size);
  const preset = SIZE_PRESETS[size];

  // Auto-expand for music when playing
  useEffect(() => {
    if (isPlaying && contentType === 'idle') {
      // Don't auto-expand, just show music indicator
    }
  }, [isPlaying, contentType]);

  // Handle hover to expand music
  useEffect(() => {
    if (isHovered && isPlaying && size === 'default') {
      expand();
    } else if (!isHovered && size === 'large' && contentType !== 'notification') {
      collapse();
    }
  }, [isHovered, isPlaying, size, contentType, expand, collapse]);

  const handleClick = () => {
    if (size === 'default' || size === 'compact') {
      expand();
    } else {
      collapse();
    }
  };

  // Animation variants
  const containerVariants: Variants = {
    initial: {
      width: SIZE_PRESETS.default.width,
      height: SIZE_PRESETS.default.height,
    },
    animate: {
      width: preset.width,
      height: preset.height,
      transition: prefersReducedMotion
        ? { duration: 0.2 }
        : {
            type: 'spring',
            stiffness: 400,
            damping: 30,
          },
    },
  };

  // Render appropriate content
  const renderContent = () => {
    if (children) return children;

    switch (contentType) {
      case 'music':
        return <MusicContent expanded={isExpanded} />;
      case 'notification':
        return <NotificationContent notification={notification} />;
      case 'timer':
        return <TimerContent expanded={isExpanded} />;
      case 'call':
        return <CallContent expanded={isExpanded} />;
      case 'recording':
        return <RecordingContent />;
      case 'success':
        return <SuccessContent />;
      case 'loading':
        return <LoadingContent />;
      case 'ralph':
        return <RalphModeContent ralph={state.ralph} />;
      case 'provider':
        return <ProviderContent expanded={isExpanded} />;
      default:
        // If music is playing, show music content
        if (isPlaying) {
          return <MusicContent expanded={isExpanded} />;
        }
        return <IdleContent />;
    }
  };

  return (
    <motion.div
      id={id}
      className={`dynamic-island relative cursor-pointer select-none ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="status"
      aria-label="Dynamic Island"
      style={{
        transformOrigin: 'top center',
      }}
    >
      {/* Background with glass effect */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: isExpanded ? 32 : 20,
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.95) 100%)',
          boxShadow: `
            0 4px 30px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.05)
          `,
        }}
        layout
      />

      {/* Subtle glow effect when active */}
      {(isPlaying || contentType !== 'idle') && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          style={{
            borderRadius: isExpanded ? 32 : 20,
            background: `radial-gradient(ellipse at center, hsl(var(--theme-primary) / 0.15) 0%, transparent 70%)`,
            filter: 'blur(15px)',
          }}
        />
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${size}-${contentType}`}
          className="relative h-full w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Expand indicator */}
      {isExpanded && (
        <motion.div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 0.5, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <ChevronDown className="w-4 h-4 text-white/30" />
        </motion.div>
      )}

      {/* Breathing animation for idle state */}
      {contentType === 'idle' && !isPlaying && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 20,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
}

// ============================================================================
// Compact Version (for status bar)
// ============================================================================

export function DynamicIslandCompact({ className = '' }: { className?: string }) {
  const { isPlaying, currentTrack } = useMusic();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer ${className}`}
      style={{
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isPlaying ? (
        <>
          <motion.div
            className="flex gap-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-0.5 rounded-full"
                style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                animate={
                  prefersReducedMotion
                    ? { height: '8px' }
                    : { height: ['4px', '10px', '4px'] }
                }
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </motion.div>
          <span className="text-white/70 text-xs font-medium truncate max-w-[100px]">
            {currentTrack.title}
          </span>
        </>
      ) : (
        <>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
          />
          <span className="text-white/50 text-xs font-medium">James OS</span>
        </>
      )}
    </motion.div>
  );
}

