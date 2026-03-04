'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Send, Mic, Plus, ChevronDown, MoreHorizontal,
  Sparkles, User, Bot, Check, Copy, RefreshCw, ThumbsUp, ThumbsDown,
  Heart, ShoppingBag, X,
} from 'lucide-react';

// Typewriter sound effects using real audio files
const TYPEWRITER_CLICK_URL = 'https://2oczblkb3byymav8.public.blob.vercel-storage.com/Typewriter%20click.m4a';
const TYPEWRITER_CLEAR_URL = 'https://2oczblkb3byymav8.public.blob.vercel-storage.com/Typewriter%20clear.m4a';

function useTypewriterSounds() {
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const clearAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Pre-load audio files
    clickAudioRef.current = new Audio(TYPEWRITER_CLICK_URL);
    clearAudioRef.current = new Audio(TYPEWRITER_CLEAR_URL);

    // Set volume
    if (clickAudioRef.current) clickAudioRef.current.volume = 0.5;
    if (clearAudioRef.current) clearAudioRef.current.volume = 0.6;
  }, []);

  const playKeyClick = useCallback(() => {
    try {
      if (clickAudioRef.current) {
        // Clone the audio to allow overlapping sounds for fast typing
        const sound = clickAudioRef.current.cloneNode() as HTMLAudioElement;
        sound.volume = 0.5;
        sound.play().catch(() => {});
      }
    } catch (e) {
      // Audio not available
    }
  }, []);

  const playBell = useCallback(() => {
    try {
      if (clearAudioRef.current) {
        clearAudioRef.current.currentTime = 0;
        clearAudioRef.current.play().catch(() => {});
      }
    } catch (e) {
      // Audio not available
    }
  }, []);

  return { playKeyClick, playBell };
}

