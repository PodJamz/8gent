'use client';

import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useDesignThemeSafe } from '@/context/DesignThemeContext';
import '@/lib/themes/themes.css';
import {
  Play,
  Pause,
  Square,
  Circle,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  Mic,
  Mic2,
  Music,
  Music4,
  Sliders,
  FolderOpen,
  Plus,
  Grid3X3,
  Piano,
  Guitar,
  Waves,
  Clock,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Speaker,
  Home,
  Upload,
  Download,
  X,
  Check,
  AlertCircle,
  Loader2,
  FileAudio,
  Sparkles,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Settings,
  HelpCircle,
  Users,
  Share2,
  Scissors,
  Shuffle,
  Headphones,
  Radio,
  Disc3,
  AudioWaveform,
  Layers,
  Zap,
  Menu,
} from 'lucide-react';
import { PageTransition } from '@/components/ios';
import {
  JamzProject,
  JamzTrack,
  JamzClip,
  createEmptyProject,
  createTrack,
  createClip,
  generateId,
  beatsToSeconds,
  secondsToBeats,
  formatTime,
  formatBars,
  TRACK_COLORS,
  TRACK_COLOR_VALUES,
} from '@/lib/jamz';
import { useAudioEngine } from '@/lib/jamz/useAudioEngine';
import { saveProject, loadProject } from '@/lib/jamz/storage';
import { audioBufferToMp3, formatFileSize } from '@/lib/jamz/mp3Encoder';
import { useStemSeparation, StemType } from '@/lib/jamz/useStemSeparation';
import { GenerateView } from '@/components/jamz/GenerateView';
import { cn } from '@/lib/utils';

// ============================================================================
// Accessibility & Performance Utilities
// ============================================================================

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
};

// Skip to content link for accessibility
const SkipToContent = memo(function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-lg focus:outline-none"
    >
      Skip to main content
    </a>
  );
});

// ============================================================================
// Types
// ============================================================================

type ViewMode = 'arrange' | 'mixer' | 'browser';
type QuickJamAction = 'record' | 'upload' | 'template';

interface ClawAIMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  action?: {
    type: string;
    payload?: unknown;
  };
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

// ============================================================================
// Landing Page Data
// ============================================================================

// Available features - fully implemented
const availableFeatures: Feature[] = [
  {
    icon: <AudioWaveform className="w-6 h-6" />,
    title: 'Multi-Track Recording',
    description: 'Layer unlimited tracks with professional-grade audio capture and real-time monitoring.',
    gradient: 'from-cyan-500 to-teal-600',
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: 'Export to WAV & MP3',
    description: 'Export your finished tracks in high-quality formats ready for sharing or distribution.',
    gradient: 'from-emerald-500 to-green-600',
  },
  {
    icon: <Scissors className="w-6 h-6" />,
    title: 'Stem Separation',
    description: 'Isolate vocals, drums, bass, and more from any audio file using advanced processing.',
    gradient: 'from-amber-500 to-orange-600',
  },
];

// Coming soon features - in development
const comingSoonFeatures: Feature[] = [
  {
    icon: <Sliders className="w-6 h-6" />,
    title: 'AI-Powered Mixing',
    description: 'Intelligent auto-mixing that learns your style and enhances your sound automatically.',
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    icon: <Piano className="w-6 h-6" />,
    title: 'Virtual Instruments',
    description: 'Play synthesizers, pianos, drums, and more, all directly in your browser.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Sample Library',
    description: 'Thousands of royalty-free samples, loops, and one-shots at your fingertips.',
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Real-Time Collaboration',
    description: 'Jam with friends anywhere in the world with zero-latency sync technology.',
    gradient: 'from-yellow-500 to-amber-600',
  },
];

// Combined for backwards compat
const features = [...availableFeatures, ...comingSoonFeatures];

// ============================================================================
// Claw AI Actions
// ============================================================================

const CLAW_AI_ACTIONS = {
  CREATE_TRACK: 'create_track',
  DELETE_TRACK: 'delete_track',
  SET_BPM: 'set_bpm',
  ADD_LOOP: 'add_loop',
  START_RECORDING: 'start_recording',
  STOP_RECORDING: 'stop_recording',
  EXPORT_MIX: 'export_mix',
  EXPORT_STEMS: 'export_stems',
  PLAY: 'play',
  STOP: 'stop',
  MUTE_TRACK: 'mute_track',
  SOLO_TRACK: 'solo_track',
  SET_VOLUME: 'set_volume',
  IMPORT_FILE: 'import_file',
  SEPARATE_STEMS: 'separate_stems',
} as const;

// ============================================================================
// Theme-aware colors
// ============================================================================

const getThemeColors = (theme: string | undefined, resolvedTheme: string | undefined) => {
  const isDark = resolvedTheme === 'dark' || resolvedTheme === undefined;
  return {
    bg: isDark ? 'bg-zinc-950' : 'bg-slate-50',
    bgSecondary: isDark ? 'bg-zinc-900' : 'bg-white',
    bgTertiary: isDark ? 'bg-zinc-800' : 'bg-slate-100',
    text: isDark ? 'text-white' : 'text-slate-900',
    textSecondary: isDark ? 'text-white/80' : 'text-slate-700',
    textMuted: isDark ? 'text-white/60' : 'text-slate-600',
    textFaint: isDark ? 'text-white/40' : 'text-slate-400',
    border: isDark ? 'border-white/10' : 'border-slate-200',
    borderHover: isDark ? 'border-white/20' : 'border-slate-300',
    card: isDark ? 'bg-white/5' : 'bg-white',
    cardHover: isDark ? 'bg-white/10' : 'bg-slate-50',
    isDark,
  };
};

// ============================================================================
// Landing Page Components (Optimized for Performance & Accessibility)
// ============================================================================

const AnimatedBackground = memo(function AnimatedBackground({
  isDark,
  reducedMotion = false
}: {
  isDark: boolean;
  reducedMotion?: boolean;
}) {
  // Use CSS animations for better performance, skip on reduced motion
  if (reducedMotion) {
    return (
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-black via-zinc-950 to-black' : 'bg-gradient-to-br from-slate-100 via-white to-slate-100'}`} />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-black via-zinc-950 to-black' : 'bg-gradient-to-br from-slate-100 via-white to-slate-100'}`} />
      <div
        className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] rounded-full opacity-20 will-change-transform animate-float-slow"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)',
          top: '10%',
          left: '10%',
        }}
      />
      <div
        className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] rounded-full opacity-15 will-change-transform animate-float-slower"
        style={{
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.35) 0%, transparent 70%)',
          bottom: '20%',
          right: '5%',
        }}
      />
      <div
        className={`absolute inset-0 ${isDark ? 'opacity-[0.03]' : 'opacity-[0.05]'}`}
        style={{
          backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 25px) scale(1.1); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, -30px) scale(1.15); }
        }
        .animate-float-slow { animation: float-slow 20s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 25s ease-in-out infinite; }
      `}</style>
    </div>
  );
});

