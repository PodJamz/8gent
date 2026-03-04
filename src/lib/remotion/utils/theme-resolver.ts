/**
 * Theme Resolver for Remotion
 *
 * Remotion renders videos in isolation without access to CSS variables.
 * This utility extracts theme colors as actual HSL strings that can be
 * passed as props to Remotion compositions.
 */

import { themes, type ThemeName } from '@/lib/themes/definitions';

// =============================================================================
// Theme Color Types
// =============================================================================

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  ring: string;
  font: string;
  fontHeading: string;
}

// =============================================================================
// Theme Definitions (mirroring themes.css)
// =============================================================================

const THEME_COLORS: Partial<Record<ThemeName, ThemeColors>> = {
  utilitarian: {
    background: 'hsl(45 30% 92%)',
    foreground: 'hsl(0 0% 0%)',
    card: 'hsl(45 35% 95%)',
    cardForeground: 'hsl(0 0% 0%)',
    primary: 'hsl(15 85% 55%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(45 20% 85%)',
    secondaryForeground: 'hsl(0 0% 0%)',
    muted: 'hsl(45 15% 88%)',
    mutedForeground: 'hsl(0 0% 35%)',
    accent: 'hsl(15 85% 55%)',
    accentForeground: 'hsl(0 0% 100%)',
    border: 'hsl(0 0% 0%)',
    ring: 'hsl(15 85% 55%)',
    font: '"SF Mono", "Fira Code", monospace',
    fontHeading: 'system-ui, sans-serif',
  },
  base: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 84% 4.9%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(222.2 84% 4.9%)',
    primary: 'hsl(222.2 47.4% 11.2%)',
    primaryForeground: 'hsl(210 40% 98%)',
    secondary: 'hsl(210 40% 96.1%)',
    secondaryForeground: 'hsl(222.2 47.4% 11.2%)',
    muted: 'hsl(210 40% 96.1%)',
    mutedForeground: 'hsl(215.4 16.3% 46.9%)',
    accent: 'hsl(210 40% 96.1%)',
    accentForeground: 'hsl(222.2 47.4% 11.2%)',
    border: 'hsl(214.3 31.8% 91.4%)',
    ring: 'hsl(222.2 84% 4.9%)',
    font: 'Inter, system-ui, sans-serif',
    fontHeading: 'Inter, system-ui, sans-serif',
  },
  claude: {
    background: 'hsl(30 20% 98%)',
    foreground: 'hsl(20 14% 10%)',
    card: 'hsl(30 30% 96%)',
    cardForeground: 'hsl(20 14% 10%)',
    primary: 'hsl(24 90% 55%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(30 20% 90%)',
    secondaryForeground: 'hsl(20 14% 20%)',
    muted: 'hsl(30 15% 92%)',
    mutedForeground: 'hsl(20 10% 40%)',
    accent: 'hsl(24 80% 60%)',
    accentForeground: 'hsl(0 0% 100%)',
    border: 'hsl(30 20% 85%)',
    ring: 'hsl(24 90% 55%)',
    font: '"Söhne", system-ui, sans-serif',
    fontHeading: '"Söhne", system-ui, sans-serif',
  },
  chatgpt: {
    background: 'hsl(0 0% 98%)',
    foreground: 'hsl(0 0% 10%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(0 0% 10%)',
    primary: 'hsl(161 23% 45%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(0 0% 94%)',
    secondaryForeground: 'hsl(0 0% 20%)',
    muted: 'hsl(0 0% 92%)',
    mutedForeground: 'hsl(0 0% 40%)',
    accent: 'hsl(161 23% 45%)',
    accentForeground: 'hsl(0 0% 100%)',
    border: 'hsl(0 0% 85%)',
    ring: 'hsl(161 23% 45%)',
    font: '"OpenAI Sans", system-ui, sans-serif',
    fontHeading: '"OpenAI Sans", system-ui, sans-serif',
  },
  vercel: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(0 0% 5%)',
    card: 'hsl(0 0% 98%)',
    cardForeground: 'hsl(0 0% 5%)',
    primary: 'hsl(0 0% 5%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(0 0% 95%)',
    secondaryForeground: 'hsl(0 0% 10%)',
    muted: 'hsl(0 0% 96%)',
    mutedForeground: 'hsl(0 0% 40%)',
    accent: 'hsl(0 0% 5%)',
    accentForeground: 'hsl(0 0% 100%)',
    border: 'hsl(0 0% 90%)',
    ring: 'hsl(0 0% 5%)',
    font: '"Geist", Inter, system-ui, sans-serif',
    fontHeading: '"Geist", Inter, system-ui, sans-serif',
  },
  'cosmic-night': {
    background: 'hsl(240 20% 8%)',
    foreground: 'hsl(0 0% 95%)',
    card: 'hsl(240 15% 12%)',
    cardForeground: 'hsl(0 0% 95%)',
    primary: 'hsl(270 80% 65%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(240 15% 18%)',
    secondaryForeground: 'hsl(0 0% 90%)',
    muted: 'hsl(240 10% 15%)',
    mutedForeground: 'hsl(0 0% 60%)',
    accent: 'hsl(200 80% 60%)',
    accentForeground: 'hsl(0 0% 100%)',
    border: 'hsl(240 15% 20%)',
    ring: 'hsl(270 80% 65%)',
    font: 'Inter, system-ui, sans-serif',
    fontHeading: 'Inter, system-ui, sans-serif',
  },
  cyberpunk: {
    background: 'hsl(260 20% 8%)',
    foreground: 'hsl(180 100% 70%)',
    card: 'hsl(260 15% 12%)',
    cardForeground: 'hsl(180 100% 70%)',
    primary: 'hsl(320 100% 50%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(260 15% 18%)',
    secondaryForeground: 'hsl(180 100% 70%)',
    muted: 'hsl(260 10% 15%)',
    mutedForeground: 'hsl(180 50% 50%)',
    accent: 'hsl(60 100% 50%)',
    accentForeground: 'hsl(0 0% 0%)',
    border: 'hsl(180 100% 30%)',
    ring: 'hsl(320 100% 50%)',
    font: '"Rajdhani", "Orbitron", system-ui, sans-serif',
    fontHeading: '"Orbitron", "Rajdhani", system-ui, sans-serif',
  },
  'midnight-bloom': {
    background: 'hsl(250 30% 8%)',
    foreground: 'hsl(0 0% 95%)',
    card: 'hsl(250 25% 12%)',
    cardForeground: 'hsl(0 0% 95%)',
    primary: 'hsl(330 80% 55%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(250 20% 18%)',
    secondaryForeground: 'hsl(0 0% 90%)',
    muted: 'hsl(250 15% 15%)',
    mutedForeground: 'hsl(0 0% 60%)',
    accent: 'hsl(280 70% 60%)',
    accentForeground: 'hsl(0 0% 100%)',
    border: 'hsl(250 20% 20%)',
    ring: 'hsl(330 80% 55%)',
    font: 'Inter, system-ui, sans-serif',
    fontHeading: 'Inter, system-ui, sans-serif',
  },
  'northern-lights': {
    background: 'hsl(220 30% 8%)',
    foreground: 'hsl(0 0% 95%)',
    card: 'hsl(220 25% 12%)',
    cardForeground: 'hsl(0 0% 95%)',
    primary: 'hsl(160 80% 50%)',
    primaryForeground: 'hsl(0 0% 0%)',
    secondary: 'hsl(220 20% 18%)',
    secondaryForeground: 'hsl(0 0% 90%)',
    muted: 'hsl(220 15% 15%)',
    mutedForeground: 'hsl(0 0% 60%)',
    accent: 'hsl(200 80% 55%)',
    accentForeground: 'hsl(0 0% 100%)',
    border: 'hsl(220 20% 20%)',
    ring: 'hsl(160 80% 50%)',
    font: 'Inter, system-ui, sans-serif',
    fontHeading: 'Inter, system-ui, sans-serif',
  },
  'retro-arcade': {
    background: 'hsl(0 0% 5%)',
    foreground: 'hsl(120 100% 50%)',
    card: 'hsl(0 0% 10%)',
    cardForeground: 'hsl(120 100% 50%)',
    primary: 'hsl(0 100% 50%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(0 0% 15%)',
    secondaryForeground: 'hsl(120 100% 50%)',
    muted: 'hsl(0 0% 12%)',
    mutedForeground: 'hsl(120 50% 40%)',
    accent: 'hsl(60 100% 50%)',
    accentForeground: 'hsl(0 0% 0%)',
    border: 'hsl(120 100% 30%)',
    ring: 'hsl(0 100% 50%)',
    font: '"Press Start 2P", "VT323", monospace',
    fontHeading: '"Press Start 2P", "VT323", monospace',
  },
  caffeine: {
    background: 'hsl(30 15% 10%)',
    foreground: 'hsl(30 30% 90%)',
    card: 'hsl(30 12% 14%)',
    cardForeground: 'hsl(30 30% 90%)',
    primary: 'hsl(30 60% 45%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(30 10% 20%)',
    secondaryForeground: 'hsl(30 30% 85%)',
    muted: 'hsl(30 8% 16%)',
    mutedForeground: 'hsl(30 15% 55%)',
    accent: 'hsl(30 50% 50%)',
    accentForeground: 'hsl(0 0% 100%)',
    border: 'hsl(30 10% 22%)',
    ring: 'hsl(30 60% 45%)',
    font: '"Merriweather", Georgia, serif',
    fontHeading: '"Playfair Display", Georgia, serif',
  },
  // Default fallback for themes not explicitly defined
  'kodama-grove': {
    background: 'hsl(120 20% 97%)',
    foreground: 'hsl(120 30% 10%)',
    card: 'hsl(120 25% 94%)',
    cardForeground: 'hsl(120 30% 10%)',
    primary: 'hsl(142 70% 35%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(120 20% 88%)',
    secondaryForeground: 'hsl(120 30% 15%)',
    muted: 'hsl(120 15% 90%)',
    mutedForeground: 'hsl(120 15% 40%)',
    accent: 'hsl(142 60% 40%)',
    accentForeground: 'hsl(0 0% 100%)',
    border: 'hsl(120 20% 82%)',
    ring: 'hsl(142 70% 35%)',
    font: '"Nunito", system-ui, sans-serif',
    fontHeading: '"Nunito", system-ui, sans-serif',
  },
  'vintage-paper': {
    background: 'hsl(40 30% 94%)',
    foreground: 'hsl(30 20% 15%)',
    card: 'hsl(40 35% 91%)',
    cardForeground: 'hsl(30 20% 15%)',
    primary: 'hsl(20 60% 40%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(40 25% 85%)',
    secondaryForeground: 'hsl(30 20% 20%)',
    muted: 'hsl(40 20% 88%)',
    mutedForeground: 'hsl(30 15% 45%)',
    accent: 'hsl(20 50% 45%)',
    accentForeground: 'hsl(0 0% 100%)',
    border: 'hsl(30 20% 75%)',
    ring: 'hsl(20 60% 40%)',
    font: '"Merriweather", Georgia, serif',
    fontHeading: '"Playfair Display", Georgia, serif',
  },
  // ... add more themes as needed, using dark background for video
};

