/**
 * Theme to Soundtrack Mapping
 *
 * Pairs themes with songs from the public playlist.
 * Each theme can have an optional soundtrack that matches its vibe.
 */

import { type ThemeName } from '@/lib/themes/definitions';
import { tracks, type Track } from '@/data/tracks';

// Theme to track ID mapping
// Tracks: 1=Claudebusters, 2=OpenClaw (Remix), 3=OpenClaw, 4=Humans Are Optional
const THEME_SOUNDTRACK_MAP: Partial<Record<ThemeName, string>> = {
  // Claudebusters - warm, AI-themed, upbeat
  'claude': '1',
  'northern-lights': '1',
  'sunset-horizon': '1',
  'caffeine': '1',
  'mocha-mousse': '1',

  // OpenClaw (Remix) - energetic, tech, futuristic
  'cyberpunk': '2',
  'retro-arcade': '2',
  'bold-tech': '2',
  't3-chat': '2',

  // OpenClaw - clean, modern, tech
  'base': '3',
  'vercel': '3',
  'modern-minimal': '3',
  'clean-slate': '3',
  'chatgpt': '3',

  // Humans Are Optional - dark, dramatic, intense
  'doom-64': '4',
  'neo-brutalism': '4',
  'cosmic-night': '4',
  'solar-dusk': '4',
  'starry-night': '4',
};

/**
 * Get the soundtrack for a theme
 */
export function getThemeSoundtrack(themeName: ThemeName): Track | undefined {
  const trackId = THEME_SOUNDTRACK_MAP[themeName];
  if (!trackId) return undefined;
  return tracks.find(t => t.id === trackId);
}

/**
 * Check if a theme has a soundtrack
 */
export function hasThemeSoundtrack(themeName: ThemeName): boolean {
  return themeName in THEME_SOUNDTRACK_MAP;
}

/**
 * Get all themes with soundtracks
 */
export function getThemesWithSoundtracks(): ThemeName[] {
  return Object.keys(THEME_SOUNDTRACK_MAP) as ThemeName[];
}

/**
 * Get theme-track pairings for display
 */
export interface ThemeTrackPairing {
  theme: ThemeName;
  track: Track;
}

export function getAllThemeTrackPairings(): ThemeTrackPairing[] {
  const pairings: ThemeTrackPairing[] = [];

  for (const [theme, trackId] of Object.entries(THEME_SOUNDTRACK_MAP)) {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      pairings.push({ theme: theme as ThemeName, track });
    }
  }

  return pairings;
}
