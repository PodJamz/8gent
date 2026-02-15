'use client';

import { useState, useEffect, useRef } from 'react';
import { useHorizontalScroll } from '@/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Terminal,
  FileCode,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Loader2,
  Globe,
  Eye,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  Search,
  Star,
  ExternalLink,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Settings,
  Layers,
  MousePointer,
  Zap,
} from 'lucide-react';
import { SkillsPanel } from '@/components/ai-elements/SkillsPanel';
import { IDEView } from '@/components/editor/IDEView';

// ============================================================================
// Types
// ============================================================================

export interface ProcessState {
  activeTab: 'code' | 'chat' | 'terminal' | 'browser' | 'preview' | 'skills';
  currentFile: string;
  files: Record<string, string>;
  chatMessages: ChatMessage[];
  terminalOutput: string[];
  isProcessing: boolean;
  currentTask: string;
  aiTyping: boolean;
  browserUrl: string;
  browserHistory: string[];
  browserHistoryIndex: number;
  previewDevice: 'mobile' | 'tablet' | 'desktop';
  previewComponent: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ProcessWindowProps {
  state: ProcessState;
  onStateChange: (state: ProcessState) => void;
  className?: string;
}

// ============================================================================
// Simulated Code Content
// ============================================================================

const SAMPLE_FILES: Record<string, string> = {
  'app.tsx': `import { useState } from 'react';
import { ClawAIOrb } from './components/ClawAIOrb';
import { ControlDeck } from './components/ControlDeck';

export default function App() {
  const [theme, setTheme] = useState('cosmic');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCommand = async (cmd: string) => {
    setIsProcessing(true);
    // Claw AI processes the command
    await processWithAI(cmd);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <ClawAIOrb
        isActive={isProcessing}
        theme={theme}
      />
      <ControlDeck onCommand={handleCommand} />
    </div>
  );
}`,
  'ClawAIOrb.tsx': `import { motion } from 'framer-motion';

interface ClawAIOrbProps {
  isActive: boolean;
  theme: string;
}

export function ClawAIOrb({ isActive, theme }: ClawAIOrbProps) {
  return (
    <motion.div
      className="relative w-20 h-20 rounded-full"
      animate={{
        scale: isActive ? [1, 1.1, 1] : 1,
        boxShadow: isActive
          ? '0 0 40px var(--theme-primary)'
          : '0 0 20px var(--theme-primary)',
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Orb core */}
      <div className="absolute inset-2 rounded-full bg-gradient-radial" />

      {/* Activity indicator */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}`,
  'styles.css': `/* Claw AI Theme System */
:root {
  --theme-primary: #f97316;
  --theme-accent: #fb923c;
  --theme-background: #0a0a0a;
  --theme-card: rgba(255, 255, 255, 0.05);
}

.orb-glow {
  box-shadow:
    0 0 20px var(--theme-primary),
    0 0 40px var(--theme-accent),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
}

.control-deck {
  background: linear-gradient(
    180deg,
    #d4d4d4 0%,
    #a8a8a8 5%,
    #c0c0c0 50%,
    #888888 100%
  );
}`,
};

// ============================================================================
// Code Editor Component
// ============================================================================

function CodeEditor({
  content,
  filename,
  isProcessing,
  highlightLines = [],
}: {
  content: string;
  filename: string;
  isProcessing: boolean;
  highlightLines?: number[];
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting
  const highlightSyntax = (code: string) => {
    return code.split('\n').map((line, i) => {
      let highlighted = line
        .replace(
          /\b(import|export|from|const|let|var|function|return|if|else|async|await|default|interface|type)\b/g,
          '<span class="text-purple-400">$1</span>'
        )
        .replace(
          /(["'`])([^"'`]*)\1/g,
          '<span class="text-green-400">$1$2$1</span>'
        )
        .replace(
          /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
          '<span class="text-gray-500">$1</span>'
        )
        .replace(
          /(&lt;\/?)(\w+)/g,
          '$1<span class="text-blue-400">$2</span>'
        )
        .replace(
          /\b(\d+)\b/g,
          '<span class="text-orange-400">$1</span>'
        )
        .replace(
          /([{}[\]()])/g,
          '<span class="text-yellow-300">$1</span>'
        );

      const isHighlighted = highlightLines.includes(i + 1);

      return (
        <div
          key={i}
          className={`flex ${isHighlighted ? 'bg-green-500/10' : ''}`}
        >
          <span className="w-10 text-right pr-3 text-white/20 select-none text-xs">
            {i + 1}
          </span>
          <span
            className="flex-1 text-xs"
            dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }}
          />
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#0d1117] rounded-lg overflow-hidden">
      {/* Header - responsive */}
      <div className="flex items-center justify-between px-1.5 sm:px-2 py-1 sm:py-1.5 bg-[#161b22] border-b border-white/5">
        <div className="flex items-center gap-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-[#0d1117] rounded-t text-[10px] sm:text-xs text-white/80 truncate">
            <FileCode className="w-3 h-3 text-blue-400 flex-shrink-0" />
            <span className="truncate">{filename}</span>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="p-1 sm:p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors flex-shrink-0"
        >
          {copied ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-400" /> : <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
        </button>
      </div>

      {/* Code content - responsive */}
      <div className="flex-1 overflow-auto p-2 sm:p-3 font-mono relative">
        {isProcessing && (
          <motion.div
            className="absolute top-2 right-2 flex items-center gap-2 px-2 py-1 bg-orange-500/20 rounded text-xs text-orange-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="w-3 h-3 animate-spin" />
            Claw AI is editing...
          </motion.div>
        )}
        <pre className="text-white/90 leading-relaxed">
          {highlightSyntax(content)}
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// Chat Interface Component
// ============================================================================

function ChatInterface({
  messages,
  isTyping,
  onSendMessage,
}: {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (message: string) => void;
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0d1117] rounded-lg overflow-hidden">
      {/* Header - responsive */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-[#161b22] border-b border-white/5">
        <div className="relative flex-shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-[#161b22]" />
        </div>
        <div className="min-w-0">
          <div className="text-xs sm:text-sm font-medium text-white truncate">Claw AI</div>
          <div className="text-[10px] sm:text-xs text-green-400 truncate">Online • Ready to code</div>
        </div>
      </div>

      {/* Messages - responsive */}
      <div className="flex-1 overflow-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-blue-500/20'
                  : 'bg-gradient-to-br from-orange-400 to-orange-600'
              }`}
            >
              {msg.role === 'user' ? (
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
              ) : (
                <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              )}
            </div>
            <div
              className={`max-w-[85%] sm:max-w-[80%] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-500/20 text-white'
                  : 'bg-white/5 text-white/90'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 sm:gap-3"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
            </div>
            <div className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/5 text-white/90 text-xs sm:text-sm">
              <motion.div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form - responsive */}
      <form onSubmit={handleSubmit} className="p-2 sm:p-3 border-t border-white/5">
        <div className="flex gap-1.5 sm:gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Claw AI..."
            className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 rounded-xl text-xs sm:text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          />
          <button
            type="submit"
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500 rounded-xl text-xs sm:text-sm text-white font-medium hover:bg-orange-600 transition-colors flex-shrink-0"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// Terminal Component
// ============================================================================

function TerminalView({ output }: { output: string[] }) {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="h-full flex flex-col bg-[#0d1117] rounded-lg overflow-hidden">
      {/* Header - responsive */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-[#161b22] border-b border-white/5">
        <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
        <span className="text-[10px] sm:text-xs text-white/60">Terminal</span>
      </div>

      {/* Terminal content - responsive */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-auto p-2 sm:p-3 font-mono text-[10px] sm:text-xs text-green-400"
      >
        {output.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className={`${line.startsWith('$') ? 'text-white/60' : ''} ${
              line.includes('error') ? 'text-red-400' : ''
            } ${line.includes('success') || line.includes('✓') ? 'text-green-400' : ''}`}
          >
            {line}
          </motion.div>
        ))}
        <div className="flex items-center gap-1 mt-1 text-white/60">
          <span>$</span>
          <motion.span
            className="w-2 h-4 bg-green-400"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Browser Component
// ============================================================================

const SIMULATED_PAGES: Record<string, { title: string; content: React.ReactNode }> = {
  'https://localhost:3000': {
    title: 'Claw AI OS • localhost',
    content: (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Claw AI OS</h1>
        <p className="text-white/60 text-sm">Development server running</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 text-xs">Live • Hot Reload Active</span>
        </div>
      </div>
    ),
  },
  'https://google.com': {
    title: 'Google',
    content: (
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <div className="text-2xl font-bold mb-6">
          <span className="text-blue-500">G</span>
          <span className="text-red-500">o</span>
          <span className="text-yellow-500">o</span>
          <span className="text-blue-500">g</span>
          <span className="text-green-500">l</span>
          <span className="text-red-500">e</span>
        </div>
        <div className="w-full max-w-md flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20">
          <Search className="w-4 h-4 text-white/40" />
          <span className="text-white/40 text-sm">Search Google or type a URL</span>
        </div>
      </div>
    ),
  },
  'https://github.com': {
    title: 'GitHub',
    content: (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-white rounded-full" />
          <span className="text-white font-bold">GitHub</span>
        </div>
        <div className="space-y-3">
          {['claw-ai-os', 'control-deck', 'dynamic-island'].map((repo) => (
            <div key={repo} className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">{repo}</span>
              </div>
              <p className="text-white/40 text-xs mt-1">Updated 2 hours ago</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  'https://vercel.com': {
    title: 'Vercel',
    content: (
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-white" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          <span className="text-white font-bold">Vercel</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">Deploy Instantly</div>
            <p className="text-white/60 text-sm">Your code is live in seconds</p>
            <div className="mt-4 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium inline-block">
              Deploy Now
            </div>
          </div>
        </div>
      </div>
    ),
  },
};

function BrowserView({
  url,
  onNavigate,
  onBack,
  onForward,
  onRefresh,
  canGoBack,
  canGoForward,
  isLoading,
}: {
  url: string;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
}) {
  const [inputUrl, setInputUrl] = useState(url);
  const [isSecure, setIsSecure] = useState(url.startsWith('https://'));

  useEffect(() => {
    setInputUrl(url);
    setIsSecure(url.startsWith('https://'));
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = inputUrl;
    if (!finalUrl.startsWith('http')) {
      finalUrl = `https://${finalUrl}`;
    }
    onNavigate(finalUrl);
  };

  const currentPage = SIMULATED_PAGES[url] || {
    title: 'Page Not Found',
    content: (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <div className="text-white/60 text-sm">Simulated browser</div>
          <div className="text-white/40 text-xs mt-1">Try: localhost:3000, google.com, github.com</div>
        </div>
      </div>
    ),
  };

  return (
    <div className="h-full flex flex-col bg-[#0d1117] rounded-lg overflow-hidden">
      {/* Browser toolbar - responsive */}
      <div className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2 py-1.5 sm:py-2 bg-[#161b22] border-b border-white/5">
        {/* Navigation buttons */}
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <button
            onClick={onBack}
            disabled={!canGoBack}
            className={`p-1 sm:p-1.5 rounded-lg transition-colors ${
              canGoBack ? 'hover:bg-white/10 text-white/60' : 'text-white/20 cursor-not-allowed'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={onForward}
            disabled={!canGoForward}
            className={`p-1 sm:p-1.5 rounded-lg transition-colors ${
              canGoForward ? 'hover:bg-white/10 text-white/60' : 'text-white/20 cursor-not-allowed'
            }`}
          >
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={onRefresh}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-white/10 text-white/60 transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* URL bar */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/5 rounded-lg border border-white/10">
            {isSecure ? (
              <Lock className="w-3 h-3 text-green-400 flex-shrink-0" />
            ) : (
              <Globe className="w-3 h-3 text-white/40 flex-shrink-0" />
            )}
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-[10px] sm:text-xs text-white/80 outline-none truncate"
              placeholder="Enter URL..."
            />
          </div>
        </form>

        {/* Actions - hidden on very small screens */}
        <div className="hidden xs:flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <button className="p-1 sm:p-1.5 rounded-lg hover:bg-white/10 text-white/40 transition-colors">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button className="p-1 sm:p-1.5 rounded-lg hover:bg-white/10 text-white/40 transition-colors">
            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-auto bg-[#0a0a0a]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            {currentPage.content}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Preview Component
// ============================================================================

const PREVIEW_COMPONENTS: Record<string, { name: string; preview: React.ReactNode }> = {
  'ClawAIOrb': {
    name: 'Claw AI Orb',
    preview: (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-gray-900 to-black">
        <motion.div
          className="relative w-24 h-24 rounded-full"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 20px rgba(249, 115, 22, 0.4)',
              '0 0 40px rgba(249, 115, 22, 0.6)',
              '0 0 20px rgba(249, 115, 22, 0.4)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            background: 'radial-gradient(circle at 30% 30%, #fb923c, #f97316, #ea580c)',
          }}
        >
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-orange-400/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>
    ),
  },
  'ControlDeck': {
    name: 'Control Deck',
    preview: (
      <div className="flex items-center justify-center h-full p-4 bg-[#1a1a1a]">
        <div className="w-full max-w-[280px] p-3 rounded-xl bg-gradient-to-b from-gray-300 to-gray-400">
          <div className="h-10 mb-2 rounded bg-[#0a0f0a] flex items-center justify-center">
            <span className="text-green-400 text-[8px] font-mono">TASK: PREVIEW MODE</span>
          </div>
          <div className="grid grid-cols-5 gap-1 mb-2">
            {['✓', '👍', '⚡', '↵', '💬'].map((icon, i) => (
              <div key={i} className="h-8 rounded bg-[#2a2a2a] flex items-center justify-center text-xs">
                {icon}
              </div>
            ))}
          </div>
          <div className="h-6 rounded bg-[#2a2a2a] flex items-center justify-center">
            <span className="text-[8px] text-white/50">SUGGEST NEXT PROMPT</span>
          </div>
        </div>
      </div>
    ),
  },
  'DynamicIsland': {
    name: 'Dynamic Island',
    preview: (
      <div className="flex items-center justify-center h-full bg-black pt-8">
        <motion.div
          className="px-6 py-2 rounded-full bg-[#1a1a1a] flex items-center gap-3"
          animate={{ width: ['120px', '200px', '120px'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600" />
          <div className="flex-1">
            <div className="h-2 w-16 bg-white/20 rounded mb-1" />
            <div className="h-1.5 w-12 bg-white/10 rounded" />
          </div>
        </motion.div>
      </div>
    ),
  },
};

function PreviewView({
  device,
  component,
  onDeviceChange,
  onComponentChange,
}: {
  device: 'mobile' | 'tablet' | 'desktop';
  component: string;
  onDeviceChange: (device: 'mobile' | 'tablet' | 'desktop') => void;
  onComponentChange: (component: string) => void;
}) {
  // Responsive device sizes - smaller on mobile screens
  const deviceSizes = {
    mobile: 'w-[200px] h-[360px] sm:w-[280px] sm:h-[500px]',
    tablet: 'w-[320px] h-[240px] sm:w-[500px] sm:h-[350px]',
    desktop: 'w-full h-full max-w-[500px] sm:max-w-full',
  };

  const currentComponent = PREVIEW_COMPONENTS[component] || PREVIEW_COMPONENTS['ClawAIOrb'];

  return (
    <div className="h-full flex flex-col bg-[#0d1117] rounded-lg overflow-hidden">
      {/* Preview toolbar - responsive layout */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 sm:px-3 py-2 bg-[#161b22] border-b border-white/5">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-white/60 hidden sm:inline">Preview</span>
        </div>

        {/* Device switcher */}
        <div className="flex items-center gap-1 px-1 py-0.5 bg-white/5 rounded-lg">
          {[
            { id: 'mobile' as const, icon: Smartphone },
            { id: 'tablet' as const, icon: Tablet },
            { id: 'desktop' as const, icon: Monitor },
          ].map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onDeviceChange(id)}
              className={`p-1 sm:p-1.5 rounded transition-colors ${
                device === id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          ))}
        </div>

        {/* Component selector */}
        <div className="flex items-center gap-1 sm:gap-2">
          <select
            value={component}
            onChange={(e) => onComponentChange(e.target.value)}
            className="px-1.5 sm:px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] sm:text-xs text-white/80 outline-none max-w-[100px] sm:max-w-none"
          >
            {Object.entries(PREVIEW_COMPONENTS).map(([key, { name }]) => (
              <option key={key} value={key} className="bg-[#161b22]">
                {name}
              </option>
            ))}
          </select>
          <button className="p-1 sm:p-1.5 rounded-lg hover:bg-white/10 text-white/40 transition-colors">
            <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>

      {/* Preview area - responsive padding */}
      <div className="flex-1 overflow-auto p-2 sm:p-4 bg-[#0a0a0a]">
        <div className="h-full flex items-center justify-center">
          <motion.div
            layout
            className={`${deviceSizes[device]} rounded-xl overflow-hidden border border-white/10 bg-black`}
            style={{
              boxShadow: '0 0 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* Device frame */}
            {device !== 'desktop' && (
              <div className="h-5 sm:h-6 bg-[#1a1a1a] flex items-center justify-center">
                <div className="w-12 sm:w-16 h-1 bg-white/10 rounded-full" />
              </div>
            )}
            <div className={`${device !== 'desktop' ? 'h-[calc(100%-20px)] sm:h-[calc(100%-24px)]' : 'h-full'}`}>
              {currentComponent.preview}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Preview info bar - responsive */}
      <div className="flex items-center justify-between px-2 sm:px-3 py-1 sm:py-1.5 bg-[#161b22] border-t border-white/5 text-[10px] sm:text-xs text-white/40">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">{currentComponent.name}</span>
          </span>
          <span className="flex items-center gap-1">
            <MousePointer className="w-3 h-3" />
            <span className="hidden sm:inline">Interactive</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="hidden sm:inline">Hot Reload</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Process Window Component
// ============================================================================

export function ProcessWindow({ state, onStateChange, className = '' }: ProcessWindowProps) {
  const [browserLoading, setBrowserLoading] = useState(false);
  const tabScrollRef = useHorizontalScroll<HTMLDivElement>();

  const tabs = [
    { id: 'code' as const, label: 'Code', icon: Code2 },
    { id: 'chat' as const, label: 'Claw AI', icon: Sparkles },
    { id: 'terminal' as const, label: 'Terminal', icon: Terminal },
    { id: 'browser' as const, label: 'Browser', icon: Globe },
    { id: 'preview' as const, label: 'Preview', icon: Eye },
    { id: 'skills' as const, label: 'Skills', icon: Zap },
  ];

  const handleTabChange = (tab: typeof state.activeTab) => {
    onStateChange({ ...state, activeTab: tab });
  };

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    onStateChange({
      ...state,
      chatMessages: [...state.chatMessages, newMessage],
      aiTyping: true,
    });
  };

  const handleNavigate = (url: string) => {
    setBrowserLoading(true);
    setTimeout(() => {
      const newHistory = [...state.browserHistory.slice(0, state.browserHistoryIndex + 1), url];
      onStateChange({
        ...state,
        browserUrl: url,
        browserHistory: newHistory,
        browserHistoryIndex: newHistory.length - 1,
      });
      setBrowserLoading(false);
    }, 500);
  };

  const handleBrowserBack = () => {
    if (state.browserHistoryIndex > 0) {
      const newIndex = state.browserHistoryIndex - 1;
      onStateChange({
        ...state,
        browserUrl: state.browserHistory[newIndex],
        browserHistoryIndex: newIndex,
      });
    }
  };

  const handleBrowserForward = () => {
    if (state.browserHistoryIndex < state.browserHistory.length - 1) {
      const newIndex = state.browserHistoryIndex + 1;
      onStateChange({
        ...state,
        browserUrl: state.browserHistory[newIndex],
        browserHistoryIndex: newIndex,
      });
    }
  };

  const handleBrowserRefresh = () => {
    setBrowserLoading(true);
    setTimeout(() => setBrowserLoading(false), 500);
  };

  const currentContent = state.files[state.currentFile] || '';

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Tab bar - horizontally scrollable on mobile */}
      <div
        ref={tabScrollRef}
        className="flex items-center gap-1 px-2 py-1.5 bg-[#161b22] border-b border-white/5 rounded-t-xl overflow-x-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex items-center gap-1 flex-shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = state.activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  isActive && tab.id === 'chat' ? 'text-orange-400' :
                  isActive && tab.id === 'browser' ? 'text-blue-400' :
                  isActive && tab.id === 'preview' ? 'text-purple-400' :
                  isActive && tab.id === 'skills' ? 'text-yellow-400' : ''
                }`} />
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
                {tab.id === 'chat' && state.aiTyping && (
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* File selector for code tab - scrollable on mobile */}
        {state.activeTab === 'code' && (
          <div className="ml-auto flex items-center gap-1 flex-shrink-0 pl-2">
            {Object.keys(state.files).map((file) => (
              <button
                key={file}
                onClick={() => onStateChange({ ...state, currentFile: file })}
                className={`px-1.5 sm:px-2 py-1 rounded text-[10px] sm:text-xs transition-colors whitespace-nowrap flex-shrink-0 ${
                  state.currentFile === file
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-white/30 hover:text-white/60'
                }`}
              >
                {file}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {state.activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <IDEView />
            </motion.div>
          )}

          {state.activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <ChatInterface
                messages={state.chatMessages}
                isTyping={state.aiTyping}
                onSendMessage={handleSendMessage}
              />
            </motion.div>
          )}

          {state.activeTab === 'terminal' && (
            <motion.div
              key="terminal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <TerminalView output={state.terminalOutput} />
            </motion.div>
          )}

          {state.activeTab === 'browser' && (
            <motion.div
              key="browser"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <BrowserView
                url={state.browserUrl}
                onNavigate={handleNavigate}
                onBack={handleBrowserBack}
                onForward={handleBrowserForward}
                onRefresh={handleBrowserRefresh}
                canGoBack={state.browserHistoryIndex > 0}
                canGoForward={state.browserHistoryIndex < state.browserHistory.length - 1}
                isLoading={browserLoading}
              />
            </motion.div>
          )}

          {state.activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <PreviewView
                device={state.previewDevice}
                component={state.previewComponent}
                onDeviceChange={(device) => onStateChange({ ...state, previewDevice: device })}
                onComponentChange={(component) => onStateChange({ ...state, previewComponent: component })}
              />
            </motion.div>
          )}

          {state.activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full bg-[#0d1117] rounded-lg overflow-hidden"
            >
              <SkillsPanel
                onExecuteCommand={(skillId, command) => {
                  // Add command to terminal and switch to terminal tab
                  onStateChange({
                    ...state,
                    activeTab: 'terminal',
                    terminalOutput: [...state.terminalOutput, '', `$ ${command}`, '> Executing...'],
                    isProcessing: true,
                  });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// Initial State Factory
// ============================================================================

export function createInitialProcessState(): ProcessState {
  return {
    activeTab: 'chat',
    currentFile: 'app.tsx',
    files: SAMPLE_FILES,
    chatMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hey! I'm Claw AI, your coding companion. I can help you build, refactor, and debug your code. What would you like to work on today?",
        timestamp: new Date(),
      },
    ],
    terminalOutput: [
      '$ npm run dev',
      '',
      '  ▲ Next.js 14.0.0',
      '  - Local:        http://localhost:3000',
      '  - Ready in 1.2s',
      '',
      '✓ Compiled successfully',
    ],
    isProcessing: false,
    currentTask: 'IDLE',
    aiTyping: false,
    browserUrl: 'https://localhost:3000',
    browserHistory: ['https://localhost:3000'],
    browserHistoryIndex: 0,
    previewDevice: 'mobile',
    previewComponent: 'ClawAIOrb',
  };
}

export default ProcessWindow;
