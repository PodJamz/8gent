'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useUser } from '@clerk/nextjs';
import { useConvex, useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';

// Track type matching the format from Convex
export interface PrivateTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  audioSrc: string;
  lyrics?: string;
  notes?: string;
}

interface CollaboratorInfo {
  id: string;
  displayName: string | undefined;
  email: string;
  role: 'collaborator' | 'admin' | 'owner' | 'viewer' | string;
}

interface PrivateMusicContextType {
  // Auth state (from Clerk)
  isSignedIn: boolean;
  isLoading: boolean;

  // Collaborator state (from Convex)
  isCollaborator: boolean;
  isAdmin: boolean;
  collaborator: CollaboratorInfo | null;

  // Tracks
  privateTracks: PrivateTrack[];
  isLoadingTracks: boolean;

  // For checking if user has private access
  hasPrivateAccess: boolean;
}

const PrivateMusicContext = createContext<PrivateMusicContextType | null>(null);

// Default values for when Convex isn't available (SSG/SSR)
const defaultValue: PrivateMusicContextType = {
  isSignedIn: false,
  isLoading: true,
  isCollaborator: false,
  isAdmin: false,
  collaborator: null,
  privateTracks: [],
  isLoadingTracks: false,
  hasPrivateAccess: false,
};

// Inner provider that uses Convex hooks
function PrivateMusicProviderInner({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded: isClerkLoaded } = useUser();

  // Query collaborator status from Convex (only when signed in)
  const collaboratorStatus = useQuery(
    api.privateMusic.getMyCollaboratorStatus,
    isSignedIn ? {} : 'skip'
  );

  // Query private tracks (only when user is a collaborator)
  const privateTracks = useQuery(
    api.privateMusic.getMyPrivateTracks,
    collaboratorStatus?.isCollaborator ? {} : 'skip'
  );

  // Link collaborator account on first sign-in (if email matches pending invite)
  const linkAccount = useMutation(api.privateMusic.linkCollaboratorAccount);

  useEffect(() => {
    if (isSignedIn && collaboratorStatus && !collaboratorStatus.isCollaborator) {
      // Try to link account in case this is a pending collaborator signing in
      linkAccount().catch(() => {
        // Silently fail - user just isn't a collaborator
      });
    }
  }, [isSignedIn, collaboratorStatus, linkAccount]);

  const isLoading = !isClerkLoaded || (isSignedIn && collaboratorStatus === undefined);
  const isLoadingTracks = collaboratorStatus?.isCollaborator && privateTracks === undefined;

  const value: PrivateMusicContextType = {
    isSignedIn: !!isSignedIn,
    isLoading,
    isCollaborator: collaboratorStatus?.isCollaborator ?? false,
    isAdmin: collaboratorStatus?.isAdmin ?? false,
    collaborator: collaboratorStatus?.collaborator ?? null,
    privateTracks: (privateTracks as PrivateTrack[]) ?? [],
    isLoadingTracks: !!isLoadingTracks,
    hasPrivateAccess: !!collaboratorStatus?.isCollaborator,
  };

  return (
    <PrivateMusicContext.Provider value={value}>
      {children}
    </PrivateMusicContext.Provider>
  );
}

// Outer provider that checks if Convex is available
export function PrivateMusicProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR/SSG, render with default values
  if (!isMounted) {
    return (
      <PrivateMusicContext.Provider value={defaultValue}>
        {children}
      </PrivateMusicContext.Provider>
    );
  }

  // On client, use the inner provider with Convex hooks
  return <PrivateMusicProviderInner>{children}</PrivateMusicProviderInner>;
}

export function usePrivateMusic() {
  const context = useContext(PrivateMusicContext);
  if (!context) {
    throw new Error('usePrivateMusic must be used within a PrivateMusicProvider');
  }
  return context;
}
