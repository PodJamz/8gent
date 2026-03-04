/**
 * Onboarding Music Generation
 *
 * Generates a personalized welcome song during user onboarding.
 * Uses ACE-Step to create a short, welcoming tune with the user's name.
 */

import type { MusicGenerateParams } from '@/hooks/useMusicGeneration';

/**
 * Generate parameters for a personalized welcome song
 */
export function getWelcomeSongParams(userName: string): MusicGenerateParams {
  // Create personalized lyrics with the user's name
  const lyrics = `[Intro]
(soft electronic pads)

[Verse]
Welcome ${userName} to your digital home
A place where creativity can roam
Where AI and human dreams combine
To build something truly divine

[Chorus]
This is 8gent, this is your space
Where every idea finds its place
Let's create something beautiful today
Welcome ${userName}, come and play`;

  return {
    prompt: 'welcoming warm electronic music with soft synthesizer pads, gentle arpeggios, hopeful uplifting mood, clean modern production, major key, friendly and inviting atmosphere',
    lyrics,
    duration: 25, // Keep it short for onboarding
    bpm: 108,
    key: 'G major',
    timeSignature: '4/4',
    title: `Welcome to 8gent, ${userName}`,
  };
}

/**
 * Generate parameters for a podcast intro
 */
export function getPodcastIntroParams(podcastName?: string): MusicGenerateParams {
  return {
    prompt: 'professional podcast intro music, modern electronic with subtle bass, clean and crisp production, builds energy, confident and engaging',
    duration: 15,
    bpm: 120,
    key: 'C major',
    title: podcastName ? `${podcastName} Intro` : 'Podcast Intro',
  };
}

/**
 * Generate parameters for ambient background music
 */
export function getAmbientParams(mood: 'focus' | 'relax' | 'energy' = 'focus'): MusicGenerateParams {
  const moods = {
    focus: {
      prompt: 'ambient focus music, lo-fi textures, soft piano, gentle rain ambiance, warm and cozy, study music vibes',
      bpm: 70,
      key: 'D minor',
    },
    relax: {
      prompt: 'peaceful relaxation ambient, nature sounds, soft pads, meditation music, calming and serene',
      bpm: 60,
      key: 'A minor',
    },
    energy: {
      prompt: 'uplifting ambient electronic, bright arpeggios, optimistic mood, morning energy, inspiring',
      bpm: 90,
      key: 'E major',
    },
  };

  return {
    ...moods[mood],
    duration: 180,
    timeSignature: '4/4',
    title: `Ambient ${mood.charAt(0).toUpperCase() + mood.slice(1)}`,
  };
}

/**
 * Generate parameters for a celebration/achievement sound
 */
export function getCelebrationParams(): MusicGenerateParams {
  return {
    prompt: 'celebratory fanfare, triumphant brass, exciting achievement music, video game victory sound, major key resolution',
    duration: 10,
    bpm: 130,
    key: 'C major',
    title: 'Achievement Unlocked',
  };
}

/**
 * Cache key for storing onboarding music URL
 */
export const ONBOARDING_MUSIC_CACHE_KEY = 'jamos_welcome_music';

/**
 * Check if welcome music is cached
 */
export function getCachedWelcomeMusic(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ONBOARDING_MUSIC_CACHE_KEY);
}

/**
 * Cache welcome music URL
 */
export function cacheWelcomeMusic(audioUrl: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ONBOARDING_MUSIC_CACHE_KEY, audioUrl);
}

/**
 * Clear cached welcome music
 */
export function clearWelcomeMusicCache(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ONBOARDING_MUSIC_CACHE_KEY);
}
