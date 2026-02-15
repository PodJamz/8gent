'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { GripVertical, GripHorizontal, Grip } from 'lucide-react';
import { cn } from '@/lib/utils';

const dragHandleVariants = cva(
  'flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors touch-none select-none',
  {
    variants: {
      orientation: {
        vertical: '',
        horizontal: '',
        both: '',
      },
      size: {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
      },
      variant: {
        default: '',
        ghost: 'hover:bg-muted rounded',
        bordered: 'border rounded hover:bg-muted',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
      size: 'md',
      variant: 'default',
    },
  }
);

export interface DragHandleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dragHandleVariants> {
  disabled?: boolean;
}

const DragHandle = React.forwardRef<HTMLDivElement, DragHandleProps>(
  ({ className, orientation, size, variant, disabled, ...props }, ref) => {
    const Icon = {
      vertical: GripVertical,
      horizontal: GripHorizontal,
      both: Grip,
    }[orientation || 'vertical'];

    const iconSize = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    }[size || 'md'];

    return (
      <div
        ref={ref}
        role="button"
        aria-label="Drag handle"
        aria-disabled={disabled}
        className={cn(
          dragHandleVariants({ orientation, size, variant }),
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        {...props}
      >
        <Icon className={iconSize} />
      </div>
    );
  }
);
DragHandle.displayName = 'DragHandle';

export { DragHandle, dragHandleVariants };
