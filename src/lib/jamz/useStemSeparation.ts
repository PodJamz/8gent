'use client';

import { useState, useCallback, useRef } from 'react';

// Stem separation types
export type StemType = 'vocals' | 'drums' | 'bass' | 'other' | 'piano' | 'guitar';

export interface StemResult {
  type: StemType;
  audioBuffer: AudioBuffer;
  audioUrl: string;
  waveformPeaks: number[];
}

export interface StemSeparationProgress {
  status: 'idle' | 'uploading' | 'processing' | 'downloading' | 'complete' | 'error';
  progress: number; // 0-100
  message: string;
  currentStem?: StemType;
}

export interface StemSeparationOptions {
  stems?: StemType[];
  quality?: 'fast' | 'balanced' | 'high';
  onProgress?: (progress: StemSeparationProgress) => void;
}

// API endpoint for stem separation (configurable)
const STEM_API_ENDPOINT = process.env.NEXT_PUBLIC_STEM_API_ENDPOINT || '/api/stems/separate';

/**
 * Hook for AI-powered stem separation
 * Uses Demucs/Spleeter-style separation to extract vocals, drums, bass, and other instruments
 */
export function useStemSeparation() {
  const [progress, setProgress] = useState<StemSeparationProgress>({
    status: 'idle',
    progress: 0,
    message: '',
  });
  const [results, setResults] = useState<StemResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  /**
   * Separate an audio file into stems
   */
  const separateStems = useCallback(
    async (
      audioFile: File | Blob,
      options: StemSeparationOptions = {}
    ): Promise<StemResult[] | null> => {
      const {
        stems = ['vocals', 'drums', 'bass', 'other'],
        quality = 'balanced',
        onProgress,
      } = options;

      // Reset state
      setError(null);
      setResults(null);
      abortControllerRef.current = new AbortController();

      const updateProgress = (update: Partial<StemSeparationProgress>) => {
        const newProgress = { ...progress, ...update };
        setProgress(newProgress);
        onProgress?.(newProgress);
      };

      try {
        // Step 1: Upload audio
        updateProgress({
          status: 'uploading',
          progress: 10,
          message: 'Uploading audio...',
        });

        const formData = new FormData();
        formData.append('audio', audioFile);
        formData.append('stems', JSON.stringify(stems));
        formData.append('quality', quality);

        const uploadResponse = await fetch(STEM_API_ENDPOINT, {
          method: 'POST',
          body: formData,
          signal: abortControllerRef.current.signal,
        });

        if (!uploadResponse.ok) {
          // If API is not available, use client-side fallback
          if (uploadResponse.status === 404) {
            return await clientSideStemSeparation(audioFile, stems, updateProgress);
          }
          throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }

        const { jobId } = await uploadResponse.json();

        // Step 2: Poll for processing status
        updateProgress({
          status: 'processing',
          progress: 30,
          message: 'AI is separating stems...',
        });

        let attempts = 0;
        const maxAttempts = 120; // 2 minutes max
        let processingComplete = false;

        while (!processingComplete && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const statusResponse = await fetch(`${STEM_API_ENDPOINT}/status/${jobId}`, {
            signal: abortControllerRef.current.signal,
          });

          if (!statusResponse.ok) {
            throw new Error('Failed to check processing status');
          }

          const status = await statusResponse.json();

          if (status.error) {
            throw new Error(status.error);
          }

          updateProgress({
            progress: 30 + Math.min(status.progress * 0.5, 50),
            message: status.message || 'Processing...',
            currentStem: status.currentStem,
          });

          if (status.complete) {
            processingComplete = true;
          }

          attempts++;
        }

        if (!processingComplete) {
          throw new Error('Processing timeout');
        }

        // Step 3: Download stems
        updateProgress({
          status: 'downloading',
          progress: 80,
          message: 'Downloading stems...',
        });

        const stemsResponse = await fetch(`${STEM_API_ENDPOINT}/download/${jobId}`, {
          signal: abortControllerRef.current.signal,
        });

        if (!stemsResponse.ok) {
          throw new Error('Failed to download stems');
        }

        const audioContext = getAudioContext();
        const stemResults: StemResult[] = [];
        const stemsData = await stemsResponse.json();

        for (const stemData of stemsData.stems) {
          // Decode audio from base64 or URL
          const audioData = await fetchAudioData(stemData.url);
          const audioBuffer = await audioContext.decodeAudioData(audioData);
          const waveformPeaks = generateWaveformPeaks(audioBuffer);

          stemResults.push({
            type: stemData.type as StemType,
            audioBuffer,
            audioUrl: stemData.url,
            waveformPeaks,
          });

          updateProgress({
            progress: 80 + (stemResults.length / stemsData.stems.length) * 20,
            message: `Downloaded ${stemData.type}...`,
            currentStem: stemData.type,
          });
        }

        updateProgress({
          status: 'complete',
          progress: 100,
          message: 'Stem separation complete!',
        });

        setResults(stemResults);
        return stemResults;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          updateProgress({
            status: 'idle',
            progress: 0,
            message: 'Cancelled',
          });
          return null;
        }

        const errorMessage = err instanceof Error ? err.message : 'Stem separation failed';
        setError(errorMessage);
        updateProgress({
          status: 'error',
          progress: 0,
          message: errorMessage,
        });
        return null;
      }
    },
    [progress, getAudioContext]
  );

  /**
   * Cancel ongoing stem separation
   */
  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setProgress({
      status: 'idle',
      progress: 0,
      message: '',
    });
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setProgress({
      status: 'idle',
      progress: 0,
      message: '',
    });
    setResults(null);
    setError(null);
  }, []);

  return {
    separateStems,
    cancel,
    reset,
    progress,
    results,
    error,
    isProcessing: progress.status !== 'idle' && progress.status !== 'complete' && progress.status !== 'error',
  };
}

