"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ios/PageTransition";
import {
  Video,
  Mic,
  ImagePlus,
  Sparkles,
  Play,
  Download,
  RefreshCw,
  ChevronRight,
  Check,
  Loader2,
  Volume2,
  Film,
  Wand2,
  Settings,
  Upload,
  X,
} from "lucide-react";
import type { SceneStyle, TalkingVideoStatus } from "@/lib/talking-video/types";

type WorkflowStep = "topic" | "photo" | "scene" | "generating" | "complete";

const SCENE_OPTIONS: { value: SceneStyle; label: string; description: string }[] = [
  { value: "podcast_studio", label: "Podcast Studio", description: "Professional recording setup" },
  { value: "office", label: "Modern Office", description: "Clean workspace environment" },
  { value: "outdoor", label: "Outdoor", description: "Natural scenery backdrop" },
  { value: "news_desk", label: "News Desk", description: "Professional broadcast setup" },
  { value: "living_room", label: "Living Room", description: "Cozy home setting" },
  { value: "conference", label: "Conference Room", description: "Business meeting space" },
];

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "educational", label: "Educational" },
  { value: "entertaining", label: "Entertaining" },
];

interface GenerationState {
  status: TalkingVideoStatus;
  script?: string;
  audioUrl?: string;
  backgroundVideoUrl?: string;
  finalVideoUrl?: string;
  error?: string;
}

