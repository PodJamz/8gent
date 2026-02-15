'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuVariants = cva('flex flex-col', {
  variants: {
    variant: {
      default: 'bg-popover text-popover-foreground rounded-md border shadow-md',
      ghost: '',
    },
    size: {
      sm: 'min-w-[8rem] p-1',
      md: 'min-w-[12rem] p-1',
      lg: 'min-w-[16rem] p-2',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const menuItemVariants = cva(
  'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'text-destructive hover:bg-destructive hover:text-destructive-foreground',
      },
      inset: {
        true: 'pl-8',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      inset: false,
    },
  }
);

export interface MenuProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof menuVariants> {}

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="menu"
        className={cn(menuVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Menu.displayName = 'Menu';

export interface MenuItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof menuItemVariants> {
  disabled?: boolean;
  icon?: React.ReactNode;
  shortcut?: string;
  selected?: boolean;
}

const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  ({ className, variant, inset, disabled, icon, shortcut, selected, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="menuitem"
        data-disabled={disabled ? '' : undefined}
        className={cn(menuItemVariants({ variant, inset }), className)}
        {...props}
      >
        {icon && <span className="mr-2 h-4 w-4">{icon}</span>}
        {selected !== undefined && (
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            {selected && <Check className="h-4 w-4" />}
          </span>
        )}
        <span className="flex-1">{children}</span>
        {shortcut && <span className="ml-auto text-xs tracking-widest text-muted-foreground">{shortcut}</span>}
      </div>
    );
  }
);
MenuItem.displayName = 'MenuItem';

export interface MenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>(
  ({ className, inset, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
        {...props}
      />
    );
  }
);
MenuLabel.displayName = 'MenuLabel';

const MenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />;
  }
);
MenuSeparator.displayName = 'MenuSeparator';

export interface MenuSubProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  icon?: React.ReactNode;
}

const MenuSub = React.forwardRef<HTMLDivElement, MenuSubProps>(
  ({ className, label, icon, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);

    return (
      <div
        ref={ref}
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        <div className={cn(menuItemVariants({}), 'justify-between', className)}>
          <span className="flex items-center gap-2">
            {icon && <span className="h-4 w-4">{icon}</span>}
            {label}
          </span>
          <ChevronRight className="h-4 w-4" />
        </div>
        {open && (
          <div className="absolute left-full top-0 ml-1">
            <Menu>{children}</Menu>
          </div>
        )}
      </div>
    );
  }
);
MenuSub.displayName = 'MenuSub';

export { Menu, MenuItem, MenuLabel, MenuSeparator, MenuSub, menuVariants, menuItemVariants };
