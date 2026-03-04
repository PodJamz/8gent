'use client';

/**
 * PasscodeGate - iPhone-style 6-digit passcode entry
 *
 * A liquid glass overlay with number pad for entering passcodes.
 * Used for protected areas and iPod collaborator access.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Delete } from 'lucide-react';

interface PasscodeGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (passcode: string) => Promise<boolean>;
  title?: string;
  subtitle?: string;
  error?: string;
  variant?: 'default' | 'ipod';
}

export function PasscodeGate({
  isOpen,
  onClose,
  onSubmit,
  title = 'Enter Passcode',
  subtitle,
  error: externalError,
  variant = 'default',
}: PasscodeGateProps) {
  const [passcode, setPasscode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setPasscode('');
      setError(null);
      setShake(false);
    }
  }, [isOpen]);

  // Handle number press
  const handleNumberPress = useCallback(
    (num: string) => {
      if (passcode.length >= 6 || isVerifying) return;

      const newPasscode = passcode + num;
      setPasscode(newPasscode);
      setError(null);

      // Auto-submit when 6 digits entered
      if (newPasscode.length === 6) {
        setIsVerifying(true);
        onSubmit(newPasscode).then((success) => {
          setIsVerifying(false);
          if (!success) {
            setShake(true);
            setError('Incorrect passcode');
            setTimeout(() => {
              setPasscode('');
              setShake(false);
            }, 500);
          }
        });
      }
    },
    [passcode, isVerifying, onSubmit]
  );

  // Handle delete
  const handleDelete = useCallback(() => {
    if (isVerifying) return;
    setPasscode((prev) => prev.slice(0, -1));
    setError(null);
  }, [isVerifying]);

  // Keyboard support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumberPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNumberPress, handleDelete, onClose]);

  const numberPadLayout = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'delete'],
  ];

  const displayError = externalError || error;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        >
          {/* Backdrop blur */}
          <div className="absolute inset-0 backdrop-blur-xl" onClick={onClose} />

          {/* Gate content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`relative z-10 w-full max-w-sm ${
              variant === 'ipod' ? 'rounded-3xl' : 'rounded-2xl'
            }`}
            style={{
              background:
                variant === 'ipod'
                  ? 'linear-gradient(145deg, rgba(30, 30, 30, 0.95), rgba(20, 20, 20, 0.98))'
                  : 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-white/10"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center pt-8 pb-6 px-6">
              <h2
                className="text-xl font-semibold mb-1"
                style={{ color: 'rgba(255, 255, 255, 0.95)' }}
              >
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  {subtitle}
                </p>
              )}
            </div>

            {/* Passcode dots */}
            <motion.div
              animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="flex justify-center gap-4 mb-6"
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                    isVerifying ? 'animate-pulse' : ''
                  }`}
                  style={{
                    backgroundColor:
                      i < passcode.length
                        ? 'hsl(var(--primary))'
                        : 'rgba(255, 255, 255, 0.2)',
                    boxShadow:
                      i < passcode.length
                        ? '0 0 10px hsl(var(--primary) / 0.5)'
                        : 'none',
                  }}
                />
              ))}
            </motion.div>

            {/* Error message */}
            <AnimatePresence>
              {displayError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-sm mb-4 px-6"
                  style={{ color: '#ef4444' }}
                >
                  {displayError}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Number pad */}
            <div className="px-8 pb-8">
              <div className="grid grid-cols-3 gap-4">
                {numberPadLayout.flat().map((key, index) => {
                  if (key === '') {
                    return <div key={index} />;
                  }

                  if (key === 'delete') {
                    return (
                      <button
                        key={index}
                        onClick={handleDelete}
                        disabled={isVerifying || passcode.length === 0}
                        className="h-16 rounded-full flex items-center justify-center transition-all active:scale-95 disabled:opacity-30"
                        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        <Delete className="w-6 h-6" />
                      </button>
                    );
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleNumberPress(key)}
                      disabled={isVerifying}
                      className="h-16 rounded-full flex flex-col items-center justify-center transition-all active:scale-95 hover:bg-white/10"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        color: 'rgba(255, 255, 255, 0.95)',
                      }}
                    >
                      <span className="text-2xl font-light">{key}</span>
                      <span
                        className="text-[10px] tracking-widest"
                        style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                      >
                        {getLetters(key)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// iPhone-style letter labels for number keys
function getLetters(num: string): string {
  const letters: Record<string, string> = {
    '2': 'ABC',
    '3': 'DEF',
    '4': 'GHI',
    '5': 'JKL',
    '6': 'MNO',
    '7': 'PQRS',
    '8': 'TUV',
    '9': 'WXYZ',
  };
  return letters[num] || '';
}

export default PasscodeGate;
