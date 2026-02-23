'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@/lib/openclaw/hooks';
import { useUser } from '@clerk/nextjs';
import { api } from '@/lib/convex-shim';
import {
  MessageCircle,
  Search,
  ChevronLeft,
  Send,
  Plus,
  Camera,
  Check,
  CheckCheck,
  ChevronRight,
  Clock,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  File,
} from 'lucide-react';
import { useFileAttachment, FileAttachment } from '@/hooks/useFileAttachment';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Platform icons and colors (these remain fixed as they're brand colors)
const PLATFORM_CONFIG: Record<string, { icon: string; color: string; bgColor: string; name: string }> = {
  whatsapp: { icon: '󰖣', color: '#25D366', bgColor: 'bg-[#25D366]', name: 'WhatsApp' },
  imessage: { icon: '󰍡', color: '#34C759', bgColor: 'bg-[#34C759]', name: 'iMessage' },
  telegram: { icon: '󰔁', color: '#0088CC', bgColor: 'bg-[#0088CC]', name: 'Telegram' },
  slack: { icon: '󰒱', color: '#4A154B', bgColor: 'bg-[#4A154B]', name: 'Slack' },
  discord: { icon: '󰙯', color: '#5865F2', bgColor: 'bg-[#5865F2]', name: 'Discord' },
  web: { icon: '󰖟', color: '#FF9500', bgColor: 'bg-[#FF9500]', name: 'Web' },
};

/**
 * Platform Badge - Shows which platform a message came from
 * Subtle indicator that doesn't distract from the conversation
 */
function PlatformBadge({ platform, size = 'sm' }: { platform: string; size?: 'sm' | 'md' }) {
  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.web;

  if (size === 'sm') {
    // Tiny dot indicator
    return (
      <span
        className="w-3 h-3 rounded-full border-2 border-background shadow-sm"
        style={{ backgroundColor: config.color }}
        title={`via ${config.name}`}
      />
    );
  }

  // Full badge with name
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-tight"
      style={{ color: config.color }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      <span>{config.name}</span>
    </span>
  );
}

/**
 * Conversation List Item - iOS Messages style
 */
function ConversationItem({
  conversation,
  isSelected,
  onClick
}: {
  conversation: {
    integrationId: string;
    platform: string;
    platformUserId: string;
    platformUsername?: string;
    lastMessage: { content: string; createdAt: number; direction: string } | null;
    messageCount: number;
    unreadCount: number;
  };
  isSelected: boolean;
  onClick: () => void;
}) {
  const displayName = conversation.platformUsername || formatPhoneNumber(conversation.platformUserId);
  const lastMessage = conversation.lastMessage;
  const isUnread = conversation.unreadCount > 0;
  const platformConfig = PLATFORM_CONFIG[conversation.platform] || PLATFORM_CONFIG.web;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 min-h-[76px] transition-colors active:opacity-80',
        isSelected ? 'bg-primary/10' : 'bg-card',
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Avatar with platform indicator */}
      <div className="relative shrink-0">
        <div
          className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-white font-semibold text-xl"
          style={{
            background: `linear-gradient(135deg, ${platformConfig.color}cc, ${platformConfig.color})`,
          }}
        >
          {displayName.charAt(0).toUpperCase()}
        </div>
        {/* Platform badge - bottom right */}
        <div className="absolute -bottom-0.5 -right-0.5">
          <PlatformBadge platform={conversation.platform} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left border-b border-border/30 py-1 -my-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'text-[17px] tracking-[-0.4px] truncate text-foreground',
              isUnread ? 'font-semibold' : 'font-normal'
            )}
            style={{ fontFamily: '-apple-system, SF Pro Text, system-ui, sans-serif' }}
          >
            {displayName}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {lastMessage && (
              <span
                className={cn(
                  'text-[15px] tracking-[-0.2px]',
                  isUnread ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {formatRelativeTime(lastMessage.createdAt)}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          </div>
        </div>
        {lastMessage && (
          <p
            className={cn(
              'text-[15px] tracking-[-0.2px] truncate mt-0.5 text-muted-foreground',
              isUnread ? 'font-medium' : 'font-normal'
            )}
          >
            {lastMessage.direction === 'outbound' && 'You: '}
            {lastMessage.content}
          </p>
        )}
      </div>

      {/* Unread badge */}
      {isUnread && (
        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-primary">
          <span className="text-[11px] font-bold text-primary-foreground">{conversation.unreadCount}</span>
        </div>
      )}
    </button>
  );
}

/**
 * Format phone number for display
 */
function formatPhoneNumber(phoneOrId: string): string {
  // Remove any non-digit characters except +
  const cleaned = phoneOrId.replace(/[^\d+]/g, '');

  // If it's a phone number (starts with + or has 10+ digits)
  if (cleaned.startsWith('+') || cleaned.length >= 10) {
    // Format as (XXX) XXX-XXXX for US numbers
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    // For international, show +X (XXX) XXX-XXXX
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
  }

  // Return as-is if not a recognizable phone format
  return phoneOrId;
}

/**
 * Message Bubble - iOS iMessage style
 */
function MessageBubble({
  message,
  showTimestamp = false,
  isFirstInGroup = true,
}: {
  message: {
    messageId: string;
    content: string;
    direction: 'inbound' | 'outbound';
    platform: string;
    messageType: string;
    status: string;
    createdAt: number;
    transcription?: string;
    aiResponse?: string;
  };
  showTimestamp?: boolean;
  isFirstInGroup?: boolean;
}) {
  const isOutbound = message.direction === 'outbound';
  const platformConfig = PLATFORM_CONFIG[message.platform] || PLATFORM_CONFIG.web;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex flex-col', isOutbound ? 'items-end' : 'items-start')}
    >
      {/* Timestamp (shown occasionally) */}
      {showTimestamp && (
        <div className="text-center w-full my-3">
          <span className="text-[11px] font-medium tracking-[-0.1px] text-muted-foreground">
            {formatMessageTimestamp(message.createdAt)}
          </span>
        </div>
      )}

      {/* Platform indicator for inbound (first message in group) */}
      {!isOutbound && isFirstInGroup && (
        <div className="flex items-center gap-1.5 mb-1 ml-3">
          <PlatformBadge platform={message.platform} size="md" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[70%] px-3 py-2 relative',
          isOutbound
            ? 'rounded-[18px] rounded-br-[4px] bg-primary text-primary-foreground'
            : 'rounded-[18px] rounded-bl-[4px] bg-muted text-foreground'
        )}
      >
        {/* Content */}
        <p
          className="text-[17px] leading-[22px] tracking-[-0.4px] whitespace-pre-wrap break-words"
          style={{ fontFamily: '-apple-system, SF Pro Text, system-ui, sans-serif' }}
        >
          {message.content}
        </p>

        {/* Transcription for voice */}
        {message.transcription && message.messageType === 'voice' && (
          <p
            className="text-[13px] mt-1 opacity-80 italic"
            style={{ fontFamily: '-apple-system, SF Pro Text, system-ui, sans-serif' }}
          >
            🎤 {message.transcription}
          </p>
        )}
      </div>

      {/* Delivery status for outbound */}
      {isOutbound && (
        <div className="flex items-center gap-1 mt-0.5 mr-1">
          <span className="text-[11px] tracking-[-0.1px] text-muted-foreground">
            {message.status === 'responded' ? 'Delivered' : 'Sending...'}
          </span>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Format timestamp for message groups
 */
function formatMessageTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Attachment Preview for Message Composer
 */
function ComposerAttachmentPreview({
  attachments,
  onRemove,
  formatFileSize,
}: {
  attachments: FileAttachment[];
  onRemove: (id: string) => void;
  formatFileSize: (bytes: number) => string;
}) {
  if (attachments.length === 0) return null;

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type === 'application/pdf' || type.startsWith('text/')) return FileText;
    return File;
  };

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2 border-t border-border">
      <AnimatePresence mode="popLayout">
        {attachments.map((attachment) => {
          const FileIcon = getFileIcon(attachment.type);

          return (
            <motion.div
              key={attachment.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
            >
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
                <div className="w-16 h-16 rounded-lg flex flex-col items-center justify-center gap-1 p-1 bg-muted">
                  <FileIcon className="w-5 h-5 text-primary" />
                  <span className="text-[9px] truncate w-full text-center text-muted-foreground">
                    {attachment.name.length > 10
                      ? `${attachment.name.slice(0, 8)}...`
                      : attachment.name}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => onRemove(attachment.id)}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-white"
                aria-label={`Remove ${attachment.name}`}
              >
                <X className="w-3 h-3" />
              </button>

              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-muted-foreground">
                {formatFileSize(attachment.size)}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/**
 * Message Composer - iOS iMessage style
 */
function MessageComposer({
  onSend,
  disabled,
  error
}: {
  onSend: (content: string, attachments?: FileAttachment[]) => void;
  disabled?: boolean;
  error?: string | null;
}) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // File attachment support
  const fileAttachment = useFileAttachment({
    maxFiles: 5,
    maxSizeBytes: 10 * 1024 * 1024,
  });

  // Hidden file inputs for camera (images only) and general files
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSend = () => {
    const hasContent = message.trim() || fileAttachment.hasAttachments;
    if (hasContent && !disabled) {
      onSend(message.trim(), fileAttachment.attachments.length > 0 ? fileAttachment.attachments : undefined);
      setMessage('');
      fileAttachment.clearAttachments();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      fileAttachment.addFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="border-t border-border bg-card">
      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        className="hidden"
      />
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <ComposerAttachmentPreview
              attachments={fileAttachment.attachments}
              onRemove={fileAttachment.removeAttachment}
              formatFileSize={fileAttachment.formatFileSize}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-2 bg-destructive/10 text-destructive text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2 px-2 py-2">
      {/* Camera button - images only */}
      <button
        onClick={() => imageInputRef.current?.click()}
        className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:opacity-80 hover:bg-muted transition-colors"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        aria-label="Add photo"
      >
        <Camera className="w-6 h-6 text-muted-foreground" />
      </button>

      {/* Apps/Plus button - all files */}
      <button
        onClick={fileAttachment.openFilePicker}
        className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:opacity-80 hover:bg-muted transition-colors"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        aria-label="Attach file"
      >
        <Paperclip className="w-6 h-6 text-primary" />
      </button>

      {/* Text input */}
      <div className="flex-1 flex items-end rounded-[20px] border border-border bg-muted px-3 py-2 min-h-[36px]">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Message"
          rows={1}
          className="flex-1 bg-transparent text-[17px] tracking-[-0.4px] placeholder:text-muted-foreground resize-none focus:outline-none text-foreground"
          style={{
            fontFamily: '-apple-system, SF Pro Text, system-ui, sans-serif',
            minHeight: '20px',
            maxHeight: '100px',
          }}
        />
      </div>

      {/* Send button (shows when there's content or attachments) */}
      <AnimatePresence>
        {(message.trim() || fileAttachment.hasAttachments) && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleSend}
            disabled={disabled}
            className="w-[32px] h-[32px] flex items-center justify-center rounded-full disabled:opacity-50 bg-primary"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-foreground fill-current">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Empty State - Theme-aware
 */
function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-background">
      <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-primary/10">
        <MessageCircle className="w-12 h-12 text-primary" />
      </div>
      <h2
        className="text-[22px] font-semibold tracking-[-0.5px] mb-2 text-foreground"
        style={{ fontFamily: '-apple-system, SF Pro Display, system-ui, sans-serif' }}
      >
        8gent Messages
      </h2>
      <p
        className="text-[15px] tracking-[-0.2px] max-w-[280px] leading-[20px] text-muted-foreground"
        style={{ fontFamily: '-apple-system, SF Pro Text, system-ui, sans-serif' }}
      >
        All your conversations in one place. Messages from WhatsApp, iMessage, Telegram,
        and more flow into this unified inbox.
      </p>

      {/* Platform icons */}
      <div className="flex items-center justify-center gap-3 mt-6">
        {Object.entries(PLATFORM_CONFIG).slice(0, 5).map(([key, config]) => (
          <div
            key={key}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: config.color }}
            title={config.name}
          >
            {config.name.charAt(0)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Main Messages App - iOS iMessage style unified inbox
 */
export function MessagesClient() {
  const { user } = useUser();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileThreadOpen, setIsMobileThreadOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // SECURITY: Use authenticated user ID from Clerk
  const userId = user?.id ?? '';

  // Fetch conversations
  const conversations = useQuery(api.channels.getConversations, userId ? {
    userId,
  } : 'skip');

  // Fetch messages for selected conversation
  const messages = useQuery(
    api.channels.getConversationMessages,
    selectedConversation
      ? { integrationId: selectedConversation, limit: 50 }
      : 'skip'
  );

  // Get selected conversation details
  const selectedConvo = conversations?.find(c => c.integrationId === selectedConversation);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle conversation selection
  const handleSelectConversation = (integrationId: string) => {
    setSelectedConversation(integrationId);
    setIsMobileThreadOpen(true);
  };

  // Handle send message - routes through channel API
  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !content.trim()) return;

    setIsSending(true);
    setSendError(null);

    try {
      const response = await fetch('/api/channels/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          integrationId: selectedConversation,
          content: content.trim(),
          messageType: 'text',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Message sent successfully - Convex will automatically update the UI
      console.log('[Messages] Sent:', data);
    } catch (error) {
      console.error('[Messages] Send failed:', error);
      setSendError(error instanceof Error ? error.message : 'Failed to send message');
      // Clear error after 5 seconds
      setTimeout(() => setSendError(null), 5000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Conversation List (Sidebar) */}
      <motion.div
        className={cn(
          'w-full md:w-[375px] lg:w-[400px] border-r border-border flex flex-col bg-card',
          isMobileThreadOpen ? 'hidden md:flex' : 'flex'
        )}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        {/* Navigation Header */}
        <div className="px-4 pt-3 pb-2 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <button
              className="text-[17px] font-normal text-primary"
              style={{ fontFamily: '-apple-system, SF Pro Text, system-ui, sans-serif' }}
            >
              Edit
            </button>
            <h1
              className="text-[17px] font-semibold tracking-[-0.4px] text-foreground"
              style={{ fontFamily: '-apple-system, SF Pro Text, system-ui, sans-serif' }}
            >
              Messages
            </h1>
            <div className="flex items-center gap-1">
              <Link
                href="/messages/scheduled"
                className="w-[44px] h-[44px] flex items-center justify-center"
                style={{ WebkitTapHighlightColor: 'transparent' }}
                title="Scheduled Messages"
              >
                <Clock className="w-5 h-5 text-primary" />
              </Link>
              <button
                className="w-[44px] h-[44px] flex items-center justify-center -mr-2"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M12 12l9 -4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center h-[36px] rounded-[10px] px-2 bg-muted">
            <Search className="w-4 h-4 mr-1 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent text-[17px] tracking-[-0.4px] placeholder:text-muted-foreground focus:outline-none text-foreground"
              style={{ fontFamily: '-apple-system, SF Pro Text, system-ui, sans-serif' }}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto bg-card">
          {!conversations ? (
            // Loading state
            <div className="space-y-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-center gap-3 px-4 py-3 border-b border-border"
                >
                  <div className="w-[52px] h-[52px] rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 rounded w-1/2 bg-muted" />
                    <div className="h-3 rounded w-3/4 bg-muted/50" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-[17px] font-medium text-foreground">
                No Conversations
              </p>
              <p className="text-[15px] mt-1 text-muted-foreground">
                Connect a channel to start receiving messages
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {conversations
                .filter(c =>
                  !searchQuery ||
                  c.platformUsername?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.platformUserId.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((conversation) => (
                  <ConversationItem
                    key={conversation.integrationId}
                    conversation={conversation}
                    isSelected={selectedConversation === conversation.integrationId}
                    onClick={() => handleSelectConversation(conversation.integrationId)}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Unified Inbox Footer */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-center gap-1 bg-muted/50">
          {Object.entries(PLATFORM_CONFIG).slice(0, 5).map(([key, config]) => (
            <div
              key={key}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
              style={{ backgroundColor: config.color }}
              title={config.name}
            >
              {config.name.charAt(0)}
            </div>
          ))}
          <span className="ml-2 text-[13px] text-muted-foreground">
            Unified Inbox
          </span>
        </div>
      </motion.div>

      {/* Message Thread (Main Area) */}
      <div
        className={cn(
          'flex-1 flex flex-col bg-background',
          !isMobileThreadOpen ? 'hidden md:flex' : 'flex'
        )}
      >
        {selectedConversation && selectedConvo ? (
          <>
            {/* Thread Header */}
            <div className="flex items-center gap-2 px-2 py-2 border-b border-border bg-card">
              {/* Back button (mobile) - 44px touch target */}
              <button
                onClick={() => setIsMobileThreadOpen(false)}
                className="md:hidden w-[44px] h-[44px] flex items-center justify-center -ml-1"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ChevronLeft className="w-7 h-7 text-primary" />
              </button>

              {/* Contact info - centered */}
              <div className="flex-1 flex flex-col items-center justify-center min-w-0">
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg mb-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${PLATFORM_CONFIG[selectedConvo.platform]?.color || 'hsl(var(--primary))'}cc, ${PLATFORM_CONFIG[selectedConvo.platform]?.color || 'hsl(var(--primary))'})`,
                  }}
                >
                  {(selectedConvo.platformUsername || selectedConvo.platformUserId).charAt(0).toUpperCase()}
                </div>
                {/* Name */}
                <h2
                  className="text-[11px] font-medium tracking-[-0.1px] text-center truncate max-w-[200px] text-foreground"
                  style={{ fontFamily: '-apple-system, SF Pro Text, system-ui, sans-serif' }}
                >
                  {selectedConvo.platformUsername || formatPhoneNumber(selectedConvo.platformUserId)}
                </h2>
                {/* Platform */}
                <div className="mt-0.5">
                  <PlatformBadge platform={selectedConvo.platform} size="md" />
                </div>
              </div>

              {/* Video call button - 44px touch target */}
              <button
                className="w-[44px] h-[44px] flex items-center justify-center"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 bg-background">
              <AnimatePresence>
                {messages?.map((message, index) => {
                  // Show timestamp if first message or gap > 30min from previous
                  const prevMessage = messages[index - 1];
                  const showTimestamp = index === 0 ||
                    (prevMessage && message.createdAt - prevMessage.createdAt > 30 * 60 * 1000);
                  // First in group if direction changed or new timestamp group
                  const isFirstInGroup = showTimestamp ||
                    (prevMessage && prevMessage.direction !== message.direction);

                  return (
                    <MessageBubble
                      key={message.messageId}
                      message={message as any}
                      showTimestamp={showTimestamp}
                      isFirstInGroup={isFirstInGroup}
                    />
                  );
                })}
              </AnimatePresence>

              {!messages && (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse text-[15px] text-muted-foreground">
                    Loading messages...
                  </div>
                </div>
              )}

              {messages?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[17px] font-medium text-foreground">
                    No Messages
                  </p>
                  <p className="text-[15px] mt-1 text-muted-foreground">
                    Start the conversation!
                  </p>
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <MessageComposer onSend={handleSendMessage} disabled={isSending} error={sendError} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Utility Functions
// =============================================================================

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
