'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Sunset, Loader2, RefreshCw, Heart, Moon } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

interface GoldenPause {
  ritual: string;
  release: string;
  gratitude: string;
  horizon: string;
}

function GoldenPauseApp() {
  const [pause, setPause] = useState<GoldenPause | null>(null);
  const [loading, setLoading] = useState(false);
  const [feeling, setFeeling] = useState('');

  const feelings = ['exhausted from work', 'overwhelmed by tasks', 'mind racing', 'need to decompress', 'seeking closure'];

  const getPause = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'golden-pause', prompt: feeling || 'I need to wind down from the day' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setPause({
          ritual: data.ritual || 'Close your laptop. Take three breaths. Look out the window.',
          release: data.release || 'The emails can wait until morning.',
          gratitude: data.gratitude || 'Notice one small thing that went right today.',
          horizon: data.horizon || 'Every sunset is a permission slip to rest.',
        });
      }
    } catch {
      setPause({
        ritual: 'Stand by a window. Watch the light change. Breathe.',
        release: 'Let go of what you did not finish.',
        gratitude: 'Appreciate the warmth you created today.',
        horizon: 'The day ends. You remain.',
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
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, hsl(var(--theme-primary) / 0.2) 100%)',
        }}
      />

      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b relative z-10"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sunset className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          </motion.div>
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Golden Pause
          </span>
        </div>
        <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          End of Day
        </span>
      </div>

      <div className="flex flex-col p-6 relative z-10" style={{ height: 'calc(100% - 57px)' }}>
        {/* Feeling Selection */}
        {!pause && (
          <div className="mb-6">
            <p
              className="text-xs uppercase tracking-wider mb-3"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              How does this day feel?
            </p>
            <div className="flex flex-wrap gap-2">
              {feelings.map((f) => (
                <button
                  key={f}
                  onClick={() => setFeeling(f)}
                  className="px-3 py-1.5 text-xs rounded-full transition-all"
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
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sun className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                </motion.div>
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Finding your pause...
                </p>
              </motion.div>
            ) : pause ? (
              <motion.div
                key="pause"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-6"
              >
                {/* Ritual */}
                <div className="text-center pb-6 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
                  <Sun className="w-6 h-6 mx-auto mb-3" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <p
                    className="text-lg font-medium leading-relaxed"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  >
                    {pause.ritual}
                  </p>
                </div>

                {/* Release */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.1)' }}
                  >
                    <Moon className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      Release
                    </p>
                    <p className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                      {pause.release}
                    </p>
                  </div>
                </div>

                {/* Gratitude */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.1)' }}
                  >
                    <Heart className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      Gratitude
                    </p>
                    <p className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                      {pause.gratitude}
                    </p>
                  </div>
                </div>

                {/* Horizon */}
                <div className="text-center pt-4 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
                  <p
                    className="text-sm italic"
                    style={{ color: 'hsl(var(--theme-primary))' }}
                  >
                    "{pause.horizon}"
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: 'hsl(var(--theme-primary))', opacity: 0.2 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <Sunset
                    className="w-20 h-20 relative z-10"
                    style={{ color: 'hsl(var(--theme-primary))', opacity: 0.4 }}
                  />
                </div>
                <p className="text-sm mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  How does this day feel?
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.6 }}>
                  AI creates micro-rituals for closing the day
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        {pause ? (
          <button
            onClick={() => setPause(null)}
            className="w-full py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 border rounded-lg"
            style={{
              borderColor: 'hsl(var(--theme-border))',
              color: 'hsl(var(--theme-foreground))',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Another Pause
          </button>
        ) : (
          <button
            onClick={getPause}
            disabled={loading}
            className="w-full py-3 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 rounded-lg"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary-foreground))',
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sunset className="w-4 h-4" />
                Find My Pause
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function SolarDuskPage() {
  return (
    <ProductPageLayout
      theme="solar-dusk"
      targetUser="workers who cannot stop working"
      problemStatement="The workday never ends. We carry tasks into sleep. There is no ritual for stopping."
      problemContext="Our ancestors marked the end of day with sunset. The light changed, the work stopped. Now we work past dark, screens glowing in the night. The boundary between work and rest has dissolved. We close laptops but our minds keep running. There is no ceremony for saying 'enough.'"
      insight="Ritual creates boundary. A conscious pause between doing and being can train our nervous systems that it is safe to rest. The golden hour is not just light. It is permission."
      tradeoffs={['Rest over productivity', 'Closure over continuation', 'Intention over default']}
      appName="Golden Pause"
      appDescription="AI-generated micro-rituals for ending the day with intention"
      principles={[
        {
          title: 'Warm Transition',
          description: 'Amber tones and gradients evoke the visual comfort of sunset. The interface itself cues rest.',
        },
        {
          title: 'Three Acts',
          description: 'Ritual, release, gratitude. A simple structure that creates meaningful closure in under a minute.',
        },
        {
          title: 'Poetic Wisdom',
          description: 'The horizon line is contemplative. Short, thoughtful phrases that linger without demanding.',
        },
        {
          title: 'Gentle Invitation',
          description: 'Nothing is forced. The pause is offered, not imposed. Rest is suggested, not mandated.',
        },
      ]}
      quote={{
        text: 'There is a serenity in the dusk that the dawn can never know.',
        author: 'Solar Wisdom',
      }}
    >
      <GoldenPauseApp />

      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Dusk Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Warm ambers and twilight purples. Click to copy.
        </p>
        <ColorPalette colors={themeColors['solar-dusk']} />
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Twilight Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
