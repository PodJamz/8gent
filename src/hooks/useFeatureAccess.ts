/**
 * useFeatureAccess - Hook for checking feature/area access
 *
 * Checks if the current user has access to a specific feature or area.
 * Returns access status and a function to show the graceful denial overlay.
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@/lib/openclaw/hooks';
import { useUser } from '@/lib/openclaw/auth';
import { useAdminSession } from './useAdminSession';

// Type assertion for userManagement module
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let userManagementApi: any;
try {
  // Dynamic import to handle cases where Convex isn't configured
  userManagementApi = require('@/lib/convex-shim').api?.userManagement;
} catch {
  userManagementApi = null;
}

export type FeatureType =
  | 'humans'
  | 'studio'
  | 'vault'
  | 'calendar'
  | 'prototyping'
  | 'privateMusic'
  | 'designCanvas'
  | 'security'
  | 'analytics';

interface FeatureAccessResult {
  hasAccess: boolean;
  isLoading: boolean;
  reason?: string;
  showAccessGate: () => void;
  hideAccessGate: () => void;
  isGateOpen: boolean;
}

// Map features to their required permission keys
const FEATURE_TO_PERMISSION: Record<FeatureType, string> = {
  humans: 'areas',
  studio: 'areas',
  vault: 'areas',
  calendar: 'areas',
  prototyping: 'areas',
  privateMusic: 'privateMusic',
  designCanvas: 'designCanvas',
  security: 'security',
  analytics: 'analytics',
};

// Area slugs for area-based features
const AREA_FEATURES = ['humans', 'studio', 'vault', 'calendar', 'prototyping'];

export function useFeatureAccess(feature: FeatureType): FeatureAccessResult {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const { isAuthenticated: isAdmin, isLoading: isAdminLoading } = useAdminSession();
  const [isGateOpen, setIsGateOpen] = useState(false);

  // Get managed user data if logged in
  const clerkId = user?.id;

  const managedUser = useQuery<any>(
    'agent.identity.get', // Using agent identity as proxy for user management for now
    clerkId ? { clerkId } : {}
  );

  // If agent.identity.get doesn't return the expected format, we might need a specific 'users.get' method
  // which we can implement in the gateway via a plugin or skill.
  // For migration purpose, we assume the backend returns a user object compatible with our needs.


  const isLoading: boolean = !isClerkLoaded || isAdminLoading || Boolean(clerkId && managedUser === undefined);

  // Determine access
  const accessResult = useMemo(() => {
    // Still loading
    if (isLoading) {
      return { hasAccess: false, reason: 'Loading...' };
    }

    // Single User Mode: If user is authenticated (which is handled by OpenClaw/Clerk shim),
    // they are the Owner and have access to everything.

    if (user) {
      return { hasAccess: true };
    }

    // Not logged in
    return {
      hasAccess: false,
      reason: 'This feature requires owner access.',
    };
  }, [isLoading, isAdmin, user, managedUser, feature]);

  const showAccessGate = useCallback(() => {
    setIsGateOpen(true);
  }, []);

  const hideAccessGate = useCallback(() => {
    setIsGateOpen(false);
  }, []);

  return {
    hasAccess: accessResult.hasAccess,
    isLoading,
    reason: accessResult.reason,
    showAccessGate,
    hideAccessGate,
    isGateOpen,
  };
}

export default useFeatureAccess;
