'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useEffect, useCallback } from 'react';
import { Plus, Minus, ShoppingCart, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart, Check } from 'lucide-react';

interface MobileFrameProps {
  children: ReactNode;
  className?: string;
  variant?: 'iphone' | 'android';
  showStatusBar?: boolean;
  time?: string;
}

export function MobileFrame({
  children,
  className = '',
  variant = 'iphone',
  showStatusBar = true,
  time = '9:41',
}: MobileFrameProps) {
  const [currentTime, setCurrentTime] = useState(time);

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false }));
  }, []);

  return (
    <motion.div
      className={`relative mx-auto ${className}`}
      style={{ width: '280px' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Phone outer frame */}
      <div
        className="relative rounded-[40px] p-2 shadow-2xl"
        style={{
          background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
        }}
      >
        {/* Screen bezel */}
        <div
          className="relative rounded-[32px] overflow-hidden"
          style={{ background: '#000', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)' }}
        >
          {/* Dynamic Island */}
          {variant === 'iphone' && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
              <div className="w-24 h-6 rounded-full" style={{ background: '#000' }} />
            </div>
          )}

          {/* Status bar */}
          {showStatusBar && (
            <div className="relative z-10 flex items-center justify-between px-6 py-2 text-xs font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
              <span>{currentTime}</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                </svg>
                <div className="w-6 h-3 rounded-sm border border-current relative">
                  <motion.div
                    className="absolute inset-0.5 rounded-[2px] bg-current"
                    initial={{ width: '60%' }}
                    animate={{ width: ['60%', '80%', '60%'] }}
                    transition={{ duration: 10, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Screen content */}
          <div className="relative min-h-[500px]" style={{ backgroundColor: 'hsl(var(--theme-background))' }}>
            {children}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center py-2" style={{ backgroundColor: 'hsl(var(--theme-background))' }}>
            <div className="w-32 h-1 rounded-full bg-current opacity-30" />
          </div>
        </div>
      </div>

      {/* Side buttons */}
      <div className="absolute left-[-2px] top-24 w-[3px] h-8 rounded-l-sm" style={{ background: '#2a2a2a' }} />
      <div className="absolute left-[-2px] top-36 w-[3px] h-12 rounded-l-sm" style={{ background: '#2a2a2a' }} />
      <div className="absolute left-[-2px] top-52 w-[3px] h-12 rounded-l-sm" style={{ background: '#2a2a2a' }} />
      <div className="absolute right-[-2px] top-32 w-[3px] h-16 rounded-r-sm" style={{ background: '#2a2a2a' }} />
    </motion.div>
  );
}

// Fully Functional Wellness/Meditation App
interface WellnessAppDemoProps {
  title?: string;
  subtitle?: string;
  breatheText?: string;
}

export function WellnessAppDemo({
  title = 'Find Your Peace',
  subtitle = 'Begin your mindfulness journey',
  breatheText = 'Breathe',
}: WellnessAppDemoProps) {
  const [isActive, setIsActive] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  const sessions = [
    { name: 'Morning Calm', duration: 5, emoji: '🌅' },
    { name: 'Focus Flow', duration: 10, emoji: '🎯' },
    { name: 'Sleep Well', duration: 15, emoji: '🌙' },
  ];

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((t) => t - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && isActive) {
      setIsActive(false);
      setSelectedSession(null);
    }
  }, [isActive, timeRemaining]);

  useEffect(() => {
    if (isActive) {
      const breathTimer = setInterval(() => {
        setBreathPhase((p) => p === 'inhale' ? 'hold' : p === 'hold' ? 'exhale' : 'inhale');
      }, 4000);
      return () => clearInterval(breathTimer);
    }
  }, [isActive]);

  const startSession = (index: number) => {
    setSelectedSession(index);
    setTimeRemaining(sessions[index].duration * 60);
    setIsActive(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <MobileFrame>
      <div className="p-6 pt-12 flex flex-col items-center justify-center min-h-[450px]">
        {/* Breathing Circle */}
        <motion.div
          className="relative w-40 h-40 flex items-center justify-center cursor-pointer"
          animate={{ scale: isActive ? (breathPhase === 'inhale' ? 1.15 : breathPhase === 'hold' ? 1.15 : 1) : [1, 1.1, 1] }}
          transition={{ duration: isActive ? 4 : 4, repeat: isActive ? 0 : Infinity, ease: 'easeInOut' }}
          onClick={() => isActive && setIsActive(false)}
        >
          <motion.div
            className="absolute inset-0 rounded-full opacity-20"
            style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
            animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-4 rounded-full opacity-40"
            style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
          />
          <motion.div
            className="absolute inset-8 rounded-full opacity-60"
            style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
          />
          <div className="text-center z-10">
            <span className="text-lg font-medium block" style={{ color: 'hsl(var(--theme-primary))' }}>
              {isActive ? (breathPhase === 'inhale' ? 'Inhale' : breathPhase === 'hold' ? 'Hold' : 'Exhale') : breatheText}
            </span>
            {isActive && (
              <span className="text-2xl font-bold" style={{ color: 'hsl(var(--theme-primary))' }}>
                {formatTime(timeRemaining)}
              </span>
            )}
          </div>
        </motion.div>

        <h3 className="mt-8 text-xl font-semibold text-center" style={{ color: 'hsl(var(--theme-foreground))' }}>
          {isActive ? sessions[selectedSession!].name : title}
        </h3>
        <p className="mt-2 text-sm text-center" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          {isActive ? 'Tap circle to stop' : subtitle}
        </p>

        {/* Session cards */}
        <AnimatePresence mode="wait">
          {!isActive && (
            <motion.div
              className="w-full mt-6 space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {sessions.map((session, i) => (
                <motion.button
                  key={session.name}
                  onClick={() => startSession(i)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{ backgroundColor: 'hsl(var(--theme-card))' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.2)' }}>
                    <span style={{ color: 'hsl(var(--theme-primary))' }}>{session.emoji}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>{session.name}</p>
                    <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{session.duration} min</p>
                  </div>
                  <Play className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileFrame>
  );
}

// Fully Functional Cafe Order App
interface CartItem {
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export function CafeAppDemo() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const menuItems = [
    { name: 'Espresso', price: 3.5, emoji: '☕' },
    { name: 'Cappuccino', price: 4.5, emoji: '🥛' },
    { name: 'Latte', price: 5.0, emoji: '🍵' },
    { name: 'Croissant', price: 3.0, emoji: '🥐' },
    { name: 'Muffin', price: 3.5, emoji: '🧁' },
  ];

  const addToCart = (item: typeof menuItems[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (name: string, delta: number) => {
    setCart((prev) => {
      return prev.map((i) => {
        if (i.name === name) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : i;
        }
        return i;
      }).filter((i) => i.quantity > 0);
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setCart([]);
      setShowCart(false);
    }, 2000);
  };

  return (
    <MobileFrame>
      <div className="p-4 pt-10 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Good morning</p>
            <h3 className="text-lg font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>Coffee Time</h3>
          </div>
          <motion.button
            className="relative p-2 rounded-full"
            style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
            onClick={() => setShowCart(!showCart)}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary-foreground))' }} />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ backgroundColor: 'hsl(var(--theme-accent))', color: 'hsl(var(--theme-accent-foreground))' }}
              >
                {itemCount}
              </motion.span>
            )}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {showCart ? (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <h4 className="text-sm font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>Your Order</h4>

              {cart.length === 0 ? (
                <p className="text-sm py-8 text-center" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Your cart is empty
                </p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'hsl(var(--theme-card))', borderColor: 'hsl(var(--theme-border))' }}>
                      <span className="text-xl">{item.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>{item.name}</p>
                        <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateQuantity(item.name, -1)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--theme-muted))' }}>
                          <Minus className="w-3 h-3" />
                        </motion.button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateQuantity(item.name, 1)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--theme-primary))' }}>
                          <Plus className="w-3 h-3" style={{ color: 'hsl(var(--theme-primary-foreground))' }} />
                        </motion.button>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-3 mt-3" style={{ borderColor: 'hsl(var(--theme-border))' }}>
                    <div className="flex justify-between mb-3">
                      <span className="font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>Total</span>
                      <span className="font-bold" style={{ color: 'hsl(var(--theme-primary))' }}>${total.toFixed(2)}</span>
                    </div>
                    <motion.button
                      onClick={placeOrder}
                      className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                      style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}
                      whileTap={{ scale: 0.98 }}
                      disabled={orderPlaced}
                    >
                      {orderPlaced ? <><Check className="w-4 h-4" /> Order Placed!</> : 'Place Order'}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Featured */}
              <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: 'hsl(var(--theme-primary))' }}>
                <p className="text-xs font-medium opacity-80" style={{ color: 'hsl(var(--theme-primary-foreground))' }}>Today's Special</p>
                <p className="text-lg font-bold mt-1" style={{ color: 'hsl(var(--theme-primary-foreground))' }}>Pumpkin Spice Latte</p>
                <p className="text-sm opacity-80" style={{ color: 'hsl(var(--theme-primary-foreground))' }}>$5.50 - Limited time</p>
              </div>

              <h4 className="text-sm font-semibold mb-3" style={{ color: 'hsl(var(--theme-foreground))' }}>Menu</h4>
              <div className="space-y-2 max-h-[240px] overflow-y-auto">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => addToCart(item)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border text-left"
                    style={{ backgroundColor: 'hsl(var(--theme-card))', borderColor: 'hsl(var(--theme-border))' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>{item.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold" style={{ color: 'hsl(var(--theme-primary))' }}>${item.price.toFixed(2)}</p>
                      <Plus className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileFrame>
  );
}

// Fully Functional Music Player
export function MusicPlayerDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(45);
  const [liked, setLiked] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const tracks = [
    { title: 'Cosmic Waves', artist: 'Ambient Artist', duration: 232 },
    { title: 'Neon Dreams', artist: 'Synthwave Master', duration: 198 },
    { title: 'Ocean Calm', artist: 'Nature Sounds', duration: 315 },
  ];

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            if (repeat) return 0;
            setCurrentTrack((t) => (t + 1) % tracks.length);
            return 0;
          }
          return p + 0.5;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, repeat, tracks.length]);

  const formatTime = (percent: number, totalSeconds: number) => {
    const seconds = Math.floor((percent / 100) * totalSeconds);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const totalFormatted = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const nextTrack = () => {
    setCurrentTrack((t) => (shuffle ? Math.floor(Math.random() * tracks.length) : (t + 1) % tracks.length));
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrack((t) => (t - 1 + tracks.length) % tracks.length);
    setProgress(0);
  };

  return (
    <MobileFrame>
      <div className="p-6 pt-12 flex flex-col items-center min-h-[450px]">
        {/* Album art */}
        <motion.div
          className="w-48 h-48 rounded-2xl shadow-lg overflow-hidden relative"
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ background: `linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)` }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full" style={{ backgroundColor: 'hsl(var(--theme-background))' }} />
          </div>
        </motion.div>

        {/* Track info */}
        <div className="mt-6 text-center w-full">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-lg font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>
              {tracks[currentTrack].title}
            </h3>
            <motion.button onClick={() => setLiked(!liked)} whileTap={{ scale: 0.9 }}>
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} style={{ color: liked ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-muted-foreground))' }} />
            </motion.button>
          </div>
          <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{tracks[currentTrack].artist}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full mt-6">
          <div
            className="h-2 rounded-full overflow-hidden cursor-pointer relative"
            style={{ backgroundColor: 'hsl(var(--theme-muted))' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = ((e.clientX - rect.left) / rect.width) * 100;
              setProgress(Math.max(0, Math.min(100, percent)));
            }}
          >
            <motion.div
              className="h-full rounded-full absolute top-0 left-0"
              style={{ backgroundColor: 'hsl(var(--theme-primary))', width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            <span>{formatTime(progress, tracks[currentTrack].duration)}</span>
            <span>{totalFormatted(tracks[currentTrack].duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-6">
          <motion.button onClick={() => setShuffle(!shuffle)} whileTap={{ scale: 0.9 }} style={{ color: shuffle ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-muted-foreground))' }}>
            <Shuffle className="w-5 h-5" />
          </motion.button>
          <motion.button onClick={prevTrack} whileTap={{ scale: 0.9 }} style={{ color: 'hsl(var(--theme-foreground))' }}>
            <SkipBack className="w-6 h-6" fill="currentColor" />
          </motion.button>
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" fill="hsl(var(--theme-primary-foreground))" style={{ color: 'hsl(var(--theme-primary-foreground))' }} />
            ) : (
              <Play className="w-6 h-6 ml-1" fill="hsl(var(--theme-primary-foreground))" style={{ color: 'hsl(var(--theme-primary-foreground))' }} />
            )}
          </motion.button>
          <motion.button onClick={nextTrack} whileTap={{ scale: 0.9 }} style={{ color: 'hsl(var(--theme-foreground))' }}>
            <SkipForward className="w-6 h-6" fill="currentColor" />
          </motion.button>
          <motion.button onClick={() => setRepeat(!repeat)} whileTap={{ scale: 0.9 }} style={{ color: repeat ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-muted-foreground))' }}>
            <Repeat className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </MobileFrame>
  );
}
