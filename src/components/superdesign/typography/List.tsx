'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const listVariants = cva('', {
  variants: {
    variant: {
      unordered: 'list-disc',
      ordered: 'list-decimal',
      none: 'list-none',
    },
    spacing: {
      tight: 'space-y-1',
      normal: 'space-y-2',
      relaxed: 'space-y-4',
    },
    position: {
      inside: 'list-inside',
      outside: 'list-outside ml-4',
    },
  },
  defaultVariants: {
    variant: 'unordered',
    spacing: 'normal',
    position: 'outside',
  },
});

export interface ListProps
  extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement>,
    VariantProps<typeof listVariants> {}

const List = React.forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
  ({ className, variant, spacing, position, ...props }, ref) => {
    const Component = variant === 'ordered' ? 'ol' : 'ul';
    return React.createElement(Component, {
      ref,
      className: cn(listVariants({ variant, spacing, position, className })),
      ...props,
    });
  }
);
List.displayName = 'List';

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode;
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, icon, children, ...props }, ref) => {
    if (icon) {
      return (
        <li ref={ref} className={cn('flex items-start gap-2 list-none', className)} {...props}>
          <span className="shrink-0 mt-1">{icon}</span>
          <span>{children}</span>
        </li>
      );
    }
    return (
      <li ref={ref} className={cn(className)} {...props}>
        {children}
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

export { List, ListItem, listVariants };
