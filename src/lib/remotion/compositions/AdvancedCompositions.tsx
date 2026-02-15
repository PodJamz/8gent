/**
 * Advanced Video Compositions
 *
 * Professional-grade video templates for film directors and multimedia producers.
 * Integrates remotion-bits patterns with OpenClaw-OS infrastructure.
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Img,
  Video,
  Audio,
  Easing,
} from "remotion";
import type {
  VideoComposition,
  ParticlesLayer,
  GradientLayer,
  TextLayer,
  ImageLayer,
  VIDEO_PRESETS,
} from "../types";

// =============================================================================
// Particle System Component
// =============================================================================

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
  lifetime: number;
  age: number;
}

interface ParticleSystemProps {
  effect: "confetti" | "snow" | "dust" | "sparks" | "bubbles" | "leaves" | "stars" | "custom";
  particleCount?: number;
  color?: string | "multi";
  direction?: "up" | "down" | "left" | "right" | "random" | "explode";
  speed?: number;
  gravity?: number;
  width: number;
  height: number;
}

const PARTICLE_COLORS = {
  confetti: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f7dc6f", "#bb8fce", "#58d68d"],
  sparks: ["#ffd700", "#ff8c00", "#ff4500", "#ffff00"],
  leaves: ["#228b22", "#8b4513", "#daa520", "#cd853f", "#a0522d"],
  stars: ["#ffffff", "#ffffcc", "#ffff99", "#fffacd"],
};

function generateParticles(
  count: number,
  effect: ParticleSystemProps["effect"],
  color: string | "multi",
  width: number,
  height: number
): Particle[] {
  const particles: Particle[] = [];
  const effectColors = PARTICLE_COLORS[effect as keyof typeof PARTICLE_COLORS] || ["#ffffff"];

  for (let i = 0; i < count; i++) {
    const particleColor =
      color === "multi"
        ? effectColors[Math.floor(Math.random() * effectColors.length)]
        : color;

    particles.push({
      id: i,
      x: Math.random() * width,
      y: effect === "snow" || effect === "leaves" ? -50 : height + 50,
      vx: (Math.random() - 0.5) * 4,
      vy: effect === "snow" || effect === "leaves" ? Math.random() * 2 + 1 : -(Math.random() * 8 + 4),
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: particleColor,
      opacity: 1,
      lifetime: Math.random() * 120 + 60,
      age: Math.random() * 60,
    });
  }

  return particles;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  effect,
  particleCount = 100,
  color = "multi",
  direction = "up",
  speed = 1,
  gravity = 0.1,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const particles = React.useMemo(
    () => generateParticles(particleCount, effect, color, width, height),
    [particleCount, effect, color, width, height]
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {particles.map((particle) => {
        const age = frame + particle.age;
        const progress = Math.min(age / particle.lifetime, 1);

        // Apply physics
        let x = particle.x + particle.vx * age * speed;
        let y = particle.y + particle.vy * age * speed + 0.5 * gravity * age * age;
        const rotation = particle.rotation + particle.rotationSpeed * age;
        const opacity = interpolate(progress, [0.7, 1], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Apply direction
        if (direction === "down") {
          y = -50 + Math.abs(particle.vy) * age * speed + 0.5 * gravity * age * age;
        } else if (direction === "left") {
          x = width + 50 - Math.abs(particle.vx) * age * speed * 2;
        } else if (direction === "right") {
          x = -50 + Math.abs(particle.vx) * age * speed * 2;
        }

        // Get particle shape based on effect
        const getParticleStyle = (): React.CSSProperties => {
          const base: React.CSSProperties = {
            position: "absolute",
            left: x,
            top: y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity,
            transform: `rotate(${rotation}deg)`,
            pointerEvents: "none",
          };

          switch (effect) {
            case "confetti":
              return {
                ...base,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                width: particle.size * (Math.random() > 0.5 ? 1 : 0.4),
                height: particle.size * (Math.random() > 0.5 ? 0.4 : 1),
              };
            case "snow":
            case "bubbles":
              return { ...base, borderRadius: "50%" };
            case "dust":
              return { ...base, borderRadius: "50%", filter: "blur(1px)" };
            case "sparks":
              return {
                ...base,
                borderRadius: "50%",
                boxShadow: `0 0 ${particle.size}px ${particle.color}`,
              };
            case "stars":
              return {
                ...base,
                borderRadius: "50%",
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              };
            default:
              return base;
          }
        };

        return <div key={particle.id} style={getParticleStyle()} />;
      })}
    </AbsoluteFill>
  );
};

// =============================================================================
// Waveform Visualizer Component
// =============================================================================

interface WaveformVisualizerProps {
  style: "bars" | "line" | "circle" | "mirror" | "spectrum" | "pulse";
  color: string;
  position?: "top" | "center" | "bottom" | "full";
  barWidth?: number;
  smoothing?: number;
  sensitivity?: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  style,
  color,
  position = "bottom",
  barWidth = 4,
  smoothing = 0.8,
  sensitivity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Generate simulated audio data (in real implementation, this would come from audio analysis)
  const barCount = style === "bars" || style === "mirror" ? Math.floor(width / (barWidth + 2)) : 64;
  const bars = React.useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      // Simulate frequency response with multiple sine waves
      const baseFreq = 0.1 + i * 0.02;
      const value =
        Math.sin(frame * baseFreq) * 0.3 +
        Math.sin(frame * baseFreq * 2.1) * 0.2 +
        Math.sin(frame * baseFreq * 0.5 + i * 0.1) * 0.3 +
        Math.random() * 0.2;
      return Math.max(0, Math.min(1, (value + 1) / 2 * sensitivity));
    });
  }, [frame, barCount, sensitivity]);

  const getPositionStyle = (): React.CSSProperties => {
    switch (position) {
      case "top":
        return { top: 0, left: 0, right: 0, height: "30%" };
      case "center":
        return { top: "35%", left: 0, right: 0, height: "30%" };
      case "full":
        return { top: 0, left: 0, right: 0, bottom: 0 };
      default:
        return { bottom: 0, left: 0, right: 0, height: "30%" };
    }
  };

  if (style === "bars") {
    return (
      <AbsoluteFill style={{ ...getPositionStyle(), display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2 }}>
        {bars.map((value, i) => (
          <div
            key={i}
            style={{
              width: barWidth,
              height: `${value * 100}%`,
              backgroundColor: color,
              borderRadius: barWidth / 2,
              transition: `height ${smoothing * 100}ms ease-out`,
            }}
          />
        ))}
      </AbsoluteFill>
    );
  }

  if (style === "mirror") {
    return (
      <AbsoluteFill style={{ ...getPositionStyle(), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, transform: "scaleY(-1)" }}>
          {bars.map((value, i) => (
            <div
              key={`top-${i}`}
              style={{
                width: barWidth,
                height: `${value * 50}%`,
                backgroundColor: color,
                borderRadius: barWidth / 2,
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          {bars.map((value, i) => (
            <div
              key={`bottom-${i}`}
              style={{
                width: barWidth,
                height: `${value * 50}%`,
                backgroundColor: color,
                borderRadius: barWidth / 2,
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    );
  }

  if (style === "circle") {
    const radius = Math.min(width, height) * 0.3;
    return (
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={radius * 3} height={radius * 3} viewBox={`0 0 ${radius * 3} ${radius * 3}`}>
          {bars.map((value, i) => {
            const angle = (i / bars.length) * Math.PI * 2 - Math.PI / 2;
            const innerRadius = radius;
            const outerRadius = radius + value * radius * 0.8;
            const x1 = radius * 1.5 + Math.cos(angle) * innerRadius;
            const y1 = radius * 1.5 + Math.sin(angle) * innerRadius;
            const x2 = radius * 1.5 + Math.cos(angle) * outerRadius;
            const y2 = radius * 1.5 + Math.sin(angle) * outerRadius;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </AbsoluteFill>
    );
  }

  // Default line style
  return (
    <AbsoluteFill style={getPositionStyle()}>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <path
          d={`M 0 50 ${bars.map((v, i) => `L ${(i / bars.length) * 100}% ${50 - v * 45}%`).join(" ")} L 100% 50`}
          fill="none"
          stroke={color}
          strokeWidth={2}
        />
      </svg>
    </AbsoluteFill>
  );
};

// =============================================================================
// Animated Gradient Background
// =============================================================================

interface AnimatedGradientProps {
  colors: string[];
  type?: "linear" | "radial" | "conic";
  angle?: number;
  animate?: boolean;
  animationSpeed?: number;
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  colors,
  type = "linear",
  angle = 135,
  animate = true,
  animationSpeed = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentAngle = animate ? angle + (frame / fps) * animationSpeed : angle;

  const getGradient = () => {
    const colorStops = colors.join(", ");
    switch (type) {
      case "radial":
        return `radial-gradient(circle at ${50 + Math.sin(frame * 0.02) * 20}% ${50 + Math.cos(frame * 0.02) * 20}%, ${colorStops})`;
      case "conic":
        return `conic-gradient(from ${currentAngle}deg at 50% 50%, ${colorStops})`;
      default:
        return `linear-gradient(${currentAngle}deg, ${colorStops})`;
    }
  };

  return (
    <AbsoluteFill
      style={{
        background: getGradient(),
      }}
    />
  );
};

// =============================================================================
// Kinetic Typography Component
// =============================================================================

interface KineticTypographyProps {
  text: string;
  style: "impact" | "wave" | "cascade" | "explosion" | "bounce" | "zoom" | "rotate" | "glitch";
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  startFrame?: number;
  durationFrames?: number;
}

export const KineticTypography: React.FC<KineticTypographyProps> = ({
  text,
  style,
  fontFamily = "Inter",
  fontSize = 72,
  color = "#ffffff",
  startFrame = 0,
  durationFrames = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  const progress = Math.min(Math.max(relativeFrame / durationFrames, 0), 1);

  if (relativeFrame < 0) return null;

  const words = text.split(" ");
  const chars = text.split("");

  const getStyleForChar = (char: string, index: number) => {
    const charProgress = Math.min(
      Math.max((relativeFrame - index * 2) / (durationFrames / 2), 0),
      1
    );

    const baseStyle: React.CSSProperties = {
      display: "inline-block",
      fontFamily,
      fontSize,
      color,
      fontWeight: 700,
    };

    switch (style) {
      case "impact": {
        const scale = spring({
          frame: relativeFrame - index * 1,
          fps,
          config: { damping: 8, stiffness: 200 },
        });
        return {
          ...baseStyle,
          transform: `scale(${scale})`,
          opacity: scale,
        };
      }
      case "wave": {
        const y = Math.sin((frame * 0.1) + index * 0.5) * 20;
        return {
          ...baseStyle,
          transform: `translateY(${y}px)`,
          opacity: charProgress,
        };
      }
      case "cascade": {
        const y = interpolate(charProgress, [0, 1], [-100, 0]);
        return {
          ...baseStyle,
          transform: `translateY(${y}px)`,
          opacity: charProgress,
        };
      }
      case "explosion": {
        const angle = (index / chars.length) * Math.PI * 2;
        const distance = interpolate(charProgress, [0, 0.5, 1], [200, 200, 0]);
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        return {
          ...baseStyle,
          transform: `translate(${x}px, ${y}px)`,
          opacity: charProgress,
        };
      }
      case "bounce": {
        const bounceValue = spring({
          frame: relativeFrame - index * 3,
          fps,
          config: { damping: 5, stiffness: 150 },
        });
        return {
          ...baseStyle,
          transform: `translateY(${(1 - bounceValue) * -50}px)`,
          opacity: bounceValue,
        };
      }
      case "zoom": {
        const scale = interpolate(charProgress, [0, 0.5, 1], [3, 3, 1]);
        return {
          ...baseStyle,
          transform: `scale(${scale})`,
          opacity: interpolate(charProgress, [0, 0.3], [0, 1]),
        };
      }
      case "rotate": {
        const rotation = interpolate(charProgress, [0, 1], [180, 0]);
        return {
          ...baseStyle,
          transform: `rotateY(${rotation}deg)`,
          opacity: charProgress,
        };
      }
      case "glitch": {
        const glitchX = Math.random() * (1 - charProgress) * 10;
        const glitchY = Math.random() * (1 - charProgress) * 10;
        return {
          ...baseStyle,
          transform: `translate(${glitchX}px, ${glitchY}px)`,
          opacity: charProgress,
          textShadow: charProgress < 0.8 ? `${glitchX}px 0 #ff0000, ${-glitchX}px 0 #00ffff` : undefined,
        };
      }
      default:
        return baseStyle;
    }
  };

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {chars.map((char, index) => (
          <span key={index} style={getStyleForChar(char, index)}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// =============================================================================
// Cinematic Effects Component
// =============================================================================

interface CinematicEffectsProps {
  effect: "letterbox" | "film_grain" | "vignette" | "color_grade" | "bloom" | "chromatic_aberration" | "lens_flare";
  intensity?: number;
  colorGrade?: "cinematic" | "vintage" | "cold" | "warm" | "noir" | "cyberpunk" | "pastel";
  letterboxRatio?: "2.35:1" | "2.39:1" | "1.85:1" | "4:3";
  children?: React.ReactNode;
}

const COLOR_GRADE_FILTERS: Record<string, string> = {
  cinematic: "contrast(1.1) saturate(0.9) brightness(0.95)",
  vintage: "sepia(0.3) contrast(1.1) brightness(0.9) saturate(0.8)",
  cold: "saturate(0.9) brightness(1.05) hue-rotate(-10deg)",
  warm: "saturate(1.1) brightness(1.02) sepia(0.15)",
  noir: "grayscale(1) contrast(1.3) brightness(0.9)",
  cyberpunk: "saturate(1.4) contrast(1.2) hue-rotate(10deg)",
  pastel: "saturate(0.7) brightness(1.1) contrast(0.9)",
};

export const CinematicEffects: React.FC<CinematicEffectsProps> = ({
  effect,
  intensity = 0.5,
  colorGrade = "cinematic",
  letterboxRatio = "2.35:1",
  children,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Letterbox calculation
  const ratioMap: Record<string, number> = {
    "2.35:1": 2.35,
    "2.39:1": 2.39,
    "1.85:1": 1.85,
    "4:3": 4 / 3,
  };
  const targetRatio = ratioMap[letterboxRatio];
  const currentRatio = width / height;
  const letterboxHeight = currentRatio > targetRatio ? (height - width / targetRatio) / 2 : 0;

  switch (effect) {
    case "letterbox":
      return (
        <AbsoluteFill>
          {children}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: letterboxHeight * intensity * 2,
              backgroundColor: "#000",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: letterboxHeight * intensity * 2,
              backgroundColor: "#000",
            }}
          />
        </AbsoluteFill>
      );

    case "film_grain":
      return (
        <AbsoluteFill>
          {children}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              opacity: intensity * 0.15,
              mixBlendMode: "overlay",
              pointerEvents: "none",
            }}
          />
        </AbsoluteFill>
      );

    case "vignette":
      return (
        <AbsoluteFill>
          {children}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at center, transparent ${60 - intensity * 40}%, rgba(0,0,0,${intensity * 0.8}) 100%)`,
              pointerEvents: "none",
            }}
          />
        </AbsoluteFill>
      );

    case "color_grade":
      return (
        <AbsoluteFill style={{ filter: COLOR_GRADE_FILTERS[colorGrade] }}>
          {children}
        </AbsoluteFill>
      );

    case "bloom":
      return (
        <AbsoluteFill>
          {children}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: `blur(${intensity * 10}px) brightness(${1 + intensity * 0.2})`,
              opacity: intensity * 0.3,
              pointerEvents: "none",
            }}
          />
        </AbsoluteFill>
      );

    case "chromatic_aberration":
      return (
        <AbsoluteFill>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                filter: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='r'%3E%3CfeColorMatrix values='1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3C/svg%3E#r")`,
                transform: `translateX(${intensity * 3}px)`,
                mixBlendMode: "screen",
              }}
            >
              {children}
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                filter: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='b'%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3C/svg%3E#b")`,
                transform: `translateX(${-intensity * 3}px)`,
                mixBlendMode: "screen",
              }}
            >
              {children}
            </div>
            {children}
          </div>
        </AbsoluteFill>
      );

    case "lens_flare":
      const flareX = width * 0.7 + Math.sin(frame * 0.02) * 100;
      const flareY = height * 0.3 + Math.cos(frame * 0.02) * 50;
      return (
        <AbsoluteFill>
          {children}
          <div
            style={{
              position: "absolute",
              left: flareX,
              top: flareY,
              width: 200 * intensity,
              height: 200 * intensity,
              background: `radial-gradient(circle, rgba(255,255,255,${intensity * 0.8}) 0%, rgba(255,200,100,${intensity * 0.4}) 30%, transparent 70%)`,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              mixBlendMode: "screen",
            }}
          />
        </AbsoluteFill>
      );

    default:
      return <AbsoluteFill>{children}</AbsoluteFill>;
  }
};

// =============================================================================
// Slideshow Composition
// =============================================================================

interface SlideshowProps {
  images: string[];
  durationPerSlide?: number; // seconds
  transition?: "fade" | "slide" | "zoom" | "blur" | "wipe" | "none";
  transitionDuration?: number; // seconds
  kenBurns?: boolean;
}

export const Slideshow: React.FC<SlideshowProps> = ({
  images,
  durationPerSlide = 3,
  transition = "fade",
  transitionDuration = 0.5,
  kenBurns = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const framesPerSlide = Math.floor(durationPerSlide * fps);
  const transitionFrames = Math.floor(transitionDuration * fps);
  const currentSlideIndex = Math.floor(frame / framesPerSlide);
  const frameInSlide = frame % framesPerSlide;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {images.map((src, index) => {
        const slideStart = index * framesPerSlide;
        const slideEnd = slideStart + framesPerSlide;
        const isVisible = frame >= slideStart - transitionFrames && frame < slideEnd + transitionFrames;

        if (!isVisible) return null;

        const relativeFrame = frame - slideStart;
        const isEntering = relativeFrame < 0;
        const isExiting = relativeFrame >= framesPerSlide;

        // Calculate transition progress
        let transitionProgress = 1;
        if (isEntering) {
          transitionProgress = (relativeFrame + transitionFrames) / transitionFrames;
        } else if (isExiting) {
          transitionProgress = 1 - (relativeFrame - framesPerSlide) / transitionFrames;
        }
        transitionProgress = Math.max(0, Math.min(1, transitionProgress));

        // Ken Burns effect
        let kenBurnsScale = 1;
        let kenBurnsX = 0;
        let kenBurnsY = 0;
        if (kenBurns) {
          const slideProgress = Math.max(0, Math.min(1, relativeFrame / framesPerSlide));
          kenBurnsScale = interpolate(slideProgress, [0, 1], [1, 1.1 + (index % 2) * 0.1]);
          kenBurnsX = interpolate(slideProgress, [0, 1], [0, (index % 2 === 0 ? 1 : -1) * 20]);
          kenBurnsY = interpolate(slideProgress, [0, 1], [0, (index % 3 === 0 ? 1 : -1) * 15]);
        }

        // Transition styles
        const getTransitionStyle = (): React.CSSProperties => {
          switch (transition) {
            case "slide":
              const slideX = isEntering
                ? interpolate(transitionProgress, [0, 1], [width, 0])
                : interpolate(transitionProgress, [0, 1], [-width, 0]);
              return { transform: `translateX(${slideX}px)` };
            case "zoom":
              const scale = interpolate(transitionProgress, [0, 1], [1.5, 1]);
              return { transform: `scale(${scale})`, opacity: transitionProgress };
            case "blur":
              const blur = interpolate(transitionProgress, [0, 1], [20, 0]);
              return { filter: `blur(${blur}px)`, opacity: transitionProgress };
            case "wipe":
              return { clipPath: `inset(0 ${(1 - transitionProgress) * 100}% 0 0)` };
            case "fade":
            default:
              return { opacity: transitionProgress };
          }
        };

        return (
          <Sequence from={slideStart - transitionFrames} key={index}>
            <AbsoluteFill
              style={{
                ...getTransitionStyle(),
                overflow: "hidden",
              }}
            >
              <Img
                src={src}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: kenBurns
                    ? `scale(${kenBurnsScale}) translate(${kenBurnsX}px, ${kenBurnsY}px)`
                    : undefined,
                }}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// =============================================================================
// Export all components
// =============================================================================

// Components are already exported inline with their definitions

export type {
  ParticleSystemProps,
  WaveformVisualizerProps,
  AnimatedGradientProps,
  KineticTypographyProps,
  CinematicEffectsProps,
  SlideshowProps,
};
