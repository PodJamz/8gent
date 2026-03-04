'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const calendarVariants = cva('p-3', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface CalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'>,
    VariantProps<typeof calendarVariants> {
  selected?: Date;
  onSelect?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  highlightedDates?: Date[];
  showOutsideDays?: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      className,
      size,
      selected,
      onSelect,
      minDate,
      maxDate,
      disabledDates = [],
      highlightedDates = [],
      showOutsideDays = true,
      ...props
    },
    ref
  ) => {
    const [viewDate, setViewDate] = React.useState(selected || new Date());
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const isDisabled = (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return disabledDates.some((d) => isSameDay(d, date));
    };

    const isHighlighted = (date: Date) => highlightedDates.some((d) => isSameDay(d, date));

    const days: (Date | null)[] = [];

    // Previous month days
    for (let i = 0; i < startDay; i++) {
      const date = new Date(year, month, -(startDay - 1 - i));
      days.push(showOutsideDays ? date : null);
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push(showOutsideDays ? date : null);
    }

    const sizeClasses = {
      sm: 'h-7 w-7',
      md: 'h-9 w-9',
      lg: 'h-11 w-11',
    };

    return (
      <div ref={ref} className={cn(calendarVariants({ size }), className)} {...props}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-1 rounded-md hover:bg-muted transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-semibold">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 rounded-md hover:bg-muted transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className={sizeClasses[size || 'md']} />;
            }

            const isCurrentMonth = date.getMonth() === month;
            const isSelected = selected && isSameDay(date, selected);
            const isToday = isSameDay(date, new Date());
            const disabled = isDisabled(date);
            const highlighted = isHighlighted(date);

            return (
              <button
                key={index}
                onClick={() => !disabled && onSelect?.(date)}
                disabled={disabled}
                className={cn(
                  'flex items-center justify-center rounded-md transition-colors',
                  sizeClasses[size || 'md'],
                  !isCurrentMonth && 'text-muted-foreground/50',
                  isCurrentMonth && !isSelected && 'hover:bg-muted',
                  isSelected && 'bg-primary text-primary-foreground',
                  isToday && !isSelected && 'border border-primary',
                  highlighted && !isSelected && 'bg-primary/10',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);
Calendar.displayName = 'Calendar';

export { Calendar, calendarVariants };
