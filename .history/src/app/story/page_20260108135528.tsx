'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import BlurFade from '@/components/magicui/blur-fade';
import { TextEffect } from '@/components/ui/text-effect';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const BLUR_FADE_DELAY = 0.04;

interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  emoji: string;
  highlight?: string;
}

const chapters: Chapter[] = [
  {
    id: 'origin',
    title: 'The Origin',
    subtitle: 'From Salvador to Dublin',
    emoji: '🌱',
    highlight: 'Brazil → Ireland',
    content: [
      "In 2008, I began transitioning out of being a full-time musician. First teaching, then entrepreneurship, and eventually tech. That year, I started managing a band called ReLOVEution in Brazil, which I did until 2011. I handled everything, booking, payroll, branding, tours. That's where I first learned the magic of turning creative chaos into something people experience and remember.",
      "While running the band, I was teaching English at Pracatum, blending language instruction with early educational technology. I discovered I loved building systems that help people learn and grow.",
      "Then came international trade, representing Financial Way Group and later TOMRA, where I mapped the entire Latin American market for expansion. Each role felt random at the time, but they were all teaching me the same lesson: understand people first, then build for them.",
    ],
  },
  {
    id: 'pivot',
    title: 'The Pivot',
    subtitle: 'Following curiosity to tech',
    emoji: '🔄',
    highlight: '2015-2019',
    content: [
      "In 2015, I made a decision that changed everything: I went back to school. Earned my diploma in Systems Analysis & Development, then a postgraduate degree in Software Entrepreneurship & Startup Creation.",
      "But the real education came from doing. At Dublin City University's NICB, I worked as Facilities Engineer, keeping cutting-edge laboratory equipment running. High-stakes, detail-oriented work that taught me precision matters.",
      "That foundation gave me the confidence to take the biggest leap of my career: founding Voalá Immersive Technology in 2019. An AR startup from scratch, securing funding, building the product, assembling a team, and taking it to market.",
    ],
  },
  {
    id: 'voala',
    title: 'The Startup Years',
    subtitle: 'Building Voalá from zero',
    emoji: '🥽',
    highlight: 'Founder & CPO',
    content: [
      "Voalá was three years of the most intense learning imaginable. I wore every hat, product vision, software development, fundraising, go-to-market strategy. When you're a founder, there's no 'that's not my job.'",
      "We built augmented reality experiences when AR was still finding its footing. I learned to balance technical feasibility with user experience, to build and scale a team, and to navigate the brutal challenges of early-stage growth.",
      "The startup didn't become a unicorn, but it made me who I am. I emerged knowing how to take a vision from napkin sketch to working product. That skill has defined every role since.",
    ],
  },
  {
    id: 'evolution',
    title: 'The Evolution',
    subtitle: 'Product leadership across industries',
    emoji: '🦋',
    highlight: 'ESW → Emergegen → MarketSizer → MiAI Law',
    content: [
      "After Voalá, I brought startup intensity to established companies. At Vstage, I revitalized their product capabilities by building an entirely new AR product line. At ESW, I designed AI workshops that shaped strategic decisions for the organization.",
      "As CPO at Emergegen AI, I directed AI roadmaps across financial and music sectors. Then at MarketSizer, I accelerated product strategy and growth initiatives, using real user data to drive continuous improvement. At MiAI Law, I built AI-powered legal research tools for top-tier Australian law firms, seeing firsthand how AI can transform entire industries.",
      "Each role added new perspective: enterprise scale at ESW, cross-industry AI at Emergegen, growth strategy at MarketSizer, legal tech complexity at MiAI Law. The through-line? Always translating complex ideas into products that actually work for real people.",
    ],
  },
  {
    id: 'neurodiversity',
    title: 'The Perspective',
    subtitle: 'Neurodiversity as superpower',
    emoji: '🧠',
    highlight: 'Autism Innovation Advisory',
    content: [
      "I'm autistic. For years I didn't know it. Now I understand that my different way of processing the world, the pattern recognition, the deep focus, the systems thinking, isn't a limitation. It's a lens.",
      "Since 2022, I've served on Ireland's national Autism Innovation Strategy Oversight and Advisory Group, helping shape policy that creates a more inclusive environment for neurodivergent communities.",
      "With fellow parents and advocates, I co-founded the Infinity School Dublin initiative, working to establish a special school for autistic children in North Dublin. Because every child deserves education designed for how they actually learn.",
    ],
  },
  {
    id: 'now',
    title: 'The Now',
    subtitle: 'AI-native building',
    emoji: '🚀',
    highlight: '2025: Stealth AI Startups',
    content: [
      "Today, I'm consulting with multiple stealth AI startups across AI memory, medicine, law, and finance. I lead end-to-end product initiatives, translating founder visions into MVPs and guiding teams from concept through production.",
      "I work with tools like Cursor IDE and v0.dev to prototype at unprecedented speed. I facilitate workshops to define real jobs-to-be-done. I operate as a self-contained unit that multiplies the productivity of everyone around me.",
      "My recent projects reflect this: Way, a contemplative AI experience with WebGPU water simulation and RAG-powered reflections from the Tao Te Ching. IAMAI Research, giving AI superpowers through multi-modal interfaces with voice, weather, flights, and more.",
    ],
  },
  {
    id: 'philosophy',
    title: 'The Philosophy',
    subtitle: 'How I think about building',
    emoji: '🎯',
    highlight: 'Real problems, real people',
    content: [
      "I'm not interested in solutions looking for problems. I start with real people facing real challenges, then work backwards to the simplest thing that actually helps.",
      "My process is hands-on and iterative: facilitate workshops, define jobs-to-be-done, prototype rapidly, learn from users, repeat. No elaborate plans that never survive contact with reality.",
      "The best products emerge from a blend of technical excellence, deep listening, and collaborative problem-solving. Every feature should answer: 'Does this solve a real problem for a real person?'",
    ],
  },
  {
    id: 'mission',
    title: 'The Mission',
    subtitle: 'Why I do this',
    emoji: '✨',
    highlight: 'Turn vision into reality',
    content: [
      "I'm at my best when helping turn vision into reality. Whether it's a founder's first MVP or a company's next big feature, I love the moment when an idea becomes something people can actually use.",
      "My 12+ year journey, from band manager to AR founder to AI product leader, has given me a unique toolkit. I've failed enough to know what doesn't work, and succeeded enough to recognize what does.",
      "My mission is simple: build what's next, make sure every step solves a real problem, and help others do the same. Let's create something meaningful together.",
    ],
  },
];

