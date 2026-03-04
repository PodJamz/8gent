'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Check, ThumbsUp, MessageSquare, CornerDownLeft, Trash2, RotateCcw, Mic } from 'lucide-react';
import { RalphIcon } from '@/components/icons/RalphIcon';

// ============================================================================
// Types
// ============================================================================

interface ControlDeckProps {
  taskName?: string;
  progress?: number;
  model?: string;
  subscription?: number;
  onAcceptChanges?: () => void;
  onApproveAction?: () => void;
  onRalphMode?: (enabled: boolean) => void;
  onOpenChat?: () => void;
  onEnter?: () => void;
  onDiscard?: () => void;
  onRetry?: () => void;
  onVoice?: () => void;
  onSuggestPrompt?: () => void;
  onModelChange?: (level: number) => void;
  className?: string;
}

// ============================================================================
// Tactile Button Component
// ============================================================================

interface TactileButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'wide';
  icon?: React.ReactNode;
  label?: string;
  shortcut?: string;
  active?: boolean;
  className?: string;
}

function TactileButton({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  icon,
  label,
  shortcut,
  active = false,
  className = '',
}: TactileButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: 'min-w-[48px] h-11',
    md: 'min-w-[56px] h-12',
    lg: 'min-w-[72px] h-12',
    wide: 'w-full h-10',
  };

  const handlePress = () => {
    setIsPressed(true);
    // Haptic feedback simulation via slight delay
    setTimeout(() => setIsPressed(false), 150);
    onClick?.();
  };

  return (
    <motion.button
      className={`
        relative flex flex-col items-center justify-center gap-1
        rounded-lg select-none overflow-hidden
        ${sizeClasses[size]}
        ${className}
      `}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={handlePress}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={handlePress}
      animate={{
        y: isPressed ? 2 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 800,
        damping: 20,
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Button base shadow */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
          transform: 'translateY(4px)',
          opacity: isPressed ? 0.3 : 1,
          transition: 'opacity 0.1s',
        }}
      />

      {/* Button body glow */}
      <div
        className={`
          absolute inset-0 rounded-lg
          ${(variant === 'danger' && active) || (variant === 'glow' && active) ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          background: variant === 'danger'
            ? 'radial-gradient(ellipse at center bottom, rgba(239, 68, 68, 0.4) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center bottom, rgba(74, 222, 128, 0.4) 0%, transparent 70%)',
          filter: 'blur(8px)',
          transition: 'opacity 0.3s',
        }}
      />

      <div
        className="absolute inset-0 rounded-lg overflow-hidden"
        style={{
          background: variant === 'danger' && active
            ? 'linear-gradient(180deg, #2d1f1f 0%, #1f1515 50%, #1a1010 100%)'
            : variant === 'glow' && active
            ? 'linear-gradient(180deg, #1f2d1f 0%, #152015 50%, #101a10 100%)'
            : 'linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 50%, #1a1a1a 100%)',
          boxShadow: isPressed
            ? 'inset 0 2px 4px rgba(0,0,0,0.5), inset 0 -1px 1px rgba(255,255,255,0.05)'
            : 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.3)',
          transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
          transition: 'transform 0.1s, box-shadow 0.1s, background 0.2s',
        }}
      >
        {/* Top edge highlight */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.15) 50%, transparent 90%)',
          }}
        />

        {/* Red glow for danger/Ralph button */}
        {variant === 'danger' && active && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.3) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Green glow for active buttons */}
        {variant === 'glow' && active && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(74, 222, 128, 0.25) 0%, transparent 70%)',
            }}
          />
        )}
      </div>

      {/* Button content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center gap-0.5"
        style={{
          transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
          transition: 'transform 0.1s',
        }}
      >
        {icon && (
          <span className={`transition-colors ${
            variant === 'danger' && active ? 'text-red-400' :
            variant === 'glow' && active ? 'text-green-400' :
            'text-white/70'
          }`}>
            {icon}
          </span>
        )}
        {label && (
          <span
            className={`text-[8px] font-bold tracking-wider uppercase leading-tight text-center transition-colors ${
              variant === 'danger' && active ? 'text-red-400' :
              variant === 'glow' && active ? 'text-green-400' :
              'text-white/60'
            }`}
          >
            {label}
          </span>
        )}
        {children}
      </div>

      {/* Keyboard shortcut hint */}
      {shortcut && (
        <div
          className="absolute bottom-0.5 right-0.5 px-1 py-px rounded text-[6px] font-mono bg-black/30 text-white/40 z-20"
          style={{
            transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
            transition: 'transform 0.1s',
          }}
        >
          {shortcut}
        </div>
      )}
    </motion.button>
  );
}

// ============================================================================
// Rotary Knob Component with 12-point detents
// ============================================================================

interface RotaryKnobProps {
  label: string;
  onChange?: (value: number, detent: number) => void;
  size?: 'sm' | 'md';
  detents?: number;
}

function RotaryKnob({ label, onChange, size = 'md', detents = 12 }: RotaryKnobProps) {
  const knobRef = useRef<HTMLDivElement>(null);
  const [currentDetent, setCurrentDetent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastY = useRef(0);
  const accumulatedDelta = useRef(0);

  const knobSize = size === 'sm' ? 'w-8 h-8' : 'w-11 h-11';
  const knurledLines = 16;

  // Calculate rotation angle for current detent (270 degree range, from -135 to +135)
  const degreesPerDetent = 270 / (detents - 1);
  const currentRotation = -135 + (currentDetent * degreesPerDetent);

  const snapToDetent = useCallback((newDetent: number) => {
    const clampedDetent = Math.max(0, Math.min(detents - 1, newDetent));
    if (clampedDetent !== currentDetent) {
      setCurrentDetent(clampedDetent);
      // Normalize to 0-100
      const normalized = (clampedDetent / (detents - 1)) * 100;
      onChange?.(normalized, clampedDetent);
    }
  }, [currentDetent, detents, onChange]);

  const handleDrag = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const delta = lastY.current - clientY;
    lastY.current = clientY;

    // Accumulate delta and snap when threshold reached
    accumulatedDelta.current += delta;
    const threshold = 15; // pixels needed to move one detent

    if (Math.abs(accumulatedDelta.current) >= threshold) {
      const detentChange = Math.sign(accumulatedDelta.current);
      snapToDetent(currentDetent + detentChange);
      accumulatedDelta.current = 0;
    }
  }, [isDragging, currentDetent, snapToDetent]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    accumulatedDelta.current = 0;
    lastY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleDrag);
    window.addEventListener('touchend', handleEnd);
  };

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    accumulatedDelta.current = 0;
    window.removeEventListener('mousemove', handleDrag);
    window.removeEventListener('mouseup', handleEnd);
    window.removeEventListener('touchmove', handleDrag);
    window.removeEventListener('touchend', handleEnd);
  }, [handleDrag]);

  // Click to increment
  const handleClick = () => {
    if (!isDragging) {
      snapToDetent((currentDetent + 1) % detents);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Detent markers around knob */}
      <div className={`${knobSize} relative`}>
        {/* Detent indicator dots */}
        {[...Array(detents)].map((_, i) => {
          const angle = -135 + (i * degreesPerDetent);
          const radian = (angle - 90) * (Math.PI / 180);
          const radius = size === 'sm' ? 18 : 24;
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;
          const isActive = i <= currentDetent;

          return (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full transition-all duration-150 ${
                isActive ? 'bg-green-400 shadow-[0_0_4px_rgba(74,222,128,0.6)]' : 'bg-white/20'
              }`}
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            />
          );
        })}

        {/* Knob container */}
        <motion.div
          ref={knobRef}
          className={`absolute inset-1 cursor-grab active:cursor-grabbing rounded-full`}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          onClick={handleClick}
          style={{
            perspective: '200px',
          }}
        >
          {/* Knob shadow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)',
              transform: 'translateY(3px) scale(1.1)',
              filter: 'blur(3px)',
            }}
          />

          {/* Knob body */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            animate={{ rotate: currentRotation }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
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
              {[...Array(knurledLines)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-px bg-white/10"
                  style={{
                    transform: `rotate(${(i * 180) / knurledLines}deg)`,
                  }}
                />
              ))}
            </div>

            {/* Center cap */}
            <div
              className="absolute inset-1.5 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1), inset 0 -1px 2px rgba(0,0,0,0.3)',
              }}
            />

            {/* Indicator line */}
            <div
              className="absolute top-0.5 left-1/2 w-0.5 h-1.5 -translate-x-1/2 rounded-full bg-green-400"
              style={{
                boxShadow: '0 0 4px rgba(74,222,128,0.6)',
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Label with current value */}
      <div className="flex flex-col items-center">
        <span className="text-[7px] font-bold tracking-wider uppercase text-white/40 text-center leading-tight">
          {label}
        </span>
        <span className="text-[8px] font-mono text-green-400/80">
          {currentDetent + 1}/{detents}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Toggle Switch Component
// ============================================================================

interface ToggleSwitchProps {
  label: string;
  onChange?: (position: 'high' | 'low') => void;
}

function ToggleSwitch({ label, onChange }: ToggleSwitchProps) {
  const [position, setPosition] = useState<'high' | 'low'>('low');

  const toggle = () => {
    const newPos = position === 'high' ? 'low' : 'high';
    setPosition(newPos);
    onChange?.(newPos);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Position labels */}
      <span className="text-[6px] font-bold tracking-wider uppercase text-green-500/60">HI</span>

      {/* Switch housing */}
      <div
        className="relative w-4 h-10 rounded-full cursor-pointer"
        onClick={toggle}
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), inset 0 -1px 1px rgba(255,255,255,0.05)',
        }}
      >
        {/* Switch track */}
        <div
          className="absolute inset-0.5 rounded-full"
          style={{
            background: 'linear-gradient(180deg, #0a0a0a 0%, #151515 100%)',
          }}
        />

        {/* Switch handle */}
        <motion.div
          className="absolute left-0.5 w-3 h-3 rounded-full"
          animate={{
            top: position === 'high' ? 3 : 26,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
          style={{
            background: 'linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.3)',
          }}
        />
      </div>

      <span className="text-[6px] font-bold tracking-wider uppercase text-white/40">LO</span>
    </div>
  );
}

