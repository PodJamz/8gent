'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Heart, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

interface GentleReframe {
  reframe: string;
  truth: string;
  permission: string;
  softness: string;
}

function GentleReframeApp() {
  const [result, setResult] = useState<GentleReframe | null>(null);
  const [loading, setLoading] = useState(false);
  const [criticism, setCriticism] = useState('');

  const criticisms = ['I am not good enough', 'I should be further along', 'I made a mistake', 'I am too much', 'I am not trying hard enough'];

  const reframe = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'gentle-reframe', prompt: criticism || 'I am being hard on myself' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setResult({
          reframe: data.reframe || 'You are doing better than you think, even in the struggle.',
          truth: data.truth || 'Growth is not always visible. You are still growing.',
          permission: data.permission || 'To rest without guilt.',
          softness: data.softness || 'Like clouds slowly drifting.',
        });
      }
    } catch {
      setResult({
        reframe: 'What feels like failure is often just learning in disguise.',
        truth: 'You would not speak to a friend this way.',
        permission: 'To be imperfect and still worthy.',
        softness: 'Wrapped in a warm blanket.',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, criticism]);

  return (
    <div
      className="w-full rounded-2xl border overflow-hidden relative"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '500px',
      }}
    >
      {/* Floating shapes background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-32 h-32 rounded-full opacity-20"
          style={{ backgroundColor: 'hsl(var(--theme-primary))', top: '10%', right: '5%' }}
          animate={{ y: [0, 15, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-24 h-24 rounded-full opacity-15"
          style={{ backgroundColor: 'hsl(var(--theme-secondary))', bottom: '15%', left: '10%' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-16 h-16 rounded-full opacity-10"
          style={{ backgroundColor: 'hsl(var(--theme-accent))', top: '40%', left: '5%' }}
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b relative z-10"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-3">
          <Heart className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Gentle Reframe
          </span>
        </div>
        <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--theme-accent))' }} />
      </div>

      <div className="flex flex-col p-6 relative z-10" style={{ height: 'calc(100% - 57px)' }}>
        {/* Criticism Selection */}
        {!result && (
          <div className="mb-6">
            <p
              className="text-xs uppercase tracking-wider mb-3"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              What are you telling yourself?
            </p>
            <div className="flex flex-wrap gap-2">
              {criticisms.map((c) => (
                <button
                  key={c}
                  onClick={() => setCriticism(c)}
                  className="px-3 py-1.5 text-xs rounded-full transition-all"
                  style={{
                    backgroundColor: criticism === c ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-secondary))',
                    color: criticism === c ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-secondary-foreground))',
                  }}
                >
                  {c}
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Cloud className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                </motion.div>
                <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Finding gentleness...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-5 max-w-md"
              >
                {/* Reframe */}
                <div>
                  <h3
                    className="text-xl font-semibold leading-relaxed"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  >
                    {result.reframe}
                  </h3>
                </div>

                {/* Truth */}
                <div
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: 'hsla(var(--theme-primary) / 0.15)' }}
                >
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'hsl(var(--theme-primary))' }}>
                    A gentle truth
                  </p>
                  <p className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    {result.truth}
                  </p>
                </div>

                {/* Permission */}
                <div
                  className="pt-4 border-t"
                  style={{ borderColor: 'hsl(var(--theme-border))' }}
                >
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    You have permission
                  </p>
                  <p className="font-medium" style={{ color: 'hsl(var(--theme-primary))' }}>
                    {result.permission}
                  </p>
                </div>

                {/* Softness */}
                <p className="text-sm italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  {result.softness}
                </p>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                  <Cloud
                    className="w-16 h-16 mx-auto mb-6"
                    style={{ color: 'hsl(var(--theme-primary))', opacity: 0.4 }}
                  />
                </motion.div>
                <p className="text-sm font-medium mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  What harsh words are you carrying?
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.7 }}>
                  AI transforms self-criticism into self-compassion
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        {result ? (
          <button
            onClick={() => setResult(null)}
            className="w-full py-3 text-sm font-medium rounded-full transition-all flex items-center justify-center gap-2 border"
            style={{
              borderColor: 'hsl(var(--theme-border))',
              color: 'hsl(var(--theme-foreground))',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Try Another
          </button>
        ) : (
          <button
            onClick={reframe}
            disabled={loading}
            className="w-full py-3 text-sm font-medium rounded-full transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary-foreground))',
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Heart className="w-4 h-4" />
                Be Gentle With Me
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function PastelDreamsPage() {
  return (
    <ProductPageLayout
      theme="pastel-dreams"
      targetUser="those who are hard on themselves"
      problemStatement="We speak to ourselves in ways we would never speak to a friend."
      problemContext="Inner critics are loud and relentless. They point out every flaw, every misstep, every way we fall short. Over time, this harsh inner dialogue becomes background noise we barely notice. But we feel it: the weight, the exhaustion, the sense that we are never quite enough."
      insight="Self-compassion is not weakness. It is the foundation of resilience. A gentle voice does not lower standards. It gives us the safety to grow."
      tradeoffs={['Softness over harshness', 'Permission over perfection', 'Kindness over criticism']}
      appName="Gentle Reframe"
      appDescription="AI transforms harsh self-talk into compassionate perspective"
      principles={[
        {
          title: 'Soft as Permission',
          description: 'Pastel colors signal safety. They give visual permission to be gentle, to slow down, to exhale.',
        },
        {
          title: 'Rounded Edges',
          description: 'No sharp corners. Every element feels approachable, non-threatening, like being wrapped in softness.',
        },
        {
          title: 'Floating Lightness',
          description: 'Subtle animations create a dreamy, weightless quality. Problems feel less heavy here.',
        },
        {
          title: 'Warmth Without Demand',
          description: 'The aesthetic asks nothing of you. It simply offers a moment of kindness.',
        },
      ]}
      quote={{
        text: 'Softness is not weakness. It is the greatest form of strength.',
        author: 'Unknown',
      }}
    >
      <GentleReframeApp />

      <div className="mt-16">
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Dream Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Soft pastels and gentle hues. Click to copy.
        </p>
        <ColorPalette colors={themeColors['pastel-dreams']} />
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Soft Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
