/**
 * Tests for proactive-engine.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getEngagementMessage,
  getFeatureDiscoveryMessage,
  getCollaborationOffer,
  getDefaultEngagementState,
  loadEngagementState,
  saveEngagementState,
  determineProactiveAction,
  ENGAGEMENT_STATE_KEY,
  EngagementState,
  EngagementTrigger,
} from '../proactive-engine';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('proactive-engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('getEngagementMessage', () => {
    it('should return message for first_visit trigger', () => {
      const message = getEngagementMessage('first_visit');
      expect(message).not.toBeNull();
      expect(message?.trigger).toBe('first_visit');
      expect(message?.title).toBe('Welcome to OpenClaw-OS');
      expect(message?.id).toBeDefined();
      expect(message?.expiresAt).toBeDefined();
    });

    it('should return message for return_visit trigger', () => {
      const message = getEngagementMessage('return_visit');
      expect(message).not.toBeNull();
      expect(message?.trigger).toBe('return_visit');
      expect(message?.title).toBe('Welcome back');
    });

    it('should return message for idle_user trigger', () => {
      const message = getEngagementMessage('idle_user');
      expect(message).not.toBeNull();
      expect(message?.trigger).toBe('idle_user');
    });

    it('should return message for feature_discovery trigger', () => {
      const message = getEngagementMessage('feature_discovery');
      expect(message).not.toBeNull();
      expect(message?.trigger).toBe('feature_discovery');
    });

    it('should return message for collaboration_offer trigger', () => {
      const message = getEngagementMessage('collaboration_offer');
      expect(message).not.toBeNull();
      expect(message?.trigger).toBe('collaboration_offer');
    });

    it('should return message for scheduled_checkin trigger', () => {
      const message = getEngagementMessage('scheduled_checkin');
      expect(message).not.toBeNull();
      expect(message?.trigger).toBe('scheduled_checkin');
    });

    it('should return null for unknown trigger', () => {
      const message = getEngagementMessage('unknown_trigger' as EngagementTrigger);
      expect(message).toBeNull();
    });

    it('should generate unique IDs', () => {
      const message1 = getEngagementMessage('first_visit');
      const message2 = getEngagementMessage('first_visit');
      expect(message1?.id).not.toBe(message2?.id);
    });

    it('should set expiration 24 hours in future', () => {
      const now = Date.now();
      const message = getEngagementMessage('first_visit');
      const expectedExpiry = now + (24 * 60 * 60 * 1000);
      // Allow 1 second tolerance
      expect(message?.expiresAt).toBeGreaterThan(expectedExpiry - 1000);
      expect(message?.expiresAt).toBeLessThan(expectedExpiry + 1000);
    });

    it('should include actions in message', () => {
      const message = getEngagementMessage('first_visit');
      expect(message?.actions).toBeDefined();
      expect(message?.actions?.length).toBeGreaterThan(0);
    });

    it('should include appId in message', () => {
      const message = getEngagementMessage('first_visit');
      expect(message?.appId).toBe('claw-ai');
    });

    it('should include priority in message', () => {
      const message = getEngagementMessage('first_visit');
      expect(message?.priority).toBe('high');
    });
  });

  describe('getFeatureDiscoveryMessage', () => {
    it('should return message for unvisited apps', () => {
      const visitedApps = new Set(['claw-ai']);
      const message = getFeatureDiscoveryMessage(visitedApps);
      expect(message).not.toBeNull();
      expect(message?.trigger).toBe('feature_discovery');
    });

    it('should not return message if all apps visited', () => {
      // Visit all apps that have feature_discovery messages
      const visitedApps = new Set(['design', 'jamz', 'projects']);
      const message = getFeatureDiscoveryMessage(visitedApps);
      expect(message).toBeNull();
    });

    it('should only suggest unvisited apps', () => {
      const visitedApps = new Set(['design']);
      const message = getFeatureDiscoveryMessage(visitedApps);
      expect(message).not.toBeNull();
      // Should not suggest 'design' since it's visited
      expect(message?.appId).not.toBe('design');
    });

    it('should set expiration 12 hours in future', () => {
      const now = Date.now();
      const visitedApps = new Set<string>();
      const message = getFeatureDiscoveryMessage(visitedApps);
      if (message) {
        const expectedExpiry = now + (12 * 60 * 60 * 1000);
        expect(message.expiresAt).toBeGreaterThan(expectedExpiry - 1000);
        expect(message.expiresAt).toBeLessThan(expectedExpiry + 1000);
      }
    });

    it('should return null for empty visited set if no feature messages', () => {
      // Mock scenario where there are no feature discovery messages
      // Since ENGAGEMENT_MESSAGES is hardcoded, this test verifies behavior
      const visitedApps = new Set(['design', 'jamz', 'projects']);
      const message = getFeatureDiscoveryMessage(visitedApps);
      expect(message).toBeNull();
    });
  });

  describe('getCollaborationOffer', () => {
    it('should return collaboration offer message', () => {
      const message = getCollaborationOffer();
      expect(message).not.toBeNull();
      expect(message?.trigger).toBe('collaboration_offer');
    });

    it('should have high priority', () => {
      const message = getCollaborationOffer();
      expect(message?.priority).toBe('high');
    });

    it('should set expiration 6 hours in future', () => {
      const now = Date.now();
      const message = getCollaborationOffer();
      if (message) {
        const expectedExpiry = now + (6 * 60 * 60 * 1000);
        expect(message.expiresAt).toBeGreaterThan(expectedExpiry - 1000);
        expect(message.expiresAt).toBeLessThan(expectedExpiry + 1000);
      }
    });

    it('should include actions', () => {
      const message = getCollaborationOffer();
      expect(message?.actions).toBeDefined();
      expect(message?.actions?.length).toBeGreaterThan(0);
    });
  });

  describe('getDefaultEngagementState', () => {
    it('should return default state with correct properties', () => {
      const state = getDefaultEngagementState();
      expect(state.firstVisit).toBe(true);
      expect(state.visitCount).toBe(0);
      expect(state.lastVisit).toBe(0);
      expect(state.visitedApps).toEqual([]);
      expect(state.dismissedMessages).toEqual([]);
      expect(state.lastEngagementTime).toBe(0);
      expect(state.hasInteractedWithJames).toBe(false);
    });
  });

  describe('loadEngagementState', () => {
    it('should return default state when localStorage is empty', () => {
      const state = loadEngagementState();
      expect(state).toEqual(getDefaultEngagementState());
    });

    it('should load saved state from localStorage', () => {
      const savedState: EngagementState = {
        firstVisit: false,
        visitCount: 5,
        lastVisit: 1000,
        visitedApps: ['design', 'projects'],
        dismissedMessages: ['msg-1'],
        lastEngagementTime: 2000,
        hasInteractedWithJames: true,
      };
      localStorageMock.setItem(ENGAGEMENT_STATE_KEY, JSON.stringify(savedState));

      const state = loadEngagementState();
      expect(state.firstVisit).toBe(false);
      expect(state.visitCount).toBe(5);
      expect(state.visitedApps).toEqual(['design', 'projects']);
      expect(state.hasInteractedWithJames).toBe(true);
    });

    it('should merge with default state for partial saved data', () => {
      const partialState = { visitCount: 10 };
      localStorageMock.setItem(ENGAGEMENT_STATE_KEY, JSON.stringify(partialState));

      const state = loadEngagementState();
      expect(state.visitCount).toBe(10);
      expect(state.firstVisit).toBe(true); // Default value
    });

    it('should handle invalid JSON gracefully', () => {
      localStorageMock.setItem(ENGAGEMENT_STATE_KEY, 'invalid json');

      const state = loadEngagementState();
      expect(state).toEqual(getDefaultEngagementState());
    });
  });

  describe('saveEngagementState', () => {
    it('should save state to localStorage', () => {
      const state: EngagementState = {
        firstVisit: false,
        visitCount: 3,
        lastVisit: 5000,
        visitedApps: ['design'],
        dismissedMessages: [],
        lastEngagementTime: 6000,
        hasInteractedWithJames: true,
      };

      saveEngagementState(state);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        ENGAGEMENT_STATE_KEY,
        JSON.stringify(state)
      );
    });
  });

  describe('determineProactiveAction', () => {
    it('should return first_visit message for new users', () => {
      const state: EngagementState = {
        firstVisit: true,
        visitCount: 1,
        lastVisit: Date.now(),
        visitedApps: [],
        dismissedMessages: [],
        lastEngagementTime: Date.now(),
        hasInteractedWithJames: false,
      };

      const message = determineProactiveAction(state);
      expect(message).not.toBeNull();
      expect(message?.trigger).toBe('first_visit');
    });

    it('should return return_visit message after 24+ hours away', () => {
      const now = Date.now();
      const state: EngagementState = {
        firstVisit: false,
        visitCount: 5,
        lastVisit: now - (25 * 60 * 60 * 1000), // 25 hours ago
        visitedApps: ['design'],
        dismissedMessages: [],
        lastEngagementTime: now - (25 * 60 * 60 * 1000),
        hasInteractedWithJames: false,
      };

      const message = determineProactiveAction(state);
      expect(message).not.toBeNull();
      expect(message?.trigger).toBe('return_visit');
    });

    it('should return idle_user message after 30+ min without engagement', () => {
      const now = Date.now();
      const state: EngagementState = {
        firstVisit: false,
        visitCount: 5,
        lastVisit: now - (1 * 60 * 60 * 1000), // 1 hour ago
        visitedApps: ['design', 'projects', 'blog'],
        dismissedMessages: [],
        lastEngagementTime: now - (35 * 60 * 1000), // 35 min ago
        hasInteractedWithJames: false,
      };

      const message = determineProactiveAction(state);
      expect(message).not.toBeNull();
      expect(message?.trigger).toBe('idle_user');
    });

    it('should return feature_discovery for users who have explored few apps', () => {
      const now = Date.now();
      const state: EngagementState = {
        firstVisit: false,
        visitCount: 5,
        lastVisit: now - (1 * 60 * 60 * 1000),
        visitedApps: ['claw-ai'], // Only visited 1 app
        dismissedMessages: [],
        lastEngagementTime: now - (20 * 60 * 1000), // 20 min ago
        hasInteractedWithJames: true,
      };

      const message = determineProactiveAction(state);
      expect(message).not.toBeNull();
      expect(message?.trigger).toBe('feature_discovery');
    });

    it('should return idle_user before collaboration_offer for non-interactive users', () => {
      // Note: idle_user check (0.5h) comes before collaboration_offer (1h) in the logic
      // So users who haven't interacted will get idle_user first
      const now = Date.now();
      const state: EngagementState = {
        firstVisit: false,
        visitCount: 10,
        lastVisit: now - (2 * 60 * 60 * 1000),
        visitedApps: ['design', 'projects', 'blog', 'music'], // 4 apps
        dismissedMessages: [],
        lastEngagementTime: now - (2 * 60 * 60 * 1000), // 2 hours ago
        hasInteractedWithJames: false,
      };

      const message = determineProactiveAction(state);
      expect(message).not.toBeNull();
      // idle_user triggers first since hoursSinceLastEngagement > 0.5
      expect(message?.trigger).toBe('idle_user');
    });

    it('should return scheduled_checkin for engaged users after 24 hours', () => {
      const now = Date.now();
      const state: EngagementState = {
        firstVisit: false,
        visitCount: 20,
        lastVisit: now - (1 * 60 * 60 * 1000),
        visitedApps: ['design', 'projects', 'blog', 'music'],
        dismissedMessages: [],
        lastEngagementTime: now - (25 * 60 * 60 * 1000), // 25 hours ago
        hasInteractedWithJames: true,
      };

      const message = determineProactiveAction(state);
      expect(message).not.toBeNull();
      expect(message?.trigger).toBe('scheduled_checkin');
    });

    it('should return null when no action is appropriate', () => {
      const now = Date.now();
      const state: EngagementState = {
        firstVisit: false,
        visitCount: 10,
        lastVisit: now - (1 * 60 * 60 * 1000),
        visitedApps: ['design', 'projects', 'blog', 'jamz'],
        dismissedMessages: [],
        lastEngagementTime: now - (5 * 60 * 1000), // 5 min ago - recent
        hasInteractedWithJames: true,
      };

      const message = determineProactiveAction(state);
      expect(message).toBeNull();
    });
  });
});
