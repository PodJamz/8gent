'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const statVariants = cva('', {
  variants: {
    variant: {
      default: '',
      card: 'rounded-lg border bg-card p-6 shadow-sm',
      minimal: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface StatProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'>,
    VariantProps<typeof statVariants> {
  label: string;
  value: string | number;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  icon?: React.ReactNode;
  helpText?: string;
}

const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  (
    {
      className,
      variant,
      size,
      label,
      value,
      change,
      changeType,
      prefix,
      suffix,
      icon,
      helpText,
      ...props
    },
    ref
  ) => {
    const determinedChangeType = changeType || (change && change > 0 ? 'increase' : change && change < 0 ? 'decrease' : 'neutral');

    const changeColors = {
      increase: 'text-green-600 dark:text-green-400',
      decrease: 'text-red-600 dark:text-red-400',
      neutral: 'text-muted-foreground',
    };

    const ChangeIcon = {
      increase: TrendingUp,
      decrease: TrendingDown,
      neutral: Minus,
    }[determinedChangeType || 'neutral'];

    const sizeClasses = {
      sm: { label: 'text-xs', value: 'text-xl', change: 'text-xs' },
      md: { label: 'text-sm', value: 'text-3xl', change: 'text-sm' },
      lg: { label: 'text-base', value: 'text-4xl', change: 'text-base' },
    };

    const sizes = sizeClasses[size || 'md'];

    return (
      <div ref={ref} className={cn(statVariants({ variant, size }), className)} {...props}>
        <div className="flex items-center justify-between">
          <p className={cn('font-medium text-muted-foreground', sizes.label)}>{label}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          {prefix && <span className="text-muted-foreground">{prefix}</span>}
          <span className={cn('font-bold tracking-tight', sizes.value)}>{value}</span>
          {suffix && <span className="text-muted-foreground">{suffix}</span>}
        </div>
        {(change !== undefined || helpText) && (
          <div className="mt-2 flex items-center gap-2">
            {change !== undefined && (
              <span className={cn('flex items-center gap-1', sizes.change, changeColors[determinedChangeType || 'neutral'])}>
                <ChangeIcon className="h-3 w-3" />
                {Math.abs(change)}%
              </span>
            )}
            {helpText && (
              <span className={cn('text-muted-foreground', sizes.change)}>{helpText}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);
Stat.displayName = 'Stat';

export interface StatGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
}

const StatGroup = React.forwardRef<HTMLDivElement, StatGroupProps>(
  ({ className, columns = 4, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid gap-4',
          columns === 2 && 'grid-cols-1 sm:grid-cols-2',
          columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
StatGroup.displayName = 'StatGroup';

export { Stat, StatGroup, statVariants };
