'use client';

import { useState, useMemo } from 'react';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Layers,
  Sparkles,
  Layout,
  FileCode,
  X,
  Copy,
  Check,
  Eye,
  Palette,
} from 'lucide-react';
import { useDesignTheme } from '@/context/DesignThemeContext';
import { useTheme } from 'next-themes';
import '@/lib/themes/themes.css';
import { FadeIn, FadeInUp, TextEffect } from '@/components/motion';
import { PageTransition } from '@/components/ios';
import { DesignNavigation } from '@/components/design/DesignNavigation';

// ============================================================================
// Types
// ============================================================================

type Category = 'all' | 'style' | 'animation' | 'component' | 'page';

interface LibraryItem {
  _id: string;
  name: string;
  description: string;
  category: Category;
  tags: string[];
  htmlContent: string;
  featured: boolean;
  author: string;
}

// ============================================================================
// Category Data
// ============================================================================

const CATEGORIES: { id: Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'style', label: 'Styles', icon: Palette },
  { id: 'animation', label: 'Animations', icon: Sparkles },
  { id: 'component', label: 'Components', icon: Layout },
  { id: 'page', label: 'Pages', icon: FileCode },
];

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_ITEMS: LibraryItem[] = [
  {
    _id: '1',
    name: 'Gradient Button',
    description: 'A beautiful gradient button with hover effects',
    category: 'component',
    tags: ['button', 'gradient', 'hover'],
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0a0a0a; }
    .btn { padding: 12px 32px; background: linear-gradient(135deg, #d97757, #f97316); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(217, 119, 87, 0.3); }
  </style>
</head>
<body>
  <button class="btn">Get Started</button>
</body>
</html>`,
    featured: true,
    author: 'User',
  },
  {
    _id: '2',
    name: 'Glass Card',
    description: 'Frosted glass effect card with blur background',
    category: 'component',
    tags: ['card', 'glass', 'blur'],
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .card { padding: 32px; background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.2); color: white; max-width: 300px; }
    .card h2 { margin: 0 0 12px; font-size: 24px; }
    .card p { margin: 0; opacity: 0.8; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Glass Card</h2>
    <p>Beautiful frosted glass effect with backdrop blur.</p>
  </div>
</body>
</html>`,
    featured: false,
    author: 'User',
  },
  {
    _id: '3',
    name: 'Animated Gradient',
    description: 'Smooth animated gradient background',
    category: 'animation',
    tags: ['gradient', 'animation', 'background'],
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    body { margin: 0; min-height: 100vh; background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); background-size: 400% 400%; animation: gradient 15s ease infinite; display: flex; align-items: center; justify-content: center; }
    h1 { color: white; font-family: system-ui; font-size: 48px; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
  </style>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`,
    featured: true,
    author: 'User',
  },
  {
    _id: '4',
    name: 'Neon Text',
    description: 'Glowing neon text effect',
    category: 'style',
    tags: ['neon', 'text', 'glow'],
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0a0a0a; }
    .neon { font-family: system-ui; font-size: 64px; font-weight: 700; color: #fff; text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 80px #ff00ff; animation: flicker 1.5s infinite alternate; }
    @keyframes flicker { 0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 80px #ff00ff; } 20%, 24%, 55% { text-shadow: none; } }
  </style>
</head>
<body>
  <h1 class="neon">NEON</h1>
</body>
</html>`,
    featured: false,
    author: 'User',
  },
];

const TAGS = ['button', 'gradient', 'animation', 'card', 'glass', 'neon', 'text', 'hover'];

// ============================================================================
// Library Page Component
// ============================================================================

export default function LibraryPage() {
  const { designTheme } = useDesignTheme();
  const { resolvedTheme: siteTheme } = useTheme();
  const isDarkMode = siteTheme === 'dark';
  const watchDNA = useMemo(() => themeToWatch(designTheme as Parameters<typeof themeToWatch>[0]), [designTheme]);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  // Filter items based on current filters
  const filteredItems = useMemo(() => {
    return MOCK_ITEMS.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (selectedTags.length > 0 && !selectedTags.some((t) => item.tags.includes(t))) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [category, selectedTags, search]);

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = { all: MOCK_ITEMS.length, style: 0, animation: 0, component: 0, page: 0 };
    MOCK_ITEMS.forEach((item) => {
      counts[item.category]++;
    });
    return counts;
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearch('');
    setCategory('all');
  };

  const hasActiveFilters = selectedTags.length > 0 || search;

  return (
    <PageTransition>
      <div
        data-design-theme={designTheme}
        className="min-h-screen transition-all duration-500"
        style={{
          backgroundColor: 'hsl(var(--theme-background))',
          color: 'hsl(var(--theme-foreground))',
          fontFamily: 'var(--theme-font)',
        }}
      >
        {/* Navigation */}
        <DesignNavigation />

        {/* Hero + Search + Filters */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
            <div>
              <FadeIn delay={0.1}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <span
                    className="text-xs font-medium tracking-wider uppercase"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    Design Templates
                  </span>
                </div>
              </FadeIn>

              <TextEffect per="word" preset="blur" as="h1" className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                Templates
              </TextEffect>

              <FadeInUp delay={0.2}>
                <p className="text-sm max-w-lg" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  {filteredItems.length === MOCK_ITEMS.length
                    ? `${MOCK_ITEMS.length} ready-to-use templates`
                    : `${filteredItems.length} of ${MOCK_ITEMS.length} templates`}
                  . Click to preview and copy.
                </p>
              </FadeInUp>
            </div>

            {/* Search */}
            <FadeInUp delay={0.3}>
              <div className="relative w-full md:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full pl-9 pr-9 py-2 rounded-lg border text-sm outline-none transition-all focus:ring-2"
                  style={{
                    borderColor: 'hsl(var(--theme-border))',
                    backgroundColor: 'hsl(var(--theme-card))',
                    color: 'hsl(var(--theme-foreground))',
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </FadeInUp>
          </div>

          {/* Category Pills */}
          <FadeInUp delay={0.35}>
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = category === cat.id;
                const count = categoryCounts[cat.id] ?? 0;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor: isActive
                        ? 'hsl(var(--theme-primary))'
                        : 'hsl(var(--theme-muted) / 0.5)',
                      color: isActive
                        ? 'hsl(var(--theme-primary-foreground))'
                        : 'hsl(var(--theme-muted-foreground))',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                    <span className="text-xs opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          </FadeInUp>

          {/* Tag Pills */}
          <FadeInUp delay={0.4}>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: isSelected
                        ? 'hsl(var(--theme-primary))'
                        : 'hsl(var(--theme-secondary))',
                      color: isSelected
                        ? 'hsl(var(--theme-primary-foreground))'
                        : 'hsl(var(--theme-secondary-foreground))',
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 rounded-lg text-xs font-medium underline transition-all hover:opacity-70"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  Clear filters
                </button>
              )}
            </div>
          </FadeInUp>
        </section>

        {/* Template Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <Search
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              />
              <h3
                className="text-lg font-medium mb-2"
                style={{ color: 'hsl(var(--theme-foreground))' }}
              >
                No templates found
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                Try adjusting your filters or search query
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                style={{
                  backgroundColor: 'hsl(var(--theme-primary))',
                  color: 'hsl(var(--theme-primary-foreground))',
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item, index) => (
                <TemplateCard
                  key={item._id}
                  item={item}
                  index={index}
                  onSelect={() => setSelectedItem(item)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Preview Modal */}
        <AnimatePresence>
          {selectedItem && (
            <TemplatePreviewModal
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
            />
          )}
        </AnimatePresence>

        {/* Theme Timepiece */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-medium mb-4 text-center" style={{ color: 'hsl(var(--theme-foreground))' }}>Theme Timepiece</h2>
            <p className="text-center mb-8 text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>A watch face generated from this theme&apos;s template palette.</p>
            <div className="flex justify-center">
              <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="border-t py-8"
          style={{ borderColor: 'hsl(var(--theme-border))' }}
        >
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Templates for AI-assisted design
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}

// ============================================================================
// Template Card Component
// ============================================================================

function TemplateCard({
  item,
  index,
  onSelect,
}: {
  item: LibraryItem;
  index: number;
  onSelect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Preview Container */}
      <div
        onClick={onSelect}
        className="relative aspect-[4/3] rounded-xl overflow-hidden border cursor-pointer transition-all hover:shadow-lg"
        style={{
          borderColor: 'hsl(var(--theme-border))',
          backgroundColor: 'hsl(var(--theme-card))',
        }}
      >
        {/* Live Preview iframe */}
        <iframe
          srcDoc={item.htmlContent}
          className="w-full h-full pointer-events-none"
          sandbox="allow-scripts"
          title={item.name}
        />

        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4"
            >
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: 'hsl(var(--theme-primary))',
                  color: 'hsl(var(--theme-primary-foreground))',
                }}
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured Badge */}
        {item.featured && (
          <div
            className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary-foreground))',
            }}
          >
            Featured
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="mt-3 px-1">
        <h3
          className="font-medium transition-colors"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          {item.name}
        </h3>
        <p
          className="text-sm mt-0.5 line-clamp-1"
          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
        >
          {item.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-xs"
              style={{
                backgroundColor: 'hsl(var(--theme-secondary))',
                color: 'hsl(var(--theme-secondary-foreground))',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Preview Modal Component
// ============================================================================

function TemplatePreviewModal({
  item,
  onClose,
}: {
  item: LibraryItem;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const { designTheme } = useDesignTheme();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(item.htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        data-design-theme={designTheme}
        className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border shadow-2xl"
        style={{
          backgroundColor: 'hsl(var(--theme-background))',
          borderColor: 'hsl(var(--theme-border))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'hsl(var(--theme-border))' }}
        >
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              {item.name}
            </h2>
            <p
              className="text-sm"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {item.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{
                backgroundColor: 'hsl(var(--theme-primary))',
                color: 'hsl(var(--theme-primary-foreground))',
              }}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Code
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-all hover:opacity-70"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="aspect-video bg-white">
          <iframe
            srcDoc={item.htmlContent}
            className="w-full h-full"
            sandbox="allow-scripts"
            title={item.name}
          />
        </div>

        {/* Footer Info */}
        <div
          className="px-6 py-4 border-t"
          style={{ borderColor: 'hsl(var(--theme-border))' }}
        >
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              by {item.author}
            </span>
            <div className="flex-1" />
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded text-xs"
                  style={{
                    backgroundColor: 'hsl(var(--theme-secondary))',
                    color: 'hsl(var(--theme-secondary-foreground))',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
