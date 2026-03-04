'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy } from 'lucide-react';

export interface BrandColor {
  name: string;
  hex: string;
}

interface BrandColorSwatchProps {
  colors: BrandColor[] | Record<string, string>;
  className?: string;
  columns?: 3 | 4 | 5 | 6;
}

/**
 * A grid of brand color swatches with click-to-copy functionality.
 * Designers love this - click any swatch to copy the hex value instantly.
 */
export function BrandColorSwatch({
  colors,
  className = '',
  columns = 5
}: BrandColorSwatchProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Normalize colors to array format
  const colorArray: BrandColor[] = Array.isArray(colors)
    ? colors
    : Object.entries(colors).map(([name, hex]) => ({ name, hex }));

  const copyToClipboard = async (hex: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const gridCols = {
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    5: 'grid-cols-3 md:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-3 ${className}`}>
      {colorArray.map((color, index) => {
        const isCopied = copiedIndex === index;

        return (
          <motion.button
            key={color.name}
            onClick={() => copyToClipboard(color.hex, index)}
            className="group relative p-3 rounded-xl transition-all overflow-hidden"
            style={{ backgroundColor: color.hex }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Copy indicator overlay */}
            <AnimatePresence>
              {isCopied ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-1.5 text-white text-xs font-medium">
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors"
                >
                  <Copy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Color info */}
            <div className="relative z-10 text-white">
              <div className="text-xs font-medium capitalize drop-shadow-sm">{color.name}</div>
              <div className="text-white/80 text-[10px] font-mono uppercase drop-shadow-sm">{color.hex}</div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
