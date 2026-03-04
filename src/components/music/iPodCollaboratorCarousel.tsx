'use client';

/**
 * iPod Collaborator Carousel
 *
 * Shows a carousel of collaborators with their avatars.
 * When a collaborator is selected, shows the passcode entry screen.
 * Replaces Clerk-based authentication with simple passcode auth.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useQuery } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import { Lock, ChevronLeft, ChevronRight, Loader2, Check, Music } from 'lucide-react';

// Type assertion for passcodes module
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const passcodesApi = (api as any).passcodes;

interface Collaborator {
  _id: string;
  slug: string;
  displayName: string;
  avatarEmoji: string;
  avatarColor: string;
  avatarImage?: string;
  isActive: boolean;
  sortOrder: number;
}

interface iPodCollaboratorCarouselProps {
  onAuthenticated: (collaboratorSlug: string) => void;
  onClose: () => void;
}

// Retro iPod color scheme
const iPodColors = {
  bg: '#8fa39a',
  dark: '#1a2420',
  mid: '#3a4a45',
  light: '#697d75',
  accent: '#a5b5ad',
};

export function IPodCollaboratorCarousel({
  onAuthenticated,
  onClose,
}: iPodCollaboratorCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch collaborators from Convex
  const collaborators = useQuery(passcodesApi?.listCollaboratorsForCarousel) as Collaborator[] | undefined;

  // Gesture tracking for carousel swipe
  const x = useMotionValue(0);
  const scale = useTransform(x, [-100, 0, 100], [0.95, 1, 0.95]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showPasscode) {
        // Handle passcode input
        if (e.key >= '0' && e.key <= '9' && passcode.length < 6) {
          setPasscode(prev => prev + e.key);
          setError(null);
        } else if (e.key === 'Backspace') {
          setPasscode(prev => prev.slice(0, -1));
          setError(null);
        } else if (e.key === 'Escape') {
          setShowPasscode(false);
          setPasscode('');
          setError(null);
        }
        return;
      }

      if (!collaborators?.length) return;

      if (e.key === 'ArrowLeft') {
        setSelectedIndex(prev => (prev - 1 + collaborators.length) % collaborators.length);
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex(prev => (prev + 1) % collaborators.length);
      } else if (e.key === 'Enter') {
        setShowPasscode(true);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [collaborators, showPasscode, passcode, onClose]);

  // Auto-submit passcode when 6 digits entered
  useEffect(() => {
    if (passcode.length === 6 && !isSubmitting) {
      handleSubmitPasscode();
    }
  }, [passcode]);

  // Handle passcode submission
  const handleSubmitPasscode = async () => {
    if (!collaborators?.length || passcode.length !== 6) return;

    setIsSubmitting(true);
    setError(null);

    const selectedCollab = collaborators[selectedIndex];

    try {
      const res = await fetch('/api/auth/ipod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collaboratorSlug: selectedCollab.slug,
          passcode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid passcode');
        setPasscode('');
        // Shake animation triggered by error
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onAuthenticated(selectedCollab.slug);
      }, 1000);
    } catch {
      setError('Connection failed');
      setPasscode('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle swipe
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!collaborators?.length) return;

    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      setSelectedIndex(prev => (prev - 1 + collaborators.length) % collaborators.length);
    } else if (info.offset.x < -swipeThreshold) {
      setSelectedIndex(prev => (prev + 1) % collaborators.length);
    }
  };

  // Handle passcode button press
  const handlePasscodePress = (digit: string) => {
    if (passcode.length < 6) {
      setPasscode(prev => prev + digit);
      setError(null);
    }
  };

  // Handle passcode delete
  const handlePasscodeDelete = () => {
    setPasscode(prev => prev.slice(0, -1));
    setError(null);
  };

  // Loading state
  if (collaborators === undefined) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: iPodColors.bg }}
      >
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: iPodColors.dark }}
        />
      </div>
    );
  }

  // No collaborators
  if (!collaborators.length) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: iPodColors.bg }}
      >
        <Lock className="w-8 h-8 mb-2" style={{ color: iPodColors.mid }} />
        <p
          className="text-xs font-mono text-center"
          style={{ color: iPodColors.dark }}
        >
          No collaborators configured
        </p>
      </div>
    );
  }

  const selectedCollab = collaborators[selectedIndex];

  // Success view
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: iPodColors.bg }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
          style={{ backgroundColor: iPodColors.dark }}
        >
          <Check className="w-8 h-8" style={{ color: iPodColors.accent }} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-mono font-bold"
          style={{ color: iPodColors.dark }}
        >
          Welcome, {selectedCollab.displayName}!
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[9px] font-mono mt-1"
          style={{ color: iPodColors.mid }}
        >
          Loading your tracks...
        </motion.p>
      </motion.div>
    );
  }

  // Passcode entry view
  if (showPasscode) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full h-full flex flex-col p-3"
        style={{ backgroundColor: iPodColors.bg }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => {
              setShowPasscode(false);
              setPasscode('');
              setError(null);
            }}
            className="text-[10px] font-mono hover:opacity-70 transition-opacity"
            style={{ color: iPodColors.mid }}
          >
            BACK
          </button>
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider"
            style={{ color: iPodColors.dark }}
          >
            Enter Passcode
          </span>
          <div className="w-8" />
        </div>

        {/* Selected collaborator */}
        <div className="flex flex-col items-center mb-4">
          <div
            className={`w-14 h-14 rounded-full bg-gradient-to-br ${selectedCollab.avatarColor} flex items-center justify-center text-3xl mb-2`}
            style={{ boxShadow: `0 4px 12px rgba(0,0,0,0.2)` }}
          >
            {selectedCollab.avatarEmoji}
          </div>
          <span
            className="text-xs font-mono font-bold"
            style={{ color: iPodColors.dark }}
          >
            {selectedCollab.displayName}
          </span>
        </div>

        {/* Passcode dots */}
        <motion.div
          className="flex justify-center gap-3 mb-4"
          animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-150`}
              style={{
                backgroundColor: i < passcode.length ? iPodColors.dark : 'transparent',
                border: `2px solid ${iPodColors.dark}`,
              }}
            />
          ))}
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mb-3 p-2 rounded-sm text-center"
              style={{ backgroundColor: '#8B0000', border: `1px solid ${iPodColors.dark}` }}
            >
              <p className="text-[9px] font-mono text-white">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-1.5 flex-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'DEL'].map((key) => (
            <button
              key={key}
              onClick={() => {
                if (key === 'DEL') {
                  handlePasscodeDelete();
                } else if (key) {
                  handlePasscodePress(key);
                }
              }}
              disabled={isSubmitting || !key}
              className={`
                rounded-sm font-mono font-bold transition-all active:scale-95
                ${key === 'DEL' ? 'text-[10px]' : 'text-lg'}
                ${!key ? 'invisible' : ''}
              `}
              style={{
                backgroundColor: key ? iPodColors.light : 'transparent',
                color: iPodColors.dark,
                border: key ? `2px solid ${iPodColors.dark}` : 'none',
                boxShadow: key ? `inset 0 -2px 0 ${iPodColors.mid}` : 'none',
              }}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Loading indicator */}
        {isSubmitting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: iPodColors.dark }} />
          </div>
        )}
      </motion.div>
    );
  }

  // Carousel view
  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col p-3"
      style={{ backgroundColor: iPodColors.bg }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onClose}
          className="text-[10px] font-mono hover:opacity-70 transition-opacity"
          style={{ color: iPodColors.mid }}
        >
          CANCEL
        </button>
        <div className="flex items-center gap-1">
          <Lock className="w-3 h-3" style={{ color: iPodColors.dark }} />
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider"
            style={{ color: iPodColors.dark }}
          >
            Select Profile
          </span>
        </div>
        <div className="w-12" />
      </div>

      {/* Carousel */}
      <motion.div
        className="flex-1 flex items-center justify-center relative"
        style={{ scale }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
      >
        {/* Navigation arrows */}
        {collaborators.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex((prev) => (prev - 1 + collaborators.length) % collaborators.length)}
              className="absolute left-0 p-2 z-10 hover:opacity-70 transition-opacity"
              style={{ color: iPodColors.dark }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSelectedIndex((prev) => (prev + 1) % collaborators.length)}
              className="absolute right-0 p-2 z-10 hover:opacity-70 transition-opacity"
              style={{ color: iPodColors.dark }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Collaborator avatars */}
        <div className="flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.button
              key={selectedCollab._id}
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -50 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={() => setShowPasscode(true)}
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${selectedCollab.avatarColor} flex items-center justify-center text-5xl cursor-pointer hover:scale-105 transition-transform`}
              style={{
                boxShadow: `0 8px 24px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)`,
              }}
            >
              {selectedCollab.avatarEmoji}
            </motion.button>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Collaborator name */}
      <div className="text-center mb-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={selectedCollab._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm font-mono font-bold"
            style={{ color: iPodColors.dark }}
          >
            {selectedCollab.displayName}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mb-2">
        {collaborators.map((_, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor: i === selectedIndex ? iPodColors.dark : iPodColors.light,
            }}
          />
        ))}
      </div>

      {/* Instructions */}
      <div
        className="text-center py-2 rounded-sm"
        style={{ backgroundColor: iPodColors.light }}
      >
        <p
          className="text-[9px] font-mono"
          style={{ color: iPodColors.dark }}
        >
          Tap avatar or press Enter to continue
        </p>
      </div>

      {/* Music icon decoration */}
      <div className="absolute bottom-3 right-3 opacity-10">
        <Music className="w-12 h-12" style={{ color: iPodColors.dark }} />
      </div>
    </div>
  );
}

export default IPodCollaboratorCarousel;
