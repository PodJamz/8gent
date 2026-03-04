'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
      auto: 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-items-start',
      center: 'justify-items-center',
      end: 'justify-items-end',
      stretch: 'justify-items-stretch',
    },
  },
  defaultVariants: {
    cols: 'auto',
    gap: 'md',
    align: 'stretch',
    justify: 'stretch',
  },
});

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, align, justify, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(gridVariants({ cols, gap, align, justify, className }))}
        {...props}
      />
    );
  }
);
Grid.displayName = 'Grid';

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: number;
  start?: number;
  end?: number;
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, span, start, end, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          gridColumn: span ? `span ${span}` : start && end ? `${start} / ${end}` : undefined,
          ...style,
        }}
        {...props}
      />
    );
  }
);
GridItem.displayName = 'GridItem';

export { Grid, GridItem, gridVariants };
