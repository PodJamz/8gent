'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useSessionBrain } from '@/context/SessionBrainContext';
import { usePathname } from 'next/navigation';
import {
  loadEngagementState,
  saveEngagementState,
  determineProactiveAction,
  getDefaultEngagementState,
  type EngagementState,
} from '@/lib/8gent/proactive-engine';

interface ClawAIProactiveProviderProps {
  children: React.ReactNode;
}

// Apps that map to paths
const PATH_TO_APP: Record<string, string> = {
  '/': 'home',
  '/story': 'story',
  '/blog': 'blog',
  '/design': 'design',
  '/resume': 'resume',
  '/music': 'music',
  '/studio': 'jamz',
  '/prototyping': 'prototyping',
  '/notes': 'notes',
  '/product': 'product',
  '/projects': 'projects',
  '/humans': 'humans',
  '/activity': 'activity',
  '/calendar': 'calendar',
  '/contacts': 'contacts',
  '/photos': 'photos',
  '/inspirations': 'inspirations',
  '/weather': 'weather',
  '/games': 'games',
  '/terminal': 'terminal',
  '/vault': 'vault',
  '/settings': 'settings',
};

// Check interval for proactive messages (in ms)
const PROACTIVE_CHECK_INTERVAL = 60000; // 60 seconds

// Minimum time between notifications (in ms)
const MIN_NOTIFICATION_INTERVAL = 120000; // 2 minutes

/**
 * ClawAIProactiveProvider
 *
 * This provider initializes and runs the 8gent proactive engagement system.
 * It tracks user behavior and triggers notifications to hook users into
 * collaborating with James.
 *
 * Based on EXPERIENCE_PHILOSOPHY.md:
 * - "8gent is an operator, not a chatbot"
 * - James proactively engages to demonstrate the OS philosophy
 */
export function ClawAIProactiveProvider({ children }: ClawAIProactiveProviderProps) {
  const pathname = usePathname();
  const { addNotification, markAppNotificationsRead } = useSessionBrain();

  const engagementStateRef = useRef<EngagementState>(getDefaultEngagementState());
  const lastNotificationTimeRef = useRef<number>(0);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize engagement state on mount
  useEffect(() => {
    const state = loadEngagementState();
    const now = Date.now();

    // Update state for this visit
    const updatedState: EngagementState = {
      ...state,
      firstVisit: state.visitCount === 0,
      visitCount: state.visitCount + 1,
      lastVisit: now,
    };

    engagementStateRef.current = updatedState;
    saveEngagementState(updatedState);
    isInitializedRef.current = true;
  }, []);

  // Track app visits based on pathname
  useEffect(() => {
    if (!isInitializedRef.current) return;

    const appId = PATH_TO_APP[pathname];
    if (appId && !engagementStateRef.current.visitedApps.includes(appId)) {
      const updatedState: EngagementState = {
        ...engagementStateRef.current,
        visitedApps: [...engagementStateRef.current.visitedApps, appId],
      };
      engagementStateRef.current = updatedState;
      saveEngagementState(updatedState);
    }

    // Mark notifications as read when visiting an app
    if (appId) {
      markAppNotificationsRead(appId);
    }
  }, [pathname, markAppNotificationsRead]);

  // Check for proactive messages periodically
  useEffect(() => {
    if (!isInitializedRef.current) return;

    const checkForProactiveMessage = () => {
      const now = Date.now();
      const state = engagementStateRef.current;

      // Don't spam notifications
      if (now - lastNotificationTimeRef.current < MIN_NOTIFICATION_INTERVAL) {
        return;
      }

      // Skip if user has already interacted with Claw recently
      if (state.hasInteractedWithClaw && now - state.lastEngagementTime < 3600000) { // 1 hour
        return;
      }

      // Determine if we should send a proactive message
      const message = determineProactiveAction(state);

      if (message && !state.dismissedMessages.includes(message.trigger)) {
        lastNotificationTimeRef.current = now;

        // Add notification to the system
        addNotification(
          message.appId,
          'suggestion',
          message.title,
          message.body
        );

        // Update engagement time
        const updatedState: EngagementState = {
          ...state,
          lastEngagementTime: now,
          // Track that we've shown this trigger type
          dismissedMessages: [...state.dismissedMessages, message.trigger],
        };
        engagementStateRef.current = updatedState;
        saveEngagementState(updatedState);
      }
    };

    // Initial check after a short delay (let user settle in)
    const initialTimeout = setTimeout(() => {
      checkForProactiveMessage();

      // Set up interval for periodic checks
      checkIntervalRef.current = setInterval(
        checkForProactiveMessage,
        PROACTIVE_CHECK_INTERVAL
      );
    }, 8000); // 8 second initial delay

    return () => {
      clearTimeout(initialTimeout);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [addNotification]);

  return <>{children}</>;
}

/**
 * Hook to mark that user has interacted with Claw
 * Should be called when user opens chat or interacts with Claw
 */
export function useMarkClawInteraction() {
  const markInteraction = useCallback(() => {
    const state = loadEngagementState();
    const now = Date.now();

    const updatedState: EngagementState = {
      ...state,
      hasInteractedWithClaw: true,
      lastEngagementTime: now,
    };

    saveEngagementState(updatedState);
  }, []);

  return markInteraction;
}
