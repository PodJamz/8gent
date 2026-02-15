/**
 * Base Composition
 *
 * Foundation component for all Remotion video compositions.
 * Handles common rendering logic, layer management, and animations.
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import type {
  VideoComposition,
  AnyVideoLayer,
  TextLayer,
  ImageLayer,
  ShapeLayer,
  GradientLayer,
  LayerAnimation,
} from "../types";

// =============================================================================
// Animation Utilities
// =============================================================================

interface AnimationContext {
  frame: number;
  fps: number;
  durationInFrames: number;
}

/**
 * Calculate animation value based on type and progress
 */
function getAnimationValue(
  animation: LayerAnimation,
  ctx: AnimationContext
): Record<string, number | string> {
  const { frame, fps } = ctx;
  const relativeFrame = frame - animation.startFrame;
  const progress = Math.min(
    Math.max(relativeFrame / animation.durationInFrames, 0),
    1
  );

  // Get easing function
  const getEasing = () => {
    switch (animation.easing) {
      case "easeIn":
        return Easing.in(Easing.ease);
      case "easeOut":
        return Easing.out(Easing.ease);
      case "easeInOut":
        return Easing.inOut(Easing.ease);
      case "spring":
        return undefined; // Use spring instead
      default:
        return Easing.linear;
    }
  };

  const easing = getEasing();

  // Calculate value based on animation type
  switch (animation.type) {
    case "fadeIn":
      return {
        opacity: easing
          ? interpolate(progress, [0, 1], [0, 1], { easing })
          : spring({ frame: relativeFrame, fps, config: { damping: 20 } }),
      };

    case "fadeOut":
      return {
        opacity: easing
          ? interpolate(progress, [0, 1], [1, 0], { easing })
          : 1 - spring({ frame: relativeFrame, fps, config: { damping: 20 } }),
      };

    case "slideIn": {
      const distance = 100;
      const getOffset = () => {
        switch (animation.direction) {
          case "left":
            return { x: -distance, y: 0 };
          case "right":
            return { x: distance, y: 0 };
          case "up":
            return { x: 0, y: -distance };
          case "down":
          default:
            return { x: 0, y: distance };
        }
      };
      const offset = getOffset();
      const springValue =
        animation.easing === "spring"
          ? spring({ frame: relativeFrame, fps, config: { damping: 15 } })
          : interpolate(progress, [0, 1], [0, 1], { easing: easing! });

      return {
        translateX: interpolate(springValue, [0, 1], [offset.x, 0]),
        translateY: interpolate(springValue, [0, 1], [offset.y, 0]),
        opacity: interpolate(springValue, [0, 0.3], [0, 1]),
      };
    }

    case "slideOut": {
      const distance = 100;
      const getOffset = () => {
        switch (animation.direction) {
          case "left":
            return { x: -distance, y: 0 };
          case "right":
            return { x: distance, y: 0 };
          case "up":
            return { x: 0, y: -distance };
          case "down":
          default:
            return { x: 0, y: distance };
        }
      };
      const offset = getOffset();
      const value = easing
        ? interpolate(progress, [0, 1], [0, 1], { easing })
        : spring({ frame: relativeFrame, fps });

      return {
        translateX: interpolate(value, [0, 1], [0, offset.x]),
        translateY: interpolate(value, [0, 1], [0, offset.y]),
        opacity: interpolate(value, [0.7, 1], [1, 0]),
      };
    }

    case "scaleIn": {
      const value =
        animation.easing === "spring"
          ? spring({ frame: relativeFrame, fps, config: { damping: 12 } })
          : interpolate(progress, [0, 1], [0, 1], { easing: easing! });

      return {
        scale: interpolate(value, [0, 1], [0, 1]),
        opacity: interpolate(value, [0, 0.5], [0, 1]),
      };
    }

    case "scaleOut": {
      const value = easing
        ? interpolate(progress, [0, 1], [0, 1], { easing })
        : spring({ frame: relativeFrame, fps });

      return {
        scale: interpolate(value, [0, 1], [1, 0]),
        opacity: interpolate(value, [0.5, 1], [1, 0]),
      };
    }

    case "rotate": {
      const value = easing
        ? interpolate(progress, [0, 1], [0, 1], { easing })
        : spring({ frame: relativeFrame, fps });

      return {
        rotate: interpolate(value, [0, 1], [0, 360]),
      };
    }

    case "bounce": {
      const bounceValue = spring({
        frame: relativeFrame,
        fps,
        config: { damping: 8, stiffness: 200 },
      });

      return {
        scale: interpolate(bounceValue, [0, 1], [0.5, 1]),
        translateY: interpolate(
          Math.sin(bounceValue * Math.PI * 2),
          [-1, 1],
          [-10, 10]
        ),
      };
    }

    case "pulse": {
      const pulseValue = Math.sin((relativeFrame / fps) * Math.PI * 4) * 0.5 + 0.5;
      return {
        scale: interpolate(pulseValue, [0, 1], [0.95, 1.05]),
        opacity: interpolate(pulseValue, [0, 1], [0.8, 1]),
      };
    }

    case "typewriter": {
      // Return progress for text reveal
      return {
        textProgress: progress,
      };
    }

    default:
      return {};
  }
}

