'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Send, Plus, Clock, ChevronDown, PenLine, GraduationCap, FolderOpen, Calendar, Mail, Heart, BookOpen, MessageCircle, Zap, Mic, Image, Loader2, Terminal, FileCode, GitBranch, Check, Circle, Folder, File, Play, Square, CheckCircle2, Clock3, FileText, Table, Presentation, ChevronRight, Copy, CornerDownLeft } from 'lucide-react';
import '@/lib/themes/themes.css';
import { ColorPalette, themeColors } from '@/components/design/ColorPalette';
import { CopyThemePrompt, themePromptData } from '@/components/design/CopyThemePrompt';
import { IconShowcase } from '@/components/design/IconShowcase';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';

// Claude's asterisk/flower logo
const ClaudeLogo = ({ className = "w-8 h-8", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 2C12.5 2 12.9 2.4 12.9 2.9V7.1C12.9 7.6 12.5 8 12 8C11.5 8 11.1 7.6 11.1 7.1V2.9C11.1 2.4 11.5 2 12 2Z"/>
    <path d="M12 16C12.5 16 12.9 16.4 12.9 16.9V21.1C12.9 21.6 12.5 22 12 22C11.5 22 11.1 21.6 11.1 21.1V16.9C11.1 16.4 11.5 16 12 16Z"/>
    <path d="M22 12C22 12.5 21.6 12.9 21.1 12.9H16.9C16.4 12.9 16 12.5 16 12C16 11.5 16.4 11.1 16.9 11.1H21.1C21.6 11.1 22 11.5 22 12Z"/>
    <path d="M8 12C8 12.5 7.6 12.9 7.1 12.9H2.9C2.4 12.9 2 12.5 2 12C2 11.5 2.4 11.1 2.9 11.1H7.1C7.6 11.1 8 11.5 8 12Z"/>
    <path d="M19.07 4.93C19.46 5.32 19.46 5.95 19.07 6.34L16.24 9.17C15.85 9.56 15.22 9.56 14.83 9.17C14.44 8.78 14.44 8.15 14.83 7.76L17.66 4.93C18.05 4.54 18.68 4.54 19.07 4.93Z"/>
    <path d="M9.17 14.83C9.56 15.22 9.56 15.85 9.17 16.24L6.34 19.07C5.95 19.46 5.32 19.46 4.93 19.07C4.54 18.68 4.54 18.05 4.93 17.66L7.76 14.83C8.15 14.44 8.78 14.44 9.17 14.83Z"/>
    <path d="M19.07 19.07C18.68 19.46 18.05 19.46 17.66 19.07L14.83 16.24C14.44 15.85 14.44 15.22 14.83 14.83C15.22 14.44 15.85 14.44 16.24 14.83L19.07 17.66C19.46 18.05 19.46 18.68 19.07 19.07Z"/>
    <path d="M9.17 9.17C8.78 9.56 8.15 9.56 7.76 9.17L4.93 6.34C4.54 5.95 4.54 5.32 4.93 4.93C5.32 4.54 5.95 4.54 6.34 4.93L9.17 7.76C9.56 8.15 9.56 8.78 9.17 9.17Z"/>
  </svg>
);

export default function ClaudePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chatSectionRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const watchDNA = useMemo(() => themeToWatch('claude'), []);
  const [inputValue, setInputValue] = useState('');
  const [heroInputValue, setHeroInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageMode, setImageMode] = useState(false);
  const [messages, setMessages] = useState<Array<{
    role: string;
    content: string;
    imageUrl?: string;
    revisedPrompt?: string;
  }>>([
    {
      role: 'user',
      content: 'What makes great design?',
    },
    {
      role: 'assistant',
      content: `So here's the thing about great design. It should feel inevitable. Like, when you see it, you think "of course, why would it be any other way?"

For me, design is fundamentally about empathy. It's understanding what someone needs before they even articulate it. Look at Claude's interface. Those warm terracotta tones, the clean typography, the way it greets you differently based on the time of day. These aren't just aesthetic choices; they're about making technology feel human.

The best interfaces feel like conversations with a thoughtful friend. Responsive, clear, and genuinely helpful. What aspects of design thinking are you most curious about?`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Scroll to bottom of messages when new ones arrive
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Web Speech API for voice input
  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const windowWithSpeech = window as any;
    const SpeechRecognitionAPI = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => prev + transcript);
    };

    recognition.start();
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'night owl';
    if (hour < 12) return 'early bird';
    if (hour < 17) return 'friend';
    if (hour < 21) return 'there';
    return 'night owl';
  };

  const handleHeroSend = () => {
    if (!heroInputValue.trim()) return;
    const userMessage = heroInputValue.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setHeroInputValue('');
    setIsTyping(true);

    // Scroll to the main chat section with a slight delay for state update
    setTimeout(() => {
      if (chatSectionRef.current) {
        const yOffset = -80; // Account for fixed header
        const y = chatSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 150);

    // Make the API call
    sendMessage(newMessages);
  };

  const sendMessage = async (newMessages: Array<{ role: string; content: string }>) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          model: 'claude',
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content,
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I appreciate the thoughtful question! You know, the way I see it, color in UI isn't just decoration. It's communication. Take this warm terracotta you're seeing right now. It's not random. It creates a feeling of approachability, of humanity in what could otherwise feel like cold technology.

The best color choices feel inevitable. They should enhance understanding, not compete for attention. Ask me anything about design philosophy. I could honestly talk about this stuff for hours!`,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateImage = async (prompt: string) => {
    setIsGeneratingImage(true);
    setImageMode(false);
    setMessages(prev => [...prev, { role: 'user', content: `Generate an image: ${prompt}` }]);

    try {
      const response = await fetch('/api/image-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.revisedPrompt || 'Here\'s your generated image:',
        imageUrl: data.imageUrl,
        revisedPrompt: data.revisedPrompt,
      }]);
    } catch (error) {
      console.error('Image generation error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I wasn't able to generate that image. ${error instanceof Error ? error.message : 'Please try again with a different prompt.'}`,
      }]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSendOrGenerate = () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue.trim();
    setInputValue('');

    if (imageMode) {
      generateImage(userMessage);
    } else {
      const newMessages = [...messages, { role: 'user', content: userMessage }];
      setMessages(newMessages);
      setIsTyping(true);
      sendMessage(newMessages);
    }
  };

  return (
    <div
      ref={containerRef}
      data-design-theme="claude"
      className="min-h-screen relative"
      style={{
        backgroundColor: 'hsl(var(--theme-background))',
        fontFamily: 'var(--theme-font)',
      }}
    >
      {/* Progress indicator */}
      <motion.div
        className="fixed top-14 left-0 right-0 h-[2px] z-40 origin-left"
        style={{
          scaleX: scrollYProgress,
          backgroundColor: 'hsl(var(--theme-primary))',
        }}
      />

      {/* Header */}
      <DesignHeader
        currentTheme="claude"
        backHref="/design"
        backText="Back to Gallery"
        showToolbar={true}
        themeLabel="Claude"
        onReferenceToAI={(prompt) => {
          // Store for 8gent and optionally navigate
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('openclaw_theme_reference', prompt);
            sessionStorage.setItem('openclaw_theme_reference_timestamp', Date.now().toString());
          }
        }}
        rightContent={
          <div className="flex items-center gap-2">
            <ClaudeLogo className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
            <span
              className="text-sm font-medium hidden sm:inline"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              Claude Design System
            </span>
          </div>
        }
      />

      {/* Hero Section - Claude.ai Style */}
      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center">
        <div className="max-w-4xl mx-auto px-6 py-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Claude.ai Style Welcome */}
            <div className="flex items-center justify-center gap-3 mb-16">
              <ClaudeLogo className="w-10 h-10" style={{ color: 'hsl(var(--theme-primary))' }} />
              <h1
                className="text-3xl md:text-4xl font-normal"
                style={{
                  color: 'hsl(var(--theme-foreground))',
                  fontFamily: 'var(--theme-font-heading)',
                }}
              >
                Hello, {getGreeting()}
              </h1>
            </div>

            {/* Chat Input Area - Claude.ai Style */}
            <div className="max-w-2xl mx-auto mb-8">
              <div
                className="rounded-2xl border overflow-hidden"
                style={{
                  borderColor: 'hsl(var(--theme-border))',
                  backgroundColor: 'hsl(var(--theme-card))',
                }}
              >
                <div className="px-4 py-4">
                  <input
                    type="text"
                    placeholder="How can I help you today?"
                    value={heroInputValue}
                    onChange={(e) => setHeroInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleHeroSend()}
                    className="w-full bg-transparent text-base outline-none"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  />
                </div>
                <div
                  className="px-4 py-3 flex items-center justify-between border-t"
                  style={{ borderColor: 'hsl(var(--theme-border))' }}
                >
                  <div className="flex items-center gap-1">
                    <button
                      className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                      style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                      style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                    >
                      <Clock className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm hover:opacity-70 transition-opacity"
                      style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                    >
                      <span>Opus 4.5</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleHeroSend}
                      className="p-2.5 rounded-xl transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: heroInputValue.trim() ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-muted))',
                        color: heroInputValue.trim() ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
                      }}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions - Claude.ai Style */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { icon: PenLine, label: 'Write' },
                { icon: GraduationCap, label: 'Learn' },
                { icon: FolderOpen, label: 'From Drive', color: '#34A853' },
                { icon: Calendar, label: 'From Calendar', color: '#4285F4' },
                { icon: Mail, label: 'From Gmail', color: '#EA4335' },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all hover:opacity-80"
                  style={{
                    borderColor: 'hsl(var(--theme-border))',
                    color: 'hsl(var(--theme-foreground))',
                  }}
                >
                  <action.icon
                    className="w-4 h-4"
                    style={{ color: action.color || 'hsl(var(--theme-muted-foreground))' }}
                  />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Chat Interface */}
      <section ref={chatSectionRef} className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2
            className="text-2xl font-medium mb-8 text-center"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            Chat with 8gent
          </h2>

          {/* Chat container */}
          <div
            className="rounded-2xl border overflow-hidden shadow-lg flex flex-col"
            style={{
              borderColor: 'hsl(var(--theme-border))',
              backgroundColor: 'hsl(var(--theme-card))',
              height: '500px',
            }}
          >
            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className="flex-1 p-6 space-y-6 overflow-y-auto"
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 mt-1">
                      <ClaudeLogo className="w-6 h-6" style={{ color: 'hsl(var(--theme-primary))' }} />
                    </div>
                  )}
                  <div className={message.role === 'user' ? 'max-w-[80%]' : 'max-w-[85%]'}>
                    {message.role === 'assistant' && (
                      <p className="text-xs font-medium mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                        8gent
                      </p>
                    )}
                    <div
                      className={`${message.role === 'user' ? 'px-4 py-3 rounded-2xl' : ''}`}
                      style={{
                        backgroundColor: message.role === 'user' ? 'hsl(var(--theme-muted))' : 'transparent',
                        color: 'hsl(var(--theme-foreground))',
                      }}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      {message.imageUrl && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-3"
                        >
                          <img
                            src={message.imageUrl}
                            alt={message.revisedPrompt || 'Generated image'}
                            className="rounded-xl max-w-full shadow-lg"
                            style={{ maxHeight: '400px' }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {(isTyping || isGeneratingImage) && (
                  <motion.div
                    className="flex gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <ClaudeLogo className="w-6 h-6" style={{ color: 'hsl(var(--theme-primary))' }} />
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                        8gent {isGeneratingImage && '- Creating image...'}
                      </p>
                      <div className="flex gap-1 py-2">
                        <motion.div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input area */}
            <div
              className="px-4 py-3 border-t"
              style={{ borderColor: 'hsl(var(--theme-border))' }}
            >
              {/* Image mode indicator */}
              <AnimatePresence>
                {imageMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-2 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2"
                    style={{
                      backgroundColor: 'hsl(var(--theme-primary) / 0.1)',
                      color: 'hsl(var(--theme-primary))',
                    }}
                  >
                    <Image className="w-3 h-3" />
                    Image mode - describe what you want to generate
                  </motion.div>
                )}
              </AnimatePresence>
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-2xl border transition-colors"
                style={{
                  borderColor: imageMode ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-border))',
                  backgroundColor: 'hsl(var(--theme-background))',
                }}
              >
                {/* Image generation toggle button */}
                <button
                  onClick={() => setImageMode(!imageMode)}
                  className="p-2 rounded-lg transition-all hover:opacity-70"
                  style={{
                    backgroundColor: imageMode ? 'hsl(var(--theme-primary))' : 'transparent',
                    color: imageMode ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
                  }}
                  title={imageMode ? "Switch to chat mode" : "Switch to image generation mode"}
                  disabled={isGeneratingImage}
                >
                  {isGeneratingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Image className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="text"
                  placeholder={imageMode ? "Describe the image you want..." : "Ask about design philosophy..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendOrGenerate();
                    }
                  }}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                />
                <button
                  onClick={startListening}
                  className={`p-2 rounded-lg transition-all hover:opacity-70 ${isListening ? 'animate-pulse' : ''}`}
                  style={{
                    backgroundColor: isListening ? 'hsl(var(--theme-primary))' : 'transparent',
                    color: isListening ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
                  }}
                  title="Click to speak"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSendOrGenerate}
                  className="p-2 rounded-lg transition-opacity hover:opacity-70"
                  style={{
                    backgroundColor: inputValue.trim() ? 'hsl(var(--theme-primary))' : 'transparent',
                    color: inputValue.trim() ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-muted-foreground))',
                  }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Claude Code Terminal UI Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-2xl font-medium mb-4 text-center"
              style={{
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
            >
              Claude Code Terminal
            </h2>
            <p
              className="text-center mb-8 max-w-xl mx-auto"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              AI-powered coding in your terminal. Claude Code brings the warmth of conversational AI to the command line.
            </p>

            {/* Terminal Emulator */}
            <div
              className="rounded-xl overflow-hidden shadow-2xl border"
              style={{
                backgroundColor: '#1a1612',
                borderColor: 'hsl(var(--theme-border))',
              }}
            >
              {/* Terminal Header */}
              <div
                className="px-4 py-3 flex items-center justify-between border-b"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs text-white/50 ml-2 font-mono">claude-code ~/projects/website</span>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-white/40" />
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-4 font-mono text-sm space-y-4" style={{ minHeight: '400px' }}>
                {/* Command Input */}
                <div className="flex items-start gap-2">
                  <span style={{ color: 'hsl(var(--theme-primary))' }}>$</span>
                  <span className="text-white/90">claude &quot;add a contact form with validation&quot;</span>
                </div>

                {/* Status Indicator */}
                <motion.div
                  className="flex items-center gap-2 text-white/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Circle className="w-3 h-3" style={{ color: 'hsl(var(--theme-primary))' }} />
                  </motion.div>
                  <span className="text-xs">Thinking...</span>
                </motion.div>

                {/* File Tree */}
                <motion.div
                  className="pl-4 space-y-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-white/40 text-xs mb-2">Creating files:</div>
                  <div className="flex items-center gap-2 text-green-400">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>src/components/ContactForm.tsx</span>
                    <Check className="w-3 h-3 ml-auto" />
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>src/lib/validation.ts</span>
                    <Check className="w-3 h-3 ml-auto" />
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>src/app/contact/page.tsx</span>
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-xs ml-auto"
                    >
                      writing...
                    </motion.span>
                  </div>
                </motion.div>

                {/* Code Preview */}
                <motion.div
                  className="mt-4 rounded-lg overflow-hidden"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <span className="text-xs text-white/40">ContactForm.tsx</span>
                    <Copy className="w-3.5 h-3.5 text-white/30 hover:text-white/60 cursor-pointer" />
                  </div>
                  <pre className="p-3 text-xs overflow-x-auto">
                    <code>
                      <span className="text-pink-400">export</span> <span className="text-pink-400">function</span> <span className="text-yellow-300">ContactForm</span><span className="text-white/60">()</span> <span className="text-white/60">{'{'}</span>{'\n'}
                      {'  '}<span className="text-pink-400">const</span> <span className="text-white/80">[</span><span className="text-blue-300">formData</span><span className="text-white/80">, </span><span className="text-blue-300">setFormData</span><span className="text-white/80">]</span> <span className="text-pink-400">=</span> <span className="text-yellow-300">useState</span><span className="text-white/60">(</span><span className="text-white/60">{'{'}</span>{'\n'}
                      {'    '}<span className="text-white/60">name:</span> <span className="text-green-300">&apos;&apos;</span><span className="text-white/60">,</span>{'\n'}
                      {'    '}<span className="text-white/60">email:</span> <span className="text-green-300">&apos;&apos;</span><span className="text-white/60">,</span>{'\n'}
                      {'    '}<span className="text-white/60">message:</span> <span className="text-green-300">&apos;&apos;</span>{'\n'}
                      {'  '}<span className="text-white/60">{'}'})</span><span className="text-white/60">;</span>{'\n'}
                      {'\n'}
                      {'  '}<span className="text-pink-400">const</span> <span className="text-yellow-300">handleSubmit</span> <span className="text-pink-400">=</span> <span className="text-pink-400">async</span> <span className="text-white/60">(</span><span className="text-orange-300">e</span><span className="text-white/60">)</span> <span className="text-pink-400">=&gt;</span> <span className="text-white/60">{'{'}</span>{'\n'}
                      {'    '}<span className="text-white/60">e.</span><span className="text-yellow-300">preventDefault</span><span className="text-white/60">();</span>{'\n'}
                      {'    '}<span className="text-gray-500">// Validation logic here...</span>{'\n'}
                      {'  '}<span className="text-white/60">{'}'}</span><span className="text-white/60">;</span>
                    </code>
                  </pre>
                </motion.div>

                {/* Command Palette Hint */}
                <motion.div
                  className="flex items-center gap-2 text-white/30 text-xs mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50">Esc</kbd>
                  <span>to interrupt</span>
                  <span className="mx-2">|</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50">Tab</kbd>
                  <span>to accept</span>
                  <span className="mx-2">|</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50">/help</kbd>
                  <span>for commands</span>
                </motion.div>
              </div>

              {/* Terminal Input */}
              <div
                className="px-4 py-3 border-t flex items-center gap-2"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <span style={{ color: 'hsl(var(--theme-primary))' }} className="font-mono">$</span>
                <input
                  type="text"
                  placeholder="Ask Claude to help with code..."
                  className="flex-1 bg-transparent text-white/80 text-sm font-mono outline-none placeholder:text-white/30"
                  disabled
                />
                <CornerDownLeft className="w-4 h-4 text-white/30" />
              </div>
            </div>

            {/* Terminal Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[
                { icon: Terminal, title: 'Native Terminal', desc: 'Works in your existing workflow' },
                { icon: GitBranch, title: 'Git Aware', desc: 'Understands your repo context' },
                { icon: FileCode, title: 'Multi-file Edits', desc: 'Coordinates changes across files' },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className="p-4 rounded-xl border text-center"
                  style={{
                    borderColor: 'hsl(var(--theme-border))',
                    backgroundColor: 'hsl(var(--theme-card))',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <feature.icon
                    className="w-6 h-6 mx-auto mb-2"
                    style={{ color: 'hsl(var(--theme-primary))' }}
                  />
                  <h4 className="font-medium text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    {feature.title}
                  </h4>
                  <p className="text-xs mt-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Claude Cowork Workspace Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-2xl font-medium mb-4 text-center"
              style={{
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
            >
              Claude Cowork
            </h2>
            <p
              className="text-center mb-8 max-w-xl mx-auto"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Your autonomous desktop assistant. Assign tasks, watch progress, and receive polished deliverables.
            </p>

            {/* Cowork Interface */}
            <div
              className="rounded-xl overflow-hidden shadow-2xl border"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                backgroundColor: 'hsl(var(--theme-card))',
              }}
            >
              {/* Cowork Header */}
              <div
                className="px-6 py-4 flex items-center justify-between border-b"
                style={{ borderColor: 'hsl(var(--theme-border))' }}
              >
                <div className="flex items-center gap-3">
                  <ClaudeLogo className="w-6 h-6" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <div>
                    <h3 className="font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                      Cowork Session
                    </h3>
                    <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      Working in ~/Documents/Q4 Planning
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-1 rounded-full text-xs flex items-center gap-1"
                    style={{
                      backgroundColor: 'hsl(var(--theme-primary) / 0.1)',
                      color: 'hsl(var(--theme-primary))',
                    }}
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    Working
                  </span>
                </div>
              </div>

              {/* Task Assignment */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Task Input & Progress */}
                <div className="space-y-4">
                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      borderColor: 'hsl(var(--theme-border))',
                      backgroundColor: 'hsl(var(--theme-background))',
                    }}
                  >
                    <label className="text-xs font-medium mb-2 block" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      Current Task
                    </label>
                    <p className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                      Create a comprehensive Q4 planning document with budget analysis, team goals, and milestone timeline
                    </p>
                  </div>

                  {/* Progress Timeline */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      Progress
                    </h4>
                    {[
                      { status: 'complete', label: 'Analyzing existing documents', time: '2m ago' },
                      { status: 'complete', label: 'Creating budget spreadsheet', time: '1m ago' },
                      { status: 'active', label: 'Writing executive summary', time: 'now' },
                      { status: 'pending', label: 'Generating timeline visualization', time: 'next' },
                      { status: 'pending', label: 'Final review and formatting', time: 'upcoming' },
                    ].map((step, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        {step.status === 'complete' && (
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        )}
                        {step.status === 'active' && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Circle className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(var(--theme-primary))' }} />
                          </motion.div>
                        )}
                        {step.status === 'pending' && (
                          <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm flex-1 ${step.status === 'pending' ? 'opacity-50' : ''}`}
                          style={{ color: 'hsl(var(--theme-foreground))' }}
                        >
                          {step.label}
                        </span>
                        <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                          {step.time}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right: Output Preview */}
                <div className="space-y-4">
                  <h4 className="text-xs font-medium" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    Generated Files
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: FileText, name: 'Q4_Planning.docx', status: 'writing' },
                      { icon: Table, name: 'Budget_Analysis.xlsx', status: 'complete' },
                      { icon: Presentation, name: 'Timeline.pptx', status: 'pending' },
                      { icon: FileText, name: 'Team_Goals.md', status: 'complete' },
                    ].map((file, i) => (
                      <motion.div
                        key={file.name}
                        className="p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                        style={{
                          borderColor: file.status === 'writing' ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-border))',
                          backgroundColor: 'hsl(var(--theme-background))',
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <file.icon
                          className="w-8 h-8 mb-2"
                          style={{
                            color: file.status === 'pending'
                              ? 'hsl(var(--theme-muted-foreground))'
                              : 'hsl(var(--theme-primary))',
                          }}
                        />
                        <p
                          className="text-xs font-medium truncate"
                          style={{ color: 'hsl(var(--theme-foreground))' }}
                        >
                          {file.name}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                          {file.status === 'complete' && 'Ready to open'}
                          {file.status === 'writing' && 'In progress...'}
                          {file.status === 'pending' && 'Queued'}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Folder Access */}
                  <div
                    className="p-3 rounded-lg border flex items-center gap-3"
                    style={{
                      borderColor: 'hsl(var(--theme-border))',
                      backgroundColor: 'hsl(var(--theme-background))',
                    }}
                  >
                    <Folder className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
                    <div className="flex-1">
                      <p className="text-xs font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                        Working Directory
                      </p>
                      <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                        ~/Documents/Q4 Planning
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                  </div>
                </div>
              </div>

              {/* Cowork Actions */}
              <div
                className="px-6 py-4 border-t flex items-center justify-between"
                style={{ borderColor: 'hsl(var(--theme-border))' }}
              >
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border"
                    style={{
                      borderColor: 'hsl(var(--theme-border))',
                      color: 'hsl(var(--theme-muted-foreground))',
                    }}
                  >
                    <Square className="w-3 h-3" />
                    Pause
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border"
                    style={{
                      borderColor: 'hsl(var(--theme-border))',
                      color: 'hsl(var(--theme-muted-foreground))',
                    }}
                  >
                    <MessageCircle className="w-3 h-3" />
                    Add Note
                  </button>
                </div>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  Estimated completion: ~3 minutes
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terminal Color Palette */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-2xl font-medium mb-4 text-center"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            Terminal Colors
          </h2>
          <p
            className="text-center mb-8 max-w-xl mx-auto"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            ANSI-inspired colors tuned for readability. Warm undertones maintain the Claude aesthetic in dark environments.
          </p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {[
              { name: 'Black', color: '#1a1612', ansi: '0' },
              { name: 'Red', color: '#E57373', ansi: '1' },
              { name: 'Green', color: '#81C784', ansi: '2' },
              { name: 'Yellow', color: '#FFD54F', ansi: '3' },
              { name: 'Blue', color: '#64B5F6', ansi: '4' },
              { name: 'Magenta', color: '#F06292', ansi: '5' },
              { name: 'Cyan', color: '#4DD0E1', ansi: '6' },
              { name: 'White', color: '#FAFAF9', ansi: '7' },
            ].map((c) => (
              <motion.div
                key={c.name}
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className="w-full aspect-square rounded-lg mb-2 shadow-inner cursor-pointer"
                  style={{ backgroundColor: c.color }}
                  onClick={() => {
                    navigator.clipboard.writeText(c.color);
                  }}
                />
                <p className="text-xs font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                  {c.name}
                </p>
                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  ANSI {c.ansi}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Syntax Highlighting Preview */}
          <div
            className="mt-8 rounded-xl overflow-hidden border"
            style={{
              backgroundColor: '#1a1612',
              borderColor: 'hsl(var(--theme-border))',
            }}
          >
            <div className="px-4 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <span className="text-xs text-white/50">Syntax Highlighting</span>
            </div>
            <pre className="p-4 text-sm font-mono overflow-x-auto">
              <code>
                <span className="text-pink-400">const</span> <span className="text-blue-300">theme</span> <span className="text-white/60">=</span> <span className="text-white/60">{'{'}</span>{'\n'}
                {'  '}<span className="text-white/80">name:</span> <span className="text-green-300">&apos;claude&apos;</span><span className="text-white/60">,</span>{'\n'}
                {'  '}<span className="text-white/80">primary:</span> <span className="text-green-300">&apos;#D97757&apos;</span><span className="text-white/60">,</span> <span className="text-gray-500">// Warm terracotta</span>{'\n'}
                {'  '}<span className="text-white/80">background:</span> <span className="text-green-300">&apos;#FAF9F6&apos;</span><span className="text-white/60">,</span>{'\n'}
                {'  '}<span className="text-white/80">warmth:</span> <span className="text-yellow-300">0.85</span><span className="text-white/60">,</span>{'\n'}
                <span className="text-white/60">{'}'}</span><span className="text-white/60">;</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Component Library */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-2xl font-medium mb-4 text-center"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            Component Library
          </h2>
          <p
            className="text-center mb-8 max-w-xl mx-auto"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            UI primitives that embody Claude&apos;s design language. Warm, accessible, and purposefully crafted.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Status Badges */}
            <div
              className="p-6 rounded-xl border"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                backgroundColor: 'hsl(var(--theme-card))',
              }}
            >
              <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
                Status Badges
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Complete
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: 'hsl(var(--theme-primary) / 0.1)',
                    color: 'hsl(var(--theme-primary))',
                  }}
                >
                  In Progress
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                  Thinking
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  Error
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div
              className="p-6 rounded-xl border"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                backgroundColor: 'hsl(var(--theme-card))',
              }}
            >
              <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
                Buttons
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{
                    backgroundColor: 'hsl(var(--theme-primary))',
                    color: 'hsl(var(--theme-primary-foreground))',
                  }}
                >
                  Primary
                </button>
                <button
                  className="px-4 py-2 rounded-xl text-sm font-medium border"
                  style={{
                    borderColor: 'hsl(var(--theme-border))',
                    color: 'hsl(var(--theme-foreground))',
                  }}
                >
                  Secondary
                </button>
                <button
                  className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{
                    backgroundColor: 'hsl(var(--theme-muted))',
                    color: 'hsl(var(--theme-muted-foreground))',
                  }}
                >
                  Ghost
                </button>
              </div>
            </div>

            {/* Input Fields */}
            <div
              className="p-6 rounded-xl border"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                backgroundColor: 'hsl(var(--theme-card))',
              }}
            >
              <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
                Input Fields
              </h4>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Default input"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{
                    borderColor: 'hsl(var(--theme-border))',
                    backgroundColor: 'hsl(var(--theme-background))',
                    color: 'hsl(var(--theme-foreground))',
                  }}
                />
                <input
                  type="text"
                  placeholder="Focused state"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{
                    borderColor: 'hsl(var(--theme-primary))',
                    backgroundColor: 'hsl(var(--theme-background))',
                    color: 'hsl(var(--theme-foreground))',
                  }}
                />
              </div>
            </div>

            {/* Progress Indicators */}
            <div
              className="p-6 rounded-xl border"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                backgroundColor: 'hsl(var(--theme-card))',
              }}
            >
              <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
                Progress
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Processing</span>
                    <span style={{ color: 'hsl(var(--theme-muted-foreground))' }}>67%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                      initial={{ width: 0 }}
                      animate={{ width: '67%' }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                  </motion.div>
                  <span className="text-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    Loading...
                  </span>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div
              className="p-6 rounded-xl border"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                backgroundColor: 'hsl(var(--theme-card))',
              }}
            >
              <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
                Task Card
              </h4>
              <div
                className="p-3 rounded-lg border"
                style={{
                  borderColor: 'hsl(var(--theme-border))',
                  backgroundColor: 'hsl(var(--theme-background))',
                }}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                      Review documentation
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      Completed 2 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* File Tree */}
            <div
              className="p-6 rounded-xl border"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                backgroundColor: 'hsl(var(--theme-card))',
              }}
            >
              <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
                File Tree
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2" style={{ color: 'hsl(var(--theme-foreground))' }}>
                  <Folder className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <span>src</span>
                </div>
                <div className="flex items-center gap-2 pl-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  <File className="w-4 h-4" />
                  <span>index.ts</span>
                </div>
                <div className="flex items-center gap-2 pl-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  <FileCode className="w-4 h-4" />
                  <span>App.tsx</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Iconography Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-2xl font-medium mb-4 text-center"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            Iconography
          </h2>
          <p
            className="text-center mb-8 max-w-xl mx-auto"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            Clean, rounded icons that match the friendly aesthetic. Consistent stroke weight maintains visual harmony.
          </p>
          <IconShowcase variant="grid" iconSet="all" />
        </div>
      </section>

      {/* Theme Timepiece Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-2xl font-medium mb-4 text-center"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            Theme Timepiece
          </h2>
          <p
            className="text-center mb-8 max-w-xl mx-auto"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            A watch face generated from Claude&apos;s warm terracotta palette.
            Timeless design meets thoughtful technology.
          </p>
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <WatchFace
                watchDNA={watchDNA}
                size="lg"
                showCase={true}
                interactive={true}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Color Palette Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-2xl font-medium mb-4 text-center"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            Color Palette
          </h2>
          <p
            className="text-center mb-8 max-w-xl mx-auto"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            Warm terracotta anchors the palette, creating a sense of humanity
            in digital spaces. Click any color to copy its hex value.
          </p>
          <ColorPalette colors={themeColors.claude} />
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-2xl font-medium mb-12 text-center"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            Design Principles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.id}
                className="p-6 rounded-xl border"
                style={{
                  borderColor: 'hsl(var(--theme-border))',
                  backgroundColor: 'hsl(var(--theme-card))',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <principle.icon
                  className="w-8 h-8 mb-4"
                  style={{ color: 'hsl(var(--theme-primary))' }}
                />
                <h3
                  className="text-lg font-medium mb-2"
                  style={{ color: 'hsl(var(--theme-foreground))' }}
                >
                  {principle.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <blockquote
            className="text-xl md:text-2xl font-medium leading-relaxed mb-6"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            &ldquo;The goal is not to build AI that passes as human,
            but AI that helps humans flourish.&rdquo;
          </blockquote>
          <cite
            className="text-sm not-italic"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            - Anthropic Design Philosophy
          </cite>
        </div>
      </section>

      {/* Copy Theme Prompt Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-2xl font-medium mb-4 text-center"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            Export Theme
          </h2>
          <p
            className="text-center mb-8 max-w-xl mx-auto"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            Copy a comprehensive prompt containing all theme details. Perfect for applying this aesthetic to any AI-assisted project.
          </p>
          <div className="flex justify-center">
            <CopyThemePrompt theme={themePromptData.claude} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 border-t"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2
            className="text-2xl font-medium mb-8"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            Explore More
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/design"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90"
              style={{
                backgroundColor: 'hsl(var(--theme-primary))',
                color: 'hsl(var(--theme-primary-foreground))',
              }}
            >
              View Theme Gallery
            </Link>
            <Link
              href="/design/chatgpt"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border transition-all hover:opacity-90"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                color: 'hsl(var(--theme-foreground))',
              }}
            >
              Explore ChatGPT Theme
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-6 border-t"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <p
            className="text-sm"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            Claude Design System
          </p>
          <p
            className="text-sm"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            8gent
          </p>
        </div>
      </footer>
    </div>
  );
}

const principles = [
  {
    id: 'warmth',
    icon: Heart,
    title: 'Human Warmth',
    description: 'Terracotta tones and soft edges create an interface that feels approachable and alive, not cold or mechanical.',
  },
  {
    id: 'clarity',
    icon: BookOpen,
    title: 'Thoughtful Clarity',
    description: 'Every element serves a purpose. Information is presented with care, respecting the user\'s attention and time.',
  },
  {
    id: 'intelligence',
    icon: Zap,
    title: 'Visible Intelligence',
    description: 'Design that communicates capability without intimidation. Power made accessible through thoughtful presentation.',
  },
  {
    id: 'helpfulness',
    icon: MessageCircle,
    title: 'Genuine Helpfulness',
    description: 'Interfaces designed to assist, not to impress. Every interaction should leave the user better off than before.',
  },
];
