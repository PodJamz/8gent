'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { X, Send, Mic, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { ClawAIAvatar } from '@/components/claw-ai/ClawAIAvatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { VoiceRecordingIndicator } from '@/components/claw-ai/VoiceRecordingIndicator';
import { ToolExecution } from '@/components/claw-ai/ToolExecution';
import { useAgenticActions, AgenticAction } from '@/hooks/useAgenticActions';
import { useProject } from '@/context/ProjectContext';
import { usePauseMusicForVoice } from '@/hooks/usePauseMusicForVoice';

interface ClawAIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ToolUsed {
  name: string;
  arguments: Record<string, unknown>;
  result?: {
    success: boolean;
    data?: Record<string, unknown>;
    error?: string;
  };
}

interface ToolAction {
  type:
    | 'navigate' | 'open_calendar' | 'show_results' | 'show_available_times' | 'show_bookings' | 'booking_confirmed'
    | 'render_ui' | 'render_component' | 'open_search' | 'show_kanban'
    | 'project_created' | 'prd_created' | 'prd_sharded' | 'ticket_created' | 'ticket_updated'
    | 'memory_stored' | 'memory_recalled' | 'memory_learned' | 'memory_deleted'
    | 'file_read' | 'file_written' | 'directory_listed' | 'files_searched'
    | 'git_status' | 'git_diff' | 'git_committed' | 'git_pushed' | 'branch_created' | 'repo_cloned'
    | 'command_executed' | 'server_started' | 'preview_ready'
    | 'coding_task_created' | 'coding_task_updated'
    | 'cron_job_created' | 'cron_job_updated' | 'cron_job_deleted' | 'cron_jobs_listed'
    | 'context_loaded' | 'context_updated'
    | 'conversation_compacted' | 'compaction_retrieved'
    | 'message_sent'
    | 'check_provider_status';
  payload: Record<string, unknown>;
}

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  suggestedThemes?: { name: string; href: string; description: string }[];
  toolsUsed?: ToolUsed[];
  actions?: ToolAction[];
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "Claw AI here... can I help you with understanding where we could work together? Tell me a bit about your business or what you're looking to build.",
  suggestedThemes: undefined,
};

// Design themes mapped to business types/niches
const THEME_SUGGESTIONS: Record<string, { name: string; href: string; description: string }[]> = {
  tech: [
    { name: 'Claude', href: '/design/claude', description: 'Warm, approachable AI aesthetic' },
    { name: 'ChatGPT', href: '/design/chatgpt', description: 'Clean, conversational interface' },
    { name: 'Cyberpunk', href: '/design/cyberpunk', description: 'High-tech futuristic edge' },
  ],
  wellness: [
    { name: 'Nature', href: '/design/nature', description: 'Organic, grounding design' },
    { name: 'Northern Lights', href: '/design/northern-lights', description: 'Ethereal, calming beauty' },
    { name: 'Zen', href: '/design/zen', description: 'Minimal, peaceful aesthetic' },
  ],
  creative: [
    { name: 'Candyland', href: '/design/candyland', description: 'Playful, colorful joy' },
    { name: 'Synthwave', href: '/design/synthwave', description: 'Retro-futuristic vibes' },
    { name: 'Art Deco', href: '/design/art-deco', description: 'Elegant, timeless sophistication' },
  ],
  finance: [
    { name: 'Corporate', href: '/design/corporate', description: 'Professional trust-building' },
    { name: 'Minimal', href: '/design/modern-minimal', description: 'Clean, focused clarity' },
    { name: 'Dark Mode', href: '/design/dark', description: 'Sleek, modern interface' },
  ],
  food: [
    { name: 'Coffee', href: '/design/coffee', description: 'Warm, inviting atmosphere' },
    { name: 'Nature', href: '/design/nature', description: 'Fresh, organic feel' },
    { name: 'Vintage', href: '/design/vintage', description: 'Nostalgic, authentic charm' },
  ],
  default: [
    { name: 'Claude', href: '/design/claude', description: 'Warm, approachable AI' },
    { name: 'Minimal', href: '/design/modern-minimal', description: 'Clean simplicity' },
    { name: 'Nature', href: '/design/nature', description: 'Organic grounding' },
  ],
};

