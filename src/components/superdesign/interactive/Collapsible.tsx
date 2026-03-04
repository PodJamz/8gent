'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CollapsibleContextValue {
  open: boolean;
  toggle: () => void;
  disabled?: boolean;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext() {
  const context = React.useContext(CollapsibleContext);
  if (!context) throw new Error('Collapsible components must be used within a Collapsible');
  return context;
}

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ className, open: controlledOpen, defaultOpen = false, onOpenChange, disabled, children, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const open = controlledOpen ?? internalOpen;

    const toggle = () => {
      if (disabled) return;
      const newOpen = !open;
      setInternalOpen(newOpen);
      onOpenChange?.(newOpen);
    };

    return (
      <CollapsibleContext.Provider value={{ open, toggle, disabled }}>
        <div ref={ref} data-state={open ? 'open' : 'closed'} className={cn(className)} {...props}>
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  }
);
Collapsible.displayName = 'Collapsible';

export interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, toggle, disabled } = useCollapsibleContext();

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          'flex items-center justify-between w-full',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
    );
  }
);
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

export interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
}

const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className, forceMount, children, ...props }, ref) => {
    const { open } = useCollapsibleContext();
    const prefersReducedMotion = useReducedMotion();

    if (forceMount) {
      return (
        <div
          ref={ref}
          className={cn('overflow-hidden', !open && 'hidden', className)}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            ref={ref}
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeInOut' }}
            className={cn('overflow-hidden', className)}
            {...(props as object)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
