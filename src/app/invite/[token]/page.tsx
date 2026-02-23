'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import { SignInButton, SignUpButton, useUser, useAuth } from '@clerk/nextjs';
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Home,
  Mail,
  Shield,
  User,
  Music2,
  Palette,
  Clock,
  UserPlus,
  LogIn,
} from 'lucide-react';

type InviteStatus = 'loading' | 'pending' | 'accepted' | 'expired' | 'revoked' | 'error' | 'email_mismatch';

interface InviteData {
  status: string;
  email: string;
  role?: string;
  permissions?: {
    areas: string[];
    privateMusic: boolean;
    designCanvas: boolean;
    clawAI: boolean;
    security: boolean;
    analytics: boolean;
    manageUsers: boolean;
    managePasscodes: boolean;
    manageContent: boolean;
  };
  createdAt?: number;
  expiresAt?: number;
  acceptedAt?: number;
  createdByName?: string;
}

export default function InviteAcceptPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const { isLoaded: authLoaded } = useAuth();

  const [status, setStatus] = useState<InviteStatus>('loading');
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  // Query the invite
  const invite = useQuery(api.collaborators.getInviteByToken, { token });

  // Accept mutation
  const acceptInvite = useMutation(api.collaborators.acceptInvite);

  // Process invite status
  useEffect(() => {
    if (invite === undefined) {
      setStatus('loading');
      return;
    }

    if (invite === null) {
      setStatus('error');
      return;
    }

    setInviteData(invite as InviteData);

    switch (invite.status) {
      case 'pending':
        setStatus('pending');
        break;
      case 'accepted':
        setStatus('accepted');
        break;
      case 'expired':
        setStatus('expired');
        break;
      case 'revoked':
        setStatus('revoked');
        break;
      default:
        setStatus('error');
    }
  }, [invite]);

  // Auto-accept if user is signed in with matching email
  useEffect(() => {
    async function tryAutoAccept() {
      if (
        status === 'pending' &&
        isSignedIn &&
        user?.primaryEmailAddress?.emailAddress &&
        inviteData?.email &&
        !isAccepting
      ) {
        const userEmail = user.primaryEmailAddress.emailAddress.toLowerCase();
        const inviteEmail = inviteData.email.toLowerCase();

        if (userEmail === inviteEmail) {
          await handleAccept();
        } else {
          setStatus('email_mismatch');
        }
      }
    }

    if (userLoaded && authLoaded) {
      tryAutoAccept();
    }
  }, [status, isSignedIn, user, inviteData, userLoaded, authLoaded]);

  const handleAccept = async () => {
    if (isAccepting) return;

    setIsAccepting(true);
    setAcceptError(null);

    try {
      const result = await acceptInvite({ token });

      if (result.success) {
        setStatus('accepted');
        // Redirect after short delay
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setAcceptError(result.error || 'Failed to accept invite');
      }
    } catch (err) {
      setAcceptError('An error occurred. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  };

  const formatExpiresAt = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.ceil((timestamp - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Expired';
    if (diffDays === 1) return 'Expires tomorrow';
    if (diffDays <= 7) return `Expires in ${diffDays} days`;
    return `Expires ${date.toLocaleDateString()}`;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-5 h-5" />;
      case 'collaborator':
        return <User className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-amber-400';
      case 'collaborator':
        return 'text-blue-400';
      default:
        return 'text-zinc-400';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-zinc-950 to-zinc-950" />

      <motion.div
        className="relative z-10 max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-800 p-8">
          <AnimatePresence mode="wait">
            {/* Loading State */}
            {status === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
                <h1 className="text-white text-xl font-semibold mb-2">Loading invite...</h1>
                <p className="text-zinc-500 text-sm">Please wait</p>
              </motion.div>
            )}

            {/* Pending State - Show invite details */}
            {status === 'pending' && inviteData && !isSignedIn && (
              <motion.div
                key="pending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-amber-400" />
                  </div>
                  <h1 className="text-white text-xl font-semibold mb-2">You're Invited!</h1>
                  <p className="text-zinc-400 text-sm">
                    {inviteData.createdByName} has invited you to join 8gent
                  </p>
                </div>

                {/* Invite Details */}
                <div className="bg-zinc-800/50 rounded-xl p-4 mb-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-zinc-500" />
                    <span className="text-zinc-300 text-sm">{inviteData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={getRoleColor(inviteData.role || 'viewer')}>
                      {getRoleIcon(inviteData.role || 'viewer')}
                    </span>
                    <span className="text-zinc-300 text-sm capitalize">
                      {inviteData.role || 'Viewer'} access
                    </span>
                  </div>
                  {inviteData.expiresAt && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-zinc-500" />
                      <span className="text-zinc-400 text-sm">
                        {formatExpiresAt(inviteData.expiresAt)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Permissions Preview */}
                {inviteData.permissions && (
                  <div className="mb-6">
                    <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-3">
                      Access Granted
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {inviteData.permissions.privateMusic && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
                          <Music2 className="w-3 h-3" /> Private Music
                        </span>
                      )}
                      {inviteData.permissions.designCanvas && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
                          <Palette className="w-3 h-3" /> Design Canvas
                        </span>
                      )}
                      {inviteData.permissions.areas.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
                          +{inviteData.permissions.areas.length} protected areas
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Auth Buttons */}
                <div className="space-y-3">
                  <SignUpButton mode="modal" forceRedirectUrl={`/invite/${token}`}>
                    <button className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 px-6 rounded-full transition-colors">
                      <UserPlus className="w-4 h-4" />
                      Sign Up to Accept
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal" forceRedirectUrl={`/invite/${token}`}>
                    <button className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-6 rounded-full transition-colors">
                      <LogIn className="w-4 h-4" />
                      Already have an account? Sign In
                    </button>
                  </SignInButton>
                </div>
              </motion.div>
            )}

            {/* Signed in but processing */}
            {status === 'pending' && isSignedIn && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
                <h1 className="text-white text-xl font-semibold mb-2">Accepting invite...</h1>
                <p className="text-zinc-500 text-sm">Setting up your access</p>
              </motion.div>
            )}

            {/* Email Mismatch */}
            {status === 'email_mismatch' && inviteData && (
              <motion.div
                key="mismatch"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h1 className="text-white text-xl font-semibold mb-2">Email Mismatch</h1>
                  <p className="text-zinc-400 text-sm">
                    This invite is for <span className="text-white font-medium">{inviteData.email}</span>
                  </p>
                  <p className="text-zinc-500 text-sm mt-1">
                    You're signed in as{' '}
                    <span className="text-white">{user?.primaryEmailAddress?.emailAddress}</span>
                  </p>
                </div>

                <div className="space-y-3">
                  <SignInButton mode="modal" forceRedirectUrl={`/invite/${token}`}>
                    <button className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 px-6 rounded-full transition-colors">
                      <LogIn className="w-4 h-4" />
                      Sign in with {inviteData.email}
                    </button>
                  </SignInButton>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-6 rounded-full transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    Go to 8gent
                  </button>
                </div>
              </motion.div>
            )}

            {/* Accepted State */}
            {status === 'accepted' && (
              <motion.div
                key="accepted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h1 className="text-white text-xl font-semibold mb-2">Welcome to 8gent!</h1>
                <p className="text-zinc-400 text-sm mb-6">
                  Your access has been set up. Redirecting you now...
                </p>

                <button
                  onClick={() => router.push('/')}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 px-6 rounded-full transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go to 8gent
                </button>
              </motion.div>
            )}

            {/* Expired State */}
            {status === 'expired' && (
              <motion.div
                key="expired"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
                <h1 className="text-white text-xl font-semibold mb-2">Invite Expired</h1>
                <p className="text-zinc-400 text-sm mb-6">
                  This invite link has expired. Please contact the person who invited you to request a new one.
                </p>

                <button
                  onClick={() => router.push('/')}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-6 rounded-full transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go to 8gent
                </button>
              </motion.div>
            )}

            {/* Revoked State */}
            {status === 'revoked' && (
              <motion.div
                key="revoked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-white text-xl font-semibold mb-2">Invite Revoked</h1>
                <p className="text-zinc-400 text-sm mb-6">
                  This invite has been revoked. Please contact the person who invited you for assistance.
                </p>

                <button
                  onClick={() => router.push('/')}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-6 rounded-full transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go to 8gent
                </button>
              </motion.div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-white text-xl font-semibold mb-2">Invite Not Found</h1>
                <p className="text-zinc-400 text-sm mb-6">
                  {acceptError || "This invite link doesn't exist or is invalid."}
                </p>

                <button
                  onClick={() => router.push('/')}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-6 rounded-full transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go to 8gent
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-600 text-xs mt-4">
          8gent - Personal Operating System
        </p>
      </motion.div>
    </div>
  );
}
