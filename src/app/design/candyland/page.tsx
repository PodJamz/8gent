'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Candy, PartyPopper, Loader2, Sparkles } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

interface JoySpark {
  celebration: string;
  emoji: string;
  confetti: string;
  sound: string;
}

function JoySparkApp() {
  const [spark, setSpark] = useState<JoySpark | null>(null);
  const [loading, setLoading] = useState(false);
  const [win, setWin] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const wins = ['finished a task', 'made progress', 'tried something new', 'helped someone', 'took a break'];

  const celebrate = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'joy-spark', prompt: win || 'I did something good' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setSpark({
          celebration: data.celebration || 'You did it! That deserves a happy dance!',
          emoji: data.emoji || '🎉✨🌟',
          confetti: data.confetti || 'bubblegum',
          sound: data.sound || 'woohoo',
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch {
      setSpark({
        celebration: 'Look at you go! Absolutely crushing it!',
        emoji: '🎊🌈⭐',
        confetti: 'lemon',
        sound: 'tada',
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } finally {
      setLoading(false);
    }
  }, [loading, win]);

  // Confetti particles
  const confettiColors = {
    bubblegum: ['#FF6B9D', '#FF8FB1', '#FFB4C8'],
    lemon: ['#FFE566', '#FFED8A', '#FFF4AD'],
    mint: ['#7DFFB3', '#A3FFC9', '#C9FFDF'],
    coral: ['#FF7F7F', '#FFA3A3', '#FFC7C7'],
    lavender: ['#B88CFF', '#CBA8FF', '#DEC4FF'],
  };

  return (
    <div
      className="w-full rounded-3xl border overflow-hidden relative"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '480px',
      }}
    >
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full pointer-events-none"
                style={{
                  backgroundColor: confettiColors[spark?.confetti as keyof typeof confettiColors]?.[i % 3] || '#FF6B9D',
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ top: -20, opacity: 1, rotate: 0 }}
                animate={{
                  top: '100%',
                  opacity: 0,
                  rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                  x: (Math.random() - 0.5) * 100,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-3">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Candy className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          </motion.div>
          <span className="text-sm font-bold" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Joy Spark
          </span>
        </div>
        {spark && (
          <span className="text-xs font-bold uppercase" style={{ color: 'hsl(var(--theme-primary))' }}>
            {spark.sound}!
          </span>
        )}
      </div>

      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 61px)' }}>
        {/* Win Selection */}
        {!spark && (
          <div className="mb-6">
            <p
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              What did you accomplish?
            </p>
            <div className="flex flex-wrap gap-2">
              {wins.map((w) => (
                <button
                  key={w}
                  onClick={() => setWin(w)}
                  className="px-4 py-2 text-xs font-bold rounded-full transition-all hover:scale-105"
                  style={{
                    backgroundColor: win === w ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-secondary))',
                    color: win === w ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-secondary-foreground))',
                  }}
                >
                  {w}
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                </motion.div>
                <p className="text-sm font-bold" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Generating celebration...
                </p>
              </motion.div>
            ) : spark ? (
              <motion.div
                key="spark"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  className="text-6xl mb-6"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  {spark.emoji}
                </motion.div>
                <h3
                  className="text-2xl font-black mb-4 leading-tight"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  {spark.celebration}
                </h3>
                <button
                  onClick={() => setSpark(null)}
                  className="px-6 py-2 text-xs font-bold rounded-full transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'hsl(var(--theme-secondary))',
                    color: 'hsl(var(--theme-secondary-foreground))',
                  }}
                >
                  Celebrate Again
                </button>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <PartyPopper
                  className="w-20 h-20 mx-auto mb-6"
                  style={{ color: 'hsl(var(--theme-primary))', opacity: 0.4 }}
                />
                <p className="text-sm font-bold mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Select your win and celebrate!
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.7 }}>
                  AI generates personalized micro-celebrations
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Celebrate Button */}
        {!spark && (
          <motion.button
            onClick={celebrate}
            disabled={loading}
            className="w-full py-4 text-sm font-black rounded-full transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary-foreground))',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <PartyPopper className="w-5 h-5" />
                Celebrate Me!
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default function CandylandPage() {
  return (
    <ProductPageLayout
      theme="candyland"
      targetUser="burnt-out creators"
      problemStatement="Productivity tools forgot that joy is productive. Everything feels like a chore."
      problemContext="We track tasks, optimize workflows, and measure output. But somewhere along the way, we forgot that humans need celebration. Small wins go unnoticed. Finished tasks just reveal more tasks. The dopamine of accomplishment has been engineered out of our tools."
      insight="Delight isn't frivolous. It's fuel. Micro-celebrations rewire our relationship with work. When finishing feels good, starting becomes easier."
      tradeoffs={['Joy over efficiency', 'Celebration over optimization', 'Play over productivity']}
      appName="Joy Spark"
      appDescription="AI-powered micro-celebrations for your wins"
      principles={[
        {
          title: 'Celebration as Intervention',
          description: 'Positive reinforcement changes behavior. Each celebration strengthens the neural pathway between effort and reward.',
        },
        {
          title: 'Playful Aesthetics',
          description: 'Bright colors and bouncy animations signal safety and play. The visual language gives permission to feel good.',
        },
        {
          title: 'Personalized Recognition',
          description: 'Generic praise falls flat. AI-generated celebrations feel specific, surprising, and genuinely delightful.',
        },
        {
          title: 'Sensory Reward',
          description: 'Confetti, sound words, and emoji create multi-sensory celebration. The experience feels complete.',
        },
      ]}
      quote={{
        text: 'Life is uncertain. Eat dessert first.',
        author: 'Ernestine Ulmer',
      }}
    >
      <JoySparkApp />

      <div className="mt-16">
        <h3 className="text-xl font-black mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Candy Palette
        </h3>
        <p className="text-sm font-medium mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Sugary sweet colors. Click to copy!
        </p>
        <ColorPalette colors={themeColors.candyland} />
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-black mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Sweet Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
