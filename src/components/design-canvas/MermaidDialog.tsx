"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, Play, Download, Sparkles, GitBranch, Code2, Upload, ChevronDown } from "lucide-react";
import DOMPurify from "dompurify";
import { MERMAID_TEMPLATES, mermaidToCanvas, canvasToMermaid, buildDiagramPrompt } from "@/lib/canvas/diagram-utils";

interface MermaidDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (
    nodes: Array<{
      id: string;
      type: string;
      x: number;
      y: number;
      width: number;
      height: number;
      content: string;
      style?: Record<string, unknown>;
    }>,
    edges: Array<{
      id: string;
      source: string;
      target: string;
      type: string;
      label?: string;
    }>
  ) => void;
  existingNodes?: Array<{ id: string; type: string; x: number; y: number; width: number; height: number; content: string; style?: Record<string, unknown> }>;
  existingEdges?: Array<{ id: string; source: string; target: string; type: string; label?: string }>;
}

export function MermaidDialog({ open, onClose, onInsert, existingNodes, existingEdges }: MermaidDialogProps) {
  const [tab, setTab] = useState<"mermaid" | "ai">("mermaid");
  const [definition, setDefinition] = useState(MERMAID_TEMPLATES.flowchart.code);
  const [aiPrompt, setAiPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [previewSvg, setPreviewSvg] = useState<string>("");
  const [isRendering, setIsRendering] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Render Mermaid preview
  const renderPreview = useCallback(async () => {
    if (!definition.trim()) {
      setPreviewSvg("");
      setError(null);
      return;
    }

    setIsRendering(true);
    setError(null);

    try {
      const mermaidModule = await import("mermaid");
      const mermaid = mermaidModule.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          primaryColor: "#3b82f6",
          primaryTextColor: "#ffffff",
          primaryBorderColor: "#1d4ed8",
          lineColor: "#6b7280",
          secondaryColor: "#8b5cf6",
          tertiaryColor: "#22c55e",
        },
      });

      const uniqueId = `mermaid-preview-${Date.now()}`;
      const { svg } = await mermaid.render(uniqueId, definition);
      setPreviewSvg(svg);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to parse Mermaid syntax";
      setError(message);
      setPreviewSvg("");
    } finally {
      setIsRendering(false);
    }
  }, [definition]);

  // Auto-render on definition change (debounced)
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(renderPreview, 500);
    return () => clearTimeout(timer);
  }, [definition, open, renderPreview]);

  // Insert diagram to canvas
  const handleInsert = useCallback(async () => {
    try {
      const { nodes, edges } = await mermaidToCanvas(definition);
      if (nodes.length === 0) {
        setError("No diagram elements found. Check your Mermaid syntax.");
        return;
      }
      onInsert(nodes, edges);
      onClose();
    } catch (err) {
      setError("Failed to convert diagram. Please check the syntax.");
    }
  }, [definition, onInsert, onClose]);

  // Generate Mermaid from AI
  const handleAIGenerate = useCallback(async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const prompt = buildDiagramPrompt(aiPrompt);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          model: "claude",
        }),
      });

      if (!response.ok) throw new Error("AI generation failed");

      const data = await response.json();
      const generatedText = data.content || data.message?.content || "";
      
      // Clean up the response - extract just the Mermaid code
      let mermaidCode = generatedText
        .replace(/```mermaid\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      if (mermaidCode) {
        setDefinition(mermaidCode);
        setTab("mermaid");
      } else {
        setError("AI could not generate a valid diagram. Try a more specific description.");
      }
    } catch (err) {
      setError("Failed to generate diagram. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [aiPrompt]);

  // Reverse engineer: canvas to Mermaid
  const handleReverseEngineer = useCallback(() => {
    if (!existingNodes || existingNodes.length === 0) {
      setError("No canvas elements to reverse engineer.");
      return;
    }
    const mermaid = canvasToMermaid(existingNodes, existingEdges || []);
    setDefinition(mermaid);
    setTab("mermaid");
  }, [existingNodes, existingEdges]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl max-h-[85vh] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <GitBranch className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Text to Diagram</h2>
            </div>
            <div className="flex items-center gap-2">
              {existingNodes && existingNodes.length > 0 && (
                <button
                  onClick={handleReverseEngineer}
                  className="px-3 py-1.5 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  From Canvas
                </button>
              )}
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b px-6">
            <button
              onClick={() => setTab("mermaid")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
                tab === "mermaid"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Code2 className="w-4 h-4 inline mr-1.5" />
              Mermaid
            </button>
            <button
              onClick={() => setTab("ai")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
                tab === "ai"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="w-4 h-4 inline mr-1.5" />
              AI Generate
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left: Input */}
            <div className="flex-1 flex flex-col border-r min-h-0">
              {tab === "mermaid" ? (
                <>
                  {/* Template selector */}
                  <div className="px-4 py-2 border-b">
                    <div className="relative">
                      <button
                        onClick={() => setShowTemplates(!showTemplates)}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Templates
                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showTemplates && "rotate-180")} />
                      </button>
                      {showTemplates && (
                        <div className="absolute top-full left-0 mt-1 z-10 bg-background border rounded-lg shadow-lg py-1 min-w-[180px]">
                          {Object.entries(MERMAID_TEMPLATES).map(([key, template]) => (
                            <button
                              key={key}
                              onClick={() => {
                                setDefinition(template.code);
                                setShowTemplates(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                            >
                              {template.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <textarea
                    value={definition}
                    onChange={(e) => setDefinition(e.target.value)}
                    className="flex-1 p-4 bg-transparent font-mono text-sm resize-none outline-none min-h-[200px]"
                    placeholder="Enter Mermaid diagram syntax..."
                    spellCheck={false}
                  />
                </>
              ) : (
                <div className="flex-1 flex flex-col p-4 gap-4">
                  <p className="text-sm text-muted-foreground">
                    Describe your diagram in natural language and AI will generate the Mermaid syntax.
                  </p>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex-1 p-3 bg-muted/30 rounded-lg text-sm resize-none outline-none border focus:border-primary transition-colors min-h-[150px]"
                    placeholder="e.g., A user authentication flow with login, registration, password reset, and email verification..."
                  />
                  <button
                    onClick={handleAIGenerate}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className={cn(
                      "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isGenerating
                        ? "bg-muted text-muted-foreground cursor-wait"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Sparkles className={cn("w-4 h-4", isGenerating && "animate-spin")} />
                    {isGenerating ? "Generating..." : "Generate Diagram"}
                  </button>
                </div>
              )}
            </div>

            {/* Right: Preview */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="px-4 py-2 border-b flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Preview</span>
                {isRendering && (
                  <span className="text-xs text-muted-foreground animate-pulse">Rendering...</span>
                )}
              </div>
              <div
                ref={previewRef}
                className="flex-1 overflow-auto p-4 flex items-center justify-center min-h-[200px]"
              >
                {previewSvg ? (
                  <div
                    className="max-w-full [&_svg]:max-w-full [&_svg]:h-auto"
                    dangerouslySetInnerHTML={{ __html: previewSvg }}
                  />
                ) : error ? (
                  <div className="text-center text-sm">
                    <div className="text-red-400 mb-2">Syntax Error</div>
                    <div className="text-muted-foreground text-xs max-w-xs">{error}</div>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm text-center">
                    <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>Enter Mermaid syntax to see preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error bar */}
          {error && tab === "mermaid" && (
            <div className="px-6 py-2 bg-red-500/10 border-t border-red-500/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={renderPreview}
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                Preview
              </button>
              <button
                onClick={handleInsert}
                disabled={!definition.trim()}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg font-medium transition-colors",
                  definition.trim()
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Download className="w-3.5 h-3.5" />
                Insert to Canvas
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
