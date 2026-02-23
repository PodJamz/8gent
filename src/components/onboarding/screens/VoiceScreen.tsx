'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Play, Pause, RotateCcw, Volume2, Send, MessageSquare } from 'lucide-react';
import { springs } from '@/components/motion/config';
import { useVoiceRecording } from '../hooks/useVoiceRecording';

interface VoiceScreenProps {
  onSave: (blob: Blob | null, transcript?: string) => void;
  onAdvance: () => void;
  aesthetic?: 'clean' | 'warm' | 'dark' | 'vivid' | null;
  intent?: 'curiosity' | 'hiring' | 'collaboration' | 'inspiration' | null;
}

type Phase = 'input' | 'sending' | 'transcribing' | 'responding' | 'playing' | 'finishing';
type InputMode = 'voice' | 'text';

// Contextual questions based on intent
function getContextualQuestion(intent?: string | null): { question: string; placeholder: string } {
  switch (intent) {
    case 'hiring':
      return {
        question: "How do you plan to use 8gent for work?",
        placeholder: "e.g., I need to manage projects and automate tasks..."
      };
    case 'collaboration':
      return {
        question: "What would you like to build or create?",
        placeholder: "e.g., I'm designing a new platform..."
      };
    case 'inspiration':
      return {
        question: "What kind of inspiration are you seeking?",
        placeholder: "e.g., Looking for new UI/UX patterns..."
      };
    case 'curiosity':
    default:
      return {
        question: "What brings you to 8gent today?",
        placeholder: "e.g., Just exploring the features..."
      };
  }
}

// Claw's intelligent responses that direct users where to go
function generateClawResponse(userMessage: string, intent?: string | null): string {
  const message = userMessage.toLowerCase();

  if (intent === 'hiring') {
    return "Understood. 8gent is designed for high-performance productivity. You'll find tools for project management, automated workflows, and AI assistance in the dock below. Let's get started with your workspace.";
  }

  if (intent === 'collaboration') {
    return "Excellent. We have a suite of collaborative tools ready for you. From real-time editing to AI brainstorming in the Canvas app, you're all set to build something great.";
  }

  if (intent === 'inspiration') {
    return "Welcome to the creative hub. Check out the Design Gallery for visual patterns and the Prototyping apps to experiment with new ideas. There's plenty to discover.";
  }

  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! Welcome to 8gent. I'm your AI assistant, ready to help you navigate this environment. Feel free to explore the apps in the dock.";
  }

  return "Glad to have you here. 8gent is now configured for your needs. You can use the orange orb at the bottom of the screen to chat with me anytime you have questions.";
}

// Try Eleven Labs first, fall back to OpenAI
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
        console.log('[VoiceScreen] Using Eleven Labs TTS');
        return blob;
      }
    }

    // Check if we should fallback
    const errorJson = await elevenLabsRes.json().catch(() => null);
    if (errorJson?.fallback !== 'openai') {
      throw new Error('Eleven Labs failed without fallback');
    }
  } catch (e) {
    console.log('[VoiceScreen] Eleven Labs unavailable, trying OpenAI:', e);
  }

  // Fallback to OpenAI
  console.log('[VoiceScreen] Using OpenAI TTS fallback');
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

