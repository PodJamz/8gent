'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, RotateCcw, Type, Palette, Download } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';

const denimColors = [
  { name: 'Deep Indigo', hex: '#2E4A7D', hsl: '228 45% 34%' },
  { name: 'Denim Blue', hex: '#3D5A96', hsl: '225 42% 42%' },
  { name: 'Washed Blue', hex: '#5B7AB8', hsl: '225 42% 54%' },
  { name: 'Faded Denim', hex: '#8BA3D4', hsl: '225 48% 68%' },
  { name: 'Cream', hex: '#F5F0E8', hsl: '40 35% 93%' },
  { name: 'Warm White', hex: '#FAF8F5', hsl: '36 38% 97%' },
];

// Interactive Matchbook Studio Component
function MatchbookStudio() {
  const [brandName, setBrandName] = useState('BRAND');
  const [tagline, setTagline] = useState('Studio');
  const [year, setYear] = useState('2026');
  const [copied, setCopied] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const presets = [
    { brand: 'BRAND', tagline: 'Studio', year: '2026' },
    { brand: 'DENIM', tagline: 'Collective', year: '2026' },
    { brand: 'INDIGO', tagline: 'Press', year: '2026' },
    { brand: 'BLUE', tagline: 'Works', year: '2026' },
  ];

  const exportCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${brandName.toLowerCase()}-matchbook.png`;
        a.click();
        URL.revokeObjectURL(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  }, [brandName]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Deep indigo background
    ctx.fillStyle = '#2E4A7D';
    ctx.fillRect(0, 0, w, h);

    // Subtle texture overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.fillRect(x, y, 1, 1);
    }

    // Brand name - bold geometric sans
    ctx.fillStyle = '#F5F0E8';
    ctx.font = 'bold 48px "DM Sans", "Inter", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brandName.toUpperCase(), w / 2, h * 0.38);

    // Tagline - elegant italic script style
    ctx.font = 'italic 32px "Playfair Display", Georgia, serif';
    ctx.fillText(tagline, w / 2, h * 0.52);

    // Divider line
    ctx.strokeStyle = 'rgba(245, 240, 232, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.65);
    ctx.lineTo(w * 0.7, h * 0.65);
    ctx.stroke();

    // Year / copyright
    ctx.font = '14px "DM Sans", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(245, 240, 232, 0.7)';
    ctx.fillText(`© ${year}`, w / 2, h * 0.78);

    // Subtle corner accent
    ctx.strokeStyle = 'rgba(245, 240, 232, 0.1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, w - 30, h - 30);

  }, [brandName, tagline, year]);

  return (
    <div
      className="w-full rounded-xl border overflow-hidden"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-3">
          <Type className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span
            className="text-sm tracking-wide"
            style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
          >
            Matchbook Studio
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all hover:opacity-90"
            style={{
              backgroundColor: copied ? 'hsl(var(--theme-primary))' : 'transparent',
              color: copied ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-primary))',
              border: '1px solid hsl(var(--theme-primary))',
            }}
          >
            {copied ? <Check className="w-3 h-3" /> : <Download className="w-3 h-3" />}
            {copied ? 'Saved' : 'Export'}
          </button>
          <button
            onClick={() => {
              setBrandName('BRAND');
              setTagline('Studio');
              setYear('2026');
            }}
            className="p-1.5 rounded-md transition-all hover:opacity-70"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row">
        {/* Canvas preview */}
        <div className="flex-1 p-6 flex items-center justify-center" style={{ minHeight: '360px' }}>
          <motion.div
            className="relative cursor-pointer"
            onClick={() => setFlipped(!flipped)}
            style={{ perspective: '1000px' }}
          >
            {/* Matchbook shadow */}
            <div
              className="absolute inset-0 rounded-lg blur-2xl opacity-40"
              style={{
                background: 'linear-gradient(145deg, #2E4A7D 0%, #1a2d4d 100%)',
                transform: 'translateY(20px) scale(0.9)',
              }}
            />

            {/* Matchbook container with 3D flip */}
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front - Canvas */}
              <div style={{ backfaceVisibility: 'hidden' }}>
                <canvas
                  ref={canvasRef}
                  width={280}
                  height={360}
                  className="rounded-lg"
                  style={{
                    boxShadow: `
                      0 25px 50px -12px rgba(0, 0, 0, 0.4),
                      0 0 0 1px rgba(255, 255, 255, 0.05)
                    `,
                  }}
                />
              </div>

              {/* Back - Strike surface */}
              <motion.div
                className="absolute inset-0 rounded-lg flex items-center justify-center"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  backgroundColor: '#1a2d4d',
                  boxShadow: `
                    0 25px 50px -12px rgba(0, 0, 0, 0.4),
                    0 0 0 1px rgba(255, 255, 255, 0.05)
                  `,
                }}
              >
                {/* Strike strip texture */}
                <div
                  className="w-4/5 h-6 rounded-sm"
                  style={{
                    background: 'linear-gradient(90deg, #8B4513 0%, #654321 50%, #8B4513 100%)',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Flip hint */}
            <p
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Click to flip
            </p>
          </motion.div>
        </div>

        {/* Controls */}
        <div
          className="lg:w-72 p-6 space-y-5 border-t lg:border-t-0 lg:border-l"
          style={{ borderColor: 'hsl(var(--theme-border))' }}
        >
          {/* Brand name input */}
          <div>
            <label
              className="text-xs uppercase tracking-wider mb-2 block"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Brand Name
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value.toUpperCase())}
              maxLength={12}
              className="w-full px-3 py-2 text-sm rounded-md bg-transparent border outline-none transition-all focus:ring-1"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font)',
              }}
              placeholder="BRAND"
            />
          </div>

          {/* Tagline input */}
          <div>
            <label
              className="text-xs uppercase tracking-wider mb-2 block"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              maxLength={16}
              className="w-full px-3 py-2 text-sm rounded-md bg-transparent border outline-none transition-all focus:ring-1 italic"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
              placeholder="Studio"
            />
          </div>

          {/* Year input */}
          <div>
            <label
              className="text-xs uppercase tracking-wider mb-2 block"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Year
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              maxLength={4}
              className="w-full px-3 py-2 text-sm rounded-md bg-transparent border outline-none transition-all focus:ring-1"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font)',
              }}
              placeholder="2026"
            />
          </div>

          {/* Presets */}
          <div>
            <label
              className="text-xs uppercase tracking-wider mb-2 block"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.brand}
                  onClick={() => {
                    setBrandName(preset.brand);
                    setTagline(preset.tagline);
                    setYear(preset.year);
                  }}
                  className="px-3 py-2 text-xs rounded-md transition-all hover:opacity-80"
                  style={{
                    backgroundColor:
                      brandName === preset.brand
                        ? 'hsl(var(--theme-primary))'
                        : 'hsl(var(--theme-secondary))',
                    color:
                      brandName === preset.brand
                        ? 'hsl(var(--theme-primary-foreground))'
                        : 'hsl(var(--theme-secondary-foreground))',
                  }}
                >
                  {preset.brand}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Typography specimen component
function TypographySpecimen() {
  const [sampleText, setSampleText] = useState('The quick brown fox');

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
      }}
    >
      <div
        className="px-6 py-4 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center justify-between">
          <h3
            className="text-sm tracking-wide"
            style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
          >
            Typography Specimen
          </h3>
          <input
            type="text"
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-md bg-transparent border outline-none w-48"
            style={{
              borderColor: 'hsl(var(--theme-border))',
              color: 'hsl(var(--theme-foreground))',
            }}
            placeholder="Sample text..."
          />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Heading font */}
        <div>
          <p
            className="text-xs uppercase tracking-wider mb-3"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            Playfair Display — Headings
          </p>
          <div className="space-y-2">
            <h1
              className="text-5xl italic"
              style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
            >
              {sampleText}
            </h1>
            <h2
              className="text-3xl"
              style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font-heading)' }}
            >
              {sampleText}
            </h2>
            <h3
              className="text-xl italic"
              style={{ color: 'hsl(var(--theme-muted-foreground))', fontFamily: 'var(--theme-font-heading)' }}
            >
              {sampleText}
            </h3>
          </div>
        </div>

        {/* Body font */}
        <div>
          <p
            className="text-xs uppercase tracking-wider mb-3"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            DM Sans — Body
          </p>
          <div className="space-y-2">
            <p
              className="text-lg font-medium"
              style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font)' }}
            >
              {sampleText}
            </p>
            <p
              className="text-base"
              style={{ color: 'hsl(var(--theme-foreground))', fontFamily: 'var(--theme-font)' }}
            >
              {sampleText}
            </p>
            <p
              className="text-sm"
              style={{ color: 'hsl(var(--theme-muted-foreground))', fontFamily: 'var(--theme-font)' }}
            >
              {sampleText}
            </p>
          </div>
        </div>

        {/* Mixed usage */}
        <div
          className="p-6 rounded-lg"
          style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}
        >
          <p className="text-xs uppercase tracking-wider mb-2 opacity-70">Mixed Usage</p>
          <h4
            className="text-2xl italic mb-2"
            style={{ fontFamily: 'var(--theme-font-heading)' }}
          >
            Refined Elegance
          </h4>
          <p className="text-sm opacity-90" style={{ fontFamily: 'var(--theme-font)' }}>
            The pairing of geometric sans-serif body text with elegant serif headlines creates
            the tension that defines sophisticated brand design.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DenimPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <ProductPageLayout
      theme="denim"
      targetUser="brand designers and creative studios"
      problemStatement="How do you create a visual identity that feels both timeless and contemporary?"
      problemContext="Brand design walks a fine line between classic sophistication and modern relevance. Too traditional feels dated, too trendy feels disposable. The best brand identities find that sweet spot where elegance meets edge."
      insight="Denim has solved this problem for over a century. Raw indigo that fades beautifully with use. Workwear roots that translate to high fashion. The key is in the contrast: bold blues against warm creams, geometric precision softened by serif elegance."
      tradeoffs={['Sophistication over simplicity', 'Warmth over coldness', 'Contrast over uniformity']}
      appName="Brand Studio"
      appDescription="A design system built on the timeless appeal of deep indigo and elegant typography"
      principles={[
        {
          title: 'Deep Indigo Foundation',
          description: 'Rich ultramarine blues that anchor the design with confidence and depth. Not navy, not royal. The exact shade of raw selvedge denim.',
        },
        {
          title: 'Warm Cream Contrast',
          description: 'Text and accents in warm off-whites that feel printed rather than digital. The warmth of quality paper stock.',
        },
        {
          title: 'Mixed Typography',
          description: 'Clean geometric sans-serif for body text paired with elegant serifs for headlines. The tension creates visual interest.',
        },
        {
          title: 'Editorial Restraint',
          description: 'White space is generous. Elements breathe. Every detail earns its place through purpose, not decoration.',
        },
      ]}
      quote={{
        text: 'Refined craftsmanship speaks through restraint.',
        author: 'Brand Studio Principle',
      }}
    >
      {/* Interactive Matchbook Studio */}
      <MatchbookStudio />

      {/* Color palette section */}
      <div className="mt-16">
        <h3
          className="text-xl mb-4"
          style={{
            color: 'hsl(var(--theme-foreground))',
            fontFamily: 'var(--theme-font-heading)',
          }}
        >
          Color Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          From raw indigo to warm cream—the full spectrum of denim. Click to copy hex values.
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {denimColors.map((color) => (
            <button
              key={color.hex}
              onClick={() => copyColor(color.hex)}
              className="group text-left relative"
            >
              <div
                className="aspect-square rounded-lg mb-2 transition-all group-hover:scale-105 group-hover:shadow-lg border relative overflow-hidden"
                style={{
                  backgroundColor: color.hex,
                  borderColor: 'hsl(var(--theme-border))',
                }}
              >
                <AnimatePresence>
                  {copiedColor === color.hex && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    >
                      <Check className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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

      {/* Typography specimen */}
      <div className="mt-16">
        <TypographySpecimen />
      </div>

      {/* Brand application examples */}
      <div className="mt-16">
        <h3
          className="text-xl mb-4"
          style={{
            color: 'hsl(var(--theme-foreground))',
            fontFamily: 'var(--theme-font-heading)',
          }}
        >
          Brand Applications
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          How the system translates across touchpoints.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Business card mockup */}
          <div
            className="aspect-[1.6/1] rounded-lg p-6 flex flex-col justify-between"
            style={{ backgroundColor: '#2E4A7D' }}
          >
            <div>
              <p className="text-white text-lg font-bold" style={{ fontFamily: 'var(--theme-font)' }}>
                OPENCLAW-OS
              </p>
              <p className="text-white/70 text-xs italic" style={{ fontFamily: 'var(--theme-font-heading)' }}>
                Creative Director
              </p>
            </div>
            <p className="text-white/50 text-xs" style={{ fontFamily: 'var(--theme-font)' }}>
              studio@example.com
            </p>
          </div>

          {/* Letterhead mockup */}
          <div
            className="aspect-[1.6/1] rounded-lg p-6 flex flex-col border"
            style={{
              backgroundColor: '#FAF8F5',
              borderColor: 'hsl(var(--theme-border))',
            }}
          >
            <p className="text-[#2E4A7D] text-sm font-bold tracking-wider" style={{ fontFamily: 'var(--theme-font)' }}>
              BRAND STUDIO
            </p>
            <div className="flex-1 flex items-center">
              <div className="w-full h-px bg-[#2E4A7D]/20" />
            </div>
            <p className="text-[#2E4A7D]/50 text-xs" style={{ fontFamily: 'var(--theme-font)' }}>
              © 2026
            </p>
          </div>

          {/* Stamp/seal mockup */}
          <div
            className="aspect-[1.6/1] rounded-lg p-6 flex items-center justify-center border"
            style={{
              backgroundColor: 'hsl(var(--theme-card))',
              borderColor: 'hsl(var(--theme-border))',
            }}
          >
            <div
              className="w-24 h-24 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: '#2E4A7D' }}
            >
              <div className="text-center">
                <p className="text-xs font-bold" style={{ color: '#2E4A7D', fontFamily: 'var(--theme-font)' }}>
                  BRAND
                </p>
                <p className="text-xs italic" style={{ color: '#2E4A7D', fontFamily: 'var(--theme-font-heading)' }}>
                  Studio
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProductPageLayout>
  );
}
