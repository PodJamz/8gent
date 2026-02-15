'use client';

import { motion } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Type,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type TextAlignment = 'left' | 'center' | 'right';

export interface TextFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  alignment?: TextAlignment;
  color?: string;
  fontSize?: number;
}

interface FormattingToolbarProps {
  position: { x: number; y: number };
  formatting: TextFormatting;
  onFormatChange: (format: Partial<TextFormatting>) => void;
  onInsertLink?: () => void;
  onInsertList?: (type: 'bullet' | 'numbered') => void;
  className?: string;
}

export function FormattingToolbar({
  position,
  formatting,
  onFormatChange,
  onInsertLink,
  onInsertList,
  className,
}: FormattingToolbarProps) {
  const colors = [
    '#000000',
    '#EF4444',
    '#F97316',
    '#EAB308',
    '#22C55E',
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
  ];

  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={cn(
        'fixed z-[9999] flex items-center gap-0.5 p-1.5 rounded-xl',
        'bg-background/95 backdrop-blur-xl border border-border shadow-2xl',
        className
      )}
      style={{ left: position.x, top: position.y }}
    >
      {/* Text style buttons */}
      <ToolbarButton
        active={formatting.bold}
        onClick={() => onFormatChange({ bold: !formatting.bold })}
        title="Bold (⌘B)"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        active={formatting.italic}
        onClick={() => onFormatChange({ italic: !formatting.italic })}
        title="Italic (⌘I)"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        active={formatting.underline}
        onClick={() => onFormatChange({ underline: !formatting.underline })}
        title="Underline (⌘U)"
      >
        <Underline className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        active={formatting.strikethrough}
        onClick={() => onFormatChange({ strikethrough: !formatting.strikethrough })}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>

      <Divider />

      {/* Link */}
      <ToolbarButton onClick={onInsertLink} title="Insert Link (⌘K)">
        <Link className="w-4 h-4" />
      </ToolbarButton>

      {/* Lists */}
      <ToolbarButton onClick={() => onInsertList?.('bullet')} title="Bullet List">
        <List className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton onClick={() => onInsertList?.('numbered')} title="Numbered List">
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>

      <Divider />

      {/* Alignment */}
      <ToolbarButton
        active={formatting.alignment === 'left' || !formatting.alignment}
        onClick={() => onFormatChange({ alignment: 'left' })}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        active={formatting.alignment === 'center'}
        onClick={() => onFormatChange({ alignment: 'center' })}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        active={formatting.alignment === 'right'}
        onClick={() => onFormatChange({ alignment: 'right' })}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </ToolbarButton>

      <Divider />

      {/* Color picker */}
      <ColorPicker
        value={formatting.color}
        colors={colors}
        onChange={(color) => onFormatChange({ color })}
      />

      {/* Font size */}
      <FontSizePicker
        value={formatting.fontSize || 16}
        sizes={fontSizes}
        onChange={(fontSize) => onFormatChange({ fontSize })}
      />
    </motion.div>
  );
}

function ToolbarButton({
  children,
  active = false,
  onClick,
  title,
  disabled = false,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'w-8 h-8 flex items-center justify-center rounded-lg',
        'transition-all duration-100',
        'hover:bg-accent/50 active:scale-95',
        active && 'bg-accent text-accent-foreground',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-border/50 mx-1" />;
}

function ColorPicker({
  value,
  colors,
  onChange,
}: {
  value?: string;
  colors: string[];
  onChange: (color: string) => void;
}) {
  return (
    <div className="relative group">
      <button
        className={cn(
          'w-8 h-8 flex items-center justify-center rounded-lg',
          'hover:bg-accent/50 transition-colors'
        )}
      >
        <Palette className="w-4 h-4" />
      </button>

      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2 rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-2xl"
        >
          <div className="grid grid-cols-4 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onChange(color)}
                className={cn(
                  'w-6 h-6 rounded-md border-2 transition-transform hover:scale-110',
                  value === color ? 'border-primary' : 'border-transparent'
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FontSizePicker({
  value,
  sizes,
  onChange,
}: {
  value: number;
  sizes: number[];
  onChange: (size: number) => void;
}) {
  return (
    <div className="relative group">
      <button
        className={cn(
          'h-8 px-2 flex items-center gap-1 rounded-lg',
          'hover:bg-accent/50 transition-colors text-sm'
        )}
      >
        <Type className="w-3 h-3" />
        <span>{value}</span>
      </button>

      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-1.5 rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-2xl"
        >
          <div className="flex flex-col gap-0.5">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => onChange(size)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm text-left',
                  'hover:bg-accent/50 transition-colors',
                  value === size && 'bg-accent text-accent-foreground'
                )}
              >
                {size}px
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default FormattingToolbar;
