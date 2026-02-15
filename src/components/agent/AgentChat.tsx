'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mic,
  MicOff,
  Loader2,
  User,
  AtSign,
  Folder,
  FileText,
  FileCode,
  Ticket,
  ChevronRight,
  Check,
  X,
  Sparkles,
  StopCircle,
  Paperclip,
  Image as ImageIcon,
  File,
} from 'lucide-react';
import { useFileAttachment, FileAttachment } from '@/hooks/useFileAttachment';
import { ClawAIAvatar } from '@/components/claw-ai/ClawAIAvatar';
import { cn } from '@/lib/utils';
import { ContextEntity, ContextEntityType } from './ContextBar';

// Import theme styles
import '@/lib/themes/themes.css';

// =============================================================================
// Types
// =============================================================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  toolCalls?: ToolCall[];
  mentions?: ContextEntity[];
}

export interface ToolCall {
  id: string;
  name: string;
  status: 'pending' | 'executing' | 'complete' | 'error';
  args?: Record<string, unknown>;
  result?: {
    success: boolean;
    data?: Record<string, unknown>;
    error?: string;
  };
}

export interface MentionSuggestion {
  id: string;
  type: ContextEntityType;
  name: string;
  description?: string;
}

interface AgentChatProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSendMessage: (content: string, mentions?: ContextEntity[]) => void;
  onAbort?: () => void;
  mentionSuggestions?: MentionSuggestion[];
  onMentionSearch?: (query: string) => void;
  onMentionSelect?: (mention: MentionSuggestion) => void;
  onVoiceInput?: (transcript: string) => void;
  isVoiceEnabled?: boolean;
  className?: string;
}

// =============================================================================
// Entity Config
// =============================================================================

const ENTITY_ICONS: Record<ContextEntityType, typeof Folder> = {
  project: Folder,
  prd: FileText,
  epic: FileText,
  ticket: Ticket,
  file: FileCode,
};

const ENTITY_COLORS: Record<ContextEntityType, string> = {
  project: 'text-blue-400',
  prd: 'text-purple-400',
  epic: 'text-amber-400',
  ticket: 'text-green-400',
  file: 'text-orange-400',
};

// =============================================================================
// Tool Execution Card
// =============================================================================

interface ToolExecutionCardProps {
  tool: ToolCall;
}

