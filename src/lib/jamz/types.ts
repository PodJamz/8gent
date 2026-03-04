// Jamz Studio Types

export interface JamzProject {
  id: string;
  name: string;
  bpm: number;
  timeSignature: [number, number]; // [beats per bar, beat unit]
  createdAt: number;
  updatedAt: number;
  tracks: JamzTrack[];
  loopStart: number; // in beats
  loopEnd: number; // in beats
  loopEnabled: boolean;
}

export interface JamzTrack {
  id: string;
  name: string;
  type: 'audio' | 'midi';
  color: string;
  volume: number; // 0-1
  pan: number; // -1 to 1
  mute: boolean;
  solo: boolean;
  armed: boolean;
  clips: JamzClip[];
}

export interface JamzClip {
  id: string;
  name: string;
  startBeat: number;
  lengthBeats: number;
  audioBuffer?: AudioBuffer;
  audioUrl?: string;
  waveformPeaks?: number[];
  offset?: number; // offset within the audio file in seconds
  gain?: number; // clip-level gain
}

export interface AudioDeviceInfo {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'audiooutput';
}

export interface RecordingState {
  isRecording: boolean;
  targetTrackId: string | null;
  startBeat: number;
  mediaRecorder: MediaRecorder | null;
  chunks: Blob[];
}

export interface ExportOptions {
  format: 'wav' | 'mp3';
  quality?: number; // for mp3, 128-320
  normalize?: boolean;
  selectedRegionOnly?: boolean;
  stems?: boolean;
}

export interface QuickJamOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: 'record' | 'upload' | 'template';
}

export const TRACK_COLORS = [
  'bg-violet-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-blue-500',
  'bg-orange-500',
  'bg-indigo-500',
  'bg-teal-500',
] as const;

export const TRACK_COLOR_VALUES: Record<string, string> = {
  'bg-violet-500': '#8b5cf6',
  'bg-cyan-500': '#06b6d4',
  'bg-pink-500': '#ec4899',
  'bg-amber-500': '#f59e0b',
  'bg-emerald-500': '#10b981',
  'bg-rose-500': '#f43f5e',
  'bg-blue-500': '#3b82f6',
  'bg-orange-500': '#f97316',
  'bg-indigo-500': '#6366f1',
  'bg-teal-500': '#14b8a6',
};

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createEmptyProject(name: string = 'Untitled Project'): JamzProject {
  return {
    id: generateId(),
    name,
    bpm: 120,
    timeSignature: [4, 4],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tracks: [],
    loopStart: 0,
    loopEnd: 16,
    loopEnabled: true,
  };
}

export function createTrack(
  name: string,
  type: 'audio' | 'midi' = 'audio',
  colorIndex?: number
): JamzTrack {
  const color = TRACK_COLORS[colorIndex ?? Math.floor(Math.random() * TRACK_COLORS.length)];
  return {
    id: generateId(),
    name,
    type,
    color,
    volume: 0.8,
    pan: 0,
    mute: false,
    solo: false,
    armed: false,
    clips: [],
  };
}

export function createClip(
  name: string,
  startBeat: number,
  lengthBeats: number,
  audioUrl?: string
): JamzClip {
  return {
    id: generateId(),
    name,
    startBeat,
    lengthBeats,
    audioUrl,
    gain: 1,
  };
}

// Beat/time conversion utilities
export function beatsToSeconds(beats: number, bpm: number): number {
  return (beats / bpm) * 60;
}

export function secondsToBeats(seconds: number, bpm: number): number {
  return (seconds / 60) * bpm;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatBars(beats: number, beatsPerBar: number = 4): string {
  const bars = Math.floor(beats / beatsPerBar) + 1;
  const beat = Math.floor(beats % beatsPerBar) + 1;
  return `${bars}.${beat}`;
}
