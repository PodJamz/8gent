'use client';

/**
 * Security Command Center
 *
 * Admin-only fortress-level security monitoring dashboard.
 * Full visibility into all traffic, auth events, sessions, and threats.
 *
 * NOTE: Temporarily disabled until Convex security module is regenerated.
 * Run `npx convex dev` to regenerate the API types.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageTransition } from '@/components/ios';
import { useAdminSession } from '@/hooks/useAdminSession';
import {
  Shield,
  ChevronLeft,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

export default function SecurityPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, username } = useAdminSession();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/settings');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-950">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/settings"
                  className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Shield className="w-6 h-6 text-red-400" />
                    Security Command Center
                  </h1>
                  <p className="text-xs text-white/50">
                    Logged in as {username}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Temporary Disabled Message */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Security Dashboard Temporarily Unavailable
            </h2>
            <p className="text-white/60 max-w-md mb-8">
              The Security Command Center is temporarily disabled while Convex API types are being regenerated.
              Run <code className="px-2 py-1 bg-white/10 rounded text-sm">npx convex dev</code> to restore full functionality.
            </p>
            <Link
              href="/settings"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
            >
              Back to Settings
            </Link>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
