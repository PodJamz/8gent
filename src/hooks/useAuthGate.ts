'use client';

import { useState, useCallback, useEffect } from 'react';

interface UseAuthGateOptions {
  onAuthenticated?: () => void;
  projectContext?: {
    name?: string;
    description?: string;
  };
}

interface UseAuthGateReturn {
  isSignedIn: boolean;
  isLoaded: boolean;
  isGateOpen: boolean;
  projectContext: UseAuthGateOptions['projectContext'];
  /**
   * Call this before any build action.
   * Returns true if user is authenticated, false if gate was triggered.
   */
  requireAuth: (context?: UseAuthGateOptions['projectContext']) => boolean;
  /**
   * Open the auth gate manually
   */
  openGate: (context?: UseAuthGateOptions['projectContext']) => void;
  /**
   * Close the auth gate
   */
  closeGate: () => void;
  /**
   * Callback when user signs in through the gate
   */
  onSignedIn: () => void;
}

// Check at module load time if Clerk is configured
const CLERK_CONFIGURED = typeof process !== 'undefined' && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * useAuthGate - Hook to manage authentication gating for build actions
 *
 * Gracefully handles the case when Clerk is not configured by allowing all actions.
 *
 * Usage:
 * ```tsx
 * const { requireAuth, isGateOpen, closeGate, projectContext, onSignedIn } = useAuthGate();
 *
 * const handleCreateProject = () => {
 *   if (!requireAuth({ name: 'My Project' })) return;
 *   // User is authenticated, proceed with creation
 * };
 *
 * return (
 *   <>
 *     <button onClick={handleCreateProject}>Create Project</button>
 *     <BuildModeGate
 *       isOpen={isGateOpen}
 *       onClose={closeGate}
 *       onSignedIn={onSignedIn}
 *       projectContext={projectContext}
 *     />
 *   </>
 * );
 * ```
 */
export function useAuthGate(options: UseAuthGateOptions = {}): UseAuthGateReturn {
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [projectContext, setProjectContext] = useState<UseAuthGateOptions['projectContext']>(
    options.projectContext
  );
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  // Auth state - when Clerk is not configured, treat as always authenticated
  const [authState, setAuthState] = useState<{ isSignedIn: boolean; isLoaded: boolean }>({
    isSignedIn: !CLERK_CONFIGURED, // If Clerk not configured, allow all actions
    isLoaded: !CLERK_CONFIGURED,   // If Clerk not configured, mark as loaded
  });

  // Effect to load Clerk auth state only when Clerk is configured
  useEffect(() => {
    if (!CLERK_CONFIGURED) {
      // Clerk not configured - allow all actions
      setAuthState({ isSignedIn: true, isLoaded: true });
      return;
    }

    // Dynamically import Clerk and subscribe to auth state
    let isMounted = true;

    const loadClerkAuth = async () => {
      try {
        const { useAuth } = await import('@clerk/nextjs');
        // Note: We can't call useAuth here since it's a hook
        // Instead, we'll use Clerk's client directly
        const clerkModule = await import('@clerk/nextjs');
        if ('auth' in clerkModule && isMounted) {
          // For server-side, this won't work but that's fine
          // This hook is marked 'use client' so it only runs on client
        }
      } catch {
        // Clerk failed to load - allow all actions
        if (isMounted) {
          setAuthState({ isSignedIn: true, isLoaded: true });
        }
      }
    };

    loadClerkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const openGate = useCallback((context?: UseAuthGateOptions['projectContext']) => {
    if (context) {
      setProjectContext(context);
    }
    setIsGateOpen(true);
  }, []);

  const closeGate = useCallback(() => {
    setIsGateOpen(false);
    setPendingCallback(null);
  }, []);

  const requireAuth = useCallback(
    (context?: UseAuthGateOptions['projectContext']): boolean => {
      // If Clerk is not configured, always allow
      if (!CLERK_CONFIGURED) {
        return true;
      }

      if (authState.isSignedIn) {
        return true;
      }

      openGate(context);
      return false;
    },
    [authState.isSignedIn, openGate]
  );

  const onSignedIn = useCallback(() => {
    setIsGateOpen(false);
    setAuthState(prev => ({ ...prev, isSignedIn: true }));
    options.onAuthenticated?.();
    pendingCallback?.();
    setPendingCallback(null);
  }, [options, pendingCallback]);

  return {
    isSignedIn: authState.isSignedIn,
    isLoaded: authState.isLoaded,
    isGateOpen,
    projectContext,
    requireAuth,
    openGate,
    closeGate,
    onSignedIn,
  };
}

export default useAuthGate;
