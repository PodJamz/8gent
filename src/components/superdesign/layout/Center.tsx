'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
}

const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, inline, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center',
          inline && 'inline-flex',
          className
        )}
        {...props}
      />
    );
  }
);
Center.displayName = 'Center';

export { Center };
