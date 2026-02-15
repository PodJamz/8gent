'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import type React from 'react';
import { motion, useMotionValue, animate, PanInfo, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useHomeScreen, AppItem } from '@/context/HomeScreenContext';
import { X } from 'lucide-react';
import { springs, motionConfig } from '@/components/motion/config';

interface DraggableAppIconProps {
  app: AppItem;
  index: number;
  delay?: number;
  onClick?: () => void;
  notificationCount?: number;
  onAppOpen?: (appId: string) => void;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
  /** Focus handler for roving tabindex */
  onFocus?: () => void;
}

// Store transition origin for page animations
export const APP_TRANSITION_KEY = 'openclaw_appTransition';

// Long press duration (ms) to enter edit mode
const LONG_PRESS_DURATION = 500;

export function DraggableAppIcon({
  app,
  index,
  delay = 0,
  onClick,
  notificationCount = 0,
  onAppOpen,
  tabIndex = 0,
  onFocus,
}: DraggableAppIconProps) {
  const iconRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);

  const {
    isEditMode,
    enterEditMode,
    dragState,
    startDrag,
    updateDragPosition,
    setDropTarget,
    endDrag,
    gridItems,
  } = useHomeScreen();

  // Motion values for drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const zIndex = useMotionValue(0);

  // Derived values
  const isDragging = dragState.isDragging && dragState.draggedIndex === index;
  const isDropTarget = dragState.dropTargetIndex === index && !isDragging;

  // Reset position when not dragging
  useEffect(() => {
    if (!isDragging) {
      animate(x, 0, springs.tight);
      animate(y, 0, springs.tight);
      animate(scale, 1, springs.tight);
      zIndex.set(0);
    }
  }, [isDragging, x, y, scale, zIndex]);

  // Long press handler to enter edit mode
  const handleLongPressStart = useCallback(() => {
    longPressTimerRef.current = setTimeout(() => {
      if (!isDraggingRef.current) {
        enterEditMode();
        // Haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
    }, LONG_PRESS_DURATION);
  }, [enterEditMode]);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // Handle tap/click
  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    // Don't navigate if in edit mode or currently dragging
    if (isEditMode || isDraggingRef.current) return;

    // Mark notifications as read when opening app
    if (onAppOpen) {
      onAppOpen(app.id);
    }

    // Custom onClick handler (e.g., for Claw AI chat)
    if (onClick) {
      onClick();
      return;
    }

    // External links open in new tab
    if (app.external && app.href) {
      window.open(app.href, '_blank', 'noopener,noreferrer');
      return;
    }

    // Internal navigation with transition
    if (app.href && !app.isChat) {
      if (iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect();
        const transitionData = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
          gradient: app.gradient,
          timestamp: Date.now(),
        };
        sessionStorage.setItem(APP_TRANSITION_KEY, JSON.stringify(transitionData));
      }
      router.push(app.href);
    }
  }, [app, router, onClick, isEditMode, onAppOpen]);

  // Drag handlers
  const handleDragStart = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isEditMode) return;

    isDraggingRef.current = true;
    handleLongPressEnd();

    zIndex.set(100);
    animate(scale, 1.1, springs.snappy);

    const offset = {
      x: info.point.x,
      y: info.point.y,
    };

    startDrag({ type: 'app', item: app }, index, offset);
  }, [isEditMode, app, index, startDrag, handleLongPressEnd, scale, zIndex]);

  const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isEditMode || !dragState.isDragging) return;

    updateDragPosition({ x: info.point.x, y: info.point.y });

    // Calculate which grid position we're over
    if (iconRef.current) {
      const iconCenter = {
        x: info.point.x,
        y: info.point.y,
      };

      // Find potential drop target
      const gridContainer = iconRef.current.closest('.app-grid-container');
      if (gridContainer) {
        const icons = gridContainer.querySelectorAll('.app-icon-wrapper');
        let closestIndex = -1;
        let closestDistance = Infinity;

        icons.forEach((icon, i) => {
          if (i === index) return; // Skip self

          const rect = icon.getBoundingClientRect();
          const center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };

          const distance = Math.hypot(iconCenter.x - center.x, iconCenter.y - center.y);

          if (distance < closestDistance && distance < 80) {
            closestDistance = distance;
            closestIndex = i;
          }
        });

        setDropTarget(closestIndex >= 0 ? closestIndex : null);
      }
    }
  }, [isEditMode, dragState.isDragging, index, updateDragPosition, setDropTarget]);

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    animate(scale, 1, springs.snappy);
    zIndex.set(0);
    endDrag();
  }, [endDrag, scale, zIndex]);

  // Mouse/Touch event handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    handleLongPressStart();
  }, [handleLongPressStart]);

  const handlePointerUp = useCallback(() => {
    handleLongPressEnd();
  }, [handleLongPressEnd]);

  const handlePointerCancel = useCallback(() => {
    handleLongPressEnd();
  }, [handleLongPressEnd]);

  // Use CSS class for wiggle animation to avoid Framer Motion type issues
  const shouldWiggle = isEditMode && !isDragging;

  // Handle keyboard activation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isEditMode) {
        handleTap(e as unknown as React.MouseEvent);
      }
    }
  }, [isEditMode, handleTap]);

  return (
    <motion.div
      className={`app-icon-wrapper flex flex-col items-center gap-2 relative ${shouldWiggle ? (index % 2 === 0 ? 'animate-ios-wiggle' : 'animate-ios-wiggle-alt') : ''
        }`}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{
        opacity: dragState.isDragging && dragState.draggedIndex !== index && isDropTarget ? 0.5 : 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        delay,
        ...springs.snappy,
      }}
      style={{
        x: isDragging ? x : 0,
        y: isDragging ? y : 0,
        scale,
        zIndex,
      }}
      drag={isEditMode}
      dragMomentum={motionConfig.drag.momentum}
      dragElastic={motionConfig.drag.elastic}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      whileHover={!isEditMode ? { scale: 1.05 } : undefined}
      whileTap={!isEditMode ? { scale: 0.95 } : undefined}
      tabIndex={tabIndex}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      role="gridcell"
      aria-label={`${app.name}${notificationCount > 0 ? `, ${notificationCount} notifications` : ''}`}
      data-app-icon
    >
      {/* Delete button in edit mode */}
      {isEditMode && (
        <motion.button
          className="absolute -top-1 -left-1 z-20 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center border border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            // Could implement remove functionality here
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Remove ${app.name}`}
        >
          <X className="w-3 h-3 text-white" aria-hidden="true" />
        </motion.button>
      )}

      {/* Notification badge */}
      <AnimatePresence>
        {notificationCount > 0 && !isEditMode && (
          <motion.div
            className="absolute -top-1 -right-1 z-20 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-red-500/30"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={springs.tight}
          >
            {notificationCount > 99 ? '99+' : notificationCount}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop target indicator */}
      {isDropTarget && (
        <motion.div
          className="absolute inset-0 rounded-[22px] border-2 border-white/50 bg-white/10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          layoutId="drop-indicator"
        />
      )}

      <div
        ref={iconRef}
        onClick={handleTap}
        className="block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-[20px]"
      >
        <motion.div
          className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-[18px] sm:rounded-[20px] flex items-center justify-center shadow-lg relative overflow-hidden"
          style={{ background: app.imageUrl ? 'transparent' : app.gradient }}
          animate={{
            boxShadow: isDragging
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              : isDropTarget
                ? '0 0 20px rgba(255, 255, 255, 0.3)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          }}
        >
          {app.imageUrl ? (
            <img
              src={app.imageUrl}
              alt={app.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <>
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

              {/* Icon */}
              <div className="relative z-10 text-white">
                {app.icon}
              </div>
            </>
          )}
        </motion.div>
      </div>
      <span className="text-white/90 text-xs font-medium text-center max-w-[72px] truncate select-none">
        {app.name}
      </span>
    </motion.div>
  );
}
