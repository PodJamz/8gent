/**
 * Production Nodes for Canvas
 *
 * THIN client components for node-based video/image production.
 * All heavy processing routes to server-side via /api/process-media
 *
 * Architecture:
 * - Client: UI controls, state management, API calls only
 * - Server (/api/process-media): Routes to Lynkr → local Mac for processing
 *
 * Inspired by ComfyUI, TouchDesigner, and DaVinci Fusion.
 */

"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Wand2,
  Upload,
  Download,
  Layers,
  Palette,
  Film,
  Music,
  Sparkles,
  Grid3X3,
  Blend,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Eye,
  Maximize2,
} from "lucide-react";
import type { CanvasNode } from "@/lib/canvas/schema";
import { AIGeneratorControls } from "./AIGeneratorControls";
import { ProviderType } from "@/lib/providers/types";

// =============================================================================
// API Client (thin - just sends to server)
// =============================================================================

interface ProcessMediaRequest {
  action: "apply_effect" | "generate" | "composite" | "export";
  input?: string; // URL or base64
  effect?: string;
  params?: Record<string, unknown>;
}

interface ProcessMediaResponse {
  success: boolean;
  resultUrl?: string;
  preview?: string; // Thumbnail
  error?: string;
}

/**
 * Send processing request to server (which routes to Lynkr/local Mac)
 */
async function processMedia(request: ProcessMediaRequest): Promise<ProcessMediaResponse> {
  try {
    const response = await fetch("/api/process-media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Processing failed",
    };
  }
}

// =============================================================================
// Types
// =============================================================================

export type ProductionNodeType =
  | "image-input"
  | "image-effect"
  | "image-output"
  | "video-input"
  | "video-effect"
  | "video-timeline"
  | "video-output"
  | "audio-input"
  | "audio-waveform"
  | "storyboard-frame"
  | "scene-compositor"
  | "text-generator"
  | "ai-generator"
  | "color-palette"
  | "blend-node"
  | "export-node";

export interface NodePort {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "text" | "number" | "any";
  direction: "input" | "output";
  connected?: boolean;
  value?: unknown;
}

export interface ProductionNodeData {
  nodeType: ProductionNodeType;
  label: string;
  inputs: NodePort[];
  outputs: NodePort[];
  params: Record<string, unknown>;
  preview?: string; // Data URL for preview
  isProcessing?: boolean;
  isExpanded?: boolean;
  error?: string;
}

// =============================================================================
// Node Definitions
// =============================================================================

export const PRODUCTION_NODE_DEFINITIONS: Record<
  ProductionNodeType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    inputs: Omit<NodePort, "id" | "connected">[];
    outputs: Omit<NodePort, "id" | "connected">[];
    defaultParams: Record<string, unknown>;
    category: "input" | "process" | "output" | "generate" | "compose";
  }
