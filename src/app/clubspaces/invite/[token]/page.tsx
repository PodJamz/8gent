'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@/lib/openclaw/hooks';

let api: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  api = require('@/lib/convex-shim').api;
} catch {
  api = null;
}
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Loader2, LogIn, UserPlus, AlertCircle, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClubSpacesInvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const [isJoining, setIsJoining] = useState(false);

  const room = useQuery(
    api?.clubspaces?.getRoomByInviteToken || (async () => null),
    api?.clubspaces?.getRoomByInviteToken ? { inviteToken: token } : "skip"
  );

  useEffect(() => {
    if (!isUserLoaded) return;
    if (isSignedIn && user && room && !isJoining) {
      setIsJoining(true);
      router.push(`/clubspaces/room/${room.roomId}`);
    }
  }, [isSignedIn, user, room, isUserLoaded, router, isJoining]);

  if (!isUserLoaded) {
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (room === undefined) {
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (room === null) {
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm p-8 bg-white/[0.03] rounded-2xl border border-white/[0.06]"
        >
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Invalid Invite</h1>
          <p className="text-white/40 text-sm mb-6">This invite link doesn't exist or has expired.</p>
          <button
            onClick={() => router.push('/clubspaces')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-xl transition-colors text-sm"
          >
            Go to Lobby
          </button>
        </motion.div>
      </div>
    );
  }

  if (isSignedIn && user) {
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-3" />
          <p className="text-white/40 text-sm">Joining room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full bg-white/[0.03] rounded-2xl border border-white/[0.06] p-8"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Radio className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">You're Invited</h1>
          <p className="text-white/40 text-sm">
            {room.hostName} invited you to join
          </p>
        </div>

        <div className="bg-white/[0.03] rounded-xl p-4 mb-6 border border-white/[0.04]">
          <h2 className="text-base font-semibold text-white mb-1">{room.name}</h2>
          {room.description && (
            <p className="text-white/40 text-sm">{room.description}</p>
          )}
          {room.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {room.topics.map((topic: string, i: number) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-xs rounded-full border border-amber-500/20 font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2.5">
          <SignUpButton mode="modal" forceRedirectUrl={`/clubspaces/invite/${token}`}>
            <button className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3 px-6 rounded-xl transition-colors text-sm">
              <UserPlus className="w-4 h-4" />
              Sign Up to Join
            </button>
          </SignUpButton>
          <SignInButton mode="modal" forceRedirectUrl={`/clubspaces/invite/${token}`}>
            <button className="w-full flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] text-white font-medium py-3 px-6 rounded-xl transition-colors text-sm border border-white/[0.06]">
              <LogIn className="w-4 h-4" />
              Already have an account? Sign In
            </button>
          </SignInButton>
        </div>
      </motion.div>
    </div>
  );
}
