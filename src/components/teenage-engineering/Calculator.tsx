'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * OP-1 Style Calculator Component
 * Inspired by Teenage Engineering's iconic OP-1 synthesizer calculator mode
 * Features speaker grille, mode selectors, and tactile button grid
 */

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  // Color palette from reference images
  const colors = {
    background: '#E5E5E5',
    card: '#C8C8C8',
    display: '#2C2C2C',
    orange: '#FF5722',
    white: '#FFFFFF',
    tan: '#D4A574',
    grey: '#8E8E8E',
  };

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setNewNumber(false);
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display);

    if (previousValue !== null && operation && !newNumber) {
      // Execute previous operation
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(currentValue);
    }

    setOperation(op);
    setNewNumber(true);
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  return (
    <div
      className="relative w-full max-w-[360px] mx-auto rounded-lg overflow-hidden shadow-2xl border-2"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.display,
      }}
    >
      {/* Top Section: Speaker Grille + Mode Selectors */}
      <div className="p-4 flex items-start justify-between">
        {/* Speaker Grille (left) */}
        <div className="w-20 h-20 grid grid-cols-5 gap-1">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.display }}
            />
          ))}
        </div>

        {/* Mode Selectors (right) */}
        <div className="flex gap-2">
          <button
            className="w-8 h-8 rounded-full border-2 transition-transform active:scale-95"
            style={{
              backgroundColor: colors.tan,
              borderColor: colors.display,
            }}
            aria-label="Mode 1"
          />
          <button
            className="w-8 h-8 rounded-full border-2 transition-transform active:scale-95"
            style={{
              backgroundColor: colors.grey,
              borderColor: colors.display,
            }}
            aria-label="Mode 2"
          />
          <button
            className="w-8 h-8 rounded-full border-2 transition-transform active:scale-95"
            style={{
              backgroundColor: colors.orange,
              borderColor: colors.display,
            }}
            aria-label="Mode 3"
          />
        </div>
      </div>

      {/* Labels */}
      <div className="px-4 pb-2 flex justify-between text-[8px] font-mono tracking-widest opacity-60">
        <span style={{ color: colors.display }}>WAVEFORM</span>
        <span style={{ color: colors.display }}>STEREO</span>
        <span style={{ color: colors.display }}>FILTER FREQ</span>
      </div>

      {/* Display */}
      <div
        className="mx-4 mb-4 p-4 rounded border-2"
        style={{
          backgroundColor: colors.display,
          borderColor: colors.display,
        }}
      >
        {/* Waveform indicator */}
        <div className="mb-2 flex items-end gap-[2px] h-8">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t"
              style={{
                height: `${Math.random() * 100}%`,
                backgroundColor: colors.orange,
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        {/* Number display */}
        <div
          className="text-right text-4xl font-mono font-bold tracking-wider"
          style={{ color: colors.white }}
        >
          {display}
        </div>
      </div>

      {/* Button Grid */}
      <div className="px-4 pb-4 grid grid-cols-4 gap-2">
        {/* Row 1: Clear + Operations */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleClear}
          className="col-span-2 h-14 rounded font-mono font-bold text-lg border-2 transition-colors"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.display,
            color: colors.display,
          }}
        >
          CANCEL
        </motion.button>
        <OperatorButton onClick={() => handleOperation('÷')} label="÷" colors={colors} />
        <OperatorButton onClick={() => handleOperation('×')} label="×" colors={colors} />

        {/* Row 2: 7 8 9 - */}
        <NumberButton onClick={() => handleNumber('7')} label="7" colors={colors} />
        <NumberButton onClick={() => handleNumber('8')} label="8" colors={colors} />
        <NumberButton onClick={() => handleNumber('9')} label="9" colors={colors} />
        <OperatorButton onClick={() => handleOperation('−')} label="−" colors={colors} />

        {/* Row 3: 4 5 6 + */}
        <NumberButton onClick={() => handleNumber('4')} label="4" colors={colors} />
        <NumberButton onClick={() => handleNumber('5')} label="5" colors={colors} />
        <NumberButton onClick={() => handleNumber('6')} label="6" colors={colors} />
        <OperatorButton onClick={() => handleOperation('+')} label="+" colors={colors} />

        {/* Row 4: 1 2 3 = */}
        <NumberButton onClick={() => handleNumber('1')} label="1" colors={colors} />
        <NumberButton onClick={() => handleNumber('2')} label="2" colors={colors} />
        <NumberButton onClick={() => handleNumber('3')} label="3" colors={colors} />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleEquals}
          className="row-span-2 h-[124px] rounded font-mono font-bold text-2xl border-2"
          style={{
            backgroundColor: colors.orange,
            borderColor: colors.display,
            color: colors.white,
          }}
        >
          =
        </motion.button>

        {/* Row 5: 0 . */}
        <NumberButton onClick={() => handleNumber('0')} label="0" colors={colors} />
        <NumberButton onClick={handleDecimal} label="." colors={colors} />
        <div /> {/* Spacer for = button */}
      </div>
    </div>
  );
}

function NumberButton({
  onClick,
  label,
  colors,
}: {
  onClick: () => void;
  label: string;
  colors: Record<string, string>;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="h-14 rounded font-mono font-bold text-xl border-2 transition-colors hover:opacity-80"
      style={{
        backgroundColor: colors.white,
        borderColor: colors.display,
        color: colors.display,
      }}
    >
      {label}
    </motion.button>
  );
}

function OperatorButton({
  onClick,
  label,
  colors,
}: {
  onClick: () => void;
  label: string;
  colors: Record<string, string>;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="h-14 rounded font-mono font-bold text-xl border-2 transition-colors hover:opacity-80"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.display,
        color: colors.display,
      }}
    >
      {label}
    </motion.button>
  );
}
