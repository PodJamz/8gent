'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Square, Loader2, RefreshCw, Lightbulb, ArrowRight, Unlock } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

interface BlankCanvas {
  constraint: string;
  firstStep: string;
  permission: string;
  reminder: string;
}

function BlankCanvasApp() {
  const [canvas, setCanvas] = useState<BlankCanvas | null>(null);
  const [loading, setLoading] = useState(false);
  const [block, setBlock] = useState('');

  const blocks = ['starting a project', 'writing something', 'making a decision', 'learning something new', 'facing uncertainty'];

  const getPrompt = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'blank-canvas', prompt: block || 'I am staring at a blank page' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setCanvas({
          constraint: data.constraint || 'Start ugly. You can fix it later.',
          firstStep: data.firstStep || 'Write one sentence. Any sentence.',
          permission: data.permission || 'It does not have to be good.',
          reminder: data.reminder || 'Every masterpiece started as a blank page.',
        });
      }
    } catch {
      setCanvas({
        constraint: 'Give yourself only 5 minutes. That is the whole project.',
        firstStep: 'Open the file. Type the first word.',
        permission: 'Release the need for perfection.',
        reminder: 'Starting is the hardest part. You are already past it.',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, block]);

  return (
    <div
      className="w-full rounded-lg border overflow-hidden"
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
          <Square className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Blank Canvas
          </span>
        </div>
        <span className="text-xs uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Foundation
        </span>
      </div>

      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 57px)' }}>
        {/* Block Selection */}
        {!canvas && (
          <div className="mb-6">
            <p
              className="text-xs uppercase tracking-wider mb-3"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              What is the blank canvas?
            </p>
            <div className="flex flex-wrap gap-2">
              {blocks.map((b) => (
                <button
                  key={b}
                  onClick={() => setBlock(b)}
                  className="px-3 py-1.5 text-xs transition-all rounded-lg"
                  style={{
                    backgroundColor: block === b ? 'hsl(var(--theme-primary))' : 'transparent',
                    color: block === b ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
                    border: `1px solid ${block === b ? 'transparent' : 'hsl(var(--theme-border))'}`,
                  }}
                >
                  {b}
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
                  animate={{ scale: [1, 0.9, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Square className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                </motion.div>
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Finding your starting point...
                </p>
              </motion.div>
            ) : canvas ? (
              <motion.div
                key="canvas"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-6"
              >
                {/* Constraint */}
                <div className="text-center pb-6 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
                  <Lightbulb className="w-5 h-5 mx-auto mb-3" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <p
                    className="text-lg font-medium leading-relaxed"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  >
                    {canvas.constraint}
                  </p>
                </div>

                {/* First Step */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      First Step
                    </p>
                    <p className="font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                      {canvas.firstStep}
                    </p>
                  </div>
                </div>

                {/* Permission */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border"
                    style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    <Unlock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      Permission
                    </p>
                    <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      {canvas.permission}
                    </p>
                  </div>
                </div>

                {/* Reminder */}
                <div
                  className="text-center pt-4 border-t"
                  style={{ borderColor: 'hsl(var(--theme-border))' }}
                >
                  <p
                    className="text-sm italic"
                    style={{ color: 'hsl(var(--theme-primary))' }}
                  >
                    "{canvas.reminder}"
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <Square
                  className="w-16 h-16 mx-auto mb-6"
                  style={{ color: 'hsl(var(--theme-foreground))', opacity: 0.15 }}
                />
                <p className="text-sm mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  What is your blank canvas?
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.6 }}>
                  AI generates creative constraints to help you start
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        {canvas ? (
          <button
            onClick={() => setCanvas(null)}
            className="w-full py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 border rounded-lg"
            style={{
              borderColor: 'hsl(var(--theme-border))',
              color: 'hsl(var(--theme-foreground))',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            New Canvas
          </button>
        ) : (
          <button
            onClick={getPrompt}
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
                <Square className="w-4 h-4" />
                Find My Start
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function BasePage() {
  return (
    <ProductPageLayout
      theme="base"
      targetUser="creators facing blank page syndrome"
      problemStatement="The blank page is terrifying. Too many possibilities. No constraints. Analysis paralysis."
      problemContext="Every project starts the same way: an empty document, an empty folder, an empty canvas. The infinite white expanse is supposed to represent freedom, but it often represents fear. Without constraints, we cannot begin. We wait for inspiration that never comes."
      insight="Constraints are liberation. A blank page offers infinite choices. A prompted page offers a starting point. The hardest part of any creative work is the first mark. AI can make that mark smaller, less precious, more possible."
      tradeoffs={['Starting over perfection', 'Constraints over freedom', 'Done over ideal']}
      appName="Blank Canvas"
      appDescription="AI generates creative constraints to help you begin"
      principles={[
        {
          title: 'Purposeful Neutrality',
          description: 'The base theme embraces neutrality not as absence of personality, but as potential. Every decision is restrained to serve as a starting point.',
        },
        {
          title: 'Systematic Consistency',
          description: 'A robust token system ensures every element relates predictably. Spacing, typography, and colors follow mathematical ratios.',
        },
        {
          title: 'Accessibility First',
          description: 'Every contrast ratio tested. Every element keyboard-navigable. Design must work for everyone.',
        },
        {
          title: 'Built for Scale',
          description: 'From a single page to an enterprise app, the system scales without breaking. Modular patterns, predictable compositions.',
        },
      ]}
      quote={{
        text: 'Simplicity is the ultimate sophistication.',
        author: 'Leonardo da Vinci',
      }}
    >
      <BlankCanvasApp />

      <div className="mt-16">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Neutral Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Clean whites, soft grays, purposeful blacks. Click to copy.
        </p>
        <ColorPalette colors={themeColors.base} />
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Foundation Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
