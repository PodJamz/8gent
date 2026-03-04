'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const checkboxVariants = cva(
  'peer shrink-0 border border-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 rounded',
        md: 'h-5 w-5 rounded-md',
        lg: 'h-6 w-6 rounded-md',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  description?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size, label, description, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const [checked, setChecked] = React.useState(props.defaultChecked || false);

    return (
      <div className="flex items-start gap-3">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            className="sr-only"
            checked={props.checked ?? checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              props.onChange?.(e);
            }}
            {...props}
          />
          <div
            className={cn(
              checkboxVariants({ size }),
              'flex items-center justify-center cursor-pointer',
              className
            )}
            data-state={(props.checked ?? checked) ? 'checked' : 'unchecked'}
            onClick={() => {
              if (!props.disabled) {
                const newChecked = !(props.checked ?? checked);
                setChecked(newChecked);
                const event = { target: { checked: newChecked } } as React.ChangeEvent<HTMLInputElement>;
                props.onChange?.(event);
              }
            }}
          >
            {(props.checked ?? checked) && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
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
Checkbox.displayName = 'Checkbox';

export { Checkbox, checkboxVariants };
