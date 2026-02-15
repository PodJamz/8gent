'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Command, MessageSquare, GitBranch, FileCode, Folder, ChevronRight,
  ChevronDown, X, Check, Plus, Terminal, Play, Settings, Sparkles,
  ArrowRight, CornerDownLeft, Copy, RefreshCw, ThumbsUp, ThumbsDown,
  File, FolderOpen, Circle, Minus, Square, MoreHorizontal, Zap
} from 'lucide-react';
import { ProductPageLayout } from '@/components/design/ProductPageLayout';

// Cursor brand colors
const cursorColors = {
  bg: '#1a1a2e',
  bgSecondary: '#16162a',
  bgTertiary: '#0f0f1a',
  accent: '#7C3AED',
  accentLight: '#A78BFA',
  teal: '#2DD4BF',
  green: '#22C55E',
  red: '#EF4444',
  yellow: '#EAB308',
  blue: '#3B82F6',
  text: '#E5E5E5',
  textMuted: '#9CA3AF',
  border: '#2D2D4A',
};

// ============================================================================
// Cursor Editor with AI
// ============================================================================
function CursorEditor() {
  const [showGhostText, setShowGhostText] = useState(true);
  const [cursorLine, setCursorLine] = useState(8);

  const codeLines = [
    { num: 1, content: 'import { useState, useEffect } from \'react\';', color: cursorColors.textMuted },
    { num: 2, content: 'import { fetchUserData } from \'./api\';', color: cursorColors.textMuted },
    { num: 3, content: '', color: cursorColors.text },
    { num: 4, content: 'export function UserProfile({ userId }: { userId: string }) {', color: cursorColors.text },
    { num: 5, content: '  const [user, setUser] = useState<User | null>(null);', color: cursorColors.text },
    { num: 6, content: '  const [loading, setLoading] = useState(true);', color: cursorColors.text },
    { num: 7, content: '', color: cursorColors.text },
    { num: 8, content: '  useEffect(() => {', color: cursorColors.text, highlight: true },
    { num: 9, content: '    ', color: cursorColors.text, cursor: true },
    { num: 10, content: '  }, [userId]);', color: cursorColors.text },
    { num: 11, content: '', color: cursorColors.text },
    { num: 12, content: '  if (loading) return <Skeleton />;', color: cursorColors.text },
    { num: 13, content: '  if (!user) return <ErrorState />;', color: cursorColors.text },
    { num: 14, content: '', color: cursorColors.text },
    { num: 15, content: '  return (', color: cursorColors.text },
  ];

  const ghostText = `setLoading(true);
    fetchUserData(userId)
      .then(setUser)
      .finally(() => setLoading(false));`;

  return (
    <div
      className="rounded-lg overflow-hidden border"
      style={{ backgroundColor: cursorColors.bg, borderColor: cursorColors.border }}
    >
      {/* Editor Tabs */}
      <div
        className="flex items-center gap-1 px-2 py-1 border-b"
        style={{ backgroundColor: cursorColors.bgSecondary, borderColor: cursorColors.border }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-t text-sm"
          style={{ backgroundColor: cursorColors.bg, color: cursorColors.text }}
        >
          <FileCode className="w-4 h-4 text-blue-400" />
          <span>UserProfile.tsx</span>
          <button className="p-0.5 hover:bg-white/10 rounded">
            <X className="w-3 h-3" style={{ color: cursorColors.textMuted }} />
          </button>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 text-sm"
          style={{ color: cursorColors.textMuted }}
        >
          <FileCode className="w-4 h-4" />
          <span>api.ts</span>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex">
        {/* Line Numbers */}
        <div
          className="flex flex-col items-end px-4 py-3 text-xs select-none border-r"
          style={{ color: cursorColors.textMuted, borderColor: cursorColors.border, backgroundColor: cursorColors.bgSecondary }}
        >
          {codeLines.map(line => (
            <div
              key={line.num}
              className="h-6 flex items-center"
              style={{ color: line.highlight ? cursorColors.accent : cursorColors.textMuted }}
            >
              {line.num}
            </div>
          ))}
        </div>

        {/* Code */}
        <div className="flex-1 py-3 px-4 font-mono text-sm overflow-x-auto">
          {codeLines.map(line => (
            <div
              key={line.num}
              className="h-6 flex items-center whitespace-pre"
              style={{
                color: line.color,
                backgroundColor: line.highlight ? `${cursorColors.accent}15` : 'transparent',
              }}
            >
              {/* Syntax highlighting simulation */}
              {line.content.includes('import') && (
                <span style={{ color: cursorColors.accentLight }}>import </span>
              )}
              {line.content.includes('import') && (
                <span style={{ color: cursorColors.text }}>{line.content.replace('import ', '')}</span>
              )}
              {line.content.includes('export function') && (
                <>
                  <span style={{ color: cursorColors.accentLight }}>export function </span>
                  <span style={{ color: cursorColors.teal }}>UserProfile</span>
                  <span style={{ color: cursorColors.text }}>{line.content.replace('export function UserProfile', '')}</span>
                </>
              )}
              {line.content.includes('const [') && (
                <>
                  <span style={{ color: cursorColors.accentLight }}>  const </span>
                  <span style={{ color: cursorColors.text }}>{line.content.replace('  const ', '')}</span>
                </>
              )}
              {line.content.includes('useEffect') && (
                <>
                  <span style={{ color: cursorColors.text }}>  </span>
                  <span style={{ color: cursorColors.teal }}>useEffect</span>
                  <span style={{ color: cursorColors.yellow }}>{'(() => {'}</span>
                </>
              )}
              {line.content.includes('if (') && (
                <>
                  <span style={{ color: cursorColors.accentLight }}>  if </span>
                  <span style={{ color: cursorColors.text }}>{line.content.replace('  if ', '')}</span>
                </>
              )}
              {line.content.includes('return (') && (
                <>
                  <span style={{ color: cursorColors.accentLight }}>  return </span>
                  <span style={{ color: cursorColors.yellow }}>{'('}</span>
                </>
              )}
              {!line.content.includes('import') &&
               !line.content.includes('export') &&
               !line.content.includes('const [') &&
               !line.content.includes('useEffect') &&
               !line.content.includes('if (') &&
               !line.content.includes('return (') && (
                <span>{line.content}</span>
              )}

              {/* Ghost text (AI suggestion) */}
              {line.cursor && showGhostText && (
                <span style={{ color: cursorColors.textMuted, opacity: 0.6 }}>
                  {ghostText.split('\n')[0]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Suggestion Bar */}
      <AnimatePresence>
        {showGhostText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center justify-between px-4 py-2 border-t"
            style={{ backgroundColor: cursorColors.bgSecondary, borderColor: cursorColors.border }}
          >
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4" style={{ color: cursorColors.accent }} />
              <span style={{ color: cursorColors.textMuted }}>AI suggestion available</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGhostText(false)}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                style={{ backgroundColor: cursorColors.accent, color: 'white' }}
              >
                <Check className="w-3 h-3" />
                Accept <span className="opacity-60">Tab</span>
              </button>
              <button
                onClick={() => setShowGhostText(false)}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-white/10"
                style={{ color: cursorColors.textMuted }}
              >
                <X className="w-3 h-3" />
                Reject <span className="opacity-60">Esc</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Command Palette (Cmd+K)
// ============================================================================
function CommandPalette() {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const commands = [
    { icon: Sparkles, label: 'Edit selection with AI', shortcut: '⌘K', category: 'AI' },
    { icon: MessageSquare, label: 'Chat about this file', shortcut: '⌘L', category: 'AI' },
    { icon: Terminal, label: 'Generate terminal command', shortcut: '⌘⇧K', category: 'AI' },
    { icon: Search, label: 'Go to file', shortcut: '⌘P', category: 'Navigation' },
    { icon: Command, label: 'Show all commands', shortcut: '⌘⇧P', category: 'Navigation' },
    { icon: GitBranch, label: 'Switch branch', shortcut: null, category: 'Git' },
    { icon: RefreshCw, label: 'Sync changes', shortcut: null, category: 'Git' },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="w-full max-w-lg mx-auto rounded-lg overflow-hidden border shadow-2xl"
      style={{ backgroundColor: cursorColors.bg, borderColor: cursorColors.border }}
    >
      {/* Search Input */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: cursorColors.border }}
      >
        <Search className="w-5 h-5" style={{ color: cursorColors.textMuted }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command or search..."
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: cursorColors.text }}
        />
        <div
          className="flex items-center gap-1 px-2 py-1 rounded text-xs"
          style={{ backgroundColor: cursorColors.bgSecondary, color: cursorColors.textMuted }}
        >
          <Command className="w-3 h-3" />
          K
        </div>
      </div>

      {/* Commands */}
      <div className="py-2 max-h-80 overflow-y-auto">
        {['AI', 'Navigation', 'Git'].map(category => {
          const categoryCommands = filteredCommands.filter(c => c.category === category);
          if (categoryCommands.length === 0) return null;

          return (
            <div key={category}>
              <div
                className="px-4 py-1 text-xs font-medium"
                style={{ color: cursorColors.textMuted }}
              >
                {category}
              </div>
              {categoryCommands.map((cmd, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 px-4 py-2 transition-colors"
                  style={{
                    backgroundColor: activeIndex === i ? `${cursorColors.accent}20` : 'transparent',
                    color: cursorColors.text,
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <cmd.icon className="w-4 h-4" style={{ color: cursorColors.accent }} />
                  <span className="flex-1 text-left text-sm">{cmd.label}</span>
                  {cmd.shortcut && (
                    <span
                      className="text-xs"
                      style={{ color: cursorColors.textMuted }}
                    >
                      {cmd.shortcut}
                    </span>
                  )}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-2 border-t text-xs"
        style={{ backgroundColor: cursorColors.bgSecondary, borderColor: cursorColors.border, color: cursorColors.textMuted }}
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <ArrowRight className="w-3 h-3 rotate-90" />
            <ArrowRight className="w-3 h-3 -rotate-90" />
            navigate
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3" />
            select
          </span>
        </div>
        <span>esc to close</span>
      </div>
    </div>
  );
}

// ============================================================================
// Chat Sidebar
// ============================================================================
function ChatSidebar() {
  const [messages, setMessages] = useState([
    { role: 'user', content: 'How do I implement authentication in this app?' },
    { role: 'assistant', content: 'I can help you implement authentication. Based on your project structure, I recommend using NextAuth.js with the App Router.\n\nHere\'s a quick overview:\n\n1. Install the package:\n```bash\nnpm install next-auth\n```\n\n2. Create an auth configuration file\n3. Add the route handler\n4. Wrap your app with the session provider\n\nWould you like me to generate the code for any of these steps?' },
  ]);
  const [input, setInput] = useState('');

  return (
    <div
      className="w-80 h-[500px] flex flex-col rounded-lg overflow-hidden border"
      style={{ backgroundColor: cursorColors.bg, borderColor: cursorColors.border }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: cursorColors.border }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: cursorColors.accent }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-sm" style={{ color: cursorColors.text }}>
            Cursor Chat
          </span>
        </div>
        <button className="p-1 rounded hover:bg-white/10">
          <Plus className="w-4 h-4" style={{ color: cursorColors.textMuted }} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                msg.role === 'user' ? '' : ''
              }`}
              style={{
                backgroundColor: msg.role === 'user' ? cursorColors.accent : cursorColors.bgSecondary,
                color: cursorColors.text,
              }}
            >
              {msg.content.split('```').map((part, j) => {
                if (j % 2 === 1) {
                  return (
                    <pre
                      key={j}
                      className="my-2 p-2 rounded text-xs overflow-x-auto"
                      style={{ backgroundColor: cursorColors.bgTertiary }}
                    >
                      <code>{part.replace('bash\n', '')}</code>
                    </pre>
                  );
                }
                return <span key={j}>{part}</span>;
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t" style={{ borderColor: cursorColors.border }}>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ backgroundColor: cursorColors.bgSecondary }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: cursorColors.text }}
          />
          <button
            className="p-1.5 rounded"
            style={{ backgroundColor: input ? cursorColors.accent : 'transparent' }}
          >
            <ArrowRight className="w-4 h-4" style={{ color: input ? 'white' : cursorColors.textMuted }} />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: cursorColors.textMuted }}>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ backgroundColor: cursorColors.bgSecondary }}>
            @Codebase
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ backgroundColor: cursorColors.bgSecondary }}>
            @Docs
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Diff Preview
// ============================================================================
function DiffPreview() {
  const diffLines = [
    { type: 'context', content: 'function calculateTotal(items: Item[]) {', lineOld: 12, lineNew: 12 },
    { type: 'deleted', content: '  let total = 0;', lineOld: 13, lineNew: null },
    { type: 'deleted', content: '  for (const item of items) {', lineOld: 14, lineNew: null },
    { type: 'deleted', content: '    total += item.price * item.quantity;', lineOld: 15, lineNew: null },
    { type: 'deleted', content: '  }', lineOld: 16, lineNew: null },
    { type: 'deleted', content: '  return total;', lineOld: 17, lineNew: null },
    { type: 'added', content: '  return items.reduce((total, item) => {', lineOld: null, lineNew: 13 },
    { type: 'added', content: '    return total + item.price * item.quantity;', lineOld: null, lineNew: 14 },
    { type: 'added', content: '  }, 0);', lineOld: null, lineNew: 15 },
    { type: 'context', content: '}', lineOld: 18, lineNew: 16 },
  ];

  return (
    <div
      className="rounded-lg overflow-hidden border"
      style={{ backgroundColor: cursorColors.bg, borderColor: cursorColors.border }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ backgroundColor: cursorColors.bgSecondary, borderColor: cursorColors.border }}
      >
        <div className="flex items-center gap-2 text-sm">
          <FileCode className="w-4 h-4" style={{ color: cursorColors.accent }} />
          <span style={{ color: cursorColors.text }}>cart.ts</span>
          <span style={{ color: cursorColors.textMuted }}>- AI Edit Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
            style={{ backgroundColor: cursorColors.green, color: 'white' }}
          >
            <Check className="w-3 h-3" />
            Accept
          </button>
          <button
            className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-white/10"
            style={{ color: cursorColors.textMuted }}
          >
            <X className="w-3 h-3" />
            Reject
          </button>
        </div>
      </div>

      {/* Diff Content */}
      <div className="font-mono text-sm overflow-x-auto">
        {diffLines.map((line, i) => (
          <div
            key={i}
            className="flex"
            style={{
              backgroundColor:
                line.type === 'added' ? `${cursorColors.green}15` :
                line.type === 'deleted' ? `${cursorColors.red}15` :
                'transparent',
            }}
          >
            {/* Line Numbers */}
            <div
              className="flex-shrink-0 w-16 flex text-xs py-1 select-none"
              style={{ color: cursorColors.textMuted, backgroundColor: cursorColors.bgSecondary }}
            >
              <span className="w-8 text-right px-2">{line.lineOld || ''}</span>
              <span className="w-8 text-right px-2">{line.lineNew || ''}</span>
            </div>

            {/* Indicator */}
            <div
              className="w-6 flex items-center justify-center text-sm font-medium"
              style={{
                color:
                  line.type === 'added' ? cursorColors.green :
                  line.type === 'deleted' ? cursorColors.red :
                  'transparent',
              }}
            >
              {line.type === 'added' ? '+' : line.type === 'deleted' ? '-' : ''}
            </div>

            {/* Content */}
            <div
              className="flex-1 py-1 pr-4 whitespace-pre"
              style={{
                color:
                  line.type === 'added' ? cursorColors.green :
                  line.type === 'deleted' ? cursorColors.red :
                  cursorColors.text,
              }}
            >
              {line.content}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-2 border-t text-xs"
        style={{ backgroundColor: cursorColors.bgSecondary, borderColor: cursorColors.border, color: cursorColors.textMuted }}
      >
        <span>Refactored to use reduce for cleaner, more functional code</span>
        <span className="flex items-center gap-2">
          <span style={{ color: cursorColors.green }}>+3</span>
          <span style={{ color: cursorColors.red }}>-5</span>
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Terminal Integration
// ============================================================================
function CursorTerminal() {
  const [lines] = useState([
    { type: 'prompt', content: '~/projects/myapp' },
    { type: 'command', content: 'npm run dev' },
    { type: 'output', content: '' },
    { type: 'output', content: '> myapp@0.1.0 dev' },
    { type: 'output', content: '> next dev' },
    { type: 'output', content: '' },
    { type: 'success', content: '▲ Next.js 14.0.4' },
    { type: 'output', content: '- Local:        http://localhost:3000' },
    { type: 'output', content: '- Environments: .env.local' },
    { type: 'output', content: '' },
    { type: 'success', content: '✓ Ready in 1.2s' },
  ]);

  return (
    <div
      className="rounded-lg overflow-hidden border"
      style={{ backgroundColor: cursorColors.bgTertiary, borderColor: cursorColors.border }}
    >
      {/* Terminal Header */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ backgroundColor: cursorColors.bgSecondary, borderColor: cursorColors.border }}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" style={{ color: cursorColors.textMuted }} />
          <span className="text-sm" style={{ color: cursorColors.text }}>Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 rounded hover:bg-white/10">
            <Plus className="w-4 h-4" style={{ color: cursorColors.textMuted }} />
          </button>
          <button className="p-1 rounded hover:bg-white/10">
            <X className="w-4 h-4" style={{ color: cursorColors.textMuted }} />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 font-mono text-sm space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className="flex items-center gap-2">
            {line.type === 'prompt' && (
              <>
                <span style={{ color: cursorColors.teal }}>{line.content}</span>
                <span style={{ color: cursorColors.accent }}>$</span>
              </>
            )}
            {line.type === 'command' && (
              <span style={{ color: cursorColors.text }}>{line.content}</span>
            )}
            {line.type === 'output' && (
              <span style={{ color: cursorColors.textMuted }}>{line.content}</span>
            )}
            {line.type === 'success' && (
              <span style={{ color: cursorColors.green }}>{line.content}</span>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-2">
          <span style={{ color: cursorColors.teal }}>~/projects/myapp</span>
          <span style={{ color: cursorColors.accent }}>$</span>
          <span className="w-2 h-4 animate-pulse" style={{ backgroundColor: cursorColors.text }} />
        </div>
      </div>

      {/* AI Command Suggestion */}
      <div
        className="flex items-center gap-3 px-4 py-2 border-t"
        style={{ backgroundColor: cursorColors.bgSecondary, borderColor: cursorColors.border }}
      >
        <Sparkles className="w-4 h-4" style={{ color: cursorColors.accent }} />
        <span className="text-xs" style={{ color: cursorColors.textMuted }}>
          Type <span style={{ color: cursorColors.accent }}>⌘⇧K</span> to generate a command with AI
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Component Library
// ============================================================================
function CursorComponentLibrary() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-8">
      {/* File Tree */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          File Explorer
        </h4>
        <div
          className="w-64 rounded-lg border overflow-hidden"
          style={{ backgroundColor: cursorColors.bgSecondary, borderColor: cursorColors.border }}
        >
          <div className="p-2 space-y-0.5 text-sm">
            {[
              { type: 'folder', name: 'src', open: true },
              { type: 'folder', name: 'components', indent: 1, open: true },
              { type: 'file', name: 'Button.tsx', indent: 2 },
              { type: 'file', name: 'Input.tsx', indent: 2 },
              { type: 'file', name: 'Modal.tsx', indent: 2, active: true },
              { type: 'folder', name: 'hooks', indent: 1 },
              { type: 'folder', name: 'utils', indent: 1 },
              { type: 'file', name: 'app.tsx', indent: 1 },
              { type: 'file', name: 'index.tsx', indent: 1 },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors"
                style={{
                  paddingLeft: `${(item.indent || 0) * 12 + 8}px`,
                  backgroundColor: item.active ? `${cursorColors.accent}30` : 'transparent',
                  color: item.active ? cursorColors.text : cursorColors.textMuted,
                }}
              >
                {item.type === 'folder' ? (
                  <>
                    <ChevronRight className={`w-3 h-3 ${item.open ? 'rotate-90' : ''}`} />
                    <FolderOpen className="w-4 h-4" style={{ color: cursorColors.yellow }} />
                  </>
                ) : (
                  <>
                    <span className="w-3" />
                    <FileCode className="w-4 h-4" style={{ color: cursorColors.blue }} />
                  </>
                )}
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Tabs */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Tab Styles
        </h4>
        <div
          className="rounded-lg border overflow-hidden"
          style={{ backgroundColor: cursorColors.bgSecondary, borderColor: cursorColors.border }}
        >
          <div className="flex items-center gap-1 px-2 py-1">
            {['Modal.tsx', 'Button.tsx', 'api.ts'].map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-t text-sm transition-colors"
                style={{
                  backgroundColor: activeTab === i ? cursorColors.bg : 'transparent',
                  color: activeTab === i ? cursorColors.text : cursorColors.textMuted,
                }}
              >
                <FileCode className="w-4 h-4" style={{ color: cursorColors.blue }} />
                <span>{tab}</span>
                {activeTab === i && (
                  <X className="w-3 h-3 hover:bg-white/20 rounded" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Status Bar
        </h4>
        <div
          className="flex items-center justify-between px-3 py-1 rounded-lg text-xs"
          style={{ backgroundColor: cursorColors.accent, color: 'white' }}
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              main
            </span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              0↓ 2↑
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>TypeScript</span>
            <span>UTF-8</span>
            <span>Ln 42, Col 18</span>
          </div>
        </div>
      </div>

      {/* AI Indicators */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          AI Indicators
        </h4>
        <div className="flex flex-wrap gap-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ backgroundColor: cursorColors.bgSecondary }}
          >
            <Sparkles className="w-4 h-4" style={{ color: cursorColors.accent }} />
            <span className="text-sm" style={{ color: cursorColors.text }}>Generating...</span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ backgroundColor: `${cursorColors.green}20` }}
          >
            <Check className="w-4 h-4" style={{ color: cursorColors.green }} />
            <span className="text-sm" style={{ color: cursorColors.green }}>Applied</span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ backgroundColor: `${cursorColors.yellow}20` }}
          >
            <Zap className="w-4 h-4" style={{ color: cursorColors.yellow }} />
            <span className="text-sm" style={{ color: cursorColors.yellow }}>Thinking...</span>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div>
        <h4 className="text-sm font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Keyboard Shortcuts
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: '⌘K', action: 'Edit with AI' },
            { key: '⌘L', action: 'Chat' },
            { key: '⌘P', action: 'Quick Open' },
            { key: '⌘⇧P', action: 'Commands' },
          ].map((shortcut, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ backgroundColor: cursorColors.bgSecondary }}
            >
              <span className="text-sm" style={{ color: cursorColors.textMuted }}>{shortcut.action}</span>
              <span
                className="px-2 py-0.5 rounded text-xs font-mono"
                style={{ backgroundColor: cursorColors.bg, color: cursorColors.text }}
              >
                {shortcut.key}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================
export default function CursorPage() {
  return (
    <ProductPageLayout
      theme="cursor"
      targetUser="developers who want AI as a true coding partner"
      problemStatement="Coding is 80% context switching, 20% actual creation. Find the file, understand the code, look up the API, write the boilerplate."
      problemContext="Cursor reimagines the editor as an AI-native environment. The AI doesn't just autocomplete. It understands your entire codebase, suggests edits across files, and learns your patterns. Code generation meets code understanding."
      insight="The best AI isn't a chatbot. It's invisible assistance that appears exactly when needed. Ghost text, inline edits, contextual suggestions. AI should amplify your intent, not interrupt your flow."
      tradeoffs={['AI-first over traditional workflows', 'Codebase understanding over generic assistance', 'Speed over ceremony']}
      appName="Cursor"
      appDescription="The AI-first code editor"
      showToolbar={true}
      themeLabel="Cursor"
      onReferenceToAI={(prompt) => { if (typeof window !== 'undefined') { sessionStorage.setItem('openclaw_theme_reference', prompt); sessionStorage.setItem('openclaw_theme_reference_timestamp', Date.now().toString()); } }}
      principles={[
        {
          title: 'Contextual',
          description: 'AI that understands your entire codebase. References, types, patterns. Everything informs suggestions.',
        },
        {
          title: 'Invisible',
          description: 'Ghost text that appears at the cursor. Accept with Tab, reject with Esc. No mode switches, no popups.',
        },
        {
          title: 'Powerful',
          description: 'Cmd+K for inline edits. Cmd+L for chat. Natural language to code in the flow of work.',
        },
        {
          title: 'Fast',
          description: 'Built on VS Code, optimized for speed. AI suggestions in milliseconds. Never wait for your tools.',
        },
      ]}
      quote={{
        text: "The future of programming is natural language. Not replacing code, but augmenting the programmer.",
        author: 'Cursor Team',
      }}
    >
      {/* Editor Demo */}
      <CursorEditor />

      {/* Command Palette Demo */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Command Palette (⌘K)
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          AI-powered command palette. Type what you want to do in natural language.
        </p>
        <CommandPalette />
      </div>

      {/* Chat Sidebar Demo */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Chat Sidebar (⌘L)
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Conversation with context. Reference your codebase, docs, and current file.
        </p>
        <div className="flex justify-center">
          <ChatSidebar />
        </div>
      </div>

      {/* Diff Preview Demo */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          AI Edit Preview
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          See exactly what AI will change before accepting. Full diff view with accept/reject controls.
        </p>
        <DiffPreview />
      </div>

      {/* Terminal Demo */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Integrated Terminal
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          Terminal with AI command generation. Describe what you want, get the right command.
        </p>
        <CursorTerminal />
      </div>

      {/* Component Library */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Component Library
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          The building blocks of Cursor&apos;s interface. Dark-first, keyboard-driven, AI-ready.
        </p>
        <CursorComponentLibrary />
      </div>

      {/* Color Palette */}
      <div className="mt-16">
        <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--theme-foreground))' }}>
          Cursor Color Palette
        </h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
          A dark-first palette optimized for long coding sessions. Click to copy hex values.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Background', color: cursorColors.bg },
            { name: 'Accent', color: cursorColors.accent },
            { name: 'Teal', color: cursorColors.teal },
            { name: 'Green', color: cursorColors.green },
            { name: 'Red', color: cursorColors.red },
            { name: 'Yellow', color: cursorColors.yellow },
            { name: 'Blue', color: cursorColors.blue },
            { name: 'Text', color: cursorColors.text },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => navigator.clipboard.writeText(item.color)}
              className="group p-4 rounded-lg transition-all hover:scale-105 border"
              style={{
                backgroundColor: item.color,
                borderColor: item.name === 'Text' ? cursorColors.border : 'transparent',
              }}
            >
              <div
                className="text-sm font-medium"
                style={{ color: item.name === 'Background' || item.name === 'Text' ? cursorColors.accent : 'white' }}
              >
                {item.name}
              </div>
              <div
                className="text-xs font-mono opacity-80"
                style={{ color: item.name === 'Background' || item.name === 'Text' ? cursorColors.textMuted : 'white' }}
              >
                {item.color}
              </div>
            </button>
          ))}
        </div>
      </div>

    </ProductPageLayout>
  );
}
