'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Copy, CheckCircle2, Check, X, ExternalLink, Palette, Sparkles, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { themes, ThemeName } from '@/lib/themes';
import { useDesignTheme } from '@/context/DesignThemeContext';
import '@/lib/themes/themes.css';
import {
  TextEffect,
  AnimatedGroup,
  FadeIn,
  FadeInUp,
  FadeInBlur
} from '@/components/motion';
import { PageTransition } from '@/components/ios';
import { DesignNavigation } from '@/components/design/DesignNavigation';

interface ThemeCardContent {
  headline: string;
  subhead: string;
  stat?: string;
  statLabel?: string;
  tagline?: string;
  category?: string;
}

// Generate comprehensive design system prompt
function generateThemePrompt(themeName: ThemeName, themeLabel: string): string {
  const content = themeContent[themeName];
  const fontName = themeFonts[themeName];

  return `Design System: ${themeLabel}

Apply this complete design system to your interface. All color values are in HSL format.

THEME IDENTIFIER:
  data-attribute: data-design-theme="${themeName}"

COLOR TOKENS:
  Background: --theme-background
  Foreground: --theme-foreground
  Card: --theme-card, --theme-card-foreground
  Primary: --theme-primary, --theme-primary-foreground
  Secondary: --theme-secondary, --theme-secondary-foreground
  Muted: --theme-muted, --theme-muted-foreground
  Accent: --theme-accent, --theme-accent-foreground
  Border: --theme-border
  Ring: --theme-ring

TYPOGRAPHY:
  Body Font: ${fontName} (--theme-font)
  Heading Font: --theme-font-heading

DESIGN PRINCIPLES:
  ${content.tagline || 'Maintain visual consistency across all components'}

Usage: hsl(var(--theme-[token]))
Dark mode: Add .dark class to parent element`;
}