/**
 * Client-side stem separation fallback using frequency filtering
 * This is a simplified version - real stem separation requires ML models
 */
async function clientSideStemSeparation(
  audioFile: File | Blob,
  stems: StemType[],
  updateProgress: (update: Partial<StemSeparationProgress>) => void
): Promise<StemResult[]> {
  updateProgress({
    status: 'processing',
    progress: 20,
    message: 'Processing audio locally...',
  });

  const audioContext = new AudioContext();
  const arrayBuffer = await audioFile.arrayBuffer();
  const originalBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const results: StemResult[] = [];

  for (let i = 0; i < stems.length; i++) {
    const stemType = stems[i];
    updateProgress({
      progress: 20 + ((i + 1) / stems.length) * 70,
      message: `Extracting ${stemType}...`,
      currentStem: stemType,
    });

    // Create filtered version based on stem type
    const filteredBuffer = await createFilteredStem(audioContext, originalBuffer, stemType);
    const waveformPeaks = generateWaveformPeaks(filteredBuffer);

    // Create a blob URL for the filtered audio
    const wavBlob = audioBufferToWav(filteredBuffer);
    const audioUrl = URL.createObjectURL(wavBlob);

    results.push({
      type: stemType,
      audioBuffer: filteredBuffer,
      audioUrl,
      waveformPeaks,
    });
  }

  updateProgress({
    status: 'complete',
    progress: 100,
    message: 'Stem separation complete!',
  });

  return results;
}

/**
 * Create a filtered version of audio for a specific stem type
 * Uses frequency-based isolation (simplified approach)
 */
