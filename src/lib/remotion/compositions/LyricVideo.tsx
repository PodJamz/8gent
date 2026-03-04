/**
 * Lyric Video Composition
 *
 * Specialized composition for creating lyric videos with synchronized text.
 * Supports multiple styles: karaoke, subtitle, bounce, typewriter.
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import type { LyricLine, LyricWord, LyricsLayer } from "../types";

// =============================================================================
// Types
// =============================================================================

export interface LyricVideoProps {
  /** Audio source URL */
  audioSrc: string;
  /** Audio volume (0-1) */
  volume?: number;
  /** Lyric lines with timing */
  lyrics: LyricLine[];
  /** Display style */
  style?: "karaoke" | "subtitle" | "bounce" | "typewriter";
  /** Font family */
  fontFamily?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Text color */
  color?: string;
  /** Highlight color (for karaoke) */
  highlightColor?: string;
  /** Background color/gradient */
  background?: string;
  /** Position: top, center, bottom */
  position?: "top" | "center" | "bottom";
  /** Optional background video/image */
  backgroundMedia?: string;
}

// =============================================================================
// Lyric Line Components
// =============================================================================

interface LyricLineProps {
  line: LyricLine;
  style: LyricVideoProps["style"];
  fontFamily: string;
  fontSize: number;
  color: string;
  highlightColor: string;
  fps: number;
}

/**
 * Karaoke style - words highlight as they're sung
 */
