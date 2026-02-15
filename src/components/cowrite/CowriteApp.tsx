'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCowrite } from '@/context/CowriteContext';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import {
  Music4,
  Mic2,
  Copy,
  Check,
  Send,
  Loader2,
  Mic,
  Square,
  Minimize2,
  Maximize2,
  RotateCcw,
  Scissors,
  Plus,
  ArrowUpDown,
  AlertCircle,
  Wand2,
  Lock,
  Unlock,
  Palette,
  ChevronDown,
  Pencil,
  Eye,
  MessageSquare,
  FileText,
  Download,
  Upload,
  Save,
  Undo2,
  Redo2,
  Keyboard,
} from 'lucide-react';
import { CLAW_AI_COWRITE_SYSTEM_PROMPT } from '@/lib/cowrite/claw-ai-cowrite-prompt';
import {
  STYLE_PRESETS,
  BLANK_STYLE_PRESET,
  MAX_MODE_HEADER,
  applyMaxMode,
  type StylePreset,
} from '@/lib/cowrite/style-presets';

// ============================================================================
// Types
// ============================================================================

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isVoice?: boolean;
  reference?: {
    text: string;
    source: 'style' | 'lyrics';
  };
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  prompt: string;
  target: 'style' | 'lyrics' | 'both';
}

// ============================================================================
// Constants
// ============================================================================

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'tighten',
    label: 'Tighten',
    icon: Scissors,
    prompt: 'Make the current prompts more sparse and concise. Remove unnecessary words. Add more space and pauses. Keep the core message but use fewer words.',
    target: 'both',
  },
  {
    id: 'expand',
    label: 'Expand',
    icon: Plus,
    prompt: 'Expand the current prompts. Add more verses, develop the themes further, and make the song longer while maintaining the style and voice.',
    target: 'lyrics',
  },
  {
    id: 'reorder',
    label: 'Reorder',
    icon: ArrowUpDown,
    prompt: 'Fix the chronology and reorder the sections for better narrative flow. Do not rewrite the bars, just rearrange the structure.',
    target: 'lyrics',
  },
  {
    id: 'sanity',
    label: 'Check',
    icon: AlertCircle,
    prompt: 'Review the current prompts for any issues: facts, names, pronunciation problems, character limits, or formatting errors. Fix any problems found.',
    target: 'both',
  },
  {
    id: 'darker',
    label: 'Darker',
    icon: Wand2,
    prompt: 'Make the tone darker and more intense. Adjust both the style and lyrics to be more moody, atmospheric, and emotionally heavy.',
    target: 'both',
  },
];

// ============================================================================
// Session & History Types
// ============================================================================

interface CowriteSession {
  id: string;
  name: string;
  styleContent: string;
  lyricsContent: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface HistoryState {
  styleContent: string;
  lyricsContent: string;
}

const SESSIONS_STORAGE_KEY = 'cowrite_sessions';
const CURRENT_SESSION_KEY = 'cowrite_current_session';
const MAX_HISTORY_LENGTH = 50;

// Session storage utilities
const saveSessions = (sessions: CowriteSession[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  }
};

const loadSessions = (): CowriteSession[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveCurrentSession = (session: CowriteSession) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
  }
};

const loadCurrentSession = (): CowriteSession | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(CURRENT_SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
};

// Export utilities
const exportToFile = (content: string, filename: string, type: 'txt' | 'md') => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.${type}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const formatExportContent = (style: string, lyrics: string): string => {
  return `# CoWrite Session Export
Generated: ${new Date().toLocaleString()}

## Style Prompt
\`\`\`
${style}
\`\`\`

## Lyrics Prompt
\`\`\`
${lyrics}
\`\`\`
`;
};

// ============================================================================
// Selection Popover Component
// ============================================================================

interface SelectionPopoverProps {
  selectedText: string;
  position: { x: number; y: number };
  onCopy: () => void;
  onAddToChat: () => void;
  onClose: () => void;
}

function SelectionPopover({ selectedText, position, onCopy, onAddToChat, onClose }: SelectionPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!selectedText) return null;

  return (
    <motion.div
      ref={popoverRef}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="fixed z-50 flex items-center gap-1 p-1 bg-card border border-border rounded-lg shadow-xl"
      style={{
        left: Math.max(8, Math.min(position.x - 60, window.innerWidth - 140)),
        top: Math.max(8, position.y - 44),
      }}
    >
      <button
        onClick={onCopy}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-muted transition-colors text-foreground"
      >
        <Copy className="w-3.5 h-3.5" />
        Copy
      </button>
      <div className="w-px h-4 bg-border" />
      <button
        onClick={onAddToChat}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-muted transition-colors"
        style={{ color: 'hsl(var(--theme-primary))' }}
      >
        <MessageSquare className="w-3.5 h-3.5" />
        Add to Chat
      </button>
    </motion.div>
  );
}

