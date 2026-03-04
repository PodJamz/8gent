'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Loader2, RefreshCw, Sparkles, Heart } from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { IconShowcase } from '@/components/design/IconShowcase';

interface VibeCheck {
  vibe: string;
  emoji: string;
  message: string;
  suggestion: string;
}

function VibeCheckApp() {
  const [result, setResult] = useState<VibeCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState('');

  const moods = ['feeling scattered', 'kinda tired', 'lowkey anxious', 'pretty good actually', 'need motivation'];

  const checkVibe = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/mini-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'vibe-check', prompt: mood || 'Just checking in' }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (!data.error) {
        setResult({
          vibe: data.vibe || 'chill',
          emoji: data.emoji || '✨💫',
          message: data.message || 'You are doing better than you think.',
          suggestion: data.suggestion || 'Take a breath. You got this.',
        });
      }
    } catch {
      setResult({
        vibe: 'resilient',
        emoji: '🌟💪',
        message: 'Life is happening and you are handling it.',
        suggestion: 'Give yourself some credit today.',
      });
    } finally {
      setLoading(false);
    }
  }, [loading, mood]);

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
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MessageCircle className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          </motion.div>
          <span className="text-sm font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>
            Vibe Check
          </span>
        </div>
        {result && (
          <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.1)', color: 'hsl(var(--theme-primary))' }}>
            {result.vibe}
          </span>
        )}
      </div>

      <div className="flex flex-col p-6" style={{ height: 'calc(100% - 57px)' }}>
        {/* Mood Selection */}
        {!result && (
          <div className="mb-6">
            <p
              className="text-xs font-medium uppercase tracking-wider mb-3"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              How are you feeling?
            </p>
            <div className="flex flex-wrap gap-2">
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full transition-all"
                  style={{
                    backgroundColor: mood === m ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-muted))',
                    color: mood === m ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-foreground))',
                  }}
                >
                  {m}
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
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-10 h-10 mx-auto mb-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                </motion.div>
                <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Reading your vibe...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center w-full max-w-sm"
              >
                {/* Emoji */}
                <motion.p
                  className="text-5xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {result.emoji}
                </motion.p>

                {/* Vibe */}
                <h3
                  className="text-2xl font-bold mb-2 capitalize"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  {result.vibe} vibes
                </h3>

                {/* Message */}
                <p
                  className="text-base mb-6 leading-relaxed"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {result.message}
                </p>

                {/* Suggestion */}
                <div
                  className="px-4 py-3 rounded-xl border"
                  style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsl(var(--theme-muted) / 0.3)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-3 h-3" style={{ color: 'hsl(var(--theme-primary))' }} />
                    <span className="text-xs font-medium uppercase" style={{ color: 'hsl(var(--theme-primary))' }}>
                      Suggestion
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    {result.suggestion}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center">
                <MessageCircle
                  className="w-16 h-16 mx-auto mb-6"
                  style={{ color: 'hsl(var(--theme-primary))', opacity: 0.3 }}
                />
                <p className="text-sm mb-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Select how you are feeling
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))', opacity: 0.6 }}>
                  AI reads your vibe and offers support
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        {result ? (
          <button
            onClick={() => setResult(null)}
            className="w-full py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2 border rounded-xl"
            style={{
              borderColor: 'hsl(var(--theme-border))',
              color: 'hsl(var(--theme-foreground))',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Check Again
          </button>
        ) : (
          <button
            onClick={checkVibe}
            disabled={loading}
            className="w-full py-3 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 rounded-xl"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'hsl(var(--theme-primary-foreground))',
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <MessageCircle className="w-4 h-4" />
                Check My Vibe
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function T3ChatPage() {
  return (
    <ProductPageLayout
      theme="t3-chat"
      targetUser="people who communicate through chat all day"
      problemStatement="Digital conversations lack emotional nuance. We type words but lose tone."
      problemContext="We spend hours in chat. Slack, Discord, iMessage, DMs. Quick replies pile up. But in the speed of typing, we lose track of how we actually feel. Conversations become transactional. The human gets lost in the interface."
      insight="Chat is not just about exchanging information. It is about connection. A vibe check creates a pause. A moment to notice your own state before responding to others."
      tradeoffs={['Connection over speed', 'Awareness over output', 'Mood over message']}
      appName="Vibe Check"
      appDescription="AI reads your vibe and offers friendly support"
      principles={[
        {
          title: 'Conversation First',
          description: 'Every element optimized for smooth chat flow. Rounded corners, soft colors, approachable typography.',
        },
        {
          title: 'Gradient Energy',
          description: 'Pink to purple gradients add warmth and playfulness to a digital conversation.',
        },
        {
          title: 'Casual Tone',
          description: 'The interface speaks like a friend, not a system. Lowercase vibes. Emoji welcome.',
        },
        {
          title: 'Supportive by Default',
          description: 'Responses are designed to uplift, not diagnose. Gentle suggestions, not prescriptions.',
        },
      ]}
      quote={{
        text: 'The medium is the message.',
        author: 'Marshall McLuhan',
      }}
    >
      <VibeCheckApp />

      <div className="mt-16">
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Chat Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Pink and purple conversation. Click to copy.
        </p>
        <ColorPalette colors={themeColors['t3-chat']} />
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Chat Icons
        </h3>
        <IconShowcase variant="grid" iconSet="all" />
      </div>
    </ProductPageLayout>
  );
}
