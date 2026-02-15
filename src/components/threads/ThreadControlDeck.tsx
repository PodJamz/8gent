'use client';

import { useState, useRef, useCallback, useEffect, memo } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import {
  Play,
  Pause,
  Square,
  Plus,
  Layers,
  GitBranch,
  GitMerge,
  Zap,
  Clock,
  Activity,
  RefreshCw,
  Settings,
  Gauge,
  Cpu,
  CircuitBoard,
  Workflow,
} from 'lucide-react';
import {
  ThreadType,
  ThreadStatus,
  ModelType,
  THREAD_TYPE_NAMES,
  THREAD_TYPE_COLORS,
  MODEL_INFO,
  formatDuration,
  formatCost,
  formatTokens,
} from '@/lib/threads';

// ============================================================================
// Types
// ============================================================================

interface ThreadControlDeckProps {
  // Current state
  activeThreads: number;
  totalThreads: number;
  totalToolCalls: number;
  totalCost: number;
  efficiency: number;

  // Selected thread info
  selectedThread?: {
    id: string;
    type: ThreadType;
    name: string;
    status: ThreadStatus;
    progress: number;
    model: ModelType;
    duration: number;
    toolCalls: number;
  };

  // Callbacks
  onCreateThread?: (type: ThreadType) => void;
  onStartThread?: () => void;
  onPauseThread?: () => void;
  onStopThread?: () => void;
  onFuseThreads?: () => void;
  onSpawnParallel?: (count: number) => void;
  onModelChange?: (model: ModelType) => void;
  onSettingsOpen?: () => void;

  className?: string;
}

// ============================================================================
// Tactile Button Component
// ============================================================================

interface TactileButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'wide';
  icon?: React.ReactNode;
  label?: string;
  shortcut?: string;
  active?: boolean;
  disabled?: boolean;
  glow?: string;
  className?: string;
}

