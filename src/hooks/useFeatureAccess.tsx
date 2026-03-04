/**
 * useFeatureAccess - Hook for checking feature/area access
 *
 * Checks if the current user has access to a specific feature or area.
 * Returns access status and a function to show the graceful denial overlay.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@/lib/openclaw/hooks';
import { useUser } from '@clerk/nextjs';
import { useAdminSession } from './useAdminSession';

// Type assertion for userManagement module
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let userManagementApi: any;
try {
  // Dynamic import to handle cases where Convex isn't configured
  userManagementApi = require('../../convex/_generated/api').api?.userManagement;
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
  const managedUser = useQuery(
    userManagementApi?.getManagedUserByClerkId,
    clerkId ? { clerkId } : 'skip'
  );

  const isLoading: boolean = !isClerkLoaded || isAdminLoading || Boolean(clerkId && managedUser === undefined);

  // Determine access
  const accessResult = useMemo(() => {
    // Still loading
    if (isLoading) {
      return { hasAccess: false, reason: 'Loading...' };
    }

    // Admin always has access
    if (isAdmin) {
      return { hasAccess: true };
    }

    // Not logged in = visitor
    if (!user) {
      return {
        hasAccess: false,
        reason: 'This feature requires an account. Sign in or request access.',
      };
    }

    // User is logged in but not in managed users
    if (!managedUser) {
      return {
        hasAccess: false,
        reason: 'This feature is available to invited collaborators.',
      };
    }

    // User is deactivated
    if (!managedUser.isActive) {
      return {
        hasAccess: false,
        reason: 'Your account has been deactivated. Contact the owner for assistance.',
      };
    }

    // Owner has access to everything
    if (managedUser.role === 'owner') {
      return { hasAccess: true };
    }

    // Admin role has access to everything
    if (managedUser.role === 'admin') {
      return { hasAccess: true };
    }

    // Check specific permission
    const permissionKey = FEATURE_TO_PERMISSION[feature];

    if (AREA_FEATURES.includes(feature)) {
      // Area-based access
      const hasAreaAccess = managedUser.permissions?.areas?.includes(feature);
      if (!hasAreaAccess) {
        return {
          hasAccess: false,
          reason: `This area is reserved for users with ${feature} access.`,
        };
      }
      return { hasAccess: true };
    }

    // Feature toggle access
    const hasFeatureAccess = managedUser.permissions?.[permissionKey as keyof typeof managedUser.permissions];
    if (!hasFeatureAccess) {
      return {
        hasAccess: false,
        reason: `This feature requires ${feature} permission.`,
      };
    }

    return { hasAccess: true };
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

/**
 * Higher-order component wrapper for protected features
 */
export function withFeatureAccess<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  feature: FeatureType
) {
  return function ProtectedComponent(props: P) {
    const { hasAccess, isLoading } = useFeatureAccess(feature);

    if (isLoading) {
      return null; // Or a loading spinner
    }

    if (!hasAccess) {
      return null; // The AccessGate will be shown separately
    }

    return <WrappedComponent {...props} />;
  };
}

export default useFeatureAccess;
