'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Focus, Loader2, RefreshCw, Clock, Check } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

interface OneThing {
  oneThing: string;
  why: string;
  drop: string;
  time: string;
}

function OneThingApp() {
  const [result, setResult] = useState<OneThing | null>(null);
  const [loading, setLoading] = useState(false);
  const [overwhelm, setOverwhelm] = useState('');

  const overwhelms = ['too many tasks', 'unclear priorities', 'everything feels urgent', 'scattered focus', 'decision fatigue'];

  const clarify = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'one-thing', prompt: overwhelm || 'I have too many things to do' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setResult({
          oneThing: data.oneThing || 'Write one sentence.',
          why: data.why || 'Clarity comes from starting, not planning.',
          drop: data.drop || 'Everything else.',
          time: data.time || '5 min',
        });
      }
    } catch {
      setResult({
        oneThing: 'Take the smallest possible step.',
        why: 'Motion creates clarity. Stillness creates doubt.',
        drop: 'The rest.',
        time: '2 min',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, overwhelm]);

  return (
    <div
      className="w-full border overflow-hidden"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '480px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-3">
          <Minus className="w-4 h-1" style={{ color: 'hsl(var(--theme-foreground))' }} />
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            One Thing
          </span>
        </div>
        {result && (
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
            <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              {result.time}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col p-8" style={{ height: 'calc(100% - 57px)' }}>
        {/* Overwhelm Selection */}
        {!result && (
          <div className="mb-8">
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              What is overwhelming you?
            </p>
            <div className="flex flex-wrap gap-2">
              {overwhelms.map((o) => (
                <button
                  key={o}
                  onClick={() => setOverwhelm(o)}
                  className="px-3 py-1.5 text-xs transition-all"
                  style={{
                    backgroundColor: overwhelm === o ? 'hsl(var(--theme-foreground))' : 'transparent',
                    color: overwhelm === o ? 'hsl(var(--theme-background))' : 'hsl(var(--theme-muted-foreground))',
                    border: `1px solid ${overwhelm === o ? 'transparent' : 'hsl(var(--theme-border))'}`,
                  }}
                >
                  {o}
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
                  animate={{ scale: [1, 0.95, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Minus className="w-12 h-1 mx-auto mb-4" style={{ color: 'hsl(var(--theme-foreground))' }} />
                </motion.div>
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Subtracting...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm space-y-6"
              >
                {/* The One Thing */}
                <div className="text-center pb-6 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
                  <Focus className="w-6 h-6 mx-auto mb-4" style={{ color: 'hsl(var(--theme-foreground))' }} />
                  <h3
                    className="text-xl font-medium leading-relaxed"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  >
                    {result.oneThing}
                  </h3>
                </div>

                {/* Why */}
                <p className="text-center text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  {result.why}
                </p>

                {/* Drop */}
                <div
                  className="flex items-center gap-3 p-4 border"
                  style={{ borderColor: 'hsl(var(--theme-border))' }}
                >
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      Let go of
                    </p>
                    <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                      {result.drop}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <Minus
                  className="w-16 h-1 mx-auto mb-8"
                  style={{ color: 'hsl(var(--theme-foreground))', opacity: 0.3 }}
                />
                <p className="text-sm mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  What is overwhelming you?
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.6 }}>
                  AI identifies the single most important action
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        {result ? (
          <button
            onClick={() => setResult(null)}
            className="w-full py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 border"
            style={{
              borderColor: 'hsl(var(--theme-border))',
              color: 'hsl(var(--theme-foreground))',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Ask Again
          </button>
        ) : (
          <button
            onClick={clarify}
            disabled={loading}
            className="w-full py-3 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'hsl(var(--theme-foreground))',
              color: 'hsl(var(--theme-background))',
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Focus className="w-4 h-4" />
                Find One Thing
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ModernMinimalPage() {
  return (
    <ProductPageLayout
      theme="modern-minimal"
      targetUser="people paralyzed by options"
      problemStatement="More choices, less clarity. We drown in possibilities."
      problemContext="Productivity advice adds tools. Apps add features. Inboxes add messages. We spend more time organizing than doing. The paradox of choice leaves us frozen, unable to pick from infinite options."
      insight="The answer is never more. It is always less. One thing done beats ten things planned. Subtraction is the only path to clarity."
      tradeoffs={['One over many', 'Action over planning', 'Clarity over completeness']}
      appName="One Thing"
      appDescription="AI cuts through overwhelm to find your single most important action"
      principles={[
        {
          title: 'Nothing Extra',
          description: 'If it does not serve a purpose, it does not exist. Every pixel is intentional.',
        },
        {
          title: 'Maximum Space',
          description: 'Whitespace is the primary design element. Content floats in purposeful void.',
        },
        {
          title: 'Single Focus',
          description: 'One thing at a time. Hierarchy is absolute and unambiguous.',
        },
        {
          title: 'Pure Neutrals',
          description: 'Black, white, and gray. No color to distract from what matters.',
        },
      ]}
      quote={{
        text: 'The ability to simplify means to eliminate the unnecessary so that the necessary may speak.',
        author: 'Hans Hofmann',
      }}
    >
      <OneThingApp />

      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Pure Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Pure neutrals. Nothing more. Click to copy.
        </p>
        <ColorPalette colors={themeColors['modern-minimal']} />
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Essential Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
