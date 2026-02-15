'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const containerVariants = cva('w-full mx-auto px-4', {
  variants: {
    size: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
      prose: 'max-w-prose',
    },
    padding: {
      none: 'px-0',
      sm: 'px-2 sm:px-4',
      md: 'px-4 sm:px-6',
      lg: 'px-6 sm:px-8',
    },
  },
  defaultVariants: {
    size: 'xl',
    padding: 'md',
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, as, ...props }, ref) => {
    const computedClassName = cn(containerVariants({ size, padding, className }));

    if (as) {
      return React.createElement(as, {
        ref,
        className: computedClassName,
        ...props,
      });
    }

    return (
      <div
        ref={ref}
        className={computedClassName}
        {...props}
      />
    );
  }
);
Container.displayName = 'Container';

export { Container, containerVariants };
