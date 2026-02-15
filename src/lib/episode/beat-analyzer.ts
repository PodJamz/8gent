// =============================================================================
// Beat Analyzer - Audio Analysis for Episode Production
// =============================================================================
// Extracts beat timestamps, classifies percussion, detects song structure.
// Supports Web Audio API (browser), Python via Lynkr (local), and hybrid.
// =============================================================================

import type {
  Beat,
  BeatMap,
  BeatType,
  BeatAnalysisConfig,
  EnergyPoint,
  SongSection,
  SongSectionType,
  DEFAULT_BEAT_ANALYSIS_CONFIG,
} from './types';

// Re-export the default config
export { DEFAULT_BEAT_ANALYSIS_CONFIG } from './types';

// -----------------------------------------------------------------------------
// Web Audio API Beat Analysis (Browser-side)
// -----------------------------------------------------------------------------

/**
 * Analyze audio using Web Audio API for beat detection.
 * Works in the browser without any external dependencies.
 * Less accurate than Python-based approaches but instant.
 */
export async function analyzeBeatsWebAudio(
  audioBuffer: AudioBuffer,
  config: BeatAnalysisConfig = {
    method: 'web-audio',
    onsetThreshold: 0.3,
    classifyBeats: true,
    detectSections: true,
    frequencyRanges: {
      kick: [20, 150],
      snare: [150, 1000],
      hihat: [3000, 16000],
    },
  }
): Promise<BeatMap> {
  const sampleRate = audioBuffer.sampleRate;
  const channelData = audioBuffer.getChannelData(0); // Mono or left channel
  const durationMs = (audioBuffer.duration * 1000) | 0;

  // Step 1: Compute onset detection function via spectral flux
  const onsets = detectOnsets(channelData, sampleRate, config.onsetThreshold);

  // Step 2: Estimate BPM from onset intervals
  const bpm = estimateBPM(onsets, durationMs);

  // Step 3: Build beat grid from BPM
  const beatGrid = buildBeatGrid(bpm, durationMs);

  // Step 4: Classify beats by frequency content (kick/snare/hihat)
  const classifiedBeats = config.classifyBeats
    ? classifyBeats(beatGrid, channelData, sampleRate, config.frequencyRanges)
    : beatGrid;

  // Step 5: Detect song sections by energy changes
  const energyCurve = computeEnergyCurve(channelData, sampleRate);
  const sections = config.detectSections
    ? detectSections(energyCurve, classifiedBeats, durationMs)
    : [];

  return {
    songId: '',
    bpm,
    timeSignature: '4/4',
    durationMs,
    beats: classifiedBeats,
    sections,
    energyCurve,
    analysis: {
      method: 'web-audio',
      confidence: 0.7, // Web Audio is less precise
      analyzedAt: new Date().toISOString(),
    },
  };
}

// -----------------------------------------------------------------------------
// Onset Detection via Spectral Flux
// -----------------------------------------------------------------------------

interface Onset {
  timeMs: number;
  intensity: number;
}

/**
 * Detect audio onsets using spectral flux.
 * Compares FFT frames to find moments where energy increases suddenly.
 */
function detectOnsets(
  channelData: Float32Array,
  sampleRate: number,
  threshold: number
): Onset[] {
  const frameSize = 1024;
  const hopSize = 512;
  const numFrames = Math.floor((channelData.length - frameSize) / hopSize);
  const onsets: Onset[] = [];

  let prevSpectrum: Float64Array | null = null;

  for (let i = 0; i < numFrames; i++) {
    const start = i * hopSize;
    const frame = channelData.slice(start, start + frameSize);

    // Apply Hanning window
    const windowed = applyHanningWindow(frame);

    // Compute magnitude spectrum (simplified FFT approximation using energy bands)
    const spectrum = computeEnergyBands(windowed, sampleRate);

    if (prevSpectrum) {
      // Spectral flux: sum of positive differences between frames
      let flux = 0;
      for (let j = 0; j < spectrum.length; j++) {
        const diff = spectrum[j] - prevSpectrum[j];
        if (diff > 0) flux += diff;
      }

      // Normalize flux
      const normalizedFlux = Math.min(flux / 10, 1);

      if (normalizedFlux > threshold) {
        const timeMs = ((start + frameSize / 2) / sampleRate) * 1000;
        onsets.push({ timeMs, intensity: normalizedFlux });
      }
    }

    prevSpectrum = spectrum;
  }

  // Merge onsets that are too close together (within 50ms)
  return mergeCloseOnsets(onsets, 50);
}

