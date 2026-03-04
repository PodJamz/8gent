'use client';

import { ReactNode } from 'react';
import { ConvexReactClient } from '@/lib/openclaw/hooks';
import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { dark } from '@clerk/themes';

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || 'https://placeholder.convex.cloud'
);

interface ConvexClerkProviderProps {
  children: ReactNode;
}

export function ConvexClerkProvider({ children }: ConvexClerkProviderProps) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#f97316',
          colorBackground: '#0a0a0a',
          colorInputBackground: '#171717',
          colorInputText: '#ffffff',
        },
        elements: {
          formButtonPrimary: 'bg-orange-500 hover:bg-orange-600',
          card: 'bg-neutral-900 border-neutral-800',
          headerTitle: 'text-white',
          headerSubtitle: 'text-neutral-400',
          socialButtonsBlockButton: 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700',
          socialButtonsBlockButtonText: 'text-white',
          formFieldLabel: 'text-neutral-300',
          formFieldInput: 'bg-neutral-800 border-neutral-700 text-white',
          footerActionLink: 'text-orange-400 hover:text-orange-300',
        },
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
