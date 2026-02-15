'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Lightbulb, Quote, Loader2, ArrowRight } from 'lucide-react';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import { ResearchChart } from '@/components/design/ChartShowcase';
import '@/lib/themes/themes.css';

interface ThesisResult {
  thesis: string;
  angle: string;
  supporting: string[];
  field: string;
}

function ThesisSharpener() {
  const [result, setResult] = useState<ThesisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');

  const topics = ['technology & society', 'human behavior', 'design psychology', 'future of work', 'creativity'];

  const sharpen = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'thesis-statement', prompt: topic || 'an interesting academic topic' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setResult({
          thesis: data.thesis || 'Technology shapes human behavior as much as human behavior shapes technology.',
          angle: data.angle || 'causal bidirectionality',
          supporting: data.supporting || ['Historical evidence', 'Contemporary case studies', 'Theoretical frameworks'],
          field: data.field || 'Technology Studies',
        });
      }
    } catch {
      setResult({
        thesis: 'The most impactful design is that which becomes invisible through intuitive use.',
        angle: 'invisibility as success metric',
        supporting: ['User behavior analysis', 'Cognitive load research', 'Interface evolution'],
        field: 'Design Theory',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, topic]);

  return (
    <div className="w-full border overflow-hidden" style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsl(var(--theme-card))', height: '440px' }}>
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="flex items-center gap-3">
          <Lightbulb className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm tracking-wide" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>Thesis Sharpener</span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>AI Research Tool</span>
      </div>

      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 57px)' }}>
        <div className="mb-5">
          <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Select domain</p>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button key={t} onClick={() => setTopic(t)} className="px-3 py-1.5 text-xs transition-all" style={{ backgroundColor: topic === t ? 'hsl(var(--theme-primary))' : 'transparent', color: topic === t ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))', border: `1px solid ${topic === t ? 'transparent' : 'hsl(var(--theme-border))'}` }}>{t}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin" style={{ color: 'hsl(var(--theme-primary))' }} />
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Formulating thesis...</p>
              </motion.div>
            ) : result ? (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-left w-full">
                <div className="flex items-start gap-3 mb-4">
                  <Quote className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <p className="text-base leading-relaxed italic" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>&ldquo;{result.thesis}&rdquo;</p>
                </div>
                <div className="pl-7 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Angle:</span>
                    <span className="text-xs px-2 py-0.5" style={{ backgroundColor: 'hsla(var(--theme-primary) / 0.15)', color: 'hsl(var(--theme-primary))' }}>{result.angle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Field:</span>
                    <span className="text-xs" style={{ color: 'hsl(var(--theme-foreground))' }}>{result.field}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Supporting evidence:</span>
                    <div className="flex flex-wrap gap-1">
                      {result.supporting.map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 border" style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-muted-foreground))' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <BookOpen className="w-10 h-10 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))', opacity: 0.4 }} />
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Select a domain and sharpen your thesis</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={sharpen} disabled={loading} className="w-full py-3 text-sm tracking-wide transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2" style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Lightbulb className="w-4 h-4" />{result ? 'Refine Again' : 'Generate Thesis'}<ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}

