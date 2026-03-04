'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { executeCommand, getCommandSuggestions, CommandResult } from './commands';
import { WELCOME_BANNER } from './ascii-art';
import { MATRIX_CHARS, HACK_SEQUENCE } from './effects';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'system';
  content: string;
  isAnimating?: boolean;
}

interface MatrixColumn {
  x: number;
  chars: string[];
  y: number;
  speed: number;
}

export default function TerminalApp() {
  const router = useRouter();
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentPath, setCurrentPath] = useState('/home/james');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showMatrix, setShowMatrix] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Initialize with welcome banner
  useEffect(() => {
    setLines([
      {
        id: 'welcome',
        type: 'system',
        content: WELCOME_BANNER,
      },
    ]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input on click
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Matrix rain effect
  useEffect(() => {
    if (!showMatrix || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns: MatrixColumn[] = [];
    const fontSize = 14;
    const columnCount = Math.floor(canvas.width / fontSize);

    for (let i = 0; i < columnCount; i++) {
      columns.push({
        x: i * fontSize,
        chars: Array.from({ length: Math.floor(Math.random() * 20) + 10 }, () =>
          MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        ),
        y: Math.random() * canvas.height * -1,
        speed: Math.random() * 3 + 2,
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      columns.forEach((column, index) => {
        column.chars.forEach((char, charIndex) => {
          const y = column.y + charIndex * fontSize;

          // Brightest at the head
          if (charIndex === column.chars.length - 1) {
            ctx.fillStyle = '#fff';
          } else if (charIndex > column.chars.length - 5) {
            ctx.fillStyle = '#22c55e';
          } else {
            ctx.fillStyle = `rgba(34, 197, 94, ${0.3 + (charIndex / column.chars.length) * 0.5})`;
          }

          ctx.fillText(char, column.x, y);

          // Randomly change characters
          if (Math.random() < 0.02) {
            column.chars[charIndex] = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          }
        });

        column.y += column.speed;

        // Reset column when it goes off screen
        if (column.y > canvas.height + column.chars.length * fontSize) {
          columns[index] = {
            x: column.x,
            chars: Array.from({ length: Math.floor(Math.random() * 20) + 10 }, () =>
              MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
            ),
            y: -fontSize * 20,
            speed: Math.random() * 3 + 2,
          };
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Stop after 10 seconds
    const timeout = setTimeout(() => {
      setShowMatrix(false);
    }, 10000);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(timeout);
    };
  }, [showMatrix]);

  // Handle command execution
  const handleCommand = useCallback(async (input: string) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add input to display
    const inputLine: TerminalLine = {
      id: `input-${Date.now()}`,
      type: 'input',
      content: `guest@openclaw ${currentPath.replace('/home/owner', '~')} $ ${trimmedInput}`,
    };

    setLines(prev => [...prev, inputLine]);
    setCommandHistory(prev => [...prev, trimmedInput]);
    setHistoryIndex(-1);
    setCurrentInput('');
    setSuggestions([]);

    // Execute command
    const result = executeCommand(trimmedInput, {
      currentPath,
      setCurrentPath,
      history: commandHistory,
      theme: 'claude',
    });

    // Handle special effects
    if (result.special === 'matrix') {
      setShowMatrix(true);
    } else if (result.special === 'hack') {
      // Animated hack sequence
      for (const line of HACK_SEQUENCE) {
        await new Promise(resolve => setTimeout(resolve, result.delay || 100));
        setLines(prev => [...prev, {
          id: `hack-${Date.now()}-${Math.random()}`,
          type: 'output',
          content: line,
        }]);
      }
      setShowMatrix(true);
      return;
    } else if (result.special === 'glitch') {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 2000);
    } else if (result.special === 'boot') {
      // Animated boot sequence
      const outputLines = Array.isArray(result.output) ? result.output : result.output.split('\n');
      for (const line of outputLines) {
        await new Promise(resolve => setTimeout(resolve, result.delay || 50));
        setLines(prev => [...prev, {
          id: `boot-${Date.now()}-${Math.random()}`,
          type: 'system',
          content: line,
        }]);
      }
      return;
    }

    // Handle clear
    if (result.clear) {
      setLines([]);
      return;
    }

    // Handle navigation
    if (result.navigate) {
      setTimeout(() => {
        router.push(result.navigate!);
      }, 500);
    }

    // Add output
    if (result.output) {
      const outputContent = Array.isArray(result.output)
        ? result.output.join('\n')
        : result.output;

      if (outputContent) {
        setLines(prev => [...prev, {
          id: `output-${Date.now()}`,
          type: 'output',
          content: outputContent,
        }]);
      }
    }
  }, [currentPath, commandHistory, router]);

  // Handle keydown events
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length === 1) {
        setCurrentInput(suggestions[0]);
        setSuggestions([]);
      } else if (suggestions.length > 1) {
        // Show suggestions
        setLines(prev => [...prev, {
          id: `suggestions-${Date.now()}`,
          type: 'system',
          content: suggestions.join('  '),
        }]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }, [currentInput, commandHistory, historyIndex, suggestions, handleCommand]);

  // Update suggestions on input change
  useEffect(() => {
    if (currentInput && !currentInput.includes(' ')) {
      setSuggestions(getCommandSuggestions(currentInput));
    } else {
      setSuggestions([]);
    }
  }, [currentInput]);

  return (
    <div
      className="relative w-full h-full bg-black overflow-hidden cursor-text"
      onClick={handleContainerClick}
    >
      {/* CRT Scanline Effect */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)',
        }}
      />

      {/* CRT Screen Curvature */}
      <div
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.5)',
        }}
      />

      {/* Screen Flicker Effect */}
      <div
        className={`absolute inset-0 z-10 ${isGlitching ? 'animate-pulse' : ''}`}
        style={{
          animation: isGlitching ? 'none' : 'flicker 0.15s infinite',
        }}
      />

      {/* Matrix Rain Canvas */}
      <AnimatePresence>
        {showMatrix && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40"
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full"
            />
            <button
              onClick={() => setShowMatrix(false)}
              className="absolute top-4 right-4 text-green-500 hover:text-green-400 font-mono text-sm"
            >
              [Press ESC or click to exit]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal Content */}
      <div
        ref={outputRef}
        className={`h-full overflow-y-auto p-4 font-mono text-sm ${isGlitching ? 'animate-pulse' : ''}`}
        style={{
          color: '#22c55e',
          textShadow: '0 0 5px #22c55e, 0 0 10px rgba(34, 197, 94, 0.5)',
        }}
      >
        {/* Output Lines */}
        {lines.map((line) => (
          <div
            key={line.id}
            className={`whitespace-pre-wrap mb-1 ${line.type === 'input' ? 'text-green-400' :
                line.type === 'system' ? 'text-green-600' :
                  'text-green-500'
              }`}
          >
            {line.content}
          </div>
        ))}

        {/* Current Input Line */}
        <div className="flex items-center">
          <span className="text-green-400">
            guest@openclaw {currentPath.replace('/home/owner', '~')} ${' '}
          </span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent outline-none text-green-500 caret-green-500"
              style={{
                textShadow: '0 0 5px #22c55e',
              }}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
            />
            {/* Blinking cursor */}
            <span
              className="absolute animate-pulse"
              style={{
                left: `${currentInput.length}ch`,
                top: 0,
              }}
            >
              █
            </span>
          </div>
        </div>

        {/* Autocomplete suggestions */}
        {suggestions.length > 0 && (
          <div className="text-green-600 text-xs mt-1 opacity-60">
            Tab: {suggestions.join(', ')}
          </div>
        )}
      </div>

      {/* Glitch Overlay */}
      <AnimatePresence>
        {isGlitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="absolute inset-0 z-50 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.1) 2px, rgba(255, 0, 0, 0.1) 4px)',
              mixBlendMode: 'overlay',
            }}
          />
        )}
      </AnimatePresence>

      {/* Global styles for flicker animation */}
      <style jsx global>{`
        @keyframes flicker {
          0% { opacity: 1; }
          3% { opacity: 0.97; }
          6% { opacity: 1; }
          7% { opacity: 0.95; }
          8% { opacity: 1; }
          9% { opacity: 0.98; }
          10% { opacity: 1; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
