'use client';

import { useState, useCallback, useEffect } from 'react';
import { useMotionValue, useTransform, animate, MotionValue } from 'framer-motion';

export type MorphState = 'ipod' | 'island' | 'expanded' | 'morphing';

interface UseMusicPlayerMorphReturn {
  // Current morph state
  morphProgress: number;
  morphState: MorphState;
  isDragging: boolean;
  isMobile: boolean;

  // Motion values for smooth animations
  progress: MotionValue<number>;

  // Derived transforms for different elements
  ipodScale: MotionValue<number>;
  ipodBorderRadius: MotionValue<number>;
  ipodWidth: MotionValue<number>;
  ipodHeight: MotionValue<string>;
  panelOpacity: MotionValue<number>;

  // Actions
  expand: () => void;
  collapse: () => void;
  toggleExpanded: () => void;

  // Gesture handlers for scrubbing
  onDragStart: () => void;
  onDrag: (progress: number) => void;
  onDragEnd: () => void;

  // Set morph progress directly (for scrubbing)
  setMorphProgress: (progress: number) => void;
}

export function useMusicPlayerMorph(): UseMusicPlayerMorphReturn {
  const [morphState, setMorphState] = useState<MorphState>('ipod');
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Motion value for smooth, interruptible animations
  const progress = useMotionValue(0);
  const [morphProgress, setMorphProgressState] = useState(0);

  // Sync motion value with state
  useEffect(() => {
    const unsubscribe = progress.on('change', (v) => {
      setMorphProgressState(v);
    });
    return unsubscribe;
  }, [progress]);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Derived transforms for iPod morphing
  // Desktop: iPod stays centered, scales subtly, panels appear around it
  // Mobile: iPod morphs into Dynamic Island (small pill at top)

  const ipodScale = useTransform(
    progress,
    isMobile ? [0, 0.5, 1] : [0, 0.5, 1],
    isMobile ? [1, 0.5, 0.35] : [1, 0.98, 0.95]  // Subtle scale for desktop elegance
  );

  const ipodBorderRadius = useTransform(
    progress,
    [0, 0.5, 1],
    isMobile ? [32, 24, 22] : [32, 30, 28]
  );

  const ipodWidth = useTransform(
    progress,
    [0, 0.5, 1],
    isMobile ? [300, 180, 140] : [300, 300, 300]  // Desktop keeps full width
  );

  const ipodHeight = useTransform(
    progress,
    [0, 0.5, 1],
    isMobile ? ['auto', '70px', '52px'] : ['auto', 'auto', 'auto']
  );

  // Smooth panel fade - starts earlier, finishes with elegant timing
  const panelOpacity = useTransform(
    progress,
    [0, 0.15, 0.5, 1],
    [0, 0, 0.7, 1]
  );

  // Premium spring animation - lower stiffness, controlled damping for silk-smooth feel
  const animateTo = useCallback((target: number) => {
    animate(progress, target, {
      type: 'spring',
      stiffness: 260,  // Lower for smoother, more relaxed animation
      damping: 28,     // Slight underdamping for subtle bounce
      mass: 0.9,       // Adds weight for premium feel
    });
  }, [progress]);

  // Expand to full view
  const expand = useCallback(() => {
    setMorphState('expanded');
    animateTo(1);
  }, [animateTo]);

  // Collapse back to iPod
  const collapse = useCallback(() => {
    setMorphState('ipod');
    animateTo(0);
  }, [animateTo]);

  // Toggle between states
  const toggleExpanded = useCallback(() => {
    if (morphState === 'expanded') {
      collapse();
    } else {
      expand();
    }
  }, [morphState, expand, collapse]);

  // Gesture handlers for scrubbing the morph
  const onDragStart = useCallback(() => {
    setIsDragging(true);
    setMorphState('morphing');
  }, []);

  const onDrag = useCallback((newProgress: number) => {
    // Clamp between 0 and 1
    const clamped = Math.max(0, Math.min(1, newProgress));
    progress.set(clamped);
  }, [progress]);

  const onDragEnd = useCallback(() => {
    setIsDragging(false);

    // Snap to nearest state based on current progress
    const currentProgress = progress.get();

    if (isMobile) {
      // Mobile: snap to iPod (0), island (0.5), or expanded (1)
      if (currentProgress < 0.25) {
        setMorphState('ipod');
        animateTo(0);
      } else if (currentProgress < 0.75) {
        setMorphState('island');
        animateTo(0.5);
      } else {
        setMorphState('expanded');
        animateTo(1);
      }
    } else {
      // Desktop: snap to iPod (0) or expanded (1)
      if (currentProgress < 0.5) {
        setMorphState('ipod');
        animateTo(0);
      } else {
        setMorphState('expanded');
        animateTo(1);
      }
    }
  }, [progress, isMobile, animateTo]);

  // Direct progress setter for external control
  const setMorphProgress = useCallback((newProgress: number) => {
    progress.set(Math.max(0, Math.min(1, newProgress)));
  }, [progress]);

  return {
    morphProgress,
    morphState,
    isDragging,
    isMobile,
    progress,
    ipodScale,
    ipodBorderRadius,
    ipodWidth,
    ipodHeight,
    panelOpacity,
    expand,
    collapse,
    toggleExpanded,
    onDragStart,
    onDrag,
    onDragEnd,
    setMorphProgress,
  };
}
