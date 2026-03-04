'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tabsListVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      default: 'rounded-lg bg-muted p-1',
      underline: 'border-b gap-4',
      pills: 'gap-2',
      segment: 'rounded-lg bg-muted p-1',
    },
    size: {
      sm: 'h-8 text-xs',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const tabTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'rounded-md px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        underline:
          'border-b-2 border-transparent px-1 pb-3 data-[state=active]:border-primary data-[state=active]:text-foreground',
        pills:
          'rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
        segment:
          'flex-1 rounded-md px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  variant: 'default' | 'underline' | 'pills' | 'segment';
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('Tabs components must be used within a Tabs provider');
  return context;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tabsListVariants> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, variant = 'default', value, defaultValue, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || '');
    const currentValue = value ?? internalValue;

    const handleValueChange = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, variant: variant || 'default' }}>
        <div ref={ref} className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = 'Tabs';

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant: propVariant, size, children, ...props }, ref) => {
    const { variant: contextVariant } = useTabsContext();
    const variant = propVariant || contextVariant;

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(tabsListVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: React.ReactNode;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, icon, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange, variant } = useTabsContext();
    const isActive = selectedValue === value;
    const panelId = `tabpanel-${value}`;
    const triggerId = `tab-${value}`;

    return (
      <button
        ref={ref}
        id={triggerId}
        role="tab"
        type="button"
        aria-selected={isActive}
        aria-controls={panelId}
        tabIndex={isActive ? 0 : -1}
        data-state={isActive ? 'active' : 'inactive'}
        onClick={() => onValueChange(value)}
        className={cn(tabTriggerVariants({ variant }), className)}
        {...props}
      >
        {icon && <span className="mr-2" aria-hidden="true">{icon}</span>}
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue } = useTabsContext();
    const panelId = `tabpanel-${value}`;
    const triggerId = `tab-${value}`;

    if (selectedValue !== value) return null;

    return (
      <div
        ref={ref}
        id={panelId}
        role="tabpanel"
        aria-labelledby={triggerId}
        tabIndex={0}
        data-state={selectedValue === value ? 'active' : 'inactive'}
        className={cn('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabTriggerVariants };
