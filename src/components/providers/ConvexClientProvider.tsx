'use client';

import { ReactNode } from 'react';
import { ConvexReactClient, ConvexProvider } from '@/lib/openclaw/hooks';

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || 'https://placeholder.convex.cloud'
);

interface ConvexClientProviderProps {
  children: ReactNode;
}

// Standalone Convex provider (no Clerk auth required)
// Works for public data access; user-specific features require Clerk
export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}

// Re-export for potential authenticated usage
export { convex };
