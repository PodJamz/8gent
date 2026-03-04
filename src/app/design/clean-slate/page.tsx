'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eraser, Lightbulb, Loader2, RefreshCw, ArrowRight } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';

interface MindClear {
  clarity: string;
  action: string;
  release: string;
  mantra: string;
}

function MindClearApp() {
  const [result, setResult] = useState<MindClear | null>(null);
  const [loading, setLoading] = useState(false);
  const [clutter, setClutter] = useState('');

  const clutterTypes = ['too many tasks', 'decision fatigue', 'unclear priorities', 'information overload', 'stuck in loops'];

  const clear = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'mind-clear', prompt: clutter || 'My mind feels cluttered' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setResult({
          clarity: data.clarity || 'You have many inputs. You need one output.',
          action: data.action || 'Write down the one thing.',
          release: data.release || 'Let go of perfect timing.',
          mantra: data.mantra || 'Clear space, clear mind.',
        });
      }
    } catch {
      setResult({
        clarity: 'The noise is not the signal. Find one thread.',
        action: 'Close all tabs. Start with one.',
        release: 'Release the illusion of control.',
        mantra: 'Begin again. Always.',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, clutter]);

  return (
    <div
      className="w-full rounded-lg border overflow-hidden"
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
          <Eraser className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Mind Clear
          </span>
        </div>
        <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Fresh Start
        </span>
      </div>

      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 57px)' }}>
        {/* Clutter Selection */}
        {!result && (
          <div className="mb-6">
            <p
              className="text-xs uppercase tracking-wider mb-3"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              What feels cluttered?
            </p>
            <div className="flex flex-wrap gap-2">
              {clutterTypes.map((c) => (
                <button
                  key={c}
                  onClick={() => setClutter(c)}
                  className="px-3 py-1.5 text-xs transition-all"
                  style={{
                    backgroundColor: clutter === c ? 'hsl(var(--theme-foreground))' : 'transparent',
                    color: clutter === c ? 'hsl(var(--theme-background))' : 'hsl(var(--theme-muted-foreground))',
                    border: `1px solid ${clutter === c ? 'transparent' : 'hsl(var(--theme-border))'}`,
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.div
                  className="w-12 h-12 mx-auto mb-4 border-2 rounded-full"
                  style={{ borderColor: 'hsl(var(--theme-foreground))', borderTopColor: 'transparent' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Finding clarity...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-6"
              >
                {/* Clarity */}
                <div className="text-center pb-6 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
                  <p
                    className="text-xl font-medium leading-relaxed"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  >
                    {result.clarity}
                  </p>
                </div>

                {/* Action */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'hsl(var(--theme-foreground))', color: 'hsl(var(--theme-background))' }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      Next action
                    </p>
                    <p className="font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                      {result.action}
                    </p>
                  </div>
                </div>

                {/* Release */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border"
                    style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    <Eraser className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      Let go
                    </p>
                    <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      {result.release}
                    </p>
                  </div>
                </div>

                {/* Mantra */}
                <div
                  className="text-center pt-4 border-t"
                  style={{ borderColor: 'hsl(var(--theme-border))' }}
                >
                  <p
                    className="text-sm italic"
                    style={{ color: 'hsl(var(--theme-primary))' }}
                  >
                    "{result.mantra}"
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <div
                  className="w-16 h-16 mx-auto mb-6 border-2"
                  style={{ borderColor: 'hsl(var(--theme-foreground))', opacity: 0.2 }}
                />
                <p className="text-sm mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Select what feels cluttered
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.6 }}>
                  AI organizes chaos into one clear next step
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
            Start Fresh
          </button>
        ) : (
          <button
            onClick={clear}
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
                <Lightbulb className="w-4 h-4" />
                Find Clarity
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function CleanSlatePage() {
  return (
    <ProductPageLayout
      theme="clean-slate"
      targetUser="anyone feeling overwhelmed"
      problemStatement="Mental clutter accumulates. We need rituals for fresh starts."
      problemContext="Our minds hold too many open loops. Unfinished tasks, half-formed ideas, and competing priorities create a fog that makes even simple decisions feel hard. We don't need more information. We need less noise."
      insight="A blank page is a form of permission. Clarity comes from subtraction, not addition. One action beats ten intentions."
      tradeoffs={['Simplicity over completeness', 'One step over grand plans', 'Release over retention']}
      appName="Mind Clear"
      appDescription="AI-guided brain dump that organizes chaos into clarity"
      principles={[
        {
          title: 'Subtraction as Strategy',
          description: 'The goal is not to organize everything. It is to identify the one thing that matters and let go of the rest.',
        },
        {
          title: 'Visual Calm',
          description: 'Generous whitespace and minimal elements reduce cognitive load. The interface itself is part of the intervention.',
        },
        {
          title: 'Permission to Release',
          description: 'The "let go" prompt gives explicit permission to stop holding onto what is not serving you.',
        },
        {
          title: 'Mantra as Anchor',
          description: 'A simple phrase to return to when the clutter creeps back. Repetition creates resilience.',
        },
      ]}
      quote={{
        text: 'Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.',
        author: 'Antoine de Saint-Exupéry',
      }}
    >
      <MindClearApp />
    </ProductPageLayout>
  );
}