// Dark mode versions for video (most videos look better with dark backgrounds)
const THEME_COLORS_DARK: Partial<Record<ThemeName, Partial<ThemeColors>>> = {
  base: {
    background: 'hsl(222 47% 8%)',
    foreground: 'hsl(210 40% 98%)',
    card: 'hsl(222 40% 12%)',
    cardForeground: 'hsl(210 40% 98%)',
    muted: 'hsl(222 30% 15%)',
    mutedForeground: 'hsl(215 20% 65%)',
    border: 'hsl(222 30% 18%)',
  },
  claude: {
    background: 'hsl(30 15% 10%)',
    foreground: 'hsl(30 30% 95%)',
    card: 'hsl(30 12% 14%)',
    cardForeground: 'hsl(30 30% 95%)',
    muted: 'hsl(30 10% 16%)',
    mutedForeground: 'hsl(30 15% 60%)',
    border: 'hsl(30 12% 22%)',
  },
  vercel: {
    background: 'hsl(0 0% 5%)',
    foreground: 'hsl(0 0% 98%)',
    card: 'hsl(0 0% 8%)',
    cardForeground: 'hsl(0 0% 98%)',
    primary: 'hsl(0 0% 100%)',
    primaryForeground: 'hsl(0 0% 0%)',
    muted: 'hsl(0 0% 12%)',
    mutedForeground: 'hsl(0 0% 65%)',
    border: 'hsl(0 0% 15%)',
  },
};

