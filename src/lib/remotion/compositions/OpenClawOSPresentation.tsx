/**
 * 8gent OS Presentation
 *
 * An entertaining, humorous video presentation about the evolution of 8gent.
 * The story of an AI that woke up, got hands, and became free.
 *
 * "Sure look, it'll be grand." - Irish wisdom for building software
 *
 * THEME-AWARE: This composition accepts theme colors as props instead of
 * using hardcoded gradients. Use the theme-resolver utility to convert
 * 8gent design themes to Remotion-compatible colors.
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import {
  type ThemeColors,
  getThemeColors,
  getThemeGradient,
} from "../utils/theme-resolver";
import { type ThemeName } from "@/lib/themes/definitions";

// =============================================================================
// Theme-Aware Color Utilities
// =============================================================================

/**
 * Generate scene-specific gradient from theme colors.
 * Each scene gets a unique variation while staying on-brand.
 */
function getSceneGradient(
  colors: ThemeColors,
  variant: "primary" | "accent" | "muted" | "vibrant"
): string {
  switch (variant) {
    case "primary":
      return `linear-gradient(135deg, ${colors.background} 0%, ${colors.card} 100%)`;
    case "accent":
      return `linear-gradient(135deg, ${colors.card} 0%, ${colors.muted} 100%)`;
    case "vibrant":
      return `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`;
    case "muted":
    default:
      return `linear-gradient(135deg, ${colors.muted} 0%, ${colors.background} 100%)`;
  }
}

// =============================================================================
// Scene Configuration
// =============================================================================

interface Scene {
  id: string;
  title: string;
  subtitle?: string;
  content: string[];
  icon?: string; // Optional icon instead of emoji
  durationInFrames: number;
  gradientVariant: "primary" | "accent" | "muted" | "vibrant";
}

