'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      error: 'text-red-600 dark:text-red-400',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    transform: {
      none: '',
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
    },
    leading: {
      none: 'leading-none',
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    color: 'default',
    align: 'left',
    transform: 'none',
    leading: 'normal',
  },
});

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: 'span' | 'p' | 'div' | 'label' | 'strong' | 'em' | 'small';
  truncate?: boolean;
  lineClamp?: number;
}

const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (
    { className, size, weight, color, align, transform, leading, as = 'span', truncate, lineClamp, style, ...props },
    ref
  ) => {
    return React.createElement(as, {
      ref,
      className: cn(
        textVariants({ size, weight, color, align, transform, leading }),
        truncate && 'truncate',
        lineClamp && `line-clamp-${lineClamp}`,
        className
      ),
      style: lineClamp ? { WebkitLineClamp: lineClamp, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', ...style } : style,
      ...props,
    });
  }
);
Text.displayName = 'Text';

export { Text, textVariants };
