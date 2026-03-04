/**
 * Theme Exporter Utility
 *
 * Generates exportable CSS, JSON, and Tailwind configurations from theme data.
 * Supports all 40+ themes in the design system.
 */

import { themePromptData, type ThemePromptData } from '@/components/design/CopyThemePrompt';

// ============================================================================
// Types
// ============================================================================

export interface ThemeExportConfig {
  name: string;
  label: string;
  description: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  characteristics: string[];
  useCases: string[];
}

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
}

export interface ThemeFonts {
  body: string;
  heading: string;
}

export interface ExportOptions {
  format: 'css' | 'json' | 'tailwind' | 'all';
  includeComments?: boolean;
  includeMetadata?: boolean;
}

// ============================================================================
// HSL Utilities
// ============================================================================

/**
 * Converts HSL string to hex color
 */
export function hslToHex(hsl: string): string {
  // Parse "h s% l%" format
  const parts = hsl.trim().split(/\s+/);
  if (parts.length < 3) return '#000000';

  const h = parseFloat(parts[0]) / 360;
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts hex color to HSL string
 */
export function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0 0% 0%';

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// ============================================================================
// Theme CSS Variables Map (parsed from themes.css)
// ============================================================================

// This maps theme names to their CSS variable definitions
// Values are in HSL format: "h s% l%"
export const themeCssVariables: Record<string, Record<string, string>> = {
  utilitarian: {
    background: '45 30% 92%',
    foreground: '0 0% 0%',
    card: '45 35% 95%',
    cardForeground: '0 0% 0%',
    primary: '15 85% 55%',
    primaryForeground: '0 0% 100%',
    secondary: '45 20% 85%',
    secondaryForeground: '0 0% 0%',
    muted: '45 15% 88%',
    mutedForeground: '0 0% 35%',
    accent: '15 85% 55%',
    accentForeground: '0 0% 100%',
    border: '0 0% 0%',
    ring: '15 85% 55%',
    font: '"SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace',
    fontHeading: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  base: {
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    card: '0 0% 100%',
    cardForeground: '222.2 84% 4.9%',
    primary: '222.2 47.4% 11.2%',
    primaryForeground: '210 40% 98%',
    secondary: '210 40% 96.1%',
    secondaryForeground: '222.2 47.4% 11.2%',
    muted: '210 40% 96.1%',
    mutedForeground: '215.4 16.3% 46.9%',
    accent: '210 40% 96.1%',
    accentForeground: '222.2 47.4% 11.2%',
    border: '214.3 31.8% 91.4%',
    ring: '222.2 84% 4.9%',
    font: 'Inter, system-ui, -apple-system, sans-serif',
    fontHeading: 'Inter, system-ui, -apple-system, sans-serif',
  },
  claude: {
    background: '30 20% 98%',
    foreground: '20 14% 10%',
    card: '30 30% 96%',
    cardForeground: '20 14% 10%',
    primary: '24 90% 55%',
    primaryForeground: '0 0% 100%',
    secondary: '30 20% 90%',
    secondaryForeground: '20 14% 20%',
    muted: '30 15% 92%',
    mutedForeground: '20 10% 40%',
    accent: '24 80% 60%',
    accentForeground: '0 0% 100%',
    border: '30 20% 85%',
    ring: '24 90% 55%',
    font: '"Söhne", ui-sans-serif, system-ui, -apple-system, sans-serif',
    fontHeading: '"Söhne", ui-sans-serif, system-ui, -apple-system, sans-serif',
  },
  chatgpt: {
    background: '0 0% 98%',
    foreground: '0 0% 10%',
    card: '0 0% 100%',
    cardForeground: '0 0% 10%',
    primary: '161 23% 45%',
    primaryForeground: '0 0% 100%',
    secondary: '0 0% 94%',
    secondaryForeground: '0 0% 20%',
    muted: '0 0% 92%',
    mutedForeground: '0 0% 40%',
    accent: '161 23% 45%',
    accentForeground: '0 0% 100%',
    border: '0 0% 85%',
    ring: '161 23% 45%',
    font: '"OpenAI Sans", "Söhne", ui-sans-serif, system-ui, -apple-system, sans-serif',
    fontHeading: '"OpenAI Sans", "Söhne", ui-sans-serif, system-ui, -apple-system, sans-serif',
  },
  vercel: {
    background: '0 0% 100%',
    foreground: '0 0% 5%',
    card: '0 0% 98%',
    cardForeground: '0 0% 5%',
    primary: '0 0% 5%',
    primaryForeground: '0 0% 100%',
    secondary: '0 0% 95%',
    secondaryForeground: '0 0% 10%',
    muted: '0 0% 96%',
    mutedForeground: '0 0% 40%',
    accent: '0 0% 5%',
    accentForeground: '0 0% 100%',
    border: '0 0% 90%',
    ring: '0 0% 5%',
    font: '"Geist", Inter, system-ui, -apple-system, sans-serif',
    fontHeading: '"Geist", Inter, system-ui, -apple-system, sans-serif',
  },
  'kodama-grove': {
    background: '120 20% 97%',
    foreground: '120 30% 10%',
    card: '120 25% 94%',
    cardForeground: '120 30% 10%',
    primary: '142 70% 35%',
    primaryForeground: '0 0% 100%',
    secondary: '120 20% 88%',
    secondaryForeground: '120 30% 15%',
    muted: '120 15% 90%',
    mutedForeground: '120 15% 40%',
    accent: '142 60% 40%',
    accentForeground: '0 0% 100%',
    border: '120 20% 82%',
    ring: '142 70% 35%',
    font: '"Nunito", "Quicksand", system-ui, sans-serif',
    fontHeading: '"Nunito", "Quicksand", system-ui, sans-serif',
  },
  cyberpunk: {
    background: '260 30% 98%',
    foreground: '260 50% 12%',
    card: '260 35% 96%',
    cardForeground: '260 50% 12%',
    primary: '320 90% 55%',
    primaryForeground: '0 0% 100%',
    secondary: '260 25% 92%',
    secondaryForeground: '260 50% 18%',
    muted: '260 20% 94%',
    mutedForeground: '260 40% 45%',
    accent: '180 90% 45%',
    accentForeground: '260 30% 98%',
    border: '260 25% 88%',
    ring: '320 90% 55%',
    font: '"Share Tech Mono", "Fira Code", "Roboto Mono", monospace',
    fontHeading: '"Rajdhani", "Audiowide", "Impact", sans-serif',
  },
  'neo-brutalism': {
    background: '60 100% 97%',
    foreground: '0 0% 0%',
    card: '0 0% 100%',
    cardForeground: '0 0% 0%',
    primary: '0 0% 0%',
    primaryForeground: '60 100% 97%',
    secondary: '60 100% 85%',
    secondaryForeground: '0 0% 0%',
    muted: '60 50% 90%',
    mutedForeground: '0 0% 30%',
    accent: '350 100% 60%',
    accentForeground: '0 0% 100%',
    border: '0 0% 0%',
    ring: '0 0% 0%',
    font: '"Space Grotesk", "Space Mono", Impact, sans-serif',
    fontHeading: '"Space Grotesk", Impact, "Arial Black", sans-serif',
  },
};

// ============================================================================
// Export Functions
// ============================================================================

/**
 * Get theme configuration from themePromptData and CSS variables
 */
export function getThemeConfig(themeName: string): ThemeExportConfig | null {
  const promptData = themePromptData[themeName];
  const cssVars = themeCssVariables[themeName];

  if (!promptData) return null;

  // Convert hex colors from promptData to HSL if we have CSS vars, otherwise use hex
  const colors: ThemeColors = cssVars ? {
    background: hslToHex(cssVars.background),
    foreground: hslToHex(cssVars.foreground),
    card: hslToHex(cssVars.card),
    cardForeground: hslToHex(cssVars.cardForeground),
    primary: hslToHex(cssVars.primary),
    primaryForeground: hslToHex(cssVars.primaryForeground),
    secondary: hslToHex(cssVars.secondary),
    secondaryForeground: hslToHex(cssVars.secondaryForeground),
    muted: hslToHex(cssVars.muted),
    mutedForeground: hslToHex(cssVars.mutedForeground),
    accent: hslToHex(cssVars.accent),
    accentForeground: hslToHex(cssVars.accentForeground),
    border: hslToHex(cssVars.border),
    ring: hslToHex(cssVars.ring),
  } : {
    background: promptData.colors.background,
    foreground: promptData.colors.foreground,
    card: promptData.colors.background,
    cardForeground: promptData.colors.foreground,
    primary: promptData.colors.primary,
    primaryForeground: '#ffffff',
    secondary: promptData.colors.secondary,
    secondaryForeground: promptData.colors.foreground,
    muted: promptData.colors.muted,
    mutedForeground: promptData.colors.foreground,
    accent: promptData.colors.accent,
    accentForeground: '#ffffff',
    border: promptData.colors.border,
    ring: promptData.colors.primary,
  };

  return {
    name: promptData.name,
    label: promptData.label,
    description: promptData.description,
    colors,
    fonts: promptData.fonts,
    characteristics: promptData.characteristics,
    useCases: promptData.useCases,
  };
}

/**
 * Export theme as CSS custom properties
 */
export function exportThemeAsCSS(themeName: string, options: { includeComments?: boolean } = {}): string {
  const cssVars = themeCssVariables[themeName];
  const promptData = themePromptData[themeName];

  if (!cssVars && !promptData) {
    return `/* Theme "${themeName}" not found */`;
  }

  const { includeComments = true } = options;

  let css = '';

  if (includeComments && promptData) {
    css += `/**\n * ${promptData.label} Theme\n * ${promptData.description}\n */\n\n`;
  }

  css += `:root {\n`;
  css += `  /* ${promptData?.label || themeName} Theme Colors */\n`;

  if (cssVars) {
    css += `  --background: ${cssVars.background};\n`;
    css += `  --foreground: ${cssVars.foreground};\n`;
    css += `  --card: ${cssVars.card};\n`;
    css += `  --card-foreground: ${cssVars.cardForeground};\n`;
    css += `  --primary: ${cssVars.primary};\n`;
    css += `  --primary-foreground: ${cssVars.primaryForeground};\n`;
    css += `  --secondary: ${cssVars.secondary};\n`;
    css += `  --secondary-foreground: ${cssVars.secondaryForeground};\n`;
    css += `  --muted: ${cssVars.muted};\n`;
    css += `  --muted-foreground: ${cssVars.mutedForeground};\n`;
    css += `  --accent: ${cssVars.accent};\n`;
    css += `  --accent-foreground: ${cssVars.accentForeground};\n`;
    css += `  --border: ${cssVars.border};\n`;
    css += `  --ring: ${cssVars.ring};\n`;
    css += `\n  /* Typography */\n`;
    css += `  --font-sans: ${cssVars.font};\n`;
    css += `  --font-heading: ${cssVars.fontHeading};\n`;
  } else if (promptData) {
    // Fallback to hex values
    css += `  --background: ${hexToHsl(promptData.colors.background)};\n`;
    css += `  --foreground: ${hexToHsl(promptData.colors.foreground)};\n`;
    css += `  --primary: ${hexToHsl(promptData.colors.primary)};\n`;
    css += `  --secondary: ${hexToHsl(promptData.colors.secondary)};\n`;
    css += `  --muted: ${hexToHsl(promptData.colors.muted)};\n`;
    css += `  --accent: ${hexToHsl(promptData.colors.accent)};\n`;
    css += `  --border: ${hexToHsl(promptData.colors.border)};\n`;
    css += `\n  /* Typography */\n`;
    css += `  --font-sans: ${promptData.fonts.body};\n`;
    css += `  --font-heading: ${promptData.fonts.heading};\n`;
  }

  css += `}\n`;

  // Add utility classes
  if (includeComments) {
    css += `\n/* Utility Classes */\n`;
  }
  css += `.bg-background { background-color: hsl(var(--background)); }\n`;
  css += `.text-foreground { color: hsl(var(--foreground)); }\n`;
  css += `.bg-primary { background-color: hsl(var(--primary)); }\n`;
  css += `.text-primary { color: hsl(var(--primary)); }\n`;
  css += `.bg-secondary { background-color: hsl(var(--secondary)); }\n`;
  css += `.bg-muted { background-color: hsl(var(--muted)); }\n`;
  css += `.text-muted-foreground { color: hsl(var(--muted-foreground)); }\n`;
  css += `.border-border { border-color: hsl(var(--border)); }\n`;
  css += `.ring-ring { --tw-ring-color: hsl(var(--ring)); }\n`;

  return css;
}

/**
 * Export theme as JSON configuration
 */
export function exportThemeAsJSON(themeName: string): string {
  const config = getThemeConfig(themeName);
  if (!config) {
    return JSON.stringify({ error: `Theme "${themeName}" not found` }, null, 2);
  }

  const cssVars = themeCssVariables[themeName];

  const exportData = {
    name: config.name,
    label: config.label,
    description: config.description,
    version: '1.0.0',
    type: 'design-system-theme',
    colors: {
      hex: config.colors,
      hsl: cssVars ? {
        background: cssVars.background,
        foreground: cssVars.foreground,
        card: cssVars.card,
        cardForeground: cssVars.cardForeground,
        primary: cssVars.primary,
        primaryForeground: cssVars.primaryForeground,
        secondary: cssVars.secondary,
        secondaryForeground: cssVars.secondaryForeground,
        muted: cssVars.muted,
        mutedForeground: cssVars.mutedForeground,
        accent: cssVars.accent,
        accentForeground: cssVars.accentForeground,
        border: cssVars.border,
        ring: cssVars.ring,
      } : undefined,
    },
    typography: {
      fontFamily: {
        sans: config.fonts.body,
        heading: config.fonts.heading,
      },
    },
    metadata: {
      characteristics: config.characteristics,
      useCases: config.useCases,
      exportedAt: new Date().toISOString(),
    },
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export theme as Tailwind CSS configuration
 */
export function exportThemeAsTailwind(themeName: string): string {
  const config = getThemeConfig(themeName);
  if (!config) {
    return `// Theme "${themeName}" not found`;
  }

  return `// ${config.label} Theme - Tailwind Configuration
// ${config.description}

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: ['${config.fonts.body.split(',')[0].replace(/['"]/g, '')}', 'system-ui', 'sans-serif'],
        heading: ['${config.fonts.heading.split(',')[0].replace(/['"]/g, '')}', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}

/*
 * CSS Variables to add to your globals.css:
 *
 * @layer base {
 *   :root {
 *     --background: ${themeCssVariables[themeName]?.background || '0 0% 100%'};
 *     --foreground: ${themeCssVariables[themeName]?.foreground || '0 0% 0%'};
 *     --primary: ${themeCssVariables[themeName]?.primary || '0 0% 50%'};
 *     --primary-foreground: ${themeCssVariables[themeName]?.primaryForeground || '0 0% 100%'};
 *     --secondary: ${themeCssVariables[themeName]?.secondary || '0 0% 90%'};
 *     --secondary-foreground: ${themeCssVariables[themeName]?.secondaryForeground || '0 0% 10%'};
 *     --muted: ${themeCssVariables[themeName]?.muted || '0 0% 95%'};
 *     --muted-foreground: ${themeCssVariables[themeName]?.mutedForeground || '0 0% 40%'};
 *     --accent: ${themeCssVariables[themeName]?.accent || '0 0% 50%'};
 *     --accent-foreground: ${themeCssVariables[themeName]?.accentForeground || '0 0% 100%'};
 *     --border: ${themeCssVariables[themeName]?.border || '0 0% 85%'};
 *     --ring: ${themeCssVariables[themeName]?.ring || '0 0% 50%'};
 *     --radius: 0.5rem;
 *   }
 * }
 */
`;
}

/**
 * Generate AI reference prompt for a theme
 */
export function generateThemeReferencePrompt(themeName: string): string {
  const promptData = themePromptData[themeName];
  const cssVars = themeCssVariables[themeName];

  if (!promptData) {
    return `Theme "${themeName}" not found.`;
  }

  return `# Theme Reference: ${promptData.label}

## Overview
${promptData.description}

## Design Direction
I want you to use the **${promptData.label}** design aesthetic for this project. Here are the key characteristics:

${promptData.characteristics.map(c => `- ${c}`).join('\n')}

## Color Palette (HSL Values)
${cssVars ? `- Background: hsl(${cssVars.background})
- Foreground/Text: hsl(${cssVars.foreground})
- Primary: hsl(${cssVars.primary})
- Primary Foreground: hsl(${cssVars.primaryForeground})
- Secondary: hsl(${cssVars.secondary})
- Muted: hsl(${cssVars.muted})
- Muted Text: hsl(${cssVars.mutedForeground})
- Accent: hsl(${cssVars.accent})
- Border: hsl(${cssVars.border})` : `- Background: ${promptData.colors.background}
- Foreground/Text: ${promptData.colors.foreground}
- Primary: ${promptData.colors.primary}
- Secondary: ${promptData.colors.secondary}
- Muted: ${promptData.colors.muted}
- Accent: ${promptData.colors.accent}
- Border: ${promptData.colors.border}`}

## Typography
- Body Font: ${promptData.fonts.body}
- Heading Font: ${promptData.fonts.heading}

## Best Used For
${promptData.useCases.map(u => `- ${u}`).join('\n')}

## Instructions
Please apply this design system consistently across all UI components. Use the color palette for backgrounds, text, buttons, and interactive elements. Maintain the typographic hierarchy using the specified fonts. The overall aesthetic should feel ${promptData.characteristics.slice(0, 3).join(', ').toLowerCase()}.
`;
}

/**
 * Download a file with the given content
 */
export function downloadThemeFile(
  themeName: string,
  format: 'css' | 'json' | 'tailwind',
  content?: string
): void {
  let fileContent: string;
  let fileName: string;
  let mimeType: string;

  switch (format) {
    case 'css':
      fileContent = content || exportThemeAsCSS(themeName);
      fileName = `${themeName}-theme.css`;
      mimeType = 'text/css';
      break;
    case 'json':
      fileContent = content || exportThemeAsJSON(themeName);
      fileName = `${themeName}-theme.json`;
      mimeType = 'application/json';
      break;
    case 'tailwind':
      fileContent = content || exportThemeAsTailwind(themeName);
      fileName = `${themeName}-tailwind.config.js`;
      mimeType = 'text/javascript';
      break;
  }

  const blob = new Blob([fileContent], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy theme content to clipboard
 */
export async function copyThemeToClipboard(
  themeName: string,
  format: 'css' | 'json' | 'tailwind' | 'reference'
): Promise<boolean> {
  let content: string;

  switch (format) {
    case 'css':
      content = exportThemeAsCSS(themeName);
      break;
    case 'json':
      content = exportThemeAsJSON(themeName);
      break;
    case 'tailwind':
      content = exportThemeAsTailwind(themeName);
      break;
    case 'reference':
      content = generateThemeReferencePrompt(themeName);
      break;
  }

  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
