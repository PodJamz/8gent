'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feather, BookOpen, Loader2, RefreshCw, PenTool } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';
import { TypewriterKeyboard } from '@/components/design/InterfaceMockups';

interface LegacyLetter {
  salutation: string;
  opening: string;
  prompt: string;
  closing: string;
}

function LegacyLetterApp() {
  const [letter, setLetter] = useState<LegacyLetter | null>(null);
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState('');

  const recipients = ['a friend far away', 'my future self', 'someone I miss', 'a mentor', 'my younger self'];

  const writeLetter = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'legacy-letter', prompt: `I want to write a letter to ${recipient || 'someone I care about'}` }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setLetter({
          salutation: data.salutation || 'My Dearest Friend,',
          opening: data.opening || 'I write to you in the quiet hours, when the world has stilled and my thoughts turn to what matters most.',
          prompt: data.prompt || 'What would I want you to know if this were the last letter I could write?',
          closing: data.closing || 'Ever Yours',
        });
      }
    } catch {
      setLetter({
        salutation: 'Dear One,',
        opening: 'Some words are meant to be written by hand, folded carefully, and kept for years.',
        prompt: 'What have I been meaning to tell you that I have never found the words for?',
        closing: 'With Warmth',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, recipient]);

  return (
    <div
      className="w-full border overflow-hidden relative"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '520px',
      }}
    >
      {/* Paper texture */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b relative z-10"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-3">
          <Feather className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span
            className="text-sm"
            style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font)' }}
          >
            Legacy Letter
          </span>
        </div>
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
        >
          Est. 1923
        </span>
      </div>

      <div className="flex flex-col p-6 relative z-10" style={{ height: 'calc(100% - 57px)' }}>
        {/* Recipient Selection */}
        {!letter && (
          <div className="mb-6">
            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Who is this letter for?
            </p>
            <div className="flex flex-wrap gap-2">
              {recipients.map((r) => (
                <button
                  key={r}
                  onClick={() => setRecipient(r)}
                  className="px-3 py-1.5 text-xs transition-all"
                  style={{
                    backgroundColor: recipient === r ? 'hsl(var(--theme-foreground))' : 'transparent',
                    color: recipient === r ? 'hsl(var(--theme-background))' : 'hsl(var(--theme-muted-foreground))',
                    border: `1px solid ${recipient === r ? 'transparent' : 'hsl(var(--theme-border))'}`,
                    fontFamily: 'var(--theme-font)',
                  }}
                >
                  {r}
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
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <PenTool className="w-10 h-10 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                </motion.div>
                <p className="text-sm italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Composing...
                </p>
              </motion.div>
            ) : letter ? (
              <motion.div
                key="letter"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-6"
              >
                {/* Salutation */}
                <div className="text-center">
                  <p
                    className="text-xl italic"
                    style={{
                      color: 'hsl(var(--theme-foreground))',
                      fontFamily: 'var(--theme-font-heading)',
                    }}
                  >
                    {letter.salutation}
                  </p>
                </div>

                {/* Opening */}
                <div
                  className="py-6 border-t border-b"
                  style={{ borderColor: 'hsl(var(--theme-border))' }}
                >
                  <p
                    className="text-base leading-relaxed text-center"
                    style={{
                      color: 'hsl(var(--theme-foreground))',
                      fontFamily: 'var(--theme-font)',
                    }}
                  >
                    {letter.opening}
                  </p>
                </div>

                {/* Prompt */}
                <div className="text-center">
                  <BookOpen className="w-5 h-5 mx-auto mb-3" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <p
                    className="text-sm italic"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    Continue with:
                  </p>
                  <p
                    className="text-sm mt-2"
                    style={{
                      color: 'hsl(var(--theme-primary))',
                      fontFamily: 'var(--theme-font)',
                    }}
                  >
                    "{letter.prompt}"
                  </p>
                </div>

                {/* Closing */}
                <div className="text-center pt-4">
                  <p
                    className="text-sm italic"
                    style={{
                      color: 'hsl(var(--theme-muted-foreground))',
                      fontFamily: 'var(--theme-font)',
                    }}
                  >
                    Sign off with: {letter.closing}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Feather
                      className="w-16 h-16"
                      style={{ color: 'hsl(var(--theme-primary))', opacity: 0.3 }}
                    />
                  </motion.div>
                </div>
                <p className="text-sm mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Who deserves a letter?
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.6 }}>
                  AI helps you start letters worth keeping
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        {letter ? (
          <button
            onClick={() => setLetter(null)}
            className="w-full py-3 text-sm transition-all flex items-center justify-center gap-2 border"
            style={{
              borderColor: 'hsl(var(--theme-border))',
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font)',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Write Another
          </button>
        ) : (
          <button
            onClick={writeLetter}
            disabled={loading}
            className="w-full py-3 text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary-foreground))',
              fontFamily: 'var(--theme-font)',
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Feather className="w-4 h-4" />
                Begin Letter
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function VintagePaperPage() {
  return (
    <ProductPageLayout
      theme="vintage-paper"
      targetUser="people who miss handwritten letters"
      problemStatement="Digital communication is instant but forgettable. We text but do not write. Nothing is kept."
      problemContext="Letters used to be tied with ribbon and saved for decades. Words were chosen carefully because ink could not be deleted. Now we type, send, forget. Our most meaningful exchanges disappear in chat histories no one will ever read again. The art of correspondence is dying."
      insight="The constraint of permanence creates value. When words cannot be unsent, they are chosen with care. Letters are not faster than texts. They are better. Some things deserve to be written slowly."
      tradeoffs={['Permanence over speed', 'Craft over convenience', 'Legacy over efficiency']}
      appName="Legacy Letter"
      appDescription="AI helps you begin letters worth keeping"
      principles={[
        {
          title: 'Paper Texture',
          description: 'Subtle noise and grain make digital feel tactile. The screen becomes a writing desk.',
        },
        {
          title: 'Typewriter Typography',
          description: 'Monospace fonts honor mechanical origins. Each character sits deliberate and equal.',
        },
        {
          title: 'Epistolary Structure',
          description: 'Salutation, body, closing. The classical form gives shape to feeling.',
        },
        {
          title: 'Timeless Warmth',
          description: 'Sepia tones and cream backgrounds evoke old libraries and afternoon light.',
        },
      ]}
      quote={{
        text: 'A room without books is like a body without a soul.',
        author: 'Marcus Tullius Cicero',
      }}
    >
      <LegacyLetterApp />

      {/* Typewriter Keyboard Section */}
      <div className="mt-16">
        <h3
          className="text-xl mb-4"
          style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
        >
          Typewriter Experience
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Type on the vintage keyboard. Listen for the satisfying click of each key.
        </p>
        <TypewriterKeyboard />
      </div>

      <div className="mt-16">
        <h3
          className="text-xl mb-4"
          style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
        >
          Sepia Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Warm sepia tones and aged paper hues. Click to copy.
        </p>
        <ColorPalette colors={themeColors['vintage-paper']} />
      </div>

      <div className="mt-16">
        <h3
          className="text-xl mb-4"
          style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
        >
          Heritage Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
