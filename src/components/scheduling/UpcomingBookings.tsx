'use client';

/**
 * UpcomingBookings - List of upcoming bookings
 */

import { Calendar, Clock, User, Video, MoreVertical, X, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import type { Booking } from '@/lib/scheduling/types';
import { formatDate, formatTime, formatDuration, getRelativeTime } from '@/lib/scheduling/utils';

interface UpcomingBookingsProps {
  bookings: Booking[];
  onCancel: (id: string, reason?: string) => Promise<void>;
  onMarkComplete: (id: string) => Promise<void>;
  onMarkNoShow: (id: string) => Promise<void>;
}

export function UpcomingBookings({
  bookings,
  onCancel,
  onMarkComplete,
  onMarkNoShow,
}: UpcomingBookingsProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await onCancel(id, 'Cancelled by host');
    } finally {
      setCancellingId(null);
      setMenuOpen(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <LiquidGlass className="p-8 rounded-2xl text-center">
        <Calendar
          className="w-12 h-12 mx-auto mb-4 opacity-50"
          style={{ color: 'hsl(var(--muted-foreground))' }}
        />
        <h3 className="font-semibold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
          No upcoming bookings
        </h3>
        <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Share your booking link to start getting meetings
        </p>
      </LiquidGlass>
    );
  }

  const locationIcons: Record<string, React.ReactNode> = {
    google_meet: <Video className="w-4 h-4" />,
    zoom: <Video className="w-4 h-4" />,
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    confirmed: 'bg-green-500/20 text-green-600 dark:text-green-400',
    cancelled: 'bg-red-500/20 text-red-600 dark:text-red-400',
    completed: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
    no_show: 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {bookings.map((booking) => (
          <motion.div
            key={booking._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            layout
          >
            <LiquidGlass className="p-4 rounded-xl">
              <div className="flex items-start gap-4">
                {/* Time indicator */}
                <div className="text-center min-w-[60px]">
                  <div className="text-2xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                    {new Date(booking.startTime).getDate()}
                  </div>
                  <div className="text-xs uppercase" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                        {booking.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                        <User className="w-3 h-3" />
                        {booking.guestName}
                      </div>
                    </div>

                    {/* Status & Menu */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>

                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === booking._id ? null : booking._id)}
                          className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                        </button>

                        {menuOpen === booking._id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setMenuOpen(null)}
                            />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute right-0 top-full mt-1 z-20 min-w-[160px] rounded-lg shadow-lg overflow-hidden"
                              style={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }}
                            >
                              {booking.status === 'confirmed' && (
                                <>
                                  <button
                                    onClick={() => {
                                      onMarkComplete(booking._id);
                                      setMenuOpen(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5"
                                  >
                                    <Check className="w-4 h-4 text-green-500" />
                                    Mark Complete
                                  </button>
                                  <button
                                    onClick={() => {
                                      onMarkNoShow(booking._id);
                                      setMenuOpen(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5"
                                  >
                                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                                    No Show
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleCancel(booking._id)}
                                disabled={cancellingId === booking._id}
                                className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-500 hover:bg-red-500/10"
                              >
                                <X className="w-4 h-4" />
                                {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                              </button>
                            </motion.div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Time & Location */}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'hsl(var(--muted))' }}>
                      {getRelativeTime(booking.startTime)}
                    </span>

                    {booking.location && (
                      <a
                        href={booking.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline"
                        style={{ color: 'hsl(var(--primary))' }}
                      >
                        {locationIcons[booking.locationType] || <Video className="w-3 h-3" />}
                        Join
                      </a>
                    )}
                  </div>

                  {/* Notes */}
                  {booking.notes && (
                    <p
                      className="mt-2 text-sm italic line-clamp-2"
                      style={{ color: 'hsl(var(--muted-foreground))' }}
                    >
                      "{booking.notes}"
                    </p>
                  )}
                </div>
              </div>
            </LiquidGlass>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
