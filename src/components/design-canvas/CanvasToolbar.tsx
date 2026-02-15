"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  MousePointer2,
  Hand,
  Type,
  StickyNote,
  Square,
  Image,
  Code2,
  Sparkles,
  Minus,
  ArrowRight,
  Mic,
  MicOff,
  Plus,
  X,
  Video,
  Music,
  Layers,
  ChevronUp,
  GitBranch,
} from "lucide-react";
import { useVoiceInput } from "@/hooks/useVoiceInput";

interface CanvasToolbarProps {
  selectedTool: string;
  onToolChange: (tool: string) => void;
  onVoicePrompt?: (transcript: string) => void;
}

const tools = [
  { id: "select", icon: MousePointer2, label: "Select", shortcut: "V" },
  { id: "pan", icon: Hand, label: "Pan", shortcut: "H" },
  { id: "text", icon: Type, label: "Text", shortcut: "T" },
  { id: "sticky", icon: StickyNote, label: "Sticky", shortcut: "S" },
  { id: "mindmap", icon: GitBranch, label: "Mindmap", shortcut: "M" },
  { id: "diagram", icon: Layers, label: "Diagram", shortcut: "D" },
  { id: "shape", icon: Square, label: "Shape", shortcut: "R" },
  { id: "image", icon: Image, label: "Image", shortcut: "I" },
  { id: "audio", icon: Music, label: "Audio", shortcut: "U" },
  { id: "video", icon: Video, label: "Video", shortcut: "W" },
  { id: "code", icon: Code2, label: "Code", shortcut: "C" },
  { id: "ai", icon: Sparkles, label: "AI", shortcut: "G" },
];

// Mobile-optimized primary tools
const mobileTools = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "sticky", icon: StickyNote, label: "Sticky" },
  { id: "mindmap", icon: GitBranch, label: "Mindmap" },
  { id: "shape", icon: Square, label: "Shape" },
  { id: "ai", icon: Sparkles, label: "AI" },
];

const colors = [
  { color: "#3b82f6", name: "Blue" },
  { color: "#fef08a", name: "Yellow" },
  { color: "#22c55e", name: "Green" },
  { color: "#8b5cf6", name: "Purple" },
  { color: "#ef4444", name: "Red" },
  { color: "#f97316", name: "Orange" },
];

