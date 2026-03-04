"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GripIcon } from "@/components/ui/grip-icon";
import { SuggestionForm } from "@/components/roadmap/SuggestionForm";
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
} from "lucide-react";

interface TopBarProps {
  onSearch?: (query: string) => void;
}

// App menu items - curated selection from the OS
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

export const TopBar: React.FC<TopBarProps> = ({ onSearch }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if browser navigation is available
    setCanGoBack(window.history.length > 1);
    // Note: canGoForward is harder to detect reliably, but we'll try
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
      // Navigate to search results or trigger search
      onSearch?.(searchQuery);
    }
  };

  return (
    <>
    <header className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-4 lg:px-6 h-14 border-b border-border bg-card/80 backdrop-blur-md">
      {/* Left: Close button, nav arrows, home, app name - hidden on mobile */}
      <div className="hidden sm:flex items-center gap-2 lg:gap-3">
        {/* Close button (red, X on hover) - returns to home */}
        <Link
          href="/"
          className="relative w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group mr-2"
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          aria-label="Close app and return home"
        >
          <X
            className={`w-2.5 h-2.5 text-white transition-opacity ${isCloseHovered ? 'opacity-100' : 'opacity-0'}`}
            strokeWidth={3}
          />
        </Link>

        {/* Back/Forward navigation */}
        <button
          onClick={handleGoBack}
          disabled={!canGoBack}
          aria-label="Go back"
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
            canGoBack
              ? "text-muted-foreground hover:text-foreground hover:bg-muted"
              : "text-muted-foreground/30 cursor-not-allowed"
          }`}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M11 13l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button
          onClick={handleGoForward}
          aria-label="Go forward"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M7 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* Home button */}
        <Link
          href="/"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          aria-label="Go to home"
        >
          <Home className="w-4 h-4" />
        </Link>

        {/* App name badge */}
        <div className="px-2.5 py-1 rounded-md bg-muted text-xs font-mono text-muted-foreground border border-border">Blog</div>
      </div>

      {/* Mobile: Close button + back + app name */}
      <div className="sm:hidden flex items-center gap-2">
        {/* Close button on mobile */}
        <Link
          href="/"
          className="relative w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center"
          aria-label="Close app and return home"
        >
          <X className="w-2.5 h-2.5 text-white opacity-100" strokeWidth={3} />
        </Link>
        <button
          onClick={handleGoBack}
          disabled={!canGoBack}
          aria-label="Go back"
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
            canGoBack
              ? "text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95"
              : "text-muted-foreground/30 cursor-not-allowed"
          }`}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M12 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="px-3 py-1.5 rounded-lg bg-muted text-xs font-mono text-muted-foreground border border-border">Blog</div>
      </div>

      {/* Center: search - responsive width */}
      <div className="flex-1 flex justify-center px-2 sm:px-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl bg-muted text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-border"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M14 14l-2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </form>
      </div>

      {/* Right: Menu, Theme, Feedback, and Avatar */}
      <div className="flex items-center gap-2">
        {/* App menu - Gmail style */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Open app menu"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                className="absolute right-0 top-12 w-72 bg-card rounded-2xl shadow-xl border border-border p-4 z-50"
              >
                <div className="grid grid-cols-3 gap-3">
                  {APP_MENU_ITEMS.map((app) => (
                    <Link
                      key={app.name}
                      href={app.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex flex-col items-center p-3 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                        style={{ backgroundColor: app.color }}
                      >
                        <app.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs text-foreground text-center">{app.name}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme selector button */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {/* Light mode icon */}
          <span className="dark:hidden text-lg">😃</span>
          {/* Dark mode icon */}
          <span className="hidden dark:inline text-lg">😎</span>
        </button>

        {/* Feedback button */}
        <button
          onClick={() => setIsFeedbackOpen(true)}
          aria-label="Give feedback"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Avatar - links to story page */}
        <Link href="/story" className="flex-shrink-0">
          <Avatar className="w-8 h-8 sm:w-9 sm:h-9 ring-2 ring-border hover:ring-primary/40 transition-all duration-200 cursor-pointer">
            <AvatarImage src="/8gent-logo.png" alt="8gent" className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
              JS
            </AvatarFallback>
          </Avatar>
        </Link>
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
};