function applyHanningWindow(frame: Float32Array): Float32Array {
  const windowed = new Float32Array(frame.length);
  for (let i = 0; i < frame.length; i++) {
    const multiplier = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (frame.length - 1)));
    windowed[i] = frame[i] * multiplier;
  }
  return windowed;
}

/**
 * Simplified energy band computation.
 * Splits signal into frequency bands and computes energy per band.
 */
function computeEnergyBands(frame: Float32Array, sampleRate: number): Float64Array {
  const numBands = 16;
  const bands = new Float64Array(numBands);
  const bandSize = Math.floor(frame.length / numBands);

  for (let b = 0; b < numBands; b++) {
    let energy = 0;
    for (let i = b * bandSize; i < (b + 1) * bandSize && i < frame.length; i++) {
      energy += frame[i] * frame[i];
    }
    bands[b] = Math.sqrt(energy / bandSize);
  }

  return bands;
}

function mergeCloseOnsets(onsets: Onset[], minGapMs: number): Onset[] {
  if (onsets.length === 0) return [];

  const merged: Onset[] = [onsets[0]];
  for (let i = 1; i < onsets.length; i++) {
    const last = merged[merged.length - 1];
    if (onsets[i].timeMs - last.timeMs < minGapMs) {
      // Keep the stronger onset
      if (onsets[i].intensity > last.intensity) {
        merged[merged.length - 1] = onsets[i];
      }
    } else {
      merged.push(onsets[i]);
    }
  }
  return merged;
}

// -----------------------------------------------------------------------------
// BPM Estimation
// -----------------------------------------------------------------------------

/**
 * Estimate BPM from onset intervals using autocorrelation of inter-onset intervals.
 */
function estimateBPM(onsets: Onset[], durationMs: number): number {
  if (onsets.length < 4) return 120; // Default fallback

  // Calculate inter-onset intervals
  const intervals: number[] = [];
  for (let i = 1; i < onsets.length; i++) {
    intervals.push(onsets[i].timeMs - onsets[i - 1].timeMs);
  }

  // Build histogram of intervals (quantized to 10ms bins)
  // Focus on musically plausible range: 60-200 BPM → 300-1000ms intervals
  const minInterval = 300; // 200 BPM
  const maxInterval = 1000; // 60 BPM
  const binSize = 10;
  const numBins = Math.ceil((maxInterval - minInterval) / binSize);
  const histogram = new Float64Array(numBins);

  for (const interval of intervals) {
    if (interval >= minInterval && interval <= maxInterval) {
      const bin = Math.floor((interval - minInterval) / binSize);
      if (bin >= 0 && bin < numBins) {
        histogram[bin] += 1;
      }
    }
    // Also check half and double intervals (sub-beats, half-time)
    const half = interval / 2;
    if (half >= minInterval && half <= maxInterval) {
      const bin = Math.floor((half - minInterval) / binSize);
      if (bin >= 0 && bin < numBins) histogram[bin] += 0.5;
    }
    const dbl = interval * 2;
    if (dbl >= minInterval && dbl <= maxInterval) {
      const bin = Math.floor((dbl - minInterval) / binSize);
      if (bin >= 0 && bin < numBins) histogram[bin] += 0.5;
    }
  }

  // Find the peak bin
  let maxBin = 0;
  let maxCount = 0;
  for (let i = 0; i < numBins; i++) {
    if (histogram[i] > maxCount) {
      maxCount = histogram[i];
      maxBin = i;
    }
  }

  const dominantIntervalMs = minInterval + maxBin * binSize + binSize / 2;
  const bpm = Math.round((60000 / dominantIntervalMs) * 10) / 10;

  // Clamp to reasonable range
  return Math.max(60, Math.min(200, bpm));
}

// -----------------------------------------------------------------------------
// Beat Grid Construction
// -----------------------------------------------------------------------------

/**
 * Build a regular beat grid from BPM, assuming 4/4 time.
 */
function buildBeatGrid(bpm: number, durationMs: number): Beat[] {
  const beatIntervalMs = 60000 / bpm;
  const beats: Beat[] = [];
  let measure = 1;
  let beatInMeasure = 1;

  for (let timeMs = 0; timeMs < durationMs; timeMs += beatIntervalMs) {
    beats.push({
      timeMs: Math.round(timeMs * 100) / 100,
      type: 'other',
      intensity: beatInMeasure === 1 ? 0.9 : beatInMeasure === 3 ? 0.7 : 0.5,
      isDownbeat: beatInMeasure === 1,
      measure,
      beatInMeasure,
    });

    beatInMeasure++;
    if (beatInMeasure > 4) {
      beatInMeasure = 1;
      measure++;
    }
  }

  return beats;
}

