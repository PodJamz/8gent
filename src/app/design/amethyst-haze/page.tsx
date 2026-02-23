'use client';
import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Cloud, Moon, Star, Eye, Loader2 } from 'lucide-react';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import '@/lib/themes/themes.css';

// AI-Powered Tarot Card Reader
interface TarotReading {
  card: string;
  symbol: string;
  meaning: string;
  guidance: string;
}

function TarotCardReader() {
  const [isRevealing, setIsRevealing] = useState(false);
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const drawCard = useCallback(async () => {
    if (isRevealing) return;
    setIsRevealing(true);
    setCardFlipped(false);
    setReading(null);
    setError(null);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'tarot-reading',
          prompt: 'Draw a mystical card and share its wisdom with me.',
        }),
      });

      if (!response.ok) throw new Error('Failed to get reading');

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setReading({
        card: data.card || 'The Mystery',
        symbol: data.symbol || '🔮',
        meaning: data.meaning || 'Unknown Paths',
        guidance: data.guidance || 'The mist holds its secrets for now...',
      });

      setTimeout(() => {
        setCardFlipped(true);
        setIsRevealing(false);
      }, 500);
    } catch (err) {
      setError('The mist is unclear. Try again.');
      setIsRevealing(false);
    }
  }, [isRevealing]);

  const reset = () => {
    setReading(null);
    setCardFlipped(false);
    setError(null);
  };

  return (
    <div
      className="w-full rounded-2xl border overflow-hidden"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '420px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            AI Mystic Reading
          </span>
        </div>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <Star key={i} className="w-3 h-3" style={{ color: 'hsl(var(--theme-primary))', opacity: 0.5 + i * 0.2 }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        className="relative flex flex-col items-center justify-center p-6"
        style={{ height: 'calc(100% - 60px)' }}
      >
        {/* Floating mystical particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: 'hsl(var(--theme-primary))',
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="text-sm mb-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                {error}
              </p>
              <button
                onClick={reset}
                className="px-4 py-2 rounded-lg text-xs font-medium"
                style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}
              >
                Try Again
              </button>
            </motion.div>
          ) : !reading && !isRevealing ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                className="w-32 h-44 mx-auto mb-6 rounded-xl border-2 flex items-center justify-center cursor-pointer"
                style={{
                  borderColor: 'hsl(var(--theme-primary))',
                  background: 'linear-gradient(135deg, hsla(var(--theme-primary) / 0.2), hsla(var(--theme-secondary) / 0.3))',
                }}
                onClick={drawCard}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px hsla(var(--theme-primary) / 0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Moon className="w-12 h-12" style={{ color: 'hsl(var(--theme-primary))' }} />
              </motion.div>
              <p className="text-sm mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>
                Tap the card to reveal your AI reading
              </p>
              <p className="text-xs italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                Powered by mystical intelligence...
              </p>
            </motion.div>
          ) : isRevealing ? (
            <motion.div
              key="shuffling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                className="w-32 h-44 mx-auto mb-6 rounded-xl border-2 flex items-center justify-center"
                style={{
                  borderColor: 'hsl(var(--theme-primary))',
                  background: 'linear-gradient(135deg, hsla(var(--theme-primary) / 0.3), hsla(var(--theme-secondary) / 0.4))',
                }}
                animate={{
                  rotateY: [0, 180, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'hsl(var(--theme-primary))' }} />
              </motion.div>
              <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                Consulting the ethereal realm...
              </p>
            </motion.div>
          ) : reading ? (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{ opacity: 1, rotateY: cardFlipped ? 0 : 180 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                className="w-32 h-44 mx-auto mb-4 rounded-xl border-2 flex flex-col items-center justify-center p-3"
                style={{
                  borderColor: 'hsl(var(--theme-primary))',
                  background: 'linear-gradient(135deg, hsla(var(--theme-primary) / 0.2), hsla(var(--theme-card) / 0.9))',
                  boxShadow: '0 0 40px hsla(var(--theme-primary) / 0.4)',
                }}
              >
                <span className="text-4xl mb-2">{reading.symbol}</span>
                <span className="text-xs font-medium text-center" style={{ color: 'hsl(var(--theme-foreground))' }}>
                  {reading.card}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-xs mx-auto space-y-2"
              >
                <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-primary))' }}>
                  {reading.meaning}
                </p>
                <p className="text-xs italic leading-relaxed" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  &ldquo;{reading.guidance}&rdquo;
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={reset}
                className="mt-4 px-4 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                style={{
                  backgroundColor: 'hsl(var(--theme-secondary))',
                  color: 'hsl(var(--theme-secondary-foreground))',
                }}
              >
                Draw Another
              </motion.button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AmethystHazePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const watchDNA = useMemo(() => themeToWatch('amethyst-haze'), []);

  return (
    <div
      ref={containerRef}
      data-design-theme="amethyst-haze"
      className="min-h-screen relative"
      style={{ backgroundColor: 'hsl(var(--theme-background))', fontFamily: 'var(--theme-font)' }}
    >
      {/* Floating haze effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: 200 + Math.random() * 200,
              height: 200 + Math.random() * 200,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: 'hsl(var(--theme-primary))',
              opacity: 0.03,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <motion.div
        className="fixed top-14 left-0 right-0 h-[2px] z-40 origin-left"
        style={{ scaleX: scrollYProgress, backgroundColor: 'hsl(var(--theme-primary))' }}
      />

      <DesignHeader
        currentTheme="amethyst-haze"
        backHref="/design"
        backText="Gallery"
        rightContent={
          <span className="text-xs tracking-wide" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Mystical Design
          </span>
        }
      />

      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center pt-16 relative z-10">
        <div className="max-w-4xl mx-auto px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Sparkles className="w-10 h-10 mb-6" style={{ color: 'hsl(var(--theme-primary))' }} />
            <h1 className="text-5xl md:text-7xl font-medium leading-tight mb-8" style={{ color: 'hsl(var(--theme-foreground))' }}>
              Purple Mist
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl mb-12" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Dreamy amethyst atmosphere. Amethyst Haze creates a mystical veil of purple tones, soft, ethereal, and captivating. Lost in purple.
            </p>
            <div className="grid grid-cols-3 gap-8 border-t pt-8" style={{ borderColor: 'hsl(var(--theme-border))' }}>
              <div>
                <p className="text-3xl font-medium mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>💜</p>
                <p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Haze</p>
              </div>
              <div>
                <p className="text-3xl font-medium mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>Geist</p>
                <p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Typeface</p>
              </div>
              <div>
                <p className="text-3xl font-medium mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>∞</p>
                <p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Dreams</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Tarot Card Reader Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-lg mx-auto px-8">
          <h2 className="text-2xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
            AI Mystic Reading
          </h2>
          <p className="text-sm mb-8" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Draw a card from the ethereal AI realm. Each reading is uniquely generated, just for you.
          </p>
          <TarotCardReader />
        </div>
      </section>

      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-medium mb-12" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Mystical Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Sparkles, title: 'Ethereal Glow', desc: 'Soft purple gradients that seem to shimmer and flow.' },
              { icon: Cloud, title: 'Hazy Depths', desc: 'Layers of translucent color create mysterious depth.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-lg border backdrop-blur-sm"
                style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsla(var(--theme-card) / 0.8)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <item.icon className="w-6 h-6 mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-8">
          <blockquote className="border-l-2 pl-8" style={{ borderColor: 'hsl(var(--theme-primary))' }}>
            <p className="text-2xl font-medium leading-relaxed mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
              &ldquo;The color purple has long been associated with creativity and the imagination.&rdquo;
            </p>
            <cite className="text-sm not-italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>- Color Psychology</cite>
          </blockquote>
        </div>
      </section>

      <section className="py-24 border-t relative z-10" style={{ borderColor: 'hsl(var(--theme-border))' }}>
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
              href="/design/violet-bloom"
              className="px-8 py-3 rounded-lg text-sm font-medium border transition-all hover:opacity-80"
              style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-foreground))' }}
            >
              Violet Bloom
            </Link>
          </div>
        </div>
      </section>

      {/* Theme Timepiece */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-medium mb-4 text-center" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Theme Timepiece
          </h2>
          <p className="text-center mb-8 text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            A watch face generated from this theme&apos;s mystic purple palette.
          </p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      <footer className="py-8 border-t relative z-10" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 flex justify-between items-center">
          <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Amethyst Haze</p>
          <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>8gent</p>
        </div>
      </footer>
    </div>
  );
}
