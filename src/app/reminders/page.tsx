'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import { PageTransition } from '@/components/ios';
import {
  ChevronLeft,
  Bell,
  Plus,
  Clock,
  Calendar,
  Trash2,
  Edit2,
  Power,
  Mail,
  Eye,
  EyeOff,
  Send,
  Bot,
  Settings,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

type ScheduleType = 'once' | 'daily' | 'weekly' | 'monthly' | 'hourly' | 'custom';

interface Reminder {
  id: string;
  reminderId: string;
  title: string;
  message: string;
  scheduleType: ScheduleType;
  hour?: number;
  minute?: number;
  dayOfWeek?: number[];
  dayOfMonth?: number;
  timezone: string;
  scheduledAt?: number;
  isActive: boolean;
  lastSentAt?: number;
  nextScheduledAt?: number;
  isPublic: boolean;
  recipientEmail?: string;
  createdBy?: string;
  createdAt?: number;
  updatedAt?: number;
}

interface ReminderFormData {
  title: string;
  message: string;
  scheduleType: ScheduleType;
  hour: number;
  minute: number;
  dayOfWeek: number[];
  dayOfMonth: number;
  timezone: string;
  scheduledAt: string;
  recipientEmail: string;
  isPublic: boolean;
  isActive: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatSchedule(reminder: Reminder): string {
  const time = reminder.hour !== undefined && reminder.minute !== undefined
    ? `${reminder.hour.toString().padStart(2, '0')}:${reminder.minute.toString().padStart(2, '0')}`
    : '';

  switch (reminder.scheduleType) {
    case 'once':
      if (reminder.scheduledAt) {
        return new Date(reminder.scheduledAt).toLocaleString();
      }
      return 'One time';
    case 'hourly':
      return `Every hour at :${(reminder.minute || 0).toString().padStart(2, '0')}`;
    case 'daily':
      return `Daily at ${time}`;
    case 'weekly':
      const days = reminder.dayOfWeek?.map(d => DAYS_OF_WEEK[d]).join(', ') || '';
      return `Every ${days} at ${time}`;
    case 'monthly':
      return `Monthly on the ${reminder.dayOfMonth}${getOrdinalSuffix(reminder.dayOfMonth || 1)} at ${time}`;
    default:
      return 'Custom schedule';
  }
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function formatTimeUntil(timestamp: number): string {
  const diff = timestamp - Date.now();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Now';
  if (minutes < 60) return `In ${minutes}m`;
  if (hours < 24) return `In ${hours}h`;
  return `In ${days}d`;
}

// ============================================================================
// Reminder Form Component
// ============================================================================

function ReminderForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Partial<ReminderFormData>;
  onSubmit: (data: ReminderFormData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ReminderFormData>({
    title: initialData?.title || '',
    message: initialData?.message || '',
    scheduleType: initialData?.scheduleType || 'daily',
    hour: initialData?.hour ?? 9,
    minute: initialData?.minute ?? 0,
    dayOfWeek: initialData?.dayOfWeek || [1, 2, 3, 4, 5],
    dayOfMonth: initialData?.dayOfMonth ?? 1,
    timezone: initialData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    scheduledAt: initialData?.scheduledAt || '',
    recipientEmail: initialData?.recipientEmail || '',
    isPublic: initialData?.isPublic ?? false,
    isActive: initialData?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const toggleDayOfWeek = (day: number) => {
    setForm(prev => ({
      ...prev,
      dayOfWeek: prev.dayOfWeek.includes(day)
        ? prev.dayOfWeek.filter(d => d !== day)
        : [...prev.dayOfWeek, day].sort(),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">
          Title
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-theme-primary"
          placeholder="Reminder title..."
          required
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">
          Message
        </label>
        <textarea
          value={form.message}
          onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-theme-primary resize-none"
          placeholder="Reminder message..."
          rows={3}
          required
        />
      </div>

      {/* Schedule Type */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">
          Schedule
        </label>
        <select
          value={form.scheduleType}
          onChange={(e) => setForm(prev => ({ ...prev, scheduleType: e.target.value as ScheduleType }))}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-theme-primary"
        >
          <option value="hourly">Every hour</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="once">One time</option>
        </select>
      </div>

      {/* Time picker for non-hourly */}
      {form.scheduleType !== 'once' && (
        <div className="grid grid-cols-2 gap-4">
          {form.scheduleType !== 'hourly' && (
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Hour
              </label>
              <select
                value={form.hour}
                onChange={(e) => setForm(prev => ({ ...prev, hour: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-theme-primary"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Minute
            </label>
            <select
              value={form.minute}
              onChange={(e) => setForm(prev => ({ ...prev, minute: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-theme-primary"
            >
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => (
                <option key={m} value={m}>
                  :{m.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Weekly day picker */}
      {form.scheduleType === 'weekly' && (
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            Days
          </label>
          <div className="flex gap-2">
            {DAYS_OF_WEEK.map((day, i) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDayOfWeek(i)}
                className={`
                  flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                  ${form.dayOfWeek.includes(i)
                    ? 'bg-theme-primary text-white'
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }
                `}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Monthly day picker */}
      {form.scheduleType === 'monthly' && (
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            Day of Month
          </label>
          <select
            value={form.dayOfMonth}
            onChange={(e) => setForm(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) }))}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-theme-primary"
          >
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}{getOrdinalSuffix(i + 1)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* One-time date/time picker */}
      {form.scheduleType === 'once' && (
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            Date & Time
          </label>
          <input
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(e) => setForm(prev => ({ ...prev, scheduledAt: e.target.value }))}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-theme-primary"
            required
          />
        </div>
      )}

      {/* Recipient Email */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">
          Recipient Email
        </label>
        <input
          type="email"
          value={form.recipientEmail}
          onChange={(e) => setForm(prev => ({ ...prev, recipientEmail: e.target.value }))}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-theme-primary"
          placeholder="email@example.com"
          required
        />
      </div>

      {/* Visibility & Active toggles */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setForm(prev => ({ ...prev, isPublic: !prev.isPublic }))}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors
            ${form.isPublic
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-white/5 text-white/60 border border-white/10'
            }
          `}
        >
          {form.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {form.isPublic ? 'Public' : 'Private'}
        </button>
        <button
          type="button"
          onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors
            ${form.isActive
              ? 'bg-theme-primary/20 text-theme-primary border border-theme-primary/30'
              : 'bg-white/5 text-white/60 border border-white/10'
            }
          `}
        >
          <Power className="w-4 h-4" />
          {form.isActive ? 'Active' : 'Paused'}
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-theme-primary text-white font-medium hover:opacity-90 transition-opacity"
        >
          Save Reminder
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// Reminder Card Component
// ============================================================================

function ReminderCard({
  reminder,
  isAdmin,
  onEdit,
  onDelete,
  onToggle,
}: {
  reminder: Reminder;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        p-4 rounded-xl border transition-colors
        ${reminder.isActive
          ? 'bg-white/5 border-white/10'
          : 'bg-white/[0.02] border-white/5 opacity-60'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
          ${reminder.isActive
            ? 'bg-gradient-to-br from-amber-500 to-orange-600'
            : 'bg-white/10'
          }
        `}>
          <Bell className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-white truncate">{reminder.title}</h3>
            {isAdmin && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={onToggle}
                  className={`
                    p-1.5 rounded-lg transition-colors
                    ${reminder.isActive
                      ? 'text-theme-primary hover:bg-theme-primary/10'
                      : 'text-white/40 hover:bg-white/10'
                    }
                  `}
                  title={reminder.isActive ? 'Pause' : 'Activate'}
                >
                  <Power className="w-4 h-4" />
                </button>
                <button
                  onClick={onEdit}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <p className="text-sm text-white/50 mt-1 line-clamp-2">
            {reminder.message}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1 text-xs text-white/40">
              <Clock className="w-3 h-3" />
              {formatSchedule(reminder)}
            </span>

            {reminder.nextScheduledAt && reminder.isActive && (
              <span className="inline-flex items-center gap-1 text-xs text-theme-primary">
                <Send className="w-3 h-3" />
                {formatTimeUntil(reminder.nextScheduledAt)}
              </span>
            )}

            {reminder.lastSentAt && (
              <span className="inline-flex items-center gap-1 text-xs text-white/30">
                <Check className="w-3 h-3" />
                Sent {formatTimeAgo(reminder.lastSentAt)}
              </span>
            )}

            {reminder.isPublic && (
              <span className="inline-flex items-center gap-1 text-xs text-green-400">
                <Eye className="w-3 h-3" />
                Public
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// AI Summary Settings Component
// ============================================================================

function AISummarySettings({ isAdmin }: { isAdmin: boolean }) {
  const settings = useQuery(api.reminders.getAISummarySettings);
  const updateSettings = useMutation(api.reminders.updateAISummarySettings);
  const [isEditing, setIsEditing] = useState(false);

  if (!settings) return null;

  const handleToggle = async () => {
    if (!isAdmin) return;
    await updateSettings({ isEnabled: !settings.isEnabled });
  };

  return (
    <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-white">AI Hourly Summary</h3>
            <p className="text-sm text-white/50">
              {settings.aiName} sends you a status update every hour
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={handleToggle}
            className={`
              p-2 rounded-lg transition-colors
              ${settings.isEnabled
                ? 'bg-theme-primary text-white'
                : 'bg-white/10 text-white/40'
              }
            `}
          >
            <Power className="w-5 h-5" />
          </button>
        )}
      </div>

      {settings.isEnabled && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-white/5">
            <div className="text-xs text-white/40 mb-1">Frequency</div>
            <div className="text-sm text-white capitalize">{settings.frequency}</div>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <div className="text-xs text-white/40 mb-1">Tone</div>
            <div className="text-sm text-white capitalize">{settings.aiTone}</div>
          </div>
          {settings.lastSentAt && (
            <div className="col-span-2 p-3 rounded-lg bg-white/5">
              <div className="text-xs text-white/40 mb-1">Last sent</div>
              <div className="text-sm text-white">
                {formatTimeAgo(settings.lastSentAt)}
              </div>
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-theme-primary hover:underline"
          >
            Configure AI Summary Settings
          </button>

          {isEditing && (
            <AISettingsForm
              settings={settings}
              onSave={async (data) => {
                await updateSettings(data);
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// AI Settings Form
// ============================================================================

function AISettingsForm({
  settings,
  onSave,
  onCancel,
}: {
  settings: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    recipientEmail: settings.recipientEmail || '',
    aiName: settings.aiName || 'Claw AI',
    aiTone: settings.aiTone || 'witty',
    frequency: settings.frequency || 'hourly',
    includeKanban: settings.includeKanban ?? true,
    includeBookings: settings.includeBookings ?? true,
    includeSuggestions: settings.includeSuggestions ?? true,
    includeJobs: settings.includeJobs ?? true,
    includeWeather: settings.includeWeather ?? true,
  });

  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-white/40 mb-1">AI Name</label>
          <input
            type="text"
            value={form.aiName}
            onChange={(e) => setForm(prev => ({ ...prev, aiName: e.target.value }))}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-theme-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Tone</label>
          <select
            value={form.aiTone}
            onChange={(e) => setForm(prev => ({ ...prev, aiTone: e.target.value }))}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-theme-primary"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="witty">Witty</option>
            <option value="enthusiastic">Enthusiastic</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1">Recipient Email</label>
        <input
          type="email"
          value={form.recipientEmail}
          onChange={(e) => setForm(prev => ({ ...prev, recipientEmail: e.target.value }))}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-theme-primary"
          placeholder="your@email.com"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          className="flex-1 py-2 rounded-lg bg-theme-primary text-white text-sm hover:opacity-90 transition-opacity"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function RemindersPage() {
  const reminders = useQuery(api.reminders.getReminders);
  const adminStatus = useQuery(api.reminders.getIsAdmin);
  const createReminder = useMutation(api.reminders.createReminder);
  const updateReminder = useMutation(api.reminders.updateReminder);
  const deleteReminder = useMutation(api.reminders.deleteReminder);
  const toggleReminder = useMutation(api.reminders.toggleReminderActive);

  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = adminStatus?.isAdmin ?? false;

  const handleCreateReminder = async (data: ReminderFormData) => {
    await createReminder({
      title: data.title,
      message: data.message,
      scheduleType: data.scheduleType,
      hour: data.scheduleType !== 'hourly' ? data.hour : undefined,
      minute: data.minute,
      dayOfWeek: data.scheduleType === 'weekly' ? data.dayOfWeek : undefined,
      dayOfMonth: data.scheduleType === 'monthly' ? data.dayOfMonth : undefined,
      timezone: data.timezone,
      scheduledAt: data.scheduleType === 'once' ? new Date(data.scheduledAt).getTime() : undefined,
      recipientEmail: data.recipientEmail,
      isPublic: data.isPublic,
      isActive: data.isActive,
    });
    setShowForm(false);
  };

  const handleUpdateReminder = async (data: ReminderFormData) => {
    if (!editingReminder) return;
    await updateReminder({
      reminderId: editingReminder.reminderId,
      title: data.title,
      message: data.message,
      scheduleType: data.scheduleType,
      hour: data.scheduleType !== 'hourly' ? data.hour : undefined,
      minute: data.minute,
      dayOfWeek: data.scheduleType === 'weekly' ? data.dayOfWeek : undefined,
      dayOfMonth: data.scheduleType === 'monthly' ? data.dayOfMonth : undefined,
      timezone: data.timezone,
      scheduledAt: data.scheduleType === 'once' ? new Date(data.scheduledAt).getTime() : undefined,
      recipientEmail: data.recipientEmail,
      isPublic: data.isPublic,
      isActive: data.isActive,
    });
    setEditingReminder(null);
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;
    await deleteReminder({ reminderId });
  };

  const handleToggleReminder = async (reminderId: string) => {
    await toggleReminder({ reminderId });
  };

  if (!mounted) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-950">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary"
                aria-label="Go back home"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </Link>
              <h1 className="text-xl font-semibold text-white">Reminders</h1>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowForm(true)}
                className="p-2 rounded-lg bg-theme-primary text-white hover:opacity-90 transition-opacity"
                aria-label="Add reminder"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-lg mx-auto px-4 py-6">
          {/* AI Summary Settings */}
          <AISummarySettings isAdmin={isAdmin} />

          {/* Admin notice */}
          {!isAdmin && (
            <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-400">
                  You're viewing public reminders. Sign in as admin to create and manage reminders.
                </p>
              </div>
            </div>
          )}

          {/* Reminders list */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {reminders?.map((reminder) => (
                <ReminderCard
                  key={reminder.reminderId}
                  reminder={reminder as Reminder}
                  isAdmin={isAdmin}
                  onEdit={() => setEditingReminder(reminder as Reminder)}
                  onDelete={() => handleDeleteReminder(reminder.reminderId)}
                  onToggle={() => handleToggleReminder(reminder.reminderId)}
                />
              ))}
            </AnimatePresence>

            {reminders?.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/40">No reminders yet</p>
                {isAdmin && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 text-theme-primary hover:underline"
                  >
                    Create your first reminder
                  </button>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Create/Edit Form Modal */}
        <AnimatePresence>
          {(showForm || editingReminder) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              onClick={() => {
                setShowForm(false);
                setEditingReminder(null);
              }}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-zinc-900 rounded-t-3xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-white/10">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingReminder(null);
                    }}
                    className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-lg font-semibold text-white">
                    {editingReminder ? 'Edit Reminder' : 'New Reminder'}
                  </h2>
                  <div className="w-9" />
                </div>

                {/* Form Content */}
                <div className="overflow-y-auto p-6">
                  <ReminderForm
                    initialData={editingReminder ? {
                      title: editingReminder.title,
                      message: editingReminder.message,
                      scheduleType: editingReminder.scheduleType,
                      hour: editingReminder.hour,
                      minute: editingReminder.minute,
                      dayOfWeek: editingReminder.dayOfWeek,
                      dayOfMonth: editingReminder.dayOfMonth,
                      timezone: editingReminder.timezone,
                      scheduledAt: editingReminder.scheduledAt
                        ? new Date(editingReminder.scheduledAt).toISOString().slice(0, 16)
                        : '',
                      recipientEmail: editingReminder.recipientEmail || '',
                      isPublic: editingReminder.isPublic,
                      isActive: editingReminder.isActive,
                    } : undefined}
                    onSubmit={editingReminder ? handleUpdateReminder : handleCreateReminder}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingReminder(null);
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
