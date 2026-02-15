'use client';

import { useState, useRef, useCallback, memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Square,
  Circle,
  Repeat,
  SkipBack,
  SkipForward,
  Scissors,
  Copy,
  ClipboardPaste,
  CopyPlus,
  Undo,
  Redo,
  Trash2,
  Plus,
  Sparkles,
  Upload,
  Download,
  Grid3X3,
  Sliders,
  FolderOpen,
  ZoomIn,
  ZoomOut,
  Mic,
  Volume2,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface JamzControlDeckProps {
  // State
  isPlaying?: boolean;
  isRecording?: boolean;
  loopEnabled?: boolean;
  bpm?: number;
  zoom?: number;
  currentView?: 'arrange' | 'mixer' | 'browser';
  projectName?: string;
  trackCount?: number;

  // Transport
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onRecord?: () => void;
  onLoopToggle?: () => void;
  onRewind?: () => void;
  onForward?: () => void;

  // Editing
  onCut?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDuplicate?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;

  // Navigation
  onViewChange?: (view: 'arrange' | 'mixer' | 'browser') => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;

  // Creation
  onAddTrack?: () => void;
  onGenerate?: () => void;
  onImport?: () => void;
  onExport?: () => void;

  // BPM & Zoom knobs
  onBpmChange?: (bpm: number) => void;
  onZoomChange?: (zoom: number) => void;

  className?: string;
}

// ============================================================================
// Tactile Button Component
// ============================================================================

interface TactileButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger' | 'glow' | 'transport';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'wide';
  icon?: React.ReactNode;
  label?: string;
  shortcut?: string;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
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
  className = '',
  ariaLabel,
}: TactileButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    xs: 'min-w-[32px] h-8',
    sm: 'min-w-[40px] h-9',
    md: 'min-w-[48px] h-10',
    lg: 'min-w-[56px] h-11',
    wide: 'w-full h-9',
  };

  const handlePress = () => {
    if (disabled) return;
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    onClick?.();
  };

  const getVariantColors = () => {
    if (variant === 'danger' && active) {
      return {
        bg: 'linear-gradient(180deg, #2d1f1f 0%, #1f1515 50%, #1a1010 100%)',
        glow: 'rgba(239, 68, 68, 0.4)',
        text: 'text-red-400',
      };
    }
    if (variant === 'glow' && active) {
      return {
        bg: 'linear-gradient(180deg, #1f2d1f 0%, #152015 50%, #101a10 100%)',
        glow: 'rgba(74, 222, 128, 0.4)',
        text: 'text-green-400',
      };
    }
    if (variant === 'transport' && active) {
      return {
        bg: 'linear-gradient(180deg, #1f1f2d 0%, #151520 50%, #10101a 100%)',
        glow: 'rgba(139, 92, 246, 0.4)',
        text: 'text-violet-400',
      };
    }
    return {
      bg: 'linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 50%, #1a1a1a 100%)',
      glow: 'transparent',
      text: 'text-white/60',
    };
  };

  const colors = getVariantColors();

  return (
    <motion.button
      className={`
        relative flex flex-col items-center justify-center gap-0.5
        rounded-lg select-none overflow-hidden touch-manipulation
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={handlePress}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => !disabled && setIsPressed(true)}
      onTouchEnd={handlePress}
      animate={{ y: isPressed ? 2 : 0 }}
      transition={{ type: 'spring', stiffness: 800, damping: 20 }}
      aria-label={ariaLabel || label}
      aria-pressed={active}
      disabled={disabled}
    >
      {/* Button base shadow */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
          transform: 'translateY(3px)',
          opacity: isPressed ? 0.3 : 1,
        }}
      />

      {/* Glow effect */}
      {active && (
        <div
          className="absolute inset-0 rounded-lg opacity-100"
          style={{
            background: `radial-gradient(ellipse at center bottom, ${colors.glow} 0%, transparent 70%)`,
            filter: 'blur(6px)',
          }}
        />
      )}

      {/* Button body */}
      <div
        className="absolute inset-0 rounded-lg overflow-hidden"
        style={{
          background: colors.bg,
          boxShadow: isPressed
            ? 'inset 0 2px 4px rgba(0,0,0,0.5), inset 0 -1px 1px rgba(255,255,255,0.05)'
            : 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.3)',
          transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
        }}
      >
        {/* Top highlight */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.15) 50%, transparent 90%)' }}
        />

        {/* Active glow animation */}
        {active && (variant === 'danger' || variant === 'glow' || variant === 'transport') && (
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: `radial-gradient(ellipse at center, ${colors.glow} 0%, transparent 70%)`,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center gap-0.5"
        style={{ transform: isPressed ? 'translateY(2px)' : 'translateY(0)' }}
      >
        {icon && <span className={`transition-colors ${colors.text}`}>{icon}</span>}
        {label && (
          <span className={`text-[7px] font-bold tracking-wider uppercase leading-tight text-center transition-colors ${colors.text}`}>
            {label}
          </span>
        )}
        {children}
      </div>

      {/* Keyboard shortcut hint */}
      {shortcut && (
        <div
          className="absolute bottom-0.5 right-0.5 px-1 py-px rounded text-[6px] font-mono bg-black/30 text-white/40 z-20"
          style={{ transform: isPressed ? 'translateY(2px)' : 'translateY(0)' }}
        >
          {shortcut}
        </div>
      )}
    </motion.button>
  );
});

// ============================================================================
// Rotary Knob Component
// ============================================================================

interface RotaryKnobProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange?: (value: number) => void;
  displayValue?: string;
  size?: 'sm' | 'md';
}

const RotaryKnob = memo(function RotaryKnob({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  displayValue,
  size = 'sm',
}: RotaryKnobProps) {
  const [isDragging, setIsDragging] = useState(false);
  const lastY = useRef(0);
  const accumulatedDelta = useRef(0);

  const knobSize = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';

  // Calculate rotation (-135 to +135 degrees)
  const range = max - min;
  const normalized = (value - min) / range;
  const currentRotation = -135 + (normalized * 270);

  const handleDrag = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const delta = lastY.current - clientY;
    lastY.current = clientY;

    accumulatedDelta.current += delta;
    const threshold = 5;

    if (Math.abs(accumulatedDelta.current) >= threshold) {
      const change = Math.sign(accumulatedDelta.current) * step;
      const newValue = Math.max(min, Math.min(max, value + change));
      if (newValue !== value) {
        onChange?.(newValue);
      }
      accumulatedDelta.current = 0;
    }
  }, [isDragging, value, min, max, step, onChange]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    accumulatedDelta.current = 0;
    window.removeEventListener('mousemove', handleDrag);
    window.removeEventListener('mouseup', handleEnd);
    window.removeEventListener('touchmove', handleDrag);
    window.removeEventListener('touchend', handleEnd);
  }, [handleDrag]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    accumulatedDelta.current = 0;
    lastY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleDrag);
    window.addEventListener('touchend', handleEnd);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`${knobSize} relative`}>
        {/* Knob container */}
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing rounded-full touch-manipulation"
          onMouseDown={handleStart}
          onTouchStart={handleStart}
        >
          {/* Shadow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)',
              transform: 'translateY(2px) scale(1.1)',
              filter: 'blur(2px)',
            }}
          />

          {/* Knob body */}
          <motion.div
            className="absolute inset-1 rounded-full overflow-hidden"
            animate={{ rotate: currentRotation }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              background: 'linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 30%, #1a1a1a 70%, #0f0f0f 100%)',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.5)',
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
              className="absolute top-1 left-1/2 w-0.5 h-1.5 -translate-x-1/2 rounded-full bg-violet-400"
              style={{ boxShadow: '0 0 4px rgba(139, 92, 246, 0.6)' }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Label */}
      <div className="flex flex-col items-center">
        <span className="text-[7px] font-bold tracking-wider uppercase text-white/40">{label}</span>
        <span className="text-[9px] font-mono text-violet-400/80">{displayValue || value}</span>
      </div>
    </div>
  );
});

// ============================================================================
// LED Display Component
// ============================================================================

interface LEDDisplayProps {
  projectName: string;
  isPlaying: boolean;
  isRecording: boolean;
  bpm: number;
  trackCount: number;
  currentView: string;
}

const LEDDisplay = memo(function LEDDisplay({
  projectName,
  isPlaying,
  isRecording,
  bpm,
  trackCount,
  currentView,
}: LEDDisplayProps) {
  const status = isRecording ? 'REC' : isPlaying ? 'PLAY' : 'STOP';
  const statusColor = isRecording ? 'text-red-400' : isPlaying ? 'text-green-400' : 'text-white/60';

  return (
    <div
      className="relative w-full h-12 rounded-lg overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0f0a 0%, #050805 100%)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), inset 0 -1px 1px rgba(255,255,255,0.05)',
      }}
    >
      {/* Screen bezel */}
      <div
        className="absolute inset-0.5 rounded-md overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0a120a 0%, #040804 100%)' }}
      >
        {/* Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)' }}
        />

        {/* Glow */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.05) 0%, transparent 70%)' }}
        />

        {/* Content */}
        <div className="relative h-full flex items-center justify-between px-2 font-mono">
          {/* Left: Project name */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-violet-400 text-[10px] font-bold truncate max-w-[80px]">
              {projectName}
            </span>
            <span className="text-white/30 text-[8px]">|</span>
            <span className="text-white/50 text-[8px] uppercase">{currentView}</span>
          </div>

          {/* Right: Status */}
          <div className="flex items-center gap-3">
            <span className="text-violet-400/80 text-[9px]">{bpm} BPM</span>
            <span className="text-white/50 text-[8px]">{trackCount} TRK</span>
            <motion.span
              className={`text-[10px] font-bold ${statusColor}`}
              animate={isRecording ? { opacity: [1, 0.3, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {status}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// Main Control Deck
// ============================================================================

export const JamzControlDeck = memo(function JamzControlDeck({
  isPlaying = false,
  isRecording = false,
  loopEnabled = false,
  bpm = 120,
  zoom = 100,
  currentView = 'arrange',
  projectName = 'Untitled',
  trackCount = 0,
  onPlay,
  onPause,
  onStop,
  onRecord,
  onLoopToggle,
  onRewind,
  onForward,
  onCut,
  onCopy,
  onPaste,
  onDuplicate,
  onUndo,
  onRedo,
  onDelete,
  onViewChange,
  onZoomIn,
  onZoomOut,
  onAddTrack,
  onGenerate,
  onImport,
  onExport,
  onBpmChange,
  onZoomChange,
  className = '',
}: JamzControlDeckProps) {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if in input fields
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const isMeta = e.metaKey || e.ctrlKey;

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          isPlaying ? onPause?.() : onPlay?.();
          break;
        case 's':
          if (!isMeta) {
            e.preventDefault();
            onStop?.();
          }
          break;
        case 'r':
          if (!isMeta) {
            e.preventDefault();
            onRecord?.();
          }
          break;
        case 'l':
          e.preventDefault();
          onLoopToggle?.();
          break;
        case '[':
        case 'home':
          e.preventDefault();
          onRewind?.();
          break;
        case ']':
        case 'end':
          e.preventDefault();
          onForward?.();
          break;
        case '1':
          if (!isMeta) {
            e.preventDefault();
            onViewChange?.('arrange');
          }
          break;
        case '2':
          if (!isMeta) {
            e.preventDefault();
            onViewChange?.('mixer');
          }
          break;
        case '3':
          if (!isMeta) {
            e.preventDefault();
            onViewChange?.('browser');
          }
          break;
        case '-':
          e.preventDefault();
          onZoomOut?.();
          break;
        case '=':
        case '+':
          e.preventDefault();
          onZoomIn?.();
          break;
        case 'x':
          if (isMeta) {
            e.preventDefault();
            onCut?.();
          }
          break;
        case 'c':
          if (isMeta) {
            e.preventDefault();
            onCopy?.();
          }
          break;
        case 'v':
          if (isMeta) {
            e.preventDefault();
            onPaste?.();
          }
          break;
        case 'd':
          if (isMeta) {
            e.preventDefault();
            onDuplicate?.();
          }
          break;
        case 'z':
          if (isMeta) {
            e.preventDefault();
            if (e.shiftKey) {
              onRedo?.();
            } else {
              onUndo?.();
            }
          }
          break;
        case 'backspace':
        case 'delete':
          e.preventDefault();
          onDelete?.();
          break;
        case 't':
          if (!isMeta) {
            e.preventDefault();
            onAddTrack?.();
          }
          break;
        case 'g':
          if (!isMeta) {
            e.preventDefault();
            onGenerate?.();
          }
          break;
        case 'i':
          if (!isMeta) {
            e.preventDefault();
            onImport?.();
          }
          break;
        case 'e':
          if (!isMeta) {
            e.preventDefault();
            onExport?.();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, onPlay, onPause, onStop, onRecord, onLoopToggle, onRewind, onForward, onViewChange, onZoomIn, onZoomOut, onCut, onCopy, onPaste, onDuplicate, onUndo, onRedo, onDelete, onAddTrack, onGenerate, onImport, onExport]);

  return (
    <div className={`relative w-full max-w-[400px] mx-auto ${className}`}>
      {/* Main chassis */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #d4d4d4 0%, #a8a8a8 5%, #c0c0c0 50%, #a0a0a0 95%, #888888 100%)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -2px 0 rgba(0,0,0,0.2)',
        }}
      >
        {/* Top highlight */}
        <div
          className="absolute top-0 left-3 right-3 h-px z-10"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.8) 80%, transparent)' }}
        />

        {/* Inner panel */}
        <div className="p-2.5">
          {/* LED Display */}
          <div className="mb-2">
            <LEDDisplay
              projectName={projectName}
              isPlaying={isPlaying}
              isRecording={isRecording}
              bpm={bpm}
              trackCount={trackCount}
              currentView={currentView}
            />
          </div>

          {/* Transport Controls Row */}
          <div className="flex items-center gap-1.5 mb-2">
            <TactileButton
              size="sm"
              icon={<SkipBack className="w-3.5 h-3.5" />}
              onClick={onRewind}
              shortcut="["
              ariaLabel="Rewind"
            />
            <TactileButton
              size="md"
              icon={<Square className="w-4 h-4" />}
              label="Stop"
              onClick={onStop}
              shortcut="S"
              ariaLabel="Stop"
            />
            <TactileButton
              size="lg"
              icon={isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              onClick={isPlaying ? onPause : onPlay}
              active={isPlaying}
              variant="transport"
              shortcut="␣"
              ariaLabel={isPlaying ? 'Pause' : 'Play'}
            />
            <TactileButton
              size="md"
              icon={<Circle className="w-4 h-4" />}
              label="Rec"
              onClick={onRecord}
              active={isRecording}
              variant="danger"
              shortcut="R"
              ariaLabel="Record"
            />
            <TactileButton
              size="sm"
              icon={<SkipForward className="w-3.5 h-3.5" />}
              onClick={onForward}
              shortcut="]"
              ariaLabel="Forward"
            />
            <div className="w-px h-8 bg-black/20 mx-1" />
            <TactileButton
              size="sm"
              icon={<Repeat className="w-3.5 h-3.5" />}
              label="Loop"
              onClick={onLoopToggle}
              active={loopEnabled}
              variant="glow"
              shortcut="L"
              ariaLabel="Toggle Loop"
            />
          </div>

          {/* View Tabs & Zoom */}
          <div className="flex items-center gap-1.5 mb-2">
            <TactileButton
              size="sm"
              icon={<Grid3X3 className="w-3.5 h-3.5" />}
              label="Arr"
              onClick={() => onViewChange?.('arrange')}
              active={currentView === 'arrange'}
              variant="glow"
              shortcut="1"
              ariaLabel="Arrange View"
            />
            <TactileButton
              size="sm"
              icon={<Sliders className="w-3.5 h-3.5" />}
              label="Mix"
              onClick={() => onViewChange?.('mixer')}
              active={currentView === 'mixer'}
              variant="glow"
              shortcut="2"
              ariaLabel="Mixer View"
            />
            <TactileButton
              size="sm"
              icon={<FolderOpen className="w-3.5 h-3.5" />}
              label="Brw"
              onClick={() => onViewChange?.('browser')}
              active={currentView === 'browser'}
              variant="glow"
              shortcut="3"
              ariaLabel="Browser View"
            />
            <div className="w-px h-8 bg-black/20 mx-1" />
            <TactileButton
              size="xs"
              icon={<ZoomOut className="w-3 h-3" />}
              onClick={onZoomOut}
              shortcut="-"
              ariaLabel="Zoom Out"
            />
            <TactileButton
              size="xs"
              icon={<ZoomIn className="w-3 h-3" />}
              onClick={onZoomIn}
              shortcut="+"
              ariaLabel="Zoom In"
            />
            <div className="flex-1" />
            <RotaryKnob
              label="BPM"
              value={bpm}
              min={40}
              max={240}
              step={1}
              onChange={onBpmChange}
              displayValue={`${bpm}`}
            />
          </div>

          {/* Edit Controls Row */}
          <div className="flex items-center gap-1.5 mb-2">
            <TactileButton
              size="xs"
              icon={<Scissors className="w-3 h-3" />}
              label="Cut"
              onClick={onCut}
              shortcut="⌘X"
              ariaLabel="Cut"
            />
            <TactileButton
              size="xs"
              icon={<Copy className="w-3 h-3" />}
              label="Copy"
              onClick={onCopy}
              shortcut="⌘C"
              ariaLabel="Copy"
            />
            <TactileButton
              size="xs"
              icon={<ClipboardPaste className="w-3 h-3" />}
              label="Paste"
              onClick={onPaste}
              shortcut="⌘V"
              ariaLabel="Paste"
            />
            <TactileButton
              size="xs"
              icon={<CopyPlus className="w-3 h-3" />}
              label="Dup"
              onClick={onDuplicate}
              shortcut="⌘D"
              ariaLabel="Duplicate"
            />
            <div className="w-px h-8 bg-black/20 mx-1" />
            <TactileButton
              size="xs"
              icon={<Undo className="w-3 h-3" />}
              label="Undo"
              onClick={onUndo}
              shortcut="⌘Z"
              ariaLabel="Undo"
            />
            <TactileButton
              size="xs"
              icon={<Redo className="w-3 h-3" />}
              label="Redo"
              onClick={onRedo}
              shortcut="⇧⌘Z"
              ariaLabel="Redo"
            />
            <TactileButton
              size="xs"
              icon={<Trash2 className="w-3 h-3" />}
              label="Del"
              onClick={onDelete}
              shortcut="⌫"
              ariaLabel="Delete"
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-1.5">
            <TactileButton
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              label="Track"
              onClick={onAddTrack}
              shortcut="T"
              ariaLabel="Add Track"
            />
            <TactileButton
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5" />}
              label="AI"
              onClick={onGenerate}
              variant="glow"
              shortcut="G"
              ariaLabel="AI Generate"
            />
            <TactileButton
              size="sm"
              icon={<Upload className="w-3.5 h-3.5" />}
              label="Import"
              onClick={onImport}
              shortcut="I"
              ariaLabel="Import"
            />
            <div className="flex-1" />
            <TactileButton
              size="md"
              icon={<Download className="w-4 h-4" />}
              label="Export"
              onClick={onExport}
              variant="glow"
              shortcut="E"
              ariaLabel="Export"
              className="!min-w-[60px]"
            />
          </div>
        </div>

        {/* Side ports */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-r"
          style={{ background: 'linear-gradient(90deg, #2a2a2a, #3a3a3a)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}
        />
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-l"
          style={{ background: 'linear-gradient(90deg, #3a3a3a, #2a2a2a)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}
        />
      </div>
    </div>
  );
});

export default JamzControlDeck;
