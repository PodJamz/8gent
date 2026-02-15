'use client';

/**
 * Mock Clerk hooks to replace @clerk/nextjs
 * This allows the OS to run in a single-user "Owner-Mode"
 * without external auth dependencies.
 */

export const useUser = () => {
    return {
        isLoaded: true,
        isSignedIn: true,
        user: {
            id: 'owner_123',
            firstName: 'Owner',
            lastName: 'OpenClaw',
            fullName: 'OpenClaw Owner',
            primaryEmailAddress: {
                emailAddress: 'hello@openclaw.io',
            },
            imageUrl: '/openclaw-logo.png',
        },
    };
};

export const useAuth = () => {
    return {
        isLoaded: true,
        userId: 'owner_123',
        sessionId: 'session_123',
        getToken: async () => 'mock_token',
        signOut: async () => console.log('Sign out clicked in owner mode'),
    };
};

export const useSignIn = () => {
    return {
        isLoaded: true,
        signIn: {
            create: async () => ({ status: 'complete', createdSessionId: 'session_123' }),
        },
        setActive: async () => { },
    };
};

export const useSignUp = () => {
    return {
        isLoaded: true,
        signUp: {
            create: async () => ({ status: 'complete', createdSessionId: 'session_123' }),
            prepareEmailAddressVerification: async () => { },
            attemptEmailAddressVerification: async () => ({ status: 'complete', createdSessionId: 'session_123' }),
        },
        setActive: async () => { },
    };
};

export const useClerk = () => {
    return {
        signOut: async () => console.log('Sign out clicked in owner mode'),
        openUserProfile: () => console.log('User profile opened'),
    };
};

export const SignInButton = ({ children }: { children: React.ReactNode }) => children;
export const SignUpButton = ({ children }: { children: React.ReactNode }) => children;
export const UserButton = () => null;
export const SignedIn = ({ children }: { children: React.ReactNode }) => children;
export const SignedOut = ({ children }: { children: React.ReactNode }) => null;
export const ClerkProvider = ({ children }: { children: React.ReactNode }) => children;
