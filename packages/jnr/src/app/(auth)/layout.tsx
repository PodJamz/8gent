import type { ReactNode } from 'react';

/**
 * Auth layout for 8gent sign-in/sign-up pages
 *
 * Split layout with benefits panel on desktop,
 * simple centered layout on mobile.
 */
export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Benefits Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex-col justify-between">
        <div>
          <div className="text-3xl">🗣️</div>
          <h1 className="text-3xl font-bold text-white mt-8">
            8gent
          </h1>
          <p className="text-blue-100 mt-2">
            Your personal AI operating system
          </p>
        </div>

        <div className="space-y-8">
          <BenefitItem
            icon="🎨"
            title="Familiar Communication"
            description="Upload your existing AAC layout and we'll match it"
          />
          <BenefitItem
            icon="🎤"
            title="Your Own Voice"
            description="Create a unique voice that sounds like you"
          />
          <BenefitItem
            icon="✨"
            title="Grows With You"
            description="The system learns and adapts over time"
          />
          <BenefitItem
            icon="🔒"
            title="Safe & Private"
            description="Your data stays yours, always"
          />
        </div>

        <p className="text-blue-200 text-sm">
          Part of the 8gent family
        </p>
      </div>

      {/* Auth Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {children}
      </div>
    </div>
  );
}

function BenefitItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <h3 className="text-white font-semibold">{title}</h3>
        <p className="text-blue-100 text-sm">{description}</p>
      </div>
    </div>
  );
}
