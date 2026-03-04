"use client";

import { useRef, useState, useCallback, useEffect, MouseEvent, WheelEvent, TouchEvent, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Sparkles, Play, Pause, Volume2, Image, Video, Music, GitBranch, Trash2, Palette, Plus, Edit3, Copy, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Scissors, Clipboard, Lock, Unlock, ArrowUpToLine, ArrowDownToLine, MoreHorizontal, RefreshCw, Link, Maximize2 } from "lucide-react";
import { NODE_COLORS, NodeColor } from "@/lib/canvas/grid-system";
import { DeviceFrame } from "./nodes/DeviceFrame";
import { FlowNode, ArchNode } from "./nodes/FlowNodes";
import { VideoNode, type VideoCompositionData } from "./nodes/VideoNode";
import { TalkingVideoNode } from "./nodes/TalkingVideoNode";
import type { TalkingVideoStatus, SceneStyle } from "@/lib/talking-video/types";
import { ContextReferenceInput } from "@/components/ui/ContextReferenceInput";
import { ContextMenu, type ContextMenuPosition } from "./ContextMenu";
import { FormattingToolbar, type TextFormatting } from "./FormattingToolbar";
import { AudioBeatSyncNode, createAudioBeatSyncContent, type AudioBeatSyncContent } from "./nodes/AudioBeatSyncNode";

export interface CanvasNode {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  style?: Record<string, unknown>;
  mediaUrl?: string;
  mediaType?: "image" | "audio" | "video";
  locked?: boolean;
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface CanvasData {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  viewport: { x: number; y: number; zoom: number };
}

interface InfiniteCanvasProps {
  data: CanvasData;
  onChange: (data: CanvasData) => void;
  selectedTool: string;
  onToolChange?: (tool: string) => void;
  gridEnabled?: boolean;
  gridSize?: number;
  backgroundColor?: string;
  onVoicePrompt?: (transcript: string) => void;
}

// Keyboard shortcut mappings (matching FloatingToolDock)
const TOOL_SHORTCUTS: Record<string, string> = {
  v: "select",
  h: "pan",
  p: "pen",
  l: "connector",
  r: "rectangle",
  o: "ellipse",
  t: "text",
  s: "sticky",
  i: "image",
  k: "lock",
  e: "eraser",
  // Legacy shortcuts from previous toolbar
  m: "mindmap",
  d: "diagram",
  u: "audio",
  w: "video",
  c: "code",
  g: "ai",
};

export function InfiniteCanvas({
  data,
  onChange,
  selectedTool,
  onToolChange,
  gridEnabled = true,
  gridSize = 20,
  backgroundColor,
}: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Touch state for pinch-zoom
  const [touchState, setTouchState] = useState<{
    initialDistance: number;
    initialZoom: number;
    initialCenter: { x: number; y: number };
  } | null>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);

