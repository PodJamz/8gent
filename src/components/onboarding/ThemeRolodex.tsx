'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { springs } from '@/components/motion/config';
import { THEME_SCREENSAVER_CONFIGS, getScreensaverPath } from '@/lib/themes/screensaver-prompts';
import { themes } from '@/lib/themes/definitions';
import Image from 'next/image';

interface ThemeRolodexProps {
  onSelect: (themeName: string) => void;
  selectedTheme?: string | null;
}

// Get themes with screensaver configs (in a nice order)
const THEME_ORDER = [
  // Warm & Cozy first (inviting)
  'kodachrome', 'mocha-mousse', 'caffeine', 'vintage-paper', 'sunset-horizon',
  // Nature
  'sage-garden', 'kodama-grove', 'ocean-breeze', 'nature', 'field-guide',
  // Cosmic
  'cosmic-night', 'starry-night', 'northern-lights', 'amethyst-haze',
  // Minimal
  'clean-slate', 'modern-minimal', 'tao', 'notebook', 'research',
  // Bold
  'cyberpunk', 'neo-brutalism', 'candyland', 'soft-pop', 'bold-tech',
  // Dark
  'midnight-bloom', 'perpetuity', 'doom-64',
  // Elegant
  'elegant-luxury', 'quantum-rose', 'violet-bloom', 'pastel-dreams',
  // Brand
  'claude', 'vercel', 'cursor', 'notion', 'apple',
  // More
  'retro-arcade', 'solar-dusk', 'amber-minimal', 'claymorphism', 'denim',
  'chatgpt', 'google', 'microsoft', 'miro', 'nike', 'adidas', 't3-chat',
  'utilitarian', 'base',
];

const orderedThemes = THEME_ORDER.filter(name => THEME_SCREENSAVER_CONFIGS[name])
  .map(name => ({
    name,
    config: THEME_SCREENSAVER_CONFIGS[name],
  }));

export function ThemeRolodex({ onSelect, selectedTheme }: ThemeRolodexProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const currentTheme = orderedThemes[currentIndex];
  const prevTheme = orderedThemes[(currentIndex - 1 + orderedThemes.length) % orderedThemes.length];
  const nextTheme = orderedThemes[(currentIndex + 1) % orderedThemes.length];

  // Card width for calculations
  const CARD_WIDTH = 220;
  const CARD_GAP = 16;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset < -threshold || velocity < -500) {
      // Swiped left - go to next
      setCurrentIndex((prev) => (prev + 1) % orderedThemes.length);
    } else if (offset > threshold || velocity > 500) {
      // Swiped right - go to previous
      setCurrentIndex((prev) => (prev - 1 + orderedThemes.length) % orderedThemes.length);
    }
  };

  const goToIndex = (index: number) => {
    if (!isAnimating) {
      setCurrentIndex(index);
    }
  };

  const handleSelect = () => {
    if (currentTheme && !selectedTheme) {
      onSelect(currentTheme.name);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedTheme) return;

      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + orderedThemes.length) % orderedThemes.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % orderedThemes.length);
      } else if (e.key === 'Enter' || e.key === ' ') {
        handleSelect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTheme, currentIndex]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Rolodex Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-lg h-[400px] flex items-center justify-center overflow-hidden"
      >
        {/* Previous Card (left, smaller) */}
        <motion.div
          className="absolute left-0 sm:left-4"
          initial={false}
          animate={{
            scale: 0.75,
            opacity: 0.5,
            x: 0,
          }}
          transition={springs.snappy}
        >
          <ThemeCard
            theme={prevTheme}
            isActive={false}
            onClick={() => goToIndex((currentIndex - 1 + orderedThemes.length) % orderedThemes.length)}
          />
        </motion.div>

        {/* Current Card (center, full size) */}
        <motion.div
          className="relative z-10"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ x }}
          whileTap={{ cursor: 'grabbing' }}
        >
          <ThemeCard
            theme={currentTheme}
            isActive={true}
            isSelected={selectedTheme === currentTheme.name}
            onClick={handleSelect}
          />
        </motion.div>

        {/* Next Card (right, smaller) */}
        <motion.div
          className="absolute right-0 sm:right-4"
          initial={false}
          animate={{
            scale: 0.75,
            opacity: 0.5,
            x: 0,
          }}
          transition={springs.snappy}
        >
          <ThemeCard
            theme={nextTheme}
            isActive={false}
            onClick={() => goToIndex((currentIndex + 1) % orderedThemes.length)}
          />
        </motion.div>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
        {orderedThemes.map((theme, index) => (
          <button
            key={theme.name}
            onClick={() => goToIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-current scale-125'
                : 'bg-current/20 hover:bg-current/40'
            }`}
            aria-label={`Go to ${theme.config.label}`}
          />
        ))}
      </div>

      {/* Theme info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-widest text-current/50">
            {currentTheme.config.category}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Instructions */}
      {!selectedTheme && (
        <motion.p
          className="text-sm text-current/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Swipe or use arrow keys to browse • Tap to select
        </motion.p>
      )}
    </div>
  );
}

interface ThemeCardProps {
  theme: { name: string; config: (typeof THEME_SCREENSAVER_CONFIGS)[string] };
  isActive: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

function ThemeCard({ theme, isActive, isSelected, onClick }: ThemeCardProps) {
  const [imageError, setImageError] = useState(false);
  const imagePath = getScreensaverPath(theme.name);

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative w-[200px] h-[340px] rounded-2xl overflow-hidden
        transition-shadow duration-300
        ${isActive ? 'shadow-2xl' : 'shadow-lg'}
        ${isSelected ? 'ring-4 ring-white' : ''}
      `}
      whileHover={isActive && !isSelected ? { scale: 1.02 } : {}}
      whileTap={isActive && !isSelected ? { scale: 0.98 } : {}}
      animate={isSelected ? { scale: 1.05 } : {}}
    >
      {/* Background Image or Gradient Fallback */}
      {!imageError ? (
        <Image
          src={imagePath}
          alt={theme.config.label}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
          sizes="200px"
          priority={isActive}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg,
              hsl(var(--theme-primary) / 0.8),
              hsl(var(--theme-secondary) / 0.6)
            )`,
          }}
        />
      )}

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Theme name */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white text-lg font-medium drop-shadow-lg">
          {theme.config.label}
        </h3>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-white/20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={springs.bouncy}
          >
            <svg
              className="w-16 h-16 text-white drop-shadow-lg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </motion.button>
  );
}

export default ThemeRolodex;
