'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Clock, Loader2, RefreshCw, Zap } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';

interface CreativeChallenge {
  constraint: string;
  medium: string;
  timeLimit: number;
  inspiration: string;
}

interface StarPoint {
  id: number;
  x: number;
  y: number;
  size: number;
  brightness: number;
}

function CreativeSpark() {
  const [challenge, setChallenge] = useState<CreativeChallenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [block, setBlock] = useState('');
  const [stars, setStars] = useState<StarPoint[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const blocks = ['blank page', 'perfectionism', 'self-doubt', 'comparison', 'overthinking'];

  const generateChallenge = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'creative-spark', prompt: block || 'I need creative inspiration' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setChallenge({
          constraint: data.constraint || 'Create something using only circles and one color',
          medium: data.medium || 'Visual',
          timeLimit: parseInt(data.timeLimit) || 10,
          inspiration: data.inspiration || 'midnight',
        });
        // Generate celebration stars
        generateStars();
      }
    } catch {
      setChallenge({
        constraint: 'Write a story where every sentence starts with the next letter of the alphabet',
        medium: 'Writing',
        timeLimit: 15,
        inspiration: 'constellation',
      });
      generateStars();
    } finally {
      setLoading(false);
    }
  }, [loading, block]);

  const generateStars = () => {
    const newStars: StarPoint[] = [];
    for (let i = 0; i < 12; i++) {
      newStars.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        brightness: Math.random() * 0.5 + 0.5,
      });
    }
    setStars(newStars);
  };

  // Add star on click
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !challenge) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setStars((prev) => [
      ...prev,
      {
        id: Date.now(),
        x,
        y,
        size: Math.random() * 6 + 3,
        brightness: 1,
      },
    ]);
  };

  return (
    <div
      className="w-full rounded-lg border overflow-hidden"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '520px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span
            className="text-sm"
            style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
          >
            Creative Spark
          </span>
        </div>
        {challenge && (
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
            <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              {challenge.timeLimit} min
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col" style={{ height: 'calc(100% - 61px)' }}>
        {/* Block Selection */}
        {!challenge && (
          <div className="px-6 pt-6 pb-4">
            <p
              className="text-xs uppercase tracking-wider mb-3"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              What's blocking you?
            </p>
            <div className="flex flex-wrap gap-2">
              {blocks.map((b) => (
                <button
                  key={b}
                  onClick={() => setBlock(b)}
                  className="px-3 py-1.5 text-xs rounded transition-all"
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
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="flex-1 flex items-center justify-center relative overflow-hidden cursor-crosshair"
        >
          {/* Background stars */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`bg-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                backgroundColor: 'hsl(var(--theme-foreground))',
              }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}

          {/* Interactive stars */}
          <AnimatePresence>
            {stars.map((star) => (
              <motion.div
                key={star.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: star.brightness }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Star
                  className="fill-current"
                  style={{
                    width: star.size * 3,
                    height: star.size * 3,
                    color: 'hsl(var(--theme-primary))',
                    filter: `drop-shadow(0 0 ${star.size}px hsl(var(--theme-primary)))`,
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center z-10"
              >
                <Sparkles
                  className="w-10 h-10 mx-auto mb-4 animate-pulse"
                  style={{ color: 'hsl(var(--theme-primary))' }}
                />
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Finding your spark...
                </p>
              </motion.div>
            ) : challenge ? (
              <motion.div
                key="challenge"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center px-8 z-10 max-w-md"
              >
                {/* Medium badge */}
                <div className="mb-4">
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: 'hsla(var(--theme-primary) / 0.2)',
                      color: 'hsl(var(--theme-primary))',
                    }}
                  >
                    <Zap className="w-3 h-3" />
                    {challenge.medium}
                  </span>
                </div>

                {/* Constraint */}
                <h3
                  className="text-xl leading-relaxed mb-4"
                  style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
                >
                  {challenge.constraint}
                </h3>

                {/* Inspiration word */}
                <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Incorporate the word:{' '}
                  <span style={{ color: 'hsl(var(--theme-primary))' }}>{challenge.inspiration}</span>
                </p>

                {/* Timer info */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-6"
                  style={{ backgroundColor: 'hsla(var(--theme-foreground) / 0.1)' }}
                >
                  <Clock className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                  <span className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    {challenge.timeLimit} minutes
                  </span>
                </div>

                <p
                  className="text-xs italic mb-4"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  Click anywhere to add celebration stars
                </p>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center z-10 px-6">
                <Star
                  className="w-16 h-16 mx-auto mb-6"
                  style={{ color: 'hsl(var(--theme-primary))', opacity: 0.3 }}
                />
                <p className="text-sm mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  What's blocking your creativity?
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.7 }}
                >
                  AI generates a constraint to unlock new thinking
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div className="px-6 pb-6">
          {challenge ? (
            <button
              onClick={() => {
                setChallenge(null);
                setStars([]);
              }}
              className="w-full py-3 text-sm font-medium rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{
                border: '1px solid hsl(var(--theme-border))',
                color: 'hsl(var(--theme-foreground))',
              }}
            >
              <RefreshCw className="w-4 h-4" />
              New Spark
            </button>
          ) : (
            <button
              onClick={generateChallenge}
              disabled={loading}
              className="w-full py-3 text-sm font-medium rounded-lg transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'hsl(var(--theme-primary))',
                color: 'hsl(var(--theme-primary-foreground))',
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Ignite Creativity
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StarryNightPage() {
  return (
    <ProductPageLayout
      theme="starry-night"
      targetUser="blocked creatives"
      problemStatement="Creativity feels like a talent, not a practice. We wait for inspiration that never comes."
      problemContext="The blank page is terrifying because we believe good ideas should arrive fully formed. We scroll for inspiration instead of making. We compare our rough drafts to others' finished work. The longer we wait, the higher the stakes feel."
      insight="Creativity is motion, not magic. Constraints don't limit us. They liberate us. When you can't do anything, you do nothing. When you must work within limits, you actually start."
      tradeoffs={['Action over perfection', 'Constraints over freedom', 'Play over performance']}
      appName="Creative Spark"
      appDescription="AI-generated constraints to unlock new thinking"
      principles={[
        {
          title: 'Constraints as Liberation',
          description: 'Unlimited options cause paralysis. A weird constraint gives you permission to make something imperfect.',
        },
        {
          title: 'Time Boxing',
          description: 'Short time limits lower stakes. You can do anything for 10 minutes. The timer is permission to stop.',
        },
        {
          title: 'Celestial Atmosphere',
          description: 'Dark skies and stars evoke the late-night hours when creativity often flows. The vibe is permission to dream.',
        },
        {
          title: 'Celebration Built In',
          description: 'Clicking to add stars makes the act of creation feel magical. Small celebrations reinforce creative identity.',
        },
      ]}
      quote={{
        text: 'I know nothing with any certainty, but the sight of the stars makes me dream.',
        author: 'Vincent van Gogh',
      }}
    >
      <CreativeSpark />
    </ProductPageLayout>
  );
}
