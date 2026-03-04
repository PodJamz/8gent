'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useMutation } from '@/lib/openclaw/hooks';
import { LogIn, Radio, AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

// Handle Convex API import gracefully (may not exist in build)
let api: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  api = require('../../../convex/_generated/api').api;
} catch {
  api = null;
}
import { useClubSpacesRoom } from './useClubSpacesRoom';
import { ClubSpacesLobby } from './ClubSpacesLobby';
import { ClubSpacesRoom } from './ClubSpacesRoom';

const ClubSpacesContext = createContext<ReturnType<typeof useClubSpacesRoom> | null>(null);

export function useClubSpacesContext() {
  const context = useContext(ClubSpacesContext);
  if (!context) throw new Error('useClubSpacesContext must be used within ClubSpacesApp');
  return context;
}

interface ClubSpacesAppProps {
  initialRoomId?: string;
  initialRoomData?: any;
}

export function ClubSpacesApp({ initialRoomId, initialRoomData }: ClubSpacesAppProps = {}) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const createRoom = useMutation(
    api?.clubspaces?.createRoom || (async () => ({ roomId: '', inviteToken: '' }))
  );
  const [view, setView] = useState<'lobby' | 'room' | 'signin' | 'error'>(initialRoomId ? 'room' : 'lobby');
  const [roomName, setRoomName] = useState<string | null>(initialRoomData?.name || null);
  const [roomId, setRoomId] = useState<string | null>(initialRoomId || null);
  const [inviteToken, setInviteToken] = useState<string | null>(initialRoomData?.inviteToken || null);
  const [pendingAction, setPendingAction] = useState<{ type: 'create' | 'join'; args: any[] } | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const roomHook = useClubSpacesRoom();
  const { room, connect, disconnect, isConnected } = roomHook;

  // If user signs in while on signin view, go back to lobby
  useEffect(() => {
    if (user && view === 'signin') {
      setView('lobby');
    }
  }, [user, view]);

  // After sign-in, retry pending action
  useEffect(() => {
    if (user && pendingAction) {
      if (pendingAction.type === 'create') {
        handleCreateRoom(...(pendingAction.args as [string, string?, string[]?]));
      } else {
        handleJoinRoom(pendingAction.args[0] as string);
      }
      setPendingAction(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pendingAction]);

  const getErrorMessage = (error: unknown): string => {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('could not establish signal connection') || msg.includes('Failed to fetch')) {
      return 'LiveKit server is unreachable. Make sure your self-hosted LiveKit server is running and accessible.';
    }
    if (msg.includes('Token generation failed') || msg.includes('LiveKit server not configured')) {
      return 'LiveKit credentials are not configured. Check your LIVEKIT_API_KEY and LIVEKIT_API_SECRET environment variables.';
    }
    if (msg.includes('CORS')) {
      return 'LiveKit server is blocking cross-origin requests. Check your Cloudflare Tunnel and CORS configuration.';
    }
    return `Connection failed: ${msg}`;
  };

  const handleCreateRoom = async (name: string, description?: string, topics?: string[]) => {
    if (!user) {
      setPendingAction({ type: 'create', args: [name, description, topics] });
      setView('signin');
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      let targetRoomId: string;
      let targetInviteToken: string;

      if (!api?.clubspaces?.createRoom) {
        console.error('Convex API not available - using fallback room creation');
        targetRoomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        targetInviteToken = Math.random().toString(36).substr(2, 16);
      } else {
        const result = await createRoom({
          name,
          description,
          topics: topics || [],
          isPublic: true,
          hostClerkId: user.id,
          hostName: user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || 'Host',
          maxSpeakers: 13,
        });
        targetRoomId = result.roomId;
        targetInviteToken = result.inviteToken;
      }

      setRoomId(targetRoomId);
      setRoomName(name);
      setInviteToken(targetInviteToken);

      await connect(targetRoomId, 'host', {
        description,
        topics: topics || [],
        isPublic: true,
      });

      window.history.pushState({}, '', `/clubspaces/room/${targetRoomId}`);
      setView('room');
    } catch (error) {
      console.error('Failed to create room:', error);
      setConnectionError(getErrorMessage(error));
      setView('error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleJoinRoom = async (nameOrId: string) => {
    if (!user) {
      setPendingAction({ type: 'join', args: [nameOrId] });
      setView('signin');
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    let actualRoomId = nameOrId;
    if (nameOrId.includes('/clubspaces/room/')) {
      actualRoomId = nameOrId.split('/clubspaces/room/')[1];
    } else if (nameOrId.includes('/clubspaces/invite/')) {
      actualRoomId = nameOrId.split('/clubspaces/invite/')[1];
    }

    try {
      setRoomName(actualRoomId);
      setRoomId(actualRoomId);

      await connect(actualRoomId, 'listener');
      window.history.pushState({}, '', `/clubspaces/room/${actualRoomId}`);
      setView('room');
    } catch (error) {
      console.error('Failed to join room:', error);
      setConnectionError(getErrorMessage(error));
      setView('error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLeaveRoom = async () => {
    await disconnect();
    setRoomName(null);
    setRoomId(null);
    setConnectionError(null);
    window.history.pushState({}, '', '/clubspaces');
    setView('lobby');
  };

  const handleRetry = () => {
    setConnectionError(null);
    setView('lobby');
  };

  useEffect(() => {
    if (view === 'room' && !isConnected) {
      setView('lobby');
      setRoomName(null);
    }
  }, [isConnected, view]);

  return (
    <ClubSpacesContext.Provider value={roomHook}>
      <div className="min-h-dvh bg-black">
        <AnimatePresence mode="wait">
          {view === 'error' ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="min-h-dvh flex flex-col items-center justify-center p-4 bg-black"
            >
              <div className="max-w-md w-full text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                  <WifiOff className="w-7 h-7 text-red-400" />
                </div>
                <h1 className="text-xl font-bold text-white mb-2">Connection Failed</h1>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">
                  {connectionError}
                </p>

                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-6 text-left">
                  <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-3">Troubleshooting</p>
                  <ul className="space-y-2 text-white/40 text-xs">
                    <li className="flex items-start gap-2">
                      <Wifi className="w-3.5 h-3.5 text-amber-500/60 mt-0.5 shrink-0" />
                      <span>Ensure LiveKit Server is running (<code className="text-amber-500/80 bg-white/[0.04] px-1 rounded">docker ps</code>)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Wifi className="w-3.5 h-3.5 text-amber-500/60 mt-0.5 shrink-0" />
                      <span>Check Cloudflare Tunnel is active and routing to port 7880</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Wifi className="w-3.5 h-3.5 text-amber-500/60 mt-0.5 shrink-0" />
                      <span>Verify <code className="text-amber-500/80 bg-white/[0.04] px-1 rounded">LIVEKIT_URL</code> env var in Vercel matches your tunnel URL</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRetry}
                    className="flex-1 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                  <button
                    onClick={() => { window.history.pushState({}, '', '/clubspaces'); setView('lobby'); setConnectionError(null); }}
                    className="px-5 py-3 bg-white/[0.06] hover:bg-white/10 text-white/60 hover:text-white rounded-xl transition-colors border border-white/[0.06]"
                  >
                    Back
                  </button>
                </div>
              </div>
            </motion.div>
          ) : view === 'signin' ? (
            <motion.div
              key="signin"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="min-h-dvh flex flex-col items-center justify-center p-4 bg-black"
            >
              <div className="max-w-sm w-full text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto mb-6">
                  <Radio className="w-7 h-7 text-black" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Sign in to continue</h1>
                <p className="text-white/40 text-sm mb-8">
                  Sign in to create or join audio rooms
                </p>
                <SignInButton mode="modal" forceRedirectUrl="/clubspaces">
                  <button className="w-full px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                </SignInButton>
                <button
                  onClick={() => {
                    setPendingAction(null);
                    setView('lobby');
                  }}
                  className="mt-4 text-sm text-white/30 hover:text-white/60 transition-colors"
                >
                  Back to lobby
                </button>
              </div>
            </motion.div>
          ) : view === 'lobby' ? (
            <motion.div
              key="lobby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ClubSpacesLobby
                onCreateRoom={handleCreateRoom}
                onJoinRoom={handleJoinRoom}
                user={user}
                isConnecting={isConnecting}
              />
            </motion.div>
          ) : (
            <motion.div
              key="room"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <ClubSpacesRoom
                roomName={roomName!}
                roomId={roomId!}
                inviteToken={inviteToken}
                room={room}
                onLeave={handleLeaveRoom}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ClubSpacesContext.Provider>
  );
}
