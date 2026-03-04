'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useMusic } from '@/context/MusicContext';

export interface AudioAnalysisData {
  // Raw frequency data (0-255 values)
  frequencyData: Uint8Array;
  // Normalized bands (0-1 values)
  bass: number;      // 20-150 Hz
  lowMid: number;    // 150-500 Hz
  mid: number;       // 500-2000 Hz
  highMid: number;   // 2000-4000 Hz
  treble: number;    // 4000-20000 Hz
  // Overall energy
  energy: number;    // 0-1 average of all frequencies
  // Beat detection
  isBeat: boolean;   // True when bass spike detected
  beatIntensity: number; // 0-1 how strong the beat is
  // Time domain (waveform)
  waveformData: Uint8Array;
}

interface UseAudioAnalyzerOptions {
  fftSize?: number;           // Power of 2, affects frequency resolution
  smoothingTimeConstant?: number; // 0-1, higher = smoother
  beatThreshold?: number;     // Sensitivity for beat detection
  beatDecay?: number;         // How fast beat intensity decays
}

const defaultOptions: Required<UseAudioAnalyzerOptions> = {
  fftSize: 256,
  smoothingTimeConstant: 0.8,
  beatThreshold: 1.3,
  beatDecay: 0.95,
};

// Singleton audio context to avoid multiple connections
let globalAudioContext: AudioContext | null = null;
let globalAnalyser: AnalyserNode | null = null;
let globalSource: MediaElementAudioSourceNode | null = null;
let connectedAudioElement: HTMLAudioElement | null = null;

