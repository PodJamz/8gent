/**
 * Theme to Watch DNA Algorithm
 *
 * Analyzes theme tokens and procedurally generates watch characteristics.
 * Each of the 43 themes will produce a unique, aesthetically matched watch face.
 */

import { themes, type ThemeName } from '@/lib/themes/definitions';

// Watch style types - auto-detected from theme characteristics
export type WatchStyle =
  | 'sporty'    // High contrast, bold - think Explorer II, Speedmaster
  | 'elegant'   // Low saturation, refined - think Calatrava, Saxonia
  | 'minimal'   // Clean, no numerals - think Nomos, Max Bill
  | 'digital'   // Tech themes - LED/LCD segments
  | 'vintage'   // Warm, aged - think patina, domed crystal
  | 'field'     // Military, utilitarian - think field watches
  | 'diver';    // Bold markers, high legibility

// Hand styles
export type HandStyle = 'dauphine' | 'baton' | 'sword' | 'leaf' | 'alpha' | 'mercedes' | 'snowflake';

// Index/marker styles
export type IndexStyle = 'baton' | 'roman' | 'arabic' | 'dots' | 'mixed' | 'none';

// Watch DNA - the procedurally generated characteristics
export interface WatchDNA {
  theme: ThemeName;
  style: WatchStyle;

  // Colors (HSL strings)
  dialColor: string;
  dialTexture: 'sunburst' | 'guilloche' | 'matte' | 'gradient' | 'brushed';
  handColor: string;
  secondsHandColor: string;
  indexColor: string;
  lumeColor: string;
  bezelColor: string;

  // Structure
  handStyle: HandStyle;
  indexStyle: IndexStyle;
  hasDateWindow: boolean;
  datePosition: 3 | 6;
  hasSubdials: boolean;

  // Aesthetics
  hasCrystalDome: boolean;
  hasChapterRing: boolean;
  caseFinish: 'polished' | 'brushed' | 'mixed';

  // Font for any text
  font: string;
}

// HSL color structure
interface HSLColor {
  h: number;
  s: number;
  l: number;
}

// Parse HSL string "h s% l%" to object
function parseHSL(hsl: string): HSLColor {
  const parts = hsl.split(' ').map(p => parseFloat(p.replace('%', '')));
  return { h: parts[0] || 0, s: parts[1] || 0, l: parts[2] || 0 };
}

// Convert HSL object to CSS string
function hslToCSS(color: HSLColor, alpha?: number): string {
  if (alpha !== undefined) {
    return `hsla(${color.h}, ${color.s}%, ${color.l}%, ${alpha})`;
  }
  return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
}

// Adjust HSL values
function adjustHSL(color: HSLColor, adjustments: Partial<HSLColor>): HSLColor {
  return {
    h: Math.max(0, Math.min(360, (color.h + (adjustments.h || 0)) % 360)),
    s: Math.max(0, Math.min(100, color.s + (adjustments.s || 0))),
    l: Math.max(0, Math.min(100, color.l + (adjustments.l || 0))),
  };
}

// Theme color tokens (extracted from CSS variables)
// This maps to the actual CSS --theme-* variables
interface ThemeTokens {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
  font: string;
}

