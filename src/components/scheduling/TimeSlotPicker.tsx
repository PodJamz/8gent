'use client';

/**
 * TimeSlotPicker - Select available time slots for a date
 */

import { motion } from 'framer-motion';
import type { AvailableSlot } from '@/lib/scheduling/types';
import { formatTime } from '@/lib/scheduling/utils';

interface TimeSlotPickerProps {
  slots: AvailableSlot[];
  selectedSlot: AvailableSlot | null;
  onSelectSlot: (slot: AvailableSlot) => void;
  timezone: string;
  isLoading?: boolean;
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  onSelectSlot,
  timezone,
  isLoading,
}: TimeSlotPickerProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-12 rounded-lg animate-pulse"
            style={{ backgroundColor: 'hsl(var(--muted))' }}
          />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div
        className="text-center py-8 rounded-lg"
        style={{
          backgroundColor: 'hsl(var(--muted))',
          color: 'hsl(var(--muted-foreground))',
        }}
      >
        <p className="font-medium">No available times</p>
        <p className="text-sm mt-1">Please select another date</p>
      </div>
    );
  }

  // Group slots by morning, afternoon, evening
  const morning = slots.filter((s) => {
    const hour = new Date(s.timestamp).getHours();
    return hour >= 0 && hour < 12;
  });

  const afternoon = slots.filter((s) => {
    const hour = new Date(s.timestamp).getHours();
    return hour >= 12 && hour < 17;
  });

  const evening = slots.filter((s) => {
    const hour = new Date(s.timestamp).getHours();
    return hour >= 17 && hour < 24;
  });

  const renderSlots = (slotsToRender: AvailableSlot[], label: string) => {
    if (slotsToRender.length === 0) return null;

    return (
      <div className="mb-4">
        <p
          className="text-xs uppercase font-medium mb-2"
          style={{ color: 'hsl(var(--muted-foreground))' }}
        >
          {label}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {slotsToRender.map((slot) => {
            const isSelected = selectedSlot?.timestamp === slot.timestamp;

            return (
              <motion.button
                key={slot.timestamp}
                onClick={() => onSelectSlot(slot)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: isSelected
                    ? 'hsl(var(--primary))'
                    : 'transparent',
                  color: isSelected
                    ? 'hsl(var(--primary-foreground))'
                    : 'hsl(var(--foreground))',
                  border: `1px solid ${isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                }}
              >
                {formatTime(slot.timestamp, timezone)}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderSlots(morning, 'Morning')}
      {renderSlots(afternoon, 'Afternoon')}
      {renderSlots(evening, 'Evening')}
    </div>
  );
}
