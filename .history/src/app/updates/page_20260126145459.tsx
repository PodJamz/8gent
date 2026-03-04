'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Home, SkipForward, Play, Pause } from 'lucide-react';
import { useGitHubStats, formatGitHubStats } from '@/hooks/useGitHubStats';

// Auto-advance hook
function useAutoAdvance(delay: number, onAdvance: () => void, enabled: boolean = true) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasAdvancedRef = useRef(false);

  const skipDelay = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!hasAdvancedRef.current) {
      hasAdvancedRef.current = true;
      onAdvance();
    }
  }, [onAdvance]);

  useEffect(() => {
    if (!enabled) return;
    hasAdvancedRef.current = false;
    timeoutRef.current = setTimeout(() => {
      if (!hasAdvancedRef.current) {
        hasAdvancedRef.current = true;
        onAdvance();
      }
    }, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay, onAdvance, enabled]);

  return { skipDelay };
}

// All screens with exact dates from git history (976 commits, Dec 31 2025 - Jan 26 2026)
const SCREENS = [
  {
    id: 'hook',
    type: 'hook',
    line1: 'Started tryna get hired',
    line2: 'ended up getting acquired...',
    delay: 4000,
  },
  {
    id: 'context',
    type: 'context',
    quote: '"Hey, I need my resume portfolio site to be better."',
    subtext: 'That was the request. Dec 31, 2025.',
    delay: 4500,
  },
  {
    id: 'intro',
    type: 'intro',
    title: 'AI James OS',
    stats: '976 commits · 428 PRs · 26 days',
    tagline: 'They wanted a portfolio. I gave them a system.',
    delay: 4000,
  },
  {
    id: 'phase-0',
    type: 'phase',
    number: '00',
    title: 'Genesis',
    date: 'Dec 31, 2025',
    description: 'The first commit. Way project launched.',
    highlights: [
      'Way🌊 Taoist Aquatic Voice AI project',
      'Inspired to build without constraints',
      'LinkedIn article published',
      'Initial package setup',
    ],
    commits: 8,
    delay: 5000,
  },
  {
    id: 'phase-1',
    type: 'phase',
    number: '01',
    title: 'Foundation',
    date: 'Jan 6-7, 2026',
    description: 'Story page created. First PR merged.',
    highlights: [
      'Interactive Story page',
      'Narrative experience with timeline',
      'Package and dependency setup',
      'First PR #1 merged',
    ],
    commits: 3,
    delay: 4500,
  },
  {
    id: 'phase-2',
    type: 'phase',
    number: '02',
    title: 'Design System',
    date: 'Jan 8, 2026',
    description: '50+ themes. Magazine-style gallery. Music player.',
    highlights: [
      '50+ design themes from tweakcn',
      'Theme gallery with dark mode',
      'iPod-style music player',
      'Vercel Blob audio storage',
      'Comprehensive README',
      'Next.js 16.1.1 upgrade',
    ],
    commits: 28,
    delay: 5500,
  },
  {
    id: 'phase-3',
    type: 'phase',
    number: '03',
    title: 'iOS Experience',
    date: 'Jan 9-10, 2026',
    description: 'Full iOS-style interface. Lock screen. Theme subpages.',
    highlights: [
      'iOS lock screen with aurora gradient',
      'Home screen with drag-and-drop folders',
      'Glass-style dock with mini player',
      'AI mini-apps on every theme page',
      'Motion primitives system',
      'Theme inheritance across all pages',
      'Typewriter sound effects',
      'DALL-E 3 image generation',
    ],
    commits: 87,
    delay: 6000,
  },
  {
    id: 'phase-4',
    type: 'phase',
    number: '04',
    title: 'AI James Core',
    date: 'Jan 10-11, 2026',
    description: 'The AI assistant comes alive.',
    highlights: [
      'AI James chat with liquid glass overlay',
      'Voice input with speech recognition',
      'Dynamic Island with music integration',
      'Theme suggestion cards in chat',
      'Chat history persistence',
      'System prompt with personality',
      'SessionBrain context management',
    ],
    commits: 45,
    delay: 5500,
  },
  {
    id: 'phase-5',
    type: 'phase',
    number: '05',
    title: 'Apps Explosion',
    date: 'Jan 11-12, 2026',
    description: 'Photos. Kanban. Jamz Studio. Humans. Skills.',
    highlights: [
      'Photos app with 3D infinite gallery',
      'Kanban project management board',
      'Jamz music studio (Web Audio API)',
      'Humans people search + Ralph Mode',
      'Cursor-like IDE (Clerk + Convex)',
      'SuperDesign library (50+ components)',
      'AI James skills system',
      'Browser automation skill',
      'Inspirations page with business cards',
    ],
    commits: 124,
    delay: 6500,
  },
  {
    id: 'phase-6',
    type: 'phase',
    number: '06',
    title: 'Productivity Suite',
    date: 'Jan 12-13, 2026',
    description: 'Command Palette. Notes. Weather. Contacts.',
    highlights: [
      'Command Palette (Cmd+K)',
      'Notes app with markdown + folders',
      'Weather widget (SF/Dublin + Irish sayings)',
      'Contacts app (vCard + QR codes)',
      'iOS-style Settings page',
      'Full keyboard accessibility (ARIA)',
      'Thread-Based Engineering system',
      'Public roadmap with user suggestions',
      'K-Dense: 139 scientific skills',
    ],
    commits: 98,
    delay: 6500,
  },
  {
    id: 'phase-7',
    type: 'phase',
    number: '07',
    title: 'Calendar & Media',
    date: 'Jan 13-14, 2026',
    description: 'Calendly clone. Mockit. Cowrite. Reels.',
    highlights: [
      'Native Calendly clone',
      'Google Calendar OAuth integration',
      'Email notifications (Resend)',
      'Mockit mockup generator',
      'Cowrite Suno lyrics studio',
      'Reels video player',
      'Bubble Timer + Intuition games',
      '3D lock screen background',
      'Proactive AI notifications',
    ],
    commits: 76,
    delay: 6000,
  },
  {
    id: 'phase-8',
    type: 'phase',
    number: '08',
    title: 'Polish & Skills',
    date: 'Jan 14-15, 2026',
    description: '67 AI skills. Private music. Performance monitoring.',
    highlights: [
      'Web Interface Guidelines (27 tickets)',
      'Denim theme with studio elements',
      'Skills management app (67 skills)',
      'Private music collaborator access',
      'Performance monitoring widget',
      'Convex migration for Kanban',
      'React best practices audit',
      'Group chat prompt system',
    ],
    commits: 89,
    delay: 6000,
  },
  {
    id: 'phase-9',
    type: 'phase',
    number: '09',
    title: 'Agentic Infrastructure',
    date: 'Jan 15-17, 2026',
    description: 'BMAD Framework. Watch app. Wiki. Product lifecycle.',
    highlights: [
      'Agentic product lifecycle (ARC-001 to ARC-009)',
      'json-render for AI rich UI (40+ components)',
      'Watch app with procedural faces',
      'Wiki documentation system',
      'Vinyl carousel music player',
      'BMAD Framework full installation',
      'Comprehensive test suite',
      '128 brownfield tickets seeded',
    ],
    commits: 112,
    delay: 6500,
  },
  {
    id: 'phase-10',
    type: 'phase',
    number: '10',
    title: 'Voice & Intelligence',
    date: 'Jan 18-22, 2026',
    description: 'Voice messaging. Recursive Memory Layer. Security.',
    highlights: [
      'Voice messaging (iMessage style)',
      'Recursive Memory Layer (episodic + semantic)',
      'Fortress-level security monitoring',
      'Weather icons + nighttime modes',
      'Hourly AI summary emails',
      'Test coverage analysis (3.7%)',
      'Comprehensive CLAUDE.md',
      'Charts on theme pages',
    ],
    commits: 87,
    delay: 6000,
  },
  {
    id: 'phase-11',
    type: 'phase',
    number: '11',
    title: 'Onboarding & 3D',
    date: 'Jan 23-24, 2026',
    description: 'iPhone-inspired onboarding. 3D Avatar. Design Canvas.',
    highlights: [
      'iPhone-inspired onboarding flow',
      '3D Avatar app with theme awareness',
      'Infinite Design Canvas',
      'Mobile-first canvas + voice input',
      'Nike/Adidas brand themes',
      'Khronos GLTF 3D shoe models',
      'iPod navigation dock',
      'Blog: Why I Couldn\'t Make a Simple Portfolio',
    ],
    commits: 124,
    delay: 6000,
  },
  {
    id: 'phase-12',
    type: 'phase',
    number: '12',
    title: 'ERV & Research',
    date: 'Jan 25, 2026',
    description: 'Entity-Relationship Visualization. Research app. Voice mode.',
    highlights: [
      'ERV Phase 1: Schema Foundation',
      'Research app for web scraping',
      'Two-way voice interaction',
      'Context reference system',
      'Artifact rendering integration',
      'Auth gates improvements',
      'Blog: I Dreamed the Architecture',
      'Blog: The Infinity Agent',
    ],
    commits: 89,
    delay: 6000,
  },
  {
    id: 'phase-13',
    type: 'phase',
    number: '13',
    title: 'Today',
    date: 'Jan 26, 2026',
    description: 'Build fixes. This presentation. The journey continues.',
    highlights: [
      'Vercel build error fixes',
      'Kanban data sync (375+ commits)',
      'This updates presentation',
      'Framer Motion type fixes',
      'Clerk prerender fixes',
      'Research page refactor',
    ],
    commits: 12,
    delay: 5000,
  },
  {
    id: 'stats',
    type: 'stats',
    title: 'By The Numbers',
    stats: [
      { label: 'Total Commits', value: '976' },
      { label: 'Pull Requests', value: '428' },
      { label: 'Design Themes', value: '50+' },
      { label: 'AI Skills', value: '67' },
      { label: 'Apps Built', value: '35+' },
      { label: 'Days of Dev', value: '26' },
    ],
    delay: 5500,
  },
  {
    id: 'reflection',
    type: 'reflection',
    lines: [
      'They wanted a portfolio.',
      'I gave them a system.',
      '',
      'They wanted credentials.',
      'I gave them leverage.',
      '',
      'They wanted a snapshot.',
      'I gave them a moving target.',
    ],
    delay: 6000,
  },
  {
    id: 'outro',
    type: 'outro',
    title: 'Built with Claude',
    subtitle: 'AI-driven development at scale',
    description: 'Every commit. Every feature. Every fix. This is what happens when you let AI cook.',
    delay: 5000,
  },
];

