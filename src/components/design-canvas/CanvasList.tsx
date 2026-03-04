"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Layout,
  Layers,
  Map,
  Film,
  GitBranch,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Canvas {
  _id: string;
  name: string;
  description?: string;
  canvasType: string;
  status: string;
  createdAt: number;
  updatedAt: number;
  thumbnailUrl?: string;
}

interface CanvasListProps {
  canvases: Canvas[];
  onSelect: (canvasId: string) => void;
  onCreateNew: () => void;
}

const canvasTypeIcons: Record<string, React.ReactNode> = {
  freeform: <Layout className="h-5 w-5" />,
  wireframe: <Layers className="h-5 w-5" />,
  moodboard: <Map className="h-5 w-5" />,
  storyboard: <Film className="h-5 w-5" />,
  mindmap: <GitBranch className="h-5 w-5" />,
  flowchart: <Workflow className="h-5 w-5" />,
};

const canvasTypeColors: Record<string, string> = {
  freeform: "from-blue-500 to-cyan-500",
  wireframe: "from-gray-500 to-slate-600",
  moodboard: "from-pink-500 to-rose-500",
  storyboard: "from-purple-500 to-violet-500",
  mindmap: "from-green-500 to-emerald-500",
  flowchart: "from-orange-500 to-amber-500",
};

// Simple relative time formatter
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function CanvasList({ canvases, onSelect, onCreateNew }: CanvasListProps) {
  if (canvases.length === 0) {
    return <EmptyState onCreateNew={onCreateNew} />;
  }

  return (
    <div className="space-y-6">
      {/* Recent canvases section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Canvases</h2>
          <Button onClick={onCreateNew} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Canvas
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {canvases.map((canvas, index) => (
            <CanvasCard
              key={canvas._id}
              canvas={canvas}
              onClick={() => onSelect(canvas._id)}
              index={index}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

interface CanvasCardProps {
  canvas: Canvas;
  onClick: () => void;
  index: number;
}

function CanvasCard({ canvas, onClick, index }: CanvasCardProps) {
  const gradient = canvasTypeColors[canvas.canvasType] || canvasTypeColors.freeform;
  const icon = canvasTypeIcons[canvas.canvasType] || canvasTypeIcons.freeform;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <button
        onClick={onClick}
        className="w-full text-left rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all hover:border-primary/50"
      >
        {/* Thumbnail / Gradient */}
        <div className={cn("aspect-video relative bg-gradient-to-br", gradient)}>
          {canvas.thumbnailUrl ? (
            <img
              src={canvas.thumbnailUrl}
              alt={canvas.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/80">
              {icon}
            </div>
          )}

          {/* Status badge */}
          {canvas.status === "template" && (
            <Badge className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm text-white">
              Template
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-medium truncate">{canvas.name}</h3>
          {canvas.description && (
            <p className="text-sm text-muted-foreground truncate mt-0.5">
              {canvas.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-2">
            <Badge variant="secondary" className="text-xs capitalize">
              {canvas.canvasType}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(canvas.updatedAt)}
            </span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

function EmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6">
        <Layout className="h-10 w-10 text-purple-500" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Start Your First Canvas</h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Create infinite canvases to explore ideas, design interfaces, plan projects,
        and generate AI art - all in one place.
      </p>

      <Button onClick={onCreateNew} size="lg" className="gap-2">
        <Plus className="h-5 w-5" />
        Create Your First Canvas
      </Button>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-2xl">
        <FeatureCard
          icon={<Layout className="h-5 w-5" />}
          title="Infinite Space"
          description="Unlimited canvas to explore any idea"
        />
        <FeatureCard
          icon={<Layers className="h-5 w-5" />}
          title="Project Linked"
          description="Connect canvases to your projects"
        />
        <FeatureCard
          icon={<Layout className="h-5 w-5" />}
          title="AI Generation"
          description="Generate images, code, and more"
        />
      </div>
    </motion.div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-4 rounded-lg bg-muted/50">
      <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-2">
        {icon}
      </div>
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
