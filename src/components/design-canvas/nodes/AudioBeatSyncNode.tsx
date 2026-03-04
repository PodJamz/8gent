'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music,
  AudioWaveform,
  Zap,
  Link2,
  Download,
  Settings,
  RefreshCw,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { springs } from '@/components/motion/config';
import { PremiumWaveform } from './waveform/PremiumWaveform';
import { AudioControls } from './waveform/AudioControls';
import { BeatLegend } from './waveform/BeatLegend';
import { analyzeBeatsWebAudio } from '@/lib/episode/beat-analyzer';

// Types
export interface Beat {
  timeMs: number;
  type: 'kick' | 'snare' | 'hihat' | 'crash' | 'other';
  intensity: number; // 0-1
  isDownbeat?: boolean;
  measure?: number;
  beatInMeasure?: number;
}

export interface Section {
  type: 'intro' | 'verse' | 'chorus' | 'bridge' | 'outro' | 'break' | 'prechorus' | 'solo';
  startMs: number;
  endMs: number;
  label: string;
  energy: number; // 0-1
}

export interface SyncPoint {
  nodeId: string;
  nodeName?: string;
  beatOffset: number;
  beatCount?: number;
  animationType: 'pulse' | 'flash' | 'rotate' | 'color' | 'cut' | 'crossfade';
  intensity?: number;
}

export interface AudioBeatSyncContent {
  audioUrl?: string;
  audioName?: string;
  bpm?: number;
  timeSignature?: string;
  key?: string;
  analyzeStatus: 'idle' | 'analyzing' | 'complete' | 'error';
  beats: Beat[];
  sections: Section[];
  syncedNodes: SyncPoint[];
  waveformData?: number[]; // Normalized 0-1 array
  energyCurve?: { timeMs: number; energy: number }[];
}

interface AudioBeatSyncNodeProps {
  id: string;
  content: AudioBeatSyncContent;
  isSelected: boolean;
  onContentChange: (content: AudioBeatSyncContent) => void;
  onSyncNode?: (nodeId: string, config: Partial<SyncPoint>) => void;
  width?: number;
  height?: number;
}

