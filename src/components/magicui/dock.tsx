"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { PropsWithChildren, useRef, useState, useCallback } from "react";

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  magnification?: number;
  distance?: number;
  children: React.ReactNode;
  /** ARIA label for the dock navigation */
  ariaLabel?: string;
  /** Inline styles for the dock */
  style?: React.CSSProperties;
}

const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;

const dockVariants = cva(
  "mx-auto w-max h-full p-2 flex items-end rounded-full border"
);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      magnification = DEFAULT_MAGNIFICATION,
      distance = DEFAULT_DISTANCE,
      ariaLabel = "Main navigation dock",
      style,
      ...props
    },
    ref
  ) => {
    const mousex = useMotionValue(Infinity);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const childCount = React.Children.count(children);

    // Handle keyboard navigation with roving tabindex
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      const focusableChildren = React.Children.toArray(children).filter(
        (child) => React.isValidElement(child)
      );
      const count = focusableChildren.length;

      if (count === 0) return;

      let newIndex = focusedIndex;
      let handled = false;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          newIndex = focusedIndex === -1 ? 0 : (focusedIndex + 1) % count;
          handled = true;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          newIndex = focusedIndex === -1 ? count - 1 : (focusedIndex - 1 + count) % count;
          handled = true;
          break;
        case 'Home':
          newIndex = 0;
          handled = true;
          break;
        case 'End':
          newIndex = count - 1;
          handled = true;
          break;
      }

      if (handled) {
        e.preventDefault();
        setFocusedIndex(newIndex);
        // Focus the element at the new index
        const container = e.currentTarget as HTMLElement;
        const items = container.querySelectorAll<HTMLElement>('[data-dock-item]');
        items[newIndex]?.focus();
      }
    }, [children, focusedIndex]);

    const renderChildren = () => {
      let itemIndex = 0;
      return React.Children.map(children, (child: any, index) => {
        if (React.isValidElement(child)) {
          const currentIndex = itemIndex++;
          return React.cloneElement(child, {
            mousex,
            magnification,
            distance,
            tabIndex: focusedIndex === -1 ? (currentIndex === 0 ? 0 : -1) : (currentIndex === focusedIndex ? 0 : -1),
            onFocus: () => setFocusedIndex(currentIndex),
            'data-dock-item': true,
          } as DockIconProps);
        }
        return child;
      });
    };

    return (
      <motion.nav
        ref={ref}
        role="navigation"
        aria-label={ariaLabel}
        onMouseMove={(e) => mousex.set(e.pageX)}
        onMouseLeave={() => mousex.set(Infinity)}
        onKeyDown={handleKeyDown}
        {...props}
        className={cn(dockVariants({ className }))}
        style={style}
      >
        {renderChildren()}
      </motion.nav>
    );
  }
);

Dock.displayName = "Dock";

export interface DockIconProps {
  size?: number;
  magnification?: number;
  distance?: number;
  mousex?: any;
  className?: string;
  children?: React.ReactNode;
  props?: PropsWithChildren;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
  /** Focus handler for roving tabindex */
  onFocus?: () => void;
  /** ARIA label for the dock item */
  ariaLabel?: string;
  /** Data attribute for dock item identification */
  'data-dock-item'?: boolean;
}

const DockIcon = ({
  size,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mousex,
  className,
  children,
  tabIndex = 0,
  onFocus,
  ariaLabel,
  'data-dock-item': dataDockItem,
  ...props
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const distanceCalc = useTransform(mousex, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [40, magnification, 40]
  );

  let width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      tabIndex={tabIndex}
      onFocus={onFocus}
      role="menuitem"
      aria-label={ariaLabel}
      data-dock-item={dataDockItem}
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-full",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
