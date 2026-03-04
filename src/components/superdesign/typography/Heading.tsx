'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const headingVariants = cva('font-bold tracking-tight text-foreground', {
  variants: {
    level: {
      1: 'text-4xl sm:text-5xl lg:text-6xl',
      2: 'text-3xl sm:text-4xl',
      3: 'text-2xl sm:text-3xl',
      4: 'text-xl sm:text-2xl',
      5: 'text-lg sm:text-xl',
      6: 'text-base sm:text-lg',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
    },
  },
  defaultVariants: {
    level: 1,
    weight: 'bold',
    align: 'left',
    color: 'default',
  },
});

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof headingVariants> {
  as?: `h${HeadingLevel}`;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 1, weight, align, color, as, ...props }, ref) => {
    const Component = as || (`h${level}` as `h${HeadingLevel}`);
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ level, weight, align, color, className }))}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';

export { Heading, headingVariants };
