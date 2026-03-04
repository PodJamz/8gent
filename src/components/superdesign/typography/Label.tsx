'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const labelVariants = cva('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', {
  variants: {
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      error: 'text-destructive',
    },
    size: {
      sm: 'text-xs',
      base: 'text-sm',
      lg: 'text-base',
    },
    required: {
      true: "after:content-['*'] after:ml-0.5 after:text-destructive",
      false: '',
    },
  },
  defaultVariants: {
    color: 'default',
    size: 'base',
    required: false,
  },
});

export interface LabelProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'color'>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, color, size, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(labelVariants({ color, size, required, className }))}
        {...props}
      />
    );
  }
);
Label.displayName = 'Label';

export { Label, labelVariants };
