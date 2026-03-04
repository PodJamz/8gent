import type { ReactNode } from 'react';

/**
 * Marketing layout for 8gent public pages
 *
 * This layout is for unauthenticated pages like the landing page,
 * features, pricing, etc.
 */
export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {children}
    </div>
  );
}
