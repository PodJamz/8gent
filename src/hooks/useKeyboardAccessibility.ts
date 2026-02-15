'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardAccessibilityOptions {
  onEscape?: () => void;
  enableGlobalEscape?: boolean;
  trapFocus?: boolean;
  containerRef?: React.RefObject<HTMLElement>;
}

/**
 * Global keyboard accessibility hook for OpenClaw-OS
 * Handles Escape key navigation, focus management, and keyboard shortcuts
 */
export function useKeyboardAccessibility(options: KeyboardAccessibilityOptions = {}) {
  const {
    onEscape,
    enableGlobalEscape = true,
    trapFocus = false,
    containerRef,
  } = options;

  const router = useRouter();
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  // Handle escape key - go back or close current overlay
  const handleEscape = useCallback(() => {
    if (onEscape) {
      onEscape();
      return;
    }

    // Default behavior: go back in history
    if (enableGlobalEscape && typeof window !== 'undefined') {
      // Check if we're on a sub-page (not the home page)
      if (window.location.pathname !== '/') {
        router.back();
      }
    }
  }, [onEscape, enableGlobalEscape, router]);

  // Focus trap logic
  const handleTabKey = useCallback(
    (e: KeyboardEvent) => {
      if (!trapFocus || !containerRef?.current) return;

      const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [trapFocus, containerRef]
  );

  // Main keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape') {
        e.preventDefault();
        handleEscape();
        return;
      }

      // Handle Tab key for focus trap
      if (e.key === 'Tab' && trapFocus) {
        handleTabKey(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEscape, handleTabKey, trapFocus]);

  // Save and restore focus for overlays
  const saveFocus = useCallback(() => {
    lastFocusedElement.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (lastFocusedElement.current) {
      lastFocusedElement.current.focus();
      lastFocusedElement.current = null;
    }
  }, []);

  return {
    handleEscape,
    saveFocus,
    restoreFocus,
  };
}

/**
 * Hook for managing roving tabindex in lists/grids
 * Used for dock navigation, app grid, etc.
 */
export function useRovingTabIndex<T extends HTMLElement>(
  itemCount: number,
  options: {
    orientation?: 'horizontal' | 'vertical' | 'grid';
    gridColumns?: number;
    loop?: boolean;
    onSelect?: (index: number) => void;
  } = {}
) {
  const {
    orientation = 'horizontal',
    gridColumns = 4,
    loop = true,
    onSelect,
  } = options;

  const containerRef = useRef<T>(null);
  const currentIndexRef = useRef(0);

  const focusItem = useCallback((index: number) => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll<HTMLElement>(
      '[role="menuitem"], [role="option"], [data-roving-item]'
    );

    if (items.length === 0) return;

    // Handle bounds
    let newIndex = index;
    if (loop) {
      newIndex = ((index % itemCount) + itemCount) % itemCount;
    } else {
      newIndex = Math.max(0, Math.min(index, itemCount - 1));
    }

    // Update tabindex
    items.forEach((item, i) => {
      item.setAttribute('tabindex', i === newIndex ? '0' : '-1');
    });

    // Focus the item
    items[newIndex]?.focus();
    currentIndexRef.current = newIndex;
  }, [itemCount, loop]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = currentIndexRef.current;
      let newIndex = currentIndex;
      let handled = false;

      switch (e.key) {
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'grid') {
            newIndex = currentIndex + 1;
            handled = true;
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'grid') {
            newIndex = currentIndex - 1;
            handled = true;
          }
          break;
        case 'ArrowDown':
          if (orientation === 'vertical') {
            newIndex = currentIndex + 1;
            handled = true;
          } else if (orientation === 'grid') {
            newIndex = currentIndex + gridColumns;
            handled = true;
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical') {
            newIndex = currentIndex - 1;
            handled = true;
          } else if (orientation === 'grid') {
            newIndex = currentIndex - gridColumns;
            handled = true;
          }
          break;
        case 'Home':
          newIndex = 0;
          handled = true;
          break;
        case 'End':
          newIndex = itemCount - 1;
          handled = true;
          break;
        case 'Enter':
        case ' ':
          if (onSelect) {
            e.preventDefault();
            onSelect(currentIndex);
          }
          return;
      }

      if (handled) {
        e.preventDefault();
        focusItem(newIndex);
      }
    },
    [orientation, gridColumns, itemCount, focusItem, onSelect]
  );

  return {
    containerRef,
    handleKeyDown,
    focusItem,
    currentIndex: currentIndexRef.current,
  };
}

/**
 * Hook for announcing content to screen readers
 */
export function useAnnounce() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return announce;
}

/**
 * Utility to generate unique IDs for ARIA relationships
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${++idCounter}`;
}