// Fully Functional Typewriter Keyboard with text output and sound effects
export function TypewriterKeyboard({ className = '' }: { className?: string }) {
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [typedText, setTypedText] = useState('');
  const maxLength = 50;
  const { playKeyClick, playBell } = useTypewriterSounds();

  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ];

  const handleKeyPress = (key: string) => {
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 150);

    // Play typewriter click sound
    playKeyClick();

    if (key === '⌫') {
      setTypedText((t) => t.slice(0, -1));
    } else if (key === ' ') {
      setTypedText((t) => t.length < maxLength ? t + ' ' : t);
    } else {
      setTypedText((t) => t.length < maxLength ? t + key.toLowerCase() : t);
    }
  };

  const handleClear = () => {
    // Play carriage return bell sound
    playBell();
    setTypedText('');
  };

  // Listen for real keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        handleKeyPress('⌫');
      } else if (e.key === ' ') {
        handleKeyPress(' ');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playKeyClick]);

  return (
    <div className={`${className}`}>
      {/* Paper output */}
      <div
        className="mb-4 p-4 rounded-t-xl min-h-[60px] relative overflow-hidden"
        style={{
          backgroundColor: 'hsl(var(--theme-background))',
          borderLeft: '2px solid hsl(var(--theme-border))',
          borderRight: '2px solid hsl(var(--theme-border))',
          borderTop: '2px solid hsl(var(--theme-border))',
        }}
      >
        <motion.p
          className="font-mono text-lg break-words"
          style={{ color: 'hsl(var(--theme-foreground))' }}
        >
          {typedText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ color: 'hsl(var(--theme-primary))' }}
          >
            |
          </motion.span>
        </motion.p>
        {typedText.length === 0 && (
          <p className="text-sm absolute top-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Click keys or type on your keyboard...
          </p>
        )}
      </div>

      {/* Keyboard */}
      <div
        className="p-6 rounded-2xl"
        style={{
          backgroundColor: 'hsl(var(--theme-card))',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
        }}
      >
        <div className="space-y-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1" style={{ marginLeft: rowIndex * 12 }}>
              {row.map((key) => (
                <motion.button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`${key === '⌫' ? 'w-14' : 'w-10'} h-12 rounded-lg flex items-center justify-center font-mono text-sm border-2 shadow-md relative overflow-hidden`}
                  style={{
                    backgroundColor: pressedKey === key ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-background))',
                    borderColor: 'hsl(var(--theme-border))',
                    color: pressedKey === key ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-foreground))',
                    boxShadow: pressedKey === key
                      ? 'inset 0 2px 4px rgba(0,0,0,0.2)'
                      : '0 4px 0 hsl(var(--theme-border)), 0 6px 8px rgba(0,0,0,0.1)',
                    transform: pressedKey === key ? 'translateY(2px)' : 'translateY(0)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {key}
                </motion.button>
              ))}
            </div>
          ))}
          {/* Spacebar */}
          <div className="flex justify-center mt-1 gap-2">
            <motion.button
              onClick={handleClear}
              className="px-4 h-10 rounded-lg border-2 shadow-md text-xs"
              style={{
                backgroundColor: 'hsl(var(--theme-muted))',
                borderColor: 'hsl(var(--theme-border))',
                color: 'hsl(var(--theme-muted-foreground))',
              }}
              whileTap={{ scale: 0.98 }}
            >
              CLEAR
            </motion.button>
            <motion.button
              onClick={() => handleKeyPress(' ')}
              className="w-48 h-10 rounded-lg border-2 shadow-md"
              style={{
                backgroundColor: pressedKey === ' ' ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-background))',
                borderColor: 'hsl(var(--theme-border))',
                boxShadow: '0 4px 0 hsl(var(--theme-border)), 0 6px 8px rgba(0,0,0,0.1)',
              }}
              whileTap={{ scale: 0.98 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Fully Functional AI Chat Interface
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const aiResponses = [
  "That's a great question! Based on my analysis, I'd recommend starting with the basics and building from there.",
  "I understand what you're looking for. Here's my suggestion: focus on simplicity and user experience first.",
  "Interesting point! There are several approaches you could take. Let me outline the key considerations.",
  "Thanks for sharing that. I think the best path forward involves careful planning and iterative improvements.",
  "Great insight! From my perspective, the most effective approach combines creativity with practical constraints.",
];

export function AIChatInterface({ className = '' }: { className?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'user', content: "How can I improve my website's performance?" },
    { role: 'assistant', content: "Here are some key strategies:\n\n1. **Optimize images** - Use WebP format\n2. **Enable caching** - Browser & CDN caching\n3. **Minimize JavaScript** - Remove unused code\n4. **Use lazy loading** - Load content on demand" },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const copyMessage = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden border ${className}`}
      style={{ backgroundColor: 'hsl(var(--theme-background))', borderColor: 'hsl(var(--theme-border))' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--theme-primary))' }}>
            <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary-foreground))' }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>AI Assistant</p>
            <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              {isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        <button style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ backgroundColor: message.role === 'user' ? 'hsl(var(--theme-muted))' : 'hsl(var(--theme-primary))' }}
            >
              {message.role === 'user' ? (
                <User className="w-4 h-4" style={{ color: 'hsl(var(--theme-foreground))' }} />
              ) : (
                <Bot className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary-foreground))' }} />
              )}
            </div>
            <div
              className={`rounded-2xl px-4 py-3 max-w-[80%] ${message.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
              style={{
                backgroundColor: message.role === 'user' ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-card))',
                color: message.role === 'user' ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-foreground))',
              }}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-current/10">
                  <motion.button
                    onClick={() => copyMessage(message.content, index)}
                    className="p-1 rounded hover:bg-current/10 transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    {copiedIndex === index ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </motion.button>
                  <button className="p-1 rounded hover:bg-current/10 transition-colors">
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button className="p-1 rounded hover:bg-current/10 transition-colors">
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div className="flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--theme-primary))' }}>
              <Bot className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary-foreground))' }} />
            </div>
            <div className="rounded-2xl rounded-tl-sm px-4 py-3" style={{ backgroundColor: 'hsl(var(--theme-card))' }}>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex items-center gap-2 rounded-xl p-2 border"
          style={{ backgroundColor: 'hsl(var(--theme-card))', borderColor: 'hsl(var(--theme-border))' }}
        >
          <button type="button" className="p-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            <Plus className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'hsl(var(--theme-foreground))' }}
          />
          <button type="button" className="p-2" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            <Mic className="w-5 h-5" />
          </button>
          <motion.button
            type="submit"
            className="p-2 rounded-lg"
            style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
            whileTap={{ scale: 0.95 }}
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary-foreground))' }} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}

