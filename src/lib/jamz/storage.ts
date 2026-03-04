'use client';

import { JamzProject, JamzTrack, JamzClip } from './types';

const STORAGE_KEY = 'jamz_project';
const PROJECTS_LIST_KEY = 'jamz_projects_list';

interface StoredProject {
  id: string;
  name: string;
  bpm: number;
  timeSignature: [number, number];
  createdAt: number;
  updatedAt: number;
  loopStart: number;
  loopEnd: number;
  loopEnabled: boolean;
  tracks: StoredTrack[];
}

interface StoredTrack {
  id: string;
  name: string;
  type: 'audio' | 'midi';
  color: string;
  volume: number;
  pan: number;
  mute: boolean;
  solo: boolean;
  armed: boolean;
  clips: StoredClip[];
}

interface StoredClip {
  id: string;
  name: string;
  startBeat: number;
  lengthBeats: number;
  audioUrl?: string;
  waveformPeaks?: number[];
  offset?: number;
  gain?: number;
}

// Convert project to storable format (without AudioBuffers)
function projectToStorable(project: JamzProject): StoredProject {
  return {
    id: project.id,
    name: project.name,
    bpm: project.bpm,
    timeSignature: project.timeSignature,
    createdAt: project.createdAt,
    updatedAt: Date.now(),
    loopStart: project.loopStart,
    loopEnd: project.loopEnd,
    loopEnabled: project.loopEnabled,
    tracks: project.tracks.map(track => ({
      id: track.id,
      name: track.name,
      type: track.type,
      color: track.color,
      volume: track.volume,
      pan: track.pan,
      mute: track.mute,
      solo: track.solo,
      armed: track.armed,
      clips: track.clips.map(clip => ({
        id: clip.id,
        name: clip.name,
        startBeat: clip.startBeat,
        lengthBeats: clip.lengthBeats,
        audioUrl: clip.audioUrl,
        waveformPeaks: clip.waveformPeaks,
        offset: clip.offset,
        gain: clip.gain,
      })),
    })),
  };
}

// Convert stored format back to project
function storableToProject(stored: StoredProject): JamzProject {
  return {
    id: stored.id,
    name: stored.name,
    bpm: stored.bpm,
    timeSignature: stored.timeSignature,
    createdAt: stored.createdAt,
    updatedAt: stored.updatedAt,
    loopStart: stored.loopStart,
    loopEnd: stored.loopEnd,
    loopEnabled: stored.loopEnabled,
    tracks: stored.tracks.map(track => ({
      id: track.id,
      name: track.name,
      type: track.type,
      color: track.color,
      volume: track.volume,
      pan: track.pan,
      mute: track.mute,
      solo: track.solo,
      armed: track.armed,
      clips: track.clips.map(clip => ({
        id: clip.id,
        name: clip.name,
        startBeat: clip.startBeat,
        lengthBeats: clip.lengthBeats,
        audioUrl: clip.audioUrl,
        waveformPeaks: clip.waveformPeaks,
        offset: clip.offset,
        gain: clip.gain,
      })),
    })),
  };
}

// Save current project to localStorage
export function saveProject(project: JamzProject): void {
  if (typeof window === 'undefined') return;

  try {
    const storable = projectToStorable(project);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storable));

    // Update projects list
    updateProjectsList(project.id, project.name, project.updatedAt);
  } catch (e) {
    console.error('Failed to save project:', e);
  }
}

// Load current project from localStorage
export function loadProject(): JamzProject | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed: StoredProject = JSON.parse(stored);

    // Validate required fields exist to prevent crashes from corrupted data
    if (!parsed || typeof parsed.id !== 'string' || !Array.isArray(parsed.tracks)) {
      console.warn('Invalid project data in localStorage, clearing...');
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return storableToProject(parsed);
  } catch (e) {
    console.error('Failed to load project:', e);
    // Clear corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore if removal fails
    }
    return null;
  }
}

// Save project by ID
export function saveProjectById(project: JamzProject): void {
  if (typeof window === 'undefined') return;

  try {
    const storable = projectToStorable(project);
    localStorage.setItem(`jamz_project_${project.id}`, JSON.stringify(storable));
    updateProjectsList(project.id, project.name, Date.now());
  } catch (e) {
    console.error('Failed to save project:', e);
  }
}

// Load project by ID
export function loadProjectById(id: string): JamzProject | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(`jamz_project_${id}`);
    if (!stored) return null;

    const parsed: StoredProject = JSON.parse(stored);
    return storableToProject(parsed);
  } catch (e) {
    console.error('Failed to load project:', e);
    return null;
  }
}

// Update projects list metadata
function updateProjectsList(id: string, name: string, updatedAt: number): void {
  try {
    const listStr = localStorage.getItem(PROJECTS_LIST_KEY);
    const list: Array<{ id: string; name: string; updatedAt: number }> = listStr ? JSON.parse(listStr) : [];

    const existingIndex = list.findIndex(p => p.id === id);
    if (existingIndex >= 0) {
      list[existingIndex] = { id, name, updatedAt };
    } else {
      list.push({ id, name, updatedAt });
    }

    // Sort by updatedAt descending
    list.sort((a, b) => b.updatedAt - a.updatedAt);

    localStorage.setItem(PROJECTS_LIST_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to update projects list:', e);
  }
}

// Get list of all saved projects
export function getProjectsList(): Array<{ id: string; name: string; updatedAt: number }> {
  if (typeof window === 'undefined') return [];

  try {
    const listStr = localStorage.getItem(PROJECTS_LIST_KEY);
    return listStr ? JSON.parse(listStr) : [];
  } catch (e) {
    console.error('Failed to get projects list:', e);
    return [];
  }
}

// Delete project
export function deleteProject(id: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(`jamz_project_${id}`);

    const listStr = localStorage.getItem(PROJECTS_LIST_KEY);
    if (listStr) {
      const list = JSON.parse(listStr);
      const filtered = list.filter((p: { id: string }) => p.id !== id);
      localStorage.setItem(PROJECTS_LIST_KEY, JSON.stringify(filtered));
    }

    // If deleting current project, clear it
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) {
      const parsed = JSON.parse(current);
      if (parsed.id === id) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  } catch (e) {
    console.error('Failed to delete project:', e);
  }
}

// Clear all Jamz data
export function clearAllData(): void {
  if (typeof window === 'undefined') return;

  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('jamz_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.error('Failed to clear data:', e);
  }
}

// Check if there's unsaved work
export function hasUnsavedWork(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const current = localStorage.getItem(STORAGE_KEY);
    return !!current;
  } catch (e) {
    return false;
  }
}

// Generate a shareable link (placeholder for Convex integration)
export function generateShareLink(projectId: string): string {
  // This would integrate with Convex to create a shareable link
  // For now, return a placeholder
  return `${typeof window !== 'undefined' ? window.location.origin : ''}/studio?project=${projectId}`;
}
