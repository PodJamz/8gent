'use client';

/**
 * Global Error Page
 *
 * Catches unhandled errors at the route level.
 * Rule: Nothing visible is allowed to fail without explanation.
 */

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home, Bug } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Claw AI OS Route Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-neutral-900 to-neutral-950">
      <div className="max-w-md w-full">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Something went wrong
          </h1>

          <p className="text-neutral-400 mb-6">
            Claw AI OS encountered an unexpected error. This might be a prototype feature that isn&apos;t fully implemented yet.
          </p>

          {error.message && (
            <div className="rounded-lg bg-neutral-800/50 p-4 mb-6 text-left">
              <div className="flex items-center gap-2 text-neutral-300 text-sm font-medium mb-2">
                <Bug className="w-4 h-4" />
                Error Details
              </div>
              <code className="text-xs text-red-400 break-all block">
                {error.message}
              </code>
              {error.digest && (
                <code className="text-xs text-neutral-500 block mt-1">
                  Digest: {error.digest}
                </code>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>

        <p className="text-center text-neutral-500 text-sm mt-4">
          Claw AI OS is a personal operating system prototype
        </p>
      </div>
    </div>
  );
}
