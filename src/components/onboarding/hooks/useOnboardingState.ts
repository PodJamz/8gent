'use client';

import { useState, useCallback, useEffect } from 'react';

export type AestheticChoice = 'clean' | 'warm' | 'dark' | 'vivid';
export type IntentChoice = 'curiosity' | 'hiring' | 'collaboration' | 'inspiration';

export interface OnboardingData {
  aesthetic: AestheticChoice | null;
  intent: IntentChoice | null;
  voiceGreeting: Blob | null;
  onboardingCompleted: boolean;
  firstVisit: string | null;
  userName?: string;
  gatewayUrl?: string;
  gatewayToken?: string;
}

export type ScreenName =
  | 'arrival'
  | 'gateway'
  | 'thesis'
  | 'why'
  | 'aesthetic'
  | 'capabilities'
  | 'intent'
  | 'integrations'
  | 'whoami'
  | 'voice'
  | 'honesty'
  | 'entry';

const SCREEN_ORDER: ScreenName[] = [
  'arrival',
  'gateway',
  'thesis',
  'why',
  'aesthetic',
  'capabilities',
  'intent',
  'integrations',
  'whoami',
  'voice',
  'honesty',
  'entry',
];

const STORAGE_KEY = 'openclaw_onboarding';

interface UseOnboardingStateReturn {
  currentScreen: ScreenName;
  screenIndex: number;
  totalScreens: number;
  data: OnboardingData;
  isReturningVisitor: boolean;
  advance: () => void;
  skip: () => void;
  setAesthetic: (choice: AestheticChoice) => void;
  setIntent: (choice: IntentChoice) => void;
  setUserName: (name: string) => void;
  setGateway: (url: string, token: string) => void;
  setVoiceGreeting: (blob: Blob | null) => void;
  complete: () => void;
  reset: () => void;
}

const initialData: OnboardingData = {
  aesthetic: null,
  intent: null,
  voiceGreeting: null,
  onboardingCompleted: false,
  firstVisit: null,
};

export function useOnboardingState(): UseOnboardingStateReturn {
  const [screenIndex, setScreenIndex] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<OnboardingData & { screenIndex: number }>;
        if (parsed.onboardingCompleted) {
          setIsReturningVisitor(true);
        }
        if (typeof parsed.screenIndex === 'number') {
          setScreenIndex(parsed.screenIndex);
        }
        setData((prev) => ({
          ...prev,
          ...parsed,
          voiceGreeting: null, // Don't restore blob from localStorage
        }));
      } catch {
        // Invalid data, start fresh
      }
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage when data or screenIndex changes (after hydration)
  useEffect(() => {
    if (!isHydrated) return;

    const toStore = {
      aesthetic: data.aesthetic,
      intent: data.intent,
      onboardingCompleted: data.onboardingCompleted,
      firstVisit: data.firstVisit,
      userName: data.userName,
      gatewayUrl: data.gatewayUrl,
      gatewayToken: data.gatewayToken,
      screenIndex,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [data, screenIndex, isHydrated]);

  const advance = useCallback(() => {
    setScreenIndex((prev) => Math.min(prev + 1, SCREEN_ORDER.length - 1));
  }, []);

  const skip = useCallback(() => {
    // Skip to entry screen
    setScreenIndex(SCREEN_ORDER.indexOf('entry'));
  }, []);

  const setAesthetic = useCallback((choice: AestheticChoice) => {
    setData((prev) => ({ ...prev, aesthetic: choice }));
  }, []);

  const setIntent = useCallback((choice: IntentChoice) => {
    setData((prev) => ({ ...prev, intent: choice }));
  }, []);

  const setUserName = useCallback((name: string) => {
    setData((prev) => ({ ...prev, userName: name }));
  }, []);

  const setGateway = useCallback((url: string, token: string) => {
    setData((prev) => ({ ...prev, gatewayUrl: url, gatewayToken: token }));
  }, []);

  const setVoiceGreeting = useCallback((blob: Blob | null) => {
    setData((prev) => ({ ...prev, voiceGreeting: blob }));
  }, []);

  const complete = useCallback(() => {
    setData((prev) => ({
      ...prev,
      onboardingCompleted: true,
      firstVisit: prev.firstVisit || new Date().toISOString(),
    }));
  }, []);

  const reset = useCallback(() => {
    setScreenIndex(0);
    setData(initialData);
    setIsReturningVisitor(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    currentScreen: SCREEN_ORDER[screenIndex],
    screenIndex,
    totalScreens: SCREEN_ORDER.length,
    data,
    isReturningVisitor,
    advance,
    skip,
    setAesthetic,
    setIntent,
    setUserName,
    setGateway,
    setVoiceGreeting,
    complete,
    reset,
  };
}