/**
 * Combine multiple animations into a single style object
 */
function combineAnimations(
  animations: LayerAnimation[] | undefined,
  ctx: AnimationContext
): React.CSSProperties & { textProgress?: number } {
  if (!animations || animations.length === 0) {
    return {};
  }

  const combined: Record<string, number | string> = {
    opacity: 1,
    translateX: 0,
    translateY: 0,
    scale: 1,
    rotate: 0,
  };

  for (const animation of animations) {
    // Only apply animation if we're within its time range
    if (
      ctx.frame >= animation.startFrame &&
      ctx.frame <= animation.startFrame + animation.durationInFrames
    ) {
      const values = getAnimationValue(animation, ctx);
      Object.assign(combined, values);
    }
  }

  const transform = [
    combined.translateX !== 0 || combined.translateY !== 0
      ? `translate(${combined.translateX}px, ${combined.translateY}px)`
      : "",
    combined.scale !== 1 ? `scale(${combined.scale})` : "",
    combined.rotate !== 0 ? `rotate(${combined.rotate}deg)` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    opacity: combined.opacity as number,
    transform: transform || undefined,
    textProgress: combined.textProgress as number | undefined,
  };
}

// =============================================================================
// Layer Components
// =============================================================================

interface LayerProps {
  layer: AnyVideoLayer;
  frame: number;
  fps: number;
}

const TextLayerComponent: React.FC<LayerProps> = ({ layer, frame, fps }) => {
  if (layer.type !== "text") return null;
  const textLayer = layer as TextLayer;

  const animStyle = combineAnimations(textLayer.animations, {
    frame,
    fps,
    durationInFrames: textLayer.durationInFrames,
  });

  // Handle typewriter effect
  let displayText = textLayer.content;
  if (animStyle.textProgress !== undefined) {
    const charCount = Math.floor(textLayer.content.length * animStyle.textProgress);
    displayText = textLayer.content.slice(0, charCount);
  }

  return (
    <div
      style={{
        position: "absolute",
        left: textLayer.position.x,
        top: textLayer.position.y,
        fontFamily: textLayer.fontFamily,
        fontSize: textLayer.fontSize,
        fontWeight: textLayer.fontWeight || 400,
        color: textLayer.color,
        textAlign: textLayer.textAlign || "left",
        textShadow: textLayer.textShadow,
        letterSpacing: textLayer.letterSpacing,
        lineHeight: textLayer.lineHeight,
        opacity: animStyle.opacity,
        transform: animStyle.transform,
        zIndex: textLayer.zIndex,
      }}
    >
      {displayText}
    </div>
  );
};

const ImageLayerComponent: React.FC<LayerProps> = ({ layer, frame, fps }) => {
  if (layer.type !== "image") return null;
  const imageLayer = layer as ImageLayer;

  const animStyle = combineAnimations(imageLayer.animations, {
    frame,
    fps,
    durationInFrames: imageLayer.durationInFrames,
  });

  return (
    <img
      src={imageLayer.src}
      alt={imageLayer.name}
      style={{
        position: "absolute",
        left: imageLayer.position.x,
        top: imageLayer.position.y,
        width: imageLayer.scale?.x ? `${imageLayer.scale.x * 100}%` : "auto",
        height: imageLayer.scale?.y ? `${imageLayer.scale.y * 100}%` : "auto",
        objectFit: imageLayer.objectFit || "contain",
        borderRadius: imageLayer.borderRadius,
        opacity: animStyle.opacity,
        transform: animStyle.transform,
        zIndex: imageLayer.zIndex,
      }}
    />
  );
};