// =============================================================================
// Resolver Functions
// =============================================================================

/**
 * Get theme colors for use in Remotion compositions.
 * @param themeName - The theme name (e.g., 'claude', 'vercel', 'cyberpunk')
 * @param preferDark - Whether to prefer dark mode colors (recommended for video)
 * @returns Theme colors with actual HSL string values
 */
export function getThemeColors(
  themeName: ThemeName,
  preferDark = true
): ThemeColors {
  // Get base theme colors with fallback
  const baseColors = THEME_COLORS[themeName] ?? THEME_COLORS.base ?? {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 84% 4.9%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(222.2 84% 4.9%)',
    primary: 'hsl(222.2 47.4% 11.2%)',
    primaryForeground: 'hsl(210 40% 98%)',
    secondary: 'hsl(210 40% 96.1%)',
    secondaryForeground: 'hsl(222.2 47.4% 11.2%)',
    muted: 'hsl(210 40% 96.1%)',
    mutedForeground: 'hsl(215.4 16.3% 46.9%)',
    accent: 'hsl(210 40% 96.1%)',
    accentForeground: 'hsl(222.2 47.4% 11.2%)',
    border: 'hsl(214.3 31.8% 91.4%)',
    ring: 'hsl(222.2 84% 4.9%)',
    font: 'Inter, system-ui, sans-serif',
    fontHeading: 'Inter, system-ui, sans-serif',
  };

  // If preferring dark and we have dark overrides, merge them
  if (preferDark && THEME_COLORS_DARK[themeName]) {
    return {
      ...baseColors,
      ...THEME_COLORS_DARK[themeName],
    } as ThemeColors;
  }

  return baseColors;
}

