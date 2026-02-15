'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const blockquoteVariants = cva('pl-4 italic', {
  variants: {
    variant: {
      default: 'border-l-4 border-border',
      highlighted: 'border-l-4 border-primary bg-primary/5 p-4 rounded-r-lg',
      minimal: 'text-muted-foreground',
      card: 'bg-muted p-6 rounded-lg border',
    },
    size: {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'base',
  },
});

export interface BlockquoteProps
  extends React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
    VariantProps<typeof blockquoteVariants> {
  citation?: string;
  author?: string;
}

const Blockquote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({ className, variant, size, citation, author, children, ...props }, ref) => {
    return (
      <blockquote
        ref={ref}
        className={cn(blockquoteVariants({ variant, size, className }))}
        cite={citation}
        {...props}
      >
        {children}
        {author && (
          <footer className="mt-2 text-sm text-muted-foreground not-italic">
            - {author}
          </footer>
        )}
      </blockquote>
    );
  }
);
Blockquote.displayName = 'Blockquote';

export { Blockquote, blockquoteVariants };
