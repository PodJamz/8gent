"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  X,
  FolderOpen,
  Image as ImageIcon,
  RefreshCw,
  ChevronRight,
  Trash2,
} from "lucide-react";

interface ContentImage {
  filename: string;
  path: string;
  url?: string; // Blob URL if available
  size: number;
  modified: string;
}

interface ImageBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string, filename: string) => void;
}

const FOLDERS = [
  { id: "ep01/style-tests", label: "Style Tests" },
  { id: "ep01/frames", label: "Frames" },
  { id: "ep01/storyboard", label: "Storyboard" },
  { id: "ep01/characters", label: "Characters" },
];

export function ImageBrowser({
  isOpen,
  onClose,
  onSelectImage,
}: ImageBrowserProps) {
  const [images, setImages] = useState<ContentImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(FOLDERS[0].id);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (image: ContentImage, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete ${image.filename}?`)) return;

    setDeleting(image.filename);
    try {
      // Delete from blob if URL exists
      if (image.url) {
        await fetch("/api/blob/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: image.url }),
        });
      }
      // Delete local file
      await fetch(`/api/content-images/file?path=${encodeURIComponent(
        `${selectedFolder}/${image.filename}`
      )}`, { method: "DELETE" });

      // Remove from list
      setImages((prev) => prev.filter((i) => i.filename !== image.filename));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(null);
    }
  };

  const fetchImages = async (folder: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/content-images?folder=${encodeURIComponent(folder)}`
      );
      const data = await res.json();
      if (data.images) {
        setImages(data.images);
      } else {
        setError("No images found");
        setImages([]);
      }
    } catch (err) {
      setError("Failed to load images");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchImages(selectedFolder);
    }
  }, [isOpen, selectedFolder]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const formatName = (filename: string) => {
    // Clean up filenames like nick-pov-shoulders_1770576016454.png
    return filename
      .replace(/\.(png|jpg|jpeg|webp|gif)$/i, "")
      .replace(/_\d+$/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 bottom-0 w-80 bg-background/95 backdrop-blur-xl border-l shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Content Images</h2>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => fetchImages(selectedFolder)}
              >
                <RefreshCw
                  className={cn("h-4 w-4", loading && "animate-spin")}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Folder Selector */}
          <div className="p-3 border-b bg-muted/30">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <FolderOpen className="h-4 w-4" />
              <span>Folder</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {FOLDERS.map((folder) => (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  {folder.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className="flex-1 overflow-y-auto p-3">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-muted-foreground">
                {error}
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No images in this folder
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {images.map((image) => (
                  <motion.button
                    key={image.filename}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative aspect-square rounded-lg overflow-hidden border bg-muted/50 hover:border-primary transition-colors"
                    onClick={() => onSelectImage(image.url || image.path, image.filename)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url || image.path}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[10px] text-white truncate">
                        {formatName(image.filename)}
                      </p>
                      <p className="text-[8px] text-white/70">
                        {formatSize(image.size)}
                      </p>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => handleDelete(image, e)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                        disabled={deleting === image.filename}
                      >
                        {deleting === image.filename ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </button>
                      <div className="bg-primary text-primary-foreground rounded-full p-1">
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t bg-muted/30 text-xs text-muted-foreground text-center">
            Click an image to add it to the canvas
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