const WaveformVisualizer = memo(function WaveformVisualizer({
  reducedMotion = false
}: {
  reducedMotion?: boolean;
}) {
  // Use fewer bars on mobile for performance
  const isMobile = useMediaQuery('(max-width: 640px)');
  const bars = isMobile ? 20 : 40;

  // Static version for reduced motion
  if (reducedMotion) {
    return (
      <div
        className="flex items-end justify-center gap-1 h-24"
        role="img"
        aria-label="Audio waveform visualization"
      >
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-full"
            style={{ height: `${30 + (Math.sin(i * 0.3) * 20 + 20)}%` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex items-end justify-center gap-0.5 sm:gap-1 h-16 sm:h-24"
      role="img"
      aria-label="Animated audio waveform visualization"
    >
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="w-0.5 sm:w-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-full will-change-transform"
          style={{
            animation: `waveform ${0.5 + (i % 5) * 0.1}s ease-in-out infinite`,
            animationDelay: `${i * 0.02}s`,
            height: '30%',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes waveform {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2.5); }
        }
      `}</style>
    </div>
  );
});

const FeatureCard = memo(function FeatureCard({
  feature,
  index,
  colors,
  reducedMotion = false,
  isComingSoon = false
}: {
  feature: Feature;
  index: number;
  colors: ReturnType<typeof getThemeColors>;
  reducedMotion?: boolean;
  isComingSoon?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = reducedMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 + index * 0.1 } } };

  return (
    <motion.article
      variants={cardVariants}
      initial="initial"
      animate="animate"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="group relative"
      tabIndex={0}
      role="article"
      aria-label={`${feature.title}: ${feature.description}${isComingSoon ? ' (Coming Soon)' : ''}`}
    >
      <div className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 ${colors.card} border ${colors.border} backdrop-blur-xl transition-all duration-300 ease-out ${isHovered ? `${colors.borderHover} shadow-2xl -translate-y-1` : ''} focus-within:ring-2 focus-within:ring-cyan-500 ${isComingSoon ? 'opacity-80' : ''}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 group-focus-within:opacity-10 transition-opacity duration-300`} />
        {isComingSoon && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
            <span className="text-amber-400 text-[10px] font-medium">Soon</span>
          </div>
        )}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-3 sm:mb-4 bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg ${isComingSoon ? 'grayscale-[30%]' : ''}`} aria-hidden="true">
          {feature.icon}
        </div>
        <h3 className={`text-base sm:text-lg font-bold ${colors.text} mb-1 sm:mb-2`}>{feature.title}</h3>
        <p className={`text-xs sm:text-sm ${colors.textFaint} leading-relaxed`}>{feature.description}</p>
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient} transition-transform duration-300 origin-left ${isHovered ? 'scale-x-100' : 'scale-x-0'}`}
          aria-hidden="true"
        />
      </div>
    </motion.article>
  );
});