// Manually extracted theme tokens from themes.css
// In a real implementation, these would be read from CSS or a config
const THEME_TOKENS: Record<ThemeName, ThemeTokens> = {
  'utilitarian': {
    background: '45 30% 92%',
    foreground: '0 0% 0%',
    primary: '15 85% 55%',
    secondary: '45 20% 85%',
    accent: '15 85% 55%',
    muted: '45 15% 88%',
    border: '0 0% 0%',
    font: 'SF Mono',
  },
  'base': {
    background: '0 0% 100%',
    foreground: '222 84% 5%',
    primary: '222 47% 11%',
    secondary: '210 40% 96%',
    accent: '210 40% 96%',
    muted: '210 40% 96%',
    border: '214 32% 91%',
    font: 'Inter',
  },
  'claude': {
    background: '30 20% 98%',
    foreground: '20 14% 10%',
    primary: '24 90% 55%',
    secondary: '30 20% 90%',
    accent: '24 80% 60%',
    muted: '30 15% 92%',
    border: '30 20% 85%',
    font: 'Söhne',
  },
  'chatgpt': {
    background: '0 0% 98%',
    foreground: '0 0% 10%',
    primary: '161 23% 45%',
    secondary: '0 0% 94%',
    accent: '161 23% 45%',
    muted: '0 0% 92%',
    border: '0 0% 85%',
    font: 'OpenAI Sans',
  },
  'vercel': {
    background: '0 0% 100%',
    foreground: '0 0% 5%',
    primary: '0 0% 5%',
    secondary: '0 0% 95%',
    accent: '0 0% 5%',
    muted: '0 0% 96%',
    border: '0 0% 90%',
    font: 'Geist',
  },
  'kodama-grove': {
    background: '120 20% 97%',
    foreground: '120 30% 10%',
    primary: '142 70% 35%',
    secondary: '120 20% 88%',
    accent: '142 60% 40%',
    muted: '120 15% 90%',
    border: '120 20% 82%',
    font: 'Nunito',
  },
  'vintage-paper': {
    background: '40 30% 95%',
    foreground: '30 20% 15%',
    primary: '30 50% 35%',
    secondary: '40 25% 85%',
    accent: '30 60% 45%',
    muted: '40 20% 88%',
    border: '40 25% 78%',
    font: 'Courier Prime',
  },
  'claymorphism': {
    background: '220 20% 97%',
    foreground: '220 30% 15%',
    primary: '220 80% 55%',
    secondary: '220 20% 88%',
    accent: '260 70% 60%',
    muted: '220 15% 90%',
    border: '220 20% 85%',
    font: 'Poppins',
  },
  'nature': {
    background: '45 25% 96%',
    foreground: '30 30% 12%',
    primary: '85 50% 40%',
    secondary: '45 20% 85%',
    accent: '30 60% 50%',
    muted: '45 15% 88%',
    border: '45 20% 78%',
    font: 'Lora',
  },
  'neo-brutalism': {
    background: '60 100% 97%',
    foreground: '0 0% 0%',
    primary: '0 0% 0%',
    secondary: '60 100% 85%',
    accent: '350 100% 60%',
    muted: '60 50% 90%',
    border: '0 0% 0%',
    font: 'Space Grotesk',
  },
  'elegant-luxury': {
    background: '45 20% 96%',
    foreground: '40 15% 12%',
    primary: '45 70% 45%',
    secondary: '45 15% 88%',
    accent: '45 80% 50%',
    muted: '45 10% 90%',
    border: '45 20% 80%',
    font: 'Playfair Display',
  },
  'pastel-dreams': {
    background: '300 30% 97%',
    foreground: '280 20% 20%',
    primary: '280 60% 65%',
    secondary: '300 25% 90%',
    accent: '330 70% 70%',
    muted: '300 20% 92%',
    border: '300 25% 85%',
    font: 'Quicksand',
  },
  'cosmic-night': {
    background: '240 30% 8%',
    foreground: '240 10% 95%',
    primary: '270 80% 60%',
    secondary: '240 25% 15%',
    accent: '200 100% 65%',
    muted: '240 20% 12%',
    border: '240 25% 20%',
    font: 'Orbitron',
  },
  'clean-slate': {
    background: '210 20% 98%',
    foreground: '210 25% 10%',
    primary: '210 100% 50%',
    secondary: '210 15% 92%',
    accent: '210 90% 55%',
    muted: '210 12% 94%',
    border: '210 15% 88%',
    font: 'Inter',
  },
  'caffeine': {
    background: '30 25% 95%',
    foreground: '25 40% 12%',
    primary: '25 70% 35%',
    secondary: '30 20% 88%',
    accent: '25 80% 45%',
    muted: '30 15% 90%',
    border: '30 20% 80%',
    font: 'Merriweather',
  },
  'ocean-breeze': {
    background: '195 30% 97%',
    foreground: '200 30% 12%',
    primary: '195 80% 45%',
    secondary: '195 25% 90%',
    accent: '175 70% 50%',
    muted: '195 20% 92%',
    border: '195 25% 85%',
    font: 'Nunito Sans',
  },
  'perpetuity': {
    background: '0 0% 4%',
    foreground: '0 0% 95%',
    primary: '0 0% 85%',
    secondary: '0 0% 10%',
    accent: '0 0% 70%',
    muted: '0 0% 8%',
    border: '0 0% 15%',
    font: 'Inter',
  },
  'midnight-bloom': {
    background: '270 30% 8%',
    foreground: '300 20% 95%',
    primary: '300 70% 55%',
    secondary: '270 25% 15%',
    accent: '330 80% 60%',
    muted: '270 20% 12%',
    border: '270 25% 20%',
    font: 'Cormorant Garamond',
  },
  'northern-lights': {
    background: '220 25% 10%',
    foreground: '180 30% 95%',
    primary: '160 80% 50%',
    secondary: '220 20% 18%',
    accent: '280 70% 60%',
    muted: '220 15% 15%',
    border: '220 20% 22%',
    font: 'Raleway',
  },
  'sunset-horizon': {
    background: '25 30% 96%',
    foreground: '15 30% 12%',
    primary: '15 85% 55%',
    secondary: '25 25% 88%',
    accent: '35 90% 55%',
    muted: '25 20% 90%',
    border: '25 25% 82%',
    font: 'Josefin Sans',
  },
  'modern-minimal': {
    background: '0 0% 100%',
    foreground: '0 0% 8%',
    primary: '0 0% 15%',
    secondary: '0 0% 96%',
    accent: '0 0% 25%',
    muted: '0 0% 94%',
    border: '0 0% 90%',
    font: 'Inter',
  },
  'candyland': {
    background: '330 40% 97%',
    foreground: '340 30% 15%',
    primary: '340 85% 60%',
    secondary: '330 35% 90%',
    accent: '180 70% 50%',
    muted: '330 30% 92%',
    border: '330 35% 85%',
    font: 'Baloo 2',
  },
  'cyberpunk': {
    background: '260 30% 8%',
    foreground: '180 100% 60%',
    primary: '320 100% 55%',
    secondary: '260 25% 15%',
    accent: '60 100% 50%',
    muted: '260 20% 12%',
    border: '320 80% 40%',
    font: 'Share Tech Mono',
  },
  'retro-arcade': {
    background: '240 40% 8%',
    foreground: '120 100% 60%',
    primary: '350 100% 55%',
    secondary: '240 35% 15%',
    accent: '60 100% 55%',
    muted: '240 30% 12%',
    border: '240 40% 20%',
    font: 'Press Start 2P',
  },
  'quantum-rose': {
    background: '340 25% 96%',
    foreground: '340 20% 12%',
    primary: '340 75% 55%',
    secondary: '340 20% 90%',
    accent: '20 80% 55%',
    muted: '340 15% 92%',
    border: '340 20% 85%',
    font: 'DM Sans',
  },
  'bold-tech': {
    background: '220 25% 10%',
    foreground: '0 0% 98%',
    primary: '210 100% 55%',
    secondary: '220 20% 18%',
    accent: '150 80% 50%',
    muted: '220 15% 15%',
    border: '220 20% 22%',
    font: 'Space Grotesk',
  },
  'violet-bloom': {
    background: '270 25% 97%',
    foreground: '270 25% 12%',
    primary: '270 70% 55%',
    secondary: '270 20% 90%',
    accent: '300 65% 60%',
    muted: '270 15% 92%',
    border: '270 20% 85%',
    font: 'Outfit',
  },
  't3-chat': {
    background: '250 30% 6%',
    foreground: '0 0% 98%',
    primary: '270 80% 60%',
    secondary: '250 25% 12%',
    accent: '200 100% 55%',
    muted: '250 20% 10%',
    border: '250 25% 18%',
    font: 'Cal Sans',
  },
  'mocha-mousse': {
    background: '25 30% 94%',
    foreground: '20 35% 15%',
    primary: '20 55% 40%',
    secondary: '25 25% 85%',
    accent: '20 65% 50%',
    muted: '25 20% 88%',
    border: '25 25% 78%',
    font: 'Libre Baskerville',
  },
  'amethyst-haze': {
    background: '280 20% 96%',
    foreground: '280 25% 15%',
    primary: '280 60% 55%',
    secondary: '280 15% 90%',
    accent: '320 55% 60%',
    muted: '280 12% 92%',
    border: '280 18% 85%',
    font: 'Spectral',
  },
  'doom-64': {
    background: '0 0% 5%',
    foreground: '0 100% 50%',
    primary: '0 100% 45%',
    secondary: '0 80% 10%',
    accent: '30 100% 50%',
    muted: '0 60% 8%',
    border: '0 100% 30%',
    font: 'Permanent Marker',
  },
  'amber-minimal': {
    background: '45 35% 97%',
    foreground: '40 30% 12%',
    primary: '40 85% 50%',
    secondary: '45 30% 92%',
    accent: '35 90% 55%',
    muted: '45 25% 94%',
    border: '45 30% 88%',
    font: 'Inter',
  },
  'solar-dusk': {
    background: '25 35% 12%',
    foreground: '35 30% 92%',
    primary: '25 90% 55%',
    secondary: '25 30% 18%',
    accent: '45 95% 55%',
    muted: '25 25% 15%',
    border: '25 30% 22%',
    font: 'Rubik',
  },
  'starry-night': {
    background: '230 40% 10%',
    foreground: '60 50% 90%',
    primary: '220 70% 55%',
    secondary: '230 35% 18%',
    accent: '60 80% 60%',
    muted: '230 30% 15%',
    border: '230 35% 22%',
    font: 'Crimson Pro',
  },
  'soft-pop': {
    background: '15 40% 97%',
    foreground: '10 35% 15%',
    primary: '10 75% 60%',
    secondary: '15 35% 92%',
    accent: '340 70% 65%',
    muted: '15 30% 94%',
    border: '15 35% 88%',
    font: 'Nunito',
  },
  'sage-garden': {
    background: '120 15% 96%',
    foreground: '130 25% 15%',
    primary: '130 40% 45%',
    secondary: '120 12% 90%',
    accent: '90 50% 50%',
    muted: '120 10% 92%',
    border: '120 15% 85%',
    font: 'Source Serif Pro',
  },
  'notebook': {
    background: '45 40% 96%',
    foreground: '220 80% 20%',
    primary: '220 85% 45%',
    secondary: '45 35% 90%',
    accent: '0 75% 55%',
    muted: '45 30% 92%',
    border: '200 60% 75%',
    font: 'Patrick Hand',
  },
  'research': {
    background: '0 0% 100%',
    foreground: '220 15% 15%',
    primary: '220 75% 50%',
    secondary: '0 0% 96%',
    accent: '160 70% 45%',
    muted: '0 0% 94%',
    border: '220 20% 88%',
    font: 'IBM Plex Sans',
  },
  'field-guide': {
    background: '45 30% 94%',
    foreground: '90 25% 18%',
    primary: '90 45% 35%',
    secondary: '45 25% 88%',
    accent: '25 70% 50%',
    muted: '45 20% 90%',
    border: '90 30% 75%',
    font: 'Vollkorn',
  },
  'denim': {
    background: '215 35% 95%',
    foreground: '220 40% 15%',
    primary: '215 60% 45%',
    secondary: '215 30% 88%',
    accent: '200 70% 50%',
    muted: '215 25% 90%',
    border: '215 35% 78%',
    font: 'Inter',
  },
  'google': {
    background: '0 0% 100%',
    foreground: '0 0% 15%',
    primary: '217 89% 61%',
    secondary: '214 12% 95%',
    accent: '4 90% 58%',
    muted: '220 14% 96%',
    border: '214 32% 91%',
    font: 'Google Sans',
  },
  'apple': {
    background: '0 0% 100%',
    foreground: '0 0% 0%',
    primary: '211 100% 50%',
    secondary: '220 10% 96%',
    accent: '211 100% 50%',
    muted: '220 10% 94%',
    border: '220 13% 91%',
    font: 'SF Pro',
  },
  'microsoft': {
    background: '0 0% 100%',
    foreground: '0 0% 11%',
    primary: '206 100% 42%',
    secondary: '210 14% 93%',
    accent: '206 100% 42%',
    muted: '210 11% 96%',
    border: '210 14% 89%',
    font: 'Segoe UI',
  },
  'notion': {
    background: '0 0% 100%',
    foreground: '0 0% 9%',
    primary: '0 0% 9%',
    secondary: '45 6% 97%',
    accent: '0 0% 9%',
    muted: '45 4% 95%',
    border: '45 6% 90%',
    font: 'Inter',
  },
  'cursor': {
    background: '0 0% 0%',
    foreground: '0 0% 100%',
    primary: '191 100% 50%',
    secondary: '240 2% 12%',
    accent: '191 100% 50%',
    muted: '240 2% 16%',
    border: '240 2% 20%',
    font: 'Inter',
  },
  'miro': {
    background: '47 100% 98%',
    foreground: '222 47% 11%',
    primary: '39 100% 50%',
    secondary: '47 20% 92%',
    accent: '39 100% 50%',
    muted: '47 15% 95%',
    border: '47 10% 88%',
    font: 'Inter',
  },
  'nike': {
    background: '40 30% 95%',
    foreground: '0 0% 8%',
    primary: '0 0% 8%',
    secondary: '40 20% 90%',
    accent: '28 100% 55%',
    muted: '40 15% 88%',
    border: '40 20% 85%',
    font: 'Helvetica Neue',
  },
  'adidas': {
    background: '0 0% 98%',
    foreground: '0 0% 8%',
    primary: '210 100% 45%',
    secondary: '0 0% 94%',
    accent: '0 0% 8%',
    muted: '0 0% 92%',
    border: '0 0% 88%',
    font: 'Helvetica Neue',
  },
  'tao': {
    background: '220 30% 8%',
    foreground: '210 20% 78%',
    primary: '200 40% 55%',
    secondary: '220 25% 15%',
    accent: '200 45% 50%',
    muted: '220 20% 12%',
    border: '220 25% 20%',
    font: 'Crimson Text',
  },
  'kinetic-editorial': {
    background: '0 0% 4%',
    foreground: '0 0% 96%',
    primary: '0 0% 96%',
    secondary: '0 0% 12%',
    accent: '0 0% 80%',
    muted: '0 0% 8%',
    border: '0 0% 20%',
    font: 'Space Grotesk',
  },
};

