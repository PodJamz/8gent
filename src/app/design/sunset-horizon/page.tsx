'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Sun, Camera, Palette, Loader2 } from 'lucide-react';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import '@/lib/themes/themes.css';

interface SunsetCaption {
  caption: string;
  time: string;
  colors: string;
  feeling: string;
}

function GoldenMomentGenerator() {
  const [caption, setCaption] = useState<SunsetCaption | null>(null);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState('');

  const moods = ['peaceful', 'nostalgic', 'hopeful', 'romantic', 'reflective'];

  const captureM = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'sunset-caption', prompt: mood || 'the perfect sunset moment' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setCaption({
          caption: data.caption || 'The sky remembers every sunset.',
          time: data.time || '7:42 PM',
          colors: data.colors || 'amber fading to rose',
          feeling: data.feeling || 'wonder',
        });
      }
    } catch {
      setCaption({ caption: 'Every sunset is a new beginning.', time: '7:38 PM', colors: 'gold melting into violet', feeling: 'peace' });
    } finally {
      setLoading(false);
    }
  }, [loading, mood]);

  return (
    <div className="w-full rounded-xl border overflow-hidden" style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsl(var(--theme-card))', height: '420px' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>Golden Moment</span>
        </div>
        <Camera className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
      </div>

      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 57px)' }}>
        <div className="flex flex-wrap gap-2 mb-5">
          {moods.map((m) => (
            <button key={m} onClick={() => setMood(m)} className="px-3 py-1.5 text-xs rounded-xl transition-all" style={{ backgroundColor: mood === m ? 'hsl(var(--theme-primary))' : 'transparent', color: mood === m ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))', border: `1px solid ${mood === m ? 'transparent' : 'hsl(var(--theme-border))'}` }}>{m}</button>
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                  <Sun className="w-10 h-10 mx-auto mb-3" style={{ color: 'hsl(var(--theme-primary))' }} />
                </motion.div>
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Capturing the light...</p>
              </motion.div>
            ) : caption ? (
              <motion.div key="caption" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <motion.div className="text-sm font-bold mb-4 px-4 py-2 rounded-full inline-block" style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.2)', color: 'hsl(var(--theme-primary))' }} initial={{ scale: 0 }} animate={{ scale: 1 }}>{caption.time}</motion.div>
                <p className="text-xl font-medium leading-relaxed mb-4 italic" style={{ color: 'hsl(var(--theme-foreground))' }}>&ldquo;{caption.caption}&rdquo;</p>
                <p className="text-sm mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{caption.colors}</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'hsl(var(--theme-secondary))', color: 'hsl(var(--theme-secondary-foreground))' }}>{caption.feeling}</span>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(var(--theme-primary)), hsl(var(--theme-accent)))' }}>
                  <Sun className="w-8 h-8" style={{ color: 'white' }} />
                </div>
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Select a mood and capture the moment</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={captureM} disabled={loading} className="w-full py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2" style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Camera className="w-4 h-4" />{caption ? 'Capture Again' : 'Capture Moment'}</>}
        </button>
      </div>
    </div>
  );
}

export default function SunsetHorizonPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const watchDNA = useMemo(() => themeToWatch('sunset-horizon'), []);

  return (
    <div ref={containerRef} data-design-theme="sunset-horizon" className="min-h-screen relative" style={{ backgroundColor: 'hsl(var(--theme-background))', fontFamily: 'var(--theme-font)' }}>
      <motion.div className="fixed top-14 left-0 right-0 h-[3px] z-40 origin-left" style={{ scaleX: scrollYProgress, backgroundColor: 'hsl(var(--theme-primary))' }} />

      <DesignHeader currentTheme="sunset-horizon" backHref="/design" backText="Gallery" rightContent={<span className="text-xs font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Twilight Design</span>} />

      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center pt-16">
        <div className="max-w-4xl mx-auto px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Sun className="w-10 h-10 mb-6" style={{ color: 'hsl(var(--theme-primary))' }} />
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8" style={{ color: 'hsl(var(--theme-foreground))' }}>Golden Hour</h1>
            <p className="text-xl leading-relaxed max-w-2xl mb-12" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>When magic paints the sky. Sunset Horizon captures that fleeting moment when day meets night. Warm oranges, soft pinks, and the promise of twilight.</p>
            <div className="grid grid-cols-3 gap-8 border-t pt-8" style={{ borderColor: 'hsl(var(--theme-border))' }}>
              <div><p className="text-3xl font-bold mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>7:42</p><p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>PM</p></div>
              <div><p className="text-3xl font-bold mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>Rubik</p><p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Typeface</p></div>
              <div><p className="text-3xl font-bold mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>∞</p><p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Magic</p></div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-lg mx-auto px-8">
          <h2 className="text-xl font-bold mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>AI Golden Moment</h2>
          <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Capture fleeting beauty. Generate poetic sunset captions.</p>
          <GoldenMomentGenerator />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-bold mb-12" style={{ color: 'hsl(var(--theme-foreground))' }}>Twilight Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Sun, title: 'Warm Gradients', desc: 'Colors that transition like the sky, from golden amber to soft rose.' },
              { icon: Camera, title: 'Golden Light', desc: 'Everything bathed in that perfect photographic warmth.' },
              { icon: Palette, title: 'Horizon Palette', desc: 'The full spectrum of sunset: oranges, pinks, purples, and deep blues.' },
            ].map((item, i) => (
              <motion.div key={i} className="p-6 rounded-xl border" style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsl(var(--theme-card))' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <item.icon className="w-6 h-6 mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24"><div className="max-w-3xl mx-auto px-8">
        <blockquote className="border-l-4 pl-8" style={{ borderColor: 'hsl(var(--theme-primary))' }}>
          <p className="text-2xl font-medium leading-relaxed mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>&ldquo;Sunsets are proof that endings can be beautiful too.&rdquo;</p>
          <cite className="text-sm not-italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>- Sunset Philosophy</cite>
        </blockquote>
      </div></section>

      <section className="py-24 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/design" className="px-8 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105" style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}>Theme Gallery</Link>
            <Link href="/design/solar-dusk" className="px-8 py-3 rounded-xl text-sm font-medium border transition-all hover:scale-105" style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-foreground))' }}>Solar Dusk</Link>
          </div>
        </div>
      </section>

      {/* Theme Timepiece */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-medium mb-4 text-center" style={{ color: 'hsl(var(--theme-foreground))' }}>Theme Timepiece</h2>
          <p className="text-center mb-8 text-sm font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>A watch face generated from this theme&apos;s twilight palette.</p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      <footer className="py-8 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 flex justify-between items-center">
          <p className="text-xs font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Sunset Horizon</p>
          <p className="text-xs font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>8gent</p>
        </div>
      </footer>
    </div>
  );
}
