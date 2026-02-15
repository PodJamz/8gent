'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { useAudioAnalyzer, type AudioAnalysisData } from '@/hooks/useAudioAnalyzer';

interface AudioReactiveContextType {
  // Audio state
  isEnabled: boolean;
  isInitialized: boolean;
  isPlaying: boolean;
  analysisData: AudioAnalysisData;

  // Controls
  enableAudioReactivity: () => void;
  disableAudioReactivity: () => void;
  toggleAudioReactivity: () => void;

  // Settings
  reactivityStrength: number;
  setReactivityStrength: (strength: number) => void;
}

const defaultAnalysisData: AudioAnalysisData = {
  frequencyData: new Uint8Array(128),
  waveformData: new Uint8Array(128),
  bass: 0,
  lowMid: 0,
  mid: 0,
  highMid: 0,
  treble: 0,
  energy: 0,
  isBeat: false,
  beatIntensity: 0,
};

const AudioReactiveContext = createContext<AudioReactiveContextType>({
  isEnabled: false,
  isInitialized: false,
  isPlaying: false,
  analysisData: defaultAnalysisData,
  enableAudioReactivity: () => {},
  disableAudioReactivity: () => {},
  toggleAudioReactivity: () => {},
  reactivityStrength: 1,
  setReactivityStrength: () => {},
});

export function AudioReactiveProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [reactivityStrength, setReactivityStrength] = useState(1);

  const { analysisData, isInitialized, initialize, isPlaying } = useAudioAnalyzer({
    fftSize: 256,
    smoothingTimeConstant: 0.8,
    beatThreshold: 1.4,
    beatDecay: 0.92,
  });

  const enableAudioReactivity = useCallback(() => {
    const success = initialize();
    if (success) {
      setIsEnabled(true);
    }
  }, [initialize]);

  const disableAudioReactivity = useCallback(() => {
    setIsEnabled(false);
  }, []);

  const toggleAudioReactivity = useCallback(() => {
    if (isEnabled) {
      disableAudioReactivity();
    } else {
      enableAudioReactivity();
    }
  }, [isEnabled, enableAudioReactivity, disableAudioReactivity]);

  // Provide either real data or zeros based on enabled state
  const effectiveAnalysisData = isEnabled && isPlaying ? analysisData : defaultAnalysisData;

  return (
    <AudioReactiveContext.Provider
      value={{
        isEnabled,
        isInitialized,
        isPlaying,
        analysisData: effectiveAnalysisData,
        enableAudioReactivity,
        disableAudioReactivity,
        toggleAudioReactivity,
        reactivityStrength,
        setReactivityStrength,
      }}
    >
      {children}
    </AudioReactiveContext.Provider>
  );
}

export function useAudioReactive() {
  const context = useContext(AudioReactiveContext);
  if (!context) {
    throw new Error('useAudioReactive must be used within an AudioReactiveProvider');
  }
  return context;
}

// Utility hook for common audio-reactive values
export function useAudioReactiveValues() {
  const { analysisData, isEnabled, reactivityStrength } = useAudioReactive();

  return {
    // Scaled values based on reactivity strength
    bass: analysisData.bass * reactivityStrength,
    mid: analysisData.mid * reactivityStrength,
    treble: analysisData.treble * reactivityStrength,
    energy: analysisData.energy * reactivityStrength,
    beatIntensity: analysisData.beatIntensity * reactivityStrength,
    isBeat: analysisData.isBeat && isEnabled,

    // Raw values
    raw: analysisData,
    isEnabled,
    reactivityStrength,
  };
}

// Audio-reactive toggle button component
export function AudioReactiveToggle({ className = '' }: { className?: string }) {
  const { isEnabled, isPlaying, toggleAudioReactivity } = useAudioReactive();

  return (
    <button
      onClick={toggleAudioReactivity}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        transition-all duration-200
        ${isEnabled
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
        }
        ${!isPlaying ? 'opacity-50' : ''}
        ${className}
      `}
      title={isPlaying ? 'Toggle audio reactivity' : 'Play music to enable audio reactivity'}
    >
      {/* Sound wave icon */}
      <svg
        className={`w-5 h-5 ${isEnabled && isPlaying ? 'animate-pulse' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={isEnabled
            ? "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            : "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          }
        />
      </svg>
      <span className="text-sm font-medium">
        {isEnabled ? 'Audio On' : 'Audio Off'}
      </span>
      {isEnabled && isPlaying && (
        <span className="flex gap-0.5">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-1 bg-white rounded-full animate-bounce"
              style={{
                height: `${8 + Math.random() * 8}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.5s',
              }}
            />
          ))}
        </span>
      )}
    </button>
  );
}

// Audio visualizer bars component
export function AudioVisualizerBars({ className = '', barCount = 16 }: { className?: string; barCount?: number }) {
  const { analysisData, isEnabled, isPlaying } = useAudioReactive();

  if (!isEnabled || !isPlaying) {
    return null;
  }

  const step = Math.floor(analysisData.frequencyData.length / barCount);

  return (
    <div className={`flex items-end gap-0.5 h-8 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => {
        const value = analysisData.frequencyData[i * step] || 0;
        const height = (value / 255) * 100;

        return (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full transition-all duration-75"
            style={{ height: `${Math.max(4, height)}%` }}
          />
        );
      })}
    </div>
  );
}
