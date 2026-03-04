'use client';

import { useState, useMemo } from 'react';
import { useHorizontalScroll } from '@/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { Watch, Palette, Grid3X3, LayoutGrid, Search, X, Sparkles, Music } from 'lucide-react';
import { useDesignTheme } from '@/context/DesignThemeContext';
import { themes, type ThemeName, getThemeLabel } from '@/lib/themes/definitions';
import { themeToWatch, getWatchStyleDescription, type WatchStyle } from '@/lib/watch';
import { WatchFace } from '@/components/watch';
import { PageTransition } from '@/components/ios';
import { TextEffect, AnimatedGroup, FadeIn, FadeInUp } from '@/components/motion';
import '@/lib/themes/themes.css';

// Theme to soundtrack mapping (from public tracks)
const THEME_SOUNDTRACKS: Partial<Record<ThemeName, { trackId: string; title: string }>> = {
  // Claudebusters - warm, AI-themed, upbeat
  'claude': { trackId: '1', title: 'Claudebusters' },
  'northern-lights': { trackId: '1', title: 'Claudebusters' },
  'sunset-horizon': { trackId: '1', title: 'Claudebusters' },
  'caffeine': { trackId: '1', title: 'Claudebusters' },
  'mocha-mousse': { trackId: '1', title: 'Claudebusters' },

  // OpenClaw Remix - energetic, tech
  'cyberpunk': { trackId: '2', title: 'OpenClaw (Remix)' },
  'retro-arcade': { trackId: '2', title: 'OpenClaw (Remix)' },
  'bold-tech': { trackId: '2', title: 'OpenClaw (Remix)' },
  't3-chat': { trackId: '2', title: 'OpenClaw (Remix)' },

  // OpenClaw - clean, modern
  'base': { trackId: '3', title: 'OpenClaw' },
  'vercel': { trackId: '3', title: 'OpenClaw' },
  'modern-minimal': { trackId: '3', title: 'OpenClaw' },
  'clean-slate': { trackId: '3', title: 'OpenClaw' },
  'research': { trackId: '3', title: 'OpenClaw' },

  // Humans Are Optional - darker, moody
  'doom-64': { trackId: '4', title: 'Humans Are Optional' },
  'cosmic-night': { trackId: '4', title: 'Humans Are Optional' },
  'perpetuity': { trackId: '4', title: 'Humans Are Optional' },
  'midnight-bloom': { trackId: '4', title: 'Humans Are Optional' },
  'neo-brutalism': { trackId: '4', title: 'Humans Are Optional' },
};

// View modes
type ViewMode = 'gallery' | 'showcase';

// Style filter options
const STYLE_FILTERS: Array<{ value: WatchStyle | 'all'; label: string }> = [
  { value: 'all', label: 'All Styles' },
  { value: 'elegant', label: 'Elegant' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'sporty', label: 'Sporty' },
  { value: 'diver', label: 'Diver' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'field', label: 'Field' },
  { value: 'digital', label: 'Digital' },
];

