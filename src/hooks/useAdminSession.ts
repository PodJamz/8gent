"use client";

/**
 * Admin Session Hook
 *
 * Provides client-side access to admin session state.
 * Used to conditionally show admin-only features.
 */

import { useState, useEffect, useCallback } from "react";

interface AdminSession {
  isAuthenticated: boolean;
  username?: string;
  isLoading: boolean;
}

export function useAdminSession(): AdminSession & { refresh: () => Promise<void> } {
  const [session, setSession] = useState<AdminSession>({
    isAuthenticated: false,
    isLoading: true,
  });

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/admin");
      const data = await res.json();
      setSession({
        isAuthenticated: data.isAuthenticated ?? false,
        username: data.username,
        isLoading: false,
      });
    } catch {
      setSession({
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return {
    ...session,
    refresh: checkSession,
  };
}

export default useAdminSession;
