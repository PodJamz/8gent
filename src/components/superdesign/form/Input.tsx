'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full border bg-background text-foreground transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-8 px-2 text-sm rounded-md',
        md: 'h-10 px-3 text-sm rounded-md',
        lg: 'h-12 px-4 text-base rounded-lg',
      },
      variant: {
        default: 'border-input',
        filled: 'border-transparent bg-muted',
        ghost: 'border-transparent hover:bg-muted focus:bg-muted',
        underline: 'border-x-0 border-t-0 border-b-2 rounded-none px-0',
      },
      state: {
        default: '',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      state: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, variant, state, type = 'text', leftIcon, rightIcon, ...props }, ref) => {
    if (leftIcon || rightIcon) {
      return (
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground" aria-hidden="true">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              inputVariants({ size, variant, state }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center pointer-events-none text-muted-foreground" aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }
    return (
      <input
        ref={ref}
        type={type}
        className={cn(inputVariants({ size, variant, state, className }))}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
