'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, BookOpen, Clock, Loader2, RefreshCw, Feather } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';
import { TypewriterKeyboard } from '@/components/design/InterfaceMockups';

interface AnalogPrompt {
  prompt: string;
  duration: number;
  mood: string;
  tip: string;
}

function AnalogPromptApp() {
  const [result, setResult] = useState<AnalogPrompt | null>(null);
  const [loading, setLoading] = useState(false);
  const [intention, setIntention] = useState('');

  const intentions = ['reflect on today', 'process a feeling', 'dream about the future', 'remember something', 'let something go'];

  const getPrompt = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'analog-prompt', prompt: intention || 'I want to journal' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setResult({
          prompt: data.prompt || 'What would you tell your younger self about this moment?',
          duration: parseInt(data.duration) || 10,
          mood: data.mood || 'reflective',
          tip: data.tip || 'Write without lifting the pen.',
        });
      }
    } catch {
      setResult({
        prompt: 'Describe the last time you felt completely at peace.',
        duration: 15,
        mood: 'reflective',
        tip: 'Let the words flow without judgment.',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, intention]);

  return (
    <div
      className="w-full rounded-none border overflow-hidden relative"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '500px',
      }}
    >
      {/* Notebook lines background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="w-full h-px absolute"
            style={{
              top: `${(i + 1) * 32}px`,
              backgroundColor: 'hsl(var(--theme-primary))',
              opacity: 0.15,
            }}
          />
        ))}
        <div
          className="absolute top-0 bottom-0 w-px left-12"
          style={{ backgroundColor: 'hsl(var(--theme-primary))', opacity: 0.3 }}
        />
      </div>

      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b relative z-10"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-3">
          <Feather className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span
            className="text-sm"
            style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
          >
            Analog Prompt
          </span>
        </div>
        {result && (
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
            <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              {result.duration} min
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col p-6 relative z-10" style={{ height: 'calc(100% - 57px)' }}>
        {/* Intention Selection */}
        {!result && (
          <div className="mb-6 pl-8">
            <p
              className="text-xs uppercase tracking-wider mb-3"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              I want to...
            </p>
            <div className="flex flex-wrap gap-2">
              {intentions.map((i) => (
                <button
                  key={i}
                  onClick={() => setIntention(i)}
                  className="px-3 py-1.5 text-xs transition-all"
                  style={{
                    backgroundColor: intention === i ? 'hsl(var(--theme-primary))' : 'transparent',
                    color: intention === i ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
                    border: `1px solid ${intention === i ? 'transparent' : 'hsl(var(--theme-border))'}`,
                    fontFamily: 'var(--theme-font-heading)',
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center pl-8">
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
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <PenLine className="w-10 h-10 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                </motion.div>
                <p
                  className="text-sm"
                  style={{ color: 'hsl(var(--theme-muted-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                >
                  Finding your prompt...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
              >
                {/* Mood badge */}
                <span
                  className="inline-block px-3 py-1 text-xs mb-6"
                  style={{
                    backgroundColor: 'hsla(var(--theme-primary) / 0.15)',
                    color: 'hsl(var(--theme-primary))',
                    fontFamily: 'var(--theme-font-heading)',
                  }}
                >
                  {result.mood}
                </span>

                {/* Prompt */}
                <h3
                  className="text-2xl leading-relaxed mb-6"
                  style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                >
                  {result.prompt}
                </h3>

                {/* Tip */}
                <div
                  className="pt-4 border-t"
                  style={{ borderColor: 'hsl(var(--theme-border))' }}
                >
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    Tip
                  </p>
                  <p
                    className="text-sm italic"
                    style={{ color: 'hsl(var(--theme-muted-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                  >
                    {result.tip}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <BookOpen
                  className="w-16 h-16 mx-auto mb-6"
                  style={{ color: 'hsl(var(--theme-primary))', opacity: 0.3 }}
                />
                <p
                  className="text-sm mb-2"
                  style={{ color: 'hsl(var(--theme-muted-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                >
                  What brings you to the page today?
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.6 }}>
                  AI generates prompts for handwritten reflection
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div className="pl-8">
          {result ? (
            <button
              onClick={() => setResult(null)}
              className="w-full py-3 text-sm transition-all flex items-center justify-center gap-2 border"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
            >
              <RefreshCw className="w-4 h-4" />
              New Prompt
            </button>
          ) : (
            <button
              onClick={getPrompt}
              disabled={loading}
              className="w-full py-3 text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'hsl(var(--theme-primary))',
                color: 'hsl(var(--theme-primary-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <PenLine className="w-4 h-4" />
                  Start Writing
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotebookPage() {
  return (
    <ProductPageLayout
      theme="notebook"
      targetUser="writers who miss pen and paper"
      problemStatement="Digital writing feels cold. We type faster than we think."
      problemContext="Keyboards reward speed over reflection. Autocorrect interrupts our flow. The blank screen glares back. We have lost the intimacy of ink meeting paper, the pause between thoughts, the irreversibility that makes each word matter."
      insight="Slowing down is not inefficiency. It is a return to thinking. A prompt meant for handwriting invites a different kind of presence."
      tradeoffs={['Reflection over speed', 'Analog over digital', 'Depth over breadth']}
      appName="Analog Prompt"
      appDescription="AI-generated journaling prompts designed for handwriting"
      principles={[
        {
          title: 'Ruled Lines',
          description: 'Subtle guidelines that organize without constraining. Structure that supports rather than dictates.',
        },
        {
          title: 'Margin Space',
          description: 'Room for annotations, second thoughts, and the wandering mind. Not every idea fits on the line.',
        },
        {
          title: 'Warm Paper',
          description: 'Off-white backgrounds recall real notebook pages. The softness invites lingering.',
        },
        {
          title: 'Handwritten Feel',
          description: 'Typefaces that suggest the human hand. Imperfection as authenticity.',
        },
      ]}
      quote={{
        text: 'Start writing, no matter what. The water does not flow until the faucet is turned on.',
        author: 'Louis L\'Amour',
      }}
    >
      <AnalogPromptApp />

      {/* Typewriter Keyboard Section */}
      <div className="mt-16">
        <h3
          className="text-xl mb-4"
          style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
        >
          Typewriter Experience
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Type on the notebook keyboard. Listen for the satisfying click of each key.
        </p>
        <TypewriterKeyboard />
      </div>

      <div className="mt-16">
        <h3
          className="text-xl mb-4"
          style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
        >
          Ink Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Warm paper tones and classic ink colors. Click to copy.
        </p>
        <ColorPalette colors={themeColors.notebook} />
      </div>

      <div className="mt-16">
        <h3
          className="text-xl mb-4"
          style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
        >
          Stationery Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
