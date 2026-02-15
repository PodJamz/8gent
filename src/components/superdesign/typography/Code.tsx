'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const codeVariants = cva('font-mono', {
  variants: {
    variant: {
      inline: 'px-1.5 py-0.5 bg-muted rounded text-sm',
      block: 'block p-4 bg-muted rounded-lg text-sm overflow-x-auto',
    },
    color: {
      default: 'text-foreground',
      primary: 'text-primary',
      muted: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'inline',
    color: 'default',
  },
});

export interface CodeProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof codeVariants> {
  language?: string;
}

const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, variant, color, language, ...props }, ref) => {
    if (variant === 'block') {
      return (
        <pre className={cn('overflow-x-auto', className)}>
          <code
            ref={ref}
            className={cn(codeVariants({ variant, color }))}
            data-language={language}
            {...props}
          />
        </pre>
      );
    }
    return (
      <code
        ref={ref}
        className={cn(codeVariants({ variant, color, className }))}
        {...props}
      />
    );
  }
);
Code.displayName = 'Code';

export { Code, codeVariants };
