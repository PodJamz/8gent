'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Diamond, Crown, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

interface SignatureMoment {
  affirmation: string;
  truth: string;
  signature: string;
  closing: string;
}

function SignatureMomentApp() {
  const [result, setResult] = useState<SignatureMoment | null>(null);
  const [loading, setLoading] = useState(false);
  const [doubt, setDoubt] = useState('');

  const doubts = ['I do not belong here', 'They will find out I am faking', 'I am not qualified', 'I got lucky', 'Others are better'];

  const affirm = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'signature-moment', prompt: doubt || 'I feel like an imposter' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setResult({
          affirmation: data.affirmation || 'Your presence here is not an accident. It is an arrival.',
          truth: data.truth || 'Excellence recognizes its own. You were chosen.',
          signature: data.signature || 'Distinction',
          closing: data.closing || 'You belong among the exceptional.',
        });
      }
    } catch {
      setResult({
        affirmation: 'Your seat at this table was earned, not given.',
        truth: 'The doubt you feel is proof of your discernment.',
        signature: 'Authenticity',
        closing: 'Refinement cannot be faked. You have it.',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, doubt]);

  return (
    <div
      className="w-full border overflow-hidden relative"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '500px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-5 border-b relative z-10"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-3">
          <Diamond className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span
            className="text-sm tracking-widest uppercase"
            style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
          >
            Signature Moment
          </span>
        </div>
        {result && (
          <span
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: 'hsl(var(--theme-primary))' }}
          >
            {result.signature}
          </span>
        )}
      </div>

      <div className="flex flex-col p-8 relative z-10" style={{ height: 'calc(100% - 65px)' }}>
        {/* Doubt Selection */}
        {!result && (
          <div className="mb-8">
            <p
              className="text-xs tracking-[0.2em] uppercase mb-4"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              What whispers doubt?
            </p>
            <div className="flex flex-wrap gap-3">
              {doubts.map((d) => (
                <button
                  key={d}
                  onClick={() => setDoubt(d)}
                  className="px-4 py-2 text-xs tracking-wider transition-all border"
                  style={{
                    backgroundColor: doubt === d ? 'hsl(var(--theme-primary))' : 'transparent',
                    color: doubt === d ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
                    borderColor: doubt === d ? 'transparent' : 'hsl(var(--theme-border))',
                  }}
                >
                  {d}
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
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-10 h-10 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                </motion.div>
                <p
                  className="text-sm tracking-widest uppercase"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  Composing...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md space-y-6"
              >
                {/* Affirmation */}
                <div>
                  <h3
                    className="text-xl leading-relaxed italic"
                    style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                  >
                    {result.affirmation}
                  </h3>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1" style={{ backgroundColor: 'hsl(var(--theme-border))' }} />
                  <Crown className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <div className="h-px flex-1" style={{ backgroundColor: 'hsl(var(--theme-border))' }} />
                </div>

                {/* Truth */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {result.truth}
                </p>

                {/* Closing */}
                <p
                  className="text-sm tracking-[0.15em] uppercase pt-4 border-t"
                  style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-primary))' }}
                >
                  {result.closing}
                </p>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <Crown
                  className="w-16 h-16 mx-auto mb-6"
                  style={{ color: 'hsl(var(--theme-primary))', opacity: 0.3 }}
                />
                <p
                  className="text-sm mb-2"
                  style={{ color: 'hsl(var(--theme-muted-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                >
                  What makes you doubt your place?
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.6 }}>
                  AI affirms your worth in refined language
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        {result ? (
          <button
            onClick={() => setResult(null)}
            className="w-full py-4 text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 border"
            style={{
              borderColor: 'hsl(var(--theme-border))',
              color: 'hsl(var(--theme-foreground))',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Another Affirmation
          </button>
        ) : (
          <button
            onClick={affirm}
            disabled={loading}
            className="w-full py-4 text-xs tracking-[0.2em] uppercase transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary-foreground))',
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Diamond className="w-4 h-4" />
                Affirm My Worth
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ElegantLuxuryPage() {
  return (
    <ProductPageLayout
      theme="elegant-luxury"
      targetUser="those who feel like imposters"
      problemStatement="We question our belonging in spaces we have earned."
      problemContext="Imposter syndrome strikes hardest among the capable. The more we achieve, the more we fear exposure. We dismiss our accomplishments as luck while scrutinizing every flaw. The internal critic speaks with authority while our achievements whisper."
      insight="Refinement is not performance. It is the sum of invisible perfections. If you doubt your worth, you are paying attention. That discernment is itself a mark of quality."
      tradeoffs={['Elegance over explanation', 'Presence over proof', 'Worth over worthiness']}
      appName="Signature Moment"
      appDescription="AI affirms your worth in the language of luxury"
      principles={[
        {
          title: 'Elegant Restraint',
          description: 'True luxury lies in what is left unsaid. Negative space becomes a statement of confidence.',
        },
        {
          title: 'Classical Typography',
          description: 'Serif fonts carry centuries of refinement. Each letterform lends authority to affirmation.',
        },
        {
          title: 'Muted Sophistication',
          description: 'Colors whisper rather than shout. Warm neutrals and aged golds create understated opulence.',
        },
        {
          title: 'Exquisite Detail',
          description: 'Every border, every transition is considered. Luxury is the sum of invisible perfections.',
        },
      ]}
      quote={{
        text: 'Luxury is in each detail.',
        author: 'Hubert de Givenchy',
      }}
    >
      <SignatureMomentApp />

      <div className="mt-16">
        <h3
          className="text-xl mb-4"
          style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
        >
          <span className="italic">Golden</span> Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Warm neutrals and aged gold. Click to copy.
        </p>
        <ColorPalette colors={themeColors['elegant-luxury']} />
      </div>

      <div className="mt-16">
        <h3
          className="text-xl mb-4"
          style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
        >
          <span className="italic">Refined</span> Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
