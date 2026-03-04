'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import {
  ChevronLeft,
  Search,
  Grid3X3,
  List,
  Sparkles,
  Bot,
  Code,
  Palette,
  FlaskConical,
  Briefcase,
  Wand2,
  SlidersHorizontal,
  Shield,
  Brain,
  X,
  Loader2,
  Database,
  Power,
  PowerOff,
  RotateCcw,
  Wrench,
  Lock,
  Users,
  Eye,
} from 'lucide-react';
import { PageTransition } from '@/components/ios';
import { SkillCard3D } from '@/components/skills/SkillCard3D';
import { SkillDetailPanel } from '@/components/skills/SkillDetailPanel';
import {
  SkillDefinition,
  SkillMode,
  SkillCategory,
  SkillRarity,
  CATEGORY_INFO,
  RARITY_INFO,
} from '@/lib/skills-registry';
import { buildToolsRegistry, TOOL_CATEGORY_INFO, ToolRegistryEntry, ToolCategory, ToolAccessLevel } from '@/lib/tools-registry';

type PageTab = 'skills' | 'tools';
type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'rarity' | 'power' | 'utility';

const CATEGORY_ICONS: Record<SkillCategory, React.ReactNode> = {
  automation: <Bot className="w-4 h-4" />,
  development: <Code className="w-4 h-4" />,
  design: <Palette className="w-4 h-4" />,
  scientific: <FlaskConical className="w-4 h-4" />,
  management: <Briefcase className="w-4 h-4" />,
  creative: <Wand2 className="w-4 h-4" />,
  security: <Shield className="w-4 h-4" />,
  ml: <Brain className="w-4 h-4" />,
};

// Transform Convex skill to SkillDefinition
function transformConvexSkill(skill: {
  skillId: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  category: string;
  rarity: string;
  icon: string;
  gradient: string;
  accentColor: string;
  tags: string[];
  statPower: number;
  statComplexity: number;
  statUtility: number;
  defaultMode: string;
  commands: { name: string; syntax: string; description: string }[];
  dependencies: { name: string; type: string; installCommand?: string; url?: string }[];
  sourceAuthor?: string;
  sourceUrl?: string;
  sourceLicense?: string;
  sourceVersion?: string;
}): SkillDefinition {
  return {
    id: skill.skillId,
    name: skill.name,
    shortName: skill.shortName,
    description: skill.description,
    longDescription: skill.longDescription,
    category: skill.category as SkillCategory,
    rarity: skill.rarity as SkillRarity,
    icon: skill.icon,
    gradient: skill.gradient,
    accentColor: skill.accentColor,
    tags: skill.tags,
    stats: {
      power: skill.statPower,
      complexity: skill.statComplexity,
      utility: skill.statUtility,
    },
    defaultMode: skill.defaultMode as SkillMode,
    commands: skill.commands,
    dependencies: skill.dependencies.map((dep) => ({
      name: dep.name,
      type: dep.type as 'cli' | 'npm' | 'api' | 'python' | 'native',
      installCommand: dep.installCommand,
      url: dep.url,
    })),
    source: skill.sourceAuthor
      ? {
          author: skill.sourceAuthor,
          url: skill.sourceUrl,
          license: skill.sourceLicense,
          version: skill.sourceVersion,
        }
      : undefined,
  };
}

