'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const dividerVariants = cva('shrink-0 bg-border', {
  variants: {
    orientation: {
      horizontal: 'h-[1px] w-full',
      vertical: 'h-full w-[1px]',
    },
    variant: {
      solid: '',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    },
    spacing: {
      none: '',
      sm: '',
      md: '',
      lg: '',
    },
  },
  compoundVariants: [
    { orientation: 'horizontal', spacing: 'sm', className: 'my-2' },
    { orientation: 'horizontal', spacing: 'md', className: 'my-4' },
    { orientation: 'horizontal', spacing: 'lg', className: 'my-6' },
    { orientation: 'vertical', spacing: 'sm', className: 'mx-2' },
    { orientation: 'vertical', spacing: 'md', className: 'mx-4' },
    { orientation: 'vertical', spacing: 'lg', className: 'mx-6' },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'solid',
    spacing: 'none',
  },
});

export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dividerVariants> {
  label?: React.ReactNode;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation, variant, spacing, label, ...props }, ref) => {
    if (label && orientation === 'horizontal') {
      return (
        <div
          ref={ref}
          className={cn('flex items-center gap-4', spacing === 'sm' && 'my-2', spacing === 'md' && 'my-4', spacing === 'lg' && 'my-6', className)}
          {...props}
        >
          <div className="flex-1 h-[1px] bg-border" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">{label}</span>
          <div className="flex-1 h-[1px] bg-border" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation ?? 'horizontal'}
        className={cn(dividerVariants({ orientation, variant, spacing, className }))}
        {...props}
      />
    );
  }
);
Divider.displayName = 'Divider';

export { Divider, dividerVariants };
