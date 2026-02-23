/**
 * Remotion Player Wrapper
 *
 * A reusable player component for rendering video compositions
 * in the Canvas and other parts of 8gent.
 */

"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize } from "lucide-react";
import type { VideoComposition } from "../types";
import { BaseComposition } from "../compositions/BaseComposition";
import { LyricVideo, type LyricVideoProps } from "../compositions/LyricVideo";
import { TextOverlay, type TextOverlayProps } from "../compositions/TextOverlay";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.FC<any>;

// =============================================================================
// Types
// =============================================================================

export type CompositionType = "base" | "lyric" | "text-overlay";

export interface RemotionPlayerProps {
  /** Composition type to render */
  type: CompositionType;
  /** Props for the composition (type-dependent) */
  compositionProps:
  | { composition: VideoComposition; backgroundColor?: string; backgroundGradient?: string }
  | LyricVideoProps
  | TextOverlayProps;
  /** Video dimensions */
  width?: number;
  height?: number;
  /** Frames per second */
  fps?: number;
  /** Duration in frames */
  durationInFrames?: number;
  /** Show controls */
  controls?: boolean;
  /** Autoplay */
  autoPlay?: boolean;
  /** Loop playback */
  loop?: boolean;
  /** Initial volume (0-1) */
  initialVolume?: number;
  /** Click to play/pause */
  clickToPlay?: boolean;
  /** Double click to fullscreen */
  doubleClickToFullscreen?: boolean;
  /** Render loading state */
  renderLoading?: React.ReactNode;
  /** Class name for container */
  className?: string;
  /** Style overrides */
  style?: React.CSSProperties;
  /** On play callback */
  onPlay?: () => void;
  /** On pause callback */
  onPause?: () => void;
  /** On ended callback */
  onEnded?: () => void;
  /** On frame update */
  onFrameUpdate?: (frame: number) => void;
}

// =============================================================================
// Composition Selector
// =============================================================================

const getCompositionComponent = (type: CompositionType): AnyComponent => {
  switch (type) {
    case "lyric":
      return LyricVideo as AnyComponent;
    case "text-overlay":
      return TextOverlay as AnyComponent;
    case "base":
    default:
      return BaseComposition as AnyComponent;
  }
};

// =============================================================================
// Custom Controls Component
// =============================================================================

interface ControlsProps {
  playerRef: React.RefObject<PlayerRef | null>;
  isPlaying: boolean;
  isMuted: boolean;
  currentFrame: number;
  totalFrames: number;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onSeek: (frame: number) => void;
  onRestart: () => void;
  onFullscreen: () => void;
}

const PlayerControls: React.FC<ControlsProps> = ({
  isPlaying,
  isMuted,
  currentFrame,
  totalFrames,
  onPlayPause,
  onMuteToggle,
  onSeek,
  onRestart,
  onFullscreen,
}) => {
  const progress = (currentFrame / totalFrames) * 100;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Progress bar */}
      <div
        className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percentage = x / rect.width;
          onSeek(Math.floor(percentage * totalFrames));
        }}
      >
        <div
          className="h-full bg-white rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={onPlayPause}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </button>

          {/* Volume */}
          <button
            onClick={onMuteToggle}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Time display */}
          <span className="text-white/80 text-xs font-mono">
            {Math.floor(currentFrame / 30)}s / {Math.floor(totalFrames / 30)}s
          </span>

          {/* Fullscreen */}
          <button
            onClick={onFullscreen}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Maximize className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Main Player Component
// =============================================================================

