'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { PageTransition } from '@/components/ios';
import { FadeInUp, InView } from '@/components/motion';
import { springs, motionConfig } from '@/components/motion/config';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Upload,
  Sparkles,
  RotateCcw,
  Download,
  ExternalLink,
  Github,
  Sun,
  Moon,
  MousePointer2,
  Box,
  ChevronLeft,
  Camera,
  Loader2,
  Check,
  Info,
} from 'lucide-react';

// Demo avatar images for the showcase
const DEMO_AVATARS = [
  { id: 'demo-1', src: '/openclaw-logo.png', name: 'Owner' },
];

// Generation modes
type GenerationMode = 'cursor' | '3d-model';

interface GenerationConfig {
  mode: GenerationMode;
  horizontalSteps: number;
  verticalSteps: number;
  textureSize: number;
  meshQuality: number;
}

export default function AvatarPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  // Mouse tracking for 3D effect
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring values for rotation
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springs.snappy);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springs.snappy);

  // State
  const [selectedImage, setSelectedImage] = useState<string | null>(DEMO_AVATARS[0].src);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [config, setConfig] = useState<GenerationConfig>({
    mode: 'cursor',
    horizontalSteps: 5,
    verticalSteps: 5,
    textureSize: 1024,
    meshQuality: 75,
  });

  // Simulated rotation frames for cursor tracking mode demo
  const [currentFrame, setCurrentFrame] = useState(12); // Center frame (5x5 grid = 25 frames, center is 12)

  // Handle mouse move for 3D rotation effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set(x);
    mouseY.set(y);

    // Update frame based on mouse position (simulating cursor tracking)
    if (generationComplete && config.mode === 'cursor') {
      const gridX = Math.floor((x + 1) / 2 * config.horizontalSteps);
      const gridY = Math.floor((y + 1) / 2 * config.verticalSteps);
      const frameIndex = Math.min(
        Math.max(gridY * config.horizontalSteps + gridX, 0),
        config.horizontalSteps * config.verticalSteps - 1
      );
      setCurrentFrame(frameIndex);
    }
  }, [mouseX, mouseY, generationComplete, config]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setCurrentFrame(Math.floor((config.horizontalSteps * config.verticalSteps) / 2));
  }, [mouseX, mouseY, config]);

  // Simulate generation
  const handleGenerate = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    setGenerationComplete(false);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2500));

    setIsGenerating(false);
    setGenerationComplete(true);
  };

  // Reset state
  const handleReset = () => {
    setGenerationComplete(false);
    setIsGenerating(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        {/* Background */}
        <div className="fixed inset-0 bg-background" />

        {/* Subtle grid pattern */}
        <div
          className="fixed inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--foreground) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.smooth}
            className="sticky top-0 z-40 backdrop-blur-xl border-b border-border/50"
            style={{ backgroundColor: 'hsl(var(--background) / 0.8)' }}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm">OpenClaw-OS</span>
                  </Link>
                  <div className="hidden sm:block w-px h-6 bg-border" />
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold">Avatar</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com/0xGF/avatar-3d"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span className="hidden sm:inline">Source</span>
                  </a>
                  <button
                    onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    aria-label="Toggle theme"
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Main content */}
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Hero section */}
            <InView>
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={springs.smooth}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6"
                >
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm text-cyan-600 dark:text-cyan-400">AI-Powered Generation</span>
                </motion.div>

                <FadeInUp delay={0.1}>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                    Interactive 3D Avatars
                  </h1>
                </FadeInUp>

                <FadeInUp delay={0.2}>
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Transform any photo into an interactive 3D avatar with cursor-tracking rotation or full 3D model export.
                  </p>
                </FadeInUp>
              </div>
            </InView>

            {/* Main interface */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left: Avatar preview */}
              <InView>
                <FadeInUp delay={0.3}>
                  <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-muted/50 border border-border/50"
                    style={{ perspective: '1000px' }}
                  >
                    {/* 3D rotating avatar container */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        rotateX: generationComplete ? rotateX : 0,
                        rotateY: generationComplete ? rotateY : 0,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {selectedImage ? (
                        <motion.div
                          className="relative w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-2xl"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={springs.smooth}
                          style={{
                            boxShadow: generationComplete
                              ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                              : '0 10px 30px -10px rgba(0, 0, 0, 0.15)',
                          }}
                        >
                          <Image
                            src={selectedImage}
                            alt="Avatar preview"
                            fill
                            className="object-cover"
                            priority
                          />

                          {/* Generating overlay */}
                          <AnimatePresence>
                            {isGenerating && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
                              >
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                >
                                  <Loader2 className="w-8 h-8 text-cyan-500" />
                                </motion.div>
                                <div className="text-center">
                                  <p className="font-medium">Generating Avatar</p>
                                  <p className="text-sm text-muted-foreground">Processing with AI...</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Success overlay */}
                          <AnimatePresence>
                            {generationComplete && !isGenerating && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="absolute top-4 right-4"
                              >
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/90 text-white text-sm">
                                  <Check className="w-4 h-4" />
                                  <span>Generated</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                          <Upload className="w-12 h-12" />
                          <p>Upload a photo to get started</p>
                        </div>
                      )}
                    </motion.div>

                    {/* Mouse tracking indicator */}
                    {generationComplete && config.mode === 'cursor' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
                      >
                        <MousePointer2 className="w-4 h-4" />
                        <span>Move your mouse to rotate</span>
                      </motion.div>
                    )}
                  </div>
                </FadeInUp>
              </InView>

              {/* Right: Controls */}
              <InView>
                <FadeInUp delay={0.4}>
                  <div className="space-y-6">
                    {/* Mode selection */}
                    <div className="p-6 rounded-2xl bg-card border border-border/50">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-500" />
                        Generation Mode
                      </h3>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setConfig(c => ({ ...c, mode: 'cursor' }))}
                          className={cn(
                            'p-4 rounded-xl border-2 transition-all text-left',
                            config.mode === 'cursor'
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : 'border-border/50 hover:border-border'
                          )}
                        >
                          <MousePointer2 className={cn(
                            'w-6 h-6 mb-2',
                            config.mode === 'cursor' ? 'text-cyan-500' : 'text-muted-foreground'
                          )} />
                          <div className="font-medium">Cursor Tracking</div>
                          <div className="text-sm text-muted-foreground">Mouse-follow rotation grid</div>
                        </button>

                        <button
                          onClick={() => setConfig(c => ({ ...c, mode: '3d-model' }))}
                          className={cn(
                            'p-4 rounded-xl border-2 transition-all text-left',
                            config.mode === '3d-model'
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : 'border-border/50 hover:border-border'
                          )}
                        >
                          <Box className={cn(
                            'w-6 h-6 mb-2',
                            config.mode === '3d-model' ? 'text-cyan-500' : 'text-muted-foreground'
                          )} />
                          <div className="font-medium">3D Model</div>
                          <div className="text-sm text-muted-foreground">Export as GLB file</div>
                        </button>
                      </div>
                    </div>

                    {/* Configuration */}
                    <div className="p-6 rounded-2xl bg-card border border-border/50">
                      <h3 className="font-semibold mb-4">Configuration</h3>

                      {config.mode === 'cursor' ? (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-muted-foreground mb-2 block">
                              Horizontal Steps: {config.horizontalSteps}
                            </label>
                            <input
                              type="range"
                              min={3}
                              max={9}
                              step={2}
                              value={config.horizontalSteps}
                              onChange={(e) => setConfig(c => ({ ...c, horizontalSteps: Number(e.target.value) }))}
                              className="w-full accent-cyan-500"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground mb-2 block">
                              Vertical Steps: {config.verticalSteps}
                            </label>
                            <input
                              type="range"
                              min={3}
                              max={9}
                              step={2}
                              value={config.verticalSteps}
                              onChange={(e) => setConfig(c => ({ ...c, verticalSteps: Number(e.target.value) }))}
                              className="w-full accent-cyan-500"
                            />
                          </div>
                          <div className="pt-2 text-xs text-muted-foreground flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>
                              Total frames: {config.horizontalSteps * config.verticalSteps}.
                              Higher counts create smoother rotation but increase generation cost.
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-muted-foreground mb-2 block">
                              Texture Size: {config.textureSize}px
                            </label>
                            <input
                              type="range"
                              min={512}
                              max={2048}
                              step={256}
                              value={config.textureSize}
                              onChange={(e) => setConfig(c => ({ ...c, textureSize: Number(e.target.value) }))}
                              className="w-full accent-cyan-500"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground mb-2 block">
                              Mesh Quality: {config.meshQuality}%
                            </label>
                            <input
                              type="range"
                              min={50}
                              max={100}
                              step={5}
                              value={config.meshQuality}
                              onChange={(e) => setConfig(c => ({ ...c, meshQuality: Number(e.target.value) }))}
                              className="w-full accent-cyan-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      {!generationComplete ? (
                        <button
                          onClick={handleGenerate}
                          disabled={!selectedImage || isGenerating}
                          className={cn(
                            'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
                            'bg-cyan-500 text-white',
                            'hover:bg-cyan-600',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'shadow-lg shadow-cyan-500/25'
                          )}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5" />
                              <span>Generate Avatar</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={handleReset}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium border border-border hover:bg-muted/50 transition-colors"
                          >
                            <RotateCcw className="w-5 h-5" />
                            <span>Reset</span>
                          </button>
                          <button
                            className={cn(
                              'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
                              'bg-emerald-500 text-white',
                              'hover:bg-emerald-600',
                              'shadow-lg shadow-emerald-500/25'
                            )}
                          >
                            <Download className="w-5 h-5" />
                            <span>Export {config.mode === 'cursor' ? 'Frames' : 'GLB'}</span>
                          </button>
                        </>
                      )}
                    </div>

                    {/* Info card */}
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                          <Info className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium mb-1">About This Demo</p>
                          <p className="text-muted-foreground">
                            This is a showcase of the avatar-3d concept. The full implementation uses Replicate AI models
                            for preprocessing and generation. Check out the{' '}
                            <a
                              href="https://github.com/0xGF/avatar-3d"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-500 hover:underline"
                            >
                              original repository
                            </a>{' '}
                            for the complete implementation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              </InView>
            </div>

            {/* Features section */}
            <InView>
              <section className="mt-16 sm:mt-24">
                <FadeInUp>
                  <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
                    How It Works
                  </h2>
                </FadeInUp>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Upload,
                      title: 'Upload Photo',
                      description: 'Start with any portrait photo. The AI works best with clear, front-facing images.',
                      color: 'text-blue-500',
                      bg: 'bg-blue-500/10',
                    },
                    {
                      icon: Sparkles,
                      title: 'AI Processing',
                      description: 'Your photo is processed through Replicate AI models for Pixar-style stylization.',
                      color: 'text-cyan-500',
                      bg: 'bg-cyan-500/10',
                    },
                    {
                      icon: Box,
                      title: 'Generate Avatar',
                      description: 'Choose cursor-tracking frames or full 3D GLB model for external tools.',
                      color: 'text-emerald-500',
                      bg: 'bg-emerald-500/10',
                    },
                  ].map((feature, index) => (
                    <FadeInUp key={feature.title} delay={0.1 * index}>
                      <div className="p-6 rounded-2xl bg-card border border-border/50 h-full">
                        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', feature.bg)}>
                          <feature.icon className={cn('w-6 h-6', feature.color)} />
                        </div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </FadeInUp>
                  ))}
                </div>
              </section>
            </InView>

            {/* Credits section */}
            <InView>
              <section className="mt-16 sm:mt-24 mb-12">
                <FadeInUp>
                  <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/50 text-center">
                    <p className="text-sm text-muted-foreground mb-3">Inspired by</p>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <a
                        href="https://github.com/0xGF/avatar-3d"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-lg font-semibold hover:text-cyan-500 transition-colors"
                      >
                        <Github className="w-5 h-5" />
                        <span>0xGF/avatar-3d</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Built with Next.js, Three.js, and Replicate AI. Create your own interactive 3D avatars from photos.
                    </p>
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <Link
                        href="/inspirations"
                        className="inline-flex items-center gap-2 text-sm text-cyan-500 hover:underline"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>View all inspirations</span>
                      </Link>
                    </div>
                  </div>
                </FadeInUp>
              </section>
            </InView>
          </main>

          {/* Back button */}
          <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-card/80 backdrop-blur-xl text-foreground text-sm sm:text-base hover:bg-card transition-colors border border-border/50 shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to OpenClaw-OS
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
