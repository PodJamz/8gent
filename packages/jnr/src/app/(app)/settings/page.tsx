'use client';

import Link from 'next/link';

/**
 * Settings Page
 *
 * User preferences, mode toggle (kid/adult), and account settings.
 */
export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/app" className="text-gray-400 hover:text-gray-600">
            &larr;
          </Link>
          <span className="font-bold text-gray-900">Settings</span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
        {/* Mode Toggle */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Display Mode
          </h2>
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Interface Mode</p>
                <p className="text-sm text-gray-500">
                  Choose between kid-friendly or adult interface
                </p>
              </div>
              <select className="px-4 py-2 rounded-xl border border-gray-200 bg-white">
                <option value="kid">Kid Mode</option>
                <option value="adult">Adult Mode</option>
              </select>
            </div>
          </div>
        </section>

        {/* Voice Settings */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Voice
          </h2>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Speech Rate</p>
                <p className="text-sm text-gray-500">How fast the voice speaks</p>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                defaultValue="1"
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Voice Volume</p>
                <p className="text-sm text-gray-500">Adjust the voice volume</p>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="1"
                className="w-32"
              />
            </div>
          </div>
        </section>

        {/* Account */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Account
          </h2>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Sign Out</p>
                <p className="text-sm text-gray-500">Sign out of your account</p>
              </div>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