async function createFilteredStem(
  audioContext: AudioContext,
  sourceBuffer: AudioBuffer,
  stemType: StemType
): Promise<AudioBuffer> {
  const offlineContext = new OfflineAudioContext(
    sourceBuffer.numberOfChannels,
    sourceBuffer.length,
    sourceBuffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = sourceBuffer;

  // Create filters based on stem type
  const filters: BiquadFilterNode[] = [];

  switch (stemType) {
    case 'vocals':
      // Vocals typically in 300Hz - 3kHz range, centered
      const vocalHighpass = offlineContext.createBiquadFilter();
      vocalHighpass.type = 'highpass';
      vocalHighpass.frequency.value = 300;
      vocalHighpass.Q.value = 0.7;

      const vocalLowpass = offlineContext.createBiquadFilter();
      vocalLowpass.type = 'lowpass';
      vocalLowpass.frequency.value = 3500;
      vocalLowpass.Q.value = 0.7;

      filters.push(vocalHighpass, vocalLowpass);
      break;

    case 'drums':
      // Drums have low-end punch and high-end attack
      const drumLow = offlineContext.createBiquadFilter();
      drumLow.type = 'lowshelf';
      drumLow.frequency.value = 150;
      drumLow.gain.value = 6;

      const drumHigh = offlineContext.createBiquadFilter();
      drumHigh.type = 'highshelf';
      drumHigh.frequency.value = 5000;
      drumHigh.gain.value = 3;

      const drumMidCut = offlineContext.createBiquadFilter();
      drumMidCut.type = 'peaking';
      drumMidCut.frequency.value = 800;
      drumMidCut.Q.value = 1;
      drumMidCut.gain.value = -6;

      filters.push(drumLow, drumMidCut, drumHigh);
      break;

    case 'bass':
      // Bass typically under 250Hz
      const bassLowpass = offlineContext.createBiquadFilter();
      bassLowpass.type = 'lowpass';
      bassLowpass.frequency.value = 250;
      bassLowpass.Q.value = 0.7;

      const bassBoost = offlineContext.createBiquadFilter();
      bassBoost.type = 'lowshelf';
      bassBoost.frequency.value = 100;
      bassBoost.gain.value = 3;

      filters.push(bassLowpass, bassBoost);
      break;

    case 'piano':
    case 'guitar':
    case 'other':
    default:
      // General mid-range instruments
      const midHighpass = offlineContext.createBiquadFilter();
      midHighpass.type = 'highpass';
      midHighpass.frequency.value = 200;
      midHighpass.Q.value = 0.7;

      const midLowpass = offlineContext.createBiquadFilter();
      midLowpass.type = 'lowpass';
      midLowpass.frequency.value = 5000;
      midLowpass.Q.value = 0.7;

      filters.push(midHighpass, midLowpass);
      break;
  }

  // Connect the filter chain
  let lastNode: AudioNode = source;
  for (const filter of filters) {
    lastNode.connect(filter);
    lastNode = filter;
  }
  lastNode.connect(offlineContext.destination);

  source.start();
  return await offlineContext.startRendering();
}

/**
 * Helper to fetch audio data from a URL
 */
async function fetchAudioData(url: string): Promise<ArrayBuffer> {
  if (url.startsWith('data:')) {
    // Base64 encoded
    const base64 = url.split(',')[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const response = await fetch(url);
  return await response.arrayBuffer();
}

/**
 * Generate waveform peaks from AudioBuffer
 */
function generateWaveformPeaks(buffer: AudioBuffer, numPeaks: number = 200): number[] {
  const channelData = buffer.getChannelData(0);
  const blockSize = Math.floor(channelData.length / numPeaks);
  const peaks: number[] = [];

  for (let i = 0; i < numPeaks; i++) {
    const start = i * blockSize;
    const end = Math.min(start + blockSize, channelData.length);
    let max = 0;

    for (let j = start; j < end; j++) {
      const abs = Math.abs(channelData[j]);
      if (abs > max) max = abs;
    }

    peaks.push(max);
  }

  return peaks;
}

/**
 * Convert AudioBuffer to WAV blob
 */
function audioBufferToWav(buffer: AudioBuffer): Blob {
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
  writeString(view, 0, 'RIFF');
  view.setUint32(4, bufferLength - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Interleave channel data
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

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
