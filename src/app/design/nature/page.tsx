'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Mountain, Loader2, RefreshCw, TreePine, Droplets } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

interface GroundCheck {
  grounding: string;
  wisdom: string;
  element: string;
  reminder: string;
}

function GroundCheckApp() {
  const [result, setResult] = useState<GroundCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [feeling, setFeeling] = useState('');

  const feelings = ['disconnected from nature', 'stuck indoors too long', 'overwhelmed by screens', 'need to slow down', 'lost in my head'];

  const ground = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'ground-check', prompt: feeling || 'I feel disconnected from nature' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setResult({
          grounding: data.grounding || 'Place your bare feet on the earth for one minute.',
          wisdom: data.wisdom || 'Trees do not rush. Yet everything gets done.',
          element: data.element || 'Oak',
          reminder: data.reminder || 'You are made of the same stuff as mountains.',
        });
      }
    } catch {
      setResult({
        grounding: 'Touch something natural. Feel its texture. Breathe.',
        wisdom: 'The forest does not judge the pace of growth.',
        element: 'River',
        reminder: 'Nature flows through you. You never left it.',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, feeling]);

  return (
    <div
      className="w-full rounded-lg border overflow-hidden relative"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '500px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-3">
          <Leaf className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span
            className="text-sm"
            style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
          >
            Ground Check
          </span>
        </div>
        {result && (
          <span className="text-xs" style={{ color: 'hsl(var(--theme-primary))' }}>
            {result.element}
          </span>
        )}
      </div>

      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 57px)' }}>
        {/* Feeling Selection */}
        {!result && (
          <div className="mb-6">
            <p
              className="text-xs uppercase tracking-wider mb-3"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              I feel...
            </p>
            <div className="flex flex-wrap gap-2">
              {feelings.map((f) => (
                <button
                  key={f}
                  onClick={() => setFeeling(f)}
                  className="px-3 py-1.5 text-xs transition-all rounded"
                  style={{
                    backgroundColor: feeling === f ? 'hsl(var(--theme-primary))' : 'transparent',
                    color: feeling === f ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
                    border: `1px solid ${feeling === f ? 'transparent' : 'hsl(var(--theme-border))'}`,
                  }}
                >
                  {f}
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
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <TreePine className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                </motion.div>
                <p
                  className="text-sm"
                  style={{ color: 'hsl(var(--theme-muted-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                >
                  Connecting to earth...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md space-y-5"
              >
                {/* Element badge */}
                <div className="flex items-center justify-center gap-2">
                  <Mountain className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <span className="text-xs uppercase tracking-wider" style={{ color: 'hsl(var(--theme-primary))' }}>
                    {result.element}
                  </span>
                </div>

                {/* Grounding exercise */}
                <div
                  className="p-4 rounded-lg border"
                  style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsla(var(--theme-primary) / 0.1)' }}
                >
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'hsl(var(--theme-primary))' }}>
                    Ground yourself
                  </p>
                  <p
                    className="text-base"
                    style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                  >
                    {result.grounding}
                  </p>
                </div>

                {/* Wisdom */}
                <p
                  className="text-lg italic leading-relaxed"
                  style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                >
                  {result.wisdom}
                </p>

                {/* Reminder */}
                <div className="pt-4 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
                  <Droplets className="w-4 h-4 mx-auto mb-2" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    {result.reminder}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <Mountain
                  className="w-16 h-16 mx-auto mb-6"
                  style={{ color: 'hsl(var(--theme-primary))', opacity: 0.4 }}
                />
                <p
                  className="text-sm mb-2"
                  style={{ color: 'hsl(var(--theme-muted-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                >
                  How are you feeling?
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.6 }}>
                  AI provides grounding exercises from nature
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        {result ? (
          <button
            onClick={() => setResult(null)}
            className="w-full py-3 text-sm transition-all flex items-center justify-center gap-2 border rounded"
            style={{
              borderColor: 'hsl(var(--theme-border))',
              color: 'hsl(var(--theme-foreground))',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Ground Again
          </button>
        ) : (
          <button
            onClick={ground}
            disabled={loading}
            className="w-full py-3 text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 rounded"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary-foreground))',
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Leaf className="w-4 h-4" />
                Ground Me
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function NaturePage() {
  return (
    <ProductPageLayout
      theme="nature"
      targetUser="those who have lost touch with the earth"
      problemStatement="We live in boxes, staring at screens. Nature becomes memory."
      problemContext="Urban life disconnects us from natural rhythms. We forget what soil smells like, how rain sounds on leaves, the feeling of bark under fingers. This disconnection is not just aesthetic. It affects our wellbeing at a fundamental level."
      insight="You do not need to escape to the wilderness. Nature is not a destination. It is a relationship. Even in concrete jungles, earth is always beneath your feet."
      tradeoffs={['Grounding over scrolling', 'Slowness over speed', 'Presence over productivity']}
      appName="Ground Check"
      appDescription="AI provides grounding exercises and nature-based wisdom"
      principles={[
        {
          title: 'Earth Tones',
          description: 'Browns, greens, and tans evoke the permanence of mountains and forests. Color as connection.',
        },
        {
          title: 'Organic Forms',
          description: 'Curves over corners. Shapes that echo the natural world. Nothing too sharp, nothing too rigid.',
        },
        {
          title: 'Natural Textures',
          description: 'Subtle grain and variation. Surfaces that feel alive, not manufactured.',
        },
        {
          title: 'Warm Light',
          description: 'Colors bathed in golden hour. Everything touched by the warmth of natural sunlight.',
        },
      ]}
      quote={{
        text: 'Look deep into nature, and then you will understand everything better.',
        author: 'Albert Einstein',
      }}
    >
      <GroundCheckApp />

      <div className="mt-16">
        <h3
          className="text-xl mb-4"
          style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
        >
          Earth Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Colors harvested from forests and fields. Click to copy.
        </p>
        <ColorPalette colors={themeColors.nature} />
      </div>

      <div className="mt-16">
        <h3
          className="text-xl mb-4"
          style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
        >
          Organic Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
