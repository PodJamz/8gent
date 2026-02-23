/**
 * Agentic Product Lifecycle - Completed Tasks
 *
 * This file contains all tickets from the Agentic Product Lifecycle implementation.
 * Import into kanban or use to seed localStorage.
 *
 * Usage:
 *   localStorage.setItem('kanban-tasks', JSON.stringify(AGENTIC_LIFECYCLE_TASKS));
 */

import { Task } from './types';

const now = new Date().toISOString();

export const AGENTIC_LIFECYCLE_TASKS: Task[] = [
  // ========== TIER 0: System Reliability ==========
  {
    id: 't0-1',
    title: '[T0] Single-Click Interaction',
    description: 'Verify AppIcon navigates on single click, not double click. Existing implementation confirmed working.',
    priority: 'urgent',
    status: 'done',
    tags: ['tier-0', 'reliability', 'ux'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't0-2',
    title: '[T0] System Route',
    description: 'Create /system route with OS information, product thesis, architecture overview, and quick settings.',
    priority: 'urgent',
    status: 'done',
    tags: ['tier-0', 'reliability', 'routing'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't0-3',
    title: '[T0] Global Error Boundary',
    description: 'Create src/app/error.tsx with graceful error handling and recovery options.',
    priority: 'urgent',
    status: 'done',
    tags: ['tier-0', 'reliability', 'error-handling'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't0-4',
    title: '[T0] Calendar Error Boundary',
    description: 'Create src/app/calendar/error.tsx to handle Clerk authentication issues gracefully.',
    priority: 'urgent',
    status: 'done',
    tags: ['tier-0', 'reliability', 'error-handling'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't0-5',
    title: '[T0] PrototypeState Component',
    description: 'Create component for intentionally incomplete features with clear messaging about status.',
    priority: 'high',
    status: 'done',
    tags: ['tier-0', 'reliability', 'component'],
    createdAt: now,
    updatedAt: now,
  },

  // ========== TIER 1: Product Clarity ==========
  {
    id: 't1-1',
    title: '[T1] Product Thesis',
    description: 'Define and display product thesis: "8gent OS is a personal, agentic operating system..."',
    priority: 'high',
    status: 'done',
    tags: ['tier-1', 'clarity', 'documentation'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't1-2',
    title: '[T1] OS Mental Model',
    description: 'Document and display OS architecture: 30+ apps, 25+ themes, React Contexts, TypeScript.',
    priority: 'high',
    status: 'done',
    tags: ['tier-1', 'clarity', 'documentation'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't1-3',
    title: '[T1] App Taxonomy',
    description: 'Create AppTaxonomy.tsx with explicit app groupings: Core OS, Agentic Work, Creative, Personal.',
    priority: 'high',
    status: 'done',
    tags: ['tier-1', 'clarity', 'component'],
    createdAt: now,
    updatedAt: now,
  },

  // ========== TIER 2: Full Agentic Mode ==========
  {
    id: 't2-1',
    title: '[T2] AgenticMode Modal',
    description: 'Create AgenticMode.tsx with 4-phase product lifecycle modal: Discovery, Design, Planning, Execution.',
    priority: 'urgent',
    status: 'done',
    tags: ['tier-2', 'agentic', 'component'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't2-2',
    title: '[T2] Discovery Phase',
    description: 'Implement Discovery phase with problem statement input and transcript capture.',
    priority: 'urgent',
    status: 'done',
    tags: ['tier-2', 'agentic', 'discovery'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't2-3',
    title: '[T2] Design Phase',
    description: 'Implement Design phase with PRD generation from discovery transcript.',
    priority: 'urgent',
    status: 'done',
    tags: ['tier-2', 'agentic', 'design'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't2-4',
    title: '[T2] Planning Phase',
    description: 'Implement Planning phase with epic and ticket breakdown from PRD.',
    priority: 'urgent',
    status: 'done',
    tags: ['tier-2', 'agentic', 'planning'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't2-5',
    title: '[T2] Execution Phase',
    description: 'Implement Execution phase with Kanban board population and progress tracking.',
    priority: 'urgent',
    status: 'done',
    tags: ['tier-2', 'agentic', 'execution'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't2-6',
    title: '[T2] AgenticModeButton',
    description: 'Create AgenticModeButton with variants: full, compact, icon-only.',
    priority: 'high',
    status: 'done',
    tags: ['tier-2', 'agentic', 'component'],
    createdAt: now,
    updatedAt: now,
  },

  // ========== TIER 3: Multi-Project Support ==========
  {
    id: 't3-1',
    title: '[T3] ProjectContext',
    description: 'Create ProjectContext.tsx with multi-project state management, CRUD operations, and localStorage persistence.',
    priority: 'high',
    status: 'done',
    tags: ['tier-3', 'project', 'context'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't3-2',
    title: '[T3] ProjectSelector',
    description: 'Create ProjectSelector.tsx with project switching, creation, and archival UI.',
    priority: 'high',
    status: 'done',
    tags: ['tier-3', 'project', 'component'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't3-3',
    title: '[T3] ProjectKanbanBoard',
    description: 'Create ProjectKanbanBoard.tsx using ProjectContext for project-aware task management.',
    priority: 'high',
    status: 'done',
    tags: ['tier-3', 'project', 'kanban'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't3-4',
    title: '[T3] ActiveProjectIndicator',
    description: 'Create ActiveProjectIndicator component showing current project in header/nav.',
    priority: 'medium',
    status: 'done',
    tags: ['tier-3', 'project', 'component'],
    createdAt: now,
    updatedAt: now,
  },

  // ========== TIER 4: Design & UX Refinement ==========
  {
    id: 't4-1',
    title: '[T4] State Persistence',
    description: 'Implement localStorage persistence for ProjectContext with debounced saves.',
    priority: 'high',
    status: 'done',
    tags: ['tier-4', 'ux', 'persistence'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't4-2',
    title: '[T4] Motion Config',
    description: 'Create src/lib/motion/config.ts with unified animation springs, durations, variants, and effects.',
    priority: 'high',
    status: 'done',
    tags: ['tier-4', 'ux', 'animation'],
    createdAt: now,
    updatedAt: now,
  },

  // ========== TIER 5: Agent & Thread Credibility ==========
  {
    id: 't5-1',
    title: '[T5] ThreadsExplainer',
    description: 'Create ThreadsExplainer.tsx explaining thread mental model: base, parallel, chained, fusion, big, long threads.',
    priority: 'high',
    status: 'done',
    tags: ['tier-5', 'threads', 'documentation'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't5-2',
    title: '[T5] GoldStandardDemo',
    description: 'Create GoldStandardDemo.tsx showing complete flow: Idea → PRD → Tickets → Kanban.',
    priority: 'high',
    status: 'done',
    tags: ['tier-5', 'demo', 'showcase'],
    createdAt: now,
    updatedAt: now,
  },

  // ========== TIER 6: Engineering Signals ==========
  {
    id: 't6-1',
    title: '[T6] Architecture View',
    description: 'Add architecture overview to System page showing component counts and tech stack.',
    priority: 'medium',
    status: 'done',
    tags: ['tier-6', 'architecture', 'signals'],
    createdAt: now,
    updatedAt: now,
  },

  // ========== TIER 7: Simulation Mode ==========
  {
    id: 't7-1',
    title: '[T7] SimulationLabel',
    description: 'Create SimulationLabel.tsx with live/prototype/concept modes and colored badges.',
    priority: 'medium',
    status: 'done',
    tags: ['tier-7', 'simulation', 'component'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't7-2',
    title: '[T7] withSimulationLabel HOC',
    description: 'Create HOC wrapper for adding simulation labels to any component.',
    priority: 'medium',
    status: 'done',
    tags: ['tier-7', 'simulation', 'hoc'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't7-3',
    title: '[T7] Konami Easter Egg',
    description: 'Create KonamiEasterEgg.tsx triggered by ↑↑↓↓←→←→BA sequence.',
    priority: 'low',
    status: 'done',
    tags: ['tier-7', 'easter-egg', 'fun'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't7-4',
    title: '[T7] Click Counter Easter Egg',
    description: 'Create ClickCountEasterEgg.tsx showing message after N clicks.',
    priority: 'low',
    status: 'done',
    tags: ['tier-7', 'easter-egg', 'fun'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't7-5',
    title: '[T7] Developer Mode',
    description: 'Create DeveloperModeEasterEgg.tsx triggered by Ctrl+Shift+D showing debug info.',
    priority: 'low',
    status: 'done',
    tags: ['tier-7', 'easter-egg', 'developer'],
    createdAt: now,
    updatedAt: now,
  },

  // ========== TIER 8: Test Suite (Not Yet Implemented) ==========
  {
    id: 't8-1',
    title: '[T8] Vitest Setup',
    description: 'Configure Vitest with React Testing Library, jsdom, and path aliases.',
    priority: 'high',
    status: 'backlog',
    tags: ['tier-8', 'testing', 'setup'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't8-2',
    title: '[T8] Motion Library Tests',
    description: 'Write 37 tests for motion config: springs, durations, easings, transitions, variants, effects.',
    priority: 'high',
    status: 'backlog',
    tags: ['tier-8', 'testing', 'motion'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't8-3',
    title: '[T8] HomeScreen App Placement Tests',
    description: 'Write 37 tests verifying all routes have HomeScreen apps in correct folders.',
    priority: 'high',
    status: 'backlog',
    tags: ['tier-8', 'testing', 'homescreen'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't8-4',
    title: '[T8] ProjectContext Tests',
    description: 'Write 21 tests for ProjectContext: CRUD, tasks, artifacts, persistence.',
    priority: 'high',
    status: 'backlog',
    tags: ['tier-8', 'testing', 'context'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't8-5',
    title: '[T8] AgenticMode Tests',
    description: 'Write 20 tests for AgenticMode: modal, phases, navigation, button variants.',
    priority: 'high',
    status: 'backlog',
    tags: ['tier-8', 'testing', 'agentic'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 't8-6',
    title: '[T8] Component Tests',
    description: 'Write 58 tests for OS components: AppTaxonomy, EasterEgg, SimulationLabel, PrototypeState.',
    priority: 'high',
    status: 'backlog',
    tags: ['tier-8', 'testing', 'components'],
    createdAt: now,
    updatedAt: now,
  },
];

/**
 * Helper to load these tasks into localStorage
 */
export function seedAgenticLifecycleTasks(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kanban-tasks', JSON.stringify(AGENTIC_LIFECYCLE_TASKS));
  }
}

/**
 * Get task stats
 */
export function getTaskStats() {
  const total = AGENTIC_LIFECYCLE_TASKS.length;
  const done = AGENTIC_LIFECYCLE_TASKS.filter(t => t.status === 'done').length;
  const byTier = AGENTIC_LIFECYCLE_TASKS.reduce((acc, task) => {
    const tier = task.tags?.find(t => t.startsWith('tier-')) || 'other';
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return { total, done, completion: `${Math.round((done / total) * 100)}%`, byTier };
}
