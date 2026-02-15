'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const formGroupVariants = cva('', {
  variants: {
    layout: {
      vertical: 'flex flex-col',
      horizontal: 'flex flex-row items-start',
      grid: 'grid',
    },
    spacing: {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
    },
  },
  compoundVariants: [
    { layout: 'grid', className: 'grid-cols-1 sm:grid-cols-2' },
  ],
  defaultVariants: {
    layout: 'vertical',
    spacing: 'md',
  },
});

export interface FormGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formGroupVariants> {
  legend?: string;
  description?: string;
  cols?: 1 | 2 | 3 | 4;
}

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, layout, spacing, legend, description, cols, style, children, ...props }, ref) => {
    const gridCols = cols
      ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }
      : undefined;

    const content = (
      <div
        ref={ref}
        className={cn(formGroupVariants({ layout, spacing, className }))}
        style={{ ...gridCols, ...style }}
        {...props}
      >
        {children}
      </div>
    );

    if (legend) {
      return (
        <fieldset className="border-0 p-0 m-0">
          <legend className="text-sm font-semibold mb-2">{legend}</legend>
          {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
          {content}
        </fieldset>
      );
    }

    return content;
  }
);
FormGroup.displayName = 'FormGroup';

export { FormGroup, formGroupVariants };
