'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, X, Shield, Code2, Terminal, AlertTriangle, ExternalLink } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

// Check at module load time if Clerk is configured
const CLERK_CONFIGURED = typeof window !== 'undefined' &&
  typeof process !== 'undefined' &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

interface GitHubAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated?: () => void;
  errorMessage?: string;
}

/**
 * GitHubAuthModal - Prompts owner to authenticate via GitHub when sandbox auth fails
 *
 * This appears when:
 * - Sandbox returns "Authentication required" error
 * - Any GitHub OAuth related error occurs
 * - Only shown to the owner (verified via Clerk)
 *
 * If already signed in, directs user to connect GitHub in settings.
 * If not signed in, shows SignIn button.
 */
export function GitHubAuthModal({
  isOpen,
  onClose,
  onAuthenticated,
  errorMessage,
}: GitHubAuthModalProps) {
  const { user, isSignedIn } = useUser();
  const [isHovering, setIsHovering] = useState(false);
  const [SignInButtonComponent, setSignInButtonComponent] = useState<
    React.ComponentType<{ mode: string; children: React.ReactNode }> | null
  >(null);

  // Check if user has GitHub connected
  const hasGitHub = user?.externalAccounts?.some(
    (account) => account.provider === 'github'
  );

  // Dynamically load Clerk SignInButton
  useEffect(() => {
    if (!CLERK_CONFIGURED || isSignedIn) {
      return;
    }

    let isMounted = true;

    const loadClerk = async () => {
      try {
        const clerk = await import('@clerk/nextjs');
        if (isMounted) {
          setSignInButtonComponent(
            () => clerk.SignInButton as React.ComponentType<{ mode: string; children: React.ReactNode }>
          );
        }
      } catch {
        // Clerk failed to load
      }
    };

    loadClerk();

    return () => {
      isMounted = false;
    };
  }, [isSignedIn]);

  // Handle connecting GitHub for signed-in users
  const handleConnectGitHub = useCallback(() => {
    // Redirect to integrations settings page
    window.location.href = '/settings/integrations';
  }, []);

  // If Clerk isn't configured, allow bypass
  if (!CLERK_CONFIGURED && isOpen) {
    onAuthenticated?.();
    onClose();
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-md bg-gradient-to-b from-neutral-900 to-black rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white/80 transition-colors rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="px-6 pt-8 pb-6 text-center">
                {/* Animated Orb */}
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 relative"
                  animate={{
                    boxShadow: isHovering
                      ? [
                          '0 0 30px rgba(34, 197, 94, 0.5)',
                          '0 0 50px rgba(34, 197, 94, 0.7)',
                          '0 0 30px rgba(34, 197, 94, 0.5)',
                        ]
                      : [
                          '0 0 20px rgba(34, 197, 94, 0.3)',
                          '0 0 30px rgba(34, 197, 94, 0.4)',
                          '0 0 20px rgba(34, 197, 94, 0.3)',
                        ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ borderRadius: '50%' }}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <Github className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                {/* Error indicator */}
                {errorMessage && (
                  <div className="flex items-center justify-center gap-2 mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-300">{errorMessage}</span>
                  </div>
                )}

                {/* Message */}
                <h2 className="text-xl font-bold text-white mb-2">
                  GitHub Authentication Required
                </h2>
                <p className="text-white/50 text-sm leading-relaxed">
                  {isSignedIn && !hasGitHub
                    ? 'Connect your GitHub account to enable sandbox features.'
                    : 'To use the sandbox environment, you need to authenticate with GitHub. This enables secure code execution and repository access.'}
                </p>
              </div>

              {/* Features */}
              <div className="px-6 pb-6">
                <div className="bg-white/5 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white/80">Secure Sandbox Access</p>
                      <p className="text-white/40 text-xs">Run code in isolated cloud environments</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Code2 className="w-4 h-4 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white/80">Repository Integration</p>
                      <p className="text-white/40 text-xs">Clone, commit, and push to your repos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Terminal className="w-4 h-4 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white/80">Full Terminal Access</p>
                      <p className="text-white/40 text-xs">Run commands and build projects</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-8">
                {isSignedIn ? (
                  // User is signed in - direct to connect GitHub
                  <button
                    onClick={handleConnectGitHub}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold transition-all shadow-lg shadow-green-500/25"
                  >
                    <Github className="w-5 h-5" />
                    <span>Connect GitHub Account</span>
                    <ExternalLink className="w-4 h-4 opacity-60" />
                  </button>
                ) : SignInButtonComponent ? (
                  <SignInButtonComponent mode="modal">
                    <button
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold transition-all shadow-lg shadow-green-500/25"
                    >
                      <Github className="w-5 h-5" />
                      <span>Sign in with GitHub</span>
                    </button>
                  </SignInButtonComponent>
                ) : (
                  <button
                    onClick={() => {
                      onAuthenticated?.();
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold transition-all shadow-lg shadow-green-500/25"
                  >
                    <Github className="w-5 h-5" />
                    <span>Continue</span>
                  </button>
                )}

                <p className="text-center text-white/30 text-xs mt-4">
                  {isSignedIn
                    ? 'You\'ll be redirected to connect your GitHub account'
                    : 'Authentication is required for sandbox operations'}
                </p>
              </div>

              {/* Cancel option */}
              <div className="px-6 pb-6 text-center">
                <button
                  onClick={onClose}
                  className="text-white/40 hover:text-white/60 text-sm transition-colors"
                >
                  Cancel and go back
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default GitHubAuthModal;
