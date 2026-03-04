'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Terminal, Zap, Copy, Check, RotateCcw } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

function GlitchGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState('NEURAL LINK');
  const [glitchIntensity, setGlitchIntensity] = useState(0.5);
  const [copied, setCopied] = useState(false);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const presets = ['NEURAL LINK', 'SYSTEM BREACH', 'DECRYPT', 'JACK IN', 'OVERRIDE'];

  const copyCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      timeRef.current += 0.05;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Clear with dark background
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, w, h);

      // Draw grid
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Calculate text size to fit
      const maxWidth = w - 40;
      let fontSize = 60;
      ctx.font = `bold ${fontSize}px "Courier New", monospace`;
      while (ctx.measureText(text).width > maxWidth && fontSize > 20) {
        fontSize -= 2;
        ctx.font = `bold ${fontSize}px "Courier New", monospace`;
      }

      const textWidth = ctx.measureText(text).width;
      const x = (w - textWidth) / 2;
      const y = h / 2 + fontSize / 3;

      // Glitch layers
      const layers = [
        { color: '#ff0055', offsetX: 0, offsetY: 0 }, // Red
        { color: '#00ffff', offsetX: 0, offsetY: 0 }, // Cyan
        { color: '#ffffff', offsetX: 0, offsetY: 0 }, // White
      ];

      // Apply glitch offsets based on intensity
      if (Math.random() < glitchIntensity * 0.3) {
        layers[0].offsetX = (Math.random() - 0.5) * 10 * glitchIntensity;
        layers[0].offsetY = (Math.random() - 0.5) * 4 * glitchIntensity;
      }
      if (Math.random() < glitchIntensity * 0.3) {
        layers[1].offsetX = (Math.random() - 0.5) * 10 * glitchIntensity;
        layers[1].offsetY = (Math.random() - 0.5) * 4 * glitchIntensity;
      }

      // Draw chromatic aberration layers
      ctx.globalCompositeOperation = 'lighter';

      // Red layer
      ctx.fillStyle = layers[0].color;
      ctx.globalAlpha = 0.8;
      ctx.fillText(text, x + layers[0].offsetX - 2, y + layers[0].offsetY);

      // Cyan layer
      ctx.fillStyle = layers[1].color;
      ctx.globalAlpha = 0.8;
      ctx.fillText(text, x + layers[1].offsetX + 2, y + layers[1].offsetY);

      // Main text
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 1;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 20;
      ctx.fillText(text, x, y);
      ctx.shadowBlur = 0;

      // Random glitch slices
      if (Math.random() < glitchIntensity * 0.2) {
        const sliceY = Math.random() * h;
        const sliceH = 5 + Math.random() * 20;
        const sliceOffset = (Math.random() - 0.5) * 30 * glitchIntensity;

        const imageData = ctx.getImageData(0, sliceY, w, sliceH);
        ctx.putImageData(imageData, sliceOffset, sliceY);
      }

      // Scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let i = 0; i < h; i += 3) {
        ctx.fillRect(0, i, w, 1);
      }

      // Random noise blocks
      if (Math.random() < glitchIntensity * 0.1) {
        for (let i = 0; i < 5; i++) {
          const bx = Math.random() * w;
          const by = Math.random() * h;
          const bw = 10 + Math.random() * 50;
          const bh = 2 + Math.random() * 10;
          ctx.fillStyle = Math.random() > 0.5 ? '#00ffff' : '#ff0055';
          ctx.globalAlpha = 0.5;
          ctx.fillRect(bx, by, bw, bh);
        }
      }
      ctx.globalAlpha = 1;

      // Flicker effect
      if (Math.random() < glitchIntensity * 0.05) {
        ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.fillRect(0, 0, w, h);
      }

      // Subtle vignette
      const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 1.5);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Status text
      ctx.font = '12px "Courier New", monospace';
      ctx.fillStyle = '#00ffff';
      ctx.globalAlpha = 0.6;
      ctx.fillText(`GLITCH_LEVEL: ${Math.round(glitchIntensity * 100)}%`, 10, h - 10);
      ctx.fillText(`SIGNAL: ${Math.round(Math.sin(t) * 50 + 50)}%`, w - 100, h - 10);
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationRef.current);
  }, [text, glitchIntensity]);

  return (
    <div
      className="w-full border overflow-hidden relative"
      style={{
        borderColor: 'hsl(var(--theme-primary))',
        backgroundColor: '#0a0a0f',
        height: '520px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b relative z-10"
        style={{ borderColor: 'hsl(var(--theme-primary) / 0.5)' }}
      >
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-xs font-mono tracking-wider" style={{ color: 'hsl(var(--theme-primary))' }}>
            GLITCH_GEN_v3.0
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyCanvas}
            className="flex items-center gap-1 px-2 py-1 text-xs font-mono transition-all"
            style={{
              backgroundColor: copied ? 'hsl(var(--theme-primary))' : 'transparent',
              color: copied ? '#000' : 'hsl(var(--theme-primary))',
              border: '1px solid hsl(var(--theme-primary))',
            }}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'COPIED' : 'EXPORT'}
          </button>
          <button
            onClick={() => {
              setText('NEURAL LINK');
              setGlitchIntensity(0.5);
            }}
            className="p-1 transition-all"
            style={{ color: 'hsl(var(--theme-primary))' }}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={500}
        height={280}
        className="w-full"
        style={{ height: '280px' }}
      />

      {/* Controls */}
      <div className="p-4 space-y-4 border-t" style={{ borderColor: 'hsl(var(--theme-primary) / 0.3)' }}>
        {/* Text input */}
        <div>
          <label className="text-xs font-mono mb-2 block" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            &gt; INPUT_TEXT
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase())}
            maxLength={20}
            className="w-full px-3 py-2 text-sm font-mono uppercase bg-transparent border outline-none focus:shadow-lg transition-all"
            style={{
              borderColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-foreground))',
              boxShadow: '0 0 10px hsl(var(--theme-primary) / 0.2)',
            }}
            placeholder="TYPE YOUR TEXT..."
          />
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => setText(preset)}
              className="px-2 py-1 text-xs font-mono transition-all"
              style={{
                backgroundColor: text === preset ? 'hsl(var(--theme-primary))' : 'transparent',
                color: text === preset ? '#000' : 'hsl(var(--theme-primary))',
                border: '1px solid hsl(var(--theme-primary))',
              }}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Glitch intensity */}
        <div>
          <label className="text-xs font-mono mb-2 block" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            &gt; GLITCH_INTENSITY: {Math.round(glitchIntensity * 100)}%
          </label>
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={glitchIntensity}
              onChange={(e) => setGlitchIntensity(parseFloat(e.target.value))}
              className="flex-1 h-1 appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00ffff, #ff0055)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CyberpunkPage() {
  return (
    <ProductPageLayout
      theme="cyberpunk"
      targetUser="designers who want to corrupt the signal"
      problemStatement="Clean design is everywhere. Perfect gradients, smooth corners, safe choices. Where is the edge?"
      problemContext="The future was supposed to be messy. Neon rain on chrome. Static on cracked screens. Instead we got rounded corners and pastel palettes. The visual language of technology has been sanitized. The punk got polished out of cyberpunk."
      insight="Glitch is not error. It is honesty. When systems break, we see how they work. A glitched image reveals its pixels. A corrupted signal exposes its frequencies. Beauty exists in the breakdown."
      tradeoffs={['Chaos over order', 'Authenticity over polish', 'Edge over safety']}
      appName="Glitch Generator"
      appDescription="Create cyberpunk text effects with real-time glitch rendering. Export as image."
      showToolbar={true}
      themeLabel="Cyberpunk"
      onReferenceToAI={(prompt) => { if (typeof window !== 'undefined') { sessionStorage.setItem('openclaw_theme_reference', prompt); sessionStorage.setItem('openclaw_theme_reference_timestamp', Date.now().toString()); } }}
      principles={[
        {
          title: 'Chromatic Aberration',
          description: 'Red and cyan separation mimics broken displays. Colors that should align, deliberately misaligned.',
        },
        {
          title: 'Digital Decay',
          description: 'Scanlines, noise blocks, slice glitches. The aesthetic of data corruption made beautiful.',
        },
        {
          title: 'Neon Intensity',
          description: 'Cyan and magenta burn against black. Colors that glow like they are radioactive.',
        },
        {
          title: 'Terminal Interface',
          description: 'Monospace fonts, command-line syntax. The machine speaks its own language.',
        },
      ]}
      quote={{
        text: 'The street finds its own uses for things.',
        author: 'William Gibson',
      }}
    >
      <GlitchGenerator />

      <div className="mt-16">
        <h3
          className="text-xl font-mono mb-4"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          // NEON_PALETTE
        </h3>
        <p className="text-sm font-mono mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          &gt; Colors extracted from the grid. Click to copy hex values.
        </p>
        <ColorPalette colors={themeColors.cyberpunk} />
      </div>

      <div className="mt-16">
        <h3
          className="text-xl font-mono mb-4"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          // ICON_MATRIX
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