// Detect watch style from theme characteristics
function detectWatchStyle(tokens: ThemeTokens): WatchStyle {
  const bg = parseHSL(tokens.background);
  const fg = parseHSL(tokens.foreground);
  const primary = parseHSL(tokens.primary);
  const accent = parseHSL(tokens.accent);

  // Calculate contrast and saturation metrics
  const contrast = Math.abs(bg.l - fg.l);
  const primarySat = primary.s;
  const accentSat = accent.s;
  const avgSat = (primarySat + accentSat) / 2;
  const isDark = bg.l < 30;
  const isMonochrome = primary.s < 15 && accent.s < 15;

  // Font-based detection
  const fontLower = tokens.font.toLowerCase();
  const isMonospace = fontLower.includes('mono') || fontLower.includes('code');
  const isSerif = fontLower.includes('serif') || fontLower.includes('times') || fontLower.includes('georgia');
  const isPlayful = fontLower.includes('press start') || fontLower.includes('permanent') || fontLower.includes('hand');

  // Digital/tech themes
  if (isMonospace || fontLower.includes('orbitron') || fontLower.includes('share tech')) {
    return 'digital';
  }

  // High contrast + bold = sporty or diver
  if (contrast > 80 && avgSat > 60) {
    return isDark ? 'diver' : 'sporty';
  }

  // Very high saturation accent = sporty
  if (accentSat > 85) {
    return 'sporty';
  }

  // Warm sepia/vintage tones
  if (primary.h >= 20 && primary.h <= 45 && primary.s < 60 && bg.l > 85) {
    return 'vintage';
  }

  // Military/field - utilitarian fonts or earthy tones
  if (fontLower.includes('mono') && !isDark || (primary.h >= 80 && primary.h <= 130)) {
    return 'field';
  }

  // Very low saturation + clean = minimal
  if (isMonochrome || (avgSat < 30 && contrast > 60)) {
    return 'minimal';
  }

  // Serif fonts or low saturation = elegant
  if (isSerif || (avgSat < 50 && !isDark && primary.s < 40)) {
    return 'elegant';
  }

  // Default based on darkness
  return isDark ? 'diver' : 'elegant';
}

