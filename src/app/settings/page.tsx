'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useDesignTheme } from '@/context/DesignThemeContext';
import { PageTransition } from '@/components/ios';
import { ThemeName, themes } from '@/lib/themes';
import {
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  Palette,
  Monitor,
  Accessibility,
  Bell,
  Lock,
  User,
  Info,
  Settings,
  Sparkles,
  Volume2,
  Keyboard,
  Eye,
  Zap,
  Check,
  X,
  Shield,
  Key,
  Users,
  Github,
  Plug,
  Brain,
  Terminal,
} from 'lucide-react';
import { useAdminSession } from '@/hooks/useAdminSession';

// ============================================================================
// Types
// ============================================================================

interface SettingItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  type: 'link' | 'toggle' | 'select' | 'action';
  value?: string | boolean;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

interface SettingGroup {
  title?: string;
  items: SettingItem[];
}

// ============================================================================
// Settings Toggle Component
// ============================================================================

function SettingsToggle({
  enabled,
  onChange,
  ariaLabel,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      onClick={() => onChange(!enabled)}
      className={`
        relative w-12 h-7 rounded-full transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:ring-[hsl(var(--theme-primary))]
        ${enabled ? 'bg-theme-primary' : 'bg-zinc-600'}
      `}
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md"
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

// ============================================================================
// Settings Row Component
// ============================================================================

function SettingsRow({
  item,
  isFirst,
  isLast,
}: {
  item: SettingItem;
  isFirst: boolean;
  isLast: boolean;
}) {
  const content = (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 bg-white/5
        ${isFirst ? 'rounded-t-xl' : ''}
        ${isLast ? 'rounded-b-xl' : ''}
        ${!isLast ? 'border-b border-white/5' : ''}
        ${item.type === 'link' || item.type === 'action' ? 'hover:bg-white/10 cursor-pointer' : ''}
        transition-colors
      `}
    >
      {/* Icon */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.iconBg}`}
      >
        {item.icon}
      </div>

      {/* Label */}
      <span className="flex-1 text-white text-sm">{item.label}</span>

      {/* Value/Control */}
      {item.type === 'link' && (
        <div className="flex items-center gap-2">
          {item.value && (
            <span className="text-white/40 text-sm">{item.value}</span>
          )}
          <ChevronRight className="w-4 h-4 text-white/30" aria-hidden="true" />
        </div>
      )}

      {item.type === 'toggle' && (
        <SettingsToggle
          enabled={item.value as boolean}
          onChange={item.onClick as unknown as (value: boolean) => void}
          ariaLabel={item.ariaLabel || item.label}
        />
      )}

      {item.type === 'select' && (
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">{item.value}</span>
          <ChevronRight className="w-4 h-4 text-white/30" aria-hidden="true" />
        </div>
      )}

      {item.type === 'action' && (
        <ChevronRight className="w-4 h-4 text-white/30" aria-hidden="true" />
      )}
    </div>
  );

  if (item.type === 'link' && item.href) {
    return (
      <Link href={item.href} aria-label={item.ariaLabel || item.label}>
        {content}
      </Link>
    );
  }

  if (item.type === 'action' && item.onClick) {
    return (
      <button
        onClick={item.onClick}
        className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--theme-primary))]"
        aria-label={item.ariaLabel || item.label}
      >
        {content}
      </button>
    );
  }

  return content;
}

// ============================================================================
// Settings Group Component
// ============================================================================

