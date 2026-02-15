'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  p?: string | number;
  px?: string | number;
  py?: string | number;
  m?: string | number;
  mx?: string | number;
  my?: string | number;
  bg?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  border?: boolean;
}

const roundedMap = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

const shadowMap = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
};

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      className,
      as,
      p,
      px,
      py,
      m,
      mx,
      my,
      bg,
      rounded,
      shadow,
      border,
      style,
      ...props
    },
    ref
  ) => {
    const inlineStyle: React.CSSProperties = {
      padding: typeof p === 'number' ? `${p}px` : p,
      paddingLeft: typeof px === 'number' ? `${px}px` : px,
      paddingRight: typeof px === 'number' ? `${px}px` : px,
      paddingTop: typeof py === 'number' ? `${py}px` : py,
      paddingBottom: typeof py === 'number' ? `${py}px` : py,
      margin: typeof m === 'number' ? `${m}px` : m,
      marginLeft: typeof mx === 'number' ? `${mx}px` : mx,
      marginRight: typeof mx === 'number' ? `${mx}px` : mx,
      marginTop: typeof my === 'number' ? `${my}px` : my,
      marginBottom: typeof my === 'number' ? `${my}px` : my,
      backgroundColor: bg,
      ...style,
    };

    const computedClassName = cn(
      rounded && roundedMap[rounded],
      shadow && shadowMap[shadow],
      border && 'border border-border',
      className
    );

    if (as) {
      const Component = as;
      return React.createElement(Component, {
        ref,
        className: computedClassName,
        style: inlineStyle,
        ...props,
      });
    }

    return (
      <div
        ref={ref}
        className={computedClassName}
        style={inlineStyle}
        {...props}
      />
    );
  }
);
Box.displayName = 'Box';

export { Box };
