'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Circle, Square, Triangle, Sparkles, Loader2 } from 'lucide-react';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import '@/lib/themes/themes.css';

interface Sculpture {
  name: string;
  form: string;
  texture: string;
  feeling: string;
  emoji: string;
}

function MoodSculptor() {
  const [sculpture, setSculpture] = useState<Sculpture | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');
  const [squishCount, setSquishCount] = useState(0);

  const moods = ['calm', 'excited', 'dreamy', 'cozy', 'playful'];

  const generateSculpture = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'mood-sculpture',
          prompt: selectedMood || 'peaceful and content',
        }),
      });

      if (!response.ok) throw new Error('Failed');

      const data = await response.json();
      if (!data.error) {
        setSculpture({
          name: data.name || 'Gentle Wave',
          form: data.form || 'flowing curves',
          texture: data.texture || 'smooth',
          feeling: data.feeling || 'like holding warmth itself',
          emoji: data.emoji || '🫧',
        });
      }
    } catch {
      setSculpture({
        name: 'Comfort Form',
        form: 'soft rounded edges',
        texture: 'dimpled',
        feeling: 'like a warm hug',
        emoji: '🧸',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, selectedMood]);

  const handleSquish = () => {
    setSquishCount((prev) => prev + 1);
  };

  return (
    <div
      className="w-full rounded-3xl overflow-hidden"
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
        boxShadow: `
          8px 8px 0 hsl(var(--theme-border)),
          inset -2px -2px 0 hsla(var(--theme-foreground) / 0.05),
          inset 2px 2px 0 hsla(var(--theme-background) / 0.5)
        `,
        height: '440px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Mood Sculptor
          </span>
        </div>
        {squishCount > 0 && (
          <motion.span
            className="text-xs px-2 py-1 rounded-full"
            style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.2)', color: 'hsl(var(--theme-primary))' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {squishCount} squishes
          </motion.span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 57px)' }}>
        {/* Mood chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {moods.map((mood) => (
            <motion.button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className="px-4 py-2 rounded-2xl text-sm font-medium transition-all"
              style={{
                backgroundColor: selectedMood === mood ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-background))',
                color: selectedMood === mood ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-foreground))',
                boxShadow: selectedMood === mood ? 'none' : '3px 3px 0 hsl(var(--theme-border))',
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {mood}
            </motion.button>
          ))}
        </div>

        {/* Sculpture display */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <motion.div
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                  style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.3)' }}
                  animate={{
                    borderRadius: ['50%', '40%', '50%', '45%', '50%'],
                    scale: [1, 1.1, 1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Sculpting your mood...
                </p>
              </motion.div>
            ) : sculpture ? (
              <motion.div
                key="sculpture"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center w-full"
              >
                {/* Interactive sculpture blob */}
                <motion.div
                  className="w-24 h-24 mx-auto mb-5 cursor-pointer flex items-center justify-center text-4xl"
                  style={{
                    backgroundColor: 'hsl(var(--theme-primary))',
                    borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%',
                    boxShadow: `
                      inset -4px -4px 0 hsla(var(--theme-foreground) / 0.1),
                      inset 4px 4px 0 hsla(var(--theme-background) / 0.3)
                    `,
                  }}
                  onClick={handleSquish}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{
                    scale: 0.85,
                    borderRadius: '50% 50% 40% 60% / 60% 40% 60% 40%',
                  }}
                  animate={{
                    borderRadius: [
                      '60% 40% 50% 50% / 50% 60% 40% 50%',
                      '50% 50% 40% 60% / 40% 50% 60% 50%',
                      '60% 40% 50% 50% / 50% 60% 40% 50%',
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {sculpture.emoji}
                </motion.div>
                <p className="text-xs mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  tap to squish
                </p>

                <motion.h3
                  className="text-xl font-bold mb-2"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {sculpture.name}
                </motion.h3>
                <motion.p
                  className="text-sm mb-2"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {sculpture.form} • {sculpture.texture}
                </motion.p>
                <motion.p
                  className="text-sm italic"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  &ldquo;{sculpture.feeling}&rdquo;
                </motion.p>
              </motion.div>
            ) : (
              <motion.p
                key="empty"
                className="text-sm"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                Select a mood and sculpt
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Generate button */}
        <motion.button
          onClick={generateSculpture}
          disabled={loading}
          className="w-full py-3 rounded-2xl text-sm font-medium transition-all flex items-center justify-center gap-2"
          style={{
            backgroundColor: 'hsl(var(--theme-primary))',
            color: 'hsl(var(--theme-primary-foreground))',
            boxShadow: '4px 4px 0 hsl(var(--theme-border))',
          }}
          whileHover={{ y: -2 }}
          whileTap={{ y: 2, boxShadow: '2px 2px 0 hsl(var(--theme-border))' }}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : sculpture ? (
            'Sculpt Again'
          ) : (
            'Create Sculpture'
          )}
        </motion.button>
      </div>
    </div>
  );
}

function ClayCard({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      className="px-8 py-6 rounded-2xl"
      style={{
        backgroundColor: 'hsl(var(--theme-card))',
        boxShadow: `
          6px 6px 0 hsl(var(--theme-border)),
          inset -2px -2px 0 hsla(var(--theme-foreground) / 0.05),
          inset 2px 2px 0 hsla(var(--theme-background) / 0.5)
        `,
      }}
      whileHover={{ y: -3, scale: 1.02 }}
    >
      <p className="text-2xl font-bold" style={{ color: 'hsl(var(--theme-foreground))' }}>{value}</p>
      <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{label}</p>
    </motion.div>
  );
}

const principles = [
  { id: 'soft', number: '01', title: 'Soft Shadows', description: 'Inner and outer shadows create the illusion of depth and dimension.' },
  { id: 'rounded', number: '02', title: 'Rounded Everything', description: 'Generous border radius creates an approachable, friendly aesthetic.' },
  { id: 'tactile', number: '03', title: 'Tactile Feedback', description: 'Hover and press states that feel physical, like soft buttons.' },
  { id: 'warmth', number: '04', title: 'Warm Colors', description: 'Soft, muted color palettes that feel comfortable and organic.' },
];

const shapes = [
  { icon: Circle, name: 'Circle' },
  { icon: Square, name: 'Square' },
  { icon: Triangle, name: 'Triangle' },
];

export default function ClaymorphismPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const watchDNA = useMemo(() => themeToWatch('claymorphism'), []);

  return (
    <div
      ref={containerRef}
      data-design-theme="claymorphism"
      className="min-h-screen relative"
      style={{ backgroundColor: 'hsl(var(--theme-background))', fontFamily: 'var(--theme-font)' }}
    >
      {/* Soft blob background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute right-0 bottom-0 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: 'hsl(var(--theme-accent))' }}
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="fixed top-14 left-0 right-0 h-[4px] z-40 origin-left rounded-full"
        style={{ scaleX: scrollYProgress, backgroundColor: 'hsl(var(--theme-primary))' }}
      />

      <DesignHeader
        currentTheme="claymorphism"
        backHref="/design"
        backText="Gallery"
        rightContent={
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: 'hsl(var(--theme-card))', boxShadow: '3px 3px 0 hsl(var(--theme-border))' }}
          >
            <Circle className="w-3 h-3" style={{ color: 'hsl(var(--theme-primary))' }} />
            <span className="text-xs font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Material
            </span>
          </div>
        }
      />

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center pt-16 relative">
        <div className="max-w-5xl mx-auto px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.2)' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
              <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-primary))' }}>Soft & Tactile</p>
            </div>
            <h1
              className="text-5xl md:text-7xl font-bold leading-tight mb-8"
              style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
            >
              Claymorphism
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl mb-12" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Soft dimension meets tactile interfaces. Experience the warmth of 3D-inspired design that you can almost reach out and touch.
            </p>
            <div className="flex flex-wrap gap-6">
              <ClayCard value="3D" label="Depth" />
              <ClayCard value="Poppins" label="Typeface" />
              <ClayCard value="Soft" label="Shadows" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mood Sculptor */}
      <section className="py-24 relative">
        <div className="max-w-lg mx-auto px-8">
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
          >
            AI Mood Sculptor
          </h2>
          <p className="text-sm mb-8" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Turn your feelings into a tactile sculpture. Select a mood and watch it take form.
          </p>
          <MoodSculptor />
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-8">
          <h2
            className="text-3xl font-bold mb-12"
            style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
          >
            Design Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.id}
                className="p-8 rounded-3xl"
                style={{
                  backgroundColor: 'hsl(var(--theme-card))',
                  boxShadow: `
                    8px 8px 0 hsl(var(--theme-border)),
                    inset -2px -2px 0 hsla(var(--theme-foreground) / 0.05),
                    inset 2px 2px 0 hsla(var(--theme-background) / 0.5)
                  `,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <span className="text-4xl font-bold" style={{ color: 'hsl(var(--theme-primary))' }}>{principle.number}</span>
                <h3 className="text-xl font-bold mt-4 mb-3" style={{ color: 'hsl(var(--theme-foreground))' }}>{principle.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shapes Section */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-8">
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
          >
            Soft Shapes
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {shapes.map((shape, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-3xl flex flex-col items-center justify-center"
                style={{
                  backgroundColor: 'hsl(var(--theme-card))',
                  boxShadow: `6px 6px 0 hsl(var(--theme-border))`,
                  width: 150,
                  height: 150,
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <shape.icon className="w-12 h-12 mb-3" style={{ color: 'hsl(var(--theme-primary))' }} />
                <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>{shape.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div
            className="p-12 rounded-3xl text-center"
            style={{
              backgroundColor: 'hsl(var(--theme-card))',
              boxShadow: `8px 8px 0 hsl(var(--theme-border))`,
            }}
            whileHover={{ y: -5 }}
          >
            <p
              className="text-2xl md:text-3xl font-medium leading-relaxed mb-6"
              style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
            >
              &ldquo;Design is not just what it looks like and feels like. Design is how it works.&rdquo;
            </p>
            <cite className="text-sm not-italic font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              - Steve Jobs
            </cite>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t relative" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-5xl mx-auto px-8 text-center">
          <h2
            className="text-3xl font-bold mb-8"
            style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
          >
            Keep Exploring
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/design"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: 'hsl(var(--theme-primary))',
                color: 'hsl(var(--theme-primary-foreground))',
                boxShadow: '6px 6px 0 hsl(var(--theme-border))',
              }}
            >
              View Gallery
            </Link>
            <Link
              href="/design/pastel-dreams"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: 'hsl(var(--theme-card))',
                color: 'hsl(var(--theme-foreground))',
                boxShadow: '6px 6px 0 hsl(var(--theme-border))',
              }}
            >
              Pastel Dreams
            </Link>
          </div>
        </div>
      </section>

      {/* Theme Timepiece */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-medium mb-4 text-center" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Theme Timepiece
          </h2>
          <p className="text-center mb-8 text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            A watch face generated from this theme&apos;s soft clay palette.
          </p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t relative" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-5xl mx-auto px-8 flex justify-between items-center">
          <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Claymorphism</p>
          <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>OpenClaw-OS</p>
        </div>
      </footer>
    </div>
  );
}