function SettingsGroup({ group }: { group: SettingGroup }) {
  return (
    <div className="mb-6">
      {group.title && (
        <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 px-4">
          {group.title}
        </h2>
      )}
      <div className="rounded-xl overflow-hidden">
        {group.items.map((item, index) => (
          <SettingsRow
            key={item.id}
            item={item}
            isFirst={index === 0}
            isLast={index === group.items.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Theme Picker Component
// ============================================================================

function ThemePicker({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeName;
  onSelectTheme: (theme: ThemeName) => void;
}) {
  // Group themes by category
  const themeCategories = {
    'Minimal': ['base', 'utilitarian', 'clean-slate', 'modern-minimal', 'amber-minimal', 'tao'],
    'Tech': ['claude', 'chatgpt', 'vercel', 'bold-tech', 't3-chat'],
    'Nature': ['nature', 'kodama-grove', 'sage-garden', 'ocean-breeze', 'northern-lights'],
    'Creative': ['cyberpunk', 'retro-arcade', 'neo-brutalism', 'candyland', 'doom-64'],
    'Elegant': ['elegant-luxury', 'midnight-bloom', 'cosmic-night', 'quantum-rose', 'violet-bloom'],
    'Warm': ['caffeine', 'mocha-mousse', 'sunset-horizon', 'solar-dusk', 'pastel-dreams'],
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-zinc-900 rounded-t-3xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="theme-picker-title"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-white/10">
              <button
                onClick={onClose}
                className="p-2 -ml-2 text-white/60 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--theme-primary))]"
                aria-label="Close theme picker"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 id="theme-picker-title" className="text-lg font-semibold text-white">
                Choose Theme
              </h2>
              <div className="w-9" /> {/* Spacer for centering */}
            </div>

            {/* Theme Grid */}
            <div className="overflow-y-auto p-6 space-y-6">
              {Object.entries(themeCategories).map(([category, themeNames]) => (
                <div key={category}>
                  <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {themeNames.map((themeName) => {
                      const isSelected = currentTheme === themeName;
                      return (
                        <button
                          key={themeName}
                          onClick={() => {
                            onSelectTheme(themeName as ThemeName);
                            onClose();
                          }}
                          data-design-theme={themeName}
                          className={`
                            relative p-4 rounded-xl border-2 transition-all
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 focus-visible:ring-[hsl(var(--theme-primary))]
                            ${isSelected
                              ? 'border-[hsl(var(--theme-primary))] bg-[hsl(var(--theme-card))]'
                              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                            }
                          `}
                          aria-label={`Select ${themeName} theme`}
                          aria-pressed={isSelected}
                        >
                          {/* Theme preview */}
                          <div
                            className="w-full h-8 rounded-lg mb-2"
                            style={{
                              background: 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
                            }}
                          />
                          <span
                            className="text-sm font-medium capitalize"
                            style={{ color: 'hsl(var(--theme-foreground))' }}
                          >
                            {themeName.replace(/-/g, ' ')}
                          </span>
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <Check className="w-4 h-4 text-theme-primary" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// Main Settings Page
// ============================================================================

export default function SettingsPage() {
  const { theme: colorMode, setTheme: setColorMode } = useTheme();
  const { theme: designTheme, setTheme: setDesignTheme } = useDesignTheme();
  const { isAuthenticated: isAdmin, isLoading: isAdminLoading } = useAdminSession();
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
  }, []);

  const settingsGroups: SettingGroup[] = [
    {
      items: [
        {
          id: 'profile',
          label: 'Profile',
          icon: <User className="w-4 h-4 text-white" />,
          iconBg: 'bg-gradient-theme',
          type: 'link',
          href: '/resume',
          value: '8gent',
          ariaLabel: 'View profile',
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          label: 'Design Theme',
          icon: <Palette className="w-4 h-4 text-white" />,
          iconBg: 'bg-gradient-to-br from-pink-500 to-purple-600',
          type: 'action',
          value: designTheme.replace(/-/g, ' '),
          onClick: () => setShowThemePicker(true),
          ariaLabel: 'Change design theme',
        },
        {
          id: 'colorMode',
          label: 'Dark Mode',
          icon: colorMode === 'dark' ? (
            <Moon className="w-4 h-4 text-white" />
          ) : (
            <Sun className="w-4 h-4 text-white" />
          ),
          iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-600',
          type: 'toggle',
          value: colorMode === 'dark',
          onClick: () => setColorMode(colorMode === 'dark' ? 'light' : 'dark'),
          ariaLabel: 'Toggle dark mode',
        },
      ],
    },
    {
      title: 'Accessibility',
      items: [
        {
          id: 'reducedMotion',
          label: 'Reduce Motion',
          icon: <Zap className="w-4 h-4 text-white" />,
          iconBg: 'bg-gradient-to-br from-yellow-500 to-orange-600',
          type: 'toggle',
          value: reducedMotion,
          onClick: () => setReducedMotion(!reducedMotion),
          ariaLabel: 'Toggle reduced motion',
        },
        {
          id: 'keyboard',
          label: 'Keyboard Shortcuts',
          icon: <Keyboard className="w-4 h-4 text-white" />,
          iconBg: 'bg-gradient-to-br from-gray-500 to-gray-700',
          type: 'link',
          href: '#keyboard-shortcuts',
          ariaLabel: 'View keyboard shortcuts',
        },
      ],
    },
    {
      title: '8gent',
      items: [
        {
          id: 'skills',
          label: 'Skills',
          icon: <Sparkles className="w-4 h-4 text-white" />,
          iconBg: 'bg-gradient-to-br from-amber-500 to-red-500',
          type: 'link',
          href: '/skills',
          value: '89 skills',
          ariaLabel: 'Manage 8gent skills',
        },
        {
          id: 'clawAI',
          label: '8gent Assistant',
          icon: <Sparkles className="w-4 h-4 text-white" />,
          iconBg: 'bg-gradient-to-br from-orange-500 to-amber-600',
          type: 'link',
          href: '#claw-ai',
          value: 'Active',
          ariaLabel: 'Configure 8gent',
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: <Bell className="w-4 h-4 text-white" />,
          iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
          type: 'toggle',
          value: notifications,
          onClick: () => setNotifications(!notifications),
          ariaLabel: 'Toggle notifications',
        },
      ],
    },
    {
      title: 'Apps',
      items: [
        {
          id: 'jamz',
          label: 'Jamz Studio',
          icon: <Volume2 className="w-4 h-4 text-white" />,
          iconBg: 'bg-gradient-theme',
          type: 'link',
          href: '/studio',
          ariaLabel: 'Open Jamz Studio',
        },
        {
          id: 'vault',
          label: 'Vault',
          icon: <Lock className="w-4 h-4 text-white" />,
          iconBg: 'bg-gradient-to-br from-cyan-500 to-indigo-600',
          type: 'link',
          href: '/vault',
          ariaLabel: 'Open Vault',
        },
        {
          id: 'design',
          label: 'Design Gallery',
          icon: <Eye className="w-4 h-4 text-white" />,
          iconBg: 'bg-gradient-to-br from-fuchsia-500 to-pink-600',
          type: 'link',
          href: '/design',
          ariaLabel: 'Open Design Gallery',
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          id: 'about',
          label: 'About 8gent',
          icon: <Info className="w-4 h-4 text-white" />,
          iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
          type: 'link',
          href: '/story',
          ariaLabel: 'About 8gent',
        },
      ],
    },
  ];

  // Admin-only security section
  const securityGroup: SettingGroup = {
    title: 'Security',
    items: [
      {
        id: 'operations',
        label: 'Operations Center',
        icon: <Terminal className="w-4 h-4 text-white" />,
        iconBg: 'bg-gradient-to-br from-violet-500 to-fuchsia-600',
        type: 'link',
        href: '/operations',
        ariaLabel: 'Monitor backend operations, providers, and security',
      },
      {
        id: 'aiProviders',
        label: 'AI Providers',
        icon: <Brain className="w-4 h-4 text-white" />,
        iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
        type: 'link',
        href: '/settings/ai',
        ariaLabel: 'Configure local and cloud AI providers',
      },
      {
        id: 'integrations',
        label: 'Integrations',
        icon: <Plug className="w-4 h-4 text-white" />,
        iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
        type: 'link',
        href: '/settings/integrations',
        ariaLabel: 'Manage connected accounts like GitHub',
      },
      {
        id: 'userManagement',
        label: 'User Management',
        icon: <User className="w-4 h-4 text-white" />,
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
        type: 'link',
        href: '/settings/users',
        ariaLabel: 'Manage users and permissions',
      },
      {
        id: 'passcodes',
        label: 'Passcodes',
        icon: <Key className="w-4 h-4 text-white" />,
        iconBg: 'bg-gradient-to-br from-orange-500 to-red-600',
        type: 'link',
        href: '/settings/passcodes',
        ariaLabel: 'Manage passcodes for protected areas',
      },
      {
        id: 'collaborators',
        label: 'iPod Collaborators',
        icon: <Users className="w-4 h-4 text-white" />,
        iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        type: 'link',
        href: '/settings/collaborators',
        ariaLabel: 'Manage iPod collaborators',
      },
      {
        id: 'adminAccess',
        label: 'Admin Access',
        icon: <Shield className="w-4 h-4 text-white" />,
        iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
        type: 'link',
        href: '/settings/admin',
        value: 'Logged in',
        ariaLabel: 'Admin access settings',
      },
    ],
  };

  if (!mounted) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-950">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--theme-primary))]"
              aria-label="Go back home"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-xl font-semibold text-white">Settings</h1>
          </div>
        </header>

        {/* Settings Content */}
        <main
          className="max-w-lg mx-auto px-4 py-6"
          role="main"
          aria-label="Settings"
        >
          {settingsGroups.map((group, index) => (
            <SettingsGroup key={index} group={group} />
          ))}

          {/* Admin-only Security section */}
          {isAdmin && !isAdminLoading && (
            <SettingsGroup group={securityGroup} />
          )}

          {/* Keyboard Shortcuts Info */}
          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Keyboard Shortcuts
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/60">Go back / Close overlay</dt>
                <dd className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">Esc</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/60">Navigate dock</dt>
                <dd className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">←→</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/60">Navigate apps</dt>
                <dd className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">↑↓←→</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/60">Select / Activate</dt>
                <dd className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">Enter</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/60">Skip to main content</dt>
                <dd className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">Tab</dd>
              </div>
            </dl>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-xs text-white/30">
            <p>8gent • Built with Next.js & Framer Motion</p>
            <p className="mt-1">Themes apply across all apps</p>
          </footer>
        </main>

        {/* Theme Picker */}
        <ThemePicker
          isOpen={showThemePicker}
          onClose={() => setShowThemePicker(false)}
          currentTheme={designTheme}
          onSelectTheme={setDesignTheme}
        />
      </div>
    </PageTransition>
  );
}
