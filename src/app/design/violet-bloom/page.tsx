'use client';
import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Flower2, Sparkles, Palette, Loader2, RefreshCw, Copy, Check } from 'lucide-react';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import '@/lib/themes/themes.css';

// AI-Powered Gradient Generator - Elegant color scheme creation
interface GeneratedGradient {
  name: string;
  colors: string[];
  mood: string;
  angle: number;
}

function GradientGenerator() {
  const [gradient, setGradient] = useState<GeneratedGradient | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const moods = ['ethereal', 'royal', 'sunset', 'dreamy', 'mysterious'];

  const generateGradient = useCallback(async (moodPrompt?: string) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'gradient-suggestion',
          prompt: moodPrompt || prompt || 'beautiful violet and purple tones',
        }),
      });

      if (!response.ok) throw new Error('Failed');

      const data = await response.json();
      if (!data.error && data.colors?.length >= 2) {
        setGradient({
          name: data.name || 'Violet Dream',
          colors: data.colors,
          mood: data.mood || 'elegant',
          angle: data.angle || 135,
        });
      } else {
        // Fallback gradient
        setGradient({
          name: 'Royal Bloom',
          colors: ['#8B5CF6', '#A855F7', '#D946EF'],
          mood: 'regal',
          angle: 135,
        });
      }
    } catch (err) {
      setGradient({
        name: 'Violet Mist',
        colors: ['#7C3AED', '#8B5CF6', '#C4B5FD'],
        mood: 'serene',
        angle: 120,
      });
    } finally {
      setLoading(false);
    }
  }, [loading, prompt]);

  const copyGradient = useCallback(() => {
    if (!gradient) return;
    const css = `background: linear-gradient(${gradient.angle}deg, ${gradient.colors.join(', ')});`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [gradient]);

  const gradientStyle = gradient
    ? { background: `linear-gradient(${gradient.angle}deg, ${gradient.colors.join(', ')})` }
    : {};

  return (
    <div
      className="w-full rounded-lg border overflow-hidden"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '440px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            AI Gradient Studio
          </span>
        </div>
        <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col" style={{ height: 'calc(100% - 60px)' }}>
        {/* Quick mood buttons */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Quick moods
          </p>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => { setPrompt(mood); generateGradient(mood); }}
                className="px-3 py-1.5 rounded-full text-xs transition-all hover:opacity-80"
                style={{
                  backgroundColor: 'hsla(var(--theme-primary) / 0.1)',
                  color: 'hsl(var(--theme-primary))',
                  border: '1px solid hsla(var(--theme-primary) / 0.3)',
                }}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Custom prompt */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Or describe your mood..."
            className="flex-1 px-3 py-2 text-xs rounded-lg border-0 outline-none"
            style={{
              backgroundColor: 'hsl(var(--theme-secondary))',
              color: 'hsl(var(--theme-foreground))',
            }}
            onKeyDown={(e) => e.key === 'Enter' && generateGradient()}
          />
          <button
            onClick={() => generateGradient()}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80 disabled:opacity-50"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary-foreground))',
            }}
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Create'}
          </button>
        </div>

        {/* Gradient Preview */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {gradient ? (
              <motion.div
                key="gradient"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col"
              >
                {/* Gradient display */}
                <motion.div
                  className="flex-1 rounded-lg mb-3 relative overflow-hidden"
                  style={gradientStyle}
                  layoutId="gradient-display"
                >
                  {/* Animated shimmer */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <div>
                      <p className="text-white/90 text-lg font-medium drop-shadow-lg">
                        {gradient.name}
                      </p>
                      <p className="text-white/70 text-xs drop-shadow">
                        {gradient.mood}
                      </p>
                    </div>
                    <button
                      onClick={copyGradient}
                      className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <Copy className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Color swatches */}
                <div className="flex gap-2 mb-3">
                  {gradient.colors.map((color, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex-1 h-8 rounded-lg relative group cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => { navigator.clipboard.writeText(color); }}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white/90 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow">
                        {color}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Regenerate */}
                <button
                  onClick={() => generateGradient()}
                  disabled={loading}
                  className="w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all hover:opacity-80"
                  style={{
                    backgroundColor: 'hsl(var(--theme-secondary))',
                    color: 'hsl(var(--theme-secondary-foreground))',
                  }}
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  Generate New
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center"
              >
                <div
                  className="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
                  style={{ backgroundColor: 'hsla(var(--theme-primary) / 0.1)' }}
                >
                  <Palette className="w-8 h-8" style={{ color: 'hsl(var(--theme-primary))' }} />
                </div>
                <p className="text-sm mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>
                  Create beautiful gradients
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Select a mood or describe your vision
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function VioletBloomPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const watchDNA = useMemo(() => themeToWatch('violet-bloom'), []);

  return (
    <div
      ref={containerRef}
      data-design-theme="violet-bloom"
      className="min-h-screen relative"
      style={{ backgroundColor: 'hsl(var(--theme-background))', fontFamily: 'var(--theme-font)' }}
    >
      <motion.div
        className="fixed top-14 left-0 right-0 h-[2px] z-40 origin-left"
        style={{ scaleX: scrollYProgress, backgroundColor: 'hsl(var(--theme-primary))' }}
      />

      <DesignHeader
        currentTheme="violet-bloom"
        backHref="/design"
        backText="Gallery"
        rightContent={
          <span className="text-xs font-medium tracking-wide" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Premium Design
          </span>
        }
      />

      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center pt-16">
        <div className="max-w-4xl mx-auto px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Flower2 className="w-10 h-10 mb-6" style={{ color: 'hsl(var(--theme-primary))' }} />
            <h1 className="text-5xl md:text-7xl font-semibold leading-tight mb-8" style={{ color: 'hsl(var(--theme-foreground))' }}>
              Purple Elegance
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl mb-12" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Sophisticated violet tones. Violet Bloom brings regal purple hues to modern interfaces. Rich, deep, and undeniably premium.
            </p>
            <div className="grid grid-cols-3 gap-8 border-t pt-8" style={{ borderColor: 'hsl(var(--theme-border))' }}>
              <div>
                <p className="text-3xl font-semibold mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>V</p>
                <p className="text-xs uppercase tracking-wide" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Violet</p>
              </div>
              <div>
                <p className="text-3xl font-semibold mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>Jakarta</p>
                <p className="text-xs uppercase tracking-wide" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Typeface</p>
              </div>
              <div>
                <p className="text-3xl font-semibold mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>∞</p>
                <p className="text-xs uppercase tracking-wide" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Style</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Gradient Generator */}
      <section className="py-24">
        <div className="max-w-lg mx-auto px-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
            AI Gradient Studio
          </h2>
          <p className="text-sm mb-8" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Generate beautiful, unique gradients powered by AI. Describe a mood or pick a preset to create your perfect color blend.
          </p>
          <GradientGenerator />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-semibold mb-12" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Design Philosophy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Flower2, title: 'Royal Purple', desc: 'Deep violets and lavenders create a sense of luxury and sophistication.' },
              { icon: Sparkles, title: 'Subtle Shimmer', desc: 'Highlights that catch light like morning dew on violet petals.' },
              { icon: Palette, title: 'Harmonious Range', desc: 'From pale lavender to deep plum, a complete violet spectrum.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-lg border"
                style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsl(var(--theme-card))' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <item.icon className="w-6 h-6 mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-8">
          <blockquote className="border-l-2 pl-8" style={{ borderColor: 'hsl(var(--theme-primary))' }}>
            <p className="text-2xl font-medium leading-relaxed mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
              &ldquo;Violet has the shortest wavelength. It sits at the edge of visible light, closest to the invisible.&rdquo;
            </p>
            <cite className="text-sm not-italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>- Color Theory</cite>
          </blockquote>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/design"
              className="px-8 py-3 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}
            >
              Theme Gallery
            </Link>
            <Link
              href="/design/amethyst-haze"
              className="px-8 py-3 rounded-lg text-sm font-medium border transition-all hover:opacity-80"
              style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-foreground))' }}
            >
              Amethyst Haze
            </Link>
          </div>
        </div>
      </section>

      {/* Theme Timepiece */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-medium mb-4 text-center" style={{ color: 'hsl(var(--theme-foreground))' }}>Theme Timepiece</h2>
          <p className="text-center mb-8 text-sm font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>A watch face generated from this theme&apos;s violet bloom palette.</p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      <footer className="py-8 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 flex justify-between items-center">
          <p className="text-xs font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Violet Bloom</p>
          <p className="text-xs font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>OpenClaw-OS</p>
        </div>
      </footer>
    </div>
  );
}
