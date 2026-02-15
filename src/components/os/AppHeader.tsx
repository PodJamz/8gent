'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GripIcon } from '@/components/ui/grip-icon';
import { SuggestionForm } from '@/components/roadmap/SuggestionForm';
import {
  X,
  Home,
  FileText,
  FolderKanban,
  Star,
  Mail,
  Palette,
  User,
  Music,
  Brain,
  Compass,
  MessageSquare,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Top 9 apps for quick access menu
const APP_MENU_ITEMS = [
  { name: 'Blog', href: '/blog', icon: FileText, color: '#3b82f6' },
  { name: 'Projects', href: '/projects', icon: FolderKanban, color: '#8b5cf6' },
  { name: 'Resume', href: '/resume', icon: Star, color: '#f59e0b' },
  { name: 'Contact', href: '/contacts', icon: Mail, color: '#ef4444' },
  { name: 'Design', href: '/design', icon: Palette, color: '#ec4899' },
  { name: 'Story', href: '/story', icon: User, color: '#10b981' },
  { name: 'Studio', href: '/studio', icon: Music, color: '#f97316' },
  { name: 'Regulate', href: '/regulate', icon: Brain, color: '#06b6d4' },
  { name: 'Photos', href: '/photos', icon: Compass, color: '#84cc16' },
];

interface AppHeaderProps {
  /** The name of the current app (shown in badge) */
  appName: string;
  /** Optional search handler - if provided, search bar is shown */
  onSearch?: (query: string) => void;
  /** Optional placeholder for search input */
  searchPlaceholder?: string;
  /** Whether to show the feedback button */
  showFeedback?: boolean;
  /** Whether to show the app grid menu */
  showAppMenu?: boolean;
  /** Whether to show the theme toggle */
  showThemeToggle?: boolean;
  /** Whether to show the avatar */
  showAvatar?: boolean;
  /** Custom className for the header */
  className?: string;
  /** Optional children to render in the center (overrides search) */
  children?: React.ReactNode;
}

export function AppHeader({
  appName,
  onSearch,
  searchPlaceholder = 'Search...',
  showFeedback = true,
  showAppMenu = true,
  showThemeToggle = true,
  showAvatar = true,
  className,
  children,
}: AppHeaderProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
    const handlePopState = () => {
      setCanGoBack(window.history.length > 1);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleGoBack = () => {
    if (canGoBack) {
      router.back();
    }
  };

  const handleGoForward = () => {
    router.forward();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
    }
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 flex items-center justify-between px-3 sm:px-4 lg:px-6 h-14',
          'border-b bg-[hsl(var(--theme-card)/0.8)] backdrop-blur-md',
          'border-[hsl(var(--theme-border))]',
          className
        )}
        style={{ color: 'hsl(var(--theme-foreground))' }}
      >
        {/* Left: Close button, navigation, home, app name */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Close button (red, X on hover) - returns to home */}
          <Link
            href="/"
            className="relative w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group"
            onMouseEnter={() => setIsCloseHovered(true)}
            onMouseLeave={() => setIsCloseHovered(false)}
            aria-label="Close app and return home"
          >
            <X
              className={cn(
                'w-2.5 h-2.5 text-white transition-opacity',
                isCloseHovered ? 'opacity-100' : 'opacity-0'
              )}
              strokeWidth={3}
            />
          </Link>

          {/* Back/Forward navigation arrows */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={handleGoBack}
              disabled={!canGoBack}
              aria-label="Go back"
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-lg transition-all',
                canGoBack
                  ? 'text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))]'
                  : 'text-[hsl(var(--theme-muted-foreground)/0.3)] cursor-not-allowed'
              )}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                <path d="M11 13l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={handleGoForward}
              aria-label="Go forward"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))] transition-all"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                <path d="M7 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Home button */}
          <Link
            href="/"
            className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))] transition-all"
            aria-label="Go to home"
          >
            <Home className="w-4 h-4" />
          </Link>

          {/* App name badge */}
          <div
            className="px-2.5 py-1 rounded-md text-xs font-mono border"
            style={{
              backgroundColor: 'hsl(var(--theme-muted))',
              borderColor: 'hsl(var(--theme-border))',
              color: 'hsl(var(--theme-muted-foreground))',
            }}
          >
            {appName}
          </div>
        </div>

        {/* Mobile: Simple back button */}
        <div className="sm:hidden flex items-center gap-2 ml-2">
          <button
            onClick={handleGoBack}
            disabled={!canGoBack}
            aria-label="Go back"
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-xl transition-all',
              canGoBack
                ? 'text-[hsl(var(--theme-muted-foreground))] hover:text-[hsl(var(--theme-foreground))] hover:bg-[hsl(var(--theme-muted))] active:scale-95'
                : 'text-[hsl(var(--theme-muted-foreground)/0.3)] cursor-not-allowed'
            )}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path d="M12 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Center: Search or custom children */}
        <div className="flex-1 flex justify-center px-2 sm:px-4">
          {children ? (
            children
          ) : onSearch ? (
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl text-sm transition-all border"
                style={{
                  backgroundColor: 'hsl(var(--theme-muted))',
                  borderColor: 'hsl(var(--theme-border))',
                  color: 'hsl(var(--theme-foreground))',
                }}
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          ) : null}
        </div>

        {/* Right: App menu, theme toggle, feedback, avatar */}
        <div className="flex items-center gap-2">
          {/* App grid menu */}
          {showAppMenu && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Open app menu"
                className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-ring))] focus:ring-offset-2"
                style={{
                  backgroundColor: 'hsl(var(--theme-muted))',
                  color: 'hsl(var(--theme-muted-foreground))',
                }}
              >
                <GripIcon size={18} />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-72 rounded-2xl shadow-xl p-4 z-50 border"
                    style={{
                      backgroundColor: 'hsl(var(--theme-card))',
                      borderColor: 'hsl(var(--theme-border))',
                    }}
                  >
                    <div className="grid grid-cols-3 gap-3">
                      {APP_MENU_ITEMS.map((app) => (
                        <Link
                          key={app.name}
                          href={app.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex flex-col items-center p-3 rounded-xl transition-colors hover:bg-[hsl(var(--theme-muted))]"
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                            style={{ backgroundColor: app.color }}
                          >
                            <app.icon className="w-5 h-5 text-white" />
                          </div>
                          <span
                            className="text-xs text-center"
                            style={{ color: 'hsl(var(--theme-foreground))' }}
                          >
                            {app.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Theme toggle */}
          {showThemeToggle && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-ring))] focus:ring-offset-2"
              style={{
                backgroundColor: 'hsl(var(--theme-muted))',
                color: 'hsl(var(--theme-muted-foreground))',
              }}
            >
              <span className="dark:hidden text-lg">😃</span>
              <span className="hidden dark:inline text-lg">😎</span>
            </button>
          )}

          {/* Feedback button */}
          {showFeedback && (
            <button
              onClick={() => setIsFeedbackOpen(true)}
              aria-label="Give feedback"
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-ring))] focus:ring-offset-2"
              style={{
                backgroundColor: 'hsl(var(--theme-primary))',
                color: 'hsl(var(--theme-primary-foreground))',
              }}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}

          {/* Avatar - links to story page */}
          {showAvatar && (
            <Link href="/story" className="flex-shrink-0">
              <Avatar
                className="w-8 h-8 sm:w-9 sm:h-9 ring-2 transition-all duration-200 cursor-pointer"
                style={{
                  '--tw-ring-color': 'hsl(var(--theme-border))',
                } as React.CSSProperties}
              >
                <AvatarImage src="/openclaw-logo.png" alt="OpenClaw-OS" className="object-cover" />
                <AvatarFallback
                  className="font-semibold text-sm"
                  style={{
                    backgroundColor: 'hsl(var(--theme-primary))',
                    color: 'hsl(var(--theme-primary-foreground))',
                  }}
                >
                  AI
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
      </header>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <SuggestionForm isModal onClose={() => setIsFeedbackOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default AppHeader;
