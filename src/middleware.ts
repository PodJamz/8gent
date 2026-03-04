import { clerkMiddleware } from "@/lib/openclaw/auth-server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Check if Clerk is fully configured
const isClerkConfigured = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.CLERK_SECRET_KEY
);

// Passthrough middleware when Clerk is not configured
function passthroughMiddleware() {
  return NextResponse.next();
}

// Use Clerk middleware only if fully configured
export default isClerkConfigured ? clerkMiddleware() : passthroughMiddleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
