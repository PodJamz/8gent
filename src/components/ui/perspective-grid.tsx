'use client';

import { useRef, useEffect, useCallback } from 'react';

interface PerspectiveGridProps {
  className?: string;
  lineColor?: string;
  glowColor?: string;
  vanishY?: number; // 0-1, where 0 is top, 0.5 is middle
  gridLines?: number;
  horizontalLines?: number;
  animated?: boolean;
}

export function PerspectiveGrid({
  className = '',
  lineColor = 'rgba(255, 255, 255, 0.15)',
  glowColor = 'rgba(120, 180, 255, 0.3)',
  vanishY = 0.35,
  gridLines = 24,
  horizontalLines = 12,
  animated = true,
}: PerspectiveGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    ctx.clearRect(0, 0, width, height);

    const vanishX = width / 2;
    const vanishYPos = height * vanishY;

    // Subtle animation offset
    const animOffset = animated ? Math.sin(time * 0.0005) * 0.02 : 0;
    const pulseIntensity = animated ? 0.7 + Math.sin(time * 0.001) * 0.3 : 1;

    // Draw radial lines from vanishing point to bottom edges
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;

    // Vertical lines converging to vanishing point
    for (let i = 0; i <= gridLines; i++) {
      const t = i / gridLines;
      const bottomX = width * t;

      ctx.beginPath();
      ctx.moveTo(vanishX, vanishYPos);
      ctx.lineTo(bottomX, height);
      ctx.stroke();
    }

    // Horizontal lines with perspective spacing (closer together near vanishing point)
    for (let i = 1; i <= horizontalLines; i++) {
      const t = i / horizontalLines;
      // Exponential spacing for perspective effect
      const perspectiveT = Math.pow(t, 1.8 + animOffset);
      const y = vanishYPos + (height - vanishYPos) * perspectiveT;

      // Calculate x intersection points with the outer diagonal lines
      const progress = (y - vanishYPos) / (height - vanishYPos);
      const leftX = vanishX - (vanishX * progress);
      const rightX = vanishX + (vanishX * progress);

      ctx.beginPath();
      ctx.moveTo(leftX, y);
      ctx.lineTo(rightX, y);
      ctx.stroke();
    }

    // Add subtle glow at vanishing point
    const gradient = ctx.createRadialGradient(
      vanishX, vanishYPos, 0,
      vanishX, vanishYPos, height * 0.4
    );
    gradient.addColorStop(0, glowColor.replace(/[\d.]+\)$/, `${0.4 * pulseIntensity})`));
    gradient.addColorStop(0.5, glowColor.replace(/[\d.]+\)$/, `${0.1 * pulseIntensity})`));
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

  }, [lineColor, glowColor, vanishY, gridLines, horizontalLines, animated]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      draw(ctx, rect.width, rect.height, timeRef.current);
    };

    const animate = (time: number) => {
      timeRef.current = time;
      const rect = canvas.getBoundingClientRect();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const dpr = Math.min(window.devicePixelRatio, 2);
      ctx.scale(dpr, dpr);
      draw(ctx, rect.width, rect.height, time);
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();

    if (animated) {
      animationRef.current = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw, animated]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
}
