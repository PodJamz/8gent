'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const chipVariants = cva(
  'inline-flex items-center gap-2 rounded-full border transition-colors cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'border-input bg-background hover:bg-accent',
        filled: 'border-transparent bg-muted hover:bg-muted/80',
      },
      size: {
        sm: 'text-xs px-2.5 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
      },
      selected: {
        true: 'border-primary bg-primary/10 text-primary',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'filled',
        selected: true,
        className: 'bg-primary text-primary-foreground hover:bg-primary/90',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      selected: false,
    },
  }
);

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof chipVariants> {
  selected?: boolean;
  onChange?: (selected: boolean) => void;
  avatar?: React.ReactNode;
  icon?: React.ReactNode;
  showCheckmark?: boolean;
  disabled?: boolean;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      variant,
      size,
      selected = false,
      onChange,
      avatar,
      icon,
      showCheckmark = true,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={selected}
        disabled={disabled}
        onClick={() => onChange?.(!selected)}
        className={cn(
          chipVariants({ variant, size, selected }),
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {avatar && <span className="shrink-0 -ml-1">{avatar}</span>}
        {icon && !selected && <span className="shrink-0">{icon}</span>}
        {selected && showCheckmark && <Check className="h-3.5 w-3.5 shrink-0" />}
        {children}
      </button>
    );
  }
);
Chip.displayName = 'Chip';

export interface ChipGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  multiple?: boolean;
}

const ChipGroup = React.forwardRef<HTMLDivElement, ChipGroupProps>(
  ({ className, value, defaultValue = [], onChange, multiple = true, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue);
    const selectedValues = value ?? internalValue;

    const handleChange = (chipValue: string, chipSelected: boolean) => {
      let newValue: string[];
      if (multiple) {
        newValue = chipSelected
          ? [...selectedValues, chipValue]
          : selectedValues.filter((v) => v !== chipValue);
      } else {
        newValue = chipSelected ? [chipValue] : [];
      }
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    return (
      <div ref={ref} className={cn('flex flex-wrap gap-2', className)} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement<ChipProps & { value?: string }>(child)) {
            const chipValue = child.props.value || String(child.props.children);
            return React.cloneElement(child, {
              selected: selectedValues.includes(chipValue),
              onChange: (selected: boolean) => handleChange(chipValue, selected),
            });
          }
          return child;
        })}
      </div>
    );
  }
);
ChipGroup.displayName = 'ChipGroup';

export { Chip, ChipGroup, chipVariants };