// ============================================================================
// LED Display Component
// ============================================================================

interface LEDDisplayProps {
  taskName: string;
  progress: number;
  model: string;
  subscription: number;
  lastAction?: string;
}

function LEDDisplay({ taskName, progress, model, subscription, lastAction = 'READY' }: LEDDisplayProps) {
  return (
    <div
      className="relative w-full h-16 rounded-lg overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0f0a 0%, #050805 100%)',
        boxShadow: `
          inset 0 2px 4px rgba(0,0,0,0.8),
          inset 0 -1px 1px rgba(255,255,255,0.05),
          0 1px 0 rgba(255,255,255,0.05)
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
        {/* Scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
          }}
        />

        {/* Screen glow */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.05) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-3 py-1.5 font-mono">
          {/* Top row: Task and Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-green-500/80 text-[9px] tracking-wide">TASK:</span>
              <span className="text-green-400 text-[9px] font-bold tracking-wide uppercase">
                {taskName}
              </span>
            </div>
            <motion.span
              key={lastAction}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-green-300 text-[9px] font-bold tracking-wide"
            >
              [{lastAction}]
            </motion.span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-green-950/50 rounded-full mt-1 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #22c55e 0%, #4ade80 100%)',
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          {/* Bottom row: Model and Stats */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <span className="text-green-500/80 text-[8px] tracking-wide">MODEL:</span>
              <motion.span
                key={model}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-400 text-[8px] font-bold tracking-wide uppercase"
              >
                {model}
              </motion.span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-[8px] font-bold">{progress}%</span>
              <span className="text-green-500/60 text-[8px]">|</span>
              <span className="text-green-500/80 text-[8px]">SUB:</span>
              <span className="text-green-400 text-[8px] font-bold">{subscription}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Control Deck Component
// ============================================================================

const MODELS = ['HAIKU', 'SONNET', 'OPUS', 'OPUS 4.5'];
const TASKS = ['IDLE', 'ANALYZING', 'CODING', 'REVIEWING', 'REFACTORING', 'TESTING', 'DEPLOYING'];

export function ControlDeck({
  taskName: initialTaskName = 'CODE REFACTOR',
  progress: initialProgress = 60,
  model: initialModel = 'CLAUDE OPUS 4.5',
  subscription = 85,
  onAcceptChanges,
  onApproveAction,
  onRalphMode,
  onOpenChat,
  onEnter,
  onDiscard,
  onRetry,
  onVoice,
  onSuggestPrompt,
  onModelChange,
  className = '',
}: ControlDeckProps) {
  // Internal state
  const [ralphActive, setRalphActive] = useState(false);
  const [acceptActive, setAcceptActive] = useState(false);
  const [approveActive, setApproveActive] = useState(false);
  const [chatActive, setChatActive] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [currentTask, setCurrentTask] = useState(initialTaskName);
  const [currentProgress, setCurrentProgress] = useState(initialProgress);
  const [currentModel, setCurrentModel] = useState(initialModel);
  const [modelLevel, setModelLevel] = useState<'high' | 'low'>('low');
  const [lastAction, setLastAction] = useState('READY');

  // Button handlers with visual feedback
  const handleAccept = () => {
    setAcceptActive(true);
    setLastAction('ACCEPTED');
    setCurrentProgress(prev => Math.min(100, prev + 10));
    setTimeout(() => setAcceptActive(false), 500);
    onAcceptChanges?.();
  };

  const handleApprove = () => {
    setApproveActive(true);
    setLastAction('APPROVED');
    setCurrentProgress(prev => Math.min(100, prev + 5));
    setTimeout(() => setApproveActive(false), 500);
    onApproveAction?.();
  };

  const handleRalphToggle = () => {
    const newState = !ralphActive;
    setRalphActive(newState);
    setLastAction(newState ? 'RALPH LOOP' : 'RALPH OFF');
    onRalphMode?.(newState);
  };

  const handleEnter = () => {
    setLastAction('EXECUTING');
    setCurrentProgress(prev => Math.min(100, prev + 15));
    // Cycle through tasks
    setCurrentTask(TASKS[(TASKS.indexOf(currentTask) + 1) % TASKS.length] || TASKS[1]);
    onEnter?.();
  };

  const handleChat = () => {
    setChatActive(!chatActive);
    setLastAction(chatActive ? 'CHAT CLOSED' : 'CHAT OPEN');
    onOpenChat?.();
  };

  const handleDiscard = () => {
    setLastAction('DISCARDED');
    setCurrentProgress(Math.max(0, currentProgress - 20));
    setAcceptActive(false);
    setApproveActive(false);
    onDiscard?.();
  };

  const handleRetry = () => {
    setLastAction('RETRYING');
    setCurrentProgress(Math.max(0, currentProgress - 10));
    onRetry?.();
  };

  const handleVoice = () => {
    setVoiceActive(!voiceActive);
    setLastAction(voiceActive ? 'MIC OFF' : 'MIC ON');
    onVoice?.();
  };

  const handleSuggest = () => {
    setLastAction('SUGGESTING');
    onSuggestPrompt?.();
  };

  const handleModelSwitch = (pos: 'high' | 'low') => {
    setModelLevel(pos);
    const modelIdx = pos === 'high' ? 3 : 1;
    setCurrentModel(`CLAUDE ${MODELS[modelIdx]}`);
    setLastAction(`MODEL: ${MODELS[modelIdx]}`);
    onModelChange?.(pos === 'high' ? 100 : 0);
  };

  const handleKnobChange = (value: number, detent: number) => {
    const modelIdx = Math.floor((detent / 11) * 3);
    setCurrentModel(`CLAUDE ${MODELS[Math.min(modelIdx, 3)]}`);
    onModelChange?.(value);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if in input fields
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.key.toLowerCase()) {
        case 'a':
          e.preventDefault();
          handleAccept();
          break;
        case 'p':
          e.preventDefault();
          handleApprove();
          break;
        case 'y':
          e.preventDefault();
          handleRalphToggle();
          break;
        case 'enter':
          e.preventDefault();
          handleEnter();
          break;
        case 'c':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            handleChat();
          }
          break;
        case 'd':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            handleDiscard();
          }
          break;
        case 'r':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            handleRetry();
          }
          break;
        case 'm':
          e.preventDefault();
          handleVoice();
          break;
        case '/':
          e.preventDefault();
          handleSuggest();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ralphActive, chatActive, voiceActive, currentTask, currentProgress]);

  return (
    <div
      className={`relative w-full max-w-[320px] sm:max-w-[360px] mx-auto px-2 sm:px-0 ${className}`}
      style={{
        perspective: '1000px',
      }}
    >
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
        {/* Top edge highlight */}
        <div
          className="absolute top-0 left-3 right-3 h-px z-10"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.8) 80%, transparent)',
          }}
        />

        {/* Inner panel area */}
        <div className="p-2 sm:p-3">
          {/* LED Display */}
          <div className="mb-3">
            <LEDDisplay
              taskName={currentTask}
              progress={currentProgress}
              model={currentModel}
              subscription={subscription}
              lastAction={lastAction}
            />
          </div>

          {/* Main action buttons - 5 equal buttons in a row, 3+2 on very small screens */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-3">
            <TactileButton
              size="md"
              icon={<Check className="w-4 h-4" />}
              label="Accept"
              onClick={handleAccept}
              active={acceptActive}
              variant={acceptActive ? 'glow' : 'default'}
              shortcut="A"
              className="!w-full"
            >
              <span className="sr-only">Accept Changes</span>
            </TactileButton>

            <TactileButton
              size="md"
              icon={<ThumbsUp className="w-4 h-4" />}
              label="Approve"
              onClick={handleApprove}
              active={approveActive}
              variant={approveActive ? 'glow' : 'default'}
              shortcut="P"
              className="!w-full"
            >
              <span className="sr-only">Approve Action</span>
            </TactileButton>

            <TactileButton
              size="md"
              variant="danger"
              active={ralphActive}
              icon={<RalphIcon className="w-4 h-4" />}
              label="Ralph"
              onClick={handleRalphToggle}
              shortcut="Y"
              className="!w-full"
            >
              <span className="sr-only">Ralph Mode - Autonomous Loop</span>
            </TactileButton>

            <TactileButton
              size="md"
              icon={<CornerDownLeft className="w-4 h-4" />}
              label="Enter"
              onClick={handleEnter}
              shortcut="↵"
              className="!w-full"
            >
              <span className="sr-only">Enter</span>
            </TactileButton>

            <TactileButton
              size="md"
              icon={<MessageSquare className="w-4 h-4" />}
              label="Chat"
              onClick={handleChat}
              active={chatActive}
              variant={chatActive ? 'glow' : 'default'}
              shortcut="C"
              className="!w-full"
            >
              <span className="sr-only">Open Chat</span>
            </TactileButton>
          </div>

          {/* Secondary controls row */}
          <div className="flex items-end gap-3 mb-3">
            {/* Toggle switch */}
            <ToggleSwitch label="MODEL" onChange={handleModelSwitch} />

            {/* Small utility buttons */}
            <div className="flex-1 grid grid-cols-3 gap-2">
              <TactileButton
                size="sm"
                icon={<Trash2 className="w-3.5 h-3.5" />}
                label="Discard"
                onClick={handleDiscard}
                shortcut="D"
                className="!w-full"
              >
                <span className="sr-only">Discard</span>
              </TactileButton>

              <TactileButton
                size="sm"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                label="Retry"
                onClick={handleRetry}
                shortcut="R"
                className="!w-full"
              >
                <span className="sr-only">Retry</span>
              </TactileButton>

              <TactileButton
                size="sm"
                icon={<Mic className="w-3.5 h-3.5" />}
                label="Voice"
                onClick={handleVoice}
                active={voiceActive}
                variant={voiceActive ? 'glow' : 'default'}
                shortcut="M"
                className="!w-full"
              >
                <span className="sr-only">Voice</span>
              </TactileButton>
            </div>

            {/* Rotary knob */}
            <RotaryKnob label="Level" onChange={handleKnobChange} size="sm" detents={12} />
          </div>

          {/* Wide prompt button */}
          <TactileButton
            size="wide"
            onClick={handleSuggest}
            shortcut="/"
            className="w-full !h-10"
          >
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/50">
              Suggest Next Prompt
            </span>
          </TactileButton>
        </div>

        {/* Cable port indicator (left side) */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-6 rounded-r"
          style={{
            background: 'linear-gradient(90deg, #2a2a2a, #3a3a3a)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
          }}
        />

        {/* Cable port indicator (right side) */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-6 rounded-l"
          style={{
            background: 'linear-gradient(90deg, #3a3a3a, #2a2a2a)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
          }}
        />
      </div>
    </div>
  );
}

export default ControlDeck;