export default function StoryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f5f1e8] relative overflow-hidden">
      {/* Paper texture background */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-50" />
        {/* Notebook lines */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              transparent,
              transparent 31px,
              #94a3b8 31px,
              #94a3b8 32px
            )`,
            backgroundSize: '100% 32px',
          }}
        />
        {/* Red margin line */}
        <div className="absolute top-0 bottom-0 left-[80px] md:left-[120px] w-[2px] bg-red-300/30" />
      </motion.div>

      {/* Back button */}
      <BlurFade delay={0.1}>
        <Link
          href="/"
          className="fixed top-6 left-6 z-50 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </BlurFade>

      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-amber-500/80 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Chapter navigation */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        {chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            onClick={() => {
              document.getElementById(chapter.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              activeChapter === index
                ? 'bg-amber-500 scale-125'
                : 'bg-gray-400/50 hover:bg-gray-400'
            }`}
            title={chapter.title}
          />
        ))}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="text-center max-w-3xl">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 1.5, delay: 0.2 }}
              className="text-8xl mb-8"
            >
              📖
            </motion.div>
            <TextEffect
              per="word"
              preset="blur"
              delay={0.3}
              as="h1"
              className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 tracking-tight"
            >
              James Spalding
            </TextEffect>
            <TextEffect
              per="word"
              preset="slide"
              delay={0.5}
              className="text-xl md:text-2xl text-gray-600 mb-8"
            >
              From band manager in Brazil to AI product leader in Dublin
            </TextEffect>
            <BlurFade delay={0.8}>
              <p className="text-gray-500 italic text-lg">
                &ldquo;I&apos;m at my best when helping turn vision into reality,
                building what&apos;s next, and making sure every step solves a real problem for real people.&rdquo;
              </p>
            </BlurFade>
          </div>
        </BlurFade>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-sm">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* Chapter Sections */}
      {chapters.map((chapter, index) => (
        <ChapterSection
          key={chapter.id}
          chapter={chapter}
          index={index}
          onInView={() => setActiveChapter(index)}
        />
      ))}

      {/* Closing Section */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 relative">
        <BlurFade delay={0.2}>
          <div className="text-center max-w-2xl">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="text-6xl mb-6"
            >
              🤝
            </motion.div>
            <TextEffect
              per="word"
              preset="blur"
              as="h2"
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            >
              {"Let's Build Something Together"}
            </TextEffect>
            <p className="text-gray-600 mb-8">
              Got an idea? A problem to solve? A vision to bring to life?
              I&apos;d love to hear about it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
              >
                View My Work
              </Link>
              <a
                href="https://x.com/James__Spalding"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border-2 border-gray-800 text-gray-800 rounded-full font-medium hover:bg-gray-800 hover:text-white transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </BlurFade>

        {/* Decorative elements */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 text-sm">
          Made with curiosity and coffee ☕
        </div>
      </section>
    </div>
  );
}

function ChapterSection({
  chapter,
  index,
  onInView,
}: {
  chapter: Chapter;
  index: number;
  onInView: () => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

  return (
    <motion.section
      ref={sectionRef}
      id={chapter.id}
      className="min-h-screen py-24 px-6 flex items-center justify-center relative"
      onViewportEnter={onInView}
      viewport={{ amount: 0.5 }}
    >
      <motion.div
        style={{ opacity, y }}
        className="max-w-3xl w-full"
      >
        {/* Chapter card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
          {/* Decorative corner fold */}
          <div className="absolute top-0 right-0 w-16 h-16">
            <div
              className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-amber-200 to-amber-100"
              style={{
                clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
              }}
            />
          </div>

          {/* Chapter number */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{chapter.emoji}</span>
            <div>
              <span className="text-sm text-amber-600 font-medium">
                Chapter {index + 1}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                {chapter.title}
              </h2>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-lg text-gray-500 italic mb-6 pl-4 border-l-4 border-amber-400">
            {chapter.subtitle}
          </p>

          {/* Highlight badge */}
          {chapter.highlight && (
            <div className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-6">
              {chapter.highlight}
            </div>
          )}

          {/* Content paragraphs */}
          <div className="space-y-4">
            {chapter.content.map((paragraph, pIndex) => (
              <BlurFade key={pIndex} delay={0.1 + pIndex * 0.1}>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {paragraph}
                </p>
              </BlurFade>
            ))}
          </div>

          {/* Decorative tape */}
          <div
            className="absolute -top-2 left-8 w-24 h-8 bg-amber-200/60 rotate-[-2deg]"
            style={{ filter: 'blur(0.5px)' }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
