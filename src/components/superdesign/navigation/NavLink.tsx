'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const navLinkVariants = cva(
  'inline-flex items-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'text-muted-foreground hover:text-foreground data-[active=true]:text-foreground',
        underline: 'text-muted-foreground hover:text-foreground data-[active=true]:text-foreground border-b-2 border-transparent data-[active=true]:border-primary pb-1',
        pill: 'rounded-full px-3 py-1.5 text-muted-foreground hover:bg-muted data-[active=true]:bg-primary data-[active=true]:text-primary-foreground',
        sidebar: 'w-full rounded-md px-3 py-2 text-muted-foreground hover:bg-muted data-[active=true]:bg-muted data-[active=true]:text-foreground',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface NavLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof navLinkVariants> {
  active?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, variant, size, active, icon, badge, disabled, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        data-active={active || undefined}
        aria-current={active ? 'page' : undefined}
        className={cn(
          navLinkVariants({ variant, size }),
          disabled && 'pointer-events-none opacity-50',
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {badge && <span className="ml-auto shrink-0">{badge}</span>}
      </a>
    );
  }
);
NavLink.displayName = 'NavLink';

export interface NavGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

const NavGroup = React.forwardRef<HTMLDivElement, NavGroupProps>(
  ({ className, label, collapsible, defaultOpen = true, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(defaultOpen);

    return (
      <div ref={ref} className={cn('space-y-1', className)} {...props}>
        {label && (
          <div
            className={cn(
              'px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider',
              collapsible && 'cursor-pointer hover:text-foreground flex items-center justify-between'
            )}
            onClick={() => collapsible && setOpen(!open)}
          >
            {label}
            {collapsible && (
              <span className={cn('transition-transform', open && 'rotate-90')}>›</span>
            )}
          </div>
        )}
        {(!collapsible || open) && <nav className="space-y-1">{children}</nav>}
      </div>
    );
  }
);
NavGroup.displayName = 'NavGroup';

export { NavLink, NavGroup, navLinkVariants };
