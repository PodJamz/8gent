"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, Download, Copy, Upload, Image, FileJson, Code2, Check, FileText } from "lucide-react";
import {
  serializeCanvas,
  deserializeCanvas,
  canvasToSVG,
  canvasToMermaid,
  type CanvasNodeData,
  type CanvasEdgeData,
  type DrawingElementData,
} from "@/lib/canvas/diagram-utils";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  canvasData: {
    nodes: CanvasNodeData[];
    edges: CanvasEdgeData[];
    drawingElements?: DrawingElementData[];
    viewport: { x: number; y: number; zoom: number };
  };
  canvasName?: string;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onImport?: (nodes: CanvasNodeData[], edges: CanvasEdgeData[], drawingElements?: DrawingElementData[]) => void;
}

type ExportFormat = "png" | "svg" | "json" | "mermaid";

export function ExportDialog({
  open,
  onClose,
  canvasData,
  canvasName = "Canvas",
  canvasRef,
  onImport,
}: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("png");
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [includeBackground, setIncludeBackground] = useState(true);
  const [scale, setScale] = useState(2);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formats: { id: ExportFormat; label: string; icon: typeof Image; description: string }[] = [
    { id: "png", label: "PNG Image", icon: Image, description: "Raster image for sharing" },
    { id: "svg", label: "SVG Vector", icon: Code2, description: "Scalable vector graphics" },
    { id: "json", label: "JSON Data", icon: FileJson, description: "Re-importable canvas data" },
    { id: "mermaid", label: "Mermaid", icon: FileText, description: "Mermaid diagram syntax" },
  ];

  // Export to PNG
  const exportPNG = useCallback(async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      const domToImage = (await import("dom-to-image-more")).default;
      const node = canvasRef.current;
      
      const blob = await domToImage.toBlob(node, {
        quality: 1.0,
        bgcolor: includeBackground ? undefined : "transparent",
        width: node.scrollWidth * scale,
        height: node.scrollHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        },
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${canvasName.replace(/\s+/g, "-").toLowerCase()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PNG export failed:", err);
    } finally {
      setIsExporting(false);
    }
  }, [canvasRef, canvasName, includeBackground, scale]);

  // Export to SVG
  const exportSVG = useCallback(() => {
    const svg = canvasToSVG(
      canvasData.nodes,
      canvasData.edges,
      canvasData.drawingElements,
      { background: includeBackground ? "#1a1a2e" : "transparent" }
    );

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${canvasName.replace(/\s+/g, "-").toLowerCase()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [canvasData, canvasName, includeBackground]);

  // Export to JSON
  const exportJSON = useCallback(() => {
    const json = serializeCanvas(
      canvasName,
      canvasData.nodes,
      canvasData.edges,
      canvasData.drawingElements || [],
      canvasData.viewport
    );

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${canvasName.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [canvasData, canvasName]);

  // Export to Mermaid
  const exportMermaid = useCallback(() => {
    const mermaid = canvasToMermaid(canvasData.nodes, canvasData.edges);
    const blob = new Blob([mermaid], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${canvasName.replace(/\s+/g, "-").toLowerCase()}.mmd`;
    a.click();
    URL.revokeObjectURL(url);
  }, [canvasData, canvasName]);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      let content = "";
      switch (format) {
        case "svg":
          content = canvasToSVG(canvasData.nodes, canvasData.edges, canvasData.drawingElements);
          break;
        case "json":
          content = serializeCanvas(canvasName, canvasData.nodes, canvasData.edges, canvasData.drawingElements || [], canvasData.viewport);
          break;
        case "mermaid":
          content = canvasToMermaid(canvasData.nodes, canvasData.edges);
          break;
        case "png":
          // For PNG, copy image to clipboard
          if (canvasRef.current) {
            const domToImage = (await import("dom-to-image-more")).default;
            const blob = await domToImage.toBlob(canvasRef.current, { quality: 1.0 });
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return;
          }
          break;
      }

      if (content) {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }, [format, canvasData, canvasName, canvasRef]);

  // Handle export
  const handleExport = useCallback(() => {
    switch (format) {
      case "png": exportPNG(); break;
      case "svg": exportSVG(); break;
      case "json": exportJSON(); break;
      case "mermaid": exportMermaid(); break;
    }
  }, [format, exportPNG, exportSVG, exportJSON, exportMermaid]);

  // Import JSON
  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = deserializeCanvas(content);
        if (data && onImport) {
          onImport(data.nodes, data.edges, data.drawingElements);
          onClose();
        } else {
          setImportError("Invalid canvas file format.");
        }
      } catch {
        setImportError("Failed to parse file.");
      }
    };
    reader.readAsText(file);
  }, [onImport, onClose]);

  // Preview content
  const getPreview = () => {
    switch (format) {
      case "mermaid":
        return canvasToMermaid(canvasData.nodes, canvasData.edges);
      case "json":
        return serializeCanvas(canvasName, canvasData.nodes, canvasData.edges, canvasData.drawingElements || [], canvasData.viewport).slice(0, 500) + "...";
      case "svg":
        return canvasToSVG(canvasData.nodes, canvasData.edges, canvasData.drawingElements).slice(0, 500) + "...";
      default:
        return `${canvasData.nodes.length} nodes, ${canvasData.edges.length} edges, ${canvasData.drawingElements?.length || 0} drawings`;
    }
  };

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
          className="w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Export / Import</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Close dialog">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Format selection */}
          <div className="grid grid-cols-2 gap-2 p-4">
            {formats.map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                  format === f.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border hover:border-border/80 hover:bg-muted/30"
                )}
              >
                <f.icon className={cn("w-5 h-5 shrink-0", format === f.id ? "text-primary" : "text-muted-foreground")} />
                <div>
                  <div className="text-sm font-medium">{f.label}</div>
                  <div className="text-xs text-muted-foreground">{f.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Options */}
          <div className="px-6 pb-4 space-y-3">
            {(format === "png" || format === "svg") && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={includeBackground}
                  onChange={(e) => setIncludeBackground(e.target.checked)}
                  className="rounded border-border"
                />
                Include background
              </label>
            )}
            {format === "png" && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Scale:</span>
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium transition-colors",
                      scale === s ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="mx-6 mb-4 p-3 bg-muted/30 rounded-lg border max-h-32 overflow-auto">
            <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-all">
              {getPreview()}
            </pre>
          </div>

          {/* Import error */}
          {importError && (
            <div className="mx-6 mb-4 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{importError}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="flex items-center gap-2">
              {onImport && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Import JSON
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg font-medium transition-colors",
                  isExporting
                    ? "bg-muted text-muted-foreground cursor-wait"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <Download className="w-3.5 h-3.5" />
                {isExporting ? "Exporting..." : "Export"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
