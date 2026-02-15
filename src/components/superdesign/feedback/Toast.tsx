'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const toastVariants = cva(
  'pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800',
        success: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800',
        warning: 'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-800',
        error: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const iconMap = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
};

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
  open?: boolean;
  onClose?: () => void;
  duration?: number;
  action?: React.ReactNode;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      variant = 'default',
      title,
      description,
      open = true,
      onClose,
      duration = 5000,
      action,
      children,
      ...props
    },
    ref
  ) => {
    const Icon = iconMap[variant || 'default'];
    const prefersReducedMotion = useReducedMotion();

    React.useEffect(() => {
      if (open && duration && onClose) {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
      }
    }, [open, duration, onClose]);

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            role="alert"
            aria-live="polite"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 20, scale: 0.95 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
            className={cn(toastVariants({ variant }), className)}
            {...(props as object)}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <div className="flex-1 space-y-1">
              {title && <p className="text-sm font-semibold">{title}</p>}
              {description && <p className="text-sm opacity-90">{description}</p>}
              {children}
            </div>
            {action}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-2 top-2 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
Toast.displayName = 'Toast';

export interface ToastContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

const positionClasses = {
  'top-left': 'top-0 left-0',
  'top-center': 'top-0 left-1/2 -translate-x-1/2',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-0 right-0',
};

const ToastContainer = React.forwardRef<HTMLDivElement, ToastContainerProps>(
  ({ className, position = 'bottom-right', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'fixed z-50 flex flex-col gap-2 p-4 max-h-screen w-full sm:max-w-[420px] pointer-events-none',
          positionClasses[position],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ToastContainer.displayName = 'ToastContainer';

export { Toast, ToastContainer, toastVariants };
