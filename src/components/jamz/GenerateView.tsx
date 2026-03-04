'use client';

/**
 * GenerateView - AI Music Generation Playground for Jamz Studio
 *
 * Two-panel layout:
 * - Left: Full-featured generation form with ALL ACE-Step parameters
 * - Right: Generated tracks library with inline playback + "Add to Arrange"
 *
 * Design: iOS-quality, 8pt grid, 44px touch targets, prefers-reduced-motion
 *
 * Now integrated with Convex for persistent track library.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  Loader2,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Plus,
  ChevronDown,
  ChevronUp,
  Music,
  Clock,
  Upload,
  Trash2,
  Settings2,
  Globe,
  Wand2,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation } from '@/lib/openclaw/hooks';
import { api } from '@/lib/convex-shim';
import { Id } from '../../../convex/_generated/dataModel';
import { useMusicGeneration, MUSIC_PRESETS, MusicPreset, MusicGenerateParams } from '@/hooks/useMusicGeneration';

// ============================================================================
// Types
// ============================================================================

interface GenerateViewProps {
  onAddToArrange?: (result: {
    audioUrl: string;
    title: string;
    duration: number;
    bpm: number;
    key: string;
  }) => void;
  projectId?: string;
  colors: Record<string, string | boolean>;
}

interface GeneratedTrackItem {
  _id: Id<"generatedTracks">;
  title: string;
  prompt: string;
  audioUrl: string;
  duration: number;
  bpm: number;
  key: string;
  timeSignature: string;
  createdAt: number;
}

// ============================================================================
// Constants
// ============================================================================

const KEY_OPTIONS = [
  'C major', 'C minor', 'C# major', 'C# minor',
  'D major', 'D minor', 'D# major', 'D# minor',
  'E major', 'E minor',
  'F major', 'F minor', 'F# major', 'F# minor',
  'G major', 'G minor', 'G# major', 'G# minor',
  'A major', 'A minor', 'A# major', 'A# minor',
  'B major', 'B minor', 'Bb major', 'Bb minor',
];

const TIME_SIGNATURES = ['4/4', '3/4', '6/8', '2/4', '5/4', '7/8'];

const VOCAL_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ru', label: 'Russian' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ar', label: 'Arabic' },
  { code: 'th', label: 'Thai' },
  { code: 'vi', label: 'Vietnamese' },
  { code: 'nl', label: 'Dutch' },
  { code: 'bn', label: 'Bengali' },
];

const OUTPUT_FORMATS = ['mp3', 'wav', 'flac'] as const;

const TASK_TYPES = [
  { value: 'text2music', label: 'Text to Music' },
  { value: 'cover', label: 'Cover / Style Transfer' },
  { value: 'repaint', label: 'Repaint (Edit Section)' },
] as const;

// ============================================================================
// Component
// ============================================================================

export function GenerateView({ onAddToArrange, projectId, colors }: GenerateViewProps) {
  const reducedMotion = useReducedMotion();

  // --- Form State ---
  const [prompt, setPrompt] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [showLyrics, setShowLyrics] = useState(false);
  const [duration, setDuration] = useState(30);
  const [bpm, setBpm] = useState<number | undefined>(undefined);
  const [key, setKey] = useState<string | undefined>(undefined);
  const [timeSignature, setTimeSignature] = useState('4/4');
  const [title, setTitle] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<MusicPreset | ''>('');
  const [format, setFormat] = useState<'mp3' | 'wav' | 'flac'>('mp3');
  const [vocalLanguage, setVocalLanguage] = useState('en');

  // Reference audio
  const [referenceAudio, setReferenceAudio] = useState<string | undefined>(undefined);
  const [referenceStrength, setReferenceStrength] = useState(0.5);
  const [referenceFileName, setReferenceFileName] = useState('');
  const refInputRef = useRef<HTMLInputElement>(null);

  // Advanced params
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [inferenceSteps, setInferenceSteps] = useState<number | undefined>(undefined);
  const [guidanceScale, setGuidanceScale] = useState<number | undefined>(undefined);
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [batchSize, setBatchSize] = useState(1);
  const [taskType, setTaskType] = useState<string>('text2music');

  // --- Generation State ---
  const {
    generate,
    isGenerating,
    progress,
    message,
    error,
    result,
    reset,
  } = useMusicGeneration();

  // --- Library State (Convex-backed) ---
  // Note: projectId from local Jamz Studio is not a valid Convex ID format.
  // Only pass it when it's a valid Convex ID (starts with expected pattern).
  // For now, we skip the projectId filter since local projects don't sync to Convex yet.
  const isValidConvexId = projectId && /^[a-z0-9]{16,}$/i.test(projectId);
  const convexTracks = useQuery(api.musicGeneration.getGeneratedTracks, {
    projectId: isValidConvexId ? (projectId as Id<"jamzProjects">) : undefined,
    limit: 50,
  });
  const deleteTrackMutation = useMutation(api.musicGeneration.deleteTrack);

  // Map Convex tracks to our interface (handles loading state)
  const generatedTracks: GeneratedTrackItem[] = (convexTracks || []).map(track => ({
    _id: track._id,
    title: track.title,
    prompt: track.prompt,
    audioUrl: track.audioUrl,
    duration: track.duration,
    bpm: track.bpm,
    key: track.key,
    timeSignature: track.timeSignature,
    createdAt: track.createdAt,
  }));

  const [playingTrackId, setPlayingTrackId] = useState<Id<"generatedTracks"> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLoadingTracks = convexTracks === undefined;

  // No longer need local useEffect - Convex handles real-time updates automatically

  // --- Handlers ---

  const applyPreset = useCallback((presetKey: MusicPreset) => {
    const preset = MUSIC_PRESETS[presetKey];
    setPrompt(preset.prompt);
    setDuration(preset.duration);
    setBpm(preset.bpm);
    setKey(preset.key);
    setSelectedPreset(presetKey);
  }, []);

  const handleReferenceUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReferenceFileName(file.name);
    // For now, create a blob URL - in production this would upload to storage
    const url = URL.createObjectURL(file);
    setReferenceAudio(url);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    const params: MusicGenerateParams = {
      prompt: prompt.trim(),
      lyrics: lyrics.trim() || undefined,
      duration,
      bpm,
      key,
      timeSignature,
      title: title.trim() || undefined,
      format,
      vocalLanguage,
      referenceAudio,
      referenceStrength: referenceAudio ? referenceStrength : undefined,
      thinking,
      inferenceSteps,
      guidanceScale,
      seed,
      batchSize: batchSize > 1 ? batchSize : undefined,
      taskType: taskType !== 'text2music' ? taskType as MusicGenerateParams['taskType'] : undefined,
      saveToJamz: true,
      projectId,
    };

    await generate(params);
  }, [prompt, lyrics, duration, bpm, key, timeSignature, title, format, vocalLanguage, referenceAudio, referenceStrength, thinking, inferenceSteps, guidanceScale, seed, batchSize, taskType, projectId, generate]);

  const handlePlayTrack = useCallback((track: GeneratedTrackItem) => {
    if (playingTrackId === track._id) {
      audioRef.current?.pause();
      setPlayingTrackId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(track.audioUrl);
      audio.onended = () => setPlayingTrackId(null);
      audio.play();
      audioRef.current = audio;
      setPlayingTrackId(track._id);
    }
  }, [playingTrackId]);

  const handleAddToArrange = useCallback((track: GeneratedTrackItem) => {
    onAddToArrange?.({
      audioUrl: track.audioUrl,
      title: track.title,
      duration: track.duration,
      bpm: track.bpm,
      key: track.key,
    });
  }, [onAddToArrange]);

  const handleRemoveTrack = useCallback(async (trackId: Id<"generatedTracks">) => {
    if (playingTrackId === trackId) {
      audioRef.current?.pause();
      setPlayingTrackId(null);
    }
    try {
      await deleteTrackMutation({ trackId });
    } catch (error) {
      console.error('[GenerateView] Failed to delete track:', error);
    }
  }, [playingTrackId, deleteTrackMutation]);

  const formatDuration = (s: number) =>
    s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;

  // --- Render ---

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
      {/* ================================================================ */}
      {/* LEFT: Generation Form */}
      {/* ================================================================ */}
      <div className={`flex-1 overflow-y-auto p-4 lg:p-6 border-r ${colors.border}`}>
        <div className="max-w-xl mx-auto space-y-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className={`text-base font-semibold ${colors.text}`}>AI Music Generator</h2>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <label className={`text-xs font-medium ${colors.textMuted}`}>Quick Presets</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(MUSIC_PRESETS) as MusicPreset[]).map((presetKey) => (
                <button
                  key={presetKey}
                  onClick={() => applyPreset(presetKey)}
                  disabled={isGenerating}
                  className={cn(
                    'px-2.5 py-1.5 text-xs rounded-lg transition-colors min-h-[32px] touch-manipulation',
                    'focus:outline-none focus:ring-2 focus:ring-purple-500',
                    selectedPreset === presetKey
                      ? 'bg-purple-600 text-white'
                      : `${colors.card} ${colors.textMuted} border ${colors.border} hover:border-purple-500/50`
                  )}
                >
                  {presetKey.charAt(0).toUpperCase() + presetKey.slice(1).replace(/([A-Z])/g, ' $1')}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-1.5">
            <label htmlFor="gen-prompt" className={`text-xs font-medium ${colors.textMuted}`}>
              Style Description *
            </label>
            <textarea
              id="gen-prompt"
              placeholder="Describe the music: genre, instruments, mood, production style..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              rows={3}
              className={`w-full px-3 py-2.5 ${colors.card} border ${colors.border} rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 ${colors.text} placeholder:${colors.textFaint}`}
            />
          </div>

          {/* Lyrics */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-medium ${colors.textMuted}`}>Lyrics</label>
              <button
                onClick={() => setShowLyrics(!showLyrics)}
                disabled={isGenerating}
                className={`text-xs ${colors.textFaint} hover:text-purple-400 transition-colors`}
              >
                {showLyrics ? 'Hide' : 'Add Lyrics'}
              </button>
            </div>
            <AnimatePresence>
              {showLyrics && (
                <motion.div
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-purple-400" />
                    <select
                      value={vocalLanguage}
                      onChange={(e) => setVocalLanguage(e.target.value)}
                      disabled={isGenerating}
                      className={`text-xs px-2 py-1 ${colors.card} border ${colors.border} rounded-md ${colors.text} focus:ring-2 focus:ring-purple-500`}
                      aria-label="Vocal language"
                    >
                      {VOCAL_LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    placeholder={'[Verse]\nYour lyrics here...\n\n[Chorus]\nCatchy hook...\n\n[Instrumental] for no vocals'}
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    disabled={isGenerating}
                    rows={5}
                    className={`w-full px-3 py-2.5 ${colors.card} border ${colors.border} rounded-lg font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 ${colors.text}`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Duration slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-medium ${colors.textMuted}`}>Duration</label>
              <span className={`text-xs tabular-nums ${colors.textFaint}`}>{formatDuration(duration)}</span>
            </div>
            <input
              type="range"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              min={10}
              max={300}
              step={5}
              disabled={isGenerating}
              className="w-full accent-purple-500"
              aria-label="Duration"
            />
            <div className={`flex justify-between text-[10px] ${colors.textFaint}`}>
              <span>10s</span>
              <span>5 min</span>
            </div>
          </div>

          {/* BPM / Key / Time Sig / Format row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label htmlFor="gen-bpm" className={`text-[10px] font-medium ${colors.textMuted}`}>BPM</label>
              <input
                id="gen-bpm"
                type="number"
                placeholder="Auto"
                value={bpm ?? ''}
                onChange={(e) => setBpm(e.target.value ? parseInt(e.target.value) : undefined)}
                min={30}
                max={300}
                disabled={isGenerating}
                className={`w-full px-2 py-2 ${colors.card} border ${colors.border} rounded-lg text-xs ${colors.text} focus:ring-2 focus:ring-purple-500 min-h-[36px]`}
              />
            </div>
            <div className="space-y-1">
              <label className={`text-[10px] font-medium ${colors.textMuted}`}>Key</label>
              <select
                value={key ?? ''}
                onChange={(e) => setKey(e.target.value || undefined)}
                disabled={isGenerating}
                className={`w-full px-2 py-2 ${colors.card} border ${colors.border} rounded-lg text-xs ${colors.text} focus:ring-2 focus:ring-purple-500 min-h-[36px]`}
                aria-label="Key"
              >
                <option value="">Auto</option>
                {KEY_OPTIONS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className={`text-[10px] font-medium ${colors.textMuted}`}>Time Sig</label>
              <select
                value={timeSignature}
                onChange={(e) => setTimeSignature(e.target.value)}
                disabled={isGenerating}
                className={`w-full px-2 py-2 ${colors.card} border ${colors.border} rounded-lg text-xs ${colors.text} focus:ring-2 focus:ring-purple-500 min-h-[36px]`}
                aria-label="Time signature"
              >
                {TIME_SIGNATURES.map((ts) => (
                  <option key={ts} value={ts}>{ts}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className={`text-[10px] font-medium ${colors.textMuted}`}>Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as typeof format)}
                disabled={isGenerating}
                className={`w-full px-2 py-2 ${colors.card} border ${colors.border} rounded-lg text-xs ${colors.text} focus:ring-2 focus:ring-purple-500 min-h-[36px]`}
                aria-label="Output format"
              >
                {OUTPUT_FORMATS.map((f) => (
                  <option key={f} value={f}>{f.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Reference Audio */}
          <div className="space-y-1.5">
            <label className={`text-xs font-medium ${colors.textMuted}`}>Reference Audio (Style Transfer)</label>
            <div className="flex items-center gap-2">
              <input
                ref={refInputRef}
                type="file"
                accept="audio/*"
                onChange={handleReferenceUpload}
                className="sr-only"
                aria-label="Upload reference audio"
              />
              <button
                onClick={() => refInputRef.current?.click()}
                disabled={isGenerating}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-xs min-h-[36px] transition-colors touch-manipulation',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500',
                  `${colors.card} border ${colors.border} ${colors.textMuted} hover:border-purple-500/50`
                )}
              >
                <Upload className="w-3.5 h-3.5" />
                {referenceFileName || 'Upload audio file'}
              </button>
              {referenceAudio && (
                <button
                  onClick={() => { setReferenceAudio(undefined); setReferenceFileName(''); }}
                  className={`p-1.5 rounded ${colors.textFaint} hover:text-red-400 transition-colors`}
                  aria-label="Remove reference audio"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>
            {referenceAudio && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] ${colors.textFaint}`}>Style Strength</span>
                  <span className={`text-[10px] tabular-nums ${colors.textFaint}`}>{Math.round(referenceStrength * 100)}%</span>
                </div>
                <input
                  type="range"
                  value={referenceStrength}
                  onChange={(e) => setReferenceStrength(parseFloat(e.target.value))}
                  min={0}
                  max={1}
                  step={0.05}
                  disabled={isGenerating}
                  className="w-full accent-purple-500"
                  aria-label="Reference strength"
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="gen-title" className={`text-xs font-medium ${colors.textMuted}`}>Track Title</label>
            <input
              id="gen-title"
              type="text"
              placeholder="Optional title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isGenerating}
              className={`w-full px-3 py-2 ${colors.card} border ${colors.border} rounded-lg text-sm ${colors.text} focus:ring-2 focus:ring-purple-500 min-h-[36px]`}
            />
          </div>

          {/* Advanced Settings (collapsible) */}
          <div className={`border ${colors.border} rounded-lg overflow-hidden`}>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium min-h-[40px] transition-colors touch-manipulation',
                'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset',
                `${colors.card} ${colors.textMuted} hover:${colors.text}`
              )}
              aria-expanded={showAdvanced}
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-3.5 h-3.5" />
                Advanced Settings
              </div>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  className={`px-3 pb-3 space-y-3 border-t ${colors.border}`}
                >
                  <div className="pt-3 grid grid-cols-2 gap-3">
                    {/* Task Type */}
                    <div className="space-y-1 col-span-2">
                      <label className={`text-[10px] font-medium ${colors.textMuted}`}>Task Type</label>
                      <select
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value)}
                        disabled={isGenerating}
                        className={`w-full px-2 py-2 ${colors.card} border ${colors.border} rounded-lg text-xs ${colors.text} focus:ring-2 focus:ring-purple-500 min-h-[36px]`}
                        aria-label="Task type"
                      >
                        {TASK_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Thinking Mode */}
                    <div className="flex items-center gap-2 col-span-2">
                      <input
                        type="checkbox"
                        id="gen-thinking"
                        checked={thinking}
                        onChange={(e) => setThinking(e.target.checked)}
                        disabled={isGenerating}
                        className="h-4 w-4 accent-purple-500 rounded"
                      />
                      <label htmlFor="gen-thinking" className={`text-xs ${colors.textMuted}`}>
                        Thinking Mode (5Hz LM - higher quality, slower)
                      </label>
                    </div>

                    {/* Inference Steps */}
                    <div className="space-y-1">
                      <label className={`text-[10px] font-medium ${colors.textMuted}`}>Steps</label>
                      <input
                        type="number"
                        placeholder="8"
                        value={inferenceSteps ?? ''}
                        onChange={(e) => setInferenceSteps(e.target.value ? parseInt(e.target.value) : undefined)}
                        min={1}
                        max={200}
                        disabled={isGenerating}
                        className={`w-full px-2 py-2 ${colors.card} border ${colors.border} rounded-lg text-xs ${colors.text} focus:ring-2 focus:ring-purple-500 min-h-[36px]`}
                      />
                    </div>

                    {/* Guidance Scale */}
                    <div className="space-y-1">
                      <label className={`text-[10px] font-medium ${colors.textMuted}`}>Guidance</label>
                      <input
                        type="number"
                        placeholder="7.0"
                        value={guidanceScale ?? ''}
                        onChange={(e) => setGuidanceScale(e.target.value ? parseFloat(e.target.value) : undefined)}
                        step={0.5}
                        disabled={isGenerating}
                        className={`w-full px-2 py-2 ${colors.card} border ${colors.border} rounded-lg text-xs ${colors.text} focus:ring-2 focus:ring-purple-500 min-h-[36px]`}
                      />
                    </div>

                    {/* Seed */}
                    <div className="space-y-1">
                      <label className={`text-[10px] font-medium ${colors.textMuted}`}>Seed</label>
                      <input
                        type="number"
                        placeholder="Random"
                        value={seed ?? ''}
                        onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
                        disabled={isGenerating}
                        className={`w-full px-2 py-2 ${colors.card} border ${colors.border} rounded-lg text-xs ${colors.text} focus:ring-2 focus:ring-purple-500 min-h-[36px]`}
                      />
                    </div>

                    {/* Batch Size */}
                    <div className="space-y-1">
                      <label htmlFor="gen-batch" className={`text-[10px] font-medium ${colors.textMuted}`}>Batch</label>
                      <input
                        id="gen-batch"
                        type="number"
                        value={batchSize}
                        onChange={(e) => setBatchSize(Math.max(1, Math.min(8, parseInt(e.target.value) || 1)))}
                        min={1}
                        max={8}
                        disabled={isGenerating}
                        className={`w-full px-2 py-2 ${colors.card} border ${colors.border} rounded-lg text-xs ${colors.text} focus:ring-2 focus:ring-purple-500 min-h-[36px]`}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress */}
          {isGenerating && (
            <div className={`rounded-lg border ${colors.border} ${colors.card} p-3 space-y-2`}>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                <span className={`text-xs font-medium ${colors.text}`}>{message}</span>
              </div>
              <div className={`h-1.5 ${colors.bgTertiary} rounded-full overflow-hidden`}>
                <motion.div
                  className="h-full bg-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Success inline */}
          {result && !isGenerating && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 space-y-2">
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs font-medium">Generated successfully</span>
              </div>
              <audio src={result.audioUrl} controls className="w-full h-8" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <div className="flex items-center gap-2 text-red-400">
                <XCircle className="h-4 w-4" />
                <span className="text-xs">{error}</span>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[48px] touch-manipulation',
              'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
              isGenerating || !prompt.trim()
                ? 'bg-purple-600/50 text-white/50 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700 active:scale-[0.98]'
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate Music
              </>
            )}
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* RIGHT: Generated Tracks Library */}
      {/* ================================================================ */}
      <div className="flex-1 flex flex-col overflow-hidden lg:max-w-sm xl:max-w-md">
        <div className={`flex items-center justify-between px-4 py-3 border-b ${colors.border}`}>
          <h3 className={`text-xs font-semibold ${colors.text} uppercase tracking-wider`}>
            Generated Tracks
          </h3>
          <span className={`text-[10px] ${colors.textFaint} tabular-nums`}>
            {isLoadingTracks ? '...' : `${generatedTracks.length} tracks`}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoadingTracks ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className={`w-12 h-12 rounded-xl ${colors.card} flex items-center justify-center mb-3`}>
                <RefreshCw className={`w-6 h-6 ${colors.textFaint} animate-spin`} />
              </div>
              <p className={`text-xs ${colors.textFaint}`}>
                Loading your tracks...
              </p>
            </div>
          ) : generatedTracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className={`w-12 h-12 rounded-xl ${colors.card} flex items-center justify-center mb-3`}>
                <Music className={`w-6 h-6 ${colors.textFaint}`} />
              </div>
              <p className={`text-xs ${colors.textFaint} max-w-[200px]`}>
                Generated tracks will appear here. Use the form to create your first track.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {generatedTracks.map((track) => (
                <div
                  key={track._id}
                  className={cn(
                    'px-4 py-3 flex items-start gap-3 transition-colors',
                    `hover:${colors.cardHover}`
                  )}
                >
                  {/* Play button */}
                  <button
                    onClick={() => handlePlayTrack(track)}
                    className={cn(
                      'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors touch-manipulation',
                      'focus:outline-none focus:ring-2 focus:ring-purple-500',
                      playingTrackId === track._id
                        ? 'bg-purple-600 text-white'
                        : `${colors.bgTertiary} ${colors.textMuted} hover:text-purple-400`
                    )}
                    aria-label={playingTrackId === track._id ? 'Pause' : 'Play'}
                  >
                    {playingTrackId === track._id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>

                  {/* Track info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${colors.text} truncate`}>{track.title}</p>
                    <p className={`text-[10px] ${colors.textFaint} truncate mt-0.5`}>{track.prompt.slice(0, 60)}</p>
                    <div className={`flex items-center gap-2 mt-1 text-[10px] ${colors.textFaint} tabular-nums`}>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {formatDuration(track.duration)}
                      </span>
                      <span>{track.bpm} BPM</span>
                      <span>{track.key}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {onAddToArrange && (
                      <button
                        onClick={() => handleAddToArrange(track)}
                        className={cn(
                          'p-1.5 rounded-md transition-colors touch-manipulation',
                          'focus:outline-none focus:ring-2 focus:ring-cyan-500',
                          `${colors.textFaint} hover:text-cyan-400 hover:${colors.cardHover}`
                        )}
                        aria-label="Add to arrange view"
                        title="Add to Arrange"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveTrack(track._id)}
                      className={cn(
                        'p-1.5 rounded-md transition-colors touch-manipulation',
                        'focus:outline-none focus:ring-2 focus:ring-red-500',
                        `${colors.textFaint} hover:text-red-400 hover:${colors.cardHover}`
                      )}
                      aria-label="Remove track"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