function ToolExecutionCard({ tool }: ToolExecutionCardProps) {
  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: 'hsl(var(--theme-muted) / 0.5)',
        border: '1px solid hsl(var(--theme-border))',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{
            background:
              tool.status === 'complete' && tool.result?.success
                ? 'hsl(142 70% 45% / 0.2)'
                : tool.status === 'complete' && !tool.result?.success
                ? 'hsl(0 84% 60% / 0.2)'
                : tool.status === 'executing'
                ? 'hsl(var(--theme-primary) / 0.2)'
                : 'hsl(var(--theme-muted))',
          }}
        >
          {tool.status === 'executing' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: 'hsl(var(--theme-primary))' }} />
          ) : tool.status === 'complete' && tool.result?.success ? (
            <Check className="w-3.5 h-3.5" style={{ color: 'hsl(142 70% 45%)' }} />
          ) : tool.status === 'complete' && !tool.result?.success ? (
            <X className="w-3.5 h-3.5" style={{ color: 'hsl(0 84% 60%)' }} />
          ) : (
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'hsl(var(--theme-muted-foreground))' }} />
          )}
        </div>
        <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
          {tool.name.replace(/_/g, ' ')}
        </span>
        {tool.status === 'executing' && (
          <span className="text-xs animate-pulse" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
            Running...
          </span>
        )}
      </div>

      {/* Show result if complete */}
      {tool.status === 'complete' && tool.result && (
        <div className="mt-2 text-xs">
          {tool.result.success ? (
            <div style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              {tool.result.data && Object.keys(tool.result.data).length > 0 && (
                <pre
                  className="rounded p-2 overflow-auto max-h-24"
                  style={{ background: 'hsl(var(--theme-background))' }}
                >
                  {JSON.stringify(tool.result.data, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <div style={{ color: 'hsl(0 84% 60%)' }}>
              Error: {tool.result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Entity Preview Card
// =============================================================================

interface EntityPreviewProps {
  entity: ContextEntity;
}

function EntityPreview({ entity }: EntityPreviewProps) {
  const Icon = ENTITY_ICONS[entity.type];
  const colorClass = ENTITY_COLORS[entity.type];

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md"
      style={{ background: 'hsl(var(--theme-muted))' }}
    >
      <Icon className={cn('w-3.5 h-3.5', colorClass)} />
      <span className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
        @{entity.name}
      </span>
    </div>
  );
}

// =============================================================================
// Message Bubble
// =============================================================================

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div
          className="px-3 py-1.5 rounded-full text-xs"
          style={{
            background: 'hsl(var(--theme-muted))',
            color: 'hsl(var(--theme-muted-foreground))',
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-3 mb-4', isUser && 'flex-row-reverse')}
      style={{ gap: 'var(--theme-chat-message-gap, 0.75rem)' }}
    >
      {/* Avatar */}
      {isUser ? (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'hsl(var(--theme-chat-avatar-user, var(--theme-primary)))',
          }}
        >
          <User className="w-4 h-4" style={{ color: 'hsl(var(--theme-primary-foreground))' }} />
        </div>
      ) : (
        <ClawAIAvatar size={32} isActive={message.isStreaming} />
      )}

      {/* Content */}
      <div
        className={cn('flex-1 space-y-2', isUser && 'flex flex-col items-end')}
        style={{ maxWidth: 'var(--theme-chat-max-width, 85%)' }}
      >
        {/* Mentions */}
        {message.mentions && message.mentions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1">
            {message.mentions.map((mention) => (
              <EntityPreview key={mention.id} entity={mention} />
            ))}
          </div>
        )}

        {/* Message text */}
        <div
          className="px-4 py-2.5"
          style={{
            background: isUser
              ? 'var(--theme-chat-user-bg, hsl(var(--theme-primary)))'
              : 'hsl(var(--theme-chat-assistant-bg, var(--theme-muted)))',
            color: isUser
              ? 'hsl(var(--theme-chat-user-fg, var(--theme-primary-foreground)))'
              : 'hsl(var(--theme-chat-assistant-fg, var(--theme-foreground)))',
            borderRadius: isUser
              ? 'var(--theme-chat-bubble-radius, 1rem) var(--theme-chat-bubble-radius, 1rem) var(--theme-chat-bubble-radius-tail, 0.25rem) var(--theme-chat-bubble-radius, 1rem)'
              : 'var(--theme-chat-bubble-radius-tail, 0.25rem) var(--theme-chat-bubble-radius, 1rem) var(--theme-chat-bubble-radius, 1rem) var(--theme-chat-bubble-radius, 1rem)',
          }}
        >
          <p className="text-sm whitespace-pre-wrap">
            {message.content}
            {message.isStreaming && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-current animate-pulse" />
            )}
          </p>
        </div>

        {/* Tool calls */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="space-y-2 w-full">
            {message.toolCalls.map((tool) => (
              <ToolExecutionCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px]" style={{ color: 'hsl(var(--theme-muted-foreground) / 0.7)' }}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}

// =============================================================================
// Mention Autocomplete
// =============================================================================

interface MentionAutocompleteProps {
  suggestions: MentionSuggestion[];
  selectedIndex: number;
  onSelect: (suggestion: MentionSuggestion) => void;
}

function MentionAutocomplete({ suggestions, selectedIndex, onSelect }: MentionAutocompleteProps) {
  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-full left-0 right-0 mb-2 rounded-lg shadow-lg overflow-hidden z-50"
      style={{
        background: 'hsl(var(--theme-card))',
        border: '1px solid hsl(var(--theme-border))',
      }}
    >
      <div className="max-h-48 overflow-y-auto">
        {suggestions.map((suggestion, index) => {
          const Icon = ENTITY_ICONS[suggestion.type];
          const colorClass = ENTITY_COLORS[suggestion.type];

          return (
            <button
              key={suggestion.id}
              onClick={() => onSelect(suggestion)}
              className="w-full flex items-center gap-3 px-3 py-2 transition-colors"
              style={{
                background: index === selectedIndex ? 'hsl(var(--theme-muted))' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (index !== selectedIndex) e.currentTarget.style.background = 'hsl(var(--theme-muted) / 0.5)';
              }}
              onMouseLeave={(e) => {
                if (index !== selectedIndex) e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon className={cn('w-4 h-4', colorClass)} />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium" style={{ color: 'hsl(var(--theme-foreground))' }}>
                  @{suggestion.name}
                </p>
                {suggestion.description && (
                  <p className="text-xs truncate" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                    {suggestion.description}
                  </p>
                )}
              </div>
              <span className="text-[10px] uppercase" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
                {suggestion.type}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function AgentChat({
  messages,
  isStreaming,
  onSendMessage,
  onAbort,
  mentionSuggestions = [],
  onMentionSearch,
  onMentionSelect,
  onVoiceInput,
  isVoiceEnabled = false,
  className,
}: AgentChatProps) {
  const [input, setInput] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [selectedMentions, setSelectedMentions] = useState<ContextEntity[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // File attachment support
  const fileAttachment = useFileAttachment({
    maxFiles: 5,
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    onError: (error) => console.error('[AgentChat] Attachment error:', error),
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle input change and @ detection
  const handleInputChange = (value: string) => {
    setInput(value);

    // Check for @ mention
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const afterAt = value.slice(lastAtIndex + 1);
      // Check if we're still typing the mention (no space after @)
      if (!afterAt.includes(' ') && afterAt.length <= 20) {
        setMentionQuery(afterAt);
        setShowMentions(true);
        onMentionSearch?.(afterAt);
        return;
      }
    }
    setShowMentions(false);
  };

  // Handle mention selection
  const handleMentionSelect = (suggestion: MentionSuggestion) => {
    const lastAtIndex = input.lastIndexOf('@');
    const newInput = input.slice(0, lastAtIndex) + `@${suggestion.name} `;
    setInput(newInput);
    setShowMentions(false);
    setSelectedMentionIndex(0);

    // Add to selected mentions
    const entity: ContextEntity = {
      id: suggestion.id,
      type: suggestion.type,
      name: suggestion.name,
      description: suggestion.description,
    };
    setSelectedMentions((prev) => [...prev, entity]);

    onMentionSelect?.(suggestion);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation in autocomplete
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentions && mentionSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex((prev) => (prev + 1) % mentionSuggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex((prev) => (prev - 1 + mentionSuggestions.length) % mentionSuggestions.length);
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleMentionSelect(mentionSuggestions[selectedMentionIndex]);
      } else if (e.key === 'Escape') {
        setShowMentions(false);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle send
  const handleSend = () => {
    const hasText = input.trim().length > 0;
    const hasAttachments = fileAttachment.hasAttachments;

    if ((!hasText && !hasAttachments) || isStreaming) return;

    // Build message content including attachment info
    let messageContent = input.trim();
    if (fileAttachment.attachments.length > 0) {
      const attachmentNames = fileAttachment.attachments.map(a => a.name).join(', ');
      messageContent = messageContent
        ? `${messageContent}\n\n[Attached: ${attachmentNames}]`
        : `[Attached: ${attachmentNames}]`;
    }

    onSendMessage(messageContent || 'Please analyze the attached files.', selectedMentions);
    setInput('');
    setSelectedMentions([]);
    fileAttachment.clearAttachments();
  };

  // Handle voice toggle
  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording logic would go here
    } else {
      setIsRecording(true);
      // Start recording logic would go here
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div
      className={cn('flex flex-col h-full', className)}
      style={{
        background: 'hsl(var(--theme-background))',
        fontFamily: 'var(--theme-font)',
      }}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="mb-4">
              <ClawAIAvatar size={64} isActive={false} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(var(--theme-foreground))' }}>
              Start a conversation
            </h3>
            <p className="text-sm max-w-sm" style={{ color: 'hsl(var(--theme-muted-foreground))' }}>
              Ask me to help with code, design, or product work.
              Use @ to reference projects, PRDs, or tickets.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className="p-4"
        style={{ borderTop: '1px solid hsl(var(--theme-border))' }}
      >
        {/* Selected mentions preview */}
        {selectedMentions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {selectedMentions.map((mention) => (
              <div
                key={mention.id}
                className="flex items-center gap-1 px-2 py-1 rounded-md"
                style={{ background: 'hsl(var(--theme-muted))' }}
              >
                <EntityPreview entity={mention} />
                <button
                  onClick={() => setSelectedMentions((prev) => prev.filter((m) => m.id !== mention.id))}
                  className="p-0.5 rounded transition-colors"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--theme-muted-foreground) / 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileAttachment.fileInputRef}
          type="file"
          accept={fileAttachment.acceptedTypesString}
          multiple
          onChange={fileAttachment.handleFileInputChange}
          className="hidden"
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
              <div
                className="flex flex-wrap gap-2 p-2 rounded-lg"
                style={{
                  background: 'hsl(var(--theme-muted) / 0.5)',
                  border: '1px solid hsl(var(--theme-border) / 0.5)',
                }}
              >
                {fileAttachment.attachments.map((attachment) => {
                  const FileIcon = attachment.type.startsWith('image/') ? ImageIcon
                    : attachment.type === 'application/pdf' || attachment.type.startsWith('text/') ? FileText
                    : File;

                  return (
                    <div key={attachment.id} className="relative group">
                      {attachment.preview ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <img
                            src={attachment.preview}
                            alt={attachment.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div
                          className="w-16 h-16 rounded-lg flex flex-col items-center justify-center gap-1 p-1"
                          style={{ background: 'hsl(var(--theme-muted))' }}
                        >
                          <FileIcon className="w-5 h-5" style={{ color: 'hsl(var(--theme-primary))' }} />
                          <span
                            className="text-[9px] truncate w-full text-center"
                            style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                          >
                            {attachment.name.length > 10 ? `${attachment.name.slice(0, 8)}...` : attachment.name}
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => fileAttachment.removeAttachment(attachment.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'hsl(0 84% 60%)', color: 'white' }}
                        aria-label={`Remove ${attachment.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input container */}
        <div className="relative">
          {/* Mention autocomplete */}
          <AnimatePresence>
            {showMentions && mentionSuggestions.length > 0 && (
              <MentionAutocomplete
                suggestions={mentionSuggestions}
                selectedIndex={selectedMentionIndex}
                onSelect={handleMentionSelect}
              />
            )}
          </AnimatePresence>

          {/* Input field */}
          <div
            className="flex items-end gap-2 rounded-xl p-2"
            style={{
              background: 'hsl(var(--theme-chat-input-bg, var(--theme-muted)))',
              border: '1px solid hsl(var(--theme-chat-input-border, var(--theme-border)) / 0.5)',
            }}
          >
            {/* Attachment button */}
            <button
              onClick={fileAttachment.openFilePicker}
              disabled={isStreaming}
              className="p-2 rounded-lg transition-colors disabled:opacity-50"
              title="Attach file"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--theme-background))'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* @ mention button */}
            <button
              onClick={() => {
                setInput((prev) => prev + '@');
                setShowMentions(true);
                onMentionSearch?.('');
                inputRef.current?.focus();
              }}
              className="p-2 rounded-lg transition-colors"
              title="Add mention"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--theme-background))'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <AtSign className="w-5 h-5" />
            </button>

            {/* Text input */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything... (@ to mention)"
              rows={1}
              className="flex-1 bg-transparent resize-none focus:outline-none text-sm py-2"
              style={{
                maxHeight: '150px',
                color: 'hsl(var(--theme-chat-input-fg, var(--theme-foreground)))',
              }}
            />

            {/* Voice button */}
            {isVoiceEnabled && (
              <button
                onClick={handleVoiceToggle}
                className="p-2 rounded-lg transition-colors"
                title={isRecording ? 'Stop recording' : 'Voice input'}
                style={{
                  background: isRecording ? 'hsl(0 84% 60% / 0.2)' : 'transparent',
                  color: isRecording ? 'hsl(0 84% 60%)' : 'hsl(var(--theme-muted-foreground))',
                }}
                onMouseEnter={(e) => {
                  if (!isRecording) e.currentTarget.style.background = 'hsl(var(--theme-background))';
                }}
                onMouseLeave={(e) => {
                  if (!isRecording) e.currentTarget.style.background = 'transparent';
                }}
              >
                {isRecording ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            )}

            {/* Send / Stop button */}
            {isStreaming ? (
              <button
                onClick={onAbort}
                className="p-2 rounded-lg transition-colors"
                title="Stop generating"
                style={{
                  background: 'hsl(0 84% 60% / 0.2)',
                  color: 'hsl(0 84% 60%)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(0 84% 60% / 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'hsl(0 84% 60% / 0.2)'}
              >
                <StopCircle className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim() && !fileAttachment.hasAttachments}
                className="p-2 rounded-lg transition-colors"
                title="Send message"
                style={{
                  background: (input.trim() || fileAttachment.hasAttachments)
                    ? 'hsl(var(--theme-chat-send-bg, var(--theme-primary)))'
                    : 'hsl(var(--theme-chat-send-disabled-bg, var(--theme-muted-foreground) / 0.2))',
                  color: (input.trim() || fileAttachment.hasAttachments)
                    ? 'hsl(var(--theme-chat-send-fg, var(--theme-primary-foreground)))'
                    : 'hsl(var(--theme-chat-send-disabled-fg, var(--theme-muted-foreground)))',
                  cursor: (input.trim() || fileAttachment.hasAttachments) ? 'pointer' : 'not-allowed',
                }}
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentChat;
