'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const accordionVariants = cva('', {
  variants: {
    variant: {
      default: 'divide-y divide-border',
      bordered: 'border rounded-lg overflow-hidden divide-y divide-border',
      separated: 'space-y-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const accordionItemVariants = cva('', {
  variants: {
    variant: {
      default: '',
      bordered: '',
      separated: 'border rounded-lg overflow-hidden',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface AccordionContextValue {
  expandedItems: string[];
  toggleItem: (value: string) => void;
  variant: 'default' | 'bordered' | 'separated';
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error('Accordion components must be used within an Accordion');
  return context;
}

export interface AccordionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionVariants> {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      className,
      variant = 'default',
      type = 'single',
      defaultValue,
      value,
      onValueChange,
      children,
      ...props
    },
    ref
  ) => {
    const getInitialExpanded = () => {
      if (value !== undefined) {
        return Array.isArray(value) ? value : value ? [value] : [];
      }
      if (defaultValue !== undefined) {
        return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      }
      return [];
    };

    const [expandedItems, setExpandedItems] = React.useState<string[]>(getInitialExpanded);

    const controlledItems = value !== undefined
      ? (Array.isArray(value) ? value : value ? [value] : [])
      : expandedItems;

    const toggleItem = (itemValue: string) => {
      let newExpanded: string[];

      if (type === 'single') {
        newExpanded = controlledItems.includes(itemValue) ? [] : [itemValue];
      } else {
        newExpanded = controlledItems.includes(itemValue)
          ? controlledItems.filter((v) => v !== itemValue)
          : [...controlledItems, itemValue];
      }

      setExpandedItems(newExpanded);
      onValueChange?.(type === 'single' ? (newExpanded[0] || '') : newExpanded);
    };

    return (
      <AccordionContext.Provider value={{ expandedItems: controlledItems, toggleItem, variant: variant || 'default' }}>
        <div ref={ref} className={cn(accordionVariants({ variant }), className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = 'Accordion';

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, disabled, children, ...props }, ref) => {
    const { variant } = useAccordionContext();

    return (
      <div
        ref={ref}
        data-value={value}
        data-disabled={disabled || undefined}
        className={cn(accordionItemVariants({ variant }), disabled && 'opacity-50', className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { value, disabled } as object);
          }
          return child;
        })}
      </div>
    );
  }
);
AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string;
  icon?: React.ReactNode;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, value, icon, children, disabled, ...props }, ref) => {
    const { expandedItems, toggleItem } = useAccordionContext();
    const isExpanded = value ? expandedItems.includes(value) : false;

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isExpanded}
        disabled={disabled}
        onClick={() => value && toggleItem(value)}
        className={cn(
          'flex w-full items-center justify-between py-4 px-4 font-medium transition-all hover:bg-muted/50 text-left',
          '[&[data-state=open]>svg]:rotate-180',
          disabled && 'cursor-not-allowed',
          className
        )}
        data-state={isExpanded ? 'open' : 'closed'}
        {...props}
      >
        <span className="flex items-center gap-2">
          {icon}
          {children}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </button>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { expandedItems } = useAccordionContext();
    const isExpanded = value ? expandedItems.includes(value) : false;
    const prefersReducedMotion = useReducedMotion();

    return (
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            ref={ref}
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
            {...(props as object)}
          >
            <div className={cn('px-4 pb-4 pt-0 text-sm', className)}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, accordionVariants };