export default function VideoPage() {
  const [step, setStep] = useState<WorkflowStep>("topic");
  const [topic, setTopic] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [sceneStyle, setSceneStyle] = useState<SceneStyle>("podcast_studio");
  const [tone, setTone] = useState<"professional" | "casual" | "educational" | "entertaining">(
    "professional"
  );
  const [duration, setDuration] = useState(90);
  const [generation, setGeneration] = useState<GenerationState | null>(null);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!topic || !photoUrl) return;

    setStep("generating");
    setGeneration({ status: "generating_script" });

    try {
      const response = await fetch("/api/talking-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "run_workflow",
          topic,
          sourcePhotoUrl: photoUrl,
          sceneStyle,
          tone,
          duration,
        }),
      });

      const result = await response.json();

      if (result.error) {
        setGeneration({ status: "error", error: result.error });
      } else {
        setGeneration({
          status: "complete",
          script: result.script,
          audioUrl: result.audioUrl,
          backgroundVideoUrl: result.backgroundVideoUrl,
          finalVideoUrl: result.finalVideoUrl,
        });
        setStep("complete");
      }
    } catch (error) {
      setGeneration({
        status: "error",
        error: error instanceof Error ? error.message : "Generation failed",
      });
    }
  }, [topic, photoUrl, sceneStyle, tone, duration]);

  const handleReset = useCallback(() => {
    setStep("topic");
    setTopic("");
    setPhotoUrl("");
    setPhotoPreview(null);
    setSceneStyle("podcast_studio");
    setTone("professional");
    setDuration(90);
    setGeneration(null);
  }, []);

  const renderStepIndicator = () => {
    const steps = [
      { id: "topic", label: "Topic", icon: Sparkles },
      { id: "photo", label: "Photo", icon: ImagePlus },
      { id: "scene", label: "Scene", icon: Film },
      { id: "generating", label: "Create", icon: Wand2 },
    ];

    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.id || (step === "complete" && s.id === "generating");
          const isComplete =
            steps.findIndex((x) => x.id === step) > i ||
            (step === "complete" && s.id !== "generating");

          return (
            <div key={s.id} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                  isActive
                    ? "bg-white text-black"
                    : isComplete
                      ? "bg-green-500/20 text-green-400"
                      : "bg-white/10 text-white/40"
                }`}
              >
                {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-white/20 mx-1" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Talking Video</h1>
                <p className="text-xs text-white/40">AI-powered video creation</p>
              </div>
            </div>
            {step !== "topic" && (
              <button
                onClick={handleReset}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          {renderStepIndicator()}

          <AnimatePresence mode="wait">
            {/* Step 1: Topic */}
            {step === "topic" && (
              <motion.div
                key="topic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">What do you want to talk about?</h2>
                  <p className="text-white/50">
                    AI will write a {duration}-second script for your video
                  </p>
                </div>

                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., The future of AI in creative industries, Why I love building products, Tips for startup founders..."
                  className="w-full h-32 bg-white/5 rounded-xl p-4 text-lg placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  autoFocus
                />

                {/* Tone selector */}
                <div className="space-y-2">
                  <label className="text-sm text-white/60">Tone</label>
                  <div className="flex gap-2 flex-wrap">
                    {TONE_OPTIONS.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTone(t.value as typeof tone)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          tone === t.value
                            ? "bg-purple-500 text-white"
                            : "bg-white/10 text-white/60 hover:bg-white/20"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Duration</span>
                    <span className="text-white">{duration} seconds</span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={180}
                    step={15}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-white/40">
                    <span>30s</span>
                    <span>90s</span>
                    <span>180s</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep("photo")}
                  disabled={!topic.trim()}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Continue
                </button>
              </motion.div>
            )}

            {/* Step 2: Photo */}
            {step === "photo" && (
              <motion.div
                key="photo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Upload your photo</h2>
                  <p className="text-white/50">
                    A clear headshot works best for the talking video
                  </p>
                </div>

                {photoPreview ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={() => {
                        setPhotoPreview(null);
                        setPhotoUrl("");
                      }}
                      className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block aspect-video rounded-xl border-2 border-dashed border-white/20 hover:border-purple-500/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                      <div className="p-4 bg-white/10 rounded-full">
                        <Upload className="w-8 h-8 text-white/60" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Click to upload</p>
                        <p className="text-sm text-white/40">or drag and drop</p>
                      </div>
                    </div>
                  </label>
                )}

                {/* Or paste URL */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-black text-sm text-white/40">or paste URL</span>
                  </div>
                </div>

                <input
                  type="url"
                  value={photoUrl.startsWith("data:") ? "" : photoUrl}
                  onChange={(e) => {
                    setPhotoUrl(e.target.value);
                    setPhotoPreview(e.target.value);
                  }}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-white/5 rounded-xl px-4 py-3 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("topic")}
                    className="flex-1 py-4 bg-white/10 rounded-xl font-medium hover:bg-white/20 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep("scene")}
                    disabled={!photoUrl}
                    className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Scene */}
            {step === "scene" && (
              <motion.div
                key="scene"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Choose your scene</h2>
                  <p className="text-white/50">
                    Select a background environment for your video
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {SCENE_OPTIONS.map((scene) => (
                    <button
                      key={scene.value}
                      onClick={() => setSceneStyle(scene.value)}
                      className={`p-4 rounded-xl text-left transition-all ${
                        sceneStyle === scene.value
                          ? "bg-purple-500/20 border-2 border-purple-500"
                          : "bg-white/5 border-2 border-transparent hover:bg-white/10"
                      }`}
                    >
                      <p className="font-medium">{scene.label}</p>
                      <p className="text-sm text-white/50">{scene.description}</p>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("photo")}
                    className="flex-1 py-4 bg-white/10 rounded-xl font-medium hover:bg-white/20 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Generate Video
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Generating */}
            {step === "generating" && generation && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Creating your video</h2>
                  <p className="text-white/50">This may take a few minutes</p>
                </div>

                {/* Progress steps */}
                <div className="space-y-4">
                  {[
                    {
                      id: "generating_script",
                      label: "Writing script",
                      icon: Sparkles,
                      statuses: ["generating_script"],
                    },
                    {
                      id: "generating_voice",
                      label: "Generating voice",
                      icon: Mic,
                      statuses: ["script_ready", "generating_voice"],
                    },
                    {
                      id: "generating_background",
                      label: "Creating background",
                      icon: Film,
                      statuses: ["voice_ready", "generating_background"],
                    },
                    {
                      id: "lip_syncing",
                      label: "Syncing lips",
                      icon: Volume2,
                      statuses: ["background_ready", "lip_syncing"],
                    },
                  ].map((s, i) => {
                    const Icon = s.icon;
                    const isActive = s.statuses.includes(generation.status);
                    const isPast =
                      ["script_ready", "voice_ready", "background_ready", "complete"].indexOf(
                        generation.status
                      ) > i;
                    const isComplete = isPast || generation.status === "complete";

                    return (
                      <div
                        key={s.id}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                          isActive
                            ? "bg-purple-500/20 border border-purple-500/50"
                            : isComplete
                              ? "bg-green-500/10 border border-green-500/30"
                              : "bg-white/5 border border-transparent"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isActive
                              ? "bg-purple-500/30"
                              : isComplete
                                ? "bg-green-500/30"
                                : "bg-white/10"
                          }`}
                        >
                          {isActive ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : isComplete ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : (
                            <Icon className="w-5 h-5 text-white/40" />
                          )}
                        </div>
                        <span
                          className={
                            isActive
                              ? "text-white"
                              : isComplete
                                ? "text-green-400"
                                : "text-white/40"
                          }
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {generation.status === "error" && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                    <p className="text-red-400">{generation.error}</p>
                    <button
                      onClick={handleReset}
                      className="mt-3 px-4 py-2 bg-red-500/30 rounded-lg text-sm font-medium hover:bg-red-500/40 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Complete */}
            {step === "complete" && generation?.finalVideoUrl && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full text-green-400 mb-4">
                    <Check className="w-4 h-4" />
                    <span>Video complete!</span>
                  </div>
                  <h2 className="text-2xl font-bold">{topic}</h2>
                </div>

                {/* Video player */}
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <video
                    src={generation.finalVideoUrl}
                    controls
                    className="w-full h-full"
                    poster={photoPreview || undefined}
                  />
                </div>

                {/* Script preview */}
                {generation.script && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-sm text-white/40 mb-2">Generated Script</p>
                    <p className="text-sm text-white/80 whitespace-pre-wrap">
                      {generation.script}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <a
                    href={generation.finalVideoUrl}
                    download={`talking-video-${Date.now()}.mp4`}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </a>
                  <button
                    onClick={handleReset}
                    className="px-6 py-4 bg-white/10 rounded-xl font-medium hover:bg-white/20 transition-colors"
                  >
                    New Video
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </PageTransition>
  );
}
