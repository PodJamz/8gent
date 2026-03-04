/**
 * 8gent OS - Unified Motion Configuration
 *
 * Centralizes all animation curves and motion settings.
 * Ensures consistent feel across the entire OS.
 */

import { Transition, Variants } from 'framer-motion';

// ============================================================================
// SPRING CONFIGURATIONS
// ============================================================================

/**
 * Spring presets for consistent physics-based animations
 */
export const springs = {
  /** Default spring - balanced feel */
  default: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },

  /** Snappy spring - quick and responsive */
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },

  /** Gentle spring - smooth and soft */
  gentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 35,
  },

  /** Bouncy spring - playful with overshoot */
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 20,
  },

  /** Heavy spring - weighty feel */
  heavy: {
    type: 'spring' as const,
    stiffness: 250,
    damping: 40,
  },

  /** Modal spring - for overlays and modals */
  modal: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 28,
  },
};

// ============================================================================
// DURATION PRESETS
// ============================================================================

export const durations = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  slower: 0.6,
};

// ============================================================================
// EASE CURVES
// ============================================================================

export const easings = {
  /** Standard ease-out */
  out: [0.4, 0, 0.2, 1] as const,
  /** Ease-in-out */
  inOut: [0.4, 0, 0.2, 1] as const,
  /** Sharp deceleration */
  decel: [0, 0, 0.2, 1] as const,
  /** Sharp acceleration */
  accel: [0.4, 0, 1, 1] as const,
  /** Anticipation (slight pullback before motion) */
  anticipate: [0.36, 0.66, 0.04, 1] as const,
};

// ============================================================================
// TRANSITION PRESETS
// ============================================================================

export const transitions: Record<string, Transition> = {
  /** Instant - no animation */
  instant: {
    duration: 0,
  },

  /** Fast fade */
  fade: {
    duration: durations.fast,
    ease: easings.out,
  },

  /** Standard transition */
  default: {
    ...springs.default,
  },

  /** For page transitions */
  page: {
    ...springs.gentle,
  },

  /** For modals and overlays */
  modal: {
    ...springs.modal,
  },

  /** For hover effects */
  hover: {
    duration: durations.fast,
  },

  /** For press/tap effects */
  tap: {
    duration: durations.instant,
  },

  /** For staggered children */
  stagger: {
    staggerChildren: 0.05,
    delayChildren: 0.1,
  },
};

// ============================================================================
// VARIANT PRESETS
// ============================================================================

export const variants: Record<string, Variants> = {
  /** Fade in/out */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  /** Slide up with fade */
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },

  /** Slide down with fade */
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },

  /** Scale in/out */
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },

  /** Modal entrance */
  modal: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  },

  /** App icon entrance */
  appIcon: {
    initial: { opacity: 0, scale: 0.5, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
  },

  /** Stagger container */
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },

  /** Stagger child */
  staggerChild: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  },
};

// ============================================================================
// HOVER/TAP EFFECTS
// ============================================================================

export const effects = {
  /** Standard button hover */
  buttonHover: {
    scale: 1.02,
    transition: transitions.hover,
  },

  /** Standard button tap */
  buttonTap: {
    scale: 0.98,
    transition: transitions.tap,
  },

  /** Card hover */
  cardHover: {
    scale: 1.01,
    transition: springs.gentle,
  },

  /** Icon button hover */
  iconHover: {
    scale: 1.1,
    transition: transitions.hover,
  },

  /** Icon button tap */
  iconTap: {
    scale: 0.9,
    transition: transitions.tap,
  },

  /** App icon hover */
  appIconHover: {
    scale: 1.05,
    transition: springs.bouncy,
  },

  /** App icon tap */
  appIconTap: {
    scale: 0.95,
    transition: springs.snappy,
  },
};

// ============================================================================
// REDUCED MOTION SUPPORT
// ============================================================================

/**
 * Returns instant transitions when reduced motion is preferred
 */
export function getReducedMotionTransition(
  normalTransition: Transition
): Transition {
  if (typeof window === 'undefined') return normalTransition;

  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  return prefersReduced
    ? { duration: 0 }
    : normalTransition;
}

/**
 * Returns variants adjusted for reduced motion
 */
export function getReducedMotionVariants(
  normalVariants: Variants
): Variants {
  if (typeof window === 'undefined') return normalVariants;

  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (!prefersReduced) return normalVariants;

  // Simplified variants for reduced motion
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a staggered delay for list items
 */
export function staggerDelay(index: number, baseDelay = 0.05): number {
  return index * baseDelay;
}

/**
 * Creates a cascading delay pattern
 */
export function cascadeDelay(
  index: number,
  total: number,
  duration = 0.3
): number {
  return (index / total) * duration;
}

// Export all as default object too
const motionConfig = {
  springs,
  durations,
  easings,
  transitions,
  variants,
  effects,
  getReducedMotionTransition,
  getReducedMotionVariants,
  staggerDelay,
  cascadeDelay,
};

export default motionConfig;
