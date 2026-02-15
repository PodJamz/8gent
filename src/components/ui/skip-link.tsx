'use client';

import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Skip link component for keyboard accessibility
 * Allows users to skip to main content
 */
export function SkipLink({
  href = '#main-content',
  className,
  children = 'Skip to main content',
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        // Visually hidden by default
        'sr-only',
        // Show on focus
        'focus:not-sr-only',
        'focus:fixed focus:top-4 focus:left-4 focus:z-[100]',
        'focus:px-4 focus:py-2',
        'focus:rounded-lg',
        'focus:text-sm focus:font-medium',
        // Theme-aware styling
        'focus:bg-background focus:text-foreground',
        'focus:border focus:border-border',
        'focus:shadow-lg',
        'focus:ring-2 focus:ring-ring focus:ring-offset-2',
        // Transition
        'focus:outline-none',
        'transition-all duration-200',
        className
      )}
    >
      {children}
    </a>
  );
}

/**
 * Skip link target - wrap your main content with this
 */
export function SkipLinkTarget({
  id = 'main-content',
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <main
      id={id}
      tabIndex={-1}
      className={cn('focus:outline-none', className)}
    >
      {children}
    </main>
  );
}
