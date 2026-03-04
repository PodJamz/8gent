"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Sparkles,
  Mic,
  Film,
  Volume2,
  Play,
  Loader2,
  Check,
  Download,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import type { TalkingVideoStatus, SceneStyle } from "@/lib/talking-video/types";

interface TalkingVideoNodeProps {
  topic?: string;
  sourcePhotoUrl?: string;
  sceneStyle?: SceneStyle;
  status?: TalkingVideoStatus;
  script?: string;
  audioUrl?: string;
  finalVideoUrl?: string;
  isSelected: boolean;
  width?: number;
  onGenerate?: (data: {
    topic: string;
    sourcePhotoUrl: string;
    sceneStyle: SceneStyle;
  }) => void;
}

export function TalkingVideoNode({
  topic: initialTopic,
  sourcePhotoUrl: initialPhotoUrl,
  sceneStyle: initialSceneStyle = "podcast_studio",
  status = "draft",
  script,
  audioUrl,
  finalVideoUrl,
  isSelected,
  width = 320,
  onGenerate,
}: TalkingVideoNodeProps) {
  const [topic, setTopic] = useState(initialTopic || "");
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl || "");
  const [sceneStyle, setSceneStyle] = useState<SceneStyle>(initialSceneStyle);
  const [isExpanded, setIsExpanded] = useState(!finalVideoUrl);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!topic || !photoUrl) return;

    setIsGenerating(true);

    if (onGenerate) {
      onGenerate({ topic, sourcePhotoUrl: photoUrl, sceneStyle });
    } else {
      // Direct API call if no handler provided
      try {
        const response = await fetch("/api/talking-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "run_workflow",
            topic,
            sourcePhotoUrl: photoUrl,
            sceneStyle,
          }),
        });
        const result = await response.json();
        console.log("Talking video result:", result);
      } catch (error) {
        console.error("Error generating talking video:", error);
      }
    }

    setIsGenerating(false);
  }, [topic, photoUrl, sceneStyle, onGenerate]);

  const getStatusIcon = () => {
    switch (status) {
      case "generating_script":
        return <Sparkles className="w-4 h-4 animate-pulse" />;
      case "generating_voice":
        return <Mic className="w-4 h-4 animate-pulse" />;
      case "generating_background":
        return <Film className="w-4 h-4 animate-pulse" />;
      case "lip_syncing":
        return <Volume2 className="w-4 h-4 animate-pulse" />;
      case "complete":
        return <Check className="w-4 h-4 text-green-400" />;
      case "error":
        return <RefreshCw className="w-4 h-4 text-red-400" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "generating_script":
        return "Writing script...";
      case "script_ready":
        return "Script ready";
      case "generating_voice":
        return "Generating voice...";
      case "voice_ready":
        return "Voice ready";
      case "generating_background":
        return "Creating background...";
      case "background_ready":
        return "Background ready";
      case "lip_syncing":
        return "Syncing lips...";
      case "complete":
        return "Complete!";
      case "error":
        return "Error";
      default:
        return "Ready to generate";
    }
  };

  const isInProgress = [
    "generating_script",
    "generating_voice",
    "generating_background",
    "lip_syncing",
  ].includes(status);

  return (
    <motion.div
      className={`bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl border overflow-hidden ${
        isSelected ? "border-purple-500 ring-2 ring-purple-500/30" : "border-white/10"
      }`}
      style={{ width }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-black/30 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Video className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-medium text-white">Talking Video</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-white/60">
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-white/60" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/60" />
            )}
          </button>
        </div>
      </div>

      {/* Video preview or form */}
      {finalVideoUrl ? (
        <div className="p-2">
          <video
            src={finalVideoUrl}
            controls
            className="w-full rounded-lg"
            poster={photoUrl}
          />
          {isExpanded && script && (
            <div className="mt-2 p-2 bg-black/30 rounded-lg">
              <p className="text-xs text-white/50 mb-1">Script:</p>
              <p className="text-xs text-white/80 line-clamp-3">{script}</p>
            </div>
          )}
          <a
            href={finalVideoUrl}
            download
            className="mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
      ) : isExpanded ? (
        <div className="p-3 space-y-3">
          {/* Topic input */}
          <div>
            <label className="text-xs text-white/50 mb-1 block">Topic</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What should the video be about?"
              className="w-full bg-black/30 rounded-lg px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none"
              rows={2}
              disabled={isInProgress}
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="text-xs text-white/50 mb-1 block">Photo URL</label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full bg-black/30 rounded-lg px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
              disabled={isInProgress}
            />
          </div>

          {/* Scene style */}
          <div>
            <label className="text-xs text-white/50 mb-1 block">Scene</label>
            <select
              value={sceneStyle}
              onChange={(e) => setSceneStyle(e.target.value as SceneStyle)}
              className="w-full bg-black/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
              disabled={isInProgress}
            >
              <option value="podcast_studio">Podcast Studio</option>
              <option value="office">Office</option>
              <option value="outdoor">Outdoor</option>
              <option value="news_desk">News Desk</option>
              <option value="living_room">Living Room</option>
              <option value="conference">Conference Room</option>
            </select>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!topic || !photoUrl || isInProgress || isGenerating}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isInProgress || isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Generate Video
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="p-3">
          <p className="text-sm text-white/60 text-center">
            {topic ? topic : "No topic set"}
          </p>
        </div>
      )}

      {/* Progress indicator for in-progress generation */}
      {isInProgress && (
        <div className="px-3 pb-3">
          <div className="flex gap-1">
            {["generating_script", "generating_voice", "generating_background", "lip_syncing"].map(
              (step, i) => {
                const steps = [
                  "generating_script",
                  "script_ready",
                  "generating_voice",
                  "voice_ready",
                  "generating_background",
                  "background_ready",
                  "lip_syncing",
                ];
                const currentIndex = steps.indexOf(status);
                const stepIndex = i * 2;
                const isComplete = currentIndex > stepIndex;
                const isActive = currentIndex === stepIndex || currentIndex === stepIndex + 1;

                return (
                  <div
                    key={step}
                    className={`flex-1 h-1 rounded-full transition-colors ${
                      isComplete
                        ? "bg-green-500"
                        : isActive
                          ? "bg-purple-500 animate-pulse"
                          : "bg-white/20"
                    }`}
                  />
                );
              }
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default TalkingVideoNode;
