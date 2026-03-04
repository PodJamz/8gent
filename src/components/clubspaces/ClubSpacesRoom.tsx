'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Room } from 'livekit-client';
import { useQuery } from '@/lib/openclaw/hooks';

// Handle Convex API import gracefully (may not exist in build)
let api: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  api = require('../../../convex/_generated/api').api;
} catch {
  api = null;
}
import {
  Mic, MicOff, Users, LogOut, Hand, MessageSquare,
  Share2, Copy, Check, ChevronDown, Settings2, Radio
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClubSpacesParticipant } from './ClubSpacesParticipant';
import { ClubSpacesChat } from './ClubSpacesChat';
import { ClubSpacesHostControls } from './ClubSpacesHostControls';
import { useClubSpacesContext } from './ClubSpacesApp';

interface ClubSpacesRoomProps {
  roomName: string;
  roomId: string;
  inviteToken?: string | null;
  room: Room | null;
  onLeave: () => void;
}

export function ClubSpacesRoom({ roomName, roomId, inviteToken: propInviteToken, room, onLeave }: ClubSpacesRoomProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const roomData = useQuery(
    api?.clubspaces?.getRoomById || (async () => null),
    api?.clubspaces?.getRoomById ? { roomId } : "skip"
  );
  const inviteToken = propInviteToken || roomData?.inviteToken || null;

  const roomUrl = typeof window !== 'undefined' ? `${window.location.origin}/clubspaces/room/${roomId}` : '';
  const inviteUrl = inviteToken && typeof window !== 'undefined'
    ? `${window.location.origin}/clubspaces/invite/${inviteToken}`
    : null;

  useEffect(() => {
    if (!showShareMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.share-menu-container')) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showShareMenu]);

  const {
    localRole,
    roomMetadata,
    chatMessages,
    reactions,
    hasRaisedHand,
    toggleMute,
    raiseHand,
    sendChatMessage,
    sendReaction,
    promoteToSpeaker,
    muteParticipant,
  } = useClubSpacesContext();

  const [showChat, setShowChat] = useState(false);
  const [showHostControls, setShowHostControls] = useState(false);

  const isMuted = room?.localParticipant.audioTrackPublications.values().next().value?.track?.isMuted ?? false;
  const participantCount = (room?.remoteParticipants.size ?? 0) + 1;
  const isHost = localRole === 'host' || localRole === 'co-host';
  const isSpeaker = localRole === 'host' || localRole === 'co-host' || localRole === 'speaker';

  const hosts = room ? Array.from(room.remoteParticipants.values())
    .filter(p => {
      const meta = p.metadata ? JSON.parse(p.metadata) : {};
      return meta.role === 'host' || meta.role === 'co-host';
    }) : [];

  const speakers = room ? Array.from(room.remoteParticipants.values())
    .filter(p => {
      const meta = p.metadata ? JSON.parse(p.metadata) : {};
      return meta.role === 'speaker';
    }) : [];

  const listeners = room ? Array.from(room.remoteParticipants.values())
    .filter(p => {
      const meta = p.metadata ? JSON.parse(p.metadata) : {};
      return meta.role === 'listener' || !meta.role;
    }) : [];

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-black relative">
      {/* Top bar */}
      <motion.header
        className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <ChevronDown className="w-5 h-5 text-white/40" />
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-white/60">LIVE</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <Users className="w-3.5 h-3.5" />
            <span>{participantCount}</span>
          </div>
        </div>
      </motion.header>

      {/* Room content area */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Room card - Clubhouse style */}
        <motion.div
          className="mx-4 mt-4 p-5 bg-white/[0.03] rounded-2xl border border-white/[0.06]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          {/* Room title */}
          <h1 className="text-xl font-bold text-white mb-1">{roomName}</h1>

          {/* Topics */}
          {roomMetadata?.topics && roomMetadata.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {roomMetadata.topics.map((topic, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 bg-amber-500/10 text-amber-500 text-xs rounded-full border border-amber-500/20 font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}

          {/* Actions row */}
          <div className="flex items-center gap-2 mt-4">
            <div className="relative share-menu-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShareMenu(!showShareMenu);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/50 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-lg border border-white/[0.06] transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
              {showShareMenu && (
                <div
                  className="absolute left-0 top-full mt-2 w-72 bg-neutral-900 border border-white/[0.08] rounded-xl p-4 shadow-2xl z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Room URL</div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={roomUrl}
                          readOnly
                          className="flex-1 px-2.5 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs font-mono"
                        />
                        <button
                          onClick={() => copyToClipboard(roomUrl)}
                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors"
                        >
                          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    {inviteUrl && (
                      <div>
                        <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Invite Link</div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={inviteUrl}
                            readOnly
                            className="flex-1 px-2.5 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs font-mono"
                          />
                          <button
                            onClick={() => copyToClipboard(inviteUrl)}
                            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors"
                          >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {isHost && (
              <button
                onClick={() => setShowHostControls(!showHostControls)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-500/80 hover:text-amber-500 bg-amber-500/[0.06] hover:bg-amber-500/10 rounded-lg border border-amber-500/10 transition-all"
              >
                <Settings2 className="w-3.5 h-3.5" />
                Host
              </button>
            )}
          </div>
        </motion.div>

        {/* Host Controls Panel */}
        <AnimatePresence>
          {showHostControls && isHost && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-4 mt-3 overflow-hidden"
            >
              <ClubSpacesHostControls
                room={room}
                onPromoteToSpeaker={promoteToSpeaker}
                onMuteParticipant={muteParticipant}
                onClose={() => setShowHostControls(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage - Hosts & Speakers */}
        <motion.section
          className="px-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex flex-wrap gap-6 justify-center py-4">
            {/* Local participant (You) */}
            {room && (
              <ClubSpacesParticipant
                key={room.localParticipant.identity}
                identity={room.localParticipant.identity}
                name="You"
                role={localRole}
                isMuted={isMuted}
                isSpeaking={false}
                audioLevel={0}
                hasRaisedHand={hasRaisedHand}
                isLocal={true}
              />
            )}

            {/* Hosts */}
            {hosts.map((participant) => {
              const audioPub = participant.audioTrackPublications.values().next().value;
              const meta = participant.metadata ? JSON.parse(participant.metadata) : {};
              const participantMuted = audioPub?.isMuted ?? false;
              const audioLevel = audioPub?.track && !audioPub.isMuted ? 0.3 : 0;
              const speaking = audioLevel > 0.1;

              return (
                <ClubSpacesParticipant
                  key={participant.identity}
                  identity={participant.identity}
                  name={participant.name || participant.identity}
                  role={meta.role || 'host'}
                  isMuted={participantMuted}
                  isSpeaking={speaking}
                  audioLevel={audioLevel}
                  hasRaisedHand={meta.hasRaisedHand}
                  isLocal={false}
                />
              );
            })}

            {/* Speakers */}
            {speakers.map((participant) => {
              const audioPub = participant.audioTrackPublications.values().next().value;
              const meta = participant.metadata ? JSON.parse(participant.metadata) : {};
              const participantMuted = audioPub?.isMuted ?? false;
              const audioLevel = audioPub?.track && !audioPub.isMuted ? 0.3 : 0;
              const speaking = audioLevel > 0.1;

              return (
                <ClubSpacesParticipant
                  key={participant.identity}
                  identity={participant.identity}
                  name={participant.name || participant.identity}
                  role="speaker"
                  isMuted={participantMuted}
                  isSpeaking={speaking}
                  audioLevel={audioLevel}
                  hasRaisedHand={meta.hasRaisedHand}
                  isLocal={false}
                />
              );
            })}
          </div>
        </motion.section>

        {/* Divider if there are listeners */}
        {listeners.length > 0 && (
          <div className="mx-4 mt-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-[10px] text-white/20 uppercase tracking-widest font-medium">Listeners</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
          </div>
        )}

        {/* Audience - Listeners */}
        {listeners.length > 0 && (
          <section className="px-4 py-2">
            <div className="flex flex-wrap gap-4 justify-center">
              {listeners.map((participant) => {
                const meta = participant.metadata ? JSON.parse(participant.metadata) : {};
                return (
                  <ClubSpacesParticipant
                    key={participant.identity}
                    identity={participant.identity}
                    name={participant.name || participant.identity}
                    role="listener"
                    isMuted={true}
                    isSpeaking={false}
                    audioLevel={0}
                    hasRaisedHand={meta.hasRaisedHand}
                    isLocal={false}
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Reactions Overlay */}
      <AnimatePresence>
        {reactions.length > 0 && (
          <motion.div
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {reactions.map((reaction, i) => (
              <motion.div
                key={i}
                className="text-4xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                {reaction.emoji}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Sidebar */}
      <AnimatePresence>
        {showChat && (
          <ClubSpacesChat
            messages={chatMessages}
            onSendMessage={sendChatMessage}
            onClose={() => setShowChat(false)}
          />
        )}
      </AnimatePresence>

      {/* Bottom Controls - Clubhouse style */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-black/90 backdrop-blur-xl border-t border-white/[0.06]"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {/* Leave button */}
          <button
            onClick={onLeave}
            className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/10 text-white/60 hover:text-white rounded-full text-sm font-medium transition-all flex items-center gap-2 border border-white/[0.06]"
          >
            <LogOut className="w-4 h-4" />
            Leave
          </button>

          {/* Center controls */}
          <div className="flex items-center gap-3">
            {/* Quick Reactions */}
            {['👍', '❤️', '🔥'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => sendReaction(emoji)}
                className="w-10 h-10 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-lg flex items-center justify-center transition-all border border-white/[0.06]"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Chat */}
            <button
              onClick={() => setShowChat(!showChat)}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                showChat
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/[0.04] text-white/50 hover:text-white border border-white/[0.06]'
              )}
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* Mic / Hand */}
            {isSpeaker ? (
              <button
                onClick={toggleMute}
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                  isMuted
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-amber-500 text-black shadow-sm'
                )}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            ) : (
              <button
                onClick={raiseHand}
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                  hasRaisedHand
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'bg-white/[0.04] text-white/50 hover:text-white border border-white/[0.06]'
                )}
              >
                <Hand className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
