'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion, PanInfo } from 'framer-motion';
import { Send, ChevronDown, Trash2, Mic, Loader2, Volume2, VolumeX, Sparkles, Phone, Paperclip, Wrench, Check, AlertCircle } from 'lucide-react';
import { useFileAttachment } from '@/hooks/useFileAttachment';
import { AttachmentPreview, HiddenFileInput } from '@/components/chat/AttachmentButton';
import { ClawAIAvatar } from '@/components/claw-ai/ClawAIAvatar';
import { Streamdown } from 'streamdown';
import { useSessionBrain } from '@/context/SessionBrainContext';
import { useAppContext } from '@/context/AppContext';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { usePauseMusicForVoice } from '@/hooks/usePauseMusicForVoice';
import { VoiceRecordingIndicator } from '@/components/claw-ai/VoiceRecordingIndicator';
import { VoiceCallScreen, useVoiceCall, VoiceOverlay } from '@/components/voice-call';
import { useVoiceMode } from '@/hooks/useVoiceMode';
import '@/lib/themes/themes.css';

interface LiquidGlassChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ToolUsed {
  name: string;
  result?: { success: boolean; data?: unknown; error?: string };
}

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
  toolsUsed?: ToolUsed[];
}

// Dynamic initial message based on context
function getInitialMessage(appName?: string, appDescription?: string): Message {
  let content = "Hey! I'm Claw AI. Tell me what you're building or what brings you here today.";

  if (appName && appName !== 'Home') {
    content = `Hey! I see you're in ${appName}. ${appDescription ? `That's the ${appDescription.toLowerCase()}. ` : ''}How can I help you here?`;
  }

  return {
    id: 'initial',
    role: 'assistant',
    content,
    timestamp: Date.now(),
  };
}