const TactileButton = memo(function TactileButton({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  icon,
  label,
  shortcut,
  active = false,
  disabled = false,
  glow,
  className = '',
}: TactileButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: 'min-w-[36px] sm:min-w-[40px] h-9 sm:h-10',
    md: 'min-w-[44px] sm:min-w-[52px] h-10 sm:h-12',
    lg: 'min-w-[56px] sm:min-w-[64px] h-12 sm:h-14',
    wide: 'w-full h-9 sm:h-10',
  };

  const variantColors = {
    default: {
      base: 'linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 50%, #1a1a1a 100%)',
      glow: active ? 'rgba(255,255,255,0.1)' : 'transparent',
      text: active ? 'text-white' : 'text-white/60',
    },
    primary: {
      base: active
        ? 'linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)'
        : 'linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 50%, #1a1a1a 100%)',
      glow: active ? 'rgba(59, 130, 246, 0.4)' : 'transparent',
      text: active ? 'text-white' : 'text-blue-400',
    },
    danger: {
      base: active
        ? 'linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)'
        : 'linear-gradient(180deg, #2d1f1f 0%, #1f1515 50%, #1a1010 100%)',
      glow: active ? 'rgba(239, 68, 68, 0.4)' : 'transparent',
      text: active ? 'text-white' : 'text-red-400',
    },
    success: {
      base: active
        ? 'linear-gradient(180deg, #22c55e 0%, #16a34a 50%, #15803d 100%)'
        : 'linear-gradient(180deg, #1f2d1f 0%, #152015 50%, #101a10 100%)',
      glow: active ? 'rgba(34, 197, 94, 0.4)' : 'transparent',
      text: active ? 'text-white' : 'text-green-400',
    },
  };

  const colors = variantColors[variant];

  const handlePress = () => {
    if (disabled) return;
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    onClick?.();
  };

  return (
    <motion.button
      className={`
        relative flex flex-col items-center justify-center gap-0.5
        rounded-lg select-none overflow-hidden
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={handlePress}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => !disabled && setIsPressed(true)}
      onTouchEnd={handlePress}
      disabled={disabled}
      animate={{
        y: isPressed ? 2 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 800,
        damping: 20,
      }}
    >
      {/* Button shadow */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
          transform: 'translateY(4px)',
          opacity: isPressed ? 0.3 : 1,
        }}
      />

      {/* Glow effect */}
      {(active || glow) && (
        <div
          className="absolute inset-0 rounded-lg transition-opacity duration-300"
          style={{
            background: `radial-gradient(ellipse at center, ${glow || colors.glow} 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
        />
      )}

      {/* Button body */}
      <div
        className="absolute inset-0 rounded-lg overflow-hidden transition-all duration-200"
        style={{
          background: colors.base,
          boxShadow: isPressed
            ? 'inset 0 2px 4px rgba(0,0,0,0.5), inset 0 -1px 1px rgba(255,255,255,0.05)'
            : 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.3)',
          transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
        }}
      >
        {/* Top highlight */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.15) 50%, transparent 90%)',
          }}
        />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center gap-0.5 ${colors.text}`}
        style={{
          transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
        }}
      >
        {icon && <span className="transition-colors">{icon}</span>}
        {label && (
          <span className="text-[7px] font-bold tracking-wider uppercase leading-tight text-center">
            {label}
          </span>
        )}
        {children}
      </div>

      {/* Shortcut */}
      {shortcut && (
        <div
          className="absolute bottom-0.5 right-0.5 px-1 py-px rounded text-[5px] font-mono bg-black/30 text-white/30 z-20"
          style={{
            transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
          }}
        >
          {shortcut}
        </div>
      )}
    </motion.button>
  );
});

// ============================================================================
// Thread Type Selector (Rotary Style)
// ============================================================================

interface ThreadTypeSelectorProps {
  selected: ThreadType;
  onChange: (type: ThreadType) => void;
}

const THREAD_TYPES: ThreadType[] = ['base', 'parallel', 'chained', 'fusion', 'big', 'long', 'zero'];

const ThreadTypeSelector = memo(function ThreadTypeSelector({
  selected,
  onChange,
}: ThreadTypeSelectorProps) {
  const selectedIndex = THREAD_TYPES.indexOf(selected);
  const degreesPerType = 270 / (THREAD_TYPES.length - 1);
  const currentRotation = -135 + selectedIndex * degreesPerType;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
        {/* Detent indicators */}
        {THREAD_TYPES.map((type, i) => {
          const angle = -135 + i * degreesPerType;
          const radian = (angle - 90) * (Math.PI / 180);
          const x = Math.cos(radian) * 32;
          const y = Math.sin(radian) * 32;
          const isActive = i <= selectedIndex;
          const colors = THREAD_TYPE_COLORS[type];

          return (
            <button
              key={type}
              onClick={() => onChange(type)}
              className={`absolute w-2 h-2 rounded-full transition-all duration-150 ${
                isActive ? colors.bg : 'bg-white/20'
              }`}
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                boxShadow: isActive ? `0 0 6px ${colors.glow}` : 'none',
              }}
              title={THREAD_TYPE_NAMES[type]}
            />
          );
        })}

        {/* Knob */}
        <motion.div
          className="absolute inset-2 rounded-full cursor-pointer"
          animate={{ rotate: currentRotation }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            background: 'linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 30%, #1a1a1a 70%, #0f0f0f 100%)',
            boxShadow: `
              inset 0 2px 4px rgba(255,255,255,0.15),
              inset 0 -2px 4px rgba(0,0,0,0.5),
              0 4px 8px rgba(0,0,0,0.5)
            `,
          }}
        >
          {/* Knurled texture */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-white/10"
                style={{ transform: `rotate(${(i * 180) / 12}deg)` }}
              />
            ))}
          </div>

          {/* Center cap */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: 'linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 100%)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1)',
            }}
          />

          {/* Indicator */}
          <div
            className="absolute top-1 left-1/2 w-1 h-2 -translate-x-1/2 rounded-full"
            style={{
              background: THREAD_TYPE_COLORS[selected].bg.replace('bg-', ''),
              backgroundColor: THREAD_TYPE_COLORS[selected].glow,
              boxShadow: `0 0 6px ${THREAD_TYPE_COLORS[selected].glow}`,
            }}
          />
        </motion.div>
      </div>

      <div className="text-center">
        <div className={`text-[7px] sm:text-[8px] font-bold tracking-wider uppercase ${THREAD_TYPE_COLORS[selected].text}`}>
          {THREAD_TYPE_NAMES[selected]}
        </div>
        <div className="text-[5px] sm:text-[6px] text-white/40 uppercase tracking-wide">Type</div>
      </div>
    </div>
  );
});

// ============================================================================
// LED Matrix Display
// ============================================================================

interface LEDMatrixDisplayProps {
  activeThreads: number;
  totalThreads: number;
  toolCalls: number;
  cost: number;
  efficiency: number;
  selectedThread?: ThreadControlDeckProps['selectedThread'];
}

const LEDMatrixDisplay = memo(function LEDMatrixDisplay({
  activeThreads,
  totalThreads,
  toolCalls,
  cost,
  efficiency,
  selectedThread,
}: LEDMatrixDisplayProps) {
  return (
    <div
      className="relative w-full rounded-lg overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0f0a 0%, #050805 100%)',
        boxShadow: `
          inset 0 2px 4px rgba(0,0,0,0.8),
          inset 0 -1px 1px rgba(255,255,255,0.05)
        `,
      }}
    >
      {/* Screen bezel */}
      <div
        className="absolute inset-0.5 rounded-md overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0a120a 0%, #040804 100%)',
        }}
      >
        {/* Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
          }}
        />

        {/* Glow */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.05) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-1.5 sm:p-2 font-mono text-green-400">
          {/* Top row - Global stats */}
          <div className="flex items-center justify-between text-[7px] sm:text-[8px]">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-green-500/60 hidden sm:inline">THREADS:</span>
              <span className="text-green-500/60 sm:hidden">THR:</span>
              <span className="font-bold">{activeThreads}/{totalThreads}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-green-500/60 hidden sm:inline">CALLS:</span>
              <span className="text-green-500/60 sm:hidden">C:</span>
              <span className="font-bold">{formatTokens(toolCalls)}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-green-500/60 hidden sm:inline">COST:</span>
              <span className="text-green-500/60 sm:hidden">$:</span>
              <span className="font-bold">{formatCost(cost)}</span>
            </div>
          </div>

          {/* Middle - Selected thread or idle */}
          <div className="flex-1 flex items-center justify-center">
            {selectedThread ? (
              <div className="text-center">
                <div className="text-[9px] sm:text-[10px] font-bold text-green-300 mb-0.5 truncate max-w-full">
                  {selectedThread.name}
                </div>
                <div className="text-[7px] sm:text-[8px] text-green-500/80">
                  {THREAD_TYPE_NAMES[selectedThread.type]} • {MODEL_INFO[selectedThread.model].name}
                </div>
                {/* Progress bar */}
                <div className="w-24 sm:w-32 h-1 bg-green-950/50 rounded-full mt-1.5 mx-auto overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #22c55e 0%, #4ade80 100%)',
                      boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
                    }}
                    animate={{ width: `${selectedThread.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-[6px] sm:text-[7px] text-green-500/60 mt-1">
                  {selectedThread.status.toUpperCase()} • {selectedThread.progress}%
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-[9px] sm:text-[10px] text-green-500/60">NO THREAD SELECTED</div>
                <div className="text-[7px] sm:text-[8px] text-green-500/40">Select or create a thread</div>
              </div>
            )}
          </div>

          {/* Bottom row - Efficiency meter */}
          <div className="flex items-center justify-between text-[6px] sm:text-[7px]">
            <div className="flex items-center gap-1">
              <Gauge className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500/60" />
              <span className="text-green-500/60 hidden sm:inline">EFFICIENCY:</span>
              <span className="text-green-500/60 sm:hidden">EFF:</span>
            </div>
            <div className="flex-1 mx-2 h-1 bg-green-950/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: efficiency > 50
                    ? 'linear-gradient(90deg, #22c55e 0%, #4ade80 100%)'
                    : efficiency > 25
                    ? 'linear-gradient(90deg, #eab308 0%, #facc15 100%)'
                    : 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)',
                }}
                animate={{ width: `${Math.min(efficiency, 100)}%` }}
              />
            </div>
            <span className="font-bold text-green-300">{efficiency.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// Parallel Spawn Dial
// ============================================================================

interface ParallelSpawnDialProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

const ParallelSpawnDial = memo(function ParallelSpawnDial({
  value,
  onChange,
  max = 10,
}: ParallelSpawnDialProps) {
  const handleIncrement = () => onChange(Math.min(value + 1, max));
  const handleDecrement = () => onChange(Math.max(value - 1, 1));

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-0.5 sm:gap-1">
        <button
          onClick={handleDecrement}
          className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 flex items-center justify-center text-[10px] sm:text-xs font-bold"
        >
          -
        </button>
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-mono text-base sm:text-lg font-bold"
          style={{
            background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
            color: value > 1 ? '#3b82f6' : '#ffffff60',
            textShadow: value > 1 ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none',
          }}
        >
          {value}
        </div>
        <button
          onClick={handleIncrement}
          className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 flex items-center justify-center text-[10px] sm:text-xs font-bold"
        >
          +
        </button>
      </div>
      <div className="text-[5px] sm:text-[6px] text-white/40 uppercase tracking-wide">Spawn</div>
    </div>
  );
});

