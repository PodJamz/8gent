'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
                variables: {
                    colorPrimary: '#10b981', // Emerald/Teal for OpenClaw
                    colorBackground: '#0a0a0a',
                    colorInputBackground: '#171717',
                    colorInputText: '#ffffff',
                },
                elements: {
                    formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700 transition-all',
                    card: 'bg-neutral-900 border-neutral-800 shadow-2xl',
                    headerTitle: 'text-white font-medium',
                    headerSubtitle: 'text-neutral-400',
                    footerActionLink: 'text-emerald-400 hover:text-emerald-300',
                    socialButtonsBlockButton: 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700',
                    socialButtonsBlockButtonText: 'text-white',
                },
            }}
        >
            {children}
        </ClerkProvider>
    );
}
