'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Zap, Square, Bold, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import '@/lib/themes/themes.css';

// AI-Powered Bold Statement Generator - Raw, unapologetic design manifesto
interface BoldStatement {
  statement: string;
  subtext: string;
}

function BoldStatementGenerator() {
  const [statement, setStatement] = useState<BoldStatement | null>(null);
  const [loading, setLoading] = useState(false);
  const [impactCount, setImpactCount] = useState(0);

  const generateStatement = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setStatement(null);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'brutalist-quote',
          prompt: 'Give me a bold, raw design statement.',
        }),
      });

      if (!response.ok) throw new Error('Failed');

      const data = await response.json();
      if (!data.error) {
        setStatement({
          statement: data.statement || 'DESIGN IS NOT DECORATION',
          subtext: data.subtext || 'it is communication at its rawest',
        });
        setImpactCount((prev) => prev + 1);
      }
    } catch (err) {
      setStatement({
        statement: 'BOLD OR GO HOME',
        subtext: 'there is no middle ground',
      });
      setImpactCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return (
    <div
      className="w-full border-4 overflow-hidden relative"
      style={{
        borderColor: 'hsl(var(--theme-foreground))',
        backgroundColor: 'hsl(var(--theme-card))',
        boxShadow: '8px 8px 0 hsl(var(--theme-foreground))',
        height: '400px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b-4"
        style={{ borderColor: 'hsl(var(--theme-foreground))' }}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5" strokeWidth={3} style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-black uppercase tracking-wider" style={{ color: 'hsl(var(--theme-foreground))' }}>
            AI STATEMENT GEN
          </span>
        </div>
        <div
          className="px-2 py-1 text-xs font-black uppercase"
          style={{
            backgroundColor: 'hsl(var(--theme-primary))',
            color: 'hsl(var(--theme-primary-foreground))',
          }}
        >
          {impactCount} GENERATED
        </div>
      </div>

      {/* Content */}
      <div
        className="flex flex-col items-center justify-center p-6"
        style={{ height: 'calc(100% - 68px)' }}
      >
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
                animate={{
                  rotate: [0, 90, 180, 270, 360],
                  scale: [1, 1.2, 1, 1.2, 1],
                }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <Square className="w-16 h-16" strokeWidth={4} style={{ color: 'hsl(var(--theme-primary))' }} />
              </motion.div>
              <p className="mt-4 text-sm font-black uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                GENERATING IMPACT...
              </p>
            </motion.div>
          ) : statement ? (
            <motion.div
              key="statement"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 15 }}
              className="text-center w-full"
            >
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', damping: 12 }}
              >
                <p
                  className="text-2xl md:text-3xl font-black uppercase leading-tight mb-4 px-4"
                  style={{
                    color: 'hsl(var(--theme-foreground))',
                    textShadow: '3px 3px 0 hsl(var(--theme-accent))',
                  }}
                >
                  {statement.statement}
                </p>
              </motion.div>
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 12 }}
                className="inline-block px-4 py-2 border-2"
                style={{
                  borderColor: 'hsl(var(--theme-foreground))',
                  backgroundColor: 'hsl(var(--theme-background))',
                }}
              >
                <p
                  className="text-sm font-bold"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {statement.subtext}
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <AlertTriangle
                className="w-16 h-16 mx-auto mb-4"
                strokeWidth={3}
                style={{ color: 'hsl(var(--theme-primary))' }}
              />
              <p
                className="text-lg font-black uppercase"
                style={{ color: 'hsl(var(--theme-foreground))' }}
              >
                READY FOR IMPACT?
              </p>
              <p
                className="text-xs font-bold mt-2"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                Generate a bold AI-powered design statement
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Button */}
        <motion.button
          onClick={generateStatement}
          disabled={loading}
          className="mt-6 px-8 py-4 text-sm font-black uppercase border-4 transition-all disabled:opacity-50"
          style={{
            borderColor: 'hsl(var(--theme-foreground))',
            backgroundColor: loading ? 'hsl(var(--theme-card))' : 'hsl(var(--theme-primary))',
            color: loading ? 'hsl(var(--theme-foreground))' : 'hsl(var(--theme-primary-foreground))',
            boxShadow: '4px 4px 0 hsl(var(--theme-foreground))',
          }}
          whileHover={{ x: -2, y: -2, boxShadow: '6px 6px 0 hsl(var(--theme-foreground))' }}
          whileTap={{ x: 2, y: 2, boxShadow: '2px 2px 0 hsl(var(--theme-foreground))' }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              GENERATING
            </span>
          ) : statement ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              HIT ME AGAIN
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              GENERATE STATEMENT
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
}

