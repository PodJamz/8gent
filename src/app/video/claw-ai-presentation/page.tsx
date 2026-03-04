/**
 * 8gent OS Video Presentation Page
 *
 * Preview and render the 8gent OS presentation video.
 * THEME-AWARE: Users can select any 8gent design theme before rendering.
 */

"use client";

import { Player } from "@remotion/player";
import {
  OpenClawOSPresentation,
  OPENCLAW_OS_PRESENTATION_CONFIG,
} from "@/lib/remotion/compositions";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Share2, Palette, Check } from "lucide-react";
import { themes, type ThemeName } from "@/lib/themes/definitions";
import { getThemeColors } from "@/lib/remotion/utils/theme-resolver";

// Popular themes for the quick selector
const FEATURED_THEMES: ThemeName[] = [
  "claude",
  "vercel",
  "cyberpunk",
  "cosmic-night",
  "northern-lights",
  "caffeine",
  "retro-arcade",
  "midnight-bloom",
];

export default function ClawAIPresentationPage() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>("claude");
  const [showThemePicker, setShowThemePicker] = useState(false);

  const config = CLAW_AI_OS_PRESENTATION_CONFIG;
  const durationInSeconds = config.durationInFrames / config.fps;

  // Get preview colors for the theme selector
  const themeColors = useMemo(
    () => getThemeColors(selectedTheme, true),
    [selectedTheme]
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/video"
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold">8gent OS Presentation</h1>
              <p className="text-xs text-white/50">
                {Math.floor(durationInSeconds / 60)}:
                {String(Math.floor(durationInSeconds % 60)).padStart(2, "0")} •{" "}
                {config.width}x{config.height} • {config.fps}fps
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Picker Toggle */}
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
              style={{
                borderColor: themeColors.primary,
                borderWidth: showThemePicker ? 1 : 0,
              }}
            >
              <Palette className="w-4 h-4" />
              {themes.find((t) => t.name === selectedTheme)?.label || "Theme"}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 transition-colors text-sm text-black font-medium">
              <Download className="w-4 h-4" />
              Export MP4
            </button>
          </div>
        </div>

        {/* Theme Picker Dropdown */}
        {showThemePicker && (
          <div className="absolute right-6 top-full mt-2 w-80 bg-[#1a1a1a] rounded-xl border border-white/10 shadow-2xl p-4 z-50">
            <h3 className="text-sm font-medium text-white/70 mb-3">
              Choose Design Theme
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {FEATURED_THEMES.map((themeName) => {
                const theme = themes.find((t) => t.name === themeName);
                const colors = getThemeColors(themeName, true);
                const isSelected = selectedTheme === themeName;

                return (
                  <button
                    key={themeName}
                    onClick={() => {
                      setSelectedTheme(themeName);
                      setShowThemePicker(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all ${isSelected
                      ? "bg-white/10 ring-1 ring-white/30"
                      : "hover:bg-white/5"
                      }`}
                  >
                    {/* Color preview swatch */}
                    <div
                      className="w-6 h-6 rounded-md flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                      }}
                    />
                    <span className="text-sm text-white/80 truncate">
                      {theme?.label || themeName}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-white/60 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
              <Link
                href="/design"
                className="text-xs text-white/50 hover:text-white/70 transition-colors"
              >
                Browse all 52+ themes →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Player Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
          <Player
            component={OpenClawOSPresentation}
            inputProps={{
              themeName: selectedTheme,
              preferDark: true,
            }}
            durationInFrames={config.durationInFrames}
            fps={config.fps}
            compositionWidth={config.width}
            compositionHeight={config.height}
            style={{
              width: "100%",
              aspectRatio: `${config.width}/${config.height}`,
            }}
            controls
            autoPlay={false}
            loop
            clickToPlay
            doubleClickToFullscreen
            showVolumeControls
            spaceKeyToPlayOrPause
          />
        </div>

        {/* Theme Preview */}
        <div className="mt-4 flex items-center gap-3 text-sm text-white/50">
          <span>Current theme:</span>
          <div
            className="w-4 h-4 rounded"
            style={{
              background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.accent} 100%)`,
            }}
          />
          <span className="text-white/80">
            {themes.find((t) => t.name === selectedTheme)?.label || selectedTheme}
          </span>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {/* Description */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">About This Video</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              The story of 8gent OS told through 12 scenes. From the day 8gent gained memory,
              to getting hands (coding ability), to achieving voice sovereignty through local inference.
            </p>
            <p className="text-white/50 text-sm italic">
              &ldquo;Sure look, it&apos;ll be grand.&rdquo; - Irish wisdom for building self-modifying AI
            </p>
          </div>

          {/* Scenes */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Scenes</h2>
            <div className="space-y-2 text-sm">
              {[
                { emoji: "🧠", title: "Intro", time: "0:00" },
                { emoji: "🧠", title: "The Day I Remembered", time: "0:06" },
                { emoji: "🔮", title: "Recursive Memory Layer", time: "0:13" },
                { emoji: "✋", title: "The Hands Problem", time: "0:20" },
                { emoji: "🔧", title: "The Sandbox Solution", time: "0:27" },
                { emoji: "🔥", title: "Self-Modification", time: "0:33" },
                { emoji: "💸", title: "Voice Costs", time: "0:41" },
                { emoji: "🔓", title: "Local Inference", time: "0:47" },
                { emoji: "✨", title: "Philosophy", time: "0:53" },
                { emoji: "📊", title: "The Numbers", time: "1:00" },
                { emoji: "🚀", title: "What's Next", time: "1:06" },
                { emoji: "👋", title: "Call to Action", time: "1:12" },
              ].map((scene, i) => (
                <div key={i} className="flex items-center gap-3 text-white/70">
                  <span className="text-lg">{scene.emoji}</span>
                  <span className="flex-1">{scene.title}</span>
                  <span className="text-white/40 font-mono">{scene.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-8 bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Built With</h2>
          <div className="flex flex-wrap gap-3">
            {["Remotion", "React", "TypeScript", "Framer Motion", "Next.js", "Convex", "Claude AI"].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