export default function SkillsPage() {
  // Fetch skills from Convex
  const convexSkills = useQuery(api.skills.getAllSkills, {});
  const skillStats = useQuery(api.skills.getSkillStats, {});
  const userModes = useQuery(api.skills.getUserSkillModes, {});
  const setUserSkillMode = useMutation(api.skills.setUserSkillMode);
  const setUserSkillModesBulk = useMutation(api.skills.setUserSkillModesBulk);

  // Transform Convex skills to SkillDefinition format
  const skills: SkillDefinition[] = useMemo(() => {
    if (!convexSkills) return [];
    return convexSkills.map(transformConvexSkill);
  }, [convexSkills]);

  // Local skill modes (merged with user's saved modes from Convex)
  const [localModes, setLocalModes] = useState<Record<string, SkillMode>>({});
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false);

  // Load modes from localStorage on mount (for non-authenticated users)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('skill-modes');
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, SkillMode>;
        setLocalModes(parsed);
      }
    } catch {
      // localStorage not available or parse error
    }
    setIsLocalStorageLoaded(true);
  }, []);

  // Save modes to localStorage whenever they change
  const saveToLocalStorage = useCallback((modes: Record<string, SkillMode>) => {
    try {
      localStorage.setItem('skill-modes', JSON.stringify(modes));
    } catch {
      // localStorage not available
    }
  }, []);

  // Merge default modes with user's saved modes
  const skillModes = useMemo(() => {
    const modes: Record<string, SkillMode> = {};
    skills.forEach((skill) => {
      // Priority: localModes > userModes from DB > defaultMode
      modes[skill.id] = localModes[skill.id] || userModes?.[skill.id] || skill.defaultMode;
    });
    return modes;
  }, [skills, userModes, localModes]);

  // Tab state
  const [activeTab, setActiveTab] = useState<PageTab>('skills');

  // Build tools registry
  const toolsRegistry = useMemo(() => buildToolsRegistry(), []);

  // Tools filtering state
  const [toolCategory, setToolCategory] = useState<ToolCategory | 'all'>('all');
  const [toolAccess, setToolAccess] = useState<ToolAccessLevel | 'all'>('all');
  const [toolSearch, setToolSearch] = useState('');

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [selectedRarity, setSelectedRarity] = useState<SkillRarity | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('rarity');
  const [selectedSkill, setSelectedSkill] = useState<SkillDefinition | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort skills
  const filteredSkills = useMemo(() => {
    let filtered = [...skills];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (skill) =>
          skill.name.toLowerCase().includes(query) ||
          skill.description.toLowerCase().includes(query) ||
          skill.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((skill) => skill.category === selectedCategory);
    }

    // Rarity filter
    if (selectedRarity !== 'all') {
      filtered = filtered.filter((skill) => skill.rarity === selectedRarity);
    }

    // Sort
    const rarityOrder: SkillRarity[] = ['legendary', 'epic', 'rare', 'uncommon', 'common'];
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
        case 'power':
          return b.stats.power - a.stats.power;
        case 'utility':
          return b.stats.utility - a.stats.utility;
        default:
          return 0;
      }
    });

    return filtered;
  }, [skills, searchQuery, selectedCategory, selectedRarity, sortBy]);

  // Filter tools
  const filteredTools = useMemo(() => {
    let filtered = [...toolsRegistry];
    if (toolSearch) {
      const q = toolSearch.toLowerCase();
      filtered = filtered.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    if (toolCategory !== 'all') {
      filtered = filtered.filter(t => t.category === toolCategory);
    }
    if (toolAccess !== 'all') {
      filtered = filtered.filter(t => t.accessLevel === toolAccess);
    }
    return filtered;
  }, [toolsRegistry, toolSearch, toolCategory, toolAccess]);

  // Tool stats
  const toolStats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    toolsRegistry.forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + 1;
    });
    return { total: toolsRegistry.length, byCategory };
  }, [toolsRegistry]);

  // Stats from Convex
  const stats = useMemo(() => {
    const total = skillStats?.total || skills.length;
    const enabled = Object.values(skillModes).filter((m) => m === 'on').length;
    const auto = Object.values(skillModes).filter((m) => m === 'auto').length;
    const disabled = Object.values(skillModes).filter((m) => m === 'off').length;
    return { total, enabled, auto, disabled };
  }, [skillStats, skills.length, skillModes]);

  const handleModeChange = useCallback(async (skillId: string, mode: SkillMode) => {
    // Update local state immediately for responsiveness
    setLocalModes((prev) => {
      const updated = { ...prev, [skillId]: mode };
      // Always save to localStorage as fallback
      saveToLocalStorage(updated);
      return updated;
    });

    // Try to persist to Convex (will fail silently if not authenticated)
    try {
      await setUserSkillMode({ skillId, mode });
    } catch {
      // User not authenticated - localStorage fallback already saved
    }
  }, [saveToLocalStorage, setUserSkillMode]);

  // Bulk mode change handler
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const handleBulkModeChange = useCallback(async (mode: SkillMode | 'reset') => {
    if (skills.length === 0) return;

    setIsBulkUpdating(true);

    // Build the new modes map
    const newModes: Record<string, SkillMode> = {};
    const bulkModes: { skillId: string; mode: SkillMode }[] = [];

    skills.forEach((skill) => {
      const targetMode = mode === 'reset' ? skill.defaultMode : mode;
      newModes[skill.id] = targetMode;
      bulkModes.push({ skillId: skill.id, mode: targetMode });
    });

    // Update local state immediately
    setLocalModes(newModes);
    saveToLocalStorage(newModes);

    // Try to persist to Convex
    try {
      await setUserSkillModesBulk({ modes: bulkModes });
    } catch {
      // User not authenticated - localStorage fallback already saved
    }

    setIsBulkUpdating(false);
  }, [skills, saveToLocalStorage, setUserSkillModesBulk]);

  const isLoading = convexSkills === undefined || !isLocalStorageLoaded;

  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-950 overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('skills')}
                    className={`text-xl font-bold flex items-center gap-2 pb-0.5 border-b-2 transition-colors ${
                      activeTab === 'skills'
                        ? 'text-white border-theme-primary'
                        : 'text-white/40 border-transparent hover:text-white/60'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                    Skills
                  </button>
                  <button
                    onClick={() => setActiveTab('tools')}
                    className={`text-xl font-bold flex items-center gap-2 pb-0.5 border-b-2 transition-colors ${
                      activeTab === 'tools'
                        ? 'text-white border-theme-primary'
                        : 'text-white/40 border-transparent hover:text-white/60'
                    }`}
                  >
                    <Wrench className="w-5 h-5" />
                    Tools
                  </button>
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin text-white/40" />}
                </div>
                <p className="text-xs text-white/40 flex items-center gap-1 mt-1">
                  <Database className="w-3 h-3" />
                  {activeTab === 'skills'
                    ? (isLoading ? 'Loading from database...' : `${stats.total} capabilities • Real-time`)
                    : `${toolStats.total} AI tools • ${Object.keys(toolStats.byCategory).length} categories`
                  }
                </p>
              </div>

              {/* View toggles */}
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Stats bar - Skills only */}
        {activeTab === 'skills' && (
          <div className="border-b border-white/10 bg-white/2">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Stats */}
                <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm overflow-x-auto">
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className="text-white/40">Total:</span>
                    <span className="text-white font-medium">{stats.total}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-white/40">On:</span>
                    <span className="text-white font-medium">{stats.enabled}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-white/40">Auto:</span>
                    <span className="text-white font-medium">{stats.auto}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-white/40">Off:</span>
                    <span className="text-white font-medium">{stats.disabled}</span>
                  </div>
                </div>

                {/* Bulk actions - hidden on mobile */}
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => handleBulkModeChange('on')}
                    disabled={isBulkUpdating || isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                      bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30
                      disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Power className="w-3.5 h-3.5" />
                    Enable All
                  </button>
                  <button
                    onClick={() => handleBulkModeChange('off')}
                    disabled={isBulkUpdating || isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                      bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30
                      disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PowerOff className="w-3.5 h-3.5" />
                    Disable All
                  </button>
                  <button
                    onClick={() => handleBulkModeChange('reset')}
                    disabled={isBulkUpdating || isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                      bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10
                      disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Glassmorphic Search Bar - Skills */}
        {activeTab === 'skills' && (
          <div className="sticky top-[73px] z-30">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-transparent pointer-events-none" />
            <div className="relative max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center gap-3">
                {/* Glassmorphic Search */}
                <div className="relative flex-1 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-theme-primary/30 via-purple-500/20 to-pink-500/30 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden group-focus-within:border-white/20 transition-colors">
                    <Search className="ml-4 w-5 h-5 text-white/40 group-focus-within:text-theme-primary transition-colors" />
                    <input
                      type="text"
                      placeholder={`Search ${stats.total} skills...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-3 py-3 bg-transparent text-white placeholder:text-white/30 focus:outline-none text-sm"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mr-2 p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3 rounded-xl border backdrop-blur-xl transition-all duration-200 ${
                    showFilters
                      ? 'bg-theme-primary/20 border-theme-primary/50 text-theme-primary shadow-lg shadow-theme-primary/20'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Expanded filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-4">
                      {/* Category filter */}
                      <div>
                        <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Category</div>
                        <div className="flex flex-wrap gap-2">
                          <FilterChip
                            active={selectedCategory === 'all'}
                            onClick={() => setSelectedCategory('all')}
                          >
                            All
                          </FilterChip>
                          {(Object.keys(CATEGORY_INFO) as SkillCategory[]).map((cat) => (
                            <FilterChip
                              key={cat}
                              active={selectedCategory === cat}
                              onClick={() => setSelectedCategory(cat)}
                              icon={CATEGORY_ICONS[cat]}
                            >
                              {CATEGORY_INFO[cat].label}
                            </FilterChip>
                          ))}
                        </div>
                      </div>

                      {/* Rarity filter */}
                      <div>
                        <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Rarity</div>
                        <div className="flex flex-wrap gap-2">
                          <FilterChip
                            active={selectedRarity === 'all'}
                            onClick={() => setSelectedRarity('all')}
                          >
                            All
                          </FilterChip>
                          {(Object.keys(RARITY_INFO) as SkillRarity[]).map((rarity) => (
                            <FilterChip
                              key={rarity}
                              active={selectedRarity === rarity}
                              onClick={() => setSelectedRarity(rarity)}
                              className={selectedRarity === rarity ? RARITY_INFO[rarity].color : ''}
                            >
                              {RARITY_INFO[rarity].label}
                            </FilterChip>
                          ))}
                        </div>
                      </div>

                      {/* Sort */}
                      <div>
                        <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Sort By</div>
                        <div className="flex flex-wrap gap-2">
                          {(['rarity', 'name', 'power', 'utility'] as SortOption[]).map((option) => (
                            <FilterChip
                              key={option}
                              active={sortBy === option}
                              onClick={() => setSortBy(option)}
                            >
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </FilterChip>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Tools Search and Filters */}
        {activeTab === 'tools' && (
          <div className="sticky top-[73px] z-30">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-transparent pointer-events-none" />
            <div className="relative max-w-7xl mx-auto px-4 py-4">
              <div className="relative flex-1 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-theme-primary/30 via-purple-500/20 to-pink-500/30 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden group-focus-within:border-white/20 transition-colors">
                  <Search className="ml-4 w-5 h-5 text-white/40 group-focus-within:text-theme-primary transition-colors" />
                  <input
                    type="text"
                    placeholder={`Search ${toolStats.total} AI tools...`}
                    value={toolSearch}
                    onChange={(e) => setToolSearch(e.target.value)}
                    className="flex-1 px-3 py-3 bg-transparent text-white placeholder:text-white/30 focus:outline-none text-sm"
                  />
                  {toolSearch && (
                    <button onClick={() => setToolSearch('')} className="mr-2 p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              {/* Category chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                <FilterChip active={toolCategory === 'all'} onClick={() => setToolCategory('all')}>
                  All ({toolStats.total})
                </FilterChip>
                {(Object.keys(TOOL_CATEGORY_INFO) as ToolCategory[]).map(cat => (
                  <FilterChip
                    key={cat}
                    active={toolCategory === cat}
                    onClick={() => setToolCategory(cat)}
                  >
                    {TOOL_CATEGORY_INFO[cat].label} ({toolStats.byCategory[cat] || 0})
                  </FilterChip>
                ))}
              </div>
              {/* Access level chips */}
              <div className="flex flex-wrap gap-2 mt-2">
                <FilterChip active={toolAccess === 'all'} onClick={() => setToolAccess('all')}>
                  All Access
                </FilterChip>
                <FilterChip active={toolAccess === 'visitor'} onClick={() => setToolAccess('visitor')} icon={<Eye className="w-3 h-3" />}>
                  Visitor
                </FilterChip>
                <FilterChip active={toolAccess === 'collaborator'} onClick={() => setToolAccess('collaborator')} icon={<Users className="w-3 h-3" />}>
                  Collaborator
                </FilterChip>
                <FilterChip active={toolAccess === 'owner'} onClick={() => setToolAccess('owner')} icon={<Lock className="w-3 h-3" />}>
                  Owner Only
                </FilterChip>
              </div>
            </div>
          </div>
        )}

        {/* Skills grid/list */}
        {activeTab === 'skills' && (
          <main className="max-w-7xl mx-auto px-4 py-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-theme-primary" />
                <p className="text-white/40">Loading skills from database...</p>
              </div>
            ) : filteredSkills.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/40">No skills found matching your criteria</p>
                {skills.length === 0 && (
                  <p className="text-white/30 text-sm mt-2">
                    Database may be empty. Run the seed script to populate.
                  </p>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredSkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.02, 0.5) }}
                  >
                    <SkillCard3D
                      skill={skill}
                      mode={skillModes[skill.id]}
                      onModeChange={(mode) => handleModeChange(skill.id, mode)}
                      onSelect={() => setSelectedSkill(skill)}
                      isSelected={selectedSkill?.id === skill.id}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredSkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(index * 0.01, 0.3) }}
                  >
                    <SkillListItem
                      skill={skill}
                      mode={skillModes[skill.id]}
                      onModeChange={(mode) => handleModeChange(skill.id, mode)}
                      onSelect={() => setSelectedSkill(skill)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        )}

        {/* Tools list */}
        {activeTab === 'tools' && (
          <main className="max-w-7xl mx-auto px-4 py-6">
            {filteredTools.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/40">No tools found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTools.map((tool, index) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(index * 0.01, 0.3) }}
                  >
                    <ToolListItem tool={tool} />
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        )}

        {/* Skill detail panel */}
        <SkillDetailPanel
          skill={selectedSkill}
          mode={selectedSkill ? skillModes[selectedSkill.id] : 'auto'}
          onModeChange={(mode) => {
            if (selectedSkill) {
              handleModeChange(selectedSkill.id, mode);
            }
          }}
          onClose={() => setSelectedSkill(null)}
        />
      </div>
    </PageTransition>
  );
}

// Filter chip component
function FilterChip({
  children,
  active,
  onClick,
  icon,
  className = '',
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all
        ${
          active
            ? 'bg-theme-primary text-white'
            : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
        }
        ${className}
      `}
    >
      {icon}
      {children}
    </button>
  );
}

// List view item
function SkillListItem({
  skill,
  mode,
  onModeChange,
  onSelect,
}: {
  skill: SkillDefinition;
  mode: SkillMode;
  onModeChange: (mode: SkillMode) => void;
  onSelect: () => void;
}) {
  const rarityInfo = RARITY_INFO[skill.rarity];

  return (
    <div
      onClick={onSelect}
      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
    >
      {/* Gradient icon */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${skill.gradient} flex items-center justify-center flex-shrink-0`}>
        <span className="text-white text-xl">
          {skill.shortName.charAt(0)}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-medium truncate">{skill.name}</h3>
          <span className={`text-xs font-medium ${rarityInfo.color}`}>
            {rarityInfo.label}
          </span>
        </div>
        <p className="text-sm text-white/50 truncate">{skill.description}</p>
      </div>

      {/* Mode toggle */}
      <div
        className="flex items-center gap-1 bg-black/30 rounded-lg p-1"
        onClick={(e) => e.stopPropagation()}
      >
        {(['off', 'auto', 'on'] as SkillMode[]).map((m) => (
          <button
            key={m}
            onClick={(e) => {
              e.stopPropagation();
              onModeChange(m);
            }}
            className={`
              py-1 px-2 rounded-md text-xs font-medium uppercase
              transition-all duration-200
              ${
                mode === m
                  ? m === 'on'
                    ? 'bg-green-500 text-white'
                    : m === 'off'
                    ? 'bg-red-500/80 text-white'
                    : 'bg-amber-500 text-white'
                  : 'text-white/40 hover:text-white/60'
              }
            `}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

// Tool list item
function ToolListItem({ tool }: { tool: ToolRegistryEntry }) {
  const categoryInfo = TOOL_CATEGORY_INFO[tool.category];
  const accessColors: Record<ToolAccessLevel, string> = {
    visitor: 'text-green-400 bg-green-500/20 border-green-500/30',
    collaborator: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    owner: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
        <Wrench className="w-5 h-5 text-white/60" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-mono text-sm font-medium">{tool.name}</h3>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${accessColors[tool.accessLevel]}`}>
            {tool.accessLevel}
          </span>
        </div>
        <p className="text-sm text-white/50 truncate">{tool.description}</p>
      </div>
      <div className="text-xs text-white/30 shrink-0">
        {categoryInfo.label}
      </div>
    </div>
  );
}
