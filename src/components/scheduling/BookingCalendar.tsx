'use client';

/**
 * BookingCalendar - Calendar view for selecting a booking date
 */

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCalendarDates, isSameDay, isToday, isPast, formatDateString } from '@/lib/scheduling/utils';
import { DAY_NAMES_SHORT } from '@/lib/scheduling/types';

interface BookingCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  availableDates?: string[]; // Array of "YYYY-MM-DD" strings
  maxAdvanceDays?: number;
}

export function BookingCalendar({
  selectedDate,
  onSelectDate,
  currentMonth,
  onMonthChange,
  availableDates,
  maxAdvanceDays = 60,
}: BookingCalendarProps) {
  const dates = useMemo(
    () => getCalendarDates(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  );

  const maxDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + maxAdvanceDays);
    return date;
  }, [maxAdvanceDays]);

  const goToPreviousMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    onMonthChange(prev);
  };

  const goToNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    onMonthChange(next);
  };

  const isDateAvailable = (date: Date) => {
    if (isPast(date)) return false;
    if (date > maxDate) return false;
    if (!availableDates) return true;
    return availableDates.includes(formatDateString(date));
  };

  const monthLabel = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h3 className="font-semibold text-lg" style={{ color: 'hsl(var(--foreground))' }}>
          {monthLabel}
        </h3>

        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES_SHORT.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium py-2"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const isAvailable = isDateAvailable(date);

          return (
            <motion.button
              key={index}
              onClick={() => isAvailable && onSelectDate(date)}
              disabled={!isAvailable}
              whileHover={isAvailable ? { scale: 1.1 } : undefined}
              whileTap={isAvailable ? { scale: 0.95 } : undefined}
              className={`
                relative aspect-square flex items-center justify-center rounded-lg text-sm font-medium
                transition-colors
                ${!isCurrentMonth ? 'opacity-30' : ''}
                ${!isAvailable ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{
                backgroundColor: isSelected
                  ? 'hsl(var(--primary))'
                  : isTodayDate
                    ? 'hsl(var(--muted))'
                    : 'transparent',
                color: isSelected
                  ? 'hsl(var(--primary-foreground))'
                  : 'hsl(var(--foreground))',
              }}
            >
              {date.getDate()}
              {isTodayDate && !isSelected && (
                <span
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: 'hsl(var(--primary))' }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