// ============================================================================
// Rich Content View Component - Document-style rendering (Apple Notes feel)
// ============================================================================

interface RichContentViewProps {
  content: string;
  type: 'style' | 'lyrics';
}

function RichContentView({ content, type }: RichContentViewProps) {
  // Parse and render content with elegant document styling
  const renderContent = () => {
    if (!content) {
      return (
        <p className="text-muted-foreground italic text-sm">
          {type === 'style' ? 'No style prompt yet...' : 'No lyrics yet...'}
        </p>
      );
    }

    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Empty lines - gentle spacing
      if (!trimmedLine) {
        elements.push(<div key={index} className="h-2" />);
        return;
      }

      // MAX MODE header tags like [Is_Max_Mode:Max], [Quality:Maxi], etc.
      const maxModeMatch = trimmedLine.match(/^\[([A-Za-z_]+):([A-Za-z]+)\]$/);
      if (maxModeMatch) {
        elements.push(
          <div key={index} className="flex items-center gap-2 py-1">
            <span className="text-xs font-medium text-muted-foreground">
              {maxModeMatch[1].replace(/_/g, ' ')}
            </span>
            <span className="text-xs font-semibold text-foreground">
              {maxModeMatch[2]}
            </span>
          </div>
        );
        return;
      }

      // Section tags like [VERSE], [CHORUS], [HOOK], [INTRO], [OUTRO], [BRIDGE], [BREAK]
      const sectionMatch = trimmedLine.match(/^\[([A-Z0-9\s-]+)\]$/);
      if (sectionMatch) {
        const sectionName = sectionMatch[1];
        elements.push(
          <div key={index} className="flex items-center gap-3 mt-6 mb-3 first:mt-0">
            <div
              className="h-px flex-1 max-w-8"
              style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.3)' }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'hsl(var(--theme-primary))' }}
            >
              {sectionName}
            </span>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.3)' }}
            />
          </div>
        );
        return;
      }

      // Suno signature line /|/***///
      if (trimmedLine.includes('/|/***///') || trimmedLine.match(/^\/\|\/\*+\/\/\/$/)) {
        elements.push(
          <div key={index} className="flex items-center justify-center py-3 my-2">
            <span className="text-xs text-muted-foreground/50 tracking-[0.3em]">
              ✦ ✦ ✦
            </span>
          </div>
        );
        return;
      }

      // Inline tags in lyrics like [spoken], [whispered], [grunt], etc.
      const hasInlineTags = /\[[^\]]+\]/.test(trimmedLine) && !sectionMatch && !maxModeMatch;
      if (hasInlineTags && type === 'lyrics') {
        const parts = trimmedLine.split(/(\[[^\]]+\])/g);
        elements.push(
          <p key={index} className="text-sm leading-7 text-foreground">
            {parts.map((part, partIndex) => {
              if (part.match(/^\[[^\]]+\]$/)) {
                return (
                  <span
                    key={partIndex}
                    className="inline-flex items-center mx-0.5 px-1.5 py-0.5 rounded-md text-xs bg-muted text-muted-foreground"
                  >
                    {part.slice(1, -1)}
                  </span>
                );
              }
              return <span key={partIndex}>{part}</span>;
            })}
          </p>
        );
        return;
      }

      // Style prompt descriptive lines
      if (type === 'style' && !maxModeMatch) {
        elements.push(
          <p key={index} className="text-sm leading-7 text-foreground">
            {trimmedLine}
          </p>
        );
        return;
      }

      // Regular lyrics lines - elegant typography
      elements.push(
        <p key={index} className="text-sm leading-7 text-foreground">
          {line || '\u00A0'}
        </p>
      );
    });

    return elements;
  };

  return (
    <article className="space-y-0">
      {renderContent()}
    </article>
  );
}

// ============================================================================
// Artifact Panel Component
// ============================================================================

interface ArtifactPanelProps {
  type: 'style' | 'lyrics';
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string;
  onChange: (content: string) => void;
  isLocked: boolean;
  onToggleLock: () => void;
  charLimit: number;
  headerExtra?: React.ReactNode;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAddToChat?: (text: string, source: 'style' | 'lyrics') => void;
}

