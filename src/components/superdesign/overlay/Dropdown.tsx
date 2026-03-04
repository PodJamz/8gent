'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const dropdownContentVariants = cva(
  'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
  {
    variants: {
      align: {
        start: 'origin-top-left',
        center: 'origin-top',
        end: 'origin-top-right',
      },
    },
    defaultVariants: {
      align: 'start',
    },
  }
);

const dropdownItemVariants = cva(
  'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        destructive: 'text-destructive focus:bg-destructive focus:text-destructive-foreground',
      },
      inset: {
        true: 'pl-8',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      inset: false,
    },
  }
);

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  registerItem: (id: string) => void;
  unregisterItem: (id: string) => void;
  items: string[];
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error('Dropdown components must be used within a Dropdown');
  return context;
}

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ open: controlledOpen, defaultOpen = false, onOpenChange, children, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const [items, setItems] = React.useState<string[]>([]);
    const open = controlledOpen ?? internalOpen;
    const containerRef = React.useRef<HTMLDivElement>(null);

    const setOpen = (value: boolean) => {
      setInternalOpen(value);
      onOpenChange?.(value);
      if (!value) {
        setActiveIndex(-1);
      }
    };

    const registerItem = React.useCallback((id: string) => {
      setItems((prev) => [...prev, id]);
    }, []);

    const unregisterItem = React.useCallback((id: string) => {
      setItems((prev) => prev.filter((item) => item !== id));
    }, []);

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [open]);

    React.useEffect(() => {
      if (!open) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
            break;
          case 'ArrowUp':
            e.preventDefault();
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
            break;
          case 'Home':
            e.preventDefault();
            setActiveIndex(0);
            break;
          case 'End':
            e.preventDefault();
            setActiveIndex(items.length - 1);
            break;
          case 'Escape':
            e.preventDefault();
            setOpen(false);
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, items.length]);

    return (
      <DropdownContext.Provider value={{ open, setOpen, activeIndex, setActiveIndex, registerItem, unregisterItem, items }}>
        <div ref={containerRef} className="relative inline-block" {...props}>
          {children}
        </div>
      </DropdownContext.Provider>
    );
  }
);
Dropdown.displayName = 'Dropdown';

export interface DropdownTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DropdownTrigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useDropdownContext();
    return (
      <button
        ref={ref}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownTrigger.displayName = 'DropdownTrigger';

export interface DropdownContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dropdownContentVariants> {}

const DropdownContent = React.forwardRef<HTMLDivElement, DropdownContentProps>(
  ({ className, align, children, ...props }, ref) => {
    const { open } = useDropdownContext();
    const prefersReducedMotion = useReducedMotion();

    const alignClasses = {
      start: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-0',
    };

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95, y: -5 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15 }}
            className={cn(
              'absolute top-full mt-1',
              alignClasses[align || 'start'],
              dropdownContentVariants({ align }),
              className
            )}
            role="menu"
            {...(props as object)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
DropdownContent.displayName = 'DropdownContent';

export interface DropdownItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dropdownItemVariants> {
  disabled?: boolean;
  icon?: React.ReactNode;
  shortcut?: string;
  selected?: boolean;
}

const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ className, variant, inset, disabled, icon, shortcut, selected, children, onClick, ...props }, ref) => {
    const { setOpen, activeIndex, items, registerItem, unregisterItem } = useDropdownContext();
    const itemRef = React.useRef<HTMLDivElement>(null);
    const id = React.useId();

    React.useEffect(() => {
      if (!disabled) {
        registerItem(id);
        return () => unregisterItem(id);
      }
    }, [id, disabled, registerItem, unregisterItem]);

    const index = items.indexOf(id);
    const isActive = index === activeIndex;

    React.useEffect(() => {
      if (isActive && itemRef.current) {
        itemRef.current.focus();
      }
    }, [isActive]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!disabled) {
          onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
          setOpen(false);
        }
      }
    };

    return (
      <div
        ref={itemRef}
        role="menuitem"
        tabIndex={isActive ? 0 : -1}
        data-disabled={disabled ? '' : undefined}
        aria-disabled={disabled}
        className={cn(
          dropdownItemVariants({ variant, inset }),
          isActive && 'bg-accent text-accent-foreground',
          className
        )}
        onClick={(e) => {
          if (!disabled) {
            onClick?.(e);
            setOpen(false);
          }
        }}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {selected !== undefined && (
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            {selected && <Check className="h-4 w-4" />}
          </span>
        )}
        {icon && <span className="mr-2 h-4 w-4">{icon}</span>}
        <span className="flex-1">{children}</span>
        {shortcut && <span className="ml-auto text-xs tracking-widest text-muted-foreground">{shortcut}</span>}
      </div>
    );
  }
);
DropdownItem.displayName = 'DropdownItem';

const DropdownLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }>(
  ({ className, inset, ...props }, ref) => (
    <div ref={ref} className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)} {...props} />
  )
);
DropdownLabel.displayName = 'DropdownLabel';

const DropdownSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
  )
);
DropdownSeparator.displayName = 'DropdownSeparator';

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  dropdownContentVariants,
  dropdownItemVariants,
};