// Map theme names to their primary font names
const themeFonts: Record<ThemeName, string> = {
  'utilitarian': 'SF Mono',
  'base': 'Inter',
  'claude': 'Söhne',
  'chatgpt': 'Söhne',
  'vercel': 'Geist',
  'kodama-grove': 'Nunito',
  'vintage-paper': 'Courier Prime',
  'claymorphism': 'Poppins',
  'nature': 'Lora',
  'neo-brutalism': 'Space Grotesk',
  'elegant-luxury': 'Cormorant Garamond',
  'pastel-dreams': 'Quicksand',
  'cosmic-night': 'Orbitron',
  'clean-slate': 'DM Sans',
  'caffeine': 'Libre Baskerville',
  'ocean-breeze': 'Source Sans Pro',
  'perpetuity': 'EB Garamond',
  'midnight-bloom': 'Crimson Text',
  'northern-lights': 'Outfit',
  'sunset-horizon': 'Rubik',
  'modern-minimal': 'Manrope',
  'candyland': 'Baloo 2',
  'cyberpunk': 'Share Tech Mono',
  'retro-arcade': 'Press Start 2P',
  'quantum-rose': 'Raleway',
  'bold-tech': 'JetBrains Mono',
  'violet-bloom': 'Plus Jakarta Sans',
  't3-chat': 'System UI',
  'mocha-mousse': 'DM Sans',
  'amethyst-haze': 'Geist',
  'doom-64': 'Oxanium',
  'amber-minimal': 'Inter',
  'solar-dusk': 'Oxanium',
  'starry-night': 'Libre Baskerville',
  'soft-pop': 'DM Sans',
  'sage-garden': 'Antic',
  'notebook': 'Courier Prime',
  'tao': 'Crimson Text',
  'research': 'Crimson Pro',
  'field-guide': 'DM Sans',
  'denim': 'DM Sans',
  'google': 'Google Sans',
  'apple': 'SF Pro',
  'microsoft': 'Segoe UI',
  'notion': 'Inter',
  'cursor': 'JetBrains Mono',
  'miro': 'Inter',
  'nike': 'Helvetica Neue',
  'adidas': 'Helvetica Neue',
  'kinetic-editorial': 'Space Grotesk',
  'teenage-engineering': 'SF Mono',
};

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
    headline: 'Invisible Complexity',
    subhead: 'Power hidden in simplicity',
    stat: '4o',
    statLabel: 'MODEL',
    category: 'OPENAI',
    tagline: 'Just works',
  },
  'vercel': {
    headline: 'Ship It',
    subhead: 'Developer experience, perfected',
    stat: '▲',
    statLabel: 'DEPLOY',
    category: 'INFRASTRUCTURE',
    tagline: 'Zero config',
  },
  'kodama-grove': {
    headline: 'Forest Spirits',
    subhead: 'Where technology meets nature',
    stat: '木',
    statLabel: 'TREE',
    category: 'GHIBLI',
    tagline: 'Whispers of the forest',
  },
  'vintage-paper': {
    headline: 'Old Newsprint',
    subhead: 'Stories told in sepia',
    stat: '1923',
    statLabel: 'EDITION',
    category: 'VINTAGE',
    tagline: 'Extra! Extra!',
  },
  'claymorphism': {
    headline: 'Soft Surfaces',
    subhead: 'Depth through light and shadow',
    stat: '3D',
    statLabel: 'STYLE',
    category: 'MATERIAL',
    tagline: 'Touch the interface',
  },
  'nature': {
    headline: 'Organic Growth',
    subhead: 'Rooted in natural forms',
    stat: '🌱',
    statLabel: 'LIFE',
    category: 'BIOPHILIC',
    tagline: 'Grow with purpose',
  },
  'neo-brutalism': {
    headline: 'Raw Power',
    subhead: 'Bold strokes, no apologies',
    stat: '!!',
    statLabel: 'IMPACT',
    category: 'BOLD',
    tagline: 'Make it loud',
  },
  'elegant-luxury': {
    headline: 'Refined Taste',
    subhead: 'Where excellence is standard',
    stat: '★★★★★',
    statLabel: 'RATING',
    category: 'PREMIUM',
    tagline: 'Only the finest',
  },
  'pastel-dreams': {
    headline: 'Soft Whispers',
    subhead: 'Gentle hues for gentle souls',
    stat: '☁️',
    statLabel: 'CLOUDS',
    category: 'DREAMY',
    tagline: 'Float away',
  },
  'cosmic-night': {
    headline: 'Infinite Space',
    subhead: 'Among the stars',
    stat: '∞',
    statLabel: 'LIGHT YEARS',
    category: 'SPACE',
    tagline: 'Beyond horizons',
  },
  'clean-slate': {
    headline: 'Fresh Start',
    subhead: 'Minimal by intention',
    stat: '0',
    statLabel: 'DISTRACTIONS',
    category: 'MINIMAL',
    tagline: 'Start fresh',
  },
  'caffeine': {
    headline: 'Morning Ritual',
    subhead: 'Warm tones, familiar comfort',
    stat: '☕',
    statLabel: 'BREW',
    category: 'COZY',
    tagline: 'Daily grind',
  },
  'ocean-breeze': {
    headline: 'Coastal Calm',
    subhead: 'Where sky meets sea',
    stat: '🌊',
    statLabel: 'WAVES',
    category: 'MARINE',
    tagline: 'Breathe deep',
  },
  'perpetuity': {
    headline: 'Timeless Grace',
    subhead: 'Classic never fades',
    stat: '∞',
    statLabel: 'ETERNAL',
    category: 'CLASSIC',
    tagline: 'Forever elegant',
  },
  'midnight-bloom': {
    headline: 'Night Garden',
    subhead: 'Flowers that bloom in darkness',
    stat: '🌙',
    statLabel: 'MIDNIGHT',
    category: 'DARK',
    tagline: 'Beauty in shadows',
  },
  'northern-lights': {
    headline: 'Aurora',
    subhead: 'Dancing light in frozen skies',
    stat: '✨',
    statLabel: 'MAGIC',
    category: 'ETHEREAL',
    tagline: 'Nature\'s wonder',
  },
  'sunset-horizon': {
    headline: 'Golden Hour',
    subhead: 'Chasing the dying light',
    stat: '🌅',
    statLabel: 'SUNSET',
    category: 'WARM',
    tagline: 'Every ending is beautiful',
  },
  'modern-minimal': {
    headline: 'Less Is More',
    subhead: 'Reduction to essence',
    stat: '-',
    statLabel: 'MINUS',
    category: 'MODERN',
    tagline: 'Subtract to add',
  },
  'candyland': {
    headline: 'Sweet Dreams',
    subhead: 'Where sugar meets code',
    stat: '🍭',
    statLabel: 'SUGAR',
    category: 'PLAYFUL',
    tagline: 'Life is sweet',
  },
  'cyberpunk': {
    headline: 'Neon Nights',
    subhead: 'High tech, low life',
    stat: '2077',
    statLabel: 'YEAR',
    category: 'FUTURE',
    tagline: 'Wake up, samurai',
  },
  'retro-arcade': {
    headline: 'Insert Coin',
    subhead: 'Press start to begin',
    stat: '8-BIT',
    statLabel: 'GRAPHICS',
    category: 'GAMING',
    tagline: 'Game over? Never.',
  },
  'quantum-rose': {
    headline: 'Particle Dance',
    subhead: 'Quantum mechanics meets rose',
    stat: '⚛',
    statLabel: 'QUANTUM',
    category: 'SCIENCE',
    tagline: 'Observe and collapse',
  },
  'bold-tech': {
    headline: 'Strong Type',
    subhead: 'Commanding presence',
    stat: '</>',
    statLabel: 'CODE',
    category: 'DEVELOPER',
    tagline: 'Ship bold',
  },
  'violet-bloom': {
    headline: 'Purple Reign',
    subhead: 'Royal hues, humble purpose',
    stat: '💜',
    statLabel: 'BLOOM',
    category: 'REGAL',
    tagline: 'Crown yourself',
  },
  't3-chat': {
    headline: 'Type Safe',
    subhead: 'The best stack for chat',
    stat: 'T3',
    statLabel: 'STACK',
    category: 'TYPESCRIPT',
    tagline: 'Full stack, type safe',
  },
  'mocha-mousse': {
    headline: 'Chocolate Dreams',
    subhead: 'Rich and creamy interface',
    stat: '🍫',
    statLabel: 'COCOA',
    category: 'PANTONE 2025',
    tagline: 'Indulge yourself',
  },
  'amethyst-haze': {
    headline: 'Crystal Clear',
    subhead: 'Mystical purple clarity',
    stat: '💎',
    statLabel: 'GEM',
    category: 'CRYSTAL',
    tagline: 'Clarity through color',
  },
  'doom-64': {
    headline: 'Rip & Tear',
    subhead: 'Until it is done',
    stat: '666',
    statLabel: 'HELL',
    category: 'RETRO FPS',
    tagline: 'Knee deep in the dead',
  },
  'amber-minimal': {
    headline: 'Warm Glow',
    subhead: 'Amber light, minimal design',
    stat: '🔶',
    statLabel: 'AMBER',
    category: 'WARM',
    tagline: 'Gentle warmth',
  },
  'solar-dusk': {
    headline: 'Red Giant',
    subhead: 'Dying star aesthetics',
    stat: '☀️',
    statLabel: 'SOLAR',
    category: 'COSMIC',
    tagline: 'Before the supernova',
  },
  'starry-night': {
    headline: 'Van Gogh Mode',
    subhead: 'Swirling with emotion',
    stat: '🌌',
    statLabel: 'STARS',
    category: 'ARTISTIC',
    tagline: 'Paint with purpose',
  },
  'soft-pop': {
    headline: 'Bubbly Fun',
    subhead: 'Pop without the pressure',
    stat: '💥',
    statLabel: 'POP',
    category: 'PLAYFUL',
    tagline: 'Colorful fun',
  },
  'sage-garden': {
    headline: 'Earthy Greens',
    subhead: 'Natural sage tranquility',
    stat: '🌿',
    statLabel: 'SAGE',
    category: 'ORGANIC',
    tagline: 'Grow naturally',
  },
  'notebook': {
    headline: 'Handwritten Notes',
    subhead: 'Warm paper with ruled lines',
    stat: '📓',
    statLabel: 'PAGES',
    category: 'NOSTALGIC',
    tagline: 'Write your story',
  },
  'research': {
    headline: 'Academic Clarity',
    subhead: 'Where ideas become knowledge',
    stat: 'A+',
    statLabel: 'GRADE',
    category: 'SCHOLARLY',
    tagline: 'Publish or perish',
  },
  'field-guide': {
    headline: 'Model Designer',
    subhead: 'The rise of AI-native design',
    stat: '#01',
    statLabel: 'ARTICLE',
    category: 'AI DESIGN',
    tagline: 'Navigate the frontier',
  },
  'tao': {
    headline: 'The Way',
    subhead: 'The still pond reflects',
    stat: '道',
    statLabel: 'TAO',
    category: 'CONTEMPLATIVE',
    tagline: 'Speak, and be reflected',
  },
  'denim': {
    headline: 'Brand Studio',
    subhead: 'Deep indigo elegance',
    stat: '©',
    statLabel: 'STUDIO',
    category: 'EDITORIAL',
    tagline: 'Refined craftsmanship',
  },
  'google': {
    headline: 'Material You',
    subhead: 'Personal, adaptive, expressive',
    stat: 'M3',
    statLabel: 'DESIGN',
    category: 'GOOGLE',
    tagline: 'Design for everyone',
  },
  'apple': {
    headline: 'Human Interface',
    subhead: 'Technology meets liberal arts',
    stat: 'HIG',
    statLabel: 'GUIDELINES',
    category: 'APPLE',
    tagline: 'Designed in California',
  },
  'microsoft': {
    headline: 'Fluent Design',
    subhead: 'Light, depth, motion, material',
    stat: '365',
    statLabel: 'APPS',
    category: 'MICROSOFT',
    tagline: 'Empowering everyone',
  },
  'notion': {
    headline: 'Block Everything',
    subhead: 'Every block is a building block',
    stat: '/',
    statLabel: 'SLASH',
    category: 'NOTION',
    tagline: 'Write, plan, organize',
  },
  'cursor': {
    headline: 'AI-Native Editor',
    subhead: 'The IDE that writes code with you',
    stat: 'Cmd',
    statLabel: 'K',
    category: 'CURSOR',
    tagline: 'Code faster',
  },
  'miro': {
    headline: 'Infinite Canvas',
    subhead: 'Where teams think together',
    stat: '∞',
    statLabel: 'BOARD',
    category: 'MIRO',
    tagline: 'Collaborate visually',
  },
  'nike': {
    headline: 'Just Do It',
    subhead: 'Where athletes become legends',
    stat: '✓',
    statLabel: 'SWOOSH',
    category: 'NIKE',
    tagline: 'Impossible is nothing... wait',
  },
  'adidas': {
    headline: 'Impossible Is Nothing',
    subhead: 'Three stripes, infinite possibilities',
    stat: '≡',
    statLabel: 'STRIPES',
    category: 'ADIDAS',
    tagline: 'All day I dream about sports',
  },
  'kinetic-editorial': {
    headline: 'Design In Motion',
    subhead: 'Typography as architecture',
    stat: '→',
    statLabel: 'SCROLL',
    category: 'EDITORIAL',
    tagline: 'Bold. Kinetic. Intentional.',
  },
  'teenage-engineering': {
    headline: 'Function = Beauty',
    subhead: 'Minimalist precision meets playful engineering',
    stat: 'OP-1',
    statLabel: 'ICONIC',
    category: 'SCANDINAVIAN',
    tagline: 'Constraints breed creativity',
  },
};

