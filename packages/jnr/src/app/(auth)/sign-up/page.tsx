'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Sign Up page for 8gent
 *
 * Simple registration form that will integrate with Clerk later.
 * Collects basic info and redirects to onboarding.
 */
export default function SignUpPage() {
  const [step, setStep] = useState<'account' | 'profile'>('account');
  const [email, setEmail] = useState('');
  const [childName, setChildName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('profile');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Integrate with Clerk authentication
    // For now, simulate registration and redirect to app
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

      {/* Sign Up Card */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        {step === 'account' ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create your 8gent
            </h2>
            <p className="text-gray-600 mb-6">
              Start with your account details
            </p>

            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your email (parent/guardian)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
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
                  minLength={8}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                           transition-all outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl
                         hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                Continue
              </button>
            </form>
          </>
        ) : (
          <>
            <button
              onClick={() => setStep('account')}
              className="text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              &larr; Back
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Who is this for?
            </h2>
            <p className="text-gray-600 mb-6">
              Tell us about the child who will use 8gent
            </p>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="childName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Child&apos;s first name
                </label>
                <input
                  id="childName"
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Emma"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                           transition-all outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Age
                </label>
                <select
                  id="age"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                           transition-all outline-none bg-white"
                >
                  <option value="">Select age</option>
                  {Array.from({ length: 16 }, (_, i) => i + 2).map((age) => (
                    <option key={age} value={age}>
                      {age} years old
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl
                         hover:bg-blue-700 active:scale-[0.98] transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating 8gent...' : 'Create 8gent'}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-blue-600 hover:underline font-medium">
            Sign in
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