const DAWPreview = memo(function DAWPreview({
  colors,
  reducedMotion = false
}: {
  colors: ReturnType<typeof getThemeColors>;
  reducedMotion?: boolean;
}) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const tracks = useMemo(() => [
    { name: 'Drums', color: 'bg-cyan-500', width: '100%' },
    { name: 'Bass', color: 'bg-cyan-500', width: '85%' },
    { name: 'Synth Lead', color: 'bg-pink-500', width: '70%' },
    { name: 'Vocals', color: 'bg-amber-500', width: '60%' },
    { name: 'FX', color: 'bg-emerald-500', width: '45%' },
  ], []);

  // Use fewer waveform bars on mobile
  const waveformBars = isMobile ? 30 : 60;

  // Pre-generate random heights for performance
  const waveformHeights = useMemo(
    () => tracks.map(() => Array.from({ length: waveformBars }, () => 20 + Math.random() * 60)),
    [tracks, waveformBars]
  );

  const containerVariants = reducedMotion
    ? { initial: { opacity: 1, scale: 1 }, animate: { opacity: 1, scale: 1 } }
    : { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.3 } } };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="relative w-full max-w-4xl mx-auto px-2 sm:px-0"
      role="img"
      aria-label="Digital Audio Workstation preview showing 5 audio tracks: Drums, Bass, Synth Lead, Vocals, and FX"
    >
      <div className={`rounded-xl sm:rounded-2xl overflow-hidden border ${colors.border} ${colors.isDark ? 'bg-black/50' : 'bg-white/80'} backdrop-blur-xl shadow-2xl`}>
        {/* Window Controls */}
        <div className={`flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b ${colors.border} ${colors.card}`}>
          <div className="flex items-center gap-1.5 sm:gap-2" aria-hidden="true">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Disc3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" aria-hidden="true" />
            <span className={`text-xs sm:text-sm ${colors.textMuted} font-medium`}>Jamz Studio</span>
          </div>
          <div className="w-12 sm:w-16" />
        </div>

        {/* Transport Controls */}
        <div className={`flex items-center justify-center gap-2 sm:gap-4 py-3 sm:py-4 border-b ${colors.border} ${colors.card}`}>
          <button className={`p-1.5 sm:p-2 ${colors.textFaint} hover:${colors.text} transition-colors touch-manipulation`} aria-label="Shuffle" tabIndex={-1}>
            <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button className={`p-1.5 sm:p-2 ${colors.textMuted} hover:${colors.text} transition-colors touch-manipulation`} aria-label="Previous track" tabIndex={-1}>
            <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className="p-2.5 sm:p-3 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-500 text-white shadow-lg hover:shadow-cyan-500/25 transition-shadow touch-manipulation" aria-label="Play" tabIndex={-1}>
            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className={`p-1.5 sm:p-2 ${colors.textMuted} hover:${colors.text} transition-colors touch-manipulation`} aria-label="Next track" tabIndex={-1}>
            <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className={`p-1.5 sm:p-2 ${colors.textFaint} hover:${colors.text} transition-colors touch-manipulation`} aria-label="Repeat" tabIndex={-1}>
            <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Tracks */}
        <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
          {tracks.map((track, i) => (
            <div
              key={track.name}
              className={`flex items-center gap-2 sm:gap-3 ${!reducedMotion ? 'animate-fade-in' : ''}`}
              style={{ animationDelay: reducedMotion ? '0ms' : `${500 + i * 100}ms` }}
            >
              <div className="w-16 sm:w-24 flex-shrink-0">
                <div className={`text-[10px] sm:text-xs font-medium ${colors.textMuted} truncate`}>{track.name}</div>
              </div>
              <div className={`flex-1 h-8 sm:h-10 rounded-md sm:rounded-lg ${colors.card} overflow-hidden relative`}>
                <div
                  className={`absolute inset-y-0 left-0 ${track.color} opacity-30 transition-all duration-1000`}
                  style={{ width: reducedMotion ? track.width : track.width }}
                />
                <div className="absolute inset-0 flex items-center px-1 sm:px-2 gap-px">
                  {waveformHeights[i].map((height, j) => (
                    <div
                      key={j}
                      className={`w-0.5 sm:w-1 ${track.color} rounded-full opacity-60`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="w-6 sm:w-8 flex-shrink-0">
                <Volume2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colors.textFaint}`} aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="px-2 sm:px-4 pb-3 sm:pb-4">
          <div className={`flex items-center gap-2 text-[10px] sm:text-xs ${colors.textFaint}`}>
            <span>0:00</span>
            <div className={`flex-1 h-1 ${colors.bgTertiary} rounded-full overflow-hidden`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={35}>
              <div
                className={`h-full bg-gradient-to-r from-cyan-500 to-teal-500 ${!reducedMotion ? 'transition-all duration-[2000ms]' : ''}`}
                style={{ width: '35%' }}
              />
            </div>
            <span>3:45</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </motion.div>
  );
});

// ============================================================================
// Landing Page Component (Optimized for Performance, Mobile, Accessibility)
// ============================================================================

const LandingPage = memo(function LandingPage({
  onEnterStudio,
  colors,
  reducedMotion = false,
  themeClass = '',
}: {
  onEnterStudio: () => void;
  colors: ReturnType<typeof getThemeColors>;
  reducedMotion?: boolean;
  themeClass?: string;
}) {
  const instruments = useMemo(() => [
    { icon: <Piano className="w-6 h-6 sm:w-8 sm:h-8" />, name: 'Piano', color: 'from-sky-500 to-blue-600' },
    { icon: <Guitar className="w-6 h-6 sm:w-8 sm:h-8" />, name: 'Guitar', color: 'from-amber-500 to-orange-600' },
    { icon: <AudioWaveform className="w-6 h-6 sm:w-8 sm:h-8" />, name: 'Drums', color: 'from-rose-500 to-pink-600' },
    { icon: <Mic2 className="w-6 h-6 sm:w-8 sm:h-8" />, name: 'Vocals', color: 'from-cyan-500 to-teal-600' },
    { icon: <Waves className="w-6 h-6 sm:w-8 sm:h-8" />, name: 'Synth', color: 'from-emerald-500 to-green-600' },
    { icon: <Radio className="w-6 h-6 sm:w-8 sm:h-8" />, name: 'Bass', color: 'from-yellow-500 to-amber-600' },
  ], []);

  // Animation variants for reduced motion support
  const fadeInVariants = reducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  const scaleInVariants = reducedMotion
    ? { initial: { opacity: 1, scale: 1 }, animate: { opacity: 1, scale: 1 } }
    : { initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 } };

  return (
    <main
      id="main-content"
      className={`min-h-screen ${colors.bg} ${colors.text} relative ${themeClass}`}
      role="main"
    >
      <AnimatedBackground isDark={colors.isDark} reducedMotion={reducedMotion} />

      <div className="relative z-10">
        {/* Fixed Navigation Header */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 ${colors.bgSecondary}/80 backdrop-blur-xl border-b ${colors.border}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-xl ${colors.card} border ${colors.border} hover:border-cyan-500/50 transition-all group focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              aria-label="Return to OpenClaw-OS home"
            >
              <Home className={`w-4 h-4 ${colors.textMuted} group-hover:text-cyan-400 transition-colors`} />
              <span className={`text-sm font-medium ${colors.textSecondary} group-hover:text-cyan-400 transition-colors hidden sm:inline`}>OpenClaw-OS</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                <Music4 className="w-4 h-4 text-white" />
              </div>
              <span className={`text-sm font-semibold ${colors.text}`}>Jamz</span>
            </div>
            <button
              onClick={onEnterStudio}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Open Studio</span>
            </button>
          </div>
        </nav>

        {/* Hero Section - add top padding for fixed header */}
        <section
          className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 sm:pb-20"
          aria-labelledby="hero-title"
        >
          {/* Logo */}
          <motion.div
            variants={scaleInVariants}
            initial="initial"
            animate="animate"
            transition={reducedMotion ? {} : { duration: 0.6, type: 'spring' }}
            className="mb-6 sm:mb-8"
          >
            <div className="relative">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-cyan-500/30"
                role="img"
                aria-label="Jamz Studio logo"
              >
                <Music4 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
              </div>
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cyan-500 to-teal-500 blur-2xl opacity-40 -z-10" aria-hidden="true" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            variants={fadeInVariants}
            initial="initial"
            animate="animate"
            transition={reducedMotion ? {} : { duration: 0.6, delay: 0.2 }}
            className="text-center mb-4 sm:mb-6"
          >
            <h1 id="hero-title" className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-2 sm:mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Jamz</span>
            </h1>
            <p className={`text-lg sm:text-xl md:text-2xl ${colors.textFaint} font-light`}>Music Studio</p>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeInVariants}
            initial="initial"
            animate="animate"
            transition={reducedMotion ? {} : { duration: 0.6, delay: 0.3 }}
            className={`text-base sm:text-lg md:text-xl ${colors.textMuted} max-w-2xl text-center mb-6 sm:mb-8 leading-relaxed px-4`}
          >
            A professional-grade digital audio workstation in your browser. Create, mix, and master your music with AI-powered tools.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            variants={fadeInVariants}
            initial="initial"
            animate="animate"
            transition={reducedMotion ? {} : { duration: 0.6, delay: 0.4 }}
            className="mb-8 sm:mb-12"
          >
            <button
              onClick={onEnterStudio}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-transparent min-h-[48px] touch-manipulation"
              aria-label="Enter Jamz Studio"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              <span>Let&apos;s Jam</span>
            </button>
          </motion.div>

          {/* Waveform Visualizer */}
          <motion.div
            variants={fadeInVariants}
            initial="initial"
            animate="animate"
            transition={reducedMotion ? {} : { duration: 1, delay: 0.5 }}
            className="w-full max-w-xs sm:max-w-md mb-12 sm:mb-16"
          >
            <WaveformVisualizer reducedMotion={reducedMotion} />
          </motion.div>

          {/* DAW Preview */}
          <DAWPreview colors={colors} reducedMotion={reducedMotion} />
        </section>

        {/* Features Section */}
        <section
          className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
          aria-labelledby="features-title"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reducedMotion ? {} : { duration: 0.6 }}
              className="text-center mb-10 sm:mb-16"
            >
              <h2 id="features-title" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Everything You Need to{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Create</span>
              </h2>
              <p className={`${colors.textFaint} max-w-2xl mx-auto text-sm sm:text-base`}>
                Professional music production tools, reimagined for the modern creator.
              </p>
            </motion.div>

            {/* Available Now Section */}
            <div className="mb-12 sm:mb-16">
              <motion.div
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-sm font-medium">Available Now</span>
                </div>
                <div className={`h-px flex-1 ${colors.border}`} />
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" role="list">
                {availableFeatures.map((feature, index) => (
                  <FeatureCard key={feature.title} feature={feature} index={index} colors={colors} reducedMotion={reducedMotion} />
                ))}
              </div>
            </div>

            {/* Coming Soon Section */}
            <div>
              <motion.div
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400 text-sm font-medium">Coming Soon</span>
                </div>
                <div className={`h-px flex-1 ${colors.border}`} />
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" role="list">
                {comingSoonFeatures.map((feature, index) => (
                  <FeatureCard key={feature.title} feature={feature} index={index + 3} colors={colors} reducedMotion={reducedMotion} isComingSoon />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Instruments Section */}
        <section
          className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
          aria-labelledby="instruments-title"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 id="instruments-title" className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Virtual Instruments</h2>
              <p className={`${colors.textFaint} text-sm sm:text-base`}>Play any instrument, anywhere.</p>
            </motion.div>
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap sm:justify-center gap-4 sm:gap-6" role="list">
              {instruments.map((instrument, i) => (
                <motion.div
                  key={instrument.name}
                  initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={reducedMotion ? {} : { delay: i * 0.1 }}
                  whileHover={reducedMotion ? {} : { scale: 1.1, y: -5 }}
                  className="flex flex-col items-center gap-2 sm:gap-3"
                  role="listitem"
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${instrument.color} flex items-center justify-center text-white shadow-lg`}
                    aria-hidden="true"
                  >
                    {instrument.icon}
                  </div>
                  <span className={`text-xs sm:text-sm ${colors.textFaint}`}>{instrument.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
          aria-labelledby="cta-title"
        >
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl ${colors.card} border ${colors.border} backdrop-blur-xl`}>
              <Headphones className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 mx-auto mb-4 sm:mb-6" aria-hidden="true" />
              <h2 id="cta-title" className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Start Creating Today</h2>
              <p className={`${colors.textFaint} mb-6 sm:mb-8 text-sm sm:text-base`}>
                Record, mix, and export your tracks directly in your browser. More features coming soon.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={onEnterStudio}
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-shadow focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 min-h-[44px] touch-manipulation"
                >
                  <Play className="w-4 h-4" aria-hidden="true" />
                  Open Studio
                </button>
                <Link
                  href="/"
                  className={`inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full ${colors.card} ${colors.text} font-medium hover:opacity-80 transition-colors border ${colors.border} focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 min-h-[44px] touch-manipulation`}
                >
                  ← Back to OpenClaw-OS
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className={`px-4 sm:px-6 lg:px-8 py-6 sm:py-8 border-t ${colors.border}`} role="contentinfo">
          <div className="max-w-6xl mx-auto text-center">
            <p className={`text-xs sm:text-sm ${colors.textFaint}`}>
              Design inspired by{' '}
              <a
                href="https://x.com/joelbqz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2"
              >
                @joelbqz
              </a>
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
});

// ============================================================================
// Studio Components (Optimized for Performance, Mobile, Accessibility)
// ============================================================================

const TransportControls = memo(function TransportControls({
  isPlaying,
  isRecording,
  currentBeat,
  bpm,
  loop,
  inputLevel,
  colors,
  onPlayPause,
  onStop,
  onRecord,
  onBpmChange,
  onLoopToggle,
}: {
  isPlaying: boolean;
  isRecording: boolean;
  currentBeat: number;
  bpm: number;
  loop: boolean;
  inputLevel: number;
  colors: ReturnType<typeof getThemeColors>;
  onPlayPause: () => void;
  onStop: () => void;
  onRecord: () => void;
  onBpmChange: (bpm: number) => void;
  onLoopToggle: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-center gap-2 sm:gap-4 py-2 sm:py-3 px-2 sm:px-4 border-b ${colors.border} ${colors.bgSecondary}`}
      role="toolbar"
      aria-label="Transport controls"
    >
      {/* Stop Button */}
      <button
        onClick={onStop}
        className={`p-2 sm:p-2.5 rounded-lg ${colors.card} ${colors.textFaint} hover:${colors.text} hover:${colors.cardHover} transition-colors min-w-[40px] min-h-[40px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-500`}
        aria-label="Stop"
      >
        <Square className="w-4 h-4" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={onPlayPause}
        className={`p-2.5 sm:p-3 rounded-full ${isPlaying ? 'bg-cyan-500' : 'bg-gradient-to-r from-cyan-500 to-cyan-500'} text-white shadow-lg transition-all min-w-[44px] min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        aria-pressed={isPlaying}
      >
        {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
      </button>

      {/* Record Button */}
      <button
        onClick={onRecord}
        className={`p-2 sm:p-2.5 rounded-lg ${isRecording ? 'bg-red-500 text-white' : `${colors.card} ${colors.textFaint} hover:text-red-400`} transition-colors min-w-[40px] min-h-[40px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-red-500 ${isRecording ? 'animate-pulse' : ''}`}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        aria-pressed={isRecording}
      >
        <Circle className="w-4 h-4" />
      </button>

      {/* Divider - hidden on mobile */}
      <div className={`w-px h-6 ${colors.isDark ? 'bg-white/10' : 'bg-slate-200'} hidden sm:block`} aria-hidden="true" />

      {/* BPM Control - hidden on mobile */}
      <div className="hidden sm:flex items-center gap-2">
        <label htmlFor="bpm-input" className={`text-xs ${colors.textFaint}`}>BPM</label>
        <input
          id="bpm-input"
          type="number"
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          min={40}
          max={300}
          className={`w-14 px-2 py-1 rounded ${colors.card} ${colors.text} text-sm text-center border ${colors.border} focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500`}
          aria-label="Beats per minute"
        />
      </div>

      {/* Loop Toggle */}
      <button
        onClick={onLoopToggle}
        className={`p-2 sm:p-2.5 rounded-lg ${loop ? 'bg-cyan-500/20 text-cyan-400' : `${colors.card} ${colors.textFaint}`} transition-colors min-w-[40px] min-h-[40px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-500`}
        aria-label={loop ? 'Disable loop' : 'Enable loop'}
        aria-pressed={loop}
      >
        <Repeat className="w-4 h-4" />
      </button>

      {/* Time Display */}
      <div className={`text-xs sm:text-sm font-mono ${colors.textMuted} min-w-[50px] text-center`} aria-live="polite" aria-label="Current position">
        {formatBars(currentBeat)}
      </div>
    </div>
  );
});

// ============================================================================
// Main Studio Page (Optimized for Performance, Mobile, Accessibility)
// ============================================================================

export default function StudioPage() {
  const { theme, resolvedTheme } = useTheme();
  const { theme: designTheme } = useDesignThemeSafe();
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion ?? false;
  const colors = useMemo(() => getThemeColors(theme, resolvedTheme), [theme, resolvedTheme]);
  const isMobile = useMediaQuery('(max-width: 640px)');

  // Apply design theme class for CSS variable inheritance
  const themeClass = `theme-${designTheme}`;

  const [showStudio, setShowStudio] = useState(false);
  const [project, setProject] = useState<JamzProject | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('arrange');
  const [zoom, setZoom] = useState(1);
  const [showQuickJam, setShowQuickJam] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [recordingTrackId, setRecordingTrackId] = useState<string | null>(null);

  const engine = useAudioEngine(project);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalBeats = 64;

  useEffect(() => {
    setMounted(true);
    // Always show landing page first per user request
    // Load any saved project in background but don't auto-enter studio
    try {
      const saved = loadProject();
      if (saved) {
        setProject(saved);
        // Don't auto-enter studio - always show landing page first
      }
    } catch (e) {
      // Handle corrupted localStorage data gracefully
      console.warn('Failed to load saved project:', e);
    }
  }, []);

  useEffect(() => {
    if (project) saveProject(project);
  }, [project]);

  const addTrack = useCallback((name: string, type: 'audio' | 'midi' = 'audio') => {
    setProject(prev => {
      if (!prev) return prev;
      const newTrack = createTrack(name, type, prev.tracks.length);
      return { ...prev, tracks: [...prev.tracks, newTrack], updatedAt: Date.now() };
    });
  }, []);

  const updateTrack = useCallback((trackId: string, updates: Partial<JamzTrack>) => {
    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        tracks: prev.tracks.map(t => t.id === trackId ? { ...t, ...updates } : t),
        updatedAt: Date.now(),
      };
    });
  }, []);

  const handleEnterStudio = useCallback(() => {
    if (!project) {
      const newProject = createEmptyProject('Untitled');
      setProject(newProject);
    }
    setShowStudio(true);
    setShowQuickJam(true);
  }, [project]);

  const handleExportMix = useCallback(async (format: 'wav' | 'mp3') => {
    if (!project) return;
    setIsExporting(true);
    try {
      const blob = await engine.exportMix(format, 0, project.loopEnd);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name.replace(/[^a-z0-9]/gi, '_')}_mix.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('Export failed:', e);
    }
    setIsExporting(false);
    setShowExport(false);
  }, [project, engine]);

  // Handle recording toggle
  const handleRecord = useCallback(async () => {
    if (!project) return;

    if (engine.isRecording) {
      // Stop recording
      const result = await engine.stopRecording();
      if (result && recordingTrackId) {
        // Convert AudioBuffer to MP3 blob and create URL
        const mp3Blob = await audioBufferToMp3(result.buffer);
        const audioUrl = URL.createObjectURL(mp3Blob);

        // Create a clip from the recording
        const newClip = createClip(
          `Recording ${new Date().toLocaleTimeString()}`,
          0, // startBeat
          Math.ceil(result.buffer.duration * project.bpm / 60), // lengthBeats
          audioUrl
        );
        // Add clip to the track
        setProject(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            tracks: prev.tracks.map(t =>
              t.id === recordingTrackId
                ? { ...t, clips: [...t.clips, newClip] }
                : t
            ),
            updatedAt: Date.now(),
          };
        });
      }
      setRecordingTrackId(null);
    } else {
      // Start recording - find the first armed track or create one
      let targetTrackId = project.tracks.find(t => t.armed)?.id;

      if (!targetTrackId) {
        // If no track is armed, create a new track and arm it
        const newTrack = createTrack('Recording', 'audio', project.tracks.length);
        newTrack.armed = true;
        setProject(prev => {
          if (!prev) return prev;
          return { ...prev, tracks: [...prev.tracks, newTrack], updatedAt: Date.now() };
        });
        targetTrackId = newTrack.id;
      }

      setRecordingTrackId(targetTrackId);
      await engine.startRecording(targetTrackId);
    }
  }, [project, engine, recordingTrackId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if in input fields
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (engine.isPlaying) engine.pause();
          else engine.play();
          break;
        case 'Escape':
          setShowQuickJam(false);
          setShowExport(false);
          setShowMobileMenu(false);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine]);

  // Loading state
  if (!mounted) {
    return (
      <div className="h-dvh flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
            <Music className="w-6 h-6 text-white" />
          </div>
          <p className="text-white/60 text-sm">Loading Jamz Studio...</p>
        </div>
      </div>
    );
  }

  // Show landing page
  if (!showStudio) {
    return (
      <PageTransition>
        <SkipToContent />
        <LandingPage onEnterStudio={handleEnterStudio} colors={colors} reducedMotion={reducedMotion} themeClass={themeClass} />
      </PageTransition>
    );
  }

  // View options for navigation
  const viewOptions = [
    { id: 'arrange' as const, label: 'Arrange', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: 'mixer' as const, label: 'Mixer', icon: <Sliders className="w-4 h-4" /> },
    { id: 'browser' as const, label: 'Generate', icon: <Sparkles className="w-4 h-4" /> },
  ];

  // Show Studio
  return (
    <PageTransition>
      <SkipToContent />
      <div className={`h-dvh flex flex-col ${colors.bg} ${colors.text} overflow-hidden ${themeClass}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="sr-only"
          aria-label="Upload audio file"
        />

        {/* Top Bar */}
        <header
          className={`flex items-center justify-between px-2 sm:px-4 py-2 ${colors.bgSecondary} border-b ${colors.border}`}
          role="banner"
        >
          {/* Left: Home & Project Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowStudio(false)}
              className={`p-2 rounded-lg ${colors.textFaint} hover:${colors.text} hover:${colors.cardHover} transition-colors min-w-[40px] min-h-[40px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              aria-label="Return to landing page"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className={`w-px h-6 ${colors.isDark ? 'bg-white/10' : 'bg-slate-200'} hidden sm:block`} aria-hidden="true" />
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-500 flex items-center justify-center flex-shrink-0"
                aria-hidden="true"
              >
                <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className={`text-xs sm:text-sm font-semibold ${colors.text} truncate max-w-[100px] sm:max-w-none`}>
                  {project?.name || 'Jamz Studio'}
                </h1>
                <p className={`text-[10px] ${colors.textFaint} hidden sm:block`}>
                  {project ? `${project.tracks.length} tracks` : 'No project'}
                </p>
              </div>
            </div>
          </div>

          {/* Center: View Tabs (desktop) */}
          <nav
            className={`hidden sm:flex items-center gap-1 p-1 ${colors.bgTertiary} rounded-lg`}
            role="tablist"
            aria-label="View selection"
          >
            {viewOptions.map((view) => (
              <button
                key={view.id}
                onClick={() => setCurrentView(view.id)}
                role="tab"
                aria-selected={currentView === view.id}
                aria-controls={`${view.id}-panel`}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors min-h-[36px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-500 ${currentView === view.id ? 'bg-cyan-500 text-white' : `${colors.textFaint} hover:${colors.text} hover:${colors.cardHover}`
                  }`}
              >
                {view.icon}
                <span>{view.label}</span>
              </button>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Zoom controls - hidden on mobile */}
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
              className={`hidden sm:flex p-2 rounded-lg ${colors.textFaint} hover:${colors.text} hover:${colors.cardHover} transition-colors min-w-[36px] min-h-[36px] items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(z => Math.min(2, z + 0.25))}
              className={`hidden sm:flex p-2 rounded-lg ${colors.textFaint} hover:${colors.text} hover:${colors.cardHover} transition-colors min-w-[36px] min-h-[36px] items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className={`w-px h-6 ${colors.isDark ? 'bg-white/10' : 'bg-slate-200'} hidden sm:block`} aria-hidden="true" />

            {/* AI Generate Tab Toggle */}
            <button
              onClick={() => setCurrentView('browser')}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[36px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-purple-500 ${currentView === 'browser' ? 'bg-purple-600 text-white' : `${colors.textFaint}`}`}
              aria-label="AI Generate music"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI</span>
            </button>

            {/* AI Generate Button - switches to Generate tab */}
            <button
              onClick={() => setCurrentView('browser')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs sm:text-sm font-medium hover:bg-purple-700 transition-colors min-h-[36px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
              aria-label="AI Generate music"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">AI Generate</span>
            </button>

            {/* Export Button */}
            <button
              onClick={() => setShowExport(true)}
              disabled={!project || project.tracks.length === 0}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-500 text-white text-xs sm:text-sm font-medium hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              aria-label="Export project"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`sm:hidden p-2 rounded-lg ${colors.textFaint} hover:${colors.text} transition-colors min-w-[40px] min-h-[40px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              aria-label="Open menu"
              aria-expanded={showMobileMenu}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {showMobileMenu && isMobile && (
            <motion.div
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              className={`sm:hidden absolute top-14 left-0 right-0 z-40 ${colors.bgSecondary} border-b ${colors.border} shadow-lg`}
            >
              <nav className="p-2 space-y-1" role="tablist" aria-label="View selection">
                {viewOptions.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => { setCurrentView(view.id); setShowMobileMenu(false); }}
                    role="tab"
                    aria-selected={currentView === view.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors touch-manipulation ${currentView === view.id ? 'bg-cyan-500 text-white' : `${colors.text} ${colors.cardHover}`
                      }`}
                  >
                    {view.icon}
                    <span>{view.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transport */}
        {project && (
          <TransportControls
            isPlaying={engine.isPlaying}
            isRecording={engine.isRecording}
            currentBeat={engine.currentBeat}
            bpm={project.bpm}
            loop={project.loopEnabled}
            inputLevel={engine.inputLevel}
            colors={colors}
            onPlayPause={() => engine.isPlaying ? engine.pause() : engine.play()}
            onStop={engine.stop}
            onRecord={handleRecord}
            onBpmChange={(bpm) => setProject(prev => prev ? { ...prev, bpm } : prev)}
            onLoopToggle={() => setProject(prev => prev ? { ...prev, loopEnabled: !prev.loopEnabled } : prev)}
          />
        )}

        {/* Main Content */}
        <main
          id="main-content"
          className="flex-1 flex overflow-hidden"
          role="main"
          aria-label="Studio workspace"
        >
          <AnimatePresence mode="wait">
            {currentView === 'arrange' && project && (
              <motion.div
                key="arrange"
                id="arrange-panel"
                role="tabpanel"
                aria-labelledby="arrange-tab"
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* Timeline */}
                <div className={`h-6 sm:h-8 flex-shrink-0 ${colors.bgSecondary} border-b ${colors.border} flex items-center px-2 sm:px-4`} role="presentation" aria-hidden="true">
                  <div className="w-20 sm:w-32 flex-shrink-0" />
                  <div className="flex-1 flex items-center overflow-hidden">
                    {Array.from({ length: Math.ceil(totalBeats / 4) }).map((_, i) => (
                      <div key={i} className={`flex-1 text-[8px] sm:text-[10px] ${colors.textFaint}`} style={{ minWidth: `${(isMobile ? 60 : 100) * zoom}px` }}>{i + 1}</div>
                    ))}
                  </div>
                </div>

                {/* Tracks */}
                <div className="flex-1 overflow-auto" role="list" aria-label="Audio tracks">
                  {project.tracks.map((track, trackIndex) => (
                    <div
                      key={track.id}
                      className={`flex items-stretch border-b ${colors.border} h-16 sm:h-20`}
                      role="listitem"
                      aria-label={`Track ${trackIndex + 1}: ${track.name}`}
                    >
                      {/* Track Controls */}
                      <div className={`w-20 sm:w-32 flex-shrink-0 p-1.5 sm:p-2 ${colors.bgSecondary} border-r ${colors.border} flex flex-col justify-center`}>
                        <div className={`text-xs sm:text-sm font-medium ${colors.text} truncate`}>{track.name}</div>
                        <div className="flex items-center gap-0.5 sm:gap-1 mt-1">
                          <button
                            onClick={() => updateTrack(track.id, { mute: !track.mute })}
                            className={`px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[10px] rounded min-w-[20px] sm:min-w-[24px] touch-manipulation focus:outline-none focus:ring-1 focus:ring-cyan-500 ${track.mute ? 'bg-yellow-500 text-black' : `${colors.bgTertiary} ${colors.textFaint}`}`}
                            aria-label={`${track.mute ? 'Unmute' : 'Mute'} ${track.name}`}
                            aria-pressed={track.mute}
                          >
                            M
                          </button>
                          <button
                            onClick={() => updateTrack(track.id, { solo: !track.solo })}
                            className={`px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[10px] rounded min-w-[20px] sm:min-w-[24px] touch-manipulation focus:outline-none focus:ring-1 focus:ring-cyan-500 ${track.solo ? 'bg-cyan-500 text-black' : `${colors.bgTertiary} ${colors.textFaint}`}`}
                            aria-label={`${track.solo ? 'Unsolo' : 'Solo'} ${track.name}`}
                            aria-pressed={track.solo}
                          >
                            S
                          </button>
                          <button
                            onClick={() => updateTrack(track.id, { armed: !track.armed })}
                            className={`px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[10px] rounded min-w-[20px] sm:min-w-[24px] touch-manipulation focus:outline-none focus:ring-1 focus:ring-red-500 ${track.armed ? 'bg-red-500 text-white' : `${colors.bgTertiary} ${colors.textFaint}`}`}
                            aria-label={`${track.armed ? 'Disarm' : 'Arm'} ${track.name} for recording`}
                            aria-pressed={track.armed}
                          >
                            R
                          </button>
                        </div>
                      </div>

                      {/* Track Timeline */}
                      <div className={`flex-1 ${colors.bg} relative`}>
                        {track.clips.map((clip) => (
                          <div
                            key={clip.id}
                            className="absolute top-0.5 sm:top-1 bottom-0.5 sm:bottom-1 rounded-md sm:rounded-lg overflow-hidden"
                            style={{
                              left: `${(clip.startBeat / totalBeats) * 100}%`,
                              width: `${(clip.lengthBeats / totalBeats) * 100}%`,
                              backgroundColor: TRACK_COLOR_VALUES[track.color as keyof typeof TRACK_COLOR_VALUES] || '#8b5cf6',
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`Clip: ${clip.name}`}
                          >
                            <div className={`absolute inset-0 ${colors.isDark ? 'bg-black/20' : 'bg-white/20'}`} />
                            <div className={`p-0.5 sm:p-1 text-[8px] sm:text-[10px] ${colors.isDark ? 'text-white/80' : 'text-white'} truncate`}>{clip.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Add Track Button */}
                  <button
                    onClick={() => addTrack(`Track ${(project?.tracks.length || 0) + 1}`)}
                    className={`w-full p-3 sm:p-4 ${colors.card} border-b ${colors.border} flex items-center justify-center gap-2 ${colors.textFaint} hover:${colors.text} hover:${colors.cardHover} transition-colors min-h-[48px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-inset`}
                    aria-label="Add new track"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add Track</span>
                  </button>
                </div>
              </motion.div>
            )}

            {currentView === 'mixer' && project && (
              <motion.div
                key="mixer"
                id="mixer-panel"
                role="tabpanel"
                aria-labelledby="mixer-tab"
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
                className="flex-1 flex items-end justify-start sm:justify-center gap-2 sm:gap-3 p-3 sm:p-6 overflow-x-auto"
              >
                {project.tracks.map((track) => (
                  <div
                    key={track.id}
                    className={`flex flex-col items-center p-2 sm:p-3 ${colors.card} rounded-lg sm:rounded-xl border ${colors.border} min-w-[60px] sm:min-w-[80px]`}
                    role="group"
                    aria-label={`${track.name} mixer channel`}
                  >
                    <div className={`text-[10px] sm:text-xs font-medium ${colors.text} mb-2 sm:mb-3 truncate max-w-[50px] sm:max-w-[70px]`}>{track.name}</div>
                    <div className="relative h-24 sm:h-32 w-5 sm:w-6 mb-2 sm:mb-3" role="slider" aria-label={`${track.name} volume`} aria-valuenow={Math.round(track.volume * 100)} aria-valuemin={0} aria-valuemax={100}>
                      <div className={`absolute inset-0 ${colors.bgTertiary} rounded-full`} />
                      <div className="absolute bottom-0 left-0.5 right-0.5 sm:left-1 sm:right-1 rounded-full bg-gradient-to-t from-cyan-500 to-cyan-500" style={{ height: `${track.volume * 100}%` }} />
                    </div>
                    <div className={`text-[8px] sm:text-[10px] font-mono ${colors.textFaint} mb-1.5 sm:mb-2`}>{Math.round((track.volume - 1) * 100)} dB</div>
                    <div className="flex gap-0.5 sm:gap-1">
                      <button
                        onClick={() => updateTrack(track.id, { mute: !track.mute })}
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded text-[8px] sm:text-[10px] font-bold touch-manipulation focus:outline-none focus:ring-1 focus:ring-cyan-500 ${track.mute ? 'bg-yellow-500 text-black' : `${colors.bgTertiary} ${colors.textFaint}`}`}
                        aria-label={`${track.mute ? 'Unmute' : 'Mute'} ${track.name}`}
                        aria-pressed={track.mute}
                      >
                        M
                      </button>
                      <button
                        onClick={() => updateTrack(track.id, { solo: !track.solo })}
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded text-[8px] sm:text-[10px] font-bold touch-manipulation focus:outline-none focus:ring-1 focus:ring-cyan-500 ${track.solo ? 'bg-cyan-500 text-black' : `${colors.bgTertiary} ${colors.textFaint}`}`}
                        aria-label={`${track.solo ? 'Unsolo' : 'Solo'} ${track.name}`}
                        aria-pressed={track.solo}
                      >
                        S
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {currentView === 'browser' && (
              <motion.div
                key="generate"
                id="browser-panel"
                role="tabpanel"
                aria-labelledby="generate-tab"
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
                className="flex-1 flex overflow-hidden"
              >
                <GenerateView
                  colors={colors as Record<string, string | boolean>}
                  projectId={project?.id}
                  onAddToArrange={project ? (result) => {
                    // Create a new track with the generated audio
                    const colorIndex = project.tracks.length % TRACK_COLORS.length;
                    const newTrack = createTrack(result.title, 'audio', colorIndex);
                    const newClip = createClip(
                      result.title,
                      0, // Start at beat 0
                      secondsToBeats(result.duration, project.bpm)
                    );
                    // Attach audio URL to the clip
                    (newClip as JamzClip & { audioUrl?: string }).audioUrl = result.audioUrl;
                    newTrack.clips = [newClip];
                    setProject(prev => prev ? {
                      ...prev,
                      tracks: [...prev.tracks, newTrack],
                    } : prev);
                    // Switch to arrange view to see the new track
                    setCurrentView('arrange');
                  } : undefined}
                />
              </motion.div>
            )}

            {!project && currentView !== 'browser' && (
              <motion.div
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex items-center justify-center p-4"
              >
                <div className="text-center">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl ${colors.card} flex items-center justify-center`} aria-hidden="true">
                    <Music className={`w-6 h-6 sm:w-8 sm:h-8 ${colors.textFaint}`} />
                  </div>
                  <p className={`${colors.textFaint} text-xs sm:text-sm mb-3 sm:mb-4`}>No project open</p>
                  <button
                    onClick={() => setShowQuickJam(true)}
                    className="px-4 py-2.5 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors min-h-[44px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                  >
                    Start a Quick Jam
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Bottom Status Bar */}
        <footer className={`flex items-center justify-between px-2 sm:px-4 py-1.5 sm:py-2 ${colors.bgSecondary} border-t ${colors.border}`} role="contentinfo">
          <div className={`flex items-center gap-2 sm:gap-4 text-[8px] sm:text-[10px] ${colors.textFaint}`}>
            <span className="hidden sm:inline">Zoom: {Math.round(zoom * 100)}%</span>
            {project && (
              <>
                <span className="hidden sm:inline" aria-hidden="true">|</span>
                <span>{project.tracks.length} Tracks</span>
                <span aria-hidden="true">|</span>
                <span>{totalBeats / 4} Bars</span>
              </>
            )}
          </div>
          <div className={`text-[8px] sm:text-[10px] ${colors.textFaint}`}>
            Design by{' '}
            <a
              href="https://x.com/joelbqz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
            >
              @joelbqz
            </a>
          </div>
        </footer>

        {/* Quick Jam Dialog */}
        <AnimatePresence>
          {showQuickJam && (
            <motion.div
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="quickjam-title"
            >
              <motion.div
                initial={reducedMotion ? { scale: 1, y: 0 } : { scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={reducedMotion ? { scale: 1, y: 0 } : { scale: 0.9, y: 20 }}
                className={`relative w-full max-w-sm sm:max-w-lg p-4 sm:p-6 ${colors.bgSecondary} rounded-xl sm:rounded-2xl border ${colors.border}`}
              >
                <button
                  onClick={() => setShowQuickJam(false)}
                  className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-2 ${colors.textFaint} hover:${colors.text} transition-colors min-w-[40px] min-h-[40px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg`}
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 id="quickjam-title" className={`text-xl sm:text-2xl font-bold ${colors.text} mb-2`}>Quick Jam</h2>
                <p className={`${colors.textMuted} mb-4 sm:mb-6 text-sm`}>How would you like to start?</p>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {[
                    { id: 'record', icon: <Mic className="w-6 h-6 sm:w-8 sm:h-8" />, title: 'Record', desc: 'Capture vocals', gradient: 'from-red-500 to-rose-600' },
                    { id: 'upload', icon: <Upload className="w-6 h-6 sm:w-8 sm:h-8" />, title: 'Upload', desc: 'Import audio', gradient: 'from-cyan-500 to-teal-600' },
                    { id: 'template', icon: <Music className="w-6 h-6 sm:w-8 sm:h-8" />, title: 'Template', desc: 'Start with loops', gradient: 'from-cyan-500 to-blue-600' },
                    { id: 'ai-generate', icon: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />, title: 'AI Generate', desc: 'Create with AI', gradient: 'from-purple-500 to-violet-600' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        if (!project) {
                          const newProject = createEmptyProject(opt.id === 'ai-generate' ? 'AI Session' : 'Untitled');
                          setProject(newProject);
                        }
                        setShowQuickJam(false);
                        if (opt.id === 'ai-generate') {
                          setCurrentView('browser');
                        }
                      }}
                      className={`flex flex-col items-center p-2 sm:p-4 rounded-lg sm:rounded-xl ${colors.card} border ${colors.border} hover:${colors.borderHover} transition-all hover:-translate-y-1 touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[100px] sm:min-h-[140px]`}
                      aria-label={`${opt.title}: ${opt.desc}`}
                    >
                      <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br ${opt.gradient} flex items-center justify-center text-white mb-2 sm:mb-3`} aria-hidden="true">
                        {opt.icon}
                      </div>
                      <div className={`font-medium ${colors.text} text-xs sm:text-base`}>{opt.title}</div>
                      <div className={`text-[10px] sm:text-xs ${colors.textFaint} hidden sm:block`}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Export Dialog */}
        <AnimatePresence>
          {showExport && (
            <motion.div
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="export-title"
            >
              <motion.div
                initial={reducedMotion ? { scale: 1, y: 0 } : { scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={reducedMotion ? { scale: 1, y: 0 } : { scale: 0.9, y: 20 }}
                className={`relative w-full max-w-sm sm:max-w-md p-4 sm:p-6 ${colors.bgSecondary} rounded-xl sm:rounded-2xl border ${colors.border}`}
              >
                <button
                  onClick={() => setShowExport(false)}
                  className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-2 ${colors.textFaint} hover:${colors.text} transition-colors min-w-[40px] min-h-[40px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg`}
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 id="export-title" className={`text-lg sm:text-xl font-bold ${colors.text} mb-3 sm:mb-4`}>Export Project</h2>
                <div className="space-y-2 sm:space-y-3">
                  <button
                    onClick={() => handleExportMix('wav')}
                    disabled={isExporting}
                    className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl ${colors.card} border ${colors.border} hover:${colors.borderHover} transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed min-h-[60px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    aria-describedby="wav-desc"
                  >
                    <div className={`font-medium ${colors.text} text-sm sm:text-base`}>WAV (Best Quality)</div>
                    <div id="wav-desc" className={`text-xs sm:text-sm ${colors.textFaint}`}>Lossless audio format</div>
                  </button>
                  <button
                    onClick={() => handleExportMix('mp3')}
                    disabled={isExporting}
                    className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl ${colors.card} border ${colors.border} hover:${colors.borderHover} transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed min-h-[60px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    aria-describedby="mp3-desc"
                  >
                    <div className={`font-medium ${colors.text} text-sm sm:text-base`}>MP3 (Compressed)</div>
                    <div id="mp3-desc" className={`text-xs sm:text-sm ${colors.textFaint}`}>Smaller file size, 192kbps</div>
                  </button>
                </div>
                {isExporting && (
                  <div className={`mt-3 sm:mt-4 flex items-center justify-center gap-2 ${colors.textMuted}`} role="status" aria-live="polite">
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span className="text-sm">Exporting...</span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
