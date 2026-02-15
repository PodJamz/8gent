'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const highlightVariants = cva('px-1 py-0.5 rounded', {
  variants: {
    color: {
      yellow: 'bg-yellow-200 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100',
      green: 'bg-green-200 dark:bg-green-900/50 text-green-900 dark:text-green-100',
      blue: 'bg-blue-200 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100',
      red: 'bg-red-200 dark:bg-red-900/50 text-red-900 dark:text-red-100',
      purple: 'bg-purple-200 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100',
      primary: 'bg-primary/20 text-primary',
    },
    variant: {
      solid: '',
      gradient: 'bg-gradient-to-r',
    },
  },
  compoundVariants: [
    { color: 'yellow', variant: 'gradient', className: 'from-yellow-200/60 to-yellow-300/60 dark:from-yellow-900/30 dark:to-yellow-800/30' },
    { color: 'green', variant: 'gradient', className: 'from-green-200/60 to-green-300/60 dark:from-green-900/30 dark:to-green-800/30' },
    { color: 'blue', variant: 'gradient', className: 'from-blue-200/60 to-blue-300/60 dark:from-blue-900/30 dark:to-blue-800/30' },
  ],
  defaultVariants: {
    color: 'yellow',
    variant: 'solid',
  },
});

export interface HighlightProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof highlightVariants> {}

const Highlight = React.forwardRef<HTMLElement, HighlightProps>(
  ({ className, color, variant, ...props }, ref) => {
    return (
      <mark
        ref={ref}
        className={cn(highlightVariants({ color, variant, className }))}
        {...props}
      />
    );
  }
);
Highlight.displayName = 'Highlight';

export { Highlight, highlightVariants };