export function AudioBeatSyncNode({
  id,
  content,
  isSelected,
  onContentChange,
  onSyncNode,
  width = 620,
  height = 500,
}: AudioBeatSyncNodeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio and load buffer for analysis
  useEffect(() => {
    if (!content.audioUrl) return;

    // Create audio element for playback
    if (!audioRef.current) {
      audioRef.current = new Audio(content.audioUrl);
      audioRef.current.volume = volume;

      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }

    // Load audio buffer for analysis (separate from playback)
    const loadBuffer = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }
        const response = await fetch(content.audioUrl!);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        setAudioBuffer(buffer);

        // Generate waveform peaks if not already present
        if (!content.waveformData?.length) {
          const peaks = generateWaveformPeaks(buffer, 200);
          onContentChange({
            ...content,
            waveformData: peaks,
          });
        }
      } catch (err) {
        console.error('Failed to load audio buffer:', err);
      }
    };

    loadBuffer();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [content.audioUrl]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Generate waveform peaks from audio buffer
  const generateWaveformPeaks = (buffer: AudioBuffer, numPeaks: number): number[] => {
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
  };

  // Playback controls
  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback((timeSeconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = timeSeconds;
    setCurrentTime(timeSeconds);
  }, []);

  const skipBack = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
  }, []);

  const skipForward = useCallback(() => {
    if (!audioRef.current || !duration) return;
    audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
  }, [duration]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) setIsMuted(false);
  }, [isMuted]);

  // Real beat analysis using Web Audio API
  const analyzeBeats = useCallback(async () => {
    if (!audioBuffer) {
      console.error('No audio buffer available for analysis');
      return;
    }

    onContentChange({
      ...content,
      analyzeStatus: 'analyzing',
    });

    try {
      // Use the real beat analyzer
      const beatMap = await analyzeBeatsWebAudio(audioBuffer);

      // Generate waveform peaks if not present
      const waveformData = content.waveformData?.length
        ? content.waveformData
        : generateWaveformPeaks(audioBuffer, 200);

      onContentChange({
        ...content,
        bpm: beatMap.bpm,
        timeSignature: beatMap.timeSignature,
        analyzeStatus: 'complete',
        beats: beatMap.beats,
        sections: beatMap.sections,
        waveformData,
        energyCurve: beatMap.energyCurve,
      });
    } catch (error) {
      console.error('Beat analysis failed:', error);
      onContentChange({
        ...content,
        analyzeStatus: 'error',
      });
    }
  }, [audioBuffer, content, onContentChange]);

  return (
    <motion.div
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'bg-gradient-to-br from-background/95 via-background/90 to-muted/50',
        'backdrop-blur-xl',
        'border-2 transition-all duration-300',
        isSelected
          ? 'border-primary/60 shadow-2xl shadow-primary/20 ring-2 ring-primary/20'
          : 'border-border/40 shadow-xl'
      )}
      style={{ width, height }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springs.smooth}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/30 bg-gradient-to-r from-purple-500/5 via-transparent to-emerald-500/5">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
            animate={{
              boxShadow: isPlaying
                ? ['0 4px 12px rgba(139, 92, 246, 0.3)', '0 4px 24px rgba(139, 92, 246, 0.5)', '0 4px 12px rgba(139, 92, 246, 0.3)']
                : '0 4px 12px rgba(139, 92, 246, 0.3)',
            }}
            transition={{
              duration: 1.5,
              repeat: isPlaying ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <Music className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-sm flex items-center gap-2">
              Beat Sync Engine
              {content.analyzeStatus === 'complete' && (
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              )}
            </h3>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
              {content.audioName || 'Drop audio to analyze'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Stats badges */}
          {content.bpm && (
            <motion.div
              className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs font-mono font-bold text-purple-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={springs.bouncy}
            >
              {Math.round(content.bpm)} BPM
            </motion.div>
          )}
          {content.timeSignature && (
            <motion.div
              className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ ...springs.bouncy, delay: 0.1 }}
            >
              {content.timeSignature}
            </motion.div>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Premium Waveform */}
      <div className="px-5 py-4">
        {content.waveformData?.length ? (
          <PremiumWaveform
            waveformData={content.waveformData}
            beats={content.beats}
            sections={content.sections}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            onSeek={handleSeek}
            width={width - 40}
            height={140}
            showBeats={content.analyzeStatus === 'complete'}
            showSections={content.analyzeStatus === 'complete'}
          />
        ) : (
          <div
            className="flex items-center justify-center rounded-xl bg-muted/30 border border-dashed border-border/50"
            style={{ width: width - 40, height: 140 }}
          >
            <div className="text-center text-muted-foreground">
              <AudioWaveform className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">Load audio to visualize waveform</p>
            </div>
          </div>
        )}
      </div>

      {/* Playback Controls */}
      <div className="px-5 pb-3">
        <AudioControls
          isPlaying={isPlaying}
          onPlayPause={togglePlayback}
          onSkipBack={skipBack}
          onSkipForward={skipForward}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          currentTime={currentTime}
          duration={duration}
          disabled={!content.audioUrl}
          size="md"
        />
      </div>

      {/* Synced Nodes */}
      <AnimatePresence>
        {content.syncedNodes.length > 0 && (
          <motion.div
            className="px-5 py-3 border-t border-border/20"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springs.smooth}
          >
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5" />
              Synced Nodes ({content.syncedNodes.length})
            </p>
            <div className="space-y-1.5">
              {content.syncedNodes.map((sync, i) => (
                <motion.div
                  key={i}
                  className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-accent/30 border border-border/30"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className="font-medium">{sync.nodeName || sync.nodeId}</span>
                  <span className="text-muted-foreground font-mono">
                    Beat {sync.beatOffset} • {sync.animationType}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="px-5 py-3 border-t border-border/20 bg-muted/10 flex gap-2">
        <motion.button
          onClick={analyzeBeats}
          disabled={content.analyzeStatus === 'analyzing' || !audioBuffer}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold',
            'bg-gradient-to-r from-purple-500 to-emerald-500 text-white',
            'hover:from-purple-600 hover:to-emerald-600',
            'shadow-lg shadow-purple-500/20',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {content.analyzeStatus === 'analyzing' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing Beats...
            </>
          ) : content.analyzeStatus === 'complete' ? (
            <>
              <RefreshCw className="w-4 h-4" />
              Re-analyze
            </>
          ) : (
            <>
              <AudioWaveform className="w-4 h-4" />
              Analyze Beats
            </>
          )}
        </motion.button>

        <motion.button
          onClick={() => onSyncNode?.(id, {})}
          disabled={content.beats.length === 0}
          className={cn(
            'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium',
            'border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5',
            'transition-all duration-200',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Zap className="w-4 h-4" />
          Sync
        </motion.button>

        <motion.button
          disabled={content.beats.length === 0}
          className={cn(
            'flex items-center justify-center px-3 py-2.5 rounded-xl',
            'border-2 border-border/50 hover:border-border hover:bg-accent/30',
            'transition-all duration-200',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Beat Legend */}
      <div className="px-5 py-3 border-t border-border/20 bg-background/50">
        <BeatLegend beats={content.beats} showCounts={content.analyzeStatus === 'complete'} />
      </div>
    </motion.div>
  );
}

// Factory function
export function createAudioBeatSyncContent(
  audioUrl?: string,
  audioName?: string
): AudioBeatSyncContent {
  return {
    audioUrl,
    audioName,
    analyzeStatus: 'idle',
    beats: [],
    sections: [],
    syncedNodes: [],
  };
}

export default AudioBeatSyncNode;
