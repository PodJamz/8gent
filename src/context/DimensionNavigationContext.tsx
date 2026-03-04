/**
 * Dimension Navigation Context
 *
 * Tracks navigation state across dimensions and apps:
 * - Current dimension/app
 * - Navigation history (back/forward)
 * - Project context
 * - Swipe navigation support
 * - 8gent context updates
 *
 * Phase 3: Navigation infrastructure for ERV
 */

"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

// =============================================================================
// Types
// =============================================================================

export interface NavigationLocation {
  /** Current dimension ID or app path */
  dimensionId: string;
  /** Human-readable label */
  label: string;
  /** Entity filter if any */
  filter?: {
    entityTypes?: string[];
    tags?: string[];
    projectId?: string;
  };
  /** Timestamp when navigated here */
  timestamp: number;
}

export interface NavigationState {
  /** Current location */
  current: NavigationLocation;
  /** Navigation history (for back) */
  history: NavigationLocation[];
  /** Forward stack (for forward after back) */
  forward: NavigationLocation[];
  /** Active project context */
  projectId?: string;
  projectName?: string;
}

export interface DimensionNavigationContextValue {
  /** Current navigation state */
  state: NavigationState;
  /** Navigate to a dimension */
  navigateTo: (dimensionId: string, label: string, filter?: NavigationLocation["filter"]) => void;
  /** Go back in history */
  goBack: () => boolean;
  /** Go forward in history */
  goForward: () => boolean;
  /** Can go back? */
  canGoBack: boolean;
  /** Can go forward? */
  canGoForward: boolean;
  /** Set active project context */
  setProject: (projectId: string | undefined, projectName?: string) => void;
  /** Get context string for 8gent */
  getAIContext: () => string;
  /** Subscribe to navigation changes (for 8gent updates) */
  onNavigate: (callback: (location: NavigationLocation) => void) => () => void;
}

// =============================================================================
// Default State
// =============================================================================

const DEFAULT_LOCATION: NavigationLocation = {
  dimensionId: "home",
  label: "Home",
  timestamp: Date.now(),
};

const DEFAULT_STATE: NavigationState = {
  current: DEFAULT_LOCATION,
  history: [],
  forward: [],
};

// =============================================================================
// Context
// =============================================================================

const DimensionNavigationContext = createContext<DimensionNavigationContextValue | null>(null);

// =============================================================================
// Provider
// =============================================================================

interface DimensionNavigationProviderProps {
  children: ReactNode;
  /** Initial dimension */
  initialDimension?: string;
  /** Initial project context */
  initialProjectId?: string;
}

