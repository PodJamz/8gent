'use client';

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Server, Shield, Zap, Database, Loader2, Activity } from 'lucide-react';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import '@/lib/themes/themes.css';

interface SystemStatus {
  status: string;
  metric: string;
  value: string;
  message: string;
  emoji: string;
}

function SystemDashboard() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [diagnosticCount, setDiagnosticCount] = useState(0);
  const [pulseActive, setPulseActive] = useState(false);

  const runDiagnostic = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setPulseActive(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'system-oracle',
          prompt: 'Run full system diagnostic',
        }),
      });

      if (!response.ok) throw new Error('Failed');

      const data = await response.json();
      if (!data.error) {
        setStatus({
          status: data.status || 'OPTIMAL',
          metric: data.metric || 'System Health',
          value: data.value || '99.9%',
          message: data.message || 'All systems nominal. Ship with confidence.',
          emoji: data.emoji || '🚀',
        });
        setDiagnosticCount((prev) => prev + 1);
      }
    } catch {
      setStatus({
        status: 'NOMINAL',
        metric: 'Uptime Score',
        value: '99.7%',
        message: 'Systems stable. Ready for deployment.',
        emoji: '⚡',
      });
      setDiagnosticCount((prev) => prev + 1);
    } finally {
      setLoading(false);
      setTimeout(() => setPulseActive(false), 1000);
    }
  }, [loading]);

  // Auto-run on mount for that dashboard feel
  useEffect(() => {
    runDiagnostic();
  }, []);

  return (
    <div
      className="w-full border overflow-hidden font-mono"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '420px',
      }}
    >
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: status ? 'hsl(142, 76%, 36%)' : 'hsl(var(--theme-muted-foreground))' }}
            animate={pulseActive ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 0.5 }}
          />
          <span className="text-[10px] uppercase tracking-widest" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            SYSTEM MONITOR
          </span>
        </div>
        <span className="text-[10px]" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          DIAG #{String(diagnosticCount).padStart(3, '0')}
        </span>
      </div>

      {/* Main display */}
      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 45px)' }}>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <Activity
                className="w-8 h-8 mb-4"
                style={{ color: 'hsl(var(--theme-primary))' }}
              />
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  RUNNING DIAGNOSTICS
                </span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ...
                </motion.span>
              </div>
            </motion.div>
          ) : status ? (
            <motion.div
              key="status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Status badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 self-start"
                style={{
                  backgroundColor: 'hsla(142, 76%, 36%, 0.15)',
                  border: '1px solid hsla(142, 76%, 36%, 0.3)',
                }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <span className="text-xs font-bold tracking-widest" style={{ color: 'hsl(142, 76%, 36%)' }}>
                  {status.status}
                </span>
              </motion.div>

              {/* Main metric */}
              <div className="flex-1 flex flex-col justify-center">
                <motion.span
                  className="text-5xl mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                >
                  {status.emoji}
                </motion.span>
                <motion.p
                  className="text-4xl font-bold tracking-tight mb-1"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {status.value}
                </motion.p>
                <motion.p
                  className="text-xs uppercase tracking-widest mb-4"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {status.metric}
                </motion.p>
                <motion.p
                  className="text-sm"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {status.message}
                </motion.p>
              </div>

              {/* Mini stats */}
              <motion.div
                className="grid grid-cols-3 gap-4 pt-4 border-t"
                style={{ borderColor: 'hsl(var(--theme-border))' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-center">
                  <p className="text-lg font-bold" style={{ color: 'hsl(var(--theme-foreground))' }}>0ms</p>
                  <p className="text-[10px] uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Latency</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold" style={{ color: 'hsl(var(--theme-foreground))' }}>100%</p>
                  <p className="text-[10px] uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Coverage</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold" style={{ color: 'hsl(var(--theme-foreground))' }}>∞</p>
                  <p className="text-[10px] uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Scale</p>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Run button */}
        <button
          onClick={runDiagnostic}
          disabled={loading}
          className="w-full py-3 text-xs font-bold uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          style={{
            backgroundColor: 'hsl(var(--theme-primary))',
            color: 'hsl(var(--theme-primary-foreground))',
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              SCANNING
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              RUN DIAGNOSTIC
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function BoldTechPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const watchDNA = useMemo(() => themeToWatch('bold-tech'), []);

  return (
    <div
      ref={containerRef}
      data-design-theme="bold-tech"
      className="min-h-screen relative"
      style={{ backgroundColor: 'hsl(var(--theme-background))', fontFamily: 'var(--theme-font)' }}
    >
      <motion.div
        className="fixed top-14 left-0 right-0 h-[2px] z-40 origin-left"
        style={{ scaleX: scrollYProgress, backgroundColor: 'hsl(var(--theme-primary))' }}
      />

      <DesignHeader
        currentTheme="bold-tech"
        backHref="/design"
        backText="Gallery"
        rightContent={
          <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Enterprise
          </span>
        }
      />

      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center pt-16">
        <div className="max-w-5xl mx-auto px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Server className="w-10 h-10 mb-6" style={{ color: 'hsl(var(--theme-primary))' }} />
            <h1
              className="text-5xl md:text-7xl font-bold leading-tight mb-8 tracking-tight uppercase"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              Built for Scale
            </h1>
            <p
              className="text-xl leading-relaxed max-w-2xl mb-12 font-mono"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Enterprise-grade aesthetics. Bold Tech combines the reliability of monospace with the confidence of bold typography. 99.9% uptime in visual form. Ship it.
            </p>
            <div className="grid grid-cols-3 gap-8 border-t pt-8" style={{ borderColor: 'hsl(var(--theme-border))' }}>
              <div>
                <p className="text-3xl font-bold font-mono mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>99.9%</p>
                <p className="text-xs font-mono uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Uptime</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-mono mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>JetBrains</p>
                <p className="text-xs font-mono uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Mono</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-mono mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>∞</p>
                <p className="text-xs font-mono uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Scale</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* System Dashboard */}
      <section className="py-24">
        <div className="max-w-lg mx-auto px-8">
          <h2 className="text-xl font-bold font-mono uppercase mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>
            AI System Monitor
          </h2>
          <p className="text-sm font-mono mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Real-time diagnostics. Deploy with confidence.
          </p>
          <SystemDashboard />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-2xl font-bold uppercase mb-12 font-mono" style={{ color: 'hsl(var(--theme-foreground))' }}>
            System Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Server, title: 'Infrastructure First', desc: 'Design that scales from prototype to production without refactoring.' },
              { icon: Shield, title: 'Security Baked In', desc: 'Visual language that communicates trust and reliability.' },
              { icon: Zap, title: 'Performance Focused', desc: 'Clean, efficient design that loads fast and runs smooth.' },
              { icon: Database, title: 'Data-Driven', desc: 'Typography and layout optimized for dashboards and metrics.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-6 border"
                style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsl(var(--theme-card))' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <item.icon className="w-6 h-6 mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                <h3 className="text-lg font-bold font-mono uppercase mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>
                  {item.title}
                </h3>
                <p className="text-sm font-mono" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <blockquote className="border-l-2 pl-8 font-mono" style={{ borderColor: 'hsl(var(--theme-primary))' }}>
            <p className="text-xl leading-relaxed mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
              &ldquo;Move fast and ship things.&rdquo;
            </p>
            <cite className="text-sm not-italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              - Engineering Philosophy
            </cite>
          </blockquote>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-5xl mx-auto px-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/design"
              className="px-8 py-3 text-sm font-mono uppercase transition-all hover:opacity-80"
              style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}
            >
              Theme Gallery
            </Link>
            <Link
              href="/design/vercel"
              className="px-8 py-3 text-sm font-mono uppercase border transition-all hover:opacity-80"
              style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-foreground))' }}
            >
              Vercel
            </Link>
          </div>
        </div>
      </section>

      {/* Theme Timepiece */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-xl font-bold font-mono uppercase mb-4 text-center" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Theme Timepiece
          </h2>
          <p className="text-center mb-8 text-sm font-mono" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            A watch face generated from this theme&apos;s tech palette.
          </p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      <footer className="py-8 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-5xl mx-auto px-8 flex justify-between items-center">
          <p className="text-xs font-mono uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Bold Tech</p>
          <p className="text-xs font-mono uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>OpenClaw-OS</p>
        </div>
      </footer>
    </div>
  );
}
