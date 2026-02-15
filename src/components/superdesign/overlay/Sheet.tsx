'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const sheetVariants = cva('fixed bg-background shadow-lg z-50 flex flex-col', {
  variants: {
    side: {
      bottom: 'inset-x-0 bottom-0 rounded-t-[20px] border-t',
      top: 'inset-x-0 top-0 rounded-b-[20px] border-b',
    },
    size: {
      auto: '',
      sm: '',
      md: '',
      lg: '',
      full: 'h-[calc(100%-3rem)]',
    },
  },
  compoundVariants: [
    { side: 'bottom', size: 'sm', className: 'max-h-[30vh]' },
    { side: 'bottom', size: 'md', className: 'max-h-[50vh]' },
    { side: 'bottom', size: 'lg', className: 'max-h-[80vh]' },
    { side: 'top', size: 'sm', className: 'max-h-[30vh]' },
    { side: 'top', size: 'md', className: 'max-h-[50vh]' },
    { side: 'top', size: 'lg', className: 'max-h-[80vh]' },
  ],
  defaultVariants: {
    side: 'bottom',
    size: 'auto',
  },
});

export interface SheetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> {
  open?: boolean;
  onClose?: () => void;
  showHandle?: boolean;
  swipeToClose?: boolean;
  swipeThreshold?: number;
}

const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  (
    {
      className,
      side = 'bottom',
      size,
      open = false,
      onClose,
      showHandle = true,
      swipeToClose = true,
      swipeThreshold = 100,
      children,
      ...props
    },
    ref
  ) => {
    const isVertical = side === 'bottom' || side === 'top';
    const prefersReducedMotion = useReducedMotion();
    const focusTrapRef = useFocusTrap(open);

    // Merge refs
    const mergedRef = React.useMemo(() => {
      return (node: HTMLDivElement | null) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        (focusTrapRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      };
    }, [ref, focusTrapRef]);

    const transition = prefersReducedMotion
      ? { duration: 0 }
      : { type: 'spring' as const, damping: 30, stiffness: 300 };

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!swipeToClose) return;

      if (side === 'bottom' && info.offset.y > swipeThreshold) {
        onClose?.();
      } else if (side === 'top' && info.offset.y < -swipeThreshold) {
        onClose?.();
      }
    };

    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [open]);

    const variants = {
      initial: isVertical
        ? { y: side === 'bottom' ? '100%' : '-100%' }
        : {},
      animate: { y: 0 },
      exit: isVertical
        ? { y: side === 'bottom' ? '100%' : '-100%' }
        : {},
    };

    return (
      <AnimatePresence>
        {open && (
          <div
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={onClose}
              aria-hidden="true"
            />
            <motion.div
              ref={mergedRef}
              initial={prefersReducedMotion ? false : variants.initial}
              animate={variants.animate}
              exit={prefersReducedMotion ? undefined : variants.exit}
              transition={transition}
              drag={swipeToClose && isVertical && !prefersReducedMotion ? 'y' : undefined}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className={cn(sheetVariants({ side, size }), className)}
              {...(props as object)}
            >
              {showHandle && side === 'bottom' && (
                <div className="flex justify-center py-3" aria-hidden="true">
                  <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
                </div>
              )}
              <div className="flex-1 overflow-auto">{children}</div>
              {showHandle && side === 'top' && (
                <div className="flex justify-center py-3" aria-hidden="true">
                  <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }
);
Sheet.displayName = 'Sheet';

const SheetHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 space-y-1.5', className)} {...props} />
  )
);
SheetHeader.displayName = 'SheetHeader';

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
  )
);
SheetTitle.displayName = 'SheetTitle';

const SheetBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-4', className)} {...props} />
);
SheetBody.displayName = 'SheetBody';

export { Sheet, SheetHeader, SheetTitle, SheetBody, sheetVariants };
