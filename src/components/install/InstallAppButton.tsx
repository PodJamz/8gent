"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallAppButtonProps {
  className?: string;
}

export function InstallAppButton({ className }: InstallAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if app is already installed
  useEffect(() => {
    // Check display-mode media query for standalone
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    // Check iOS standalone mode
    const isIOSStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true);
    }
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) {
      // For iOS, show instructions
      setIsExpanded(true);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error("Error showing install prompt:", error);
    }
  }, [deferredPrompt]);

  const handleToggle = useCallback(() => {
    if (deferredPrompt) {
      handleInstallClick();
    } else {
      setIsExpanded((prev) => !prev);
    }
  }, [deferredPrompt, handleInstallClick]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isExpanded && !target.closest("[data-install-button]")) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  // Check if this is iOS (for special instructions)
  const isIOS = typeof window !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as Window & { MSStream?: unknown }).MSStream;

  // Detect browser for appropriate instructions
  const getBrowserInfo = useCallback(() => {
    if (typeof window === "undefined") return { name: "browser", instructions: null };

    const ua = navigator.userAgent;

    // Order matters - check more specific browsers first
    if (ua.includes("Brave")) {
      return {
        name: "Brave",
        step1: "Tap the menu button",
        step1Detail: "Look for ••• at the bottom right",
        step1Icon: "dots",
        step2: "Add to Home Screen",
        step2Detail: "Tap \"Add to Home Screen\"",
      };
    }
    if (ua.includes("CriOS")) {
      return {
        name: "Chrome",
        step1: "Tap the Share button",
        step1Detail: "Look for the share icon at the top right",
        step1Icon: "share",
        step2: "Add to Home Screen",
        step2Detail: "Scroll and tap \"Add to Home Screen\"",
      };
    }
    if (ua.includes("FxiOS")) {
      return {
        name: "Firefox",
        step1: "Tap the menu button",
        step1Detail: "Look for ☰ at the bottom right",
        step1Icon: "menu",
        step2: "Share, then Add to Home Screen",
        step2Detail: "Tap Share → Add to Home Screen",
      };
    }
    if (ua.includes("EdgiOS")) {
      return {
        name: "Edge",
        step1: "Tap the menu button",
        step1Detail: "Look for ••• at the bottom",
        step1Icon: "dots",
        step2: "Add to phone",
        step2Detail: "Tap \"Add to phone\"",
      };
    }
    if (ua.includes("DuckDuckGo")) {
      return {
        name: "DuckDuckGo",
        step1: "Tap the menu button",
        step1Detail: "Look for ••• at the bottom right",
        step1Icon: "dots",
        step2: "Add to Home Screen",
        step2Detail: "Tap \"Add to Home Screen\"",
      };
    }
    if (ua.includes("OPiOS") || ua.includes("OPT/")) {
      return {
        name: "Opera",
        step1: "Tap the menu button",
        step1Detail: "Look for the Opera icon at the bottom",
        step1Icon: "menu",
        step2: "Add to Home Screen",
        step2Detail: "Tap \"Add to Home Screen\"",
      };
    }
    // Default to Safari (most common on iOS)
    return {
      name: "Safari",
      step1: "Tap the Share button",
      step1Detail: "Look for the share icon at the bottom",
      step1Icon: "share",
      step2: "Add to Home Screen",
      step2Detail: "Scroll down and tap \"Add to Home Screen\"",
    };
  }, []);

  const browserInfo = getBrowserInfo();

  // Don't show if already installed
  if (isInstalled && !showSuccess) return null;

  // Show success state briefly
  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          "fixed top-4 right-[44px] z-[9999]",
          "flex items-center justify-center w-7 h-7",
          "bg-emerald-900/90 backdrop-blur-xl",
          "border border-emerald-700/50 rounded-full",
          "shadow-lg shadow-black/20",
          className
        )}
      >
        <motion.svg
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-400"
        >
          <polyline points="20 6 9 17 4 12" />
        </motion.svg>
      </motion.div>
    );
  }

  return (
    <>
      {/* Compact Button */}
      <motion.div
        data-install-button
        onClick={handleToggle}
        onKeyDown={(e) => e.key === "Enter" && handleToggle()}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-label="Install app to home screen"
        initial={{ opacity: 0, x: 20 }}
        animate={{
          opacity: isExpanded ? 0 : 1,
          x: 0,
          scale: isExpanded ? 0.95 : 1,
          pointerEvents: isExpanded ? "none" : "auto"
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "fixed top-4 right-[44px] z-[9999]",
          "flex items-center justify-center w-7 h-7",
          "bg-neutral-900/90 backdrop-blur-xl",
          "border border-neutral-700/50 rounded-full",
          "cursor-pointer select-none",
          "transition-colors duration-300 ease-out",
          "hover:bg-neutral-800/90 hover:border-neutral-600/50",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
          "shadow-lg shadow-black/20",
          className
        )}
      >
        {/* Cloud Download Icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-400"
        >
          {/* Cloud */}
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          {/* Down arrow */}
          <path d="M12 12v9" />
          <path d="m8 17 4 4 4-4" />
        </svg>
      </motion.div>

      {/* Expanded Panel (iOS Instructions / Install Prompt) */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[2px]"
              onClick={() => setIsExpanded(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              data-install-button
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30
              }}
              className={cn(
                "fixed top-3 right-3 z-[9999]",
                "w-[280px]",
                "bg-neutral-900/95 backdrop-blur-2xl",
                "border border-neutral-700/30 rounded-3xl",
                "overflow-hidden",
                "shadow-2xl shadow-black/50"
              )}
              style={{
                background: "linear-gradient(145deg, #171717 0%, #0a0a0a 50%, #050505 100%)",
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-4 pt-4 pb-2">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                  Add to Home Screen
                </span>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-neutral-500 hover:text-neutral-300 transition-colors p-1"
                  aria-label="Close install panel"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Icon and Title */}
              <div className="text-center px-4 pb-3">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                    <path d="m8 17 4 4 4-4" />
                  </svg>
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Install James OS
                </h3>
                <p className="text-xs text-neutral-400">
                  Add to your home screen for quick access
                </p>
              </div>

              {/* Content based on platform */}
              <div className="px-4 pb-4">
                {isIOS ? (
                  /* iOS Instructions - Browser specific */
                  <div className="space-y-3">
                    {/* Browser badge */}
                    <div className="flex justify-center mb-2">
                      <span className="text-[10px] text-neutral-500 bg-neutral-800 px-2 py-1 rounded-full">
                        Detected: {browserInfo.name}
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-neutral-800/50 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-400">1</span>
                      </div>
                      <div>
                        <p className="text-sm text-white">{browserInfo.step1}</p>
                        <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                          {browserInfo.step1Icon === "share" ? (
                            <>
                              Look for{" "}
                              <svg
                                className="inline w-4 h-4 text-blue-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" y1="2" x2="12" y2="15" />
                              </svg>
                            </>
                          ) : browserInfo.step1Icon === "dots" ? (
                            <>
                              Look for{" "}
                              <svg
                                className="inline w-4 h-4 text-blue-400"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <circle cx="12" cy="5" r="2" />
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="12" cy="19" r="2" />
                              </svg>
                            </>
                          ) : (
                            <>
                              Look for{" "}
                              <svg
                                className="inline w-4 h-4 text-blue-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                              </svg>
                            </>
                          )}
                          <span className="ml-1">{browserInfo.step1Detail?.replace("Look for ", "") ?? ""}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-neutral-800/50 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-400">2</span>
                      </div>
                      <div>
                        <p className="text-sm text-white">{browserInfo.step2}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {browserInfo.step2Detail}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : deferredPrompt ? (
                  /* Android/Desktop Install Button */
                  <motion.button
                    onClick={handleInstallClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-medium text-sm shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-blue-500/50"
                  >
                    Install Now
                  </motion.button>
                ) : (
                  /* Fallback instructions */
                  <div className="space-y-3">
                    <p className="text-xs text-neutral-400 text-center">
                      Use your browser&apos;s menu to add this site to your home screen
                    </p>
                    <div className="flex items-center justify-center gap-2 p-3 bg-neutral-800/50 rounded-xl">
                      <svg
                        className="w-5 h-5 text-neutral-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                      <span className="text-sm text-neutral-300">
                        Menu → Add to Home Screen
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-neutral-800/50 px-4 py-2">
                <p className="text-[10px] text-neutral-600 text-center">
                  Fast launch • Full screen • No app store needed
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default InstallAppButton;
