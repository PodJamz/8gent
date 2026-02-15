'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDesignThemeSafe } from '@/context/DesignThemeContext';
import { useOnboardingState } from './hooks/useOnboardingState';
import {
  ArrivalScreen,
  ThesisScreen,
  WhyScreen,
  AestheticScreen,
  CapabilitiesScreen,
  IntentScreen,
  VoiceScreen,
  HonestyScreen,
  EntryScreen,
  ReturnVisitorScreen,
  IntegrationsScreen,
} from './screens';
import dynamic from 'next/dynamic';

const Tunnel3D = dynamic(
  () => import('@/components/ui/tunnel-3d').then(mod => ({ default: mod.Tunnel3D })),
  { ssr: false }
);

// Map aesthetic choices to actual theme names
const aestheticToTheme: Record<string, string> = {
  clean: 'clean-slate',
  warm: 'vintage-paper',
  dark: 'cosmic-night',
  vivid: 'cyberpunk',
};

export function OnboardingFlow() {
  const router = useRouter();
  const { setTheme } = useDesignThemeSafe();
  const {
    currentScreen,
    data,
    isReturningVisitor,
    advance,
    skip,
    setAesthetic,
    setIntent,
    setVoiceGreeting,
    complete,
    reset,
  } = useOnboardingState();

  const [showReturnPrompt, setShowReturnPrompt] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
    if (isReturningVisitor && data.onboardingCompleted) {
      setShowReturnPrompt(true);
    }
  }, [isReturningVisitor, data.onboardingCompleted]);

  // Apply theme when aesthetic is selected
  const handleAestheticSelect = useCallback(
    (choice: 'clean' | 'warm' | 'dark' | 'vivid') => {
      setAesthetic(choice);
      const themeName = aestheticToTheme[choice];
      if (themeName) {
        setTheme(themeName as Parameters<typeof setTheme>[0]);
      }
    },
    [setAesthetic, setTheme]
  );

  // Handle returning visitor choices
  const handleContinue = useCallback(() => {
    setShowReturnPrompt(false);
    complete();
    // Set both flags for compatibility
    localStorage.setItem('openclaw_onboarding_complete', 'true');
    sessionStorage.setItem('openclaw_onboarding_just_completed', 'true');
    router.push('/');
  }, [complete, router]);

  const handleRestart = useCallback(() => {
    reset();
    setShowReturnPrompt(false);
  }, [reset]);

  // Handle onboarding completion
  const handleComplete = useCallback(() => {
    complete();
    // Set both flags for compatibility
    localStorage.setItem('openclaw_onboarding_complete', 'true');
    sessionStorage.setItem('openclaw_onboarding_just_completed', 'true');
    router.push('/');
  }, [complete, router]);


  // Don't render until hydrated
  if (!isHydrated) {
    return (
      <div className="fixed inset-0 bg-slate-950" />
    );
  }

  // Show return visitor prompt
  if (showReturnPrompt) {
    return (
      <ReturnVisitorScreen
        data={data}
        onContinue={handleContinue}
        onRestart={handleRestart}
      />
    );
  }

  // Render current screen
  return (
    <div className="fixed inset-0 bg-slate-950 overflow-hidden">
      {/* Immersive Background */}
      <Tunnel3D speed={0.2} lineColor="#334155" />

      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          {currentScreen === 'arrival' && (
            <ArrivalScreen key="arrival" onAdvance={advance} />
          )}

          {currentScreen === 'thesis' && (
            <ThesisScreen
              key="thesis"
              onAdvance={advance}
              showSkip
              onSkipAvailable={skip}
            />
          )}

          {currentScreen === 'why' && (
            <WhyScreen
              key="why"
              onAdvance={advance}
              showSkip
              onSkipAvailable={skip}
            />
          )}

          {currentScreen === 'aesthetic' && (
            <AestheticScreen
              key="aesthetic"
              onSelect={handleAestheticSelect}
              onAdvance={advance}
              showSkip
              onSkipAvailable={skip}
            />
          )}

          {currentScreen === 'capabilities' && (
            <CapabilitiesScreen
              key="capabilities"
              onAdvance={advance}
              aesthetic={data.aesthetic}
            />
          )}

          {currentScreen === 'intent' && (
            <IntentScreen
              key="intent"
              onSelect={setIntent}
              onAdvance={advance}
              aesthetic={data.aesthetic}
            />
          )}

          {currentScreen === 'integrations' && (
            <IntegrationsScreen
              key="integrations"
              onAdvance={advance}
            />
          )}

          {currentScreen === 'voice' && (
            <VoiceScreen
              key="voice"
              onSave={setVoiceGreeting}
              onAdvance={advance}
              aesthetic={data.aesthetic}
              intent={data.intent}
            />
          )}

          {currentScreen === 'honesty' && (
            <HonestyScreen
              key="honesty"
              onAdvance={advance}
              aesthetic={data.aesthetic}
            />
          )}

          {currentScreen === 'entry' && (
            <EntryScreen
              key="entry"
              onComplete={handleComplete}
              aesthetic={data.aesthetic}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
