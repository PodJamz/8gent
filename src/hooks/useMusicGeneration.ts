/**
 * useMusicGeneration Hook
 *
 * Provides music generation capabilities via local ACE-Step through Lynkr tunnel.
 * Handles generation, analysis, and stem separation with progress tracking.
 * Persists jobs and tracks to Convex for history and library features.
 */

import { useState, useCallback, useRef } from 'react';
import { useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import { Id } from '../../convex/_generated/dataModel';

// ============================================================================
// Types
// ============================================================================

export interface MusicGenerateParams {
  prompt: string;
  lyrics?: string;
  duration?: number; // 10-600 seconds
  bpm?: number; // 30-300
  key?: string; // e.g., "C major", "A minor"
  timeSignature?: string; // e.g., "4/4", "3/4", "6/8"
  referenceAudio?: string; // URL to reference audio (style transfer)
  referenceStrength?: number; // 0-1 (lower = lighter style transfer)
  model?: string;
  lmModel?: string;
  format?: 'mp3' | 'wav' | 'flac';
  title?: string;
  saveToJamz?: boolean;
  projectId?: string;
  // Full ACE-Step 1.5 parameter support
  vocalLanguage?: string; // ISO: en, zh, ja, ko, es, fr, de, it, pt, ru
  thinking?: boolean; // Use 5Hz LM for enhanced quality
  sampleMode?: boolean; // Auto-generate caption/lyrics via LM
  sampleQuery?: string; // Description for sample mode
  useFormat?: boolean; // LM-enhanced caption formatting
  inferenceSteps?: number; // 1-200 (8 for turbo, 32-64 for base)
  guidanceScale?: number; // Prompt guidance coefficient
  seed?: number; // -1 for random
  batchSize?: number; // 1-8
  taskType?: 'text2music' | 'cover' | 'repaint' | 'lego' | 'extract' | 'complete';
  srcAudio?: string; // Source audio for cover/repaint
  instruction?: string; // Edit instruction
  repaintingStart?: number; // Start time for repaint (seconds)
  repaintingEnd?: number; // End time for repaint (seconds)
}

export interface MusicGenerateResult {
  id: string;
  status: 'completed' | 'processing' | 'failed';
  audioUrl?: string;
  audioBase64?: string;
  duration: number;
  metadata: {
    bpm: number;
    key: string;
    timeSignature: string;
    model: string;
    lmModel?: string;
    vocalLanguage?: string;
  };
  provider: string;
  title?: string;
}

export interface AudioAnalysisResult {
  bpm?: number;
  key?: string;
  timeSignature?: string;
  caption?: string;
  lyrics?: {
    text: string;
    timestamps?: { start: number; end: number; text: string }[];
  };
  provider: string;
}

export interface StemSeparationResult {
  stems: Record<string, string>; // stem name -> audio URL
  provider: string;
}

export type MusicGenerationStatus =
  | 'idle'
  | 'generating'
  | 'analyzing'
  | 'separating'
  | 'completed'
  | 'error';

export interface MusicGenerationState {
  status: MusicGenerationStatus;
  progress: number; // 0-100
  message: string;
  result: MusicGenerateResult | null;
  error: string | null;
}

// ============================================================================
// Hook
// ============================================================================

export function useMusicGeneration() {
  const [state, setState] = useState<MusicGenerationState>({
    status: 'idle',
    progress: 0,
    message: '',
    result: null,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const currentJobIdRef = useRef<Id<"musicGenerationJobs"> | null>(null);

  // Convex mutations for job persistence
  const createJob = useMutation(api.musicGeneration.createJob);
  const startJob = useMutation(api.musicGeneration.startJob);
  const completeJob = useMutation(api.musicGeneration.completeJob);
  const failJob = useMutation(api.musicGeneration.failJob);

  /**
   * Check if ACE-Step is available
   */
  const checkAvailability = useCallback(async (): Promise<{
    available: boolean;
    reason?: string;
    models?: string[];
  }> => {
    try {
      const response = await fetch('/api/music/generate', {
        method: 'GET',
      });

      return await response.json();
    } catch {
      return { available: false, reason: 'Connection failed' };
    }
  }, []);

  /**
   * Generate music from prompt and optional lyrics
   * Now persists jobs to Convex for history and library features
   */
  const generate = useCallback(async (params: MusicGenerateParams): Promise<MusicGenerateResult | null> => {
    // Cancel any in-progress generation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState({
      status: 'generating',
      progress: 0,
      message: 'Starting music generation...',
      result: null,
      error: null,
    });

    try {
      // Create job in Convex for tracking and history
      let jobId: Id<"musicGenerationJobs"> | null = null;
      try {
        jobId = await createJob({
          prompt: params.prompt,
          lyrics: params.lyrics,
          duration: params.duration || 30,
          bpm: params.bpm,
          key: params.key,
          timeSignature: params.timeSignature,
          title: params.title,
        });
        currentJobIdRef.current = jobId;

        // Mark as processing
        await startJob({ jobId });
      } catch (convexError) {
        // If not authenticated, continue without Convex persistence
        console.warn('[useMusicGeneration] Convex job creation failed (user may not be authenticated):', convexError);
      }

      // Simulate progress updates (ACE-Step doesn't stream progress)
      const progressInterval = setInterval(() => {
        setState(prev => {
          if (prev.status !== 'generating') return prev;
          const newProgress = Math.min(prev.progress + Math.random() * 15, 90);
          return {
            ...prev,
            progress: newProgress,
            message: getProgressMessage(newProgress),
          };
        });
      }, 2000);

      const response = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, action: 'generate' }),
        signal: abortControllerRef.current.signal,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Generation failed');
      }

      const result: MusicGenerateResult = await response.json();

      // Complete the job in Convex with results
      if (jobId && result.audioUrl) {
        try {
          await completeJob({
            jobId,
            audioUrl: result.audioUrl,
            metadata: {
              actualBpm: result.metadata.bpm,
              actualKey: result.metadata.key,
              actualDuration: result.duration,
              model: result.metadata.model,
              lmModel: result.metadata.lmModel,
            },
          });
        } catch (convexError) {
          console.warn('[useMusicGeneration] Convex job completion failed:', convexError);
        }
      }

      setState({
        status: 'completed',
        progress: 100,
        message: 'Music generated successfully!',
        result,
        error: null,
      });

      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setState(prev => ({
          ...prev,
          status: 'idle',
          progress: 0,
          message: 'Generation cancelled',
        }));
        return null;
      }

      const errorMessage = error instanceof Error ? error.message : 'Generation failed';

      // Mark job as failed in Convex
      if (currentJobIdRef.current) {
        try {
          await failJob({
            jobId: currentJobIdRef.current,
            error: errorMessage,
          });
        } catch (convexError) {
          console.warn('[useMusicGeneration] Convex job failure recording failed:', convexError);
        }
      }

      setState({
        status: 'error',
        progress: 0,
        message: errorMessage,
        result: null,
        error: errorMessage,
      });

      return null;
    }
  }, [createJob, startJob, completeJob, failJob]);

  /**
   * Analyze audio to extract BPM, key, etc.
   */
  const analyze = useCallback(async (
    audioUrl: string,
    extract?: ('bpm' | 'key' | 'time_signature' | 'caption' | 'lyrics')[]
  ): Promise<AudioAnalysisResult | null> => {
    setState({
      status: 'analyzing',
      progress: 50,
      message: 'Analyzing audio...',
      result: null,
      error: null,
    });

    try {
      const response = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze',
          audioUrl,
          extract: extract || ['bpm', 'key', 'time_signature', 'caption'],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Analysis failed');
      }

      const result: AudioAnalysisResult = await response.json();

      setState({
        status: 'completed',
        progress: 100,
        message: 'Analysis complete!',
        result: null,
        error: null,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setState({
        status: 'error',
        progress: 0,
        message: errorMessage,
        result: null,
        error: errorMessage,
      });

      return null;
    }
  }, []);

  /**
   * Separate audio into stems (vocals, drums, bass, other)
   */
  const separateStems = useCallback(async (
    audioUrl: string,
    stems?: ('vocals' | 'drums' | 'bass' | 'other' | 'piano' | 'guitar')[]
  ): Promise<StemSeparationResult | null> => {
    setState({
      status: 'separating',
      progress: 30,
      message: 'Separating stems...',
      result: null,
      error: null,
    });

    try {
      const response = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'separate',
          audioUrl,
          stems: stems || ['vocals', 'drums', 'bass', 'other'],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Stem separation failed');
      }

      const result: StemSeparationResult = await response.json();

      setState({
        status: 'completed',
        progress: 100,
        message: 'Stems separated!',
        result: null,
        error: null,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Stem separation failed';
      setState({
        status: 'error',
        progress: 0,
        message: errorMessage,
        result: null,
        error: errorMessage,
      });

      return null;
    }
  }, []);

  /**
   * Cancel in-progress generation
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    cancel();
    setState({
      status: 'idle',
      progress: 0,
      message: '',
      result: null,
      error: null,
    });
  }, [cancel]);

  return {
    // State
    ...state,
    isGenerating: state.status === 'generating',
    isAnalyzing: state.status === 'analyzing',
    isSeparating: state.status === 'separating',
    isProcessing: ['generating', 'analyzing', 'separating'].includes(state.status),

    // Actions
    generate,
    analyze,
    separateStems,
    checkAvailability,
    cancel,
    reset,
  };
}

// ============================================================================
// Helpers
// ============================================================================

function getProgressMessage(progress: number): string {
  if (progress < 20) return 'Initializing models...';
  if (progress < 40) return 'Processing prompt...';
  if (progress < 60) return 'Generating audio...';
  if (progress < 80) return 'Applying effects...';
  return 'Finalizing...';
}

// ============================================================================
// Presets
// ============================================================================

export const MUSIC_PRESETS = {
  podcastIntro: {
    prompt: 'upbeat professional podcast intro, modern electronic, clean production',
    duration: 15,
    bpm: 120,
    key: 'C major',
  },
  lofi: {
    prompt: 'lo-fi hip hop study beats, vinyl crackle, mellow piano, soft drums, rainy day mood',
    duration: 120,
    bpm: 85,
    key: 'F major',
  },
  epicTrailer: {
    prompt: 'cinematic orchestral trailer music, building tension, brass swells, timpani, heroic',
    duration: 60,
    bpm: 90,
    key: 'D minor',
  },
  ambient: {
    prompt: 'peaceful ambient soundscape, soft pads, nature sounds, meditation music',
    duration: 180,
    bpm: 60,
    key: 'A minor',
  },
  edm: {
    prompt: 'high energy EDM, festival drop, punchy kick, saw wave lead, side-chain compression',
    duration: 180,
    bpm: 128,
    key: 'F minor',
  },
  acoustic: {
    prompt: 'warm acoustic folk, fingerpicked guitar, soft vocals, campfire vibes',
    duration: 120,
    bpm: 100,
    key: 'G major',
  },
} as const;

export type MusicPreset = keyof typeof MUSIC_PRESETS;
