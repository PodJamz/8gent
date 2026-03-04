'use client';

/**
 * EasterEgg - A subtle, meaningful human touch
 *
 * Signals taste and authorship.
 * Non-gimmicky, discovered by the curious.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EasterEggProps {
  children: React.ReactNode;
}

/**
 * Konami Code Easter Egg
 *
 * Activates when user enters: ↑ ↑ ↓ ↓ ← → ← → B A
 */
const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
];

export function KonamiEasterEgg({ children }: EasterEggProps) {
  const [activated, setActivated] = useState(false);
  const [inputSequence, setInputSequence] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...inputSequence, e.code].slice(-KONAMI_CODE.length);
      setInputSequence(newSequence);

      if (newSequence.join(',') === KONAMI_CODE.join(',')) {
        setActivated(true);
        setInputSequence([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputSequence]);

  return (
    <>
      {children}
      <AnimatePresence>
        {activated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
            onClick={() => setActivated(false)}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="max-w-md text-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                }}
                className="text-6xl mb-6"
              >
                🧙‍♂️
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-4">
                You found the secret!
              </h2>

              <p className="text-neutral-400 mb-6">
                "The best interface is the one that becomes invisible,
                letting you focus on what matters most: shipping."
              </p>

              <p className="text-sm text-neutral-500 italic">
                - James, while debugging at 3am
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 text-xs text-neutral-600"
              >
                Click anywhere to close
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Logo Click Easter Egg
 *
 * After clicking 7 times on the logo, shows a message
 */
export function ClickCountEasterEgg({
  targetClicks = 7,
  children,
  message,
}: {
  targetClicks?: number;
  children: React.ReactNode;
  message?: string;
}) {
  const [clicks, setClicks] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks >= targetClicks) {
      setShowMessage(true);
      setClicks(0);

      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  return (
    <>
      <div onClick={handleClick}>{children}</div>
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-neutral-900 text-white text-sm shadow-lg"
          >
            {message || "✨ You're persistent. I like that."}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Developer Mode Secret
 *
 * Shows developer info when Ctrl+Shift+D is pressed
 */
export function DeveloperModeEasterEgg() {
  const [showDevInfo, setShowDevInfo] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
        e.preventDefault();
        setShowDevInfo((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {showDevInfo && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed top-4 right-4 z-50 p-4 rounded-xl bg-neutral-900 border border-neutral-800 shadow-xl"
          style={{ maxWidth: '300px' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-green-400">DEV MODE</span>
          </div>

          <div className="space-y-2 text-xs text-neutral-400 font-mono">
            <div className="flex justify-between">
              <span>Version:</span>
              <span className="text-white">1.0.0-alpha</span>
            </div>
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="text-white">{process.env.NODE_ENV}</span>
            </div>
            <div className="flex justify-between">
              <span>Built with:</span>
              <span className="text-white">Next.js + Claude</span>
            </div>
          </div>

          <button
            onClick={() => setShowDevInfo(false)}
            className="mt-4 w-full py-1.5 text-xs rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            Close (Ctrl+Shift+D)
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
