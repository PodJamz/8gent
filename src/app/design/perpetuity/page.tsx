'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Circle, Loader2, Quote } from 'lucide-react';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import '@/lib/themes/themes.css';

interface Wisdom {
  wisdom: string;
  source: string;
  era: string;
  theme: string;
}

function TimelessWisdom() {
  const [wisdom, setWisdom] = useState<Wisdom | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('');

  const themes = ['time', 'truth', 'beauty', 'virtue', 'change'];

  const generateWisdom = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'timeless-wisdom',
          context: selectedTheme || 'the nature of time',
        }),
      });

      if (!response.ok) throw new Error('Failed');

      const data = await response.json();
      if (!data.error) {
        setWisdom({
          wisdom: data.wisdom || 'That which endures, teaches.',
          source: data.source || 'Aurelius the Elder',
          era: data.era || 'Ancient',
          theme: data.theme || 'endurance',
        });
      }
    } catch {
      setWisdom({
        wisdom: 'In gray we find all colors waiting.',
        source: 'Marcus Umbra',
        era: 'Renaissance',
        theme: 'patience',
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
        height: '400px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <span className="text-xs tracking-widest uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Timeless Wisdom
        </span>
        <Quote className="w-4 h-4" style={{ color: 'hsl(var(--theme-foreground))' }} />
      </div>

      {/* Content */}
      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 57px)' }}>
        {/* Theme chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTheme(t)}
              className="px-3 py-1.5 text-xs tracking-wide transition-all"
              style={{
                backgroundColor: selectedTheme === t ? 'hsl(var(--theme-foreground))' : 'transparent',
                color: selectedTheme === t ? 'hsl(var(--theme-background))' : 'hsl(var(--theme-muted-foreground))',
                border: `1px solid ${selectedTheme === t ? 'transparent' : 'hsl(var(--theme-border))'}`,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Wisdom display */}
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
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                />
              </motion.div>
            ) : wisdom ? (
              <motion.div
                key="wisdom"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center max-w-sm"
              >
                <motion.p
                  className="text-lg leading-relaxed mb-6 italic"
                  style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  &ldquo;{wisdom.wisdom}&rdquo;
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    {wisdom.source}
                  </p>
                  <p className="text-xs tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    {wisdom.era} • {wisdom.theme}
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.p
                key="empty"
                className="text-sm"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                Select a theme for contemplation
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Generate button */}
        <button
          onClick={generateWisdom}
          disabled={loading}
          className="w-full py-2.5 text-sm tracking-wide transition-all hover:opacity-90 disabled:opacity-50"
          style={{
            backgroundColor: 'hsl(var(--theme-foreground))',
            color: 'hsl(var(--theme-background))',
          }}
        >
          {loading ? 'Contemplating...' : wisdom ? 'Seek Again' : 'Seek Wisdom'}
        </button>
      </div>
    </div>
  );
}

export default function PerpetuityPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const watchDNA = useMemo(() => themeToWatch('perpetuity'), []);

  return (
    <div
      ref={containerRef}
      data-design-theme="perpetuity"
      className="min-h-screen relative"
      style={{ backgroundColor: 'hsl(var(--theme-background))', fontFamily: 'var(--theme-font)' }}
    >
      <motion.div
        className="fixed top-14 left-0 right-0 h-[1px] z-40 origin-left"
        style={{ scaleX: scrollYProgress, backgroundColor: 'hsl(var(--theme-foreground))' }}
      />

      <DesignHeader
        currentTheme="perpetuity"
        backHref="/design"
        backText="Gallery"
        rightContent={
          <span className="text-xs tracking-widest uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Enduring
          </span>
        }
      />

      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center pt-16">
        <div className="max-w-4xl mx-auto px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Circle className="w-8 h-8 mb-8" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
            <h1
              className="text-5xl md:text-7xl leading-tight mb-8"
              style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
            >
              Eternal Gray
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl mb-12" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Timeless monochrome elegance. Perpetuity embraces the infinite spectrum between black and white, creating interfaces that transcend trends. Never out of style.
            </p>
            <div className="grid grid-cols-3 gap-8 border-t pt-8" style={{ borderColor: 'hsl(var(--theme-border))' }}>
              <div>
                <p className="text-3xl mb-1" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>∞</p>
                <p className="text-xs uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Forever</p>
              </div>
              <div>
                <p className="text-3xl mb-1" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>EB Garamond</p>
                <p className="text-xs uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Typeface</p>
              </div>
              <div>
                <p className="text-3xl mb-1" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>0</p>
                <p className="text-xs uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Colors</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeless Wisdom Generator */}
      <section className="py-24">
        <div className="max-w-md mx-auto px-8">
          <h2 className="text-xl mb-2" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>
            AI Wisdom
          </h2>
          <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Timeless philosophical insights, generated from the ages.
          </p>
          <TimelessWisdom />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl mb-12" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>
            Timeless Principles
          </h2>
          <div className="space-y-12">
            {[
              { title: 'Monochrome Mastery', desc: 'When color is absent, form and typography must carry all meaning. This constraint breeds excellence.' },
              { title: 'Grayscale Gradient', desc: 'Fifty shades between black and white provide infinite subtlety for hierarchy and emphasis.' },
              { title: 'Classical Foundation', desc: 'Serif typography rooted in centuries of tradition anchors the timeless aesthetic.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="border-b pb-8"
                style={{ borderColor: 'hsl(var(--theme-border))' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl mb-3" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-8">
          <blockquote className="border-l pl-8" style={{ borderColor: 'hsl(var(--theme-foreground))' }}>
            <p
              className="text-2xl leading-relaxed mb-4"
              style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
            >
              &ldquo;Gray is the color of intellect and of compromise.&rdquo;
            </p>
            <cite className="text-sm not-italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>- Wassily Kandinsky</cite>
          </blockquote>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/design"
              className="px-8 py-3 text-sm transition-all hover:opacity-80"
              style={{ backgroundColor: 'hsl(var(--theme-foreground))', color: 'hsl(var(--theme-background))' }}
            >
              Theme Gallery
            </Link>
            <Link
              href="/design/elegant-luxury"
              className="px-8 py-3 text-sm border transition-all hover:opacity-80"
              style={{ borderColor: 'hsl(var(--theme-foreground))', color: 'hsl(var(--theme-foreground))' }}
            >
              Elegant Luxury
            </Link>
          </div>
        </div>
      </section>

      {/* Theme Timepiece */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-medium mb-4 text-center tracking-wider" style={{ color: 'hsl(var(--theme-foreground))' }}>Theme Timepiece</h2>
          <p className="text-center mb-8 text-sm tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>A watch face generated from this theme&apos;s eternal palette.</p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      <footer className="py-8 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 flex justify-between items-center">
          <p className="text-xs tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Perpetuity</p>
          <p className="text-xs tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>8gent</p>
        </div>
      </footer>
    </div>
  );
}
