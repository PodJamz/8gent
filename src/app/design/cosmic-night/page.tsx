'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Orbit, Star, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

interface CosmicPerspective {
  perspective: string;
  scale: string;
  comfort: string;
  star: string;
}

function CosmicPerspectiveApp() {
  const [result, setResult] = useState<CosmicPerspective | null>(null);
  const [loading, setLoading] = useState(false);
  const [worry, setWorry] = useState('');

  const worries = ['deadline stress', 'fear of failure', 'comparing myself', 'uncertainty', 'feeling small'];

  const getCosmicView = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'cosmic-perspective', prompt: worry || 'I am worried about something' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setResult({
          perspective: data.perspective || 'In the time it took you to read this, light traveled 186,000 miles. Your worry traveled nowhere.',
          scale: data.scale || 'The universe is 13.8 billion years old. Your problem is a blink.',
          comfort: data.comfort || 'You are made of exploded stars.',
          star: data.star || 'Polaris',
        });
      }
    } catch {
      setResult({
        perspective: 'Every atom in your body was forged in a star. You are the universe experiencing itself.',
        scale: 'There are more stars than grains of sand on every beach on Earth.',
        comfort: 'You belong here. The cosmos made you.',
        star: 'Sirius',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, worry]);

  return (
    <div
      className="w-full rounded-lg border overflow-hidden relative"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '500px',
      }}
    >
      {/* Background stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              backgroundColor: 'hsl(var(--theme-foreground))',
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b relative z-10"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-3">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            <Orbit className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          </motion.div>
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            Cosmic Perspective
          </span>
        </div>
        {result && (
          <span className="text-xs tracking-wider" style={{ color: 'hsl(var(--theme-primary))' }}>
            ✦ {result.star}
          </span>
        )}
      </div>

      <div className="flex flex-col p-6 relative z-10" style={{ height: 'calc(100% - 57px)' }}>
        {/* Worry Selection */}
        {!result && (
          <div className="mb-6">
            <p
              className="text-xs tracking-widest uppercase mb-3"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              What weighs on you?
            </p>
            <div className="flex flex-wrap gap-2">
              {worries.map((w) => (
                <button
                  key={w}
                  onClick={() => setWorry(w)}
                  className="px-3 py-1.5 text-xs tracking-wider uppercase rounded-full transition-all"
                  style={{
                    backgroundColor: worry === w ? 'hsl(var(--theme-primary))' : 'transparent',
                    color: worry === w ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
                    border: `1px solid ${worry === w ? 'transparent' : 'hsl(var(--theme-border))'}`,
                    boxShadow: worry === w ? '0 0 15px hsla(var(--theme-primary) / 0.5)' : 'none',
                  }}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
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
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ rotate: { duration: 3, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.5, repeat: Infinity } }}
                >
                  <Sparkles className="w-10 h-10 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                </motion.div>
                <p className="text-xs tracking-widest uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Consulting the cosmos...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                {/* Main perspective */}
                <div>
                  <p
                    className="text-lg leading-relaxed mb-4"
                    style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                  >
                    {result.perspective}
                  </p>
                </div>

                {/* Scale fact */}
                <div
                  className="px-4 py-3 rounded-lg border"
                  style={{
                    borderColor: 'hsl(var(--theme-border))',
                    backgroundColor: 'hsla(var(--theme-primary) / 0.1)',
                  }}
                >
                  <p className="text-xs tracking-wider uppercase mb-1" style={{ color: 'hsl(var(--theme-primary))' }}>
                    Cosmic Scale
                  </p>
                  <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    {result.scale}
                  </p>
                </div>

                {/* Comfort */}
                <div className="pt-4 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
                  <Star className="w-4 h-4 mx-auto mb-2" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <p
                    className="text-sm italic"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  >
                    {result.comfort}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <motion.div
                    className="absolute inset-0 rounded-full border"
                    style={{ borderColor: 'hsl(var(--theme-primary))', opacity: 0.2 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-4 rounded-full border"
                    style={{ borderColor: 'hsl(var(--theme-primary))', opacity: 0.3 }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  />
                  <div
                    className="absolute inset-8 rounded-full"
                    style={{ backgroundColor: 'hsl(var(--theme-primary))', opacity: 0.5 }}
                  />
                </div>
                <p className="text-sm mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Select what weighs on you
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.6 }}>
                  AI places your problem in cosmic context
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        {result ? (
          <button
            onClick={() => setResult(null)}
            className="w-full py-3 text-xs tracking-widest uppercase font-medium transition-all flex items-center justify-center gap-2 border rounded-full"
            style={{
              borderColor: 'hsl(var(--theme-border))',
              color: 'hsl(var(--theme-foreground))',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            New Perspective
          </button>
        ) : (
          <button
            onClick={getCosmicView}
            disabled={loading}
            className="w-full py-3 text-xs tracking-widest uppercase font-medium transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2 rounded-full"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary-foreground))',
              boxShadow: '0 0 20px hsla(var(--theme-primary) / 0.5)',
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Orbit className="w-4 h-4" />
                Zoom Out
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function CosmicNightPage() {
  return (
    <ProductPageLayout
      theme="cosmic-night"
      targetUser="overthinkers and anxious minds"
      problemStatement="We lose perspective drowning in daily details. Small problems feel enormous."
      problemContext="When you are inside the problem, the problem is all you can see. Deadlines feel like life or death. Setbacks feel permanent. We forget that we are specks on a speck, spinning through infinity. And somehow, that is comforting."
      insight="Zooming out reveals what zooming in obscures. The cosmic view does not minimize your feelings. It expands the container that holds them."
      tradeoffs={['Perspective over solutions', 'Awe over analysis', 'Wonder over worry']}
      appName="Cosmic Perspective"
      appDescription="AI places your problems in universal context"
      principles={[
        {
          title: 'Overview Effect',
          description: 'Astronauts report profound shifts in consciousness when seeing Earth from space. We simulate this digitally.',
        },
        {
          title: 'Scale as Medicine',
          description: 'Cosmic facts reframe problems. When you know the universe is 93 billion light years wide, missed deadlines feel smaller.',
        },
        {
          title: 'Dark Mode as Design',
          description: 'Deep blacks and glowing accents create the void from which stars emerge. The aesthetic is the message.',
        },
        {
          title: 'Comfort in Insignificance',
          description: 'Paradoxically, feeling small can feel freeing. Less pressure. Less importance. More wonder.',
        },
      ]}
      quote={{
        text: 'We are all made of star-stuff.',
        author: 'Carl Sagan',
      }}
    >
      <CosmicPerspectiveApp />

      <div className="mt-16">
        <h3
          className="text-lg tracking-widest uppercase mb-4"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          Color Nebula
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Deep space colors and stellar accents. Click to copy.
        </p>
        <ColorPalette colors={themeColors['cosmic-night']} />
      </div>

      <div className="mt-16">
        <h3
          className="text-lg tracking-widest uppercase mb-4"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          Stellar Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
