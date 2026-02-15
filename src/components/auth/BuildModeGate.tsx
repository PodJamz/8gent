'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Sparkles, X, Zap, FolderGit2, Rocket } from 'lucide-react';

// Check at module load time if Clerk is configured
const CLERK_CONFIGURED = typeof process !== 'undefined' && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

interface BuildModeGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSignedIn?: () => void;
  projectContext?: {
    name?: string;
    description?: string;
  };
}

/**
 * BuildModeGate - Claw AI prompts the user to sign in before building
 *
 * This appears when a user tries to:
 * - Create a new project
 * - Save files to a repo
 * - Deploy to Vercel
 * - Any "build" action that requires persistence
 *
 * Note: When Clerk is not configured, this component will not render.
 */
export function BuildModeGate({
  isOpen,
  onClose,
  onSignedIn,
  projectContext,
}: BuildModeGateProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isSignedIn] = useState(!CLERK_CONFIGURED);
  const [SignInButtonComponent, setSignInButtonComponent] = useState<React.ComponentType<{ mode: string; children: React.ReactNode }> | null>(null);

  // Dynamically load Clerk SignInButton only when configured
  useEffect(() => {
    if (!CLERK_CONFIGURED) {
      return;
    }

    let isMounted = true;

    const loadClerk = async () => {
      try {
        const clerk = await import('@clerk/nextjs');
        if (isMounted) {
          setSignInButtonComponent(() => clerk.SignInButton as React.ComponentType<{ mode: string; children: React.ReactNode }>);
        }
      } catch {
        // Clerk failed to load - close the gate
        if (isMounted) {
          onClose();
        }
      }
    };

    loadClerk();

    return () => {
      isMounted = false;
    };
  }, [onClose]);

  // If Clerk is not configured, don't show the gate - allow all actions
  if (!CLERK_CONFIGURED) {
    if (isOpen) {
      onSignedIn?.();
      onClose();
    }
    return null;
  }

  // If already signed in, call the callback and close
  if (isSignedIn && isOpen) {
    onSignedIn?.();
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

              {/* Claw AI Header */}
              <div className="px-6 pt-8 pb-6 text-center">
                {/* Orb */}
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 relative"
                  animate={{
                    boxShadow: isHovering
                      ? [
                          '0 0 30px rgba(249, 115, 22, 0.5)',
                          '0 0 50px rgba(249, 115, 22, 0.7)',
                          '0 0 30px rgba(249, 115, 22, 0.5)',
                        ]
                      : [
                          '0 0 20px rgba(249, 115, 22, 0.3)',
                          '0 0 30px rgba(249, 115, 22, 0.4)',
                          '0 0 20px rgba(249, 115, 22, 0.3)',
                        ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ borderRadius: '50%' }}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                {/* Message */}
                <h2 className="text-xl font-bold text-white mb-2">
                  Ready to build something amazing?
                </h2>
                <p className="text-white/50 text-sm leading-relaxed">
                  {projectContext?.name ? (
                    <>
                      I&apos;m excited to help you build{' '}
                      <span className="text-orange-400">{projectContext.name}</span>!
                      Let&apos;s connect your accounts so I can create your repo and deploy your app.
                    </>
                  ) : (
                    <>
                      Before we start building, let&apos;s connect your accounts.
                      This lets me create repos, manage code, and deploy for you automatically.
                    </>
                  )}
                </p>
              </div>

              {/* Features */}
              <div className="px-6 pb-6">
                <div className="bg-white/5 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <FolderGit2 className="w-4 h-4 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white/80">GitHub Integration</p>
                      <p className="text-white/40 text-xs">Create repos, issues, and PRs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Rocket className="w-4 h-4 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white/80">Auto Deployments</p>
                      <p className="text-white/40 text-xs">Deploy to Vercel on every push</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white/80">AI-Powered Building</p>
                      <p className="text-white/40 text-xs">I&apos;ll implement your tickets autonomously</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sign In Button */}
              <div className="px-6 pb-8">
                {SignInButtonComponent ? (
                  <SignInButtonComponent mode="modal">
                    <button
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold transition-all shadow-lg shadow-orange-500/25"
                    >
                      <Github className="w-5 h-5" />
                      <span>Continue with GitHub</span>
                    </button>
                  </SignInButtonComponent>
                ) : (
                  <button
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold transition-all shadow-lg shadow-orange-500/25"
                  >
                    <Github className="w-5 h-5" />
                    <span>Continue without signing in</span>
                  </button>
                )}

                <p className="text-center text-white/30 text-xs mt-4">
                  We&apos;ll only request the permissions needed to build your project
                </p>
              </div>

              {/* Skip option */}
              <div className="px-6 pb-6 text-center">
                <button
                  onClick={onClose}
                  className="text-white/40 hover:text-white/60 text-sm transition-colors"
                >
                  Continue exploring without signing in
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BuildModeGate;
