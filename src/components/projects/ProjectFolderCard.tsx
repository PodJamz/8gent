'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FolderPreviewItem {
  id: string;
  title: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface ProjectFolderCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  count: number;
  previewItems: FolderPreviewItem[];
  gradient: string;
  onClick: () => void;
  shortcutKey?: string;
  isActive?: boolean;
}

const PRIORITY_COLORS: Record<string, string> = {
  low: 'hsl(var(--theme-muted-foreground))',
  medium: 'hsl(var(--theme-primary))',
  high: 'hsl(38 92% 50%)',
  urgent: 'hsl(0 84% 60%)',
};

export function ProjectFolderCard({
  title,
  description,
  icon: Icon,
  count,
  previewItems,
  gradient,
  onClick,
  shortcutKey,
  isActive,
}: ProjectFolderCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative w-full text-left rounded-2xl overflow-hidden',
        'bg-[hsl(var(--theme-card)/0.6)] backdrop-blur-xl',
        'border border-[hsl(var(--theme-border)/0.5)]',
        'hover:border-[hsl(var(--theme-primary)/0.5)]',
        'shadow-lg hover:shadow-xl',
        'transition-all duration-300',
        isActive && 'ring-2 ring-[hsl(var(--theme-primary))]'
      )}
      style={{
        background: `linear-gradient(135deg, hsl(var(--theme-card) / 0.8) 0%, hsl(var(--theme-card) / 0.4) 100%)`,
      }}
    >
      {/* Liquid Glass Reflection Effect */}
      <div
        className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${gradient} 0%, transparent 60%)`,
        }}
      />

      {/* Glass Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(var(--theme-background) / 0.3) 0%, transparent 70%)',
            transform: 'rotate(-45deg)',
          }}
        />
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
            style={{
              background: gradient,
            }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>

          <div className="flex items-center gap-2">
            {/* Count Badge */}
            <span
              className={cn(
                'px-2.5 py-1 rounded-full text-sm font-semibold',
                'bg-[hsl(var(--theme-muted))] text-[hsl(var(--theme-foreground))]'
              )}
            >
              {count}
            </span>

            {/* Keyboard Shortcut */}
            {shortcutKey && (
              <span
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold',
                  'bg-[hsl(var(--theme-muted)/0.8)] text-[hsl(var(--theme-muted-foreground))]',
                  'border border-[hsl(var(--theme-border))]',
                  'opacity-60 group-hover:opacity-100 transition-opacity'
                )}
              >
                {shortcutKey}
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3
          className="text-xl font-semibold text-[hsl(var(--theme-foreground))] mb-1"
          style={{ fontFamily: 'var(--theme-font-heading)' }}
        >
          {title}
        </h3>
        <p className="text-sm text-[hsl(var(--theme-muted-foreground))] mb-4">
          {description}
        </p>

        {/* Preview Items */}
        <div className="space-y-2">
          {previewItems.slice(0, 3).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg',
                'bg-[hsl(var(--theme-background)/0.5)]',
                'border border-[hsl(var(--theme-border)/0.3)]'
              )}
            >
              {item.priority && (
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: PRIORITY_COLORS[item.priority] }}
                />
              )}
              <span className="text-sm text-[hsl(var(--theme-foreground))] truncate">
                {item.title}
              </span>
            </motion.div>
          ))}

          {previewItems.length > 3 && (
            <div className="text-xs text-[hsl(var(--theme-muted-foreground))] text-center pt-1">
              +{previewItems.length - 3} more items
            </div>
          )}

          {previewItems.length === 0 && (
            <div className="text-sm text-[hsl(var(--theme-muted-foreground))] text-center py-4 italic">
              No items yet
            </div>
          )}
        </div>

        {/* Hover Arrow */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <svg
            className="w-5 h-5 text-[hsl(var(--theme-primary))]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.button>
  );
}
