'use client';

import { Room } from 'livekit-client';
import { Mic, MicOff, UserPlus, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClubSpacesHostControlsProps {
  room: Room | null;
  onPromoteToSpeaker: (identity: string) => void;
  onMuteParticipant: (identity: string) => void;
  onClose: () => void;
}

export function ClubSpacesHostControls({
  room,
  onPromoteToSpeaker,
  onMuteParticipant,
  onClose,
}: ClubSpacesHostControlsProps) {
  if (!room) return null;

  const listenersWithHands = Array.from(room.remoteParticipants.values()).filter((p) => {
    const meta = p.metadata ? JSON.parse(p.metadata) : {};
    return (meta.role === 'listener' || !meta.role) && meta.hasRaisedHand === true;
  });

  const allParticipants = Array.from(room.remoteParticipants.values());

  return (
    <motion.div
      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Host Controls</h3>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-white/30 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Raised Hands */}
      {listenersWithHands.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-white/30 uppercase tracking-wider mb-2">Raised Hands</h4>
          <div className="space-y-1.5">
            {listenersWithHands.map((participant) => (
              <div
                key={participant.identity}
                className="flex items-center justify-between p-2.5 bg-white/[0.03] rounded-lg border border-white/[0.04]"
              >
                <span className="text-sm text-white/80">
                  {participant.name || participant.identity}
                </span>
                <button
                  onClick={() => onPromoteToSpeaker(participant.identity)}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                >
                  <UserPlus className="w-3 h-3" />
                  Promote
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Participants */}
      <div>
        <h4 className="text-xs font-medium text-white/30 uppercase tracking-wider mb-2">Participants</h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {allParticipants.map((participant) => {
            const meta = participant.metadata ? JSON.parse(participant.metadata) : {};
            const audioTrack = participant.audioTrackPublications.values().next().value?.track;
            const isMuted = audioTrack?.isMuted ?? false;

            return (
              <div
                key={participant.identity}
                className="flex items-center justify-between p-2.5 bg-white/[0.03] rounded-lg border border-white/[0.04]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/80">
                    {participant.name || participant.identity}
                  </span>
                  {meta.role && (
                    <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] rounded font-medium uppercase">
                      {meta.role}
                    </span>
                  )}
                </div>
                <div className="flex gap-1.5">
                  {meta.role === 'listener' && (
                    <button
                      onClick={() => onPromoteToSpeaker(participant.identity)}
                      className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs rounded-lg transition-colors"
                    >
                      Promote
                    </button>
                  )}
                  {meta.role === 'speaker' && (
                    <button
                      onClick={() => onMuteParticipant(participant.identity)}
                      className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition-colors flex items-center gap-1"
                    >
                      {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