export default function ResearchDesignPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const watchDNA = useMemo(() => themeToWatch('research'), []);

  return (
    <div ref={containerRef} data-design-theme="research" className="min-h-screen relative" style={{ backgroundColor: 'hsl(var(--theme-background))', fontFamily: 'var(--theme-font)' }}>
      <motion.div className="fixed top-14 left-0 right-0 h-[2px] z-40 origin-left" style={{ scaleX: scrollYProgress, backgroundColor: 'hsl(var(--theme-primary))' }} />

      <DesignHeader currentTheme="research" backHref="/design" backText="Gallery" rightContent={<span className="text-xs tracking-wide uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Design Psychology</span>} />

      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center pt-16">
        <div className="max-w-4xl mx-auto px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-sm uppercase tracking-widest mb-6" style={{ color: 'hsl(var(--theme-primary))' }}>A Study in Clarity</p>
            <h1 className="text-5xl md:text-7xl font-normal leading-tight mb-8" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>The Research<br />Aesthetic</h1>
            <p className="text-xl leading-relaxed max-w-2xl mb-12" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Why clean, academic design creates trust, reduces cognitive load, and allows ideas to speak without interference. An exploration of the psychology behind scholarly visual language.</p>
            <div className="border-t pt-8" style={{ borderColor: 'hsl(var(--theme-border))' }}>
              <div className="grid grid-cols-3 gap-8 text-center">
                <div><p className="text-3xl font-light mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>47%</p><p className="text-xs uppercase tracking-wide" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Faster Reading</p></div>
                <div><p className="text-3xl font-light mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>2.3x</p><p className="text-xs uppercase tracking-wide" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Higher Trust</p></div>
                <div><p className="text-3xl font-light mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>0</p><p className="text-xs uppercase tracking-wide" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Distractions</p></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-lg mx-auto px-8">
          <h2 className="text-2xl font-normal mb-4" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>AI Thesis Sharpener</h2>
          <p className="text-sm mb-8" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Transform rough ideas into refined academic arguments with supporting frameworks.</p>
          <ThesisSharpener />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-lg mx-auto px-8">
          <h2 className="text-2xl font-normal mb-4" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>Research Impact</h2>
          <p className="text-sm mb-8" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Tracking scholarship influence through measured citation growth over time.</p>
          <ResearchChart />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-normal mb-16" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>Core Principles</h2>
          <div className="space-y-16">
            {principles.map((principle, index) => (
              <PrincipleSection key={principle.id} principle={principle} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <blockquote className="border-l-2 pl-8 py-4" style={{ borderColor: 'hsl(var(--theme-primary))' }}>
            <p className="text-2xl md:text-3xl font-light leading-relaxed mb-6" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>&ldquo;The goal of typography is to communicate. The moment typography calls attention to itself is the moment communication begins to break down.&rdquo;</p>
            <cite className="text-sm not-italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>- Robert Bringhurst, The Elements of Typographic Style</cite>
          </blockquote>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-normal mb-8" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>The Psychology at Work</h2>
          <p className="text-lg leading-relaxed mb-12" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Research design leverages well-documented cognitive principles to optimize information absorption and credibility perception.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {psychologyPrinciples.map((item, index) => (
              <div key={index} className="p-6 border" style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsl(var(--theme-card))' }}>
                <h3 className="text-lg font-medium mb-3" style={{ color: 'hsl(var(--theme-foreground))' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-normal mb-8" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>Continue Exploring</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/design" className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm transition-all hover:opacity-80" style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}>View Theme Gallery</Link>
            <Link href="/design/utilitarian" className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm border transition-all hover:opacity-80" style={{ borderColor: 'hsl(var(--theme-foreground))', color: 'hsl(var(--theme-foreground))' }}>Explore Utilitarian Design</Link>
          </div>
        </div>
      </section>

      {/* Theme Timepiece */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-normal mb-4 text-center" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>
            Theme Timepiece
          </h2>
          <p className="text-center mb-8 text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            A watch face generated from this theme&apos;s scholarly aesthetic.
          </p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      <footer className="py-8 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 flex justify-between items-center">
          <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Research Design System</p>
          <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>OpenClaw-OS</p>
        </div>
      </footer>
    </div>
  );
}

interface Principle {
  id: string;
  number: string;
  title: string;
  description: string;
  insight: string;
}

const principles: Principle[] = [
  { id: 'whitespace', number: '01', title: 'Generous Whitespace', description: 'Academic papers have always understood what digital design forgot: the margins matter as much as the content. Wide margins create breathing room, reduce eye strain, and signal that the author respects the reader\'s attention.', insight: 'Research shows that optimal line length (45-75 characters) and generous margins can improve reading speed by up to 47%.' },
  { id: 'typography', number: '02', title: 'Serif Typography', description: 'Serif fonts carry centuries of scholarly authority. The subtle feet on each letter guide the eye smoothly across lines, reducing fatigue during extended reading. They signal seriousness and intellectual rigor without shouting.', insight: 'Studies demonstrate that serif fonts in print (and increasingly on high-resolution screens) improve readability and perceived credibility.' },
  { id: 'hierarchy', number: '03', title: 'Clear Hierarchy', description: 'Every element knows its place. Headings, body text, and captions each have distinct but harmonious treatments. This visual grammar helps readers navigate complex information effortlessly.', insight: 'Well-established typographic hierarchy reduces cognitive load by providing clear entry points and scanning paths.' },
  { id: 'restraint', number: '04', title: 'Chromatic Restraint', description: 'The near-absence of color is itself a choice. Black on white achieves maximum contrast while eliminating the emotional noise of hue. The single accent color (a scholarly blue) appears only when absolutely necessary.', insight: 'Limiting color to functional use increases its impact and helps maintain focus on content over decoration.' },
  { id: 'alignment', number: '05', title: 'Perfect Alignment', description: 'Every element aligns to an invisible grid. This creates harmony the eye feels but doesn\'t consciously notice. Misalignment, even by a few pixels, creates subconscious unease that undermines trust.', insight: 'Alignment activates our pattern-recognition instincts, signaling order and competence.' },
  { id: 'density', number: '06', title: 'Considered Density', description: 'Neither cramped nor wasteful. Each paragraph contains enough information to be substantial, but not so much that it overwhelms. The rhythm of text and space creates a sustainable reading pace.', insight: 'Proper information density respects both the reader\'s time and their cognitive limits.' },
];

const psychologyPrinciples = [
  { title: 'Cognitive Fluency', description: 'When information is easy to process, we perceive it as more true and trustworthy. Clean design reduces processing friction, making content feel more credible.' },
  { title: 'Authority Signaling', description: 'Academic aesthetics trigger learned associations with expertise, peer review, and intellectual rigor. These signals transfer to any content presented in this style.' },
  { title: 'Attention Conservation', description: 'By eliminating decorative elements, all cognitive resources go toward comprehension. Nothing competes with the ideas themselves.' },
  { title: 'Temporal Transcendence', description: 'Research design avoids trends, creating a timeless quality that suggests the content itself will remain relevant. Fashionable design implies fashionable (temporary) ideas.' },
];

function PrincipleSection({ principle, index }: { principle: Principle; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <motion.div ref={ref} style={{ opacity }} className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-2"><span className="text-4xl font-light" style={{ color: 'hsl(var(--theme-primary))' }}>{principle.number}</span></div>
      <div className="md:col-span-10">
        <h3 className="text-2xl font-normal mb-4" style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}>{principle.title}</h3>
        <p className="text-base leading-relaxed mb-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{principle.description}</p>
        <p className="text-sm italic border-l-2 pl-4" style={{ color: 'hsl(var(--theme-primary))', borderColor: 'hsl(var(--theme-border))' }}>{principle.insight}</p>
      </div>
    </motion.div>
  );
}
