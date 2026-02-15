'use client';

import { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Code2,
  FileJson,
  Film,
  Play,
  Pause,
  Settings,
  Home,
  X,
  Check,
  Palette,
  Layers,
  Wand2,
  ChevronDown,
  ChevronUp,
  Copy,
  Box,
  AlertCircle,
} from 'lucide-react';
import { springs, presets } from '@/components/motion/config';
import { FadeIn, FadeInUp } from '@/components/motion';
import { cn } from '@/lib/utils';
import {
  type DeviceType,
  type AnimationType,
  type BackgroundType,
  type ExportFormat,
  type Screenshot,
  type AnimationConfig,
  type BackgroundConfig,
  type MockupLayout,
  DEVICE_FRAMES,
  ANIMATION_PRESETS,
  BACKGROUND_PRESETS,
} from '@/lib/mockit/types';
import { generateSEOFilename, generateAltText } from '@/lib/mockit/seo-filename';
import { createExportBlob, generateReactCode, generateJSON } from '@/lib/mockit/exporters';

// ============================================================================
// Theme Colors - iOS-style adaptive colors
// ============================================================================

const useColors = () => {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const isDark = resolvedTheme === 'dark';
    return {
      // Backgrounds
      bg: isDark ? 'bg-black' : 'bg-slate-50',
      bgSecondary: isDark ? 'bg-zinc-900/95' : 'bg-white/95',
      bgTertiary: isDark ? 'bg-zinc-800/80' : 'bg-slate-100/80',
      bgCard: isDark ? 'bg-white/[0.04]' : 'bg-white',
      bgCardHover: isDark ? 'bg-white/[0.08]' : 'bg-slate-50',
      bgGlass: isDark ? 'bg-zinc-900/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl',

      // Text
      text: isDark ? 'text-white' : 'text-slate-900',
      textSecondary: isDark ? 'text-white/80' : 'text-slate-700',
      textMuted: isDark ? 'text-white/60' : 'text-slate-600',
      textFaint: isDark ? 'text-white/40' : 'text-slate-400',

      // Borders
      border: isDark ? 'border-white/[0.08]' : 'border-slate-200/80',
      borderHover: isDark ? 'border-white/[0.15]' : 'border-slate-300',
      borderFocus: 'border-cyan-500',

      // Interactive states
      hoverBg: isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-slate-100',
      activeBg: isDark ? 'active:bg-white/[0.1]' : 'active:bg-slate-200',

      // Misc
      divider: isDark ? 'bg-white/[0.08]' : 'bg-slate-200',
      shadow: isDark ? 'shadow-2xl shadow-black/50' : 'shadow-xl shadow-slate-200/50',
      isDark,
    };
  }, [resolvedTheme]);
};

// Device icons
const DeviceIcon = ({ device, className }: { device: DeviceType; className?: string }) => {
  switch (device) {
    case 'mobile': return <Smartphone className={className} />;
    case 'tablet': return <Tablet className={className} />;
    case 'desktop': return <Monitor className={className} />;
  }
};

// Animation preview component
const AnimationPreview = memo(function AnimationPreview({
  animation,
  isPlaying,
}: {
  animation: AnimationConfig;
  isPlaying: boolean;
}) {
  const getAnimationStyle = () => {
    if (!isPlaying || animation.type === 'none') return {};

    switch (animation.type) {
      case 'float':
        return {
          animation: `mockitFloat ${animation.duration}ms ${animation.easing} infinite`,
        };
      case 'rotate3d':
        return {
          animation: `mockitRotate3d ${animation.duration}ms ${animation.easing} infinite`,
          transformStyle: 'preserve-3d' as const,
        };
      case 'pulse':
        return {
          animation: `mockitPulse ${animation.duration}ms ${animation.easing} infinite`,
        };
      case 'bounce':
        return {
          animation: `mockitBounce ${animation.duration}ms ${animation.easing} infinite`,
        };
      case 'swing':
        return {
          animation: `mockitSwing ${animation.duration}ms ${animation.easing} infinite`,
        };
      default:
        return {};
    }
  };

  return (
    <div className="w-8 h-12 bg-gradient-to-br from-cyan-500 to-cyan-500 rounded-lg shadow-lg" style={getAnimationStyle()} />
  );
});

// ============================================================================
// Device Frame Component - Premium device mockup
// ============================================================================

