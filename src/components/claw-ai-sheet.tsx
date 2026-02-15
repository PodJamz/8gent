'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useSessionBrain,
  generateDraftMarkdown,
  EventTypes,
} from '@/context/SessionBrainContext';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Copy,
  Download,
  Link2,
  Check,
  Users,
  AlertCircle,
  Target,
  Palette,
  Lightbulb,
} from 'lucide-react';
import { ClawAIAvatar } from '@/components/claw-ai/ClawAIAvatar';

interface ClawAISheetProps {
  isOpen: boolean;
  onClose: () => void;
}

// Design direction options
const designDirections = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, focused, distraction-free',
    toneWords: ['clean', 'focused', 'simple'],
    uiDensity: 'spacious' as const,
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Strong visuals, high contrast',
    toneWords: ['bold', 'confident', 'striking'],
    uiDensity: 'comfortable' as const,
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Friendly, approachable, human',
    toneWords: ['warm', 'friendly', 'approachable'],
    uiDensity: 'comfortable' as const,
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Precise, data-driven, professional',
    toneWords: ['precise', 'professional', 'efficient'],
    uiDensity: 'compact' as const,
  },
];

// Questions for the sprint flow
const questions = [
  {
    id: 'problem',
    title: 'What are we building?',
    subtitle: 'Describe the product or feature in a sentence or two.',
    placeholder: 'e.g., A mobile app that helps people track their daily water intake',
    icon: <Lightbulb className="w-6 h-6" />,
    field: 'problem' as const,
  },
  {
    id: 'audience',
    title: 'Who is it for?',
    subtitle: 'Describe your target user.',
    placeholder: 'e.g., Health-conscious professionals aged 25-45',
    icon: <Users className="w-6 h-6" />,
    field: 'audience' as const,
  },
  {
    id: 'workaround',
    title: 'What is the painful workflow today?',
    subtitle: 'How do people currently solve this problem?',
    placeholder: 'e.g., They use generic reminder apps or forget entirely',
    icon: <AlertCircle className="w-6 h-6" />,
    field: 'currentWorkaround' as const,
  },
  {
    id: 'outcome',
    title: 'What does success look like?',
    subtitle: 'Describe the ideal outcome for your users.',
    placeholder: 'e.g., Users consistently meet their hydration goals without effort',
    icon: <Target className="w-6 h-6" />,
    field: 'desiredOutcome' as const,
  },
  {
    id: 'design',
    title: 'Pick a design direction',
    subtitle: 'Choose the visual and tonal direction.',
    icon: <Palette className="w-6 h-6" />,
    isDesignStep: true,
  },
];

