
import { NextResponse } from "next/server";

export const auth = () => {
    return {
        userId: "mock-user-id",
        sessionId: "mock-session-id",
        getToken: async () => "mock-token",
        redirectToSignIn: () => ({})
    };
};

export const currentUser = async () => {
    return {
        id: "mock-user-id",
        firstName: "OpenClaw",
        lastName: "AI",
        emailAddresses: [{ emailAddress: "james@example.com" }]
    };
};

export const clerkClient = {
    users: {
        getUser: async () => currentUser()
    }
};

export const clerkMiddleware = () => {
    return (req: any) => {
        return NextResponse.next();
    };
};