> = {
  "image-input": {
    label: "Image Input",
    icon: Upload,
    color: "#4ade80",
    inputs: [],
    outputs: [{ name: "image", type: "image", direction: "output" }],
    defaultParams: { src: "", filename: "" },
    category: "input",
  },
  "image-effect": {
    label: "Image Effect",
    icon: Wand2,
    color: "#a78bfa",
    inputs: [{ name: "image", type: "image", direction: "input" }],
    outputs: [{ name: "image", type: "image", direction: "output" }],
    defaultParams: {
      effect: "halftone",
      intensity: 50,
      params: {},
    },
    category: "process",
  },
  "image-output": {
    label: "Image Output",
    icon: Download,
    color: "#f472b6",
    inputs: [{ name: "image", type: "image", direction: "input" }],
    outputs: [],
    defaultParams: { format: "png", quality: 90, filename: "output" },
    category: "output",
  },
  "video-input": {
    label: "Video Input",
    icon: Film,
    color: "#60a5fa",
    inputs: [],
    outputs: [
      { name: "video", type: "video", direction: "output" },
      { name: "audio", type: "audio", direction: "output" },
    ],
    defaultParams: { src: "", duration: 0, fps: 30 },
    category: "input",
  },
  "video-effect": {
    label: "Video Effect",
    icon: Sparkles,
    color: "#c084fc",
    inputs: [{ name: "video", type: "video", direction: "input" }],
    outputs: [{ name: "video", type: "video", direction: "output" }],
    defaultParams: {
      effect: "none",
      params: {},
    },
    category: "process",
  },
  "video-timeline": {
    label: "Timeline",
    icon: Film,
    color: "#fb923c",
    inputs: [
      { name: "clip1", type: "video", direction: "input" },
      { name: "clip2", type: "video", direction: "input" },
      { name: "clip3", type: "video", direction: "input" },
    ],
    outputs: [{ name: "sequence", type: "video", direction: "output" }],
    defaultParams: { clips: [], transitions: [] },
    category: "compose",
  },
  "video-output": {
    label: "Video Export",
    icon: Download,
    color: "#f43f5e",
    inputs: [
      { name: "video", type: "video", direction: "input" },
      { name: "audio", type: "audio", direction: "input" },
    ],
    outputs: [],
    defaultParams: { format: "mp4", quality: "high", preset: "youtube" },
    category: "output",
  },
  "audio-input": {
    label: "Audio Input",
    icon: Music,
    color: "#22d3ee",
    inputs: [],
    outputs: [{ name: "audio", type: "audio", direction: "output" }],
    defaultParams: { src: "", duration: 0 },
    category: "input",
  },
  "audio-waveform": {
    label: "Waveform",
    icon: Music,
    color: "#2dd4bf",
    inputs: [{ name: "audio", type: "audio", direction: "input" }],
    outputs: [{ name: "visual", type: "video", direction: "output" }],
    defaultParams: { style: "bars", color: "#ffffff", barWidth: 4 },
    category: "process",
  },
  "storyboard-frame": {
    label: "Storyboard",
    icon: Grid3X3,
    color: "#fbbf24",
    inputs: [{ name: "image", type: "image", direction: "input" }],
    outputs: [{ name: "frame", type: "image", direction: "output" }],
    defaultParams: {
      sceneNumber: 1,
      description: "",
      duration: 3,
      cameraMove: "static",
      notes: "",
    },
    category: "compose",
  },
  "scene-compositor": {
    label: "Scene",
    icon: Layers,
    color: "#ec4899",
    inputs: [
      { name: "background", type: "image", direction: "input" },
      { name: "layer1", type: "image", direction: "input" },
      { name: "layer2", type: "image", direction: "input" },
      { name: "audio", type: "audio", direction: "input" },
    ],
    outputs: [{ name: "scene", type: "video", direction: "output" }],
    defaultParams: { duration: 5, transition: "fade" },
    category: "compose",
  },
  "text-generator": {
    label: "Text Layer",
    icon: Wand2,
    color: "#818cf8",
    inputs: [],
    outputs: [{ name: "text", type: "image", direction: "output" }],
    defaultParams: {
      text: "Title",
      fontFamily: "Inter",
      fontSize: 72,
      color: "#ffffff",
      animation: "fade",
    },
    category: "generate",
  },
  "ai-generator": {
    label: "AI Generate",
    icon: Sparkles,
    color: "#f472b6",
    inputs: [{ name: "reference", type: "image", direction: "input" }],
    outputs: [{ name: "generated", type: "image", direction: "output" }],
    defaultParams: { prompt: "", model: "fal", style: "realistic" },
    category: "generate",
  },
  "color-palette": {
    label: "Color Palette",
    icon: Palette,
    color: "#fb7185",
    inputs: [{ name: "image", type: "image", direction: "input" }],
    outputs: [{ name: "palette", type: "any", direction: "output" }],
    defaultParams: { count: 5, mode: "extract" },
    category: "process",
  },
  "blend-node": {
    label: "Blend",
    icon: Blend,
    color: "#a3e635",
    inputs: [
      { name: "base", type: "image", direction: "input" },
      { name: "overlay", type: "image", direction: "input" },
    ],
    outputs: [{ name: "blended", type: "image", direction: "output" }],
    defaultParams: { mode: "normal", opacity: 100 },
    category: "process",
  },
  "export-node": {
    label: "Export",
    icon: Download,
    color: "#f97316",
    inputs: [{ name: "input", type: "any", direction: "input" }],
    outputs: [],
    defaultParams: { platform: "instagram_story", includeCaption: false },
    category: "output",
  },
};

