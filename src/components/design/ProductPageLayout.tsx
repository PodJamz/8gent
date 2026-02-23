'use client';

import { ReactNode, useRef, useMemo } from 'react';
import { motion, useScroll } from 'framer-motion';
import Link from 'next/link';
import { DesignHeader } from './DesignHeader';
import { ThemeName } from '@/lib/themes';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import '@/lib/themes/themes.css';
import {
  InView,
  TextEffect,
  AnimatedGroup,
  FadeIn,
  FadeInUp
} from '@/components/motion';

interface ProductPageLayoutProps {
  theme: ThemeName;
  // Problem Section
  problemLabel?: string;
  problemStatement: string;
  problemContext?: string;
  targetUser?: string;

  // Insight Section
  insightLabel?: string;
  insight: string;
  tradeoffs?: string[];

  // Mini-App
  appName: string;
  appDescription?: string;
  children: ReactNode; // The actual mini-app component

  // Why It Works
  principles: Array<{
    title: string;
    description: string;
  }>;

  // Optional extras
  quote?: {
    text: string;
    author: string;
  };
  headerRightContent?: ReactNode;

  // Theme Toolbar props
  showToolbar?: boolean;
  themeLabel?: string;
  onReferenceToAI?: (prompt: string) => void;
}

export function ProductPageLayout({
  theme,
  problemLabel = 'The Problem',
  problemStatement,
  problemContext,
  targetUser,
  insightLabel = 'Our Approach',
  insight,
  tradeoffs,
  appName,
  appDescription,
  children,
  principles,
  quote,
  headerRightContent,
  showToolbar,
  themeLabel,
  onReferenceToAI,
}: ProductPageLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const watchDNA = useMemo(() => themeToWatch(theme), [theme]);

  return (
    <div
      ref={containerRef}
      data-design-theme={theme}
      className="min-h-screen relative"
      style={{
        backgroundColor: 'hsl(var(--theme-background))',
        fontFamily: 'var(--theme-font)',
      }}
    >
      {/* Progress indicator */}
      <motion.div
        className="fixed top-14 left-0 right-0 h-[2px] z-40 origin-left"
        style={{
          scaleX: scrollYProgress,
          backgroundColor: 'hsl(var(--theme-primary))',
        }}
      />

      {/* Header */}
      <DesignHeader
        currentTheme={theme}
        backHref="/design"
        backText="Gallery"
        rightContent={headerRightContent}
        showToolbar={showToolbar}
        themeLabel={themeLabel}
        onReferenceToAI={onReferenceToAI}
      />

      {/* Problem Section */}
      <section className="min-h-[60vh] flex items-center pt-20">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <FadeInUp>
            {targetUser && (
              <p
                className="text-sm uppercase tracking-widest mb-4"
                style={{ color: 'hsl(var(--theme-primary))' }}
              >
                For {targetUser}
              </p>
            )}
            <p
              className="text-xs uppercase tracking-widest mb-6 opacity-60"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {problemLabel}
            </p>
            <TextEffect
              per="word"
              preset="blur"
              as="h1"
              className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight mb-6"
              style={{
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
            >
              {problemStatement}
            </TextEffect>
            {problemContext && (
              <p
                className="text-lg leading-relaxed max-w-2xl"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                {problemContext}
              </p>
            )}
          </FadeInUp>
        </div>
      </section>

      {/* Insight Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <InView preset="fadeUp">
            <p
              className="text-xs uppercase tracking-widest mb-6 opacity-60"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {insightLabel}
            </p>
            <p
              className="text-xl md:text-2xl leading-relaxed mb-8"
              style={{
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
            >
              {insight}
            </p>
            {tradeoffs && tradeoffs.length > 0 && (
              <AnimatedGroup as="div" asChild="span" preset="scale" stagger={0.05} className="flex flex-wrap gap-3">
                {tradeoffs.map((tradeoff, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 rounded-full border"
                    style={{
                      borderColor: 'hsl(var(--theme-border))',
                      color: 'hsl(var(--theme-muted-foreground))',
                    }}
                  >
                    {tradeoff}
                  </span>
                ))}
              </AnimatedGroup>
            )}
          </InView>
        </div>
      </section>

      {/* Mini-App Section */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6">
          <InView preset="blurSlide">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2
                  className="text-2xl font-medium"
                  style={{
                    color: 'hsl(var(--theme-foreground))',
                    fontFamily: 'var(--theme-font-heading)',
                  }}
                >
                  {appName}
                </h2>
                {appDescription && (
                  <p
                    className="text-sm mt-1"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    {appDescription}
                  </p>
                )}
              </div>
              <span
                className="text-[10px] uppercase tracking-widest"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                Live Demo
              </span>
            </div>
            {children}
          </InView>
        </div>
      </section>

      {/* Quote Section (optional) */}
      {quote && (
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6">
            <InView preset="fade">
              <blockquote
                className="border-l-2 pl-6 py-2"
                style={{ borderColor: 'hsl(var(--theme-primary))' }}
              >
                <p
                  className="text-xl md:text-2xl font-light leading-relaxed mb-4"
                  style={{
                    color: 'hsl(var(--theme-foreground))',
                    fontFamily: 'var(--theme-font-heading)',
                  }}
                >
                  &ldquo;{quote.text}&rdquo;
                </p>
                <cite
                  className="text-sm not-italic"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  - {quote.author}
                </cite>
              </blockquote>
            </InView>
          </div>
        </section>
      )}

      {/* Theme Watch Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <InView preset="fadeUp">
            <div className="flex flex-col items-center">
              <p
                className="text-xs uppercase tracking-widest mb-8 opacity-60"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                Theme Timepiece
              </p>
              <WatchFace
                watchDNA={watchDNA}
                size="lg"
                showCase={true}
                interactive={true}
              />
              <p
                className="text-sm mt-6 text-center max-w-md"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                Every theme generates a unique watch face, adapting colors,
                textures, and style to match the design language.
              </p>
            </div>
          </InView>
        </div>
      </section>

      {/* Why It Works Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <InView preset="fadeUp">
            <p
              className="text-xs uppercase tracking-widest mb-8 opacity-60"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Why It Works
            </p>
          </InView>
          <AnimatedGroup preset="blurSlide" stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((principle, index) => (
              <div
                key={index}
                className="p-5 rounded-lg border"
                style={{
                  borderColor: 'hsl(var(--theme-border))',
                  backgroundColor: 'hsl(var(--theme-card))',
                }}
              >
                <h3
                  className="text-base font-medium mb-2"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  {principle.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {principle.description}
                </p>
              </div>
            ))}
          </AnimatedGroup>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 border-t"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            className="text-2xl font-medium mb-6"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            Explore More
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/design"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all hover:opacity-90"
              style={{
                backgroundColor: 'hsl(var(--theme-primary))',
                color: 'hsl(var(--theme-primary-foreground))',
              }}
            >
              View Theme Gallery
            </Link>
            <Link
              href="/story"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border transition-all hover:opacity-90"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                color: 'hsl(var(--theme-foreground))',
              }}
            >
              Read My Story
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-6 border-t"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="max-w-3xl mx-auto px-6 flex justify-between items-center">
          <p
            className="text-sm"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            {theme.charAt(0).toUpperCase() + theme.slice(1).replace(/-/g, ' ')} Theme
          </p>
          <p
            className="text-sm"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            8gent
          </p>
        </div>
      </footer>
    </div>
  );
}
