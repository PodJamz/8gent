'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, Sparkles } from 'lucide-react';

export interface ThemePromptData {
  name: string;
  label: string;
  description: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
    border: string;
  };
  fonts: {
    body: string;
    heading: string;
  };
  characteristics: string[];
  useCases: string[];
}

interface CopyThemePromptProps {
  theme: ThemePromptData;
  className?: string;
}

function generateThemePrompt(theme: ThemePromptData): string {
  return `# ${theme.label} Theme System

## Overview
${theme.description}

## Color Palette (Hex Values)
- Background: ${theme.colors.background}
- Foreground/Text: ${theme.colors.foreground}
- Primary: ${theme.colors.primary}
- Secondary: ${theme.colors.secondary}
- Muted: ${theme.colors.muted}
- Accent: ${theme.colors.accent}
- Border: ${theme.colors.border}

## Typography
- Body Font: ${theme.fonts.body}
- Heading Font: ${theme.fonts.heading}

## Design Characteristics
${theme.characteristics.map(c => `- ${c}`).join('\n')}

## Best Used For
${theme.useCases.map(u => `- ${u}`).join('\n')}

## CSS Variables (Ready to Use)
\`\`\`css
:root {
  --background: ${theme.colors.background};
  --foreground: ${theme.colors.foreground};
  --primary: ${theme.colors.primary};
  --secondary: ${theme.colors.secondary};
  --muted: ${theme.colors.muted};
  --accent: ${theme.colors.accent};
  --border: ${theme.colors.border};
  --font-body: ${theme.fonts.body};
  --font-heading: ${theme.fonts.heading};
}
\`\`\`

## Tailwind Config Extension
\`\`\`js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '${theme.colors.background}',
        foreground: '${theme.colors.foreground}',
        primary: '${theme.colors.primary}',
        secondary: '${theme.colors.secondary}',
        muted: '${theme.colors.muted}',
        accent: '${theme.colors.accent}',
        border: '${theme.colors.border}',
      },
      fontFamily: {
        sans: ['${theme.fonts.body.split(',')[0].trim()}', 'system-ui', 'sans-serif'],
        heading: ['${theme.fonts.heading.split(',')[0].trim()}', 'system-ui', 'sans-serif'],
      },
    },
  },
}
\`\`\`

Apply this theme to create a cohesive, ${theme.label.toLowerCase()}-inspired design system.`;
}

export function CopyThemePrompt({ theme, className = '' }: CopyThemePromptProps) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const prompt = generateThemePrompt(theme);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: 'hsl(var(--theme-primary))',
            color: 'hsl(var(--theme-primary-foreground))',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Theme Prompt</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium border transition-all"
          style={{
            borderColor: 'hsl(var(--theme-border))',
            color: 'hsl(var(--theme-foreground))',
            backgroundColor: 'hsl(var(--theme-card))',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="w-4 h-4" />
          <span>{showPreview ? 'Hide' : 'Preview'} Prompt</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-4"
          >
            <div
              className="rounded-lg border p-4 max-h-96 overflow-y-auto"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                backgroundColor: 'hsl(var(--theme-card))',
              }}
            >
              <pre
                className="text-xs whitespace-pre-wrap font-mono"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                {prompt}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Pre-built theme data for all themes
