'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const popoverVariants = cva(
  'z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none',
  {
    variants: {
      size: {
        sm: 'p-2 w-48',
        md: 'p-4 w-72',
        lg: 'p-6 w-96',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface PopoverProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof popoverVariants> {
  trigger: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  offset?: number;
  triggerMode?: 'click' | 'hover';
}

const placementStyles: Record<Placement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const placementAnimations = {
  top: { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 5 } },
  bottom: { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -5 } },
  left: { initial: { opacity: 0, x: 5 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 5 } },
  right: { initial: { opacity: 0, x: -5 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -5 } },
} as const;

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      className,
      size,
      trigger,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      placement = 'bottom',
      triggerMode = 'click',
      children,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const open = controlledOpen ?? internalOpen;
    const containerRef = React.useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    const setOpen = (value: boolean) => {
      setInternalOpen(value);
      onOpenChange?.(value);
    };

    React.useEffect(() => {
      if (triggerMode !== 'click') return;

      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [open, triggerMode]);

    const triggerProps =
      triggerMode === 'click'
        ? { onClick: () => setOpen(!open) }
        : { onMouseEnter: () => setOpen(true), onMouseLeave: () => setOpen(false) };

    const animation = placementAnimations[placement];

    return (
      <div ref={containerRef} className="relative inline-block" {...(triggerMode === 'hover' ? triggerProps : {})}>
        <div {...(triggerMode === 'click' ? triggerProps : {})}>{trigger}</div>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={ref}
              initial={prefersReducedMotion ? false : animation.initial}
              animate={animation.animate}
              exit={prefersReducedMotion ? undefined : animation.exit}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15 }}
              className={cn(
                'absolute',
                placementStyles[placement],
                popoverVariants({ size }),
                className
              )}
              {...(props as object)}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Popover.displayName = 'Popover';

export { Popover, popoverVariants };
