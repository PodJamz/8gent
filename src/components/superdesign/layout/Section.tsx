'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const sectionVariants = cva('w-full', {
  variants: {
    padding: {
      none: 'py-0',
      sm: 'py-8',
      md: 'py-12',
      lg: 'py-16',
      xl: 'py-24',
      '2xl': 'py-32',
    },
    background: {
      default: 'bg-background',
      muted: 'bg-muted',
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      accent: 'bg-accent',
      transparent: 'bg-transparent',
    },
  },
  defaultVariants: {
    padding: 'lg',
    background: 'default',
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: 'section' | 'article' | 'aside' | 'div' | 'main' | 'header' | 'footer';
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, padding, background, as = 'section', ...props }, ref) => {
    return React.createElement(as, {
      ref,
      className: cn(sectionVariants({ padding, background, className })),
      ...props,
    });
  }
);
Section.displayName = 'Section';

export { Section, sectionVariants };
