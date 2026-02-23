'use client';
import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Flower, Heart, Gem, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import '@/lib/themes/themes.css';

// AI-Powered Affirmation Generator
interface Affirmation {
  affirmation: string;
  theme: string;
  emoji: string;
}

function AffirmationGenerator() {
  const [affirmation, setAffirmation] = useState<Affirmation | null>(null);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState('');

  const getAffirmation = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'affirmation',
          context: context || 'self-love and strength',
        }),
      });

      if (!response.ok) throw new Error('Failed');

      const data = await response.json();
      if (!data.error) {
        setAffirmation({
          affirmation: data.affirmation || 'I am worthy of love and joy.',
          theme: data.theme || 'love',
          emoji: data.emoji || '💜',
        });
      }
    } catch (err) {
      setAffirmation({
        affirmation: 'I embrace this moment with grace.',
        theme: 'grace',
        emoji: '🌸',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, context]);

  const themes = ['strength', 'peace', 'love', 'growth', 'courage'];

  return (
    <div
      className="w-full rounded-lg border overflow-hidden"
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
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-light tracking-wide" style={{ color: 'hsl(var(--theme-foreground))' }}>
            AI Affirmations
          </span>
        </div>
        <Heart className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
      </div>

      {/* Content */}
      <div
        className="flex flex-col p-6"
        style={{ height: 'calc(100% - 60px)' }}
      >
        {/* Theme Selector */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Choose your focus
          </p>
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setContext(t)}
                className="px-3 py-1.5 rounded-full text-xs transition-all"
                style={{
                  backgroundColor: context === t ? 'hsl(var(--theme-primary))' : 'transparent',
                  color: context === t ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
                  border: `1px solid ${context === t ? 'transparent' : 'hsl(var(--theme-border))'}`,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Affirmation Display */}
        <div className="flex-1 flex flex-col items-center justify-center">
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
                  className="w-8 h-8 mx-auto mb-3 animate-spin"
                  style={{ color: 'hsl(var(--theme-primary))' }}
                />
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Creating your affirmation...
                </p>
              </motion.div>
            ) : affirmation ? (
              <motion.div
                key="affirmation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <motion.span
                  className="text-4xl block mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                >
                  {affirmation.emoji}
                </motion.span>
                <p
                  className="text-xl font-light leading-relaxed mb-4 italic"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  &ldquo;{affirmation.affirmation}&rdquo;
                </p>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider"
                  style={{
                    backgroundColor: 'hsla(var(--theme-primary) / 0.15)',
                    color: 'hsl(var(--theme-primary))',
                  }}
                >
                  {affirmation.theme}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <Flower className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))', opacity: 0.5 }} />
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Select a focus and generate your affirmation
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Generate Button */}
        <button
          onClick={getAffirmation}
          disabled={loading}
          className="w-full py-3 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{
            backgroundColor: 'hsl(var(--theme-primary))',
            color: 'hsl(var(--theme-primary-foreground))',
          }}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : affirmation ? (
            <>
              <RefreshCw className="w-4 h-4" />
              New Affirmation
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Affirmation
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function QuantumRosePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const watchDNA = useMemo(() => themeToWatch('quantum-rose'), []);

  return (
    <div
      ref={containerRef}
      data-design-theme="quantum-rose"
      className="min-h-screen relative"
      style={{ backgroundColor: 'hsl(var(--theme-background))', fontFamily: 'var(--theme-font)' }}
    >
      <motion.div
        className="fixed top-14 left-0 right-0 h-[2px] z-40 origin-left"
        style={{ scaleX: scrollYProgress, backgroundColor: 'hsl(var(--theme-primary))' }}
      />

      <DesignHeader
        currentTheme="quantum-rose"
        backHref="/design"
        backText="Gallery"
        rightContent={
          <span className="text-xs tracking-widest uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Feminine Design
          </span>
        }
      />

      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center pt-16">
        <div className="max-w-4xl mx-auto px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Flower className="w-10 h-10 mb-6" style={{ color: 'hsl(var(--theme-primary))' }} />
            <h1 className="text-5xl md:text-7xl font-light leading-tight mb-8 tracking-tight" style={{ color: 'hsl(var(--theme-foreground))' }}>
              Soft Power
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl mb-12" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Strength in gentle hues. Quantum Rose proves that softness is not weakness. Delicate pinks and rose golds create interfaces of quiet elegance and confident grace.
            </p>
            <div className="grid grid-cols-3 gap-8 border-t pt-8" style={{ borderColor: 'hsl(var(--theme-border))' }}>
              <div>
                <p className="text-3xl font-light mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>350°</p>
                <p className="text-xs uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Rose Hue</p>
              </div>
              <div>
                <p className="text-3xl font-light mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>Raleway</p>
                <p className="text-xs uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Typeface</p>
              </div>
              <div>
                <p className="text-3xl font-light mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>∞</p>
                <p className="text-xs uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Elegance</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Affirmation Generator */}
      <section className="py-24">
        <div className="max-w-lg mx-auto px-8">
          <h2 className="text-2xl font-light mb-4 tracking-wide" style={{ color: 'hsl(var(--theme-foreground))' }}>
            AI Affirmation Generator
          </h2>
          <p className="text-sm mb-8" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Choose your focus and receive a uniquely generated affirmation to carry with you today.
          </p>
          <AffirmationGenerator />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-light mb-12 tracking-wide" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Gentle Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Flower, title: 'Rose Palette', desc: 'Soft pinks and blush tones create warmth without overwhelming.' },
              { icon: Heart, title: 'Graceful Forms', desc: 'Elegant curves and refined proportions speak to sophistication.' },
              { icon: Gem, title: 'Subtle Shine', desc: 'Rose gold accents add precious touches without ostentation.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-6 border"
                style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsl(var(--theme-card))' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <item.icon className="w-6 h-6 mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                <h3 className="text-lg font-light tracking-wide mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-8">
          <blockquote className="border-l pl-8" style={{ borderColor: 'hsl(var(--theme-primary))' }}>
            <p className="text-2xl font-light leading-relaxed mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
              &ldquo;Elegance is when the inside is as beautiful as the outside.&rdquo;
            </p>
            <cite className="text-sm not-italic tracking-wide" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>- Coco Chanel</cite>
          </blockquote>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/design"
              className="px-8 py-3 text-sm tracking-wide transition-all hover:opacity-80"
              style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}
            >
              Theme Gallery
            </Link>
            <Link
              href="/design/pastel-dreams"
              className="px-8 py-3 text-sm tracking-wide border transition-all hover:opacity-80"
              style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-foreground))' }}
            >
              Pastel Dreams
            </Link>
          </div>
        </div>
      </section>

      {/* Theme Timepiece */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-medium mb-4 text-center tracking-wider" style={{ color: 'hsl(var(--theme-foreground))' }}>Theme Timepiece</h2>
          <p className="text-center mb-8 text-sm tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>A watch face generated from this theme&apos;s rose quantum palette.</p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      <footer className="py-8 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 flex justify-between items-center">
          <p className="text-xs tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Quantum Rose</p>
          <p className="text-xs tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>8gent</p>
        </div>
      </footer>
    </div>
  );
}
