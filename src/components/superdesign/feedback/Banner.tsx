'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, Info, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const bannerVariants = cva(
  'relative w-full flex items-center gap-4 px-4 py-3',
  {
    variants: {
      variant: {
        default: 'bg-muted text-foreground',
        info: 'bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100',
        success: 'bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100',
        warning: 'bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100',
        error: 'bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100',
        gradient: 'bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground',
      },
      position: {
        top: 'fixed top-0 left-0 right-0 z-50',
        bottom: 'fixed bottom-0 left-0 right-0 z-50',
        inline: 'relative',
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'inline',
    },
  }
);

const iconMap = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
  gradient: Info,
};

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      variant = 'default',
      position,
      dismissible,
      onDismiss,
      icon,
      action,
      children,
      ...props
    },
    ref
  ) => {
    const Icon = iconMap[variant || 'default'];

    return (
      <div
        ref={ref}
        role="banner"
        className={cn(bannerVariants({ variant, position }), className)}
        {...props}
      >
        <div className="shrink-0">{icon || <Icon className="h-5 w-5" />}</div>
        <div className="flex-1 text-sm font-medium">{children}</div>
        {action && <div className="shrink-0">{action}</div>}
        {dismissible && (
          <button
            onClick={onDismiss}
            className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Banner.displayName = 'Banner';

export { Banner, bannerVariants };