  // Double-tap detection for mobile
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(null);
  const DOUBLE_TAP_DELAY = 300; // ms

  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);

  // Formatting toolbar state (for text editing)
  const [textFormatting, setTextFormatting] = useState<TextFormatting>({});
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(false);
  const [formattingToolbarPosition, setFormattingToolbarPosition] = useState({ x: 0, y: 0 });

  // Transform mouse/touch position to canvas coordinates
  const toCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };

    const rect = container.getBoundingClientRect();
    const x = (clientX - rect.left - data.viewport.x) / data.viewport.zoom;
    const y = (clientY - rect.top - data.viewport.y) / data.viewport.zoom;
    return { x, y };
  }, [data.viewport]);

  // Add node at position
  const addNodeAtPosition = useCallback((x: number, y: number, type: string = "text") => {
    const nodeConfigs: Record<string, Partial<CanvasNode>> = {
      text: { type: "text", width: 200, height: 40, content: "Click to edit" },
      sticky: { type: "sticky", width: 180, height: 140, content: "New note", style: { fill: "#fef08a" } },
      mindmap: { type: "mindmap", width: 160, height: 60, content: "New idea", style: { fill: "#c4b5fd" } },
      shape: { type: "shape", width: 100, height: 100, content: "rectangle", style: { fill: "#3b82f6", stroke: "#1d4ed8" } },
      image: { type: "ai_generation", width: 200, height: 200, content: "Tap to generate with AI" },
      ai: { type: "ai_generation", width: 200, height: 200, content: "AI Generation" },
      audio: { type: "audio", width: 280, height: 80, content: "Audio node" },
      "audio-beat-sync": { type: "audio-beat-sync", width: 620, height: 500, content: JSON.stringify(createAudioBeatSyncContent()) },
      video: { type: "video", width: 320, height: 180, content: "Video node" },
      multimodal: { type: "multimodal", width: 280, height: 200, content: "Multi-modal node" },
      code: { type: "code", width: 300, height: 200, content: "// Code here" },
      // Flow nodes
      "flow-start": { type: "flow-start", width: 120, height: 50, content: "Start" },
      "flow-end": { type: "flow-end", width: 120, height: 50, content: "End" },
      "flow-process": { type: "flow-process", width: 160, height: 80, content: "Process" },
      "flow-decision": { type: "flow-decision", width: 120, height: 120, content: "Decision?" },
      // Architecture nodes
      "arch-service": { type: "arch-service", width: 140, height: 80, content: "Service" },
      "arch-database": { type: "arch-database", width: 100, height: 120, content: "Database" },
      // Device frame
      "device-frame": { type: "device-frame", width: 375, height: 812, content: "iPhone 14 Pro" },
    };

    const config = nodeConfigs[type] || nodeConfigs.text;
    const newNode: CanvasNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: x - (config.width || 200) / 2,
      y: y - (config.height || 40) / 2,
      ...config,
    } as CanvasNode;

    console.log("Adding node:", newNode);

    onChange({
      ...data,
      nodes: [...data.nodes, newNode],
    });

    setSelectedNodeId(newNode.id);
    return newNode.id;
  }, [data, onChange]);

  // Upload file to Vercel Blob and create node
  const uploadFileAndCreateNode = useCallback(async (
    file: File,
    x: number,
    y: number
  ) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/canvas/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Upload failed:", error);
        return;
      }

      const result = await response.json();
      const { url, mediaType } = result;

      // Determine node type and dimensions based on media type
      const nodeConfig: Partial<CanvasNode> = mediaType === "image"
        ? { type: "image", width: 300, height: 200, content: file.name }
        : mediaType === "audio"
        ? { type: "audio", width: 300, height: 100, content: file.name }
        : { type: "video", width: 400, height: 225, content: file.name };

      const newNode: CanvasNode = {
        id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: x - (nodeConfig.width || 200) / 2,
        y: y - (nodeConfig.height || 200) / 2,
        mediaUrl: url,
        mediaType,
        ...nodeConfig,
      } as CanvasNode;

      onChange({
        ...data,
        nodes: [...data.nodes, newNode],
      });

      setSelectedNodeId(newNode.id);
    } catch (error) {
      console.error("File upload error:", error);
    } finally {
      setIsUploading(false);
    }
  }, [data, onChange]);

  // Handle drag over for file drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragOver(true);
    }
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  // Handle file drop onto canvas
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const canvasCoords = toCanvasCoords(e.clientX, e.clientY);

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const offsetX = i * 20; // Stagger multiple files
      const offsetY = i * 20;
      await uploadFileAndCreateNode(file, canvasCoords.x + offsetX, canvasCoords.y + offsetY);
    }
  }, [toCanvasCoords, uploadFileAndCreateNode]);

  // Handle paste event for images and text
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      // Don't handle paste if we're in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const items = Array.from(e.clipboardData?.items || []);
      const container = containerRef.current;
      if (!container) return;

      // Get center of viewport for paste position
      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const canvasCoords = toCanvasCoords(rect.left + centerX, rect.top + centerY);

      // Check for image data first
      const imageItem = items.find(item => item.type.startsWith("image/"));
      if (imageItem) {
        e.preventDefault();
        const file = imageItem.getAsFile();
        if (file) {
          await uploadFileAndCreateNode(file, canvasCoords.x, canvasCoords.y);
        }
        return;
      }

      // Check for text data - create sticky note
      const textItem = items.find(item => item.type === "text/plain");
      if (textItem) {
        textItem.getAsString((text) => {
          if (text && text.trim()) {
            e.preventDefault();
            // Create sticky note with pasted text
            const newNode: CanvasNode = {
              id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: "sticky",
              x: canvasCoords.x - 90,
              y: canvasCoords.y - 70,
              width: 180,
              height: Math.min(140 + Math.floor(text.length / 50) * 20, 300),
              content: text.trim().substring(0, 500), // Limit text length
              style: { fill: "#fef08a" },
            };

            onChange({
              ...data,
              nodes: [...data.nodes, newNode],
            });

            setSelectedNodeId(newNode.id);
          }
        });
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [data, onChange, toCanvasCoords, uploadFileAndCreateNode]);

  // Calculate distance between two touch points
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Get center point of two touches
  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length < 2) return { x: touches[0].clientX, y: touches[0].clientY };
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  // Handle touch start with double-tap detection
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      setTouchState({
        initialDistance: distance,
        initialZoom: data.viewport.zoom,
        initialCenter: center,
      });
      lastTapRef.current = null; // Reset double-tap on multi-touch
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      const now = Date.now();

      // Check for double-tap
      if (lastTapRef.current) {
        const timeSinceLastTap = now - lastTapRef.current.time;
        const distance = Math.sqrt(
          Math.pow(touch.clientX - lastTapRef.current.x, 2) +
          Math.pow(touch.clientY - lastTapRef.current.y, 2)
        );

        // Double-tap detected (within time and distance threshold)
        if (timeSinceLastTap < DOUBLE_TAP_DELAY && distance < 50) {
          e.preventDefault();
          const target = e.target as HTMLElement;
          if (!target.closest('[data-node-id]')) {
            const canvasCoords = toCanvasCoords(touch.clientX, touch.clientY);
            addNodeAtPosition(canvasCoords.x, canvasCoords.y, "sticky");
          }
          lastTapRef.current = null;
          return;
        }
      }

      // Record this tap for potential double-tap
      lastTapRef.current = { time: now, x: touch.clientX, y: touch.clientY };

      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
      setPanStart({ x: touch.clientX - data.viewport.x, y: touch.clientY - data.viewport.y });
      setIsPanning(true);
    }
  }, [data.viewport, toCanvasCoords, addNodeAtPosition]);

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && touchState) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const scale = distance / touchState.initialDistance;
      // Higher minimum zoom (0.25) to prevent content disappearing
      const newZoom = Math.min(Math.max(touchState.initialZoom * scale, 0.25), 4);

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const center = getTouchCenter(e.touches);
      const centerX = center.x - rect.left;
      const centerY = center.y - rect.top;

      const zoomRatio = newZoom / data.viewport.zoom;
      let newX = centerX - (centerX - data.viewport.x) * zoomRatio;
      let newY = centerY - (centerY - data.viewport.y) * zoomRatio;

      // Clamp viewport to keep content in view
      const maxDrift = Math.max(rect.width, rect.height) * (2 / newZoom);
      newX = Math.max(-maxDrift, Math.min(maxDrift, newX));
      newY = Math.max(-maxDrift, Math.min(maxDrift, newY));

      onChange({
        ...data,
        viewport: { x: newX, y: newY, zoom: newZoom },
      });
    } else if (e.touches.length === 1 && isPanning) {
      const touch = e.touches[0];
      onChange({
        ...data,
        viewport: {
          ...data.viewport,
          x: touch.clientX - panStart.x,
          y: touch.clientY - panStart.y,
        },
      });
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
    }
  }, [touchState, isPanning, panStart, data, onChange]);

  // Handle touch end
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length === 0) {
      setTouchState(null);
      setIsPanning(false);
      lastTouchRef.current = null;
    } else if (e.touches.length === 1) {
      setTouchState(null);
      const touch = e.touches[0];
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
      setPanStart({ x: touch.clientX - data.viewport.x, y: touch.clientY - data.viewport.y });
    }
  }, [data.viewport]);

  // Handle mouse wheel for zoom - smooth and centered
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    // Use center of viewport for zoom anchor (more stable)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Much more gradual zoom (3% per tick instead of 10%)
    const zoomFactor = e.deltaY > 0 ? 0.97 : 1.03;
    // Higher minimum zoom (0.25) to prevent content from becoming too small
    const newZoom = Math.min(Math.max(data.viewport.zoom * zoomFactor, 0.25), 4);

    // If zoom didn't change, don't update
    if (newZoom === data.viewport.zoom) return;

    const zoomRatio = newZoom / data.viewport.zoom;
    let newX = centerX - (centerX - data.viewport.x) * zoomRatio;
    let newY = centerY - (centerY - data.viewport.y) * zoomRatio;

    // Clamp viewport to keep content reasonably centered
    // Prevent drifting too far from origin when zoomed out
    const maxDrift = Math.max(rect.width, rect.height) * (2 / newZoom);
    newX = Math.max(-maxDrift, Math.min(maxDrift, newX));
    newY = Math.max(-maxDrift, Math.min(maxDrift, newY));

    onChange({
      ...data,
      viewport: { x: newX, y: newY, zoom: newZoom },
    });
  }, [data, onChange]);

  // Handle pan start
  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Check if we clicked on a node
    const target = e.target as HTMLElement;
    if (target.closest('[data-node-id]')) {
      return; // Let node handle it
    }

    if (e.button === 1 || (e.button === 0 && (selectedTool === "pan" || e.shiftKey))) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - data.viewport.x, y: e.clientY - data.viewport.y });
      e.preventDefault();
    } else if (e.button === 0 && selectedTool === "select") {
      setSelectedNodeId(null);
    }
  }, [selectedTool, data.viewport]);

  // Handle pan move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      onChange({
        ...data,
        viewport: {
          ...data.viewport,
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        },
      });
    } else if (isDraggingNode && selectedNodeId) {
      const canvasCoords = toCanvasCoords(e.clientX, e.clientY);
      onChange({
        ...data,
        nodes: data.nodes.map((node) =>
          node.id === selectedNodeId
            ? { ...node, x: canvasCoords.x - dragOffset.x, y: canvasCoords.y - dragOffset.y }
            : node
        ),
      });
    }
  }, [isPanning, isDraggingNode, selectedNodeId, data, panStart, onChange, toCanvasCoords, dragOffset]);

  // Handle pan end
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setIsDraggingNode(false);
  }, []);

  // Handle context menu (right-click)
  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    const nodeElement = target.closest('[data-node-id]');

    if (nodeElement) {
      const nodeId = nodeElement.getAttribute('data-node-id');
      const node = data.nodes.find((n) => n.id === nodeId);
      if (node && nodeId) {
        setSelectedNodeId(nodeId);
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
          type: 'node',
          nodeId,
          nodeType: node.type,
        });
      }
    } else {
      setSelectedNodeId(null);
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        type: 'canvas',
      });
    }
  }, [data.nodes]);

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Context menu actions
  const handleCopyNode = useCallback(async () => {
    if (!selectedNodeId) return;
    const node = data.nodes.find((n) => n.id === selectedNodeId);
    if (node) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(node));
        console.log('[Canvas] Copied node to clipboard:', node.id);
      } catch (err) {
        console.error('[Canvas] Failed to copy:', err);
      }
    }
  }, [selectedNodeId, data.nodes]);

  const handleCutNode = useCallback(async () => {
    if (!selectedNodeId) return;
    const node = data.nodes.find((n) => n.id === selectedNodeId);
    if (node) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(node));
        console.log('[Canvas] Cut node to clipboard:', node.id);
        // Now delete the node
        onChange({
          ...data,
          nodes: data.nodes.filter((n) => n.id !== selectedNodeId),
          edges: data.edges.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId),
        });
        setSelectedNodeId(null);
      } catch (err) {
        console.error('[Canvas] Failed to cut:', err);
      }
    }
  }, [selectedNodeId, data, onChange]);

  const handleDeleteNode = useCallback(() => {
    if (!selectedNodeId) return;
    onChange({
      ...data,
      nodes: data.nodes.filter((n) => n.id !== selectedNodeId),
      edges: data.edges.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId),
    });
    setSelectedNodeId(null);
  }, [selectedNodeId, data, onChange]);

  const handleDuplicateNode = useCallback(() => {
    if (!selectedNodeId) return;
    const node = data.nodes.find((n) => n.id === selectedNodeId);
    if (node) {
      const newNode: CanvasNode = {
        ...node,
        id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: node.x + 20,
        y: node.y + 20,
      };
      onChange({
        ...data,
        nodes: [...data.nodes, newNode],
      });
      setSelectedNodeId(newNode.id);
    }
  }, [selectedNodeId, data, onChange]);

  const handleBringToFront = useCallback(() => {
    if (!selectedNodeId) return;
    const nodeIndex = data.nodes.findIndex((n) => n.id === selectedNodeId);
    if (nodeIndex === -1) return;
    const node = data.nodes[nodeIndex];
    const newNodes = [...data.nodes.filter((n) => n.id !== selectedNodeId), node];
    onChange({ ...data, nodes: newNodes });
  }, [selectedNodeId, data, onChange]);

  const handleSendToBack = useCallback(() => {
    if (!selectedNodeId) return;
    const nodeIndex = data.nodes.findIndex((n) => n.id === selectedNodeId);
    if (nodeIndex === -1) return;
    const node = data.nodes[nodeIndex];
    const newNodes = [node, ...data.nodes.filter((n) => n.id !== selectedNodeId)];
    onChange({ ...data, nodes: newNodes });
  }, [selectedNodeId, data, onChange]);

  const handleLockNode = useCallback(() => {
    if (!selectedNodeId) return;
    onChange({
      ...data,
      nodes: data.nodes.map((n) =>
        n.id === selectedNodeId ? { ...n, locked: !n.locked } : n
      ),
    });
  }, [selectedNodeId, data, onChange]);

  // Handle node mouse down
  const handleNodeMouseDown = useCallback((e: MouseEvent, nodeId: string) => {
    if (selectedTool === "select" || selectedTool === "pan") {
      e.stopPropagation();
      setSelectedNodeId(nodeId);

      const node = data.nodes.find((n) => n.id === nodeId);
      if (node && selectedTool === "select") {
        const canvasCoords = toCanvasCoords(e.clientX, e.clientY);
        setDragOffset({ x: canvasCoords.x - node.x, y: canvasCoords.y - node.y });
        setIsDraggingNode(true);
      }
    }
  }, [selectedTool, data.nodes, toCanvasCoords]);

  // Handle touch on node
  const handleNodeTouchStart = useCallback((e: TouchEvent<HTMLDivElement>, nodeId: string) => {
    if (e.touches.length === 1 && selectedTool === "select") {
      e.stopPropagation();
      setSelectedNodeId(nodeId);

      const touch = e.touches[0];
      const node = data.nodes.find((n) => n.id === nodeId);
      if (node) {
        const canvasCoords = toCanvasCoords(touch.clientX, touch.clientY);
        setDragOffset({ x: canvasCoords.x - node.x, y: canvasCoords.y - node.y });
        setIsDraggingNode(true);
      }
    }
  }, [selectedTool, data.nodes, toCanvasCoords]);

  // Handle double click to add nodes
  const handleDoubleClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Don't add if we double-clicked on a node
    const target = e.target as HTMLElement;
    if (target.closest('[data-node-id]')) {
      return;
    }

    const canvasCoords = toCanvasCoords(e.clientX, e.clientY);

    const toolToType: Record<string, string> = {
      select: "sticky",  // Default to sticky note on double-click
      pan: "sticky",
      text: "text",
      sticky: "sticky",
      mindmap: "mindmap",
      shape: "shape",
      rectangle: "shape",
      ellipse: "shape",
      image: "image",
      ai: "ai",
      audio: "audio",
      video: "video",
      code: "code",
      multimodal: "multimodal",
      pen: "sticky",  // Pen tool - creates sticky for now (drawing not yet implemented)
      connector: "sticky",  // Connector tool - TODO: implement edge creation
      eraser: "sticky",  // Eraser doesn't create nodes
    };

    // Don't create nodes for eraser tool
    if (selectedTool === "eraser") return;

    addNodeAtPosition(canvasCoords.x, canvasCoords.y, toolToType[selectedTool] || "sticky");
  }, [selectedTool, toCanvasCoords, addNodeAtPosition]);

  // Handle single click to add with certain tools
  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-node-id]')) {
      return;
    }

    // For certain tools, single click should add a node
    const singleClickTools = ["sticky", "mindmap", "shape", "rectangle", "ellipse", "image", "ai", "audio", "video", "code", "multimodal", "text"];
    if (singleClickTools.includes(selectedTool)) {
      const canvasCoords = toCanvasCoords(e.clientX, e.clientY);
      // Map rectangle/ellipse to shape type
      const nodeType = (selectedTool === "rectangle" || selectedTool === "ellipse") ? "shape" : selectedTool;
      addNodeAtPosition(canvasCoords.x, canvasCoords.y, nodeType);
    }
  }, [selectedTool, toCanvasCoords, addNodeAtPosition]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();

      // Tool shortcuts
      if (!e.ctrlKey && !e.metaKey && TOOL_SHORTCUTS[key]) {
        e.preventDefault();
        onToolChange?.(TOOL_SHORTCUTS[key]);
        return;
      }

      // Delete selected node
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNodeId) {
        e.preventDefault();
        onChange({
          ...data,
          nodes: data.nodes.filter((n) => n.id !== selectedNodeId),
          edges: data.edges.filter(
            (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId
          ),
        });
        setSelectedNodeId(null);
        return;
      }

      // Escape to deselect
      if (e.key === "Escape") {
        setSelectedNodeId(null);
        return;
      }

      // Ctrl/Cmd shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (key) {
          case "a":
            // Select all - select first node for now
            e.preventDefault();
            if (data.nodes.length > 0) {
              setSelectedNodeId(data.nodes[0].id);
            }
            break;
          case "d":
            // Duplicate selected node
            e.preventDefault();
            if (selectedNodeId) {
              const node = data.nodes.find((n) => n.id === selectedNodeId);
              if (node) {
                const newNode: CanvasNode = {
                  ...node,
                  id: `node-${Date.now()}`,
                  x: node.x + 20,
                  y: node.y + 20,
                };
                onChange({
                  ...data,
                  nodes: [...data.nodes, newNode],
                });
                setSelectedNodeId(newNode.id);
              }
            }
            break;
          case "0":
            // Reset zoom
            e.preventDefault();
            onChange({
              ...data,
              viewport: { x: 0, y: 0, zoom: 1 },
            });
            break;
          case "=":
          case "+":
            // Zoom in (10% - more gradual)
            e.preventDefault();
            onChange({
              ...data,
              viewport: { ...data.viewport, zoom: Math.min(data.viewport.zoom * 1.1, 4) },
            });
            break;
          case "-":
            // Zoom out (10% - more gradual, min 0.25)
            e.preventDefault();
            onChange({
              ...data,
              viewport: { ...data.viewport, zoom: Math.max(data.viewport.zoom / 1.1, 0.25) },
            });
            break;
        }
      }

      // Space for temporary pan mode
      if (e.code === "Space" && !isPanning) {
        e.preventDefault();
        onToolChange?.("pan");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Release space to go back to select
      if (e.code === "Space") {
        onToolChange?.("select");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedNodeId, data, onChange, onToolChange, isPanning]);

  // Attach touch and wheel listeners with { passive: false } to allow preventDefault
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use native event types and cast to React event types for handlers
    const wheelHandler = (e: globalThis.WheelEvent) => handleWheel(e as unknown as React.WheelEvent);
    const touchStartHandler = (e: globalThis.TouchEvent) => handleTouchStart(e as unknown as React.TouchEvent);
    const touchMoveHandler = (e: globalThis.TouchEvent) => handleTouchMove(e as unknown as React.TouchEvent);
    const touchEndHandler = (e: globalThis.TouchEvent) => handleTouchEnd(e as unknown as React.TouchEvent);

    container.addEventListener("wheel", wheelHandler, { passive: false });
    container.addEventListener("touchstart", touchStartHandler, { passive: false });
    container.addEventListener("touchmove", touchMoveHandler, { passive: false });
    container.addEventListener("touchend", touchEndHandler, { passive: false });

    return () => {
      container.removeEventListener("wheel", wheelHandler);
      container.removeEventListener("touchstart", touchStartHandler);
      container.removeEventListener("touchmove", touchMoveHandler);
      container.removeEventListener("touchend", touchEndHandler);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Generate grid pattern - subtle dot grid (the dots you know)
  const gridPattern = gridEnabled ? (
    <defs>
      <pattern
        id="grid"
        width={gridSize}
        height={gridSize}
        patternUnits="userSpaceOnUse"
      >
        <circle
          cx={gridSize / 2}
          cy={gridSize / 2}
          r={1}
          fill="rgba(150, 150, 150, 0.5)"
        />
      </pattern>
    </defs>
  ) : null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full overflow-hidden relative touch-none select-none",
        isPanning ? "cursor-grabbing" : selectedTool === "pan" ? "cursor-grab" : "cursor-crosshair",
        isDragOver && "ring-2 ring-primary ring-inset"
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ backgroundColor: backgroundColor || "hsl(var(--background))" }}
      tabIndex={0}
    >
      {/* Canvas content with transform */}
      <div
        className="absolute will-change-transform"
        style={{
          transform: `translate(${data.viewport.x}px, ${data.viewport.y}px) scale(${data.viewport.zoom})`,
          transformOrigin: "0 0",
          transition: isPanning || isDraggingNode ? "none" : "transform 0.1s ease-out",
          width: "10000px",
          height: "10000px",
          marginLeft: "-5000px",
          marginTop: "-5000px",
          pointerEvents: "none",
        }}
      >
        {/* Grid */}
        {gridEnabled && (
          <svg
            className="absolute inset-0 pointer-events-none"
            width="100%"
            height="100%"
          >
            {gridPattern}
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        )}

        {/* Edges */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ overflow: "visible" }}
        >
          {data.edges.map((edge) => {
            const sourceNode = data.nodes.find((n) => n.id === edge.source);
            const targetNode = data.nodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const x1 = sourceNode.x + sourceNode.width / 2 + 5000;
            const y1 = sourceNode.y + sourceNode.height / 2 + 5000;
            const x2 = targetNode.x + targetNode.width / 2 + 5000;
            const y2 = targetNode.y + targetNode.height / 2 + 5000;

            return (
              <line
                key={edge.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#6b7280"
                strokeWidth={2}
                markerEnd="url(#arrowhead)"
              />
            );
          })}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
            </marker>
          </defs>
        </svg>

        {/* Nodes - with pointer-events enabled */}
        <div className="absolute inset-0" style={{ pointerEvents: "auto" }}>
          {data.nodes.map((node) => (
            <CanvasNodeComponent
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              onTouchStart={(e) => handleNodeTouchStart(e, node.id)}
              onContentChange={(content) => {
                onChange({
                  ...data,
                  nodes: data.nodes.map((n) =>
                    n.id === node.id ? { ...n, content } : n
                  ),
                });
              }}
              onMediaChange={(mediaUrl, mediaType) => {
                onChange({
                  ...data,
                  nodes: data.nodes.map((n) =>
                    n.id === node.id ? { ...n, mediaUrl, mediaType } : n
                  ),
                });
              }}
            />
          ))}
        </div>
      </div>

      {/* Mobile-friendly info overlay */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto px-3 py-2 bg-background/80 backdrop-blur-sm rounded-lg text-xs text-muted-foreground border flex items-center justify-between sm:justify-start gap-4">
        <span>{data.nodes.length} nodes</span>
        <span className="hidden sm:inline">|</span>
        <span>{Math.round(data.viewport.zoom * 100)}%</span>
        <span className="sm:hidden text-muted-foreground/50">Pinch to zoom</span>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-4 right-4 hidden md:block px-3 py-2 bg-background/80 backdrop-blur-sm rounded-lg text-xs text-muted-foreground border">
        <div className="flex gap-3">
          <span><kbd className="px-1 bg-muted rounded">V</kbd> Select</span>
          <span><kbd className="px-1 bg-muted rounded">T</kbd> Text</span>
          <span><kbd className="px-1 bg-muted rounded">N</kbd> Sticky</span>
          <span><kbd className="px-1 bg-muted rounded">R</kbd> Shape</span>
          <span><kbd className="px-1 bg-muted rounded">G</kbd> AI</span>
          <span><kbd className="px-1 bg-muted rounded">Space</kbd> Pan</span>
        </div>
      </div>

      {/* Empty state - mobile optimized */}
      {data.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
          <div className="text-center text-muted-foreground max-w-xs">
            <div className="text-4xl mb-4 opacity-20">+</div>
            <p className="text-base font-medium mb-2">Start Creating</p>
            <p className="text-sm mb-1">Double-click or tap to add elements</p>
            <p className="text-sm mb-1">Scroll to zoom, drag to pan</p>
            <p className="text-sm text-muted-foreground/70">Press <kbd className="px-1 bg-muted rounded">G</kbd> for AI generation</p>
          </div>
        </div>
      )}

      {/* Floating Node Toolbar - appears above selected node */}
      <FloatingNodeToolbar
        node={selectedNodeId ? data.nodes.find(n => n.id === selectedNodeId) : undefined}
        viewport={data.viewport}
        containerRef={containerRef}
        onDelete={() => {
          if (selectedNodeId) {
            onChange({
              ...data,
              nodes: data.nodes.filter(n => n.id !== selectedNodeId),
              edges: data.edges.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId),
            });
            setSelectedNodeId(null);
          }
        }}
        onColorChange={(color) => {
          if (selectedNodeId) {
            onChange({
              ...data,
              nodes: data.nodes.map(n =>
                n.id === selectedNodeId
                  ? { ...n, style: { ...n.style, fill: color } }
                  : n
              ),
            });
          }
        }}
        onDuplicate={() => {
          if (selectedNodeId) {
            const node = data.nodes.find(n => n.id === selectedNodeId);
            if (node) {
              const newNode: CanvasNode = {
                ...node,
                id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                x: node.x + 30,
                y: node.y + 30,
              };
              onChange({
                ...data,
                nodes: [...data.nodes, newNode],
              });
              setSelectedNodeId(newNode.id);
            }
          }
        }}
        onAddBranch={(direction) => {
          if (selectedNodeId) {
            const parentNode = data.nodes.find(n => n.id === selectedNodeId);
            if (parentNode) {
              // Calculate offset based on direction
              const offsets: Record<string, { x: number; y: number }> = {
                right: { x: 200, y: 0 },
                left: { x: -200, y: 0 },
                up: { x: 0, y: -120 },
                down: { x: 0, y: 120 },
              };
              const offset = offsets[direction] || offsets.right;

              const newNode: CanvasNode = {
                id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: parentNode.type,
                x: parentNode.x + offset.x,
                y: parentNode.y + offset.y,
                width: parentNode.width,
                height: parentNode.height,
                content: "New branch",
                style: parentNode.style,
              };

              const newEdge: CanvasEdge = {
                id: `edge-${Date.now()}`,
                source: selectedNodeId,
                target: newNode.id,
                type: "default",
              };

              onChange({
                ...data,
                nodes: [...data.nodes, newNode],
                edges: [...data.edges, newEdge],
              });
              setSelectedNodeId(newNode.id);
            }
          }
        }}
        onEditContent={(nodeId) => {
          // Trigger edit mode for the node - this simulates a double-click
          const nodeEl = document.querySelector(`[data-node-id="${nodeId}"]`);
          if (nodeEl) {
            const event = new window.MouseEvent('dblclick', { bubbles: true });
            nodeEl.dispatchEvent(event);
          }
        }}
        onReplaceMedia={(nodeId) => {
          // This is handled by the file input in the toolbar
          console.log('[Canvas] Replace media for node:', nodeId);
        }}
        onCopy={handleCopyNode}
        onCut={handleCutNode}
        onLock={handleLockNode}
        onBringToFront={handleBringToFront}
        onSendToBack={handleSendToBack}
        isLocked={selectedNodeId ? data.nodes.find(n => n.id === selectedNodeId)?.locked : false}
      />

      {/* Drag overlay indicator */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/10 pointer-events-none flex items-center justify-center z-40"
          >
            <div className="bg-background/95 backdrop-blur-sm px-6 py-4 rounded-xl border-2 border-dashed border-primary">
              <p className="text-lg font-medium text-primary">Drop files to add to canvas</p>
              <p className="text-sm text-muted-foreground mt-1">Images, audio, or video</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload indicator */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg border shadow-lg flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Uploading...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context Menu */}
      <ContextMenu
        position={contextMenu}
        onClose={closeContextMenu}
        onAddNode={(type, x, y) => {
          const canvasCoords = toCanvasCoords(x, y);
          addNodeAtPosition(canvasCoords.x, canvasCoords.y, type);
        }}
        onCopy={handleCopyNode}
        onCut={handleCutNode}
        onPaste={() => {
          navigator.clipboard.readText().then((text) => {
            try {
              const node = JSON.parse(text);
              if (node && node.type) {
                const newNode = {
                  ...node,
                  id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  x: node.x + 20,
                  y: node.y + 20,
                };
                onChange({
                  ...data,
                  nodes: [...data.nodes, newNode],
                });
                setSelectedNodeId(newNode.id);
              }
            } catch {
              // Not a valid node JSON
            }
          });
        }}
        onDelete={handleDeleteNode}
        onDuplicate={handleDuplicateNode}
        onEdit={() => {
          if (selectedNodeId) {
            const nodeEl = document.querySelector(`[data-node-id="${selectedNodeId}"]`);
            if (nodeEl) {
              const event = new window.MouseEvent('dblclick', { bubbles: true });
              nodeEl.dispatchEvent(event);
            }
          }
        }}
        onBringToFront={handleBringToFront}
        onSendToBack={handleSendToBack}
        onZoomToFit={() => {
          // Reset zoom to fit all nodes
          onChange({
            ...data,
            viewport: { x: 0, y: 0, zoom: 1 },
          });
        }}
        onCenterView={() => {
          onChange({
            ...data,
            viewport: { ...data.viewport, x: 0, y: 0 },
          });
        }}
        onSelectAll={() => {
          // Select first node (multi-select not implemented yet)
          if (data.nodes.length > 0) {
            setSelectedNodeId(data.nodes[0].id);
          }
        }}
        canRegenerate={
          selectedNodeId
            ? data.nodes.find((n) => n.id === selectedNodeId)?.type === 'ai_generation'
            : false
        }
      />
    </div>
  );
}

