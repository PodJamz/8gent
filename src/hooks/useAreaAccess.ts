"use client";

/**
 * Protected Area Access Hook
 *
 * Checks if the user has access to a protected area.
 * Shows a passcode gate if access is required.
 */

import { useState, useEffect, useCallback } from "react";

interface AreaAccessState {
  hasAccess: boolean;
  isLoading: boolean;
  areaName?: string;
  requiresPasscode: boolean;
}

interface UseAreaAccessOptions {
  /** Area slug to check access for */
  areaSlug: string;
  /** Skip the access check (useful for development) */
  skip?: boolean;
}

export function useAreaAccess({
  areaSlug,
  skip = false,
}: UseAreaAccessOptions): AreaAccessState & {
  refresh: () => Promise<void>;
  grantAccess: (passcode: string) => Promise<{ success: boolean; error?: string }>;
} {
  const [state, setState] = useState<AreaAccessState>({
    hasAccess: skip,
    isLoading: !skip,
    requiresPasscode: false,
  });

  const checkAccess = useCallback(async () => {
    if (skip) {
      setState({ hasAccess: true, isLoading: false, requiresPasscode: false });
      return;
    }

    try {
      const res = await fetch(`/api/auth/area?area=${encodeURIComponent(areaSlug)}`);
      const data = await res.json();

      setState({
        hasAccess: data.hasAccess ?? true,
        isLoading: false,
        areaName: data.areaName,
        requiresPasscode: !data.hasAccess && data.areaName !== undefined,
      });
    } catch {
      // Fail open for better UX
      setState({
        hasAccess: true,
        isLoading: false,
        requiresPasscode: false,
      });
    }
  }, [areaSlug, skip]);

  const grantAccess = useCallback(
    async (passcode: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/auth/area", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ areaSlug, passcode }),
        });

        const data = await res.json();

        if (!res.ok) {
          return { success: false, error: data.error || "Invalid passcode" };
        }

        // Refresh access state
        setState((prev) => ({
          ...prev,
          hasAccess: true,
          requiresPasscode: false,
        }));

        return { success: true };
      } catch {
        return { success: false, error: "Connection failed" };
      }
    },
    [areaSlug]
  );

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  return {
    ...state,
    refresh: checkAccess,
    grantAccess,
  };
}

export default useAreaAccess;
