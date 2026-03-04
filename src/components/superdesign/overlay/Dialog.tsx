'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const dialogVariants = cva('relative bg-background rounded-lg shadow-lg border max-w-md w-full', {
  variants: {
    variant: {
      default: '',
      info: '',
      success: '',
      warning: '',
      error: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const iconMap = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

const iconColorMap = {
  default: 'text-muted-foreground',
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
};

export interface DialogProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogVariants> {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showIcon?: boolean;
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      className,
      variant = 'default',
      open = false,
      onClose,
      title,
      description,
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      onConfirm,
      onCancel,
      showIcon = true,
      children,
      ...props
    },
    ref
  ) => {
    const Icon = iconMap[variant || 'default'];
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

    const handleConfirm = () => {
      onConfirm?.();
      onClose?.();
    };

    const handleCancel = () => {
      onCancel?.();
      onClose?.();
    };

    const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.2 };

    return (
      <AnimatePresence>
        {open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={title ? 'dialog-title' : undefined}
            aria-describedby={description ? 'dialog-description' : undefined}
          >
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={transition}
              className="fixed inset-0 bg-black/50"
              onClick={onClose}
              aria-hidden="true"
            />
            <motion.div
              ref={mergedRef}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
              transition={transition}
              className={cn(dialogVariants({ variant }), className)}
              {...(props as object)}
            >
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="p-6">
                <div className="flex gap-4">
                  {showIcon && (
                    <div className={cn('shrink-0', iconColorMap[variant || 'default'])} aria-hidden="true">
                      <Icon className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    {title && <h3 id="dialog-title" className="text-lg font-semibold">{title}</h3>}
                    {description && <p id="dialog-description" className="mt-1 text-sm text-muted-foreground">{description}</p>}
                    {children}
                  </div>
                </div>

                {(onConfirm || onCancel) && (
                  <div className="mt-6 flex justify-end gap-3">
                    {onCancel && (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        {cancelLabel}
                      </button>
                    )}
                    {onConfirm && (
                      <button
                        type="button"
                        onClick={handleConfirm}
                        className={cn(
                          'px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                          variant === 'error'
                            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        )}
                      >
                        {confirmLabel}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }
);
Dialog.displayName = 'Dialog';

export { Dialog, dialogVariants };
