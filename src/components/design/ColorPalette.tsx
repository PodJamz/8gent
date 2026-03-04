'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy } from 'lucide-react';

interface ColorSwatch {
  name: string;
  variable: string;
  hex: string;
}

interface ColorPaletteProps {
  colors: ColorSwatch[];
  className?: string;
}

export function ColorPalette({ colors, className = '' }: ColorPaletteProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (hex: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 ${className}`}>
      {colors.map((color, index) => (
        <motion.button
          key={color.variable}
          onClick={() => copyToClipboard(color.hex, index)}
          className="group relative flex flex-col rounded-lg overflow-hidden border transition-all hover:scale-105 active:scale-95"
          style={{ borderColor: 'hsl(var(--theme-border))' }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Color preview */}
          <div
            className="h-16 w-full relative"
            style={{ backgroundColor: color.hex }}
          >
            {/* Copy indicator overlay */}
            <AnimatePresence>
              {copiedIndex === index ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30"
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors"
                >
                  <Copy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Color info */}
          <div
            className="p-2 text-left"
            style={{ backgroundColor: 'hsl(var(--theme-card))' }}
          >
            <p
              className="text-xs font-medium truncate"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              {color.name}
            </p>
            <p
              className="text-[10px] font-mono uppercase"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {color.hex}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

// Helper function to convert HSL string to hex
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Theme color definitions with hex values
export const themeColors: Record<string, ColorSwatch[]> = {
  utilitarian: [
    { name: 'Background', variable: '--theme-background', hex: '#EDE8DE' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#000000' },
    { name: 'Primary', variable: '--theme-primary', hex: '#E85D2D' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#D6D0C4' },
    { name: 'Muted', variable: '--theme-muted', hex: '#DFDBD2' },
    { name: 'Border', variable: '--theme-border', hex: '#000000' },
  ],
  base: [
    { name: 'Background', variable: '--theme-background', hex: '#FFFFFF' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#0F172A' },
    { name: 'Primary', variable: '--theme-primary', hex: '#1E293B' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#F1F5F9' },
    { name: 'Muted', variable: '--theme-muted', hex: '#F1F5F9' },
    { name: 'Border', variable: '--theme-border', hex: '#E2E8F0' },
  ],
  claude: [
    { name: 'Background', variable: '--theme-background', hex: '#FCF9F6' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#1F1A16' },
    { name: 'Primary', variable: '--theme-primary', hex: '#E07A3A' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#E8E0D5' },
    { name: 'Accent', variable: '--theme-accent', hex: '#E88E54' },
    { name: 'Border', variable: '--theme-border', hex: '#D6CCC0' },
  ],
  chatgpt: [
    { name: 'Background', variable: '--theme-background', hex: '#F9FAFB' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#1A202C' },
    { name: 'Primary', variable: '--theme-primary', hex: '#10A37F' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#E8EBEF' },
    { name: 'Muted', variable: '--theme-muted', hex: '#EEF0F3' },
    { name: 'Border', variable: '--theme-border', hex: '#D9DEE5' },
  ],
  vercel: [
    { name: 'Background', variable: '--theme-background', hex: '#FFFFFF' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#0D0D0D' },
    { name: 'Primary', variable: '--theme-primary', hex: '#0D0D0D' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#F2F2F2' },
    { name: 'Muted', variable: '--theme-muted', hex: '#F5F5F5' },
    { name: 'Border', variable: '--theme-border', hex: '#E5E5E5' },
  ],
  'kodama-grove': [
    { name: 'Background', variable: '--theme-background', hex: '#F4F8F4' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#152815' },
    { name: 'Primary', variable: '--theme-primary', hex: '#22A854' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#D8E5D8' },
    { name: 'Accent', variable: '--theme-accent', hex: '#36B463' },
    { name: 'Border', variable: '--theme-border', hex: '#BFD4BF' },
  ],
  'vintage-paper': [
    { name: 'Background', variable: '--theme-background', hex: '#F5EDE0' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#2F2720' },
    { name: 'Primary', variable: '--theme-primary', hex: '#8B6B4A' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#E0D4C3' },
    { name: 'Accent', variable: '--theme-accent', hex: '#B08456' },
    { name: 'Border', variable: '--theme-border', hex: '#C5B69B' },
  ],
  claymorphism: [
    { name: 'Background', variable: '--theme-background', hex: '#F4F6F9' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#1F2937' },
    { name: 'Primary', variable: '--theme-primary', hex: '#3B82F6' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#D8DEE8' },
    { name: 'Accent', variable: '--theme-accent', hex: '#A855F7' },
    { name: 'Border', variable: '--theme-border', hex: '#CBD5E1' },
  ],
  nature: [
    { name: 'Background', variable: '--theme-background', hex: '#F6F3ED' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#27231B' },
    { name: 'Primary', variable: '--theme-primary', hex: '#6B8E23' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#DDD7CA' },
    { name: 'Accent', variable: '--theme-accent', hex: '#CD853F' },
    { name: 'Border', variable: '--theme-border', hex: '#C7BDA8' },
  ],
  'neo-brutalism': [
    { name: 'Background', variable: '--theme-background', hex: '#FFFFE0' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#000000' },
    { name: 'Primary', variable: '--theme-primary', hex: '#000000' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#FFD700' },
    { name: 'Accent', variable: '--theme-accent', hex: '#FF3366' },
    { name: 'Border', variable: '--theme-border', hex: '#000000' },
  ],
  'elegant-luxury': [
    { name: 'Background', variable: '--theme-background', hex: '#1A1A1A' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#F5F5F5' },
    { name: 'Primary', variable: '--theme-primary', hex: '#D4AF37' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#2D2D2D' },
    { name: 'Accent', variable: '--theme-accent', hex: '#E5C76B' },
    { name: 'Border', variable: '--theme-border', hex: '#404040' },
  ],
  'pastel-dreams': [
    { name: 'Background', variable: '--theme-background', hex: '#FFF5F8' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#4A3F52' },
    { name: 'Primary', variable: '--theme-primary', hex: '#FFB6C1' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#E6F3FF' },
    { name: 'Accent', variable: '--theme-accent', hex: '#DDA0DD' },
    { name: 'Border', variable: '--theme-border', hex: '#FFE4E8' },
  ],
  'cosmic-night': [
    { name: 'Background', variable: '--theme-background', hex: '#0D0D1A' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#E8E8F0' },
    { name: 'Primary', variable: '--theme-primary', hex: '#8B5CF6' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#1A1A2E' },
    { name: 'Accent', variable: '--theme-accent', hex: '#06B6D4' },
    { name: 'Border', variable: '--theme-border', hex: '#2D2D4A' },
  ],
  'clean-slate': [
    { name: 'Background', variable: '--theme-background', hex: '#FAFBFC' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#1F2328' },
    { name: 'Primary', variable: '--theme-primary', hex: '#0969DA' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#F6F8FA' },
    { name: 'Muted', variable: '--theme-muted', hex: '#F6F8FA' },
    { name: 'Border', variable: '--theme-border', hex: '#D0D7DE' },
  ],
  caffeine: [
    { name: 'Background', variable: '--theme-background', hex: '#1C1816' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#F5F0EB' },
    { name: 'Primary', variable: '--theme-primary', hex: '#8B4513' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#2D2520' },
    { name: 'Accent', variable: '--theme-accent', hex: '#D2691E' },
    { name: 'Border', variable: '--theme-border', hex: '#3D352F' },
  ],
  'ocean-breeze': [
    { name: 'Background', variable: '--theme-background', hex: '#F0F9FF' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#0C4A6E' },
    { name: 'Primary', variable: '--theme-primary', hex: '#0EA5E9' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#E0F2FE' },
    { name: 'Accent', variable: '--theme-accent', hex: '#06B6D4' },
    { name: 'Border', variable: '--theme-border', hex: '#BAE6FD' },
  ],
  perpetuity: [
    { name: 'Background', variable: '--theme-background', hex: '#0F0F0F' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#FAFAFA' },
    { name: 'Primary', variable: '--theme-primary', hex: '#FAFAFA' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#1F1F1F' },
    { name: 'Muted', variable: '--theme-muted', hex: '#262626' },
    { name: 'Border', variable: '--theme-border', hex: '#2D2D2D' },
  ],
  'midnight-bloom': [
    { name: 'Background', variable: '--theme-background', hex: '#1A0A1F' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#F8E8FF' },
    { name: 'Primary', variable: '--theme-primary', hex: '#D946EF' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#2D1536' },
    { name: 'Accent', variable: '--theme-accent', hex: '#F0ABFC' },
    { name: 'Border', variable: '--theme-border', hex: '#4A204F' },
  ],
  'northern-lights': [
    { name: 'Background', variable: '--theme-background', hex: '#0A1628' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#E8F4F8' },
    { name: 'Primary', variable: '--theme-primary', hex: '#22D3EE' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#1E3A5F' },
    { name: 'Accent', variable: '--theme-accent', hex: '#34D399' },
    { name: 'Border', variable: '--theme-border', hex: '#2D4A6F' },
  ],
  'sunset-horizon': [
    { name: 'Background', variable: '--theme-background', hex: '#FFF7ED' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#7C2D12' },
    { name: 'Primary', variable: '--theme-primary', hex: '#F97316' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#FED7AA' },
    { name: 'Accent', variable: '--theme-accent', hex: '#FB923C' },
    { name: 'Border', variable: '--theme-border', hex: '#FDBA74' },
  ],
  'modern-minimal': [
    { name: 'Background', variable: '--theme-background', hex: '#FFFFFF' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#171717' },
    { name: 'Primary', variable: '--theme-primary', hex: '#171717' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#F5F5F5' },
    { name: 'Muted', variable: '--theme-muted', hex: '#F5F5F5' },
    { name: 'Border', variable: '--theme-border', hex: '#E5E5E5' },
  ],
  candyland: [
    { name: 'Background', variable: '--theme-background', hex: '#FFF0F5' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#831843' },
    { name: 'Primary', variable: '--theme-primary', hex: '#EC4899' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#E0F2FE' },
    { name: 'Accent', variable: '--theme-accent', hex: '#A855F7' },
    { name: 'Border', variable: '--theme-border', hex: '#FBCFE8' },
  ],
  cyberpunk: [
    { name: 'Background', variable: '--theme-background', hex: '#0A0A0F' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#00FF9F' },
    { name: 'Primary', variable: '--theme-primary', hex: '#FF00FF' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#1A1A2E' },
    { name: 'Accent', variable: '--theme-accent', hex: '#00FFFF' },
    { name: 'Border', variable: '--theme-border', hex: '#FF00FF' },
  ],
  'retro-arcade': [
    { name: 'Background', variable: '--theme-background', hex: '#0F0F23' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#00FF00' },
    { name: 'Primary', variable: '--theme-primary', hex: '#FF0000' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#1A1A3A' },
    { name: 'Accent', variable: '--theme-accent', hex: '#FFFF00' },
    { name: 'Border', variable: '--theme-border', hex: '#00FF00' },
  ],
  'quantum-rose': [
    { name: 'Background', variable: '--theme-background', hex: '#FDF2F8' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#500724' },
    { name: 'Primary', variable: '--theme-primary', hex: '#DB2777' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#FCE7F3' },
    { name: 'Accent', variable: '--theme-accent', hex: '#EC4899' },
    { name: 'Border', variable: '--theme-border', hex: '#F9A8D4' },
  ],
  'bold-tech': [
    { name: 'Background', variable: '--theme-background', hex: '#18181B' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#FAFAFA' },
    { name: 'Primary', variable: '--theme-primary', hex: '#2563EB' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#27272A' },
    { name: 'Accent', variable: '--theme-accent', hex: '#3B82F6' },
    { name: 'Border', variable: '--theme-border', hex: '#3F3F46' },
  ],
  'violet-bloom': [
    { name: 'Background', variable: '--theme-background', hex: '#FAF5FF' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#4C1D95' },
    { name: 'Primary', variable: '--theme-primary', hex: '#8B5CF6' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#EDE9FE' },
    { name: 'Accent', variable: '--theme-accent', hex: '#A78BFA' },
    { name: 'Border', variable: '--theme-border', hex: '#DDD6FE' },
  ],
  't3-chat': [
    { name: 'Background', variable: '--theme-background', hex: '#09090B' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#FAFAFA' },
    { name: 'Primary', variable: '--theme-primary', hex: '#A855F7' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#18181B' },
    { name: 'Accent', variable: '--theme-accent', hex: '#C084FC' },
    { name: 'Border', variable: '--theme-border', hex: '#27272A' },
  ],
  'mocha-mousse': [
    { name: 'Background', variable: '--theme-background', hex: '#F5EDE6' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#3D2F2A' },
    { name: 'Primary', variable: '--theme-primary', hex: '#8B5A3C' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#E5D9CE' },
    { name: 'Accent', variable: '--theme-accent', hex: '#A67B5B' },
    { name: 'Border', variable: '--theme-border', hex: '#D4C4B5' },
  ],
  'amethyst-haze': [
    { name: 'Background', variable: '--theme-background', hex: '#1C1625' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#E9E4F0' },
    { name: 'Primary', variable: '--theme-primary', hex: '#9F7AEA' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#2D2640' },
    { name: 'Accent', variable: '--theme-accent', hex: '#B794F4' },
    { name: 'Border', variable: '--theme-border', hex: '#4A3F5C' },
  ],
  'doom-64': [
    { name: 'Background', variable: '--theme-background', hex: '#0D0D0D' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#8B0000' },
    { name: 'Primary', variable: '--theme-primary', hex: '#FF0000' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#1A0000' },
    { name: 'Accent', variable: '--theme-accent', hex: '#FF4444' },
    { name: 'Border', variable: '--theme-border', hex: '#4A0000' },
  ],
  'amber-minimal': [
    { name: 'Background', variable: '--theme-background', hex: '#FFFBEB' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#78350F' },
    { name: 'Primary', variable: '--theme-primary', hex: '#D97706' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#FEF3C7' },
    { name: 'Accent', variable: '--theme-accent', hex: '#F59E0B' },
    { name: 'Border', variable: '--theme-border', hex: '#FDE68A' },
  ],
  'solar-dusk': [
    { name: 'Background', variable: '--theme-background', hex: '#1F1720' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#FDE68A' },
    { name: 'Primary', variable: '--theme-primary', hex: '#F97316' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#2D2030' },
    { name: 'Accent', variable: '--theme-accent', hex: '#FB923C' },
    { name: 'Border', variable: '--theme-border', hex: '#4A3545' },
  ],
  'starry-night': [
    { name: 'Background', variable: '--theme-background', hex: '#0F172A' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#FDE047' },
    { name: 'Primary', variable: '--theme-primary', hex: '#3B82F6' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#1E293B' },
    { name: 'Accent', variable: '--theme-accent', hex: '#60A5FA' },
    { name: 'Border', variable: '--theme-border', hex: '#334155' },
  ],
  'soft-pop': [
    { name: 'Background', variable: '--theme-background', hex: '#FEFCE8' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#1E1B4B' },
    { name: 'Primary', variable: '--theme-primary', hex: '#E879F9' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#FCE7F3' },
    { name: 'Accent', variable: '--theme-accent', hex: '#A855F7' },
    { name: 'Border', variable: '--theme-border', hex: '#F5D0FE' },
  ],
  'sage-garden': [
    { name: 'Background', variable: '--theme-background', hex: '#F1F5F0' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#2F3E2F' },
    { name: 'Primary', variable: '--theme-primary', hex: '#6B8E6B' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#DCE5DC' },
    { name: 'Accent', variable: '--theme-accent', hex: '#8BA888' },
    { name: 'Border', variable: '--theme-border', hex: '#B8C9B8' },
  ],
  notebook: [
    { name: 'Background', variable: '--theme-background', hex: '#FFFEF5' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#1C1917' },
    { name: 'Primary', variable: '--theme-primary', hex: '#3B82F6' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#FEF9C3' },
    { name: 'Accent', variable: '--theme-accent', hex: '#EF4444' },
    { name: 'Border', variable: '--theme-border', hex: '#93C5FD' },
  ],
  research: [
    { name: 'Background', variable: '--theme-background', hex: '#FAFAF8' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#1F2937' },
    { name: 'Primary', variable: '--theme-primary', hex: '#1E40AF' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#F3F4F6' },
    { name: 'Accent', variable: '--theme-accent', hex: '#2563EB' },
    { name: 'Border', variable: '--theme-border', hex: '#E5E7EB' },
  ],
  'kinetic-editorial': [
    { name: 'Background', variable: '--theme-background', hex: '#FCFCFC' },
    { name: 'Foreground', variable: '--theme-foreground', hex: '#0A0A0A' },
    { name: 'Primary', variable: '--theme-primary', hex: '#0A0A0A' },
    { name: 'Secondary', variable: '--theme-secondary', hex: '#F5F5F5' },
    { name: 'Accent', variable: '--theme-accent', hex: '#0A0A0A' },
    { name: 'Border', variable: '--theme-border', hex: '#E0E0E0' },
  ],
};