export function VoiceScreen({ onSave, onAdvance, aesthetic, intent }: VoiceScreenProps) {
  const {
    isRecording,
    isSupported,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    clearRecording,
    error,
  } = useVoiceRecording();

  const [phase, setPhase] = useState<Phase>('input');
  const [inputMode, setInputMode] = useState<InputMode>('voice');
  const [textInput, setTextInput] = useState('');
  const [transcript, setTranscript] = useState<string>('');
  const [clawResponse, setClawResponse] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [clawAudio, setClawAudio] = useState<HTMLAudioElement | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState<string>('');

  const isProcessingRef = useRef(false);
  const hasAutoAdvanced = useRef(false);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const isDark = aesthetic === 'dark' || aesthetic === 'vivid' || !aesthetic;
  const bgClass = 'bg-transparent';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const mutedClass = isDark ? 'text-white/40' : 'text-slate-400';
  const buttonBg = isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-200 hover:bg-slate-300';
  const inputBg = isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200';

  const { question, placeholder } = getContextualQuestion(intent);

  // Set up user audio playback
  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
    }
  }, [audioUrl]);

  // Typewriter effect for Claw's response
  useEffect(() => {
    if (phase === 'playing' && clawResponse) {
      setDisplayedText('');
      let index = 0;
      const interval = setInterval(() => {
        if (index < clawResponse.length) {
          setDisplayedText(clawResponse.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase, clawResponse]);

  // Auto-advance after James finishes speaking
  useEffect(() => {
    if (phase === 'finishing' && !hasAutoAdvanced.current) {
      hasAutoAdvanced.current = true;
      console.log('[VoiceScreen] Finishing phase - auto-advancing in 2s');
      const timer = setTimeout(() => {
        console.log('[VoiceScreen] Auto-advancing to next screen');
        onSave(audioBlob, transcript);
        onAdvance();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, audioBlob, transcript, onSave, onAdvance]);

  // Process the user's message (voice or text)
  const processMessage = useCallback(async (userMessage: string) => {
    if (isProcessingRef.current || !userMessage.trim()) return;
    isProcessingRef.current = true;

    setPhase('responding');
    console.log('[VoiceScreen] Processing message:', userMessage);

    try {
      // Brief thinking pause
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate response
      const response = generateClawResponse(userMessage, intent);
      console.log('[VoiceScreen] Generated response:', response);
      setClawResponse(response);

      // Generate speech
      console.log('[VoiceScreen] Generating speech...');
      const audioData = await generateSpeech(response);
      console.log('[VoiceScreen] Got audio:', audioData.size, 'bytes');

      if (audioData.size === 0) {
        throw new Error('Empty audio received');
      }

      const newAudioUrl = URL.createObjectURL(audioData);
      const audio = new Audio(newAudioUrl);

      audio.onended = () => {
        console.log('[VoiceScreen] Audio playback ended');
        setIsPlaying(false);
        setPhase('finishing');
      };

      audio.onerror = (e) => {
        console.error('[VoiceScreen] Audio error:', e);
        setIsPlaying(false);
        setPhase('finishing');
      };

      setClawAudio(audio);
      setPhase('playing');

      // Auto-play
      try {
        await audio.play();
        console.log('[VoiceScreen] Audio playing');
        setIsPlaying(true);
      } catch (playError) {
        console.warn('[VoiceScreen] Autoplay blocked:', playError);
        // Fallback timer
        const typewriterTime = response.length * 30 + 2000;
        setTimeout(() => {
          setPhase(current => current === 'playing' ? 'finishing' : current);
        }, typewriterTime);
      }
    } catch (err) {
      console.error('[VoiceScreen] Processing error:', err);
      setProcessError('Could not process. You can skip or try again.');
      setPhase('input');
    } finally {
      isProcessingRef.current = false;
    }
  }, [intent]);

  // Process voice recording
  const processRecording = useCallback(async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!audioBlob) return;

    setPhase('sending');
    setProcessError(null);

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      setPhase('transcribing');

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const transcribeRes = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });

      if (!transcribeRes.ok) {
        throw new Error('Failed to transcribe');
      }

      const result = await transcribeRes.json();
      const text = result.text || 'Hello';
      console.log('[VoiceScreen] Transcribed:', text);
      setTranscript(text);

      await processMessage(text);
    } catch (err) {
      console.error('[VoiceScreen] Transcription error:', err);
      setProcessError('Could not process your message. Try again or type instead.');
      setPhase('input');
      isProcessingRef.current = false;
    }
  }, [audioBlob, processMessage]);

  // Process text submission
  const processTextInput = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!textInput.trim()) return;

    setPhase('sending');
    setProcessError(null);
    setTranscript(textInput);

    await new Promise(resolve => setTimeout(resolve, 600));
    await processMessage(textInput);
  }, [textInput, processMessage]);

  const handlePlay = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        audioElement.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioElement.play();
        setIsPlaying(true);
      }
    }
  }, [audioElement, isPlaying]);

  const handlePlayClaw = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (clawAudio) {
      if (isPlaying) {
        clawAudio.pause();
        setIsPlaying(false);
      } else {
        clawAudio.currentTime = 0;
        try {
          await clawAudio.play();
          setIsPlaying(true);
        } catch (err) {
          console.error('[VoiceScreen] Play failed:', err);
        }
      }
    }
  }, [clawAudio, isPlaying]);

  const handleSkip = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSave(null);
    onAdvance();
  }, [onSave, onAdvance]);

  const handleReset = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearRecording();
    setPhase('input');
    setTextInput('');
    setTranscript('');
    setClawResponse('');
    setDisplayedText('');
    setClawAudio(null);
    setProcessError(null);
    isProcessingRef.current = false;
    hasAutoAdvanced.current = false;
  }, [clearRecording]);

  const handleRecord = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const switchToText = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInputMode('text');
    setTimeout(() => textInputRef.current?.focus(), 100);
  }, []);

  const switchToVoice = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInputMode('voice');
  }, []);

  return (
    <motion.div
      className={`fixed inset-0 bg-transparent text-white flex flex-col items-center justify-center px-8`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className="text-center max-w-md w-full">
        <motion.p
          className={`text-sm uppercase tracking-widest mb-4 ${mutedClass}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          Optional
        </motion.p>

        <motion.h2
          className={`text-2xl sm:text-3xl font-light mb-4 ${textClass}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, ...springs.gentle }}
        >
          {phase === 'finishing' ? 'Nice to meet you' : question}
        </motion.h2>

        <motion.p
          className={`text-base mb-8 ${mutedClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.66 }}
        >
          {phase === 'input' && 'The AI Assistant will respond with a personalized welcome.'}
          {phase === 'sending' && 'Sending...'}
          {phase === 'transcribing' && 'Listening...'}
          {phase === 'responding' && 'Thinking...'}
          {phase === 'playing' && ''}
          {phase === 'finishing' && ''}
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.88 }}
        >
          {(error || processError) && (
            <p className="text-red-500 text-sm">{error || processError}</p>
          )}

          <AnimatePresence mode="wait">
            {/* Input phase */}
            {phase === 'input' && (
              <motion.div
                key="input"
                className="w-full flex flex-col items-center gap-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {inputMode === 'text' ? (
                  // Text input mode
                  <form onSubmit={processTextInput} className="w-full">
                    <textarea
                      ref={textInputRef}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={placeholder}
                      className={`w-full h-32 p-4 rounded-2xl border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${inputBg} ${textClass}`}
                      maxLength={500}
                    />
                    <div className="flex items-center justify-between mt-4">
                      <button
                        type="button"
                        onClick={switchToVoice}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${buttonBg} ${mutedClass}`}
                      >
                        <Mic className="w-4 h-4" />
                        <span>Use voice</span>
                      </button>
                      <button
                        type="submit"
                        disabled={!textInput.trim()}
                        className={`px-6 py-3 rounded-full flex items-center gap-2 transition-opacity ${isDark
                          ? 'bg-white text-slate-900'
                          : 'bg-slate-900 text-white'
                          } ${!textInput.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span>Send</span>
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                ) : (
                  // Voice input mode
                  <>
                    {!audioBlob ? (
                      <div className="flex flex-col items-center gap-4">
                        <motion.button
                          type="button"
                          onClick={handleRecord}
                          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 scale-110' : buttonBg
                            }`}
                          whileHover={{ scale: isRecording ? 1.1 : 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isRecording ? (
                            <MicOff className="w-10 h-10 text-white" />
                          ) : (
                            <Mic className={`w-10 h-10 ${textClass}`} />
                          )}
                        </motion.button>

                        {!isRecording && isSupported && (
                          <button
                            type="button"
                            onClick={switchToText}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${buttonBg} ${mutedClass}`}
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Type instead</span>
                          </button>
                        )}

                        {isRecording && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className={mutedClass}>Recording...</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Review recording
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={handlePlay}
                          className={`w-14 h-14 rounded-full flex items-center justify-center ${buttonBg}`}
                        >
                          {isPlaying ? (
                            <Pause className={`w-6 h-6 ${textClass}`} />
                          ) : (
                            <Play className={`w-6 h-6 ${textClass}`} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleReset}
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${buttonBg}`}
                        >
                          <RotateCcw className={`w-5 h-5 ${mutedClass}`} />
                        </button>
                        <button
                          type="button"
                          onClick={processRecording}
                          className={`px-6 py-3 rounded-full flex items-center gap-2 ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                            }`}
                        >
                          <span>Send</span>
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* Sending animation */}
            {phase === 'sending' && (
              <motion.div
                key="sending"
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-slate-100'
                    }`}
                  animate={{ scale: [1, 1.1, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Send className={`w-8 h-8 ${textClass}`} />
                </motion.div>
              </motion.div>
            )}

            {/* Processing states */}
            {(phase === 'transcribing' || phase === 'responding') && (
              <motion.div
                key="processing"
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-2">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-500"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* 8gent is speaking */}
            {phase === 'playing' && (
              <motion.div
                key="playing"
                className="flex flex-col items-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springs.gentle}
              >
                <motion.button
                  type="button"
                  onClick={handlePlayClaw}
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-slate-100'
                    }`}
                  animate={isPlaying ? {
                    boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0)', '0 0 0 20px rgba(59, 130, 246, 0.1)', '0 0 0 0 rgba(59, 130, 246, 0)']
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Volume2 className={`w-10 h-10 ${textClass}`} />
                </motion.button>

                <motion.p
                  className={`text-lg max-w-sm leading-relaxed ${textClass}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  "{displayedText}"
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-5 bg-current ml-0.5 align-middle"
                  />
                </motion.p>
              </motion.div>
            )}

            {/* Finishing */}
            {phase === 'finishing' && (
              <motion.div
                key="finishing"
                className="flex flex-col items-center gap-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <p className={`text-lg max-w-sm leading-relaxed ${textClass}`}>
                  "{clawResponse}"
                </p>

                <motion.div
                  className="flex items-center gap-1.5 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/40' : 'bg-slate-400'}`}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.button
        type="button"
        className={`absolute bottom-12 text-sm transition-colors ${mutedClass} hover:opacity-100`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        whileHover={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        onClick={handleSkip}
      >
        Skip this step
      </motion.button>
    </motion.div>
  );
}
