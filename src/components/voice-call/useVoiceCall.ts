'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Room, RoomEvent, Track, RemoteParticipant, LocalAudioTrack, createLocalAudioTrack } from 'livekit-client';

export type CallStatus = 'idle' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'thinking' | 'ending';

// Debug logging utility
const LOG_PREFIX = '[VoiceCall]';
const log = {
  info: (msg: string, data?: unknown) => console.log(`${LOG_PREFIX} ${msg}`, data ?? ''),
  warn: (msg: string, data?: unknown) => console.warn(`${LOG_PREFIX} ${msg}`, data ?? ''),
  error: (msg: string, data?: unknown) => console.error(`${LOG_PREFIX} ${msg}`, data ?? ''),
  state: (status: CallStatus, extra?: Record<string, unknown>) =>
    console.log(`${LOG_PREFIX} [STATE] ${status}`, extra ?? ''),
};

interface VoiceCallState {
  status: CallStatus;
  duration: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  userAudioLevels: number[];
  aiAudioLevels: number[];
  error: string | null;
}

interface VoiceCallActions {
  startCall: () => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
}

interface UseVoiceCallOptions {
  onCallStart?: () => void;
  onCallEnd?: (duration: number) => void;
  onError?: (error: string) => void;
}

const INITIAL_STATE: VoiceCallState = {
  status: 'idle',
  duration: 0,
  isMuted: false,
  isSpeakerOn: true,
  userAudioLevels: [],
  aiAudioLevels: [],
  error: null,
};