// Interactive Dashboard
export function DashboardInterface({ className = '' }: { className?: string }) {
  const [dateRange, setDateRange] = useState('7d');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const ranges = ['24h', '7d', '30d', '90d'];
  const dataByRange: Record<string, number[]> = {
    '24h': [20, 45, 30, 60, 40, 75, 55, 80, 45, 65, 35, 70],
    '7d': [40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95],
    '30d': [55, 70, 60, 85, 70, 95, 80, 90, 75, 85, 65, 100],
    '90d': [30, 50, 40, 70, 50, 80, 60, 75, 55, 70, 45, 85],
  };

  const stats = [
    { label: 'Total Users', value: dateRange === '24h' ? '847' : dateRange === '7d' ? '12,847' : dateRange === '30d' ? '45,230' : '124,500', change: '+12%' },
    { label: 'Revenue', value: dateRange === '24h' ? '$2,890' : dateRange === '7d' ? '$48,290' : dateRange === '30d' ? '$185,400' : '$520,000', change: '+8%' },
    { label: 'Conversion', value: dateRange === '24h' ? '2.8%' : dateRange === '7d' ? '3.24%' : dateRange === '30d' ? '3.5%' : '3.1%', change: '+2%' },
  ];

  return (
    <div className={`rounded-2xl overflow-hidden border ${className}`} style={{ backgroundColor: 'hsl(var(--theme-background))', borderColor: 'hsl(var(--theme-border))' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <h3 className="font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>Dashboard Overview</h3>
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: 'hsl(var(--theme-muted))' }}>
          {ranges.map((range) => (
            <motion.button
              key={range}
              onClick={() => setDateRange(range)}
              className="px-3 py-1 rounded text-xs font-medium transition-colors"
              style={{
                backgroundColor: dateRange === range ? 'hsl(var(--theme-background))' : 'transparent',
                color: dateRange === range ? 'hsl(var(--theme-foreground))' : 'hsl(var(--theme-muted-foreground))',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {range}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 p-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="p-4 rounded-xl border"
            style={{ backgroundColor: 'hsl(var(--theme-card))', borderColor: 'hsl(var(--theme-border))' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <p className="text-xs mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>{stat.label}</p>
            <p className="text-xl font-bold" style={{ color: 'hsl(var(--theme-foreground))' }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: 'hsl(var(--theme-primary))' }}>{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Interactive Chart */}
      <div className="px-4 pb-4">
        <div className="h-32 rounded-xl flex items-end gap-1 p-4 relative" style={{ backgroundColor: 'hsl(var(--theme-card))' }}>
          {dataByRange[dateRange].map((height, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t cursor-pointer relative"
              style={{ backgroundColor: hoveredBar === i ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-primary) / 0.6)' }}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
            />
          ))}
          <AnimatePresence>
            {hoveredBar !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-medium"
                style={{ backgroundColor: 'hsl(var(--theme-foreground))', color: 'hsl(var(--theme-background))' }}
              >
                {dataByRange[dateRange][hoveredBar]}%
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Interactive Code Editor
export function CodeEditorInterface({ className = '' }: { className?: string }) {
  const [activeFile, setActiveFile] = useState('theme.config.ts');
  const [copied, setCopied] = useState(false);

  const files: Record<string, { num: number; content: string }[]> = {
    'theme.config.ts': [
      { num: 1, content: 'const theme = {' },
      { num: 2, content: '  colors: {' },
      { num: 3, content: '    primary: "#8B5CF6",' },
      { num: 4, content: '    background: "#0F172A",' },
      { num: 5, content: '    foreground: "#F8FAFC",' },
      { num: 6, content: '  },' },
      { num: 7, content: '  fonts: {' },
      { num: 8, content: '    body: "Inter",' },
      { num: 9, content: '  }' },
      { num: 10, content: '};' },
    ],
    'index.tsx': [
      { num: 1, content: 'import { theme } from "./theme";' },
      { num: 2, content: '' },
      { num: 3, content: 'export default function App() {' },
      { num: 4, content: '  return (' },
      { num: 5, content: '    <ThemeProvider theme={theme}>' },
      { num: 6, content: '      <Component />' },
      { num: 7, content: '    </ThemeProvider>' },
      { num: 8, content: '  );' },
      { num: 9, content: '}' },
    ],
  };

  const copyCode = async () => {
    const code = files[activeFile].map(l => l.content).join('\n');
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`rounded-2xl overflow-hidden border ${className}`} style={{ backgroundColor: 'hsl(var(--theme-background))', borderColor: 'hsl(var(--theme-border))' }}>
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'hsl(var(--theme-border))' }}>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex gap-1">
            {Object.keys(files).map((file) => (
              <button
                key={file}
                onClick={() => setActiveFile(file)}
                className="px-3 py-1 rounded text-xs transition-colors"
                style={{
                  backgroundColor: activeFile === file ? 'hsl(var(--theme-card))' : 'transparent',
                  color: activeFile === file ? 'hsl(var(--theme-foreground))' : 'hsl(var(--theme-muted-foreground))',
                }}
              >
                {file}
              </button>
            ))}
          </div>
        </div>
        <motion.button onClick={copyCode} className="p-1 rounded" whileTap={{ scale: 0.9 }}>
          {copied ? <Check className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary))' }} /> : <Copy className="w-4 h-4" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />}
        </motion.button>
      </div>

      {/* Code */}
      <div className="p-4 font-mono text-sm">
        <AnimatePresence mode="wait">
          <motion.div key={activeFile} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {files[activeFile].map((line, index) => (
              <motion.div
                key={line.num}
                className="flex hover:bg-current/5 rounded px-1 -mx-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <span className="w-8 text-right mr-4 select-none" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                  {line.num}
                </span>
                <span style={{ color: 'hsl(var(--theme-foreground))' }}>
                  {line.content.includes(':') ? (
                    <>
                      <span style={{ color: 'hsl(var(--theme-primary))' }}>{line.content.split(':')[0]}</span>:
                      <span style={{ color: 'hsl(var(--theme-accent))' }}>{line.content.split(':').slice(1).join(':')}</span>
                    </>
                  ) : line.content.includes('import') || line.content.includes('export') || line.content.includes('function') || line.content.includes('return') || line.content.includes('const') ? (
                    <>
                      <span style={{ color: 'hsl(var(--theme-primary))' }}>{line.content.split(' ')[0]}</span>
                      <span> {line.content.split(' ').slice(1).join(' ')}</span>
                    </>
                  ) : (
                    line.content
                  )}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Interactive Product Card
export function ProductCardInterface({ className = '' }: { className?: string }) {
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');

  const sizes = ['S', 'M', 'L', 'XL'];

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className={`rounded-2xl overflow-hidden border ${className}`} style={{ backgroundColor: 'hsl(var(--theme-card))', borderColor: 'hsl(var(--theme-border))' }}>
      {/* Product Image */}
      <div className="aspect-square relative" style={{ background: `linear-gradient(135deg, hsl(var(--theme-primary) / 0.2) 0%, hsl(var(--theme-accent) / 0.2) 100%)` }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-32 h-32 rounded-2xl"
            style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.3)' }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          />
        </div>
        <motion.button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 p-2 rounded-full"
          style={{ backgroundColor: 'hsl(var(--theme-background) / 0.8)' }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} style={{ color: liked ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-muted-foreground))' }} />
        </motion.button>
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}>
          New
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>Premium Collection</p>
        <h3 className="font-semibold" style={{ color: 'hsl(var(--theme-foreground))' }}>Designer Item</h3>

        {/* Size selector */}
        <div className="flex gap-2 mt-3">
          {sizes.map((size) => (
            <motion.button
              key={size}
              onClick={() => setSelectedSize(size)}
              className="w-8 h-8 rounded-lg text-xs font-medium border"
              style={{
                backgroundColor: selectedSize === size ? 'hsl(var(--theme-primary))' : 'transparent',
                borderColor: selectedSize === size ? 'hsl(var(--theme-primary))' : 'hsl(var(--theme-border))',
                color: selectedSize === size ? 'hsl(var(--theme-primary-foreground))' : 'hsl(var(--theme-foreground))',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {size}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-lg font-bold" style={{ color: 'hsl(var(--theme-primary))' }}>$299.00</p>
          <motion.button
            onClick={handleAddToCart}
            className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'hsl(var(--theme-primary-foreground))' }}
            whileTap={{ scale: 0.95 }}
          >
            {addedToCart ? <><Check className="w-4 h-4" /> Added!</> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Playable Arcade Game
export function ArcadeInterface({ className = '' }: { className?: string }) {
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(120);
  const [gameActive, setGameActive] = useState(false);
  const [targets, setTargets] = useState<{ id: number; x: number; y: number }[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);

  // Spawn targets
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setTargets((prev) => [
        ...prev.slice(-4),
        { id: Date.now(), x: Math.random() * 200 + 20, y: 0 },
      ]);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameActive]);

  // Move targets down
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setTargets((prev) =>
        prev
          .map((t) => ({ ...t, y: t.y + 5 }))
          .filter((t) => t.y < 120)
      );
    }, 100);
    return () => clearInterval(interval);
  }, [gameActive]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!gameActive) return;
      if (e.key === 'ArrowLeft') setPlayerX((x) => Math.max(0, x - 15));
      if (e.key === 'ArrowRight') setPlayerX((x) => Math.min(240, x + 15));
      if (e.key === ' ') {
        // Check for hits
        setTargets((prev) => {
          const hit = prev.find((t) => Math.abs(t.x - playerX) < 25 && t.y > 80);
          if (hit) {
            setScore((s) => s + 100);
            return prev.filter((t) => t.id !== hit.id);
          }
          return prev;
        });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameActive, playerX]);

  return (
    <div
      className={`rounded-2xl overflow-hidden border-4 p-6 ${className}`}
      style={{
        backgroundColor: 'hsl(var(--theme-background))',
        borderColor: 'hsl(var(--theme-primary))',
        boxShadow: `0 0 20px hsl(var(--theme-primary) / 0.5), inset 0 0 60px hsl(var(--theme-primary) / 0.1)`,
      }}
    >
      {/* Score display */}
      <div className="text-center mb-4">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Score
        </p>
        <motion.p
          className="text-4xl font-bold font-mono"
          style={{ color: 'hsl(var(--theme-foreground))', textShadow: `0 0 10px hsl(var(--theme-primary))` }}
          animate={score > 0 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.2 }}
        >
          {score.toString().padStart(6, '0')}
        </motion.p>
      </div>

      {/* Game area */}
      <div
        ref={gameRef}
        className="aspect-video rounded-lg border-2 relative overflow-hidden mb-4 cursor-pointer"
        style={{ borderColor: 'hsl(var(--theme-border))', backgroundColor: 'hsl(var(--theme-card))' }}
        onClick={() => !gameActive && setGameActive(true)}
      >
        {/* Scanlines effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, black 2px, black 4px)' }} />

        {!gameActive ? (
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <motion.p
              className="text-lg font-bold mb-2"
              style={{ color: 'hsl(var(--theme-primary))' }}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              CLICK TO START
            </motion.p>
            <p className="text-xs" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Use ← → to move, SPACE to shoot
            </p>
          </div>
        ) : (
          <>
            {/* Targets */}
            {targets.map((target) => (
              <motion.div
                key={target.id}
                className="absolute w-4 h-4 rounded-full"
                style={{ backgroundColor: 'hsl(var(--theme-accent))', left: target.x, top: target.y }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            ))}
            {/* Player */}
            <motion.div
              className="absolute bottom-2 w-10 h-3 rounded"
              style={{ backgroundColor: 'hsl(var(--theme-primary))', left: playerX }}
              animate={{ x: 0 }}
            />
          </>
        )}
      </div>

      {/* Mobile controls */}
      <div className="flex justify-center gap-2">
        {['←', '→', 'FIRE'].map((key) => (
          <motion.button
            key={key}
            className="px-4 py-2 rounded border text-xs font-mono"
            style={{ borderColor: 'hsl(var(--theme-border))', color: 'hsl(var(--theme-foreground))' }}
            whileTap={{ scale: 0.95, backgroundColor: 'hsl(var(--theme-primary))' }}
            onTouchStart={() => {
              if (!gameActive) setGameActive(true);
              if (key === '←') setPlayerX((x) => Math.max(0, x - 15));
              if (key === '→') setPlayerX((x) => Math.min(240, x + 15));
              if (key === 'FIRE') {
                setTargets((prev) => {
                  const hit = prev.find((t) => Math.abs(t.x - playerX) < 25 && t.y > 80);
                  if (hit) {
                    setScore((s) => s + 100);
                    return prev.filter((t) => t.id !== hit.id);
                  }
                  return prev;
                });
              }
            }}
          >
            {key}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