// All themes now have dedicated sub-pages
const themesWithSubPages: ThemeName[] = themes.map(t => t.name);

export default function DesignPage() {
  const { designTheme, setDesignTheme } = useDesignTheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeName | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { resolvedTheme: siteTheme } = useTheme();
  const router = useRouter();
  const isDarkMode = siteTheme === 'dark';

  // Filter themes based on search query
  const filteredThemes = useMemo(() => {
    if (!searchQuery.trim()) return themes;
    const query = searchQuery.toLowerCase();
    return themes.filter((theme) => {
      const content = themeContent[theme.name];
      return (
        theme.label.toLowerCase().includes(query) ||
        theme.name.toLowerCase().includes(query) ||
        content.headline?.toLowerCase().includes(query) ||
        content.category?.toLowerCase().includes(query) ||
        content.tagline?.toLowerCase().includes(query) ||
        themeFonts[theme.name]?.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const handleCardClick = (themeName: ThemeName) => {
    setSelectedTheme(themeName);
  };

  const handleApplyTheme = () => {
    if (selectedTheme) {
      setDesignTheme(selectedTheme);
      setSelectedTheme(null);
    }
  };

  const handleExplore = () => {
    if (selectedTheme) {
      router.push(`/design/${selectedTheme}`);
    }
  };

  const closeModal = () => {
    setSelectedTheme(null);
  };

  return (
    <PageTransition>
    <div
      data-design-theme={designTheme}
      className="min-h-screen transition-all duration-500"
      style={{
        backgroundColor: 'hsl(var(--theme-background))',
        color: 'hsl(var(--theme-foreground))',
        fontFamily: 'var(--theme-font)',
      }}
    >
      {/* Navigation */}
      <DesignNavigation />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <FadeIn delay={0.1}>
              <div className="flex items-center gap-3 mb-3">
                <Palette className="w-6 h-6" style={{ color: 'hsl(var(--theme-primary))' }} />
                <span
                  className="text-xs font-medium tracking-wider uppercase"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  Design System
                </span>
              </div>
            </FadeIn>

            <TextEffect
              per="word"
              preset="blur"
              as="h1"
              className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
            >
              Theme Gallery
            </TextEffect>

            <FadeInBlur delay={0.2}>
              <p
                className="text-lg max-w-xl"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                {filteredThemes.length === themes.length
                  ? `${themes.length} visual identities`
                  : `${filteredThemes.length} of ${themes.length} themes`}
                . Click any card to preview and explore.
              </p>
            </FadeInBlur>
          </div>

          {/* Search */}
          <FadeInUp delay={0.3}>
            <div className="relative w-full md:w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search themes..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2"
                style={{
                  borderColor: 'hsl(var(--theme-border))',
                  backgroundColor: 'hsl(var(--theme-card))',
                  color: 'hsl(var(--theme-foreground))',
                  // @ts-ignore
                  '--tw-ring-color': 'hsl(var(--theme-ring))',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:opacity-70 transition"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Theme Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {filteredThemes.length > 0 ? (
          <AnimatedGroup
            preset="blurSlide"
            stagger={0.04}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredThemes.map((theme) => (
              <ThemeCard
                key={theme.name}
                themeName={theme.name}
                themeLabel={theme.label}
                content={themeContent[theme.name]}
                isActive={designTheme === theme.name}
                onClick={() => handleCardClick(theme.name)}
              />
            ))}
          </AnimatedGroup>
        ) : (
          <div className="text-center py-20">
            <Search
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            />
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              No themes found
            </h3>
            <p
              className="text-sm mb-4"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Try a different search term
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{
                backgroundColor: 'hsl(var(--theme-primary))',
                color: 'hsl(var(--theme-primary-foreground))',
              }}
            >
              Clear search
            </button>
          </div>
        )}
      </section>

      {/* Theme Preview Modal */}
      <AnimatePresence>
        {selectedTheme && (
          <>
            {/* Backdrop + Modal Container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            >
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl max-h-[90vh] sm:max-h-[min(85vh,800px)] overflow-hidden rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
              data-design-theme={selectedTheme}
              style={{
                backgroundColor: 'hsl(var(--theme-background))',
                fontFamily: 'var(--theme-font)',
              }}
            >
              {/* Modal Header */}
              <div
                className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b"
                style={{ borderColor: 'hsl(var(--theme-border))' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                  />
                  <h2
                    className="text-xl font-bold"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  >
                    {themes.find(t => t.name === selectedTheme)?.label}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full hover:opacity-70 transition-opacity"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content - Theme Preview */}
              <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto">
                {/* Preview Card */}
                <div
                  className="rounded-xl border p-4 sm:p-6 mb-4 sm:mb-6"
                  style={{
                    borderColor: 'hsl(var(--theme-border))',
                    backgroundColor: 'hsl(var(--theme-card))',
                  }}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Theme Showcase */}
                    <div className="flex-1">
                      <span
                        className="text-xs font-bold tracking-widest uppercase mb-2 block"
                        style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                      >
                        {themeContent[selectedTheme]?.category}
                      </span>
                      <h3
                        className="text-3xl md:text-4xl font-black mb-3"
                        style={{ color: 'hsl(var(--theme-foreground))' }}
                      >
                        {themeContent[selectedTheme]?.headline}
                      </h3>
                      <p
                        className="text-lg mb-4"
                        style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                      >
                        {themeContent[selectedTheme]?.subhead}
                      </p>
                      <p
                        className="text-sm italic"
                        style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                      >
                        "{themeContent[selectedTheme]?.tagline}"
                      </p>
                    </div>

                    {/* Right: Stats and Colors */}
                    <div className="md:w-48 flex flex-col gap-4">
                      {themeContent[selectedTheme]?.stat && (
                        <div
                          className="text-center p-4 rounded-lg"
                          style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
                        >
                          <div
                            className="text-4xl font-black"
                            style={{ color: 'hsl(var(--theme-primary))' }}
                          >
                            {themeContent[selectedTheme].stat}
                          </div>
                          <div
                            className="text-[10px] font-bold tracking-widest uppercase mt-1"
                            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                          >
                            {themeContent[selectedTheme].statLabel}
                          </div>
                        </div>
                      )}

                      {/* Color Swatches */}
                      <div className="flex gap-2">
                        <div
                          className="flex-1 h-8 rounded"
                          style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                          title="Primary"
                        />
                        <div
                          className="flex-1 h-8 rounded"
                          style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
                          title="Secondary"
                        />
                        <div
                          className="flex-1 h-8 rounded"
                          style={{ backgroundColor: 'hsl(var(--theme-accent))' }}
                          title="Accent"
                        />
                      </div>
                      <div
                        className="text-xs text-center"
                        style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                      >
                        {themeFonts[selectedTheme]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sample UI Components */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Button Samples */}
                  <div
                    className="rounded-lg border p-4"
                    style={{ borderColor: 'hsl(var(--theme-border))' }}
                  >
                    <span
                      className="text-xs font-medium mb-3 block"
                      style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                    >
                      Buttons
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{
                          backgroundColor: 'hsl(var(--theme-primary))',
                          color: 'hsl(var(--theme-primary-foreground))',
                        }}
                      >
                        Primary
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{
                          backgroundColor: 'hsl(var(--theme-secondary))',
                          color: 'hsl(var(--theme-secondary-foreground))',
                        }}
                      >
                        Secondary
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium border"
                        style={{
                          borderColor: 'hsl(var(--theme-border))',
                          color: 'hsl(var(--theme-foreground))',
                        }}
                      >
                        Outline
                      </button>
                    </div>
                  </div>

                  {/* Input Sample */}
                  <div
                    className="rounded-lg border p-4"
                    style={{ borderColor: 'hsl(var(--theme-border))' }}
                  >
                    <span
                      className="text-xs font-medium mb-3 block"
                      style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                    >
                      Input
                    </span>
                    <input
                      type="text"
                      placeholder="Type something..."
                      className="w-full px-4 py-2 rounded-lg text-sm border outline-none"
                      style={{
                        borderColor: 'hsl(var(--theme-border))',
                        backgroundColor: 'hsl(var(--theme-background))',
                        color: 'hsl(var(--theme-foreground))',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer - Actions */}
              <div
                className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-3 pb-6 sm:py-4 sm:pb-4 border-t"
                style={{ borderColor: 'hsl(var(--theme-border))' }}
              >
                {/* Action Buttons - Primary actions first on mobile */}
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 order-1 sm:order-2">
                  <button
                    onClick={handleApplyTheme}
                    className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                    style={{
                      backgroundColor: 'hsl(var(--theme-secondary))',
                      color: 'hsl(var(--theme-secondary-foreground))',
                    }}
                  >
                    <Check className="w-4 h-4" />
                    Apply Theme
                  </button>
                  <button
                    onClick={handleExplore}
                    className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                    style={{
                      backgroundColor: 'hsl(var(--theme-primary))',
                      color: 'hsl(var(--theme-primary-foreground))',
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Explore Theme
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Copy Prompt Button - Secondary action */}
                <div className="order-2 sm:order-1">
                  <CopyPromptButton themeName={selectedTheme} themeLabel={themes.find(t => t.name === selectedTheme)?.label || ''} />
                </div>
              </div>
            </motion.div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

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
    </PageTransition>
  );
}

function CopyPromptButton({ themeName, themeLabel }: { themeName: ThemeName; themeLabel: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const prompt = generateThemePrompt(themeName, themeLabel);
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium border transition-all hover:opacity-70"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        color: 'hsl(var(--theme-foreground))',
      }}
    >
      {copied ? (
        <>
          <CheckCircle2 className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy Prompt
        </>
      )}
    </button>
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
        {/* Top row */}
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

        {/* Center content */}
        <div className="flex-1 flex flex-col justify-center">
          {content.tagline && (
            <div
              className="text-[9px] font-medium italic mb-3 text-center"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {content.tagline}
            </div>
          )}

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

          <h3
            className="text-xl md:text-2xl font-black tracking-tight leading-tight mb-2"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            {content.headline}
          </h3>

          <p
            className="text-xs leading-relaxed mb-3"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            {content.subhead}
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex justify-between items-end mt-auto pt-4 pb-10">
          <div>
            <div
              className="text-[10px] font-bold tracking-widest uppercase mb-1"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Theme
            </div>
            <div
              className="text-sm font-bold mb-1"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              {themeLabel}
            </div>
            <div
              className="text-[9px] font-mono"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {themeFonts[themeName]}
            </div>
          </div>
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
