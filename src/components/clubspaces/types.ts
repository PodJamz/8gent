/**
 * ClubSpaces Types
 * 
 * Based on research of Clubhouse and X Spaces features
 */

export type ParticipantRole = 'host' | 'co-host' | 'speaker' | 'listener';

export interface Participant {
  identity: string;
  name: string;
  role: ParticipantRole;
  isMuted: boolean;
  isSpeaking: boolean;
  audioLevel: number;
  hasRaisedHand: boolean;
  joinedAt: number;
}

export interface RoomMetadata {
  name: string;
  description?: string;
  topics?: string[]; // For discoverability (like X Spaces)
  isPublic: boolean;
  maxSpeakers?: number; // Default: 13 (like X Spaces: 1 host + 2 co-hosts + 10 speakers)
  hostIdentity: string;
  createdAt: number;
  scheduledFor?: number; // For scheduled rooms
}

export interface ChatMessage {
  id: string;
  participantIdentity: string;
  participantName: string;
  content: string;
  timestamp: number;
  type: 'text' | 'system'; // System messages for joins/leaves
}

export interface Reaction {
  emoji: string;
  participantIdentity: string;
  timestamp: number;
}
