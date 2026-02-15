'use client';

/**
 * Conversational Booking Experience
 *
 * A beautiful, AI-native booking flow that feels like chatting with James.
 * Inspired by onboarding flows with smooth transitions and binary choices.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Calendar, Clock, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { TextEffect, FadeIn, FadeInUp } from '@/components/motion';
import { springs } from '@/components/motion/config';
import type { EventType, AvailableSlot } from '@/lib/scheduling/types';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

type BookingStep =
  | 'welcome'
  | 'duration'
  | 'date'
  | 'time'
  | 'name'
  | 'email'
  | 'topic'
  | 'confirm'
  | 'success';

interface BookingData {
  duration: number;
  date: Date | null;
  time: AvailableSlot | null;
  name: string;
  email: string;
  topic: string;
}

interface ConversationalBookingProps {
  eventTypes: EventType[];
  availableSlots?: AvailableSlot[];
  onDateSelect: (date: Date) => void;
  onSubmit: (data: {
    eventTypeId: string;
    guestName: string;
    guestEmail: string;
    guestTimezone: string;
    startTime: number;
    notes?: string;
  }) => Promise<void>;
  isLoadingSlots?: boolean;
  hostName?: string;
  onSwitchToClassic?: () => void;
}

// ============================================================================
// Animation Variants
// ============================================================================

const stepVariants = {
  enter: { opacity: 0, y: 30, filter: 'blur(8px)' },
  center: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -30, filter: 'blur(8px)' },
};

const buttonVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

const generateCalendarDays = (month: Date) => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const startPadding = firstDay.getDay();

  const days: (Date | null)[] = [];

  // Add padding for days before the first of the month
  for (let i = 0; i < startPadding; i++) {
    days.push(null);
  }

  // Add all days in the month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, monthIndex, day));
  }

  return days;
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const formatDateFull = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

const isToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isPastDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// ============================================================================
// Sub-Components
// ============================================================================

interface ChoiceButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  selected?: boolean;
  delay?: number;
  icon?: React.ReactNode;
  subtitle?: string;
}

function ChoiceButton({ children, onClick, selected, delay = 0, icon, subtitle }: ChoiceButtonProps) {
  return (
    <motion.button
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      transition={{ ...springs.snappy, delay }}
      onClick={onClick}
      className={cn(
        'relative px-6 py-4 rounded-2xl font-medium transition-colors',
        'border-2 text-left w-full',
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border/50 hover:border-primary/50 text-foreground hover:bg-primary/5'
      )}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div className="flex-1">
          <span className="text-lg">{children}</span>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={springs.bouncy}
          >
            <Check className="w-5 h-5 text-primary" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

function ContinueButton({ onClick, disabled, children = 'Continue' }: ContinueButtonProps) {
  return (
    <motion.button
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      whileHover={disabled ? undefined : "hover"}
      whileTap={disabled ? undefined : "tap"}
      transition={{ ...springs.snappy, delay: 0.3 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg',
        'transition-all duration-200',
        disabled
          ? 'bg-muted text-muted-foreground cursor-not-allowed'
          : 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30'
      )}
    >
      {children}
      <ArrowRight className="w-5 h-5" />
    </motion.button>
  );
}

interface QuestionTextProps {
  children: string;
  emoji?: string;
}

function QuestionText({ children, emoji }: QuestionTextProps) {
  return (
    <div className="text-center mb-8">
      {emoji && (
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ ...springs.bouncy, delay: 0.1 }}
          className="text-6xl mb-4"
        >
          {emoji}
        </motion.div>
      )}
      <TextEffect
        per="word"
        preset="blur"
        as="h2"
        className="text-2xl md:text-3xl font-bold text-foreground"
      >
        {children}
      </TextEffect>
    </div>
  );
}

// ============================================================================
// Step Components
// ============================================================================

interface StepProps {
  onNext: () => void;
  data: BookingData;
  setData: React.Dispatch<React.SetStateAction<BookingData>>;
}

function WelcomeStep({ onNext, hostName = 'James' }: StepProps & { hostName?: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ...springs.bouncy, delay: 0.2 }}
        className="relative mb-6"
      >
        {/* Pulsing ring */}
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className="absolute inset-0 rounded-full bg-primary/20 scale-150"
        />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-5xl">
          👋
        </div>
      </motion.div>

      <TextEffect
        per="word"
        preset="blur"
        as="h1"
        className="text-3xl md:text-4xl font-bold text-foreground mb-3"
      >
        {`Hi! I'm ${hostName}.`}
      </TextEffect>

      <TextEffect
        per="word"
        preset="fade-in-blur"
        delay={0.3}
        className="text-lg text-muted-foreground mb-8"
      >
        Ready to schedule a chat?
      </TextEffect>

      <FadeInUp delay={0.5}>
        <ContinueButton onClick={onNext}>
          {"Let's do it"}
        </ContinueButton>
      </FadeInUp>
    </div>
  );
}

