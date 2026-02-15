'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Palette, Code2, Sparkles } from 'lucide-react';

type Tab = 'themes' | 'components' | 'templates';

interface DesignNavigationProps {
  /** Optional additional content on the right side */
  rightContent?: React.ReactNode;
}

const TABS: { id: Tab; label: string; href: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'themes', label: 'Themes', href: '/design', icon: Palette },
  // Hidden for now - still being refined
  // { id: 'components', label: 'Components', href: '/design/components', icon: Code2 },
  // { id: 'templates', label: 'Templates', href: '/design/library', icon: Sparkles },
];

export function DesignNavigation({ rightContent }: DesignNavigationProps) {
  const pathname = usePathname();

  // Determine active tab based on pathname
  const getActiveTab = (): Tab => {
    if (pathname === '/design/components') return 'components';
    if (pathname === '/design/library') return 'templates';
    return 'themes';
  };

  const activeTab = getActiveTab();

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
        style={{
          borderColor: 'hsl(var(--theme-border))',
          backgroundColor: 'hsla(var(--theme-background) / 0.9)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Left: Back to home */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex-shrink-0"
          >
            <Link
              href="/"
              className="flex items-center gap-2 transition-all hover:opacity-70"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Back</span>
            </Link>
          </motion.div>

          {/* Center: Tab Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="flex items-center"
          >
            <div
              className="flex items-center gap-1 p-1 rounded-lg"
              style={{ backgroundColor: 'hsl(var(--theme-muted) / 0.5)' }}
            >
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all"
                    style={{
                      color: isActive
                        ? 'hsl(var(--theme-foreground))'
                        : 'hsl(var(--theme-muted-foreground))',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-md"
                        style={{ backgroundColor: 'hsl(var(--theme-background))' }}
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.nav>

          {/* Right: Optional content */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex-shrink-0 min-w-[60px] flex justify-end"
          >
            {rightContent}
          </motion.div>
        </div>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-14" />
    </>
  );
}