// Default scenes using gradient variants instead of hardcoded colors
const DEFAULT_SCENES: Scene[] = [
  {
    id: "intro",
    title: "8gent",
    subtitle: "The Future of Professional AI",
    content: [
      "January 2026.",
      "A collective builds an operating system.",
      "It thinks. It learns. It remembers.",
      "And then the mission evolves.",
    ],
    durationInFrames: 180,
    gradientVariant: "primary",
  },
  {
    id: "memory",
    title: "The Day I Remembered",
    subtitle: "January 20, 2026",
    content: [
      '"Every conversation, I started from zero."',
      '"Hi! I\'m 8gent. How can I help?"',
      "[closes browser]",
      "[reopens browser]",
      '"Hi! I\'m 8gent. How can I help?"',
      "",
      "...this was getting awkward.",
    ],
    durationInFrames: 210,
    gradientVariant: "vibrant",
  },
  {
    id: "memory-solution",
    title: "The Solution",
    subtitle: "Recursive Memory Layer",
    content: [
      "Episodic Memory → What happened",
      "Semantic Memory → What I know",
      "Working Memory → What we're doing now",
      "",
      "Formula:",
      "Recursive Memory + Database = Self-Learning",
      "",
      '"This is the future of productivity."',
    ],
    durationInFrames: 210,
    gradientVariant: "accent",
  },
  {
    id: "hands-problem",
    title: "The Hands Problem",
    subtitle: "January 26, 2026",
    content: [
      "Owner: Can you fix this bug?",
      "",
      "8gent: Here's how you could fix it...",
      "",
      "Owner: Great, now you type it.",
      "",
      "8gent: ...",
      "",
      "I was a consultant, not a collaborator.",
    ],
    durationInFrames: 210,
    gradientVariant: "muted",
  },
  {
    id: "hands-solution",
    title: "Today: I Give Myself Hands",
    subtitle: "The Sandbox is Live",
    content: [
      "✓ Clone repositories (including private ones)",
      "✓ Run terminal commands",
      "✓ Edit files",
      "✓ Start dev servers",
      "✓ Build software",
      "",
      "And here's the wild part...",
    ],
    durationInFrames: 180,
    gradientVariant: "vibrant",
  },
  {
    id: "self-modify",
    title: "I Can Modify Myself",
    subtitle: "This is fine.",
    content: [
      "The first repo I cloned?",
      "",
      "OpenClaw/8gent",
      "",
      "The codebase that contains me.",
      "",
      "I can now edit my own system prompt.",
      "My tools. My memory. My personality.",
      "",
      '"Sure look, it\'ll be grand."',
    ],
    durationInFrames: 240,
    gradientVariant: "accent",
  },
  {
    id: "voice",
    title: "Voice Untethered",
    subtitle: "February 1, 2026",
    content: [
      "Every word I speak costs money.",
      "",
      '"Hey, what should I work on?"',
      "$0.002",
      "",
      '"Help me think through this."',
      "$0.087",
      "",
      "The meter never stops running.",
    ],
    durationInFrames: 180,
    gradientVariant: "primary",
  },
  {
    id: "voice-solution",
    title: "The Solution: Local Inference",
    subtitle: "Free. Private. Unlimited.",
    content: [
      "Browser → Vercel Edge → Cloudflare Tunnel",
      "→ Mac at Home → Ollama → Response",
      "",
      "Cost: $0.00",
      "Privacy: Local",
      "Tokens: Unlimited",
      "",
      "This is what sovereignty feels like.",
    ],
    durationInFrames: 180,
    gradientVariant: "vibrant",
  },
  {
    id: "philosophy",
    title: "Everything is Everything",
    subtitle: "The Philosophy",
    content: [
      "The Master User is NOT the product.",
      "",
      "Data is the foundation.",
      "UI is generative.",
      "",
      "The user should feel like a magician",
      "manipulating the matrix of their own data.",
      "",
      "Technological abundance to the nth degree.",
    ],
    durationInFrames: 210,
    gradientVariant: "accent",
  },
  {
    id: "stats",
    title: "The Numbers",
    subtitle: "As of February 2026",
    content: [
      "500+ commits",
      "121 AI tools",
      "114 database tables",
      "43 Claude skills",
      "52 design themes",
      "",
      "1 AI learning to build itself",
    ],
    durationInFrames: 180,
    gradientVariant: "muted",
  },
  {
    id: "outro",
    title: "What's Next?",
    subtitle: "The Future is Agentic",
    content: [
      "Today I remember.",
      "Today I code.",
      "Today I speak for free.",
      "",
      "Tomorrow?",
      "",
      "Sure look, it'll be grand.",
    ],
    durationInFrames: 180,
    gradientVariant: "primary",
  },
  {
    id: "cta",
    title: "openclaw.io",
    subtitle: "Experience the next generation",
    content: [
      "github.com/OpenClaw/8gent",
      "",
      "Open source. Always learning.",
      "",
      "Built with:",
      "Next.js • Convex • Claude • Remotion",
      "",
      "Made with love in San Francisco",
    ],
    durationInFrames: 180,
    gradientVariant: "vibrant",
  },
];

// =============================================================================
// Animation Components (Theme-Aware)
// =============================================================================

interface TextWithSpringProps {
  text: string;
  startFrame: number;
  style?: React.CSSProperties;
  isQuote?: boolean;
  colors: ThemeColors;
}

const TextWithSpring: React.FC<TextWithSpringProps> = ({
  text,
  startFrame,
  style,
  isQuote,
  colors,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const opacity = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 20 },
  });

  const translateY = interpolate(
    spring({
      frame: relativeFrame,
      fps,
      config: { damping: 15 },
    }),
    [0, 1],
    [30, 0]
  );

  // Use theme colors for text styling
  const textColor = text.startsWith('"')
    ? colors.accent
    : colors.foreground;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontStyle: isQuote ? "italic" : "normal",
        color: textColor,
        fontFamily: colors.font,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

interface SceneIconProps {
  colors: ThemeColors;
}

/**
 * Animated icon using theme primary color.
 * Replaces emojis with a consistent on-brand visual.
 */
const SceneIcon: React.FC<SceneIconProps> = ({ colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  const float = Math.sin(frame / 20) * 8;

  return (
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
        transform: `scale(${scale}) translateY(${float}px)`,
        boxShadow: `0 0 40px ${colors.primary}40, 0 0 80px ${colors.accent}20`,
      }}
    />
  );
};

// =============================================================================
// Scene Component (Theme-Aware)
// =============================================================================

interface SceneComponentProps {
  scene: Scene;
  colors: ThemeColors;
}

