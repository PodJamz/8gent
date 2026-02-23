'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import {
  ChevronLeft,
  Plus,
  Clock,
  Calendar,
  Repeat,
  Trash2,
  Edit2,
  Send,
  Check,
  X,
  Loader2,
  AlertCircle,
  Bell,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';

// Platform display names
const PLATFORM_NAMES: Record<string, string> = {
  whatsapp: 'WhatsApp',
  imessage: 'iMessage',
  telegram: 'Telegram',
  slack: 'Slack',
  discord: 'Discord',
  email: 'Email',
};

// Schedule type icons and labels
const SCHEDULE_TYPE_CONFIG = {
  one_time: { icon: Clock, label: 'One-time', color: 'text-blue-400' },
  recurring: { icon: Repeat, label: 'Recurring', color: 'text-emerald-400' },
  trigger: { icon: Bell, label: 'Trigger', color: 'text-amber-400' },
};

// Status badges
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  sending: { label: 'Sending', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  sent: { label: 'Sent', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  failed: { label: 'Failed', color: 'text-red-400', bg: 'bg-red-500/20' },
  cancelled: { label: 'Cancelled', color: 'text-gray-400', bg: 'bg-gray-500/20' },
};

/**
 * Format a timestamp for display
 */
function formatScheduleTime(timestamp: number | undefined): string {
  if (!timestamp) return 'Not scheduled';

  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) return `Today at ${timeStr}`;
  if (isTomorrow) return `Tomorrow at ${timeStr}`;

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
 * Scheduled Message Card
 */
function ScheduledMessageCard({
  message,
  onCancel,
  onDelete,
  isCancelling,
  isDeleting,
}: {
  message: {
    messageId: string;
    content: string;
    messageType: string;
    scheduleType: string;
    status: string;
    nextSendAt?: number;
    cronExpression?: string;
    title?: string;
    category?: string;
    priority: string;
    targetPlatforms?: string[];
    sendCount: number;
    error?: string;
  };
  onCancel: () => void;
  onDelete: () => void;
  isCancelling: boolean;
  isDeleting: boolean;
}) {
  const scheduleConfig = SCHEDULE_TYPE_CONFIG[message.scheduleType as keyof typeof SCHEDULE_TYPE_CONFIG];
  const statusConfig = STATUS_CONFIG[message.status];
  const ScheduleIcon = scheduleConfig?.icon || Clock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className={cn('p-1.5 rounded-lg bg-white/5', scheduleConfig?.color)}>
            <ScheduleIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">
              {message.title || 'Scheduled Message'}
            </h3>
            <span className={cn('text-xs', scheduleConfig?.color)}>
              {scheduleConfig?.label}
            </span>
          </div>
        </div>
        <span className={cn('text-xs px-2 py-0.5 rounded-full', statusConfig?.color, statusConfig?.bg)}>
          {statusConfig?.label}
        </span>
      </div>

      {/* Content Preview */}
      <div className="mb-3 p-3 rounded-lg bg-black/20">
        <p className="text-sm text-white/80 line-clamp-2">
          {message.messageType === 'ai_generated' ? (
            <span className="italic text-white/60">AI will generate content at send time</span>
          ) : (
            message.content
          )}
        </p>
      </div>

      {/* Schedule Info */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatScheduleTime(message.nextSendAt)}</span>
        </div>
        {message.cronExpression && (
          <div className="flex items-center gap-1">
            <Repeat className="w-3 h-3" />
            <span>{message.cronExpression}</span>
          </div>
        )}
        {message.sendCount > 0 && (
          <div className="flex items-center gap-1">
            <Send className="w-3 h-3" />
            <span>Sent {message.sendCount}x</span>
          </div>
        )}
      </div>

      {/* Target Platforms */}
      {message.targetPlatforms && message.targetPlatforms.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {message.targetPlatforms.map((platform) => (
            <span
              key={platform}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60"
            >
              {PLATFORM_NAMES[platform] || platform}
            </span>
          ))}
        </div>
      )}

      {/* Error Message */}
      {message.error && (
        <div className="mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-200">{message.error}</p>
        </div>
      )}

      {/* Actions */}
      {message.status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={isCancelling}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white/70 bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {isCancelling ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <X className="w-3 h-3" />
            )}
            Cancel
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3" />
            )}
          </button>
        </div>
      )}

      {(message.status === 'sent' || message.status === 'cancelled' || message.status === 'failed') && (
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Trash2 className="w-3 h-3" />
          )}
          Delete
        </button>
      )}
    </motion.div>
  );
}

/**
 * Create Scheduled Message Modal
 */
