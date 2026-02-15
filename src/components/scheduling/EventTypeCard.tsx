'use client';

/**
 * EventTypeCard - Display card for an event type
 */

import { useState } from 'react';
import { Clock, Copy, ExternalLink, MoreVertical, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import type { EventType } from '@/lib/scheduling/types';
import { formatDuration, copyToClipboard, getBookingLink } from '@/lib/scheduling/utils';

interface EventTypeCardProps {
  eventType: EventType;
  username: string;
  onEdit: (eventType: EventType) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export function EventTypeCard({
  eventType,
  username,
  onEdit,
  onDelete,
  onToggleActive,
}: EventTypeCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const bookingLink = getBookingLink(username, eventType.slug);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(bookingLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const locationLabels: Record<string, string> = {
    google_meet: 'Google Meet',
    zoom: 'Zoom',
    phone: 'Phone Call',
    in_person: 'In Person',
    custom: 'Custom Location',
  };

  return (
    <LiquidGlass className="relative p-4 rounded-xl">
      <div className="flex items-start gap-4">
        {/* Color indicator */}
        <div
          className="w-3 h-full min-h-[80px] rounded-full flex-shrink-0"
          style={{ backgroundColor: eventType.color }}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-lg" style={{ color: 'hsl(var(--foreground))' }}>
                {eventType.title}
              </h3>
              {eventType.description && (
                <p className="text-sm mt-1 line-clamp-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {eventType.description}
                </p>
              )}
            </div>

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <MoreVertical className="w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 top-full mt-1 z-20 min-w-[160px] rounded-lg shadow-lg overflow-hidden"
                    style={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }}
                  >
                    <button
                      onClick={() => {
                        onEdit(eventType);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onToggleActive(eventType._id, !eventType.isActive);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      {eventType.isActive ? (
                        <>
                          <ToggleRight className="w-4 h-4" />
                          Disable
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" />
                          Enable
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        onDelete(eventType._id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(eventType.duration)}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'hsl(var(--muted))' }}>
              {locationLabels[eventType.locationType]}
            </span>
            {!eventType.isActive && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                Disabled
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
              }}
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <a
              href={bookingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ border: '1px solid hsl(var(--border))' }}
            >
              <ExternalLink className="w-4 h-4" />
              Preview
            </a>
          </div>
        </div>
      </div>
    </LiquidGlass>
  );
}
