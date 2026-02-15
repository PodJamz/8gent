'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Wind, Loader2, RotateCcw } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

interface BreathSession {
  intention: string;
  pattern: string;
  visualization: string;
  affirmation: string;
}

function BreathAnchor() {
  const [session, setSession] = useState<BreathSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycles, setCycles] = useState(0);
  const [feeling, setFeeling] = useState('');
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const feelings = ['anxious', 'scattered', 'overwhelmed', 'restless', 'tired'];

  const generateSession = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setIsBreathing(false);
    setCycles(0);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'breath-guide', prompt: feeling || 'I need to find calm' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setSession({
          intention: data.intention || 'Release what no longer serves you',
          pattern: data.pattern || '4-4-4',
          visualization: data.visualization || 'Waves gently reaching the shore',
          affirmation: data.affirmation || 'I am calm like the sea',
        });
      }
    } catch {
      setSession({
        intention: 'Let each breath bring you home',
        pattern: '4-7-8',
        visualization: 'Tide flowing in, pausing, flowing out',
        affirmation: 'Peace flows through me',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, feeling]);

  // Parse breathing pattern
  const getPatternTiming = () => {
    if (!session) return { inhale: 4, hold: 4, exhale: 4 };
    const parts = session.pattern.split('-').map(Number);
    return {
      inhale: parts[0] || 4,
      hold: parts[1] || 4,
      exhale: parts[2] || 4,
    };
  };

  // Breathing animation cycle
  useEffect(() => {
    if (!isBreathing || !session) return;

    const timing = getPatternTiming();
    const runCycle = () => {
      // Inhale
      setPhase('inhale');
      animationRef.current = setTimeout(() => {
        // Hold
        setPhase('hold');
        animationRef.current = setTimeout(() => {
          // Exhale
          setPhase('exhale');
          animationRef.current = setTimeout(() => {
            setCycles((c) => c + 1);
            if (isBreathing) runCycle();
          }, timing.exhale * 1000);
        }, timing.hold * 1000);
      }, timing.inhale * 1000);
    };

    runCycle();

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [isBreathing, session]);

  const timing = getPatternTiming();
  const totalCycleTime = timing.inhale + timing.hold + timing.exhale;

  return (
    <div
      className="w-full rounded-2xl border overflow-hidden"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '500px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-3">
          <Waves className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Breath Anchor
          </span>
        </div>
        {cycles > 0 && (
          <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            {cycles} {cycles === 1 ? 'cycle' : 'cycles'}
          </span>
        )}
      </div>

      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 61px)' }}>
        {/* Feeling Selection */}
        {!session && (
          <div className="mb-6">
            <p
              className="text-xs uppercase tracking-wider mb-3"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              How are you feeling?
            </p>
            <div className="flex flex-wrap gap-2">
              {feelings.map((f) => (
                <button
                  key={f}
                  onClick={() => setFeeling(f)}
                  className="px-3 py-1.5 text-xs rounded-full transition-all"
                  style={{
                    backgroundColor: feeling === f ? 'hsl(var(--theme-primary))' : 'transparent',
                    color: feeling === f ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
                    border: `1px solid ${feeling === f ? 'transparent' : 'hsl(var(--theme-border))'}`,
                  }}
                >
                  {f}
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
                <Waves
                  className="w-10 h-10 mx-auto mb-4"
                  style={{ color: 'hsl(var(--theme-primary))' }}
                />
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Finding your rhythm...
                </p>
              </motion.div>
            ) : session ? (
              <motion.div
                key="session"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center w-full"
              >
                {/* Breathing Circle */}
                <div className="relative w-52 h-52 mx-auto mb-6">
                  {/* Ocean wave rings */}
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border"
                      style={{ borderColor: 'hsl(var(--theme-primary))' }}
                      animate={
                        isBreathing
                          ? {
                              scale: [1, 1.1 + i * 0.1, 1],
                              opacity: [0.3 - i * 0.1, 0.1, 0.3 - i * 0.1],
                            }
                          : {}
                      }
                      transition={{
                        duration: totalCycleTime,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}

                  {/* Main breathing circle */}
                  <motion.div
                    className="absolute inset-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'hsla(var(--theme-primary) / 0.15)' }}
                    animate={
                      isBreathing
                        ? {
                            scale:
                              phase === 'inhale'
                                ? [0.8, 1]
                                : phase === 'hold'
                                ? 1
                                : [1, 0.8],
                          }
                        : { scale: 0.9 }
                    }
                    transition={{
                      duration:
                        phase === 'inhale'
                          ? timing.inhale
                          : phase === 'hold'
                          ? timing.hold
                          : timing.exhale,
                      ease: 'easeInOut',
                    }}
                  >
                    <div className="text-center">
                      <p
                        className="text-2xl font-light mb-1"
                        style={{ color: 'hsl(var(--theme-primary))' }}
                      >
                        {isBreathing
                          ? phase === 'inhale'
                            ? 'Breathe in'
                            : phase === 'hold'
                            ? 'Hold'
                            : 'Release'
                          : 'Ready'}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                      >
                        {session.pattern}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Intention & Affirmation */}
                <p
                  className="text-base font-light mb-2 italic"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  {session.intention}
                </p>
                <p
                  className="text-xs mb-6"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {session.visualization}
                </p>

                {/* Controls */}
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setIsBreathing(!isBreathing)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor: 'hsl(var(--theme-primary))',
                      color: 'hsl(var(--theme-primary-foreground))',
                    }}
                  >
                    <Wind className="w-4 h-4" />
                    {isBreathing ? 'Pause' : 'Begin'}
                  </button>
                  <button
                    onClick={() => {
                      setSession(null);
                      setIsBreathing(false);
                      setCycles(0);
                    }}
                    className="p-2.5 rounded-full transition-all hover:opacity-70"
                    style={{
                      border: '1px solid hsl(var(--theme-border))',
                      color: 'hsl(var(--theme-muted-foreground))',
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <Waves
                  className="w-16 h-16 mx-auto mb-6"
                  style={{ color: 'hsl(var(--theme-primary))', opacity: 0.3 }}
                />
                <p className="text-sm mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Select how you're feeling
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.7 }}
                >
                  AI creates a personalized breathing session
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Generate Button */}
        {!session && (
          <button
            onClick={generateSession}
            disabled={loading}
            className="w-full py-3 text-sm font-medium rounded-full transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary-foreground))',
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Waves className="w-4 h-4" />
                Find My Rhythm
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function OceanBreezePage() {
  return (
    <ProductPageLayout
      theme="ocean-breeze"
      targetUser="stress-carriers"
      problemStatement="We hold tension without noticing. Stress becomes the background."
      problemContext="Shallow breathing is modern life's silent symptom. We hunch over screens, hold our breath during emails, and forget that our bodies are still waiting for permission to exhale. The tension accumulates until we don't remember what relaxed feels like."
      insight="Calm isn't found. It's practiced. The ocean doesn't hurry, and neither should your breath. Three cycles can shift your entire nervous system."
      tradeoffs={['Slowness over speed', 'Feeling over thinking', 'Rhythm over results']}
      appName="Breath Anchor"
      appDescription="AI-guided breathing with ocean rhythm visualization"
      principles={[
        {
          title: 'Rhythm as Medicine',
          description: 'Consistent breath patterns activate the parasympathetic nervous system. The ocean metaphor makes this ancient practice feel natural.',
        },
        {
          title: 'Embodied Interface',
          description: 'The expanding circle mirrors your lungs. Visual feedback helps your body learn without thinking.',
        },
        {
          title: 'Coastal Color Psychology',
          description: 'Blues and sandy tones lower heart rate. The palette itself is part of the intervention.',
        },
        {
          title: 'Minimal Friction',
          description: 'No accounts, no streaks, no gamification. Just breath. The value is immediate.',
        },
      ]}
      quote={{
        text: 'The cure for anything is salt water: sweat, tears, or the sea.',
        author: 'Isak Dinesen',
      }}
    >
      <BreathAnchor />

      {/* Additional Design Elements */}
      <div className="mt-16">
        <h3
          className="text-lg font-medium mb-4"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          Coastal Palette
        </h3>
        <p
          className="text-sm mb-6"
          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
        >
          Blues drawn from sky and sea. Click to copy.
        </p>
        <ColorPalette colors={themeColors['ocean-breeze']} />
      </div>

      <div className="mt-16">
        <h3
          className="text-lg font-medium mb-4"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          Maritime Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