const DeviceFrame = memo(function DeviceFrame({
  screenshot,
  isAnimating,
  animation,
  layout,
  index,
  total,
}: {
  screenshot: Screenshot;
  isAnimating: boolean;
  animation: AnimationConfig;
  layout: MockupLayout;
  index: number;
  total: number;
}) {
  const colors = useColors();
  const frame = DEVICE_FRAMES[screenshot.device];
  const scale = frame.scale * (layout.arrangement === 'grid' ? 0.8 : 1);

  const getTransform = () => {
    switch (layout.arrangement) {
      case 'fan': {
        const angle = (index - (total - 1) / 2) * layout.rotation;
        return `rotate(${angle}deg)`;
      }
      case 'cascade':
        return `translateX(${index * 30}px) translateY(${index * 30}px)`;
      case 'perspective': {
        if (screenshot.device === 'mobile') return 'rotateY(15deg) translateX(-50px)';
        if (screenshot.device === 'desktop') return 'rotateY(-15deg) translateX(50px)';
        return 'rotateY(0deg)';
      }
      default:
        return '';
    }
  };

  const getAnimationStyle = () => {
    if (!isAnimating || animation.type === 'none') return {};

    const animClass = `mockit${animation.type.charAt(0).toUpperCase() + animation.type.slice(1)}`;
    return {
      animation: `${animClass} ${animation.duration}ms ${animation.easing} infinite`,
      animationDelay: `${animation.delay * index}ms`,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ ...springs.bouncy, delay: index * 0.1 }}
      className="relative flex-shrink-0"
      style={{
        width: frame.width * scale,
        transform: getTransform(),
        transformStyle: 'preserve-3d',
        ...getAnimationStyle(),
      }}
    >
      {/* Shadow */}
      {layout.shadow.enabled && (
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-8 rounded-full"
          style={{
            background: `rgba(0, 0, 0, ${layout.shadow.opacity})`,
            filter: `blur(${layout.shadow.blur}px)`,
            transform: `translateX(${layout.shadow.offsetX}px) translateY(${layout.shadow.offsetY}px)`,
          }}
        />
      )}

      {/* Device Frame */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%)',
          borderRadius: frame.bezel.radius * scale,
          padding: `${frame.bezel.top * scale}px ${frame.bezel.right * scale}px ${frame.bezel.bottom * scale}px ${frame.bezel.left * scale}px`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Device-specific elements */}
        {screenshot.device === 'mobile' && (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 bg-black rounded-full"
            style={{
              width: 90 * scale,
              height: 28 * scale,
            }}
          />
        )}

        {screenshot.device === 'desktop' && (
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-black rounded-b-xl"
            style={{
              width: 140 * scale,
              height: 20 * scale,
            }}
          />
        )}

        {/* Screen */}
        <div
          className="relative bg-black overflow-hidden"
          style={{
            borderRadius: (frame.bezel.radius - 8) * scale,
          }}
        >
          <img
            src={screenshot.dataUrl}
            alt={generateAltText(screenshot.url, [screenshot.device])}
            className="w-full h-auto"
            style={{
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* Device Label */}
      <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs ${colors.textFaint} whitespace-nowrap`}>
        {frame.name}
      </div>
    </motion.div>
  );
});

// ============================================================================
// Main MockitApp Component
// ============================================================================

export default function MockitApp() {
  const colors = useColors();
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion ?? false;

  // State
  const [url, setUrl] = useState('');
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<DeviceType[]>(['mobile', 'tablet', 'desktop']);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [captureDebug, setCaptureDebug] = useState<{
    mode: string;
    errors?: string[];
  } | null>(null);

  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [activePanel, setActivePanel] = useState<'animation' | 'background' | 'layout' | null>('background');
  const [copied, setCopied] = useState(false);

  // Animation config
  const [animation, setAnimation] = useState<AnimationConfig>({
    type: 'float',
    duration: 3000,
    delay: 200,
    easing: 'ease-in-out',
    intensity: 10,
  });

  // Background config - default to midnight (dark, neutral)
  const [background, setBackground] = useState<BackgroundConfig>({
    type: 'gradient',
    primaryColor: '#232526',
    secondaryColor: '#414345',
    angle: 180,
  });

  // Layout config
  const [layout, setLayout] = useState<MockupLayout>({
    devices: ['mobile', 'tablet', 'desktop'],
    arrangement: 'stack',
    spacing: 40,
    rotation: 8,
    perspective: 1000,
    shadow: {
      enabled: true,
      blur: 30,
      opacity: 0.3,
      offsetX: 0,
      offsetY: 20,
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Capture screenshots
  const handleCapture = useCallback(async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setError(null);
    setIsCapturing(true);

    try {
      const response = await fetch('/api/mockit/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, devices: selectedDevices }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to capture screenshots');
      }

      const newScreenshots: Screenshot[] = data.screenshots.map((s: { device: DeviceType; dataUrl: string; width: number; height: number }) => ({
        id: `${s.device}-${Date.now()}`,
        url,
        device: s.device,
        dataUrl: s.dataUrl,
        width: s.width,
        height: s.height,
        capturedAt: Date.now(),
      }));

      setScreenshots(newScreenshots);

      // Store debug info from API response
      if (data.debug || data.mode) {
        setCaptureDebug({
          mode: data.mode || 'unknown',
          errors: data.debug?.errors,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to capture screenshots');
    } finally {
      setIsCapturing(false);
    }
  }, [url, selectedDevices]);

  // Export mockup
  const handleExport = useCallback(async (format: ExportFormat) => {
    if (screenshots.length === 0) return;

    setIsExporting(true);
    setError(null);

    try {
      const { blob, filename } = await createExportBlob({
        screenshots,
        animation,
        background,
        layout,
        sourceUrl: url,
        format,
      });

      // Download
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export');
    } finally {
      setIsExporting(false);
    }
  }, [screenshots, animation, background, layout, url]);

  // Copy React code
  const handleCopyReactCode = useCallback(async () => {
    if (screenshots.length === 0) return;

    const code = generateReactCode({
      screenshots,
      animation,
      background,
      layout,
      sourceUrl: url,
    });

    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [screenshots, animation, background, layout, url]);

  // Toggle device selection
  const toggleDevice = useCallback((device: DeviceType) => {
    setSelectedDevices(prev => {
      if (prev.includes(device)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(d => d !== device);
      }
      return [...prev, device];
    });
  }, []);

  // Get background style
  const getBackgroundStyle = () => {
    if (background.type === 'transparent') {
      return {
        background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px',
      };
    }

    if (background.type === 'solid') {
      return { backgroundColor: background.primaryColor };
    }

    return {
      background: `linear-gradient(${background.angle || 135}deg, ${background.primaryColor}, ${background.secondaryColor})`,
    };
  };

  // Loading state - show skeleton until hydrated
  if (!mounted) {
    return (
      <div className="h-dvh flex items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-cyan-500/30">
            <Box className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-white/40" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`h-dvh flex flex-col ${colors.bg} ${colors.text} overflow-hidden`}>
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes mockitFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-${animation.intensity}px); }
        }
        @keyframes mockitRotate3d {
          0%, 100% { transform: rotateY(0deg) rotateX(0deg); }
          25% { transform: rotateY(-${animation.intensity / 2}deg) rotateX(-${animation.intensity / 4}deg); }
          75% { transform: rotateY(${animation.intensity / 2}deg) rotateX(${animation.intensity / 4}deg); }
        }
        @keyframes mockitPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(${1 + animation.intensity / 100}); }
        }
        @keyframes mockitBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-${animation.intensity * 2}px); }
        }
        @keyframes mockitSwing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(${animation.intensity / 2}deg); }
          75% { transform: rotate(-${animation.intensity / 2}deg); }
        }
      `}</style>

      {/* Header */}
      <header className={`flex items-center justify-between px-4 py-3 ${colors.bgSecondary} border-b ${colors.border}`}>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={`p-2 rounded-lg ${colors.textFaint} hover:${colors.text} hover:${colors.bgCardHover} transition-colors`}
          >
            <Home className="w-5 h-5" />
          </Link>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-500 flex items-center justify-center">
              <Box className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className={`text-sm font-semibold ${colors.text}`}>Mockit</h1>
              <p className={`text-xs ${colors.textFaint}`}>Mockup Generator</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {screenshots.length > 0 && (
            <>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2 rounded-lg ${colors.bgCard} ${colors.textFaint} hover:${colors.text} transition-colors`}
                title={isPlaying ? 'Pause animation' : 'Play animation'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg ${showSettings ? 'bg-cyan-500 text-white' : `${colors.bgCard} ${colors.textFaint}`} hover:opacity-80 transition-colors`}
              >
                <Settings className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* URL Input Bar */}
          <div className={`p-4 ${colors.bgSecondary} border-b ${colors.border}`}>
            <div className="flex gap-3 max-w-4xl mx-auto">
              <div className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl ${colors.bgTertiary} border ${colors.border} focus-within:border-cyan-500 transition-colors`}>
                <Globe className={`w-4 h-4 ${colors.textFaint}`} />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCapture()}
                  placeholder="Enter website URL (e.g., https://github.com)"
                  className={`flex-1 bg-transparent outline-none text-sm ${colors.text} placeholder:${colors.textFaint}`}
                />
                {url && (
                  <button
                    onClick={() => setUrl('')}
                    className={`p-1 rounded ${colors.textFaint} hover:${colors.text}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Device Toggles */}
              <div className={`flex items-center gap-1 px-2 rounded-xl ${colors.bgTertiary} border ${colors.border}`}>
                {(['mobile', 'tablet', 'desktop'] as const).map((device) => (
                  <button
                    key={device}
                    onClick={() => toggleDevice(device)}
                    className={`p-2 rounded-lg transition-colors ${selectedDevices.includes(device)
                        ? 'bg-cyan-500 text-white'
                        : `${colors.textFaint} hover:${colors.text}`
                      }`}
                    title={`${selectedDevices.includes(device) ? 'Remove' : 'Add'} ${device}`}
                  >
                    <DeviceIcon device={device} className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <button
                onClick={handleCapture}
                disabled={isCapturing || !url.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCapturing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Capturing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Capture</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="text-center text-red-400 text-sm mt-2">{error}</p>
            )}

            {/* Debug info - shows capture method and any errors */}
            {captureDebug && (
              <div className={`mt-3 p-3 rounded-lg ${colors.bgTertiary} border ${colors.border}`}>
                <p className={`text-xs ${colors.textFaint}`}>
                  Capture mode: <span className={`font-medium ${captureDebug.mode === 'placeholder' ? 'text-amber-400' : 'text-emerald-400'}`}>{captureDebug.mode}</span>
                </p>
                {captureDebug.errors && captureDebug.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-amber-400 mb-1">Capture issues:</p>
                    {captureDebug.errors.slice(0, 3).map((err, i) => (
                      <p key={i} className={`text-xs ${colors.textFaint} truncate`}>• {err}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preview Canvas */}
          <div
            className="flex-1 flex items-center justify-center overflow-auto p-8"
            style={getBackgroundStyle()}
          >
            {screenshots.length === 0 ? (
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl ${colors.bgCard} backdrop-blur-xl flex items-center justify-center`}>
                  <ImageIcon className={`w-10 h-10 ${colors.textFaint}`} />
                </div>
                <h2 className={`text-xl font-semibold ${colors.text} mb-2`}>No mockup yet</h2>
                <p className={`${colors.textMuted} text-sm max-w-md`}>
                  Enter a website URL above and click Capture to generate beautiful device mockups
                </p>
              </div>
            ) : (
              <div
                className="flex items-end justify-center"
                style={{
                  gap: `${layout.spacing}px`,
                  perspective: layout.arrangement === 'perspective' ? `${layout.perspective}px` : 'none',
                }}
              >
                {screenshots.map((screenshot, index) => (
                  <DeviceFrame
                    key={screenshot.id}
                    screenshot={screenshot}
                    isAnimating={isPlaying && !reducedMotion}
                    animation={animation}
                    layout={layout}
                    index={index}
                    total={screenshots.length}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Export Bar */}
          {screenshots.length > 0 && (
            <div className={`p-4 ${colors.bgSecondary} border-t ${colors.border}`}>
              <div className="flex items-center justify-center gap-3">
                <span className={`text-sm ${colors.textMuted}`}>Export as:</span>

                <button
                  onClick={() => handleExport('png')}
                  disabled={isExporting}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${colors.bgCard} border ${colors.border} hover:${colors.borderHover} transition-colors disabled:opacity-50`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm">PNG</span>
                </button>

                <button
                  onClick={() => handleExport('gif')}
                  disabled={isExporting || animation.type === 'none'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${colors.bgCard} border ${colors.border} hover:${colors.borderHover} transition-colors disabled:opacity-50`}
                  title={animation.type === 'none' ? 'Add animation to export GIF' : 'Export as GIF'}
                >
                  <Film className="w-4 h-4" />
                  <span className="text-sm">GIF</span>
                </button>

                <button
                  onClick={() => handleExport('json')}
                  disabled={isExporting}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${colors.bgCard} border ${colors.border} hover:${colors.borderHover} transition-colors disabled:opacity-50`}
                >
                  <FileJson className="w-4 h-4" />
                  <span className="text-sm">JSON</span>
                </button>

                <button
                  onClick={() => handleExport('react')}
                  disabled={isExporting}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors disabled:opacity-50`}
                >
                  <Code2 className="w-4 h-4" />
                  <span className="text-sm">React Code</span>
                </button>

                <button
                  onClick={handleCopyReactCode}
                  className={cn(
                    'p-2.5 rounded-xl border transition-all duration-200',
                    copied
                      ? 'bg-green-500 text-white border-green-500'
                      : `${colors.bgCard} ${colors.border} ${colors.hoverBg}`
                  )}
                  title="Copy React code to clipboard"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>

                {isExporting && (
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Sidebar */}
        <AnimatePresence>
          {showSettings && screenshots.length > 0 && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={springs.snappy}
              className={`${colors.bgSecondary} border-l ${colors.border} overflow-hidden flex-shrink-0`}
            >
              <div className="w-80 h-full overflow-y-auto p-4">
                <div className="space-y-4">
                  {/* Animation Panel */}
                  <div className={`rounded-xl border ${colors.border} overflow-hidden`}>
                    <button
                      onClick={() => setActivePanel(activePanel === 'animation' ? null : 'animation')}
                      className={`w-full flex items-center justify-between p-4 ${colors.bgCard} hover:${colors.bgCardHover} transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                          <Wand2 className="w-4 h-4 text-white" />
                        </div>
                        <span className={`font-medium ${colors.text}`}>Animation</span>
                      </div>
                      {activePanel === 'animation' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                      {activePanel === 'animation' && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className={`p-4 border-t ${colors.border} space-y-4`}>
                            <div>
                              <label className={`text-xs ${colors.textFaint} mb-2 block`}>Animation Type</label>
                              <div className="grid grid-cols-3 gap-2">
                                {(['none', 'float', 'rotate3d', 'pulse', 'bounce', 'swing'] as AnimationType[]).map((type) => (
                                  <button
                                    key={type}
                                    onClick={() => setAnimation(prev => ({
                                      ...prev,
                                      type,
                                      ...ANIMATION_PRESETS[type],
                                    }))}
                                    className={`px-3 py-2 rounded-lg text-xs capitalize transition-colors ${animation.type === type
                                        ? 'bg-cyan-500 text-white'
                                        : `${colors.bgTertiary} ${colors.textMuted} hover:${colors.text}`
                                      }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {animation.type !== 'none' && (
                              <>
                                <div>
                                  <label className={`text-xs ${colors.textFaint} mb-2 block`}>
                                    Duration: {animation.duration}ms
                                  </label>
                                  <input
                                    type="range"
                                    min="500"
                                    max="5000"
                                    step="100"
                                    value={animation.duration}
                                    onChange={(e) => setAnimation(prev => ({ ...prev, duration: Number(e.target.value) }))}
                                    className="w-full accent-cyan-500"
                                  />
                                </div>

                                <div>
                                  <label className={`text-xs ${colors.textFaint} mb-2 block`}>
                                    Intensity: {animation.intensity}
                                  </label>
                                  <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    step="1"
                                    value={animation.intensity}
                                    onChange={(e) => setAnimation(prev => ({ ...prev, intensity: Number(e.target.value) }))}
                                    className="w-full accent-cyan-500"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Background Panel */}
                  <div className={`rounded-xl border ${colors.border} overflow-hidden`}>
                    <button
                      onClick={() => setActivePanel(activePanel === 'background' ? null : 'background')}
                      className={`w-full flex items-center justify-between p-4 ${colors.bgCard} hover:${colors.bgCardHover} transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                          <Palette className="w-4 h-4 text-white" />
                        </div>
                        <span className={`font-medium ${colors.text}`}>Background</span>
                      </div>
                      {activePanel === 'background' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                      {activePanel === 'background' && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className={`p-4 border-t ${colors.border} space-y-4`}>
                            <div>
                              <label className={`text-xs ${colors.textFaint} mb-2 block`}>Presets</label>
                              <div className="grid grid-cols-4 gap-2">
                                {Object.entries(BACKGROUND_PRESETS).map(([name, preset]) => (
                                  <button
                                    key={name}
                                    onClick={() => setBackground({
                                      ...background,
                                      ...preset,
                                    })}
                                    className={`aspect-square rounded-lg border-2 transition-colors ${background.primaryColor === preset.primaryColor && background.secondaryColor === preset.secondaryColor
                                        ? 'border-white'
                                        : 'border-transparent hover:border-white/30'
                                      }`}
                                    style={{
                                      background: preset.type === 'transparent'
                                        ? 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px'
                                        : `linear-gradient(${preset.angle || 135}deg, ${preset.primaryColor}, ${preset.secondaryColor})`,
                                    }}
                                    title={name}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className={`text-xs ${colors.textFaint} mb-2 block`}>Primary</label>
                                <input
                                  type="color"
                                  value={background.primaryColor}
                                  onChange={(e) => setBackground(prev => ({ ...prev, primaryColor: e.target.value }))}
                                  className="w-full h-10 rounded-lg cursor-pointer"
                                />
                              </div>
                              <div>
                                <label className={`text-xs ${colors.textFaint} mb-2 block`}>Secondary</label>
                                <input
                                  type="color"
                                  value={background.secondaryColor}
                                  onChange={(e) => setBackground(prev => ({ ...prev, secondaryColor: e.target.value }))}
                                  className="w-full h-10 rounded-lg cursor-pointer"
                                />
                              </div>
                            </div>

                            <div>
                              <label className={`text-xs ${colors.textFaint} mb-2 block`}>
                                Angle: {background.angle || 135}°
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="360"
                                step="15"
                                value={background.angle || 135}
                                onChange={(e) => setBackground(prev => ({ ...prev, angle: Number(e.target.value) }))}
                                className="w-full accent-cyan-500"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Layout Panel */}
                  <div className={`rounded-xl border ${colors.border} overflow-hidden`}>
                    <button
                      onClick={() => setActivePanel(activePanel === 'layout' ? null : 'layout')}
                      className={`w-full flex items-center justify-between p-4 ${colors.bgCard} hover:${colors.bgCardHover} transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                          <Layers className="w-4 h-4 text-white" />
                        </div>
                        <span className={`font-medium ${colors.text}`}>Layout</span>
                      </div>
                      {activePanel === 'layout' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                      {activePanel === 'layout' && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className={`p-4 border-t ${colors.border} space-y-4`}>
                            <div>
                              <label className={`text-xs ${colors.textFaint} mb-2 block`}>Arrangement</label>
                              <div className="grid grid-cols-2 gap-2">
                                {(['stack', 'fan', 'cascade', 'perspective'] as const).map((arr) => (
                                  <button
                                    key={arr}
                                    onClick={() => setLayout(prev => ({ ...prev, arrangement: arr }))}
                                    className={`px-3 py-2 rounded-lg text-xs capitalize transition-colors ${layout.arrangement === arr
                                        ? 'bg-cyan-500 text-white'
                                        : `${colors.bgTertiary} ${colors.textMuted} hover:${colors.text}`
                                      }`}
                                  >
                                    {arr}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className={`text-xs ${colors.textFaint} mb-2 block`}>
                                Spacing: {layout.spacing}px
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={layout.spacing}
                                onChange={(e) => setLayout(prev => ({ ...prev, spacing: Number(e.target.value) }))}
                                className="w-full accent-cyan-500"
                              />
                            </div>

                            {layout.arrangement === 'fan' && (
                              <div>
                                <label className={`text-xs ${colors.textFaint} mb-2 block`}>
                                  Rotation: {layout.rotation}°
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="20"
                                  step="1"
                                  value={layout.rotation}
                                  onChange={(e) => setLayout(prev => ({ ...prev, rotation: Number(e.target.value) }))}
                                  className="w-full accent-cyan-500"
                                />
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <span className={`text-xs ${colors.textMuted}`}>Show Shadow</span>
                              <button
                                onClick={() => setLayout(prev => ({
                                  ...prev,
                                  shadow: { ...prev.shadow, enabled: !prev.shadow.enabled },
                                }))}
                                className={`w-10 h-6 rounded-full transition-colors ${layout.shadow.enabled ? 'bg-cyan-500' : colors.bgTertiary
                                  }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full bg-white transition-transform ${layout.shadow.enabled ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className={`px-4 py-2 ${colors.bgSecondary} border-t ${colors.border} text-center`}>
        <p className={`text-xs ${colors.textFaint}`}>
          Mockit by{' '}
          <a href="/" className="text-cyan-400 hover:text-cyan-300">OpenClaw-OS</a>
          {' '} • Inspired by{' '}
          <a
            href="https://shots.so"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300"
          >
            shots.so
          </a>
        </p>
      </footer>
    </div>
  );
}