export const RemotionPlayer: React.FC<RemotionPlayerProps> = ({
  type,
  compositionProps,
  width = 1920,
  height = 1080,
  fps = 30,
  durationInFrames = 300, // 10 seconds default
  controls = true,
  autoPlay = false,
  loop = false,
  initialVolume = 1,
  clickToPlay = true,
  doubleClickToFullscreen = true,
  renderLoading,
  className = "",
  style,
  onPlay,
  onPause,
  onEnded,
  onFrameUpdate,
}) => {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showControls, setShowControls] = useState(false);

  // Get the composition component
  const CompositionComponent = getCompositionComponent(type);

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      playerRef.current.play();
      setIsPlaying(true);
      onPlay?.();
    }
  }, [isPlaying, onPlay, onPause]);

  // Handle mute toggle
  const handleMuteToggle = useCallback(() => {
    if (!playerRef.current) return;
    const newMuted = !isMuted;
    playerRef.current.setVolume(newMuted ? 0 : initialVolume);
    setIsMuted(newMuted);
  }, [isMuted, initialVolume]);

  // Handle seek
  const handleSeek = useCallback((frame: number) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(frame);
    setCurrentFrame(frame);
  }, []);

  // Handle restart
  const handleRestart = useCallback(() => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(0);
    playerRef.current.play();
    setIsPlaying(true);
    setCurrentFrame(0);
  }, []);

  // Handle fullscreen
  const handleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  // Track frame updates
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleFrame = () => {
      const frame = player.getCurrentFrame();
      setCurrentFrame(frame);
      onFrameUpdate?.(frame);
    };

    // Use requestAnimationFrame for smooth updates
    let animationId: number;
    const tick = () => {
      handleFrame();
      animationId = requestAnimationFrame(tick);
    };

    if (isPlaying) {
      animationId = requestAnimationFrame(tick);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying, onFrameUpdate]);

  // Handle click to play
  const handleClick = useCallback(() => {
    if (clickToPlay) {
      handlePlayPause();
    }
  }, [clickToPlay, handlePlayPause]);

  // Handle double click to fullscreen
  const handleDoubleClick = useCallback(() => {
    if (doubleClickToFullscreen) {
      handleFullscreen();
    }
  }, [doubleClickToFullscreen, handleFullscreen]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{
        aspectRatio: `${width}/${height}`,
        ...style,
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <Player
        ref={playerRef}
        component={CompositionComponent}
        inputProps={compositionProps as Record<string, unknown>}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={width}
        compositionHeight={height}
        style={{
          width: "100%",
          height: "100%",
        }}
        autoPlay={autoPlay}
        loop={loop}
        initiallyMuted={isMuted}
        renderLoading={() => (
          renderLoading || (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )
        )}
      />

      {/* Custom controls overlay */}
      {controls && showControls && (
        <PlayerControls
          playerRef={playerRef}
          isPlaying={isPlaying}
          isMuted={isMuted}
          currentFrame={currentFrame}
          totalFrames={durationInFrames}
          onPlayPause={handlePlayPause}
          onMuteToggle={handleMuteToggle}
          onSeek={handleSeek}
          onRestart={handleRestart}
          onFullscreen={handleFullscreen}
        />
      )}

      {/* Play button overlay when paused */}
      {!isPlaying && !showControls && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            className="p-4 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <Play className="w-8 h-8 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// Preset Player Variants
// =============================================================================

export interface QuickPlayerProps extends Omit<RemotionPlayerProps, "type" | "compositionProps"> {
  /** Video/audio source */
  src: string;
  /** Text overlays */
  overlays?: TextOverlayProps["overlays"];
}

/**
 * Quick video player with text overlay support
 */
export const QuickVideoPlayer: React.FC<QuickPlayerProps> = ({
  src,
  overlays = [],
  ...props
}) => (
  <RemotionPlayer
    type="text-overlay"
    compositionProps={{
      videoSrc: src,
      overlays,
    }}
    {...props}
  />
);

/**
 * Quick image player (slideshow style)
 */
export const QuickImagePlayer: React.FC<QuickPlayerProps> = ({
  src,
  overlays = [],
  ...props
}) => (
  <RemotionPlayer
    type="text-overlay"
    compositionProps={{
      imageSrc: src,
      overlays,
    }}
    {...props}
  />
);

export default RemotionPlayer;
