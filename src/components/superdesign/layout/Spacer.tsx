'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spacerVariants = cva('', {
  variants: {
    size: {
      xs: 'h-1 w-1',
      sm: 'h-2 w-2',
      md: 'h-4 w-4',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
      '2xl': 'h-12 w-12',
      '3xl': 'h-16 w-16',
      '4xl': 'h-24 w-24',
    },
    axis: {
      horizontal: 'h-0',
      vertical: 'w-0',
      both: '',
    },
  },
  defaultVariants: {
    size: 'md',
    axis: 'both',
  },
});

export interface SpacerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spacerVariants> {
  flex?: boolean;
}

const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ className, size, axis, flex, ...props }, ref) => {
    if (flex) {
      return <div ref={ref} className={cn('flex-1', className)} {...props} />;
    }
    return (
      <div
        ref={ref}
        className={cn(spacerVariants({ size, axis, className }))}
        aria-hidden="true"
        {...props}
      />
    );
  }
);
Spacer.displayName = 'Spacer';

export { Spacer, spacerVariants };
