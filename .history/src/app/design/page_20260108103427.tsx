'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Palette, ChevronDown, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import BlurFade from '@/components/magicui/blur-fade';
import { TextEffect } from '@/components/ui/text-effect';
import { themes, ThemeName } from '@/lib/themes';
import '@/lib/themes/themes.css';

interface ThemeCardContent {
  headline: string;
  subhead: string;
  stat?: string;
  statLabel?: string;
  tagline?: string;
  category?: string;
  date?: string;
  edition?: string;
}

const themeContent: Record<ThemeName, ThemeCardContent> = {
  'utilitarian': {
    headline: 'Function Over Form',
    subhead: 'Every element earns its place',
    stat: '01',
    statLabel: 'PRINCIPLE',
    category: 'DESIGN SYSTEM',
    tagline: 'Less, but better',
  },
  'base': {
    headline: 'The Foundation',
    subhead: 'Where every journey begins',
    stat: '∞',
    statLabel: 'POSSIBILITIES',
    category: 'DEFAULTS',
    tagline: 'Built to extend',
  },
  'claude': {
    headline: 'Warm Intelligence',
    subhead: 'AI with humanity at its core',
    stat: '24°',
    statLabel: 'TERRACOTTA',
    category: 'ANTHROPIC',
    tagline: 'Thoughtful by design',
  },
  'chatgpt': {
    headline: 'Conversational AI',
    subhead: 'The interface that changed everything',
    stat: 'GPT',
    statLabel: 'POWERED',
    category: 'OPENAI',
    tagline: 'Just ask',
  },
  'vercel': {
    headline: 'Ship It',
    subhead: 'From localhost to the world',
    stat: '▲',
    statLabel: 'DEPLOYED',
    category: 'FRAMEWORK',
    tagline: 'Develop. Preview. Ship.',
  },
  'kodama-grove': {
    headline: 'Spirit of the Forest',
    subhead: 'Where technology meets nature',
    stat: '142',
    statLabel: 'FOREST HUE',
    category: 'ORGANIC',
    tagline: 'Grow with purpose',
  },
  'vintage-paper': {
    headline: 'Aged to Perfection',
    subhead: 'Stories worth preserving',
    stat: '1923',
    statLabel: 'TIMELESS',
    category: 'HERITAGE',
    tagline: 'Classic never fades',
  },
  'claymorphism': {
    headline: 'Soft Dimension',
    subhead: 'Tactile interfaces for digital spaces',
    stat: '3D',
    statLabel: 'DEPTH',
    category: 'MATERIAL',
    tagline: 'Touch the interface',
  },
  'nature': {
    headline: 'Earth Tones',
    subhead: 'Grounded in authenticity',
    stat: '85%',
    statLabel: 'ORGANIC',
    category: 'SUSTAINABLE',
    tagline: 'Return to roots',
  },
  'neo-brutalism': {
    headline: 'RAW POWER',
    subhead: 'Unapologetic design statements',
    stat: '100%',
    statLabel: 'CONTRAST',
    category: 'BOLD',
    tagline: 'No compromises',
  },
  'elegant-luxury': {
    headline: 'Refined Excellence',
    subhead: 'Where sophistication meets substance',
    stat: '24K',
    statLabel: 'PREMIUM',
    category: 'EXCLUSIVE',
    tagline: 'Elevate everything',
  },
  'pastel-dreams': {
    headline: 'Soft Focus',
    subhead: 'Gentle on the eyes, bold in vision',
    stat: '∿',
    statLabel: 'SERENE',
    category: 'CALMING',
    tagline: 'Dream in color',
  },
  'cosmic-night': {
    headline: 'Deep Space',
    subhead: 'Explore the infinite darkness',
    stat: '∞',
    statLabel: 'LIGHT YEARS',
    category: 'STELLAR',
    tagline: 'Beyond the horizon',
  },
  'clean-slate': {
    headline: 'Pure Simplicity',
    subhead: 'Clarity through reduction',
    stat: '0',
    statLabel: 'DISTRACTIONS',
    category: 'MINIMAL',
    tagline: 'Start fresh',
  },
  'caffeine': {
    headline: 'Morning Ritual',
    subhead: 'Fuel for creative minds',
    stat: '6AM',
    statLabel: 'FIRST BREW',
    category: 'ENERGIZE',
    tagline: 'Ideas percolate',
  },
  'ocean-breeze': {
    headline: 'Coastal Calm',
    subhead: 'Where waves meet innovation',
    stat: '200M',
    statLabel: 'DEPTH',
    category: 'MARITIME',
    tagline: 'Flow state',
  },
  'perpetuity': {
    headline: 'Eternal Gray',
    subhead: 'Timeless monochrome elegance',
    stat: '∞',
    statLabel: 'FOREVER',
    category: 'ENDURING',
    tagline: 'Never out of style',
  },
  'midnight-bloom': {
    headline: 'Night Garden',
    subhead: 'Beauty flourishes in darkness',
    stat: '12AM',
    statLabel: 'BLOOM TIME',
    category: 'NOCTURNAL',
    tagline: 'Grow after dark',
  },
  'northern-lights': {
    headline: 'Aurora',
    subhead: 'Dancing light in polar skies',
    stat: '67°N',
    statLabel: 'LATITUDE',
    category: 'PHENOMENON',
    tagline: 'Nature performs',
  },
  'sunset-horizon': {
    headline: 'Golden Hour',
    subhead: 'When magic paints the sky',
    stat: '7:42',
    statLabel: 'PM',
    category: 'TWILIGHT',
    tagline: 'Chase the light',
  },
  'modern-minimal': {
    headline: 'Zero Waste',
    subhead: 'Only the essential remains',
    stat: '—',
    statLabel: 'NOTHING MORE',
    category: 'PURE',
    tagline: 'Subtract to add',
  },
  'candyland': {
    headline: 'Sweet Dreams',
    subhead: 'Where imagination runs wild',
    stat: '100%',
    statLabel: 'JOY',
    category: 'PLAYFUL',
    tagline: 'Life is sweet',
  },
  'cyberpunk': {
    headline: 'NEON FUTURE',
    subhead: 'High tech, low life',
    stat: '2077',
    statLabel: 'YEAR',
    category: 'DYSTOPIA',
    tagline: 'Jack in',
  },
  'retro-arcade': {
    headline: 'INSERT COIN',
    subhead: 'Press start to continue',
    stat: '1UP',
    statLabel: 'EXTRA LIFE',
    category: '8-BIT',
    tagline: 'Game on',
  },
  'quantum-rose': {
    headline: 'Soft Power',
    subhead: 'Strength in gentle hues',
    stat: '350',
    statLabel: 'ROSE HUE',
    category: 'FEMININE',
    tagline: 'Grace under pressure',
  },
  'bold-tech': {
    headline: 'BUILT FOR SCALE',
    subhead: 'Enterprise-grade aesthetics',
    stat: '99.9%',
    statLabel: 'UPTIME',
    category: 'ENTERPRISE',
    tagline: 'Ship it',
  },
};

