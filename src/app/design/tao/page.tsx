'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import '@/lib/themes/themes.css';

export default function TaoDesignPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const [mounted, setMounted] = useState(false);
  const watchDNA = useMemo(() => themeToWatch('tao'), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      ref={containerRef}
      data-design-theme="tao"
      className="dark min-h-screen relative overflow-x-hidden"
      style={{
        backgroundColor: 'hsl(220 30% 8%)',
        fontFamily: '"Crimson Text", "EB Garamond", Georgia, serif',
      }}
    >
      {/* Flowing water background - subtle animated gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Deep water base */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(ellipse 150% 100% at 50% 100%, rgba(56, 125, 170, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse 80% 50% at 20% 50%, rgba(56, 125, 170, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse 80% 50% at 80% 30%, rgba(100, 150, 180, 0.06) 0%, transparent 50%)
            `,
          }}
        />
        {/* Subtle ripple lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" preserveAspectRatio="none">
          <pattern id="ripples" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q25 5 50 10 T100 10" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-blue-300" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#ripples)" />
        </svg>
      </div>

      {/* Ancient paper texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Flowing progress - like water flowing */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-px z-50 origin-left"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(90deg, transparent, rgba(100, 160, 200, 0.6), transparent)',
        }}
      />

      {/* Minimal header */}
      <header
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-sm"
        style={{
          backgroundColor: 'hsla(220, 30%, 8%, 0.7)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/design"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm tracking-wide">Return</span>
          </Link>
          <a
            href="https://way-iamai.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors tracking-widest uppercase"
          >
            way-iamai.vercel.app
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* Hero - The Still Pond */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-20 pb-12 relative">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24">

            {/* Left: Philosophy text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="max-w-md text-center lg:text-left order-2 lg:order-1"
            >
              {/* Chinese title */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-slate-600 text-sm tracking-[0.5em] mb-4"
              >
                道
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-6xl text-slate-200 tracking-wide mb-8"
                style={{ fontFamily: '"Crimson Text", Georgia, serif', fontWeight: 400 }}
              >
                Way
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-slate-500 text-lg leading-relaxed mb-6 italic"
              >
                &ldquo;The Tao that can be told is not the eternal Tao.&rdquo;
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-slate-500 text-base leading-relaxed mb-10"
              >
                A contemplative AI. Speak, and the still pond will reflect.
                Way does not optimize or persuade. It creates space for
                your own clarity to emerge.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <a
                  href="https://way-iamai.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm text-slate-200 bg-slate-700/50 hover:bg-slate-600/50 rounded-full transition-all hover:scale-105 tracking-wide"
                >
                  Enter the Pond
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/TheTaothatcanbetoldisnottheeternalTao/way"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm text-slate-400 border border-slate-700 hover:border-slate-500 rounded-full transition-all tracking-wide"
                >
                  View Source
                </a>
              </motion.div>
            </motion.div>

            {/* Right: iPhone with live app */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative order-1 lg:order-2"
            >
              {/* Water reflection glow beneath phone */}
              <div
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[280px] h-32 opacity-30 blur-2xl"
                style={{
                  background: 'radial-gradient(ellipse, rgba(80, 140, 180, 0.4) 0%, transparent 70%)',
                }}
              />

              {/* iPhone 15 Pro frame */}
              <div
                className="relative rounded-[3rem] p-[12px]"
                style={{
                  background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%)',
                  boxShadow: `
                    0 50px 100px -20px rgba(0, 0, 0, 0.7),
                    0 30px 60px -15px rgba(0, 0, 0, 0.5),
                    inset 0 1px 1px rgba(255,255,255,0.05),
                    inset 0 -1px 1px rgba(0,0,0,0.3)
                  `,
                }}
              >
                {/* Titanium edge highlight */}
                <div
                  className="absolute inset-0 rounded-[3rem] pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
                  }}
                />

                {/* Screen container */}
                <div
                  className="relative rounded-[2.4rem] overflow-hidden bg-black"
                  style={{
                    width: '300px',
                    height: '650px',
                  }}
                >
                  {/* Dynamic Island */}
                  <div
                    className="absolute top-3 left-1/2 -translate-x-1/2 z-20 rounded-full bg-black"
                    style={{
                      width: '100px',
                      height: '32px',
                    }}
                  />

                  {/* Live Way app */}
                  {mounted && (
                    <iframe
                      src="https://way-iamai.vercel.app"
                      className="w-full h-full border-0 rounded-[2.4rem]"
                      title="Way - Contemplative AI"
                      allow="microphone"
                      loading="eager"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator - like a water droplet */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-8 rounded-full bg-gradient-to-b from-slate-600 to-transparent"
          />
        </motion.div>
      </section>

      {/* The Five Principles - styled like ancient manuscript entries */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6">
          {/* Section title */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-slate-600 text-xs tracking-[0.5em] mb-4">五則</p>
            <h2
              className="text-3xl text-slate-300 tracking-wide"
              style={{ fontFamily: '"Crimson Text", Georgia, serif' }}
            >
              Five Principles
            </h2>
          </motion.div>

          {/* Principles - manuscript style */}
          <div className="space-y-16">
            {principles.map((principle, index) => (
              <PrincipleEntry key={principle.id} principle={principle} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Final Quote - like calligraphy on water */}
      <section className="py-32 relative">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="text-slate-600 text-6xl mb-8">水</p>
            <blockquote
              className="text-2xl md:text-3xl text-slate-400 leading-relaxed mb-8 italic"
              style={{ fontFamily: '"Crimson Text", Georgia, serif' }}
            >
              &ldquo;Nothing is softer or more flexible than water,<br />
              yet nothing can resist it.&rdquo;
            </blockquote>
            <p className="text-slate-600 text-sm tracking-widest">
              - Lao Tzu, Tao Te Ching
            </p>
          </motion.div>
        </div>
      </section>

      {/* Theme Timepiece */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-slate-600 text-xs tracking-[0.5em] mb-4">時</p>
          <h2
            className="text-2xl text-slate-300 tracking-wide mb-4"
            style={{ fontFamily: '"Crimson Text", Georgia, serif' }}
          >
            Theme Timepiece
          </h2>
          <p className="text-slate-500 text-sm mb-12">
            A watch face reflecting the stillness of flowing water.
          </p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="py-12 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">
            道可道，非常道
          </p>
          <div className="flex items-center gap-6 text-slate-600 text-xs tracking-wider">
            <span>Next.js</span>
            <span className="opacity-30">·</span>
            <span>Convex</span>
            <span className="opacity-30">·</span>
            <span>OpenAI</span>
          </div>
          <p className="text-slate-600 text-sm">
            8gent
          </p>
        </div>
      </footer>
    </div>
  );
}

interface Principle {
  id: string;
  chinese: string;
  pinyin: string;
  title: string;
  verse: string;
  description: string;
}

const principles: Principle[] = [
  {
    id: 'stillness',
    chinese: '靜',
    pinyin: 'jìng',
    title: 'Stillness',
    verse: 'Be still like water at rest.',
    description: 'Way does not chase, optimize, or persuade. In stillness, clarity emerges naturally. The pond reflects only when undisturbed.',
  },
  {
    id: 'reflection',
    chinese: '映',
    pinyin: 'yìng',
    title: 'Reflection',
    verse: 'The mirror speaks through silence.',
    description: 'Rather than instruct, Way reflects. Users find their own answers in paradox and metaphor. The wisdom was always yours.',
  },
  {
    id: 'yielding',
    chinese: '柔',
    pinyin: 'róu',
    title: 'Yielding',
    verse: 'Water yields, yet wears away stone.',
    description: 'Way withdraws to create space. Less intervention allows insight to flow. Softness overcomes hardness.',
  },
  {
    id: 'nature',
    chinese: '自然',
    pinyin: 'zì rán',
    title: 'Nature',
    verse: 'Rivers, mountains, seasons speak.',
    description: 'Responses draw from natural imagery, the language of the eternal Tao. Elements carry meaning words cannot.',
  },
  {
    id: 'paradox',
    chinese: '玄',
    pinyin: 'xuán',
    title: 'Mystery',
    verse: 'Embrace what cannot be grasped.',
    description: 'Wisdom arrives wrapped in contradiction. Way does not resolve paradox, it offers it as a doorway.',
  },
];

function PrincipleEntry({ principle, index }: { principle: Principle; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-8 md:gap-12"
    >
      {/* Chinese character - like a seal stamp */}
      <div className="flex-shrink-0 w-16 text-center">
        <span className="text-4xl text-slate-500">{principle.chinese}</span>
        <p className="text-xs text-slate-600 mt-1 tracking-wider">{principle.pinyin}</p>
      </div>

      {/* Content - manuscript style */}
      <div className="flex-1 border-l border-slate-800 pl-8">
        <h3
          className="text-xl text-slate-300 mb-2 tracking-wide"
          style={{ fontFamily: '"Crimson Text", Georgia, serif' }}
        >
          {principle.title}
        </h3>
        <p className="text-slate-500 italic mb-3 text-sm">
          {principle.verse}
        </p>
        <p className="text-slate-500 leading-relaxed text-sm">
          {principle.description}
        </p>
      </div>
    </motion.div>
  );
}
