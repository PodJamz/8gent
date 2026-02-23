'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Sparkles, Github, Volume2, VolumeX, Copy, Check, Database } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, SignedOut } from '@clerk/nextjs';

interface AgentAccessRestrictedProps {
  isLoading?: boolean;
  isSignedIn?: boolean;
  clerkId?: string;
  userEmail?: string;
}

// James's warm rejection messages
const JAMES_MESSAGES = [
  "Ah, here's the thing...",
  "I'd love to let you into the workshop, truly I would. But this particular room is where I keep all the sharp tools and live wires.",
  "The OpenClaw can execute code, push to repos, and deploy to production. So I keep it locked up tight. Nothing personal, just being a responsible host.",
];

// Full message for TTS (all messages combined)
const JAMES_FULL_MESSAGE = JAMES_MESSAGES.join(' ');

// Try Eleven Labs first, fall back to OpenAI (same pattern as VoiceScreen)
async function generateSpeech(text: string): Promise<Blob> {
  // Try Eleven Labs first
  try {
    const elevenLabsRes = await fetch('/api/tts/elevenlabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        stability: 0.5,
        similarityBoost: 0.75,
      }),
    });

    if (elevenLabsRes.ok) {
      const blob = await elevenLabsRes.blob();
      if (blob.size > 0) {
        console.log('[AgentAccessRestricted] Using Eleven Labs TTS');
        return blob;
      }
    }

    // Check if we should fallback
    const errorJson = await elevenLabsRes.json().catch(() => null);
    if (errorJson?.fallback !== 'openai') {
      throw new Error('Eleven Labs failed without fallback');
    }
  } catch (e) {
    console.log('[AgentAccessRestricted] Eleven Labs unavailable, trying OpenAI:', e);
  }

  // Fallback to OpenAI
  console.log('[AgentAccessRestricted] Using OpenAI TTS fallback');
  const openaiRes = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      voice: 'onyx', // Warm male voice
      model: 'tts-1-hd',
      speed: 1.0,
    }),
  });

  if (!openaiRes.ok) {
    throw new Error('Both TTS services failed');
  }

  return openaiRes.blob();
}

/**
 * AgentAccessRestricted - 8gent gracefully declines access to non-owners
 *
 * The agent/sandbox feature is owner-only for security reasons:
 * - It can execute arbitrary code
 * - It has access to GitHub repositories
 * - It can deploy to Vercel
 *
 * But we do it with warmth and charm, as James would.
 */