function DurationStep({ onNext, data, setData, eventTypes }: StepProps & { eventTypes: EventType[] }) {
  const durations = useMemo(() => {
    // Get unique durations from event types
    const uniqueDurations = [...new Set(eventTypes.map(et => et.duration))].sort((a, b) => a - b);
    return uniqueDurations.length > 0 ? uniqueDurations : [15, 30];
  }, [eventTypes]);

  const durationLabels: Record<number, { label: string; subtitle: string; icon: string }> = {
    15: { label: '15 minutes', subtitle: 'Quick sync', icon: '⚡' },
    30: { label: '30 minutes', subtitle: 'Full conversation', icon: '💬' },
    45: { label: '45 minutes', subtitle: 'Deep dive', icon: '🎯' },
    60: { label: '1 hour', subtitle: 'Extended session', icon: '🚀' },
  };

  const handleSelect = (duration: number) => {
    setData(prev => ({ ...prev, duration }));
  };

  return (
    <div className="flex flex-col items-center">
      <QuestionText emoji="⏱️">How much time would you like?</QuestionText>

      <div className="w-full max-w-md space-y-3 mb-8">
        {durations.map((duration, index) => {
          const config = durationLabels[duration] || {
            label: `${duration} minutes`,
            subtitle: 'Meeting',
            icon: '📅'
          };
          return (
            <ChoiceButton
              key={duration}
              onClick={() => handleSelect(duration)}
              selected={data.duration === duration}
              delay={index * 0.1}
              icon={config.icon}
              subtitle={config.subtitle}
            >
              {config.label}
            </ChoiceButton>
          );
        })}
      </div>

      <ContinueButton onClick={onNext} disabled={!data.duration} />
    </div>
  );
}

function DateStep({ onNext, data, setData, onDateSelect }: StepProps & { onDateSelect: (date: Date) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const days = generateCalendarDays(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateSelect = (date: Date) => {
    setData(prev => ({ ...prev, date, time: null }));
    onDateSelect(date);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="flex flex-col items-center">
      <QuestionText emoji="📅">When works for you?</QuestionText>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.smooth}
        className="w-full max-w-sm bg-card/50 rounded-2xl p-4 border border-border/50 mb-8"
      >
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="font-semibold text-lg">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs text-muted-foreground font-medium py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const isSelected = data.date?.toDateString() === date.toDateString();
            const isPast = isPastDate(date);
            const isTodayDate = isToday(date);

            return (
              <motion.button
                key={date.toISOString()}
                whileHover={!isPast ? { scale: 1.1 } : undefined}
                whileTap={!isPast ? { scale: 0.95 } : undefined}
                onClick={() => !isPast && handleDateSelect(date)}
                disabled={isPast}
                className={cn(
                  'aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-colors relative',
                  isPast && 'text-muted-foreground/30 cursor-not-allowed',
                  !isPast && !isSelected && 'hover:bg-primary/10 text-foreground',
                  isSelected && 'bg-primary text-primary-foreground',
                  isTodayDate && !isSelected && 'ring-2 ring-primary/30'
                )}
              >
                {date.getDate()}
                {isTodayDate && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <ContinueButton onClick={onNext} disabled={!data.date} />
    </div>
  );
}

function TimeStep({ onNext, data, setData, availableSlots, isLoading }: StepProps & { availableSlots?: AvailableSlot[]; isLoading?: boolean }) {
  const handleTimeSelect = (slot: AvailableSlot) => {
    setData(prev => ({ ...prev, time: slot }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center">
        <QuestionText emoji="⏰">Finding available times...</QuestionText>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!availableSlots || availableSlots.length === 0) {
    return (
      <div className="flex flex-col items-center text-center">
        <QuestionText emoji="😔">No times available</QuestionText>
        <p className="text-muted-foreground mb-6">
          Try selecting a different date
        </p>
        <ContinueButton onClick={() => setData(prev => ({ ...prev, date: null }))}>
          Pick another date
        </ContinueButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <QuestionText emoji="⏰">
        {data.date ? `What time on ${data.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}?` : 'Pick a time'}
      </QuestionText>

      <div className="w-full max-w-md grid grid-cols-3 gap-2 mb-8">
        {availableSlots.slice(0, 12).map((slot, index) => (
          <motion.button
            key={slot.timestamp}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springs.snappy, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTimeSelect(slot)}
            className={cn(
              'px-4 py-3 rounded-xl font-medium transition-colors border-2',
              data.time?.timestamp === slot.timestamp
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border/50 hover:border-primary/50 text-foreground'
            )}
          >
            {formatTime(slot.timestamp)}
          </motion.button>
        ))}
      </div>

      {availableSlots.length > 12 && (
        <p className="text-sm text-muted-foreground mb-4">
          Showing first 12 times
        </p>
      )}

      <ContinueButton onClick={onNext} disabled={!data.time} />
    </div>
  );
}

function NameStep({ onNext, data, setData }: StepProps) {
  const [inputValue, setInputValue] = useState(data.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setData(prev => ({ ...prev, name: inputValue.trim() }));
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <QuestionText emoji="👋">What&apos;s your name?</QuestionText>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <motion.input
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.smooth}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Your name"
          autoFocus
          className={cn(
            'w-full text-center text-2xl font-medium py-4 px-6 rounded-2xl',
            'bg-transparent border-2 border-border/50 focus:border-primary',
            'outline-none transition-colors placeholder:text-muted-foreground/50'
          )}
        />

        <div className="flex justify-center mt-8">
          <ContinueButton onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)} disabled={!inputValue.trim()} />
        </div>
      </form>
    </div>
  );
}

function EmailStep({ onNext, data, setData }: StepProps) {
  const [inputValue, setInputValue] = useState(data.email);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidEmail) {
      setData(prev => ({ ...prev, email: inputValue.trim() }));
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <QuestionText emoji="📧">And your email?</QuestionText>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <motion.input
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.smooth}
          type="email"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="you@email.com"
          autoFocus
          className={cn(
            'w-full text-center text-xl font-medium py-4 px-6 rounded-2xl',
            'bg-transparent border-2 border-border/50 focus:border-primary',
            'outline-none transition-colors placeholder:text-muted-foreground/50'
          )}
        />

        <p className="text-center text-sm text-muted-foreground mt-3">
          We&apos;ll send you a calendar invite
        </p>

        <div className="flex justify-center mt-8">
          <ContinueButton onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)} disabled={!isValidEmail} />
        </div>
      </form>
    </div>
  );
}

