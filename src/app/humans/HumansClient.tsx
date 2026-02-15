'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  Search,
  List,
  ChevronLeft,
  Info,
  Lock,
  LogIn,
  AlertCircle,
} from 'lucide-react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { PageTransition } from '@/components/ios';
import { HumansProvider, useHumans } from '@/context/HumansContext';
import { useDesignTheme } from '@/context/DesignThemeContext';
import { useTheme } from 'next-themes';
import '@/lib/themes/themes.css';
import {
  IntentPicker,
  SearchForm,
  ResultsList,
  ProfileDetail,
  ShortlistPanel,
} from '@/components/humans';
import type { SearchIntent, SearchResult, ShortlistTag } from '@/lib/humans/types';

// ============================================================================
// Constants
// ============================================================================

const MAX_SEARCHES = 5;
const SEARCH_COUNT_KEY = 'humans_search_count';

// ============================================================================
// Search Limit Hook
// ============================================================================

function useSearchLimit(userId: string | undefined) {
  const [searchCount, setSearchCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load search count from localStorage
  useEffect(() => {
    if (!userId) {
      setIsLoaded(true);
      return;
    }

    const key = `${SEARCH_COUNT_KEY}_${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      const data = JSON.parse(stored);
      // Reset count if it's a new day
      const today = new Date().toDateString();
      if (data.date === today) {
        setSearchCount(data.count);
      } else {
        // New day, reset count
        localStorage.setItem(key, JSON.stringify({ count: 0, date: today }));
        setSearchCount(0);
      }
    }
    setIsLoaded(true);
  }, [userId]);

  const incrementSearch = useCallback(() => {
    if (!userId) return false;

    const newCount = searchCount + 1;
    const key = `${SEARCH_COUNT_KEY}_${userId}`;
    const today = new Date().toDateString();
    localStorage.setItem(key, JSON.stringify({ count: newCount, date: today }));
    setSearchCount(newCount);
    return true;
  }, [userId, searchCount]);

  const canSearch = searchCount < MAX_SEARCHES;
  const remainingSearches = MAX_SEARCHES - searchCount;

  return { searchCount, canSearch, remainingSearches, incrementSearch, isLoaded };
}

// ============================================================================
// Tab Navigation
// ============================================================================

type Tab = 'search' | 'shortlist';

interface TabBarProps {
  activeTab: Tab;
  onChangeTab: (tab: Tab) => void;
  shortlistCount: number;
}

function TabBar({ activeTab, onChangeTab, shortlistCount }: TabBarProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: 'hsl(var(--theme-secondary) / 0.5)' }}>
      <button
        onClick={() => onChangeTab('search')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          activeTab === 'search'
            ? ''
            : 'opacity-50 hover:opacity-70'
        }`}
        style={{
          backgroundColor: activeTab === 'search' ? 'hsl(var(--theme-secondary))' : 'transparent',
          color: 'hsl(var(--theme-foreground))',
        }}
      >
        <Search className="w-4 h-4" />
        Search
      </button>
      <button
        onClick={() => onChangeTab('shortlist')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
          activeTab === 'shortlist'
            ? ''
            : 'opacity-50 hover:opacity-70'
        }`}
        style={{
          backgroundColor: activeTab === 'shortlist' ? 'hsl(var(--theme-secondary))' : 'transparent',
          color: 'hsl(var(--theme-foreground))',
        }}
      >
        <List className="w-4 h-4" />
        Shortlist
        {shortlistCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary-foreground))',
            }}
          >
            {shortlistCount > 9 ? '9+' : shortlistCount}
          </span>
        )}
      </button>
    </div>
  );
}

// ============================================================================
// Main Content
// ============================================================================

interface HumansContentProps {
  canSearch: boolean;
  remainingSearches: number;
  onSearchPerformed: () => void;
}

function HumansContent({ canSearch, remainingSearches, onSearchPerformed }: HumansContentProps) {
  const {
    state,
    search,
    clearSearch,
    addToShortlist,
    removeFromShortlist,
    updateShortlistItem,
    clearShortlist,
    isInShortlist,
    startRalphMode,
    stopRalphMode,
    selectResult,
    setActivePanel,
    getSelectedResult,
    exportShortlistMarkdown,
    copyShortlistToClipboard,
  } = useHumans();

  const [activeTab, setActiveTab] = useState<Tab>('search');
  const [selectedIntent, setSelectedIntent] = useState<SearchIntent | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const selectedResult = getSelectedResult();

  // Handle intent selection
  const handleSelectIntent = (intent: SearchIntent) => {
    setSelectedIntent(intent);
  };

  // Handle search with limit check
  const handleSearch = async (query: Parameters<typeof search>[0]) => {
    if (!canSearch) return;
    onSearchPerformed();
    await search(query);
  };

  // Handle back from search form
  const handleBackFromForm = () => {
    setSelectedIntent(null);
    clearSearch();
  };

  // Handle back from results
  const handleBackFromResults = () => {
    setSelectedIntent(null);
    clearSearch();
  };

  // Handle add to shortlist
  const handleAddToShortlist = (result: SearchResult, tags?: ShortlistTag[]) => {
    addToShortlist(result, tags);
  };

  // Handle result selection
  const handleSelectResult = (id: string) => {
    selectResult(id);
  };

  // Handle close detail
  const handleCloseDetail = () => {
    selectResult(null);
  };

  // Determine what to show in search tab
  const renderSearchContent = () => {
    // Show detail view if a result is selected
    if (selectedResult) {
      return (
        <ProfileDetail
          result={selectedResult}
          onClose={handleCloseDetail}
          onAddToShortlist={handleAddToShortlist}
          isInShortlist={isInShortlist(selectedResult.id)}
        />
      );
    }

    // Show results if we have them
    if (state.searchResults.length > 0 || state.isSearching) {
      return (
        <ResultsList
          results={state.searchResults}
          isSearching={state.isSearching}
          onSelectResult={handleSelectResult}
          onAddToShortlist={(result) => handleAddToShortlist(result)}
          isInShortlist={isInShortlist}
          onBack={handleBackFromResults}
          onRefine={canSearch ? startRalphMode : undefined}
          ralphModeActive={state.ralphMode.active}
          ralphIteration={state.ralphMode.currentIteration}
          ralphMaxIterations={state.ralphMode.maxIterations}
        />
      );
    }

    // Show limit reached message
    if (!canSearch) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: 'hsl(var(--theme-destructive) / 0.1)' }}
          >
            <AlertCircle className="w-8 h-8" style={{ color: 'hsl(var(--theme-destructive))' }} />
          </div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            Daily Search Limit Reached
          </h3>
          <p
            className="text-sm mb-4 max-w-xs"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            You&apos;ve used all {MAX_SEARCHES} searches for today. Your limit resets at midnight.
          </p>
          <p
            className="text-xs"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            Browse your shortlist or come back tomorrow!
          </p>
        </div>
      );
    }

    // Show search form if intent is selected
    if (selectedIntent) {
      return (
        <SearchForm
          intent={selectedIntent}
          onSearch={handleSearch}
          onBack={handleBackFromForm}
          isSearching={state.isSearching}
          guardrailMessage={state.guardrailResult?.message}
          guardrailAlternative={state.guardrailResult?.safeAlternative}
        />
      );
    }

    // Show intent picker by default
    return <IntentPicker onSelectIntent={handleSelectIntent} />;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Limit Indicator */}
      <div
        className="flex items-center justify-center gap-2 py-2 px-3 mb-3 rounded-lg text-xs"
        style={{
          backgroundColor: canSearch
            ? 'hsl(var(--theme-secondary) / 0.3)'
            : 'hsl(var(--theme-destructive) / 0.1)',
          color: canSearch
            ? 'hsl(var(--theme-muted-foreground))'
            : 'hsl(var(--theme-destructive))',
        }}
      >
        <Search className="w-3 h-3" />
        <span>
          {canSearch
            ? `${remainingSearches} search${remainingSearches !== 1 ? 'es' : ''} remaining today`
            : 'Daily limit reached'}
        </span>
      </div>

      {/* Tab Bar */}
      <div className="mb-4">
        <TabBar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          shortlistCount={state.shortlist.length}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'search' ? (
            <motion.div
              key="search"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto"
            >
              {renderSearchContent()}
            </motion.div>
          ) : (
            <motion.div
              key="shortlist"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto"
            >
              <ShortlistPanel
                items={state.shortlist}
                onRemove={removeFromShortlist}
                onUpdate={updateShortlistItem}
                onClear={clearShortlist}
                onExportMarkdown={exportShortlistMarkdown}
                onCopyToClipboard={copyShortlistToClipboard}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// Animated Background
// ============================================================================

function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient - uses theme colors */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, hsl(var(--theme-background)) 0%, hsl(var(--theme-muted)) 50%, hsl(var(--theme-background)) 100%)`,
        }}
      />

      {/* Animated orbs using primary/accent colors */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, hsl(var(--theme-primary) / 0.3) 0%, transparent 70%)',
              top: '-15%',
              right: '-10%',
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, hsl(var(--theme-accent) / 0.3) 0%, transparent 70%)',
              bottom: '5%',
              left: '-5%',
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--theme-border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--theme-border)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

