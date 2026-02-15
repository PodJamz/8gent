'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Leaf, TreeDeciduous, Wind, Sun, Loader2, RefreshCw } from 'lucide-react';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import '@/lib/themes/themes.css';

// AI-Powered Kodama Spirit Wisdom
interface SpiritWisdom {
  message: string;
  emoji: string;
  wisdom: string;
}

function KodamaSpiritOracle() {
  const [wisdom, setWisdom] = useState<SpiritWisdom | null>(null);
  const [loading, setLoading] = useState(false);
  const [breathePhase, setBreathePhase] = useState(0);

  const getWisdom = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setWisdom(null);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'plant-spirit',
          prompt: 'Share gentle wisdom from the forest.',
        }),
      });

      if (!response.ok) throw new Error('Failed');

      const data = await response.json();
      if (!data.error) {
        setWisdom({
          message: data.message || 'The forest holds its secrets gently.',
          emoji: data.emoji || '🌿',
          wisdom: data.wisdom || 'peace',
        });
      }
    } catch (err) {
      setWisdom({
        message: 'The spirits rest. Try again.',
        emoji: '🍃',
        wisdom: 'patience',
      });
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return (
    <div
      className="w-full rounded-2xl border overflow-hidden relative"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '420px',
      }}
    >
      {/* Floating leaves animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 15}%`,
              top: '-10%',
            }}
            animate={{
              y: ['0%', '120%'],
              x: [0, Math.sin(i) * 20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'linear',
            }}
          >
            <Leaf
              className="w-4 h-4"
              style={{ color: 'hsl(var(--theme-primary))', opacity: 0.3 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b relative z-10"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-2">
          <TreeDeciduous className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Kodama Oracle
          </span>
        </div>
        <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Forest Wisdom
        </span>
      </div>

      {/* Content */}
      <div
        className="relative flex flex-col items-center justify-center p-6"
        style={{ height: 'calc(100% - 60px)' }}
      >
        <AnimatePresence mode="wait">
          {!wisdom && !loading ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              {/* Tree spirit visualization */}
              <motion.div
                className="relative w-24 h-24 mx-auto mb-6 cursor-pointer"
                onClick={getWisdom}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.1, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full"
                  style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.15, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
                <div
                  className="absolute inset-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'hsl(var(--theme-card))' }}
                >
                  <span className="text-3xl">🌳</span>
                </div>
              </motion.div>
              <p className="text-sm mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>
                Tap to receive forest wisdom
              </p>
              <p className="text-xs italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                The Kodama spirits await...
              </p>
            </motion.div>
          ) : loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'hsla(var(--theme-primary) / 0.2)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Leaf className="w-8 h-8" style={{ color: 'hsl(var(--theme-primary))' }} />
              </motion.div>
              <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                Listening to the forest...
              </p>
            </motion.div>
          ) : wisdom ? (
            <motion.div
              key="wisdom"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-sm"
            >
              <motion.span
                className="text-5xl block mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                {wisdom.emoji}
              </motion.span>
              <p
                className="text-lg font-medium leading-relaxed mb-4"
                style={{ color: 'hsl(var(--theme-foreground))' }}
              >
                &ldquo;{wisdom.message}&rdquo;
              </p>
              <div
                className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-6"
                style={{
                  backgroundColor: 'hsla(var(--theme-primary) / 0.2)',
                  color: 'hsl(var(--theme-primary))',
                }}
              >
                {wisdom.wisdom}
              </div>
              <br />
              <motion.button
                onClick={getWisdom}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all hover:opacity-80"
                style={{
                  backgroundColor: 'hsl(var(--theme-secondary))',
                  color: 'hsl(var(--theme-secondary-foreground))',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-3 h-3" />
                Ask Again
              </motion.button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function KodamaGrovePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const watchDNA = useMemo(() => themeToWatch('kodama-grove'), []);

  return (
    <div
      ref={containerRef}
      data-design-theme="kodama-grove"
      className="min-h-screen relative"
      style={{
        backgroundColor: 'hsl(var(--theme-background))',
        fontFamily: 'var(--theme-font)',
      }}
    >
      {/* Floating leaves decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Leaf
              className="w-4 h-4 opacity-20"
              style={{ color: 'hsl(var(--theme-primary))' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Progress indicator */}
      <motion.div
        className="fixed top-14 left-0 right-0 h-[3px] z-40 origin-left"
        style={{
          scaleX: scrollYProgress,
          backgroundColor: 'hsl(var(--theme-primary))',
        }}
      />

      <DesignHeader
        currentTheme="kodama-grove"
        backHref="/design"
        backText="Gallery"
        rightContent={
          <div className="flex items-center gap-2">
            <TreeDeciduous className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
            <span
              className="text-xs tracking-wide uppercase font-medium"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Nature Design
            </span>
          </div>
        }
      />

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center pt-16">
        <div className="max-w-5xl mx-auto px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="w-6 h-6" style={{ color: 'hsl(var(--theme-primary))' }} />
              <p
                className="text-sm uppercase tracking-widest font-medium"
                style={{ color: 'hsl(var(--theme-primary))' }}
              >
                Spirit of the Forest
              </p>
            </div>
            <h1
              className="text-5xl md:text-7xl font-bold leading-tight mb-8"
              style={{
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
            >
              Kodama Grove
            </h1>
            <p
              className="text-xl leading-relaxed max-w-2xl mb-12"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Where technology meets nature. Inspired by the mystical forest spirits
              of Japanese folklore, this theme brings organic warmth and natural
              harmony to digital interfaces. Grow with purpose.
            </p>
            <div
              className="border-t pt-8"
              style={{ borderColor: 'hsl(var(--theme-border))' }}
            >
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <p
                    className="text-3xl font-bold mb-1"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  >
                    142°
                  </p>
                  <p
                    className="text-xs uppercase tracking-wide"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    Forest Hue
                  </p>
                </div>
                <div>
                  <p
                    className="text-3xl font-bold mb-1"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  >
                    Nunito
                  </p>
                  <p
                    className="text-xs uppercase tracking-wide"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    Typeface
                  </p>
                </div>
                <div>
                  <p
                    className="text-3xl font-bold mb-1"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  >
                    100%
                  </p>
                  <p
                    className="text-xs uppercase tracking-wide"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    Organic
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kodama Oracle Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-lg mx-auto px-8">
          <h2
            className="text-2xl font-bold mb-4"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            Forest Spirit Oracle
          </h2>
          <p
            className="text-sm mb-8"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            The Kodama spirits share their wisdom. Tap to receive a message from the forest, uniquely generated by AI.
          </p>
          <KodamaSpiritOracle />
        </div>
      </section>

      {/* Elements Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-8">
          <h2
            className="text-3xl font-bold mb-8"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            Natural Elements
          </h2>
          <p
            className="text-lg leading-relaxed mb-12"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            The Kodama Grove theme draws from the natural world: moss-covered
            stones, dappled sunlight, and the quiet wisdom of ancient trees.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Leaf,
                title: 'Forest Greens',
                description: 'Deep emerald and fresh sage create a palette that feels alive, bringing the vitality of growing things to every interface.',
              },
              {
                icon: Sun,
                title: 'Dappled Light',
                description: 'Subtle gradients and soft shadows mimic sunlight filtering through leaves, creating depth without harsh contrasts.',
              },
              {
                icon: Wind,
                title: 'Gentle Motion',
                description: 'Animations that flow like wind through branches. Never jarring, always natural, guiding attention with organic ease.',
              },
              {
                icon: TreeDeciduous,
                title: 'Rooted Structure',
                description: 'Strong foundational grids like tree roots, providing stability while allowing organic growth in the canopy above.',
              },
            ].map((element, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-xl border"
                style={{
                  borderColor: 'hsl(var(--theme-border))',
                  backgroundColor: 'hsl(var(--theme-card))',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <element.icon
                  className="w-8 h-8 mb-4"
                  style={{ color: 'hsl(var(--theme-primary))' }}
                />
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  {element.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {element.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-8">
          <blockquote
            className="border-l-4 pl-8 py-4 rounded-r-lg"
            style={{
              borderColor: 'hsl(var(--theme-primary))',
              backgroundColor: 'hsla(var(--theme-primary) / 0.1)',
            }}
          >
            <p
              className="text-2xl md:text-3xl font-medium leading-relaxed mb-6"
              style={{
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
            >
              &ldquo;In every walk with nature, one receives far more than he seeks.&rdquo;
            </p>
            <cite
              className="text-sm not-italic font-medium"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              - John Muir
            </cite>
          </blockquote>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-24 border-t"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="max-w-5xl mx-auto px-8 text-center">
          <h2
            className="text-3xl font-bold mb-8"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            Continue Your Journey
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/design"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: 'hsl(var(--theme-primary))',
                color: 'hsl(var(--theme-primary-foreground))',
              }}
            >
              <Leaf className="w-4 h-4" />
              View Theme Gallery
            </Link>
            <Link
              href="/design/nature"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-sm font-medium border transition-all hover:scale-105"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                color: 'hsl(var(--theme-foreground))',
              }}
            >
              Explore Nature Theme
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
            A watch face generated from this theme&apos;s forest palette.
          </p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 border-t"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="max-w-5xl mx-auto px-8 flex justify-between items-center">
          <p
            className="text-xs"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            Kodama Grove Design System
          </p>
          <p
            className="text-xs"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            OpenClaw-OS
          </p>
        </div>
      </footer>
    </div>
  );
}
