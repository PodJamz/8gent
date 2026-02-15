'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect user's prefers-reduced-motion preference
 *
 * @returns boolean - true if user prefers reduced motion
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 *
 * <motion.div
 *   animate={{ opacity: 1, y: 0 }}
 *   transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
 * />
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Get motion-safe animation props for Framer Motion
 * Returns empty transition when reduced motion is preferred
 *
 * @example
 * ```tsx
 * const motionProps = useMotionSafe({
 *   initial: { opacity: 0, y: 20 },
 *   animate: { opacity: 1, y: 0 },
 *   transition: { duration: 0.3 }
 * });
 *
 * <motion.div {...motionProps} />
 * ```
 */
export function useMotionSafe<T extends Record<string, unknown>>(
  props: T
): T {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return {
      ...props,
      initial: false,
      animate: props.animate,
      exit: undefined,
      transition: { duration: 0 },
      whileHover: undefined,
      whileTap: undefined,
      whileFocus: undefined,
      whileDrag: undefined,
      whileInView: undefined,
    } as T;
  }

  return props;
}

/**
 * Reduced motion safe transition config
 * Use this as the transition prop for Framer Motion
 */
export function getReducedMotionTransition(
  normalTransition: Record<string, unknown>,
  prefersReducedMotion: boolean
): Record<string, unknown> {
  if (prefersReducedMotion) {
    return { duration: 0 };
  }
  return normalTransition;
}

export default useReducedMotion;
