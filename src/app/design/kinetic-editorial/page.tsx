'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Loader2, RefreshCw, ArrowRight, Minus } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

interface Manifesto {
  headline: string;
  subline: string;
  statement: string;
  callout: string;
}

function ManifestoApp() {
  const [manifesto, setManifesto] = useState<Manifesto | null>(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');

  const topics = ['craft', 'motion', 'design', 'code', 'future'];

  const generate = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'manifesto', prompt: topic || 'digital craft' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setManifesto({
          headline: data.headline || 'WE BUILD WHAT MATTERS.',
          subline: data.subline || 'Design is not decoration.',
          statement: data.statement || 'Every pixel serves a purpose. Every animation tells a story. Every interaction creates meaning.',
          callout: data.callout || 'SCROLL.',
        });
      }
    } catch {
      setManifesto({
        headline: 'WE BUILD WHAT MATTERS.',
        subline: 'Design is not decoration.',
        statement: 'Every pixel serves a purpose. Every animation tells a story. Every interaction creates meaning.',
        callout: 'SCROLL.',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, topic]);

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        backgroundColor: 'hsl(var(--theme-background))',
        border: '1px solid hsl(var(--theme-foreground) / 0.1)',
        height: '520px',
      }}
    >
      {/* Minimal header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid hsl(var(--theme-foreground) / 0.1)' }}
      >
        <div className="flex items-center gap-3">
          <Minus className="w-6 h-[2px]" style={{ color: 'hsl(var(--theme-foreground))' }} />
          <span
            className="text-[10px] font-medium uppercase tracking-[0.2em]"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            Manifesto
          </span>
        </div>
        {manifesto && (
          <span
            className="text-[10px] uppercase tracking-[0.15em]"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            Vol. 01
          </span>
        )}
      </div>

      <div className="flex flex-col p-8" style={{ height: 'calc(100% - 57px)' }}>
        {/* Topic Selection */}
        {!manifesto && (
          <div className="mb-8">
            <p
              className="text-[10px] uppercase tracking-[0.25em] mb-4"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Subject
            </p>
            <div className="flex flex-wrap gap-3">
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className="px-4 py-2 text-xs uppercase tracking-[0.15em] transition-all"
                  style={{
                    backgroundColor: topic === t ? 'hsl(var(--theme-foreground))' : 'transparent',
                    color: topic === t ? 'hsl(var(--theme-background))' : 'hsl(var(--theme-foreground))',
                    border: `1px solid hsl(var(--theme-foreground) / ${topic === t ? 1 : 0.2})`,
                  }}
                >
                  {t}
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
                  animate={{ width: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-[2px] mx-auto mb-8"
                  style={{ backgroundColor: 'hsl(var(--theme-foreground))', maxWidth: '120px' }}
                />
                <p
                  className="text-[10px] uppercase tracking-[0.25em]"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  Composing
                </p>
              </motion.div>
            ) : manifesto ? (
              <motion.div
                key="manifesto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-md text-center space-y-6"
              >
                {/* Headline */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl sm:text-3xl font-bold uppercase tracking-tight leading-none"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  {manifesto.headline}
                </motion.h2>

                {/* Subline */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm uppercase tracking-[0.15em]"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {manifesto.subline}
                </motion.p>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="w-12 h-[1px] mx-auto"
                  style={{ backgroundColor: 'hsl(var(--theme-foreground))' }}
                />

                {/* Statement */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm leading-relaxed"
                  style={{ color: 'hsl(var(--theme-foreground) / 0.8)' }}
                >
                  {manifesto.statement}
                </motion.p>

                {/* Callout */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4"
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.3em] inline-flex items-center gap-2"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  >
                    {manifesto.callout}
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-3 h-3" />
                    </motion.span>
                  </span>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <Type
                  className="w-8 h-8 mx-auto mb-6"
                  style={{ color: 'hsl(var(--theme-foreground))', opacity: 0.2 }}
                  strokeWidth={1}
                />
                <p
                  className="text-sm mb-2"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  Generate a manifesto
                </p>
                <p
                  className="text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  Bold typography. Clear intent.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        {manifesto ? (
          <button
            onClick={() => setManifesto(null)}
            className="w-full py-4 text-[10px] font-medium uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
            style={{
              border: '1px solid hsl(var(--theme-foreground) / 0.2)',
              color: 'hsl(var(--theme-foreground))',
            }}
          >
            <RefreshCw className="w-3 h-3" />
            New Manifesto
          </button>
        ) : (
          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-4 text-[10px] font-medium uppercase tracking-[0.2em] transition-all"
            style={{
              backgroundColor: 'hsl(var(--theme-foreground))',
              color: 'hsl(var(--theme-background))',
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mx-auto animate-spin" />
            ) : (
              'Generate'
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function KineticEditorialPage() {
  return (
    <ProductPageLayout
      theme="kinetic-editorial"
      targetUser="designers and studios who want their websites to feel like art direction pieces"
      problemStatement="Most web design plays it safe. Generic layouts, predictable animations, forgettable experiences. The web is full of sameness."
      problemContext="Kinetic Editorial draws from smooth-scroll studios and editorial typography. Motion is meaning. Every scroll, every transition, every word placement is intentional."
      insight="Typography isn't decoration, it's architecture. Animation isn't flourish, it's narrative. High contrast isn't style, it's clarity."
      tradeoffs={['Motion-forward over static', 'Bold typography over subtle text', 'Monochrome over multicolor']}
      appName="Manifesto Generator"
      appDescription="Generate bold, editorial-style manifestos with kinetic typography"
      showToolbar={true}
      themeLabel="Kinetic Editorial"
      onReferenceToAI={(prompt) => { if (typeof window !== 'undefined') { sessionStorage.setItem('openclaw_theme_reference', prompt); sessionStorage.setItem('openclaw_theme_reference_timestamp', Date.now().toString()); } }}
      principles={[
        {
          title: 'Typography First',
          description: 'Bold headlines, tight tracking, words that demand attention. The type is the design.',
        },
        {
          title: 'Motion as Meaning',
          description: 'Every animation serves the narrative. Smooth, intentional, kinetic. Never gratuitous.',
        },
        {
          title: 'High Contrast',
          description: 'Black and white. No compromise. Maximum impact through simplicity.',
        },
        {
          title: 'Editorial Pacing',
          description: 'Content reveals itself like pages of a magazine. Scroll becomes choreography.',
        },
      ]}
      quote={{
        text: "Good design is as little design as possible. Less, but better.",
        author: 'Dieter Rams',
      }}
    >
      <div className="space-y-24">
        {/* Interactive App */}
        <ManifestoApp />

        {/* Color Palette */}
        <section>
          <div className="mb-8">
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Palette
            </span>
            <h2
              className="text-2xl font-bold uppercase tracking-tight mt-2"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              Monochrome
            </h2>
          </div>
          <ColorPalette colors={themeColors['kinetic-editorial'] || themeColors.vercel} />
        </section>

        {/* Icon Showcase */}
        <section>
          <div className="mb-8">
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Iconography
            </span>
            <h2
              className="text-2xl font-bold uppercase tracking-tight mt-2"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              Minimal Marks
            </h2>
          </div>
          <IconShowcase />
        </section>

        {/* Credits */}
        <section className="text-center pt-12 border-t" style={{ borderColor: 'hsl(var(--theme-foreground) / 0.1)' }}>
          <p
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            Inspired by the smooth-scroll pioneers
          </p>
        </section>
      </div>
    </ProductPageLayout>
  );
}
