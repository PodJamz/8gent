'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Flower2, Loader2, RefreshCw, Clock, Sparkles } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

interface NightBloomer {
  wisdom: string;
  flower: string;
  hour: string;
  permission: string;
}

function NightBloomerApp() {
  const [result, setResult] = useState<NightBloomer | null>(null);
  const [loading, setLoading] = useState(false);
  const [feeling, setFeeling] = useState('');

  const feelings = ['guilt about my schedule', 'most creative at night', 'alone in the darkness', 'fighting my nature', 'when the world sleeps'];

  const bloom = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'night-bloomer', prompt: feeling || 'I am a night owl' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setResult({
          wisdom: data.wisdom || 'The night does not judge productivity. It only asks presence.',
          flower: data.flower || 'Moonflower',
          hour: data.hour || '2:47 AM',
          permission: data.permission || 'Your rhythm is valid. The night welcomes you.',
        });
      }
    } catch {
      setResult({
        wisdom: 'Some flowers only open when the sun is gone. You are one of them.',
        flower: 'Night Jasmine',
        hour: '3:22 AM',
        permission: 'The darkness is not your enemy. It is your garden.',
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
      {/* Stars background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(25)].map((_, i) => (
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
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b relative z-10"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-3">
          <Flower2 className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span
            className="text-sm"
            style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
          >
            Night Bloomer
          </span>
        </div>
        {result && (
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
            <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              {result.hour}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col p-6 relative z-10" style={{ height: 'calc(100% - 57px)' }}>
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
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ rotate: { duration: 8, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity } }}
                >
                  <Moon className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                </motion.div>
                <p
                  className="text-sm"
                  style={{ color: 'hsl(var(--theme-muted-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                >
                  Waiting for moonrise...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md space-y-5"
              >
                {/* Flower badge */}
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-3 h-3" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <span
                    className="text-xs tracking-wider"
                    style={{ color: 'hsl(var(--theme-primary))' }}
                  >
                    {result.flower}
                  </span>
                  <Sparkles className="w-3 h-3" style={{ color: 'hsl(var(--theme-primary))' }} />
                </div>

                {/* Wisdom */}
                <h3
                  className="text-xl leading-relaxed italic"
                  style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                >
                  {result.wisdom}
                </h3>

                {/* Permission */}
                <div
                  className="pt-5 border-t"
                  style={{ borderColor: 'hsl(var(--theme-border))' }}
                >
                  <Flower2 className="w-5 h-5 mx-auto mb-3" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    {result.permission}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <Moon
                  className="w-16 h-16 mx-auto mb-6"
                  style={{ color: 'hsl(var(--theme-primary))', opacity: 0.4 }}
                />
                <p
                  className="text-sm mb-2"
                  style={{ color: 'hsl(var(--theme-muted-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                >
                  Tell me about your nights
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.6 }}>
                  AI celebrates nocturnal creativity
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
            Another Bloom
          </button>
        ) : (
          <button
            onClick={bloom}
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
                <Flower2 className="w-4 h-4" />
                Bloom Tonight
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function MidnightBloomPage() {
  return (
    <ProductPageLayout
      theme="midnight-bloom"
      targetUser="night owls who feel guilty"
      problemStatement="We shame ourselves for not fitting the 9-to-5 world."
      problemContext="Society celebrates early risers. Morning routines dominate productivity advice. Night owls internalize this as personal failure. We fight our biology, setting alarms that feel like violence against our nature. We apologize for being alive when the world is asleep."
      insight="Some flowers only bloom at night. The moonflower, the night jasmine, the evening primrose. They are not broken. They are adapted to a different kind of light."
      tradeoffs={['Nighttime over morning', 'Rhythm over schedule', 'Nature over normal']}
      appName="Night Bloomer"
      appDescription="AI celebrates nocturnal creativity and validates your rhythm"
      principles={[
        {
          title: 'Moonlit Palette',
          description: 'Deep backgrounds that feel like velvet night. Pale highlights that catch like moonlight on petals.',
        },
        {
          title: 'Floral Accents',
          description: 'Rich burgundy and deep purple bloom against darkness. Color as metaphor for thriving in shadow.',
        },
        {
          title: 'Subtle Shimmer',
          description: 'Highlights that catch light like dew drops. The night is not absence of beauty. It is a different kind.',
        },
        {
          title: 'Nocturnal Rhythm',
          description: 'Slow animations. Gentle transitions. Design that moves at the pace of night.',
        },
      ]}
      quote={{
        text: 'In the garden of the night, the most beautiful flowers bloom.',
        author: 'Midnight Bloom Philosophy',
      }}
    >
      <NightBloomerApp />

      <div className="mt-16">
        <h3
          className="text-xl mb-4"
          style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
        >
          Night Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Deep purples and moonlit highlights. Click to copy.
        </p>
        <ColorPalette colors={themeColors['midnight-bloom']} />
      </div>

      <div className="mt-16">
        <h3
          className="text-xl mb-4"
          style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
        >
          Nocturnal Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
