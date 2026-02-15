'use client';

/**
 * ProjectContext - Multi-Project Support
 *
 * Manages projects as contexts within Claw AI OS.
 * Each project contains its own:
 * - Kanban board
 * - Threads
 * - PRDs and artifacts
 * - Design direction
 */

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
  useState,
} from 'react';

// ============================================================================
// Types
// ============================================================================

export interface ProjectArtifact {
  id: string;
  type: 'prd' | 'brief' | 'design' | 'prototype' | 'ticket' | 'epic' | 'note';
  title: string;
  content: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectThread {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  createdAt: number;
  messageCount: number;
}

export interface ProjectKanbanTask {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  tags?: string[];
  epicId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'completed';
  color: string;
  icon?: string;
  createdAt: number;
  updatedAt: number;
  artifacts: ProjectArtifact[];
  threads: ProjectThread[];
  tasks: ProjectKanbanTask[];
  settings: {
    defaultView?: 'kanban' | 'list' | 'calendar';
    showCompleted?: boolean;
  };
}

export interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  isLoaded: boolean;
}

// ============================================================================
// Default Values
// ============================================================================

const OPENCLAW_OS_PROJECT: Project = {
  id: 'openclaw-os',
  name: 'OpenClaw-OS',
  description: 'The AI-Native Operating System ecosystem.',
  status: 'active',
  color: '#8b5cf6',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  artifacts: [],
  threads: [],
  tasks: [],
  settings: {
    defaultView: 'kanban',
    showCompleted: false,
  },
};

const createDefaultState = (): ProjectState => ({
  projects: [OPENCLAW_OS_PROJECT],
  activeProjectId: 'openclaw-os',
  isLoaded: false,
});

// ============================================================================
// Storage
// ============================================================================

const STORAGE_KEY = 'openclaw_projects';

// ============================================================================
// Reducer
// ============================================================================