// -----------------------------------------------------------------------------
// Beat Classification by Frequency
// -----------------------------------------------------------------------------

/**
 * Classify beats as kick/snare/hihat by analyzing frequency content at each beat time.
 */
function classifyBeats(
  beats: Beat[],
  channelData: Float32Array,
  sampleRate: number,
  frequencyRanges: { kick: [number, number]; snare: [number, number]; hihat: [number, number] }
): Beat[] {
  const windowSize = 1024;

  return beats.map((beat) => {
    const sampleIndex = Math.floor((beat.timeMs / 1000) * sampleRate);
    const start = Math.max(0, sampleIndex - windowSize / 2);
    const end = Math.min(channelData.length, start + windowSize);
    const frame = channelData.slice(start, end);

    if (frame.length < windowSize / 2) return beat;

    // Compute energy in each frequency range
    const kickEnergy = computeBandEnergy(frame, sampleRate, frequencyRanges.kick);
    const snareEnergy = computeBandEnergy(frame, sampleRate, frequencyRanges.snare);
    const hihatEnergy = computeBandEnergy(frame, sampleRate, frequencyRanges.hihat);

    const maxEnergy = Math.max(kickEnergy, snareEnergy, hihatEnergy);
    if (maxEnergy < 0.01) return beat;

    let type: BeatType = 'other';
    if (kickEnergy === maxEnergy) type = 'kick';
    else if (snareEnergy === maxEnergy) type = 'snare';
    else if (hihatEnergy === maxEnergy) type = 'hihat';

    // In standard 4/4: beats 1,3 tend to be kick, beats 2,4 tend to be snare
    // Use this as a prior to improve classification
    if (beat.beatInMeasure === 1 || beat.beatInMeasure === 3) {
      if (kickEnergy > snareEnergy * 0.5) type = 'kick';
    } else if (beat.beatInMeasure === 2 || beat.beatInMeasure === 4) {
      if (snareEnergy > kickEnergy * 0.5) type = 'snare';
    }

    return { ...beat, type, intensity: Math.min(maxEnergy * 10, 1) };
  });
}

/**
 * Compute energy in a specific frequency band using time-domain bandpass approximation.
 */
function computeBandEnergy(
  frame: Float32Array,
  sampleRate: number,
  [lowHz, highHz]: [number, number]
): number {
  // Simple energy computation weighted by frequency band
  // For proper implementation, we'd use FFT. This is an approximation
  // that works for broad classification.
  const lowBin = Math.floor((lowHz / sampleRate) * frame.length);
  const highBin = Math.floor((highHz / sampleRate) * frame.length);

  let energy = 0;
  const bandStart = Math.max(0, lowBin);
  const bandEnd = Math.min(frame.length, highBin);

  for (let i = bandStart; i < bandEnd; i++) {
    energy += frame[i] * frame[i];
  }

  return Math.sqrt(energy / Math.max(1, bandEnd - bandStart));
}

// -----------------------------------------------------------------------------
// Energy Curve Computation
// -----------------------------------------------------------------------------

/**
 * Compute an energy curve over time for visualizing track dynamics.
 * Returns energy samples at ~10ms intervals.
 */
function computeEnergyCurve(
  channelData: Float32Array,
  sampleRate: number
): EnergyPoint[] {
  const windowMs = 100; // 100ms windows
  const hopMs = 50; // 50ms hop
  const windowSamples = Math.floor((windowMs / 1000) * sampleRate);
  const hopSamples = Math.floor((hopMs / 1000) * sampleRate);
  const points: EnergyPoint[] = [];

  let maxRMS = 0;

  // First pass: compute all RMS values
  const rmsValues: { timeMs: number; rms: number }[] = [];
  for (let i = 0; i < channelData.length - windowSamples; i += hopSamples) {
    let sum = 0;
    for (let j = i; j < i + windowSamples; j++) {
      sum += channelData[j] * channelData[j];
    }
    const rms = Math.sqrt(sum / windowSamples);
    const timeMs = ((i + windowSamples / 2) / sampleRate) * 1000;
    rmsValues.push({ timeMs, rms });
    if (rms > maxRMS) maxRMS = rms;
  }

  // Second pass: normalize
  for (const { timeMs, rms } of rmsValues) {
    points.push({
      timeMs: Math.round(timeMs),
      energy: maxRMS > 0 ? rms / maxRMS : 0,
    });
  }

  return points;
}

