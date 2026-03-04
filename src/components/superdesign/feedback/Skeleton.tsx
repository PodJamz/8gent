'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const skeletonVariants = cva('animate-pulse bg-muted', {
  variants: {
    variant: {
      default: 'rounded-md',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      text: 'rounded h-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  count?: number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, width, height, count = 1, style, ...props }, ref) => {
    const skeletonStyle: React.CSSProperties = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      ...style,
    };

    if (count > 1) {
      return (
        <div ref={ref} className="space-y-2">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className={cn(skeletonVariants({ variant }), className)}
              style={skeletonStyle}
              {...props}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        style={skeletonStyle}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

/** Pre-built skeleton patterns */
const SkeletonCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-3', className)} {...props}>
      <Skeleton height={180} className="w-full" />
      <Skeleton height={20} width="60%" />
      <Skeleton height={16} count={2} />
    </div>
  )
);
SkeletonCard.displayName = 'SkeletonCard';

const SkeletonAvatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { size?: number }>(
  ({ className, size = 40, ...props }, ref) => (
    <Skeleton
      ref={ref}
      variant="circular"
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
);
SkeletonAvatar.displayName = 'SkeletonAvatar';

const SkeletonText = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { lines?: number }>(
  ({ className, lines = 3, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  )
);
SkeletonText.displayName = 'SkeletonText';

export { Skeleton, SkeletonCard, SkeletonAvatar, SkeletonText, skeletonVariants };
