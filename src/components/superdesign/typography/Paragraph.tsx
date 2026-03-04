'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const paragraphVariants = cva('text-foreground', {
  variants: {
    size: {
      sm: 'text-sm leading-relaxed',
      base: 'text-base leading-relaxed',
      lg: 'text-lg leading-relaxed',
      xl: 'text-xl leading-relaxed',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
    },
    spacing: {
      none: '',
      sm: 'mb-2',
      md: 'mb-4',
      lg: 'mb-6',
    },
  },
  defaultVariants: {
    size: 'base',
    color: 'default',
    spacing: 'md',
  },
});

export interface ParagraphProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof paragraphVariants> {
  firstLetter?: boolean;
}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, size, color, spacing, firstLetter, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          paragraphVariants({ size, color, spacing }),
          firstLetter && 'first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:text-primary',
          className
        )}
        {...props}
      />
    );
  }
);
Paragraph.displayName = 'Paragraph';

export { Paragraph, paragraphVariants };
