'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, Upload, Download, RotateCcw, Compass, BookOpen, Palette } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';

function PortraitSketchGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [style, setStyle] = useState<'warm' | 'cool' | 'vibrant'>('warm');
  const [lineIntensity, setLineIntensity] = useState(0.6);
  const [colorSaturation, setColorSaturation] = useState(0.7);
  const [showWebcam, setShowWebcam] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const stylePresets = {
    warm: { primary: [230, 140, 60], secondary: [50, 80, 160], accent: [200, 70, 70] },
    cool: { primary: [60, 140, 180], secondary: [100, 80, 160], accent: [180, 200, 220] },
    vibrant: { primary: [255, 100, 80], secondary: [80, 100, 200], accent: [255, 200, 50] },
  };

  // Apply sketch effect
  const applySketchEffect = useCallback((sourceCanvas: HTMLCanvasElement, targetCanvas: HTMLCanvasElement) => {
    const ctx = targetCanvas.getContext('2d');
    const srcCtx = sourceCanvas.getContext('2d');
    if (!ctx || !srcCtx) return;

    const w = targetCanvas.width;
    const h = targetCanvas.height;
    const colors = stylePresets[style];

    // Get image data
    const imageData = srcCtx.getImageData(0, 0, w, h);
    const data = imageData.data;

    // Create edge detection
    const edges = new Uint8ClampedArray(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;
        const idxTop = ((y - 1) * w + x) * 4;
        const idxBot = ((y + 1) * w + x) * 4;
        const idxLeft = (y * w + (x - 1)) * 4;
        const idxRight = (y * w + (x + 1)) * 4;

        const gx = -data[idxLeft] + data[idxRight] - data[idxLeft + 1] + data[idxRight + 1] - data[idxLeft + 2] + data[idxRight + 2];
        const gy = -data[idxTop] + data[idxBot] - data[idxTop + 1] + data[idxBot + 1] - data[idxTop + 2] + data[idxBot + 2];

        edges[y * w + x] = Math.min(255, Math.sqrt(gx * gx + gy * gy) / 3);
      }
    }

    // Clear with cream background
    ctx.fillStyle = '#F5EFE6';
    ctx.fillRect(0, 0, w, h);

    // Add paper texture
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = `rgba(200, 180, 160, ${Math.random() * 0.03})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }

    // Draw colored regions first
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const idx = (y * w + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = (r + g + b) / 3;

        // Determine color based on tone
        let color: number[];
        if (r > g && r > b) {
          color = colors.primary;
        } else if (b > r && b > g) {
          color = colors.secondary;
        } else {
          color = colors.accent;
        }

        // Apply with saturation control
        const alpha = (1 - brightness / 255) * colorSaturation * 0.4;
        if (alpha > 0.05) {
          ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;

          // Pencil-like strokes
          const strokeLength = 3 + Math.random() * 5;
          const angle = Math.random() * Math.PI * 0.3 - Math.PI * 0.15;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.fillRect(-strokeLength / 2, -0.5, strokeLength, 1);
          ctx.restore();
        }
      }
    }

    // Draw sketch lines
    ctx.strokeStyle = `rgba(40, 40, 60, ${lineIntensity})`;
    ctx.lineWidth = 0.5;

    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const edge = edges[y * w + x];
        if (edge > 30) {
          const strokeProb = (edge / 255) * lineIntensity;
          if (Math.random() < strokeProb) {
            ctx.beginPath();
            const len = 2 + Math.random() * 4;
            const angle = Math.random() * Math.PI * 2;
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
            ctx.stroke();
          }
        }
      }
    }

    // Add hatching for dark areas
    for (let y = 0; y < h; y += 4) {
      for (let x = 0; x < w; x += 4) {
        const idx = (y * w + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;

        if (brightness < 100) {
          const density = (1 - brightness / 100) * lineIntensity;
          ctx.strokeStyle = `rgba(30, 30, 50, ${density * 0.3})`;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 4, y + 4);
          ctx.stroke();
        }
      }
    }

    // Subtle vignette
    const gradient = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.7);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, 'rgba(200, 180, 160, 0.2)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

  }, [style, lineIntensity, colorSaturation]);

  // Process image
  useEffect(() => {
    if (!image) return;
    const canvas = canvasRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;
    if (!canvas || !hiddenCanvas) return;

    setIsProcessing(true);

    // Set dimensions
    const maxSize = 400;
    const ratio = Math.min(maxSize / image.width, maxSize / image.height);
    const w = Math.floor(image.width * ratio);
    const h = Math.floor(image.height * ratio);

    canvas.width = w;
    canvas.height = h;
    hiddenCanvas.width = w;
    hiddenCanvas.height = h;

    // Draw original to hidden canvas
    const hiddenCtx = hiddenCanvas.getContext('2d');
    if (hiddenCtx) {
      hiddenCtx.drawImage(image, 0, 0, w, h);
      applySketchEffect(hiddenCanvas, canvas);
    }

    setIsProcessing(false);
  }, [image, applySketchEffect]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => setImage(img);
    img.src = URL.createObjectURL(file);
  };

  // Webcam capture
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setShowWebcam(true);
      }
    } catch (err) {
      console.error('Webcam error:', err);
    }
  };

  const captureWebcam = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    const ctx = tempCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setShowWebcam(false);
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(t => t.stop());
      };
      img.src = tempCanvas.toDataURL();
    }
  };

  // Download result
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'field-guide-portrait.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      className="w-full border-2 overflow-hidden"
      style={{
        borderColor: 'hsl(var(--theme-primary))',
        backgroundColor: 'hsl(var(--theme-card))',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b-2"
        style={{ borderColor: 'hsl(var(--theme-primary))' }}
      >
        <div className="flex items-center gap-3">
          <Compass className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-medium tracking-wider uppercase" style={{ color: 'hsl(var(--theme-primary))' }}>
            Portrait Sketch Studio
          </span>
        </div>
        <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Article #01
        </span>
      </div>

      {/* Main Content */}
      <div className="p-5">
        {/* Canvas Area */}
        <div
          className="relative mb-5 border-2 flex items-center justify-center overflow-hidden"
          style={{
            borderColor: 'hsl(var(--theme-primary))',
            backgroundColor: '#F5EFE6',
            minHeight: '350px'
          }}
        >
          {showWebcam ? (
            <div className="relative">
              <video ref={videoRef} className="max-w-full max-h-[350px]" />
              <button
                onClick={captureWebcam}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 text-sm font-medium border-2 transition-all hover:opacity-80"
                style={{
                  borderColor: 'hsl(var(--theme-primary))',
                  backgroundColor: 'hsl(var(--theme-primary))',
                  color: 'hsl(var(--theme-primary-foreground))',
                }}
              >
                Capture
              </button>
            </div>
          ) : image ? (
            <>
              <canvas ref={canvasRef} className="max-w-full max-h-[350px]" />
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span style={{ color: 'hsl(var(--theme-primary))' }}>Processing...</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: 'hsl(var(--theme-primary))' }} />
              <p className="text-sm mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                Upload a photo or use your camera
              </p>
              <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                Transform into a field guide illustration
              </p>
            </div>
          )}
          <canvas ref={hiddenCanvasRef} className="hidden" />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-2 transition-all hover:opacity-80"
            style={{
              borderColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary))',
            }}
          >
            <Upload className="w-4 h-4" />
            Upload Photo
          </button>
          <button
            onClick={startWebcam}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-2 transition-all hover:opacity-80"
            style={{
              borderColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary))',
            }}
          >
            <Camera className="w-4 h-4" />
            Use Camera
          </button>
          {image && (
            <button
              onClick={downloadImage}
              className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-2 transition-all hover:opacity-80"
              style={{
                borderColor: 'hsl(var(--theme-primary))',
                backgroundColor: 'hsl(var(--theme-primary))',
                color: 'hsl(var(--theme-primary-foreground))',
              }}
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Style Selection */}
        <div className="mb-4">
          <label className="text-xs font-medium mb-2 block uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Color Palette
          </label>
          <div className="flex gap-2">
            {(['warm', 'cool', 'vibrant'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className="flex-1 px-3 py-2 text-xs font-medium uppercase border-2 transition-all"
                style={{
                  borderColor: 'hsl(var(--theme-primary))',
                  backgroundColor: style === s ? 'hsl(var(--theme-primary))' : 'transparent',
                  color: style === s ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-primary))',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium mb-2 flex justify-between uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              <span>Line Intensity</span>
              <span>{Math.round(lineIntensity * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.1"
              value={lineIntensity}
              onChange={(e) => setLineIntensity(parseFloat(e.target.value))}
              className="w-full h-2 appearance-none cursor-pointer rounded"
              style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-2 flex justify-between uppercase tracking-wider" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              <span>Color Saturation</span>
              <span>{Math.round(colorSaturation * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.1"
              value={colorSaturation}
              onChange={(e) => setColorSaturation(parseFloat(e.target.value))}
              className="w-full h-2 appearance-none cursor-pointer rounded"
              style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
            />
          </div>
        </div>

        {/* Reset */}
        {image && (
          <button
            onClick={() => setImage(null)}
            className="mt-4 flex items-center gap-2 text-xs uppercase tracking-wider"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            <RotateCcw className="w-3 h-3" />
            Start Over
          </button>
        )}
      </div>

      {/* Footer Attribution */}
      <div
        className="px-5 py-3 border-t-2 text-xs"
        style={{
          borderColor: 'hsl(var(--theme-primary))',
          color: 'hsl(var(--theme-muted-foreground))',
        }}
      >
        Inspired by colored pencil field guide illustrations
      </div>
    </div>
  );
}

// Add field-guide colors to the palette
const fieldGuideColors = [
  { name: 'Cream', hex: '#F5EFE6', hsl: '45 35% 94%' },
  { name: 'Editorial Red', hex: '#E63946', hsl: '355 78% 50%' },
  { name: 'Warm Orange', hex: '#E68A3C', hsl: '30 78% 57%' },
  { name: 'Deep Blue', hex: '#324A80', hsl: '220 45% 35%' },
  { name: 'Sketch Gray', hex: '#2A2A3C', hsl: '240 18% 20%' },
  { name: 'Paper Tan', hex: '#E8DFD0', hsl: '38 35% 86%' },
];

export default function FieldGuidePage() {
  return (
    <ProductPageLayout
      theme="field-guide"
      targetUser="designers navigating the AI frontier"
      problemStatement="Design is entering its most transformative era since the Bauhaus. Who will document it?"
      problemContext="The rise of AI tools is creating a new role: the Model Designer. Someone who understands both visual systems and language models. Who can prompt, fine-tune, and direct machine creativity. This is uncharted territory, and like any frontier, it needs a field guide."
      insight="The best design documentation has always been part manifesto, part manual. The Bauhaus had its workshops. The web had A List Apart. AI design needs its own voice: editorial, opinionated, and beautifully illustrated."
      tradeoffs={['Editorial over neutral', 'Illustrated over photographic', 'Opinionated over comprehensive']}
      appName="Portrait Sketch Studio"
      appDescription="Transform photos into field guide-style colored pencil illustrations"
      principles={[
        {
          title: 'Warm Cream Backgrounds',
          description: 'A paper-like base that feels printed, tactile, and timeless. Not cold white, but the warm tone of quality stock.',
        },
        {
          title: 'Editorial Red Accents',
          description: 'Bold red for borders, headlines, and emphasis. Commands attention like a magazine masthead.',
        },
        {
          title: 'Hand-Drawn Illustration',
          description: 'Colored pencil portraits add personality and craft. Each subject rendered as if for a field guide specimen.',
        },
        {
          title: 'Clear Information Hierarchy',
          description: 'Article numbers, categories, and coming soon previews. The structure of a serial publication.',
        },
      ]}
      quote={{
        text: 'The model designer is part creative director, part prompt engineer, part curator of machine creativity.',
        author: 'The AI Design Field Guide',
      }}
      headerRightContent={
        <a
          href="http://www.federicovillaw.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium hover:underline flex items-center gap-1"
          style={{ color: 'hsl(var(--theme-primary))' }}
        >
          <span>Design by Federico Villa</span>
          <span className="opacity-50">↗</span>
        </a>
      }
    >
      <PortraitSketchGenerator />

      <div className="mt-16">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          <h3
            className="text-xl font-medium uppercase tracking-wider"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            Color Specimens
          </h3>
        </div>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          The palette of the AI Design Field Guide. Warm, editorial, and distinctive.
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {fieldGuideColors.map((color) => (
            <button
              key={color.hex}
              onClick={() => navigator.clipboard.writeText(color.hex)}
              className="group text-left"
            >
              <div
                className="aspect-square rounded border-2 mb-2 transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: color.hex,
                  borderColor: 'hsl(var(--theme-primary))',
                }}
              />
              <div className="text-xs font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                {color.name}
              </div>
              <div className="text-xs font-mono" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                {color.hex}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Coming Soon Section - echoing the original design */}
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          <h3
            className="text-xl font-medium uppercase tracking-wider"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            Coming Soon
          </h3>
        </div>
        <div className="space-y-3">
          {[
            { num: '#02', title: 'Prompt as Interface', author: 'On language as the new design tool' },
            { num: '#03', title: 'The Taste Layer', author: 'How models learn aesthetic judgment' },
            { num: '#04', title: 'Generative Systems', author: 'Building with probabilistic design' },
          ].map((article) => (
            <div
              key={article.num}
              className="flex items-center gap-4 px-4 py-3 border-2"
              style={{ borderColor: 'hsl(var(--theme-primary))' }}
            >
              <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-primary))' }}>
                {article.num}
              </span>
              <div>
                <div className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                  {article.title}
                </div>
                <div className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  {article.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProductPageLayout>
  );
}
