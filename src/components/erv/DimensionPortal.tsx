/**
 * Dimension Portal - Reality-Bending Transition Effect
 *
 * Creates a full-screen "matrix-bending" effect when transitioning
 * between dimensions. The UI fragments, dissolves into digital particles,
 * then reforms as the new dimension materializes.
 *
 * "The fabric of the interface is being rewritten."
 */

"use client";

import { memo, useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================

export interface DimensionPortalProps {
  /** Whether the portal transition is active */
  isTransitioning: boolean;
  /** The dimension we're transitioning to */
  targetDimension?: {
    id: string;
    name: string;
    gradient?: string;
    metaphor?: string;
  };
  /** Called when transition completes */
  onTransitionComplete?: () => void;
  /** Duration of the transition in ms */
  duration?: number;
  /** Intensity of the effect (0-1) */
  intensity?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
  char?: string;
}

interface GridCell {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotation: number;
  delay: number;
}

// =============================================================================
// Constants
// =============================================================================

const MATRIX_CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
const PARTICLE_COUNT = 150;
const GRID_SIZE = 20;

// =============================================================================
// Shaders / Visual Effects (CSS-based)
// =============================================================================

const glitchKeyframes = `
  @keyframes glitch-anim {
    0% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 2px); }
    20% { clip-path: inset(92% 0 1% 0); transform: translate(2px, -2px); }
    40% { clip-path: inset(43% 0 1% 0); transform: translate(-2px, 2px); }
    60% { clip-path: inset(25% 0 58% 0); transform: translate(2px, -2px); }
    80% { clip-path: inset(54% 0 7% 0); transform: translate(-2px, 2px); }
    100% { clip-path: inset(58% 0 43% 0); transform: translate(0); }
  }

  @keyframes reality-tear {
    0% { transform: scaleY(1) translateY(0); filter: blur(0px); }
    25% { transform: scaleY(1.02) translateY(-2px); filter: blur(1px); }
    50% { transform: scaleY(0.98) translateY(2px); filter: blur(2px); }
    75% { transform: scaleY(1.01) translateY(-1px); filter: blur(1px); }
    100% { transform: scaleY(1) translateY(0); filter: blur(0px); }
  }

  @keyframes digital-rain {
    0% { transform: translateY(-100%); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px hsl(var(--theme-primary) / 0.3); }
    50% { box-shadow: 0 0 60px hsl(var(--theme-primary) / 0.6); }
  }
`;

// =============================================================================
// Sub-components
// =============================================================================

/** Matrix-style digital rain effect */
const DigitalRain = memo(function DigitalRain({ active }: { active: boolean }) {
  const [columns, setColumns] = useState<{ id: number; x: number; chars: string[]; speed: number; delay: number }[]>([]);

  useEffect(() => {
    if (!active) return;

    const colCount = Math.floor(window.innerWidth / 20);
    const newColumns = Array.from({ length: colCount }, (_, i) => ({
      id: i,
      x: i * 20,
      chars: Array.from({ length: 30 }, () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]),
      speed: 1 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setColumns(newColumns);
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {columns.map((col) => (
        <motion.div
          key={col.id}
          className="absolute top-0 text-[hsl(var(--theme-primary))] font-mono text-sm leading-tight"
          style={{ left: col.x }}
          initial={{ y: "-100%" }}
          animate={{ y: "100vh" }}
          transition={{
            duration: col.speed,
            delay: col.delay,
            ease: "linear",
          }}
        >
          {col.chars.map((char, i) => (
            <div
              key={i}
              style={{
                opacity: 1 - i * 0.03,
                textShadow: i === 0 ? "0 0 10px currentColor" : "none",
              }}
            >
              {char}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
});

/** Fragmenting grid effect - reality breaking apart */
const FragmentGrid = memo(function FragmentGrid({
  active,
  phase,
}: {
  active: boolean;
  phase: "fragment" | "void" | "reform";
}) {
  const [cells, setCells] = useState<GridCell[]>([]);

  useEffect(() => {
    if (!active) return;

    const cols = Math.ceil(window.innerWidth / GRID_SIZE);
    const rows = Math.ceil(window.innerHeight / GRID_SIZE);
    const newCells: GridCell[] = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const distFromCenter = Math.sqrt(
          Math.pow(x - cols / 2, 2) + Math.pow(y - rows / 2, 2)
        );
        newCells.push({
          x: x * GRID_SIZE,
          y: y * GRID_SIZE,
          opacity: 1,
          scale: 1,
          rotation: 0,
          delay: distFromCenter * 0.01,
        });
      }
    }
    setCells(newCells);
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {cells.map((cell, i) => (
        <motion.div
          key={i}
          className="absolute bg-[hsl(var(--theme-background))] border border-[hsl(var(--theme-primary)/0.1)]"
          style={{
            left: cell.x,
            top: cell.y,
            width: GRID_SIZE,
            height: GRID_SIZE,
          }}
          initial={{ opacity: 1, scale: 1, rotate: 0 }}
          animate={
            phase === "fragment"
              ? {
                  opacity: [1, 0.8, 0],
                  scale: [1, 1.2, 0],
                  rotate: [0, Math.random() * 180 - 90],
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                }
              : phase === "reform"
              ? {
                  opacity: [0, 0.8, 1],
                  scale: [0, 1.1, 1],
                  rotate: [Math.random() * 180 - 90, 0],
                  x: 0,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.6,
            delay: cell.delay,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        />
      ))}
    </div>
  );
});

/** The void between dimensions - pure chaos */
const DimensionalVoid = memo(function DimensionalVoid({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-15"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Radial gradient void */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%,
            transparent 0%,
            hsl(var(--theme-background) / 0.5) 30%,
            hsl(var(--theme-background)) 70%
          )`,
        }}
      />

      {/* Pulsing core */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[hsl(var(--theme-primary))]"
        animate={{
          scale: [1, 50, 100],
          opacity: [1, 0.5, 0],
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        style={{
          boxShadow: "0 0 100px 50px hsl(var(--theme-primary) / 0.5)",
        }}
      />

      {/* Glitch lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 h-px bg-[hsl(var(--theme-primary))]"
          style={{ top: `${10 + i * 12}%` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 1, 0],
            x: ["-100%", "0%", "100%"],
          }}
          transition={{
            duration: 0.3,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
});

/** Dimension name reveal effect */
const DimensionReveal = memo(function DimensionReveal({
  name,
  metaphor,
  gradient,
}: {
  name: string;
  metaphor?: string;
  gradient?: string;
}) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        {/* Dimension name with glitch effect */}
        <motion.h1
          className={cn(
            "text-6xl md:text-8xl font-bold tracking-tighter",
            gradient
              ? `bg-gradient-to-r ${gradient} bg-clip-text text-transparent`
              : "text-[hsl(var(--theme-foreground))]"
          )}
          initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {name.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.03 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Metaphor subtitle */}
        {metaphor && (
          <motion.p
            className="mt-4 text-xl text-[hsl(var(--theme-muted-foreground))] uppercase tracking-[0.3em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            ✧ {metaphor} ✧
          </motion.p>
        )}
      </div>
    </motion.div>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const DimensionPortal = memo(function DimensionPortal({
  isTransitioning,
  targetDimension,
  onTransitionComplete,
  duration = 1500,
  intensity = 0.8,
}: DimensionPortalProps) {
  const [phase, setPhase] = useState<"idle" | "fragment" | "void" | "reform" | "reveal">("idle");

  useEffect(() => {
    if (!isTransitioning) {
      setPhase("idle");
      return;
    }

    // Phase sequence: fragment → void → reform → reveal → complete
    const timeline = [
      { phase: "fragment" as const, delay: 0 },
      { phase: "void" as const, delay: duration * 0.25 },
      { phase: "reform" as const, delay: duration * 0.5 },
      { phase: "reveal" as const, delay: duration * 0.7 },
      { phase: "idle" as const, delay: duration },
    ];

    const timeouts: NodeJS.Timeout[] = [];

    timeline.forEach(({ phase: p, delay }) => {
      const timeout = setTimeout(() => {
        setPhase(p);
        if (p === "idle" && onTransitionComplete) {
          onTransitionComplete();
        }
      }, delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [isTransitioning, duration, onTransitionComplete]);

  if (phase === "idle") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Inject keyframes */}
      <style dangerouslySetInnerHTML={{ __html: glitchKeyframes }} />

      {/* Background with blur */}
      <motion.div
        className="absolute inset-0 bg-[hsl(var(--theme-background))]"
        animate={{
          opacity: phase === "void" ? 1 : 0.95,
        }}
      />

      {/* Digital rain effect */}
      <DigitalRain active={phase === "fragment" || phase === "void"} />

      {/* Fragmenting grid */}
      <FragmentGrid active={phase === "fragment" || phase === "reform"} phase={phase as "fragment" | "reform"} />

      {/* The void */}
      <AnimatePresence>
        {phase === "void" && <DimensionalVoid active />}
      </AnimatePresence>

      {/* Dimension reveal */}
      <AnimatePresence>
        {phase === "reveal" && targetDimension && (
          <DimensionReveal
            name={targetDimension.name}
            metaphor={targetDimension.metaphor}
            gradient={targetDimension.gradient}
          />
        )}
      </AnimatePresence>

      {/* Scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            hsl(var(--theme-foreground) / 0.03) 2px,
            hsl(var(--theme-foreground) / 0.03) 4px
          )`,
        }}
      />

      {/* Chromatic aberration effect at edges */}
      {phase === "fragment" && (
        <>
          <motion.div
            className="absolute inset-0 mix-blend-screen pointer-events-none"
            style={{
              background: "linear-gradient(90deg, rgba(255,0,0,0.1), transparent 10%, transparent 90%, rgba(0,255,255,0.1))",
            }}
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 0.1, repeat: 5 }}
          />
        </>
      )}
    </motion.div>
  );
});

export default DimensionPortal;
