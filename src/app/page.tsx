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
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true';

    if (!hasCompletedOnboarding) {
      // Redirect to onboarding
      router.push('/onboarding');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-emerald-400 text-lg">Loading OpenClaw-OS...</div>
      </div>
    );
  }

  return <IOSHome />;
}