// ============================================================================
// Sign In Gate
// ============================================================================

function SignInGate() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
          }}
        >
          <Lock className="w-10 h-10" style={{ color: 'hsl(var(--theme-primary-foreground))' }} />
        </div>

        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          Sign In Required
        </h2>

        <p
          className="text-sm mb-6 max-w-xs mx-auto"
          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
        >
          Humans is a professional networking tool. Sign in to search for people and build your shortlist.
        </p>

        <div className="space-y-3">
          <SignInButton mode="modal">
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:opacity-90 w-full"
              style={{
                backgroundColor: 'hsl(var(--theme-primary))',
                color: 'hsl(var(--theme-primary-foreground))',
              }}
            >
              <LogIn className="w-4 h-4" />
              Sign In to Continue
            </button>
          </SignInButton>

          <p
            className="text-xs"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            Free accounts get {MAX_SEARCHES} searches per day
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export function HumansClient() {
  const [mounted, setMounted] = useState(false);
  const { designTheme } = useDesignTheme();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const { user, isLoaded: isUserLoaded } = useUser();

  // Search limit tracking
  const { canSearch, remainingSearches, incrementSearch, isLoaded: isLimitLoaded } = useSearchLimit(user?.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isAuthenticated = isUserLoaded && user;
  const isLoading = !isUserLoaded || !isLimitLoaded;

  return (
    <PageTransition>
      <HumansProvider>
        <main
          data-design-theme={designTheme}
          className="min-h-screen relative transition-colors duration-300"
          style={{
            backgroundColor: 'hsl(var(--theme-background))',
            color: 'hsl(var(--theme-foreground))',
            fontFamily: 'var(--theme-font)',
          }}
        >
          <AnimatedBackground />

          {/* Content */}
          <div className="relative z-10 flex flex-col min-h-screen">
            {/* Header */}
            <header className="px-4 py-4 safe-area-inset-top">
              <div className="max-w-lg mx-auto flex items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-2 opacity-50 hover:opacity-70 transition-opacity"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm">Home</span>
                </Link>

                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)`,
                    }}
                  >
                    <Users className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary-foreground))' }} />
                  </div>
                  <span className="font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>Humans</span>
                </div>

                <div className="w-16" /> {/* Spacer for centering */}
              </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 px-4 pb-8">
              <div className="max-w-lg mx-auto h-full">
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div
                      className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: 'hsl(var(--theme-primary))', borderTopColor: 'transparent' }}
                    />
                  </div>
                ) : isAuthenticated ? (
                  <HumansContent
                    canSearch={canSearch}
                    remainingSearches={remainingSearches}
                    onSearchPerformed={incrementSearch}
                  />
                ) : (
                  <SignInGate />
                )}
              </div>
            </div>

            {/* Footer */}
            <footer
              className="px-4 py-4"
              style={{ borderTop: '1px solid hsl(var(--theme-border) / 0.2)' }}
            >
              <div
                className="max-w-lg mx-auto flex items-center justify-center gap-2 text-[11px] opacity-40"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                <Info className="w-3 h-3" />
                <span>For professional networking only. No private data collected.</span>
              </div>
            </footer>
          </div>
        </main>
      </HumansProvider>
    </PageTransition>
  );
}