function detectNiche(text: string): string {
  const lower = text.toLowerCase();
  if (lower.match(/tech|ai|software|app|saas|startup|developer|code|platform/)) return 'tech';
  if (lower.match(/health|wellness|fitness|yoga|meditation|therapy|coach/)) return 'wellness';
  if (lower.match(/design|art|creative|agency|brand|studio|photography/)) return 'creative';
  if (lower.match(/finance|bank|invest|trading|crypto|money|accounting/)) return 'finance';
  if (lower.match(/food|restaurant|cafe|coffee|bakery|catering|chef/)) return 'food';
  return 'default';
}

export function ClawAIChat({ isOpen, onClose }: ClawAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Project context for active project management
  const { activeProject, setActiveProject, createProject, addTask } = useProject();

  // SECURITY: Get authenticated user ID from Clerk
  const { user } = useUser();
  const ownerId = user?.id ?? 'anonymous';
  const { executeAction, isAgenticAction } = useAgenticActions({
    ownerId,
    onProjectCreated: (projectId, slug) => {
      // Update local project context to track the new project
      createProject({ name: slug, color: '#8b5cf6' });
    },
    onPRDCreated: (prdId) => {
    },
    onTicketCreated: (ticketId) => {
    },
    onTicketUpdated: (ticketId) => {
    },
    onPRDSharded: (result) => {
    },
  });

  // Handle navigation from tool actions
  const handleNavigate = useCallback((url: string) => {
    onClose();
    router.push(url);
  }, [onClose, router]);

  // Voice chat integration (for TTS responses)
  const voiceChat = useVoiceChat({
    voice: 'nova',
    autoSpeak: true,
    onTranscriptComplete: (transcript) => {
      if (transcript.trim()) {
        setInputValue(transcript);
        // Auto-send after voice input
        handleSendWithText(transcript);
      }
    },
  });

  // Voice recorder state (hooks defined after handleSendWithText)
  const [isTranscribing, setIsTranscribing] = useState(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Core send function that accepts text parameter
  const handleSendWithText = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Process the message
    const niche = detectNiche(userMessage.content);
    const themes = THEME_SUGGESTIONS[niche];

    // Call the actual API for a personalized response
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content }
          ],
          model: 'qualification',
          enableTools: true, // Enable tools for hybrid provider
        }),
      });

      let assistantContent: string;
      let toolsUsed: ToolUsed[] | undefined;
      let actions: ToolAction[] | undefined;

      if (response.ok) {
        const data = await response.json();
        assistantContent = data.message || getContextualResponse(userMessage.content, niche);
        toolsUsed = data.toolsUsed;
        actions = data.actions;

        // Handle tool actions
        if (actions?.length) {
          for (const action of actions) {
            // Handle navigation actions
            if (action.type === 'navigate' && action.payload.url) {
              // Delay navigation slightly so user sees the response
              setTimeout(() => {
                handleNavigate(action.payload.url as string);
              }, 1500);
            }
            if (action.type === 'open_calendar' && action.payload.url) {
              window.open(action.payload.url as string, '_blank');
            }
            if (action.type === 'open_search' && action.payload.url) {
              // Open search app with query - close chat and navigate
              setTimeout(() => {
                handleNavigate(action.payload.url as string);
              }, 800);
            }

            // Handle agentic product lifecycle actions
            if (isAgenticAction(action)) {
              try {
                const agenticAction: AgenticAction = {
                  type: action.type as AgenticAction['type'],
                  payload: action.payload,
                };
                const result = await executeAction(agenticAction);
                if (!result.success) {
                  console.error(`[Claw AI] Agentic action ${action.type} failed:`, result.error);
                }
              } catch (err) {
                console.error(`[Claw AI] Error executing agentic action ${action.type}:`, err);
              }
            }
          }
        }
      } else {
        assistantContent = getContextualResponse(userMessage.content, niche);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        suggestedThemes: !toolsUsed?.length ? themes : undefined,
        toolsUsed,
        actions,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Speak the response if voice is enabled
      if (voiceChat.isVoiceEnabled) {
        voiceChat.speakResponse(assistantContent);
      }
    } catch {
      const assistantContent = getContextualResponse(userMessage.content, niche);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        suggestedThemes: themes,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Speak fallback response if voice is enabled
      if (voiceChat.isVoiceEnabled) {
        voiceChat.speakResponse(assistantContent);
      }
    }

    setIsTyping(false);
  }, [messages, voiceChat, handleNavigate]);

  // Voice recorder for iMessage/WhatsApp style voice messages
  const voiceRecorder = useVoiceRecorder({
    maxDuration: 120, // 2 minutes max
    levelsCount: 16, // Number of waveform bars
  });

  // Pause music when recording or AI is speaking
  usePauseMusicForVoice({
    isRecording: voiceRecorder.isRecording,
    isSpeaking: voiceChat.mode === 'speaking',
    isTranscribing,
  });

  // Handle voice recording completion - transcribe and send
  const handleVoiceRecordingComplete = useCallback(async () => {
    const audioBlob = await voiceRecorder.stopRecording();
    if (!audioBlob || audioBlob.size === 0) {
      return;
    }

    setIsTranscribing(true);

    try {
      // Send to Whisper API for transcription
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', 'en');

      const response = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const { text } = await response.json();

      if (text && text.trim()) {
        // Send the transcribed message
        await handleSendWithText(text.trim());
      }
    } catch (error) {
      console.error('[Voice] Transcription error:', error);
    } finally {
      setIsTranscribing(false);
    }
  }, [voiceRecorder, handleSendWithText]);

  // Toggle voice recording
  const handleMicToggle = useCallback(async () => {
    if (voiceRecorder.isRecording) {
      // Stop recording and transcribe
      await handleVoiceRecordingComplete();
    } else {
      // Start recording
      await voiceRecorder.startRecording();
    }
  }, [voiceRecorder, handleVoiceRecordingComplete]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    await handleSendWithText(inputValue);
  };

  const getContextualResponse = (userInput: string, niche: string): string => {
    const responses: Record<string, string> = {
      tech: "Brilliant! Tech products need that perfect balance of sophistication and accessibility. I've worked with startups and established tech companies alike,what matters is finding the right visual language that builds trust while feeling cutting-edge. Have a look at these themes that might resonate with your vision:",
      wellness: "Wonderful space to be in! Wellness brands need designs that breathe,that invite calm and trust. The visual experience should feel like the first deep breath of a good session. Here are some themes that embody that grounding energy:",
      creative: "Ah, a fellow creative! You'll appreciate that every pixel tells a story. The challenge is finding a visual identity that's distinctive without being distracting from the work itself. These themes might spark some inspiration:",
      finance: "Trust is everything in your world, isn't it? The design needs to feel solid, reliable,but not boring. Modern finance is about accessibility too. Check out these themes that balance professionalism with approachability:",
      food: "Food is so visceral,your design needs to make people hungry before they even taste anything! Warmth, authenticity, and that invitation to gather. Here are some themes that might whet your appetite:",
      default: "Interesting! Every project has its own personality waiting to be discovered. The best designs come from really understanding the people you're serving. Have a wander through these themes,see what resonates with you:",
    };
    return responses[niche];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 top-16 bottom-24 sm:inset-x-auto sm:right-8 sm:top-auto sm:bottom-8 sm:w-[400px] sm:h-[550px] z-50 flex flex-col overflow-hidden"
              style={{ maxWidth: 'calc(100vw - 32px)' }}
            >
              <LiquidGlass
                variant="card"
                intensity="medium"
                className="!p-0 flex flex-col h-full w-full overflow-hidden !rounded-3xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <ClawAIAvatar
                        size={40}
                        isActive={isTyping || voiceChat.mode === 'speaking'}
                      />
                      {/* Recording/Voice indicator */}
                      {voiceRecorder.isRecording ? (
                        <motion.div
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-black/50"
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        />
                      ) : voiceChat.isVoiceEnabled ? (
                        <motion.div
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black/50"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        />
                      ) : null}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Claw AI</h3>
                      <p className="text-white/50 text-xs">
                        {voiceRecorder.isRecording ? 'Recording...' :
                         isTranscribing ? 'Transcribing...' :
                         voiceChat.mode === 'speaking' ? 'Speaking...' :
                         isTyping ? 'Thinking...' :
                         'Creative Technologist'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onClose()}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-white/20 text-white'
                            : 'bg-white/10 text-white/90'
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>

                        {/* Tool executions */}
                        {message.toolsUsed && message.toolsUsed.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.toolsUsed.map((tool, idx) => (
                              <ToolExecution
                                key={`${tool.name}-${idx}`}
                                toolName={tool.name}
                                status="complete"
                                result={tool.result}
                                onNavigate={handleNavigate}
                              />
                            ))}
                          </div>
                        )}

                        {/* Theme suggestions */}
                        {message.suggestedThemes && (
                          <div className="mt-3 space-y-2">
                            {message.suggestedThemes.map((theme) => (
                              <Link
                                key={theme.href}
                                href={theme.href}
                                onClick={() => onClose()}
                                className="block"
                              >
                                <motion.div
                                  whileHover={{ scale: 1.02, x: 4 }}
                                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-white font-medium text-sm">{theme.name}</span>
                                    <span className="text-white/40 text-xs">→</span>
                                  </div>
                                  <p className="text-white/50 text-xs mt-1">{theme.description}</p>
                                </motion.div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/10 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10">
                  {/* Transcribing indicator */}
                  <AnimatePresence>
                    {isTranscribing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-3"
                      >
                        <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                            <span className="text-white/60 text-sm">
                              Transcribing your message...
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-2">
                    {/* Microphone button - iMessage/WhatsApp style */}
                    {voiceRecorder.isSupported && (
                      <motion.button
                        onClick={handleMicToggle}
                        disabled={isTranscribing || isTyping}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-full transition-all flex-shrink-0 ${
                          voiceRecorder.isRecording
                            ? 'bg-red-500 text-white'
                            : isTranscribing
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-white/10 text-white/60 hover:bg-white/20'
                        }`}
                        title={
                          voiceRecorder.isRecording
                            ? 'Tap to stop and send'
                            : isTranscribing
                            ? 'Transcribing...'
                            : 'Tap to record voice message'
                        }
                      >
                        {isTranscribing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </motion.button>
                    )}

                    {/* Recording indicator with waveform and timer */}
                    <AnimatePresence mode="wait">
                      {voiceRecorder.isRecording ? (
                        <motion.div
                          key="recording"
                          className="flex-1 flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <VoiceRecordingIndicator
                            isRecording={voiceRecorder.isRecording}
                            duration={voiceRecorder.duration}
                            audioLevels={voiceRecorder.audioLevels}
                            className="flex-1"
                          />
                        </motion.div>
                      ) : (
                        <motion.input
                          key="input"
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Tell me about your project..."
                          className="flex-1 bg-white/10 rounded-full px-4 py-3 text-white text-base placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                          disabled={isTranscribing}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Send button - hidden during recording */}
                    <AnimatePresence>
                      {!voiceRecorder.isRecording && (
                        <motion.button
                          onClick={handleSend}
                          disabled={!inputValue.trim() || isTranscribing}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`p-3 rounded-full transition-colors flex-shrink-0 ${
                            inputValue.trim() && !isTranscribing
                              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                              : 'bg-white/10 text-white/40'
                          }`}
                        >
                          {isTyping ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Voice toggle for TTS responses */}
                  <div className="flex items-center justify-between mt-3">
                    <button
                      onClick={voiceChat.toggleVoice}
                      className={`flex items-center gap-2 text-xs transition-colors ${
                        voiceChat.isVoiceEnabled
                          ? 'text-green-400'
                          : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      {voiceChat.isVoiceEnabled ? (
                        <Volume2 className="w-3 h-3" />
                      ) : (
                        <VolumeX className="w-3 h-3" />
                      )}
                      <span>{voiceChat.isVoiceEnabled ? 'Voice responses on' : 'Voice responses off'}</span>
                    </button>
                  </div>

                  {/* Error messages */}
                  <AnimatePresence>
                    {(voiceRecorder.error || voiceChat.error) && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-xs text-red-400 text-center"
                      >
                        {voiceRecorder.error?.message || voiceChat.error?.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </LiquidGlass>
            </motion.div>
          </>
        )}
    </AnimatePresence>
  );
}

export default ClawAIChat;
