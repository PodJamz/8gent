'use client';
import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Coffee, Heart, Droplets, Timer, Thermometer, Sparkles, Loader2 } from 'lucide-react';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';
import '@/lib/themes/themes.css';

// AI-Powered Coffee Brewing Calculator
interface CoffeeSuggestion {
  drink: string;
  description: string;
  tip: string;
  emoji: string;
}

function CoffeeBrewingCalculator() {
  const [coffeeGrams, setCoffeeGrams] = useState(18);
  const [brewMethod, setBrewMethod] = useState<'pourover' | 'french' | 'espresso' | 'aeropress'>('pourover');
  const [brewing, setBrewing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [mood, setMood] = useState('');
  const [suggestion, setSuggestion] = useState<CoffeeSuggestion | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const brewSettings = {
    pourover: { ratio: 16, temp: 96, time: 180, name: 'Pour Over' },
    french: { ratio: 15, temp: 93, time: 240, name: 'French Press' },
    espresso: { ratio: 2, temp: 92, time: 25, name: 'Espresso' },
    aeropress: { ratio: 12, temp: 85, time: 90, name: 'AeroPress' },
  };

  const currentSettings = brewSettings[brewMethod];
  const waterAmount = coffeeGrams * currentSettings.ratio;

  const getSuggestion = useCallback(async () => {
    if (!mood.trim() || loadingSuggestion) return;
    setLoadingSuggestion(true);
    setSuggestion(null);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'coffee-mood',
          prompt: mood,
        }),
      });

      if (!response.ok) throw new Error('Failed to get suggestion');

      const data = await response.json();
      if (!data.error) {
        setSuggestion({
          drink: data.drink || 'Classic Latte',
          description: data.description || 'A warm, comforting choice.',
          tip: data.tip || 'Use fresh beans for best results.',
          emoji: data.emoji || '☕',
        });
      }
    } catch (err) {
      console.error('Failed to get coffee suggestion');
    } finally {
      setLoadingSuggestion(false);
    }
  }, [mood, loadingSuggestion]);

  const startBrewing = useCallback(() => {
    if (brewing) return;
    setBrewing(true);
    setProgress(0);
    setComplete(false);

    const duration = currentSettings.time * 10;
    const interval = 50;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setProgress((step / steps) * 100);
      if (step >= steps) {
        clearInterval(timer);
        setBrewing(false);
        setComplete(true);
      }
    }, interval);
  }, [brewing, currentSettings.time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div
      className="w-full rounded-2xl border overflow-hidden"
      style={{
        borderColor: 'hsl(var(--theme-border))',
        backgroundColor: 'hsl(var(--theme-card))',
        height: '480px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="flex items-center gap-2">
          <Coffee className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            AI Brew Calculator
          </span>
        </div>
        <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Perfect Ratio
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4" style={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}>
        {/* AI Mood Input */}
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
            <span className="text-xs font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
              How are you feeling?
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g., tired, cozy, energetic..."
              className="flex-1 px-3 py-2 text-xs rounded-lg border-0 outline-none"
              style={{
                backgroundColor: 'hsl(var(--theme-background))',
                color: 'hsl(var(--theme-foreground))',
              }}
              onKeyDown={(e) => e.key === 'Enter' && getSuggestion()}
            />
            <button
              onClick={getSuggestion}
              disabled={loadingSuggestion || !mood.trim()}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80 disabled:opacity-50"
              style={{
                backgroundColor: 'hsl(var(--theme-primary))',
                color: 'hsl(var(--theme-primary-foreground))',
              }}
            >
              {loadingSuggestion ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Ask AI'}
            </button>
          </div>
          <AnimatePresence>
            {suggestion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 rounded-lg"
                style={{ backgroundColor: 'hsl(var(--theme-background))' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{suggestion.emoji}</span>
                  <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    {suggestion.drink}
                  </span>
                </div>
                <p className="text-xs mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  {suggestion.description}
                </p>
                <p className="text-xs italic" style={{ color: 'hsl(var(--theme-primary))' }}>
                  💡 {suggestion.tip}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Method Selection */}
        <div>
          <label className="text-xs uppercase tracking-wide mb-2 block" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Brew Method
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(brewSettings) as Array<keyof typeof brewSettings>).map((method) => (
              <button
                key={method}
                onClick={() => { setBrewMethod(method); setComplete(false); }}
                className="px-2 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: brewMethod === method ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-secondary))',
                  color: brewMethod === method ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-secondary-foreground))',
                }}
              >
                {brewSettings[method].name}
              </button>
            ))}
          </div>
        </div>

        {/* Coffee Amount Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs uppercase tracking-wide" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Coffee
            </label>
            <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
              {coffeeGrams}g
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="50"
            value={coffeeGrams}
            onChange={(e) => { setCoffeeGrams(Number(e.target.value)); setComplete(false); }}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
          />
        </div>

        {/* Recipe Output */}
        <div
          className="grid grid-cols-3 gap-3 p-4 rounded-xl"
          style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
        >
          <div className="text-center">
            <Droplets className="w-4 h-4 mx-auto mb-1" style={{ color: 'hsl(var(--theme-primary))' }} />
            <p className="text-lg font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
              {waterAmount}ml
            </p>
            <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Water</p>
          </div>
          <div className="text-center">
            <Thermometer className="w-4 h-4 mx-auto mb-1" style={{ color: 'hsl(var(--theme-primary))' }} />
            <p className="text-lg font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
              {currentSettings.temp}°C
            </p>
            <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Temp</p>
          </div>
          <div className="text-center">
            <Timer className="w-4 h-4 mx-auto mb-1" style={{ color: 'hsl(var(--theme-primary))' }} />
            <p className="text-lg font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
              {formatTime(currentSettings.time)}
            </p>
            <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Time</p>
          </div>
        </div>

        {/* Brew Progress / Button */}
        <div>
          {brewing ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                <span>Brewing...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: 'hsl(var(--theme-secondary))' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : complete ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-2"
            >
              <Heart className="w-6 h-6 mx-auto mb-1" style={{ color: 'hsl(var(--theme-primary))' }} />
              <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                Perfect brew ready!
              </p>
              <button
                onClick={() => setComplete(false)}
                className="mt-1 text-xs underline"
                style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              >
                Brew again
              </button>
            </motion.div>
          ) : (
            <button
              onClick={startBrewing}
              className="w-full py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90"
              style={{
                backgroundColor: 'hsl(var(--theme-primary))',
                color: 'hsl(var(--theme-primary-foreground))',
              }}
            >
              Start Brewing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MochaMoussePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const watchDNA = useMemo(() => themeToWatch('mocha-mousse'), []);

  return (
    <div
      ref={containerRef}
      data-design-theme="mocha-mousse"
      className="min-h-screen relative"
      style={{ backgroundColor: 'hsl(var(--theme-background))', fontFamily: 'var(--theme-font)' }}
    >
      <motion.div
        className="fixed top-14 left-0 right-0 h-[2px] z-40 origin-left"
        style={{ scaleX: scrollYProgress, backgroundColor: 'hsl(var(--theme-primary))' }}
      />

      <DesignHeader
        currentTheme="mocha-mousse"
        backHref="/design"
        backText="Gallery"
        rightContent={
          <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Organic Design
          </span>
        }
      />

      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center">
        <div className="max-w-4xl mx-auto px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Coffee className="w-10 h-10 mb-6" style={{ color: 'hsl(var(--theme-primary))' }} />
            <h1 className="text-5xl md:text-7xl font-medium leading-tight mb-8" style={{ color: 'hsl(var(--theme-foreground))' }}>
              Coffee Comfort
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl mb-12" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Warm browns and creams. Mocha Mousse wraps digital interfaces in the comfort of your favorite coffee shop. Rich, inviting, and perfectly smooth.
            </p>
            <div className="grid grid-cols-3 gap-8 border-t pt-8" style={{ borderColor: 'hsl(var(--theme-border))' }}>
              <div>
                <p className="text-3xl font-medium mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>☕</p>
                <p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Brew</p>
              </div>
              <div>
                <p className="text-3xl font-medium mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>DM Sans</p>
                <p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Typeface</p>
              </div>
              <div>
                <p className="text-3xl font-medium mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>∞</p>
                <p className="text-xs uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Warmth</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Coffee Brewing Calculator Section */}
      <section className="py-24">
        <div className="max-w-lg mx-auto px-8">
          <h2 className="text-2xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
            AI Brew Calculator
          </h2>
          <p className="text-sm mb-8" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Tell the AI how you are feeling and get a personalized coffee suggestion. Then brew it to perfection.
          </p>
          <CoffeeBrewingCalculator />
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-medium mb-12" style={{ color: 'hsl(var(--theme-foreground))' }}>Comfort Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Coffee, title: 'Rich Browns', desc: 'Espresso, mocha, and caramel tones create depth and warmth.' },
              { icon: Heart, title: 'Cozy Atmosphere', desc: 'Colors and textures that feel like a warm embrace.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-xl border"
                style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsl(var(--theme-card))' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <item.icon className="w-6 h-6 mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-8">
          <blockquote className="border-l-2 pl-8" style={{ borderColor: 'hsl(var(--theme-primary))' }}>
            <p className="text-2xl font-medium leading-relaxed mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
              &ldquo;Life happens, coffee helps.&rdquo;
            </p>
            <cite className="text-sm not-italic" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>- Coffee Wisdom</cite>
          </blockquote>
        </div>
      </section>

      <section className="py-24 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/design"
              className="px-8 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}
            >
              Theme Gallery
            </Link>
            <Link
              href="/design/caffeine"
              className="px-8 py-3 rounded-xl text-sm font-medium border transition-all hover:opacity-80"
              style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-foreground))' }}
            >
              Caffeine
            </Link>
          </div>
        </div>
      </section>

      {/* Theme Timepiece */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-medium mb-4 text-center" style={{ color: 'hsl(var(--theme-foreground))' }}>Theme Timepiece</h2>
          <p className="text-center mb-8 text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>A watch face generated from this theme&apos;s warm coffee palette.</p>
          <div className="flex justify-center">
            <WatchFace watchDNA={watchDNA} size="lg" showCase={true} interactive={true} />
          </div>
        </div>
      </section>

      <footer className="py-8 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="max-w-4xl mx-auto px-8 flex justify-between items-center">
          <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Mocha Mousse</p>
          <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>OpenClaw-OS</p>
        </div>
      </footer>
    </div>
  );
}
