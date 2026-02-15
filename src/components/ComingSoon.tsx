'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { Lightbulb, Send, Sparkles, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  features?: string[];
  priority?: string;
}

export function ComingSoon({
  title,
  description,
  icon,
  features = [],
  priority
}: ComingSoonProps) {
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;

    // In a real implementation, this would save to the database
    // For now, we'll just show a success state
    setIsSubmitted(true);
    setSuggestion('');

    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(var(--theme-primary) / 0.3) 0%, transparent 70%)',
        }}
      />

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-10"
      >
        <LiquidGlass
          variant="button"
          intensity="subtle"
          className="!px-3 !py-2 !rounded-full flex items-center gap-2 text-sm"
          rippleEffect
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </LiquidGlass>
      </Link>

      {/* Priority badge */}
      {priority && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 right-6"
        >
          <LiquidGlass
            variant="button"
            intensity="subtle"
            className="!px-3 !py-1.5 !rounded-full text-xs font-medium"
          >
            {priority}
          </LiquidGlass>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center max-w-md w-full"
      >
        {/* Claw AI Avatar */}
        <motion.div
          className="relative mb-6"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="relative">
            {/* Glow ring */}
            <div
              className="absolute -inset-4 rounded-full opacity-50 blur-xl"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
              }}
            />

            {/* Avatar container */}
            <LiquidGlass
              variant="floating"
              intensity="strong"
              className="!p-1 !rounded-full relative"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden relative">
                <Image
                  src="/openclaw-logo.png"
                  alt="Claw AI"
                  fill
                  className="object-cover"
                />
              </div>
            </LiquidGlass>

            {/* Sparkle decoration */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-[hsl(var(--theme-accent))]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Icon */}
        {icon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 p-3 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--theme-primary) / 0.2) 0%, hsl(var(--theme-accent) / 0.2) 100%)',
            }}
          >
            {icon}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold mb-2 text-center"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          {title}
        </motion.h1>

        {/* Coming Soon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              background: 'hsl(var(--theme-primary) / 0.2)',
              color: 'hsl(var(--theme-primary))',
            }}
          >
            Coming Soon
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6 opacity-70"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          {description}
        </motion.p>

        {/* Features list (expandable) */}
        {features.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full mb-6"
          >
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-left"
            >
              <LiquidGlass
                variant="card"
                intensity="subtle"
                className="!p-4 !rounded-2xl w-full"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    Planned Features
                  </span>
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="text-sm opacity-60"
                  >
                    ▼
                  </motion.span>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 space-y-2 overflow-hidden"
                    >
                      {features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-2 text-sm opacity-70"
                        >
                          <span style={{ color: 'hsl(var(--theme-accent))' }}>•</span>
                          {feature}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </LiquidGlass>
            </button>
          </motion.div>
        )}

        {/* Suggestion form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full"
        >
          <LiquidGlass
            variant="card"
            intensity="medium"
            className="!p-5 !rounded-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5" style={{ color: 'hsl(var(--theme-accent))' }} />
              <h2 className="font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>
                Got an idea?
              </h2>
            </div>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl mb-2"
                  >
                    ✨
                  </motion.div>
                  <p className="font-medium" style={{ color: 'hsl(var(--theme-primary))' }}>
                    Thanks for your suggestion!
                  </p>
                  <p className="text-sm opacity-60 mt-1">
                    I&apos;ll review it soon
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-3"
                >
                  <textarea
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="What would you like to see in this feature?"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl resize-none text-sm transition-all focus:outline-none focus:ring-2"
                    style={{
                      background: 'hsl(var(--theme-background) / 0.5)',
                      color: 'hsl(var(--theme-foreground))',
                      borderColor: 'hsl(var(--theme-border))',
                      // @ts-expect-error CSS custom property
                      '--tw-ring-color': 'hsl(var(--theme-primary) / 0.5)',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!suggestion.trim()}
                    className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: suggestion.trim()
                        ? 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)'
                        : 'hsl(var(--theme-muted))',
                      color: suggestion.trim() ? 'white' : 'hsl(var(--theme-muted-foreground))',
                    }}
                  >
                    <Send className="w-4 h-4" />
                    Submit Idea
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </LiquidGlass>
        </motion.div>

        {/* Link to projects board */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <Link
            href="/projects"
            className="text-sm opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          >
            View all planned features →
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