export default function NeoBrutalismPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const watchDNA = useMemo(() => themeToWatch('neo-brutalism'), []);

  return (
    <div
      ref={containerRef}
      data-design-theme="neo-brutalism"
      className="min-h-screen relative"
      style={{
        backgroundColor: 'hsl(var(--theme-background))',
        fontFamily: 'var(--theme-font)',
      }}
    >
      {/* Progress indicator */}
      <motion.div
        className="fixed top-14 left-0 right-0 h-[4px] z-40 origin-left"
        style={{
          scaleX: scrollYProgress,
          backgroundColor: 'hsl(var(--theme-primary))',
        }}
      />

      <DesignHeader
        currentTheme="neo-brutalism"
        backHref="/design"
        backText="BACK"
        showToolbar={true}
        themeLabel="Neo Brutalism"
        onReferenceToAI={(prompt) => { if (typeof window !== 'undefined') { sessionStorage.setItem('openclaw_theme_reference', prompt); sessionStorage.setItem('openclaw_theme_reference_timestamp', Date.now().toString()); } }}
        rightContent={
          <span
            className="text-xs font-black uppercase tracking-widest"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            BOLD DESIGN
          </span>
        }
      />

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center pt-16">
        <div className="max-w-6xl mx-auto px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="inline-block px-4 py-2 mb-8 border-4"
              style={{
                borderColor: 'hsl(var(--theme-foreground))',
                backgroundColor: 'hsl(var(--theme-primary))',
              }}
            >
              <p
                className="text-sm font-black uppercase tracking-widest"
                style={{ color: 'hsl(var(--theme-primary-foreground))' }}
              >
                NO COMPROMISES
              </p>
            </div>
            <h1
              className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-none mb-8"
              style={{
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
            >
              NEO<br />
              BRUTALISM
            </h1>
            <p
              className="text-xl md:text-2xl font-bold max-w-2xl mb-12 uppercase"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              RAW. UNAPOLOGETIC. POWERFUL. DESIGN THAT DEMANDS ATTENTION
              AND REFUSES TO BE IGNORED.
            </p>
            <div className="flex flex-wrap gap-4">
              <div
                className="px-6 py-4 border-4"
                style={{
                  borderColor: 'hsl(var(--theme-foreground))',
                  backgroundColor: 'hsl(var(--theme-card))',
                  boxShadow: '8px 8px 0 hsl(var(--theme-foreground))',
                }}
              >
                <p className="text-3xl font-black" style={{ color: 'hsl(var(--theme-foreground))' }}>100%</p>
                <p className="text-xs font-bold uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>CONTRAST</p>
              </div>
              <div
                className="px-6 py-4 border-4"
                style={{
                  borderColor: 'hsl(var(--theme-foreground))',
                  backgroundColor: 'hsl(var(--theme-card))',
                  boxShadow: '8px 8px 0 hsl(var(--theme-foreground))',
                }}
              >
                <p className="text-3xl font-black" style={{ color: 'hsl(var(--theme-foreground))' }}>SPACE</p>
                <p className="text-xs font-bold uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>GROTESK</p>
              </div>
              <div
                className="px-6 py-4 border-4"
                style={{
                  borderColor: 'hsl(var(--theme-foreground))',
                  backgroundColor: 'hsl(var(--theme-primary))',
                  boxShadow: '8px 8px 0 hsl(var(--theme-foreground))',
                }}
              >
                <p className="text-3xl font-black" style={{ color: 'hsl(var(--theme-primary-foreground))' }}>BOLD</p>
                <p className="text-xs font-bold uppercase" style={{ color: 'hsl(var(--theme-primary-foreground))' }}>ALWAYS</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Statement Generator */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-8">
          <div
            className="inline-block px-4 py-2 mb-8 border-4"
            style={{ borderColor: 'hsl(var(--theme-foreground))' }}
          >
            <h2
              className="text-xl font-black uppercase"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              AI STATEMENT MACHINE
            </h2>
          </div>
          <p
            className="text-base font-bold mb-8"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            GENERATE BOLD, RAW DESIGN STATEMENTS POWERED BY AI. EACH ONE HITS DIFFERENT.
          </p>
          <BoldStatementGenerator />
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div
            className="inline-block px-4 py-2 mb-12 border-4"
            style={{
              borderColor: 'hsl(var(--theme-foreground))',
            }}
          >
            <h2
              className="text-2xl font-black uppercase"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              CORE PRINCIPLES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                number: '01',
                title: 'MAXIMUM CONTRAST',
                description: 'Black and white are not suggestions. They are requirements. Shadows are solid, borders are thick, and nothing blends into the background.',
              },
              {
                number: '02',
                title: 'BOLD TYPOGRAPHY',
                description: 'Headlines scream. Body text commands. Every word carries weight because every weight is maximized.',
              },
              {
                number: '03',
                title: 'HARD SHADOWS',
                description: 'No gradients. No soft edges. Shadows are offset blocks of solid color that create depth through stark geometric contrast.',
              },
              {
                number: '04',
                title: 'PUNCHY COLORS',
                description: 'When color appears, it hits hard. Neon accents against monochrome. Primary colors at full saturation.',
              },
            ].map((principle, index) => (
              <motion.div
                key={principle.number}
                className="p-8 border-4"
                style={{
                  borderColor: 'hsl(var(--theme-foreground))',
                  backgroundColor: 'hsl(var(--theme-card))',
                  boxShadow: '8px 8px 0 hsl(var(--theme-foreground))',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  x: -4,
                  y: -4,
                  boxShadow: '12px 12px 0 hsl(var(--theme-foreground))',
                }}
              >
                <span
                  className="text-6xl font-black"
                  style={{ color: 'hsl(var(--theme-primary))' }}
                >
                  {principle.number}
                </span>
                <h3
                  className="text-xl font-black uppercase mt-4 mb-3"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  {principle.title}
                </h3>
                <p
                  className="text-sm font-bold"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div
            className="p-8 border-4"
            style={{
              borderColor: 'hsl(var(--theme-foreground))',
              backgroundColor: 'hsl(var(--theme-primary))',
              boxShadow: '12px 12px 0 hsl(var(--theme-foreground))',
            }}
          >
            <p
              className="text-3xl md:text-4xl font-black uppercase leading-tight mb-6"
              style={{ color: 'hsl(var(--theme-primary-foreground))' }}
            >
              &ldquo;MAKE IT BOLD. MAKE IT LOUD. MAKE IT IMPOSSIBLE TO IGNORE.&rdquo;
            </p>
            <p
              className="text-lg font-bold uppercase"
              style={{ color: 'hsl(var(--theme-primary-foreground))' }}
            >
              - THE BRUTALIST MANIFESTO
            </p>
          </div>
        </div>
      </section>

      {/* Elements Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-8">
          <h2
            className="text-3xl font-black uppercase mb-12"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            BRUTAL ELEMENTS
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Square, title: 'HARD EDGES' },
              { icon: Bold, title: 'THICK BORDERS' },
              { icon: Zap, title: 'HIGH ENERGY' },
              { icon: AlertTriangle, title: 'BOLD ACCENTS' },
            ].map((element, index) => (
              <motion.div
                key={index}
                className="p-6 border-4 text-center"
                style={{
                  borderColor: 'hsl(var(--theme-foreground))',
                  backgroundColor: 'hsl(var(--theme-card))',
                  boxShadow: '6px 6px 0 hsl(var(--theme-foreground))',
                }}
                whileHover={{
                  x: -4,
                  y: -4,
                  boxShadow: '10px 10px 0 hsl(var(--theme-foreground))',
                }}
              >
                <element.icon
                  className="w-10 h-10 mx-auto mb-4"
                  strokeWidth={3}
                  style={{ color: 'hsl(var(--theme-primary))' }}
                />
                <h3
                  className="text-sm font-black uppercase"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  {element.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-24 border-t-4"
        style={{ borderColor: 'hsl(var(--theme-foreground))' }}
      >
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2
            className="text-3xl font-black uppercase mb-8"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            EXPLORE MORE
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/design"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-black uppercase border-4 transition-all hover:-translate-x-1 hover:-translate-y-1"
              style={{
                borderColor: 'hsl(var(--theme-foreground))',
                backgroundColor: 'hsl(var(--theme-primary))',
                color: 'hsl(var(--theme-primary-foreground))',
                boxShadow: '6px 6px 0 hsl(var(--theme-foreground))',
              }}
            >
              THEME GALLERY
            </Link>
            <Link
              href="/design/cyberpunk"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-black uppercase border-4 transition-all hover:-translate-x-1 hover:-translate-y-1"
              style={{
                borderColor: 'hsl(var(--theme-foreground))',
                backgroundColor: 'hsl(var(--theme-card))',
                color: 'hsl(var(--theme-foreground))',
                boxShadow: '6px 6px 0 hsl(var(--theme-foreground))',
              }}
            >
              CYBERPUNK
            </Link>
          </div>
        </div>
      </section>

      {/* Theme Timepiece */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-bold uppercase mb-4 text-center" style={{ color: 'hsl(var(--theme-foreground))' }}>THEME TIMEPIECE</h2>
          <p className="text-center mb-8 text-sm font-bold uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>A WATCH FACE GENERATED FROM THIS THEME&apos;S RAW PALETTE</p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 border-t-4"
        style={{ borderColor: 'hsl(var(--theme-foreground))' }}
      >
        <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <p
            className="text-xs font-bold uppercase"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            NEO BRUTALISM
          </p>
          <p
            className="text-xs font-bold uppercase"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            OPENCLAW-OS
          </p>
        </div>
      </footer>
    </div>
  );
}
