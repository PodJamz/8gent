'use client';

/**
 * AI Music Generation Dialog
 *
 * Modal dialog for generating AI music using ACE-Step.
 * Supports prompts, lyrics, duration, BPM, key, and presets.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useMusicGeneration, MUSIC_PRESETS, MusicPreset } from '@/hooks/useMusicGeneration';
import { Wand2, Loader2, CheckCircle, XCircle, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerated?: (result: {
    audioUrl: string;
    title: string;
    duration: number;
    bpm: number;
    key: string;
  }) => void;
  projectId?: string;
}

const KEY_OPTIONS = [
  'C major', 'C minor', 'C# major', 'C# minor',
  'D major', 'D minor', 'D# major', 'D# minor',
  'E major', 'E minor',
  'F major', 'F minor', 'F# major', 'F# minor',
  'G major', 'G minor', 'G# major', 'G# minor',
  'A major', 'A minor', 'A# major', 'A# minor',
  'B major', 'B minor',
];

const TIME_SIGNATURES = ['4/4', '3/4', '6/8', '2/4', '5/4', '7/8'];

export function AIGenerateDialog({
  open,
  onOpenChange,
  onGenerated,
  projectId,
}: AIGenerateDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Form state
  const [prompt, setPrompt] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [duration, setDuration] = useState(30);
  const [bpm, setBpm] = useState<number | undefined>(undefined);
  const [key, setKey] = useState<string | undefined>(undefined);
  const [timeSignature, setTimeSignature] = useState('4/4');
  const [title, setTitle] = useState('');
  const [saveToProject, setSaveToProject] = useState(true);
  const [showLyrics, setShowLyrics] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<MusicPreset | ''>('');

  // Generation hook
  const {
    generate,
    isGenerating,
    progress,
    message,
    error,
    result,
    reset,
  } = useMusicGeneration();

  // Apply preset
  const applyPreset = useCallback((presetKey: MusicPreset) => {
    const preset = MUSIC_PRESETS[presetKey];
    setPrompt(preset.prompt);
    setDuration(preset.duration);
    setBpm(preset.bpm);
    setKey(preset.key);
    setSelectedPreset(presetKey);
  }, []);

  // Handle generation
  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    const generatedResult = await generate({
      prompt: prompt.trim(),
      lyrics: lyrics.trim() || undefined,
      duration,
      bpm,
      key,
      timeSignature,
      title: title.trim() || undefined,
      saveToJamz: saveToProject,
      projectId,
    });

    if (generatedResult?.audioUrl && onGenerated) {
      onGenerated({
        audioUrl: generatedResult.audioUrl,
        title: generatedResult.title || title || `AI: ${prompt.slice(0, 30)}`,
        duration: generatedResult.duration,
        bpm: generatedResult.metadata.bpm,
        key: generatedResult.metadata.key,
      });
    }
  }, [prompt, lyrics, duration, bpm, key, timeSignature, title, saveToProject, projectId, generate, onGenerated]);

  // Reset form
  const handleClose = useCallback(() => {
    if (!isGenerating) {
      reset();
      setPrompt('');
      setLyrics('');
      setDuration(30);
      setBpm(undefined);
      setKey(undefined);
      setTimeSignature('4/4');
      setTitle('');
      setSelectedPreset('');
      setShowLyrics(false);
      onOpenChange(false);
    }
  }, [isGenerating, reset, onOpenChange]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !isGenerating) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isGenerating, handleClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node) && !isGenerating) {
      handleClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-[600px] max-h-[90vh] overflow-y-auto bg-background border rounded-lg shadow-lg m-4"
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Wand2 className="h-5 w-5 text-purple-500" />
              AI Music Generation
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Generate original music using ACE-Step
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isGenerating}
            className="p-2 rounded-full hover:bg-muted disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Presets */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(MUSIC_PRESETS) as MusicPreset[]).map((presetKey) => (
                <Button
                  key={presetKey}
                  variant={selectedPreset === presetKey ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyPreset(presetKey)}
                  disabled={isGenerating}
                >
                  {presetKey.charAt(0).toUpperCase() + presetKey.slice(1).replace(/([A-Z])/g, ' $1')}
                </Button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">Style Description *</label>
            <textarea
              id="prompt"
              placeholder="Describe the music style, instruments, mood, and production..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              rows={3}
              className="w-full px-3 py-2 border rounded-md bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Lyrics toggle and input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Lyrics (optional)</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLyrics(!showLyrics)}
                disabled={isGenerating}
              >
                {showLyrics ? 'Hide' : 'Add Lyrics'}
              </Button>
            </div>
            {showLyrics && (
              <textarea
                placeholder="[Verse]&#10;Your lyrics here...&#10;&#10;[Chorus]&#10;Catchy hook..."
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                disabled={isGenerating}
                rows={6}
                className="w-full px-3 py-2 border rounded-md bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Duration</label>
              <span className="text-sm text-muted-foreground">
                {duration < 60 ? `${duration}s` : `${Math.floor(duration / 60)}m ${duration % 60}s`}
              </span>
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
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10s</span>
              <span>5 min</span>
            </div>
          </div>

          {/* BPM, Key, Time Signature */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="bpm" className="text-sm font-medium">BPM</label>
              <input
                id="bpm"
                type="number"
                placeholder="Auto"
                value={bpm || ''}
                onChange={(e) => setBpm(e.target.value ? parseInt(e.target.value) : undefined)}
                min={60}
                max={200}
                disabled={isGenerating}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Key</label>
              <select
                value={key || ''}
                onChange={(e) => setKey(e.target.value || undefined)}
                disabled={isGenerating}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Auto</option>
                {KEY_OPTIONS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Sig</label>
              <select
                value={timeSignature}
                onChange={(e) => setTimeSignature(e.target.value)}
                disabled={isGenerating}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {TIME_SIGNATURES.map((ts) => (
                  <option key={ts} value={ts}>{ts}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Track Title (optional)</label>
            <input
              id="title"
              type="text"
              placeholder="My Awesome Track"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isGenerating}
              className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Save to project toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="saveToProject"
              checked={saveToProject}
              onChange={(e) => setSaveToProject(e.target.checked)}
              disabled={isGenerating}
              className="h-4 w-4 accent-purple-500"
            />
            <label htmlFor="saveToProject" className="text-sm">
              Add generated track to current project
            </label>
          </div>

          {/* Progress / Status */}
          {isGenerating && (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                <span className="text-sm font-medium">{message}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success */}
          {result && (
            <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Music generated successfully!</span>
              </div>
              <audio
                src={result.audioUrl}
                controls
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                {result.duration}s | {result.metadata.bpm} BPM | {result.metadata.key}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-background border-t px-6 py-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isGenerating}>
            {result ? 'Done' : 'Cancel'}
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={cn(
              'bg-purple-600 hover:bg-purple-700',
              isGenerating && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Music
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple button to trigger AI generation
 */
export function AIGenerateButton({
  onGenerated,
  projectId,
  variant = 'default',
  size = 'default',
  className,
}: {
  onGenerated?: AIGenerateDialogProps['onGenerated'];
  projectId?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={cn('gap-2', className)}
      >
        <Wand2 className="h-4 w-4" />
        {size !== 'icon' && 'AI Generate'}
      </Button>
      <AIGenerateDialog
        open={open}
        onOpenChange={setOpen}
        onGenerated={onGenerated}
        projectId={projectId}
      />
    </>
  );
}
