'use client';

import { useMemo } from 'react';
import { useDesignTheme } from '@/context/DesignThemeContext';

// iPod skin variants that map to theme characteristics
export type iPodSkinVariant = 'classic' | 'mini' | 'nano' | 'modern' | 'glass';

interface iPodSkinColors {
  // Body colors
  bodyGradientFrom: string;
  bodyGradientTo: string;
  bodyBorder: string;

  // Screen colors
  screenBackground: string;
  screenBorder: string;
  screenText: string;
  screenTextMuted: string;
  screenAccent: string;
  screenHighlight: string;

  // Click wheel colors
  wheelGradientFrom: string;
  wheelGradientTo: string;
  wheelButtonText: string;
  wheelCenterGradientFrom: string;
  wheelCenterGradientTo: string;

  // Glow/shadow
  shadowColor: string;
  glowColor: string;
}

interface iPodSkinConfig {
  variant: iPodSkinVariant;
  colors: iPodSkinColors;
  // CSS class overrides
  bodyClass: string;
  screenClass: string;
  wheelClass: string;
}

// Map theme names to skin variants
function getVariantForTheme(theme: string): iPodSkinVariant {
  const modernThemes = ['vercel', 'claude', 'chatgpt', 'notion', 'cursor', 'clean-slate', 'modern-minimal'];
  const glassThemes = ['cosmic-night', 'northern-lights', 'cyberpunk', 'midnight-bloom', 'amethyst-haze'];
  const nanoThemes = ['candyland', 'pastel-dreams', 'soft-pop', 'quantum-rose'];
  const miniThemes = ['retro-arcade', 'doom-64', 'bold-tech'];

  if (modernThemes.includes(theme)) return 'modern';
  if (glassThemes.includes(theme)) return 'glass';
  if (nanoThemes.includes(theme)) return 'nano';
  if (miniThemes.includes(theme)) return 'mini';
  return 'classic';
}

// Generate skin colors from CSS variables
function generateSkinColors(variant: iPodSkinVariant): iPodSkinColors {
  // Base colors using CSS variables - these will be resolved at render time
  const base: iPodSkinColors = {
    bodyGradientFrom: 'hsl(var(--theme-card))',
    bodyGradientTo: 'hsl(var(--theme-muted))',
    bodyBorder: 'hsl(var(--theme-border) / 0.5)',

    screenBackground: 'hsl(var(--theme-secondary))',
    screenBorder: 'hsl(var(--theme-border))',
    screenText: 'hsl(var(--theme-foreground))',
    screenTextMuted: 'hsl(var(--theme-muted-foreground))',
    screenAccent: 'hsl(var(--theme-primary))',
    screenHighlight: 'hsl(var(--theme-accent))',

    wheelGradientFrom: 'hsl(var(--theme-card))',
    wheelGradientTo: 'hsl(var(--theme-muted))',
    wheelButtonText: 'hsl(var(--theme-muted-foreground))',
    wheelCenterGradientFrom: 'hsl(var(--theme-background))',
    wheelCenterGradientTo: 'hsl(var(--theme-card))',

    shadowColor: 'hsl(var(--theme-foreground) / 0.2)',
    glowColor: 'hsl(var(--theme-primary) / 0.3)',
  };

  // Variant-specific overrides
  switch (variant) {
    case 'glass':
      return {
        ...base,
        bodyGradientFrom: 'hsl(var(--theme-background) / 0.8)',
        bodyGradientTo: 'hsl(var(--theme-card) / 0.6)',
        bodyBorder: 'hsl(var(--theme-border) / 0.3)',
        screenBackground: 'hsl(var(--theme-background) / 0.5)',
        glowColor: 'hsl(var(--theme-accent) / 0.4)',
      };

    case 'nano':
      return {
        ...base,
        screenBackground: 'hsl(var(--theme-primary) / 0.15)',
        screenAccent: 'hsl(var(--theme-accent))',
      };

    case 'mini':
      return {
        ...base,
        bodyGradientFrom: 'hsl(var(--theme-primary) / 0.1)',
        bodyGradientTo: 'hsl(var(--theme-secondary))',
      };

    case 'modern':
      return {
        ...base,
        bodyGradientFrom: 'hsl(var(--theme-background))',
        bodyGradientTo: 'hsl(var(--theme-card))',
        screenBackground: 'hsl(var(--theme-card))',
        wheelGradientFrom: 'hsl(var(--theme-muted))',
        wheelGradientTo: 'hsl(var(--theme-secondary))',
      };

    default:
      return base;
  }
}

// Generate CSS classes for the skin
function generateSkinClasses(variant: iPodSkinVariant): Pick<iPodSkinConfig, 'bodyClass' | 'screenClass' | 'wheelClass'> {
  const baseBody = 'rounded-[32px] p-4 shadow-[0_25px_50px_-12px_var(--shadow-color)] border';
  const baseScreen = 'rounded-lg p-3 mb-4 shadow-inner border-2 relative overflow-hidden';
  const baseWheel = 'relative mx-auto rounded-full shadow-lg';

  switch (variant) {
    case 'glass':
      return {
        bodyClass: `${baseBody} backdrop-blur-xl`,
        screenClass: `${baseScreen} backdrop-blur-sm`,
        wheelClass: `${baseWheel} backdrop-blur-sm`,
      };

    case 'nano':
      return {
        bodyClass: `${baseBody} rounded-[24px]`,
        screenClass: `${baseScreen} rounded-md`,
        wheelClass: `${baseWheel}`,
      };

    case 'modern':
      return {
        bodyClass: `${baseBody} rounded-[28px]`,
        screenClass: `${baseScreen} rounded-xl`,
        wheelClass: `${baseWheel}`,
      };

    default:
      return {
        bodyClass: baseBody,
        screenClass: baseScreen,
        wheelClass: baseWheel,
      };
  }
}

export function useIPodSkin(): iPodSkinConfig {
  const { designTheme } = useDesignTheme();

  return useMemo(() => {
    const variant = getVariantForTheme(designTheme);
    const colors = generateSkinColors(variant);
    const classes = generateSkinClasses(variant);

    return {
      variant,
      colors,
      ...classes,
    };
  }, [designTheme]);
}

// Component that provides CSS variables for the iPod skin
export function IPodSkinProvider({ children }: { children: React.ReactNode }) {
  const skin = useIPodSkin();

  const style = {
    '--ipod-body-from': skin.colors.bodyGradientFrom,
    '--ipod-body-to': skin.colors.bodyGradientTo,
    '--ipod-body-border': skin.colors.bodyBorder,
    '--ipod-screen-bg': skin.colors.screenBackground,
    '--ipod-screen-border': skin.colors.screenBorder,
    '--ipod-screen-text': skin.colors.screenText,
    '--ipod-screen-text-muted': skin.colors.screenTextMuted,
    '--ipod-screen-accent': skin.colors.screenAccent,
    '--ipod-screen-highlight': skin.colors.screenHighlight,
    '--ipod-wheel-from': skin.colors.wheelGradientFrom,
    '--ipod-wheel-to': skin.colors.wheelGradientTo,
    '--ipod-wheel-text': skin.colors.wheelButtonText,
    '--ipod-wheel-center-from': skin.colors.wheelCenterGradientFrom,
    '--ipod-wheel-center-to': skin.colors.wheelCenterGradientTo,
    '--ipod-shadow': skin.colors.shadowColor,
    '--ipod-glow': skin.colors.glowColor,
  } as React.CSSProperties;

  return (
    <div style={style} data-ipod-variant={skin.variant}>
      {children}
    </div>
  );
}

// Export skin config for direct use
export { getVariantForTheme, generateSkinColors };
