'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IOSHome } from "@/components/ios";

const ONBOARDING_COMPLETE_KEY = 'openclaw_onboarding_complete';

export default function Page() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    console.log('[OpenClaw] Checking onboarding status...');
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true';
    console.log('[OpenClaw] Onboarding complete:', hasCompletedOnboarding);

    if (!hasCompletedOnboarding) {
      console.log('[OpenClaw] Redirecting to /onboarding...');
      // Use router.replace for cleaner history and force it to happen
      router.replace('/onboarding');

      // Fallback to window.location if router fails after a timeout
      const fallbackTimer = setTimeout(() => {
        if (window.location.pathname === '/') {
          console.log('[OpenClaw] Router navigation timed out, using window.location...');
          window.location.href = '/onboarding';
        }
      }, 2000);
      return () => clearTimeout(fallbackTimer);
    } else {
      console.log('[OpenClaw] Onboarding complete, loading IOSHome...');
      setIsChecking(false);
    }
  }, [router]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-emerald-400 text-lg">Loading 8gent...</div>
      </div>
    );
  }

  return <IOSHome />;
}
