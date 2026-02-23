'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useSessionBrain } from '@/context/SessionBrainContext';
import { usePathname } from 'next/navigation';
import {
  loadEngagementState,
  saveEngagementState,
  determineProactiveAction,
  getDefaultEngagementState,
  type EngagementState,
  type ProactiveMessage,
} from '@/lib/8gent/proactive-engine';

interface UseClawAIProactiveReturn {
  engagementState: EngagementState;
  currentMessage: ProactiveMessage | null;
  dismissMessage: (messageId: string) => void;
  markAppVisited: (appId: string) => void;
  markClawInteraction: () => void;
  clawNotificationCount: number;
  totalNotificationCount: number;
  getAppNotificationCount: (appId: string) => number;
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
const PROACTIVE_CHECK_INTERVAL = 30000; // 30 seconds

// Minimum time between notifications (in ms)
const MIN_NOTIFICATION_INTERVAL = 60000; // 1 minute

export function useClawAIProactive(): UseClawAIProactiveReturn {
  const pathname = usePathname();
  const {
    addNotification,
    getUnreadCountForApp,
    getTotalUnreadCount,
    markAppNotificationsRead,
  } = useSessionBrain();

  const [engagementState, setEngagementState] = useState<EngagementState>(getDefaultEngagementState);
  const [currentMessage, setCurrentMessage] = useState<ProactiveMessage | null>(null);
  const lastNotificationTimeRef = useRef<number>(0);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Load engagement state on mount
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

    setEngagementState(updatedState);
    saveEngagementState(updatedState);
    isInitializedRef.current = true;
  }, []);

  // Track app visits based on pathname
  useEffect(() => {
    if (!isInitializedRef.current) return;

    const appId = PATH_TO_APP[pathname];
    if (appId && !engagementState.visitedApps.includes(appId)) {
      const updatedState: EngagementState = {
        ...engagementState,
        visitedApps: [...engagementState.visitedApps, appId],
      };
      setEngagementState(updatedState);
      saveEngagementState(updatedState);
    }

    // Mark notifications as read when visiting an app
    if (appId) {
      markAppNotificationsRead(appId);
    }
  }, [pathname, engagementState, markAppNotificationsRead]);

  // Check for proactive messages periodically
  useEffect(() => {
    if (!isInitializedRef.current) return;

    const checkForProactiveMessage = () => {
      const now = Date.now();

      // Don't spam notifications
      if (now - lastNotificationTimeRef.current < MIN_NOTIFICATION_INTERVAL) {
        return;
      }

      // Determine if we should send a proactive message
      const message = determineProactiveAction(engagementState);

      if (message && !engagementState.dismissedMessages.includes(message.id)) {
        setCurrentMessage(message);
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
          ...engagementState,
          lastEngagementTime: now,
        };
        setEngagementState(updatedState);
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
    }, 5000); // 5 second initial delay

    return () => {
      clearTimeout(initialTimeout);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [engagementState, addNotification]);

  // Dismiss a message
  const dismissMessage = useCallback((messageId: string) => {
    setCurrentMessage((prev) => (prev?.id === messageId ? null : prev));

    setEngagementState((prev) => {
      const updated = {
        ...prev,
        dismissedMessages: [...prev.dismissedMessages, messageId],
      };
      saveEngagementState(updated);
      return updated;
    });
  }, []);

  // Mark an app as visited
  const markAppVisited = useCallback((appId: string) => {
    setEngagementState((prev) => {
      if (prev.visitedApps.includes(appId)) return prev;

      const updated = {
        ...prev,
        visitedApps: [...prev.visitedApps, appId],
      };
      saveEngagementState(updated);
      return updated;
    });
  }, []);

  // Mark that user has interacted with Claw
  const markClawInteraction = useCallback(() => {
    const now = Date.now();
    setEngagementState((prev) => {
      const updated = {
        ...prev,
        hasInteractedWithClaw: true,
        lastEngagementTime: now,
      };
      saveEngagementState(updated);
      return updated;
    });
  }, []);

  // Get notification counts
  const clawNotificationCount = getUnreadCountForApp('claw-ai');
  const totalNotificationCount = getTotalUnreadCount();
  const getAppNotificationCount = useCallback(
    (appId: string) => getUnreadCountForApp(appId),
    [getUnreadCountForApp]
  );

  return {
    engagementState,
    currentMessage,
    dismissMessage,
    markAppVisited,
    markClawInteraction,
    clawNotificationCount,
    totalNotificationCount,
    getAppNotificationCount,
  };
}