export default function WatchPage() {
  const { theme: currentTheme, setTheme } = useDesignTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(currentTheme);
  const [styleFilter, setStyleFilter] = useState<WatchStyle | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const filterScrollRef = useHorizontalScroll<HTMLDivElement>();

  // Generate watch DNA for all themes
  const allWatches = useMemo(() => {
    return themes.map(t => ({
      theme: t.name,
      label: t.label,
      watchDNA: themeToWatch(t.name),
      soundtrack: THEME_SOUNDTRACKS[t.name],
    }));
  }, []);

  // Filter watches
  const filteredWatches = useMemo(() => {
    return allWatches.filter(watch => {
      const matchesStyle = styleFilter === 'all' || watch.watchDNA.style === styleFilter;
      const matchesSearch = searchQuery === '' ||
        watch.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        watch.watchDNA.style.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStyle && matchesSearch;
    });
  }, [allWatches, styleFilter, searchQuery]);

  // Selected watch data
  const selectedWatch = useMemo(() => {
    return allWatches.find(w => w.theme === selectedTheme);
  }, [allWatches, selectedTheme]);

  // Handle theme selection
  const handleSelectTheme = (theme: ThemeName) => {
    setSelectedTheme(theme);
    if (viewMode === 'gallery') {
      setViewMode('showcase');
    }
  };

  // Apply theme to site
  const handleApplyTheme = () => {
    setTheme(selectedTheme);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background" data-design-theme={selectedTheme}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Watch className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Watch Collection</h1>
                  <p className="text-sm text-muted-foreground">
                    {filteredWatches.length} procedurally generated timepieces
                  </p>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('gallery')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'gallery'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  aria-label="Gallery view"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('showcase')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'showcase'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  aria-label="Showcase view"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mt-4">
              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search themes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Style Filter */}
              <div ref={filterScrollRef} className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
                {STYLE_FILTERS.map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setStyleFilter(filter.value)}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${styleFilter === filter.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <AnimatePresence mode="wait">
            {viewMode === 'gallery' ? (
              <GalleryView
                key="gallery"
                watches={filteredWatches}
                selectedTheme={selectedTheme}
                onSelect={handleSelectTheme}
              />
            ) : (
              <ShowcaseView
                key="showcase"
                watch={selectedWatch!}
                allWatches={filteredWatches}
                onSelect={handleSelectTheme}
                onApplyTheme={handleApplyTheme}
                isCurrentTheme={currentTheme === selectedTheme}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </PageTransition>
  );
}

// Gallery View Component
function GalleryView({
  watches,
  selectedTheme,
  onSelect,
}: {
  watches: Array<{ theme: ThemeName; label: string; watchDNA: ReturnType<typeof themeToWatch>; soundtrack?: { trackId: string; title: string } }>;
  selectedTheme: ThemeName;
  onSelect: (theme: ThemeName) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatedGroup
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
        preset="scale"
      >
        {watches.map(({ theme, label, watchDNA, soundtrack }) => (
          <WatchCard
            key={theme}
            theme={theme}
            label={label}
            watchDNA={watchDNA}
            hasSoundtrack={!!soundtrack}
            isSelected={theme === selectedTheme}
            onClick={() => onSelect(theme)}
          />
        ))}
      </AnimatedGroup>
    </motion.div>
  );
}

// Watch Card Component
function WatchCard({
  theme,
  label,
  watchDNA,
  hasSoundtrack,
  isSelected,
  onClick,
}: {
  theme: ThemeName;
  label: string;
  watchDNA: ReturnType<typeof themeToWatch>;
  hasSoundtrack: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`group relative flex flex-col items-center p-4 rounded-2xl transition-all ${isSelected
          ? 'bg-primary/10 ring-2 ring-primary'
          : 'bg-card hover:bg-muted/50'
        }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      data-design-theme={theme}
    >
      {/* Watch face */}
      <div className="relative">
        <WatchFace
          watchDNA={watchDNA}
          size="sm"
          showCase={true}
          interactive={false}
        />

        {/* Soundtrack indicator */}
        {hasSoundtrack && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Music className="w-3 h-3 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        <p className="text-sm font-medium text-foreground truncate max-w-[100px]">
          {label}
        </p>
        <p className="text-xs text-muted-foreground capitalize">
          {watchDNA.style}
        </p>
      </div>
    </motion.button>
  );
}

// Showcase View Component
function ShowcaseView({
  watch,
  allWatches,
  onSelect,
  onApplyTheme,
  isCurrentTheme,
}: {
  watch: { theme: ThemeName; label: string; watchDNA: ReturnType<typeof themeToWatch>; soundtrack?: { trackId: string; title: string } };
  allWatches: Array<{ theme: ThemeName; label: string; watchDNA: ReturnType<typeof themeToWatch> }>;
  onSelect: (theme: ThemeName) => void;
  onApplyTheme: () => void;
  isCurrentTheme: boolean;
}) {
  const { watchDNA, label, theme, soundtrack } = watch;
  const scrollRef = useHorizontalScroll<HTMLDivElement>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Main showcase */}
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* Large watch display */}
        <FadeIn className="flex-shrink-0">
          <div
            className="relative p-8 rounded-3xl"
            style={{
              background: `linear-gradient(145deg, ${watchDNA.dialColor}22 0%, ${watchDNA.bezelColor}11 100%)`,
            }}
            data-design-theme={theme}
          >
            <WatchFace
              watchDNA={watchDNA}
              size="showcase"
              showCase={true}
              interactive={true}
            />

            {/* Ambient glow */}
            <div
              className="absolute inset-0 -z-10 blur-3xl opacity-30 rounded-full"
              style={{ backgroundColor: watchDNA.secondsHandColor }}
            />
          </div>
        </FadeIn>

        {/* Watch info */}
        <FadeInUp className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground uppercase tracking-wider">
                Procedurally Generated
              </span>
            </div>
            <TextEffect
              as="h2"
              preset="fade"
              className="text-4xl font-bold text-foreground"
            >
              {label}
            </TextEffect>
            <p className="text-lg text-muted-foreground mt-2">
              {getWatchStyleDescription(watchDNA.style)}
            </p>
          </div>

          {/* Watch DNA specs */}
          <div className="grid grid-cols-2 gap-4">
            <SpecItem label="Style" value={watchDNA.style} />
            <SpecItem label="Hands" value={watchDNA.handStyle} />
            <SpecItem label="Indices" value={watchDNA.indexStyle} />
            <SpecItem label="Dial" value={watchDNA.dialTexture} />
            <SpecItem label="Case" value={watchDNA.caseFinish} />
            <SpecItem label="Date" value={watchDNA.hasDateWindow ? `${watchDNA.datePosition} o'clock` : 'None'} />
          </div>

          {/* Soundtrack */}
          {soundtrack && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
              <div className="p-2 rounded-full bg-primary/10">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Theme Soundtrack</p>
                <p className="font-medium text-foreground">{soundtrack.title}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onApplyTheme}
              disabled={isCurrentTheme}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${isCurrentTheme
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
            >
              <Palette className="w-5 h-5" />
              {isCurrentTheme ? 'Current Theme' : 'Apply Theme'}
            </button>
          </div>
        </FadeInUp>
      </div>

      {/* Related watches */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">More Timepieces</h3>
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mb-4 scrollbar-hide"
        >
          {allWatches
            .filter(w => w.theme !== theme)
            .slice(0, 8)
            .map(w => (
              <button
                key={w.theme}
                onClick={() => onSelect(w.theme)}
                className="flex-shrink-0 p-2 sm:p-3 rounded-xl bg-card hover:bg-muted/50 transition-colors min-w-[80px] sm:min-w-[96px]"
                data-design-theme={w.theme}
              >
                <WatchFace
                  watchDNA={w.watchDNA}
                  size="xs"
                  showCase={true}
                  interactive={false}
                />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 text-center truncate">
                  {w.label}
                </p>
              </button>
            ))}
        </div>
      </div>
    </motion.div>
  );
}

// Spec Item Component
function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted/30">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-foreground capitalize">{value}</p>
    </div>
  );
}