type ProjectAction =
  | { type: 'SET_STATE'; payload: ProjectState }
  | { type: 'SET_LOADED' }
  | { type: 'SET_ACTIVE_PROJECT'; payload: string | null }
  | { type: 'CREATE_PROJECT'; payload: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'artifacts' | 'threads' | 'tasks' | 'settings'> }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; updates: Partial<Project> } }
  | { type: 'ARCHIVE_PROJECT'; payload: string }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_ARTIFACT'; payload: { projectId: string; artifact: Omit<ProjectArtifact, 'id' | 'createdAt' | 'updatedAt' | 'version'> } }
  | { type: 'UPDATE_ARTIFACT'; payload: { projectId: string; artifactId: string; updates: Partial<ProjectArtifact> } }
  | { type: 'DELETE_ARTIFACT'; payload: { projectId: string; artifactId: string } }
  | { type: 'ADD_TASK'; payload: { projectId: string; task: Omit<ProjectKanbanTask, 'id' | 'createdAt' | 'updatedAt'> } }
  | { type: 'UPDATE_TASK'; payload: { projectId: string; taskId: string; updates: Partial<ProjectKanbanTask> } }
  | { type: 'DELETE_TASK'; payload: { projectId: string; taskId: string } }
  | { type: 'MOVE_TASK'; payload: { projectId: string; taskId: string; status: ProjectKanbanTask['status'] } };

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  const now = Date.now();

  switch (action.type) {
    case 'SET_STATE':
      return { ...action.payload, isLoaded: true };

    case 'SET_LOADED':
      return { ...state, isLoaded: true };

    case 'SET_ACTIVE_PROJECT':
      return { ...state, activeProjectId: action.payload };

    case 'CREATE_PROJECT': {
      const newProject: Project = {
        ...action.payload,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        artifacts: [],
        threads: [],
        tasks: [],
        settings: { defaultView: 'kanban', showCompleted: false },
      };
      return {
        ...state,
        projects: [...state.projects, newProject],
        activeProjectId: newProject.id,
      };
    }

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id
            ? { ...p, ...action.payload.updates, updatedAt: now }
            : p
        ),
      };

    case 'ARCHIVE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload
            ? { ...p, status: 'archived', updatedAt: now }
            : p
        ),
        activeProjectId:
          state.activeProjectId === action.payload
            ? state.projects.find((p) => p.id !== action.payload && p.status === 'active')?.id || null
            : state.activeProjectId,
      };

    case 'DELETE_PROJECT':
      // Prevent deleting Claw AI OS
      if (action.payload === 'openclaw-os') return state;
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
        activeProjectId:
          state.activeProjectId === action.payload
            ? state.projects.find((p) => p.id !== action.payload)?.id || null
            : state.activeProjectId,
      };

    case 'ADD_ARTIFACT': {
      const { projectId, artifact } = action.payload;
      const newArtifact: ProjectArtifact = {
        ...artifact,
        id: generateId(),
        version: 1,
        createdAt: now,
        updatedAt: now,
      };
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === projectId
            ? { ...p, artifacts: [...p.artifacts, newArtifact], updatedAt: now }
            : p
        ),
      };
    }

    case 'UPDATE_ARTIFACT': {
      const { projectId, artifactId, updates } = action.payload;
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
              ...p,
              artifacts: p.artifacts.map((a) =>
                a.id === artifactId
                  ? { ...a, ...updates, version: a.version + 1, updatedAt: now }
                  : a
              ),
              updatedAt: now,
            }
            : p
        ),
      };
    }

    case 'DELETE_ARTIFACT': {
      const { projectId, artifactId } = action.payload;
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === projectId
            ? { ...p, artifacts: p.artifacts.filter((a) => a.id !== artifactId), updatedAt: now }
            : p
        ),
      };
    }

    case 'ADD_TASK': {
      const { projectId, task } = action.payload;
      const newTask: ProjectKanbanTask = {
        ...task,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === projectId
            ? { ...p, tasks: [...p.tasks, newTask], updatedAt: now }
            : p
        ),
      };
    }

    case 'UPDATE_TASK': {
      const { projectId, taskId, updates } = action.payload;
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId ? { ...t, ...updates, updatedAt: now } : t
              ),
              updatedAt: now,
            }
            : p
        ),
      };
    }

    case 'DELETE_TASK': {
      const { projectId, taskId } = action.payload;
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === projectId
            ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId), updatedAt: now }
            : p
        ),
      };
    }

    case 'MOVE_TASK': {
      const { projectId, taskId, status } = action.payload;
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId ? { ...t, status, updatedAt: now } : t
              ),
              updatedAt: now,
            }
            : p
        ),
      };
    }

    default:
      return state;
  }
}

// ============================================================================
// Session Management
// ============================================================================

export interface OpenClawSessionState {
  activeProjectId: string | null;
  setActiveProject: (id: string | null) => void;
}

export function useOpenClawSession() {
  const { activeProjectId, setActiveProject } = useProject();
  return {
    activeProjectId,
    setActiveProject,
    // Shims for Convex compatibility if needed
    activeConvexProjectId: activeProjectId,
    activeConvexProjectSlug: activeProjectId, // Simplify for now
    setActiveConvexProject: setActiveProject,
  };
}

// ============================================================================
// Context
// ============================================================================

interface ProjectContextValue {
  // State
  projects: Project[];
  activeProject: Project | null;
  activeProjectId: string | null;
  isLoaded: boolean;

  // Project operations
  setActiveProject: (id: string | null) => void;
  createProject: (data: { name: string; description?: string; color: string }) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  archiveProject: (id: string) => void;
  deleteProject: (id: string) => void;

