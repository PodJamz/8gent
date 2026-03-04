'use client';

/**
 * EventTypeForm - Create/Edit form for event types
 */

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import type { EventType, Question, LocationType } from '@/lib/scheduling/types';
import { DURATION_OPTIONS, EVENT_COLORS } from '@/lib/scheduling/types';
import { generateId } from '@/lib/scheduling/utils';

interface EventTypeFormProps {
  eventType?: EventType | null;
  onSave: (data: EventTypeFormData) => Promise<void>;
  onClose: () => void;
}

interface EventTypeFormData {
  title: string;
  description?: string;
  duration: number;
  color: string;
  locationType: LocationType;
  locationValue?: string;
  bufferBefore?: number;
  bufferAfter?: number;
  minNotice?: number;
  maxAdvance?: number;
  questions?: Question[];
}

export function EventTypeForm({ eventType, onSave, onClose }: EventTypeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EventTypeFormData>({
    title: eventType?.title || '',
    description: eventType?.description || '',
    duration: eventType?.duration || 30,
    color: eventType?.color || EVENT_COLORS[0].value,
    locationType: eventType?.locationType || 'google_meet',
    locationValue: eventType?.locationValue || '',
    bufferBefore: eventType?.bufferBefore || 0,
    bufferAfter: eventType?.bufferAfter || 0,
    minNotice: eventType?.minNotice || 24,
    maxAdvance: eventType?.maxAdvance || 60,
    questions: eventType?.questions || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save event type:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...(formData.questions || []),
        {
          id: generateId(),
          label: '',
          type: 'text',
          required: false,
        },
      ],
    });
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...(formData.questions || [])];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...(formData.questions || [])];
    newQuestions.splice(index, 1);
    setFormData({ ...formData, questions: newQuestions });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <LiquidGlass className="p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
              {eventType ? 'Edit Event Type' : 'New Event Type'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="30 Minute Meeting"
                className="w-full px-4 py-2 rounded-lg outline-none transition-all"
                style={{
                  backgroundColor: 'hsl(var(--muted))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                }}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A quick chat to discuss your project"
                rows={3}
                className="w-full px-4 py-2 rounded-lg outline-none transition-all resize-none"
                style={{
                  backgroundColor: 'hsl(var(--muted))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                }}
              />
            </div>

            {/* Duration & Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                  Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg outline-none"
                  style={{
                    backgroundColor: 'hsl(var(--muted))',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  }}
                >
                  {DURATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {EVENT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                      style={{
                        backgroundColor: color.value,
                        boxShadow: formData.color === color.value ? `0 0 0 2px hsl(var(--background)), 0 0 0 4px ${color.value}` : 'none',
                      }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Location Type */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                Location
              </label>
              <select
                value={formData.locationType}
                onChange={(e) => setFormData({ ...formData, locationType: e.target.value as LocationType })}
                className="w-full px-4 py-2 rounded-lg outline-none"
                style={{
                  backgroundColor: 'hsl(var(--muted))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                }}
              >
                <option value="google_meet">Google Meet</option>
                <option value="zoom">Zoom</option>
                <option value="phone">Phone Call</option>
                <option value="in_person">In Person</option>
                <option value="custom">Custom Link</option>
              </select>

              {(formData.locationType === 'phone' || formData.locationType === 'in_person' || formData.locationType === 'custom') && (
                <input
                  type="text"
                  value={formData.locationValue}
                  onChange={(e) => setFormData({ ...formData, locationValue: e.target.value })}
                  placeholder={
                    formData.locationType === 'phone'
                      ? 'Phone number'
                      : formData.locationType === 'in_person'
                        ? 'Address'
                        : 'Meeting link'
                  }
                  className="w-full px-4 py-2 rounded-lg outline-none mt-2"
                  style={{
                    backgroundColor: 'hsl(var(--muted))',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  }}
                />
              )}
            </div>

            {/* Buffer Times */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                  Buffer Before (min)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={formData.bufferBefore}
                  onChange={(e) => setFormData({ ...formData, bufferBefore: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg outline-none"
                  style={{
                    backgroundColor: 'hsl(var(--muted))',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                  Buffer After (min)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={formData.bufferAfter}
                  onChange={(e) => setFormData({ ...formData, bufferAfter: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg outline-none"
                  style={{
                    backgroundColor: 'hsl(var(--muted))',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  }}
                />
              </div>
            </div>

            {/* Scheduling Window */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                  Min Notice (hours)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minNotice}
                  onChange={(e) => setFormData({ ...formData, minNotice: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg outline-none"
                  style={{
                    backgroundColor: 'hsl(var(--muted))',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                  Max Advance (days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxAdvance}
                  onChange={(e) => setFormData({ ...formData, maxAdvance: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg outline-none"
                  style={{
                    backgroundColor: 'hsl(var(--muted))',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  }}
                />
              </div>
            </div>

            {/* Custom Questions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                  Booking Questions
                </label>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center gap-1 px-2 py-1 text-sm rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ color: 'hsl(var(--primary))' }}
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <AnimatePresence>
                {formData.questions?.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2 mb-2"
                  >
                    <input
                      type="text"
                      value={question.label}
                      onChange={(e) => updateQuestion(index, { label: e.target.value })}
                      placeholder="Question"
                      className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                      style={{
                        backgroundColor: 'hsl(var(--muted))',
                        border: '1px solid hsl(var(--border))',
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(index, { type: e.target.value as Question['type'] })}
                      className="px-2 py-2 rounded-lg text-sm outline-none"
                      style={{
                        backgroundColor: 'hsl(var(--muted))',
                        border: '1px solid hsl(var(--border))',
                        color: 'hsl(var(--foreground))',
                      }}
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Long Text</option>
                      <option value="select">Select</option>
                    </select>
                    <label className="flex items-center gap-1 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                      />
                      Req
                    </label>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg transition-colors"
                style={{
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim()}
                className="flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                }}
              >
                {isSubmitting ? 'Saving...' : eventType ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </LiquidGlass>
      </motion.div>
    </motion.div>
  );
}
