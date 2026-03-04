"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  Sparkles,
  Image,
  Layout,
  Palette,
  Box,
  Music,
  Video,
  Code2,
  Wand2,
  Star,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptLibraryProps {
  onSelectPrompt: (prompt: {
    prompt: string;
    negativePrompt?: string;
    provider: string;
    model?: string;
    category: string;
  }) => void;
  onClose: () => void;
}

interface Prompt {
  id: string;
  name: string;
  description?: string;
  prompt: string;
  negativePrompt?: string;
  category: string;
  provider: string;
  modelId?: string;
  tags: string[];
  usageCount: number;
  isFeatured: boolean;
}

// Default prompts
const defaultPrompts: Prompt[] = [
  {
    id: "1",
    name: "Modern UI Component",
    description: "Clean, minimalist UI component design",
    prompt: "A sleek, modern UI component with glass morphism effects, subtle gradients, rounded corners, and a dark theme. Professional and polished.",
    category: "ui_design",
    provider: "any",
    tags: ["ui", "glassmorphism", "modern"],
    usageCount: 150,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Abstract Gradient Art",
    description: "Flowing abstract gradients",
    prompt: "Abstract flowing gradient art with vibrant colors blending seamlessly, ethereal glow effects, 4K quality, digital art masterpiece",
    category: "abstract",
    provider: "any",
    tags: ["abstract", "gradient", "colorful"],
    usageCount: 120,
    isFeatured: true,
  },
  {
    id: "3",
    name: "Product Hero Shot",
    description: "Professional product photography",
    prompt: "Professional product photography, studio lighting, clean white background, subtle shadows, commercial quality, 8K resolution",
    category: "photo",
    provider: "any",
    tags: ["product", "photography", "commercial"],
    usageCount: 95,
    isFeatured: false,
  },
  {
    id: "4",
    name: "Isometric 3D Scene",
    description: "Cute isometric illustration",
    prompt: "Cute isometric 3D illustration, soft pastel colors, minimal design, clean geometric shapes, playful and modern",
    category: "3d",
    provider: "any",
    tags: ["3d", "isometric", "cute"],
    usageCount: 88,
    isFeatured: true,
  },
  {
    id: "5",
    name: "App Icon Design",
    description: "Modern app icon",
    prompt: "Modern app icon design, bold gradient colors, simple shape, iOS style, glossy finish, professional quality",
    category: "icon",
    provider: "any",
    tags: ["icon", "app", "ios"],
    usageCount: 75,
    isFeatured: false,
  },
  {
    id: "6",
    name: "Character Portrait",
    description: "Stylized character art",
    prompt: "Stylized character portrait, vibrant colors, expressive eyes, anime-inspired, professional digital art, detailed shading",
    category: "character",
    provider: "any",
    tags: ["character", "portrait", "anime"],
    usageCount: 110,
    isFeatured: true,
  },
  {
    id: "7",
    name: "Fantasy Landscape",
    description: "Magical environment",
    prompt: "Magical fantasy landscape, ethereal lighting, floating islands, waterfalls, lush vegetation, cinematic composition, concept art quality",
    category: "landscape",
    provider: "any",
    tags: ["landscape", "fantasy", "magical"],
    usageCount: 100,
    isFeatured: false,
  },
  {
    id: "8",
    name: "Seamless Pattern",
    description: "Tileable texture pattern",
    prompt: "Seamless tileable pattern, geometric shapes, modern design, subtle colors, perfect for backgrounds, high quality texture",
    category: "texture",
    provider: "any",
    tags: ["pattern", "texture", "seamless"],
    usageCount: 65,
    isFeatured: false,
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  ui_design: <Layout className="h-4 w-4" />,
  illustration: <Palette className="h-4 w-4" />,
  photo: <Image className="h-4 w-4" />,
  "3d": <Box className="h-4 w-4" />,
  icon: <Sparkles className="h-4 w-4" />,
  texture: <Layout className="h-4 w-4" />,
  character: <Wand2 className="h-4 w-4" />,
  landscape: <Image className="h-4 w-4" />,
  abstract: <Palette className="h-4 w-4" />,
  code: <Code2 className="h-4 w-4" />,
  audio: <Music className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
  other: <Sparkles className="h-4 w-4" />,
};

const categories = [
  { id: "all", label: "All" },
  { id: "ui_design", label: "UI" },
  { id: "illustration", label: "Art" },
  { id: "photo", label: "Photo" },
  { id: "3d", label: "3D" },
  { id: "character", label: "Character" },
  { id: "landscape", label: "Landscape" },
];

export function PromptLibrary({ onSelectPrompt, onClose }: PromptLibraryProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<"featured" | "popular" | "all">("featured");

  const prompts = defaultPrompts;

  // Filter prompts
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      !search ||
      prompt.name.toLowerCase().includes(search.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(search.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || prompt.category === selectedCategory;

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "featured" && prompt.isFeatured) ||
      (activeTab === "popular" && prompt.usageCount > 80);

    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            AI Prompt Library
          </h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-2">
        <div className="flex gap-1 p-1 rounded-lg bg-muted">
          {(["featured", "popular", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors",
                activeTab === tab
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "featured" && <Star className="inline h-3 w-3 mr-1" />}
              {tab === "popular" && <TrendingUp className="inline h-3 w-3 mr-1" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Category filters */}
      <div className="px-4 py-2 flex gap-1 overflow-x-auto">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs whitespace-nowrap"
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Prompt list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No prompts found</p>
          </div>
        ) : (
          filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onClick={() =>
                onSelectPrompt({
                  prompt: prompt.prompt,
                  negativePrompt: prompt.negativePrompt,
                  provider: prompt.provider,
                  model: prompt.modelId,
                  category: prompt.category,
                })
              }
            />
          ))
        )}
      </div>

      {/* AI Provider info */}
      <div className="p-4 border-t bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          Ready for Fal AI, Replicate, and HuggingFace
        </p>
        <div className="flex justify-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">Fal AI</Badge>
          <Badge variant="outline" className="text-xs">Replicate</Badge>
          <Badge variant="outline" className="text-xs">HuggingFace</Badge>
        </div>
      </div>
    </div>
  );
}

interface PromptCardProps {
  prompt: Prompt;
  onClick: () => void;
}

function PromptCard({ prompt, onClick }: PromptCardProps) {
  return (
    <button
      className={cn(
        "w-full text-left p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors",
        prompt.isFeatured && "border-purple-500/30 bg-purple-500/5"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="p-1.5 rounded-md bg-muted">
          {categoryIcons[prompt.category] || <Sparkles className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{prompt.name}</h4>
          {prompt.description && (
            <p className="text-xs text-muted-foreground truncate">
              {prompt.description}
            </p>
          )}
        </div>
        {prompt.isFeatured && (
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 shrink-0" />
        )}
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
        {prompt.prompt}
      </p>
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-wrap flex-1">
          {prompt.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
              {tag}
            </Badge>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {prompt.usageCount} uses
        </span>
      </div>
    </button>
  );
}