// =============================================================================
// Effect Options
// =============================================================================

export const IMAGE_EFFECTS = [
  { value: "halftone", label: "Halftone", category: "stylization" },
  { value: "duotone", label: "Duotone", category: "stylization" },
  { value: "posterize", label: "Posterize", category: "stylization" },
  { value: "pixelate", label: "Pixelate", category: "stylization" },
  { value: "glitch", label: "Glitch", category: "artistic" },
  { value: "grayscale", label: "Grayscale", category: "color" },
  { value: "sepia", label: "Sepia", category: "color" },
  { value: "invert", label: "Invert", category: "color" },
  { value: "vignette", label: "Vignette", category: "texture" },
  { value: "grain", label: "Film Grain", category: "texture" },
  { value: "vintage", label: "Vintage", category: "preset" },
  { value: "cyberpunk", label: "Cyberpunk", category: "preset" },
  { value: "noir", label: "Noir", category: "preset" },
  { value: "signature", label: "8gent Signature", category: "preset" },
];

export const BLEND_MODES = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
];

// =============================================================================
// Base Production Node Component
// =============================================================================

interface ProductionNodeProps {
  node: CanvasNode;
  data: ProductionNodeData;
  isSelected: boolean;
  onUpdate: (data: Partial<ProductionNodeData>) => void;
  onPortClick: (nodeId: string, portId: string, direction: "input" | "output") => void;
  zoom: number;
}

