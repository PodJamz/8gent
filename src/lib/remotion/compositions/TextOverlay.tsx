/**
 * Text Overlay Composition
 *
 * For adding text overlays to videos - titles, captions, watermarks, etc.
 * Perfect for song titles, credits, and annotations.
 */

import React from "react";
import {
  AbsoluteFill,
  Video,
  Audio,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

// =============================================================================
// Types
// =============================================================================

export type TextPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type TextAnimation =
  | "none"
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "typewriter"
  | "blur"
  | "glitch";

export interface TextOverlayItem {
  id: string;
  text: string;
  /** Start time in seconds */
  startTime: number;
  /** Duration in seconds (optional, defaults to end of video) */
  duration?: number;
  /** Position on screen */
  position?: TextPosition;
  /** Custom x,y position (overrides position) */
  customPosition?: { x: number | string; y: number | string };
  /** Font family */
  fontFamily?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Font weight */
  fontWeight?: number;
  /** Text color */
  color?: string;
  /** Background color (optional) */
  backgroundColor?: string;
  /** Padding around text */
  padding?: number | string;
  /** Border radius */
  borderRadius?: number;
  /** Text shadow */
  textShadow?: string;
  /** Entry animation */
  animationIn?: TextAnimation;
  /** Exit animation */
  animationOut?: TextAnimation;
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Max width for text wrapping */
  maxWidth?: number | string;
  /** Text alignment */
  textAlign?: "left" | "center" | "right";
  /** Opacity (0-1) */
  opacity?: number;
  /** Z-index for layering */
  zIndex?: number;
}

export interface TextOverlayProps {
  /** Background video source */
  videoSrc?: string;
  /** Background image source */
  imageSrc?: string;
  /** Audio source */
  audioSrc?: string;
  /** Audio volume */
  audioVolume?: number;
  /** Array of text overlays */
  overlays: TextOverlayItem[];
  /** Fallback background color */
  backgroundColor?: string;
}

// =============================================================================
// Position Utilities
// =============================================================================

const getPositionStyle = (
  position: TextPosition,
  customPosition?: { x: number | string; y: number | string }
): React.CSSProperties => {
  if (customPosition) {
    return {
      position: "absolute",
      left: typeof customPosition.x === "number" ? `${customPosition.x}px` : customPosition.x,
      top: typeof customPosition.y === "number" ? `${customPosition.y}px` : customPosition.y,
    };
  }

  const baseStyle: React.CSSProperties = {
    position: "absolute",
  };

  switch (position) {
    case "top-left":
      return { ...baseStyle, top: "5%", left: "5%" };
    case "top-center":
      return { ...baseStyle, top: "5%", left: "50%", transform: "translateX(-50%)" };
    case "top-right":
      return { ...baseStyle, top: "5%", right: "5%" };
    case "center-left":
      return { ...baseStyle, top: "50%", left: "5%", transform: "translateY(-50%)" };
    case "center":
      return { ...baseStyle, top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    case "center-right":
      return { ...baseStyle, top: "50%", right: "5%", transform: "translateY(-50%)" };
    case "bottom-left":
      return { ...baseStyle, bottom: "5%", left: "5%" };
    case "bottom-center":
      return { ...baseStyle, bottom: "5%", left: "50%", transform: "translateX(-50%)" };
    case "bottom-right":
      return { ...baseStyle, bottom: "5%", right: "5%" };
    default:
      return { ...baseStyle, bottom: "5%", left: "50%", transform: "translateX(-50%)" };
  }
};

// =============================================================================
// Animation Utilities
// =============================================================================

interface AnimationParams {
  frame: number;
  fps: number;
  startFrame: number;
  endFrame: number;
  animationFrames: number;
  animation: TextAnimation;
  isExit: boolean;
}

const getAnimationStyle = ({
  frame,
  fps,
  startFrame,
  endFrame,
  animationFrames,
  animation,
  isExit,
}: AnimationParams): React.CSSProperties => {
  const relativeFrame = isExit
    ? frame - (endFrame - animationFrames)
    : frame - startFrame;

  const progress = Math.min(Math.max(relativeFrame / animationFrames, 0), 1);
  const effectiveProgress = isExit ? 1 - progress : progress;

  switch (animation) {
    case "fade":
      return { opacity: effectiveProgress };

    case "slide-up": {
      const y = interpolate(effectiveProgress, [0, 1], [50, 0]);
      return {
        opacity: effectiveProgress,
        transform: `translateY(${isExit ? -y : y}px)`,
      };
    }

    case "slide-down": {
      const y = interpolate(effectiveProgress, [0, 1], [-50, 0]);
      return {
        opacity: effectiveProgress,
        transform: `translateY(${isExit ? -y : y}px)`,
      };
    }

    case "slide-left": {
      const x = interpolate(effectiveProgress, [0, 1], [50, 0]);
      return {
        opacity: effectiveProgress,
        transform: `translateX(${isExit ? -x : x}px)`,
      };
    }

    case "slide-right": {
      const x = interpolate(effectiveProgress, [0, 1], [-50, 0]);
      return {
        opacity: effectiveProgress,
        transform: `translateX(${isExit ? -x : x}px)`,
      };
    }

    case "scale": {
      const scale = spring({
        frame: relativeFrame,
        fps,
        config: { damping: 12, stiffness: 200 },
      });
      return {
        opacity: effectiveProgress,
        transform: `scale(${isExit ? 1 - scale * 0.5 : scale})`,
      };
    }

    case "blur": {
      const blur = interpolate(effectiveProgress, [0, 1], [10, 0]);
      return {
        opacity: effectiveProgress,
        filter: `blur(${isExit ? 10 - blur : blur}px)`,
      };
    }

    case "glitch": {
      const glitchOffset = Math.sin(frame * 0.5) * (1 - effectiveProgress) * 5;
      const hueRotate = Math.random() * (1 - effectiveProgress) * 30;
      return {
        opacity: effectiveProgress,
        transform: `translateX(${glitchOffset}px)`,
        filter: `hue-rotate(${hueRotate}deg)`,
      };
    }

    default:
      return { opacity: 1 };
  }
};

// =============================================================================
// Text Overlay Item Component
// =============================================================================

interface OverlayItemProps {
  overlay: TextOverlayItem;
  frame: number;
  fps: number;
  durationInFrames: number;
}

const OverlayItem: React.FC<OverlayItemProps> = ({
  overlay,
  frame,
  fps,
  durationInFrames,
}) => {
  const {
    text,
    startTime,
    duration,
    position = "bottom-center",
    customPosition,
    fontFamily = "Inter, sans-serif",
    fontSize = 32,
    fontWeight = 600,
    color = "#ffffff",
    backgroundColor,
    padding = "12px 24px",
    borderRadius = 8,
    textShadow = "2px 2px 4px rgba(0,0,0,0.5)",
    animationIn = "fade",
    animationOut = "fade",
    animationDuration = 0.3,
    maxWidth,
    textAlign = "center",
    opacity = 1,
    zIndex = 1,
  } = overlay;

  const startFrame = Math.floor(startTime * fps);
  const endFrame = duration
    ? Math.floor((startTime + duration) * fps)
    : durationInFrames;
  const animationFrames = Math.floor(animationDuration * fps);

  // Check if overlay is visible
  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  // Determine which animation phase we're in
  const isInEntryAnimation = frame < startFrame + animationFrames;
  const isInExitAnimation = frame > endFrame - animationFrames;

  let animationStyle: React.CSSProperties = { opacity };

  if (isInEntryAnimation && animationIn !== "none") {
    animationStyle = {
      ...animationStyle,
      ...getAnimationStyle({
        frame,
        fps,
        startFrame,
        endFrame,
        animationFrames,
        animation: animationIn,
        isExit: false,
      }),
    };
  } else if (isInExitAnimation && animationOut !== "none") {
    animationStyle = {
      ...animationStyle,
      ...getAnimationStyle({
        frame,
        fps,
        startFrame,
        endFrame,
        animationFrames,
        animation: animationOut,
        isExit: true,
      }),
    };
  }

  // Handle typewriter animation specially
  let displayText = text;
  if (animationIn === "typewriter" && isInEntryAnimation) {
    const progress = (frame - startFrame) / animationFrames;
    const visibleChars = Math.floor(text.length * progress);
    displayText = text.slice(0, visibleChars);
  }

  const positionStyle = getPositionStyle(position, customPosition);

  return (
    <div
      style={{
        ...positionStyle,
        fontFamily,
        fontSize,
        fontWeight,
        color,
        backgroundColor,
        padding,
        borderRadius,
        textShadow,
        maxWidth,
        textAlign,
        zIndex,
        whiteSpace: "pre-wrap",
        ...animationStyle,
      }}
    >
      {displayText}
    </div>
  );
};

// =============================================================================
// Main Component
// =============================================================================

export const TextOverlay: React.FC<TextOverlayProps> = ({
  videoSrc,
  imageSrc,
  audioSrc,
  audioVolume = 1,
  overlays,
  backgroundColor = "#000000",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Sort overlays by z-index
  const sortedOverlays = [...overlays].sort(
    (a, b) => (a.zIndex || 1) - (b.zIndex || 1)
  );

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Background video */}
      {videoSrc && (
        <Video
          src={videoSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* Background image */}
      {imageSrc && !videoSrc && (
        <Img
          src={imageSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* Audio track */}
      {audioSrc && <Audio src={audioSrc} volume={audioVolume} />}

      {/* Text overlays */}
      {sortedOverlays.map((overlay) => (
        <OverlayItem
          key={overlay.id}
          overlay={overlay}
          frame={frame}
          fps={fps}
          durationInFrames={durationInFrames}
        />
      ))}
    </AbsoluteFill>
  );
};

// =============================================================================
// Convenience Factories
// =============================================================================

/**
 * Create a simple title overlay
 */
export const createTitleOverlay = (
  text: string,
  options?: Partial<TextOverlayItem>
): TextOverlayItem => ({
  id: `title-${Date.now()}`,
  text,
  startTime: 0,
  duration: 3,
  position: "center",
  fontSize: 64,
  fontWeight: 700,
  animationIn: "scale",
  animationOut: "fade",
  ...options,
});

/**
 * Create a lower third overlay (like news broadcasts)
 */
export const createLowerThird = (
  text: string,
  options?: Partial<TextOverlayItem>
): TextOverlayItem => ({
  id: `lower-third-${Date.now()}`,
  text,
  startTime: 0,
  position: "bottom-left",
  fontSize: 24,
  backgroundColor: "rgba(0,0,0,0.7)",
  padding: "8px 16px",
  borderRadius: 4,
  animationIn: "slide-left",
  animationOut: "slide-left",
  ...options,
});

/**
 * Create a watermark overlay
 */
export const createWatermark = (
  text: string,
  options?: Partial<TextOverlayItem>
): TextOverlayItem => ({
  id: `watermark-${Date.now()}`,
  text,
  startTime: 0,
  position: "bottom-right",
  fontSize: 16,
  opacity: 0.5,
  animationIn: "none",
  animationOut: "none",
  ...options,
});

export default TextOverlay;
