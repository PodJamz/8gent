/**
 * useDimensionPortal Hook
 *
 * Manages the state for reality-bending dimension transitions.
 * Provides a simple API for triggering the matrix-bending portal effect.
 */

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export interface DimensionTarget {
  id: string;
  name: string;
  gradient?: string;
  metaphor?: string;
}

export interface UseDimensionPortalOptions {
  /** Default transition duration in ms */
  defaultDuration?: number;
  /** Auto-navigate after transition completes */
  autoNavigate?: boolean;
  /** Callback after transition completes */
  onComplete?: (dimension: DimensionTarget) => void;
}

export interface UseDimensionPortalReturn {
  /** Whether a transition is currently active */
  isTransitioning: boolean;
  /** The dimension we're transitioning to */
  targetDimension: DimensionTarget | undefined;
  /** Trigger a transition to a dimension */
  transitionTo: (dimension: DimensionTarget, options?: { duration?: number }) => void;
  /** Cancel an in-progress transition */
  cancelTransition: () => void;
  /** Handle transition complete (for portal component) */
  handleTransitionComplete: () => void;
  /** Current transition duration */
  duration: number;
}

/**
 * Hook for managing dimension portal transitions.
 *
 * @example
 * ```tsx
 * const { isTransitioning, targetDimension, transitionTo, handleTransitionComplete, duration } = useDimensionPortal();
 *
 * // Trigger a transition
 * transitionTo({ id: 'kanban', name: 'Kanban', gradient: 'from-violet-500 to-purple-500', metaphor: 'board' });
 *
 * // In your JSX
 * <DimensionPortal
 *   isTransitioning={isTransitioning}
 *   targetDimension={targetDimension}
 *   onTransitionComplete={handleTransitionComplete}
 *   duration={duration}
 * />
 * ```
 */
export function useDimensionPortal(options: UseDimensionPortalOptions = {}): UseDimensionPortalReturn {
  const {
    defaultDuration = 1500,
    autoNavigate = true,
    onComplete,
  } = options;

  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetDimension, setTargetDimension] = useState<DimensionTarget | undefined>();
  const [duration, setDuration] = useState(defaultDuration);
  const cancelRef = useRef(false);

  const transitionTo = useCallback((dimension: DimensionTarget, opts?: { duration?: number }) => {
    cancelRef.current = false;
    setTargetDimension(dimension);
    setDuration(opts?.duration ?? defaultDuration);
    setIsTransitioning(true);
  }, [defaultDuration]);

  const cancelTransition = useCallback(() => {
    cancelRef.current = true;
    setIsTransitioning(false);
    setTargetDimension(undefined);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    if (cancelRef.current) return;

    setIsTransitioning(false);

    if (targetDimension) {
      // Call completion callback
      onComplete?.(targetDimension);

      // Auto-navigate if enabled
      if (autoNavigate) {
        router.push(`/d/${targetDimension.id}`);
      }

      // Clear target after a brief delay
      setTimeout(() => {
        setTargetDimension(undefined);
      }, 100);
    }
  }, [targetDimension, autoNavigate, onComplete, router]);

  return {
    isTransitioning,
    targetDimension,
    transitionTo,
    cancelTransition,
    handleTransitionComplete,
    duration,
  };
}

export default useDimensionPortal;
