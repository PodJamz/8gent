'use client';

/**
 * Video Node - Remotion video composition node for the canvas
 *
 * Displays video compositions with inline preview and controls.
 * Supports lyric videos, text overlays, and custom compositions.
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Play,
  Pause,
  Settings2,
  Maximize2,
  Download,
  Music,
  Type,
  Layers,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface VideoCompositionData {
  id: string;
  name: string;
  type: 'lyric-video' | 'presentation' | 'text-overlay' | 'social-story' | 'music-visualizer' | 'slideshow' | 'custom';
  preset: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  layers: Array<{
    id: string;
    type: string;
    [key: string]: unknown;
  }>;
  audio?: { src: string; volume: number };
  backgroundColor?: string;
  backgroundGradient?: string;
}

export interface VideoNodeProps {
  composition: VideoCompositionData;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  onExpand?: () => void;
  onEdit?: () => void;
  width?: number;
  height?: number;
}

// ============================================================================
// Type Colors
// ============================================================================

const TYPE_COLORS: Record<string, string> = {
  'lyric-video': '#f59e0b', // amber
  'presentation': '#3b82f6', // blue
  'text-overlay': '#8b5cf6', // violet
  'social-story': '#ec4899', // pink
  'music-visualizer': '#10b981', // emerald
  'slideshow': '#6366f1', // indigo
  'custom': '#64748b', // slate
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  'lyric-video': <Music className="w-3.5 h-3.5" />,
  'presentation': <Layers className="w-3.5 h-3.5" />,
  'text-overlay': <Type className="w-3.5 h-3.5" />,
  'social-story': <Video className="w-3.5 h-3.5" />,
  'music-visualizer': <Music className="w-3.5 h-3.5" />,
  'slideshow': <Layers className="w-3.5 h-3.5" />,
  'custom': <Video className="w-3.5 h-3.5" />,
};

// ============================================================================
// Video Node Header
// ============================================================================

function VideoNodeHeader({
  composition,
  isPlaying,
  onPlayPause,
  onExpand,
  onEdit,
}: {
  composition: VideoCompositionData;
  isPlaying: boolean;
  onPlayPause: () => void;
  onExpand?: () => void;
  onEdit?: () => void;
}) {
  const color = TYPE_COLORS[composition.type] || TYPE_COLORS.custom;
  const icon = TYPE_ICONS[composition.type] || TYPE_ICONS.custom;
  const durationSeconds = composition.durationInFrames / composition.fps;

  return (
    <div
      className="flex items-center justify-between px-3 py-2 border-b border-white/10"
      style={{ backgroundColor: `${color}15` }}
    >
      <div className="flex items-center gap-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-xs font-medium text-white/80 truncate max-w-[150px]">
          {composition.name}
        </span>
        <span className="text-[10px] text-white/40 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {durationSeconds.toFixed(1)}s
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayPause();
          }}
          className="p-1 rounded hover:bg-white/10 transition-colors"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 text-white/60" />
          ) : (
            <Play className="w-3.5 h-3.5 text-white/60" />
          )}
        </button>
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title="Edit composition"
          >
            <Settings2 className="w-3.5 h-3.5 text-white/60" />
          </button>
        )}
        {onExpand && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title="Expand"
          >
            <Maximize2 className="w-3.5 h-3.5 text-white/60" />
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Video Preview
// ============================================================================

function VideoPreview({
  composition,
  isPlaying,
}: {
  composition: VideoCompositionData;
  isPlaying: boolean;
}) {
  const aspectRatio = composition.width / composition.height;
  const color = TYPE_COLORS[composition.type] || TYPE_COLORS.custom;

  return (
    <div
      className="relative bg-black/50 rounded overflow-hidden"
      style={{ aspectRatio }}
    >
      {/* Gradient background preview */}
      <div
        className="absolute inset-0"
        style={{
          background:
            composition.backgroundGradient ||
            composition.backgroundColor ||
            `linear-gradient(135deg, ${color}30 0%, ${color}10 100%)`,
        }}
      />

      {/* Layer previews */}
      <div className="absolute inset-0 flex items-center justify-center">
        {composition.layers.length === 0 ? (
          <div className="text-center">
            <Video className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-[10px] text-white/30">No layers yet</p>
          </div>
        ) : (
          <div className="text-center">
            {/* Layer count badge */}
            <div className="flex items-center justify-center gap-1 mb-2">
              <Layers className="w-4 h-4 text-white/40" />
              <span className="text-xs text-white/60">{composition.layers.length}</span>
            </div>

            {/* Layer type summary */}
            <div className="flex flex-wrap gap-1 justify-center px-4">
              {Array.from(
                new Set(composition.layers.map((l) => l.type))
              ).map((type) => (
                <span
                  key={type}
                  className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded text-white/50"
                >
                  {type}
                </span>
              ))}
            </div>

            {/* Audio indicator */}
            {composition.audio && (
              <div className="mt-2 flex items-center justify-center gap-1 text-white/40">
                <Music className="w-3 h-3" />
                <span className="text-[10px]">Audio</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Playing indicator */}
      {isPlaying && (
        <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-red-500/80 rounded text-[9px] text-white">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          PREVIEW
        </div>
      )}

      {/* Preset badge */}
      <div className="absolute bottom-2 right-2 text-[9px] px-1.5 py-0.5 bg-black/50 rounded text-white/60">
        {composition.preset} • {composition.fps}fps
      </div>
    </div>
  );
}

// ============================================================================
// Video Node Footer
// ============================================================================

function VideoNodeFooter({ composition }: { composition: VideoCompositionData }) {
  return (
    <div className="px-3 py-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
      <span>
        {composition.width}×{composition.height}
      </span>
      <span className="flex items-center gap-1">
        <Layers className="w-3 h-3" />
        {composition.layers.length} layer{composition.layers.length !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

// ============================================================================
// Main Video Node Component
// ============================================================================

export function VideoNode({
  composition,
  isSelected,
  onSelect,
  onDelete,
  onExpand,
  onEdit,
  width = 300,
  height,
}: VideoNodeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const color = TYPE_COLORS[composition.type] || TYPE_COLORS.custom;

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
    // In a real implementation, this would control the RemotionPlayer
  }, []);

  return (
    <motion.div
      className={cn(
        'rounded-lg overflow-hidden backdrop-blur-sm border transition-all',
        isSelected
          ? 'ring-2 ring-offset-2 ring-offset-black/50'
          : 'hover:border-white/20'
      )}
      style={{
        width,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderColor: isSelected ? color : 'rgba(255, 255, 255, 0.1)',
        // Use CSS variable for ring color
        ['--tw-ring-color' as string]: color,
      }}
      onClick={onSelect}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <VideoNodeHeader
        composition={composition}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onExpand={onExpand}
        onEdit={onEdit}
      />

      <div className="p-3">
        <VideoPreview composition={composition} isPlaying={isPlaying} />
      </div>

      <VideoNodeFooter composition={composition} />
    </motion.div>
  );
}

// ============================================================================
// Mini Video Node (for thumbnail views)
// ============================================================================

export function MiniVideoNode({
  composition,
  onClick,
}: {
  composition: VideoCompositionData;
  onClick?: () => void;
}) {
  const color = TYPE_COLORS[composition.type] || TYPE_COLORS.custom;
  const icon = TYPE_ICONS[composition.type] || TYPE_ICONS.custom;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 rounded border border-white/10',
        'bg-black/40 hover:bg-black/60 hover:border-white/20 transition-all',
        'text-left w-full'
      )}
    >
      <span style={{ color }}>{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/80 truncate">{composition.name}</p>
        <p className="text-[10px] text-white/40">
          {(composition.durationInFrames / composition.fps).toFixed(1)}s •{' '}
          {composition.layers.length} layers
        </p>
      </div>
    </button>
  );
}

export default VideoNode;
