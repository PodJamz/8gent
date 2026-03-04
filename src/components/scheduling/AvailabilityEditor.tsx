'use client';

/**
 * AvailabilityEditor - Edit weekly availability schedule
 */

import { useState, useCallback } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import type { Availability, DaySchedule, TimeSlot } from '@/lib/scheduling/types';
import { DAY_NAMES, generateTimeOptions } from '@/lib/scheduling/utils';

interface AvailabilityEditorProps {
  availability: Availability | null;
  onSave: (schedule: DaySchedule[]) => Promise<void>;
  timezone: string;
}

const TIME_OPTIONS = generateTimeOptions(0, 24, 30);

export function AvailabilityEditor({
  availability,
  onSave,
  timezone,
}: AvailabilityEditorProps) {
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    availability?.schedule || [
      { dayOfWeek: 0, isAvailable: false, slots: [] },
      { dayOfWeek: 1, isAvailable: true, slots: [{ start: '09:00', end: '17:00' }] },
      { dayOfWeek: 2, isAvailable: true, slots: [{ start: '09:00', end: '17:00' }] },
      { dayOfWeek: 3, isAvailable: true, slots: [{ start: '09:00', end: '17:00' }] },
      { dayOfWeek: 4, isAvailable: true, slots: [{ start: '09:00', end: '17:00' }] },
      { dayOfWeek: 5, isAvailable: true, slots: [{ start: '09:00', end: '17:00' }] },
      { dayOfWeek: 6, isAvailable: false, slots: [] },
    ]
  );
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSchedule = useCallback((dayOfWeek: number, updates: Partial<DaySchedule>) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, ...updates } : day
      )
    );
    setHasChanges(true);
  }, []);

  const toggleDay = useCallback((dayOfWeek: number) => {
    setSchedule((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek !== dayOfWeek) return day;
        return {
          ...day,
          isAvailable: !day.isAvailable,
          slots: !day.isAvailable && day.slots.length === 0
            ? [{ start: '09:00', end: '17:00' }]
            : day.slots,
        };
      })
    );
    setHasChanges(true);
  }, []);

  const addSlot = useCallback((dayOfWeek: number) => {
    setSchedule((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek !== dayOfWeek) return day;
        const lastSlot = day.slots[day.slots.length - 1];
        const newStart = lastSlot ? lastSlot.end : '09:00';
        const newStartMinutes = parseInt(newStart.split(':')[0]) * 60 + parseInt(newStart.split(':')[1]);
        const newEndMinutes = Math.min(newStartMinutes + 60, 24 * 60);
        const newEnd = `${String(Math.floor(newEndMinutes / 60)).padStart(2, '0')}:${String(newEndMinutes % 60).padStart(2, '0')}`;

        return {
          ...day,
          slots: [...day.slots, { start: newStart, end: newEnd }],
        };
      })
    );
    setHasChanges(true);
  }, []);

  const updateSlot = useCallback((dayOfWeek: number, slotIndex: number, updates: Partial<TimeSlot>) => {
    setSchedule((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek !== dayOfWeek) return day;
        return {
          ...day,
          slots: day.slots.map((slot, idx) =>
            idx === slotIndex ? { ...slot, ...updates } : slot
          ),
        };
      })
    );
    setHasChanges(true);
  }, []);

  const removeSlot = useCallback((dayOfWeek: number, slotIndex: number) => {
    setSchedule((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek !== dayOfWeek) return day;
        return {
          ...day,
          slots: day.slots.filter((_, idx) => idx !== slotIndex),
        };
      })
    );
    setHasChanges(true);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(schedule);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save availability:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <LiquidGlass className="p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
            Weekly Availability
          </h2>
          <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Set your available hours for each day
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
          <Clock className="w-4 h-4" />
          {timezone}
        </div>
      </div>

      <div className="space-y-4">
        {schedule.map((day) => (
          <div
            key={day.dayOfWeek}
            className="flex items-start gap-4 py-3"
            style={{ borderBottom: '1px solid hsl(var(--border))' }}
          >
            {/* Day toggle */}
            <div className="w-28 flex-shrink-0">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={day.isAvailable}
                  onChange={() => toggleDay(day.dayOfWeek)}
                  className="w-4 h-4 rounded"
                />
                <span
                  className="font-medium"
                  style={{
                    color: day.isAvailable
                      ? 'hsl(var(--foreground))'
                      : 'hsl(var(--muted-foreground))',
                  }}
                >
                  {DAY_NAMES[day.dayOfWeek]}
                </span>
              </label>
            </div>

            {/* Time slots */}
            <div className="flex-1">
              <AnimatePresence mode="sync">
                {day.isAvailable ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {day.slots.map((slot, slotIndex) => (
                      <motion.div
                        key={slotIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-2"
                      >
                        <select
                          value={slot.start}
                          onChange={(e) => updateSlot(day.dayOfWeek, slotIndex, { start: e.target.value })}
                          className="px-3 py-1.5 rounded-lg text-sm outline-none"
                          style={{
                            backgroundColor: 'hsl(var(--muted))',
                            border: '1px solid hsl(var(--border))',
                            color: 'hsl(var(--foreground))',
                          }}
                        >
                          {TIME_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>

                        <span style={{ color: 'hsl(var(--muted-foreground))' }}>to</span>

                        <select
                          value={slot.end}
                          onChange={(e) => updateSlot(day.dayOfWeek, slotIndex, { end: e.target.value })}
                          className="px-3 py-1.5 rounded-lg text-sm outline-none"
                          style={{
                            backgroundColor: 'hsl(var(--muted))',
                            border: '1px solid hsl(var(--border))',
                            color: 'hsl(var(--foreground))',
                          }}
                        >
                          {TIME_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => removeSlot(day.dayOfWeek, slotIndex)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}

                    <button
                      onClick={() => addSlot(day.dayOfWeek)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      style={{ color: 'hsl(var(--primary))' }}
                    >
                      <Plus className="w-4 h-4" />
                      Add time slot
                    </button>
                  </motion.div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm py-1.5"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                  >
                    Unavailable
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          style={{
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
          }}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </LiquidGlass>
  );
}