const KaraokeLine: React.FC<LyricLineProps & { frame: number }> = ({
  line,
  fontFamily,
  fontSize,
  color,
  highlightColor,
  fps,
  frame,
}) => {
  const currentTime = frame / fps;

  // If no word-level timing, highlight whole line based on progress
  if (!line.words || line.words.length === 0) {
    const lineProgress =
      (currentTime - line.startTime) / (line.endTime - line.startTime);
    const clampedProgress = Math.min(Math.max(lineProgress, 0), 1);

    return (
      <div
        style={{
          fontFamily,
          fontSize,
          position: "relative",
          display: "inline-block",
        }}
      >
        <span style={{ color }}>{line.text}</span>
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            color: highlightColor,
            clipPath: `inset(0 ${100 - clampedProgress * 100}% 0 0)`,
          }}
        >
          {line.text}
        </span>
      </div>
    );
  }

  // Word-level timing
  return (
    <div style={{ fontFamily, fontSize }}>
      {line.words.map((word, i) => {
        const isActive = currentTime >= word.startTime && currentTime <= word.endTime;
        const isPast = currentTime > word.endTime;

        return (
          <span
            key={i}
            style={{
              color: isActive || isPast ? highlightColor : color,
              marginRight: "0.3em",
              transition: "color 0.1s ease",
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Subtitle style - simple fade in/out
 */
const SubtitleLine: React.FC<LyricLineProps & { frame: number }> = ({
  line,
  fontFamily,
  fontSize,
  color,
  fps,
  frame,
}) => {
  const currentTime = frame / fps;
  const duration = line.endTime - line.startTime;
  const relativeTime = currentTime - line.startTime;

  // Fade in first 0.2s, fade out last 0.2s
  const fadeInDuration = Math.min(0.2, duration / 4);
  const fadeOutDuration = Math.min(0.2, duration / 4);

  let opacity = 1;
  if (relativeTime < fadeInDuration) {
    opacity = relativeTime / fadeInDuration;
  } else if (relativeTime > duration - fadeOutDuration) {
    opacity = (duration - relativeTime) / fadeOutDuration;
  }

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        color,
        opacity: Math.max(0, Math.min(1, opacity)),
        textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
      }}
    >
      {line.text}
    </div>
  );
};

/**
 * Bounce style - lines bounce in with spring physics
 */
const BounceLine: React.FC<LyricLineProps & { frame: number }> = ({
  line,
  fontFamily,
  fontSize,
  color,
  highlightColor,
  fps,
  frame,
}) => {
  const lineStartFrame = line.startTime * fps;
  const relativeFrame = frame - lineStartFrame;

  const scale = spring({
    frame: relativeFrame,
    fps,
    config: {
      damping: 8,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const translateY = interpolate(
    spring({
      frame: relativeFrame,
      fps,
      config: { damping: 12 },
    }),
    [0, 1],
    [50, 0]
  );

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        color,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        textShadow: `0 0 20px ${highlightColor}40`,
      }}
    >
      {line.text}
    </div>
  );
};

/**
 * Typewriter style - characters appear one by one
 */
const TypewriterLine: React.FC<LyricLineProps & { frame: number }> = ({
  line,
  fontFamily,
  fontSize,
  color,
  fps,
  frame,
}) => {
  const currentTime = frame / fps;
  const duration = line.endTime - line.startTime;
  const relativeTime = currentTime - line.startTime;
  const progress = Math.min(Math.max(relativeTime / (duration * 0.8), 0), 1);

  const visibleChars = Math.floor(line.text.length * progress);
  const displayText = line.text.slice(0, visibleChars);
  const cursor = progress < 1 && frame % (fps / 2) < fps / 4 ? "▊" : "";

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        color,
      }}
    >
      {displayText}
      <span style={{ opacity: 0.8 }}>{cursor}</span>
    </div>
  );
};

// =============================================================================
// Main Lyric Video Component
// =============================================================================

export const LyricVideo: React.FC<LyricVideoProps> = ({
  audioSrc,
  volume = 1,
  lyrics,
  style = "karaoke",
  fontFamily = "Inter, sans-serif",
  fontSize = 48,
  color = "#ffffff",
  highlightColor = "#ffcc00",
  background = "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  position = "center",
  backgroundMedia,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentTime = frame / fps;

  // Find currently active line
  const activeLine = lyrics.find(
    (line) => currentTime >= line.startTime && currentTime <= line.endTime
  );

  // Position styles
  const positionStyle: React.CSSProperties = {
    top: position === "top" ? "15%" : position === "center" ? "50%" : undefined,
    bottom: position === "bottom" ? "15%" : undefined,
    transform: position === "center" ? "translateY(-50%)" : undefined,
  };

  // Render the appropriate line component
  const renderLine = (line: LyricLine) => {
    const commonProps = {
      line,
      fontFamily,
      fontSize,
      color,
      highlightColor,
      fps,
      frame,
      style,
    };

    switch (style) {
      case "karaoke":
        return <KaraokeLine {...commonProps} />;
      case "subtitle":
        return <SubtitleLine {...commonProps} />;
      case "bounce":
        return <BounceLine {...commonProps} />;
      case "typewriter":
        return <TypewriterLine {...commonProps} />;
      default:
        return <SubtitleLine {...commonProps} />;
    }
  };

  return (
    <AbsoluteFill style={{ background }}>
      {/* Background media (video or image) */}
      {backgroundMedia && (
        <AbsoluteFill>
          {backgroundMedia.match(/\.(mp4|webm|mov)$/i) ? (
            <video
              src={backgroundMedia}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              muted
              autoPlay
              loop
            />
          ) : (
            <img
              src={backgroundMedia}
              alt="Background"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
          {/* Overlay for better text readability */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Audio */}
      <Audio src={audioSrc} volume={volume} />

      {/* Lyrics container */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 10%",
          textAlign: "center",
          ...positionStyle,
        }}
      >
        {activeLine && renderLine(activeLine)}
      </div>
    </AbsoluteFill>
  );
};

// =============================================================================
// Pre-configured Templates
// =============================================================================

export const LyricVideoKaraoke: React.FC<Omit<LyricVideoProps, "style">> = (props) => (
  <LyricVideo {...props} style="karaoke" />
);

export const LyricVideoSubtitle: React.FC<Omit<LyricVideoProps, "style">> = (props) => (
  <LyricVideo {...props} style="subtitle" />
);

export const LyricVideoBounce: React.FC<Omit<LyricVideoProps, "style">> = (props) => (
  <LyricVideo {...props} style="bounce" />
);

export const LyricVideoTypewriter: React.FC<Omit<LyricVideoProps, "style">> = (props) => (
  <LyricVideo {...props} style="typewriter" />
);

export default LyricVideo;
