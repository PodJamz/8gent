'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import {
  InView,
  TextEffect,
  FadeIn,
  FadeInUp,
  FadeInBlur,
  AnimatedGroup
} from '@/components/motion';
import { PageTransition } from '@/components/ios';

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
    subtitle: 'Dreams of changing the world through music',
    emoji: '🎸',
    highlight: 'Musician → Entrepreneur',
    content: [
      "I started out as a musician, full of dreams about changing the world through music. My band, ReLOVEution, and I spent several years working together and ultimately released an album 💿. I lived in Brazil for two years, from December 2009 to December 2011, fully immersed in that chapter of my life.",
      "After that, I spent the first half of 2012 back home in Ireland before returning to Brazil later that year to get married. It was during this period that I began working in teaching, with entrepreneurship always close at hand and a growing interest in technology from day one.",
      "Being self-employed in Brazil is a harsh education. Survival depends on constantly evolving your skills, sharpening your output, and finding ways to create real momentum. I did exactly that.",
    ],
  },
  {
    id: 'pivot',
    title: 'The Pivot',
    subtitle: 'Studies, trade, and building foundations',
    emoji: '🇮🇪',
    highlight: '2015-2018',
    content: [
      "I started studying Systems Analysis & Development while still in Brazil, and picked up international trade work with Financial Way Group, a Polish company. In December 2015, I moved back to Ireland for good,continuing my studies remotely and later adding Software Entrepreneurship & Startup Creation.",
      "Then came TOMRA, an R&D engineering company where I worked in business development for the Latin American market and technical documentation alongside the engineers. Great fun, and I learned how to bridge the gap between technical teams and business strategy.",
      "After that, I joined Dublin City University's NICB as Facilities Engineer,keeping cutting-edge laboratory equipment running. High-stakes, detail-oriented work that taught me precision matters. Each role was building toward something bigger, though I didn't fully see it yet.",
    ],
  },
  {
    id: 'nicholas',
    title: 'The Catalyst',
    subtitle: 'When everything changed',
    emoji: '👶',
    highlight: 'January 2018',
    content: [
      "My son Nicholas was born in January 2018. He is autistic, and becoming his father forced a deeper level of honesty with myself. I never wanted to reach a point where he might ask me what I do for a living and I'd have to justify doing something I didn't truly love.",
      "So I took the plunge. A brief stint at Amazon, then joining a startup where I met two future cofounders. We left to build something of our own.",
      "From that moment on, I dedicated myself to evolving fast and deeply enough to be genuinely competent in both the creative arts and in building software startups, spanning product design and AI. Creativity didn't disappear. It leveled up.",
    ],
  },
  {
    id: 'voala',
    title: 'The Startup Years',
    subtitle: 'Building through the storm',
    emoji: '🥽',
    highlight: 'Founder & CPO',
    content: [
      "We started as a team of three cofounders. Eventually they moved on, and I rebranded to Voalá Immersive Technology,my startup journey for a good long stretch.",
      "Then the pandemic hit. Trying to sell virtual try-ons to retailers while simultaneously building the product was brutal. But it was also an amazing experience and crash course in every aspect of startups. I wore every hat,product vision, software development, fundraising, go-to-market strategy.",
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
    subtitle: 'Single dad, still delivering',
    emoji: '🚀',
    highlight: '2026: Living It',
    content: [
      "Fast forward to today: I'm a single dad to an autistic 8-year-old. And I still manage to deliver, show up, and enjoy what I do with a smile,because I live it.",
      "I'm consulting with multiple stealth AI startups across AI memory, medicine, law, and finance,working with both founders and investors. I lead end-to-end product initiatives, translating visions into MVPs and guiding teams from concept through production.",
      "I work with tools like Cursor IDE and v0.dev to prototype at unprecedented speed. I facilitate workshops to define real jobs-to-be-done. I operate as a self-contained unit that multiplies the productivity of everyone around me.",
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
    highlight: 'Learning & building in public',
    content: [
      "I'm at my best when helping turn vision into reality. Whether it's a founder's first MVP, an investor's portfolio company, or a team's next big feature,I love the moment when an idea becomes something people can actually use.",
      "My 15+ year journey, from band manager to AR founder to AI product leader, has given me a unique toolkit. Right now I'm evolving my own orchestration layer of AI agents, learning and building in public. This site is part of that,a design area now, with dev and product areas coming soon. A living showcase of how I leverage my strengths to help founders, investors, and teams.",
      "I'm passionate about teaching people to properly leverage AI in their work and life. I'm driven to create technology solutions for autistic kids like my son. And I'm still making music,working on an album about the last two years, with more vibe coding tracks on the way. The mission? Keep building, keep sharing, keep evolving.",
    ],
  },
];

export default function StoryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Disable parallax for reduced motion users
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['0%', '0%'] : ['0%', '50%']
  );

  return (
    <PageTransition>
    <div ref={containerRef} className="min-h-screen bg-background relative overflow-hidden">
      {/* Paper texture background - GPU accelerated parallax */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ y: backgroundY, willChange: 'transform' }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-50 dark:opacity-30" />
        {/* Notebook lines */}
        <div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
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
        <div className="absolute top-0 bottom-0 left-[80px] md:left-[120px] w-[2px] bg-red-300/30 dark:bg-red-400/20" />
      </motion.div>

      {/* Back button */}
      <FadeIn delay={0.1}>
        <Link
          href="/"
          className="fixed top-6 left-6 z-50 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </FadeIn>

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
                ? 'bg-amber-500 dark:bg-amber-400 scale-125'
                : 'bg-gray-400/50 hover:bg-gray-400 dark:bg-gray-600/50 dark:hover:bg-gray-500'
            }`}
            title={chapter.title}
          />
        ))}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6">
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
            as="h1"
            className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight"
          >
            OpenClaw-OS
          </TextEffect>
          <TextEffect
            per="word"
            preset="fade-in-blur"
            delay={0.3}
            className="text-xl md:text-2xl text-muted-foreground mb-8"
          >
            From musician in Brazil to AI product leader and single dad in Dublin
          </TextEffect>
          <FadeInBlur delay={0.5}>
            <p className="text-muted-foreground italic text-lg">
              &ldquo;I&apos;m at my best when helping turn vision into reality,
              building what&apos;s next, and making sure every step solves a real problem for real people.&rdquo;
            </p>
          </FadeInBlur>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
          animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
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
      <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 pt-24 pb-40 relative">
        <InView preset="blurSlide">
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
              className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4"
            >
              {"Let's Build Something Together"}
            </TextEffect>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Got an idea? A problem to solve? A vision to bring to life?
              I&apos;d love to hear about it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <FadeInUp delay={0.1}>
                <Link
                  href="/design"
                  className="block px-8 py-3 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors text-center"
                >
                  View My Work
                </Link>
              </FadeInUp>
              <FadeInUp delay={0.2}>
                <a
                  href="https://x.com/James__Spalding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-8 py-3 border-2 border-gray-800 dark:border-gray-300 text-gray-800 dark:text-gray-200 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white transition-colors text-center"
                >
                  Get in Touch
                </a>
              </FadeInUp>
            </div>
          </div>
        </InView>

        {/* Decorative elements */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 dark:text-gray-500 text-sm">
          Made with curiosity and coffee ☕
        </div>
      </section>
    </div>
    </PageTransition>
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
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
          {/* Decorative corner fold */}
          <div className="absolute top-0 right-0 w-16 h-16">
            <div
              className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-amber-200 to-amber-100 dark:from-amber-600 dark:to-amber-700"
              style={{
                clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
              }}
            />
          </div>

          {/* Chapter number */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{chapter.emoji}</span>
            <div>
              <span className="text-sm text-primary font-medium">
                Chapter {index + 1}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {chapter.title}
              </h2>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground italic mb-6 pl-4 border-l-4 border-primary">
            {chapter.subtitle}
          </p>

          {/* Highlight badge */}
          {chapter.highlight && (
            <div className="inline-block px-4 py-2 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-full text-sm font-medium mb-6">
              {chapter.highlight}
            </div>
          )}

          {/* Content paragraphs */}
          <AnimatedGroup preset="fadeUp" stagger={0.12} className="space-y-4">
            {chapter.content.map((paragraph, pIndex) => (
              <p key={pIndex} className="text-foreground/80 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </AnimatedGroup>

          {/* Decorative tape */}
          <div
            className="absolute -top-2 left-8 w-24 h-8 bg-amber-200/60 dark:bg-amber-600/40 rotate-[-2deg]"
            style={{ filter: 'blur(0.5px)' }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