// Screen components
function HookScreen({ screen, onAdvance, autoPlay }: { screen: typeof SCREENS[0]; onAdvance: () => void; autoPlay: boolean }) {
  const { skipDelay } = useAutoAdvance(screen.delay || 4000, onAdvance, autoPlay);
  if (screen.type !== 'hook') return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center cursor-pointer px-8"
      onClick={skipDelay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.p
        className="text-2xl sm:text-4xl md:text-5xl text-white/80 font-light italic text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {screen.line1}
      </motion.p>
      <motion.p
        className="text-2xl sm:text-4xl md:text-5xl text-amber-400 font-light italic text-center mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        {screen.line2}
      </motion.p>
    </motion.div>
  );
}

function ContextScreen({ screen, onAdvance, autoPlay }: { screen: typeof SCREENS[0]; onAdvance: () => void; autoPlay: boolean }) {
  const { skipDelay } = useAutoAdvance(screen.delay || 4500, onAdvance, autoPlay);
  if (screen.type !== 'context') return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center cursor-pointer px-8"
      onClick={skipDelay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.p
        className="text-xl sm:text-2xl md:text-3xl text-white/60 font-light text-center max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {screen.quote}
      </motion.p>
      <motion.p
        className="text-sm text-white/30 mt-8 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
      >
        {screen.subtext}
      </motion.p>
    </motion.div>
  );
}

