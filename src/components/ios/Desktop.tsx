'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { useHomeScreen, defaultApps, GridItem, AppItem } from '@/context/HomeScreenContext';
import { useControlCenter } from '@/context/ControlCenterContext';
import { DraggableAppIcon } from './DraggableAppIcon';
import { AppFolder } from './AppFolder';
import { StatusBarWatch } from './StatusBarWatch';
import { DynamicIsland, DynamicIslandProvider } from './DynamicIsland';
import {
  BookOpen,
  Palette,
  FileText,
  Music,
  Lock,
  NotebookText,
  Camera,
  FolderKanban,
  Box,
  Layers,
  RotateCcw,
  Settings,
  Waves,
  Users,
  Navigation,
  Calendar,
  Contact,
  StickyNote,
  CloudSun,
  Gamepad2,
  Terminal,
  Sparkles,
  Briefcase,
  Search,
  PenTool,
  Smartphone,
  Wrench,
  NotebookPen,
  CircleDot,
  GraduationCap,
  Map,
  Clapperboard,
  HeartPulse,
  BookHeart,
  UtensilsCrossed,
  Compass,
  Target,
  Globe,
  MessageSquare,
  Infinity,
  Shield,
  BookOpenCheck,
  Clock,
  Bell,
  Timer,
  Rotate3d,
  CircleUser,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { motionConfig } from '@/components/motion/config';
import { useRouter } from 'next/navigation';
import { GALLERY_IMAGES } from '@/lib/gallery-images';
import { useSessionBrain } from '@/context/SessionBrainContext';

// Screensaver rotation interval (60 seconds)
const SCREENSAVER_INTERVAL = 60000;

interface DesktopProps {
  isVisible: boolean;
}

// App icons using lucide-react (same style as dock)
const AppIconComponents: Record<string, React.ReactNode> = {
  // Entry/Core apps
  story: <BookOpen className="w-7 h-7" />,
  blog: <NotebookText className="w-7 h-7" />,
  design: <Palette className="w-7 h-7" />,
  resume: <FileText className="w-7 h-7" />,

  // Create apps
  music: <Music className="w-7 h-7" />,
  jamz: <Waves className="w-7 h-7" />,
  prototyping: <Layers className="w-7 h-7" />,
  notes: <StickyNote className="w-7 h-7" />,
  cowrite: <PenTool className="w-7 h-7" />,
  product: <Box className="w-7 h-7" />,
  projects: <FolderKanban className="w-7 h-7" />,
  mockit: <Smartphone className="w-7 h-7" />,

  // Work/Hire apps
  humans: <Users className="w-7 h-7" />,
  activity: <Briefcase className="w-7 h-7" />,
  calendar: <Calendar className="w-7 h-7" />,
  contacts: <Contact className="w-7 h-7" />,

  // Explore apps
  photos: <Camera className="w-7 h-7" />,
  inspirations: <Sparkles className="w-7 h-7" />,
  way: <Navigation className="w-7 h-7" />,

  // Theme showcases
  claude: null, // uses imageUrl
  chatgpt: null, // uses imageUrl
  utilitarian: <Wrench className="w-7 h-7" />,
  notebook: <NotebookPen className="w-7 h-7" />,
  tao: <CircleDot className="w-7 h-7" />,
  research: <GraduationCap className="w-7 h-7" />,
  'field-guide': <Map className="w-7 h-7" />,

  // Social/Connect apps
  github: <Icons.github className="w-7 h-7" />,
  linkedin: <Icons.linkedin className="w-7 h-7" />,
  x: <Icons.x className="w-7 h-7" />,

  // Vibes/Fun apps
  weather: <CloudSun className="w-7 h-7" />,
  games: <Gamepad2 className="w-7 h-7" />,
  terminal: <Terminal className="w-7 h-7" />,
  reels: <Clapperboard className="w-7 h-7" />,

  // System apps
  skills: <Sparkles className="w-7 h-7" />,
  vault: <Lock className="w-7 h-7" />,
  settings: <Settings className="w-7 h-7" />,
  search: <Search className="w-7 h-7" />,

  // Neurodiversity apps
  regulation: <HeartPulse className="w-7 h-7" />,
  journal: <BookHeart className="w-7 h-7" />,
  food: <UtensilsCrossed className="w-7 h-7" />,
  sidequests: <Compass className="w-7 h-7" />,
  hyperfocus: <Target className="w-7 h-7" />,

  // Research & Knowledge apps
  'research-app': <Globe className="w-7 h-7" />,

  // Missing icons - added for completeness
  agent: <Infinity className="w-7 h-7" />,
  canvas: <Layers className="w-7 h-7" />,
  messages: <MessageSquare className="w-7 h-7" />,
  '3d-gallery': <Rotate3d className="w-7 h-7" />,
  avatar: <CircleUser className="w-7 h-7" />,
  'bubble-timer': <Timer className="w-7 h-7" />,
  security: <Shield className="w-7 h-7" />,
  wiki: <BookOpenCheck className="w-7 h-7" />,
  watch: <Clock className="w-7 h-7" />,
  updates: <Bell className="w-7 h-7" />,
  browser: <Globe className="w-7 h-7" />,
  threads: null, // uses imageUrl
};

// Helper to get icon for an app
function getAppIcon(appId: string): React.ReactNode {
  return AppIconComponents[appId] || null;
}

// Enrich app with icon
function enrichAppWithIcon(app: AppItem): AppItem {
  return {
    ...app,
    icon: getAppIcon(app.id),
  };
}

export function Desktop({ isVisible }: DesktopProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const prefersReducedMotion = useReducedMotion();
  const [focusedAppIndex, setFocusedAppIndex] = useState(0);
  const { open: openControlCenter } = useControlCenter();
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const {
    gridItems,
    isEditMode,
    exitEditMode,
    resetToDefault,
  } = useHomeScreen();

  const { getUnreadCountForApp, markAppNotificationsRead } = useSessionBrain();

  // Handle app open - mark notifications as read
  const handleAppOpen = useCallback((appId: string) => {
    markAppNotificationsRead(appId);
  }, [markAppNotificationsRead]);

  // Time update
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Screensaver: rotate background every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, SCREENSAVER_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Handle keyboard navigation for app grid
  const handleGridKeyDown = useCallback((e: React.KeyboardEvent) => {
    const columns = 4;
    const itemCount = gridItems.length;
    let newIndex = focusedAppIndex;
    let handled = false;

    switch (e.key) {
      case 'ArrowRight':
        newIndex = (focusedAppIndex + 1) % itemCount;
        handled = true;
        break;
      case 'ArrowLeft':
        newIndex = (focusedAppIndex - 1 + itemCount) % itemCount;
        handled = true;
        break;
      case 'ArrowDown':
        newIndex = Math.min(focusedAppIndex + columns, itemCount - 1);
        handled = true;
        break;
      case 'ArrowUp':
        newIndex = Math.max(focusedAppIndex - columns, 0);
        handled = true;
        break;
      case 'Home':
        newIndex = 0;
        handled = true;
        break;
      case 'End':
        newIndex = itemCount - 1;
        handled = true;
        break;
      case 'Enter':
      case ' ':
        // Activate the focused app
        const item = gridItems[focusedAppIndex];
        if (item && item.type === 'app' && item.item.href) {
          e.preventDefault();
          router.push(item.item.href);
        }
        return;
    }

    if (handled) {
      e.preventDefault();
      setFocusedAppIndex(newIndex);
      // Focus the app icon
      const icons = gridRef.current?.querySelectorAll<HTMLElement>('[data-app-icon]');
      icons?.[newIndex]?.focus();
    }
  }, [focusedAppIndex, gridItems, router]);

  // Close edit mode when clicking outside or pressing escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditMode) {
          exitEditMode();
        } else {
          // Global escape to go back
          router.back();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if click is on the background area, not on icons
      if (isEditMode && target.closest('.app-grid-container') === null && !target.closest('.edit-mode-toolbar')) {
        exitEditMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditMode, exitEditMode, router]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-20 flex flex-col"
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={prefersReducedMotion ? { duration: 0.15 } : { duration: 0.5, ease: motionConfig.ease.smooth }}
    >
      {/* Screensaver background with crossfade */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={backgroundIndex}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${GALLERY_IMAGES[backgroundIndex].src})`,
            }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </AnimatePresence>
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Edit Mode Indicator */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            className="edit-mode-toolbar absolute top-20 left-1/2 z-50"
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            role="toolbar"
            aria-label="Edit mode controls"
          >
            <LiquidGlass
              variant="floating"
              intensity="medium"
              className="!px-4 !py-2 !rounded-full flex items-center gap-3"
              rippleEffect={false}
            >
              <span className="text-white/80 text-sm font-medium" aria-live="polite">Edit Mode</span>
              <div className="w-px h-4 bg-white/20" aria-hidden="true" />
              <button
                onClick={resetToDefault}
                className="text-white/60 hover:text-white transition-colors flex items-center gap-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-md px-2 py-1"
                aria-label="Reset to default layout"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                Reset
              </button>
              <button
                onClick={exitEditMode}
                className="text-white/90 hover:text-white transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-md px-2 py-1"
                aria-label="Exit edit mode"
              >
                Done
              </button>
            </LiquidGlass>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Bar - iPhone style with Dynamic Island */}
      <DynamicIslandProvider>
        <motion.header
          className="relative z-30 flex items-start justify-between px-6 pt-3 pb-2 text-white/80"
          initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0.15 } : { delay: 0.2 }}
          role="banner"
          aria-label="System status bar"
        >
          {/* Left - Watch */}
          <StatusBarWatch />

          {/* Center - Dynamic Island (prominent, like iPhone) */}
          <div className="flex-1 flex justify-center -mt-1">
            <DynamicIsland className="z-50" />
          </div>

          {/* Right - Tap area to open Control Center (icons are inside the shelf) */}
          <button
            onClick={openControlCenter}
            className="w-16 h-8 flex items-center justify-end pt-2"
            aria-label="Open Control Center"
          >
            {/* Subtle grip indicator */}
            <div className="w-1 h-4 rounded-full bg-white/20" />
          </button>
        </motion.header>
      </DynamicIslandProvider>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-24">
        {/* Welcome Message */}
        <motion.div
          className="text-center mb-12"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0.15 } : { delay: 0.15 }}
        >
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-2">
            Welcome to 8gent
          </h1>
          <p className="text-white/50 text-sm sm:text-base">
            {isEditMode ? 'Long press and drag to rearrange • Drag icon onto another to create folder' : 'Your agentic workspace'}
          </p>
        </motion.div>

        {/* App Grid - 4 columns, 3 rows with folders */}
        <div
          ref={gridRef}
          className="app-grid-container grid grid-cols-4 gap-4 sm:gap-6 max-w-md sm:max-w-lg"
          role="grid"
          aria-label="Application grid"
          onKeyDown={handleGridKeyDown}
        >
          {gridItems.map((gridItem, index) => {
            if (gridItem.type === 'folder') {
              return (
                <AppFolder
                  key={gridItem.item.id}
                  folder={{
                    ...gridItem.item,
                    apps: gridItem.item.apps.map(enrichAppWithIcon),
                  }}
                  index={index}
                  delay={0.1}
                />
              );
            } else {
              const app = enrichAppWithIcon(gridItem.item);
              return (
                <DraggableAppIcon
                  key={app.id}
                  app={app}
                  index={index}
                  delay={0.1}
                  tabIndex={index === focusedAppIndex ? 0 : -1}
                  onFocus={() => setFocusedAppIndex(index)}
                  notificationCount={getUnreadCountForApp(app.id)}
                  onAppOpen={handleAppOpen}
                />
              );
            }
          })}
        </div>
      </div>

      {/* Bottom Safe Area for Dock */}
      <div className="h-24" />
    </motion.div>
  );
}
