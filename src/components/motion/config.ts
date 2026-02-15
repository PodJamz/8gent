import type { Transition, Variants } from 'motion/react';

// ============================================================================
// Standardized Spring Presets
// ============================================================================
// Use these presets across all components for consistent animation feel

export const springs = {
  // Smooth - For page transitions, unlock animations, major state changes
  // Feels fluid and elegant, not abrupt
  smooth: { type: 'spring' as const, stiffness: 200, damping: 25, mass: 0.8 },

  // Snappy - For UI interactions, hover states, quick feedback
  // Responsive without being too bouncy
  snappy: { type: 'spring' as const, stiffness: 400, damping: 30 },

  // Tight - For position resets, badges, snap-back animations
  // Quick return to resting state
  tight: { type: 'spring' as const, stiffness: 500, damping: 30 },

  // Bouncy - For playful elements, notifications, attention-grabbing
  // More pronounced overshoot
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 15 },

  // Gentle - For subtle movements, ambient animations
  // Slow and graceful
  gentle: { type: 'spring' as const, stiffness: 150, damping: 20, mass: 1 },
} as const;

// ============================================================================
// Global Motion Configuration
// ============================================================================

export const motionConfig = {
  // Default transition settings (use snappy for general UI)
  transition: springs.snappy as Transition,

  // Reduced motion settings
  reducedMotion: {
    transition: { duration: 0.15 },
  },

  // Default durations (for non-spring animations)
  duration: {
    instant: 0.1,
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
  },

  // Default easings (cubic bezier curves)
  ease: {
    default: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    smooth: [0.23, 1, 0.32, 1] as [number, number, number, number], // Used for unlock/transitions
    bounce: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
    snappy: [0.87, 0, 0.13, 1] as [number, number, number, number],
    easeOut: [0, 0, 0.2, 1] as [number, number, number, number],
  },

  // Stagger timing - NOTE: Prefer simultaneous animations (delay: 0.1) over stagger
  stagger: {
    none: 0,      // Simultaneous - preferred for icon grids
    fast: 0.02,   // Very subtle stagger
    normal: 0.05,
    slow: 0.1,
  },

  // Drag behavior
  drag: {
    elastic: 0.2,      // Consistent bounce on drag
    elasticNone: 0,    // No bounce (for precise positioning)
    momentum: false,   // Disable momentum for iOS-style drag
  },
};

// Preset animation variants
export const presets = {
  // Fade animations
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,

  // Fade up animations
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  } as Variants,

  // Fade down animations
  fadeDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  } as Variants,

  // Scale animations
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  } as Variants,

  // Blur animations
  blur: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(10px)' },
  } as Variants,

  // Blur slide animations
  blurSlide: {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: 20, filter: 'blur(10px)' },
  } as Variants,

  // Slide left
  slideLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  } as Variants,

  // Slide right
  slideRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  } as Variants,

  // Zoom
  zoom: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    exit: { opacity: 0, scale: 0.5 },
  } as Variants,

  // Flip
  flip: {
    hidden: { opacity: 0, rotateX: -90 },
    visible: {
      opacity: 1,
      rotateX: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    exit: { opacity: 0, rotateX: 90 },
  } as Variants,

  // Bounce
  bounce: {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
    exit: { opacity: 0, y: -30 },
  } as Variants,
};

// Container variants for staggered children
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: motionConfig.stagger.normal,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: motionConfig.stagger.fast,
      staggerDirection: -1,
    },
  },
} as Variants;

// Create staggered container with custom timing
export const createStaggerContainer = (
  stagger: number = motionConfig.stagger.normal,
  delay: number = 0
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: stagger / 2,
      staggerDirection: -1,
    },
  },
});

export type PresetName = keyof typeof presets;