export function ClawAISheet({ isOpen, onClose }: ClawAISheetProps) {
  const {
    session,
    updateBrief,
    updateDesignDirection,
    setIslandState,
    setIslandProgress,
    addNotification,
    emitEvent,
    exportDraft,
    getSavePayload,
  } = useSessionBrain();

  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [showDraft, setShowDraft] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveUrl, setSaveUrl] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Update island state when sheet opens/closes
  useEffect(() => {
    if (isOpen) {
      setIslandState('planning');
      setIslandProgress(currentStep + 1, questions.length);
    } else {
      setIslandState('idle');
    }
  }, [isOpen, currentStep, setIslandState, setIslandProgress]);

  // Focus input when step changes
  useEffect(() => {
    if (isOpen && inputRef.current && !questions[currentStep]?.isDesignStep) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, currentStep]);

  // Load existing values when opening
  useEffect(() => {
    if (isOpen) {
      const question = questions[currentStep];
      if (question && !question.isDesignStep && question.field) {
        const existingValue = session.draft.brief[question.field];
        setInputValue(typeof existingValue === 'string' ? existingValue : '');
      }
      if (question?.isDesignStep) {
        setSelectedDesign(session.draft.designDirection.selectedTheme || null);
      }
    }
  }, [isOpen, currentStep, session.draft.brief, session.draft.designDirection.selectedTheme]);

  const handleNext = useCallback(() => {
    const question = questions[currentStep];

    if (question.isDesignStep) {
      if (selectedDesign) {
        const direction = designDirections.find((d) => d.id === selectedDesign);
        if (direction) {
          updateDesignDirection({
            toneWords: direction.toneWords,
            uiDensity: direction.uiDensity,
            selectedTheme: direction.id,
          });
          emitEvent(EventTypes.DESIGN_DIRECTION_UPDATED, { direction: direction.id }, 'user');
        }
      }
    } else if (question.field && inputValue.trim()) {
      updateBrief({ [question.field]: inputValue.trim() });
      emitEvent(EventTypes.BRIEF_PROBLEM_UPDATED, { field: question.field, value: inputValue.trim() }, 'user');
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setInputValue('');
      setIslandProgress(currentStep + 2, questions.length);

      // Update island state based on progress
      if (currentStep >= 2) {
        setIslandState('drafting-brief');
      }
    } else {
      // Completed all steps
      setIslandState('ready');
      setShowDraft(true);

      // Add notification
      addNotification('product', 'complete', 'Brief draft ready', 'Your project brief has been drafted');
      emitEvent(EventTypes.BRIEF_COMPLETED, { draft: session.draft.brief }, 'ai');
    }
  }, [
    currentStep,
    inputValue,
    selectedDesign,
    updateBrief,
    updateDesignDirection,
    setIslandState,
    setIslandProgress,
    addNotification,
    emitEvent,
    session.draft.brief,
  ]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setInputValue('');
      setShowDraft(false);
      setIslandProgress(currentStep, questions.length);
    }
  }, [currentStep, setIslandProgress]);

  const handleCopy = useCallback(async () => {
    const markdown = exportDraft();
    await navigator.clipboard.writeText(markdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [exportDraft]);

  const handleDownload = useCallback(() => {
    const markdown = exportDraft();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-draft.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportDraft]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const payload = getSavePayload();
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setSaveUrl(`${window.location.origin}/s/${data.token}`);
        emitEvent(EventTypes.SESSION_SAVED, { token: data.token }, 'user');
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  }, [getSavePayload, emitEvent]);

  const handleCopyUrl = useCallback(async () => {
    if (saveUrl) {
      await navigator.clipboard.writeText(saveUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [saveUrl]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (inputValue.trim() || questions[currentStep]?.isDesignStep) {
          handleNext();
        }
      }
    },
    [inputValue, currentStep, handleNext]
  );

  const currentQuestion = questions[currentStep];
  const canProceed =
    currentQuestion?.isDesignStep ? !!selectedDesign : inputValue.trim().length > 0;

  const sheetVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0.2 }
        : { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
    exit: {
      y: '100%',
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh]"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-gradient-to-b from-slate-900 to-black rounded-t-3xl border-t border-white/10 overflow-hidden">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pb-4">
                <div className="flex items-center gap-3">
                  <ClawAIAvatar size={40} isActive={false} />
                  <div>
                    <h2 className="text-white font-semibold">Claw AI</h2>
                    <p className="text-white/50 text-xs">Free Sprint Preview</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-white/40 hover:text-white/80 transition-colors rounded-full hover:bg-white/5"
                  aria-label="Close Claw AI"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="px-6 pb-4">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((showDraft ? questions.length : currentStep) / questions.length) * 100}%`,
                    }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.15 }
                        : { type: 'spring', stiffness: 300, damping: 30 }
                    }
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-white/40">
                  <span>Step {showDraft ? questions.length : currentStep + 1} of {questions.length}</span>
                  <span>{showDraft ? 'Complete' : `${Math.round(((currentStep) / questions.length) * 100)}%`}</span>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-8 max-h-[60vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {showDraft ? (
                    <motion.div
                      key="draft"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Draft preview */}
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <h3 className="text-white font-semibold mb-3">Your Draft</h3>
                        <div className="space-y-3 text-sm">
                          {session.draft.brief.problem && (
                            <div>
                              <span className="text-white/40">Building:</span>
                              <p className="text-white/80">{session.draft.brief.problem}</p>
                            </div>
                          )}
                          {session.draft.brief.audience && (
                            <div>
                              <span className="text-white/40">For:</span>
                              <p className="text-white/80">{session.draft.brief.audience}</p>
                            </div>
                          )}
                          {session.draft.brief.currentWorkaround && (
                            <div>
                              <span className="text-white/40">Current pain:</span>
                              <p className="text-white/80">{session.draft.brief.currentWorkaround}</p>
                            </div>
                          )}
                          {session.draft.brief.desiredOutcome && (
                            <div>
                              <span className="text-white/40">Success looks like:</span>
                              <p className="text-white/80">{session.draft.brief.desiredOutcome}</p>
                            </div>
                          )}
                          {session.draft.designDirection.selectedTheme && (
                            <div>
                              <span className="text-white/40">Design direction:</span>
                              <p className="text-white/80 capitalize">{session.draft.designDirection.selectedTheme}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={handleCopy}
                          className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                        >
                          {isCopied ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : (
                            <Copy className="w-5 h-5 text-white/60" />
                          )}
                          <span className="text-xs text-white/60">
                            {isCopied ? 'Copied!' : 'Copy'}
                          </span>
                        </button>

                        <button
                          onClick={handleDownload}
                          className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                        >
                          <Download className="w-5 h-5 text-white/60" />
                          <span className="text-xs text-white/60">Download</span>
                        </button>

                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex flex-col items-center gap-2 p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl transition-colors border border-purple-500/30 disabled:opacity-50"
                        >
                          <Link2 className="w-5 h-5 text-purple-400" />
                          <span className="text-xs text-purple-400">
                            {isSaving ? 'Saving...' : 'Save Link'}
                          </span>
                        </button>
                      </div>

                      {/* Save URL display */}
                      {saveUrl && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-green-500/10 border border-green-500/20 rounded-xl p-4"
                        >
                          <p className="text-green-400 text-sm font-medium mb-2">Link saved!</p>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={saveUrl}
                              readOnly
                              className="flex-1 bg-black/30 text-white/80 text-xs px-3 py-2 rounded-lg border border-white/10"
                            />
                            <button
                              onClick={handleCopyUrl}
                              className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                              aria-label={isCopied ? 'Copied' : 'Copy URL'}
                            >
                              {isCopied ? (
                                <Check className="w-4 h-4 text-green-400" aria-hidden="true" />
                              ) : (
                                <Copy className="w-4 h-4 text-green-400" aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Start over */}
                      <button
                        onClick={() => {
                          setCurrentStep(0);
                          setShowDraft(false);
                          setInputValue('');
                          setSaveUrl(null);
                        }}
                        className="w-full text-white/40 hover:text-white/60 text-sm transition-colors"
                      >
                        Start over
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`step-${currentStep}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Question */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/60 flex-shrink-0">
                          {currentQuestion?.icon}
                        </div>
                        <div>
                          <h3 className="text-white text-lg font-semibold">
                            {currentQuestion?.title}
                          </h3>
                          <p className="text-white/50 text-sm mt-1">
                            {currentQuestion?.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Input or Design Selection */}
                      {currentQuestion?.isDesignStep ? (
                        <div className="grid grid-cols-2 gap-3">
                          {designDirections.map((direction) => (
                            <button
                              key={direction.id}
                              onClick={() => setSelectedDesign(direction.id)}
                              className={`
                                p-4 rounded-2xl border text-left transition-all
                                ${
                                  selectedDesign === direction.id
                                    ? 'bg-purple-500/20 border-purple-500/50'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }
                              `}
                            >
                              <h4 className="text-white font-medium">{direction.name}</h4>
                              <p className="text-white/50 text-xs mt-1">
                                {direction.description}
                              </p>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <textarea
                          ref={inputRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={currentQuestion?.placeholder}
                          className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/30 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
                        />
                      )}

                      {/* Navigation */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={handleBack}
                          disabled={currentStep === 0}
                          className="flex items-center gap-1 text-white/40 hover:text-white/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="text-sm">Back</span>
                        </button>

                        <button
                          onClick={handleNext}
                          disabled={!canProceed}
                          className={`
                            flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all
                            ${
                              canProceed
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                                : 'bg-white/10 text-white/30 cursor-not-allowed'
                            }
                          `}
                        >
                          <span>
                            {currentStep === questions.length - 1 ? 'Finish' : 'Next'}
                          </span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
