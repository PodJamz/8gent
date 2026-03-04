import type { ReactNode } from 'react';

/**
 * App layout for authenticated 8gent users
 *
 * This layout wraps all authenticated pages including
 * the AAC board, voice designer, settings, etc.
 *
 * Note: This will integrate with Clerk auth middleware later.
 */
export default function AppLayout({
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
