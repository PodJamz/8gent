/**
 * Jamz Audio Engine
 *
 * Web Audio API based audio engine for the Jamz DAW.
 * Supports multi-track playback, recording, and export.
 */

// ============================================================================
// Types
// ============================================================================

export interface AudioClip {
  id: string;
  trackId: string;
  name: string;
  startTime: number; // Position in seconds
  duration: number;
  audioBuffer: AudioBuffer | null;
  color: string;
  muted: boolean;
}

export interface AudioTrack {
  id: string;
  name: string;
  type: 'audio' | 'midi' | 'bus';
  color: string;
  volume: number; // 0-1
  pan: number; // -1 to 1
  muted: boolean;
  solo: boolean;
  armed: boolean;
  clips: AudioClip[];
  gainNode?: GainNode;
  panNode?: StereoPannerNode;
}

export interface JamzProject {
  id: string;
  name: string;
  bpm: number;
  timeSignature: [number, number];
  tracks: AudioTrack[];
  duration: number; // Total project duration in seconds
}

// ============================================================================
// Audio Engine Class
// ============================================================================

export class JamzAudioEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private scheduledSources: Map<string, AudioBufferSourceNode> = new Map();
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  // State
  private _isPlaying = false;
  private _isRecording = false;
  private _currentTime = 0;
  private _bpm = 120;
  private startTime = 0;
  private pausedAt = 0;

  // Listeners
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initContext();
    }
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  private initContext() {
    if (this.context) return;

    this.context = new AudioContext();
    this.masterGain = this.context.createGain();
    this.analyser = this.context.createAnalyser();

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.context.destination);

    this.analyser.fftSize = 2048;
  }

  async resume() {
    if (this.context?.state === 'suspended') {
      await this.context.resume();
    }
  }

  // ============================================================================
  // Getters
  // ============================================================================

  get isPlaying() {
    return this._isPlaying;
  }

  get isRecording() {
    return this._isRecording;
  }

  get currentTime() {
    if (!this._isPlaying) return this._currentTime;
    if (!this.context) return 0;
    return this.pausedAt + (this.context.currentTime - this.startTime);
  }

  get bpm() {
    return this._bpm;
  }

  // ============================================================================
  // Transport Controls
  // ============================================================================

  async play(project: JamzProject, fromTime?: number) {
    await this.resume();
    if (!this.context || !this.masterGain) return;

    this.stop(); // Stop any existing playback

    this._bpm = project.bpm;
    this.pausedAt = fromTime ?? this._currentTime;
    this.startTime = this.context.currentTime;
    this._isPlaying = true;

    // Schedule all clips
    for (const track of project.tracks) {
      if (track.muted) continue;

      // Create track audio nodes
      const gainNode = this.context.createGain();
      const panNode = this.context.createStereoPanner();

      gainNode.gain.value = track.volume;
      panNode.pan.value = track.pan;

      gainNode.connect(panNode);
      panNode.connect(this.masterGain);

      track.gainNode = gainNode;
      track.panNode = panNode;

      // Schedule clips
      for (const clip of track.clips) {
        if (clip.muted || !clip.audioBuffer) continue;

        const clipStartInProject = clip.startTime;
        const clipEndInProject = clip.startTime + clip.duration;

        // Skip clips that end before current position
        if (clipEndInProject <= this.pausedAt) continue;

        // Calculate when to start the clip
        const offsetInClip = Math.max(0, this.pausedAt - clipStartInProject);
        const when = Math.max(0, clipStartInProject - this.pausedAt);

        const source = this.context.createBufferSource();
        source.buffer = clip.audioBuffer;
        source.connect(gainNode);

        source.start(
          this.context.currentTime + when,
          offsetInClip,
          clip.duration - offsetInClip
        );

        this.scheduledSources.set(clip.id, source);
      }
    }

    this.notifyListeners();
  }

  pause() {
    if (!this._isPlaying) return;

    this._currentTime = this.currentTime;
    this.pausedAt = this._currentTime;
    this._isPlaying = false;

    // Stop all scheduled sources
    this.scheduledSources.forEach((source) => {
      try {
        source.stop();
      } catch {
        // Ignore errors if source already stopped
      }
    });
    this.scheduledSources.clear();

    this.notifyListeners();
  }

  stop() {
    this.pause();
    this._currentTime = 0;
    this.pausedAt = 0;
    this.notifyListeners();
  }

  seek(time: number) {
    const wasPlaying = this._isPlaying;
    this.pause();
    this._currentTime = Math.max(0, time);
    this.pausedAt = this._currentTime;
    this.notifyListeners();

    // Resume if was playing
    // Note: would need project reference to resume playback
  }

  // ============================================================================
  // Recording
  // ============================================================================

  async startRecording(): Promise<void> {
    if (this._isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
      this._isRecording = true;
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<AudioBuffer | null> {
    if (!this.mediaRecorder || !this._isRecording) return null;

    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = async () => {
        this._isRecording = false;
        this.notifyListeners();

        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const audioBuffer = await this.decodeBlob(blob);
        resolve(audioBuffer);

        // Clean up
        this.mediaRecorder?.stream.getTracks().forEach((t) => t.stop());
        this.mediaRecorder = null;
        this.recordedChunks = [];
      };

      this.mediaRecorder.stop();
    });
  }

  private async decodeBlob(blob: Blob): Promise<AudioBuffer | null> {
    if (!this.context) return null;

    try {
      const arrayBuffer = await blob.arrayBuffer();
      return await this.context.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error('Failed to decode audio:', error);
      return null;
    }
  }

  // ============================================================================
  // Audio Loading
  // ============================================================================

  async loadAudioFile(file: File): Promise<AudioBuffer | null> {
    await this.resume();
    if (!this.context) return null;

    try {
      const arrayBuffer = await file.arrayBuffer();
      return await this.context.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error('Failed to load audio file:', error);
      return null;
    }
  }

  async loadAudioUrl(url: string): Promise<AudioBuffer | null> {
    await this.resume();
    if (!this.context) return null;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await this.context.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error('Failed to load audio URL:', error);
      return null;
    }
  }

  // ============================================================================
  // Export
  // ============================================================================

  async exportToWav(project: JamzProject): Promise<Blob> {
    if (!this.context) throw new Error('Audio context not initialized');

    // Create offline context for rendering
    const sampleRate = 44100;
    const duration = project.duration || 60;
    const offlineContext = new OfflineAudioContext(
      2, // stereo
      sampleRate * duration,
      sampleRate
    );

    const masterGain = offlineContext.createGain();
    masterGain.connect(offlineContext.destination);

    // Schedule all clips for offline rendering
    for (const track of project.tracks) {
      if (track.muted) continue;

      const gainNode = offlineContext.createGain();
      const panNode = offlineContext.createStereoPanner();

      gainNode.gain.value = track.volume;
      panNode.pan.value = track.pan;

      gainNode.connect(panNode);
      panNode.connect(masterGain);

      for (const clip of track.clips) {
        if (clip.muted || !clip.audioBuffer) continue;

        const source = offlineContext.createBufferSource();
        source.buffer = clip.audioBuffer;
        source.connect(gainNode);
        source.start(clip.startTime, 0, clip.duration);
      }
    }

    // Render
    const renderedBuffer = await offlineContext.startRendering();

    // Convert to WAV
    return this.bufferToWav(renderedBuffer);
  }

  private bufferToWav(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const dataLength = buffer.length * blockAlign;
    const bufferLength = 44 + dataLength;

    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, bufferLength - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);

    // Audio data
    const channels: Float32Array[] = [];
    for (let i = 0; i < numChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        const sample = Math.max(-1, Math.min(1, channels[ch][i]));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  // ============================================================================
  // Analysis
  // ============================================================================

  getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(0);

    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  getWaveformData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(0);

    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  // ============================================================================
  // State Management
  // ============================================================================

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  // ============================================================================
  // Cleanup
  // ============================================================================

  dispose() {
    this.stop();
    if (this.context && this.context.state !== 'closed') {
      this.context.close();
    }
    this.context = null;
    this.masterGain = null;
    this.analyser = null;
    this.listeners.clear();
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let engineInstance: JamzAudioEngine | null = null;

export function getJamzEngine(): JamzAudioEngine {
  if (!engineInstance) {
    engineInstance = new JamzAudioEngine();
  }
  return engineInstance;
}

// ============================================================================
// Helper Functions
// ============================================================================

export function createEmptyProject(name = 'Untitled'): JamzProject {
  return {
    id: `project_${Date.now()}`,
    name,
    bpm: 120,
    timeSignature: [4, 4],
    tracks: [],
    duration: 60, // Default 60 seconds
  };
}

export function createTrack(
  name: string,
  type: AudioTrack['type'] = 'audio',
  color = '#8B5CF6'
): AudioTrack {
  return {
    id: `track_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    name,
    type,
    color,
    volume: 0.8,
    pan: 0,
    muted: false,
    solo: false,
    armed: false,
    clips: [],
  };
}

export function createClip(
  trackId: string,
  name: string,
  startTime: number,
  duration: number,
  audioBuffer: AudioBuffer | null,
  color = '#8B5CF6'
): AudioClip {
  return {
    id: `clip_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    trackId,
    name,
    startTime,
    duration,
    audioBuffer,
    color,
    muted: false,
  };
}

// Generate color palette for tracks
const TRACK_COLORS = [
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
];

export function getTrackColor(index: number): string {
  return TRACK_COLORS[index % TRACK_COLORS.length];
}