export default function DesignPage() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('utilitarian');
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const { theme: siteTheme } = useTheme();
  const isDarkMode = siteTheme === 'dark';

  return (
    <div
      data-design-theme={currentTheme}
      className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'dark' : ''}`}
      style={{
        backgroundColor: 'hsl(var(--theme-background))',
        color: 'hsl(var(--theme-foreground))',
        fontFamily: 'var(--theme-font)',
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <BlurFade delay={0.1}>
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-70"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </Link>
          </BlurFade>

          {/* Theme Selector */}
          <BlurFade delay={0.2}>
            <div className="relative">
              <button
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: 'hsl(var(--theme-secondary))',
                  color: 'hsl(var(--theme-secondary-foreground))',
                }}
              >
                <Palette className="w-4 h-4" />
                <span>{themes.find(t => t.name === currentTheme)?.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
              </button>

              {isThemeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto rounded-xl shadow-xl border z-50"
                  style={{
                    backgroundColor: 'hsl(var(--theme-card))',
                    borderColor: 'hsl(var(--theme-border))',
                  }}
                >
                  <div className="p-2">
                    {themes.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => {
                          setCurrentTheme(theme.name);
                          setIsThemeOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
                        style={{
                          backgroundColor: currentTheme === theme.name ? 'hsl(var(--theme-accent))' : 'transparent',
                          color: currentTheme === theme.name ? 'hsl(var(--theme-accent-foreground))' : 'hsl(var(--theme-foreground))',
                        }}
                      >
                        <span>{theme.label}</span>
                        {currentTheme === theme.name && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </BlurFade>
        </div>
      </header>

      {isThemeOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsThemeOpen(false)} />
      )}

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <BlurFade delay={0.1}>
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-8 h-8" style={{ color: 'hsl(var(--theme-primary))' }} />
            <span
              className="text-sm font-medium tracking-wider uppercase"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Design System
            </span>
          </div>
        </BlurFade>

        <TextEffect
          per="word"
          preset="blur"
          delay={0.2}
          as="h1"
          className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
        >
          Theme Gallery
        </TextEffect>

        <BlurFade delay={0.4}>
          <p
            className="text-xl max-w-2xl mb-2"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            {themes.length} distinct visual identities. Each card showcases its own theme.
          </p>
        </BlurFade>

        <BlurFade delay={0.5}>
          <Link
            href="/design/utilitarian"
            className="inline-flex items-center gap-2 mt-4 text-sm font-medium underline underline-offset-4 hover:no-underline"
            style={{ color: 'hsl(var(--theme-primary))' }}
          >
            Learn Utilitarian Design Principles →
          </Link>
        </BlurFade>
      </section>

      {/* Magazine Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {themes.map((theme, index) => (
            <BlurFade key={theme.name} delay={0.1 + index * 0.03}>
              <ThemeCard
                themeName={theme.name}
                themeLabel={theme.label}
                content={themeContent[theme.name]}
                isActive={currentTheme === theme.name}
                onClick={() => setCurrentTheme(theme.name)}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-8 transition-colors"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Themes inspired by{' '}
            <a
              href="https://tweakcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
              style={{ color: 'hsl(var(--theme-primary))' }}
            >
              tweakcn
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function ThemeCard({
  themeName,
  themeLabel,
  content,
  isActive,
  onClick,
}: {
  themeName: ThemeName;
  themeLabel: string;
  content: ThemeCardContent;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      data-design-theme={themeName}
      className={`
        relative w-full aspect-[3/4] rounded-lg overflow-hidden text-left
        transition-shadow duration-300
        ${isActive ? 'ring-4 ring-offset-2' : ''}
      `}
      style={{
        backgroundColor: 'hsl(var(--theme-background))',
        color: 'hsl(var(--theme-foreground))',
        fontFamily: 'var(--theme-font)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
    >
      {/* Card inner content */}
      <div className="absolute inset-0 p-5 flex flex-col">
        {/* Top row - category and edition */}
        <div className="flex justify-between items-start mb-auto">
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            {content.category}
          </span>
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
          />
        </div>

        {/* Center - main content */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Stat */}
          {content.stat && (
            <div className="mb-4">
              <div
                className="text-5xl md:text-6xl font-black tracking-tighter leading-none"
                style={{ color: 'hsl(var(--theme-primary))' }}
              >
                {content.stat}
              </div>
              {content.statLabel && (
                <div
                  className="text-[10px] font-bold tracking-widest uppercase mt-1"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {content.statLabel}
                </div>
              )}
            </div>
          )}

          {/* Headline */}
          <h3
            className="text-xl md:text-2xl font-black tracking-tight leading-tight mb-2"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            {content.headline}
          </h3>

          {/* Subhead */}
          <p
            className="text-xs leading-relaxed"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            {content.subhead}
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex justify-between items-end mt-auto pt-4">
          <div>
            <div
              className="text-[10px] font-bold tracking-widest uppercase mb-1"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Theme
            </div>
            <div
              className="text-sm font-bold"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              {themeLabel}
            </div>
          </div>

          {content.tagline && (
            <div
              className="text-[10px] font-medium italic text-right max-w-[100px]"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {content.tagline}
            </div>
          )}
        </div>

        {/* Decorative border line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
        />
      </div>

      {/* Active indicator */}
      {isActive && (
        <div
          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
        >
          <Check className="w-3 h-3" style={{ color: 'hsl(var(--theme-primary-foreground))' }} />
        </div>
      )}
    </motion.button>
  );
}