export function DimensionNavigationProvider({
  children,
  initialDimension,
  initialProjectId,
}: DimensionNavigationProviderProps) {
  // Navigation state
  const [state, setState] = useState<NavigationState>(() => ({
    ...DEFAULT_STATE,
    current: initialDimension
      ? { dimensionId: initialDimension, label: initialDimension, timestamp: Date.now() }
      : DEFAULT_LOCATION,
    projectId: initialProjectId,
  }));

  // Subscribers for navigation events (8gent listens here)
  const subscribersRef = useRef<Set<(location: NavigationLocation) => void>>(new Set());

  // Notify subscribers of navigation
  const notifySubscribers = useCallback((location: NavigationLocation) => {
    subscribersRef.current.forEach((callback) => callback(location));
  }, []);

  // Navigate to a dimension
  const navigateTo = useCallback(
    (dimensionId: string, label: string, filter?: NavigationLocation["filter"]) => {
      const newLocation: NavigationLocation = {
        dimensionId,
        label,
        filter,
        timestamp: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        history: [...prev.history, prev.current],
        current: newLocation,
        forward: [], // Clear forward stack on new navigation
      }));

      notifySubscribers(newLocation);
    },
    [notifySubscribers]
  );

  // Go back
  const goBack = useCallback((): boolean => {
    let didGoBack = false;

    setState((prev) => {
      if (prev.history.length === 0) return prev;

      const newHistory = [...prev.history];
      const previousLocation = newHistory.pop()!;

      didGoBack = true;

      // Notify after state update
      setTimeout(() => notifySubscribers(previousLocation), 0);

      return {
        ...prev,
        history: newHistory,
        current: previousLocation,
        forward: [prev.current, ...prev.forward],
      };
    });

    return didGoBack;
  }, [notifySubscribers]);

  // Go forward
  const goForward = useCallback((): boolean => {
    let didGoForward = false;

    setState((prev) => {
      if (prev.forward.length === 0) return prev;

      const newForward = [...prev.forward];
      const nextLocation = newForward.shift()!;

      didGoForward = true;

      // Notify after state update
      setTimeout(() => notifySubscribers(nextLocation), 0);

      return {
        ...prev,
        history: [...prev.history, prev.current],
        current: nextLocation,
        forward: newForward,
      };
    });

    return didGoForward;
  }, [notifySubscribers]);

  // Set project context
  const setProject = useCallback((projectId: string | undefined, projectName?: string) => {
    setState((prev) => ({
      ...prev,
      projectId,
      projectName,
    }));
  }, []);

  // Generate context string for 8gent
  const getAIContext = useCallback((): string => {
    const parts: string[] = [];

    // Current location
    parts.push(`Currently viewing: ${state.current.label} (${state.current.dimensionId})`);

    // Project context
    if (state.projectName) {
      parts.push(`Active project: ${state.projectName}`);
    }

    // Filter context
    if (state.current.filter) {
      if (state.current.filter.entityTypes?.length) {
        parts.push(`Filtered to: ${state.current.filter.entityTypes.join(", ")}`);
      }
      if (state.current.filter.tags?.length) {
        parts.push(`Tags: ${state.current.filter.tags.join(", ")}`);
      }
    }

    // Navigation depth
    if (state.history.length > 0) {
      parts.push(`Navigation depth: ${state.history.length} steps from home`);
    }

    return parts.join(". ");
  }, [state]);

  // Subscribe to navigation changes
  const onNavigate = useCallback((callback: (location: NavigationLocation) => void) => {
    subscribersRef.current.add(callback);
    return () => {
      subscribersRef.current.delete(callback);
    };
  }, []);

  // Computed values
  const canGoBack = state.history.length > 0;
  const canGoForward = state.forward.length > 0;

  const value: DimensionNavigationContextValue = {
    state,
    navigateTo,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    setProject,
    getAIContext,
    onNavigate,
  };

  return (
    <DimensionNavigationContext.Provider value={value}>
      {children}
    </DimensionNavigationContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useDimensionNavigation(): DimensionNavigationContextValue {
  const context = useContext(DimensionNavigationContext);
  if (!context) {
    throw new Error("useDimensionNavigation must be used within DimensionNavigationProvider");
  }
  return context;
}

// =============================================================================
// Swipe Navigation Hook
// =============================================================================

interface UseSwipeNavigationOptions {
  /** Minimum swipe distance to trigger (default: 50) */
  threshold?: number;
  /** Whether swipe is enabled (default: true) */
  enabled?: boolean;
  /** Callback on swipe left (forward) */
  onSwipeLeft?: () => void;
  /** Callback on swipe right (back) */
  onSwipeRight?: () => void;
}

export function useSwipeNavigation(options: UseSwipeNavigationOptions = {}) {
  const { threshold = 50, enabled = true, onSwipeLeft, onSwipeRight } = options;
  const { goBack, goForward, canGoBack, canGoForward } = useDimensionNavigation();

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [enabled]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && canGoBack) {
          // Swipe right = go back
          goBack();
          onSwipeRight?.();
        } else if (deltaX < 0 && canGoForward) {
          // Swipe left = go forward
          goForward();
          onSwipeLeft?.();
        }
      }

      touchStartRef.current = null;
    },
    [enabled, threshold, canGoBack, canGoForward, goBack, goForward, onSwipeLeft, onSwipeRight]
  );

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
  };
}

// =============================================================================
// 8gent Integration Hook
// =============================================================================

/**
 * Hook for 8gent to stay informed about navigation context.
 * Returns current context and subscribes to changes.
 */
export function useAINavigationContext(
  onContextChange?: (context: string, location: NavigationLocation) => void
) {
  const { state, getAIContext, onNavigate } = useDimensionNavigation();

  useEffect(() => {
    if (!onContextChange) return;

    // Subscribe to navigation changes
    const unsubscribe = onNavigate((location) => {
      // Small delay to ensure state is updated
      setTimeout(() => {
        onContextChange(getAIContext(), location);
      }, 10);
    });

    return unsubscribe;
  }, [onNavigate, getAIContext, onContextChange]);

  return {
    currentContext: getAIContext(),
    currentLocation: state.current,
    projectContext: state.projectName ? `Project: ${state.projectName}` : undefined,
  };
}

export default DimensionNavigationContext;