export const ProductionNode: React.FC<ProductionNodeProps> = ({
  node,
  data,
  isSelected,
  onUpdate,
  onPortClick,
  zoom,
}) => {
  const [isExpanded, setIsExpanded] = useState(data.isExpanded ?? true);
  const definition = PRODUCTION_NODE_DEFINITIONS[data.nodeType];

  if (!definition) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-400">
        Unknown node type: {data.nodeType}
      </div>
    );
  }

  const Icon = definition.icon;

  return (
    <motion.div
      className={`
        production-node
        bg-[#1a1a1a]/95 backdrop-blur-sm
        border-2 rounded-xl overflow-hidden
        shadow-xl
        ${isSelected ? "border-white/50 shadow-white/10" : "border-white/10"}
      `}
      style={{
        borderColor: isSelected ? definition.color : undefined,
        minWidth: 240,
        maxWidth: isExpanded ? 320 : 240,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer"
        style={{ backgroundColor: `${definition.color}20` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ backgroundColor: definition.color }}
        >
          <Icon className="w-4 h-4 text-black" />
        </div>
        <span className="flex-1 text-sm font-medium text-white truncate">
          {data.label || definition.label}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-white/50" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/50" />
        )}
      </div>

      {/* Ports */}
      <div className="relative">
        {/* Input Ports (Left Side) */}
        <div className="absolute -left-3 top-0 bottom-0 flex flex-col justify-center gap-2 py-2">
          {data.inputs.map((port) => (
            <PortHandle
              key={port.id}
              port={port}
              color={definition.color}
              onClick={() => onPortClick(node.id, port.id, "input")}
            />
          ))}
        </div>

        {/* Output Ports (Right Side) */}
        <div className="absolute -right-3 top-0 bottom-0 flex flex-col justify-center gap-2 py-2">
          {data.outputs.map((port) => (
            <PortHandle
              key={port.id}
              port={port}
              color={definition.color}
              onClick={() => onPortClick(node.id, port.id, "output")}
            />
          ))}
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="px-3 py-2 space-y-2">
            {/* Preview */}
            {data.preview && (
              <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden">
                <img
                  src={data.preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                {data.isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>
            )}

            {/* Node-specific controls */}
            <NodeControls
              nodeType={data.nodeType}
              params={data.params}
              onParamsChange={(params) => onUpdate({ params: { ...data.params, ...params } })}
              onGenerate={data.nodeType === "ai-generator" ? async () => {
                // Handle AI generation
                const prompt = data.params.prompt as string;
                const provider = (data.params.provider as ProviderType) || "gemini";
                const modelId = data.params.modelId as string;
                const images = data.params.referenceImages as string[] | undefined;
                const parameters = data.params.parameters as Record<string, unknown> | undefined;

                if (!prompt || !modelId) {
                  onUpdate({ error: "Please provide a prompt and select a model" });
                  return;
                }

                onUpdate({ isProcessing: true, error: undefined });

                try {
                  const response = await fetch("/api/providers/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      prompt,
                      provider,
                      modelId,
                      images,
                      parameters,
                    }),
                  });

                  const result: { success: boolean; image?: string; video?: string; videoUrl?: string; contentType?: string; error?: string } = await response.json();

                  if (!result.success) {
                    onUpdate({ isProcessing: false, error: result.error || "Generation failed" });
                    return;
                  }

                  // Update preview with generated image/video
                  const mediaUrl = result.image || result.video || result.videoUrl;
                  if (mediaUrl) {
                    onUpdate({
                      isProcessing: false,
                      preview: mediaUrl,
                      params: {
                        ...data.params,
                        generatedMedia: mediaUrl,
                        contentType: result.contentType || "image",
                      },
                    });
                  } else {
                    onUpdate({ isProcessing: false, error: "No media in response" });
                  }
                } catch (error) {
                  onUpdate({
                    isProcessing: false,
                    error: error instanceof Error ? error.message : "Generation failed",
                  });
                }
              } : undefined}
            />

            {/* Error display */}
            {data.error && (
              <div className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
                {data.error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with quick actions */}
      {isExpanded && (
        <div className="flex items-center gap-1 px-3 py-2 border-t border-white/5">
          <button
            className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="flex-1" />
          <button
            className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="Expand"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

// =============================================================================
// Port Handle Component
// =============================================================================

interface PortHandleProps {
  port: NodePort;
  color: string;
  onClick: () => void;
}

const PortHandle: React.FC<PortHandleProps> = ({ port, color, onClick }) => {
  const typeColors: Record<string, string> = {
    image: "#4ade80",
    video: "#60a5fa",
    audio: "#22d3ee",
    text: "#fbbf24",
    number: "#a78bfa",
    any: "#9ca3af",
  };

  const portColor = typeColors[port.type] || color;

  return (
    <button
      onClick={onClick}
      className={`
        group relative w-6 h-6 rounded-full
        flex items-center justify-center
        transition-transform hover:scale-110
        ${port.direction === "input" ? "-ml-3" : "-mr-3"}
      `}
      title={`${port.name} (${port.type})`}
    >
      {/* Outer ring */}
      <div
        className={`
          absolute inset-0 rounded-full border-2
          ${port.connected ? "bg-opacity-100" : "bg-opacity-0"}
        `}
        style={{
          borderColor: portColor,
          backgroundColor: port.connected ? portColor : "transparent",
        }}
      />
      {/* Inner dot */}
      <div
        className="w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: portColor }}
      />
      {/* Tooltip */}
      <span
        className={`
          absolute whitespace-nowrap text-[10px] px-1.5 py-0.5 rounded
          bg-black/90 text-white opacity-0 group-hover:opacity-100
          transition-opacity pointer-events-none z-10
          ${port.direction === "input" ? "left-full ml-2" : "right-full mr-2"}
        `}
      >
        {port.name}
      </span>
    </button>
  );
};

// =============================================================================
// Node-Specific Controls
// =============================================================================

interface NodeControlsProps {
  nodeType: ProductionNodeType;
  params: Record<string, unknown>;
  onParamsChange: (params: Record<string, unknown>) => void;
  onGenerate?: () => void | Promise<void>;
}

const NodeControls: React.FC<NodeControlsProps> = ({
  nodeType,
  params,
  onParamsChange,
  onGenerate,
}) => {
  switch (nodeType) {
    case "image-input":
      return (
        <div className="space-y-2">
          <button className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/70 hover:text-white transition-colors flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Image
          </button>
          {typeof params.filename === 'string' && params.filename ? (
            <div className="text-xs text-white/50 truncate">
              {params.filename}
            </div>
          ) : null}
        </div>
      );

    case "image-effect":
      return (
        <div className="space-y-2">
          <select
            className="w-full py-1.5 px-2 bg-white/5 rounded-lg text-sm text-white border border-white/10 focus:border-white/30 outline-none"
            value={params.effect as string}
            onChange={(e) => onParamsChange({ effect: e.target.value })}
          >
            {IMAGE_EFFECTS.map((effect) => (
              <option key={effect.value} value={effect.value}>
                {effect.label}
              </option>
            ))}
          </select>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Intensity</span>
              <span>{params.intensity as number}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.intensity as number}
              onChange={(e) => onParamsChange({ intensity: parseInt(e.target.value) })}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        </div>
      );

    case "blend-node":
      return (
        <div className="space-y-2">
          <select
            className="w-full py-1.5 px-2 bg-white/5 rounded-lg text-sm text-white border border-white/10 focus:border-white/30 outline-none"
            value={params.mode as string}
            onChange={(e) => onParamsChange({ mode: e.target.value })}
          >
            {BLEND_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </option>
            ))}
          </select>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Opacity</span>
              <span>{params.opacity as number}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.opacity as number}
              onChange={(e) => onParamsChange({ opacity: parseInt(e.target.value) })}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        </div>
      );

    case "storyboard-frame":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Scene</span>
            <input
              type="number"
              min="1"
              value={params.sceneNumber as number}
              onChange={(e) => onParamsChange({ sceneNumber: parseInt(e.target.value) })}
              className="flex-1 py-1 px-2 bg-white/5 rounded text-sm text-white border border-white/10 focus:border-white/30 outline-none w-16"
            />
          </div>
          <textarea
            placeholder="Scene description..."
            value={params.description as string}
            onChange={(e) => onParamsChange({ description: e.target.value })}
            className="w-full py-1.5 px-2 bg-white/5 rounded-lg text-sm text-white border border-white/10 focus:border-white/30 outline-none resize-none h-16"
          />
          <select
            className="w-full py-1.5 px-2 bg-white/5 rounded-lg text-sm text-white border border-white/10 focus:border-white/30 outline-none"
            value={params.cameraMove as string}
            onChange={(e) => onParamsChange({ cameraMove: e.target.value })}
          >
            <option value="static">Static</option>
            <option value="pan-left">Pan Left</option>
            <option value="pan-right">Pan Right</option>
            <option value="tilt-up">Tilt Up</option>
            <option value="tilt-down">Tilt Down</option>
            <option value="zoom-in">Zoom In</option>
            <option value="zoom-out">Zoom Out</option>
            <option value="dolly">Dolly</option>
            <option value="crane">Crane</option>
          </select>
        </div>
      );

    case "text-generator":
      return (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter text..."
            value={params.text as string}
            onChange={(e) => onParamsChange({ text: e.target.value })}
            className="w-full py-1.5 px-2 bg-white/5 rounded-lg text-sm text-white border border-white/10 focus:border-white/30 outline-none"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min="12"
              max="200"
              value={params.fontSize as number}
              onChange={(e) => onParamsChange({ fontSize: parseInt(e.target.value) })}
              className="w-16 py-1 px-2 bg-white/5 rounded text-sm text-white border border-white/10 focus:border-white/30 outline-none"
            />
            <input
              type="color"
              value={params.color as string}
              onChange={(e) => onParamsChange({ color: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
          <select
            className="w-full py-1.5 px-2 bg-white/5 rounded-lg text-sm text-white border border-white/10 focus:border-white/30 outline-none"
            value={params.animation as string}
            onChange={(e) => onParamsChange({ animation: e.target.value })}
          >
            <option value="none">No Animation</option>
            <option value="fade">Fade In</option>
            <option value="slide-up">Slide Up</option>
            <option value="typewriter">Typewriter</option>
            <option value="bounce">Bounce</option>
            <option value="glitch">Glitch</option>
          </select>
        </div>
      );

    case "ai-generator":
      return (
        <AIGeneratorControls
          params={params}
          onParamsChange={onParamsChange}
          onGenerate={onGenerate || (() => { })}
          isProcessing={params.isProcessing as boolean}
        />
      );

    case "audio-waveform":
      return (
        <div className="space-y-2">
          <select
            className="w-full py-1.5 px-2 bg-white/5 rounded-lg text-sm text-white border border-white/10 focus:border-white/30 outline-none"
            value={params.style as string}
            onChange={(e) => onParamsChange({ style: e.target.value })}
          >
            <option value="bars">Bars</option>
            <option value="line">Line</option>
            <option value="circle">Circle</option>
            <option value="mirror">Mirror</option>
            <option value="spectrum">Spectrum</option>
          </select>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Color</span>
            <input
              type="color"
              value={params.color as string}
              onChange={(e) => onParamsChange({ color: e.target.value })}
              className="w-8 h-6 rounded cursor-pointer"
            />
          </div>
        </div>
      );

    case "export-node":
      return (
        <div className="space-y-2">
          <select
            className="w-full py-1.5 px-2 bg-white/5 rounded-lg text-sm text-white border border-white/10 focus:border-white/30 outline-none"
            value={params.platform as string}
            onChange={(e) => onParamsChange({ platform: e.target.value })}
          >
            <option value="instagram_story">Instagram Story</option>
            <option value="instagram_reel">Instagram Reel</option>
            <option value="instagram_post">Instagram Post</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="youtube_short">YouTube Short</option>
            <option value="twitter">Twitter/X</option>
            <option value="custom">Custom</option>
          </select>
          <button className="w-full py-2 px-3 bg-green-500 hover:bg-green-600 rounded-lg text-sm text-white font-medium transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      );

    default:
      return null;
  }
};

// =============================================================================
// Node Palette (for spawning nodes)
// =============================================================================

interface NodePaletteProps {
  onSpawnNode: (nodeType: ProductionNodeType, x: number, y: number) => void;
  position: { x: number; y: number };
}

export const NodePalette: React.FC<NodePaletteProps> = ({
  onSpawnNode,
  position,
}) => {
  const categories = {
    input: { label: "Input", color: "#4ade80" },
    process: { label: "Process", color: "#a78bfa" },
    generate: { label: "Generate", color: "#f472b6" },
    compose: { label: "Compose", color: "#fb923c" },
    output: { label: "Output", color: "#f43f5e" },
  };

  const nodesByCategory = Object.entries(PRODUCTION_NODE_DEFINITIONS).reduce(
    (acc, [type, def]) => {
      if (!acc[def.category]) acc[def.category] = [];
      acc[def.category].push({ type: type as ProductionNodeType, ...def });
      return acc;
    },
    {} as Record<string, Array<{ type: ProductionNodeType } & (typeof PRODUCTION_NODE_DEFINITIONS)[ProductionNodeType]>>
  );

  return (
    <div className="bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden w-64">
      <div className="px-3 py-2 border-b border-white/10">
        <h3 className="text-sm font-medium text-white">Add Node</h3>
      </div>
      <div className="p-2 space-y-2 max-h-[400px] overflow-y-auto">
        {Object.entries(categories).map(([category, { label, color }]) => (
          <div key={category}>
            <div
              className="text-[10px] uppercase tracking-wider px-2 py-1"
              style={{ color }}
            >
              {label}
            </div>
            <div className="space-y-0.5">
              {nodesByCategory[category]?.map(({ type, label: nodeLabel, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => onSpawnNode(type, position.x, position.y)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <span style={{ color }}><Icon className="w-4 h-4" /></span>
                  <span className="text-sm text-white/70">{nodeLabel}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// Exports
// =============================================================================

export default ProductionNode;
