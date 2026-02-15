'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Play, Pause, RotateCcw, Loader2 } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { CaffeineChart } from '@/components/design/ChartShowcase';

interface FocusSession {
  mantra: string;
  intention: string;
  duration: number;
  energy: string;
}

function FocusBrew() {
  const [session, setSession] = useState<FocusSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [task, setTask] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const tasks = ['deep work', 'writing', 'coding', 'design', 'learning'];

  const generateSession = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'focus-mantra', prompt: task || 'deep focused work' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        const duration = parseInt(data.duration) || 25;
        setSession({
          mantra: data.mantra || 'One task. Full presence. Nothing else.',
          intention: data.intention || 'Deep focused work',
          duration,
          energy: data.energy || 'steady',
        });
        setTimeLeft(duration * 60);
      }
    } catch {
      setSession({
        mantra: 'This moment. This task. Nothing else.',
        intention: 'Deep work session',
        duration: 25,
        energy: 'calm',
      });
      setTimeLeft(25 * 60);
    } finally {
      setLoading(false);
    }
  }, [loading, task]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = session ? 1 - timeLeft / (session.duration * 60) : 0;

  return (
    <div
      className="w-full rounded-xl border overflow-hidden"
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
        <div className="flex items-center gap-3">
          <Coffee className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Focus Brew
          </span>
        </div>
        {session && (
          <span
            className="text-xs px-2 py-1 rounded-full"
            style={{
              backgroundColor: 'hsla(var(--theme-primary) / 0.15)',
              color: 'hsl(var(--theme-primary))',
            }}
          >
            {session.energy}
          </span>
        )}
      </div>

      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 61px)' }}>
        {/* Task Selection */}
        {!session && (
          <div className="mb-6">
            <p
              className="text-xs uppercase tracking-wider mb-3"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              What are you focusing on?
            </p>
            <div className="flex flex-wrap gap-2">
              {tasks.map((t) => (
                <button
                  key={t}
                  onClick={() => setTask(t)}
                  className="px-3 py-1.5 text-xs rounded-lg transition-all"
                  style={{
                    backgroundColor: task === t ? 'hsl(var(--theme-primary))' : 'transparent',
                    color: task === t ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
                    border: `1px solid ${task === t ? 'transparent' : 'hsl(var(--theme-border))'}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <Coffee
                  className="w-10 h-10 mx-auto mb-4 animate-pulse"
                  style={{ color: 'hsl(var(--theme-primary))' }}
                />
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Brewing your focus...
                </p>
              </motion.div>
            ) : session ? (
              <motion.div
                key="session"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center w-full"
              >
                {/* Timer Circle */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="hsl(var(--theme-border))"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="hsl(var(--theme-primary))"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={553}
                      strokeDashoffset={553 * (1 - progress)}
                      initial={{ strokeDashoffset: 553 }}
                      animate={{ strokeDashoffset: 553 * (1 - progress) }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-4xl font-mono font-medium"
                      style={{ color: 'hsl(var(--theme-foreground))' }}
                    >
                      {formatTime(timeLeft)}
                    </span>
                    <span
                      className="text-xs mt-1"
                      style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                    >
                      {session.duration} min session
                    </span>
                  </div>
                </div>

                {/* Mantra */}
                <p
                  className="text-lg font-medium mb-2 italic"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  &ldquo;{session.mantra}&rdquo;
                </p>
                <p
                  className="text-xs mb-6"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {session.intention}
                </p>

                {/* Controls */}
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: 'hsl(var(--theme-primary))',
                      color: 'hsl(var(--theme-primary-foreground))',
                    }}
                  >
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isRunning ? 'Pause' : 'Start'}
                  </button>
                  <button
                    onClick={() => {
                      setSession(null);
                      setIsRunning(false);
                      setTimeLeft(0);
                    }}
                    className="p-2.5 rounded-lg transition-all hover:opacity-70"
                    style={{
                      border: '1px solid hsl(var(--theme-border))',
                      color: 'hsl(var(--theme-muted-foreground))',
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <Coffee
                  className="w-16 h-16 mx-auto mb-6"
                  style={{ color: 'hsl(var(--theme-primary))', opacity: 0.3 }}
                />
                <p
                  className="text-sm mb-2"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  Select your task and brew a focus session
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.7 }}
                >
                  AI generates a personalized mantra for deep work
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Generate Button */}
        {!session && (
          <button
            onClick={generateSession}
            disabled={loading}
            className="w-full py-3 text-sm font-medium rounded-lg transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary-foreground))',
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Coffee className="w-4 h-4" />
                Brew Focus Session
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function CaffeinePage() {
  return (
    <ProductPageLayout
      theme="caffeine"
      targetUser="developers & knowledge workers"
      problemStatement="Deep work is constantly interrupted. Starting isn't hard. Protecting focus is."
      problemContext="We check Slack 'just for a second.' We respond to that email before it slips our mind. And suddenly, 90 minutes of potential deep work becomes 15 fragmented minutes between distractions. The cost isn't the interruption. It's the 23 minutes it takes to fully refocus."
      insight="We don't need more productivity tools. We need fewer decisions during deep work. One timer. One task. One mantra. Zero settings to fiddle with."
      tradeoffs={['Simplicity over features', 'Focus over flexibility', 'Ritual over optimization']}
      appName="Focus Brew"
      appDescription="AI-generated focus mantras + distraction-free timer"
      principles={[
        {
          title: 'Constraint Breeds Focus',
          description: 'By limiting options to one task and one timer, we remove decision fatigue and create space for flow.',
        },
        {
          title: 'Ritual Over Routine',
          description: 'The mantra creates a transition ritual, a mental signal that deep work is beginning.',
        },
        {
          title: 'Warm Aesthetics, Calm Mind',
          description: 'Coffee browns and low contrast reduce visual stimulation, letting your mind settle into work.',
        },
        {
          title: 'Time as Container',
          description: 'Fixed sessions create psychological safety. You\'re not committing forever, just for this brew.',
        },
      ]}
      quote={{
        text: 'The successful warrior is the average person, with laser-like focus.',
        author: 'Bruce Lee',
      }}
    >
      <FocusBrew />

      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Daily Focus
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Your deep work rhythm throughout the day. Find your peak focus hours.
        </p>
        <CaffeineChart />
      </div>
    </ProductPageLayout>
  );
}