export function useVoiceCall(options: UseVoiceCallOptions = {}): [VoiceCallState, VoiceCallActions] {
  const { onCallStart, onCallEnd, onError } = options;

  const [state, setState] = useState<VoiceCallState>(INITIAL_STATE);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioLevelIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const roomRef = useRef<Room | null>(null);
  const localAudioTrackRef = useRef<LocalAudioTrack | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Cleanup function
  const cleanup = useCallback(async () => {
    log.info('cleanup() - disconnecting from room and clearing intervals');

    // Clear intervals
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
      log.info('Duration interval cleared');
    }
    if (audioLevelIntervalRef.current) {
      clearInterval(audioLevelIntervalRef.current);
      audioLevelIntervalRef.current = null;
      log.info('Audio level interval cleared');
    }

    // Disconnect from room
    if (roomRef.current) {
      await roomRef.current.disconnect();
      roomRef.current = null;
      log.info('Room disconnected');
    }

    // Clean up local audio track
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.stop();
      localAudioTrackRef.current = null;
      log.info('Local audio track stopped');
    }

    // Clean up audio context
    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
      analyserRef.current = null;
      log.info('Audio context closed');
    }
  }, []);

  // Start duration timer
  const startDurationTimer = useCallback(() => {
    durationIntervalRef.current = setInterval(() => {
      setState(prev => ({ ...prev, duration: prev.duration + 1 }));
    }, 1000);
  }, []);

  // Monitor audio levels from WebRTC tracks
  const startAudioLevelMonitoring = useCallback(() => {
    audioLevelIntervalRef.current = setInterval(() => {
      const room = roomRef.current;
      if (!room) return;

      // Get user's local audio level
      const localParticipant = room.localParticipant;
      const localAudioTrack = localParticipant?.audioTrackPublications.values().next().value?.track;
      let userLevels: number[] = [];

      if (localAudioTrack && analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        // Convert to 16 bars
        userLevels = Array.from({ length: 16 }, (_, i) => {
          const index = Math.floor((i / 16) * dataArray.length);
          return dataArray[index] / 255;
        });
      }

      // Get AI agent's audio level
      const remoteParticipants = Array.from(room.remoteParticipants.values());
      const aiParticipant = remoteParticipants.find(p => p.identity === 'claw-ai-agent');
      let aiLevels: number[] = [];

      if (aiParticipant) {
        const aiAudioPub = aiParticipant.audioTrackPublications.values().next().value;
        if (aiAudioPub?.track && !aiAudioPub.isMuted) {
          // Use a pulsing effect for AI audio since we can't easily get levels from remote tracks
          const time = Date.now() / 1000;
          const pulse = (Math.sin(time * 4) + 1) / 4 + 0.3; // Gentle pulse between 0.3-0.8
          aiLevels = Array(16).fill(pulse);
        }
      }

      setState(prev => ({
        ...prev,
        userAudioLevels: userLevels,
        aiAudioLevels: aiLevels,
      }));
    }, 50);
  }, []);

  // Start call
  const startCall = useCallback(async () => {
    log.info('startCall() initiated');
    try {
      setState(prev => ({ ...prev, status: 'connecting', error: null }));
      log.state('connecting');

      // Generate room name (unique per call)
      const roomName = `voice-call-${Date.now()}`;
      const participantName = 'User';
      const participantIdentity = `user-${Date.now()}`;

      // Request access token from API
      log.info('Requesting LiveKit token', { roomName, participantName });
      const tokenResponse = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName,
          participantName,
          participantIdentity,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token generation failed: ${tokenResponse.statusText}`);
      }

      const { token, url } = await tokenResponse.json();
      log.info('Token received', { url });

      // Create LiveKit room
      const room = new Room();
      roomRef.current = room;

      // Set up event handlers
      room.on(RoomEvent.Connected, () => {
        log.info('Room connected');
        setState(prev => ({ ...prev, status: 'connected' }));
        log.state('connected');
        startDurationTimer();
        startAudioLevelMonitoring();
        onCallStart?.();
      });

      room.on(RoomEvent.Disconnected, () => {
        log.info('Room disconnected');
        cleanup();
      });

      room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        log.info('Participant connected', { identity: participant.identity });
        if (participant.identity === 'claw-ai-agent') {
          setState(prev => ({ ...prev, status: 'listening' }));
          log.state('listening', { reason: 'AI agent joined' });
        }
      });

      room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        log.info('Track subscribed', {
          kind: track.kind,
          participant: participant.identity
        });

        if (track.kind === 'audio' && participant.identity === 'claw-ai-agent') {
          // AI agent is speaking
          setState(prev => ({ ...prev, status: 'speaking' }));
          log.state('speaking', { reason: 'AI audio track active' });
        }
      });

      room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
        log.info('Track unsubscribed', {
          kind: track.kind,
          participant: participant.identity
        });

        if (track.kind === 'audio' && participant.identity === 'claw-ai-agent') {
          // AI agent stopped speaking
          setState(prev => ({ ...prev, status: 'listening' }));
          log.state('listening', { reason: 'AI audio track inactive' });
        }
      });

      // Create local audio track
      log.info('Creating local audio track');
      const localAudioTrack = await createLocalAudioTrack({
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      });
      localAudioTrackRef.current = localAudioTrack;

      // Set up audio level analysis
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(localAudioTrack.mediaStream!);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 32; // 16 bars
      source.connect(analyser);
      analyserRef.current = analyser;

      // Connect to room
      log.info('Connecting to LiveKit room', { url, roomName });
      await room.connect(url, token);

      // Publish local audio track
      await room.localParticipant.publishTrack(localAudioTrack, {
        source: Track.Source.Microphone,
      });
      log.info('Local audio track published');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect';
      log.error('startCall failed', { error: errorMessage });
      setState(prev => ({ ...prev, status: 'idle', error: errorMessage }));
      await cleanup();
      onError?.(errorMessage);
    }
  }, [startDurationTimer, startAudioLevelMonitoring, onCallStart, onError, cleanup]);

  // End call
  const endCall = useCallback(async () => {
    const finalDuration = state.duration;
    log.info('endCall() initiated', { finalDuration });
    setState(prev => ({ ...prev, status: 'ending' }));
    log.state('ending');

    await cleanup();
    log.info('Cleanup complete, scheduling state reset (1500ms)');

    setTimeout(() => {
      setState(INITIAL_STATE);
      log.state('idle', { reason: 'call ended', totalDuration: finalDuration });
      onCallEnd?.(finalDuration);
    }, 1500);
  }, [state.duration, cleanup, onCallEnd]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const room = roomRef.current;
    const localAudioTrack = localAudioTrackRef.current;

    if (room && localAudioTrack) {
      const newMuted = !state.isMuted;
      log.info('toggleMute', { isMuted: newMuted });

      // Mute/unmute the track
      if (newMuted) {
        localAudioTrack.mute();
      } else {
        localAudioTrack.unmute();
      }

      setState(prev => ({ ...prev, isMuted: newMuted }));
    } else {
      // Fallback to state-only toggle if room not connected
      setState(prev => {
        const newMuted = !prev.isMuted;
        log.info('toggleMute (fallback)', { isMuted: newMuted });
        return { ...prev, isMuted: newMuted };
      });
    }
  }, [state.isMuted]);

  // Toggle speaker
  const toggleSpeaker = useCallback(() => {
    const room = roomRef.current;

    if (room) {
      const newSpeakerOn = !state.isSpeakerOn;
      log.info('toggleSpeaker', { isSpeakerOn: newSpeakerOn });

      // Enable/disable audio output for remote participants
      // Note: setVolume is not available on RemoteTrack, so we toggle the track enabled state
      room.remoteParticipants.forEach((participant) => {
        participant.audioTrackPublications.forEach((publication) => {
          if (publication.track) {
            // Access the underlying media element if attached
            const attachedElements = publication.track.attachedElements;
            if (attachedElements && attachedElements.length > 0) {
              attachedElements.forEach((el) => {
                if (el instanceof HTMLAudioElement || el instanceof HTMLVideoElement) {
                  el.muted = !newSpeakerOn;
                }
              });
            }
          }
        });
      });

      setState(prev => ({ ...prev, isSpeakerOn: newSpeakerOn }));
    } else {
      // Fallback to state-only toggle if room not connected
      setState(prev => {
        const newSpeakerOn = !prev.isSpeakerOn;
        log.info('toggleSpeaker (fallback)', { isSpeakerOn: newSpeakerOn });
        return { ...prev, isSpeakerOn: newSpeakerOn };
      });
    }
  }, [state.isSpeakerOn]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Wrap async cleanup in void function for useEffect compatibility
      void cleanup();
    };
  }, [cleanup]);

  const actions: VoiceCallActions = {
    startCall,
    endCall,
    toggleMute,
    toggleSpeaker,
  };

  return [state, actions];
}

export default useVoiceCall;
