'use client';

/**
 * GoldStandardDemo - One Flawless Flow
 *
 * Demonstrates the complete product lifecycle:
 * New Product → PRD → Tickets → Kanban
 *
 * This is the flagship demo of Claw AI OS capabilities.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  FileText,
  Layers,
  ListTodo,
  ChevronRight,
  Play,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Target,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { useProject } from '@/context/ProjectContext';

type DemoStep = 'intro' | 'discovery' | 'prd' | 'tickets' | 'kanban' | 'complete';

interface DemoData {
  productIdea: string;
  problem: string;
  targetUser: string;
  prdTitle: string;
  prdGoals: string[];
  tickets: { id: string; title: string; status: string }[];
}

const DEMO_PRESET: DemoData = {
  productIdea: 'Task Management for ADHD',
  problem: 'Traditional todo apps overwhelm users with ADHD, leading to task paralysis and anxiety',
  targetUser: 'Adults with ADHD who struggle with executive function and task prioritization',
  prdTitle: 'ADHD-Friendly Task Manager',
  prdGoals: [
    'Reduce cognitive load with single-task focus mode',
    'Gamify completion with dopamine-friendly rewards',
    'Integrate body doubling and accountability features',
    'Support time blindness with smart notifications',
  ],
  tickets: [
    { id: '1', title: 'Design single-task focus mode UI', status: 'todo' },
    { id: '2', title: 'Implement gamification system', status: 'todo' },
    { id: '3', title: 'Build notification scheduler', status: 'todo' },
    { id: '4', title: 'Create onboarding flow', status: 'backlog' },
    { id: '5', title: 'Add body doubling integration', status: 'backlog' },
  ],
};

export function GoldStandardDemo() {
  const [step, setStep] = useState<DemoStep>('intro');
  const [demoData, setDemoData] = useState<DemoData>(DEMO_PRESET);
  const [isAnimating, setIsAnimating] = useState(false);
  const { activeProject, addArtifact, addTask } = useProject();

  const steps: { id: DemoStep; label: string; icon: LucideIcon }[] = [
    { id: 'intro', label: 'Start', icon: Play },
    { id: 'discovery', label: 'Discovery', icon: Target },
    { id: 'prd', label: 'PRD', icon: FileText },
    { id: 'tickets', label: 'Tickets', icon: ListTodo },
    { id: 'kanban', label: 'Kanban', icon: Layers },
    { id: 'complete', label: 'Done', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  const nextStep = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(steps[nextIndex].id);
        setIsAnimating(false);
      }, 300);
    }
  }, [currentStepIndex, steps]);

  const resetDemo = useCallback(() => {
    setStep('intro');
    setDemoData(DEMO_PRESET);
  }, []);

  const saveToProject = useCallback(() => {
    if (!activeProject) return;

    // Save PRD as artifact
    addArtifact(activeProject.id, {
      type: 'prd',
      title: demoData.prdTitle,
      content: JSON.stringify({
        problem: demoData.problem,
        targetUser: demoData.targetUser,
        goals: demoData.prdGoals,
      }),
    });

    // Add tickets
    demoData.tickets.forEach((ticket) => {
      addTask(activeProject.id, {
        title: ticket.title,
        status: ticket.status as any,
        priority: 'medium',
      });
    });
  }, [activeProject, demoData, addArtifact, addTask]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <button
              onClick={() => i <= currentStepIndex && setStep(s.id)}
              className={`flex flex-col items-center gap-1 transition-opacity ${
                i <= currentStepIndex ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  i === currentStepIndex
                    ? 'bg-purple-500'
                    : i < currentStepIndex
                    ? 'bg-green-500'
                    : 'bg-neutral-700'
                }`}
              >
                {React.createElement(s.icon, { className: "w-5 h-5 text-white" })}
              </div>
              <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {s.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2"
                style={{
                  backgroundColor:
                    i < currentStepIndex
                      ? 'hsl(142, 71%, 45%)'
                      : 'hsl(var(--border))',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'hsl(var(--foreground))' }}>
              Gold Standard Demo
            </h2>
            <p className="mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Watch the complete product lifecycle in action:
              <br />
              <strong style={{ color: 'hsl(var(--foreground))' }}>
                Idea → PRD → Tickets → Kanban
              </strong>
            </p>

            <LiquidGlass className="p-4 rounded-xl mb-6 text-left">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                <div>
                  <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Demo Product Idea
                  </p>
                  <p className="font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                    {demoData.productIdea}
                  </p>
                </div>
              </div>
            </LiquidGlass>

            <button
              onClick={nextStep}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                color: 'white',
              }}
            >
              <Play className="w-5 h-5" />
              Start Demo
            </button>
          </motion.div>
        )}

        {step === 'discovery' && (
          <motion.div
            key="discovery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                Phase 1: Discovery
              </h2>
              <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                Understanding the problem space
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <LiquidGlass className="p-4 rounded-xl">
                <h3 className="font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                  Problem Statement
                </h3>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {demoData.problem}
                </p>
              </LiquidGlass>

              <LiquidGlass className="p-4 rounded-xl">
                <h3 className="font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                  Target User
                </h3>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {demoData.targetUser}
                </p>
              </LiquidGlass>
            </div>

            <button
              onClick={nextStep}
              disabled={isAnimating}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-colors"
              style={{
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
              }}
            >
              Generate PRD
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 'prd' && (
          <motion.div
            key="prd"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                Phase 2: PRD Generated
              </h2>
              <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                Product Requirements Document
              </p>
            </div>

            <LiquidGlass className="p-6 rounded-xl mb-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'hsl(var(--foreground))' }}>
                {demoData.prdTitle}
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                    Goals
                  </h4>
                  <ul className="space-y-2">
                    {demoData.prdGoals.map((goal, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                        <span style={{ color: 'hsl(var(--muted-foreground))' }}>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </LiquidGlass>

            <button
              onClick={nextStep}
              disabled={isAnimating}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-colors"
              style={{
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
              }}
            >
              Shard to Tickets
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 'tickets' && (
          <motion.div
            key="tickets"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center mx-auto mb-4">
                <ListTodo className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                Phase 3: Tickets Created
              </h2>
              <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                PRD sharded into actionable work
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {demoData.tickets.map((ticket, i) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <LiquidGlass className="p-4 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm font-medium text-blue-400">
                      {ticket.id}
                    </div>
                    <div className="flex-1">
                      <p style={{ color: 'hsl(var(--foreground))' }}>{ticket.title}</p>
                    </div>
                    <span
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: ticket.status === 'todo' ? 'hsl(217, 91%, 60%, 0.2)' : 'hsl(215, 14%, 34%, 0.2)',
                        color: ticket.status === 'todo' ? 'hsl(217, 91%, 60%)' : 'hsl(215, 14%, 60%)',
                      }}
                    >
                      {ticket.status}
                    </span>
                  </LiquidGlass>
                </motion.div>
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={isAnimating}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-colors"
              style={{
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
              }}
            >
              View in Kanban
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 'kanban' && (
          <motion.div
            key="kanban"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-500 flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                Phase 4: Ready for Execution
              </h2>
              <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                Tickets organized in Kanban board
              </p>
            </div>

            {/* Mini Kanban Preview */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {['Backlog', 'Todo', 'In Progress'].map((column) => (
                <LiquidGlass key={column} className="p-3 rounded-xl">
                  <h4 className="text-xs font-medium mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {column}
                  </h4>
                  <div className="space-y-2">
                    {demoData.tickets
                      .filter((t) => {
                        if (column === 'Todo') return t.status === 'todo';
                        if (column === 'Backlog') return t.status === 'backlog';
                        return false;
                      })
                      .map((ticket) => (
                        <div
                          key={ticket.id}
                          className="p-2 rounded-lg text-xs"
                          style={{ backgroundColor: 'hsl(var(--muted))' }}
                        >
                          <span style={{ color: 'hsl(var(--foreground))' }}>
                            {ticket.title.slice(0, 25)}...
                          </span>
                        </div>
                      ))}
                  </div>
                </LiquidGlass>
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={isAnimating}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-colors"
              style={{
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
              }}
            >
              Complete Demo
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-2xl font-bold mb-3" style={{ color: 'hsl(var(--foreground))' }}>
              Demo Complete!
            </h2>
            <p className="mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
              You've seen the complete product lifecycle:
              <br />
              Idea → Discovery → PRD → Tickets → Kanban
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={resetDemo}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
                style={{
                  backgroundColor: 'hsl(var(--muted))',
                  color: 'hsl(var(--foreground))',
                }}
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </button>

              {activeProject && (
                <button
                  onClick={saveToProject}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
                  style={{
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                  }}
                >
                  Save to {activeProject.name}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
