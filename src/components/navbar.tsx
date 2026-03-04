"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, Box, Layers } from "lucide-react";
import { ClawAIOrb } from "@/components/ios/ClawAIOrb";
import { LiquidGlassChatOverlay } from "@/components/ios/LiquidGlassChatOverlay";
import { useOverlay } from "@/context/OverlayContext";
import { useSessionBrain } from "@/context/SessionBrainContext";
import { useMarkClawInteraction } from "@/components/providers/ClawAIProactiveProvider";

// Key for detecting fresh onboarding completion
const ONBOARDING_COMPLETE_KEY = 'openclaw_onboarding_just_completed';

// Map of href to descriptive labels for accessibility
const navLabels: Record<string, string> = {
  '/': 'Home',
  '/canvas': 'Design Canvas',
  '/design': 'Design Gallery',
  '/resume': 'Resume',
  '/music': 'Music Player',
  '/photos': 'Photo Gallery',
  '/inspirations': 'Inspirations',
  '/blog': 'Blog',
  '/projects': 'Projects',
  '/product': 'Product',
  '/prototyping': 'Prototyping',
};

export default function Navbar() {
  const pathname = usePathname();
  const { isOverlayOpen, openOverlay, closeOverlay } = useOverlay();
  const { getUnreadCountForApp, getTotalUnreadCount, markAppNotificationsRead } = useSessionBrain();
  const markClawInteraction = useMarkClawInteraction();
  const showChat = isOverlayOpen('chat');

  // Track if this is a fresh entrance from onboarding
  const [isFromOnboarding, setIsFromOnboarding] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Hide dock on onboarding, updates, and agent pages (full-screen experiences)
  const isOnboardingPage = pathname === '/onboarding';
  const isUpdatesPage = pathname === '/updates';
  const isAgentPage = pathname === '/agent';

  // Get notification count for 8gent (including total as admin is the aggregator)
  const clawNotificationCount = getUnreadCountForApp('claw-ai') + getTotalUnreadCount();

  // Check for fresh onboarding completion on mount
  useEffect(() => {
    const justCompleted = sessionStorage.getItem(ONBOARDING_COMPLETE_KEY);
    if (justCompleted === 'true' && pathname === '/') {
      setIsFromOnboarding(true);
      setIsVisible(false);
      // Clear the flag
      sessionStorage.removeItem(ONBOARDING_COMPLETE_KEY);
      // Delay dock entrance to sync with app icons (they animate first)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 800); // Delay for app icons to animate in first
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleOrbClick = () => {
    openOverlay('chat');
    // Mark James notifications as read when opening chat
    markAppNotificationsRead('claw-ai');
    // Mark that user has interacted with Claw
    markClawInteraction();
  };

  // Global Escape key handler to close overlays or go back
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (showChat) {
        e.preventDefault();
        closeOverlay();
      }
    }
  }, [showChat, closeOverlay]);

  useEffect(() => {
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [handleEscapeKey]);

  // Don't render during onboarding, updates, or agent (full-screen experiences)
  if (isOnboardingPage || isUpdatesPage || isAgentPage) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14"
            initial={isFromOnboarding ? { opacity: 0, y: 40 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={isFromOnboarding ? {
              duration: 0.6,
              ease: [0.23, 1, 0.32, 1],
            } : { duration: 0 }}
          >
            <div
              className="fixed bottom-0 inset-x-0 h-16 w-full to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)]"
              style={{ backgroundColor: 'hsl(var(--theme-background) / 0.8)' }}
            />

            <div className="mx-auto relative">
              <Dock
                ariaLabel="Main navigation"
                className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 backdrop-blur-xl transform-gpu"
                style={{
                  backgroundColor: 'hsl(var(--theme-card) / 0.7)',
                  borderWidth: '1px',
                  borderColor: 'hsl(var(--theme-border) / 0.3)',
                  boxShadow: '0 8px 32px hsl(var(--theme-foreground) / 0.1)',
                }}
              >
                {DATA.navbar.map((item) => {
                  const label = navLabels[item.href] || item.href.slice(1) || 'Home';
                  return (
                    <DockIcon key={item.href} ariaLabel={label}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            aria-label={label}
                            className={cn(
                              buttonVariants({ variant: "ghost", size: "icon" }),
                              "size-12 focus-visible:ring-2 focus-visible:ring-white/50"
                            )}
                          >
                            <item.icon className="size-4" aria-hidden="true" />
                            <span className="sr-only">{label}</span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top" style={{ backgroundColor: 'hsl(var(--theme-card) / 0.95)', color: 'hsl(var(--theme-foreground))', borderColor: 'hsl(var(--theme-border))' }}>
                          {label}
                        </TooltipContent>
                      </Tooltip>
                    </DockIcon>
                  );
                })}

                {/* 8gent Orb - Center of dock */}
                <DockIcon className="relative" ariaLabel="Open 8gent chat">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="size-12 flex items-center justify-center">
                        <ClawAIOrb
                          onClick={handleOrbClick}
                          isActive={showChat}
                          notificationCount={clawNotificationCount}
                          hasNotification={clawNotificationCount > 0}
                          aria-label={showChat ? "Close 8gent chat" : `Open 8gent chat${clawNotificationCount > 0 ? `, ${clawNotificationCount} notifications` : ''}`}
                          aria-expanded={showChat}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" style={{ backgroundColor: 'hsl(var(--theme-card) / 0.95)', color: 'hsl(var(--theme-foreground))', borderColor: 'hsl(var(--theme-border))' }}>
                      {showChat ? 'Close 8gent' : clawNotificationCount > 0 ? `8gent (${clawNotificationCount})` : 'Chat with 8gent'}
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>

                {/* Projects */}
                <DockIcon ariaLabel="Projects">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/projects"
                        aria-label="Projects"
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                          "size-12 focus-visible:ring-2 focus-visible:ring-white/50"
                        )}
                      >
                        <FolderKanban className="size-4" aria-hidden="true" />
                        <span className="sr-only">Projects</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top" style={{ backgroundColor: 'hsl(var(--theme-card) / 0.95)', color: 'hsl(var(--theme-foreground))', borderColor: 'hsl(var(--theme-border))' }}>
                      Projects
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>

                {/* Product */}
                <DockIcon ariaLabel="Product">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/product"
                        aria-label="Product"
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                          "size-12 focus-visible:ring-2 focus-visible:ring-white/50"
                        )}
                      >
                        <Box className="size-4" aria-hidden="true" />
                        <span className="sr-only">Product</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top" style={{ backgroundColor: 'hsl(var(--theme-card) / 0.95)', color: 'hsl(var(--theme-foreground))', borderColor: 'hsl(var(--theme-border))' }}>
                      Product
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>

                {/* Prototyping */}
                <DockIcon ariaLabel="Prototyping">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/prototyping"
                        aria-label="Prototyping"
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                          "size-12 focus-visible:ring-2 focus-visible:ring-white/50"
                        )}
                      >
                        <Layers className="size-4" aria-hidden="true" />
                        <span className="sr-only">Prototyping</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top" style={{ backgroundColor: 'hsl(var(--theme-card) / 0.95)', color: 'hsl(var(--theme-foreground))', borderColor: 'hsl(var(--theme-border))' }}>
                      Prototyping
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>

                <DockIcon ariaLabel="Toggle theme">
                  <ModeToggle />
                </DockIcon>
              </Dock>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liquid Glass Chat Overlay */}
      <LiquidGlassChatOverlay isOpen={showChat} onClose={() => closeOverlay()} />
    </>
  );
}
