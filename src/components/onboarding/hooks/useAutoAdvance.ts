'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseAutoAdvanceOptions {
  delay: number;
  onAdvance: () => void;
  enabled?: boolean;
}

export function useAutoAdvance({ delay, onAdvance, enabled = true }: UseAutoAdvanceOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasAdvancedRef = useRef(false);

  const skipDelay = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!hasAdvancedRef.current) {
      hasAdvancedRef.current = true;
      onAdvance();
    }
  }, [onAdvance]);

  useEffect(() => {
    if (!enabled) return;

    hasAdvancedRef.current = false;
    timeoutRef.current = setTimeout(() => {
      if (!hasAdvancedRef.current) {
        hasAdvancedRef.current = true;
        onAdvance();
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay, onAdvance, enabled]);

  return { skipDelay };
}
