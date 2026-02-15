'use client';

/**
 * GoogleCalendarConnect - Connect/disconnect Google Calendar integration
 */

import { useState } from 'react';
import { Calendar, Check, ExternalLink, Loader2, Unlink } from 'lucide-react';
import { motion } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import type { CalendarIntegration } from '@/lib/scheduling/types';

interface GoogleCalendarConnectProps {
  integration: CalendarIntegration | null;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  isConnecting?: boolean;
}

export function GoogleCalendarConnect({
  integration,
  onConnect,
  onDisconnect,
  isConnecting,
}: GoogleCalendarConnectProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await onDisconnect();
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <LiquidGlass className="p-6 rounded-2xl">
      <div className="flex items-start gap-4">
        {/* Google Calendar icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: integration ? 'hsl(142 76% 36%)' : 'hsl(var(--muted))',
          }}
        >
          {integration ? (
            <Check className="w-6 h-6 text-white" />
          ) : (
            <Calendar className="w-6 h-6" style={{ color: 'hsl(var(--muted-foreground))' }} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
            Google Calendar
          </h3>

          {integration ? (
            <>
              <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Connected as {integration.calendarEmail}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: integration.syncEnabled
                      ? 'hsl(142 76% 36% / 0.2)'
                      : 'hsl(var(--muted))',
                    color: integration.syncEnabled
                      ? 'hsl(142 76% 36%)'
                      : 'hsl(var(--muted-foreground))',
                  }}
                >
                  {integration.syncEnabled ? 'Sync enabled' : 'Sync disabled'}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Connect your Google Calendar to sync bookings and check availability
            </p>
          )}
        </div>

        {/* Action button */}
        {integration ? (
          <button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors text-red-500 hover:bg-red-500/10"
            style={{ border: '1px solid hsl(var(--border))' }}
          >
            {isDisconnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Unlink className="w-4 h-4" />
            )}
            Disconnect
          </button>
        ) : (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
            style={{
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            }}
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
            Connect
          </button>
        )}
      </div>

      {/* Features list */}
      {!integration && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4"
          style={{ borderTop: '1px solid hsl(var(--border))' }}
        >
          <p
            className="text-xs uppercase font-medium mb-2"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            Features
          </p>
          <ul className="space-y-1.5 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <li className="flex items-center gap-2">
              <Check className="w-3 h-3 text-green-500" />
              Auto-create Google Meet links for meetings
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3 h-3 text-green-500" />
              Sync bookings to your calendar
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3 h-3 text-green-500" />
              Block times from existing events
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3 h-3 text-green-500" />
              Send calendar invites to guests
            </li>
          </ul>
        </motion.div>
      )}
    </LiquidGlass>
  );
}
