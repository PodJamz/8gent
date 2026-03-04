'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, Wind, Play, Pause, RotateCcw } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

interface AuroraWave {
  y: number;
  amplitude: number;
  frequency: number;
  speed: number;
  hue: number;
  opacity: number;
}

function AuroraVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(true);
  const [intensity, setIntensity] = useState(0.7);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const wavesRef = useRef<AuroraWave[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>(0);

  // Initialize waves
  useEffect(() => {
    wavesRef.current = Array.from({ length: 8 }, (_, i) => ({
      y: 0.2 + (i * 0.08),
      amplitude: 30 + Math.random() * 40,
      frequency: 0.002 + Math.random() * 0.003,
      speed: 0.5 + Math.random() * 0.5,
      hue: 120 + i * 20 + Math.random() * 30,
      opacity: 0.3 + Math.random() * 0.4,
    }));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (playing) {
        timeRef.current += 0.016;
      }

      const w = canvas.width;
      const h = canvas.height;
      const t = timeRef.current;

      // Clear with dark sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, h);
      skyGradient.addColorStop(0, '#0a0a1a');
      skyGradient.addColorStop(0.3, '#0f1528');
      skyGradient.addColorStop(1, '#050510');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, w, h);

      // Draw stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 100; i++) {
        const starX = (Math.sin(i * 567.89) * 0.5 + 0.5) * w;
        const starY = (Math.cos(i * 123.45) * 0.5 + 0.5) * h * 0.6;
        const twinkle = Math.sin(t * 2 + i) * 0.5 + 0.5;
        ctx.globalAlpha = 0.3 + twinkle * 0.7;
        ctx.beginPath();
        ctx.arc(starX, starY, 0.5 + twinkle, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw aurora waves
      wavesRef.current.forEach((wave, waveIndex) => {
        const mouseInfluence = 1 + (mousePos.x - 0.5) * 0.5;
        const intensityMod = intensity * (1 + (mousePos.y - 0.5) * 0.3);

        ctx.beginPath();
        ctx.moveTo(0, h);

        // Draw wave path
        for (let x = 0; x <= w; x += 3) {
          const normalizedX = x / w;
          const waveY = wave.y * h;

          // Multiple sine waves for organic feel
          const noise1 = Math.sin(normalizedX * wave.frequency * 1000 + t * wave.speed) * wave.amplitude;
          const noise2 = Math.sin(normalizedX * wave.frequency * 500 + t * wave.speed * 1.3 + waveIndex) * wave.amplitude * 0.5;
          const noise3 = Math.sin(normalizedX * wave.frequency * 2000 + t * wave.speed * 0.7) * wave.amplitude * 0.3;

          // Mouse interaction
          const distFromMouse = Math.abs(normalizedX - mousePos.x);
          const mouseWave = Math.exp(-distFromMouse * 5) * 30 * mouseInfluence;

          const y = waveY + (noise1 + noise2 + noise3) * intensityMod + mouseWave;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.closePath();

        // Create aurora gradient
        const gradient = ctx.createLinearGradient(0, wave.y * h - 100, 0, h);
        const hueShift = Math.sin(t * 0.5 + waveIndex) * 20;
        const currentHue = wave.hue + hueShift;

        gradient.addColorStop(0, `hsla(${currentHue}, 80%, 60%, 0)`);
        gradient.addColorStop(0.2, `hsla(${currentHue}, 80%, 50%, ${wave.opacity * intensityMod * 0.6})`);
        gradient.addColorStop(0.5, `hsla(${currentHue + 30}, 70%, 40%, ${wave.opacity * intensityMod * 0.4})`);
        gradient.addColorStop(1, `hsla(${currentHue + 60}, 60%, 30%, 0)`);

        ctx.fillStyle = gradient;
        ctx.fill();

        // Add glow
        ctx.shadowColor = `hsla(${currentHue}, 80%, 50%, 0.5)`;
        ctx.shadowBlur = 30;
      });
      ctx.shadowBlur = 0;

      // Draw mountains silhouette
      ctx.fillStyle = '#050508';
      ctx.beginPath();
      ctx.moveTo(0, h);

      const mountainPoints = [
        { x: 0, y: h * 0.9 },
        { x: w * 0.1, y: h * 0.75 },
        { x: w * 0.2, y: h * 0.85 },
        { x: w * 0.35, y: h * 0.65 },
        { x: w * 0.5, y: h * 0.8 },
        { x: w * 0.6, y: h * 0.7 },
        { x: w * 0.75, y: h * 0.85 },
        { x: w * 0.85, y: h * 0.72 },
        { x: w, y: h * 0.88 },
      ];

      mountainPoints.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Draw reflection on water
      const waterY = h * 0.92;
      const waterGradient = ctx.createLinearGradient(0, waterY, 0, h);
      waterGradient.addColorStop(0, 'rgba(20, 60, 80, 0.3)');
      waterGradient.addColorStop(1, 'rgba(5, 15, 25, 0.8)');
      ctx.fillStyle = waterGradient;
      ctx.fillRect(0, waterY, w, h - waterY);

      // Aurora reflection in water
      ctx.globalAlpha = 0.15;
      ctx.scale(1, -0.3);
      ctx.translate(0, -h * 4.5);
      wavesRef.current.forEach((wave) => {
        const gradient = ctx.createLinearGradient(0, wave.y * h, 0, h);
        gradient.addColorStop(0, `hsla(${wave.hue}, 60%, 40%, 0.3)`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, wave.y * h, w, h * 0.3);
      });
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [playing, intensity, mousePos]);

  const reset = () => {
    timeRef.current = 0;
    setIntensity(0.7);
    wavesRef.current = Array.from({ length: 8 }, (_, i) => ({
      y: 0.2 + (i * 0.08),
      amplitude: 30 + Math.random() * 40,
      frequency: 0.002 + Math.random() * 0.003,
      speed: 0.5 + Math.random() * 0.5,
      hue: 120 + i * 20 + Math.random() * 30,
      opacity: 0.3 + Math.random() * 0.4,
    }));
  };

  return (
    <div
      className="w-full rounded-lg border overflow-hidden relative"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: '#050510',
        height: '500px',
      }}
    >
      {/* Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Aurora Borealis
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPlaying(!playing)}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'hsla(var(--theme-primary) / 0.2)', color: 'hsl(var(--theme-primary))' }}
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={reset}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'hsla(var(--theme-primary) / 0.2)', color: 'hsl(var(--theme-primary))' }}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Intensity slider */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="flex items-center gap-4">
          <Wind className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
          <input
            type="range"
            min="0.2"
            max="1.5"
            step="0.1"
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
            className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, hsl(var(--theme-primary)), hsl(var(--theme-accent)))` }}
          />
          <span className="text-xs font-mono" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            {Math.round(intensity * 100)}%
          </span>
        </div>
        <p className="text-xs mt-2 text-center" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Move mouse to interact with the aurora
        </p>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onMouseMove={handleMouseMove}
        className="w-full h-full cursor-crosshair"
      />
    </div>
  );
}

export default function NorthernLightsPage() {
  return (
    <ProductPageLayout
      theme="northern-lights"
      targetUser="anyone who needs a moment of wonder"
      problemStatement="We are too busy to notice beauty. The sublime is crowded out by notifications."
      problemContext="Northern lights once meant something. Ancient peoples saw gods dancing. Now we scroll past photos of them without stopping. We live in an age of infinite access to wonder, but we have forgotten how to feel it. The pause, the awe, the reminder that we are small under a vast sky."
      insight="Wonder is not passive. It is a practice. An interactive aurora is not the real thing, but it is an invitation to slow down. To move a cursor slowly and watch colors dance. To remember that beauty exists."
      tradeoffs={['Presence over productivity', 'Awe over efficiency', 'Slowness over speed']}
      appName="Aurora Borealis"
      appDescription="An interactive visualization. Move your mouse to influence the lights."
      principles={[
        {
          title: 'Organic Movement',
          description: 'Multiple sine waves create natural, flowing motion. Nothing mechanical, everything alive.',
        },
        {
          title: 'Responsive Wonder',
          description: 'Mouse interaction creates connection. You are not just watching. You are part of it.',
        },
        {
          title: 'Depth Through Layers',
          description: 'Mountains, reflections, stars. Each layer adds to the sense of being somewhere real.',
        },
        {
          title: 'Color as Emotion',
          description: 'Greens shift to teals shift to blues. The palette evokes the actual phenomenon.',
        },
      ]}
      quote={{
        text: 'The nitrogen in our DNA, the calcium in our teeth, the iron in our blood were made in the interiors of collapsing stars. We are made of star stuff.',
        author: 'Carl Sagan',
      }}
    >
      <AuroraVisualization />

      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Aurora Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Celestial greens and cosmic teals. Click to copy.
        </p>
        <ColorPalette colors={themeColors['northern-lights']} />
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Celestial Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
