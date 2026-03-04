'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Palette, ChevronDown, Check, Copy, CheckCircle2, ExternalLink } from 'lucide-react';
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
  fontName?: string;
}

// Generate comprehensive design system prompt with actual token values
function generateThemePrompt(themeName: ThemeName, themeLabel: string): string {
  // Get theme description from content
  const content = themeContent[themeName];
  const fontName = themeFonts[themeName];
  
  // Create a comprehensive design system prompt in YAML format
  const prompt = `Design System: ${themeLabel}

Apply this complete design system to your interface. All color values are in HSL format (Hue Saturation Lightness) without the "hsl()" wrapper - use as: hsl(var(--theme-[token])).

THEME IDENTIFIER:
  data-attribute: data-design-theme="${themeName}"
  Apply this attribute to the root element or container to activate the theme.

COLOR TOKENS (Light Mode):
  Background:
    CSS Variable: --theme-background
    Usage: hsl(var(--theme-background))
    Purpose: Main page background, default surface color
  
  Foreground:
    CSS Variable: --theme-foreground
    Usage: hsl(var(--theme-foreground))
    Purpose: Primary text color, main content text
  
  Card:
    Background: --theme-card → hsl(var(--theme-card))
    Foreground: --theme-card-foreground → hsl(var(--theme-card-foreground))
    Purpose: Elevated surfaces, cards, modals, panels
  
  Primary:
    Color: --theme-primary → hsl(var(--theme-primary))
    Foreground: --theme-primary-foreground → hsl(var(--theme-primary-foreground))
    Purpose: Primary actions, buttons, links, CTAs, brand highlights
  
  Secondary:
    Color: --theme-secondary → hsl(var(--theme-secondary))
    Foreground: --theme-secondary-foreground → hsl(var(--theme-secondary-foreground))
    Purpose: Secondary actions, subtle backgrounds, alternative elements
  
  Muted:
    Background: --theme-muted → hsl(var(--theme-muted))
    Foreground: --theme-muted-foreground → hsl(var(--theme-muted-foreground))
    Purpose: Disabled states, subtle text, tertiary backgrounds, placeholders
  
  Accent:
    Color: --theme-accent → hsl(var(--theme-accent))
    Foreground: --theme-accent-foreground → hsl(var(--theme-accent-foreground))
    Purpose: Accents, highlights, special callouts, decorative elements
  
  Border:
    Color: --theme-border → hsl(var(--theme-border))
    Purpose: Borders, dividers, outlines, separators
  
  Ring:
    Color: --theme-ring → hsl(var(--theme-ring))
    Purpose: Focus rings, active states, selection indicators

TYPOGRAPHY TOKENS:
  Body Font:
    CSS Variable: --theme-font
    Value: ${fontName}
    Usage: font-family: var(--theme-font)
    Apply to: Body text, paragraphs, general content, UI elements
  
  Heading Font:
    CSS Variable: --theme-font-heading
    Usage: font-family: var(--theme-font-heading)
    Apply to: Headings (h1-h6), titles, emphasis, hero text

DARK MODE:
  Activation: Add .dark class to parent element
  All tokens automatically switch to dark mode variants
  Example: <div class="dark" data-design-theme="${themeName}">...</div>

IMPLEMENTATION RULES:
  1. Root Application:
     - Add data-design-theme="${themeName}" to root/container element
     - For dark mode: Add .dark class to same element
  
  2. Color Usage:
     - Always use: hsl(var(--theme-[token]))
     - Never hardcode colors - always use CSS variables
     - Maintain semantic meaning: use background for backgrounds, foreground for text
  
  3. Component Patterns:
     - Buttons: background: hsl(var(--theme-primary)), color: hsl(var(--theme-primary-foreground))
     - Cards: background: hsl(var(--theme-card)), color: hsl(var(--theme-card-foreground))
     - Borders: border-color: hsl(var(--theme-border))
     - Focus: outline-color: hsl(var(--theme-ring))
  
  4. Contrast & Accessibility:
     - Ensure foreground/background pairs meet WCAG AA (4.5:1 for normal text)
     - Use primary-foreground with primary, card-foreground with card
     - Test both light and dark modes
  
  5. Typography:
     - Body: Use --theme-font for all body text
     - Headings: Use --theme-font-heading for h1-h6
     - Maintain consistent font hierarchy
  
  6. Spacing:
     - Use consistent spacing scale (recommended: 4px base unit)
     - Maintain visual rhythm with theme colors
  
  7. Interactive States:
     - Hover: Use --theme-primary or --theme-accent
     - Active: Use --theme-primary with reduced opacity
     - Focus: Use --theme-ring for outline
     - Disabled: Use --theme-muted and --theme-muted-foreground

DESIGN PRINCIPLES:
  - ${content.tagline || 'Maintain visual consistency across all components'}
  - Use primary color sparingly for maximum impact and hierarchy
  - Maintain sufficient contrast ratios for accessibility (WCAG AA minimum)
  - Support both light and dark modes seamlessly
  - Apply theme consistently across all UI elements
  - Use semantic tokens - don't mix token purposes
  - Maintain visual hierarchy through color and typography

CSS IMPLEMENTATION EXAMPLE:
\`\`\`css
/* Apply theme to container */
[data-design-theme="${themeName}"] {
  background-color: hsl(var(--theme-background));
  color: hsl(var(--theme-foreground));
  font-family: var(--theme-font);
}

/* Dark mode variant */
.dark [data-design-theme="${themeName}"] {
  /* All tokens automatically switch to dark values */
}

/* Component examples */
.button-primary {
  background-color: hsl(var(--theme-primary));
  color: hsl(var(--theme-primary-foreground));
  border-color: hsl(var(--theme-border));
}

.card {
  background-color: hsl(var(--theme-card));
  color: hsl(var(--theme-card-foreground));
  border: 1px solid hsl(var(--theme-border));
}
\`\`\`

Apply this design system consistently throughout your interface. All tokens are available as CSS variables and automatically support dark mode when the .dark class is applied.`;

  return prompt;
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
  'violet-bloom': {
    headline: 'Purple Elegance',
    subhead: 'Sophisticated violet tones',
    stat: 'V',
    statLabel: 'VIOLET',
    category: 'PREMIUM',
    tagline: 'Bloom with style',
  },
  't3-chat': {
    headline: 'Chat Interface',
    subhead: 'Pink and purple conversation',
    stat: 'T3',
    statLabel: 'STACK',
    category: 'FRAMEWORK',
    tagline: 'Talk it out',
  },
  'mocha-mousse': {
    headline: 'Coffee Comfort',
    subhead: 'Warm browns and creams',
    stat: '☕',
    statLabel: 'BREW',
    category: 'ORGANIC',
    tagline: 'Rich and smooth',
  },
  'amethyst-haze': {
    headline: 'Purple Mist',
    subhead: 'Dreamy amethyst atmosphere',
    stat: '💜',
    statLabel: 'HAZE',
    category: 'MYSTICAL',
    tagline: 'Lost in purple',
  },
  'doom-64': {
    headline: 'RETRO GAME',
    subhead: 'Classic 90s aesthetic',
    stat: '64',
    statLabel: 'BIT',
    category: 'NOSTALGIA',
    tagline: 'Press start',
  },
  'amber-minimal': {
    headline: 'Warm Glow',
    subhead: 'Minimal amber elegance',
    stat: '🟠',
    statLabel: 'AMBER',
    category: 'MINIMAL',
    tagline: 'Golden simplicity',
  },
  'solar-dusk': {
    headline: 'Sunset Warmth',
    subhead: 'Evening glow captured',
    stat: '🌅',
    statLabel: 'DUSK',
    category: 'NATURAL',
    tagline: 'End of day',
  },
  'starry-night': {
    headline: 'Night Sky',
    subhead: 'Deep blues with stars',
    stat: '⭐',
    statLabel: 'STARS',
    category: 'CELESTIAL',
    tagline: 'Look up',
  },
  'soft-pop': {
    headline: 'Vibrant Play',
    subhead: 'Bold colors, soft edges',
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
};

// Themes that have dedicated sub-pages
const themesWithSubPages: ThemeName[] = ['utilitarian'];

export default function DesignPage() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('utilitarian');
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const { theme: siteTheme } = useTheme();
  const isDarkMode = siteTheme === 'dark';
  const hasSubPage = themesWithSubPages.includes(currentTheme);

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

          {/* Theme Selector and Explore Button */}
          <BlurFade delay={0.2}>
            <div className="flex items-center gap-3">
              {hasSubPage && (
                <Link
                  href={`/design/${currentTheme}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'hsl(var(--theme-primary))',
                    color: 'hsl(var(--theme-primary-foreground))',
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Explore {themes.find(t => t.name === currentTheme)?.label}</span>
                </Link>
              )}
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
            className="text-xl max-w-2xl mb-4"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            {themes.length} distinct visual identities. Each card showcases its own theme.
          </p>
          <p
            className="text-sm max-w-2xl mb-2"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            This design page is my personal scratchpad as I perfect my design skills by building with AI and creating a library of resources of my own.
          </p>
        </BlurFade>

        <BlurFade delay={0.5}>
          <div className="flex flex-col gap-3 mt-4">
            <Link
              href="/design/utilitarian"
              className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 hover:no-underline"
              style={{ color: 'hsl(var(--theme-primary))' }}
            >
              Learn Utilitarian Design Principles →
            </Link>
            <div className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              <span>Credits: </span>
              <span>Themes inspired by </span>
              <a
                href="https://tweakcn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
                style={{ color: 'hsl(var(--theme-primary))' }}
              >
                tweakcn
              </a>
              <span>. Utilitarian design thanks to </span>
              <a
                href="https://x.com/kyleanthony"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
                style={{ color: 'hsl(var(--theme-primary))' }}
              >
                Kyle
              </a>
              <span>.</span>
            </div>
          </div>
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
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
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
          {/* Tagline - moved here above stat */}
          {content.tagline && (
            <div
              className="text-[9px] font-medium italic mb-3 text-center"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {content.tagline}
            </div>
          )}

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
            {/* Font name */}
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

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute bottom-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
        style={{
          backgroundColor: 'hsl(var(--theme-card))',
          color: 'hsl(var(--theme-foreground))',
          border: `1px solid hsl(var(--theme-border))`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        title="Copy theme prompt"
      >
        {copied ? (
          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'hsl(var(--theme-primary))' }} />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </motion.button>
  );
}
