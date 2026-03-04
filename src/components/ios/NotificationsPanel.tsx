'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSessionBrain, Notification } from '@/context/SessionBrainContext';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import {
  X,
  Bell,
  Check,
  FileText,
  Lightbulb,
  Clock,
  Trash2,
  CheckCheck,
} from 'lucide-react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// App name mapping
const appNames: Record<string, string> = {
  clawai: '8gent',
  projects: 'Projects',
  design: 'Design',
  product: 'Product',
  prototyping: 'Prototyping',
  story: 'Story',
  resume: 'Resume',
  music: 'Music',
  photos: 'Photos',
  blog: 'Blog',
  vault: 'Vault',
};

// Notification type icons
const typeIcons: Record<Notification['type'], React.ReactNode> = {
  update: <FileText className="w-4 h-4" />,
  complete: <Check className="w-4 h-4" />,
  suggestion: <Lightbulb className="w-4 h-4" />,
  reminder: <Clock className="w-4 h-4" />,
};

// Notification type colors
const typeColors: Record<Notification['type'], string> = {
  update: 'text-blue-400',
  complete: 'text-green-400',
  suggestion: 'text-yellow-400',
  reminder: 'text-purple-400',
};

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const {
    session,
    markNotificationRead,
    markAppNotificationsRead,
    clearNotifications,
    getTotalUnreadCount,
  } = useSessionBrain();

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    const groups: { label: string; notifications: Notification[] }[] = [
      { label: 'Today', notifications: [] },
      { label: 'Yesterday', notifications: [] },
      { label: 'Earlier', notifications: [] },
    ];

    // Sort by createdAt descending
    const sorted = [...session.notifications].sort((a, b) => b.createdAt - a.createdAt);

    sorted.forEach((notification) => {
      const date = new Date(notification.createdAt);
      if (date >= today) {
        groups[0].notifications.push(notification);
      } else if (date >= yesterday) {
        groups[1].notifications.push(notification);
      } else {
        groups[2].notifications.push(notification);
      }
    });

    return groups.filter((g) => g.notifications.length > 0);
  }, [session.notifications]);

  const unreadCount = getTotalUnreadCount();

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const panelVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: prefersReducedMotion
        ? { duration: 0.15 }
        : { type: 'spring' as const, stiffness: 400, damping: 30 },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      transition: { duration: 0.15 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-16 right-4 z-50 w-[340px] max-h-[70vh]"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <LiquidGlass
              variant="panel"
              intensity="strong"
              className="!p-0 overflow-hidden"
              rippleEffect={false}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-white/80" />
                  <h2 className="text-white font-semibold">Activity</h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {session.notifications.length > 0 && (
                    <>
                      <button
                        onClick={() => {
                          session.notifications.forEach((n) => {
                            if (!n.readAt) markNotificationRead(n.id);
                          });
                        }}
                        className="p-1.5 text-white/40 hover:text-white/80 transition-colors rounded-lg hover:bg-white/5"
                        title="Mark all as read"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={clearNotifications}
                        className="p-1.5 text-white/40 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                        title="Clear all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={onClose}
                    className="p-1.5 text-white/40 hover:text-white/80 transition-colors rounded-lg hover:bg-white/5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[calc(70vh-80px)] overflow-y-auto">
                {groupedNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <Bell className="w-12 h-12 text-white/20 mb-3" />
                    <p className="text-white/40 text-sm">No notifications yet</p>
                    <p className="text-white/30 text-xs mt-1">
                      Activity from 8gent will appear here
                    </p>
                  </div>
                ) : (
                  groupedNotifications.map((group) => (
                    <div key={group.label}>
                      {/* Group header */}
                      <div className="px-4 py-2 text-xs font-medium text-white/40 bg-white/5 sticky top-0">
                        {group.label}
                      </div>

                      {/* Notifications */}
                      {group.notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => markNotificationRead(notification.id)}
                          className={`
                            flex items-start gap-3 p-4 border-b border-white/5 cursor-pointer
                            hover:bg-white/5 transition-colors
                            ${!notification.readAt ? 'bg-white/[0.02]' : ''}
                          `}
                        >
                          {/* Icon */}
                          <div
                            className={`
                              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                              ${typeColors[notification.type]}
                              bg-white/5
                            `}
                          >
                            {typeIcons[notification.type]}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p
                                  className={`text-sm font-medium ${!notification.readAt ? 'text-white' : 'text-white/70'
                                    }`}
                                >
                                  {notification.title}
                                </p>
                                <p className="text-xs text-white/40 mt-0.5">
                                  {appNames[notification.appId] || notification.appId}
                                </p>
                              </div>
                              <span className="text-[10px] text-white/30 flex-shrink-0">
                                {formatTime(notification.createdAt)}
                              </span>
                            </div>
                            {notification.body && (
                              <p className="text-xs text-white/50 mt-1 line-clamp-2">
                                {notification.body}
                              </p>
                            )}
                          </div>

                          {/* Unread indicator */}
                          {!notification.readAt && (
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </LiquidGlass>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Badge component for app icons
interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export function NotificationBadge({ count, className = '' }: NotificationBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <motion.div
      className={`
        absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
        bg-red-500 rounded-full
        flex items-center justify-center
        text-[10px] font-bold text-white
        shadow-lg shadow-red-500/30
        ${className}
      `}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
    >
      {displayCount}
    </motion.div>
  );
}

// Notification trigger button for status bar
interface NotificationTriggerProps {
  onClick: () => void;
  className?: string;
}

export function NotificationTrigger({ onClick, className = '' }: NotificationTriggerProps) {
  const { getTotalUnreadCount } = useSessionBrain();
  const unreadCount = getTotalUnreadCount();

  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-white/60 hover:text-white/90 transition-colors ${className}`}
      aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
    >
      <Bell className="w-5 h-5" />
      <AnimatePresence>
        {unreadCount > 0 && <NotificationBadge count={unreadCount} />}
      </AnimatePresence>
    </button>
  );
}