function IntroScreen({ screen, onAdvance, autoPlay }: { screen: typeof SCREENS[0]; onAdvance: () => void; autoPlay: boolean }) {
  const { skipDelay } = useAutoAdvance(screen.delay || 4000, onAdvance, autoPlay);
  const { stats: githubStats } = useGitHubStats();
  if (screen.type !== 'intro') return null;

  // Use live GitHub stats if available
  const statsDisplay = githubStats
    ? formatGitHubStats(githubStats)
    : (typeof screen.stats === 'string' ? screen.stats : '');

  return (
    <motion.div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center cursor-pointer"
      onClick={skipDelay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-5xl sm:text-7xl md:text-8xl font-light text-white tracking-tight"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {screen.title}
      </motion.h1>
      <motion.p
        className="mt-6 text-sm text-white/40 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        {statsDisplay}
      </motion.p>
      <motion.p
        className="mt-8 text-lg sm:text-xl text-white/60 font-light text-center max-w-lg px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
      >
        {screen.tagline}
      </motion.p>
    </motion.div>
  );
}

function PhaseScreen({ screen, onAdvance, autoPlay }: { screen: typeof SCREENS[0]; onAdvance: () => void; autoPlay: boolean }) {
  const { skipDelay } = useAutoAdvance(screen.delay || 5000, onAdvance, autoPlay);
  if (screen.type !== 'phase') return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center px-6 sm:px-8 cursor-pointer overflow-hidden"
      onClick={skipDelay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute top-6 sm:top-8 left-6 sm:left-8 text-white/20 font-mono text-xs sm:text-sm"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        PHASE {screen.number}
      </motion.div>

      <motion.div
        className="absolute top-6 sm:top-8 right-6 sm:right-8 text-white/40 font-mono text-xs sm:text-sm"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        {screen.date}
      </motion.div>

      <motion.h2
        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {screen.title}
      </motion.h2>

      <motion.p
        className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-white/60 font-light text-center max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {screen.description}
      </motion.p>

      {screen.highlights && (
        <motion.div
          className="mt-8 sm:mt-10 max-w-xl w-full px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <ul className="space-y-1.5 sm:space-y-2">
            {screen.highlights.map((highlight: string, i: number) => (
              <motion.li
                key={i}
                className="text-white/50 text-xs sm:text-sm md:text-base font-light flex items-start gap-2 sm:gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.08 }}
              >
                <span className="text-amber-500/70 mt-0.5">›</span>
                {highlight}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {screen.commits && (
        <motion.div
          className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 text-white/30 font-mono text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {screen.commits} commits
        </motion.div>
      )}
    </motion.div>
  );
}

function StatsScreen({ screen, onAdvance, autoPlay }: { screen: typeof SCREENS[0]; onAdvance: () => void; autoPlay: boolean }) {
  const { skipDelay } = useAutoAdvance(screen.delay || 5000, onAdvance, autoPlay);
  const { stats: githubStats } = useGitHubStats();
  if (screen.type !== 'stats') return null;

  // Build dynamic stats, replacing commits/PRs/days with live data
  const dynamicStats = Array.isArray(screen.stats)
    ? screen.stats.map((stat: { label: string; value: string }) => {
        if (githubStats) {
          if (stat.label === 'Total Commits') {
            return { ...stat, value: githubStats.commits.toLocaleString() };
          }
          if (stat.label === 'Pull Requests') {
            return { ...stat, value: githubStats.prs.toLocaleString() };
          }
          if (stat.label === 'Days of Dev') {
            return { ...stat, value: String(githubStats.daysSinceCreation) };
          }
        }
        return stat;
      })
    : [];

  return (
    <motion.div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center px-8 cursor-pointer"
      onClick={skipDelay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-2xl sm:text-4xl md:text-5xl font-light text-white tracking-tight mb-10 sm:mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {screen.title}
      </motion.h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
        {dynamicStats.map((stat: { label: string; value: string }, i: number) => (
          <motion.div
            key={i}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.12 }}
          >
            <div className="text-3xl sm:text-5xl md:text-6xl font-light text-amber-500">{stat.value}</div>
            <div className="text-white/40 text-xs sm:text-sm mt-2">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ReflectionScreen({ screen, onAdvance, autoPlay }: { screen: typeof SCREENS[0]; onAdvance: () => void; autoPlay: boolean }) {
  const { skipDelay } = useAutoAdvance(screen.delay || 6000, onAdvance, autoPlay);
  if (screen.type !== 'reflection') return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center px-8 cursor-pointer"
      onClick={skipDelay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-1">
        {screen.lines?.map((line: string, i: number) => (
          <motion.p
            key={i}
            className={`text-lg sm:text-xl md:text-2xl font-light ${
              line === '' ? 'h-4' : i % 2 === 1 ? 'text-amber-400' : 'text-white/70'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.25 }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

function OutroScreen({ screen, onAdvance, autoPlay }: { screen: typeof SCREENS[0]; onAdvance: () => void; autoPlay: boolean }) {
  const router = useRouter();
  useAutoAdvance(screen.delay || 5000, onAdvance, autoPlay);
  if (screen.type !== 'outro') return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {screen.title}
      </motion.h2>
      <motion.p
        className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-white/60 font-light text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {screen.subtitle}
      </motion.p>
      <motion.p
        className="mt-6 sm:mt-8 text-sm sm:text-base text-white/40 text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        {screen.description}
      </motion.p>

      <motion.button
        onClick={() => router.push('/')}
        className="mt-10 sm:mt-12 px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base rounded-full flex items-center gap-2 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <Home className="w-4 h-4" />
        Enter JamesOS
      </motion.button>
    </motion.div>
  );
}

export default function UpdatesPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const advance = useCallback(() => {
    if (currentIndex < SCREENS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        advance();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goBack();
      } else if (e.key === 'Escape') {
        router.push('/');
      } else if (e.key === 'p') {
        setAutoPlay(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [advance, goBack, router]);

  const currentScreen = SCREENS[currentIndex];

  return (
    <div className="fixed inset-0 bg-black">
      <AnimatePresence mode="wait">
        {currentScreen.type === 'hook' && (
          <HookScreen key={currentScreen.id} screen={currentScreen} onAdvance={advance} autoPlay={autoPlay} />
        )}
        {currentScreen.type === 'context' && (
          <ContextScreen key={currentScreen.id} screen={currentScreen} onAdvance={advance} autoPlay={autoPlay} />
        )}
        {currentScreen.type === 'intro' && (
          <IntroScreen key={currentScreen.id} screen={currentScreen} onAdvance={advance} autoPlay={autoPlay} />
        )}
        {currentScreen.type === 'phase' && (
          <PhaseScreen key={currentScreen.id} screen={currentScreen} onAdvance={advance} autoPlay={autoPlay} />
        )}
        {currentScreen.type === 'stats' && (
          <StatsScreen key={currentScreen.id} screen={currentScreen} onAdvance={advance} autoPlay={autoPlay} />
        )}
        {currentScreen.type === 'reflection' && (
          <ReflectionScreen key={currentScreen.id} screen={currentScreen} onAdvance={advance} autoPlay={autoPlay} />
        )}
        {currentScreen.type === 'outro' && (
          <OutroScreen key={currentScreen.id} screen={currentScreen} onAdvance={advance} autoPlay={autoPlay} />
        )}
      </AnimatePresence>

      {/* Navigation controls */}
      <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 flex items-center gap-2 sm:gap-4 z-50">
        {/* Progress indicator */}
        <div className="hidden sm:flex items-center gap-1">
          {SCREENS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === currentIndex ? 'bg-white w-4' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Mobile progress */}
        <div className="sm:hidden text-white/40 text-xs font-mono">
          {currentIndex + 1}/{SCREENS.length}
        </div>

        {/* Play/Pause */}
        <button
          onClick={() => setAutoPlay(prev => !prev)}
          className="p-2 text-white/50 hover:text-white transition-colors"
          title={autoPlay ? 'Pause (P)' : 'Play (P)'}
        >
          {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Nav buttons */}
        <button
          onClick={goBack}
          disabled={currentIndex === 0}
          className="p-2 text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={advance}
          disabled={currentIndex === SCREENS.length - 1}
          className="p-2 text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => router.push('/')}
          className="p-2 text-white/50 hover:text-white transition-colors"
          title="Exit (Esc)"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>

      {/* Skip all */}
      <button
        onClick={() => setCurrentIndex(SCREENS.length - 1)}
        className="fixed top-4 sm:top-8 right-4 sm:right-8 text-white/30 hover:text-white/60 text-xs sm:text-sm flex items-center gap-1 transition-colors z-50"
      >
        Skip
        <SkipForward className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
}
