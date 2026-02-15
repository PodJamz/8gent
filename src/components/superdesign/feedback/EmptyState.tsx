'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Inbox, Search, FileX, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const emptyStateVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      size: {
        sm: 'py-8 gap-3',
        md: 'py-12 gap-4',
        lg: 'py-16 gap-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const iconContainerVariants = cva(
  'flex items-center justify-center rounded-full bg-muted',
  {
    variants: {
      size: {
        sm: 'h-12 w-12',
        md: 'h-16 w-16',
        lg: 'h-20 w-20',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const iconVariants = cva('text-muted-foreground', {
  variants: {
    size: {
      sm: 'h-5 w-5',
      md: 'h-7 w-7',
      lg: 'h-9 w-9',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const presetIcons = {
  inbox: Inbox,
  search: Search,
  file: FileX,
  error: AlertCircle,
};

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: keyof typeof presetIcons | React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, size, icon = 'inbox', title, description, action, children, ...props }, ref) => {
    const IconComponent = typeof icon === 'string' && icon in presetIcons
      ? presetIcons[icon as keyof typeof presetIcons]
      : null;

    return (
      <div ref={ref} className={cn(emptyStateVariants({ size }), className)} {...props}>
        <div className={cn(iconContainerVariants({ size }))}>
          {IconComponent ? (
            <IconComponent className={cn(iconVariants({ size }))} />
          ) : (
            icon
          )}
        </div>
        {title && (
          <h3 className={cn('font-semibold text-foreground', size === 'lg' ? 'text-xl' : 'text-lg')}>
            {title}
          </h3>
        )}
        {description && (
          <p className={cn('text-muted-foreground max-w-sm', size === 'sm' ? 'text-sm' : 'text-base')}>
            {description}
          </p>
        )}
        {children}
        {action && <div className="mt-2">{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';

export { EmptyState, emptyStateVariants };
