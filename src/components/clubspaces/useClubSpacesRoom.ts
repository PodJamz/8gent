'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Room, RoomEvent, Track, RemoteParticipant, LocalAudioTrack, createLocalAudioTrack } from 'livekit-client';
import type { Participant, ParticipantRole, RoomMetadata, ChatMessage, Reaction } from './types';

const LOG_PREFIX = '[ClubSpaces]';
const log = {
  info: (msg: string, data?: unknown) => console.log(`${LOG_PREFIX} ${msg}`, data ?? ''),
  error: (msg: string, data?: unknown) => console.error(`${LOG_PREFIX} ${msg}`, data ?? ''),
};

export function useClubSpacesRoom() {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [localParticipant, setLocalParticipant] = useState<Participant | null>(null);
  const [roomMetadata, setRoomMetadata] = useState<RoomMetadata | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [localRole, setLocalRole] = useState<ParticipantRole>('listener');
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  
  const roomRef = useRef<Room | null>(null);
  const localAudioTrackRef = useRef<LocalAudioTrack | null>(null);
  const audioLevelIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update audio levels periodically
  useEffect(() => {
    if (!room || !isConnected) {
      if (audioLevelIntervalRef.current) {
        clearInterval(audioLevelIntervalRef.current);
        audioLevelIntervalRef.current = null;
      }
      return;
    }

    audioLevelIntervalRef.current = setInterval(() => {
      const updatedParticipants = new Map<string, Participant>();

      // Local participant
      const local = room.localParticipant;
      if (local) {
        const localAudioPub = local.audioTrackPublications.values().next().value;
        // Use a default audio level since getStats() is not available on Track
        const audioLevel = localAudioPub?.track && !localAudioPub.isMuted ? 0.3 : 0;
        
        updatedParticipants.set(local.identity, {
          identity: local.identity,
          name: local.name || 'You',
          role: localRole,
          isMuted: localAudioPub?.isMuted ?? false,
          isSpeaking: audioLevel > 0.1,
          audioLevel,
          hasRaisedHand,
          joinedAt: Date.now(), // Approximate
        });
      }

      // Remote participants
      room.remoteParticipants.forEach((participant) => {
        const audioPub = participant.audioTrackPublications.values().next().value;
        // Use a default audio level since getStats() is not available on Track
        const audioLevel = audioPub?.track && !audioPub.isMuted ? 0.3 : 0;
        
        // Get role from metadata or default to listener
        const role = (participant.metadata ? JSON.parse(participant.metadata).role : 'listener') as ParticipantRole;
        const hasRaisedHand = participant.metadata ? JSON.parse(participant.metadata).hasRaisedHand === true : false;
        
        updatedParticipants.set(participant.identity, {
          identity: participant.identity,
          name: participant.name || participant.identity,
          role,
          isMuted: audioPub?.isMuted ?? false,
          isSpeaking: audioLevel > 0.1,
          audioLevel,
          hasRaisedHand,
          joinedAt: participant.joinedAt?.getTime() ?? Date.now(),
        });
      });

      setParticipants(updatedParticipants);

      // Update local participant
      const localData = updatedParticipants.get(room.localParticipant.identity);
      if (localData) setLocalParticipant(localData);
    }, 100); // Update every 100ms

    return () => {
      if (audioLevelIntervalRef.current) {
        clearInterval(audioLevelIntervalRef.current);
        audioLevelIntervalRef.current = null;
      }
    };
  }, [room, isConnected, localRole, hasRaisedHand]);

  const connect = useCallback(async (
    roomName: string, 
    role: ParticipantRole = 'listener',
    metadata?: Partial<RoomMetadata>
  ) => {
    try {
      log.info('Connecting to room', { roomName, role });

      setLocalRole(role);
      
      // Request token (API will use Clerk auth if available)
      const tokenResponse = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName,
          // participantName and participantIdentity are optional - API will use Clerk if available
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token generation failed: ${tokenResponse.statusText}`);
      }

      const { token, url } = await tokenResponse.json();

      // Create room
      const newRoom = new Room();
      roomRef.current = newRoom;

      // Set up event handlers
      newRoom.on(RoomEvent.Connected, () => {
        log.info('Room connected');
        setIsConnected(true);
        setRoom(newRoom);
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        log.info('Room disconnected');
        setIsConnected(false);
        setRoom(null);
        setParticipants(new Map());
        setLocalParticipant(null);
      });

      newRoom.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        log.info('Participant connected', { identity: participant.identity });
        // Participants map will be updated by audio level interval
        // TODO: Call updateParticipantCount mutation to sync with Convex
      });

      newRoom.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
        log.info('Participant disconnected', { identity: participant.identity });
        setParticipants((prev) => {
          const updated = new Map(prev);
          updated.delete(participant.identity);
          return updated;
        });
        // TODO: Call updateParticipantCount mutation to sync with Convex
      });

      newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        log.info('Track subscribed', { kind: track.kind, participant: participant.identity });
      });

      // Connect to room
      await newRoom.connect(url, token);

      // Set local participant metadata
      await newRoom.localParticipant.setMetadata(JSON.stringify({
        role,
        hasRaisedHand: false,
      }));

      // Set room metadata if host
      if (role === 'host' && metadata) {
        const roomMeta: RoomMetadata = {
          name: roomName,
          description: metadata.description,
          topics: metadata.topics,
          isPublic: metadata.isPublic ?? true,
          maxSpeakers: metadata.maxSpeakers ?? 13, // X Spaces default: 13 speakers
          hostIdentity: newRoom.localParticipant.identity,
          createdAt: Date.now(),
          scheduledFor: metadata.scheduledFor,
        };
        setRoomMetadata(roomMeta);
        
        // Store in room data channel or metadata
        await newRoom.localParticipant.publishData(
          new TextEncoder().encode(JSON.stringify({ type: 'room_metadata', data: roomMeta })),
          { reliable: true }
        );
      }

      // Listen for room metadata updates
      newRoom.on(RoomEvent.DataReceived, (payload, participant) => {
        try {
          const data = JSON.parse(new TextDecoder().decode(payload));
          if (data.type === 'room_metadata') {
            setRoomMetadata(data.data);
          } else if (data.type === 'chat_message') {
            setChatMessages((prev) => [...prev, data.data]);
          } else if (data.type === 'reaction') {
            setReactions((prev) => [...prev, data.data]);
          } else if (data.type === 'role_update') {
            // Update participant role
            if (data.identity === newRoom.localParticipant.identity) {
              setLocalRole(data.role);
            }
          }
        } catch (e) {
          // Ignore invalid JSON
        }
      });

      // Create and publish local audio track (only if speaker/host/co-host)
      if (role !== 'listener') {
        const localAudioTrack = await createLocalAudioTrack({
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        });
        localAudioTrackRef.current = localAudioTrack;

        await newRoom.localParticipant.publishTrack(localAudioTrack, {
          source: Track.Source.Microphone,
        });
        log.info('Local audio track published');
      } else {
        // Listeners start muted
        log.info('Joined as listener (no audio track)');
      }
    } catch (error) {
      log.error('Connection failed', error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(async () => {
    log.info('Disconnecting from room');
    
    if (audioLevelIntervalRef.current) {
      clearInterval(audioLevelIntervalRef.current);
      audioLevelIntervalRef.current = null;
    }

    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.stop();
      localAudioTrackRef.current = null;
    }

    if (roomRef.current) {
      await roomRef.current.disconnect();
      roomRef.current = null;
    }

    setIsConnected(false);
    setRoom(null);
    setParticipants(new Map());
    setLocalParticipant(null);
  }, []);

  const toggleMute = useCallback(() => {
    const localTrack = localAudioTrackRef.current;
    if (localTrack) {
      if (localTrack.isMuted) {
        localTrack.unmute();
      } else {
        localTrack.mute();
      }
    }
  }, []);

  const raiseHand = useCallback(async () => {
    if (!room) return;
    
    const newRaisedHand = !hasRaisedHand;
    setHasRaisedHand(newRaisedHand);
    
    // Update metadata
    await room.localParticipant.setMetadata(JSON.stringify({
      role: localRole,
      hasRaisedHand: newRaisedHand,
    }));
    
    // Notify host via data channel
    if (newRaisedHand) {
      await room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify({
          type: 'hand_raised',
          identity: room.localParticipant.identity,
          name: room.localParticipant.name,
        })),
        { reliable: true }
      );
    }
  }, [room, hasRaisedHand, localRole]);

  const sendChatMessage = useCallback(async (content: string) => {
    if (!room || !content.trim()) return;
    
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      participantIdentity: room.localParticipant.identity,
      participantName: room.localParticipant.name || 'You',
      content: content.trim(),
      timestamp: Date.now(),
      type: 'text',
    };
    
    // Add to local state immediately
    setChatMessages((prev) => [...prev, message]);
    
    // Broadcast to room
    await room.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify({
        type: 'chat_message',
        data: message,
      })),
      { reliable: true }
    );
  }, [room]);

  const sendReaction = useCallback(async (emoji: string) => {
    if (!room) return;
    
    const reaction: Reaction = {
      emoji,
      participantIdentity: room.localParticipant.identity,
      timestamp: Date.now(),
    };
    
    // Add to local state
    setReactions((prev) => [...prev, reaction]);
    
    // Broadcast to room
    await room.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify({
        type: 'reaction',
        data: reaction,
      })),
      { reliable: true }
    );
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.timestamp !== reaction.timestamp));
    }, 3000);
  }, [room]);

  // Host controls
  const promoteToSpeaker = useCallback(async (participantIdentity: string) => {
    if (!room || (localRole !== 'host' && localRole !== 'co-host')) return;
    
    // Send role update via data channel
    await room.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify({
        type: 'role_update',
        identity: participantIdentity,
        role: 'speaker',
      })),
      { reliable: true }
    );
  }, [room, localRole]);

  const muteParticipant = useCallback(async (participantIdentity: string) => {
    if (!room || (localRole !== 'host' && localRole !== 'co-host')) return;
    
    // Find participant and mute their track
    const participant = room.remoteParticipants.get(participantIdentity);
    if (participant) {
      const audioTrack = participant.audioTrackPublications.values().next().value?.track;
      if (audioTrack) {
        // Note: LiveKit doesn't support remote muting directly
        // We'd need to use data channel to request mute
        await room.localParticipant.publishData(
          new TextEncoder().encode(JSON.stringify({
            type: 'mute_request',
            identity: participantIdentity,
          })),
          { reliable: true }
        );
      }
    }
  }, [room, localRole]);

  return {
    room,
    isConnected,
    participants: Array.from(participants.values()),
    localParticipant,
    localRole,
    roomMetadata,
    chatMessages,
    reactions,
    hasRaisedHand,
    connect,
    disconnect,
    toggleMute,
    raiseHand,
    sendChatMessage,
    sendReaction,
    promoteToSpeaker,
    muteParticipant,
  };
}