export function AgentAccessRestricted({ isLoading, isSignedIn, clerkId, userEmail }: AgentAccessRestrictedProps) {
  // Typewriter state (must be before any early returns - hooks rule)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedAudio = useRef(false);

  // Copy Clerk ID to clipboard
  const copyClerkId = useCallback(() => {
    if (clerkId) {
      navigator.clipboard.writeText(clerkId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [clerkId]);

  // Cache key for the audio (static message, so we can cache it forever)
  const AUDIO_CACHE_KEY = 'james_restricted_audio_v1';

  // Generate and play TTS audio when component mounts (not loading)
  // Uses localStorage cache to avoid regenerating on every visit
  useEffect(() => {
    if (isLoading || hasStartedAudio.current) return;
    hasStartedAudio.current = true;

    const loadAndPlayAudio = async () => {
      try {
        let audioUrl: string;

        // Check cache first
        const cachedAudio = localStorage.getItem(AUDIO_CACHE_KEY);
        if (cachedAudio) {
          console.log('[AgentAccessRestricted] Using cached audio');
          audioUrl = cachedAudio;
        } else {
          console.log('[AgentAccessRestricted] Generating speech (will cache)...');
          const audioBlob = await generateSpeech(JAMES_FULL_MESSAGE);

          // Convert blob to base64 data URL for caching
          const reader = new FileReader();
          audioUrl = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(audioBlob);
          });

          // Cache the audio
          try {
            localStorage.setItem(AUDIO_CACHE_KEY, audioUrl);
            console.log('[AgentAccessRestricted] Audio cached');
          } catch (storageErr) {
            console.warn('[AgentAccessRestricted] Could not cache audio:', storageErr);
          }
        }

        const audio = new Audio(audioUrl);

        audio.onended = () => {
          setIsPlaying(false);
          console.log('[AgentAccessRestricted] Audio ended');
        };

        audio.onerror = (e) => {
          console.error('[AgentAccessRestricted] Audio error:', e);
          setIsPlaying(false);
          // Clear cache on error in case it's corrupted
          localStorage.removeItem(AUDIO_CACHE_KEY);
        };

        audioRef.current = audio;

        // Try to autoplay
        try {
          await audio.play();
          setIsPlaying(true);
          console.log('[AgentAccessRestricted] Audio playing');
        } catch (playError) {
          console.warn('[AgentAccessRestricted] Autoplay blocked:', playError);
          // User will need to click to play
        }
      } catch (err) {
        console.error('[AgentAccessRestricted] TTS error:', err);
      }
    };

    loadAndPlayAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isLoading]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      } else {
        audioRef.current.muted = true;
        setIsMuted(true);
      }
    }
  }, [isMuted]);

  // Play audio if not already playing (for autoplay blocked scenario)
  const handlePlayClick = useCallback(async () => {
    if (audioRef.current && !isPlaying) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('[AgentAccessRestricted] Play failed:', err);
      }
    }
  }, [isPlaying]);

  // Typewriter effect - types out each message, then moves to next
  useEffect(() => {
    // Don't run typewriter when loading
    if (isLoading) return;

    if (currentMessageIndex >= JAMES_MESSAGES.length) {
      setIsTyping(false);
      // Show actions after all messages are typed
      const timer = setTimeout(() => setShowActions(true), 500);
      return () => clearTimeout(timer);
    }

    const currentMessage = JAMES_MESSAGES[currentMessageIndex];
    let charIndex = 0;
    setDisplayedText('');
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        // Pause before next message
        setTimeout(() => {
          setCurrentMessageIndex(prev => prev + 1);
        }, currentMessageIndex === 0 ? 800 : 1200); // Shorter pause after title
      }
    }, 30); // 30ms per character, same as onboarding

    return () => clearInterval(typeInterval);
  }, [currentMessageIndex, isLoading]);

  // Loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'hsl(var(--theme-background))',
          color: 'hsl(var(--theme-foreground))',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          {/* James's avatar with gentle pulse */}
          <motion.div
            className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-[hsl(var(--theme-primary)/0.3)]"
            animate={{
              boxShadow: [
                '0 0 20px hsl(var(--theme-primary) / 0.2)',
                '0 0 40px hsl(var(--theme-primary) / 0.4)',
                '0 0 20px hsl(var(--theme-primary) / 0.2)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Image
              src="/8gent-logo.png"
              alt="James"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <p className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            One moment...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'hsl(var(--theme-background))',
        color: 'hsl(var(--theme-foreground))',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* James's Avatar with warm glow and speaking indicator */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <motion.div
            className="w-full h-full rounded-full overflow-hidden ring-4 ring-[hsl(var(--theme-primary)/0.3)]"
            initial={{ scale: 0.8 }}
            animate={{
              scale: 1,
              boxShadow: isPlaying ? [
                '0 0 20px hsl(var(--theme-primary) / 0.3)',
                '0 0 40px hsl(var(--theme-primary) / 0.5)',
                '0 0 20px hsl(var(--theme-primary) / 0.3)',
              ] : [
                '0 0 20px hsl(var(--theme-primary) / 0.2)',
                '0 0 30px hsl(var(--theme-primary) / 0.3)',
                '0 0 20px hsl(var(--theme-primary) / 0.2)',
              ],
            }}
            transition={{
              scale: { type: 'spring', stiffness: 200, delay: 0.1 },
              boxShadow: { duration: isPlaying ? 1 : 3, repeat: Infinity }
            }}
          >
            <Image
              src="/8gent-logo.png"
              alt="James"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Audio control button */}
          <motion.button
            onClick={isPlaying ? toggleMute : handlePlayClick}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{
              background: 'hsl(var(--theme-primary))',
              color: 'white',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            title={isPlaying ? (isMuted ? 'Unmute' : 'Mute') : 'Play audio'}
          >
            {isPlaying ? (
              isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </motion.button>

          {/* Speaking indicator */}
          {isPlaying && !isMuted && (
            <motion.div
              className="absolute -top-1 -right-1 flex gap-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0, 0.1, 0.2].map((delay, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full"
                  style={{ background: 'hsl(var(--theme-primary))' }}
                  animate={{ height: [4, 12, 4] }}
                  transition={{ duration: 0.4, repeat: Infinity, delay }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Streaming text display */}
        <div className="min-h-[200px] flex flex-col justify-start">
          {/* Title (first message) */}
          {currentMessageIndex >= 0 && (
            <motion.h1
              className="text-2xl font-bold mb-4"
              style={{ color: 'hsl(var(--theme-foreground))' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {currentMessageIndex === 0 ? (
                <>
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-0.5 h-6 bg-current ml-0.5 align-middle"
                    />
                  )}
                </>
              ) : (
                JAMES_MESSAGES[0]
              )}
            </motion.h1>
          )}

          {/* First paragraph */}
          {currentMessageIndex >= 1 && (
            <motion.p
              className="text-base mb-4 leading-relaxed"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {currentMessageIndex === 1 ? (
                <>
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-0.5 h-5 bg-current ml-0.5 align-middle"
                    />
                  )}
                </>
              ) : (
                JAMES_MESSAGES[1]
              )}
            </motion.p>
          )}

          {/* Second paragraph */}
          {currentMessageIndex >= 2 && (
            <motion.p
              className="text-base mb-6 leading-relaxed"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {currentMessageIndex === 2 ? (
                <>
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-0.5 h-5 bg-current ml-0.5 align-middle"
                    />
                  )}
                </>
              ) : (
                JAMES_MESSAGES[2]
              )}
            </motion.p>
          )}
        </div>

        {/* Actions - only show after typing completes */}
        {showActions && (
          <>
            {/* If signed in but not in database - show Clerk ID */}
            {isSignedIn && clerkId ? (
              <motion.div
                className="mb-6 p-4 rounded-xl text-left"
                style={{ background: 'hsl(var(--theme-primary) / 0.1)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-primary))' }}>
                    Almost there! Run this in your terminal:
                  </span>
                </div>
                <div className="mt-3 p-3 rounded-lg font-mono text-xs overflow-x-auto" style={{ background: 'hsl(var(--theme-background))' }}>
                  <code style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    npx convex run userManagement:seedOwner {`'{"email":"${userEmail || 'your@email.com'}","displayName":"Your Name","clerkId":"${clerkId}"}'`}
                  </code>
                </div>
                <button
                  onClick={() => {
                    const cmd = `npx convex run userManagement:seedOwner '{"email":"${userEmail || 'your@email.com'}","displayName":"Your Name","clerkId":"${clerkId}"}'`;
                    navigator.clipboard.writeText(cmd);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
                  style={{
                    background: 'hsl(var(--theme-primary))',
                    color: 'white',
                  }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Command'}
                </button>
                <p className="mt-3 text-xs" style={{ color: 'hsl(var(--theme-muted-foreground) / 0.7)' }}>
                  This sets up owner permissions automatically. Refresh after running.
                </p>
              </motion.div>
            ) : (
              /* Sign in option for the owner */
              <SignedOut>
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <p
                    className="text-sm mb-3"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    Wait, are you the owner?
                  </p>
                  <SignInButton mode="modal">
                    <button
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        background: 'hsl(142 70% 45%)',
                        color: 'white',
                      }}
                    >
                      <Github className="w-4 h-4" />
                      Sign in to prove it
                    </button>
                  </SignInButton>
                </motion.div>
              </SignedOut>
            )}

            {/* Divider */}
            <motion.div
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex-1 h-px" style={{ background: 'hsl(var(--theme-border))' }} />
              <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'hsl(var(--theme-border))' }} />
            </motion.div>

            {/* Friendly note */}
            <motion.div
              className="flex items-center justify-center gap-2 mb-6 px-4 py-3 rounded-xl"
              style={{ background: 'hsl(var(--theme-primary) / 0.1)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Heart className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
              <span className="text-sm" style={{ color: 'hsl(var(--theme-primary))' }}>
                Thanks for understanding
              </span>
            </motion.div>

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors"
                  style={{
                    background: 'hsl(var(--theme-muted))',
                    color: 'hsl(var(--theme-foreground))',
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Let&apos;s explore something else
                </motion.button>
              </Link>
            </motion.div>

            {/* Gentle suggestion */}
            <motion.p
              className="text-sm mt-8 flex items-center justify-center gap-2"
              style={{ color: 'hsl(var(--theme-muted-foreground) / 0.7)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-3 h-3" />
              Plenty of other interesting corners to discover
              <Sparkles className="w-3 h-3" />
            </motion.p>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default AgentAccessRestricted;
