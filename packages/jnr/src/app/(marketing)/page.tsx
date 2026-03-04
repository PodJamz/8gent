'use client';

import Link from 'next/link';

/**
 * 8gent Landing Page
 *
 * Root domain (8gent.app) shows marketing/onboarding.
 * User subdomains (nick.8gent.app) route to /tenant/[subdomain].
 *
 * "Personal AI operating systems will replace SaaS."
 * We're starting with kids because they're the most vulnerable.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-2xl">
          {/* Logo */}
          <div className="text-6xl mb-8">
            <span role="img" aria-label="8gent">🗣️</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Your Voice, Your Way
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            A personal AI that learns how you communicate and grows with you.
            Built for children who see the world differently.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl
                       hover:bg-blue-700 active:scale-95 transition-all
                       shadow-lg shadow-blue-200"
            >
              Get Started
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl
                       hover:bg-gray-50 active:scale-95 transition-all
                       border border-gray-200 shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full">
          <FeatureCard
            emoji="🎨"
            title="Familiar Layout"
            description="We analyze your existing AAC to make this feel like home"
          />
          <FeatureCard
            emoji="🎤"
            title="Your Unique Voice"
            description="Create a custom voice that's truly yours"
          />
          <FeatureCard
            emoji="✨"
            title="AI That Learns"
            description="The system grows smarter as you use it"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-500 border-t border-gray-100 bg-white/50">
        <p>
          8gent &middot; Part of the{' '}
          <a href="https://8gent.app" className="text-blue-600 hover:underline">
            8gent
          </a>{' '}
          family
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
