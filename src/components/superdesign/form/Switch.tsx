'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-14',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const thumbVariants = cva(
  'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 data-[state=checked]:translate-x-4',
        md: 'h-5 w-5 data-[state=checked]:translate-x-5',
        lg: 'h-6 w-6 data-[state=checked]:translate-x-7',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof switchVariants> {
  label?: string;
  description?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, size, label, description, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const [checked, setChecked] = React.useState(props.defaultChecked || false);
    const isChecked = props.checked ?? checked;

    return (
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            id={inputId}
            className="sr-only"
            checked={isChecked}
            onChange={(e) => {
              setChecked(e.target.checked);
              props.onChange?.(e);
            }}
            {...props}
          />
          <button
            type="button"
            role="switch"
            aria-checked={isChecked}
            className={cn(switchVariants({ size }), className)}
            data-state={isChecked ? 'checked' : 'unchecked'}
            disabled={props.disabled}
            onClick={() => {
              if (!props.disabled) {
                const newChecked = !isChecked;
                setChecked(newChecked);
                const event = { target: { checked: newChecked } } as React.ChangeEvent<HTMLInputElement>;
                props.onChange?.(event);
              }
            }}
          >
            <span
              className={cn(thumbVariants({ size }))}
              data-state={isChecked ? 'checked' : 'unchecked'}
            />
          </button>
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
Switch.displayName = 'Switch';

export { Switch, switchVariants };
