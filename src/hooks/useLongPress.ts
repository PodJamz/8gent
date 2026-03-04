/**
 * useLongPress Hook
 *
 * Detects long press gestures on both mouse and touch devices.
 * Used in ERV for "beyond the veil" entity reveals.
 *
 * Phase 2, Story 2.3: useLongPress Hook
 *
 * Features:
 * - Configurable press duration (default 500ms)
 * - Works on both touch and mouse
 * - Cancels on movement (configurable threshold)
 * - Returns bound event handlers
 * - Supports callback for press start/end
 */

import { useCallback, useRef, useState } from "react";

// =============================================================================
// Type Definitions
// =============================================================================

export interface UseLongPressOptions {
  /** Duration in ms to trigger long press (default: 500) */
  threshold?: number;
  /** Movement threshold in px before canceling (default: 10) */
  moveThreshold?: number;
  /** Callback when long press is triggered */
  onLongPress?: () => void;
  /** Callback when press starts */
  onPressStart?: () => void;
  /** Callback when press ends (without triggering long press) */
  onPressEnd?: () => void;
  /** Callback when press is cancelled (by movement) */
  onCancel?: () => void;
  /** Whether long press is enabled (default: true) */
  enabled?: boolean;
}

export interface UseLongPressResult {
  /** Whether currently pressing */
  isPressed: boolean;
  /** Whether long press was triggered */
  isLongPressed: boolean;
  /** Event handlers to spread on the target element */
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchCancel: (e: React.TouchEvent) => void;
  };
  /** Cancel the current long press */
  cancel: () => void;
}

// =============================================================================
// Hook Implementation
// =============================================================================

export function useLongPress(options: UseLongPressOptions = {}): UseLongPressResult {
  const {
    threshold = 500,
    moveThreshold = 10,
    onLongPress,
    onPressStart,
    onPressEnd,
    onCancel,
    enabled = true,
  } = options;

  // State
  const [isPressed, setIsPressed] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);

  // Refs for tracking
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const isLongPressedRef = useRef(false);

  // Clear the timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cancel the long press
  const cancel = useCallback(() => {
    clearTimer();
    setIsPressed(false);
    setIsLongPressed(false);
    isLongPressedRef.current = false;
    startPosRef.current = null;
    onCancel?.();
  }, [clearTimer, onCancel]);

  // Start the long press timer
  const start = useCallback(
    (clientX: number, clientY: number) => {
      if (!enabled) return;

      setIsPressed(true);
      setIsLongPressed(false);
      isLongPressedRef.current = false;
      startPosRef.current = { x: clientX, y: clientY };
      onPressStart?.();

      timerRef.current = setTimeout(() => {
        setIsLongPressed(true);
        isLongPressedRef.current = true;
        onLongPress?.();
      }, threshold);
    },
    [enabled, threshold, onPressStart, onLongPress]
  );

  // End the press
  const end = useCallback(() => {
    clearTimer();

    if (isPressed && !isLongPressedRef.current) {
      onPressEnd?.();
    }

    setIsPressed(false);
    // Keep isLongPressed true briefly for UI feedback
    if (isLongPressedRef.current) {
      setTimeout(() => {
        setIsLongPressed(false);
        isLongPressedRef.current = false;
      }, 100);
    }
    startPosRef.current = null;
  }, [clearTimer, isPressed, onPressEnd]);

  // Check if movement exceeds threshold
  const checkMovement = useCallback(
    (clientX: number, clientY: number) => {
      if (!startPosRef.current) return;

      const dx = Math.abs(clientX - startPosRef.current.x);
      const dy = Math.abs(clientY - startPosRef.current.y);

      if (dx > moveThreshold || dy > moveThreshold) {
        cancel();
      }
    },
    [moveThreshold, cancel]
  );

  // Mouse event handlers
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only respond to left click
      if (e.button !== 0) return;
      start(e.clientX, e.clientY);
    },
    [start]
  );

  const onMouseUp = useCallback(
    (_e: React.MouseEvent) => {
      end();
    },
    [end]
  );

  const onMouseLeave = useCallback(
    (_e: React.MouseEvent) => {
      if (isPressed) {
        cancel();
      }
    },
    [isPressed, cancel]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPressed) {
        checkMovement(e.clientX, e.clientY);
      }
    },
    [isPressed, checkMovement]
  );

  // Touch event handlers
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        start(touch.clientX, touch.clientY);
      }
    },
    [start]
  );

  const onTouchEnd = useCallback(
    (_e: React.TouchEvent) => {
      end();
    },
    [end]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isPressed) {
        const touch = e.touches[0];
        if (touch) {
          checkMovement(touch.clientX, touch.clientY);
        }
      }
    },
    [isPressed, checkMovement]
  );

  const onTouchCancel = useCallback(
    (_e: React.TouchEvent) => {
      cancel();
    },
    [cancel]
  );

  return {
    isPressed,
    isLongPressed,
    handlers: {
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      onMouseMove,
      onTouchStart,
      onTouchEnd,
      onTouchMove,
      onTouchCancel,
    },
    cancel,
  };
}

export default useLongPress;
