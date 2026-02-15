'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Target, Scan, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import { UtilitarianChart } from '@/components/design/ChartShowcase';
import '@/lib/themes/themes.css';

interface AuditResult {
  score: number;
  verdict: string;
  strengths: string[];
  issues: string[];
  recommendation: string;
}

function DesignAudit() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState('');

  const focuses = ['typography', 'whitespace', 'hierarchy', 'color', 'alignment'];

  const runAudit = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'design-critique', prompt: focus || 'general design' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setResult({
          score: data.score || 78,
          verdict: data.verdict || 'FUNCTIONAL',
          strengths: data.strengths || ['Clear structure', 'Consistent spacing'],
          issues: data.issues || ['Could reduce color palette'],
          recommendation: data.recommendation || 'Focus on removing one decorative element.',
        });
      }
    } catch {
      setResult({
        score: 82,
        verdict: 'ACCEPTABLE',
        strengths: ['Strong grid foundation', 'Typography discipline'],
        issues: ['Minor alignment inconsistency'],
        recommendation: 'Audit every element. If it has no function, remove it.',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, focus]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'hsl(var(--theme-primary))';
    if (score >= 70) return 'hsl(var(--theme-foreground))';
    return 'hsl(var(--theme-muted-foreground))';
  };

  return (
    <div className="w-full border overflow-hidden" style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsl(var(--theme-card))', height: '460px' }}>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="flex items-center gap-3">
          <Scan className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'hsl(var(--theme-foreground))' }}>Design Audit</span>
        </div>
        <span className="text-[10px] font-mono" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>UTL-AUDIT-001</span>
      </div>

      <div className="flex flex-col p-5" style={{ height: 'calc(100% - 45px)' }}>
        <div className="mb-4">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Audit Focus</p>
          <div className="flex flex-wrap gap-2">
            {focuses.map((f) => (
              <button key={f} onClick={() => setFocus(f)} className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all" style={{ backgroundColor: focus === f ? 'hsl(var(--theme-primary))' : 'transparent', color: focus === f ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))', border: `1px solid ${focus === f ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-border))'}` }}>{f}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                  <Scan className="w-8 h-8 mx-auto mb-3" style={{ color: 'hsl(var(--theme-primary))' }} />
                </motion.div>
                <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Analyzing design...</p>
              </motion.div>
            ) : result ? (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-5xl font-black" style={{ color: getScoreColor(result.score) }}>{result.score}</p>
                    <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Score /100</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black tracking-tight" style={{ color: 'hsl(var(--theme-foreground))' }}>{result.verdict}</p>
                    <p className="text-[10px] font-mono" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>STATUS</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border" style={{ borderColor: 'hsl(var(--theme-border))' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-3 h-3" style={{ color: 'hsl(var(--theme-primary))' }} />
                      <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: 'hsl(var(--theme-primary))' }}>Strengths</span>
                    </div>
                    {result.strengths.map((s, i) => (
                      <p key={i} className="text-[10px] mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>+ {s}</p>
                    ))}
                  </div>
                  <div className="p-3 border" style={{ borderColor: 'hsl(var(--theme-border))' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-3 h-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                      <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Issues</span>
                    </div>
                    {result.issues.map((s, i) => (
                      <p key={i} className="text-[10px] mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>- {s}</p>
                    ))}
                  </div>
                </div>

                <div className="p-3 border-l-2" style={{ borderColor: 'hsl(var(--theme-primary))', backgroundColor: 'hsla(var(--theme-primary) / 0.05)' }}>
                  <p className="text-[10px] font-bold tracking-wider uppercase mb-1" style={{ color: 'hsl(var(--theme-primary))' }}>Recommendation</p>
                  <p className="text-xs" style={{ color: 'hsl(var(--theme-foreground))' }}>{result.recommendation}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <Target className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))', opacity: 0.3 }} />
                <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Select focus area to begin audit</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={runAudit} disabled={loading} className="w-full py-3 text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2" style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Scan className="w-4 h-4" /><span className="opacity-50">[</span>{result ? 'Re-Audit' : 'Run Audit'}<span className="opacity-50">]</span></>}
        </button>
      </div>
    </div>
  );
}

