'use client';

import type { ReactNode } from 'react';
import { AppProvider } from '@/context/AppContext';

/**
 * App layout for 8gent users
 *
 * Provides AppContext for personalization settings.
 */
export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#f2f2f7]">
        {children}
      </div>
    </AppProvider>
  );
}