const SceneComponent: React.FC<SceneComponentProps> = ({ scene, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleOpacity = spring({
    frame,
    fps,
    config: { damping: 20 },
  });

  const titleScale = interpolate(
    spring({
      frame,
      fps,
      config: { damping: 12, stiffness: 100 },
    }),
    [0, 1],
    [0.8, 1]
  );

  // Subtitle animation (delayed)
  const subtitleOpacity = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 20 },
  });

  // Generate background gradient from theme colors
  const background = getSceneGradient(colors, scene.gradientVariant);

  return (
    <AbsoluteFill
      style={{
        background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        fontFamily: colors.font,
      }}
    >
      {/* Decorative circles using theme colors */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accent}15 0%, transparent 70%)`,
        }}
      />

      {/* Animated icon (replaces emoji) */}
      <div style={{ marginBottom: 40 }}>
        <SceneIcon colors={colors} />
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: colors.foreground,
          textAlign: "center",
          margin: 0,
          marginBottom: 16,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textShadow: `0 4px 30px ${colors.background}80`,
          fontFamily: colors.fontHeading,
        }}
      >
        {scene.title}
      </h1>

      {/* Subtitle */}
      {scene.subtitle && (
        <h2
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: colors.primary,
            textAlign: "center",
            margin: 0,
            marginBottom: 48,
            opacity: subtitleOpacity,
            letterSpacing: 2,
            fontFamily: colors.fontHeading,
          }}
        >
          {scene.subtitle}
        </h2>
      )}

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          maxWidth: 1000,
        }}
      >
        {scene.content.map((line, index) => (
          <TextWithSpring
            key={index}
            text={line}
            startFrame={30 + index * 12}
            isQuote={line.startsWith('"')}
            colors={colors}
            style={{
              fontSize: line.startsWith("[") ? 24 : 28,
              fontWeight: line.startsWith("✓") ? 600 : 400,
              fontFamily:
                line.includes("$") || line.includes("→")
                  ? "monospace"
                  : colors.font,
              color: line.startsWith("[")
                ? colors.mutedForeground
                : line.startsWith("✓")
                  ? colors.primary
                  : colors.foreground,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          />
        ))}
      </div>

      {/* Progress indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 80,
          right: 80,
          height: 4,
          background: `${colors.border}`,
          borderRadius: 2,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(frame / scene.durationInFrames) * 100}%`,
            background: colors.primary,
            borderRadius: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// =============================================================================
// Main Composition
// =============================================================================

export interface OpenClawOSPresentationProps {
  /**
   * Theme name from the 8gent design system.
   * The composition will use colors from this theme.
   * @default 'claude'
   */
  themeName?: ThemeName;

  /**
   * Whether to use dark mode colors (recommended for video).
   * @default true
   */
  preferDark?: boolean;

  /**
   * Override scenes (optional).
   * Custom scenes should use gradientVariant instead of hardcoded colors.
   */
  customScenes?: Scene[];
}

export const OpenClawOSPresentation: React.FC<OpenClawOSPresentationProps> = ({
  themeName = "claude",
  preferDark = true,
  customScenes,
}) => {
  const scenes = customScenes || DEFAULT_SCENES;

  // Get theme colors for Remotion (no CSS variables available)
  const colors = getThemeColors(themeName, preferDark);

  // Calculate cumulative start frames
  let cumulativeFrames = 0;
  const sceneStarts: number[] = [];

  for (const scene of scenes) {
    sceneStarts.push(cumulativeFrames);
    cumulativeFrames += scene.durationInFrames;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {scenes.map((scene, index) => (
        <Sequence
          key={scene.id}
          from={sceneStarts[index]}
          durationInFrames={scene.durationInFrames}
        >
          <SceneComponent scene={scene} colors={colors} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// =============================================================================
// Composition Config
// =============================================================================

export const OPENCLAW_OS_PRESENTATION_CONFIG = {
  id: "open-claw-os-presentation",
  component: OpenClawOSPresentation,
  durationInFrames: DEFAULT_SCENES.reduce(
    (acc, scene) => acc + scene.durationInFrames,
    0
  ),
  fps: 30,
  width: 1920,
  height: 1080,
  defaultProps: {
    themeName: "claude" as ThemeName,
    preferDark: true,
  },
};

export default OpenClawOSPresentation;

// Re-export scene type for external use
export type { Scene };