// -----------------------------------------------------------------------------
// Song Section Detection
// -----------------------------------------------------------------------------

/**
 * Detect song sections (verse, chorus, bridge) from energy curve changes.
 * Uses energy transitions and structural repetition to identify boundaries.
 */
function detectSections(
  energyCurve: EnergyPoint[],
  beats: Beat[],
  durationMs: number
): SongSection[] {
  if (energyCurve.length === 0) return [];

  // Smooth the energy curve
  const smoothed = smoothEnergy(energyCurve, 20);

  // Find significant energy transitions
  const transitions = findEnergyTransitions(smoothed);

  // Snap transitions to nearest downbeat
  const snappedTransitions = transitions.map((t) => {
    const nearest = beats.reduce((best, beat) => {
      if (!beat.isDownbeat) return best;
      return Math.abs(beat.timeMs - t) < Math.abs(best - t) ? beat.timeMs : best;
    }, t);
    return nearest;
  });

  // Build sections from transitions
  const boundaries = [0, ...snappedTransitions, durationMs];
  const sections: SongSection[] = [];

  // Track section type counts for labeling
  const typeCounts: Record<string, number> = {};

  for (let i = 0; i < boundaries.length - 1; i++) {
    const startMs = boundaries[i];
    const endMs = boundaries[i + 1];

    // Get average energy for this section
    const sectionEnergy = smoothed
      .filter((p) => p.timeMs >= startMs && p.timeMs <= endMs)
      .reduce((sum, p) => sum + p.energy, 0);
    const avgEnergy =
      sectionEnergy /
      Math.max(
        1,
        smoothed.filter((p) => p.timeMs >= startMs && p.timeMs <= endMs).length
      );

    // Classify section type by position and energy
    const type = classifySectionType(i, boundaries.length - 1, avgEnergy, endMs - startMs);

    typeCounts[type] = (typeCounts[type] || 0) + 1;
    const label = `${type}${typeCounts[type] > 1 ? typeCounts[type] : ''}`;

    sections.push({
      type,
      startMs: Math.round(startMs),
      endMs: Math.round(endMs),
      label,
      energy: Math.round(avgEnergy * 100) / 100,
    });
  }

  return sections;
}

function smoothEnergy(curve: EnergyPoint[], windowSize: number): EnergyPoint[] {
  return curve.map((point, i) => {
    const start = Math.max(0, i - windowSize);
    const end = Math.min(curve.length, i + windowSize + 1);
    let sum = 0;
    for (let j = start; j < end; j++) sum += curve[j].energy;
    return { timeMs: point.timeMs, energy: sum / (end - start) };
  });
}

function findEnergyTransitions(smoothed: EnergyPoint[]): number[] {
  const transitions: number[] = [];
  const changeThreshold = 0.15; // 15% energy change = new section

  for (let i = 1; i < smoothed.length; i++) {
    const change = Math.abs(smoothed[i].energy - smoothed[i - 1].energy);
    if (change > changeThreshold) {
      // Don't add transitions too close together (min 4 seconds apart)
      const lastTransition = transitions[transitions.length - 1];
      if (!lastTransition || smoothed[i].timeMs - lastTransition > 4000) {
        transitions.push(smoothed[i].timeMs);
      }
    }
  }

  return transitions;
}

function classifySectionType(
  index: number,
  totalSections: number,
  energy: number,
  durationMs: number
): SongSectionType {
  // First section with low energy = intro
  if (index === 0 && energy < 0.4 && durationMs < 15000) return 'intro';

  // Last section with decreasing energy = outro
  if (index === totalSections - 1 && energy < 0.5 && durationMs < 15000) return 'outro';

  // High energy sections = chorus
  if (energy > 0.7) return 'chorus';

  // Medium energy = verse
  if (energy > 0.3) return 'verse';

  // Low energy in the middle = bridge or break
  if (energy <= 0.3) {
    return durationMs < 8000 ? 'break' : 'bridge';
  }

  return 'verse';
}

// -----------------------------------------------------------------------------
// Lynkr/Python Beat Analysis (via API)
// -----------------------------------------------------------------------------

interface LynkrBeatResponse {
  bpm: number;
  beats: Array<{
    time: number;
    type: string;
    intensity: number;
  }>;
  sections: Array<{
    type: string;
    start: number;
    end: number;
    label: string;
  }>;
  downbeats: number[];
}