// ============================================================================
// Main Thread Control Deck
// ============================================================================

export function ThreadControlDeck({
  activeThreads = 0,
  totalThreads = 0,
  totalToolCalls = 0,
  totalCost = 0,
  efficiency = 0,
  selectedThread,
  onCreateThread,
  onStartThread,
  onPauseThread,
  onStopThread,
  onFuseThreads,
  onSpawnParallel,
  onModelChange,
  onSettingsOpen,
  className = '',
}: ThreadControlDeckProps) {
  const [selectedType, setSelectedType] = useState<ThreadType>('base');
  const [spawnCount, setSpawnCount] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          onCreateThread?.(selectedType);
          break;
        case ' ':
          e.preventDefault();
          if (selectedThread?.status === 'running') {
            onPauseThread?.();
            setIsPlaying(false);
          } else {
            onStartThread?.();
            setIsPlaying(true);
          }
          break;
        case 's':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            onStopThread?.();
            setIsPlaying(false);
          }
          break;
        case 'f':
          e.preventDefault();
          onFuseThreads?.();
          break;
        case 'p':
          e.preventDefault();
          onSpawnParallel?.(spawnCount);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedType, spawnCount, selectedThread, onCreateThread, onStartThread, onPauseThread, onStopThread, onFuseThreads, onSpawnParallel]);

  return (
    <div className={`relative w-full max-w-sm sm:max-w-md mx-auto px-2 sm:px-0 ${className}`}>
      {/* Main chassis */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #d4d4d4 0%, #a8a8a8 5%, #c0c0c0 50%, #a0a0a0 95%, #888888 100%)',
          boxShadow: `
            0 20px 50px rgba(0,0,0,0.5),
            0 10px 20px rgba(0,0,0,0.3),
            inset 0 2px 0 rgba(255,255,255,0.6),
            inset 0 -2px 0 rgba(0,0,0,0.2)
          `,
        }}
      >
        {/* Top highlight */}
        <div
          className="absolute top-0 left-3 right-3 h-px z-10"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.8) 80%, transparent)',
          }}
        />

        {/* Inner panel */}
        <div className="p-3 sm:p-4">
          {/* LED Display */}
          <div className="mb-3 sm:mb-4 h-20 sm:h-24">
            <LEDMatrixDisplay
              activeThreads={activeThreads}
              totalThreads={totalThreads}
              toolCalls={totalToolCalls}
              cost={totalCost}
              efficiency={efficiency}
              selectedThread={selectedThread}
            />
          </div>

          {/* Main controls row */}
          <div className="flex items-end justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
            {/* Thread type selector */}
            <ThreadTypeSelector selected={selectedType} onChange={setSelectedType} />

            {/* Center - Transport controls */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-2">
                <TactileButton
                  size="md"
                  variant="success"
                  icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  label={isPlaying ? 'Pause' : 'Start'}
                  active={isPlaying}
                  shortcut="␣"
                  onClick={() => {
                    if (isPlaying) {
                      onPauseThread?.();
                    } else {
                      onStartThread?.();
                    }
                    setIsPlaying(!isPlaying);
                  }}
                />
                <TactileButton
                  size="md"
                  variant="danger"
                  icon={<Square className="w-4 h-4" />}
                  label="Stop"
                  shortcut="S"
                  onClick={() => {
                    onStopThread?.();
                    setIsPlaying(false);
                  }}
                />
              </div>
              <div className="text-[5px] sm:text-[6px] text-zinc-500 uppercase tracking-wide">Transport</div>
            </div>

            {/* Parallel spawn dial */}
            <ParallelSpawnDial value={spawnCount} onChange={setSpawnCount} />
          </div>

          {/* Action buttons row */}
          <div className="grid grid-cols-5 gap-1 sm:gap-2 mb-2 sm:mb-3">
            <TactileButton
              size="md"
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              label="New"
              shortcut="N"
              onClick={() => onCreateThread?.(selectedType)}
              className="!w-full"
            />
            <TactileButton
              size="md"
              icon={<Layers className="w-4 h-4" />}
              label="Spawn"
              shortcut="P"
              onClick={() => onSpawnParallel?.(spawnCount)}
              glow="rgba(59, 130, 246, 0.3)"
              className="!w-full"
            />
            <TactileButton
              size="md"
              icon={<GitMerge className="w-4 h-4" />}
              label="Fuse"
              shortcut="F"
              onClick={onFuseThreads}
              glow="rgba(168, 85, 247, 0.3)"
              className="!w-full"
            />
            <TactileButton
              size="md"
              icon={<RefreshCw className="w-4 h-4" />}
              label="Retry"
              className="!w-full"
            />
            <TactileButton
              size="md"
              icon={<Settings className="w-4 h-4" />}
              label="Config"
              onClick={onSettingsOpen}
              className="!w-full"
            />
          </div>

          {/* Thread type quick buttons */}
          <div className="flex gap-1 sm:gap-1.5">
            {THREAD_TYPES.map((type) => {
              const colors = THREAD_TYPE_COLORS[type];
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex-1 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[6px] sm:text-[7px] font-bold tracking-wider uppercase transition-all ${
                    isSelected ? `${colors.bg} text-white` : `bg-zinc-800/50 ${colors.text} hover:bg-zinc-700/50`
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 0 12px ${colors.glow}` : 'none',
                  }}
                >
                  {type.charAt(0).toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Side ports */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-8 rounded-r"
          style={{
            background: 'linear-gradient(90deg, #2a2a2a, #3a3a3a)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
          }}
        />
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-8 rounded-l"
          style={{
            background: 'linear-gradient(90deg, #3a3a3a, #2a2a2a)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
          }}
        />
      </div>
    </div>
  );
}

export default ThreadControlDeck;
