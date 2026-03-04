'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs } from '@/components/motion/config';
import {
  Menu,
  X,
  ChevronLeft,
  FileText,
  Zap,
  Sun,
  Moon,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useDesignTheme } from '@/context/DesignThemeContext';
import { NotesProvider, useNotes } from '@/context/NotesContext';
import { NotesFolderTree } from './NotesFolderTree';
import { NotesList } from './NotesList';
import { NoteEditor } from './NoteEditor';
import { NotesSearch } from './NotesSearch';
import { QuickCaptureModal } from './QuickCaptureModal';
import { cn } from '@/lib/utils';
import '@/lib/themes/themes.css';

// Mobile view states
type MobileView = 'folders' | 'list' | 'editor';

function NotesAppContent() {
  const { designTheme } = useDesignTheme();
  const { resolvedTheme, setTheme } = useTheme();
  // Use resolvedTheme which gives the actual theme ("light" or "dark")
  // instead of theme which could be "system"
  const isDarkMode = resolvedTheme === 'dark';

  const { selectedNote, selectedNoteId, openQuickCapture, createNote, selectNote } = useNotes();

  // Mobile state
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('list');
  const [showSidebar, setShowSidebar] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowSidebar(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-switch to editor on mobile when note selected
  useEffect(() => {
    if (isMobile && selectedNoteId) {
      setMobileView('editor');
    }
  }, [isMobile, selectedNoteId]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + N for quick capture
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'n') {
        e.preventDefault();
        openQuickCapture();
      }

      // Cmd/Ctrl + N for new note
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'n') {
        e.preventDefault();
        createNote();
      }

      // Escape to go back on mobile
      if (e.key === 'Escape' && isMobile && mobileView === 'editor') {
        setMobileView('list');
        selectNote(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openQuickCapture, createNote, isMobile, mobileView, selectNote]);

  const handleMobileBack = useCallback(() => {
    if (mobileView === 'editor') {
      setMobileView('list');
    } else if (mobileView === 'list' && showSidebar) {
      setShowSidebar(false);
    }
  }, [mobileView, showSidebar]);

  // IMPORTANT: .dark must be on an ANCESTOR of [data-design-theme] for CSS selectors to work
  // CSS: .dark [data-design-theme="theme"] { ... } requires ancestor-descendant relationship
  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div
        data-design-theme={designTheme}
        className="min-h-screen flex flex-col transition-colors duration-300"
        style={{
          backgroundColor: 'hsl(var(--theme-background))',
          color: 'hsl(var(--theme-foreground))',
          fontFamily: 'var(--theme-font)',
        }}
      >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 h-14 border-b border-[hsl(var(--theme-border))] backdrop-blur-xl"
        style={{ backgroundColor: 'hsl(var(--theme-background) / 0.8)' }}
      >
        <div className="h-full max-w-[1600px] mx-auto px-4 flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            {isMobile && (
              <button
                onClick={() => {
                  if (mobileView === 'editor') {
                    setMobileView('list');
                  } else {
                    setShowSidebar(!showSidebar);
                  }
                }}
                className="p-2 rounded-lg hover:bg-[hsl(var(--theme-muted))] transition-colors"
              >
                {mobileView === 'editor' ? (
                  <ChevronLeft className="w-5 h-5" />
                ) : showSidebar ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}

            {/* Back to home */}
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>

            {!isMobile && (
              <div className="w-px h-6 bg-[hsl(var(--theme-border))]" />
            )}

            {/* App icon and title */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--theme-primary)), hsl(var(--theme-accent)))',
                }}
              >
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h1
                className="text-lg font-semibold text-[hsl(var(--theme-foreground))]"
                style={{ fontFamily: 'var(--theme-font-heading)' }}
              >
                Notes
              </h1>
            </div>
          </div>

          {/* Center - Search (hidden on mobile) */}
          {!isMobile && (
            <div className="flex-1 max-w-md mx-4">
              <NotesSearch />
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Quick capture button */}
            <button
              onClick={openQuickCapture}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--theme-primary))] text-white hover:bg-[hsl(var(--theme-primary)/0.9)] transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Capture</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-[hsl(var(--theme-muted))] transition-colors"
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile search */}
      {isMobile && mobileView !== 'editor' && (
        <div className="flex-shrink-0 px-4 py-2 border-b border-[hsl(var(--theme-border))]">
          <NotesSearch />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Desktop: 3-column layout */}
        {!isMobile ? (
          <>
            {/* Folders sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-56 flex-shrink-0 border-r border-[hsl(var(--theme-border))]"
            >
              <NotesFolderTree />
            </motion.div>

            {/* Notes list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-72 flex-shrink-0 border-r border-[hsl(var(--theme-border))]"
            >
              <NotesList />
            </motion.div>

            {/* Editor */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 min-w-0"
            >
              {selectedNote ? (
                <NoteEditor note={selectedNote} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <FileText className="w-16 h-16 text-[hsl(var(--theme-muted-foreground))] mb-4" />
                  <h2
                    className="text-xl font-semibold text-[hsl(var(--theme-foreground))] mb-2"
                    style={{ fontFamily: 'var(--theme-font-heading)' }}
                  >
                    Select a note
                  </h2>
                  <p className="text-sm text-[hsl(var(--theme-muted-foreground))] mb-4">
                    Choose a note from the list or create a new one
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[hsl(var(--theme-muted-foreground))]">
                    <kbd className="px-2 py-1 rounded bg-[hsl(var(--theme-muted))] border border-[hsl(var(--theme-border))]">
                      ⌘N
                    </kbd>
                    <span>New note</span>
                    <span className="mx-2">·</span>
                    <kbd className="px-2 py-1 rounded bg-[hsl(var(--theme-muted))] border border-[hsl(var(--theme-border))]">
                      ⌘⇧N
                    </kbd>
                    <span>Quick capture</span>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        ) : (
          /* Mobile: Single column with view switching */
          <>
            {/* Mobile sidebar overlay */}
            <AnimatePresence>
              {showSidebar && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/30 z-10"
                    onClick={() => setShowSidebar(false)}
                  />
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={springs.snappy}
                    className="absolute left-0 top-0 bottom-0 w-64 z-20 bg-[hsl(var(--theme-background))] border-r border-[hsl(var(--theme-border))]"
                  >
                    <NotesFolderTree />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Mobile content */}
            <AnimatePresence mode="wait">
              {mobileView === 'list' && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={springs.snappy}
                  className="flex-1"
                >
                  <NotesList />
                </motion.div>
              )}

              {mobileView === 'editor' && selectedNote && (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={springs.snappy}
                  className="flex-1"
                >
                  <NoteEditor note={selectedNote} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Quick Capture Modal */}
      <QuickCaptureModal />
      </div>
    </div>
  );
}

export function NotesApp() {
  return (
    <NotesProvider>
      <NotesAppContent />
    </NotesProvider>
  );
}