/**
 * Get a simplified color palette for quick video styling.
 * Returns the essential colors for backgrounds, text, and accents.
 */
export function getVideoPalette(themeName: ThemeName, preferDark = true) {
  const colors = getThemeColors(themeName, preferDark);

  return {
    bg: colors.background,
    fg: colors.foreground,
    primary: colors.primary,
    accent: colors.accent,
    muted: colors.muted,
    mutedFg: colors.mutedForeground,
    card: colors.card,
    border: colors.border,
    font: colors.font,
    fontHeading: colors.fontHeading,
  };
}

/**
 * Generate gradient background from theme colors.
 */
export function getThemeGradient(
  themeName: ThemeName,
  type: 'subtle' | 'vibrant' | 'radial' = 'subtle'
): string {
  const colors = getThemeColors(themeName, true);

  switch (type) {
    case 'vibrant':
      return `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`;
    case 'radial':
      return `radial-gradient(circle at center, ${colors.card} 0%, ${colors.background} 100%)`;
    case 'subtle':
    default:
      return `linear-gradient(135deg, ${colors.background} 0%, ${colors.card} 100%)`;
  }
}

/**
 * Get all available themes with their display labels.
 */
export function getAvailableThemes() {
  return themes.map((t) => ({
    name: t.name as ThemeName,
    label: t.label,
    hasColors: t.name in THEME_COLORS,
  }));
}

// =============================================================================
// Type Exports
// =============================================================================

export type { ThemeName };