// Detect hand style based on watch style and theme
function detectHandStyle(style: WatchStyle, tokens: ThemeTokens): HandStyle {
  const fontLower = tokens.font.toLowerCase();

  switch (style) {
    case 'sporty':
      return 'mercedes'; // Like Rolex sport watches
    case 'diver':
      return 'snowflake'; // Like Tudor Black Bay
    case 'elegant':
      return 'dauphine'; // Classic dress watch
    case 'minimal':
      return 'baton'; // Simple, modern
    case 'vintage':
      return 'leaf'; // Classic vintage look
    case 'field':
      return 'sword'; // Military heritage
    case 'digital':
      return 'baton'; // Digital style
    default:
      return 'dauphine';
  }
}

// Detect index style based on watch style
function detectIndexStyle(style: WatchStyle, tokens: ThemeTokens): IndexStyle {
  const fontLower = tokens.font.toLowerCase();
  const isSerif = fontLower.includes('serif') || fontLower.includes('playfair') || fontLower.includes('times');

  switch (style) {
    case 'sporty':
      return 'baton'; // Applied indices
    case 'diver':
      return 'dots'; // Luminous dots
    case 'elegant':
      return isSerif ? 'roman' : 'baton';
    case 'minimal':
      return 'none'; // Very clean
    case 'vintage':
      return 'arabic'; // Classic numerals
    case 'field':
      return 'arabic'; // Legible military style
    case 'digital':
      return 'none'; // Digital display
    default:
      return 'baton';
  }
}