export default function UtilitarianDesignPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const watchDNA = useMemo(() => themeToWatch('utilitarian'), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={containerRef} data-design-theme="utilitarian" className="min-h-screen relative" style={{ backgroundColor: 'hsl(var(--theme-background))', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.08]" style={{ backgroundImage: `linear-gradient(hsl(var(--theme-border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--theme-border)) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <motion.div className="fixed top-14 left-0 right-0 h-[2px] z-40 origin-left" style={{ scaleX: scrollYProgress, backgroundColor: 'hsl(var(--theme-primary))' }} />

      <DesignHeader currentTheme="utilitarian" backHref="/design" backText="Back" rightContent={<span className="font-mono text-xs" style={{ color: 'hsl(var(--theme-foreground))' }}>{currentTime}</span>} />

      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Design Principles</p>
              <p className="text-[10px] font-mono" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>DOCUMENT ID: UTL-001</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Classification</p>
              <p className="text-[10px] font-mono" style={{ color: 'hsl(var(--theme-primary))' }}>OPEN SOURCE</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.85] mb-8" style={{ color: 'hsl(var(--theme-foreground))' }}>Utilitarian<br />Design <span style={{ color: 'hsl(var(--theme-primary))' }}>®</span></h1>
              <p className="text-lg md:text-xl max-w-xl leading-relaxed mb-8" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>A function-first approach to visual design. Every element serves a purpose. Nothing exists for decoration alone.</p>
              <Link href="#principles" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-wider uppercase transition-all hover:scale-105" style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}><span className="opacity-50">[</span>Read Principles<span className="opacity-50">]</span></Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-8 py-8 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
            <div><p className="text-4xl md:text-5xl font-black mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>08</p><p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Core Principles</p></div>
            <div><p className="text-4xl md:text-5xl font-black mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>90%</p><p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Typography Focus</p></div>
            <div><p className="text-4xl md:text-5xl font-black mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>0</p><p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Decorations</p></div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-lg mx-auto px-6">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-black tracking-tight" style={{ color: 'hsl(var(--theme-foreground))' }}>AI Design Audit</h2>
            <span className="text-[10px] font-mono" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>TOOL</span>
          </div>
          <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Evaluate design choices against utilitarian principles. No sentiment. Just function.</p>
          <DesignAudit />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-lg mx-auto px-6">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-black tracking-tight" style={{ color: 'hsl(var(--theme-foreground))' }}>Audit Metrics</h2>
            <span className="text-[10px] font-mono" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>DATA</span>
          </div>
          <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Quantified assessment across functional categories. Numbers over opinions.</p>
          <UtilitarianChart />
        </div>
      </section>

      <section id="principles" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16 pb-4 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Section 01</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: 'hsl(var(--theme-foreground))' }}>Core Principles</h2>
            </div>
            <p className="text-[10px] font-mono" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>8 ITEMS</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: 'hsl(var(--theme-border))' }}>
            {principles.map((principle, index) => (
              <PrincipleCard key={principle.id} principle={principle} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border-l-4 pl-8 py-4" style={{ borderColor: 'hsl(var(--theme-primary))' }}>
            <blockquote className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>&ldquo;Good design is as little design as possible.&rdquo;</blockquote>
            <cite className="text-sm font-bold tracking-wider uppercase not-italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>- Dieter Rams</cite>
          </div>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Continue Exploration</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8" style={{ color: 'hsl(var(--theme-foreground))' }}>See More Themes</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/design" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold tracking-wider uppercase transition-all hover:scale-105" style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}><span className="opacity-50">[</span>Theme Gallery<span className="opacity-50">]</span></Link>
            <Link href="/story" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold tracking-wider uppercase border-2 transition-all hover:scale-105" style={{ borderColor: 'hsl(var(--theme-foreground))', color: 'hsl(var(--theme-foreground))' }}>View Story Page</Link>
          </div>
        </div>
      </section>

      {/* Theme Timepiece */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2 text-center" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Section 03</p>
          <h2 className="text-2xl font-black tracking-tight mb-4 text-center" style={{ color: 'hsl(var(--theme-foreground))' }}>Theme Timepiece</h2>
          <p className="text-center mb-8 text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            A watch face generated from this theme&apos;s utilitarian palette.
          </p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      <footer className="py-8 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <p className="text-[10px] font-mono" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>DOCUMENT: UTL-001 / DESIGN SYSTEM</p>
          <p className="text-[10px] font-mono" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>© 2026 OPENCLAW-OS</p>
        </div>
      </footer>
    </div>
  );
}

interface Principle {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

const principles: Principle[] = [
  { id: 'purpose', number: '01', title: 'Purpose Over Decoration', subtitle: 'Every element earns its place', description: 'Nothing exists purely for aesthetics. Each visual element must serve a functional purpose: guiding attention, conveying information, or enabling interaction.' },
  { id: 'whitespace', number: '02', title: 'Whitespace as Tool', subtitle: 'Empty space is not wasted space', description: 'Negative space creates focus, establishes hierarchy, and provides cognitive rest. Generous margins prevent visual chaos and anchor attention on content.' },
  { id: 'typography', number: '03', title: 'Typography First', subtitle: '90% of design is typography', description: 'Type does the heavy lifting. Size, weight, and spacing create hierarchy without ornament. Limit to 2-3 sizes. Let words speak.' },
  { id: 'grid', number: '04', title: 'Grid Systems', subtitle: 'Invisible structure creates harmony', description: 'Consistent alignment reduces cognitive load. When everything follows a system, placement decisions become automatic. The grid answers before you ask.' },
  { id: 'color', number: '05', title: 'Color Restraint', subtitle: 'Limit colors, maximize meaning', description: 'Three color roles maximum. Background, text, accent. When everything is colorful, nothing stands out. Restriction creates significance.' },
  { id: 'content', number: '06', title: 'Content First', subtitle: 'Design serves the message', description: 'Start with what you need to say. Design around it. If the design cannot adapt to real content, the design is wrong. Lorem ipsum is the enemy.' },
  { id: 'disclosure', number: '07', title: 'Progressive Disclosure', subtitle: 'Reveal complexity gradually', description: 'Show only what is needed, when it is needed. Respect attention. Trust users to ask for more when ready.' },
  { id: 'invisible', number: '08', title: 'Invisible Design', subtitle: 'The best design disappears', description: 'The highest compliment: users accomplish goals without noticing the interface. Design succeeds when it becomes transparent.' },
];

function PrincipleCard({ principle, index }: { principle: Principle; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <motion.div ref={ref} style={{ opacity, backgroundColor: 'hsl(var(--theme-card))' }} className="p-8 md:p-12">
      <div className="flex items-start justify-between mb-6">
        <span className="text-5xl md:text-6xl font-black" style={{ color: 'hsl(var(--theme-primary))' }}>{principle.number}</span>
        <span className="text-[10px] font-mono" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>PRINCIPLE</span>
      </div>
      <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>{principle.title}</h3>
      <p className="text-sm font-bold tracking-wider uppercase mb-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{principle.subtitle}</p>
      <p className="text-base leading-relaxed" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{principle.description}</p>
    </motion.div>
  );
}
