/**
 * AI Generator Controls Component
 *
 * Enhanced UI for AI Generator node with multi-provider support:
 * - Provider selection (Gemini, Replicate, fal.ai, WaveSpeed)
 * - Model selection with search
 * - Support for text-to-image, image-to-image, text-to-video, image-to-video
 */

"use client";

import { useState, useEffect } from "react";
import { Sparkles, Search, Loader2, ChevronDown, Video, Image as ImageIcon } from "lucide-react";
import { ProviderType, ProviderModel, ModelCapability } from "@/lib/providers/types";
import { cn } from "@/lib/utils";

interface AIGeneratorControlsProps {
  params: Record<string, unknown>;
  onParamsChange: (params: Record<string, unknown>) => void;
  onGenerate: () => void;
  isProcessing?: boolean;
}

const PROVIDERS: Array<{ id: ProviderType; name: string; icon: string }> = [
  { id: "gemini", name: "Gemini", icon: "✨" },
  { id: "replicate", name: "Replicate", icon: "🔄" },
  { id: "fal", name: "fal.ai", icon: "⚡" },
  { id: "wavespeed", name: "WaveSpeed", icon: "🌊" },
];

export function AIGeneratorControls({
  params,
  onParamsChange,
  onGenerate,
  isProcessing = false,
}: AIGeneratorControlsProps) {
  const [models, setModels] = useState<ProviderModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [filteredModels, setFilteredModels] = useState<ProviderModel[]>([]);

  const selectedProvider = (params.provider as ProviderType) || "gemini";
  const selectedModelId = (params.modelId as string) || "";
  const prompt = (params.prompt as string) || "";

  // Load models when provider changes
  useEffect(() => {
    const loadModels = async () => {
      setLoadingModels(true);
      try {
        const response = await fetch(`/api/providers/models?provider=${selectedProvider}`);
        const data = await response.json();
        if (data.success) {
          setModels(data.models || []);
          setFilteredModels(data.models || []);
        }
      } catch (error) {
        console.error("Failed to load models:", error);
        setModels([]);
        setFilteredModels([]);
      } finally {
        setLoadingModels(false);
      }
    };

    loadModels();
  }, [selectedProvider]);

  // Filter models by search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredModels(models);
      return;
    }

    const query = searchQuery.toLowerCase();
    setFilteredModels(
      models.filter(
        (model) =>
          model.name.toLowerCase().includes(query) ||
          model.description?.toLowerCase().includes(query) ||
          model.id.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, models]);

  // Get selected model
  const selectedModel = models.find((m) => m.id === selectedModelId);

  // Get model capabilities for display
  const getCapabilityIcon = (cap: ModelCapability) => {
    if (cap.includes("video")) return <Video className="w-3 h-3" />;
    return <ImageIcon className="w-3 h-3" />;
  };

  const handleProviderChange = (provider: ProviderType) => {
    onParamsChange({ provider, modelId: "" }); // Reset model when provider changes
    setShowModelDropdown(false);
  };

  const handleModelSelect = (modelId: string) => {
    onParamsChange({ modelId });
    setShowModelDropdown(false);
    setSearchQuery("");
  };

  return (
    <div className="space-y-2">
      {/* Prompt Input */}
      <textarea
        placeholder="Describe what to generate..."
        value={prompt}
        onChange={(e) => onParamsChange({ prompt: e.target.value })}
        className="w-full py-1.5 px-2 bg-white/5 rounded-lg text-sm text-white border border-white/10 focus:border-white/30 outline-none resize-none h-20 placeholder:text-white/30"
      />

      {/* Provider Selection */}
      <div className="flex gap-1">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleProviderChange(provider.id)}
            className={cn(
              "flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors",
              selectedProvider === provider.id
                ? "bg-white/20 text-white"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
            )}
            title={provider.name}
          >
            <span className="mr-1">{provider.icon}</span>
            {provider.name}
          </button>
        ))}
      </div>

      {/* Model Selection */}
      <div className="relative">
        <button
          onClick={() => setShowModelDropdown(!showModelDropdown)}
          disabled={loadingModels}
          className={cn(
            "w-full py-1.5 px-2 bg-white/5 rounded-lg text-sm text-white border border-white/10 focus:border-white/30 outline-none flex items-center justify-between",
            loadingModels && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="truncate">
            {loadingModels ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Loading models...
              </span>
            ) : selectedModel ? (
              <span className="flex items-center gap-2">
                {selectedModel.name}
                <span className="text-xs text-white/50">
                  ({selectedModel.capabilities.map((c) => c.split("-")[2] || c).join(", ")})
                </span>
              </span>
            ) : (
              "Select a model..."
            )}
          </span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", showModelDropdown && "rotate-180")} />
        </button>

        {/* Model Dropdown */}
        {showModelDropdown && !loadingModels && (
          <div className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl max-h-64 overflow-hidden flex flex-col">
            {/* Search */}
            <div className="p-2 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 bg-white/5 rounded text-xs text-white border border-white/10 focus:border-white/30 outline-none placeholder:text-white/30"
                  autoFocus
                />
              </div>
            </div>

            {/* Model List */}
            <div className="overflow-y-auto flex-1">
              {filteredModels.length === 0 ? (
                <div className="p-4 text-xs text-white/50 text-center">No models found</div>
              ) : (
                filteredModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelSelect(model.id)}
                    className={cn(
                      "w-full px-3 py-2 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0",
                      selectedModelId === model.id && "bg-white/10"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">{model.name}</div>
                        {model.description && (
                          <div className="text-[10px] text-white/50 mt-0.5 line-clamp-1">{model.description}</div>
                        )}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {model.capabilities.map((cap) => (
                            <span
                              key={cap}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-white/70"
                            >
                              {getCapabilityIcon(cap)}
                              {cap.split("-")[2] || cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={!prompt.trim() || !selectedModelId || isProcessing}
        className={cn(
          "w-full py-2 px-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-sm text-white font-medium transition-all flex items-center justify-center gap-2",
          (!prompt.trim() || !selectedModelId || isProcessing) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate
          </>
        )}
      </button>

      {/* Model Info */}
      {selectedModel && (
        <div className="text-[10px] text-white/40 space-y-0.5">
          <div>Provider: {selectedModel.provider}</div>
          {selectedModel.pricing && (
            <div>
              ${selectedModel.pricing.amount.toFixed(3)} per {selectedModel.pricing.type === "per-run" ? "run" : "second"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
