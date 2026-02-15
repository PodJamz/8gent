export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string; // URL to album art (Vercel Blob or /public)
  audioSrc: string; // URL to audio file (Vercel Blob or /public)
  visualVideo?: string; // Short looping video for this track (portrait 9:16)
  lyrics?: string;
  duration?: number; // in seconds, optional - player will detect
}

// Helper to check if a track is a video (MP4)
export function isVideoTrack(track: Track): boolean {
  return track.audioSrc.toLowerCase().endsWith('.mp4');
}

// Default placeholder tracks - replace with your actual tracks
// Audio files can be stored in Vercel Blob (upload via /vault/upload)
// or in the /public folder for static files
export const tracks: Track[] = [
  {
    id: "2",
    title: "8gent.app (Remix)",
    artist: "James Spalding",
    album: "Singles",
    albumArt: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/employeeoftheyear.jpeg",
    audioSrc: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/8gent.app%282%29.mp3",
    lyrics: ``,
  },
  {
    id: "3",
    title: "8gent.app",
    artist: "James Spalding",
    album: "Singles",
    albumArt: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/IMG_1312.jpeg",
    audioSrc: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/8gent.app.mp3",
    lyrics: ``,
  },
  {
    id: "4",
    title: "Humans Are Optional (Remastered)",
    artist: "James Spalding",
    album: "Singles",
    albumArt: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/Humans%20are%20optional.png",
    audioSrc: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/Humans%20are%20optional%20%28Remastered%29.mp3",
    lyrics: ``,
  },
  {
    id: "5",
    title: "URKIL",
    artist: "Jafaris",
    album: "Heroes",
    albumArt: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/employeeoftheyear.jpeg",
    audioSrc: "https://2oczblkb3byymav8.public.blob.vercel-storage.com/Heroes/Jafaris%20-%20URKIL%20%28PROD.ree%CC%81mdolla%29.mp4",
    lyrics: ``,
  },
];

// Helper to get a track by ID
export function getTrackById(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

// Helper to get next track
export function getNextTrack(currentId: string): Track | undefined {
  const currentIndex = tracks.findIndex((t) => t.id === currentId);
  if (currentIndex === -1 || currentIndex === tracks.length - 1) {
    return tracks[0]; // Loop back to first
  }
  return tracks[currentIndex + 1];
}

// Helper to get previous track
export function getPreviousTrack(currentId: string): Track | undefined {
  const currentIndex = tracks.findIndex((t) => t.id === currentId);
  if (currentIndex === -1 || currentIndex === 0) {
    return tracks[tracks.length - 1]; // Loop to last
  }
  return tracks[currentIndex - 1];
}
