'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LockScreen } from './LockScreen';
import { Desktop } from './Desktop';
import { HomeScreenProvider } from '@/context/HomeScreenContext';
import { GALLERY_IMAGES } from '@/lib/gallery-images';

const UNLOCK_KEY = 'openclaw_unlocked';

// Preload images in the background
function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Don't block on errors
          img.src = url;
        })
    )
  );
}

function IOSHomeContent() {
  const [isLocked, setIsLocked] = useState(true);
  const [showDesktop, setShowDesktop] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [backgroundReady, setBackgroundReady] = useState(false);

  // Check sessionStorage on mount to restore unlock state
  useEffect(() => {
    const wasUnlocked = sessionStorage.getItem(UNLOCK_KEY) === 'true';
    if (wasUnlocked) {
      setIsLocked(false);
      setShowDesktop(true);
    }
    setIsHydrated(true);

    // Preload home screen backgrounds in parallel
    const imagesToPreload = [
      '/8gent-logo.png',
      ...GALLERY_IMAGES.slice(0, 3).map((img) => img.src),
    ];
    preloadImages(imagesToPreload);
  }, []);

  // Callback when 3D background is ready
  const handleBackgroundReady = useCallback(() => {
    setBackgroundReady(true);
  }, []);

  const handleUnlock = () => {
    setIsLocked(false);
    sessionStorage.setItem(UNLOCK_KEY, 'true');
    // Small delay before showing desktop for smooth transition
    setTimeout(() => {
      setShowDesktop(true);
    }, 100);
  };

  // Allow re-locking with Escape key (for demo purposes)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLocked) {
        setShowDesktop(false);
        sessionStorage.removeItem(UNLOCK_KEY);
        setTimeout(() => {
          setIsLocked(true);
          setBackgroundReady(false);
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked]);

  // Don't render until hydrated to avoid flash
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-950">
        {/* Show a dark background while hydrating - matches tunnel start */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      <AnimatePresence mode="wait">
        {isLocked && (
          <motion.div
            key="lockscreen"
            exit={{
              opacity: 0,
              scale: 1.02,
              filter: 'blur(20px)',
              y: -30,
            }}
            transition={{
              duration: 0.4,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            <LockScreen
              onUnlock={handleUnlock}
              onBackgroundReady={handleBackgroundReady}
              backgroundReady={backgroundReady}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Desktop isVisible={showDesktop} />
    </div>
  );
}

export function IOSHome() {
  return (
    <HomeScreenProvider>
      <IOSHomeContent />
    </HomeScreenProvider>
  );
}
