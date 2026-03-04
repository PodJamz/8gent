'use client';

import { useRef, useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Dock } from '@/components/dock/Dock';

/**
 * Draw Page - Simple Drawing Canvas
 */

const COLORS = ['#000000', '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#5856D6', '#AF52DE', '#FF2D55'];
const SIZES = [4, 8, 16, 24];

export default function DrawPage() {
  const { settings } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(8);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const primaryColor = settings.primaryColor || '#4CAF50';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, rect.width, rect.height);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDrawing(true);
    lastPosRef.current = getPos(e);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPosRef.current = pos;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  return (
    <div className="h-screen flex flex-col bg-[#f2f2f7] overflow-hidden">
      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl safe-top"
        style={{ backgroundColor: `${primaryColor}F2` }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-[18px] font-semibold text-white">
            {settings.childName ? `${settings.childName}'s Art` : 'Draw'}
          </span>
          <button
            onClick={clearCanvas}
            className="px-4 py-1.5 bg-white/20 text-white rounded-full text-[15px] font-medium active:bg-white/30"
          >
            Clear
          </button>
        </div>
      </header>

      {/* Canvas */}
      <div className="flex-1 p-2 pb-32">
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-white rounded-2xl shadow-sm touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Tools */}
      <div className="fixed bottom-20 left-0 right-0 px-4 z-30">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-3 flex items-center gap-4">
          {/* Colors */}
          <div className="flex-1 flex gap-1.5 overflow-x-auto">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full flex-shrink-0 transition-transform ${
                  color === c ? 'scale-125 ring-2 ring-offset-2 ring-gray-300' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          {/* Sizes */}
          <div className="flex gap-1.5 border-l border-gray-200 pl-3">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  size === s ? 'bg-gray-200' : ''
                }`}
              >
                <div
                  className="rounded-full bg-black"
                  style={{ width: s, height: s }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dock */}
      <Dock primaryColor={primaryColor} />
    </div>
  );
}