/**
 * Analyze audio using Python (librosa/madmom) via Lynkr proxy.
 * Much more accurate than Web Audio API but requires local infrastructure.
 */
export async function analyzeBeatsLynkr(
  audioUrl: string,
  lynkrUrl: string,
  apiKey: string
): Promise<BeatMap> {
  const response = await fetch(`${lynkrUrl}/v1/audio/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      analysis_type: 'full', // beats + sections + energy
      backend: 'madmom', // or 'librosa'
    }),
  });

  if (!response.ok) {
    throw new Error(`Lynkr beat analysis failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as LynkrBeatResponse;

  // Convert Lynkr response to our BeatMap format
  const beats: Beat[] = data.beats.map((b, i) => {
    const beatInMeasure = (i % 4) + 1;
    const measure = Math.floor(i / 4) + 1;
    return {
      timeMs: b.time * 1000,
      type: (b.type as BeatType) || 'other',
      intensity: b.intensity,
      isDownbeat: data.downbeats.includes(b.time) || beatInMeasure === 1,
      measure,
      beatInMeasure,
    };
  });

  const sections: SongSection[] = data.sections.map((s) => ({
    type: s.type as SongSectionType,
    startMs: s.start * 1000,
    endMs: s.end * 1000,
    label: s.label,
    energy: 0.5, // Will be computed from audio
  }));

  const lastBeat = beats[beats.length - 1];

  return {
    songId: '',
    bpm: data.bpm,
    timeSignature: '4/4',
    durationMs: lastBeat ? lastBeat.timeMs + 60000 / data.bpm : 0,
    beats,
    sections,
    energyCurve: [], // Computed separately
    analysis: {
      method: 'madmom',
      confidence: 0.9,
      analyzedAt: new Date().toISOString(),
    },
  };
}

// -----------------------------------------------------------------------------
// Utility Functions
// -----------------------------------------------------------------------------

/**
 * Find the nearest beat to a given timestamp.
 */
export function findNearestBeat(beats: Beat[], timeMs: number): Beat | null {
  if (beats.length === 0) return null;

  let nearest = beats[0];
  let minDist = Math.abs(beats[0].timeMs - timeMs);

  for (const beat of beats) {
    const dist = Math.abs(beat.timeMs - timeMs);
    if (dist < minDist) {
      minDist = dist;
      nearest = beat;
    }
  }

  return nearest;
}

/**
 * Get all beats of a specific type within a time range.
 */
export function getBeatsInRange(
  beats: Beat[],
  startMs: number,
  endMs: number,
  type?: BeatType
): Beat[] {
  return beats.filter(
    (b) =>
      b.timeMs >= startMs &&
      b.timeMs <= endMs &&
      (type === undefined || b.type === type)
  );
}

/**
 * Get downbeats (first beat of each measure) within a range.
 */
export function getDownbeatsInRange(
  beats: Beat[],
  startMs: number,
  endMs: number
): Beat[] {
  return beats.filter((b) => b.timeMs >= startMs && b.timeMs <= endMs && b.isDownbeat);
}

/**
 * Calculate the time between beats at a given BPM.
 */
export function beatIntervalMs(bpm: number): number {
  return 60000 / bpm;
}

/**
 * Snap a timestamp to the nearest beat grid position.
 */
export function snapToGrid(timeMs: number, bpm: number, thresholdMs: number = 50): number {
  const interval = beatIntervalMs(bpm);
  const nearestBeat = Math.round(timeMs / interval) * interval;
  return Math.abs(nearestBeat - timeMs) <= thresholdMs ? nearestBeat : timeMs;
}

/**
 * Convert a BeatMap to a simplified array of beat timestamps for quick use.
 */
export function beatTimestamps(beatMap: BeatMap, type?: BeatType): number[] {
  const filtered = type ? beatMap.beats.filter((b) => b.type === type) : beatMap.beats;
  return filtered.map((b) => b.timeMs);
}

/**
 * Merge a manual annotation into an existing beat map.
 * Used when James corrects beat classifications.
 */
export function annotateBeat(
  beatMap: BeatMap,
  timeMs: number,
  type: BeatType
): BeatMap {
  const nearest = findNearestBeat(beatMap.beats, timeMs);
  if (!nearest) return beatMap;

  const updatedBeats = beatMap.beats.map((b) =>
    b.timeMs === nearest.timeMs ? { ...b, type } : b
  );

  return {
    ...beatMap,
    beats: updatedBeats,
    analysis: {
      ...beatMap.analysis,
      method: 'hybrid',
    },
  };
}
