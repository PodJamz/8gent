'use client';

/**
 * Admin Access Settings Page
 *
 * Shows admin session status and allows logout.
 * Also provides info about admin credentials setup.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PageTransition } from '@/components/ios';
import { useAdminSession } from '@/hooks/useAdminSession';
import {
  ChevronLeft,
  Shield,
  ShieldAlert,
  LogOut,
  User,
  Clock,
  Key,
  Loader2,
  AlertCircle,
  CheckCircle,
  Activity,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { isAuthenticated: isAdmin, isLoading: isAdminLoading, username, refresh } = useAdminSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.push('/settings');
    }
  }, [isAdmin, isAdminLoading, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/admin', { method: 'DELETE' });
      await refresh();
      router.push('/settings');
    } catch {
      setIsLoggingOut(false);
    }
  };

  if (isAdminLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-950">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
            <Link
              href="/settings"
              className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Go back to settings"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white">Admin Access</h1>
              <p className="text-xs text-white/50">Session and security settings</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-lg mx-auto px-4 py-6">
          {/* Current session */}
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{username}</h2>
                <p className="text-sm text-white/50">Administrator</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white/70">Session active</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-white/40" />
                <span className="text-white/50">Sessions expire after 24 hours</span>
              </div>
            </div>
          </div>

          {/* Security Command Center */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 px-4">
              Security
            </h3>
            <div className="rounded-xl overflow-hidden bg-white/5">
              <Link
                href="/security"
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-white text-sm block">Security Command Center</span>
                  <span className="text-white/40 text-xs">Monitor traffic, sessions & threats</span>
                </div>
                <Activity className="w-4 h-4 text-green-400 animate-pulse" />
              </Link>
            </div>
          </div>

          {/* Admin features */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 px-4">
              Admin Features
            </h3>
            <div className="rounded-xl overflow-hidden bg-white/5">
              <Link
                href="/settings/passcodes"
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Key className="w-4 h-4 text-white" />
                </div>
                <span className="flex-1 text-white text-sm">Protected Area Passcodes</span>
                <span className="text-white/30 text-sm">Manage</span>
              </Link>
              <Link
                href="/settings/collaborators"
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="flex-1 text-white text-sm">iPod Collaborators</span>
                <span className="text-white/30 text-sm">Manage</span>
              </Link>
            </div>
          </div>

          {/* Security info */}
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-amber-400 mb-1">Security Note</h3>
                <p className="text-xs text-white/60">
                  Admin credentials are stored securely and hashed. To change your password,
                  update the <code className="bg-white/10 px-1 rounded">ADMIN_PASSWORD_HASH</code> environment variable.
                </p>
              </div>
            </div>
          </div>

          {/* Logout button */}
          <motion.button
            onClick={handleLogout}
            disabled={isLoggingOut}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Sign Out
              </>
            )}
          </motion.button>

          {/* Version info */}
          <div className="mt-8 text-center">
            <p className="text-xs text-white/30">8gent Admin Panel v1.0</p>
            <p className="text-xs text-white/20 mt-1">Passcode Authentication System</p>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