export function useAudioAnalyzer(options: UseAudioAnalyzerOptions = {}) {
  const { audioRef, isPlaying } = useMusic();
  const opts = { ...defaultOptions, ...options };

  const [isInitialized, setIsInitialized] = useState(false);
  const [analysisData, setAnalysisData] = useState<AudioAnalysisData>({
    frequencyData: new Uint8Array(opts.fftSize / 2),
    bass: 0,
    lowMid: 0,
    mid: 0,
    highMid: 0,
    treble: 0,
    energy: 0,
    isBeat: false,
    beatIntensity: 0,
    waveformData: new Uint8Array(opts.fftSize / 2),
  });

  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastBassRef = useRef(0);
  const beatIntensityRef = useRef(0);
  const frequencyDataRef = useRef(new Uint8Array(opts.fftSize / 2));
  const waveformDataRef = useRef(new Uint8Array(opts.fftSize / 2));

  // Initialize audio context and analyser
  const initializeAnalyser = useCallback(() => {
    if (!audioRef.current) return false;

    // Check if already connected to this audio element
    if (connectedAudioElement === audioRef.current && globalAnalyser) {
      setIsInitialized(true);
      return true;
    }

    try {
      // Create or resume audio context
      if (!globalAudioContext) {
        globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (globalAudioContext.state === 'suspended') {
        globalAudioContext.resume();
      }

      // Create analyser node
      if (!globalAnalyser) {
        globalAnalyser = globalAudioContext.createAnalyser();
        globalAnalyser.fftSize = opts.fftSize;
        globalAnalyser.smoothingTimeConstant = opts.smoothingTimeConstant;
      }

      // Connect audio element if not already connected
      if (connectedAudioElement !== audioRef.current) {
        // Disconnect old source if exists
        if (globalSource) {
          try {
            globalSource.disconnect();
          } catch (e) {
            // Ignore disconnect errors
          }
        }

        // Create new source and connect
        globalSource = globalAudioContext.createMediaElementSource(audioRef.current);
        globalSource.connect(globalAnalyser);
        globalAnalyser.connect(globalAudioContext.destination);
        connectedAudioElement = audioRef.current;
      }

      // Update buffer sizes
      frequencyDataRef.current = new Uint8Array(globalAnalyser.frequencyBinCount);
      waveformDataRef.current = new Uint8Array(globalAnalyser.frequencyBinCount);

      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('Failed to initialize audio analyser:', error);
      return false;
    }
  }, [audioRef, opts.fftSize, opts.smoothingTimeConstant]);

  // Calculate frequency band averages
  const getFrequencyBands = useCallback((data: Uint8Array) => {
    const binCount = data.length;
    const sampleRate = globalAudioContext?.sampleRate || 44100;
    const nyquist = sampleRate / 2;
    const binFrequency = nyquist / binCount;

    // Calculate bin indices for each frequency band
    const bassEnd = Math.floor(150 / binFrequency);
    const lowMidEnd = Math.floor(500 / binFrequency);
    const midEnd = Math.floor(2000 / binFrequency);
    const highMidEnd = Math.floor(4000 / binFrequency);

    const getAverage = (start: number, end: number) => {
      let sum = 0;
      const count = Math.max(1, end - start);
      for (let i = start; i < Math.min(end, binCount); i++) {
        sum += data[i];
      }
      return sum / count / 255; // Normalize to 0-1
    };

    return {
      bass: getAverage(0, bassEnd),
      lowMid: getAverage(bassEnd, lowMidEnd),
      mid: getAverage(lowMidEnd, midEnd),
      highMid: getAverage(midEnd, highMidEnd),
      treble: getAverage(highMidEnd, binCount),
    };
  }, []);

  // Animation loop for analysis
  const analyze = useCallback(() => {
    if (!globalAnalyser || !isPlaying) {
      animationFrameRef.current = requestAnimationFrame(analyze);
      return;
    }

    // Get frequency data
    globalAnalyser.getByteFrequencyData(frequencyDataRef.current);
    globalAnalyser.getByteTimeDomainData(waveformDataRef.current);

    const bands = getFrequencyBands(frequencyDataRef.current);

    // Calculate overall energy
    let totalEnergy = 0;
    for (let i = 0; i < frequencyDataRef.current.length; i++) {
      totalEnergy += frequencyDataRef.current[i];
    }
    const energy = totalEnergy / (frequencyDataRef.current.length * 255);

    // Beat detection (bass spike detection)
    const bassThreshold = lastBassRef.current * opts.beatThreshold;
    const isBeat = bands.bass > bassThreshold && bands.bass > 0.3;

    if (isBeat) {
      beatIntensityRef.current = Math.min(1, bands.bass * 1.5);
    } else {
      beatIntensityRef.current *= opts.beatDecay;
    }

    lastBassRef.current = bands.bass;

    setAnalysisData({
      frequencyData: new Uint8Array(frequencyDataRef.current),
      waveformData: new Uint8Array(waveformDataRef.current),
      ...bands,
      energy,
      isBeat,
      beatIntensity: beatIntensityRef.current,
    });

    animationFrameRef.current = requestAnimationFrame(analyze);
  }, [isPlaying, getFrequencyBands, opts.beatThreshold, opts.beatDecay]);

  // Start/stop analysis based on playing state
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const success = initializeAnalyser();
      if (success) {
        animationFrameRef.current = requestAnimationFrame(analyze);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, audioRef, initializeAnalyser, analyze]);

  // Manual initialization trigger (for user gesture requirement)
  const initialize = useCallback(() => {
    return initializeAnalyser();
  }, [initializeAnalyser]);

  return {
    analysisData,
    isInitialized,
    initialize,
    isPlaying,
  };
}

// Utility functions for common audio-reactive transformations
export const audioReactiveUtils = {
  // Pulse scale based on beat
  pulseScale: (baseScale: number, beatIntensity: number, strength: number = 0.3) => {
    return baseScale * (1 + beatIntensity * strength);
  },

  // Color shift based on frequency
  frequencyToHue: (frequency: number, baseHue: number = 0) => {
    return (baseHue + frequency * 360) % 360;
  },

  // Position offset based on waveform
  waveformOffset: (waveformData: Uint8Array, index: number, strength: number = 1) => {
    const value = waveformData[index % waveformData.length] || 128;
    return ((value - 128) / 128) * strength;
  },

  // Smooth lerp with audio reactivity
  audioLerp: (current: number, target: number, speed: number, energy: number) => {
    const adjustedSpeed = speed * (1 + energy);
    return current + (target - current) * Math.min(1, adjustedSpeed);
  },

  // Generate color from frequency bands
  bandsToColor: (bass: number, mid: number, treble: number) => {
    const r = Math.floor(bass * 255);
    const g = Math.floor(mid * 255);
    const b = Math.floor(treble * 255);
    return `rgb(${r}, ${g}, ${b})`;
  },

  // Convert bands to THREE.js color values
  bandsToRGB: (bass: number, mid: number, treble: number) => ({
    r: bass,
    g: mid,
    b: treble,
  }),
};
