'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const radioVariants = cva(
  'shrink-0 rounded-full border border-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const radioIndicatorVariants = cva('rounded-full bg-primary', {
  variants: {
    size: {
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof radioVariants> {
  label?: string;
  description?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, size, label, description, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="flex items-start gap-3">
        <div className="relative">
          <input ref={ref} type="radio" id={inputId} className="peer sr-only" {...props} />
          <div
            className={cn(
              radioVariants({ size }),
              'flex items-center justify-center cursor-pointer peer-checked:border-primary',
              className
            )}
            onClick={() => {
              const input = document.getElementById(inputId) as HTMLInputElement;
              if (input && !input.disabled) {
                input.click();
              }
            }}
          >
            <div
              className={cn(
                radioIndicatorVariants({ size }),
                'scale-0 peer-checked:scale-100 transition-transform'
              )}
            />
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label htmlFor={inputId} className="text-sm font-medium cursor-pointer">
                {label}
              </label>
            )}
            {description && <span className="text-sm text-muted-foreground">{description}</span>}
          </div>
        )}
      </div>
    );
  }
);
Radio.displayName = 'Radio';

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, orientation = 'vertical', children, name, value, defaultValue, onValueChange, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col gap-3' : 'flex-row gap-6',
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const childProps = child.props as { value?: string };
            return React.cloneElement(child, {
              name,
              checked: value ? childProps.value === value : undefined,
              defaultChecked: defaultValue ? childProps.value === defaultValue : undefined,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.checked && onValueChange) {
                  onValueChange(childProps.value as string);
                }
              },
            } as React.HTMLAttributes<HTMLElement>);
          }
          return child;
        })}
      </div>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';

export { Radio, RadioGroup, radioVariants };
