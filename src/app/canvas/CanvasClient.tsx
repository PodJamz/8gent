"use client";

import { useState, useCallback, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "@/lib/openclaw/hooks";
import { api } from '@/lib/convex-shim';
import { Id } from "../../../convex/_generated/dataModel";
import { PageTransition } from "@/components/ios/PageTransition";
import { InfiniteCanvas, type CanvasData, type CanvasNode, type CanvasEdge } from "@/components/design-canvas/InfiniteCanvas";
import { FloatingToolDock } from "@/components/design-canvas/FloatingToolDock";
import { PromptLibrary } from "@/components/design-canvas/PromptLibrary";
import { CanvasList } from "@/components/design-canvas/CanvasList";
import { ImageBrowser } from "@/components/design-canvas/ImageBrowser";
import { MermaidDialog } from "@/components/design-canvas/MermaidDialog";
import { Button } from "@/components/ui/button";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { useCanvasContext } from "@/context/CanvasContext";
import {
  ArrowLeft,
  Plus,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize,
  X,
  Loader2,
  FolderOpen,
} from "lucide-react";

type CanvasType = "freeform" | "wireframe" | "moodboard" | "storyboard" | "mindmap" | "flowchart";

function CanvasPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();

  // Canvas context for Claw AI control
  const { registerCanvas, unregisterCanvas, setCanvasState } = useCanvasContext();

  // URL params
  const canvasIdParam = searchParams.get("id");
  const modeParam = searchParams.get("mode");

  // View state
  const [view, setView] = useState<"list" | "editor">(canvasIdParam || modeParam === "import" ? "editor" : "list");
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const [showNewCanvasDialog, setShowNewCanvasDialog] = useState(false);
  const [showMermaidDialog, setShowMermaidDialog] = useState(false);

  // New canvas form
  const [newCanvasName, setNewCanvasName] = useState("");
  const [newCanvasType, setNewCanvasType] = useState<CanvasType>("freeform");

  // Selected canvas ID (Convex ID)
  const [selectedCanvasId, setSelectedCanvasId] = useState<Id<"designCanvases"> | null>(
    canvasIdParam ? (canvasIdParam as Id<"designCanvases">) : null
  );

  // Canvas state
  const [canvasData, setCanvasDataLocal] = useState<CanvasData>({
    nodes: [],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },
  });
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [isDirty, setIsDirty] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState<string | null>(null);
  const isProcessingVoice = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Convex queries
  const canvases = useQuery(
    api.designCanvas.getUserCanvases,
    user?.id ? { ownerId: user.id } : "skip"
  );

  const selectedCanvas = useQuery(
    api.designCanvas.getCanvas,
    selectedCanvasId ? { canvasId: selectedCanvasId } : "skip"
  );

  // Convex mutations
  const createCanvasMutation = useMutation(api.designCanvas.createCanvas);
  const updateCanvasDataMutation = useMutation(api.designCanvas.updateCanvasData);

  // Voice chat for Claw AI to speak responses
  const voiceChat = useVoiceChat({
    voice: 'nova',
    autoSpeak: true,
  });

  // Register canvas with CanvasContext when canvas loads (for Claw AI control)
  useEffect(() => {
    if (selectedCanvasId && canvasData.nodes.length >= 0) {
      registerCanvas(selectedCanvasId, {
        nodes: canvasData.nodes,
        edges: canvasData.edges,
        viewport: canvasData.viewport,
      });
    }

    return () => {
      unregisterCanvas();
    };
  }, [selectedCanvasId, registerCanvas, unregisterCanvas]);

  // Sync canvas state to CanvasContext when it changes (for Claw AI real-time control)
  useEffect(() => {
    if (selectedCanvasId) {
      setCanvasState({
        nodes: canvasData.nodes,
        edges: canvasData.edges,
        viewport: canvasData.viewport,
      });
    }
  }, [canvasData, selectedCanvasId, setCanvasState]);

  // Load canvas data when selectedCanvas changes
  useEffect(() => {
    if (selectedCanvas?.canvasData) {
      try {
        const data = JSON.parse(selectedCanvas.canvasData);
        setCanvasDataLocal(data);
        setIsDirty(false);
      } catch (e) {
        console.error("[Canvas] Failed to parse canvas data:", e);
      }
    }
  }, [selectedCanvas]);

  // Handle voice prompts - send to Claw AI and speak the response
  const handleVoicePrompt = useCallback(async (transcript: string) => {
    if (!transcript.trim() || isProcessingVoice.current) return;
    isProcessingVoice.current = true;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are Claw AI on the design canvas. Keep responses brief (1-2 sentences). The user is speaking to you while designing. Help them with canvas actions, design suggestions, or answer questions quickly. You can use canvas tools to manipulate the canvas directly.'
            },
            { role: 'user', content: transcript }
          ],
          model: 'qualification',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.message || data.content || "I heard you, but I'm not sure how to help with that.";
        setVoiceResponse(aiResponse);

        if (voiceChat.isVoiceEnabled || true) {
          voiceChat.enableVoice();
          voiceChat.speakResponse(aiResponse);
        }
      }
    } catch (error) {
      console.error('[Canvas Voice] Error:', error);
      voiceChat.speakResponse("Sorry, I had trouble processing that. Can you try again?");
    } finally {
      isProcessingVoice.current = false;
    }
  }, [voiceChat]);

  // Auto-dismiss voice response after speaking ends
  useEffect(() => {
    if (voiceChat.mode === 'idle' && voiceResponse) {
      const timer = setTimeout(() => setVoiceResponse(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [voiceChat.mode, voiceResponse]);

  // Handle import mode from PRD Studio
  useEffect(() => {
    if (modeParam === "import" && user?.id) {
      try {
        const importDataStr = sessionStorage.getItem("canvas_import_data");
        if (importDataStr) {
          const importData = JSON.parse(importDataStr);
          sessionStorage.removeItem("canvas_import_data");

          // Convert PRD Studio elements to canvas nodes
          const nodes: CanvasNode[] = (importData.elements || []).map((el: {
            id: string;
            type: string;
            label: string;
            description?: string;
            position: { x: number; y: number };
            color?: string;
          }) => ({
            id: el.id,
            type: el.type,
            x: el.position.x,
            y: el.position.y,
            width: 150,
            height: 60,
            content: el.label,
            style: el.color ? { backgroundColor: el.color } : undefined,
          }));

          // Create a new canvas with imported data via Convex
          createCanvasMutation({
            name: importData.prdTitle || "Imported from PRD",
            ownerId: user.id,
            canvasType: "flowchart",
          }).then((newCanvasId) => {
            setSelectedCanvasId(newCanvasId);
            setCanvasDataLocal({
              nodes,
              edges: [],
              viewport: { x: 0, y: 0, zoom: 1 },
            });
            setIsDirty(true);
            router.replace(`/canvas?id=${newCanvasId}`);
          });
        }
      } catch (e) {
        console.error("[Canvas] Failed to import canvas data:", e);
      }
    }
  }, [modeParam, user?.id, createCanvasMutation, router]);

  // Current canvas
  const currentCanvas = selectedCanvas;

  // Handle canvas selection
  const handleSelectCanvas = useCallback((canvasId: string) => {
    setSelectedCanvasId(canvasId as Id<"designCanvases">);
    setView("editor");
    router.push(`/canvas?id=${canvasId}`);
  }, [router]);

  // Handle create canvas
  const handleCreateCanvas = useCallback(async () => {
    if (!newCanvasName.trim() || !user?.id) return;

    try {
      const newCanvasId = await createCanvasMutation({
        name: newCanvasName.trim(),
        ownerId: user.id,
        canvasType: newCanvasType,
      });

      setShowNewCanvasDialog(false);
      setNewCanvasName("");
      handleSelectCanvas(newCanvasId);
    } catch (error) {
      console.error("[Canvas] Failed to create canvas:", error);
    }
  }, [newCanvasName, newCanvasType, user?.id, createCanvasMutation, handleSelectCanvas]);

  // Handle canvas data change
  const handleCanvasChange = useCallback((data: CanvasData) => {
    setCanvasDataLocal(data);
    setIsDirty(true);
  }, []);

  // Save canvas (debounced auto-save)
  const saveCanvas = useCallback(async () => {
    if (!selectedCanvasId || !isDirty) return;

    try {
      await updateCanvasDataMutation({
        canvasId: selectedCanvasId,
        canvasData: JSON.stringify(canvasData),
      });
      setIsDirty(false);
      console.log("[Canvas] Saved to Convex");
    } catch (error) {
      console.error("[Canvas] Failed to save:", error);
    }
  }, [selectedCanvasId, canvasData, isDirty, updateCanvasDataMutation]);

  // Manual save
  const handleSave = useCallback(() => {
    saveCanvas();
  }, [saveCanvas]);

  // Auto-save on canvas change (debounced)
  useEffect(() => {
    if (!isDirty || !selectedCanvasId) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveCanvas();
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isDirty, canvasData, selectedCanvasId, saveCanvas]);

  // Back to list
  const handleBack = useCallback(() => {
    setSelectedCanvasId(null);
    setView("list");
    router.push("/canvas");
  }, [router]);

  // Zoom controls - more gradual (10% per click, min 25%)
  const handleZoomIn = useCallback(() => {
    setCanvasDataLocal((prev) => ({
      ...prev,
      viewport: { ...prev.viewport, zoom: Math.min(prev.viewport.zoom * 1.1, 4) },
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setCanvasDataLocal((prev) => ({
      ...prev,
      viewport: { ...prev.viewport, zoom: Math.max(prev.viewport.zoom / 1.1, 0.25) },
    }));
  }, []);

  const handleResetView = useCallback(() => {
    setCanvasDataLocal((prev) => ({
      ...prev,
      viewport: { x: 0, y: 0, zoom: 1 },
    }));
  }, []);

  // Handle tool change - open dialogs for special tools
  const handleToolChange = useCallback((tool: string) => {
    if (tool === "diagram") {
      setShowMermaidDialog(true);
      // Don't change the tool, just open the dialog
      return;
    }
    setSelectedTool(tool);
  }, []);

  // Handle diagram insert from MermaidDialog
  const handleInsertDiagram = useCallback((
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
  ) => {
    // Offset nodes based on current viewport
    const offsetNodes = nodes.map((node) => ({
      ...node,
      x: node.x + canvasData.viewport.x + 100,
      y: node.y + canvasData.viewport.y + 100,
    })) as CanvasNode[];

    const typedEdges = edges as CanvasEdge[];

    setCanvasDataLocal((prev) => ({
      ...prev,
      nodes: [...prev.nodes, ...offsetNodes],
      edges: [...prev.edges, ...typedEdges],
    }));
    setIsDirty(true);
    console.log("[Canvas] Inserted diagram:", nodes.length, "nodes,", edges.length, "edges");
  }, [canvasData.viewport]);

  // Add content image to canvas
  const handleAddContentImage = useCallback((imageUrl: string, filename: string) => {
    const newNode: CanvasNode = {
      id: `img-${Date.now()}`,
      type: "image",
      x: canvasData.viewport.x + 100 + Math.random() * 200,
      y: canvasData.viewport.y + 100 + Math.random() * 200,
      width: 300,
      height: 300,
      content: imageUrl,
      style: {
        objectFit: "contain",
      },
    };

    setCanvasDataLocal((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));
    setIsDirty(true);
    console.log("[Canvas] Added content image:", filename);
  }, [canvasData.viewport]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show loading state while fetching canvases
  const isLoadingCanvases = canvases === undefined && user?.id;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4 gap-4">
            {view === "editor" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}

            <div className="flex-1 min-w-0">
              {view === "list" ? (
                <h1 className="text-lg font-semibold truncate">Design Canvas</h1>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold truncate">
                    {currentCanvas?.name || "Untitled Canvas"}
                  </h1>
                  {isDirty && (
                    <span className="text-xs text-muted-foreground">(unsaved)</span>
                  )}
                </div>
              )}
            </div>

            {view === "list" ? (
              <Button onClick={() => setShowNewCanvasDialog(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Canvas
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                {/* Zoom controls */}
                <div className="hidden sm:flex items-center gap-1 border rounded-lg p-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomOut}>
                    <ZoomOut className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-xs w-12 text-center">
                    {Math.round(canvasData.viewport.zoom * 100)}%
                  </span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomIn}>
                    <ZoomIn className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleResetView}>
                    <Maximize className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Content Images Browser toggle */}
                <Button
                  variant={showImageBrowser ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setShowImageBrowser(!showImageBrowser)}
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Content
                </Button>

                {/* AI Prompt Library toggle */}
                <Button
                  variant={showPromptLibrary ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setShowPromptLibrary(!showPromptLibrary)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Prompts
                </Button>

                {/* Save button */}
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={!isDirty}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Claw AI Voice Response Indicator */}
        <AnimatePresence>
          {(voiceChat.mode === 'speaking' || voiceResponse) && view === 'editor' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 left-1/2 -translate-x-1/2 z-50 max-w-md"
            >
              <div className="bg-background/95 backdrop-blur-sm border rounded-2xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-3">
                  {voiceChat.mode === 'speaking' && (
                    <div className="flex items-center gap-1">
                      {[0, 0.1, 0.2].map((delay, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-3 rounded-full bg-primary"
                          animate={{ scaleY: [1, 1.5, 1] }}
                          transition={{ duration: 0.4, repeat: Infinity, delay }}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-sm">{voiceResponse}</p>
                  {voiceChat.mode !== 'speaking' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => setVoiceResponse(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {view === "list" ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 md:p-6"
              >
                {isLoadingCanvases ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <CanvasList
                    canvases={(canvases || []).map((c) => ({
                      _id: c._id,
                      name: c.name,
                      description: c.description,
                      canvasType: c.canvasType,
                      status: c.status,
                      createdAt: c.createdAt,
                      updatedAt: c.updatedAt,
                    }))}
                    onSelect={(id) => handleSelectCanvas(id as string)}
                    onCreateNew={() => setShowNewCanvasDialog(true)}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex"
              >
                {/* Canvas */}
                <div className="flex-1 relative" style={{ height: "calc(100vh - 56px)" }}>
                  <InfiniteCanvas
                    data={canvasData}
                    onChange={handleCanvasChange}
                    selectedTool={selectedTool}
                    onToolChange={handleToolChange}
                    gridEnabled={true}
                    gridSize={20}
                    backgroundColor={undefined}
                  />

                  {/* Floating Tool Dock */}
                  <FloatingToolDock
                    selectedTool={selectedTool}
                    onToolChange={handleToolChange}
                  />
                </div>

                {/* Prompt Library Sidebar */}
                <AnimatePresence>
                  {showPromptLibrary && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 320, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="border-l bg-background overflow-hidden"
                    >
                      <PromptLibrary
                        onSelectPrompt={(prompt) => {
                          console.log("Selected prompt:", prompt);
                        }}
                        onClose={() => setShowPromptLibrary(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Content Images Browser */}
                <ImageBrowser
                  isOpen={showImageBrowser}
                  onClose={() => setShowImageBrowser(false)}
                  onSelectImage={handleAddContentImage}
                />

                {/* Mermaid/Diagram Dialog */}
                <MermaidDialog
                  open={showMermaidDialog}
                  onClose={() => setShowMermaidDialog(false)}
                  onInsert={handleInsertDiagram}
                  existingNodes={canvasData.nodes}
                  existingEdges={canvasData.edges}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* New Canvas Dialog */}
        {showNewCanvasDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background border rounded-xl shadow-2xl w-full max-w-md mx-4 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Create New Canvas</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowNewCanvasDialog(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Start with a blank canvas for infinite exploration
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Canvas Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={newCanvasName}
                    onChange={(e) => setNewCanvasName(e.target.value)}
                    placeholder="My awesome design..."
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Canvas Type
                  </label>
                  <select
                    id="type"
                    value={newCanvasType}
                    onChange={(e) => setNewCanvasType(e.target.value as CanvasType)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="freeform">Freeform - Open exploration</option>
                    <option value="wireframe">Wireframe - UI/UX design</option>
                    <option value="moodboard">Moodboard - Visual inspiration</option>
                    <option value="storyboard">Storyboard - Narrative planning</option>
                    <option value="mindmap">Mindmap - Concept mapping</option>
                    <option value="flowchart">Flowchart - Process diagrams</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowNewCanvasDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCanvas} disabled={!newCanvasName.trim()}>
                  Create Canvas
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export function CanvasClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <CanvasPageContent />
    </Suspense>
  );
}