// ============================================================================
// Floating Node Toolbar - Appears above selected node
// ============================================================================

interface FloatingNodeToolbarProps {
  node: CanvasNode | undefined;
  viewport: { x: number; y: number; zoom: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
  onDelete: () => void;
  onColorChange: (color: string) => void;
  onDuplicate: () => void;
  onAddBranch: (direction: 'right' | 'left' | 'up' | 'down') => void;
  onReplaceMedia?: (nodeId: string) => void;
  onEditContent?: (nodeId: string) => void;
  onCopy?: () => void;
  onCut?: () => void;
  onLock?: () => void;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
  onRegenerate?: () => void;
  isLocked?: boolean;
}

function FloatingNodeToolbar({
  node,
  viewport,
  containerRef,
  onDelete,
  onColorChange,
  onDuplicate,
  onAddBranch,
  onReplaceMedia,
  onEditContent,
  onCopy,
  onCut,
  onLock,
  onBringToFront,
  onSendToBack,
  onRegenerate,
  isLocked = false,
}: FloatingNodeToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBranchPicker, setShowBranchPicker] = useState(false);
  const [showArrangePicker, setShowArrangePicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close all menus
  const closeAllMenus = () => {
    setShowColorPicker(false);
    setShowBranchPicker(false);
    setShowArrangePicker(false);
    setShowMoreMenu(false);
  };

  if (!node) return null;

  // Determine which actions to show based on node type
  const isMediaNode = ['image', 'video', 'audio', 'ai', 'ai_generation'].includes(node.type);
  const isTextNode = ['text', 'sticky', 'code'].includes(node.type);
  const isAINode = node.type === 'ai_generation' || node.type === 'ai';

  // Calculate screen position from canvas coordinates
  const container = containerRef.current;
  if (!container) return null;

  const rect = container.getBoundingClientRect();

  // Node center in canvas space (with 5000px offset)
  const nodeCenterX = node.x + 5000 + node.width / 2;
  const nodeCenterY = node.y + 5000;

  // Transform to screen space
  const screenX = nodeCenterX * viewport.zoom + viewport.x;
  const screenY = nodeCenterY * viewport.zoom + viewport.y;

  // Position toolbar above the node with some padding
  const toolbarY = screenY - 60;

  // Keep toolbar within viewport bounds
  const clampedX = Math.max(100, Math.min(screenX, rect.width - 100));
  const clampedY = Math.max(50, toolbarY);

  // Available colors for the color picker
  const colorOptions = Object.entries(NODE_COLORS).slice(0, 6); // First 6 colors

  // Should we show branch controls? (for mindmap or sticky nodes)
  const showBranchControls = node.type === 'mindmap' || node.type === 'sticky';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute z-50 pointer-events-auto"
        style={{
          left: clampedX,
          top: clampedY,
          transform: 'translateX(-50%)',
        }}
      >
        <div className="flex items-center gap-1 px-2 py-1.5 bg-background/95 backdrop-blur-md rounded-xl shadow-lg border border-border/50">
          {/* Edit button for text/content nodes */}
          {isTextNode && (
            <button
              onClick={() => onEditContent?.(node.id)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Edit content"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          {/* Replace media button for media nodes */}
          {isMediaNode && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title={`Replace ${node.type}`}
              >
                {node.type === 'video' ? <Video className="w-4 h-4" /> :
                 node.type === 'audio' ? <Music className="w-4 h-4" /> :
                 <Image className="w-4 h-4" />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={
                  node.type === 'video' ? 'video/*' :
                  node.type === 'audio' ? 'audio/*' :
                  'image/*'
                }
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onReplaceMedia?.(node.id);
                  }
                }}
              />
            </>
          )}

          {/* Color picker - Expandable */}
          <div className="relative">
            <button
              onClick={() => {
                closeAllMenus();
                setShowColorPicker(!showColorPicker);
              }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Colors"
            >
              <Palette className="w-4 h-4" />
            </button>

            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-3 bg-background/95 backdrop-blur-md rounded-xl shadow-lg border z-10"
              >
                <p className="text-[10px] text-muted-foreground mb-2 font-medium">Colors</p>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(NODE_COLORS).map(([name, hex]) => (
                    <button
                      key={name}
                      onClick={() => {
                        onColorChange(hex);
                        setShowColorPicker(false);
                      }}
                      className="w-7 h-7 rounded-lg border-2 border-white/10 hover:scale-110 hover:border-white/30 transition-all"
                      style={{ backgroundColor: hex }}
                      title={name}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Copy */}
          <button
            onClick={() => { onCopy?.(); }}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Copy (⌘C)"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Duplicate */}
          <button
            onClick={onDuplicate}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Duplicate (⌘D)"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Regenerate for AI nodes */}
          {isAINode && (
            <button
              onClick={() => onRegenerate?.()}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Add branch (for mindmap/sticky) */}
          {showBranchControls && (
            <div className="relative">
              <button
                onClick={() => {
                  closeAllMenus();
                  setShowBranchPicker(!showBranchPicker);
                }}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Add branch"
              >
                <GitBranch className="w-4 h-4" />
              </button>

              {showBranchPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-2 bg-background/95 backdrop-blur-md rounded-xl shadow-lg border z-10"
                >
                  <p className="text-[10px] text-muted-foreground mb-2 font-medium text-center">Add Branch</p>
                  <div className="grid grid-cols-3 gap-1 w-20">
                    <div />
                    <button
                      onClick={() => { onAddBranch('up'); setShowBranchPicker(false); }}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <div />
                    <button
                      onClick={() => { onAddBranch('left'); setShowBranchPicker(false); }}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="w-6 h-6 rounded-lg bg-muted/50 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary/50" />
                    </div>
                    <button
                      onClick={() => { onAddBranch('right'); setShowBranchPicker(false); }}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div />
                    <button
                      onClick={() => { onAddBranch('down'); setShowBranchPicker(false); }}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div />
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Arrange menu - Expandable */}
          <div className="relative">
            <button
              onClick={() => {
                closeAllMenus();
                setShowArrangePicker(!showArrangePicker);
              }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Arrange"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {showArrangePicker && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-2 bg-background/95 backdrop-blur-md rounded-xl shadow-lg border z-10 min-w-[140px]"
              >
                <p className="text-[10px] text-muted-foreground mb-2 font-medium">Arrange</p>
                <div className="space-y-0.5">
                  <button
                    onClick={() => { onBringToFront?.(); setShowArrangePicker(false); }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-xs"
                  >
                    <ArrowUpToLine className="w-3.5 h-3.5" />
                    <span>Bring to Front</span>
                  </button>
                  <button
                    onClick={() => { onSendToBack?.(); setShowArrangePicker(false); }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-xs"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span>Send to Back</span>
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={() => { onLock?.(); setShowArrangePicker(false); }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-xs"
                  >
                    {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{isLocked ? 'Unlock' : 'Lock Position'}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* More menu - Expandable */}
          <div className="relative">
            <button
              onClick={() => {
                closeAllMenus();
                setShowMoreMenu(!showMoreMenu);
              }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute top-full right-0 mt-2 p-2 bg-background/95 backdrop-blur-md rounded-xl shadow-lg border z-10 min-w-[140px]"
              >
                <p className="text-[10px] text-muted-foreground mb-2 font-medium">More</p>
                <div className="space-y-0.5">
                  <button
                    onClick={() => { onCut?.(); setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-xs"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Cut</span>
                    <span className="ml-auto text-muted-foreground text-[10px]">⌘X</span>
                  </button>
                  <button
                    onClick={() => { onCopy?.(); setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                    <span className="ml-auto text-muted-foreground text-[10px]">⌘C</span>
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={() => { onEditContent?.(node.id); setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => { /* TODO: Add connection */ setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-xs"
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-border mx-0.5" />

          {/* Delete */}
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Delete (⌫)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================================
// Individual node component with multi-modal support
// ============================================================================

interface CanvasNodeComponentProps {
  node: CanvasNode;
  isSelected: boolean;
  onMouseDown: (e: MouseEvent) => void;
  onTouchStart: (e: TouchEvent<HTMLDivElement>) => void;
  onContentChange: (content: string) => void;
  onMediaChange: (mediaUrl: string, mediaType: "image" | "audio" | "video") => void;
}

function CanvasNodeComponent({
  node,
  isSelected,
  onMouseDown,
  onTouchStart,
  onContentChange,
}: CanvasNodeComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(node.content);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDoubleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (node.type === "text" || node.type === "sticky" || node.type === "code" || node.type === "multimodal") {
      setIsEditing(true);
      setEditContent(node.content);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editContent !== node.content) {
      onContentChange(editContent);
    }
  };

  const togglePlayback = () => {
    if (node.type === "audio" && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
    if (node.type === "video" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Position is relative to the 5000px offset
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: node.x + 5000,
    top: node.y + 5000,
    width: node.width,
    height: node.height,
    touchAction: "none",
  };

  if (node.type === "text") {
    return (
      <motion.div
        data-node-id={node.id}
        style={baseStyle}
        className={cn(
          "flex items-center justify-center rounded-lg px-3 py-2",
          "bg-background border shadow-sm cursor-move",
          isSelected && "ring-2 ring-primary ring-offset-2"
        )}
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
        onDoubleClick={handleDoubleClick as any}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isEditing ? (
          <ContextReferenceInput
            className="w-full bg-transparent text-center outline-none text-sm"
            value={editContent}
            onChange={setEditContent}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleBlur();
              e.stopPropagation();
            }}
            autoFocus
            placeholder="Type @ to reference..."
          />
        ) : (
          <span className="text-sm">{node.content}</span>
        )}
      </motion.div>
    );
  }

  if (node.type === "sticky") {
    const fill = (node.style?.fill as string) || "#fef08a";
    return (
      <motion.div
        data-node-id={node.id}
        style={{ ...baseStyle, backgroundColor: fill }}
        className={cn(
          "rounded-lg p-3 shadow-lg cursor-move",
          isSelected && "ring-2 ring-primary ring-offset-2"
        )}
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
        onDoubleClick={handleDoubleClick as any}
        whileHover={{ scale: 1.02, rotate: 1 }}
        whileTap={{ scale: 0.98 }}
      >
        {isEditing ? (
          <ContextReferenceInput
            className="w-full h-full bg-transparent resize-none outline-none text-sm text-gray-800"
            value={editContent}
            onChange={setEditContent}
            onKeyDown={(e) => e.stopPropagation()}
            multiline
            rows={4}
            autoFocus
            placeholder="Type @ to reference..."
          />
        ) : (
          <p className="text-sm whitespace-pre-wrap text-gray-800">{node.content}</p>
        )}
      </motion.div>
    );
  }

  if (node.type === "shape") {
    const fill = (node.style?.fill as string) || "#3b82f6";
    const stroke = (node.style?.stroke as string) || "#1d4ed8";
    return (
      <motion.div
        data-node-id={node.id}
        style={{ ...baseStyle, backgroundColor: fill, borderColor: stroke }}
        className={cn(
          "rounded-lg border-2 cursor-move",
          isSelected && "ring-2 ring-primary ring-offset-2"
        )}
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      />
    );
  }

  if (node.type === "ai_generation") {
    return (
      <motion.div
        data-node-id={node.id}
        style={baseStyle}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl cursor-move",
          "bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-2 border-dashed border-purple-500/30",
          isSelected && "ring-2 ring-purple-500 ring-offset-2"
        )}
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Sparkles className="h-8 w-8 text-purple-500/50 mb-2" />
        <span className="text-xs text-muted-foreground text-center px-2">
          {node.content}
        </span>
      </motion.div>
    );
  }

  if (node.type === "image") {
    return (
      <motion.div
        data-node-id={node.id}
        style={baseStyle}
        className={cn(
          "rounded-lg overflow-hidden cursor-move",
          isSelected && "ring-2 ring-primary ring-offset-2"
        )}
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {node.mediaUrl ? (
          <img
            src={node.mediaUrl}
            alt="Canvas image"
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Image className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </motion.div>
    );
  }

  // For basic audio nodes, convert them to use AudioBeatSyncNode for premium visualization
  if (node.type === "audio") {
    // Parse content to extract audio info
    let audioInfo: { audioUrl?: string; audioName?: string; title?: string; artist?: string } = {};
    try {
      if (typeof node.content === 'string' && node.content.startsWith('{')) {
        audioInfo = JSON.parse(node.content);
      }
    } catch {
      // Content is plain text
    }

    const audioUrl = node.mediaUrl || audioInfo.audioUrl;
    const audioName = audioInfo.audioName || audioInfo.title || (audioInfo.artist ? `${audioInfo.title} - ${audioInfo.artist}` : node.content);

    // Create AudioBeatSyncContent for premium visualization
    const beatSyncContent: AudioBeatSyncContent = {
      audioUrl,
      audioName: typeof audioName === 'string' ? audioName : 'Audio',
      analyzeStatus: 'idle',
      beats: [],
      sections: [],
      syncedNodes: [],
    };

    return (
      <div
        data-node-id={node.id}
        style={{
          ...baseStyle,
          width: Math.max(node.width, 500),
          height: Math.max(node.height, 380),
        }}
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
      >
        <AudioBeatSyncNode
          id={node.id}
          content={beatSyncContent}
          isSelected={isSelected}
          onContentChange={(newContent) => {
            onContentChange(JSON.stringify(newContent));
          }}
          width={Math.max(node.width, 500)}
          height={Math.max(node.height, 380)}
        />
      </div>
    );
  }

  // Audio Beat Sync Node - Beat detection and sync planning
  if (node.type === "audio-beat-sync") {
    let beatSyncContent: AudioBeatSyncContent;
    try {
      const parsed = typeof node.content === 'string'
        ? JSON.parse(node.content)
        : node.content as Record<string, unknown>;

      // Handle legacy format: { title, artist, sections: [{label, startTime, color}] }
      // Convert to new format: { audioName, analyzeStatus, beats, sections, syncedNodes }
      if (parsed && typeof parsed === 'object') {
        // Check if it's legacy format (has 'title' instead of 'audioName')
        const legacy = parsed as { title?: string; artist?: string; sections?: Array<{ label: string; startTime: number; color: string }> };
        if (legacy.title && !('analyzeStatus' in parsed)) {
          // Convert legacy sections to new Section format
          const convertedSections = (legacy.sections || []).map((s, i, arr) => ({
            type: s.label.toLowerCase().includes('intro') ? 'intro' as const :
                  s.label.toLowerCase().includes('verse') ? 'verse' as const :
                  s.label.toLowerCase().includes('chorus') ? 'chorus' as const :
                  s.label.toLowerCase().includes('bridge') ? 'bridge' as const :
                  s.label.toLowerCase().includes('outro') ? 'outro' as const : 'break' as const,
            startMs: (s.startTime || 0) * 1000,
            endMs: arr[i + 1] ? (arr[i + 1].startTime || 0) * 1000 : ((s.startTime || 0) + 30) * 1000,
            label: s.label,
            energy: 0.7,
          }));

          beatSyncContent = {
            audioUrl: parsed.audioUrl as string | undefined,
            audioName: `${legacy.title}${legacy.artist ? ` - ${legacy.artist}` : ''}`,
            analyzeStatus: 'complete',
            beats: [],
            sections: convertedSections,
            syncedNodes: [],
          };
        } else {
          // Already in new format or partial
          beatSyncContent = {
            audioUrl: parsed.audioUrl as string | undefined,
            audioName: parsed.audioName as string | undefined,
            analyzeStatus: (parsed.analyzeStatus as AudioBeatSyncContent['analyzeStatus']) || 'idle',
            beats: (parsed.beats as AudioBeatSyncContent['beats']) || [],
            sections: (parsed.sections as AudioBeatSyncContent['sections']) || [],
            syncedNodes: (parsed.syncedNodes as AudioBeatSyncContent['syncedNodes']) || [],
            bpm: parsed.bpm as number | undefined,
            key: parsed.key as string | undefined,
            timeSignature: parsed.timeSignature as string | undefined,
            waveformData: parsed.waveformData as number[] | undefined,
          };
        }
      } else {
        beatSyncContent = createAudioBeatSyncContent();
      }
    } catch {
      beatSyncContent = createAudioBeatSyncContent();
    }

    return (
      <motion.div
        data-node-id={node.id}
        style={baseStyle}
        className="cursor-move"
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
      >
        <AudioBeatSyncNode
          id={node.id}
          content={beatSyncContent}
          isSelected={isSelected}
          width={node.width}
          height={node.height}
          onContentChange={(newContent) => {
            onContentChange(JSON.stringify(newContent));
          }}
        />
      </motion.div>
    );
  }

  if (node.type === "video") {
    return (
      <motion.div
        data-node-id={node.id}
        style={baseStyle}
        className={cn(
          "rounded-xl overflow-hidden cursor-move",
          "bg-black",
          isSelected && "ring-2 ring-red-500 ring-offset-2"
        )}
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {node.mediaUrl ? (
          <video
            ref={videoRef}
            src={node.mediaUrl}
            className="w-full h-full object-cover"
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-white/50">
            <Video className="h-8 w-8 mb-2" />
            <span className="text-xs">{node.content}</span>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); togglePlayback(); }}
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
        >
          {isPlaying ? <Pause className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white" />}
        </button>
      </motion.div>
    );
  }

  // Remotion video composition
  if (node.type === "video-composition") {
    // Parse composition data from node.content (JSON string)
    let compositionData: VideoCompositionData | null = null;
    try {
      compositionData = JSON.parse(node.content) as VideoCompositionData;
    } catch {
      // Invalid composition data
    }

    if (!compositionData) {
      return (
        <motion.div
          data-node-id={node.id}
          style={baseStyle}
          className={cn(
            "rounded-xl overflow-hidden cursor-move",
            "bg-zinc-900 border border-red-500/50",
            isSelected && "ring-2 ring-red-500 ring-offset-2"
          )}
          onMouseDown={onMouseDown as React.MouseEventHandler}
          onTouchStart={onTouchStart as React.TouchEventHandler}
        >
          <div className="w-full h-full flex items-center justify-center text-red-400 text-sm">
            Invalid composition data
          </div>
        </motion.div>
      );
    }

    return (
      <div
        data-node-id={node.id}
        style={{
          ...baseStyle,
          pointerEvents: "auto",
        }}
        onMouseDown={onMouseDown as React.MouseEventHandler}
        onTouchStart={onTouchStart as React.TouchEventHandler}
      >
        <VideoNode
          composition={compositionData}
          isSelected={isSelected}
          width={node.width}
        />
      </div>
    );
  }

  // Talking video node (AI avatar videos)
  if (node.type === "talking-video") {
    // Parse talking video data from node.content (JSON string)
    interface TalkingVideoData {
      topic?: string;
      sourcePhotoUrl?: string;
      sceneStyle?: SceneStyle;
      status?: TalkingVideoStatus;
      script?: string;
      audioUrl?: string;
      finalVideoUrl?: string;
    }
    let talkingVideoData: TalkingVideoData = {};
    try {
      talkingVideoData = JSON.parse(node.content || "{}") as TalkingVideoData;
    } catch {
      // Use defaults
    }

    return (
      <div
        data-node-id={node.id}
        style={{
          ...baseStyle,
          pointerEvents: "auto",
        }}
        onMouseDown={onMouseDown as React.MouseEventHandler}
        onTouchStart={onTouchStart as React.TouchEventHandler}
      >
        <TalkingVideoNode
          topic={talkingVideoData.topic}
          sourcePhotoUrl={talkingVideoData.sourcePhotoUrl}
          sceneStyle={talkingVideoData.sceneStyle}
          status={talkingVideoData.status}
          script={talkingVideoData.script}
          audioUrl={talkingVideoData.audioUrl}
          finalVideoUrl={talkingVideoData.finalVideoUrl}
          isSelected={isSelected}
          width={node.width || 320}
        />
      </div>
    );
  }

  if (node.type === "code") {
    return (
      <motion.div
        data-node-id={node.id}
        style={baseStyle}
        className={cn(
          "rounded-xl overflow-hidden cursor-move",
          "bg-zinc-900 border border-zinc-700",
          isSelected && "ring-2 ring-blue-500 ring-offset-2"
        )}
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
        onDoubleClick={handleDoubleClick as any}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="px-3 py-1.5 bg-zinc-800 border-b border-zinc-700 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-zinc-400 ml-2">code</span>
        </div>
        {isEditing ? (
          <ContextReferenceInput
            className="w-full h-[calc(100%-32px)] p-3 bg-transparent resize-none outline-none text-sm font-mono text-green-400"
            value={editContent}
            onChange={setEditContent}
            onKeyDown={(e) => e.stopPropagation()}
            multiline
            rows={8}
            autoFocus
            placeholder="Type code or @ to reference..."
          />
        ) : (
          <pre className="p-3 text-sm font-mono text-green-400 overflow-auto h-[calc(100%-32px)]">
            <code>{node.content}</code>
          </pre>
        )}
      </motion.div>
    );
  }

  if (node.type === "multimodal") {
    return (
      <motion.div
        data-node-id={node.id}
        style={baseStyle}
        className={cn(
          "rounded-xl p-3 flex flex-col cursor-move",
          "bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/30",
          isSelected && "ring-2 ring-purple-500 ring-offset-2"
        )}
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
        onDoubleClick={handleDoubleClick as any}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex gap-1 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-500 text-xs">Multi-modal</span>
        </div>
        {isEditing ? (
          <ContextReferenceInput
            className="flex-1 bg-transparent resize-none outline-none text-sm"
            value={editContent}
            onChange={setEditContent}
            onKeyDown={(e) => e.stopPropagation()}
            multiline
            rows={4}
            autoFocus
            placeholder="Type @ to reference data..."
          />
        ) : (
          <p className="text-sm flex-1 whitespace-pre-wrap">{node.content}</p>
        )}
        <div className="flex gap-2 mt-2 pt-2 border-t border-purple-500/20">
          <button aria-label="Add image" title="Add image" className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
            <Image className="h-4 w-4 text-purple-500" />
          </button>
          <button aria-label="Add music" title="Add music" className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
            <Music className="h-4 w-4 text-purple-500" />
          </button>
          <button aria-label="Add video" title="Add video" className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
            <Video className="h-4 w-4 text-purple-500" />
          </button>
          <button aria-label="AI generate" title="AI generate" className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
            <Sparkles className="h-4 w-4 text-purple-500" />
          </button>
        </div>
      </motion.div>
    );
  }

  // Device Frame for UI Mockups
  if (node.type === "device-frame") {
    const content = typeof node.content === 'string' ? { title: node.content } : node.content as { title?: string };
    return (
      <motion.div
        data-node-id={node.id}
        style={{ ...baseStyle, background: 'transparent' }}
        className="cursor-move"
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
      >
        <DeviceFrame
          deviceType="iphone-15-pro"
          screenTitle={content?.title || 'Screen'}
          isSelected={isSelected}
          backgroundColor={(node.style?.fill as string) || '#1c1c1e'}
        />
      </motion.div>
    );
  }

  // Flow Diagram Nodes
  if (node.type.startsWith("flow-")) {
    const flowType = node.type as 'flow-start' | 'flow-end' | 'flow-decision' | 'flow-process' | 'flow-screen' | 'flow-data' | 'flow-subprocess';
    return (
      <motion.div
        data-node-id={node.id}
        style={{ ...baseStyle, background: 'transparent' }}
        className="cursor-move"
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
      >
        <FlowNode
          type={flowType}
          label={typeof node.content === 'string' ? node.content : 'Node'}
          isSelected={isSelected}
          width={node.width}
          height={node.height}
          style={{
            fill: node.style?.fill as string,
            stroke: node.style?.stroke as string,
          }}
        />
      </motion.div>
    );
  }

  // Architecture Diagram Nodes
  if (node.type.startsWith("arch-")) {
    const archType = node.type as 'arch-service' | 'arch-database' | 'arch-client' | 'arch-api' | 'arch-queue' | 'arch-cache' | 'arch-cdn' | 'arch-cloud';
    const content = typeof node.content === 'string' ? node.content : '';
    const metadata = node.style?.metadata as { description?: string } | undefined;
    return (
      <motion.div
        data-node-id={node.id}
        style={{ ...baseStyle, background: 'transparent' }}
        className="cursor-move"
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
      >
        <ArchNode
          type={archType}
          label={content}
          description={metadata?.description}
          isSelected={isSelected}
          width={node.width}
          height={node.height}
        />
      </motion.div>
    );
  }

  // iOS Component Nodes (for inside device frames)
  if (node.type.startsWith("ios-")) {
    const fill = (node.style?.fill as string) || '#ffffff20';
    return (
      <motion.div
        data-node-id={node.id}
        style={{ ...baseStyle, backgroundColor: fill }}
        className={cn(
          "rounded-xl p-2 flex items-center justify-center cursor-move",
          "backdrop-blur-sm border border-white/10",
          isSelected && "ring-2 ring-blue-500 ring-offset-2"
        )}
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-sm text-white/80">{node.content}</span>
      </motion.div>
    );
  }

  // Mindmap Node - for branching thought structures
  if (node.type === "mindmap") {
    const fill = (node.style?.fill as string) || "#c4b5fd";
    const hasConnections = true; // Could be determined by checking edges
    return (
      <motion.div
        data-node-id={node.id}
        style={{ ...baseStyle, backgroundColor: fill }}
        className={cn(
          "rounded-2xl p-3 shadow-lg cursor-move relative",
          "border-2 border-white/20",
          isSelected && "ring-2 ring-purple-500 ring-offset-2"
        )}
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
        onDoubleClick={handleDoubleClick as any}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Branch indicator */}
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center shadow-md">
          <GitBranch className="w-3 h-3 text-white" />
        </div>

        {isEditing ? (
          <ContextReferenceInput
            className="w-full h-full bg-transparent resize-none outline-none text-sm text-gray-800 font-medium"
            value={editContent}
            onChange={setEditContent}
            onKeyDown={(e) => e.stopPropagation()}
            multiline
            rows={2}
            autoFocus
            placeholder="Mind map node..."
          />
        ) : (
          <p className="text-sm font-medium whitespace-pre-wrap text-gray-800">{node.content}</p>
        )}
      </motion.div>
    );
  }

  // Default fallback
  return (
    <motion.div
      data-node-id={node.id}
      style={{ ...baseStyle, backgroundColor: "#e5e7eb" }}
      className={cn(
        "rounded-lg flex items-center justify-center cursor-move",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      onMouseDown={onMouseDown as any}
      onTouchStart={onTouchStart as any}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-xs text-muted-foreground">{node.type}</span>
    </motion.div>
  );
}
