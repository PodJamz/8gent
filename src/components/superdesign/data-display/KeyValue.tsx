'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const keyValueVariants = cva('', {
  variants: {
    layout: {
      horizontal: 'flex items-center justify-between gap-4',
      vertical: 'flex flex-col gap-1',
      inline: 'inline-flex items-center gap-2',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    layout: 'horizontal',
    size: 'md',
  },
});

export interface KeyValueProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof keyValueVariants> {
  label: React.ReactNode;
  value: React.ReactNode;
  copyable?: boolean;
}

const KeyValue = React.forwardRef<HTMLDivElement, KeyValueProps>(
  ({ className, layout, size, label, value, copyable, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
      if (typeof value === 'string') {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    return (
      <div ref={ref} className={cn(keyValueVariants({ layout, size }), className)} {...props}>
        <dt className="text-muted-foreground shrink-0">{label}</dt>
        <dd className="font-medium flex items-center gap-2">
          {value}
          {copyable && typeof value === 'string' && (
            <button
              onClick={handleCopy}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </dd>
      </div>
    );
  }
);
KeyValue.displayName = 'KeyValue';

export interface KeyValueListProps extends React.HTMLAttributes<HTMLDListElement> {
  items?: Array<{ key: string; label: React.ReactNode; value: React.ReactNode }>;
  divider?: boolean;
  layout?: 'horizontal' | 'vertical';
  striped?: boolean;
}

const KeyValueList = React.forwardRef<HTMLDListElement, KeyValueListProps>(
  ({ className, items, divider = true, layout = 'horizontal', striped, children, ...props }, ref) => {
    return (
      <dl
        ref={ref}
        className={cn(
          'space-y-0',
          divider && '[&>*]:border-b [&>*]:last:border-b-0',
          className
        )}
        {...props}
      >
        {items
          ? items.map((item, index) => (
              <div
                key={item.key}
                className={cn(
                  'py-3',
                  striped && index % 2 === 1 && 'bg-muted/50'
                )}
              >
                <KeyValue layout={layout} label={item.label} value={item.value} />
              </div>
            ))
          : React.Children.map(children, (child, index) => (
              <div
                className={cn(
                  'py-3',
                  striped && index % 2 === 1 && 'bg-muted/50'
                )}
              >
                {child}
              </div>
            ))}
      </dl>
    );
  }
);
KeyValueList.displayName = 'KeyValueList';

export { KeyValue, KeyValueList, keyValueVariants };