function CreateMessageModal({
  isOpen,
  onClose,
  onCreate,
  isCreating,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    content: string;
    scheduleType: 'one_time' | 'recurring';
    scheduledFor?: number;
    cronExpression?: string;
    title?: string;
    category?: string;
  }) => void;
  isCreating: boolean;
}) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [scheduleType, setScheduleType] = useState<'one_time' | 'recurring'>('one_time');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [cronExpression, setCronExpression] = useState('0 9 * * *');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    let scheduledFor: number | undefined;
    if (scheduleType === 'one_time' && scheduleDate) {
      const [year, month, day] = scheduleDate.split('-').map(Number);
      const [hour, minute] = scheduleTime.split(':').map(Number);
      const date = new Date(year, month - 1, day, hour, minute);
      scheduledFor = date.getTime();
    }

    onCreate({
      content: content.trim(),
      scheduleType,
      scheduledFor,
      cronExpression: scheduleType === 'recurring' ? cronExpression : undefined,
      title: title.trim() || undefined,
      category: 'custom',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-zinc-900 z-10">
          <h2 className="text-lg font-semibold text-white">Schedule Message</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning check-in"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What would you like 8gent to send?"
              rows={3}
              required
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>

          {/* Schedule Type */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Schedule Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setScheduleType('one_time')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  scheduleType === 'one_time'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                )}
              >
                <Clock className="w-4 h-4" />
                One-time
              </button>
              <button
                type="button"
                onClick={() => setScheduleType('recurring')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  scheduleType === 'recurring'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                )}
              >
                <Repeat className="w-4 h-4" />
                Recurring
              </button>
            </div>
          </div>

          {/* One-time Schedule */}
          {scheduleType === 'one_time' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Recurring Schedule */}
          {scheduleType === 'recurring' && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Cron Expression <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
                placeholder="0 9 * * *"
                required
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
              <p className="text-xs text-white/40 mt-1">
                Example: 0 9 * * * = every day at 9:00 AM
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isCreating || !content.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-white bg-[hsl(142_70%_45%)] hover:bg-[hsl(142_70%_40%)] transition-colors disabled:opacity-50"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Clock className="w-4 h-4" />
                Schedule Message
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/**
 * Scheduled Messages Page
 */
export default function ScheduledMessagesPage() {
  const { user, isLoaded } = useUser();
  const userId = user?.id || '';

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Convex queries and mutations
  const scheduledMessages = useQuery(
    api.scheduledMessages.getUserScheduledMessages,
    userId ? { userId } : 'skip'
  );
  const createScheduledMessage = useMutation(api.scheduledMessages.createScheduledMessage);
  const cancelScheduledMessage = useMutation(api.scheduledMessages.cancelScheduledMessage);
  const deleteScheduledMessage = useMutation(api.scheduledMessages.deleteScheduledMessage);

  const handleCreate = async (data: {
    content: string;
    scheduleType: 'one_time' | 'recurring';
    scheduledFor?: number;
    cronExpression?: string;
    title?: string;
    category?: string;
  }) => {
    if (!userId) {
      setError('Please sign in to schedule messages.');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await createScheduledMessage({
        userId,
        content: data.content,
        messageType: 'text',
        scheduleType: data.scheduleType,
        scheduledFor: data.scheduledFor,
        cronExpression: data.cronExpression,
        title: data.title,
        category: data.category,
      });
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create scheduled message:', err);
      setError('Failed to schedule message. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = async (messageId: string) => {
    setCancellingId(messageId);
    setError(null);

    try {
      await cancelScheduledMessage({ messageId });
    } catch (err) {
      console.error('Failed to cancel message:', err);
      setError('Failed to cancel message. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleDelete = async (messageId: string) => {
    setDeletingId(messageId);
    setError(null);

    try {
      await deleteScheduledMessage({ messageId });
    } catch (err) {
      console.error('Failed to delete message:', err);
      setError('Failed to delete message. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Group messages by status
  const pendingMessages = scheduledMessages?.filter((m) => m.status === 'pending') || [];
  const completedMessages = scheduledMessages?.filter((m) => m.status !== 'pending') || [];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/messages"
              className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Back to messages"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-xl font-semibold text-white">Scheduled</h1>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-200/80">{error}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {!isLoaded || !scheduledMessages ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Messages */}
            {pendingMessages.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
                  Upcoming ({pendingMessages.length})
                </h2>
                <div className="space-y-3">
                  <AnimatePresence>
                    {pendingMessages.map((message) => (
                      <ScheduledMessageCard
                        key={message.messageId}
                        message={message}
                        onCancel={() => handleCancel(message.messageId)}
                        onDelete={() => handleDelete(message.messageId)}
                        isCancelling={cancellingId === message.messageId}
                        isDeleting={deletingId === message.messageId}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Completed/Cancelled Messages */}
            {completedMessages.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
                  History ({completedMessages.length})
                </h2>
                <div className="space-y-3">
                  <AnimatePresence>
                    {completedMessages.map((message) => (
                      <ScheduledMessageCard
                        key={message.messageId}
                        message={message}
                        onCancel={() => handleCancel(message.messageId)}
                        onDelete={() => handleDelete(message.messageId)}
                        isCancelling={cancellingId === message.messageId}
                        isDeleting={deletingId === message.messageId}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Empty State */}
            {pendingMessages.length === 0 && completedMessages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No scheduled messages</h3>
                <p className="text-sm text-white/50 mb-6">
                  Schedule messages to be sent at specific times or on a recurring basis.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Schedule a Message
                </button>
              </motion.div>
            )}
          </div>
        )}
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateMessageModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreate}
            isCreating={isCreating}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
