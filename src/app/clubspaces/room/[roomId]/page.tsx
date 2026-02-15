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
import { useUser } from '@clerk/nextjs';
import { ClubSpacesApp } from '@/components/clubspaces/ClubSpacesApp';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClubSpacesRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isJoining, setIsJoining] = useState(false);

  const room = useQuery(
    api?.clubspaces?.getRoomById || (async () => null),
    api?.clubspaces?.getRoomById ? { roomId } : "skip"
  );

  useEffect(() => {
    if (!isUserLoaded) return;
    if (!user) {
      router.push('/clubspaces?signIn=true');
      return;
    }
    if (room === null) {
      router.push('/clubspaces?error=room_not_found');
      return;
    }
    if (room && !isJoining) {
      setIsJoining(true);
    }
  }, [user, isUserLoaded, room, router, isJoining]);

  if (!isUserLoaded) {
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

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
          className="text-center"
        >
          <h1 className="text-xl font-bold text-white mb-2">Room Not Found</h1>
          <p className="text-white/40 text-sm mb-6">This room doesn't exist or has been deleted.</p>
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

  return <ClubSpacesApp initialRoomId={roomId} initialRoomData={room} />;
}
