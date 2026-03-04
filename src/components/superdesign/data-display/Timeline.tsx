'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const timelineVariants = cva('relative', {
  variants: {
    variant: {
      default: '',
      alternate: '',
      compact: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface TimelineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineVariants> {}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          timelineVariants({ variant }),
          variant === 'alternate' && 'max-w-3xl mx-auto',
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement<{ 'data-alternate'?: string }>(child)) {
            return React.cloneElement(child, {
              'data-alternate': variant === 'alternate' ? (index % 2 === 0 ? 'left' : 'right') : undefined,
            });
          }
          return child;
        })}
      </div>
    );
  }
);
Timeline.displayName = 'Timeline';

export interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  date?: string;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  isLast?: boolean;
}

const dotColorVariants = cva('h-3 w-3 rounded-full ring-4 ring-background', {
  variants: {
    color: {
      default: 'bg-muted-foreground',
      primary: 'bg-primary',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, icon, title, date, color = 'default', isLast, children, ...props }, ref) => {
    const alternate = props['data-alternate' as keyof typeof props];

    return (
      <div
        ref={ref}
        className={cn(
          'relative pb-8 pl-8',
          alternate === 'right' && 'md:pl-0 md:pr-8 md:text-right',
          className
        )}
        {...props}
      >
        {/* Line */}
        {!isLast && (
          <div
            className={cn(
              'absolute top-3 bottom-0 left-[5px] w-[2px] bg-border',
              alternate === 'right' && 'md:left-auto md:right-[5px]'
            )}
          />
        )}
        {/* Dot */}
        <div
          className={cn(
            'absolute left-0 top-1 flex items-center justify-center',
            alternate === 'right' && 'md:left-auto md:right-0'
          )}
        >
          {icon || <div className={cn(dotColorVariants({ color }))} />}
        </div>
        {/* Content */}
        <div>
          {date && <time className="text-xs text-muted-foreground">{date}</time>}
          {title && <h4 className="text-sm font-semibold mt-0.5">{title}</h4>}
          {children && <div className="mt-1 text-sm text-muted-foreground">{children}</div>}
        </div>
      </div>
    );
  }
);
TimelineItem.displayName = 'TimelineItem';

export { Timeline, TimelineItem, timelineVariants };
