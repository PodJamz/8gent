'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Leaf, TreeDeciduous, Flower2, Loader2, Sprout } from 'lucide-react';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import '@/lib/themes/themes.css';

interface PlantWisdom {
  plant: string;
  wisdom: string;
  care: string;
  emoji: string;
}

function PlantWisdomGenerator() {
  const [plantWisdom, setPlantWisdom] = useState<PlantWisdom | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');

  const questions = ['I feel stuck', 'I need patience', 'Help me grow', 'Finding peace', 'New beginnings'];

  const seekWisdom = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'plant-wisdom', prompt: question || 'I need guidance' }),
      });

      if (!response.ok) throw new Error('Failed');

      const data = await response.json();
      if (!data.error) {
        setPlantWisdom({
          plant: data.plant || 'Sage',
          wisdom: data.wisdom || 'Growth happens in its own time.',
          care: data.care || 'Water deeply, then wait.',
          emoji: data.emoji || '🌿',
        });
      }
    } catch {
      setPlantWisdom({ plant: 'Oak', wisdom: 'Strong roots make strong branches.', care: 'Stand firm in storms.', emoji: '🌳' });
    } finally {
      setLoading(false);
    }
  }, [loading, question]);

  return (
    <div
      className="w-full rounded-lg border overflow-hidden"
      style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsl(var(--theme-card))', height: '420px' }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>Plant Wisdom</span>
        </div>
        <Leaf className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
      </div>

      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 57px)' }}>
        <div className="flex flex-wrap gap-2 mb-5">
          {questions.map((q) => (
            <button
              key={q}
              onClick={() => setQuestion(q)}
              className="px-3 py-1.5 text-xs rounded-full transition-all"
              style={{
                backgroundColor: question === q ? 'hsl(var(--theme-primary))' : 'transparent',
                color: question === q ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
                border: `1px solid ${question === q ? 'transparent' : 'hsl(var(--theme-border))'}`,
              }}
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Leaf className="w-8 h-8 mx-auto mb-3" style={{ color: 'hsl(var(--theme-primary))' }} />
                  Open8gent
                </motion.div>
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Listening to the garden...</p>
              </motion.div>
            ) : plantWisdom ? (
              <motion.div key="wisdom" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <motion.span className="text-5xl block mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>{plantWisdom.emoji}</motion.span>
                <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'hsl(var(--theme-primary))' }}>{plantWisdom.plant} speaks</p>
                <p className="text-lg leading-relaxed mb-4 italic" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>&ldquo;{plantWisdom.wisdom}&rdquo;</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'hsla(var(--theme-primary) / 0.15)' }}>
                  <Sprout className="w-3 h-3" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <span className="text-xs" style={{ color: 'hsl(var(--theme-primary))' }}>{plantWisdom.care}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <TreeDeciduous className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))', opacity: 0.4 }} />
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>What wisdom do you seek?</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={seekWisdom}
          disabled={loading}
          className="w-full py-3 rounded-lg text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Leaf className="w-4 h-4" />{plantWisdom ? 'Ask Again' : 'Seek Wisdom'}</>}
        </button>
      </div>
    </div>
  );
}

export default function SageGardenPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const watchDNA = useMemo(() => themeToWatch('sage-garden'), []);

  return (
    <div ref={containerRef} data-design-theme="sage-garden" className="min-h-screen relative" style={{ backgroundColor: 'hsl(var(--theme-background))', fontFamily: 'var(--theme-font)' }}>
      <motion.div className="fixed top-14 left-0 right-0 h-[2px] z-40 origin-left" style={{ scaleX: scrollYProgress, backgroundColor: 'hsl(var(--theme-primary))' }} />

      <DesignHeader currentTheme="sage-garden" backHref="/design" backText="Gallery" rightContent={<span className="text-xs tracking-wide" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Natural Design</span>} />

      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center pt-16">
        <div className="max-w-4xl mx-auto px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Leaf className="w-10 h-10 mb-6" style={{ color: 'hsl(var(--theme-primary))' }} />
            <h1 className="text-5xl md:text-7xl leading-tight mb-8" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>Sage Garden</h1>
            <p className="text-xl leading-relaxed max-w-2xl mb-12" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Cultivated tranquility. Sage Garden brings the meditative calm of an herb garden. Soft greens, earthy tones, and the grounded presence of growing things.</p>
            <div className="grid grid-cols-3 gap-8 border-t pt-8" style={{ borderColor: 'hsl(var(--theme-border))' }}>
              <div><p className="text-3xl mb-1" style={{ color: 'hsl(var(--theme-primary))' }}>🌿</p><p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Sage</p></div>
              <div><p className="text-3xl mb-1" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>Lora</p><p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Typeface</p></div>
              <div><p className="text-3xl mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>∞</p><p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Growth</p></div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-lg mx-auto px-8">
          <h2 className="text-xl mb-2" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>AI Plant Wisdom</h2>
          <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Ask the garden. Each plant has wisdom to share.</p>
          <PlantWisdomGenerator />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl mb-12" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>Garden Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Leaf, title: 'Soft Greens', desc: 'Muted sage tones create a calming, natural palette.' },
              { icon: TreeDeciduous, title: 'Organic Forms', desc: 'Gentle curves and natural shapes mirror the garden.' },
              { icon: Flower2, title: 'Quiet Growth', desc: 'Elements that feel cultivated with care and intention.' },
            ].map((item, i) => (
              <motion.div key={i} className="p-6 border rounded-lg" style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsl(var(--theme-card))' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <item.icon className="w-6 h-6 mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                <h3 className="text-lg mb-2" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24"><div className="max-w-3xl mx-auto px-8">
        <blockquote className="border-l-2 pl-8" style={{ borderColor: 'hsl(var(--theme-primary))' }}>
          <p className="text-2xl leading-relaxed mb-4 italic" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>&ldquo;A garden requires patient labor and attention. Plants thrive because someone expended effort on them.&rdquo;</p>
          <cite className="text-sm not-italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>- Liberty Hyde Bailey</cite>
        </blockquote>
      </div></section>

      <section className="py-24 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/design" className="px-8 py-3 rounded-lg text-sm transition-all hover:opacity-80" style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}>Theme Gallery</Link>
            <Link href="/design/nature" className="px-8 py-3 rounded-lg text-sm border transition-all hover:opacity-80" style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-foreground))' }}>Nature</Link>
          </div>
        </div>
      </section>

      {/* Theme Timepiece */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-medium mb-4 text-center" style={{ color: 'hsl(var(--theme-foreground))' }}>Theme Timepiece</h2>
          <p className="text-center mb-8 text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>A watch face generated from this theme&apos;s botanical palette.</p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      <footer className="py-8 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 flex justify-between items-center">
          <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Sage Garden</p>
          <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>8gent</p>
        </div>
      </footer>
    </div>
  );
}
