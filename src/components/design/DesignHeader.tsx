'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ThemeName } from '@/lib/themes';
import { ThemeToolbar } from './ThemeToolbar';

interface DesignHeaderProps {
  /** Current theme name for styling */
  currentTheme: ThemeName;
  /** Back link destination */
  backHref: string;
  /** Back link text */
  backText?: string;
  /** Optional right side content (logo, title, etc.) */
  rightContent?: React.ReactNode;
  /** Optional center content */
  centerContent?: React.ReactNode;
  /** Show the theme toolbar with Apply/Export/Reference buttons */
  showToolbar?: boolean;
  /** Theme label for display in toolbar */
  themeLabel?: string;
  /** Callback when theme is referenced to 8gent */
  onReferenceToAI?: (prompt: string) => void;
}

export function DesignHeader({
  currentTheme,
  backHref,
  backText = 'Back',
  rightContent,
  centerContent,
  showToolbar = false,
  themeLabel,
  onReferenceToAI,
}: DesignHeaderProps) {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
        style={{
          borderColor: 'hsl(var(--theme-border))',
          backgroundColor: 'hsla(var(--theme-background) / 0.85)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
          {/* Left: Back button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex-shrink-0"
          >
            <Link
              href={backHref}
              className="flex items-center gap-2 transition-all hover:opacity-70 hover:-translate-x-0.5"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">{backText}</span>
            </Link>
          </motion.div>

          {/* Center: Optional content or Toolbar */}
          {centerContent ? (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="absolute left-1/2 -translate-x-1/2 hidden md:block"
            >
              {centerContent}
            </motion.div>
          ) : showToolbar && themeLabel ? (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="flex-1 flex justify-center"
            >
              <ThemeToolbar
                themeName={currentTheme}
                themeLabel={themeLabel}
                onReferenceToAI={onReferenceToAI}
              />
            </motion.div>
          ) : null}

          {/* Right: Custom content */}
          {rightContent && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex-shrink-0"
            >
              {rightContent}
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Spacer to account for fixed header */}
      <div className="h-14" />
    </>
  );
}
