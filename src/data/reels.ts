import type { Track } from './tracks';
import { tracks } from './tracks';

export interface VideoReel {
  id: string;
  title: string;
  description?: string;
  videoSrc: string;
  thumbnail?: string;
  track?: Track; // Optional background music
  creator: string;
  createdAt?: string;
  likes?: number;
  views?: number;
}

/**
 * Auto-generate reels from tracks that have visualVideo set.
 * This is the recommended way to create music-first reels:
 * 1. Add a short looping video URL to your track's `visualVideo` field
 * 2. The reel will automatically be created with the track as audio
 */
export function generateReelsFromTracks(trackList: Track[] = tracks): VideoReel[] {
  return trackList
    .filter((track) => track.visualVideo) // Only tracks with videos
    .map((track) => ({
      id: `track-${track.id}`,
      title: track.title,
      description: `${track.album} • ${track.artist}`,
      videoSrc: track.visualVideo!, // Short looping video
      thumbnail: track.albumArt,
      track: track, // Full audio track
      creator: track.artist,
      likes: 0,
      views: 0,
    }));
}

// Manual reels - music reels with visualizer (no videos yet)
// When visualVideo is added to tracks, they'll auto-generate via generateReelsFromTracks()
export const manualReels: VideoReel[] = [
  {
    id: '1',
    title: '8gent.app (Remix)',
    description: 'Singles • James Spalding',
    videoSrc: '', // Visualizer fallback
    thumbnail: 'https://2oczblkb3byymav8.public.blob.vercel-storage.com/employeeoftheyear.jpeg',
    track: tracks[0],
    creator: "James Spalding",
    likes: 42,
    views: 1337,
  },
  {
    id: '2',
    title: '8gent.app',
    description: 'Singles • James Spalding',
    videoSrc: '', // Visualizer fallback
    thumbnail: 'https://2oczblkb3byymav8.public.blob.vercel-storage.com/IMG_1312.jpeg',
    track: tracks[1],
    creator: "James Spalding",
    likes: 28,
    views: 892,
  },
  {
    id: '3',
    title: 'Humans Are Optional (Remastered)',
    description: 'Singles • James Spalding',
    videoSrc: '', // Visualizer fallback
    thumbnail: 'https://2oczblkb3byymav8.public.blob.vercel-storage.com/Humans%20are%20optional.png',
    track: tracks[2],
    creator: "James Spalding",
    likes: 64,
    views: 2048,
  },
];

// Combined reels: auto-generated from tracks + manual reels
export const reels: VideoReel[] = [
  ...generateReelsFromTracks(),
  ...manualReels,
];

// Helper to get a reel by ID
export function getReelById(id: string): VideoReel | undefined {
  return reels.find((r) => r.id === id);
}

// Helper to get next reel
export function getNextReel(currentId: string): VideoReel | undefined {
  const currentIndex = reels.findIndex((r) => r.id === currentId);
  if (currentIndex === -1 || currentIndex === reels.length - 1) {
    return reels[0];
  }
  return reels[currentIndex + 1];
}

// Helper to get previous reel
export function getPreviousReel(currentId: string): VideoReel | undefined {
  const currentIndex = reels.findIndex((r) => r.id === currentId);
  if (currentIndex === -1 || currentIndex === 0) {
    return reels[reels.length - 1];
  }
  return reels[currentIndex - 1];
}
