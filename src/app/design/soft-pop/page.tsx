'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Heart, Sparkles, Star, Loader2, Zap } from 'lucide-react';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import '@/lib/themes/themes.css';

interface Compliment {
  compliment: string;
  vibe: string;
  emoji: string;
  color: string;
}

function HypeMachine() {
  const [compliment, setCompliment] = useState<Compliment | null>(null);
  const [loading, setLoading] = useState(false);
  const [hypeCount, setHypeCount] = useState(0);
  const [selectedVibe, setSelectedVibe] = useState('');

  const vibes = ['confidence', 'creativity', 'kindness', 'energy', 'calm'];

  const getHype = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'compliment', context: selectedVibe || 'general' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setCompliment({ compliment: data.compliment || 'You are amazing!', vibe: data.vibe || 'sparkly', emoji: data.emoji || '✨', color: data.color || 'coral' });
        setHypeCount((prev) => prev + 1);
      }
    } catch {
      setCompliment({ compliment: 'Your energy is contagious!', vibe: 'radiant', emoji: '💫', color: 'mint' });
      setHypeCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [loading, selectedVibe]);

  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ backgroundColor: 'hsl(var(--theme-card))', border: '3px solid hsl(var(--theme-border))', height: '420px' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b-2" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-bold" style={{ color: 'hsl(var(--theme-foreground))' }}>Hype Machine</span>
        </div>
        {hypeCount > 0 && (
          <motion.span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }} initial={{ scale: 0 }} animate={{ scale: 1 }} key={hypeCount}>{hypeCount} hypes!</motion.span>
        )}
      </div>

      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 61px)' }}>
        <div className="flex flex-wrap gap-2 mb-5">
          {vibes.map((v) => (
            <motion.button key={v} onClick={() => setSelectedVibe(v)} className="px-4 py-2 rounded-full text-xs font-bold transition-all" style={{ backgroundColor: selectedVibe === v ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-background))', color: selectedVibe === v ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-foreground))', border: `2px solid ${selectedVibe === v ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-border))'}` }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{v}</motion.button>
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: 'hsl(var(--theme-primary))' }} /></motion.div>
                <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Generating hype...</p>
              </motion.div>
            ) : compliment ? (
              <motion.div key="compliment" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <motion.span className="text-6xl block mb-4" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.6 }}>{compliment.emoji}</motion.span>
                <p className="text-xl font-bold leading-relaxed mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>{compliment.compliment}</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.2)', color: 'hsl(var(--theme-primary))' }}>{compliment.vibe}</span>
                  <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'hsl(var(--theme-secondary))', color: 'hsl(var(--theme-secondary-foreground))' }}>{compliment.color}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <Heart className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))', opacity: 0.4 }} />
                <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Ready to get hyped?</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button onClick={getHype} disabled={loading} className="w-full py-3 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2" style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" />{compliment ? 'More Hype!' : 'Hype Me Up!'}</>}
        </motion.button>
      </div>
    </div>
  );
}

export default function SoftPopPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const watchDNA = useMemo(() => themeToWatch('soft-pop'), []);

  return (
    <div ref={containerRef} data-design-theme="soft-pop" className="min-h-screen relative" style={{ backgroundColor: 'hsl(var(--theme-background))', fontFamily: 'var(--theme-font)' }}>
      <motion.div className="fixed top-14 left-0 right-0 h-[3px] z-40 origin-left rounded-full" style={{ scaleX: scrollYProgress, backgroundColor: 'hsl(var(--theme-primary))' }} />

      <DesignHeader currentTheme="soft-pop" backHref="/design" backText="Gallery" rightContent={<span className="text-xs font-medium tracking-wide" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Playful Design</span>} />

      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center pt-16">
        <div className="max-w-4xl mx-auto px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Heart className="w-10 h-10 mb-6" style={{ color: 'hsl(var(--theme-primary))' }} />
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>Soft Pop</h1>
            <p className="text-xl leading-relaxed max-w-2xl mb-12" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Bubbly meets refined. Soft Pop combines playful energy with sophisticated restraint. Bright pops of color against soft pastels. Joy in design.</p>
            <div className="grid grid-cols-3 gap-8 border-t pt-8" style={{ borderColor: 'hsl(var(--theme-border))' }}>
              <div><p className="text-3xl font-bold mb-1" style={{ color: 'hsl(var(--theme-primary))' }}>💫</p><p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Pop</p></div>
              <div><p className="text-3xl font-bold mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>Quicksand</p><p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Typeface</p></div>
              <div><p className="text-3xl font-bold mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>∞</p><p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Fun</p></div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-lg mx-auto px-8">
          <h2 className="text-xl font-bold mb-2" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>AI Hype Machine</h2>
          <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Need a boost? Get personalized compliments that match your vibe.</p>
          <HypeMachine />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-bold mb-12" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>Pop Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: 'Soft Foundation', desc: 'Gentle pastels provide a calm base for vibrant accents.' },
              { icon: Sparkles, title: 'Strategic Pops', desc: 'Bold colors used sparingly create delightful surprises.' },
              { icon: Star, title: 'Rounded Edges', desc: 'Soft corners enhance the friendly, approachable feel.' },
            ].map((item, i) => (
              <motion.div key={i} className="p-6 rounded-2xl" style={{ backgroundColor: 'hsl(var(--theme-card))', border: '2px solid hsl(var(--theme-border))' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <item.icon className="w-6 h-6 mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24"><div className="max-w-3xl mx-auto px-8">
        <blockquote className="border-l-4 pl-8 rounded-l-lg" style={{ borderColor: 'hsl(var(--theme-primary))' }}>
          <p className="text-2xl font-medium leading-relaxed mb-4" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>&ldquo;Design should feel like opening a gift. Full of surprise and delight.&rdquo;</p>
          <cite className="text-sm not-italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>- Pop Philosophy</cite>
        </blockquote>
      </div></section>

      <section className="py-24 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/design" className="px-8 py-3 rounded-full text-sm font-medium transition-all hover:opacity-80" style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}>Theme Gallery</Link>
            <Link href="/design/pastel-dreams" className="px-8 py-3 rounded-full text-sm font-medium border-2 transition-all hover:opacity-80" style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-foreground))' }}>Pastel Dreams</Link>
          </div>
        </div>
      </section>

      {/* Theme Timepiece */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-medium mb-4 text-center" style={{ color: 'hsl(var(--theme-foreground))' }}>Theme Timepiece</h2>
          <p className="text-center mb-8 text-sm font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>A watch face generated from this theme&apos;s playful palette.</p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      <footer className="py-8 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 flex justify-between items-center">
          <p className="text-xs font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Soft Pop</p>
          <p className="text-xs font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>8gent</p>
        </div>
      </footer>
    </div>
  );
}