export function CanvasToolbar({ selectedTool, onToolChange, onVoicePrompt }: CanvasToolbarProps) {
  const [showAllTools, setShowAllTools] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0].color);

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    toggleListening,
    resetTranscript,
  } = useVoiceInput({
    onTranscript: (text) => {
      onVoicePrompt?.(text);
    },
    continuous: true, // Keep mic active until user stops it
  });

  return (
    <>
      {/* Desktop toolbar */}
      <div className="hidden sm:flex items-center gap-1 px-4 py-2 border-t bg-background/50">
        <div className="flex items-center gap-0.5 p-1 rounded-lg bg-muted/50">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "h-8 w-8 p-0",
                selectedTool === tool.id && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => onToolChange(tool.id)}
              title={`${tool.label} (${tool.shortcut})`}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <div className="h-6 w-px bg-border mx-2" />

        {/* Color picker */}
        <div className="flex items-center gap-1">
          {colors.map((c) => (
            <button
              key={c.color}
              className={cn(
                "h-6 w-6 rounded-full border-2 shadow-sm cursor-pointer transition-transform",
                selectedColor === c.color
                  ? "border-foreground scale-110"
                  : "border-background hover:scale-105"
              )}
              style={{ backgroundColor: c.color }}
              onClick={() => setSelectedColor(c.color)}
              title={c.name}
            />
          ))}
        </div>

        <div className="h-6 w-px bg-border mx-2" />

        {/* Voice input button */}
        {isSupported && (
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            className="gap-2"
            onClick={toggleListening}
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4" />
                <span className="animate-pulse">Listening...</span>
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                <span>Voice</span>
              </>
            )}
          </Button>
        )}

        <div className="ml-auto text-xs text-muted-foreground">
          Double-click to add | Scroll to zoom | Drag to pan
        </div>
      </div>

      {/* Mobile toolbar */}
      <div className="sm:hidden border-t bg-background/95 backdrop-blur-sm">
        {/* Voice transcript display */}
        <AnimatePresence>
          {(isListening || interimTranscript || transcript) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 py-2 border-b bg-purple-500/10"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm flex-1">
                  {interimTranscript || transcript || "Listening..."}
                </span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={resetTranscript}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main mobile toolbar */}
        <div className="flex items-center justify-between px-2 py-2">
          {/* Primary tools */}
          <div className="flex items-center gap-1">
            {mobileTools.map((tool) => (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "h-10 w-10 p-0",
                  selectedTool === tool.id && "bg-primary text-primary-foreground"
                )}
                onClick={() => onToolChange(tool.id)}
              >
                <tool.icon className="h-5 w-5" />
              </Button>
            ))}

            {/* More tools button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0"
              onClick={() => setShowAllTools(!showAllTools)}
            >
              <ChevronUp className={cn("h-5 w-5 transition-transform", showAllTools && "rotate-180")} />
            </Button>
          </div>

          {/* Voice input button */}
          {isSupported && (
            <Button
              variant={isListening ? "destructive" : "default"}
              size="sm"
              className={cn(
                "h-10 px-4 gap-2",
                isListening && "animate-pulse"
              )}
              onClick={toggleListening}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              <span className="text-sm">{isListening ? "Stop" : "Voice"}</span>
            </Button>
          )}
        </div>

        {/* Expanded tools panel */}
        <AnimatePresence>
          {showAllTools && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t bg-muted/30 overflow-hidden"
            >
              <div className="p-3">
                {/* All tools grid */}
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                        selectedTool === tool.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-muted"
                      )}
                      onClick={() => {
                        onToolChange(tool.id);
                        setShowAllTools(false);
                      }}
                    >
                      <tool.icon className="h-5 w-5" />
                      <span className="text-xs">{tool.label}</span>
                    </button>
                  ))}
                </div>

                {/* Color picker */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Color:</span>
                  <div className="flex items-center gap-1.5">
                    {colors.map((c) => (
                      <button
                        key={c.color}
                        aria-label={`Select ${c.name || c.color} color`}
                        title={c.name || c.color}
                        className={cn(
                          "h-8 w-8 rounded-full border-2 shadow-sm transition-transform",
                          selectedColor === c.color
                            ? "border-foreground scale-110"
                            : "border-background"
                        )}
                        style={{ backgroundColor: c.color }}
                        onClick={() => setSelectedColor(c.color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile floating action button */}
      <MobileFloatingActions
        onToolChange={onToolChange}
        selectedTool={selectedTool}
      />
    </>
  );
}

// Mobile floating action button for quick add
function MobileFloatingActions({
  onToolChange,
  selectedTool,
}: {
  onToolChange: (tool: string) => void;
  selectedTool: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    { id: "sticky", icon: StickyNote, label: "Sticky", color: "bg-yellow-400" },
    { id: "ai", icon: Sparkles, label: "AI Generate", color: "bg-purple-500" },
    { id: "image", icon: Image, label: "Image", color: "bg-blue-500" },
    { id: "audio", icon: Music, label: "Audio", color: "bg-green-500" },
    { id: "multimodal", icon: Layers, label: "Multi-modal", color: "bg-gradient-to-r from-indigo-500 to-purple-500" },
  ];

  return (
    <div className="sm:hidden fixed bottom-24 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 flex flex-col gap-2"
          >
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full shadow-lg text-white",
                  action.color
                )}
                onClick={() => {
                  onToolChange(action.id);
                  setIsOpen(false);
                }}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-colors",
          isOpen
            ? "bg-muted text-muted-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }}>
          {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
}
