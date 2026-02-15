export const themes = [
  { name: 'utilitarian', label: 'Utilitarian' },
  { name: 'base', label: 'Default' },
  { name: 'claude', label: 'Claude' },
  { name: 'chatgpt', label: 'ChatGPT' },
  { name: 'vercel', label: 'Vercel' },
  { name: 'kodama-grove', label: 'Kodama Grove' },
  { name: 'vintage-paper', label: 'Vintage Paper' },
  { name: 'claymorphism', label: 'Claymorphism' },
  { name: 'nature', label: 'Nature' },
  { name: 'neo-brutalism', label: 'Neo Brutalism' },
  { name: 'elegant-luxury', label: 'Elegant Luxury' },
  { name: 'pastel-dreams', label: 'Pastel Dreams' },
  { name: 'cosmic-night', label: 'Cosmic Night' },
  { name: 'clean-slate', label: 'Clean Slate' },
  { name: 'caffeine', label: 'Caffeine' },
  { name: 'ocean-breeze', label: 'Ocean Breeze' },
  { name: 'perpetuity', label: 'Perpetuity' },
  { name: 'midnight-bloom', label: 'Midnight Bloom' },
  { name: 'northern-lights', label: 'Northern Lights' },
  { name: 'sunset-horizon', label: 'Sunset Horizon' },
  { name: 'modern-minimal', label: 'Modern Minimal' },
  { name: 'candyland', label: 'Candyland' },
  { name: 'cyberpunk', label: 'Cyberpunk' },
  { name: 'retro-arcade', label: 'Retro Arcade' },
  { name: 'quantum-rose', label: 'Quantum Rose' },
  { name: 'bold-tech', label: 'Bold Tech' },
  { name: 'violet-bloom', label: 'Violet Bloom' },
  { name: 't3-chat', label: 'T3 Chat' },
  { name: 'mocha-mousse', label: 'Mocha Mousse' },
  { name: 'amethyst-haze', label: 'Amethyst Haze' },
  { name: 'doom-64', label: 'Doom 64' },
  { name: 'amber-minimal', label: 'Amber Minimal' },
  { name: 'solar-dusk', label: 'Solar Dusk' },
  { name: 'starry-night', label: 'Starry Night' },
  { name: 'soft-pop', label: 'Soft Pop' },
  { name: 'sage-garden', label: 'Sage Garden' },
] as const;

export type ThemeName = (typeof themes)[number]['name'];

export function isValidTheme(theme: string): theme is ThemeName {
  return themes.some((t) => t.name === theme);
}

export function getThemeLabel(name: ThemeName): string {
  return themes.find((t) => t.name === name)?.label ?? name;
}
