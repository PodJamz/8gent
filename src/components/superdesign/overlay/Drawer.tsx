'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const drawerVariants = cva('fixed bg-background shadow-lg z-50 flex flex-col', {
  variants: {
    side: {
      left: 'inset-y-0 left-0 h-full border-r',
      right: 'inset-y-0 right-0 h-full border-l',
      top: 'inset-x-0 top-0 w-full border-b',
      bottom: 'inset-x-0 bottom-0 w-full border-t',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
      full: '',
    },
  },
  compoundVariants: [
    { side: 'left', size: 'sm', className: 'w-64' },
    { side: 'left', size: 'md', className: 'w-80' },
    { side: 'left', size: 'lg', className: 'w-96' },
    { side: 'left', size: 'full', className: 'w-full' },
    { side: 'right', size: 'sm', className: 'w-64' },
    { side: 'right', size: 'md', className: 'w-80' },
    { side: 'right', size: 'lg', className: 'w-96' },
    { side: 'right', size: 'full', className: 'w-full' },
    { side: 'top', size: 'sm', className: 'h-48' },
    { side: 'top', size: 'md', className: 'h-64' },
    { side: 'top', size: 'lg', className: 'h-96' },
    { side: 'top', size: 'full', className: 'h-full' },
    { side: 'bottom', size: 'sm', className: 'h-48' },
    { side: 'bottom', size: 'md', className: 'h-64' },
    { side: 'bottom', size: 'lg', className: 'h-96' },
    { side: 'bottom', size: 'full', className: 'h-full' },
  ],
  defaultVariants: {
    side: 'right',
    size: 'md',
  },
});

const slideVariants = {
  left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
  right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
  top: { initial: { y: '-100%' }, animate: { y: 0 }, exit: { y: '-100%' } },
  bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
};

export interface DrawerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerVariants> {
  open?: boolean;
  onClose?: () => void;
  showOverlay?: boolean;
  showCloseButton?: boolean;
}

const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      className,
      side = 'right',
      size,
      open = false,
      onClose,
      showOverlay = true,
      showCloseButton = true,
      children,
      ...props
    },
    ref
  ) => {
    const variants = slideVariants[side || 'right'];
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
      : { type: 'spring' as const, damping: 25, stiffness: 300 };

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

    return (
      <AnimatePresence>
        {open && (
          <div
            role="dialog"
            aria-modal="true"
          >
            {showOverlay && (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={onClose}
                aria-hidden="true"
              />
            )}
            <motion.div
              ref={mergedRef}
              initial={prefersReducedMotion ? false : variants.initial}
              animate={variants.animate}
              exit={prefersReducedMotion ? undefined : variants.exit}
              transition={transition}
              className={cn(drawerVariants({ side, size }), className)}
              {...(props as object)}
            >
              {showCloseButton && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Close</span>
                </button>
              )}
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }
);
Drawer.displayName = 'Drawer';

const DrawerHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  )
);
DrawerTitle.displayName = 'DrawerTitle';

const DrawerBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 overflow-auto p-6', className)} {...props} />
  )
);
DrawerBody.displayName = 'DrawerBody';

const DrawerFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-end gap-2 p-6 border-t', className)} {...props} />
  )
);
DrawerFooter.displayName = 'DrawerFooter';

export { Drawer, DrawerHeader, DrawerTitle, DrawerBody, DrawerFooter, drawerVariants };
