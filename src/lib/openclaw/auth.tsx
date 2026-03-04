
import React from 'react';

export const useUser = () => {
    return {
        user: {
            id: "mock-user-id",
            firstName: "OpenClaw",
            fullName: "8gent",
            imageUrl: "https://github.com/shadcn.png",
            emailAddresses: [{ emailAddress: "james@example.com" }]
        },
        isLoaded: true,
        isSignedIn: true
    };
};

export const useAuth = () => {
    return {
        isLoaded: true,
        isSignedIn: true,
        userId: "mock-user-id",
        sessionId: "mock-session-id",
        getToken: async () => "mock-token"
    };
};

export const useClerk = () => {
    return {
        openSignIn: () => console.log("Open SignIn"),
        signOut: () => console.log("Sign out")
    };
};

export const SignInButton = ({ children }: any) => <button onClick={() => console.log("Sign In Clicked")}>{children || "Sign In"}</button>;
export const SignUpButton = ({ children }: any) => <button>{children || "Sign Up"}</button>;
export const UserButton = () => <div>[User Profile]</div>;
export const SignedIn = ({ children }: any) => <>{children}</>;
export const SignedOut = ({ children }: any) => null;
export const ClerkProvider = ({ children }: any) => <>{children}</>;