const ShapeLayerComponent: React.FC<LayerProps> = ({ layer, frame, fps }) => {
  if (layer.type !== "shape") return null;
  const shapeLayer = layer as ShapeLayer;

  const animStyle = combineAnimations(shapeLayer.animations, {
    frame,
    fps,
    durationInFrames: shapeLayer.durationInFrames,
  });

  const getShapeStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      left: shapeLayer.position.x,
      top: shapeLayer.position.y,
      width: shapeLayer.width,
      height: shapeLayer.height,
      backgroundColor: shapeLayer.fill,
      border: shapeLayer.stroke ? `${shapeLayer.strokeWidth || 1}px solid ${shapeLayer.stroke}` : undefined,
      opacity: animStyle.opacity,
      transform: animStyle.transform,
      zIndex: shapeLayer.zIndex,
    };

    switch (shapeLayer.shape) {
      case "circle":
        return { ...base, borderRadius: "50%" };
      case "rectangle":
        return { ...base, borderRadius: shapeLayer.borderRadius || 0 };
      case "triangle":
        return {
          ...base,
          backgroundColor: "transparent",
          width: 0,
          height: 0,
          borderLeft: `${shapeLayer.width / 2}px solid transparent`,
          borderRight: `${shapeLayer.width / 2}px solid transparent`,
          borderBottom: `${shapeLayer.height}px solid ${shapeLayer.fill}`,
        };
      default:
        return base;
    }
  };

  return <div style={getShapeStyle()} />;
};

const GradientLayerComponent: React.FC<LayerProps> = ({ layer, frame, fps }) => {
  if (layer.type !== "gradient") return null;
  const gradientLayer = layer as GradientLayer;

  const animStyle = combineAnimations(gradientLayer.animations, {
    frame,
    fps,
    durationInFrames: gradientLayer.durationInFrames,
  });

  const angle = gradientLayer.animate
    ? (gradientLayer.angle || 0) + (frame / fps) * 30 // Rotate 30 degrees per second
    : gradientLayer.angle || 0;

  const gradientType = gradientLayer.type_gradient || "linear";
  const background =
    gradientType === "linear"
      ? `linear-gradient(${angle}deg, ${gradientLayer.colors.join(", ")})`
      : `radial-gradient(circle, ${gradientLayer.colors.join(", ")})`;

  return (
    <div
      style={{
        position: "absolute",
        left: gradientLayer.position.x,
        top: gradientLayer.position.y,
        width: "100%",
        height: "100%",
        background,
        opacity: animStyle.opacity,
        transform: animStyle.transform,
        zIndex: gradientLayer.zIndex,
      }}
    />
  );
};

// =============================================================================
// Video Layer Renderer
// =============================================================================

const VideoLayerRenderer: React.FC<LayerProps> = (props) => {
  const { layer } = props;

  // Check if layer is visible at current frame
  const isVisible =
    props.frame >= layer.startFrame &&
    props.frame < layer.startFrame + layer.durationInFrames;

  if (!isVisible) return null;

  switch (layer.type) {
    case "text":
      return <TextLayerComponent {...props} />;
    case "image":
      return <ImageLayerComponent {...props} />;
    case "shape":
      return <ShapeLayerComponent {...props} />;
    case "gradient":
      return <GradientLayerComponent {...props} />;
    // Add more layer types as needed
    default:
      return null;
  }
};

// =============================================================================
// Base Composition Component
// =============================================================================

export interface BaseCompositionProps {
  composition: VideoComposition;
  /** Optional background color */
  backgroundColor?: string;
  /** Optional background gradient */
  backgroundGradient?: string;
}

export const BaseComposition: React.FC<BaseCompositionProps> = ({
  composition,
  backgroundColor = "#000000",
  backgroundGradient,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sort layers by zIndex
  const sortedLayers = [...composition.layers].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        background: backgroundGradient || backgroundColor,
      }}
    >
      {sortedLayers.map((layer) => (
        <VideoLayerRenderer
          key={layer.id}
          layer={layer}
          frame={frame}
          fps={fps}
        />
      ))}
    </AbsoluteFill>
  );
};

export default BaseComposition;