function TopicStep({ onNext, data, setData }: StepProps) {
  const [inputValue, setInputValue] = useState(data.topic);

  const handleContinue = () => {
    setData(prev => ({ ...prev, topic: inputValue.trim() }));
    onNext();
  };

  const handleSkip = () => {
    setData(prev => ({ ...prev, topic: '' }));
    onNext();
  };

  return (
    <div className="flex flex-col items-center">
      <QuestionText emoji="💭">Anything specific you&apos;d like to discuss?</QuestionText>

      <motion.textarea
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.smooth}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Optional: Tell me what's on your mind..."
        rows={3}
        className={cn(
          'w-full max-w-md text-lg py-4 px-6 rounded-2xl resize-none',
          'bg-transparent border-2 border-border/50 focus:border-primary',
          'outline-none transition-colors placeholder:text-muted-foreground/50'
        )}
      />

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
        <ContinueButton onClick={handleContinue}>
          {inputValue.trim() ? 'Continue' : 'Skip'}
        </ContinueButton>
        {inputValue.trim() && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip this
          </motion.button>
        )}
      </div>
    </div>
  );
}

function ConfirmStep({ onNext, data, isSubmitting }: StepProps & { isSubmitting?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <QuestionText emoji="✨">Ready to book?</QuestionText>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.smooth}
        className="w-full max-w-md bg-card/50 rounded-2xl p-6 border border-border/50 mb-8"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">When</p>
              <p className="font-medium">
                {data.date && formatDateFull(data.date)}
                {data.time && ` at ${formatTime(data.time.timestamp)}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{data.duration} minutes</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Your details</p>
            <p className="font-medium">{data.name}</p>
            <p className="text-muted-foreground">{data.email}</p>
            {data.topic && (
              <p className="text-sm mt-2 text-muted-foreground italic">&ldquo;{data.topic}&rdquo;</p>
            )}
          </div>
        </div>
      </motion.div>

      <motion.button
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover={isSubmitting ? undefined : "hover"}
        whileTap={isSubmitting ? undefined : "tap"}
        onClick={onNext}
        disabled={isSubmitting}
        className={cn(
          'flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg',
          'bg-primary text-primary-foreground shadow-lg shadow-primary/25',
          isSubmitting && 'opacity-70 cursor-wait'
        )}
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
            />
            Booking...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Confirm Booking
          </>
        )}
      </motion.button>
    </div>
  );
}

function SuccessStep({ data, hostName = 'James' }: { data: BookingData; hostName?: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ...springs.bouncy, delay: 0.2 }}
        className="text-7xl mb-6"
      >
        🎉
      </motion.div>

      <TextEffect
        per="word"
        preset="blur"
        as="h2"
        className="text-3xl md:text-4xl font-bold text-foreground mb-3"
      >
        You&apos;re all set!
      </TextEffect>

      <TextEffect
        per="word"
        preset="fade-in-blur"
        delay={0.3}
        className="text-lg text-muted-foreground mb-8"
      >
        {`See you ${data.date ? formatDateFull(data.date) : 'soon'}${data.time ? ` at ${formatTime(data.time.timestamp)}` : ''}`}
      </TextEffect>

      <FadeInUp delay={0.5}>
        <div className="bg-card/50 rounded-2xl p-6 border border-border/50 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-left">
              <p className="font-medium">Calendar invite sent</p>
              <p className="text-sm text-muted-foreground">{data.email}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {hostName} will send you a meeting link before the call.
          </p>
        </div>
      </FadeInUp>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ConversationalBooking({
  eventTypes,
  availableSlots,
  onDateSelect,
  onSubmit,
  isLoadingSlots,
  hostName = 'James',
  onSwitchToClassic,
}: ConversationalBookingProps) {
  const [step, setStep] = useState<BookingStep>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<BookingData>({
    duration: 0,
    date: null,
    time: null,
    name: '',
    email: '',
    topic: '',
  });

  // Get the selected event type based on duration
  const selectedEventType = useMemo(() => {
    return eventTypes.find(et => et.duration === data.duration);
  }, [eventTypes, data.duration]);

  const handleSubmit = useCallback(async () => {
    if (!selectedEventType || !data.time || !data.name || !data.email) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        eventTypeId: selectedEventType._id as string,
        guestName: data.name,
        guestEmail: data.email,
        guestTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        startTime: data.time.timestamp,
        notes: data.topic || undefined,
      });
      setStep('success');
    } catch (error) {
      console.error('Booking failed:', error);
      // Could show error state here
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedEventType, data, onSubmit]);

  const goToStep = (nextStep: BookingStep) => setStep(nextStep);

  // Progress indicator
  const steps: BookingStep[] = ['welcome', 'duration', 'date', 'time', 'name', 'email', 'topic', 'confirm'];
  const currentStepIndex = steps.indexOf(step);
  const progress = step === 'success' ? 100 : (currentStepIndex / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      {step !== 'welcome' && step !== 'success' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-0 left-0 right-0 h-1 bg-muted z-50"
        >
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={springs.smooth}
          />
        </motion.div>
      )}

      {/* Switch to classic view */}
      {onSwitchToClassic && step !== 'success' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={onSwitchToClassic}
          className="fixed top-4 right-4 text-sm text-muted-foreground hover:text-foreground transition-colors z-50"
        >
          Switch to classic view
        </motion.button>
      )}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springs.smooth}
            className="w-full max-w-lg"
          >
            {step === 'welcome' && (
              <WelcomeStep
                onNext={() => goToStep('duration')}
                data={data}
                setData={setData}
                hostName={hostName}
              />
            )}
            {step === 'duration' && (
              <DurationStep
                onNext={() => goToStep('date')}
                data={data}
                setData={setData}
                eventTypes={eventTypes}
              />
            )}
            {step === 'date' && (
              <DateStep
                onNext={() => goToStep('time')}
                data={data}
                setData={setData}
                onDateSelect={onDateSelect}
              />
            )}
            {step === 'time' && (
              <TimeStep
                onNext={() => goToStep('name')}
                data={data}
                setData={setData}
                availableSlots={availableSlots}
                isLoading={isLoadingSlots}
              />
            )}
            {step === 'name' && (
              <NameStep
                onNext={() => goToStep('email')}
                data={data}
                setData={setData}
              />
            )}
            {step === 'email' && (
              <EmailStep
                onNext={() => goToStep('topic')}
                data={data}
                setData={setData}
              />
            )}
            {step === 'topic' && (
              <TopicStep
                onNext={() => goToStep('confirm')}
                data={data}
                setData={setData}
              />
            )}
            {step === 'confirm' && (
              <ConfirmStep
                onNext={handleSubmit}
                data={data}
                setData={setData}
                isSubmitting={isSubmitting}
              />
            )}
            {step === 'success' && (
              <SuccessStep data={data} hostName={hostName} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Back button */}
      {step !== 'welcome' && step !== 'success' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            const prevStep = steps[currentStepIndex - 1];
            if (prevStep) setStep(prevStep);
          }}
          className="fixed bottom-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </motion.button>
      )}
    </div>
  );
}

export default ConversationalBooking;
