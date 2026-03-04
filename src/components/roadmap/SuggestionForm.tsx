'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lightbulb, Bug, Zap, Puzzle, HelpCircle, X, CheckCircle } from 'lucide-react';
import { useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import { cn } from '@/lib/utils';

type Category = 'feature' | 'improvement' | 'bug' | 'integration' | 'other';

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'feature', label: 'New Feature', icon: <Lightbulb className="w-4 h-4" />, description: 'Something new to build' },
  { id: 'improvement', label: 'Improvement', icon: <Zap className="w-4 h-4" />, description: 'Make existing better' },
  { id: 'bug', label: 'Bug Report', icon: <Bug className="w-4 h-4" />, description: 'Something broken' },
  { id: 'integration', label: 'Integration', icon: <Puzzle className="w-4 h-4" />, description: 'Connect with other tools' },
  { id: 'other', label: 'Other', icon: <HelpCircle className="w-4 h-4" />, description: 'Something else' },
];

interface SuggestionFormProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function SuggestionForm({ onClose, isModal = false }: SuggestionFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('feature');
  const [submittedBy, setSubmittedBy] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitSuggestion = useMutation(api.roadmap.submitSuggestion);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError('Please fill in both title and description');
      return;
    }

    setIsSubmitting(true);

    try {
      const suggestionData = {
        title: title.trim(),
        description: description.trim(),
        category,
        submittedBy: submittedBy.trim() || undefined,
        email: email.trim() || undefined,
      };

      // Save to Convex database
      await submitSuggestion(suggestionData);

      // Send email notification (fire and forget - don't block on failure)
      fetch('/api/suggestions/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suggestionData),
      }).catch((err) => console.error('Email notification failed:', err));

      setIsSuccess(true);

      // Reset after showing success
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setCategory('feature');
        setSubmittedBy('');
        setEmail('');
        setIsSuccess(false);
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to submit suggestion. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success State */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex flex-col items-center justify-center rounded-xl z-10"
            style={{ backgroundColor: 'hsl(var(--theme-card))' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            </motion.div>
            <p className="text-lg font-medium text-[hsl(var(--theme-foreground))]">
              Thanks for your suggestion!
            </p>
            <p className="text-sm text-[hsl(var(--theme-muted-foreground))]">
              I&apos;ll review it soon.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="text-lg font-semibold text-[hsl(var(--theme-foreground))]"
            style={{ fontFamily: 'var(--theme-font-heading)' }}
          >
            Suggest a Feature
          </h3>
          <p className="text-sm text-[hsl(var(--theme-muted-foreground))]">
            What should 8gent do next?
          </p>
        </div>
        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[hsl(var(--theme-muted))] transition-colors"
          >
            <X className="w-5 h-5 text-[hsl(var(--theme-muted-foreground))]" />
          </button>
        )}
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[hsl(var(--theme-foreground))]">
          Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-lg border transition-all text-center',
                category === cat.id
                  ? 'border-[hsl(var(--theme-primary))] bg-[hsl(var(--theme-primary)/0.1)]'
                  : 'border-[hsl(var(--theme-border))] hover:border-[hsl(var(--theme-primary)/0.5)]'
              )}
              style={{ backgroundColor: category === cat.id ? undefined : 'hsl(var(--theme-card))' }}
            >
              <span className={cn(
                category === cat.id
                  ? 'text-[hsl(var(--theme-primary))]'
                  : 'text-[hsl(var(--theme-muted-foreground))]'
              )}>
                {cat.icon}
              </span>
              <span className={cn(
                'text-xs font-medium',
                category === cat.id
                  ? 'text-[hsl(var(--theme-primary))]'
                  : 'text-[hsl(var(--theme-foreground))]'
              )}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-[hsl(var(--theme-foreground))]">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Add Spotify integration to Jamz"
          className={cn(
            'w-full px-4 py-2 rounded-lg text-sm',
            'bg-[hsl(var(--theme-card))] border border-[hsl(var(--theme-border))]',
            'text-[hsl(var(--theme-foreground))] placeholder:text-[hsl(var(--theme-muted-foreground))]',
            'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)] focus:border-[hsl(var(--theme-primary))]',
            'transition-colors'
          )}
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-[hsl(var(--theme-foreground))]">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your idea, the problem it solves, or why it would be useful..."
          rows={4}
          className={cn(
            'w-full px-4 py-2 rounded-lg text-sm resize-none',
            'bg-[hsl(var(--theme-card))] border border-[hsl(var(--theme-border))]',
            'text-[hsl(var(--theme-foreground))] placeholder:text-[hsl(var(--theme-muted-foreground))]',
            'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)] focus:border-[hsl(var(--theme-primary))]',
            'transition-colors'
          )}
          required
        />
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-[hsl(var(--theme-foreground))]">
            Your Name <span className="text-[hsl(var(--theme-muted-foreground))]">(optional)</span>
          </label>
          <input
            id="name"
            type="text"
            value={submittedBy}
            onChange={(e) => setSubmittedBy(e.target.value)}
            placeholder="Anonymous"
            className={cn(
              'w-full px-4 py-2 rounded-lg text-sm',
              'bg-[hsl(var(--theme-card))] border border-[hsl(var(--theme-border))]',
              'text-[hsl(var(--theme-foreground))] placeholder:text-[hsl(var(--theme-muted-foreground))]',
              'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)] focus:border-[hsl(var(--theme-primary))]',
              'transition-colors'
            )}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-[hsl(var(--theme-foreground))]">
            Email <span className="text-[hsl(var(--theme-muted-foreground))]">(for updates)</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={cn(
              'w-full px-4 py-2 rounded-lg text-sm',
              'bg-[hsl(var(--theme-card))] border border-[hsl(var(--theme-border))]',
              'text-[hsl(var(--theme-foreground))] placeholder:text-[hsl(var(--theme-muted-foreground))]',
              'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--theme-primary)/0.5)] focus:border-[hsl(var(--theme-primary))]',
              'transition-colors'
            )}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || isSuccess}
        className={cn(
          'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium',
          'bg-[hsl(var(--theme-primary))] text-[hsl(var(--theme-primary-foreground))]',
          'hover:bg-[hsl(var(--theme-primary)/0.9)] transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Suggestion
          </>
        )}
      </button>
    </form>
  );

  if (isModal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg p-6 rounded-xl border border-[hsl(var(--theme-border))] shadow-xl"
          style={{ backgroundColor: 'hsl(var(--theme-card))' }}
        >
          {formContent}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div
      className="relative p-6 rounded-xl border border-[hsl(var(--theme-border))]"
      style={{ backgroundColor: 'hsl(var(--theme-card))' }}
    >
      {formContent}
    </div>
  );
}