  // Artifact operations
  addArtifact: (projectId: string, artifact: Omit<ProjectArtifact, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  updateArtifact: (projectId: string, artifactId: string, updates: Partial<ProjectArtifact>) => void;
  deleteArtifact: (projectId: string, artifactId: string) => void;
  getArtifacts: (projectId?: string) => ProjectArtifact[];

  // Task operations
  addTask: (projectId: string, task: Omit<ProjectKanbanTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<ProjectKanbanTask>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  moveTask: (projectId: string, taskId: string, status: ProjectKanbanTask['status']) => void;
  getTasks: (projectId?: string) => ProjectKanbanTask[];

  // Helpers
  getActiveProjects: () => Project[];
  getArchivedProjects: () => Project[];
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface ProjectProviderProps {
  children: ReactNode;
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [state, dispatch] = useReducer(projectReducer, createDefaultState());

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure Claw AI OS project exists
        const currentProjects = parsed.projects || [];
        const hasOpenClawOS = currentProjects.some((p: Project) => p.id === 'openclaw-os');

        if (!hasOpenClawOS) {
          parsed.projects = [OPENCLAW_OS_PROJECT, ...currentProjects];
        }
        dispatch({ type: 'SET_STATE', payload: parsed });
      } else {
        dispatch({ type: 'SET_LOADED' });
      }
    } catch (e) {
      console.error('Failed to load projects from localStorage:', e);
      dispatch({ type: 'SET_LOADED' });
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (!state.isLoaded) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Failed to save projects to localStorage:', e);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state]);

  // Project operations
  const setActiveProject = useCallback((id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_PROJECT', payload: id });
  }, []);

  const createProject = useCallback((data: { name: string; description?: string; color: string }) => {
    dispatch({ type: 'CREATE_PROJECT', payload: { ...data, status: 'active' } });
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { id, updates } });
  }, []);

  const archiveProject = useCallback((id: string) => {
    dispatch({ type: 'ARCHIVE_PROJECT', payload: id });
  }, []);

  const deleteProject = useCallback((id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  }, []);

  // Artifact operations
  const addArtifact = useCallback((projectId: string, artifact: Omit<ProjectArtifact, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    dispatch({ type: 'ADD_ARTIFACT', payload: { projectId, artifact } });
  }, []);

  const updateArtifact = useCallback((projectId: string, artifactId: string, updates: Partial<ProjectArtifact>) => {
    dispatch({ type: 'UPDATE_ARTIFACT', payload: { projectId, artifactId, updates } });
  }, []);

  const deleteArtifact = useCallback((projectId: string, artifactId: string) => {
    dispatch({ type: 'DELETE_ARTIFACT', payload: { projectId, artifactId } });
  }, []);

  const getArtifacts = useCallback((projectId?: string) => {
    const id = projectId || state.activeProjectId;
    const project = state.projects.find((p) => p.id === id);
    return project?.artifacts || [];
  }, [state.projects, state.activeProjectId]);

  // Task operations
  const addTask = useCallback((projectId: string, task: Omit<ProjectKanbanTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_TASK', payload: { projectId, task } });
  }, []);

  const updateTask = useCallback((projectId: string, taskId: string, updates: Partial<ProjectKanbanTask>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { projectId, taskId, updates } });
  }, []);

  const deleteTask = useCallback((projectId: string, taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { projectId, taskId } });
  }, []);

  const moveTask = useCallback((projectId: string, taskId: string, status: ProjectKanbanTask['status']) => {
    dispatch({ type: 'MOVE_TASK', payload: { projectId, taskId, status } });
  }, []);

  const getTasks = useCallback((projectId?: string) => {
    const id = projectId || state.activeProjectId;
    const project = state.projects.find((p) => p.id === id);
    return project?.tasks || [];
  }, [state.projects, state.activeProjectId]);

  // Helpers
  const getActiveProjects = useCallback(() => {
    return state.projects.filter((p) => p.status === 'active');
  }, [state.projects]);

  const getArchivedProjects = useCallback(() => {
    return state.projects.filter((p) => p.status === 'archived');
  }, [state.projects]);

  const activeProject = state.projects.find((p) => p.id === state.activeProjectId) || null;

  const value: ProjectContextValue = {
    projects: state.projects,
    activeProject,
    activeProjectId: state.activeProjectId,
    isLoaded: state.isLoaded,
    setActiveProject,
    createProject,
    updateProject,
    archiveProject,
    deleteProject,
    addArtifact,
    updateArtifact,
    deleteArtifact,
    getArtifacts,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasks,
    getActiveProjects,
    getArchivedProjects,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

// End of Project Context
