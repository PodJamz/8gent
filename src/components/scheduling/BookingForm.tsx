'use client';

/**
 * BookingForm - Form for guests to book a meeting
 */

import { useState } from 'react';
import { Calendar, Clock, Globe, User, Mail, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import type { EventType, AvailableSlot, Question, QuestionResponse } from '@/lib/scheduling/types';
import { formatDate, formatTime, formatDuration, getUserTimezone, isValidEmail } from '@/lib/scheduling/utils';

interface BookingFormProps {
  eventType: EventType;
  selectedDate: Date;
  selectedSlot: AvailableSlot;
  onSubmit: (data: BookingFormData) => Promise<void>;
  onBack: () => void;
}

interface BookingFormData {
  guestName: string;
  guestEmail: string;
  guestTimezone: string;
  notes?: string;
  responses?: QuestionResponse[];
}

export function BookingForm({
  eventType,
  selectedDate,
  selectedSlot,
  onSubmit,
  onBack,
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    guestName: '',
    guestEmail: '',
    guestTimezone: getUserTimezone(),
    notes: '',
    responses: eventType.questions?.map((q) => ({
      questionId: q.id,
      questionLabel: q.label,
      answer: '',
    })) || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.guestName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!formData.guestEmail.trim() || !isValidEmail(formData.guestEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check required questions
    const missingRequired = eventType.questions?.find((q) => {
      if (!q.required) return false;
      const response = formData.responses?.find((r) => r.questionId === q.id);
      return !response?.answer.trim();
    });

    if (missingRequired) {
      setError(`Please answer: ${missingRequired.label}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book meeting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateResponse = (questionId: string, answer: string) => {
    setFormData({
      ...formData,
      responses: formData.responses?.map((r) =>
        r.questionId === questionId ? { ...r, answer } : r
      ),
    });
  };

  const locationLabels: Record<string, string> = {
    google_meet: 'Google Meet video call',
    zoom: 'Zoom video call',
    phone: 'Phone call',
    in_person: 'In person',
    custom: 'Custom location',
  };

  return (
    <div className="space-y-6">
      {/* Meeting summary */}
      <LiquidGlass className="p-4 rounded-xl">
        <h3 className="font-semibold text-lg mb-3" style={{ color: 'hsl(var(--foreground))' }}>
          {eventType.title}
        </h3>

        <div className="space-y-2 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {formatDuration(eventType.duration)}
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(selectedDate.getTime())}
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {formatTime(selectedSlot.timestamp, formData.guestTimezone)}
          </div>

          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {formData.guestTimezone}
          </div>
        </div>

        <p className="mt-3 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
          {locationLabels[eventType.locationType]}
          {eventType.locationValue && `: ${eventType.locationValue}`}
        </p>
      </LiquidGlass>

      {/* Booking form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
            <User className="w-4 h-4" />
            Your Name *
          </label>
          <input
            type="text"
            value={formData.guestName}
            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
            placeholder="John Doe"
            className="w-full px-4 py-2 rounded-lg outline-none transition-all"
            style={{
              backgroundColor: 'hsl(var(--muted))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            }}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
            <Mail className="w-4 h-4" />
            Email Address *
          </label>
          <input
            type="email"
            value={formData.guestEmail}
            onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
            placeholder="john@example.com"
            className="w-full px-4 py-2 rounded-lg outline-none transition-all"
            style={{
              backgroundColor: 'hsl(var(--muted))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            }}
            required
          />
        </div>

        {/* Custom questions */}
        {eventType.questions?.map((question) => (
          <div key={question.id}>
            <label className="text-sm font-medium mb-2 block" style={{ color: 'hsl(var(--foreground))' }}>
              {question.label} {question.required && '*'}
            </label>

            {question.type === 'text' && (
              <input
                type="text"
                value={formData.responses?.find((r) => r.questionId === question.id)?.answer || ''}
                onChange={(e) => updateResponse(question.id, e.target.value)}
                className="w-full px-4 py-2 rounded-lg outline-none transition-all"
                style={{
                  backgroundColor: 'hsl(var(--muted))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                }}
                required={question.required}
              />
            )}

            {question.type === 'textarea' && (
              <textarea
                value={formData.responses?.find((r) => r.questionId === question.id)?.answer || ''}
                onChange={(e) => updateResponse(question.id, e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg outline-none transition-all resize-none"
                style={{
                  backgroundColor: 'hsl(var(--muted))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                }}
                required={question.required}
              />
            )}

            {question.type === 'select' && (
              <select
                value={formData.responses?.find((r) => r.questionId === question.id)?.answer || ''}
                onChange={(e) => updateResponse(question.id, e.target.value)}
                className="w-full px-4 py-2 rounded-lg outline-none"
                style={{
                  backgroundColor: 'hsl(var(--muted))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                }}
                required={question.required}
              >
                <option value="">Select an option</option>
                {question.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        {/* Notes */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
            <MessageSquare className="w-4 h-4" />
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Anything you'd like to share before the meeting..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg outline-none transition-all resize-none"
            style={{
              backgroundColor: 'hsl(var(--muted))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            }}
          />
        </div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-4 py-2.5 rounded-lg transition-colors"
            style={{
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            }}
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            }}
          >
            {isSubmitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}
