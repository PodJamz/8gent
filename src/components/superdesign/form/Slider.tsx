'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const sliderVariants = cva('relative flex w-full touch-none select-none items-center', {
  variants: {
    size: {
      sm: 'h-4',
      md: 'h-5',
      lg: 'h-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const trackVariants = cva('relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted', {
  variants: {
    size: {
      sm: 'h-1',
      md: 'h-1.5',
      lg: 'h-2',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const thumbVariants = cva(
  'block rounded-full border-2 border-primary bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-3.5 w-3.5',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface SliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof sliderVariants> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      size,
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      onChange,
      showValue,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const value = controlledValue ?? internalValue;
    const percentage = ((value - min) / (max - min)) * 100;
    const trackRef = React.useRef<HTMLDivElement>(null);
    const thumbRef = React.useRef<HTMLDivElement>(null);

    const handleChange = (newValue: number) => {
      const clampedValue = Math.min(max, Math.max(min, Math.round(newValue / step) * step));
      setInternalValue(clampedValue);
      onChange?.(clampedValue);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled || !trackRef.current) return;

      const updateValue = (clientX: number) => {
        const rect = trackRef.current!.getBoundingClientRect();
        const percent = (clientX - rect.left) / rect.width;
        const newValue = min + percent * (max - min);
        handleChange(newValue);
      };

      updateValue(e.clientX);
      thumbRef.current?.focus();

      const handleMouseMove = (e: MouseEvent) => updateValue(e.clientX);
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      let newValue = value;
      const largeStep = step * 10;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = value + step;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = value - step;
          break;
        case 'PageUp':
          newValue = value + largeStep;
          break;
        case 'PageDown':
          newValue = value - largeStep;
          break;
        case 'Home':
          newValue = min;
          break;
        case 'End':
          newValue = max;
          break;
        default:
          return;
      }

      e.preventDefault();
      handleChange(newValue);
    };

    return (
      <div className="flex items-center gap-4 w-full">
        <div
          ref={ref}
          className={cn(sliderVariants({ size }), disabled && 'opacity-50', className)}
          onMouseDown={handleMouseDown}
          {...props}
        >
          <div ref={trackRef} className={cn(trackVariants({ size }))}>
            <div
              className="absolute h-full bg-primary rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div
            ref={thumbRef}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-disabled={disabled}
            onKeyDown={handleKeyDown}
            className={cn(thumbVariants({ size }), 'absolute cursor-pointer')}
            style={{ left: `calc(${percentage}% - ${size === 'sm' ? '7px' : size === 'lg' ? '10px' : '8px'})` }}
          />
        </div>
        {showValue && <span className="text-sm text-muted-foreground min-w-[3ch]" aria-hidden="true">{value}</span>}
      </div>
    );
  }
);
Slider.displayName = 'Slider';

export { Slider, sliderVariants };
