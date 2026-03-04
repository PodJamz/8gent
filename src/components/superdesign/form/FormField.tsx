'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, htmlFor, error, hint, required, children, ...props }, ref) => {
    const errorId = htmlFor ? `${htmlFor}-error` : undefined;
    const hintId = htmlFor ? `${htmlFor}-hint` : undefined;
    const describedBy = error ? errorId : hint ? hintId : undefined;

    // Clone children to add aria-describedby and aria-invalid
    const enhancedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          'aria-describedby': describedBy,
          'aria-invalid': error ? true : undefined,
        } as object);
      }
      return child;
    });

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && (
          <label
            htmlFor={htmlFor}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              required && "after:content-['*'] after:ml-0.5 after:text-destructive"
            )}
          >
            {label}
          </label>
        )}
        {enhancedChildren}
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert" aria-live="polite">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = 'FormField';

export { FormField };
