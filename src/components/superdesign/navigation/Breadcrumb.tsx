'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const breadcrumbVariants = cva('flex items-center', {
  variants: {
    size: {
      sm: 'text-xs gap-1',
      md: 'text-sm gap-2',
      lg: 'text-base gap-2',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof breadcrumbVariants> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
  maxItems?: number;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      className,
      size,
      items,
      separator,
      showHome = false,
      homeHref = '/',
      maxItems,
      ...props
    },
    ref
  ) => {
    const Separator = separator || <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />;

    let displayItems = items;
    if (maxItems && items.length > maxItems) {
      const start = items.slice(0, 1);
      const end = items.slice(-(maxItems - 2));
      displayItems = [
        ...start,
        { label: '...' },
        ...end,
      ];
    }

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={cn(breadcrumbVariants({ size }), className)} {...props}>
        <ol className="flex items-center gap-1.5">
          {showHome && (
            <>
              <li>
                <a href={homeHref} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Home className="h-4 w-4" />
                  <span className="sr-only">Home</span>
                </a>
              </li>
              {items.length > 0 && <li aria-hidden="true">{Separator}</li>}
            </>
          )}
          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1;
            return (
              <React.Fragment key={index}>
                <li className="flex items-center gap-1.5">
                  {item.icon}
                  {item.href && !isLast ? (
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className={cn(isLast ? 'font-medium text-foreground' : 'text-muted-foreground')}>
                      {item.label}
                    </span>
                  )}
                </li>
                {!isLast && <li aria-hidden="true">{Separator}</li>}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);
Breadcrumb.displayName = 'Breadcrumb';

export { Breadcrumb, breadcrumbVariants };
