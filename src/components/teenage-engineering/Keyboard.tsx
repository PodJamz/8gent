'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Playable Piano Keyboard Component
 * Teenage Engineering OP-1 style
 * Web Audio API for sound generation
 * Responsive to both mouse and keyboard input
 */

interface Key {
  note: string;
  frequency: number;
  isBlack: boolean;
  keyboardKey?: string;
}

const KEYS: Key[] = [
  { note: 'C4', frequency: 261.63, isBlack: false, keyboardKey: 'a' },
  { note: 'C#4', frequency: 277.18, isBlack: true, keyboardKey: 'w' },
  { note: 'D4', frequency: 293.66, isBlack: false, keyboardKey: 's' },
  { note: 'D#4', frequency: 311.13, isBlack: true, keyboardKey: 'e' },
  { note: 'E4', frequency: 329.63, isBlack: false, keyboardKey: 'd' },
  { note: 'F4', frequency: 349.23, isBlack: false, keyboardKey: 'f' },
  { note: 'F#4', frequency: 369.99, isBlack: true, keyboardKey: 't' },
  { note: 'G4', frequency: 392.00, isBlack: false, keyboardKey: 'g' },
  { note: 'G#4', frequency: 415.30, isBlack: true, keyboardKey: 'y' },
  { note: 'A4', frequency: 440.00, isBlack: false, keyboardKey: 'h' },
  { note: 'A#4', frequency: 466.16, isBlack: true, keyboardKey: 'u' },
  { note: 'B4', frequency: 493.88, isBlack: false, keyboardKey: 'j' },
  { note: 'C5', frequency: 523.25, isBlack: false, keyboardKey: 'k' },
];

export function Keyboard() {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map());

  const colors = {
    background: '#E5E5E5',
    display: '#2C2C2C',
    orange: '#FF5722',
    white: '#FFFFFF',
    card: '#C8C8C8',
  };

  // Initialize Web Audio API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = KEYS.find((k) => k.keyboardKey === e.key.toLowerCase());
      if (key) {
        playNote(key.note, key.frequency);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = KEYS.find((k) => k.keyboardKey === e.key.toLowerCase());
      if (key) {
        stopNote(key.note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const playNote = (note: string, frequency: number) => {
    if (!audioContextRef.current) return;

    // Don't create duplicate oscillators
    if (oscillatorsRef.current.has(note)) return;

    const audioContext = audioContextRef.current;

    // Create oscillator
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    // Create gain node for envelope
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01); // Attack

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start oscillator
    oscillator.start();

    // Store references
    oscillatorsRef.current.set(note, oscillator);
    gainNodesRef.current.set(note, gainNode);

    // Update active notes
    setActiveNotes((prev) => new Set(prev).add(note));
  };

  const stopNote = (note: string) => {
    if (!audioContextRef.current) return;

    const oscillator = oscillatorsRef.current.get(note);
    const gainNode = gainNodesRef.current.get(note);

    if (oscillator && gainNode) {
      const audioContext = audioContextRef.current;

      // Release envelope
      gainNode.gain.cancelScheduledValues(audioContext.currentTime);
      gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);

      // Stop oscillator after release
      oscillator.stop(audioContext.currentTime + 0.1);

      // Clean up
      oscillatorsRef.current.delete(note);
      gainNodesRef.current.delete(note);
    }

    // Update active notes
    setActiveNotes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  };

  const handleMouseDown = (note: string, frequency: number) => {
    playNote(note, frequency);
  };

  const handleMouseUp = (note: string) => {
    stopNote(note);
  };

  // Count white keys for layout
  const whiteKeys = KEYS.filter((k) => !k.isBlack);

  return (
    <div
      className="relative w-full max-w-[680px] mx-auto rounded-lg overflow-hidden shadow-xl border-2 p-6"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.display,
      }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div
            className="text-xs font-mono tracking-wider opacity-60 mb-1"
            style={{ color: colors.display }}
          >
            OP-1 KEYBOARD
          </div>
          <div
            className="text-2xl font-mono font-bold"
            style={{ color: colors.display }}
          >
            SYNTH MODE
          </div>
        </div>

        {/* Active notes indicator */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full border-2 transition-all"
              style={{
                backgroundColor: activeNotes.size > i ? colors.orange : 'transparent',
                borderColor: colors.display,
              }}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div
        className="mb-4 text-xs font-mono text-center p-2 rounded"
        style={{
          backgroundColor: colors.card,
          color: colors.display,
          opacity: 0.7,
        }}
      >
        Click keys or use keyboard: A S D F G H J K (white) • W E T Y U (black)
      </div>

      {/* Piano Keyboard */}
      <div className="relative h-48 rounded-lg overflow-hidden border-2" style={{ borderColor: colors.display }}>
        {/* White keys container */}
        <div className="absolute inset-0 flex">
          {whiteKeys.map((key, index) => {
            const isActive = activeNotes.has(key.note);
            return (
              <motion.button
                key={key.note}
                whileTap={{ scale: 0.98 }}
                onMouseDown={() => handleMouseDown(key.note, key.frequency)}
                onMouseUp={() => handleMouseUp(key.note)}
                onMouseLeave={() => handleMouseUp(key.note)}
                className="flex-1 border-r-2 flex flex-col items-center justify-end pb-4 transition-all"
                style={{
                  backgroundColor: isActive ? colors.orange : colors.white,
                  borderColor: colors.display,
                  color: isActive ? colors.white : colors.display,
                }}
              >
                <span className="text-xs font-mono font-bold opacity-60">
                  {key.keyboardKey?.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono opacity-40 mt-1">
                  {key.note}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Black keys container (overlaid) */}
        <div className="absolute inset-0 flex pointer-events-none">
          {KEYS.map((key, index) => {
            if (key.isBlack) {
              const isActive = activeNotes.has(key.note);
              // Calculate position based on surrounding white keys
              const whiteKeyWidth = 100 / whiteKeys.length;
              const whiteKeysBefore = KEYS.slice(0, index).filter((k) => !k.isBlack).length;
              const left = whiteKeysBefore * whiteKeyWidth + whiteKeyWidth * 0.65;

              return (
                <motion.button
                  key={key.note}
                  whileTap={{ scale: 0.95 }}
                  onMouseDown={() => handleMouseDown(key.note, key.frequency)}
                  onMouseUp={() => handleMouseUp(key.note)}
                  onMouseLeave={() => handleMouseUp(key.note)}
                  className="absolute top-0 h-28 w-[5%] rounded-b border-2 pointer-events-auto flex flex-col items-center justify-end pb-2 transition-all"
                  style={{
                    left: `${left}%`,
                    backgroundColor: isActive ? colors.orange : colors.display,
                    borderColor: colors.display,
                    color: isActive ? colors.display : colors.white,
                  }}
                >
                  <span className="text-[9px] font-mono font-bold opacity-80">
                    {key.keyboardKey?.toUpperCase()}
                  </span>
                </motion.button>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Waveform visualization (decorative) */}
      <div className="mt-4 flex items-center gap-[1px] h-12 opacity-40">
        {Array.from({ length: 80 }).map((_, i) => {
          const height = activeNotes.size > 0 ? Math.random() * 100 : 10;
          return (
            <div
              key={i}
              className="flex-1 rounded-t transition-all"
              style={{
                height: `${height}%`,
                backgroundColor: colors.display,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
