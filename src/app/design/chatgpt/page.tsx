'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Send, Plus, Settings, MessageSquare, Sparkles, Zap, Shield, Globe, Mic, Image, FileText, Search, ShoppingCart, Bot, MoreHorizontal, ChevronDown, Edit3, Trash2, Loader2, Play, Pause, Volume2, Video, Code2, Copy, ChevronRight, Layers, Brain, Clock, SkipForward, Rewind, Maximize2, PenTool, Type, List, Bold, Italic, Underline, AlignLeft, Upload, Key, Hash, CheckCircle, Eye, RefreshCw, Cpu, FileJson, Terminal } from 'lucide-react';
import '@/lib/themes/themes.css';
import { DesignHeader } from '@/components/design/DesignHeader';
import { WatchFace } from '@/components/watch/WatchFace';
import { themeToWatch } from '@/lib/watch/theme-to-watch';

// ChatGPT Logo - the OpenAI flower/circle shape
const ChatGPTLogo = ({ className = "w-8 h-8", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500528C16.1708 0.495442 14.0893 1.16803 12.3614 2.42014C10.6335 3.67225 9.34853 5.44174 8.69003 7.4768C7.30162 7.86539 5.98957 8.49565 4.80926 9.34077C3.62895 10.1859 2.59766 11.2321 1.76564 12.4327C0.457875 14.3048 -0.193381 16.5481 -0.098061 18.8192C-0.002741 21.0902 0.832851 23.2703 2.28835 25.0253C1.83987 26.3718 1.68428 27.7986 1.83205 29.21C1.97982 30.6215 2.42724 31.9852 3.14467 33.2097C4.20811 35.0619 5.83247 36.5283 7.78339 37.3974C9.73431 38.2665 11.9108 38.4933 14.0002 38.0451C14.9421 39.1066 16.0998 39.9547 17.396 40.5325C18.6922 41.1103 20.0967 41.4046 21.5158 41.3953C23.6507 41.4004 25.7323 40.7279 27.4602 39.4757C29.1881 38.2236 30.4731 36.4542 31.1316 34.4191C32.52 34.0305 33.8321 33.4003 35.0124 32.5552C36.1927 31.71 37.224 30.6638 38.056 29.4632C39.3638 27.5911 40.015 25.3479 39.9197 23.0768C39.8244 20.8057 38.9887 18.6256 37.5324 16.8707ZM21.5158 38.3191C19.6063 38.3245 17.7558 37.6447 16.2846 36.3974C16.3276 36.3731 16.4104 36.3262 16.4638 36.2908L24.2707 31.7652C24.4883 31.6396 24.6684 31.4585 24.7926 31.2399C24.9167 31.0213 24.9806 30.7731 24.9775 30.521V19.2078L28.2077 21.0688C28.2248 21.0788 28.2392 21.0932 28.2495 21.1106C28.2599 21.128 28.266 21.1479 28.2671 21.1684V30.6148C28.2608 32.6676 27.444 34.6341 25.9936 36.0818C24.5432 37.5295 22.5741 38.3421 20.5204 38.3445L21.5158 38.3191ZM5.50716 31.3545C4.55098 29.7457 4.14695 27.8737 4.35795 26.0236C4.39993 26.0501 4.48125 26.101 4.53831 26.1364L12.3453 30.6619C12.5617 30.7895 12.8079 30.8568 13.0586 30.8568C13.3093 30.8568 13.5556 30.7895 13.772 30.6619L23.3074 25.1536V28.8756C23.3086 28.8969 23.3045 28.9181 23.2957 28.9376C23.2868 28.957 23.2735 28.9742 23.2567 28.9876L15.3579 33.5614C13.5693 34.5859 11.4694 34.9074 9.45903 34.4668C7.44864 34.0263 5.66878 32.8529 4.50809 31.1454L5.50716 31.3545ZM3.45555 14.2124C4.41212 12.6009 5.87965 11.3564 7.62476 10.6768C7.62476 10.7233 7.61976 10.8188 7.61976 10.8855L7.61976 19.9366C7.61679 20.1879 7.68061 20.4353 7.80459 20.6533C7.92857 20.8713 8.1084 21.0519 8.32561 21.1771L17.861 26.6854L14.6308 28.5464C14.6129 28.5586 14.5925 28.5661 14.5712 28.5684C14.55 28.5707 14.5285 28.5677 14.5086 28.5598L6.60877 23.9839C4.82329 22.9551 3.4922 21.2909 2.85965 19.3175C2.2271 17.3441 2.33918 15.2038 3.17358 13.307L3.45555 14.2124ZM30.6908 20.8187L21.1554 15.3104L24.3856 13.4494C24.4035 13.4373 24.4239 13.4297 24.4452 13.4274C24.4665 13.4252 24.4879 13.4281 24.5078 13.436L32.4076 18.0119C33.5735 18.6849 34.5357 19.6595 35.1934 20.8335C35.8511 22.0074 36.181 23.3379 36.1489 24.6855C36.1168 26.0331 35.724 27.3464 35.0114 28.4879C34.2988 29.6295 33.2927 30.5575 32.0985 31.175V22.0593C32.1046 21.8069 32.0425 21.5576 31.9186 21.3379C31.7946 21.1182 31.6131 20.9365 31.3931 20.8116L30.6908 20.8187ZM33.908 15.9722C33.8661 15.9458 33.7847 15.8949 33.7277 15.8594L25.9207 11.3339C25.7044 11.2063 25.4581 11.139 25.2074 11.139C24.9567 11.139 24.7104 11.2063 24.4941 11.3339L14.9587 16.8422V13.1202C14.9575 13.099 14.9616 13.0777 14.9704 13.0583C14.9792 13.0388 14.9926 13.0216 15.0093 13.0082L22.9081 8.43438C24.0739 7.76118 25.3948 7.40469 26.7413 7.40018C28.0878 7.39567 29.4111 7.74333 30.5816 8.40869C31.752 9.07405 32.7278 10.0343 33.4136 11.1949C34.0994 12.3555 34.4711 13.6748 34.4929 15.0226C34.4953 15.0476 34.4929 15.0727 34.4859 15.0967L33.908 15.9722ZM13.2555 22.7879L10.0253 20.927C10.0082 20.917 9.99382 20.9026 9.98347 20.8852C9.97311 20.8678 9.96703 20.8479 9.96585 20.8274V11.381C9.96901 10.0327 10.3246 8.71004 10.9966 7.54482C11.6686 6.3796 12.6329 5.41344 13.7948 4.74449C14.9568 4.07554 16.274 3.72734 17.6145 3.73477C18.9551 3.7422 20.2683 4.10504 21.4228 4.78666C21.3808 4.81094 21.2994 4.85689 21.2434 4.89218L13.4365 9.41768C13.2189 9.54331 13.0388 9.72444 12.9147 9.94303C12.7905 10.1616 12.7266 10.4098 12.7297 10.6618L13.2555 22.7879ZM14.9554 19.4957L19.133 17.0796L23.3107 19.4948V24.3252L19.133 26.7403L14.9554 24.3252V19.4957Z" fill="currentColor"/>
  </svg>
);

// Animated Send Button with correct OpenAI teal (#74AA9C)
const AnimatedSendButton = ({ hasContent, onClick }: { hasContent: boolean; onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: hasContent
          ? '#74AA9C'
          : 'hsl(var(--theme-muted))',
      }}
    >
      {hasContent && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #74AA9C, #8FBDB2, #74AA9C)',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
      <Send
        className="w-4 h-4 relative z-10"
        style={{
          color: hasContent ? 'white' : 'hsl(var(--theme-muted-foreground))'
        }}
      />
    </motion.button>
  );
};

