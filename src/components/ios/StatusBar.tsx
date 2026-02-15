'use client';

import { useCallback } from 'react';
import { motion, useMotionValue, PanInfo } from 'framer-motion';
import { useControlCenter } from '@/context/ControlCenterContext';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  className?: string;
}

/**
 * StatusBar - Minimal invisible drag area for Control Center
 *
 * Super subtle - just an invisible touch/drag area at the very top
 * of the screen. Swipe down to open Control Center on any page.
 */
export function StatusBar({ className }: StatusBarProps) {
  const { open, isOpen } = useControlCenter();
  const y = useMotionValue(0);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > 30 || info.velocity.y > 300) {
        open();
      }
      y.set(0);
    },
    [open, y]
  );

  return (
    <motion.div
      className={cn(
        'fixed top-0 left-0 right-0 z-[10000]',
        'h-3', // Very small - just enough to drag
        'cursor-ns-resize',
        isOpen && 'pointer-events-none',
        className
      )}
      style={{ y }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.3}
      onDragEnd={handleDragEnd}
      aria-label="Drag down to open Control Center"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          open();
        }
      }}
    >
      {/* Invisible but draggable - only shows subtle indicator on hover */}
      <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <div className="w-8 h-1 rounded-full bg-white/30" />
      </div>
    </motion.div>
  );
}

export default StatusBar;
