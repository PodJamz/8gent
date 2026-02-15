'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import {
  JamzProject,
  JamzTrack,
  JamzClip,
  beatsToSeconds,
  secondsToBeats,
} from './types';

interface AudioEngineState {
  isPlaying: boolean;
  isRecording: boolean;
  currentBeat: number;
  masterLevel: number;
  inputLevel: number;
}

interface ScheduledSource {
  source: AudioBufferSourceNode;
  clipId: string;
  trackId: string;
}

export function useAudioEngine(project: JamzProject | null) {
  const [state, setState] = useState<AudioEngineState>({
    isPlaying: false,
    isRecording: false,
    currentBeat: 0,
    masterLevel: 0,
    inputLevel: 0,
  });

  // Audio context and nodes
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const trackGainsRef = useRef<Map<string, GainNode>>(new Map());
  const trackPansRef = useRef<Map<string, StereoPannerNode>>(new Map());

  // Playback state
  const scheduledSourcesRef = useRef<ScheduledSource[]>([]);
  const startTimeRef = useRef<number>(0);
  const startBeatRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Recording state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const inputStreamRef = useRef<MediaStream | null>(null);
  const inputAnalyserRef = useRef<AnalyserNode | null>(null);

  // Audio buffers cache
  const audioBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());

  // Initialize audio context
  const initAudioContext = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;

    const ctx = new AudioContext();
    audioContextRef.current = ctx;

    // Create master gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Create analyser for metering
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    masterGain.connect(analyser);
    analyserRef.current = analyser;

    return ctx;
  }, []);

  // Resume audio context (needed for user interaction)
  const resumeAudioContext = useCallback(async () => {
    const ctx = initAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    return ctx;
  }, [initAudioContext]);

  // Load audio from URL
  const loadAudio = useCallback(async (url: string): Promise<AudioBuffer> => {
    // Check cache first
    const cached = audioBuffersRef.current.get(url);
    if (cached) return cached;

    const ctx = await resumeAudioContext();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    audioBuffersRef.current.set(url, audioBuffer);
    return audioBuffer;
  }, [resumeAudioContext]);

  // Load audio from File
  const loadAudioFromFile = useCallback(async (file: File): Promise<AudioBuffer> => {
    const ctx = await resumeAudioContext();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }, [resumeAudioContext]);

  // Generate waveform peaks from AudioBuffer
  const generateWaveformPeaks = useCallback((buffer: AudioBuffer, numPeaks: number = 200): number[] => {
    const channelData = buffer.getChannelData(0);
    const samplesPerPeak = Math.floor(channelData.length / numPeaks);
    const peaks: number[] = [];

    for (let i = 0; i < numPeaks; i++) {
      let max = 0;
      const start = i * samplesPerPeak;
      const end = Math.min(start + samplesPerPeak, channelData.length);

      for (let j = start; j < end; j++) {
        const abs = Math.abs(channelData[j]);
        if (abs > max) max = abs;
      }
      peaks.push(max);
    }

    return peaks;
  }, []);

  // Get or create track nodes
  const getTrackNodes = useCallback((track: JamzTrack) => {
    const ctx = audioContextRef.current;
    if (!ctx || !masterGainRef.current) return null;

    let gainNode = trackGainsRef.current.get(track.id);
    let panNode = trackPansRef.current.get(track.id);

    if (!gainNode) {
      gainNode = ctx.createGain();
      panNode = ctx.createStereoPanner();

      gainNode.connect(panNode);
      panNode.connect(masterGainRef.current);

      trackGainsRef.current.set(track.id, gainNode);
      trackPansRef.current.set(track.id, panNode);
    }

    // Update values
    gainNode.gain.value = track.mute ? 0 : track.volume;
    if (panNode) panNode.pan.value = track.pan;

    return { gainNode, panNode };
  }, []);

  // Schedule clip playback
  const scheduleClip = useCallback(async (
    clip: JamzClip,
    track: JamzTrack,
    startTime: number,
    offsetBeat: number,
    bpm: number
  ) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const nodes = getTrackNodes(track);
    if (!nodes) return;

    let buffer: AudioBuffer | undefined;

    if (clip.audioBuffer) {
      buffer = clip.audioBuffer;
    } else if (clip.audioUrl) {
      try {
        buffer = await loadAudio(clip.audioUrl);
      } catch (e) {
        console.error('Failed to load audio:', e);
        return;
      }
    }

    if (!buffer) return;

    const clipStartSeconds = beatsToSeconds(clip.startBeat - offsetBeat, bpm);
    const clipOffsetSeconds = clip.offset ?? 0;

    // Only schedule if clip is in the future or currently playing
    if (clipStartSeconds + buffer.duration < 0) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Apply clip gain
    const clipGain = ctx.createGain();
    clipGain.gain.value = clip.gain ?? 1;
    source.connect(clipGain);
    clipGain.connect(nodes.gainNode);

    const when = Math.max(0, startTime + clipStartSeconds);
    const offset = clipStartSeconds < 0 ? -clipStartSeconds + clipOffsetSeconds : clipOffsetSeconds;

    source.start(when, offset);

    scheduledSourcesRef.current.push({
      source,
      clipId: clip.id,
      trackId: track.id,
    });

    source.onended = () => {
      scheduledSourcesRef.current = scheduledSourcesRef.current.filter(
        s => s.source !== source
      );
    };
  }, [getTrackNodes, loadAudio]);

  // Stop all scheduled sources
  const stopAllSources = useCallback(() => {
    scheduledSourcesRef.current.forEach(({ source }) => {
      try {
        source.stop();
      } catch (e) {
        // Already stopped
      }
    });
    scheduledSourcesRef.current = [];
  }, []);

  // Update playback position
  const updatePlaybackPosition = useCallback(() => {
    if (!audioContextRef.current || !state.isPlaying || !project) return;

    const ctx = audioContextRef.current;
    const elapsed = ctx.currentTime - startTimeRef.current;
    const currentBeat = startBeatRef.current + secondsToBeats(elapsed, project.bpm);

    // Handle loop
    if (project.loopEnabled && currentBeat >= project.loopEnd) {
      // Restart from loop start
      startBeatRef.current = project.loopStart;
      startTimeRef.current = ctx.currentTime;

      // Reschedule all clips
      stopAllSources();
      project.tracks.forEach(track => {
        if (!track.mute) {
          track.clips.forEach(clip => {
            scheduleClip(clip, track, ctx.currentTime, project.loopStart, project.bpm);
          });
        }
      });

      setState(s => ({ ...s, currentBeat: project.loopStart }));
    } else {
      setState(s => ({ ...s, currentBeat }));
    }

    // Update master level meter
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setState(s => ({ ...s, masterLevel: average / 255 }));
    }

    animationFrameRef.current = requestAnimationFrame(updatePlaybackPosition);
  }, [project, state.isPlaying, stopAllSources, scheduleClip]);

  // Play
  const play = useCallback(async (fromBeat?: number) => {
    if (!project) return;

    const ctx = await resumeAudioContext();

    stopAllSources();

    const startBeat = fromBeat ?? state.currentBeat;
    startBeatRef.current = startBeat;
    startTimeRef.current = ctx.currentTime;

    // Schedule all clips
    project.tracks.forEach(track => {
      // Check solo state
      const hasSolo = project.tracks.some(t => t.solo);
      if (hasSolo && !track.solo) return;
      if (track.mute) return;

      track.clips.forEach(clip => {
        scheduleClip(clip, track, ctx.currentTime, startBeat, project.bpm);
      });
    });

    setState(s => ({ ...s, isPlaying: true, currentBeat: startBeat }));
    animationFrameRef.current = requestAnimationFrame(updatePlaybackPosition);
  }, [project, state.currentBeat, resumeAudioContext, stopAllSources, scheduleClip, updatePlaybackPosition]);

  // Pause
  const pause = useCallback(() => {
    stopAllSources();
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setState(s => ({ ...s, isPlaying: false }));
  }, [stopAllSources]);

  // Stop
  const stop = useCallback(() => {
    pause();
    setState(s => ({ ...s, currentBeat: project?.loopEnabled ? project.loopStart : 0 }));
  }, [pause, project]);

  // Seek
  const seek = useCallback((beat: number) => {
    if (state.isPlaying) {
      play(beat);
    } else {
      setState(s => ({ ...s, currentBeat: beat }));
    }
  }, [state.isPlaying, play]);

  // Recording
  const startRecording = useCallback(async (targetTrackId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      inputStreamRef.current = stream;

      const ctx = await resumeAudioContext();

      // Create input analyser for level metering
      const inputSource = ctx.createMediaStreamSource(stream);
      const inputAnalyser = ctx.createAnalyser();
      inputAnalyser.fftSize = 256;
      inputSource.connect(inputAnalyser);
      inputAnalyserRef.current = inputAnalyser;

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data every 100ms

      setState(s => ({ ...s, isRecording: true }));

      // Start playback if not already playing
      if (!state.isPlaying) {
        play();
      }
    } catch (e) {
      console.error('Failed to start recording:', e);
      throw e;
    }
  }, [resumeAudioContext, state.isPlaying, play]);

  const stopRecording = useCallback(async (): Promise<{ blob: Blob; buffer: AudioBuffer } | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) {
        resolve(null);
        return;
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });

        // Convert to AudioBuffer
        const ctx = audioContextRef.current;
        if (ctx) {
          try {
            const arrayBuffer = await blob.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            resolve({ blob, buffer: audioBuffer });
          } catch (e) {
            console.error('Failed to decode recording:', e);
            resolve(null);
          }
        } else {
          resolve(null);
        }

        // Cleanup
        if (inputStreamRef.current) {
          inputStreamRef.current.getTracks().forEach(track => track.stop());
          inputStreamRef.current = null;
        }
        inputAnalyserRef.current = null;
        mediaRecorderRef.current = null;
        recordedChunksRef.current = [];
      };

      mediaRecorder.stop();
      setState(s => ({ ...s, isRecording: false }));
    });
  }, []);

  // Update input level meter
  useEffect(() => {
    if (!state.isRecording || !inputAnalyserRef.current) return;

    const updateInputLevel = () => {
      if (inputAnalyserRef.current) {
        const dataArray = new Uint8Array(inputAnalyserRef.current.frequencyBinCount);
        inputAnalyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setState(s => ({ ...s, inputLevel: average / 255 }));
      }
      if (state.isRecording) {
        requestAnimationFrame(updateInputLevel);
      }
    };

    updateInputLevel();
  }, [state.isRecording]);

  // Export mix
  const exportMix = useCallback(async (
    format: 'wav' | 'mp3' = 'wav',
    startBeat?: number,
    endBeat?: number
  ): Promise<Blob | null> => {
    if (!project) return null;

    const start = startBeat ?? 0;
    const end = endBeat ?? project.loopEnd;
    const durationSeconds = beatsToSeconds(end - start, project.bpm);

    // Create offline context
    const offlineCtx = new OfflineAudioContext(2, Math.ceil(durationSeconds * 44100), 44100);
    const masterGain = offlineCtx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(offlineCtx.destination);

    // Render all tracks
    for (const track of project.tracks) {
      const hasSolo = project.tracks.some(t => t.solo);
      if (hasSolo && !track.solo) continue;
      if (track.mute) continue;

      const trackGain = offlineCtx.createGain();
      trackGain.gain.value = track.volume;
      const trackPan = offlineCtx.createStereoPanner();
      trackPan.pan.value = track.pan;

      trackGain.connect(trackPan);
      trackPan.connect(masterGain);

      for (const clip of track.clips) {
        let buffer: AudioBuffer | undefined;

        if (clip.audioBuffer) {
          buffer = clip.audioBuffer;
        } else if (clip.audioUrl) {
          buffer = audioBuffersRef.current.get(clip.audioUrl);
        }

        if (!buffer) continue;

        const clipStartSeconds = beatsToSeconds(clip.startBeat - start, project.bpm);
        if (clipStartSeconds >= durationSeconds) continue;
        if (clipStartSeconds + buffer.duration <= 0) continue;

        const source = offlineCtx.createBufferSource();
        source.buffer = buffer;

        const clipGain = offlineCtx.createGain();
        clipGain.gain.value = clip.gain ?? 1;
        source.connect(clipGain);
        clipGain.connect(trackGain);

        const when = Math.max(0, clipStartSeconds);
        const offset = clipStartSeconds < 0 ? -clipStartSeconds : 0;
        source.start(when, offset);
      }
    }

    const renderedBuffer = await offlineCtx.startRendering();

    // Convert to WAV
    if (format === 'wav') {
      return audioBufferToWav(renderedBuffer);
    } else {
      // For MP3, we'd need a library like lamejs
      // For now, return WAV
      return audioBufferToWav(renderedBuffer);
    }
  }, [project]);

  // Export stems
  const exportStems = useCallback(async (
    startBeat?: number,
    endBeat?: number
  ): Promise<Map<string, Blob> | null> => {
    if (!project) return null;

    const stems = new Map<string, Blob>();
    const start = startBeat ?? 0;
    const end = endBeat ?? project.loopEnd;
    const durationSeconds = beatsToSeconds(end - start, project.bpm);

    for (const track of project.tracks) {
      if (track.clips.length === 0) continue;

      const offlineCtx = new OfflineAudioContext(2, Math.ceil(durationSeconds * 44100), 44100);
      const trackGain = offlineCtx.createGain();
      trackGain.gain.value = track.volume;
      const trackPan = offlineCtx.createStereoPanner();
      trackPan.pan.value = track.pan;

      trackGain.connect(trackPan);
      trackPan.connect(offlineCtx.destination);

      for (const clip of track.clips) {
        let buffer: AudioBuffer | undefined;

        if (clip.audioBuffer) {
          buffer = clip.audioBuffer;
        } else if (clip.audioUrl) {
          buffer = audioBuffersRef.current.get(clip.audioUrl);
        }

        if (!buffer) continue;

        const clipStartSeconds = beatsToSeconds(clip.startBeat - start, project.bpm);
        if (clipStartSeconds >= durationSeconds) continue;

        const source = offlineCtx.createBufferSource();
        source.buffer = buffer;

        const clipGain = offlineCtx.createGain();
        clipGain.gain.value = clip.gain ?? 1;
        source.connect(clipGain);
        clipGain.connect(trackGain);

        const when = Math.max(0, clipStartSeconds);
        const offset = clipStartSeconds < 0 ? -clipStartSeconds : 0;
        source.start(when, offset);
      }

      const renderedBuffer = await offlineCtx.startRendering();
      const blob = audioBufferToWav(renderedBuffer);
      stems.set(track.name, blob);
    }

    return stems;
  }, [project]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSources();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (inputStreamRef.current) {
        inputStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAllSources]);

  return {
    ...state,
    play,
    pause,
    stop,
    seek,
    startRecording,
    stopRecording,
    loadAudio,
    loadAudioFromFile,
    generateWaveformPeaks,
    exportMix,
    exportStems,
    resumeAudioContext,
  };
}

// Convert AudioBuffer to WAV Blob
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = buffer.length * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalSize - 8, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write audio data
  const channels: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
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
