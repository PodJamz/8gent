'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
}

/**
 * MainContent wrapper that conditionally applies top padding.
 * On the home page (/), the Desktop component has its own header with DynamicIsland,
 * so we don't need the StatusBar padding.
 * On other pages, the global StatusBar is visible, so we need pt-7.
 */
export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={cn(
        'focus:outline-none',
        !isHomePage && 'pt-7'
      )}
      role="main"
      aria-label="Main content"
    >
      {children}
    </main>
  );
}
