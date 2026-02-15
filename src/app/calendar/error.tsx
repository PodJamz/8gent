'use client';

/**
 * Calendar Error Page
 *
 * Catches errors specific to the Calendar route (e.g., Clerk not configured).
 */

import { PrototypeState } from '@/components/os/PrototypeState';
import { Calendar, UserX } from 'lucide-react';

export default function CalendarError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  // Check if this is a Clerk-related error
  const isClerkError = error.message?.toLowerCase().includes('clerk') ||
    error.message?.toLowerCase().includes('useuser') ||
    error.message?.toLowerCase().includes('auth');

  if (isClerkError) {
    return (
      <PrototypeState
        title="Authentication Required"
        description="The Calendar app requires authentication to be configured. This feature is available when Clerk authentication is set up."
        type="prototype"
        backHref="/"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="rounded-lg p-4 text-left text-sm" style={{ backgroundColor: 'hsl(var(--muted))' }}>
          <p className="font-medium mb-1" style={{ color: 'hsl(var(--foreground))' }}>For developers:</p>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>
            Set <code className="px-1 py-0.5 rounded bg-black/20">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> in your environment to enable this feature.
          </p>
        </div>
      </PrototypeState>
    );
  }

  return (
    <PrototypeState
      title="Calendar Unavailable"
      description={error.message || "The Calendar app encountered an error. This feature may not be fully implemented yet."}
      type="prototype"
      backHref="/"
    >
      <div className="flex items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-white" />
        </div>
      </div>
    </PrototypeState>
  );
}