// Detect dial texture based on theme
function detectDialTexture(style: WatchStyle, tokens: ThemeTokens): WatchDNA['dialTexture'] {
  const bg = parseHSL(tokens.background);

  switch (style) {
    case 'elegant':
      return bg.l > 50 ? 'sunburst' : 'guilloche';
    case 'sporty':
      return 'matte';
    case 'diver':
      return 'matte';
    case 'vintage':
      return 'matte';
    case 'minimal':
      return 'matte';
    case 'digital':
      return 'matte';
    case 'field':
      return 'brushed';
    default:
      return 'matte';
  }
}

/**
 * Main function: Convert theme tokens to Watch DNA
 */
export function themeToWatch(themeName: ThemeName): WatchDNA {
  const tokens = THEME_TOKENS[themeName];
  if (!tokens) {
    throw new Error(`Unknown theme: ${themeName}`);
  }

  const style = detectWatchStyle(tokens);
  const bg = parseHSL(tokens.background);
  const fg = parseHSL(tokens.foreground);
  const primary = parseHSL(tokens.primary);
  const accent = parseHSL(tokens.accent);
  const secondary = parseHSL(tokens.secondary);

  // Determine dial color (usually darker for legibility)
  const isDark = bg.l < 30;
  let dialColor: HSLColor;

  if (isDark) {
    // Dark themes: use background or slightly adjusted
    dialColor = adjustHSL(bg, { l: 5 });
  } else {
    // Light themes: create a darker dial or use background
    dialColor = style === 'minimal' || style === 'elegant'
      ? adjustHSL(bg, { l: -3 })
      : adjustHSL(bg, { l: -10, s: 5 });
  }

  // Hand colors - high contrast against dial
  const handColor = isDark ? fg : adjustHSL(fg, { l: -10 });

  // Seconds hand - use accent color for pop
  const secondsHandColor = accent;

  // Index color - slightly muted from hand color
  const indexColor = adjustHSL(handColor, { s: -10, l: isDark ? -5 : 5 });

  // Lume color - greenish glow for most, blue for some
  const lumeColor: HSLColor = style === 'diver'
    ? { h: 180, s: 100, l: 70 } // Blue lume
    : { h: 120, s: 80, l: 75 }; // Green lume

  // Bezel color
  const bezelColor = style === 'diver'
    ? adjustHSL(primary, { l: -20 })
    : adjustHSL(secondary, { l: -5 });

  return {
    theme: themeName,
    style,

    dialColor: hslToCSS(dialColor),
    dialTexture: detectDialTexture(style, tokens),
    handColor: hslToCSS(handColor),
    secondsHandColor: hslToCSS(secondsHandColor),
    indexColor: hslToCSS(indexColor),
    lumeColor: hslToCSS(lumeColor),
    bezelColor: hslToCSS(bezelColor),

    handStyle: detectHandStyle(style, tokens),
    indexStyle: detectIndexStyle(style, tokens),
    hasDateWindow: style !== 'minimal' && style !== 'digital',
    datePosition: style === 'diver' ? 3 : 6,
    hasSubdials: style === 'sporty',

    hasCrystalDome: style === 'vintage' || style === 'elegant',
    hasChapterRing: style === 'field' || style === 'vintage',
    caseFinish: style === 'sporty' || style === 'diver' ? 'brushed' : 'polished',

    font: tokens.font,
  };
}

/**
 * Get all theme watches - for gallery view
 */
export function getAllThemeWatches(): WatchDNA[] {
  return themes.map(t => themeToWatch(t.name));
}

/**
 * Get watch style description
 */
export function getWatchStyleDescription(style: WatchStyle): string {
  const descriptions: Record<WatchStyle, string> = {
    sporty: 'Bold sport chronograph with high legibility',
    elegant: 'Refined dress watch with classic proportions',
    minimal: 'Ultra-clean design with essential elements only',
    digital: 'Tech-inspired with modern digital aesthetic',
    vintage: 'Heritage-inspired with warm, aged character',
    field: 'Military-inspired with utilitarian precision',
    diver: 'Professional tool watch built for depth',
  };
  return descriptions[style];
}
