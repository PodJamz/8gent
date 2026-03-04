'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Sign In page for 8gent
 *
 * Simple email/password form that will integrate with Clerk later.
 * For now, redirects to the app after "authentication".
 */
export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Integrate with Clerk authentication
    // For now, simulate auth and redirect
    setTimeout(() => {
      window.location.href = '/app';
    }, 1000);
  };

  return (
    <div className="w-full max-w-md">
      {/* Mobile Logo */}
      <div className="lg:hidden text-center mb-8">
        <div className="text-4xl mb-2">🗣️</div>
        <h1 className="text-2xl font-bold text-gray-900">8gent</h1>
      </div>

      {/* Sign In Card */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back
        </h2>
        <p className="text-gray-600 mb-6">
          Sign in to continue to your 8gent
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                       transition-all outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                       transition-all outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl
                     hover:bg-blue-700 active:scale-[0.98] transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>

      {/* Back to Home */}
      <div className="mt-6 text-center">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}
