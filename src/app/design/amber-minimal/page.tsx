'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Sun, Circle, Loader2, RefreshCw } from 'lucide-react';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import '@/lib/themes/themes.css';

interface Haiku {
  line1: string;
  line2: string;
  line3: string;
  theme: string;
}

function HaikuGenerator() {
  const [haiku, setHaiku] = useState<Haiku | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('');

  const themes = ['morning light', 'quiet moments', 'amber warmth', 'simple joy', 'letting go'];

  const generateHaiku = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'haiku',
          context: selectedTheme || 'warmth and simplicity',
        }),
      });

      if (!response.ok) throw new Error('Failed');

      const data = await response.json();
      if (!data.error) {
        setHaiku({
          line1: data.line1 || 'Golden light spills through',
          line2: data.line2 || 'Warming empty spaces here',
          line3: data.line3 || 'Simple things remain',
          theme: data.theme || 'warmth',
        });
      }
    } catch {
      setHaiku({
        line1: 'Amber glow persists',
        line2: 'Through the quiet afternoon',
        line3: 'Nothing more is needed',
        theme: 'simplicity',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, selectedTheme]);

  return (
    <div
      className="w-full border overflow-hidden"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '380px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <span className="text-xs tracking-wide" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          AI Haiku
        </span>
        <Circle className="w-3 h-3" style={{ color: 'hsl(var(--theme-primary))' }} />
      </div>

      {/* Content */}
      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 57px)' }}>
        {/* Theme chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTheme(t)}
              className="px-3 py-1 text-xs transition-all"
              style={{
                backgroundColor: selectedTheme === t ? 'hsl(var(--theme-primary))' : 'transparent',
                color: selectedTheme === t ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
                border: `1px solid ${selectedTheme === t ? 'transparent' : 'hsl(var(--theme-border))'}`,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Haiku display */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <Loader2
                  className="w-5 h-5 mx-auto animate-spin"
                  style={{ color: 'hsl(var(--theme-primary))' }}
                />
              </motion.div>
            ) : haiku ? (
              <motion.div
                key="haiku"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-3"
              >
                <motion.p
                  className="text-lg"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                >
                  {haiku.line1}
                </motion.p>
                <motion.p
                  className="text-lg"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {haiku.line2}
                </motion.p>
                <motion.p
                  className="text-lg"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {haiku.line3}
                </motion.p>
                <motion.span
                  className="inline-block mt-4 text-xs"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  {haiku.theme}
                </motion.span>
              </motion.div>
            ) : (
              <motion.p
                key="empty"
                className="text-sm"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                Select a theme and generate
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Generate button */}
        <button
          onClick={generateHaiku}
          disabled={loading}
          className="w-full py-2.5 text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{
            backgroundColor: 'hsl(var(--theme-primary))',
            color: 'hsl(var(--theme-primary-foreground))',
          }}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : haiku ? (
            <>
              <RefreshCw className="w-3 h-3" />
              New Haiku
            </>
          ) : (
            'Generate'
          )}
        </button>
      </div>
    </div>
  );
}

export default function AmberMinimalPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const watchDNA = useMemo(() => themeToWatch('amber-minimal'), []);

  return (
    <div
      ref={containerRef}
      data-design-theme="amber-minimal"
      className="min-h-screen relative"
      style={{ backgroundColor: 'hsl(var(--theme-background))', fontFamily: 'var(--theme-font)' }}
    >
      <motion.div
        className="fixed top-14 left-0 right-0 h-[1px] z-40 origin-left"
        style={{ scaleX: scrollYProgress, backgroundColor: 'hsl(var(--theme-primary))' }}
      />

      <DesignHeader
        currentTheme="amber-minimal"
        backHref="/design"
        backText="Gallery"
        rightContent={
          <span className="text-xs tracking-wide" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Minimal Design
          </span>
        }
      />

      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center pt-16">
        <div className="max-w-4xl mx-auto px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Circle className="w-8 h-8 mb-8" style={{ color: 'hsl(var(--theme-primary))' }} />
            <h1 className="text-5xl md:text-7xl font-medium leading-tight mb-8" style={{ color: 'hsl(var(--theme-foreground))' }}>
              Warm Glow
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl mb-12" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Minimal amber elegance. Amber Minimal combines the warmth of golden tones with the restraint of minimal design. Golden simplicity.
            </p>
            <div className="grid grid-cols-3 gap-8 border-t pt-8" style={{ borderColor: 'hsl(var(--theme-border))' }}>
              <div>
                <p className="text-3xl font-medium mb-1" style={{ color: 'hsl(var(--theme-primary))' }}>🟠</p>
                <p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Amber</p>
              </div>
              <div>
                <p className="text-3xl font-medium mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>Inter</p>
                <p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Typeface</p>
              </div>
              <div>
                <p className="text-3xl font-medium mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>∞</p>
                <p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Simple</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Haiku Generator */}
      <section className="py-24">
        <div className="max-w-md mx-auto px-8">
          <h2 className="text-xl font-medium mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>
            AI Haiku
          </h2>
          <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Minimalist poetry, generated. Three lines of quiet contemplation.
          </p>
          <HaikuGenerator />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-medium mb-12" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Principles
          </h2>
          <div className="space-y-8">
            {[
              { icon: Sun, title: 'Warm Accents', desc: 'Amber highlights that feel like captured sunlight. Inviting but restrained.' },
              { icon: Circle, title: 'Clean Foundation', desc: 'Minimal structure allows the warm color to shine without competition.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex gap-6 p-6 border"
                style={{ borderColor: 'hsl(var(--theme-border))' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(var(--theme-primary))' }} />
                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-8">
          <blockquote className="border-l pl-8" style={{ borderColor: 'hsl(var(--theme-primary))' }}>
            <p className="text-2xl font-medium leading-relaxed mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
              &ldquo;Simplicity with warmth is the ultimate sophistication.&rdquo;
            </p>
            <cite className="text-sm not-italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>- Amber Philosophy</cite>
          </blockquote>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/design"
              className="px-8 py-3 text-sm font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}
            >
              Theme Gallery
            </Link>
            <Link
              href="/design/solar-dusk"
              className="px-8 py-3 text-sm font-medium border transition-all hover:opacity-80"
              style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-foreground))' }}
            >
              Solar Dusk
            </Link>
          </div>
        </div>
      </section>

      {/* Theme Timepiece */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-medium mb-4 text-center" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Theme Timepiece
          </h2>
          <p className="text-center mb-8 text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            A watch face generated from this theme&apos;s amber warmth.
          </p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      <footer className="py-8 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 flex justify-between items-center">
          <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Amber Minimal</p>
          <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>8gent</p>
        </div>
      </footer>
    </div>
  );
}