function ArtifactPanel({
  type,
  title,
  icon: Icon,
  content,
  onChange,
  isLocked,
  onToggleLock,
  charLimit,
  headerExtra,
  isExpanded,
  onToggleExpand,
  onAddToChat,
}: ArtifactPanelProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selection, setSelection] = useState<{ text: string; position: { x: number; y: number } } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTextSelection = useCallback(() => {
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText && selectedText.length > 0) {
      const selectionObj = window.getSelection();
      if (selectionObj && selectionObj.rangeCount > 0) {
        const range = selectionObj.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelection({
          text: selectedText,
          position: { x: rect.left + rect.width / 2, y: rect.top },
        });
      }
    }
  }, []);

  const handleSelectionCopy = () => {
    if (selection?.text) {
      navigator.clipboard.writeText(selection.text);
      setSelection(null);
    }
  };

  const handleAddToChat = () => {
    if (selection?.text && onAddToChat) {
      onAddToChat(selection.text, type);
      setSelection(null);
    }
  };

  const charCount = content.length;
  const isOverLimit = charCount > charLimit;

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  // Minimized view
  if (!isExpanded) {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-card rounded-2xl border border-border">
        <div className="flex items-center gap-2">
          <span style={{ color: 'hsl(var(--theme-primary))' }}>
            <Icon className="w-4 h-4" />
          </span>
          <span className="font-semibold text-sm text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground">{charCount} chars</span>
        </div>
        <button
          onClick={onToggleExpand}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Expand"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span style={{ color: 'hsl(var(--theme-primary))' }}>
            <Icon className="w-4 h-4" />
          </span>
          <span className="font-semibold text-sm text-foreground">{title}</span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${
              isOverLimit
                ? 'bg-red-500/10 text-red-500'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {charCount}/{charLimit}
          </span>
          {headerExtra}
        </div>
        <div className="flex items-center gap-0.5">
          {/* View/Edit toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-1.5 rounded-lg transition-colors ${
              isEditing
                ? 'text-foreground bg-muted'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            style={
              isEditing
                ? { color: 'hsl(var(--theme-primary))' }
                : undefined
            }
            title={isEditing ? 'View formatted' : 'Edit raw'}
          >
            {isEditing ? <Eye className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleLock}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={isLocked ? 'Unlock editing' : 'Lock from AI edits'}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
            style={
              copied
                ? { color: 'hsl(var(--theme-primary))' }
                : undefined
            }
            title={copied ? 'Copied!' : 'Copy'}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleExpand}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area - Rich View or Editor */}
      <div className="flex-1 overflow-hidden relative">
        {isEditing ? (
          /* Raw Editor */
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLocked}
            className={`w-full h-full p-4 font-mono text-sm resize-none focus:outline-none ${
              isLocked ? 'bg-muted/50 text-muted-foreground cursor-not-allowed' : 'bg-card text-foreground'
            }`}
            style={{
              lineHeight: '1.6',
            }}
            spellCheck={false}
          />
        ) : (
          /* Rich Text View */
          <div
            ref={contentRef}
            className={`w-full h-full p-4 overflow-y-auto select-text ${
              isLocked ? 'bg-muted/30' : 'bg-card'
            }`}
            style={{
              lineHeight: '1.6',
            }}
            onMouseUp={handleTextSelection}
            onTouchEnd={handleTextSelection}
          >
            <RichContentView content={content} type={type} />
          </div>
        )}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Lock className="w-4 h-4" />
              <span>Locked from AI edits</span>
            </div>
          </div>
        )}
        {/* Selection Popover */}
        {selection && onAddToChat && (
          <SelectionPopover
            selectedText={selection.text}
            position={selection.position}
            onCopy={handleSelectionCopy}
            onAddToChat={handleAddToChat}
            onClose={() => setSelection(null)}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Voice Input Button
// ============================================================================

interface VoiceInputButtonProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

function VoiceInputButton({ onTranscription, disabled }: VoiceInputButtonProps) {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { isRecording, duration, audioLevels, startRecording, stopRecording, isSupported } =
    useVoiceRecorder({
      maxDuration: 120,
    });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      const blob = await stopRecording();
      if (blob) {
        setIsTranscribing(true);
        try {
          const formData = new FormData();
          formData.append('audio', blob, 'recording.webm');

          const response = await fetch('/api/whisper', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            if (data.text) {
              onTranscription(data.text);
            }
          }
        } catch (error) {
          console.error('Transcription error:', error);
        } finally {
          setIsTranscribing(false);
        }
      }
    } else {
      await startRecording();
    }
  };

  if (!isSupported) return null;

  return (
    <div className="flex items-center gap-2">
      {isRecording && (
        <div className="flex items-center gap-2">
          {/* Waveform visualization */}
          <div className="flex items-center gap-0.5 h-6">
            {audioLevels.slice(-8).map((level, i) => (
              <div
                key={i}
                className="w-1 rounded-full transition-all duration-75"
                style={{
                  height: `${Math.max(4, level * 24)}px`,
                  backgroundColor: 'hsl(var(--theme-primary))',
                  opacity: 0.6 + level * 0.4,
                }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatDuration(duration)}
          </span>
        </div>
      )}

      <motion.button
        onClick={handleToggleRecording}
        disabled={disabled || isTranscribing}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`p-3 rounded-full transition-colors ${
          isRecording
            ? 'bg-red-500 text-white'
            : isTranscribing
            ? 'bg-muted text-muted-foreground'
            : 'bg-muted text-foreground hover:bg-muted/80'
        }`}
      >
        {isTranscribing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isRecording ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </motion.button>
    </div>
  );
}

// ============================================================================
// Quick Actions Bar
// ============================================================================

interface QuickActionsBarProps {
  onAction: (action: QuickAction) => void;
  isLoading: boolean;
}

function QuickActionsBar({ onAction, isLoading }: QuickActionsBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-hide">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action)}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50"
        >
          <action.icon className="w-3.5 h-3.5" />
          {action.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Preset Selector Component
// ============================================================================

interface PresetSelectorProps {
  onSelectPreset: (preset: StylePreset) => void;
}

function PresetSelector({ onSelectPreset }: PresetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (preset: StylePreset) => {
    onSelectPreset(preset);
    setIsOpen(false);
  };

  // Group presets by category
  const categories = [
    { name: 'Kinetic / Rhythmic', ids: ['wild-cadence-neo-soul', 'scatter-swagger', 'modern-poet'] },
    { name: 'Soul / Introspective', ids: ['brazilian-retro-soul', 'irish-neo-soul', 'afro-soul-introspection', 'lofi-soul-confessional', 'warm-affirmation'] },
    { name: 'Cinematic / Abstract', ids: ['abstract-spoken-melody', 'cinematic-inner-dialogue'] },
    { name: 'Groove / Funk', ids: ['minimal-funk'] },
    { name: 'Experimental', ids: ['tech-poetry-os'] },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors bg-muted text-foreground hover:bg-muted/80"
      >
        <Palette className="w-4 h-4" />
        <span>Presets</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-card border border-border rounded-xl shadow-xl z-50"
        >
          {/* Blank option */}
          <button
            onClick={() => handleSelect(BLANK_STYLE_PRESET)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border"
          >
            <span className="text-lg">{BLANK_STYLE_PRESET.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{BLANK_STYLE_PRESET.name}</p>
              <p className="text-xs text-muted-foreground truncate">{BLANK_STYLE_PRESET.description}</p>
            </div>
          </button>

          {/* Categorized presets */}
          {categories.map((category) => (
            <div key={category.name}>
              <div className="px-4 py-2 bg-muted/30">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{category.name}</p>
              </div>
              {category.ids.map((id) => {
                const preset = STYLE_PRESETS.find((p) => p.id === id);
                if (!preset) return null;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelect(preset)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-lg">{preset.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{preset.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{preset.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// Session Manager Component
// ============================================================================

interface SessionManagerProps {
  onSave: () => void;
  onLoad: (session: CowriteSession) => void;
  onExport: () => void;
  currentSessionName: string;
  onRename: (name: string) => void;
}

function SessionManager({ onSave, onLoad, onExport, currentSessionName, onRename }: SessionManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState<CowriteSession[]>([]);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(currentSessionName);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessions(loadSessions());
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = () => {
    onSave();
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    saveSessions(updated);
    setSessions(updated);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-muted text-foreground hover:bg-muted/80 transition-colors"
      >
        <Save className="w-4 h-4" />
        <span className="hidden sm:inline">Sessions</span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-xl z-50"
        >
          {/* Current session */}
          <div className="p-3 border-b border-border">
            <p className="text-xs text-muted-foreground mb-1">Current Session</p>
            {editingName ? (
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={() => {
                  onRename(nameInput);
                  setEditingName(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onRename(nameInput);
                    setEditingName(false);
                  }
                }}
                className="w-full px-2 py-1 text-sm bg-muted rounded border-none focus:outline-none focus:ring-1"
                style={{ '--tw-ring-color': 'hsl(var(--theme-primary))' } as React.CSSProperties}
                autoFocus
              />
            ) : (
              <p
                className="text-sm font-medium cursor-pointer hover:text-muted-foreground"
                onClick={() => setEditingName(true)}
              >
                {currentSessionName || 'Untitled Session'}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="p-2 border-b border-border flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
            <button
              onClick={() => { onExport(); setIsOpen(false); }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>

          {/* Saved sessions */}
          <div className="max-h-48 overflow-y-auto">
            {sessions.length === 0 ? (
              <p className="p-3 text-xs text-muted-foreground text-center">No saved sessions</p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors"
                >
                  <button
                    onClick={() => { onLoad(session); setIsOpen(false); }}
                    className="flex-1 text-left"
                  >
                    <p className="text-sm font-medium truncate">{session.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </p>
                  </button>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// Keyboard Shortcuts Hook
// ============================================================================

interface UseKeyboardShortcutsProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

function useKeyboardShortcuts({ onUndo, onRedo, onSave, onExport, canUndo, canRedo }: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key === 'z' && !e.shiftKey && canUndo) {
        e.preventDefault();
        onUndo();
      } else if (modifier && e.key === 'z' && e.shiftKey && canRedo) {
        e.preventDefault();
        onRedo();
      } else if (modifier && e.key === 'y' && canRedo) {
        e.preventDefault();
        onRedo();
      } else if (modifier && e.key === 's') {
        e.preventDefault();
        onSave();
      } else if (modifier && e.key === 'e') {
        e.preventDefault();
        onExport();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, onSave, onExport, canUndo, canRedo]);
}

// ============================================================================
// Chat Panel
// ============================================================================

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, isVoice?: boolean) => void;
  onQuickAction: (action: QuickAction) => void;
  isLoading: boolean;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

function ChatPanel({
  messages,
  onSendMessage,
  onQuickAction,
  isLoading,
  isMinimized,
  onToggleMinimize,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceTranscription = (text: string) => {
    onSendMessage(text, true);
  };

  if (isMinimized) {
    return (
      <div className="flex items-center justify-between p-3 bg-card rounded-2xl border border-border">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
          >
            <Music4 className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-foreground">Claw AI</span>
          {messages.length > 1 && (
            <span className="text-xs text-muted-foreground">
              {messages.length - 1} messages
            </span>
          )}
        </div>
        <button
          onClick={onToggleMinimize}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
          >
            <Music4 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-foreground font-semibold text-sm">Claw AI</h2>
            <p className="text-muted-foreground text-xs">Suno Architect</p>
          </div>
        </div>
        <button
          onClick={onToggleMinimize}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="px-3 border-b border-border">
        <QuickActionsBar onAction={onQuickAction} isLoading={isLoading} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user' ? '' : 'bg-muted text-foreground'
              }`}
              style={
                message.role === 'user'
                  ? {
                      backgroundColor: 'hsl(var(--theme-primary) / 0.15)',
                      color: 'hsl(var(--theme-primary))',
                    }
                  : undefined
              }
            >
              {message.isVoice && message.role === 'user' && (
                <div className="flex items-center gap-1.5 mb-1 text-xs opacity-70">
                  <Mic className="w-3 h-3" />
                  <span>Voice</span>
                </div>
              )}
              {/* Reference block */}
              {message.reference && (
                <div
                  className="mb-2 p-2 rounded-lg border-l-2 bg-muted/50"
                  style={{ borderColor: 'hsl(var(--theme-primary))' }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: 'hsl(var(--theme-primary) / 0.15)',
                        color: 'hsl(var(--theme-primary))',
                      }}
                    >
                      {message.reference.source}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground italic line-clamp-3">
                    "{message.reference.text}"
                  </p>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-muted rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: 'hsl(var(--theme-primary) / 0.6)',
                    animationDelay: '0ms',
                  }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: 'hsl(var(--theme-primary) / 0.6)',
                    animationDelay: '150ms',
                  }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: 'hsl(var(--theme-primary) / 0.6)',
                    animationDelay: '300ms',
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Describe your song vision..."
            className="flex-1 bg-muted rounded-full px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': 'hsl(var(--theme-primary) / 0.3)' } as React.CSSProperties}
            disabled={isLoading}
          />
          <VoiceInputButton onTranscription={handleVoiceTranscription} disabled={isLoading} />
          <motion.button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-full transition-colors ${
              inputValue.trim() && !isLoading ? '' : 'bg-muted text-muted-foreground'
            }`}
            style={
              inputValue.trim() && !isLoading
                ? {
                    background:
                      'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
                    color: 'white',
                  }
                : undefined
            }
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Workspace Component
// ============================================================================

export function CowriteApp() {
  const {
    activeStylePrompt,
    activeLyricsPrompt,
    updateStylePrompt,
    updateLyricsPrompt,
    createStylePrompt,
    createLyricsPrompt,
  } = useCowrite();

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hey! I'm here to help you craft the perfect Suno prompts. Drop your concept, mood, or rough lyrics, and I'll help shape them into polished Style and Lyrics prompts. Both artifacts on the right update in real-time as we work.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [styleLocked, setStyleLocked] = useState(false);
  const [lyricsLocked, setLyricsLocked] = useState(false);
  const [styleExpanded, setStyleExpanded] = useState(true);
  const [lyricsExpanded, setLyricsExpanded] = useState(true);

  // Mobile tab state
  type MobileTab = 'lyrics' | 'style' | 'chat';
  const [activeTab, setActiveTab] = useState<MobileTab>('chat');

  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isUndoRedo, setIsUndoRedo] = useState(false);

  // Session management
  const [sessionName, setSessionName] = useState('Untitled Session');
  const [sessionId, setSessionId] = useState(() => Date.now().toString());

  // Track content changes for history
  const prevStyleRef = useRef<string>('');
  const prevLyricsRef = useRef<string>('');

  // Add to history when content changes (not from undo/redo)
  useEffect(() => {
    const currentStyle = activeStylePrompt?.content || '';
    const currentLyrics = activeLyricsPrompt?.content || '';

    if (isUndoRedo) {
      setIsUndoRedo(false);
      prevStyleRef.current = currentStyle;
      prevLyricsRef.current = currentLyrics;
      return;
    }

    if (currentStyle !== prevStyleRef.current || currentLyrics !== prevLyricsRef.current) {
      // Only add to history if there's actual change
      if (prevStyleRef.current !== '' || prevLyricsRef.current !== '') {
        const newState: HistoryState = {
          styleContent: currentStyle,
          lyricsContent: currentLyrics,
        };

        // Remove any future history if we're not at the end
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newState);

        // Limit history size
        if (newHistory.length > MAX_HISTORY_LENGTH) {
          newHistory.shift();
        }

        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }

      prevStyleRef.current = currentStyle;
      prevLyricsRef.current = currentLyrics;
    }
  }, [activeStylePrompt?.content, activeLyricsPrompt?.content, history, historyIndex, isUndoRedo]);

  // Undo handler
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setIsUndoRedo(true);
      if (activeStylePrompt) {
        updateStylePrompt(activeStylePrompt.id, { content: prevState.styleContent });
      }
      if (activeLyricsPrompt) {
        updateLyricsPrompt(activeLyricsPrompt.id, { content: prevState.lyricsContent });
      }
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex, activeStylePrompt, activeLyricsPrompt, updateStylePrompt, updateLyricsPrompt]);

  // Redo handler
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setIsUndoRedo(true);
      if (activeStylePrompt) {
        updateStylePrompt(activeStylePrompt.id, { content: nextState.styleContent });
      }
      if (activeLyricsPrompt) {
        updateLyricsPrompt(activeLyricsPrompt.id, { content: nextState.lyricsContent });
      }
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex, activeStylePrompt, activeLyricsPrompt, updateStylePrompt, updateLyricsPrompt]);

  // Save session
  const handleSaveSession = useCallback(() => {
    const session: CowriteSession = {
      id: sessionId,
      name: sessionName,
      styleContent: activeStylePrompt?.content || '',
      lyricsContent: activeLyricsPrompt?.content || '',
      messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const sessions = loadSessions();
    const existingIndex = sessions.findIndex(s => s.id === sessionId);

    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }

    saveSessions(sessions);
    saveCurrentSession(session);
  }, [sessionId, sessionName, activeStylePrompt?.content, activeLyricsPrompt?.content, messages]);

  // Load session
  const handleLoadSession = useCallback((session: CowriteSession) => {
    setSessionId(session.id);
    setSessionName(session.name);
    setMessages(session.messages);

    if (activeStylePrompt) {
      updateStylePrompt(activeStylePrompt.id, { content: session.styleContent });
    }
    if (activeLyricsPrompt) {
      updateLyricsPrompt(activeLyricsPrompt.id, { content: session.lyricsContent });
    }

    // Reset history
    setHistory([]);
    setHistoryIndex(-1);
  }, [activeStylePrompt, activeLyricsPrompt, updateStylePrompt, updateLyricsPrompt]);

  // Export to file
  const handleExport = useCallback(() => {
    const content = formatExportContent(
      activeStylePrompt?.content || '',
      activeLyricsPrompt?.content || ''
    );
    exportToFile(content, sessionName.replace(/\s+/g, '_'), 'md');
  }, [activeStylePrompt?.content, activeLyricsPrompt?.content, sessionName]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onSave: handleSaveSession,
    onExport: handleExport,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  });

  // Load current session on mount
  useEffect(() => {
    const saved = loadCurrentSession();
    if (saved) {
      setSessionId(saved.id);
      setSessionName(saved.name);
      // Don't auto-restore content - let user choose
    }
  }, []);

  // Ensure we have active prompts
  useEffect(() => {
    if (!activeStylePrompt) {
      createStylePrompt();
    }
    if (!activeLyricsPrompt) {
      createLyricsPrompt();
    }
  }, [activeStylePrompt, activeLyricsPrompt, createStylePrompt, createLyricsPrompt]);

  // Parse AI response for style and lyrics updates
  const parseAndApplyUpdates = useCallback(
    (response: string) => {
      // Extract style prompt from code blocks
      const stylePatterns = [
        /```style\n?([\s\S]*?)```/i,
        /```(?:style prompt)?\n?(\[Is_Max_Mode[\s\S]*?)```/i,
        /STYLE PROMPT:?\s*```\n?([\s\S]*?)```/i,
      ];

      // Extract lyrics prompt from code blocks
      const lyricsPatterns = [
        /```lyrics\n?([\s\S]*?)```/i,
        /```(?:lyrics prompt)?\n?(\/\|\[\/\*{3}\/\/\/[\s\S]*?)```/i,
        /```(?:lyrics prompt)?\n?(\[(?:INTRO|VERSE|HOOK|CHORUS)[\s\S]*?)```/i,
        /LYRICS PROMPT:?\s*```\n?([\s\S]*?)```/i,
      ];

      let styleUpdated = false;
      let lyricsUpdated = false;

      // Try to extract and apply style
      if (!styleLocked && activeStylePrompt) {
        for (const pattern of stylePatterns) {
          const match = response.match(pattern);
          if (match && match[1]) {
            const newContent = match[1].trim();
            if (newContent.includes('[Is_Max_Mode') || newContent.includes('GENRE')) {
              updateStylePrompt(activeStylePrompt.id, { content: newContent });
              styleUpdated = true;
              break;
            }
          }
        }
      }

      // Try to extract and apply lyrics
      if (!lyricsLocked && activeLyricsPrompt) {
        for (const pattern of lyricsPatterns) {
          const match = response.match(pattern);
          if (match && match[1]) {
            const newContent = match[1].trim();
            if (
              newContent.includes('[VERSE') ||
              newContent.includes('[HOOK') ||
              newContent.includes('[INTRO') ||
              newContent.includes('/|/')
            ) {
              updateLyricsPrompt(activeLyricsPrompt.id, { content: newContent });
              lyricsUpdated = true;
              break;
            }
          }
        }
      }

      return { styleUpdated, lyricsUpdated };
    },
    [
      activeStylePrompt,
      activeLyricsPrompt,
      updateStylePrompt,
      updateLyricsPrompt,
      styleLocked,
      lyricsLocked,
    ]
  );

  // Send message to AI
  const handleSendMessage = async (content: string, isVoice = false) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      isVoice,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build context with current prompts
      const context = `
CURRENT STYLE PROMPT${styleLocked ? ' (LOCKED - DO NOT MODIFY)' : ''}:
\`\`\`
${activeStylePrompt?.content || 'No style prompt yet'}
\`\`\`

CURRENT LYRICS PROMPT${lyricsLocked ? ' (LOCKED - DO NOT MODIFY)' : ''}:
\`\`\`
${activeLyricsPrompt?.content || 'No lyrics yet'}
\`\`\`

IMPORTANT: Always output the complete, updated prompts in code blocks. Use \`\`\`style and \`\`\`lyrics labels. The user sees both artifacts update in real-time.
`;

      const systemPrompt = `${CLAW_AI_COWRITE_SYSTEM_PROMPT}

${context}

REFINEMENT INSTRUCTIONS:
- When the user provides rough material, normalize it immediately into proper format
- Style prompts must start with MAX MODE headers
- Lyrics prompts should have proper section tags in []
- Output BOTH complete prompts after every edit, even small changes
- Never output partial prompts - always the full artifact
- Label code blocks clearly: \`\`\`style and \`\`\`lyrics
- Respect locked prompts - do not modify them`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content },
          ],
          model: 'cowrite',
        }),
      });

      let assistantContent: string;

      if (response.ok) {
        const data = await response.json();
        assistantContent = data.message || "I couldn't process that. Could you try again?";

        // Parse and apply updates to artifacts
        parseAndApplyUpdates(assistantContent);
      } else {
        assistantContent = "I'm having trouble connecting. Please try again.";
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Something went wrong. Let's try that again.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }

    setIsLoading(false);
  };

  // Handle quick action
  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.prompt);
  };

  // Handle artifact changes
  const handleStyleChange = (content: string) => {
    if (activeStylePrompt) {
      updateStylePrompt(activeStylePrompt.id, { content });
    }
  };

  const handleLyricsChange = (content: string) => {
    if (activeLyricsPrompt) {
      updateLyricsPrompt(activeLyricsPrompt.id, { content });
    }
  };

  // Handle preset selection - applies MAX MODE automatically
  const handlePresetSelect = (preset: StylePreset) => {
    if (activeStylePrompt) {
      const contentWithMaxMode = applyMaxMode(preset.content);
      updateStylePrompt(activeStylePrompt.id, { content: contentWithMaxMode });
    }
  };

  // Handle adding selected text to chat as a reference
  const handleAddToChat = (text: string, source: 'style' | 'lyrics') => {
    const referenceMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: `Edit this section:`,
      reference: { text, source },
    };
    setMessages((prev) => [...prev, referenceMessage]);
    // Switch to chat tab on mobile
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--theme-primary)) 0%, hsl(var(--theme-accent)) 100%)',
                boxShadow: '0 4px 14px hsl(var(--theme-primary) / 0.3)',
              }}
            >
              <Music4 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">CoWrite</h1>
              <p className="text-xs text-muted-foreground">Suno Prompt Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Undo/Redo */}
            <div className="hidden sm:flex items-center gap-1 mr-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Undo (Cmd+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Redo (Cmd+Shift+Z)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* Session Manager */}
            <SessionManager
              onSave={handleSaveSession}
              onLoad={handleLoadSession}
              onExport={handleExport}
              currentSessionName={sessionName}
              onRename={setSessionName}
            />

            {/* Reset */}
            <button
              onClick={() => {
                setMessages([
                  {
                    id: '1',
                    role: 'assistant',
                    content: "Fresh start! What song would you like to create?",
                  },
                ]);
                setSessionId(Date.now().toString());
                setSessionName('Untitled Session');
                setHistory([]);
                setHistoryIndex(-1);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-muted text-foreground hover:bg-muted/80 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </header>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden flex border-b border-border bg-card">
          {[
            { id: 'lyrics' as MobileTab, label: 'Lyrics', icon: FileText },
            { id: 'style' as MobileTab, label: 'Style', icon: Music4 },
            { id: 'chat' as MobileTab, label: 'Chat', icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-foreground border-b-2'
                  : 'text-muted-foreground'
              }`}
              style={
                activeTab === tab.id
                  ? { borderColor: 'hsl(var(--theme-primary))' }
                  : undefined
              }
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden p-4">
          {/* Mobile View - Single panel based on active tab */}
          <div className="lg:hidden h-full">
            {activeTab === 'lyrics' && (
              <div className="h-full">
                <ArtifactPanel
                  type="lyrics"
                  title="LYRICS"
                  icon={Mic2}
                  content={activeLyricsPrompt?.content || ''}
                  onChange={handleLyricsChange}
                  isLocked={lyricsLocked}
                  onToggleLock={() => setLyricsLocked(!lyricsLocked)}
                  charLimit={5000}
                  isExpanded={true}
                  onToggleExpand={() => {}}
                  onAddToChat={handleAddToChat}
                />
              </div>
            )}
            {activeTab === 'style' && (
              <div className="h-full">
                <ArtifactPanel
                  type="style"
                  title="STYLE"
                  icon={Music4}
                  content={activeStylePrompt?.content || ''}
                  onChange={handleStyleChange}
                  isLocked={styleLocked}
                  onToggleLock={() => setStyleLocked(!styleLocked)}
                  charLimit={1000}
                  headerExtra={<PresetSelector onSelectPreset={handlePresetSelect} />}
                  isExpanded={true}
                  onToggleExpand={() => {}}
                  onAddToChat={handleAddToChat}
                />
              </div>
            )}
            {activeTab === 'chat' && (
              <div className="h-full">
                <ChatPanel
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onQuickAction={handleQuickAction}
                  isLoading={isLoading}
                  isMinimized={false}
                  onToggleMinimize={() => {}}
                />
              </div>
            )}
          </div>

          {/* Desktop View - Grid layout: Lyrics 50% | Style 25% + Chat 25% */}
          <div className="hidden lg:grid h-full grid-cols-4 gap-4">
            {/* Left Panel - Lyrics (50%) */}
            <div className="col-span-2 flex flex-col min-h-0">
              <ArtifactPanel
                type="lyrics"
                title="LYRICS"
                icon={Mic2}
                content={activeLyricsPrompt?.content || ''}
                onChange={handleLyricsChange}
                isLocked={lyricsLocked}
                onToggleLock={() => setLyricsLocked(!lyricsLocked)}
                charLimit={5000}
                isExpanded={lyricsExpanded}
                onToggleExpand={() => setLyricsExpanded(!lyricsExpanded)}
                onAddToChat={handleAddToChat}
              />
            </div>

            {/* Right Panel - Style + Chat (25% each stacked) */}
            <div className="col-span-2 flex flex-col gap-4 min-h-0">
              {/* Style (top right) */}
              <div className={styleExpanded ? 'flex-1 min-h-0' : ''}>
                <ArtifactPanel
                  type="style"
                  title="STYLE"
                  icon={Music4}
                  content={activeStylePrompt?.content || ''}
                  onChange={handleStyleChange}
                  isLocked={styleLocked}
                  onToggleLock={() => setStyleLocked(!styleLocked)}
                  charLimit={1000}
                  headerExtra={<PresetSelector onSelectPreset={handlePresetSelect} />}
                  onAddToChat={handleAddToChat}
                  isExpanded={styleExpanded}
                  onToggleExpand={() => setStyleExpanded(!styleExpanded)}
                />
              </div>

              {/* Chat (bottom right) */}
              <div className="flex-1 min-h-0">
                <ChatPanel
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onQuickAction={handleQuickAction}
                  isLoading={isLoading}
                  isMinimized={false}
                  onToggleMinimize={() => {}}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CowriteApp;