export default function ChatGPTPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chatSectionRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const watchDNA = useMemo(() => themeToWatch('chatgpt'), []);
  const [inputValue, setInputValue] = useState('');
  const [heroInputValue, setHeroInputValue] = useState('');
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [messages, setMessages] = useState<Array<{
    role: string;
    content: string;
    imageUrl?: string;
    revisedPrompt?: string;
  }>>([
    {
      role: 'user',
      content: 'What makes your design philosophy unique?',
    },
    {
      role: 'assistant',
      content: `Oh man, I love this question! So look, the way I see it, great design should feel inevitable. Like it couldn't have been done any other way.

Here's the thing about ChatGPT's design that I really admire: they nailed the "invisible complexity" principle. There's this incredibly sophisticated AI under the hood, but the interface just... gets out of the way. You're having a conversation, not operating a machine.

For this theme, I focused on capturing that clean, professional feel. The teal accent that's become so iconic, the conversation-first layout, the subtle animations. Honestly, the details that most people don't consciously notice are the ones that make the biggest difference. Like how the streaming responses create this feeling of real-time thought.

What aspects of design are you most curious about? I could talk about this stuff all day!`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const handleHeroSend = () => {
    if (!heroInputValue.trim()) return;
    const userMessage = heroInputValue.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setHeroInputValue('');
    setShowPlusMenu(false);
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
          model: 'chatgpt',
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
        content: `I appreciate your curiosity about design! While I'm having a moment of reflection, let me share this: the best interfaces feel invisible. They get out of your way and let you focus on what matters. That's what we strive for here.

Try asking me about color theory, typography choices, or how we balance simplicity with power in conversational AI interfaces.`,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);
    sendMessage(newMessages);
  };

  const generateImage = async (prompt: string) => {
    setIsGeneratingImage(true);
    setShowPlusMenu(false);
    setMessages(prev => [...prev, { role: 'user', content: `Generate an image: ${prompt}` }]);

    try {
      const response = await fetch('/api/image-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate image');
      }

      const data = await response.json();
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

  const handleImageGenerate = () => {
    if (!inputValue.trim()) return;
    generateImage(inputValue.trim());
    setInputValue('');
  };

  const plusMenuItems = [
    { icon: Image, label: 'Add photos & files', desc: 'Upload images or documents', action: 'upload' },
    { icon: FileText, label: 'Add from Google Drive', desc: 'Connect your Drive', action: 'drive' },
    { icon: Sparkles, label: 'Create image', desc: 'Generate with GPT Image', action: 'generate-image' },
    { icon: Search, label: 'Deep research', desc: 'Comprehensive analysis', action: 'research' },
    { icon: ShoppingCart, label: 'Shopping research', desc: 'Product comparisons', action: 'shopping' },
    { icon: Bot, label: 'Agent mode', desc: 'Autonomous task completion', action: 'agent' },
    { icon: MoreHorizontal, label: 'More', desc: 'Additional options', action: 'more' },
  ];

  const [imagePromptMode, setImagePromptMode] = useState(false);

  const chatHistory = [
    { id: 1, title: 'Design philosophy discussion', time: 'Just now' },
    { id: 2, title: 'Interface patterns review', time: '2 hours ago' },
    { id: 3, title: 'Color theory exploration', time: 'Yesterday' },
    { id: 4, title: 'Typography best practices', time: 'Yesterday' },
    { id: 5, title: 'Accessibility guidelines', time: '3 days ago' },
  ];

  return (
    <div
      ref={containerRef}
      data-design-theme="chatgpt"
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
        currentTheme="chatgpt"
        backHref="/design"
        backText="Back to Gallery"
        showToolbar={true}
        themeLabel="ChatGPT"
        onReferenceToAI={(prompt) => { if (typeof window !== 'undefined') { sessionStorage.setItem('openclaw_theme_reference', prompt); sessionStorage.setItem('openclaw_theme_reference_timestamp', Date.now().toString()); } }}
        rightContent={
          <div className="flex items-center gap-2">
            <ChatGPTLogo className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
            <span
              className="text-sm font-medium hidden sm:inline"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            >
              ChatGPT
            </span>
          </div>
        }
      />

      {/* Hero Section - ChatGPT Style Greeting */}
      <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <ChatGPTLogo
              className="w-12 h-12 mx-auto mb-8"
              style={{ color: 'hsl(var(--theme-foreground))' }}
            />
            <h1
              className="text-3xl md:text-5xl font-medium leading-tight mb-4"
              style={{
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
            >
              How can I help, J?
            </h1>
            <p
              className="text-lg mb-12"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Ask anything, get instant answers
            </p>

            {/* ChatGPT Style Input */}
            <div className="max-w-2xl mx-auto">
              <div
                className="rounded-3xl border shadow-lg overflow-hidden"
                style={{
                  borderColor: 'hsl(var(--theme-border))',
                  backgroundColor: 'hsl(var(--theme-card))',
                }}
              >
                <div className="flex items-center px-4 py-4 gap-3">
                  {/* Plus Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowPlusMenu(!showPlusMenu)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-70"
                      style={{
                        backgroundColor: 'hsl(var(--theme-muted))',
                        color: 'hsl(var(--theme-foreground))',
                      }}
                    >
                      <Plus className="w-5 h-5" />
                    </button>

                    {/* Plus Menu Dropdown */}
                    <AnimatePresence>
                      {showPlusMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full left-0 mb-2 w-64 rounded-xl border shadow-xl overflow-hidden z-50"
                          style={{
                            backgroundColor: 'hsl(var(--theme-card))',
                            borderColor: 'hsl(var(--theme-border))',
                          }}
                        >
                          {plusMenuItems.map((item, i) => (
                            <button
                              key={i}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:opacity-80 transition-opacity"
                              style={{
                                backgroundColor: 'transparent',
                                borderBottom: i < plusMenuItems.length - 1 ? '1px solid hsl(var(--theme-border))' : 'none',
                              }}
                              onClick={() => {
                                if (item.action === 'generate-image') {
                                  setImagePromptMode(true);
                                }
                                setShowPlusMenu(false);
                              }}
                            >
                              <item.icon className="w-5 h-5" style={{ color: item.action === 'generate-image' ? '#74AA9C' : 'hsl(var(--theme-muted-foreground))' }} />
                              <div>
                                <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>{item.label}</p>
                                <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{item.desc}</p>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Input */}
                  <input
                    type="text"
                    placeholder="Ask anything"
                    value={heroInputValue}
                    onChange={(e) => setHeroInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleHeroSend()}
                    className="flex-1 bg-transparent text-base outline-none"
                    style={{ color: 'hsl(var(--theme-foreground))' }}
                  />

                  {/* Microphone Button */}
                  <button
                    onClick={startListening}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70 ${isListening ? 'animate-pulse' : ''}`}
                    style={{
                      backgroundColor: isListening ? '#74AA9C' : 'transparent',
                      color: isListening ? 'white' : 'hsl(var(--theme-muted-foreground))',
                    }}
                    title="Click to speak"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  {/* Animated Send Button */}
                  <AnimatedSendButton hasContent={heroInputValue.length > 0} onClick={handleHeroSend} />
                </div>
              </div>

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {['Create an image', 'Analyze data', 'Help me write', 'Code something'].map((suggestion) => (
                  <button
                    key={suggestion}
                    className="px-4 py-2 rounded-full text-sm border transition-all hover:opacity-70"
                    style={{
                      borderColor: 'hsl(var(--theme-border))',
                      color: 'hsl(var(--theme-foreground))',
                      backgroundColor: 'hsl(var(--theme-card))',
                    }}
                    onClick={() => setInputValue(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Full Chat Interface Demo */}
      <section ref={chatSectionRef} className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-2xl font-semibold mb-8 text-center"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            Full Interface Experience
          </h2>

          {/* Chat container with sidebar */}
          <div
            className="rounded-2xl border overflow-hidden shadow-lg"
            style={{
              borderColor: 'hsl(var(--theme-border))',
              backgroundColor: 'hsl(var(--theme-card))',
              height: '600px',
            }}
          >
            <div className="flex h-full">
              {/* Sidebar */}
              <motion.div
                className="border-r hidden md:flex flex-col"
                style={{
                  borderColor: 'hsl(var(--theme-border))',
                  backgroundColor: 'hsl(var(--theme-background))',
                  width: sidebarOpen ? 260 : 0,
                }}
                animate={{ width: sidebarOpen ? 260 : 0 }}
              >
                {sidebarOpen && (
                  <div className="p-3 flex flex-col h-full">
                    {/* New Chat Button */}
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-4 transition-colors hover:opacity-80"
                      style={{
                        backgroundColor: 'hsl(var(--theme-muted))',
                        color: 'hsl(var(--theme-foreground))',
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">New chat</span>
                    </button>

                    {/* Chat History */}
                    <div className="flex-1 overflow-y-auto space-y-1">
                      <p className="text-xs font-medium px-3 py-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Today</p>
                      {chatHistory.slice(0, 2).map((chat) => (
                        <button
                          key={chat.id}
                          className="w-full text-left px-3 py-2 rounded-lg transition-colors hover:opacity-80 group"
                          style={{
                            backgroundColor: chat.id === 1 ? 'hsl(var(--theme-muted))' : 'transparent',
                            color: 'hsl(var(--theme-foreground))',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm truncate flex-1">{chat.title}</span>
                            <div className="hidden group-hover:flex items-center gap-1">
                              <Edit3 className="w-3 h-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                              <Trash2 className="w-3 h-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                            </div>
                          </div>
                        </button>
                      ))}

                      <p className="text-xs font-medium px-3 py-2 mt-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Yesterday</p>
                      {chatHistory.slice(2, 4).map((chat) => (
                        <button
                          key={chat.id}
                          className="w-full text-left px-3 py-2 rounded-lg transition-colors hover:opacity-80"
                          style={{ color: 'hsl(var(--theme-foreground))' }}
                        >
                          <span className="text-sm truncate">{chat.title}</span>
                        </button>
                      ))}

                      <p className="text-xs font-medium px-3 py-2 mt-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Previous 7 days</p>
                      {chatHistory.slice(4).map((chat) => (
                        <button
                          key={chat.id}
                          className="w-full text-left px-3 py-2 rounded-lg transition-colors hover:opacity-80"
                          style={{ color: 'hsl(var(--theme-foreground))' }}
                        >
                          <span className="text-sm truncate">{chat.title}</span>
                        </button>
                      ))}
                    </div>

                    {/* User section */}
                    <div
                      className="mt-auto pt-3 border-t flex items-center gap-2 px-2"
                      style={{ borderColor: 'hsl(var(--theme-border))' }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                        style={{
                          backgroundColor: 'hsl(var(--theme-primary))',
                          color: 'hsl(var(--theme-primary-foreground))'
                        }}
                      >
                        J
                      </div>
                      <span className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>User</span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Main chat area */}
              <div className="flex-1 flex flex-col">
                {/* Chat header */}
                <div
                  className="px-4 py-3 border-b flex items-center justify-between"
                  style={{ borderColor: 'hsl(var(--theme-border))' }}
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="p-2 rounded-lg hover:opacity-70 transition-opacity md:hidden"
                      style={{ color: 'hsl(var(--theme-foreground))' }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>ChatGPT</span>
                    <button className="flex items-center gap-1 px-2 py-1 rounded-lg hover:opacity-70 transition-opacity">
                      <span
                        className="text-xs"
                        style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                      >
                        4o
                      </span>
                      <ChevronDown className="w-3 h-3" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                    </button>
                  </div>
                  <button
                    className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 p-4 space-y-6 overflow-y-auto"
                >
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      className="flex gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {message.role === 'user' ? (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
                          style={{
                            backgroundColor: 'hsl(var(--theme-primary))',
                            color: 'hsl(var(--theme-primary-foreground))'
                          }}
                        >
                          J
                        </div>
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: 'hsl(var(--theme-muted))',
                            color: 'hsl(var(--theme-foreground))'
                          }}
                        >
                          <ChatGPTLogo className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 pt-1">
                        <p className="text-sm font-medium mb-1" style={{ color: 'hsl(var(--theme-foreground))' }}>
                          {message.role === 'user' ? 'You' : 'Claw AI'}
                        </p>
                        <div
                          className="text-sm leading-relaxed whitespace-pre-wrap"
                          style={{ color: 'hsl(var(--theme-foreground))' }}
                        >
                          {message.content}
                        </div>
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
                    </motion.div>
                  ))}

                  {(isTyping || isGeneratingImage) && (
                    <div className="flex gap-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: 'hsl(var(--theme-muted))',
                          color: 'hsl(var(--theme-foreground))'
                        }}
                      >
                        <ChatGPTLogo className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm font-medium mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>
                          Claw AI {isGeneratingImage && '- Creating image...'}
                        </p>
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: 'hsl(var(--theme-muted-foreground))' }}
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input area */}
                <div
                  className="px-4 py-3 border-t"
                  style={{ borderColor: 'hsl(var(--theme-border))' }}
                >
                  {/* Image prompt mode indicator */}
                  <AnimatePresence>
                    {imagePromptMode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-2 flex items-center justify-between px-4 py-2 rounded-xl"
                        style={{ backgroundColor: 'rgba(116, 170, 156, 0.1)' }}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" style={{ color: '#74AA9C' }} />
                          <span className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                            Image Generation Mode
                          </span>
                        </div>
                        <button
                          onClick={() => setImagePromptMode(false)}
                          className="text-xs px-2 py-1 rounded hover:opacity-70"
                          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                        >
                          Cancel
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
                    style={{
                      borderColor: imagePromptMode ? '#74AA9C' : 'hsl(var(--theme-border))',
                      backgroundColor: 'hsl(var(--theme-background))',
                    }}
                  >
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-70"
                      style={{
                        backgroundColor: isGeneratingImage ? '#74AA9C' : 'hsl(var(--theme-muted))',
                        color: isGeneratingImage ? 'white' : 'hsl(var(--theme-foreground))',
                      }}
                      disabled={isGeneratingImage}
                    >
                      {isGeneratingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      type="text"
                      placeholder={imagePromptMode ? "Describe the image you want to create..." : "Ask anything"}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (imagePromptMode) {
                            handleImageGenerate();
                            setImagePromptMode(false);
                          } else {
                            handleSend();
                          }
                        }
                      }}
                      className="flex-1 bg-transparent text-sm outline-none"
                      style={{ color: 'hsl(var(--theme-foreground))' }}
                    />
                    <button
                      onClick={startListening}
                      className={`hover:opacity-70 transition-all ${isListening ? 'animate-pulse' : ''}`}
                      style={{
                        backgroundColor: isListening ? '#74AA9C' : 'transparent',
                        color: isListening ? 'white' : 'hsl(var(--theme-muted-foreground))',
                        borderRadius: '50%',
                        padding: isListening ? '4px' : '0',
                      }}
                      title="Click to speak"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                    {imagePromptMode ? (
                      <motion.button
                        onClick={() => {
                          handleImageGenerate();
                          setImagePromptMode(false);
                        }}
                        className="relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!inputValue.trim() || isGeneratingImage}
                        style={{
                          background: inputValue.trim() && !isGeneratingImage ? '#74AA9C' : 'hsl(var(--theme-muted))',
                        }}
                      >
                        <Sparkles
                          className="w-4 h-4"
                          style={{
                            color: inputValue.trim() && !isGeneratingImage ? 'white' : 'hsl(var(--theme-muted-foreground))'
                          }}
                        />
                      </motion.button>
                    ) : (
                      <AnimatedSendButton hasContent={inputValue.length > 0} onClick={handleSend} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-2xl font-semibold mb-12 text-center"
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
                  className="text-lg font-semibold mb-2"
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

      {/* Theme Timepiece Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-2xl font-semibold mb-4 text-center"
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
            A watch face generated from ChatGPT&apos;s signature teal palette.
            Clean design meets conversational intelligence.
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

      {/* Model Cards */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-2xl font-semibold mb-8 text-center"
            style={{
              color: 'hsl(var(--theme-foreground))',
              fontFamily: 'var(--theme-font-heading)',
            }}
          >
            Model Selection Pattern
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {models.map((model, index) => (
              <motion.div
                key={index}
                className={`rounded-xl overflow-hidden cursor-pointer transition-all ${model.active ? 'ring-2' : ''}`}
                style={{
                  ['--tw-ring-color' as string]: 'hsl(var(--theme-primary))',
                } as React.CSSProperties}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                {/* Gradient Card */}
                <div
                  className="h-32 flex items-center justify-center"
                  style={{ background: model.gradient }}
                >
                  <span className="text-xl font-medium text-white drop-shadow-md">
                    {model.name.toLowerCase().replace(' ', '-')}
                  </span>
                </div>
                {/* Card Footer */}
                <div
                  className="p-4"
                  style={{ backgroundColor: 'hsl(var(--theme-card))' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>
                      {model.name}
                    </span>
                    {model.badge && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: 'hsl(var(--theme-primary))',
                          color: 'hsl(var(--theme-primary-foreground))',
                        }}
                      >
                        {model.badge}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    {model.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sora Video Interface */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-2xl font-semibold mb-4 text-center"
              style={{
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
            >
              Sora Video Generation
            </h2>
            <p
              className="text-center mb-8 max-w-xl mx-auto"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Text-to-video AI that brings imagination to life with cinematic quality.
            </p>

            {/* Sora Interface Mock */}
            <div
              className="rounded-2xl overflow-hidden border shadow-xl"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                backgroundColor: 'hsl(var(--theme-card))',
              }}
            >
              {/* Video Preview Area */}
              <div
                className="aspect-video relative flex items-center justify-center"
                style={{ backgroundColor: '#0a0a0a' }}
              >
                {/* Video placeholder with gradient */}
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
                  }}
                />

                {/* Generating animation */}
                <motion.div
                  className="relative z-10 flex flex-col items-center gap-4"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Video className="w-16 h-16 text-white/30" />
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-teal-400"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-teal-400"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-teal-400"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <p className="text-white/50 text-sm">Generating video...</p>
                </motion.div>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
                      <Play className="w-5 h-5 text-white" />
                    </button>
                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-teal-400 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '35%' }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </div>
                    <span className="text-white/60 text-xs font-mono">0:00 / 0:15</span>
                    <button className="p-1.5 hover:opacity-70 transition">
                      <Volume2 className="w-4 h-4 text-white/60" />
                    </button>
                    <button className="p-1.5 hover:opacity-70 transition">
                      <Maximize2 className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sora Prompt Area */}
              <div className="p-6">
                <div
                  className="p-4 rounded-xl border mb-4"
                  style={{
                    borderColor: 'hsl(var(--theme-border))',
                    backgroundColor: 'hsl(var(--theme-background))',
                  }}
                >
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    Prompt
                  </label>
                  <p className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    A stylish woman walks down a Tokyo street filled with warm glowing neon and animated city signage. She wears a black leather jacket, a long red dress, and black boots, and carries a black purse.
                  </p>
                </div>

                {/* Generation Options */}
                <div className="flex flex-wrap gap-3">
                  <div
                    className="px-3 py-2 rounded-lg text-xs flex items-center gap-2"
                    style={{
                      backgroundColor: 'hsl(var(--theme-muted))',
                      color: 'hsl(var(--theme-foreground))',
                    }}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    15 seconds
                  </div>
                  <div
                    className="px-3 py-2 rounded-lg text-xs flex items-center gap-2"
                    style={{
                      backgroundColor: 'hsl(var(--theme-muted))',
                      color: 'hsl(var(--theme-foreground))',
                    }}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    1080p
                  </div>
                  <div
                    className="px-3 py-2 rounded-lg text-xs flex items-center gap-2"
                    style={{
                      backgroundColor: 'hsl(var(--theme-muted))',
                      color: 'hsl(var(--theme-foreground))',
                    }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    16:9
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* API Playground */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-2xl font-semibold mb-4 text-center"
              style={{
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
            >
              API Playground
            </h2>
            <p
              className="text-center mb-8 max-w-xl mx-auto"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Interactive API testing interface for developers. Build, test, and iterate.
            </p>

            {/* API Playground Mock */}
            <div
              className="rounded-2xl overflow-hidden border shadow-xl"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                backgroundColor: '#1a1a1a',
              }}
            >
              {/* Playground Header */}
              <div
                className="px-4 py-3 border-b flex items-center justify-between"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-white/90 text-sm font-medium">Playground</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/50 text-xs">Model:</span>
                    <button className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-white/80 text-xs">
                      gpt-5.2-turbo
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-xs bg-teal-500 text-white font-medium">
                    Submit
                  </button>
                </div>
              </div>

              {/* Split Pane */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-white/10">
                {/* Request Panel */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/60 text-xs font-medium">REQUEST</span>
                    <div className="flex gap-2">
                      <button className="text-xs text-white/40 hover:text-white/60">curl</button>
                      <button className="text-xs text-teal-400">Python</button>
                      <button className="text-xs text-white/40 hover:text-white/60">Node</button>
                    </div>
                  </div>
                  <pre className="text-xs font-mono overflow-x-auto p-3 rounded-lg bg-black/30">
                    <code>
                      <span className="text-pink-400">from</span> <span className="text-blue-300">openai</span> <span className="text-pink-400">import</span> <span className="text-blue-300">OpenAI</span>{'\n'}
                      {'\n'}
                      <span className="text-white/80">client</span> <span className="text-pink-400">=</span> <span className="text-yellow-300">OpenAI</span><span className="text-white/60">()</span>{'\n'}
                      {'\n'}
                      <span className="text-white/80">response</span> <span className="text-pink-400">=</span> <span className="text-white/80">client</span><span className="text-white/60">.</span><span className="text-white/80">chat</span><span className="text-white/60">.</span><span className="text-white/80">completions</span><span className="text-white/60">.</span><span className="text-yellow-300">create</span><span className="text-white/60">(</span>{'\n'}
                      {'  '}<span className="text-white/60">model=</span><span className="text-green-300">&quot;gpt-5.2-turbo&quot;</span><span className="text-white/60">,</span>{'\n'}
                      {'  '}<span className="text-white/60">messages=[</span>{'\n'}
                      {'    '}<span className="text-white/60">{'{'}</span>{'\n'}
                      {'      '}<span className="text-green-300">&quot;role&quot;</span><span className="text-white/60">:</span> <span className="text-green-300">&quot;user&quot;</span><span className="text-white/60">,</span>{'\n'}
                      {'      '}<span className="text-green-300">&quot;content&quot;</span><span className="text-white/60">:</span> <span className="text-green-300">&quot;Hello!&quot;</span>{'\n'}
                      {'    '}<span className="text-white/60">{'}'}</span>{'\n'}
                      {'  '}<span className="text-white/60">]</span>{'\n'}
                      <span className="text-white/60">)</span>
                    </code>
                  </pre>
                </div>

                {/* Response Panel */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/60 text-xs font-medium">RESPONSE</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-xs">200 OK</span>
                      <span className="text-white/30 text-xs">•</span>
                      <span className="text-white/40 text-xs">142ms</span>
                      <Copy className="w-3.5 h-3.5 text-white/40 cursor-pointer hover:text-white/60" />
                    </div>
                  </div>
                  <pre className="text-xs font-mono overflow-x-auto p-3 rounded-lg bg-black/30">
                    <code>
                      <span className="text-white/60">{'{'}</span>{'\n'}
                      {'  '}<span className="text-blue-300">&quot;id&quot;</span><span className="text-white/60">:</span> <span className="text-green-300">&quot;chatcmpl-abc123&quot;</span><span className="text-white/60">,</span>{'\n'}
                      {'  '}<span className="text-blue-300">&quot;object&quot;</span><span className="text-white/60">:</span> <span className="text-green-300">&quot;chat.completion&quot;</span><span className="text-white/60">,</span>{'\n'}
                      {'  '}<span className="text-blue-300">&quot;model&quot;</span><span className="text-white/60">:</span> <span className="text-green-300">&quot;gpt-5.2-turbo&quot;</span><span className="text-white/60">,</span>{'\n'}
                      {'  '}<span className="text-blue-300">&quot;choices&quot;</span><span className="text-white/60">: [{'{'}</span>{'\n'}
                      {'    '}<span className="text-blue-300">&quot;message&quot;</span><span className="text-white/60">: {'{'}</span>{'\n'}
                      {'      '}<span className="text-blue-300">&quot;role&quot;</span><span className="text-white/60">:</span> <span className="text-green-300">&quot;assistant&quot;</span><span className="text-white/60">,</span>{'\n'}
                      {'      '}<span className="text-blue-300">&quot;content&quot;</span><span className="text-white/60">:</span> <span className="text-green-300">&quot;Hello! How can I help?&quot;</span>{'\n'}
                      {'    '}<span className="text-white/60">{'}'},</span>{'\n'}
                      {'    '}<span className="text-blue-300">&quot;finish_reason&quot;</span><span className="text-white/60">:</span> <span className="text-green-300">&quot;stop&quot;</span>{'\n'}
                      {'  '}<span className="text-white/60">{'}]'}</span>{'\n'}
                      <span className="text-white/60">{'}'}</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Canvas Interface */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-2xl font-semibold mb-4 text-center"
              style={{
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
            >
              Canvas
            </h2>
            <p
              className="text-center mb-8 max-w-xl mx-auto"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Side-by-side editing for writing and code. Collaborate with AI in real-time.
            </p>

            {/* Canvas Interface Mock */}
            <div
              className="rounded-2xl overflow-hidden border shadow-xl"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                backgroundColor: 'hsl(var(--theme-card))',
              }}
            >
              {/* Canvas Header */}
              <div
                className="px-4 py-3 border-b flex items-center justify-between"
                style={{ borderColor: 'hsl(var(--theme-border))' }}
              >
                <div className="flex items-center gap-3">
                  <PenTool className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} />
                  <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    Canvas - Blog Post Draft
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1.5 rounded hover:opacity-70 transition"
                    style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{
                      backgroundColor: 'hsl(var(--theme-primary))',
                      color: 'hsl(var(--theme-primary-foreground))',
                    }}
                  >
                    Apply Changes
                  </button>
                </div>
              </div>

              {/* Canvas Split View */}
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: '400px' }}>
                {/* Editor Panel */}
                <div
                  className="p-6 border-r"
                  style={{ borderColor: 'hsl(var(--theme-border))' }}
                >
                  {/* Toolbar */}
                  <div
                    className="flex items-center gap-1 mb-4 pb-3 border-b"
                    style={{ borderColor: 'hsl(var(--theme-border))' }}
                  >
                    {[Bold, Italic, Underline, AlignLeft, List, Type].map((Icon, i) => (
                      <button
                        key={i}
                        className="p-2 rounded hover:opacity-70 transition"
                        style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>

                  {/* Document Content */}
                  <div className="space-y-4">
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: 'hsl(var(--theme-foreground))' }}
                    >
                      The Future of AI Interfaces
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'hsl(var(--theme-foreground))' }}
                    >
                      As artificial intelligence continues to evolve, the way we interact with these systems is undergoing a fundamental transformation. Gone are the days of complex command-line interfaces...
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'hsl(var(--theme-foreground))' }}
                    >
                      <motion.span
                        className="px-1 rounded"
                        style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.2)' }}
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        The key insight is that natural language provides the most intuitive bridge between human intent and machine capability.
                      </motion.span>
                    </p>
                  </div>
                </div>

                {/* AI Suggestions Panel */}
                <div
                  className="p-6"
                  style={{ backgroundColor: 'hsl(var(--theme-muted) / 0.3)' }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <ChatGPTLogo className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
                    <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                      AI Suggestions
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { type: 'expand', text: 'Add more detail about voice interfaces' },
                      { type: 'rephrase', text: 'Make the opening more engaging' },
                      { type: 'shorten', text: 'Condense the technical explanation' },
                    ].map((suggestion, i) => (
                      <motion.div
                        key={i}
                        className="p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                        style={{
                          borderColor: 'hsl(var(--theme-border))',
                          backgroundColor: 'hsl(var(--theme-card))',
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <p className="text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                          {suggestion.text}
                        </p>
                        <span
                          className="text-xs mt-1 inline-block px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: 'hsl(var(--theme-muted))',
                            color: 'hsl(var(--theme-muted-foreground))',
                          }}
                        >
                          {suggestion.type}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom GPTs Builder */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-2xl font-semibold mb-4 text-center"
              style={{
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
            >
              Custom GPTs
            </h2>
            <p
              className="text-center mb-8 max-w-xl mx-auto"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Build specialized AI assistants with custom instructions, knowledge, and capabilities.
            </p>

            {/* GPT Builder Mock */}
            <div
              className="rounded-2xl overflow-hidden border shadow-xl"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                backgroundColor: 'hsl(var(--theme-card))',
              }}
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Configuration Form */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    Configure Your GPT
                  </h4>

                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                    >
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <button
                      className="px-3 py-1.5 rounded-lg text-xs border"
                      style={{
                        borderColor: 'hsl(var(--theme-border))',
                        color: 'hsl(var(--theme-foreground))',
                      }}
                    >
                      Change Avatar
                    </button>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="My Custom GPT"
                      className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                      style={{
                        borderColor: 'hsl(var(--theme-border))',
                        backgroundColor: 'hsl(var(--theme-background))',
                        color: 'hsl(var(--theme-foreground))',
                      }}
                      defaultValue="Design System Expert"
                    />
                  </div>

                  {/* Instructions */}
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      Instructions
                    </label>
                    <textarea
                      placeholder="What should this GPT do?"
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
                      style={{
                        borderColor: 'hsl(var(--theme-border))',
                        backgroundColor: 'hsl(var(--theme-background))',
                        color: 'hsl(var(--theme-foreground))',
                      }}
                      defaultValue="You are an expert in design systems, helping users understand and implement consistent UI patterns..."
                    />
                  </div>

                  {/* Knowledge Upload */}
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                      Knowledge
                    </label>
                    <div
                      className="p-4 rounded-lg border border-dashed flex flex-col items-center gap-2"
                      style={{ borderColor: 'hsl(var(--theme-border))' }}
                    >
                      <Upload className="w-6 h-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
                      <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                        Upload files to give your GPT more context
                      </span>
                    </div>
                  </div>
                </div>

                {/* Capabilities */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    Capabilities
                  </h4>

                  {[
                    { name: 'Web Browsing', desc: 'Search and browse the web', enabled: true },
                    { name: 'Image Generation', desc: 'Create images with DALL-E', enabled: true },
                    { name: 'Code Interpreter', desc: 'Run code and analyze data', enabled: false },
                    { name: 'File Search', desc: 'Search through uploaded files', enabled: true },
                  ].map((capability, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{
                        borderColor: 'hsl(var(--theme-border))',
                        backgroundColor: 'hsl(var(--theme-background))',
                      }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                          {capability.name}
                        </p>
                        <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                          {capability.desc}
                        </p>
                      </div>
                      <div
                        className={`w-10 h-6 rounded-full p-0.5 cursor-pointer transition-colors ${
                          capability.enabled ? 'bg-teal-500' : ''
                        }`}
                        style={{
                          backgroundColor: capability.enabled ? '#74AA9C' : 'hsl(var(--theme-muted))',
                        }}
                      >
                        <motion.div
                          className="w-5 h-5 rounded-full bg-white shadow-sm"
                          animate={{ x: capability.enabled ? 16 : 0 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* o1 Reasoning Models */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-2xl font-semibold mb-4 text-center"
              style={{
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading)',
              }}
            >
              o1 Reasoning
            </h2>
            <p
              className="text-center mb-8 max-w-xl mx-auto"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              Extended thinking for complex problems. Watch AI reason step-by-step.
            </p>

            {/* o1 Interface Mock */}
            <div
              className="rounded-2xl overflow-hidden border shadow-xl"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                backgroundColor: 'hsl(var(--theme-card))',
              }}
            >
              {/* Thinking Process */}
              <div
                className="p-6 border-b"
                style={{ borderColor: 'hsl(var(--theme-border))' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Brain className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
                  </motion.div>
                  <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    Thinking...
                  </span>
                  <span className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    32 seconds
                  </span>
                </div>

                {/* Thinking Steps */}
                <div className="space-y-3 pl-8">
                  {[
                    { step: 1, text: 'Understanding the problem constraints', done: true },
                    { step: 2, text: 'Analyzing possible approaches', done: true },
                    { step: 3, text: 'Evaluating trade-offs between solutions', done: true },
                    { step: 4, text: 'Formulating optimal response', done: false },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                    >
                      {item.done ? (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Cpu className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(var(--theme-primary))' }} />
                        </motion.div>
                      )}
                      <span
                        className={`text-sm ${item.done ? '' : 'font-medium'}`}
                        style={{ color: item.done ? 'hsl(var(--theme-muted-foreground))' : 'hsl(var(--theme-foreground))' }}
                      >
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Response Preview */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <ChatGPTLogo className="w-5 h-5" style={{ color: 'hsl(var(--theme-foreground))' }} />
                  <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    Response
                  </span>
                </div>
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: 'hsl(var(--theme-muted) / 0.3)' }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--theme-foreground))' }}>
                    Based on my analysis, the optimal solution involves a multi-step approach. First, we need to consider the time complexity constraints. Given that n can be up to 10^6, an O(n log n) solution would be acceptable, but O(n^2) would exceed time limits...
                  </p>
                  <motion.span
                    className="inline-block w-2 h-4 ml-1"
                    style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
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
            &ldquo;The best interface is no interface.
            The second best is a conversation.&rdquo;
          </blockquote>
          <cite
            className="text-sm not-italic"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            - OpenAI Design Philosophy
          </cite>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 border-t"
        style={{ borderColor: 'hsl(var(--theme-border))' }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2
            className="text-2xl font-semibold mb-8"
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
              href="/design/claude"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border transition-all hover:opacity-90"
              style={{
                borderColor: 'hsl(var(--theme-border))',
                color: 'hsl(var(--theme-foreground))',
              }}
            >
              Explore Claude Theme
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
            ChatGPT Design System
          </p>
          <p
            className="text-sm"
            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
          >
            OpenClaw-OS
          </p>
        </div>
      </footer>
    </div>
  );
}

const principles = [
  {
    id: 'conversation',
    icon: MessageSquare,
    title: 'Conversation First',
    description: 'The entire interface is built around the chat paradigm. Everything supports the flow of natural dialogue.',
  },
  {
    id: 'speed',
    icon: Zap,
    title: 'Instant Response',
    description: 'Streaming responses create the feeling of real-time conversation, reducing perceived wait times.',
  },
  {
    id: 'safety',
    icon: Shield,
    title: 'Built-in Safety',
    description: 'Clear visual indicators when the AI is uncertain or when content needs review.',
  },
  {
    id: 'accessibility',
    icon: Globe,
    title: 'Universal Access',
    description: 'Designed to work for everyone, with careful attention to contrast, sizing, and screen reader support.',
  },
];

const models = [
  {
    name: 'GPT-5.2',
    description: 'Best model for coding and agentic tasks',
    badge: 'New',
    active: true,
    gradient: 'linear-gradient(135deg, #E879F9 0%, #F472B6 50%, #FB7185 100%)'
  },
  {
    name: 'GPT-5 mini',
    description: 'Faster, cost-efficient for well-defined tasks',
    badge: null,
    active: false,
    gradient: 'linear-gradient(135deg, #C084FC 0%, #E879F9 50%, #F0ABFC 100%)'
  },
  {
    name: 'GPT-5 nano',
    description: 'Fastest, most cost-effective option',
    badge: null,
    active: false,
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #C084FC 50%, #67E8F9 100%)'
  },
];
