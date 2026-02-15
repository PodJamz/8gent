'use client';

/**
 * AgenticMode - The centerpiece agentic product lifecycle
 *
 * Four phases:
 * 1. Discovery - Problem definition, target user, constraints
 * 2. Design Thinking - Jobs-to-be-done, feature ideation, MVP
 * 3. Product Planning - PRD generation and storage
 * 4. Sharding → Execution - PRD to epics to tickets to Kanban
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Lightbulb,
  FileText,
  Layers,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  Users,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  XCircle,
  ListTodo,
  Milestone,
  HelpCircle,
  Play,
  Pause,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

// ============================================================================
// Types
// ============================================================================

export type AgenticPhase = 'discovery' | 'design' | 'planning' | 'execution';

export interface DiscoveryOutput {
  problem: string;
  targetUser: string;
  constraints: string[];
  successMetrics: string[];
  assumptions: string[];
  risks: string[];
}

export interface DesignOutput {
  jobsToBeDone: string[];
  features: string[];
  nonGoals: string[];
  mvpDefinition: string;
  designDirection: string;
}

export interface PlanningOutput {
  prdTitle: string;
  problem: string;
  solution: string;
  scope: string[];
  milestones: string[];
  openQuestions: string[];
}

export interface ExecutionOutput {
  epics: { id: string; title: string; description: string }[];
  tickets: { id: string; epicId: string; title: string; description: string; status: string }[];
}

export interface AgenticState {
  phase: AgenticPhase;
  isActive: boolean;
  discovery: Partial<DiscoveryOutput>;
  design: Partial<DesignOutput>;
  planning: Partial<PlanningOutput>;
  execution: Partial<ExecutionOutput>;
}

// ============================================================================
// Phase Components
// ============================================================================

interface PhaseProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev?: () => void;
}

function DiscoveryPhase({ data, onUpdate, onNext }: PhaseProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { key: 'problem', label: 'What problem are you solving?', placeholder: 'Describe the core problem...' },
    { key: 'targetUser', label: 'Who is your target user?', placeholder: 'Describe your ideal user...' },
    { key: 'constraints', label: 'What are your constraints?', placeholder: 'Time, budget, technical limitations...', isArray: true },
    { key: 'successMetrics', label: 'How will you measure success?', placeholder: 'Key metrics and KPIs...', isArray: true },
  ];

  const step = steps[currentStep];
  const value = step.isArray ? (data[step.key] || []).join('\n') : (data[step.key] || '');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = step.isArray
      ? e.target.value.split('\n').filter(Boolean)
      : e.target.value;
    onUpdate({ ...data, [step.key]: val });
  };

  const canProceed = step.isArray ? (data[step.key]?.length > 0) : Boolean(data[step.key]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        {steps.map((s, i) => (
          <div
            key={s.key}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === currentStep
                ? 'bg-blue-500'
                : i < currentStep
                ? 'bg-green-500'
                : 'bg-neutral-600'
            }`}
          />
        ))}
      </div>

      <div>
        <label className="block text-lg font-medium mb-3" style={{ color: 'hsl(var(--foreground))' }}>
          {step.label}
        </label>
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={step.placeholder}
          rows={4}
          className="w-full rounded-xl p-4 resize-none transition-colors"
          style={{
            backgroundColor: 'hsl(var(--muted))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          }}
        />
        {step.isArray && (
          <p className="text-sm mt-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Enter one item per line
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
          style={{
            backgroundColor: 'hsl(var(--muted))',
            color: 'hsl(var(--foreground))',
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceed}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            }}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!canProceed}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            }}
          >
            Continue to Design
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function DesignPhase({ data, onUpdate, onNext, onPrev }: PhaseProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { key: 'jobsToBeDone', label: 'What jobs is your user trying to do?', placeholder: 'When I... I want to... so that...', isArray: true },
    { key: 'features', label: 'What features will address these jobs?', placeholder: 'Core features and capabilities...', isArray: true },
    { key: 'nonGoals', label: 'What is explicitly out of scope?', placeholder: 'Things you will NOT build...', isArray: true },
    { key: 'mvpDefinition', label: 'Define your MVP', placeholder: 'The minimum viable product that validates the core hypothesis...' },
  ];

  const step = steps[currentStep];
  const value = step.isArray ? (data[step.key] || []).join('\n') : (data[step.key] || '');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = step.isArray
      ? e.target.value.split('\n').filter(Boolean)
      : e.target.value;
    onUpdate({ ...data, [step.key]: val });
  };

  const canProceed = step.isArray ? (data[step.key]?.length > 0) : Boolean(data[step.key]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        {steps.map((s, i) => (
          <div
            key={s.key}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === currentStep
                ? ''
                : i < currentStep
                ? 'bg-green-500'
                : 'bg-neutral-600'
            }`}
            style={i === currentStep ? { backgroundColor: 'hsl(var(--theme-primary))' } : {}}
          />
        ))}
      </div>

      <div>
        <label className="block text-lg font-medium mb-3" style={{ color: 'hsl(var(--foreground))' }}>
          {step.label}
        </label>
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={step.placeholder}
          rows={4}
          className="w-full rounded-xl p-4 resize-none transition-colors"
          style={{
            backgroundColor: 'hsl(var(--muted))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          }}
        />
        {step.isArray && (
          <p className="text-sm mt-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Enter one item per line
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => currentStep === 0 ? onPrev?.() : setCurrentStep(currentStep - 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
          style={{
            backgroundColor: 'hsl(var(--muted))',
            color: 'hsl(var(--foreground))',
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceed}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            }}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!canProceed}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            }}
          >
            Generate PRD
            <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function PlanningPhase({ data, onUpdate, onNext, onPrev }: PhaseProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
          PRD Generated
        </h3>
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>
          Your Product Requirements Document is ready
        </p>
      </div>

      <LiquidGlass className="p-6 rounded-2xl">
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={data.prdTitle || ''}
              onChange={(e) => onUpdate({ ...data, prdTitle: e.target.value })}
              placeholder="PRD Title"
              className="w-full text-xl font-semibold bg-transparent border-none outline-none"
              style={{ color: 'hsl(var(--foreground))' }}
            />
          </div>

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: 'hsl(var(--foreground))' }}>
              <Target className="w-4 h-4" />
              Problem
            </h4>
            <textarea
              value={data.problem || ''}
              onChange={(e) => onUpdate({ ...data, problem: e.target.value })}
              rows={2}
              className="w-full rounded-lg p-3 resize-none"
              style={{
                backgroundColor: 'hsl(var(--muted))',
                color: 'hsl(var(--foreground))',
              }}
            />
          </div>

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: 'hsl(var(--foreground))' }}>
              <Lightbulb className="w-4 h-4" />
              Solution
            </h4>
            <textarea
              value={data.solution || ''}
              onChange={(e) => onUpdate({ ...data, solution: e.target.value })}
              rows={2}
              className="w-full rounded-lg p-3 resize-none"
              style={{
                backgroundColor: 'hsl(var(--muted))',
                color: 'hsl(var(--foreground))',
              }}
            />
          </div>

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: 'hsl(var(--foreground))' }}>
              <Milestone className="w-4 h-4" />
              Milestones
            </h4>
            <textarea
              value={(data.milestones || []).join('\n')}
              onChange={(e) => onUpdate({ ...data, milestones: e.target.value.split('\n').filter(Boolean) })}
              rows={3}
              placeholder="One milestone per line..."
              className="w-full rounded-lg p-3 resize-none"
              style={{
                backgroundColor: 'hsl(var(--muted))',
                color: 'hsl(var(--foreground))',
              }}
            />
          </div>

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: 'hsl(var(--foreground))' }}>
              <HelpCircle className="w-4 h-4" />
              Open Questions
            </h4>
            <textarea
              value={(data.openQuestions || []).join('\n')}
              onChange={(e) => onUpdate({ ...data, openQuestions: e.target.value.split('\n').filter(Boolean) })}
              rows={2}
              placeholder="Questions to resolve..."
              className="w-full rounded-lg p-3 resize-none"
              style={{
                backgroundColor: 'hsl(var(--muted))',
                color: 'hsl(var(--foreground))',
              }}
            />
          </div>
        </div>
      </LiquidGlass>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
          style={{
            backgroundColor: 'hsl(var(--muted))',
            color: 'hsl(var(--foreground))',
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!data.prdTitle}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
          style={{
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
          }}
        >
          Shard to Tickets
          <Layers className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ExecutionPhase({ data, onPrev }: PhaseProps & { onComplete: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4">
          <Layers className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
          Ready for Execution
        </h3>
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>
          Your PRD has been sharded into actionable tickets
        </p>
      </div>

      <LiquidGlass className="p-6 rounded-2xl">
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2" style={{ color: 'hsl(var(--foreground))' }}>
            <ListTodo className="w-4 h-4" />
            Generated Tickets
          </h4>

          <div className="space-y-2">
            {(data.tickets || []).map((ticket: any, i: number) => (
              <div
                key={ticket.id || i}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: 'hsl(var(--muted))' }}
              >
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-medium text-blue-400">
                  {i + 1}
                </div>
                <span style={{ color: 'hsl(var(--foreground))' }}>{ticket.title}</span>
              </div>
            ))}

            {(!data.tickets || data.tickets.length === 0) && (
              <div className="text-center py-8" style={{ color: 'hsl(var(--muted-foreground))' }}>
                <p>Tickets will appear here once generated</p>
              </div>
            )}
          </div>
        </div>
      </LiquidGlass>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
          style={{
            backgroundColor: 'hsl(var(--muted))',
            color: 'hsl(var(--foreground))',
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
          style={{
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
          }}
        >
          <CheckCircle2 className="w-4 h-4" />
          Open in Kanban
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

interface AgenticModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgenticMode({ isOpen, onClose }: AgenticModeProps) {
  const [state, setState] = useState<AgenticState>({
    phase: 'discovery',
    isActive: true,
    discovery: {},
    design: {},
    planning: {},
    execution: {},
  });

  const phases: { id: AgenticPhase; label: string; icon: LucideIcon; color: string; themeColor?: boolean }[] = [
    { id: 'discovery', label: 'Discovery', icon: Compass, color: 'bg-blue-500' },
    { id: 'design', label: 'Design', icon: Lightbulb, color: '', themeColor: true },
    { id: 'planning', label: 'Planning', icon: FileText, color: 'bg-green-500' },
    { id: 'execution', label: 'Execution', icon: Layers, color: 'bg-orange-500' },
  ];

  const currentPhaseIndex = phases.findIndex((p) => p.id === state.phase);

  const goToPhase = useCallback((phase: AgenticPhase) => {
    setState((prev) => ({ ...prev, phase }));
  }, []);

  const goNext = useCallback(() => {
    const nextIndex = currentPhaseIndex + 1;
    if (nextIndex < phases.length) {
      goToPhase(phases[nextIndex].id);
    }
  }, [currentPhaseIndex, goToPhase, phases]);

  const goPrev = useCallback(() => {
    const prevIndex = currentPhaseIndex - 1;
    if (prevIndex >= 0) {
      goToPhase(phases[prevIndex].id);
    }
  }, [currentPhaseIndex, goToPhase, phases]);

  const updatePhaseData = useCallback((phase: AgenticPhase, data: any) => {
    setState((prev) => ({ ...prev, [phase]: data }));
  }, []);

  const resetFlow = useCallback(() => {
    setState({
      phase: 'discovery',
      isActive: true,
      discovery: {},
      design: {},
      planning: {},
      execution: {},
    });
  }, []);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl"
        style={{ backgroundColor: 'hsl(var(--background))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ 
                background: `linear-gradient(to bottom right, hsl(var(--theme-primary)), hsl(var(--theme-primary) / 0.8))` 
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                Agentic Mode
              </h2>
              <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Product Lifecycle Flow
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetFlow}
              className="p-2 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: 'hsl(var(--muted-foreground))' }}
              title="Reset flow"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: 'hsl(var(--muted-foreground))' }}
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Phase Indicators */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
          {phases.map((phase, i) => (
            <React.Fragment key={phase.id}>
              <button
                onClick={() => goToPhase(phase.id)}
                className={`flex flex-col items-center gap-1.5 transition-opacity ${
                  state.phase === phase.id ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${phase.themeColor ? '' : phase.color}`}
                  style={phase.themeColor ? { backgroundColor: 'hsl(var(--theme-primary))' } : {}}
                >
                  {React.createElement(phase.icon, { className: "w-5 h-5 text-white" })}
                </div>
                <span className="text-xs font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                  {phase.label}
                </span>
              </button>
              {i < phases.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-2"
                  style={{
                    backgroundColor: i < currentPhaseIndex
                      ? 'hsl(var(--primary))'
                      : 'hsl(var(--border))',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          <AnimatePresence mode="wait">
            {state.phase === 'discovery' && (
              <motion.div
                key="discovery"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <DiscoveryPhase
                  data={state.discovery}
                  onUpdate={(data) => updatePhaseData('discovery', data)}
                  onNext={goNext}
                />
              </motion.div>
            )}

            {state.phase === 'design' && (
              <motion.div
                key="design"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <DesignPhase
                  data={state.design}
                  onUpdate={(data) => updatePhaseData('design', data)}
                  onNext={goNext}
                  onPrev={goPrev}
                />
              </motion.div>
            )}

            {state.phase === 'planning' && (
              <motion.div
                key="planning"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PlanningPhase
                  data={state.planning}
                  onUpdate={(data) => updatePhaseData('planning', data)}
                  onNext={goNext}
                  onPrev={goPrev}
                />
              </motion.div>
            )}

            {state.phase === 'execution' && (
              <motion.div
                key="execution"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ExecutionPhase
                  data={state.execution}
                  onUpdate={(data) => updatePhaseData('execution', data)}
                  onNext={goNext}
                  onPrev={goPrev}
                  onComplete={onClose}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// Entry Point Button
// ============================================================================

interface AgenticModeButtonProps {
  onClick: () => void;
  variant?: 'default' | 'compact';
}

export function AgenticModeButton({ onClick, variant = 'default' }: AgenticModeButtonProps) {
  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
          color: 'white',
        }}
      >
        <Sparkles className="w-4 h-4" />
        <span className="font-medium">Agentic Mode</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group relative w-full p-6 rounded-2xl transition-all hover:scale-[1.02] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      <div className="relative flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="text-left">
          <h3 className="text-xl font-semibold text-white">
            Start Agentic Mode
          </h3>
          <p className="text-white/80">
            Begin a new product journey
          </p>
        </div>
        <ChevronRight className="w-6 h-6 text-white/80 ml-auto" />
      </div>
    </button>
  );
}