export const themePromptData: Record<string, ThemePromptData> = {
  utilitarian: {
    name: 'utilitarian',
    label: 'Utilitarian',
    description: 'A tactical briefing document aesthetic inspired by military and intelligence agency design. Clean, functional, and authoritative.',
    colors: { background: '#EDE8DE', foreground: '#000000', primary: '#E85D2D', secondary: '#D6D0C4', muted: '#DFDBD2', accent: '#E85D2D', border: '#000000' },
    fonts: { body: 'SF Mono, Fira Code, monospace', heading: 'system-ui, sans-serif' },
    characteristics: ['Monospace typography', 'High contrast borders', 'Paper-like backgrounds', 'Orange accent highlights', 'Grid-based layouts'],
    useCases: ['Documentation sites', 'Technical dashboards', 'Data-heavy applications', 'Command-line interfaces', 'Developer tools'],
  },
  base: {
    name: 'base',
    label: 'Default',
    description: 'A clean, neutral foundation theme with excellent readability and versatility. The perfect starting point for any project.',
    colors: { background: '#FFFFFF', foreground: '#0F172A', primary: '#1E293B', secondary: '#F1F5F9', muted: '#F1F5F9', accent: '#F1F5F9', border: '#E2E8F0' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Clean sans-serif typography', 'Subtle borders', 'Neutral color palette', 'Professional appearance', 'High accessibility'],
    useCases: ['Corporate websites', 'SaaS products', 'E-commerce platforms', 'Blog platforms', 'Any general-purpose application'],
  },
  claude: {
    name: 'claude',
    label: 'Claude',
    description: 'Warm, inviting design inspired by Anthropic\'s Claude AI. Features terracotta accents and a friendly, approachable aesthetic.',
    colors: { background: '#FCF9F6', foreground: '#1F1A16', primary: '#E07A3A', secondary: '#E8E0D5', muted: '#EDE5DA', accent: '#E88E54', border: '#D6CCC0' },
    fonts: { body: 'Söhne, system-ui, sans-serif', heading: 'Söhne, system-ui, sans-serif' },
    characteristics: ['Warm terracotta primary color', 'Cream backgrounds', 'Soft, rounded elements', 'Friendly and approachable', 'Human-centered design'],
    useCases: ['AI chat interfaces', 'Conversational UIs', 'Wellness applications', 'Educational platforms', 'Customer support tools'],
  },
  chatgpt: {
    name: 'chatgpt',
    label: 'ChatGPT',
    description: 'Clean, professional design inspired by OpenAI\'s ChatGPT interface. Features a teal accent and light, airy feel.',
    colors: { background: '#F9FAFB', foreground: '#1A202C', primary: '#10A37F', secondary: '#E8EBEF', muted: '#EEF0F3', accent: '#10A37F', border: '#D9DEE5' },
    fonts: { body: 'Söhne, system-ui, sans-serif', heading: 'Söhne, system-ui, sans-serif' },
    characteristics: ['Teal/green primary accent', 'Clean white spaces', 'Minimal interface', 'Focus on content', 'Professional feel'],
    useCases: ['AI assistants', 'Chat applications', 'Productivity tools', 'Writing assistants', 'Code editors'],
  },
  vercel: {
    name: 'vercel',
    label: 'Vercel',
    description: 'Minimalist black and white design inspired by Vercel\'s branding. Ultimate clarity through simplicity.',
    colors: { background: '#FFFFFF', foreground: '#0D0D0D', primary: '#0D0D0D', secondary: '#F2F2F2', muted: '#F5F5F5', accent: '#0D0D0D', border: '#E5E5E5' },
    fonts: { body: 'Geist, Inter, system-ui, sans-serif', heading: 'Geist, Inter, system-ui, sans-serif' },
    characteristics: ['Pure black and white', 'Geometric typography', 'Maximum contrast', 'Developer-focused', 'Ultra-minimal'],
    useCases: ['Developer platforms', 'Deployment dashboards', 'API documentation', 'Technical products', 'Landing pages'],
  },
  'kodama-grove': {
    name: 'kodama-grove',
    label: 'Kodama Grove',
    description: 'A serene forest-inspired theme with lush greens and natural warmth. Evokes the peaceful spirits of Studio Ghibli forests.',
    colors: { background: '#F4F8F4', foreground: '#152815', primary: '#22A854', secondary: '#D8E5D8', muted: '#E5EDE5', accent: '#36B463', border: '#BFD4BF' },
    fonts: { body: 'Nunito, Quicksand, system-ui, sans-serif', heading: 'Nunito, Quicksand, system-ui, sans-serif' },
    characteristics: ['Forest green palette', 'Organic shapes', 'Soft rounded corners', 'Nature-inspired', 'Calming aesthetic'],
    useCases: ['Environmental apps', 'Wellness platforms', 'Nature blogs', 'Meditation apps', 'Sustainable brands'],
  },
  'vintage-paper': {
    name: 'vintage-paper',
    label: 'Vintage Paper',
    description: 'Nostalgic aged paper aesthetic with sepia tones and classic typography. Brings the warmth of old books and letters.',
    colors: { background: '#F5EDE0', foreground: '#2F2720', primary: '#8B6B4A', secondary: '#E0D4C3', muted: '#E8DFD2', accent: '#B08456', border: '#C5B69B' },
    fonts: { body: 'Courier Prime, Courier New, monospace', heading: 'Playfair Display, Times New Roman, serif' },
    characteristics: ['Sepia tones', 'Typewriter fonts', 'Aged paper texture', 'Classic elegance', 'Literary feel'],
    useCases: ['Literary magazines', 'Journaling apps', 'Poetry sites', 'Historical content', 'Personal blogs'],
  },
  'cosmic-night': {
    name: 'cosmic-night',
    label: 'Cosmic Night',
    description: 'Deep space-inspired dark theme with purple and cyan accents. Explore the universe through design.',
    colors: { background: '#0D0D1A', foreground: '#E8E8F0', primary: '#8B5CF6', secondary: '#1A1A2E', muted: '#252540', accent: '#06B6D4', border: '#2D2D4A' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Deep dark backgrounds', 'Purple and cyan accents', 'Glowing elements', 'Space aesthetic', 'Modern sci-fi'],
    useCases: ['Gaming platforms', 'Space/astronomy apps', 'Music platforms', 'Night mode experiences', 'Creative workspaces'],
  },
  cyberpunk: {
    name: 'cyberpunk',
    label: 'Cyberpunk',
    description: 'Neon-soaked futuristic aesthetic with high contrast and electric colors. Jack into the matrix.',
    colors: { background: '#0A0A0F', foreground: '#00FF9F', primary: '#FF00FF', secondary: '#1A1A2E', muted: '#252535', accent: '#00FFFF', border: '#FF00FF' },
    fonts: { body: 'Rajdhani, Orbitron, system-ui, sans-serif', heading: 'Orbitron, Rajdhani, system-ui, sans-serif' },
    characteristics: ['Neon colors', 'High contrast', 'Glitch aesthetics', 'Futuristic typography', 'Matrix-inspired'],
    useCases: ['Gaming sites', 'Tech startups', 'Music visualizers', 'Hacker themes', 'Futuristic UIs'],
  },
  caffeine: {
    name: 'caffeine',
    label: 'Caffeine',
    description: 'Rich coffee-inspired dark theme with warm browns and creamy highlights. Perfect for late-night coding sessions.',
    colors: { background: '#1C1816', foreground: '#F5F0EB', primary: '#8B4513', secondary: '#2D2520', muted: '#3D352F', accent: '#D2691E', border: '#3D352F' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Coffee brown tones', 'Warm dark mode', 'Cozy aesthetic', 'Rich contrast', 'Inviting feel'],
    useCases: ['Coffee shop apps', 'Developer tools', 'Reading apps', 'Productivity apps', 'Night mode interfaces'],
  },
  'neo-brutalism': {
    name: 'neo-brutalism',
    label: 'Neo Brutalism',
    description: 'Bold, raw design with thick borders and primary colors. Unapologetically striking and memorable.',
    colors: { background: '#FFFFE0', foreground: '#000000', primary: '#000000', secondary: '#FFD700', muted: '#F0F080', accent: '#FF3366', border: '#000000' },
    fonts: { body: 'Space Grotesk, system-ui, sans-serif', heading: 'Space Grotesk, system-ui, sans-serif' },
    characteristics: ['Thick black borders', 'Primary colors', 'Bold shadows', 'Raw aesthetic', 'High impact'],
    useCases: ['Creative agencies', 'Art portfolios', 'Fashion brands', 'Bold landing pages', 'Statement websites'],
  },
  'elegant-luxury': {
    name: 'elegant-luxury',
    label: 'Elegant Luxury',
    description: 'Sophisticated dark theme with gold accents. Premium feel for high-end brands and exclusive experiences.',
    colors: { background: '#1A1A1A', foreground: '#F5F5F5', primary: '#D4AF37', secondary: '#2D2D2D', muted: '#3D3D3D', accent: '#E5C76B', border: '#404040' },
    fonts: { body: 'Cormorant Garamond, Georgia, serif', heading: 'Cormorant Garamond, Georgia, serif' },
    characteristics: ['Gold accents', 'Dark elegance', 'Serif typography', 'Premium feel', 'Sophisticated'],
    useCases: ['Luxury brands', 'Fine dining', 'Jewelry stores', 'Premium services', 'VIP experiences'],
  },
  'pastel-dreams': {
    name: 'pastel-dreams',
    label: 'Pastel Dreams',
    description: 'Soft, dreamy palette with gentle pinks and blues. Light, airy, and wonderfully whimsical.',
    colors: { background: '#FFF5F8', foreground: '#4A3F52', primary: '#FFB6C1', secondary: '#E6F3FF', muted: '#FFF0F3', accent: '#DDA0DD', border: '#FFE4E8' },
    fonts: { body: 'Quicksand, system-ui, sans-serif', heading: 'Quicksand, system-ui, sans-serif' },
    characteristics: ['Soft pastels', 'Dreamy aesthetic', 'Light and airy', 'Playful', 'Feminine'],
    useCases: ['Beauty brands', 'Children\'s apps', 'Wedding sites', 'Lifestyle blogs', 'Creative sites'],
  },
  'ocean-breeze': {
    name: 'ocean-breeze',
    label: 'Ocean Breeze',
    description: 'Fresh coastal theme with sky blues and ocean cyans. Feel the sea spray in every pixel.',
    colors: { background: '#F0F9FF', foreground: '#0C4A6E', primary: '#0EA5E9', secondary: '#E0F2FE', muted: '#F0F9FF', accent: '#06B6D4', border: '#BAE6FD' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Ocean blues', 'Fresh and clean', 'Coastal vibes', 'Light and breezy', 'Calming'],
    useCases: ['Travel sites', 'Beach resorts', 'Water sports', 'Marine themes', 'Relaxation apps'],
  },
  'midnight-bloom': {
    name: 'midnight-bloom',
    label: 'Midnight Bloom',
    description: 'Deep purple dark theme with magenta florals. Mysterious and romantic night garden aesthetic.',
    colors: { background: '#1A0A1F', foreground: '#F8E8FF', primary: '#D946EF', secondary: '#2D1536', muted: '#3D2045', accent: '#F0ABFC', border: '#4A204F' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Deep purples', 'Floral accents', 'Romantic mood', 'Mysterious', 'Night aesthetic'],
    useCases: ['Beauty brands', 'Night clubs', 'Music platforms', 'Fashion sites', 'Romance themes'],
  },
  'northern-lights': {
    name: 'northern-lights',
    label: 'Northern Lights',
    description: 'Aurora borealis-inspired palette with cyan and emerald on deep blue. Nature\'s most spectacular light show.',
    colors: { background: '#0A1628', foreground: '#E8F4F8', primary: '#22D3EE', secondary: '#1E3A5F', muted: '#2D4A6F', accent: '#34D399', border: '#2D4A6F' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Aurora colors', 'Deep blue base', 'Glowing accents', 'Arctic feel', 'Ethereal'],
    useCases: ['Nordic brands', 'Weather apps', 'Science sites', 'Nature documentaries', 'Photography'],
  },
  'sunset-horizon': {
    name: 'sunset-horizon',
    label: 'Sunset Horizon',
    description: 'Warm orange gradient theme capturing golden hour. The perfect blend of day and night.',
    colors: { background: '#FFF7ED', foreground: '#7C2D12', primary: '#F97316', secondary: '#FED7AA', muted: '#FFEDD5', accent: '#FB923C', border: '#FDBA74' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Golden orange', 'Warm gradients', 'Inviting', 'Energetic', 'Optimistic'],
    useCases: ['Travel blogs', 'Photography', 'Lifestyle brands', 'Food delivery', 'Warm welcomes'],
  },
  'retro-arcade': {
    name: 'retro-arcade',
    label: 'Retro Arcade',
    description: 'Classic 8-bit gaming aesthetic with pixel-perfect colors. Insert coin to continue.',
    colors: { background: '#0F0F23', foreground: '#00FF00', primary: '#FF0000', secondary: '#1A1A3A', muted: '#252545', accent: '#FFFF00', border: '#00FF00' },
    fonts: { body: 'Press Start 2P, monospace', heading: 'Press Start 2P, monospace' },
    characteristics: ['Pixel fonts', 'Classic game colors', 'CRT aesthetic', 'Nostalgic', '8-bit vibes'],
    useCases: ['Gaming sites', 'Retro brands', 'Arcade apps', 'Nostalgia marketing', 'Game reviews'],
  },
  'quantum-rose': {
    name: 'quantum-rose',
    label: 'Quantum Rose',
    description: 'Sophisticated pink theme with scientific precision. Where elegance meets innovation.',
    colors: { background: '#FDF2F8', foreground: '#500724', primary: '#DB2777', secondary: '#FCE7F3', muted: '#FBCFE8', accent: '#EC4899', border: '#F9A8D4' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Rose pinks', 'Modern elegance', 'Scientific feel', 'Sophisticated', 'Contemporary'],
    useCases: ['Tech startups', 'Women in STEM', 'Beauty tech', 'Health apps', 'Innovation labs'],
  },
  'bold-tech': {
    name: 'bold-tech',
    label: 'Bold Tech',
    description: 'Modern tech dark theme with vibrant blue accents. Built for developers and digital creators.',
    colors: { background: '#18181B', foreground: '#FAFAFA', primary: '#2563EB', secondary: '#27272A', muted: '#3F3F46', accent: '#3B82F6', border: '#3F3F46' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Tech blue', 'Dark mode', 'Clean lines', 'Developer-friendly', 'Professional'],
    useCases: ['Developer tools', 'Tech blogs', 'SaaS dashboards', 'Code editors', 'API docs'],
  },
  'violet-bloom': {
    name: 'violet-bloom',
    label: 'Violet Bloom',
    description: 'Gentle purple theme with violet flowers. Creativity blooming in every interaction.',
    colors: { background: '#FAF5FF', foreground: '#4C1D95', primary: '#8B5CF6', secondary: '#EDE9FE', muted: '#F3E8FF', accent: '#A78BFA', border: '#DDD6FE' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Violet purples', 'Soft and creative', 'Floral inspiration', 'Gentle', 'Artistic'],
    useCases: ['Creative agencies', 'Art platforms', 'Design tools', 'Meditation apps', 'Creative writing'],
  },
  't3-chat': {
    name: 't3-chat',
    label: 'T3 Chat',
    description: 'Modern dark theme inspired by T3 stack aesthetics. Purple accents with a developer edge.',
    colors: { background: '#09090B', foreground: '#FAFAFA', primary: '#A855F7', secondary: '#18181B', muted: '#27272A', accent: '#C084FC', border: '#27272A' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Deep black', 'Purple accents', 'Modern dark mode', 'Developer aesthetic', 'Clean'],
    useCases: ['Chat apps', 'Developer tools', 'T3 stack projects', 'Discord bots', 'Tech products'],
  },
  'mocha-mousse': {
    name: 'mocha-mousse',
    label: 'Mocha Mousse',
    description: 'Warm chocolate tones with creamy highlights. Cozy and inviting like your favorite cafe.',
    colors: { background: '#F5EDE6', foreground: '#3D2F2A', primary: '#8B5A3C', secondary: '#E5D9CE', muted: '#EDE3DA', accent: '#A67B5B', border: '#D4C4B5' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Chocolate browns', 'Creamy accents', 'Warm and cozy', 'Cafe aesthetic', 'Inviting'],
    useCases: ['Coffee shops', 'Bakeries', 'Recipe blogs', 'Cafe menus', 'Comfort brands'],
  },
  'amethyst-haze': {
    name: 'amethyst-haze',
    label: 'Amethyst Haze',
    description: 'Mystical purple haze with crystal-like clarity. Enchanting and deeply atmospheric.',
    colors: { background: '#1C1625', foreground: '#E9E4F0', primary: '#9F7AEA', secondary: '#2D2640', muted: '#3D355A', accent: '#B794F4', border: '#4A3F5C' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Crystal purples', 'Mystical feel', 'Deep atmosphere', 'Enchanting', 'Premium dark'],
    useCases: ['Spiritual apps', 'Music platforms', 'Creative tools', 'Meditation', 'Night experiences'],
  },
  'doom-64': {
    name: 'doom-64',
    label: 'Doom 64',
    description: 'Intense dark theme with blood red accents. For those who dare to face the darkness.',
    colors: { background: '#0D0D0D', foreground: '#8B0000', primary: '#FF0000', secondary: '#1A0000', muted: '#2A0000', accent: '#FF4444', border: '#4A0000' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Blood red', 'Dark and intense', 'Aggressive', 'Gaming aesthetic', 'High contrast'],
    useCases: ['Gaming sites', 'Metal bands', 'Horror themes', 'Action games', 'Intense experiences'],
  },
  'amber-minimal': {
    name: 'amber-minimal',
    label: 'Amber Minimal',
    description: 'Warm amber tones with minimal design. Simple, warm, and wonderfully focused.',
    colors: { background: '#FFFBEB', foreground: '#78350F', primary: '#D97706', secondary: '#FEF3C7', muted: '#FEF9C3', accent: '#F59E0B', border: '#FDE68A' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Amber warmth', 'Minimal design', 'Clean focus', 'Inviting', 'Simple elegance'],
    useCases: ['Note apps', 'Productivity tools', 'Warm dashboards', 'Reading apps', 'Minimal sites'],
  },
  'solar-dusk': {
    name: 'solar-dusk',
    label: 'Solar Dusk',
    description: 'Warm sunset gradients on dark canvas. The moment between day and night captured in design.',
    colors: { background: '#1F1720', foreground: '#FDE68A', primary: '#F97316', secondary: '#2D2030', muted: '#3D3040', accent: '#FB923C', border: '#4A3545' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Sunset orange', 'Dark warmth', 'Gradient feel', 'Atmospheric', 'Transitional'],
    useCases: ['Music apps', 'Photography', 'Sunset themes', 'Chill experiences', 'Evening apps'],
  },
  'starry-night': {
    name: 'starry-night',
    label: 'Starry Night',
    description: 'Van Gogh-inspired deep blues with golden stars. Art meets interface in this painterly theme.',
    colors: { background: '#0F172A', foreground: '#FDE047', primary: '#3B82F6', secondary: '#1E293B', muted: '#334155', accent: '#60A5FA', border: '#334155' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Deep blue sky', 'Golden stars', 'Artistic feel', 'Van Gogh inspired', 'Dreamy'],
    useCases: ['Art galleries', 'Creative workspaces', 'Night apps', 'Astronomy', 'Museums'],
  },
  'soft-pop': {
    name: 'soft-pop',
    label: 'Soft Pop',
    description: 'Playful pastels with pop art energy. Fun, fresh, and full of personality.',
    colors: { background: '#FEFCE8', foreground: '#1E1B4B', primary: '#E879F9', secondary: '#FCE7F3', muted: '#FEF3C7', accent: '#A855F7', border: '#F5D0FE' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Pop colors', 'Playful energy', 'Fresh pastels', 'Fun aesthetic', 'Youthful'],
    useCases: ['Gen Z brands', 'Social apps', 'Creative tools', 'Music apps', 'Trendy products'],
  },
  'sage-garden': {
    name: 'sage-garden',
    label: 'Sage Garden',
    description: 'Calming sage greens with earthy undertones. Peaceful botanical garden aesthetic.',
    colors: { background: '#F1F5F0', foreground: '#2F3E2F', primary: '#6B8E6B', secondary: '#DCE5DC', muted: '#E5EDE5', accent: '#8BA888', border: '#B8C9B8' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Sage green', 'Natural calm', 'Garden aesthetic', 'Earthy', 'Peaceful'],
    useCases: ['Wellness apps', 'Plant shops', 'Organic brands', 'Spa sites', 'Botanical gardens'],
  },
  notebook: {
    name: 'notebook',
    label: 'Notebook',
    description: 'Handwritten charm with ruled lines and paper texture. Personal and intimate like a beloved journal.',
    colors: { background: '#FFFEF5', foreground: '#1C1917', primary: '#3B82F6', secondary: '#FEF9C3', muted: '#FEFCE8', accent: '#EF4444', border: '#93C5FD' },
    fonts: { body: 'Caveat, cursive', heading: 'Caveat, cursive' },
    characteristics: ['Paper texture', 'Ruled lines', 'Handwritten feel', 'Personal', 'Journaling'],
    useCases: ['Note apps', 'Journaling', 'Personal blogs', 'To-do apps', 'Writing tools'],
  },
  research: {
    name: 'research',
    label: 'Research',
    description: 'Academic paper aesthetic with scholarly typography. Serious, credible, and intellectually focused.',
    colors: { background: '#FAFAF8', foreground: '#1F2937', primary: '#1E40AF', secondary: '#F3F4F6', muted: '#F9FAFB', accent: '#2563EB', border: '#E5E7EB' },
    fonts: { body: 'Merriweather, Georgia, serif', heading: 'Merriweather, Georgia, serif' },
    characteristics: ['Academic feel', 'Serif typography', 'Scholarly', 'High readability', 'Credible'],
    useCases: ['Research papers', 'Academic sites', 'Documentation', 'Knowledge bases', 'Educational content'],
  },
  'modern-minimal': {
    name: 'modern-minimal',
    label: 'Modern Minimal',
    description: 'Pure reduction to essentials. Nothing competes for attention because nothing unnecessary exists.',
    colors: { background: '#FFFFFF', foreground: '#171717', primary: '#171717', secondary: '#F5F5F5', muted: '#FAFAFA', accent: '#171717', border: '#E5E5E5' },
    fonts: { body: 'Manrope, Inter, system-ui, sans-serif', heading: 'Manrope, Inter, system-ui, sans-serif' },
    characteristics: ['Maximum whitespace', 'Pure neutrals', 'Essential only', 'Zero decoration', 'Absolute clarity'],
    useCases: ['Workspaces', 'Minimal blogs', 'Product showcases', 'Art galleries', 'Clean landing pages'],
  },
  'clean-slate': {
    name: 'clean-slate',
    label: 'Clean Slate',
    description: 'Fresh start with cool grays and crisp blues. Professional clarity without compromise.',
    colors: { background: '#F8FAFC', foreground: '#0F172A', primary: '#3B82F6', secondary: '#E2E8F0', muted: '#F1F5F9', accent: '#60A5FA', border: '#CBD5E1' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' },
    characteristics: ['Cool grays', 'Blue accents', 'Professional', 'Clean lines', 'Fresh feel'],
    useCases: ['SaaS dashboards', 'Business apps', 'Corporate sites', 'Admin panels', 'Professional tools'],
  },
  perpetuity: {
    name: 'perpetuity',
    label: 'Perpetuity',
    description: 'Timeless elegance with deep blacks and subtle gold. Designed to last forever.',
    colors: { background: '#0A0A0A', foreground: '#E5E5E5', primary: '#B8860B', secondary: '#171717', muted: '#262626', accent: '#DAA520', border: '#333333' },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Cinzel, Georgia, serif' },
    characteristics: ['Deep black', 'Gold accents', 'Timeless', 'Sophisticated', 'Premium'],
    useCases: ['Luxury brands', 'Premium memberships', 'High-end workspaces', 'Exclusive services', 'VIP experiences'],
  },
  nature: {
    name: 'nature',
    label: 'Nature',
    description: 'Earth tones drawn from organic world. Rich soils, aged wood, and the quiet strength of growing things.',
    colors: { background: '#F6F3ED', foreground: '#27231B', primary: '#6B8E23', secondary: '#DDD7CA', muted: '#E5DED2', accent: '#CD853F', border: '#C7BDA8' },
    fonts: { body: 'Lora, Georgia, serif', heading: 'Lora, Georgia, serif' },
    characteristics: ['Earth tones', 'Organic warmth', 'Natural textures', 'Grounded feel', 'Sustainable'],
    useCases: ['Environmental sites', 'Organic brands', 'Nature blogs', 'Wellness apps', 'Sustainable businesses'],
  },
  candyland: {
    name: 'candyland',
    label: 'Candyland',
    description: 'Sweet, sugary aesthetic with candy pinks and mint greens. Deliciously playful design.',
    colors: { background: '#FFF5F9', foreground: '#4A2040', primary: '#FF69B4', secondary: '#E8F5E9', muted: '#FFE4EC', accent: '#98FB98', border: '#FFB6C1' },
    fonts: { body: 'Comic Neue, Quicksand, system-ui, sans-serif', heading: 'Fredoka One, Comic Neue, system-ui, sans-serif' },
    characteristics: ['Candy colors', 'Sweet aesthetic', 'Playful', 'Fun', 'Whimsical'],
    useCases: ['Kids apps', 'Candy stores', 'Party planning', 'Sweet shops', 'Fun brands'],
  },
};