export function LiquidGlassChatOverlay({ isOpen, onClose }: LiquidGlassChatOverlayProps) {
  const prefersReducedMotion = useReducedMotion();
  const {
    session,
    addChatMessage,
    clearChatHistory,
    getChatHistory,
  } = useSessionBrain();

  // Get current app context for awareness
  const { currentApp, suggestedPrompts, contextHints, currentRoute } = useAppContext();

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Memoized initial message based on current app
  const initialMessage = useMemo(
    () => getInitialMessage(currentApp?.name, currentApp?.description),
    [currentApp?.name, currentApp?.description]
  );

  // Build app context payload for API
  const appContextPayload = useMemo(() => {
    if (!currentApp) return null;
    return {
      appId: currentApp.id,
      appName: currentApp.name,
      route: currentRoute,
      description: currentApp.description,
      contextHints,
    };
  }, [currentApp, currentRoute, contextHints]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Voice recorder for iMessage/WhatsApp style voice messages
  const voiceRecorder = useVoiceRecorder({
    maxDuration: 120,
    levelsCount: 16,
  });

  // Voice chat for TTS responses (uses ElevenLabs by default)
  const voiceChat = useVoiceChat({
    voice: 'nova',
    autoSpeak: true,
  });

  // Pause music when recording or AI is speaking
  usePauseMusicForVoice({
    isRecording: voiceRecorder.isRecording,
    isSpeaking: voiceChat.mode === 'speaking',
    isTranscribing,
  });

  // Voice call for real-time conversation (FaceTime-style)
  const [voiceCallState, voiceCallActions] = useVoiceCall();
  const [isCallScreenOpen, setIsCallScreenOpen] = useState(false);

  const handleStartCall = useCallback(async () => {
    setIsCallScreenOpen(true);
    await voiceCallActions.startCall();
  }, [voiceCallActions]);

  const handleEndCall = useCallback(() => {
    voiceCallActions.endCall();
  }, [voiceCallActions]);

  const handleCloseCallScreen = useCallback(() => {
    setIsCallScreenOpen(false);
  }, []);

  // New voice mode (Claude-style with ambient glow and tap-anywhere)
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);

  // File attachment support
  const fileAttachment = useFileAttachment({
    maxFiles: 5,
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    onError: (error) => console.error('[Chat] Attachment error:', error),
  });

  const voiceMode = useVoiceMode({
    onTranscriptUpdate: (transcript) => {
      console.log('[VoiceMode] Transcript:', transcript);
    },
    onResponseStart: () => {
      console.log('[VoiceMode] AI response starting');
    },
    onResponseEnd: (response) => {
      console.log('[VoiceMode] AI response complete');
      // Add messages to chat history
      if (voiceMode.transcript) {
        addChatMessage('user', voiceMode.transcript);
      }
      if (response) {
        addChatMessage('assistant', response);
      }
    },
    onError: (error) => {
      console.error('[VoiceMode] Error:', error);
    },
  });

  const handleStartVoiceMode = useCallback(async () => {
    setIsVoiceModeOpen(true);
    await voiceMode.start();
  }, [voiceMode]);

  const handleVoiceModeTap = useCallback(() => {
    if (voiceMode.state === 'listening') {
      voiceMode.send();
    } else if (voiceMode.state === 'speaking') {
      voiceMode.interrupt();
    }
  }, [voiceMode]);

  const handleCloseVoiceMode = useCallback(() => {
    voiceMode.stop();
    setIsVoiceModeOpen(false);
  }, [voiceMode]);

  // Sync with SessionBrain on mount and when chat history changes
  useEffect(() => {
    const history = getChatHistory();
    if (history.length > 0) {
      const mapped = history.map((msg) => ({
        id: msg.id,
        role: msg.role as 'assistant' | 'user',
        content: msg.content,
        timestamp: msg.timestamp,
      }));
      setLocalMessages(mapped);
      setShowSuggestions(false); // Hide suggestions once conversation started
    } else {
      setLocalMessages([initialMessage]);
      setShowSuggestions(true);
    }
  }, [getChatHistory, session.chatHistory, initialMessage]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Handle Escape key to close the overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSend = async () => {
    const hasText = inputValue.trim().length > 0;
    const hasAttachments = fileAttachment.hasAttachments;

    if (!hasText && !hasAttachments) return;

    const userContent = inputValue.trim();
    const attachments = fileAttachment.attachments;

    // Clear input and attachments
    setInputValue('');
    fileAttachment.clearAttachments();
    setShowSuggestions(false); // Hide suggestions after first message

    // Build message content including attachment info
    let displayContent = userContent;
    if (attachments.length > 0) {
      const attachmentNames = attachments.map(a => a.name).join(', ');
      displayContent = userContent
        ? `${userContent}\n\n[Attached: ${attachmentNames}]`
        : `[Attached: ${attachmentNames}]`;
    }

    // Add user message
    const userMessage = addChatMessage('user', displayContent);
    setLocalMessages((prev) => [
      ...prev,
      {
        id: userMessage.id,
        role: 'user',
        content: displayContent,
        timestamp: userMessage.timestamp,
      },
    ]);

    setIsTyping(true);

    // Get attachments as base64 for API
    const attachmentsBase64 = await fileAttachment.getAttachmentsAsBase64();

    // Call API for response - include app context so James knows what's behind the chat
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...localMessages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userContent || 'Please analyze the attached files.' },
          ],
          model: 'qualification',
          enableTools: true, // Enable tools for hybrid provider
          appContext: appContextPayload,
          attachments: attachmentsBase64.length > 0 ? attachmentsBase64 : undefined,
        }),
      });

      let assistantContent = "I'm having trouble connecting right now. Let me try again in a moment.";
      let toolsUsed: ToolUsed[] | undefined;

      if (response.ok) {
        const data = await response.json();
        assistantContent = data.message || data.content || assistantContent;
        // Capture tools used from the response
        if (data.toolsUsed && Array.isArray(data.toolsUsed) && data.toolsUsed.length > 0) {
          toolsUsed = data.toolsUsed.map((t: { name: string; result?: unknown }) => ({
            name: t.name,
            result: t.result ? { success: true, data: t.result } : undefined,
          }));
        }
      }

      const assistantMessage = addChatMessage('assistant', assistantContent);
      setLocalMessages((prev) => [
        ...prev,
        {
          id: assistantMessage.id,
          role: 'assistant',
          content: assistantContent,
          timestamp: assistantMessage.timestamp,
          toolsUsed,
        },
      ]);

      // Speak the response if voice is enabled
      if (voiceChat.isVoiceEnabled) {
        voiceChat.speakResponse(assistantContent);
      }
    } catch {
      const fallbackContent = "I'm having trouble connecting right now. Please try again in a moment.";
      const assistantMessage = addChatMessage('assistant', fallbackContent);
      setLocalMessages((prev) => [
        ...prev,
        {
          id: assistantMessage.id,
          role: 'assistant',
          content: fallbackContent,
          timestamp: assistantMessage.timestamp,
        },
      ]);

      // Speak fallback if voice is enabled
      if (voiceChat.isVoiceEnabled) {
        voiceChat.speakResponse(fallbackContent);
      }
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    clearChatHistory();
    setLocalMessages([initialMessage]);
    setShowSuggestions(true);
  };

  // Handle sending message with specific text (for voice transcription)
  const handleSendWithText = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userContent = text.trim();
    setShowSuggestions(false); // Hide suggestions after first message

    // Add user message
    const userMessage = addChatMessage('user', userContent);
    setLocalMessages((prev) => [
      ...prev,
      {
        id: userMessage.id,
        role: 'user',
        content: userContent,
        timestamp: userMessage.timestamp,
      },
    ]);

    setIsTyping(true);

    // Call API for response - include app context so James knows what's behind the chat
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...localMessages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userContent },
          ],
          model: 'qualification',
          enableTools: true, // Enable tools for hybrid provider
          appContext: appContextPayload,
        }),
      });

      let assistantContent = "I'm having trouble connecting right now. Let me try again in a moment.";
      let toolsUsedVoice: ToolUsed[] | undefined;

      if (response.ok) {
        const data = await response.json();
        assistantContent = data.message || data.content || assistantContent;
        // Capture tools used from the response
        if (data.toolsUsed && Array.isArray(data.toolsUsed) && data.toolsUsed.length > 0) {
          toolsUsedVoice = data.toolsUsed.map((t: { name: string; result?: unknown }) => ({
            name: t.name,
            result: t.result ? { success: true, data: t.result } : undefined,
          }));
        }
      }

      const assistantMessage = addChatMessage('assistant', assistantContent);
      setLocalMessages((prev) => [
        ...prev,
        {
          id: assistantMessage.id,
          role: 'assistant',
          content: assistantContent,
          timestamp: assistantMessage.timestamp,
          toolsUsed: toolsUsedVoice,
        },
      ]);

      // Speak the response if voice is enabled
      if (voiceChat.isVoiceEnabled) {
        voiceChat.speakResponse(assistantContent);
      }
    } catch {
      const fallbackContent = "I'm having trouble connecting right now. Please try again in a moment.";
      const assistantMessage = addChatMessage('assistant', fallbackContent);
      setLocalMessages((prev) => [
        ...prev,
        {
          id: assistantMessage.id,
          role: 'assistant',
          content: fallbackContent,
          timestamp: assistantMessage.timestamp,
        },
      ]);

      // Speak fallback if voice is enabled
      if (voiceChat.isVoiceEnabled) {
        voiceChat.speakResponse(fallbackContent);
      }
    }

    setIsTyping(false);
  }, [localMessages, addChatMessage, voiceChat, appContextPayload]);

  // Handle voice recording completion - transcribe and send
  const handleVoiceRecordingComplete = useCallback(async () => {
    const audioBlob = await voiceRecorder.stopRecording();
    if (!audioBlob || audioBlob.size === 0) {
      return;
    }

    setIsTranscribing(true);

    try {
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
      await handleVoiceRecordingComplete();
    } else {
      await voiceRecorder.startRecording();
    }
  }, [voiceRecorder, handleVoiceRecordingComplete]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Chat Sheet */}
          <motion.div
            key="chat-sheet"
            ref={containerRef}
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.5 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.2 }
                : { type: 'spring' as const, damping: 30, stiffness: 300 }
            }
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 z-50 flex flex-col max-h-[85vh] sm:max-h-[70vh] touch-none px-2 sm:px-4"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-dialog-title"
            aria-describedby="chat-dialog-description"
          >
            {/* Glass container */}
            <div
              className="flex flex-col h-full overflow-hidden rounded-t-3xl border border-border/30 border-b-0 bg-background/95"
              style={{
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                boxShadow: '0 -10px 40px hsl(var(--theme-background) / 0.3), inset 0 1px 0 hsl(var(--theme-foreground) / 0.05)',
              }}
            >
              {/* Drag handle - transparent area */}
              <div
                className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing"
                style={{ background: 'transparent' }}
              >
                <div className="w-10 h-1 bg-muted-foreground/40 rounded-full" />
              </div>

              {/* Header - more transparent, becomes glass on scroll */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b border-border/30"
                style={{ background: 'hsl(var(--theme-card) / 0.5)' }}
              >
                <div className="flex items-center gap-3">
                  <ClawAIAvatar
                    size={40}
                    isActive={isTyping || voiceChat.mode === 'speaking'}
                  />
                  <div>
                    <h3 id="chat-dialog-title" className="text-foreground font-semibold text-base">Claw AI</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
                      <p id="chat-dialog-description" className="text-muted-foreground text-xs">Online</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Voice mode button (Claude-style ambient) */}
                  <motion.button
                    onClick={handleStartVoiceMode}
                    disabled={isVoiceModeOpen || voiceCallState.status !== 'idle'}
                    className="p-2 rounded-full hover:bg-muted transition-colors group text-muted-foreground hover:text-primary disabled:opacity-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Start voice mode with Claw AI"
                  >
                    <Phone className="w-4 h-4" />
                  </motion.button>

                  {/* Speaker toggle for TTS */}
                  <motion.button
                    onClick={voiceChat.toggleVoice}
                    className={`p-2 rounded-full hover:bg-muted transition-colors group ${
                      voiceChat.isVoiceEnabled ? 'text-green-400' : 'text-muted-foreground'
                    }`}
                    whileTap={{ scale: 0.9 }}
                    aria-label={voiceChat.isVoiceEnabled ? 'Disable voice responses' : 'Enable voice responses'}
                  >
                    {voiceChat.isVoiceEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4 group-hover:text-foreground/60" />
                    )}
                  </motion.button>

                  {localMessages.length > 1 && (
                    <motion.button
                      onClick={handleClearChat}
                      className="p-2 rounded-full hover:bg-muted transition-colors group text-muted-foreground"
                      whileTap={{ scale: 0.9 }}
                      aria-label="Clear chat"
                    >
                      <Trash2 className="w-4 h-4 group-hover:text-foreground/60" />
                    </motion.button>
                  )}
                  <motion.button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close chat"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 min-h-[200px]"
                style={{
                  background: 'linear-gradient(180deg, transparent 0%, hsl(var(--theme-background) / 0.3) 100%)',
                }}
              >
                {localMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'text-primary-foreground'
                        : 'bg-card/80 text-card-foreground border border-border/50'
                    }`}
                    style={{
                      backdropFilter: message.role === 'assistant' ? 'blur(10px)' : undefined,
                      background: message.role === 'user'
                        ? 'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)'
                        : undefined,
                      boxShadow: message.role === 'user'
                        ? '0 4px 12px hsl(var(--theme-primary) / 0.3)'
                        : undefined,
                    }}
                  >
                    {message.role === 'assistant' ? (
                      <>
                        <div className="text-sm leading-relaxed break-words prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-code:text-xs prose-code:bg-muted prose-code:text-foreground prose-pre:my-2 prose-pre:bg-muted prose-pre:rounded-lg">
                          <Streamdown>{message.content}</Streamdown>
                        </div>
                        {/* Tool execution indicators */}
                        {message.toolsUsed && message.toolsUsed.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-border/30 flex flex-wrap gap-1.5">
                            {message.toolsUsed.map((tool, i) => (
                              <span
                                key={`${tool.name}-${i}`}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground text-xs"
                              >
                                {tool.result?.success ? (
                                  <Check className="w-3 h-3 text-green-500" />
                                ) : tool.result?.error ? (
                                  <AlertCircle className="w-3 h-3 text-destructive" />
                                ) : (
                                  <Wrench className="w-3 h-3" />
                                )}
                                {tool.name.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {message.content}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}

                {/* Suggested prompts - show when chat just started */}
                <AnimatePresence>
                  {showSuggestions && suggestedPrompts.length > 0 && localMessages.length <= 1 && !isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-wrap gap-2 py-2"
                    >
                      {suggestedPrompts.slice(0, 3).map((prompt, i) => (
                        <motion.button
                          key={i}
                          onClick={() => {
                            setInputValue(prompt.prompt);
                            inputRef.current?.focus();
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs transition-all backdrop-blur-sm border border-border/50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Sparkles className="w-3 h-3" />
                          {prompt.label}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-card/80 border border-border/50 rounded-2xl px-4 py-3 backdrop-blur-sm">
                      <div className="flex gap-1.5">
                        <motion.span
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.span
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                        />
                        <motion.span
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div
                className="p-4 border-t border-border/30"
                style={{
                  paddingBottom: 'max(1rem, calc(env(safe-area-inset-bottom, 0px) + 0.5rem))',
                  background: 'hsl(var(--theme-card) / 0.3)',
                }}
              >
                {/* Transcribing indicator */}
                <AnimatePresence>
                  {isTranscribing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3"
                    >
                      <div className="bg-muted rounded-xl px-4 py-3 border border-border">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          <span className="text-muted-foreground text-sm">
                            Transcribing your message...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hidden file input */}
                <HiddenFileInput
                  inputRef={fileAttachment.fileInputRef}
                  onChange={fileAttachment.handleFileInputChange}
                  accept={fileAttachment.acceptedTypesString}
                />

                {/* Attachment preview */}
                <AnimatePresence>
                  {fileAttachment.hasAttachments && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-2"
                    >
                      <AttachmentPreview
                        attachments={fileAttachment.attachments}
                        onRemove={fileAttachment.removeAttachment}
                        formatFileSize={fileAttachment.formatFileSize}
                        variant="glass"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-3">
                  {/* Attachment button */}
                  <motion.button
                    onClick={fileAttachment.openFilePicker}
                    disabled={isTranscribing || isTyping || voiceRecorder.isRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full transition-all flex-shrink-0 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground disabled:opacity-50"
                    aria-label="Attach file"
                  >
                    <Paperclip className="w-5 h-5" />
                  </motion.button>

                  {/* Microphone button */}
                  {voiceRecorder.isSupported && (
                    <motion.button
                      onClick={handleMicToggle}
                      disabled={isTranscribing || isTyping}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-full transition-all flex-shrink-0 ${
                        voiceRecorder.isRecording
                          ? 'bg-destructive text-destructive-foreground'
                          : isTranscribing
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      }`}
                      aria-label={voiceRecorder.isRecording ? 'Stop recording' : 'Start voice message'}
                    >
                      {isTranscribing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </motion.button>
                  )}

                  {/* Recording indicator or input field */}
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
                      <motion.div
                        key="input"
                        className="flex-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Message Claw AI..."
                          disabled={isTranscribing}
                          className="w-full bg-muted rounded-full px-4 py-3 text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-border/50"
                          style={{
                            backdropFilter: 'blur(10px)',
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Send button - hidden during recording */}
                  <AnimatePresence>
                    {!voiceRecorder.isRecording && (
                      <motion.button
                        onClick={handleSend}
                        disabled={(!inputValue.trim() && !fileAttachment.hasAttachments) || isTranscribing}
                        whileHover={(inputValue.trim() || fileAttachment.hasAttachments) && !isTranscribing ? { scale: 1.05 } : {}}
                        whileTap={(inputValue.trim() || fileAttachment.hasAttachments) && !isTranscribing ? { scale: 0.95 } : {}}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`p-3 rounded-full transition-all flex-shrink-0 ${
                          (inputValue.trim() || fileAttachment.hasAttachments) && !isTranscribing
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                        style={(inputValue.trim() || fileAttachment.hasAttachments) && !isTranscribing ? {
                          boxShadow: '0 4px 15px hsl(var(--theme-primary) / 0.4)',
                        } : undefined}
                        aria-label="Send message"
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Voice error messages */}
                <AnimatePresence>
                  {(voiceRecorder.error || voiceChat.error) && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 text-xs text-destructive text-center"
                    >
                      {voiceRecorder.error?.message || voiceChat.error?.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Voice Mode Overlay (Claude-style ambient) */}
      <VoiceOverlay
        key="voice-mode-overlay"
        isOpen={isVoiceModeOpen}
        state={voiceMode.state}
        onTapAnywhere={handleVoiceModeTap}
        onClose={handleCloseVoiceMode}
        audioIntensity={voiceMode.audioIntensity}
        transcript={voiceMode.transcript}
        response={voiceMode.response}
      />

      {/* Legacy Voice Call Screen (FaceTime-style) - keeping for potential A/B testing */}
      <VoiceCallScreen
        key="voice-call-screen"
        isOpen={isCallScreenOpen}
        onClose={handleCloseCallScreen}
        status={voiceCallState.status === 'idle' ? 'connecting' : voiceCallState.status}
        duration={voiceCallState.duration}
        isMuted={voiceCallState.isMuted}
        isSpeakerOn={voiceCallState.isSpeakerOn}
        userAudioLevels={voiceCallState.userAudioLevels}
        aiAudioLevels={voiceCallState.aiAudioLevels}
        onToggleMute={voiceCallActions.toggleMute}
        onToggleSpeaker={voiceCallActions.toggleSpeaker}
        onEndCall={handleEndCall}
      />
    </AnimatePresence>
  );
}
